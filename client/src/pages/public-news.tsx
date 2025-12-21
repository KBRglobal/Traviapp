import { useState } from "react";
import { Link } from "wouter";
import {
  Newspaper, Building2, Train, Calendar, Hotel, Utensils,
  Clock, ChevronRight, TrendingUp, Mail, ArrowRight,
  Plane, Globe, Star, MapPin, Sparkles, Trophy, Camera,
  AlertTriangle, Flame, Tag, Users, Eye, BookOpen,
  Ticket, Shield, Sun, CloudRain, ExternalLink
} from "lucide-react";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { Separator } from "@/components/ui/separator";

interface NewsCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  categoryId: string;
  image: string;
  date: string;
  readTime: string;
  author: string;
  views?: number;
  featured?: boolean;
  breaking?: boolean;
}

interface ThisWeekEvent {
  day: string;
  event: string;
  type: "festival" | "opening" | "concert" | "food";
}

interface HotDeal {
  title: string;
  discount: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TravelAlert {
  type: "warning" | "info" | "success";
  message: string;
}

const NEWS_CATEGORIES: NewsCategory[] = [
  { id: "all", name: "All News", icon: Newspaper, color: "text-slate-700 dark:text-slate-300", bgColor: "bg-slate-100 dark:bg-slate-800" },
  { id: "visa", name: "Visa & Entry", icon: Ticket, color: "text-[#6C5CE7]", bgColor: "bg-[#6C5CE7]/10" },
  { id: "travel", name: "Travel Updates", icon: Plane, color: "text-[#01BEFF]", bgColor: "bg-[#01BEFF]/10" },
  { id: "hotels", name: "Hotels & Deals", icon: Hotel, color: "text-[#02A65C]", bgColor: "bg-[#02A65C]/10" },
  { id: "events", name: "Events & Festivals", icon: Calendar, color: "text-[#F94498]", bgColor: "bg-[#F94498]/10" },
  { id: "dining", name: "Dining News", icon: Utensils, color: "text-[#FF9327]", bgColor: "bg-[#FF9327]/10" },
  { id: "attractions", name: "Attractions", icon: Camera, color: "text-[#EC4899]", bgColor: "bg-[#EC4899]/10" },
];

const HERO_ARTICLE: NewsArticle = {
  id: 0,
  title: "Dubai Announces Free 30-Day Visa for 90 New Countries Starting January 2025",
  excerpt: "In a landmark decision to boost tourism, the UAE Cabinet has approved visa-free entry for citizens of 90 additional countries. This historic move is expected to attract over 25 million visitors by 2026, positioning Dubai as the world's most accessible luxury destination.",
  category: "Visa & Entry",
  categoryId: "visa",
  image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop",
  date: "Dec 21, 2024",
  readTime: "4 min read",
  author: "Editorial Team",
  views: 45230,
  featured: true,
  breaking: true
};

const SECONDARY_HEADLINES: NewsArticle[] = [
  {
    id: 1,
    title: "Dubai Tourism Records 17.15M International Visitors in 2024",
    excerpt: "Record-breaking milestone as Dubai welcomes more tourists than ever before.",
    category: "Tourism Updates",
    categoryId: "travel",
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
    category: "Travel Updates",
    categoryId: "travel",
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
    category: "Events & Festivals",
    categoryId: "events",
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
    excerpt: "The AED 18 billion expansion will serve over 500,000 residents in Jumeirah Village Circle, Al Barsha South, and Motor City areas.",
    category: "Travel Updates",
    categoryId: "travel",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop",
    date: "Dec 18, 2024",
    readTime: "4 min",
    author: "Transport Desk",
    views: 15600
  },
  {
    id: 5,
    title: "Atlantis The Royal Named World's Best New Hotel 2024",
    excerpt: "The ultra-luxury resort sweeps major categories at World Travel Awards with its 795 rooms and celebrity chef restaurants.",
    category: "Hotels & Deals",
    categoryId: "hotels",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
    date: "Dec 17, 2024",
    readTime: "3 min",
    author: "Luxury Travel",
    views: 22300
  },
  {
    id: 6,
    title: "Museum of the Future Unveils 2025 AI Exhibition",
    excerpt: "Groundbreaking exhibition exploring artificial intelligence and human creativity opens in February 2025.",
    category: "Attractions",
    categoryId: "attractions",
    image: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop",
    date: "Dec 16, 2024",
    readTime: "4 min",
    author: "Culture Desk",
    views: 18900
  },
  {
    id: 7,
    title: "Dubai Food Festival 2025: 700+ Restaurants Participating",
    excerpt: "Two-week culinary celebration features exclusive tasting menus, celebrity chefs, and street food experiences.",
    category: "Dining News",
    categoryId: "dining",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
    date: "Dec 15, 2024",
    readTime: "3 min",
    author: "Food Editor",
    views: 14200
  },
  {
    id: 8,
    title: "Global Village Season 29: 90 Countries, 3,500+ Shopping Outlets",
    excerpt: "World's largest tourism and entertainment project opens with new pavilions from Japan, Brazil, and Morocco.",
    category: "Events & Festivals",
    categoryId: "events",
    image: "https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=800&h=600&fit=crop",
    date: "Dec 14, 2024",
    readTime: "5 min",
    author: "Events Team",
    views: 31400
  },
  {
    id: 9,
    title: "Palm Jebel Ali: AED 5 Billion in Sales Within First Quarter",
    excerpt: "Nakheel's new mega-development attracts unprecedented demand with 80 islands and 5,000 luxury villas.",
    category: "Real Estate",
    categoryId: "travel",
    image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&h=600&fit=crop",
    date: "Dec 13, 2024",
    readTime: "4 min",
    author: "Property Desk",
    views: 26800
  }
];

const THIS_WEEK_EVENTS: ThisWeekEvent[] = [
  { day: "Mon 23", event: "DSF Grand Opening", type: "festival" },
  { day: "Wed 25", event: "Christmas at Expo City", type: "festival" },
  { day: "Thu 26", event: "Hotel Flash Sale Ends", type: "opening" },
  { day: "Fri 27", event: "Concert at Coca-Cola", type: "concert" },
  { day: "Sat 28", event: "Food Truck Festival", type: "food" },
];

const HOT_DEALS: HotDeal[] = [
  { title: "Atlantis The Palm", discount: "40% OFF", category: "Hotel", icon: Hotel },
  { title: "Emirates Business", discount: "AED 9,999", category: "Flight", icon: Plane },
  { title: "IMG Worlds 2-for-1", discount: "BOGO", category: "Attraction", icon: Ticket },
  { title: "Desert Safari", discount: "35% OFF", category: "Tour", icon: Sun },
];

const TRAVEL_ALERTS: TravelAlert[] = [
  { type: "info", message: "High temperatures expected: 28-32C" },
  { type: "warning", message: "DIFC road closure Dec 25-26" },
  { type: "success", message: "All Metro lines operating normally" },
];

const TRENDING_SEARCHES = [
  { term: "Dubai visa rules 2025", count: 45200 },
  { term: "DSF dates 2025", count: 38100 },
  { term: "Museum of the Future tickets", count: 29400 },
  { term: "Best hotels December", count: 24800 },
  { term: "Ramadan 2025 dates", count: 21300 },
];

const BREAKING_NEWS = [
  "UAE approves visa-free entry for 90 new countries",
  "Dubai Tourism: 17.15M visitors in 2024 - New Record",
  "Dubai Shopping Festival 2025 dates announced",
  "Emirates launches 5 new routes with special fares",
  "AED 128B Al Maktoum Airport expansion approved"
];

function formatViews(views: number): string {
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`;
  }
  return views.toString();
}

function getEventTypeColor(type: string): string {
  switch (type) {
    case "festival": return "bg-[#F94498]/10 text-[#F94498]";
    case "opening": return "bg-[#02A65C]/10 text-[#02A65C]";
    case "concert": return "bg-[#6C5CE7]/10 text-[#6C5CE7]";
    case "food": return "bg-[#FF9327]/10 text-[#FF9327]";
    default: return "bg-slate-100 text-slate-600";
  }
}

function getAlertIcon(type: string) {
  switch (type) {
    case "warning": return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    case "success": return <Shield className="w-4 h-4 text-green-500" />;
    default: return <Sun className="w-4 h-4 text-blue-500" />;
  }
}

function getCategoryColor(categoryId: string): string {
  const category = NEWS_CATEGORIES.find(c => c.id === categoryId);
  return category?.color || "text-slate-600";
}

function getCategoryBgColor(categoryId: string): string {
  const category = NEWS_CATEGORIES.find(c => c.id === categoryId);
  return category?.bgColor || "bg-slate-100";
}

export default function PublicNews() {
  const { t, isRTL, localePath } = useLocale();
  const [email, setEmail] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useDocumentMeta({
    title: "Dubai Travel News | Latest Tourism Updates, Visa & Events 2025",
    description: "Stay updated with Dubai tourism news: visa changes, new attractions, hotel deals, events & travel tips. Your essential guide to visiting Dubai. Updated daily.",
    ogTitle: "Dubai Travel News | Latest Tourism Updates 2025",
    ogDescription: "Breaking news and updates about Dubai tourism, visa rules, events, hotels, and travel deals.",
    ogType: "website",
  });

  return (
    <div className="bg-background min-h-screen flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      <PublicNav />

      {/* Premium Breaking News Ticker */}
      <div className="bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] text-white overflow-hidden border-b border-white/10">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-gradient-to-r from-[#FF0000] to-[#CC0000] px-4 py-2.5 flex items-center gap-2">
              <Flame className="w-4 h-4 animate-pulse" />
              <span className="font-bold text-sm tracking-wide">BREAKING</span>
            </div>
            <div className="overflow-hidden flex-1 py-2.5 px-4">
              <div className="animate-marquee whitespace-nowrap flex gap-16">
                {BREAKING_NEWS.map((news, index) => (
                  <span key={index} className="inline-flex items-center gap-3 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF0000] animate-pulse" />
                    {news}
                  </span>
                ))}
                {BREAKING_NEWS.map((news, index) => (
                  <span key={`repeat-${index}`} className="inline-flex items-center gap-3 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF0000] animate-pulse" />
                    {news}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0 px-4 py-2.5 text-xs text-white/60 hidden md:flex items-center gap-2 border-l border-white/10">
              <Clock className="w-3 h-3" />
              Last updated: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
            {NEWS_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === category.id
                    ? `${category.bgColor} ${category.color}`
                    : "text-muted-foreground hover:bg-muted"
                }`}
                data-testid={`button-category-${category.id}`}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section - Featured Story */}
      <section className="bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-background py-8">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Featured Article */}
            <div className="lg:col-span-2">
              <Card className="overflow-hidden border-0 shadow-2xl group cursor-pointer" data-testid="card-hero-article">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={HERO_ARTICLE.image}
                    alt={HERO_ARTICLE.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  
                  {/* Breaking Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <Badge className="bg-[#FF0000] text-white border-0 px-3 py-1 animate-pulse">
                      <Flame className="w-3 h-3 mr-1" />
                      BREAKING
                    </Badge>
                    <Badge className={`${getCategoryBgColor(HERO_ARTICLE.categoryId)} ${getCategoryColor(HERO_ARTICLE.categoryId)} border-0`}>
                      {HERO_ARTICLE.category}
                    </Badge>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                      {HERO_ARTICLE.title}
                    </h1>
                    <p className="text-white/80 text-sm md:text-base mb-4 line-clamp-2 max-w-3xl">
                      {HERO_ARTICLE.excerpt}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {HERO_ARTICLE.date}
                      </span>
                      <span>{HERO_ARTICLE.readTime}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {formatViews(HERO_ARTICLE.views || 0)} views
                      </span>
                      <span className="hidden sm:inline">By {HERO_ARTICLE.author}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Secondary Headlines */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#F94498]" />
                Top Stories
              </h2>
              {SECONDARY_HEADLINES.map((article) => (
                <Card 
                  key={article.id} 
                  className="overflow-hidden border shadow-sm group cursor-pointer hover:shadow-lg transition-all"
                  data-testid={`card-secondary-${article.id}`}
                >
                  <div className="flex gap-3 p-3">
                    <div className="relative w-24 h-20 flex-shrink-0 rounded-md overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge variant="outline" className={`mb-1.5 text-xs ${getCategoryColor(article.categoryId)} border-current/20`}>
                        {article.category}
                      </Badge>
                      <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-[#6C5CE7] transition-colors">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                        <span>{article.date}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {formatViews(article.views || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="py-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content - 3 columns */}
            <div className="lg:col-span-3 space-y-12">
              
              {/* Latest News Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-gradient-to-b from-[#6C5CE7] to-[#F94498] rounded-full" />
                    <h2 className="text-2xl font-bold">Latest News</h2>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[#6C5CE7]" data-testid="button-view-all-news">
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {LATEST_NEWS.map((article) => (
                    <Card 
                      key={article.id}
                      className="overflow-hidden border shadow-sm group cursor-pointer hover:shadow-xl transition-all duration-300"
                      data-testid={`card-news-${article.id}`}
                    >
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Badge className={`absolute top-3 left-3 ${getCategoryBgColor(article.categoryId)} ${getCategoryColor(article.categoryId)} border-0`}>
                          {article.category}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-[#6C5CE7] transition-colors mb-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            <span>{article.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Eye className="w-3 h-3" />
                            <span>{formatViews(article.views || 0)}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <Button variant="outline" size="lg" className="px-8" data-testid="button-load-more">
                    Load More Stories
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Category Quick Links */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Visa Guide", icon: Ticket, href: "/visa", color: "from-[#6C5CE7] to-[#9077EF]" },
                  { name: "Hotel Deals", icon: Hotel, href: "/hotels", color: "from-[#02A65C] to-[#59ED63]" },
                  { name: "Events Calendar", icon: Calendar, href: "/events", color: "from-[#F94498] to-[#FDA9E5]" },
                  { name: "Attractions", icon: Camera, href: "/attractions", color: "from-[#FF9327] to-[#FFD112]" },
                ].map((item) => (
                  <Link key={item.name} href={localePath(item.href)}>
                    <Card className="p-4 border shadow-sm group cursor-pointer hover:shadow-lg transition-all">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-sm group-hover:text-[#6C5CE7] transition-colors">
                        {item.name}
                      </h3>
                      <ChevronRight className="w-4 h-4 text-muted-foreground mt-1" />
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar - 1 column */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* This Week in Dubai */}
              <Card className="p-5 border shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-[#F94498]" />
                  <h3 className="font-bold">This Week in Dubai</h3>
                </div>
                <div className="space-y-3">
                  {THIS_WEEK_EVENTS.map((event, index) => (
                    <div key={index} className="flex items-center gap-3 group cursor-pointer" data-testid={`event-${index}`}>
                      <div className="w-14 flex-shrink-0">
                        <span className="text-xs font-medium text-muted-foreground">{event.day}</span>
                      </div>
                      <Badge variant="outline" className={`text-xs ${getEventTypeColor(event.type)} border-0`}>
                        {event.event}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <Button variant="ghost" size="sm" className="w-full text-[#6C5CE7]" data-testid="button-full-calendar">
                  View Full Calendar
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Card>

              {/* Hot Deals */}
              <Card className="p-5 border shadow-sm bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5 text-[#FF9327]" />
                  <h3 className="font-bold">Hot Deals Today</h3>
                </div>
                <div className="space-y-3">
                  {HOT_DEALS.map((deal, index) => (
                    <div key={index} className="flex items-center justify-between group cursor-pointer" data-testid={`deal-${index}`}>
                      <div className="flex items-center gap-2">
                        <deal.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium group-hover:text-[#FF9327] transition-colors">{deal.title}</span>
                      </div>
                      <Badge className="bg-[#FF9327] text-white border-0 text-xs">
                        {deal.discount}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 bg-[#FF9327] text-white hover:bg-[#FF9327]/90" data-testid="button-all-deals">
                  See All Deals
                </Button>
              </Card>

              {/* Travel Alerts */}
              <Card className="p-5 border shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold">Travel Alerts</h3>
                </div>
                <div className="space-y-3">
                  {TRAVEL_ALERTS.map((alert, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm" data-testid={`alert-${index}`}>
                      {getAlertIcon(alert.type)}
                      <span className="text-muted-foreground">{alert.message}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Trending Searches */}
              <Card className="p-5 border shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-[#6C5CE7]" />
                  <h3 className="font-bold">Trending Searches</h3>
                </div>
                <div className="space-y-2.5">
                  {TRENDING_SEARCHES.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-3 group cursor-pointer"
                      data-testid={`trending-${index}`}
                    >
                      <span className="w-5 h-5 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-xs font-bold text-muted-foreground">
                        {index + 1}
                      </span>
                      <span className="flex-1 text-sm group-hover:text-[#6C5CE7] transition-colors truncate">
                        {item.term}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Newsletter Signup */}
              <Card className="p-5 border-0 shadow-lg bg-gradient-to-br from-[#6C5CE7] to-[#F94498] text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="w-5 h-5" />
                  <h3 className="font-bold">Daily Newsletter</h3>
                </div>
                <p className="text-sm text-white/80 mb-4">
                  Get Dubai travel updates delivered to your inbox every morning.
                </p>
                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/90 border-0 text-slate-900 placeholder:text-slate-500"
                    data-testid="input-newsletter-email"
                  />
                  <Button 
                    className="w-full bg-white text-[#6C5CE7] hover:bg-white/90"
                    data-testid="button-subscribe"
                  >
                    Subscribe Free
                  </Button>
                </div>
                <p className="text-xs text-white/60 mt-3 text-center flex items-center justify-center gap-1">
                  <Users className="w-3 h-3" />
                  Join 50,000+ subscribers
                </p>
              </Card>

              {/* Quick Links */}
              <Card className="p-5 border shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-[#01BEFF]" />
                  <h3 className="font-bold">Quick Links</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { name: "Dubai Metro Map", href: "#" },
                    { name: "Currency Converter", href: "#" },
                    { name: "Weather Forecast", href: "#" },
                    { name: "Emergency Numbers", href: "#" },
                    { name: "Prayer Times", href: "#" },
                  ].map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#01BEFF] transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {link.name}
                    </a>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 bg-gradient-to-r from-[#1a1a2e] to-[#16213e]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Plan Your Dubai Trip</h2>
              <p className="text-white/70">Explore attractions, hotels, and experiences</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={localePath("/attractions")}>
                <Button size="lg" className="bg-[#6C5CE7] text-white hover:bg-[#6C5CE7]/90" data-testid="button-cta-attractions">
                  <Camera className="w-4 h-4 mr-2" />
                  Attractions
                </Button>
              </Link>
              <Link href={localePath("/hotels")}>
                <Button size="lg" variant="outline" className="border-white/30 text-white bg-white/10" data-testid="button-cta-hotels">
                  <Hotel className="w-4 h-4 mr-2" />
                  Hotels
                </Button>
              </Link>
              <Link href={localePath("/dining")}>
                <Button size="lg" variant="outline" className="border-white/30 text-white bg-white/10" data-testid="button-cta-dining">
                  <Utensils className="w-4 h-4 mr-2" />
                  Dining
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />

      {/* CSS for marquee animation */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
