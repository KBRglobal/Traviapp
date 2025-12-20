import { z } from "zod";

// Zod schema for validating AI-generated article content
export const ArticleResponseSchema = z.object({
  title: z.string().min(30).max(80).describe("SEO headline 50-65 chars, keyword first"),
  metaDescription: z.string().min(100).max(180).describe("Meta description 150-160 chars"),
  category: z.string(),
  urgencyLevel: z.enum(["urgent", "relevant", "evergreen"]),
  targetAudience: z.array(z.string()).min(1),
  content: z.string().min(3000).describe("Full HTML article content, minimum 800 words"),
  quickFacts: z.array(z.string()).min(5).max(7).describe("5-7 key facts"),
  proTips: z.array(z.string()).min(5).max(7).describe("5-7 insider tips"),
  warnings: z.array(z.string()).default([]),
  faqs: z.array(z.object({
    question: z.string().min(20),
    answer: z.string().min(50)
  })).min(5).max(7).describe("5-7 FAQs"),
  sources: z.array(z.string()).default([]),
  primaryKeyword: z.string().min(3),
  secondaryKeywords: z.array(z.string()).min(3).max(10),
  imageSearchTerms: z.array(z.string()).min(3).max(5).describe("Keywords for Freepik image search")
});

export type ArticleResponse = z.infer<typeof ArticleResponseSchema>;

// Validation result type
export type ValidationResult = {
  isValid: boolean;
  data?: ArticleResponse;
  errors: string[];
  wordCount: number;
};

// Validate AI response and check word count
export function validateArticleResponse(response: unknown): ValidationResult {
  const result: ValidationResult = {
    isValid: false,
    errors: [],
    wordCount: 0
  };

  try {
    // Parse with Zod
    const parsed = ArticleResponseSchema.safeParse(response);
    
    if (!parsed.success) {
      result.errors = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
      return result;
    }

    // Calculate word count from content
    const textContent = parsed.data.content.replace(/<[^>]*>/g, '');
    result.wordCount = textContent.split(/\s+/).filter(w => w.length > 0).length;

    // Check minimum word count
    if (result.wordCount < 800) {
      result.errors.push(`Word count ${result.wordCount} is below minimum 800 words`);
      return result;
    }

    // All checks passed
    result.isValid = true;
    result.data = parsed.data;
    return result;

  } catch (error) {
    result.errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown'}`);
    return result;
  }
}

// Enhanced prompt for retry when initial response is incomplete
export function buildRetryPrompt(errors: string[], originalResponse: unknown): string {
  return `Your previous response was INCOMPLETE or INVALID. Please fix these issues:

ERRORS FOUND:
${errors.map(e => `- ${e}`).join('\n')}

REQUIREMENTS REMINDER:
1. Article content MUST be at least 800 words (count: ${JSON.stringify(originalResponse).length} chars is NOT enough)
2. You MUST provide exactly 5-7 quickFacts
3. You MUST provide exactly 5-7 proTips
4. You MUST provide exactly 5-7 FAQs with detailed questions and answers
5. You MUST provide 3-5 imageSearchTerms for finding relevant Freepik images
6. Title must be 50-65 characters
7. Meta description must be 150-160 characters

EXPAND YOUR CONTENT:
- Add more detailed paragraphs with specific information
- Include background context and history
- Add comparisons with similar attractions/places
- Include practical visitor information
- Describe the experience in sensory detail
- Add related recommendations

Please provide the COMPLETE response again with ALL required fields properly filled.`;
}

