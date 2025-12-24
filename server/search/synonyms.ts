/**
 * Synonym Expansion
 * 
 * Expands queries with related terms for better recall
 * Multi-language: English, Hebrew, Arabic
 */

export interface SynonymExpansion {
  original: string;
  expanded: string[];
  language: string;
}

// Configuration
const MAX_SYNONYM_EXPANSION = 10; // Maximum additional synonym terms to include

// Synonym groups - words that mean the same thing
const SYNONYM_GROUPS: string[][] = [
  // Accommodation
  ["hotel", "resort", "accommodation", "stay", "lodging", "inn"],
  ["cheap", "budget", "affordable", "inexpensive", "low-cost", "economical"],
  ["luxury", "premium", "upscale", "high-end", "5-star", "five star", "deluxe"],
  
  // Food & Dining
  ["restaurant", "dining", "eatery", "cafe", "bistro", "food"],
  ["breakfast", "brunch", "morning meal"],
  ["dinner", "supper", "evening meal"],
  
  // Activities
  ["tour", "excursion", "trip", "outing", "expedition"],
  ["adventure", "thrill", "excitement", "experience"],
  ["relaxation", "spa", "wellness", "peaceful", "calm"],
  
  // Location terms
  ["near", "nearby", "close to", "around", "in the area of"],
  ["beach", "shore", "coast", "waterfront", "seaside"],
  ["downtown", "city center", "central", "urban"],
  
  // Descriptors
  ["beautiful", "stunning", "gorgeous", "amazing", "spectacular"],
  ["popular", "famous", "well-known", "renowned", "top"],
  ["family", "kids", "children", "family-friendly"],
  ["romantic", "couples", "honeymoon", "intimate"],
  
  // Hebrew synonyms
  ["מלון", "אכסניה", "לינה", "מקום לישון"],
  ["מסעדה", "בית אוכל", "אוכל", "לאכול"],
  ["זול", "במחיר נמוך", "לא יקר", "תקציבי"],
  ["יוקרה", "יוקרתי", "פאר", "מפואר"],
  
  // Arabic synonyms
  ["فندق", "منتجع", "إقامة", "سكن"],
  ["مطعم", "مأكولات", "طعام"],
  ["رخيص", "اقتصادي", "بأسعار معقولة"],
  ["فاخر", "راقي", "خمس نجوم"],
];

// Term expansions - one term expands to related terms
const TERM_EXPANSIONS: Record<string, string[]> = {
  // Activities expand to related content
  "shopping": ["mall", "souq", "market", "boutique", "outlet"],
  "nightlife": ["club", "bar", "lounge", "entertainment", "party"],
  "culture": ["museum", "heritage", "history", "art", "tradition"],
  "nature": ["park", "garden", "wildlife", "desert", "beach"],
  
  // Food types expand
  "arabic food": ["lebanese", "emirati", "middle eastern", "shawarma", "hummus"],
  "asian food": ["japanese", "chinese", "thai", "indian", "sushi"],
  "seafood": ["fish", "shrimp", "lobster", "crab", "oyster"],
  
  // Location shortcuts
  "marina": ["dubai marina", "marina walk", "marina mall"],
  "palm": ["palm jumeirah", "atlantis", "the palm"],
  "downtown": ["downtown dubai", "burj khalifa", "dubai mall", "dubai fountain"],
  
  // Hebrew expansions
  "קניות": ["קניון", "שוק", "חנויות"],
  "חוף": ["ים", "שחייה", "שיזוף"],
  
  // Arabic expansions
  "تسوق": ["مول", "سوق", "متاجر"],
  "شاطئ": ["بحر", "سباحة"],
};

export const synonyms = {
  /**
   * Expand query with synonyms
   */
  expand(query: string, language: string = "en"): SynonymExpansion {
    const words = query.toLowerCase().trim().split(/\s+/);
    const expandedTerms = new Set<string>();
    
    // Add original words
    words.forEach(w => expandedTerms.add(w));

    // Find synonyms for each word
    for (const word of words) {
      // Check synonym groups
      for (const group of SYNONYM_GROUPS) {
        if (group.some(syn => syn.toLowerCase() === word)) {
          // Add all synonyms from the group
          group.forEach(syn => expandedTerms.add(syn.toLowerCase()));
          break;
        }
      }

      // Check term expansions
      if (TERM_EXPANSIONS[word]) {
        TERM_EXPANSIONS[word].forEach(term => expandedTerms.add(term.toLowerCase()));
      }
    }

    // Check multi-word phrases
    const queryLower = query.toLowerCase();
    for (const [phrase, expansions] of Object.entries(TERM_EXPANSIONS)) {
      if (queryLower.includes(phrase)) {
        expansions.forEach(term => expandedTerms.add(term.toLowerCase()));
      }
    }

    return {
      original: query,
      expanded: [...expandedTerms],
      language,
    };
  },

  /**
   * Get related search terms
   */
  getRelatedTerms(term: string, limit: number = 5): string[] {
    const termLower = term.toLowerCase();
    const related: string[] = [];

    // Check synonym groups
    for (const group of SYNONYM_GROUPS) {
      if (group.some(syn => syn.toLowerCase().includes(termLower))) {
        related.push(...group.filter(s => s.toLowerCase() !== termLower));
        if (related.length >= limit) break;
      }
    }

    // Check term expansions
    if (TERM_EXPANSIONS[termLower]) {
      related.push(...TERM_EXPANSIONS[termLower]);
    }

    return [...new Set(related)].slice(0, limit);
  },

  /**
   * Build expanded search query for full-text search
   */
  buildExpandedQuery(query: string): string {
    const expansion = this.expand(query);
    
    // Build OR query for PostgreSQL full-text search
    // Original terms get higher weight
    const originalTerms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const additionalTerms = expansion.expanded.filter(t => !originalTerms.includes(t));

    // Weight original terms higher with :A, synonyms with :B
    const weightedTerms = [
      ...originalTerms.map(t => `${t}:A`),
      ...additionalTerms.slice(0, MAX_SYNONYM_EXPANSION).map(t => `${t}:B`), // Limit expansion
    ];

    return weightedTerms.join(" | ");
  },
};
