/**
 * Query Processor
 * 
 * Normalizes and processes search queries for better matching
 */

export interface ProcessedQuery {
  original: string;
  normalized: string;
  tokens: string[];
  language: string;
}

export const queryProcessor = {
  /**
   * Process and normalize a search query
   */
  process(query: string, locale?: string): ProcessedQuery {
    const original = query.trim();
    
    // Basic normalization
    let normalized = original
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ') // Keep letters, numbers, spaces
      .replace(/\s+/g, ' ')
      .trim();

    // Detect language
    const language = this.detectLanguage(original, locale);

    // Tokenize
    const tokens = normalized.split(' ').filter(t => t.length > 0);

    return {
      original,
      normalized,
      tokens,
      language,
    };
  },

  /**
   * Simple language detection
   */
  detectLanguage(text: string, locale?: string): string {
    if (locale) return locale;

    // Hebrew detection
    if (/[\u0590-\u05FF]/.test(text)) return 'he';
    
    // Arabic detection
    if (/[\u0600-\u06FF]/.test(text)) return 'ar';
    
    return 'en';
  },
};
