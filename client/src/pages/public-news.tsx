import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Newspaper, Building2, Calendar, Hotel, Utensils,
  Clock, ChevronRight, TrendingUp, Mail, ArrowRight,
  Plane, Globe, Eye, Ticket, AlertTriangle, Tag,
  Users, BookOpen, ExternalLink, Flame, Sun, Shield, Camera,
  Star, MapPin, CreditCard, Lightbulb, Compass, Briefcase, Heart, Loader2
} from "lucide-react";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { PageContainer, Section, ContentCard, CategoryGrid } from "@/components/public-layout";
import { PublicHero } from "@/components/public-hero";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ContentWithRelations } from "@shared/schema";

const defaultImages = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&h=600&fit=crop",
];

const TRAVEL_TIPS = [
  { id: 1, title: "Best Time to Visit Dubai", category: "Planning", description: "November to March offers perfect weather", icon: Calendar },
  { id: 2, title: "Dubai Dress Code Guide", category: "Culture", description: "Respectful attire for malls and attractions", icon: Users },
  { id: 3, title: "Metro Navigation Tips", category: "Transport", description: "Gold class, women's cabin, and nol cards", icon: MapPin },
  { id: 4, title: "Best Exchange Rates", category: "Money", description: "Where to get the best AED rates", icon: CreditCard },
];

const THIS_WEEK = [
  { day: "Mon", date: "23", event: "DSF Grand Opening", color: "bg-[#F94498]" },
  { day: "Wed", date: "25", event: "Christmas at Expo City", color: "bg-[#02A65C]" },
  { day: "Fri", date: "27", event: "Concert at Coca-Cola", color: "bg-[#6443F4]" },
  { day: "Sat", date: "28", event: "Food Truck Festival", color: "bg-[#FF9327]" },
];

const HOT_DEALS = [
  { title: "Atlantis The Palm", discount: "40% OFF", icon: Hotel },
  { title: "Emirates Business", discount: "From AED 9,999", icon: Plane },
  { title: "IMG Worlds 2-for-1", discount: "BOGO", icon: Ticket },
];

const TRENDING = [
  { term: "Dubai visa rules 2025", rank: 1 },
  { term: "DSF dates 2025", rank: 2 },
  { term: "Museum of the Future", rank: 3 },
  { term: "Best hotels December", rank: 4 },
  { term: "Ramadan 2025 dates", rank: 5 },
];

const CATEGORIES = [
  { id: "visa", name: "Visa & Entry", active: false },
  { id: "travel", name: "Travel Updates", active: false },
  { id: "hotels", name: "Hotels & Deals", active: false },
  { id: "events", name: "Events", active: false },
  { id: "dining", name: "Dining", active: false },
  { id: "attractions", name: "Attractions", active: false },
];

function formatViews(views: number): string {
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
}

function getArticleDate(content: ContentWithRelations): string {
  return content.publishedAt 
    ? format(new Date(content.publishedAt), "MMM d, yyyy")
    : content.createdAt 
      ? format(new Date(content.createdAt), "MMM d, yyyy")
      : "Recent";
}

