import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Building2, Star, MapPin, ArrowLeft, Search, Menu, X } from "lucide-react";
import type { ContentWithRelations } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { useState } from "react";
import { useDocumentMeta } from "@/hooks/use-document-meta";

const defaultPlaceholderImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop",
];

function HotelCard({ content, index }: { content: ContentWithRelations; index: number }) {
  const imageUrl = content.heroImage || defaultPlaceholderImages[index % defaultPlaceholderImages.length];
  const starRating = content.hotel?.starRating || 5;
  const location = content.hotel?.location || "Dubai, UAE";
  const ctaText = content.hotel?.primaryCta || "View Details";
  
  return (
    <article role="listitem" data-testid={`card-hotel-${content.id}`}>
      <Link href={`/hotels/${content.slug}`}>
        <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
          <div className="aspect-[16/10] overflow-hidden">
            <img 
              src={imageUrl} 
              alt={content.heroImageAlt || content.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              width={600}
              height={400}
            />
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <span className="flex items-center gap-1">
                {[...Array(starRating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#fdcd0a] text-[#fdcd0a]" aria-hidden="true" />
                ))}
                <span className="sr-only">{starRating} star hotel</span>
              </span>
              <span className="text-muted-foreground/50" aria-hidden="true">|</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                {location}
              </span>
            </div>
            <h3 className="font-heading font-semibold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {content.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {content.metaDescription || "Experience luxury and comfort in the heart of Dubai."}
            </p>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-muted-foreground">Starting from</span>
              <span className="font-bold text-primary">{ctaText}</span>
            </div>
          </div>
        </Card>
      </Link>
    </article>
  );
}

function HotelCardSkeleton() {
  return (
    <div aria-hidden="true" role="listitem">
      <Card className="overflow-hidden border-0 shadow-md animate-pulse">
        <div className="aspect-[16/10] bg-muted" />
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 w-12 bg-muted rounded" />
            <div className="h-4 w-20 bg-muted rounded" />
          </div>
          <div className="h-6 bg-muted rounded mb-2 w-3/4" />
          <div className="h-4 bg-muted rounded w-full mb-1" />
          <div className="h-4 bg-muted rounded w-2/3 mb-4" />
          <div className="flex items-center justify-between gap-2">
            <div className="h-4 w-16 bg-muted rounded" />
            <div className="h-4 w-20 bg-muted rounded" />
          </div>
        </div>
      </Card>
    </div>
  );
}

function PlaceholderHotelCard({ index }: { index: number }) {
  const placeholderData = [
    { title: "Atlantis The Palm", desc: "Iconic luxury resort on Palm Jumeirah with aquarium and waterpark" },
    { title: "Burj Al Arab", desc: "The world's most luxurious hotel with stunning architecture" },
    { title: "Address Downtown", desc: "Modern luxury in the heart of Downtown Dubai" },
    { title: "One&Only Royal Mirage", desc: "Arabian palace resort with pristine beach access" },
  ];
  const data = placeholderData[index % placeholderData.length];
  const imageUrl = defaultPlaceholderImages[index % defaultPlaceholderImages.length];
  
  return (
    <article role="listitem" data-testid={`card-hotel-placeholder-${index}`}>
      <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
        <div className="aspect-[16/10] overflow-hidden">
          <img 
            src={imageUrl} 
            alt={data.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            width={600}
            height={400}
          />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#fdcd0a] text-[#fdcd0a]" aria-hidden="true" />
              <span className="font-medium">4.9</span>
              <span className="sr-only">out of 5 stars</span>
            </span>
            <span className="text-muted-foreground/50" aria-hidden="true">|</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              Dubai, UAE
            </span>
          </div>
          <h3 className="font-heading font-semibold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {data.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {data.desc}
          </p>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">Starting from</span>
            <span className="font-bold text-primary">View Details</span>
          </div>
        </div>
      </Card>
    </article>
  );
}

export default function PublicHotels() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useDocumentMeta({
    title: "Luxury Hotels in Dubai | Travi - Dubai Travel Guide",
    description: "Discover the finest luxury hotels in Dubai. From iconic resorts like Atlantis and Burj Al Arab to boutique properties, find your perfect Dubai accommodation.",
    ogTitle: "Luxury Hotels in Dubai | Travi",
    ogDescription: "Find world-class hospitality in the city of dreams. Browse our curated collection of Dubai's finest hotels.",
    ogType: "website",
  });
  
  const { data: allContent, isLoading } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/contents?status=published&includeExtensions=true"],
  });

  const hotels = allContent?.filter(c => c.type === "hotel") || [];
  const filteredHotels = searchQuery 
    ? hotels.filter(h => h.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : hotels;

  return (
    <div className="bg-background min-h-screen">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>
      
      <header>
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b" aria-label="Main navigation" data-testid="nav-header">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4 h-16">
              <Logo variant="primary" height={28} />
              <div className="hidden md:flex items-center gap-8">
                <Link href="/hotels" className="text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1">Hotels</Link>
                <Link href="/attractions" className="text-foreground/80 hover:text-primary font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1">Attractions</Link>
                <Link href="/articles" className="text-foreground/80 hover:text-primary font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1">Articles</Link>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                data-testid="button-mobile-menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
              </Button>
            </div>
            {mobileMenuOpen && (
              <div id="mobile-menu" className="md:hidden py-4 border-t">
                <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
                  <Link href="/hotels" className="text-primary font-medium py-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-2">Hotels</Link>
                  <Link href="/attractions" className="text-foreground/80 hover:text-primary font-medium py-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-2">Attractions</Link>
                  <Link href="/articles" className="text-foreground/80 hover:text-primary font-medium py-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-2">Articles</Link>
                </nav>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main id="main-content">
        <section className="bg-gradient-to-br from-[#8B6914] via-[#B8860B] to-[#D4A526] py-16 relative overflow-hidden" aria-labelledby="hotels-heading">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTIwIDIwaDIwdjIwSDIweiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" aria-hidden="true" />
          <div className="absolute top-10 right-20 w-32 h-32 bg-[#FFD112] rounded-full blur-3xl opacity-25" aria-hidden="true" />
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-[#fef3c7] rounded-full blur-3xl opacity-20" aria-hidden="true" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-md px-2 py-1">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back to Home
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFD112] to-[#F59E0B] flex items-center justify-center shadow-lg" aria-hidden="true">
                <Building2 className="w-8 h-8 text-[#78350f]" />
              </div>
              <div>
                <h1 id="hotels-heading" className="font-heading text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">Luxury Hotels in Dubai</h1>
                <p className="text-white/90">Experience world-class hospitality in the city of dreams</p>
              </div>
            </div>
            
            <div className="mt-8 max-w-xl">
              <form role="search" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="hotel-search" className="sr-only">Search hotels</label>
                <div className="bg-white rounded-xl p-2 flex items-center gap-2 shadow-xl">
                  <Search className="w-5 h-5 text-muted-foreground ml-3" aria-hidden="true" />
                  <input
                    id="hotel-search"
                    type="text"
                    placeholder="Search luxury hotels..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent outline-none py-2 text-foreground focus:outline-none"
                    data-testid="input-search-hotels"
                  />
                </div>
              </form>
            </div>
          </div>
        </section>

        <section className="py-12" aria-labelledby="hotels-list-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <h2 id="hotels-list-heading" className="sr-only">Hotel Listings</h2>
              <p className="text-muted-foreground" aria-live="polite" data-testid="text-hotels-count">
                {isLoading ? (
                  <>
                    <span className="sr-only">Loading hotels...</span>
                    Loading...
                  </>
                ) : `${filteredHotels.length} hotels found`}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Hotels list">
              {isLoading ? (
                [0, 1, 2, 3, 4, 5].map((index) => (
                  <HotelCardSkeleton key={index} />
                ))
              ) : filteredHotels.length > 0 ? (
                filteredHotels.map((hotel, index) => (
                  <HotelCard key={hotel.id} content={hotel} index={index} />
                ))
              ) : (
                [0, 1, 2, 3].map((index) => (
                  <PlaceholderHotelCard key={index} index={index} />
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t mt-auto" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Logo variant="primary" height={28} />
            <nav className="flex items-center gap-6 text-muted-foreground text-sm" aria-label="Footer navigation">
              <Link href="/hotels" className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-1">Hotels</Link>
              <Link href="/attractions" className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-1">Attractions</Link>
              <Link href="/articles" className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-1">Articles</Link>
            </nav>
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <Link href="/privacy" className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-1">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-1">Terms</Link>
              <span>2024 Travi</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
