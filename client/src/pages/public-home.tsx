import { Search, Star, ArrowRight, Plane, MapPin, Clock, Users, ChevronRight, Mail, Globe, Building2, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import type { Content, ContentWithRelations } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicNav } from "@/components/public-nav";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import mascotImg from "@assets/Mascot_for_Light_Background_1765570034687.png";
import logoImg from "@assets/Full_Logo_for_Light_Background_1765570034686.png";

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

const dubaiImages = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1546412414-e1885259563a?w=600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=600&h=800&fit=crop",
];

const activityCategories = [
  { titleKey: "nav.attractions", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop", type: "attraction" },
  { titleKey: "nav.hotels", image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400&h=300&fit=crop", type: "hotel" },
  { titleKey: "nav.dining", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop", type: "dining" },
  { titleKey: "nav.districts", image: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=400&h=300&fit=crop", type: "district" },
  { titleKey: "nav.events", image: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=400&h=300&fit=crop", type: "event" },
  { titleKey: "nav.articles", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop", type: "article" },
];

const CloudSVG = ({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) => {
  const sizes = { sm: "w-16 h-10", md: "w-24 h-14", lg: "w-32 h-20" };
  return (
    <svg className={`${sizes[size]} ${className}`} viewBox="0 0 100 60" fill="white">
      <ellipse cx="30" cy="40" rx="25" ry="18" />
      <ellipse cx="55" cy="35" rx="22" ry="16" />
      <ellipse cx="75" cy="42" rx="20" ry="14" />
      <ellipse cx="45" cy="28" rx="18" ry="14" />
    </svg>
  );
};

const HotAirBalloonSVG = ({ className = "", color = "#EC4899" }: { className?: string; color?: string }) => (
  <svg className={`w-16 h-24 balloon-icon ${className}`} viewBox="0 0 60 100" fill="none">
    <ellipse cx="30" cy="30" rx="25" ry="30" fill={color} />
    <ellipse cx="30" cy="30" rx="25" ry="30" fill="url(#balloonShine)" />
    <path d="M15 55 L20 70 L40 70 L45 55" fill="#8B4513" />
    <rect x="18" y="70" width="24" height="15" rx="2" fill="#D2691E" stroke="#8B4513" strokeWidth="1" />
    <line x1="20" y1="55" x2="20" y2="70" stroke="#654321" strokeWidth="1" />
    <line x1="40" y1="55" x2="40" y2="70" stroke="#654321" strokeWidth="1" />
    <defs>
      <linearGradient id="balloonShine" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="white" stopOpacity="0.3" />
        <stop offset="50%" stopColor="white" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

const BirdSVG = ({ className = "" }: { className?: string }) => (
  <svg className={`w-6 h-4 ${className}`} viewBox="0 0 24 16" fill="#334155">
    <path d="M0 8 Q6 2 12 8 Q18 2 24 8 Q18 6 12 10 Q6 6 0 8" />
  </svg>
);

export default function PublicHome() {
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [, setLocation] = useLocation();
  const { t, locale, localePath, isRTL } = useLocale();

  useDocumentMeta({
    title: `Travi - ${t("home.heroTitle")} | ${t("nav.hotels")}, ${t("nav.attractions")}`,
    description: t("home.heroSubtitle"),
    ogTitle: `Travi - ${t("home.heroTitle")}`,
    ogDescription: t("home.heroSubtitle"),
    ogType: "website",
  });

  const { data: featuredPromotions = [] } = useQuery<HomepagePromotion[]>({
    queryKey: ["/api/homepage-promotions/featured"],
  });

  const { data: attractionsPromotions = [] } = useQuery<HomepagePromotion[]>({
    queryKey: ["/api/homepage-promotions/attractions"],
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

  const trendingContent = getActiveContent(featuredPromotions);
  
  const exploreContent = getActiveContent(attractionsPromotions);

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
    <div className="min-h-screen overflow-x-hidden">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md">
        Skip to main content
      </a>

      <PublicNav variant="transparent" />

      <main id="main-content">
        {/* HERO SECTION - Sky Theme with Giant TRAVI Letters */}
        <section className="relative min-h-screen sky-gradient overflow-hidden" data-testid="section-hero">
          {/* Floating Clouds */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <CloudSVG className="absolute top-20 left-[5%] opacity-90 animate-cloud-drift" size="lg" />
            <CloudSVG className="absolute top-32 right-[10%] opacity-80 animate-cloud-drift animation-delay-1000" size="md" />
            <CloudSVG className="absolute top-48 left-[25%] opacity-70 animate-cloud-drift animation-delay-2000" size="sm" />
            <CloudSVG className="absolute bottom-40 right-[20%] opacity-85 animate-cloud-drift animation-delay-500" size="lg" />
            <CloudSVG className="absolute bottom-60 left-[15%] opacity-75 animate-cloud-drift animation-delay-3000" size="md" />
          </div>

          {/* Floating Decorative Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <HotAirBalloonSVG className="absolute top-24 right-[8%] animate-balloon" color="#EC4899" />
            <HotAirBalloonSVG className="absolute top-40 left-[12%] animate-balloon animation-delay-2000" color="#6C5CE7" />
            <Plane className="absolute top-16 left-[30%] w-8 h-8 text-white/60 animate-plane plane-icon" />
            <BirdSVG className="absolute top-28 left-[45%] animate-bird" />
            <BirdSVG className="absolute top-36 left-[48%] animate-bird animation-delay-500" />
            <BirdSVG className="absolute top-32 left-[52%] animate-bird animation-delay-300" />
          </div>

          {/* Main Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
            {/* Giant TRAVI Letters with Dubai Images - Always LTR for logo */}
            <div className="text-center mb-8" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
              <h1 className="text-[8rem] sm:text-[12rem] lg:text-[16rem] font-bold leading-none tracking-tight select-none inline-flex">
                <span
                  className="travi-letter-mask"
                  style={{ backgroundImage: `url(${dubaiImages[0]})` }}
                >T</span>
                <span
                  className="travi-letter-mask"
                  style={{ backgroundImage: `url(${dubaiImages[1]})` }}
                >R</span>
                <span
                  className="travi-letter-mask"
                  style={{ backgroundImage: `url(${dubaiImages[2]})` }}
                >A</span>
                <span
                  className="travi-letter-mask"
                  style={{ backgroundImage: `url(${dubaiImages[3]})` }}
                >V</span>
                <span
                  className="travi-letter-mask"
                  style={{ backgroundImage: `url(${dubaiImages[4]})` }}
                >I</span>
              </h1>
            </div>

            {/* Mascot */}
            <div className="flex justify-center mb-6">
              <img 
                src={mascotImg} 
                alt="Travi mascot - friendly duck with sunglasses" 
                className="w-32 h-32 sm:w-40 sm:h-40 animate-float-gentle drop-shadow-lg"
              />
            </div>

            {/* Tagline */}
            <div className="text-center mb-10">
              <p className="text-2xl sm:text-3xl text-[#1E1B4B] font-medium" dir={isRTL ? "rtl" : "ltr"}>
                {t("home.heroTitle")} <span className="font-script text-3xl sm:text-4xl text-[#EC4899]">{t("home.heroSubtitle")}</span>
              </p>
            </div>

            {/* Search Bar */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSearch(); }} 
              role="search" 
              className="max-w-2xl mx-auto px-2 sm:px-4"
            >
              <div className="bg-white rounded-2xl md:rounded-full shadow-xl p-3 md:p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 flex items-center gap-3 px-4 md:px-5">
                  <Search className="w-5 h-5 text-[#6C5CE7] shrink-0" aria-hidden="true" />
                  <label htmlFor="hero-search" className="sr-only">Search Dubai experiences</label>
                  <input
                    id="hero-search"
                    type="search"
                    placeholder="Where do you want to go?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    className="flex-1 min-w-0 text-[#1E1B4B] placeholder:text-[#94A3B8] bg-transparent outline-none py-3 md:py-4 text-base md:text-lg"
                    data-testid="input-search"
                  />
                </div>
                <Button 
                  type="submit"
                  className="btn-gold rounded-full px-6 md:px-8 py-3 md:py-6 text-base md:text-lg shrink-0" 
                  data-testid="button-search"
                >
                  {t("home.exploreAttractions")}
                </Button>
              </div>
            </form>

            {/* Quick Stats - Dynamic based on content */}
            {publishedContent && publishedContent.length > 0 && (
              <div className="flex flex-wrap justify-center gap-8 mt-12">
                <div className="flex items-center gap-2 text-[#1E1B4B]">
                  <MapPin className="w-5 h-5 text-[#EC4899]" />
                  <span className="font-medium">{publishedContent.length} {t("common.places")}</span>
                </div>
              </div>
            )}
          </div>

          {/* Wavy Divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 100" fill="none" className="w-full h-16 sm:h-24">
              <path d="M0,60 C360,100 720,20 1080,60 C1260,80 1380,70 1440,60 L1440,100 L0,100 Z" fill="white" />
            </svg>
          </div>
        </section>

        {/* EXPLORE ACTIVITIES SECTION */}
        <section className="py-20 bg-white relative overflow-hidden" data-testid="section-activities">
          {/* Decorative Hot Air Balloons */}
          <HotAirBalloonSVG className="absolute top-10 right-[5%] animate-float-slow opacity-60" color="#A855F7" />
          <HotAirBalloonSVG className="absolute bottom-20 left-[3%] animate-float-slow animation-delay-1000 opacity-50" color="#F59E0B" />

          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#1E1B4B] mb-4" dir={isRTL ? "rtl" : "ltr"}>
                {t("home.topAttractions")}
              </h2>
              <p className="text-xl text-[#64748B]" dir={isRTL ? "rtl" : "ltr"}>
                {t("home.activitiesInDubai")}
              </p>
            </div>

            {/* Activity Cards Carousel */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {activityCategories.map((category, index) => (
                <Link
                  key={index}
                  href={localePath(`/${category.type}s`)}
                  className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer"
                  data-testid={`activity-${category.type}`}
                >
                  <img
                    src={category.image}
                    alt={t(category.titleKey)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-lg mb-1">{t(category.titleKey)}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* READY TO EXPLORE SECTION - Tilted Cards with Clouds */}
        <section className="py-20 sky-gradient-light relative overflow-hidden" data-testid="section-explore">
          {/* Background Clouds */}
          <div className="absolute inset-0 pointer-events-none">
            <CloudSVG className="absolute top-10 left-[10%] opacity-50" size="lg" />
            <CloudSVG className="absolute top-40 right-[15%] opacity-40" size="md" />
            <CloudSVG className="absolute bottom-20 left-[25%] opacity-45" size="sm" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-[#1E1B4B] mb-4" dir={isRTL ? "rtl" : "ltr"}>
                {t("home.exploreAttractions")}
              </h2>
              <p className="text-xl text-[#64748B]" dir={isRTL ? "rtl" : "ltr"}>
                {t("home.handPickedDestinations")}
              </p>
            </div>

            {/* Content or Coming Soon */}
            {exploreContent.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {exploreContent.slice(0, 4).map((content, index) => (
                    <Link 
                      key={content.id} 
                      href={getContentPath(content)}
                      data-testid={`explore-card-${content.id}`}
                    >
                      <article 
                        className={`tilted-card relative overflow-hidden rounded-2xl shadow-xl cursor-pointer aspect-[3/4] ${
                          index % 2 === 0 ? 'tilt-left-sm' : 'tilt-right-sm'
                        }`}
                      >
                        <img
                          src={content.heroImage || dubaiImages[index % dubaiImages.length]}
                          alt={content.heroImageAlt || content.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/90 text-[#6C5CE7] border-0 text-xs font-semibold">
                            {content.type}
                          </Badge>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <h3 className="text-white font-bold text-lg line-clamp-2">
                            {content.title}
                          </h3>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>

                <div className="text-center mt-10">
                  <Link href={localePath("/attractions")} data-testid="link-view-all-explore">
                    <Button className="btn-gold rounded-full px-8 py-6 text-lg" data-testid="button-view-all-explore">
                      {t("home.viewAll")} {t("nav.attractions")}
                      <ArrowRight className={`w-5 h-5 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`} />
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-[#6C5CE7]/10 flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-10 h-10 text-[#6C5CE7]" />
                </div>
                <h3 className="text-2xl font-bold text-[#1E1B4B] mb-3">Coming Soon</h3>
                <p className="text-[#64748B] max-w-md mx-auto">
                  We're curating the best Dubai experiences for you. Check back soon for hand-picked destinations!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* TRENDING IN DUBAI SECTION - Watermark Background */}
        <section className="py-20 bg-white relative overflow-hidden" data-testid="section-trending">
          {/* Large Watermark Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <span className="watermark-text">TRENDING</span>
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex items-end justify-between mb-12 gap-4 flex-wrap">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-[#1E1B4B] mb-2">
                  Trending in Dubai
                </h2>
                <p className="text-xl text-[#64748B]">What everyone's talking about</p>
              </div>
              {trendingContent.length > 0 && (
                <Link href={localePath("/articles")} className="hidden sm:block" data-testid="link-view-all-trending">
                  <Button variant="outline" className="border-[#6C5CE7] text-[#6C5CE7] rounded-full px-6" data-testid="button-view-all-trending">
                    {t("home.viewAll")} <ChevronRight className={`w-4 h-4 ${isRTL ? "mr-1 rotate-180" : "ml-1"}`} />
                  </Button>
                </Link>
              )}
            </div>

            {/* Content or Coming Soon */}
            {trendingContent.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-6 lg:gap-0 lg:justify-start">
                {trendingContent.slice(0, 4).map((content, index) => (
                  <Link 
                    key={content.id} 
                    href={getContentPath(content)}
                    className={`w-full sm:w-72 lg:w-80 ${index > 0 ? 'lg:-ml-8' : ''}`}
                    style={{ zIndex: 4 - index }}
                    data-testid={`trending-card-${content.id}`}
                  >
                    <article 
                      className={`tilted-card relative overflow-hidden rounded-2xl shadow-2xl cursor-pointer aspect-[4/5] ${
                        index === 0 ? '' : index === 1 ? 'tilt-right-sm' : index === 2 ? 'tilt-left-sm' : 'tilt-right-sm'
                      }`}
                    >
                      <img
                        src={content.heroImage || dubaiImages[index % dubaiImages.length]}
                        alt={content.heroImageAlt || content.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-[#EC4899] text-white border-0 text-xs font-semibold">
                          Hot
                        </Badge>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <span className="text-[#A855F7] text-sm font-medium uppercase tracking-wide mb-2 block">
                          {content.type}
                        </span>
                        <h3 className="text-white font-bold text-xl line-clamp-2">
                          {content.title}
                        </h3>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-[#EC4899]/10 flex items-center justify-center mx-auto mb-6">
                  <Star className="w-10 h-10 text-[#EC4899]" />
                </div>
                <h3 className="text-2xl font-bold text-[#1E1B4B] mb-3">Coming Soon</h3>
                <p className="text-[#64748B] max-w-md mx-auto">
                  We're gathering the hottest trends in Dubai. Stay tuned for exciting content!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* OFF-PLAN PROPERTIES SECTION */}
        <section className="py-16 bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4C1D95] relative overflow-hidden" data-testid="section-off-plan">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-12">
              <Badge className="bg-[#F59E0B] text-white border-0 mb-4">
                <Building2 className="w-3 h-3 mr-1" />
                Investment Hub
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Dubai Off-Plan Properties
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Invest in Dubai real estate with cryptocurrency (BTC/USDT/ETH) or cash. 
                Entry from AED 420K with 15-30% ROI potential.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Link href="/dubai-off-plan-properties" data-testid="link-offplan-hub">
                <div className="bg-white/10 backdrop-blur rounded-lg p-5 hover-elevate cursor-pointer border border-white/20">
                  <Building2 className="w-8 h-8 text-[#F59E0B] mb-3" />
                  <h3 className="font-semibold text-white mb-1">Property Hub</h3>
                  <p className="text-sm text-white/70">1,577+ Active Projects</p>
                </div>
              </Link>
              <Link href="/tools-roi-calculator" data-testid="link-roi-calculator">
                <div className="bg-white/10 backdrop-blur rounded-lg p-5 hover-elevate cursor-pointer border border-white/20">
                  <TrendingUp className="w-8 h-8 text-[#10B981] mb-3" />
                  <h3 className="font-semibold text-white mb-1">ROI Calculator</h3>
                  <p className="text-sm text-white/70">Calculate Returns</p>
                </div>
              </Link>
              <Link href="/compare-off-plan-vs-ready" data-testid="link-compare">
                <div className="bg-white/10 backdrop-blur rounded-lg p-5 hover-elevate cursor-pointer border border-white/20">
                  <Users className="w-8 h-8 text-[#8B5CF6] mb-3" />
                  <h3 className="font-semibold text-white mb-1">Comparisons</h3>
                  <p className="text-sm text-white/70">11 Analysis Guides</p>
                </div>
              </Link>
              <Link href="/glossary" data-testid="link-glossary">
                <div className="bg-white/10 backdrop-blur rounded-lg p-5 hover-elevate cursor-pointer border border-white/20">
                  <MapPin className="w-8 h-8 text-[#EC4899] mb-3" />
                  <h3 className="font-semibold text-white mb-1">Glossary</h3>
                  <p className="text-sm text-white/70">25+ Terms Explained</p>
                </div>
              </Link>
            </div>

            <div className="text-center">
              <Link href={localePath("/dubai-off-plan-properties")}>
                <Button size="lg" className="btn-gold rounded-full px-8" data-testid="button-explore-offplan">
                  {t("home.viewAll")} {t("realEstate.offPlan")}
                  <ChevronRight className={`w-4 h-4 ${isRTL ? "mr-2 rotate-180" : "ml-2"}`} />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* REGION NOTICE - Dubai Only Banner */}
        <section className="py-8 bg-gradient-to-r from-[#6C5CE7]/10 via-[#A855F7]/10 to-[#EC4899]/10 border-y border-[#6C5CE7]/20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Globe className="w-6 h-6 text-[#6C5CE7]" />
              <h3 className="text-lg font-semibold text-[#1E1B4B]">Currently Focused on Dubai</h3>
            </div>
            <p className="text-[#64748B]">
              Travi is your dedicated Dubai travel companion. We're expanding to more destinations in the coming months - 
              stay tuned for Abu Dhabi, Saudi Arabia, and beyond!
            </p>
          </div>
        </section>

        {/* NEWSLETTER SECTION - Dubai Skyline */}
        <section className="py-20 bg-gradient-to-b from-[#E8F4FD] to-[#87CEEB] relative overflow-hidden" data-testid="section-newsletter">
          {/* Dubai Skyline Silhouette at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-32 dubai-skyline opacity-20" />
          
          {/* Floating Elements */}
          <HotAirBalloonSVG className="absolute top-10 left-[8%] animate-float-slow" color="#EC4899" />
          <CloudSVG className="absolute top-20 right-[10%] opacity-80" size="md" />
          
          {/* Mascot */}
          <img 
            src={mascotImg} 
            alt="" 
            className="absolute bottom-0 right-[10%] w-40 h-40 animate-float-gentle hidden lg:block"
          />

          <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1E1B4B] mb-4">
              Stay in the Loop
            </h2>
            <p className="text-xl text-[#475569] mb-8">
              Get exclusive Dubai travel tips, deals, and inspiration delivered to your inbox
            </p>

            <form 
              onSubmit={(e) => { e.preventDefault(); }}
              className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
            >
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-full border-0 shadow-lg text-[#1E1B4B] placeholder:text-[#94A3B8] outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                  data-testid="input-newsletter-email"
                />
              </div>
              <Button 
                type="submit"
                className="btn-gold rounded-full px-8 py-4 text-lg whitespace-nowrap"
                data-testid="button-newsletter-subscribe"
              >
                Subscribe
              </Button>
            </form>

            <p className="text-sm text-[#64748B] mt-4">
              No spam, unsubscribe anytime
            </p>
          </div>
        </section>

        {/* FOOTER - Sky Theme */}
        <footer className="py-16 bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4C1D95] relative overflow-hidden" data-testid="footer">
          {/* Stars/sparkles decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-[20%] w-1 h-1 bg-white rounded-full opacity-60" />
            <div className="absolute top-20 left-[40%] w-1.5 h-1.5 bg-white rounded-full opacity-40" />
            <div className="absolute top-8 right-[30%] w-1 h-1 bg-white rounded-full opacity-50" />
            <div className="absolute top-32 right-[20%] w-1 h-1 bg-white rounded-full opacity-60" />
          </div>

          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              {/* Logo & Mascot */}
              <div className="flex flex-col items-start">
                <img src={logoImg} alt="Travi" className="h-12 mb-4" />
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  Your trusted companion for discovering the best of Dubai.
                </p>
                <img src={mascotImg} alt="" className="w-20 h-20 opacity-80" />
              </div>

              {/* Explore Links */}
              <div>
                <h4 className="font-semibold text-white mb-4">Explore</h4>
                <ul className="space-y-3 text-sm text-white/70">
                  <li><Link href="/hotels" className="hover:text-white transition-colors" data-testid="link-footer-hotels">Hotels</Link></li>
                  <li><Link href="/attractions" className="hover:text-white transition-colors" data-testid="link-footer-attractions">Attractions</Link></li>
                  <li><Link href="/articles" className="hover:text-white transition-colors" data-testid="link-footer-articles">Travel Guides</Link></li>
                  <li><Link href="/search" className="hover:text-white transition-colors" data-testid="link-footer-search">Search</Link></li>
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h4 className="font-semibold text-white mb-4">Company</h4>
                <ul className="space-y-3 text-sm text-white/70">
                  <li><Link href="/about" className="hover:text-white transition-colors" data-testid="link-footer-about">About Us</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors" data-testid="link-footer-contact">Contact</Link></li>
                  <li><Link href="/privacy" className="hover:text-white transition-colors" data-testid="link-footer-privacy">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition-colors" data-testid="link-footer-terms">Terms of Service</Link></li>
                </ul>
              </div>

              {/* Connect */}
              <div>
                <h4 className="font-semibold text-white mb-4">Connect</h4>
                <ul className="space-y-3 text-sm text-white/70">
                  <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a></li>
                  <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a></li>
                  <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a></li>
                  <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">YouTube</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-white/50 text-sm">
                2024 Travi. All rights reserved.
              </p>
              <p className="text-white/50 text-sm">
                Made with love in Dubai
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
