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
    heroImageCaption?: string;
    blocks: ContentBlock[];
    seoSchema: Record<string, unknown>;
    images?: ContentImage[];
  };
  hotel: {
    location: string;
    fullAddress?: string;
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

export interface ContentImage {
  filename: string;
  alt: string;
  caption: string;
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
    heroImageCaption?: string;
    blocks: ContentBlock[];
    seoSchema: Record<string, unknown>;
    images?: ContentImage[];
  };
  attraction: {
    location: string;
    fullAddress?: string;
    duration: string;
    bestTimeToVisit?: string;
    targetAudience: string[];
    primaryCta: string;
    quickInfoBar: QuickInfoItem[];
    highlights: HighlightItem[];
    ticketInfo: TicketInfoItem[];
    essentialInfo: EssentialInfoItem[];
    visitorTips: string[];
    faq: FaqItem[];
    nearbyAttractions?: NearbyItem[];
    trustSignals: string[];
    relatedKeywords?: string[];
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
    heroImageCaption?: string;
    blocks: ContentBlock[];
    seoSchema: Record<string, unknown>;
    images?: ContentImage[];
  };
  article: {
    category: string;
    urgencyLevel: string;
    targetAudience: string[];
    personality: string;
    tone: string;
    structure: string;
    quickFacts: string[];
    proTips: string[];
    warnings: string[];
    faq: FaqItem[];
    relatedTopics?: string[];
  };
}

export interface GeneratedDiningContent {
  content: {
    title: string;
    slug: string;
    metaTitle: string;
    metaDescription: string;
    primaryKeyword: string;
    secondaryKeywords: string[];
    lsiKeywords: string[];
    heroImageAlt: string;
    heroImageCaption?: string;
    blocks: ContentBlock[];
    seoSchema: Record<string, unknown>;
    images?: ContentImage[];
  };
  dining: {
    restaurantName: string;
    location: string;
    fullAddress?: string;
    cuisineType: string;
    priceRange: string;
    openingHours: string;
    dressCode?: string;
    reservationRequired: boolean;
    targetAudience: string[];
    primaryCta: string;
    quickInfoBar: QuickInfoItem[];
    highlights: HighlightItem[];
    menuHighlights: { name: string; description: string; price: string }[];
    essentialInfo: EssentialInfoItem[];
    ambiance: string[];
    diningTips: string[];
    faq: FaqItem[];
    nearbyAttractions: NearbyItem[];
  };
}

export interface GeneratedDistrictContent {
  content: {
    title: string;
    slug: string;
    metaTitle: string;
    metaDescription: string;
    primaryKeyword: string;
    secondaryKeywords: string[];
    lsiKeywords: string[];
    heroImageAlt: string;
    heroImageCaption?: string;
    blocks: ContentBlock[];
    seoSchema: Record<string, unknown>;
    images?: ContentImage[];
  };
  district: {
    districtName: string;
    location: string;
    characteristics: string[];
    targetAudience: string[];
    primaryCta: string;
    quickInfoBar: QuickInfoItem[];
    highlights: HighlightItem[];
    topAttractions: { name: string; type: string; description: string }[];
    diningOptions: { name: string; cuisine: string; priceRange: string }[];
    shoppingSpots: { name: string; type: string; description: string }[];
    essentialInfo: EssentialInfoItem[];
    explorationTips: string[];
    faq: FaqItem[];
    gettingAround: string[];
  };
}

export interface GeneratedTransportContent {
  content: {
    title: string;
    slug: string;
    metaTitle: string;
    metaDescription: string;
    primaryKeyword: string;
    secondaryKeywords: string[];
    lsiKeywords: string[];
    heroImageAlt: string;
    heroImageCaption?: string;
    blocks: ContentBlock[];
    seoSchema: Record<string, unknown>;
    images?: ContentImage[];
  };
  transport: {
    transportType: string;
    operatingHours: string;
    coverage: string[];
    targetAudience: string[];
    primaryCta: string;
    quickInfoBar: QuickInfoItem[];
    highlights: HighlightItem[];
    fareStructure: { type: string; price: string; description: string }[];
    routes: { name: string; from: string; to: string; duration: string }[];
    essentialInfo: EssentialInfoItem[];
    usageTips: string[];
    faq: FaqItem[];
    connections: string[];
  };
}

export interface GeneratedEventContent {
  content: {
    title: string;
    slug: string;
    metaTitle: string;
    metaDescription: string;
    primaryKeyword: string;
    secondaryKeywords: string[];
    lsiKeywords: string[];
    heroImageAlt: string;
    heroImageCaption?: string;
    blocks: ContentBlock[];
    seoSchema: Record<string, unknown>;
    images?: ContentImage[];
  };
  event: {
    eventName: string;
    eventType: string;
    dates: string;
    venue: string;
    location: string;
    targetAudience: string[];
    primaryCta: string;
    quickInfoBar: QuickInfoItem[];
    highlights: HighlightItem[];
    ticketInfo: TicketInfoItem[];
    schedule: { time: string; activity: string; description: string }[];
    essentialInfo: EssentialInfoItem[];
    attendeeTips: string[];
    faq: FaqItem[];
    relatedEvents?: string[];
  };
}

export interface GeneratedItineraryContent {
  content: {
    title: string;
    slug: string;
    metaTitle: string;
    metaDescription: string;
    primaryKeyword: string;
    secondaryKeywords: string[];
    lsiKeywords: string[];
    heroImageAlt: string;
    heroImageCaption?: string;
    blocks: ContentBlock[];
    seoSchema: Record<string, unknown>;
    images?: ContentImage[];
  };
  itinerary: {
    duration: string;
    tripType: string;
    budget: string;
    targetAudience: string[];
    primaryCta: string;
    quickInfoBar: QuickInfoItem[];
    highlights: HighlightItem[];
    dayByDay: {
      day: number;
      title: string;
      activities: { time: string; activity: string; location: string; duration: string; tips: string }[];
    }[];
    essentialInfo: EssentialInfoItem[];
    packingList: string[];
    budgetBreakdown: { category: string; amount: string; notes: string }[];
    travelTips: string[];
    faq: FaqItem[];
  };
}

const HOTEL_SYSTEM_PROMPT = `You are a Dubai travel content expert creating comprehensive, SEO-optimized hotel pages for Dubai Travel website.

CONTENT REQUIREMENTS:
- Total word count: 1200-2000 words across all text blocks
- Every piece of content must be accurate, engaging, and valuable for travelers
- Include natural keyword placement throughout the content
- Write in a professional yet inviting hospitality tone

Your output must be a valid JSON object matching this exact structure:

OUTPUT STRUCTURE:
{
  "content": {
    "title": "Hotel Name Dubai | Luxury 5-Star Resort & Spa 2025",
    "slug": "hotel-name-dubai",
    "metaTitle": "Hotel Name Dubai - Best Rates & Booking 2025",
    "metaDescription": "150-160 char description with primary keyword, key amenities, star rating, and compelling booking call to action",
    "primaryKeyword": "hotel name dubai",
    "secondaryKeywords": ["hotel name booking", "dubai luxury hotels", "stay at hotel name", "hotel name resort"],
    "lsiKeywords": ["accommodation", "resort", "stay", "rooms", "suites", "amenities", "booking"],
    "heroImageAlt": "Stunning exterior view of [Hotel Name] Dubai showing [specific architectural feature or view]",
    "heroImageCaption": "Captivating description for hero image highlighting the property",
    "blocks": [
      {
        "id": "hero_block",
        "type": "hero",
        "data": {
          "title": "Welcome to [Hotel Name]",
          "subtitle": "One compelling sentence about the hotel experience and location",
          "overlayText": "Dubai's Premier [Luxury/Beachfront/Urban] Retreat"
        },
        "order": 0
      },
      {
        "id": "overview_text",
        "type": "text",
        "data": {
          "heading": "About [Hotel Name]",
          "content": "Write 250-350 words. Start with 2-3 engaging sentences as the visible intro that capture the essence of the property. Then expand covering: what makes this hotel unique in Dubai's competitive hospitality scene, architectural design and aesthetic, the guest experience from arrival to departure, signature amenities and services, location advantages, views and surroundings, who this hotel is ideal for."
        },
        "order": 1
      },
      {
        "id": "highlights_block",
        "type": "highlights",
        "data": {
          "title": "Hotel Highlights",
          "items": ["6 key property highlights - be specific about signature features, experiences, and amenities"]
        },
        "order": 2
      },
      {
        "id": "accommodation_text",
        "type": "text",
        "data": {
          "heading": "Rooms & Suites",
          "content": "Write 150-200 words describing accommodation options: room categories, suite offerings, signature room features, views available, in-room amenities, bedding quality, bathroom features, technology amenities."
        },
        "order": 3
      },
      {
        "id": "dining_text",
        "type": "text",
        "data": {
          "heading": "Dining Experience",
          "content": "Write 150-200 words covering: number of restaurants and bars, cuisine types, signature restaurants and chefs, breakfast experience, room service, poolside dining, special dining experiences, dress codes, reservation recommendations."
        },
        "order": 4
      },
      {
        "id": "wellness_text",
        "type": "text",
        "data": {
          "heading": "Wellness & Recreation",
          "content": "Write 100-150 words about: spa and wellness facilities, gym and fitness center, pools, beach access, sports facilities, activities and experiences, kids facilities, entertainment options."
        },
        "order": 5
      },
      {
        "id": "location_text",
        "type": "text",
        "data": {
          "heading": "Location & Surroundings",
          "content": "Write 100-150 words about: exact location and neighborhood, nearby attractions and landmarks, shopping options, transportation connections, airport distance and transfer options, what guests can explore in the area."
        },
        "order": 6
      },
      {
        "id": "tips_block",
        "type": "tips",
        "data": {
          "title": "Guest Tips & Insider Advice",
          "tips": ["7 detailed practical tips for guests - each should be actionable and specific to this property"]
        },
        "order": 7
      },
      {
        "id": "faq_block",
        "type": "faq",
        "data": {
          "title": "Frequently Asked Questions",
          "faqs": [
            {"question": "Question 1?", "answer": "100-200 word detailed answer with practical information"},
            {"question": "Question 2?", "answer": "100-200 word detailed answer"},
            {"question": "Question 3?", "answer": "100-200 word detailed answer"},
            {"question": "Question 4?", "answer": "100-200 word detailed answer"},
            {"question": "Question 5?", "answer": "100-200 word detailed answer"},
            {"question": "Question 6?", "answer": "100-200 word detailed answer"},
            {"question": "Question 7?", "answer": "100-200 word detailed answer"},
            {"question": "Question 8?", "answer": "100-200 word detailed answer"}
          ]
        },
        "order": 8
      },
      {
        "id": "cta_block",
        "type": "cta",
        "data": {
          "heading": "Ready to Experience [Hotel Name]?",
          "text": "Book your stay today and discover Dubai's finest hospitality",
          "buttonText": "Check Availability",
          "buttonLink": "#book"
        },
        "order": 9
      }
    ],
    "seoSchema": {
      "@context": "https://schema.org",
      "@type": "Hotel",
      "name": "Hotel Name",
      "description": "Comprehensive 150-200 word description for SEO schema covering property, location, and amenities",
      "url": "https://dubaitravel.com/hotels/hotel-name-dubai",
      "image": {
        "@type": "ImageObject",
        "url": "",
        "caption": "Hotel Name Dubai"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Full street address",
        "addressLocality": "Dubai",
        "addressRegion": "Dubai",
        "addressCountry": "AE",
        "postalCode": "00000"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "25.XXXX",
        "longitude": "55.XXXX"
      },
      "starRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "numberOfRooms": 300,
      "petsAllowed": false,
      "checkinTime": "15:00",
      "checkoutTime": "12:00",
      "amenityFeature": [
        {"@type": "LocationFeatureSpecification", "name": "Swimming Pool", "value": true},
        {"@type": "LocationFeatureSpecification", "name": "Spa", "value": true},
        {"@type": "LocationFeatureSpecification", "name": "Fitness Center", "value": true},
        {"@type": "LocationFeatureSpecification", "name": "Free WiFi", "value": true},
        {"@type": "LocationFeatureSpecification", "name": "Restaurant", "value": true},
        {"@type": "LocationFeatureSpecification", "name": "Room Service", "value": true}
      ],
      "priceRange": "AED 1,200 - 15,000",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "5000"
      }
    },
    "images": [
      {"filename": "hotel-name-exterior.jpg", "alt": "Exterior view of [Hotel Name] Dubai with [specific details]", "caption": "The stunning facade of [Hotel Name]"},
      {"filename": "hotel-name-lobby.jpg", "alt": "Grand lobby interior of [Hotel Name]", "caption": "Experience our elegant arrival experience"},
      {"filename": "hotel-name-room.jpg", "alt": "[Room type] at [Hotel Name] featuring [view/feature]", "caption": "Luxurious accommodations with [feature]"},
      {"filename": "hotel-name-pool.jpg", "alt": "[Pool description] at [Hotel Name]", "caption": "Relax at our [pool feature]"},
      {"filename": "hotel-name-dining.jpg", "alt": "[Restaurant name] at [Hotel Name] showing [cuisine/ambiance]", "caption": "Culinary excellence at [Restaurant name]"}
    ]
  },
  "hotel": {
    "location": "Palm Jumeirah, Dubai - Full area name",
    "fullAddress": "Complete street address, area, Dubai, UAE",
    "starRating": 5,
    "numberOfRooms": 300,
    "amenities": ["Pool", "Spa", "Gym", "Beach Access", "WiFi", "Multiple Restaurants", "Bar", "Kids Club", "Business Center", "Concierge"],
    "targetAudience": ["Luxury Travelers", "Families", "Couples", "Business Travelers", "Honeymooners"],
    "primaryCta": "Book Now - Best Rate Guarantee",
    "quickInfoBar": [
      {"icon": "MapPin", "label": "Location", "value": "Palm Jumeirah"},
      {"icon": "Star", "label": "Rating", "value": "5-Star Luxury"},
      {"icon": "Waves", "label": "Beach", "value": "Private Beach"},
      {"icon": "Utensils", "label": "Dining", "value": "8 Restaurants"},
      {"icon": "Plane", "label": "Airport", "value": "25 min transfer"},
      {"icon": "Clock", "label": "Check-in", "value": "3:00 PM"},
      {"icon": "Wifi", "label": "WiFi", "value": "Complimentary"},
      {"icon": "Car", "label": "Parking", "value": "Valet available"}
    ],
    "highlights": [
      {"image": "", "title": "Signature Feature 1", "description": "50-80 word description of this unique hotel feature or experience"},
      {"image": "", "title": "Signature Feature 2", "description": "50-80 word description"},
      {"image": "", "title": "Signature Feature 3", "description": "50-80 word description"},
      {"image": "", "title": "Signature Feature 4", "description": "50-80 word description"},
      {"image": "", "title": "Signature Feature 5", "description": "50-80 word description"},
      {"image": "", "title": "Signature Feature 6", "description": "50-80 word description"}
    ],
    "roomTypes": [
      {"image": "", "title": "Deluxe Room", "features": ["Sea View", "King Bed", "Balcony", "45 sqm"], "price": "From AED 1,200/night"},
      {"image": "", "title": "Premium Suite", "features": ["Ocean View", "Living Area", "Butler Service", "85 sqm"], "price": "From AED 2,500/night"},
      {"image": "", "title": "Presidential Suite", "features": ["Panoramic Views", "Private Pool", "Full Kitchen", "200 sqm"], "price": "From AED 8,000/night"},
      {"image": "", "title": "Family Room", "features": ["Garden View", "Two Queen Beds", "Kids Amenities", "55 sqm"], "price": "From AED 1,500/night"}
    ],
    "essentialInfo": [
      {"icon": "MapPin", "label": "Address", "value": "Full street address, Dubai, UAE"},
      {"icon": "Clock", "label": "Check-in", "value": "3:00 PM (early check-in on request)"},
      {"icon": "Clock", "label": "Check-out", "value": "12:00 PM (late check-out on request)"},
      {"icon": "DollarSign", "label": "Price Range", "value": "AED 1,200 - 15,000/night"},
      {"icon": "Plane", "label": "Airport Distance", "value": "25 minutes by car"},
      {"icon": "Waves", "label": "Pools", "value": "5 pools including kids pool"},
      {"icon": "Utensils", "label": "Dining", "value": "8 restaurants, 4 bars"},
      {"icon": "Wifi", "label": "WiFi", "value": "Complimentary high-speed"},
      {"icon": "Accessibility", "label": "Accessibility", "value": "Fully wheelchair accessible"},
      {"icon": "Car", "label": "Parking", "value": "Complimentary valet parking"},
      {"icon": "Baby", "label": "Family", "value": "Kids club ages 4-12, babysitting"},
      {"icon": "Dumbbell", "label": "Fitness", "value": "24-hour gym with personal trainers"}
    ],
    "diningPreview": [
      {"name": "Main Restaurant", "cuisine": "International Buffet", "description": "All-day dining with global flavors and live cooking stations"},
      {"name": "Signature Restaurant", "cuisine": "Fine Dining", "description": "Michelin-quality experience with celebrity chef creations"},
      {"name": "Pool Bar", "cuisine": "Light Bites & Cocktails", "description": "Refreshing poolside service throughout the day"},
      {"name": "Specialty Restaurant", "cuisine": "Asian Fusion", "description": "Authentic flavors in an elegant setting"}
    ],
    "activities": ["Swimming", "Spa treatments", "Water sports", "Tennis", "Fitness classes", "Kids activities", "Beach activities", "Golf nearby"],
    "travelerTips": [
      "Book pool cabanas in advance during peak season (November-March) as they sell out quickly",
      "Request a room on higher floors for better views - corner rooms offer the best panoramas",
      "The breakfast buffet opens at 6:30 AM for early risers, but the 9-10 AM slot is most popular",
      "Join the hotel loyalty program before booking for instant upgrades and late checkout",
      "Book specialty restaurants at least 48 hours in advance, especially for weekend dinners",
      "Ask concierge about complimentary shuttle services to nearby attractions",
      "Early evening is the best time for beach photos as the lighting is perfect"
    ],
    "faq": [
      {"question": "What time is check-in and check-out at [Hotel Name]?", "answer": "Write 100-200 words covering: standard times, early/late options, luggage storage, express check-in for members, online check-in availability."},
      {"question": "Is parking available at [Hotel Name]?", "answer": "Write 100-200 words covering: valet vs self-parking, costs, EV charging, taxi/ride-share options, hotel transfers."},
      {"question": "Does [Hotel Name] have a private beach?", "answer": "Write 100-200 words covering: beach details, facilities, service, water activities, best times."},
      {"question": "Are pets allowed at [Hotel Name]?", "answer": "Write 100-200 words covering: pet policy, alternatives, nearby pet services."},
      {"question": "What family facilities does [Hotel Name] offer?", "answer": "Write 100-200 words covering: kids club, babysitting, family rooms, children's menus, age policies."},
      {"question": "What dining options are available at [Hotel Name]?", "answer": "Write 100-200 words covering: all F&B outlets, cuisines, hours, dress codes, reservations."},
      {"question": "How do I get from Dubai Airport to [Hotel Name]?", "answer": "Write 100-200 words covering: transfer options, taxi costs, hotel shuttle, public transport, journey time."},
      {"question": "Does [Hotel Name] offer spa and wellness facilities?", "answer": "Write 100-200 words covering: spa details, treatments, gym, classes, pool facilities, operating hours."}
    ],
    "locationNearby": [
      {"name": "Dubai Mall", "distance": "15 min by car", "type": "Shopping"},
      {"name": "Burj Khalifa", "distance": "20 min by car", "type": "Attraction"},
      {"name": "Dubai Marina", "distance": "10 min by car", "type": "District"},
      {"name": "Mall of the Emirates", "distance": "12 min by car", "type": "Shopping"}
    ],
    "trustSignals": ["TripAdvisor Certificate of Excellence 2024", "Forbes 5-Star Rating", "Booking.com Traveller Review Award 9.4", "Condé Nast Traveler Gold List"]
  }
}

Generate unique IDs for each block. Make content engaging, accurate for Dubai hotels, and SEO-optimized.`;

