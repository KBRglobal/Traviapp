/**
 * Smart Image Selection System
 * Intelligent image selection based on content analysis, Freepik search, and AI fallback
 */

import { SEO_RULES, extractTextFromBlocks, getFirstParagraph, calculateKeywordDensity } from "@shared/seo-rules";

// ============================================================================
// DUBAI AREA DEFINITIONS
// ============================================================================

export const DUBAI_AREAS = {
  downtown: {
    name: "Downtown Dubai",
    nameHe: "דאונטאון דובאי",
    identifiers: ["burj khalifa", "dubai mall", "boulevard", "fountains", "opera"],
    style: {
      timeOfDay: ["blue hour", "night", "sunset"],
      vibe: ["luxury", "modern", "iconic", "premium"],
      mustShow: ["skyline", "burj khalifa silhouette", "modern architecture"],
      avoid: ["construction", "traffic", "crowds"],
    },
    searchKeywords: ["downtown dubai", "burj khalifa view", "dubai mall area"],
  },
  businessBay: {
    name: "Business Bay",
    nameHe: "ביזנס ביי",
    identifiers: ["business bay", "canal", "jw marriott marquis", "dorchester"],
    style: {
      timeOfDay: ["day", "sunset", "golden hour"],
      vibe: ["business", "modern", "clean", "professional"],
      mustShow: ["water canal", "modern towers", "waterfront"],
      avoid: ["construction", "unfinished buildings"],
    },
    searchKeywords: ["business bay dubai", "dubai canal", "business bay waterfront"],
  },
  marina: {
    name: "Dubai Marina",
    nameHe: "דובאי מרינה",
    identifiers: ["marina", "marina walk", "marina mall", "yacht club"],
    style: {
      timeOfDay: ["sunset", "evening", "golden hour"],
      vibe: ["urban", "lifestyle", "waterfront", "vibrant"],
      mustShow: ["yachts", "promenade", "towers", "waterfront dining"],
      avoid: ["construction cranes", "empty promenade"],
    },
    searchKeywords: ["dubai marina", "marina walk", "marina waterfront"],
  },
  jbr: {
    name: "JBR - Jumeirah Beach Residence",
    nameHe: "JBR - חוף ג'ומיירה",
    identifiers: ["jbr", "the walk", "jumeirah beach residence", "ain dubai"],
    style: {
      timeOfDay: ["day", "afternoon", "sunset"],
      vibe: ["beach", "family", "tourist", "relaxed"],
      mustShow: ["beach", "the walk", "outdoor activities"],
      avoid: ["overcrowded", "construction"],
    },
    searchKeywords: ["jbr dubai", "jumeirah beach", "the walk jbr"],
  },
  palm: {
    name: "Palm Jumeirah",
    nameHe: "פאלם ג'ומיירה",
    identifiers: ["palm", "atlantis", "palm jumeirah", "fairmont palm", "one&only"],
    style: {
      timeOfDay: ["sunset", "golden hour", "day"],
      vibe: ["luxury", "resort", "exclusive", "beachfront"],
      mustShow: ["private beach", "pool", "resort architecture", "palm shape view"],
      avoid: ["construction", "empty beaches"],
    },
    searchKeywords: ["palm jumeirah", "atlantis dubai", "palm beach resort"],
  },
  jumeirah: {
    name: "Jumeirah",
    nameHe: "ג'ומיירה",
    identifiers: ["jumeirah", "burj al arab", "madinat", "jumeirah beach"],
    style: {
      timeOfDay: ["day", "golden hour", "sunset"],
      vibe: ["luxury", "classic", "elegant", "relaxed"],
      mustShow: ["burj al arab", "beach", "villas"],
      avoid: ["traffic", "construction"],
    },
    searchKeywords: ["jumeirah dubai", "burj al arab", "madinat jumeirah"],
  },
  difc: {
    name: "DIFC",
    nameHe: "DIFC - מרכז פיננסי",
    identifiers: ["difc", "gate building", "financial centre"],
    style: {
      timeOfDay: ["evening", "night", "sunset"],
      vibe: ["business luxury", "fine dining", "art", "sophisticated"],
      mustShow: ["gate building", "galleries", "restaurants"],
      avoid: ["empty streets", "daytime ordinary"],
    },
    searchKeywords: ["difc dubai", "gate village", "difc restaurants"],
  },
  alSeef: {
    name: "Al Seef",
    nameHe: "אל סיף",
    identifiers: ["al seef", "creek", "abra", "heritage"],
    style: {
      timeOfDay: ["golden hour", "sunset", "day"],
      vibe: ["heritage", "traditional", "warm", "authentic"],
      mustShow: ["creek", "traditional boats", "heritage buildings"],
      avoid: ["modern elements", "cars"],
    },
    searchKeywords: ["al seef dubai", "dubai creek heritage", "old dubai"],
  },
  deira: {
    name: "Deira",
    nameHe: "דיירה",
    identifiers: ["deira", "gold souk", "spice souk", "old deira"],
    style: {
      timeOfDay: ["day", "golden hour"],
      vibe: ["authentic", "traditional", "vibrant", "cultural"],
      mustShow: ["souks", "gold displays", "spices", "local life"],
      avoid: ["tourist traps", "overly staged"],
    },
    searchKeywords: ["deira dubai", "gold souk", "spice souk dubai"],
  },
  creekHarbour: {
    name: "Dubai Creek Harbour",
    nameHe: "דובאי קריק הארבור",
    identifiers: ["creek harbour", "creek tower", "harbour"],
    style: {
      timeOfDay: ["sunset", "evening", "day"],
      vibe: ["modern", "future", "waterfront", "new"],
      mustShow: ["promenade", "waterfront", "modern architecture"],
      avoid: ["construction", "empty areas"],
    },
    searchKeywords: ["creek harbour dubai", "dubai creek tower"],
  },
  dubaiHills: {
    name: "Dubai Hills",
    nameHe: "דובאי הילס",
    identifiers: ["dubai hills", "hills mall", "hills estate"],
    style: {
      timeOfDay: ["day", "golden hour"],
      vibe: ["family", "green", "modern", "suburban"],
      mustShow: ["parks", "mall", "family areas"],
      avoid: ["empty streets"],
    },
    searchKeywords: ["dubai hills", "dubai hills mall", "dubai hills estate"],
  },
  expo: {
    name: "Expo City Dubai",
    nameHe: "אקספו סיטי דובאי",
    identifiers: ["expo", "expo city", "terra", "al wasl"],
    style: {
      timeOfDay: ["day", "evening"],
      vibe: ["innovative", "modern", "futuristic", "events"],
      mustShow: ["expo architecture", "dome", "pavilions"],
      avoid: ["empty spaces during non-events"],
    },
    searchKeywords: ["expo city dubai", "expo 2020 site", "terra pavilion"],
  },
  desert: {
    name: "Dubai Desert",
    nameHe: "מדבר דובאי",
    identifiers: ["desert", "safari", "dunes", "bedouin"],
    style: {
      timeOfDay: ["sunrise", "sunset only"],
      vibe: ["adventure", "premium", "authentic", "magical"],
      mustShow: ["dunes", "4x4", "sunset colors", "camps"],
      avoid: ["midday harsh light", "tourist crowds"],
    },
    searchKeywords: ["dubai desert safari", "arabian desert dunes", "desert sunset dubai"],
  },
} as const;

