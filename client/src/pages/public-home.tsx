import { Search, Building2, Mountain, Landmark, BookOpen, Utensils, Bus, Sparkles, Menu, MapPin, Star, Clock, ChevronRight, X, Bed, FileText, User, TrendingUp, Ticket, Eye, Calendar, ArrowRight, Flame } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import type { Content, ContentWithRelations } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
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

interface StatsData {
  totalContent: number;
  published: number;
  drafts: number;
  inReview: number;
  attractions: number;
  hotels: number;
  articles: number;
}


function ContentCard({ content, index }: { content: Content; index: number }) {
  const imageUrl = content.heroImage || defaultPlaceholderImages[index % defaultPlaceholderImages.length];
  const contentPath = `/${content.type}s/${content.slug}`;
  
  return (
    <Link href={contentPath}>
      <article>
        <Card className="group overflow-hidden border-0 shadow-[var(--shadow-level-1)] hover:shadow-[var(--shadow-level-2)] transition-all duration-300 cursor-pointer">
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
          <div className="p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium capitalize">
                {content.type}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                <span className="sr-only">Rating:</span> 4.8
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
      </article>
    </Link>
  );
}

function ContentCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 shadow-md animate-pulse" aria-hidden="true">
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

function HotelCard({ content, index }: { content: Content; index: number }) {
  const imageUrl = content.heroImage || defaultPlaceholderImages[index % defaultPlaceholderImages.length];
  const contentPath = `/hotels/${content.slug}`;
  
  return (
    <Link href={contentPath}>
      <article>
        <Card className="group overflow-hidden border-0 shadow-[var(--shadow-level-1)] hover:shadow-[var(--shadow-level-2)] transition-all duration-300 cursor-pointer">
          <div className="aspect-[16/10] overflow-hidden relative">
            <img 
              src={imageUrl} 
              alt={content.heroImageAlt || content.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              width={600}
              height={375}
            />
            <div className="absolute top-3 left-3">
              <Badge className="bg-[#6443F4] text-white text-xs">
                <Bed className="w-3 h-3 mr-1" aria-hidden="true" />
                Hotel
              </Badge>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-heading font-semibold text-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">
              {content.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
              {content.metaDescription || "Experience luxury and comfort in Dubai."}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                4.8
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" aria-hidden="true" />
                Dubai
              </span>
            </div>
          </div>
        </Card>
      </article>
    </Link>
  );
}

function AttractionCard({ content, index }: { content: Content; index: number }) {
  const imageUrl = content.heroImage || defaultPlaceholderImages[index % defaultPlaceholderImages.length];
  const contentPath = `/attractions/${content.slug}`;
  
  return (
    <Link href={contentPath}>
      <article>
        <Card className="group overflow-hidden border-0 shadow-[var(--shadow-level-1)] hover:shadow-[var(--shadow-level-2)] transition-all duration-300 cursor-pointer">
          <div className="aspect-[4/3] overflow-hidden relative">
            <img 
              src={imageUrl} 
              alt={content.heroImageAlt || content.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              width={600}
              height={450}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="font-heading font-semibold text-white line-clamp-2 drop-shadow-lg">
                {content.title}
              </h3>
            </div>
          </div>
          <div className="p-3">
            <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mountain className="w-3 h-3 text-[#F94498]" aria-hidden="true" />
                Attraction
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                4.9
              </span>
            </div>
          </div>
        </Card>
      </article>
    </Link>
  );
}

function NewsArticleCard({ content, index, variant = "default" }: { content: ContentWithRelations; index: number; variant?: "hero" | "secondary" | "sidebar" | "default" }) {
  const imageUrl = content.heroImage || defaultPlaceholderImages[index % defaultPlaceholderImages.length];
  const contentPath = `/articles/${content.slug}`;
  const authorName = content.author ? `${content.author.firstName || ''} ${content.author.lastName || ''}`.trim() : null;
  const readTime = Math.max(3, Math.floor(Math.random() * 8) + 3);
  const category = (content as ContentWithRelations & { article?: { category?: string } }).article?.category || "Travel";
  
  if (variant === "hero") {
    return (
      <Link href={contentPath} data-testid="link-article-hero">
        <article className="relative group cursor-pointer">
          <div className="aspect-[16/9] lg:aspect-[21/9] overflow-hidden rounded-xl">
            <img 
              src={imageUrl} 
              alt={content.heroImageAlt || content.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="eager"
              width={1200}
              height={500}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-3">
              <Badge className="bg-[#F94498] text-white text-xs font-semibold uppercase tracking-wide">
                <TrendingUp className="w-3 h-3 mr-1" aria-hidden="true" />
                Featured
              </Badge>
              <Badge variant="outline" className="bg-white/10 border-white/30 text-white text-xs backdrop-blur-sm">
                {category}
              </Badge>
            </div>
            <h3 className="font-heading text-2xl lg:text-3xl xl:text-4xl font-bold text-white line-clamp-2 mb-3 drop-shadow-lg group-hover:text-[#FFD112] transition-colors">
              {content.title}
            </h3>
            <p className="text-white/80 line-clamp-2 mb-4 max-w-2xl text-sm lg:text-base">
              {content.metaDescription || "Discover insights and tips for your Dubai adventure."}
            </p>
            <div className="flex items-center gap-4 text-white/70 text-sm">
              {authorName && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" aria-hidden="true" />
                  <span data-testid="text-author-name">{authorName}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" aria-hidden="true" />
                <span>{readTime} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" aria-hidden="true" />
                <span>{Math.floor(Math.random() * 5000) + 1000} views</span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  if (variant === "secondary") {
    return (
      <Link href={contentPath} data-testid={`link-article-secondary-${content.id}`}>
        <article className="group cursor-pointer">
          <Card className="overflow-hidden border-0 shadow-[var(--shadow-level-1)] hover:shadow-[var(--shadow-level-2)] transition-all duration-300 h-full">
            <div className="aspect-[16/9] overflow-hidden relative">
              <img 
                src={imageUrl} 
                alt={content.heroImageAlt || content.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                width={400}
                height={225}
              />
              <div className="absolute top-3 left-3">
                <Badge className="bg-[#6443F4] text-white text-xs">
                  {category}
                </Badge>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-heading font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                {content.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {content.metaDescription || "Discover insights and tips for your Dubai adventure."}
              </p>
              <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  {authorName && (
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" aria-hidden="true" />
                      <span data-testid="text-author-name" className="truncate max-w-[100px]">{authorName}</span>
                    </span>
                  )}
                </div>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  {readTime} min
                </span>
              </div>
            </div>
          </Card>
        </article>
      </Link>
    );
  }

  if (variant === "sidebar") {
    return (
      <Link href={contentPath} data-testid={`link-article-sidebar-${content.id}`}>
        <article className="group cursor-pointer">
          <div className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="w-20 h-20 shrink-0 overflow-hidden rounded-lg">
              <img 
                src={imageUrl} 
                alt={content.heroImageAlt || content.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                width={80}
                height={80}
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <Badge variant="secondary" className="w-fit text-xs mb-1.5 px-2 py-0">
                {category}
              </Badge>
              <h3 className="font-heading font-medium text-foreground line-clamp-2 text-sm group-hover:text-primary transition-colors leading-snug">
                {content.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1.5">
                <Clock className="w-3 h-3" aria-hidden="true" />
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }
  
  return (
    <Link href={contentPath} data-testid={`link-article-${content.id}`}>
      <article>
        <Card className="group overflow-hidden border-0 shadow-[var(--shadow-level-1)] hover:shadow-[var(--shadow-level-2)] transition-all duration-300 cursor-pointer flex gap-4 p-4">
          <div className="w-24 h-24 shrink-0 overflow-hidden rounded-lg">
            <img 
              src={imageUrl} 
              alt={content.heroImageAlt || content.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              width={96}
              height={96}
            />
          </div>
          <div className="flex-1 min-w-0">
            <Badge variant="outline" className="text-xs mb-2">
              <FileText className="w-3 h-3 mr-1" aria-hidden="true" />
              Article
            </Badge>
            <h3 className="font-heading font-semibold text-foreground line-clamp-2 text-sm group-hover:text-primary transition-colors">
              {content.title}
            </h3>
            {authorName && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <User className="w-3 h-3" aria-hidden="true" />
                <span data-testid="text-author-name">{authorName}</span>
              </div>
            )}
          </div>
        </Card>
      </article>
    </Link>
  );
}

function HotAttractionCard({ content, index }: { content: Content; index: number }) {
  const imageUrl = content.heroImage || defaultPlaceholderImages[index % defaultPlaceholderImages.length];
  const contentPath = `/attractions/${content.slug}`;
  
  return (
    <Link href={contentPath} data-testid={`link-hot-attraction-${content.id}`}>
      <article className="group cursor-pointer">
        <Card className="overflow-hidden border-0 shadow-[var(--shadow-level-1)] hover:shadow-[var(--shadow-level-2)] transition-all duration-300">
          <div className="aspect-[4/3] overflow-hidden relative">
            <img 
              src={imageUrl} 
              alt={content.heroImageAlt || content.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              width={400}
              height={300}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute top-3 left-3">
              <Badge className="bg-[#F94498] text-white text-xs font-semibold">
                <Flame className="w-3 h-3 mr-1" aria-hidden="true" />
                Hot
              </Badge>
            </div>
            <div className="absolute top-3 right-3">
              <Badge className="bg-white/90 text-foreground text-xs backdrop-blur-sm">
                <Star className="w-3 h-3 mr-1 fill-amber-400 text-amber-400" aria-hidden="true" />
                4.9
              </Badge>
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <h3 className="font-heading font-semibold text-white line-clamp-2 text-lg drop-shadow-lg mb-1">
                {content.title}
              </h3>
              <p className="text-white/80 text-sm line-clamp-1">
                {content.metaDescription || "Experience the magic of Dubai"}
              </p>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-[#F94498]" aria-hidden="true" />
              <span>Dubai</span>
            </div>
            <Button size="sm" className="bg-[#6443F4] hover:bg-[#5335d4] text-white font-medium shadow-md" data-testid={`button-book-${index}`}>
              <Ticket className="w-4 h-4 mr-1.5" aria-hidden="true" />
              Book Now
            </Button>
          </div>
        </Card>
      </article>
    </Link>
  );
}

export default function PublicHome() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Fetch homepage promotions for each section
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

  // Fallback to published content if no promotions
  const { data: publishedContent } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/contents?status=published"],
  });

  // Get active content from promotions
  const getActiveContent = (promotions: HomepagePromotion[]): ContentWithRelations[] => {
    return promotions
      .filter(p => p.isActive && p.content)
      .map(p => p.content!)
      .slice(0, 4);
  };

  const featuredContent = getActiveContent(featuredPromotions).length > 0 
    ? getActiveContent(featuredPromotions) 
    : (publishedContent?.slice(0, 4) || []);
  
  const attractionsContent = getActiveContent(attractionsPromotions).length > 0
    ? getActiveContent(attractionsPromotions)
    : (publishedContent?.filter(c => c.type === "attraction").slice(0, 4) || []);
  
  const hotelsContent = getActiveContent(hotelsPromotions).length > 0
    ? getActiveContent(hotelsPromotions)
    : (publishedContent?.filter(c => c.type === "hotel").slice(0, 4) || []);
  
  const articlesContent = getActiveContent(articlesPromotions).length > 0
    ? getActiveContent(articlesPromotions)
    : (publishedContent?.filter(c => c.type === "article").slice(0, 6) || []);

  const isLoading = featuredLoading;
  const hasContent = featuredContent.length > 0;

  const displayStats = [
    { value: statsData?.hotels ? `${statsData.hotels}+` : "500+", label: "Hotels Listed" },
    { value: statsData?.attractions ? `${statsData.attractions}+` : "200+", label: "Attractions" },
    { value: statsData?.articles ? `${statsData.articles}+` : "100+", label: "Articles" },
    { value: statsData?.published ? `${statsData.published}` : "1000+", label: "Published Guides" },
  ];

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
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md">
        Skip to main content
      </a>

      {/* Navigation */}
      <header>
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b" data-testid="nav-header" aria-label="Main navigation">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Logo variant="primary" height={28} />

              {/* Desktop nav */}
              <div className="hidden md:flex items-center gap-8" role="navigation" aria-label="Primary">
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
                  className="md:hidden p-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  data-testid="button-mobile-menu"
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-menu"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <nav id="mobile-menu" className="md:hidden border-t bg-background p-4" aria-label="Mobile navigation">
              <div className="flex flex-col gap-2">
                <Link href="/hotels" className="py-2 px-4 hover:bg-muted rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary" data-testid="link-hotels-mobile" onClick={() => setMobileMenuOpen(false)}>Hotels</Link>
                <Link href="/attractions" className="py-2 px-4 hover:bg-muted rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary" data-testid="link-attractions-mobile" onClick={() => setMobileMenuOpen(false)}>Attractions</Link>
                <Link href="/dining" className="py-2 px-4 hover:bg-muted rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary" data-testid="link-dining-mobile" onClick={() => setMobileMenuOpen(false)}>Dining</Link>
                <Link href="/districts" className="py-2 px-4 hover:bg-muted rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary" data-testid="link-districts-mobile" onClick={() => setMobileMenuOpen(false)}>Districts</Link>
                <Link href="/transport" className="py-2 px-4 hover:bg-muted rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary" data-testid="link-transport-mobile" onClick={() => setMobileMenuOpen(false)}>Transport</Link>
                <Link href="/articles" className="py-2 px-4 hover:bg-muted rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary" data-testid="link-articles-mobile" onClick={() => setMobileMenuOpen(false)}>Articles</Link>
                <div className="border-t my-2" />
                <Link href="/admin" className="py-2 px-4 hover:bg-muted rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary" data-testid="link-admin-mobile" onClick={() => setMobileMenuOpen(false)}>Admin Panel</Link>
              </div>
            </nav>
          )}
        </nav>
      </header>

      <main id="main-content">
        {/* Hero Section - Using brand purple gradient */}
        <section className="pt-24 pb-16 sm:pt-32 sm:pb-24 bg-gradient-to-br from-[#6443F4] via-[#7c5cf7] to-[#F94498] relative overflow-hidden" data-testid="section-hero" aria-labelledby="hero-heading">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50" aria-hidden="true" />
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#FF9327] rounded-full blur-3xl opacity-20" aria-hidden="true" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#FFD112] rounded-full blur-3xl opacity-20" aria-hidden="true" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-5 py-2.5 mb-6 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-[#FFD112]" aria-hidden="true" />
                <span className="text-white text-sm font-semibold tracking-wide">Your Dubai Travel Companion</span>
              </div>
              
              <h1 id="hero-heading" className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                Discover the Magic of
                <span className="block bg-gradient-to-r from-[#FFD112] via-[#FF9327] to-[#FFD112] bg-clip-text text-transparent">Dubai</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Explore world-class hotels, stunning attractions, and unforgettable experiences in the city of dreams.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto px-2">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSearch(); }} 
                  role="search" 
                  className="bg-white rounded-2xl shadow-2xl p-2 flex items-center gap-2"
                >
                  <div className="flex-1 flex items-center gap-2 sm:gap-3 px-2 sm:px-4 min-w-0">
                    <Search className="w-5 h-5 text-muted-foreground shrink-0" aria-hidden="true" />
                    <label htmlFor="hero-search" className="sr-only">Search hotels, attractions, articles</label>
                    <input
                      id="hero-search"
                      type="search"
                      placeholder="Search hotels, attractions, articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      className="flex-1 text-foreground placeholder:text-muted-foreground bg-transparent outline-none py-3 text-sm sm:text-base min-w-0 focus:ring-0"
                      data-testid="input-search"
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="bg-[#F94498] hover:bg-[#e03587] text-white font-semibold rounded-xl px-4 sm:px-8 py-6 shrink-0 shadow-lg" 
                    data-testid="button-search"
                  >
                    <Search className="w-5 h-5 sm:hidden" aria-hidden="true" />
                    <span className="hidden sm:inline">Search</span>
                    <span className="sr-only sm:hidden">Search</span>
                  </Button>
                </form>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto" role="list" aria-label="Travi statistics">
              {displayStats.map((stat, index) => (
                <div key={index} className="text-center" role="listitem">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-white/70 text-sm sm:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hot Attractions Section */}
        {attractionsContent.length > 0 && (
          <section className="py-12 sm:py-16 bg-background" data-testid="section-hot-attractions" aria-labelledby="hot-attractions-heading">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F94498] to-[#FF6B35] flex items-center justify-center">
                    <Flame className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 id="hot-attractions-heading" className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                      Hot Right Now
                    </h2>
                    <p className="text-muted-foreground text-sm">Trending attractions everyone's talking about</p>
                  </div>
                </div>
                <Link href="/attractions">
                  <Button variant="outline" className="hidden sm:flex border-[#F94498] text-[#F94498] hover:bg-[#F94498]/10" data-testid="button-view-all-hot">
                    View All <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list" aria-label="Hot attractions">
                {attractionsLoading ? (
                  [0, 1, 2, 3].map((index) => <ContentCardSkeleton key={index} />)
                ) : (
                  attractionsContent.slice(0, 4).map((content, index) => (
                    <HotAttractionCard key={content.id} content={content} index={index} />
                  ))
                )}
              </div>

              <div className="mt-8 text-center sm:hidden">
                <Link href="/attractions">
                  <Button className="bg-[#F94498] hover:bg-[#e03587] text-white font-semibold" data-testid="button-view-all-hot-mobile">
                    Explore All Hot Attractions
                    <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Categories */}
        <section className="py-12 sm:py-16 bg-muted/30" data-testid="section-categories" aria-labelledby="categories-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 id="categories-heading" className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Explore Dubai
              </h2>
              <p className="text-muted-foreground">Find exactly what you're looking for</p>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4" role="list" aria-label="Browse categories">
              {exploreCategories.map((category, index) => {
                const IconComponent = category.icon;
                const gradients = [
                  "from-[#6443F4] to-[#8f6cfa]",
                  "from-[#F94498] to-[#fb6eb0]",
                  "from-[#FF9327] to-[#ffb35c]",
                  "from-[#02A65C] to-[#1ed47f]",
                  "from-[#6443F4] to-[#F94498]",
                  "from-[#FFD112] to-[#FF9327]",
                ];
                return (
                  <Link
                    key={index}
                    href={category.href}
                    className="flex flex-col items-center p-4 sm:p-6 rounded-2xl bg-card border hover:border-primary/50 hover:shadow-xl transition-all duration-300 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    data-testid={`card-category-${index}`}
                    role="listitem"
                    aria-label={`${category.title} - ${category.count} listings`}
                  >
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${gradients[index]} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md`}>
                      <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" aria-hidden="true" />
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
        <section className="py-12 sm:py-16 bg-muted/30" data-testid="section-featured" aria-labelledby="featured-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <h2 id="featured-heading" className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Popular Destinations
                </h2>
                <p className="text-muted-foreground">Discover the best Dubai has to offer</p>
              </div>
              <Link href="/attractions">
                <Button variant="ghost" className="text-primary hidden sm:flex">
                  View All <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list" aria-label="Featured destinations">
              {isLoading ? (
                <>
                  {[0, 1, 2, 3].map((index) => (
                    <ContentCardSkeleton key={index} />
                  ))}
                  <p className="sr-only">Loading destinations...</p>
                </>
              ) : hasContent ? (
                featuredContent.map((content, index) => (
                  <ContentCard key={content.id} content={content} index={index} />
                ))
              ) : (
                <div className="col-span-full text-center py-12" data-testid="text-featured-empty">
                  <p className="text-muted-foreground">Content coming soon. Check back for exciting destinations!</p>
                </div>
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

        {/* Hotels Section */}
        {hotelsContent.length > 0 && (
          <section className="py-12 sm:py-16 bg-background" data-testid="section-hotels" aria-labelledby="hotels-heading">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-4 mb-8">
                <div>
                  <h2 id="hotels-heading" className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    Top Hotels
                  </h2>
                  <p className="text-muted-foreground">Luxury stays for every budget</p>
                </div>
                <Link href="/hotels">
                  <Button variant="ghost" className="text-primary hidden sm:flex">
                    View All <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list" aria-label="Featured hotels">
                {hotelsLoading ? (
                  [0, 1, 2, 3].map((index) => <ContentCardSkeleton key={index} />)
                ) : (
                  hotelsContent.map((content, index) => (
                    <HotelCard key={content.id} content={content} index={index} />
                  ))
                )}
              </div>

              <div className="mt-8 text-center sm:hidden">
                <Link href="/hotels">
                  <Button variant="outline" className="text-primary border-primary">
                    View All Hotels
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Attractions Section */}
        {attractionsContent.length > 0 && (
          <section className="py-12 sm:py-16 bg-muted/30" data-testid="section-attractions" aria-labelledby="attractions-heading">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-4 mb-8">
                <div>
                  <h2 id="attractions-heading" className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    Must-See Attractions
                  </h2>
                  <p className="text-muted-foreground">Iconic landmarks and hidden gems</p>
                </div>
                <Link href="/attractions">
                  <Button variant="ghost" className="text-primary hidden sm:flex">
                    View All <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list" aria-label="Featured attractions">
                {attractionsLoading ? (
                  [0, 1, 2, 3].map((index) => <ContentCardSkeleton key={index} />)
                ) : (
                  attractionsContent.map((content, index) => (
                    <AttractionCard key={content.id} content={content} index={index} />
                  ))
                )}
              </div>

              <div className="mt-8 text-center sm:hidden">
                <Link href="/attractions">
                  <Button variant="outline" className="text-primary border-primary">
                    View All Attractions
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Articles Section - News Style Layout */}
        {articlesContent.length > 0 && (
          <section className="py-12 sm:py-16 bg-background" data-testid="section-articles" aria-labelledby="articles-heading">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6443F4] to-[#8f6cfa] flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 id="articles-heading" className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                      Latest News & Guides
                    </h2>
                    <p className="text-muted-foreground text-sm">Stay informed with expert travel insights</p>
                  </div>
                </div>
                <Link href="/articles">
                  <Button variant="outline" className="hidden sm:flex" data-testid="button-view-all-articles">
                    All Articles <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-6" role="list" aria-label="Featured articles">
                {articlesLoading ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {[0, 1, 2].map((index) => <ContentCardSkeleton key={index} />)}
                  </div>
                ) : (
                  <>
                    {articlesContent[0] && (
                      <NewsArticleCard content={articlesContent[0]} index={0} variant="hero" />
                    )}
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {articlesContent.slice(1, 3).map((content, index) => (
                          <NewsArticleCard key={content.id} content={content} index={index + 1} variant="secondary" />
                        ))}
                      </div>
                      
                      <div className="lg:col-span-1">
                        <Card className="border-0 shadow-[var(--shadow-level-1)] p-4 h-full">
                          <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                            <TrendingUp className="w-4 h-4 text-[#F94498]" aria-hidden="true" />
                            <h3 className="font-heading font-semibold text-foreground">Trending</h3>
                          </div>
                          <div className="space-y-1">
                            {articlesContent.slice(3, 6).map((content, index) => (
                              <NewsArticleCard key={content.id} content={content} index={index + 3} variant="sidebar" />
                            ))}
                          </div>
                        </Card>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-8 text-center sm:hidden">
                <Link href="/articles">
                  <Button className="bg-[#6443F4] hover:bg-[#5335d4] text-white font-semibold" data-testid="button-view-all-articles-mobile">
                    Explore All Articles
                    <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Features */}
        <section className="py-12 sm:py-16 bg-gradient-to-b from-background to-muted/30" data-testid="section-features" aria-labelledby="features-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 id="features-heading" className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Why Choose Travi?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Your trusted companion for exploring Dubai's wonders
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8" role="list" aria-label="Travi features">
              <Card className="p-6 text-center border-0 shadow-[var(--shadow-level-2)] hover:shadow-[var(--shadow-level-3)] transition-shadow" role="listitem">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5335d4] to-[#6443F4] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <MapPin className="w-7 h-7 text-white" aria-hidden="true" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">Curated Experiences</h3>
                <p className="text-muted-foreground text-sm">
                  Hand-picked destinations and hidden gems verified by local experts
                </p>
              </Card>

              <Card className="p-6 text-center border-0 shadow-[var(--shadow-level-2)] hover:shadow-[var(--shadow-level-3)] transition-shadow" role="listitem">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8a4509] to-[#a85c10] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Star className="w-7 h-7 text-white" aria-hidden="true" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">Trusted Reviews</h3>
                <p className="text-muted-foreground text-sm">
                  Authentic ratings and reviews from real travelers worldwide
                </p>
              </Card>

              <Card className="p-6 text-center border-0 shadow-[var(--shadow-level-2)] hover:shadow-[var(--shadow-level-3)] transition-shadow" role="listitem">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#9a2358] to-[#b82868] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Clock className="w-7 h-7 text-white" aria-hidden="true" />
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
        <section className="py-16 sm:py-20 bg-gradient-to-br from-[#6443F4] via-[#7c5cf7] to-[#F94498] relative overflow-hidden" data-testid="section-cta" aria-labelledby="cta-heading">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-50" aria-hidden="true" />
          <div className="absolute top-10 right-20 w-40 h-40 bg-[#FFD112] rounded-full blur-3xl opacity-20" aria-hidden="true" />
          <div className="absolute bottom-10 left-20 w-32 h-32 bg-[#FF9327] rounded-full blur-3xl opacity-20" aria-hidden="true" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <h2 id="cta-heading" className="font-heading text-2xl sm:text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Ready to Explore Dubai?
            </h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto text-lg">
              Browse our collection of hotels, attractions, and travel guides to plan your perfect Dubai adventure.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/hotels">
                <Button className="bg-gradient-to-r from-[#FFD112] to-[#FF9327] hover:from-[#e5b800] hover:to-[#e87e1c] text-[#1a1a2e] font-semibold rounded-full px-8 py-6 text-lg shadow-xl">
                  Browse Hotels
                </Button>
              </Link>
              <Link href="/attractions">
                <Button variant="outline" className="border-2 border-white/80 text-white hover:bg-white/10 rounded-full px-8 py-6 text-lg backdrop-blur-sm">
                  Explore Attractions
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-[#1a1a2e] text-white" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <Logo variant="dark-bg" height={28} />
              <p className="text-white/60 text-sm mt-4">
                Your trusted companion for exploring Dubai's wonders. Curated travel guides, hotels, and attractions.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Explore</h3>
              <nav className="flex flex-col gap-2 text-white/60 text-sm" aria-label="Explore links">
                <Link href="/hotels" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded w-fit">Hotels</Link>
                <Link href="/attractions" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded w-fit">Attractions</Link>
                <Link href="/dining" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded w-fit">Dining</Link>
              </nav>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Discover</h3>
              <nav className="flex flex-col gap-2 text-white/60 text-sm" aria-label="Discover links">
                <Link href="/districts" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded w-fit">Districts</Link>
                <Link href="/transport" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded w-fit">Transport</Link>
                <Link href="/articles" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded w-fit">Articles</Link>
              </nav>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <nav className="flex flex-col gap-2 text-white/60 text-sm" aria-label="Legal links">
                <Link href="/privacy" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded w-fit">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded w-fit">Terms of Service</Link>
                <Link href="/admin" className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded w-fit">Admin</Link>
              </nav>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              2024 Travi. All rights reserved.
            </p>
            <p className="text-white/40 text-sm">
              Made with care for Dubai travelers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
