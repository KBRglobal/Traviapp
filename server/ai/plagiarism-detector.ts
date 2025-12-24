/**
 * AI Plagiarism Detector
 * 
 * Checks content originality using AI embeddings and similarity analysis
 * Compares against existing content in the database
 * Flags potential duplicates with similarity percentage
 */

import OpenAI from 'openai';
import { db } from '../db';
import { contents } from '@shared/schema';
import { eq, ne, sql } from 'drizzle-orm';

// ============================================================================
// TYPES
// ============================================================================

export interface PlagiarismResult {
  isOriginal: boolean;
  similarityPercentage: number;
  duplicates: PlagiarismDuplicate[];
  message: string;
}

export interface PlagiarismDuplicate {
  contentId: string;
  title: string;
  slug: string;
  similarityScore: number; // 0-100
  matchedSegments?: string[];
}

// ============================================================================
// AI CLIENT
// ============================================================================

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('[Plagiarism Detector] OpenAI API key not configured');
    return null;
  }
  return new OpenAI({ apiKey });
}

// ============================================================================
// EMBEDDING GENERATION
// ============================================================================

/**
 * Generate embeddings for text using OpenAI
 */
async function generateEmbedding(text: string): Promise<number[] | null> {
  const client = getOpenAIClient();
  if (!client) return null;

  try {
    const response = await client.embeddings.create({
      model: 'text-embedding-3-small',
      input: text.substring(0, 8000), // Limit to 8k chars
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error('[Plagiarism Detector] Error generating embedding:', error);
    return null;
  }
}

/**
 * Calculate cosine similarity between two embedding vectors
 */
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magnitudeA += vecA[i] * vecA[i];
    magnitudeB += vecB[i] * vecB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) return 0;

  return dotProduct / (magnitudeA * magnitudeB);
}

// ============================================================================
// PLAGIARISM DETECTION
// ============================================================================

/**
 * Check content for plagiarism by comparing with existing content
 */
export async function checkPlagiarism(
  contentText: string,
  title: string,
  excludeContentId?: string
): Promise<PlagiarismResult> {
  const client = getOpenAIClient();

  if (!client) {
    return {
      isOriginal: true,
      similarityPercentage: 0,
      duplicates: [],
      message: 'Plagiarism detection unavailable (OpenAI API key not configured)',
    };
  }

  try {
    // Generate embedding for the new content
    const newEmbedding = await generateEmbedding(contentText);
    if (!newEmbedding) {
      return {
        isOriginal: true,
        similarityPercentage: 0,
        duplicates: [],
        message: 'Failed to generate embedding',
      };
    }

    // Get all published content for comparison
    const allContent = await db
      .select({
        id: contents.id,
        title: contents.title,
        slug: contents.slug,
        blocks: contents.blocks,
      })
      .from(contents)
      .where(
        excludeContentId
          ? ne(contents.id, excludeContentId)
          : sql`true`
      )
      .limit(100); // Limit for performance

    // Compare with existing content
    const duplicates: PlagiarismDuplicate[] = [];

    for (const existingContent of allContent) {
      const existingText = extractTextFromBlocks(existingContent.blocks || []);
      if (existingText.length < 100) continue; // Skip very short content

      const existingEmbedding = await generateEmbedding(existingText);
      if (!existingEmbedding) continue;

      const similarity = cosineSimilarity(newEmbedding, existingEmbedding);
      const similarityPercentage = Math.round(similarity * 100);

      // Flag content with >70% similarity as potential duplicate
      if (similarityPercentage > 70) {
        duplicates.push({
          contentId: existingContent.id,
          title: existingContent.title,
          slug: existingContent.slug,
          similarityScore: similarityPercentage,
        });
      }
    }

    // Sort by similarity score
    duplicates.sort((a, b) => b.similarityScore - a.similarityScore);

    const highestSimilarity = duplicates.length > 0 ? duplicates[0].similarityScore : 0;
    const isOriginal = highestSimilarity < 70;

    return {
      isOriginal,
      similarityPercentage: highestSimilarity,
      duplicates: duplicates.slice(0, 5), // Return top 5 matches
      message: isOriginal
        ? 'Content appears to be original'
        : `Content has ${highestSimilarity}% similarity with existing content`,
    };
  } catch (error) {
    console.error('[Plagiarism Detector] Error checking plagiarism:', error);
    return {
      isOriginal: true,
      similarityPercentage: 0,
      duplicates: [],
      message: 'Error checking plagiarism',
    };
  }
}

/**
 * Check plagiarism for existing content by ID
 */
export async function checkContentPlagiarism(
  contentId: string
): Promise<PlagiarismResult | null> {
  try {
    const [content] = await db
      .select()
      .from(contents)
      .where(eq(contents.id, contentId))
      .limit(1);

    if (!content) {
      console.error('[Plagiarism Detector] Content not found:', contentId);
      return null;
    }

    const contentText = extractTextFromBlocks(content.blocks || []);
    return await checkPlagiarism(contentText, content.title, contentId);
  } catch (error) {
    console.error('[Plagiarism Detector] Error checking content plagiarism:', error);
    return null;
  }
}

/**
 * Simple text-based similarity check (fast, but less accurate)
 */
export async function checkTextSimilarity(
  text1: string,
  text2: string
): Promise<number> {
  // Convert to lowercase and remove punctuation
  const normalize = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

  const norm1 = normalize(text1);
  const norm2 = normalize(text2);

  // Split into words
  const words1 = new Set(norm1.split(' '));
  const words2 = new Set(norm2.split(' '));

  // Calculate Jaccard similarity
  const intersection = new Set([...words1].filter((x) => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return (intersection.size / union.size) * 100;
}

/**
 * Find similar phrases between two texts
 */
export function findSimilarPhrases(
  text1: string,
  text2: string,
  minPhraseLength: number = 5
): string[] {
  const similarPhrases: string[] = [];

  // Split into sentences
  const sentences1 = text1.match(/[^.!?\r\n]{1,1000}[.!?]+/g) || [];
  const sentences2 = text2.match(/[^.!?\r\n]{1,1000}[.!?]+/g) || [];

  for (const sent1 of sentences1) {
    for (const sent2 of sentences2) {
      const words1 = sent1.trim().toLowerCase().split(/\s+/);
      const words2 = sent2.trim().toLowerCase().split(/\s+/);

      // Find longest common subsequence
      const lcs = longestCommonSubsequence(words1, words2);

      if (lcs.length >= minPhraseLength) {
        similarPhrases.push(lcs.join(' '));
      }
    }
  }

  return [...new Set(similarPhrases)]; // Remove duplicates
}

/**
 * Longest common subsequence algorithm
 */
function longestCommonSubsequence(arr1: string[], arr2: string[]): string[] {
  const m = arr1.length;
  const n = arr2.length;
  const dp: number[][] = Array(m + 1)
    .fill(0)
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (arr1[i - 1] === arr2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Reconstruct LCS
  const lcs: string[] = [];
  let i = m;
  let j = n;

  while (i > 0 && j > 0) {
    if (arr1[i - 1] === arr2[j - 1]) {
      lcs.unshift(arr1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  return lcs;
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
