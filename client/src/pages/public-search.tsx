import { useQuery } from "@tanstack/react-query";
import { Link, useSearch } from "wouter";
import { Search, MapPin, Building2, Mountain, BookOpen, UtensilsCrossed, Map, Train, Sparkles, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageContainer, Section } from "@/components/public-layout";
import { useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchResult {
  contentId: string;
  title: string;
  contentType: string;
  metaDescription: string | null;
  url: string;
  image: string | null;
  score: number;
  highlights?: string[];
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
  query: string;
  intent?: {
    type: string;
    confidence: number;
  };
  searchTime: number;
}

const defaultPlaceholderImages = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1546412414-e1885259563a?w=600&h=400&fit=crop",
];

function getTypeIcon(type: string) {
  switch (type) {
    case 'hotel': return Building2;
    case 'attraction': return Mountain;
    case 'article': return BookOpen;
    case 'dining': return UtensilsCrossed;
    case 'district': return Map;
    case 'transport': return Train;
    default: return MapPin;
  }
}

function getTypeColor(type: string): string {
  switch (type) {
    case 'hotel': return 'bg-travi-orange/10 text-travi-orange';
    case 'attraction': return 'bg-sky-500/10 text-sky-600';
    case 'article': return 'bg-travi-green/10 text-travi-green';
    case 'dining': return 'bg-travi-pink/10 text-travi-pink';
    case 'district': return 'bg-travi-purple/10 text-travi-purple';
    case 'transport': return 'bg-cyan-500/10 text-cyan-600';
    default: return 'bg-muted text-muted-foreground';
  }
}

function getContentPath(type: string, slug: string) {
  switch (type) {
    case 'dining': return `/dining/${slug}`;
    case 'district': return `/districts/${slug}`;
    case 'transport': return `/transport/${slug}`;
    default: return `/${type}s/${slug}`;
  }
}

