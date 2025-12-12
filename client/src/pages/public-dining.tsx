import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Search, MapPin, Star, Utensils, Wine, Coffee,
  ChefHat, Flame, Fish, Leaf, Globe, Building2,
  ChevronRight, ArrowRight, Clock, DollarSign
} from "lucide-react";
import type { ContentWithRelations } from "@shared/schema";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { useState, useMemo } from "react";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DUBAI_DINING_DISTRICTS = [
  {
    id: "difc",
    name: "DIFC",
    tagline: "Dubai's culinary powerhouse",
    description: "Financial district with world-class restaurants",
    icon: Building2,
    gradient: "from-[#504065] to-[#24103E]",
    restaurantCount: 50,
    featured: true,
  },
  {
    id: "downtown-dubai",
    name: "Downtown Dubai",
    tagline: "Dining with Burj Khalifa views",
    description: "Premium restaurants around Dubai Mall",
    icon: Star,
    gradient: "from-[#6443F4] to-[#F94498]",
    restaurantCount: 45,
    featured: true,
  },
  {
    id: "dubai-marina",
    name: "Dubai Marina",
    tagline: "Waterfront dining at its finest",
    description: "Marina-side restaurants and lounges",
    icon: Wine,
    gradient: "from-[#6443F4] to-[#9077EF]",
    restaurantCount: 40,
    featured: true,
  },
  {
    id: "palm-jumeirah",
    name: "Palm Jumeirah",
    tagline: "Resort dining on the iconic Palm",
    description: "Beachfront and hotel restaurants",
    icon: Utensils,
    gradient: "from-[#01BEFF] to-[#6443F4]",
    restaurantCount: 35,
    featured: true,
  },
  {
    id: "jumeirah",
    name: "Jumeirah",
    tagline: "Beachside elegance",
    description: "Premium dining along the coast",
    icon: Fish,
    gradient: "from-[#FF9327] to-[#FFD112]",
    restaurantCount: 30,
    featured: false,
  },
  {
    id: "business-bay",
    name: "Business Bay",
    tagline: "Modern dining hub",
    description: "Contemporary restaurants and cafes",
    icon: Coffee,
    gradient: "from-[#02A65C] to-[#01BEFF]",
    restaurantCount: 28,
    featured: false,
  },
  {
    id: "bluewaters",
    name: "Bluewaters Island",
    tagline: "Dining at Ain Dubai",
    description: "Entertainment island restaurants",
    icon: Globe,
    gradient: "from-[#F94498] to-[#FDA9E5]",
    restaurantCount: 15,
    featured: false,
  },
  {
    id: "dubai-hills",
    name: "Dubai Hills",
    tagline: "Mall and golf club dining",
    description: "Family-friendly restaurants",
    icon: Leaf,
    gradient: "from-[#02A65C] to-[#59ED63]",
    restaurantCount: 20,
    featured: false,
  },
];

const CUISINE_TYPES = [
  { id: "fine-dining", label: "Fine Dining", icon: ChefHat },
  { id: "japanese", label: "Japanese", icon: Fish },
  { id: "italian", label: "Italian", icon: Utensils },
  { id: "steakhouse", label: "Steakhouse", icon: Flame },
  { id: "seafood", label: "Seafood", icon: Fish },
  { id: "arabic", label: "Arabic", icon: Globe },
  { id: "asian", label: "Asian Fusion", icon: Globe },
  { id: "french", label: "French", icon: Wine },
];

const FEATURED_RESTAURANTS = [
  {
    name: "At.mosphere",
    location: "Downtown Dubai",
    tagline: "Dining at the world's highest restaurant",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=1000&fit=crop",
    cuisine: "European Fine Dining",
    label: "Iconic",
    priceRange: "$$$$",
  },
  {
    name: "Zuma",
    location: "DIFC",
    tagline: "Contemporary Japanese izakaya",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
    cuisine: "Japanese",
    label: "Award-Winning",
    priceRange: "$$$$",
  },
  {
    name: "Pierchic",
    location: "Jumeirah",
    tagline: "Overwater seafood dining",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop",
    cuisine: "Seafood",
    label: "Romantic",
    priceRange: "$$$$",
  },
  {
    name: "La Petite Maison",
    location: "DIFC",
    tagline: "French-Mediterranean elegance",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
    cuisine: "French",
    label: "Celebrity Favorite",
    priceRange: "$$$$",
  },
];

