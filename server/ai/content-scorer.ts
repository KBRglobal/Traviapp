/**
 * AI Content Scorer
 * 
 * Analyzes content quality using OpenAI and provides scores across multiple dimensions:
 * - Readability
 * - SEO
 * - Engagement
 * - Originality
 * - Structure
 * 
 * Returns an overall score (0-100) and actionable suggestions
 */

import OpenAI from 'openai';
import { db } from '../db';
import { contentScores, contents } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

// ============================================================================
// TYPES
// ============================================================================

export interface ContentScoreResult {
  overallScore: number; // 0-100
  readabilityScore: number; // 0-100
  seoScore: number; // 0-100
  engagementScore: number; // 0-100
  originalityScore: number; // 0-100
  structureScore: number; // 0-100
  suggestions: string[];
  analysis: {
    readability?: string;
    seo?: string;
    engagement?: string;
    originality?: string;
    structure?: string;
  };
}

// Zod schema for AI response validation
const ContentScoreSchema = z.object({
  overallScore: z.number().min(0).max(100),
  readabilityScore: z.number().min(0).max(100),
  seoScore: z.number().min(0).max(100),
  engagementScore: z.number().min(0).max(100),
  originalityScore: z.number().min(0).max(100),
  structureScore: z.number().min(0).max(100),
  suggestions: z.array(z.string()),
  analysis: z.object({
    readability: z.string().optional(),
    seo: z.string().optional(),
    engagement: z.string().optional(),
    originality: z.string().optional(),
    structure: z.string().optional(),
  }),
});

// ============================================================================
// AI CLIENT
// ============================================================================

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('[Content Scorer] OpenAI API key not configured');
    return null;
  }
  return new OpenAI({ apiKey });
}

// ============================================================================
// CONTENT ANALYSIS
// ============================================================================

/**
 * Analyze content quality using AI
 */
export async function scoreContent(
  contentText: string,
  title: string,
  metaDescription?: string
): Promise<ContentScoreResult> {
  const client = getOpenAIClient();

  if (!client) {
    // Return default scores if AI not available
    return {
      overallScore: 50,
      readabilityScore: 50,
      seoScore: 50,
      engagementScore: 50,
      originalityScore: 50,
      structureScore: 50,
      suggestions: ['Configure OpenAI API key to enable AI content scoring'],
      analysis: {},
    };
  }

  try {
    const prompt = buildScoringPrompt(contentText, title, metaDescription);

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert content analyst specializing in SEO, readability, and engagement. Analyze the provided content and return a JSON response with scores and suggestions.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const result = response.choices[0]?.message?.content;
    if (!result) {
      throw new Error('No response from AI');
    }

    // Parse and validate response
    const parsed = JSON.parse(result);
    const validated = ContentScoreSchema.parse(parsed);

    return validated;
  } catch (error) {
    console.error('[Content Scorer] Error scoring content:', error);
    return {
      overallScore: 50,
      readabilityScore: 50,
      seoScore: 50,
      engagementScore: 50,
      originalityScore: 50,
      structureScore: 50,
      suggestions: ['Error analyzing content. Please try again.'],
      analysis: {},
    };
  }
}

/**
 * Build the scoring prompt for AI
 */
