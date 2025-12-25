import { SUPPORTED_LOCALES, type Locale, type ContentBlock } from "@shared/schema";
import { generateContentHash } from "./translation-service";

const DEEPL_API_URL = "https://api-free.deepl.com/v2";
const DEEPL_PRO_API_URL = "https://api.deepl.com/v2";

const DEEPL_LANGUAGE_MAP: Record<Locale, string> = {
  en: "EN",
  ar: "AR",
  hi: "HI",
  zh: "ZH",
  ru: "RU",
  ur: "UR", // DeepL doesn't support Urdu natively, will fallback
  fr: "FR",
  de: "DE",
  fa: "FA", // DeepL doesn't support Persian natively, will fallback
  bn: "BN", // DeepL doesn't support Bengali natively, will fallback
  fil: "FIL", // DeepL doesn't support Filipino natively, will fallback
  es: "ES",
  tr: "TR",
  it: "IT",
  ja: "JA",
  ko: "KO",
  he: "HE", // DeepL doesn't support Hebrew natively, will fallback
};

const DEEPL_SUPPORTED_LANGUAGES = ["EN", "AR", "ZH", "RU", "FR", "DE", "ES", "TR", "IT", "JA", "KO", "PT", "NL", "PL", "SV", "DA", "FI", "EL", "CS", "RO", "HU", "SK", "BG", "SL", "ET", "LV", "LT", "ID", "UK"];

interface DeepLTranslationRequest {
  text: string[];
  target_lang: string;
  source_lang?: string;
  formality?: "default" | "more" | "less" | "prefer_more" | "prefer_less";
  preserve_formatting?: boolean;
  tag_handling?: "xml" | "html";
  split_sentences?: "0" | "1" | "nonewlines";
}

interface DeepLTranslationResponse {
  translations: Array<{
    detected_source_language: string;
    text: string;
  }>;
}

interface DeepLUsageResponse {
  character_count: number;
  character_limit: number;
}

interface TranslationResult {
  translatedText: string;
  locale: Locale;
  success: boolean;
  error?: string;
  provider: "deepl" | "fallback";
}

interface ContentTranslation {
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  blocks?: ContentBlock[];
  sourceHash: string;
}

function getDeepLApiKey(): string | null {
  return process.env.DEEPL_API_KEY || process.env.DeepL || null;
}

function getApiUrl(): string {
  const apiKey = getDeepLApiKey();
  if (!apiKey) return DEEPL_API_URL;
  return apiKey.endsWith(":fx") ? DEEPL_API_URL : DEEPL_PRO_API_URL;
}

function isDeepLSupported(locale: Locale): boolean {
  const deeplLang = DEEPL_LANGUAGE_MAP[locale];
  return DEEPL_SUPPORTED_LANGUAGES.includes(deeplLang);
}

// generateContentHash is imported from translation-service.ts (single source of truth)

