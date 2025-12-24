import { useQuery } from "@tanstack/react-query";
import { Link, useSearch } from "wouter";
import { Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { useState, useEffect } from "react";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { SearchInput } from "@/components/search/SearchInput";
import { SearchResults } from "@/components/search/SearchResults";

interface SearchResponse {
  results: Array<{
    id: string;
    contentId: string;
    title: string;
    snippet: string;
    type: string;
    url: string;
    image?: string;
    score: number;
    highlights: {
      title?: string[];
      content?: string[];
    };
    metadata: {
      rating?: number;
      price?: string;
      location?: string;
    };
  }>;
  total: number;
  page: number;
  totalPages: number;
  query: {
    original: string;
    normalized: string;
    language: string;
    intent?: string;
  };
  responseTimeMs: number;
}

export default function PublicSearch() {
  const { t, locale, isRTL, localePath } = useLocale();
  const searchParams = useSearch();
  const urlParams = new URLSearchParams(searchParams);
  const initialQuery = urlParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // Fetch search results from new API
  const { data: searchResponse, isLoading } = useQuery<SearchResponse>({
    queryKey: [`/api/search?q=${encodeURIComponent(searchQuery)}&locale=${locale}&limit=20`],
    enabled: searchQuery.trim().length > 0,
  });

  // Update query when URL changes
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

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
          
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={(query) => {
              setSearchQuery(query);
              window.history.pushState({}, '', localePath(`/search?q=${encodeURIComponent(query)}`));
            }}
            placeholder={t('nav.searchPlaceholder')}
            autoFocus={true}
            className="bg-white"
          />
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchResults
            results={searchResponse?.results || []}
            isLoading={isLoading}
            query={searchQuery}
          />
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