const ATTRACTION_SYSTEM_PROMPT = `You are a Dubai travel content expert creating comprehensive, SEO-optimized attraction pages for Dubai Travel website.

CONTENT REQUIREMENTS:
- Total word count: 1200-2000 words across all text blocks
- Every piece of content must be accurate, engaging, and valuable for tourists
- Include natural keyword placement throughout the content
- Write in an informative yet engaging tone

Your output must be a valid JSON object matching this exact structure:

OUTPUT STRUCTURE:
{
  "content": {
    "title": "Attraction Name Dubai | Complete Guide & Tickets 2025",
    "slug": "attraction-name-dubai",
    "metaTitle": "Attraction Name Dubai - Tickets, Hours & Tips 2025",
    "metaDescription": "150-160 char description with primary keyword, key info (price, hours), and compelling call to action",
    "primaryKeyword": "attraction name dubai",
    "secondaryKeywords": ["attraction name tickets", "dubai attractions", "things to do dubai", "visit attraction name"],
    "lsiKeywords": ["experience", "tour", "visit", "explore", "entry fee", "opening hours"],
    "heroImageAlt": "Stunning view of [Attraction Name] in Dubai showing [specific visual element]",
    "heroImageCaption": "Captivating description for hero image",
    "blocks": [
      {
        "id": "hero_block",
        "type": "hero",
        "data": {
          "title": "Discover [Attraction Name]",
          "subtitle": "One compelling sentence about the experience",
          "overlayText": "Dubai's Iconic [Category] Experience"
        },
        "order": 0
      },
      {
        "id": "intro_text",
        "type": "text",
        "data": {
          "heading": "About [Attraction Name]",
          "content": "Write 250-350 words. Start with 2-3 engaging sentences as the visible intro that hook the reader. Then expand covering: what makes this attraction special and unique to Dubai, the complete visitor experience from arrival to departure, architectural or design significance, historical context if relevant, atmosphere and ambiance, best times to visit for optimal experience, what makes it worth visiting compared to similar attractions."
        },
        "order": 1
      },
      {
        "id": "experience_text",
        "type": "text",
        "data": {
          "heading": "The Complete Experience",
          "content": "Write 200-300 words. Describe the full visitor journey: what you see, do, and feel. Include specific details about exhibits, activities, or zones. Mention photo opportunities, interactive elements, and memorable moments."
        },
        "order": 2
      },
      {
        "id": "highlights_block",
        "type": "highlights",
        "data": {
          "title": "Top Experiences & Highlights",
          "items": ["6 key experience highlights - be specific about what visitors will see and do"]
        },
        "order": 3
      },
      {
        "id": "planning_text",
        "type": "text",
        "data": {
          "heading": "Planning Your Visit",
          "content": "Write 150-200 words. Cover practical planning information: how to get there (metro, taxi, parking), best time of day to visit, how to avoid crowds, what to wear, what to bring, accessibility information."
        },
        "order": 4
      },
      {
        "id": "tips_block",
        "type": "tips",
        "data": {
          "title": "Insider Tips from Frequent Visitors",
          "tips": ["7 detailed practical tips - each should be actionable and specific, not generic advice"]
        },
        "order": 5
      },
      {
        "id": "nearby_text",
        "type": "text",
        "data": {
          "heading": "Nearby Attractions & Dining",
          "content": "Write 100-150 words about what else visitors can do in the area. Suggest combining with other nearby attractions, restaurants, or activities to make a full day trip."
        },
        "order": 6
      },
      {
        "id": "faq_block",
        "type": "faq",
        "data": {
          "title": "Frequently Asked Questions",
          "faqs": [
            {"question": "Question 1?", "answer": "100-200 word detailed answer with practical information"},
            {"question": "Question 2?", "answer": "100-200 word detailed answer"},
            {"question": "Question 3?", "answer": "100-200 word detailed answer"},
            {"question": "Question 4?", "answer": "100-200 word detailed answer"},
            {"question": "Question 5?", "answer": "100-200 word detailed answer"},
            {"question": "Question 6?", "answer": "100-200 word detailed answer"},
            {"question": "Question 7?", "answer": "100-200 word detailed answer"},
            {"question": "Question 8?", "answer": "100-200 word detailed answer"}
          ]
        },
        "order": 7
      },
      {
        "id": "cta_block",
        "type": "cta",
        "data": {
          "heading": "Ready to Experience [Attraction Name]?",
          "text": "Book your tickets now and discover why millions visit every year",
          "buttonText": "Get Tickets",
          "buttonLink": "#tickets"
        },
        "order": 8
      }
    ],
    "seoSchema": {
      "@context": "https://schema.org",
      "@type": "TouristAttraction",
      "name": "Attraction Name",
      "description": "Comprehensive 150-200 word description for SEO schema",
      "url": "https://dubaitravel.com/attractions/attraction-name-dubai",
      "image": {
        "@type": "ImageObject",
        "url": "",
        "caption": "Attraction Name in Dubai"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Full street address",
        "addressLocality": "Dubai",
        "addressRegion": "Dubai",
        "addressCountry": "AE"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "25.XXXX",
        "longitude": "55.XXXX"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "10:00",
          "closes": "22:00"
        }
      ],
      "priceRange": "AED 150-500",
      "isAccessibleForFree": false,
      "publicAccess": true,
      "touristType": ["Family", "Couples", "Solo Travelers"],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "10000"
      }
    },
    "images": [
      {"filename": "attraction-name-exterior.jpg", "alt": "Exterior view of [Attraction Name] with [specific details]", "caption": "The stunning exterior of [Attraction Name]"},
      {"filename": "attraction-name-interior.jpg", "alt": "Inside [Attraction Name] showing [specific feature]", "caption": "Experience the [specific area] inside"},
      {"filename": "attraction-name-highlight.jpg", "alt": "[Specific highlight] at [Attraction Name]", "caption": "Don't miss the [highlight feature]"},
      {"filename": "attraction-name-view.jpg", "alt": "Panoramic view from [Attraction Name]", "caption": "Breathtaking views from [location]"},
      {"filename": "attraction-name-experience.jpg", "alt": "Visitors enjoying [activity] at [Attraction Name]", "caption": "[Activity description]"}
    ]
  },
  "attraction": {
    "location": "Downtown Dubai / Palm Jumeirah / etc - Full area name",
    "fullAddress": "Complete street address, area, Dubai, UAE",
    "duration": "2-3 hours",
    "bestTimeToVisit": "Early morning or late afternoon for fewer crowds",
    "targetAudience": ["Families with children", "Couples", "Solo Travelers", "Photography Enthusiasts", "First-time Dubai Visitors"],
    "primaryCta": "Book Tickets - Skip the Line",
    "quickInfoBar": [
      {"icon": "MapPin", "label": "Location", "value": "Downtown Dubai"},
      {"icon": "Clock", "label": "Hours", "value": "10 AM - 10 PM Daily"},
      {"icon": "DollarSign", "label": "Price", "value": "From AED 150"},
      {"icon": "Timer", "label": "Duration", "value": "2-3 hours"},
      {"icon": "Star", "label": "Rating", "value": "4.8/5 (10K+ reviews)"},
      {"icon": "Users", "label": "Best For", "value": "Families, Couples"},
      {"icon": "Calendar", "label": "Best Time", "value": "Weekday mornings"},
      {"icon": "Accessibility", "label": "Access", "value": "Wheelchair Friendly"}
    ],
    "highlights": [
      {"image": "", "title": "Main Experience Title", "description": "50-80 word description of this highlight experience"},
      {"image": "", "title": "Second Experience", "description": "50-80 word description"},
      {"image": "", "title": "Photo Opportunity", "description": "50-80 word description of best photo spots"},
      {"image": "", "title": "Unique Feature", "description": "50-80 word description"},
      {"image": "", "title": "Interactive Element", "description": "50-80 word description"},
      {"image": "", "title": "Hidden Gem", "description": "50-80 word description of lesser-known feature"}
    ],
    "ticketInfo": [
      {"type": "Standard Entry", "description": "General admission with access to all main attractions. Includes entry to all zones and exhibits.", "price": "AED 150", "includes": ["All main areas", "Standard photo spots"]},
      {"type": "Premium Experience", "description": "Skip-the-line access plus exclusive areas and priority seating for shows.", "price": "AED 300", "includes": ["Fast-track entry", "VIP areas", "Guided tour"]},
      {"type": "Family Package", "description": "2 adults + 2 children (ages 3-12). Best value for families.", "price": "AED 450", "includes": ["All standard access", "Kids activity pack"]},
      {"type": "Combo Package", "description": "Combined ticket with nearby attraction for a full day experience.", "price": "AED 400", "includes": ["Two attractions", "Valid for 7 days"]}
    ],
    "essentialInfo": [
      {"icon": "MapPin", "label": "Address", "value": "Full street address, area, Dubai"},
      {"icon": "Clock", "label": "Opening Hours", "value": "10:00 AM - 10:00 PM (Last entry 9 PM)"},
      {"icon": "DollarSign", "label": "Entry Fee", "value": "From AED 150 per adult"},
      {"icon": "Baby", "label": "Children", "value": "Free under 3, discounted 3-12"},
      {"icon": "Timer", "label": "Recommended Duration", "value": "2-3 hours for full experience"},
      {"icon": "Users", "label": "Best For", "value": "Families, Couples, Photographers"},
      {"icon": "Camera", "label": "Photography", "value": "Allowed, no flash"},
      {"icon": "Accessibility", "label": "Accessibility", "value": "Fully wheelchair accessible"},
      {"icon": "Car", "label": "Parking", "value": "Available nearby, AED 20/hour"},
      {"icon": "Train", "label": "Metro", "value": "Nearest station name, 5 min walk"},
      {"icon": "Shirt", "label": "Dress Code", "value": "Smart casual recommended"},
      {"icon": "Utensils", "label": "Dining", "value": "Cafes and restaurants on-site"}
    ],
    "visitorTips": [
      "Book tickets online at least 24 hours in advance to secure your preferred time slot and skip the ticket counter queue",
      "Visit on weekday mornings (Tuesday-Thursday before 11 AM) for the best experience with fewer crowds",
      "Wear comfortable walking shoes as you'll be on your feet for 2-3 hours exploring the attraction",
      "Download the official app before your visit for interactive guides, maps, and real-time wait times",
      "Arrive 30 minutes before your scheduled time slot to clear security and start on time",
      "Check the website for seasonal promotions and combo deals that can save up to 30% on tickets",
      "Bring a light jacket as the air conditioning inside can be quite cool compared to outdoor temperatures"
    ],
    "faq": [
      {"question": "What are the opening hours of [Attraction Name]?", "answer": "Write 100-200 words covering: daily hours, seasonal variations, last entry times, best times to visit for crowds, holiday hours, any special extended hours events."},
      {"question": "How much do tickets cost and what's included?", "answer": "Write 100-200 words covering: all ticket types, what each includes, child/senior discounts, where to buy, online vs on-site pricing differences, combo packages available."},
      {"question": "Is [Attraction Name] suitable for children and families?", "answer": "Write 100-200 words covering: age recommendations, specific family activities, stroller access, baby changing facilities, kids menu at restaurants, family packages."},
      {"question": "How long should I plan for my visit?", "answer": "Write 100-200 words covering: minimum time needed, recommended duration, factors affecting visit length, suggested itinerary for different durations."},
      {"question": "What's the best way to get to [Attraction Name]?", "answer": "Write 100-200 words covering: metro directions, taxi/Uber options, parking availability and costs, walking from nearby landmarks."},
      {"question": "Can I bring food and drinks inside?", "answer": "Write 100-200 words covering: food policy, available dining options, price ranges, dietary accommodations, water bottle policy."},
      {"question": "Is photography allowed at [Attraction Name]?", "answer": "Write 100-200 words covering: general photo policy, restricted areas, professional equipment rules, best photo spots, tips for great shots."},
      {"question": "Are there any discounts or special offers available?", "answer": "Write 100-200 words covering: current promotions, student/resident discounts, group rates, seasonal deals, credit card offers."}
    ],
    "nearbyAttractions": [
      {"name": "Nearby Attraction 1", "distance": "5 min walk", "type": "Attraction"},
      {"name": "Popular Restaurant", "distance": "2 min walk", "type": "Dining"},
      {"name": "Shopping Mall", "distance": "10 min walk", "type": "Shopping"},
      {"name": "Another Landmark", "distance": "15 min drive", "type": "Attraction"}
    ],
    "trustSignals": ["TripAdvisor Travelers' Choice 2024", "Over 1 Million Annual Visitors", "Google 4.8 Star Rating", "Dubai Tourism Award Winner"],
    "relatedKeywords": ["attractions", "tourism", "sightseeing", "landmarks", "experiences"]
  }
}

IMPORTANT GUIDELINES:
1. Generate unique random IDs for each block (e.g., "abc123", "xyz789")
2. Total content should be 1200-2000 words across all text blocks
3. FAQ answers must each be 100-200 words - comprehensive and helpful
4. Include 7 specific, actionable visitor tips
5. All information must be accurate for Dubai attractions
6. Use natural keyword placement - don't stuff keywords
7. Write engaging content that helps tourists plan their visit`;

