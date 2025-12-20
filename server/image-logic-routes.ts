/**
 * Image Logic API Routes
 * Smart image selection system for content creation
 */

import { Express, Request, Response } from "express";
import { db } from "./db";
import { contents, mediaFiles } from "@shared/schema";
import { eq } from "drizzle-orm";
import {
  imageLogic,
  analyzeContent,
  generateImageBriefs,
  calculateSeoScore,
  selectImagesForContent,
  generateAiImagePrompt,
  searchFreepik,
  DUBAI_AREAS,
  IMAGE_SLOTS_BY_TYPE,
  ContentAnalysis,
  ImageSearchBrief,
  SeoScoreResult,
  AiImagePrompt,
} from "./image-logic";
import { generateImage } from "./ai-generator";

// ============================================================================
// ROUTE REGISTRATION
// ============================================================================

export function registerImageLogicRoutes(app: Express) {

  // -------------------------------------------------------------------------
  // GET /api/image-logic/areas
  // Get all Dubai areas with their style rules
  // -------------------------------------------------------------------------
  app.get("/api/image-logic/areas", async (req: Request, res: Response) => {
    try {
      res.json({
        areas: Object.entries(DUBAI_AREAS).map(([key, data]) => ({
          id: key,
          name: data.name,
          nameHe: data.nameHe,
          identifiers: data.identifiers,
          searchKeywords: data.searchKeywords,
          style: data.style,
        })),
      });
    } catch (error) {
      console.error("[ImageLogic] Error fetching areas:", error);
      res.status(500).json({ error: "Failed to fetch areas" });
    }
  });

  // -------------------------------------------------------------------------
  // GET /api/image-logic/slots/:contentType
  // Get image slots for a specific content type
  // -------------------------------------------------------------------------
  app.get("/api/image-logic/slots/:contentType", async (req: Request, res: Response) => {
    try {
      const { contentType } = req.params;
      const slots = IMAGE_SLOTS_BY_TYPE[contentType] || IMAGE_SLOTS_BY_TYPE.article;

      res.json({
        contentType,
        slots,
        totalRequired: slots.filter(s => s.required).length,
        totalOptional: slots.filter(s => !s.required).length,
      });
    } catch (error) {
      console.error("[ImageLogic] Error fetching slots:", error);
      res.status(500).json({ error: "Failed to fetch slots" });
    }
  });

  // -------------------------------------------------------------------------
  // POST /api/image-logic/analyze
  // Analyze content and get image recommendations
  // -------------------------------------------------------------------------
  app.post("/api/image-logic/analyze", async (req: Request, res: Response) => {
    try {
      const { title, content, contentType, keywords } = req.body;

      if (!title || !content || !contentType) {
        return res.status(400).json({
          error: "Missing required fields: title, content, contentType",
        });
      }

      // Analyze content
      const analysis = analyzeContent(title, content, contentType, keywords);

      // Generate image briefs
      const briefs = generateImageBriefs(contentType, analysis);

      res.json({
        analysis,
        briefs,
        areaDetails: analysis.area ? DUBAI_AREAS[analysis.area] : null,
      });
    } catch (error) {
      console.error("[ImageLogic] Error analyzing content:", error);
      res.status(500).json({ error: "Failed to analyze content" });
    }
  });

  // -------------------------------------------------------------------------
  // POST /api/contents/:id/analyze-images
  // Analyze existing content and get image recommendations
  // -------------------------------------------------------------------------
  app.post("/api/contents/:id/analyze-images", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Get content from database
      const [contentItem] = await db
        .select()
        .from(contents)
        .where(eq(contents.id, id));

      if (!contentItem) {
        return res.status(404).json({ error: "Content not found" });
      }

      // Extract text from blocks
      const blocks = (contentItem.blocks as any[]) || [];
      const textContent = blocks
        .filter((b: any) => b.type === "text" || b.type === "paragraph")
        .map((b: any) => b.content || b.text || "")
        .join(" ");

      const fullContent = `${contentItem.title} ${textContent}`;

      // Analyze
      const analysis = analyzeContent(
        contentItem.title,
        fullContent,
        contentItem.type,
        (contentItem as any).keywords || []
      );

      // Generate briefs
      const briefs = generateImageBriefs(contentItem.type, analysis);

      // Calculate current SEO score
      const seoScore = calculateSeoScore({
        title: contentItem.title,
        metaTitle: contentItem.metaTitle,
        metaDescription: contentItem.metaDescription,
        slug: contentItem.slug,
        blocks: blocks,
        heroImage: contentItem.heroImage,
        primaryKeyword: (contentItem as any).primaryKeyword,
        wordCount: fullContent.split(/\s+/).length,
      });

      res.json({
        contentId: id,
        contentType: contentItem.type,
        analysis,
        briefs,
        seoScore,
        currentImages: {
          hero: contentItem.heroImage,
          // Could extract more from blocks if needed
        },
        areaDetails: analysis.area ? DUBAI_AREAS[analysis.area] : null,
      });
    } catch (error) {
      console.error("[ImageLogic] Error analyzing content images:", error);
      res.status(500).json({ error: "Failed to analyze content images" });
    }
  });

  // -------------------------------------------------------------------------
  // POST /api/image-logic/search
  // Search for images using Freepik
  // -------------------------------------------------------------------------
  app.post("/api/image-logic/search", async (req: Request, res: Response) => {
    try {
      const { brief, query, filters } = req.body;

      // Get Freepik API key from environment
      const apiKey = process.env.FREEPIK_API_KEY;

      if (!apiKey) {
        return res.status(503).json({
          error: "Freepik API not configured",
          message: "Set FREEPIK_API_KEY environment variable",
          fallbackAvailable: true,
        });
      }

      // Use brief if provided, otherwise build from query
      const searchBrief: ImageSearchBrief = brief || {
        slotId: "custom",
        role: "hero",
        primaryQuery: query,
        alternativeQueries: [],
        mustInclude: filters?.mustInclude || [],
        mustExclude: filters?.mustExclude || [],
        style: filters?.style || {},
      };

      const result = await searchFreepik(searchBrief, apiKey);

      res.json(result);
    } catch (error) {
      console.error("[ImageLogic] Error searching Freepik:", error);
      res.status(500).json({ error: "Failed to search Freepik" });
    }
  });

  // -------------------------------------------------------------------------
  // POST /api/image-logic/generate-ai-prompt
  // Generate AI prompt for fallback image generation
  // -------------------------------------------------------------------------
  app.post("/api/image-logic/generate-ai-prompt", async (req: Request, res: Response) => {
    try {
      const { brief, analysis, slotId, contentType, title, content } = req.body;

      let finalAnalysis: ContentAnalysis;
      let finalBrief: ImageSearchBrief;

      if (brief && analysis) {
        finalAnalysis = analysis;
        finalBrief = brief;
      } else if (slotId && contentType && title && content) {
        // Generate from scratch
        finalAnalysis = analyzeContent(title, content, contentType);
        const briefs = generateImageBriefs(contentType, finalAnalysis);
        const matchingBrief = briefs.find(b => b.slotId === slotId);

        if (!matchingBrief) {
          return res.status(400).json({ error: `Invalid slotId: ${slotId}` });
        }
        finalBrief = matchingBrief;
      } else {
        return res.status(400).json({
          error: "Provide either (brief + analysis) or (slotId + contentType + title + content)",
        });
      }

      const prompt = generateAiImagePrompt(finalBrief, finalAnalysis);

      res.json({
        prompt,
        slotId: finalBrief.slotId,
        role: finalBrief.role,
      });
    } catch (error) {
      console.error("[ImageLogic] Error generating AI prompt:", error);
      res.status(500).json({ error: "Failed to generate AI prompt" });
    }
  });

  // -------------------------------------------------------------------------
  // POST /api/image-logic/select-images
  // Full image selection flow for content
  // -------------------------------------------------------------------------
  app.post("/api/image-logic/select-images", async (req: Request, res: Response) => {
    try {
      const { contentType, title, content, keywords, forceAi } = req.body;

      if (!contentType || !title || !content) {
        return res.status(400).json({
          error: "Missing required fields: contentType, title, content",
        });
      }

      const result = await selectImagesForContent(contentType, title, content, {
        freepikApiKey: process.env.FREEPIK_API_KEY,
        keywords,
        forceAi,
      });

      res.json(result);
    } catch (error) {
      console.error("[ImageLogic] Error selecting images:", error);
      res.status(500).json({ error: "Failed to select images" });
    }
  });

  // -------------------------------------------------------------------------
  // GET /api/contents/:id/seo-score
  // Get SEO score for content with 92% threshold check
  // -------------------------------------------------------------------------
  app.get("/api/contents/:id/seo-score", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      // Get content
      const [contentItem] = await db
        .select()
        .from(contents)
        .where(eq(contents.id, id));

      if (!contentItem) {
        return res.status(404).json({ error: "Content not found" });
      }

      // Extract text for word count
      const blocks = (contentItem.blocks as any[]) || [];
      const textContent = blocks
        .filter((b: any) => b.type === "text" || b.type === "paragraph")
        .map((b: any) => b.content || b.text || "")
        .join(" ");

      const seoScore = calculateSeoScore({
        title: contentItem.title,
        metaTitle: contentItem.metaTitle,
        metaDescription: contentItem.metaDescription,
        slug: contentItem.slug,
        blocks: blocks,
        heroImage: contentItem.heroImage,
        primaryKeyword: (contentItem as any).primaryKeyword,
        wordCount: textContent.split(/\s+/).length,
      });

      res.json({
        contentId: id,
        ...seoScore,
        threshold: imageLogic.SEO_THRESHOLD,
        canPublish: seoScore.passesThreshold,
        message: seoScore.passesThreshold
          ? "Content meets SEO requirements"
          : `SEO score (${seoScore.percentage}%) is below required ${imageLogic.SEO_THRESHOLD}%`,
      });
    } catch (error) {
      console.error("[ImageLogic] Error calculating SEO score:", error);
      res.status(500).json({ error: "Failed to calculate SEO score" });
    }
  });

  // -------------------------------------------------------------------------
  // POST /api/contents/:id/validate-publish
  // Validate content can be published (SEO + images check)
  // -------------------------------------------------------------------------
  app.post("/api/contents/:id/validate-publish", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { bypassWarnings } = req.body;

      // Get content
      const [contentItem] = await db
        .select()
        .from(contents)
        .where(eq(contents.id, id));

      if (!contentItem) {
        return res.status(404).json({ error: "Content not found" });
      }

      const blocks = (contentItem.blocks as any[]) || [];
      const textContent = blocks
        .filter((b: any) => b.type === "text" || b.type === "paragraph")
        .map((b: any) => b.content || b.text || "")
        .join(" ");

      // Calculate SEO score
      const seoScore = calculateSeoScore({
        title: contentItem.title,
        metaTitle: contentItem.metaTitle,
        metaDescription: contentItem.metaDescription,
        slug: contentItem.slug,
        blocks: blocks,
        heroImage: contentItem.heroImage,
        primaryKeyword: (contentItem as any).primaryKeyword,
        wordCount: textContent.split(/\s+/).length,
      });

      // Get image slots for this content type
      const slots = IMAGE_SLOTS_BY_TYPE[contentItem.type] || IMAGE_SLOTS_BY_TYPE.article;
      const requiredSlots = slots.filter(s => s.required);

      // Check if required images exist
      const hasHero = !!contentItem.heroImage;
      const blockImages = blocks.filter((b: any) => b.type === "image").length;
      const totalImages = (hasHero ? 1 : 0) + blockImages;

      const imageIssues: string[] = [];
      if (!hasHero) {
        imageIssues.push("Missing hero image");
      }
      if (totalImages < requiredSlots.length) {
        imageIssues.push(`Need ${requiredSlots.length} images, have ${totalImages}`);
      }

      // Build validation result
      const validationResult = {
        contentId: id,
        canPublish: seoScore.passesThreshold && imageIssues.length === 0,
        seo: {
          score: seoScore.percentage,
          threshold: imageLogic.SEO_THRESHOLD,
          passes: seoScore.passesThreshold,
          breakdown: seoScore.breakdown,
          warnings: seoScore.warnings,
        },
        images: {
          required: requiredSlots.length,
          found: totalImages,
          hasHero,
          issues: imageIssues,
        },
        overallIssues: [
          ...seoScore.warnings,
          ...imageIssues,
        ],
      };

      // If there are issues and bypass not requested, return warning
      if (!validationResult.canPublish && !bypassWarnings) {
        return res.status(422).json({
          ...validationResult,
          action: "confirm_required",
          message: "Content does not meet publishing requirements. Set bypassWarnings=true to publish anyway.",
        });
      }

      res.json({
        ...validationResult,
        action: validationResult.canPublish ? "ready" : "bypassed",
        message: validationResult.canPublish
          ? "Content is ready to publish"
          : "Publishing with warnings bypassed",
      });
    } catch (error) {
      console.error("[ImageLogic] Error validating publish:", error);
      res.status(500).json({ error: "Failed to validate content" });
    }
  });

  // -------------------------------------------------------------------------
  // POST /api/image-logic/generate-ai-image
  // Generate an AI image using the prompt
  // -------------------------------------------------------------------------
  app.post("/api/image-logic/generate-ai-image", async (req: Request, res: Response) => {
    try {
      const { prompt, slotId, contentType, title, content, analysis, brief } = req.body;

      let aiPrompt: AiImagePrompt;

      if (prompt && typeof prompt === "object" && prompt.prompt) {
        // Use provided prompt object
        aiPrompt = prompt;
      } else if (brief && analysis) {
        // Generate prompt from brief and analysis
        aiPrompt = generateAiImagePrompt(brief, analysis);
      } else if (slotId && contentType && title && content) {
        // Generate from scratch
        const contentAnalysis = analyzeContent(title, content, contentType);
        const briefs = generateImageBriefs(contentType, contentAnalysis);
        const matchingBrief = briefs.find(b => b.slotId === slotId);

        if (!matchingBrief) {
          return res.status(400).json({ error: `Invalid slotId: ${slotId}` });
        }

        aiPrompt = generateAiImagePrompt(matchingBrief, contentAnalysis);
      } else {
        return res.status(400).json({
          error: "Provide either (prompt) or (brief + analysis) or (slotId + contentType + title + content)",
        });
      }

      // Determine size based on aspect ratio
      const size: "1024x1024" | "1792x1024" | "1024x1792" =
        aiPrompt.aspectRatio === "16:9" ? "1792x1024" :
        aiPrompt.aspectRatio === "3:4" ? "1024x1792" :
        "1024x1024";

      // Generate the image using DALL-E
      const imageUrl = await generateImage(aiPrompt.prompt, {
        size,
        quality: "hd",
        style: aiPrompt.style === "cinematic" ? "vivid" : "natural",
      });

      if (!imageUrl) {
        return res.status(503).json({
          error: "AI image generation failed",
          message: "OpenAI API may not be configured or encountered an error",
        });
      }

      res.json({
        success: true,
        imageUrl,
        prompt: aiPrompt,
        size,
      });
    } catch (error) {
      console.error("[ImageLogic] Error generating AI image:", error);
      res.status(500).json({ error: "Failed to generate AI image" });
    }
  });

  // -------------------------------------------------------------------------
  // GET /api/image-logic/config
  // Get current image logic configuration
  // -------------------------------------------------------------------------
  app.get("/api/image-logic/config", async (req: Request, res: Response) => {
    try {
      res.json({
        seoThreshold: imageLogic.SEO_THRESHOLD,
        freepikConfigured: !!process.env.FREEPIK_API_KEY,
        contentTypes: Object.keys(IMAGE_SLOTS_BY_TYPE),
        areaCount: Object.keys(DUBAI_AREAS).length,
        features: {
          contentAnalysis: true,
          areaDetection: true,
          imageBriefGeneration: true,
          freepikSearch: !!process.env.FREEPIK_API_KEY,
          aiPromptGeneration: true,
          seoScoring: true,
          publishValidation: true,
        },
      });
    } catch (error) {
      console.error("[ImageLogic] Error fetching config:", error);
      res.status(500).json({ error: "Failed to fetch config" });
    }
  });

  console.log("[ImageLogic] Routes registered");
}
