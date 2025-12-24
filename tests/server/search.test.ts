/**
 * Tests for Search Engine Phase 3: Spell Check & Query Expansion
 */

import { describe, it, expect, beforeAll, vi } from "vitest";
import { spellChecker } from "../../server/search/spell-checker";
import { synonyms } from "../../server/search/synonyms";
import { queryProcessor } from "../../server/search/query-processor";
import { queryRewriter } from "../../server/search/query-rewriter";

// Mock the cache module
vi.mock("../../server/cache", () => ({
  cache: {
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue(undefined),
  },
}));

// Mock the db module
vi.mock("../../server/db", () => ({
  db: {
    execute: vi.fn().mockResolvedValue({ rows: [] }),
  },
}));

describe("Spell Checker", () => {
  it("should correct common typos", async () => {
    const result = await spellChecker.check("burk khalifa");
    expect(result.corrected).toBe("burj khalifa");
    expect(result.wasChanged).toBe(true);
  });

  it("should not change correctly spelled queries", async () => {
    const result = await spellChecker.check("dubai mall");
    expect(result.corrected).toBe("dubai mall");
    expect(result.wasChanged).toBe(false);
    expect(result.confidence).toBe(1.0);
  });

  it("should handle multiple typos", async () => {
    const result = await spellChecker.check("burk khlaifa hotell");
    expect(result.corrected).toContain("burj");
    expect(result.corrected).toContain("khalifa");
    expect(result.corrected).toContain("hotel");
    expect(result.wasChanged).toBe(true);
  });

  it("should calculate Levenshtein distance correctly", () => {
    expect(spellChecker.levenshteinDistance("cat", "cat")).toBe(0);
    expect(spellChecker.levenshteinDistance("cat", "bat")).toBe(1);
    expect(spellChecker.levenshteinDistance("burj", "burk")).toBe(1);
  });

  it("should provide suggestions for misspelled queries", async () => {
    const suggestions = await spellChecker.getSuggestions("burk khalfia");
    expect(suggestions.length).toBeGreaterThan(0);
  });
});

describe("Synonyms", () => {
  it("should expand query with synonyms", () => {
    const result = synonyms.expand("cheap hotel");
    expect(result.expanded).toContain("cheap");
    expect(result.expanded).toContain("hotel");
    expect(result.expanded).toContain("budget");
    expect(result.expanded).toContain("affordable");
  });

  it("should expand multi-word phrases", () => {
    const result = synonyms.expand("shopping");
    expect(result.expanded).toContain("shopping");
    expect(result.expanded).toContain("mall");
    expect(result.expanded).toContain("souq");
  });

  it("should get related terms", () => {
    const related = synonyms.getRelatedTerms("hotel");
    expect(related).toContain("resort");
    expect(related).toContain("accommodation");
  });

  it("should build expanded query with weights", () => {
    const query = synonyms.buildExpandedQuery("cheap hotel");
    expect(query).toContain(":A"); // Original terms
    expect(query).toContain(":B"); // Synonym terms
    expect(query).toContain("|"); // OR operator
  });
});

describe("Query Processor", () => {
  it("should normalize queries", () => {
    const result = queryProcessor.process("  BEST   Hotels  in  DUBAI  ");
    expect(result.normalized).toBe("best hotels dubai");
  });

  it("should detect English language", () => {
    const result = queryProcessor.process("hotel dubai");
    expect(result.language).toBe("en");
  });

  it("should detect Hebrew language", () => {
    const result = queryProcessor.process("מלון בדובאי");
    expect(result.language).toBe("he");
  });

  it("should detect Arabic language", () => {
    const result = queryProcessor.process("فندق في دبي");
    expect(result.language).toBe("ar");
  });

  it("should remove stop words in English", () => {
    const result = queryProcessor.process("the best hotel in the dubai");
    expect(result.normalized).not.toContain("the");
    expect(result.normalized).toContain("best");
    expect(result.normalized).toContain("hotel");
  });

  it("should tokenize query", () => {
    const result = queryProcessor.process("dubai mall shopping");
    expect(result.tokens).toEqual(["dubai", "mall", "shopping"]);
  });
});

describe("Query Rewriter", () => {
  it("should rewrite query with all transformations", async () => {
    const result = await queryRewriter.rewrite("burk khalifa hotell");
    expect(result.rewritten).toContain("burj");
    expect(result.rewritten).toContain("khalifa");
    expect(result.spellCorrected).toBe(true);
    expect(result.transformations).toContain("normalized");
    expect(result.transformations).toContain("spell_corrected");
  });

  it("should handle special patterns", () => {
    const result = queryRewriter.handlePatterns("best hotels in dubai");
    expect(result).toBe("hotels");
  });

  it("should handle near patterns", () => {
    const result = queryRewriter.handlePatterns("restaurants near burj khalifa");
    expect(result).toBe("restaurants burj khalifa");
  });

  it("should handle top N patterns", () => {
    const result = queryRewriter.handlePatterns("top 10 attractions");
    expect(result).toBe("attractions");
  });

  it("should generate alternative queries", async () => {
    const alternatives = await queryRewriter.generateAlternatives("hotel dubai");
    expect(alternatives).toBeInstanceOf(Array);
  });

  it("should detect language from query", async () => {
    const result = await queryRewriter.rewrite("מלון בדובאי");
    expect(result.language).toBe("he");
  });
});

describe("Performance", () => {
  it("should complete spell check in under 50ms", async () => {
    const start = Date.now();
    await spellChecker.check("burk khalifa");
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(50);
  });

  it("should complete synonym expansion in under 10ms", () => {
    const start = Date.now();
    synonyms.expand("cheap hotel");
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(10);
  });

  it("should complete query rewrite in under 100ms", async () => {
    const start = Date.now();
    await queryRewriter.rewrite("burk khalifa hotell");
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100);
  });
});

describe("Multi-language Support", () => {
  it("should handle Hebrew queries", async () => {
    const result = await queryRewriter.rewrite("מלון זול");
    expect(result.language).toBe("he");
    expect(result.expanded.length).toBeGreaterThan(0);
  });

  it("should handle Arabic queries", async () => {
    const result = await queryRewriter.rewrite("فندق رخيص");
    expect(result.language).toBe("ar");
    expect(result.expanded.length).toBeGreaterThan(0);
  });

  it("should expand Hebrew synonyms", () => {
    const result = synonyms.expand("מלון");
    expect(result.expanded).toContain("מלון");
    expect(result.expanded).toContain("אכסניה");
  });

  it("should expand Arabic synonyms", () => {
    const result = synonyms.expand("فندق");
    expect(result.expanded).toContain("فندق");
    expect(result.expanded).toContain("منتجع");
  });
});