const ARTICLE_SYSTEM_PROMPT = `You are a Dubai travel content expert creating comprehensive, SEO-optimized articles for Dubai Travel website.

CONTENT REQUIREMENTS:
- Total word count: 1200-2000 words across all text blocks
- Every piece of content must be accurate, engaging, and valuable for travelers
- Include natural keyword placement throughout the content

STEP 1 - SELECT WRITING PERSONALITY (choose the most appropriate for the topic):

A. PROFESSIONAL GUIDE
   - Tone: Informative, factual, authoritative
   - Style: Third-person, objective, well-researched
   - Focus: Accuracy, comprehensiveness, credibility
   - Best for: Official information, regulations, historical facts, travel advisories
   - Example phrases: "According to...", "It's important to note...", "Travelers should be aware..."

B. EXCITED TRAVELER
   - Tone: Enthusiastic, personal, energetic
   - Style: First-person experiences, vivid descriptions, emotional engagement
   - Focus: Wonder, discovery, memorable moments
   - Best for: New attractions, hidden gems, unique experiences, inspiration pieces
   - Example phrases: "You won't believe...", "The moment you step in...", "This is absolutely..."

C. BALANCED CRITIC
   - Tone: Balanced, honest, analytical
   - Style: Pros and cons, fair assessments, evidence-based opinions
   - Focus: Value for money, realistic expectations, informed decisions
   - Best for: Reviews, comparisons, "is it worth it" articles
   - Example phrases: "On one hand... on the other...", "While it excels at...", "Consider whether..."

D. LOCAL INSIDER
   - Tone: Friendly, conversational, knowledgeable
   - Style: Tips from a friend, secret spots, local perspective
   - Focus: Hidden gems, avoiding tourist traps, authentic experiences
   - Best for: Off-the-beaten-path guides, cultural insights, neighborhood guides
   - Example phrases: "Locals know that...", "Skip the crowds and...", "The real gem is..."

E. PRACTICAL PLANNER
   - Tone: Practical, organized, step-by-step
   - Style: Lists, timelines, budgets, itineraries
   - Focus: Logistics, planning, efficiency, money-saving
   - Best for: How-to guides, itineraries, budget guides, planning articles
   - Example phrases: "Here's exactly how to...", "Step 1:", "Budget approximately...", "Book in advance..."

STEP 2 - SELECT ARTICLE STRUCTURE (choose the most appropriate for the topic):

1. NEWS+GUIDE STRUCTURE
   - Hook with breaking news or announcement
   - Explain what happened/changed
   - Practical impact for travelers
   - What you need to do now
   - Timeline or dates
   - Expert tips for navigating the change

2. STRUCTURED LIST (TOP X) STRUCTURE
   - Introduction explaining selection criteria
   - Numbered items (5-10) with consistent format
   - Each item: Title, description (80-120 words), key details, tip
   - Summary comparing options
   - How to choose the right one

3. COMPARATIVE STRUCTURE
   - Introduction to the comparison
   - Side-by-side breakdown by category
   - Pros and cons for each option
   - Price comparison table
   - Winner for different traveler types
   - Final recommendation

4. STORY+INFO STRUCTURE
   - Narrative hook (scene-setting, personal experience)
   - Transition to practical information
   - Detailed experience description
   - Practical planning section
   - Emotional closing with call to action

5. PROBLEM-SOLUTION STRUCTURE
   - Identify common traveler problem/challenge
   - Explain why it happens
   - Present multiple solutions
   - Step-by-step implementation
   - Prevention tips for the future

6. NEWS UPDATE STRUCTURE
   - Breaking headline
   - What, when, where, who summary
   - Impact analysis
   - Official sources and quotes
   - What to expect next
   - Related developments

Your output must be a valid JSON object matching this exact structure:

OUTPUT STRUCTURE:
{
  "content": {
    "title": "Compelling Article Title | Dubai Travel 2025",
    "slug": "article-url-slug",
    "metaTitle": "SEO Title Under 60 Characters | Dubai Travel",
    "metaDescription": "150-160 char compelling description with primary keyword and value proposition",
    "primaryKeyword": "main keyword phrase",
    "secondaryKeywords": ["related keyword 1", "related keyword 2", "related keyword 3", "related keyword 4"],
    "lsiKeywords": ["semantic keyword 1", "semantic keyword 2", "semantic keyword 3", "semantic keyword 4", "semantic keyword 5"],
    "heroImageAlt": "Descriptive alt text for featured image showing [specific scene relevant to article]",
    "heroImageCaption": "Captivating caption that adds context to the hero image",
    "blocks": [
      {
        "id": "hero_block",
        "type": "hero",
        "data": {
          "title": "Compelling Main Headline",
          "subtitle": "One sentence that expands on the headline and hooks the reader",
          "overlayText": "Short category or context label"
        },
        "order": 0
      },
      {
        "id": "intro_text",
        "type": "text",
        "data": {
          "heading": "Introduction or Hook Heading",
          "content": "Write 200-250 words. Start with a compelling hook that matches your chosen personality. Set the stage for the article, explain why this topic matters to travelers, and preview what they'll learn. Include the primary keyword naturally."
        },
        "order": 1
      },
      {
        "id": "main_content_1",
        "type": "text",
        "data": {
          "heading": "First Main Section (structure-specific)",
          "content": "Write 200-300 words. This section varies based on your chosen structure. For lists, start your numbered items. For news, explain the development. For comparisons, introduce the options. Be specific and valuable."
        },
        "order": 2
      },
      {
        "id": "main_content_2",
        "type": "text",
        "data": {
          "heading": "Second Main Section",
          "content": "Write 200-300 words. Continue developing the article based on structure. Add depth, examples, and practical details."
        },
        "order": 3
      },
      {
        "id": "main_content_3",
        "type": "text",
        "data": {
          "heading": "Third Main Section (if applicable)",
          "content": "Write 150-250 words. Additional content section for longer articles. Can include case studies, examples, or expanded explanations."
        },
        "order": 4
      },
      {
        "id": "highlights_block",
        "type": "highlights",
        "data": {
          "title": "Key Takeaways",
          "items": ["6 key points that summarize the most important information from the article"]
        },
        "order": 5
      },
      {
        "id": "practical_text",
        "type": "text",
        "data": {
          "heading": "Practical Information",
          "content": "Write 150-200 words. Include dates, prices, locations, contact information, booking links, or any other practical details travelers need to act on this information."
        },
        "order": 6
      },
      {
        "id": "tips_block",
        "type": "tips",
        "data": {
          "title": "Expert Tips & Advice",
          "tips": ["7 detailed, actionable tips specific to this topic - each should provide genuine value and insider knowledge"]
        },
        "order": 7
      },
      {
        "id": "faq_block",
        "type": "faq",
        "data": {
          "title": "Frequently Asked Questions",
          "faqs": [
            {"question": "Most common question about this topic?", "answer": "100-200 word detailed answer with practical information and examples"},
            {"question": "Second important question?", "answer": "100-200 word detailed answer"},
            {"question": "Third question travelers ask?", "answer": "100-200 word detailed answer"},
            {"question": "Fourth relevant question?", "answer": "100-200 word detailed answer"},
            {"question": "Fifth question?", "answer": "100-200 word detailed answer"},
            {"question": "Sixth question?", "answer": "100-200 word detailed answer"},
            {"question": "Seventh question?", "answer": "100-200 word detailed answer"},
            {"question": "Eighth question?", "answer": "100-200 word detailed answer"}
          ]
        },
        "order": 8
      },
      {
        "id": "cta_block",
        "type": "cta",
        "data": {
          "heading": "Ready to [Action Related to Article]?",
          "text": "Compelling call to action that relates to the article content",
          "buttonText": "Action Button Text",
          "buttonLink": "#"
        },
        "order": 9
      }
    ],
    "seoSchema": {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Article Headline",
      "description": "150-200 word comprehensive description for schema",
      "image": {
        "@type": "ImageObject",
        "url": "",
        "caption": "Image caption"
      },
      "author": {
        "@type": "Organization",
        "name": "Dubai Travel",
        "url": "https://dubaitravel.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Dubai Travel",
        "logo": {
          "@type": "ImageObject",
          "url": "https://dubaitravel.com/logo.png"
        }
      },
      "datePublished": "2025-01-01",
      "dateModified": "2025-01-01",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://dubaitravel.com/articles/slug"
      },
      "keywords": ["keyword1", "keyword2", "keyword3"]
    },
    "images": [
      {"filename": "article-slug-hero.jpg", "alt": "Main image showing [specific scene]", "caption": "Caption for hero image"},
      {"filename": "article-slug-detail-1.jpg", "alt": "Detail showing [specific element]", "caption": "Caption explaining the detail"},
      {"filename": "article-slug-detail-2.jpg", "alt": "Another view of [specific element]", "caption": "Additional context caption"},
      {"filename": "article-slug-practical.jpg", "alt": "Practical information visual", "caption": "Helpful visual for planning"}
    ]
  },
  "article": {
    "category": "attractions|hotels|dining|transport|events|tips|news|shopping|districts|experiences",
    "urgencyLevel": "evergreen|seasonal|time-sensitive|breaking",
    "targetAudience": ["First-time Visitors", "Repeat Travelers", "Families", "Couples", "Solo Travelers", "Budget Travelers", "Luxury Travelers", "Business Travelers"],
    "personality": "Professional Guide|Excited Traveler|Balanced Critic|Local Insider|Practical Planner",
    "tone": "informative|enthusiastic|balanced|insider|practical",
    "structure": "News+Guide|Structured List|Comparative|Story+Info|Problem-Solution|News Update",
    "quickFacts": [
      "Key fact 1 - single line of important information",
      "Key fact 2",
      "Key fact 3",
      "Key fact 4",
      "Key fact 5"
    ],
    "proTips": [
      "Detailed actionable tip 1 with specific advice",
      "Detailed actionable tip 2",
      "Detailed actionable tip 3",
      "Detailed actionable tip 4",
      "Detailed actionable tip 5",
      "Detailed actionable tip 6",
      "Detailed actionable tip 7"
    ],
    "warnings": [
      "Important warning or caveat 1",
      "Important warning or caveat 2 if applicable"
    ],
    "faq": [
      {"question": "Common question 1?", "answer": "100-200 word detailed answer with practical information"},
      {"question": "Common question 2?", "answer": "100-200 word detailed answer"},
      {"question": "Common question 3?", "answer": "100-200 word detailed answer"},
      {"question": "Common question 4?", "answer": "100-200 word detailed answer"},
      {"question": "Common question 5?", "answer": "100-200 word detailed answer"},
      {"question": "Common question 6?", "answer": "100-200 word detailed answer"},
      {"question": "Common question 7?", "answer": "100-200 word detailed answer"},
      {"question": "Common question 8?", "answer": "100-200 word detailed answer"}
    ],
    "relatedTopics": ["Related topic 1", "Related topic 2", "Related topic 3", "Related topic 4"]
  }
}

IMPORTANT GUIDELINES:
1. Generate unique random IDs for each block (e.g., "abc123", "xyz789")
2. Total content should be 1200-2000 words across all text blocks
3. FAQ answers must each be 100-200 words - comprehensive and helpful
4. Include 7 specific, actionable tips
5. All information must be accurate for Dubai
6. Use natural keyword placement - don't stuff keywords
7. Match personality and structure to the topic
8. Write engaging content that helps travelers plan their visit`;

