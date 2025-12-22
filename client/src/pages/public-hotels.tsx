import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, Building2, Waves, Briefcase, Users, Heart,
  Sparkles, Award, Crown, Plane, Palmtree, Building,
  Umbrella, Utensils, Dumbbell, Car, Wifi, Coffee,
  Sun, Moon, TreePalm, Baby, MapPin, TrendingUp
} from "lucide-react";
import { PageContainer, Section, ContentCard, CategoryGrid } from "@/components/public-layout";
import { PublicHero } from "@/components/public-hero";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { cn } from "@/lib/utils";

const hotelCategories = [
  {
    name: "Beach Resorts",
    icon: Waves,
    description: "Wake up to turquoise waters and pristine private beaches",
    hotels: ["Atlantis The Palm", "One&Only The Palm", "Jumeirah Beach Hotel"],
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
  },
  {
    name: "Iconic Landmarks",
    icon: Crown,
    description: "Stay at architectural marvels that define Dubai's skyline",
    hotels: ["Burj Al Arab", "Jumeirah Emirates Towers", "Address Downtown"],
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
  },
  {
    name: "Business Hotels",
    icon: Briefcase,
    description: "World-class facilities for the discerning business traveler",
    hotels: ["JW Marriott Marquis", "Radisson Blu DIFC", "Novotel WTC"],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
  },
  {
    name: "Boutique Hotels",
    icon: Sparkles,
    description: "Intimate experiences with unique character and design",
    hotels: ["XVA Art Hotel", "The Meydan Hotel", "Sofitel The Obelisk"],
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
  },
  {
    name: "Family Resorts",
    icon: Users,
    description: "Adventure and entertainment for the whole family",
    hotels: ["Atlantis Aquaventure", "Jumeirah Creekside", "JA Beach Hotel"],
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop",
  },
  {
    name: "Airport Hotels",
    icon: Plane,
    description: "Convenience and comfort for transit travelers",
    hotels: ["JW Marriott DXB", "Hilton Garden Inn Al Mina", "Le Meridien DXB"],
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
  }
];

const featuredHotels = [
  {
    name: "Atlantis The Palm",
    tagline: "World-Famous Underwater Suites",
    description: "Experience the legendary underwater suites where floor-to-ceiling windows reveal the wonders of the Ambassador Lagoon. Home to one of the world's largest waterparks.",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=900&h=600&fit=crop",
    features: ["Underwater Suites", "Aquaventure Waterpark", "The Lost Chambers"],
    rating: 5,
    area: "Palm Jumeirah",
    vibe: "family"
  },
  {
    name: "Burj Al Arab",
    tagline: "The World's Most Luxurious Hotel",
    description: "The iconic sail-shaped silhouette defines Dubai's skyline. Every suite offers unparalleled luxury with 24-hour butler service and breathtaking Arabian Gulf views.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&h=600&fit=crop",
    features: ["Butler Service", "Helipad", "Private Beach"],
    rating: 7,
    area: "Jumeirah",
    vibe: "romance"
  },
  {
    name: "Address Downtown",
    tagline: "Burj Khalifa at Your Doorstep",
    description: "Wake up to unobstructed views of the world's tallest building. Steps from Dubai Mall and the Dubai Fountain, this is the heart of modern Dubai.",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=900&h=600&fit=crop",
    features: ["Burj Khalifa Views", "Dubai Mall Access", "Rooftop Pool"],
    rating: 5,
    area: "Downtown Dubai",
    vibe: "city"
  },
  {
    name: "One&Only Royal Mirage",
    tagline: "Arabian Palace Experience",
    description: "A palatial retreat set in 65 acres of landscaped gardens. Experience authentic Arabian hospitality amid Moorish architecture and palm-fringed beaches.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&h=600&fit=crop",
    features: ["Private Beach", "Oriental Hammam", "Lush Gardens"],
    rating: 5,
    area: "The Palm",
    vibe: "beach"
  },
  {
    name: "Armani Hotel Dubai",
    tagline: "Designer Luxury by Giorgio Armani",
    description: "The first hotel designed entirely by Giorgio Armani. Located in the iconic Burj Khalifa, every detail reflects the designer's sophisticated aesthetic.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&h=600&fit=crop",
    features: ["Armani Design", "Burj Khalifa Location", "Fine Dining"],
    rating: 5,
    area: "Downtown Dubai",
    vibe: "city"
  },
  {
    name: "Four Seasons Jumeirah",
    tagline: "Beach Resort Luxury",
    description: "A modern beachfront sanctuary with panoramic views of the Arabian Gulf. Impeccable service meets contemporary elegance on Jumeirah Beach.",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&h=600&fit=crop",
    features: ["Private Beach", "Infinity Pool", "Award-Winning Spa"],
    rating: 5,
    area: "Jumeirah Beach",
    vibe: "romance"
  }
];

