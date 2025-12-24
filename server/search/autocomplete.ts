/**
 * Autocomplete Engine
 * 
 * Ultra-fast suggestions (< 10ms):
 * - Prefix matching with trigram indexes
 * - Redis caching for performance
 * - Weighted results
 */

import { db } from "../db";
import { cache, CACHE_TTL } from "../cache";
import { like, desc, sql, and, eq } from "drizzle-orm";
import { searchSuggestions, contents, searchIndex, type SearchSuggestion } from "@shared/schema";

export interface Suggestion {
  text: string;
  displayText: string;
  type: "content" | "category" | "location" | "trending" | "recent";
  url?: string;
  icon?: string;
  score: number;
}

export interface AutocompleteOptions {
  locale?: string;
  limit?: number;
  includeRecent?: boolean;
}

/**
 * Get suggestions for a given prefix
 * Uses database with trigram indexes for fast prefix matching
 */
export async function suggest(
  prefix: string,
  options: AutocompleteOptions = {}
): Promise<Suggestion[]> {
  if (!prefix || prefix.length < 2) {
    return [];
  }
  
  const { locale = 'en', limit = 8 } = options;
  const normalizedPrefix = prefix.toLowerCase().trim();
  
  // Try cache first (5 minute TTL for autocomplete)
  const cacheKey = `autocomplete:${normalizedPrefix}:${locale}:${limit}`;
  const cached = await cache.get<Suggestion[]>(cacheKey);
  if (cached) {
    return cached;
  }
  
  try {
    // Query search_suggestions table with prefix matching
    // Using LIKE with % for prefix matching, optimized by trigram index
    const suggestions = await db
      .select({
        id: searchSuggestions.id,
        term: searchSuggestions.term,
        displayText: searchSuggestions.displayText,
        type: searchSuggestions.type,
        targetUrl: searchSuggestions.targetUrl,
        icon: searchSuggestions.icon,
        weight: searchSuggestions.weight,
        searchCount: searchSuggestions.searchCount,
      })
      .from(searchSuggestions)
      .where(
        and(
          sql`${searchSuggestions.term} ILIKE ${normalizedPrefix + '%'}`,
          eq(searchSuggestions.locale, locale)
        )
      )
      .orderBy(desc(searchSuggestions.weight), desc(searchSuggestions.searchCount))
      .limit(limit);
    
    // Transform to Suggestion format
    const results: Suggestion[] = suggestions.map(s => ({
      text: s.term,
      displayText: s.displayText,
      type: s.type as Suggestion['type'],
      url: s.targetUrl || undefined,
      icon: s.icon || undefined,
      score: (s.weight || 0) + (s.searchCount || 0) * 0.1,
    }));
    
    // Cache results
    await cache.set(cacheKey, results, CACHE_TTL.short);
    
    return results;
  } catch (error) {
    console.error('[Autocomplete] Error fetching suggestions:', error);
    return [];
  }
}

/**
 * Rebuild autocomplete index from content
 * Generates suggestions from all published content
 */
