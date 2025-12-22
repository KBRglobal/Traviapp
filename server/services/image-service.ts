/**
 * Image Service
 * Main image selection system - content analysis, area detection, and image brief generation
 */

import { searchFreepik, ImageSearchBrief, AiImagePrompt } from './external-image-service';

// ============================================================================
// DUBAI AREA DEFINITIONS
// ============================================================================

export const DUBAI_AREAS = {
  downtown: {
    name: 'Downtown Dubai',
    nameHe: 'דאונטאון דובאי',
    identifiers: ['burj khalifa', 'dubai mall', 'boulevard', 'fountains', 'opera'],
    style: {
      timeOfDay: ['blue hour', 'night', 'sunset'],
      vibe: ['luxury', 'modern', 'iconic', 'premium'],
      mustShow: ['skyline', 'burj khalifa silhouette', 'modern architecture'],
      avoid: ['construction', 'traffic', 'crowds'],
    },
    searchKeywords: ['downtown dubai', 'burj khalifa view', 'dubai mall area'],
  },
  businessBay: {
    name: 'Business Bay',
    nameHe: 'ביזנס ביי',
    identifiers: ['business bay', 'canal', 'jw marriott marquis', 'dorchester'],
    style: {
      timeOfDay: ['day', 'sunset', 'golden hour'],
      vibe: ['business', 'modern', 'clean', 'professional'],
      mustShow: ['water canal', 'modern towers', 'waterfront'],
      avoid: ['construction', 'unfinished buildings'],
    },
    searchKeywords: ['business bay dubai', 'dubai canal', 'business bay waterfront'],
  },
  marina: {
    name: 'Dubai Marina',
    nameHe: 'דובאי מרינה',
    identifiers: ['marina', 'marina walk', 'marina mall', 'yacht club'],
    style: {
      timeOfDay: ['sunset', 'evening', 'golden hour'],
      vibe: ['urban', 'lifestyle', 'waterfront', 'vibrant'],
      mustShow: ['yachts', 'promenade', 'towers', 'waterfront dining'],
      avoid: ['construction cranes', 'empty promenade'],
    },
    searchKeywords: ['dubai marina', 'marina walk', 'marina waterfront'],
  },
  jbr: {
    name: 'JBR - Jumeirah Beach Residence',
    nameHe: 'JBR - חוף ג\'ומיירה',
    identifiers: ['jbr', 'the walk', 'jumeirah beach residence', 'ain dubai'],
    style: {
      timeOfDay: ['day', 'afternoon', 'sunset'],
      vibe: ['beach', 'family', 'tourist', 'relaxed'],
      mustShow: ['beach', 'the walk', 'outdoor activities'],
      avoid: ['overcrowded', 'construction'],
    },
    searchKeywords: ['jbr dubai', 'jumeirah beach', 'the walk jbr'],
  },
  palm: {
    name: 'Palm Jumeirah',
    nameHe: 'פאלם ג\'ומיירה',
    identifiers: ['palm', 'atlantis', 'palm jumeirah', 'fairmont palm', 'one&only'],
    style: {
      timeOfDay: ['sunset', 'golden hour', 'day'],
      vibe: ['luxury', 'resort', 'exclusive', 'beachfront'],
      mustShow: ['private beach', 'pool', 'resort architecture', 'palm shape view'],
      avoid: ['construction', 'empty beaches'],
    },
    searchKeywords: ['palm jumeirah', 'atlantis dubai', 'palm beach resort'],
  },
  jumeirah: {
    name: 'Jumeirah',
    nameHe: 'ג\'ומיירה',
    identifiers: ['jumeirah', 'burj al arab', 'madinat', 'jumeirah beach'],
    style: {
      timeOfDay: ['day', 'golden hour', 'sunset'],
      vibe: ['luxury', 'classic', 'elegant', 'relaxed'],
      mustShow: ['burj al arab', 'beach', 'villas'],
      avoid: ['traffic', 'construction'],
    },
    searchKeywords: ['jumeirah dubai', 'burj al arab', 'madinat jumeirah'],
  },
  difc: {
    name: 'DIFC',
    nameHe: 'DIFC - מרכז פיננסי',
    identifiers: ['difc', 'gate building', 'financial centre'],
    style: {
      timeOfDay: ['evening', 'night', 'sunset'],
      vibe: ['business luxury', 'fine dining', 'art', 'sophisticated'],
      mustShow: ['gate building', 'galleries', 'restaurants'],
      avoid: ['empty streets', 'daytime ordinary'],
    },
    searchKeywords: ['difc dubai', 'gate village', 'difc restaurants'],
  },
  alSeef: {
    name: 'Al Seef',
    nameHe: 'אל סיף',
    identifiers: ['al seef', 'creek', 'abra', 'heritage'],
    style: {
      timeOfDay: ['golden hour', 'sunset', 'day'],
      vibe: ['heritage', 'traditional', 'warm', 'authentic'],
      mustShow: ['creek', 'traditional boats', 'heritage buildings'],
      avoid: ['modern elements', 'cars'],
    },
    searchKeywords: ['al seef dubai', 'dubai creek heritage', 'old dubai'],
  },
  deira: {
    name: 'Deira',
    nameHe: 'דיירה',
    identifiers: ['deira', 'gold souk', 'spice souk', 'old deira'],
    style: {
      timeOfDay: ['day', 'golden hour'],
      vibe: ['authentic', 'traditional', 'vibrant', 'cultural'],
      mustShow: ['souks', 'gold displays', 'spices', 'local life'],
      avoid: ['tourist traps', 'overly staged'],
    },
    searchKeywords: ['deira dubai', 'gold souk', 'spice souk dubai'],
  },
  creekHarbour: {
    name: 'Dubai Creek Harbour',
    nameHe: 'דובאי קריק הארבור',
    identifiers: ['creek harbour', 'creek tower', 'harbour'],
    style: {
      timeOfDay: ['sunset', 'evening', 'day'],
      vibe: ['modern', 'future', 'waterfront', 'new'],
      mustShow: ['promenade', 'waterfront', 'modern architecture'],
      avoid: ['construction', 'empty areas'],
    },
    searchKeywords: ['creek harbour dubai', 'dubai creek tower'],
  },
  dubaiHills: {
    name: 'Dubai Hills',
    nameHe: 'דובאי הילס',
    identifiers: ['dubai hills', 'hills mall', 'hills estate'],
    style: {
      timeOfDay: ['day', 'golden hour'],
      vibe: ['family', 'green', 'modern', 'suburban'],
      mustShow: ['parks', 'mall', 'family areas'],
      avoid: ['empty streets'],
    },
    searchKeywords: ['dubai hills', 'dubai hills mall', 'dubai hills estate'],
  },
  expo: {
    name: 'Expo City Dubai',
    nameHe: 'אקספו סיטי דובאי',
    identifiers: ['expo', 'expo city', 'terra', 'al wasl'],
    style: {
      timeOfDay: ['day', 'evening'],
      vibe: ['innovative', 'modern', 'futuristic', 'events'],
      mustShow: ['expo architecture', 'dome', 'pavilions'],
      avoid: ['empty spaces during non-events'],
    },
    searchKeywords: ['expo city dubai', 'expo 2020 site', 'terra pavilion'],
  },
  desert: {
    name: 'Dubai Desert',
    nameHe: 'מדבר דובאי',
    identifiers: ['desert', 'safari', 'dunes', 'bedouin'],
    style: {
      timeOfDay: ['sunrise', 'sunset only'],
      vibe: ['adventure', 'premium', 'authentic', 'magical'],
      mustShow: ['dunes', '4x4', 'sunset colors', 'camps'],
      avoid: ['midday harsh light', 'tourist crowds'],
    },
    searchKeywords: ['dubai desert safari', 'arabian desert dunes', 'desert sunset dubai'],
  },
} as const;

