import { Search, Building2, Mountain, Landmark, BookOpen, Utensils, Bus, ArrowRight, Sparkles, Menu, MapPin, Star, Clock, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import type { Content } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";

const defaultPlaceholderImages = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1546412414-e1885259563a?w=600&h=400&fit=crop",
];

const exploreCategories = [
  { icon: Building2, title: "Hotels", count: "500+", href: "/hotels" },
  { icon: Mountain, title: "Attractions", count: "200+", href: "/attractions" },
  { icon: Landmark, title: "Districts", count: "25", href: "/districts" },
  { icon: BookOpen, title: "Articles", count: "100+", href: "/articles" },
  { icon: Utensils, title: "Dining", count: "300+", href: "/dining" },
  { icon: Bus, title: "Transport", count: "50+", href: "/transport" },
];

const stats = [
  { value: "1M+", label: "Happy Travelers" },
  { value: "500+", label: "Hotels Listed" },
  { value: "200+", label: "Attractions" },
  { value: "4.9", label: "User Rating" },
];


function ContentCard({ content, index }: { content: Content; index: number }) {
  const imageUrl = content.heroImage || defaultPlaceholderImages[index % defaultPlaceholderImages.length];
  const contentPath = `/${content.type}s/${content.slug}`;
  
  return (
    <Link href={contentPath}>
      <Card className="group overflow-hidden border-0 shadow-[var(--shadow-level-1)] hover:shadow-[var(--shadow-level-2)] transition-all duration-300 cursor-pointer">
        <div className="aspect-[4/3] overflow-hidden">
          <img 
            src={imageUrl} 
            alt={content.heroImageAlt || content.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium capitalize">
              {content.type}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              4.8
            </span>
          </div>
          <h3 className="font-heading font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
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

function PlaceholderCard({ index }: { index: number }) {
  const placeholderData = [
    { title: "Burj Khalifa Experience", type: "attraction", desc: "Visit the world's tallest building and enjoy breathtaking views of Dubai" },
    { title: "Desert Safari Adventure", type: "attraction", desc: "Experience dune bashing, camel rides, and traditional Bedouin hospitality" },
    { title: "Dubai Marina Walk", type: "attraction", desc: "Stroll along the stunning waterfront promenade with dining and shopping" },
    { title: "Palm Jumeirah", type: "hotel", desc: "Discover luxury resorts and pristine beaches on Dubai's iconic island" },
  ];
  const data = placeholderData[index];
  const imageUrl = defaultPlaceholderImages[index];
  
  return (
    <Link href={`/${data.type}s`}>
      <Card className="group overflow-hidden border-0 shadow-[var(--shadow-level-1)] hover:shadow-[var(--shadow-level-2)] transition-all duration-300 cursor-pointer">
        <div className="aspect-[4/3] overflow-hidden">
          <img 
            src={imageUrl} 
            alt={data.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium capitalize">
              {data.type}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              4.8
            </span>
          </div>
          <h3 className="font-heading font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {data.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {data.desc}
          </p>
        </div>
      </Card>
    </Link>
  );
}

function ContentCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 shadow-md animate-pulse">
      <div className="aspect-[4/3] bg-muted" />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-5 w-16 bg-muted rounded-full" />
          <div className="h-4 w-10 bg-muted rounded" />
        </div>
        <div className="h-5 bg-muted rounded mb-2 w-3/4" />
        <div className="h-4 bg-muted rounded w-full mb-1" />
        <div className="h-4 bg-muted rounded w-2/3" />
      </div>
    </Card>
  );
}

export default function PublicHome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  const { data: publishedContent, isLoading } = useQuery<Content[]>({
    queryKey: ["/api/contents?status=published"],
  });

  const featuredContent = publishedContent?.slice(0, 4) || [];
  const hasContent = featuredContent.length > 0;

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-background min-h-screen overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b" data-testid="nav-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo variant="primary" height={28} />

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/hotels" className="text-foreground/80 hover:text-primary font-medium transition-colors" data-testid="link-hotels">Hotels</Link>
              <Link href="/attractions" className="text-foreground/80 hover:text-primary font-medium transition-colors" data-testid="link-attractions">Attractions</Link>
              <Link href="/articles" className="text-foreground/80 hover:text-primary font-medium transition-colors" data-testid="link-articles">Articles</Link>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Link href="/admin">
                <Button variant="outline" className="hidden sm:flex" data-testid="button-admin">
                  Admin
                </Button>
              </Link>
              <button 
                className="md:hidden p-2 text-foreground"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background p-4">
            <div className="flex flex-col gap-2">
              <Link href="/hotels" className="py-2 px-4 hover:bg-muted rounded-lg font-medium" data-testid="link-hotels-mobile" onClick={() => setMobileMenuOpen(false)}>Hotels</Link>
              <Link href="/attractions" className="py-2 px-4 hover:bg-muted rounded-lg font-medium" data-testid="link-attractions-mobile" onClick={() => setMobileMenuOpen(false)}>Attractions</Link>
              <Link href="/articles" className="py-2 px-4 hover:bg-muted rounded-lg font-medium" data-testid="link-articles-mobile" onClick={() => setMobileMenuOpen(false)}>Articles</Link>
              <Link href="/admin" className="py-2 px-4 hover:bg-muted rounded-lg font-medium" data-testid="link-admin-mobile" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section - Using brand purple gradient */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24 bg-gradient-to-br from-[#6443F4] via-[#7c5cf7] to-[#F94498] relative overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#FF9327] rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#FFD112] rounded-full blur-3xl opacity-20" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-5 py-2.5 mb-6 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-[#FFD112]" />
              <span className="text-white text-sm font-semibold tracking-wide">Your Dubai Travel Companion</span>
            </div>
            
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Discover the Magic of
              <span className="block bg-gradient-to-r from-[#FFD112] via-[#FF9327] to-[#FFD112] bg-clip-text text-transparent">Dubai</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Explore world-class hotels, stunning attractions, and unforgettable experiences in the city of dreams.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto px-2">
              <div className="bg-white rounded-2xl shadow-2xl p-2 flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 sm:gap-3 px-2 sm:px-4 min-w-0">
                  <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    placeholder="Search hotels, attractions, articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    className="flex-1 text-foreground placeholder:text-muted-foreground bg-transparent outline-none py-3 text-sm sm:text-base min-w-0"
                    data-testid="input-search"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  className="bg-[#F94498] hover:bg-[#e03587] text-white font-semibold rounded-xl px-4 sm:px-8 py-6 shrink-0 shadow-lg" 
                  data-testid="button-search"
                >
                  <Search className="w-5 h-5 sm:hidden" />
                  <span className="hidden sm:inline">Search</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/70 text-sm sm:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 sm:py-16 bg-background" data-testid="section-categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {exploreCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={index}
                  href={category.href}
                  className="flex flex-col items-center p-4 sm:p-6 rounded-2xl bg-card border hover:border-primary hover:shadow-lg transition-all cursor-pointer group"
                  data-testid={`card-category-${index}`}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary transition-colors">
                    <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <span className="font-medium text-foreground text-sm sm:text-base">{category.title}</span>
                  <span className="text-xs text-muted-foreground">{category.count}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-12 sm:py-16 bg-muted/30" data-testid="section-featured">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Popular Destinations
              </h2>
              <p className="text-muted-foreground">Discover the best Dubai has to offer</p>
            </div>
            <Link href="/attractions">
              <Button variant="ghost" className="text-primary hidden sm:flex">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <>
                {[0, 1, 2, 3].map((index) => (
                  <ContentCardSkeleton key={index} />
                ))}
              </>
            ) : hasContent ? (
              featuredContent.map((content, index) => (
                <ContentCard key={content.id} content={content} index={index} />
              ))
            ) : (
              [0, 1, 2, 3].map((index) => (
                <PlaceholderCard key={index} index={index} />
              ))
            )}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/attractions">
              <Button variant="outline" className="text-primary border-primary">
                View All Destinations
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 bg-background" data-testid="section-features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Why Choose Travi?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your trusted companion for exploring Dubai's wonders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center border-0 shadow-md">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Curated Experiences</h3>
              <p className="text-muted-foreground text-sm">
                Hand-picked destinations and hidden gems verified by local experts
              </p>
            </Card>

            <Card className="p-6 text-center border-0 shadow-md">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
                <Star className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Trusted Reviews</h3>
              <p className="text-muted-foreground text-sm">
                Authentic ratings and reviews from real travelers worldwide
              </p>
            </Card>

            <Card className="p-6 text-center border-0 shadow-md">
              <div className="w-14 h-14 rounded-2xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-7 h-7 text-sky-500" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">Real-Time Updates</h3>
              <p className="text-muted-foreground text-sm">
                Latest information on events, offers, and travel advisories
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-primary to-primary/70" data-testid="section-cta">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl sm:text-4xl font-bold text-white mb-4">
            Ready to Explore Dubai?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Browse our collection of hotels, attractions, and travel guides to plan your perfect Dubai adventure.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/hotels">
              <Button className="bg-[#fdcd0a] hover:bg-[#e5b800] text-[#6443f4] font-semibold rounded-full px-8 py-6 text-lg">
                Browse Hotels
              </Button>
            </Link>
            <Link href="/attractions">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg">
                Explore Attractions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#1a1a2e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <Logo variant="dark-bg" height={28} />
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/60 text-sm">
              <Link href="/hotels" className="hover:text-white transition-colors">Hotels</Link>
              <Link href="/attractions" className="hover:text-white transition-colors">Attractions</Link>
              <Link href="/articles" className="hover:text-white transition-colors">Articles</Link>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
            <p className="text-white/40 text-sm">
              2024 Travi. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
