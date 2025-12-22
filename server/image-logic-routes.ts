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
import {
  enforceImageSeo,
  validateImageSeo,
  generateImageSeoTags,
  SEO_RULES,
} from "./image-seo-service";

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
          mediaLibraryIntegration: true,
        },
      });
    } catch (error) {
      console.error("[ImageLogic] Error fetching config:", error);
      res.status(500).json({ error: "Failed to fetch config" });
    }
  });

  // -------------------------------------------------------------------------
  // POST /api/image-logic/download-to-library
  // Download an image from URL and save to Media Library
  // ENFORCES SEO TAGS - auto-generates if not provided
  // -------------------------------------------------------------------------
  app.post("/api/image-logic/download-to-library", async (req: Request, res: Response) => {
    try {
      const { imageUrl, altText, title, caption, originalFilename, source, contentId, contentType, context } = req.body;

      if (!imageUrl) {
        return res.status(400).json({
          error: "Missing required field: imageUrl",
        });
      }

      // ENFORCE SEO: Generate missing tags using AI
      const seoResult = await enforceImageSeo(
        {
          url: imageUrl,
          contentType: contentType || 'general',
          context: context || originalFilename,
        },
        {
          alt: altText,
          title,
          caption,
        }
      );

      if (!seoResult.validation.isValid) {
        return res.status(422).json({
          error: "Image SEO validation failed",
          validation: seoResult.validation,
          generatedTags: seoResult.tags,
          message: "SEO tags are required. Use the generated tags or provide valid ones.",
        });
      }

      const result = await imageLogic.downloadToMediaLibrary(imageUrl, {
        altText: seoResult.tags.alt, // Use enforced alt text
        originalFilename,
        source: source || 'external',
        contentId,
      });

      if (!result.success) {
        return res.status(500).json({
          error: "Failed to download image",
          message: result.error,
        });
      }

      // Save to database using storage with full SEO metadata
      const storage = (await import("./storage")).storage;
      const mediaFile = await storage.createMediaFile({
        filename: result.mediaFile!.filename,
        originalFilename: originalFilename || result.mediaFile!.filename,
        mimeType: 'image/webp',
        size: 0,
        url: result.mediaFile!.url,
        altText: seoResult.tags.alt,
        width: null,
        height: null,
      });

      res.json({
        success: true,
        mediaFile,
        seo: {
          tags: seoResult.tags,
          wasAutoGenerated: seoResult.wasAutoGenerated,
          validation: seoResult.validation,
        },
      });
    } catch (error) {
      console.error("[ImageLogic] Error downloading to library:", error);
      res.status(500).json({ error: "Failed to download to media library" });
    }
  });

  // -------------------------------------------------------------------------
  // POST /api/image-logic/search-and-download
  // Search Freepik and optionally auto-download to Media Library
  // -------------------------------------------------------------------------
  app.post("/api/image-logic/search-and-download", async (req: Request, res: Response) => {
    try {
      const { query, autoDownload, downloadCount, altTextPrefix, contentId } = req.body;

      if (!query) {
        return res.status(400).json({
          error: "Missing required field: query",
        });
      }

      const result = await imageLogic.searchAndDownloadFreepik(query, {
        autoDownload,
        downloadCount,
        altTextPrefix,
        contentId,
      });

      // If auto-download was successful, save to database
      if (autoDownload && result.downloadedMedia.length > 0) {
        const storage = (await import("./storage")).storage;

        for (const download of result.downloadedMedia) {
          if (download.success && download.mediaFile) {
            await storage.createMediaFile({
              filename: download.mediaFile.filename,
              originalFilename: download.mediaFile.filename,
              mimeType: 'image/webp',
              size: 0,
              url: download.mediaFile.url,
              altText: download.mediaFile.altText,
              width: null,
              height: null,
            });
          }
        }
      }

      res.json({
        success: true,
        searchResults: result.searchResults,
        downloadedMedia: result.downloadedMedia,
      });
    } catch (error) {
      console.error("[ImageLogic] Error in search-and-download:", error);
      res.status(500).json({ error: "Failed to search and download" });
    }
  });

  // -------------------------------------------------------------------------
  // POST /api/image-seo/validate
  // Validate image SEO tags
  // -------------------------------------------------------------------------
  app.post("/api/image-seo/validate", async (req: Request, res: Response) => {
    try {
      const { image, images } = req.body;

      if (images && Array.isArray(images)) {
        // Validate multiple images
        const results = images.map((img: any) => ({
          url: img.url || img.image,
          validation: validateImageSeo(img),
        }));

        const allValid = results.every((r: any) => r.validation.isValid);
        const averageScore = results.reduce((sum: number, r: any) => sum + r.validation.score, 0) / results.length;

        return res.json({
          allValid,
          averageScore: Math.round(averageScore),
          results,
          rules: SEO_RULES,
        });
      }

      if (image) {
        const validation = validateImageSeo(image);
        return res.json({
          validation,
          rules: SEO_RULES,
        });
      }

      return res.status(400).json({ error: "Provide 'image' or 'images' array" });
    } catch (error) {
      console.error("[ImageSeo] Validation error:", error);
      res.status(500).json({ error: "Failed to validate image SEO" });
    }
  });

  // -------------------------------------------------------------------------
  // POST /api/image-seo/generate
  // Generate SEO tags for an image using AI
  // -------------------------------------------------------------------------
  app.post("/api/image-seo/generate", async (req: Request, res: Response) => {
    try {
      const { url, context, contentType, location, existingAlt, existingTitle } = req.body;

      if (!url) {
        return res.status(400).json({ error: "Missing required field: url" });
      }

      const tags = await generateImageSeoTags({
        url,
        context,
        contentType,
        location,
        existingAlt,
        existingTitle,
      });

      res.json({
        success: true,
        tags,
        validation: validateImageSeo(tags),
      });
    } catch (error) {
      console.error("[ImageSeo] Generation error:", error);
      res.status(500).json({ error: "Failed to generate SEO tags" });
    }
  });

  // -------------------------------------------------------------------------
  // POST /api/image-seo/enforce
  // Validate and auto-generate missing SEO tags (MAIN ENFORCEMENT ENDPOINT)
  // -------------------------------------------------------------------------
  app.post("/api/image-seo/enforce", async (req: Request, res: Response) => {
    try {
      const { url, context, contentType, location, existingTags } = req.body;

      if (!url) {
        return res.status(400).json({ error: "Missing required field: url" });
      }

      const result = await enforceImageSeo(
        { url, context, contentType, location },
        existingTags
      );

      // If still not valid after enforcement, return error
      if (!result.validation.isValid) {
        return res.status(422).json({
          error: "Image SEO requirements not met",
          validation: result.validation,
          tags: result.tags,
          wasAutoGenerated: result.wasAutoGenerated,
        });
      }

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("[ImageSeo] Enforcement error:", error);
      res.status(500).json({ error: "Failed to enforce image SEO" });
    }
  });

  // -------------------------------------------------------------------------
  // GET /api/image-seo/rules
  // Get SEO rules and requirements
  // -------------------------------------------------------------------------
  app.get("/api/image-seo/rules", async (req: Request, res: Response) => {
    try {
      res.json({
        rules: SEO_RULES,
        required: ['alt', 'title'],
        recommended: ['caption', 'keywords', 'contentLocation', 'altHe'],
        tips: [
          'Alt text should be 50-125 characters, describing what is shown',
          'Title format: "Place Name - Interesting Fact | TripMD"',
          'Use hyphens in filenames, not underscores',
          'Include location context for local SEO',
          'Add Hebrew alt text for multilingual support',
        ],
      });
    } catch (error) {
      console.error("[ImageSeo] Error fetching rules:", error);
      res.status(500).json({ error: "Failed to fetch SEO rules" });
    }
  });

  console.log("[ImageLogic] Routes registered");
  console.log("[ImageSeo] SEO enforcement routes registered");
}
