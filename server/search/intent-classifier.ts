/**
 * Intent Classifier
 * 
 * Understands what the user is looking for
 * Multi-language support: English, Hebrew, Arabic
 */

export type IntentType = 
  | "hotel_search"
  | "restaurant_search"
  | "attraction_search"
  | "activity_search"
  | "guide_search"
  | "price_comparison"
  | "location_based"
  | "general";

export interface ExtractedEntities {
  locations?: string[];
  priceRange?: { min?: number; max?: number; currency?: string };
  dates?: { start?: string; end?: string };
  amenities?: string[];
  cuisineTypes?: string[];
  rating?: number;
  groupSize?: number;
  occasion?: string; // "romantic", "business", "family"
}

export interface Intent {
  primary: IntentType;
  confidence: number;
  entities: ExtractedEntities;
  suggestedFilters: {
    contentTypes?: string[];
    priceRange?: [number, number];
    rating?: number;
    location?: string;
  };
}

// Multi-language intent patterns
const INTENT_PATTERNS: Record<IntentType, RegExp[]> = {
  hotel_search: [
    /\b(hotel|hotels|stay|accommodation|resort|hostel|lodge|inn)\b/i,
    /\b(מלון|מלונות|לינה|אכסניה)\b/i,
    /\b(فندق|فنادق|إقامة|منتجع)\b/i,
    /where.*(stay|sleep)|איפה.*(לישון|ללון)|أين.*(أقيم|أنام)/i,
  ],
  restaurant_search: [
    /\b(restaurant|restaurants|food|dining|eat|cuisine|cafe|bistro)\b/i,
    /\b(מסעדה|מסעדות|אוכל|לאכול|בית קפה)\b/i,
    /\b(مطعم|مطاعم|طعام|أكل|مقهى)\b/i,
    /where.*(eat|dine)|איפה.*לאכול|أين.*آكل/i,
  ],
  attraction_search: [
    /\b(attraction|attractions|visit|see|tour|museum|park|landmark)\b/i,
    /\b(אטרקציה|אטרקציות|לבקר|מוזיאון|פארק)\b/i,
    /\b(معلم|معالم|زيارة|متحف|حديقة)\b/i,
    /things.*(do|see)|מה.*(לעשות|לראות)|ماذا.*(أفعل|أرى)/i,
  ],
  activity_search: [
    /\b(activity|activities|adventure|experience|safari|cruise|tour)\b/i,
    /\b(פעילות|פעילויות|הרפתקה|ספארי|שייט)\b/i,
    /\b(نشاط|أنشطة|مغامرة|سفاري|رحلة)\b/i,
  ],
  guide_search: [
    /\b(guide|guides|tips|advice|how.to|itinerary|plan)\b/i,
    /\b(מדריך|טיפים|עצות|איך|תכנון)\b/i,
    /\b(دليل|نصائح|كيف|تخطيط)\b/i,
  ],
  price_comparison: [
    /\b(cheap|cheapest|budget|affordable|price|cost|compare|deal)\b/i,
    /\b(זול|זולים|תקציב|מחיר|עלות|השוואה)\b/i,
    /\b(رخيص|ميزانية|سعر|تكلفة|مقارنة)\b/i,
    /best.*(value|deal)|שווה.*כסף|أفضل.*قيمة/i,
  ],
  location_based: [
    /\b(near|nearby|around|close.to|in|at|area|district|neighborhood)\b/i,
    /\b(ליד|קרוב|באזור|בשכונה)\b/i,
    /\b(قريب|بالقرب|في منطقة|في حي)\b/i,
  ],
  general: [],
};

// Dubai locations for entity extraction
const DUBAI_LOCATIONS = [
  "dubai marina", "palm jumeirah", "downtown dubai", "burj khalifa",
  "jbr", "jumeirah beach", "deira", "bur dubai", "business bay", "difc",
  "jumeirah", "al barsha", "dubai mall", "dubai creek", "festival city",
  "silicon oasis", "motor city", "sports city", "arabian ranches",
  "dubai hills", "city walk", "la mer", "bluewaters", "ain dubai",
  // Hebrew
  "דובאי מרינה", "פאלם ג'ומיירה", "בורג' חליפה",
  // Arabic  
  "دبي مارينا", "نخلة جميرا", "برج خليفة",
];

