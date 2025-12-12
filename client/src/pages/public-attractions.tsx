import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Mountain, Star, MapPin, ArrowLeft, Search, Clock, Menu, X } from "lucide-react";
import type { Content } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { useState } from "react";
import { useDocumentMeta } from "@/hooks/use-document-meta";

const defaultPlaceholderImages = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1546412414-e1885259563a?w=600&h=400&fit=crop",
];

function AttractionCard({ content, index }: { content: Content; index: number }) {
  const imageUrl = content.heroImage || defaultPlaceholderImages[index % defaultPlaceholderImages.length];
  
  return (
    <article role="listitem" data-testid={`card-attraction-${content.id}`}>
      <Link href={`/attractions/${content.slug}`}>
        <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
          <div className="aspect-[4/3] overflow-hidden">
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
                <Star className="w-3.5 h-3.5 fill-[#fdcd0a] text-[#fdcd0a]" aria-hidden="true" />
                <span className="font-medium">4.8</span>
                <span className="sr-only">out of 5 stars</span>
              </span>
              <span className="text-muted-foreground/50" aria-hidden="true">|</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                2-4 hours
              </span>
            </div>
            <h3 className="font-heading font-semibold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {content.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {content.metaDescription || "Discover this amazing attraction in Dubai."}
            </p>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <span className="text-sm text-muted-foreground">Dubai, UAE</span>
            </div>
          </div>
        </Card>
      </Link>
    </article>
  );
}

function AttractionCardSkeleton() {
  return (
    <div aria-hidden="true" role="listitem">
      <Card className="overflow-hidden border-0 shadow-md animate-pulse">
        <div className="aspect-[4/3] bg-muted" />
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-4 w-12 bg-muted rounded" />
            <div className="h-4 w-16 bg-muted rounded" />
          </div>
          <div className="h-6 bg-muted rounded mb-2 w-3/4" />
          <div className="h-4 bg-muted rounded w-full mb-1" />
          <div className="h-4 bg-muted rounded w-2/3 mb-4" />
          <div className="h-4 w-24 bg-muted rounded" />
        </div>
      </Card>
    </div>
  );
}

function PlaceholderAttractionCard({ index }: { index: number }) {
  const placeholderData = [
    { title: "Burj Khalifa", desc: "Visit the world's tallest building and enjoy breathtaking panoramic views" },
    { title: "Desert Safari", desc: "Experience thrilling dune bashing, camel rides, and Bedouin hospitality" },
    { title: "Dubai Mall", desc: "Explore the world's largest shopping destination with endless entertainment" },
    { title: "Palm Jumeirah", desc: "Discover the iconic man-made island with luxury resorts and dining" },
  ];
  const data = placeholderData[index % placeholderData.length];
  const imageUrl = defaultPlaceholderImages[index % defaultPlaceholderImages.length];
  
  return (
    <article role="listitem" data-testid={`card-attraction-placeholder-${index}`}>
      <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
        <div className="aspect-[4/3] overflow-hidden">
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
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              2-4 hours
            </span>
          </div>
          <h3 className="font-heading font-semibold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {data.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {data.desc}
          </p>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <span className="text-sm text-muted-foreground">Dubai, UAE</span>
          </div>
        </div>
      </Card>
    </article>
  );
}

export default function PublicAttractions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useDocumentMeta({
    title: "Dubai Attractions & Things to Do | Travi - Dubai Travel Guide",
    description: "Discover the best attractions and things to do in Dubai. From the iconic Burj Khalifa to desert safaris, find unforgettable experiences in the city of dreams.",
    ogTitle: "Dubai Attractions & Things to Do | Travi",
    ogDescription: "Explore iconic landmarks, thrilling adventures, and unique experiences in Dubai.",
    ogType: "website",
  });
  
  const { data: allContent, isLoading } = useQuery<Content[]>({
    queryKey: ["/api/contents?status=published"],
  });

  const attractions = allContent?.filter(c => c.type === "attraction") || [];
  const filteredAttractions = searchQuery 
    ? attractions.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : attractions;

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
                <Link href="/hotels" className="text-foreground/80 hover:text-primary font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1">Hotels</Link>
                <Link href="/attractions" className="text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1">Attractions</Link>
                <Link href="/articles" className="text-foreground/80 hover:text-primary font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1">Articles</Link>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/admin">
                  <Button variant="outline" size="sm" data-testid="button-admin">Admin</Button>
                </Link>
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
            </div>
            {mobileMenuOpen && (
              <div id="mobile-menu" className="md:hidden py-4 border-t">
                <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
                  <Link href="/hotels" className="text-foreground/80 hover:text-primary font-medium py-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-2">Hotels</Link>
                  <Link href="/attractions" className="text-primary font-medium py-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-2">Attractions</Link>
                  <Link href="/articles" className="text-foreground/80 hover:text-primary font-medium py-2 focus:outline-none focus:ring-2 focus:ring-primary rounded-md px-2">Articles</Link>
                </nav>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main id="main-content">
        <section className="bg-gradient-to-br from-[#4c2889] via-[#6443F4] to-[#8b5cf6] py-16 relative overflow-hidden" aria-labelledby="attractions-heading">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBvbHlnb24gcG9pbnRzPSIzMCAwIDYwIDMwIDMwIDYwIDAgMzAiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" aria-hidden="true" />
          <div className="absolute top-5 left-20 w-36 h-36 bg-[#F94498] rounded-full blur-3xl opacity-20" aria-hidden="true" />
          <div className="absolute bottom-5 right-20 w-28 h-28 bg-[#a78bfa] rounded-full blur-3xl opacity-25" aria-hidden="true" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-md px-2 py-1">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back to Home
            </Link>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#a78bfa] to-[#6443F4] flex items-center justify-center shadow-lg" aria-hidden="true">
                <Mountain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 id="attractions-heading" className="font-heading text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">Explore Dubai Attractions</h1>
                <p className="text-white/90">Discover unforgettable experiences and iconic landmarks</p>
              </div>
            </div>
            
            <div className="mt-8 max-w-xl">
              <form role="search" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="attraction-search" className="sr-only">Search attractions</label>
                <div className="bg-white rounded-xl p-2 flex items-center gap-2 shadow-xl">
                  <Search className="w-5 h-5 text-muted-foreground ml-3" aria-hidden="true" />
                  <input
                    id="attraction-search"
                    type="text"
                    placeholder="Search attractions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent outline-none py-2 text-foreground focus:outline-none"
                    data-testid="input-search-attractions"
                  />
                </div>
              </form>
            </div>
          </div>
        </section>

        <section className="py-12" aria-labelledby="attractions-list-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <h2 id="attractions-list-heading" className="sr-only">Attraction Listings</h2>
              <p className="text-muted-foreground" aria-live="polite" data-testid="text-attractions-count">
                {isLoading ? (
                  <>
                    <span className="sr-only">Loading attractions...</span>
                    Loading...
                  </>
                ) : `${filteredAttractions.length} attractions found`}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="list" aria-label="Attractions list">
              {isLoading ? (
                [0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                  <AttractionCardSkeleton key={index} />
                ))
              ) : filteredAttractions.length > 0 ? (
                filteredAttractions.map((attraction, index) => (
                  <AttractionCard key={attraction.id} content={attraction} index={index} />
                ))
              ) : (
                [0, 1, 2, 3].map((index) => (
                  <PlaceholderAttractionCard key={index} index={index} />
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
