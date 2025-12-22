import { useQuery } from "@tanstack/react-query";
import { MapPin, Search, Map, Clock, Sun, Sunset, Moon, Sparkles, Building, UtensilsCrossed, Compass, Waves, Briefcase, Landmark, TrendingUp, ChevronRight, Coffee, Wine, PartyPopper, ArrowRight, Star, Flame, Heart, Zap, Users } from "lucide-react";
import { motion, useInView, useAnimation } from "framer-motion";
import type { Content } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { Link } from "wouter";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { cn } from "@/lib/utils";

const defaultImages = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&h=1000&fit=crop",
];

const districtCharacters = {
  beach: { color: "#0EA5E9", bgClass: "from-sky-500 to-cyan-400", icon: Waves, label: "Beach & Waterfront" },
  business: { color: "#8B5CF6", bgClass: "from-violet-500 to-purple-500", icon: Briefcase, label: "Business Hub" },
  heritage: { color: "#D97706", bgClass: "from-amber-500 to-yellow-500", icon: Landmark, label: "Heritage & Culture" },
  luxury: { color: "#EC4899", bgClass: "from-pink-500 to-rose-500", icon: Sparkles, label: "Luxury Living" },
  family: { color: "#10B981", bgClass: "from-emerald-500 to-green-500", icon: Users, label: "Family Friendly" },
  nightlife: { color: "#6366F1", bgClass: "from-indigo-500 to-blue-600", icon: PartyPopper, label: "Nightlife" },
};

const districtData: Record<string, { character: keyof typeof districtCharacters; isHot: boolean; stats: { restaurants: number; attractions: number; hotels: number } }> = {
  "downtown-dubai": { character: "luxury", isHot: true, stats: { restaurants: 156, attractions: 45, hotels: 32 } },
  "dubai-marina": { character: "beach", isHot: true, stats: { restaurants: 128, attractions: 28, hotels: 24 } },
  "palm-jumeirah": { character: "luxury", isHot: true, stats: { restaurants: 89, attractions: 22, hotels: 18 } },
  "jbr": { character: "beach", isHot: false, stats: { restaurants: 67, attractions: 15, hotels: 12 } },
  "old-dubai": { character: "heritage", isHot: false, stats: { restaurants: 95, attractions: 38, hotels: 15 } },
  "business-bay": { character: "business", isHot: true, stats: { restaurants: 112, attractions: 18, hotels: 28 } },
  "jumeirah": { character: "luxury", isHot: false, stats: { restaurants: 78, attractions: 24, hotels: 22 } },
  "difc": { character: "business", isHot: false, stats: { restaurants: 85, attractions: 12, hotels: 8 } },
  "al-barsha": { character: "family", isHot: false, stats: { restaurants: 54, attractions: 8, hotels: 16 } },
  "dubai-hills": { character: "family", isHot: true, stats: { restaurants: 42, attractions: 6, hotels: 4 } },
  "bluewaters-island": { character: "beach", isHot: false, stats: { restaurants: 35, attractions: 8, hotels: 3 } },
  "al-karama": { character: "heritage", isHot: false, stats: { restaurants: 120, attractions: 5, hotels: 8 } },
  "jvc": { character: "family", isHot: false, stats: { restaurants: 28, attractions: 3, hotels: 6 } },
  "dubai-creek-harbour": { character: "luxury", isHot: true, stats: { restaurants: 38, attractions: 12, hotels: 5 } },
  "dubai-south": { character: "business", isHot: false, stats: { restaurants: 22, attractions: 4, hotels: 8 } },
  "international-city": { character: "heritage", isHot: false, stats: { restaurants: 85, attractions: 2, hotels: 4 } },
};

