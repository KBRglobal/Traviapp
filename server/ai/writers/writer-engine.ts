/**
 * Writer Engine
 * 
 * Core engine for generating content using AI writer personalities
 */

import { getAIClient, getModelForProvider } from '../providers';
import type { ContentGenerationRequest, GeneratedContent, Writer } from './types';

export const writerEngine = {
  /**
   * Generate content using a specific writer's voice and style
   */
  async generateContent(request: ContentGenerationRequest & { writerId: string }): Promise<Omit<GeneratedContent, 'writerId' | 'writerName' | 'generatedByAI' | 'writerVoiceScore'>> {
    const aiClient = getAIClient();
    if (!aiClient) {
      throw new Error('AI service not configured');
    }

    const { client: openai, provider } = aiClient;
    
    // Get writer details from database
    const writer = await writerEngine.getWriterById(request.writerId);
    if (!writer) {
      throw new Error(`Writer not found: ${request.writerId}`);
    }

    // Use writer's voice prompt as system message
    const systemPrompt = writer.voicePrompt;

    // Generate content
    const response = await openai.chat.completions.create({
      model: provider === 'openai' ? 'gpt-4o' : getModelForProvider(provider),
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Write a ${request.contentType} about "${request.topic}".
${request.keywords ? `Target keywords: ${request.keywords.join(', ')}` : ''}

Please provide:
1. A compelling title
2. A meta description (under 160 characters)
3. SEO-optimized slug
4. Main content blocks with proper structure
5. FAQ items

Format the response as JSON with the following structure:
{
  "title": "...",
  "slug": "...",
  "metaTitle": "...",
  "metaDescription": "...",
  "blocks": [
    { "type": "hero", "data": { "title": "...", "subtitle": "..." } },
    { "type": "text", "data": { "heading": "...", "content": "..." } },
    ...
  ]
}`
        }
      ],
      response_format: { type: 'json_object' }
    });

    const content = JSON.parse(response.choices[0].message.content || '{}');
    return content;
  },

  /**
   * Get writer by ID (stub - will query database)
   */
  async getWriterById(writerId: string): Promise<Writer | null> {
    // TODO: Query database for writer
    // For now, only return a writer if it matches our default
    if (writerId === 'default-writer') {
      return {
        id: writerId,
        name: 'Default Writer',
        expertise: 'general',
        personality: 'Professional and informative',
        writingStyle: 'Clear, engaging, SEO-optimized',
        voicePrompt: 'You are a professional Dubai travel writer. Write engaging, SEO-optimized content that helps travelers plan their visit.',
        isActive: true,
        totalArticles: 0,
        avgVoiceScore: 0
      };
    }
    
    // Return null for non-existent writers
    return null;
  }
};
