import { useQuery } from "@tanstack/react-query";
import { Link, useSearch } from "wouter";
import { Search, ArrowLeft, Star, MapPin, Building2, Mountain, BookOpen, UtensilsCrossed, Map, Train, Sparkles } from "lucide-react";
import type { Content } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { useState, useEffect, useMemo } from "react";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { useDebounce } from "@/hooks/use-debounce";

// Search API response types
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

  return (
    <Link href={localePath(contentPath)}>
      <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col sm:flex-row">
        <div className="sm:w-64 aspect-[16/10] sm:aspect-auto overflow-hidden shrink-0">
          <img
            src={imageUrl}
            alt={result.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-5 flex-1">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full font-medium capitalize flex items-center gap-1">
              <TypeIcon className="w-3 h-3" />
              {result.contentType}
            </span>
            {result.score > 0.8 && (
              <span className="flex items-center gap-1 text-primary">
                <Sparkles className="w-3.5 h-3.5" />
                Best Match
              </span>
            )}
          </div>
          <h3 className="font-heading font-semibold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {result.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {result.metaDescription || "Explore this amazing destination in Dubai."}
          </p>
        </div>
      </Card>
    </Link>
  );
}

function SearchResultSkeleton() {
  return (
    <Card className="overflow-hidden border-0 shadow-md animate-pulse flex flex-col sm:flex-row">
      <div className="sm:w-64 aspect-[16/10] sm:aspect-auto bg-muted shrink-0" />
      <div className="p-5 flex-1">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-5 w-20 bg-muted rounded-full" />
          <div className="h-4 w-12 bg-muted rounded" />
        </div>
        <div className="h-6 bg-muted rounded mb-2 w-3/4" />
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

  // Debounce search query for better UX
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Use the hybrid search API (full-text + semantic search)
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
    staleTime: 30000, // Cache for 30 seconds
  });

  const searchResults = searchResponse?.results || [];

  return (
    <div className="bg-background min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b" data-testid="nav-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo variant="primary" height={28} />
            <div className="hidden md:flex items-center gap-6">
              <Link href="/hotels" className="text-foreground/80 hover:text-primary font-medium transition-colors">Hotels</Link>
              <Link href="/attractions" className="text-foreground/80 hover:text-primary font-medium transition-colors">Attractions</Link>
              <Link href="/dining" className="text-foreground/80 hover:text-primary font-medium transition-colors">Dining</Link>
              <Link href="/districts" className="text-foreground/80 hover:text-primary font-medium transition-colors">Districts</Link>
              <Link href="/transport" className="text-foreground/80 hover:text-primary font-medium transition-colors">Transport</Link>
              <Link href="/articles" className="text-foreground/80 hover:text-primary font-medium transition-colors">News</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-primary via-primary/80 to-primary/60 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={localePath("/")} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t('common.viewAll')}
          </Link>

          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-6">{t('search.pageTitle')}</h1>
          
          <div className="bg-white rounded-xl p-2 flex items-center gap-2">
            <Search className="w-5 h-5 text-muted-foreground ml-3" />
            <input
              type="text"
              placeholder={t('nav.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none py-2 text-foreground"
              data-testid="input-search"
              autoFocus
            />
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {!searchQuery.trim() ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h2 className="font-heading text-xl font-semibold text-foreground mb-2">{t('search.searchIn')}</h2>
              <p className="text-muted-foreground">{t('search.pageTitle')}</p>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-muted-foreground">
                  {isLoading || isFetching ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-pulse">{t('common.loading')}</span>
                    </span>
                  ) : (
                    <>
                      {searchResponse?.total || 0} {t('search.results')} "{debouncedQuery}"
                      {searchResponse?.searchTime && (
                        <span className="text-xs ml-2">({searchResponse.searchTime}ms)</span>
                      )}
                    </>
                  )}
                </p>
                {searchResponse?.intent && searchResponse.intent.confidence > 0.7 && (
                  <span className="text-xs text-primary flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI-powered search
                  </span>
                )}
              </div>

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
                <div className="text-center py-16">
                  <Search className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-2">{t('search.noResults')}</h2>
                  <p className="text-muted-foreground mb-6">{t('search.tryAgain')}</p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link href={localePath("/hotels")}>
                      <Button variant="outline">{t('hotels.pageTitle')}</Button>
                    </Link>
                    <Link href={localePath("/attractions")}>
                      <Button variant="outline">Attractions</Button>
                    </Link>
                    <Link href={localePath("/articles")}>
                      <Button variant="outline">News</Button>
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <footer className="py-8 border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Logo variant="primary" height={28} />
            <div className="flex items-center gap-6 text-muted-foreground text-sm">
              <Link href="/hotels" className="hover:text-foreground transition-colors">Hotels</Link>
              <Link href="/attractions" className="hover:text-foreground transition-colors">Attractions</Link>
              <Link href="/articles" className="hover:text-foreground transition-colors">News</Link>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <span>2024 Travi</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
