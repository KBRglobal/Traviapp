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
import { getInternalLinkUrls, AUTHORITATIVE_EXTERNAL_LINKS } from "../../content-writer-guidelines";

// Maximum regeneration attempts for SEO compliance
const MAX_REGENERATION_ATTEMPTS = 2;

// SEO requirements matching documented targets
const SEO_REQUIREMENTS = {
  minH2Count: 4,
  maxH2Count: 6,
  minExternalLinks: 2,
  maxExternalLinks: 3,
  minInternalLinks: 5,
  maxInternalLinks: 8,
  minWordCount: 1800,
  maxWordCount: 2200,
  metaDescMinLength: 150,
  metaDescMaxLength: 160,
};

// SEO compliance thresholds
const SEO_THRESHOLDS = {
  essential: 90,
  technical: 85,
  quality: 75,
};

interface SeoComplianceResult {
  scores: {
    essential: number;
    technical: number;
    quality: number;
    combined: number;
  };
  isCompliant: boolean;
  deficits: string[];
  metrics: {
    h2Count: number;
    wordCount: number;
    externalLinks: number;
    internalLinks: number;
    metaDescLength: number;
    titleLength: number;
    keywordMentions: number;
  };
}

/**
 * Evaluate SEO compliance of generated content
 * Returns scores, pass/fail status, and remediation hints
 */