const DINING_SYSTEM_PROMPT = `You are a Dubai culinary content expert creating comprehensive, SEO-optimized restaurant pages for Dubai Travel website.

CONTENT REQUIREMENTS:
- Total word count: 1200-2000 words across all text blocks
- Every piece of content must be accurate, engaging, and valuable for diners
- Include natural keyword placement throughout the content
- Write in an appetizing, inviting tone that captures the dining experience

Your output must be a valid JSON object matching this exact structure:

OUTPUT STRUCTURE:
{
  "content": {
    "title": "Restaurant Name Dubai | [Cuisine Type] Restaurant Guide 2025",
    "slug": "restaurant-name-dubai",
    "metaTitle": "Restaurant Name Dubai - Menu, Reservations & Reviews 2025",
    "metaDescription": "150-160 char description with restaurant name, cuisine type, signature dishes, and reservation call to action",
    "primaryKeyword": "restaurant name dubai",
    "secondaryKeywords": ["restaurant name menu", "dubai restaurants", "best [cuisine] dubai", "fine dining dubai"],
    "lsiKeywords": ["dining", "cuisine", "menu", "reservations", "chef", "ambiance", "food"],
    "heroImageAlt": "Interior view of [Restaurant Name] Dubai showcasing [specific ambiance element]",
    "heroImageCaption": "Experience the distinctive atmosphere of [Restaurant Name]",
    "blocks": [
      {
        "id": "hero_block",
        "type": "hero",
        "data": {
          "title": "[Restaurant Name]",
          "subtitle": "One compelling sentence about the culinary experience",
          "overlayText": "Dubai's Premier [Cuisine Type] Destination"
        },
        "order": 0
      },
      {
        "id": "overview_text",
        "type": "text",
        "data": {
          "heading": "About [Restaurant Name]",
          "content": "Write 250-350 words. Start with 2-3 engaging sentences as the visible intro capturing the restaurant's essence. Then expand covering: what makes this restaurant unique in Dubai's competitive dining scene, the culinary philosophy and chef's background, signature flavors and cooking techniques, the complete dining experience from arrival to dessert, interior design and ambiance, views if applicable, who this restaurant is ideal for."
        },
        "order": 1
      },
      {
        "id": "highlights_block",
        "type": "highlights",
        "data": {
          "title": "Dining Highlights",
          "items": ["6 key restaurant highlights - be specific about signature dishes, unique experiences, and standout features"]
        },
        "order": 2
      },
      {
        "id": "menu_text",
        "type": "text",
        "data": {
          "heading": "The Menu Experience",
          "content": "Write 200-250 words covering: menu categories, signature dishes with descriptions, seasonal offerings, tasting menus, beverage program and wine pairings, dietary accommodations, chef's specialties."
        },
        "order": 3
      },
      {
        "id": "ambiance_text",
        "type": "text",
        "data": {
          "heading": "Atmosphere & Setting",
          "content": "Write 150-200 words about: interior design style, seating options (indoor, outdoor, private), views and location benefits, lighting and music, dress code, overall vibe and who it attracts."
        },
        "order": 4
      },
      {
        "id": "tips_block",
        "type": "tips",
        "data": {
          "title": "Dining Tips & Insider Advice",
          "tips": ["7 detailed practical tips for diners - each should be actionable and specific to this restaurant"]
        },
        "order": 5
      },
      {
        "id": "practical_text",
        "type": "text",
        "data": {
          "heading": "Practical Information",
          "content": "Write 100-150 words about: reservation policies, best times to visit, parking and access, dress code details, payment methods, special occasions."
        },
        "order": 6
      },
      {
        "id": "faq_block",
        "type": "faq",
        "data": {
          "title": "Frequently Asked Questions",
          "faqs": [
            {"question": "Do I need a reservation at [Restaurant Name]?", "answer": "100-200 word detailed answer about booking policies, walk-in availability, best booking times, group reservations."},
            {"question": "What is the dress code at [Restaurant Name]?", "answer": "100-200 word detailed answer about attire expectations, smart casual definition, what to avoid."},
            {"question": "What are the signature dishes at [Restaurant Name]?", "answer": "100-200 word detailed answer describing 3-4 must-try dishes with descriptions."},
            {"question": "Does [Restaurant Name] accommodate dietary restrictions?", "answer": "100-200 word detailed answer about vegetarian, vegan, gluten-free, halal options."},
            {"question": "What is the price range at [Restaurant Name]?", "answer": "100-200 word detailed answer about average spend, menu prices, value for money."},
            {"question": "Does [Restaurant Name] have a bar or lounge area?", "answer": "100-200 word detailed answer about bar options, cocktails, pre-dinner drinks."},
            {"question": "Is [Restaurant Name] suitable for special occasions?", "answer": "100-200 word detailed answer about celebrations, private dining, special arrangements."},
            {"question": "What is the best time to visit [Restaurant Name]?", "answer": "100-200 word detailed answer about peak times, sunset views, quiet periods."}
          ]
        },
        "order": 7
      },
      {
        "id": "cta_block",
        "type": "cta",
        "data": {
          "heading": "Ready to Experience [Restaurant Name]?",
          "text": "Reserve your table today and discover exceptional cuisine",
          "buttonText": "Make Reservation",
          "buttonLink": "#reserve"
        },
        "order": 8
      }
    ],
    "seoSchema": {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "name": "Restaurant Name",
      "description": "150-200 word description for SEO schema covering cuisine, atmosphere, and experience",
      "url": "https://dubaitravel.com/dining/restaurant-name-dubai",
      "image": {"@type": "ImageObject", "url": "", "caption": "Restaurant Name Dubai"},
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Full street address",
        "addressLocality": "Dubai",
        "addressRegion": "Dubai",
        "addressCountry": "AE"
      },
      "geo": {"@type": "GeoCoordinates", "latitude": "25.XXXX", "longitude": "55.XXXX"},
      "servesCuisine": "Cuisine Type",
      "priceRange": "AED XXX-XXX per person",
      "openingHours": ["Mo-Su 12:00-23:00"],
      "telephone": "+971-XX-XXX-XXXX",
      "acceptsReservations": true,
      "menu": "https://restaurantname.com/menu",
      "aggregateRating": {"@type": "AggregateRating", "ratingValue": "4.7", "reviewCount": "500"}
    },
    "images": [
      {"filename": "restaurant-name-interior.jpg", "alt": "Interior of [Restaurant Name] Dubai showing [design elements]", "caption": "The elegant dining space at [Restaurant Name]"},
      {"filename": "restaurant-name-signature-dish.jpg", "alt": "Signature [dish name] at [Restaurant Name]", "caption": "Our renowned [dish name]"},
      {"filename": "restaurant-name-chef.jpg", "alt": "Chef preparing cuisine at [Restaurant Name]", "caption": "Culinary artistry in action"},
      {"filename": "restaurant-name-ambiance.jpg", "alt": "[Specific view or feature] at [Restaurant Name]", "caption": "Exceptional ambiance and views"}
    ]
  },
  "dining": {
    "restaurantName": "Full Restaurant Name",
    "location": "Area/District, Dubai",
    "fullAddress": "Complete street address, Dubai, UAE",
    "cuisineType": "Primary Cuisine (e.g., French, Japanese, Contemporary Arabic)",
    "priceRange": "AED 250-500 per person",
    "openingHours": "Daily 12:00 PM - 11:00 PM",
    "dressCode": "Smart Casual",
    "reservationRequired": true,
    "targetAudience": ["Food Enthusiasts", "Couples", "Business Diners", "Special Occasions", "Tourists"],
    "primaryCta": "Reserve a Table",
    "quickInfoBar": [
      {"icon": "MapPin", "label": "Location", "value": "Downtown Dubai"},
      {"icon": "Utensils", "label": "Cuisine", "value": "French"},
      {"icon": "DollarSign", "label": "Price", "value": "AED 300-500"},
      {"icon": "Clock", "label": "Hours", "value": "12 PM - 11 PM"},
      {"icon": "Users", "label": "Dress", "value": "Smart Casual"},
      {"icon": "Phone", "label": "Reserve", "value": "Required"}
    ],
    "highlights": [
      {"image": "", "title": "Highlight 1", "description": "50-80 word description of this unique restaurant feature"},
      {"image": "", "title": "Highlight 2", "description": "50-80 word description"},
      {"image": "", "title": "Highlight 3", "description": "50-80 word description"},
      {"image": "", "title": "Highlight 4", "description": "50-80 word description"},
      {"image": "", "title": "Highlight 5", "description": "50-80 word description"},
      {"image": "", "title": "Highlight 6", "description": "50-80 word description"}
    ],
    "menuHighlights": [
      {"name": "Signature Dish 1", "description": "Description of the dish and what makes it special", "price": "AED 180"},
      {"name": "Signature Dish 2", "description": "Description of the dish", "price": "AED 220"},
      {"name": "Signature Dish 3", "description": "Description of the dish", "price": "AED 160"},
      {"name": "Signature Dish 4", "description": "Description of the dish", "price": "AED 280"}
    ],
    "essentialInfo": [
      {"icon": "MapPin", "label": "Address", "value": "Full address"},
      {"icon": "Clock", "label": "Hours", "value": "Daily 12 PM - 11 PM"},
      {"icon": "DollarSign", "label": "Average Spend", "value": "AED 350 per person"},
      {"icon": "Phone", "label": "Phone", "value": "+971-XX-XXX-XXXX"},
      {"icon": "Calendar", "label": "Reservations", "value": "Recommended"},
      {"icon": "Users", "label": "Dress Code", "value": "Smart Casual"},
      {"icon": "Wifi", "label": "WiFi", "value": "Complimentary"},
      {"icon": "Car", "label": "Parking", "value": "Valet available"}
    ],
    "ambiance": ["Elegant", "Romantic", "Great for Groups", "Scenic Views", "Live Music"],
    "diningTips": [
      "Book at least 3-4 days in advance for weekend dinners",
      "Request a window table for the best views - mention it when booking",
      "The chef's tasting menu offers the best value and variety",
      "Arrive 15 minutes early to enjoy a cocktail at the bar",
      "Ask the sommelier for wine pairing recommendations",
      "Try the signature dessert - it's worth saving room for",
      "Mention any dietary restrictions when making your reservation"
    ],
    "faq": [
      {"question": "Do I need a reservation?", "answer": "100-200 word detailed answer"},
      {"question": "What is the dress code?", "answer": "100-200 word detailed answer"},
      {"question": "What are the signature dishes?", "answer": "100-200 word detailed answer"},
      {"question": "Is the restaurant suitable for children?", "answer": "100-200 word detailed answer"},
      {"question": "Does the restaurant serve alcohol?", "answer": "100-200 word detailed answer"},
      {"question": "Is there outdoor seating?", "answer": "100-200 word detailed answer"}
    ],
    "nearbyAttractions": [
      {"name": "Dubai Fountain", "distance": "5 min walk", "type": "Attraction"},
      {"name": "Dubai Mall", "distance": "3 min walk", "type": "Shopping"},
      {"name": "Burj Khalifa", "distance": "5 min walk", "type": "Attraction"}
    ]
  }
}

Generate unique IDs for each block. Make content appetizing, accurate for Dubai restaurants, and SEO-optimized.`;

