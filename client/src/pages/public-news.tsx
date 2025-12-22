import { useState } from "react";
import { Link } from "wouter";
import {
  Newspaper, Building2, Calendar, Hotel, Utensils,
  Clock, ChevronRight, TrendingUp, Mail, ArrowRight,
  Plane, Globe, Eye, Ticket, AlertTriangle, Tag,
  Users, BookOpen, ExternalLink, Flame, Sun, Shield, Camera,
  Star, MapPin, CreditCard, Lightbulb, Compass, Briefcase, Heart
} from "lucide-react";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { PageContainer, Section, ContentCard, CategoryGrid } from "@/components/public-layout";
import { PublicHero } from "@/components/public-hero";
import { cn } from "@/lib/utils";

interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  image: string;
  date: string;
  readTime: string;
  author: string;
  views: number;
}

const HERO_ARTICLE: NewsArticle = {
  id: 0,
  title: "Dubai Announces Free 30-Day Visa for 90 New Countries Starting January 2025",
  excerpt: "In a landmark decision to boost tourism, the UAE Cabinet has approved visa-free entry for citizens of 90 additional countries. This historic move is expected to attract over 25 million visitors by 2026, positioning Dubai as the world's most accessible luxury destination.",
  category: "Visa & Entry",
  categoryColor: "bg-travi-pink",
  image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop",
  date: "Dec 21, 2024",
  readTime: "4 min read",
  author: "Editorial Team",
  views: 45230
};

const TOP_STORIES: NewsArticle[] = [
  {
    id: 1,
    title: "Dubai Tourism Records 17.15M International Visitors in 2024",
    excerpt: "Record-breaking milestone as Dubai welcomes more tourists than ever before.",
    category: "Tourism",
    categoryColor: "bg-info",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop",
    date: "Dec 20, 2024",
    readTime: "3 min",
    author: "Sarah Mitchell",
    views: 28400
  },
  {
    id: 2,
    title: "Emirates Launches 5 New Routes with Special Launch Fares",
    excerpt: "New connections to South America and Southeast Asia announced.",
    category: "Travel",
    categoryColor: "bg-travi-green",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop",
    date: "Dec 20, 2024",
    readTime: "2 min",
    author: "Travel Desk",
    views: 19200
  },
  {
    id: 3,
    title: "Dubai Shopping Festival 2025: Dates & Mega Deals Revealed",
    excerpt: "30th anniversary celebrations promise biggest discounts ever.",
    category: "Events",
    categoryColor: "bg-travi-pink",
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=600&fit=crop",
    date: "Dec 19, 2024",
    readTime: "5 min",
    author: "Events Team",
    views: 34100
  }
];

const LATEST_NEWS: NewsArticle[] = [
  {
    id: 4,
    title: "Dubai Metro Blue Line: 14 New Stations to Connect JVC by 2028",
    excerpt: "The AED 18 billion expansion will serve over 500,000 residents in Jumeirah Village Circle.",
    category: "Transport",
    categoryColor: "bg-info",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop",
    date: "Dec 18, 2024",
    readTime: "4 min",
    author: "Transport Desk",
    views: 15600
  },
  {
    id: 5,
    title: "Atlantis The Royal Named World's Best New Hotel 2024",
    excerpt: "The ultra-luxury resort sweeps major categories at World Travel Awards.",
    category: "Hotels",
    categoryColor: "bg-travi-green",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
    date: "Dec 17, 2024",
    readTime: "3 min",
    author: "Luxury Travel",
    views: 22300
  },
  {
    id: 6,
    title: "Museum of the Future Unveils 2025 AI Exhibition",
    excerpt: "Groundbreaking exhibition exploring artificial intelligence and human creativity.",
    category: "Culture",
    categoryColor: "bg-travi-purple",
    image: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop",
    date: "Dec 16, 2024",
    readTime: "4 min",
    author: "Culture Desk",
    views: 18900
  },
  {
    id: 7,
    title: "Dubai Food Festival 2025: 700+ Restaurants Participating",
    excerpt: "Two-week culinary celebration features exclusive tasting menus and celebrity chefs.",
    category: "Dining",
    categoryColor: "bg-travi-orange",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
    date: "Dec 15, 2024",
    readTime: "3 min",
    author: "Food Editor",
    views: 14200
  },
  {
    id: 8,
    title: "Global Village Season 29: 90 Countries, 3,500+ Shopping Outlets",
    excerpt: "World's largest tourism project opens with new pavilions from Japan and Brazil.",
    category: "Events",
    categoryColor: "bg-travi-pink",
    image: "https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=800&h=600&fit=crop",
    date: "Dec 14, 2024",
    readTime: "5 min",
    author: "Events Team",
    views: 31400
  },
  {
    id: 9,
    title: "Palm Jebel Ali: AED 5 Billion in Sales Within First Quarter",
    excerpt: "Nakheel's new mega-development attracts unprecedented demand.",
    category: "Real Estate",
    categoryColor: "bg-travi-green",
    image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&h=600&fit=crop",
    date: "Dec 13, 2024",
    readTime: "4 min",
    author: "Property Desk",
    views: 26800
  }
];

