import { z } from "zod";
import { db } from "./db";
import { contentRules, DEFAULT_CONTENT_RULES, keywordRepository, contents } from "@shared/schema";
import { eq, desc, and, ne, sql } from "drizzle-orm";

// ============================================================================
// INTERNAL LINKS - Get existing published content URLs for linking
// ============================================================================

// Cache for internal links
let cachedInternalLinks: { title: string; slug: string; type: string; url: string }[] | null = null;
let internalLinksCacheTime = 0;
const INTERNAL_LINKS_CACHE_TTL = 300000; // 5 minutes

/**
 * Get list of published content URLs for internal linking
 * Returns URLs that the AI can use when generating content
 */
export async function getInternalLinkUrls(excludeSlug?: string, limit = 30): Promise<typeof cachedInternalLinks> {
  const now = Date.now();
  
  // Return cached if available
  if (cachedInternalLinks && now - internalLinksCacheTime < INTERNAL_LINKS_CACHE_TTL) {
    return excludeSlug 
      ? cachedInternalLinks.filter(l => l.slug !== excludeSlug)
      : cachedInternalLinks;
  }
  
  try {
    const publishedContent = await db
      .select({
        title: contents.title,
        slug: contents.slug,
        type: contents.type,
      })
      .from(contents)
      .where(eq(contents.status, "published"))
      .limit(100);
    
    // Build URLs based on content type
    const links = publishedContent.map(c => {
      let url = "";
      switch (c.type) {
        case "attraction": url = `/attractions/${c.slug}`; break;
        case "hotel": url = `/hotels/${c.slug}`; break;
        case "article": url = `/articles/${c.slug}`; break;
        case "dining": url = `/dining/${c.slug}`; break;
        case "district": url = `/districts/${c.slug}`; break;
        case "transport": url = `/transport/${c.slug}`; break;
        case "event": url = `/events/${c.slug}`; break;
        case "itinerary": url = `/itineraries/${c.slug}`; break;
        default: url = `/${c.type}s/${c.slug}`;
      }
      return {
        title: c.title,
        slug: c.slug,
        type: c.type,
        url: url
      };
    });
    
    cachedInternalLinks = links;
    internalLinksCacheTime = now;
    
    return excludeSlug 
      ? links.filter(l => l.slug !== excludeSlug).slice(0, limit)
      : links.slice(0, limit);
  } catch (error) {
    console.error("Error fetching internal links:", error);
    return [];
  }
}

// Clear internal links cache (call after publishing/unpublishing content)
export function clearInternalLinksCache() {
  cachedInternalLinks = null;
  internalLinksCacheTime = 0;
}

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
// KEYWORD REPOSITORY - SEO Bible integration
// ============================================================================

// Cache for keywords
let cachedKeywords: { keyword: string; type: string; category: string | null; priority: number; relatedKeywords: string[] }[] | null = null;
let keywordCacheTime = 0;
const KEYWORD_CACHE_TTL = 300000; // 5 minutes

// Get active keywords from repository
export async function getActiveKeywords(category?: string, limit = 50): Promise<typeof cachedKeywords> {
  const now = Date.now();

  // Return cached if available and no category filter
  if (cachedKeywords && now - keywordCacheTime < KEYWORD_CACHE_TTL && !category) {
    return cachedKeywords;
  }

  try {
    let query = db
      .select({
        keyword: keywordRepository.keyword,
        type: keywordRepository.type,
        category: keywordRepository.category,
        priority: keywordRepository.priority,
        relatedKeywords: keywordRepository.relatedKeywords,
      })
      .from(keywordRepository)
      .where(eq(keywordRepository.isActive, true))
      .orderBy(desc(keywordRepository.priority))
      .limit(limit);

    const keywords = await query;

    // Filter by category if provided
    const result = category
      ? keywords.filter(k => k.category?.toLowerCase() === category.toLowerCase())
      : keywords;

    // Cache only non-filtered results
    if (!category) {
      cachedKeywords = result as typeof cachedKeywords;
      keywordCacheTime = now;
    }

    return result as typeof cachedKeywords;
  } catch (error) {
    console.error("Error fetching keywords:", error);
    return [];
  }
}