export type DubaiArea = keyof typeof DUBAI_AREAS;

// ============================================================================
// IMAGE SLOT DEFINITIONS BY CONTENT TYPE
// ============================================================================

export interface ImageSlot {
  id: string;
  role: "hero" | "interior" | "experience" | "practical" | "usp" | "food" | "ambiance";
  title: string;
  titleHe: string;
  description: string;
  required: boolean;
  searchPriority: string[];
  mustShow: string[];
  avoid: string[];
  preferredStyle: {
    angle?: "wide" | "medium" | "close-up";
    lighting?: "natural" | "golden" | "night" | "blue hour";
    mood?: "luxury" | "family" | "romantic" | "practical" | "vibrant";
  };
}

export const IMAGE_SLOTS_BY_TYPE: Record<string, ImageSlot[]> = {
  hotel: [
    {
      id: "hotel-hero",
      role: "hero",
      title: "Hotel Exterior/Icon",
      titleHe: "חזית המלון",
      description: "Main identifying image - exterior or signature feature",
      required: true,
      searchPriority: ["exterior", "facade", "pool overview", "beach view"],
      mustShow: ["hotel building", "brand identity", "premium feel"],
      avoid: ["construction", "bad angles", "empty spaces"],
      preferredStyle: { angle: "wide", lighting: "golden", mood: "luxury" },
    },
    {
      id: "hotel-room",
      role: "interior",
      title: "Room/Suite",
      titleHe: "חדר/סוויטה",
      description: "Room interior showing bed, space, view if available",
      required: true,
      searchPriority: ["room", "suite", "bedroom", "bed"],
      mustShow: ["bed", "space", "window/view"],
      avoid: ["messy", "dark", "narrow angles"],
      preferredStyle: { angle: "wide", lighting: "natural", mood: "luxury" },
    },
    {
      id: "hotel-amenity",
      role: "experience",
      title: "Main Amenity",
      titleHe: "אמניטי מרכזי",
      description: "Pool, spa, beach, rooftop - main differentiator",
      required: true,
      searchPriority: ["pool", "spa", "beach", "rooftop"],
      mustShow: ["the amenity in use or ready", "quality"],
      avoid: ["empty", "maintenance", "crowded"],
      preferredStyle: { angle: "medium", lighting: "golden", mood: "luxury" },
    },
    {
      id: "hotel-dining",
      role: "ambiance",
      title: "Restaurant/Lobby",
      titleHe: "מסעדה/לובי",
      description: "Dining or social spaces showing lifestyle",
      required: true,
      searchPriority: ["restaurant", "lobby", "bar", "lounge"],
      mustShow: ["atmosphere", "quality", "lifestyle"],
      avoid: ["empty", "staff only", "back areas"],
      preferredStyle: { angle: "medium", lighting: "natural", mood: "vibrant" },
    },
    {
      id: "hotel-usp",
      role: "usp",
      title: "Unique Feature/View",
      titleHe: "פיצ'ר ייחודי",
      description: "What makes this hotel special - view, architecture, unique space",
      required: false,
      searchPriority: ["view", "unique", "architecture", "special"],
      mustShow: ["differentiating element"],
      avoid: ["generic", "common"],
      preferredStyle: { angle: "medium", lighting: "golden", mood: "luxury" },
    },
  ],
  attraction: [
    {
      id: "attraction-hero",
      role: "hero",
      title: "Main Identification",
      titleHe: "זיהוי ראשי",
      description: "Exterior or entrance that immediately identifies the attraction",
      required: true,
      searchPriority: ["entrance", "exterior", "sign", "facade"],
      mustShow: ["clear identification", "scale"],
      avoid: ["construction", "crowds blocking view"],
      preferredStyle: { angle: "wide", lighting: "natural", mood: "vibrant" },
    },
    {
      id: "attraction-inside",
      role: "interior",
      title: "Inside/Highlight",
      titleHe: "בפנים/שיא",
      description: "The main thing people come to see",
      required: true,
      searchPriority: ["interior", "main attraction", "exhibit", "view"],
      mustShow: ["the experience", "quality"],
      avoid: ["maintenance", "closed areas"],
      preferredStyle: { angle: "wide", lighting: "natural", mood: "vibrant" },
    },
    {
      id: "attraction-action",
      role: "experience",
      title: "Experience/Action",
      titleHe: "חוויה/פעילות",
      description: "People enjoying the attraction - shows energy and scale",
      required: true,
      searchPriority: ["visitors", "action", "experience", "activity"],
      mustShow: ["people having fun", "scale of experience"],
      avoid: ["empty", "overcrowded chaos"],
      preferredStyle: { angle: "medium", lighting: "natural", mood: "family" },
    },
    {
      id: "attraction-practical",
      role: "practical",
      title: "Practical Info",
      titleHe: "מידע פרקטי",
      description: "Entrance, tickets, metro, parking - reduces friction",
      required: true,
      searchPriority: ["entrance", "tickets", "metro station", "parking"],
      mustShow: ["practical element", "helpful"],
      avoid: ["confusing", "outdated"],
      preferredStyle: { angle: "medium", lighting: "natural", mood: "practical" },
    },
  ],
  restaurant: [
    {
      id: "restaurant-hero",
      role: "hero",
      title: "Interior/Facade",
      titleHe: "פנים/חזית",
      description: "Main impression - interior or exterior with sign",
      required: true,
      searchPriority: ["interior", "facade", "entrance", "dining room"],
      mustShow: ["atmosphere", "style", "quality"],
      avoid: ["empty", "messy", "kitchen chaos"],
      preferredStyle: { angle: "wide", lighting: "golden", mood: "romantic" },
    },
    {
      id: "restaurant-signature",
      role: "food",
      title: "Signature Dish",
      titleHe: "מנה חתימה",
      description: "The dish that defines the restaurant",
      required: true,
      searchPriority: ["signature dish", "main course", "specialty"],
      mustShow: ["plating", "quality", "appetizing"],
      avoid: ["half eaten", "poor lighting", "plastic"],
      preferredStyle: { angle: "close-up", lighting: "natural", mood: "luxury" },
    },
    {
      id: "restaurant-ambiance",
      role: "ambiance",
      title: "Diners/Atmosphere",
      titleHe: "סועדים/אווירה",
      description: "The dining experience - tables, service, vibe",
      required: true,
      searchPriority: ["dining", "tables", "atmosphere", "guests"],
      mustShow: ["atmosphere", "service quality"],
      avoid: ["empty restaurant", "chaotic"],
      preferredStyle: { angle: "medium", lighting: "natural", mood: "vibrant" },
    },
    {
      id: "restaurant-usp",
      role: "usp",
      title: "Unique Element",
      titleHe: "אלמנט ייחודי",
      description: "What sets it apart - view, bar, terrace, design",
      required: true,
      searchPriority: ["rooftop", "terrace", "bar", "view", "design"],
      mustShow: ["differentiating element"],
      avoid: ["generic"],
      preferredStyle: { angle: "wide", lighting: "golden", mood: "romantic" },
    },
    {
      id: "restaurant-additional",
      role: "food",
      title: "Additional Dish/Cocktail",
      titleHe: "מנה/קוקטייל נוסף",
      description: "Shows variety and supports the story",
      required: false,
      searchPriority: ["cocktail", "dessert", "appetizer", "drink"],
      mustShow: ["variety", "quality"],
      avoid: ["repetitive", "poor quality"],
      preferredStyle: { angle: "close-up", lighting: "natural", mood: "luxury" },
    },
  ],
  article: [
    {
      id: "article-hero",
      role: "hero",
      title: "Main Visual",
      titleHe: "תמונה ראשית",
      description: "Captures the essence of the article topic",
      required: true,
      searchPriority: ["main topic", "location", "subject"],
      mustShow: ["article subject", "context"],
      avoid: ["generic stock", "irrelevant"],
      preferredStyle: { angle: "wide", lighting: "natural", mood: "vibrant" },
    },
    {
      id: "article-context",
      role: "interior",
      title: "Context/Location",
      titleHe: "הקשר/מיקום",
      description: "Where this happens in Dubai",
      required: true,
      searchPriority: ["location", "area", "landmark"],
      mustShow: ["Dubai context", "location"],
      avoid: ["could be anywhere"],
      preferredStyle: { angle: "wide", lighting: "natural", mood: "practical" },
    },
    {
      id: "article-detail",
      role: "experience",
      title: "Experience/Detail",
      titleHe: "חוויה/פרט",
      description: "A closer look at what the article describes",
      required: true,
      searchPriority: ["detail", "close-up", "experience"],
      mustShow: ["relevant detail"],
      avoid: ["random", "unrelated"],
      preferredStyle: { angle: "medium", lighting: "natural", mood: "vibrant" },
    },
    {
      id: "article-practical",
      role: "practical",
      title: "Practical Element",
      titleHe: "אלמנט פרקטי",
      description: "Helpful practical information",
      required: false,
      searchPriority: ["practical", "how-to", "info"],
      mustShow: ["useful information"],
      avoid: ["confusing"],
      preferredStyle: { angle: "medium", lighting: "natural", mood: "practical" },
    },
  ],
};

