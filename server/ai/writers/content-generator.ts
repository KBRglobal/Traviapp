/**
 * AI Writers Content Generator
 * 
 * This is the PRIMARY content generation system.
 * It REPLACES the legacy DEFAULT_CONTENT_RULES system.
 * 
 * Features:
 * - Auto-assigns optimal writer based on content type and topic
 * - Uses writer-specific prompts and personalities
 * - Validates voice consistency
 * - Returns content with writer attribution and voice score
 */

import { writerEngine } from './writer-engine';
import { assignmentSystem } from './assignment-system';
import { voiceValidator } from './voice-validator';
import { getWriterById } from './writer-registry';
import type { ContentType } from '@shared/schema';

export interface ContentGenerationRequest {
  writerId?: string; // Optional - auto-assigns if not provided
  contentType: ContentType;
  topic: string;
  keywords?: string[];
  locale?: string;
  length?: 'short' | 'medium' | 'long';
  tone?: string;
  targetAudience?: string[];
  additionalContext?: string;
}

export interface ContentGenerationResult {
  title: string;
  body: string;
  intro?: string;
  sections?: Array<{ heading: string; content: string }>;
  metaDescription?: string;
  keywords?: string[];
  writerId: string;
  writerName: string;
  generatedByAI: boolean;
  writerVoiceScore: number;
  confidence: number;
}

/**
 * Main content generation function using AI Writers system
 */
export async function generate(
  request: ContentGenerationRequest
): Promise<ContentGenerationResult> {
  // 1. Get or assign the best writer for this content
  let writer;
  if (request.writerId) {
    writer = getWriterById(request.writerId);
    if (!writer) {
      throw new Error(`Writer not found: ${request.writerId}`);
    }
  } else {
    // Auto-assign optimal writer
    const assignment = await assignmentSystem.assignWriter(
      request.contentType,
      request.topic,
      request.keywords
    );
    writer = assignment.writer;
  }

  // 2. Generate content using writer's voice (NOT legacy rules!)
  const generatedContent = await writerEngine.generateContent({
    writerId: writer.id,
    contentType: request.contentType,
    topic: request.topic,
    keywords: request.keywords || [],
    locale: request.locale || 'en',
    length: request.length || 'medium',
    tone: request.tone,
    targetAudience: request.targetAudience,
    additionalContext: request.additionalContext
  });

  // 3. Validate voice consistency
  const voiceScore = await voiceValidator.getScore(
    writer.id,
    generatedContent.body || generatedContent.content || ''
  );

  // 4. Return with writer metadata
  return {
    ...generatedContent,
    writerId: writer.id,
    writerName: writer.name,
    generatedByAI: true,
    writerVoiceScore: voiceScore,
    confidence: 0.85 // Base confidence, can be adjusted based on various factors
  };
}

/**
 * Generate multiple title options with specific writer
 */
export async function generateTitles(
  writerId: string,
  topic: string,
  count: number = 5
): Promise<string[]> {
  const writer = getWriterById(writerId);
  if (!writer) {
    throw new Error(`Writer not found: ${writerId}`);
  }

  return writerEngine.generateTitles({
    writerId: writer.id,
    topic,
    count
  });
}

/**
 * Generate intro paragraph with specific writer
 */
export async function generateIntro(
  writerId: string,
  topic: string,
  context?: string
): Promise<string> {
  const writer = getWriterById(writerId);
  if (!writer) {
    throw new Error(`Writer not found: ${writerId}`);
  }

  return writerEngine.generateIntro({
    writerId: writer.id,
    topic,
    context
  });
}

/**
 * Rewrite existing content in writer's voice
 */
export async function rewriteInVoice(
  writerId: string,
  content: string
): Promise<string> {
  const writer = getWriterById(writerId);
  if (!writer) {
    throw new Error(`Writer not found: ${writerId}`);
  }

  return writerEngine.rewriteInVoice({
    writerId: writer.id,
    content
  });
}

/**
 * Check if legacy system should be used (DEPRECATED)
 * Always returns false - new system should always be used
 */
export function shouldUseLegacy(): boolean {
  return false; // Always use new AI Writers system!
}

/**
 * Get recommended writer for content type and topic
 */
export async function recommendWriter(
  contentType: ContentType,
  topic: string,
  keywords?: string[]
) {
  return assignmentSystem.assignWriter(contentType, topic, keywords);
}

// Export main functions
export const aiWritersContentGenerator = {
  generate,
  generateTitles,
  generateIntro,
  rewriteInVoice,
  shouldUseLegacy,
  recommendWriter
};

// Default export
export default aiWritersContentGenerator;
