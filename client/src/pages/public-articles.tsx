import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Search, Clock, TrendingUp, ChevronRight, ArrowRight,
  Newspaper, Sparkles, Globe, Plane, UtensilsCrossed,
  Building2, ShoppingBag, Calendar, MapPin, Bell, Mail
} from "lucide-react";
import type { ContentWithRelations } from "@shared/schema";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { useState, useMemo, useRef } from "react";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const defaultPlaceholderImages = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
];

const CATEGORIES = [
  { id: "all", label: "All News", icon: Globe },
  { id: "attractions", label: "Attractions", icon: MapPin },
  { id: "hotels", label: "Hotels", icon: Building2 },
  { id: "food", label: "Food & Dining", icon: UtensilsCrossed },
  { id: "transport", label: "Transport", icon: Plane },
  { id: "events", label: "Events", icon: Calendar },
  { id: "tips", label: "Travel Tips", icon: Sparkles },
  { id: "news", label: "Breaking News", icon: Newspaper },
  { id: "shopping", label: "Shopping", icon: ShoppingBag },
];

const categoryLabels: Record<string, string> = {
  attractions: "Attractions",
  hotels: "Hotels",
  food: "Food & Dining",
  transport: "Transport",
  events: "Events",
  tips: "Travel Tips",
  news: "Breaking News",
  shopping: "Shopping",
};

const categoryColors: Record<string, string> = {
  attractions: "bg-emerald-600",
  hotels: "bg-blue-600",
  food: "bg-orange-600",
  transport: "bg-purple-600",
  events: "bg-pink-600",
  tips: "bg-cyan-600",
  news: "bg-red-600",
  shopping: "bg-amber-600",
};

const placeholderArticles = [
  { 
    id: "p1",
    title: "Dubai Expo City Announces Major New Attractions for 2025", 
    desc: "The iconic Expo site transforms into a world-class destination with new museums, entertainment venues, and innovative experiences.",
    category: "attractions",
    readTime: "5 min",
    featured: true,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=800&fit=crop"
  },
  { 
    id: "p2",
    title: "New Luxury Resort Opens on The Palm", 
    desc: "A stunning new beachfront property promises unparalleled luxury experiences",
    category: "hotels",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop"
  },
  { 
    id: "p3",
    title: "Dubai Metro Expansion: New Stations Coming Soon", 
    desc: "Major infrastructure upgrade will connect more neighborhoods to the city center",
    category: "transport",
    readTime: "3 min",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop"
  },
  { 
    id: "p4",
    title: "Top Chef Opens First Dubai Restaurant", 
    desc: "Award-winning chef brings innovative cuisine to the Middle East",
    category: "food",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=800&h=600&fit=crop"
  },
  { 
    id: "p5",
    title: "Dubai Shopping Festival 2025 Dates Announced", 
    desc: "Get ready for the biggest shopping event of the year with exclusive deals",
    category: "shopping",
    readTime: "3 min",
    image: "https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&h=600&fit=crop"
  },
  { 
    id: "p6",
    title: "Hidden Gems: Secret Spots Only Locals Know", 
    desc: "Discover Dubai's best-kept secrets for an authentic experience",
    category: "tips",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop"
  },
  { 
    id: "p7",
    title: "New Year's Eve Fireworks: Best Viewing Spots", 
    desc: "Where to watch the world's most spectacular New Year celebrations",
    category: "events",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop"
  },
  { 
    id: "p8",
    title: "UAE Visa Rules Update: What Travelers Need to Know", 
    desc: "Important changes to tourist visa regulations for 2025",
    category: "news",
    readTime: "4 min",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop"
  },
];

const breakingNews = [
  "Dubai Tourism hits record 18 million visitors in 2024",
  "New direct flights announced from 15 major cities",
  "Museum of the Future wins World's Best Building award",
  "Dubai Mall expansion adds 200 new stores",
  "Desert safari season extended with new experiences",
];

