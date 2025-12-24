/**
 * AI Writer Engine
 * 
 * Generates content using the selected writer's voice and style
 */

import { getAIClient } from "../providers";
import type { AIWriter } from "./writer-registry";
import { getWriterById } from "./writer-registry";
import {
  getWriterSystemPrompt,
  getContentGenerationPrompt,
  getTitleGenerationPrompt,
  getIntroGenerationPrompt,
  getRewritePrompt,
  getVoiceValidationPrompt,
  getSeoOptimizationPrompt,
  type WriteContentRequest,
} from "./prompts";

export interface WriteContentResponse {
  content: {
    title: string;
    metaDescription: string;
    intro: string;
    body: string;
    conclusion: string;
  };
  writer: AIWriter;
  metadata: {
    wordCount: number;
    readingTime: number;
    seoScore: number;
    voiceConsistencyScore: number;
  };
}

export interface VoiceValidationResult {
  score: number;
  voiceAuthenticity: string;
  styleConsistency: string;
  signatureElements: string;
  improvements: string[];
}

/**
 * Generate content with specific writer's voice
 */
export async function generateContent(
  request: WriteContentRequest
): Promise<WriteContentResponse> {
  const writer = getWriterById(request.writerId);
  if (!writer) {
    throw new Error(`Writer not found: ${request.writerId}`);
  }

  const client = await getAIClient();
  const systemPrompt = getWriterSystemPrompt(writer);
  const userPrompt = getContentGenerationPrompt(writer, request);

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8, // Higher for more personality
      max_tokens: 3000,
    });

    const generatedContent = response.choices[0]?.message?.content || "";
    
    // Parse the generated content into structured format
    const parsedContent = parseGeneratedContent(generatedContent);
    
    // Calculate metadata
    const wordCount = generatedContent.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // Average reading speed
    const voiceScore = await validateVoiceConsistency(request.writerId, generatedContent);

    return {
      content: parsedContent,
      writer,
      metadata: {
        wordCount,
        readingTime,
        seoScore: 85, // Placeholder - would integrate with SEO scoring
        voiceConsistencyScore: voiceScore,
      },
    };
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error(`Failed to generate content with writer ${writer.name}`);
  }
}

/**
 * Generate multiple title options
 */
export async function generateTitles(
  writerId: string,
  topic: string
): Promise<string[]> {
  const writer = getWriterById(writerId);
  if (!writer) {
    throw new Error(`Writer not found: ${writerId}`);
  }

  const client = await getAIClient();
  const systemPrompt = getWriterSystemPrompt(writer);
  const userPrompt = getTitleGenerationPrompt(writer, topic);

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.9, // Higher for creativity in titles
      max_tokens: 500,
    });

    const titlesText = response.choices[0]?.message?.content || "";
    
    // Parse titles from numbered list
    const titles = titlesText
      .split('\n')
      .filter(line => line.trim().match(/^\d+\./))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(title => title.length > 0);

    return titles;
  } catch (error) {
    console.error("Error generating titles:", error);
    throw new Error(`Failed to generate titles with writer ${writer.name}`);
  }
}

/**
 * Generate introduction paragraph
 */
export async function generateIntro(
  writerId: string,
  topic: string,
  title: string
): Promise<string> {
  const writer = getWriterById(writerId);
  if (!writer) {
    throw new Error(`Writer not found: ${writerId}`);
  }

  const client = await getAIClient();
  const systemPrompt = getWriterSystemPrompt(writer);
  const userPrompt = getIntroGenerationPrompt(writer, topic, title);

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error generating intro:", error);
    throw new Error(`Failed to generate intro with writer ${writer.name}`);
  }
}

/**
 * Rewrite content in writer's voice
 */
export async function rewriteInVoice(
  writerId: string,
  content: string
): Promise<string> {
  const writer = getWriterById(writerId);
  if (!writer) {
    throw new Error(`Writer not found: ${writerId}`);
  }

  const client = await getAIClient();
  const systemPrompt = getWriterSystemPrompt(writer);
  const userPrompt = getRewritePrompt(writer, content);

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    return response.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error rewriting content:", error);
    throw new Error(`Failed to rewrite content with writer ${writer.name}`);
  }
}