// ============================================================================
// CONTENT ANALYSIS
// ============================================================================

export interface ContentAnalysis {
  // What the article is about
  mainTopic: string;
  subTopics: string[];

  // Location
  area: DubaiArea | null;
  areaConfidence: number;
  specificLocation?: string;

  // Target audience
  audience: ("families" | "luxury" | "couples" | "business" | "budget" | "adventure")[];

  // Tone
  tone: "luxury" | "practical" | "exciting" | "relaxed" | "informative";

  // Visual elements mentioned
  visualElements: string[];

  // Keywords for image search
  searchKeywords: string[];
}

export function analyzeContent(
  title: string,
  content: string,
  type: string,
  existingKeywords?: string[]
): ContentAnalysis {
  const text = `${title} ${content}`.toLowerCase();

  // Detect area
  let detectedArea: DubaiArea | null = null;
  let areaConfidence = 0;

  for (const [areaKey, areaData] of Object.entries(DUBAI_AREAS)) {
    const matches = areaData.identifiers.filter(id => text.includes(id.toLowerCase()));
    if (matches.length > areaConfidence) {
      areaConfidence = matches.length;
      detectedArea = areaKey as DubaiArea;
    }
  }

  // Detect audience
  const audience: ContentAnalysis["audience"] = [];
  if (text.includes("family") || text.includes("kids") || text.includes("children")) {
    audience.push("families");
  }
  if (text.includes("luxury") || text.includes("premium") || text.includes("exclusive")) {
    audience.push("luxury");
  }
  if (text.includes("romantic") || text.includes("couples") || text.includes("honeymoon")) {
    audience.push("couples");
  }
  if (text.includes("business") || text.includes("corporate") || text.includes("meeting")) {
    audience.push("business");
  }
  if (text.includes("budget") || text.includes("affordable") || text.includes("cheap")) {
    audience.push("budget");
  }
  if (text.includes("adventure") || text.includes("thrill") || text.includes("extreme")) {
    audience.push("adventure");
  }
  if (audience.length === 0) audience.push("luxury"); // Default

  // Detect tone
  let tone: ContentAnalysis["tone"] = "informative";
  if (text.includes("luxur") || text.includes("exclus") || text.includes("premium")) {
    tone = "luxury";
  } else if (text.includes("tip") || text.includes("how to") || text.includes("guide")) {
    tone = "practical";
  } else if (text.includes("thrill") || text.includes("excit") || text.includes("amaz")) {
    tone = "exciting";
  } else if (text.includes("relax") || text.includes("peace") || text.includes("tranquil")) {
    tone = "relaxed";
  }

  // Extract visual elements
  const visualKeywords = [
    "view", "pool", "beach", "skyline", "sunset", "rooftop", "terrace",
    "restaurant", "lobby", "room", "suite", "spa", "bar", "entrance",
    "fountain", "garden", "architecture", "design", "interior"
  ];
  const visualElements = visualKeywords.filter(kw => text.includes(kw));

  // Generate search keywords
  const searchKeywords = [
    ...(existingKeywords || []),
    ...visualElements,
  ];

  if (detectedArea && DUBAI_AREAS[detectedArea]) {
    searchKeywords.push(...DUBAI_AREAS[detectedArea].searchKeywords);
  }

  return {
    mainTopic: title,
    subTopics: [],
    area: detectedArea,
    areaConfidence,
    audience,
    tone,
    visualElements,
    searchKeywords: Array.from(new Set(searchKeywords)),
  };
}

