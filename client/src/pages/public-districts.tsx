import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  MapPin, Search, ChevronRight, Compass, Building2, 
  Palmtree, Users, Briefcase, Gem, Waves, Sparkles,
  Sun, Moon, Heart, ArrowRight, Map
} from "lucide-react";
import type { Content } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { useState, useMemo } from "react";
import { useDocumentMeta } from "@/hooks/use-document-meta";

const VIBE_FILTERS = [
  { id: "beach", label: "Beach", icon: Waves },
  { id: "nightlife", label: "Nightlife", icon: Moon },
  { id: "family", label: "Family", icon: Users },
  { id: "luxury", label: "Luxury", icon: Gem },
  { id: "culture", label: "Culture", icon: Sparkles },
  { id: "business", label: "Business", icon: Briefcase },
];

const VIBE_CARDS = [
  { 
    id: "beach", 
    title: "Beach Life", 
    description: "Sun, sand, and stunning coastlines",
    icon: Palmtree,
    gradient: "from-[#01BEFF] to-[#6443F4]",
    tags: ["JBR", "Jumeirah", "Palm Jumeirah", "Marina"]
  },
  { 
    id: "urban", 
    title: "Urban Energy", 
    description: "Skyscrapers, nightlife, and endless entertainment",
    icon: Building2,
    gradient: "from-[#6443F4] to-[#F94498]",
    tags: ["Downtown", "DIFC", "Business Bay", "Marina"]
  },
  { 
    id: "culture", 
    title: "Creative & Culture", 
    description: "Art galleries, heritage sites, and authentic vibes",
    icon: Sparkles,
    gradient: "from-[#FF9327] to-[#FFD112]",
    tags: ["Al Quoz", "Deira", "Old Dubai", "City Walk"]
  },
  { 
    id: "family", 
    title: "Family Friendly", 
    description: "Parks, schools, and community living",
    icon: Users,
    gradient: "from-[#02A65C] to-[#59ED63]",
    tags: ["Arabian Ranches", "Dubai Hills", "JVC", "Al Barsha"]
  },
  { 
    id: "business", 
    title: "Business & Ambition", 
    description: "Corporate hubs and professional networks",
    icon: Briefcase,
    gradient: "from-[#504065] to-[#24103E]",
    tags: ["DIFC", "Business Bay", "Downtown", "JLT"]
  },
  { 
    id: "luxury", 
    title: "Ultra Luxury", 
    description: "Exclusive addresses and premium lifestyle",
    icon: Gem,
    gradient: "from-[#FFD112] to-[#FF9327]",
    tags: ["Palm Jumeirah", "Emirates Hills", "Downtown", "Jumeirah"]
  },
];

const JOURNEY_CARDS = [
  {
    id: "first-time",
    title: "First Time in Dubai",
    description: "Discover the must-see neighborhoods for tourists and first-time visitors",
    icon: Compass,
    suggested: ["Downtown Dubai", "Dubai Marina", "Palm Jumeirah", "Old Dubai"]
  },
  {
    id: "moving",
    title: "Moving to Dubai",
    description: "Find the perfect neighborhood for your new home based on lifestyle and budget",
    icon: Heart,
    suggested: ["Dubai Hills", "JVC", "Al Barsha", "Arabian Ranches"]
  },
  {
    id: "investing",
    title: "Investing / Long Stay",
    description: "Premium areas with strong rental yields and appreciation potential",
    icon: Building2,
    suggested: ["DIFC", "Business Bay", "Marina", "Palm Jumeirah"]
  },
];

interface NeighborhoodData {
  slug: string;
  title: string;
  description: string;
  image: string;
  tier: 1 | 2 | 3;
  tags: string[];
  knownFor: string;
  vibe: string;
  bestFor: string;
}

