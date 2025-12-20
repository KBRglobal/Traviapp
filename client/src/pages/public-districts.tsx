import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  MapPin, Search, ArrowRight, Map
} from "lucide-react";
import type { Content } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { useState, useMemo } from "react";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { useLocale } from "@/lib/i18n/LocaleRouter";

const defaultImages = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&h=1000&fit=crop",
];

function DistrictCard({ content, index }: { content: Content; index: number }) {
  const { t, localePath } = useLocale();
  const imageUrl = content.heroImage || defaultImages[index % defaultImages.length];

  return (
    <Link href={localePath(`/districts/${content.slug}`)}>
      <Card 
        className="group overflow-visible border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
        data-testid={`card-district-${content.slug}`}
      >
        <div className="overflow-hidden rounded-lg aspect-[3/4]">
          <img 
            src={imageUrl} 
            alt={content.heroImageAlt || content.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-lg" />
          
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
            <h3 className="font-bold text-white text-lg md:text-xl mb-1">
              {content.title}
            </h3>
            
            {content.metaDescription && (
              <p className="text-white/80 text-xs md:text-sm line-clamp-2 mb-3">
                {content.metaDescription}
              </p>
            )}
            
            <div className="flex items-center gap-2 text-white font-medium text-sm group-hover:gap-3 transition-all">
              <span>{t('districts.explore')}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function PublicDistricts() {
  const { t, locale, isRTL, localePath } = useLocale();
  const [searchQuery, setSearchQuery] = useState("");

  useDocumentMeta({
    title: "Dubai Neighborhoods & Districts | Travi - Dubai Travel Guide",
    description: "Explore Dubai's diverse neighborhoods. From Palm Jumeirah to Downtown, find the perfect district for your lifestyle or travel.",
    ogTitle: "Dubai Neighborhoods & Districts | Travi",
    ogDescription: "Discover the unique character of each Dubai neighborhood.",
    ogType: "website",
  });
  
  const { data: allContent, isLoading } = useQuery<Content[]>({
    queryKey: ["/api/public/contents"],
  });

  const districts = allContent?.filter(c => c.type === "district") || [];
  
  const filteredDistricts = useMemo(() => {
    if (!searchQuery) return districts;
    
    const query = searchQuery.toLowerCase();
    return districts.filter(d => 
      d.title.toLowerCase().includes(query) ||
      d.metaDescription?.toLowerCase().includes(query)
    );
  }, [districts, searchQuery]);

  return (
    <div className="bg-background min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <PublicNav />

      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            {t('districts.pageTitle')}
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            {t('districts.pageSubtitle')}
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
                data-testid="input-search-districts"
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
                {searchQuery ? t('search.results') : t('districts.pageTitle')}
              </h2>
              <p className="text-muted-foreground">
                {isLoading ? t('common.loading') : `${filteredDistricts.length} ${t('districts.pageTitle').toLowerCase()}`}
              </p>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-muted rounded-lg" />
                </div>
              ))}
            </div>
          ) : filteredDistricts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDistricts.map((district, index) => (
                <DistrictCard key={district.id} content={district} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Map className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('search.noResults')}</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? t('search.tryAgain') : "Districts will appear here once published"}
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