// ============================================================================
// IMAGE SEARCH BRIEF GENERATION
// ============================================================================

export interface ImageSearchBrief {
  slotId: string;
  role: ImageSlot["role"];

  // What to search for
  primaryQuery: string;
  alternativeQueries: string[];

  // Filters
  mustInclude: string[];
  mustExclude: string[];

  // Style requirements
  style: {
    timeOfDay?: string;
    mood?: string;
    angle?: string;
  };

  // Area-specific adjustments
  areaRules?: {
    additionalKeywords: string[];
    styleOverrides: Record<string, string>;
  };
}

export function generateImageBriefs(
  contentType: string,
  analysis: ContentAnalysis
): ImageSearchBrief[] {
  const slots = IMAGE_SLOTS_BY_TYPE[contentType] || IMAGE_SLOTS_BY_TYPE.article;
  const areaData = analysis.area ? DUBAI_AREAS[analysis.area] : null;

  return slots.map(slot => {
    // Build primary query
    const queryParts = [
      ...slot.searchPriority.slice(0, 2),
      analysis.area ? DUBAI_AREAS[analysis.area].name : "Dubai",
    ];

    // Add audience-specific terms
    if (analysis.audience.includes("luxury")) {
      queryParts.push("luxury");
    } else if (analysis.audience.includes("families")) {
      queryParts.push("family friendly");
    }

    const primaryQuery = queryParts.join(" ");

    // Alternative queries
    const alternativeQueries = slot.searchPriority.slice(2).map(priority =>
      `${priority} ${analysis.area ? DUBAI_AREAS[analysis.area].name : "Dubai"}`
    );

    // Must include/exclude
    const mustInclude = [...slot.mustShow];
    const mustExclude = [...slot.avoid];

    if (areaData) {
      mustInclude.push(...areaData.style.mustShow);
      mustExclude.push(...areaData.style.avoid);
    }

    // Style requirements
    const style: ImageSearchBrief["style"] = {
      mood: slot.preferredStyle.mood,
      angle: slot.preferredStyle.angle,
    };

    if (areaData) {
      style.timeOfDay = areaData.style.timeOfDay[0];
    }

    // Area-specific rules
    let areaRules: ImageSearchBrief["areaRules"];
    if (areaData) {
      areaRules = {
        additionalKeywords: [...areaData.searchKeywords],
        styleOverrides: {
          vibe: areaData.style.vibe.join(", "),
        },
      };
    }

    return {
      slotId: slot.id,
      role: slot.role,
      primaryQuery,
      alternativeQueries,
      mustInclude,
      mustExclude,
      style,
      areaRules,
    };
  });
}