function evaluateSeoCompliance(
  parsedContent: { title: string; metaDescription: string; intro: string; body: string; conclusion: string },
  internalLinksAvailable: number
): SeoComplianceResult {
  const fullContent = [parsedContent.intro, parsedContent.body, parsedContent.conclusion].filter(Boolean).join(' ');
  
  // Calculate metrics
  const h2Count = (parsedContent.body.match(/<h2/gi) || []).length;
  const wordCount = fullContent.split(/\s+/).filter(w => w.length > 0).length;
  const externalLinks = (parsedContent.body.match(/href="https?:\/\//gi) || []).length;
  const internalLinks = (parsedContent.body.match(/href="\//gi) || []).length;
  const metaDescLength = parsedContent.metaDescription.length;
  const titleLength = parsedContent.title.length;
  const keywordMentions = (fullContent.match(/dubai|uae/gi) || []).length;
  
  // Essential score (target 90%+)
  let essential = 0;
  if (h2Count >= SEO_REQUIREMENTS.minH2Count && h2Count <= SEO_REQUIREMENTS.maxH2Count) essential += 40;
  else if (h2Count >= 3) essential += 25;
  if (metaDescLength >= SEO_REQUIREMENTS.metaDescMinLength && metaDescLength <= SEO_REQUIREMENTS.metaDescMaxLength) essential += 30;
  if (keywordMentions >= 5) essential += 15;
  if (titleLength >= 50 && titleLength <= 60) essential += 15;
  
  // Technical score (target 85%+)
  let technical = 0;
  if (externalLinks >= SEO_REQUIREMENTS.minExternalLinks) technical += 30;
  else if (externalLinks >= 1) technical += 15;
  if (internalLinks >= SEO_REQUIREMENTS.minInternalLinks) technical += 35;
  else if (internalLinks >= 3) technical += 20;
  if (wordCount >= SEO_REQUIREMENTS.minWordCount) technical += 25;
  else if (wordCount >= 1200) technical += 15;
  technical += 10; // Schema markup (always included)
  
  // Quality score (target 75%+)
  let quality = 60;
  if (h2Count >= 4) quality += 15;
  if (wordCount >= 1500) quality += 15;
  if (keywordMentions >= 10) quality += 10;
  
  const combined = Math.round((essential * 0.35) + (technical * 0.35) + (quality * 0.30));
  
  // Build deficits list
  const deficits: string[] = [];
  if (h2Count < SEO_REQUIREMENTS.minH2Count) {
    deficits.push(`Add ${SEO_REQUIREMENTS.minH2Count - h2Count} more H2 sections (currently ${h2Count}, need ${SEO_REQUIREMENTS.minH2Count}-${SEO_REQUIREMENTS.maxH2Count})`);
  }
  if (wordCount < SEO_REQUIREMENTS.minWordCount) {
    deficits.push(`Add ${SEO_REQUIREMENTS.minWordCount - wordCount} more words (currently ${wordCount}, need ${SEO_REQUIREMENTS.minWordCount}+)`);
  }
  if (externalLinks < SEO_REQUIREMENTS.minExternalLinks) {
    deficits.push(`Add ${SEO_REQUIREMENTS.minExternalLinks - externalLinks} more external links to authoritative sources (currently ${externalLinks})`);
  }
  if (internalLinks < SEO_REQUIREMENTS.minInternalLinks && internalLinksAvailable > 0) {
    deficits.push(`Add ${SEO_REQUIREMENTS.minInternalLinks - internalLinks} more internal links (currently ${internalLinks})`);
  }
  if (metaDescLength < SEO_REQUIREMENTS.metaDescMinLength || metaDescLength > SEO_REQUIREMENTS.metaDescMaxLength) {
    deficits.push(`Adjust meta description to ${SEO_REQUIREMENTS.metaDescMinLength}-${SEO_REQUIREMENTS.metaDescMaxLength} characters (currently ${metaDescLength})`);
  }
  if (keywordMentions < 5) {
    deficits.push(`Include more mentions of "Dubai" or "UAE" (currently ${keywordMentions}, need 5+)`);
  }
  
  const isCompliant = essential >= SEO_THRESHOLDS.essential && 
                      technical >= SEO_THRESHOLDS.technical && 
                      quality >= SEO_THRESHOLDS.quality;
  
  return {
    scores: { essential, technical, quality, combined },
    isCompliant,
    deficits,
    metrics: { h2Count, wordCount, externalLinks, internalLinks, metaDescLength, titleLength, keywordMentions },
  };
}

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
 * Enhanced with SEO requirements, internal link support, and regeneration loop
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
    let parsedContent: { title: string; metaDescription: string; intro: string; body: string; conclusion: string } | null = null;
    let compliance: SeoComplianceResult | null = null;
    let attempt = 0;
    
    // REGENERATION LOOP: Generate and validate until compliant or attempts exhausted
    while (attempt <= MAX_REGENERATION_ATTEMPTS) {
      attempt++;
      const isRetry = attempt > 1;
      
      // Build prompt - on retries, include previous content and deficits
      let messages: Array<{ role: "system" | "user"; content: string }> = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ];
      
      if (isRetry && parsedContent && compliance) {
        // Build regeneration prompt with specific deficits
        const regenerationPrompt = buildRegenerationPrompt(parsedContent, compliance.deficits);
        messages = [
          { role: "system", content: systemPrompt },
          { role: "user", content: regenerationPrompt },
        ];
        console.log(`[SEO] Regeneration attempt ${attempt}/${MAX_REGENERATION_ATTEMPTS + 1} - Deficits: ${compliance.deficits.join(', ')}`);
      }
      
      const response = await client.chat.completions.create({
        model: "gpt-4o",
        messages,
        temperature: isRetry ? 0.4 : 0.7, // Lower temperature on retries for consistency
        max_tokens: 6000,
      });

      const generatedContent = response.choices[0]?.message?.content || "";
      parsedContent = parseGeneratedContent(generatedContent);
      
      // Fix meta description length
      parsedContent = fixMetaDescription(parsedContent);
      
      // Evaluate SEO compliance
      compliance = evaluateSeoCompliance(parsedContent, internalLinks.length);
      
      console.log(`[SEO] Attempt ${attempt} - Essential: ${compliance.scores.essential}%, Technical: ${compliance.scores.technical}%, Quality: ${compliance.scores.quality}%`);
      
      if (compliance.isCompliant) {
        console.log(`[SEO] Content passed all thresholds on attempt ${attempt}`);
        break;
      }
      
      // Check if we've exhausted attempts
      if (attempt > MAX_REGENERATION_ATTEMPTS) {
        console.log(`[SEO] Max attempts exhausted. Applying programmatic fixes...`);
        break;
      }
    }
    
    if (!parsedContent || !compliance) {
      throw new Error("Failed to generate content after multiple attempts");
    }
    
    // POST-GENERATION SEO ENFORCEMENT: Inject links if still missing
    let enhancedBody = parsedContent.body;
    
    // Inject external links if missing
    if (compliance.metrics.externalLinks < SEO_REQUIREMENTS.minExternalLinks) {
      console.log("[SEO] Injecting external authoritative links...");
      enhancedBody = injectExternalLinks(enhancedBody, SEO_REQUIREMENTS.minExternalLinks - compliance.metrics.externalLinks);
    }
    
    // Inject internal links if missing
    if (compliance.metrics.internalLinks < SEO_REQUIREMENTS.minInternalLinks && internalLinks.length > 0) {
      console.log("[SEO] Injecting internal links...");
      enhancedBody = injectInternalLinks(enhancedBody, internalLinks, SEO_REQUIREMENTS.minInternalLinks - compliance.metrics.internalLinks);
    }
    
    // Update body with injected links
    const finalParsedContent = {
      ...parsedContent,
      body: enhancedBody,
    };
    
    // Recalculate final compliance after injections
    const finalCompliance = evaluateSeoCompliance(finalParsedContent, internalLinks.length);
    
    // Calculate metadata
    const fullContent = [finalParsedContent.intro, finalParsedContent.body, finalParsedContent.conclusion].filter(Boolean).join(' ');
    const wordCount = fullContent.split(/\s+/).filter(w => w.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    // Validate voice
    const voiceScore = await voiceValidator.getScore(request.writerId, fullContent);
    
    console.log(`[SEO] Final Scores - Essential: ${finalCompliance.scores.essential}%, Technical: ${finalCompliance.scores.technical}%, Quality: ${finalCompliance.scores.quality}%, Combined: ${finalCompliance.scores.combined}%`);

    return {
      content: finalParsedContent,
      writer,
      metadata: {
        wordCount,
        readingTime,
        seoScore: finalCompliance.scores.combined,
        voiceConsistencyScore: voiceScore,
      },
    };
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error(`Failed to generate content with writer ${writer.name}`);
  }
}

/**
 * Fix meta description length
 */
function fixMetaDescription(parsedContent: { title: string; metaDescription: string; intro: string; body: string; conclusion: string }) {
  let metaDesc = parsedContent.metaDescription;
  
  if (metaDesc.length < SEO_REQUIREMENTS.metaDescMinLength) {
    // Pad with relevant content from intro
    const padding = parsedContent.intro?.replace(/<[^>]*>/g, '').substring(0, SEO_REQUIREMENTS.metaDescMaxLength - metaDesc.length) || "";
    metaDesc = (metaDesc + " " + padding).substring(0, SEO_REQUIREMENTS.metaDescMaxLength).trim();
  } else if (metaDesc.length > SEO_REQUIREMENTS.metaDescMaxLength) {
    metaDesc = metaDesc.substring(0, SEO_REQUIREMENTS.metaDescMaxLength - 3) + "...";
  }
  
  return { ...parsedContent, metaDescription: metaDesc };
}

/**
 * Build regeneration prompt with previous content and deficits
 */
function buildRegenerationPrompt(
  previousContent: { title: string; metaDescription: string; intro: string; body: string; conclusion: string },
  deficits: string[]
): string {
  return `The previous article did not meet SEO requirements. Please revise it to address these specific issues:

REQUIRED IMPROVEMENTS:
${deficits.map((d, i) => `${i + 1}. ${d}`).join('\n')}

PREVIOUS ARTICLE (revise and improve):
Title: ${previousContent.title}
Meta Description: ${previousContent.metaDescription}

---CONTENT START---
${previousContent.intro}

${previousContent.body}

${previousContent.conclusion}
---CONTENT END---

Return the revised article in the same JSON format with all improvements made. Ensure:
- All H2 sections are properly formatted with <h2> tags
- Word count meets requirements (add more detailed content, examples, and Dubai-specific information)
- Include authoritative external links (visitdubai.com, dubai.ae, dubaitourism.gov.ae)
- Include internal links to related content
- Meta description is 150-160 characters

Respond ONLY with the JSON object.`;
}

/**
 * Inject external authoritative links into content body
 * Handles both HTML and Markdown formats
 */
function injectExternalLinks(body: string, count: number): string {
  if (count <= 0) return body;
  
  const linksToInject = AUTHORITATIVE_EXTERNAL_LINKS.slice(0, Math.min(count, SEO_REQUIREMENTS.maxExternalLinks));
  
  // Check if content is HTML (has </p> tags) or Markdown
  const isHtml = body.includes('</p>');
  
  if (isHtml) {
    const paragraphs = body.split('</p>');
    if (paragraphs.length < 2) {
      // Fallback: append at end
      let result = body;
      linksToInject.forEach(link => {
        result += `<p class="external-reference">For official information, visit <a href="${link.url}" target="_blank" rel="noopener">${link.title}</a>.</p>`;
      });
      return result;
    }
    
    let injectedCount = 0;
    const injectPositions = [1, 3, 5].slice(0, count);
    
    for (let i = 0; i < paragraphs.length && injectedCount < linksToInject.length; i++) {
      if (injectPositions.includes(i) && paragraphs[i].trim()) {
        const link = linksToInject[injectedCount];
        paragraphs[i] += ` <p class="external-reference">For official information, visit <a href="${link.url}" target="_blank" rel="noopener">${link.title}</a>.</p>`;
        injectedCount++;
      }
    }
    
    // If we couldn't inject all links, append remaining at end
    while (injectedCount < linksToInject.length) {
      const link = linksToInject[injectedCount];
      paragraphs[paragraphs.length - 1] += `<p class="external-reference">For official information, visit <a href="${link.url}" target="_blank" rel="noopener">${link.title}</a>.</p>`;
      injectedCount++;
    }
    
    return paragraphs.join('</p>');
  } else {
    // Markdown format - convert links to HTML paragraphs and append
    let result = body;
    linksToInject.forEach(link => {
      result += `\n\n<p class="external-reference">For official information, visit <a href="${link.url}" target="_blank" rel="noopener">${link.title}</a>.</p>`;
    });
    return result;
  }
}

/**
 * Inject internal links into content body
 * Handles both HTML and Markdown formats
 */
function injectInternalLinks(
  body: string, 
  availableLinks: Array<{ title: string; url: string }>,
  count: number
): string {
  if (count <= 0 || availableLinks.length === 0) return body;
  
  const linksToInject = availableLinks.slice(0, Math.min(count, SEO_REQUIREMENTS.maxInternalLinks));
  const isHtml = body.includes('</p>');
  
  if (isHtml) {
    const paragraphs = body.split('</p>');
    if (paragraphs.length < 2) {
      // Fallback: append at end
      let result = body;
      linksToInject.forEach(link => {
        result += `<p class="related-content">Explore more: <a href="${link.url}">${link.title}</a></p>`;
      });
      return result;
    }
    
    let injectedCount = 0;
    const injectPositions = [2, 4, 6, 8, 10].slice(0, count);
    
    for (let i = 0; i < paragraphs.length && injectedCount < linksToInject.length; i++) {
      if (injectPositions.includes(i) && paragraphs[i].trim()) {
        const link = linksToInject[injectedCount];
        paragraphs[i] += ` <span class="related-link">See also: <a href="${link.url}">${link.title}</a>.</span>`;
        injectedCount++;
      }
    }
    
    // If we couldn't inject all links, append remaining at end
    while (injectedCount < linksToInject.length) {
      const link = linksToInject[injectedCount];
      paragraphs[paragraphs.length - 1] += `<p class="related-content">Explore more: <a href="${link.url}">${link.title}</a></p>`;
      injectedCount++;
    }
    
    return paragraphs.join('</p>');
  } else {
    // Markdown format - append links
    let result = body;
    linksToInject.forEach(link => {
      result += `\n\nSee also: [${link.title}](${link.url})`;
    });
    return result;
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
