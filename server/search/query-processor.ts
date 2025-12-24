/**
 * Query Processor
 * 
 * Normalizes and processes search queries
 * - Language detection
 * - Query normalization
 * - Stop word removal
 */

export interface ProcessedQuery {
  original: string;
  normalized: string;
  language: string;
  tokens: string[];
}

// Common stop words to remove (English)
const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "up", "about", "into", "through", "during",
  "is", "are", "was", "were", "be", "been", "being", "have", "has", "had",
  "do", "does", "did", "will", "would", "could", "should", "may", "might",
  "can", "this", "that", "these", "those", "i", "you", "he", "she", "it",
  "we", "they", "what", "which", "who", "when", "where", "why", "how",
]);

export const queryProcessor = {
  /**
   * Process and normalize a search query
   */
  process(query: string, locale?: string): ProcessedQuery {
    const original = query;
    
    // Detect language
    const language = locale || this.detectLanguage(query);
    
    // Normalize query
    let normalized = query.toLowerCase().trim();
    
    // Remove extra whitespace
    normalized = normalized.replace(/\s+/g, " ");
    
    // Remove special characters but keep letters, numbers, spaces, and unicode
    // Keep Arabic, Hebrew, and other non-Latin scripts
    normalized = normalized.replace(/[^\w\s\u0600-\u06FF\u0590-\u05FF-]/g, " ");
    
    // Remove stop words (only for English)
    if (language === "en") {
      normalized = this.removeStopWords(normalized);
    }
    
    // Tokenize
    const tokens = normalized.split(/\s+/).filter(Boolean);
    
    return {
      original,
      normalized: tokens.join(" "),
      language,
      tokens,
    };
  },

  /**
   * Detect language from query
   */
  detectLanguage(query: string): string {
    // Hebrew characters
    if (/[\u0590-\u05FF]/.test(query)) {
      return "he";
    }
    
    // Arabic characters
    if (/[\u0600-\u06FF]/.test(query)) {
      return "ar";
    }
    
    // Default to English
    return "en";
  },

  /**
   * Remove stop words from query
   */
  removeStopWords(query: string): string {
    const words = query.split(/\s+/);
    const filtered = words.filter(word => !STOP_WORDS.has(word));
    return filtered.join(" ");
  },

  /**
   * Extract key terms from query
   */
  extractKeyTerms(query: string): string[] {
    const processed = this.process(query);
    return processed.tokens;
  },
};
