import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Search, MapPin, Utensils, ArrowRight
} from "lucide-react";
import type { ContentWithRelations } from "@shared/schema";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { useState, useMemo } from "react";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/LocaleRouter";

const defaultImages = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop",
];

function RestaurantCard({ content, index }: { content: ContentWithRelations; index: number }) {
  const { localePath } = useLocale();
  const imageUrl = content.heroImage || defaultImages[index % defaultImages.length];
  const location = content.dining?.location || "Dubai";
  const cuisineType = content.dining?.cuisineType || "Fine Dining";
  const priceRange = content.dining?.priceRange || "$$$";

  return (
    <Link href={localePath(`/dining/${content.slug}`)}>
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

export default function PublicDining() {
  const { t, locale, isRTL, localePath } = useLocale();
  const [searchQuery, setSearchQuery] = useState("");

  useDocumentMeta({
    title: "Best Restaurants in Dubai | Travi - Dubai Travel Guide",
    description: "Discover Dubai's finest restaurants. From fine dining to local gems, find your perfect dining experience.",
    ogTitle: "Best Restaurants in Dubai | Travi",
    ogDescription: "Explore world-class dining across Dubai's most vibrant neighborhoods.",
    ogType: "website",
  });
  
  const { data: allContent, isLoading } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/public/contents?includeExtensions=true"],
  });

  const restaurants = allContent?.filter(c => c.type === "dining") || [];
  
  const filteredRestaurants = useMemo(() => {
    if (!searchQuery) return restaurants;
    
    const query = searchQuery.toLowerCase();
    return restaurants.filter(r =>
      r.title.toLowerCase().includes(query) ||
      r.metaDescription?.toLowerCase().includes(query) ||
      r.dining?.location?.toLowerCase().includes(query) ||
      r.dining?.cuisineType?.toLowerCase().includes(query)
    );
  }, [restaurants, searchQuery]);

  return (
    <div className="bg-background min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <PublicNav />

      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=1080&fit=crop"
            alt="Dubai restaurant dining"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            {t('dining.pageTitle')}
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            {t('dining.pageSubtitle')}
          </p>
          
          <div className="max-w-xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 flex items-center gap-2 border border-white/20">
              <Search className="w-5 h-5 text-white/60 ml-3" />
              <input
                type="text"
                placeholder={t('nav.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none py-3 text-white placeholder:text-white/50"
                data-testid="input-search-dining"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-1">
                {searchQuery ? t('search.results') : t('dining.allRestaurants')}
              </h2>
              <p className="text-muted-foreground">
                {isLoading ? t('common.loading') : `${filteredRestaurants.length} ${t('dining.allRestaurants').toLowerCase()}`}
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
                <Utensils className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('search.noResults')}</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? t('search.tryAgain') : "Restaurants will appear here once published"}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                  data-testid="button-clear-search"
                >
                  {t('search.tryAgain')}
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
