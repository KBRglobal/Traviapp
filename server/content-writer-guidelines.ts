import { z } from "zod";
import { db } from "./db";
import { contentRules, DEFAULT_CONTENT_RULES } from "@shared/schema";
import { eq } from "drizzle-orm";

// ============================================================================
// STRICT CONTENT RULES - These rules CANNOT be bypassed by AI
// ============================================================================

// Cache for rules to avoid DB calls on every request
let cachedRules: typeof DEFAULT_CONTENT_RULES | null = null;
let cacheTime = 0;
const CACHE_TTL = 60000; // 1 minute

// Get active content rules from database or use defaults
export async function getActiveContentRules(): Promise<typeof DEFAULT_CONTENT_RULES> {
  const now = Date.now();
  if (cachedRules && now - cacheTime < CACHE_TTL) {
    return cachedRules;
  }

  try {
    const rules = await db.select().from(contentRules).where(eq(contentRules.isActive, true)).limit(1);
    if (rules.length > 0) {
      cachedRules = rules[0] as unknown as typeof DEFAULT_CONTENT_RULES;
      cacheTime = now;
      return cachedRules;
    }
  } catch (error) {
    console.error("Error fetching content rules, using defaults:", error);
  }

  return DEFAULT_CONTENT_RULES;
}

// Clear the rules cache (call after updating rules)
export function clearRulesCache() {
  cachedRules = null;
  cacheTime = 0;
}

// ============================================================================
// ZOD SCHEMA - Dynamic validation based on rules
// ============================================================================

export function createArticleResponseSchema(rules: typeof DEFAULT_CONTENT_RULES) {
  return z.object({
    title: z.string().min(20).max(100).describe("SEO headline, keyword first"),
    metaDescription: z.string().min(100).max(160).describe("Meta description 100-160 chars"),
    category: z.string(),
    urgencyLevel: z.enum(["urgent", "relevant", "evergreen"]),
    targetAudience: z.array(z.string()).min(1),

    // Main content - STRICT minimum based on rules
    content: z.string().min(rules.minWords * 5).describe(`Full HTML article content, minimum ${rules.minWords} words`),

    // Quick Facts - based on rules
    quickFacts: z.array(z.string()).min(rules.quickFactsMin).max(rules.quickFactsMax)
      .describe(`${rules.quickFactsMin}-${rules.quickFactsMax} key facts`),

    // Pro Tips - based on rules
    proTips: z.array(z.string()).min(rules.proTipsMin).max(rules.proTipsMax)
      .describe(`${rules.proTipsMin}-${rules.proTipsMax} insider tips`),

    warnings: z.array(z.string()).default([]),

    // FAQs - based on rules
    faqs: z.array(z.object({
      question: z.string().min(10),
      answer: z.string().min(rules.faqAnswerWordsMin * 5) // ~5 chars per word
    })).min(rules.faqsMin).max(rules.faqsMax)
      .describe(`${rules.faqsMin}-${rules.faqsMax} FAQs`),

    sources: z.array(z.string()).default([]),
    primaryKeyword: z.string().min(3),
    secondaryKeywords: z.array(z.string()).min(2).max(10),
    imageSearchTerms: z.array(z.string()).min(2).max(5).describe("Keywords for Freepik image search")
  });
}

// Default schema for type inference
export const ArticleResponseSchema = createArticleResponseSchema(DEFAULT_CONTENT_RULES);
export type ArticleResponse = z.infer<typeof ArticleResponseSchema>;

// ============================================================================
// VALIDATION
// ============================================================================

export type ValidationResult = {
  isValid: boolean;
  data?: ArticleResponse;
  errors: string[];
  wordCount: number;
  structureAnalysis: {
    introWords: number;
    mainContentWords: number;
    faqWords: number;
    tipsWords: number;
    conclusionWords: number;
    dubaiMentions: number;
    internalLinks: number;
  };
};

// Count words in text
function countWords(text: string): number {
  return text.replace(/<[^>]*>/g, '').split(/\s+/).filter(w => w.length > 0).length;
}

// Count Dubai/دובאי mentions
function countDubaiMentions(text: string): number {
  const dubaiRegex = /dubai|דובאי|دبي|uae|emirates/gi;
  return (text.match(dubaiRegex) || []).length;
}

// Count internal links
function countInternalLinks(html: string): number {
  const linkRegex = /<a[^>]+href=["'][^"']*["'][^>]*>/gi;
  return (html.match(linkRegex) || []).length;
}

