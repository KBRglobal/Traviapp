export interface SeoIssue {
  type: "error" | "warning" | "success" | "info";
  category: string;
  message: string;
  recommendation?: string;
}

export interface SeoAnalysis {
  score: number;
  issues: SeoIssue[];
  keywordDensity: number;
  wordCount: number;
}

export interface SeoInput {
  title: string;
  metaTitle: string;
  metaDescription: string;
  primaryKeyword: string;
  content: string;
  headings: { level: number; text: string }[];
  images: { url: string; alt: string }[];
  internalLinks: number;
  externalLinks: number;
}

const META_TITLE_MIN = 30;
const META_TITLE_MAX = 60;
const META_DESC_MIN = 120;
const META_DESC_MAX = 160;
const MIN_WORD_COUNT = 300;
const IDEAL_KEYWORD_DENSITY_MIN = 1;
const IDEAL_KEYWORD_DENSITY_MAX = 3;

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function calculateKeywordDensity(content: string, keyword: string): number {
  if (!keyword || !content) return 0;
  const words = content.toLowerCase().split(/\s+/);
  const keywordLower = keyword.toLowerCase();
  const keywordCount = words.filter(w => w.includes(keywordLower)).length;
  return words.length > 0 ? (keywordCount / words.length) * 100 : 0;
}