function BreakingNewsTicker() {
  const tickerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="bg-red-600 text-white py-2 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <span className="animate-pulse">
            <Bell className="w-4 h-4" />
          </span>
          <Badge className="bg-white text-red-600 border-0 font-bold text-xs">
            BREAKING
          </Badge>
        </div>
        <div className="overflow-hidden flex-1">
          <div 
            ref={tickerRef}
            className="flex gap-12 animate-marquee whitespace-nowrap"
          >
            {[...breakingNews, ...breakingNews].map((news, i) => (
              <span key={i} className="inline-flex items-center gap-2">
                <span className="text-sm font-medium">{news}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroArticle({ article, getDate, getReadTime }: { 
  article: ContentWithRelations | typeof placeholderArticles[0];
  getDate: (a: ContentWithRelations) => string;
  getReadTime: (a: ContentWithRelations) => string;
}) {
  const isReal = 'slug' in article;
  const title = isReal ? article.title : article.title;
  const desc = isReal ? (article.metaDescription || article.title) : article.desc;
  const category = isReal ? (article.article?.category || 'news') : article.category;
  const image = isReal ? (article.heroImage || defaultPlaceholderImages[0]) : article.image;
  const href = isReal ? `/articles/${article.slug}` : '#';
  const date = isReal ? getDate(article) : 'Dec 2024';
  const readTime = isReal ? getReadTime(article) : article.readTime;

  return (
    <Link href={href} data-testid="link-hero-featured-article">
      <div 
        className="group relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-2xl cursor-pointer"
        data-testid="hero-featured-article"
      >
        <img 
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="flex items-center gap-3 mb-4">
            <Badge className={`${categoryColors[category] || 'bg-cyan-600'} text-white border-0`}>
              {categoryLabels[category] || 'News'}
            </Badge>
            <span className="text-white/70 text-sm flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {readTime}
            </span>
            <span className="text-white/70 text-sm">{date}</span>
          </div>
          
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 max-w-4xl leading-tight">
            {title}
          </h1>
          
          <p className="text-white/80 text-base md:text-lg max-w-2xl line-clamp-2 mb-4">
            {desc}
          </p>
          
          <div className="flex items-center gap-2 text-white font-medium group-hover:gap-3 transition-all">
            <span>Read Full Story</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function CategoryStrip({ 
  title, 
  articles, 
  categoryId,
  getDate,
  getReadTime 
}: { 
  title: string;
  articles: Array<ContentWithRelations | typeof placeholderArticles[0]>;
  categoryId: string;
  getDate: (a: ContentWithRelations) => string;
  getReadTime: (a: ContentWithRelations) => string;
}) {
  if (articles.length === 0) return null;
  
  return (
    <section className="py-8" aria-label={title}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-1.5 h-8 rounded-full ${categoryColors[categoryId] || 'bg-primary'}`} />
            <h2 className="text-xl md:text-2xl font-bold text-foreground">{title}</h2>
          </div>
          <Link href={`/articles?category=${categoryId}`}>
            <Button variant="ghost" size="sm" className="text-muted-foreground" data-testid={`link-more-${categoryId}`}>
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {articles.slice(0, 4).map((article, index) => {
            const isReal = 'slug' in article;
            const title = isReal ? article.title : article.title;
            const category = isReal ? (article.article?.category || 'tips') : article.category;
            const image = isReal ? (article.heroImage || defaultPlaceholderImages[index % defaultPlaceholderImages.length]) : article.image;
            const href = isReal ? `/articles/${article.slug}` : '#';
            const readTime = isReal ? getReadTime(article) : article.readTime;
            
            return (
              <Link href={href} key={isReal ? article.id : article.id} data-testid={`link-strip-article-${isReal ? article.id : article.id}`}>
                <Card 
                  className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                  data-testid={`card-article-${isReal ? article.id : article.id}`}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={image}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {categoryLabels[category] || 'Travel'}
                      </Badge>
                      <span className="text-muted-foreground text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {readTime}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TrendingArticle({ 
  article, 
  index,
  getDate,
  getReadTime 
}: { 
  article: ContentWithRelations | typeof placeholderArticles[0];
  index: number;
  getDate: (a: ContentWithRelations) => string;
  getReadTime: (a: ContentWithRelations) => string;
}) {
  const isReal = 'slug' in article;
  const title = isReal ? article.title : article.title;
  const category = isReal ? (article.article?.category || 'tips') : article.category;
  const href = isReal ? `/articles/${article.slug}` : '#';
  const readTime = isReal ? getReadTime(article) : article.readTime;
  
  return (
    <Link href={href} data-testid={`link-trending-article-${index}`}>
      <div 
        className="group flex items-start gap-4 py-4 border-b border-border last:border-0 cursor-pointer"
        data-testid={`trending-article-${index}`}
      >
        <span className="text-3xl font-bold text-muted-foreground/30 group-hover:text-primary/50 transition-colors">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="flex-1 min-w-0">
          <Badge variant="outline" className="text-xs mb-2">
            {categoryLabels[category] || 'Travel'}
          </Badge>
          <h4 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h4>
          <span className="text-muted-foreground text-xs flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3" />
            {readTime}
          </span>
        </div>
      </div>
    </Link>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState("");
  
  return (
    <section className="py-12 bg-primary" aria-label="Newsletter signup">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-primary-foreground">
            <div className="w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Mail className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Stay Updated</h3>
              <p className="text-primary-foreground/80">Get the latest Dubai travel news delivered to your inbox</p>
            </div>
          </div>
          
          <form 
            onSubmit={(e) => e.preventDefault()} 
            className="flex w-full md:w-auto gap-2"
          >
            <div className="flex-1 md:w-80 bg-primary-foreground/10 rounded-lg border border-primary-foreground/20">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent px-4 py-3 text-primary-foreground placeholder:text-primary-foreground/50 outline-none"
                data-testid="input-newsletter-email"
              />
            </div>
            <Button 
              type="submit"
              variant="secondary"
              className="shrink-0"
              data-testid="button-newsletter-subscribe"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

function ArticleGridCard({ 
  article, 
  index,
  getDate,
  getReadTime,
  featured = false 
}: { 
  article: ContentWithRelations | typeof placeholderArticles[0];
  index: number;
  getDate: (a: ContentWithRelations) => string;
  getReadTime: (a: ContentWithRelations) => string;
  featured?: boolean;
}) {
  const isReal = 'slug' in article;
  const title = isReal ? article.title : article.title;
  const desc = isReal ? (article.metaDescription || '') : article.desc;
  const category = isReal ? (article.article?.category || 'tips') : article.category;
  const image = isReal ? (article.heroImage || defaultPlaceholderImages[index % defaultPlaceholderImages.length]) : article.image;
  const href = isReal ? `/articles/${article.slug}` : '#';
  const date = isReal ? getDate(article) : 'Dec 2024';
  const readTime = isReal ? getReadTime(article) : article.readTime;
  
  return (
    <Link href={href} data-testid={`link-grid-article-${isReal ? article.id : article.id}`}>
      <Card 
        className={`group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer ${
          featured ? 'md:col-span-2 md:row-span-2' : ''
        }`}
        data-testid={`grid-article-${isReal ? article.id : article.id}`}
      >
        <div className={`overflow-hidden ${featured ? 'aspect-[16/9]' : 'aspect-video'}`}>
          <img 
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="p-4 md:p-5">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge className={`${categoryColors[category] || 'bg-cyan-600'} text-white border-0 text-xs`}>
              {categoryLabels[category] || 'Travel'}
            </Badge>
            <span className="text-muted-foreground text-xs">{date}</span>
            <span className="text-muted-foreground text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readTime}
            </span>
          </div>
          <h3 className={`font-bold text-foreground group-hover:text-primary transition-colors ${
            featured ? 'text-xl md:text-2xl mb-2' : 'text-base line-clamp-2'
          }`}>
            {title}
          </h3>
          {featured && desc && (
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {desc}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}

export default function PublicArticles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  
  useDocumentMeta({
    title: "Dubai News & Travel Updates | Travi - Dubai Travel Portal",
    description: "Stay updated with the latest Dubai news, travel tips, attractions, hotels, dining, and events. Your complete Dubai travel news portal.",
    ogTitle: "Dubai News & Travel Updates | Travi",
    ogDescription: "Breaking news, travel guides, and updates for Dubai visitors. Your complete Dubai travel news portal.",
    ogType: "website",
  });
  
  const { data: allContent, isLoading } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/contents?status=published&includeExtensions=true"],
  });

  const articles = allContent?.filter(c => c.type === "article") || [];

  function getArticleDate(content: ContentWithRelations) {
    return content.publishedAt 
      ? format(new Date(content.publishedAt), "MMM d, yyyy")
      : content.createdAt 
        ? format(new Date(content.createdAt), "MMM d, yyyy")
        : "Recent";
  }

  function getReadTime(content: ContentWithRelations) {
    const blocks = content.blocks as Array<{type: string, content?: {text?: string}}> | null;
    if (!blocks) return "5 min";
    const textContent = blocks
      .filter(b => b.type === "text")
      .map(b => b.content?.text || "")
      .join(" ");
    const wordCount = textContent.split(/\s+/).length;
    const minutes = Math.max(3, Math.ceil(wordCount / 200));
    return `${minutes} min`;
  }
  
  type PlaceholderArticle = typeof placeholderArticles[0];
  type AnyArticle = ContentWithRelations | PlaceholderArticle;
  
  const displayArticles = useMemo((): AnyArticle[] => {
    let result: AnyArticle[] = articles.length > 0 ? articles : placeholderArticles;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => a.title.toLowerCase().includes(query));
    }
    
    if (activeCategory !== "all") {
      result = result.filter(a => {
        const cat = 'slug' in a ? (a.article?.category || 'tips') : a.category;
        return cat === activeCategory;
      });
    }
    
    return result;
  }, [articles, searchQuery, activeCategory]);
  
  const featuredArticle = displayArticles[0];
  const trendingArticles = displayArticles.slice(1, 6);
  const latestArticles = displayArticles.slice(1, 9);
  
  const articlesByCategory = useMemo(() => {
    const source = articles.length > 0 ? articles : placeholderArticles;
    const grouped: Record<string, Array<ContentWithRelations | typeof placeholderArticles[0]>> = {};
    
    source.forEach(article => {
      const cat = 'slug' in article ? (article.article?.category || 'tips') : article.category;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(article);
    });
    
    return grouped;
  }, [articles]);

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>
      
      <PublicNav />
      
      <BreakingNewsTicker />

      <main id="main-content" className="flex-1">
        {/* Hero Section */}
        <section className="py-6 md:py-10" aria-label="Featured article">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="aspect-[21/9] bg-muted rounded-2xl animate-pulse" />
            ) : featuredArticle ? (
              <HeroArticle 
                article={featuredArticle} 
                getDate={getArticleDate}
                getReadTime={getReadTime}
              />
            ) : null}
          </div>
        </section>

        {/* Category Filter Bar */}
        <section className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b" aria-label="Category filters">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <Button
                    key={cat.id}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`shrink-0 ${isActive ? '' : 'text-muted-foreground'}`}
                    data-testid={`filter-category-${cat.id}`}
                  >
                    <Icon className="w-4 h-4 mr-1.5" />
                    {cat.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <section className="py-6 bg-muted/30" aria-label="Search">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1 max-w-xl">
                <div className="bg-background border rounded-xl p-1 flex items-center gap-2 shadow-sm">
                  <Search className="w-5 h-5 text-muted-foreground ml-3" />
                  <input
                    type="text"
                    placeholder="Search news and articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent outline-none py-2.5 text-foreground"
                    data-testid="input-search-articles"
                  />
                </div>
              </div>
              <p className="text-muted-foreground text-sm" data-testid="text-articles-count">
                {isLoading ? "Loading..." : `${displayArticles.length} articles`}
              </p>
            </div>
          </div>
        </section>

        {/* Main Content Grid with Trending Sidebar */}
        <section className="py-8" aria-label="Latest news">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Grid */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-8 rounded-full bg-primary" />
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">Latest News</h2>
                </div>
                
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className="aspect-video bg-muted rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {latestArticles.map((article, index) => (
                      <ArticleGridCard
                        key={'slug' in article ? article.id : article.id}
                        article={article}
                        index={index}
                        getDate={getArticleDate}
                        getReadTime={getReadTime}
                        featured={index === 0}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Trending Sidebar */}
              <div className="lg:col-span-1">
                <Card className="p-5 sticky top-20">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-lg">Trending Now</h3>
                  </div>
                  
                  {isLoading ? (
                    <div className="space-y-4">
                      {[0, 1, 2, 3, 4].map(i => (
                        <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div>
                      {trendingArticles.map((article, index) => (
                        <TrendingArticle
                          key={'slug' in article ? article.id : article.id}
                          article={article}
                          index={index}
                          getDate={getArticleDate}
                          getReadTime={getReadTime}
                        />
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Category Strips */}
        {activeCategory === "all" && Object.entries(articlesByCategory).slice(0, 3).map(([categoryId, categoryArticles]) => (
          <CategoryStrip
            key={categoryId}
            title={categoryLabels[categoryId] || categoryId}
            articles={categoryArticles}
            categoryId={categoryId}
            getDate={getArticleDate}
            getReadTime={getReadTime}
          />
        ))}

        {/* Promotional Banner */}
        <section className="py-8" aria-label="Promotion">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 p-8 md:p-12">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                }} />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-white text-center md:text-left">
                  <Badge className="bg-white/20 text-white border-0 mb-3">
                    Special Feature
                  </Badge>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">Dubai Shopping Festival 2025</h3>
                  <p className="text-white/90 max-w-lg">
                    Don't miss the world's biggest shopping extravaganza with incredible deals, prizes, and entertainment.
                  </p>
                </div>
                <Button 
                  size="lg" 
                  className="bg-white text-orange-600 border-white shrink-0"
                  data-testid="button-promo-dsf"
                >
                  Learn More <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <NewsletterSection />
      </main>

      <PublicFooter />
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
