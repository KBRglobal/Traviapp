import type { Express } from "express";
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
  insertRssFeedSchema,
  insertAffiliateLinkSchema,
  insertMediaFileSchema,
} from "@shared/schema";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";

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
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  return new OpenAI();
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
      const { type, status, search } = req.query;
      const contents = await storage.getContents({
        type: type as string | undefined,
        status: status as string | undefined,
        search: search as string | undefined,
      });
      res.json(contents);
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

  app.post("/api/contents", async (req, res) => {
    try {
      const parsed = insertContentSchema.parse(req.body);
      const content = await storage.createContent(parsed);

      if (parsed.type === "attraction" && req.body.attraction) {
        await storage.createAttraction({ ...req.body.attraction, contentId: content.id });
      } else if (parsed.type === "hotel" && req.body.hotel) {
        await storage.createHotel({ ...req.body.hotel, contentId: content.id });
      } else if (parsed.type === "article" && req.body.article) {
        await storage.createArticle({ ...req.body.article, contentId: content.id });
      } else {
        if (parsed.type === "attraction") {
          await storage.createAttraction({ contentId: content.id });
        } else if (parsed.type === "hotel") {
          await storage.createHotel({ contentId: content.id });
        } else if (parsed.type === "article") {
          await storage.createArticle({ contentId: content.id });
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

  app.patch("/api/contents/:id", async (req, res) => {
    try {
      const existingContent = await storage.getContent(req.params.id);
      if (!existingContent) {
        return res.status(404).json({ error: "Content not found" });
      }

      const { attraction, hotel, article, ...contentData } = req.body;
      
      const updatedContent = await storage.updateContent(req.params.id, contentData);

      if (existingContent.type === "attraction" && attraction) {
        await storage.updateAttraction(req.params.id, attraction);
      } else if (existingContent.type === "hotel" && hotel) {
        await storage.updateHotel(req.params.id, hotel);
      } else if (existingContent.type === "article" && article) {
        await storage.updateArticle(req.params.id, article);
      }

      const fullContent = await storage.getContent(req.params.id);
      res.json(fullContent);
    } catch (error) {
      console.error("Error updating content:", error);
      res.status(500).json({ error: "Failed to update content" });
    }
  });

  app.delete("/api/contents/:id", async (req, res) => {
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

  app.post("/api/rss-feeds", async (req, res) => {
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

  app.patch("/api/rss-feeds/:id", async (req, res) => {
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

  app.delete("/api/rss-feeds/:id", async (req, res) => {
    try {
      await storage.deleteRssFeed(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting RSS feed:", error);
      res.status(500).json({ error: "Failed to delete RSS feed" });
    }
  });

  app.post("/api/rss-feeds/:id/fetch", async (req, res) => {
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

  app.post("/api/rss-feeds/:id/import", async (req, res) => {
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
      const createdContents = [];
      for (const item of items) {
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

        await storage.createArticle({ contentId: content.id });
        createdContents.push(content);
      }

      await storage.updateRssFeed(req.params.id, {
        lastFetched: new Date(),
      });

      res.status(201).json({ imported: createdContents.length, contents: createdContents });
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

  app.post("/api/affiliate-links", async (req, res) => {
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

  app.patch("/api/affiliate-links/:id", async (req, res) => {
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

  app.delete("/api/affiliate-links/:id", async (req, res) => {
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

  app.post("/api/media/upload", upload.single("file"), async (req, res) => {
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

  app.patch("/api/media/:id", async (req, res) => {
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

  app.delete("/api/media/:id", async (req, res) => {
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

  app.post("/api/internal-links", async (req, res) => {
    try {
      const link = await storage.createInternalLink(req.body);
      res.status(201).json(link);
    } catch (error) {
      console.error("Error creating internal link:", error);
      res.status(500).json({ error: "Failed to create internal link" });
    }
  });

  app.delete("/api/internal-links/:id", async (req, res) => {
    try {
      await storage.deleteInternalLink(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting internal link:", error);
      res.status(500).json({ error: "Failed to delete internal link" });
    }
  });

  app.post("/api/ai/generate", async (req, res) => {
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

  app.post("/api/ai/suggest-internal-links", async (req, res) => {
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

  app.post("/api/ai/generate-seo-schema", async (req, res) => {
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

  return httpServer;
}
