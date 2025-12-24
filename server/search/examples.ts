/**
 * Example Usage of TRAVI Search Engine Phase 3
 * 
 * This file demonstrates how to use the spell check, synonyms, and query rewriter
 * features in a real search implementation.
 */

import { queryRewriter, spellChecker, synonyms } from "./index";

/**
 * Example 1: Simple Spell Check
 */
export async function exampleSpellCheck() {
  console.log("=== Example 1: Spell Check ===\n");
  
  // User types "burk khalifa" with a typo
  const query = "burk khalifa";
  const result = await spellChecker.check(query);
  
  console.log(`User searched for: "${query}"`);
  console.log(`Corrected to: "${result.corrected}"`);
  console.log(`Confidence: ${result.confidence}`);
  
  if (result.wasChanged) {
    console.log(`Did you mean: "${result.corrected}"?`);
  }
  
  return result;
}

/**
 * Example 2: Synonym Expansion
 */
export function exampleSynonymExpansion() {
  console.log("\n=== Example 2: Synonym Expansion ===\n");
  
  // User searches for "cheap hotel"
  const query = "cheap hotel";
  const result = synonyms.expand(query);
  
  console.log(`Original query: "${query}"`);
  console.log(`Expanded terms: ${result.expanded.slice(0, 10).join(", ")}...`);
  console.log(`Total expanded terms: ${result.expanded.length}`);
  
  // Build PostgreSQL full-text search query
  const sqlQuery = synonyms.buildExpandedQuery(query);
  console.log(`SQL Query: ${sqlQuery.substring(0, 100)}...`);
  
  return result;
}

/**
 * Example 3: Full Query Rewrite
 */
export async function exampleQueryRewrite() {
  console.log("\n=== Example 3: Full Query Rewrite ===\n");
  
  // User types a messy query
  const query = "best hotell near burk khalifa";
  const result = await queryRewriter.rewrite(query);
  
  console.log(`Original query: "${query}"`);
  console.log(`Rewritten query: "${result.rewritten}"`);
  console.log(`Spell corrected: ${result.spellCorrected}`);
  console.log(`Language: ${result.language}`);
  console.log(`Transformations: ${result.transformations.join(" → ")}`);
  
  if (result.didYouMean) {
    console.log(`\n💡 Did you mean: "${result.didYouMean}"?`);
  }
  
  // Generate alternative searches
  const alternatives = await queryRewriter.generateAlternatives(query);
  console.log(`\n🔍 Also try: ${alternatives.slice(0, 3).join(", ")}`);
  
  return result;
}

/**
 * Example 4: Multi-language Search
 */
export async function exampleMultiLanguage() {
  console.log("\n=== Example 4: Multi-language Search ===\n");
  
  // Hebrew search
  const hebrewQuery = "מלון זול בדובאי";
  const hebrewResult = await queryRewriter.rewrite(hebrewQuery);
  
  console.log(`Hebrew query: "${hebrewQuery}"`);
  console.log(`Language detected: ${hebrewResult.language}`);
  console.log(`Expanded (first 5): ${hebrewResult.expanded.slice(0, 5).join(", ")}`);
  
  // Arabic search
  const arabicQuery = "فندق رخيص في دبي";
  const arabicResult = await queryRewriter.rewrite(arabicQuery);
  
  console.log(`\nArabic query: "${arabicQuery}"`);
  console.log(`Language detected: ${arabicResult.language}`);
  console.log(`Expanded (first 5): ${arabicResult.expanded.slice(0, 5).join(", ")}`);
  
  return { hebrewResult, arabicResult };
}

/**
 * Example 5: Integrated Search Function
 */
export async function integratedSearchExample(userQuery: string) {
  console.log("\n=== Example 5: Integrated Search ===\n");
  
  // Step 1: Rewrite the query
  const rewritten = await queryRewriter.rewrite(userQuery);
  
  console.log(`User query: "${userQuery}"`);
  console.log(`Rewritten: "${rewritten.rewritten}"`);
  
  // Step 2: Build search query with expansions
  const searchQuery = synonyms.buildExpandedQuery(rewritten.rewritten);
  console.log(`Search query: ${searchQuery.substring(0, 80)}...`);
  
  // Step 3: Execute search (mock)
  console.log("\n📝 Search execution:");
  console.log("   1. Execute full-text search with expanded terms");
  console.log("   2. Rank results by relevance");
  console.log("   3. Return results with metadata");
  
  // Step 4: Return search response
  const response = {
    results: [], // Would contain actual search results
    query: {
      original: userQuery,
      rewritten: rewritten.rewritten,
      language: rewritten.language,
    },
    didYouMean: rewritten.didYouMean,
    suggestions: await queryRewriter.generateAlternatives(userQuery, 2),
    metadata: {
      expandedTerms: rewritten.expanded.length,
      spellCorrected: rewritten.spellCorrected,
      transformations: rewritten.transformations,
    },
  };
  
  console.log("\n✅ Search response:", JSON.stringify(response, null, 2));
  
  return response;
}

/**
 * Example 6: Common Use Cases
 */
export async function exampleCommonUseCases() {
  console.log("\n=== Example 6: Common Use Cases ===\n");
  
  const testCases = [
    "burk khalifa",                    // Typo correction
    "cheap hotels in dubai",           // Synonym expansion
    "best resturant near marina",      // Multiple corrections
    "top 10 attractions",              // Pattern handling
    "shopping mall",                   // Category expansion
    "luxry hotel with spa",            // Multiple typos
  ];
  
  for (const testQuery of testCases) {
    const result = await queryRewriter.rewrite(testQuery);
    console.log(`"${testQuery}" → "${result.rewritten}"`);
    if (result.spellCorrected) {
      console.log(`  ✓ Spell corrected`);
    }
    console.log(`  Expanded to ${result.expanded.length} terms\n`);
  }
}

// Run all examples (only if this file is executed directly)
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    try {
      await exampleSpellCheck();
      exampleSynonymExpansion();
      await exampleQueryRewrite();
      await exampleMultiLanguage();
      await integratedSearchExample("burk khalifa hotell");
      await exampleCommonUseCases();
      
      console.log("\n✨ All examples completed successfully!\n");
    } catch (error) {
      console.error("Error running examples:", error);
    }
  })();
}