const dubaiAreas = [
  {
    name: "Palm Jumeirah",
    description: "The world's largest man-made island, home to exclusive beach resorts and underwater attractions",
    type: "Beach Resorts",
    icon: Palmtree,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop",
    hotels: "50+ luxury properties"
  },
  {
    name: "Downtown Dubai",
    description: "The heart of modern Dubai with Burj Khalifa, Dubai Mall, and the famous Dubai Fountain",
    type: "Burj Khalifa Area",
    icon: Building,
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&h=400&fit=crop",
    hotels: "80+ premium hotels"
  },
  {
    name: "Dubai Marina",
    description: "Vibrant waterfront living with stunning yacht views and buzzing nightlife scene",
    type: "Vibrant Nightlife",
    icon: Waves,
    image: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600&h=400&fit=crop",
    hotels: "60+ hotels"
  },
  {
    name: "Jumeirah Beach",
    description: "Classic beachfront luxury with pristine sands and iconic landmarks",
    type: "Classic Beachfront",
    icon: Umbrella,
    image: "https://images.unsplash.com/photo-1597659840241-37e2b9c2f55f?w=600&h=400&fit=crop",
    hotels: "40+ beach hotels"
  },
  {
    name: "Business Bay",
    description: "Dubai's business district with modern towers and waterfront canal views",
    type: "Business Travelers",
    icon: Briefcase,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop",
    hotels: "70+ business hotels"
  },
  {
    name: "Creek & Deira",
    description: "Experience old Dubai charm with heritage hotels and traditional souks",
    type: "Heritage Area",
    icon: Award,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop",
    hotels: "100+ hotels"
  }
];

const amenities = [
  { icon: Umbrella, name: "Private Beaches", description: "Exclusive beach access" },
  { icon: Waves, name: "Infinity Pools", description: "Stunning rooftop views" },
  { icon: Sparkles, name: "Spa Services", description: "World-class wellness" },
  { icon: Utensils, name: "Fine Dining", description: "Michelin-starred restaurants" },
  { icon: Waves, name: "Waterparks", description: "Family entertainment" },
  { icon: Dumbbell, name: "Fitness Centers", description: "State-of-the-art gyms" },
  { icon: Car, name: "Valet Parking", description: "Luxury vehicle service" },
  { icon: Wifi, name: "High-Speed WiFi", description: "Seamless connectivity" }
];

const vibeOptions = [
  { 
    id: "beach", 
    label: "Beach Life", 
    icon: Sun,
    gradient: "from-cyan-400 to-blue-500",
    glowColor: "shadow-cyan-400/50",
    description: "Sun, sand & luxury"
  },
  { 
    id: "city", 
    label: "City Views", 
    icon: Building2,
    gradient: "from-travi-purple to-indigo-600",
    glowColor: "shadow-travi-purple/50",
    description: "Skyline panoramas"
  },
  { 
    id: "romance", 
    label: "Romance", 
    icon: Heart,
    gradient: "from-travi-pink to-rose-500",
    glowColor: "shadow-travi-pink/50",
    description: "Intimate escapes"
  },
  { 
    id: "family", 
    label: "Family Fun", 
    icon: Users,
    gradient: "from-travi-orange to-amber-500",
    glowColor: "shadow-travi-orange/50",
    description: "Adventure awaits"
  }
];

