import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  MapPin, Building2, Star, ArrowRight, Clock, Users, Camera, 
  Utensils, Bed, ShoppingBag, Train, Car, Ship, Sparkles,
  ChevronDown, Check, X, Sun, Sunset, Thermometer,
  Phone, Shield, CreditCard, Droplets, Baby, Gem,
  Calendar, Heart, Map, Navigation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const subDistricts = [
  { name: "Deira", side: "north", vibe: "Bustling commercial heart, dense souks", famous: "Gold Souk, Spice Souk, Perfume Souk" },
  { name: "Gold Souk District", side: "north", vibe: "Glittering corridors of gold", famous: "10+ tonnes of gold on display" },
  { name: "Spice Souk", side: "north", vibe: "Aromatic, colorful, traditional", famous: "Saffron, frankincense, spices" },
  { name: "Al Ras", side: "north", vibe: "Old Deira's waterfront", famous: "Heritage buildings, textile shops" },
  { name: "Al Fahidi", side: "south", vibe: "1890s preserved heritage quarter", famous: "Wind-tower architecture, galleries" },
  { name: "Al Shindagha", side: "south", vibe: "Heritage waterfront", famous: "8+ museums, Creek views" },
  { name: "Bur Dubai Souk", side: "south", vibe: "Covered arcaded souk", famous: "Fabrics, textiles, pashminas" },
  { name: "Textile Souk", side: "south", vibe: "Traditional covered market", famous: "300+ shops, fabrics, tailoring" },
  { name: "Meena Bazaar", side: "south", vibe: "Indian shopping district", famous: "Gold, textiles, wedding outfits" },
  { name: "Al Satwa", side: "south", vibe: "Authentic Arab food quarter", famous: "Ravi Restaurant, Al Mallah, karak" },
  { name: "Al Seef", side: "south", vibe: "Heritage meets modern", famous: "1.8km waterfront, 50+ restaurants" },
  { name: "Al Karama", side: "south", vibe: "Budget shopping & food haven", famous: "200+ restaurants, textiles" },
  { name: "Oud Metha", side: "south", vibe: "Mixed residential/commercial", famous: "Wafi Mall, Dubai Frame nearby" },
  { name: "Dubai Creek", side: "waterway", vibe: "Historic trading route", famous: "AED 1 abra rides, dhow cruises" }
];

