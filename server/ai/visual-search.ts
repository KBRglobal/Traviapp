/**
 * AI Visual Search
 * 
 * Upload an image and find similar content using OpenAI Vision API
 * Analyzes images and matches them with existing content
 * Uses image descriptions for semantic search
 */

import OpenAI from 'openai';
import { db } from '../db';
import { contents, mediaFiles } from '@shared/schema';
import { like, or, sql } from 'drizzle-orm';

// ============================================================================
// TYPES
// ============================================================================

export interface VisualSearchResult {
  success: boolean;
  message: string;
  imageDescription?: string;
  matchedContent: MatchedContent[];
  keywords: string[];
}

export interface MatchedContent {
  id: string;
  type: string;
  title: string;
  slug: string;
  heroImage?: string;
  matchScore: number; // 0-100
  matchReason: string;
}

export interface ImageAnalysis {
  description: string;
  keywords: string[];
  categories: string[];
  mood: string;
  colors: string[];
}

// ============================================================================
// AI CLIENT
// ============================================================================

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('[Visual Search] OpenAI API key not configured');
    return null;
  }
  return new OpenAI({ apiKey });
}

// ============================================================================
// IMAGE ANALYSIS
// ============================================================================

/**
 * Analyze an image using OpenAI Vision API
 */
export async function analyzeImage(imageUrl: string): Promise<ImageAnalysis | null> {
  const client = getOpenAIClient();
  if (!client) return null;

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert image analyst. Analyze images and provide detailed descriptions, keywords, categories, mood, and dominant colors. Return response as JSON.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this image and provide:
1. A detailed description (2-3 sentences)
2. 5-10 relevant keywords
3. 2-3 categories (e.g., architecture, nature, people, food, transportation, landmarks)
4. Overall mood (e.g., vibrant, serene, bustling, luxurious)
5. 3-5 dominant colors

Return as JSON:
{
  "description": "...",
  "keywords": ["keyword1", "keyword2", ...],
  "categories": ["category1", "category2"],
  "mood": "...",
  "colors": ["color1", "color2", ...]
}`,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 500,
    });

    const result = response.choices[0]?.message?.content;
    if (!result) return null;

    const analysis = JSON.parse(result);
    return {
      description: analysis.description || '',
      keywords: analysis.keywords || [],
      categories: analysis.categories || [],
      mood: analysis.mood || '',
      colors: analysis.colors || [],
    };
  } catch (error) {
    console.error('[Visual Search] Error analyzing image:', error);
    return null;
  }
}

/**
 * Analyze image from base64 data
 */
export async function analyzeImageBase64(base64Data: string): Promise<ImageAnalysis | null> {
  const client = getOpenAIClient();
  if (!client) return null;

  try {
    // Ensure proper base64 format
    let imageData = base64Data;
    if (!imageData.startsWith('data:image')) {
      imageData = `data:image/jpeg;base64,${base64Data}`;
    }

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert image analyst. Analyze images and provide detailed descriptions, keywords, categories, mood, and dominant colors. Return response as JSON.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this image and provide:
1. A detailed description (2-3 sentences)
2. 5-10 relevant keywords
3. 2-3 categories (e.g., architecture, nature, people, food, transportation, landmarks)
4. Overall mood (e.g., vibrant, serene, bustling, luxurious)
5. 3-5 dominant colors

Return as JSON:
{
  "description": "...",
  "keywords": ["keyword1", "keyword2", ...],
  "categories": ["category1", "category2"],
  "mood": "...",
  "colors": ["color1", "color2", ...]
}`,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageData,
              },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 500,
    });

    const result = response.choices[0]?.message?.content;
    if (!result) return null;

    const analysis = JSON.parse(result);
    return {
      description: analysis.description || '',
      keywords: analysis.keywords || [],
      categories: analysis.categories || [],
      mood: analysis.mood || '',
      colors: analysis.colors || [],
    };
  } catch (error) {
    console.error('[Visual Search] Error analyzing base64 image:', error);
    return null;
  }
}

// ============================================================================
// VISUAL SEARCH
// ============================================================================

/**
 * Search for content matching an image
 */
