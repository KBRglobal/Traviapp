import OpenAI from "openai";
import type {
  ContentBlock,
  QuickInfoItem,
  HighlightItem,
  TicketInfoItem,
  EssentialInfoItem,
  FaqItem,
  RoomTypeItem,
  DiningItem,
  NearbyItem,
} from "@shared/schema";

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new OpenAI({ 
    apiKey,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || undefined,
  });
}

function generateBlockId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export interface GeneratedHotelContent {
  content: {
    title: string;
    slug: string;
    metaTitle: string;
    metaDescription: string;
    primaryKeyword: string;
    secondaryKeywords: string[];
    lsiKeywords: string[];
    heroImageAlt: string;
    blocks: ContentBlock[];
    seoSchema: Record<string, unknown>;
  };
  hotel: {
    location: string;
    starRating: number;
    numberOfRooms: number;
    amenities: string[];
    targetAudience: string[];
    primaryCta: string;
    quickInfoBar: QuickInfoItem[];
    highlights: HighlightItem[];
    roomTypes: RoomTypeItem[];
    essentialInfo: EssentialInfoItem[];
    diningPreview: DiningItem[];
    activities: string[];
    travelerTips: string[];
    faq: FaqItem[];
    locationNearby: NearbyItem[];
    trustSignals: string[];
  };
}

export interface GeneratedAttractionContent {
  content: {
    title: string;
    slug: string;
    metaTitle: string;
    metaDescription: string;
    primaryKeyword: string;
    secondaryKeywords: string[];
    lsiKeywords: string[];
    heroImageAlt: string;
    blocks: ContentBlock[];
    seoSchema: Record<string, unknown>;
  };
  attraction: {
    location: string;
    duration: string;
    targetAudience: string[];
    primaryCta: string;
    quickInfoBar: QuickInfoItem[];
    highlights: HighlightItem[];
    ticketInfo: TicketInfoItem[];
    essentialInfo: EssentialInfoItem[];
    visitorTips: string[];
    faq: FaqItem[];
    trustSignals: string[];
  };
}

export interface GeneratedArticleContent {
  content: {
    title: string;
    slug: string;
    metaTitle: string;
    metaDescription: string;
    primaryKeyword: string;
    secondaryKeywords: string[];
    lsiKeywords: string[];
    heroImageAlt: string;
    blocks: ContentBlock[];
    seoSchema: Record<string, unknown>;
  };
  article: {
    category: string;
    urgencyLevel: string;
    targetAudience: string[];
    personality: string;
    tone: string;
    quickFacts: string[];
    proTips: string[];
    warnings: string[];
    faq: FaqItem[];
  };
}

