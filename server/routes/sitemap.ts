import { Router, Request, Response } from "express";
import { db } from "../db";
import { contents } from "@shared/schema";
import { eq } from "drizzle-orm";

const router = Router();

const BASE_URL = process.env.BASE_URL || "https://travi.com";

// Supported locales (excluding 'en' as it's the default)
const LOCALES = [
  "ar", "hi", "zh", "ru", "ur", "fr",
  "de", "fa", "bn", "fil", "es", "tr",
  "it", "ja", "ko", "he"
];

// Static pages
const STATIC_PAGES = [
  { path: "/", priority: 1.0, changefreq: "daily" },
  { path: "/attractions", priority: 0.9, changefreq: "daily" },
  { path: "/hotels", priority: 0.9, changefreq: "daily" },
  { path: "/dining", priority: 0.9, changefreq: "daily" },
  { path: "/districts", priority: 0.9, changefreq: "weekly" },
  { path: "/events", priority: 0.9, changefreq: "daily" },
  { path: "/articles", priority: 0.8, changefreq: "daily" },
  { path: "/search", priority: 0.7, changefreq: "monthly" },
  { path: "/off-plan", priority: 0.8, changefreq: "weekly" },
  { path: "/dubai/free-things-to-do", priority: 0.8, changefreq: "weekly" },
  { path: "/dubai/laws-for-tourists", priority: 0.7, changefreq: "monthly" },
];

// District pages
const DISTRICT_PAGES = [
  "/districts/downtown-dubai",
  "/districts/dubai-marina",
  "/districts/jbr-jumeirah-beach-residence",
  "/districts/palm-jumeirah",
  "/districts/jumeirah",
  "/districts/business-bay",
  "/districts/old-dubai",
  "/districts/dubai-creek-harbour",
  "/districts/dubai-south",
  "/districts/al-barsha",
  "/districts/difc",
  "/districts/dubai-hills-estate",
  "/districts/jvc",
  "/districts/bluewaters-island",
  "/districts/international-city",
  "/districts/al-karama",
];

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateUrlEntry(
  path: string,
  lastmod?: string,
  priority = 0.8,
  changefreq = "weekly"
): string {
  const alternates = LOCALES.map(
    (locale) =>
      `    <xhtml:link rel="alternate" hreflang="${locale}" href="${BASE_URL}/${locale}${path}" />`
  ).join("\n");

  return `
  <url>
    <loc>${BASE_URL}${path}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${BASE_URL}${path}" />
${alternates}
  </url>`;
}

router.get("/sitemap.xml", async (req: Request, res: Response) => {
  try {
    // Fetch dynamic content from database
    const allContent = await db
      .select()
      .from(contents)
      .where(eq(contents.status, "published"));

    const now = new Date().toISOString().split("T")[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

    // Add static pages
    for (const page of STATIC_PAGES) {
      xml += generateUrlEntry(page.path, now, page.priority, page.changefreq);
    }

    // Add district pages
    for (const path of DISTRICT_PAGES) {
      xml += generateUrlEntry(path, now, 0.8, "weekly");
    }

    // Add dynamic content pages
    for (const content of allContent) {
      const lastmod = content.updatedAt
        ? new Date(content.updatedAt).toISOString().split("T")[0]
        : now;

      let path = "";
      let priority = 0.7;

      switch (content.type) {
        case "attraction":
          path = `/attractions/${content.slug}`;
          priority = 0.8;
          break;
        case "hotel":
          path = `/hotels/${content.slug}`;
          priority = 0.8;
          break;
        case "dining":
          path = `/dining/${content.slug}`;
          priority = 0.7;
          break;
        case "event":
          path = `/events/${content.slug}`;
          priority = 0.7;
          break;
        case "article":
          path = `/articles/${content.slug}`;
          priority = 0.6;
          break;
        case "district":
          path = `/districts/${content.slug}`;
          priority = 0.8;
          break;
        default:
          continue;
      }

      xml += generateUrlEntry(path, lastmod, priority, "weekly");
    }

    xml += "\n</urlset>";

    res.set("Content-Type", "application/xml");
    res.set("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
    res.send(xml);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).send("Error generating sitemap");
  }
});

// Robots.txt
router.get("/robots.txt", (req: Request, res: Response) => {
  const robots = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml

# Disallow admin routes
Disallow: /admin/
Disallow: /api/
`;

  res.set("Content-Type", "text/plain");
  res.send(robots);
});

export default router;