const NEIGHBORHOODS: NeighborhoodData[] = [
  {
    slug: "downtown-dubai",
    title: "Downtown Dubai",
    description: "The heart of Dubai featuring Burj Khalifa, Dubai Mall, and the iconic Dubai Fountain",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=1000&fit=crop",
    tier: 1,
    tags: ["Luxury", "Nightlife", "Shopping"],
    knownFor: "Burj Khalifa & Dubai Mall",
    vibe: "Cosmopolitan & Glamorous",
    bestFor: "Tourists & Young Professionals"
  },
  {
    slug: "dubai-marina",
    title: "Dubai Marina",
    description: "Stunning waterfront living with world-class restaurants, yacht clubs, and vibrant nightlife",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=1000&fit=crop",
    tier: 1,
    tags: ["Beach", "Nightlife", "Urban"],
    knownFor: "Marina Walk & Yacht Life",
    vibe: "Trendy & Energetic",
    bestFor: "Young Professionals & Expats"
  },
  {
    slug: "palm-jumeirah",
    title: "Palm Jumeirah",
    description: "The iconic palm-shaped island with luxury resorts, private beaches, and celebrity homes",
    image: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=1000&fit=crop",
    tier: 1,
    tags: ["Luxury", "Beach", "Exclusive"],
    knownFor: "Atlantis & Private Beaches",
    vibe: "Exclusive & Resort-style",
    bestFor: "Luxury Seekers & Families"
  },
  {
    slug: "jumeirah",
    title: "Jumeirah",
    description: "Upscale beachside neighborhood with luxury villas, boutique cafes, and pristine beaches",
    image: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&h=1000&fit=crop",
    tier: 1,
    tags: ["Beach", "Luxury", "Family"],
    knownFor: "Jumeirah Beach & Villa Living",
    vibe: "Relaxed & Upscale",
    bestFor: "Families & Beach Lovers"
  },
  {
    slug: "difc",
    title: "DIFC",
    description: "Dubai's financial hub with world-class dining, art galleries, and premium office spaces",
    image: "https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&h=1000&fit=crop",
    tier: 1,
    tags: ["Business", "Dining", "Art"],
    knownFor: "Gate Avenue & Fine Dining",
    vibe: "Sophisticated & Professional",
    bestFor: "Business Executives & Foodies"
  },
  {
    slug: "business-bay",
    title: "Business Bay",
    description: "Dubai's modern business district with canal views, sleek towers, and urban lifestyle",
    image: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=800&h=1000&fit=crop",
    tier: 1,
    tags: ["Business", "Urban", "Modern"],
    knownFor: "Dubai Canal & Skyline Views",
    vibe: "Dynamic & Ambitious",
    bestFor: "Professionals & Investors"
  },
  {
    slug: "jbr",
    title: "JBR (Jumeirah Beach Residence)",
    description: "Beachfront community with The Walk promenade, beach activities, and family entertainment",
    image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&h=1000&fit=crop",
    tier: 2,
    tags: ["Beach", "Family", "Entertainment"],
    knownFor: "The Walk & Bluewaters",
    vibe: "Lively & Family-friendly",
    bestFor: "Families & Beach Enthusiasts"
  },
  {
    slug: "city-walk",
    title: "City Walk",
    description: "Open-air lifestyle destination with designer boutiques, art installations, and al fresco dining",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1000&fit=crop",
    tier: 2,
    tags: ["Shopping", "Culture", "Dining"],
    knownFor: "Art & Designer Stores",
    vibe: "Chic & Artsy",
    bestFor: "Trendsetters & Art Lovers"
  },
  {
    slug: "al-quoz",
    title: "Al Quoz",
    description: "Dubai's creative and industrial hub with art galleries, studios, and hip cafes",
    image: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&h=1000&fit=crop",
    tier: 2,
    tags: ["Culture", "Art", "Creative"],
    knownFor: "Alserkal Avenue & Galleries",
    vibe: "Artistic & Industrial",
    bestFor: "Artists & Creatives"
  },
  {
    slug: "al-barsha",
    title: "Al Barsha",
    description: "Central residential area near Mall of the Emirates with excellent connectivity",
    image: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&h=1000&fit=crop",
    tier: 2,
    tags: ["Family", "Shopping", "Central"],
    knownFor: "Mall of the Emirates",
    vibe: "Convenient & Family-oriented",
    bestFor: "Families & Professionals"
  },
  {
    slug: "dubai-hills",
    title: "Dubai Hills",
    description: "Master-planned community with golf course, parks, and Dubai Hills Mall",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=1000&fit=crop",
    tier: 2,
    tags: ["Family", "Green", "Modern"],
    knownFor: "Golf Course & Parks",
    vibe: "Green & Suburban",
    bestFor: "Families & Golf Enthusiasts"
  },
  {
    slug: "deira",
    title: "Deira",
    description: "Historic trading hub with traditional souks, gold market, and authentic Emirati culture",
    image: "https://images.unsplash.com/photo-1548080350-97f932f1dd9d?w=800&h=1000&fit=crop",
    tier: 2,
    tags: ["Culture", "Heritage", "Shopping"],
    knownFor: "Gold & Spice Souks",
    vibe: "Traditional & Authentic",
    bestFor: "Culture Seekers & Shoppers"
  },
  {
    slug: "old-dubai",
    title: "Old Dubai (Bur Dubai)",
    description: "Heritage district with Al Fahidi, Dubai Creek, and traditional abra rides",
    image: "https://images.unsplash.com/photo-1547483238-f400e65ccd56?w=800&h=1000&fit=crop",
    tier: 2,
    tags: ["Culture", "Heritage", "History"],
    knownFor: "Al Fahidi & Dubai Creek",
    vibe: "Historic & Cultural",
    bestFor: "History Buffs & Explorers"
  },
  {
    slug: "jvc",
    title: "JVC (Jumeirah Village Circle)",
    description: "Affordable family community with parks, schools, and growing amenities",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=1000&fit=crop",
    tier: 3,
    tags: ["Family", "Affordable", "Community"],
    knownFor: "Affordable Living & Parks",
    vibe: "Suburban & Welcoming",
    bestFor: "Young Families & First-time Renters"
  },
  {
    slug: "jlt",
    title: "JLT (Jumeirah Lake Towers)",
    description: "Lakeside community with parks, restaurants, and excellent metro connectivity",
    image: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=800&h=1000&fit=crop",
    tier: 3,
    tags: ["Urban", "Lakes", "Dining"],
    knownFor: "Lake Views & Pet-friendly",
    vibe: "Laid-back & Community-focused",
    bestFor: "Pet Owners & Young Professionals"
  },
  {
    slug: "arabian-ranches",
    title: "Arabian Ranches",
    description: "Premium villa community with golf course, equestrian club, and family facilities",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=1000&fit=crop",
    tier: 3,
    tags: ["Family", "Luxury", "Green"],
    knownFor: "Golf & Equestrian",
    vibe: "Exclusive & Community-focused",
    bestFor: "Established Families"
  },
  {
    slug: "the-greens",
    title: "The Greens & Views",
    description: "Established community with lush gardens, diverse dining, and strong community spirit",
    image: "https://images.unsplash.com/photo-1571939228382-b2f2b585ce15?w=800&h=1000&fit=crop",
    tier: 3,
    tags: ["Community", "Green", "Dining"],
    knownFor: "Gardens & Community Vibe",
    vibe: "Friendly & Established",
    bestFor: "Couples & Young Families"
  },
  {
    slug: "bluewaters-island",
    title: "Bluewaters Island",
    description: "Entertainment island featuring Ain Dubai, Caesar's Palace, and premium residences",
    image: "https://images.unsplash.com/photo-1609929132867-904e3aff8aae?w=800&h=1000&fit=crop",
    tier: 3,
    tags: ["Entertainment", "Luxury", "Beach"],
    knownFor: "Ain Dubai & Entertainment",
    vibe: "Resort-style & Vibrant",
    bestFor: "Tourists & Entertainment Seekers"
  },
];

