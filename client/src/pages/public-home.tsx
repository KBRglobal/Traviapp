import { Search, Star, ArrowRight, Plane, MapPin, Clock, Users, ChevronRight, Mail, Globe, Building2, TrendingUp, Sparkles, Heart, Camera, Utensils, Palmtree, Sun, Compass } from "lucide-react";
import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import type { Content, ContentWithRelations } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import mascotImg from "@assets/Mascot_for_Light_Background_1765570034687.png";
import traviLogoImg from "@assets/Logotype_for_Dark_Background_1766192985178.png";

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

// World landmarks for the flowing logo texture
const worldLandmarks = [
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=800&fit=crop", // Eiffel Tower, Paris
  "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=800&fit=crop", // Colosseum, Rome
  "https://images.unsplash.com/photo-1548013146-72479768bada?w=600&h=800&fit=crop", // Taj Mahal, India
  "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=600&h=800&fit=crop", // Statue of Liberty, NYC
  "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=800&fit=crop", // London Bridge & Big Ben
  "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&h=800&fit=crop", // Sydney Opera House
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=800&fit=crop", // Burj Khalifa, Dubai
  "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=600&h=800&fit=crop", // Tokyo Tower, Japan
];

// Playful mascot messages when trying to catch it
const mascotMessages = [
  "You can't catch me!",
  "Too slow!",
  "Nice try!",
  "Almost got me!",
  "I'm too fast!",
  "Keep trying!",
  "Hehe, missed!",
  "Catch me if you can!",
  "Not today!",
  "So close!",
];

