import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Search, MapPin, Star, Building2, Waves, TreePalm, 
  Building, Sparkles, Mountain, Ship, Plane, Crown,
  ChevronRight, ArrowRight, Heart, Filter, SlidersHorizontal
} from "lucide-react";
import type { ContentWithRelations } from "@shared/schema";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { useState, useMemo } from "react";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DUBAI_AREAS = [
  {
    id: "palm-jumeirah",
    name: "Palm Jumeirah",
    tagline: "Iconic island resorts with private beaches",
    description: "Man-made island with luxury beach resorts",
    icon: TreePalm,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
    gradient: "from-cyan-500 to-blue-600",
    hotelCount: 25,
    featured: true,
  },
  {
    id: "dubai-marina-jbr",
    name: "Dubai Marina & JBR",
    tagline: "Beachfront living meets urban luxury",
    description: "Waterfront district with beach resorts",
    icon: Waves,
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop",
    gradient: "from-blue-500 to-indigo-600",
    hotelCount: 23,
    featured: true,
  },
  {
    id: "downtown-business-bay",
    name: "Downtown & Business Bay",
    tagline: "At the heart of the city's skyline",
    description: "City center around Burj Khalifa",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop",
    gradient: "from-purple-500 to-pink-600",
    hotelCount: 27,
    featured: true,
  },
  {
    id: "jumeirah-beach",
    name: "Jumeirah Beach & Umm Suqeim",
    tagline: "Where the Burj Al Arab calls home",
    description: "Ultra-luxury coastal resorts",
    icon: Crown,
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
    gradient: "from-amber-500 to-orange-600",
    hotelCount: 11,
    featured: true,
  },
  {
    id: "sheikh-zayed-road",
    name: "Sheikh Zayed Road & DIFC",
    tagline: "Business luxury on Dubai's main artery",
    description: "Financial district hotels",
    icon: Building,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
    gradient: "from-slate-600 to-slate-800",
    hotelCount: 19,
    featured: false,
  },
  {
    id: "deira-airport",
    name: "Deira & Airport Area",
    tagline: "Historic charm meets modern convenience",
    description: "Old Dubai and airport vicinity",
    icon: Plane,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
    gradient: "from-teal-500 to-emerald-600",
    hotelCount: 19,
    featured: false,
  },
  {
    id: "bur-dubai",
    name: "Bur Dubai & Creek",
    tagline: "Heritage meets contemporary elegance",
    description: "Historic creek-side hotels",
    icon: Ship,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
    gradient: "from-rose-500 to-red-600",
    hotelCount: 12,
    featured: false,
  },
  {
    id: "desert-resorts",
    name: "Desert Resorts",
    tagline: "Escape to golden sand dunes",
    description: "Unique desert experiences",
    icon: Mountain,
    image: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800&h=600&fit=crop",
    gradient: "from-orange-500 to-amber-600",
    hotelCount: 9,
    featured: false,
  },
];

