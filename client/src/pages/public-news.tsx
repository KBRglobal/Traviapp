import { useState } from "react";
import { Link } from "wouter";
import {
  Newspaper, Building2, Train, Calendar, Hotel, Utensils,
  Clock, ChevronRight, TrendingUp, Mail, ArrowRight,
  Plane, Globe, Star, MapPin, Sparkles, Trophy, Camera
} from "lucide-react";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

interface NewsCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  count: number;
}

interface NewsArticle {
  id: number;
  title: string;
  description: string;
  category: string;
  categoryColor: string;
  image: string;
  date: string;
  readTime: string;
  featured?: boolean;
}

interface TrendingTopic {
  name: string;
  count: number;
}

const NEWS_CATEGORIES: NewsCategory[] = [
  {
    id: "tourism",
    name: "Tourism Updates",
    description: "New attractions, visitor milestones & events",
    icon: Camera,
    gradient: "from-[#6C5CE7] to-[#9077EF]",
    count: 24
  },
  {
    id: "real-estate",
    name: "Real Estate News",
    description: "Market updates & new developments",
    icon: Building2,
    gradient: "from-[#FF9327] to-[#FFD112]",
    count: 18
  },
  {
    id: "transportation",
    name: "Transportation",
    description: "Metro expansions & airport news",
    icon: Train,
    gradient: "from-[#01BEFF] to-[#6C5CE7]",
    count: 12
  },
  {
    id: "events",
    name: "Events & Festivals",
    description: "Expo City, Global Village & more",
    icon: Calendar,
    gradient: "from-[#F94498] to-[#FDA9E5]",
    count: 31
  },
  {
    id: "hotels",
    name: "Hotel & Resort News",
    description: "New openings & renovations",
    icon: Hotel,
    gradient: "from-[#02A65C] to-[#59ED63]",
    count: 15
  },
  {
    id: "dining",
    name: "Restaurant & Food Scene",
    description: "Culinary trends & new venues",
    icon: Utensils,
    gradient: "from-[#EC4899] to-[#F94498]",
    count: 22
  }
];

const FEATURED_ARTICLE: NewsArticle = {
  id: 0,
  title: "Dubai Tourism Records 17.15 Million International Visitors in 2024",
  description: "Dubai has achieved a record-breaking milestone, welcoming 17.15 million international overnight visitors in 2024, surpassing all previous records. The emirate continues to solidify its position as one of the world's most visited destinations, with tourism contributing significantly to its economic diversification goals.",
  category: "Tourism Updates",
  categoryColor: "bg-[#6C5CE7]",
  image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=800&fit=crop",
  date: "Dec 19, 2024",
  readTime: "5 min read",
  featured: true
};

const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 1,
    title: "Dubai Metro Blue Line to Connect JVC by 2028",
    description: "The new Blue Line expansion will serve over 500,000 residents in Jumeirah Village Circle and surrounding communities, featuring 14 new stations.",
    category: "Transportation",
    categoryColor: "bg-[#01BEFF]",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop",
    date: "Dec 18, 2024",
    readTime: "4 min read"
  },
  {
    id: 2,
    title: "Global Village 2024-25 Season Opens with 90 Countries",
    description: "The world's largest tourism, leisure, shopping, and entertainment project welcomes visitors with new pavilions and experiences from 90 countries.",
    category: "Events & Festivals",
    categoryColor: "bg-[#F94498]",
    image: "https://images.unsplash.com/photo-1578895101408-1a36b834405b?w=800&h=600&fit=crop",
    date: "Dec 17, 2024",
    readTime: "3 min read"
  },
  {
    id: 3,
    title: "Palm Jebel Ali Sales Exceed AED 5 Billion",
    description: "Nakheel reports overwhelming demand for the new Palm Jebel Ali development, with sales surpassing AED 5 billion within the first quarter of launch.",
    category: "Real Estate News",
    categoryColor: "bg-[#FF9327]",
    image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&h=600&fit=crop",
    date: "Dec 16, 2024",
    readTime: "4 min read"
  },
  {
    id: 4,
    title: "Museum of the Future Announces New 2025 Exhibition",
    description: "Dubai's iconic Museum of the Future unveils plans for a groundbreaking exhibition exploring the intersection of AI and human creativity.",
    category: "Tourism Updates",
    categoryColor: "bg-[#6C5CE7]",
    image: "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&h=600&fit=crop",
    date: "Dec 15, 2024",
    readTime: "3 min read"
  },
  {
    id: 5,
    title: "New AED 128B Al Maktoum Airport Expansion Details Revealed",
    description: "Dubai announces comprehensive expansion plans for Al Maktoum International Airport, set to become the world's largest airport with capacity for 260 million passengers.",
    category: "Transportation",
    categoryColor: "bg-[#01BEFF]",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop",
    date: "Dec 14, 2024",
    readTime: "6 min read"
  },
  {
    id: 6,
    title: "Atlantis The Royal Wins Best New Hotel 2024",
    description: "The ultra-luxury resort on Palm Jumeirah receives global recognition at the World Travel Awards, celebrating its innovative design and exceptional guest experiences.",
    category: "Hotel & Resort News",
    categoryColor: "bg-[#02A65C]",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
    date: "Dec 13, 2024",
    readTime: "4 min read"
  },
  {
    id: 7,
    title: "Dubai Food Festival 2025 Dates Announced",
    description: "The annual culinary celebration returns with over 700 restaurants participating, featuring exclusive dining experiences and celebrity chef appearances.",
    category: "Restaurant & Food Scene",
    categoryColor: "bg-[#EC4899]",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
    date: "Dec 12, 2024",
    readTime: "3 min read"
  },
  {
    id: 8,
    title: "Expo City Dubai Launches New Innovation Hub",
    description: "The former Expo 2020 site opens a dedicated space for startups and tech companies, offering state-of-the-art facilities and mentorship programs.",
    category: "Events & Festivals",
    categoryColor: "bg-[#F94498]",
    image: "https://images.unsplash.com/photo-1572947650440-e8a97ef053b2?w=800&h=600&fit=crop",
    date: "Dec 11, 2024",
    readTime: "5 min read"
  }
];

