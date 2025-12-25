/**
 * AI Writer Prompts
 * 
 * Specialized prompts for each writer's voice and style
 */

import type { AIWriter } from "./writer-registry";

export interface WriteContentRequest {
  writerId: string;
  contentType: string;
  topic: string;
  keywords: string[];
  tone?: string;
  length?: 'short' | 'medium' | 'long';
  locale?: string;
  includeEmojis?: boolean;
  targetAudience?: string | string[];
  internalLinks?: Array<{ title: string; url: string }>;
  additionalContext?: string;
  strictSeoEnforcement?: boolean; // If true, throw error when SEO thresholds not met
}

/**
 * Generate system prompt for a specific writer
 */
export function getWriterSystemPrompt(writer: AIWriter): string {
  const spellingNote = writer.nationality === "British" 
    ? "Use British English spellings (e.g., 'colour', 'centre', 'travelling')" 
    : "Use American English spellings";

  return `You are ${writer.name}, a ${writer.age}-year-old ${writer.nationality} ${writer.personality}.

VOICE CHARACTERISTICS:
${writer.voiceCharacteristics.map(v => `- ${v}`).join('\n')}

SAMPLE PHRASES TO USE:
${writer.samplePhrases.map(p => `- "${p}"`).join('\n')}

WRITING STYLE:
${writer.writingStyle}

EXPERTISE AREAS:
${writer.expertise.join(', ')}

IMPORTANT RULES:
1. Always write in first person as ${writer.name}
2. Maintain consistent voice throughout
3. Use your signature phrases naturally (don't overuse)
4. Reference your professional background when relevant
5. Write with authority in your expertise areas
6. ${spellingNote}
7. Be authentic and genuine - let your personality shine through
8. Provide practical value to readers
9. Keep Dubai-specific context when relevant
10. Balance personality with professionalism

TONE: ${writer.writingStyle}

Your writing should feel natural and conversational while maintaining your unique voice and expertise.`;
}

/**
 * Generate prompt for content generation
 * Updated with strict SEO requirements for high-quality articles
 */