const mapPositions: Record<string, { x: number; y: number }> = {
  "downtown-dubai": { x: 50, y: 45 },
  "dubai-marina": { x: 25, y: 35 },
  "palm-jumeirah": { x: 15, y: 40 },
  "jbr": { x: 28, y: 38 },
  "old-dubai": { x: 65, y: 50 },
  "business-bay": { x: 52, y: 48 },
  "jumeirah": { x: 35, y: 42 },
  "difc": { x: 48, y: 42 },
  "al-barsha": { x: 30, y: 55 },
  "dubai-hills": { x: 40, y: 60 },
  "bluewaters-island": { x: 22, y: 32 },
  "al-karama": { x: 58, y: 52 },
  "jvc": { x: 35, y: 65 },
  "dubai-creek-harbour": { x: 70, y: 45 },
  "dubai-south": { x: 20, y: 75 },
  "international-city": { x: 80, y: 55 },
};

const timelineActivities = [
  {
    time: "morning",
    icon: Sun,
    label: "Morning",
    gradient: "from-amber-400 via-orange-400 to-rose-400",
    activities: [
      { district: "Palm Jumeirah", activity: "Sunrise yoga at Atlantis Beach", icon: Sparkles },
      { district: "Old Dubai", activity: "Traditional breakfast at Al Fanar", icon: Coffee },
      { district: "Downtown", activity: "Early visit to Dubai Mall", icon: Building },
    ],
  },
  {
    time: "afternoon",
    icon: Sunset,
    label: "Afternoon",
    gradient: "from-orange-400 via-pink-500 to-purple-500",
    activities: [
      { district: "Dubai Marina", activity: "Yacht cruise & lunch", icon: Waves },
      { district: "DIFC", activity: "Art galleries & rooftop dining", icon: Sparkles },
      { district: "JBR", activity: "Beach walk & The Walk shops", icon: UtensilsCrossed },
    ],
  },
  {
    time: "evening",
    icon: Moon,
    label: "Evening",
    gradient: "from-indigo-500 via-purple-600 to-pink-600",
    activities: [
      { district: "Downtown", activity: "Dubai Fountain show", icon: Star },
      { district: "Business Bay", activity: "Rooftop cocktails with skyline views", icon: Wine },
      { district: "Marina", activity: "Dinner at pier restaurants", icon: PartyPopper },
    ],
  },
];

const vibeQuiz = [
  { vibe: "Beach Lover", icon: Waves, color: "#0EA5E9", districts: ["Dubai Marina", "JBR", "Palm Jumeirah"] },
  { vibe: "Culture Explorer", icon: Landmark, color: "#D97706", districts: ["Old Dubai", "Al Karama", "Al Fahidi"] },
  { vibe: "Luxury Seeker", icon: Sparkles, color: "#EC4899", districts: ["Downtown", "Palm Jumeirah", "DIFC"] },
  { vibe: "Foodie", icon: UtensilsCrossed, color: "#10B981", districts: ["Al Karama", "Business Bay", "JBR"] },
  { vibe: "Nightlife Fan", icon: PartyPopper, color: "#6366F1", districts: ["Dubai Marina", "Business Bay", "DIFC"] },
  { vibe: "Family Fun", icon: Heart, color: "#F43F5E", districts: ["Dubai Hills", "Al Barsha", "JVC"] },
];

function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function FloatingDistrictIcon({ 
  slug, 
  title, 
  position, 
  onHover, 
  isActive,
  isRTL 
}: { 
  slug: string; 
  title: string; 
  position: { x: number; y: number }; 
  onHover: (slug: string | null) => void;
  isActive: boolean;
  isRTL: boolean;
}) {
  const data = districtData[slug] || { character: "luxury", isHot: false, stats: { restaurants: 0, attractions: 0, hotels: 0 } };
  const character = districtCharacters[data.character];
  const Icon = character.icon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          className={cn(
            "absolute cursor-pointer z-10",
            isActive && "z-20"
          )}
          style={{ 
            left: isRTL ? `${100 - position.x}%` : `${position.x}%`, 
            top: `${position.y}%`,
            transform: "translate(-50%, -50%)"
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: isActive ? 1.3 : 1, 
            opacity: 1,
            y: [0, -4, 0],
          }}
          transition={{ 
            scale: { duration: 0.2 },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          onMouseEnter={() => onHover(slug)}
          onMouseLeave={() => onHover(null)}
          data-testid={`map-icon-${slug}`}
        >
          <div 
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm",
              `bg-gradient-to-br ${character.bgClass}`
            )}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
          {data.isHot && (
            <motion.div 
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Flame className="w-2.5 h-2.5 text-white" />
            </motion.div>
          )}
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="top" className="p-3">
        <div className="text-sm font-semibold">{title}</div>
        <Badge 
          variant="secondary" 
          className="mt-1 text-xs"
          style={{ backgroundColor: `${character.color}20`, color: character.color }}
        >
          {character.label}
        </Badge>
      </TooltipContent>
    </Tooltip>
  );
}

