import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, MapPin, Clock, Gem, Store, Building2,
  Sparkles, Crown, Gift, Percent, CreditCard, Package,
  ChevronRight, ArrowRight, Landmark, Coffee, Shirt,
  Watch, Smartphone, Tag, Star, Zap, Timer, Flame,
  PartyPopper, ShoppingCart, Heart, TrendingUp
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { cn } from "@/lib/utils";
import CategoryTemplate from "./category-template";

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

function StyleQuizSelector({ selectedStyle, onSelectStyle }: { selectedStyle: string | null; onSelectStyle: (style: string) => void }) {
  return (
    <section 
      className="relative py-16 overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background"
      data-testid="style-quiz-section"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-[140px]">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 bg-gradient-to-r from-[#6443F4] to-[#F94498] text-white border-0">
            <ShoppingBag className="w-3 h-3 mr-1" />
            Find Your Style
          </Badge>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            What's Your <span className="bg-gradient-to-r from-[#6443F4] to-[#F94498] bg-clip-text text-transparent">Shopping Style?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We'll recommend the perfect destinations for you
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STYLE_QUIZ_OPTIONS.map((option, idx) => {
            const Icon = option.icon;
            const isSelected = selectedStyle === option.id;
            
            return (
              <motion.button
                key={option.id}
                data-testid={`style-button-${option.id}`}
                onClick={() => onSelectStyle(option.id)}
                className={cn(
                  "relative group p-6 md:p-8 rounded-[20px] text-center transition-all duration-300",
                  "border-2",
                  isSelected 
                    ? `bg-gradient-to-br ${option.gradient} border-transparent shadow-xl`
                    : "bg-card border-border/50 hover:border-[#6443F4]/50"
                )}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div 
                  className={cn(
                    "w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300",
                    isSelected 
                      ? "bg-white/20" 
                      : `bg-gradient-to-br ${option.gradient}`
                  )}
                >
                  <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </motion.div>
                
                <h3 className={cn(
                  "font-heading font-bold text-lg md:text-xl mb-2",
                  isSelected ? "text-white" : "text-foreground"
                )}>
                  {option.title}
                </h3>
                <p className={cn(
                  "text-sm mb-4",
                  isSelected ? "text-white/80" : "text-muted-foreground"
                )}>
                  {option.description}
                </p>

                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-2"
                  >
                    {option.destinations.map((dest, i) => (
                      <div key={i} className="text-xs text-white/90 bg-white/10 px-3 py-1 rounded-full">
                        {dest}
                      </div>
                    ))}
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MegaMallsSection() {
  const { isRTL, localePath } = useLocale();

  return (
    <section className="py-16 bg-background" data-testid="mega-malls-section">
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-[140px]">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4 bg-gradient-to-r from-[#6443F4] to-[#9077EF] text-white border-0">
            <Building2 className="w-3 h-3 mr-1" />
            Mega Malls
          </Badge>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            World-Famous <span className="text-[#6443F4]">Shopping Destinations</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience shopping at its finest in Dubai's iconic mega malls
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MEGA_MALLS.map((mall, index) => (
            <motion.div
              key={mall.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              data-testid={`mall-card-${mall.id}`}
            >
              <Card className="group overflow-hidden hover-elevate p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={cn("w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0", mall.gradient)}>
                    <Store className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-heading text-xl font-bold text-foreground">{mall.name}</h3>
                      {mall.lateNight && (
                        <Badge variant="secondary" className="text-xs">Late Night</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {mall.location}
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm mb-4">{mall.description}</p>

                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="font-bold">
                    {mall.stores} Stores
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  {mall.highlights.slice(0, 3).map((highlight, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {highlight}
                    </Badge>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DealsSection() {
  const [currentDealIndex, setCurrentDealIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDealIndex((prev) => (prev + 1) % FEATURED_DEALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section 
      className="py-16 bg-gradient-to-r from-[#F94498]/10 via-[#FFD112]/10 to-[#FF9327]/10 dark:from-[#F94498]/5 dark:via-[#FFD112]/5 dark:to-[#FF9327]/5"
      data-testid="deals-section"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-[140px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Flame className="w-8 h-8 text-[#F94498]" />
              </motion.div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
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
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function PublicShopping() {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  return (
    <CategoryTemplate
      categoryType="shopping"
      seoConfig={{
        title: "Dubai Shopping Festival 2025 | Malls, Souks & Mega Deals | Travi",
        description: "Experience Dubai's ultimate shopping paradise! 50+ malls, legendary souks, and exclusive festival deals. Tax-free shopping awaits!"
      }}
    >
      <DealsSection />
      <StyleQuizSelector selectedStyle={selectedStyle} onSelectStyle={setSelectedStyle} />
      <MegaMallsSection />
    </CategoryTemplate>
  );
}
