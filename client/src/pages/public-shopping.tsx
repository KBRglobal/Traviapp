import { Link } from "wouter";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, MapPin, Clock, Gem, Store, Building2,
  Sparkles, Crown, Gift, Percent, CreditCard, Package,
  ChevronRight, ArrowRight, Landmark, Coffee, Shirt,
  Watch, Smartphone, Tag, Star, Zap, Timer, Flame,
  PartyPopper, ShoppingCart, Heart, TrendingUp
} from "lucide-react";
import { PageContainer, Section, CategoryGrid } from "@/components/public-layout";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { cn } from "@/lib/utils";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";

interface Mall {
  id: string;
  name: string;
  description: string;
  highlights: string[];
  stores: string;
  storeCount: number;
  location: string;
  gradient: string;
  isOpen24h?: boolean;
  lateNight?: boolean;
}

interface Deal {
  id: string;
  title: string;
  discount: string;
  mall: string;
  category: string;
  endsIn: number;
  gradient: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Souk {
  id: string;
  name: string;
  specialty: string;
  description: string;
  location: string;
  established?: string;
  gradient: string;
  textureImage: string;
}

interface StyleQuizOption {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  destinations: string[];
}

const MEGA_MALLS: Mall[] = [
  {
    id: "dubai-mall",
    name: "The Dubai Mall",
    description: "World's largest shopping destination with over 1,200 retail outlets",
    highlights: ["Dubai Aquarium", "Ice Rink", "VR Park", "KidZania", "Fashion Avenue"],
    stores: "1,200+",
    storeCount: 1200,
    location: "Downtown Dubai",
    gradient: "from-[#6443F4] via-[#9077EF] to-[#F94498]",
    lateNight: true
  },
  {
    id: "mall-of-emirates",
    name: "Mall of the Emirates",
    description: "Home to Ski Dubai, the Middle East's first indoor ski resort",
    highlights: ["Ski Dubai", "Magic Planet", "VOX Cinemas", "Luxury Fashion"],
    stores: "630+",
    storeCount: 630,
    location: "Al Barsha",
    gradient: "from-[#02A65C] via-[#59ED63] to-[#01BEFF]",
    lateNight: true
  },
  {
    id: "ibn-battuta",
    name: "Ibn Battuta Mall",
    description: "World's largest themed mall with 6 stunning cultural courts",
    highlights: ["6 Themed Courts", "IMAX Theatre", "Cultural Architecture"],
    stores: "270+",
    storeCount: 270,
    location: "Jebel Ali",
    gradient: "from-[#FF9327] via-[#FFD112] to-[#F94498]"
  },
  {
    id: "festival-city",
    name: "Dubai Festival City",
    description: "Waterfront destination with spectacular IMAGINE light show",
    highlights: ["IMAGINE Show", "Waterfront Dining", "IKEA"],
    stores: "400+",
    storeCount: 400,
    location: "Festival City",
    gradient: "from-[#01BEFF] via-[#6443F4] to-[#9077EF]"
  },
  {
    id: "dubai-hills",
    name: "Dubai Hills Mall",
    description: "Home to the world's fastest vertical-launch roller coaster",
    highlights: ["Storm Coaster", "Roxy Cinemas", "Sky Terrace"],
    stores: "650+",
    storeCount: 650,
    location: "Dubai Hills Estate",
    gradient: "from-[#F94498] via-[#FDA9E5] to-[#FFD112]",
    lateNight: true
  },
  {
    id: "wafi-mall",
    name: "Wafi Mall",
    description: "Egyptian-themed mall with Khan Murjan Souk",
    highlights: ["Khan Murjan Souk", "Egyptian Theme", "Artisan Crafts"],
    stores: "350+",
    storeCount: 350,
    location: "Umm Hurair",
    gradient: "from-[#FFD112] via-[#FF9327] to-[#F94498]"
  }
];

const FEATURED_DEALS: Deal[] = [
  {
    id: "deal-1",
    title: "Luxury Fashion Sale",
    discount: "Up to 70% OFF",
    mall: "Dubai Mall",
    category: "Fashion",
    endsIn: 3600 * 2,
    gradient: "from-[#F94498] to-[#FFD112]",
    icon: Shirt
  },
  {
    id: "deal-2",
    title: "Electronics Bonanza",
    discount: "40% OFF",
    mall: "Mall of Emirates",
    category: "Electronics",
    endsIn: 3600 * 5,
    gradient: "from-[#01BEFF] to-[#6443F4]",
    icon: Smartphone
  },
  {
    id: "deal-3",
    title: "Gold Souk Special",
    discount: "Best Rates Today",
    mall: "Deira Gold Souk",
    category: "Jewelry",
    endsIn: 3600 * 8,
    gradient: "from-[#FFD112] to-[#FF9327]",
    icon: Gem
  }
];

const TRADITIONAL_SOUKS: Souk[] = [
  {
    id: "gold-souk",
    name: "Gold Souk",
    specialty: "Gold & Jewelry",
    description: "Over 10 tonnes of gold on display in 300+ stores",
    location: "Deira",
    established: "1900s",
    gradient: "from-[#FFD112] via-[#FF9327] to-[#FFD112]",
    textureImage: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop"
  },
  {
    id: "spice-souk",
    name: "Spice Souk",
    specialty: "Herbs & Spices",
    description: "Exotic spices, saffron, and Middle Eastern ingredients",
    location: "Deira",
    gradient: "from-[#FF9327] via-[#F94498] to-[#FF9327]",
    textureImage: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=300&fit=crop"
  },
  {
    id: "perfume-souk",
    name: "Perfume Souk",
    specialty: "Arabic Perfumes",
    description: "Authentic oud oils and custom fragrance blends",
    location: "Deira",
    gradient: "from-[#6443F4] via-[#F94498] to-[#9077EF]",
    textureImage: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop"
  },
  {
    id: "textile-souk",
    name: "Textile Souk",
    specialty: "Fabrics & Tailoring",
    description: "Silk, cotton, and expert tailoring services",
    location: "Bur Dubai",
    gradient: "from-[#F94498] via-[#FDA9E5] to-[#F94498]",
    textureImage: "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=300&fit=crop"
  }
];

const STYLE_QUIZ_OPTIONS: StyleQuizOption[] = [
  {
    id: "luxury",
    title: "Luxury Seeker",
    description: "Designer brands & exclusive boutiques",
    icon: Crown,
    gradient: "from-[#6443F4] to-[#9077EF]",
    destinations: ["Dubai Mall Fashion Avenue", "Mall of Emirates", "DIFC Gate Avenue"]
  },
  {
    id: "budget",
    title: "Budget Hunter",
    description: "Best deals & outlet shopping",
    icon: Tag,
    gradient: "from-[#02A65C] to-[#59ED63]",
    destinations: ["Dragon Mart", "Outlet Village", "Global Village"]
  },
  {
    id: "unique",
    title: "Unique Finder",
    description: "Artisan crafts & traditional souks",
    icon: Sparkles,
    gradient: "from-[#FF9327] to-[#FFD112]",
    destinations: ["Gold Souk", "Spice Souk", "Souk Madinat Jumeirah"]
  }
];

function AnimatedStoreCount({ count }: { count: number }) {
  const [displayCount, setDisplayCount] = useState(0);
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = count / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= count) {
        setDisplayCount(count);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [count]);
  