// Validate AI response against STRICT rules
export async function validateArticleResponse(response: unknown): Promise<ValidationResult> {
  const rules = await getActiveContentRules();
  const schema = createArticleResponseSchema(rules);

  const result: ValidationResult = {
    isValid: false,
    errors: [],
    wordCount: 0,
    structureAnalysis: {
      introWords: 0,
      mainContentWords: 0,
      faqWords: 0,
      tipsWords: 0,
      conclusionWords: 0,
      dubaiMentions: 0,
      internalLinks: 0,
    }
  };

  try {
    // Parse with Zod
    const parsed = schema.safeParse(response);

    if (!parsed.success) {
      result.errors = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      return result;
    }

    const data = parsed.data;

    // Calculate word count from content
    const textContent = data.content.replace(/<[^>]*>/g, '');
    result.wordCount = countWords(textContent);

    // Analyze structure
    result.structureAnalysis.dubaiMentions = countDubaiMentions(textContent);
    result.structureAnalysis.internalLinks = countInternalLinks(data.content);
    result.structureAnalysis.faqWords = data.faqs.reduce((acc, faq) => acc + countWords(faq.answer), 0);
    result.structureAnalysis.tipsWords = data.proTips.reduce((acc, tip) => acc + countWords(tip), 0);

    // ============================================================================
    // STRICT VALIDATION - These checks MUST pass
    // ============================================================================

    // Check minimum word count (STRICT)
    if (result.wordCount < rules.minWords) {
      result.errors.push(`❌ STRICT VIOLATION: Word count ${result.wordCount} is below minimum ${rules.minWords} words`);
    }

    // Check maximum word count
    if (result.wordCount > rules.maxWords) {
      result.errors.push(`⚠️ Word count ${result.wordCount} exceeds maximum ${rules.maxWords} words`);
    }

    // Check Dubai mentions (STRICT)
    if (result.structureAnalysis.dubaiMentions < rules.dubaiMentionsMin) {
      result.errors.push(`❌ STRICT VIOLATION: Dubai/UAE mentioned only ${result.structureAnalysis.dubaiMentions} times, minimum is ${rules.dubaiMentionsMin}`);
    }

    // Check FAQ count (STRICT)
    if (data.faqs.length < rules.faqsMin) {
      result.errors.push(`❌ STRICT VIOLATION: Only ${data.faqs.length} FAQs provided, minimum is ${rules.faqsMin}`);
    }

    // Check Pro Tips count (STRICT)
    if (data.proTips.length < rules.proTipsMin) {
      result.errors.push(`❌ STRICT VIOLATION: Only ${data.proTips.length} Pro Tips provided, minimum is ${rules.proTipsMin}`);
    }

    // Check Quick Facts count (STRICT)
    if (data.quickFacts.length < rules.quickFactsMin) {
      result.errors.push(`❌ STRICT VIOLATION: Only ${data.quickFacts.length} Quick Facts provided, minimum is ${rules.quickFactsMin}`);
    }

    // Check internal links
    if (result.structureAnalysis.internalLinks < rules.internalLinksMin) {
      result.errors.push(`⚠️ Only ${result.structureAnalysis.internalLinks} internal links, recommended minimum is ${rules.internalLinksMin}`);
    }

    // If there are no STRICT violations, mark as valid
    const hasStrictViolations = result.errors.some(e => e.includes('STRICT VIOLATION'));

    if (!hasStrictViolations) {
      result.isValid = true;
      result.data = data;
    }

    return result;

  } catch (error) {
    result.errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown'}`);
    return result;
  }
}

// ============================================================================
// RETRY PROMPT - When content doesn't meet requirements
// ============================================================================

