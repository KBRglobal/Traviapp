import { Link } from "wouter";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Utensils, ArrowRight, ChefHat, Wine,
  Globe, Award, Sparkles, Waves, Coffee, Fish,
  UtensilsCrossed, Beef, Calendar, TreePalm, Flame,
  IceCream, Salad, Star, TrendingUp, DollarSign,
  Clock, Phone, Cake, Soup, Pizza, Cookie, Loader2
} from "lucide-react";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import {
  PageContainer,
  Section,
  CategoryGrid
} from "@/components/public-layout";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

// Types for API response
interface ApiDining {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string;
  status: string;
  type: string;
  dining?: {
    cuisine?: string;
    location?: string;
    priceRange?: string;
  };
}

// Fetch dining from API
async function fetchDining(): Promise<ApiDining[]> {
  const response = await fetch("/api/public/contents?type=dining&limit=100");
  if (!response.ok) throw new Error("Failed to fetch dining");
  return response.json();
}

const cravingOptions = [
  {
    id: "sweet",
    label: "Something Sweet",
    description: "Decadent desserts & pastries",
    icon: IceCream,
    gradient: "from-pink-400 via-rose-400 to-red-400",
    hoverGradient: "from-pink-500 via-rose-500 to-red-500",
    accentColor: "text-pink-100",
  },
  {
    id: "spicy",
    label: "Spicy Adventure",
    description: "Asian, Indian & bold flavors",
    icon: Flame,
    gradient: "from-orange-500 via-red-500 to-amber-500",
    hoverGradient: "from-orange-600 via-red-600 to-amber-600",
    accentColor: "text-orange-100",
  },
  {
    id: "fresh",
    label: "Fresh & Light",
    description: "Mediterranean & healthy",
    icon: Salad,
    gradient: "from-emerald-400 via-teal-400 to-cyan-400",
    hoverGradient: "from-emerald-500 via-teal-500 to-cyan-500",
    accentColor: "text-emerald-100",
  },
  {
    id: "comfort",
    label: "Comfort Food",
    description: "Burgers, pasta & soul food",
    icon: Soup,
    gradient: "from-amber-400 via-orange-400 to-yellow-400",
    hoverGradient: "from-amber-500 via-orange-500 to-yellow-500",
    accentColor: "text-amber-100",
  },
  {
    id: "fine",
    label: "Fine Dining",
    description: "Michelin stars & luxury",
    icon: Award,
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    hoverGradient: "from-violet-600 via-purple-600 to-fuchsia-600",
    accentColor: "text-violet-100",
  },
];

const floatingFoodIcons = [
  { Icon: Pizza, delay: 0, duration: 15, x: "10%", size: 32 },
  { Icon: Coffee, delay: 2, duration: 18, x: "25%", size: 28 },
  { Icon: UtensilsCrossed, delay: 4, duration: 20, x: "40%", size: 36 },
  { Icon: Cake, delay: 1, duration: 16, x: "55%", size: 30 },
  { Icon: Wine, delay: 3, duration: 17, x: "70%", size: 34 },
  { Icon: Cookie, delay: 5, duration: 19, x: "85%", size: 26 },
];

const todaysSpecials = [
  { name: "Wagyu Tasting Menu", restaurant: "Nobu Dubai", price: "AED 850" },
  { name: "Sunset Seafood Platter", restaurant: "Pierchic", price: "AED 650" },
  { name: "Chef's Omakase", restaurant: "Zuma", price: "AED 750" },
  { name: "Royal Afternoon Tea", restaurant: "Burj Al Arab", price: "AED 550" },
  { name: "Live Cooking Experience", restaurant: "Tresind Studio", price: "AED 900" },
  { name: "Sky High Brunch", restaurant: "At.mosphere", price: "AED 700" },
];

