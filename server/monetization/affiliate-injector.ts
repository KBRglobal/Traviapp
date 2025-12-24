/**
 * Dynamic Affiliate Link Injector
 * 
 * Automatically inserts affiliate links into content based on keywords
 * Respects maximum links per content
 * Tracks injected links for performance monitoring
 */

import { db } from '../db';
import { contents, affiliateLinks } from '@shared/schema';
import { eq, like, or } from 'drizzle-orm';

// ============================================================================
// TYPES
// ============================================================================

export interface AffiliateInjectionResult {
  success: boolean;
  linksInjected: number;
  message: string;
  injectedLinks: InjectedLink[];
}

export interface InjectedLink {
  keyword: string;
  url: string;
  position: number;
}

export interface InjectionConfig {
  maxLinksPerContent?: number;
  minWordsBetweenLinks?: number;
  targetBlankLinks?: boolean;
  noFollowLinks?: boolean;
  keywords?: string[];
}

// ============================================================================
// AFFILIATE INJECTION
// ============================================================================

/**
 * Inject affiliate links into content
 */
export async function injectAffiliateLinks(
  contentId: string,
  config: InjectionConfig = {}
): Promise<AffiliateInjectionResult> {
  try {
    const {
      maxLinksPerContent = 5,
      minWordsBetweenLinks = 100,
      targetBlankLinks = true,
      noFollowLinks = false,
      keywords: specificKeywords,
    } = config;

    // Get content
    const [content] = await db
      .select()
      .from(contents)
      .where(eq(contents.id, contentId))
      .limit(1);

    if (!content) {
      return {
        success: false,
        linksInjected: 0,
        message: 'Content not found',
        injectedLinks: [],
      };
    }

    // Get affiliate links
    const affiliates = await db
      .select()
      .from(affiliateLinks)
      .where(eq(affiliateLinks.isActive, true));

    if (affiliates.length === 0) {
      return {
        success: true,
        linksInjected: 0,
        message: 'No active affiliate links available',
        injectedLinks: [],
      };
    }

    // Extract text from content blocks
    const contentText = extractTextFromBlocks(content.blocks || []);
    const blocks = content.blocks || [];

    // Find matching keywords
    const matchedAffiliates = affiliates.filter((affiliate) => {
      const keyword = affiliate.keyword.toLowerCase();
      
      // Filter by specific keywords if provided
      if (specificKeywords && !specificKeywords.includes(keyword)) {
        return false;
      }

      return contentText.toLowerCase().includes(keyword);
    });

    if (matchedAffiliates.length === 0) {
      return {
        success: true,
        linksInjected: 0,
        message: 'No matching keywords found in content',
        injectedLinks: [],
      };
    }

    // Sort by priority and usage (inject less-used links first)
    matchedAffiliates.sort((a, b) => {
      const priorityDiff = (b.priority || 0) - (a.priority || 0);
      if (priorityDiff !== 0) return priorityDiff;
      return (a.clickCount || 0) - (b.clickCount || 0);
    });

    // Inject links
    const injectedLinks: InjectedLink[] = [];
    let linksInjected = 0;
    const updatedBlocks = [...blocks];

    for (const affiliate of matchedAffiliates) {
      if (linksInjected >= maxLinksPerContent) break;

      // Find suitable position to inject link
      const injected = injectLinkIntoBlocks(
        updatedBlocks,
        affiliate.keyword,
        affiliate.url,
        {
          targetBlank: targetBlankLinks,
          noFollow: noFollowLinks,
        }
      );

      if (injected) {
        injectedLinks.push({
          keyword: affiliate.keyword,
          url: affiliate.url,
          position: injected.blockIndex,
        });
        linksInjected++;

        // Increment click tracking
        await db
          .update(affiliateLinks)
          .set({
            clickCount: (affiliate.clickCount || 0) + 1,
          })
          .where(eq(affiliateLinks.id, affiliate.id));
      }
    }

    // Update content with injected links
    if (linksInjected > 0) {
      await db
        .update(contents)
        .set({
          blocks: updatedBlocks,
          updatedAt: new Date(),
        })
        .where(eq(contents.id, contentId));
    }

    return {
      success: true,
      linksInjected,
      message: `Successfully injected ${linksInjected} affiliate link(s)`,
      injectedLinks,
    };
  } catch (error) {
    console.error('[Affiliate Injector] Error:', error);
    return {
      success: false,
      linksInjected: 0,
      message: error instanceof Error ? error.message : 'Unknown error',
      injectedLinks: [],
    };
  }
}

