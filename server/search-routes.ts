/**
 * Search API Routes
 * 
 * Endpoints for spell checking, synonym expansion, and query rewriting
 */

import type { Express } from "express";
import { spellChecker, synonyms, queryRewriter } from "./search";

export function registerSearchRoutes(app: Express) {
  // Spell check endpoint
  // GET /api/search/spell-check?q=burk khlaifa
  app.get("/api/search/spell-check", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Query required" });
      }

      const result = await spellChecker.check(query);
      const suggestions = await spellChecker.getSuggestions(query);

      res.json({
        ...result,
        suggestions,
      });
    } catch (error) {
      console.error("[Search] Spell check error:", error);
      res.status(500).json({ error: "Spell check failed" });
    }
  });

  // Synonyms endpoint
  // GET /api/search/synonyms?term=hotel
  app.get("/api/search/synonyms", async (req, res) => {
    try {
      const term = req.query.term as string;
      if (!term) {
        return res.status(400).json({ error: "Term required" });
      }

      const expansion = synonyms.expand(term);
      const related = synonyms.getRelatedTerms(term);

      res.json({
        term,
        expansion,
        related,
      });
    } catch (error) {
      console.error("[Search] Synonyms error:", error);
      res.status(500).json({ error: "Synonym expansion failed" });
    }
  });

  // Query rewrite endpoint
  // GET /api/search/rewrite?q=best hotell in dubai
  app.get("/api/search/rewrite", async (req, res) => {
    try {
      const query = req.query.q as string;
      const locale = req.query.locale as string | undefined;
      
      if (!query) {
        return res.status(400).json({ error: "Query required" });
      }

      const result = await queryRewriter.rewrite(query, locale);
      const alternatives = await queryRewriter.generateAlternatives(query);

      res.json({
        ...result,
        alternatives,
      });
    } catch (error) {
      console.error("[Search] Query rewrite error:", error);
      res.status(500).json({ error: "Query rewrite failed" });
    }
  });
}