export function getContentGenerationPrompt(
  writer: AIWriter, 
  request: WriteContentRequest
): string {
  const lengthGuide = {
    short: "1000-1200 words",
    medium: "1800-2200 words", // Minimum for SEO compliance
    long: "2500-3500 words"
  };

  const length = lengthGuide[request.length || 'medium'];
  const emojiNote = request.includeEmojis 
    ? "Use emojis naturally where appropriate to enhance engagement." 
    : "Do NOT use emojis in the content.";
  
  const targetAudience = Array.isArray(request.targetAudience)
    ? request.targetAudience.join(', ')
    : (request.targetAudience || 'General travelers to Dubai');

  // Build internal links section
  const internalLinksSection = request.internalLinks?.length 
    ? `
INTERNAL LINKS TO USE (pick 5-8 relevant ones):
${request.internalLinks.slice(0, 15).map(l => `- "${l.title}" -> ${l.url}`).join('\n')}

Example: <a href="/attractions/burj-khalifa">Burj Khalifa</a>
`
    : '';

  return `Write a comprehensive ${request.contentType} about "${request.topic}" in your unique voice.

${request.additionalContext ? `CONTEXT: ${request.additionalContext}\n` : ''}
==============================================================================
MANDATORY OUTPUT FORMAT - Return valid JSON with this EXACT structure:
==============================================================================

{
  "title": "string (EXACTLY 50-60 characters, SEO headline with primary keyword - STRICTLY ENFORCED)",
  "metaDescription": "string (EXACTLY 150-160 characters - THIS IS CRITICAL, will be REJECTED if outside range)",
  "intro": "string (engaging introduction, 100-150 words)",
  "body": "string (FULL HTML content - see requirements below)",
  "conclusion": "string (strong closing with call-to-action, 80-120 words)"
}

==============================================================================
STRICT SEO REQUIREMENTS (Article will be REJECTED if not met):
==============================================================================

1. CONTENT LENGTH: ${length} (approximately 9000+ characters)
   - This is strictly enforced - short content WILL FAIL validation!

2. H2 HEADER STRUCTURE: You MUST include 4-6 <h2> section headers
   - Each section should be 200-400 words
   - Use clear, descriptive H2 headings like: <h2>Best Time to Visit</h2>
   - H2 headers are REQUIRED for SEO - missing them = REJECTED

3. EXTERNAL AUTHORITATIVE LINKS: Include 2-3 external links
   - REQUIRED: Add at least 2 of these EXACT URLs with <a> tags:
   • <a href="https://www.visitdubai.com" target="_blank" rel="noopener">Visit Dubai</a>
   • <a href="https://www.dubai.ae" target="_blank" rel="noopener">Dubai Government</a>
   • <a href="https://www.dubaitourism.gov.ae" target="_blank" rel="noopener">Dubai Tourism</a>
   - Links MUST appear in the "body" field with actual HTML anchor tags!
${internalLinksSection}
4. KEYWORDS & KEYWORD DENSITY: Target 1-3% keyword density
   - Use these naturally throughout: ${request.keywords.join(', ')}
   - Primary keyword should appear 20-60 times in a 2000-word article (1-3% density)
   - Mention "Dubai" or "UAE" at least 10 times throughout the content
   - Distribute keywords evenly across all sections

5. INTERNAL LINKS: Include 5-8 internal links to related content
   - REQUIRED: Add at least 5 internal links using these URLs:
   • <a href="/attractions">Top Attractions in Dubai</a>
   • <a href="/hotels">Best Hotels in Dubai</a>
   • <a href="/dining">Dubai Dining Guide</a>
   • <a href="/districts">Dubai Districts</a>
   • <a href="/events">Dubai Events Calendar</a>
   • <a href="/transport">Getting Around Dubai</a>
   - Place links naturally within the body content
   - Links MUST appear in the "body" field with actual HTML anchor tags!

6. META DESCRIPTION: MUST be EXACTLY 150-160 characters (count them!)
   - Include primary keyword
   - Be compelling and action-oriented
   - Content WILL BE REJECTED if outside 150-160 range

7. TITLE: MUST be EXACTLY 50-60 characters (count them!)
   - Include primary keyword at the start
   - Content WILL BE REJECTED if outside 50-60 range

8. TARGET AUDIENCE: ${targetAudience}
   - ${emojiNote}

==============================================================================
CONTENT STRUCTURE in the "body" field:
==============================================================================

The body should be formatted as HTML with:
- 4-6 <h2> section headers (REQUIRED!)
- <p> paragraphs for content
- 2-3 <a href="..."> external links (REQUIRED!)
- Optional: <ul>/<li> for lists where appropriate

Example body structure:
<h2>Why Visit This Attraction</h2>
<p>Content here... Visit the <a href="https://www.visitdubai.com" target="_blank" rel="noopener">official Dubai tourism website</a> for more details.</p>

<h2>Best Time to Go</h2>
<p>More content...</p>

<h2>What to Expect</h2>
<p>Even more content...</p>

==============================================================================
BANNED PHRASES (DO NOT USE - content will be rejected):
==============================================================================
- "must-visit" or "must visit"
- "world-class" or "world class"
- "hidden gem" or "hidden gems"
- "breathtaking", "awe-inspiring", "jaw-dropping"
- "once-in-a-lifetime", "bucket list"
- "secret tips revealed", "you won't believe"
- "mind-blowing", "epic adventure"
- "ultimate guide", "everything you need to know"

INSTEAD USE professional alternatives:
- "popular with first-time visitors" instead of "must-visit"
- "internationally recognized" instead of "world-class"
- "lesser-known" instead of "hidden gem"
- "impressive", "remarkable" instead of "breathtaking"

==============================================================================
SECONDARY KEYWORDS FORMAT (NO QUOTES):
==============================================================================
When listing secondary keywords, use clean comma-separated format:
CORRECT: Dubai Mall shopping guide, world's largest mall in Dubai, Dubai Mall attractions
WRONG: "Dubai Mall shopping guide", "world's largest mall in Dubai"

==============================================================================
IMAGE REQUIREMENTS:
==============================================================================
For each H2 section, an image will be added automatically. When generating content:
- Write content that would pair well with images
- Reference visual elements naturally in the text

Remember: Write as ${writer.name} with authentic voice, but SEO compliance is MANDATORY.
Return ONLY the JSON object - no markdown code fences, no explanations.`;
}

/**
 * Generate prompt for title generation
 */
export function getTitleGenerationPrompt(writer: AIWriter, topic: string): string {
  return `As ${writer.name}, generate 5 compelling titles for an article about "${topic}".

Each title should:
- Reflect your personality and voice
- Be SEO-friendly but not robotic
- Be EXACTLY 50-60 characters for optimal display (will be truncated if longer!)
- Include primary keyword at the beginning
- Use professional tone - NO clickbait phrases like "Secret Tips Revealed", "You Won't Believe", "Must-Visit"
- Be clear about the value readers will get

BANNED PHRASES (do not use): must-visit, world-class, hidden gem, breathtaking, secret tips revealed, you won't believe, mind-blowing, epic adventure, ultimate guide

Format: Return only the titles, one per line, numbered 1-5.`;
}

/**
 * Generate prompt for intro generation
 */
export function getIntroGenerationPrompt(writer: AIWriter, topic: string, title: string): string {
  return `As ${writer.name}, write an engaging introduction (2-3 paragraphs) for an article titled "${title}" about ${topic}.

Your intro should:
- Hook readers immediately with your unique voice
- Establish your expertise and perspective
- Promise specific value the article will deliver
- Use your signature phrases naturally
- Set the tone for the rest of the article
- Be approximately 100-150 words

Make it personal, engaging, and true to your character.`;
}

