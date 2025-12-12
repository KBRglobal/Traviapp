import { Search, Building2, Mountain, Landmark, BookOpen, Utensils, Bus, Sparkles, MapPin, Star, Clock, ChevronRight, ArrowRight, Flame } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import type { Content, ContentWithRelations } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PublicNav } from "@/components/public-nav";
import { ImageHero } from "@/components/image-hero";
import { FeaturedCard, EditorialCard, SectionHeader, ContentGrid } from "@/components/editorial-cards";
import { useDocumentMeta } from "@/hooks/use-document-meta";

interface HomepagePromotion {
  id: string;
  section: string;
  contentId: string | null;
  position: number;
  isActive: boolean;
  customTitle: string | null;
  customImage: string | null;
  content?: ContentWithRelations;
}

const defaultPlaceholderImages = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1546412414-e1885259563a?w=1200&h=800&fit=crop",
];

const heroImage = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop";

const exploreCategories = [
  { icon: Building2, title: "Hotels", count: "500+", href: "/hotels", color: "from-[#FF9327] to-[#ffb35c]" },
  { icon: Mountain, title: "Attractions", count: "200+", href: "/attractions", color: "from-[#F94498] to-[#fb6eb0]" },
  { icon: Landmark, title: "Districts", count: "25", href: "/districts", color: "from-[#6443F4] to-[#8f6cfa]" },
  { icon: BookOpen, title: "Articles", count: "100+", href: "/articles", color: "from-[#02A65C] to-[#1ed47f]" },
  { icon: Utensils, title: "Dining", count: "300+", href: "/dining", color: "from-[#01BEFF] to-[#4dd1ff]" },
  { icon: Bus, title: "Transport", count: "50+", href: "/transport", color: "from-[#FFD112] to-[#ffe066]" },
];

interface StatsData {
  totalContent: number;
  published: number;
  drafts: number;
  inReview: number;
  attractions: number;
  hotels: number;
  articles: number;
}

function ContentCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 shadow-md animate-pulse" aria-hidden="true">
      <div className="aspect-[16/10] bg-muted" />
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
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  useDocumentMeta({
    title: "Travi - Discover Dubai | Hotels, Attractions & Travel Guides",
    description: "Explore world-class hotels, stunning attractions, and unforgettable experiences in Dubai. Plan your perfect Dubai adventure with Travi.",
    ogTitle: "Travi - Your Dubai Travel Companion",
    ogDescription: "Discover the magic of Dubai with curated hotels, attractions, and travel guides.",
    ogType: "website",
  });

  const { data: statsData } = useQuery<StatsData>({
    queryKey: ["/api/stats"],
  });

  const { data: featuredPromotions = [], isLoading: featuredLoading } = useQuery<HomepagePromotion[]>({
    queryKey: ["/api/homepage-promotions/featured"],
  });

  const { data: attractionsPromotions = [], isLoading: attractionsLoading } = useQuery<HomepagePromotion[]>({
    queryKey: ["/api/homepage-promotions/attractions"],
  });

  const { data: hotelsPromotions = [], isLoading: hotelsLoading } = useQuery<HomepagePromotion[]>({
    queryKey: ["/api/homepage-promotions/hotels"],
  });

  const { data: articlesPromotions = [], isLoading: articlesLoading } = useQuery<HomepagePromotion[]>({
    queryKey: ["/api/homepage-promotions/articles"],
  });

  const { data: publishedContent } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/contents?status=published"],
  });

  const getActiveContent = (promotions: HomepagePromotion[]): ContentWithRelations[] => {
    return promotions
      .filter(p => p.isActive && p.content)
      .map(p => p.content!)
      .slice(0, 6);
  };

  const featuredContent = getActiveContent(featuredPromotions).length > 0 
    ? getActiveContent(featuredPromotions) 
    : (publishedContent?.slice(0, 6) || []);
  
  const attractionsContent = getActiveContent(attractionsPromotions).length > 0
    ? getActiveContent(attractionsPromotions)
    : (publishedContent?.filter(c => c.type === "attraction").slice(0, 6) || []);
  
  const hotelsContent = getActiveContent(hotelsPromotions).length > 0
    ? getActiveContent(hotelsPromotions)
    : (publishedContent?.filter(c => c.type === "hotel").slice(0, 4) || []);
  
  const articlesContent = getActiveContent(articlesPromotions).length > 0
    ? getActiveContent(articlesPromotions)
    : (publishedContent?.filter(c => c.type === "article").slice(0, 6) || []);

  const isLoading = featuredLoading;

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

  const getContentPath = (content: Content) => `/${content.type}s/${content.slug}`;

  return (
    <div className="bg-background min-h-screen">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md">
        Skip to main content
      </a>

      <PublicNav variant="transparent" />

      <main id="main-content">
        {/* Hero Section with Background Image */}
        <section className="relative" data-testid="section-hero">
          <ImageHero
            backgroundImage={heroImage}
            headline="Discover the Magic of Dubai"
            subheadline="Your curated guide to world-class hotels, stunning attractions, and unforgettable experiences in the city of dreams."
            badge="Your Dubai Travel Companion"
            height="full"
            alignment="left"
            overlay="medium"
          />
          
          {/* Search Bar Overlay */}
          <div className="absolute bottom-8 left-0 right-0 z-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSearch(); }} 
                role="search" 
                className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl shadow-2xl p-2 flex items-center gap-2 max-w-2xl"
              >
                <div className="flex-1 flex items-center gap-3 px-4">
                  <Search className="w-5 h-5 text-muted-foreground shrink-0" aria-hidden="true" />
                  <label htmlFor="hero-search" className="sr-only">Search hotels, attractions, articles</label>
                  <input
                    id="hero-search"
                    type="search"
                    placeholder="Search hotels, attractions, articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    className="flex-1 text-foreground placeholder:text-muted-foreground bg-transparent outline-none py-3 text-base"
                    data-testid="input-search"
                  />
                </div>
                <Button 
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg px-6 py-6" 
                  data-testid="button-search"
                >
                  Search
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Quick Categories - Horizontal scroll on mobile */}
        <section className="py-8 bg-muted/30 border-b" data-testid="section-quick-nav">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {exploreCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Link
                    key={index}
                    href={category.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-card border hover:border-primary/50 hover:shadow-md transition-all shrink-0"
                    data-testid={`quick-nav-${category.title.toLowerCase()}`}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                      <IconComponent className="w-5 h-5 text-white" aria-hidden="true" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-foreground text-sm">{category.title}</div>
                      <div className="text-xs text-muted-foreground">{category.count}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Section - Mixed Layout */}
        {featuredContent.length > 0 && (
          <section className="py-16 lg:py-20" data-testid="section-featured">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <SectionHeader 
                title="Editor's Picks" 
                subtitle="Handpicked destinations and experiences for your Dubai adventure"
                action={{ label: "View all", href: "/attractions" }}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Large Featured Card */}
                {featuredContent[0] && (
                  <div className="lg:row-span-2">
                    <FeaturedCard
                      title={featuredContent[0].title}
                      description={featuredContent[0].metaDescription || "Discover this amazing destination"}
                      image={featuredContent[0].heroImage || defaultPlaceholderImages[0]}
                      href={getContentPath(featuredContent[0])}
                      category={featuredContent[0].type}
                      categoryColor="bg-primary"
                      location="Dubai"
                      rating={4.8}
                      className="h-full"
                    />
                  </div>
                )}
                
                {/* Stacked Editorial Cards */}
                <div className="space-y-6">
                  {featuredContent.slice(1, 3).map((content, index) => (
                    <EditorialCard
                      key={content.id}
                      title={content.title}
                      excerpt={content.metaDescription || undefined}
                      image={content.heroImage || defaultPlaceholderImages[index + 1]}
                      href={getContentPath(content)}
                      category={content.type}
                      categoryColor="text-primary"
                      variant="horizontal"
                      size="medium"
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Hotels Section - Luxury Feel, Fewer Items */}
        {hotelsContent.length > 0 && (
          <section className="py-16 lg:py-20 bg-muted/30" data-testid="section-hotels">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <SectionHeader 
                title="Luxury Stays" 
                subtitle="Experience world-class hospitality in Dubai's finest hotels"
                action={{ label: "Explore all hotels", href: "/hotels" }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {hotelsContent.slice(0, 2).map((content, index) => (
                  <FeaturedCard
                    key={content.id}
                    title={content.title}
                    description={content.metaDescription || "Experience luxury and comfort"}
                    image={content.heroImage || defaultPlaceholderImages[index]}
                    href={`/hotels/${content.slug}`}
                    category="Hotel"
                    categoryColor="bg-[#FF9327]"
                    location="Dubai"
                    rating={4.9}
                  />
                ))}
              </div>

              {hotelsContent.length > 2 && (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {hotelsContent.slice(2, 6).map((content, index) => (
                    <EditorialCard
                      key={content.id}
                      title={content.title}
                      image={content.heroImage || defaultPlaceholderImages[index]}
                      href={`/hotels/${content.slug}`}
                      category="Hotel"
                      categoryColor="text-[#FF9327]"
                      size="small"
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Attractions Section - Visual First, Denser */}
        {attractionsContent.length > 0 && (
          <section className="py-16 lg:py-20" data-testid="section-attractions">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F94498] to-[#FF6B35] flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl lg:text-3xl font-bold text-foreground">Must-See Attractions</h2>
                  <p className="text-muted-foreground">Iconic landmarks and hidden gems</p>
                </div>
                <Link href="/attractions">
                  <Button variant="outline" className="hidden sm:flex">
                    View All <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {attractionsContent.slice(0, 6).map((content, index) => (
                  <Link key={content.id} href={`/attractions/${content.slug}`}>
                    <article className="group relative overflow-hidden rounded-lg cursor-pointer aspect-[4/5]">
                      <img
                        src={content.heroImage || defaultPlaceholderImages[index % 4]}
                        alt={content.heroImageAlt || content.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <Badge className="bg-[#F94498] text-white border-0 text-xs">
                          <Flame className="w-3 h-3 mr-1" />
                          Hot
                        </Badge>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-white/90 text-sm">4.9</span>
                        </div>
                        <h3 className="text-white font-semibold text-base lg:text-lg line-clamp-2 group-hover:text-white/90 transition-colors">
                          {content.title}
                        </h3>
                        <div className="flex items-center gap-1 mt-2 text-white/70 text-sm">
                          <MapPin className="w-3 h-3" />
                          <span>Dubai</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              <div className="mt-8 text-center sm:hidden">
                <Link href="/attractions">
                  <Button className="bg-[#F94498] hover:bg-[#e03587] text-white">
                    Explore All Attractions
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Articles Section - Magazine Style */}
        {articlesContent.length > 0 && (
          <section className="py-16 lg:py-20 bg-muted/30" data-testid="section-articles">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <SectionHeader 
                title="Travel Stories" 
                subtitle="Expert insights, tips, and guides for your Dubai journey"
                action={{ label: "Read more stories", href: "/articles" }}
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Featured Article */}
                {articlesContent[0] && (
                  <div className="lg:col-span-2">
                    <FeaturedCard
                      title={articlesContent[0].title}
                      description={articlesContent[0].metaDescription || "Discover insights and tips"}
                      image={articlesContent[0].heroImage || defaultPlaceholderImages[0]}
                      href={`/articles/${articlesContent[0].slug}`}
                      category="Featured"
                      categoryColor="bg-[#02A65C]"
                      date={new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                  </div>
                )}

                {/* Article List */}
                <div className="space-y-6">
                  <h3 className="font-semibold text-foreground border-b pb-3">Latest Stories</h3>
                  {articlesContent.slice(1, 5).map((content, index) => (
                    <EditorialCard
                      key={content.id}
                      title={content.title}
                      image={content.heroImage || defaultPlaceholderImages[index + 1]}
                      href={`/articles/${content.slug}`}
                      category="Article"
                      categoryColor="text-[#02A65C]"
                      variant="horizontal"
                      size="small"
                      readTime="5 min read"
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Newsletter / CTA Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-[#6443F4] via-[#7c5cf7] to-[#F94498]" data-testid="section-newsletter">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-5 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-[#FFD112]" />
              <span className="text-white text-sm font-medium">Stay Informed</span>
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Get Dubai Travel Tips
            </h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8">
              Subscribe to receive curated recommendations, exclusive deals, and insider tips for your Dubai adventure.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/50 outline-none focus:border-white/40"
                data-testid="input-newsletter-email"
              />
              <Button className="bg-white text-[#6443F4] hover:bg-white/90 font-medium px-6" data-testid="button-subscribe">
                Subscribe
              </Button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 bg-card border-t" data-testid="footer">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="font-semibold text-foreground mb-4">Explore</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/attractions" className="hover:text-foreground transition-colors">Attractions</Link></li>
                  <li><Link href="/hotels" className="hover:text-foreground transition-colors">Hotels</Link></li>
                  <li><Link href="/articles" className="hover:text-foreground transition-colors">Travel Guides</Link></li>
                  <li><Link href="/districts" className="hover:text-foreground transition-colors">Districts</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Categories</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/dining" className="hover:text-foreground transition-colors">Dining</Link></li>
                  <li><Link href="/transport" className="hover:text-foreground transition-colors">Transport</Link></li>
                  <li><Link href="/attractions?category=adventure" className="hover:text-foreground transition-colors">Adventure</Link></li>
                  <li><Link href="/attractions?category=culture" className="hover:text-foreground transition-colors">Culture</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                  <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
                  <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                  <li><Link href="/press" className="hover:text-foreground transition-colors">Press</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                  <li><Link href="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} Travi. All rights reserved.</p>
              <p>Made with care for Dubai travelers</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
