/**
 * Content Indexer
 * 
 * Automatically indexes all content for search:
 * - Extracts plain text from blocks
 * - Generates tsvector for full-text search
 * - Extracts entities (locations, prices)
 * - Generates autocomplete terms
 */

import { db } from "../db";
import { eq, sql } from "drizzle-orm";
import { contents, searchIndex, type Content, type ContentBlock } from "@shared/schema";

export interface ExtractedEntities {
  locations: string[];
  prices: string[];
  categories: string[];
}

/**
 * Extract plain text from content blocks
 */
export function extractPlainText(blocks: ContentBlock[]): string {
  if (!blocks || blocks.length === 0) return '';
  
  const textParts: string[] = [];
  
  for (const block of blocks) {
    const data = block.data || {};
    
    if (block.type === 'paragraph' || block.type === 'heading') {
      if (typeof data.content === 'string') {
        textParts.push(data.content);
      }
    } else if (block.type === 'list' && Array.isArray(data.items)) {
      textParts.push(...data.items.filter((item): item is string => typeof item === 'string'));
    } else if (block.type === 'quote' && typeof data.text === 'string') {
      textParts.push(data.text);
    }
  }
  
  return textParts.join(' ').trim();
}

/**
 * Extract entities from text and content type
 */
export function extractEntities(text: string, type: string, contentData?: any): ExtractedEntities {
  const entities: ExtractedEntities = {
    locations: [],
    prices: [],
    categories: [],
  };
  
  // Extract locations from text (Dubai-specific)
  const locationPatterns = [
    'Downtown Dubai', 'Dubai Marina', 'JBR', 'Palm Jumeirah', 'Jumeirah',
    'Business Bay', 'Deira', 'Bur Dubai', 'Dubai Creek', 'DIFC',
    'Dubai Hills', 'JVC', 'Dubai South', 'Al Barsha', 'Bluewaters'
  ];
  
  for (const location of locationPatterns) {
    if (text.toLowerCase().includes(location.toLowerCase())) {
      entities.locations.push(location);
    }
  }
  
  // Extract from structured data if available
  if (contentData?.location) {
    entities.locations.push(contentData.location);
  }
  
  // Extract prices (AED, USD, EUR patterns)
  const priceMatches = text.match(/(?:AED|USD|EUR|\$|€)\s*[\d,]+/gi);
  if (priceMatches) {
    entities.prices = [...new Set(priceMatches.map(p => p.trim()))];
  }
  
  // Add structured price data
  if (contentData?.priceFrom) {
    entities.prices.push(contentData.priceFrom);
  }
  if (contentData?.priceRange) {
    entities.prices.push(contentData.priceRange);
  }
  
  // Extract categories based on content type
  if (type === 'hotel') {
    if (contentData?.starRating >= 4) {
      entities.categories.push('luxury');
    }
    if (contentData?.amenities?.includes('family')) {
      entities.categories.push('family-friendly');
    }
  } else if (type === 'attraction') {
    if (contentData?.targetAudience) {
      entities.categories.push(...contentData.targetAudience);
    }
  } else if (type === 'dining') {
    if (contentData?.cuisineType) {
      entities.categories.push(contentData.cuisineType);
    }
    if (contentData?.priceRange === 'Expensive') {
      entities.categories.push('fine-dining');
    }
  }
  
  // Deduplicate
  entities.locations = [...new Set(entities.locations)];
  entities.prices = [...new Set(entities.prices)];
  entities.categories = [...new Set(entities.categories)];
  
  return entities;
}

/**
 * Generate autocomplete search terms from content
 */
export function generateSearchTerms(content: Content): string[] {
  const terms: string[] = [];
  
  // Add title variations
  const title = content.title.toLowerCase();
  terms.push(title);
  
  // Add words from title (for partial matching)
  const titleWords = title.split(/\s+/).filter(w => w.length >= 3);
  terms.push(...titleWords);
  
  // Add keywords
  if (content.primaryKeyword) {
    terms.push(content.primaryKeyword.toLowerCase());
  }
  if (content.secondaryKeywords) {
    terms.push(...content.secondaryKeywords.map(k => k.toLowerCase()));
  }
  
  // Add type-specific terms
  terms.push(content.type);
  
  // Deduplicate and filter
  return [...new Set(terms)].filter(t => t.length >= 2);
}

/**
 * Calculate quality score based on content completeness
 */