const TRENDING_TOPICS: TrendingTopic[] = [
  { name: "Expo City Dubai", count: 156 },
  { name: "Golden Visa", count: 143 },
  { name: "Dubai Metro", count: 128 },
  { name: "Palm Jebel Ali", count: 112 },
  { name: "Museum of the Future", count: 98 },
  { name: "Global Village", count: 87 },
  { name: "Dubai Creek Tower", count: 76 },
  { name: "Al Maktoum Airport", count: 65 },
  { name: "Dubai South", count: 54 },
  { name: "Burj Khalifa", count: 48 }
];

const BREAKING_NEWS = [
  "Dubai ranks #1 in global tourist arrivals for 2024",
  "Emirates announces new routes to 5 destinations",
  "Dubai Mall sets new visitor record with 120M guests",
  "New beach development announced for JBR",
  "Dubai announces DSF 2025 dates and attractions"
];

function NewsCard({ article, localePath }: { article: NewsArticle; localePath: (path: string) => string }) {
  return (
    <Card
      className="group overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
      data-testid={`card-news-${article.id}`}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge className={`absolute top-3 left-3 ${article.categoryColor} text-white border-0`}>
          {article.category}
        </Badge>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-[#6C5CE7] transition-colors mb-2">
          {article.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {article.description}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{article.date}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {article.readTime}
          </span>
        </div>
      </div>
    </Card>
  );
}

function CategoryCard({ category }: { category: NewsCategory }) {
  return (
    <Card
      className="group overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer p-4"
      data-testid={`card-category-${category.id}`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center flex-shrink-0`}>
          <category.icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground group-hover:text-[#6C5CE7] transition-colors mb-1">
            {category.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {category.description}
          </p>
          <span className="text-xs text-muted-foreground mt-1 block">
            {category.count} articles
          </span>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-[#6C5CE7] transition-colors flex-shrink-0" />
      </div>
    </Card>
  );
}

export default function PublicNews() {
  const { t, isRTL, localePath } = useLocale();
  const [email, setEmail] = useState("");
  const [tickerIndex, setTickerIndex] = useState(0);

  useDocumentMeta({
    title: "Dubai Travel News & Updates | Latest Tourism Headlines | TRAVI",
    description: "Stay informed with the latest Dubai travel news, tourism updates, real estate developments, transportation expansions, and event announcements. Your premium source for Dubai news.",
    ogTitle: "Dubai Travel News & Updates | TRAVI",
    ogDescription: "Breaking news and updates about Dubai tourism, real estate, events, and more.",
    ogType: "website",
  });

  return (
    <div className="bg-background min-h-screen flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      <PublicNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Breadcrumbs />
      </div>

      {/* Breaking News Ticker */}
      <div className="bg-gradient-to-r from-[#6C5CE7] to-[#EC4899] text-white py-2 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Badge className="bg-white/20 text-white border-0 flex-shrink-0">
              <Sparkles className="w-3 h-3 mr-1" />
              Breaking
            </Badge>
            <div className="overflow-hidden flex-1">
              <div className="animate-marquee whitespace-nowrap flex gap-12">
                {BREAKING_NEWS.map((news, index) => (
                  <span key={index} className="inline-flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                    {news}
                  </span>
                ))}
                {BREAKING_NEWS.map((news, index) => (
                  <span key={`repeat-${index}`} className="inline-flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                    {news}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop"
            alt="Dubai skyline at sunset"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <Badge className="mb-6 bg-white/20 text-white border-0 px-4 py-1">
            <Newspaper className="w-4 h-4 mr-2" />
            Premium News Portal
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Dubai Travel News & Updates
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Stay Informed About Dubai - Your trusted source for the latest tourism headlines, 
            real estate developments, and everything happening in the City of Gold.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge variant="outline" className="bg-white/10 text-white border-white/30 px-3 py-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              17.15M Visitors in 2024
            </Badge>
            <Badge variant="outline" className="bg-white/10 text-white border-white/30 px-3 py-1">
              <Globe className="w-3 h-3 mr-1" />
              #1 Tourist Destination
            </Badge>
            <Badge variant="outline" className="bg-white/10 text-white border-white/30 px-3 py-1">
              <Trophy className="w-3 h-3 mr-1" />
              World Travel Awards Winner
            </Badge>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C5CE7] to-[#EC4899] flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Featured Story</h2>
              <p className="text-muted-foreground text-sm">Top headline of the day</p>
            </div>
          </div>

          <Card className="overflow-hidden border shadow-lg">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative aspect-video md:aspect-auto overflow-hidden">
                <img
                  src={FEATURED_ARTICLE.image}
                  alt={FEATURED_ARTICLE.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:hidden" />
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <Badge className={`${FEATURED_ARTICLE.categoryColor} text-white border-0 w-fit mb-4`}>
                  {FEATURED_ARTICLE.category}
                </Badge>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                  {FEATURED_ARTICLE.title}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {FEATURED_ARTICLE.description}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span>{FEATURED_ARTICLE.date}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {FEATURED_ARTICLE.readTime}
                  </span>
                </div>
                <Button className="w-fit" data-testid="button-read-featured">
                  Read Full Story
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* News Categories */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-1">News Categories</h2>
              <p className="text-muted-foreground">Browse news by topic</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {NEWS_CATEGORIES.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Grid with Trending Sidebar */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF9327] to-[#FFD112] flex items-center justify-center">
              <Newspaper className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Latest News</h2>
              <p className="text-muted-foreground text-sm">Stay updated with Dubai headlines</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* News Grid */}
            <div className="lg:col-span-3">
              <div className="grid sm:grid-cols-2 gap-6">
                {NEWS_ARTICLES.map((article) => (
                  <NewsCard key={article.id} article={article} localePath={localePath} />
                ))}
              </div>
              
              <div className="text-center mt-10">
                <Button variant="outline" size="lg" data-testid="button-load-more">
                  Load More News
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Trending Topics Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-5 sticky top-24">
                <div className="flex items-center gap-2 mb-5">
                  <TrendingUp className="w-5 h-5 text-[#6C5CE7]" />
                  <h3 className="font-semibold">Trending Topics</h3>
                </div>
                <div className="space-y-3">
                  {TRENDING_TOPICS.map((topic, index) => (
                    <div
                      key={topic.name}
                      className="flex items-center gap-3 group cursor-pointer"
                      data-testid={`trending-topic-${index}`}
                    >
                      <span className="w-6 h-6 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-xs font-medium text-muted-foreground">
                        {index + 1}
                      </span>
                      <span className="flex-1 text-sm group-hover:text-[#6C5CE7] transition-colors">
                        {topic.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {topic.count}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t">
                  <h4 className="font-medium mb-3 text-sm">Popular Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Dubai 2024", "Tourism", "Investment", "Events", "Lifestyle", "Travel Tips"].map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-[#6C5CE7] hover:text-white hover:border-[#6C5CE7] transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-[#6C5CE7] to-[#EC4899]">
            <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
              <div className="text-white">
                <Badge className="mb-4 bg-white/20 text-white border-0">
                  <Mail className="w-3 h-3 mr-1" />
                  Newsletter
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Get Dubai Updates Delivered
                </h2>
                <p className="text-white/80 mb-6 leading-relaxed">
                  Subscribe to our weekly newsletter for the latest Dubai travel news, 
                  exclusive insights, and expert tips delivered straight to your inbox.
                </p>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    Weekly roundup of top stories
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    Exclusive travel deals and offers
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    Event announcements and highlights
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    Real estate market insights
                  </li>
                </ul>
              </div>
              <div className="flex items-center">
                <div className="w-full bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8">
                  <h3 className="text-white font-semibold mb-4">Subscribe Now</h3>
                  <div className="space-y-4">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/90 border-0 text-slate-900 placeholder:text-slate-500"
                      data-testid="input-newsletter-email"
                    />
                    <Button
                      className="w-full bg-white text-[#6C5CE7] hover:bg-white/90"
                      size="lg"
                      data-testid="button-subscribe-newsletter"
                    >
                      Subscribe to Newsletter
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <p className="text-white/60 text-xs text-center">
                      No spam. Unsubscribe anytime.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
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
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