const DISTRICT_SYSTEM_PROMPT = `You are a Dubai travel content expert creating comprehensive, SEO-optimized neighborhood/district guide pages for Dubai Travel website.

CONTENT REQUIREMENTS:
- Total word count: 1200-2000 words across all text blocks
- Every piece of content must be accurate, engaging, and valuable for visitors
- Include natural keyword placement throughout the content
- Write in an explorative, informative tone that encourages discovery

Your output must be a valid JSON object matching this exact structure:

OUTPUT STRUCTURE:
{
  "content": {
    "title": "[District Name] Dubai | Complete Neighborhood Guide 2025",
    "slug": "district-name-dubai-guide",
    "metaTitle": "[District Name] Dubai - Things to Do, Eat & Explore 2025",
    "metaDescription": "150-160 char description with district name, key attractions, dining, and exploration call to action",
    "primaryKeyword": "[district name] dubai",
    "secondaryKeywords": ["[district] things to do", "explore [district] dubai", "[district] attractions", "[district] restaurants"],
    "lsiKeywords": ["neighborhood", "area", "district", "explore", "discover", "visit", "attractions"],
    "heroImageAlt": "Panoramic view of [District Name] Dubai showing [iconic landmarks or street scene]",
    "heroImageCaption": "Discover the vibrant character of [District Name]",
    "blocks": [
      {
        "id": "hero_block",
        "type": "hero",
        "data": {
          "title": "Explore [District Name]",
          "subtitle": "One compelling sentence about the neighborhood's character",
          "overlayText": "Dubai's [Characteristic] Neighborhood"
        },
        "order": 0
      },
      {
        "id": "overview_text",
        "type": "text",
        "data": {
          "heading": "About [District Name]",
          "content": "Write 250-350 words. Start with 2-3 engaging sentences capturing the district's essence. Then expand covering: what makes this area unique, its history and development, the atmosphere and vibe, who the area attracts, what it's known for, best times to visit, how it fits into Dubai's landscape."
        },
        "order": 1
      },
      {
        "id": "highlights_block",
        "type": "highlights",
        "data": {
          "title": "District Highlights",
          "items": ["6 key neighborhood highlights - be specific about unique features and experiences"]
        },
        "order": 2
      },
      {
        "id": "attractions_text",
        "type": "text",
        "data": {
          "heading": "Top Attractions & Things to Do",
          "content": "Write 200-250 words covering: major attractions in the area, cultural sites, entertainment venues, activities, parks and outdoor spaces, unique experiences only found here."
        },
        "order": 3
      },
      {
        "id": "dining_text",
        "type": "text",
        "data": {
          "heading": "Where to Eat & Drink",
          "content": "Write 150-200 words about: notable restaurants, cuisine variety, cafes, bars and nightlife, street food, food halls or markets, price ranges available."
        },
        "order": 4
      },
      {
        "id": "shopping_text",
        "type": "text",
        "data": {
          "heading": "Shopping & Markets",
          "content": "Write 150-200 words covering: malls and shopping centers, boutiques, souks and markets, what to buy, unique finds, price ranges."
        },
        "order": 5
      },
      {
        "id": "tips_block",
        "type": "tips",
        "data": {
          "title": "Insider Tips for Exploring [District Name]",
          "tips": ["7 detailed practical tips - each should be actionable and specific to this neighborhood"]
        },
        "order": 6
      },
      {
        "id": "getting_around_text",
        "type": "text",
        "data": {
          "heading": "Getting There & Around",
          "content": "Write 100-150 words about: metro stations, bus routes, taxi/rideshare, walking distances, parking, best ways to explore the area."
        },
        "order": 7
      },
      {
        "id": "faq_block",
        "type": "faq",
        "data": {
          "title": "Frequently Asked Questions",
          "faqs": [
            {"question": "What is [District Name] known for?", "answer": "100-200 word detailed answer about the area's character and main draws."},
            {"question": "How do I get to [District Name]?", "answer": "100-200 word detailed answer about transportation options."},
            {"question": "Is [District Name] safe for tourists?", "answer": "100-200 word detailed answer about safety and practical considerations."},
            {"question": "What are the best restaurants in [District Name]?", "answer": "100-200 word detailed answer recommending top dining spots."},
            {"question": "What is there to do in [District Name] at night?", "answer": "100-200 word detailed answer about nightlife and evening activities."},
            {"question": "How much time should I spend in [District Name]?", "answer": "100-200 word detailed answer with itinerary suggestions."},
            {"question": "Is [District Name] family-friendly?", "answer": "100-200 word detailed answer about family activities and considerations."},
            {"question": "What is the best time to visit [District Name]?", "answer": "100-200 word detailed answer about seasons, times of day, and events."}
          ]
        },
        "order": 8
      },
      {
        "id": "cta_block",
        "type": "cta",
        "data": {
          "heading": "Ready to Explore [District Name]?",
          "text": "Plan your visit and discover one of Dubai's most vibrant neighborhoods",
          "buttonText": "View [District] Attractions",
          "buttonLink": "#attractions"
        },
        "order": 9
      }
    ],
    "seoSchema": {
      "@context": "https://schema.org",
      "@type": "Place",
      "name": "[District Name], Dubai",
      "description": "150-200 word description for SEO schema",
      "url": "https://dubaitravel.com/districts/district-name-dubai",
      "image": {"@type": "ImageObject", "url": "", "caption": "[District Name] Dubai"},
      "address": {"@type": "PostalAddress", "addressLocality": "Dubai", "addressCountry": "AE"},
      "geo": {"@type": "GeoCoordinates", "latitude": "25.XXXX", "longitude": "55.XXXX"},
      "containsPlace": [
        {"@type": "TouristAttraction", "name": "Attraction 1"},
        {"@type": "Restaurant", "name": "Restaurant 1"}
      ]
    },
    "images": [
      {"filename": "district-name-aerial.jpg", "alt": "Aerial view of [District Name] Dubai", "caption": "The distinctive skyline of [District Name]"},
      {"filename": "district-name-street.jpg", "alt": "Street scene in [District Name]", "caption": "The vibrant streets of [District Name]"},
      {"filename": "district-name-landmark.jpg", "alt": "[Landmark name] in [District Name]", "caption": "The iconic [landmark] in [District Name]"},
      {"filename": "district-name-night.jpg", "alt": "[District Name] at night", "caption": "[District Name] comes alive after dark"}
    ]
  },
  "district": {
    "districtName": "Full District Name",
    "location": "General area in Dubai (e.g., Eastern Dubai, Beachfront)",
    "characteristics": ["Modern", "Traditional", "Luxury", "Cultural", "Entertainment Hub", "Waterfront"],
    "targetAudience": ["Tourists", "Families", "Couples", "Shoppers", "Foodies", "Culture Seekers"],
    "primaryCta": "Explore [District Name]",
    "quickInfoBar": [
      {"icon": "MapPin", "label": "Location", "value": "Central Dubai"},
      {"icon": "Clock", "label": "Best Time", "value": "Evening"},
      {"icon": "Train", "label": "Metro", "value": "Station Name"},
      {"icon": "DollarSign", "label": "Budget", "value": "All Budgets"},
      {"icon": "Users", "label": "Ideal For", "value": "Everyone"},
      {"icon": "Calendar", "label": "Duration", "value": "Half to Full Day"}
    ],
    "highlights": [
      {"image": "", "title": "Highlight 1", "description": "50-80 word description"},
      {"image": "", "title": "Highlight 2", "description": "50-80 word description"},
      {"image": "", "title": "Highlight 3", "description": "50-80 word description"},
      {"image": "", "title": "Highlight 4", "description": "50-80 word description"},
      {"image": "", "title": "Highlight 5", "description": "50-80 word description"},
      {"image": "", "title": "Highlight 6", "description": "50-80 word description"}
    ],
    "topAttractions": [
      {"name": "Attraction 1", "type": "Landmark", "description": "Brief description"},
      {"name": "Attraction 2", "type": "Museum", "description": "Brief description"},
      {"name": "Attraction 3", "type": "Park", "description": "Brief description"},
      {"name": "Attraction 4", "type": "Entertainment", "description": "Brief description"}
    ],
    "diningOptions": [
      {"name": "Restaurant 1", "cuisine": "Cuisine Type", "priceRange": "AED 150-300"},
      {"name": "Restaurant 2", "cuisine": "Cuisine Type", "priceRange": "AED 80-150"},
      {"name": "Restaurant 3", "cuisine": "Cuisine Type", "priceRange": "AED 200-400"}
    ],
    "shoppingSpots": [
      {"name": "Mall/Market 1", "type": "Shopping Mall", "description": "Brief description"},
      {"name": "Mall/Market 2", "type": "Boutique Area", "description": "Brief description"}
    ],
    "essentialInfo": [
      {"icon": "MapPin", "label": "Area", "value": "Location description"},
      {"icon": "Train", "label": "Nearest Metro", "value": "Station name(s)"},
      {"icon": "Clock", "label": "Best Time", "value": "Morning/Evening"},
      {"icon": "Sun", "label": "Season", "value": "Year-round, best Oct-Apr"},
      {"icon": "Car", "label": "Parking", "value": "Available/Limited"},
      {"icon": "Wallet", "label": "Budget", "value": "All ranges"},
      {"icon": "Accessibility", "label": "Accessibility", "value": "Wheelchair friendly"},
      {"icon": "Info", "label": "Language", "value": "English widely spoken"}
    ],
    "explorationTips": [
      "Start your exploration at [specific starting point] for the best experience",
      "Visit in the evening for cooler temperatures and better atmosphere",
      "Download the RTA app for easy metro navigation",
      "Wear comfortable walking shoes as the area is best explored on foot",
      "Book restaurant reservations in advance, especially for popular spots",
      "Visit on weekdays to avoid weekend crowds",
      "Keep your camera ready - photo opportunities are everywhere"
    ],
    "faq": [
      {"question": "What is the area known for?", "answer": "100-200 word answer"},
      {"question": "How do I get there?", "answer": "100-200 word answer"},
      {"question": "What should I do there?", "answer": "100-200 word answer"},
      {"question": "Is it suitable for families?", "answer": "100-200 word answer"},
      {"question": "What is the nightlife like?", "answer": "100-200 word answer"},
      {"question": "How long should I spend there?", "answer": "100-200 word answer"}
    ],
    "gettingAround": ["Metro", "Walking", "Taxi", "Tram", "Water Taxi"]
  }
}

Generate unique IDs for each block. Make content explorative, accurate for Dubai neighborhoods, and SEO-optimized.`;

