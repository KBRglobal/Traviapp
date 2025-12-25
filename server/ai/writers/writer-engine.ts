/**
 * AI Writer Engine
 *
 * Generates content using the selected writer's voice and style
 * Updated to include SEO requirements and internal link support
 */

import { getAIClient } from "../providers";
import type { AIWriter } from "./writer-registry";
import { getWriterById } from "./writer-registry";
import { voiceValidator } from "./voice-validator";
import {
  getWriterSystemPrompt,
  getContentGenerationPrompt,
  getTitleGenerationPrompt,
  getIntroGenerationPrompt,
  getRewritePrompt,
  getSeoOptimizationPrompt,
  type WriteContentRequest,
} from "./prompts";
import { getInternalLinkUrls } from "../../content-writer-guidelines";

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

/**
 * Helper to get AI client with proper error handling
 */
function getClient() {
  const aiClient = getAIClient();
  if (!aiClient) {
    throw new Error("No AI provider configured. Please add OPENAI_API_KEY, GEMINI, or OPENROUTER_API_KEY.");
  }
  return aiClient.client;
}

/**
 * Generate content with specific writer's voice
 * Enhanced with SEO requirements and internal link support
 */
export async function generateContent(
  request: WriteContentRequest
): Promise<WriteContentResponse> {
  const writer = getWriterById(request.writerId);
  if (!writer) {
    throw new Error(`Writer not found: ${request.writerId}`);
  }

  const client = getClient();
  
  // Fetch internal links for SEO
  let internalLinks: Array<{ title: string; url: string }> = [];
  try {
    const links = await getInternalLinkUrls(undefined, 15);
    internalLinks = links?.map(l => ({ title: l.title, url: l.url })) || [];
  } catch (error) {
    console.warn("Could not fetch internal links:", error);
  }
  
  // Add internal links to the request
  const enrichedRequest = {
    ...request,
    internalLinks,
  };
  
  const systemPrompt = getWriterSystemPrompt(writer);
  const userPrompt = getContentGenerationPrompt(writer, enrichedRequest);

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7, // Balanced for personality + compliance
      max_tokens: 6000, // Increased for longer SEO content
    });

    const generatedContent = response.choices[0]?.message?.content || "";
    
    // Parse the generated content - now expecting JSON format
    let parsedContent = parseGeneratedContent(generatedContent);
    
    // Fix meta description length if needed (common AI failure point)
    if (parsedContent.metaDescription.length < 150) {
      // Pad with relevant content
      const padding = parsedContent.intro?.substring(0, 160 - parsedContent.metaDescription.length) || "";
      parsedContent = {
        ...parsedContent,
        metaDescription: (parsedContent.metaDescription + " " + padding).substring(0, 160).trim()
      };
    } else if (parsedContent.metaDescription.length > 160) {
      // Truncate to 160 chars
      parsedContent = {
        ...parsedContent,
        metaDescription: parsedContent.metaDescription.substring(0, 157) + "..."
      };
    }
    
    // Calculate metadata from assembled article (not raw JSON)
    const fullContent = [parsedContent.intro, parsedContent.body, parsedContent.conclusion].filter(Boolean).join(' ');
    const wordCount = fullContent.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    // Calculate basic SEO score based on content
    const h2Count = (parsedContent.body.match(/<h2/gi) || []).length;
    const externalLinks = (parsedContent.body.match(/href="https?:\/\//gi) || []).length;
    const dubaiMentions = (fullContent.match(/dubai|uae/gi) || []).length;
    const metaLength = parsedContent.metaDescription.length;
    
    let seoScore = 50; // Base score
    if (h2Count >= 3 && h2Count <= 8) seoScore += 15;
    if (externalLinks >= 1) seoScore += 15;
    if (dubaiMentions >= 5) seoScore += 10;
    if (metaLength >= 150 && metaLength <= 160) seoScore += 10;
    
    // Validate voice on assembled content, not raw JSON
    const voiceScore = await voiceValidator.getScore(request.writerId, fullContent);

    return {
      content: parsedContent,
      writer,
      metadata: {
        wordCount,
        readingTime,
        seoScore,
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

  const client = getClient();
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

  const client = getClient();
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

  const client = getClient();
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

  const client = getClient();
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
 * Now expects JSON output from the AI with SEO-compliant structure
 */
function parseGeneratedContent(content: string): {
  title: string;
  metaDescription: string;
  intro: string;
  body: string;
  conclusion: string;
} {
  // Clean up the content - remove markdown code fences if present
  let cleanContent = content.trim();
  if (cleanContent.startsWith('```json')) {
    cleanContent = cleanContent.slice(7);
  } else if (cleanContent.startsWith('```')) {
    cleanContent = cleanContent.slice(3);
  }
  if (cleanContent.endsWith('```')) {
    cleanContent = cleanContent.slice(0, -3);
  }
  cleanContent = cleanContent.trim();
  
  // Try to parse as JSON first
  try {
    const parsed = JSON.parse(cleanContent);
    return {
      title: parsed.title || "Untitled",
      metaDescription: parsed.metaDescription || "",
      intro: parsed.intro || "",
      body: parsed.body || "",
      conclusion: parsed.conclusion || "",
    };
  } catch (error) {
    // Fallback: Try to extract JSON from the content
    const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          title: parsed.title || "Untitled",
          metaDescription: parsed.metaDescription || "",
          intro: parsed.intro || "",
          body: parsed.body || "",
          conclusion: parsed.conclusion || "",
        };
      } catch (e) {
        // Continue to text parsing fallback
      }
    }
    
    // Fallback text parsing for non-JSON responses
    console.warn("AI did not return JSON, falling back to text parsing");
    const lines = content.split('\n').filter(line => line.trim());
    
    const titleLine = lines.find(line => 
      line.startsWith('#') || line.length < 100
    ) || lines[0] || "Untitled";
    const title = titleLine.replace(/^#+\s*/, '').trim();
    
    const firstParagraph = lines.find(line => 
      line.length > 50 && !line.startsWith('#')
    ) || "";
    const metaDescription = firstParagraph.substring(0, 155) + 
      (firstParagraph.length > 155 ? '...' : '');
    
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
}

/**
 * Writer engine interface for easy imports
 */
export const writerEngine = {
  generateContent,
  generateTitles,
  generateIntro,
  rewriteInVoice,
  optimizeForSeo,
  // Voice validation is now handled by voiceValidator from ./voice-validator
};
