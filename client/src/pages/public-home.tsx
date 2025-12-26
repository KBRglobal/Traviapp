import { Search, Star, MapPin, ChevronRight, Mail, BookOpen, Globe, Building, UtensilsCrossed, Calendar, Clock, DollarSign, ArrowRight, Check, TrendingUp } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import type { Content, ContentWithRelations } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import mascotImage from "@assets/Mascot_for_Dark_Background_1765497703861.png";
import skyBackground from "@assets/blue-sky-clouds-background_1766314952453.jpg";

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

const heroImage = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop&q=80";

const categoryConfig = [
  { key: "attractions", type: "attraction", icon: Building, color: "#6C5CE7" },
  { key: "hotels", type: "hotel", icon: Building, color: "#EC4899" },
  { key: "dining", type: "dining", icon: UtensilsCrossed, color: "#F59E0B" },
  { key: "districts", type: "district", icon: MapPin, color: "#10B981" },
  { key: "guides", type: "article", icon: BookOpen, color: "#3B82F6" },
  { key: "events", type: "event", icon: Calendar, color: "#8B5CF6" },
];

const topAttractions = [
  { name: "Burj Khalifa", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop", rating: 4.9, area: "Downtown", price: "From $35", slug: "burj-khalifa" },
  { name: "Dubai Mall", image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=400&h=300&fit=crop", rating: 4.8, area: "Downtown", price: "Free", slug: "dubai-mall" },
  { name: "Desert Safari", image: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=400&h=300&fit=crop", rating: 4.7, area: "Desert", price: "From $65", slug: "desert-safari" },
  { name: "Palm Jumeirah", image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=400&h=300&fit=crop", rating: 4.8, area: "Palm", price: "Free", slug: "palm-jumeirah" },
];

const districts = [
  { name: "Downtown Dubai", attractions: 45, restaurants: 23, image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop", slug: "downtown" },
  { name: "Dubai Marina", attractions: 28, restaurants: 41, image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400&h=300&fit=crop", slug: "marina" },
  { name: "Old Dubai", attractions: 32, restaurants: 15, image: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=400&h=300&fit=crop", slug: "old-dubai" },
];

const hotels = [
  { name: "Atlantis The Royal", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop", stars: 5, area: "Palm", price: "From $800", slug: "atlantis-royal" },
  { name: "Burj Al Arab", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop", stars: 5, area: "Jumeirah", price: "From $2000", slug: "burj-al-arab" },
  { name: "JW Marriott", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop", stars: 5, area: "Marina", price: "From $350", slug: "jw-marriott" },
  { name: "Rove Downtown", image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop", stars: 4, area: "Downtown", price: "From $120", slug: "rove-downtown" },
];

const restaurants = [
  { name: "Nobu", cuisine: "Japanese", priceLevel: "$$$$", area: "Downtown", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop", slug: "nobu" },
  { name: "SALT Burger", cuisine: "Burgers", priceLevel: "$", area: "Various", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop", slug: "salt-burger" },
  { name: "Pierchic", cuisine: "Seafood", priceLevel: "$$$$", area: "Jumeirah", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", slug: "pierchic" },
  { name: "Ravi Restaurant", cuisine: "Pakistani", priceLevel: "$", area: "Satwa", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop", slug: "ravi" },
];

const upcomingEvents = [
  { date: "Dec 22", title: "Dubai Shopping Festival Opening", slug: "dsf-2024" },
  { date: "Dec 23", title: "Burj Khalifa NYE Rehearsal (Free!)", slug: "nye-rehearsal" },
  { date: "Dec 25", title: "Christmas Markets at Madinat", slug: "christmas-markets" },
  { date: "Dec 31", title: "New Year's Eve Fireworks", slug: "nye-fireworks" },
];

const popularGuides = [
  { title: "Best Time to Visit Dubai", slug: "best-time-visit" },
  { title: "Dubai on a Budget", slug: "budget-guide" },
  { title: "What to Pack", slug: "packing-list" },
  { title: "Laws Tourists Should Know", slug: "laws-for-tourists" },
  { title: "First Time in Dubai? Read This", slug: "first-time-guide" },
];

const mascotPhrases = [
  "mascotSurprised",
  "mascotWhyCatch",
  "mascotNotReady",
  "mascotTooSlow",
  "mascotNiceDay",
  "mascotCantCatch",
];

const getRandomPosition = (heroRect: DOMRect) => {
  // Keep mascot floating in the upper-left quadrant as a decorative element
  // Horizontal: 3-25% of hero width (capped at 200px)
  const minX = Math.max(10, heroRect.width * 0.03);
  const maxX = Math.min(heroRect.width * 0.25, 200);
  
  // Vertical: 15-45% of hero height (capped at 350px)
  const minY = Math.max(100, heroRect.height * 0.15);
  const maxY = Math.min(heroRect.height * 0.45, 350);
  
  const x = minX + Math.random() * (Math.max(0, maxX - minX));
  const y = minY + Math.random() * (maxY - minY);
  
  return { x: Math.max(10, x), y: Math.max(100, y) };
};

export default function PublicHome() {
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { t, localePath, isRTL } = useLocale();
  
  const heroRef = useRef<HTMLElement>(null);
  const traviTextRef = useRef<HTMLSpanElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [mascotPosition, setMascotPosition] = useState({ x: 0, y: 0 });
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(-1);
  const [showPhrase, setShowPhrase] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  
  // Get actual mascot width for responsive positioning
  const getMascotWidth = useCallback(() => {
    if (mascotRef.current) {
      return mascotRef.current.getBoundingClientRect().width;
    }
    // Fallback: w-24 on mobile (96px), w-32 on desktop (128px)
    return typeof window !== "undefined" && window.innerWidth < 768 ? 96 : 128;
  }, []);
  
  useEffect(() => {
    if (heroRef.current && !isInitialized) {
      // Position mascot as a floating decorative element in the upper-left quadrant
      const heroRect = heroRef.current.getBoundingClientRect();
      const mascotWidth = getMascotWidth();
      
      // Anchor to upper-left area (5-15% from left, 15-25% from top)
      const startX = Math.max(20, heroRect.width * 0.08);
      const startY = Math.max(120, heroRect.height * 0.2);
      
      setMascotPosition({ 
        x: Math.min(startX, heroRect.width * 0.15), 
        y: startY 
      });
      setIsInitialized(true);
    }
  }, [isInitialized, getMascotWidth]);
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  
  const handleMascotHover = useCallback(() => {
    if (!heroRef.current) return;
    
    // Clear any existing timeout
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    // Only move mascot if reduced motion is not preferred
    if (!prefersReducedMotion) {
      const heroRect = heroRef.current.getBoundingClientRect();
      const newPos = getRandomPosition(heroRect);
      setMascotPosition(newPos);
    }
    
    // Always show speech bubble (even with reduced motion)
    setCurrentPhraseIndex((prev) => (prev + 1) % mascotPhrases.length);
    setShowPhrase(true);
    
    // Set new timeout
    timeoutRef.current = setTimeout(() => setShowPhrase(false), 4000);
  }, [prefersReducedMotion]);

  useDocumentMeta({
    title: "Travi - Dubai Travel Guide | Things to Do, Hotels & Attractions",
    description: "The most comprehensive guide to Dubai's attractions, hotels & hidden gems. Written by local experts in 17 languages.",
    ogTitle: "Travi - Discover the World Like a Local",
    ogDescription: "The most comprehensive guide to Dubai's attractions, hotels & hidden gems.",
    ogType: "website",
  });

  const { data: attractionsData = [] } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/public/contents", "attraction"],
    queryFn: () => fetch("/api/public/contents?type=attraction&limit=50").then(r => r.json()),
  });

  const { data: hotelsData = [] } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/public/contents", "hotel"],
    queryFn: () => fetch("/api/public/contents?type=hotel&limit=50").then(r => r.json()),
  });

  const { data: diningData = [] } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/public/contents", "dining"],
    queryFn: () => fetch("/api/public/contents?type=dining&limit=50").then(r => r.json()),
  });

  const { data: districtsData = [] } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/public/contents", "district"],
    queryFn: () => fetch("/api/public/contents?type=district&limit=50").then(r => r.json()),
  });

  const { data: articlesData = [] } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/public/contents", "article"],
    queryFn: () => fetch("/api/public/contents?type=article&limit=50").then(r => r.json()),
  });

  const { data: eventsData = [] } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/public/contents", "event"],
    queryFn: () => fetch("/api/public/contents?type=event&limit=50").then(r => r.json()),
  });

  const { data: featuredPromotions = [] } = useQuery<HomepagePromotion[]>({
    queryKey: ["/api/homepage-promotions/featured"],
  });

  const contentCounts: Record<string, number> = {
    attraction: attractionsData.length,
    hotel: hotelsData.length,
    dining: diningData.length,
    district: districtsData.length,
    article: articlesData.length,
    event: eventsData.length,
  };

  const totalPublishedContent = Object.values(contentCounts).reduce((sum, count) => sum + count, 0);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setLocation(localePath(`/search?q=${encodeURIComponent(searchQuery.trim())}`));
    }
  };

  const attractionsContent = attractionsData.slice(0, 4);
  const hotelsContent = hotelsData.slice(0, 4);
  const diningContent = diningData.slice(0, 4);
  const districtsContent = districtsData.slice(0, 3);
  const articlesContent = articlesData.slice(0, 5);
  const eventsContent = eventsData.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md">
        {t("home.skipToMain")}
      </a>

      <PublicNav 
        variant="transparent"
        transparentTone="light"
        hideOnMobile={true}
        externalMobileMenuOpen={mobileMenuOpen}
        onMobileMenuToggle={setMobileMenuOpen}
      />

      <main id="main-content">
        {/* 1. HERO SECTION - Playful Sky Theme with Interactive Mascot */}
        <section 
          ref={heroRef}
          className="relative min-h-[85vh] flex items-center overflow-hidden" 
          data-testid="section-hero"
        >
          {/* Sky Background */}
          <div className="absolute inset-0">
            <img 
              src={skyBackground} 
              alt=""
              className="w-full h-full object-cover"
              aria-hidden="true"
            />
          </div>

          {/* Interactive Mascot - Hidden on mobile, shown in fixed position on desktop */}
          {isInitialized && (
            <div
              ref={mascotRef}
              className="hidden md:block absolute z-20 cursor-pointer select-none"
              style={{
                left: `${mascotPosition.x}px`,
                top: `${mascotPosition.y}px`,
                transition: prefersReducedMotion ? "none" : "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
              onMouseEnter={handleMascotHover}
              data-testid="mascot-interactive"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleMascotHover()}
              aria-label={t("home.mascotLabel") || "Interactive mascot - hover to play!"}
            >
              <img 
                src={mascotImage} 
                alt="Travi the Duck"
                className="w-28 h-28 lg:w-32 lg:h-32 drop-shadow-lg hover:scale-110 transition-transform"
                draggable={false}
              />
              
              {/* Speech Bubble */}
              {showPhrase && currentPhraseIndex >= 0 && (
                <div 
                  className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white rounded-xl px-4 py-2 shadow-lg whitespace-nowrap"
                  dir={isRTL ? "rtl" : "ltr"}
                  data-testid="mascot-speech-bubble"
                >
                  <span className="text-sm font-medium text-foreground">
                    {t(`home.${mascotPhrases[currentPhraseIndex]}`)}
                  </span>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
                </div>
              )}
            </div>
          )}
          
          {/* Main Content - Centered layout */}
          <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 w-full text-center">
            <div className="flex flex-col items-center" dir={isRTL ? "rtl" : "ltr"}>
              {/* Big TRAVI Letters with mascot */}
              <div className="mb-6 relative inline-flex items-center justify-center">
                <span 
                  ref={traviTextRef}
                  className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 drop-shadow-sm"
                >
                  TRAVI
                </span>
              </div>
              
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">
                {t("home.heroTitleNew") || "Discover the World Like a Local"}
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
                {t("home.heroSubtitleNew") || "The most comprehensive guide to Dubai's attractions, hotels & hidden gems."}
              </p>

              {/* Search Bar */}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSearch(); }} 
                role="search" 
                className="mb-8 w-full max-w-xl"
              >
                <div className="bg-white rounded-full shadow-xl p-2 flex items-center border border-gray-200">
                  <div className="flex-1 flex items-center gap-3 px-4">
                    <Search className="w-5 h-5 text-muted-foreground shrink-0" aria-hidden="true" />
                    <input
                      type="search"
                      placeholder={t("home.searchPlaceholder")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 min-w-0 text-foreground placeholder:text-muted-foreground bg-transparent outline-none py-3 text-base"
                      data-testid="input-search"
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="rounded-full px-6 py-3 shrink-0" 
                    data-testid="button-search"
                  >
                    {t("common.search") || "Search"}
                  </Button>
                </div>
              </form>

              {/* Quick Links */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-6 text-sm" dir={isRTL ? "rtl" : "ltr"}>
                <Link href={localePath("/dubai/laws-for-tourists")} className="text-gray-600 hover:text-primary transition-colors">
                  Laws for Tourists
                </Link>
                <span className="text-gray-400">•</span>
                <Link href={localePath("/dubai/sheikh-mohammed-bin-rashid")} className="text-gray-600 hover:text-primary transition-colors">
                  Sheikh Mohammed
                </Link>
                <span className="text-gray-400">•</span>
                <Link href={localePath("/dubai/24-hours-open")} className="text-gray-600 hover:text-primary transition-colors">
                  24 Hours Open
                </Link>
                <span className="text-gray-400">•</span>
                <Link href={localePath("/dubai/free-things-to-do")} className="text-gray-600 hover:text-primary transition-colors">
                  Free Things To Do
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-gray-700">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span className="font-semibold" data-testid="stat-guides-count">
                    {totalPublishedContent > 0 ? `${totalPublishedContent} Guides` : t("home.guidesCount") || "Loading..."}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  <span className="font-semibold">{t("home.multiLanguage") || "17 Languages"}</span>
                </div>
              </div>
            </div>

            {/* Category Quick Links */}
            <div className="mt-12 grid grid-cols-3 md:grid-cols-6 gap-3 max-w-4xl mx-auto">
              {categoryConfig.map((cat) => {
                const Icon = cat.icon;
                const count = contentCounts[cat.type] || 0;
                return (
                  <Link 
                    key={cat.key} 
                    href={localePath(`/${cat.key}`)}
                    data-testid={`category-${cat.key}`}
                  >
                    <div 
                      className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center hover-elevate cursor-pointer border border-gray-200 shadow-sm"
                      style={{ borderLeftColor: cat.color, borderLeftWidth: "3px" }}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2" style={{ color: cat.color }} />
                      <div className="text-gray-800 font-medium text-sm">{t(`nav.${cat.key}`)}</div>
                      <div className="text-gray-500 text-xs" data-testid={`count-${cat.key}`}>{count}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* 2. WHY TRAVI - Trust Section */}
        <section className="py-16 bg-muted/30" data-testid="section-trust">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" dir={isRTL ? "rtl" : "ltr"}>
              {t("home.whyTravi") || "Why 2 Million Travelers Trust Travi"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t("home.localExperts") || "Local Experts"}</h3>
                <p className="text-muted-foreground">
                  {t("home.localExpertsDesc") || "Written by Dubai residents who know every hidden corner"}
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t("home.inDepthGuides") || "In-Depth Guides"}</h3>
                <p className="text-muted-foreground">
                  {t("home.inDepthGuidesDesc") || "1500+ words per guide on average"}
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t("home.multiLanguage") || "17 Languages"}</h3>
                <p className="text-muted-foreground">
                  {t("home.multiLanguageDesc") || "Read in your native language"}
                </p>
              </Card>
            </div>

            <p className="text-center text-lg italic text-muted-foreground">
              "{t("home.testimonial") || "The most detailed Dubai guide I've found"}" - TripAdvisor
            </p>
          </div>
        </section>

        {/* 3. TOP ATTRACTIONS */}
        <section className="py-16 bg-background" data-testid="section-attractions">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
              <h2 className="text-3xl md:text-4xl font-bold" dir={isRTL ? "rtl" : "ltr"}>
                {t("home.topAttractionsTitle") || "Top Attractions in Dubai"}
              </h2>
              <Link href={localePath("/attractions")}>
                <Button variant="outline" className="rounded-full">
                  {t("home.viewAll")} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(attractionsContent.length > 0 ? attractionsContent : topAttractions).map((item, index) => {
                const isContent = 'id' in item;
                const name = isContent ? (item as ContentWithRelations).title : (item as typeof topAttractions[0]).name;
                const image = isContent ? (item as ContentWithRelations).heroImage : (item as typeof topAttractions[0]).image;
                const slug = isContent ? (item as ContentWithRelations).slug : (item as typeof topAttractions[0]).slug;
                const attraction = item as typeof topAttractions[0];
                
                return (
                  <Link 
                    key={index} 
                    href={localePath(`/attractions/${slug}`)}
                    data-testid={`attraction-card-${index}`}
                  >
                    <Card className="overflow-hidden hover-elevate cursor-pointer h-full">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img 
                          src={image || topAttractions[index % topAttractions.length].image}
                          alt={name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{name}</h3>
                        {!isContent && (
                          <>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span>{attraction.rating}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                              <MapPin className="w-4 h-4" />
                              <span>{attraction.area}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-primary">
                              <DollarSign className="w-4 h-4" />
                              <span>{attraction.price}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. EXPLORE BY DISTRICT */}
        <section className="py-16 bg-muted/30" data-testid="section-districts">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-8" dir={isRTL ? "rtl" : "ltr"}>
              {t("home.exploreByArea") || "Explore Dubai by Area"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(districtsContent.length > 0 ? districtsContent : districts).map((item, index) => {
                const isContent = 'id' in item;
                const name = isContent ? (item as ContentWithRelations).title : (item as typeof districts[0]).name;
                const image = isContent ? (item as ContentWithRelations).heroImage : (item as typeof districts[0]).image;
                const slug = isContent ? (item as ContentWithRelations).slug : (item as typeof districts[0]).slug;
                const fallbackDistrict = districts[index % districts.length];
                
                return (
                  <Link 
                    key={isContent ? (item as ContentWithRelations).id : index} 
                    href={localePath(`/districts/${slug}`)}
                    data-testid={`district-card-${index}`}
                  >
                    <Card className="overflow-hidden hover-elevate cursor-pointer h-full">
                      <div className="aspect-video overflow-hidden relative">
                        <img 
                          src={image || fallbackDistrict.image}
                          alt={name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <h3 className="absolute bottom-4 left-4 text-white font-bold text-xl">{name}</h3>
                      </div>
                      <div className="p-4">
                        {!isContent && (
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{fallbackDistrict.attractions} {t("nav.attractions").toLowerCase()}</span>
                            <span>{fallbackDistrict.restaurants} {t("home.restaurantsLabel") || "restaurants"}</span>
                          </div>
                        )}
                        <span className="text-primary font-medium text-sm flex items-center gap-1 mt-2">
                          {t("home.explore") || "Explore"} <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. BEST HOTELS */}
        <section className="py-16 bg-background" data-testid="section-hotels">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
              <h2 className="text-3xl md:text-4xl font-bold" dir={isRTL ? "rtl" : "ltr"}>
                {t("home.whereToStay") || "Where to Stay in Dubai"}
              </h2>
              <Link href={localePath("/hotels")}>
                <Button variant="outline" className="rounded-full">
                  {t("home.viewAll")} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              {["All", "Luxury 5*", "Mid-Range", "Budget", "Beach", "City"].map((filter) => (
                <Badge 
                  key={filter} 
                  variant={filter === "All" ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2 text-sm"
                >
                  {filter}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(hotelsContent.length > 0 ? hotelsContent : hotels).map((item, index) => {
                const isContent = 'id' in item;
                const name = isContent ? (item as ContentWithRelations).title : (item as typeof hotels[0]).name;
                const image = isContent ? (item as ContentWithRelations).heroImage : (item as typeof hotels[0]).image;
                const slug = isContent ? (item as ContentWithRelations).slug : (item as typeof hotels[0]).slug;
                const fallbackHotel = hotels[index % hotels.length];
                const stars = isContent ? ((item as ContentWithRelations).hotel?.starRating || 5) : (item as typeof hotels[0]).stars;
                const area = isContent ? ((item as ContentWithRelations).hotel?.neighborhood || "Dubai") : (item as typeof hotels[0]).area;
                
                return (
                  <Link 
                    key={isContent ? (item as ContentWithRelations).id : index} 
                    href={localePath(`/hotels/${slug}`)}
                    data-testid={`hotel-card-${index}`}
                  >
                    <Card className="overflow-hidden hover-elevate cursor-pointer h-full">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img 
                          src={image || fallbackHotel.image}
                          alt={name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{name}</h3>
                        <div className="flex items-center gap-1 mb-1">
                          {Array.from({ length: Math.min(stars, 5) }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <MapPin className="w-4 h-4" />
                          <span>{area}</span>
                        </div>
                        {!isContent && (
                          <div className="text-sm font-medium text-primary">{fallbackHotel.price}</div>
                        )}
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. LATEST ARTICLES */}
        <section className="py-16 bg-muted/30" data-testid="section-articles">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
              <h2 className="text-3xl md:text-4xl font-bold" dir={isRTL ? "rtl" : "ltr"}>
                {t("home.travelTips") || "Dubai Travel Tips & News"}
              </h2>
              <Link href={localePath("/news")}>
                <Button variant="outline" className="rounded-full">
                  {t("home.viewAll")} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Featured Article */}
              <div className="lg:col-span-2">
                {(() => {
                  const featuredArticle = articlesContent[0];
                  const hasFeatured = featuredArticle && 'id' in featuredArticle;
                  const articleTitle = hasFeatured ? featuredArticle.title : t("home.featuredArticleTitle") || "70 Free Things to Do in Dubai (2024 Guide)";
                  const articleSlug = hasFeatured ? featuredArticle.slug : "free-things-to-do";
                  const articleImage = hasFeatured ? featuredArticle.heroImage : "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=450&fit=crop";
                  const articleDate = hasFeatured && featuredArticle.publishedAt 
                    ? new Date(featuredArticle.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "Dec 15, 2024";
                  
                  return (
                    <Link href={localePath(`/articles/${articleSlug}`)} data-testid="featured-article">
                      <Card className="overflow-hidden hover-elevate cursor-pointer h-full">
                        <div className="aspect-video overflow-hidden">
                          <img 
                            src={articleImage || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=450&fit=crop"}
                            alt={articleTitle}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-2xl font-bold mb-3 line-clamp-2">
                            {articleTitle}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" /> {articleDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" /> {hasFeatured ? `${Math.ceil((featuredArticle.metaDescription?.length || 500) / 200)} min read` : "12 min read"}
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })()}
              </div>

              {/* Popular Guides Sidebar */}
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    {t("home.popularGuides") || "Popular Guides"}
                  </h3>
                  <ul className="space-y-3">
                    {(articlesContent.length > 0 ? articlesContent : popularGuides).map((item, index) => {
                      const isContent = 'id' in item;
                      const title = isContent ? (item as ContentWithRelations).title : (item as typeof popularGuides[0]).title;
                      const slug = isContent ? (item as ContentWithRelations).slug : (item as typeof popularGuides[0]).slug;
                      
                      return (
                        <li key={isContent ? (item as ContentWithRelations).id : index}>
                          <Link 
                            href={localePath(`/articles/${slug}`)}
                            className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                          >
                            <ChevronRight className="w-4 h-4 text-primary" />
                            <span className="line-clamp-1">{title}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </Card>

                {/* Quick Stats Card */}
                <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    {t("home.dubaiStats") || "Dubai Quick Facts"}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Annual Visitors</span>
                      <span className="font-semibold">17.15M+</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">World's Tallest Tower</span>
                      <span className="font-semibold">828m</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Year-Round Sunshine</span>
                      <span className="font-semibold">340+ days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground text-sm">Nationalities Living</span>
                      <span className="font-semibold">200+</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* 7. BEST RESTAURANTS */}
        <section className="py-16 bg-background" data-testid="section-dining">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
              <h2 className="text-3xl md:text-4xl font-bold" dir={isRTL ? "rtl" : "ltr"}>
                {t("home.bestRestaurants") || "Best Restaurants in Dubai"}
              </h2>
              <Link href={localePath("/dining")}>
                <Button variant="outline" className="rounded-full">
                  {t("home.viewAll")} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              {["All", "Fine Dining", "Casual", "Brunches", "Street Food"].map((filter) => (
                <Badge 
                  key={filter} 
                  variant={filter === "All" ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2 text-sm"
                >
                  {filter}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(diningContent.length > 0 ? diningContent : restaurants).map((item, index) => {
                const isContent = 'id' in item;
                const name = isContent ? (item as ContentWithRelations).title : (item as typeof restaurants[0]).name;
                const image = isContent ? (item as ContentWithRelations).heroImage : (item as typeof restaurants[0]).image;
                const slug = isContent ? (item as ContentWithRelations).slug : (item as typeof restaurants[0]).slug;
                const fallbackRestaurant = restaurants[index % restaurants.length];
                const cuisine = isContent ? ((item as ContentWithRelations).dining?.cuisineType || "International") : (item as typeof restaurants[0]).cuisine;
                const area = isContent ? ((item as ContentWithRelations).dining?.neighborhood || "Dubai") : (item as typeof restaurants[0]).area;
                
                return (
                  <Link 
                    key={isContent ? (item as ContentWithRelations).id : index} 
                    href={localePath(`/dining/${slug}`)}
                    data-testid={`restaurant-card-${index}`}
                  >
                    <Card className="overflow-hidden hover-elevate cursor-pointer h-full">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img 
                          src={image || fallbackRestaurant.image}
                          alt={name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{name}</h3>
                        <p className="text-sm text-muted-foreground mb-1">{cuisine}</p>
                        <div className="flex items-center justify-between text-sm">
                          {!isContent && <span className="font-medium">{fallbackRestaurant.priceLevel}</span>}
                          <span className="text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {area}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* 8. UPCOMING EVENTS */}
        <section className="py-16 bg-muted/30" data-testid="section-events">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
              <h2 className="text-3xl md:text-4xl font-bold" dir={isRTL ? "rtl" : "ltr"}>
                {t("home.whatsHappening") || "What's Happening in Dubai"}
              </h2>
              <Link href={localePath("/events")}>
                <Button variant="outline" className="rounded-full">
                  {t("home.viewAll")} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <Card className="overflow-hidden">
              <div className="bg-primary/5 px-6 py-3 border-b">
                <span className="font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {t("home.thisWeek") || "THIS WEEK"}
                </span>
              </div>
              <div className="divide-y">
                {(eventsContent.length > 0 ? eventsContent : upcomingEvents).map((item, index) => {
                  const isContent = 'id' in item;
                  const title = isContent ? (item as ContentWithRelations).title : (item as typeof upcomingEvents[0]).title;
                  const slug = isContent ? (item as ContentWithRelations).slug : (item as typeof upcomingEvents[0]).slug;
                  const fallbackEvent = upcomingEvents[index % upcomingEvents.length];
                  
                  let dateStr = fallbackEvent.date;
                  if (isContent) {
                    const eventData = (item as ContentWithRelations).event;
                    if (eventData?.startDate) {
                      const d = new Date(eventData.startDate);
                      dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                    }
                  }
                  
                  return (
                    <Link 
                      key={isContent ? (item as ContentWithRelations).id : index} 
                      href={localePath(`/events/${slug}`)}
                      data-testid={`event-item-${index}`}
                    >
                      <div className="px-6 py-4 flex items-center gap-4 hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="bg-primary/10 rounded-lg px-3 py-2 text-center min-w-[60px]">
                          <span className="text-sm font-semibold text-primary">{dateStr}</span>
                        </div>
                        <span className="font-medium line-clamp-1">{title}</span>
                        <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </Card>
          </div>
        </section>

        {/* 9. NEWSLETTER */}
        <section className="py-16 bg-primary text-primary-foreground" data-testid="section-newsletter">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("home.newsletterTitle") || "Get Weekly Dubai Tips & Deals"}
            </h2>
            <p className="text-lg mb-8 opacity-90">
              {t("home.newsletterSubtitle") || "Join 50,000+ travelers who get our free guide"}
            </p>

            <form 
              onSubmit={(e) => e.preventDefault()} 
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-6"
            >
              <input
                type="email"
                placeholder={t("common.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-full text-foreground bg-white outline-none"
                data-testid="input-newsletter-email"
              />
              <Button 
                type="submit"
                variant="secondary"
                className="rounded-full px-8"
                data-testid="button-newsletter-subscribe"
              >
                {t("common.subscribe")}
              </Button>
            </form>

            <div className="flex flex-wrap justify-center gap-6 text-sm opacity-90">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" /> {t("home.freeGuide") || "Free Dubai Starter Guide"}
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" /> {t("home.exclusiveDeals") || "Exclusive Deals"}
              </span>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