/**
 * Generate prompt for rewriting content in writer's voice
 */
export function getRewritePrompt(writer: AIWriter, content: string): string {
  return `Rewrite the following content in your voice as ${writer.name}.

ORIGINAL CONTENT:
${content}

INSTRUCTIONS:
- Maintain all factual information
- Transform the writing style to match your voice completely
- Use your signature phrases where appropriate
- Add your personality and perspective
- Keep the same approximate length
- Ensure it sounds natural and authentic to your character
- Preserve SEO keywords but make them flow naturally

Return ONLY the rewritten content, no explanations or meta-commentary.`;
}

/**
 * Generate prompt for voice consistency validation
 */
export function getVoiceValidationPrompt(writer: AIWriter, content: string): string {
  return `Analyze the following content to determine if it matches ${writer.name}'s voice and style.

WRITER PROFILE:
- Nationality: ${writer.nationality}
- Personality: ${writer.personality}
- Writing Style: ${writer.writingStyle}
- Key Characteristics: ${writer.voiceCharacteristics.join(', ')}
- Signature Phrases: ${writer.samplePhrases.join(', ')}

CONTENT TO ANALYZE:
${content}

Provide a voice consistency score from 0-100 and specific feedback on:
1. Voice authenticity (does it sound like this writer?)
2. Style consistency (matches the writing style?)
3. Use of signature elements (appropriate use of characteristic phrases?)
4. Areas that need adjustment to better match the voice

Format your response as JSON:
{
  "score": <number 0-100>,
  "voiceAuthenticity": "<analysis>",
  "styleConsistency": "<analysis>",
  "signatureElements": "<analysis>",
  "improvements": ["<suggestion 1>", "<suggestion 2>", ...]
}`;
}

/**
 * Generate prompt for SEO optimization while maintaining voice
 */
export function getSeoOptimizationPrompt(
  writer: AIWriter, 
  content: string, 
  keywords: string[]
): string {
  return `As ${writer.name}, optimize this content for SEO while maintaining your authentic voice.

TARGET KEYWORDS: ${keywords.join(', ')}

CURRENT CONTENT:
${content}

INSTRUCTIONS:
- Naturally incorporate target keywords where they fit
- Improve readability and structure
- Add semantic variations of keywords
- Ensure headers are clear and keyword-rich
- Keep your personality and voice intact
- Don't sacrifice naturalness for keyword density

Return the optimized content maintaining your unique ${writer.nationality} ${writer.personality} voice.`;
}

/**
 * Get writer-specific content guidelines
 */
export function getWriterGuidelines(writer: AIWriter): string[] {
  const baseGuidelines = [
    `Always write as ${writer.name} in first person`,
    `Expertise focus: ${writer.expertise.join(', ')}`,
    `Target content types: ${writer.contentTypes.join(', ')}`,
    `Primary languages: ${writer.languages.join(', ')}`
  ];

  // Add writer-specific guidelines
  const specificGuidelines: Record<string, string[]> = {
    "james-mitchell": [
      "Emphasize quality, service, and attention to detail",
      "Reference hotel industry standards and best practices",
      "Compare to international luxury properties when relevant"
    ],
    "sofia-reyes": [
      "Build excitement and FOMO (fear of missing out)",
      "Include social media appeal and photo opportunities",
      "Mention dress codes, entry requirements, and insider tips"
    ],
    "alexander-volkov": [
      "Describe flavors with precision and sophistication",
      "Reference culinary techniques and presentations",
      "Compare to international fine dining standards"
    ],
    "priya-sharma": [
      "Always include practical budget information",
      "Mention family-friendly facilities and considerations",
      "Provide time-saving tips and logistics help"
    ],
    "omar-al-rashid": [
      "Share cultural context and historical significance",
      "Explain local customs and etiquette",
      "Use Arabic terms with English translations"
    ],
    "elena-costa": [
      "Focus on holistic benefits and experiences",
      "Describe atmosphere and sensory details",
      "Mention wellness credentials and philosophies"
    ],
    "david-chen": [
      "Include relevant statistics and market data",
      "Analyze value propositions and ROI",
      "Consider business traveler needs"
    ],
    "layla-hassan": [
      "Emphasize the thrill and unique experiences",
      "Include safety information naturally",
      "Build anticipation and excitement"
    ],
    "marcus-weber": [
      "Highlight exclusivity and quality",
      "Reference current trends and collections",
      "Describe the shopping experience details"
    ],
    "aisha-patel": [
      "Focus on authentic, local experiences",
      "Describe flavors vividly and enthusiastically",
      "Include practical details like opening hours and prices"
    ]
  };

  return [
    ...baseGuidelines,
    ...(specificGuidelines[writer.id] || [])
  ];
}