const attractions = [
  {
    id: "gold-souk",
    name: "Gold Souk",
    tagline: "World's Largest Gold Market",
    description: "300+ retailers with 10 tonnes of gold on display. Tax-free prices, bargaining expected. Start at 70% of asking price.",
    duration: "1-2 hours",
    bestTime: "Evening 5-10pm",
    priceRange: "Window shopping free",
    mustSee: true,
    tips: ["Check daily gold rates before shopping", "Bring cash for better deals", "Best value: 22K or 24K gold"]
  },
  {
    id: "al-fahidi",
    name: "Al Fahidi Historical District",
    tagline: "Preserved 1890s Heritage Quarter",
    description: "50+ restored wind-tower buildings, art galleries, museums, and traditional cafes. Dubai's most photogenic neighborhood.",
    duration: "1.5-2 hours",
    bestTime: "Early morning or late afternoon",
    priceRange: "Free entry",
    mustSee: true,
    tips: ["Visit Coffee Museum", "Try Arabian Tea House", "Walk at sunset for magical photos"]
  },
  {
    id: "abra-ride",
    name: "Dubai Creek Abra Ride",
    tagline: "Most Authentic Dubai Experience",
    description: "Traditional wooden water taxi crossing Dubai Creek for just AED 1. Best value experience in all of Dubai!",
    duration: "5-10 minutes",
    bestTime: "Sunset (5:30-6:30pm)",
    priceRange: "AED 1",
    mustSee: true,
    tips: ["Leaves when full (usually quick)", "Private charter AED 120/hour", "Golden hour for photos"]
  },
  {
    id: "spice-souk",
    name: "Spice Souk",
    tagline: "Sensory Overload Experience",
    description: "Traditional market selling saffron, frankincense, dried fruits, nuts, and herbs from Iran, India, and Arabia.",
    duration: "30 mins",
    bestTime: "Morning 9am-12pm",
    priceRange: "Varies",
    mustSee: true,
    tips: ["Iranian saffron is best quality", "Bargain (60-70% of asking)", "Buy in bulk for discounts"]
  },
  {
    id: "al-shindagha",
    name: "Al Shindagha Heritage District",
    tagline: "Complete Pre-Oil Dubai Experience",
    description: "Fully restored heritage district with 8+ museums: Dubai Museum, Perfume House, Historical Documents, Pearl Diving, Poetry House, Traditional Architecture, Camel Museum. Walking paths along Creek waterfront.",
    duration: "Half day (4-5 hours)",
    bestTime: "Morning 9am-12pm",
    priceRange: "Most museums free, some AED 5-10",
    mustSee: true,
    tips: ["Start at Dubai Museum (Al Fahidi Fort)", "Pearl Diving Museum is a hidden gem", "Perfume House offers workshops"]
  },
  {
    id: "dhow-cruise",
    name: "Dubai Creek Dhow Cruise",
    tagline: "Romantic Evening Experience",
    description: "Traditional wooden dhow boat dinner cruise with buffet, live entertainment, and Creek sightseeing.",
    duration: "2 hours",
    bestTime: "Evening 8-10pm",
    priceRange: "AED 75-150",
    mustSee: false,
    tips: ["Book online for best rates", "Dress smart casual", "Great for couples"]
  },
  {
    id: "al-seef",
    name: "Al Seef Waterfront",
    tagline: "Heritage Meets Modern",
    description: "1.8 km waterfront promenade by Meraas, combining restored 1950s architecture with modern dining. 50+ restaurants, Creek views, abra access.",
    duration: "2-3 hours",
    bestTime: "Sunset 6-11pm",
    priceRange: "Free entry, dining AED 40-100",
    mustSee: true,
    tips: ["Walk full promenade (heritage to modern)", "Book waterfront tables ahead", "Visit at sunset for photos"]
  },
  {
    id: "textile-souk",
    name: "Textile Souk (Fabric Souk)",
    tagline: "Dubai's Oldest Traditional Market",
    description: "300+ shops in covered alleys operating since 1960s. Floor-to-ceiling fabric rolls   silk, cotton, linen from India, Pakistan, China. Custom tailoring 24-48 hours.",
    duration: "1-2 hours",
    bestTime: "Morning or evening",
    priceRange: "Fabrics AED 15-120/meter",
    mustSee: false,
    tips: ["Compare prices across 4-5 shops", "Negotiate (expect 20-30% off)", "Great for wedding outfits"]
  },
  {
    id: "meena-bazaar",
    name: "Meena Bazaar",
    tagline: "Indian Shopping Heart",
    description: "200+ shops near Al Fahidi Metro. Historic Indian district since 1970s   gold jewelry (22K), textiles, saris, wedding outfits, spices.",
    duration: "1-2 hours",
    bestTime: "Weekday mornings",
    priceRange: "Varies widely",
    mustSee: false,
    tips: ["Bring cash (many shops card-free)", "Negotiate gold labor charges", "Best for wedding shopping"]
  }
];

const hotels = [
  { name: "XVA Art Hotel", category: "Heritage Boutique", location: "Al Fahidi", highlight: "Wind-tower house, art gallery on-site", priceRange: "AED 600+" },
  { name: "Orient Guest House", category: "Heritage Boutique", location: "Al Fahidi", highlight: "Intimate 8-room heritage stay", priceRange: "AED 500+" },
  { name: "Sheraton Dubai Creek", category: "Classic Luxury", location: "Bur Dubai", highlight: "Creek views, established luxury", priceRange: "AED 450+" },
  { name: "Radisson Blu Deira Creek", category: "Upper Mid-Range", location: "Deira", highlight: "Rooftop pool, excellent location", priceRange: "AED 350+" },
  { name: "Golden Sands Hotel Apartments", category: "Budget-Friendly", location: "Bur Dubai", highlight: "Spacious, great value", priceRange: "AED 200+" }
];