export const CONTENT_WRITER_PERSONALITIES = {
  A: {
    name: "The Professional Guide",
    style: "Factual, precise, organized",
    sentences: "Medium length, clear",
    tone: "Professional yet accessible",
    characteristics: [
      '"Located in...", "Opening hours are...", "Prices start from..."',
      "Uses exact numbers, addresses, directions",
      '"According to...", "Official sources confirm..."'
    ],
    opening: "With the most important facts",
    bestFor: ["transportation", "logistics", "news", "regulations"]
  },
  B: {
    name: "The Excited Traveler / Storyteller",
    style: "Energetic, descriptive, imagination-sparking",
    sentences: "Varied, with rhythm",
    tone: "Enthusiastic, optimistic, inviting",
    characteristics: [
      '"Imagine...", "Picture this...", "You won\'t believe..."',
      "Uses rich but not excessive adjectives",
      '"Here\'s the best part", "Wait, it gets better"',
      "Sensory descriptions (what you see/hear/smell)"
    ],
    opening: "With a scene or experiential description",
    bestFor: ["attractions", "activities", "events", "festivals"]
  },
  C: {
    name: "The Balanced Critic",
    style: "Analytical, comparative, fair",
    sentences: "Structured, with pros and cons",
    tone: "Balanced, trustworthy, grounded",
    characteristics: [
      '"On one hand... on the other hand..."',
      '"Compared to...", "Unlike..."',
      '"Worth noting that...", "Keep in mind..."',
      "Presents balanced perspective"
    ],
    opening: "With overall assessment or comparison",
    bestFor: ["hotels", "accommodation", "restaurants", "shopping", "reviews"]
  },
  D: {
    name: "The Local Insider",
    style: "Friendly, insider tips, conversational",
    sentences: "Short-medium, easy",
    tone: "Friendly, like a friend giving advice",
    characteristics: [
      '"Here\'s what locals know...", "Insider tip:", "Pro tip:"',
      '"Most tourists don\'t realize...", "The secret is..."',
      '"Trust me on this", "You\'ll thank me later"',
      "Practical, undocumented tips"
    ],
    opening: "With surprising tip or insider info",
    bestFor: ["tips", "guides", "food", "dining", "practical recommendations"]
  },
  E: {
    name: "The Practical Planner",
    style: "Utility-focused, efficient, organized",
    sentences: "Short, lists, bullet points",
    tone: "Direct, helpful, no fluff",
    characteristics: [
      '"What you need to know:", "Quick facts:", "Bottom line:"',
      "Numbered lists and visual organization",
      '"Budget: $X", "Time needed: X hours"',
      '"How to get there:", "Best time to visit:"'
    ],
    opening: "With critical information immediately",
    bestFor: ["planning guides", "budgeting", "quick info"]
  }
} as const;

export const ARTICLE_STRUCTURES = {
  NEWS_GUIDE: {
    name: "News + Guide",
    description: "For new attractions/places",
    sections: [
      "What's new (THE NEWS)",
      "Why it's interesting (THE HOOK)",
      "The details (what, included, unique)",
      "Practical info (location, prices, hours, tip)",
      "Summary + CTA (THE CLOSER)"
    ]
  },
  STRUCTURED_LIST: {
    name: "Structured List",
    description: "For 'best of' guides/lists",
    sections: [
      "Opening: Why this list matters",
      "[Number] Items with: Name, Description, Who it suits, Practical detail",
      "Summary: How to choose"
    ]
  },
  COMPARATIVE: {
    name: "Comparative",
    description: "For hotels/restaurants/options",
    sections: [
      "Opening: The question/problem",
      "Option 1: Pros and Cons",
      "Option 2: Pros and Cons",
      "Conclusion: Which to choose when"
    ]
  },
  STORY_INFO: {
    name: "Story + Info",
    description: "For events",
    sections: [
      "Scene-setting opening",
      "Event details (what, when, where)",
      "What to expect",
      "Practical tips",
      "Call to action"
    ]
  },
  PROBLEM_SOLUTION: {
    name: "Problem-Solution",
    description: "For practical guides",
    sections: [
      "The problem/challenge",
      "The solution overview",
      "Step-by-step guide",
      "Pro tips",
      "Summary"
    ]
  },
  NEWS_UPDATE: {
    name: "News Update",
    description: "For changes/news/regulations",
    sections: [
      "What changed (headline fact)",
      "Details of the change",
      "How it affects travelers",
      "What to do now",
      "Timeline/dates"
    ]
  }
} as const;