const HOTELS_BY_AREA: Record<string, Array<{ name: string; stars: number; highlight?: string }>> = {
  "palm-jumeirah": [
    { name: "Atlantis The Royal", stars: 5, highlight: "Ultra Luxury" },
    { name: "Atlantis The Palm", stars: 5, highlight: "Iconic" },
    { name: "FIVE Palm Jumeirah Dubai", stars: 5, highlight: "Party Scene" },
    { name: "One&Only The Palm", stars: 5, highlight: "Private Beach" },
    { name: "Jumeirah Zabeel Saray", stars: 5 },
    { name: "Fairmont The Palm", stars: 5 },
    { name: "Raffles The Palm Dubai", stars: 5 },
    { name: "W Dubai – The Palm", stars: 5 },
    { name: "Anantara The Palm Dubai Resort", stars: 5 },
    { name: "Sofitel Dubai The Palm Resort & Spa", stars: 5 },
    { name: "The St. Regis Dubai, The Palm", stars: 5 },
    { name: "Kempinski Hotel & Residences Palm Jumeirah", stars: 5 },
    { name: "Marriott Resort Palm Jumeirah", stars: 5 },
    { name: "Hilton Dubai Palm Jumeirah", stars: 5 },
    { name: "Rixos The Palm Dubai Hotel & Suites", stars: 5 },
    { name: "Andaz Dubai The Palm", stars: 5 },
    { name: "NH Collection Dubai The Palm", stars: 5 },
    { name: "Taj Exotica Resort & Spa, The Palm", stars: 5 },
    { name: "Dukes The Palm", stars: 5 },
    { name: "C Central Resort The Palm", stars: 5 },
    { name: "Royal Central Hotel The Palm", stars: 5 },
    { name: "Th8 Palm", stars: 5 },
    { name: "Aloft Palm Jumeirah", stars: 4 },
    { name: "Radisson Beach Resort Palm Jumeirah", stars: 4 },
    { name: "The Retreat Palm Dubai (MGallery)", stars: 4 },
  ],
  "dubai-marina-jbr": [
    { name: "Address Beach Resort", stars: 5, highlight: "Infinity Pool" },
    { name: "Ritz-Carlton, Dubai", stars: 5, highlight: "Classic Luxury" },
    { name: "One&Only Royal Mirage", stars: 5, highlight: "Arabian Palace" },
    { name: "Grosvenor House", stars: 5 },
    { name: "Address Dubai Marina", stars: 5 },
    { name: "Le Royal Méridien Beach Resort & Spa", stars: 5 },
    { name: "Rixos Premium Dubai (JBR)", stars: 5 },
    { name: "Sofitel Dubai Jumeirah Beach", stars: 5 },
    { name: "Hilton Dubai Jumeirah", stars: 5 },
    { name: "InterContinental Dubai Marina", stars: 5 },
    { name: "Habtoor Grand Resort", stars: 5 },
    { name: "Sheraton Jumeirah Beach Resort", stars: 5 },
    { name: "Crowne Plaza Dubai Marina", stars: 5 },
    { name: "The Westin Dubai Mina Seyahi", stars: 5 },
    { name: "W Dubai – Mina Seyahi", stars: 5 },
    { name: "JA Ocean View Hotel", stars: 4 },
    { name: "Amwaj Rotana – JBR", stars: 4 },
    { name: "Delta Hotels by Marriott Jumeirah Beach", stars: 4 },
    { name: "DoubleTree by Hilton Dubai – Jumeirah Beach", stars: 4 },
    { name: "Millennium Place Marina", stars: 4 },
    { name: "Tamani Marina Hotel", stars: 4 },
    { name: "Wyndham Dubai Marina", stars: 4 },
    { name: "Vida Dubai Marina & Yacht Club", stars: 4 },
  ],
  "downtown-business-bay": [
    { name: "Armani Hotel Dubai", stars: 5, highlight: "In Burj Khalifa" },
    { name: "Address Downtown", stars: 5, highlight: "Fountain Views" },
    { name: "Palace Downtown", stars: 5, highlight: "Arabian Elegance" },
    { name: "Address Boulevard", stars: 5 },
    { name: "Address Dubai Mall", stars: 5 },
    { name: "Address Fountain Views", stars: 5 },
    { name: "Address Sky View", stars: 5 },
    { name: "The Dubai EDITION", stars: 5 },
    { name: "Sofitel Dubai Downtown", stars: 5 },
    { name: "JW Marriott Marquis Hotel Dubai", stars: 5 },
    { name: "Taj Dubai", stars: 5 },
    { name: "The St. Regis Downtown Dubai", stars: 5 },
    { name: "The Oberoi Dubai", stars: 5 },
    { name: "Paramount Hotel Dubai", stars: 5 },
    { name: "SLS Dubai Hotel & Residences", stars: 5 },
    { name: "ME Dubai (The Opus)", stars: 5 },
    { name: "Habtoor Palace Dubai (LXR Hotels)", stars: 5 },
    { name: "Hilton Dubai Al Habtoor City", stars: 5 },
    { name: "Pullman Dubai Downtown", stars: 5 },
    { name: "Grand Millennium Business Bay", stars: 5 },
    { name: "Radisson Blu Hotel, Dubai Waterfront", stars: 5 },
    { name: "V Hotel Dubai (Curio Collection)", stars: 5 },
    { name: "Vida Downtown", stars: 4 },
    { name: "Manzil Downtown", stars: 4 },
    { name: "Radisson Blu Hotel, Dubai Canal View", stars: 4 },
    { name: "DoubleTree by Hilton Dubai – Business Bay", stars: 4 },
    { name: "The First Collection Business Bay", stars: 4 },
  ],
  "jumeirah-beach": [
    { name: "Burj Al Arab Jumeirah", stars: 5, highlight: "World's Most Iconic" },
    { name: "Bulgari Resort Dubai", stars: 5, highlight: "Ultimate Luxury" },
    { name: "Four Seasons Resort Dubai at Jumeirah Beach", stars: 5 },
    { name: "Mandarin Oriental Jumeirah", stars: 5 },
    { name: "Jumeirah Al Naseem", stars: 5 },
    { name: "Jumeirah Al Qasr", stars: 5 },
    { name: "Jumeirah Dar Al Masyaf", stars: 5 },
    { name: "Jumeirah Mina A'Salam", stars: 5 },
    { name: "Jumeirah Beach Hotel", stars: 5 },
    { name: "Jumeirah Marsa Al Arab", stars: 5 },
    { name: "Nikki Beach Resort & Spa Dubai", stars: 5 },
  ],
  "sheikh-zayed-road": [
    { name: "One&Only One Za'abeel", stars: 5, highlight: "Newest Landmark" },
    { name: "Four Seasons Hotel Dubai DIFC", stars: 5 },
    { name: "The Ritz-Carlton, DIFC", stars: 5 },
    { name: "Waldorf Astoria DIFC", stars: 5 },
    { name: "Shangri-La Dubai", stars: 5 },
    { name: "Conrad Dubai", stars: 5 },
    { name: "Fairmont Dubai", stars: 5 },
    { name: "Jumeirah Emirates Towers", stars: 5 },
    { name: "Dusit Thani Dubai", stars: 5 },
    { name: "The H Dubai", stars: 5 },
    { name: "Sheraton Grand Hotel, Dubai", stars: 5 },
    { name: "voco Dubai", stars: 5 },
    { name: "Crowne Plaza Dubai", stars: 5 },
    { name: "25hours Hotel One Central", stars: 5 },
    { name: "Millennium Plaza Hotel Dubai", stars: 5 },
    { name: "Four Points by Sheraton Sheikh Zayed Road", stars: 4 },
    { name: "Gevora Hotel", stars: 4 },
    { name: "Rose Rayhaan by Rotana", stars: 4 },
    { name: "Novotel World Trade Centre Dubai", stars: 4 },
  ],
  "deira-airport": [
    { name: "Park Hyatt Dubai", stars: 5, highlight: "Creek Golf Views" },
    { name: "InterContinental Dubai Festival City", stars: 5 },
    { name: "Hyatt Regency Dubai", stars: 5 },
    { name: "Hilton Dubai Creek", stars: 5 },
    { name: "Le Méridien Dubai Hotel & Conference Centre", stars: 5 },
    { name: "Jumeirah Creekside Hotel", stars: 5 },
    { name: "Mövenpick Grand Al Bustan Dubai", stars: 5 },
    { name: "Pullman Dubai Creek City Centre", stars: 5 },
    { name: "Radisson Blu Hotel, Dubai Deira Creek", stars: 5 },
    { name: "Sheraton Dubai Creek Hotel & Towers", stars: 5 },
    { name: "Swissôtel Al Ghurair Dubai", stars: 5 },
    { name: "Avani Deira Dubai Hotel", stars: 5 },
    { name: "Carlton Palace Hotel", stars: 5 },
    { name: "Crowne Plaza Dubai Deira", stars: 5 },
    { name: "Aloft Dubai Creek", stars: 4 },
    { name: "Grand Mercure Dubai Airport", stars: 4 },
    { name: "Holiday Inn Dubai Festival City", stars: 4 },
    { name: "Le Méridien Fairway", stars: 4 },
    { name: "Millennium Airport Hotel Dubai", stars: 4 },
  ],
  "bur-dubai": [
    { name: "Raffles Dubai", stars: 5, highlight: "Pyramid Icon" },
    { name: "Palazzo Versace Dubai", stars: 5, highlight: "Italian Glamour" },
    { name: "Grand Hyatt Dubai", stars: 5 },
    { name: "Sofitel Dubai The Obelisk", stars: 5 },
    { name: "Hyatt Regency Dubai Creek Heights", stars: 5 },
    { name: "Marriott Hotel Al Jaddaf", stars: 5 },
    { name: "Park Regis Kris Kin Hotel", stars: 5 },
    { name: "The Canvas Hotel Dubai (MGallery)", stars: 5 },
    { name: "DoubleTree by Hilton Dubai M Square", stars: 5 },
    { name: "Arabian Courtyard Hotel & Spa", stars: 4 },
    { name: "Four Points by Sheraton Bur Dubai", stars: 4 },
    { name: "Al Seef Heritage Hotel Dubai", stars: 4 },
  ],
  "desert-resorts": [
    { name: "Al Maha, a Luxury Collection Desert Resort", stars: 5, highlight: "Desert Sanctuary" },
    { name: "Bab Al Shams Desert Resort & Spa", stars: 5, highlight: "Dune Views" },
    { name: "The Meydan Hotel", stars: 5 },
    { name: "Al Habtoor Polo Resort", stars: 5 },
    { name: "Desert Palm Dubai", stars: 5 },
    { name: "Address Montgomerie Dubai", stars: 5 },
    { name: "Ghaya Grand Hotel", stars: 5 },
    { name: "JA Hatta Fort Hotel", stars: 4 },
    { name: "Queen Elizabeth 2 (QE2) Hotel", stars: 4 },
  ],
};