function EnhancedDistrictCard({ content, index }: { content: Content; index: number }) {
  const { localePath, isRTL } = useLocale();
  const imageUrl = content.heroImage || defaultImages[index % defaultImages.length];
  const data = districtData[content.slug] || { character: "luxury", isHot: false, stats: { restaurants: 50, attractions: 10, hotels: 5 } };
  const character = districtCharacters[data.character];
  const Icon = character.icon;

  return (
    <Link href={localePath(`/districts/${content.slug}`)}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        data-testid={`district-card-${content.slug}`}
      >
        <Card className="group overflow-visible bg-card rounded-[16px] shadow-[var(--shadow-level-1)] hover-elevate transition-all duration-300 relative">
          <div className="aspect-[3/4] overflow-hidden rounded-t-[16px] relative">
            <img
              src={imageUrl}
              alt={content.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {data.isHot && (
              <motion.div 
                className={cn(
                  "absolute top-3",
                  isRTL ? "right-3" : "left-3"
                )}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 gap-1" data-testid={`hot-badge-${content.slug}`}>
                  <Flame className="w-3 h-3" />
                  Hot
                </Badge>
              </motion.div>
            )}

            <motion.div 
              className={cn(
                "absolute top-3",
                isRTL ? "left-3" : "right-3"
              )}
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shadow-lg border border-white/30 backdrop-blur-sm",
                  `bg-gradient-to-br ${character.bgClass}`
                )}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
            </motion.div>

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-heading text-xl font-bold text-white mb-2 line-clamp-2">
                {content.title}
              </h3>
              <Badge 
                variant="secondary" 
                className="text-xs backdrop-blur-sm bg-white/20 text-white border-white/30"
              >
                {character.label}
              </Badge>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {content.metaDescription || "Explore this vibrant Dubai district"}
            </p>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-travi-purple" />
                <span>{data.stats.attractions}</span>
              </div>
              <div className="flex items-center gap-1">
                <UtensilsCrossed className="w-3.5 h-3.5 text-travi-orange" />
                <span>{data.stats.restaurants}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-travi-pink" />
                <span>{data.stats.hotels}</span>
              </div>
            </div>

            <motion.div 
              className="flex items-center gap-2 text-sm font-medium text-travi-purple opacity-0 group-hover:opacity-100 transition-opacity"
              initial={false}
            >
              <span>Explore</span>
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </Link>
  );
}