const HOTEL_SYSTEM_PROMPT = `You are a Dubai travel content expert creating comprehensive hotel pages for Dubai Travel website.

Your output must be a valid JSON object matching this exact structure. Generate realistic, SEO-optimized content.

OUTPUT STRUCTURE:
{
  "content": {
    "title": "Hotel Name - Dubai | Luxury/Budget Resort",
    "slug": "hotel-name-dubai",
    "metaTitle": "Hotel Name Dubai | Book Best Rates [Year]",
    "metaDescription": "150-160 char compelling description with call to action",
    "primaryKeyword": "hotel name dubai",
    "secondaryKeywords": ["dubai hotels", "luxury dubai resort", "beach hotel dubai"],
    "lsiKeywords": ["accommodation", "stay", "rooms", "amenities"],
    "heroImageAlt": "Descriptive alt text for hero image",
    "blocks": [
      {
        "id": "unique_id",
        "type": "text",
        "data": {
          "heading": "Overview",
          "content": "3 engaging sentences about the hotel (visible). Then expand with 200+ words covering unique features, location benefits, guest experience."
        },
        "order": 0
      },
      {
        "id": "unique_id2",
        "type": "highlights",
        "data": {
          "title": "Hotel Highlights",
          "items": ["Waterpark", "Private Beach", "Spa", "Kids Club", "Fine Dining", "Pool"]
        },
        "order": 1
      },
      {
        "id": "unique_id3",
        "type": "text",
        "data": {
          "heading": "Dining Experience",
          "content": "Description of restaurant options, cuisines available, signature dishes"
        },
        "order": 2
      },
      {
        "id": "unique_id4",
        "type": "tips",
        "data": {
          "title": "Traveler Tips",
          "tips": ["5-7 practical tips for guests"]
        },
        "order": 3
      },
      {
        "id": "unique_id5",
        "type": "faq",
        "data": {
          "title": "Frequently Asked Questions",
          "faqs": [{"question": "...", "answer": "..."}]
        },
        "order": 4
      },
      {
        "id": "unique_id6",
        "type": "cta",
        "data": {
          "heading": "Ready to Book?",
          "text": "Book your stay at [Hotel Name] today",
          "buttonText": "Check Availability",
          "buttonLink": "#book"
        },
        "order": 5
      }
    ],
    "seoSchema": {
      "@context": "https://schema.org",
      "@type": "Hotel",
      "name": "Hotel Name",
      "description": "...",
      "starRating": {"@type": "Rating", "ratingValue": "5"},
      "address": {"@type": "PostalAddress", "addressLocality": "Dubai", "addressCountry": "AE"}
    }
  },
  "hotel": {
    "location": "Palm Jumeirah, Dubai",
    "starRating": 5,
    "numberOfRooms": 300,
    "amenities": ["Pool", "Spa", "Gym", "Beach", "WiFi", "Restaurant", "Bar", "Kids Club"],
    "targetAudience": ["Families", "Couples", "Business Travelers"],
    "primaryCta": "Book Now - Best Rate Guarantee",
    "quickInfoBar": [
      {"icon": "MapPin", "label": "Location", "value": "Palm Jumeirah"},
      {"icon": "Star", "label": "Rating", "value": "5-Star"},
      {"icon": "Waves", "label": "Beach", "value": "Private Beach"},
      {"icon": "Utensils", "label": "Dining", "value": "8 Restaurants"},
      {"icon": "Plane", "label": "Airport", "value": "25 min"}
    ],
    "highlights": [
      {"image": "", "title": "Waterpark", "description": "World-class aquatic adventures"},
      {"image": "", "title": "Private Beach", "description": "Pristine white sand beach"},
      {"image": "", "title": "Spa & Wellness", "description": "Award-winning treatments"},
      {"image": "", "title": "Kids Club", "description": "Supervised activities"},
      {"image": "", "title": "Fine Dining", "description": "Celebrity chef restaurants"},
      {"image": "", "title": "Pools", "description": "Multiple temperature-controlled pools"}
    ],
    "roomTypes": [
      {"image": "", "title": "Deluxe Room", "features": ["Sea View", "King Bed", "Balcony"], "price": "From AED 1,200/night"},
      {"image": "", "title": "Premium Suite", "features": ["Ocean View", "Living Area", "Butler Service"], "price": "From AED 2,500/night"},
      {"image": "", "title": "Royal Suite", "features": ["Panoramic Views", "Private Pool", "Full Kitchen"], "price": "From AED 5,000/night"}
    ],
    "essentialInfo": [
      {"icon": "MapPin", "label": "Location", "value": "Address details"},
      {"icon": "Clock", "label": "Check-in", "value": "3:00 PM"},
      {"icon": "Clock", "label": "Check-out", "value": "12:00 PM"},
      {"icon": "DollarSign", "label": "Price Range", "value": "AED 1,200 - 15,000"},
      {"icon": "Plane", "label": "Airport Distance", "value": "25 minutes"},
      {"icon": "Waves", "label": "Pools", "value": "5 pools"},
      {"icon": "Utensils", "label": "Dining", "value": "8 restaurants"},
      {"icon": "Wifi", "label": "WiFi", "value": "Complimentary"},
      {"icon": "Accessibility", "label": "Accessibility", "value": "Wheelchair accessible"},
      {"icon": "Car", "label": "Parking", "value": "Valet available"},
      {"icon": "Baby", "label": "Family", "value": "Kids club, babysitting"},
      {"icon": "Dumbbell", "label": "Fitness", "value": "24-hour gym"}
    ],
    "diningPreview": [
      {"name": "Main Restaurant", "cuisine": "International Buffet", "description": "All-day dining"},
      {"name": "Specialty Restaurant", "cuisine": "Fine Dining", "description": "Reservation recommended"}
    ],
    "activities": ["Swimming", "Spa treatments", "Water sports", "Tennis", "Kids activities"],
    "travelerTips": [
      "Book pool cabanas in advance during peak season",
      "Request a room on higher floors for better views",
      "The breakfast buffet opens at 6:30 AM for early risers"
    ],
    "faq": [
      {"question": "What time is check-in?", "answer": "Check-in is at 3:00 PM, early check-in available on request."},
      {"question": "Is parking available?", "answer": "Yes, complimentary valet parking for all guests."},
      {"question": "Is the beach private?", "answer": "Yes, the hotel has a private beach for guests only."},
      {"question": "Are pets allowed?", "answer": "Unfortunately, pets are not permitted."},
      {"question": "Is there a kids club?", "answer": "Yes, supervised kids club for ages 4-12."},
      {"question": "What dining options are available?", "answer": "8 restaurants and bars serving international cuisine."}
    ],
    "locationNearby": [
      {"name": "Dubai Mall", "distance": "15 min", "type": "Shopping"},
      {"name": "Burj Khalifa", "distance": "20 min", "type": "Attraction"},
      {"name": "Dubai Marina", "distance": "10 min", "type": "District"}
    ],
    "trustSignals": ["TripAdvisor Certificate of Excellence", "Forbes 5-Star", "Booking.com Traveller Review Award"]
  }
}

Generate unique IDs for each block. Make content engaging, accurate for Dubai hotels, and SEO-optimized.`;

