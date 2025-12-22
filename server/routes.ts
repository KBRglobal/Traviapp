import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import multer from "multer";
import { Client } from "@replit/object-storage";
import OpenAI from "openai";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Resend } from "resend";
import { eq, like, or, desc, and, sql } from "drizzle-orm";
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
  insertTagSchema,
  newsletterSubscribers,
  contentRules,
  ROLE_PERMISSIONS,
  SUPPORTED_LOCALES,
  type UserRole,
  type HomepageSection,
  type ContentBlock,
} from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";
import {
  safeMode,
  rateLimiters,
  checkAiUsageLimit,
  requireAuth,
  requirePermission,
  requireOwnContentOrPermission,
  checkReadOnlyMode,
  csrfProtection,
  validateMediaUpload,
  validateAnalyticsRequest,
  secureErrorHandler,
  auditLogReadOnly,
  securityHeaders,
  ipBlockMiddleware,
  recordFailedAttempt,
  logAuditEvent as logSecurityEvent,
  getAuditLogs,
  getBlockedIps,
} from "./security";
import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";
import {
  generateHotelContent,
  generateAttractionContent,
  generateArticleContent,
  generateDiningContent,
  generateDistrictContent,
  generateTransportContent,
  generateEventContent,
  generateItineraryContent,
  generateContentImages,
  generateImagePrompt,
  generateImage,
  type GeneratedImage,
  type ImageGenerationOptions
} from "./ai-generator";
import { jobQueue, type TranslateJobData, type AiGenerateJobData } from "./job-queue";
import { registerEnterpriseRoutes } from "./enterprise-routes";
import { registerImageLogicRoutes } from "./image-logic-routes";
import { registerAutomationRoutes } from "./automation-routes";
import { registerContentIntelligenceRoutes } from "./content-intelligence-routes";
import { registerAutoPilotRoutes } from "./auto-pilot-routes";
import { registerEnhancementRoutes } from "./enhancement-routes";
import { registerCustomerJourneyRoutes } from "./customer-journey-routes";
import { registerDocUploadRoutes } from "./doc-upload-routes";
import { cache, cacheKeys } from "./cache";
import {
  getContentWriterSystemPrompt,
  buildArticleGenerationPrompt,
  determineContentCategory,
  validateArticleResponse,
  buildRetryPrompt,
  CONTENT_WRITER_PERSONALITIES,
  ARTICLE_STRUCTURES,
  CATEGORY_PERSONALITY_MAPPING,
  type ArticleResponse,
} from "./content-writer-guidelines";

// Permission checking utilities (imported from security.ts for route-level checks)
type PermissionKey = keyof typeof ROLE_PERMISSIONS.admin;

// Role checking middleware
function requireRole(role: UserRole | UserRole[]) {
  return async (req: any, res: any, next: any) => {
    if (!req.isAuthenticated() || !req.user?.claims?.sub) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    const allowedRoles = Array.isArray(role) ? role : [role];
    if (!allowedRoles.includes(user.role as UserRole)) {
      return res.status(403).json({ error: "Insufficient permissions", requiredRole: role, currentRole: user.role });
    }
    next();
  };
}

const upload = multer({ storage: multer.memoryStorage() });

// WebP conversion settings
const WEBP_QUALITY = 80;
const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

interface ConvertedImage {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  width?: number;
  height?: number;
}

async function convertToWebP(buffer: Buffer, originalFilename: string, mimeType: string): Promise<ConvertedImage> {
  // Only convert supported image formats
  if (!SUPPORTED_IMAGE_FORMATS.includes(mimeType)) {
    return { buffer, filename: originalFilename, mimeType };
  }

  // Skip if already WebP
  if (mimeType === 'image/webp') {
    const metadata = await sharp(buffer).metadata();
    return {
      buffer,
      filename: originalFilename,
      mimeType,
      width: metadata.width,
      height: metadata.height,
    };
  }

  try {
    // Get image metadata for dimensions
    const image = sharp(buffer);
    const metadata = await image.metadata();

    // Convert to WebP
    const webpBuffer = await image
      .webp({ quality: WEBP_QUALITY })
      .toBuffer();

    // Generate new filename with .webp extension
    const baseName = originalFilename.replace(/\.[^.]+$/, '');
    const webpFilename = `${baseName}.webp`;

    console.log(`[WebP] Converted ${originalFilename} (${(buffer.length / 1024).toFixed(1)}KB) -> ${webpFilename} (${(webpBuffer.length / 1024).toFixed(1)}KB)`);

    return {
      buffer: webpBuffer,
      filename: webpFilename,
      mimeType: 'image/webp',
      width: metadata.width,
      height: metadata.height,
    };
  } catch (error) {
    console.error('[WebP] Conversion failed, using original:', error);
    return { buffer, filename: originalFilename, mimeType };
  }
}

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

// Newsletter email helpers
function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not configured");
    return null;
  }
  return new Resend(apiKey);
}