// ============================================================================
// SEO METADATA GENERATION
// ============================================================================

export interface ImageSeoMetadata {
  filename: string;
  alt: string;
  title: string;
  caption: string;
}

export function generateImageSeo(
  slotId: string,
  contentTitle: string,
  area: DubaiArea | null,
  imageSource: "freepik" | "ai" | "upload"
): ImageSeoMetadata {
  const areaName = area ? DUBAI_AREAS[area].name : "Dubai";
  const slug = contentTitle.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 50);

  const slotType = slotId.split("-").pop() || "image";

  return {
    filename: `${slug}-${slotType}-${areaName.toLowerCase().replace(/\s+/g, "-")}.webp`,
    alt: `${contentTitle} - ${slotType} in ${areaName}`,
    title: `${contentTitle} ${slotType}`,
    caption: `Experience ${contentTitle} in ${areaName}`,
  };
}

// ============================================================================
// SEO SCORE CALCULATION
// ============================================================================

export interface SeoScoreResult {
  score: number;
  maxScore: number;
  percentage: number;
  passesThreshold: boolean;
  breakdown: {
    category: string;
    score: number;
    maxScore: number;
    issues: string[];
  }[];
  warnings: string[];
}

const SEO_THRESHOLD = SEO_RULES.SEO_PASS_THRESHOLD;