function NeighborhoodCard({ neighborhood, featured = false }: { neighborhood: NeighborhoodData; featured?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Link href={`/districts/${neighborhood.slug}`}>
      <Card 
        className={`group overflow-visible border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer relative ${
          featured ? 'col-span-1 md:col-span-2 row-span-2' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-testid={`card-neighborhood-${neighborhood.slug}`}
      >
        <div className={`overflow-hidden rounded-lg ${featured ? 'aspect-[4/5]' : 'aspect-[3/4]'}`}>
          <img 
            src={neighborhood.image} 
            alt={neighborhood.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-lg" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {neighborhood.tags.slice(0, 3).map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="bg-white/20 text-white border-0 backdrop-blur-sm text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h3 className={`font-bold text-white mb-1 ${featured ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}>
              {neighborhood.title}
            </h3>
            
            <p className={`text-white/80 line-clamp-2 mb-3 ${featured ? 'text-sm md:text-base' : 'text-xs md:text-sm'}`}>
              {neighborhood.knownFor}
            </p>
            
            <div 
              className={`transition-all duration-300 overflow-hidden ${
                isHovered ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="flex items-center gap-4 text-xs text-white/70 mb-2">
                <span className="flex items-center gap-1">
                  <Sun className="w-3 h-3" />
                  {neighborhood.vibe}
                </span>
              </div>
              <p className="text-white/90 text-xs">
                Best for: {neighborhood.bestFor}
              </p>
            </div>
            
            <div className="flex items-center gap-2 mt-2 text-white font-medium text-sm group-hover:gap-3 transition-all">
              <span>Explore</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function VibeCard({ vibe, isActive, onClick }: { 
  vibe: typeof VIBE_CARDS[0]; 
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = vibe.icon;
  
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl p-4 md:p-6 text-left transition-all duration-300 ${
        isActive 
          ? 'ring-2 ring-primary shadow-lg scale-105' 
          : 'hover:scale-102 hover:shadow-md'
      }`}
      data-testid={`button-vibe-${vibe.id}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${vibe.gradient} opacity-90`} />
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
      
      <div className="relative z-10">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/20 flex items-center justify-center mb-3">
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <h3 className="font-bold text-white text-sm md:text-base mb-1">{vibe.title}</h3>
        <p className="text-white/80 text-xs md:text-sm line-clamp-2">{vibe.description}</p>
      </div>
    </button>
  );
}

function JourneyCard({ journey }: { journey: typeof JOURNEY_CARDS[0] }) {
  const Icon = journey.icon;
  
  return (
    <Card className="group overflow-hidden border hover-elevate cursor-pointer" data-testid={`card-journey-${journey.id}`}>
      <div className="p-5 md:p-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-bold text-lg mb-2">{journey.title}</h3>
        <p className="text-muted-foreground text-sm mb-4">{journey.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {journey.suggested.map((area) => (
            <Badge key={area} variant="outline" className="text-xs">
              {area}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}

const MAP_REGIONS = [
  { 
    name: "Dubai Coast", 
    areas: ["Dubai Marina", "JBR", "Palm Jumeirah", "Bluewaters Island"],
    icon: Waves,
    color: "from-[#01BEFF] to-[#6443F4]"
  },
  { 
    name: "Downtown & Business", 
    areas: ["Downtown Dubai", "DIFC", "Business Bay"],
    icon: Building2,
    color: "from-[#6443F4] to-[#9077EF]"
  },
  { 
    name: "Historic Dubai", 
    areas: ["Deira", "Old Dubai", "Al Quoz"],
    icon: Sparkles,
    color: "from-[#FF9327] to-[#FFD112]"
  },
  { 
    name: "Suburban Living", 
    areas: ["Dubai Hills", "JVC", "Arabian Ranches", "Al Barsha"],
    icon: Users,
    color: "from-[#02A65C] to-[#59ED63]"
  }
];

export default function PublicDistricts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVibe, setActiveVibe] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  
  useDocumentMeta({
    title: "Dubai Neighborhoods & Districts | Travi - Dubai Travel Guide",
    description: "Explore Dubai's diverse neighborhoods. From luxurious Palm Jumeirah to creative Al Quoz, find the perfect district for your lifestyle, travel, or investment.",
    ogTitle: "Dubai Neighborhoods & Districts | Travi",
    ogDescription: "Discover the unique character of each Dubai neighborhood - from beachfront Marina to historic Deira.",
    ogType: "website",
  });
  
  const { data: allContent, isLoading } = useQuery<Content[]>({
    queryKey: ["/api/contents?status=published"],
  });

  const dbDistricts = allContent?.filter(c => c.type === "district") || [];
  
  const allNeighborhoods = useMemo(() => {
    const dbSlugs = new Set(dbDistricts.map(d => d.slug));
    const combined = [...NEIGHBORHOODS];
    
    dbDistricts.forEach(d => {
      if (!combined.find(n => n.slug === d.slug)) {
        combined.push({
          slug: d.slug,
          title: d.title,
          description: d.metaDescription || "Explore this neighborhood in Dubai",
          image: d.heroImage || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=1000&fit=crop",
          tier: 2 as const,
          tags: ["Explore"],
          knownFor: d.metaDescription?.substring(0, 50) || "Discover more",
          vibe: "Unique & Diverse",
          bestFor: "Explorers"
        });
      }
    });
    
    return combined;
  }, [dbDistricts]);

  const filteredNeighborhoods = useMemo(() => {
    let filtered = allNeighborhoods;
    
    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    if (activeVibe) {
      const vibeCard = VIBE_CARDS.find(v => v.id === activeVibe);
      if (vibeCard) {
        filtered = filtered.filter(n => 
          vibeCard.tags.some(tag => 
            n.title.toLowerCase().includes(tag.toLowerCase()) ||
            n.tags.some(t => t.toLowerCase() === tag.toLowerCase())
          )
        );
      }
    }
    
    if (activeFilter) {
      filtered = filtered.filter(n => 
        n.tags.some(t => t.toLowerCase() === activeFilter.toLowerCase())
      );
    }
    
    if (activeRegion) {
      const region = MAP_REGIONS.find(r => r.name === activeRegion);
      if (region) {
        filtered = filtered.filter(n => 
          region.areas.some(area => 
            n.title.toLowerCase().includes(area.toLowerCase()) ||
            area.toLowerCase().includes(n.title.toLowerCase().replace(" (jumeirah beach residence)", "").replace(" (jumeirah village circle)", "").replace(" (jumeirah lake towers)", ""))
          )
        );
      }
    }
    
    return filtered;
  }, [allNeighborhoods, searchQuery, activeVibe, activeFilter, activeRegion]);

  const tier1 = filteredNeighborhoods.filter(n => n.tier === 1);
  const tier2 = filteredNeighborhoods.filter(n => n.tier === 2);
  const tier3 = filteredNeighborhoods.filter(n => n.tier === 3);

  const handleVibeClick = (vibeId: string) => {
    setActiveVibe(activeVibe === vibeId ? null : vibeId);
    setActiveFilter(null);
    setActiveRegion(null);
  };

  const handleFilterClick = (filterId: string) => {
    setActiveFilter(activeFilter === filterId ? null : filterId);
    setActiveVibe(null);
    setActiveRegion(null);
  };

  const handleRegionClick = (regionName: string) => {
    setActiveRegion(activeRegion === regionName ? null : regionName);
    setActiveVibe(null);
    setActiveFilter(null);
    setSearchQuery("");
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <PublicNav />

      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIxNSIgcj0iMiIvPjxjaXJjbGUgY3g9IjE1IiBjeT0iMzAiIHI9IjIiLz48Y2lyY2xlIGN4PSI0NSIgY3k9IjMwIiByPSIyIi8+PGNpcmNsZSBjeD0iMzAiIGN5PSI0NSIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-sm mb-6">
            <MapPin className="w-4 h-4" />
            <span>18+ Neighborhoods to Explore</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Dubai Neighborhoods
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Every corner of Dubai has its own story. Find the neighborhood that matches your vibe.
          </p>
          
          <div className="max-w-xl mx-auto mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 flex items-center gap-2 border border-white/20">
              <Search className="w-5 h-5 text-white/60 ml-3" />
              <input
                type="text"
                placeholder="Marina? Culture? Beach? Business?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none py-3 text-white placeholder:text-white/50"
                data-testid="input-search-districts"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {VIBE_FILTERS.map((filter) => {
              const Icon = filter.icon;
              return (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterClick(filter.id)}
                  className={activeFilter === filter.id 
                    ? "bg-white text-slate-900 hover:bg-white/90" 
                    : "border-white/30 text-white hover:bg-white/10"
                  }
                  data-testid={`button-filter-${filter.id}`}
                >
                  <Icon className="w-4 h-4 mr-1.5" />
                  {filter.label}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      <main className="flex-1">
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Choose Your Vibe</h2>
              <p className="text-muted-foreground">What kind of Dubai experience are you looking for?</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
              {VIBE_CARDS.map((vibe) => (
                <VibeCard 
                  key={vibe.id} 
                  vibe={vibe} 
                  isActive={activeVibe === vibe.id}
                  onClick={() => handleVibeClick(vibe.id)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Map Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Explore Dubai's Map</h2>
              <p className="text-muted-foreground">Click on any area to see neighborhoods in that region</p>
            </div>
            
            <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 md:p-8 overflow-hidden">
              {/* Decorative water pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cyan-300 to-transparent dark:from-cyan-900" />
              </div>
              
              <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Map Region Cards */}
                {MAP_REGIONS.map((region) => {
                  const Icon = region.icon;
                  const isActive = activeRegion === region.name;
                  return (
                    <button
                      key={region.name}
                      onClick={() => handleRegionClick(region.name)}
                      className={`group relative overflow-hidden rounded-xl p-4 md:p-5 text-left transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        isActive ? 'ring-2 ring-white ring-offset-2 ring-offset-background scale-105 shadow-lg' : ''
                      }`}
                      data-testid={`button-map-region-${region.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${region.color} opacity-90`} />
                      <div className={`absolute inset-0 transition-colors ${isActive ? 'bg-black/0' : 'bg-black/5 group-hover:bg-black/0'}`} />
                      
                      <div className="relative z-10">
                        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mb-3">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-white text-sm md:text-base mb-2">{region.name}</h3>
                        <div className="flex flex-wrap gap-1">
                          {region.areas.slice(0, 3).map((area) => (
                            <span key={area} className="text-xs text-white/80 bg-white/10 px-2 py-0.5 rounded-full">
                              {area}
                            </span>
                          ))}
                          {region.areas.length > 3 && (
                            <span className="text-xs text-white/60">+{region.areas.length - 3}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {/* Map Legend */}
              <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Click a region to filter neighborhoods
                </span>
              </div>
            </div>
          </div>
        </section>

        {tier1.length > 0 && (
          <section className="py-12 md:py-16 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-1">Iconic Neighborhoods</h2>
                  <p className="text-muted-foreground">The must-see districts that define Dubai</p>
                </div>
                <Button variant="ghost" className="hidden md:flex items-center gap-2">
                  View all <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {tier1.slice(0, 2).map((neighborhood) => (
                  <NeighborhoodCard key={neighborhood.slug} neighborhood={neighborhood} featured />
                ))}
                <div className="grid grid-cols-1 gap-4 md:gap-6 md:col-span-2 lg:col-span-2">
                  {tier1.slice(2, 6).map((neighborhood) => (
                    <NeighborhoodCard key={neighborhood.slug} neighborhood={neighborhood} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {tier2.length > 0 && (
          <section className="py-12 md:py-16 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-1">Popular Districts</h2>
                  <p className="text-muted-foreground">Diverse neighborhoods for every lifestyle</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {tier2.map((neighborhood) => (
                  <NeighborhoodCard key={neighborhood.slug} neighborhood={neighborhood} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Not Sure Where to Start?</h2>
              <p className="text-muted-foreground">We'll help you find the perfect neighborhood</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {JOURNEY_CARDS.map((journey) => (
                <JourneyCard key={journey.id} journey={journey} />
              ))}
            </div>
          </div>
        </section>

        {tier3.length > 0 && (
          <section className="py-12 md:py-16 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-1">Discover More</h2>
                  <p className="text-muted-foreground">Hidden gems and emerging communities</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {tier3.map((neighborhood) => (
                  <NeighborhoodCard key={neighborhood.slug} neighborhood={neighborhood} />
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-purple-600/90" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Find Your Perfect District
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Compare neighborhoods, explore local insights, and discover where you belong in Dubai.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                <Map className="w-5 h-5 mr-2" />
                Explore Map
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Heart className="w-5 h-5 mr-2" />
                Save Favorites
              </Button>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
