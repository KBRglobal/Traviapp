/**
 * Hreflang utilities for international SEO
 * Used for generating hreflang tags and sitemap entries
 */

import { SUPPORTED_LOCALES, type Locale } from "./schema";

export interface HreflangLink {
  locale: Locale;
  href: string;
}

export interface HreflangMeta {
  links: HreflangLink[];
  xDefault: string;
}

/**
 * Generates all hreflang links for a specific page
 */
export function generateHreflangLinks(
  pathname: string,
  baseUrl: string,
  availableLocales?: Locale[]
): HreflangMeta {
  // Remove existing locale prefix from pathname
  const cleanPathname = removeLocalePrefix(pathname);

  // Use available locales or all supported locales
  const locales = availableLocales || SUPPORTED_LOCALES.map((l) => l.code);

  const links: HreflangLink[] = locales.map((locale) => ({
    locale,
    href:
      locale === "en"
        ? `${baseUrl}${cleanPathname}`
        : `${baseUrl}/${locale}${cleanPathname === "/" ? "" : cleanPathname}`,
  }));

  return {
    links,
    xDefault: `${baseUrl}${cleanPathname}`, // English as default
  };
}

/**
 * Removes locale prefix from pathname
 */
export function removeLocalePrefix(pathname: string): string {
  const localePattern = SUPPORTED_LOCALES.map((l) => l.code).join("|");
  const regex = new RegExp(`^/(${localePattern})(/|$)`);
  const cleaned = pathname.replace(regex, "/").replace(/\/+/g, "/");
  return cleaned === "" ? "/" : cleaned;
}

/**
 * Gets available translations for a content item
 */
export function getAvailableTranslationsForContent(
  translations: { locale: string; status: string }[]
): Locale[] {
  const availableLocales: Locale[] = ["en"]; // English always available

  translations.forEach((t) => {
    if (t.status === "published" || t.status === "completed") {
      if (!availableLocales.includes(t.locale as Locale)) {
        availableLocales.push(t.locale as Locale);
      }
    }
  });

  return availableLocales;
}

/**
 * Generates hreflang XML for sitemap
 */
export function generateHreflangXml(
  url: string,
  baseUrl: string,
  availableLocales?: Locale[]
): string {
  const hreflang = generateHreflangLinks(new URL(url).pathname, baseUrl, availableLocales);

  const links = hreflang.links
    .map(
      (link) =>
        `    <xhtml:link rel="alternate" hreflang="${link.locale}" href="${link.href}" />`
    )
    .join("\n");

  return `${links}
    <xhtml:link rel="alternate" hreflang="x-default" href="${hreflang.xDefault}" />`;
}

/**
 * Gets the current locale from a path
 */
export function getCurrentLocaleFromPath(pathname: string): Locale {
  const pathParts = pathname.split("/").filter(Boolean);
  const firstPart = pathParts[0];

  if (SUPPORTED_LOCALES.some((l) => l.code === firstPart)) {
    return firstPart as Locale;
  }

  return "en";
}