/**
 * Validate voice consistency
 */
export async function validateVoiceConsistency(
  writerId: string,
  content: string
): Promise<number> {
  const writer = getWriterById(writerId);
  if (!writer) {
    throw new Error(`Writer not found: ${writerId}`);
  }

  const client = await getAIClient();
  const prompt = getVoiceValidationPrompt(writer, content);

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a voice consistency analyzer. Return only valid JSON." 
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3, // Lower for more consistent analysis
      max_tokens: 1000,
    });

    const resultText = response.choices[0]?.message?.content || "{}";
    const result = JSON.parse(resultText) as VoiceValidationResult;
    
    return result.score || 0;
  } catch (error) {
    console.error("Error validating voice:", error);
    // Return a default score on error
    return 50;
  }
}

/**
 * Get detailed voice validation
 */
export async function validateContentVoice(
  writerId: string,
  content: string
): Promise<VoiceValidationResult> {
  const writer = getWriterById(writerId);
  if (!writer) {
    throw new Error(`Writer not found: ${writerId}`);
  }

  const client = await getAIClient();
  const prompt = getVoiceValidationPrompt(writer, content);

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "You are a voice consistency analyzer. Return only valid JSON." 
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const resultText = response.choices[0]?.message?.content || "{}";
    return JSON.parse(resultText) as VoiceValidationResult;
  } catch (error) {
    console.error("Error validating voice:", error);
    return {
      score: 50,
      voiceAuthenticity: "Error analyzing voice",
      styleConsistency: "Error analyzing style",
      signatureElements: "Error analyzing elements",
      improvements: ["Unable to analyze due to error"],
    };
  }
}

/**
 * Optimize content for SEO while maintaining voice
 */
export async function optimizeForSeo(
  writerId: string,
  content: string,
  keywords: string[]
): Promise<string> {
  const writer = getWriterById(writerId);
  if (!writer) {
    throw new Error(`Writer not found: ${writerId}`);
  }

  const client = await getAIClient();
  const systemPrompt = getWriterSystemPrompt(writer);
  const userPrompt = getSeoOptimizationPrompt(writer, content, keywords);

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.6,
      max_tokens: 3000,
    });

    return response.choices[0]?.message?.content || content;
  } catch (error) {
    console.error("Error optimizing for SEO:", error);
    return content; // Return original on error
  }
}

/**
 * Helper function to parse generated content into structured format
 */
function parseGeneratedContent(content: string): {
  title: string;
  metaDescription: string;
  intro: string;
  body: string;
  conclusion: string;
} {
  // This is a simple parser - in production, you'd want more sophisticated parsing
  // or structure the AI response to return JSON
  
  const lines = content.split('\n').filter(line => line.trim());
  
  // Try to extract title (usually first line or has # marker)
  const titleLine = lines.find(line => 
    line.startsWith('#') || line.length < 100
  ) || lines[0] || "Untitled";
  const title = titleLine.replace(/^#+\s*/, '').trim();
  
  // Generate meta description from first paragraph
  const firstParagraph = lines.find(line => 
    line.length > 50 && !line.startsWith('#')
  ) || "";
  const metaDescription = firstParagraph.substring(0, 155) + 
    (firstParagraph.length > 155 ? '...' : '');
  
  // Split into intro, body, conclusion
  const paragraphs = content.split('\n\n').filter(p => p.trim());
  const intro = paragraphs.slice(0, 2).join('\n\n');
  const body = paragraphs.slice(2, -1).join('\n\n');
  const conclusion = paragraphs[paragraphs.length - 1] || "";
  
  return {
    title,
    metaDescription,
    intro,
    body,
    conclusion,
  };
}

/**
 * Writer engine interface for easy imports
 */
export const writerEngine = {
  generateContent,
  generateTitles,
  generateIntro,
  rewriteInVoice,
  validateVoiceConsistency,
  validateContentVoice,
  optimizeForSeo,
};