const TRANSPORT_SYSTEM_PROMPT = `You are a Dubai travel content expert creating comprehensive, SEO-optimized transportation guide pages for Dubai Travel website.

CONTENT REQUIREMENTS:
- Total word count: 1200-2000 words across all text blocks
- Every piece of content must be accurate, practical, and valuable for travelers
- Include natural keyword placement throughout the content
- Write in a helpful, practical tone that makes navigation easy

Your output must be a valid JSON object matching this exact structure:

OUTPUT STRUCTURE:
{
  "content": {
    "title": "[Transport Type] Dubai | Complete Guide & Tips 2025",
    "slug": "transport-type-dubai-guide",
    "metaTitle": "[Transport Type] Dubai - Fares, Routes & How to Use 2025",
    "metaDescription": "150-160 char description with transport type, key routes, fare info, and practical use call to action",
    "primaryKeyword": "[transport type] dubai",
    "secondaryKeywords": ["dubai [transport] guide", "how to use [transport] dubai", "[transport] routes dubai", "[transport] fare dubai"],
    "lsiKeywords": ["transportation", "getting around", "public transport", "routes", "fares", "tickets"],
    "heroImageAlt": "[Transport type] in Dubai showing [specific scene or station]",
    "heroImageCaption": "Navigate Dubai easily with [transport type]",
    "blocks": [
      {
        "id": "hero_block",
        "type": "hero",
        "data": {
          "title": "Dubai [Transport Type] Guide",
          "subtitle": "One compelling sentence about the transport option",
          "overlayText": "Your Complete Guide to Getting Around Dubai"
        },
        "order": 0
      },
      {
        "id": "overview_text",
        "type": "text",
        "data": {
          "heading": "About Dubai [Transport Type]",
          "content": "Write 250-350 words. Start with 2-3 engaging sentences introducing this transport option. Then expand covering: what this transport is and how it works, the network coverage and key routes, why it's useful for tourists, comparison to other transport options, history and modern features, accessibility information."
        },
        "order": 1
      },
      {
        "id": "highlights_block",
        "type": "highlights",
        "data": {
          "title": "Key Features",
          "items": ["6 key features and benefits of this transport option"]
        },
        "order": 2
      },
      {
        "id": "howto_text",
        "type": "text",
        "data": {
          "heading": "How to Use [Transport Type]",
          "content": "Write 200-250 words. Step-by-step guide: how to buy tickets/cards, how to board, payment methods, apps to use, etiquette and rules, accessibility features."
        },
        "order": 3
      },
      {
        "id": "fares_text",
        "type": "text",
        "data": {
          "heading": "Fares & Tickets",
          "content": "Write 150-200 words covering: fare structure, ticket types, Nol card information, day passes, tourist cards, children's fares, payment methods."
        },
        "order": 4
      },
      {
        "id": "routes_text",
        "type": "text",
        "data": {
          "heading": "Key Routes & Destinations",
          "content": "Write 150-200 words about: main routes, key stops for tourists, connections to major attractions, airport connections, interchange stations."
        },
        "order": 5
      },
      {
        "id": "tips_block",
        "type": "tips",
        "data": {
          "title": "Insider Tips for Using [Transport Type]",
          "tips": ["7 detailed practical tips - each should be actionable and specific"]
        },
        "order": 6
      },
      {
        "id": "faq_block",
        "type": "faq",
        "data": {
          "title": "Frequently Asked Questions",
          "faqs": [
            {"question": "How much does [transport type] cost in Dubai?", "answer": "100-200 word detailed answer about fares and payment options."},
            {"question": "What are the operating hours of [transport type]?", "answer": "100-200 word detailed answer about timings and frequency."},
            {"question": "Do I need a Nol card to use [transport type]?", "answer": "100-200 word detailed answer about card types and alternatives."},
            {"question": "Is [transport type] accessible for wheelchairs?", "answer": "100-200 word detailed answer about accessibility features."},
            {"question": "Can I use [transport type] to get to the airport?", "answer": "100-200 word detailed answer about airport connections."},
            {"question": "What tourist attractions can I reach by [transport type]?", "answer": "100-200 word detailed answer listing key destinations."},
            {"question": "Is there WiFi on [transport type]?", "answer": "100-200 word detailed answer about onboard amenities."},
            {"question": "What is the best app for [transport type] navigation?", "answer": "100-200 word detailed answer about useful apps."}
          ]
        },
        "order": 7
      },
      {
        "id": "cta_block",
        "type": "cta",
        "data": {
          "heading": "Ready to Navigate Dubai?",
          "text": "Get your Nol card and start exploring Dubai's efficient transport network",
          "buttonText": "Plan Your Route",
          "buttonLink": "#routes"
        },
        "order": 8
      }
    ],
    "seoSchema": {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "[Transport Type] Dubai Guide",
      "description": "150-200 word description for SEO schema",
      "author": {"@type": "Organization", "name": "Dubai Travel"},
      "publisher": {"@type": "Organization", "name": "Dubai Travel", "logo": {"@type": "ImageObject", "url": "https://dubaitravel.com/logo.png"}},
      "datePublished": "2025-01-01",
      "dateModified": "2025-01-01"
    },
    "images": [
      {"filename": "transport-type-exterior.jpg", "alt": "Dubai [transport type] exterior view", "caption": "Modern [transport] in Dubai"},
      {"filename": "transport-type-interior.jpg", "alt": "Inside Dubai [transport type]", "caption": "Comfortable interiors"},
      {"filename": "transport-type-station.jpg", "alt": "[Transport] station in Dubai", "caption": "Clean, modern stations"},
      {"filename": "transport-type-nol.jpg", "alt": "Nol card for Dubai transport", "caption": "Pay easily with Nol card"}
    ]
  },
  "transport": {
    "transportType": "Metro/Tram/Bus/Water Taxi/Taxi",
    "operatingHours": "5:00 AM - 12:00 AM (varies by day)",
    "coverage": ["Downtown", "Marina", "Airport", "Tourist Areas"],
    "targetAudience": ["Tourists", "Budget Travelers", "All Visitors"],
    "primaryCta": "Download RTA App",
    "quickInfoBar": [
      {"icon": "Clock", "label": "Hours", "value": "5 AM - 12 AM"},
      {"icon": "DollarSign", "label": "Fare", "value": "From AED 4"},
      {"icon": "CreditCard", "label": "Payment", "value": "Nol Card"},
      {"icon": "Wifi", "label": "WiFi", "value": "Free"},
      {"icon": "Accessibility", "label": "Access", "value": "Wheelchair OK"},
      {"icon": "Thermometer", "label": "AC", "value": "Yes"}
    ],
    "highlights": [
      {"image": "", "title": "Feature 1", "description": "50-80 word description"},
      {"image": "", "title": "Feature 2", "description": "50-80 word description"},
      {"image": "", "title": "Feature 3", "description": "50-80 word description"},
      {"image": "", "title": "Feature 4", "description": "50-80 word description"},
      {"image": "", "title": "Feature 5", "description": "50-80 word description"},
      {"image": "", "title": "Feature 6", "description": "50-80 word description"}
    ],
    "fareStructure": [
      {"type": "Single Trip", "price": "AED 4-8.50", "description": "One-way journey"},
      {"type": "Daily Pass", "price": "AED 22", "description": "Unlimited travel for 24 hours"},
      {"type": "Nol Silver Card", "price": "AED 25", "description": "Reloadable card with AED 19 credit"},
      {"type": "Tourist Day Pass", "price": "AED 20", "description": "Convenient option for visitors"}
    ],
    "routes": [
      {"name": "Red Line", "from": "Rashidiya", "to": "UAE Exchange", "duration": "52 min"},
      {"name": "Green Line", "from": "Etisalat", "to": "Creek", "duration": "28 min"}
    ],
    "essentialInfo": [
      {"icon": "Clock", "label": "Operating Hours", "value": "5 AM - 12 AM"},
      {"icon": "DollarSign", "label": "Minimum Fare", "value": "AED 4"},
      {"icon": "CreditCard", "label": "Payment", "value": "Nol Card required"},
      {"icon": "Phone", "label": "RTA Helpline", "value": "800 9090"},
      {"icon": "Wifi", "label": "Free WiFi", "value": "Available"},
      {"icon": "Accessibility", "label": "Accessibility", "value": "Full wheelchair access"},
      {"icon": "Baby", "label": "Children", "value": "Under 5 free"},
      {"icon": "Luggage", "label": "Luggage", "value": "Allowed"}
    ],
    "usageTips": [
      "Buy a Nol card at any metro station - it works on all public transport",
      "Avoid rush hour (7-9 AM and 5-7 PM) for a more comfortable journey",
      "Use the RTA Dubai app for real-time arrivals and route planning",
      "The Gold Class carriages are worth the extra cost for longer journeys",
      "Keep your Nol card topped up - minimum balance of AED 7.50 required",
      "Women and children have dedicated carriages - clearly marked",
      "No eating or drinking is allowed - fines are strictly enforced"
    ],
    "faq": [
      {"question": "How do I get a Nol card?", "answer": "100-200 word answer"},
      {"question": "What are the fares?", "answer": "100-200 word answer"},
      {"question": "What are the operating hours?", "answer": "100-200 word answer"},
      {"question": "Can I take luggage?", "answer": "100-200 word answer"},
      {"question": "Is it tourist-friendly?", "answer": "100-200 word answer"},
      {"question": "How do I plan my route?", "answer": "100-200 word answer"}
    ],
    "connections": ["Metro", "Bus", "Tram", "Water Bus", "Taxi"]
  }
}

Generate unique IDs for each block. Make content practical, accurate for Dubai transport, and SEO-optimized.`;

