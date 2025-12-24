/**
 * Shared SEO Rules Configuration
 * This file contains all SEO rules in one place
 * All other files should import from here to ensure consistency
 */

export const SEO_RULES = {
  // Title
  TITLE_MIN_LENGTH: 30,
  TITLE_MAX_LENGTH: 60,

  // Meta Description
  META_DESC_MIN_LENGTH: 120,
  META_DESC_MAX_LENGTH: 160,

  // Meta Title (if different from Title)
  META_TITLE_MIN_LENGTH: 30,
  META_TITLE_MAX_LENGTH: 60,

  // Content
  MIN_WORD_COUNT: 1200,
  OPTIMAL_WORD_COUNT: 1500,
  MAX_WORD_COUNT: 2500,

  // Keywords
  KEYWORD_DENSITY_MIN: 1.0,
  KEYWORD_DENSITY_MAX: 2.0,

  // Structure
  MIN_H2_HEADINGS: 3,
  MIN_FAQ_ITEMS: 5,
  MIN_INTERNAL_LINKS: 2,
  MIN_IMAGES: 2,

  // Slug
  MAX_SLUG_LENGTH: 75,

  // Thresholds
  SEO_PASS_THRESHOLD: 90,
} as const;

// Export type for SEO rules
export type SeoRules = typeof SEO_RULES;

/**
 * Self-validation checklist for AI prompts
 */
export const SEO_SELF_VALIDATION_CHECKLIST = `
SELF-VALIDATION CHECKLIST (verify before outputting):
□ Title is ${SEO_RULES.TITLE_MIN_LENGTH}-${SEO_RULES.TITLE_MAX_LENGTH} characters (count them)
□ Meta description is ${SEO_RULES.META_DESC_MIN_LENGTH}-${SEO_RULES.META_DESC_MAX_LENGTH} characters (count them)
□ Primary keyword appears in: title, meta description, first paragraph, at least one H2
□ Total word count is ${SEO_RULES.MIN_WORD_COUNT}+ words
□ At least ${SEO_RULES.MIN_H2_HEADINGS} H2 headings exist
□ FAQ section has ${SEO_RULES.MIN_FAQ_ITEMS}+ questions with 100-200 word answers each
□ Keyword density is ${SEO_RULES.KEYWORD_DENSITY_MIN}-${SEO_RULES.KEYWORD_DENSITY_MAX}% (calculate: keyword occurrences / total words * 100)
`;

/**
 * Helper function to validate title length
 */
export function isValidTitleLength(title: string): boolean {
  const length = title.length;
  return length >= SEO_RULES.TITLE_MIN_LENGTH && length <= SEO_RULES.TITLE_MAX_LENGTH;
}

/**
 * Helper function to validate meta description length
 */
export function isValidMetaDescLength(desc: string): boolean {
  const length = desc.length;
  return length >= SEO_RULES.META_DESC_MIN_LENGTH && length <= SEO_RULES.META_DESC_MAX_LENGTH;
}

/**
 * Helper function to validate keyword density
 */
export function isValidKeywordDensity(density: number): boolean {
  return density >= SEO_RULES.KEYWORD_DENSITY_MIN && density <= SEO_RULES.KEYWORD_DENSITY_MAX;
}

/**
 * Helper function to calculate keyword density
 */
export function calculateKeywordDensity(content: string, keyword: string): number {
  if (!keyword || !content) return 0;
  const words = content.toLowerCase().split(/\s+/);
  const keywordLower = keyword.toLowerCase();
  const keywordCount = words.filter(w => w.includes(keywordLower)).length;
  return words.length > 0 ? (keywordCount / words.length) * 100 : 0;
}

/**
 * Helper function to count words in content
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Helper function to extract text from content blocks
 */
export function extractTextFromBlocks(blocks: any[]): string {
  return blocks
    .filter(b => b.type === 'text' && b.data?.content)
    .map(b => b.data.content)
    .join(' ');
}

/**
 * Helper function to get first paragraph from content blocks
 */
export function getFirstParagraph(blocks: any[]): string {
  const textBlock = blocks.find(b => b.type === 'text' && b.data?.content);
  return textBlock?.data?.content?.substring(0, 500) || '';
}