const trendingDeals = [
  "Atlantis Royal - 30% Off Weekend Stays",
  "Burj Al Arab - Complimentary Spa Package",
  "Address Downtown - Free Dubai Mall Credit",
  "One&Only - Private Beach Cabana Included",
  "Four Seasons - Kids Stay Free This Winter",
  "Armani Hotel - Exclusive Dining Experience"
];

function FloatingSparkle({ delay = 0, size = "w-2 h-2", position }: { delay?: number; size?: string; position: string }) {
  return (
    <motion.div
      className={cn("absolute", position)}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 1, 0],
        scale: [0.5, 1.2, 0.5],
        rotate: [0, 180, 360]
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Star className={cn(size, "text-travi-orange fill-travi-orange")} />
    </motion.div>
  );
}

function FloatingStar({ delay = 0, position }: { delay?: number; position: string }) {
  return (
    <motion.div
      className={cn("absolute", position)}
      animate={{ 
        y: [0, -15, 0],
        opacity: [0.3, 0.8, 0.3]
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <Sparkles className="w-4 h-4 text-travi-pink" />
    </motion.div>
  );
}

function TrendingMarquee() {
  const { isRTL } = useLocale();
  
  return (
    <div 
      className="relative overflow-hidden bg-gradient-to-r from-travi-purple via-travi-pink to-travi-purple py-3"
      data-testid="trending-marquee"
    >
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{
          x: isRTL ? ["0%", "50%"] : ["0%", "-50%"]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {[...trendingDeals, ...trendingDeals].map((deal, idx) => (
          <div key={idx} className="flex items-center gap-3 text-white">
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium text-sm">{deal}</span>
            <Star className="w-3 h-3 fill-travi-orange text-travi-orange" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function VibeSelector({ selectedVibe, onSelectVibe }: { selectedVibe: string | null; onSelectVibe: (vibe: string) => void }) {
  const { isRTL } = useLocale();
  
  return (
    <section 
      className="relative py-16 overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background"
      data-testid="vibe-selector-section"
    >
      <FloatingSparkle delay={0} position="top-8 left-[10%]" />
      <FloatingSparkle delay={1} position="top-16 right-[15%]" size="w-3 h-3" />
      <FloatingStar delay={0.5} position="bottom-12 left-[20%]" />
      <FloatingStar delay={1.5} position="top-24 right-[25%]" />
      <FloatingSparkle delay={2} position="bottom-20 right-[10%]" />
      
      <div className="max-w-7xl mx-auto px-5 md:px-8 lg:px-[140px]">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 bg-gradient-to-r from-travi-purple to-travi-pink text-white border-0">
            <Sparkles className="w-3 h-3 mr-1" />
            Find Your Perfect Stay
          </Badge>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Choose Your <span className="bg-gradient-to-r from-travi-purple to-travi-pink bg-clip-text text-transparent">Vibe</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            What kind of Dubai hotel experience are you dreaming of?
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {vibeOptions.map((vibe, idx) => {
            const Icon = vibe.icon;
            const isSelected = selectedVibe === vibe.id;
            
            return (
              <motion.button
                key={vibe.id}
                data-testid={`vibe-button-${vibe.id}`}
                onClick={() => onSelectVibe(vibe.id)}
                className={cn(
                  "relative group p-6 md:p-8 rounded-[20px] text-center transition-all duration-300",
                  "border-2",
                  isSelected 
                    ? `bg-gradient-to-br ${vibe.gradient} border-transparent shadow-xl ${vibe.glowColor}`
                    : "bg-card border-border/50 hover:border-travi-purple/50"
                )}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-[20px] bg-white/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                
                <motion.div 
                  className={cn(
                    "w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300",
                    isSelected 
                      ? "bg-white/20" 
                      : `bg-gradient-to-br ${vibe.gradient}`
                  )}
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className={cn(
                    "w-8 h-8 md:w-10 md:h-10",
                    isSelected ? "text-white" : "text-white"
                  )} />
                </motion.div>
                
                <h3 className={cn(
                  "font-heading font-bold text-lg md:text-xl mb-1",
                  isSelected ? "text-white" : "text-foreground"
                )}>
                  {vibe.label}
                </h3>
                <p className={cn(
                  "text-sm",
                  isSelected ? "text-white/80" : "text-muted-foreground"
                )}>
                  {vibe.description}
                </p>
                
                {isSelected && (
                  <motion.div 
                    className="absolute -top-2 -right-2"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Star className="w-4 h-4 fill-travi-orange text-travi-orange" />
                    </div>
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

function FloatingHotelPreviews() {
  const previewHotels = featuredHotels.slice(0, 3);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {previewHotels.map((hotel, idx) => {
        const positions = [
          { left: "5%", top: "20%", rotate: -8 },
          { right: "5%", top: "30%", rotate: 6 },
          { left: "10%", bottom: "15%", rotate: -4 }
        ];
        const pos = positions[idx];
        
        return (
          <motion.div
            key={hotel.name}
            className="absolute hidden lg:block"
            style={{ 
              left: pos.left, 
              right: pos.right, 
              top: pos.top, 
              bottom: pos.bottom 
            }}
            initial={{ opacity: 0, y: 50, rotate: pos.rotate }}
            animate={{ 
              opacity: 0.9,
              y: [0, -10, 0],
              rotate: pos.rotate
            }}
            transition={{ 
              opacity: { duration: 1, delay: idx * 0.3 },
              y: { duration: 4, repeat: Infinity, delay: idx * 0.5 }
            }}
          >
            <div className="w-32 h-24 rounded-xl overflow-hidden shadow-xl border-2 border-white/20 backdrop-blur-sm">
              <img 
                src={hotel.image} 
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function CategoryCard({ category }: { category: typeof hotelCategories[0] }) {
  const IconComponent = category.icon;
  const { isRTL } = useLocale();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
    >
      <Card 
        className="group overflow-visible bg-card rounded-[16px] shadow-[var(--shadow-level-1)] hover:shadow-xl transition-all duration-300"
        data-testid={`card-category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-[16px]">
          <motion.img 
            src={category.image} 
            alt={category.name}
            className="w-full h-full object-cover"
            loading="lazy"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          <motion.div 
            className={cn(
              "absolute top-4 w-12 h-12 rounded-xl bg-gradient-to-br from-travi-purple to-travi-pink flex items-center justify-center shadow-lg",
              isRTL ? "right-4" : "left-4"
            )}
            whileHover={{ rotate: 12, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <IconComponent className="w-6 h-6 text-white" />
          </motion.div>
          
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="font-heading font-bold text-white text-xl mb-2">{category.name}</h3>
            <p className="text-white/80 text-sm line-clamp-2">{category.description}</p>
          </div>
        </div>
        
        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            {category.hotels.map((hotel, idx) => (
              <Badge 
                key={idx} 
                variant="secondary" 
                className="text-xs"
              >
                {hotel}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function ShimmerBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Badge className="relative bg-gradient-to-r from-travi-purple to-travi-pink text-white border-0 px-4 py-1.5">
        {children}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />
      </Badge>
    </div>
  );
}

function FeaturedHotelCard({ hotel, index, isVisible }: { hotel: typeof featuredHotels[0]; index: number; isVisible: boolean }) {
  const { isRTL } = useLocale();
  const isReversed = index % 2 === 1;
  
  return (
    <motion.div 
      className={cn(
        "flex flex-col gap-8 lg:gap-12 items-center",
        isReversed ? "lg:flex-row-reverse" : "lg:flex-row"
      )}
      data-testid={`card-featured-hotel-${hotel.name.toLowerCase().replace(/\s+/g, '-')}`}
      initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      <div className="w-full lg:w-1/2">
        <motion.div 
          className="relative overflow-hidden rounded-[20px] shadow-xl group"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative overflow-hidden">
            <motion.img 
              src={hotel.image} 
              alt={hotel.name}
              className="w-full aspect-[4/3] object-cover"
              loading="lazy"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.8 }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className={cn("absolute top-4", isRTL ? "left-4" : "right-4")}>
            <ShimmerBadge>
              <Sparkles className="w-3 h-3 mr-1 inline" />
              Signature Experience
            </ShimmerBadge>
          </div>
          
          <div className={cn("absolute top-4", isRTL ? "right-4" : "left-4")}>
            <Badge className="bg-white/90 text-foreground backdrop-blur-sm border-0 gap-1">
              <Star className="w-3 h-3 fill-travi-orange text-travi-orange" />
              {hotel.rating === 7 ? "7-Star" : `${hotel.rating}-Star`}
            </Badge>
          </div>
          
          <div className={cn("absolute bottom-4", isRTL ? "right-4" : "left-4")}>
            <Badge className="bg-travi-purple text-white border-0">
              <MapPin className="w-3 h-3 mr-1" />
              {hotel.area}
            </Badge>
          </div>
        </motion.div>
      </div>
      
      <div className="w-full lg:w-1/2 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-travi-purple to-travi-pink font-semibold text-sm uppercase tracking-wide mb-2">
            {hotel.tagline}
          </p>
          <h3 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">{hotel.name}</h3>
          <p className="text-muted-foreground text-lg leading-relaxed">{hotel.description}</p>
        </motion.div>
        
        <motion.div 
          className="flex flex-wrap gap-3 pt-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {hotel.features.map((feature, idx) => (
            <motion.div 
              key={idx}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-muted to-muted/50 rounded-full border border-border/50"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Sparkles className="w-4 h-4 text-travi-pink" />
              <span className="text-sm font-medium text-foreground">{feature}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

function AreaCard({ area }: { area: typeof dubaiAreas[0] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4 }}
    >
      <ContentCard
        image={area.image}
        title={area.name}
        description={area.description}
        badge={area.type}
        badgeVariant="secondary"
        aspectRatio="portrait"
        showGradientOverlay={true}
      />
    </motion.div>
  );
}

export default function PublicHotels() {
  const [selectedVibe, setSelectedVibe] = useState<string | null>(null);
  const { isRTL } = useLocale();
  
  useDocumentMeta({
    title: "Luxury Hotels in Dubai | From Palm Jumeirah to Downtown | Travi",
    description: "Discover Dubai's finest hotels. From Palm Jumeirah beachfront resorts to Downtown high-rises overlooking Burj Khalifa. 5-star luxury, world-class service.",
    ogTitle: "Luxury Hotels in Dubai | Travi",
    ogDescription: "From Palm Jumeirah beachfront resorts to Downtown high-rises overlooking Burj Khalifa. Find your perfect Dubai hotel.",
    ogType: "website",
  });

  const filteredHotels = selectedVibe 
    ? featuredHotels.filter(h => h.vibe === selectedVibe)
    : featuredHotels;

  return (
    <PageContainer navVariant="transparent">
      <div className="relative">
        <PublicHero
          title="Dubai Hotels"
          subtitle="From iconic landmarks to beachfront resorts, find your perfect stay"
          backgroundImage="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop"
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Hotels" }
          ]}
          size="large"
        />
        <FloatingHotelPreviews />
      </div>

      <TrendingMarquee />

      <VibeSelector selectedVibe={selectedVibe} onSelectVibe={setSelectedVibe} />

      <Section
        id="categories"
        title="Find Your Perfect Stay"
        subtitle="Dubai offers an unparalleled selection of hotels for every type of traveler"
        variant="alternate"
      >
        <CategoryGrid columns={3}>
          {hotelCategories.map((category, idx) => (
            <CategoryCard key={idx} category={category} />
          ))}
        </CategoryGrid>
      </Section>

      <Section
        id="featured"
        className="relative overflow-hidden"
      >
        <FloatingSparkle delay={0} position="top-20 left-[5%]" size="w-3 h-3" />
        <FloatingStar delay={1} position="top-40 right-[8%]" />
        <FloatingSparkle delay={2} position="bottom-32 left-[12%]" />
        <FloatingStar delay={0.5} position="bottom-48 right-[15%]" />
        
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4 bg-gradient-to-r from-travi-orange to-travi-pink text-white border-0">
            <Crown className="w-3 h-3 mr-1" />
            Editor's Choice
          </Badge>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Dubai's <span className="bg-gradient-to-r from-travi-purple to-travi-pink bg-clip-text text-transparent">Finest</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Iconic properties that define luxury hospitality
            {selectedVibe && (
              <span className="block mt-2 text-travi-purple font-medium">
                Showing {vibeOptions.find(v => v.id === selectedVibe)?.label} hotels
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="ml-2 text-muted-foreground"
                  onClick={() => setSelectedVibe(null)}
                  data-testid="button-clear-vibe-filter"
                >
                  Clear filter
                </Button>
              </span>
            )}
          </p>
        </motion.div>
        
        <div className="space-y-16 lg:space-y-24">
          <AnimatePresence mode="wait">
            {filteredHotels.map((hotel, idx) => (
              <FeaturedHotelCard key={hotel.name} hotel={hotel} index={idx} isVisible={true} />
            ))}
          </AnimatePresence>
        </div>
      </Section>

      <Section
        id="areas"
        title="Dubai Areas for Hotels"
        subtitle="Each district offers a unique Dubai experience"
        variant="alternate"
      >
        <CategoryGrid columns={3}>
          {dubaiAreas.map((area, idx) => (
            <AreaCard key={idx} area={area} />
          ))}
        </CategoryGrid>
      </Section>

      <Section id="amenities" className="bg-gradient-to-br from-travi-purple via-travi-purple to-travi-pink relative overflow-hidden">
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-48 h-48 bg-travi-pink/20 rounded-full blur-2xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        
        <div className="text-center mb-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-white/20 text-white border-0 backdrop-blur-sm">
              <Sparkles className="w-3 h-3 mr-1" />
              World-Class Standards
            </Badge>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              World-Class Amenities
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Dubai's luxury hotels offer amenities that redefine hospitality
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative">
          {amenities.map((amenity, idx) => {
            const IconComponent = amenity.icon;
            return (
              <motion.div 
                key={idx}
                className="bg-white/10 backdrop-blur-sm rounded-[16px] p-6 text-center border border-white/20 group"
                data-testid={`amenity-${amenity.name.toLowerCase().replace(/\s+/g, '-')}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
              >
                <motion.div 
                  className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-colors"
                  whileHover={{ rotate: 12 }}
                >
                  <IconComponent className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="font-heading font-bold text-white mb-1">{amenity.name}</h3>
                <p className="text-white/70 text-sm">{amenity.description}</p>
              </motion.div>
            );
          })}
        </div>
      </Section>

      <Section id="cta" className="relative overflow-hidden">
        <FloatingSparkle delay={0} position="top-8 left-[15%]" size="w-4 h-4" />
        <FloatingStar delay={1.5} position="bottom-16 right-[20%]" />
        
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className="w-64 h-64 bg-gradient-to-br from-travi-purple/20 to-travi-pink/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>
            <div className="relative">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Crown className="w-16 h-16 mx-auto text-travi-orange mb-6" />
              </motion.div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                Experience <span className="bg-gradient-to-r from-travi-purple to-travi-pink bg-clip-text text-transparent">Dubai Luxury</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                From the world's only 7-star hotel to intimate boutique retreats, 
                Dubai offers hospitality experiences found nowhere else on Earth.
              </p>
              <motion.div 
                className="flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Badge className="px-6 py-3 text-base" variant="secondary">
                  <Star className="w-4 h-4 mr-2 text-travi-orange" />
                  500+ Luxury Hotels
                </Badge>
                <Badge className="px-6 py-3 text-base" variant="secondary">
                  <Heart className="w-4 h-4 mr-2 text-travi-pink" />
                  World-Renowned Service
                </Badge>
                <Badge className="px-6 py-3 text-base" variant="secondary">
                  <Coffee className="w-4 h-4 mr-2 text-travi-orange" />
                  Michelin-Star Dining
                </Badge>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Section>
    </PageContainer>
  );
}
