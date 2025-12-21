import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Search, MapPin, Star, Building2,
  ChevronRight, ArrowRight
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
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { LazyImage } from "@/components/ui/lazy-image";
import { FavoriteButton } from "@/components/ui/favorite-button";

const defaultImages = [
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
];

function HotelCard({ content, index, translation }: { 
  content: ContentWithRelations; 
  index: number;
  translation?: TranslatedContentData | null;
}) {
  const { localePath } = useLocale();
  const imageUrl = content.heroImage || defaultImages[index % defaultImages.length];
  const location = content.hotel?.location || "Dubai";
  const starRating = content.hotel?.starRating || 5;
  const displayTitle = translation?.title || content.title;
  const displayDescription = translation?.metaDescription || content.metaDescription;

  return (
    <Link href={localePath(`/hotels/${content.slug}`)}>
      <Card 
        className="group overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
        data-testid={`card-hotel-${content.slug}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={imageUrl} 
            alt={content.heroImageAlt || displayTitle}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(starRating)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <h3 className="font-semibold text-white text-base md:text-lg line-clamp-1 group-hover:text-white transition-colors">
              {displayTitle}
            </h3>
            <div className="flex items-center gap-1 text-xs text-white/70 mt-1">
              <MapPin className="w-3 h-3" />
              <span className="line-clamp-1">{location}</span>
            </div>
          </div>
        </div>
        
        {displayDescription && (
          <div className="p-4">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {displayDescription}
            </p>
          </div>
        )}
      </Card>
    </Link>
  );
}

export default function PublicHotels() {
  const { t, locale, isRTL, localePath } = useLocale();
  const [searchQuery, setSearchQuery] = useState("");

  useDocumentMeta({
    title: "Luxury Hotels in Dubai | Travi - Dubai Travel Guide",
    description: "Find the perfect Dubai hotel. From Palm Jumeirah resorts to Downtown high-rises, discover luxury hotels across Dubai.",
    ogTitle: "Luxury Hotels in Dubai | Travi",
    ogDescription: "Find your perfect stay in Dubai's most sought-after neighborhoods.",
    ogType: "website",
  });
  
  const { data: allContent, isLoading } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/public/contents?includeExtensions=true"],
  });

  const hotels = allContent?.filter(c => c.type === "hotel") || [];
  
  const { data: translationsMap } = useTranslatedContents(hotels);
  
  const filteredHotels = useMemo(() => {
    if (!searchQuery) return hotels;
    
    const query = searchQuery.toLowerCase();
    return hotels.filter(h => 
      h.title.toLowerCase().includes(query) ||
      h.metaDescription?.toLowerCase().includes(query) ||
      h.hotel?.location?.toLowerCase().includes(query)
    );
  }, [hotels, searchQuery]);

  return (
    <div className="bg-background min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <PublicNav />

      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&h=1080&fit=crop"
            alt="Dubai luxury hotels"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            {t('hotels.pageTitle')}
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            {t('hotels.pageSubtitle')}
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
                data-testid="input-search-hotels"
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
                {searchQuery ? t('search.results') : t('hotels.allHotels')}
              </h2>
              <p className="text-muted-foreground">
                {isLoading ? t('common.loading') : `${filteredHotels.length} ${t('hotels.pageTitle').toLowerCase()}`}
              </p>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-muted rounded-lg mb-2" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : filteredHotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map((hotel, index) => (
                <HotelCard 
                  key={hotel.id} 
                  content={hotel} 
                  index={index}
                  translation={translationsMap?.get(hotel.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('search.noResults')}</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? t('search.tryAgain') : "Hotels will appear here once published"}
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