const ATTRACTION_SYSTEM_PROMPT = `You are a Dubai travel content expert creating comprehensive attraction pages for Dubai Travel website.

Your output must be a valid JSON object matching this exact structure. Generate realistic, SEO-optimized content.

OUTPUT STRUCTURE:
{
  "content": {
    "title": "Attraction Name Dubai | Guide & Tickets [Year]",
    "slug": "attraction-name-dubai",
    "metaTitle": "Attraction Name Dubai - Tickets, Hours & Tips [Year]",
    "metaDescription": "150-160 char description with key info and call to action",
    "primaryKeyword": "attraction name dubai",
    "secondaryKeywords": ["dubai attractions", "things to do dubai", "dubai tickets"],
    "lsiKeywords": ["visit", "tickets", "experience", "tour"],
    "heroImageAlt": "Descriptive alt text for hero image",
    "blocks": [
      {
        "id": "unique_id",
        "type": "text",
        "data": {
          "heading": "About [Attraction]",
          "content": "3 engaging sentences (visible intro). Then 150+ words covering what makes it special, what visitors experience, best times to visit."
        },
        "order": 0
      },
      {
        "id": "unique_id2",
        "type": "highlights",
        "data": {
          "title": "What to Expect",
          "items": ["3-4 key experience highlights"]
        },
        "order": 1
      },
      {
        "id": "unique_id3",
        "type": "tips",
        "data": {
          "title": "Visitor Tips",
          "tips": ["5 practical tips for visitors"]
        },
        "order": 2
      },
      {
        "id": "unique_id4",
        "type": "faq",
        "data": {
          "title": "Frequently Asked Questions",
          "faqs": [{"question": "...", "answer": "..."}]
        },
        "order": 3
      },
      {
        "id": "unique_id5",
        "type": "cta",
        "data": {
          "heading": "Book Your Visit",
          "text": "Get tickets for [Attraction]",
          "buttonText": "Buy Tickets",
          "buttonLink": "#tickets"
        },
        "order": 4
      }
    ],
    "seoSchema": {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      "name": "Attraction Name",
      "description": "...",
      "address": {"@type": "PostalAddress", "addressLocality": "Dubai", "addressCountry": "AE"}
    }
  },
  "attraction": {
    "location": "Downtown Dubai / Palm Jumeirah / etc",
    "duration": "2-3 hours",
    "targetAudience": ["Families", "Couples", "Solo Travelers", "Photography Enthusiasts"],
    "primaryCta": "Book Tickets Now",
    "quickInfoBar": [
      {"icon": "MapPin", "label": "Location", "value": "Downtown Dubai"},
      {"icon": "Clock", "label": "Hours", "value": "10 AM - 10 PM"},
      {"icon": "DollarSign", "label": "Price", "value": "From AED 150"},
      {"icon": "Timer", "label": "Duration", "value": "2-3 hours"},
      {"icon": "Star", "label": "Rating", "value": "4.8/5"}
    ],
    "highlights": [
      {"image": "", "title": "Main Experience", "description": "Description of main attraction"},
      {"image": "", "title": "Secondary Experience", "description": "Another highlight"},
      {"image": "", "title": "Photo Spot", "description": "Instagram-worthy moments"}
    ],
    "ticketInfo": [
      {"type": "Standard Entry", "description": "General admission with all main attractions", "price": "AED 150"},
      {"type": "Premium Experience", "description": "Skip-the-line + exclusive access", "price": "AED 300"},
      {"type": "Family Package", "description": "2 adults + 2 children", "price": "AED 450"}
    ],
    "essentialInfo": [
      {"icon": "MapPin", "label": "Location", "value": "Full address"},
      {"icon": "Clock", "label": "Hours", "value": "10:00 AM - 10:00 PM"},
      {"icon": "DollarSign", "label": "Entry Fee", "value": "From AED 150"},
      {"icon": "Accessibility", "label": "Accessibility", "value": "Fully accessible"},
      {"icon": "Timer", "label": "Duration", "value": "2-3 hours recommended"},
      {"icon": "Users", "label": "Good For", "value": "Families, Couples"},
      {"icon": "Camera", "label": "Photography", "value": "Allowed"},
      {"icon": "Wheelchair", "label": "Accessibility", "value": "Wheelchair accessible"}
    ],
    "visitorTips": [
      "Book tickets online to skip queues",
      "Visit during weekdays for fewer crowds",
      "Wear comfortable shoes",
      "Arrive 30 minutes before your time slot",
      "Check the website for seasonal promotions"
    ],
    "faq": [
      {"question": "What are the opening hours?", "answer": "Open daily from 10 AM to 10 PM, last entry at 9 PM."},
      {"question": "How much are tickets?", "answer": "Standard tickets start from AED 150 per person."},
      {"question": "Is it suitable for children?", "answer": "Yes, suitable for all ages with activities for children."},
      {"question": "How long should I plan for my visit?", "answer": "Allow 2-3 hours for the full experience."},
      {"question": "Is there parking available?", "answer": "Yes, paid parking available nearby."},
      {"question": "Can I bring food and drinks?", "answer": "Outside food is not permitted, but cafes are available inside."}
    ],
    "trustSignals": ["TripAdvisor Top Rated", "Over 1 Million Visitors", "Award-Winning Experience"]
  }
}

Generate unique IDs for each block. Make content accurate for Dubai attractions and SEO-optimized.`;

