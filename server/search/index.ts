/**
 * Main Search Orchestrator
 * 
 * Coordinates all search operations:
 * - Query processing
 * - Full-text search with PostgreSQL
 * - Result ranking and fusion
 * - Caching
 */

import { db } from "../db";
import { cache, CACHE_TTL } from "../cache";
import { sql, desc, and, eq, or, ilike } from "drizzle-orm";
import { searchIndex, searchSessions, contents, type Content } from "@shared/schema";
import { queryProcessor } from "./query-processor";

export interface SearchQuery {
  q: string;
  locale?: string;
  type?: string[]; // content types to search
  filters?: SearchFilters;
  page?: number;
  limit?: number;
  userId?: string;
  sessionId?: string;
}

export interface SearchFilters {
  location?: string;
  priceRange?: { min?: number; max?: number };
  category?: string;
}

export interface SearchResult {
  id: string;
  contentId: string;
  title: string;
  snippet: string; // highlighted excerpt
  type: string;
  url: string;
  image?: string;
  score: number;
  highlights: {
    title?: string[];
    content?: string[];
  };
  metadata: {
    rating?: number;
    price?: string;
    location?: string;
  };
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  totalPages: number;
  query: {
    original: string;
    normalized: string;
    language: string;
    intent?: string;
  };
  suggestions?: string[]; // "did you mean?"
  facets?: SearchFacets;
  responseTimeMs: number;
}

export interface SearchFacets {
  types?: { value: string; count: number }[];
  locations?: { value: string; count: number }[];
  categories?: { value: string; count: number }[];
}

/**
 * Main search function
 */
export async function search(query: SearchQuery): Promise<SearchResponse> {
  const startTime = Date.now();
  
  try {
    // Process the query
    const processed = queryProcessor.process(query.q, query.locale);
    
    // Check cache
    const cacheKey = `search:${processed.normalized}:${query.locale}:${query.page || 1}:${JSON.stringify(query.type || [])}`;
    const cached = await cache.get<SearchResponse>(cacheKey);
    if (cached) {
      return { ...cached, responseTimeMs: Date.now() - startTime };
    }
    
    // Build search conditions
    const page = query.page || 1;
    const limit = query.limit || 20;
    const offset = (page - 1) * limit;
    
    // Perform full-text search using PostgreSQL
    const searchResults = await performFullTextSearch(
      processed.normalized,
      query.type,
      query.filters,
      query.locale,
      limit,
      offset
    );
    
    // Get total count for pagination
    const totalCount = await getSearchCount(
      processed.normalized,
      query.type,
      query.filters,
      query.locale
    );
    
    // Transform results
    const results = await transformResults(searchResults, processed.tokens);
    
    // Calculate facets
    const facets = await calculateFacets(processed.normalized, query.locale);
    
    // Build response
    const response: SearchResponse = {
      results,
      total: totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit),
      query: {
        original: processed.original,
        normalized: processed.normalized,
        language: processed.language,
        intent: processed.intent,
      },
      facets,
      responseTimeMs: Date.now() - startTime,
    };
    
    // Cache results (1 minute TTL)
    await cache.set(cacheKey, response, CACHE_TTL.short);
    
    // Track search session
    await trackSearchSession(query, response, startTime);
    
    return response;
  } catch (error) {
    console.error('[Search] Error performing search:', error);
    throw error;
  }
}

/**
 * Perform full-text search using PostgreSQL tsvector
 */
async function performFullTextSearch(
  normalizedQuery: string,
  types?: string[],
  filters?: SearchFilters,
  locale?: string,
  limit: number = 20,
  offset: number = 0
): Promise<any[]> {
  // Build WHERE conditions
  const conditions = [];
  
  // Add type filter
  if (types && types.length > 0) {
    conditions.push(sql`${searchIndex.contentType} = ANY(${types})`);
  }
  
  // Add locale filter
  if (locale) {
    conditions.push(eq(searchIndex.locale, locale));
  }
  
  // Add location filter
  if (filters?.location) {
    conditions.push(sql`${filters.location} = ANY(${searchIndex.locations})`);
  }
  
  // Add category filter
  if (filters?.category) {
    conditions.push(sql`${filters.category} = ANY(${searchIndex.categories})`);
  }
  
  // Build search query using tsvector
  // Using ts_rank for relevancy scoring
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  
  // Search in title and content with ranking
  const results = await db
    .select({
      id: searchIndex.id,
      contentId: searchIndex.contentId,
      title: searchIndex.title,
      content: searchIndex.content,
      metaDescription: searchIndex.metaDescription,
      contentType: searchIndex.contentType,
      locations: searchIndex.locations,
      prices: searchIndex.prices,
      categories: searchIndex.categories,
      popularity: searchIndex.popularity,
      quality: searchIndex.quality,
      // Calculate relevance score
      rank: sql<number>`
        (ts_rank(to_tsvector('english', ${searchIndex.title}), plainto_tsquery('english', ${normalizedQuery})) * 2.0) +
        ts_rank(to_tsvector('english', COALESCE(${searchIndex.content}, '')), plainto_tsquery('english', ${normalizedQuery})) +
        (${searchIndex.popularity} * 0.001) +
        (${searchIndex.quality} * 0.01)
      `,
    })
    .from(searchIndex)
    .where(
      and(
        whereClause,
        or(
          sql`to_tsvector('english', ${searchIndex.title}) @@ plainto_tsquery('english', ${normalizedQuery})`,
          sql`to_tsvector('english', COALESCE(${searchIndex.content}, '')) @@ plainto_tsquery('english', ${normalizedQuery})`,
          ilike(searchIndex.title, `%${normalizedQuery}%`)
        )
      )
    )
    .orderBy(desc(sql`rank`))
    .limit(limit)
    .offset(offset);
  
  return results;
}