export async function rebuildIndex(): Promise<void> {
  console.log('[Autocomplete] Rebuilding autocomplete index...');
  
  try {
    // Get all search index entries
    const indexEntries = await db
      .select({
        contentId: searchIndex.contentId,
        title: searchIndex.title,
        contentType: searchIndex.contentType,
        searchTerms: searchIndex.searchTerms,
        popularity: searchIndex.popularity,
      })
      .from(searchIndex);
    
    console.log(`[Autocomplete] Processing ${indexEntries.length} content items...`);
    
    // Generate suggestions from content
    for (const entry of indexEntries) {
      // Add main title as suggestion
      await addTerm(entry.title.toLowerCase(), {
        displayText: entry.title,
        type: 'content',
        url: getContentUrl(entry.contentType, entry.contentId),
        icon: getTypeIcon(entry.contentType),
        score: entry.popularity || 0,
      });
      
      // Add search terms
      if (entry.searchTerms && Array.isArray(entry.searchTerms)) {
        for (const term of entry.searchTerms) {
          if (term.length >= 3) {
            await addTerm(term, {
              displayText: term,
              type: 'content',
              url: getContentUrl(entry.contentType, entry.contentId),
              score: Math.floor((entry.popularity || 0) * 0.5),
            });
          }
        }
      }
    }
    
    // Add category suggestions
    const categories = [
      { term: 'hotels', displayText: 'Hotels', type: 'category', url: '/hotels', icon: '🏨', score: 100 },
      { term: 'attractions', displayText: 'Attractions', type: 'category', url: '/attractions', icon: '🎢', score: 100 },
      { term: 'dining', displayText: 'Dining', type: 'category', url: '/dining', icon: '🍽️', score: 100 },
      { term: 'districts', displayText: 'Districts', type: 'category', url: '/districts', icon: '🏙️', score: 100 },
      { term: 'articles', displayText: 'Articles', type: 'category', url: '/articles', icon: '📰', score: 100 },
    ];
    
    for (const cat of categories) {
      await addTerm(cat.term, cat);
    }
    
    // Add popular location suggestions
    const locations = [
      'Downtown Dubai', 'Dubai Marina', 'Palm Jumeirah', 'Burj Khalifa',
      'Dubai Mall', 'Business Bay', 'JBR', 'Jumeirah Beach'
    ];
    
    for (const loc of locations) {
      await addTerm(loc.toLowerCase(), {
        displayText: loc,
        type: 'location',
        icon: '📍',
        score: 50,
      });
    }
    
    console.log('[Autocomplete] Autocomplete index rebuild complete');
  } catch (error) {
    console.error('[Autocomplete] Error rebuilding index:', error);
    throw error;
  }
}

/**
 * Add or update a suggestion term
 */
export async function addTerm(
  term: string,
  metadata: {
    displayText?: string;
    type?: string;
    url?: string;
    icon?: string;
    score?: number;
  }
): Promise<void> {
  try {
    const normalizedTerm = term.toLowerCase().trim();
    
    if (normalizedTerm.length < 2) return;
    
    await db
      .insert(searchSuggestions)
      .values({
        term: normalizedTerm,
        displayText: metadata.displayText || term,
        type: metadata.type || 'content',
        targetUrl: metadata.url,
        icon: metadata.icon,
        weight: metadata.score || 0,
        searchCount: 0,
        locale: 'en',
      })
      .onConflictDoUpdate({
        target: searchSuggestions.term,
        set: {
          displayText: metadata.displayText || term,
          type: metadata.type || 'content',
          targetUrl: metadata.url,
          icon: metadata.icon,
          weight: metadata.score || 0,
        },
      });
  } catch (error) {
    // Ignore conflicts and errors in bulk operations
    console.debug('[Autocomplete] Error adding term:', term, error);
  }
}

/**
 * Increment search count for a term (for popularity ranking)
 */
export async function incrementCount(term: string): Promise<void> {
  try {
    const normalizedTerm = term.toLowerCase().trim();
    
    await db
      .update(searchSuggestions)
      .set({
        searchCount: sql`${searchSuggestions.searchCount} + 1`,
      })
      .where(eq(searchSuggestions.term, normalizedTerm));
  } catch (error) {
    console.error('[Autocomplete] Error incrementing count:', error);
  }
}

/**
 * Get content URL based on type
 */
function getContentUrl(type: string, id: string): string {
  switch (type) {
    case 'hotel':
      return `/hotels/${id}`;
    case 'attraction':
      return `/attractions/${id}`;
    case 'article':
      return `/articles/${id}`;
    case 'dining':
      return `/dining/${id}`;
    case 'district':
      return `/districts/${id}`;
    case 'transport':
      return `/transport/${id}`;
    default:
      return `/${type}s/${id}`;
  }
}

/**
 * Get icon for content type
 */
function getTypeIcon(type: string): string {
  switch (type) {
    case 'hotel':
      return '🏨';
    case 'attraction':
      return '🎢';
    case 'article':
      return '📰';
    case 'dining':
      return '🍽️';
    case 'district':
      return '🏙️';
    case 'transport':
      return '🚇';
    default:
      return '📄';
  }
}

// Export as object
export const autocomplete = {
  suggest,
  rebuildIndex,
  addTerm,
  incrementCount,
};
