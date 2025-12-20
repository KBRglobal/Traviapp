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

Respond in JSON format with the following structure:
{
  "title": "SEO-optimized headline (50-65 chars, keyword first)",
  "metaDescription": "Compelling meta description (150-160 chars, includes keyword and CTA)",
  "category": "${category}",
  "urgencyLevel": "urgent|relevant|evergreen",
  "targetAudience": ["families", "couples", "solo travelers", "business travelers"],
  "content": "Full article content in HTML format with proper <h2>, <h3>, <p>, <ul>, <li> tags. Target 800-1500 words.",
  "quickFacts": ["Fact 1", "Fact 2", "Fact 3", "Fact 4", "Fact 5"],
  "proTips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"],
  "warnings": ["Warning 1 if applicable"],
  "faqs": [
    {"question": "Question 1?", "answer": "Answer 1"},
    {"question": "Question 2?", "answer": "Answer 2"},
    {"question": "Question 3?", "answer": "Answer 3"},
    {"question": "Question 4?", "answer": "Answer 4"},
    {"question": "Question 5?", "answer": "Answer 5"}
  ],
  "sources": ["Source 1 name", "Source 2 name"],
  "primaryKeyword": "main SEO keyword",
  "secondaryKeywords": ["keyword 1", "keyword 2", "keyword 3"]
}

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
