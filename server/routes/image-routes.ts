/**
 * Image Routes
 * Unified API routes for all image-related operations
 */

import { Express, Request, Response } from 'express';
import { db } from '../db';
import { contents, mediaFiles } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Import from new services
import {
  DUBAI_AREAS,
  IMAGE_SLOTS_BY_TYPE,
  analyzeContent,
  generateImageBriefs,
  generateAiImagePrompt,
  generateImageSeo,
  selectImagesForContent,
  ContentAnalysis,
} from '../services/image-service';

import {
  searchFreepik,
  searchAndDownloadFreepik,
  generateAiImage,
  ImageSearchBrief,
} from '../services/external-image-service';

import {
  downloadAndSaveImage,
} from '../services/image-processing';

import {
  validateImageSeo,
  generateImageSeoTags,
  enforceImageSeo,
  SEO_RULES,
} from '../services/image-seo-service';

import { generateImage } from '../ai-generator';
import { storage } from '../storage';

// SEO Score calculation
const SEO_THRESHOLD = 92;

interface SeoScoreResult {
  score: number;
  maxScore: number;
  percentage: number;
  passesThreshold: boolean;
  breakdown: Array<{
    category: string;
    score: number;
    maxScore: number;
    issues: string[];
  }>;
  warnings: string[];
}