export function calculateSeoScore(content: {
  title: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  slug: string;
  blocks?: any[];
  heroImage?: string | null;
  primaryKeyword?: string | null;
  wordCount?: number;
}): SeoScoreResult {
  const breakdown: SeoScoreResult["breakdown"] = [];
  const warnings: string[] = [];
  let totalScore = 0;
  let maxTotal = 0;

  // 1. Title (15 points)
  {
    let score = 0;
    const issues: string[] = [];
    const maxScore = 15;

    if (content.title) {
      score += 5;
      if (content.title.length >= 30 && content.title.length <= 60) {
        score += 5;
      } else {
        issues.push(`Title length: ${content.title.length} (optimal: 30-60)`);
      }
      if (content.primaryKeyword && content.title.toLowerCase().includes(content.primaryKeyword.toLowerCase())) {
        score += 5;
      } else {
        issues.push("Primary keyword not in title");
      }
    } else {
      issues.push("Missing title");
    }

    breakdown.push({ category: "Title", score, maxScore, issues });
    totalScore += score;
    maxTotal += maxScore;
  }

  // 2. Meta Description (15 points)
  {
    let score = 0;
    const issues: string[] = [];
    const maxScore = 15;

    if (content.metaDescription) {
      score += 5;
      if (content.metaDescription.length >= 120 && content.metaDescription.length <= 160) {
        score += 5;
      } else {
        issues.push(`Meta description length: ${content.metaDescription.length} (optimal: 120-160)`);
      }
      if (content.primaryKeyword && content.metaDescription.toLowerCase().includes(content.primaryKeyword.toLowerCase())) {
        score += 5;
      } else {
        issues.push("Primary keyword not in meta description");
      }
    } else {
      issues.push("Missing meta description");
      warnings.push("Meta description is required for SEO");
    }

    breakdown.push({ category: "Meta Description", score, maxScore, issues });
    totalScore += score;
    maxTotal += maxScore;
  }

  // 3. URL/Slug (10 points)
  {
    let score = 0;
    const issues: string[] = [];
    const maxScore = 10;

    if (content.slug) {
      score += 3;
      if (content.slug.length <= 75) {
        score += 3;
      } else {
        issues.push("Slug too long");
      }
      if (!/[A-Z]/.test(content.slug) && !/\s/.test(content.slug)) {
        score += 2;
      } else {
        issues.push("Slug should be lowercase with hyphens");
      }
      if (content.primaryKeyword && content.slug.includes(content.primaryKeyword.toLowerCase().replace(/\s+/g, "-"))) {
        score += 2;
      }
    } else {
      issues.push("Missing slug");
    }

    breakdown.push({ category: "URL Structure", score, maxScore, issues });
    totalScore += score;
    maxTotal += maxScore;
  }

  // 4. Hero Image (15 points)
  {
    let score = 0;
    const issues: string[] = [];
    const maxScore = 15;

    if (content.heroImage) {
      score += 10;
      if (content.heroImage.includes(".webp")) {
        score += 5;
      } else {
        issues.push("Hero image should be WebP format");
      }
    } else {
      issues.push("Missing hero image");
      warnings.push("Hero image is essential for engagement");
    }

    breakdown.push({ category: "Hero Image", score, maxScore, issues });
    totalScore += score;
    maxTotal += maxScore;
  }

  // 5. Content Length (15 points)
  {
    let score = 0;
    const issues: string[] = [];
    const maxScore = 15;

    const wordCount = content.wordCount || 0;
    if (wordCount >= 300) score += 5;
    if (wordCount >= 600) score += 5;
    if (wordCount >= 1000) score += 5;

    if (wordCount < 300) {
      issues.push(`Word count: ${wordCount} (minimum: 300)`);
      warnings.push("Content is too short for good SEO");
    }

    breakdown.push({ category: "Content Length", score, maxScore, issues });
    totalScore += score;
    maxTotal += maxScore;
  }

  // 6. Content Blocks/Structure (15 points)
  {
    let score = 0;
    const issues: string[] = [];
    const maxScore = 15;

    const blocks = content.blocks || [];
    if (blocks.length > 0) {
      score += 5;

      // Check for headings
      const hasHeadings = blocks.some((b: any) => b.type === "heading");
      if (hasHeadings) {
        score += 5;
      } else {
        issues.push("No headings in content");
      }

      // Check for images
      const hasImages = blocks.some((b: any) => b.type === "image" || b.type === "hero");
      if (hasImages) {
        score += 5;
      } else {
        issues.push("No images in content body");
      }
    } else {
      issues.push("No content blocks");
    }

    breakdown.push({ category: "Content Structure", score, maxScore, issues });
    totalScore += score;
    maxTotal += maxScore;
  }

  // 7. Primary Keyword (15 points)
  {
    let score = 0;
    const issues: string[] = [];
    const maxScore = 15;

    if (content.primaryKeyword) {
      score += 5; // Has primary keyword defined

      // Actual validation: Check if keyword exists in content
      const contentText = extractTextFromBlocks(content.blocks || []);
      const keywordLower = content.primaryKeyword.toLowerCase();
      const contentLower = contentText.toLowerCase();

      if (contentLower.includes(keywordLower)) {
        score += 5; // Keyword exists in content

        // Check keyword density
        const density = calculateKeywordDensity(contentText, content.primaryKeyword);
        if (density >= SEO_RULES.KEYWORD_DENSITY_MIN && density <= SEO_RULES.KEYWORD_DENSITY_MAX) {
          // Good density - no additional points but no penalty
        } else if (density < SEO_RULES.KEYWORD_DENSITY_MIN) {
          issues.push(`Keyword density too low: ${density.toFixed(1)}% (optimal: ${SEO_RULES.KEYWORD_DENSITY_MIN}-${SEO_RULES.KEYWORD_DENSITY_MAX}%)`);
        } else {
          issues.push(`Keyword density too high: ${density.toFixed(1)}% (optimal: ${SEO_RULES.KEYWORD_DENSITY_MIN}-${SEO_RULES.KEYWORD_DENSITY_MAX}%)`);
        }
      } else {
        issues.push("Primary keyword not found in content");
      }

      // Check if keyword is in first paragraph
      const firstParagraph = getFirstParagraph(content.blocks || []);
      if (firstParagraph.toLowerCase().includes(keywordLower)) {
        score += 5; // Keyword in first paragraph
      } else {
        issues.push("Primary keyword not in first paragraph");
      }
    } else {
      issues.push("No primary keyword defined");
      warnings.push("Define a primary keyword for better SEO");
    }

    breakdown.push({ category: "Keyword Optimization", score, maxScore, issues });
    totalScore += score;
    maxTotal += maxScore;
  }

  const percentage = Math.round((totalScore / maxTotal) * 100);
  const passesThreshold = percentage >= SEO_THRESHOLD;

  if (!passesThreshold) {
    warnings.unshift(`SEO score ${percentage}% is below the required ${SEO_THRESHOLD}%`);
  }

  return {
    score: totalScore,
    maxScore: maxTotal,
    percentage,
    passesThreshold,
    breakdown,
    warnings,
  };
}

// ============================================================================
// FREEPIK SEARCH INTEGRATION
// ============================================================================

export interface FreepikSearchResult {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  downloadUrl?: string;
  relevanceScore: number;
  matchedCriteria: string[];
  rejectedReasons: string[];
}

export interface FreepikSearchOptions {
  query: string;
  filters?: {
    orientation?: "horizontal" | "vertical" | "square";
    color?: string;
    style?: "photo" | "illustration" | "vector";
  };
  limit?: number;
}

/**
 * Search Freepik for images matching the brief
 * Uses the Freepik Resources API
 */