function SearchResultCard({ result, index }: { result: SearchResult; index: number }) {
  const { localePath } = useLocale();
  const imageUrl = result.image || defaultPlaceholderImages[index % defaultPlaceholderImages.length];
  const TypeIcon = getTypeIcon(result.contentType);
  const contentPath = result.url || getContentPath(result.contentType, result.contentId);
  const typeColorClass = getTypeColor(result.contentType);

  return (
    <Link href={localePath(contentPath)}>
      <Card 
        className="group overflow-visible bg-card rounded-[16px] shadow-[var(--shadow-level-1)] hover-elevate transition-all duration-300 flex flex-col sm:flex-row"
        data-testid={`search-result-${result.contentId}`}
      >
        <div className="sm:w-56 md:w-64 aspect-video sm:aspect-auto sm:h-44 overflow-hidden rounded-t-[16px] sm:rounded-l-[16px] sm:rounded-tr-none shrink-0">
          <img
            src={imageUrl}
            alt={result.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge 
              variant="secondary" 
              className={`text-xs font-medium capitalize ${typeColorClass}`}
            >
              <TypeIcon className="w-3 h-3 mr-1" />
              {result.contentType}
            </Badge>
            {result.score > 0.8 && (
              <Badge variant="outline" className="text-xs text-travi-purple border-travi-purple/30">
                <Sparkles className="w-3 h-3 mr-1" />
                Best Match
              </Badge>
            )}
          </div>
          <h3 className="font-heading font-semibold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-travi-purple transition-colors">
            {result.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
            {result.metaDescription || "Explore this amazing destination in Dubai."}
          </p>
        </div>
      </Card>
    </Link>
  );
}

function SearchResultSkeleton() {
  return (
    <Card className="overflow-hidden rounded-[16px] animate-pulse flex flex-col sm:flex-row">
      <div className="sm:w-56 md:w-64 aspect-video sm:aspect-auto sm:h-44 bg-muted shrink-0 rounded-t-[16px] sm:rounded-l-[16px] sm:rounded-tr-none" />
      <div className="p-5 flex-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-5 w-20 bg-muted rounded-full" />
          <div className="h-5 w-16 bg-muted rounded-full" />
        </div>
        <div className="h-6 bg-muted rounded w-3/4 mb-2" />
        <div className="h-4 bg-muted rounded w-full mb-1" />
        <div className="h-4 bg-muted rounded w-2/3" />
      </div>
    </Card>
  );
}

export default function PublicSearch() {
  const { t, locale, isRTL, localePath } = useLocale();
  const searchParams = useSearch();
  const urlParams = new URLSearchParams(searchParams);
  const initialQuery = urlParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const debouncedQuery = useDebounce(searchQuery, 300);

  const { data: searchResponse, isLoading, isFetching } = useQuery<SearchResponse>({
    queryKey: ["/api/search", debouncedQuery, locale],
    queryFn: async () => {
      if (!debouncedQuery.trim()) {
        return { results: [], total: 0, page: 1, limit: 20, query: "", searchTime: 0 };
      }
      const params = new URLSearchParams({
        q: debouncedQuery,
        limit: "20",
        ...(locale && { locale }),
      });
      const response = await fetch(`/api/search?${params}`);
      if (!response.ok) {
        throw new Error("Search failed");
      }
      return response.json();
    },
    enabled: debouncedQuery.trim().length > 0,
    staleTime: 30000,
  });

  const searchResults = searchResponse?.results || [];

  return (
    <PageContainer navVariant="default">
      {/* Search Hero Section */}
      <section 
        className="pt-28 pb-12 bg-gradient-to-br from-travi-purple/10 via-travi-pink/5 to-travi-orange/10 dark:from-travi-purple/20 dark:via-travi-pink/10 dark:to-travi-orange/20"
        data-testid="section-search-hero"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
              {t('search.pageTitle')}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('search.searchIn') || "Find attractions, hotels, restaurants, and more"}
            </p>
          </div>

          {/* Search Input */}
          <div className="bg-card rounded-[16px] shadow-[var(--shadow-level-2)] p-2 flex items-center gap-2 border border-border">
            <div className="flex-1 flex items-center gap-3 px-4">
              <Search className="w-5 h-5 text-travi-purple shrink-0" aria-hidden="true" />
              <input
                type="text"
                placeholder={t('nav.searchPlaceholder') || "Search Dubai..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none py-3 text-foreground placeholder:text-muted-foreground text-base"
                data-testid="input-search"
                autoFocus
              />
            </div>
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSearchQuery("")}
                className="text-muted-foreground"
                data-testid="button-clear-search"
              >
                {t('common.clear') || "Clear"}
              </Button>
            )}
          </div>

          {/* AI-powered badge */}
          {searchResponse?.intent && searchResponse.intent.confidence > 0.7 && (
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-travi-purple">
              <Sparkles className="w-4 h-4" />
              <span>{t('search.aiPowered') || "AI-powered smart search"}</span>
            </div>
          )}
        </div>
      </section>

      {/* Search Results Section */}
      <Section variant="default" className="py-12">
        <div className="max-w-4xl mx-auto">
          {!searchQuery.trim() ? (
            /* Empty State - No Query */
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="font-heading text-xl font-semibold text-foreground mb-2">
                {t('search.startSearching') || "Start Searching"}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {t('search.enterQuery') || "Enter a search term to find hotels, attractions, restaurants and more in Dubai."}
              </p>
              
              {/* Quick Links */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link href={localePath("/hotels")}>
                  <Button variant="outline" className="gap-2">
                    <Building2 className="w-4 h-4" />
                    {t('nav.hotels')}
                  </Button>
                </Link>
                <Link href={localePath("/attractions")}>
                  <Button variant="outline" className="gap-2">
                    <Mountain className="w-4 h-4" />
                    {t('nav.attractions')}
                  </Button>
                </Link>
                <Link href={localePath("/dining")}>
                  <Button variant="outline" className="gap-2">
                    <UtensilsCrossed className="w-4 h-4" />
                    {t('nav.dining')}
                  </Button>
                </Link>
                <Link href={localePath("/districts")}>
                  <Button variant="outline" className="gap-2">
                    <Map className="w-4 h-4" />
                    {t('nav.districts')}
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-muted-foreground">
                  {isLoading || isFetching ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-travi-purple border-t-transparent rounded-full animate-spin" />
                      {t('common.loading') || "Searching..."}
                    </span>
                  ) : (
                    <>
                      <span className="font-semibold text-foreground">{searchResponse?.total || 0}</span>
                      {' '}{t('search.results') || "results for"}{' '}
                      <span className="font-semibold text-foreground">"{debouncedQuery}"</span>
                      {searchResponse?.searchTime && (
                        <span className="text-xs ml-2 text-muted-foreground/70">
                          ({searchResponse.searchTime}ms)
                        </span>
                      )}
                    </>
                  )}
                </p>
              </div>

              {/* Results List */}
              {isLoading ? (
                <div className="space-y-6">
                  {[0, 1, 2].map((index) => (
                    <SearchResultSkeleton key={index} />
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-6">
                  {searchResults.map((result, index) => (
                    <SearchResultCard key={result.contentId} result={result} index={index} />
                  ))}
                </div>
              ) : (
                /* No Results State */
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                    <SearchX className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-2">
                    {t('search.noResults') || "No results found"}
                  </h2>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    {t('search.tryAgain') || "Try adjusting your search terms or browse our categories below."}
                  </p>
                  
                  {/* Browse Categories */}
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link href={localePath("/hotels")}>
                      <Button variant="outline" className="gap-2">
                        <Building2 className="w-4 h-4" />
                        {t('nav.hotels')}
                      </Button>
                    </Link>
                    <Link href={localePath("/attractions")}>
                      <Button variant="outline" className="gap-2">
                        <Mountain className="w-4 h-4" />
                        {t('nav.attractions')}
                      </Button>
                    </Link>
                    <Link href={localePath("/news")}>
                      <Button variant="outline" className="gap-2">
                        <BookOpen className="w-4 h-4" />
                        {t('nav.news')}
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Section>
    </PageContainer>
  );
}
