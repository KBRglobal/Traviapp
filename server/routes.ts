import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { Client } from "@replit/object-storage";
import OpenAI from "openai";
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
  ROLE_PERMISSIONS,
  SUPPORTED_LOCALES,
  type UserRole,
} from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";
import { 
  generateHotelContent, 
  generateAttractionContent, 
  generateArticleContent 
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

  // Get all available roles (admin only)
  app.get("/api/roles", requirePermission("canManageUsers"), async (req, res) => {
    res.json({
      roles: ["admin", "editor", "viewer"],
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

  app.get("/api/contents", async (req, res) => {
    try {
      const { type, status, search, includeExtensions } = req.query;
      const filters = {
        type: type as string | undefined,
        status: status as string | undefined,
        search: search as string | undefined,
      };
      
      if (includeExtensions === "true") {
        const contents = await storage.getContentsWithRelations(filters);
        res.json(contents);
      } else {
        const contents = await storage.getContents(filters);
        res.json(contents);
      }
    } catch (error) {
      console.error("Error fetching contents:", error);
      res.status(500).json({ error: "Failed to fetch contents" });
    }
  });

  app.get("/api/contents/:id", async (req, res) => {
    try {
      const content = await storage.getContent(req.params.id);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.get("/api/contents/slug/:slug", async (req, res) => {
    try {
      const content = await storage.getContentBySlug(req.params.slug);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      console.error("Error fetching content by slug:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.post("/api/contents", requirePermission("canCreate"), async (req, res) => {
    try {
      const parsed = insertContentSchema.parse(req.body);
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
      await storage.deleteContent(req.params.id);
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

  app.post("/api/rss-feeds", requireAuth, async (req, res) => {
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

  app.patch("/api/rss-feeds/:id", requireAuth, async (req, res) => {
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

  app.delete("/api/rss-feeds/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteRssFeed(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting RSS feed:", error);
      res.status(500).json({ error: "Failed to delete RSS feed" });
    }
  });

  app.post("/api/rss-feeds/:id/fetch", requireAuth, async (req, res) => {
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

  app.post("/api/rss-feeds/:id/import", requireAuth, async (req, res) => {
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

  app.post("/api/affiliate-links", requireAuth, async (req, res) => {
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

  app.patch("/api/affiliate-links/:id", requireAuth, async (req, res) => {
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

  app.delete("/api/affiliate-links/:id", requireAuth, async (req, res) => {
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

  app.post("/api/media/upload", requireAuth, upload.single("file"), async (req, res) => {
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

  app.patch("/api/media/:id", requireAuth, async (req, res) => {
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

  app.delete("/api/media/:id", requireAuth, async (req, res) => {
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

  app.post("/api/internal-links", requireAuth, async (req, res) => {
    try {
      const link = await storage.createInternalLink(req.body);
      res.status(201).json(link);
    } catch (error) {
      console.error("Error creating internal link:", error);
      res.status(500).json({ error: "Failed to create internal link" });
    }
  });

  app.delete("/api/internal-links/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteInternalLink(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting internal link:", error);
      res.status(500).json({ error: "Failed to delete internal link" });
    }
  });

  app.post("/api/ai/generate", requireAuth, async (req, res) => {
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

  app.post("/api/ai/suggest-internal-links", requireAuth, async (req, res) => {
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
  app.post("/api/ai/generate-article", requireAuth, async (req, res) => {
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

  app.post("/api/ai/generate-seo-schema", requireAuth, async (req, res) => {
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

  app.post("/api/ai/block-action", requireAuth, async (req, res) => {
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
  app.post("/api/ai/assistant", requireAuth, async (req, res) => {
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

  app.post("/api/topic-bank", requireAuth, async (req, res) => {
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

  app.patch("/api/topic-bank/:id", requireAuth, async (req, res) => {
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

  app.delete("/api/topic-bank/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteTopicBankItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting topic bank item:", error);
      res.status(500).json({ error: "Failed to delete topic bank item" });
    }
  });

  app.post("/api/topic-bank/:id/use", requireAuth, async (req, res) => {
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
  app.post("/api/topic-bank/:id/generate", requireAuth, async (req, res) => {
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
  "blocks": [
    {
      "type": "hero",
      "data": {
        "title": "Main article headline",
        "subtitle": "Engaging subtitle"
      }
    },
    {
      "type": "text",
      "data": {
        "heading": "Section heading",
        "content": "Detailed paragraph content with proper formatting..."
      }
    },
    {
      "type": "highlights",
      "data": {
        "title": "Key Highlights",
        "items": ["Highlight 1", "Highlight 2", "Highlight 3"]
      }
    },
    {
      "type": "faq",
      "data": {
        "title": "Frequently Asked Questions",
        "items": [
          {"question": "Q1?", "answer": "Detailed answer 1..."},
          {"question": "Q2?", "answer": "Detailed answer 2..."}
        ]
      }
    }
  ]
}

RULES:
1. Article should be 800-1500 words
2. Include 3-5 text sections with detailed content
3. Add a highlights block with key takeaways
4. Include 3-5 FAQ items with comprehensive answers
5. Make content traveler-focused and SEO-optimized
6. No fake data, invented prices, or unverifiable facts`;

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

      // Validate and ensure blocks array has content
      let blocks = generated.blocks;
      if (!Array.isArray(blocks) || blocks.length === 0) {
        blocks = [
          { type: "hero", data: { title: generated.title || topic.title, subtitle: topic.category || "" } },
          { type: "text", data: { heading: "Overview", content: "Content generation incomplete. Please edit this article." } }
        ];
      }

      // Create the content in the database
      const slug = generated.slug || topic.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      const content = await storage.createContent({
        title: generated.title || topic.title,
        slug: `${slug}-${Date.now()}`,
        type: "article",
        status: "draft",
        metaDescription: generated.metaDescription || null,
        blocks: blocks,
      });

      await storage.createArticle({ contentId: content.id, category: topic.category });
      
      // Increment topic usage
      await storage.incrementTopicUsage(req.params.id);

      res.status(201).json({ 
        content, 
        generated,
        message: "Article generated successfully from topic"
      });
    } catch (error) {
      console.error("Error generating article from topic:", error);
      res.status(500).json({ error: "Failed to generate article from topic" });
    }
  });

  // Batch auto-generate from priority topics (for when RSS lacks content)
  app.post("/api/topic-bank/auto-generate", requireAuth, async (req, res) => {
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

Return JSON with: title, metaDescription, slug, blocks (array with hero, text sections, highlights, faq).
Article should be 800-1500 words, traveler-focused, no fake data.`,
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

          // Validate and ensure blocks array has content
          let blocks = generated.blocks;
          if (!Array.isArray(blocks) || blocks.length === 0) {
            blocks = [
              { type: "hero", data: { title: generated.title || topic.title, subtitle: topic.category || "" } },
              { type: "text", data: { heading: "Overview", content: "Content generation incomplete. Please edit this article." } }
            ];
          }

          const content = await storage.createContent({
            title: generated.title || topic.title,
            slug: `${slug}-${Date.now()}`,
            type: "article",
            status: "draft",
            metaDescription: generated.metaDescription || null,
            blocks: blocks,
          });

          await storage.createArticle({ contentId: content.id, category: topic.category });
          await storage.incrementTopicUsage(topic.id);

          results.push({ topicId: topic.id, topicTitle: topic.title, contentId: content.id, success: true });
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

  app.post("/api/keywords", requireAuth, async (req, res) => {
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

  app.patch("/api/keywords/:id", requireAuth, async (req, res) => {
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

  app.delete("/api/keywords/:id", requireAuth, async (req, res) => {
    try {
      await storage.deleteKeyword(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting keyword:", error);
      res.status(500).json({ error: "Failed to delete keyword" });
    }
  });

  app.post("/api/keywords/:id/use", requireAuth, async (req, res) => {
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
      const user = await storage.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, isActive: user.isActive, createdAt: user.createdAt });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", requirePermission("canManageUsers"), async (req, res) => {
    try {
      await storage.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  return httpServer;
}