/**
 * Get total count of search results
 */
async function getSearchCount(
  normalizedQuery: string,
  types?: string[],
  filters?: SearchFilters,
  locale?: string
): Promise<number> {
  const conditions = [];
  
  if (types && types.length > 0) {
    conditions.push(sql`${searchIndex.contentType} = ANY(${types})`);
  }
  
  if (locale) {
    conditions.push(eq(searchIndex.locale, locale));
  }
  
  if (filters?.location) {
    conditions.push(sql`${filters.location} = ANY(${searchIndex.locations})`);
  }
  
  if (filters?.category) {
    conditions.push(sql`${filters.category} = ANY(${searchIndex.categories})`);
  }
  
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  
  const [result] = await db
    .select({ count: sql<number>`count(*)` })
    .from(searchIndex)
    .where(
      and(
        whereClause,
        or(
          sql`to_tsvector('english', ${searchIndex.title}) @@ plainto_tsquery('english', ${normalizedQuery})`,
          sql`to_tsvector('english', COALESCE(${searchIndex.content}, '')) @@ plainto_tsquery('english', ${normalizedQuery})`,
          ilike(searchIndex.title, `%${normalizedQuery}%`)
        )
      )
    );
  
  return result?.count || 0;
}

/**
 * Transform search results to SearchResult format
 */
async function transformResults(
  rawResults: any[],
  queryTokens: string[]
): Promise<SearchResult[]> {
  return rawResults.map(r => {
    // Generate snippet with highlighting
    const snippet = generateSnippet(r.content || r.metaDescription || '', queryTokens);
    
    // Generate URL
    const url = getContentUrl(r.contentType, r.contentId);
    
    return {
      id: r.id,
      contentId: r.contentId,
      title: r.title,
      snippet,
      type: r.contentType,
      url,
      score: r.rank || 0,
      highlights: {
        title: highlightMatches(r.title, queryTokens),
        content: highlightMatches(snippet, queryTokens),
      },
      metadata: {
        location: r.locations?.[0],
        price: r.prices?.[0],
      },
    };
  });
}

/**
 * Generate snippet from content with context around query terms
 */
function generateSnippet(text: string, queryTokens: string[], maxLength: number = 200): string {
  if (!text) return '';
  
  // Find first occurrence of any query token
  const lowerText = text.toLowerCase();
  let startPos = 0;
  
  for (const token of queryTokens) {
    const pos = lowerText.indexOf(token.toLowerCase());
    if (pos !== -1 && (startPos === 0 || pos < startPos)) {
      startPos = Math.max(0, pos - 50); // Get context before match
    }
  }
  
  let snippet = text.substring(startPos, startPos + maxLength);
  
  // Add ellipsis if truncated
  if (startPos > 0) snippet = '...' + snippet;
  if (startPos + maxLength < text.length) snippet = snippet + '...';
  
  return snippet.trim();
}

/**
 * Highlight matching terms in text
 */
function highlightMatches(text: string, queryTokens: string[]): string[] {
  const highlights: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const token of queryTokens) {
    const lowerToken = token.toLowerCase();
    let pos = 0;
    while ((pos = lowerText.indexOf(lowerToken, pos)) !== -1) {
      highlights.push(text.substring(pos, pos + token.length));
      pos += token.length;
    }
  }
  
  return highlights;
}

/**
 * Calculate facets for filtering
 */
async function calculateFacets(normalizedQuery: string, locale?: string): Promise<SearchFacets> {
  // Simplified facet calculation - can be expanded
  return {
    types: [],
    locations: [],
    categories: [],
  };
}

/**
 * Get content URL
 */
function getContentUrl(type: string, contentId: string): string {
  switch (type) {
    case 'hotel':
      return `/hotels/${contentId}`;
    case 'attraction':
      return `/attractions/${contentId}`;
    case 'article':
      return `/articles/${contentId}`;
    case 'dining':
      return `/dining/${contentId}`;
    case 'district':
      return `/districts/${contentId}`;
    default:
      return `/${type}s/${contentId}`;
  }
}

/**
 * Track search session for analytics
 */
async function trackSearchSession(
  query: SearchQuery,
  response: SearchResponse,
  startTime: number
): Promise<void> {
  try {
    await db.insert(searchSessions).values({
      sessionId: query.sessionId,
      userId: query.userId,
      query: query.q,
      normalizedQuery: response.query.normalized,
      locale: query.locale,
      resultsCount: response.total,
      filters: query.filters,
      responseTimeMs: Date.now() - startTime,
    });
  } catch (error) {
    console.error('[Search] Error tracking search session:', error);
  }
}

/**
 * Get trending searches
 */
export async function getTrending(locale?: string, limit: number = 10): Promise<string[]> {
  const cacheKey = `trending:${locale || 'en'}:${limit}`;
  const cached = await cache.get<string[]>(cacheKey);
  if (cached) return cached;
  
  try {
    // Get most searched queries from last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const trending = await db
      .select({
        query: searchSessions.query,
        count: sql<number>`count(*)`,
      })
      .from(searchSessions)
      .where(
        and(
          sql`${searchSessions.createdAt} > ${oneDayAgo}`,
          locale ? eq(searchSessions.locale, locale) : undefined
        )
      )
      .groupBy(searchSessions.query)
      .orderBy(desc(sql`count`))
      .limit(limit);
    
    const results = trending.map(t => t.query);
    
    // Cache for 1 hour
    await cache.set(cacheKey, results, CACHE_TTL.long);
    
    return results;
  } catch (error) {
    console.error('[Search] Error getting trending searches:', error);
    return [];
  }
}

// Export as object
export const searchEngine = {
  search,
  getTrending,
};
