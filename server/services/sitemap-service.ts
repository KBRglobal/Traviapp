import { SUPPORTED_LOCALES, type Locale } from "@shared/schema";
import { storage } from "../storage";

const BASE_URL = process.env.BASE_URL || "https://travi.world";

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
  alternates?: { locale: Locale; url: string }[];
}

// Generate XML for a single URL entry
function generateUrlXml(url: SitemapUrl): string {
  let xml = "  <url>\n";
  xml += `    <loc>${escapeXml(url.loc)}</loc>\n`;

  if (url.lastmod) {
    xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
  }

  if (url.changefreq) {
    xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
  }

  if (url.priority !== undefined) {
    xml += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
  }

  // Add hreflang alternates using xhtml:link
  if (url.alternates && url.alternates.length > 0) {
    for (const alt of url.alternates) {
      xml += `    <xhtml:link rel="alternate" hreflang="${alt.locale}" href="${escapeXml(alt.url)}" />\n`;
    }
    // Add x-default pointing to English
    const enAlt = url.alternates.find((a) => a.locale === "en");
    if (enAlt) {
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(enAlt.url)}" />\n`;
    }
  }

  xml += "  </url>\n";
  return xml;
}

// Escape special XML characters
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Generate sitemap XML
function generateSitemapXml(urls: SitemapUrl[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  for (const url of urls) {
    xml += generateUrlXml(url);
  }

  xml += "</urlset>";
  return xml;
}

// Generate sitemap index XML
function generateSitemapIndexXml(
  sitemaps: { loc: string; lastmod?: string }[]
): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const sitemap of sitemaps) {
    xml += "  <sitemap>\n";
    xml += `    <loc>${escapeXml(sitemap.loc)}</loc>\n`;
    if (sitemap.lastmod) {
      xml += `    <lastmod>${sitemap.lastmod}</lastmod>\n`;
    }
    xml += "  </sitemap>\n";
  }

  xml += "</sitemapindex>";
  return xml;
}

// Get all URLs for a specific locale
async function getUrlsForLocale(locale: Locale): Promise<SitemapUrl[]> {
  const urls: SitemapUrl[] = [];
  const now = new Date().toISOString().split("T")[0];

  // Static pages
  const staticPages = [
    { path: "", priority: 1.0, changefreq: "daily" as const },
    { path: "/attractions", priority: 0.9, changefreq: "daily" as const },
    { path: "/hotels", priority: 0.9, changefreq: "daily" as const },
    { path: "/dining", priority: 0.8, changefreq: "daily" as const },
    { path: "/districts", priority: 0.8, changefreq: "weekly" as const },
    { path: "/articles", priority: 0.8, changefreq: "daily" as const },
    { path: "/real-estate", priority: 0.9, changefreq: "daily" as const },
    { path: "/events", priority: 0.7, changefreq: "daily" as const },
  ];

  for (const page of staticPages) {
    const alternates = SUPPORTED_LOCALES.map((l) => ({
      locale: l.code,
      url: l.code === "en" 
        ? `${BASE_URL}${page.path || "/"}` 
        : `${BASE_URL}/${l.code}${page.path}`,
    }));

    urls.push({
      loc: locale === "en" 
        ? `${BASE_URL}${page.path || "/"}` 
        : `${BASE_URL}/${locale}${page.path}`,
      lastmod: now,
      changefreq: page.changefreq,
      priority: page.priority,
      alternates,
    });
  }

  // Dynamic content pages
  try {
    const contents = await storage.getContents();
    const publishedContents = contents.filter((c) => c.status === "published");

    for (const content of publishedContents) {
      const contentPath = `/${content.type}/${content.slug}`;
      const lastmod = content.updatedAt
        ? new Date(content.updatedAt).toISOString().split("T")[0]
        : now;

      // Get available translations for this content
      const translations = await storage.getTranslationsByContentId(content.id);
      const availableLocales = ["en", ...translations.map((t) => t.locale)] as Locale[];

      const alternates = availableLocales.map((l) => ({
        locale: l,
        url: l === "en" 
          ? `${BASE_URL}${contentPath}` 
          : `${BASE_URL}/${l}${contentPath}`,
      }));

      // Only add URL if this locale has a translation or is English (original)
      if (locale === "en" || translations.some((t) => t.locale === locale)) {
        urls.push({
          loc: locale === "en" 
            ? `${BASE_URL}${contentPath}` 
            : `${BASE_URL}/${locale}${contentPath}`,
          lastmod,
          changefreq: "weekly",
          priority: 0.7,
          alternates,
        });
      }
    }
  } catch (error) {
    console.error("Error fetching contents for sitemap:", error);
  }

  return urls;
}

// Generate sitemap for a specific locale
export async function generateLocaleSitemap(locale: Locale): Promise<string> {
  const urls = await getUrlsForLocale(locale);
  return generateSitemapXml(urls);
}

// Generate main sitemap index
export async function generateSitemapIndex(): Promise<string> {
  const now = new Date().toISOString().split("T")[0];

  const sitemaps = SUPPORTED_LOCALES.map((locale) => ({
    loc: `${BASE_URL}/sitemap-${locale.code}.xml`,
    lastmod: now,
  }));

  return generateSitemapIndexXml(sitemaps);
}

// Generate all sitemaps (for build time or cron job)
export async function generateAllSitemaps(): Promise<Map<string, string>> {
  const sitemaps = new Map<string, string>();

  // Generate main sitemap index
  sitemaps.set("sitemap.xml", await generateSitemapIndex());

  // Generate locale-specific sitemaps
  for (const locale of SUPPORTED_LOCALES) {
    const sitemapXml = await generateLocaleSitemap(locale.code);
    sitemaps.set(`sitemap-${locale.code}.xml`, sitemapXml);
  }

  return sitemaps;
}

// Generate robots.txt with sitemap reference
export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${BASE_URL}/sitemap.xml

# Locale-specific sitemaps
${SUPPORTED_LOCALES.map((l) => `Sitemap: ${BASE_URL}/sitemap-${l.code}.xml`).join("\n")}

# Disallow admin areas
Disallow: /admin/
Disallow: /api/
`;
}