  return <span>{displayCount.toLocaleString()}+</span>;
}

function CountdownTimer({ initialSeconds }: { initialSeconds: number }) {
  const [seconds, setSeconds] = useState(initialSeconds);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : initialSeconds));
    }, 1000);
    return () => clearInterval(timer);
  }, [initialSeconds]);
  
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return (
    <div className="flex items-center gap-1 font-mono text-sm font-bold" data-testid="countdown-timer">
      <span className="bg-black/20 px-2 py-1 rounded">{String(hours).padStart(2, "0")}</span>
      <span>:</span>
      <span className="bg-black/20 px-2 py-1 rounded">{String(mins).padStart(2, "0")}</span>
      <span>:</span>
      <span className="bg-black/20 px-2 py-1 rounded">{String(secs).padStart(2, "0")}</span>
    </div>
  );
}

function ConfettiParticle({ delay, x }: { delay: number; x: number }) {
  const colors = ["#F94498", "#FFD112", "#6443F4", "#02A65C", "#FF9327"];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <motion.div
      className="absolute w-3 h-3 rounded-sm"
      style={{ backgroundColor: color, left: `${x}%` }}
      initial={{ y: -20, opacity: 1, rotate: 0 }}
      animate={{
        y: [0, 600],
        opacity: [1, 1, 0],
        rotate: [0, 360, 720],
        x: [0, Math.random() * 100 - 50]
      }}
      transition={{
        duration: 4 + Math.random() * 2,
        delay: delay,
        repeat: Infinity,
        ease: "easeIn"
      }}
    />
  );
}