export async function translateWithDeepL(
  texts: string[],
  targetLocale: Locale,
  sourceLocale: Locale = "en"
): Promise<TranslationResult[]> {
  const apiKey = getDeepLApiKey();
  
  if (!apiKey) {
    console.warn("DeepL API key not configured, translations will be skipped");
    return texts.map((text) => ({
      translatedText: text,
      locale: targetLocale,
      success: false,
      error: "DeepL API key not configured",
      provider: "fallback",
    }));
  }

  if (!isDeepLSupported(targetLocale)) {
    console.warn(`DeepL does not support ${targetLocale}, using fallback`);
    return texts.map((text) => ({
      translatedText: text,
      locale: targetLocale,
      success: false,
      error: `Language ${targetLocale} not supported by DeepL`,
      provider: "fallback",
    }));
  }

  const filteredTexts = texts.filter((t) => t && t.trim() !== "");
  if (filteredTexts.length === 0) {
    return texts.map((text) => ({
      translatedText: text,
      locale: targetLocale,
      success: true,
      provider: "deepl",
    }));
  }

  try {
    const requestBody: DeepLTranslationRequest = {
      text: filteredTexts,
      target_lang: DEEPL_LANGUAGE_MAP[targetLocale],
      source_lang: DEEPL_LANGUAGE_MAP[sourceLocale],
      preserve_formatting: true,
      tag_handling: "html",
      split_sentences: "nonewlines",
    };

    const response = await fetch(`${getApiUrl()}/translate`, {
      method: "POST",
      headers: {
        "Authorization": `DeepL-Auth-Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`DeepL API error: ${response.status} - ${errorText}`);
    }

    const data: DeepLTranslationResponse = await response.json();
    
    let translationIndex = 0;
    return texts.map((originalText) => {
      if (!originalText || originalText.trim() === "") {
        return {
          translatedText: originalText,
          locale: targetLocale,
          success: true,
          provider: "deepl" as const,
        };
      }
      
      const translation = data.translations[translationIndex++];
      return {
        translatedText: translation?.text || originalText,
        locale: targetLocale,
        success: true,
        provider: "deepl" as const,
      };
    });
  } catch (error) {
    console.error("DeepL translation error:", error);
    return texts.map((text) => ({
      translatedText: text,
      locale: targetLocale,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      provider: "fallback" as const,
    }));
  }
}

export async function translateText(
  text: string,
  targetLocale: Locale,
  sourceLocale: Locale = "en"
): Promise<TranslationResult> {
  const results = await translateWithDeepL([text], targetLocale, sourceLocale);
  return results[0];
}

async function translateBlock(
  block: ContentBlock,
  targetLocale: Locale,
  sourceLocale: Locale = "en"
): Promise<ContentBlock> {
  const translatedBlock = { ...block };

  if (!block.data) {
    return translatedBlock;
  }

  const translatedData: Record<string, unknown> = { ...block.data };
  const textsToTranslate: Array<{ key: string; value: string }> = [];

  for (const [key, value] of Object.entries(block.data)) {
    if (typeof value === "string" && value.trim() !== "") {
      if (
        key.toLowerCase().includes("url") ||
        key.toLowerCase().includes("src") ||
        key.toLowerCase().includes("id") ||
        key.toLowerCase().includes("href")
      ) {
        continue;
      }
      textsToTranslate.push({ key, value });
    }
  }

  if (textsToTranslate.length > 0) {
    const results = await translateWithDeepL(
      textsToTranslate.map((t) => t.value),
      targetLocale,
      sourceLocale
    );

    results.forEach((result, index) => {
      if (result.success) {
        translatedData[textsToTranslate[index].key] = result.translatedText;
      }
    });
  }

  for (const [key, value] of Object.entries(block.data)) {
    if (Array.isArray(value)) {
      const translatedArray = await Promise.all(
        value.map(async (item) => {
          if (typeof item === "string") {
            const result = await translateText(item, targetLocale, sourceLocale);
            return result.success ? result.translatedText : item;
          } else if (typeof item === "object" && item !== null) {
            const translatedItem: Record<string, unknown> = { ...item };
            const itemTexts: Array<{ key: string; value: string }> = [];

            for (const [itemKey, itemValue] of Object.entries(item)) {
              if (typeof itemValue === "string" && itemValue.trim() !== "") {
                if (
                  !itemKey.toLowerCase().includes("url") &&
                  !itemKey.toLowerCase().includes("src") &&
                  !itemKey.toLowerCase().includes("id")
                ) {
                  itemTexts.push({ key: itemKey, value: itemValue });
                }
              }
            }

            if (itemTexts.length > 0) {
              const itemResults = await translateWithDeepL(
                itemTexts.map((t) => t.value),
                targetLocale,
                sourceLocale
              );
              itemResults.forEach((result, idx) => {
                if (result.success) {
                  translatedItem[itemTexts[idx].key] = result.translatedText;
                }
              });
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
  return translatedBlock;
}

export async function translateContent(
  content: {
    title?: string;
    metaTitle?: string;
    metaDescription?: string;
    blocks?: ContentBlock[];
  },
  targetLocale: Locale,
  sourceLocale: Locale = "en"
): Promise<ContentTranslation> {
  const sourceHash = generateContentHash(content);
  const result: ContentTranslation = { sourceHash };

  const textsToTranslate: string[] = [];
  const textKeys: string[] = [];

  if (content.title) {
    textsToTranslate.push(content.title);
    textKeys.push("title");
  }
  if (content.metaTitle) {
    textsToTranslate.push(content.metaTitle);
    textKeys.push("metaTitle");
  }
  if (content.metaDescription) {
    textsToTranslate.push(content.metaDescription);
    textKeys.push("metaDescription");
  }

  if (textsToTranslate.length > 0) {
    const results = await translateWithDeepL(textsToTranslate, targetLocale, sourceLocale);
    results.forEach((translationResult, index) => {
      if (translationResult.success) {
        (result as any)[textKeys[index]] = translationResult.translatedText;
      }
    });
  }

  if (content.blocks && content.blocks.length > 0) {
    result.blocks = await Promise.all(
      content.blocks.map((block) => translateBlock(block, targetLocale, sourceLocale))
    );
  }

  return result;
}

export async function translateToMultipleLanguages(
  content: {
    title?: string;
    metaTitle?: string;
    metaDescription?: string;
    blocks?: ContentBlock[];
  },
  targetLocales: Locale[],
  sourceLocale: Locale = "en"
): Promise<Map<Locale, ContentTranslation>> {
  const results = new Map<Locale, ContentTranslation>();
  
  const BATCH_SIZE = 3;
  for (let i = 0; i < targetLocales.length; i += BATCH_SIZE) {
    const batch = targetLocales.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async (locale) => {
        const translation = await translateContent(content, locale, sourceLocale);
        return { locale, translation };
      })
    );

    for (const { locale, translation } of batchResults) {
      results.set(locale, translation);
    }

    if (i + BATCH_SIZE < targetLocales.length) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return results;
}

export async function getDeepLUsage(): Promise<DeepLUsageResponse | null> {
  const apiKey = getDeepLApiKey();
  if (!apiKey) return null;

  try {
    const response = await fetch(`${getApiUrl()}/usage`, {
      method: "GET",
      headers: {
        "Authorization": `DeepL-Auth-Key ${apiKey}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch {
    return null;
  }
}

export async function translateUiStrings(
  strings: Record<string, string>,
  targetLocale: Locale,
  sourceLocale: Locale = "en"
): Promise<Record<string, string>> {
  const keys = Object.keys(strings);
  const values = Object.values(strings);
  
  const results = await translateWithDeepL(values, targetLocale, sourceLocale);
  
  const translatedStrings: Record<string, string> = {};
  keys.forEach((key, index) => {
    translatedStrings[key] = results[index].success 
      ? results[index].translatedText 
      : values[index];
  });
  
  return translatedStrings;
}

export function getDeepLSupportedLocales(): Locale[] {
  return SUPPORTED_LOCALES
    .filter((l) => isDeepLSupported(l.code))
    .map((l) => l.code);
}

export function getUnsupportedLocales(): Locale[] {
  return SUPPORTED_LOCALES
    .filter((l) => !isDeepLSupported(l.code))
    .map((l) => l.code);
}