function getReadTime(content: ContentWithRelations): string {
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

function getCategoryColor(category?: string | null): string {
  const colors: Record<string, string> = {
    news: "bg-travi-pink",
    attractions: "bg-travi-purple",
    hotels: "bg-travi-green",
    food: "bg-travi-orange",
    transport: "bg-info",
    events: "bg-travi-pink",
    tips: "bg-info",
    shopping: "bg-travi-orange",
  };
  return colors[category || "news"] || "bg-travi-pink";
}

function getBreakingNews(articles: ContentWithRelations[]): string[] {
  return articles.slice(0, 5).map(a => a.title);
}

export default function PublicNews() {
  const { isRTL, localePath } = useLocale();
  const [email, setEmail] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { toast } = useToast();

  useDocumentMeta({
    title: "Dubai Travel News | Latest Tourism Updates, Visa & Events 2025",
    description: "Stay updated with Dubai tourism news: visa changes, new attractions, hotel deals, events & travel tips. Your essential guide to visiting Dubai.",
    ogTitle: "Dubai Travel News | Latest Tourism Updates 2025",
    ogDescription: "Breaking news and updates about Dubai tourism, visa rules, events, hotels, and travel deals.",
    ogType: "website",
  });

  const { data: allContent, isLoading } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/public/contents?includeExtensions=true"],
  });

  const subscribeMutation = useMutation({
    mutationFn: async (email: string) => {
      return apiRequest("POST", "/api/newsletter/subscribe", { email });
    },
    onSuccess: () => {
      toast({
        title: "Subscribed!",
        description: "Please check your email to confirm your subscription.",
      });
      setEmail("");
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      subscribeMutation.mutate(email);
    } else {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
    }
  };

  const articles = useMemo(() => {
    const published = allContent?.filter(c => c.type === "article" && c.status === "published") || [];
    return published.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [allContent]);

  const heroArticle = articles[0];
  const topStories = articles.slice(1, 4);
  const latestNews = articles.slice(4, 10);
  const featuredAttractions = articles.slice(10, 14);
  const breakingNews = useMemo(() => getBreakingNews(articles), [articles]);

  const ArticleCardSkeleton = () => (
    <Card className="relative rounded-[16px] overflow-hidden p-0">
      <Skeleton className="aspect-[16/9] w-full" />
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </Card>
  );

  return (
    <PageContainer className="bg-background">
      <PublicHero
        title="Dubai Travel News"
        subtitle="Stay updated with the latest tourism news, visa changes, events, and travel tips for Dubai."
        backgroundImage="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "News" },
        ]}
        size="small"
      />

      <div className="bg-travi-neutral-black text-white border-b border-travi-neutral-gray-75">
        <div className="max-w-7xl mx-auto">
          <div className={cn("flex items-center h-10", isRTL && "flex-row-reverse")}>
            <div className="flex-shrink-0 bg-travi-pink h-full px-4 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <Flame className="w-3.5 h-3.5" />
              <span className="text-xs font-bold tracking-wider">BREAKING</span>
            </div>
            <div className="overflow-hidden flex-1 px-4">
              <div className={cn("animate-marquee whitespace-nowrap flex items-center gap-8", isRTL && "animate-marquee-rtl")}>
                {breakingNews.length > 0 ? (
                  [...breakingNews, ...breakingNews].map((news, i) => (
                    <span key={i} className="text-sm text-travi-neutral-gray-25 flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-travi-pink animate-pulse shrink-0" />
                      {news}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-travi-neutral-gray-25">Loading latest news...</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-[140px]">
          <div className="flex items-center h-12 gap-1 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                activeCategory === null
                  ? "bg-travi-purple text-white"
                  : "text-muted-foreground hover:bg-muted"
              }`}
              data-testid="button-category-all"
            >
              All News
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                  activeCategory === cat.id
                    ? "bg-travi-purple text-white"
                    : "text-muted-foreground hover:bg-muted"
                }`}
                data-testid={`button-category-${cat.id}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Section id="featured-news" className="py-10">
        <div className="grid lg:grid-cols-5 gap-[30px]">
          <div className="lg:col-span-3 flex flex-col">
            {isLoading ? (
              <ArticleCardSkeleton />
            ) : heroArticle ? (
              <Link href={localePath(`/articles/${heroArticle.slug}`)}>
                <article className="group cursor-pointer transition-transform duration-300 hover:scale-[1.01] flex-1" data-testid="card-hero-article">
                  <Card className="relative h-full min-h-[400px] rounded-[16px] overflow-hidden p-0">
                    <img
                      src={heroArticle.heroImage || defaultImages[0]}
                      alt={heroArticle.heroImageAlt || heroArticle.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
                    
                    <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} flex items-center gap-2`}>
                      <span className="px-2.5 py-1 bg-travi-pink text-white text-xs font-bold rounded-[8px] flex items-center gap-1.5">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                        </span>
                        LATEST
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <Badge className={`${getCategoryColor(heroArticle.article?.category)} text-white border-0 mb-3`}>
                        {heroArticle.article?.category || "News"}
                      </Badge>
                      <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
                        {heroArticle.title}
                      </h1>
                      <p className="text-white/80 text-sm sm:text-base mb-4 line-clamp-2 max-w-2xl">
                        {heroArticle.metaDescription}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-white/70">
                        <span>{getArticleDate(heroArticle)}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {getReadTime(heroArticle)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {formatViews(heroArticle.viewCount || 0)}
                        </span>
                      </div>
                    </div>
                  </Card>
                </article>
              </Link>
            ) : (
              <Card className="relative h-full min-h-[400px] rounded-[16px] overflow-hidden p-0 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Newspaper className="w-12 h-12 mx-auto mb-4" />
                  <p>No articles published yet</p>
                </div>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-travi-pink" />
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Top Stories</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 flex-1">
              {isLoading ? (
                <>
                  <div className="col-span-2"><ArticleCardSkeleton /></div>
                  <ArticleCardSkeleton />
                  <ArticleCardSkeleton />
                </>
              ) : topStories.length > 0 ? (
                <>
                  {topStories[0] && (
                    <Link href={localePath(`/articles/${topStories[0].slug}`)} className="col-span-2">
                      <article 
                        className="group cursor-pointer relative rounded-[16px] overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
                        data-testid={`card-top-story-${topStories[0].id}`}
                      >
                        <div className="relative aspect-[16/9]">
                          <img
                            src={topStories[0].heroImage || defaultImages[1]}
                            alt={topStories[0].heroImageAlt || topStories[0].title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <Badge className={`${getCategoryColor(topStories[0].article?.category)} text-white border-0 mb-2 text-[10px]`}>
                              {topStories[0].article?.category || "News"}
                            </Badge>
                            <h3 className="font-heading font-bold text-sm text-white line-clamp-2 leading-snug">
                              {topStories[0].title}
                            </h3>
                            <div className="flex items-center gap-2 mt-2 text-xs text-white/70">
                              <span>{getArticleDate(topStories[0])}</span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {formatViews(topStories[0].viewCount || 0)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  )}

                  {topStories.slice(1, 3).map((article, index) => (
                    <Link key={article.id} href={localePath(`/articles/${article.slug}`)}>
                      <article 
                        className="group cursor-pointer relative rounded-[16px] overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
                        data-testid={`card-top-story-${article.id}`}
                      >
                        <div className="relative aspect-[4/5]">
                          <img
                            src={article.heroImage || defaultImages[(index + 2) % defaultImages.length]}
                            alt={article.heroImageAlt || article.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <Badge className={`${getCategoryColor(article.article?.category)} text-white border-0 mb-1.5 text-[10px]`}>
                              {article.article?.category || "News"}
                            </Badge>
                            <h3 className="font-heading font-semibold text-xs text-white line-clamp-2 leading-snug">
                              {article.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1.5 text-[10px] text-white/70">
                              <span>{getArticleDate(article)}</span>
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </>
              ) : (
                <div className="col-span-2 flex items-center justify-center p-8 text-muted-foreground">
                  <p>More articles coming soon</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>

      <Section 
        id="travel-tips" 
        title="Quick Travel Tips" 
        variant="alternate"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-travi-green rounded-[8px] flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
          </div>
          <Link href="/guides">
            <Button variant="ghost" size="sm" className="text-travi-green" data-testid="button-view-guides">
              View All Guides <ChevronRight className={cn("w-4 h-4 ms-1", isRTL && "rotate-180")} />
            </Button>
          </Link>
        </div>
        <CategoryGrid columns={4}>
          {TRAVEL_TIPS.map((tip) => (
            <Card 
              key={tip.id}
              className="group cursor-pointer p-5 rounded-[16px] bg-card border border-border transition-all duration-300 hover:border-travi-green/50 hover-elevate"
              data-testid={`card-travel-tip-${tip.id}`}
            >
              <div className="w-10 h-10 bg-travi-green/10 rounded-[8px] flex items-center justify-center mb-3">
                <tip.icon className="w-5 h-5 text-travi-green" />
              </div>
              <Badge variant="secondary" className="bg-travi-green/10 text-travi-green border-0 mb-2">
                {tip.category}
              </Badge>
              <h3 className="font-heading font-semibold text-sm text-foreground leading-snug group-hover:text-travi-green transition-colors mb-1">
                {tip.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {tip.description}
              </p>
            </Card>
          ))}
        </CategoryGrid>
      </Section>

      {featuredAttractions.length > 0 && (
        <Section id="featured-attractions" title="Featured Articles">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-travi-purple rounded-[8px] flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
            </div>
            <Link href={localePath("/articles")}>
              <Button variant="ghost" size="sm" className="text-travi-purple" data-testid="link-featured-all">
                View All <ChevronRight className={cn("w-4 h-4 ms-1", isRTL && "rotate-180")} />
              </Button>
            </Link>
          </div>
          <div className="grid lg:grid-cols-2 gap-[30px]">
            {featuredAttractions[0] && (
              <Link href={localePath(`/articles/${featuredAttractions[0].slug}`)}>
                <article 
                  className="group cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
                  data-testid="card-featured-attraction-main"
                >
                  <Card className="relative aspect-[16/10] rounded-[16px] overflow-hidden p-0">
                    <img
                      src={featuredAttractions[0].heroImage || defaultImages[0]}
                      alt={featuredAttractions[0].heroImageAlt || featuredAttractions[0].title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <Badge className={`${getCategoryColor(featuredAttractions[0].article?.category)} text-white border-0 mb-3`}>
                        {featuredAttractions[0].article?.category || "News"}
                      </Badge>
                      <h3 className="font-heading text-xl lg:text-2xl font-bold text-white leading-tight mb-2">
                        {featuredAttractions[0].title}
                      </h3>
                      <p className="text-white/80 text-sm line-clamp-2 mb-3">
                        {featuredAttractions[0].metaDescription}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-white/70">
                        <span>{getArticleDate(featuredAttractions[0])}</span>
                        <span>{getReadTime(featuredAttractions[0])}</span>
                      </div>
                    </div>
                  </Card>
                </article>
              </Link>
            )}

            <div className="space-y-4">
              {featuredAttractions.slice(1, 4).map((article, index) => (
                <Link key={article.id} href={localePath(`/articles/${article.slug}`)}>
                  <Card 
                    className="group cursor-pointer flex gap-4 p-3 rounded-[16px] bg-card border border-border transition-all duration-300 hover:border-[#6443F4]/50 hover-elevate"
                    data-testid={`card-featured-attraction-${index}`}
                  >
                    <div className="relative w-28 h-20 flex-shrink-0 rounded-[8px] overflow-hidden">
                      <img
                        src={article.heroImage || defaultImages[(index + 1) % defaultImages.length]}
                        alt={article.heroImageAlt || article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <Badge className={`${getCategoryColor(article.article?.category)} text-white border-0 w-fit mb-1.5 text-[10px]`}>
                        {article.article?.category || "News"}
                      </Badge>
                      <h3 className="font-heading font-semibold text-sm text-foreground line-clamp-2 leading-snug group-hover:text-[#6443F4] transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                        <span>{getArticleDate(article)}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {formatViews(article.viewCount || 0)}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </Section>
      )}

      <Section id="latest-news" variant="alternate">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-bold text-foreground">Latest News</h2>
              <Link href={localePath("/articles")}>
                <Button variant="ghost" size="sm" className="text-[#F94498]" data-testid="button-view-all">
                  View All <ChevronRight className={cn("w-4 h-4 ms-1", isRTL && "rotate-180")} />
                </Button>
              </Link>
            </div>

            <div className="space-y-6">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-5 pb-6 border-b border-border">
                    <Skeleton className="w-40 h-28 sm:w-48 sm:h-32 rounded-[16px]" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))
              ) : latestNews.length > 0 ? (
                latestNews.map((article) => (
                  <Link key={article.id} href={localePath(`/articles/${article.slug}`)}>
                    <article 
                      className="group cursor-pointer flex gap-5 pb-6 border-b border-border last:border-0 transition-transform duration-300 hover:scale-[1.01]"
                      data-testid={`card-news-${article.id}`}
                    >
                      <div className="relative w-40 h-28 sm:w-48 sm:h-32 flex-shrink-0 rounded-[16px] overflow-hidden">
                        <img
                          src={article.heroImage || defaultImages[0]}
                          alt={article.heroImageAlt || article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <Badge className={`${getCategoryColor(article.article?.category)} text-white border-0 w-fit mb-2`}>
                          {article.article?.category || "News"}
                        </Badge>
                        <h3 className="font-heading font-bold text-lg text-foreground line-clamp-2 leading-snug group-hover:text-[#F94498] transition-colors mb-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2 hidden sm:block">
                          {article.metaDescription}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{getArticleDate(article)}</span>
                          <span>{getReadTime(article)}</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {formatViews(article.viewCount || 0)}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Newspaper className="w-12 h-12 mx-auto mb-4" />
                  <p>No articles available yet</p>
                </div>
              )}
            </div>

            {articles.length > 10 && (
              <div className="mt-8 text-center">
                <Link href={localePath("/articles")}>
                  <Button variant="outline" size="lg" className="px-8" data-testid="button-load-more">
                    View All Articles
                    <ArrowRight className={cn("w-4 h-4 ms-2", isRTL && "rotate-180")} />
                  </Button>
                </Link>
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="font-heading text-lg font-bold text-foreground mb-6">Browse by Category</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Travel Tips", count: 156, icon: Compass, color: "bg-[#01BEFF]" },
                  { name: "Events & Festivals", count: 89, icon: Calendar, color: "bg-[#F94498]" },
                  { name: "Food & Dining", count: 234, icon: Utensils, color: "bg-[#FF9327]" },
                  { name: "Real Estate", count: 67, icon: Building2, color: "bg-[#02A65C]" },
                  { name: "Business", count: 45, icon: Briefcase, color: "bg-[#6443F4]" },
                  { name: "Lifestyle", count: 123, icon: Heart, color: "bg-[#F94498]" },
                ].map((category) => (
                  <Card
                    key={category.name}
                    className="group cursor-pointer flex items-center gap-3 p-4 bg-card rounded-[16px] border border-border transition-all duration-300 hover-elevate"
                    data-testid={`category-${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <div className={`w-10 h-10 ${category.color} rounded-[8px] flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                      <category.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-foreground group-hover:text-[#F94498] transition-colors">
                        {category.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">{category.count} articles</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <Card className="rounded-[16px] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-[#F94498]" />
                <h3 className="font-heading font-bold text-foreground">This Week in Dubai</h3>
              </div>
              <div className="space-y-3">
                {THIS_WEEK.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 group cursor-pointer transition-transform duration-200 hover:scale-[1.02]" data-testid={`event-${i}`}>
                    <div className="w-12 text-center">
                      <div className="text-[10px] font-medium text-muted-foreground uppercase">{item.day}</div>
                      <div className="text-lg font-bold text-foreground">{item.date}</div>
                    </div>
                    <div className={`flex-1 px-3 py-2 rounded-[8px] ${item.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                      <span className="text-sm font-medium text-foreground">{item.event}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-[#FF9327]/10 to-[#FFD112]/10 rounded-[16px] p-5 border border-[#FF9327]/20">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-[#FF9327]" />
                <h3 className="font-heading font-bold text-foreground">Hot Deals</h3>
              </div>
              <div className="space-y-3">
                {HOT_DEALS.map((deal, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-card rounded-[12px] transition-transform duration-200 hover:scale-[1.02] cursor-pointer" data-testid={`deal-${i}`}>
                    <div className="flex items-center gap-2">
                      <deal.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{deal.title}</span>
                    </div>
                    <Badge variant="secondary" className="bg-[#FF9327]/10 text-[#FF9327] border-0">
                      {deal.discount}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-[#FF9327] text-white" data-testid="button-all-deals">
                See All Deals
              </Button>
            </Card>

            <Card className="rounded-[16px] p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-[#FFD112]" />
                <h3 className="font-heading font-bold text-foreground">Travel Alerts</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm" data-testid="alert-0">
                  <Sun className="w-4 h-4 text-[#01BEFF] flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">High temperatures expected: 28-32C</span>
                </div>
                <div className="flex items-start gap-2 text-sm" data-testid="alert-1">
                  <AlertTriangle className="w-4 h-4 text-[#FFD112] flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">DIFC road closure Dec 25-26</span>
                </div>
                <div className="flex items-start gap-2 text-sm" data-testid="alert-2">
                  <Shield className="w-4 h-4 text-[#02A65C] flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">All Metro lines operating normally</span>
                </div>
              </div>
            </Card>

            <Card className="rounded-[16px] p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-[#F94498]" />
                <h3 className="font-heading font-bold text-foreground">Trending Searches</h3>
              </div>
              <div className="space-y-2">
                {TRENDING.map((item) => (
                  <div key={item.rank} className="flex items-center gap-3 group cursor-pointer transition-transform duration-200 hover:scale-[1.02]" data-testid={`trending-${item.rank}`}>
                    <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {item.rank}
                    </span>
                    <span className="text-sm text-foreground group-hover:text-[#F94498] transition-colors">
                      {item.term}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="relative rounded-[16px] p-6 text-white overflow-hidden" data-testid="section-newsletter-cta">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F94498] via-[#6443F4] to-[#01BEFF] animate-gradient-shift" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#F94498]/50 via-transparent to-[#6443F4]/50 animate-gradient-shift-reverse" />
              <div className="absolute inset-0 bg-black/10" />
              
              <form onSubmit={handleSubscribe} className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="w-5 h-5" />
                  <h3 className="font-heading font-bold text-lg">Daily Newsletter</h3>
                </div>
                <p className="text-sm text-white/90 mb-4">
                  Get Dubai travel updates delivered to your inbox every morning.
                </p>
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 mb-3 focus:bg-white/30 rounded-[12px]"
                  data-testid="input-newsletter-email"
                  disabled={subscribeMutation.isPending}
                />
                <Button 
                  type="submit"
                  className="w-full bg-white text-[#6443F4] font-semibold" 
                  data-testid="button-subscribe"
                  disabled={subscribeMutation.isPending}
                >
                  {subscribeMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    "Subscribe Free"
                  )}
                </Button>
                <p className="text-xs text-white/80 mt-3 text-center flex items-center justify-center gap-1">
                  <Users className="w-3 h-3" />
                  Join 50,000+ subscribers
                </p>
              </form>
            </Card>

            <Card className="rounded-[16px] p-5">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-[#01BEFF]" />
                <h3 className="font-heading font-bold text-foreground">Quick Links</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {["Metro Map", "Currency", "Weather", "Emergency"].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[#F94498] transition-colors"
                    data-testid={`link-quick-${link.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <ExternalLink className="w-3 h-3" />
                    {link}
                  </a>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Section>

      <Section id="quick-categories">
        <CategoryGrid columns={4}>
          {[
            { id: "visa", name: "Visa Guide", icon: Ticket, href: "/visa", color: "bg-[#F94498]" },
            { id: "hotels", name: "Hotel Deals", icon: Hotel, href: "/hotels", color: "bg-[#02A65C]" },
            { id: "events", name: "Events", icon: Calendar, href: "/events", color: "bg-[#FF9327]" },
            { id: "attractions", name: "Attractions", icon: Camera, href: "/attractions", color: "bg-[#6443F4]" },
          ].map((item) => (
            <Link key={item.name} href={localePath(item.href)} data-testid={`link-category-${item.id}`}>
              <Card className="group cursor-pointer p-5 bg-card border border-border rounded-[16px] transition-all duration-300 hover-elevate">
                <div className={`w-10 h-10 ${item.color} rounded-[12px] flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-foreground group-hover:text-[#F94498] transition-colors">
                  {item.name}
                </h3>
                <ChevronRight className="w-4 h-4 text-muted-foreground mt-1 transition-transform duration-300 group-hover:translate-x-1" />
              </Card>
            </Link>
          ))}
        </CategoryGrid>
      </Section>

      <section className="bg-[#24103E] py-12">
        <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-[140px]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white text-center md:text-left">
              <h2 className="font-heading text-2xl font-bold mb-2">Plan Your Dubai Trip</h2>
              <p className="text-[#A79FB2]">Explore attractions, hotels, and experiences</p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href={localePath("/attractions")}>
                <Button size="lg" className="bg-[#F94498] text-white" data-testid="button-cta-attractions">
                  <Camera className="w-4 h-4 mr-2" />
                  Attractions
                </Button>
              </Link>
              <Link href={localePath("/hotels")}>
                <Button size="lg" variant="outline" className="border-[#504065] text-white" data-testid="button-cta-hotels">
                  <Hotel className="w-4 h-4 mr-2" />
                  Hotels
                </Button>
              </Link>
              <Link href={localePath("/dining")}>
                <Button size="lg" variant="outline" className="border-[#504065] text-white" data-testid="button-cta-dining">
                  <Utensils className="w-4 h-4 mr-2" />
                  Dining
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes gradient-shift {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes gradient-shift-reverse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        .animate-gradient-shift {
          animation: gradient-shift 4s ease-in-out infinite;
        }
        .animate-gradient-shift-reverse {
          animation: gradient-shift-reverse 6s ease-in-out infinite;
        }
      `}</style>
    </PageContainer>
  );
}
