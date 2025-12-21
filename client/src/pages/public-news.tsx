import { useState } from "react";
import { Link } from "wouter";
import {
  Newspaper, Building2, Calendar, Hotel, Utensils,
  Clock, ChevronRight, TrendingUp, Mail, ArrowRight,
  Plane, Globe, Eye, Ticket, AlertTriangle, Tag,
  Users, BookOpen, ExternalLink, Flame, Sun, Shield, Camera,
  Play, Video, Star
} from "lucide-react";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/lib/i18n/LocaleRouter";

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
  categoryColor: "bg-rose-500",
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
    categoryColor: "bg-blue-500",
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
    categoryColor: "bg-emerald-500",
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
    categoryColor: "bg-pink-500",
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
    categoryColor: "bg-sky-500",
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
    categoryColor: "bg-emerald-500",
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
    categoryColor: "bg-fuchsia-500",
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
    categoryColor: "bg-rose-400",
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
    categoryColor: "bg-pink-500",
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
    categoryColor: "bg-teal-500",
    image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&h=600&fit=crop",
    date: "Dec 13, 2024",
    readTime: "4 min",
    author: "Property Desk",
    views: 26800
  }
];

const VIDEO_STORIES = [
  {
    id: 1,
    title: "Inside the World's Tallest Building: Burj Khalifa Tour",
    duration: "8:45",
    views: 125000,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=450&fit=crop"
  },
  {
    id: 2,
    title: "Dubai Creek Harbour: The Future of Waterfront Living",
    duration: "5:32",
    views: 89000,
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=450&fit=crop"
  },
  {
    id: 3,
    title: "Desert Safari Experience: What to Expect",
    duration: "6:18",
    views: 156000,
    image: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800&h=450&fit=crop"
  },
  {
    id: 4,
    title: "Palm Jumeirah: Engineering Marvel Explained",
    duration: "10:22",
    views: 203000,
    image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&h=450&fit=crop"
  }
];

const FEATURED_ATTRACTIONS: NewsArticle[] = [
  {
    id: 10,
    title: "Museum of the Future: Complete Visitor Guide 2025",
    excerpt: "Everything you need to know about Dubai's most iconic new landmark, from ticket prices to best visiting times.",
    category: "Attractions",
    categoryColor: "bg-purple-500",
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
    categoryColor: "bg-purple-500",
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
    categoryColor: "bg-purple-500",
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
    categoryColor: "bg-purple-500",
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=600&fit=crop",
    date: "Dec 17, 2024",
    readTime: "3 min",
    author: "Events Team",
    views: 15600
  }
];