const TRAVEL_TIPS = [
  { id: 1, title: "Best Time to Visit Dubai", category: "Planning", description: "November to March offers perfect weather", icon: Calendar },
  { id: 2, title: "Dubai Dress Code Guide", category: "Culture", description: "Respectful attire for malls and attractions", icon: Users },
  { id: 3, title: "Metro Navigation Tips", category: "Transport", description: "Gold class, women's cabin, and nol cards", icon: MapPin },
  { id: 4, title: "Best Exchange Rates", category: "Money", description: "Where to get the best AED rates", icon: CreditCard },
];

const FEATURED_ATTRACTIONS: NewsArticle[] = [
  {
    id: 10,
    title: "Museum of the Future: Complete Visitor Guide 2025",
    excerpt: "Everything you need to know about Dubai's most iconic new landmark, from ticket prices to best visiting times.",
    category: "Attractions",
    categoryColor: "bg-travi-purple",
    image: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop",
    date: "Dec 20, 2024",
    readTime: "6 min",
    author: "Editorial Team",
    views: 45200
  },
  {
    id: 11,
    title: "Dubai Frame: Best Time to Visit for Perfect Photos",
    excerpt: "Sunset visits offer the most stunning views of both old and new Dubai.",
    category: "Attractions",
    categoryColor: "bg-travi-purple",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop",
    date: "Dec 19, 2024",
    readTime: "3 min",
    author: "Travel Desk",
    views: 28400
  },
  {
    id: 12,
    title: "Miracle Garden Opens with 150 Million Flowers",
    excerpt: "New Disney-themed installations draw record crowds.",
    category: "Attractions",
    categoryColor: "bg-travi-purple",
    image: "https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=800&h=600&fit=crop",
    date: "Dec 18, 2024",
    readTime: "4 min",
    author: "Culture Desk",
    views: 19200
  },
  {
    id: 13,
    title: "IMG Worlds of Adventure: New Marvel Zone",
    excerpt: "Spider-Man and Avengers experiences launch this December.",
    category: "Attractions",
    categoryColor: "bg-travi-purple",
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=600&fit=crop",
    date: "Dec 17, 2024",
    readTime: "3 min",
    author: "Events Team",
    views: 15600
  }
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

const BREAKING_NEWS = [
  "UAE approves visa-free entry for 90 new countries",
  "Dubai Tourism: 17.15M visitors in 2024",
  "Emirates announces new routes to 5 destinations",
  "Dubai Mall sets new visitor record",
  "AED 128B Al Maktoum Airport expansion"
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

export default function PublicNews() {
  const { isRTL, localePath } = useLocale();
  const [email, setEmail] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useDocumentMeta({
    title: "Dubai Travel News | Latest Tourism Updates, Visa & Events 2025",
    description: "Stay updated with Dubai tourism news: visa changes, new attractions, hotel deals, events & travel tips. Your essential guide to visiting Dubai.",
    ogTitle: "Dubai Travel News | Latest Tourism Updates 2025",
    ogDescription: "Breaking news and updates about Dubai tourism, visa rules, events, hotels, and travel deals.",
    ogType: "website",
  });

  return (
    <PageContainer className="bg-background">
      {/* Hero Section with Breaking News */}
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

      {/* Breaking News Ticker */}
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
                {[...BREAKING_NEWS, ...BREAKING_NEWS].map((news, i) => (
                  <span key={i} className="text-sm text-travi-neutral-gray-25 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-travi-pink animate-pulse shrink-0" />
                    {news}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
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

      {/* Featured News Section */}
      <Section id="featured-news" className="py-10">
        <div className="grid lg:grid-cols-5 gap-[30px]">
          {/* Main Featured Article - 3 columns */}
          <div className="lg:col-span-3 flex flex-col">
            <article className="group cursor-pointer transition-transform duration-300 hover:scale-[1.01] flex-1" data-testid="card-hero-article">
              <Card className="relative h-full min-h-[400px] rounded-[16px] overflow-hidden p-0">
                <img
                  src={HERO_ARTICLE.image}
                  alt={HERO_ARTICLE.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
                
                <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} flex items-center gap-2`}>
                  <span className="px-2.5 py-1 bg-travi-pink text-white text-xs font-bold rounded-[8px] flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                    </span>
                    BREAKING
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <Badge className={`${HERO_ARTICLE.categoryColor} text-white border-0 mb-3`}>
                    {HERO_ARTICLE.category}
                  </Badge>
                  <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
                    {HERO_ARTICLE.title}
                  </h1>
                  <p className="text-white/80 text-sm sm:text-base mb-4 line-clamp-2 max-w-2xl">
                    {HERO_ARTICLE.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-white/70">
                    <span>{HERO_ARTICLE.date}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {HERO_ARTICLE.readTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {formatViews(HERO_ARTICLE.views)}
                    </span>
                  </div>
                </div>
              </Card>
            </article>
          </div>

          {/* Top Stories - Bento Grid 2 columns */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-travi-pink" />
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Top Stories</h2>
            </div>
            {/* Bento Grid Layout */}
            <div className="grid grid-cols-2 gap-3 flex-1">
              {/* Large card - spans 2 columns */}
              <article 
                className="col-span-2 group cursor-pointer relative rounded-[16px] overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
                data-testid={`card-top-story-${TOP_STORIES[0].id}`}
              >
                <div className="relative aspect-[16/9]">
                  <img
                    src={TOP_STORIES[0].image}
                    alt={TOP_STORIES[0].title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <Badge className={`${TOP_STORIES[0].categoryColor} text-white border-0 mb-2 text-[10px]`}>
                      {TOP_STORIES[0].category}
                    </Badge>
                    <h3 className="font-heading font-bold text-sm text-white line-clamp-2 leading-snug">
                      {TOP_STORIES[0].title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-xs text-white/70">
                      <span>{TOP_STORIES[0].date}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {formatViews(TOP_STORIES[0].views)}
                      </span>
                    </div>
                  </div>
                </div>
              </article>

              {/* Two smaller cards side by side */}
              {TOP_STORIES.slice(1, 3).map((article) => (
                <article 
                  key={article.id}
                  className="group cursor-pointer relative rounded-[16px] overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
                  data-testid={`card-top-story-${article.id}`}
                >
                  <div className="relative aspect-[4/5]">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <Badge className={`${article.categoryColor} text-white border-0 mb-1.5 text-[10px]`}>
                        {article.category}
                      </Badge>
                      <h3 className="font-heading font-semibold text-xs text-white line-clamp-2 leading-snug">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-white/70">
                        <span>{article.date}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Quick Travel Tips Section */}
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

      {/* Featured Category Section */}
      <Section id="featured-attractions" title="Featured in Attractions">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-travi-purple rounded-[8px] flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-travi-purple" data-testid="link-featured-all">
            View All <ChevronRight className={cn("w-4 h-4 ms-1", isRTL && "rotate-180")} />
          </Button>
        </div>
        <div className="grid lg:grid-cols-2 gap-[30px]">
          {/* Large Featured Article */}
          <article 
            className="group cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
            data-testid="card-featured-attraction-main"
          >
            <Card className="relative aspect-[16/10] rounded-[16px] overflow-hidden p-0">
              <img
                src={FEATURED_ATTRACTIONS[0].image}
                alt={FEATURED_ATTRACTIONS[0].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Badge className={`${FEATURED_ATTRACTIONS[0].categoryColor} text-white border-0 mb-3`}>
                  {FEATURED_ATTRACTIONS[0].category}
                </Badge>
                <h3 className="font-heading text-xl lg:text-2xl font-bold text-white leading-tight mb-2">
                  {FEATURED_ATTRACTIONS[0].title}
                </h3>
                <p className="text-white/80 text-sm line-clamp-2 mb-3">
                  {FEATURED_ATTRACTIONS[0].excerpt}
                </p>
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <span>{FEATURED_ATTRACTIONS[0].date}</span>
                  <span>{FEATURED_ATTRACTIONS[0].readTime}</span>
                </div>
              </div>
            </Card>
          </article>

          {/* List of smaller articles */}
          <div className="space-y-4">
            {FEATURED_ATTRACTIONS.slice(1, 4).map((article, index) => (
              <Card 
                key={article.id}
                className="group cursor-pointer flex gap-4 p-3 rounded-[16px] bg-card border border-border transition-all duration-300 hover:border-[#6443F4]/50 hover-elevate"
                data-testid={`card-featured-attraction-${index}`}
              >
                <div className="relative w-28 h-20 flex-shrink-0 rounded-[8px] overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <Badge className={`${article.categoryColor} text-white border-0 w-fit mb-1.5 text-[10px]`}>
                    {article.category}
                  </Badge>
                  <h3 className="font-heading font-semibold text-sm text-foreground line-clamp-2 leading-snug group-hover:text-[#6443F4] transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                    <span>{article.date}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {formatViews(article.views)}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Main Content with Sidebar */}
      <Section id="latest-news" variant="alternate">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-bold text-foreground">Latest News</h2>
              <Button variant="ghost" size="sm" className="text-[#F94498]" data-testid="button-view-all">
                View All <ChevronRight className={cn("w-4 h-4 ms-1", isRTL && "rotate-180")} />
              </Button>
            </div>

            <div className="space-y-6">
              {LATEST_NEWS.map((article) => (
                <article 
                  key={article.id}
                  className="group cursor-pointer flex gap-5 pb-6 border-b border-border last:border-0 transition-transform duration-300 hover:scale-[1.01]"
                  data-testid={`card-news-${article.id}`}
                >
                  <div className="relative w-40 h-28 sm:w-48 sm:h-32 flex-shrink-0 rounded-[16px] overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <Badge className={`${article.categoryColor} text-white border-0 w-fit mb-2`}>
                      {article.category}
                    </Badge>
                    <h3 className="font-heading font-bold text-lg text-foreground line-clamp-2 leading-snug group-hover:text-[#F94498] transition-colors mb-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2 hidden sm:block">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{article.date}</span>
                      <span>{article.readTime}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {formatViews(article.views)}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button variant="outline" size="lg" className="px-8" data-testid="button-load-more">
                Load More Stories
                <ArrowRight className={cn("w-4 h-4 ms-2", isRTL && "rotate-180")} />
              </Button>
            </div>

            {/* Popular Categories - fills remaining space */}
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

          {/* Sidebar */}
          <div className="space-y-8">
            {/* This Week */}
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

            {/* Hot Deals */}
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

            {/* Travel Alerts */}
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

            {/* Trending Searches */}
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

            {/* Enhanced Newsletter with Brand Gradient */}
            <Card className="relative rounded-[16px] p-6 text-white overflow-hidden" data-testid="section-newsletter-cta">
              {/* Brand gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#F94498] via-[#6443F4] to-[#01BEFF] animate-gradient-shift" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#F94498]/50 via-transparent to-[#6443F4]/50 animate-gradient-shift-reverse" />
              <div className="absolute inset-0 bg-black/10" />
              
              <div className="relative z-10">
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
                />
                <Button className="w-full bg-white text-[#6443F4] font-semibold" data-testid="button-subscribe">
                  Subscribe Free
                </Button>
                <p className="text-xs text-white/80 mt-3 text-center flex items-center justify-center gap-1">
                  <Users className="w-3 h-3" />
                  Join 50,000+ subscribers
                </p>
              </div>
            </Card>

            {/* Quick Links */}
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

      {/* Category Quick Links */}
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

      {/* CTA Banner */}
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