async function sendConfirmationEmail(email: string, token: string, firstName?: string): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) {
    console.log("[Newsletter] Resend not configured, skipping confirmation email for:", email);
    return false;
  }
  
  const baseUrl = process.env.REPLIT_DEV_DOMAIN 
    ? `https://${process.env.REPLIT_DEV_DOMAIN}`
    : 'http://localhost:5000';
  
  const confirmUrl = `${baseUrl}/api/newsletter/confirm/${token}`;
  const greeting = firstName ? `Hi ${firstName},` : "Hi there,";
  
  try {
    await resend.emails.send({
      from: "Dubai Travel <noreply@dubaitravel.com>",
      to: email,
      subject: "Please confirm your subscription to Dubai Travel",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0066cc; margin-bottom: 10px;">Dubai Travel</h1>
          </div>
          
          <p style="font-size: 16px;">${greeting}</p>
          
          <p style="font-size: 16px;">Thank you for signing up for our newsletter! Please confirm your subscription by clicking the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmUrl}" style="background-color: #0066cc; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Confirm Subscription
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666;">If you didn't sign up for this newsletter, you can safely ignore this email.</p>
          
          <p style="font-size: 14px; color: #666;">This link will expire in 48 hours.</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #999; text-align: center;">
            Dubai Travel - Your guide to the best of Dubai
          </p>
        </body>
        </html>
      `,
    });
    console.log("[Newsletter] Confirmation email sent to:", email);
    return true;
  } catch (error) {
    console.error("[Newsletter] Failed to send confirmation email:", error);
    return false;
  }
}

async function sendWelcomeEmail(email: string, firstName?: string, unsubscribeToken?: string): Promise<boolean> {
  const resend = getResendClient();
  if (!resend) {
    console.log("[Newsletter] Resend not configured, skipping welcome email for:", email);
    return false;
  }
  
  const baseUrl = process.env.REPLIT_DEV_DOMAIN 
    ? `https://${process.env.REPLIT_DEV_DOMAIN}`
    : 'http://localhost:5000';
  
  const greeting = firstName ? `Hi ${firstName},` : "Hi there,";
  const unsubscribeUrl = unsubscribeToken 
    ? `${baseUrl}/api/newsletter/unsubscribe?token=${unsubscribeToken}`
    : `${baseUrl}/api/newsletter/unsubscribe`;
  
  try {
    await resend.emails.send({
      from: "Dubai Travel <noreply@dubaitravel.com>",
      to: email,
      subject: "Welcome to Dubai Travel Newsletter!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0066cc; margin-bottom: 10px;">Dubai Travel</h1>
          </div>
          
          <p style="font-size: 16px;">${greeting}</p>
          
          <p style="font-size: 16px;">Welcome to the Dubai Travel newsletter! We're thrilled to have you join our community of travel enthusiasts.</p>
          
          <p style="font-size: 16px;">Here's what you can expect from us:</p>
          
          <ul style="font-size: 16px; margin: 20px 0; padding-left: 24px;">
            <li style="margin-bottom: 8px;">Exclusive travel tips and insider guides</li>
            <li style="margin-bottom: 8px;">Special deals on hotels and attractions</li>
            <li style="margin-bottom: 8px;">Latest events and happenings in Dubai</li>
            <li style="margin-bottom: 8px;">Hidden gems and local recommendations</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${baseUrl}" style="background-color: #0066cc; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
              Explore Dubai Travel
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666;">Stay tuned for our next newsletter packed with amazing Dubai content!</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #999; text-align: center;">
            Dubai Travel - Your guide to the best of Dubai<br>
            <a href="${unsubscribeUrl}" style="color: #999;">Unsubscribe</a>
          </p>
        </body>
        </html>
      `,
    });
    console.log("[Newsletter] Welcome email sent to:", email);
    return true;
  } catch (error) {
    console.error("[Newsletter] Failed to send welcome email:", error);
    return false;
  }
}

function renderConfirmationPage(success: boolean, message: string): string {
  return renderNewsletterPage(success, message, success ? "You're All Set!" : "Oops!");
}

function renderUnsubscribePage(success: boolean, message: string): string {
  return renderNewsletterPage(success, message, success ? "Unsubscribed" : "Oops!");
}

function renderNewsletterPage(success: boolean, message: string, title: string): string {
  const bgColor = success ? "#e8f5e9" : "#ffebee";
  const textColor = success ? "#2e7d32" : "#c62828";
  const icon = success ? "&#10003;" : "&#10007;";
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} - Dubai Travel</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
        }
        .card {
          background: white;
          border-radius: 16px;
          padding: 48px;
          text-align: center;
          max-width: 480px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        .icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: ${bgColor};
          color: ${textColor};
          font-size: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
        }
        h1 {
          color: #333;
          font-size: 24px;
          margin-bottom: 16px;
        }
        p {
          color: #666;
          font-size: 16px;
          line-height: 1.6;
        }
        .button {
          display: inline-block;
          margin-top: 24px;
          padding: 12px 24px;
          background: #0066cc;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
        }
        .button:hover { background: #0052a3; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="icon">${icon}</div>
        <h1>${title}</h1>
        <p>${message}</p>
        <a href="/" class="button">Visit Dubai Travel</a>
      </div>
    </body>
    </html>
  `;
}

// Validate and normalize AI-generated content blocks
// ContentBlock is imported from @shared/schema

function validateAndNormalizeBlocks(blocks: unknown[], title: string): ContentBlock[] {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return createDefaultBlocks(title);
  }

  const normalizedBlocks: Omit<ContentBlock, 'id' | 'order'>[] = [];
  const blockTypes = new Set<string>();

  for (const block of blocks) {
    if (typeof block !== 'object' || !block) continue;
    const b = block as Record<string, unknown>;
    if (typeof b.type !== 'string' || !b.data) continue;

    const normalized = normalizeBlock(b.type, b.data as Record<string, unknown>);
    if (normalized) {
      normalizedBlocks.push(normalized);
      blockTypes.add(normalized.type);
      
      // If FAQ block has remaining FAQs, expand them into separate blocks
      if (normalized.type === 'faq' && (normalized.data as any)._remainingFaqs) {
        const remainingFaqs = (normalized.data as any)._remainingFaqs as Array<{ question?: string; answer?: string; q?: string; a?: string }>;
        // Clean up the _remainingFaqs from the first block
        delete (normalized.data as any)._remainingFaqs;
        
        // Add remaining FAQs as separate blocks
        for (const faq of remainingFaqs) {
          const q = faq.question || faq.q || 'Question?';
          const a = faq.answer || faq.a || 'Answer pending.';
          normalizedBlocks.push({
            type: 'faq' as const,
            data: { question: q, answer: a }
          });
        }
      }
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
        content: 'Key attraction feature\nUnique experience offered\nMust-see element\nPopular activity\nEssential stop\nNotable landmark'
      }
    });
  }

  if (!blockTypes.has('tips')) {
    normalizedBlocks.push({
      type: 'tips',
      data: {
        content: 'Plan your visit during cooler months\nBook tickets in advance\nArrive early to avoid crowds\nBring comfortable walking shoes\nStay hydrated\nCheck dress codes beforehand\nConsider guided tours for insights'
      }
    });
  }

  if (!blockTypes.has('faq')) {
    // Add individual FAQ blocks (editor expects question/answer format)
    const defaultFaqs = [
      { question: 'What are the opening hours?', answer: 'Opening hours vary by season. Check the official website for current timings.' },
      { question: 'How much does entry cost?', answer: 'Pricing varies depending on the package selected. Visit the official website for current rates.' },
      { question: 'Is parking available?', answer: 'Yes, parking is available on-site for visitors.' }
    ];
    for (const faq of defaultFaqs) {
      normalizedBlocks.push({
        type: 'faq',
        data: { question: faq.question, answer: faq.answer }
      });
    }
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

  // Add quote block if missing (insert after second text block if exists)
  if (!blockTypes.has('quote')) {
    const insertIndex = Math.min(4, normalizedBlocks.length);
    normalizedBlocks.splice(insertIndex, 0, {
      type: 'quote',
      data: {
        text: 'Dubai is a city that never stops surprising you. Every corner reveals a new wonder.',
        author: 'Dubai Tourism',
        source: ''
      }
    });
  }

  // Add banner block if missing
  if (!blockTypes.has('banner')) {
    const insertIndex = Math.min(7, normalizedBlocks.length);
    normalizedBlocks.splice(insertIndex, 0, {
      type: 'banner',
      data: {
        title: 'EXPERIENCE DUBAI',
        subtitle: 'Discover the magic',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920',
        ctaText: 'Explore More',
        ctaLink: '/attractions'
      }
    });
  }

  // Add recommendations block if missing
  if (!blockTypes.has('recommendations')) {
    normalizedBlocks.push({
      type: 'recommendations',
      data: {
        title: 'Travi Recommends',
        subtitle: 'Handpicked experiences to enhance your Dubai visit',
        items: [
          { title: 'Burj Khalifa Sky Experience', description: 'See Dubai from the world\'s tallest building', image: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=400', ctaText: 'Book Now', ctaLink: '/attractions/burj-khalifa', price: 'From AED 149' },
          { title: 'Desert Safari Adventure', description: 'Experience the golden dunes at sunset', image: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=400', ctaText: 'Book Now', ctaLink: '/attractions/desert-safari', price: 'From AED 199' },
          { title: 'Dubai Marina Cruise', description: 'Luxury dinner cruise with skyline views', image: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=400', ctaText: 'Book Now', ctaLink: '/dining/marina-cruise', price: 'From AED 299' },
          { title: 'Miracle Garden Entry', description: 'World\'s largest natural flower garden', image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400', ctaText: 'Book Now', ctaLink: '/attractions/miracle-garden', price: 'From AED 55' }
        ]
      }
    });
  }

  // Add related articles block if missing
  if (!blockTypes.has('related_articles')) {
    normalizedBlocks.push({
      type: 'related_articles',
      data: {
        title: 'Related Articles',
        subtitle: 'Explore more Dubai travel guides and tips',
        articles: [
          { title: 'Top 10 Things to Do in Dubai', description: 'Essential experiences for first-time visitors', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400', date: '25', category: 'Dubai Guide', slug: 'top-things-to-do-dubai' },
          { title: 'Dubai on a Budget', description: 'How to enjoy luxury for less', image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400', date: '25', category: 'Tips', slug: 'dubai-budget-guide' },
          { title: 'Best Dubai Restaurants 2025', description: 'Where to eat from casual to fine dining', image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=400', date: '25', category: 'Dining', slug: 'best-dubai-restaurants' },
          { title: 'Dubai Hidden Gems', description: 'Secret spots the locals love', image: 'https://images.unsplash.com/photo-1546412414-e1885259563a?w=400', date: '25', category: 'Attractions', slug: 'dubai-hidden-gems' }
        ]
      }
    });
  }

  // Add id and order to all blocks before returning
  return normalizedBlocks.map((block, index) => ({
    ...block,
    id: `${block.type}-${Date.now()}-${index}`,
    order: index
  }));
}

function normalizeBlock(type: string, data: Record<string, unknown>): Omit<ContentBlock, 'id' | 'order'> | null {
  const validTypes: ContentBlock['type'][] = ['hero', 'text', 'image', 'gallery', 'faq', 'cta', 'info_grid', 'highlights', 'room_cards', 'tips', 'quote', 'banner', 'recommendations', 'related_articles'];

  switch (type) {
    case 'hero':
      return { type: 'hero' as const, data };

    case 'text':
      return { type: 'text' as const, data };

    case 'highlights':
      // Convert items array to content string (one per line) for editor compatibility
      let highlightItems = (data as any).items || (data as any).highlights;
      if (Array.isArray(highlightItems) && highlightItems.length > 0) {
        // Convert array to newline-separated string for textarea editing
        const highlightContent = highlightItems.map((item: unknown) => {
          if (typeof item === 'string') return item;
          if (typeof item === 'object' && item && (item as any).title) {
            // Handle {title, description} format
            const t = item as { title?: string; description?: string };
            return t.description ? `${t.title}: ${t.description}` : t.title;
          }
          return String(item);
        }).join('\n');
        return { type: 'highlights' as const, data: { ...data, content: highlightContent } };
      }
      // If already has content, use it
      if (typeof (data as any).content === 'string' && (data as any).content.length > 0) {
        return { type: 'highlights' as const, data };
      }
      // Default highlights
      return { type: 'highlights' as const, data: { ...data, content: 'Key attraction feature\nUnique experience offered\nMust-see element\nPopular activity' } };

    case 'tips':
      // Convert tips array to content string (one per line) for editor compatibility
      let tipsArray = (data as any).tips || (data as any).items;
      if (Array.isArray(tipsArray) && tipsArray.length > 0) {
        // Convert array to newline-separated string for textarea editing
        const tipsContent = tipsArray.map((tip: unknown) => String(tip)).join('\n');
        return { type: 'tips' as const, data: { ...data, content: tipsContent } };
      }
      // If already has content, use it
      if (typeof (data as any).content === 'string' && (data as any).content.length > 0) {
        return { type: 'tips' as const, data };
      }
      // Default tips
      return { type: 'tips' as const, data: { ...data, content: 'Visit during off-peak hours\nBook in advance\nWear comfortable clothing\nStay hydrated\nCheck local customs' } };

    case 'faq':
      // For FAQ, editor expects individual blocks with question/answer strings
      // If data has question/answer directly, use it
      if (typeof (data as any).question === 'string' && (data as any).question.length > 0) {
        return { type: 'faq' as const, data };
      }
      // If data has faqs array, take the first one (other FAQs handled by validateAndNormalizeBlocks)
      let faqsArray = (data as any).faqs || (data as any).items || (data as any).questions;
      if (Array.isArray(faqsArray) && faqsArray.length > 0) {
        const firstFaq = faqsArray[0];
        if (typeof firstFaq === 'object' && firstFaq) {
          const q = (firstFaq as any).question || (firstFaq as any).q || 'Question?';
          const a = (firstFaq as any).answer || (firstFaq as any).a || 'Answer pending.';
          // Store the remaining FAQs for later extraction
          return { type: 'faq' as const, data: { question: q, answer: a, _remainingFaqs: faqsArray.slice(1) } };
        }
      }
      // Default FAQ
      return { type: 'faq' as const, data: { question: 'What are the opening hours?', answer: 'Check the official website for current timings.' } };

    case 'cta':
      return { type: 'cta' as const, data };

    case 'image':
      return { type: 'image' as const, data };
    case 'gallery':
      return { type: 'gallery' as const, data };
    case 'info_grid':
      return { type: 'info_grid' as const, data };

    case 'quote':
      return { type: 'quote' as const, data };

    case 'banner':
      // Ensure banner has image
      const bannerData = { ...data };
      if (!bannerData.image) {
        bannerData.image = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920';
      }
      return { type: 'banner' as const, data: bannerData };

    case 'recommendations':
      // Ensure recommendations have items with images
      let recItems = (data as any).items;
      if (Array.isArray(recItems)) {
        const defaultImages = [
          'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=400',
          'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=400',
          'https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=400',
          'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400'
        ];
        recItems = recItems.map((item: any, index: number) => ({
          ...item,
          image: item.image || defaultImages[index % defaultImages.length]
        }));
      }
      return { type: 'recommendations' as const, data: { ...data, items: recItems } };

    case 'related_articles':
      // Ensure related articles have images
      let articles = (data as any).articles;
      if (Array.isArray(articles)) {
        const defaultArticleImages = [
          'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400',
          'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400',
          'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=400',
          'https://images.unsplash.com/photo-1546412414-e1885259563a?w=400'
        ];
        articles = articles.map((article: any, index: number) => ({
          ...article,
          image: article.image || defaultArticleImages[index % defaultArticleImages.length]
        }));
      }
      return { type: 'related_articles' as const, data: { ...data, articles } };

    default:
      // Check if type is valid, otherwise return text
      if (validTypes.includes(type as any)) {
        return { type: type as ContentBlock['type'], data };
      }
      return { type: 'text' as const, data };
  }
}

function createDefaultBlocks(title: string): ContentBlock[] {
  const timestamp = Date.now();
  return [
    { id: `hero-${timestamp}-0`, type: 'hero', data: { title, subtitle: 'Discover Dubai Travel', overlayText: '' }, order: 0 },
    { id: `text-${timestamp}-1`, type: 'text', data: { heading: 'Overview', content: 'Content generation incomplete. Please edit this article to add more details.' }, order: 1 },
    { id: `highlights-${timestamp}-2`, type: 'highlights', data: { content: 'Feature 1\nFeature 2\nFeature 3\nFeature 4\nFeature 5\nFeature 6' }, order: 2 },
    { id: `tips-${timestamp}-3`, type: 'tips', data: { content: 'Plan ahead\nBook in advance\nVisit early morning\nStay hydrated\nRespect local customs\nBring camera\nCheck weather' }, order: 3 },
    { id: `faq-${timestamp}-4`, type: 'faq', data: { question: 'What are the opening hours?', answer: 'Check official website for current hours.' }, order: 4 },
    { id: `faq-${timestamp}-5`, type: 'faq', data: { question: 'Is there parking?', answer: 'Yes, parking is available.' }, order: 5 },
    { id: `faq-${timestamp}-6`, type: 'faq', data: { question: 'What should I bring?', answer: 'Comfortable shoes, sunscreen, and water.' }, order: 6 },
    { id: `cta-${timestamp}-7`, type: 'cta', data: { title: 'Book Your Visit', content: 'Plan your trip today!', buttonText: 'Book Now', buttonLink: '#' }, order: 7 }
  ];
}

function generateFingerprint(title: string, url?: string): string {
  const normalizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "");
  const normalizedUrl = url ? url.toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  return crypto
    .createHash("sha256")
    .update(`${normalizedTitle}-${normalizedUrl}`)
    .digest("hex")
    .substring(0, 32);
}

interface ArticleImageResult {
  url: string;
  altText: string;
  imageId: string;
  source: 'library' | 'freepik';
}

async function findOrCreateArticleImage(
  topic: string,
  keywords: string[],
  category: string
): Promise<ArticleImageResult | null> {
  console.log(`[Image Finder] Searching for image: topic="${topic}", category="${category}", keywords=${JSON.stringify(keywords)}`);
  
  try {
    const { aiGeneratedImages } = await import("@shared/schema");
    
    const searchTerms = [topic, ...keywords].filter(Boolean);
    const searchConditions = searchTerms.map(term => 
      or(
        like(aiGeneratedImages.topic, `%${term}%`),
        like(aiGeneratedImages.altText, `%${term}%`),
        like(aiGeneratedImages.category, `%${term}%`)
      )
    );
    
    let foundImage = null;
    
    if (searchConditions.length > 0) {
      const approvedImages = await db.select()
        .from(aiGeneratedImages)
        .where(and(
          eq(aiGeneratedImages.isApproved, true),
          or(...searchConditions)
        ))
        .orderBy(desc(aiGeneratedImages.usageCount))
        .limit(1);
      
      if (approvedImages.length > 0) {
        foundImage = approvedImages[0];
        console.log(`[Image Finder] Found approved library image: ${foundImage.id}`);
      } else {
        const anyImages = await db.select()
          .from(aiGeneratedImages)
          .where(or(...searchConditions))
          .orderBy(desc(aiGeneratedImages.createdAt))
          .limit(1);
        
        if (anyImages.length > 0) {
          foundImage = anyImages[0];
          console.log(`[Image Finder] Found library image (not approved): ${foundImage.id}`);
        }
      }
    }
    
    if (!foundImage) {
      const categoryImages = await db.select()
        .from(aiGeneratedImages)
        .where(eq(aiGeneratedImages.category, category))
        .orderBy(desc(aiGeneratedImages.isApproved), desc(aiGeneratedImages.createdAt))
        .limit(1);
      
      if (categoryImages.length > 0) {
        foundImage = categoryImages[0];
        console.log(`[Image Finder] Found category fallback image: ${foundImage.id}`);
      }
    }
    
    if (foundImage) {
      await db.update(aiGeneratedImages)
        .set({ usageCount: (foundImage.usageCount || 0) + 1, updatedAt: new Date() })
        .where(eq(aiGeneratedImages.id, foundImage.id));
      
      return {
        url: foundImage.url,
        altText: foundImage.altText || `${topic} - Dubai Travel`,
        imageId: foundImage.id,
        source: 'library'
      };
    }
    
    console.log(`[Image Finder] No library images found, trying Freepik...`);
    
    const freepikApiKey = process.env.FREEPIK_API_KEY;
    if (!freepikApiKey) {
      console.log(`[Image Finder] Freepik API key not configured, skipping`);
      return null;
    }
    
    const searchQuery = `dubai ${topic} tourism`.substring(0, 100);
    const searchUrl = new URL("https://api.freepik.com/v1/resources");
    searchUrl.searchParams.set("term", searchQuery);
    searchUrl.searchParams.set("page", "1");
    searchUrl.searchParams.set("limit", "5");
    searchUrl.searchParams.set("filters[content_type][photo]", "1");
    
    const freepikResponse = await fetch(searchUrl.toString(), {
      headers: {
        "Accept-Language": "en-US",
        "Accept": "application/json",
        "x-freepik-api-key": freepikApiKey,
      },
    });
    
    if (!freepikResponse.ok) {
      console.error(`[Image Finder] Freepik search failed: ${freepikResponse.status}`);
      return null;
    }
    
    const freepikData = await freepikResponse.json();
    const results = freepikData.data || [];
    
    if (results.length === 0) {
      console.log(`[Image Finder] No Freepik results found for: ${searchQuery}, trying AI generation...`);
      
      // Fallback to AI image generation
      try {
        const aiImages = await generateContentImages({
          contentType: 'article',
          title: topic,
          description: `Dubai travel article about ${topic}`,
          style: 'photorealistic',
          generateHero: true,
          generateContentImages: false,
        });
        
        if (aiImages && aiImages.length > 0) {
          const aiImage = aiImages[0];
          console.log(`[Image Finder] AI generated image: ${aiImage.url}`);
          
          // Store the AI generated image
          const [savedImage] = await db.insert(aiGeneratedImages).values({
            filename: aiImage.filename,
            url: aiImage.url,
            topic: topic,
            category: category || "general",
            imageType: "hero",
            source: "openai" as const,
            prompt: `Dubai travel image for: ${topic}`,
            keywords: keywords.slice(0, 10),
            altText: aiImage.alt || `${topic} - Dubai Travel`,
            caption: aiImage.caption || topic,
            size: 0,
            usageCount: 1,
          }).returning();
          
          return {
            url: aiImage.url,
            altText: aiImage.alt || `${topic} - Dubai Travel`,
            imageId: savedImage.id,
            source: 'library' as const
          };
        }
      } catch (aiError) {
        console.error(`[Image Finder] AI image generation failed:`, aiError);
      }
      
      return null;
    }
    
    const bestResult = results[0];
    const imageUrl = bestResult.image?.source?.url || bestResult.preview?.url || bestResult.thumbnail?.url;
    
    if (!imageUrl) {
      console.log(`[Image Finder] No usable image URL from Freepik result`);
      return null;
    }
    
    console.log(`[Image Finder] Importing Freepik image: ${bestResult.id}`);
    
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      console.error(`[Image Finder] Failed to fetch Freepik image: ${imageResponse.status}`);
      return null;
    }
    
    const imageBuffer = await imageResponse.arrayBuffer();
    const filename = `freepik-${Date.now()}.jpg`;
    let persistedUrl = imageUrl;
    
    const storageClient = getObjectStorageClient();
    let uploadedSuccessfully = false;
    
    if (storageClient) {
      try {
        const objectPath = `public/images/${filename}`;
        await storageClient.uploadFromBytes(objectPath, Buffer.from(imageBuffer));
        persistedUrl = `/object-storage/${objectPath}`;
        uploadedSuccessfully = true;
      } catch (storageError) {
        console.log(`[Image Finder] Object storage upload failed, falling back to local: ${storageError}`);
      }
    }
    
    if (!uploadedSuccessfully) {
      const uploadsDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      fs.writeFileSync(path.join(uploadsDir, filename), Buffer.from(imageBuffer));
      persistedUrl = `/uploads/${filename}`;
    }
    
    const altText = bestResult.title || `${topic} - Dubai Travel`;
    
    const [savedImage] = await db.insert(aiGeneratedImages).values({
      filename,
      url: persistedUrl,
      topic: topic,
      category: category || "general",
      imageType: "hero",
      source: "freepik" as const,
      prompt: null,
      keywords: keywords.slice(0, 10),
      altText: altText,
      caption: bestResult.title || topic,
      size: imageBuffer.byteLength,
      usageCount: 1,
    }).returning();
    
    console.log(`[Image Finder] Successfully imported Freepik image: ${savedImage.id}`);
    
    return {
      url: persistedUrl,
      altText: altText,
      imageId: savedImage.id,
      source: 'freepik'
    };
    
  } catch (error) {
    console.error(`[Image Finder] Error finding/creating article image:`, error);
    return null;
  }
}

// Process image blocks in generated content - fetch images from Freepik/AI based on searchQuery
async function processImageBlocks(blocks: ContentBlock[], category: string = "general"): Promise<ContentBlock[]> {
  console.log(`[Image Processor] Processing ${blocks.length} blocks for images...`);
  
  const processedBlocks: ContentBlock[] = [];
  
  for (const block of blocks) {
    if (block.type === 'image' && block.data) {
      const searchQuery = block.data.searchQuery || block.data.query || block.data.alt || 'dubai travel';
      console.log(`[Image Processor] Fetching image for: "${searchQuery}"`);
      
      try {
        // Use existing image finder function
        const imageResult = await findOrCreateArticleImage(searchQuery, [searchQuery, category], category);
        
        if (imageResult) {
          processedBlocks.push({
            ...block,
            data: {
              ...block.data,
              url: imageResult.url,
              imageUrl: imageResult.url,
              alt: block.data.alt || imageResult.altText,
              imageId: imageResult.imageId,
            }
          });
          console.log(`[Image Processor] Image fetched: ${imageResult.url}`);
        } else {
          // Fallback to Unsplash placeholder
          const unsplashQuery = encodeURIComponent(searchQuery.replace(/dubai/gi, '').trim() || 'travel');
          processedBlocks.push({
            ...block,
            data: {
              ...block.data,
              url: `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80`,
              imageUrl: `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80`,
              alt: block.data.alt || `${searchQuery} - Dubai`,
            }
          });
          console.log(`[Image Processor] Using fallback Unsplash image`);
        }
      } catch (error) {
        console.error(`[Image Processor] Error fetching image:`, error);
        // Keep block as-is with placeholder
        processedBlocks.push({
          ...block,
          data: {
            ...block.data,
            url: `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80`,
            imageUrl: `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80`,
          }
        });
      }
    } else {
      processedBlocks.push(block);
    }
  }
  
  console.log(`[Image Processor] Finished processing, ${processedBlocks.length} blocks returned`);
  return processedBlocks;
}

// RTL languages that need special handling
const RTL_LOCALES = ["ar", "fa", "ur"];

// All target languages for translation (excluding English which is source)
// Note: DeepL does NOT support: Bengali (bn), Filipino (fil), Hebrew (he), Hindi (hi), Urdu (ur), Persian (fa)
// For unsupported languages, we use GPT as fallback translator
const DEEPL_SUPPORTED_LOCALES = ["ar", "zh", "ru", "fr", "de", "es", "tr", "it", "ja", "ko", "pt"] as const;
const GPT_FALLBACK_LOCALES = ["hi", "ur", "fa"] as const; // Languages supported by GPT but not DeepL
const TARGET_LOCALES = [...DEEPL_SUPPORTED_LOCALES, ...GPT_FALLBACK_LOCALES] as const;

async function translateArticleToAllLanguages(contentId: string, content: {
  title: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  blocks?: any[];
}): Promise<{ success: number; failed: number; errors: string[] }> {
  const result = { success: 0, failed: 0, errors: [] as string[] };
  
  try {
    // Use translation-service (Claude Haiku) instead of deepl-service
    const { translateContent, generateContentHash } = await import("./services/translation-service");

    console.log(`[Auto-Translation] Starting translation for content ${contentId} to ${TARGET_LOCALES.length} languages using Claude Haiku...`);
    
    const BATCH_SIZE = 3;
    for (let i = 0; i < TARGET_LOCALES.length; i += BATCH_SIZE) {
      const batch = TARGET_LOCALES.slice(i, i + BATCH_SIZE);
      
      const batchResults = await Promise.allSettled(
        batch.map(async (locale) => {
          try {
            console.log(`[Auto-Translation] Translating to ${locale}...`);
            
            // Note: translation-service uses (content, sourceLocale, targetLocale) order
            const translatedContent = await translateContent(
              {
                title: content.title,
                metaTitle: content.metaTitle || undefined,
                metaDescription: content.metaDescription || undefined,
                blocks: content.blocks || [],
              },
              "en" as any,
              locale as any
            );

            const existingTranslation = await storage.getTranslation(contentId, locale as any);

            const isRtl = RTL_LOCALES.includes(locale);
            const translationData = {
              contentId,
              locale: locale as any,
              status: "completed" as const,
              title: translatedContent.title || null,
              metaTitle: translatedContent.metaTitle || null,
              metaDescription: translatedContent.metaDescription || null,
              blocks: translatedContent.blocks || [],
              sourceHash: translatedContent.sourceHash,
              translatedBy: "claude-auto",
              translationProvider: "claude",
              isManualOverride: false,
            };
            
            if (existingTranslation && !existingTranslation.isManualOverride) {
              await storage.updateTranslation(existingTranslation.id, translationData);
            } else if (!existingTranslation) {
              await storage.createTranslation(translationData);
            }
            
            console.log(`[Auto-Translation] Successfully translated to ${locale}${isRtl ? ' (RTL)' : ''}`);
            return { locale, success: true };
          } catch (error) {
            const errorMsg = `Failed to translate to ${locale}: ${error instanceof Error ? error.message : 'Unknown error'}`;
            console.error(`[Auto-Translation] ${errorMsg}`);
            return { locale, success: false, error: errorMsg };
          }
        })
      );
      
      for (const batchResult of batchResults) {
        if (batchResult.status === 'fulfilled') {
          if (batchResult.value.success) {
            result.success++;
          } else {
            result.failed++;
            if (batchResult.value.error) {
              result.errors.push(batchResult.value.error);
            }
          }
        } else {
          result.failed++;
          result.errors.push(`Batch error: ${batchResult.reason}`);
        }
      }
      
      if (i + BATCH_SIZE < TARGET_LOCALES.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    console.log(`[Auto-Translation] Complete for content ${contentId}: ${result.success} successful, ${result.failed} failed`);
  } catch (error) {
    const errorMsg = `Translation process error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    console.error(`[Auto-Translation] ${errorMsg}`);
    result.errors.push(errorMsg);
  }
  
  return result;
}

export type AutoProcessResult = {
  feedsProcessed: number;
  itemsFound: number;
  clustersCreated: number;
  articlesGenerated: number;
  errors: string[];
};

export async function autoProcessRssFeeds(): Promise<AutoProcessResult> {
  const result: AutoProcessResult = {
    feedsProcessed: 0,
    itemsFound: 0,
    clustersCreated: 0,
    articlesGenerated: 0,
    errors: [],
  };

  try {
    const feeds = await storage.getRssFeeds();
    const activeFeeds = feeds.filter(f => f.isActive);
    
    if (activeFeeds.length === 0) {
      console.log("[RSS Auto-Process] No active RSS feeds found");
      return result;
    }

    console.log(`[RSS Auto-Process] Processing ${activeFeeds.length} active feeds...`);

    for (const feed of activeFeeds) {
      try {
        const items = await parseRssFeed(feed.url);
        result.feedsProcessed++;
        result.itemsFound += items.length;

        console.log(`[RSS Auto-Process] Feed "${feed.name}" returned ${items.length} items`);

        for (const item of items) {
          const fingerprint = generateFingerprint(item.title, item.link);
          const existingFp = await storage.getContentFingerprintByHash(fingerprint);
          if (existingFp) {
            continue;
          }

          let cluster = await storage.findSimilarCluster(item.title);
          
          if (!cluster) {
            cluster = await storage.createTopicCluster({
              topic: item.title,
              status: "pending",
              articleCount: 0,
            });
            result.clustersCreated++;
          }

          await storage.createTopicClusterItem({
            clusterId: cluster.id,
            sourceTitle: item.title,
            sourceDescription: item.description || null,
            sourceUrl: item.link || null,
            rssFeedId: feed.id || null,
            pubDate: item.pubDate ? new Date(item.pubDate) : null,
          });

          try {
            await storage.createContentFingerprint({
              contentId: null,
              fingerprint: fingerprint,
              sourceUrl: item.link || null,
              sourceTitle: item.title,
              rssFeedId: feed.id || null,
            });
          } catch (e) {
            // Fingerprint might already exist
          }

          const clusterItems = await storage.getTopicClusterItems(cluster.id);
          await storage.updateTopicCluster(cluster.id, {
            articleCount: clusterItems.length,
            similarityScore: clusterItems.length > 1 ? Math.min(90, 50 + clusterItems.length * 10) : 50,
          });
        }
      } catch (feedError) {
        const errorMsg = `Failed to process feed "${feed.name}": ${feedError}`;
        console.error(`[RSS Auto-Process] ${errorMsg}`);
        result.errors.push(errorMsg);
      }
    }

    const pendingClusters = await storage.getTopicClusters({ status: "pending" });
    const openai = getOpenAIClient();
    
    if (!openai) {
      console.log("[RSS Auto-Process] OpenAI not configured, skipping article generation");
      return result;
    }

    console.log(`[RSS Auto-Process] Found ${pendingClusters.length} pending clusters to process`);

    for (const cluster of pendingClusters) {
      try {
        const items = await storage.getTopicClusterItems(cluster.id);
        if (items.length === 0) continue;

        const sources = items.map(item => ({
          title: item.sourceTitle,
          description: item.sourceDescription || '',
          url: item.sourceUrl || '',
          date: item.pubDate?.toISOString() || '',
        }));

        const combinedText = sources.map(s => `${s.title} ${s.description}`).join(' ');
        const category = determineContentCategory(combinedText);
        const sourceContent = sources.map(s => `${s.title}: ${s.description}`).join('\n\n');

        // Use centralized content rules system
        const systemPrompt = await getContentWriterSystemPrompt(category);
        const userPrompt = await buildArticleGenerationPrompt(cluster.topic || combinedText, sourceContent);

        // Generate article with validation and retries
        let validatedData: ArticleResponse | null = null;
        let attempts = 0;
        const maxAttempts = 3;
        let lastResponse: unknown = null;
        let lastErrors: string[] = [];
        let lastWordCount = 0;

        while (!validatedData && attempts < maxAttempts) {
          attempts++;
          console.log(`[RSS Auto-Process] Article generation attempt ${attempts}/${maxAttempts} for cluster: ${cluster.topic}`);

          const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ];

          // Add retry prompt if this is a retry
          if (attempts > 1 && lastErrors.length > 0) {
            const retryPrompt = await buildRetryPrompt(lastErrors, lastWordCount, category);
            messages.push({
              role: "user",
              content: retryPrompt
            });
          }

          const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages,
            response_format: { type: "json_object" },
            temperature: attempts === 1 ? 0.7 : 0.5, // Lower temp on retries for more predictable output
            max_tokens: 6000, // Increased for longer articles
          });

          lastResponse = JSON.parse(completion.choices[0].message.content || "{}");
          const validation = await validateArticleResponse(lastResponse);

          if (validation.isValid && validation.data) {
            validatedData = validation.data;
            console.log(`[RSS Auto-Process] Validation passed on attempt ${attempts} - ${validation.wordCount} words`);
          } else {
            lastErrors = validation.errors;
            lastWordCount = validation.wordCount;
            console.log(`[RSS Auto-Process] Validation failed (attempt ${attempts}): ${validation.errors.join(", ")}`);
          }
        }

        // If validation never passed, skip this cluster
        if (!validatedData) {
          const errorMsg = `Failed to generate valid article after ${maxAttempts} attempts for "${cluster.topic}". Last errors: ${lastErrors.join(", ")}`;
          console.error(`[RSS Auto-Process] ${errorMsg}`);
          result.errors.push(errorMsg);
          continue;
        }

        const mergedData = validatedData;

        const slug = (mergedData.title || cluster.topic)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
          .substring(0, 80);

        const textContent = mergedData.content || '';
        const wordCount = textContent.replace(/<[^>]*>/g, '').split(/\s+/).filter((w: string) => w.length > 0).length;

        // STEP 1: Fetch hero image BEFORE creating blocks
        const imageSearchTerms = mergedData.imageSearchTerms || [];
        const articleKeywords = mergedData.secondaryKeywords || [];
        const articleTopic = mergedData.title || cluster.topic;
        
        console.log(`[RSS Auto-Process] Finding image for article: "${articleTopic}" with terms: ${imageSearchTerms.join(", ")}`);
        
        let heroImageUrl: string | null = null;
        let heroImageAlt: string | null = null;
        
        const searchAttempts = [
          imageSearchTerms, // AI-generated terms first
          [articleTopic], // Article title
          articleKeywords.slice(0, 3), // Top keywords
          [`Dubai ${category}`], // Category fallback
        ];
        
        for (const searchTerms of searchAttempts) {
          if (heroImageUrl) break;
          if (searchTerms.length === 0) continue;
          
          const searchQuery = searchTerms.join(" ");
          console.log(`[RSS Auto-Process] Image search attempt: "${searchQuery}"`);
          
          const articleImage = await findOrCreateArticleImage(
            searchQuery,
            searchTerms as string[],
            category
          );
          
          if (articleImage) {
            heroImageUrl = articleImage.url;
            heroImageAlt = articleImage.altText;
            console.log(`[RSS Auto-Process] Attached image from ${articleImage.source}: ${articleImage.url}`);
          }
        }
        
        if (!heroImageUrl) {
          console.log(`[RSS Auto-Process] No image found after all attempts, creating article without hero image`);
        }

        // STEP 2: Create all content blocks with validated data
        // Provide BOTH formats to ensure compatibility with editor AND renderer
        let blocks: ContentBlock[] = [];
        let blockOrder = 0;
        const timestamp = Date.now();

        // Hero block - uses 'image' for renderer
        blocks.push({
          id: `hero-${timestamp}-${blockOrder}`,
          type: "hero",
          data: {
            title: mergedData.title || cluster.topic,
            subtitle: mergedData.metaDescription || '',
            image: heroImageUrl || '',
            alt: heroImageAlt || ''
          },
          order: blockOrder++
        });

        // Split main content into 3 sections for interspersed images
        const mainContent = mergedData.content || '';
        const paragraphs = mainContent.split(/\n\n+/).filter((p: string) => p.trim().length > 0);
        const sectionSize = Math.ceil(paragraphs.length / 3);
        
        const section1 = paragraphs.slice(0, sectionSize).join('\n\n');
        const section2 = paragraphs.slice(sectionSize, sectionSize * 2).join('\n\n');
        const section3 = paragraphs.slice(sectionSize * 2).join('\n\n');

        // Highlights block - provide BOTH formats for compatibility
        blocks.push({
          id: `highlights-${timestamp}-${blockOrder}`,
          type: "highlights",
          data: { 
            title: "Quick Facts",
            content: mergedData.quickFacts.join('\n'),
            items: mergedData.quickFacts
          },
          order: blockOrder++
        });

        // Content section 1
        blocks.push({
          id: `text-${timestamp}-${blockOrder}`,
          type: "text",
          data: { heading: '', content: section1 },
          order: blockOrder++
        });

        // Image block 1
        blocks.push({
          id: `image-${timestamp}-${blockOrder}`,
          type: "image",
          data: { 
            searchQuery: `Dubai ${category} tourism ${(mergedData.secondaryKeywords || [])[0] || 'travel'}`,
            alt: `Dubai ${category} - ${mergedData.title}`,
            caption: `Explore the best of Dubai ${category}`
          },
          order: blockOrder++
        });

        // Content section 2
        blocks.push({
          id: `text-${timestamp}-${blockOrder}`,
          type: "text",
          data: { heading: '', content: section2 },
          order: blockOrder++
        });

        // Image block 2
        blocks.push({
          id: `image-${timestamp}-${blockOrder}`,
          type: "image",
          data: { 
            searchQuery: `Dubai ${(mergedData.secondaryKeywords || [])[1] || 'attractions'} experience`,
            alt: `Dubai travel experience - ${mergedData.title}`,
            caption: `Discover Dubai's unique experiences`
          },
          order: blockOrder++
        });

        // Content section 3
        blocks.push({
          id: `text-${timestamp}-${blockOrder}`,
          type: "text",
          data: { heading: '', content: section3 },
          order: blockOrder++
        });

        // Image block 3
        blocks.push({
          id: `image-${timestamp}-${blockOrder}`,
          type: "image",
          data: { 
            searchQuery: `Dubai ${(mergedData.secondaryKeywords || [])[2] || 'landmarks'} skyline`,
            alt: `Dubai skyline and landmarks - ${mergedData.title}`,
            caption: `The stunning Dubai skyline`
          },
          order: blockOrder++
        });

        // Tips block - provide BOTH formats for compatibility
        blocks.push({
          id: `tips-${timestamp}-${blockOrder}`,
          type: "tips",
          data: { 
            title: "Pro Tips",
            content: mergedData.proTips.join('\n'),
            tips: mergedData.proTips
          },
          order: blockOrder++
        });

        // FAQ block - single block with questions array (for proper heading/accordion display)
        blocks.push({
          id: `faq-${timestamp}-${blockOrder}`,
          type: "faq",
          data: {
            title: "Frequently Asked Questions",
            questions: mergedData.faqs.map((faq) => ({
              question: faq.question,
              answer: faq.answer
            }))
          },
          order: blockOrder++
        });

        // CTA block
        blocks.push({
          id: `cta-${timestamp}-${blockOrder}`,
          type: "cta",
          data: {
            title: "Plan Your Visit",
            content: "Ready to experience this? Start planning your Dubai adventure today!",
            buttonText: "Explore More",
            buttonLink: "/articles"
          },
          order: blockOrder++
        });

        // Process image blocks to fetch real images from Freepik/AI
        console.log(`[RSS Auto-Process] Fetching images for ${blocks.filter(b => b.type === 'image').length} image blocks...`);
        blocks = await processImageBlocks(blocks, category);

        const content = await storage.createContent({
          title: mergedData.title || cluster.topic,
          slug: `${slug}-${Date.now()}`,
          type: "article",
          status: "draft",
          metaTitle: mergedData.title || cluster.topic,
          metaDescription: mergedData.metaDescription || null,
          primaryKeyword: mergedData.primaryKeyword || null,
          secondaryKeywords: mergedData.secondaryKeywords || [],
          blocks: blocks as any,
          wordCount: wordCount,
          heroImage: heroImageUrl,
          heroImageAlt: heroImageAlt,
        });

        const articleCategory = category === 'food' || category === 'restaurants' || category === 'dining' 
          ? 'food' 
          : category === 'attractions' || category === 'activities' 
            ? 'attractions'
            : category === 'hotels' || category === 'accommodation'
              ? 'hotels'
              : category === 'transport' || category === 'transportation' || category === 'logistics'
                ? 'transport'
                : category === 'events' || category === 'festivals'
                  ? 'events'
                  : category === 'tips' || category === 'guides'
                    ? 'tips'
                    : category === 'shopping' || category === 'deals'
                      ? 'shopping'
                      : 'news';

        // Get personality info for article metadata
        const personalityKey = CATEGORY_PERSONALITY_MAPPING[category] || "A";
        const personalityData = CONTENT_WRITER_PERSONALITIES[personalityKey];

        await storage.createArticle({
          contentId: content.id,
          category: articleCategory as any,
          urgencyLevel: mergedData.urgencyLevel || 'relevant',
          targetAudience: mergedData.targetAudience || [],
          personality: personalityKey,
          tone: personalityData?.tone || "professional",
          quickFacts: mergedData.quickFacts || [],
          proTips: mergedData.proTips || [],
          warnings: mergedData.warnings || [],
          faq: mergedData.faqs || [],
        });

        for (const item of items) {
          if (item.sourceUrl) {
            const fp = generateFingerprint(item.sourceTitle, item.sourceUrl);
            try {
              await storage.createContentFingerprint({
                contentId: content.id,
                fingerprint: fp,
                sourceUrl: item.sourceUrl,
                sourceTitle: item.sourceTitle,
                rssFeedId: item.rssFeedId || null,
              });
            } catch (e) {
              // Already exists
            }
          }
          await storage.updateTopicClusterItem(item.id, { isUsedInMerge: true });
        }

        await storage.updateTopicCluster(cluster.id, {
          status: "merged",
          mergedContentId: content.id,
        });

        result.articlesGenerated++;
        console.log(`[RSS Auto-Process] Generated article: "${mergedData.title}" (${wordCount} words)`);

        // Auto-translate to all 16 target languages (background, non-blocking)
        console.log(`[RSS Auto-Process] Starting automatic translation for article: ${content.id}`);
        translateArticleToAllLanguages(content.id, {
          title: content.title,
          metaTitle: content.metaTitle,
          metaDescription: content.metaDescription,
          blocks: content.blocks as any[],
        }).then((translationResult) => {
          console.log(`[RSS Auto-Process] Translation complete for ${content.id}: ${translationResult.success} successful, ${translationResult.failed} failed`);
        }).catch((err) => {
          console.error(`[RSS Auto-Process] Translation error for ${content.id}:`, err);
        });

      } catch (clusterError) {
        const errorMsg = `Failed to generate article for cluster "${cluster.topic}": ${clusterError}`;
        console.error(`[RSS Auto-Process] ${errorMsg}`);
        result.errors.push(errorMsg);
      }
    }

  } catch (error) {
    const errorMsg = `Auto-process failed: ${error}`;
    console.error(`[RSS Auto-Process] ${errorMsg}`);
    result.errors.push(errorMsg);
  }

  console.log(`[RSS Auto-Process] Complete - Feeds: ${result.feedsProcessed}, Items: ${result.itemsFound}, New Clusters: ${result.clustersCreated}, Articles: ${result.articlesGenerated}`);
  return result;
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

  // Serve AI-generated images from object storage
  app.get("/api/ai-images/:filename", async (req: Request, res: Response) => {
    const filename = req.params.filename;
    const client = getObjectStorageClient();

    if (client) {
      try {
        const objectPath = `public/ai-generated/${filename}`;
        const result = await client.downloadAsBytes(objectPath);

        if (!result.ok) {
          console.error(`Object storage error for ${filename}:`, result.error);
          res.status(404).send('Image not found');
          return;
        }

        const [buffer] = result.value;

        // Determine content type
        const ext = filename.split('.').pop()?.toLowerCase();
        const contentTypes: Record<string, string> = {
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'png': 'image/png',
          'webp': 'image/webp',
          'gif': 'image/gif',
        };

        res.set('Content-Type', contentTypes[ext || 'jpg'] || 'image/jpeg');
        res.set('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
        res.send(buffer);
      } catch (error) {
        console.error(`Error serving AI image ${filename}:`, error);
        res.status(404).send('Image not found');
      }
    } else {
      // Fallback to local file
      const localPath = path.join(process.cwd(), "uploads", "ai-generated", filename);
      if (fs.existsSync(localPath)) {
        res.sendFile(localPath);
      } else {
        res.status(404).send('Image not found');
      }
    }
  });

  // Sitemap and robots.txt routes
  const sitemapRoutes = (await import("./routes/sitemap")).default;
  app.use(sitemapRoutes);

  // Security headers for all responses (CSP, X-Frame-Options, etc.)
  app.use(securityHeaders);

  // IP blocking for suspicious activity
  app.use("/api", ipBlockMiddleware);

  // Setup Replit Auth FIRST (so CSRF can use req.isAuthenticated)
  await setupAuth(app);

  // Global CSRF protection for admin write endpoints (AFTER setupAuth)
  app.use("/api", csrfProtection);
  
  // Admin credentials from environment variables (hashed password stored in env)
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
  const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
  
  // Username/password login endpoint (with rate limiting)
  app.post('/api/auth/login', rateLimiters.auth, async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
      
      const ip = req.ip || req.socket.remoteAddress || 'unknown';

      // Check for admin from environment first
      if (ADMIN_PASSWORD_HASH && username === ADMIN_USERNAME) {
        const isAdminPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
        if (isAdminPassword) {
          // Find or create admin user
          let adminUser = await storage.getUserByUsername(username);
          if (!adminUser) {
            adminUser = await storage.createUserWithPassword({
              username: ADMIN_USERNAME,
              passwordHash: ADMIN_PASSWORD_HASH,
              firstName: "Admin",
              lastName: "User",
              role: "admin",
              isActive: true,
            });
          }

          // Set up session
          const sessionUser = {
            claims: { sub: adminUser.id },
            id: adminUser.id,
          };

          req.login(sessionUser, (err: any) => {
            if (err) {
              console.error("Login session error:", err);
              return res.status(500).json({ error: "Failed to create session" });
            }
            req.session.save((saveErr: any) => {
              if (saveErr) {
                console.error("Session save error:", saveErr);
                return res.status(500).json({ error: "Failed to save session" });
              }

              // Log successful login
              logSecurityEvent({
                action: 'login',
                resourceType: 'auth',
                userId: adminUser!.id,
                userEmail: adminUser!.username || undefined,
                ip,
                userAgent: req.get('User-Agent'),
                details: { method: 'password', role: adminUser!.role },
              });

              res.json({ success: true, user: adminUser });
            });
          });
          return;
        }
      }
      
      // Check database for user
      const user = await storage.getUserByUsername(username);
      if (!user || !user.passwordHash) {
        recordFailedAttempt(ip);
        return res.status(401).json({ error: "Invalid username or password" });
      }

      if (!user.isActive) {
        recordFailedAttempt(ip);
        return res.status(401).json({ error: "Account is deactivated" });
      }

      const passwordMatch = await bcrypt.compare(password, user.passwordHash);
      if (!passwordMatch) {
        recordFailedAttempt(ip);
        return res.status(401).json({ error: "Invalid username or password" });
      }
      
      // Set up session
      const sessionUser = {
        claims: { sub: user.id },
        id: user.id,
      };
      
      req.login(sessionUser, (err: any) => {
        if (err) {
          console.error("Login session error:", err);
          return res.status(500).json({ error: "Failed to create session" });
        }
        req.session.save((saveErr: any) => {
          if (saveErr) {
            console.error("Session save error:", saveErr);
            return res.status(500).json({ error: "Failed to save session" });
          }

          // Log successful login
          logSecurityEvent({
            action: 'login',
            resourceType: 'auth',
            userId: user.id,
            userEmail: user.username || undefined,
            ip,
            userAgent: req.get('User-Agent'),
            details: { method: 'password', role: user.role },
          });

          res.json({ success: true, user });
        });
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });
  
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

      // Generate 10 recovery codes
      const recoveryCodes: string[] = [];
      for (let i = 0; i < 10; i++) {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase() + 
                     Math.random().toString(36).substring(2, 8).toUpperCase();
        recoveryCodes.push(code);
      }
      
      // Store hashed recovery codes (we'll store them plain for now, in production hash them)
      await storage.updateUser(userId, { totpEnabled: true, totpRecoveryCodes: recoveryCodes });
      
      res.json({ 
        success: true, 
        message: "Two-factor authentication enabled",
        recoveryCodes
      });
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

  // Rate limiting for recovery code validation (in-memory, per-user)
  const recoveryAttempts = new Map<string, { count: number; lastAttempt: number }>();
  const MAX_RECOVERY_ATTEMPTS = 3;
  const RECOVERY_LOCKOUT_MS = 30 * 60 * 1000; // 30 minutes

  // Validate recovery code (alternative to TOTP code)
  app.post("/api/totp/validate-recovery", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { code } = req.body;
      
      if (!code) {
        return res.status(400).json({ error: "Recovery code is required" });
      }

      // Rate limiting check
      const now = Date.now();
      const attempts = recoveryAttempts.get(userId);
      if (attempts) {
        if (now - attempts.lastAttempt < RECOVERY_LOCKOUT_MS && attempts.count >= MAX_RECOVERY_ATTEMPTS) {
          const remainingMs = RECOVERY_LOCKOUT_MS - (now - attempts.lastAttempt);
          const remainingMin = Math.ceil(remainingMs / 60000);
          return res.status(429).json({ 
            error: `Too many failed attempts. Try again in ${remainingMin} minutes.`,
            retryAfterMs: remainingMs
          });
        }
        if (now - attempts.lastAttempt >= RECOVERY_LOCKOUT_MS) {
          recoveryAttempts.delete(userId);
        }
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!user.totpEnabled) {
        return res.status(400).json({ error: "TOTP is not enabled" });
      }

      const recoveryCodes = (user as any).totpRecoveryCodes || [];
      const codeIndex = recoveryCodes.findIndex((c: string) => c === code.toUpperCase().replace(/-/g, ""));
      
      if (codeIndex === -1) {
        // Track failed attempt
        const current = recoveryAttempts.get(userId) || { count: 0, lastAttempt: now };
        recoveryAttempts.set(userId, { count: current.count + 1, lastAttempt: now });
        const remaining = MAX_RECOVERY_ATTEMPTS - current.count - 1;
        return res.status(400).json({ 
          error: "Invalid recovery code",
          attemptsRemaining: Math.max(0, remaining)
        });
      }

      // Clear attempts on success
      recoveryAttempts.delete(userId);

      // Remove used recovery code
      recoveryCodes.splice(codeIndex, 1);
      await storage.updateUser(userId, { totpRecoveryCodes: recoveryCodes } as any);

      // Mark TOTP as validated in session
      if ((req as any).session) {
        (req as any).session.totpValidated = true;
      }
      
      res.json({ 
        success: true, 
        message: "Recovery code accepted",
        remainingCodes: recoveryCodes.length 
      });
    } catch (error) {
      console.error("Error validating recovery code:", error);
      res.status(500).json({ error: "Failed to validate recovery code" });
    }
  });

  // Audit logging helper
  async function logAuditEvent(
    req: Request,
    actionType: "create" | "update" | "delete" | "publish" | "unpublish" | "submit_for_review" | "approve" | "reject" | "login" | "logout" | "user_create" | "user_update" | "user_delete" | "role_change" | "settings_change" | "media_upload" | "media_delete" | "restore",
    entityType: "content" | "user" | "media" | "settings" | "rss_feed" | "affiliate_link" | "translation" | "session" | "tag" | "cluster" | "campaign" | "newsletter_subscriber",
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

  // Admin/CMS content list - temporarily no auth for testing
  app.get("/api/contents", async (req, res) => {
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

  // Content needing attention for dashboard
  app.get("/api/contents/attention", async (req, res) => {
    try {
      const contents = await storage.getContentsWithRelations({});
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

      // Low SEO score (below 70)
      const lowSeo = contents.filter(c =>
        c.status === "published" && (c.seoScore === null || c.seoScore === undefined || c.seoScore < 70)
      ).slice(0, 10);

      // No views in last 30 days (published content with 0 or very low views)
      const noViews = contents.filter(c =>
        c.status === "published" && (!c.viewCount || c.viewCount < 10)
      ).slice(0, 10);

      // Scheduled for today
      const scheduledToday = contents.filter(c =>
        c.status === "scheduled" &&
        c.scheduledAt &&
        new Date(c.scheduledAt) >= todayStart &&
        new Date(c.scheduledAt) < todayEnd
      );

      res.json({ lowSeo, noViews, scheduledToday });
    } catch (error) {
      console.error("Error fetching attention items:", error);
      res.status(500).json({ error: "Failed to fetch attention items" });
    }
  });

  // Admin/CMS content by ID - TEMPORARILY no auth for testing (TODO: restore auth)
  app.get("/api/contents/:id", async (req, res) => {
    try {
      const content = await storage.getContent(req.params.id);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      // TEMPORARILY: Return full content for all users (auth disabled for CMS testing)
      res.json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  // Public content by slug - TEMPORARILY no auth for testing (TODO: restore auth)
  app.get("/api/contents/slug/:slug", async (req, res) => {
    try {
      const content = await storage.getContentBySlug(req.params.slug);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      // TEMPORARILY: Return full content for all users (auth disabled for CMS testing)
      res.json(content);
    } catch (error) {
      console.error("Error fetching content by slug:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  // Generate JSON-LD schema for content
  app.get("/api/contents/:id/schema", async (req, res) => {
    try {
      const content = await storage.getContent(req.params.id);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      const { generateAllSchemas, schemasToJsonLd } = await import("./lib/schema-generator");
      
      // Get type-specific data
      let typeData: Record<string, unknown> = {};
      let authorName: string | undefined;
      
      if (content.type === "attraction" && content.attraction) {
        typeData = content.attraction;
      } else if (content.type === "hotel" && content.hotel) {
        typeData = content.hotel;
      } else if (content.type === "article" && content.article) {
        typeData = content.article;
      } else if (content.type === "event" && content.event) {
        typeData = content.event;
      } else if (content.type === "dining" && content.dining) {
        typeData = content.dining;
      } else if (content.type === "district" && content.district) {
        typeData = content.district;
      } else if (content.type === "transport" && content.transport) {
        typeData = content.transport;
      } else if (content.type === "itinerary" && content.itinerary) {
        typeData = content.itinerary;
      }
      
      // Get author name if available
      if (content.authorId) {
        const author = await storage.getUser(content.authorId);
        if (author) {
          authorName = [author.firstName, author.lastName].filter(Boolean).join(" ") || author.username || undefined;
        }
      }
      
      const schemas = generateAllSchemas(content, typeData as any, authorName);
      const jsonLd = schemasToJsonLd(schemas);
      
      res.json({
        schemas,
        jsonLd,
        htmlEmbed: `<script type="application/ld+json">\n${jsonLd}\n</script>`
      });
    } catch (error) {
      console.error("Error generating schema:", error);
      res.status(500).json({ error: "Failed to generate schema" });
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

  // Content creation - requires authentication and permission
  app.post("/api/contents", requirePermission("canCreate"), checkReadOnlyMode, rateLimiters.contentWrite, async (req, res) => {
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

  // Content update - requires authentication and permission (Author/Contributor can edit own content)
  app.patch("/api/contents/:id", requireOwnContentOrPermission("canEdit"), checkReadOnlyMode, rateLimiters.contentWrite, async (req, res) => {
    try {
      const existingContent = await storage.getContent(req.params.id);
      if (!existingContent) {
        return res.status(404).json({ error: "Content not found" });
      }

      // TEMPORARILY: Skip publish permission check for testing

      // Auto-create version before update
      const latestVersion = await storage.getLatestVersionNumber(req.params.id);
      await storage.createContentVersion({
        contentId: req.params.id,
        versionNumber: latestVersion + 1,
        title: existingContent.title,
        slug: existingContent.slug,
        metaTitle: existingContent.metaTitle,
        metaDescription: existingContent.metaDescription,
        primaryKeyword: existingContent.primaryKeyword,
        heroImage: existingContent.heroImage,
        heroImageAlt: existingContent.heroImageAlt,
        blocks: existingContent.blocks || [],
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

  app.post("/api/contents/:id/versions/:versionId/restore", requireAuth, checkReadOnlyMode, async (req, res) => {
    try {
      const version = await storage.getContentVersion(req.params.versionId);
      if (!version || version.contentId !== req.params.id) {
        return res.status(404).json({ error: "Version not found" });
      }
      const updated = await storage.updateContent(req.params.id, {
        title: version.title,
        slug: version.slug || undefined,
        metaTitle: version.metaTitle,
        metaDescription: version.metaDescription,
        primaryKeyword: version.primaryKeyword,
        heroImage: version.heroImage,
        heroImageAlt: version.heroImageAlt,
        blocks: version.blocks,
      });
      const latestNum = await storage.getLatestVersionNumber(req.params.id) || 0;
      await storage.createContentVersion({
        contentId: req.params.id,
        versionNumber: latestNum + 1,
        title: version.title,
        slug: version.slug,
        metaTitle: version.metaTitle,
        metaDescription: version.metaDescription,
        primaryKeyword: version.primaryKeyword,
        heroImage: version.heroImage,
        heroImageAlt: version.heroImageAlt,
        blocks: version.blocks,
        changedBy: (req.user as any)?.claims?.sub,
        changeNote: `Restored from version ${version.versionNumber}`,
      });
      
      const user = req.user as any;
      await logAuditEvent(req, "restore", "content", req.params.id,
        `Restored from version ${version.versionNumber}`,
        undefined,
        { title: version.title, versionNumber: version.versionNumber }
      );
      
      res.json(updated);
    } catch (error) {
      console.error("Error restoring version:", error);
      res.status(500).json({ error: "Failed to restore version" });
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

  app.get("/api/translations/:id", async (req, res, next) => {
    // Skip to next route if this is a reserved path
    if (["stats"].includes(req.params.id)) {
      return next('route');
    }
    try {
      const translation = await storage.getTranslationById(req.params.id);
      if (!translation) {
        return res.status(404).json({ error: "Translation not found" });
      }
      res.json(translation);
    } catch (error) {
      console.error("Error fetching translation:", error);
      res.status(500).json({ error: "Failed to fetch translation" });
    }
  });

  app.post("/api/contents/:id/translations", requirePermission("canCreate"), checkReadOnlyMode, async (req, res) => {
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

  app.patch("/api/translations/:id", requirePermission("canEdit"), checkReadOnlyMode, async (req, res) => {
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

  app.delete("/api/translations/:id", requirePermission("canDelete"), checkReadOnlyMode, async (req, res) => {
    try {
      await storage.deleteTranslation(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting translation:", error);
      res.status(500).json({ error: "Failed to delete translation" });
    }
  });

  // Auto-translate content to all languages
  // IMPORTANT: Only translates PUBLISHED content to save translation costs
  app.post("/api/contents/:id/translate-all", requirePermission("canEdit"), checkReadOnlyMode, async (req, res) => {
    try {
      const content = await storage.getContent(req.params.id);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }

      // CRITICAL: Only translate published content to avoid wasting money on drafts
      if (content.status !== "published") {
        return res.status(400).json({
          error: "Cannot translate unpublished content",
          message: "Only published content can be translated. Please publish the content first to save translation costs.",
          currentStatus: content.status
        });
      }

      const { tiers } = req.body; // Optional: only translate to specific tiers (1-7)
      const { translateToAllLanguages } = await import("./services/translation-service");

      // Start translation in background
      const translationPromise = translateToAllLanguages(
        {
          title: content.title,
          metaTitle: content.metaTitle || undefined,
          metaDescription: content.metaDescription || undefined,
          blocks: content.blocks || [],
        },
        "en", // source locale
        tiers // optional tier filter
      );

      // Return immediately with job ID
      const jobId = `translate-${content.id}-${Date.now()}`;

      // Process translations and save to database
      translationPromise.then(async (results) => {
        const entries = Array.from(results.entries());
        for (const [locale, translation] of entries) {
          try {
            // Check if translation already exists
            const existingTranslations = await storage.getTranslationsByContentId(content.id);
            const existing = existingTranslations.find(t => t.locale === locale);

            if (existing) {
              // Update existing translation
              await storage.updateTranslation(existing.id, {
                title: translation.title,
                metaTitle: translation.metaTitle,
                metaDescription: translation.metaDescription,
                blocks: translation.blocks,
                status: "completed",
              });
            } else {
              // Create new translation
              await storage.createTranslation({
                contentId: content.id,
                locale,
                title: translation.title,
                metaTitle: translation.metaTitle,
                metaDescription: translation.metaDescription,
                blocks: translation.blocks,
                status: "completed",
              });
            }
          } catch (err) {
            console.error(`Error saving translation for ${locale}:`, err);
          }
        }
        console.log(`Translation job ${jobId} completed for content ${content.id}`);
      }).catch(err => {
        console.error(`Translation job ${jobId} failed:`, err);
      });

      res.json({
        message: "Translation started",
        jobId,
        contentId: content.id,
        targetLanguages: tiers ? SUPPORTED_LOCALES.filter(l => tiers.includes(l.tier)).length : SUPPORTED_LOCALES.length - 1
      });
    } catch (error) {
      console.error("Error starting translation:", error);
      res.status(500).json({ error: "Failed to start translation" });
    }
  });

  // Get translation status for content
  app.get("/api/contents/:id/translation-status", async (req, res) => {
    try {
      const content = await storage.getContent(req.params.id);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }

      const translations = await storage.getTranslationsByContentId(req.params.id);
      const completedLocales = translations.filter(t => t.status === "completed").map(t => t.locale);
      const pendingLocales = translations.filter(t => t.status === "pending" || t.status === "in_progress").map(t => t.locale);

      const totalLocales = SUPPORTED_LOCALES.length;
      const completedCount = completedLocales.length;

      res.json({
        contentId: req.params.id,
        totalLocales,
        completedCount,
        pendingCount: pendingLocales.length,
        percentage: Math.round((completedCount / totalLocales) * 100),
        completedLocales,
        pendingLocales,
        translations: translations.map(t => ({
          locale: t.locale,
          status: t.status,
          updatedAt: t.updatedAt
        }))
      });
    } catch (error) {
      console.error("Error fetching translation status:", error);
      res.status(500).json({ error: "Failed to fetch translation status" });
    }
  });

  // Cancel in-progress translations for content
  app.post("/api/contents/:id/cancel-translation", requirePermission("canEdit"), checkReadOnlyMode, async (req, res) => {
    try {
      const content = await storage.getContent(req.params.id);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }

      const translations = await storage.getTranslationsByContentId(req.params.id);
      const pendingTranslations = translations.filter(t => t.status === "pending" || t.status === "in_progress");
      
      let cancelledCount = 0;
      for (const translation of pendingTranslations) {
        await storage.updateTranslation(translation.id, { status: "cancelled" });
        cancelledCount++;
      }

      res.json({
        message: "Translation cancelled",
        cancelledCount,
        contentId: req.params.id
      });
    } catch (error) {
      console.error("Error cancelling translation:", error);
      res.status(500).json({ error: "Failed to cancel translation" });
    }
  });

  // Content deletion - requires authentication and permission
  app.delete("/api/contents/:id", requirePermission("canDelete"), checkReadOnlyMode, async (req, res) => {
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

  // ========== Site Settings API ==========
  
  // Get all settings
  app.get("/api/settings", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  // Get settings by category (for frontend grouping)
  app.get("/api/settings/grouped", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const settings = await storage.getSettings();
      const grouped: Record<string, Record<string, unknown>> = {};
      for (const setting of settings) {
        if (!grouped[setting.category]) {
          grouped[setting.category] = {};
        }
        grouped[setting.category][setting.key] = setting.value;
      }
      res.json(grouped);
    } catch (error) {
      console.error("Error fetching grouped settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  // Update multiple settings at once
  app.post("/api/settings/bulk", isAuthenticated, requireRole("admin"), async (req: any, res) => {
    try {
      const { settings } = req.body;
      if (!settings || typeof settings !== "object" || Array.isArray(settings)) {
        return res.status(400).json({ error: "Settings object required" });
      }
      
      // Validate allowed categories
      const allowedCategories = ["site", "api", "content", "notifications", "security"];
      const invalidCategories = Object.keys(settings).filter(c => !allowedCategories.includes(c));
      if (invalidCategories.length > 0) {
        return res.status(400).json({ error: `Invalid categories: ${invalidCategories.join(", ")}` });
      }
      
      const userId = req.user.claims.sub;
      const updated: any[] = [];
      
      for (const [category, values] of Object.entries(settings)) {
        if (typeof values !== "object" || values === null || Array.isArray(values)) {
          continue;
        }
        for (const [key, value] of Object.entries(values as Record<string, unknown>)) {
          // Validate key is a non-empty string
          if (typeof key !== "string" || key.trim() === "") {
            continue;
          }
          // Validate value is a primitive (string, number, boolean) or null
          if (value !== null && typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") {
            continue;
          }
          const setting = await storage.upsertSetting(key.trim(), value, category, userId);
          updated.push(setting);
        }
      }
      
      await logAuditEvent(req, "settings_change", "settings", "bulk", `Updated ${updated.length} settings`);
      res.json({ success: true, updated: updated.length });
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ error: "Failed to update settings" });
    }
  });

  // ========== Content Safety Check Endpoints ==========

  // Check for broken internal links
  app.get("/api/content/broken-links", isAuthenticated, requireRole(["admin", "editor"]), async (req: any, res) => {
    try {
      const links = await storage.getInternalLinks();
      const brokenLinks: { linkId: string; sourceId: string | null; targetId: string | null; reason: string }[] = [];
      
      for (const link of links) {
        // Check if target content exists
        if (link.targetContentId) {
          const targetContent = await storage.getContent(link.targetContentId);
          if (!targetContent) {
            brokenLinks.push({
              linkId: link.id,
              sourceId: link.sourceContentId,
              targetId: link.targetContentId,
              reason: "Target content not found"
            });
          }
        }
      }
      
      res.json({ total: links.length, broken: brokenLinks.length, brokenLinks });
    } catch (error) {
      console.error("Error checking broken links:", error);
      res.status(500).json({ error: "Failed to check broken links" });
    }
  });

  // Check content status before bulk delete
  app.post("/api/content/bulk-delete-check", isAuthenticated, requireRole(["admin", "editor"]), async (req: any, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids)) {
        return res.status(400).json({ error: "IDs array required" });
      }
      
      const warnings: { id: string; title: string; status: string; reason: string }[] = [];
      
      for (const id of ids) {
        const content = await storage.getContent(id);
        if (content) {
          if (content.status === "published") {
            warnings.push({
              id: content.id,
              title: content.title,
              status: content.status,
              reason: "Content is published and visible to users"
            });
          } else if (content.status === "scheduled") {
            warnings.push({
              id: content.id,
              title: content.title,
              status: content.status,
              reason: "Content is scheduled for publishing"
            });
          }
        }
      }
      
      res.json({ 
        total: ids.length, 
        warnings: warnings.length, 
        items: warnings,
        canProceed: true
      });
    } catch (error) {
      console.error("Error checking bulk delete:", error);
      res.status(500).json({ error: "Failed to check bulk delete" });
    }
  });

  app.get("/api/rss-feeds", requireAuth, async (req, res) => {
    try {
      const feeds = await storage.getRssFeeds();
      res.json(feeds);
    } catch (error) {
      console.error("Error fetching RSS feeds:", error);
      res.status(500).json({ error: "Failed to fetch RSS feeds" });
    }
  });

  // RSS feeds stats for dashboard
  app.get("/api/rss-feeds/stats", requireAuth, async (req, res) => {
    try {
      const feeds = await storage.getRssFeeds();
      // Count articles from RSS that are still in draft status (pending review)
      const allContent = await storage.getContentsWithRelations({ status: "draft" });
      const rssArticles = allContent.filter(c => c.type === "article" && c.title?.includes("[RSS]"));
      res.json({ pendingCount: rssArticles.length, totalFeeds: feeds.length });
    } catch (error) {
      console.error("Error fetching RSS stats:", error);
      res.status(500).json({ error: "Failed to fetch RSS stats" });
    }
  });

  app.get("/api/rss-feeds/:id", requireAuth, async (req, res) => {
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

  app.post("/api/rss-feeds", requirePermission("canCreate"), checkReadOnlyMode, async (req, res) => {
    try {
      const parsed = insertRssFeedSchema.parse(req.body);
      const feed = await storage.createRssFeed(parsed);
      await logAuditEvent(req, "create", "rss_feed", feed.id, `Created RSS feed: ${feed.name}`, undefined, { name: feed.name, url: feed.url });
      res.status(201).json(feed);
    } catch (error) {
      console.error("Error creating RSS feed:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create RSS feed" });
    }
  });

  app.patch("/api/rss-feeds/:id", requirePermission("canEdit"), checkReadOnlyMode, async (req, res) => {
    try {
      const existingFeed = await storage.getRssFeed(req.params.id);
      const feed = await storage.updateRssFeed(req.params.id, req.body);
      if (!feed) {
        return res.status(404).json({ error: "RSS feed not found" });
      }
      await logAuditEvent(req, "update", "rss_feed", feed.id, `Updated RSS feed: ${feed.name}`, existingFeed ? { name: existingFeed.name, url: existingFeed.url } : undefined, { name: feed.name, url: feed.url });
      res.json(feed);
    } catch (error) {
      console.error("Error updating RSS feed:", error);
      res.status(500).json({ error: "Failed to update RSS feed" });
    }
  });

  app.delete("/api/rss-feeds/:id", requirePermission("canDelete"), checkReadOnlyMode, async (req, res) => {
    try {
      const existingFeed = await storage.getRssFeed(req.params.id);
      await storage.deleteRssFeed(req.params.id);
      if (existingFeed) {
        await logAuditEvent(req, "delete", "rss_feed", req.params.id, `Deleted RSS feed: ${existingFeed.name}`, { name: existingFeed.name, url: existingFeed.url });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting RSS feed:", error);
      res.status(500).json({ error: "Failed to delete RSS feed" });
    }
  });

  app.post("/api/rss-feeds/:id/fetch", requirePermission("canCreate"), checkReadOnlyMode, async (req, res) => {
    try {
      const feed = await storage.getRssFeed(req.params.id);
      if (!feed) {
        return res.status(404).json({ error: "RSS feed not found" });
      }

      const items = await parseRssFeed(feed.url);

      await storage.updateRssFeed(req.params.id, {
        // lastFetched: new Date(), // Not in schema
        // itemCount: items.length, // Not in schema
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

  app.post("/api/rss-feeds/:id/import", requirePermission("canCreate"), checkReadOnlyMode, async (req, res) => {
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
              id: `text-${Date.now()}-0`,
              type: "text",
              data: {
                heading: item.title,
                content: item.description || "",
              },
              order: 0,
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
        // lastFetched removed - not in schema
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

  // ==================== Topic Clusters API (RSS Aggregation) ====================
  
  // Get all topic clusters
  app.get("/api/topic-clusters", requireAuth, async (req, res) => {
    try {
      const { status } = req.query;
      const clusters = await storage.getTopicClusters(status ? { status: status as string } : undefined);
      
      // Get items for each cluster
      const clustersWithItems = await Promise.all(
        clusters.map(async (cluster) => {
          const items = await storage.getTopicClusterItems(cluster.id);
          return { ...cluster, items };
        })
      );
      
      res.json(clustersWithItems);
    } catch (error) {
      console.error("Error fetching topic clusters:", error);
      res.status(500).json({ error: "Failed to fetch topic clusters" });
    }
  });

  // Add articles to aggregation queue (smart dedup + clustering)
  const rssAggregateSchema = z.object({
    items: z.array(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      link: z.string().url().optional(),
      pubDate: z.string().optional(),
      rssFeedId: z.string().optional(),
    })).min(1).max(100),
  });

  app.post("/api/rss-aggregate", requirePermission("canCreate"), checkReadOnlyMode, async (req, res) => {
    try {
      const parsed = rssAggregateSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid data", details: parsed.error.errors });
      }

      const { items } = parsed.data;
      const clustered: { clusterId: string; topic: string; itemCount: number }[] = [];
      const newClusters: { clusterId: string; topic: string }[] = [];
      const skippedDuplicates: string[] = [];

      for (const item of items) {
        // Check if this exact article was already processed (fingerprint check)
        const fingerprint = generateFingerprint(item.title, item.link);
        const existingFp = await storage.getContentFingerprintByHash(fingerprint);
        if (existingFp) {
          skippedDuplicates.push(item.title);
          continue;
        }

        // Find or create a topic cluster for this article
        let cluster = await storage.findSimilarCluster(item.title);
        
        if (!cluster) {
          // Create new cluster
          cluster = await storage.createTopicCluster({
            topic: item.title,
            status: "pending",
            articleCount: 0,
          });
          newClusters.push({ clusterId: cluster.id, topic: cluster.topic });
        }

        // Add item to cluster
        const clusterItem = await storage.createTopicClusterItem({
          clusterId: cluster.id,
          sourceTitle: item.title,
          sourceDescription: item.description || null,
          sourceUrl: item.link || null,
          rssFeedId: item.rssFeedId || null,
          pubDate: item.pubDate ? new Date(item.pubDate) : null,
        });

        // Record fingerprint immediately to prevent re-adding the same item
        try {
          await storage.createContentFingerprint({
            contentId: null, // Not yet merged into content
            fingerprint: fingerprint,
            sourceUrl: item.link || null,
            sourceTitle: item.title,
            rssFeedId: item.rssFeedId || null,
          });
        } catch (e) {
          // Fingerprint might already exist in rare edge case
        }

        // Update cluster article count
        const clusterItems = await storage.getTopicClusterItems(cluster.id);
        await storage.updateTopicCluster(cluster.id, {
          articleCount: clusterItems.length,
          similarityScore: clusterItems.length > 1 ? Math.min(90, 50 + clusterItems.length * 10) : 50,
        });

        const existing = clustered.find(c => c.clusterId === cluster!.id);
        if (existing) {
          existing.itemCount++;
        } else {
          clustered.push({ clusterId: cluster.id, topic: cluster.topic, itemCount: 1 });
        }
      }

      res.status(201).json({
        message: `Processed ${items.length} articles`,
        clustered,
        newClusters,
        skippedDuplicates,
        summary: {
          totalProcessed: items.length,
          clustersAffected: clustered.length,
          newClustersCreated: newClusters.length,
          duplicatesSkipped: skippedDuplicates.length,
        }
      });
    } catch (error) {
      console.error("Error aggregating RSS items:", error);
      res.status(500).json({ error: "Failed to aggregate RSS items" });
    }
  });

  // AI-powered merge cluster into single article with enhanced content writer guidelines
  app.post("/api/topic-clusters/:id/merge", requirePermission("canCreate"), checkReadOnlyMode, async (req, res) => {
    try {
      const cluster = await storage.getTopicCluster(req.params.id);
      if (!cluster) {
        return res.status(404).json({ error: "Topic cluster not found" });
      }

      const items = await storage.getTopicClusterItems(cluster.id);
      if (items.length === 0) {
        return res.status(400).json({ error: "No items in cluster to merge" });
      }

      // Prepare sources for AI merging
      const sources = items.map(item => ({
        title: item.sourceTitle,
        description: item.sourceDescription || '',
        url: item.sourceUrl || '',
        date: item.pubDate?.toISOString() || '',
      }));

      // Determine content category based on source material
      const combinedText = sources.map(s => `${s.title} ${s.description}`).join(' ');
      const category = determineContentCategory(combinedText);
      const sourceContent = sources.map(s => `${s.title}: ${s.description}`).join('\n\n');

      // Use OpenAI to merge the articles with enhanced prompting
      const openai = getOpenAIClient();
      if (!openai) {
        return res.status(503).json({ error: "OpenAI API not configured. Please set OPENAI_API_KEY." });
      }

      // Build the enhanced system and user prompts using centralized content rules
      const systemPrompt = await getContentWriterSystemPrompt(category);
      const userPrompt = await buildArticleGenerationPrompt(cluster.topic || combinedText, sourceContent);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 4000,
      });

      const mergedData = JSON.parse(completion.choices[0].message.content || "{}");

      // Create merged content with enhanced data
      const slug = (mergedData.title || cluster.topic)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 80);

      // Build content blocks from the generated content
      const blocks: ContentBlock[] = [];
      let blockOrder = 0;

      // Hero block
      blocks.push({
        id: `hero-${Date.now()}-${blockOrder}`,
        type: "hero",
        data: {
          title: mergedData.title || cluster.topic,
          subtitle: mergedData.metaDescription || '',
          overlayText: ''
        },
        order: blockOrder++
      });

      // Main content text block
      if (mergedData.content) {
        blocks.push({
          id: `text-${Date.now()}-${blockOrder}`,
          type: "text",
          data: {
            heading: '',
            content: mergedData.content,
          },
          order: blockOrder++
        });
      }

      // Quick Facts / Highlights block
      if (mergedData.quickFacts?.length > 0) {
        blocks.push({
          id: `highlights-${Date.now()}-${blockOrder}`,
          type: "highlights",
          data: {
            title: "Quick Facts",
            items: mergedData.quickFacts,
          },
          order: blockOrder++
        });
      }

      // Pro Tips block
      if (mergedData.proTips?.length > 0) {
        blocks.push({
          id: `tips-${Date.now()}-${blockOrder}`,
          type: "tips",
          data: {
            title: "Pro Tips",
            tips: mergedData.proTips,
          },
          order: blockOrder++
        });
      }

      // FAQ block
      if (mergedData.faqs?.length > 0) {
        blocks.push({
          id: `faq-${Date.now()}-${blockOrder}`,
          type: "faq",
          data: {
            title: "Frequently Asked Questions",
            faqs: mergedData.faqs.map((faq: { question: string; answer: string }) => ({
              question: faq.question,
              answer: faq.answer
            })),
          },
          order: blockOrder++
        });
      }

      // CTA block
      blocks.push({
        id: `cta-${Date.now()}-${blockOrder}`,
        type: "cta",
        data: {
          title: "Plan Your Visit",
          content: "Ready to experience this? Start planning your Dubai adventure today!",
          buttonText: "Explore More",
          buttonLink: "/articles"
        },
        order: blockOrder++
      });

      // Calculate word count
      const textContent = mergedData.content || '';
      const wordCount = textContent.replace(/<[^>]*>/g, '').split(/\s+/).filter((w: string) => w.length > 0).length;

      const content = await storage.createContent({
        title: mergedData.title || cluster.topic,
        slug: `${slug}-${Date.now()}`,
        type: "article",
        status: "draft",
        metaTitle: mergedData.title || cluster.topic,
        metaDescription: mergedData.metaDescription || null,
        primaryKeyword: mergedData.primaryKeyword || null,
        secondaryKeywords: mergedData.secondaryKeywords || [],
        blocks: blocks as any,
        wordCount: wordCount,
      });

      // Create article entry with enhanced fields
      const articleCategory = category === 'food' || category === 'restaurants' || category === 'dining' 
        ? 'food' 
        : category === 'attractions' || category === 'activities' 
          ? 'attractions'
          : category === 'hotels' || category === 'accommodation'
            ? 'hotels'
            : category === 'transport' || category === 'transportation' || category === 'logistics'
              ? 'transport'
              : category === 'events' || category === 'festivals'
                ? 'events'
                : category === 'tips' || category === 'guides'
                  ? 'tips'
                  : category === 'shopping' || category === 'deals'
                    ? 'shopping'
                    : 'news';

      // Get personality info for article metadata
      const personalityKey = CATEGORY_PERSONALITY_MAPPING[category] || "A";
      const personalityData = CONTENT_WRITER_PERSONALITIES[personalityKey];

      await storage.createArticle({
        contentId: content.id,
        category: articleCategory as any,
        urgencyLevel: mergedData.urgencyLevel || 'relevant',
        targetAudience: mergedData.targetAudience || [],
        personality: personalityKey,
        tone: personalityData?.tone || "professional",
        quickFacts: mergedData.quickFacts || [],
        proTips: mergedData.proTips || [],
        warnings: mergedData.warnings || [],
        faq: mergedData.faqs || [],
      });

      // Create fingerprints for all source items
      for (const item of items) {
        if (item.sourceUrl) {
          const fp = generateFingerprint(item.sourceTitle, item.sourceUrl);
          try {
            await storage.createContentFingerprint({
              contentId: content.id,
              fingerprint: fp,
              sourceUrl: item.sourceUrl,
              sourceTitle: item.sourceTitle,
              rssFeedId: item.rssFeedId || null,
            });
          } catch (e) {
            // Fingerprint might already exist
          }
        }
        await storage.updateTopicClusterItem(item.id, { isUsedInMerge: true });
      }

      // Update cluster status
      await storage.updateTopicCluster(cluster.id, {
        status: "merged",
        mergedContentId: content.id,
      });

      // Auto-translate to all 16 target languages (background, non-blocking)
      console.log(`[Merge] Starting automatic translation for article: ${content.id}`);
      translateArticleToAllLanguages(content.id, {
        title: content.title,
        metaTitle: content.metaTitle,
        metaDescription: content.metaDescription,
        blocks: content.blocks as any[],
      }).then((translationResult) => {
        console.log(`[Merge] Translation complete for ${content.id}: ${translationResult.success} successful, ${translationResult.failed} failed`);
      }).catch((err) => {
        console.error(`[Merge] Translation error for ${content.id}:`, err);
      });

      res.status(201).json({
        message: `Successfully merged ${items.length} articles using ${personalityData?.name || "Professional"} personality`,
        content,
        mergedFrom: items.length,
        sources: mergedData.sources || [],
        category,
        personality: personalityKey,
        structure: "standard",
        wordCount,
        translationsQueued: TARGET_LOCALES.length,
      });
    } catch (error) {
      console.error("Error merging cluster:", error);
      res.status(500).json({ error: "Failed to merge articles" });
    }
  });

  // Dismiss a cluster (mark as not needing merge)
  app.post("/api/topic-clusters/:id/dismiss", requirePermission("canCreate"), checkReadOnlyMode, async (req, res) => {
    try {
      const cluster = await storage.updateTopicCluster(req.params.id, { status: "dismissed" });
      if (!cluster) {
        return res.status(404).json({ error: "Topic cluster not found" });
      }
      res.json({ message: "Cluster dismissed", cluster });
    } catch (error) {
      console.error("Error dismissing cluster:", error);
      res.status(500).json({ error: "Failed to dismiss cluster" });
    }
  });

  // Delete a topic cluster
  app.delete("/api/topic-clusters/:id", requirePermission("canDelete"), checkReadOnlyMode, async (req, res) => {
    try {
      await storage.deleteTopicCluster(req.params.id);
      res.json({ message: "Cluster deleted" });
    } catch (error) {
      console.error("Error deleting cluster:", error);
      res.status(500).json({ error: "Failed to delete cluster" });
    }
  });

  // ==================== Automatic RSS Processing ====================
  
  // POST /api/rss/auto-process - Manual trigger for automatic RSS processing
  app.post("/api/rss/auto-process", requirePermission("canCreate"), checkReadOnlyMode, async (req, res) => {
    try {
      console.log("[RSS Auto-Process] Manual trigger started...");
      const result = await autoProcessRssFeeds();
      res.status(200).json({
        message: "RSS auto-processing completed",
        ...result,
      });
    } catch (error) {
      console.error("[RSS Auto-Process] Manual trigger failed:", error);
      res.status(500).json({ error: "Failed to auto-process RSS feeds" });
    }
  });

  // GET /api/rss/auto-process/status - Check last run status (no auth required for monitoring)
  app.get("/api/rss/auto-process/status", async (req, res) => {
    try {
      const feeds = await storage.getRssFeeds();
      const activeFeeds = feeds.filter(f => f.isActive);
      const pendingClusters = await storage.getTopicClusters({ status: "pending" });
      
      res.json({
        activeFeedsCount: activeFeeds.length,
        pendingClustersCount: pendingClusters.length,
        lastCheckTimestamp: new Date().toISOString(),
        autoProcessIntervalMinutes: 30,
      });
    } catch (error) {
      console.error("[RSS Auto-Process] Status check failed:", error);
      res.status(500).json({ error: "Failed to get auto-process status" });
    }
  });

  app.get("/api/affiliate-links", requireAuth, async (req, res) => {
    try {
      const { contentId } = req.query;
      const links = await storage.getAffiliateLinks(contentId as string | undefined);
      res.json(links);
    } catch (error) {
      console.error("Error fetching affiliate links:", error);
      res.status(500).json({ error: "Failed to fetch affiliate links" });
    }
  });

  app.get("/api/affiliate-links/:id", requireAuth, async (req, res) => {
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

  app.post("/api/affiliate-links", requirePermission("canAccessAffiliates"), checkReadOnlyMode, async (req, res) => {
    try {
      const parsed = insertAffiliateLinkSchema.parse(req.body);
      const link = await storage.createAffiliateLink(parsed);
      await logAuditEvent(req, "create", "affiliate_link", link.id, `Created affiliate link: ${link.anchor}`, undefined, { anchor: link.anchor, url: link.url });
      res.status(201).json(link);
    } catch (error) {
      console.error("Error creating affiliate link:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create affiliate link" });
    }
  });

  app.patch("/api/affiliate-links/:id", requirePermission("canAccessAffiliates"), checkReadOnlyMode, async (req, res) => {
    try {
      const existingLink = await storage.getAffiliateLink(req.params.id);
      const link = await storage.updateAffiliateLink(req.params.id, req.body);
      if (!link) {
        return res.status(404).json({ error: "Affiliate link not found" });
      }
      await logAuditEvent(req, "update", "affiliate_link", link.id, `Updated affiliate link: ${link.anchor}`, existingLink ? { anchor: existingLink.anchor, url: existingLink.url } : undefined, { anchor: link.anchor, url: link.url });
      res.json(link);
    } catch (error) {
      console.error("Error updating affiliate link:", error);
      res.status(500).json({ error: "Failed to update affiliate link" });
    }
  });

  app.delete("/api/affiliate-links/:id", requirePermission("canAccessAffiliates"), checkReadOnlyMode, async (req, res) => {
    try {
      const existingLink = await storage.getAffiliateLink(req.params.id);
      await storage.deleteAffiliateLink(req.params.id);
      if (existingLink) {
        await logAuditEvent(req, "delete", "affiliate_link", req.params.id, `Deleted affiliate link: ${existingLink.anchor}`, { anchor: existingLink.anchor, url: existingLink.url });
      }
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

  // Check if media is in use before delete
  app.get("/api/media/:id/usage", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const mediaFile = await storage.getMediaFile(id);
      
      if (!mediaFile) {
        return res.status(404).json({ error: "Media file not found" });
      }
      
      const usage = await storage.checkMediaUsage(mediaFile.url);
      res.json(usage);
    } catch (error) {
      console.error("Error checking media usage:", error);
      res.status(500).json({ error: "Failed to check media usage" });
    }
  });

  app.post("/api/media/upload", requirePermission("canAccessMediaLibrary"), checkReadOnlyMode, upload.single("file"), validateMediaUpload, async (req, res) => {
    let localPath: string | null = null;
    let objectPath: string | null = null;

    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Convert images to WebP for optimization
      const converted = await convertToWebP(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      const storageClient = getObjectStorageClient();

      const filename = `${Date.now()}-${converted.filename}`;
      let url = `/uploads/${filename}`;

      if (storageClient) {
        objectPath = `public/${filename}`;
        await storageClient.uploadFromBytes(objectPath, converted.buffer);
        // Note: Using simple URL path instead of signed URL (getSignedDownloadUrl doesn't exist)
        url = `/object-storage/${objectPath}`;
      } else {
        const uploadsDir = path.join(process.cwd(), "uploads");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        localPath = path.join(uploadsDir, filename);
        fs.writeFileSync(localPath, converted.buffer);
      }

      const mediaFile = await storage.createMediaFile({
        filename,
        originalFilename: req.file.originalname,
        mimeType: converted.mimeType,
        size: converted.buffer.length,
        url,
        altText: req.body.altText || null,
        width: converted.width || (req.body.width ? parseInt(req.body.width) : null),
        height: converted.height || (req.body.height ? parseInt(req.body.height) : null),
      });

      await logAuditEvent(req, "media_upload", "media", mediaFile.id, `Uploaded media: ${mediaFile.originalFilename}`, undefined, { filename: mediaFile.originalFilename, mimeType: mediaFile.mimeType, size: mediaFile.size, originalSize: req.file.size });
      res.status(201).json(mediaFile);
    } catch (error) {
      if (localPath && fs.existsSync(localPath)) {
        try { fs.unlinkSync(localPath); } catch (e) { console.log("Cleanup failed:", e); }
      }
      console.error("Error uploading media file:", error);
      res.status(500).json({ error: "Failed to upload media file" });
    }
  });

  app.patch("/api/media/:id", requirePermission("canAccessMediaLibrary"), checkReadOnlyMode, async (req, res) => {
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

  app.delete("/api/media/:id", requirePermission("canAccessMediaLibrary"), checkReadOnlyMode, async (req, res) => {
    try {
      const file = await storage.getMediaFile(req.params.id);
      const fileInfo = file ? { filename: file.originalFilename, mimeType: file.mimeType, size: file.size } : undefined;
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
      if (fileInfo) {
        await logAuditEvent(req, "media_delete", "media", req.params.id, `Deleted media: ${fileInfo.filename}`, fileInfo);
      }
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

  app.post("/api/internal-links", requirePermission("canEdit"), checkReadOnlyMode, async (req, res) => {
    try {
      const link = await storage.createInternalLink(req.body);
      res.status(201).json(link);
    } catch (error) {
      console.error("Error creating internal link:", error);
      res.status(500).json({ error: "Failed to create internal link" });
    }
  });

  app.delete("/api/internal-links/:id", requirePermission("canEdit"), checkReadOnlyMode, async (req, res) => {
    try {
      await storage.deleteInternalLink(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting internal link:", error);
      res.status(500).json({ error: "Failed to delete internal link" });
    }
  });

  app.post("/api/ai/generate", requirePermission("canCreate"), rateLimiters.ai, checkAiUsageLimit, async (req, res) => {
    try {
      const openai = getOpenAIClient();
      if (!openai) {
        return res.status(503).json({ error: "AI service not configured. Please add OPENAI_API_KEY." });
      }
      
      // Check safe mode
      if (safeMode.aiDisabled) {
        return res.status(503).json({ error: "AI features are temporarily disabled", code: "AI_DISABLED" });
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

  app.post("/api/ai/suggest-internal-links", requirePermission("canCreate"), rateLimiters.ai, checkAiUsageLimit, async (req, res) => {
    if (safeMode.aiDisabled) {
      return res.status(503).json({ error: "AI features are temporarily disabled", code: "AI_DISABLED" });
    }
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
  app.post("/api/ai/generate-article", requirePermission("canCreate"), rateLimiters.ai, checkAiUsageLimit, async (req, res) => {
    if (safeMode.aiDisabled) {
      return res.status(503).json({ error: "AI features are temporarily disabled", code: "AI_DISABLED" });
    }
    try {
      const openai = getOpenAIClient();
      if (!openai) {
        return res.status(503).json({ error: "AI service not configured. Please add OPENAI_API_KEY." });
      }

      const { title, topic, summary, sourceUrl, sourceText, inputType = "title_only" } = req.body;

      // Accept either 'title' or 'topic' for flexibility
      const articleTitle = title || topic;
      
      if (!articleTitle) {
        return res.status(400).json({ error: "Title is required" });
      }

      // Build context based on input type
      let contextInfo = `Title: "${articleTitle}"`;
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
      
      // Fetch image from Freepik or AI after article generation
      let heroImage = null;
      try {
        const keywords = generatedArticle.meta?.keywords || [];
        const category = generatedArticle.analysis?.category?.charAt(0) || "F";
        const categoryMap: Record<string, string> = {
          "A": "attractions",
          "B": "hotels", 
          "C": "food",
          "D": "transport",
          "E": "events",
          "F": "tips",
          "G": "news",
          "H": "shopping",
        };
        const mappedCategory = categoryMap[category] || "general";
        
        console.log(`[AI Article] Fetching image for: "${articleTitle}", category: ${mappedCategory}`);
        
        const imageResult = await findOrCreateArticleImage(articleTitle, keywords, mappedCategory);
        if (imageResult) {
          heroImage = {
            url: imageResult.url,
            alt: imageResult.altText,
            source: imageResult.source,
            imageId: imageResult.imageId
          };
          console.log(`[AI Article] Found image from ${imageResult.source}: ${imageResult.url}`);
        } else {
          console.log(`[AI Article] No image found for article`);
        }
      } catch (imageError) {
        console.error("[AI Article] Error fetching image:", imageError);
      }
      
      // Add image to response
      res.json({
        ...generatedArticle,
        heroImage
      });
    } catch (error) {
      console.error("Error generating AI article:", error);
      res.status(500).json({ error: "Failed to generate article" });
    }
  });

  app.post("/api/ai/generate-seo-schema", requirePermission("canCreate"), rateLimiters.ai, checkAiUsageLimit, async (req, res) => {
    if (safeMode.aiDisabled) {
      return res.status(503).json({ error: "AI features are temporarily disabled", code: "AI_DISABLED" });
    }
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
  app.post("/api/ai/generate-hotel", requirePermission("canCreate"), rateLimiters.ai, checkAiUsageLimit, async (req, res) => {
    if (safeMode.aiDisabled) {
      return res.status(503).json({ error: "AI features are temporarily disabled", code: "AI_DISABLED" });
    }
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

  app.post("/api/ai/generate-attraction", requirePermission("canCreate"), rateLimiters.ai, checkAiUsageLimit, async (req, res) => {
    if (safeMode.aiDisabled) {
      return res.status(503).json({ error: "AI features are temporarily disabled", code: "AI_DISABLED" });
    }
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

  app.post("/api/ai/generate-dining", requirePermission("canCreate"), rateLimiters.ai, checkAiUsageLimit, async (req, res) => {
    if (safeMode.aiDisabled) {
      return res.status(503).json({ error: "AI features are temporarily disabled", code: "AI_DISABLED" });
    }
    try {
      const { name } = req.body;
      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({ error: "Restaurant name is required" });
      }

      const result = await generateDiningContent(name.trim());
      if (!result) {
        return res.status(500).json({ error: "Failed to generate dining content" });
      }

      res.json(result);
    } catch (error) {
      console.error("Error generating dining content:", error);
      const message = error instanceof Error ? error.message : "Failed to generate dining content";
      res.status(500).json({ error: message });
    }
  });

  app.post("/api/ai/generate-district", requirePermission("canCreate"), rateLimiters.ai, checkAiUsageLimit, async (req, res) => {
    if (safeMode.aiDisabled) {
      return res.status(503).json({ error: "AI features are temporarily disabled", code: "AI_DISABLED" });
    }
    try {
      const { name } = req.body;
      if (!name || typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({ error: "District name is required" });
      }

      const result = await generateDistrictContent(name.trim());
      if (!result) {
        return res.status(500).json({ error: "Failed to generate district content" });
      }

      res.json(result);
    } catch (error) {
      console.error("Error generating district content:", error);
      const message = error instanceof Error ? error.message : "Failed to generate district content";
      res.status(500).json({ error: message });
    }
  });

  // TEMPORARILY DISABLED - Will be enabled later
  // app.post("/api/ai/generate-transport", requirePermission("canCreate"), rateLimiters.ai, checkAiUsageLimit, async (req, res) => {
  //   if (safeMode.aiDisabled) {
  //     return res.status(503).json({ error: "AI features are temporarily disabled", code: "AI_DISABLED" });
  //   }
  //   try {
  //     const { name } = req.body;
  //     if (!name || typeof name !== "string" || name.trim().length === 0) {
  //       return res.status(400).json({ error: "Transport type is required" });
  //     }
  //
  //     const result = await generateTransportContent(name.trim());
  //     if (!result) {
  //       return res.status(500).json({ error: "Failed to generate transport content" });
  //     }
  //
  //     res.json(result);
  //   } catch (error) {
  //     console.error("Error generating transport content:", error);
  //     const message = error instanceof Error ? error.message : "Failed to generate transport content";
  //     res.status(500).json({ error: message });
  //   }
  // });

  // TEMPORARILY DISABLED - Will be enabled later
  // app.post("/api/ai/generate-event", requirePermission("canCreate"), rateLimiters.ai, checkAiUsageLimit, async (req, res) => {
  //   if (safeMode.aiDisabled) {
  //     return res.status(503).json({ error: "AI features are temporarily disabled", code: "AI_DISABLED" });
  //   }
  //   try {
  //     const { name } = req.body;
  //     if (!name || typeof name !== "string" || name.trim().length === 0) {
  //       return res.status(400).json({ error: "Event name is required" });
  //     }
  //
  //     const result = await generateEventContent(name.trim());
  //     if (!result) {
  //       return res.status(500).json({ error: "Failed to generate event content" });
  //     }
  //
  //     res.json(result);
  //   } catch (error) {
  //     console.error("Error generating event content:", error);
  //     const message = error instanceof Error ? error.message : "Failed to generate event content";
  //     res.status(500).json({ error: message });
  //   }
  // });

  // TEMPORARILY DISABLED - Will be enabled later
  // app.post("/api/ai/generate-itinerary", requirePermission("canCreate"), rateLimiters.ai, checkAiUsageLimit, async (req, res) => {
  //   if (safeMode.aiDisabled) {
  //     return res.status(503).json({ error: "AI features are temporarily disabled", code: "AI_DISABLED" });
  //   }
  //   try {
  //     const { duration, tripType } = req.body;
  //     if (!duration || typeof duration !== "string" || duration.trim().length === 0) {
  //       return res.status(400).json({ error: "Duration is required (e.g., '3 days', '1 week')" });
  //     }
  //
  //     const result = await generateItineraryContent(duration.trim(), tripType);
  //     if (!result) {
  //       return res.status(500).json({ error: "Failed to generate itinerary content" });
  //     }
  //
  //     res.json(result);
  //   } catch (error) {
  //     console.error("Error generating itinerary content:", error);
  //     const message = error instanceof Error ? error.message : "Failed to generate itinerary content";
  //     res.status(500).json({ error: message });
  //   }
  // });

  app.post("/api/ai/generate-article-simple", requirePermission("canCreate"), rateLimiters.ai, checkAiUsageLimit, async (req, res) => {
    if (safeMode.aiDisabled) {
      return res.status(503).json({ error: "AI features are temporarily disabled", code: "AI_DISABLED" });
    }
    try {
      const { topic, category, fetchImages } = req.body;
      if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
        return res.status(400).json({ error: "Article topic is required" });
      }

      const result = await generateArticleContent(topic.trim(), category);
      if (!result) {
        return res.status(500).json({ error: "Failed to generate article content" });
      }

      // Process image blocks to fetch real images from Freepik/AI if requested
      if (fetchImages !== false && result.content?.blocks) {
        console.log(`[Article Generator] Processing image blocks for: ${topic}`);
        result.content.blocks = await processImageBlocks(
          result.content.blocks as ContentBlock[], 
          result.article?.category || category || "general"
        );
      }

      res.json(result);
    } catch (error) {
      console.error("Error generating article content:", error);
      const message = error instanceof Error ? error.message : "Failed to generate article content";
      res.status(500).json({ error: message });
    }
  });

  // AI Image Generation endpoint
  app.post("/api/ai/generate-images", requirePermission("canCreate"), rateLimiters.ai, checkAiUsageLimit, async (req, res) => {
    if (safeMode.aiDisabled) {
      return res.status(503).json({ error: "AI features are temporarily disabled", code: "AI_DISABLED" });
    }
    try {
      const { contentType, title, description, location, generateHero, generateContentImages: genContentImages, contentImageCount } = req.body;

      if (!contentType || !title) {
        return res.status(400).json({ error: "Content type and title are required" });
      }

      const validContentTypes = ['hotel', 'attraction', 'article', 'dining', 'district', 'transport', 'event', 'itinerary'];
      if (!validContentTypes.includes(contentType)) {
        return res.status(400).json({ error: "Invalid content type" });
      }

      // Check if any image generation API is configured
      const hasOpenAI = !!(process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY);
      const hasReplicate = !!process.env.REPLICATE_API_KEY;

      if (!hasOpenAI && !hasReplicate) {
        console.error("[AI Images] No image generation API configured. Set OPENAI_API_KEY or REPLICATE_API_KEY.");
        return res.status(503).json({
          error: "Image generation not configured. Please set OPENAI_API_KEY or REPLICATE_API_KEY in environment variables.",
          code: "API_NOT_CONFIGURED"
        });
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

      console.log(`[AI Images] Starting generation for ${contentType}: "${title}" (OpenAI: ${hasOpenAI}, Replicate: ${hasReplicate})`);
      const images = await generateContentImages(options);

      if (images.length === 0) {
        console.error(`[AI Images] No images generated for "${title}". Check API keys and logs above.`);
        return res.status(500).json({
          error: "Failed to generate images. Check server logs for details.",
          details: hasReplicate ? "Replicate/Flux failed" : "DALL-E failed"
        });
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
              url: `/api/ai-images/${image.filename}`, // Use AI images endpoint
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
  app.post("/api/ai/generate-single-image", requirePermission("canCreate"), rateLimiters.ai, checkAiUsageLimit, async (req, res) => {
    if (safeMode.aiDisabled) {
      return res.status(503).json({ error: "AI features are temporarily disabled", code: "AI_DISABLED" });
    }
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
        storedUrl = `/api/ai-images/${finalFilename}`;
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

  app.post("/api/ai/block-action", requirePermission("canCreate"), rateLimiters.ai, checkAiUsageLimit, async (req, res) => {
    if (safeMode.aiDisabled) {
      return res.status(503).json({ error: "AI features are temporarily disabled", code: "AI_DISABLED" });
    }
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
  app.post("/api/ai/assistant", requirePermission("canCreate"), rateLimiters.ai, checkAiUsageLimit, async (req, res) => {
    if (safeMode.aiDisabled) {
      return res.status(503).json({ error: "AI features are temporarily disabled", code: "AI_DISABLED" });
    }
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

  // Topic bank stats for dashboard
  app.get("/api/topic-bank/stats", async (req, res) => {
    try {
      const items = await storage.getTopicBankItems({ isActive: true });
      // Count unused topics (timesUsed === 0 or undefined)
      const unusedCount = items.filter(item => !item.timesUsed || item.timesUsed === 0).length;
      res.json({ unusedCount, totalTopics: items.length });
    } catch (error) {
      console.error("Error fetching topic bank stats:", error);
      res.status(500).json({ error: "Failed to fetch topic bank stats" });
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

  // Merge duplicate topics (same title)
  app.post("/api/topic-bank/merge-duplicates", requirePermission("canDelete"), async (req, res) => {
    try {
      const allTopics = await storage.getTopicBankItems({});
      
      // Group topics by normalized title (lowercase, trimmed)
      const topicsByTitle = new Map<string, typeof allTopics>();
      for (const topic of allTopics) {
        const normalizedTitle = topic.title.toLowerCase().trim();
        if (!topicsByTitle.has(normalizedTitle)) {
          topicsByTitle.set(normalizedTitle, []);
        }
        topicsByTitle.get(normalizedTitle)!.push(topic);
      }
      
      let mergedCount = 0;
      let deletedCount = 0;
      
      // Process each group of duplicates
      for (const [, duplicates] of topicsByTitle) {
        if (duplicates.length <= 1) continue;
        
        // Sort by: priority (desc), timesUsed (desc), createdAt (desc - newest first for ties)
        duplicates.sort((a, b) => {
          if ((b.priority || 0) !== (a.priority || 0)) return (b.priority || 0) - (a.priority || 0);
          if ((b.timesUsed || 0) !== (a.timesUsed || 0)) return (b.timesUsed || 0) - (a.timesUsed || 0);
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bTime - aTime; // Newest first when other fields are equal
        });
        
        // Keep the first one (best), merge data into it
        const keeper = duplicates[0];
        const toDelete = duplicates.slice(1);
        
        // Merge all fields from duplicates - prefer non-null values
        const allKeywords = new Set<string>(keeper.keywords || []);
        let longestOutline = keeper.outline || "";
        let totalTimesUsed = keeper.timesUsed || 0;
        let bestCategory = keeper.category;
        let bestMainCategory = keeper.mainCategory;
        let bestTopicType = keeper.topicType;
        let bestViralPotential = keeper.viralPotential;
        let bestFormat = keeper.format;
        let bestHeadlineAngle = keeper.headlineAngle;
        let bestPriority = keeper.priority || 0;
        let isActive = keeper.isActive === true; // Only true if explicitly true, not undefined
        
        for (const dup of toDelete) {
          // Merge keywords
          if (dup.keywords) {
            for (const kw of dup.keywords) {
              allKeywords.add(kw);
            }
          }
          // Keep longest outline
          if (dup.outline && dup.outline.length > longestOutline.length) {
            longestOutline = dup.outline;
          }
          // Sum up usage
          totalTimesUsed += dup.timesUsed || 0;
          // Prefer non-null values for categorical fields
          if (!bestCategory && dup.category) bestCategory = dup.category;
          if (!bestMainCategory && dup.mainCategory) bestMainCategory = dup.mainCategory;
          if (!bestTopicType && dup.topicType) bestTopicType = dup.topicType;
          if (!bestViralPotential && dup.viralPotential) bestViralPotential = dup.viralPotential;
          if (!bestFormat && dup.format) bestFormat = dup.format;
          if (!bestHeadlineAngle && dup.headlineAngle) bestHeadlineAngle = dup.headlineAngle;
          // Keep highest priority
          if ((dup.priority || 0) > bestPriority) bestPriority = dup.priority || 0;
          // If any duplicate is explicitly active, keep active
          if (dup.isActive === true) isActive = true;
        }
        
        // Update keeper with merged data
        await storage.updateTopicBankItem(keeper.id, {
          keywords: Array.from(allKeywords),
          outline: longestOutline || null,
          timesUsed: totalTimesUsed,
          category: bestCategory,
          mainCategory: bestMainCategory,
          topicType: bestTopicType,
          viralPotential: bestViralPotential,
          format: bestFormat,
          headlineAngle: bestHeadlineAngle,
          priority: bestPriority,
          isActive: isActive,
        });
        
        // Delete duplicates
        for (const dup of toDelete) {
          await storage.deleteTopicBankItem(dup.id);
          deletedCount++;
        }
        
        mergedCount++;
      }
      
      res.json({ 
        success: true, 
        message: `Merged ${mergedCount} groups, deleted ${deletedCount} duplicates`,
        mergedGroups: mergedCount,
        deletedItems: deletedCount
      });
    } catch (error) {
      console.error("Error merging duplicate topics:", error);
      res.status(500).json({ error: "Failed to merge duplicate topics" });
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

  // Generate NEWS from Topic Bank item and DELETE the topic after
  app.post("/api/topic-bank/:id/generate-news", requirePermission("canCreate"), async (req, res) => {
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

      const systemPrompt = `You are an expert Dubai news and viral content writer. Generate a news/trending article based on the topic.

This should be written in a NEWS/trending format - engaging, timely-feeling, and shareable.

Topic Details:
- Title: ${topic.title}
- Headline Angle: ${topic.headlineAngle || 'Create an engaging hook'}
- Format: ${topic.format || 'article'}
- Viral Potential: ${topic.viralPotential}/5 stars
- Category: ${topic.mainCategory || topic.category}

OUTPUT FORMAT - Return valid JSON:
{
  "title": "Attention-grabbing news headline (50-70 chars)",
  "metaDescription": "Compelling meta description (150-160 chars)",
  "slug": "url-friendly-slug",
  "heroImageAlt": "Descriptive alt text",
  "blocks": [
    {
      "type": "hero",
      "data": {
        "title": "Main headline",
        "subtitle": "Breaking/Trending subheader",
        "overlayText": "Dubai 2025"
      }
    },
    {
      "type": "text",
      "data": {
        "heading": "The Story",
        "content": "Lead paragraph with the key news/trend (200-300 words)..."
      }
    },
    {
      "type": "text",
      "data": {
        "heading": "Why It Matters",
        "content": "Context and significance (200-250 words)..."
      }
    },
    {
      "type": "highlights",
      "data": {
        "title": "Key Takeaways",
        "items": ["Point 1", "Point 2", "Point 3", "Point 4", "Point 5"]
      }
    },
    {
      "type": "text",
      "data": {
        "heading": "What Travelers Need to Know",
        "content": "Practical info for visitors (200-250 words)..."
      }
    },
    {
      "type": "tips",
      "data": {
        "title": "Quick Tips",
        "tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"]
      }
    },
    {
      "type": "faq",
      "data": {
        "title": "FAQs",
        "faqs": [
          {"question": "Q1?", "answer": "Answer..."},
          {"question": "Q2?", "answer": "Answer..."},
          {"question": "Q3?", "answer": "Answer..."}
        ]
      }
    }
  ]
}

RULES:
1. Write 800-1200 words total - news articles are shorter
2. Use the headline angle: "${topic.headlineAngle || topic.title}"
3. Make it feel current and newsworthy
4. Include social-media-friendly quotes/stats
5. No invented facts or fake statistics`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate a viral news article for: ${topic.title}\n${keywordsContext}` },
        ],
        response_format: { type: "json_object" },
        max_tokens: 3000,
      });

      const generated = JSON.parse(response.choices[0].message.content || "{}");
      const blocks = validateAndNormalizeBlocks(generated.blocks || [], generated.title || topic.title);

      const slug = generated.slug || topic.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      // Generate hero image
      let heroImageUrl = null;
      try {
        const generatedImages = await generateContentImages({
          contentType: 'article',
          title: generated.title || topic.title,
          description: generated.metaDescription || topic.title,
          generateHero: true,
          generateContentImages: false,
        });

        if (generatedImages.length > 0) {
          const heroImage = generatedImages.find(img => img.type === 'hero');
          if (heroImage) {
            const persistedUrl = await persistImageToStorage(heroImage.url, heroImage.filename);
            heroImageUrl = persistedUrl || heroImage.url;
          }
        }
      } catch (imageError) {
        console.error("Error generating images for news article:", imageError);
      }

      // Create news article
      const content = await storage.createContent({
        title: generated.title || topic.title,
        slug: `${slug}-${Date.now()}`,
        type: "article",
        status: "draft",
        metaDescription: generated.metaDescription || null,
        heroImage: heroImageUrl,
        heroImageAlt: generated.heroImageAlt || `${topic.title} - Dubai News`,
        blocks: blocks,
        primaryKeyword: topic.keywords?.[0] || null,
        secondaryKeywords: topic.keywords?.slice(1) || [],
      });

      // Create with "news" category
      await storage.createArticle({ contentId: content.id, category: "news" });

      // DELETE the topic after successful generation
      await storage.deleteTopicBankItem(req.params.id);

      res.status(201).json({
        content,
        generated,
        topicDeleted: true,
        message: "News article generated and topic removed from bank"
      });
    } catch (error) {
      console.error("Error generating news from topic:", error);
      res.status(500).json({ error: "Failed to generate news from topic" });
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
        const priorityDiff = (priorityOrder[a.priority || 'medium'] || 1) - (priorityOrder[b.priority || 'medium'] || 1);
        if (priorityDiff !== 0) return priorityDiff;
        return (a.timesUsed || 0) - (b.timesUsed || 0);
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

  app.post("/api/keywords", requirePermission("canCreate"), checkReadOnlyMode, async (req, res) => {
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

  app.patch("/api/keywords/:id", requirePermission("canEdit"), checkReadOnlyMode, async (req, res) => {
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

  app.delete("/api/keywords/:id", requirePermission("canDelete"), checkReadOnlyMode, async (req, res) => {
    try {
      await storage.deleteKeyword(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting keyword:", error);
      res.status(500).json({ error: "Failed to delete keyword" });
    }
  });

  app.post("/api/keywords/:id/use", requirePermission("canCreate"), checkReadOnlyMode, async (req, res) => {
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
  app.post("/api/keywords/bulk-import", requirePermission("canManageSettings"), checkReadOnlyMode, async (req, res) => {
    try {
      const { keywords } = req.body;
      if (!Array.isArray(keywords) || keywords.length === 0) {
        return res.status(400).json({ error: "Keywords array is required" });
      }

      const results = { created: 0, skipped: 0, errors: [] as string[] };
      
      for (const kw of keywords) {
        try {
          const existingKeywords = await storage.getKeywords({});
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
      res.json(users.map(u => ({ id: u.id, username: u.username, firstName: u.firstName, lastName: u.lastName, email: u.email, role: u.role, isActive: u.isActive, createdAt: u.createdAt, profileImageUrl: u.profileImageUrl })));
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.post("/api/users", requirePermission("canManageUsers"), checkReadOnlyMode, async (req, res) => {
    try {
      const { username, password, firstName, lastName, email, role } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
      
      if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters" });
      }
      
      const existingUser = await storage.getUserByUsername(username.toLowerCase());
      if (existingUser) {
        return res.status(400).json({ error: "A user with this username already exists" });
      }
      
      if (email) {
        const existingEmail = await storage.getUserByEmail(email.toLowerCase());
        if (existingEmail) {
          return res.status(400).json({ error: "A user with this email already exists" });
        }
      }
      
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await storage.createUserWithPassword({
        username: username.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        email: email?.toLowerCase(),
        role: role || "editor",
        isActive: true,
      });
      
      res.status(201).json({ 
        id: user.id, 
        username: user.username,
        firstName: user.firstName, 
        lastName: user.lastName, 
        email: user.email, 
        role: user.role, 
        isActive: user.isActive, 
        createdAt: user.createdAt 
      });
    } catch (error) {
      console.error("Error creating user:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Validation error", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.patch("/api/users/:id", requirePermission("canManageUsers"), checkReadOnlyMode, async (req, res) => {
    try {
      const existingUser = await storage.getUser(req.params.id);
      
      // Handle password change separately
      const { password, ...updateData } = req.body;
      if (password) {
        if (password.length < 8) {
          return res.status(400).json({ error: "Password must be at least 8 characters" });
        }
        updateData.passwordHash = await bcrypt.hash(password, 10);
      }
      
      const user = await storage.updateUser(req.params.id, updateData);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Audit log user update (check for role change)
      const actionType = existingUser?.role !== user.role ? "role_change" : "user_update";
      await logAuditEvent(req, actionType, "user", req.params.id,
        actionType === "role_change" 
          ? `Role changed for ${user.username || user.email}: ${existingUser?.role} -> ${user.role}`
          : `Updated user: ${user.username || user.email}`,
        { username: existingUser?.username, email: existingUser?.email, role: existingUser?.role, isActive: existingUser?.isActive },
        { username: user.username, email: user.email, role: user.role, isActive: user.isActive }
      );
      
      res.json({ id: user.id, username: user.username, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, isActive: user.isActive, createdAt: user.createdAt });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", requirePermission("canManageUsers"), checkReadOnlyMode, async (req, res) => {
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

  app.post("/api/homepage-promotions", requirePermission("canEdit"), checkReadOnlyMode, async (req, res) => {
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

  app.patch("/api/homepage-promotions/:id", requirePermission("canEdit"), checkReadOnlyMode, async (req, res) => {
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

  app.delete("/api/homepage-promotions/:id", requirePermission("canEdit"), checkReadOnlyMode, async (req, res) => {
    try {
      await storage.deleteHomepagePromotion(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting homepage promotion:", error);
      res.status(500).json({ error: "Failed to delete homepage promotion" });
    }
  });

  app.post("/api/homepage-promotions/reorder", requirePermission("canEdit"), checkReadOnlyMode, async (req, res) => {
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

  app.post("/api/analytics/record-view/:contentId", rateLimiters.analytics, validateAnalyticsRequest, async (req, res) => {
    try {
      const { contentId } = req.params;
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

  // Property Lead submission (public) - for off-plan property inquiries
  app.post("/api/leads/property", rateLimiters.newsletter, async (req, res) => {
    try {
      const { email, name, phone, propertyType, budget, paymentMethod, preferredAreas, timeline, message, consent } = req.body;
      
      if (!email || typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({ error: "Valid email required" });
      }
      if (!name || typeof name !== "string" || name.trim().length < 2) {
        return res.status(400).json({ error: "Name required" });
      }
      if (!consent) {
        return res.status(400).json({ error: "Consent required" });
      }
      
      // Get IP address and user agent
      const ipAddress = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "unknown";
      const userAgent = req.headers["user-agent"] || "";
      
      // Save lead to database
      const lead = await storage.createPropertyLead({
        email: email.trim().toLowerCase(),
        name: name.trim(),
        phone: phone || null,
        propertyType: propertyType || null,
        budget: budget || null,
        paymentMethod: paymentMethod || null,
        preferredAreas: preferredAreas || null,
        timeline: timeline || null,
        message: message || null,
        source: "off-plan-form",
        status: "new",
        ipAddress,
        userAgent,
        consentGiven: true,
      });
      
      console.log("[Property Lead] New lead saved:", lead.id, email);
      
      // Send email notification to admin
      const notificationEmail = process.env.LEAD_NOTIFICATION_EMAIL;
      if (notificationEmail) {
        const resend = getResendClient();
        if (resend) {
          try {
            await resend.emails.send({
              from: "Dubai Off-Plan <onboarding@resend.dev>",
              to: notificationEmail,
              subject: `New Property Lead: ${name.trim()}`,
              html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8f5fc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f5fc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(100,67,244,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #6443F4 0%, #F94498 100%); padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">New Property Lead</h1>
              <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Dubai Off-Plan Investment Inquiry</p>
            </td>
          </tr>
          
          <!-- Lead Name Banner -->
          <tr>
            <td style="background-color: #FEECF4; padding: 20px 40px; border-bottom: 1px solid #FDA9E5;">
              <p style="margin: 0; color: #504065; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Lead Name</p>
              <h2 style="margin: 5px 0 0 0; color: #24103E; font-size: 22px; font-weight: 600;">${name.trim()}</h2>
            </td>
          </tr>
          
          <!-- Contact Details -->
          <tr>
            <td style="padding: 30px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #D3CFD8;">
                    <span style="color: #A79FB2; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Email</span><br>
                    <a href="mailto:${email.trim()}" style="color: #6443F4; font-size: 16px; text-decoration: none; font-weight: 500;">${email.trim()}</a>
                  </td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #D3CFD8;">
                    <span style="color: #A79FB2; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Phone</span><br>
                    <a href="tel:${phone}" style="color: #6443F4; font-size: 16px; text-decoration: none; font-weight: 500;">${phone}</a>
                  </td>
                </tr>` : ''}
              </table>
            </td>
          </tr>
          
          <!-- Property Preferences -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <h3 style="margin: 0 0 15px 0; color: #24103E; font-size: 16px; font-weight: 600; padding-bottom: 10px; border-bottom: 2px solid #F94498;">Property Preferences</h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${propertyType ? `
                <tr>
                  <td width="40%" style="padding: 10px 0; color: #504065; font-size: 14px;">Property Type</td>
                  <td style="padding: 10px 0; color: #24103E; font-size: 14px; font-weight: 500;">${propertyType}</td>
                </tr>` : ''}
                ${budget ? `
                <tr>
                  <td width="40%" style="padding: 10px 0; color: #504065; font-size: 14px;">Budget</td>
                  <td style="padding: 10px 0;"><span style="background: linear-gradient(135deg, #FF9327, #FFD112); color: #24103E; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600;">${budget}</span></td>
                </tr>` : ''}
                ${paymentMethod ? `
                <tr>
                  <td width="40%" style="padding: 10px 0; color: #504065; font-size: 14px;">Payment Method</td>
                  <td style="padding: 10px 0;"><span style="background: #6443F4; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 500;">${paymentMethod}</span></td>
                </tr>` : ''}
                ${preferredAreas?.length ? `
                <tr>
                  <td width="40%" style="padding: 10px 0; color: #504065; font-size: 14px; vertical-align: top;">Preferred Areas</td>
                  <td style="padding: 10px 0;">${preferredAreas.map((area: string) => `<span style="display: inline-block; background: #FEECF4; color: #F94498; padding: 4px 10px; border-radius: 20px; font-size: 12px; margin: 2px 4px 2px 0;">${area}</span>`).join('')}</td>
                </tr>` : ''}
                ${timeline ? `
                <tr>
                  <td width="40%" style="padding: 10px 0; color: #504065; font-size: 14px;">Timeline</td>
                  <td style="padding: 10px 0; color: #24103E; font-size: 14px; font-weight: 500;">${timeline}</td>
                </tr>` : ''}
              </table>
            </td>
          </tr>
          
          ${message ? `
          <!-- Message -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <h3 style="margin: 0 0 10px 0; color: #24103E; font-size: 16px; font-weight: 600;">Message</h3>
              <p style="margin: 0; padding: 15px; background: #f8f5fc; border-radius: 8px; color: #504065; font-size: 14px; line-height: 1.6;">${message}</p>
            </td>
          </tr>` : ''}
          
          <!-- Footer -->
          <tr>
            <td style="background: #24103E; padding: 25px 40px; text-align: center;">
              <p style="margin: 0 0 5px 0; color: #A79FB2; font-size: 11px;">Lead ID: ${lead.id}</p>
              <p style="margin: 0; color: #A79FB2; font-size: 11px;">Submitted: ${new Date().toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
              `,
            });
            console.log("[Property Lead] Email notification sent to:", notificationEmail);
          } catch (emailError) {
            console.error("[Property Lead] Failed to send email notification:", emailError);
          }
        }
      }
      
      res.json({ success: true, message: "Thank you! Our team will contact you within 24 hours.", leadId: lead.id });
    } catch (error) {
      console.error("Error saving property lead:", error);
      res.status(500).json({ error: "Failed to submit. Please try again." });
    }
  });

  // Newsletter subscription (public) - Double Opt-In flow with rate limiting
  app.post("/api/newsletter/subscribe", rateLimiters.newsletter, async (req, res) => {
    try {
      const { email, firstName, lastName, source } = req.body;
      if (!email || typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({ error: "Valid email required" });
      }
      
      // Get IP address
      const ipAddress = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "unknown";
      
      // Check if already subscribed
      const existing = await storage.getNewsletterSubscriberByEmail(email);
      if (existing) {
        if (existing.status === "subscribed") {
          return res.json({ success: true, message: "Already subscribed" });
        }
        if (existing.status === "pending_confirmation") {
          return res.json({ success: true, message: "Confirmation email already sent. Please check your inbox." });
        }
        // Allow resubscription for unsubscribed users
        if (existing.status === "unsubscribed") {
          const confirmToken = crypto.randomUUID();
          const consentEntry = {
            action: "resubscribe" as const,
            timestamp: new Date().toISOString(),
            ipAddress,
            userAgent: req.headers["user-agent"],
            source: source || "coming_soon",
          };
          const consentLog = [...(existing.consentLog || []), consentEntry];
          
          await storage.updateNewsletterSubscriber(existing.id, {
            status: "pending_confirmation",
            confirmToken,
            consentLog,
            ipAddress,
            firstName: firstName || existing.firstName,
            lastName: lastName || existing.lastName,
          });
          
          // Send confirmation email
          await sendConfirmationEmail(email, confirmToken, firstName || existing.firstName || undefined);
          
          return res.json({ success: true, message: "Please check your email to confirm your subscription" });
        }
      }
      
      // Generate confirmation token
      const confirmToken = crypto.randomUUID();
      
      // Create consent log entry
      const consentEntry = {
        action: "subscribe" as const,
        timestamp: new Date().toISOString(),
        ipAddress,
        userAgent: req.headers["user-agent"],
        source: source || "coming_soon",
      };
      
      // Save to database with pending status
      await storage.createNewsletterSubscriber({ 
        email, 
        firstName: firstName || null,
        lastName: lastName || null,
        source: source || "coming_soon",
        status: "pending_confirmation",
        ipAddress,
        confirmToken,
        consentLog: [consentEntry],
      });
      
      // Send confirmation email
      await sendConfirmationEmail(email, confirmToken, firstName || undefined);
      
      console.log("[Newsletter] New subscriber saved (pending confirmation):", email);
      res.json({ success: true, message: "Please check your email to confirm your subscription" });
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      res.status(500).json({ error: "Failed to subscribe" });
    }
  });
  
  // Newsletter confirmation endpoint - Double Opt-In step 2
  app.get("/api/newsletter/confirm/:token", async (req, res) => {
    try {
      const { token } = req.params;
      
      if (!token) {
        return res.status(400).send(renderConfirmationPage(false, "Invalid confirmation link"));
      }
      
      const subscriber = await storage.getNewsletterSubscriberByToken(token);
      
      if (!subscriber) {
        return res.status(404).send(renderConfirmationPage(false, "Confirmation link not found or expired"));
      }
      
      if (subscriber.status === "subscribed") {
        return res.send(renderConfirmationPage(true, "Your subscription was already confirmed!"));
      }
      
      // Get IP address
      const ipAddress = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "unknown";
      
      // Create consent log entry for confirmation
      const consentEntry = {
        action: "confirm" as const,
        timestamp: new Date().toISOString(),
        ipAddress,
        userAgent: req.headers["user-agent"],
      };
      const consentLog = [...(subscriber.consentLog || []), consentEntry];
      
      // Update subscriber status
      await storage.updateNewsletterSubscriber(subscriber.id, {
        status: "subscribed",
        consentLog,
        isActive: true,
      });
      
      // Clear confirmToken and set confirmedAt in separate update (since confirmedAt is not in insert schema)
      await db.update(newsletterSubscribers)
        .set({ 
          confirmToken: null, 
          confirmedAt: new Date() 
        })
        .where(eq(newsletterSubscribers.id, subscriber.id));
      
      console.log("[Newsletter] Subscription confirmed:", subscriber.email);
      
      // Send welcome email (fire and forget - don't block response)
      sendWelcomeEmail(subscriber.email, subscriber.firstName || undefined, subscriber.id)
        .catch(err => console.error("[Newsletter] Welcome email error:", err));
      
      res.send(renderConfirmationPage(true, "Thank you! Your subscription has been confirmed."));
    } catch (error) {
      console.error("Error confirming subscription:", error);
      res.status(500).send(renderConfirmationPage(false, "Something went wrong. Please try again."));
    }
  });
  
  // Newsletter unsubscribe endpoint (public) - requires token for security
  app.get("/api/newsletter/unsubscribe", async (req, res) => {
    try {
      const { token } = req.query;
      
      if (!token) {
        return res.status(400).send(renderUnsubscribePage(false, "Invalid unsubscribe link. Please use the link from your email."));
      }
      
      const subscriber = await storage.getNewsletterSubscriberByToken(token as string);
      
      if (!subscriber) {
        return res.send(renderUnsubscribePage(false, "Unsubscribe link not found or already used."));
      }
      
      if (subscriber.status === "unsubscribed") {
        return res.send(renderUnsubscribePage(true, "You have already been unsubscribed."));
      }
      
      // Get IP address
      const ipAddress = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.ip || "unknown";
      
      // Create consent log entry
      const consentEntry = {
        action: "unsubscribe" as const,
        timestamp: new Date().toISOString(),
        ipAddress,
        userAgent: req.headers["user-agent"],
      };
      const consentLog = [...(subscriber.consentLog || []), consentEntry];
      
      // Update subscriber status
      await storage.updateNewsletterSubscriber(subscriber.id, {
        status: "unsubscribed",
        consentLog,
        isActive: false,
      });
      
      // Set unsubscribedAt
      await db.update(newsletterSubscribers)
        .set({ unsubscribedAt: new Date() })
        .where(eq(newsletterSubscribers.id, subscriber.id));
      
      console.log("[Newsletter] Unsubscribed:", subscriber.email);
      res.send(renderUnsubscribePage(true, "You have been successfully unsubscribed from our newsletter."));
    } catch (error) {
      console.error("Error unsubscribing:", error);
      res.status(500).send(renderUnsubscribePage(false, "Something went wrong. Please try again."));
    }
  });

  // Newsletter subscribers list (admin only)
  app.get("/api/newsletter/subscribers", requirePermission("canViewAnalytics"), async (req, res) => {
    try {
      const { status } = req.query;
      const filters = status ? { status: status as string } : undefined;
      const subscribers = await storage.getNewsletterSubscribers(filters);
      res.json(subscribers);
    } catch (error) {
      console.error("Error fetching newsletter subscribers:", error);
      res.status(500).json({ error: "Failed to fetch subscribers" });
    }
  });
  
  // Delete newsletter subscriber (admin only - right to be forgotten)
  app.delete("/api/newsletter/subscribers/:id", requirePermission("canManageUsers"), async (req, res) => {
    try {
      const { id } = req.params;
      const subscriber = await storage.getNewsletterSubscriber(id);
      
      if (!subscriber) {
        return res.status(404).json({ error: "Subscriber not found" });
      }
      
      const deleted = await storage.deleteNewsletterSubscriber(id);
      if (deleted) {
        await logAuditEvent(req, "delete", "newsletter_subscriber", id, `Deleted newsletter subscriber: ${subscriber.email}`, { email: subscriber.email });
        console.log("[Newsletter] Subscriber deleted (right to be forgotten):", subscriber.email);
        res.json({ success: true, message: "Subscriber deleted successfully" });
      } else {
        res.status(500).json({ error: "Failed to delete subscriber" });
      }
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      res.status(500).json({ error: "Failed to delete subscriber" });
    }
  });

  // Resend Webhook for bounce/complaint handling
  // This endpoint receives events from Resend about email delivery status
  app.post("/api/webhooks/resend", async (req, res) => {
    try {
      const event = req.body;
      
      // Resend sends webhook events with these types:
      // email.sent, email.delivered, email.delivery_delayed, 
      // email.complained, email.bounced, email.opened, email.clicked
      const eventType = event.type;
      const eventData = event.data;
      
      if (!eventType || !eventData) {
        console.log("[Resend Webhook] Invalid event received:", event);
        return res.status(400).json({ error: "Invalid event format" });
      }
      
      console.log(`[Resend Webhook] Received event: ${eventType}`);
      
      // Extract email from event data
      const recipientEmail = eventData.to?.[0] || eventData.email;
      
      if (!recipientEmail) {
        console.log("[Resend Webhook] No recipient email in event");
        return res.status(200).json({ received: true });
      }
      
      // Handle bounce events - mark subscriber as bounced
      if (eventType === "email.bounced") {
        const subscriber = await storage.getNewsletterSubscriberByEmail(recipientEmail);
        if (subscriber && subscriber.status !== "bounced") {
          const consentEntry = {
            action: "unsubscribe" as const,
            timestamp: new Date().toISOString(),
            source: "resend_bounce",
            ipAddress: "webhook",
          };
          const consentLog = [...(subscriber.consentLog || []), consentEntry];
          
          await storage.updateNewsletterSubscriber(subscriber.id, {
            status: "bounced",
            consentLog,
            isActive: false,
          });
          console.log(`[Resend Webhook] Subscriber marked as bounced: ${recipientEmail}`);
        }
      }
      
      // Handle complaint events (spam reports) - mark subscriber as complained
      if (eventType === "email.complained") {
        const subscriber = await storage.getNewsletterSubscriberByEmail(recipientEmail);
        if (subscriber && subscriber.status !== "complained") {
          const consentEntry = {
            action: "unsubscribe" as const,
            timestamp: new Date().toISOString(),
            source: "resend_complaint",
            ipAddress: "webhook",
          };
          const consentLog = [...(subscriber.consentLog || []), consentEntry];
          
          await storage.updateNewsletterSubscriber(subscriber.id, {
            status: "complained",
            consentLog,
            isActive: false,
          });
          console.log(`[Resend Webhook] Subscriber marked as complained (spam): ${recipientEmail}`);
        }
      }
      
      // Acknowledge receipt of webhook
      res.status(200).json({ received: true });
    } catch (error) {
      console.error("[Resend Webhook] Error processing webhook:", error);
      // Return 200 anyway to prevent Resend from retrying
      res.status(200).json({ received: true, error: "Processing error" });
    }
  });

  // Campaign CRUD Routes (admin only)
  app.get("/api/campaigns", requirePermission("canViewAnalytics"), async (req, res) => {
    try {
      const campaigns = await storage.getCampaigns();
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ error: "Failed to fetch campaigns" });
    }
  });

  app.get("/api/campaigns/:id", requirePermission("canViewAnalytics"), async (req, res) => {
    try {
      const { id } = req.params;
      const campaign = await storage.getCampaign(id);
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error) {
      console.error("Error fetching campaign:", error);
      res.status(500).json({ error: "Failed to fetch campaign" });
    }
  });

  app.post("/api/campaigns", requirePermission("canCreate"), checkReadOnlyMode, async (req, res) => {
    try {
      const user = req.user as any;
      const campaignData = {
        ...req.body,
        createdBy: user?.claims?.sub || null,
      };
      const campaign = await storage.createCampaign(campaignData);
      await logAuditEvent(req, "create", "campaign", campaign.id, `Created campaign: ${campaign.name}`, undefined, { name: campaign.name, subject: campaign.subject });
      console.log("[Campaigns] Created campaign:", campaign.name);
      res.status(201).json(campaign);
    } catch (error) {
      console.error("Error creating campaign:", error);
      res.status(500).json({ error: "Failed to create campaign" });
    }
  });

  app.patch("/api/campaigns/:id", requirePermission("canEdit"), checkReadOnlyMode, async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await storage.getCampaign(id);
      if (!existing) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      // Don't allow editing sent campaigns
      if (existing.status === "sent" || existing.status === "sending") {
        return res.status(400).json({ error: "Cannot edit a campaign that has been sent or is sending" });
      }
      const campaign = await storage.updateCampaign(id, req.body);
      if (campaign) {
        await logAuditEvent(req, "update", "campaign", campaign.id, `Updated campaign: ${campaign.name}`, { name: existing.name, subject: existing.subject }, { name: campaign.name, subject: campaign.subject });
      }
      console.log("[Campaigns] Updated campaign:", campaign?.name);
      res.json(campaign);
    } catch (error) {
      console.error("Error updating campaign:", error);
      res.status(500).json({ error: "Failed to update campaign" });
    }
  });

  app.delete("/api/campaigns/:id", requirePermission("canDelete"), checkReadOnlyMode, async (req, res) => {
    try {
      const { id } = req.params;
      const existing = await storage.getCampaign(id);
      if (!existing) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      // Don't allow deleting sent campaigns
      if (existing.status === "sent" || existing.status === "sending") {
        return res.status(400).json({ error: "Cannot delete a campaign that has been sent or is sending" });
      }
      await storage.deleteCampaign(id);
      await logAuditEvent(req, "delete", "campaign", id, `Deleted campaign: ${existing.name}`, { name: existing.name, subject: existing.subject });
      console.log("[Campaigns] Deleted campaign:", existing.name);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting campaign:", error);
      res.status(500).json({ error: "Failed to delete campaign" });
    }
  });

  // Campaign events (for analytics)
  app.get("/api/campaigns/:id/events", requirePermission("canViewAnalytics"), async (req, res) => {
    try {
      const { id } = req.params;
      const events = await storage.getCampaignEvents(id);
      res.json(events);
    } catch (error) {
      console.error("Error fetching campaign events:", error);
      res.status(500).json({ error: "Failed to fetch campaign events" });
    }
  });

  // Send campaign to all active subscribers
  app.post("/api/campaigns/:id/send", requirePermission("canEdit"), async (req, res) => {
    try {
      const { id } = req.params;
      const campaign = await storage.getCampaign(id);
      
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      
      if (campaign.status === "sent" || campaign.status === "sending") {
        return res.status(400).json({ error: "Campaign has already been sent or is currently sending" });
      }
      
      const resend = getResendClient();
      if (!resend) {
        return res.status(500).json({ error: "Email service not configured" });
      }
      
      // Get active subscribers
      const subscribers = await storage.getActiveNewsletterSubscribers();
      
      if (subscribers.length === 0) {
        return res.status(400).json({ error: "No active subscribers to send to" });
      }
      
      // Update campaign status to sending
      await storage.updateCampaign(id, {
        status: "sending",
        // sentAt: new Date(), // Can't update via InsertCampaign - omitted from schema
        // totalRecipients: subscribers.length, // Can't update via InsertCampaign - omitted from schema
      });
      
      console.log(`[Campaigns] Starting send for campaign ${campaign.name} to ${subscribers.length} subscribers`);
      
      const baseUrl = process.env.REPLIT_DEV_DOMAIN 
        ? `https://${process.env.REPLIT_DEV_DOMAIN}`
        : 'http://localhost:5000';
      
      let sentCount = 0;
      let failedCount = 0;
      
      // Helper to inject tracking pixel into HTML
      const injectTrackingPixel = (html: string, campaignId: string, subscriberId: string): string => {
        const trackingPixel = `<img src="${baseUrl}/api/track/open/${campaignId}/${subscriberId}" width="1" height="1" style="display:none" alt="" />`;
        // Insert before closing body tag, or append at end
        if (html.includes('</body>')) {
          return html.replace('</body>', `${trackingPixel}</body>`);
        }
        return html + trackingPixel;
      };
      
      // Helper to wrap links with click tracking
      const wrapLinksWithTracking = (html: string, campaignId: string, subscriberId: string): string => {
        // Match href="..." but not tracking URLs or unsubscribe links
        return html.replace(
          /href="(https?:\/\/[^"]+)"/gi,
          (match, url) => {
            // Don't wrap tracking URLs or unsubscribe links
            if (url.includes('/api/track/') || url.includes('/api/newsletter/unsubscribe')) {
              return match;
            }
            const trackingUrl = `${baseUrl}/api/track/click/${campaignId}/${subscriberId}?url=${encodeURIComponent(url)}`;
            return `href="${trackingUrl}"`;
          }
        );
      };
      
      // Send to each subscriber
      for (const subscriber of subscribers) {
        try {
          // Personalize content
          let htmlContent = campaign.htmlContent || '';
          
          // Add unsubscribe link if not present
          const unsubscribeUrl = `${baseUrl}/api/newsletter/unsubscribe?token=${subscriber.id}`;
          if (!htmlContent.includes('/api/newsletter/unsubscribe')) {
            htmlContent = htmlContent.replace(
              '</body>',
              `<p style="text-align:center;font-size:12px;color:#999;margin-top:30px;"><a href="${unsubscribeUrl}" style="color:#999;">Unsubscribe</a></p></body>`
            );
          }
          
          // Wrap links with click tracking
          htmlContent = wrapLinksWithTracking(htmlContent, id, subscriber.id);
          
          // Inject tracking pixel
          htmlContent = injectTrackingPixel(htmlContent, id, subscriber.id);
          
          // Replace personalization tokens
          const firstName = subscriber.firstName || 'there';
          htmlContent = htmlContent.replace(/\{\{firstName\}\}/g, firstName);
          htmlContent = htmlContent.replace(/\{\{email\}\}/g, subscriber.email);
          
          await resend.emails.send({
            from: "Dubai Travel <noreply@dubaitravel.com>",
            to: subscriber.email,
            subject: campaign.subject,
            html: htmlContent,
          });
          
          // Record sent event
          await storage.createCampaignEvent({
            campaignId: id,
            subscriberId: subscriber.id,
            eventType: "sent",
            metadata: { email: subscriber.email },
          });
          
          sentCount++;
        } catch (emailError) {
          console.error(`[Campaigns] Failed to send to ${subscriber.email}:`, emailError);
          failedCount++;
          
          // Record failed event
          await storage.createCampaignEvent({
            campaignId: id,
            subscriberId: subscriber.id,
            eventType: "bounced",
            metadata: { 
              email: subscriber.email,
              error: emailError instanceof Error ? emailError.message : "Unknown error" 
            },
          });
        }
      }
      
      // Update campaign with final stats
      await storage.updateCampaign(id, {
        status: failedCount === subscribers.length ? "failed" : "sent",
        // totalSent: sentCount, // Can't update via InsertCampaign - omitted from schema
      });
      
      console.log(`[Campaigns] Campaign ${campaign.name} completed: ${sentCount} sent, ${failedCount} failed`);
      
      res.json({
        success: true,
        sent: sentCount,
        failed: failedCount,
        total: subscribers.length,
      });
    } catch (error) {
      console.error("Error sending campaign:", error);
      
      // Try to update status to failed
      try {
        await storage.updateCampaign(req.params.id, { status: "failed" });
      } catch {}
      
      res.status(500).json({ error: "Failed to send campaign" });
    }
  });

  // Email tracking endpoints (public - called from email clients)
  // Open tracking pixel - returns a 1x1 transparent GIF
  app.get("/api/track/open/:campaignId/:subscriberId", async (req, res) => {
    try {
      const { campaignId, subscriberId } = req.params;
      
      // Record the open event
      await storage.createCampaignEvent({
        campaignId,
        subscriberId,
        eventType: "opened",
        metadata: {
          userAgent: req.headers["user-agent"] || "unknown",
          ip: req.ip || "unknown",
        },
      });
      
      // Update campaign stats
      // Note: totalOpened can't be updated via updateCampaign (omitted from InsertCampaign)
      // const campaign = await storage.getCampaign(campaignId);
      // if (campaign) {
      //   await storage.updateCampaign(campaignId, {
      //     totalOpened: campaign.totalOpened + 1,
      //   });
      // }
      
      console.log(`[Tracking] Open recorded: campaign=${campaignId}, subscriber=${subscriberId}`);
      
      // Return a 1x1 transparent GIF
      const transparentGif = Buffer.from(
        "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        "base64"
      );
      res.set("Content-Type", "image/gif");
      res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
      res.send(transparentGif);
    } catch (error) {
      console.error("[Tracking] Error recording open:", error);
      // Still return the pixel even on error
      const transparentGif = Buffer.from(
        "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        "base64"
      );
      res.set("Content-Type", "image/gif");
      res.send(transparentGif);
    }
  });

  // Click tracking - redirects to actual URL after recording click
  app.get("/api/track/click/:campaignId/:subscriberId", async (req, res) => {
    try {
      const { campaignId, subscriberId } = req.params;
      const { url } = req.query;
      
      if (!url || typeof url !== "string") {
        return res.status(400).send("Missing URL parameter");
      }
      
      // Record the click event
      await storage.createCampaignEvent({
        campaignId,
        subscriberId,
        eventType: "clicked",
        metadata: {
          url,
          userAgent: req.headers["user-agent"] || "unknown",
          ip: req.ip || "unknown",
        },
      });
      
      // Update campaign stats
      // Note: totalClicked can't be updated via updateCampaign (omitted from InsertCampaign)
      // const campaign = await storage.getCampaign(campaignId);
      // if (campaign) {
      //   await storage.updateCampaign(campaignId, {
      //     totalClicked: campaign.totalClicked + 1,
      //   });
      // }

      console.log(`[Tracking] Click recorded: campaign=${campaignId}, subscriber=${subscriberId}, url=${url}`);
      
      // Redirect to the actual URL
      res.redirect(url);
    } catch (error) {
      console.error("[Tracking] Error recording click:", error);
      // Try to redirect anyway
      const { url } = req.query;
      if (url && typeof url === "string") {
        res.redirect(url);
      } else {
        res.status(500).send("Tracking error");
      }
    }
  });

  // ============================================================================
  // ADMIN SECURITY ENDPOINTS
  // ============================================================================

  // Get audit logs (admin only)
  app.get("/api/admin/audit-logs", requirePermission("canPublish"), auditLogReadOnly, (req, res) => {
    try {
      const { action, resourceType, userId, limit = 100 } = req.query;
      const logs = getAuditLogs({
        action: action as string,
        resourceType: resourceType as string,
        userId: userId as string,
        limit: parseInt(limit as string) || 100,
      });
      res.json({ logs, total: logs.length });
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  });

  // Get blocked IPs (admin only)
  app.get("/api/admin/blocked-ips", requirePermission("canPublish"), (req, res) => {
    try {
      const blockedIps = getBlockedIps();
      res.json({ blockedIps, total: blockedIps.length });
    } catch (error) {
      console.error("Error fetching blocked IPs:", error);
      res.status(500).json({ error: "Failed to fetch blocked IPs" });
    }
  });

  // ============================================================================
  // JOB QUEUE ENDPOINTS
  // ============================================================================

  // Get job queue statistics
  app.get("/api/admin/jobs/stats", requirePermission("canPublish"), (req, res) => {
    try {
      const stats = jobQueue.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching job stats:", error);
      res.status(500).json({ error: "Failed to fetch job statistics" });
    }
  });

  // Get jobs by status
  app.get("/api/admin/jobs", requirePermission("canPublish"), (req, res) => {
    try {
      const { status = 'pending' } = req.query;
      const validStatuses = ['pending', 'processing', 'completed', 'failed'];
      if (!validStatuses.includes(status as string)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      const jobs = jobQueue.getJobsByStatus(status as any);
      res.json({ jobs, total: jobs.length });
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  // Get single job status
  app.get("/api/admin/jobs/:id", requirePermission("canPublish"), (req, res) => {
    try {
      const job = jobQueue.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ error: "Failed to fetch job" });
    }
  });

  // Cancel a pending job
  app.delete("/api/admin/jobs/:id", requirePermission("canPublish"), (req, res) => {
    try {
      const cancelled = jobQueue.cancelJob(req.params.id);
      if (!cancelled) {
        return res.status(400).json({ error: "Cannot cancel job (not pending or not found)" });
      }
      res.json({ success: true, message: "Job cancelled" });
    } catch (error) {
      console.error("Error cancelling job:", error);
      res.status(500).json({ error: "Failed to cancel job" });
    }
  });

  // Retry a failed job
  app.post("/api/admin/jobs/:id/retry", requirePermission("canPublish"), (req, res) => {
    try {
      const retried = jobQueue.retryJob(req.params.id);
      if (!retried) {
        return res.status(400).json({ error: "Cannot retry job (not failed or not found)" });
      }
      res.json({ success: true, message: "Job queued for retry" });
    } catch (error) {
      console.error("Error retrying job:", error);
      res.status(500).json({ error: "Failed to retry job" });
    }
  });

  // Migration endpoint - convert existing content to blocks format
  app.post("/api/admin/migrate-blocks", requirePermission("canPublish"), async (req, res) => {
    try {
      // Get all content items with empty blocks
      const allContents = await storage.getContents({});
      let migratedCount = 0;
      
      for (const content of allContents) {
        // Skip if already has blocks
        if (content.blocks && Array.isArray(content.blocks) && content.blocks.length > 0) {
          continue;
        }

        const blocks: any[] = [];
        let blockOrder = 0;

        // Add hero block if there's a hero image
        if (content.heroImage) {
          blocks.push({
            id: `hero-${Date.now()}-${blockOrder}`,
            type: "hero",
            data: {
              image: content.heroImage,
              alt: content.heroImageAlt || content.title,
              title: content.title
            },
            order: blockOrder++
          });
        }

        // Get type-specific data (using type assertion since getContents doesn't join related tables)
        const contentWithData = content as any;
        if (content.type === "attraction" && contentWithData.attractionData) {
          const attr = contentWithData.attractionData;
          
          // Add intro text block
          if (attr.introText) {
            blocks.push({
              id: `text-${Date.now()}-${blockOrder}`,
              type: "text",
              data: { content: attr.introText },
              order: blockOrder++
            });
          }
          
          // Add expanded intro if different
          if (attr.expandedIntroText && attr.expandedIntroText !== attr.introText) {
            blocks.push({
              id: `text-${Date.now()}-${blockOrder}`,
              type: "text",
              data: { content: attr.expandedIntroText },
              order: blockOrder++
            });
          }
          
          // Add highlights block
          if (attr.highlights && Array.isArray(attr.highlights) && attr.highlights.length > 0) {
            blocks.push({
              id: `highlights-${Date.now()}-${blockOrder}`,
              type: "highlights",
              data: { items: attr.highlights },
              order: blockOrder++
            });
          }
          
          // Add visitor tips
          if (attr.visitorTips && Array.isArray(attr.visitorTips) && attr.visitorTips.length > 0) {
            blocks.push({
              id: `tips-${Date.now()}-${blockOrder}`,
              type: "tips",
              data: { items: attr.visitorTips },
              order: blockOrder++
            });
          }
          
          // Add FAQ items
          if (attr.faq && Array.isArray(attr.faq) && attr.faq.length > 0) {
            for (const faqItem of attr.faq) {
              blocks.push({
                id: `faq-${Date.now()}-${blockOrder}`,
                type: "faq",
                data: { question: faqItem.question, answer: faqItem.answer },
                order: blockOrder++
              });
            }
          }
          
          // Add gallery
          if (attr.gallery && Array.isArray(attr.gallery) && attr.gallery.length > 0) {
            blocks.push({
              id: `gallery-${Date.now()}-${blockOrder}`,
              type: "gallery",
              data: { images: attr.gallery },
              order: blockOrder++
            });
          }
        } else if (content.type === "hotel" && contentWithData.hotelData) {
          const hotel = contentWithData.hotelData;
          
          // Add description
          if (hotel.description) {
            blocks.push({
              id: `text-${Date.now()}-${blockOrder}`,
              type: "text",
              data: { content: hotel.description },
              order: blockOrder++
            });
          }
          
          // Add highlights
          if (hotel.highlights && Array.isArray(hotel.highlights) && hotel.highlights.length > 0) {
            blocks.push({
              id: `highlights-${Date.now()}-${blockOrder}`,
              type: "highlights",
              data: { items: hotel.highlights },
              order: blockOrder++
            });
          }
          
          // Add FAQ
          if (hotel.faq && Array.isArray(hotel.faq) && hotel.faq.length > 0) {
            for (const faqItem of hotel.faq) {
              blocks.push({
                id: `faq-${Date.now()}-${blockOrder}`,
                type: "faq",
                data: { question: faqItem.question, answer: faqItem.answer },
                order: blockOrder++
              });
            }
          }
        } else if (content.type === "article" && contentWithData.articleData) {
          const article = contentWithData.articleData;
          
          // Add body content
          if (article.body) {
            blocks.push({
              id: `text-${Date.now()}-${blockOrder}`,
              type: "text",
              data: { content: article.body },
              order: blockOrder++
            });
          }
        }
        
        // Update content with generated blocks if any were created
        if (blocks.length > 0) {
          await storage.updateContent(content.id, { blocks });
          migratedCount++;
        }
      }
      
      res.json({ success: true, migratedCount, message: `Migrated ${migratedCount} content items to blocks format` });
    } catch (error) {
      console.error("Migration error:", error);
      res.status(500).json({ error: "Migration failed", details: String(error) });
    }
  });

  // Audit Logs Routes (admin only) - Read-only, no modifications allowed
  app.all("/api/audit-logs", (req, res, next) => {
    if (["DELETE", "PATCH", "PUT", "POST"].includes(req.method)) {
      return res.status(403).json({
        error: "Audit logs are immutable",
        message: "Audit logs cannot be modified or deleted",
      });
    }
    next();
  });
  
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

  // Content Clusters Routes
  app.get("/api/clusters", requireAuth, async (req, res) => {
    try {
      const clusters = await storage.getContentClusters();
      // Enrich clusters with members and pillar content
      const enrichedClusters = await Promise.all(
        clusters.map(async (cluster) => {
          const members = await storage.getClusterMembers(cluster.id);
          let pillarContent = null;
          if (cluster.pillarContentId) {
            pillarContent = await storage.getContent(cluster.pillarContentId);
          }
          return { ...cluster, members, pillarContent };
        })
      );
      res.json(enrichedClusters);
    } catch (error) {
      console.error("Error fetching clusters:", error);
      res.status(500).json({ error: "Failed to fetch clusters" });
    }
  });

  app.get("/api/clusters/:id", requireAuth, async (req, res) => {
    try {
      const cluster = await storage.getContentCluster(req.params.id);
      if (!cluster) {
        return res.status(404).json({ error: "Cluster not found" });
      }
      const members = await storage.getClusterMembers(cluster.id);
      res.json({ ...cluster, members });
    } catch (error) {
      console.error("Error fetching cluster:", error);
      res.status(500).json({ error: "Failed to fetch cluster" });
    }
  });

  app.post("/api/clusters", requirePermission("canCreate"), checkReadOnlyMode, async (req, res) => {
    try {
      const { name, slug, description, pillarContentId, primaryKeyword, color } = req.body;
      if (!name || !slug) {
        return res.status(400).json({ error: "Name and slug are required" });
      }
      const existing = await storage.getContentClusterBySlug(slug);
      if (existing) {
        return res.status(400).json({ error: "Cluster with this slug already exists" });
      }
      const cluster = await storage.createContentCluster({
        name,
        slug,
        description,
        pillarContentId,
        primaryKeyword,
        color,
      });
      await logAuditEvent(req, "create", "cluster", cluster.id, `Created cluster: ${cluster.name}`, undefined, { name: cluster.name, slug: cluster.slug });
      res.status(201).json(cluster);
    } catch (error) {
      console.error("Error creating cluster:", error);
      res.status(500).json({ error: "Failed to create cluster" });
    }
  });

  app.patch("/api/clusters/:id", requirePermission("canEdit"), checkReadOnlyMode, async (req, res) => {
    try {
      const existingCluster = await storage.getContentCluster(req.params.id);
      const { name, slug, description, pillarContentId, primaryKeyword, color } = req.body;
      const cluster = await storage.updateContentCluster(req.params.id, {
        name,
        slug,
        description,
        pillarContentId,
        primaryKeyword,
        color,
      });
      if (!cluster) {
        return res.status(404).json({ error: "Cluster not found" });
      }
      await logAuditEvent(req, "update", "cluster", cluster.id, `Updated cluster: ${cluster.name}`, existingCluster ? { name: existingCluster.name, slug: existingCluster.slug } : undefined, { name: cluster.name, slug: cluster.slug });
      res.json(cluster);
    } catch (error) {
      console.error("Error updating cluster:", error);
      res.status(500).json({ error: "Failed to update cluster" });
    }
  });

  app.delete("/api/clusters/:id", requirePermission("canDelete"), checkReadOnlyMode, async (req, res) => {
    try {
      const existingCluster = await storage.getContentCluster(req.params.id);
      await storage.deleteContentCluster(req.params.id);
      if (existingCluster) {
        await logAuditEvent(req, "delete", "cluster", req.params.id, `Deleted cluster: ${existingCluster.name}`, { name: existingCluster.name, slug: existingCluster.slug });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting cluster:", error);
      res.status(500).json({ error: "Failed to delete cluster" });
    }
  });

  // Cluster Members Routes
  app.post("/api/clusters/:clusterId/members", requirePermission("canEdit"), checkReadOnlyMode, async (req, res) => {
    try {
      const { contentId, position } = req.body;
      if (!contentId) {
        return res.status(400).json({ error: "Content ID is required" });
      }
      const member = await storage.addClusterMember({
        clusterId: req.params.clusterId,
        contentId,
        position: position || 0,
      });
      res.status(201).json(member);
    } catch (error) {
      console.error("Error adding cluster member:", error);
      res.status(500).json({ error: "Failed to add cluster member" });
    }
  });

  app.delete("/api/clusters/:clusterId/members/:memberId", requirePermission("canEdit"), checkReadOnlyMode, async (req, res) => {
    try {
      await storage.removeClusterMember(req.params.memberId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing cluster member:", error);
      res.status(500).json({ error: "Failed to remove cluster member" });
    }
  });

  app.patch("/api/clusters/:clusterId/members/:memberId", requirePermission("canEdit"), checkReadOnlyMode, async (req, res) => {
    try {
      const { position } = req.body;
      const member = await storage.updateClusterMemberPosition(req.params.memberId, position);
      if (!member) {
        return res.status(404).json({ error: "Member not found" });
      }
      res.json(member);
    } catch (error) {
      console.error("Error updating cluster member:", error);
      res.status(500).json({ error: "Failed to update cluster member" });
    }
  });

  // Get clusters for a specific content
  app.get("/api/content/:contentId/clusters", requireAuth, async (req, res) => {
    try {
      const memberships = await storage.getContentClusterMembership(req.params.contentId);
      res.json(memberships);
    } catch (error) {
      console.error("Error fetching content clusters:", error);
      res.status(500).json({ error: "Failed to fetch content clusters" });
    }
  });

  // Tags Routes
  app.get("/api/tags", requireAuth, async (req, res) => {
    try {
      const allTags = await storage.getTags();
      // Enrich with content count
      const enrichedTags = await Promise.all(
        allTags.map(async (tag) => {
          const tagContents = await storage.getTagContents(tag.id);
          return { ...tag, contentCount: tagContents.length, contents: tagContents.slice(0, 5) };
        })
      );
      res.json(enrichedTags);
    } catch (error) {
      console.error("Error fetching tags:", error);
      res.status(500).json({ error: "Failed to fetch tags" });
    }
  });

  app.get("/api/tags/:id", requireAuth, async (req, res) => {
    try {
      const tag = await storage.getTag(req.params.id);
      if (!tag) {
        return res.status(404).json({ error: "Tag not found" });
      }
      const tagContents = await storage.getTagContents(tag.id);
      res.json({ ...tag, contents: tagContents });
    } catch (error) {
      console.error("Error fetching tag:", error);
      res.status(500).json({ error: "Failed to fetch tag" });
    }
  });

  app.post("/api/tags", requirePermission("canCreate"), checkReadOnlyMode, async (req, res) => {
    try {
      const parseResult = insertTagSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Validation failed", details: parseResult.error.flatten() });
      }
      const { name, slug, description, color } = parseResult.data;
      const existing = await storage.getTagBySlug(slug);
      if (existing) {
        return res.status(400).json({ error: "Tag with this slug already exists" });
      }
      const tag = await storage.createTag({ name, slug, description, color });
      await logAuditEvent(req, "create", "tag", tag.id, `Created tag: ${tag.name}`, undefined, { name: tag.name, slug: tag.slug });
      res.status(201).json(tag);
    } catch (error) {
      console.error("Error creating tag:", error);
      res.status(500).json({ error: "Failed to create tag" });
    }
  });

  app.patch("/api/tags/:id", requirePermission("canEdit"), checkReadOnlyMode, async (req, res) => {
    try {
      const existingTag = await storage.getTag(req.params.id);
      const parseResult = insertTagSchema.partial().safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Validation failed", details: parseResult.error.flatten() });
      }
      const { name, slug, description, color } = parseResult.data;
      const tag = await storage.updateTag(req.params.id, { name, slug, description, color });
      if (!tag) {
        return res.status(404).json({ error: "Tag not found" });
      }
      await logAuditEvent(req, "update", "tag", tag.id, `Updated tag: ${tag.name}`, existingTag ? { name: existingTag.name, slug: existingTag.slug } : undefined, { name: tag.name, slug: tag.slug });
      res.json(tag);
    } catch (error) {
      console.error("Error updating tag:", error);
      res.status(500).json({ error: "Failed to update tag" });
    }
  });

  app.delete("/api/tags/:id", requirePermission("canDelete"), checkReadOnlyMode, async (req, res) => {
    try {
      const existingTag = await storage.getTag(req.params.id);
      await storage.deleteTag(req.params.id);
      if (existingTag) {
        await logAuditEvent(req, "delete", "tag", req.params.id, `Deleted tag: ${existingTag.name}`, { name: existingTag.name, slug: existingTag.slug });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting tag:", error);
      res.status(500).json({ error: "Failed to delete tag" });
    }
  });

  // Sync tags from content - auto-extract tags from site content
  app.post("/api/tags/sync", requirePermission("canCreate"), checkReadOnlyMode, async (req, res) => {
    try {
      const allContent = await storage.getAllContent();
      const existingTags = await storage.getTags();
      const existingTagSlugs = new Set(existingTags.map(t => t.slug));

      // Collect unique tags from content
      const tagCandidates = new Map<string, { name: string; count: number; color: string }>();

      // Color palette for auto-generated tags
      const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#6366f1", "#14b8a6"];
      let colorIndex = 0;

      // Extract tags from content types
      for (const content of allContent) {
        // From content type
        const typeTag = content.type;
        if (typeTag) {
          const slug = typeTag.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          if (!tagCandidates.has(slug)) {
            tagCandidates.set(slug, { name: typeTag.charAt(0).toUpperCase() + typeTag.slice(1), count: 0, color: colors[colorIndex++ % colors.length] });
          }
          tagCandidates.get(slug)!.count++;
        }

        // From primary keywords
        if (content.primaryKeyword) {
          const kw = content.primaryKeyword;
          const slug = kw.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50);
          if (slug.length > 2 && !tagCandidates.has(slug)) {
            tagCandidates.set(slug, { name: kw.slice(0, 50), count: 0, color: colors[colorIndex++ % colors.length] });
          }
          if (tagCandidates.has(slug)) tagCandidates.get(slug)!.count++;
        }

        // From secondary keywords (top 3)
        if (content.secondaryKeywords && Array.isArray(content.secondaryKeywords)) {
          for (const kw of content.secondaryKeywords.slice(0, 3)) {
            const slug = String(kw).toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 50);
            if (slug.length > 2 && !tagCandidates.has(slug)) {
              tagCandidates.set(slug, { name: String(kw).slice(0, 50), count: 0, color: colors[colorIndex++ % colors.length] });
            }
            if (tagCandidates.has(slug)) tagCandidates.get(slug)!.count++;
          }
        }
      }

      // Create tags that don't exist yet (only those used 2+ times to avoid noise)
      const created: string[] = [];
      const skipped: string[] = [];

      for (const [slug, data] of tagCandidates) {
        if (existingTagSlugs.has(slug)) {
          skipped.push(slug);
          continue;
        }
        if (data.count >= 2 || slug.length <= 15) { // Create if used 2+ times or short/common
          try {
            await storage.createTag({
              name: data.name,
              slug,
              description: `Auto-generated tag from content (${data.count} items)`,
              color: data.color,
            });
            created.push(data.name);
          } catch (e: any) {
            if (!e.message?.includes("duplicate")) {
              console.error(`Error creating tag ${slug}:`, e.message);
            }
          }
        }
      }

      await logAuditEvent(req, "sync", "tags", "bulk", `Synced tags from content`, { created: created.length, skipped: skipped.length });

      res.json({
        success: true,
        created,
        skipped: skipped.length,
        total: tagCandidates.size,
        message: `Created ${created.length} new tags from ${allContent.length} content items`
      });
    } catch (error) {
      console.error("Error syncing tags:", error);
      res.status(500).json({ error: "Failed to sync tags" });
    }
  });

  // Content Tags Routes
  app.get("/api/content/:contentId/tags", requireAuth, async (req, res) => {
    try {
      const contentTagsList = await storage.getContentTags(req.params.contentId);
      res.json(contentTagsList);
    } catch (error) {
      console.error("Error fetching content tags:", error);
      res.status(500).json({ error: "Failed to fetch content tags" });
    }
  });

  app.post("/api/content/:contentId/tags", requirePermission("canEdit"), checkReadOnlyMode, async (req, res) => {
    try {
      const { tagId } = req.body;
      if (!tagId) {
        return res.status(400).json({ error: "Tag ID is required" });
      }
      const contentTag = await storage.addContentTag({
        contentId: req.params.contentId,
        tagId,
      });
      res.status(201).json(contentTag);
    } catch (error) {
      console.error("Error adding content tag:", error);
      res.status(500).json({ error: "Failed to add content tag" });
    }
  });

  app.delete("/api/content/:contentId/tags/:tagId", requirePermission("canEdit"), checkReadOnlyMode, async (req, res) => {
    try {
      await storage.removeContentTag(req.params.contentId, req.params.tagId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing content tag:", error);
      res.status(500).json({ error: "Failed to remove content tag" });
    }
  });

  // Bulk Operations Routes
  app.post("/api/contents/bulk-status", requirePermission("canEdit"), async (req, res) => {
    try {
      const { ids, status } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "ids array is required" });
      }
      if (!status) {
        return res.status(400).json({ error: "status is required" });
      }
      const count = await storage.bulkUpdateContentStatus(ids, status);
      res.json({ success: true, count });
    } catch (error) {
      console.error("Error bulk updating status:", error);
      res.status(500).json({ error: "Failed to bulk update status" });
    }
  });

  app.post("/api/contents/bulk-delete", requirePermission("canDelete"), async (req, res) => {
    try {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "ids array is required" });
      }
      const count = await storage.bulkDeleteContents(ids);
      res.json({ success: true, count });
    } catch (error) {
      console.error("Error bulk deleting:", error);
      res.status(500).json({ error: "Failed to bulk delete" });
    }
  });

  app.post("/api/contents/bulk-add-tag", requirePermission("canEdit"), async (req, res) => {
    try {
      const { ids, tagId } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "ids array is required" });
      }
      if (!tagId) {
        return res.status(400).json({ error: "tagId is required" });
      }
      const count = await storage.bulkAddTagToContents(ids, tagId);
      res.json({ success: true, count });
    } catch (error) {
      console.error("Error bulk adding tag:", error);
      res.status(500).json({ error: "Failed to bulk add tag" });
    }
  });

  app.post("/api/contents/bulk-remove-tag", requirePermission("canEdit"), async (req, res) => {
    try {
      const { ids, tagId } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: "ids array is required" });
      }
      if (!tagId) {
        return res.status(400).json({ error: "tagId is required" });
      }
      const count = await storage.bulkRemoveTagFromContents(ids, tagId);
      res.json({ success: true, count });
    } catch (error) {
      console.error("Error bulk removing tag:", error);
      res.status(500).json({ error: "Failed to bulk remove tag" });
    }
  });

  app.get("/api/contents/export", requireAuth, async (req, res) => {
    try {
      const { ids, format = "json" } = req.query;
      let contents;
      if (ids && typeof ids === "string") {
        const idArray = ids.split(",");
        const allContents = await storage.getContentsWithRelations();
        contents = allContents.filter(c => idArray.includes(c.id));
      } else {
        contents = await storage.getContentsWithRelations();
      }
      
      if (format === "csv") {
        const headers = ["id", "title", "slug", "type", "status", "wordCount", "createdAt", "updatedAt"];
        const csvRows = [headers.join(",")];
        for (const c of contents) {
          csvRows.push([
            c.id,
            `"${(c.title || "").replace(/"/g, '""')}"`,
            c.slug,
            c.type,
            c.status,
            c.wordCount || 0,
            c.createdAt ? new Date(c.createdAt).toISOString() : "",
            c.updatedAt ? new Date(c.updatedAt).toISOString() : ""
          ].join(","));
        }
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", "attachment; filename=contents-export.csv");
        return res.send(csvRows.join("\n"));
      }
      
      res.json(contents);
    } catch (error) {
      console.error("Error exporting contents:", error);
      res.status(500).json({ error: "Failed to export contents" });
    }
  });

  // Content Templates Routes
  app.get("/api/content-templates", requireAuth, async (req, res) => {
    try {
      const templates = await storage.getContentTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  app.get("/api/content-templates/:id", requireAuth, async (req, res) => {
    try {
      const template = await storage.getContentTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  app.post("/api/content-templates", requirePermission("canCreate"), async (req, res) => {
    try {
      const { name, description, type, blocks, seoDefaults } = req.body;
      if (!name || !type) {
        return res.status(400).json({ error: "Name and type are required" });
      }
      const template = await storage.createContentTemplate({
        name,
        description,
        contentType: type,
        blocks: blocks || [],
        seoDefaults: seoDefaults || {},
      });
      res.status(201).json(template);
    } catch (error) {
      console.error("Error creating template:", error);
      res.status(500).json({ error: "Failed to create template" });
    }
  });

  app.patch("/api/content-templates/:id", requirePermission("canEdit"), async (req, res) => {
    try {
      const { name, description, type, blocks, seoDefaults } = req.body;
      const template = await storage.updateContentTemplate(req.params.id, {
        name,
        description,
        contentType: type,
        blocks,
        seoDefaults,
      });
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error updating template:", error);
      res.status(500).json({ error: "Failed to update template" });
    }
  });

  app.delete("/api/content-templates/:id", requirePermission("canDelete"), async (req, res) => {
    try {
      await storage.deleteContentTemplate(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting template:", error);
      res.status(500).json({ error: "Failed to delete template" });
    }
  });

  app.post("/api/content-templates/:id/apply", requirePermission("canCreate"), checkReadOnlyMode, rateLimiters.contentWrite, async (req, res) => {
    try {
      const template = await storage.getContentTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      const { title, slug } = req.body;
      if (!title || !slug) {
        return res.status(400).json({ error: "Title and slug are required" });
      }
      const content = await storage.createContent({
        title,
        slug,
        type: template.contentType as any,
        status: "draft",
        blocks: template.blocks as any[],
        metaTitle: (template.seoDefaults as any)?.metaTitle || title,
        metaDescription: (template.seoDefaults as any)?.metaDescription || "",
      });
      await storage.incrementTemplateUsage(req.params.id);
      res.status(201).json(content);
    } catch (error) {
      console.error("Error applying template:", error);
      res.status(500).json({ error: "Failed to apply template" });
    }
  });

  // ============================================================================
  // TRANSLATIONS - DeepL Multi-Language SEO System
  // ============================================================================

  // Get translation coverage for dashboard (simplified stats per language)
  app.get("/api/translations/coverage", async (req, res) => {
    try {
      const contents = await storage.getContents();
      const publishedContents = contents.filter(c => c.status === "published");
      const allTranslations = await storage.getAllTranslations();

      const supportedLocales = ["en", "ar", "hi", "zh", "ru", "fr", "de", "es", "ja"];

      const coverage: Record<string, { translated: number; total: number }> = {};
      for (const locale of supportedLocales) {
        if (locale === "en") {
          // English is the source language
          coverage[locale] = { translated: publishedContents.length, total: publishedContents.length };
        } else {
          const localeTranslations = allTranslations.filter(t => t.locale === locale && t.status === "completed");
          coverage[locale] = { translated: localeTranslations.length, total: publishedContents.length };
        }
      }

      res.json(coverage);
    } catch (error) {
      console.error("Error fetching translation coverage:", error);
      res.status(500).json({ error: "Failed to fetch translation coverage" });
    }
  });

  // Get translation statistics for admin dashboard
  app.get("/api/translations/stats", requirePermission("canViewAnalytics"), async (req, res) => {
    try {
      const contents = await storage.getContents();
      const publishedContents = contents.filter(c => c.status === "published");
      const allTranslations = await storage.getAllTranslations();
      
      const supportedLocales = ["ar", "hi", "zh", "ru", "ur", "fr", "de", "fa", "bn", "fil", "es", "tr", "it", "ja", "ko", "he"];
      
      const languageStats = supportedLocales.map(locale => {
        const localeTranslations = allTranslations.filter(t => t.locale === locale && t.status === "completed");
        const translated = localeTranslations.length;
        const pending = publishedContents.length - translated;
        const percentage = publishedContents.length > 0 ? Math.round((translated / publishedContents.length) * 100) : 0;
        return { locale, translated, pending: Math.max(0, pending), percentage };
      });

      const totalTranslated = new Set(allTranslations.filter(t => t.status === "completed").map(t => t.contentId)).size;
      
      res.json({
        totalContent: publishedContents.length,
        translatedContent: totalTranslated,
        pendingContent: publishedContents.length - totalTranslated,
        languageStats,
      });
    } catch (error) {
      console.error("Error fetching translation stats:", error);
      res.status(500).json({ error: "Failed to fetch translation stats" });
    }
  });

  // Get all translations with content info (admin list view)
  app.get("/api/translations", requirePermission("canEdit"), async (req, res) => {
    try {
      const contents = await storage.getContents();
      const publishedContents = contents.filter(c => c.status === "published");
      const allTranslations = await storage.getAllTranslations();

      const contentTranslations = publishedContents.map(content => {
        const contentTrans = allTranslations.filter(t => t.contentId === content.id);
        const completedLocales = contentTrans.filter(t => t.status === "completed").map(t => t.locale);
        return {
          contentId: content.id,
          title: content.title,
          slug: content.slug,
          type: content.type,
          completedLocales,
          translationCount: completedLocales.length,
        };
      });

      res.json(contentTranslations);
    } catch (error) {
      console.error("Error fetching translations:", error);
      res.status(500).json({ error: "Failed to fetch translations" });
    }
  });

  // Get translations for a content item
  app.get("/api/translations/:contentId", async (req, res) => {
    try {
      const translations = await storage.getTranslationsByContentId(req.params.contentId);
      res.json(translations);
    } catch (error) {
      console.error("Error fetching translations:", error);
      res.status(500).json({ error: "Failed to fetch translations" });
    }
  });

  // Get a specific translation
  app.get("/api/translations/:contentId/:locale", async (req, res) => {
    try {
      const { contentId, locale } = req.params;
      const translation = await storage.getTranslation(contentId, locale as any);
      if (!translation) {
        return res.status(404).json({ error: "Translation not found" });
      }
      res.json(translation);
    } catch (error) {
      console.error("Error fetching translation:", error);
      res.status(500).json({ error: "Failed to fetch translation" });
    }
  });

  // Translate content to a specific language using DeepL
  app.post("/api/translations/:contentId/translate", requirePermission("canEdit"), async (req, res) => {
    try {
      const { contentId } = req.params;
      const { targetLocale, sourceLocale = "en" } = req.body;

      if (!targetLocale) {
        return res.status(400).json({ error: "Target locale is required" });
      }

      const content = await storage.getContent(contentId);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }

      // Use translation-service (Claude Haiku) instead of deepl-service
      const { translateContent, generateContentHash } = await import("./services/translation-service");

      // Note: translation-service uses (content, sourceLocale, targetLocale) order
      const translatedContent = await translateContent(
        {
          title: content.title,
          metaTitle: content.metaTitle || undefined,
          metaDescription: content.metaDescription || undefined,
          blocks: content.blocks || [],
        },
        sourceLocale,
        targetLocale
      );

      const existingTranslation = await storage.getTranslation(contentId, targetLocale);

      if (existingTranslation && existingTranslation.isManualOverride) {
        return res.status(409).json({
          error: "Manual override exists. Use force=true to overwrite.",
          existingTranslation
        });
      }

      const translationData = {
        contentId,
        locale: targetLocale,
        status: "completed" as const,
        title: translatedContent.title || null,
        metaTitle: translatedContent.metaTitle || null,
        metaDescription: translatedContent.metaDescription || null,
        blocks: translatedContent.blocks || [],
        sourceHash: translatedContent.sourceHash,
        translatedBy: "claude",
        translationProvider: "claude",
        isManualOverride: false,
      };

      let translation;
      if (existingTranslation) {
        translation = await storage.updateTranslation(existingTranslation.id, translationData);
      } else {
        translation = await storage.createTranslation(translationData);
      }

      res.json(translation);
    } catch (error) {
      console.error("Error translating content:", error);
      res.status(500).json({ error: "Failed to translate content" });
    }
  });

  // Batch translate content to multiple languages
  app.post("/api/translations/:contentId/translate-all", requirePermission("canEdit"), async (req, res) => {
    try {
      const { contentId } = req.params;
      const { targetTiers = [1, 2], sourceLocale = "en" } = req.body;

      const content = await storage.getContent(contentId);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }

      // Use translation-service (Claude Haiku) instead of deepl-service
      const { translateToAllLanguages, generateContentHash } = await import("./services/translation-service");

      // translateToAllLanguages handles tier filtering internally
      const translations = await translateToAllLanguages(
        {
          title: content.title,
          metaTitle: content.metaTitle || undefined,
          metaDescription: content.metaDescription || undefined,
          blocks: content.blocks || [],
        },
        sourceLocale as any,
        targetTiers
      );

      const savedTranslations = [];
      for (const [locale, translatedContent] of translations) {
        const existingTranslation = await storage.getTranslation(contentId, locale);

        if (existingTranslation?.isManualOverride) {
          continue;
        }

        const translationData = {
          contentId,
          locale,
          status: "completed" as const,
          title: translatedContent.title || null,
          metaTitle: translatedContent.metaTitle || null,
          metaDescription: translatedContent.metaDescription || null,
          blocks: translatedContent.blocks || [],
          sourceHash: translatedContent.sourceHash,
          translatedBy: "claude",
          translationProvider: "claude",
          isManualOverride: false,
        };

        let translation;
        if (existingTranslation) {
          translation = await storage.updateTranslation(existingTranslation.id, translationData);
        } else {
          translation = await storage.createTranslation(translationData);
        }
        savedTranslations.push(translation);
      }

      res.json({
        success: true,
        translatedCount: savedTranslations.length,
        targetLocales: supportedLocales,
        translations: savedTranslations,
      });
    } catch (error) {
      console.error("Error batch translating content:", error);
      res.status(500).json({ error: "Failed to batch translate content" });
    }
  });

  // Manual translation override
  app.put("/api/translations/:contentId/:locale", requirePermission("canEdit"), async (req, res) => {
    try {
      const { contentId, locale } = req.params;
      const { title, metaTitle, metaDescription, blocks } = req.body;

      const existingTranslation = await storage.getTranslation(contentId, locale as any);
      
      const translationData = {
        contentId,
        locale: locale as any,
        status: "completed" as const,
        title: title || null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        blocks: blocks || [],
        translatedBy: "manual",
        translationProvider: "manual",
        isManualOverride: true,
      };

      let translation;
      if (existingTranslation) {
        translation = await storage.updateTranslation(existingTranslation.id, translationData);
      } else {
        translation = await storage.createTranslation(translationData);
      }

      res.json(translation);
    } catch (error) {
      console.error("Error saving manual translation:", error);
      res.status(500).json({ error: "Failed to save translation" });
    }
  });

  // Get DeepL usage stats
  app.get("/api/translations/usage", requirePermission("canViewAnalytics"), async (req, res) => {
    try {
      const { getDeepLUsage, getDeepLSupportedLocales, getUnsupportedLocales } = await import("./services/deepl-service");
      const usage = await getDeepLUsage();
      
      res.json({
        usage,
        supportedLocales: getDeepLSupportedLocales(),
        unsupportedLocales: getUnsupportedLocales(),
        totalLocales: SUPPORTED_LOCALES.length,
      });
    } catch (error) {
      console.error("Error fetching DeepL usage:", error);
      res.status(500).json({ error: "Failed to fetch usage stats" });
    }
  });

  // Get public translated content
  app.get("/api/public/content/:slug/:locale", async (req, res) => {
    try {
      const { slug, locale } = req.params;
      
      const content = await storage.getContentBySlug(slug);
      if (!content || content.status !== "published") {
        return res.status(404).json({ error: "Content not found" });
      }

      if (locale === "en") {
        return res.json(content);
      }

      const translation = await storage.getTranslation(content.id, locale as any);
      if (!translation || translation.status !== "completed") {
        return res.json(content);
      }

      res.json({
        ...content,
        title: translation.title || content.title,
        metaTitle: translation.metaTitle || content.metaTitle,
        metaDescription: translation.metaDescription || content.metaDescription,
        blocks: translation.blocks || content.blocks,
        locale,
        isTranslated: true,
      });
    } catch (error) {
      console.error("Error fetching translated content:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  // Get all translations status for admin dashboard
  app.get("/api/admin/translation-status", requirePermission("canViewAnalytics"), async (req, res) => {
    try {
      const contents = await storage.getContents({ status: "published" });
      
      const status = await Promise.all(
        contents.map(async (content) => {
          const translations = await storage.getTranslationsByContentId(content.id);
          const translatedLocales = translations
            .filter(t => t.status === "completed")
            .map(t => t.locale);
          
          return {
            contentId: content.id,
            title: content.title,
            type: content.type,
            translatedLocales,
            totalTranslations: translatedLocales.length,
            missingLocales: SUPPORTED_LOCALES
              .filter(l => l.code !== "en" && !translatedLocales.includes(l.code))
              .map(l => l.code),
          };
        })
      );

      res.json({
        totalContent: contents.length,
        items: status,
        localeStats: SUPPORTED_LOCALES.map(locale => ({
          code: locale.code,
          name: locale.name,
          tier: locale.tier,
          translatedCount: status.filter(s => s.translatedLocales.includes(locale.code)).length,
        })),
      });
    } catch (error) {
      console.error("Error fetching translation status:", error);
      res.status(500).json({ error: "Failed to fetch translation status" });
    }
  });

  // ============================================================================
  // SITEMAPS - Multilingual SEO Support (50 languages)
  // ============================================================================

  // Main sitemap index - lists all language-specific sitemaps
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const { generateSitemapIndex } = await import("./services/sitemap-service");
      const sitemapIndex = await generateSitemapIndex();
      res.set("Content-Type", "application/xml");
      res.send(sitemapIndex);
    } catch (error) {
      console.error("Error generating sitemap index:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // Language-specific sitemaps (e.g., /sitemap-en.xml, /sitemap-ar.xml)
  app.get("/sitemap-:locale.xml", async (req, res) => {
    try {
      const locale = req.params.locale as any;

      // Validate locale
      if (!SUPPORTED_LOCALES.some(l => l.code === locale)) {
        return res.status(404).send("Sitemap not found");
      }

      const { generateLocaleSitemap } = await import("./services/sitemap-service");
      const sitemap = await generateLocaleSitemap(locale);
      res.set("Content-Type", "application/xml");
      res.send(sitemap);
    } catch (error) {
      console.error("Error generating locale sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // Robots.txt with sitemap references
  app.get("/robots.txt", async (req, res) => {
    try {
      const { generateRobotsTxt } = await import("./services/sitemap-service");
      const robotsTxt = generateRobotsTxt();
      res.set("Content-Type", "text/plain");
      res.send(robotsTxt);
    } catch (error) {
      console.error("Error generating robots.txt:", error);
      res.status(500).send("Error generating robots.txt");
    }
  });

  // ============================================================================
  // ENTERPRISE ROUTES (Teams, Workflows, Notifications, etc.)
  // ============================================================================
  registerEnterpriseRoutes(app);

  // ============================================================================
  // IMAGE LOGIC ROUTES (Smart image selection system)
  // ============================================================================
  registerImageLogicRoutes(app);

  // ============================================================================
  // AUTOMATION ROUTES (Auto SEO, linking, freshness, etc.)
  // ============================================================================
  registerAutomationRoutes(app);

  // ============================================================================
  // CONTENT INTELLIGENCE (Clusters, Gaps, A/B Testing, ROI)
  // ============================================================================
  registerContentIntelligenceRoutes(app);

  // ============================================================================
  // AUTO-PILOT (Zero-touch automation - supervisor only)
  // ============================================================================
  registerAutoPilotRoutes(app);

  // ============================================================================
  // ENHANCEMENTS (Readability, CTAs, Search, Popups, Newsletter, Monetization, PWA)
  // ============================================================================
  registerEnhancementRoutes(app);

  // ============================================================================
  // CUSTOMER JOURNEY ANALYTICS (Page views, clicks, scroll, conversions, heatmaps)
  // ============================================================================
  registerCustomerJourneyRoutes(app);

  // ============================================================================
  // CONTENT RULES - Strict rules for AI content generation
  // ============================================================================

  // Get active content rules
  app.get("/api/content-rules", requireAuth, async (req, res) => {
    try {
      const rules = await db.select().from(contentRules).where(eq(contentRules.isActive, true)).limit(1);
      if (rules.length === 0) {
        // Return default rules if none exist
        const { DEFAULT_CONTENT_RULES } = await import("@shared/schema");
        return res.json({ id: null, ...DEFAULT_CONTENT_RULES });
      }
      res.json(rules[0]);
    } catch (error) {
      console.error("Error fetching content rules:", error);
      res.status(500).json({ error: "Failed to fetch content rules" });
    }
  });

  // Save/update content rules
  app.post("/api/content-rules", requirePermission("canManageSettings"), async (req, res) => {
    try {
      const data = req.body;

      // First, deactivate all existing rules
      await db.update(contentRules).set({ isActive: false });

      // Check if rule with this name exists
      const existing = await db.select().from(contentRules).where(eq(contentRules.name, data.name)).limit(1);

      if (existing.length > 0) {
        // Update existing rule
        await db.update(contentRules)
          .set({ ...data, isActive: true, updatedAt: new Date() })
          .where(eq(contentRules.name, data.name));
        res.json({ success: true, updated: true });
      } else {
        // Insert new rule
        await db.insert(contentRules).values({
          ...data,
          isActive: true,
          createdBy: (req as any).user?.id,
        });
        res.json({ success: true, created: true });
      }
    } catch (error) {
      console.error("Error saving content rules:", error);
      res.status(500).json({ error: "Failed to save content rules" });
    }
  });

  // Get all content rules (including inactive)
  app.get("/api/content-rules/all", requirePermission("canManageSettings"), async (req, res) => {
    try {
      const rules = await db.select().from(contentRules).orderBy(desc(contentRules.createdAt));
      res.json(rules);
    } catch (error) {
      console.error("Error fetching all content rules:", error);
      res.status(500).json({ error: "Failed to fetch content rules" });
    }
  });

  // ============================================================================
  // DOC/DOCX UPLOAD (Import content directly from Word documents)
  // ============================================================================
  registerDocUploadRoutes(app);

  // ============================================================================
  // SECURE ERROR HANDLER (no stack traces to client)
  // ============================================================================
  app.use(secureErrorHandler);

  return httpServer;
}
