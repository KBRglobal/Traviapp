/**
 * Search API Routes
 * 
 * Endpoints for search, semantic search, and similar content
 */

import type { Express } from "express";
import { searchEngine } from "./index";
import { semanticSearch } from "./semantic-search";
import { intentClassifier } from "./intent-classifier";
import { queryProcessor } from "./query-processor";
import { searchIndexer } from "./indexer";

export function registerSearchRoutes(app: Express) {
  // ============================================================================
  // MAIN SEARCH
  // ============================================================================

  /**
   * Main search endpoint
   * GET /api/search?q=...&limit=20&page=1&type[]=hotel&locale=en
   */
  app.get("/api/search", async (req, res) => {
    try {
      const q = req.query.q as string;
      if (!q || q.trim().length === 0) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }

      const limit = parseInt(req.query.limit as string) || 20;
      const page = parseInt(req.query.page as string) || 1;
      const type = Array.isArray(req.query.type) 
        ? req.query.type as string[]
        : req.query.type 
        ? [req.query.type as string]
        : undefined;
      const locale = req.query.locale as string || undefined;

      const results = await searchEngine.search({
        q,
        limit,
        page,
        type,
        locale,
      });

      res.json(results);
    } catch (error) {
      console.error("[Search] Search error:", error);
      res.status(500).json({ 
        error: "Search failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // ============================================================================
  // SIMILAR CONTENT
  // ============================================================================

  /**
   * Find similar content
   * GET /api/search/similar/:contentId?limit=5
   */
  app.get("/api/search/similar/:contentId", async (req, res) => {
    try {
      const { contentId } = req.params;
      const limit = parseInt(req.query.limit as string) || 5;

      const similar = await semanticSearch.findSimilar(contentId, limit);

      res.json({
        contentId,
        similar,
        count: similar.length,
      });
    } catch (error) {
      console.error("[Search] Similar content error:", error);
      res.status(500).json({ 
        error: "Failed to find similar content",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // ============================================================================
  // INTENT ANALYSIS (DEBUG)
  // ============================================================================

  /**
   * Analyze query intent (for debugging/testing)
   * GET /api/search/analyze?q=...
   */
  app.get("/api/search/analyze", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Query required" });
      }

      const intent = intentClassifier.classify(query, req.query.locale as string);
      const processed = queryProcessor.process(query, req.query.locale as string);

      res.json({
        query,
        processed,
        intent,
      });
    } catch (error) {
      console.error("[Search] Analyze error:", error);
      res.status(500).json({ 
        error: "Analysis failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // ============================================================================
  // INDEXING (ADMIN ONLY)
  // ============================================================================

  /**
   * Index a specific content item
   * POST /api/search/index/:contentId
   */
  app.post("/api/search/index/:contentId", async (req, res) => {
    try {
      const { contentId } = req.params;
      await searchIndexer.indexContent(contentId);
      
      res.json({ 
        success: true,
        contentId,
        message: "Content indexed successfully"
      });
    } catch (error) {
      console.error("[Search] Index error:", error);
      res.status(500).json({ 
        error: "Indexing failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  /**
   * Reindex all content
   * POST /api/search/reindex
   */
  app.post("/api/search/reindex", async (req, res) => {
    try {
      const result = await searchIndexer.reindexAll();
      
      res.json({ 
        success: true,
        ...result,
        message: `Reindexed ${result.indexed} items with ${result.errors} errors`
      });
    } catch (error) {
      console.error("[Search] Reindex error:", error);
      res.status(500).json({ 
        error: "Reindexing failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  /**
   * Remove content from index
   * DELETE /api/search/index/:contentId
   */
  app.delete("/api/search/index/:contentId", async (req, res) => {
    try {
      const { contentId } = req.params;
      await searchIndexer.removeContent(contentId);
      
      res.json({ 
        success: true,
        contentId,
        message: "Content removed from index"
      });
    } catch (error) {
      console.error("[Search] Remove from index error:", error);
      res.status(500).json({ 
        error: "Remove failed",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
}