export function analyzeSeo(input: SeoInput): SeoAnalysis {
  const issues: SeoIssue[] = [];
  let score = 100;

  const wordCount = countWords(input.content);
  const keywordDensity = calculateKeywordDensity(input.content, input.primaryKeyword);

  if (!input.title || input.title.trim().length === 0) {
    issues.push({
      type: "error",
      category: "Title",
      message: "Page title is missing",
      recommendation: "Add a descriptive title for your page",
    });
    score -= 15;
  }

  if (!input.metaTitle || input.metaTitle.trim().length === 0) {
    issues.push({
      type: "error",
      category: "Meta Title",
      message: "Meta title is missing",
      recommendation: "Add a meta title for better search visibility",
    });
    score -= 10;
  } else if (input.metaTitle.length < META_TITLE_MIN) {
    issues.push({
      type: "warning",
      category: "Meta Title",
      message: `Meta title is too short (${input.metaTitle.length} chars)`,
      recommendation: `Aim for ${META_TITLE_MIN}-${META_TITLE_MAX} characters`,
    });
    score -= 5;
  } else if (input.metaTitle.length > META_TITLE_MAX) {
    issues.push({
      type: "warning",
      category: "Meta Title",
      message: `Meta title is too long (${input.metaTitle.length} chars)`,
      recommendation: `Keep it under ${META_TITLE_MAX} characters to prevent truncation`,
    });
    score -= 5;
  } else {
    issues.push({
      type: "success",
      category: "Meta Title",
      message: `Meta title length is optimal (${input.metaTitle.length} chars)`,
    });
  }

  if (!input.metaDescription || input.metaDescription.trim().length === 0) {
    issues.push({
      type: "error",
      category: "Meta Description",
      message: "Meta description is missing",
      recommendation: "Add a compelling meta description",
    });
    score -= 10;
  } else if (input.metaDescription.length < META_DESC_MIN) {
    issues.push({
      type: "warning",
      category: "Meta Description",
      message: `Meta description is too short (${input.metaDescription.length} chars)`,
      recommendation: `Aim for ${META_DESC_MIN}-${META_DESC_MAX} characters`,
    });
    score -= 5;
  } else if (input.metaDescription.length > META_DESC_MAX) {
    issues.push({
      type: "warning",
      category: "Meta Description",
      message: `Meta description is too long (${input.metaDescription.length} chars)`,
      recommendation: `Keep it under ${META_DESC_MAX} characters`,
    });
    score -= 3;
  } else {
    issues.push({
      type: "success",
      category: "Meta Description",
      message: `Meta description length is optimal (${input.metaDescription.length} chars)`,
    });
  }

  if (!input.primaryKeyword || input.primaryKeyword.trim().length === 0) {
    issues.push({
      type: "warning",
      category: "Keyword",
      message: "No primary keyword set",
      recommendation: "Set a focus keyword for better optimization",
    });
    score -= 10;
  } else {
    const keywordInTitle = input.title.toLowerCase().includes(input.primaryKeyword.toLowerCase());
    const keywordInMetaTitle = input.metaTitle.toLowerCase().includes(input.primaryKeyword.toLowerCase());
    const keywordInMetaDesc = input.metaDescription.toLowerCase().includes(input.primaryKeyword.toLowerCase());

    if (!keywordInTitle && !keywordInMetaTitle) {
      issues.push({
        type: "warning",
        category: "Keyword",
        message: "Primary keyword not found in title",
        recommendation: "Include your keyword in the page title",
      });
      score -= 5;
    } else {
      issues.push({
        type: "success",
        category: "Keyword",
        message: "Primary keyword found in title",
      });
    }

    if (!keywordInMetaDesc) {
      issues.push({
        type: "info",
        category: "Keyword",
        message: "Primary keyword not in meta description",
        recommendation: "Consider including keyword in meta description",
      });
      score -= 3;
    }

    if (keywordDensity < IDEAL_KEYWORD_DENSITY_MIN) {
      issues.push({
        type: "warning",
        category: "Keyword Density",
        message: `Keyword density is low (${keywordDensity.toFixed(1)}%)`,
        recommendation: `Aim for ${IDEAL_KEYWORD_DENSITY_MIN}-${IDEAL_KEYWORD_DENSITY_MAX}% keyword density`,
      });
      score -= 5;
    } else if (keywordDensity > IDEAL_KEYWORD_DENSITY_MAX) {
      issues.push({
        type: "warning",
        category: "Keyword Density",
        message: `Keyword density is high (${keywordDensity.toFixed(1)}%)`,
        recommendation: "Reduce keyword usage to avoid keyword stuffing",
      });
      score -= 5;
    } else {
      issues.push({
        type: "success",
        category: "Keyword Density",
        message: `Keyword density is optimal (${keywordDensity.toFixed(1)}%)`,
      });
    }
  }

  if (wordCount < MIN_WORD_COUNT) {
    issues.push({
      type: "warning",
      category: "Content Length",
      message: `Content is short (${wordCount} words)`,
      recommendation: `Aim for at least ${MIN_WORD_COUNT} words for better SEO`,
    });
    score -= 10;
  } else if (wordCount >= 1000) {
    issues.push({
      type: "success",
      category: "Content Length",
      message: `Good content length (${wordCount} words)`,
    });
  } else {
    issues.push({
      type: "info",
      category: "Content Length",
      message: `Content has ${wordCount} words`,
      recommendation: "Consider adding more content for comprehensive coverage",
    });
  }

  const h1Count = input.headings.filter(h => h.level === 1).length;
  if (h1Count === 0) {
    issues.push({
      type: "warning",
      category: "Headings",
      message: "No H1 heading found",
      recommendation: "Add an H1 heading to your content",
    });
    score -= 5;
  } else if (h1Count > 1) {
    issues.push({
      type: "warning",
      category: "Headings",
      message: `Multiple H1 headings found (${h1Count})`,
      recommendation: "Use only one H1 heading per page",
    });
    score -= 3;
  } else {
    issues.push({
      type: "success",
      category: "Headings",
      message: "H1 heading is present",
    });
  }

  const h2Count = input.headings.filter(h => h.level === 2).length;
  if (h2Count === 0 && wordCount > 500) {
    issues.push({
      type: "info",
      category: "Headings",
      message: "No H2 subheadings found",
      recommendation: "Add H2 subheadings to structure your content",
    });
    score -= 3;
  } else if (h2Count > 0) {
    issues.push({
      type: "success",
      category: "Headings",
      message: `${h2Count} H2 subheading(s) found`,
    });
  }

  const imagesWithoutAlt = input.images.filter(img => !img.alt || img.alt.trim().length === 0);
  if (imagesWithoutAlt.length > 0) {
    issues.push({
      type: "warning",
      category: "Images",
      message: `${imagesWithoutAlt.length} image(s) missing alt text`,
      recommendation: "Add descriptive alt text to all images",
    });
    score -= 5;
  } else if (input.images.length > 0) {
    issues.push({
      type: "success",
      category: "Images",
      message: "All images have alt text",
    });
  }

  if (input.internalLinks === 0) {
    issues.push({
      type: "info",
      category: "Links",
      message: "No internal links found",
      recommendation: "Add internal links to related content",
    });
    score -= 3;
  } else {
    issues.push({
      type: "success",
      category: "Links",
      message: `${input.internalLinks} internal link(s) found`,
    });
  }

  score = Math.max(0, Math.min(100, score));

  issues.sort((a, b) => {
    const order = { error: 0, warning: 1, info: 2, success: 3 };
    return order[a.type] - order[b.type];
  });

  return {
    score,
    issues,
    keywordDensity,
    wordCount,
  };
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
  if (score >= 40) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return "Good";
  if (score >= 60) return "Needs Improvement";
  if (score >= 40) return "Poor";
  return "Critical";
}