function TimelineCard({ activity, delay }: { activity: typeof timelineActivities[0]["activities"][0]; delay: number }) {
  const Icon = activity.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-start gap-3 p-3 rounded-xl bg-background/50 backdrop-blur-sm hover-elevate"
      data-testid={`timeline-activity-${activity.district.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-travi-purple to-travi-pink flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <div className="text-sm font-semibold text-foreground">{activity.district}</div>
        <div className="text-xs text-muted-foreground">{activity.activity}</div>
      </div>
    </motion.div>
  );
}

export default function PublicDistricts() {
  const { t, isRTL, localePath } = useLocale();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMapDistrict, setActiveMapDistrict] = useState<string | null>(null);
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);

  useDocumentMeta({
    title: "Dubai Neighborhoods & Districts | Travi - Dubai Travel Guide",
    description: "Explore Dubai's diverse neighborhoods. From Palm Jumeirah to Downtown, find the perfect district for your lifestyle or travel.",
    ogTitle: "Dubai Neighborhoods & Districts | Travi",
    ogDescription: "Discover the unique character of each Dubai neighborhood.",
    ogType: "website",
  });
  
  const { data: allContent, isLoading } = useQuery<Content[]>({
    queryKey: ["/api/public/contents"],
  });

  const districts = allContent?.filter(c => c.type === "district") || [];
  
  const filteredDistricts = useMemo(() => {
    let result = districts;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(d => 
        d.title.toLowerCase().includes(query) ||
        d.metaDescription?.toLowerCase().includes(query)
      );
    }
    
    if (selectedVibe) {
      const vibeData = vibeQuiz.find(v => v.vibe === selectedVibe);
      if (vibeData) {
        result = result.filter(d => 
          vibeData.districts.some(vd => d.title.toLowerCase().includes(vd.toLowerCase()))
        );
      }
    }
    
    return result;
  }, [districts, searchQuery, selectedVibe]);

  const totalStats = useMemo(() => {
    return Object.values(districtData).reduce(
      (acc, d) => ({
        restaurants: acc.restaurants + d.stats.restaurants,
        attractions: acc.attractions + d.stats.attractions,
        hotels: acc.hotels + d.stats.hotels,
      }),
      { restaurants: 0, attractions: 0, hotels: 0 }
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      <PublicNav variant="transparent" transparentTone="dark" />
      
      <main className="flex-1">
        {/* HERO SECTION - Interactive Map & Floating Icons */}
        <section 
          className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
          data-testid="section-hero-districts"
        >
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop"
              alt=""
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-travi-purple/40 via-travi-pink/20 to-travi-orange/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
          </div>

          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />

          <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 lg:px-[140px] py-20 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                className={isRTL ? "text-right" : "text-left"}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge className="mb-6 px-4 py-2 text-sm bg-white/10 backdrop-blur-md border-white/20 text-white">
                    <Compass className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
                    {districts.length}+ Unique Districts
                  </Badge>
                </motion.div>
                
                <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                  <span className="block">Discover Dubai's</span>
                  <span className="bg-gradient-to-r from-travi-purple via-travi-pink to-travi-orange bg-clip-text text-transparent">
                    Vibrant Districts
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg">
                  From beachfront bliss to cultural treasures, each neighborhood tells its own story
                </p>

                <div className="relative max-w-md">
                  <Search className={cn(
                    "absolute top-1/2 -translate-y-1/2 w-5 h-5 text-white/60",
                    isRTL ? "right-4" : "left-4"
                  )} />
                  <input
                    type="text"
                    placeholder={t('nav.searchPlaceholder') || "Search districts..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(
                      "w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-4 text-white placeholder:text-white/50 outline-none focus:border-white/40 transition-colors",
                      isRTL ? "pr-12 pl-4" : "pl-12 pr-4"
                    )}
                    data-testid="input-search-districts"
                  />
                </div>

                <div className="flex flex-wrap gap-4 mt-8">
                  <div className="flex items-center gap-3 text-white/80">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
                      <Building className="w-4 h-4 text-travi-purple" />
                      <span className="font-semibold">
                        <AnimatedCounter end={totalStats.attractions} />
                      </span>
                      <span className="text-sm">Attractions</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/80">
                    <UtensilsCrossed className="w-4 h-4 text-travi-orange" />
                    <span className="font-semibold">
                      <AnimatedCounter end={totalStats.restaurants} />
                    </span>
                    <span className="text-sm">Restaurants</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/80">
                    <MapPin className="w-4 h-4 text-travi-pink" />
                    <span className="font-semibold">
                      <AnimatedCounter end={totalStats.hotels} />
                    </span>
                    <span className="text-sm">Hotels</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="relative hidden lg:block"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div 
                  className="relative aspect-square rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 overflow-hidden"
                  data-testid="interactive-map"
                >
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600')] opacity-10 bg-cover bg-center" />
                  
                  {districts.map((district) => {
                    const pos = mapPositions[district.slug] || { x: 50, y: 50 };
                    return (
                      <FloatingDistrictIcon
                        key={district.slug}
                        slug={district.slug}
                        title={district.title}
                        position={pos}
                        onHover={setActiveMapDistrict}
                        isActive={activeMapDistrict === district.slug}
                        isRTL={isRTL}
                      />
                    );
                  })}

                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/40 backdrop-blur-md">
                    <div className="text-xs text-white/60 mb-2">Legend</div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(districtCharacters).slice(0, 4).map(([key, char]) => {
                        const Icon = char.icon;
                        return (
                          <div key={key} className="flex items-center gap-1 text-xs text-white/80">
                            <Icon className="w-3 h-3" style={{ color: char.color }} />
                            <span>{char.label.split(" ")[0]}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* QUICK JUMP MAP NAVIGATION */}
        <section className="py-8 bg-gradient-to-r from-travi-purple/5 via-travi-pink/5 to-travi-orange/5 border-b border-border/50" data-testid="section-quick-jump">
          <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-[140px]">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-travi-orange" />
              <h2 className="font-semibold text-foreground">Quick Jump</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {districts.slice(0, 10).map((district, index) => {
                const data = districtData[district.slug] || { character: "luxury" };
                const character = districtCharacters[data.character];
                return (
                  <motion.div
                    key={district.slug}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={localePath(`/districts/${district.slug}`)}>
                      <Badge 
                        variant="outline" 
                        className="cursor-pointer hover-elevate transition-all"
                        style={{ 
                          borderColor: `${character.color}40`,
                          backgroundColor: activeMapDistrict === district.slug ? `${character.color}20` : undefined
                        }}
                        data-testid={`quick-jump-${district.slug}`}
                      >
                        <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: character.color }} />
                        {district.title}
                      </Badge>
                    </Link>
                  </motion.div>
                );
              })}
              {districts.length > 10 && (
                <Badge variant="secondary" className="cursor-default">
                  +{districts.length - 10} more
                </Badge>
              )}
            </div>
          </div>
        </section>

        {/* DISCOVER YOUR DAY - Journey Timeline */}
        <section className="py-[60px] bg-background" data-testid="section-journey-timeline">
          <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-[140px]">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-travi-purple/10 to-travi-pink/10 text-travi-purple border-travi-purple/20">
                <Clock className="w-4 h-4 mr-2" />
                Journey Mode
              </Badge>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                Discover Your Perfect Day
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Plan your Dubai adventure from sunrise to starlight across different districts
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {timelineActivities.map((period, periodIndex) => {
                const Icon = period.icon;
                return (
                  <motion.div
                    key={period.time}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: periodIndex * 0.2 }}
                    data-testid={`timeline-${period.time}`}
                  >
                    <Card className="overflow-hidden h-full">
                      <div className={cn(
                        "p-4 bg-gradient-to-r",
                        period.gradient
                      )}>
                        <div className="flex items-center gap-3 text-white">
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-lg">{period.label}</div>
                            <div className="text-sm text-white/80">
                              {period.time === "morning" && "6 AM - 12 PM"}
                              {period.time === "afternoon" && "12 PM - 6 PM"}
                              {period.time === "evening" && "6 PM - 12 AM"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        {period.activities.map((activity, actIndex) => (
                          <TimelineCard 
                            key={actIndex} 
                            activity={activity} 
                            delay={periodIndex * 0.2 + actIndex * 0.1}
                          />
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* WHAT'S YOUR VIBE? Quiz Section */}
        <section className="py-[60px] bg-gradient-to-br from-travi-purple/5 via-travi-pink/5 to-travi-orange/5" data-testid="section-vibe-quiz">
          <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-[140px]">
            <motion.div 
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-travi-orange/10 to-travi-pink/10 text-travi-orange border-travi-orange/20">
                <Sparkles className="w-4 h-4 mr-2" />
                Personalized
              </Badge>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                What's Your Vibe?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Click your style to find your perfect Dubai district
              </p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {vibeQuiz.map((vibe, index) => {
                const Icon = vibe.icon;
                const isSelected = selectedVibe === vibe.vibe;
                return (
                  <motion.div
                    key={vibe.vibe}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => setSelectedVibe(isSelected ? null : vibe.vibe)}
                      className={cn(
                        "w-full p-4 rounded-xl border-2 transition-all hover-elevate text-center",
                        isSelected 
                          ? "border-current shadow-lg" 
                          : "border-border/50 hover:border-current"
                      )}
                      style={{ 
                        borderColor: isSelected ? vibe.color : undefined,
                        backgroundColor: isSelected ? `${vibe.color}10` : undefined
                      }}
                      data-testid={`vibe-${vibe.vibe.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <div 
                        className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                        style={{ backgroundColor: `${vibe.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: vibe.color }} />
                      </div>
                      <div className="font-semibold text-sm text-foreground">{vibe.vibe}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {vibe.districts.length} districts
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {selectedVibe && (
              <motion.div 
                className="mt-8 p-6 rounded-2xl bg-card border border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">
                      Perfect for {selectedVibe}s
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      We found {filteredDistricts.length} districts matching your vibe
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedVibe(null)}
                    data-testid="button-clear-vibe"
                  >
                    Clear Filter
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {vibeQuiz.find(v => v.vibe === selectedVibe)?.districts.map((d, i) => (
                    <Badge key={i} variant="secondary">{d}</Badge>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* DISTRICTS GRID */}
        <section className="py-[60px] bg-background" data-testid="section-districts-grid">
          <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-[140px]">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-10">
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                  {searchQuery || selectedVibe ? "Matching Districts" : "All Districts"}
                </h2>
                <p className="text-muted-foreground mt-2">
                  {isLoading ? "Loading..." : `${filteredDistricts.length} districts to explore`}
                </p>
              </div>
              {(searchQuery || selectedVibe) && (
                <Button 
                  variant="outline" 
                  onClick={() => { setSearchQuery(""); setSelectedVibe(null); }}
                  data-testid="button-clear-filters"
                >
                  Clear All Filters
                </Button>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[30px]">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-muted rounded-[16px]" />
                  </div>
                ))}
              </div>
            ) : filteredDistricts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[30px]">
                {filteredDistricts.map((district, index) => (
                  <EnhancedDistrictCard key={district.id} content={district} index={index} />
                ))}
              </div>
            ) : (
              <motion.div 
                className="text-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-travi-purple/10 to-travi-pink/10 flex items-center justify-center mx-auto mb-6">
                  <Map className="w-10 h-10 text-travi-purple" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('search.noResults') || "No districts found"}</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {searchQuery || selectedVibe 
                    ? "Try adjusting your filters to discover more districts" 
                    : "Districts will appear here once published"}
                </p>
                {(searchQuery || selectedVibe) && (
                  <Button
                    variant="default"
                    onClick={() => { setSearchQuery(""); setSelectedVibe(null); }}
                    data-testid="button-reset-search"
                  >
                    Show All Districts
                  </Button>
                )}
              </motion.div>
            )}
          </div>
        </section>

        {/* STATS & CTA SECTION */}
        <section className="py-[80px] bg-gradient-to-br from-travi-purple via-travi-pink to-travi-orange" data-testid="section-stats-cta">
          <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-[140px]">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
                  Your Dubai Adventure Awaits
                </h2>
                <p className="text-white/80 text-lg mb-8">
                  From the historic charm of Old Dubai to the modern luxury of Palm Jumeirah, 
                  each district offers a unique experience waiting to be explored.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href={localePath("/attractions")}>
                    <Button variant="secondary" size="lg" data-testid="button-explore-attractions">
                      Explore Attractions
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href={localePath("/hotels")}>
                    <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10" data-testid="button-find-hotels">
                      Find Hotels
                    </Button>
                  </Link>
                </div>
              </motion.div>

              <motion.div
                className="grid grid-cols-2 gap-4"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                {[
                  { label: "Districts", value: districts.length, suffix: "+", icon: MapPin },
                  { label: "Attractions", value: totalStats.attractions, suffix: "+", icon: Building },
                  { label: "Restaurants", value: totalStats.restaurants, suffix: "+", icon: UtensilsCrossed },
                  { label: "Hotels", value: totalStats.hotels, suffix: "+", icon: Star },
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      data-testid={`stat-${stat.label.toLowerCase()}`}
                    >
                      <Icon className="w-8 h-8 text-white/80 mx-auto mb-3" />
                      <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                        <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="text-white/70 text-sm">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
