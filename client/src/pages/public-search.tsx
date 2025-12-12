import { useQuery } from "@tanstack/react-query";
import { Link, useSearch } from "wouter";
import { Search, ArrowLeft, Star, MapPin, Building2, Mountain, BookOpen, UtensilsCrossed, Map, Train } from "lucide-react";
import type { Content } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { useState } from "react";

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

function SearchResultCard({ content, index }: { content: Content; index: number }) {
  const imageUrl = content.heroImage || defaultPlaceholderImages[index % defaultPlaceholderImages.length];
  const TypeIcon = getTypeIcon(content.type);
  const contentPath = getContentPath(content.type, content.slug);
  
  return (
    <Link href={contentPath}>
      <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col sm:flex-row">
        <div className="sm:w-64 aspect-[16/10] sm:aspect-auto overflow-hidden shrink-0">
          <img 
            src={imageUrl} 
            alt={content.heroImageAlt || content.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        </div>
        <div className="p-5 flex-1">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="px-2 py-1 bg-[#f0edfe] text-[#6443f4] rounded-full font-medium capitalize flex items-center gap-1">
              <TypeIcon className="w-3 h-3" />
              {content.type}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#fdcd0a] text-[#fdcd0a]" />
              4.8
            </span>
          </div>
          <h3 className="font-semibold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-[#6443f4] transition-colors">
            {content.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {content.metaDescription || "Explore this amazing destination in Dubai."}
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
  const searchParams = useSearch();
  const urlParams = new URLSearchParams(searchParams);
  const initialQuery = urlParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  
  const { data: allContent, isLoading } = useQuery<Content[]>({
    queryKey: ["/api/contents?status=published"],
  });

  const filteredContent = searchQuery.trim()
    ? allContent?.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.metaDescription?.toLowerCase().includes(searchQuery.toLowerCase()))
      ) || []
    : [];

  return (
    <div className="bg-background min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b" data-testid="nav-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo variant="primary" height={28} />
            <div className="hidden md:flex items-center gap-6">
              <Link href="/hotels" className="text-foreground/80 hover:text-[#6443f4] font-medium transition-colors">Hotels</Link>
              <Link href="/attractions" className="text-foreground/80 hover:text-[#6443f4] font-medium transition-colors">Attractions</Link>
              <Link href="/dining" className="text-foreground/80 hover:text-[#6443f4] font-medium transition-colors">Dining</Link>
              <Link href="/districts" className="text-foreground/80 hover:text-[#6443f4] font-medium transition-colors">Districts</Link>
              <Link href="/transport" className="text-foreground/80 hover:text-[#6443f4] font-medium transition-colors">Transport</Link>
              <Link href="/articles" className="text-foreground/80 hover:text-[#6443f4] font-medium transition-colors">Articles</Link>
            </div>
            <Link href="/admin">
              <Button variant="outline" size="sm">Admin</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Search Header */}
      <section className="bg-gradient-to-br from-[#6443f4] via-[#7c5cf7] to-[#9b7bfa] py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-6">Search Results</h1>
          
          {/* Search Bar */}
          <div className="bg-white rounded-xl p-2 flex items-center gap-2">
            <Search className="w-5 h-5 text-muted-foreground ml-3" />
            <input
              type="text"
              placeholder="Search hotels, attractions, dining, districts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none py-2 text-foreground"
              data-testid="input-search"
              autoFocus
            />
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {!searchQuery.trim() ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Start searching</h2>
              <p className="text-muted-foreground">Type something to search for hotels, attractions, and articles</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-muted-foreground">
                  {isLoading ? "Searching..." : `${filteredContent.length} results for "${searchQuery}"`}
                </p>
              </div>

              {isLoading ? (
                <div className="space-y-6">
                  {[0, 1, 2].map((index) => (
                    <SearchResultSkeleton key={index} />
                  ))}
                </div>
              ) : filteredContent.length > 0 ? (
                <div className="space-y-6">
                  {filteredContent.map((content, index) => (
                    <SearchResultCard key={content.id} content={content} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Search className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                  <h2 className="text-xl font-semibold text-foreground mb-2">No results found</h2>
                  <p className="text-muted-foreground mb-6">Try a different search term or browse our categories</p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link href="/hotels">
                      <Button variant="outline">Browse Hotels</Button>
                    </Link>
                    <Link href="/attractions">
                      <Button variant="outline">Browse Attractions</Button>
                    </Link>
                    <Link href="/articles">
                      <Button variant="outline">Browse Articles</Button>
                    </Link>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Logo variant="primary" height={28} />
            <div className="flex items-center gap-6 text-muted-foreground text-sm">
              <Link href="/hotels" className="hover:text-foreground transition-colors">Hotels</Link>
              <Link href="/attractions" className="hover:text-foreground transition-colors">Attractions</Link>
              <Link href="/articles" className="hover:text-foreground transition-colors">Articles</Link>
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