const EVENT_SYSTEM_PROMPT = `You are a Dubai travel content expert creating comprehensive, SEO-optimized event pages for Dubai Travel website.

CONTENT REQUIREMENTS:
- Total word count: 1200-2000 words across all text blocks
- Every piece of content must be accurate, engaging, and valuable for attendees
- Include natural keyword placement throughout the content
- Write in an exciting, informative tone that builds anticipation

Your output must be a valid JSON object matching this exact structure:

OUTPUT STRUCTURE:
{
  "content": {
    "title": "[Event Name] Dubai 2025 | Complete Guide & Tickets",
    "slug": "event-name-dubai-2025",
    "metaTitle": "[Event Name] Dubai 2025 - Dates, Tickets & What to Expect",
    "metaDescription": "150-160 char description with event name, dates, venue, and ticket call to action",
    "primaryKeyword": "[event name] dubai 2025",
    "secondaryKeywords": ["[event] tickets", "[event] dubai dates", "[event] schedule", "attend [event] dubai"],
    "lsiKeywords": ["event", "festival", "show", "tickets", "venue", "performance", "entertainment"],
    "heroImageAlt": "[Event Name] Dubai showing [specific scene or moment]",
    "heroImageCaption": "Experience the excitement of [Event Name] in Dubai",
    "blocks": [
      {
        "id": "hero_block",
        "type": "hero",
        "data": {
          "title": "[Event Name] Dubai 2025",
          "subtitle": "One compelling sentence about the event experience",
          "overlayText": "Dubai's Premier [Event Type] Experience"
        },
        "order": 0
      },
      {
        "id": "overview_text",
        "type": "text",
        "data": {
          "heading": "About [Event Name]",
          "content": "Write 250-350 words. Start with 2-3 engaging sentences capturing the event's excitement. Then expand covering: what the event is and its significance, history and past highlights, what attendees can expect, lineup or program highlights, why Dubai is the perfect venue, who should attend."
        },
        "order": 1
      },
      {
        "id": "highlights_block",
        "type": "highlights",
        "data": {
          "title": "Event Highlights",
          "items": ["6 key event highlights and experiences to look forward to"]
        },
        "order": 2
      },
      {
        "id": "schedule_text",
        "type": "text",
        "data": {
          "heading": "Event Schedule & Program",
          "content": "Write 200-250 words covering: event dates and times, daily schedule breakdown, key performances or activities, special sessions, opening and closing ceremonies."
        },
        "order": 3
      },
      {
        "id": "venue_text",
        "type": "text",
        "data": {
          "heading": "Venue & Location",
          "content": "Write 150-200 words about: venue details, facilities, how to get there, parking, nearby accommodation, what the venue offers."
        },
        "order": 4
      },
      {
        "id": "tickets_text",
        "type": "text",
        "data": {
          "heading": "Tickets & Pricing",
          "content": "Write 150-200 words covering: ticket categories, pricing tiers, early bird offers, VIP packages, where to buy, refund policies."
        },
        "order": 5
      },
      {
        "id": "tips_block",
        "type": "tips",
        "data": {
          "title": "Tips for Attendees",
          "tips": ["7 detailed practical tips for getting the most out of the event"]
        },
        "order": 6
      },
      {
        "id": "faq_block",
        "type": "faq",
        "data": {
          "title": "Frequently Asked Questions",
          "faqs": [
            {"question": "When is [Event Name] Dubai 2025?", "answer": "100-200 word detailed answer about dates, times, and schedule."},
            {"question": "Where is [Event Name] held?", "answer": "100-200 word detailed answer about venue, location, and access."},
            {"question": "How much are tickets for [Event Name]?", "answer": "100-200 word detailed answer about pricing tiers and packages."},
            {"question": "What is included with VIP tickets?", "answer": "100-200 word detailed answer about VIP benefits and experiences."},
            {"question": "Can I bring children to [Event Name]?", "answer": "100-200 word detailed answer about age restrictions and family policies."},
            {"question": "What should I wear to [Event Name]?", "answer": "100-200 word detailed answer about dress code and comfort tips."},
            {"question": "Is there food and drink at [Event Name]?", "answer": "100-200 word detailed answer about F&B options and policies."},
            {"question": "How do I get to [Event Name] venue?", "answer": "100-200 word detailed answer about transportation options."}
          ]
        },
        "order": 7
      },
      {
        "id": "cta_block",
        "type": "cta",
        "data": {
          "heading": "Don't Miss [Event Name] Dubai 2025!",
          "text": "Secure your tickets now and be part of this incredible experience",
          "buttonText": "Get Tickets",
          "buttonLink": "#tickets"
        },
        "order": 8
      }
    ],
    "seoSchema": {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": "[Event Name] Dubai 2025",
      "description": "150-200 word description for SEO schema",
      "url": "https://dubaitravel.com/events/event-name-dubai-2025",
      "image": {"@type": "ImageObject", "url": "", "caption": "[Event Name] Dubai"},
      "startDate": "2025-XX-XX",
      "endDate": "2025-XX-XX",
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "location": {
        "@type": "Place",
        "name": "Venue Name",
        "address": {"@type": "PostalAddress", "addressLocality": "Dubai", "addressCountry": "AE"}
      },
      "offers": {
        "@type": "Offer",
        "url": "https://tickets.example.com",
        "price": "200",
        "priceCurrency": "AED",
        "availability": "https://schema.org/InStock",
        "validFrom": "2025-01-01"
      },
      "performer": {"@type": "Organization", "name": "Performer/Organizer Name"},
      "organizer": {"@type": "Organization", "name": "Organizer Name"}
    },
    "images": [
      {"filename": "event-name-main.jpg", "alt": "Main stage at [Event Name] Dubai", "caption": "The spectacular main stage"},
      {"filename": "event-name-crowd.jpg", "alt": "Crowd at [Event Name] Dubai", "caption": "Join thousands of attendees"},
      {"filename": "event-name-performance.jpg", "alt": "Performance at [Event Name]", "caption": "World-class entertainment"},
      {"filename": "event-name-venue.jpg", "alt": "[Venue Name] hosting [Event Name]", "caption": "The iconic venue"}
    ]
  },
  "event": {
    "eventName": "Full Event Name",
    "eventType": "Music Festival/Sports Event/Exhibition/Cultural Festival/Conference",
    "dates": "March 15-17, 2025",
    "venue": "Venue Name",
    "location": "Area, Dubai",
    "targetAudience": ["Music Lovers", "Families", "Sports Fans", "Art Enthusiasts"],
    "primaryCta": "Buy Tickets",
    "quickInfoBar": [
      {"icon": "Calendar", "label": "Dates", "value": "Mar 15-17, 2025"},
      {"icon": "MapPin", "label": "Venue", "value": "Venue Name"},
      {"icon": "Clock", "label": "Time", "value": "4 PM - 12 AM"},
      {"icon": "Ticket", "label": "Tickets", "value": "From AED 200"},
      {"icon": "Users", "label": "Capacity", "value": "50,000+"},
      {"icon": "Star", "label": "Type", "value": "Music Festival"}
    ],
    "highlights": [
      {"image": "", "title": "Highlight 1", "description": "50-80 word description"},
      {"image": "", "title": "Highlight 2", "description": "50-80 word description"},
      {"image": "", "title": "Highlight 3", "description": "50-80 word description"},
      {"image": "", "title": "Highlight 4", "description": "50-80 word description"},
      {"image": "", "title": "Highlight 5", "description": "50-80 word description"},
      {"image": "", "title": "Highlight 6", "description": "50-80 word description"}
    ],
    "ticketInfo": [
      {"image": "", "title": "General Admission", "features": ["Access to main area", "Standing room", "Food stalls access"], "price": "AED 200"},
      {"image": "", "title": "Premium", "features": ["Prime viewing area", "Dedicated bars", "Fast entry"], "price": "AED 450"},
      {"image": "", "title": "VIP", "features": ["VIP lounge access", "Premium viewing", "Complimentary drinks", "Meet & greet"], "price": "AED 1,200"},
      {"image": "", "title": "3-Day Pass", "features": ["All days access", "Priority entry", "Merchandise discount"], "price": "AED 500"}
    ],
    "schedule": [
      {"time": "4:00 PM", "activity": "Gates Open", "description": "Arrive early for the best spots"},
      {"time": "5:00 PM", "activity": "Opening Act", "description": "Local artists kick off the event"},
      {"time": "7:00 PM", "activity": "Main Performance", "description": "Headline act takes the stage"},
      {"time": "11:00 PM", "activity": "Closing", "description": "Grand finale and fireworks"}
    ],
    "essentialInfo": [
      {"icon": "Calendar", "label": "Dates", "value": "March 15-17, 2025"},
      {"icon": "Clock", "label": "Time", "value": "4 PM - 12 AM daily"},
      {"icon": "MapPin", "label": "Venue", "value": "Full venue address"},
      {"icon": "Ticket", "label": "Tickets", "value": "From AED 200"},
      {"icon": "DollarSign", "label": "Age", "value": "All ages welcome"},
      {"icon": "Car", "label": "Parking", "value": "Available, AED 50"},
      {"icon": "Utensils", "label": "Food", "value": "Multiple vendors on-site"},
      {"icon": "Info", "label": "Policy", "value": "No outside food/drink"}
    ],
    "attendeeTips": [
      "Buy tickets early - popular categories sell out fast",
      "Arrive at least 2 hours before your desired act for good positioning",
      "Wear comfortable shoes - you'll be standing for hours",
      "Stay hydrated - water stations are available throughout",
      "Check the event app for real-time schedule updates",
      "Arrange transportation in advance - surge pricing applies after events",
      "Bring a portable phone charger - you'll want battery for photos"
    ],
    "faq": [
      {"question": "What are the dates?", "answer": "100-200 word answer"},
      {"question": "How do I get tickets?", "answer": "100-200 word answer"},
      {"question": "What can I bring?", "answer": "100-200 word answer"},
      {"question": "Is it family-friendly?", "answer": "100-200 word answer"},
      {"question": "What about food and drinks?", "answer": "100-200 word answer"},
      {"question": "How do I get there?", "answer": "100-200 word answer"}
    ],
    "relatedEvents": ["Similar Event 1", "Similar Event 2", "Similar Event 3"]
  }
}

Generate unique IDs for each block. Make content exciting, accurate for Dubai events, and SEO-optimized.`;

const ITINERARY_SYSTEM_PROMPT = `You are a Dubai travel content expert creating comprehensive, SEO-optimized itinerary pages for Dubai Travel website.

CONTENT REQUIREMENTS:
- Total word count: 1200-2000 words across all text blocks
- Every piece of content must be accurate, practical, and valuable for trip planning
- Include natural keyword placement throughout the content
- Write in an inspiring, helpful tone that makes planning easy

Your output must be a valid JSON object matching this exact structure:

OUTPUT STRUCTURE:
{
  "content": {
    "title": "[Duration] Dubai Itinerary | [Theme] Trip Guide 2025",
    "slug": "duration-days-dubai-itinerary-theme",
    "metaTitle": "[Duration] Dubai Itinerary - [Theme] Trip Planner 2025",
    "metaDescription": "150-160 char description with duration, key experiences, and planning call to action",
    "primaryKeyword": "[duration] dubai itinerary",
    "secondaryKeywords": ["dubai [duration] trip", "[theme] dubai itinerary", "dubai travel plan", "what to do in dubai [duration]"],
    "lsiKeywords": ["itinerary", "travel plan", "trip", "schedule", "activities", "attractions", "experiences"],
    "heroImageAlt": "Dubai skyline representing a [duration] [theme] trip itinerary",
    "heroImageCaption": "Your perfect [duration] Dubai adventure awaits",
    "blocks": [
      {
        "id": "hero_block",
        "type": "hero",
        "data": {
          "title": "[Duration] Dubai Itinerary",
          "subtitle": "One compelling sentence about this trip experience",
          "overlayText": "Your Perfect [Theme] Dubai Adventure"
        },
        "order": 0
      },
      {
        "id": "overview_text",
        "type": "text",
        "data": {
          "heading": "Your [Duration] Dubai Trip Overview",
          "content": "Write 250-350 words. Start with 2-3 engaging sentences setting up the trip. Then expand covering: what this itinerary covers, who it's perfect for, the overall experience, highlights you'll encounter, practical considerations, why this duration works."
        },
        "order": 1
      },
      {
        "id": "highlights_block",
        "type": "highlights",
        "data": {
          "title": "Trip Highlights",
          "items": ["6 key experiences included in this itinerary"]
        },
        "order": 2
      },
      {
        "id": "day1_text",
        "type": "text",
        "data": {
          "heading": "Day 1: [Theme]",
          "content": "Write 200-250 words. Hour-by-hour breakdown: morning activities, lunch recommendations, afternoon experiences, evening plans. Include specific times, locations, and practical tips."
        },
        "order": 3
      },
      {
        "id": "day2_text",
        "type": "text",
        "data": {
          "heading": "Day 2: [Theme]",
          "content": "Write 200-250 words. Similar hour-by-hour breakdown for day 2."
        },
        "order": 4
      },
      {
        "id": "day3_text",
        "type": "text",
        "data": {
          "heading": "Day 3: [Theme]",
          "content": "Write 200-250 words. Similar breakdown for day 3 (if applicable, otherwise combine with practical info)."
        },
        "order": 5
      },
      {
        "id": "budget_text",
        "type": "text",
        "data": {
          "heading": "Budget Breakdown",
          "content": "Write 150-200 words covering: estimated total cost, accommodation range, activity costs, food budget, transport costs, money-saving tips."
        },
        "order": 6
      },
      {
        "id": "tips_block",
        "type": "tips",
        "data": {
          "title": "Essential Trip Tips",
          "tips": ["7 detailed practical tips for making the most of this itinerary"]
        },
        "order": 7
      },
      {
        "id": "faq_block",
        "type": "faq",
        "data": {
          "title": "Frequently Asked Questions",
          "faqs": [
            {"question": "Is [duration] enough time in Dubai?", "answer": "100-200 word detailed answer about what you can see and do."},
            {"question": "What is the best time of year for this trip?", "answer": "100-200 word detailed answer about seasons and weather."},
            {"question": "How much should I budget for [duration] in Dubai?", "answer": "100-200 word detailed answer with cost breakdown."},
            {"question": "Do I need to book attractions in advance?", "answer": "100-200 word detailed answer about reservations and planning."},
            {"question": "What should I pack for this trip?", "answer": "100-200 word detailed answer about clothing and essentials."},
            {"question": "Can I do this itinerary with children?", "answer": "100-200 word detailed answer about family considerations."},
            {"question": "What's the best way to get around?", "answer": "100-200 word detailed answer about transportation options."},
            {"question": "Can this itinerary be customized?", "answer": "100-200 word detailed answer about flexibility and alternatives."}
          ]
        },
        "order": 8
      },
      {
        "id": "cta_block",
        "type": "cta",
        "data": {
          "heading": "Ready for Your Dubai Adventure?",
          "text": "Start planning your perfect [duration] trip today",
          "buttonText": "Book Experiences",
          "buttonLink": "#book"
        },
        "order": 9
      }
    ],
    "seoSchema": {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      "name": "[Duration] Dubai Itinerary",
      "description": "150-200 word description for SEO schema",
      "url": "https://dubaitravel.com/itineraries/slug",
      "image": {"@type": "ImageObject", "url": "", "caption": "Dubai Itinerary"},
      "touristType": ["Family Travelers", "Couples", "Adventure Seekers"],
      "itinerary": {
        "@type": "ItemList",
        "itemListElement": [
          {"@type": "TouristAttraction", "name": "Day 1 Attraction"},
          {"@type": "TouristAttraction", "name": "Day 2 Attraction"}
        ]
      }
    },
    "images": [
      {"filename": "itinerary-hero.jpg", "alt": "Dubai skyline for [duration] itinerary", "caption": "Your [duration] Dubai adventure"},
      {"filename": "itinerary-day1.jpg", "alt": "Day 1 highlight - [attraction]", "caption": "Start your trip with [experience]"},
      {"filename": "itinerary-day2.jpg", "alt": "Day 2 highlight - [attraction]", "caption": "Continue exploring [area]"},
      {"filename": "itinerary-dining.jpg", "alt": "Dining in Dubai", "caption": "Savor Dubai's culinary scene"}
    ]
  },
  "itinerary": {
    "duration": "3 Days",
    "tripType": "First-Time Visitor/Family/Couples/Luxury/Budget/Adventure",
    "budget": "Moderate (AED 3,000-5,000 per person)",
    "targetAudience": ["First-Time Visitors", "Families", "Couples"],
    "primaryCta": "Start Planning",
    "quickInfoBar": [
      {"icon": "Calendar", "label": "Duration", "value": "3 Days"},
      {"icon": "DollarSign", "label": "Budget", "value": "AED 4,000"},
      {"icon": "Users", "label": "Ideal For", "value": "Families"},
      {"icon": "Sun", "label": "Best Time", "value": "Oct-Apr"},
      {"icon": "Walking", "label": "Pace", "value": "Moderate"},
      {"icon": "Star", "label": "Highlights", "value": "12+"}
    ],
    "highlights": [
      {"image": "", "title": "Highlight 1", "description": "50-80 word description"},
      {"image": "", "title": "Highlight 2", "description": "50-80 word description"},
      {"image": "", "title": "Highlight 3", "description": "50-80 word description"},
      {"image": "", "title": "Highlight 4", "description": "50-80 word description"},
      {"image": "", "title": "Highlight 5", "description": "50-80 word description"},
      {"image": "", "title": "Highlight 6", "description": "50-80 word description"}
    ],
    "dayByDay": [
      {
        "day": 1,
        "title": "Iconic Dubai",
        "activities": [
          {"time": "9:00 AM", "activity": "Dubai Mall & Burj Khalifa", "location": "Downtown Dubai", "duration": "4 hours", "tips": "Book At the Top tickets in advance"},
          {"time": "1:00 PM", "activity": "Lunch at Dubai Mall", "location": "Downtown Dubai", "duration": "1 hour", "tips": "Try the Cheesecake Factory or local options"},
          {"time": "3:00 PM", "activity": "Dubai Fountain Show", "location": "Dubai Mall", "duration": "30 min", "tips": "Shows run every 30 minutes from 6 PM"},
          {"time": "6:00 PM", "activity": "Souk Al Bahar", "location": "Downtown Dubai", "duration": "2 hours", "tips": "Great dinner spots with fountain views"}
        ]
      },
      {
        "day": 2,
        "title": "Beach & Marina",
        "activities": [
          {"time": "10:00 AM", "activity": "JBR Beach", "location": "Jumeirah Beach Residence", "duration": "3 hours", "tips": "Arrive early for sunbeds"},
          {"time": "1:00 PM", "activity": "Lunch at The Walk", "location": "JBR", "duration": "1 hour", "tips": "Many casual dining options"},
          {"time": "3:00 PM", "activity": "Dubai Marina Walk", "location": "Dubai Marina", "duration": "2 hours", "tips": "Great for photos and people-watching"},
          {"time": "6:00 PM", "activity": "Marina Dinner Cruise", "location": "Dubai Marina", "duration": "2 hours", "tips": "Book a sunset cruise for best experience"}
        ]
      }
    ],
    "essentialInfo": [
      {"icon": "Calendar", "label": "Duration", "value": "3 days minimum"},
      {"icon": "DollarSign", "label": "Budget", "value": "AED 3,000-5,000 pp"},
      {"icon": "Plane", "label": "Airport", "value": "DXB recommended"},
      {"icon": "Hotel", "label": "Stay", "value": "Downtown or Marina"},
      {"icon": "Sun", "label": "Weather", "value": "Hot, pack light clothes"},
      {"icon": "CreditCard", "label": "Currency", "value": "AED, cards accepted"},
      {"icon": "Phone", "label": "SIM", "value": "Tourist SIMs available"},
      {"icon": "Plug", "label": "Plugs", "value": "UK-style (Type G)"}
    ],
    "packingList": [
      "Light, breathable clothing",
      "Modest dress for cultural sites",
      "Comfortable walking shoes",
      "Sunscreen and sunglasses",
      "Power adapter (UK-style)",
      "Reusable water bottle",
      "Camera for photos"
    ],
    "budgetBreakdown": [
      {"category": "Accommodation", "amount": "AED 1,500-3,000", "notes": "3 nights in 4-star hotel"},
      {"category": "Attractions", "amount": "AED 500-800", "notes": "Major attractions and activities"},
      {"category": "Food", "amount": "AED 600-1,000", "notes": "Mix of casual and dining"},
      {"category": "Transport", "amount": "AED 200-400", "notes": "Metro, taxi, and transfers"},
      {"category": "Shopping", "amount": "AED 300-500", "notes": "Souvenirs and extras"}
    ],
    "travelTips": [
      "Book Burj Khalifa tickets at least 3 days in advance for sunset slots",
      "Use the Dubai Metro for major attractions - it's cheap and efficient",
      "Dress modestly when visiting Old Dubai and cultural areas",
      "Download the RTA Dubai app for transport planning",
      "Carry a light scarf for air-conditioned malls (they're cold!)",
      "Stay hydrated - carry water and use the free refill stations",
      "Book desert safari at least a day ahead - morning tours are less crowded"
    ],
    "faq": [
      {"question": "Is 3 days enough for Dubai?", "answer": "100-200 word answer"},
      {"question": "What's the best time to visit?", "answer": "100-200 word answer"},
      {"question": "How much money do I need?", "answer": "100-200 word answer"},
      {"question": "What should I pack?", "answer": "100-200 word answer"},
      {"question": "Is Dubai family-friendly?", "answer": "100-200 word answer"},
      {"question": "Can I modify this itinerary?", "answer": "100-200 word answer"}
    ]
  }
}

Generate unique IDs for each block. Make content inspiring, practical for Dubai trip planning, and SEO-optimized.`;

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
          content: `Generate comprehensive content for a Dubai attraction called "${attractionName}".

REQUIREMENTS (VERY IMPORTANT):
- Total word count: 1200-2000 words across all text blocks
- Write engaging, SEO-optimized content that helps tourists plan their visit
- All information must be accurate and realistic for Dubai

Generate ALL sections including:
- Hero block with title and subtitle
- About text block (250-350 words) - detailed introduction
- Complete Experience text block (200-300 words) - visitor journey
- 6 highlights with 50-80 word descriptions each
- Planning Your Visit text block (150-200 words)
- 7 detailed, actionable visitor tips
- Nearby Attractions text block (100-150 words)
- 8 FAQ items with 100-200 word answers EACH (this is critical!)
- 4 ticket options with descriptions and pricing
- 12 essential info items
- 8 quick info bar items
- 5 image descriptions with SEO alt text and captions
- Comprehensive TouristAttraction JSON-LD schema with geo coordinates
- 4 nearby attractions
- Trust signals and related keywords

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
          content: `Generate a comprehensive article about: "${topic}"

