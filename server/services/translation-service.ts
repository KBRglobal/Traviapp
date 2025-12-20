import OpenAI from "openai";
import { SUPPORTED_LOCALES, type Locale, type ContentBlock } from "@shared/schema";

// ============================================================================
// TRANSLATION PROVIDERS
// ============================================================================
// Multi-provider translation system for best quality/cost balance:
// - DeepL: Premium quality, best for European languages ($20/M chars) - USE BY DEFAULT
// - GPT-4o-mini: Cost-effective fallback ($0.15/M input) - for unsupported languages

type TranslationProvider = 'deepl' | 'gpt' | 'auto';

// DeepL supported language codes (official codes)
const DEEPL_SUPPORTED_LANGUAGES: Record<string, string> = {
  'en': 'EN',
  'de': 'DE',
  'fr': 'FR',
  'es': 'ES',
  'it': 'IT',
  'nl': 'NL',
  'pl': 'PL',
  'pt': 'PT-BR',
  'ru': 'RU',
  'ja': 'JA',
  'zh': 'ZH',
  'ko': 'KO',
  'ar': 'AR',
  'tr': 'TR',
  'uk': 'UK',
  'id': 'ID',
  'sv': 'SV',
  'da': 'DA',
  'fi': 'FI',
  'nb': 'NB',
  'el': 'EL',
  'cs': 'CS',
  'ro': 'RO',
  'hu': 'HU',
  'sk': 'SK',
  'bg': 'BG',
  'lt': 'LT',
  'lv': 'LV',
  'sl': 'SL',
  'et': 'ET',
};

function isDeepLSupported(locale: string): boolean {
  return locale in DEEPL_SUPPORTED_LANGUAGES;
}

function getDeepLLanguageCode(locale: string): string {
  return DEEPL_SUPPORTED_LANGUAGES[locale] || locale.toUpperCase();
}

// Initialize OpenAI client for fallback translations
function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({
    apiKey,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined,
  });
}