// Occasion patterns
const OCCASION_PATTERNS: Record<string, RegExp> = {
  romantic: /(romantic|רומנטי|رومانسي|date.night|anniversary|honeymoon)/i,
  family: /(family|families|kids|children|משפחה|משפחתי|ילדים|عائلة|عائلي|أطفال)/i,
  business: /(business|corporate|meeting|conference|עסקי|פגישה|تجاري|اجتماع)/i,
  luxury: /(luxury|luxurious|premium|vip|exclusive|יוקרה|יוקרתי|فاخر|حصري)/i,
  budget: /(budget|cheap|affordable|backpacker|תקציבי|זול|ميزانية|رخيص)/i,
};

export const intentClassifier = {
  /**
   * Classify query intent with entity extraction
   */
  classify(query: string, locale?: string): Intent {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Find best matching intent
    let bestIntent: IntentType = "general";
    let bestConfidence = 0.4; // Base confidence for general

    for (const [intentName, patterns] of Object.entries(INTENT_PATTERNS)) {
      if (intentName === "general") continue;
      
      for (const pattern of patterns) {
        if (pattern.test(normalizedQuery)) {
          const confidence = 0.75 + (patterns.indexOf(pattern) === 0 ? 0.15 : 0.05);
          if (confidence > bestConfidence) {
            bestIntent = intentName as IntentType;
            bestConfidence = confidence;
          }
        }
      }
    }

    // Extract entities
    const entities = this.extractEntities(normalizedQuery);

    // If entities found, boost confidence
    if (Object.keys(entities).length > 0) {
      bestConfidence = Math.min(bestConfidence + 0.1, 1);
    }

    // Suggest filters based on intent
    const suggestedFilters = this.buildFilters(bestIntent, entities);

    return {
      primary: bestIntent,
      confidence: bestConfidence,
      entities,
      suggestedFilters,
    };
  },

  /**
   * Extract entities from query
   */
  extractEntities(query: string): ExtractedEntities {
    const entities: ExtractedEntities = {};

    // Extract locations
    const foundLocations = DUBAI_LOCATIONS.filter(loc => 
      query.toLowerCase().includes(loc.toLowerCase())
    );
    if (foundLocations.length > 0) {
      entities.locations = foundLocations;
    }

    // Extract price indicators
    const priceMatch = query.match(/(?:under|below|less than|up to|עד|أقل من|حتى)\s*(?:AED|aed|₪|\$|درهم)?\s*(\d+)/i);
    if (priceMatch) {
      entities.priceRange = { max: parseInt(priceMatch[1]), currency: "AED" };
    }
    const priceFromMatch = query.match(/(?:from|starting|minimum|מ-|من)\s*(?:AED|aed|₪|\$|درهم)?\s*(\d+)/i);
    if (priceFromMatch) {
      entities.priceRange = { ...entities.priceRange, min: parseInt(priceFromMatch[1]) };
    }

    // Extract rating
    const ratingMatch = query.match(/(\d+(?:\.\d+)?)\s*(?:star|stars|כוכבים|نجوم|\+)/i);
    if (ratingMatch) {
      entities.rating = parseFloat(ratingMatch[1]);
    }

    // Extract occasion
    for (const [occasion, pattern] of Object.entries(OCCASION_PATTERNS)) {
      if (pattern.test(query)) {
        entities.occasion = occasion;
        break;
      }
    }

    // Extract group size
    const groupMatch = query.match(/(?:for|ל|لـ)\s*(\d+)\s*(?:people|persons|guests|אנשים|أشخاص)/i);
    if (groupMatch) {
      entities.groupSize = parseInt(groupMatch[1]);
    }

    return entities;
  },

  /**
   * Build filter suggestions from intent and entities
   */
  buildFilters(intent: IntentType, entities: ExtractedEntities): Intent["suggestedFilters"] {
    const filters: Intent["suggestedFilters"] = {};

    // Map intent to content types
    const typeMap: Record<IntentType, string[] | undefined> = {
      hotel_search: ["hotel"],
      restaurant_search: ["dining", "restaurant"],
      attraction_search: ["attraction"],
      activity_search: ["attraction", "event"],
      guide_search: ["article", "itinerary"],
      price_comparison: undefined,
      location_based: undefined,
      general: undefined,
    };

    filters.contentTypes = typeMap[intent];

    if (entities.priceRange) {
      filters.priceRange = [
        entities.priceRange.min || 0,
        entities.priceRange.max || 10000,
      ];
    }

    if (entities.rating) {
      filters.rating = entities.rating;
    }

    if (entities.locations?.[0]) {
      filters.location = entities.locations[0];
    }

    return filters;
  },
};
