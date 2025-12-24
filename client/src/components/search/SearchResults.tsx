/**
 * SearchResults Component
 * 
 * Displays search results with:
 * - Result cards with images, snippets, metadata
 * - Highlighting of search terms
 * - Loading states
 * - Empty states
 */

import { Link } from "wouter";
import { Search, MapPin, Star, Building2, Mountain, BookOpen, UtensilsCrossed, Map, Train } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/LocaleRouter";

interface SearchResult {
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
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading?: boolean;
  query?: string;
}

const defaultPlaceholderImages = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=600&h=400&fit=crop",
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

function ResultSkeleton() {
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

function ResultCard({ result, index }: { result: SearchResult; index: number }) {
  const { localePath } = useLocale();
  const TypeIcon = getTypeIcon(result.type);
  const imageUrl = result.image || defaultPlaceholderImages[index % defaultPlaceholderImages.length];
  
  return (
    <Link href={localePath(result.url)}>
      <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-64 aspect-[16/10] sm:aspect-auto overflow-hidden shrink-0">
          <img 
            src={imageUrl} 
            alt={result.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        </div>
        
        {/* Content */}
        <div className="p-5 flex-1">
          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full font-medium capitalize flex items-center gap-1">
              <TypeIcon className="w-3 h-3" />
              {result.type}
            </span>
            {result.metadata.rating && (
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-[#fdcd0a] text-[#fdcd0a]" />
                {result.metadata.rating}
              </span>
            )}
            {result.metadata.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {result.metadata.location}
              </span>
            )}
          </div>
          
          {/* Title */}
          <h3 className="font-heading font-semibold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {result.title}
          </h3>
          
          {/* Snippet */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {result.snippet}
          </p>
          
          {/* Price */}
          {result.metadata.price && (
            <div className="mt-3 text-sm font-semibold text-primary">
              {result.metadata.price}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}

export function SearchResults({ results, isLoading, query }: SearchResultsProps) {
  const { t, localePath } = useLocale();
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[0, 1, 2].map((i) => (
          <ResultSkeleton key={i} />
        ))}
      </div>
    );
  }
  
  if (!query || query.trim().length === 0) {
    return (
      <div className="text-center py-16">
        <Search className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
        <h2 className="font-heading text-xl font-semibold text-foreground mb-2">
          {t('search.searchIn')}
        </h2>
        <p className="text-muted-foreground">
          Start typing to search hotels, attractions, and more
        </p>
      </div>
    );
  }
  
  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <Search className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
        <h2 className="font-heading text-xl font-semibold text-foreground mb-2">
          {t('search.noResults')}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t('search.tryAgain')}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href={localePath("/hotels")}>
            <Button variant="outline">{t('hotels.pageTitle')}</Button>
          </Link>
          <Link href={localePath("/attractions")}>
            <Button variant="outline">Attractions</Button>
          </Link>
          <Link href={localePath("/articles")}>
            <Button variant="outline">Articles</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <p className="text-muted-foreground">
          {results.length} {t('search.results')} for "{query}"
        </p>
      </div>
      
      {results.map((result, index) => (
        <ResultCard key={result.id} result={result} index={index} />
      ))}
    </div>
  );
}
