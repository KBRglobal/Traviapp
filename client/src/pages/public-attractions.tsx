import { Link } from "wouter";
import {
  MapPin, Star, Building2, Ship,
  TreePine, Waves, ChevronRight, ArrowRight,
  Sun, Eye, ShoppingBag,
  Fish, Wind, Umbrella, Theater,
  Car, ChefHat, Loader2
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { PageContainer, Section, CategoryGrid, ContentCard } from "@/components/public-layout";
import { PublicHero } from "@/components/public-hero";
import { useQuery } from "@tanstack/react-query";

// Types for API response
interface ApiAttraction {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  status: string;
  type: string;
  attraction?: {
    category?: string;
    location?: string;
    priceFrom?: string;
    duration?: string;
    introText?: string;
  };
}

interface Attraction {
  id: number | string;
  name: string;
  category: string;
  description: string;
  location: string;
  slug?: string;
  image?: string;
}

interface CategoryData {
  id: string;
  name: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  image: string;
  description: string;
  attractions: Attraction[];
}

// Category metadata for display
const CATEGORY_METADATA: Record<string, {
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  image: string;
  description: string;
}> = {
  "observation-landmarks": {
    icon: Eye,
    gradient: "from-accent to-warning",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
    description: "Experience Dubai from breathtaking heights with world-record observation decks"
  },
  "theme-parks": {
    icon: Star,
    gradient: "from-primary to-primary/60",
    image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?w=800&h=600&fit=crop",
    description: "World-class indoor and outdoor entertainment for all ages"
  },
  "water-parks": {
    icon: Waves,
    gradient: "from-info to-secondary",
    image: "https://images.unsplash.com/photo-1582654454409-778f6619e0e2?w=800&h=600&fit=crop",
    description: "Year-round aquatic thrills at world-class water parks"
  },
  "museums-cultural": {
    icon: Building2,
    gradient: "from-secondary to-secondary/70",
    image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&h=600&fit=crop",
    description: "Discover Dubai's rich heritage and cutting-edge digital art experiences"
  },
  "zoos-aquariums": {
    icon: Fish,
    gradient: "from-success to-success/60",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
    description: "Meet marine life and exotic animals from around the world"
  },
  "parks-gardens": {
    icon: TreePine,
    gradient: "from-success to-info",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&h=600&fit=crop",
    description: "Stunning floral displays and natural escapes in the desert"
  },
  "desert-adventures": {
    icon: Sun,
    gradient: "from-accent to-accent/50",
    image: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800&h=600&fit=crop",
    description: "Thrilling dune experiences and authentic Bedouin culture"
  },
  "cruises-boats": {
    icon: Ship,
    gradient: "from-info to-secondary/70",
    image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&h=600&fit=crop",
    description: "Scenic water journeys from traditional dhows to luxury yachts"
  },
  "aerial-extreme": {
    icon: Wind,
    gradient: "from-primary to-secondary",
    image: "https://images.unsplash.com/photo-1503891617560-5b8c2e28cbf6?w=800&h=600&fit=crop",
    description: "Heart-pumping experiences from skydiving to ziplines"
  },
  "water-sports": {
    icon: Umbrella,
    gradient: "from-info to-success",
    image: "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=800&h=600&fit=crop",
    description: "Every water activity imaginable along Dubai's stunning coastline"
  },
  "entertainment-shows": {
    icon: Theater,
    gradient: "from-secondary to-primary",
    image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&h=600&fit=crop",
    description: "World-class performances and entertainment venues"
  },
  "shopping": {
    icon: ShoppingBag,
    gradient: "from-accent to-primary",
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=600&fit=crop",
    description: "From mega malls to traditional souks - a shopper's paradise"
  },
  "dining-experiences": {
    icon: ChefHat,
    gradient: "from-primary to-warning",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
    description: "Extraordinary culinary experiences from sky-high to underwater"
  },
  "day-trips": {
    icon: Car,
    gradient: "from-success to-secondary",
    image: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop",
    description: "Explore Abu Dhabi's mega-attractions and the Hajar Mountains"
  },
  // Default for uncategorized
  "other": {
    icon: Star,
    gradient: "from-muted to-muted/60",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
    description: "More amazing attractions to discover"
  }
};

// Map API category to our category IDs
function mapCategoryToId(category?: string): string {
  if (!category) return "other";
  const categoryLower = category.toLowerCase();

  if (categoryLower.includes("observation") || categoryLower.includes("landmark") || categoryLower.includes("view")) {
    return "observation-landmarks";
  }
  if (categoryLower.includes("theme") || categoryLower.includes("park") && !categoryLower.includes("water")) {
    return "theme-parks";
  }
  if (categoryLower.includes("water") && categoryLower.includes("park")) {
    return "water-parks";
  }
  if (categoryLower.includes("museum") || categoryLower.includes("cultural") || categoryLower.includes("art")) {
    return "museums-cultural";
  }
  if (categoryLower.includes("zoo") || categoryLower.includes("aquarium") || categoryLower.includes("wildlife")) {
    return "zoos-aquariums";
  }
  if (categoryLower.includes("garden") || categoryLower.includes("park")) {
    return "parks-gardens";
  }
  if (categoryLower.includes("desert") || categoryLower.includes("safari") || categoryLower.includes("dune")) {
    return "desert-adventures";
  }
  if (categoryLower.includes("cruise") || categoryLower.includes("boat") || categoryLower.includes("yacht") || categoryLower.includes("dhow")) {
    return "cruises-boats";
  }
  if (categoryLower.includes("aerial") || categoryLower.includes("skydiv") || categoryLower.includes("zipline") || categoryLower.includes("extreme")) {
    return "aerial-extreme";
  }
  if (categoryLower.includes("water") || categoryLower.includes("beach") || categoryLower.includes("diving")) {
    return "water-sports";
  }
  if (categoryLower.includes("entertainment") || categoryLower.includes("show") || categoryLower.includes("theater") || categoryLower.includes("cinema")) {
    return "entertainment-shows";
  }
  if (categoryLower.includes("shopping") || categoryLower.includes("mall") || categoryLower.includes("souk")) {
    return "shopping";
  }
  if (categoryLower.includes("dining") || categoryLower.includes("restaurant") || categoryLower.includes("food")) {
    return "dining-experiences";
  }
  if (categoryLower.includes("day trip") || categoryLower.includes("abu dhabi") || categoryLower.includes("excursion")) {
    return "day-trips";
  }

  return "other";
}

// Convert API attraction to display format
function mapApiToAttraction(item: ApiAttraction, index: number): Attraction {
  return {
    id: item.id || index + 1,
    name: item.title,
    category: item.attraction?.category || "Attraction",
    description: item.excerpt || item.attraction?.introText || item.content?.slice(0, 200) || "",
    location: item.attraction?.location || "Dubai",
    slug: item.slug,
    image: item.featuredImage,
  };
}

// Fetch attractions from API
async function fetchAttractions(): Promise<ApiAttraction[]> {
  const response = await fetch("/api/public/contents?type=attraction&limit=100");
  if (!response.ok) {
    throw new Error("Failed to fetch attractions");
  }
  return response.json();
}

function AttractionCard({ attraction, categoryGradient, slug }: { attraction: Attraction; categoryGradient: string; slug?: string }) {
  const { localePath } = useLocale();
  const content = (
    <Card
      className="group overflow-visible shadow-[var(--shadow-level-1)] hover-elevate transition-all duration-300 rounded-[16px]"
      data-testid={`card-attraction-${attraction.id}`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${categoryGradient} flex items-center justify-center flex-shrink-0`}>
            <span className="text-white font-bold text-sm">{typeof attraction.id === 'number' ? attraction.id : '★'}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-sm md:text-base line-clamp-2 mb-1">{attraction.name}</h4>
            <Badge variant="outline" className="text-xs">{attraction.category}</Badge>
          </div>
        </div>

        <p className="text-muted-foreground text-xs md:text-sm line-clamp-3 mb-3">
          {attraction.description}
        </p>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="line-clamp-1">{attraction.location}</span>
        </div>
      </div>
    </Card>
  );

  if (slug) {
    return (
      <Link href={localePath(`/attractions/${slug}`)}>
        {content}
      </Link>
    );
  }
  return content;
}

function CategorySection({ category, index }: { category: CategoryData; index: number }) {
  const Icon = category.icon;
  const [showAll, setShowAll] = useState(false);
  const displayedAttractions = showAll ? category.attractions : category.attractions.slice(0, 8);

  return (
    <Section id={category.id} variant={index % 2 === 0 ? "default" : "alternate"}>
      <div className="flex items-start gap-4 mb-8">
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h2 className="text-xl md:text-2xl font-bold">{category.name}</h2>
            <Badge variant="secondary" className="text-xs">{category.count} attractions</Badge>
          </div>
          <p className="text-muted-foreground text-sm md:text-base">{category.description}</p>
        </div>
      </div>

      <CategoryGrid columns={4}>
        {displayedAttractions.map((attraction) => (
          <AttractionCard
            key={attraction.id}
            attraction={attraction}
            categoryGradient={category.gradient}
            slug={attraction.slug}
          />
        ))}
      </CategoryGrid>

      {category.attractions.length > 8 && (
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => setShowAll(!showAll)}
            className="text-secondary hover:text-secondary/80"
            data-testid={`button-show-${showAll ? 'less' : 'more'}-${category.id}`}
          >
            {showAll ? 'Show Less' : `Show All ${category.count} Attractions`}
            <ChevronRight className={`w-4 h-4 transition-transform ${showAll ? 'rotate-90' : ''}`} />
          </Button>
        </div>
      )}
    </Section>
  );
}

export default function PublicAttractions() {
  const { isRTL, localePath } = useLocale();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Fetch attractions from database
  const { data: apiAttractions, isLoading, error } = useQuery({
    queryKey: ["public-attractions"],
    queryFn: fetchAttractions,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Group attractions by category
  const categories = useMemo(() => {
    if (!apiAttractions || apiAttractions.length === 0) {
      return []; // Return empty if no data from API
    }

    // Group by category
    const grouped: Record<string, Attraction[]> = {};

    apiAttractions.forEach((item, index) => {
      const categoryId = mapCategoryToId(item.attraction?.category);
      if (!grouped[categoryId]) {
        grouped[categoryId] = [];
      }
      grouped[categoryId].push(mapApiToAttraction(item, index));
    });

    // Convert to CategoryData array
    return Object.entries(grouped).map(([categoryId, attractions]) => {
      const metadata = CATEGORY_METADATA[categoryId] || CATEGORY_METADATA["other"];
      return {
        id: categoryId,
        name: categoryId.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        count: attractions.length,
        icon: metadata.icon,
        gradient: metadata.gradient,
        image: metadata.image,
        description: metadata.description,
        attractions,
      } as CategoryData;
    }).sort((a, b) => b.count - a.count); // Sort by count
  }, [apiAttractions]);

  // Calculate stats
  const totalAttractions = categories.reduce((sum, cat) => sum + cat.count, 0);
  const totalCategories = categories.length;

  const STATS = [
    { value: totalAttractions > 0 ? `${totalAttractions}+` : "Loading...", label: "Attractions" },
    { value: totalCategories > 0 ? totalCategories.toString() : "-", label: "Categories" },
    { value: "World's Best", label: "Theme Parks" },
    { value: "Free Entry", label: "Options Available" },
  ];

  useDocumentMeta({
    title: `${totalAttractions || 184}+ Dubai Attractions 2025 - Complete Tourist Guide | Travi`,
    description: `Discover all ${totalAttractions || 184}+ Dubai tourist attractions across ${totalCategories || 15} categories. From Burj Khalifa to desert safaris, theme parks to traditional souks - your complete Dubai guide.`,
    ogTitle: "Complete Dubai Attractions Catalog 2025 | Travi",
    ogDescription: `Explore ${totalAttractions || 184}+ attractions: Theme parks, observation decks, desert adventures, museums, water sports & more.`,
    ogType: "website",
  });

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveCategory(categoryId);
    }
  };

  // Featured attractions from database (first 6 with images)
  const featuredAttractions = useMemo(() => {
    if (!apiAttractions) return [];
    return apiAttractions
      .filter(a => a.featuredImage)
      .slice(0, 6)
      .map(a => ({
        name: a.title,
        tagline: a.excerpt || a.attraction?.introText || "",
        image: a.featuredImage || "",
        tags: [a.attraction?.category || "Attraction"],
        label: null,
        slug: a.slug,
      }));
  }, [apiAttractions]);

  return (
    <PageContainer navVariant="transparent">
      <PublicHero
        title="Dubai Attractions"
        subtitle="Discover world-class theme parks, observation decks, and cultural experiences"
        backgroundImage="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Attractions" }
        ]}
      >
        <div className="flex flex-wrap items-center gap-4">
          <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm text-sm px-4 py-1.5">
            Complete 2025 Catalog
          </Badge>
          <div className="flex flex-wrap gap-4 md:gap-8">
            {STATS.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-white/60 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        {categories.length > 0 && (
          <Button
            onClick={() => scrollToCategory(categories[0]?.id || 'featured')}
            className="mt-4 bg-secondary hover:bg-secondary/90 text-white rounded-full"
            data-testid="button-explore-catalog"
          >
            Explore Full Catalog
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </PublicHero>

      {/* Loading State */}
      {isLoading && (
        <div className="py-20 text-center">
          <Loader2 className="w-10 h-10 animate-spin mx-auto text-secondary mb-4" />
          <p className="text-muted-foreground">Loading attractions...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="py-20 text-center">
          <p className="text-muted-foreground mb-4">Unable to load attractions. Please try again later.</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      )}

      {/* Empty State - No published attractions */}
      {!isLoading && !error && categories.length === 0 && (
        <div className="py-20 text-center max-w-2xl mx-auto px-5">
          <Building2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Attractions Published Yet</h2>
          <p className="text-muted-foreground mb-6">
            Attractions will appear here once they are published from the admin panel.
            Check back soon for Dubai's best attractions!
          </p>
          <Link href={localePath("/")}>
            <Button variant="outline">
              Back to Home
            </Button>
          </Link>
        </div>
      )}

      {/* Content - Only show when we have data */}
      {!isLoading && categories.length > 0 && (
        <>
          {/* Category Quick Navigation */}
          <section className="py-4 bg-muted/30 sticky top-20 z-40 backdrop-blur-md border-b border-border/50">
            <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-[140px]">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => scrollToCategory(category.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                        activeCategory === category.id
                          ? 'bg-secondary text-white'
                          : 'bg-background border border-border hover:border-secondary/50 hover:text-secondary'
                      }`}
                      data-testid={`button-nav-${category.id}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{category.name}</span>
                      <Badge variant="secondary" className={`text-xs ${activeCategory === category.id ? 'bg-white/20 text-white' : ''}`}>
                        {category.count}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Featured Attractions */}
          {featuredAttractions.length > 0 && (
            <Section
              title="Featured Attractions"
              subtitle="Hand-picked must-visit experiences that define Dubai's extraordinary appeal"
              id="featured"
            >
              <div className="text-center mb-6">
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  Top Picks
                </Badge>
              </div>
              <CategoryGrid columns={3}>
                {featuredAttractions.map((attraction) => (
                  <Link key={attraction.name} href={localePath(`/attractions/${attraction.slug}`)}>
                    <ContentCard
                      image={attraction.image}
                      title={attraction.name}
                      description={attraction.tagline}
                      badge={attraction.label || undefined}
                      aspectRatio="video"
                    />
                  </Link>
                ))}
              </CategoryGrid>
            </Section>
          )}

          {/* Category Grid Overview */}
          <Section
            title="Browse by Category"
            subtitle={`${totalCategories} categories covering every type of Dubai experience`}
            variant="alternate"
            id="categories"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.id}
                    onClick={() => scrollToCategory(category.id)}
                    className="cursor-pointer group"
                  >
                    <Card
                      className="relative overflow-visible rounded-[16px] hover-elevate transition-all duration-300"
                      data-testid={`card-category-${category.id}`}
                    >
                      <div className="aspect-[4/3] overflow-hidden rounded-[16px]">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-70 mix-blend-multiply rounded-[16px]`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-[16px]" />
                      </div>

                      <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <h3 className="font-bold text-white text-sm md:text-base mb-1">{category.name}</h3>
                        <p className="text-white/80 text-xs md:text-sm">{category.count} attractions</p>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </Section>

          {/* All Category Sections */}
          {categories.map((category, index) => (
            <CategorySection key={category.id} category={category} index={index} />
          ))}

          {/* Bottom CTA */}
          <section className="py-16 md:py-24 bg-gradient-to-br from-secondary to-primary">
            <div className="max-w-4xl mx-auto px-5 md:px-8 lg:px-[140px] text-center">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                Ready to Explore Dubai?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                With {totalAttractions}+ attractions across {totalCategories} categories, Dubai offers something for everyone.
                Start planning your perfect Dubai adventure today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href={localePath("/hotels")}>
                  <Button variant="secondary" className="bg-white text-secondary hover:bg-white/90 rounded-full">
                    Find Hotels
                    <Building2 className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href={localePath("/districts")}>
                  <Button variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 rounded-full">
                    Explore Districts
                    <MapPin className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </PageContainer>
  );
}