function calculateQualityScore(content: Content): number {
  let score = 50; // Base score
  
  // Completeness factors
  if (content.metaDescription) score += 10;
  if (content.heroImage) score += 10;
  if (content.seoScore && content.seoScore > 70) score += 15;
  if (content.blocks && content.blocks.length > 5) score += 10;
  if (content.wordCount && content.wordCount > 1000) score += 5;
  
  return Math.min(100, score);
}

/**
 * Index a single piece of content
 */
export async function indexContent(contentId: string): Promise<void> {
  try {
    // Fetch content with all data
    const [content] = await db
      .select()
      .from(contents)
      .where(eq(contents.id, contentId))
      .limit(1);
    
    if (!content) {
      console.warn(`[Indexer] Content ${contentId} not found`);
      return;
    }
    
    // Only index published content
    if (content.status !== 'published') {
      console.log(`[Indexer] Skipping non-published content ${contentId}`);
      return;
    }
    
    // Extract plain text from blocks
    const plainText = extractPlainText(content.blocks || []);
    
    // Extract entities
    const entities = extractEntities(
      `${content.title} ${plainText} ${content.metaDescription || ''}`,
      content.type,
      content
    );
    
    // Generate search terms
    const searchTerms = generateSearchTerms(content);
    
    // Calculate quality score
    const quality = calculateQualityScore(content);
    
    // Upsert into search index
    await db
      .insert(searchIndex)
      .values({
        contentId: content.id,
        title: content.title,
        content: plainText.substring(0, 5000), // Limit content length
        metaDescription: content.metaDescription,
        locations: entities.locations,
        prices: entities.prices,
        categories: entities.categories,
        contentType: content.type,
        locale: 'en', // Default locale, extend for multi-language
        popularity: content.viewCount || 0,
        quality,
        freshness: content.updatedAt || content.createdAt,
        searchTerms,
      })
      .onConflictDoUpdate({
        target: searchIndex.contentId,
        set: {
          title: content.title,
          content: plainText.substring(0, 5000),
          metaDescription: content.metaDescription,
          locations: entities.locations,
          prices: entities.prices,
          categories: entities.categories,
          contentType: content.type,
          popularity: content.viewCount || 0,
          quality,
          freshness: content.updatedAt || content.createdAt,
          searchTerms,
          updatedAt: sql`NOW()`,
        },
      });
    
    console.log(`[Indexer] Indexed content ${contentId} (${content.type}): ${content.title}`);
  } catch (error) {
    console.error(`[Indexer] Error indexing content ${contentId}:`, error);
    throw error;
  }
}

/**
 * Remove content from search index
 */
export async function removeFromIndex(contentId: string): Promise<void> {
  try {
    await db.delete(searchIndex).where(eq(searchIndex.contentId, contentId));
    console.log(`[Indexer] Removed content ${contentId} from index`);
  } catch (error) {
    console.error(`[Indexer] Error removing content ${contentId} from index:`, error);
    throw error;
  }
}

/**
 * Re-index all published content
 */
export async function reindexAll(): Promise<{ indexed: number; errors: number }> {
  console.log('[Indexer] Starting full reindex...');
  const startTime = Date.now();
  
  let indexed = 0;
  let errors = 0;
  
  try {
    // Get all published content
    const allContent = await db
      .select({ id: contents.id })
      .from(contents)
      .where(eq(contents.status, 'published'));
    
    console.log(`[Indexer] Found ${allContent.length} published content items`);
    
    // Index each item
    for (const item of allContent) {
      try {
        await indexContent(item.id);
        indexed++;
      } catch (error) {
        console.error(`[Indexer] Failed to index ${item.id}:`, error);
        errors++;
      }
    }
    
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`[Indexer] Reindex complete: ${indexed} indexed, ${errors} errors in ${duration}s`);
    
    return { indexed, errors };
  } catch (error) {
    console.error('[Indexer] Fatal error during reindex:', error);
    throw error;
  }
}

/**
 * Update popularity score for content
 */
export async function updatePopularity(contentId: string, views: number): Promise<void> {
  try {
    await db
      .update(searchIndex)
      .set({ popularity: views, updatedAt: sql`NOW()` })
      .where(eq(searchIndex.contentId, contentId));
  } catch (error) {
    console.error(`[Indexer] Error updating popularity for ${contentId}:`, error);
  }
}

// Export as object
export const searchIndexer = {
  indexContent,
  reindexAll,
  removeFromIndex,
  extractPlainText,
  extractEntities,
  generateSearchTerms,
  updatePopularity,
};