export type DubaiArea = keyof typeof DUBAI_AREAS;

// ============================================================================
// IMAGE SLOT DEFINITIONS BY CONTENT TYPE
// ============================================================================

export interface ImageSlot {
  id: string;
  role: 'hero' | 'interior' | 'experience' | 'practical' | 'usp' | 'food' | 'ambiance';
  title: string;
  titleHe: string;
  description: string;
  required: boolean;
  searchPriority: string[];
  mustShow: string[];
  avoid: string[];
  preferredStyle: {
    angle?: 'wide' | 'medium' | 'close-up';
    lighting?: 'natural' | 'golden' | 'night' | 'blue hour';
    mood?: 'luxury' | 'family' | 'romantic' | 'practical' | 'vibrant';
  };
}

export const IMAGE_SLOTS_BY_TYPE: Record<string, ImageSlot[]> = {
  hotel: [
    {
      id: 'hotel-hero',
      role: 'hero',
      title: 'Hotel Exterior/Icon',
      titleHe: 'חזית המלון',
      description: 'Main identifying image - exterior or signature feature',
      required: true,
      searchPriority: ['exterior', 'facade', 'pool overview', 'beach view'],
      mustShow: ['hotel building', 'brand identity', 'premium feel'],
      avoid: ['construction', 'bad angles', 'empty spaces'],
      preferredStyle: { angle: 'wide', lighting: 'golden', mood: 'luxury' },
    },
    {
      id: 'hotel-room',
      role: 'interior',
      title: 'Room/Suite',
      titleHe: 'חדר/סוויטה',
      description: 'Room interior showing bed, space, view if available',
      required: true,
      searchPriority: ['room', 'suite', 'bedroom', 'bed'],
      mustShow: ['bed', 'space', 'window/view'],
      avoid: ['messy', 'dark', 'narrow angles'],
      preferredStyle: { angle: 'wide', lighting: 'natural', mood: 'luxury' },
    },
    {
      id: 'hotel-amenity',
      role: 'experience',
      title: 'Main Amenity',
      titleHe: 'אמניטי מרכזי',
      description: 'Pool, spa, beach, rooftop - main differentiator',
      required: true,
      searchPriority: ['pool', 'spa', 'beach', 'rooftop'],
      mustShow: ['the amenity in use or ready', 'quality'],
      avoid: ['empty', 'maintenance', 'crowded'],
      preferredStyle: { angle: 'medium', lighting: 'golden', mood: 'luxury' },
    },
    {
      id: 'hotel-dining',
      role: 'ambiance',
      title: 'Restaurant/Lobby',
      titleHe: 'מסעדה/לובי',
      description: 'Dining or social spaces showing lifestyle',
      required: true,
      searchPriority: ['restaurant', 'lobby', 'bar', 'lounge'],
      mustShow: ['atmosphere', 'quality', 'lifestyle'],
      avoid: ['empty', 'staff only', 'back areas'],
      preferredStyle: { angle: 'medium', lighting: 'natural', mood: 'vibrant' },
    },
  ],
  attraction: [
    {
      id: 'attraction-hero',
      role: 'hero',
      title: 'Main Identification',
      titleHe: 'זיהוי ראשי',
      description: 'Exterior or entrance that immediately identifies the attraction',
      required: true,
      searchPriority: ['entrance', 'exterior', 'sign', 'facade'],
      mustShow: ['clear identification', 'scale'],
      avoid: ['construction', 'crowds blocking view'],
      preferredStyle: { angle: 'wide', lighting: 'natural', mood: 'vibrant' },
    },
    {
      id: 'attraction-inside',
      role: 'interior',
      title: 'Inside/Highlight',
      titleHe: 'בפנים/שיא',
      description: 'The main thing people come to see',
      required: true,
      searchPriority: ['interior', 'main attraction', 'exhibit', 'view'],
      mustShow: ['the experience', 'quality'],
      avoid: ['maintenance', 'closed areas'],
      preferredStyle: { angle: 'wide', lighting: 'natural', mood: 'vibrant' },
    },
    {
      id: 'attraction-action',
      role: 'experience',
      title: 'Experience/Action',
      titleHe: 'חוויה/פעילות',
      description: 'People enjoying the attraction - shows energy and scale',
      required: true,
      searchPriority: ['visitors', 'action', 'experience', 'activity'],
      mustShow: ['people having fun', 'scale of experience'],
      avoid: ['empty', 'overcrowded chaos'],
      preferredStyle: { angle: 'medium', lighting: 'natural', mood: 'family' },
    },
  ],
  restaurant: [
    {
      id: 'restaurant-hero',
      role: 'hero',
      title: 'Interior/Facade',
      titleHe: 'פנים/חזית',
      description: 'Main impression - interior or exterior with sign',
      required: true,
      searchPriority: ['interior', 'facade', 'entrance', 'dining room'],
      mustShow: ['atmosphere', 'style', 'quality'],
      avoid: ['empty', 'messy', 'kitchen chaos'],
      preferredStyle: { angle: 'wide', lighting: 'golden', mood: 'romantic' },
    },
    {
      id: 'restaurant-signature',
      role: 'food',
      title: 'Signature Dish',
      titleHe: 'מנה חתימה',
      description: 'The dish that defines the restaurant',
      required: true,
      searchPriority: ['signature dish', 'main course', 'specialty'],
      mustShow: ['plating', 'quality', 'appetizing'],
      avoid: ['half eaten', 'poor lighting', 'plastic'],
      preferredStyle: { angle: 'close-up', lighting: 'natural', mood: 'luxury' },
    },
    {
      id: 'restaurant-ambiance',
      role: 'ambiance',
      title: 'Diners/Atmosphere',
      titleHe: 'סועדים/אווירה',
      description: 'The dining experience - tables, service, vibe',
      required: true,
      searchPriority: ['dining', 'tables', 'atmosphere', 'guests'],
      mustShow: ['atmosphere', 'service quality'],
      avoid: ['empty restaurant', 'chaotic'],
      preferredStyle: { angle: 'medium', lighting: 'natural', mood: 'vibrant' },
    },
  ],
  article: [
    {
      id: 'article-hero',
      role: 'hero',
      title: 'Main Visual',
      titleHe: 'תמונה ראשית',
      description: 'Captures the essence of the article topic',
      required: true,
      searchPriority: ['main topic', 'location', 'subject'],
      mustShow: ['article subject', 'context'],
      avoid: ['generic stock', 'irrelevant'],
      preferredStyle: { angle: 'wide', lighting: 'natural', mood: 'vibrant' },
    },
    {
      id: 'article-context',
      role: 'interior',
      title: 'Context/Location',
      titleHe: 'הקשר/מיקום',
      description: 'Where this happens in Dubai',
      required: true,
      searchPriority: ['location', 'area', 'landmark'],
      mustShow: ['Dubai context', 'location'],
      avoid: ['could be anywhere'],
      preferredStyle: { angle: 'wide', lighting: 'natural', mood: 'practical' },
    },
  ],
};