export async function searchByImage(imageUrl: string): Promise<VisualSearchResult> {
  const client = getOpenAIClient();

  if (!client) {
    return {
      success: false,
      message: 'Visual search unavailable (OpenAI API key not configured)',
      matchedContent: [],
      keywords: [],
    };
  }

  try {
    // Analyze the image
    const analysis = await analyzeImage(imageUrl);
    if (!analysis) {
      return {
        success: false,
        message: 'Failed to analyze image',
        matchedContent: [],
        keywords: [],
      };
    }

    // Build search query from analysis
    const searchTerms = [
      ...analysis.keywords,
      ...analysis.categories,
      analysis.mood,
    ].filter(Boolean);

    // Search for matching content
    const matchedContent = await findMatchingContent(searchTerms, analysis);

    return {
      success: true,
      message: `Found ${matchedContent.length} matching content items`,
      imageDescription: analysis.description,
      matchedContent,
      keywords: analysis.keywords,
    };
  } catch (error) {
    console.error('[Visual Search] Error in visual search:', error);
    return {
      success: false,
      message: 'Error performing visual search',
      matchedContent: [],
      keywords: [],
    };
  }
}

/**
 * Search by uploaded image (base64)
 */
export async function searchByImageBase64(base64Data: string): Promise<VisualSearchResult> {
  const client = getOpenAIClient();

  if (!client) {
    return {
      success: false,
      message: 'Visual search unavailable (OpenAI API key not configured)',
      matchedContent: [],
      keywords: [],
    };
  }

  try {
    // Analyze the image
    const analysis = await analyzeImageBase64(base64Data);
    if (!analysis) {
      return {
        success: false,
        message: 'Failed to analyze image',
        matchedContent: [],
        keywords: [],
      };
    }

    // Build search query from analysis
    const searchTerms = [
      ...analysis.keywords,
      ...analysis.categories,
      analysis.mood,
    ].filter(Boolean);

    // Search for matching content
    const matchedContent = await findMatchingContent(searchTerms, analysis);

    return {
      success: true,
      message: `Found ${matchedContent.length} matching content items`,
      imageDescription: analysis.description,
      matchedContent,
      keywords: analysis.keywords,
    };
  } catch (error) {
    console.error('[Visual Search] Error in visual search:', error);
    return {
      success: false,
      message: 'Error performing visual search',
      matchedContent: [],
      keywords: [],
    };
  }
}

/**
 * Find content matching search terms from image analysis
 */
async function findMatchingContent(
  searchTerms: string[],
  analysis: ImageAnalysis
): Promise<MatchedContent[]> {
  try {
    // Build search conditions
    const searchConditions = searchTerms.flatMap((term) => [
      like(contents.title, `%${term}%`),
      like(contents.metaDescription, `%${term}%`),
      like(contents.primaryKeyword, `%${term}%`),
    ]);

    if (searchConditions.length === 0) {
      return [];
    }

    // Search content
    const results = await db
      .select({
        id: contents.id,
        type: contents.type,
        title: contents.title,
        slug: contents.slug,
        heroImage: contents.heroImage,
        metaDescription: contents.metaDescription,
        primaryKeyword: contents.primaryKeyword,
        secondaryKeywords: contents.secondaryKeywords,
      })
      .from(contents)
      .where(or(...searchConditions))
      .limit(20);

    // Score and sort results
    const matchedContent: MatchedContent[] = results.map((result) => {
      const score = calculateMatchScore(result, searchTerms, analysis);
      const reason = getMatchReason(result, searchTerms);

      return {
        id: result.id,
        type: result.type,
        title: result.title,
        slug: result.slug,
        heroImage: result.heroImage || undefined,
        matchScore: score,
        matchReason: reason,
      };
    });

    // Sort by match score
    matchedContent.sort((a, b) => b.matchScore - a.matchScore);

    return matchedContent.slice(0, 10); // Return top 10 matches
  } catch (error) {
    console.error('[Visual Search] Error finding matching content:', error);
    return [];
  }
}

/**
 * Calculate match score for content
 */
function calculateMatchScore(
  content: any,
  searchTerms: string[],
  analysis: ImageAnalysis
): number {
  let score = 0;

  const contentText = [
    content.title,
    content.metaDescription,
    content.primaryKeyword,
    ...(content.secondaryKeywords || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  // Count keyword matches
  for (const term of searchTerms) {
    if (contentText.includes(term.toLowerCase())) {
      score += 10;
    }
  }

  // Bonus for category matches
  for (const category of analysis.categories) {
    if (contentText.includes(category.toLowerCase())) {
      score += 15;
    }
  }

  // Bonus for having a hero image
  if (content.heroImage) {
    score += 5;
  }

  return Math.min(score, 100);
}

/**
 * Get match reason description
 */
function getMatchReason(content: any, searchTerms: string[]): string {
  const matches: string[] = [];

  const contentText = [
    content.title,
    content.metaDescription,
    content.primaryKeyword,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  for (const term of searchTerms.slice(0, 3)) {
    if (contentText.includes(term.toLowerCase())) {
      matches.push(term);
    }
  }

  if (matches.length === 0) {
    return 'Related content';
  }

  return `Matches: ${matches.join(', ')}`;
}