/**
 * Inject a single link into content blocks
 */
function injectLinkIntoBlocks(
  blocks: any[],
  keyword: string,
  url: string,
  options: { targetBlank: boolean; noFollow: boolean }
): { blockIndex: number } | null {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    if (block.type === 'text' && block.data?.content) {
      const content = block.data.content;
      const keywordIndex = content.toLowerCase().indexOf(keyword.toLowerCase());

      if (keywordIndex !== -1) {
        // Check if keyword is already linked
        const beforeKeyword = content.substring(Math.max(0, keywordIndex - 10), keywordIndex);
        if (beforeKeyword.includes('<a ') || beforeKeyword.includes('href')) {
          continue; // Skip if already part of a link
        }

        // Inject link
        const before = content.substring(0, keywordIndex);
        const keywordText = content.substring(keywordIndex, keywordIndex + keyword.length);
        const after = content.substring(keywordIndex + keyword.length);

        const linkAttrs = [
          `href="${url}"`,
          options.targetBlank ? 'target="_blank"' : '',
          options.targetBlank ? 'rel="noopener noreferrer"' : '',
          options.noFollow ? 'rel="nofollow"' : '',
        ].filter(Boolean).join(' ');

        const linkedContent = `${before}<a ${linkAttrs}>${keywordText}</a>${after}`;

        blocks[i] = {
          ...block,
          data: {
            ...block.data,
            content: linkedContent,
          },
        };

        return { blockIndex: i };
      }
    }
  }

  return null;
}

/**
 * Remove affiliate links from content
 */
export async function removeAffiliateLinks(contentId: string): Promise<boolean> {
  try {
    const [content] = await db
      .select()
      .from(contents)
      .where(eq(contents.id, contentId))
      .limit(1);

    if (!content) return false;

    const blocks = content.blocks || [];
    const cleanedBlocks = blocks.map((block) => {
      if (block.type === 'text' && block.data?.content) {
        // Remove all links (simple regex approach)
        const cleaned = block.data.content.replace(/<a\b[^>]*>(.*?)<\/a>/gi, '$1');
        return {
          ...block,
          data: {
            ...block.data,
            content: cleaned,
          },
        };
      }
      return block;
    });

    await db
      .update(contents)
      .set({
        blocks: cleanedBlocks,
        updatedAt: new Date(),
      })
      .where(eq(contents.id, contentId));

    return true;
  } catch (error) {
    console.error('[Affiliate Injector] Error removing links:', error);
    return false;
  }
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Extract text from content blocks
 */
function extractTextFromBlocks(blocks: any[]): string {
  if (!Array.isArray(blocks)) return '';

  let text = '';

  for (const block of blocks) {
    if (!block || typeof block !== 'object') continue;

    switch (block.type) {
      case 'text':
        text += (block.data?.content || '') + ' ';
        break;
      case 'hero':
        text += (block.data?.title || '') + ' ';
        text += (block.data?.subtitle || '') + ' ';
        break;
      case 'highlights':
        text += (block.data?.content || '') + ' ';
        break;
      case 'tips':
        text += (block.data?.content || '') + ' ';
        break;
      case 'faq':
        text += (block.data?.question || '') + ' ';
        text += (block.data?.answer || '') + ' ';
        break;
      case 'cta':
        text += (block.data?.title || '') + ' ';
        text += (block.data?.content || '') + ' ';
        break;
    }
  }

  return text.trim();
}