// ============================================================================
// CONTENT ANALYSIS
// ============================================================================

export interface ContentAnalysis {
  mainTopic: string;
  subTopics: string[];
  area: DubaiArea | null;
  areaConfidence: number;
  specificLocation?: string;
  audience: ('families' | 'luxury' | 'couples' | 'business' | 'budget' | 'adventure')[];
  tone: 'luxury' | 'practical' | 'exciting' | 'relaxed' | 'informative';
  visualElements: string[];
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
  const audience: ContentAnalysis['audience'] = [];
  if (text.includes('family') || text.includes('kids') || text.includes('children')) {
    audience.push('families');
  }
  if (text.includes('luxury') || text.includes('premium') || text.includes('exclusive')) {
    audience.push('luxury');
  }
  if (text.includes('romantic') || text.includes('couples') || text.includes('honeymoon')) {
    audience.push('couples');
  }
  if (text.includes('business') || text.includes('corporate') || text.includes('meeting')) {
    audience.push('business');
  }
  if (text.includes('budget') || text.includes('affordable') || text.includes('cheap')) {
    audience.push('budget');
  }
  if (text.includes('adventure') || text.includes('thrill') || text.includes('extreme')) {
    audience.push('adventure');
  }
  if (audience.length === 0) audience.push('luxury');