function DistrictCard({ district, onClick, isActive }: { 
  district: typeof DUBAI_DINING_DISTRICTS[0]; 
  onClick: () => void;
  isActive: boolean;
}) {
  const Icon = district.icon;
  
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl p-4 md:p-5 text-left transition-all duration-300 w-full ${
        isActive 
          ? 'ring-2 ring-primary shadow-lg scale-105' 
          : 'hover:shadow-md'
      }`}
      data-testid={`card-district-${district.id}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${district.gradient} opacity-90`} />
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
      
      <div className="relative z-10">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/20 flex items-center justify-center mb-3">
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <h3 className="font-bold text-white text-sm md:text-base mb-1">{district.name}</h3>
        <p className="text-white/80 text-xs md:text-sm line-clamp-2">{district.tagline}</p>
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <Badge className="bg-white/20 text-white border-0 text-xs">
            {district.restaurantCount}+ restaurants
          </Badge>
        </div>
      </div>
    </button>
  );
}

function FeaturedRestaurantCard({ restaurant, featured = false }: { 
  restaurant: typeof FEATURED_RESTAURANTS[0]; 
  featured?: boolean;
}) {
  return (
    <Card 
      className={`group overflow-visible border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer relative ${
        featured ? 'col-span-1 md:col-span-2 row-span-2' : ''
      }`}
      data-testid={`card-featured-restaurant-${restaurant.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className={`overflow-hidden rounded-lg ${featured ? 'aspect-[4/5]' : 'aspect-[4/3]'}`}>
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-lg" />
        
        {restaurant.label && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary text-primary-foreground">
              {restaurant.label}
            </Badge>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm text-xs">
              {restaurant.cuisine}
            </Badge>
            <span className="text-amber-400 text-xs font-medium">{restaurant.priceRange}</span>
          </div>
          
          <h3 className={`font-bold text-white mb-1 ${featured ? 'text-xl md:text-2xl' : 'text-base md:text-lg'}`}>
            {restaurant.name}
          </h3>
          
          <div className="flex items-center gap-1 text-white/70 text-xs mb-2">
            <MapPin className="w-3 h-3" />
            <span>{restaurant.location}</span>
          </div>
          
          <p className="text-white/80 text-xs md:text-sm line-clamp-2 mb-3">
            {restaurant.tagline}
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

function RestaurantCard({ content, index }: { content: ContentWithRelations; index: number }) {
  const defaultImages = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop",
  ];
  const imageUrl = content.heroImage || defaultImages[index % defaultImages.length];
  const location = content.dining?.location || "Dubai";
  const cuisineType = content.dining?.cuisineType || "Fine Dining";
  const priceRange = content.dining?.priceRange || "$$$";
  
  return (
    <Link href={`/dining/${content.slug}`}>
      <Card 
        className="group overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
        data-testid={`card-restaurant-${content.slug}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={imageUrl} 
            alt={content.heroImageAlt || content.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="font-semibold text-white text-sm md:text-base line-clamp-1 group-hover:text-white transition-colors">
              {content.title}
            </h3>
            <div className="flex items-center gap-1 text-xs text-white/70 mt-1">
              <MapPin className="w-3 h-3" />
              <span className="line-clamp-1">{location}</span>
            </div>
          </div>
        </div>
        
        <div className="p-3 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs">
              {cuisineType}
            </Badge>
          </div>
          <span className="text-xs text-amber-600 font-medium whitespace-nowrap">
            {priceRange}
          </span>
        </div>
      </Card>
    </Link>
  );
}

function CuisineCard({ cuisine }: { cuisine: typeof CUISINE_TYPES[0] }) {
  const Icon = cuisine.icon;
  
  return (
    <button
      className="group overflow-hidden border hover-elevate cursor-pointer p-4 text-center rounded-xl bg-card"
      data-testid={`card-cuisine-${cuisine.id}`}
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-medium text-sm">{cuisine.label}</h3>
    </button>
  );
}

export default function PublicDining() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDistrict, setActiveDistrict] = useState<string | null>(null);
  
  useDocumentMeta({
    title: "Best Restaurants in Dubai by Area | Travi - Dubai Travel Guide",
    description: "Discover Dubai's finest restaurants by neighborhood. From DIFC fine dining to Marina waterfront cafes, find your perfect dining experience.",
    ogTitle: "Best Restaurants in Dubai | Travi",
    ogDescription: "Explore world-class dining across Dubai's most vibrant neighborhoods.",
    ogType: "website",
  });
  
  const { data: allContent, isLoading } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/public/contents?includeExtensions=true"],
  });

  const restaurants = allContent?.filter(c => c.type === "dining") || [];
  
  const filteredRestaurants = useMemo(() => {
    let filtered = restaurants;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(query) ||
        r.metaDescription?.toLowerCase().includes(query) ||
        r.dining?.location?.toLowerCase().includes(query) ||
        r.dining?.cuisineType?.toLowerCase().includes(query)
      );
    }
    
    if (activeDistrict) {
      const districtInfo = DUBAI_DINING_DISTRICTS.find(d => d.id === activeDistrict);
      if (districtInfo) {
        const districtName = districtInfo.name.toLowerCase();
        filtered = filtered.filter(r => 
          r.dining?.location?.toLowerCase().includes(districtName) ||
          r.dining?.location?.toLowerCase().includes(activeDistrict)
        );
      }
    }
    
    return filtered;
  }, [restaurants, searchQuery, activeDistrict]);

  const handleDistrictClick = (districtId: string) => {
    setActiveDistrict(activeDistrict === districtId ? null : districtId);
  };

  const totalRestaurants = restaurants.length || 150;
  const featuredDistricts = DUBAI_DINING_DISTRICTS.filter(d => d.featured);

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=1080&fit=crop"
            alt="Dubai restaurant dining"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm mb-4">
            {totalRestaurants}+ Restaurants
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
            The home of
            <span className="block bg-gradient-to-r from-[#FF9327] to-[#F94498] bg-clip-text text-transparent">
              Dubai dining
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            From award-winning fine dining to hidden gems, discover the culinary experiences that make Dubai a world-class food destination.
          </p>
          
          <div className="max-w-xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 flex items-center gap-2 border border-white/20">
              <Search className="w-5 h-5 text-white/60 ml-3" />
              <input
                type="text"
                placeholder="Search restaurants, cuisines, or areas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none py-3 text-white placeholder:text-white/50"
                data-testid="input-search-dining"
              />
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-6 h-6 text-white/60 rotate-90" />
        </div>
      </section>

      <main className="flex-1">
        {/* Section: Explore by District */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Explore by District</h2>
              <p className="text-muted-foreground">Find restaurants in Dubai's most vibrant neighborhoods</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {DUBAI_DINING_DISTRICTS.map((district) => (
                <DistrictCard 
                  key={district.id} 
                  district={district} 
                  isActive={activeDistrict === district.id}
                  onClick={() => handleDistrictClick(district.id)}
                />
              ))}
            </div>
            
            {activeDistrict && (
              <div className="mt-6 text-center">
                <Button 
                  variant="ghost" 
                  onClick={() => setActiveDistrict(null)}
                  data-testid="button-clear-district-filter"
                >
                  Clear filter
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Section: Featured Restaurants (only when no filter) */}
        {!activeDistrict && !searchQuery && (
          <section className="py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-1">Featured Restaurants</h2>
                  <p className="text-muted-foreground">Hand-picked dining experiences</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <FeaturedRestaurantCard restaurant={FEATURED_RESTAURANTS[0]} featured />
                <div className="grid grid-cols-1 gap-4 md:gap-6 md:col-span-1 lg:col-span-2">
                  {FEATURED_RESTAURANTS.slice(1, 4).map((restaurant) => (
                    <FeaturedRestaurantCard key={restaurant.name} restaurant={restaurant} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Section: Browse by Cuisine (only when no filter) */}
        {!activeDistrict && !searchQuery && (
          <section className="py-12 md:py-16 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Browse by Cuisine</h2>
                <p className="text-muted-foreground">Find your perfect flavor</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {CUISINE_TYPES.map((cuisine) => (
                  <CuisineCard key={cuisine.id} cuisine={cuisine} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Section: All Restaurants / Filtered Results */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-1">
                  {activeDistrict 
                    ? `${DUBAI_DINING_DISTRICTS.find(d => d.id === activeDistrict)?.name} Restaurants`
                    : searchQuery 
                      ? "Search Results"
                      : "All Restaurants"}
                </h2>
                <p className="text-muted-foreground">
                  {isLoading ? "Loading..." : `${filteredRestaurants.length} restaurants found`}
                </p>
              </div>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/3] bg-muted rounded-lg mb-2" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : filteredRestaurants.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredRestaurants.map((restaurant, index) => (
                  <RestaurantCard key={restaurant.id} content={restaurant} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No restaurants found</h3>
                <p className="text-muted-foreground mb-6">Try a different search or filter</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("");
                    setActiveDistrict(null);
                  }}
                  data-testid="button-clear-filters"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