const uniqueExperiences = [
  {
    name: "Dinner in the Sky",
    location: "Various Locations, Dubai",
    description: "Experience gourmet dining suspended 50 meters in the air by a crane. Enjoy 360-degree panoramic views of Dubai's iconic skyline.",
    highlight: "Suspended 50m in the Air",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
    icon: Sparkles,
    cuisine: "International",
    priceLevel: 4,
    isTrending: true,
    signatureDish: "Tasting Menu Experience",
  },
  {
    name: "At.mosphere",
    location: "Burj Khalifa, 122nd Floor",
    description: "Dine at the world's highest restaurant, perched 442 meters above ground on the 122nd floor of the iconic Burj Khalifa.",
    highlight: "World's Highest Restaurant",
    image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&h=600&fit=crop",
    icon: Award,
    cuisine: "European",
    priceLevel: 4,
    isChefsPick: true,
    signatureDish: "Lobster Thermidor",
  },
  {
    name: "Ossiano",
    location: "Atlantis, The Palm",
    description: "Immerse yourself in an underwater wonderland surrounded by 65,000 marine animals. Michelin-starred Mediterranean seafood.",
    highlight: "Underwater Dining with Sharks",
    image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&h=600&fit=crop",
    icon: Fish,
    cuisine: "Seafood",
    priceLevel: 4,
    isTrending: true,
    signatureDish: "Caviar Selection",
  },
  {
    name: "Al Mahara",
    location: "Burj Al Arab",
    description: "Arrive via a simulated submarine ride to this legendary underwater restaurant inside the world's most iconic 7-star hotel.",
    highlight: "Burj Al Arab Aquarium",
    image: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800&h=600&fit=crop",
    icon: Waves,
    cuisine: "Seafood",
    priceLevel: 4,
    isChefsPick: true,
    signatureDish: "Royal Seafood Platter",
  },
  {
    name: "Pierchic",
    location: "Al Qasr, Jumeirah Beach",
    description: "Dubai's most romantic overwater restaurant, set at the end of a wooden pier stretching into the Arabian Gulf.",
    highlight: "Overwater Pier Restaurant",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop",
    icon: TreePalm,
    cuisine: "Mediterranean",
    priceLevel: 3,
    isTrending: false,
    signatureDish: "Grilled Catch of the Day",
  },
  {
    name: "Tresind Studio",
    location: "DIFC, Dubai",
    description: "Dubai's celebrated Michelin-starred Indian fine dining. A 16-seat chef's table offering progressive Indian cuisine.",
    highlight: "Michelin-Starred Indian",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
    icon: ChefHat,
    cuisine: "Indian",
    priceLevel: 4,
    isChefsPick: true,
    signatureDish: "10-Course Degustation",
  },
];

const cuisineCategories = [
  { 
    id: "arabic", 
    name: "Arabic & Middle Eastern", 
    description: "Authentic Lebanese, Emirati, Persian & Turkish cuisines", 
    icon: UtensilsCrossed, 
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&h=400&fit=crop",
    color: "bg-amber-500",
  },
  { 
    id: "indian", 
    name: "Indian & South Asian", 
    description: "From street food to Michelin-starred fine dining", 
    icon: Sparkles, 
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop",
    color: "bg-orange-500",
  },
  { 
    id: "european", 
    name: "European", 
    description: "French, Italian, Spanish & Mediterranean flavors", 
    icon: Wine, 
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
    color: "bg-violet-500",
  },
  { 
    id: "asian", 
    name: "Asian Cuisine", 
    description: "Japanese, Chinese, Thai, Korean & Vietnamese", 
    icon: Utensils, 
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop",
    color: "bg-red-500",
  },
  { 
    id: "american", 
    name: "American & Steakhouses", 
    description: "Premium steaks, burgers & classic American fare", 
    icon: Beef, 
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop",
    color: "bg-rose-600",
  },
  { 
    id: "seafood", 
    name: "Seafood & Beach Dining", 
    description: "Fresh catches with stunning waterfront views", 
    icon: Fish, 
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop",
    color: "bg-cyan-500",
  },
  { 
    id: "cafes", 
    name: "Cafes & Brunch Spots", 
    description: "Artisan coffee, pastries & Instagram-worthy brunches", 
    icon: Coffee, 
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop",
    color: "bg-amber-600",
  },
];