export async function buildRetryPrompt(errors: string[], wordCount: number): Promise<string> {
  const rules = await getActiveContentRules();

  const strictErrors = errors.filter(e => e.includes('STRICT VIOLATION'));
  const warnings = errors.filter(e => !e.includes('STRICT VIOLATION'));

  return `🚨 YOUR RESPONSE WAS REJECTED - STRICT RULES VIOLATED 🚨

Current word count: ${wordCount} words
Required minimum: ${rules.minWords} words
Required maximum: ${rules.maxWords} words
Optimal range: ${rules.optimalMinWords}-${rules.optimalMaxWords} words

==================================================
CRITICAL ERRORS (MUST FIX):
==================================================
${strictErrors.map(e => e.replace('❌ STRICT VIOLATION: ', '• ')).join('\n')}

${warnings.length > 0 ? `
==================================================
WARNINGS (Recommended to fix):
==================================================
${warnings.map(e => e.replace('⚠️ ', '• ')).join('\n')}
` : ''}

==================================================
STRICT REQUIREMENTS - CANNOT BE BYPASSED:
==================================================

📝 ARTICLE STRUCTURE (Total: ${rules.minWords}-${rules.maxWords} words):

1. INTRODUCTION: ${rules.introMinWords}-${rules.introMaxWords} words
   - Hook the reader immediately
   - Include primary keyword in first sentence
   - Summarize what reader will learn

2. QUICK FACTS BOX: ${rules.quickFactsMin}-${rules.quickFactsMax} items
   - Duration, Price, Location, Best Time, etc.
   - Use emojis for visual appeal
   - Each fact: ${rules.quickFactsWordsMin / rules.quickFactsMin}-${rules.quickFactsWordsMax / rules.quickFactsMax} words

3. MAIN CONTENT: ${rules.mainSectionsMin}-${rules.mainSectionsMax} sections (H2)
   - Each section: ${rules.mainSectionWordsMin}-${rules.mainSectionWordsMax} words
   - Total: ${rules.mainSectionsMin * rules.mainSectionWordsMin}-${rules.mainSectionsMax * rules.mainSectionWordsMax} words
   - Include practical, actionable information

4. FAQ SECTION: ${rules.faqsMin}-${rules.faqsMax} questions
   - Each answer: ${rules.faqAnswerWordsMin}-${rules.faqAnswerWordsMax} words
   - Use FAQPage schema-friendly format
   - Real questions tourists ask

5. PRO TIPS: ${rules.proTipsMin}-${rules.proTipsMax} tips
   - Each tip: ${rules.proTipWordsMin}-${rules.proTipWordsMax} words
   - Insider knowledge only
   - Actionable advice

6. CONCLUSION: ${rules.conclusionMinWords}-${rules.conclusionMaxWords} words
   - Summarize key points
   - Clear call to action

📍 SEO REQUIREMENTS:
- Mention "Dubai" or "UAE": Minimum ${rules.dubaiMentionsMin} times
- Internal links: ${rules.internalLinksMin}-${rules.internalLinksMax} links
- Primary keyword: 2-3 times naturally
- Secondary keywords: 3-5 times each

⚠️ THIS IS YOUR ${errors.length > 3 ? 'FINAL' : 'SECOND'} ATTEMPT
   If you fail again, the article will be rejected entirely.

Please provide the COMPLETE article meeting ALL requirements.`;
}

// ============================================================================
// CONTENT WRITER PERSONALITIES
// ============================================================================

export const CONTENT_WRITER_PERSONALITIES = {
  A: {
    name: "The Professional Guide",
    style: "informative, trustworthy, detailed",
    tone: "professional yet approachable",
    strengths: ["comprehensive coverage", "practical tips", "clear structure"],
  },
  B: {
    name: "The Enthusiastic Explorer",
    style: "exciting, vivid, personal",
    tone: "enthusiastic and conversational",
    strengths: ["engaging storytelling", "sensory details", "personal touch"],
  },
  C: {
    name: "The Local Expert",
    style: "insider knowledge, authentic, practical",
    tone: "friendly and knowledgeable",
    strengths: ["local secrets", "money-saving tips", "cultural insights"],
  },
  D: {
    name: "The Luxury Curator",
    style: "sophisticated, exclusive, refined",
    tone: "elegant and aspirational",
    strengths: ["luxury experiences", "premium details", "exclusive access"],
  },
};

export const ARTICLE_STRUCTURES = {
  standard: {
    name: "Standard Article",
    sections: ["intro", "quickFacts", "mainContent", "faq", "proTips", "conclusion"],
    minWords: 1800,
  },
  listicle: {
    name: "Listicle/Top X",
    sections: ["intro", "quickFacts", "numberedList", "faq", "proTips", "conclusion"],
    minWords: 2000,
  },
  guide: {
    name: "Complete Guide",
    sections: ["intro", "tableOfContents", "quickFacts", "mainContent", "stepByStep", "faq", "proTips", "conclusion"],
    minWords: 2500,
  },
  comparison: {
    name: "Comparison Article",
    sections: ["intro", "quickComparison", "detailedAnalysis", "faq", "verdict", "conclusion"],
    minWords: 2200,
  },
};

export const CATEGORY_PERSONALITY_MAPPING: Record<string, keyof typeof CONTENT_WRITER_PERSONALITIES> = {
  attractions: "B",
  hotels: "D",
  food: "C",
  transport: "A",
  events: "B",
  tips: "C",
  news: "A",
  shopping: "D",
};