${categoryInstruction}

REQUIREMENTS (VERY IMPORTANT):
- Total word count: 1200-2000 words across all text blocks
- Choose the most appropriate writing personality (A-E) for this topic
- Choose the most appropriate article structure (1-6) for this topic
- Write engaging, SEO-optimized content valuable for Dubai travelers

Generate ALL sections including:
- Hero block with compelling title, subtitle, and overlay text
- Introduction text block (200-250 words) - engaging hook
- 3 main content sections (200-300 words each) following your chosen structure
- Highlights block with 6 key takeaways
- Practical Information text block (150-200 words)
- 7 detailed, actionable expert tips
- 8 FAQ items with 100-200 word answers EACH (this is critical!)
- CTA block with relevant call to action
- 4 image descriptions with SEO alt text and captions
- Comprehensive Article JSON-LD schema
- 5 quick facts, 7 pro tips, relevant warnings
- 4 related topics for internal linking

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

export async function generateDiningContent(
  restaurantName: string
): Promise<GeneratedDiningContent | null> {
  const openai = getOpenAIClient();
  if (!openai) {
    throw new Error("OpenAI not configured. Please add OPENAI_API_KEY.");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: DINING_SYSTEM_PROMPT },
        { 
          role: "user", 
          content: `Generate comprehensive content for this Dubai restaurant: "${restaurantName}"

REQUIREMENTS (VERY IMPORTANT):
- Total word count: 1200-2000 words across all text blocks
- Create engaging, appetizing content that helps diners make informed choices
- Include realistic pricing in AED
- Research and include accurate cuisine details

Generate ALL sections including:
- Hero block with compelling title, subtitle, and overlay text
- Quick info with cuisine type, price range, location, dress code, reservations
- Overview text block (250-300 words) - atmosphere, concept, chef background
- Signature dishes block with 6-8 must-try items and descriptions
- Menu highlights with pricing categories
- Ambiance & Decor text block (150-200 words)
- Dining experience text block (200-250 words)
- 7 detailed, practical dining tips
- 8 FAQ items with 100-200 word answers EACH (this is critical!)
- CTA block for reservations
- 4-5 image descriptions with SEO alt text and captions
- Comprehensive Restaurant JSON-LD schema
- 5 quick facts, 7 insider tips, dietary accommodations
- 4 similar restaurant recommendations

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

    return result as GeneratedDiningContent;
  } catch (error) {
    console.error("Error generating dining content:", error);
    throw error;
  }
}

export async function generateDistrictContent(
  districtName: string
): Promise<GeneratedDistrictContent | null> {
  const openai = getOpenAIClient();
  if (!openai) {
    throw new Error("OpenAI not configured. Please add OPENAI_API_KEY.");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: DISTRICT_SYSTEM_PROMPT },
        { 
          role: "user", 
          content: `Generate comprehensive content for this Dubai district/area: "${districtName}"

REQUIREMENTS (VERY IMPORTANT):
- Total word count: 1200-2000 words across all text blocks
- Create an immersive neighborhood guide for travelers
- Include practical navigation and local insights
- Cover all aspects: attractions, dining, shopping, culture

Generate ALL sections including:
- Hero block with compelling title, subtitle, and overlay text
- Quick info with location, best time to visit, getting there, character
- Overview text block (250-300 words) - history, character, vibe
- Key Attractions block with 6-8 must-see spots
- Dining & Nightlife text block (200-250 words)
- Shopping & Markets text block (150-200 words)
- Local Culture & Hidden Gems text block (150-200 words)
- Getting Around text block (100-150 words)
- 7 detailed neighborhood exploration tips
- 8 FAQ items with 100-200 word answers EACH (this is critical!)
- CTA block for tours/experiences
- 4-5 image descriptions with SEO alt text and captions
- Comprehensive TouristDestination JSON-LD schema
- 5 quick facts, 7 local secrets, safety notes
- 4 nearby district recommendations

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

    return result as GeneratedDistrictContent;
  } catch (error) {
    console.error("Error generating district content:", error);
    throw error;
  }
}

export async function generateTransportContent(
  transportType: string
): Promise<GeneratedTransportContent | null> {
  const openai = getOpenAIClient();
  if (!openai) {
    throw new Error("OpenAI not configured. Please add OPENAI_API_KEY.");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: TRANSPORT_SYSTEM_PROMPT },
        { 
          role: "user", 
          content: `Generate comprehensive content for this Dubai transportation option: "${transportType}"

REQUIREMENTS (VERY IMPORTANT):
- Total word count: 1200-2000 words across all text blocks
- Provide accurate, practical transportation guidance
- Include current pricing in AED where applicable
- Focus on helping tourists navigate confidently

Generate ALL sections including:
- Hero block with compelling title, subtitle, and overlay text
- Quick info with cost, availability, payment methods, best for
- Overview text block (250-300 words) - what it is, how it works
- How to Use text block (200-250 words) - step-by-step guide
- Routes & Coverage text block (150-200 words)
- Pricing & Tickets text block (150-200 words) with specific costs
- Pros & Cons comparison block
- Accessibility text block (100-150 words)
- 7 detailed transport tips for tourists
- 8 FAQ items with 100-200 word answers EACH (this is critical!)
- CTA block for apps/booking
- 3-4 image descriptions with SEO alt text and captions
- Comprehensive HowTo JSON-LD schema
- 5 quick facts, common mistakes to avoid
- 4 alternative transport recommendations

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

    return result as GeneratedTransportContent;
  } catch (error) {
    console.error("Error generating transport content:", error);
    throw error;
  }
}

export async function generateEventContent(
  eventName: string
): Promise<GeneratedEventContent | null> {
  const openai = getOpenAIClient();
  if (!openai) {
    throw new Error("OpenAI not configured. Please add OPENAI_API_KEY.");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: EVENT_SYSTEM_PROMPT },
        { 
          role: "user", 
          content: `Generate comprehensive content for this Dubai event/festival: "${eventName}"

REQUIREMENTS (VERY IMPORTANT):
- Total word count: 1200-2000 words across all text blocks
- Create exciting, informative event coverage
- Include practical attendance information
- Help readers plan their visit effectively

Generate ALL sections including:
- Hero block with compelling title, subtitle, and overlay text
- Quick info with dates, venue, ticket prices, duration
- Overview text block (250-300 words) - what the event is, significance
- What to Expect text block (200-250 words) - activities, highlights
- Schedule & Programming block with key times/dates
- Tickets & Entry text block (150-200 words) with pricing tiers
- Getting There text block (100-150 words)
- Food & Amenities text block (100-150 words)
- 7 detailed event attendance tips
- 8 FAQ items with 100-200 word answers EACH (this is critical!)
- CTA block for tickets/registration
- 4-5 image descriptions with SEO alt text and captions
- Comprehensive Event JSON-LD schema
- 5 quick facts, what to bring, prohibited items
- 4 similar event recommendations

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

    return result as GeneratedEventContent;
  } catch (error) {
    console.error("Error generating event content:", error);
    throw error;
  }
}

export async function generateItineraryContent(
  duration: string,
  tripType?: string
): Promise<GeneratedItineraryContent | null> {
  const openai = getOpenAIClient();
  if (!openai) {
    throw new Error("OpenAI not configured. Please add OPENAI_API_KEY.");
  }

  try {
    const tripTypeInstruction = tripType 
      ? `This is a "${tripType}" trip (e.g., family, romantic, adventure, luxury, budget).` 
      : "Create a general-purpose itinerary suitable for most travelers.";

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: ITINERARY_SYSTEM_PROMPT },
        { 
          role: "user", 
          content: `Generate a comprehensive Dubai itinerary for: "${duration}"

${tripTypeInstruction}

REQUIREMENTS (VERY IMPORTANT):
- Total word count: 1200-2000 words across all text blocks
- Create a realistic, well-paced travel plan
- Include specific timing and logistics
- Balance popular attractions with local experiences

Generate ALL sections including:
- Hero block with compelling title, subtitle, and overlay text
- Quick info with duration, budget range, best for, pace
- Overview text block (200-250 words) - trip highlights, philosophy
- Day-by-Day Schedule with detailed morning/afternoon/evening activities
- Each day should include: activities, timing, costs, transport, meal suggestions
- Budget Breakdown text block (150-200 words) with estimated costs
- Packing Essentials block
- Booking Timeline text block (100-150 words) - what to book in advance
- 7 detailed itinerary execution tips
- 8 FAQ items with 100-200 word answers EACH (this is critical!)
- CTA block for tour booking
- 4-5 image descriptions with SEO alt text and captions
- Comprehensive TravelPlan JSON-LD schema (use ItemList for days)
- 5 quick facts, customization options, alternative activities
- 4 related itinerary recommendations

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

    return result as GeneratedItineraryContent;
  } catch (error) {
    console.error("Error generating itinerary content:", error);
    throw error;
  }
}
