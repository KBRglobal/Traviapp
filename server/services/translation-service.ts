import Anthropic from "@anthropic-ai/sdk";
import { SUPPORTED_LOCALES, type Locale, type ContentBlock } from "@shared/schema";

// Initialize Anthropic client
const anthropic = new Anthropic();

// Translation prompts optimized for Dubai tourism content
const TRANSLATION_SYSTEM_PROMPT = `You are an expert tourism content translator specializing in Dubai travel content.

CRITICAL RULES:
1. Translate naturally using LOCAL expressions and slang that tourists from the target language actually use
2. Keep proper nouns in their original form: "Burj Khalifa", "Dubai Mall", "Palm Jumeirah"
3. Adapt currency mentions: Keep AED but add local equivalent in parentheses when relevant
4. Use culturally appropriate marketing tone for the target audience
5. Preserve all HTML tags, markdown formatting, and special characters exactly
6. Maintain SEO-friendly structure with proper headings and keywords in target language
7. For RTL languages (Arabic, Hebrew, Persian, Urdu): ensure proper text flow

CULTURAL ADAPTATIONS BY MARKET:
- Russian (ru): Emphasize luxury, exclusivity, VIP experiences
- Hindi (hi): Focus on family-friendly, value for money, vegetarian options
- Chinese (zh): Highlight shopping, photo spots, famous landmarks
- Arabic (ar): Emphasize halal options, prayer facilities, modest dress code areas
- Japanese (ja): Focus on cleanliness, efficiency, unique experiences
- Korean (ko): Highlight Instagram-worthy spots, K-beauty shops, unique cafes
- German (de): Emphasize quality, precision, practical information
- French (fr): Focus on culture, gastronomy, elegance

OUTPUT FORMAT: Return ONLY the translated text. Do not include any explanations or notes.`;

interface TranslationRequest {
  text: string;
  sourceLocale: Locale;
  targetLocale: Locale;
  contentType?: "title" | "description" | "body" | "meta";
}

interface TranslationResult {
  translatedText: string;
  locale: Locale;
  success: boolean;
  error?: string;
}

interface ContentTranslation {
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  blocks?: ContentBlock[];
}