function calculateSeoScore(content: {
  title: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  slug: string;
  blocks?: any[];
  heroImage?: string | null;
  primaryKeyword?: string | null;
  wordCount?: number;
}): SeoScoreResult {
  const breakdown: SeoScoreResult['breakdown'] = [];
  const warnings: string[] = [];
  let totalScore = 0;
  let maxTotal = 0;

  // Title (15 points)
  {
    let score = 0;
    const issues: string[] = [];
    const maxScore = 15;

    if (content.title) {
      score += 5;
      if (content.title.length >= 30 && content.title.length <= 60) {
        score += 5;
      } else {
        issues.push(`Title length: ${content.title.length} (optimal: 30-60)`);
      }
      if (content.primaryKeyword && content.title.toLowerCase().includes(content.primaryKeyword.toLowerCase())) {
        score += 5;
      } else {
        issues.push('Primary keyword not in title');
      }
    } else {
      issues.push('Missing title');
    }

    breakdown.push({ category: 'Title', score, maxScore, issues });
    totalScore += score;
    maxTotal += maxScore;
  }

  // Meta Description (15 points)
  {
    let score = 0;
    const issues: string[] = [];
    const maxScore = 15;

    if (content.metaDescription) {
      score += 5;
      if (content.metaDescription.length >= 120 && content.metaDescription.length <= 160) {
        score += 5;
      } else {
        issues.push(`Meta description length: ${content.metaDescription.length} (optimal: 120-160)`);
      }
      if (content.primaryKeyword && content.metaDescription.toLowerCase().includes(content.primaryKeyword.toLowerCase())) {
        score += 5;
      } else {
        issues.push('Primary keyword not in meta description');
      }
    } else {
      issues.push('Missing meta description');
      warnings.push('Meta description is required for SEO');
    }

    breakdown.push({ category: 'Meta Description', score, maxScore, issues });
    totalScore += score;
    maxTotal += maxScore;
  }

  // URL/Slug (10 points)
  {
    let score = 0;
    const issues: string[] = [];
    const maxScore = 10;

    if (content.slug) {
      score += 3;
      if (content.slug.length <= 75) {
        score += 3;
      } else {
        issues.push('Slug too long');
      }
      if (!/[A-Z]/.test(content.slug) && !/\s/.test(content.slug)) {
        score += 2;
      } else {
        issues.push('Slug should be lowercase with hyphens');
      }
      if (content.primaryKeyword && content.slug.includes(content.primaryKeyword.toLowerCase().replace(/\s+/g, '-'))) {
        score += 2;
      }
    } else {
      issues.push('Missing slug');
    }

    breakdown.push({ category: 'URL Structure', score, maxScore, issues });
    totalScore += score;
    maxTotal += maxScore;
  }

  // Hero Image (15 points)
  {
    let score = 0;
    const issues: string[] = [];
    const maxScore = 15;

    if (content.heroImage) {
      score += 10;
      if (content.heroImage.includes('.webp')) {
        score += 5;
      } else {
        issues.push('Hero image should be WebP format');
      }
    } else {
      issues.push('Missing hero image');
      warnings.push('Hero image is essential for engagement');
    }

    breakdown.push({ category: 'Hero Image', score, maxScore, issues });
    totalScore += score;
    maxTotal += maxScore;
  }

  // Content Length (15 points)
  {
    let score = 0;
    const issues: string[] = [];
    const maxScore = 15;

    const wordCount = content.wordCount || 0;
    if (wordCount >= 300) score += 5;
    if (wordCount >= 600) score += 5;
    if (wordCount >= 1000) score += 5;

    if (wordCount < 300) {
      issues.push(`Word count: ${wordCount} (minimum: 300)`);
      warnings.push('Content is too short for good SEO');
    }

    breakdown.push({ category: 'Content Length', score, maxScore, issues });
    totalScore += score;
    maxTotal += maxScore;
  }

  // Content Structure (15 points)
  {
    let score = 0;
    const issues: string[] = [];
    const maxScore = 15;

    const blocks = content.blocks || [];
    if (blocks.length > 0) {
      score += 5;
      const hasHeadings = blocks.some((b: any) => b.type === 'heading');
      if (hasHeadings) {
        score += 5;
      } else {
        issues.push('No headings in content');
      }
      const hasImages = blocks.some((b: any) => b.type === 'image' || b.type === 'hero');
      if (hasImages) {
        score += 5;
      } else {
        issues.push('No images in content body');
      }
    } else {
      issues.push('No content blocks');
    }

    breakdown.push({ category: 'Content Structure', score, maxScore, issues });
    totalScore += score;
    maxTotal += maxScore;
  }

  // Keyword Optimization (15 points)
  {
    let score = 0;
    const issues: string[] = [];
    const maxScore = 15;

    if (content.primaryKeyword) {
      score += 15;
    } else {
      issues.push('No primary keyword defined');
      warnings.push('Define a primary keyword for better SEO');
    }

    breakdown.push({ category: 'Keyword Optimization', score, maxScore, issues });
    totalScore += score;
    maxTotal += maxScore;
  }

  const percentage = Math.round((totalScore / maxTotal) * 100);
  const passesThreshold = percentage >= SEO_THRESHOLD;

  if (!passesThreshold) {
    warnings.unshift(`SEO score ${percentage}% is below the required ${SEO_THRESHOLD}%`);
  }

  return {
    score: totalScore,
    maxScore: maxTotal,
    percentage,
    passesThreshold,
    breakdown,
    warnings,
  };
}

// ============================================================================
// ROUTE REGISTRATION
// ============================================================================