const THIS_WEEK = [
  { day: "Mon", date: "23", event: "DSF Grand Opening", color: "bg-rose-500" },
  { day: "Wed", date: "25", event: "Christmas at Expo City", color: "bg-emerald-500" },
  { day: "Fri", date: "27", event: "Concert at Coca-Cola", color: "bg-violet-500" },
  { day: "Sat", date: "28", event: "Food Truck Festival", color: "bg-orange-500" },
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
    <div className="bg-white dark:bg-slate-950 min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      <PublicNav />

      {/* Breaking News Ticker */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center h-10">
            <div className="flex-shrink-0 bg-red-600 h-full px-4 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <Flame className="w-3.5 h-3.5" />
              <span className="text-xs font-bold tracking-wider">BREAKING</span>
            </div>
            <div className="overflow-hidden flex-1 px-4">
              <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
                {[...BREAKING_NEWS, ...BREAKING_NEWS].map((news, i) => (
                  <span key={i} className="text-sm text-slate-300 flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    {news}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="sticky top-0 z-40 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-12 gap-1 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                activeCategory === null
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
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
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
                data-testid={`button-category-${cat.id}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Main Featured Article - 3 columns */}
          <div className="lg:col-span-3">
            <article className="group cursor-pointer transition-transform duration-300 hover:scale-[1.01]" data-testid="card-hero-article">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4">
                <img
                  src={HERO_ARTICLE.image}
                  alt={HERO_ARTICLE.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
                
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-red-600 text-white text-xs font-bold rounded flex items-center gap-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                    </span>
                    BREAKING
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className={`inline-block px-3 py-1 ${HERO_ARTICLE.categoryColor} text-white text-xs font-semibold rounded-full mb-3`}>
                    {HERO_ARTICLE.category}
                  </span>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
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
              </div>
            </article>
          </div>

          {/* Top Stories - Bento Grid 2 columns */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-rose-500" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Top Stories</h2>
            </div>
            {/* Bento Grid Layout */}
            <div className="grid grid-cols-2 gap-3 flex-1">
              {/* Large card - spans 2 columns */}
              <article 
                className="col-span-2 group cursor-pointer relative rounded-xl overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
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
                    <span className={`inline-block px-2 py-0.5 ${TOP_STORIES[0].categoryColor} text-white text-[10px] font-semibold rounded mb-2`}>
                      {TOP_STORIES[0].category}
                    </span>
                    <h3 className="font-bold text-sm text-white line-clamp-2 leading-snug">
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
                  className="group cursor-pointer relative rounded-xl overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
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
                      <span className={`inline-block px-2 py-0.5 ${article.categoryColor} text-white text-[10px] font-semibold rounded mb-1.5`}>
                        {article.category}
                      </span>
                      <h3 className="font-semibold text-xs text-white line-clamp-2 leading-snug">
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
      </section>

      {/* Video Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Watch: Dubai Video Stories</h2>
          </div>
          <Button variant="ghost" size="sm" className="text-rose-600 dark:text-rose-400" data-testid="button-watch-all">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {VIDEO_STORIES.map((video, index) => (
            <article 
              key={video.id}
              className="group cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
              data-testid={`card-video-${index}`}
            >
              <div className="relative aspect-video rounded-xl overflow-hidden mb-2">
                <img
                  src={video.image}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Enhanced overlay for better text contrast in both modes */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/10 dark:from-black/70 dark:via-black/40 dark:to-black/20 transition-opacity duration-300 group-hover:from-black/60 dark:group-hover:from-black/80" />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/90 dark:bg-white/95 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:bg-white">
                    <Play className="w-5 h-5 text-slate-900 ml-1" fill="currentColor" />
                  </div>
                </div>
                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 dark:bg-black/90 text-white text-xs font-medium rounded">
                  {video.duration}
                </div>
              </div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                {video.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                <Eye className="w-3 h-3" />
                {formatViews(video.views)} views
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Featured Category Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Featured in Attractions</h2>
          </div>
          <Button variant="ghost" size="sm" className="text-purple-600 dark:text-purple-400" data-testid="link-featured-all">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Large Featured Article */}
          <article 
            className="group cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
            data-testid="card-featured-attraction-main"
          >
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden">
              <img
                src={FEATURED_ATTRACTIONS[0].image}
                alt={FEATURED_ATTRACTIONS[0].title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Enhanced gradient overlay for dark mode */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent dark:from-black/90 dark:via-black/50 dark:to-black/20 transition-opacity duration-300 group-hover:from-black/90 dark:group-hover:from-black/95" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className={`inline-block px-3 py-1 ${FEATURED_ATTRACTIONS[0].categoryColor} text-white text-xs font-semibold rounded-full mb-3`}>
                  {FEATURED_ATTRACTIONS[0].category}
                </span>
                <h3 className="text-xl lg:text-2xl font-bold text-white leading-tight mb-2">
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
            </div>
          </article>

          {/* List of smaller articles */}
          <div className="space-y-4">
            {FEATURED_ATTRACTIONS.slice(1, 4).map((article, index) => (
              <article 
                key={article.id}
                className="group cursor-pointer flex gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-transparent dark:border-slate-800 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-[1.01]"
                data-testid={`card-featured-attraction-${index}`}
              >
                <div className="relative w-28 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <span className={`inline-block w-fit px-2 py-0.5 ${article.categoryColor} text-white text-[10px] font-semibold rounded mb-1.5`}>
                    {article.category}
                  </span>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                    <span>{article.date}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {formatViews(article.views)}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-t border-slate-200 dark:border-slate-800">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Latest News</h2>
              <Button variant="ghost" size="sm" className="text-rose-600" data-testid="button-view-all">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="space-y-6">
              {LATEST_NEWS.map((article) => (
                <article 
                  key={article.id}
                  className="group cursor-pointer flex gap-5 pb-6 border-b border-slate-200 dark:border-slate-800 last:border-0 transition-transform duration-300 hover:scale-[1.01]"
                  data-testid={`card-news-${article.id}`}
                >
                  <div className="relative w-40 h-28 sm:w-48 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <span className={`inline-block w-fit px-2.5 py-0.5 ${article.categoryColor} text-white text-xs font-semibold rounded-full mb-2`}>
                      {article.category}
                    </span>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors mb-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2 hidden sm:block">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
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
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* This Week */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-rose-500" />
                <h3 className="font-bold text-slate-900 dark:text-white">This Week in Dubai</h3>
              </div>
              <div className="space-y-3">
                {THIS_WEEK.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 group cursor-pointer transition-transform duration-200 hover:scale-[1.02]" data-testid={`event-${i}`}>
                    <div className="w-12 text-center">
                      <div className="text-[10px] font-medium text-slate-500 uppercase">{item.day}</div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white">{item.date}</div>
                    </div>
                    <div className={`flex-1 px-3 py-2 rounded-lg ${item.color} bg-opacity-10 dark:bg-opacity-20 group-hover:bg-opacity-20 dark:group-hover:bg-opacity-30 transition-colors`}>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{item.event}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hot Deals */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl p-5 border border-amber-200/50 dark:border-amber-800/30">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-slate-900 dark:text-white">Hot Deals</h3>
              </div>
              <div className="space-y-3">
                {HOT_DEALS.map((deal, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl transition-transform duration-200 hover:scale-[1.02] cursor-pointer" data-testid={`deal-${i}`}>
                    <div className="flex items-center gap-2">
                      <deal.icon className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{deal.title}</span>
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">
                      {deal.discount}
                    </span>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4 bg-amber-500 text-white" data-testid="button-all-deals">
                See All Deals
              </Button>
            </div>

            {/* Travel Alerts */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-slate-900 dark:text-white">Travel Alerts</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-sm" data-testid="alert-0">
                  <Sun className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-400">High temperatures expected: 28-32C</span>
                </div>
                <div className="flex items-start gap-2 text-sm" data-testid="alert-1">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-400">DIFC road closure Dec 25-26</span>
                </div>
                <div className="flex items-start gap-2 text-sm" data-testid="alert-2">
                  <Shield className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-400">All Metro lines operating normally</span>
                </div>
              </div>
            </div>

            {/* Trending Searches */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-rose-500" />
                <h3 className="font-bold text-slate-900 dark:text-white">Trending Searches</h3>
              </div>
              <div className="space-y-2">
                {TRENDING.map((item) => (
                  <div key={item.rank} className="flex items-center gap-3 group cursor-pointer transition-transform duration-200 hover:scale-[1.02]" data-testid={`trending-${item.rank}`}>
                    <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400">
                      {item.rank}
                    </span>
                    <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      {item.term}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Newsletter with Animated Gradient */}
            <div className="relative rounded-2xl p-6 text-white overflow-hidden" data-testid="section-newsletter-cta">
              {/* Animated gradient background - light mode */}
              <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-purple-600 to-indigo-700 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 animate-gradient-shift" />
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/50 via-transparent to-indigo-500/50 dark:from-rose-500/20 dark:via-transparent dark:to-purple-500/20 animate-gradient-shift-reverse" />
              {/* Dark overlay for better text contrast */}
              <div className="absolute inset-0 bg-black/10 dark:bg-black/40" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Mail className="w-5 h-5" />
                  <h3 className="font-bold text-lg">Daily Newsletter</h3>
                </div>
                <p className="text-sm text-white/90 mb-4">
                  Get Dubai travel updates delivered to your inbox every morning.
                </p>
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 mb-3 focus:bg-white/30 dark:bg-white/10 dark:border-white/20 dark:focus:bg-white/20"
                  data-testid="input-newsletter-email"
                />
                <Button className="w-full bg-white text-rose-600 font-semibold dark:bg-white dark:text-slate-900" data-testid="button-subscribe">
                  Subscribe Free
                </Button>
                <p className="text-xs text-white/80 mt-3 text-center flex items-center justify-center gap-1">
                  <Users className="w-3 h-3" />
                  Join 50,000+ subscribers
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-sky-500" />
                <h3 className="font-bold text-slate-900 dark:text-white">Quick Links</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {["Metro Map", "Currency", "Weather", "Emergency"].map((link) => (
                  <a
                    key={link}
                    href="#"
                    className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Quick Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: "visa", name: "Visa Guide", icon: Ticket, href: "/visa", color: "bg-rose-500" },
            { id: "hotels", name: "Hotel Deals", icon: Hotel, href: "/hotels", color: "bg-emerald-500" },
            { id: "events", name: "Events", icon: Calendar, href: "/events", color: "bg-pink-500" },
            { id: "attractions", name: "Attractions", icon: Camera, href: "/attractions", color: "bg-purple-500" },
          ].map((item) => (
            <Link key={item.name} href={localePath(item.href)} data-testid={`link-category-${item.id}`}>
              <div className="group cursor-pointer p-5 bg-slate-50 dark:bg-slate-900 border border-transparent dark:border-slate-800 rounded-2xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-[1.02]">
                <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110`}>
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  {item.name}
                </h3>
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 mt-1 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">Plan Your Dubai Trip</h2>
              <p className="text-slate-400">Explore attractions, hotels, and experiences</p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href={localePath("/attractions")}>
                <Button size="lg" className="bg-rose-500 text-white" data-testid="button-cta-attractions">
                  <Camera className="w-4 h-4 mr-2" />
                  Attractions
                </Button>
              </Link>
              <Link href={localePath("/hotels")}>
                <Button size="lg" variant="outline" className="border-slate-600 text-white" data-testid="button-cta-hotels">
                  <Hotel className="w-4 h-4 mr-2" />
                  Hotels
                </Button>
              </Link>
              <Link href={localePath("/dining")}>
                <Button size="lg" variant="outline" className="border-slate-600 text-white" data-testid="button-cta-dining">
                  <Utensils className="w-4 h-4 mr-2" />
                  Dining
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />

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
    </div>
  );
}
