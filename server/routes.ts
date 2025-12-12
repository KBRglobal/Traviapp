import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { Client } from "@replit/object-storage";
import OpenAI from "openai";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import {
  insertContentSchema,
  insertAttractionSchema,
  insertHotelSchema,
  insertArticleSchema,
  insertEventSchema,
  insertItinerarySchema,
  insertRssFeedSchema,
  insertAffiliateLinkSchema,
  insertMediaFileSchema,
  insertTopicBankSchema,
  insertKeywordRepositorySchema,
  insertTranslationSchema,
  insertUserSchema,
  insertHomepagePromotionSchema,
  ROLE_PERMISSIONS,
  SUPPORTED_LOCALES,
  type UserRole,
  type HomepageSection,
} from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";
import { 
  generateHotelContent, 
  generateAttractionContent, 
  generateArticleContent,
  generateContentImages,
  generateImagePrompt,
  generateImage,
  type GeneratedImage,
  type ImageGenerationOptions
} from "./ai-generator";

// Permission checking utilities
type PermissionKey = keyof typeof ROLE_PERMISSIONS.admin;

function hasPermission(role: UserRole, permission: PermissionKey): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions ? permissions[permission] : false;
}

// Authentication middleware - requires valid Replit Auth session
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = req.user as any;
  if (!req.isAuthenticated() || !user?.claims?.sub) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

function requirePermission(permission: PermissionKey) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as any;
    if (!req.isAuthenticated() || !user?.claims?.sub) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const dbUser = await storage.getUser(user.claims.sub);
    const userRole: UserRole = dbUser?.role || "viewer";
    if (!hasPermission(userRole, permission)) {
      return res.status(403).json({ 
        error: "Permission denied", 
        required: permission,
        currentRole: userRole 
      });
    }
    next();
  };
}

const upload = multer({ storage: multer.memoryStorage() });

let objectStorageClient: Client | null = null;

function getObjectStorageClient(): Client | null {
  if (!process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID) {
    return null;
  }
  if (!objectStorageClient) {
    objectStorageClient = new Client();
  }
  return objectStorageClient;
}

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new OpenAI({ 
    apiKey,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined,
  });
}

async function parseRssFeed(url: string): Promise<{ title: string; link: string; description: string; pubDate?: string }[]> {
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    const items: { title: string; link: string; description: string; pubDate?: string }[] = [];
    const itemMatches = text.match(/<item[^>]*>[\s\S]*?<\/item>/gi) || [];
    
    for (const itemXml of itemMatches) {
      const titleMatch = itemXml.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
      const linkMatch = itemXml.match(/<link[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i);
      const descMatch = itemXml.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i);
      const dateMatch = itemXml.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i);
      
      if (titleMatch && linkMatch) {
        items.push({
          title: titleMatch[1].trim().replace(/<!\[CDATA\[|\]\]>/g, ''),
          link: linkMatch[1].trim().replace(/<!\[CDATA\[|\]\]>/g, ''),
          description: descMatch ? descMatch[1].trim().replace(/<!\[CDATA\[|\]\]>/g, '').substring(0, 500) : '',
          pubDate: dateMatch ? dateMatch[1].trim() : undefined,
        });
      }
    }
    
    return items;
  } catch (error) {
    console.error("Error parsing RSS feed:", error);
    throw error;
  }
}

// Persist DALL-E image to object storage (DALL-E URLs expire in ~1 hour)
async function persistImageToStorage(imageUrl: string, filename: string): Promise<string | null> {
  const client = getObjectStorageClient();
  if (!client) {
    console.warn("Object storage not configured, cannot persist image");
    return null;
  }
  
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error(`Failed to fetch image: ${response.status}`);
      return null;
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const storagePath = `public/generated/${filename}`;
    await client.uploadFromBytes(storagePath, buffer);
    
    const baseUrl = process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : '';
    
    return `${baseUrl}/api/media/public/${encodeURIComponent(storagePath)}`;
  } catch (error) {
    console.error("Error persisting image to storage:", error);
    return null;
  }
}

// Validate and normalize AI-generated content blocks
interface ContentBlock {
  type: string;
  data: Record<string, unknown>;
}

function validateAndNormalizeBlocks(blocks: unknown[], title: string): ContentBlock[] {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return createDefaultBlocks(title);
  }
  
  const normalizedBlocks: ContentBlock[] = [];
  const blockTypes = new Set<string>();
  
  for (const block of blocks) {
    if (typeof block !== 'object' || !block) continue;
    const b = block as Record<string, unknown>;
    if (typeof b.type !== 'string' || !b.data) continue;
    
    const normalized = normalizeBlock(b.type, b.data as Record<string, unknown>);
    if (normalized) {
      normalizedBlocks.push(normalized);
      blockTypes.add(normalized.type);
    }
  }
  
  // Ensure required block types exist
  if (!blockTypes.has('hero')) {
    normalizedBlocks.unshift({
      type: 'hero',
      data: { title, subtitle: 'Discover Dubai Travel', overlayText: '' }
    });
  }
  
  if (!blockTypes.has('highlights')) {
    normalizedBlocks.push({
      type: 'highlights',
      data: { 
        title: 'Key Highlights',
        items: ['Key attraction feature', 'Unique experience offered', 'Must-see element', 'Popular activity', 'Essential stop', 'Notable landmark']
      }
    });
  }
  
  if (!blockTypes.has('tips')) {
    normalizedBlocks.push({
      type: 'tips',
      data: { 
        title: 'Expert Tips',
        tips: ['Plan your visit during cooler months', 'Book tickets in advance', 'Arrive early to avoid crowds', 'Bring comfortable walking shoes', 'Stay hydrated', 'Check dress codes beforehand', 'Consider guided tours for insights']
      }
    });
  }
  
  if (!blockTypes.has('faq')) {
    normalizedBlocks.push({
      type: 'faq',
      data: { 
        title: 'Frequently Asked Questions',
        faqs: [
          { question: 'What are the opening hours?', answer: 'Opening hours vary by season. Check the official website for current timings.' },
          { question: 'How much does entry cost?', answer: 'Pricing varies depending on the package selected. Visit the official website for current rates.' },
          { question: 'Is parking available?', answer: 'Yes, parking is available on-site for visitors.' },
          { question: 'Are there any accessibility options?', answer: 'Wheelchair access and accessibility services are available.' },
          { question: 'Can I bring food and drinks?', answer: 'Outside food may be restricted. Check venue policies before visiting.' }
        ]
      }
    });
  }
  
  if (!blockTypes.has('cta')) {
    normalizedBlocks.push({
      type: 'cta',
      data: { 
        title: 'Plan Your Visit',
        content: 'Ready to experience this amazing destination? Book your trip today!',
        buttonText: 'Book Now',
        buttonLink: '#'
      }
    });
  }
  
  return normalizedBlocks;
}

function normalizeBlock(type: string, data: Record<string, unknown>): ContentBlock | null {
  switch (type) {
    case 'hero':
      return { type, data };
      
    case 'text':
      return { type, data };
      
    case 'highlights':
      // Ensure items array exists with at least 4 items
      let items = data.items;
      if (!Array.isArray(items) || items.length < 4) {
        items = items && Array.isArray(items) ? items : [];
        while (items.length < 4) {
          items.push(`Key highlight ${items.length + 1}`);
        }
      }
      return { type, data: { ...data, items } };
      
    case 'tips':
      // Normalize tips array - accept "tips" or "items"
      let tips = data.tips || data.items;
      if (!Array.isArray(tips) || tips.length < 5) {
        tips = tips && Array.isArray(tips) ? tips : [];
        const defaultTips = ['Visit during off-peak hours', 'Book in advance', 'Wear comfortable clothing', 'Stay hydrated', 'Check local customs', 'Download offline maps', 'Carry local currency'];
        while (tips.length < 5) {
          tips.push(defaultTips[tips.length] || `Tip ${tips.length + 1}`);
        }
      }
      return { type, data: { ...data, tips } };
      
    case 'faq':
      // Normalize FAQ structure - accept "faqs" or "items"
      let faqs = data.faqs || data.items;
      if (!Array.isArray(faqs) || faqs.length < 3) {
        faqs = faqs && Array.isArray(faqs) ? faqs : [];
        const defaultFaqs = [
          { question: 'What is the best time to visit?', answer: 'The best time to visit is during the cooler months from November to March.' },
          { question: 'How do I get there?', answer: 'You can reach the destination via taxi, metro, or private transfer.' },
          { question: 'What should I wear?', answer: 'Dress modestly and wear comfortable shoes for walking.' }
        ];
        while (faqs.length < 3) {
          faqs.push(defaultFaqs[faqs.length] || { question: `Question ${faqs.length + 1}?`, answer: 'Please check with the venue for more details.' });
        }
      }
      // Ensure each FAQ has question and answer
      faqs = faqs.map((faq: unknown) => {
        if (typeof faq !== 'object' || !faq) return { question: 'Question?', answer: 'Answer pending.' };
        const f = faq as Record<string, unknown>;
        return {
          question: f.question || f.q || 'Question?',
          answer: f.answer || f.a || 'Answer pending.'
        };
      });
      return { type, data: { ...data, faqs } };
      
    case 'cta':
      return { type, data };
      
    case 'image':
    case 'gallery':
    case 'info_grid':
      return { type, data };
      
    default:
      return { type, data };
  }
}

