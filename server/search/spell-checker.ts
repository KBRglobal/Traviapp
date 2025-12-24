/**
 * Spell Checker & Fuzzy Matcher
 * 
 * Corrects typos and suggests alternatives
 * Uses Levenshtein distance + known terms dictionary
 */

import { db } from "../db";
import { sql } from "drizzle-orm";
import { cache } from "../cache";

export interface SpellCheckResult {
  original: string;
  corrected: string;
  confidence: number;
  alternatives: string[];
  wasChanged: boolean;
}

// Common Dubai-related terms for spell checking
const KNOWN_TERMS = new Set([
  // Landmarks
  "burj khalifa", "burj al arab", "palm jumeirah", "dubai mall",
  "dubai marina", "dubai creek", "dubai frame", "miracle garden",
  "global village", "img worlds", "atlantis", "ain dubai",
  "museum of the future", "expo city", "la mer", "bluewaters",
  "jbr", "jumeirah", "deira", "bur dubai", "downtown",
  
  // Hotels
  "armani", "raffles", "ritz carlton", "four seasons", "waldorf",
  "anantara", "sofitel", "marriott", "hilton", "hyatt",
  
  // Food
  "shawarma", "hummus", "falafel", "mandi", "biryani", "sushi",
  "brunch", "iftar", "suhoor",
  
  // Activities
  "safari", "dhow cruise", "skydiving", "desert", "dune bashing",
  "aquarium", "waterpark", "theme park",
  
  // Hebrew terms
  "מלון", "מסעדה", "אטרקציה", "חוף", "קניון", "מדבר",
  
  // Arabic terms
  "فندق", "مطعم", "شاطئ", "صحراء", "مول",
]);

// Common typos/misspellings mapping
const COMMON_TYPOS: Record<string, string> = {
  "burk": "burj",
  "khlaifa": "khalifa",
  "khalfia": "khalifa",
  "jumeira": "jumeirah",
  "jumaira": "jumeirah",
  "atlants": "atlantis",
  "dubei": "dubai",
  "duabi": "dubai",
  "resturant": "restaurant",
  "restaraunt": "restaurant",
  "hotell": "hotel",
  "beech": "beach",
  "dessert": "desert",
  "malll": "mall",
  "shoping": "shopping",
  "atraction": "attraction",
};

export const spellChecker = {
  /**
   * Check and correct spelling
   */
  async check(query: string): Promise<SpellCheckResult> {
    const words = query.toLowerCase().trim().split(/\s+/);
    const correctedWords: string[] = [];
    let wasChanged = false;
    const alternatives: string[] = [];

    for (const word of words) {
      // Check common typos first
      if (COMMON_TYPOS[word]) {
        correctedWords.push(COMMON_TYPOS[word]);
        wasChanged = true;
        continue;
      }

      // Check if word is known
      if (this.isKnownTerm(word)) {
        correctedWords.push(word);
        continue;
      }

      // Try fuzzy matching
      const fuzzyMatch = await this.findClosestMatch(word);
      if (fuzzyMatch && fuzzyMatch.distance <= 2) {
        correctedWords.push(fuzzyMatch.term);
        if (fuzzyMatch.term !== word) {
          wasChanged = true;
          alternatives.push(word); // Keep original as alternative
        }
      } else {
        correctedWords.push(word);
      }
    }

    const corrected = correctedWords.join(" ");

    return {
      original: query,
      corrected,
      confidence: wasChanged ? 0.8 : 1.0,
      alternatives: wasChanged ? [query, ...alternatives] : [],
      wasChanged,
    };
  },

  /**
   * Check if term is in known dictionary
   */
  isKnownTerm(term: string): boolean {
    return KNOWN_TERMS.has(term.toLowerCase());
  },

  /**
   * Find closest matching term using Levenshtein distance
   */
  async findClosestMatch(word: string): Promise<{ term: string; distance: number } | null> {
    if (word.length < 3) return null;

    // Check cache
    const cacheKey = `spell:${word}`;
    const cached = await cache.get<{ term: string; distance: number }>(cacheKey);
    if (cached) return cached;

    let bestMatch: { term: string; distance: number } | null = null;
    let minDistance = Infinity;

    // Check against known terms
    for (const term of KNOWN_TERMS) {
      const termWords = term.split(" ");
      for (const termWord of termWords) {
        if (Math.abs(termWord.length - word.length) > 3) continue;
        
        const distance = this.levenshteinDistance(word, termWord);
        if (distance < minDistance && distance <= 2) {
          minDistance = distance;
          bestMatch = { term: termWord, distance };
        }
      }
    }

    // Also check against indexed content titles (using trigram similarity)
    try {
      const dbMatches = await db.execute(sql`
        SELECT DISTINCT word, similarity(word, ${word}) as sim
        FROM (
          SELECT unnest(string_to_array(lower(title), ' ')) as word
          FROM content
        ) words
        WHERE length(word) > 2
          AND similarity(word, ${word}) > 0.3
        ORDER BY sim DESC
        LIMIT 3
      `);

      for (const row of dbMatches.rows as any[]) {
        const distance = Math.round((1 - row.sim) * 5);
        if (distance < minDistance) {
          minDistance = distance;
          bestMatch = { term: row.word, distance };
        }
      }
    } catch (error) {
      // pg_trgm might not be enabled, continue with dictionary matching
    }

    if (bestMatch) {
      await cache.set(cacheKey, bestMatch, 3600);
    }

    return bestMatch;
  },

  /**
   * Calculate Levenshtein distance between two strings
   */
  levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }

    return matrix[b.length][a.length];
  },

  /**
   * Get "Did you mean?" suggestions
   */
  async getSuggestions(query: string, limit: number = 3): Promise<string[]> {
    const result = await this.check(query);
    
    if (!result.wasChanged) {
      return [];
    }

    const suggestions = [result.corrected];
    
    // Add alternatives if different
    for (const alt of result.alternatives) {
      if (alt !== result.corrected && suggestions.length < limit) {
        suggestions.push(alt);
      }
    }

    return suggestions;
  },
};
