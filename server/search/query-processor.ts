/**
 * Query Processor
 * 
 * Analyzes and enhances search queries:
 * - Language detection
 * - Query normalization
 * - Intent classification
 * - Tokenization
 */

export interface ProcessedQuery {
  original: string;
  normalized: string; // lowercase, trimmed, normalized unicode
  language: string; // detected language code
  tokens: string[];
  intent?: "hotel" | "attraction" | "restaurant" | "guide" | "general";
  entities?: {
    locations?: string[];
    priceRange?: { min?: number; max?: number };
    dates?: string[];
  };
}

// Language detection patterns (basic implementation)
const LANGUAGE_PATTERNS = {
  ar: /[\u0600-\u06FF]/,  // Arabic
  he: /[\u0590-\u05FF]/,  // Hebrew
  ru: /[\u0400-\u04FF]/,  // Russian
  zh: /[\u4E00-\u9FFF]/,  // Chinese
  ja: /[\u3040-\u309F\u30A0-\u30FF]/,  // Japanese
  ko: /[\uAC00-\uD7AF]/,  // Korean
};

// Intent classification keywords
const INTENT_KEYWORDS = {
  hotel: ['hotel', 'resort', 'accommodation', 'stay', 'booking', 'room'],
  attraction: ['attraction', 'visit', 'tour', 'see', 'museum', 'park', 'tower', 'building', 'landmark'],
  restaurant: ['restaurant', 'dining', 'food', 'eat', 'cafe', 'cuisine', 'meal'],
  guide: ['guide', 'how to', 'tips', 'advice', 'information', 'help'],
};

/**
 * Detect the primary language of the query
 */
export function detectLanguage(text: string): string {
  if (!text || text.trim().length === 0) return 'en';
  
  // Check for non-Latin scripts
  for (const [lang, pattern] of Object.entries(LANGUAGE_PATTERNS)) {
    if (pattern.test(text)) {
      return lang;
    }
  }
  
  // Default to English for Latin scripts
  return 'en';
}

/**
 * Normalize query string
 * - Lowercase
 * - Trim whitespace
 * - Normalize unicode
 * - Remove extra spaces
 */
export function normalize(query: string): string {
  if (!query) return '';
  
  return query
    .toLowerCase()
    .normalize('NFKD') // Normalize unicode
    .trim()
    .replace(/\s+/g, ' '); // Collapse multiple spaces
}

/**
 * Tokenize query into searchable terms
 * Splits on spaces and removes very short tokens
 */
export function tokenize(query: string): string[] {
  if (!query) return [];
  
  return query
    .split(/\s+/)
    .filter(token => token.length >= 2); // Filter out single characters
}

/**
 * Classify the intent of the query
 */
export function classifyIntent(tokens: string[]): string | undefined {
  if (tokens.length === 0) return undefined;
  
  const queryText = tokens.join(' ');
  
  // Check each intent category
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    for (const keyword of keywords) {
      if (queryText.includes(keyword)) {
        return intent;
      }
    }
  }
  
  return undefined;
}

/**
 * Extract entities from query (basic implementation)
 */
export function extractEntities(tokens: string[]): ProcessedQuery['entities'] {
  const entities: ProcessedQuery['entities'] = {};
  
  // Extract price range patterns (e.g., "under 500", "200-500", "AED 1000")
  const queryText = tokens.join(' ');
  
  // Price patterns with word boundaries
  const priceMatch = queryText.match(/\b(?:aed|usd|eur)?\s*(\d+)(?:\s*-\s*(\d+))?\b/i);
  if (priceMatch) {
    entities.priceRange = {};
    if (priceMatch[1]) {
      entities.priceRange.min = parseInt(priceMatch[1]);
    }
    if (priceMatch[2]) {
      entities.priceRange.max = parseInt(priceMatch[2]);
    }
  }
  
  // Common Dubai locations (simple pattern matching)
  const dubaiLocations = [
    'downtown', 'marina', 'jbr', 'palm jumeirah', 'jumeirah',
    'business bay', 'deira', 'bur dubai', 'creek', 'difc'
  ];
  
  const foundLocations = dubaiLocations.filter(loc => 
    queryText.includes(loc.toLowerCase())
  );
  
  if (foundLocations.length > 0) {
    entities.locations = foundLocations;
  }
  
  return Object.keys(entities).length > 0 ? entities : undefined;
}

/**
 * Main query processing function
 */
export function process(query: string, locale?: string): ProcessedQuery {
  const original = query;
  const normalized = normalize(query);
  const tokens = tokenize(normalized);
  const language = locale || detectLanguage(original);
  const intent = classifyIntent(tokens);
  const entities = extractEntities(tokens);
  
  return {
    original,
    normalized,
    language,
    tokens,
    intent: intent as ProcessedQuery['intent'],
    entities,
  };
}

// Export individual functions
export const queryProcessor = {
  process,
  detectLanguage,
  normalize,
  tokenize,
  classifyIntent,
  extractEntities,
};
