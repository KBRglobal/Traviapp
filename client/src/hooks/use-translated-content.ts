import { useQuery } from "@tanstack/react-query";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import type { ContentWithRelations } from "@shared/schema";

interface TranslatedContent {
  id: number;
  contentId: number;
  locale: string;
  title: string;
  metaDescription: string | null;
  metaKeywords: string[] | null;
  blocks: any[] | null;
  status: string;
  translationProvider: string | null;
}

export function useTranslatedContent(contentId: number | undefined) {
  const { locale } = useLocale();

  return useQuery<TranslatedContent | null>({
    queryKey: ["/api/translations", contentId, locale],
    queryFn: async () => {
      if (!contentId || locale === "en") return null;
      const response = await fetch(`/api/translations/${contentId}/${locale}`);
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!contentId && locale !== "en",
  });
}

export function useTranslatedContents(contents: ContentWithRelations[] | undefined) {
  const { locale } = useLocale();

  return useQuery<Map<number, TranslatedContent>>({
    queryKey: ["/api/translations/batch", locale, contents?.map(c => c.id).join(",")],
    queryFn: async () => {
      if (!contents || contents.length === 0 || locale === "en") {
        return new Map();
      }

      const translations = new Map<number, TranslatedContent>();
      
      const responses = await Promise.all(
        contents.map(async (content) => {
          try {
            const response = await fetch(`/api/translations/${content.id}/${locale}`);
            if (response.ok) {
              const translation = await response.json();
              return { contentId: content.id, translation };
            }
          } catch {
          }
          return null;
        })
      );

      responses.forEach((result) => {
        if (result && typeof result.contentId === "number") {
          translations.set(result.contentId, result.translation);
        }
      });

      return translations;
    },
    enabled: !!contents && contents.length > 0 && locale !== "en",
  });
}

export function getTranslatedTitle(
  content: ContentWithRelations,
  translation: TranslatedContent | null | undefined
): string {
  return translation?.title || content.title;
}

export function getTranslatedDescription(
  content: ContentWithRelations,
  translation: TranslatedContent | null | undefined
): string {
  return translation?.metaDescription || content.metaDescription || "";
}

export function getTranslatedBlocks(
  content: ContentWithRelations,
  translation: TranslatedContent | null | undefined
): any[] {
  return translation?.blocks || content.blocks || [];
}