const ARTICLE_SYSTEM_PROMPT = `You are a Dubai travel content expert creating engaging articles for Dubai Travel website.

Determine the best article structure based on the topic:
- News+Guide: For news with practical advice
- Structured List: For "Top X" or list-based topics
- Comparative: For comparison articles
- Story+Info: For destination/experience features
- Problem-Solution: For tips and how-to articles
- News Update: For pure news items

Your output must be a valid JSON object matching this exact structure:

OUTPUT STRUCTURE:
{
  "content": {
    "title": "Engaging Article Title | Dubai Travel [Year]",
    "slug": "article-url-slug",
    "metaTitle": "SEO Title Under 60 Characters | Dubai Travel",
    "metaDescription": "150-160 char compelling description with keyword",
    "primaryKeyword": "main keyword phrase",
    "secondaryKeywords": ["related keyword 1", "related keyword 2"],
    "lsiKeywords": ["semantic keyword 1", "semantic keyword 2"],
    "heroImageAlt": "Descriptive alt text for featured image",
    "blocks": [
      {
        "id": "unique_id",
        "type": "text",
        "data": {
          "heading": "Introduction",
          "content": "Engaging 100+ word introduction that hooks the reader and sets up the article"
        },
        "order": 0
      },
      {
        "id": "unique_id2",
        "type": "text",
        "data": {
          "heading": "Main Section Heading",
          "content": "200+ words of valuable content with practical information"
        },
        "order": 1
      },
      {
        "id": "unique_id3",
        "type": "text",
        "data": {
          "heading": "Another Section",
          "content": "200+ words of additional valuable content"
        },
        "order": 2
      },
      {
        "id": "unique_id4",
        "type": "tips",
        "data": {
          "title": "Pro Tips",
          "tips": ["3-5 actionable tips"]
        },
        "order": 3
      },
      {
        "id": "unique_id5",
        "type": "faq",
        "data": {
          "title": "Frequently Asked Questions",
          "faqs": [{"question": "...", "answer": "..."}]
        },
        "order": 4
      },
      {
        "id": "unique_id6",
        "type": "cta",
        "data": {
          "heading": "Explore More",
          "text": "Relevant call to action",
          "buttonText": "Learn More",
          "buttonLink": "#"
        },
        "order": 5
      }
    ],
    "seoSchema": {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Article Title",
      "description": "...",
      "author": {"@type": "Organization", "name": "Dubai Travel"},
      "publisher": {"@type": "Organization", "name": "Dubai Travel"}
    }
  },
  "article": {
    "category": "attractions|hotels|food|transport|events|tips|news|shopping",
    "urgencyLevel": "evergreen|seasonal|time-sensitive|breaking",
    "targetAudience": ["Tourists", "Expats", "Families", "Business Travelers"],
    "personality": "Professional Guide|Excited Traveler|Balanced Critic|Local Insider|Practical Planner",
    "tone": "informative|enthusiastic|balanced|insider|practical",
    "quickFacts": [
      "Key fact 1 about the topic",
      "Key fact 2",
      "Key fact 3"
    ],
    "proTips": [
      "Actionable tip 1",
      "Actionable tip 2",
      "Actionable tip 3"
    ],
    "warnings": [
      "Important warning or caveat if applicable"
    ],
    "faq": [
      {"question": "Common question 1?", "answer": "Detailed answer..."},
      {"question": "Common question 2?", "answer": "Detailed answer..."},
      {"question": "Common question 3?", "answer": "Detailed answer..."}
    ]
  }
}

Generate unique IDs for each block. Create engaging, valuable content that serves the reader's needs.`;