function FloatingIcon({ icon: Icon, delay, position }: { 
  icon: React.ComponentType<{ className?: string }>; 
  delay: number; 
  position: { x: string; y: string };
}) {
  return (
    <motion.div
      className="absolute text-white/20"
      style={{ left: position.x, top: position.y }}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 10, -10, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Icon className="w-12 h-12 md:w-16 md:h-16" />
    </motion.div>
  );
}

function FloatingPriceTag({ delay, position }: { delay: number; position: { x: string; y: string } }) {
  const prices = ["50%", "AED 99", "DEAL", "HOT", "NEW"];
  const price = prices[Math.floor(Math.random() * prices.length)];
  
  return (
    <motion.div
      className="absolute"
      style={{ left: position.x, top: position.y }}
      animate={{
        y: [0, -15, 0],
        rotate: [-5, 5, -5]
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="bg-[#F94498] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-[#F94498]/30">
        {price}
      </div>
    </motion.div>
  );
}

export default function PublicShopping() {
  const { localePath, isRTL } = useLocale();
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [currentDealIndex, setCurrentDealIndex] = useState(0);

  useDocumentMeta({
    title: "Dubai Shopping Festival 2025 | Malls, Souks & Mega Deals | Travi",
    description: "Experience Dubai's ultimate shopping paradise! 50+ malls, legendary souks, and exclusive festival deals. Tax-free shopping awaits!"
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDealIndex((prev) => (prev + 1) % FEATURED_DEALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Shopping" }
  ];

  const confettiPositions = Array.from({ length: 20 }, (_, i) => ({
    delay: i * 0.3,
    x: (i * 5) % 100
  }));

  const floatingIcons = [
    { icon: ShoppingBag, delay: 0, position: { x: "10%", y: "20%" } },
    { icon: Tag, delay: 0.5, position: { x: "85%", y: "15%" } },
    { icon: Gift, delay: 1, position: { x: "75%", y: "60%" } },
    { icon: Star, delay: 1.5, position: { x: "15%", y: "70%" } },
    { icon: Crown, delay: 2, position: { x: "90%", y: "40%" } },
    { icon: Gem, delay: 2.5, position: { x: "5%", y: "45%" } }
  ];

  const floatingPriceTags = [
    { delay: 0, position: { x: "20%", y: "30%" } },
    { delay: 1, position: { x: "70%", y: "25%" } },
    { delay: 2, position: { x: "80%", y: "55%" } }
  ];

  return (
    <div className={cn("min-h-screen flex flex-col")} dir={isRTL ? "rtl" : "ltr"}>
      <PublicNav variant="transparent" transparentTone="dark" />
      
      {/* Festival-Style Hero */}
      <section 
        className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden"
        data-testid="shopping-hero"
      >
        {/* Animated Gradient Background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-[#6443F4] via-[#F94498] to-[#FFD112]"
          animate={{
            background: [
              "linear-gradient(135deg, #6443F4 0%, #F94498 50%, #FFD112 100%)",
              "linear-gradient(135deg, #F94498 0%, #FFD112 50%, #6443F4 100%)",
              "linear-gradient(135deg, #FFD112 0%, #6443F4 50%, #F94498 100%)",
              "linear-gradient(135deg, #6443F4 0%, #F94498 50%, #FFD112 100%)"
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Dark Overlay for text readability */}
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Confetti Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {confettiPositions.map((conf, i) => (
            <ConfettiParticle key={i} delay={conf.delay} x={conf.x} />
          ))}
        </div>
        
        {/* Floating Shopping Icons */}
        <div className="absolute inset-0 pointer-events-none">
          {floatingIcons.map((item, i) => (
            <FloatingIcon key={i} icon={item.icon} delay={item.delay} position={item.position} />
          ))}
        </div>
        
        {/* Floating Price Tags */}
        <div className="absolute inset-0 pointer-events-none">
          {floatingPriceTags.map((tag, i) => (
            <FloatingPriceTag key={i} delay={tag.delay} position={tag.position} />
          ))}
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-8 text-center">
          {/* Animated SALE Banner */}
          <motion.div
            className="inline-flex items-center gap-2 mb-6"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Badge 
              className="bg-[#FFD112] text-[#24103E] border-0 px-6 py-2 text-lg font-bold shadow-xl shadow-[#FFD112]/40"
              data-testid="badge-sale"
            >
              <Flame className="w-5 h-5 me-2 animate-pulse" />
              DUBAI SHOPPING FESTIVAL 2025
              <PartyPopper className="w-5 h-5 ms-2" />
            </Badge>
          </motion.div>
          
          <motion.h1 
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            data-testid="hero-title"
          >
            Shop Till You{" "}
            <span className="relative">
              <span className="text-[#FFD112]">Drop</span>
              <motion.span
                className="absolute -bottom-2 left-0 right-0 h-1 bg-[#FFD112] rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              />
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            data-testid="hero-subtitle"
          >
            50+ Mega Malls | Legendary Souks | Tax-Free Paradise
          </motion.p>
          
          {/* Stats Row */}
          <motion.div 
            className="flex flex-wrap justify-center gap-8 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {[
              { label: "Shopping Destinations", value: "50+" },
              { label: "Brands", value: "8,000+" },
              { label: "Tax Savings", value: "5% VAT Refund" }
            ].map((stat, i) => (
              <div key={i} className="text-center" data-testid={`stat-${i}`}>
                <div className="text-3xl md:text-4xl font-bold text-[#FFD112]">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </motion.div>
          
          {/* CTA Buttons */}
          <motion.div 
            className={cn("flex flex-col sm:flex-row gap-4 justify-center", isRTL && "sm:flex-row-reverse")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Button 
              size="lg" 
              className="bg-white text-[#6443F4] font-bold text-lg px-8 shadow-xl shadow-white/20 border-0 group" 
              data-testid="button-explore-malls"
            >
              <ShoppingCart className="w-5 h-5 me-2 group-hover:animate-bounce" />
              Start Shopping Adventure
              <ArrowRight className={cn("w-5 h-5 ms-2 transition-transform group-hover:translate-x-1", isRTL && "rotate-180")} />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white/40 text-white bg-white/10 backdrop-blur-md font-bold" 
              data-testid="button-discover-deals"
            >
              <Zap className="w-5 h-5 me-2" />
              Today's Hot Deals
            </Button>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronRight className="w-8 h-8 text-white/60 rotate-90" />
        </motion.div>
      </section>

      {/* Deal of the Moment Section */}
      <section 
        className="py-16 bg-gradient-to-r from-[#F94498]/10 via-[#FFD112]/10 to-[#FF9327]/10 dark:from-[#F94498]/5 dark:via-[#FFD112]/5 dark:to-[#FF9327]/5 relative overflow-hidden"
        data-testid="section-deals"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Flame className="w-8 h-8 text-[#F94498]" />
                </motion.div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground" data-testid="deals-title">
                  Deal of the Moment
                </h2>
              </div>
              <p className="text-muted-foreground">Limited time offers you can't miss</p>
            </div>
            <div className="flex items-center gap-3 bg-[#F94498] text-white px-5 py-3 rounded-xl">
              <Timer className="w-5 h-5" />
              <span className="font-semibold">Ends in:</span>
              <CountdownTimer initialSeconds={FEATURED_DEALS[currentDealIndex].endsIn} />
            </div>
          </div>
          
          {/* Deal Cards Carousel */}
          <div className="relative">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {FEATURED_DEALS.map((deal, index) => {
                  const DealIcon = deal.icon;
                  const isActive = index === currentDealIndex;
                  return (
                    <motion.div
                      key={deal.id}
                      className={cn(
                        "relative rounded-2xl overflow-visible transition-all duration-300",
                        isActive && "lg:scale-105 z-10"
                      )}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card 
                        className={cn(
                          "p-6 border-0 overflow-visible",
                          isActive && "ring-2 ring-[#F94498] shadow-xl shadow-[#F94498]/20"
                        )}
                        data-testid={`deal-card-${deal.id}`}
                      >
                        {/* Pulse Animation for Active Deal */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-2xl bg-[#F94498]/20"
                            animate={{ scale: [1, 1.02, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                        
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-4">
                            <div className={cn("w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center", deal.gradient)}>
                              <DealIcon className="w-7 h-7 text-white" />
                            </div>
                            {isActive && (
                              <Badge className="bg-[#F94498] text-white border-0 animate-pulse">
                                <Zap className="w-3 h-3 me-1" />
                                LIVE
                              </Badge>
                            )}
                          </div>
                          
                          <Badge variant="secondary" className="mb-2">{deal.category}</Badge>
                          <h3 className="font-heading text-xl font-bold text-foreground mb-2">{deal.title}</h3>
                          <div className={cn("text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-3", deal.gradient)}>
                            {deal.discount}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {deal.mall}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
            </div>
            
            {/* Deal Navigation Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {FEATURED_DEALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentDealIndex(index)}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all",
                    index === currentDealIndex 
                      ? "bg-[#F94498] w-8" 
                      : "bg-muted-foreground/30"
                  )}
                  data-testid={`deal-dot-${index}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mega Malls Section with Diagonal Cards */}
      <Section
        id="mega-malls"
        title="Mega Malls of Dubai"
        subtitle="Iconic shopping destinations with world-class entertainment"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MEGA_MALLS.map((mall, index) => (
            <motion.div
              key={mall.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="group overflow-visible hover-elevate rounded-2xl relative"
                data-testid={`card-mall-${mall.id}`}
              >
                {/* Diagonal Gradient Header */}
                <div className={cn(
                  "relative h-52 overflow-hidden rounded-t-2xl bg-gradient-to-br",
                  mall.gradient
                )}>
                  {/* Diagonal Cut Effect */}
                  <div className="absolute inset-0" style={{
                    clipPath: "polygon(0 0, 100% 0, 100% 70%, 0 100%)"
                  }}>
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                  
                  {/* Floating Mall Icon */}
                  <motion.div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Building2 className="w-20 h-20 text-white/30" />
                  </motion.div>
                  
                  {/* Store Count Badge */}
                  <div className={cn("absolute top-4", isRTL ? "left-4" : "right-4")}>
                    <Badge className="bg-white/95 text-foreground border-0 shadow-lg font-bold text-base px-3 py-1">
                      <Store className="w-4 h-4 me-1.5" />
                      <AnimatedStoreCount count={mall.storeCount} />
                    </Badge>
                  </div>
                  
                  {/* Late Night Badge with Glow */}
                  {mall.lateNight && (
                    <div className={cn("absolute bottom-4", isRTL ? "right-4" : "left-4")}>
                      <motion.div
                        animate={{ boxShadow: ["0 0 10px #02A65C", "0 0 20px #02A65C", "0 0 10px #02A65C"] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Badge className="bg-[#02A65C] text-white border-0">
                          <Clock className="w-3 h-3 me-1" />
                          Open Late
                        </Badge>
                      </motion.div>
                    </div>
                  )}
                </div>
                
                {/* Card Content */}
                <div className="p-5">
                  <h3 className="font-heading text-xl font-bold text-foreground mb-2">{mall.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{mall.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4 text-[#6443F4] shrink-0" />
                    <span>{mall.location}</span>
                  </div>
                  
                  {/* Highlight Tags */}
                  <div className="flex flex-wrap gap-2">
                    {mall.highlights.slice(0, 3).map((highlight) => (
                      <Badge key={highlight} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* What's Your Style Quiz */}
      <section 
        className="py-16 bg-gradient-to-br from-[#6443F4]/10 via-[#F94498]/10 to-[#FFD112]/10 dark:from-[#6443F4]/5 dark:via-[#F94498]/5 dark:to-[#FFD112]/5"
        data-testid="section-style-quiz"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-[#6443F4] text-white border-0 mb-4 px-4 py-1">
              <Sparkles className="w-4 h-4 me-2" />
              INTERACTIVE
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="quiz-title">
              What's Your Shopping Style?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Discover the perfect Dubai shopping destinations tailored to your preferences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {STYLE_QUIZ_OPTIONS.map((option) => {
              const OptionIcon = option.icon;
              const isSelected = selectedStyle === option.id;
              
              return (
                <motion.button
                  key={option.id}
                  onClick={() => setSelectedStyle(isSelected ? null : option.id)}
                  className="text-left"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  data-testid={`quiz-option-${option.id}`}
                >
                  <Card className={cn(
                    "p-6 transition-all duration-300 overflow-visible cursor-pointer border-2",
                    isSelected 
                      ? "border-[#6443F4] ring-2 ring-[#6443F4]/20" 
                      : "border-transparent hover:border-muted-foreground/20"
                  )}>
                    <div className={cn(
                      "w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4",
                      option.gradient
                    )}>
                      <OptionIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-foreground mb-2">{option.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
                    
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-4 border-t border-border"
                        >
                          <p className="text-xs text-muted-foreground mb-2 font-semibold uppercase">Recommended:</p>
                          <div className="flex flex-wrap gap-1">
                            {option.destinations.map((dest) => (
                              <Badge key={dest} variant="secondary" className="text-xs">
                                {dest}
                              </Badge>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Souk Textures Section */}
      <Section
        id="souks"
        title="Traditional Souks"
        subtitle="Immerse yourself in centuries-old trading traditions"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TRADITIONAL_SOUKS.map((souk, index) => (
            <motion.div
              key={souk.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Card 
                className="group overflow-visible hover-elevate rounded-2xl"
                data-testid={`card-souk-${souk.id}`}
              >
                <div className="flex flex-col md:flex-row">
                  {/* Texture Image Collage */}
                  <div className="relative w-full md:w-2/5 h-48 md:h-auto overflow-hidden rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
                    <img 
                      src={souk.textureImage} 
                      alt={souk.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", souk.gradient)} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Landmark className="w-12 h-12 text-white/50" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <Badge className={cn("bg-gradient-to-r text-white border-0", souk.gradient)}>
                        {souk.specialty}
                      </Badge>
                      {souk.established && (
                        <Badge variant="outline" className="text-xs">
                          Est. {souk.established}
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="font-heading text-xl font-bold text-foreground mb-2">{souk.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{souk.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 text-[#FF9327] shrink-0" />
                      <span>{souk.location}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Shopping Tips with Energy */}
      <Section
        id="tips"
        variant="alternate"
        title="Insider Shopping Tips"
        subtitle="Make the most of your Dubai shopping spree"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Gift, title: "Dubai Shopping Festival", tip: "Dec-Jan", desc: "Massive discounts, raffles & entertainment" },
            { icon: Percent, title: "Tax-Free Shopping", tip: "5% VAT Refund", desc: "Claim on purchases over AED 250" },
            { icon: Clock, title: "Best Shopping Hours", tip: "10am-12am", desc: "Extended hours on weekends" },
            { icon: CreditCard, title: "Souk Bargaining", tip: "Start at 50%", desc: "Negotiate prices in traditional souks" }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="p-6 text-center hover-elevate overflow-visible rounded-2xl h-full"
                data-testid={`card-tip-${index}`}
              >
                <motion.div 
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6443F4] to-[#F94498] flex items-center justify-center mx-auto mb-4"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <item.icon className="w-8 h-8 text-white" />
                </motion.div>
                <Badge className="mb-3 bg-gradient-to-r from-[#FF9327] to-[#FFD112] text-white border-0">
                  {item.tip}
                </Badge>
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Epic CTA Section */}
      <section 
        className="relative py-20 overflow-hidden"
        data-testid="section-cta"
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-[#6443F4] via-[#F94498] to-[#FFD112]"
          animate={{
            background: [
              "linear-gradient(90deg, #6443F4 0%, #F94498 50%, #FFD112 100%)",
              "linear-gradient(90deg, #F94498 0%, #FFD112 50%, #6443F4 100%)",
              "linear-gradient(90deg, #6443F4 0%, #F94498 50%, #FFD112 100%)"
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-white/20 rounded-full"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [0, -30, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-5 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Experience Dubai's{" "}
              <span className="text-[#FFD112]">Shopping Paradise?</span>
            </h2>
            <p className="text-xl text-white/90 mb-10">
              Plan your ultimate shopping adventure with our comprehensive guides
            </p>
            
            <div className={cn("flex flex-wrap justify-center gap-4", isRTL && "flex-row-reverse")}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href={localePath("/attractions")}>
                  <Button 
                    size="lg" 
                    className="bg-white text-[#6443F4] border-0 font-bold text-lg px-8 shadow-xl shadow-black/20" 
                    data-testid="button-cta-attractions"
                  >
                    <Building2 className="w-5 h-5 me-2" />
                    Explore Attractions
                    <ChevronRight className={cn("w-5 h-5 ms-2", isRTL && "rotate-180")} />
                  </Button>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href={localePath("/hotels")}>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-white/40 text-white bg-white/10 backdrop-blur-sm font-bold" 
                    data-testid="button-cta-hotels"
                  >
                    <Heart className="w-5 h-5 me-2" />
                    Find Hotels
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
