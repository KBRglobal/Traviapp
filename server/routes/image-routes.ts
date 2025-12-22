/**
 * Unified Image Routes
 * Consolidated API endpoints for all image operations
 */

import { Express, Request, Response, NextFunction } from "express";
import * as multer from "multer";
import {
  getImageService,
  uploadImage,
  uploadImageFromUrl,
  deleteImage,
  StoredImage,
  UploadError,
} from "../services/image-service";
import {
  getExternalImageService,
  AIGenerationOptions,
  FreepikSearchOptions,
} from "../services/external-image-service";
import { SUPPORTED_MIME_TYPES } from "../services/image-processing";
import {
  rateLimiters,
  requirePermission,
  checkReadOnlyMode,
  checkAiUsageLimit,
  safeMode,
} from "../security";

// Multer configuration for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (SUPPORTED_MIME_TYPES.includes(file.mimetype as any)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  },
});

/**
 * Register all image routes
 */
export function registerImageRoutes(app: Express) {
  const imageService = getImageService();
  const externalImageService = getExternalImageService();

  // ============================================================================
  // UPLOAD ROUTES
  // ============================================================================

  /**
   * POST /api/images/upload
   * Upload a single image from file
   */
  app.post(
    "/api/images/upload",
    requirePermission("canAccessMediaLibrary"),
    checkReadOnlyMode,
    upload.single("file"),
    async (req: Request, res: Response) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: "No file provided" });
        }

        const { altText, contentId } = req.body;

        const result = await uploadImage(
          req.file.buffer,
          req.file.originalname,
          req.file.mimetype,
          {
            source: "upload",
            altText,
            contentId: contentId ? parseInt(contentId) : undefined,
          }
        );

        if (!result.success) {
          return res.status(400).json({ error: (result as UploadError).error });
        }

        res.json({
          success: true,
          image: result.image,
        });
      } catch (error) {
        console.error("[ImageRoutes] Upload error:", error);
        const message = error instanceof Error ? error.message : "Upload failed";
        res.status(500).json({ error: message });
      }
    }
  );

  /**
   * POST /api/images/upload-batch
   * Upload multiple images
   */
  app.post(
    "/api/images/upload-batch",
    requirePermission("canAccessMediaLibrary"),
    checkReadOnlyMode,
    upload.array("files", 10),
    async (req: Request, res: Response) => {
      try {
        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
          return res.status(400).json({ error: "No files provided" });
        }

        const { altText, contentId } = req.body;

        const result = await imageService.uploadBatch(
          files.map((f) => ({
            buffer: f.buffer,
            filename: f.originalname,
            mimeType: f.mimetype,
          })),
          {
            source: "upload",
            altText,
            contentId: contentId ? parseInt(contentId) : undefined,
          }
        );

        res.json({
          success: true,
          total: result.total,
          successful: result.successful.length,
          failed: result.failed.length,
          images: result.successful,
          errors: result.failed,
        });
      } catch (error) {
        console.error("[ImageRoutes] Batch upload error:", error);
        const message = error instanceof Error ? error.message : "Batch upload failed";
        res.status(500).json({ error: message });
      }
    }
  );

  /**
   * POST /api/images/upload-url
   * Upload image from external URL
   */
  app.post("/api/images/upload-url", requirePermission("canAccessMediaLibrary"), checkReadOnlyMode, async (req: Request, res: Response) => {
    try {
      const { url, filename, altText, contentId } = req.body;

      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      const result = await uploadImageFromUrl(url, filename || `external-${Date.now()}.jpg`, {
        source: "external",
        altText,
        contentId: contentId ? parseInt(contentId) : undefined,
      });

      if (!result.success) {
        return res.status(400).json({ error: (result as UploadError).error });
      }

      res.json({
        success: true,
        image: result.image,
      });
    } catch (error) {
      console.error("[ImageRoutes] URL upload error:", error);
      const message = error instanceof Error ? error.message : "URL upload failed";
      res.status(500).json({ error: message });
    }
  });

  // ============================================================================
  // AI GENERATION ROUTES
  // ============================================================================

  /**
   * POST /api/images/generate-ai
   * Generate and store an AI image
   */
  app.post("/api/images/generate-ai", requirePermission("canCreate"), rateLimiters.ai, checkAiUsageLimit, async (req: Request, res: Response) => {
    // Check if AI is disabled
    if (safeMode.aiDisabled) {
      return res.status(503).json({ error: "AI features are temporarily disabled", code: "AI_DISABLED" });
    }

    try {
      const {
        prompt,
        filename,
        size,
        quality,
        style,
        provider,
        altText,
        contentId,
      } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const options: AIGenerationOptions & { altText?: string; contentId?: number } = {
        size: size || "1792x1024",
        quality: quality || "hd",
        style: style || "natural",
        provider: provider || "auto",
        altText,
        contentId: contentId ? parseInt(contentId) : undefined,
      };

      const result = await externalImageService.generateAndStoreAIImage(
        prompt,
        filename || `ai-${Date.now()}.jpg`,
        options
      );

      if (!result.success) {
        return res.status(500).json({ error: (result as UploadError).error });
      }

      res.json({
        success: true,
        image: result.image,
      });
    } catch (error) {
      console.error("[ImageRoutes] AI generation error:", error);
      const message = error instanceof Error ? error.message : "AI generation failed";
      res.status(500).json({ error: message });
    }
  });

  /**
   * POST /api/images/generate-ai-batch
   * Generate multiple AI images from prompts
   */
  app.post("/api/images/generate-ai-batch", requirePermission("canCreate"), rateLimiters.ai, checkAiUsageLimit, async (req: Request, res: Response) => {
    if (safeMode.aiDisabled) {
      return res.status(503).json({ error: "AI features are temporarily disabled", code: "AI_DISABLED" });
    }

    try {
      const { prompts, options, contentId } = req.body;

      if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
        return res.status(400).json({ error: "Prompts array is required" });
      }

      if (prompts.length > 5) {
        return res.status(400).json({ error: "Maximum 5 prompts per batch" });
      }

      const results: { successful: StoredImage[]; failed: Array<{ prompt: string; error: string }> } = {
        successful: [],
        failed: [],
      };

      for (const item of prompts) {
        const prompt = typeof item === "string" ? item : item.prompt;
        const filename = typeof item === "string" ? `ai-${Date.now()}.jpg` : item.filename;

        const result = await externalImageService.generateAndStoreAIImage(prompt, filename, {
          ...options,
          contentId: contentId ? parseInt(contentId) : undefined,
        });

        if (result.success) {
          results.successful.push(result.image);
        } else {
          results.failed.push({ prompt, error: (result as UploadError).error });
        }
      }

      res.json({
        success: true,
        total: prompts.length,
        successful: results.successful.length,
        failed: results.failed.length,
        images: results.successful,
        errors: results.failed,
      });
    } catch (error) {
      console.error("[ImageRoutes] AI batch generation error:", error);
      const message = error instanceof Error ? error.message : "AI batch generation failed";
      res.status(500).json({ error: message });
    }
  });

  // ============================================================================
  // FREEPIK ROUTES
  // ============================================================================

  /**
   * POST /api/images/search-freepik
   * Search Freepik for images
   */
  app.post("/api/images/search-freepik", requirePermission("canAccessMediaLibrary"), async (req: Request, res: Response) => {
    try {
      const { query, limit, page, orientation, premium } = req.body;

      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      const options: FreepikSearchOptions = {
        limit: limit || 20,
        page: page || 1,
        orientation,
        premium,
      };

      const result = await externalImageService.searchFreepik(query, options);

      if (!result.success) {
        return res.status(500).json({ error: (result as { success: false; error: string }).error });
      }

      res.json({
        success: true,
        results: result.results,
        count: result.results.length,
      });
    } catch (error) {
      console.error("[ImageRoutes] Freepik search error:", error);
      const message = error instanceof Error ? error.message : "Freepik search failed";
      res.status(500).json({ error: message });
    }
  });

  /**
   * POST /api/images/download-freepik
   * Download and store image from Freepik
   */
  app.post("/api/images/download-freepik", requirePermission("canAccessMediaLibrary"), checkReadOnlyMode, async (req: Request, res: Response) => {
    try {
      const { url, filename, altText, contentId } = req.body;

      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      const result = await externalImageService.downloadFromFreepik(
        url,
        filename || `freepik-${Date.now()}.jpg`,
        {
          altText,
          contentId: contentId ? parseInt(contentId) : undefined,
        }
      );

      if (!result.success) {
        return res.status(500).json({ error: (result as UploadError).error });
      }

      res.json({
        success: true,
        image: result.image,
      });
    } catch (error) {
      console.error("[ImageRoutes] Freepik download error:", error);
      const message = error instanceof Error ? error.message : "Freepik download failed";
      res.status(500).json({ error: message });
    }
  });

  // ============================================================================
  // DELETE ROUTES
  // ============================================================================

  /**
   * DELETE /api/images
   * Delete an image by URL
   */
  app.delete("/api/images", requirePermission("canAccessMediaLibrary"), checkReadOnlyMode, async (req: Request, res: Response) => {
    try {
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      const result = await deleteImage(url);

      if (!result.success) {
        return res.status(500).json({ error: result.error || "Delete failed" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("[ImageRoutes] Delete error:", error);
      const message = error instanceof Error ? error.message : "Delete failed";
      res.status(500).json({ error: message });
    }
  });

  // ============================================================================
  // STATUS ROUTES
  // ============================================================================

  /**
   * GET /api/images/status
   * Get storage status and configuration
   */
  app.get("/api/images/status", requirePermission("canManageSettings"), async (req: Request, res: Response) => {
    try {
      const status = imageService.getStorageStatus();
      const supportedTypes = imageService.getSupportedMimeTypes();

      res.json({
        success: true,
        storage: status,
        supportedMimeTypes: supportedTypes,
        maxFileSize: "10MB",
      });
    } catch (error) {
      console.error("[ImageRoutes] Status error:", error);
      res.status(500).json({ error: "Failed to get status" });
    }
  });

  console.log("[ImageRoutes] Registered unified image API routes at /api/images/*");
}