const restaurants = [
  { name: "Arabian Tea House", cuisine: "Emirati", location: "Al Fahidi", specialty: "Traditional breakfast, balaleet", price: "AED 60-100" },
  { name: "Local House Restaurant", cuisine: "Emirati", location: "Al Fahidi", specialty: "Harees, machboos, luqaimat", price: "AED 70-120" },
  { name: "Ravi Restaurant", cuisine: "Pakistani", location: "Al Satwa", specialty: "Mutton karahi, dal (Est. 1978, 24/7)", price: "AED 12-25" },
  { name: "Al Mallah", cuisine: "Lebanese", location: "Al Satwa", specialty: "Legendary shawarma, juices (until 3am)", price: "AED 10-25" },
  { name: "Zaroob", cuisine: "Emirati", location: "Al Satwa", specialty: "Regag bread, machboos, luqaimat", price: "AED 20-40" },
  { name: "Shabestan", cuisine: "Persian", location: "Radisson Blu Deira", specialty: "Kebabs, saffron rice", price: "AED 150-250" },
  { name: "Saravana Bhavan", cuisine: "South Indian", location: "Al Karama", specialty: "Dosas, idli, thalis", price: "AED 30-50" },
  { name: "Logma", cuisine: "Modern Emirati", location: "Al Seef", specialty: "Contemporary Emirati dishes", price: "AED 40-80" },
  { name: "Al Fanar", cuisine: "Traditional Emirati", location: "Al Seef", specialty: "Heritage setting, regag", price: "AED 50-90" }
];

const souks = [
  { name: "Gold Souk", specialty: "Gold jewelry, diamonds (22K/24K)", bestTime: "Evening 5-10pm", bargain: true },
  { name: "Spice Souk", specialty: "Saffron, frankincense, dried fruits", bestTime: "Morning 9am-12pm", bargain: true },
  { name: "Perfume Souk", specialty: "Oud, attar, Arabic perfumes", bestTime: "Afternoon", bargain: true },
  { name: "Textile Souk", specialty: "300+ shops, fabrics from AED 15/m, tailoring", bestTime: "Anytime", bargain: true },
  { name: "Meena Bazaar", specialty: "Indian gold, saris, wedding outfits, 200+ shops", bestTime: "Weekday mornings", bargain: true },
  { name: "Bur Dubai Souk", specialty: "Textiles, clothes, souvenirs", bestTime: "Morning", bargain: true }
];

const faqs = [
  {
    question: "Is Old Dubai worth visiting?",
    answer: "Absolutely. If you want authentic Arabian culture, Old Dubai is essential. It's the only part of Dubai that feels genuinely Middle Eastern with traditional souks, heritage sites, and local atmosphere."
  },
  {
    question: "How much time do I need for Old Dubai?",
    answer: "Quick visit: 3-4 hours (Gold Souk + Spice Souk + abra ride). Half day: 5-6 hours (add Al Fahidi + museums). Full day: 8+ hours for complete experience including dhow cruise."
  },
  {
    question: "Can I bargain in the souks?",
    answer: "Yes! Bargaining is expected and part of the cultural experience. Start at 60-70% of asking price. Be respectful and use the walk-away tactic if needed."
  },
  {
    question: "Is the gold in Gold Souk real?",
    answer: "Yes, all gold must be hallmarked showing purity (18K, 22K, 24K). Dubai has strict regulations. Always check hallmarks and ask for receipts with weight and purity."
  },
  {
    question: "Is Old Dubai safe?",
    answer: "Very safe. Dubai has one of the lowest crime rates globally. Old Dubai is densely populated, well-policed, and safe day/night. Standard precautions apply."
  },
  {
    question: "How far is Old Dubai from Dubai Marina?",
    answer: "Approximately 20km (30-40 minutes). By Metro: 45-50 minutes. By taxi: 30-35 minutes costing AED 40-60."
  }
];

const quickNavItems = [
  { id: "overview", label: "Overview", icon: Map },
  { id: "sub-districts", label: "Sub-Districts", icon: Building2 },
  { id: "attractions", label: "Attractions", icon: Star },
  { id: "souks", label: "Souks", icon: ShoppingBag },
  { id: "hotels", label: "Hotels", icon: Bed },
  { id: "dining", label: "Dining", icon: Utensils },
  { id: "transport", label: "Transport", icon: Train },
  { id: "tips", label: "Tips", icon: Sparkles }
];