// Translate using DeepL API
async function translateWithDeepL(
  text: string,
  sourceLocale: string,
  targetLocale: string
): Promise<{ text: string; success: boolean; error?: string }> {
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    return { text: '', success: false, error: 'DeepL API key not configured' };
  }

  try {
    const sourceCode = getDeepLLanguageCode(sourceLocale);
    const targetCode = getDeepLLanguageCode(targetLocale);

    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: [text],
        source_lang: sourceCode,
        target_lang: targetCode,
        preserve_formatting: true,
        tag_handling: 'html',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[DeepL] API error: ${response.status} - ${errorText}`);

      // If free API limit exceeded, try pro API
      if (response.status === 456 || response.status === 429) {
        const proResponse = await fetch('https://api.deepl.com/v2/translate', {
          method: 'POST',
          headers: {
            'Authorization': `DeepL-Auth-Key ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: [text],
            source_lang: sourceCode,
            target_lang: targetCode,
            preserve_formatting: true,
            tag_handling: 'html',
          }),
        });

        if (proResponse.ok) {
          const data = await proResponse.json();
          return { text: data.translations[0].text, success: true };
        }
      }

      return { text: '', success: false, error: `DeepL API error: ${response.status}` };
    }

    const data = await response.json();
    return { text: data.translations[0].text, success: true };
  } catch (error) {
    console.error('[DeepL] Translation error:', error);
    return { text: '', success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

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
// Uses DeepL for supported languages (higher quality), falls back to GPT-4o-mini
export async function translateText(
  request: TranslationRequest,
  options?: { provider?: TranslationProvider }
): Promise<TranslationResult> {
  const { text, sourceLocale, targetLocale, contentType = "body" } = request;
  const provider = options?.provider || 'auto';

  if (!text || text.trim() === "") {
    return { translatedText: "", locale: targetLocale, success: true };
  }

  if (sourceLocale === targetLocale) {
    return { translatedText: text, locale: targetLocale, success: true };
  }

  const targetLocaleInfo = SUPPORTED_LOCALES.find((l) => l.code === targetLocale);
  const targetLanguageName = targetLocaleInfo?.name || targetLocale;

  // Try DeepL first for supported languages (better quality)
  const useDeepL = provider === 'deepl' || (provider === 'auto' && isDeepLSupported(targetLocale) && process.env.DEEPL_API_KEY);

  if (useDeepL) {
    console.log(`[Translation] Using DeepL for ${sourceLocale} -> ${targetLocale}`);
    const deeplResult = await translateWithDeepL(text, sourceLocale, targetLocale);

    if (deeplResult.success) {
      return {
        translatedText: deeplResult.text,
        locale: targetLocale,
        success: true,
      };
    }

    // Log the error but continue to fallback
    console.warn(`[Translation] DeepL failed for ${targetLocale}: ${deeplResult.error}, falling back to GPT`);
  }

  // Fallback to GPT-4o-mini (or primary if DeepL not available)
  console.log(`[Translation] Using GPT-4o-mini for ${sourceLocale} -> ${targetLocale}`);

  const contentTypeInstructions = {
    title: "This is a title/heading. Keep it concise, impactful, and SEO-friendly.",
    description:
      "This is a meta description for SEO. Keep it under 160 characters, compelling, and include key search terms.",
    meta: "This is meta content for SEO. Optimize for search engines while being natural.",
    body: "This is body content. Maintain the tone, style, and formatting of the original.",
  };

  try {
    const openai = getOpenAIClient();
    if (!openai) {
      return {
        translatedText: "",
        locale: targetLocale,
        success: false,
        error: "OpenAI client not initialized - check API key",
      };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",  // Cost-effective fallback
      max_tokens: 4096,
      messages: [
        {
          role: "system",
          content: TRANSLATION_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: `Translate the following ${contentType} from ${sourceLocale} to ${targetLanguageName} (${targetLocale}).

${contentTypeInstructions[contentType]}

Text to translate:
${text}`,
        },
      ],
      temperature: 0.3,
    });

    const translatedText = response.choices[0]?.message?.content?.trim() || "";

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

// ============================================================================
// BATCH TRANSLATION API (50% cost savings)
// ============================================================================
// OpenAI Batch API allows sending many requests at once with 24-hour turnaround
// at 50% discount. Perfect for bulk translation of content.

interface BatchTranslationJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requests: Array<{
    customId: string;
    text: string;
    sourceLocale: Locale;
    targetLocale: Locale;
    contentType: "title" | "description" | "body" | "meta";
  }>;
  results?: Map<string, string>;
  createdAt: Date;
  completedAt?: Date;
  batchId?: string;  // OpenAI batch ID
}

// In-memory store for batch jobs (in production, persist to database)
const batchJobs: Map<string, BatchTranslationJob> = new Map();

export const batchTranslation = {
  /**
   * Create a batch translation job for multiple texts
   * Returns a job ID that can be used to check status and retrieve results
   */
  async createBatchJob(
    requests: Array<{
      text: string;
      sourceLocale: Locale;
      targetLocale: Locale;
      contentType?: "title" | "description" | "body" | "meta";
    }>
  ): Promise<string> {
    const openai = getOpenAIClient();
    if (!openai) {
      throw new Error("OpenAI client not configured");
    }

    const jobId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create batch request file (JSONL format)
    const batchRequests = requests.map((req, index) => {
      const targetLocaleInfo = SUPPORTED_LOCALES.find((l) => l.code === req.targetLocale);
      const targetLanguageName = targetLocaleInfo?.name || req.targetLocale;
      const contentType = req.contentType || "body";

      const contentTypeInstructions: Record<string, string> = {
        title: "This is a title/heading. Keep it concise, impactful, and SEO-friendly.",
        description: "This is a meta description for SEO. Keep it under 160 characters, compelling, and include key search terms.",
        meta: "This is meta content for SEO. Optimize for search engines while being natural.",
        body: "This is body content. Maintain the tone, style, and formatting of the original.",
      };

      return {
        custom_id: `req_${index}`,
        method: "POST",
        url: "/v1/chat/completions",
        body: {
          model: "gpt-4o-mini",
          max_tokens: 4096,
          messages: [
            { role: "system", content: TRANSLATION_SYSTEM_PROMPT },
            {
              role: "user",
              content: `Translate the following ${contentType} from ${req.sourceLocale} to ${targetLanguageName} (${req.targetLocale}).

${contentTypeInstructions[contentType]}

Text to translate:
${req.text}`,
            },
          ],
          temperature: 0.3,
        },
      };
    });

    try {
      // Convert to JSONL
      const jsonlContent = batchRequests.map(r => JSON.stringify(r)).join('\n');
      const jsonlBlob = new Blob([jsonlContent], { type: 'application/jsonl' });

      // Upload file to OpenAI
      const file = await openai.files.create({
        file: jsonlBlob as any,
        purpose: 'batch',
      });

      // Create batch
      const batch = await openai.batches.create({
        input_file_id: file.id,
        endpoint: '/v1/chat/completions',
        completion_window: '24h',
      });

      // Store job
      const job: BatchTranslationJob = {
        id: jobId,
        status: 'processing',
        requests: requests.map((req, index) => ({
          customId: `req_${index}`,
          text: req.text,
          sourceLocale: req.sourceLocale,
          targetLocale: req.targetLocale,
          contentType: req.contentType || "body",
        })),
        createdAt: new Date(),
        batchId: batch.id,
      };

      batchJobs.set(jobId, job);
      return jobId;
    } catch (error) {
      console.error("Error creating batch translation job:", error);
      throw error;
    }
  },

  /**
   * Check status of a batch translation job
   */
  async getJobStatus(jobId: string): Promise<BatchTranslationJob | null> {
    const job = batchJobs.get(jobId);
    if (!job) return null;

    if (job.status === 'processing' && job.batchId) {
      const openai = getOpenAIClient();
      if (!openai) return job;

      try {
        const batch = await openai.batches.retrieve(job.batchId);

        if (batch.status === 'completed') {
          // Download results
          if (batch.output_file_id) {
            const outputFile = await openai.files.content(batch.output_file_id);
            const outputContent = await outputFile.text();

            // Parse JSONL results
            const results = new Map<string, string>();
            for (const line of outputContent.split('\n').filter(Boolean)) {
              const result = JSON.parse(line);
              const translation = result.response?.body?.choices?.[0]?.message?.content?.trim();
              if (translation) {
                results.set(result.custom_id, translation);
              }
            }

            job.status = 'completed';
            job.results = results;
            job.completedAt = new Date();
          }
        } else if (batch.status === 'failed' || batch.status === 'expired' || batch.status === 'cancelled') {
          job.status = 'failed';
        }
      } catch (error) {
        console.error("Error checking batch status:", error);
      }
    }

    return job;
  },

  /**
   * Get results from a completed batch job
   */
  async getResults(jobId: string): Promise<Map<string, string> | null> {
    const job = await this.getJobStatus(jobId);
    if (!job || job.status !== 'completed') return null;
    return job.results || null;
  },

  /**
   * Translate content to all languages using batch API (50% cheaper, 24h turnaround)
   * Returns job ID for tracking
   */
  async translateContentBatch(
    content: {
      title?: string;
      metaTitle?: string;
      metaDescription?: string;
    },
    sourceLocale: Locale = "en",
    targetTiers?: number[]
  ): Promise<string> {
    let targetLocales = SUPPORTED_LOCALES.filter((l) => l.code !== sourceLocale);
    if (targetTiers && targetTiers.length > 0) {
      targetLocales = targetLocales.filter((l) => targetTiers.includes(l.tier));
    }

    const requests: Array<{
      text: string;
      sourceLocale: Locale;
      targetLocale: Locale;
      contentType: "title" | "description" | "body" | "meta";
    }> = [];

    for (const locale of targetLocales) {
      if (content.title) {
        requests.push({
          text: content.title,
          sourceLocale,
          targetLocale: locale.code,
          contentType: "title",
        });
      }
      if (content.metaTitle) {
        requests.push({
          text: content.metaTitle,
          sourceLocale,
          targetLocale: locale.code,
          contentType: "meta",
        });
      }
      if (content.metaDescription) {
        requests.push({
          text: content.metaDescription,
          sourceLocale,
          targetLocale: locale.code,
          contentType: "description",
        });
      }
    }

    return this.createBatchJob(requests);
  },
};
