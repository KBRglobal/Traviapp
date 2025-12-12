import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Clock, MapPin, Search, Ticket } from "lucide-react";
import type { ContentWithRelations } from "@shared/schema";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { CompactHero } from "@/components/image-hero";
import { useState } from "react";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const heroImage = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=600&fit=crop";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "museums", label: "Museums" },
  { id: "theme-parks", label: "Theme Parks" },
  { id: "zoos", label: "Zoos" },
  { id: "parks", label: "Parks" },
  { id: "water-parks", label: "Water Parks" },
  { id: "landmarks", label: "Landmarks" },
  { id: "observation-decks", label: "Observation Decks" },
  { id: "aquariums", label: "Aquariums" },
  { id: "immersive-experiences", label: "Immersive Experiences" },
  { id: "cruises", label: "Cruises" },
  { id: "tours", label: "Tours" },
];

const categoryImages: Record<string, string> = {
  "museums": "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&h=600&fit=crop",
  "theme-parks": "https://images.unsplash.com/photo-1513326738677-b964603b136d?w=800&h=600&fit=crop",
  "zoos": "https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=800&h=600&fit=crop",
  "parks": "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&h=600&fit=crop",
  "water-parks": "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=600&fit=crop",
  "landmarks": "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop",
  "observation-decks": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
  "aquariums": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
  "immersive-experiences": "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=600&fit=crop",
  "cruises": "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800&h=600&fit=crop",
  "tours": "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=800&h=600&fit=crop",
};

const defaultPlaceholderImages = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&h=600&fit=crop",
];

function AttractionCardSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="aspect-[4/3] bg-muted rounded-lg mb-4" />
      <div className="space-y-2">
        <div className="h-4 w-20 bg-muted rounded" />
        <div className="h-5 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-full" />
      </div>
    </div>
  );
}

interface AttractionCardProps {
  rank: number;
  title: string;
  description: string;
  image: string;
  href: string;
  category: string;
  location?: string;
  priceFrom?: string;
}

function AttractionCard({ rank, title, description, image, href, category, location, priceFrom }: AttractionCardProps) {
  return (
    <Link href={href}>
      <Card className="overflow-hidden hover-elevate cursor-pointer group h-full">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <Badge className="bg-white/90 text-foreground font-semibold">
              #{rank}
            </Badge>
            <Badge variant="secondary" className="bg-violet-600 text-white">
              {category}
            </Badge>
          </div>
          {priceFrom && (
            <div className="absolute bottom-3 right-3">
              <Badge className="bg-green-600 text-white flex items-center gap-1">
                <Ticket className="w-3 h-3" />
                From AED {priceFrom}
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-violet-600 transition-colors" data-testid={`text-attraction-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
          {location && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
              <MapPin className="w-3 h-3" />
              <span>{location}</span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}

export default function PublicAttractions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  useDocumentMeta({
    title: "Dubai Attractions & Things to Do | Travi - Dubai Travel Guide",
    description: "Discover the best attractions and things to do in Dubai. From the iconic Burj Khalifa to desert safaris, find unforgettable experiences in the city of dreams.",
    ogTitle: "Dubai Attractions & Things to Do | Travi",
    ogDescription: "Explore iconic landmarks, thrilling adventures, and unique experiences in Dubai.",
    ogType: "website",
  });
  
  const { data: allContent, isLoading } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/contents?status=published&includeExtensions=true"],
  });

  const attractions = allContent?.filter(c => c.type === "attraction") || [];
  
  const filteredAttractions = attractions.filter(a => {
    const matchesSearch = searchQuery 
      ? a.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    const attractionCategory = a.attraction?.category?.toLowerCase().replace(/\s+/g, '-') || '';
    const matchesCategory = selectedCategory === "all" || attractionCategory === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (id: string) => {
    return CATEGORIES.find(c => c.id === id)?.label || id;
  };

  const getAttractionImage = (attraction: ContentWithRelations, index: number) => {
    if (attraction.heroImage) return attraction.heroImage;
    const category = attraction.attraction?.category?.toLowerCase().replace(/\s+/g, '-') || '';
    return categoryImages[category] || defaultPlaceholderImages[index % defaultPlaceholderImages.length];
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>
      
      <PublicNav />

      <main id="main-content" className="flex-1">
        <CompactHero 
          backgroundImage={heroImage}
          title="Explore Dubai Attractions"
          subtitle="Discover unforgettable experiences and iconic landmarks"
        />

        <section className="py-8 bg-background" aria-label="Search and filter attractions">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <form role="search" onSubmit={(e) => e.preventDefault()} className="max-w-xl mb-6">
              <label htmlFor="attraction-search" className="sr-only">Search attractions</label>
              <div className="bg-card border rounded-lg p-2 flex items-center gap-2">
                <Search className="w-5 h-5 text-muted-foreground ml-3" aria-hidden="true" />
                <input
                  id="attraction-search"
                  type="text"
                  placeholder="Search attractions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none py-2 text-foreground"
                  data-testid="input-search-attractions"
                />
              </div>
            </form>

            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
              {CATEGORIES.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  role="tab"
                  aria-selected={selectedCategory === category.id}
                  data-testid={`button-category-${category.id}`}
                  className={selectedCategory === category.id ? "bg-violet-600 hover:bg-violet-700" : ""}
                >
                  {category.label}
                </Button>
              ))}
            </div>

            <p className="mt-4 text-muted-foreground text-sm" aria-live="polite" data-testid="text-attractions-count">
              {isLoading ? "Loading..." : `${filteredAttractions.length} attractions found`}
            </p>
          </div>
        </section>

        {isLoading ? (
          <section className="py-12" aria-label="Loading attractions">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <AttractionCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </section>
        ) : filteredAttractions.length > 0 ? (
          <section className="py-8" aria-labelledby="attractions-heading">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 id="attractions-heading" className="sr-only">
                {selectedCategory === "all" ? "All Attractions" : getCategoryLabel(selectedCategory)}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAttractions.map((attraction, index) => (
                  <AttractionCard
                    key={attraction.id}
                    rank={index + 1}
                    title={attraction.title}
                    description={attraction.metaDescription || "Discover this amazing attraction in Dubai."}
                    image={getAttractionImage(attraction, index)}
                    href={`/attractions/${attraction.slug}`}
                    category={attraction.attraction?.category || "Experience"}
                    location={attraction.attraction?.location || "Dubai, UAE"}
                    priceFrom={attraction.attraction?.priceFrom}
                  />
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="py-16" aria-label="No attractions found">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No attractions found</h2>
                <p className="text-muted-foreground mb-6">
                  {searchQuery 
                    ? `No attractions match "${searchQuery}". Try a different search term.`
                    : `No attractions in the ${getCategoryLabel(selectedCategory)} category yet.`
                  }
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  data-testid="button-clear-filters"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </section>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