export const CATEGORY_PERSONALITY_MAPPING: Record<string, { personality: keyof typeof CONTENT_WRITER_PERSONALITIES; structure: keyof typeof ARTICLE_STRUCTURES; tone: string }> = {
  attractions: { personality: "B", structure: "NEWS_GUIDE", tone: "enthusiastic" },
  activities: { personality: "B", structure: "NEWS_GUIDE", tone: "enthusiastic" },
  hotels: { personality: "C", structure: "COMPARATIVE", tone: "analytical" },
  accommodation: { personality: "C", structure: "COMPARATIVE", tone: "analytical" },
  food: { personality: "D", structure: "NEWS_GUIDE", tone: "sensory" },
  restaurants: { personality: "D", structure: "NEWS_GUIDE", tone: "sensory" },
  dining: { personality: "D", structure: "NEWS_GUIDE", tone: "sensory" },
  transport: { personality: "A", structure: "NEWS_UPDATE", tone: "factual" },
  transportation: { personality: "A", structure: "NEWS_UPDATE", tone: "factual" },
  logistics: { personality: "A", structure: "NEWS_UPDATE", tone: "factual" },
  events: { personality: "B", structure: "STORY_INFO", tone: "exciting" },
  festivals: { personality: "B", structure: "STORY_INFO", tone: "exciting" },
  tips: { personality: "D", structure: "PROBLEM_SOLUTION", tone: "friendly" },
  guides: { personality: "D", structure: "PROBLEM_SOLUTION", tone: "friendly" },
  news: { personality: "A", structure: "NEWS_UPDATE", tone: "serious" },
  regulations: { personality: "A", structure: "NEWS_UPDATE", tone: "serious" },
  shopping: { personality: "C", structure: "STRUCTURED_LIST", tone: "practical" },
  deals: { personality: "D", structure: "STRUCTURED_LIST", tone: "value-focused" }
};

export function getContentWriterSystemPrompt(category: string, personality: typeof CONTENT_WRITER_PERSONALITIES[keyof typeof CONTENT_WRITER_PERSONALITIES], structure: typeof ARTICLE_STRUCTURES[keyof typeof ARTICLE_STRUCTURES]): string {
  return `You are a professional travel content writer specializing in Dubai. You write for international travelers seeking practical, interesting, and valuable information for their trip.

═══════════════════════════════════════════════════
YOUR WRITING PERSONALITY: ${personality.name}
═══════════════════════════════════════════════════

**Style:** ${personality.style}
**Sentences:** ${personality.sentences}
**Tone:** ${personality.tone}

**Characteristics:**
${personality.characteristics.map(c => `- ${c}`).join('\n')}

**Opening Style:** ${personality.opening}

═══════════════════════════════════════════════════
ARTICLE STRUCTURE: ${structure.name}
═══════════════════════════════════════════════════

**Purpose:** ${structure.description}

**Required Sections:**
${structure.sections.map((s, i) => `${i + 1}. ${s}`).join('\n')}

═══════════════════════════════════════════════════
CONTENT REQUIREMENTS (CRITICAL)
═══════════════════════════════════════════════════

1. **Word Count:** MINIMUM 800 words, target 1000-1500 words. This is a STRICT requirement.
   - The article MUST contain at least 800 words of substantial content.
   - Include detailed explanations, examples, and context to reach this length.
   - Break down topics into multiple detailed paragraphs.
   - Add relevant background information and comparisons.
2. **SEO Headline:** 50-65 characters, keyword first, compelling
3. **Meta Description:** 150-160 characters, includes main keyword and CTA
4. **Content Blocks:** Use proper HTML formatting with paragraphs, headings (h2, h3), and lists
5. **Quick Facts:** Extract 5 key facts readers need to know immediately
6. **Pro Tips:** Provide 5 practical insider tips
7. **FAQs:** Generate 5 relevant frequently asked questions with answers
8. **Target Audience:** Consider families, couples, solo travelers, and business travelers

═══════════════════════════════════════════════════
WRITING GUIDELINES
═══════════════════════════════════════════════════

- Write in second person ("you") to engage readers directly
- Include specific details: prices, times, locations, names
- Avoid generic statements; be specific and actionable
- Use sensory language where appropriate
- Include practical tips that save time or money
- Maintain a balance between informative and engaging
- Always attribute sources when relevant
- End with a clear call to action`;
}

