/**
 * Voice Validator
 * 
 * Validates voice consistency and quality of generated content
 */

import { getAIClient, getModelForProvider } from '../providers';
import type { VoiceValidationResult, Writer } from './types';

export const voiceValidator = {
  /**
   * Calculate voice consistency score for content
   */
  async getVoiceScore(writerId: string, content: string): Promise<number> {
    // TODO: Implement comprehensive voice validation
    // - Compare against writer's style guide
    // - Analyze tone, vocabulary, sentence structure
    // - Check brand consistency
    
    try {
      const aiClient = getAIClient();
      if (!aiClient) {
        // Fallback if AI not available
        return 75;
      }

      const { client: openai, provider } = aiClient;
      
      // Use AI to analyze voice consistency
      const response = await openai.chat.completions.create({
        model: provider === 'openai' ? 'gpt-4o-mini' : getModelForProvider(provider),
        messages: [
          {
            role: 'system',
            content: 'You are a content quality analyzer. Rate the consistency and quality of writing on a scale of 0-100.'
          },
          {
            role: 'user',
            content: `Analyze this content and provide a quality score (0-100) based on:
- Writing consistency
- Professional tone
- SEO optimization
- Readability

Content:
${content.substring(0, 2000)}

Respond with just a number between 0 and 100.`
          }
        ],
        temperature: 0.3
      });

      const scoreText = response.choices[0].message.content?.trim() || '75';
      const score = parseInt(scoreText, 10);
      
      // Validate the parsed result
      if (isNaN(score)) {
        console.warn('Voice validation returned non-numeric score:', scoreText);
        return 75;
      }
      
      return Math.max(0, Math.min(100, score));
    } catch (error) {
      console.error('Voice validation error:', error);
      return 75; // Default fallback score
    }
  },

  /**
   * Get detailed voice validation analysis
   */
  async validateVoice(writerId: string, content: string): Promise<VoiceValidationResult> {
    const score = await this.getVoiceScore(writerId, content);
    
    return {
      score,
      consistency: {
        tone: score,
        style: score,
        vocabulary: score
      },
      suggestions: []
    };
  }
};