const diningAreas = [
  { 
    name: "Downtown Dubai", 
    description: "Fine dining with stunning Burj Khalifa views. Home to sky-high restaurants, rooftop bars, and world-class culinary experiences.", 
    highlight: "Fine Dining & Sky Restaurants",
    restaurants: "200+",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop" 
  },
  { 
    name: "Dubai Marina", 
    description: "Waterfront dining with yacht views and glittering skyline. Romantic restaurants, trendy lounges, and international cuisines.", 
    highlight: "Waterfront Dining",
    restaurants: "150+",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop" 
  },
  { 
    name: "DIFC", 
    description: "Dubai's culinary epicenter with 50+ world-class venues. Power lunches, celebrity chef restaurants, and exclusive dining.", 
    highlight: "Business Lunches & Rooftop Bars",
    restaurants: "50+",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&h=600&fit=crop" 
  },
  { 
    name: "JBR / The Walk", 
    description: "Casual beachside dining with ocean breezes. Family-friendly restaurants, beach clubs, and al fresco dining.", 
    highlight: "Casual Beachside",
    restaurants: "100+",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop" 
  },
  { 
    name: "Old Dubai", 
    description: "Authentic local flavors in historic settings. Traditional Emirati cuisine, aromatic spice souks, and hidden gems.", 
    highlight: "Authentic Local Food",
    restaurants: "300+",
    image: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&h=600&fit=crop" 
  },
  { 
    name: "City Walk", 
    description: "Trendy urban district with contemporary cafes and international restaurants. Al fresco dining and cool brunch spots.", 
    highlight: "Trendy Cafes",
    restaurants: "80+",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop" 
  },
];

const foodEvents = [
  {
    name: "Dubai Food Festival",
    description: "The city's biggest annual culinary celebration featuring restaurant deals, food trucks, and celebrity chef appearances.",
    date: "February - March",
    highlight: "Annual Celebration",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=500&fit=crop",
  },
  {
    name: "Global Village Food Courts",
    description: "A world tour of flavors with 90+ countries represented. From Indian street food to Turkish kebabs.",
    date: "October - April",
    highlight: "90+ Countries",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=500&fit=crop",
  },
  {
    name: "Ripe Market",
    description: "Dubai's favorite artisan market featuring organic produce, homemade treats, and local vendors.",
    date: "Every Weekend",
    highlight: "Organic & Artisan",
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=500&fit=crop",
  },
];