function createDefaultBlocks(title: string): ContentBlock[] {
  return [
    { type: 'hero', data: { title, subtitle: 'Discover Dubai Travel', overlayText: '' } },
    { type: 'text', data: { heading: 'Overview', content: 'Content generation incomplete. Please edit this article to add more details.' } },
    { type: 'highlights', data: { title: 'Key Highlights', items: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5', 'Feature 6'] } },
    { type: 'tips', data: { title: 'Expert Tips', tips: ['Plan ahead', 'Book in advance', 'Visit early morning', 'Stay hydrated', 'Respect local customs', 'Bring camera', 'Check weather'] } },
    { type: 'faq', data: { title: 'FAQ', faqs: [
      { question: 'What are the opening hours?', answer: 'Check official website for current hours.' },
      { question: 'Is there parking?', answer: 'Yes, parking is available.' },
      { question: 'What should I bring?', answer: 'Comfortable shoes, sunscreen, and water.' }
    ] } },
    { type: 'cta', data: { title: 'Book Your Visit', content: 'Plan your trip today!', buttonText: 'Book Now', buttonLink: '#' } }
  ];
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use("/uploads", (await import("express")).default.static(uploadsDir));
  
  // Setup Replit Auth
  await setupAuth(app);
  
  // Get current authenticated user
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  // Get current user role and permissions
  app.get("/api/user/permissions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const userRole: UserRole = user?.role || "viewer";
      const permissions = ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS.viewer;
      res.json({ role: userRole, permissions });
    } catch (error) {
      console.error("Error fetching permissions:", error);
      res.status(500).json({ error: "Failed to fetch permissions" });
    }
  });

  // TOTP 2FA Routes
  
  // Get TOTP status for current user
  app.get("/api/totp/status", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ 
        totpEnabled: user.totpEnabled || false,
        hasSecret: !!user.totpSecret 
      });
    } catch (error) {
      console.error("Error fetching TOTP status:", error);
      res.status(500).json({ error: "Failed to fetch TOTP status" });
    }
  });

  // Setup TOTP - Generate secret and QR code
  app.post("/api/totp/setup", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Security: If TOTP is already enabled, require current code to reset
      if (user.totpEnabled && user.totpSecret) {
        const { currentCode } = req.body;
        if (!currentCode) {
          return res.status(400).json({ 
            error: "2FA is already enabled. Provide current code to reset.",
            requiresCurrentCode: true 
          });
        }
        const isValid = authenticator.verify({ token: currentCode, secret: user.totpSecret });
        if (!isValid) {
          return res.status(400).json({ error: "Invalid current verification code" });
        }
      }

      // Generate a new secret
      const secret = authenticator.generateSecret();
      
      // Create the otpauth URL for the authenticator app
      const email = user.email || "user";
      const otpauth = authenticator.keyuri(email, "Travi CMS", secret);
      
      // Generate QR code as data URL
      const qrCodeDataUrl = await QRCode.toDataURL(otpauth);
      
      // Store the secret temporarily (not enabled yet until verified)
      await storage.updateUser(userId, { totpSecret: secret, totpEnabled: false });
      
      // Only return QR code and otpauth URI, not raw secret (security best practice)
      res.json({ 
        qrCode: qrCodeDataUrl,
        otpauth
      });
    } catch (error) {
      console.error("Error setting up TOTP:", error);
      res.status(500).json({ error: "Failed to setup TOTP" });
    }
  });

  // Verify TOTP and enable 2FA
  app.post("/api/totp/verify", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { code } = req.body;
      
      if (!code || typeof code !== "string") {
        return res.status(400).json({ error: "Verification code is required" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!user.totpSecret) {
        return res.status(400).json({ error: "TOTP not set up. Please run setup first." });
      }

      // Verify the TOTP code
      const isValid = authenticator.verify({ token: code, secret: user.totpSecret });
      
      if (!isValid) {
        return res.status(400).json({ error: "Invalid verification code" });
      }

      // Enable TOTP for the user
      await storage.updateUser(userId, { totpEnabled: true });
      
      res.json({ success: true, message: "Two-factor authentication enabled" });
    } catch (error) {
      console.error("Error verifying TOTP:", error);
      res.status(500).json({ error: "Failed to verify TOTP" });
    }
  });

  // Disable TOTP
  app.post("/api/totp/disable", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { code } = req.body;
      
      if (!code || typeof code !== "string") {
        return res.status(400).json({ error: "Verification code is required" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!user.totpSecret || !user.totpEnabled) {
        return res.status(400).json({ error: "TOTP is not enabled" });
      }

      // Verify the TOTP code before disabling
      const isValid = authenticator.verify({ token: code, secret: user.totpSecret });
      
      if (!isValid) {
        return res.status(400).json({ error: "Invalid verification code" });
      }

      // Disable TOTP for the user
      await storage.updateUser(userId, { totpEnabled: false, totpSecret: null });
      
      res.json({ success: true, message: "Two-factor authentication disabled" });
    } catch (error) {
      console.error("Error disabling TOTP:", error);
      res.status(500).json({ error: "Failed to disable TOTP" });
    }
  });

  // Rate limiting for TOTP validation (in-memory, per-session)
  const totpAttempts = new Map<string, { count: number; lastAttempt: number }>();
  const MAX_TOTP_ATTEMPTS = 5;
  const TOTP_LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

  // Validate TOTP code (requires authenticated session - used after OIDC login)
  app.post("/api/totp/validate", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({ error: "Verification code is required" });
      }

      // Rate limiting check
      const now = Date.now();
      const attempts = totpAttempts.get(userId);
      if (attempts) {
        if (now - attempts.lastAttempt < TOTP_LOCKOUT_MS && attempts.count >= MAX_TOTP_ATTEMPTS) {
          const remainingMs = TOTP_LOCKOUT_MS - (now - attempts.lastAttempt);
          const remainingMin = Math.ceil(remainingMs / 60000);
          return res.status(429).json({ 
            error: `Too many failed attempts. Try again in ${remainingMin} minutes.`,
            retryAfterMs: remainingMs
          });
        }
        // Reset if lockout expired
        if (now - attempts.lastAttempt >= TOTP_LOCKOUT_MS) {
          totpAttempts.delete(userId);
        }
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!user.totpSecret || !user.totpEnabled) {
        return res.status(400).json({ error: "TOTP is not enabled for this user" });
      }

      // Verify the TOTP code
      const isValid = authenticator.verify({ token: code, secret: user.totpSecret });
      
      if (!isValid) {
        // Track failed attempt
        const current = totpAttempts.get(userId) || { count: 0, lastAttempt: now };
        totpAttempts.set(userId, { count: current.count + 1, lastAttempt: now });
        const remaining = MAX_TOTP_ATTEMPTS - current.count - 1;
        return res.status(400).json({ 
          error: "Invalid verification code",
          attemptsRemaining: Math.max(0, remaining)
        });
      }

      // Clear attempts on success
      totpAttempts.delete(userId);
      res.json({ success: true, valid: true });
    } catch (error) {
      console.error("Error validating TOTP:", error);
      res.status(500).json({ error: "Failed to validate TOTP" });
    }
  });

  // Audit logging helper
  async function logAuditEvent(
    req: Request,
    actionType: "create" | "update" | "delete" | "publish" | "unpublish" | "submit_for_review" | "approve" | "reject" | "login" | "logout" | "user_create" | "user_update" | "user_delete" | "role_change" | "settings_change" | "media_upload" | "media_delete",
    entityType: "content" | "user" | "media" | "settings" | "rss_feed" | "affiliate_link" | "translation" | "session",
    entityId: string | null,
    description: string,
    beforeState?: Record<string, unknown>,
    afterState?: Record<string, unknown>
  ) {
    try {
      const user = req.user as any;
      const userId = user?.claims?.sub;
      let userName = null;
      let userRole = null;
      
      if (userId) {
        const dbUser = await storage.getUser(userId);
        userName = dbUser ? `${dbUser.firstName || ''} ${dbUser.lastName || ''}`.trim() || dbUser.email : null;
        userRole = dbUser?.role || null;
      }
      
      await storage.createAuditLog({
        userId: userId || null,
        userName,
        userRole,
        actionType,
        entityType,
        entityId,
        description,
        beforeState,
        afterState,
        ipAddress: (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || null,
        userAgent: req.headers['user-agent'] || null,
      });
    } catch (error) {
      console.error("Failed to create audit log:", error);
    }
  }

  // Get all available roles (admin only)
  app.get("/api/roles", requirePermission("canManageUsers"), async (req, res) => {
    res.json({
      roles: ["admin", "editor", "author", "contributor", "viewer"],
      permissions: ROLE_PERMISSIONS,
    });
  });

  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Helper to strip sensitive fields for public/anonymous access
  function sanitizeContentForPublic(content: any) {
    if (!content) return content;
    const { affiliateLinks, translations, author, ...publicContent } = content;
    // Only include safe author info
    if (author) {
      publicContent.author = { 
        firstName: author.firstName, 
        lastName: author.lastName 
      };
    }
    return publicContent;
  }

  // Admin/CMS content list - requires authentication
  app.get("/api/contents", requireAuth, async (req, res) => {
    try {
      const { type, status, search } = req.query;
      const filters = {
        type: type as string | undefined,
        status: status as string | undefined,
        search: search as string | undefined,
      };
      
      // Always include relations (author, type-specific extensions) for consistency
      const contents = await storage.getContentsWithRelations(filters);
      res.json(contents);
    } catch (error) {
      console.error("Error fetching contents:", error);
      res.status(500).json({ error: "Failed to fetch contents" });
    }
  });

  // Admin/CMS content by ID - requires authentication for non-published content
  app.get("/api/contents/:id", async (req, res) => {
    try {
      const content = await storage.getContent(req.params.id);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      // Check if user is authenticated
      const user = req.user as any;
      const isAuthenticated = req.isAuthenticated() && user?.claims?.sub;
      
      // Non-published content requires authentication
      if (content.status !== "published" && !isAuthenticated) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      // Return full content for authenticated users, sanitized for public
      if (isAuthenticated) {
        res.json(content);
      } else {
        res.json(sanitizeContentForPublic(content));
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  // Public content by slug - only returns published content, sanitized
  app.get("/api/contents/slug/:slug", async (req, res) => {
    try {
      const content = await storage.getContentBySlug(req.params.slug);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      // Check if user is authenticated
      const user = req.user as any;
      const isAuthenticated = req.isAuthenticated() && user?.claims?.sub;
      
      // Non-published content requires authentication
      if (content.status !== "published" && !isAuthenticated) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      // Return full content for authenticated users, sanitized for public
      if (isAuthenticated) {
        res.json(content);
      } else {
        res.json(sanitizeContentForPublic(content));
      }
    } catch (error) {
      console.error("Error fetching content by slug:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  // Public API for published content only (for public website)
  app.get("/api/public/contents", async (req, res) => {
    try {
      const { type, search, limit } = req.query;
      const filters = {
        type: type as string | undefined,
        status: "published", // Only published content
        search: search as string | undefined,
      };
      
      const contents = await storage.getContentsWithRelations(filters);
      // Limit and sanitize for public consumption
      const maxLimit = Math.min(parseInt(limit as string) || 50, 100);
      const sanitizedContents = contents.slice(0, maxLimit).map(sanitizeContentForPublic);
      res.json(sanitizedContents);
    } catch (error) {
      console.error("Error fetching public contents:", error);
      res.status(500).json({ error: "Failed to fetch contents" });
    }
  });

  app.post("/api/contents", requirePermission("canCreate"), async (req, res) => {
    try {
      const parsed = insertContentSchema.parse(req.body);
      
      // Generate fallback slug if empty to prevent unique constraint violation
      if (!parsed.slug || parsed.slug.trim() === '') {
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        parsed.slug = `draft-${parsed.type}-${timestamp}-${randomSuffix}`;
      }
      
      // Generate fallback title if empty
      if (!parsed.title || parsed.title.trim() === '') {
        parsed.title = `Untitled ${parsed.type} Draft`;
      }
      
      const content = await storage.createContent(parsed);

      if (parsed.type === "attraction" && req.body.attraction) {
        await storage.createAttraction({ ...req.body.attraction, contentId: content.id });
      } else if (parsed.type === "hotel" && req.body.hotel) {
        await storage.createHotel({ ...req.body.hotel, contentId: content.id });
      } else if (parsed.type === "article" && req.body.article) {
        await storage.createArticle({ ...req.body.article, contentId: content.id });
      } else if (parsed.type === "event" && req.body.event) {
        await storage.createEvent({ ...req.body.event, contentId: content.id });
      } else if (parsed.type === "itinerary" && req.body.itinerary) {
        const itineraryData = insertItinerarySchema.omit({ contentId: true }).parse(req.body.itinerary);
        await storage.createItinerary({ ...itineraryData, contentId: content.id });
      } else {
        if (parsed.type === "attraction") {
          await storage.createAttraction({ contentId: content.id });
        } else if (parsed.type === "hotel") {
          await storage.createHotel({ contentId: content.id });
        } else if (parsed.type === "article") {
          await storage.createArticle({ contentId: content.id });
        } else if (parsed.type === "event") {
          await storage.createEvent({ contentId: content.id });
        } else if (parsed.type === "itinerary") {
          await storage.createItinerary({ contentId: content.id });
        }
      }

      const fullContent = await storage.getContent(content.id);
      
      // Audit log content creation
      await logAuditEvent(req, "create", "content", content.id, `Created ${parsed.type}: ${parsed.title}`, undefined, { title: parsed.title, type: parsed.type, status: parsed.status || "draft" });
      
      res.status(201).json(fullContent);
    } catch (error) {
      console.error("Error creating content:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create content" });
    }
  });

  app.patch("/api/contents/:id", requirePermission("canEdit"), async (req, res) => {
    try {
      const existingContent = await storage.getContent(req.params.id);
      if (!existingContent) {
        return res.status(404).json({ error: "Content not found" });
      }

      // Check canPublish permission if changing status to published
      if (req.body.status === "published" && existingContent.status !== "published") {
        const user = req.user as any;
        const dbUser = await storage.getUser(user?.claims?.sub);
        const userRole: UserRole = dbUser?.role || "viewer";
        if (!hasPermission(userRole, "canPublish")) {
          return res.status(403).json({ 
            error: "You don't have permission to publish content. Only administrators can publish.",
            required: "canPublish",
            currentRole: userRole 
          });
        }
      }

      // Auto-create version before update
      const latestVersion = await storage.getLatestVersionNumber(req.params.id);
      await storage.createContentVersion({
        contentId: req.params.id,
        versionNumber: latestVersion + 1,
        title: existingContent.title,
        blocks: existingContent.blocks || [],
        metaDescription: existingContent.metaDescription,
        changedBy: req.body.changedBy || null,
        changeNote: req.body.changeNote || null,
      });

      const { attraction, hotel, article, event, itinerary, changedBy, changeNote, ...contentData } = req.body;
      
      const updatedContent = await storage.updateContent(req.params.id, contentData);

      if (existingContent.type === "attraction" && attraction) {
        await storage.updateAttraction(req.params.id, attraction);
      } else if (existingContent.type === "hotel" && hotel) {
        await storage.updateHotel(req.params.id, hotel);
      } else if (existingContent.type === "article" && article) {
        await storage.updateArticle(req.params.id, article);
      } else if (existingContent.type === "event" && req.body.event) {
        await storage.updateEvent(req.params.id, req.body.event);
      } else if (existingContent.type === "itinerary" && itinerary) {
        await storage.updateItinerary(req.params.id, itinerary);
      }

      const fullContent = await storage.getContent(req.params.id);
      
      // Audit log content update
      const actionType = req.body.status === "published" && existingContent.status !== "published" ? "publish" : "update";
      await logAuditEvent(req, actionType, "content", req.params.id, 
        actionType === "publish" ? `Published: ${existingContent.title}` : `Updated: ${existingContent.title}`,
        { title: existingContent.title, status: existingContent.status },
        { title: fullContent?.title, status: fullContent?.status }
      );
      
      res.json(fullContent);
    } catch (error) {
      console.error("Error updating content:", error);
      res.status(500).json({ error: "Failed to update content" });
    }
  });

  // Content Version History Routes
  app.get("/api/contents/:id/versions", async (req, res) => {
    try {
      const content = await storage.getContent(req.params.id);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      const versions = await storage.getContentVersions(req.params.id);
      res.json(versions);
    } catch (error) {
      console.error("Error fetching content versions:", error);
      res.status(500).json({ error: "Failed to fetch content versions" });
    }
  });

  app.get("/api/contents/:id/versions/:versionId", async (req, res) => {
    try {
      const version = await storage.getContentVersion(req.params.versionId);
      if (!version) {
        return res.status(404).json({ error: "Version not found" });
      }
      res.json(version);
    } catch (error) {
      console.error("Error fetching content version:", error);
      res.status(500).json({ error: "Failed to fetch content version" });
    }
  });

  // Localization Routes
  app.get("/api/locales", (req, res) => {
    res.json(SUPPORTED_LOCALES);
  });

  app.get("/api/contents/:id/translations", async (req, res) => {
    try {
      const content = await storage.getContent(req.params.id);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      const translations = await storage.getTranslationsByContentId(req.params.id);
      res.json(translations);
    } catch (error) {
      console.error("Error fetching translations:", error);
      res.status(500).json({ error: "Failed to fetch translations" });
    }
  });

  app.get("/api/translations/:id", async (req, res) => {
    try {
      const translation = await storage.getTranslation(req.params.id);
      if (!translation) {
        return res.status(404).json({ error: "Translation not found" });
      }
      res.json(translation);
    } catch (error) {
      console.error("Error fetching translation:", error);
      res.status(500).json({ error: "Failed to fetch translation" });
    }
  });

  app.post("/api/contents/:id/translations", requirePermission("canCreate"), async (req, res) => {
    try {
      const content = await storage.getContent(req.params.id);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      const parsed = insertTranslationSchema.parse({ ...req.body, contentId: req.params.id });
      const translation = await storage.createTranslation(parsed);
      res.status(201).json(translation);
    } catch (error) {
      console.error("Error creating translation:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create translation" });
    }
  });

  const updateTranslationSchema = z.object({
    status: z.enum(["pending", "in_progress", "completed", "needs_review"]).optional(),
    title: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    blocks: z.array(z.any()).optional(),
    translatedBy: z.string().optional(),
    reviewedBy: z.string().optional(),
  });

  app.patch("/api/translations/:id", requirePermission("canEdit"), async (req, res) => {
    try {
      const parsed = updateTranslationSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Validation error", details: parsed.error.errors });
      }
      const translation = await storage.updateTranslation(req.params.id, parsed.data);
      if (!translation) {
        return res.status(404).json({ error: "Translation not found" });
      }
      res.json(translation);
    } catch (error) {
      console.error("Error updating translation:", error);
      res.status(500).json({ error: "Failed to update translation" });
    }
  });

  app.delete("/api/translations/:id", requirePermission("canDelete"), async (req, res) => {
    try {
      await storage.deleteTranslation(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting translation:", error);
      res.status(500).json({ error: "Failed to delete translation" });
    }
  });

  app.delete("/api/contents/:id", requirePermission("canDelete"), async (req, res) => {
    try {
      const existingContent = await storage.getContent(req.params.id);
      await storage.deleteContent(req.params.id);
      
      // Audit log content deletion
      if (existingContent) {
        await logAuditEvent(req, "delete", "content", req.params.id, `Deleted: ${existingContent.title}`, { title: existingContent.title, type: existingContent.type });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting content:", error);
      res.status(500).json({ error: "Failed to delete content" });
    }
  });

  app.get("/api/rss-feeds", async (req, res) => {
    try {
      const feeds = await storage.getRssFeeds();
      res.json(feeds);
    } catch (error) {
      console.error("Error fetching RSS feeds:", error);
      res.status(500).json({ error: "Failed to fetch RSS feeds" });
    }
  });

  app.get("/api/rss-feeds/:id", async (req, res) => {
    try {
      const feed = await storage.getRssFeed(req.params.id);
      if (!feed) {
        return res.status(404).json({ error: "RSS feed not found" });
      }
      res.json(feed);
    } catch (error) {
      console.error("Error fetching RSS feed:", error);
      res.status(500).json({ error: "Failed to fetch RSS feed" });
    }
  });

  app.post("/api/rss-feeds", requirePermission("canCreate"), async (req, res) => {
    try {
      const parsed = insertRssFeedSchema.parse(req.body);
      const feed = await storage.createRssFeed(parsed);
      res.status(201).json(feed);
    } catch (error) {
      console.error("Error creating RSS feed:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create RSS feed" });
    }
  });

  app.patch("/api/rss-feeds/:id", requirePermission("canEdit"), async (req, res) => {
    try {
      const feed = await storage.updateRssFeed(req.params.id, req.body);
      if (!feed) {
        return res.status(404).json({ error: "RSS feed not found" });
      }
      res.json(feed);
    } catch (error) {
      console.error("Error updating RSS feed:", error);
      res.status(500).json({ error: "Failed to update RSS feed" });
    }
  });

  app.delete("/api/rss-feeds/:id", requirePermission("canDelete"), async (req, res) => {
    try {
      await storage.deleteRssFeed(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting RSS feed:", error);
      res.status(500).json({ error: "Failed to delete RSS feed" });
    }
  });

  app.post("/api/rss-feeds/:id/fetch", requirePermission("canCreate"), async (req, res) => {
    try {
      const feed = await storage.getRssFeed(req.params.id);
      if (!feed) {
        return res.status(404).json({ error: "RSS feed not found" });
      }

      const items = await parseRssFeed(feed.url);
      
      await storage.updateRssFeed(req.params.id, {
        lastFetched: new Date(),
        itemCount: items.length,
      });

      res.json({ items, count: items.length });
    } catch (error) {
      console.error("Error fetching RSS feed items:", error);
      res.status(500).json({ error: "Failed to fetch RSS feed items" });
    }
  });

  const rssImportItemSchema = z.object({
    title: z.string().min(1).max(500),
    link: z.string().url().optional(),
    description: z.string().max(5000).optional(),
    pubDate: z.string().optional(),
  });

  const rssImportSchema = z.object({
    items: z.array(rssImportItemSchema).min(1).max(50),
  });

  // Helper function to generate content fingerprint from title and URL
  function generateFingerprint(title: string, url?: string): string {
    const normalized = `${title.toLowerCase().trim()}|${(url || '').toLowerCase().trim()}`;
    // Simple hash function for fingerprinting
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      const char = normalized.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `fp_${Math.abs(hash).toString(36)}`;
  }

  app.post("/api/rss-feeds/:id/import", requirePermission("canCreate"), async (req, res) => {
    try {
      const feed = await storage.getRssFeed(req.params.id);
      if (!feed) {
        return res.status(404).json({ error: "RSS feed not found" });
      }

      const parsed = rssImportSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid import data", details: parsed.error.errors });
      }

      const { items } = parsed.data;
      
      // Generate fingerprints for all items
      const itemsWithFingerprints = items.map(item => ({
        ...item,
        fingerprint: generateFingerprint(item.title, item.link)
      }));
      
      // Check for existing duplicates in database
      const fingerprints = itemsWithFingerprints.map(i => i.fingerprint);
      const existingFingerprints = await storage.checkDuplicateFingerprints(fingerprints);
      const existingFingerprintSet = new Set(existingFingerprints.map(fp => fp.fingerprint));
      
      // Separate duplicates from new items, also track in-batch duplicates
      const duplicates: { title: string; link?: string; existingContentId?: string | null; reason: string }[] = [];
      const newItems: typeof itemsWithFingerprints = [];
      const seenInBatch = new Set<string>();
      
      for (const item of itemsWithFingerprints) {
        if (existingFingerprintSet.has(item.fingerprint)) {
          const existing = existingFingerprints.find(fp => fp.fingerprint === item.fingerprint);
          duplicates.push({
            title: item.title,
            link: item.link,
            existingContentId: existing?.contentId,
            reason: "already_imported"
          });
        } else if (seenInBatch.has(item.fingerprint)) {
          duplicates.push({
            title: item.title,
            link: item.link,
            existingContentId: null,
            reason: "duplicate_in_batch"
          });
        } else {
          seenInBatch.add(item.fingerprint);
          newItems.push(item);
        }
      }

      const createdContents = [];
      for (const item of newItems) {
        const slug = item.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

        const content = await storage.createContent({
          title: item.title,
          slug: `${slug}-${Date.now()}`,
          type: "article",
          status: "draft",
          metaDescription: item.description?.substring(0, 160) || null,
          blocks: [
            {
              type: "text",
              data: {
                heading: item.title,
                content: item.description || "",
              },
            },
          ],
        });

        await storage.createArticle({ 
          contentId: content.id,
          sourceRssFeedId: req.params.id,
          sourceUrl: item.link || null
        });
        
        // Store fingerprint for future deduplication
        await storage.createContentFingerprint({
          contentId: content.id,
          fingerprint: item.fingerprint,
          sourceUrl: item.link || null,
          sourceTitle: item.title,
          rssFeedId: req.params.id
        });
        
        createdContents.push(content);
      }

      await storage.updateRssFeed(req.params.id, {
        lastFetched: new Date(),
      });

      res.status(201).json({ 
        imported: createdContents.length, 
        contents: createdContents,
        duplicates: duplicates,
        duplicateCount: duplicates.length,
        message: duplicates.length > 0 
          ? `Imported ${createdContents.length} items. Skipped ${duplicates.length} duplicate(s).`
          : `Successfully imported ${createdContents.length} items.`
      });
    } catch (error) {
      console.error("Error importing RSS feed items:", error);
      res.status(500).json({ error: "Failed to import RSS feed items" });
    }
  });

  app.get("/api/affiliate-links", async (req, res) => {
    try {
      const { contentId } = req.query;
      const links = await storage.getAffiliateLinks(contentId as string | undefined);
      res.json(links);
    } catch (error) {
      console.error("Error fetching affiliate links:", error);
      res.status(500).json({ error: "Failed to fetch affiliate links" });
    }
  });

  app.get("/api/affiliate-links/:id", async (req, res) => {
    try {
      const link = await storage.getAffiliateLink(req.params.id);
      if (!link) {
        return res.status(404).json({ error: "Affiliate link not found" });
      }
      res.json(link);
    } catch (error) {
      console.error("Error fetching affiliate link:", error);
      res.status(500).json({ error: "Failed to fetch affiliate link" });
    }
  });

  app.post("/api/affiliate-links", requirePermission("canAccessAffiliates"), async (req, res) => {
    try {
      const parsed = insertAffiliateLinkSchema.parse(req.body);
      const link = await storage.createAffiliateLink(parsed);
      res.status(201).json(link);
    } catch (error) {
      console.error("Error creating affiliate link:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create affiliate link" });
    }
  });

  app.patch("/api/affiliate-links/:id", requirePermission("canAccessAffiliates"), async (req, res) => {
    try {
      const link = await storage.updateAffiliateLink(req.params.id, req.body);
      if (!link) {
        return res.status(404).json({ error: "Affiliate link not found" });
      }
      res.json(link);
    } catch (error) {
      console.error("Error updating affiliate link:", error);
      res.status(500).json({ error: "Failed to update affiliate link" });
    }
  });

  app.delete("/api/affiliate-links/:id", requirePermission("canAccessAffiliates"), async (req, res) => {
    try {
      await storage.deleteAffiliateLink(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting affiliate link:", error);
      res.status(500).json({ error: "Failed to delete affiliate link" });
    }
  });

  app.get("/api/media", async (req, res) => {
    try {
      const files = await storage.getMediaFiles();
      res.json(files);
    } catch (error) {
      console.error("Error fetching media files:", error);
      res.status(500).json({ error: "Failed to fetch media files" });
    }
  });

  app.get("/api/media/:id", async (req, res) => {
    try {
      const file = await storage.getMediaFile(req.params.id);
      if (!file) {
        return res.status(404).json({ error: "Media file not found" });
      }
      res.json(file);
    } catch (error) {
      console.error("Error fetching media file:", error);
      res.status(500).json({ error: "Failed to fetch media file" });
    }
  });

  app.post("/api/media/upload", requirePermission("canAccessMediaLibrary"), upload.single("file"), async (req, res) => {
    let localPath: string | null = null;
    let objectPath: string | null = null;
    
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const storageClient = getObjectStorageClient();
      
      const filename = `${Date.now()}-${req.file.originalname}`;
      let url = `/uploads/${filename}`;
      
      if (storageClient) {
        objectPath = `public/${filename}`;
        await storageClient.uploadFromBytes(objectPath, req.file.buffer);
        const signedUrl = await storageClient.getSignedDownloadUrl(objectPath);
        url = signedUrl.split("?")[0];
      } else {
        const uploadsDir = path.join(process.cwd(), "uploads");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        localPath = path.join(uploadsDir, filename);
        fs.writeFileSync(localPath, req.file.buffer);
      }

      const mediaFile = await storage.createMediaFile({
        filename,
        originalFilename: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url,
        altText: req.body.altText || null,
        width: req.body.width ? parseInt(req.body.width) : null,
        height: req.body.height ? parseInt(req.body.height) : null,
      });

      res.status(201).json(mediaFile);
    } catch (error) {
      if (localPath && fs.existsSync(localPath)) {
        try { fs.unlinkSync(localPath); } catch (e) { console.log("Cleanup failed:", e); }
      }
      console.error("Error uploading media file:", error);
      res.status(500).json({ error: "Failed to upload media file" });
    }
  });

  app.patch("/api/media/:id", requirePermission("canAccessMediaLibrary"), async (req, res) => {
    try {
      const file = await storage.updateMediaFile(req.params.id, req.body);
      if (!file) {
        return res.status(404).json({ error: "Media file not found" });
      }
      res.json(file);
    } catch (error) {
      console.error("Error updating media file:", error);
      res.status(500).json({ error: "Failed to update media file" });
    }
  });

  app.delete("/api/media/:id", requirePermission("canAccessMediaLibrary"), async (req, res) => {
    try {
      const file = await storage.getMediaFile(req.params.id);
      if (file) {
        const storageClient = getObjectStorageClient();
        if (storageClient) {
          try {
            await storageClient.delete(`public/${file.filename}`);
          } catch (e) {
            console.log("Could not delete from object storage:", e);
          }
        } else {
          const localPath = path.join(process.cwd(), "uploads", file.filename);
          if (fs.existsSync(localPath)) {
            try {
              fs.unlinkSync(localPath);
            } catch (e) {
              console.log("Could not delete local file:", e);
            }
          }
        }
      }
      await storage.deleteMediaFile(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting media file:", error);
      res.status(500).json({ error: "Failed to delete media file" });
    }
  });

  app.get("/api/internal-links", async (req, res) => {
    try {
      const { contentId } = req.query;
      const links = await storage.getInternalLinks(contentId as string | undefined);
      res.json(links);
    } catch (error) {
      console.error("Error fetching internal links:", error);
      res.status(500).json({ error: "Failed to fetch internal links" });
    }
  });

  app.post("/api/internal-links", requirePermission("canEdit"), async (req, res) => {
    try {
      const link = await storage.createInternalLink(req.body);
      res.status(201).json(link);
    } catch (error) {
      console.error("Error creating internal link:", error);
      res.status(500).json({ error: "Failed to create internal link" });
    }
  });

  app.delete("/api/internal-links/:id", requirePermission("canEdit"), async (req, res) => {
    try {
      await storage.deleteInternalLink(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting internal link:", error);
      res.status(500).json({ error: "Failed to delete internal link" });
    }
  });

  app.post("/api/ai/generate", requirePermission("canCreate"), async (req, res) => {
    try {
      const openai = getOpenAIClient();
      if (!openai) {
        return res.status(503).json({ error: "AI service not configured. Please add OPENAI_API_KEY." });
      }

      const { type, topic, keywords, tone = "informative" } = req.body;

      if (!type || !topic) {
        return res.status(400).json({ error: "Type and topic are required" });
      }

      let systemPrompt = "";
      if (type === "attraction") {
        systemPrompt = `You are a travel content writer specializing in Dubai attractions. Write compelling, SEO-optimized content that helps travelers plan their visit. Include practical information like visiting hours, ticket prices, and insider tips.`;
      } else if (type === "hotel") {
        systemPrompt = `You are a luxury hotel reviewer and travel writer. Write detailed, engaging hotel descriptions that highlight amenities, room types, dining options, and unique experiences. Focus on what makes each property special.`;
      } else {
        systemPrompt = `You are a Dubai travel expert and content writer. Create informative, engaging articles that help travelers make the most of their Dubai experience. Include practical tips, local insights, and up-to-date information.`;
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Write a draft for a ${type} page about "${topic}".
${keywords ? `Target keywords: ${keywords.join(", ")}` : ""}
Tone: ${tone}

Please provide:
1. A compelling title
2. A meta description (under 160 characters)
3. Main content with proper headings
4. 3-5 FAQ items with questions and answers

Format the response as JSON with the following structure:
{
  "title": "...",
  "metaDescription": "...",
  "blocks": [
    { "type": "text", "data": { "heading": "...", "content": "..." } },
    ...
  ],
  "faq": [
    { "question": "...", "answer": "..." },
    ...
  ]
}`,
          },
        ],
        response_format: { type: "json_object" },
      });

      const generatedContent = JSON.parse(response.choices[0].message.content || "{}");
      res.json(generatedContent);
    } catch (error) {
      console.error("Error generating AI content:", error);
      res.status(500).json({ error: "Failed to generate content" });
    }
  });

  app.post("/api/ai/suggest-internal-links", requirePermission("canCreate"), async (req, res) => {
    try {
      const openai = getOpenAIClient();
      if (!openai) {
        return res.status(503).json({ error: "AI service not configured. Please add OPENAI_API_KEY." });
      }

      const { contentId, text } = req.body;
      
      const allContents = await storage.getContents();
      const otherContents = allContents.filter(c => c.id !== contentId);
      
      if (otherContents.length === 0) {
        return res.json({ suggestions: [] });
      }

      const contentList = otherContents.map(c => `- ${c.title} (${c.type}): ${c.slug}`).join("\n");

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an SEO expert. Suggest internal links that would naturally fit within the given text. Only suggest links that are contextually relevant.",
          },
          {
            role: "user",
            content: `Given this content:\n\n${text}\n\nAnd these available pages to link to:\n${contentList}\n\nSuggest up to 5 internal links. For each suggestion, provide the anchor text and the target slug.\n\nFormat as JSON: { "suggestions": [{ "anchorText": "...", "targetSlug": "...", "reason": "..." }] }`,
          },
        ],
        response_format: { type: "json_object" },
      });

      const suggestions = JSON.parse(response.choices[0].message.content || '{"suggestions":[]}');
      res.json(suggestions);
    } catch (error) {
      console.error("Error suggesting internal links:", error);
      res.status(500).json({ error: "Failed to suggest internal links" });
    }
  });

  // Comprehensive AI Article Generator - Full Spec Implementation
  app.post("/api/ai/generate-article", requirePermission("canCreate"), async (req, res) => {
    try {
      const openai = getOpenAIClient();
      if (!openai) {
        return res.status(503).json({ error: "AI service not configured. Please add OPENAI_API_KEY." });
      }

      const { title, summary, sourceUrl, sourceText, inputType = "title_only" } = req.body;

      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      // Build context based on input type
      let contextInfo = `Title: "${title}"`;
      if (summary) contextInfo += `\nSummary: ${summary}`;
      if (sourceText) contextInfo += `\nSource text: ${sourceText}`;
      if (sourceUrl) contextInfo += `\nSource URL: ${sourceUrl}`;

      const systemPrompt = `You are an expert Dubai travel news content writer for a CMS. You MUST follow ALL these rules:

PERSONALITY BANK (A-E):
A. Professional Travel Expert - authoritative, factual, trustworthy
B. Enthusiastic Explorer - energetic, inspiring, adventure-focused  
C. Luxury Curator - sophisticated, refined, premium-focused
D. Practical Guide - helpful, organized, detail-oriented
E. Local Insider - authentic, personal, culturally aware

CONTENT CATEGORIES:
A. Attractions & Activities
B. Hotels  
C. Dining/Food
D. Transportation/Logistics
E. Events/Festivals
F. Tips/Guides
G. News/Regulations
H. Shopping & Deals

URGENCY LEVELS:
- Urgent (this week)
- Relevant (1-2 months)
- Evergreen

AUDIENCE TYPES: Families, Couples, Budget, Luxury, Business

STRICT RULES:
1. No hallucinations about prices, laws, or dates - say "as of latest public information" if unsure
2. No fake names or invented quotes
3. Always traveler-focused and SEO-clean
4. Maximum 5 marketing vocabulary words per article
5. No duplicate sentences or unnatural keyword stuffing
6. Article length: 800-1800 words depending on complexity
7. Meta title: 50-65 characters
8. Meta description: 150-160 characters
9. Each FAQ answer: 100-150 words, SEO-rich, unique

OUTPUT FORMAT - Return valid JSON matching this exact structure:
{
  "meta": {
    "title": "SEO meta title 50-65 chars",
    "description": "SEO meta description 150-160 chars",
    "slug": "url-friendly-slug",
    "keywords": ["keyword1", "keyword2"],
    "ogTitle": "Open Graph title",
    "ogDescription": "Open Graph description"
  },
  "analysis": {
    "category": "A-H code and name",
    "tone": "enthusiastic/practical/serious/enticing/friendly",
    "personality": "A-E code and description",
    "structure": "news_guide/story_info/comparative/updates/lists",
    "uniqueAngle": "What makes this article valuable",
    "marketingWords": ["max", "5", "words"],
    "primaryKeyword": "main keyword",
    "secondaryKeywords": ["secondary1", "secondary2"],
    "lsiKeywords": ["lsi1", "lsi2", "lsi3"],
    "urgency": "urgent/relevant/evergreen",
    "audience": ["target", "audiences"]
  },
  "article": {
    "h1": "SEO-optimized clickable headline",
    "intro": "2-3 sentences with primary keyword, answering what happened and why travelers should care",
    "quickFacts": [
      {"label": "Location", "value": "..."},
      {"label": "Price/Cost", "value": "..."},
      {"label": "Hours", "value": "..."},
      {"label": "Best For", "value": "..."},
      {"label": "Getting There", "value": "..."},
      {"label": "Time Needed", "value": "..."},
      {"label": "Booking Notes", "value": "..."},
      {"label": "Best Time", "value": "..."}
    ],
    "sections": [
      {"heading": "Section H2", "body": "Detailed content following personality/tone..."}
    ],
    "proTips": ["Genuine, specific tip 1", "Genuine, specific tip 2"],
    "goodToKnow": ["Warning/restriction 1", "Seasonality note", "Local insight"],
    "faq": [
      {"q": "SEO-rich question?", "a": "100-150 word unique answer..."}
    ],
    "internalLinks": [
      {"anchor": "suggested anchor text", "suggestedTopic": "related topic to link"}
    ],
    "altTexts": ["Hero image alt", "Detail section alt", "Atmosphere photo alt"],
    "closing": "Short, practical, traveler-focused conclusion"
  },
  "suggestions": {
    "alternativeHeadlines": ["Option 1", "Option 2", "Option 3"],
    "alternativeIntros": ["Alternative intro 1", "Alternative intro 2"],
    "alternativeCta": "Alternative call to action if relevant"
  }
}`;

      const userPrompt = `Generate a complete Dubai travel news article based on:

${contextInfo}

Input type: ${inputType}

Follow ALL steps from the spec:
1. Perform internal analysis (category A-H, urgency, audience, personality A-E, tone, unique angle, structure, marketing words, keywords)
2. Generate all meta and structure data
3. Create the complete article with all required sections
4. Apply SEO optimization rules
5. Provide editor suggestions (3 alternative headlines, 2 alternative intros, alternative CTA)

Generate 4-8 FAQ items, each 100-150 words.
Ensure article is 800-1800 words total.
Return valid JSON only.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        max_tokens: 4096,
      });

      const generatedArticle = JSON.parse(response.choices[0].message.content || "{}");
      res.json(generatedArticle);
    } catch (error) {
      console.error("Error generating AI article:", error);
      res.status(500).json({ error: "Failed to generate article" });
    }
  });

  app.post("/api/ai/generate-seo-schema", requirePermission("canCreate"), async (req, res) => {
    try {
      const openai = getOpenAIClient();
      if (!openai) {
        return res.status(503).json({ error: "AI service not configured. Please add OPENAI_API_KEY." });
      }

      const { type, title, description, data } = req.body;

      let schemaType = "WebPage";
      if (type === "attraction") schemaType = "TouristAttraction";
      else if (type === "hotel") schemaType = "Hotel";
      else if (type === "article") schemaType = "Article";

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an SEO expert. Generate valid JSON-LD structured data for the given content.",
          },
          {
            role: "user",
            content: `Generate JSON-LD schema for a ${schemaType}:
Title: ${title}
Description: ${description}
Additional data: ${JSON.stringify(data)}

Return valid JSON-LD that can be embedded in a webpage.`,
          },
        ],
        response_format: { type: "json_object" },
      });

      const schema = JSON.parse(response.choices[0].message.content || "{}");
      res.json(schema);
    } catch (error) {
      console.error("Error generating SEO schema:", error);
      res.status(500).json({ error: "Failed to generate SEO schema" });
    }
  });

  // Full content generation endpoints
  app.post("/api/ai/generate-hotel", requirePermission("canCreate"), async (req, res) => {
    try {
      const { name } = req.body;
      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({ error: "Hotel name is required" });
      }

      const result = await generateHotelContent(name.trim());
      if (!result) {
        return res.status(500).json({ error: "Failed to generate hotel content" });
      }

      res.json(result);
    } catch (error) {
      console.error("Error generating hotel content:", error);
      const message = error instanceof Error ? error.message : "Failed to generate hotel content";
      res.status(500).json({ error: message });
    }
  });

  app.post("/api/ai/generate-attraction", requirePermission("canCreate"), async (req, res) => {
    try {
      const { name } = req.body;
      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({ error: "Attraction name is required" });
      }

      const result = await generateAttractionContent(name.trim());
      if (!result) {
        return res.status(500).json({ error: "Failed to generate attraction content" });
      }

      res.json(result);
    } catch (error) {
      console.error("Error generating attraction content:", error);
      const message = error instanceof Error ? error.message : "Failed to generate attraction content";
      res.status(500).json({ error: message });
    }
  });

  app.post("/api/ai/generate-article", requirePermission("canCreate"), async (req, res) => {
    try {
      const { topic, category } = req.body;
      if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
        return res.status(400).json({ error: "Article topic is required" });
      }

      const result = await generateArticleContent(topic.trim(), category);
      if (!result) {
        return res.status(500).json({ error: "Failed to generate article content" });
      }

      res.json(result);
    } catch (error) {
      console.error("Error generating article content:", error);
      const message = error instanceof Error ? error.message : "Failed to generate article content";
      res.status(500).json({ error: message });
    }
  });

  // AI Image Generation endpoint
  app.post("/api/ai/generate-images", requirePermission("canCreate"), async (req, res) => {
    try {
      const { contentType, title, description, location, generateHero, generateContentImages: genContentImages, contentImageCount } = req.body;

      if (!contentType || !title) {
        return res.status(400).json({ error: "Content type and title are required" });
      }

      const validContentTypes = ['hotel', 'attraction', 'article', 'dining', 'district', 'transport', 'event', 'itinerary'];
      if (!validContentTypes.includes(contentType)) {
        return res.status(400).json({ error: "Invalid content type" });
      }

      const options: ImageGenerationOptions = {
        contentType,
        title: title.trim(),
        description: description?.trim(),
        location: location?.trim(),
        generateHero: generateHero !== false,
        generateContentImages: genContentImages === true,
        contentImageCount: Math.min(contentImageCount || 0, 5), // Limit to 5 content images
      };

      console.log(`Starting image generation for ${contentType}: ${title}`);
      const images = await generateContentImages(options);

      if (images.length === 0) {
        return res.status(500).json({ error: "Failed to generate images" });
      }

      // Store images in object storage if available
      const storageClient = getObjectStorageClient();
      const storedImages: GeneratedImage[] = [];

      for (const image of images) {
        try {
          // Download image from URL
          const imageResponse = await fetch(image.url);
          if (!imageResponse.ok) {
            console.error(`Failed to fetch image: ${image.url}`);
            continue;
          }

          const imageBuffer = await imageResponse.arrayBuffer();
          const buffer = Buffer.from(imageBuffer);

          if (storageClient) {
            // Store in object storage
            const objectPath = `public/ai-generated/${image.filename}`;
            await storageClient.uploadFromBytes(objectPath, buffer);
            storedImages.push({
              ...image,
              url: `/api/media/${image.filename}`, // Use proxy URL
            });
          } else {
            // Store locally
            const uploadsDir = path.join(process.cwd(), "uploads", "ai-generated");
            if (!fs.existsSync(uploadsDir)) {
              fs.mkdirSync(uploadsDir, { recursive: true });
            }
            const localPath = path.join(uploadsDir, image.filename);
            fs.writeFileSync(localPath, buffer);
            storedImages.push({
              ...image,
              url: `/uploads/ai-generated/${image.filename}`,
            });
          }
        } catch (imgError) {
          console.error(`Error storing image ${image.filename}:`, imgError);
        }
      }

      console.log(`Generated and stored ${storedImages.length} images for ${title}`);
      res.json({ images: storedImages, count: storedImages.length });
    } catch (error) {
      console.error("Error generating images:", error);
      const message = error instanceof Error ? error.message : "Failed to generate images";
      res.status(500).json({ error: message });
    }
  });

  // Generate single image with custom prompt
  app.post("/api/ai/generate-single-image", requirePermission("canCreate"), async (req, res) => {
    try {
      const { prompt, size, quality, style, filename } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const validSizes = ['1024x1024', '1792x1024', '1024x1792'];
      const imageSize = validSizes.includes(size) ? size : '1792x1024';

      console.log(`Generating single image with custom prompt`);
      const imageUrl = await generateImage(prompt, {
        size: imageSize as '1024x1024' | '1792x1024' | '1024x1792',
        quality: quality === 'standard' ? 'standard' : 'hd',
        style: style === 'vivid' ? 'vivid' : 'natural',
      });

      if (!imageUrl) {
        return res.status(500).json({ error: "Failed to generate image" });
      }

      // Download and store image
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        return res.status(500).json({ error: "Failed to download generated image" });
      }

      const imageBuffer = await imageResponse.arrayBuffer();
      const buffer = Buffer.from(imageBuffer);
      const finalFilename = filename || `ai-image-${Date.now()}.jpg`;

      const storageClient = getObjectStorageClient();
      let storedUrl: string;

      if (storageClient) {
        const objectPath = `public/ai-generated/${finalFilename}`;
        await storageClient.uploadFromBytes(objectPath, buffer);
        storedUrl = `/api/media/${finalFilename}`;
      } else {
        const uploadsDir = path.join(process.cwd(), "uploads", "ai-generated");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const localPath = path.join(uploadsDir, finalFilename);
        fs.writeFileSync(localPath, buffer);
        storedUrl = `/uploads/ai-generated/${finalFilename}`;
      }

      res.json({ url: storedUrl, filename: finalFilename });
    } catch (error) {
      console.error("Error generating single image:", error);
      const message = error instanceof Error ? error.message : "Failed to generate image";
      res.status(500).json({ error: message });
    }
  });

  app.post("/api/ai/block-action", requirePermission("canCreate"), async (req, res) => {
    try {
      const openai = getOpenAIClient();
      if (!openai) {
        return res.status(503).json({ error: "AI service not configured. Please add OPENAI_API_KEY." });
      }

      const { action, content, context, targetLanguage } = req.body;

      if (!action || !content) {
        return res.status(400).json({ error: "Action and content are required" });
      }

      const validActions = ["rewrite", "expand", "shorten", "translate", "seo_optimize", "improve_grammar", "add_examples"];
      if (!validActions.includes(action)) {
        return res.status(400).json({ error: "Invalid action" });
      }

      let systemPrompt = "You are a professional content editor for a Dubai travel website.";
      let userPrompt = "";

      switch (action) {
        case "rewrite":
          userPrompt = `Rewrite the following text in a fresh, engaging way while keeping the same meaning and key information:\n\n${content}`;
          break;
        case "expand":
          userPrompt = `Expand the following text with more details, examples, and engaging information. Make it at least 50% longer while maintaining quality:\n\n${content}`;
          break;
        case "shorten":
          userPrompt = `Condense the following text to be more concise while keeping all important information. Aim for about half the length:\n\n${content}`;
          break;
        case "translate":
          const lang = targetLanguage || "Arabic";
          userPrompt = `Translate the following text to ${lang}. Maintain the tone and style:\n\n${content}`;
          break;
        case "seo_optimize":
          systemPrompt = "You are an SEO expert and content writer for a Dubai travel website.";
          userPrompt = `Optimize the following text for SEO. Improve keyword usage, add relevant terms naturally, and make it more search-engine friendly while keeping it readable and engaging:\n\n${content}${context ? `\n\nContext/Keywords to target: ${context}` : ""}`;
          break;
        case "improve_grammar":
          userPrompt = `Fix any grammar, spelling, or punctuation errors in the following text. Also improve sentence flow where needed:\n\n${content}`;
          break;
        case "add_examples":
          userPrompt = `Enhance the following text by adding relevant examples, specific details, or practical tips that would help travelers:\n\n${content}`;
          break;
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      });

      const result = response.choices[0].message.content || "";
      res.json({ result, action });
    } catch (error) {
      console.error("Error in AI block action:", error);
      res.status(500).json({ error: "Failed to process AI action" });
    }
  });

  // AI Assistant Chat
  app.post("/api/ai/assistant", requirePermission("canCreate"), async (req, res) => {
    try {
      const openai = getOpenAIClient();
      if (!openai) {
        return res.status(500).json({ error: "OpenAI not configured" });
      }

      const { prompt } = req.body;

      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a helpful AI assistant for a Dubai travel content management system called "Travi CMS". 
You help content creators with:
- Generating topic ideas for articles about Dubai tourism
- Creating content outlines and structures
- Suggesting SEO keywords and optimization strategies
- Writing tips for engaging travel content
- General guidance on content management best practices

Keep responses concise but helpful. Use bullet points and formatting when appropriate.
Focus on Dubai travel, tourism, hotels, attractions, dining, and related topics.`,
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const result = response.choices[0].message.content || "";
      res.json({ response: result });
    } catch (error) {
      console.error("Error in AI assistant:", error);
      res.status(500).json({ error: "Failed to process assistant request" });
    }
  });

  // Topic Bank CRUD
  app.get("/api/topic-bank", async (req, res) => {
    try {
      const { category, isActive } = req.query;
      const items = await storage.getTopicBankItems({
        category: category as string | undefined,
        isActive: isActive === undefined ? undefined : isActive === "true",
      });
      res.json(items);
    } catch (error) {
      console.error("Error fetching topic bank items:", error);
      res.status(500).json({ error: "Failed to fetch topic bank items" });
    }
  });

  app.get("/api/topic-bank/:id", async (req, res) => {
    try {
      const item = await storage.getTopicBankItem(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Topic not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching topic bank item:", error);
      res.status(500).json({ error: "Failed to fetch topic bank item" });
    }
  });

  app.post("/api/topic-bank", requirePermission("canCreate"), async (req, res) => {
    try {
      const parsed = insertTopicBankSchema.parse(req.body);
      const item = await storage.createTopicBankItem(parsed);
      res.status(201).json(item);
    } catch (error) {
      console.error("Error creating topic bank item:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create topic bank item" });
    }
  });

  app.patch("/api/topic-bank/:id", requirePermission("canEdit"), async (req, res) => {
    try {
      const item = await storage.updateTopicBankItem(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ error: "Topic not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error updating topic bank item:", error);
      res.status(500).json({ error: "Failed to update topic bank item" });
    }
  });

  app.delete("/api/topic-bank/:id", requirePermission("canDelete"), async (req, res) => {
    try {
      await storage.deleteTopicBankItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting topic bank item:", error);
      res.status(500).json({ error: "Failed to delete topic bank item" });
    }
  });

  app.post("/api/topic-bank/:id/use", requirePermission("canCreate"), async (req, res) => {
    try {
      const item = await storage.incrementTopicUsage(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Topic not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error incrementing topic usage:", error);
      res.status(500).json({ error: "Failed to increment topic usage" });
    }
  });

  // Auto-generate article from Topic Bank item
  app.post("/api/topic-bank/:id/generate", requirePermission("canCreate"), async (req, res) => {
    try {
      const openai = getOpenAIClient();
      if (!openai) {
        return res.status(503).json({ error: "AI service not configured. Please add OPENAI_API_KEY." });
      }

      const topic = await storage.getTopicBankItem(req.params.id);
      if (!topic) {
        return res.status(404).json({ error: "Topic not found" });
      }

      const keywordsContext = topic.keywords?.length 
        ? `Target Keywords: ${topic.keywords.join(", ")}` 
        : "";
      
      const outlineContext = topic.outline 
        ? `Content Outline:\n${topic.outline}` 
        : "";

      const systemPrompt = `You are an expert Dubai travel content writer. Generate a complete, SEO-optimized article based on the provided topic information.

OUTPUT FORMAT - Return valid JSON matching this exact structure:
{
  "title": "SEO-optimized article title (50-65 chars)",
  "metaDescription": "Compelling meta description (150-160 chars)",
  "slug": "url-friendly-slug",
  "heroImageAlt": "Descriptive alt text for hero image",
  "blocks": [
    {
      "type": "hero",
      "data": {
        "title": "Main article headline",
        "subtitle": "Engaging subtitle",
        "overlayText": "Brief tagline or context"
      }
    },
    {
      "type": "text",
      "data": {
        "heading": "Introduction",
        "content": "Engaging introduction paragraph (200-300 words)..."
      }
    },
    {
      "type": "text",
      "data": {
        "heading": "Section 2 heading",
        "content": "Detailed paragraph content (200-300 words)..."
      }
    },
    {
      "type": "text",
      "data": {
        "heading": "Section 3 heading",
        "content": "Detailed paragraph content (200-300 words)..."
      }
    },
    {
      "type": "highlights",
      "data": {
        "title": "Key Highlights",
        "items": ["Highlight 1", "Highlight 2", "Highlight 3", "Highlight 4", "Highlight 5", "Highlight 6"]
      }
    },
    {
      "type": "text",
      "data": {
        "heading": "Practical Information",
        "content": "Useful practical details for travelers..."
      }
    },
    {
      "type": "tips",
      "data": {
        "title": "Expert Tips",
        "tips": ["Detailed tip 1", "Detailed tip 2", "Detailed tip 3", "Detailed tip 4", "Detailed tip 5", "Detailed tip 6", "Detailed tip 7"]
      }
    },
    {
      "type": "faq",
      "data": {
        "title": "Frequently Asked Questions",
        "faqs": [
          {"question": "Q1?", "answer": "Detailed answer (100-150 words)..."},
          {"question": "Q2?", "answer": "Detailed answer (100-150 words)..."},
          {"question": "Q3?", "answer": "Detailed answer (100-150 words)..."},
          {"question": "Q4?", "answer": "Detailed answer (100-150 words)..."},
          {"question": "Q5?", "answer": "Detailed answer (100-150 words)..."}
        ]
      }
    },
    {
      "type": "cta",
      "data": {
        "heading": "Ready to explore?",
        "text": "Compelling call to action",
        "buttonText": "Learn More",
        "buttonLink": "#"
      }
    }
  ]
}

RULES:
1. Article should be 1200-1800 words total across all text blocks
2. Include 4-5 text sections with detailed content
3. Add a highlights block with 6 key takeaways
4. Include a tips block with 7 actionable expert tips - THIS IS REQUIRED
5. Include 5 FAQ items with comprehensive 100-150 word answers - THIS IS REQUIRED
6. Make content traveler-focused and SEO-optimized
7. No fake data, invented prices, or unverifiable facts
8. Include a CTA block at the end`;

      const userPrompt = `Generate a complete article for this Dubai travel topic:

Topic: ${topic.title}
Category: ${topic.category}
${keywordsContext}
${outlineContext}

Create engaging, informative content that would appeal to Dubai travelers. Return valid JSON only.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        max_tokens: 4096,
      });

      const generated = JSON.parse(response.choices[0].message.content || "{}");

      // Validate and normalize blocks to ensure all required sections exist
      const blocks = validateAndNormalizeBlocks(generated.blocks || [], generated.title || topic.title);
      console.log(`Validated ${blocks.length} content blocks with types: ${blocks.map(b => b.type).join(', ')}`);

      // Create the content in the database
      const slug = generated.slug || topic.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      // Generate hero image for the article and persist to storage
      let heroImageUrl = null;
      let generatedImages: GeneratedImage[] = [];
      try {
        console.log(`Generating images for article: ${generated.title || topic.title}`);
        generatedImages = await generateContentImages({
          contentType: 'article',
          title: generated.title || topic.title,
          description: generated.metaDescription || topic.title,
          generateHero: true,
          generateContentImages: false,
        });
        
        if (generatedImages.length > 0) {
          const heroImage = generatedImages.find(img => img.type === 'hero');
          if (heroImage) {
            // Persist to object storage (DALL-E URLs expire in ~1 hour)
            const persistedUrl = await persistImageToStorage(heroImage.url, heroImage.filename);
            heroImageUrl = persistedUrl || heroImage.url; // Fallback to temp URL if persist fails
            console.log(`Hero image persisted: ${heroImageUrl}`);
          }
        }
      } catch (imageError) {
        console.error("Error generating images for article:", imageError);
        // Continue without images - don't fail the whole article generation
      }

      const content = await storage.createContent({
        title: generated.title || topic.title,
        slug: `${slug}-${Date.now()}`,
        type: "article",
        status: "draft",
        metaDescription: generated.metaDescription || null,
        heroImage: heroImageUrl,
        heroImageAlt: generated.heroImageAlt || `${generated.title || topic.title} - Dubai Travel`,
        blocks: blocks,
      });

      await storage.createArticle({ contentId: content.id, category: topic.category });
      
      // Increment topic usage
      await storage.incrementTopicUsage(req.params.id);

      res.status(201).json({ 
        content, 
        generated,
        images: generatedImages,
        message: "Article generated successfully from topic"
      });
    } catch (error) {
      console.error("Error generating article from topic:", error);
      res.status(500).json({ error: "Failed to generate article from topic" });
    }
  });

  // Batch auto-generate from priority topics (for when RSS lacks content)
  app.post("/api/topic-bank/auto-generate", requirePermission("canCreate"), async (req, res) => {
    try {
      const openai = getOpenAIClient();
      if (!openai) {
        return res.status(503).json({ error: "AI service not configured. Please add OPENAI_API_KEY." });
      }

      const { count = 1, category } = req.body;
      const limit = Math.min(Math.max(1, count), 5); // Max 5 at a time

      // Get high-priority active topics that haven't been used much
      const topics = await storage.getTopicBankItems({ 
        category, 
        isActive: true 
      });
      
      // Sort by priority (high first) and usage count (low first)
      const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
      const sortedTopics = topics.sort((a, b) => {
        const priorityDiff = (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1);
        if (priorityDiff !== 0) return priorityDiff;
        return (a.usageCount || 0) - (b.usageCount || 0);
      }).slice(0, limit);

      if (sortedTopics.length === 0) {
        return res.json({ 
          generated: [], 
          message: "No active topics available for generation" 
        });
      }

      const results = [];
      for (const topic of sortedTopics) {
        try {
          const keywordsContext = topic.keywords?.length 
            ? `Target Keywords: ${topic.keywords.join(", ")}` 
            : "";
          
          const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: `You are an expert Dubai travel content writer. Generate a complete, SEO-optimized article.

Return JSON with: title, metaDescription, slug, heroImageAlt, blocks (array with hero, 4-5 text sections, highlights with 6 items, tips with 7 tips, faq with 5 items using "faqs" key, cta).
Article should be 1200-1800 words, traveler-focused, no fake data.
IMPORTANT: Include a "tips" block with "tips" array containing 7 actionable tips.
IMPORTANT: Include a "faq" block with "faqs" array containing 5 Q&A objects with "question" and "answer" keys.`,
              },
              {
                role: "user",
                content: `Generate article for: ${topic.title}\nCategory: ${topic.category}\n${keywordsContext}`,
              },
            ],
            response_format: { type: "json_object" },
            max_tokens: 4096,
          });

          const generated = JSON.parse(response.choices[0].message.content || "{}");
          
          const slug = generated.slug || topic.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

          // Validate and normalize blocks to ensure all required sections exist
          const blocks = validateAndNormalizeBlocks(generated.blocks || [], generated.title || topic.title);

          // Generate hero image for the article and persist to storage
          let heroImageUrl = null;
          try {
            console.log(`Generating images for batch article: ${generated.title || topic.title}`);
            const batchImages = await generateContentImages({
              contentType: 'article',
              title: generated.title || topic.title,
              description: generated.metaDescription || topic.title,
              generateHero: true,
              generateContentImages: false,
            });
            
            if (batchImages.length > 0) {
              const heroImage = batchImages.find(img => img.type === 'hero');
              if (heroImage) {
                // Persist to object storage (DALL-E URLs expire in ~1 hour)
                const persistedUrl = await persistImageToStorage(heroImage.url, heroImage.filename);
                heroImageUrl = persistedUrl || heroImage.url;
              }
            }
          } catch (imageError) {
            console.error(`Error generating images for batch article ${topic.title}:`, imageError);
          }

          const content = await storage.createContent({
            title: generated.title || topic.title,
            slug: `${slug}-${Date.now()}`,
            type: "article",
            status: "draft",
            metaDescription: generated.metaDescription || null,
            heroImage: heroImageUrl,
            heroImageAlt: generated.heroImageAlt || `${generated.title || topic.title} - Dubai Travel`,
            blocks: blocks,
          });

          await storage.createArticle({ contentId: content.id, category: topic.category });
          await storage.incrementTopicUsage(topic.id);

          results.push({ topicId: topic.id, topicTitle: topic.title, contentId: content.id, hasImage: !!heroImageUrl, success: true });
        } catch (err) {
          console.error(`Error generating from topic ${topic.id}:`, err);
          results.push({ topicId: topic.id, topicTitle: topic.title, success: false, error: (err as Error).message });
        }
      }

      res.json({ 
        generated: results.filter(r => r.success),
        failed: results.filter(r => !r.success),
        message: `Generated ${results.filter(r => r.success).length} of ${sortedTopics.length} articles`
      });
    } catch (error) {
      console.error("Error in batch topic generation:", error);
      res.status(500).json({ error: "Failed to batch generate from topics" });
    }
  });

  // Keyword Repository CRUD
  app.get("/api/keywords", async (req, res) => {
    try {
      const { type, category, isActive } = req.query;
      const items = await storage.getKeywords({
        type: type as string | undefined,
        category: category as string | undefined,
        isActive: isActive === undefined ? undefined : isActive === "true",
      });
      res.json(items);
    } catch (error) {
      console.error("Error fetching keywords:", error);
      res.status(500).json({ error: "Failed to fetch keywords" });
    }
  });

  app.get("/api/keywords/:id", async (req, res) => {
    try {
      const item = await storage.getKeyword(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Keyword not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching keyword:", error);
      res.status(500).json({ error: "Failed to fetch keyword" });
    }
  });

  app.post("/api/keywords", requirePermission("canCreate"), async (req, res) => {
    try {
      const parsed = insertKeywordRepositorySchema.parse(req.body);
      const item = await storage.createKeyword(parsed);
      res.status(201).json(item);
    } catch (error) {
      console.error("Error creating keyword:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create keyword" });
    }
  });

  app.patch("/api/keywords/:id", requirePermission("canEdit"), async (req, res) => {
    try {
      const item = await storage.updateKeyword(req.params.id, req.body);
      if (!item) {
        return res.status(404).json({ error: "Keyword not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error updating keyword:", error);
      res.status(500).json({ error: "Failed to update keyword" });
    }
  });

  app.delete("/api/keywords/:id", requirePermission("canDelete"), async (req, res) => {
    try {
      await storage.deleteKeyword(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting keyword:", error);
      res.status(500).json({ error: "Failed to delete keyword" });
    }
  });

  app.post("/api/keywords/:id/use", requirePermission("canCreate"), async (req, res) => {
    try {
      const item = await storage.incrementKeywordUsage(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Keyword not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error incrementing keyword usage:", error);
      res.status(500).json({ error: "Failed to increment keyword usage" });
    }
  });

  // Bulk import keywords
  app.post("/api/keywords/bulk-import", requirePermission("canManageSettings"), async (req, res) => {
    try {
      const { keywords } = req.body;
      if (!Array.isArray(keywords) || keywords.length === 0) {
        return res.status(400).json({ error: "Keywords array is required" });
      }

      const results = { created: 0, skipped: 0, errors: [] as string[] };
      
      for (const kw of keywords) {
        try {
          const existingKeywords = await storage.getKeywords({ search: kw.keyword });
          const exists = existingKeywords.some(
            (k: { keyword: string }) => k.keyword.toLowerCase() === kw.keyword.toLowerCase()
          );
          
          if (exists) {
            results.skipped++;
            continue;
          }

          await storage.createKeyword({
            keyword: kw.keyword,
            type: kw.type || "primary",
            category: kw.category || null,
            searchVolume: kw.searchVolume || null,
            competition: kw.competition || null,
            relatedKeywords: kw.relatedKeywords || [],
            priority: kw.priority || 0,
            notes: kw.notes || null,
            isActive: true,
          });
          results.created++;
        } catch (err: any) {
          if (err?.code === "23505") {
            results.skipped++;
          } else {
            results.errors.push(`Failed to import "${kw.keyword}": ${err?.message || "Unknown error"}`);
          }
        }
      }

      res.json({
        success: true,
        created: results.created,
        skipped: results.skipped,
        errors: results.errors.slice(0, 10),
        totalErrors: results.errors.length,
      });
    } catch (error) {
      console.error("Error bulk importing keywords:", error);
      res.status(500).json({ error: "Failed to bulk import keywords" });
    }
  });

  // Get scheduled content ready for publishing
  app.get("/api/scheduled-content", async (req, res) => {
    try {
      const scheduledContent = await storage.getScheduledContentToPublish();
      res.json(scheduledContent);
    } catch (error) {
      console.error("Error fetching scheduled content:", error);
      res.status(500).json({ error: "Failed to fetch scheduled content" });
    }
  });

  // Background scheduler for auto-publishing scheduled content
  // Runs every minute to check for content that should be published
  const runScheduledPublishing = async () => {
    try {
      const contentToPublish = await storage.getScheduledContentToPublish();
      for (const content of contentToPublish) {
        await storage.publishScheduledContent(content.id);
        console.log(`Auto-published scheduled content: ${content.title} (ID: ${content.id})`);
      }
      if (contentToPublish.length > 0) {
        console.log(`Scheduled publishing: Published ${contentToPublish.length} item(s)`);
      }
    } catch (error) {
      console.error("Error in scheduled publishing job:", error);
    }
  };

  // Run immediately on startup, then every minute
  runScheduledPublishing();
  setInterval(runScheduledPublishing, 60 * 1000);
  console.log("Scheduled publishing automation started (runs every minute)");

  // =====================
  // User Management Routes (Admin only)
  // =====================

  app.get("/api/users", requirePermission("canManageUsers"), async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users.map(u => ({ id: u.id, firstName: u.firstName, lastName: u.lastName, email: u.email, role: u.role, isActive: u.isActive, createdAt: u.createdAt, profileImageUrl: u.profileImageUrl })));
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/users", requirePermission("canManageUsers"), async (req, res) => {
    try {
      const parsed = insertUserSchema.parse(req.body);
      if (!parsed.email) {
        return res.status(400).json({ error: "Email is required" });
      }
      const existingUser = await storage.getUserByEmail(parsed.email.toLowerCase());
      if (existingUser) {
        return res.status(400).json({ error: "A user with this email already exists" });
      }
      const user = await storage.createUser({ ...parsed, email: parsed.email.toLowerCase() });
      res.status(201).json({ id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, isActive: user.isActive, createdAt: user.createdAt });
    } catch (error) {
      console.error("Error creating user:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.patch("/api/users/:id", requirePermission("canManageUsers"), async (req, res) => {
    try {
      const existingUser = await storage.getUser(req.params.id);
      const user = await storage.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Audit log user update (check for role change)
      const actionType = existingUser?.role !== user.role ? "role_change" : "user_update";
      await logAuditEvent(req, actionType, "user", req.params.id,
        actionType === "role_change" 
          ? `Role changed for ${user.email}: ${existingUser?.role} -> ${user.role}`
          : `Updated user: ${user.email}`,
        { email: existingUser?.email, role: existingUser?.role, isActive: existingUser?.isActive },
        { email: user.email, role: user.role, isActive: user.isActive }
      );
      
      res.json({ id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, isActive: user.isActive, createdAt: user.createdAt });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", requirePermission("canManageUsers"), async (req, res) => {
    try {
      const existingUser = await storage.getUser(req.params.id);
      await storage.deleteUser(req.params.id);
      
      // Audit log user deletion
      if (existingUser) {
        await logAuditEvent(req, "user_delete", "user", req.params.id, `Deleted user: ${existingUser.email}`, { email: existingUser.email, role: existingUser.role });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Homepage Promotions Routes
  app.get("/api/homepage-promotions/:section", async (req, res) => {
    try {
      const section = req.params.section as HomepageSection;
      const validSections = ["featured", "attractions", "hotels", "articles", "trending"];
      if (!validSections.includes(section)) {
        return res.status(400).json({ error: "Invalid section" });
      }
      const promotions = await storage.getHomepagePromotionsBySection(section);
      
      // Fetch content details for each promotion
      const promotionsWithContent = await Promise.all(
        promotions.map(async (promo) => {
          if (promo.contentId) {
            const content = await storage.getContent(promo.contentId);
            return { ...promo, content };
          }
          return promo;
        })
      );
      
      res.json(promotionsWithContent);
    } catch (error) {
      console.error("Error fetching homepage promotions:", error);
      res.status(500).json({ error: "Failed to fetch homepage promotions" });
    }
  });

  app.post("/api/homepage-promotions", requirePermission("canEdit"), async (req, res) => {
    try {
      const parsed = insertHomepagePromotionSchema.parse(req.body);
      const promotion = await storage.createHomepagePromotion(parsed);
      res.status(201).json(promotion);
    } catch (error) {
      console.error("Error creating homepage promotion:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create homepage promotion" });
    }
  });

  app.patch("/api/homepage-promotions/:id", requirePermission("canEdit"), async (req, res) => {
    try {
      // Validate update payload - only allow specific fields
      const updateSchema = z.object({
        isActive: z.boolean().optional(),
        position: z.number().int().min(0).optional(),
        customTitle: z.string().nullable().optional(),
        customImage: z.string().nullable().optional(),
      });
      const parsed = updateSchema.parse(req.body);
      
      const promotion = await storage.updateHomepagePromotion(req.params.id, parsed);
      if (!promotion) {
        return res.status(404).json({ error: "Homepage promotion not found" });
      }
      res.json(promotion);
    } catch (error) {
      console.error("Error updating homepage promotion:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update homepage promotion" });
    }
  });

  app.delete("/api/homepage-promotions/:id", requirePermission("canEdit"), async (req, res) => {
    try {
      await storage.deleteHomepagePromotion(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting homepage promotion:", error);
      res.status(500).json({ error: "Failed to delete homepage promotion" });
    }
  });

  app.post("/api/homepage-promotions/reorder", requirePermission("canEdit"), async (req, res) => {
    try {
      const reorderSchema = z.object({
        section: z.enum(["featured", "attractions", "hotels", "articles", "trending"]),
        orderedIds: z.array(z.string().uuid()),
      });
      const { section, orderedIds } = reorderSchema.parse(req.body);
      
      await storage.reorderHomepagePromotions(section, orderedIds);
      res.json({ success: true });
    } catch (error) {
      console.error("Error reordering homepage promotions:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to reorder homepage promotions" });
    }
  });

  // Analytics Routes (admin/editor only)
  app.get("/api/analytics/overview", requirePermission("canViewAnalytics"), async (req, res) => {
    try {
      const overview = await storage.getAnalyticsOverview();
      res.json(overview);
    } catch (error) {
      console.error("Error fetching analytics overview:", error);
      res.status(500).json({ error: "Failed to fetch analytics overview" });
    }
  });

  app.get("/api/analytics/views-over-time", requirePermission("canViewAnalytics"), async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const views = await storage.getViewsOverTime(Math.min(days, 90));
      res.json(views);
    } catch (error) {
      console.error("Error fetching views over time:", error);
      res.status(500).json({ error: "Failed to fetch views over time" });
    }
  });

  app.get("/api/analytics/top-content", requirePermission("canViewAnalytics"), async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const topContent = await storage.getTopContent(Math.min(limit, 50));
      res.json(topContent);
    } catch (error) {
      console.error("Error fetching top content:", error);
      res.status(500).json({ error: "Failed to fetch top content" });
    }
  });

  app.get("/api/analytics/by-content-type", requirePermission("canViewAnalytics"), async (req, res) => {
    try {
      const byType = await storage.getViewsByContentType();
      res.json(byType);
    } catch (error) {
      console.error("Error fetching views by content type:", error);
      res.status(500).json({ error: "Failed to fetch views by content type" });
    }
  });

  app.post("/api/analytics/record-view/:contentId", async (req, res) => {
    try {
      const { contentId } = req.params;
      const content = await storage.getContent(contentId);
      if (!content) {
        return res.json({ success: true });
      }
      await storage.recordContentView(contentId, {
        userAgent: req.headers["user-agent"],
        referrer: req.headers.referer,
        sessionId: req.sessionID,
      });
      res.json({ success: true });
    } catch (error) {
      console.error("Error recording content view:", error);
      res.json({ success: true });
    }
  });

  // Audit Logs Routes (admin only)
  app.get("/api/audit-logs", requirePermission("canViewAuditLogs"), async (req, res) => {
    try {
      const { userId, entityType, entityId, actionType, limit, offset } = req.query;
      const filters = {
        userId: userId as string | undefined,
        entityType: entityType as string | undefined,
        entityId: entityId as string | undefined,
        actionType: actionType as string | undefined,
        limit: limit ? parseInt(limit as string) : 50,
        offset: offset ? parseInt(offset as string) : 0,
      };
      const [logs, total] = await Promise.all([
        storage.getAuditLogs(filters),
        storage.getAuditLogCount(filters)
      ]);
      res.json({ logs, total, limit: filters.limit, offset: filters.offset });
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  });

  return httpServer;
}
