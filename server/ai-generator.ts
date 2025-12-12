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