function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1512632578888-169f5c4c1e50?w=1920&h=1080&fit=crop"
          alt="Old Dubai Gold Souk"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/70 via-amber-800/60 to-amber-900/80" />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="flex items-center justify-center gap-2 mb-6">
            <Badge className="bg-amber-500/30 text-white border-amber-400/50 backdrop-blur-sm px-4 py-2">
              <Gem className="w-4 h-4 mr-2" />
              Dubai's Authentic Heart
            </Badge>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Old Dubai
            <span className="block text-3xl md:text-4xl font-normal text-amber-200 mt-2">
              Heritage District Guide 2026
            </span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            Where it all began. Gold Souk, Spice Souk, Al Fahidi, Dubai Creek   
            10+ historic neighborhoods, AED 1 abra rides, and the soul of Dubai.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              Half-Day to Full Day
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <Ship className="w-4 h-4 mr-2" />
              AED 1 Abra Ride
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <Gem className="w-4 h-4 mr-2" />
              World's Largest Gold Market
            </Badge>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-amber-500 hover:bg-amber-600 text-white gap-2 text-lg px-8"
              data-testid="button-explore-old-dubai"
              onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Old Dubai <ArrowRight className="w-5 h-5" />
            </Button>
            <Link href="/districts">
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 gap-2" data-testid="button-all-districts-old">
                All Districts
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown className="w-8 h-8 text-white/70" />
      </motion.div>
    </section>
  );
}

