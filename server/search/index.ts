/**
 * Search Engine - Phase 3: Spell Check & Query Expansion
 * 
 * Main exports for the search engine modules
 */

export { spellChecker, type SpellCheckResult } from "./spell-checker";
export { synonyms, type SynonymExpansion } from "./synonyms";
export { queryProcessor, type ProcessedQuery } from "./query-processor";
export { queryRewriter, type RewrittenQuery } from "./query-rewriter";