export function registerImageRoutes(app: Express) {

  // -------------------------------------------------------------------------
  // GET /api/image-logic/areas
  // -------------------------------------------------------------------------
  app.get('/api/image-logic/areas', async (req: Request, res: Response) => {
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
      console.error('[ImageRoutes] Error fetching areas:', error);
      res.status(500).json({ error: 'Failed to fetch areas' });
    }
  });

  // -------------------------------------------------------------------------
  // GET /api/image-logic/slots/:contentType
  // -------------------------------------------------------------------------
  app.get('/api/image-logic/slots/:contentType', async (req: Request, res: Response) => {
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
      console.error('[ImageRoutes] Error fetching slots:', error);
      res.status(500).json({ error: 'Failed to fetch slots' });
    }
  });

  // -------------------------------------------------------------------------
  // POST /api/image-logic/analyze
  // -------------------------------------------------------------------------
  app.post('/api/image-logic/analyze', async (req: Request, res: Response) => {
    try {
      const { title, content, contentType, keywords } = req.body;

      if (!title || !content || !contentType) {
        return res.status(400).json({
          error: 'Missing required fields: title, content, contentType',
        });
      }

      const analysis = analyzeContent(title, content, contentType, keywords);
      const briefs = generateImageBriefs(contentType, analysis);

      res.json({
        analysis,
        briefs,
        areaDetails: analysis.area ? DUBAI_AREAS[analysis.area] : null,
      });
    } catch (error) {
      console.error('[ImageRoutes] Error analyzing content:', error);
      res.status(500).json({ error: 'Failed to analyze content' });
    }
  });

  // -------------------------------------------------------------------------
  // POST /api/contents/:id/analyze-images
  // -------------------------------------------------------------------------
  app.post('/api/contents/:id/analyze-images', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const [contentItem] = await db
        .select()
        .from(contents)
        .where(eq(contents.id, id));

      if (!contentItem) {
        return res.status(404).json({ error: 'Content not found' });
      }

      const blocks = (contentItem.blocks as any[]) || [];
      const textContent = blocks
        .filter((b: any) => b.type === 'text' || b.type === 'paragraph')
        .map((b: any) => b.content || b.text || '')
        .join(' ');

      const fullContent = `${contentItem.title} ${textContent}`;

      const analysis = analyzeContent(
        contentItem.title,
        fullContent,
        contentItem.type,
        (contentItem as any).keywords || []
      );

      const briefs = generateImageBriefs(contentItem.type, analysis);

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
        },
        areaDetails: analysis.area ? DUBAI_AREAS[analysis.area] : null,
      });
    } catch (error) {
      console.error('[ImageRoutes] Error analyzing content images:', error);
      res.status(500).json({ error: 'Failed to analyze content images' });
    }
  });

  // -------------------------------------------------------------------------
  // POST /api/image-logic/search
  // -------------------------------------------------------------------------
  app.post('/api/image-logic/search', async (req: Request, res: Response) => {
    try {
      const { brief, query, filters } = req.body;

      const apiKey = process.env.FREEPIK_API_KEY;

      if (!apiKey) {
        return res.status(503).json({
          error: 'Freepik API not configured',
          message: 'Set FREEPIK_API_KEY environment variable',
          fallbackAvailable: true,
        });
      }

      const searchBrief: ImageSearchBrief = brief || {
        slotId: 'custom',
        role: 'hero',
        primaryQuery: query,
        alternativeQueries: [],
        mustInclude: filters?.mustInclude || [],
        mustExclude: filters?.mustExclude || [],
        style: filters?.style || {},
      };

      const result = await searchFreepik(searchBrief, apiKey);

      res.json(result);
    } catch (error) {
      console.error('[ImageRoutes] Error searching Freepik:', error);
      res.status(500).json({ error: 'Failed to search Freepik' });
    }
  });

  // -------------------------------------------------------------------------
  // POST /api/image-logic/generate-ai-prompt
  // -------------------------------------------------------------------------
  app.post('/api/image-logic/generate-ai-prompt', async (req: Request, res: Response) => {
    try {
      const { brief, analysis, slotId, contentType, title, content } = req.body;

      let finalAnalysis: ContentAnalysis;
      let finalBrief: ImageSearchBrief;

      if (brief && analysis) {
        finalAnalysis = analysis;
        finalBrief = brief;
      } else if (slotId && contentType && title && content) {
        finalAnalysis = analyzeContent(title, content, contentType);
        const briefs = generateImageBriefs(contentType, finalAnalysis);
        const matchingBrief = briefs.find(b => b.slotId === slotId);

        if (!matchingBrief) {
          return res.status(400).json({ error: `Invalid slotId: ${slotId}` });
        }
        finalBrief = matchingBrief;
      } else {
        return res.status(400).json({
          error: 'Provide either (brief + analysis) or (slotId + contentType + title + content)',
        });
      }

      const prompt = generateAiImagePrompt(finalBrief, finalAnalysis);

      res.json({
        prompt,
        slotId: finalBrief.slotId,
        role: finalBrief.role,
      });
    } catch (error) {
      console.error('[ImageRoutes] Error generating AI prompt:', error);
      res.status(500).json({ error: 'Failed to generate AI prompt' });
    }
  });

  // -------------------------------------------------------------------------
  // POST /api/image-logic/select-images
  // -------------------------------------------------------------------------
  app.post('/api/image-logic/select-images', async (req: Request, res: Response) => {
    try {
      const { contentType, title, content, keywords, forceAi } = req.body;

      if (!contentType || !title || !content) {
        return res.status(400).json({
          error: 'Missing required fields: contentType, title, content',
        });
      }

      const result = await selectImagesForContent(contentType, title, content, {
        freepikApiKey: process.env.FREEPIK_API_KEY,
        keywords,
        forceAi,
      });

      res.json(result);
    } catch (error) {
      console.error('[ImageRoutes] Error selecting images:', error);
      res.status(500).json({ error: 'Failed to select images' });
    }
  });

  // -------------------------------------------------------------------------
  // GET /api/contents/:id/seo-score
  // -------------------------------------------------------------------------
  app.get('/api/contents/:id/seo-score', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const [contentItem] = await db
        .select()
        .from(contents)
        .where(eq(contents.id, id));

      if (!contentItem) {
        return res.status(404).json({ error: 'Content not found' });
      }

      const blocks = (contentItem.blocks as any[]) || [];
      const textContent = blocks
        .filter((b: any) => b.type === 'text' || b.type === 'paragraph')
        .map((b: any) => b.content || b.text || '')
        .join(' ');

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
        threshold: SEO_THRESHOLD,
        canPublish: seoScore.passesThreshold,
        message: seoScore.passesThreshold
          ? 'Content meets SEO requirements'
          : `SEO score (${seoScore.percentage}%) is below required ${SEO_THRESHOLD}%`,
      });
    } catch (error) {
      console.error('[ImageRoutes] Error calculating SEO score:', error);
      res.status(500).json({ error: 'Failed to calculate SEO score' });
    }
  });

  // -------------------------------------------------------------------------
  // POST /api/contents/:id/validate-publish
  // -------------------------------------------------------------------------
  app.post('/api/contents/:id/validate-publish', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { bypassWarnings } = req.body;

      const [contentItem] = await db
        .select()
        .from(contents)
        .where(eq(contents.id, id));

      if (!contentItem) {
        return res.status(404).json({ error: 'Content not found' });
      }

      const blocks = (contentItem.blocks as any[]) || [];
      const textContent = blocks
        .filter((b: any) => b.type === 'text' || b.type === 'paragraph')
        .map((b: any) => b.content || b.text || '')
        .join(' ');

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

      const slots = IMAGE_SLOTS_BY_TYPE[contentItem.type] || IMAGE_SLOTS_BY_TYPE.article;
      const requiredSlots = slots.filter(s => s.required);

      const hasHero = !!contentItem.heroImage;
      const blockImages = blocks.filter((b: any) => b.type === 'image').length;
      const totalImages = (hasHero ? 1 : 0) + blockImages;

      const imageIssues: string[] = [];
      if (!hasHero) {
        imageIssues.push('Missing hero image');
      }
      if (totalImages < requiredSlots.length) {
        imageIssues.push(`Need ${requiredSlots.length} images, have ${totalImages}`);
      }

      const validationResult = {
        contentId: id,
        canPublish: seoScore.passesThreshold && imageIssues.length === 0,
        seo: {
          score: seoScore.percentage,
          threshold: SEO_THRESHOLD,
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

      if (!validationResult.canPublish && !bypassWarnings) {
        return res.status(422).json({
          ...validationResult,
          action: 'confirm_required',
          message: 'Content does not meet publishing requirements. Set bypassWarnings=true to publish anyway.',
        });
      }

      res.json({
        ...validationResult,
        action: validationResult.canPublish ? 'ready' : 'bypassed',
        message: validationResult.canPublish
          ? 'Content is ready to publish'
          : 'Publishing with warnings bypassed',
      });
    } catch (error) {
      console.error('[ImageRoutes] Error validating publish:', error);
      res.status(500).json({ error: 'Failed to validate content' });
    }
  });

  // -------------------------------------------------------------------------
  // POST /api/image-logic/generate-ai-image
  // -------------------------------------------------------------------------
  app.post('/api/image-logic/generate-ai-image', async (req: Request, res: Response) => {
    try {
      const { prompt, slotId, contentType, title, content, analysis, brief } = req.body;

      let aiPrompt: any;

      if (prompt && typeof prompt === 'object' && prompt.prompt) {
        aiPrompt = prompt;
      } else if (brief && analysis) {
        aiPrompt = generateAiImagePrompt(brief, analysis);
      } else if (slotId && contentType && title && content) {
        const contentAnalysis = analyzeContent(title, content, contentType);
        const briefs = generateImageBriefs(contentType, contentAnalysis);
        const matchingBrief = briefs.find(b => b.slotId === slotId);

        if (!matchingBrief) {
          return res.status(400).json({ error: `Invalid slotId: ${slotId}` });
        }

        aiPrompt = generateAiImagePrompt(matchingBrief, contentAnalysis);
      } else {
        return res.status(400).json({
          error: 'Provide either (prompt) or (brief + analysis) or (slotId + contentType + title + content)',
        });
      }

      const size: '1024x1024' | '1792x1024' | '1024x1792' =
        aiPrompt.aspectRatio === '16:9' ? '1792x1024' :
        aiPrompt.aspectRatio === '3:4' ? '1024x1792' :
        '1024x1024';

      const imageUrl = await generateImage(aiPrompt.prompt, {
        size,
        quality: 'hd',
        style: aiPrompt.style === 'cinematic' ? 'vivid' : 'natural',
      });

      if (!imageUrl) {
        return res.status(503).json({
          error: 'AI image generation failed',
          message: 'OpenAI API may not be configured or encountered an error',
        });
      }

      res.json({
        success: true,
        imageUrl,
        prompt: aiPrompt,
        size,
      });
    } catch (error) {
      console.error('[ImageRoutes] Error generating AI image:', error);
      res.status(500).json({ error: 'Failed to generate AI image' });
    }
  });

  // -------------------------------------------------------------------------
  // GET /api/image-logic/config
  // -------------------------------------------------------------------------
  app.get('/api/image-logic/config', async (req: Request, res: Response) => {
    try {
      res.json({
        seoThreshold: SEO_THRESHOLD,
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
      console.error('[ImageRoutes] Error fetching config:', error);
      res.status(500).json({ error: 'Failed to fetch config' });
    }
  });

  // -------------------------------------------------------------------------
  // POST /api/image-logic/download-to-library
  // -------------------------------------------------------------------------
  app.post('/api/image-logic/download-to-library', async (req: Request, res: Response) => {
    try {
      const { imageUrl, altText, title, caption, originalFilename, source, contentId, contentType, context } = req.body;

      if (!imageUrl) {
        return res.status(400).json({
          error: 'Missing required field: imageUrl',
        });
      }

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
          error: 'Image SEO validation failed',
          validation: seoResult.validation,
          generatedTags: seoResult.tags,
          message: 'SEO tags are required. Use the generated tags or provide valid ones.',
        });
      }

      const result = await downloadAndSaveImage(imageUrl, {
        source: source || 'external',
        slug: originalFilename,
      });

      if (!result.success) {
        return res.status(500).json({
          error: 'Failed to download image',
          message: result.error,
        });
      }

      const mediaFile = await storage.createMediaFile({
        filename: result.file!.filename,
        originalFilename: originalFilename || result.file!.filename,
        mimeType: 'image/webp',
        size: result.file!.size,
        url: result.file!.url,
        altText: seoResult.tags.alt,
        width: result.file!.width || null,
        height: result.file!.height || null,
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
      console.error('[ImageRoutes] Error downloading to library:', error);
      res.status(500).json({ error: 'Failed to download to media library' });
    }
  });

  // -------------------------------------------------------------------------
  // POST /api/image-logic/search-and-download
  // -------------------------------------------------------------------------
  app.post('/api/image-logic/search-and-download', async (req: Request, res: Response) => {
    try {
      const { query, autoDownload, downloadCount, altTextPrefix, contentId } = req.body;

      if (!query) {
        return res.status(400).json({
          error: 'Missing required field: query',
        });
      }

      const result = await searchAndDownloadFreepik(query, {
        autoDownload,
        downloadCount,
        altTextPrefix,
        contentId,
      });

      if (autoDownload && result.downloadedMedia.length > 0) {
        for (const download of result.downloadedMedia) {
          if (download.success && download.file) {
            await storage.createMediaFile({
              filename: download.file.filename,
              originalFilename: download.file.filename,
              mimeType: 'image/webp',
              size: download.file.size,
              url: download.file.url,
              altText: altTextPrefix || '',
              width: download.file.width || null,
              height: download.file.height || null,
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
      console.error('[ImageRoutes] Error in search-and-download:', error);
      res.status(500).json({ error: 'Failed to search and download' });
    }
  });

  // -------------------------------------------------------------------------
  // POST /api/image-seo/validate
  // -------------------------------------------------------------------------
  app.post('/api/image-seo/validate', async (req: Request, res: Response) => {
    try {
      const { image, images } = req.body;

      if (images && Array.isArray(images)) {
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
      console.error('[ImageRoutes] Validation error:', error);
      res.status(500).json({ error: 'Failed to validate image SEO' });
    }
  });

  // -------------------------------------------------------------------------
  // POST /api/image-seo/generate
  // -------------------------------------------------------------------------
  app.post('/api/image-seo/generate', async (req: Request, res: Response) => {
    try {
      const { url, context, contentType, location, existingAlt, existingTitle } = req.body;

      if (!url) {
        return res.status(400).json({ error: 'Missing required field: url' });
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
      console.error('[ImageRoutes] Generation error:', error);
      res.status(500).json({ error: 'Failed to generate SEO tags' });
    }
  });

  // -------------------------------------------------------------------------
  // POST /api/image-seo/enforce
  // -------------------------------------------------------------------------
  app.post('/api/image-seo/enforce', async (req: Request, res: Response) => {
    try {
      const { url, context, contentType, location, existingTags } = req.body;

      if (!url) {
        return res.status(400).json({ error: 'Missing required field: url' });
      }

      const result = await enforceImageSeo(
        { url, context, contentType, location },
        existingTags
      );

      if (!result.validation.isValid) {
        return res.status(422).json({
          error: 'Image SEO requirements not met',
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
      console.error('[ImageRoutes] Enforcement error:', error);
      res.status(500).json({ error: 'Failed to enforce image SEO' });
    }
  });

  // -------------------------------------------------------------------------
  // GET /api/image-seo/rules
  // -------------------------------------------------------------------------
  app.get('/api/image-seo/rules', async (req: Request, res: Response) => {
    try {
      res.json({
        rules: SEO_RULES,
        required: ['alt', 'altHe', 'title', 'caption', 'keywords', 'contentLocation', 'filename'],
        recommended: [],
        strict: true,
        tips: [
          'Alt text: 20-125 characters, describe what is shown (REQUIRED)',
          'Hebrew alt text: Required for multilingual SEO (REQUIRED)',
          'Title: "Place Name - Interesting Fact | TripMD" (REQUIRED)',
          'Caption: 30-200 characters with useful context (REQUIRED)',
          'Keywords: 3-10 relevant terms (REQUIRED)',
          'Location: Dubai area name + coordinates (REQUIRED)',
          'Filename: lowercase, hyphens only, no generic names (REQUIRED)',
        ],
        message: 'ALL fields are required. Images cannot be saved without complete SEO metadata.',
      });
    } catch (error) {
      console.error('[ImageRoutes] Error fetching rules:', error);
      res.status(500).json({ error: 'Failed to fetch SEO rules' });
    }
  });

  console.log('[ImageRoutes] Image routes registered successfully');
}

export default { registerImageRoutes };