  // Detect tone
  let tone: ContentAnalysis['tone'] = 'informative';
  if (text.includes('luxur') || text.includes('exclus') || text.includes('premium')) {
    tone = 'luxury';
  } else if (text.includes('tip') || text.includes('how to') || text.includes('guide')) {
    tone = 'practical';
  } else if (text.includes('thrill') || text.includes('excit') || text.includes('amaz')) {
    tone = 'exciting';
  } else if (text.includes('relax') || text.includes('peace') || text.includes('tranquil')) {
    tone = 'relaxed';
  }

  // Extract visual elements
  const visualKeywords = [
    'view', 'pool', 'beach', 'skyline', 'sunset', 'rooftop', 'terrace',
    'restaurant', 'lobby', 'room', 'suite', 'spa', 'bar', 'entrance',
    'fountain', 'garden', 'architecture', 'design', 'interior'
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
// IMAGE BRIEF GENERATION
// ============================================================================

export function generateImageBriefs(
  contentType: string,
  analysis: ContentAnalysis
): ImageSearchBrief[] {
  const slots = IMAGE_SLOTS_BY_TYPE[contentType] || IMAGE_SLOTS_BY_TYPE.article;
  const areaData = analysis.area ? DUBAI_AREAS[analysis.area] : null;

  return slots.map(slot => {
    const queryParts = [
      ...slot.searchPriority.slice(0, 2),
      analysis.area ? DUBAI_AREAS[analysis.area].name : 'Dubai',
    ];

    if (analysis.audience.includes('luxury')) {
      queryParts.push('luxury');
    } else if (analysis.audience.includes('families')) {
      queryParts.push('family friendly');
    }

    const primaryQuery = queryParts.join(' ');

    const alternativeQueries = slot.searchPriority.slice(2).map(priority =>
      `${priority} ${analysis.area ? DUBAI_AREAS[analysis.area].name : 'Dubai'}`
    );

    const mustInclude = [...slot.mustShow];
    const mustExclude = [...slot.avoid];

    if (areaData) {
      mustInclude.push(...areaData.style.mustShow);
      mustExclude.push(...areaData.style.avoid);
    }

    const style: ImageSearchBrief['style'] = {
      mood: slot.preferredStyle.mood,
      angle: slot.preferredStyle.angle,
    };

    if (areaData) {
      style.timeOfDay = areaData.style.timeOfDay[0];
    }

    let areaRules: ImageSearchBrief['areaRules'];
    if (areaData) {
      areaRules = {
        additionalKeywords: [...areaData.searchKeywords],
        styleOverrides: {
          vibe: areaData.style.vibe.join(', '),
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
// AI PROMPT GENERATION
// ============================================================================

export function generateAiImagePrompt(
  brief: ImageSearchBrief,
  analysis: ContentAnalysis
): AiImagePrompt {
  const areaData = analysis.area ? DUBAI_AREAS[analysis.area] : null;

  const promptParts = [
    brief.primaryQuery,
    ...brief.mustInclude,
    brief.style.mood ? `${brief.style.mood} atmosphere` : '',
    brief.style.timeOfDay ? `${brief.style.timeOfDay} lighting` : '',
    areaData ? areaData.style.vibe.join(', ') : '',
    'professional photography',
    'high quality',
    'editorial style',
  ].filter(Boolean);

  const negativePromptParts = [
    ...brief.mustExclude,
    'low quality',
    'blurry',
    'distorted',
    'watermark',
    'text overlay',
    'people faces clearly visible',
  ];

  return {
    prompt: promptParts.join(', '),
    negativePrompt: negativePromptParts.join(', '),
    style: analysis.tone === 'luxury' ? 'cinematic' : 'natural',
    aspectRatio: brief.role === 'hero' ? '16:9' : '4:3',
  };
}

// ============================================================================
// IMAGE SEO METADATA
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
  imageSource: 'freepik' | 'ai' | 'upload'
): ImageSeoMetadata {
  const areaName = area ? DUBAI_AREAS[area].name : 'Dubai';
  const slug = contentTitle.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);

  const slotType = slotId.split('-').pop() || 'image';

  return {
    filename: `${slug}-${slotType}-${areaName.toLowerCase().replace(/\s+/g, '-')}.webp`,
    alt: `${contentTitle} - ${slotType} in ${areaName}`,
    title: `${contentTitle} ${slotType}`,
    caption: `Experience ${contentTitle} in ${areaName}`,
  };
}

// ============================================================================
// FULL IMAGE SELECTION FLOW
// ============================================================================

export interface ImageSelectionResult {
  slotId: string;
  source: 'freepik' | 'ai' | 'none';
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
}> {
  const analysis = analyzeContent(title, content, contentType, options?.keywords);
  const briefs = generateImageBriefs(contentType, analysis);
  const selections: ImageSelectionResult[] = [];

  for (const brief of briefs) {
    const seoMetadata = generateImageSeo(brief.slotId, title, analysis.area, 'freepik');

    if (!options?.forceAi) {
      const freepikResult = await searchFreepik(brief, options?.freepikApiKey);

      if (freepikResult.foundMatch && freepikResult.results.length > 0) {
        const bestMatch = freepikResult.results[0];
        selections.push({
          slotId: brief.slotId,
          source: 'freepik',
          image: {
            url: bestMatch.url,
            thumbnailUrl: bestMatch.thumbnailUrl,
          },
          seoMetadata: { ...seoMetadata, filename: seoMetadata.filename.replace('.webp', '-freepik.webp') },
          brief,
        });
        continue;
      }
    }

    const aiPrompt = generateAiImagePrompt(brief, analysis);
    selections.push({
      slotId: brief.slotId,
      source: 'ai',
      seoMetadata: { ...seoMetadata, filename: seoMetadata.filename.replace('.webp', '-ai.webp') },
      brief,
      aiPrompt,
    });
  }

  return { analysis, selections };
}

export default {
  DUBAI_AREAS,
  IMAGE_SLOTS_BY_TYPE,
  analyzeContent,
  generateImageBriefs,
  generateAiImagePrompt,
  generateImageSeo,
  selectImagesForContent,
};
