/**
 * External Image Service
 * Handles integration with Freepik API and other external image sources
 */

import { downloadAndSaveImage, ImageDownloadResult } from './image-processing';

// ============================================================================
// TYPES
// ============================================================================

export interface ImageSearchBrief {
  slotId: string;
  role: 'hero' | 'interior' | 'experience' | 'practical' | 'usp' | 'food' | 'ambiance';
  primaryQuery: string;
  alternativeQueries: string[];
  mustInclude: string[];
  mustExclude: string[];
  style: {
    timeOfDay?: string;
    mood?: string;
    angle?: string;
  };
  areaRules?: {
    additionalKeywords: string[];
    styleOverrides: Record<string, string>;
  };
}

export interface FreepikSearchResult {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  downloadUrl?: string;
  relevanceScore: number;
  matchedCriteria: string[];
  rejectedReasons: string[];
}

export interface FreepikSearchResponse {
  results: FreepikSearchResult[];
  usedQuery: string;
  foundMatch: boolean;
  queryAttempts: string[];
}

// ============================================================================
// FREEPIK API INTEGRATION
// ============================================================================

/**
 * Search Freepik for images matching the brief
 */
export async function searchFreepik(
  brief: ImageSearchBrief,
  apiKey?: string
): Promise<FreepikSearchResponse> {
  const key = apiKey || process.env.FREEPIK_API_KEY;

  if (!key) {
    console.log('[ExternalImage] Freepik API key not configured');
    return {
      results: [],
      usedQuery: brief.primaryQuery,
      foundMatch: false,
      queryAttempts: [],
    };
  }

  const queryAttempts: string[] = [];
  const allResults: FreepikSearchResult[] = [];

  // Try primary query first, then alternatives
  const queriesToTry = [brief.primaryQuery, ...brief.alternativeQueries.slice(0, 2)];

  for (const query of queriesToTry) {
    queryAttempts.push(query);

    try {
      const params = new URLSearchParams({
        term: query,
        page: '1',
        limit: '10',
        order: 'relevance',
        filters: JSON.stringify({
          content_type: ['photo'],
          orientation: brief.style.angle === 'wide' ? ['landscape'] :
                      brief.style.angle === 'close-up' ? ['square'] : ['all'],
        }),
      });

      const response = await fetch(`https://api.freepik.com/v1/resources?${params}`, {
        headers: {
          'Accept': 'application/json',
          'x-freepik-api-key': key,
        },
      });

      if (!response.ok) {
        console.warn(`[ExternalImage] Freepik API error: ${response.status}`);
        continue;
      }

      const data = await response.json();
      const resources = data.data || [];

      // Score and filter results
      for (const resource of resources) {
        const matchedCriteria: string[] = [];
        const rejectedReasons: string[] = [];
        let relevanceScore = 50;

        const resourceText = `${resource.title} ${(resource.tags || []).join(' ')}`.toLowerCase();

        // Check must-include terms
        for (const mustInclude of brief.mustInclude) {
          if (resourceText.includes(mustInclude.toLowerCase())) {
            matchedCriteria.push(mustInclude);
            relevanceScore += 10;
          }
        }

        // Check must-exclude terms
        for (const mustExclude of brief.mustExclude) {
          if (resourceText.includes(mustExclude.toLowerCase())) {
            rejectedReasons.push(`Contains excluded term: ${mustExclude}`);
            relevanceScore -= 30;
          }
        }

        // Boost for Dubai-specific content
        if (resourceText.includes('dubai') || resourceText.includes('uae') || resourceText.includes('emirates')) {
          matchedCriteria.push('Dubai/UAE location');
          relevanceScore += 15;
        }

        if (relevanceScore >= 40 && rejectedReasons.length === 0) {
          allResults.push({
            id: resource.id?.toString() || '',
            title: resource.title || '',
            url: resource.url || resource.image?.source?.url || '',
            thumbnailUrl: resource.thumbnail?.url || resource.image?.thumbnail?.url || '',
            downloadUrl: resource.url || '',
            relevanceScore,
            matchedCriteria,
            rejectedReasons,
          });
        }
      }

      if (allResults.length >= 3) {
        break;
      }
    } catch (error) {
      console.error(`[ExternalImage] Freepik search error:`, error);
    }
  }

  allResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return {
    results: allResults.slice(0, 5),
    usedQuery: queryAttempts[0],
    foundMatch: allResults.length > 0,
    queryAttempts,
  };
}

/**
 * Search Freepik with a simple query string
 */
export async function searchFreepikSimple(
  query: string,
  options?: {
    limit?: number;
    orientation?: 'landscape' | 'portrait' | 'square' | 'all';
  }
): Promise<FreepikSearchResult[]> {
  const brief: ImageSearchBrief = {
    slotId: 'search',
    role: 'hero',
    primaryQuery: query,
    alternativeQueries: [],
    mustInclude: [],
    mustExclude: [],
    style: {
      angle: options?.orientation === 'landscape' ? 'wide' : undefined,
    },
  };

  const result = await searchFreepik(brief);
  return result.results.slice(0, options?.limit || 10);
}

/**
 * Search Freepik and optionally auto-download to Media Library
 */
export async function searchAndDownloadFreepik(
  query: string,
  options?: {
    autoDownload?: boolean;
    downloadCount?: number;
    altTextPrefix?: string;
    contentId?: string;
  }
): Promise<{
  searchResults: FreepikSearchResult[];
  downloadedMedia: ImageDownloadResult[];
}> {
  const results = await searchFreepikSimple(query);
  const downloadedMedia: ImageDownloadResult[] = [];

  if (options?.autoDownload && results.length > 0) {
    const downloadCount = options.downloadCount || 1;
    const toDownload = results.slice(0, downloadCount);

    for (const result of toDownload) {
      const downloaded = await downloadAndSaveImage(result.url, {
        source: 'freepik',
        slug: result.title,
      });
      downloadedMedia.push(downloaded);
    }
  }

  return {
    searchResults: results,
    downloadedMedia,
  };
}

// ============================================================================
// AI IMAGE GENERATION
// ============================================================================

export interface AiImagePrompt {
  prompt: string;
  negativePrompt: string;
  style: string;
  aspectRatio: '16:9' | '4:3' | '1:1' | '3:4';
}

/**
 * Generate AI image using DALL-E
 */
export async function generateAiImage(
  prompt: AiImagePrompt
): Promise<{ url: string } | null> {
  try {
    const { generateImage } = await import('../ai-generator');

    const size: '1024x1024' | '1792x1024' | '1024x1792' =
      prompt.aspectRatio === '16:9' ? '1792x1024' :
      prompt.aspectRatio === '3:4' ? '1024x1792' :
      '1024x1024';

    const imageUrl = await generateImage(prompt.prompt, {
      size,
      quality: 'hd',
      style: prompt.style === 'cinematic' ? 'vivid' : 'natural',
    });

    if (!imageUrl) return null;

    return { url: imageUrl };
  } catch (error) {
    console.error('[ExternalImage] AI generation failed:', error);
    return null;
  }
}

export default {
  searchFreepik,
  searchFreepikSimple,
  searchAndDownloadFreepik,
  generateAiImage,
};
