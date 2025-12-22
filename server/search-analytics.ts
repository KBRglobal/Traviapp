/**
 * Internal Search Analytics
 *
 * Track what people search on the site to:
 * - Identify content gaps
 * - Improve navigation
 * - Understand user intent
 */

import { db } from "./db";
import { sql } from "drizzle-orm";
import { cache } from "./cache";

// ============================================================================
// SCHEMA (would add to main schema)
// ============================================================================

// Using in-memory storage + cache for now
// In production, add to database schema:
// searchQueries table: id, query, results_count, clicked_result_id, timestamp, locale, session_id

interface SearchQuery {
  id: string;
  query: string;
  resultsCount: number;
  clickedResultId?: string;
  timestamp: Date;
  locale: string;
  sessionId?: string;
}

// In-memory store (would be database in production)
const searchStore: SearchQuery[] = [];

// ============================================================================
// SEARCH TRACKING
// ============================================================================

export const searchAnalytics = {
  /**
   * Log a search query
   */
  async logSearch(
    query: string,
    resultsCount: number,
    locale: string = "en",
    sessionId?: string
  ): Promise<string> {
    const id = `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    searchStore.push({
      id,
      query: query.toLowerCase().trim(),
      resultsCount,
      timestamp: new Date(),
      locale,
      sessionId,
    });

    // Keep only last 10000 searches in memory
    if (searchStore.length > 10000) {
      searchStore.splice(0, searchStore.length - 10000);
    }

    // Invalidate analytics cache
    await cache.invalidate("search-analytics:*");

    return id;
  },

  /**
   * Log when user clicks a search result
   */
  async logClick(searchId: string, resultId: string): Promise<void> {
    const search = searchStore.find(s => s.id === searchId);
    if (search) {
      search.clickedResultId = resultId;
    }
  },

  /**
   * Get popular searches
   */
  async getPopularSearches(
    limit: number = 20,
    days: number = 30
  ): Promise<Array<{
    query: string;
    count: number;
    avgResults: number;
    clickRate: number;
  }>> {
    const cacheKey = `search-analytics:popular:${limit}:${days}`;
    const cached = await cache.get<any[]>(cacheKey);
    if (cached) return cached;

    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Group searches by query
    const queryStats = new Map<string, {
      count: number;
      totalResults: number;
      clicks: number;
    }>();

    for (const search of searchStore) {
      if (search.timestamp < cutoff) continue;

      const existing = queryStats.get(search.query);
      if (existing) {
        existing.count++;
        existing.totalResults += search.resultsCount;
        if (search.clickedResultId) existing.clicks++;
      } else {
        queryStats.set(search.query, {
          count: 1,
          totalResults: search.resultsCount,
          clicks: search.clickedResultId ? 1 : 0,
        });
      }
    }

    // Convert to array and sort
    const result = [...queryStats.entries()]
      .map(([query, stats]) => ({
        query,
        count: stats.count,
        avgResults: Math.round(stats.totalResults / stats.count),
        clickRate: Math.round((stats.clicks / stats.count) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    await cache.set(cacheKey, result, 3600);
    return result;
  },

  /**
   * Get zero-result searches (content gaps)
   */
  async getZeroResultSearches(
    limit: number = 50,
    days: number = 30
  ): Promise<Array<{
    query: string;
    count: number;
    lastSearched: Date;
  }>> {
    const cacheKey = `search-analytics:zero-results:${limit}:${days}`;
    const cached = await cache.get<any[]>(cacheKey);
    if (cached) return cached;

    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Find searches with 0 results
    const zeroResults = new Map<string, { count: number; lastSearched: Date }>();

    for (const search of searchStore) {
      if (search.timestamp < cutoff) continue;
      if (search.resultsCount > 0) continue;

      const existing = zeroResults.get(search.query);
      if (existing) {
        existing.count++;
        if (search.timestamp > existing.lastSearched) {
          existing.lastSearched = search.timestamp;
        }
      } else {
        zeroResults.set(search.query, {
          count: 1,
          lastSearched: search.timestamp,
        });
      }
    }

    const result = [...zeroResults.entries()]
      .map(([query, stats]) => ({
        query,
        count: stats.count,
        lastSearched: stats.lastSearched,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    await cache.set(cacheKey, result, 3600);
    return result;
  },

  /**
   * Get low-click searches (poor results quality)
   */
  async getLowClickSearches(
    limit: number = 30,
    minSearches: number = 5
  ): Promise<Array<{
    query: string;
    searchCount: number;
    clickRate: number;
    avgResults: number;
  }>> {
    const popular = await this.getPopularSearches(100, 30);

    return popular
      .filter(s => s.count >= minSearches && s.avgResults > 0 && s.clickRate < 20)
      .map(s => ({
        query: s.query,
        searchCount: s.count,
        clickRate: s.clickRate,
        avgResults: s.avgResults,
      }))
      .slice(0, limit);
  },

  /**
   * Get search trends over time
   */
  async getSearchTrends(
    days: number = 14
  ): Promise<Array<{
    date: string;
    totalSearches: number;
    uniqueQueries: number;
    avgResults: number;
    avgClickRate: number;
  }>> {
    const trends: Map<string, {
      searches: number;
      queries: Set<string>;
      results: number;
      clicks: number;
    }> = new Map();

    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    for (const search of searchStore) {
      if (search.timestamp < cutoff) continue;

      const dateKey = search.timestamp.toISOString().split('T')[0];
      const existing = trends.get(dateKey);

      if (existing) {
        existing.searches++;
        existing.queries.add(search.query);
        existing.results += search.resultsCount;
        if (search.clickedResultId) existing.clicks++;
      } else {
        trends.set(dateKey, {
          searches: 1,
          queries: new Set([search.query]),
          results: search.resultsCount,
          clicks: search.clickedResultId ? 1 : 0,
        });
      }
    }

    return [...trends.entries()]
      .map(([date, stats]) => ({
        date,
        totalSearches: stats.searches,
        uniqueQueries: stats.queries.size,
        avgResults: Math.round(stats.results / stats.searches),
        avgClickRate: Math.round((stats.clicks / stats.searches) * 100),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  },

  /**
   * Get content suggestions based on search data
   */
  async getContentSuggestions(): Promise<Array<{
    topic: string;
    reason: string;
    priority: "high" | "medium" | "low";
    searchCount: number;
  }>> {
    const zeroResults = await this.getZeroResultSearches(30, 30);
    const lowClick = await this.getLowClickSearches(30, 5);

    const suggestions: Array<{
      topic: string;
      reason: string;
      priority: "high" | "medium" | "low";
      searchCount: number;
    }> = [];

    // High priority: frequently searched with no results
    for (const zr of zeroResults.filter(z => z.count >= 10)) {
      suggestions.push({
        topic: zr.query,
        reason: `${zr.count} searches with no results`,
        priority: "high",
        searchCount: zr.count,
      });
    }

    // Medium priority: decent volume, no results
    for (const zr of zeroResults.filter(z => z.count >= 3 && z.count < 10)) {
      suggestions.push({
        topic: zr.query,
        reason: `${zr.count} searches with no results`,
        priority: "medium",
        searchCount: zr.count,
      });
    }

    // Medium priority: results exist but low engagement
    for (const lc of lowClick) {
      suggestions.push({
        topic: lc.query,
        reason: `${lc.searchCount} searches, only ${lc.clickRate}% click rate - improve existing content`,
        priority: "medium",
        searchCount: lc.searchCount,
      });
    }

    return suggestions.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority] || b.searchCount - a.searchCount;
    });
  },

  /**
   * Get search analytics dashboard
   */
  async getDashboard(): Promise<{
    summary: {
      totalSearches: number;
      uniqueQueries: number;
      avgClickRate: number;
      zeroResultRate: number;
    };
    topSearches: Array<{ query: string; count: number }>;
    contentGaps: Array<{ query: string; count: number }>;
    trends: Array<{ date: string; searches: number }>;
  }> {
    const [popular, zeroResults, trends] = await Promise.all([
      this.getPopularSearches(10, 30),
      this.getZeroResultSearches(10, 30),
      this.getSearchTrends(7),
    ]);

    const totalSearches = trends.reduce((sum, t) => sum + t.totalSearches, 0);
    const uniqueQueries = new Set(searchStore.map(s => s.query)).size;
    const avgClickRate = popular.length > 0
      ? Math.round(popular.reduce((sum, p) => sum + p.clickRate, 0) / popular.length)
      : 0;
    const zeroResultSearches = searchStore.filter(s => s.resultsCount === 0).length;
    const zeroResultRate = totalSearches > 0
      ? Math.round((zeroResultSearches / totalSearches) * 100)
      : 0;

    return {
      summary: {
        totalSearches,
        uniqueQueries,
        avgClickRate,
        zeroResultRate,
      },
      topSearches: popular.map(p => ({ query: p.query, count: p.count })),
      contentGaps: zeroResults.map(z => ({ query: z.query, count: z.count })),
      trends: trends.map(t => ({ date: t.date, searches: t.totalSearches })),
    };
  },
};

export default searchAnalytics;