const FEATURED_HOTELS = [
  {
    name: "Atlantis The Royal",
    area: "Palm Jumeirah",
    tagline: "Dubai's newest ultra-luxury landmark",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=1000&fit=crop",
    stars: 5,
    label: "Grand Opening",
  },
  {
    name: "Burj Al Arab Jumeirah",
    area: "Jumeirah Beach",
    tagline: "The world's most luxurious hotel",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
    stars: 5,
    label: "Iconic",
  },
  {
    name: "Armani Hotel Dubai",
    area: "Downtown Dubai",
    tagline: "Inside the world's tallest building",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
    stars: 5,
    label: "Designer",
  },
  {
    name: "One&Only The Palm",
    area: "Palm Jumeirah",
    tagline: "Exclusive beachfront escape",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
    stars: 5,
    label: "Private",
  },
];

function AreaCard({ area, onClick, isActive }: { 
  area: typeof DUBAI_AREAS[0]; 
  onClick: () => void;
  isActive: boolean;
}) {
  const Icon = area.icon;
  
  return (
    <div
      className={`group relative overflow-hidden rounded-xl p-4 md:p-5 text-left transition-all duration-300 ${
        isActive 
          ? 'ring-2 ring-primary shadow-lg scale-105' 
          : 'hover:shadow-md'
      }`}
      data-testid={`card-area-${area.id}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${area.gradient} opacity-90`} />
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
      
      <div className="relative z-10">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/20 flex items-center justify-center mb-3">
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <h3 className="font-bold text-white text-sm md:text-base mb-1">{area.name}</h3>
        <p className="text-white/80 text-xs md:text-sm line-clamp-2">{area.tagline}</p>
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <Badge className="bg-white/20 text-white border-0 text-xs">
            {area.hotelCount} hotels
          </Badge>
        </div>
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <button 
            onClick={onClick}
            className="text-xs text-white/80 hover:text-white underline-offset-2 hover:underline transition-colors"
            data-testid={`button-filter-${area.id}`}
          >
            {isActive ? 'Show All' : 'Filter Hotels'}
          </button>
          <Link 
            href={`/districts/${area.id}`}
            className="text-xs text-white font-medium flex items-center gap-1 hover:gap-2 transition-all"
            data-testid={`link-district-${area.id}`}
          >
            Explore Area <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeaturedHotelCard({ hotel, featured = false }: { 
  hotel: typeof FEATURED_HOTELS[0]; 
  featured?: boolean;
}) {
  return (
    <Card 
      className={`group overflow-visible border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer relative ${
        featured ? 'col-span-1 md:col-span-2 row-span-2' : ''
      }`}
      data-testid={`card-featured-hotel-${hotel.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className={`overflow-hidden rounded-lg ${featured ? 'aspect-[4/5]' : 'aspect-[4/3]'}`}>
        <img 
          src={hotel.image} 
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-lg" />
        
        {hotel.label && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary text-primary-foreground">
              {hotel.label}
            </Badge>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
          <div className="flex items-center gap-1 mb-2">
            {[...Array(hotel.stars)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
          
          <h3 className={`font-bold text-white mb-1 ${featured ? 'text-xl md:text-2xl' : 'text-base md:text-lg'}`}>
            {hotel.name}
          </h3>
          
          <div className="flex items-center gap-1 text-white/70 text-xs mb-2">
            <MapPin className="w-3 h-3" />
            <span>{hotel.area}</span>
          </div>
          
          <p className="text-white/80 text-xs md:text-sm line-clamp-2 mb-3">
            {hotel.tagline}
          </p>
          
          <div className="flex items-center gap-2 text-white font-medium text-sm group-hover:gap-3 transition-all">
            <span>View Details</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Card>
  );
}

function HotelListCard({ hotel, areaName }: { 
  hotel: { name: string; stars: number; highlight?: string };
  areaName: string;
}) {
  return (
    <Card 
      className="group overflow-hidden border hover-elevate cursor-pointer p-4"
      data-testid={`card-hotel-${hotel.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-1">
            {[...Array(hotel.stars)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
            {hotel.name}
          </h3>
          <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
            <MapPin className="w-3 h-3" />
            <span className="line-clamp-1">{areaName}</span>
          </div>
        </div>
        {hotel.highlight && (
          <Badge variant="secondary" className="text-xs shrink-0">
            {hotel.highlight}
          </Badge>
        )}
      </div>
    </Card>
  );
}

export default function PublicHotels() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeArea, setActiveArea] = useState<string | null>(null);
  const [starFilter, setStarFilter] = useState<number | null>(null);
  
  useDocumentMeta({
    title: "Luxury Hotels in Dubai by Area | Travi - Dubai Travel Guide",
    description: "Find the perfect Dubai hotel by neighborhood. From Palm Jumeirah resorts to Downtown high-rises, discover 4 and 5-star hotels in every corner of Dubai.",
    ogTitle: "Luxury Hotels in Dubai | Travi",
    ogDescription: "Find your perfect stay in Dubai's most sought-after neighborhoods.",
    ogType: "website",
  });
  
  const { data: allContent, isLoading } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/public/contents?includeExtensions=true"],
  });

  const dbHotels = allContent?.filter(c => c.type === "hotel") || [];
  
  const filteredHotels = useMemo(() => {
    let hotels: Array<{ name: string; stars: number; highlight?: string; area: string }> = [];
    
    const areas = activeArea ? [activeArea] : Object.keys(HOTELS_BY_AREA);
    
    areas.forEach(areaId => {
      const areaHotels = HOTELS_BY_AREA[areaId] || [];
      const areaInfo = DUBAI_AREAS.find(a => a.id === areaId);
      areaHotels.forEach(h => {
        hotels.push({ ...h, area: areaInfo?.name || areaId });
      });
    });
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      hotels = hotels.filter(h => 
        h.name.toLowerCase().includes(query) ||
        h.area.toLowerCase().includes(query)
      );
    }
    
    if (starFilter) {
      hotels = hotels.filter(h => h.stars === starFilter);
    }
    
    return hotels;
  }, [activeArea, searchQuery, starFilter]);

  const handleAreaClick = (areaId: string) => {
    setActiveArea(activeArea === areaId ? null : areaId);
  };

  const totalHotels = Object.values(HOTELS_BY_AREA).flat().length;
  const fiveStarCount = Object.values(HOTELS_BY_AREA).flat().filter(h => h.stars === 5).length;
  const featuredAreas = DUBAI_AREAS.filter(a => a.featured);

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&h=1080&fit=crop"
            alt="Dubai luxury hotels"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm mb-4">
            {totalHotels}+ Luxury Hotels
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
            Find your perfect
            <span className="block bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Dubai stay
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            From iconic island resorts to urban retreats, discover {fiveStarCount} five-star properties across Dubai's most sought-after neighborhoods.
          </p>
          
          <div className="max-w-xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 flex items-center gap-2 border border-white/20">
              <Search className="w-5 h-5 text-white/60 ml-3" />
              <input
                type="text"
                placeholder="Search hotels or areas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none py-3 text-white placeholder:text-white/50"
                data-testid="input-search-hotels"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <Button 
              variant={starFilter === 5 ? "default" : "outline"} 
              size="sm"
              className={starFilter === 5 ? "" : "border-white/30 text-white hover:bg-white/10"}
              onClick={() => setStarFilter(starFilter === 5 ? null : 5)}
              data-testid="button-filter-5star"
            >
              <Star className="w-4 h-4 mr-1 fill-current" /> 5-Star Only
            </Button>
            <Button 
              variant={starFilter === 4 ? "default" : "outline"} 
              size="sm"
              className={starFilter === 4 ? "" : "border-white/30 text-white hover:bg-white/10"}
              onClick={() => setStarFilter(starFilter === 4 ? null : 4)}
              data-testid="button-filter-4star"
            >
              <Star className="w-4 h-4 mr-1 fill-current" /> 4-Star Only
            </Button>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-6 h-6 text-white/60 rotate-90" />
        </div>
      </section>

      <main className="flex-1">
        {/* Browse by Area */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Browse by Area</h2>
              <p className="text-muted-foreground">Where do you want to stay in Dubai?</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {DUBAI_AREAS.map((area) => (
                <AreaCard 
                  key={area.id} 
                  area={area} 
                  isActive={activeArea === area.id}
                  onClick={() => handleAreaClick(area.id)}
                />
              ))}
            </div>
            
            {activeArea && (
              <div className="mt-6 text-center">
                <Button 
                  variant="ghost" 
                  onClick={() => setActiveArea(null)}
                  data-testid="button-clear-area-filter"
                >
                  Show all areas
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Featured Hotels - only show when no filters */}
        {!activeArea && !searchQuery && !starFilter && (
          <section className="py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-1">Iconic Hotels</h2>
                  <p className="text-muted-foreground">The most sought-after addresses in Dubai</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <FeaturedHotelCard hotel={FEATURED_HOTELS[0]} featured />
                <div className="grid grid-cols-1 gap-4 md:gap-6 md:col-span-1 lg:col-span-2">
                  {FEATURED_HOTELS.slice(1, 4).map((hotel) => (
                    <FeaturedHotelCard key={hotel.name} hotel={hotel} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Hotel Listings */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-1">
                  {activeArea 
                    ? DUBAI_AREAS.find(a => a.id === activeArea)?.name 
                    : "All Hotels"}
                </h2>
                <p className="text-muted-foreground">
                  {filteredHotels.length} hotels found
                </p>
              </div>
              
              {(searchQuery || starFilter) && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setStarFilter(null);
                  }}
                  data-testid="button-clear-filters"
                >
                  Clear filters
                </Button>
              )}
            </div>
            
            {filteredHotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredHotels.map((hotel, index) => (
                  <HotelListCard 
                    key={`${hotel.name}-${index}`} 
                    hotel={hotel} 
                    areaName={hotel.area} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No hotels found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("");
                    setActiveArea(null);
                    setStarFilter(null);
                  }}
                  data-testid="button-reset-all"
                >
                  Reset All
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-purple-600/90" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Need Help Choosing?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Our travel experts can help you find the perfect hotel for your Dubai adventure.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90" data-testid="button-compare-hotels">
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                Compare Hotels
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" data-testid="button-save-favorites">
                <Heart className="w-5 h-5 mr-2" />
                Save Favorites
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" data-testid="button-get-recommendations">
                <Sparkles className="w-5 h-5 mr-2" />
                Get Recommendations
              </Button>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
