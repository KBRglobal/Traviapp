/**
 * AI Writers Content Generator
 * 
 * This is the PRIMARY content generation system.
 * It REPLACES the legacy DEFAULT_CONTENT_RULES system.
 */

import { writerEngine } from './writer-engine';
import { assignmentSystem } from './assignment-system';
import { voiceValidator } from './voice-validator';
import type { ContentGenerationRequest, GeneratedContent } from './types';

async function getWriter(writerId: string) {
  return writerEngine.getWriterById(writerId);
}

export const aiWritersContentGenerator = {
  /**
   * Generate content using AI Writers system
   * This is the main entry point - replaces legacy generator
   */
  async generate(request: ContentGenerationRequest): Promise<GeneratedContent> {
    // 1. Get or assign the best writer for this content
    const writer = request.writerId 
      ? await getWriter(request.writerId)
      : await assignmentSystem.getOptimalWriter(request.contentType, request.topic);
    
    if (!writer) {
      throw new Error('No suitable writer found');
    }
    
    // 2. Generate content using writer's voice (NOT legacy rules!)
    const content = await writerEngine.generateContent({
      writerId: writer.id,
      ...request
    });
    
    // 3. Validate voice consistency
    const contentText = JSON.stringify(content.blocks || []);
    const voiceScore = await voiceValidator.getVoiceScore(writer.id, contentText);
    
    // 4. Return with writer metadata
    return {
      ...content,
      writerId: writer.id,
      writerName: writer.name,
      generatedByAI: true,
      writerVoiceScore: voiceScore,
    };
  },

  /**
   * Check if legacy system should be used (DEPRECATED)
   */
  shouldUseLegacy(): boolean {
    return false; // Always use new system!
  }
};