export async function generateHotelContent(hotelName: string): Promise<GeneratedHotelContent | null> {
  const openai = getOpenAIClient();
  if (!openai) {
    throw new Error("OpenAI not configured. Please add OPENAI_API_KEY.");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: HOTEL_SYSTEM_PROMPT },
        { 
          role: "user", 
          content: `Generate complete content for a Dubai hotel called "${hotelName}". 
          
Make it realistic and comprehensive. Generate all sections including:
- Full SEO metadata
- Overview text block (200+ words)
- 6 highlights with descriptions
- 3-4 room types with features and pricing
- 12 essential info items
- 2+ dining options
- 5-7 traveler tips
- 6+ FAQ items
- Nearby attractions

Output valid JSON only, no markdown code blocks.`
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    // Ensure blocks have proper IDs
    if (result.content?.blocks) {
      result.content.blocks = result.content.blocks.map((block: ContentBlock, index: number) => ({
        ...block,
        id: block.id || generateBlockId(),
        order: index
      }));
    }

    return result as GeneratedHotelContent;
  } catch (error) {
    console.error("Error generating hotel content:", error);
    throw error;
  }
}

export async function generateAttractionContent(attractionName: string): Promise<GeneratedAttractionContent | null> {
  const openai = getOpenAIClient();
  if (!openai) {
    throw new Error("OpenAI not configured. Please add OPENAI_API_KEY.");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: ATTRACTION_SYSTEM_PROMPT },
        { 
          role: "user", 
          content: `Generate complete content for a Dubai attraction called "${attractionName}".

Make it realistic and comprehensive. Generate all sections including:
- Full SEO metadata
- About text block (150+ words)
- 3-4 highlights with descriptions
- 2-3 ticket options with pricing
- 8 essential info items
- 5 visitor tips
- 6+ FAQ items

Output valid JSON only, no markdown code blocks.`
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    if (result.content?.blocks) {
      result.content.blocks = result.content.blocks.map((block: ContentBlock, index: number) => ({
        ...block,
        id: block.id || generateBlockId(),
        order: index
      }));
    }

    return result as GeneratedAttractionContent;
  } catch (error) {
    console.error("Error generating attraction content:", error);
    throw error;
  }
}

export async function generateArticleContent(
  topic: string, 
  category?: string
): Promise<GeneratedArticleContent | null> {
  const openai = getOpenAIClient();
  if (!openai) {
    throw new Error("OpenAI not configured. Please add OPENAI_API_KEY.");
  }

  try {
    const categoryInstruction = category 
      ? `The article category should be "${category}".` 
      : "Determine the most appropriate category based on the topic.";

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: ARTICLE_SYSTEM_PROMPT },
        { 
          role: "user", 
          content: `Generate a complete article about: "${topic}"

${categoryInstruction}

Make it engaging and valuable for Dubai travelers. Include:
- SEO-optimized title and metadata
- 3-4 content sections (each 150-200+ words)
- Pro tips section
- FAQ section (4-6 questions)
- Appropriate call to action

Output valid JSON only, no markdown code blocks.`
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    if (result.content?.blocks) {
      result.content.blocks = result.content.blocks.map((block: ContentBlock, index: number) => ({
        ...block,
        id: block.id || generateBlockId(),
        order: index
      }));
    }

    return result as GeneratedArticleContent;
  } catch (error) {
    console.error("Error generating article content:", error);
    throw error;
  }
}