function PriceLevel({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-0.5" data-testid="price-level">
      {[1, 2, 3, 4].map((i) => (
        <DollarSign
          key={i}
          className={cn(
            "w-3.5 h-3.5",
            i <= level ? "text-[hsl(var(--orange))]" : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
}

function AnimatedBadge({ type }: { type: "trending" | "chefsPick" }) {
  const isTrending = type === "trending";
  
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
        isTrending
          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
          : "bg-gradient-to-r from-violet-500 to-purple-500 text-white"
      )}
      data-testid={`badge-${type}`}
    >
      {isTrending ? (
        <>
          <motion.div
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <TrendingUp className="w-3.5 h-3.5" />
          </motion.div>
          Trending
        </>
      ) : (
        <>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChefHat className="w-3.5 h-3.5" />
          </motion.div>
          Chef's Pick
        </>
      )}
    </motion.div>
  );
}

function SteamParticle({ delay, x }: { delay: number; x: string }) {
  return (
    <motion.div
      className="absolute bottom-0 w-1 h-8 bg-gradient-to-t from-white/40 to-transparent rounded-full blur-[2px]"
      style={{ left: x }}
      initial={{ y: 0, opacity: 0.6, scaleY: 1 }}
      animate={{
        y: [-20, -80],
        opacity: [0.6, 0],
        scaleY: [1, 1.5],
      }}
      transition={{
        duration: 2.5,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
    />
  );
}

function SparkleParticle({ delay, x, y }: { delay: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute w-1.5 h-1.5 bg-amber-300 rounded-full"
      style={{ left: x, top: y }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [0, 1, 0],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export default function PublicDining() {
  const { isRTL, localePath } = useLocale();
  const [selectedCraving, setSelectedCraving] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Fetch dining from database
  const { data: apiDining, isLoading: isLoadingDining } = useQuery({
    queryKey: ["public-dining"],
    queryFn: fetchDining,
    staleTime: 5 * 60 * 1000,
  });

  // Convert API restaurants to display format
  const dbRestaurants = useMemo(() => {
    if (!apiDining) return [];
    return apiDining.map((d) => ({
      name: d.title,
      location: d.dining?.location || "Dubai",
      description: d.excerpt || "",
      highlight: d.dining?.cuisine || "International",
      image: d.featuredImage || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
      icon: Utensils,
      cuisine: d.dining?.cuisine || "International",
      priceLevel: d.dining?.priceRange === "$$$$$" ? 5 : d.dining?.priceRange === "$$$$" ? 4 : 3,
      isTrending: true,
      signatureDish: "Chef's Special",
      slug: d.slug,
    }));
  }, [apiDining]);

  useDocumentMeta({
    title: "Dubai's Best Restaurants & Dining Experiences 2025 | Travi",
    description: "Discover Dubai's culinary scene: 1000+ restaurants, 100+ cuisines, sky dining at Burj Khalifa, underwater restaurants at Atlantis. From Michelin stars to street food.",
    ogTitle: "Dubai's Best Restaurants & Dining | Travi",
    ogDescription: "From Michelin Stars to Street Food. Experience sky dining, underwater restaurants, and 100+ world cuisines in Dubai.",
    ogType: "website",
  });

  return (
    <PageContainer navVariant="transparent">
      {/* Sensory Hero Section */}
      <section
        className="relative min-h-[560px] md:min-h-[640px] w-full flex items-center justify-center overflow-hidden"
        data-testid="dining-hero"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop)` }}
        />
        
        {/* Warm Appetite-Inducing Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/70 via-red-900/60 to-amber-900/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Animated Steam Particles */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none">
          {["15%", "25%", "35%", "65%", "75%", "85%"].map((x, i) => (
            <SteamParticle key={i} delay={i * 0.4} x={x} />
          ))}
        </div>
        
        {/* Sparkle Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { x: "20%", y: "30%", delay: 0 },
            { x: "70%", y: "25%", delay: 0.5 },
            { x: "45%", y: "40%", delay: 1 },
            { x: "80%", y: "50%", delay: 1.5 },
            { x: "15%", y: "60%", delay: 2 },
            { x: "60%", y: "35%", delay: 2.5 },
          ].map((spark, i) => (
            <SparkleParticle key={i} {...spark} />
          ))}
        </div>
        
        {/* Floating Food Icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {floatingFoodIcons.map(({ Icon, delay, duration, x, size }, i) => (
            <motion.div
              key={i}
              className="absolute text-white/20"
              style={{ left: x }}
              initial={{ y: "100%", opacity: 0 }}
              animate={{
                y: ["-10%", "110%"],
                opacity: [0, 0.3, 0.3, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Icon size={size} />
            </motion.div>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-8 lg:px-[140px] py-12 md:py-16">
          {/* Breadcrumbs */}
          <nav
            className="flex items-center gap-2 mb-6 text-sm"
            aria-label="Breadcrumb"
            data-testid="hero-breadcrumbs"
          >
            <Link
              href={localePath("/")}
              className="text-white/80 hover:text-white transition-colors"
              data-testid="breadcrumb-home"
            >
              Home
            </Link>
            <span className="text-white/60">/</span>
            <span className="text-white font-medium">Dining</span>
          </nav>

          {/* Headline with Animated Gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
            data-testid="hero-title"
          >
            <span className="bg-gradient-to-r from-amber-200 via-orange-200 to-yellow-200 bg-clip-text text-transparent">
              Taste Dubai's
            </span>
            <br />
            <span className="text-white">Culinary Magic</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed mb-8"
            data-testid="hero-subtitle"
          >
            From sky-high Michelin stars to sizzling street food. Your appetite's greatest adventure awaits.
          </motion.p>

          {/* Stats Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={cn("flex flex-wrap items-center gap-3 mb-8", isRTL && "flex-row-reverse")}
          >
            {[
              { value: "1000+", label: "Restaurants", icon: Utensils },
              { value: "100+", label: "Cuisines", icon: Globe },
              { value: "Sky Dining", label: "442m High", icon: Sparkles },
              { value: "Underwater", label: "With Sharks", icon: Fish },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2.5 rounded-full bg-gradient-to-r from-white/15 to-white/5 backdrop-blur-md border border-white/20 flex items-center gap-2"
                data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <stat.icon className="w-4 h-4 text-amber-300" />
                <span className="text-white font-bold">{stat.value}</span>
                <span className="text-white/70">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Reservation CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg shadow-orange-500/30"
                data-testid="button-book-table"
              >
                <Phone className="w-4 h-4 me-2" />
                Book a Table
              </Button>
            </motion.div>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white bg-white/10 backdrop-blur-sm"
              data-testid="button-explore-menus"
            >
              Explore Menus
              <ArrowRight className={cn("w-4 h-4 ms-2", isRTL && "rotate-180")} />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Today's Specials Marquee */}
      <div className="relative bg-gradient-to-r from-amber-900 via-orange-900 to-red-900 py-3 overflow-hidden" data-testid="todays-specials-marquee">
        <div className="flex items-center">
          <motion.div
            className="flex items-center gap-12 whitespace-nowrap"
            animate={{ x: isRTL ? ["0%", "50%"] : ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            {[...todaysSpecials, ...todaysSpecials].map((special, i) => (
              <div key={i} className="flex items-center gap-3 text-white/90">
                <span className="text-amber-300 font-semibold">
                  <Star className="w-4 h-4 inline me-1" />
                  TODAY'S SPECIAL
                </span>
                <span className="font-medium">{special.name}</span>
                <span className="text-white/60">at {special.restaurant}</span>
                <span className="text-amber-300 font-bold">{special.price}</span>
                <span className="text-white/30">|</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* What Are You Craving Section */}
      <Section
        id="craving"
        title="What Are You Craving?"
        subtitle="Tell us your mood and we'll find your perfect dining experience"
        variant="gradient"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8" data-testid="craving-selector">
          {cravingOptions.map((option) => {
            const IconComponent = option.icon;
            const isSelected = selectedCraving === option.id;
            
            return (
              <motion.button
                key={option.id}
                onClick={() => setSelectedCraving(isSelected ? null : option.id)}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "relative p-5 rounded-2xl text-center transition-all duration-300 overflow-hidden group",
                  "bg-gradient-to-br",
                  isSelected ? option.hoverGradient : option.gradient,
                  "shadow-lg",
                  isSelected && "ring-4 ring-white/50 shadow-xl"
                )}
                data-testid={`craving-option-${option.id}`}
              >
                {/* Animated glow effect */}
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isSelected ? 0.2 : 0 }}
                />
                
                {/* Icon with animation */}
                <motion.div
                  className="mb-3 flex justify-center"
                  animate={isSelected ? { rotate: [0, -10, 10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center",
                    "bg-white/20 backdrop-blur-sm"
                  )}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                </motion.div>
                
                <h3 className="text-white font-bold text-sm mb-1">{option.label}</h3>
                <p className={cn("text-xs", option.accentColor)}>{option.description}</p>
                
                {/* Selection indicator */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                    >
                      <span className="text-emerald-500 font-bold text-xs">!</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
        
        {selectedCraving && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-muted-foreground">
              Showing restaurants perfect for{" "}
              <span className="font-semibold text-foreground">
                {cravingOptions.find(c => c.id === selectedCraving)?.label}
              </span>
            </p>
          </motion.div>
        )}
      </Section>

      {/* Unique Dining Experiences Section */}
      <Section
        id="unique-experiences"
        title="Unforgettable Dining Experiences"
        subtitle="Dine 50 meters in the sky, underwater with sharks, or at the world's highest restaurant"
        variant="alternate"
      >
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
            <Sparkles className="w-4 h-4 me-2" />
            Only in Dubai
          </Badge>
          <Badge className="bg-muted text-muted-foreground border-border">
            <Clock className="w-4 h-4 me-2" />
            Book 2 weeks ahead
          </Badge>
        </div>
        
        {/* Loading State */}
        {isLoadingDining && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">Loading dining experiences...</span>
          </div>
        )}
        
        <CategoryGrid columns={3}>
          {/* Show database restaurants first, then static ones */}
          {[...dbRestaurants, ...uniqueExperiences].map((experience) => {
            const IconComponent = experience.icon || Utensils;
            const isHovered = hoveredCard === experience.name;
            const hasSlug = 'slug' in experience && experience.slug;
            
            const cardContent = (
              <Card 
                className="group overflow-visible bg-card rounded-[16px] shadow-[var(--shadow-level-1)] hover-elevate transition-all duration-300"
                data-testid={`card-experience-${experience.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="relative h-52 overflow-hidden rounded-t-[16px]">
                  <img 
                    src={experience.image}
                    alt={experience.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Animated Badges */}
                  <div className={cn("absolute top-4 flex flex-col gap-2", isRTL ? "right-4" : "left-4")}>
                    {experience.isTrending && <AnimatedBadge type="trending" />}
                    {experience.isChefsPick && <AnimatedBadge type="chefsPick" />}
                  </div>
                  
                  {/* Icon */}
                  <div className={cn("absolute", isRTL ? "left-4" : "right-4", "top-4")}>
                    <motion.div
                      animate={isHovered ? { rotate: [0, -10, 10, 0] } : {}}
                      transition={{ duration: 0.5 }}
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg"
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                  
                  {/* Signature Dish Preview on Hover */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute inset-x-4 bottom-4 p-3 bg-black/70 backdrop-blur-md rounded-xl border border-white/20"
                      >
                        <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold mb-1">
                          <Star className="w-3.5 h-3.5" />
                          SIGNATURE DISH
                        </div>
                        <p className="text-white text-sm font-medium">{experience.signatureDish}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-[hsl(var(--orange))] transition-colors">
                      {experience.name}
                    </h3>
                    <PriceLevel level={experience.priceLevel} />
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-2 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {experience.location}
                  </p>
                  
                  {/* Cuisine Badge */}
                  <Badge 
                    className="mb-3 text-xs"
                    data-testid={`badge-cuisine-${experience.cuisine.toLowerCase()}`}
                  >
                    {experience.cuisine}
                  </Badge>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                    {experience.description}
                  </p>
                  
                  {/* Quick Reserve / View Details Button */}
                  <motion.div
                    className="mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      data-testid={`button-reserve-${experience.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {hasSlug ? (
                        <>
                          <ArrowRight className={cn("w-3.5 h-3.5 me-2", isRTL && "rotate-180")} />
                          View Details
                        </>
                      ) : (
                        <>
                          <Phone className="w-3.5 h-3.5 me-2" />
                          Reserve Now
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </Card>
            );
            
            return (
              <motion.div
                key={experience.name}
                onHoverStart={() => setHoveredCard(experience.name)}
                onHoverEnd={() => setHoveredCard(null)}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {hasSlug ? (
                  <Link 
                    href={localePath(`/dining/${experience.slug}`)}
                    className="block"
                    data-testid={`link-dining-${experience.slug}`}
                  >
                    {cardContent}
                  </Link>
                ) : (
                  cardContent
                )}
              </motion.div>
            );
          })}
        </CategoryGrid>
      </Section>

      {/* Cuisine Categories Section */}
      <Section
        id="cuisines"
        title="Explore by Cuisine"
        subtitle="From authentic Arabic flavors to global gastronomy - Dubai serves every palate"
        variant="alternate"
      >
        <div className="flex items-center gap-2 mb-8">
          <Badge className="bg-[hsl(var(--purple))]/10 text-[hsl(var(--purple))] border-[hsl(var(--purple))]/30">
            <Globe className="w-4 h-4 me-2" />
            World Cuisines
          </Badge>
        </div>
        <CategoryGrid columns={4}>
          {cuisineCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={category.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
              >
                <Card 
                  className="group overflow-visible bg-card rounded-[16px] p-0 shadow-[var(--shadow-level-1)] hover-elevate transition-all duration-300"
                  data-testid={`card-cuisine-${category.id}`}
                >
                  <div className="relative aspect-video overflow-hidden rounded-t-[16px]">
                    <img 
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    
                    {/* Cuisine Icon Badge */}
                    <div className={cn("absolute top-3", isRTL ? "right-3" : "left-3")}>
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", category.color)}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </CategoryGrid>
      </Section>

      {/* Dubai Dining Areas Section */}
      <Section
        id="dining-areas"
        title="Dining Districts"
        subtitle="Each neighborhood offers a unique culinary atmosphere and character"
      >
        <div className="flex items-center gap-2 mb-8">
          <Badge className="bg-[hsl(var(--orange))]/10 text-[hsl(var(--orange))] border-[hsl(var(--orange))]/30">
            <MapPin className="w-4 h-4 me-2" />
            Dining Districts
          </Badge>
        </div>
        <CategoryGrid columns={3}>
          {diningAreas.map((area) => (
            <motion.div
              key={area.name}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className="group overflow-visible bg-white dark:bg-card rounded-[16px] p-0 shadow-[var(--shadow-level-1)] hover-elevate transition-all duration-300"
                data-testid={`card-area-${area.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="relative h-52 overflow-hidden rounded-t-[16px]">
                  <img 
                    src={area.image}
                    alt={area.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className={cn("absolute top-4 flex items-center gap-2 flex-wrap", isRTL ? "right-4 left-4" : "left-4 right-4")}>
                    <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0">
                      {area.highlight}
                    </Badge>
                    <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                      {area.restaurants} Venues
                    </Badge>
                  </div>
                  <div className={cn("absolute bottom-4", isRTL ? "right-4 left-4" : "left-4 right-4")}>
                    <h3 className="text-xl font-bold text-white">{area.name}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                    {area.description}
                  </p>
                  <div className="flex items-center text-[hsl(var(--orange))] font-medium text-sm gap-1">
                    Explore restaurants
                    <ArrowRight className={cn("w-4 h-4 transition-transform group-hover:translate-x-1", isRTL && "rotate-180 group-hover:-translate-x-1")} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </CategoryGrid>
      </Section>

      {/* Nightlife & Bar Section with Neon Accents */}
      <section 
        className="relative py-16 overflow-hidden"
        data-testid="section-nightlife"
      >
        {/* Neon Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-purple-900 to-fuchsia-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-500/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 lg:px-[140px]">
          <div className="text-center mb-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-heading text-3xl md:text-4xl font-bold text-white mb-4"
            >
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                After Dark
              </span>
            </motion.h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Dubai's legendary nightlife scene with rooftop bars, lounges, and world-class clubs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Rooftop Bars", count: "40+", desc: "Sky-high cocktails with city views" },
              { name: "Beach Clubs", count: "25+", desc: "Dance by the waves until sunrise" },
              { name: "Speakeasies", count: "15+", desc: "Hidden gems with craft cocktails" },
            ].map((venue, i) => (
              <motion.div
                key={venue.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-center"
                data-testid={`card-nightlife-${venue.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {venue.count}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{venue.name}</h3>
                <p className="text-white/60 text-sm">{venue.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Food Events & Markets Section */}
      <Section
        id="food-events"
        title="Food Events & Markets"
        subtitle="Experience Dubai's vibrant food scene through festivals, markets, and culinary celebrations"
        variant="alternate"
      >
        <div className="flex items-center gap-2 mb-8">
          <Badge className="bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/30">
            <Calendar className="w-4 h-4 me-2" />
            Culinary Events
          </Badge>
        </div>
        <CategoryGrid columns={3}>
          {foodEvents.map((event) => (
            <motion.div
              key={event.name}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className="group overflow-visible bg-white dark:bg-card rounded-[16px] p-0 shadow-[var(--shadow-level-1)] hover-elevate transition-all duration-300"
                data-testid={`card-event-${event.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="relative h-56 overflow-hidden rounded-t-[16px]">
                  <img 
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className={cn("absolute top-4", isRTL ? "right-4" : "left-4")}>
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0">
                      {event.highlight}
                    </Badge>
                  </div>
                  <div className={cn("absolute bottom-4", isRTL ? "right-4 left-4" : "left-4 right-4")}>
                    <h3 className="text-lg font-bold text-white mb-1">{event.name}</h3>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <Calendar className="w-4 h-4" />
                      {event.date}
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </CategoryGrid>
      </Section>

      {/* CTA Section */}
      <Section
        id="cta"
        className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600"
      >
        <div className="text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold text-white mb-4">
              Ready to Feast in Dubai?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              From sky-high dining to underwater adventures - your culinary journey starts now
            </p>
            <div className={cn("flex flex-wrap justify-center gap-4", isRTL && "flex-row-reverse")}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="bg-white text-orange-600 border-white shadow-xl"
                  data-testid="button-make-reservation"
                >
                  <Phone className="w-4 h-4 me-2" />
                  Make a Reservation
                </Button>
              </motion.div>
              <Link href={localePath("/attractions")}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white bg-white/10 backdrop-blur-sm"
                  data-testid="button-explore-attractions"
                >
                  Explore Attractions
                  <ArrowRight className={cn("w-4 h-4 ms-2", isRTL && "rotate-180")} />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </Section>
    </PageContainer>
  );
}
