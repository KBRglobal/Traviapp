/**
 * Query Rewriter
 * 
 * Improves queries for better search results:
 * - Combines spell check + synonyms
 * - Handles special patterns
 * - Normalizes queries
 */

import { spellChecker } from "./spell-checker";
import { synonyms } from "./synonyms";
import { queryProcessor } from "./query-processor";

export interface RewrittenQuery {
  original: string;
  rewritten: string;
  expanded: string[];
  spellCorrected: boolean;
  didYouMean?: string;
  language: string;
  transformations: string[];
}

export const queryRewriter = {
  /**
   * Fully rewrite and optimize a query
   */
  async rewrite(query: string, locale?: string): Promise<RewrittenQuery> {
    const transformations: string[] = [];
    let current = query.trim();

    // 1. Process and normalize
    const processed = queryProcessor.process(current, locale);
    current = processed.normalized;
    transformations.push("normalized");

    // 2. Spell check
    const spellResult = await spellChecker.check(current);
    const spellCorrected = spellResult.wasChanged;
    if (spellCorrected) {
      transformations.push("spell_corrected");
    }
    current = spellResult.corrected;

    // 3. Handle special patterns
    current = this.handlePatterns(current);
    if (current !== spellResult.corrected) {
      transformations.push("pattern_matched");
    }

    // 4. Expand with synonyms
    const expansion = synonyms.expand(current, processed.language);
    transformations.push("expanded");

    return {
      original: query,
      rewritten: current,
      expanded: expansion.expanded,
      spellCorrected,
      didYouMean: spellCorrected ? spellResult.corrected : undefined,
      language: processed.language,
      transformations,
    };
  },

  /**
   * Handle special query patterns
   */
  handlePatterns(query: string): string {
    let result = query;

    // "X near Y" → search for X in location Y
    result = result.replace(/(.+?)\s+near\s+(.+)/i, "$1 $2");
    
    // "best X in dubai" → just search for X (Dubai is implied)
    result = result.replace(/best\s+(.+?)\s+in\s+dubai/i, "$1");
    
    // "top 10 X" → just X
    result = result.replace(/top\s+\d+\s+/i, "");
    
    // Remove common filler words during pattern matching
    // Note: This is intentionally separate from query-processor stop word removal
    // as it handles pattern-specific simplification
    result = result.replace(/\b(the|a|an|in|at|on|for|to|of)\b/gi, " ");
    
    // Normalize whitespace
    result = result.replace(/\s+/g, " ").trim();

    return result;
  },

  /**
   * Generate alternative queries for "Also try" suggestions
   */
  async generateAlternatives(query: string, limit: number = 3): Promise<string[]> {
    const alternatives: string[] = [];

    // Get spell check alternatives
    const spellSuggestions = await spellChecker.getSuggestions(query, 2);
    alternatives.push(...spellSuggestions);

    // Get related terms
    const words = query.split(/\s+/);
    for (const word of words) {
      const related = synonyms.getRelatedTerms(word, 2);
      for (const relatedTerm of related) {
        const altQuery = query.replace(word, relatedTerm);
        if (!alternatives.includes(altQuery)) {
          alternatives.push(altQuery);
        }
        if (alternatives.length >= limit) break;
      }
      if (alternatives.length >= limit) break;
    }

    return alternatives.slice(0, limit);
  },
};
