/**
 * Search API Routes
 * 
 * Endpoints for search functionality:
 * - Main search
 * - Autocomplete
 * - Trending searches
 * - Admin reindex
 */

import type { Express, Request, Response } from "express";
import { searchEngine } from "./search/index";
import { autocomplete } from "./search/autocomplete";
import { searchIndexer } from "./search/indexer";
import { requirePermission } from "./security";

export function registerSearchRoutes(app: Express) {
  /**
   * Main search endpoint
   * GET /api/search?q=burj+khalifa&type=attraction&locale=en&page=1&limit=20
   */
  app.get("/api/search", async (req: Request, res: Response) => {
    try {
      const {
        q,
        locale,
        type,
        page,
        limit,
        location,
        category,
      } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }
      
      // Parse type parameter (comma-separated)
      const types = type && typeof type === 'string' 
        ? type.split(',').map(t => t.trim())
        : undefined;
      
      // Build filters
      const filters: any = {};
      if (location && typeof location === 'string') {
        filters.location = location;
      }
      if (category && typeof category === 'string') {
        filters.category = category;
      }
      
      // Perform search
      const response = await searchEngine.search({
        q: q as string,
        locale: locale as string | undefined,
        type: types,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 20,
        filters: Object.keys(filters).length > 0 ? filters : undefined,
        sessionId: (req as any).sessionID,
        userId: (req as any).session?.user?.id,
      });
      
      res.json(response);
    } catch (error) {
      console.error('[API] Search error:', error);
      res.status(500).json({ 
        error: "Search failed", 
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  /**
   * Autocomplete endpoint
   * GET /api/search/autocomplete?q=bur&locale=en&limit=8
   */
  app.get("/api/search/autocomplete", async (req: Request, res: Response) => {
    try {
      const { q, locale, limit } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }
      
      if (q.length < 2) {
        return res.json({ suggestions: [] });
      }
      
      const suggestions = await autocomplete.suggest(q as string, {
        locale: locale as string | undefined,
        limit: limit ? parseInt(limit as string) : 8,
      });
      
      res.json({ suggestions });
    } catch (error) {
      console.error('[API] Autocomplete error:', error);
      res.status(500).json({ 
        error: "Autocomplete failed",
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  /**
   * Trending searches endpoint
   * GET /api/search/trending?locale=en&limit=10
   */
  app.get("/api/search/trending", async (req: Request, res: Response) => {
    try {
      const { locale, limit } = req.query;
      
      const trending = await searchEngine.getTrending(
        locale as string | undefined,
        limit ? parseInt(limit as string) : 10
      );
      
      res.json({ trending });
    } catch (error) {
      console.error('[API] Trending error:', error);
      res.status(500).json({ 
        error: "Failed to get trending searches",
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
  
  /**
   * Reindex all content (admin only)
   * POST /api/search/reindex
   */
  app.post(
    "/api/search/reindex",
    requirePermission("canManageSettings"),
    async (req: Request, res: Response) => {
      try {
        console.log('[API] Starting reindex operation...');
        
        // Run reindex in background (don't wait for completion)
        searchIndexer.reindexAll()
          .then(result => {
            console.log('[API] Reindex completed:', result);
          })
          .catch(error => {
            console.error('[API] Reindex failed:', error);
          });
        
        res.json({ 
          message: "Reindex started in background",
          status: "processing"
        });
      } catch (error) {
        console.error('[API] Reindex error:', error);
        res.status(500).json({ 
          error: "Failed to start reindex",
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  );
  
  /**
   * Rebuild autocomplete index (admin only)
   * POST /api/search/rebuild-autocomplete
   */
  app.post(
    "/api/search/rebuild-autocomplete",
    requirePermission("canManageSettings"),
    async (req: Request, res: Response) => {
      try {
        console.log('[API] Starting autocomplete rebuild...');
        
        // Run rebuild in background
        autocomplete.rebuildIndex()
          .then(() => {
            console.log('[API] Autocomplete rebuild completed');
          })
          .catch(error => {
            console.error('[API] Autocomplete rebuild failed:', error);
          });
        
        res.json({ 
          message: "Autocomplete rebuild started in background",
          status: "processing"
        });
      } catch (error) {
        console.error('[API] Autocomplete rebuild error:', error);
        res.status(500).json({ 
          error: "Failed to start autocomplete rebuild",
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  );
  
  /**
   * Get search analytics (admin only)
   * GET /api/search/analytics?days=7
   */
  app.get(
    "/api/search/analytics",
    requirePermission("canViewAnalytics"),
    async (req: Request, res: Response) => {
      try {
        const days = req.query.days ? parseInt(req.query.days as string) : 7;
        
        // This is a placeholder - implement full analytics later
        res.json({
          message: "Search analytics not yet implemented",
          period: `${days} days`,
          metrics: {
            totalSearches: 0,
            uniqueQueries: 0,
            avgResponseTime: 0,
            topQueries: [],
          },
        });
      } catch (error) {
        console.error('[API] Analytics error:', error);
        res.status(500).json({ 
          error: "Failed to get analytics",
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  );
  
  console.log('[Search] Search routes registered');
}