const categories = [
  { title: "Attractions", titleAr: "معالم سياحية", icon: Camera, href: "/attractions", color: "from-purple-500 to-pink-500", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=500&fit=crop" },
  { title: "Hotels", titleAr: "فنادق", icon: Building2, href: "/hotels", color: "from-blue-500 to-cyan-500", image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400&h=500&fit=crop" },
  { title: "Dining", titleAr: "مطاعم", icon: Utensils, href: "/dining", color: "from-orange-500 to-amber-500", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=500&fit=crop" },
  { title: "Districts", titleAr: "أحياء", icon: MapPin, href: "/districts", color: "from-emerald-500 to-teal-500", image: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=400&h=500&fit=crop" },
  { title: "Events", titleAr: "فعاليات", icon: Sparkles, href: "/events", color: "from-rose-500 to-pink-500", image: "https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=400&h=500&fit=crop" },
  { title: "Articles", titleAr: "مقالات", icon: Compass, href: "/articles", color: "from-indigo-500 to-purple-500", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=500&fit=crop" },
];

const featuredDistricts = [
  { name: "Downtown Dubai", tagline: "Iconic Burj Khalifa", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop", slug: "downtown-dubai", stats: { attractions: 12, hotels: 25 } },
  { name: "Dubai Marina", tagline: "Waterfront Living", image: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600&h=400&fit=crop", slug: "dubai-marina", stats: { attractions: 8, hotels: 18 } },
  { name: "Palm Jumeirah", tagline: "The Eighth Wonder", image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=600&h=400&fit=crop", slug: "palm-jumeirah", stats: { attractions: 6, hotels: 12 } },
  { name: "Old Dubai", tagline: "Heritage & Souks", image: "https://images.unsplash.com/photo-1534551767192-78b8dd45b51b?w=600&h=400&fit=crop", slug: "old-dubai", stats: { attractions: 10, hotels: 15 } },
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

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// Quick category shortcuts for hero section
const quickCategories = [
  { title: "Attractions", icon: Camera, href: "/attractions", color: "from-purple-500 to-pink-500" },
  { title: "Hotels", icon: Building2, href: "/hotels", color: "from-blue-500 to-cyan-500" },
  { title: "Events", icon: Sparkles, href: "/events", color: "from-rose-500 to-orange-500" },
];

export default function PublicHome() {
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();
  const { t, localePath, isRTL } = useLocale();
  
  // Interactive mascot state - can escape anywhere on screen
  const [mascotMessage, setMascotMessage] = useState("");
  const [mascotPosition, setMascotPosition] = useState({ x: 0, y: 0 });
  const [mascotEscaped, setMascotEscaped] = useState(false);
  const [showMascotMessage, setShowMascotMessage] = useState(false);
  const mascotTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const escapeCount = useRef(0);
  
  // Escape positions - corners and edges of the viewport
  const escapePositions = [
    { x: -300, y: -200 }, // top left area
    { x: 300, y: -200 },  // top right area
    { x: -350, y: 150 },  // left side
    { x: 350, y: 150 },   // right side
    { x: -250, y: 300 },  // bottom left
    { x: 250, y: 300 },   // bottom right
    { x: 0, y: -250 },    // top center
    { x: 0, y: 350 },     // bottom center
  ];
  
  const handleMascotHover = () => {
    escapeCount.current += 1;
    
    // Pick a random escape position, avoiding the current one
    const availablePositions = escapePositions.filter(
      pos => Math.abs(pos.x - mascotPosition.x) > 100 || Math.abs(pos.y - mascotPosition.y) > 100
    );
    const randomPos = availablePositions[Math.floor(Math.random() * availablePositions.length)] || escapePositions[0];
    
    // Add some randomness to the position
    const newX = randomPos.x + (Math.random() - 0.5) * 80;
    const newY = randomPos.y + (Math.random() - 0.5) * 60;
    setMascotPosition({ x: newX, y: newY });
    setMascotEscaped(true);
    
    // Random message
    const randomMessage = mascotMessages[Math.floor(Math.random() * mascotMessages.length)];
    setMascotMessage(randomMessage);
    setShowMascotMessage(true);
    
    // Hide message after delay, but keep mascot in escaped position longer
    if (mascotTimeoutRef.current) clearTimeout(mascotTimeoutRef.current);
    mascotTimeoutRef.current = setTimeout(() => {
      setShowMascotMessage(false);
      // Return home after longer delay if not touched again
      setTimeout(() => {
        setMascotPosition({ x: 0, y: 0 });
        setMascotEscaped(false);
      }, 3000);
    }, 2000);
  };
  
  // Cleanup mascot timeout on unmount
  useEffect(() => {
    return () => {
      if (mascotTimeoutRef.current) clearTimeout(mascotTimeoutRef.current);
    };
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePosition({ x, y });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

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

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getContentPath = (content: Content) => `/${content.type}s/${content.slug}`;

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-white via-slate-50 to-white">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md">
        Skip to main content
      </a>

      <PublicNav variant="transparent" />

      <main id="main-content">
        {/* HERO SECTION - Sky Theme with Giant TRAVI Letters */}
        <section ref={heroRef} className="relative min-h-screen sky-gradient overflow-hidden" data-testid="section-hero">
          {/* Floating Clouds with Parallax */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div style={{ transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 15}px)` }} className="transition-transform duration-300 ease-out">
              <CloudSVG className="absolute top-20 left-[5%] opacity-90" size="lg" />
            </div>
            <div style={{ transform: `translate(${mousePosition.x * -25}px, ${mousePosition.y * 20}px)` }} className="transition-transform duration-300 ease-out">
              <CloudSVG className="absolute top-32 right-[10%] opacity-80" size="md" />
            </div>
            <div style={{ transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * -10}px)` }} className="transition-transform duration-300 ease-out">
              <CloudSVG className="absolute top-48 left-[25%] opacity-70" size="sm" />
            </div>
            <div style={{ transform: `translate(${mousePosition.x * -30}px, ${mousePosition.y * 25}px)` }} className="transition-transform duration-300 ease-out">
              <CloudSVG className="absolute bottom-40 right-[20%] opacity-85" size="lg" />
            </div>
            <div style={{ transform: `translate(${mousePosition.x * 18}px, ${mousePosition.y * -20}px)` }} className="transition-transform duration-300 ease-out">
              <CloudSVG className="absolute bottom-60 left-[15%] opacity-75" size="md" />
            </div>
          </div>

          {/* Floating Decorative Elements with Parallax */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div style={{ transform: `translate(${mousePosition.x * -40}px, ${mousePosition.y * 30}px)` }} className="transition-transform duration-500 ease-out">
              <HotAirBalloonSVG className="absolute top-24 right-[8%] animate-balloon" color="#EC4899" />
            </div>
            <div style={{ transform: `translate(${mousePosition.x * 35}px, ${mousePosition.y * -25}px)` }} className="transition-transform duration-500 ease-out">
              <HotAirBalloonSVG className="absolute top-40 left-[12%] animate-balloon animation-delay-2000" color="#6C5CE7" />
            </div>
            <Plane className="absolute top-16 left-[30%] w-8 h-8 text-white/60 animate-plane plane-icon" />
            <div style={{ transform: `translate(${mousePosition.x * 12}px, ${mousePosition.y * 8}px)` }} className="transition-transform duration-200 ease-out">
              <BirdSVG className="absolute top-28 left-[45%] animate-bird" />
              <BirdSVG className="absolute top-36 left-[48%] animate-bird animation-delay-500" />
              <BirdSVG className="absolute top-32 left-[52%] animate-bird animation-delay-300" />
            </div>
          </div>

          {/* Main Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
            {/* Giant TRAVI Logo with Flowing Dubai Images Texture */}
            <div className="text-center mb-8 flex justify-center" style={{ direction: 'ltr', unicodeBidi: 'isolate' }}>
              <div 
                className="relative w-[90vw] max-w-[800px] h-[20vh] sm:h-[25vh] lg:h-[30vh]"
                style={{
                  filter: 'drop-shadow(0 8px 30px rgba(108, 92, 231, 0.3)) drop-shadow(0 4px 15px rgba(236, 72, 153, 0.2))',
                  WebkitMaskImage: `url(${traviLogoImg})`,
                  maskImage: `url(${traviLogoImg})`,
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                }}
                role="img"
                aria-label="TRAVI - Your World Travel Guide"
              >
                {/* Animated flowing image strip - seamless loop */}
                <div 
                  className="absolute inset-0 flex animate-logo-flow"
                  style={{ width: '200%' }}
                >
                  {[...worldLandmarks, ...worldLandmarks].map((img, i) => (
                    <div 
                      key={i}
                      className="h-full flex-shrink-0"
                      style={{
                        width: `${100 / (worldLandmarks.length * 2)}%`,
                        backgroundImage: `url(${img})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Mascot - Escapes across the page! */}
            <div className="flex justify-center mb-6 relative" style={{ minHeight: '160px' }}>
              <motion.div 
                className="relative cursor-pointer select-none z-30"
                onMouseEnter={handleMascotHover}
                data-testid="mascot-interactive"
                animate={{ 
                  x: mascotPosition.x,
                  y: mascotPosition.y,
                  rotate: mascotEscaped ? (mascotPosition.x > 0 ? 15 : -15) : 0,
                  scale: mascotEscaped ? 0.9 : 1
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 25,
                  mass: 1.2
                }}
              >
                {/* Speech bubble follows mascot */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ 
                    opacity: showMascotMessage ? 1 : 0, 
                    scale: showMascotMessage ? 1 : 0.8,
                    y: showMascotMessage ? 0 : 10
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-purple-100 whitespace-nowrap z-20"
                >
                  <span className="text-sm font-medium text-[#6C5CE7]">{mascotMessage}</span>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-white/95" />
                </motion.div>
                
                {/* Mascot image */}
                <img 
                  src={mascotImg} 
                  alt="Travi mascot - friendly duck with sunglasses" 
                  className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-lg pointer-events-none"
                />
              </motion.div>
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
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-full shadow-2xl shadow-purple-500/10 p-3 md:p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border border-white/50">
                <div className="flex-1 flex items-center gap-3 px-4 md:px-5">
                  <Search className="w-5 h-5 text-[#6C5CE7] shrink-0" aria-hidden="true" />
                  <label htmlFor="hero-search" className="sr-only">Search Dubai experiences</label>
                  <input
                    id="hero-search"
                    type="search"
                    placeholder={t("home.searchPlaceholder") || "Where do you want to go?"}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    className="flex-1 min-w-0 text-[#1E1B4B] placeholder:text-[#94A3B8] bg-transparent outline-none py-3 md:py-4 text-base md:text-lg"
                    data-testid="input-search"
                  />
                </div>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-[#6C5CE7] to-[#EC4899] hover:opacity-90 text-white rounded-full px-6 md:px-8 py-3 md:py-6 text-base md:text-lg shrink-0 shadow-lg shadow-purple-500/25 transition-all duration-300" 
                  data-testid="button-search"
                >
                  {t("home.exploreAttractions")}
                </Button>
              </div>
            </form>

            {/* Quick Category Shortcuts */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {quickCategories.map((cat) => (
                <Link key={cat.title} href={localePath(cat.href)}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 bg-white/80 backdrop-blur-xl px-5 py-3 rounded-full shadow-lg shadow-purple-500/10 border border-white/50 cursor-pointer group"
                    data-testid={`quick-${cat.title.toLowerCase()}`}
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-md`}>
                      <cat.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-[#1E1B4B] group-hover:text-[#6C5CE7] transition-colors">{cat.title}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#6C5CE7] group-hover:translate-x-0.5 transition-all" />
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Quick Stats */}
            {publishedContent && publishedContent.length > 0 && (
              <div className="flex flex-wrap justify-center gap-8 mt-6">
                <div className="flex items-center gap-2 text-[#1E1B4B] bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                  <MapPin className="w-5 h-5 text-[#EC4899]" />
                  <span className="font-medium">{publishedContent.length} {t("common.places")}</span>
                </div>
              </div>
            )}
          </div>

          {/* Smooth Gradient Transition */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent" />
        </section>

        {/* EXPLORE CATEGORIES - Glass Cards Grid */}
        <section className="py-24 relative" data-testid="section-categories">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-[#6C5CE7] border-0 mb-4 px-4 py-1.5">
                <Compass className="w-4 h-4 mr-2" />
                Explore Dubai
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1E1B4B] mb-4 tracking-tight">
                Your Adventure Starts Here
              </h2>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                Discover the best of Dubai across every category
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
            >
              {categories.map((category, index) => (
                <motion.div key={category.title} variants={fadeInUp}>
                  <Link href={localePath(category.href)} data-testid={`category-${category.title.toLowerCase()}`}>
                    <div className="group relative overflow-hidden rounded-3xl aspect-[3/4] cursor-pointer">
                      {/* Background Image */}
                      <img
                        src={category.image}
                        alt={category.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 mix-blend-multiply transition-opacity duration-300 group-hover:opacity-70`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Icon */}
                      <div className="absolute top-4 right-4">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                          <category.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h3 className="text-white font-bold text-xl mb-1">{category.title}</h3>
                        <p className="text-white/70 text-sm">{category.titleAr}</p>
                      </div>
                      
                      {/* Hover Arrow */}
                      <div className="absolute bottom-5 right-5 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        <ArrowRight className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FEATURED DISTRICTS - Immersive Cards */}
        <section className="py-24 relative overflow-hidden" data-testid="section-districts">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-purple-50/30 to-slate-50" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
            >
              <div>
                <Badge className="bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-600 border-0 mb-4 px-4 py-1.5">
                  <MapPin className="w-4 h-4 mr-2" />
                  21 Districts
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-[#1E1B4B] mb-2 tracking-tight">
                  Iconic Neighborhoods
                </h2>
                <p className="text-lg text-slate-500 max-w-xl">
                  Each district tells a unique story of Dubai's remarkable transformation
                </p>
              </div>
              <Link href="/districts">
                <Button variant="outline" className="border-2 border-[#6C5CE7] text-[#6C5CE7] rounded-full px-6 gap-2 hover:bg-[#6C5CE7] hover:text-white transition-all duration-300" data-testid="button-view-all-districts">
                  Explore All Districts <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {featuredDistricts.map((district, index) => (
                <motion.div key={district.slug} variants={fadeInUp}>
                  <Link href={`/districts/${district.slug}`} data-testid={`district-${district.slug}`}>
                    <div className="group relative overflow-hidden rounded-3xl cursor-pointer bg-white shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-purple-200/30 transition-all duration-500">
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={district.image}
                          alt={district.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Stats Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 flex gap-3">
                          <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full border border-white/30">
                            <Camera className="w-3 h-3" /> {district.stats.attractions}
                          </span>
                          <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-full border border-white/30">
                            <Building2 className="w-3 h-3" /> {district.stats.hotels}
                          </span>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-xl font-bold text-[#1E1B4B] mb-1 group-hover:text-[#6C5CE7] transition-colors">
                          {district.name}
                        </h3>
                        <p className="text-slate-500 text-sm">{district.tagline}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* EXPLORE CONTENT - Editorial Style */}
        {exploreContent.length > 0 && (
          <section className="py-24 bg-white relative overflow-hidden" data-testid="section-explore">
            <div className="max-w-7xl mx-auto px-6">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                className="text-center mb-16"
              >
                <Badge className="bg-gradient-to-r from-pink-100 to-rose-100 text-pink-600 border-0 mb-4 px-4 py-1.5">
                  <Heart className="w-4 h-4 mr-2" />
                  Hand-Picked
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold text-[#1E1B4B] mb-4 tracking-tight">
                  {t("home.exploreAttractions")}
                </h2>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                  {t("home.handPickedDestinations")}
                </p>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {exploreContent.slice(0, 4).map((content, index) => (
                  <motion.div key={content.id} variants={fadeInUp}>
                    <Link href={getContentPath(content)} data-testid={`explore-card-${content.id}`}>
                      <div className="group relative overflow-hidden rounded-3xl cursor-pointer aspect-[3/4]">
                        <img
                          src={content.heroImage || worldLandmarks[index % worldLandmarks.length]}
                          alt={content.heroImageAlt || content.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/90 backdrop-blur-sm text-[#6C5CE7] border-0 text-xs font-semibold capitalize">
                            {content.type}
                          </Badge>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-white font-bold text-xl line-clamp-2 mb-2">
                            {content.title}
                          </h3>
                          <span className="inline-flex items-center gap-1 text-white/80 text-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            Explore <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="text-center mt-12"
              >
                <Link href={localePath("/attractions")}>
                  <Button className="bg-gradient-to-r from-[#6C5CE7] to-[#EC4899] hover:opacity-90 text-white rounded-full px-8 py-6 text-lg shadow-lg shadow-purple-500/25" data-testid="button-view-all-explore">
                    {t("home.viewAll")} {t("nav.attractions")}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>
        )}

        {/* TRENDING - Glass Cards */}
        {trendingContent.length > 0 && (
          <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden" data-testid="section-trending">
            <div className="max-w-7xl mx-auto px-6">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeInUp}
                className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
              >
                <div>
                  <Badge className="bg-gradient-to-r from-rose-100 to-orange-100 text-rose-600 border-0 mb-4 px-4 py-1.5">
                    <Star className="w-4 h-4 mr-2" />
                    Hot Right Now
                  </Badge>
                  <h2 className="text-4xl md:text-5xl font-bold text-[#1E1B4B] tracking-tight">
                    Trending in Dubai
                  </h2>
                </div>
                <Link href={localePath("/articles")}>
                  <Button variant="outline" className="border-2 border-rose-400 text-rose-500 rounded-full px-6 gap-2 hover:bg-rose-500 hover:text-white transition-all duration-300" data-testid="button-view-all-trending">
                    {t("home.viewAll")} <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {trendingContent.slice(0, 4).map((content, index) => (
                  <motion.div key={content.id} variants={fadeInUp}>
                    <Link href={getContentPath(content)} data-testid={`trending-card-${content.id}`}>
                      <div className="group relative overflow-hidden rounded-3xl cursor-pointer aspect-[4/5] shadow-lg shadow-rose-100/50 hover:shadow-xl hover:shadow-rose-200/50 transition-all duration-500">
                        <img
                          src={content.heroImage || worldLandmarks[index % worldLandmarks.length]}
                          alt={content.heroImageAlt || content.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-gradient-to-r from-rose-500 to-orange-500 text-white border-0 text-xs font-semibold shadow-lg">
                            <Star className="w-3 h-3 mr-1" /> Hot
                          </Badge>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <span className="text-rose-300 text-sm font-medium uppercase tracking-wide mb-2 block">
                            {content.type}
                          </span>
                          <h3 className="text-white font-bold text-xl line-clamp-2">
                            {content.title}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}

        {/* OFF-PLAN PROPERTIES - Premium Finance Section */}
        <section className="py-24 relative overflow-hidden" data-testid="section-off-plan">
          {/* Premium Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4C1D95]" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920')] bg-cover bg-center mix-blend-overlay opacity-10" />
          
          {/* Animated Orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 mb-6 px-5 py-2 text-sm shadow-lg">
                <Building2 className="w-4 h-4 mr-2" />
                Investment Hub
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                Dubai Off-Plan Properties
              </h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
                Invest in Dubai real estate with cryptocurrency (BTC/USDT/ETH) or cash. 
                Entry from AED 420K with 15-30% ROI potential.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
            >
              {[
                { title: "Property Hub", desc: "1,577+ Active Projects", icon: Building2, color: "amber", href: "/dubai-off-plan-properties" },
                { title: "ROI Calculator", desc: "Calculate Returns", icon: TrendingUp, color: "emerald", href: "/tools-roi-calculator" },
                { title: "Comparisons", desc: "11 Analysis Guides", icon: Users, color: "purple", href: "/compare-off-plan-vs-ready" },
                { title: "Glossary", desc: "25+ Terms Explained", icon: MapPin, color: "pink", href: "/glossary" },
              ].map((item, index) => (
                <motion.div key={item.title} variants={fadeInUp}>
                  <Link href={item.href} data-testid={`link-${item.title.toLowerCase().replace(' ', '-')}`}>
                    <div className="group bg-white/10 backdrop-blur-xl rounded-2xl p-6 cursor-pointer border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color === 'amber' ? 'from-amber-400 to-orange-500' : item.color === 'emerald' ? 'from-emerald-400 to-teal-500' : item.color === 'purple' ? 'from-purple-400 to-indigo-500' : 'from-pink-400 to-rose-500'} flex items-center justify-center mb-4 shadow-lg`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-white text-lg mb-1">{item.title}</h3>
                      <p className="text-sm text-white/60">{item.desc}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="text-center"
            >
              <Link href="/dubai-off-plan-properties">
                <Button size="lg" className="bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-90 text-white rounded-full px-10 py-7 text-lg shadow-xl shadow-amber-500/30" data-testid="button-explore-offplan">
                  Explore Investment Opportunities <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* NEWSLETTER - Dreamy Cloud Section */}
        <section className="py-24 relative overflow-hidden" data-testid="section-newsletter">
          {/* Sky Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-purple-50 to-pink-50" />
          
          {/* Floating Clouds */}
          <CloudSVG className="absolute top-10 left-[5%] opacity-40 animate-cloud-drift" size="lg" />
          <CloudSVG className="absolute top-20 right-[10%] opacity-30 animate-cloud-drift animation-delay-1000" size="md" />
          <CloudSVG className="absolute bottom-20 left-[15%] opacity-35 animate-cloud-drift animation-delay-2000" size="sm" />
          
          {/* Mascot */}
          <img 
            src={mascotImg} 
            alt="" 
            className="absolute bottom-0 right-[8%] w-32 h-32 md:w-40 md:h-40 animate-float-gentle hidden lg:block"
          />

          <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 mb-6 shadow-sm">
                <Sparkles className="w-5 h-5 text-[#EC4899]" />
                <span className="text-sm font-medium text-[#1E1B4B]">Join the Cloud Club</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-[#1E1B4B] mb-4 tracking-tight">
                Stay in the Loop
              </h2>
              <p className="text-xl text-slate-500 mb-10">
                Get exclusive Dubai travel tips, deals, and inspiration delivered to your inbox
              </p>

              <form onSubmit={(e) => { e.preventDefault(); }} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <div className="flex-1 relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-14 pr-5 py-5 rounded-full border-0 shadow-xl shadow-slate-200/50 text-[#1E1B4B] placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#6C5CE7] bg-white/90 backdrop-blur-sm"
                    data-testid="input-newsletter-email"
                  />
                </div>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-[#6C5CE7] to-[#EC4899] hover:opacity-90 text-white rounded-full px-8 py-5 text-lg shadow-lg shadow-purple-500/25"
                  data-testid="button-newsletter-subscribe"
                >
                  Subscribe
                </Button>
              </form>

              <p className="text-sm text-slate-400 mt-6">
                No spam, unsubscribe anytime
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