function QuickNavSection() {
  return (
    <nav className="sticky top-0 z-[100] bg-background/95 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-hide">
          {quickNavItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 whitespace-nowrap text-muted-foreground hover:text-amber-600"
              onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
              data-testid={`nav-${item.id}`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function OverviewSection() {
  return (
    <section id="overview" className="py-20 bg-gradient-to-b from-amber-50 to-background dark:from-amber-950/20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 mb-4">
              The Soul of Dubai
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Where It All Began</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Before Burj Khalifa and Palm Jumeirah, there was Dubai Creek   a natural inlet 
              that transformed a fishing village into a trading empire.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Building2, label: "10+ Neighborhoods", desc: "Deira, Bur Dubai & more" },
              { icon: Gem, label: "300+ Gold Shops", desc: "10 tonnes on display" },
              { icon: Ship, label: "AED 1 Abra Ride", desc: "Best value in Dubai" },
              { icon: Calendar, label: "Pre-1960s History", desc: "Authentic heritage" }
            ].map((stat, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="text-center p-6 hover-elevate">
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-amber-600" />
                  <h3 className="text-2xl font-bold mb-2">{stat.label}</h3>
                  <p className="text-muted-foreground">{stat.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="mt-12 grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" /> What Makes Old Dubai Special
              </h3>
              <ul className="space-y-3">
                {[
                  "Dubai's oldest neighborhoods (pre-1960s)",
                  "Authentic Arabian culture and heritage",
                  "World's largest Gold Souk",
                  "Traditional abra rides for AED 1",
                  "Al Fahidi Historical District (1890s)",
                  "Real local life   not tourist artifice",
                  "Budget-friendly dining and shopping"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <X className="w-5 h-5 text-red-600" /> Old Dubai vs. New Dubai
              </h3>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  If Downtown Dubai is glass and steel, Old Dubai is wind towers and wooden dhows. 
                  If Marina is for tourists, Old Dubai is where Emiratis remember.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                    <strong>Old Dubai</strong>
                    <p className="text-muted-foreground">Souks, heritage, culture</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg">
                    <strong>New Dubai</strong>
                    <p className="text-muted-foreground">Towers, malls, luxury</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function SubDistrictsSection() {
  return (
    <section id="sub-districts" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">10 Sub-Districts to Explore</h2>
            <p className="text-xl text-muted-foreground">Old Dubai spans both sides of the Creek</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-amber-600 mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5" /> North Side (Deira)
              </h3>
              <div className="space-y-3">
                {subDistricts.filter(d => d.side === "north").map((district, idx) => (
                  <Card key={idx} className="p-4 hover-elevate">
                    <h4 className="font-bold">{district.name}</h4>
                    <p className="text-sm text-muted-foreground">{district.vibe}</p>
                    <p className="text-sm text-amber-600 mt-1">{district.famous}</p>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-amber-600 mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5 rotate-180" /> South Side (Bur Dubai)
              </h3>
              <div className="space-y-3">
                {subDistricts.filter(d => d.side === "south").map((district, idx) => (
                  <Card key={idx} className="p-4 hover-elevate">
                    <h4 className="font-bold">{district.name}</h4>
                    <p className="text-sm text-muted-foreground">{district.vibe}</p>
                    <p className="text-sm text-amber-600 mt-1">{district.famous}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <motion.div variants={fadeInUp} className="mt-8">
            <Card className="p-6 bg-gradient-to-r from-amber-100 to-amber-50 dark:from-amber-950/30 dark:to-amber-900/20 border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-4">
                <Ship className="w-12 h-12 text-amber-600" />
                <div>
                  <h4 className="font-bold text-lg">Dubai Creek   The Waterway</h4>
                  <p className="text-muted-foreground">14km historic trading route connecting Deira and Bur Dubai. AED 1 abra rides, dhow cruises, and waterfront promenades.</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function AttractionsSection() {
  return (
    <section id="attractions" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 mb-4">Must-Do Experiences</Badge>
            <h2 className="text-4xl font-bold mb-4">Top Attractions</h2>
            <p className="text-xl text-muted-foreground">Authentic experiences you won't find in New Dubai</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map((attraction, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="h-full overflow-hidden hover-elevate">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold">{attraction.name}</h3>
                        <p className="text-amber-600 text-sm">{attraction.tagline}</p>
                      </div>
                      {attraction.mustSee && (
                        <Badge className="bg-amber-500 text-white">Must-See</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-4">{attraction.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>{attraction.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4 text-amber-600" />
                        <span>Best: {attraction.bestTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-amber-600" />
                        <span>{attraction.priceRange}</span>
                      </div>
                    </div>
                    {attraction.tips.length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-muted-foreground font-medium mb-2">Tips:</p>
                        <ul className="text-xs space-y-1">
                          {attraction.tips.slice(0, 2).map((tip, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <Sparkles className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SouksSection() {
  return (
    <section id="souks" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 mb-4">Traditional Markets</Badge>
            <h2 className="text-4xl font-bold mb-4">The Famous Souks</h2>
            <p className="text-xl text-muted-foreground">Where bargaining is an art form</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {souks.map((souk, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="p-6 hover-elevate">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold">{souk.name}</h3>
                      <p className="text-sm text-amber-600">{souk.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Best time: {souk.bestTime}</span>
                    {souk.bargain && (
                      <Badge variant="outline" className="text-amber-600 border-amber-300">
                        Bargaining Expected
                      </Badge>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="mt-8 p-6 bg-amber-50 dark:bg-amber-950/30 rounded-xl">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Gem className="w-5 h-5 text-amber-600" /> Bargaining Tips
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>Start at 60-70% of asking price</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>Walk away tactic often works</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <span>Cash gets better deals</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function HotelsSection() {
  return (
    <section id="hotels" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 mb-4">Accommodation</Badge>
            <h2 className="text-4xl font-bold mb-4">Where to Stay</h2>
            <p className="text-xl text-muted-foreground">Heritage hotels 40-60% cheaper than Downtown</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="p-6 h-full hover-elevate">
                  <Badge className="mb-3 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">{hotel.category}</Badge>
                  <h3 className="text-xl font-bold mb-1">{hotel.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {hotel.location}
                  </p>
                  <p className="text-sm mb-4">{hotel.highlight}</p>
                  <p className="text-amber-600 font-semibold">{hotel.priceRange}/night</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="mt-8 grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
              <h3 className="font-bold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                <Check className="w-5 h-5" /> Why Stay in Old Dubai
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Budget-friendly (40-60% cheaper)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Authentic cultural experience</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Central location (20 mins to Downtown)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Immersion in souks and heritage</li>
              </ul>
            </Card>
            <Card className="p-6 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
              <h3 className="font-bold text-red-800 dark:text-red-200 mb-3 flex items-center gap-2">
                <X className="w-5 h-5" /> Consider If...
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><X className="w-4 h-4 text-red-600" /> No beaches nearby (JBR 30 mins away)</li>
                <li className="flex items-center gap-2"><X className="w-4 h-4 text-red-600" /> Older infrastructure</li>
                <li className="flex items-center gap-2"><X className="w-4 h-4 text-red-600" /> Fewer fine dining options</li>
              </ul>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function DiningSection() {
  return (
    <section id="dining" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 mb-4">Culinary Heritage</Badge>
            <h2 className="text-4xl font-bold mb-4">Where to Eat</h2>
            <p className="text-xl text-muted-foreground">Dubai's best budget dining scene</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="p-6 h-full hover-elevate">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold">{restaurant.name}</h3>
                      <Badge variant="outline" className="mt-1">{restaurant.cuisine}</Badge>
                    </div>
                    <Utensils className="w-5 h-5 text-amber-600" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {restaurant.location}
                  </p>
                  <p className="text-sm mb-3">{restaurant.specialty}</p>
                  <p className="text-amber-600 font-semibold">{restaurant.price}/person</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TransportSection() {
  return (
    <section id="transport" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Getting Around</h2>
            <p className="text-xl text-muted-foreground">Multiple options for exploring Old Dubai</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover-elevate">
              <Train className="w-10 h-10 text-amber-600 mb-4" />
              <h3 className="font-bold mb-2">Metro</h3>
              <p className="text-sm text-muted-foreground mb-3">Red Line + Green Line serve Old Dubai</p>
              <ul className="text-sm space-y-1">
                <li>Al Ras - Gold Souk</li>
                <li>Al Fahidi - Heritage District</li>
                <li>Baniyas Square - Central Deira</li>
              </ul>
              <p className="text-amber-600 font-semibold mt-3">AED 5-8</p>
            </Card>
            <Card className="p-6 hover-elevate">
              <Ship className="w-10 h-10 text-amber-600 mb-4" />
              <h3 className="font-bold mb-2">Abra (Water Taxi)</h3>
              <p className="text-sm text-muted-foreground mb-3">Traditional Creek crossing</p>
              <ul className="text-sm space-y-1">
                <li>Deira ↔ Bur Dubai</li>
                <li>5 mins crossing</li>
                <li>5am-midnight daily</li>
              </ul>
              <p className="text-amber-600 font-semibold mt-3">AED 1 per ride</p>
            </Card>
            <Card className="p-6 hover-elevate">
              <Car className="w-10 h-10 text-amber-600 mb-4" />
              <h3 className="font-bold mb-2">Taxi/Ride-Hailing</h3>
              <p className="text-sm text-muted-foreground mb-3">Uber/Careem widely available</p>
              <ul className="text-sm space-y-1">
                <li>Starting fare AED 12</li>
                <li>Old Dubai trips AED 12-20</li>
                <li>Traffic rush hours 7-9am, 5-8pm</li>
              </ul>
            </Card>
            <Card className="p-6 hover-elevate">
              <Users className="w-10 h-10 text-amber-600 mb-4" />
              <h3 className="font-bold mb-2">Walking</h3>
              <p className="text-sm text-muted-foreground mb-3">Best way to explore souks</p>
              <ul className="text-sm space-y-1">
                <li>Gold to Spice Souk: 5 mins</li>
                <li>Al Fahidi to Textile: 10 mins</li>
                <li>Take abra to cross Creek</li>
              </ul>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function BestTimeSection() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Best Time to Visit</h2>
          </div>

          <Tabs defaultValue="season" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="season" data-testid="tab-season">By Season</TabsTrigger>
              <TabsTrigger value="daily" data-testid="tab-daily">Daily Timing</TabsTrigger>
            </TabsList>

            <TabsContent value="season">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-950/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Sun className="w-8 h-8 text-green-600" />
                    <div>
                      <h3 className="font-bold">Best Season</h3>
                      <p className="text-sm text-muted-foreground">November - March</p>
                    </div>
                  </div>
                  <p className="text-sm">Pleasant 20-25°C weather. Perfect for souk exploration and outdoor walking.</p>
                </Card>
                <Card className="p-6 border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Thermometer className="w-8 h-8 text-yellow-600" />
                    <div>
                      <h3 className="font-bold">Shoulder Season</h3>
                      <p className="text-sm text-muted-foreground">April, October</p>
                    </div>
                  </div>
                  <p className="text-sm">Warming up/cooling down. Still manageable with early morning/evening visits.</p>
                </Card>
                <Card className="p-6 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Thermometer className="w-8 h-8 text-red-600" />
                    <div>
                      <h3 className="font-bold">Avoid</h3>
                      <p className="text-sm text-muted-foreground">May - September</p>
                    </div>
                  </div>
                  <p className="text-sm">40°C+ and humid. Outdoor exploration extremely challenging.</p>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="daily">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Sun className="w-8 h-8 text-amber-500" />
                    <div>
                      <h3 className="font-bold">Early Morning</h3>
                      <p className="text-sm text-muted-foreground">7am - 10am</p>
                    </div>
                  </div>
                  <p className="text-sm">Best light for photos, fewer crowds, cooler temperatures. Spice Souk restocking.</p>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Sunset className="w-8 h-8 text-orange-500" />
                    <div>
                      <h3 className="font-bold">Late Afternoon</h3>
                      <p className="text-sm text-muted-foreground">4pm - 6pm</p>
                    </div>
                  </div>
                  <p className="text-sm">Golden hour in Al Fahidi. Perfect for heritage district photos.</p>
                </Card>
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Star className="w-8 h-8 text-purple-500" />
                    <div>
                      <h3 className="font-bold">Evening</h3>
                      <p className="text-sm text-muted-foreground">5pm - 10pm</p>
                    </div>
                  </div>
                  <p className="text-sm">Gold Souk most atmospheric. Peak shopping hours, vibrant energy.</p>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}

function TipsSection() {
  return (
    <section id="tips" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Insider Tips</h2>
            <p className="text-xl text-muted-foreground">Make the most of your Old Dubai experience</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div variants={fadeInUp}>
              <Card className="p-6 h-full">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-600">
                  <Check className="w-5 h-5" /> DO
                </h3>
                <ul className="space-y-3">
                  {[
                    "Visit during cooler months (Nov-Mar)",
                    "Explore early morning (7-10am)   best light, fewer crowds",
                    "Take the AED 1 abra   best value in Dubai",
                    "Bargain respectfully   it's expected in souks",
                    "Try street food   safe and delicious",
                    "Dress modestly   shoulders/knees covered",
                    "Visit SMCCU for cultural understanding",
                    "Walk Al Fahidi at sunset   magical atmosphere",
                    "Bring cash   many vendors don't take cards"
                  ].map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-green-600 shrink-0 mt-1" />
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="p-6 h-full">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-600">
                  <X className="w-5 h-5" /> DON'T
                </h3>
                <ul className="space-y-3">
                  {[
                    "Buy gold without checking daily rates",
                    "Skip bargaining   you'll overpay",
                    "Visit midday in summer   dangerously hot",
                    "Eat at tourist-trap restaurants near Gold Souk",
                    "Take photos of people without permission",
                    "Buy counterfeit goods   illegal, can be confiscated",
                    "Expect pristine cleanliness   it's a working district",
                    "Rush   slow down and soak in the atmosphere"
                  ].map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <X className="w-4 h-4 text-red-600 shrink-0 mt-1" />
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          </div>

          <motion.div variants={fadeInUp} className="mt-8">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-600" /> Money-Saving Tips
              </h3>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { label: "Souks", value: "Cheaper than malls" },
                  { label: "Street Food", value: "AED 10-25/meal" },
                  { label: "Abra Ride", value: "AED 1 (vs AED 50+ taxi)" },
                  { label: "Hotels", value: "50% cheaper than Downtown" }
                ].map((item, idx) => (
                  <div key={idx} className="text-center p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                    <p className="font-bold text-amber-600">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`faq-${idx}`}>
                <AccordionTrigger className="text-left" data-testid={`faq-trigger-${idx}`}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-amber-600 via-amber-500 to-orange-500">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Discover the Soul of Dubai
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            From glittering gold souks to aromatic spice markets, experience the authentic 
            heart of Dubai that existed long before the skyscrapers.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/districts">
              <Button 
                size="lg" 
                className="bg-white text-amber-600 hover:bg-white/90 gap-2"
                data-testid="button-explore-more-old"
              >
                Explore More Districts <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function DistrictOldDubai() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav variant="transparent" />
      <HeroSection />
      <QuickNavSection />
      <OverviewSection />
      <SubDistrictsSection />
      <AttractionsSection />
      <SouksSection />
      <HotelsSection />
      <DiningSection />
      <TransportSection />
      <BestTimeSection />
      <TipsSection />
      <FAQSection />
      <CTASection />
      <PublicFooter />
    </div>
  );
}