function buildScoringPrompt(
  contentText: string,
  title: string,
  metaDescription?: string
): string {
  return `
Analyze the following content and provide detailed scoring across 5 dimensions:

**Title:** ${title}
**Meta Description:** ${metaDescription || 'Not provided'}

**Content:**
${contentText.substring(0, 3000)} ${contentText.length > 3000 ? '...[truncated]' : ''}

Provide scores (0-100) for each category:

1. **Readability Score** (0-100): Assess sentence structure, word choice, paragraph length, and overall ease of reading. Consider:
   - Average sentence length
   - Vocabulary complexity
   - Paragraph structure
   - Use of headings and formatting

2. **SEO Score** (0-100): Evaluate search engine optimization factors:
   - Keyword usage and density
   - Meta description quality
   - Heading structure (H1, H2, H3)
   - Internal linking opportunities
   - Content length
   - Title optimization

3. **Engagement Score** (0-100): Rate how engaging and compelling the content is:
   - Hook quality
   - Storytelling elements
   - Call-to-actions
   - Value proposition
   - Emotional appeal

4. **Originality Score** (0-100): Assess uniqueness and freshness:
   - Unique perspectives or insights
   - Creative angles
   - Fresh information
   - Avoid clichés and generic content

5. **Structure Score** (0-100): Evaluate content organization:
   - Logical flow
   - Clear sections
   - Proper formatting
   - Scannable layout
   - Good use of lists, headings, and whitespace

Also provide:
- **Overall Score**: Weighted average of all scores
- **Suggestions**: Array of 5-8 actionable recommendations to improve the content
- **Analysis**: Brief explanation for each score category

Return your response as JSON matching this structure:
{
  "overallScore": number,
  "readabilityScore": number,
  "seoScore": number,
  "engagementScore": number,
  "originalityScore": number,
  "structureScore": number,
  "suggestions": ["suggestion1", "suggestion2", ...],
  "analysis": {
    "readability": "brief explanation",
    "seo": "brief explanation",
    "engagement": "brief explanation",
    "originality": "brief explanation",
    "structure": "brief explanation"
  }
}
`;
}

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

/**
 * Score content and save results to database
 */
export async function scoreAndSaveContent(
  contentId: string,
  scoredBy?: string
): Promise<ContentScoreResult | null> {
  try {
    // Get content from database
    const [content] = await db
      .select()
      .from(contents)
      .where(eq(contents.id, contentId))
      .limit(1);

    if (!content) {
      console.error('[Content Scorer] Content not found:', contentId);
      return null;
    }

    // Extract text from blocks
    const contentText = extractTextFromBlocks(content.blocks || []);

    // Score the content
    const score = await scoreContent(
      contentText,
      content.title,
      content.metaDescription || undefined
    );

    // Save to database
    await db.insert(contentScores).values({
      contentId,
      overallScore: score.overallScore,
      readabilityScore: score.readabilityScore,
      seoScore: score.seoScore,
      engagementScore: score.engagementScore,
      originalityScore: score.originalityScore,
      structureScore: score.structureScore,
      suggestions: score.suggestions,
      analysis: score.analysis,
      scoredBy,
    });

    // Update content SEO score
    await db
      .update(contents)
      .set({ seoScore: score.seoScore })
      .where(eq(contents.id, contentId));

    return score;
  } catch (error) {
    console.error('[Content Scorer] Error scoring and saving:', error);
    return null;
  }
}

/**
 * Get latest score for content
 */
export async function getLatestScore(contentId: string) {
  const [score] = await db
    .select()
    .from(contentScores)
    .where(eq(contentScores.contentId, contentId))
    .orderBy(contentScores.createdAt)
    .limit(1);

  return score || null;
}

/**
 * Get all scores for content (history)
 */
export async function getScoreHistory(contentId: string) {
  return await db
    .select()
    .from(contentScores)
    .where(eq(contentScores.contentId, contentId))
    .orderBy(contentScores.createdAt);
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Extract text content from content blocks
 */
function extractTextFromBlocks(blocks: any[]): string {
  if (!Array.isArray(blocks)) return '';

  let text = '';

  for (const block of blocks) {
    if (!block || typeof block !== 'object') continue;

    switch (block.type) {
      case 'text':
        text += (block.data?.content || '') + '\n\n';
        break;
      case 'hero':
        text += (block.data?.title || '') + '\n';
        text += (block.data?.subtitle || '') + '\n\n';
        break;
      case 'highlights':
        text += (block.data?.content || '') + '\n\n';
        break;
      case 'tips':
        text += (block.data?.content || '') + '\n\n';
        break;
      case 'faq':
        text += (block.data?.question || '') + '\n';
        text += (block.data?.answer || '') + '\n\n';
        break;
      case 'cta':
        text += (block.data?.title || '') + '\n';
        text += (block.data?.content || '') + '\n\n';
        break;
      case 'quote':
        text += (block.data?.text || '') + '\n\n';
        break;
    }
  }

  return text.trim();
}

/**
 * Calculate word count from text
 */
export function calculateWordCount(text: string): number {
  return text.split(/\s+/).filter((word) => word.length > 0).length;
}
