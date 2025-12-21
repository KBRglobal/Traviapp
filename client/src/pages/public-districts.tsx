import { useQuery } from "@tanstack/react-query";
import { MapPin, Search, Map } from "lucide-react";
import type { Content } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { PageContainer, Section, CategoryGrid, ContentCard } from "@/components/public-layout";
import { PublicHero } from "@/components/public-hero";

const defaultImages = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&h=1000&fit=crop",
];

function DistrictCard({ content, index }: { content: Content; index: number }) {
  const imageUrl = content.heroImage || defaultImages[index % defaultImages.length];

  return (
    <ContentCard
      image={imageUrl}
      title={content.title}
      description={content.metaDescription || ""}
      href={`/districts/${content.slug}`}
      aspectRatio="portrait"
      showGradientOverlay={true}
    />
  );
}

export default function PublicDistricts() {
  const { t, isRTL } = useLocale();
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
    <PageContainer navVariant="transparent">
      <PublicHero
        title="Dubai Districts"
        subtitle="Explore the diverse neighborhoods that make Dubai unique"
        backgroundImage="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Districts" }
        ]}
        size="default"
      >
        <div className="w-full max-w-xl">
          <div className="relative">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 ${isRTL ? 'right-4' : 'left-4'}`} />
            <input
              type="text"
              placeholder={t('nav.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-background/10 backdrop-blur-md border border-white/20 rounded-2xl py-3 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-white placeholder:text-white/50 outline-none focus:border-white/40 transition-colors`}
              data-testid="input-search-districts"
            />
          </div>
        </div>
      </PublicHero>

      <Section
        id="districts-grid"
        title={searchQuery ? t('search.results') : t('districts.pageTitle')}
        subtitle={isLoading ? t('common.loading') : `${filteredDistricts.length} ${t('districts.pageTitle').toLowerCase()}`}
        variant="default"
      >
        {isLoading ? (
          <CategoryGrid columns={4}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-muted rounded-[16px]" />
              </div>
            ))}
          </CategoryGrid>
        ) : filteredDistricts.length > 0 ? (
          <CategoryGrid columns={4}>
            {filteredDistricts.map((district, index) => (
              <DistrictCard key={district.id} content={district} index={index} />
            ))}
          </CategoryGrid>
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
      </Section>

      <Section
        id="explore-cta"
        variant="alternate"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-travi-purple/10 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <MapPin className="w-16 h-16 mx-auto text-travi-purple mb-6" />
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                Discover Dubai's Neighborhoods
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                From the historic charm of Old Dubai to the modern luxury of Palm Jumeirah, 
                each district offers a unique experience waiting to be explored.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge className="px-6 py-3 text-base" variant="secondary">
                  <MapPin className="w-4 h-4 mr-2 text-travi-purple" />
                  15+ Unique Districts
                </Badge>
                <Badge className="px-6 py-3 text-base" variant="secondary">
                  <Map className="w-4 h-4 mr-2 text-travi-orange" />
                  Diverse Experiences
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </PageContainer>
  );
}