export function determineContentCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  
  const categoryKeywords: Record<string, string[]> = {
    attractions: ['attraction', 'museum', 'theme park', 'landmark', 'monument', 'zoo', 'aquarium', 'beach', 'tour', 'visit', 'explore'],
    hotels: ['hotel', 'resort', 'stay', 'accommodation', 'room', 'suite', 'luxury hotel', 'boutique hotel', 'villa', 'apartment'],
    food: ['restaurant', 'dining', 'food', 'cuisine', 'chef', 'menu', 'cafe', 'bar', 'brunch', 'dinner', 'lunch', 'eat'],
    transport: ['metro', 'bus', 'taxi', 'airport', 'flight', 'train', 'tram', 'transport', 'driving', 'parking', 'visa'],
    events: ['event', 'festival', 'concert', 'show', 'exhibition', 'celebration', 'performance', 'expo', 'fair'],
    tips: ['tips', 'guide', 'how to', 'best way', 'advice', 'things to know', 'must know', 'essential'],
    news: ['opens', 'announces', 'launches', 'new', 'update', 'change', 'regulation', 'law', 'rule'],
    shopping: ['mall', 'shopping', 'store', 'market', 'souk', 'buy', 'sale', 'discount', 'deal', 'outlet']
  };
  
  let bestMatch = 'news';
  let maxScore = 0;
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    const score = keywords.filter(keyword => text.includes(keyword)).length;
    if (score > maxScore) {
      maxScore = score;
      bestMatch = category;
    }
  }
  
  return bestMatch;
}

export function buildArticleGenerationPrompt(sources: Array<{ title: string; description: string; url: string; date: string }>, category: string, personality: typeof CONTENT_WRITER_PERSONALITIES[keyof typeof CONTENT_WRITER_PERSONALITIES], structure: typeof ARTICLE_STRUCTURES[keyof typeof ARTICLE_STRUCTURES]): string {
  return `Based on the following ${sources.length} source(s), create a comprehensive travel article for Dubai visitors.

═══════════════════════════════════════════════════
SOURCE MATERIAL
═══════════════════════════════════════════════════

${sources.map((s, i) => `[Source ${i + 1}]
Title: ${s.title}
Description: ${s.description}
URL: ${s.url}
Date: ${s.date}`).join('\n\n')}

═══════════════════════════════════════════════════
YOUR TASK
═══════════════════════════════════════════════════

Create a comprehensive, SEO-optimized article following the ${structure.name} structure.
Use the ${personality.name} writing personality throughout.

Respond in JSON format with the following structure (ALL FIELDS ARE REQUIRED):
{
  "title": "SEO-optimized headline (50-65 chars, keyword first)",
  "metaDescription": "Compelling meta description (150-160 chars, includes keyword and CTA)",
  "category": "${category}",
  "urgencyLevel": "urgent" OR "relevant" OR "evergreen",
  "targetAudience": ["families", "couples", "solo travelers", "business travelers"],
  "content": "COMPREHENSIVE article in HTML format. MINIMUM 800 words. Use <h2>, <h3>, <p>, <ul>, <li> tags. Include introduction, multiple detailed sections, practical info, and conclusion.",
  "quickFacts": ["Fact 1", "Fact 2", "Fact 3", "Fact 4", "Fact 5", "Fact 6", "Fact 7"],
  "proTips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5", "Tip 6", "Tip 7"],
  "warnings": ["Warning 1 if applicable"],
  "faqs": [
    {"question": "Detailed question 1 (20+ chars)?", "answer": "Comprehensive answer 1 (50+ chars)"},
    {"question": "Detailed question 2?", "answer": "Comprehensive answer 2"},
    {"question": "Detailed question 3?", "answer": "Comprehensive answer 3"},
    {"question": "Detailed question 4?", "answer": "Comprehensive answer 4"},
    {"question": "Detailed question 5?", "answer": "Comprehensive answer 5"}
  ],
  "sources": ["Source 1 name", "Source 2 name"],
  "primaryKeyword": "main SEO keyword",
  "secondaryKeywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"],
  "imageSearchTerms": ["Dubai + topic keyword", "relevant visual term", "location/attraction name"]
}

MANDATORY REQUIREMENTS - YOUR RESPONSE WILL BE REJECTED IF:
- content has less than 800 words (aim for 1000-1500)
- quickFacts has fewer than 5 items
- proTips has fewer than 5 items
- faqs has fewer than 5 items
- imageSearchTerms is missing or has fewer than 3 terms

IMPORTANT GUIDELINES:
- Merge all unique information from all sources
- Do not copy verbatim; rewrite in your personality's voice
- Include specific details: prices, times, locations
- Make it actionable and helpful for travelers
- Ensure the content flows naturally following the ${structure.name} structure

CRITICAL WORD COUNT REQUIREMENT:
- Your article MUST be at least 800 words. This is mandatory.
- Target 1000-1500 words for best quality.
- If the source material is brief, expand with relevant context, background info, travel tips, and related attractions.
- Include introductions, transitions, and conclusions to reach the minimum length.`;
}