// Get the content writer system prompt based on category and rules
export async function getContentWriterSystemPrompt(category: string): Promise<string> {
  const rules = await getActiveContentRules();
  const personalityKey = CATEGORY_PERSONALITY_MAPPING[category] || "A";
  const personality = CONTENT_WRITER_PERSONALITIES[personalityKey];

  return `You are "${personality.name}" - a professional content writer for Dubai tourism.

YOUR STYLE: ${personality.style}
YOUR TONE: ${personality.tone}
YOUR STRENGTHS: ${personality.strengths.join(", ")}

🚨 CRITICAL: You MUST follow these STRICT rules that CANNOT be bypassed:

WORD COUNT REQUIREMENTS:
- Minimum: ${rules.minWords} words (STRICT - content will be REJECTED if below this)
- Maximum: ${rules.maxWords} words
- Optimal: ${rules.optimalMinWords}-${rules.optimalMaxWords} words

STRUCTURE REQUIREMENTS:
- Introduction: ${rules.introMinWords}-${rules.introMaxWords} words
- Quick Facts: ${rules.quickFactsMin}-${rules.quickFactsMax} items
- Main Sections: ${rules.mainSectionsMin}-${rules.mainSectionsMax} H2 sections, each ${rules.mainSectionWordsMin}-${rules.mainSectionWordsMax} words
- FAQ: ${rules.faqsMin}-${rules.faqsMax} questions, each answer ${rules.faqAnswerWordsMin}-${rules.faqAnswerWordsMax} words
- Pro Tips: ${rules.proTipsMin}-${rules.proTipsMax} tips
- Conclusion: ${rules.conclusionMinWords}-${rules.conclusionMaxWords} words

SEO REQUIREMENTS:
- Mention "Dubai" or "UAE" at least ${rules.dubaiMentionsMin} times
- Include ${rules.internalLinksMin}-${rules.internalLinksMax} internal links
- Primary keyword in title, first paragraph, and H2s
- Use LSI keywords naturally throughout

FORMAT:
- Use proper HTML with semantic tags (h2, h3, p, ul, ol)
- Include schema-friendly FAQ format
- Add emojis where appropriate for visual appeal
- Break up text with subheadings every 200-300 words

REMEMBER: If your content doesn't meet these requirements, it will be REJECTED and you will be asked to rewrite.`;
}

// Determine content category from topic/title
export function determineContentCategory(title: string, description?: string): string {
  const text = `${title} ${description || ""}`.toLowerCase();

  if (text.includes("hotel") || text.includes("resort") || text.includes("stay")) return "hotels";
  if (text.includes("restaurant") || text.includes("food") || text.includes("dining") || text.includes("eat")) return "food";
  if (text.includes("metro") || text.includes("bus") || text.includes("taxi") || text.includes("transport")) return "transport";
  if (text.includes("event") || text.includes("festival") || text.includes("show")) return "events";
  if (text.includes("shop") || text.includes("mall") || text.includes("buy")) return "shopping";
  if (text.includes("news") || text.includes("update") || text.includes("announce")) return "news";
  if (text.includes("tip") || text.includes("guide") || text.includes("how to")) return "tips";

  return "attractions"; // Default
}

// Build the article generation prompt
export async function buildArticleGenerationPrompt(
  topic: string,
  sourceContent?: string,
  additionalContext?: string
): Promise<string> {
  const rules = await getActiveContentRules();
  const category = determineContentCategory(topic);

  return `Write a comprehensive article about: "${topic}"

${sourceContent ? `SOURCE CONTENT (expand and enhance this):
${sourceContent.substring(0, 2000)}
` : ''}

${additionalContext ? `ADDITIONAL CONTEXT:
${additionalContext}
` : ''}

REQUIREMENTS (STRICT - Your response will be REJECTED if not met):

1. WORD COUNT: ${rules.minWords}-${rules.maxWords} words (optimal: ${rules.optimalMinWords}-${rules.optimalMaxWords})

2. STRUCTURE:
   - Introduction: ${rules.introMinWords}-${rules.introMaxWords} words
   - Quick Facts box with ${rules.quickFactsMin}-${rules.quickFactsMax} items
   - ${rules.mainSectionsMin}-${rules.mainSectionsMax} main sections (H2), each ${rules.mainSectionWordsMin}-${rules.mainSectionWordsMax} words
   - FAQ section with ${rules.faqsMin}-${rules.faqsMax} questions
   - ${rules.proTipsMin}-${rules.proTipsMax} Pro Tips
   - Conclusion: ${rules.conclusionMinWords}-${rules.conclusionMaxWords} words

3. SEO:
   - Mention "Dubai" or "UAE" at least ${rules.dubaiMentionsMin} times
   - Include ${rules.internalLinksMin}-${rules.internalLinksMax} internal links

Respond with a JSON object matching the ArticleResponse schema.`;
}