export async function searchFreepik(
  brief: ImageSearchBrief,
  apiKey?: string
): Promise<{
  results: FreepikSearchResult[];
  usedQuery: string;
  foundMatch: boolean;
  queryAttempts: string[];
}> {
  if (!apiKey) {
    console.log("[ImageLogic] Freepik API key not configured");
    return {
      results: [],
      usedQuery: brief.primaryQuery,
      foundMatch: false,
      queryAttempts: [],
    };
  }

  const queryAttempts: string[] = [];
  const allResults: FreepikSearchResult[] = [];

  // Try primary query first, then alternatives
  const queriesToTry = [brief.primaryQuery, ...brief.alternativeQueries.slice(0, 2)];

  for (const query of queriesToTry) {
    queryAttempts.push(query);

    try {
      // Build search URL with filters
      const params = new URLSearchParams({
        term: query,
        page: "1",
        limit: "10",
        order: "relevance",
        filters: JSON.stringify({
          content_type: ["photo"],
          orientation: brief.style.angle === "wide" ? ["landscape"] :
                      brief.style.angle === "close-up" ? ["square"] : ["all"],
        }),
      });

      const response = await fetch(`https://api.freepik.com/v1/resources?${params}`, {
        headers: {
          "Accept": "application/json",
          "x-freepik-api-key": apiKey,
        },
      });

      if (!response.ok) {
        console.warn(`[ImageLogic] Freepik API error for query "${query}": ${response.status}`);
        continue;
      }

      const data = await response.json();
      const resources = data.data || [];

      // Score and filter results
      for (const resource of resources) {
        const matchedCriteria: string[] = [];
        const rejectedReasons: string[] = [];
        let relevanceScore = 50; // Base score

        // Check title/tags for must-include terms
        const resourceText = `${resource.title} ${(resource.tags || []).join(" ")}`.toLowerCase();

        for (const mustInclude of brief.mustInclude) {
          if (resourceText.includes(mustInclude.toLowerCase())) {
            matchedCriteria.push(mustInclude);
            relevanceScore += 10;
          }
        }

        // Check for must-exclude terms
        for (const mustExclude of brief.mustExclude) {
          if (resourceText.includes(mustExclude.toLowerCase())) {
            rejectedReasons.push(`Contains excluded term: ${mustExclude}`);
            relevanceScore -= 30;
          }
        }

        // Boost for Dubai-specific content
        if (resourceText.includes("dubai") || resourceText.includes("uae") || resourceText.includes("emirates")) {
          matchedCriteria.push("Dubai/UAE location");
          relevanceScore += 15;
        }

        // Only include if relevance is good enough
        if (relevanceScore >= 40 && rejectedReasons.length === 0) {
          allResults.push({
            id: resource.id?.toString() || "",
            title: resource.title || "",
            url: resource.url || resource.image?.source?.url || "",
            thumbnailUrl: resource.thumbnail?.url || resource.image?.thumbnail?.url || "",
            downloadUrl: resource.url || "",
            relevanceScore,
            matchedCriteria,
            rejectedReasons,
          });
        }
      }

      // If we found good results, stop searching
      if (allResults.length >= 3) {
        break;
      }

    } catch (error) {
      console.error(`[ImageLogic] Freepik search error for query "${query}":`, error);
    }
  }

  // Sort by relevance
  allResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return {
    results: allResults.slice(0, 5), // Return top 5
    usedQuery: queryAttempts[0],
    foundMatch: allResults.length > 0,
    queryAttempts,
  };
}

// ============================================================================
// AI IMAGE GENERATION (FALLBACK)
// ============================================================================

export interface AiImagePrompt {
  prompt: string;
  negativePrompt: string;
  style: string;
  aspectRatio: "16:9" | "4:3" | "1:1" | "3:4";
}

export function generateAiImagePrompt(
  brief: ImageSearchBrief,
  analysis: ContentAnalysis
): AiImagePrompt {
  const areaData = analysis.area ? DUBAI_AREAS[analysis.area] : null;

  // Build positive prompt
  const promptParts = [
    brief.primaryQuery,
    ...brief.mustInclude,
    brief.style.mood ? `${brief.style.mood} atmosphere` : "",
    brief.style.timeOfDay ? `${brief.style.timeOfDay} lighting` : "",
    areaData ? areaData.style.vibe.join(", ") : "",
    "professional photography",
    "high quality",
    "editorial style",
  ].filter(Boolean);

  // Build negative prompt
  const negativePromptParts = [
    ...brief.mustExclude,
    "low quality",
    "blurry",
    "distorted",
    "watermark",
    "text overlay",
    "people faces clearly visible", // Privacy
  ];

  return {
    prompt: promptParts.join(", "),
    negativePrompt: negativePromptParts.join(", "),
    style: analysis.tone === "luxury" ? "cinematic" : "natural",
    aspectRatio: brief.role === "hero" ? "16:9" : "4:3",
  };
}

// ============================================================================
// MAIN IMAGE SELECTION FLOW
// ============================================================================

export interface ImageSelectionResult {
  slotId: string;
  source: "freepik" | "ai" | "none";
  image?: {
    url: string;
    thumbnailUrl?: string;
  };
  seoMetadata: ImageSeoMetadata;
  brief: ImageSearchBrief;
  aiPrompt?: AiImagePrompt;
}

export async function selectImagesForContent(
  contentType: string,
  title: string,
  content: string,
  options?: {
    freepikApiKey?: string;
    keywords?: string[];
    forceAi?: boolean;
  }
): Promise<{
  analysis: ContentAnalysis;
  selections: ImageSelectionResult[];
  seoScore: SeoScoreResult;
}> {
  // 1. Analyze content
  const analysis = analyzeContent(title, content, contentType, options?.keywords);

  // 2. Generate briefs for each image slot
  const briefs = generateImageBriefs(contentType, analysis);

  // 3. For each brief, try Freepik then AI
  const selections: ImageSelectionResult[] = [];

  for (const brief of briefs) {
    const seoMetadata = generateImageSeo(brief.slotId, title, analysis.area, "freepik");

    // Try Freepik first (unless forceAi)
    if (!options?.forceAi) {
      const freepikResult = await searchFreepik(brief, options?.freepikApiKey);

      if (freepikResult.foundMatch && freepikResult.results.length > 0) {
        const bestMatch = freepikResult.results[0];
        selections.push({
          slotId: brief.slotId,
          source: "freepik",
          image: {
            url: bestMatch.url,
            thumbnailUrl: bestMatch.thumbnailUrl,
          },
          seoMetadata: { ...seoMetadata, filename: seoMetadata.filename.replace(".webp", "-freepik.webp") },
          brief,
        });
        continue;
      }
    }

    // Fallback to AI
    const aiPrompt = generateAiImagePrompt(brief, analysis);
    selections.push({
      slotId: brief.slotId,
      source: "ai",
      seoMetadata: { ...seoMetadata, filename: seoMetadata.filename.replace(".webp", "-ai.webp") },
      brief,
      aiPrompt,
    });
  }

  // 4. Calculate SEO score
  const seoScore = calculateSeoScore({
    title,
    slug: title.toLowerCase().replace(/\s+/g, "-"),
    heroImage: selections.find(s => s.slotId.includes("hero"))?.image?.url,
    blocks: [],
    wordCount: content.split(/\s+/).length,
  });

  return {
    analysis,
    selections,
    seoScore,
  };
}