// Get keywords for specific content type
export async function getKeywordsForContentType(contentType: string): Promise<string[]> {
  const categoryMap: Record<string, string> = {
    attraction: "attractions",
    hotel: "hotels",
    article: "news",
    dining: "food",
    district: "districts",
    transport: "transport",
    event: "events",
    itinerary: "travel",
    landing_page: "seo",
    case_study: "real_estate",
    off_plan: "real_estate",
  };

  const category = categoryMap[contentType] || contentType;
  const keywords = await getActiveKeywords(category, 30);

  // Return primary keywords + related keywords
  const allKeywords: string[] = [];
  keywords?.forEach(k => {
    allKeywords.push(k.keyword);
    if (k.relatedKeywords) {
      allKeywords.push(...k.relatedKeywords.slice(0, 3));
    }
  });

  return [...new Set(allKeywords)]; // Remove duplicates
}

// Clear keyword cache
export function clearKeywordCache() {
  cachedKeywords = null;
  keywordCacheTime = 0;
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
    keywordsUsed: string[];
    keywordCoverage: number; // percentage
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

// Check which keywords from repository are used in content
function findUsedKeywords(text: string, keywords: string[]): string[] {
  const lowerText = text.toLowerCase();
  return keywords.filter(keyword => {
    const lowerKeyword = keyword.toLowerCase();
    // Check for exact word match or phrase match
    const regex = new RegExp(`\\b${lowerKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return regex.test(lowerText);
  });
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
      keywordsUsed: [],
      keywordCoverage: 0,
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

    // Check keyword usage from repository
    const allKeywords = await getActiveKeywords(undefined, 100);
    if (allKeywords && allKeywords.length > 0) {
      const keywordList = allKeywords.map(k => k.keyword);
      result.structureAnalysis.keywordsUsed = findUsedKeywords(textContent, keywordList);
      result.structureAnalysis.keywordCoverage = Math.round(
        (result.structureAnalysis.keywordsUsed.length / Math.min(keywordList.length, 20)) * 100
      );
    }

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

    // Check keyword coverage from SEO Bible
    if (result.structureAnalysis.keywordCoverage < 30) {
      result.errors.push(`⚠️ Low keyword coverage (${result.structureAnalysis.keywordCoverage}%). Use more keywords from the SEO keyword repository.`);
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

export async function buildRetryPrompt(errors: string[], wordCount: number, contentType?: string): Promise<string> {
  const rules = await getActiveContentRules();
  const keywords = await getActiveKeywords(undefined, 20);
  const keywordList = keywords?.map(k => k.keyword).slice(0, 15) || [];
  const minContentChars = rules.minWords * 5;
  const faqAnswerMinChars = rules.faqAnswerWordsMin * 5;

  // Categorize errors for better guidance
  const typeErrors = errors.filter(e => e.includes('Expected') || e.includes('Invalid enum'));
  const lengthErrors = errors.filter(e => e.includes('character') || e.includes('element'));
  const requiredErrors = errors.filter(e => e.includes('Required'));

  return `🚨 YOUR RESPONSE WAS REJECTED - FIX THESE ERRORS 🚨

==================================================
VALIDATION ERRORS FOUND:
==================================================
${errors.map(e => `• ${e}`).join('\n')}

==================================================
COMMON MISTAKES TO AVOID:
==================================================

${typeErrors.length > 0 ? `❌ TYPE ERRORS DETECTED:
   - "targetAudience" must be an ARRAY: ["tourists", "families"] NOT a string
   - "urgencyLevel" must be EXACTLY: "urgent" | "relevant" | "evergreen"
     (NOT "High", "Medium", "Low", "Standard", etc.)
   - "faqs" must be an array of objects with "question" and "answer" keys
` : ''}

${lengthErrors.length > 0 ? `❌ LENGTH ERRORS DETECTED:
   - "content" must be at least ${minContentChars} characters (${rules.minWords} words)
     You provided ${wordCount} words - need ${Math.max(0, rules.minWords - wordCount)} more!
   - Each FAQ "answer" must be at least ${faqAnswerMinChars} characters (${rules.faqAnswerWordsMin} words)
     Write full paragraph answers, not short sentences!
   - "metaDescription" must be 100-160 characters (NOT more!)
` : ''}

${requiredErrors.length > 0 ? `❌ MISSING REQUIRED FIELDS:
   Make sure you include ALL of these fields:
   - title, metaDescription, category, urgencyLevel, targetAudience
   - content, quickFacts, proTips, faqs
   - primaryKeyword, secondaryKeywords, imageSearchTerms
` : ''}

==================================================
CORRECT JSON STRUCTURE (FOLLOW EXACTLY):
==================================================

{
  "title": "Your SEO Title Here - 20 to 100 characters",
  "metaDescription": "Compelling meta description between 100-160 characters only",
  "category": "attractions",
  "urgencyLevel": "evergreen",
  "targetAudience": ["tourists", "families", "couples"],
  "content": "<p>Your FULL article HTML here with at least ${rules.minWords} words...</p><h2>Section 1</h2><p>...</p>",
  "quickFacts": ["Fact 1 about the topic", "Fact 2", "Fact 3", "Fact 4", "Fact 5"],
  "proTips": ["Pro tip 1 with 20-35 words of actionable advice", "Pro tip 2", "Pro tip 3", "Pro tip 4", "Pro tip 5"],
  "warnings": [],
  "faqs": [
    {"question": "What is the best time to visit?", "answer": "The best time to visit is during... [MINIMUM ${rules.faqAnswerWordsMin} words / ${faqAnswerMinChars} characters - write a FULL paragraph!]"},
    {"question": "How much does it cost?", "answer": "Pricing varies depending on... [MINIMUM ${rules.faqAnswerWordsMin} words / ${faqAnswerMinChars} characters]"},
    {"question": "Question 3?", "answer": "Full paragraph answer..."},
    {"question": "Question 4?", "answer": "Full paragraph answer..."},
    {"question": "Question 5?", "answer": "Full paragraph answer..."},
    {"question": "Question 6?", "answer": "Full paragraph answer..."}
  ],
  "sources": [],
  "primaryKeyword": "main keyword here",
  "secondaryKeywords": ["keyword 1", "keyword 2", "keyword 3"],
  "imageSearchTerms": ["dubai", "tourism", "attraction"]
}

==================================================
WORD COUNT REMINDER:
==================================================
Current: ${wordCount} words
Required: ${rules.minWords}-${rules.maxWords} words
${wordCount < rules.minWords ? `⚠️ You need ${rules.minWords - wordCount} MORE words!` : '✓ Word count OK'}

🔑 KEYWORDS to include:
${keywordList.length > 0 ? keywordList.slice(0, 10).map(k => `• ${k}`).join('\n') : '• dubai tourism\n• things to do in dubai'}

⚠️ THIS IS ATTEMPT ${errors.length > 5 ? 'FINAL' : '2/3'}. Respond ONLY with valid JSON.`;
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
  const keywords = await getActiveKeywords(category, 20);
  const keywordList = keywords?.map(k => k.keyword).slice(0, 15) || [];
  const personalityKey = CATEGORY_PERSONALITY_MAPPING[category] || "A";
  const personality = CONTENT_WRITER_PERSONALITIES[personalityKey];
  const minContentChars = rules.minWords * 5;
  const faqAnswerMinChars = rules.faqAnswerWordsMin * 5;

  return `You are "${personality.name}" - a professional content writer for Dubai tourism.
You MUST respond with VALID JSON only. No markdown, no explanation, just the JSON object.

YOUR STYLE: ${personality.style}
YOUR TONE: ${personality.tone}
YOUR STRENGTHS: ${personality.strengths.join(", ")}

==============================================================================
CRITICAL: OUTPUT FORMAT - YOU MUST RETURN THIS EXACT JSON STRUCTURE
==============================================================================

{
  "title": "string (20-100 chars)",
  "metaDescription": "string (100-160 chars MAX)",
  "category": "string (attractions|hotels|food|transport|events|shopping|news|tips)",
  "urgencyLevel": "urgent" | "relevant" | "evergreen",
  "targetAudience": ["array", "of", "strings"],
  "content": "string (HTML article, ${minContentChars}+ chars / ${rules.minWords}+ words)",
  "quickFacts": ["array of ${rules.quickFactsMin}-${rules.quickFactsMax} facts"],
  "proTips": ["array of ${rules.proTipsMin}-${rules.proTipsMax} tips"],
  "warnings": [],
  "faqs": [
    {"question": "string", "answer": "string (${faqAnswerMinChars}+ chars each!)"},
    ... ${rules.faqsMin}-${rules.faqsMax} items
  ],
  "sources": [],
  "primaryKeyword": "string",
  "secondaryKeywords": ["array of 2-10 keywords"],
  "imageSearchTerms": ["array of 2-5 search terms"]
}

==============================================================================
STRICT VALIDATION RULES (Content REJECTED if violated):
==============================================================================

1. CONTENT LENGTH: ${rules.minWords}-${rules.maxWords} words (${minContentChars}+ characters)
   - This is enforced strictly - short content will fail!

2. FAQ ANSWERS: Each answer MUST be ${rules.faqAnswerWordsMin}-${rules.faqAnswerWordsMax} words
   - That's ${faqAnswerMinChars}+ characters per answer
   - One-sentence answers will be REJECTED!

3. FIELD TYPES (CRITICAL):
   - "targetAudience": MUST be array ["tourists", "families"] NOT string
   - "urgencyLevel": MUST be EXACTLY "urgent", "relevant", or "evergreen"
     (NOT "High", "Medium", "Low", "Standard", etc.)
   - "faqs": MUST be array of objects with "question" and "answer" keys

4. SEO:
   - Mention "Dubai" or "UAE" at least ${rules.dubaiMentionsMin} times
   - Include ${rules.internalLinksMin}-${rules.internalLinksMax} internal <a href="/..."> links
   - Include 1-2 external authoritative links (visitdubai.com, dubai.ae)

🔑 KEYWORDS TO USE:
${keywordList.length > 0 ? keywordList.map(k => `• ${k}`).join('\n') : '• dubai tourism\n• things to do in dubai\n• dubai attractions'}

5. LINKS IN CONTENT - CRITICAL FOR SEO SCORE:
   - You MUST include actual <a href="..."> links in the "content" field
   - Internal links should look like: <a href="/attractions/burj-khalifa">Burj Khalifa</a>
   - External links: <a href="https://www.visitdubai.com" target="_blank" rel="noopener">Visit Dubai</a>
   - DO NOT just mention links - you must use actual HTML anchor tags!

REMEMBER: Return ONLY valid JSON. No markdown code fences. No explanations.`;
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
  const keywords = await getActiveKeywords(category, 20);
  const keywordList = keywords?.map(k => k.keyword).slice(0, 15) || [];
  const minContentChars = rules.minWords * 5; // ~5 chars per word
  const faqAnswerMinChars = rules.faqAnswerWordsMin * 5;
  
  // Get internal links for the AI to use
  const internalLinks = await getInternalLinkUrls(undefined, 20);
  const internalLinksList = internalLinks?.length 
    ? internalLinks.map(l => `• "${l.title}" -> ${l.url}`).join('\n')
    : '• No published content yet - use placeholder links like /attractions/example, /hotels/example';

  return `Write a comprehensive article about: "${topic}"

${sourceContent ? `SOURCE CONTENT (expand and enhance this):
${sourceContent.substring(0, 2000)}
` : ''}

${additionalContext ? `ADDITIONAL CONTEXT:
${additionalContext}
` : ''}

==============================================================================
CRITICAL: YOUR RESPONSE MUST BE VALID JSON WITH EXACT STRUCTURE BELOW
==============================================================================

{
  "title": "string (20-100 chars, SEO headline with primary keyword)",
  "metaDescription": "string (100-160 chars MAXIMUM, compelling meta description)",
  "category": "string (one of: attractions, hotels, food, transport, events, shopping, news, tips)",
  "urgencyLevel": "string (MUST be exactly one of: urgent | relevant | evergreen)",
  "targetAudience": ["array", "of", "strings", "like", "tourists", "families", "business travelers"],
  
  "content": "string (FULL HTML article, MINIMUM ${minContentChars} characters / ${rules.minWords} words)",
  
  "quickFacts": ["fact 1", "fact 2", ... ${rules.quickFactsMin}-${rules.quickFactsMax} items total],
  
  "proTips": ["tip 1", "tip 2", ... ${rules.proTipsMin}-${rules.proTipsMax} tips, each 20-35 words],
  
  "warnings": ["optional array of warnings"],
  
  "faqs": [
    {"question": "string (10+ chars)", "answer": "string (MINIMUM ${faqAnswerMinChars} chars / ${rules.faqAnswerWordsMin} words each!)"},
    {"question": "string", "answer": "string (MINIMUM ${faqAnswerMinChars} chars each!)"},
    ... ${rules.faqsMin}-${rules.faqsMax} FAQ items total
  ],
  
  "sources": ["optional array of source URLs"],
  "primaryKeyword": "string (main SEO keyword, 3+ chars)",
  "secondaryKeywords": ["keyword1", "keyword2", ... 2-10 items],
  "imageSearchTerms": ["term1", "term2", ... 2-5 terms for image search]
}

==============================================================================
STRICT REQUIREMENTS (Your response will be REJECTED if not met):
==============================================================================

1. CONTENT LENGTH: The "content" field MUST contain ${rules.minWords}-${rules.maxWords} words
   - That's approximately ${minContentChars}-${rules.maxWords * 5} characters
   - This is the most common failure - make sure content is LONG ENOUGH!

2. FAQ ANSWERS: Each FAQ answer MUST be ${rules.faqAnswerWordsMin}-${rules.faqAnswerWordsMax} words (${faqAnswerMinChars}+ chars)
   - Short 1-2 sentence answers will be REJECTED
   - Each answer should be a full paragraph with helpful details

3. STRUCTURE in the "content" field:
   - Introduction: ${rules.introMinWords}-${rules.introMaxWords} words
   - ${rules.mainSectionsMin}-${rules.mainSectionsMax} main sections with <h2> tags
   - Each section: ${rules.mainSectionWordsMin}-${rules.mainSectionWordsMax} words
   - Conclusion: ${rules.conclusionMinWords}-${rules.conclusionMaxWords} words

4. FIELD TYPES - CRITICAL:
   - targetAudience: MUST be an array like ["tourists", "families"] NOT a string
   - urgencyLevel: MUST be exactly "urgent", "relevant", or "evergreen" (NOT "High", "Medium", etc.)
   - faqs: MUST be array of objects with "question" and "answer" keys

5. SEO in "content":
   - Mention "Dubai" or "UAE" at least ${rules.dubaiMentionsMin} times
   - Include ${rules.internalLinksMin}-${rules.internalLinksMax} internal <a href="..."> links
   - Include 1-2 external authoritative links (e.g., Dubai Tourism, Visit Dubai, official sources)

6. KEYWORDS to use naturally:
${keywordList.length > 0 ? keywordList.map(k => `   • ${k}`).join('\n') : '   • dubai tourism\n   • things to do in dubai\n   • dubai attractions\n   • visit dubai\n   • dubai guide'}

==============================================================================
INTERNAL LINKS - USE THESE URLs IN YOUR CONTENT (pick 5-8 relevant ones):
==============================================================================
${internalLinksList}

EXAMPLE of how to add internal links in content:
<p>When visiting Dubai, don't miss the <a href="/attractions/burj-khalifa">Burj Khalifa</a> for stunning views.</p>

==============================================================================
EXTERNAL AUTHORITATIVE LINKS - Add 1-2 of these:
==============================================================================
• Dubai Tourism Official: https://www.visitdubai.com
• Dubai Government: https://www.dubai.ae
• DTCM: https://www.dubaitourism.gov.ae
• RTA Dubai: https://www.rta.ae (for transport topics)

Respond ONLY with the JSON object, no markdown code fences.`;
}