// Translate a single piece of text
export async function translateText(request: TranslationRequest): Promise<TranslationResult> {
  const { text, sourceLocale, targetLocale, contentType = "body" } = request;

  if (!text || text.trim() === "") {
    return { translatedText: "", locale: targetLocale, success: true };
  }

  if (sourceLocale === targetLocale) {
    return { translatedText: text, locale: targetLocale, success: true };
  }

  const targetLocaleInfo = SUPPORTED_LOCALES.find((l) => l.code === targetLocale);
  const targetLanguageName = targetLocaleInfo?.name || targetLocale;

  const contentTypeInstructions = {
    title: "This is a title/heading. Keep it concise, impactful, and SEO-friendly.",
    description:
      "This is a meta description for SEO. Keep it under 160 characters, compelling, and include key search terms.",
    meta: "This is meta content for SEO. Optimize for search engines while being natural.",
    body: "This is body content. Maintain the tone, style, and formatting of the original.",
  };

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      system: TRANSLATION_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Translate the following ${contentType} from ${sourceLocale} to ${targetLanguageName} (${targetLocale}).

${contentTypeInstructions[contentType]}

Text to translate:
${text}`,
        },
      ],
    });

    const translatedText =
      response.content[0].type === "text" ? response.content[0].text : "";

    return {
      translatedText: translatedText.trim(),
      locale: targetLocale,
      success: true,
    };
  } catch (error) {
    console.error(`Translation error for ${targetLocale}:`, error);
    return {
      translatedText: "",
      locale: targetLocale,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Translate content blocks recursively
async function translateBlock(
  block: ContentBlock,
  sourceLocale: Locale,
  targetLocale: Locale
): Promise<ContentBlock> {
  const translatedBlock = { ...block };

  // Translate text fields in the block
  if (block.data) {
    const translatedData: Record<string, unknown> = { ...block.data };

    for (const [key, value] of Object.entries(block.data)) {
      if (typeof value === "string" && value.trim() !== "") {
        // Skip URLs and technical fields
        if (
          key.toLowerCase().includes("url") ||
          key.toLowerCase().includes("src") ||
          key.toLowerCase().includes("id")
        ) {
          continue;
        }

        const result = await translateText({
          text: value,
          sourceLocale,
          targetLocale,
          contentType: key.toLowerCase().includes("title") ? "title" : "body",
        });

        if (result.success) {
          translatedData[key] = result.translatedText;
        }
      } else if (Array.isArray(value)) {
        // Handle arrays (like FAQ items, list items, etc.)
        const translatedArray = await Promise.all(
          value.map(async (item) => {
            if (typeof item === "string") {
              const result = await translateText({
                text: item,
                sourceLocale,
                targetLocale,
                contentType: "body",
              });
              return result.success ? result.translatedText : item;
            } else if (typeof item === "object" && item !== null) {
              // Recursively translate object items
              const translatedItem: Record<string, unknown> = { ...item };
              for (const [itemKey, itemValue] of Object.entries(item)) {
                if (typeof itemValue === "string" && itemValue.trim() !== "") {
                  const result = await translateText({
                    text: itemValue,
                    sourceLocale,
                    targetLocale,
                    contentType: itemKey.toLowerCase().includes("title")
                      ? "title"
                      : "body",
                  });
                  if (result.success) {
                    translatedItem[itemKey] = result.translatedText;
                  }
                }
              }
              return translatedItem;
            }
            return item;
          })
        );
        translatedData[key] = translatedArray;
      }
    }

    translatedBlock.data = translatedData;
  }

  return translatedBlock;
}

// Translate full content (title, meta, blocks)
export async function translateContent(
  content: {
    title?: string;
    metaTitle?: string;
    metaDescription?: string;
    blocks?: ContentBlock[];
  },
  sourceLocale: Locale,
  targetLocale: Locale
): Promise<ContentTranslation> {
  const result: ContentTranslation = {};

  // Translate title
  if (content.title) {
    const titleResult = await translateText({
      text: content.title,
      sourceLocale,
      targetLocale,
      contentType: "title",
    });
    if (titleResult.success) {
      result.title = titleResult.translatedText;
    }
  }

  // Translate meta title
  if (content.metaTitle) {
    const metaTitleResult = await translateText({
      text: content.metaTitle,
      sourceLocale,
      targetLocale,
      contentType: "meta",
    });
    if (metaTitleResult.success) {
      result.metaTitle = metaTitleResult.translatedText;
    }
  }

  // Translate meta description
  if (content.metaDescription) {
    const metaDescResult = await translateText({
      text: content.metaDescription,
      sourceLocale,
      targetLocale,
      contentType: "description",
    });
    if (metaDescResult.success) {
      result.metaDescription = metaDescResult.translatedText;
    }
  }

  // Translate blocks
  if (content.blocks && content.blocks.length > 0) {
    result.blocks = await Promise.all(
      content.blocks.map((block) => translateBlock(block, sourceLocale, targetLocale))
    );
  }

  return result;
}

// Translate content to all supported languages
export async function translateToAllLanguages(
  content: {
    title?: string;
    metaTitle?: string;
    metaDescription?: string;
    blocks?: ContentBlock[];
  },
  sourceLocale: Locale = "en",
  targetTiers?: number[] // Optional: only translate to specific tiers
): Promise<Map<Locale, ContentTranslation>> {
  const results = new Map<Locale, ContentTranslation>();

  // Filter locales based on tier if specified
  let targetLocales = SUPPORTED_LOCALES.filter((l) => l.code !== sourceLocale);
  if (targetTiers && targetTiers.length > 0) {
    targetLocales = targetLocales.filter((l) => targetTiers.includes(l.tier));
  }

  // Process translations in batches to avoid rate limiting
  const BATCH_SIZE = 5;
  for (let i = 0; i < targetLocales.length; i += BATCH_SIZE) {
    const batch = targetLocales.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async (locale) => {
        const translation = await translateContent(content, sourceLocale, locale.code);
        return { locale: locale.code, translation };
      })
    );

    for (const { locale, translation } of batchResults) {
      results.set(locale, translation);
    }

    // Small delay between batches to avoid rate limiting
    if (i + BATCH_SIZE < targetLocales.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return results;
}

// Translate tags to a target language
export async function translateTags(
  tags: string[],
  sourceLocale: Locale,
  targetLocale: Locale
): Promise<string[]> {
  if (tags.length === 0) return [];

  const translatedTags = await Promise.all(
    tags.map(async (tag) => {
      const result = await translateText({
        text: tag,
        sourceLocale,
        targetLocale,
        contentType: "title",
      });
      return result.success ? result.translatedText : tag;
    })
  );

  return translatedTags;
}

// Get translation progress for content
export function getTranslationProgress(
  translatedLocales: Locale[],
  targetTiers?: number[]
): { completed: number; total: number; percentage: number } {
  let targetLocales = SUPPORTED_LOCALES;
  if (targetTiers && targetTiers.length > 0) {
    targetLocales = SUPPORTED_LOCALES.filter((l) => targetTiers.includes(l.tier));
  }

  const total = targetLocales.length;
  const completed = translatedLocales.filter((locale) =>
    targetLocales.some((l) => l.code === locale)
  ).length;

  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100),
  };
}