// ============================================================================
// FREEPIK TO MEDIA LIBRARY INTEGRATION
// ============================================================================

export interface DownloadToMediaLibraryResult {
  success: boolean;
  mediaFile?: {
    id: string;
    filename: string;
    url: string;
    altText: string;
  };
  error?: string;
}

/**
 * Download an image from Freepik (or any URL) and save to Media Library
 * Converts to WebP and stores with proper metadata
 */
export async function downloadToMediaLibrary(
  imageUrl: string,
  options: {
    altText: string;
    originalFilename?: string;
    source?: 'freepik' | 'ai' | 'external';
    contentId?: string;
  }
): Promise<DownloadToMediaLibraryResult> {
  try {
    // 1. Download the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return { success: false, error: `Failed to download image: ${response.status}` };
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // 2. Generate filename
    const timestamp = Date.now();
    const sourcePrefix = options.source || 'external';
    const originalName = options.originalFilename || `image-${timestamp}`;
    const filename = `${sourcePrefix}-${originalName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${timestamp}.webp`;

    // 3. Convert to WebP (import sharp if needed)
    let finalBuffer = imageBuffer;
    let mimeType = contentType;
    let width = 0;
    let height = 0;

    try {
      const sharp = (await import('sharp')).default;
      const processed = sharp(imageBuffer).webp({ quality: 85 });
      const metadata = await processed.metadata();
      finalBuffer = await processed.toBuffer();
      mimeType = 'image/webp';
      width = metadata.width || 0;
      height = metadata.height || 0;
    } catch (sharpError) {
      console.warn('[ImageLogic] Sharp processing failed, using original:', sharpError);
    }

    // 4. Save to storage (object storage or local)
    const objectStorageUrl = process.env.OBJECT_STORAGE_URL;
    let fileUrl: string;

    if (objectStorageUrl) {
      // Upload to object storage
      const uploadResponse = await fetch(`${objectStorageUrl}/upload`, {
        method: 'POST',
        headers: { 'Content-Type': mimeType },
        body: finalBuffer,
      });
      if (uploadResponse.ok) {
        const result = await uploadResponse.json();
        fileUrl = result.url || `${objectStorageUrl}/${filename}`;
      } else {
        fileUrl = `/api/media/public/${filename}`;
      }
    } else {
      // Save locally
      const fs = await import('fs/promises');
      const path = await import('path');
      const uploadsDir = path.join(process.cwd(), 'uploads');
      await fs.mkdir(uploadsDir, { recursive: true });
      await fs.writeFile(path.join(uploadsDir, filename), finalBuffer);
      fileUrl = `/api/media/public/${filename}`;
    }

    // 5. Create media file record
    const mediaFileId = `media_${timestamp}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      success: true,
      mediaFile: {
        id: mediaFileId,
        filename,
        url: fileUrl,
        altText: options.altText,
      },
    };
  } catch (error) {
    console.error('[ImageLogic] Download to media library failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Search Freepik and optionally auto-download to Media Library
 */
export async function searchAndDownloadFreepik(
  query: string,
  options?: {
    autoDownload?: boolean;
    downloadCount?: number;
    altTextPrefix?: string;
    contentId?: string;
    apiKey?: string;
  }
): Promise<{
  searchResults: FreepikSearchResult[];
  downloadedMedia: DownloadToMediaLibraryResult[];
}> {
  const apiKey = options?.apiKey || process.env.FREEPIK_API_KEY;

  // Create a basic brief for the search
  const brief: ImageSearchBrief = {
    slotId: 'search',
    role: 'hero',
    primaryQuery: query,
    alternativeQueries: [],
    mustInclude: [],
    mustExclude: [],
    style: {
      angle: 'wide',
      mood: 'professional',
      timeOfDay: 'day',
    },
  };

  const searchResult = await searchFreepik(brief, apiKey);
  const downloadedMedia: DownloadToMediaLibraryResult[] = [];

  if (options?.autoDownload && searchResult.results.length > 0) {
    const downloadCount = options.downloadCount || 1;
    const toDownload = searchResult.results.slice(0, downloadCount);

    for (const result of toDownload) {
      const downloaded = await downloadToMediaLibrary(result.url, {
        altText: options.altTextPrefix ? `${options.altTextPrefix} - ${result.title}` : result.title,
        originalFilename: result.title,
        source: 'freepik',
        contentId: options.contentId,
      });
      downloadedMedia.push(downloaded);
    }
  }

  return {
    searchResults: searchResult.results,
    downloadedMedia,
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export const imageLogic = {
  areas: DUBAI_AREAS,
  slotsByType: IMAGE_SLOTS_BY_TYPE,
  analyzeContent,
  generateImageBriefs,
  generateImageSeo,
  calculateSeoScore,
  searchFreepik,
  generateAiImagePrompt,
  selectImagesForContent,
  downloadToMediaLibrary,
  searchAndDownloadFreepik,
  SEO_THRESHOLD,
};
