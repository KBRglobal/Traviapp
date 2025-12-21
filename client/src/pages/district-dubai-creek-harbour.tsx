import { useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  MapPin, Building2, Star, ArrowRight, Clock, Users, Camera, 
  Utensils, Bed, ShoppingBag, Train, Car, Ship, Sparkles,
  ChevronDown, Check, X, Sun, Sunset, Thermometer, TreePine,
  Phone, Shield, CreditCard, Construction, Bird, Bike,
  Calendar, Heart, Map, TrendingUp, Home
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

const attractions = [
  {
    id: "creek-tower",
    name: "Dubai Creek Tower",
    tagline: "Future World's Tallest Building",
    description: "Designed by Santiago Calatrava to surpass Burj Khalifa (1,345m+). Construction resumed 2024, completion TBD.",
    status: "Under Construction",
    mustSee: true
  },
  {
    id: "promenade",
    name: "Creek Promenade Walks",
    tagline: "40+ km Waterfront Paths",
    description: "Peaceful Creek views, flamingo watching in winter, cycling and jogging paths.",
    status: "Operational",
    mustSee: true
  },
  {
    id: "flamingos",
    name: "Ras Al Khor Wildlife Sanctuary",
    tagline: "Urban Flamingo Haven",
    description: "Protected wetlands with flamingo populations (October-March). Free viewing platforms.",
    status: "Operational",
    mustSee: true
  },
  {
    id: "water-taxi",
    name: "Water Taxi to Downtown",
    tagline: "Scenic Creek Crossing",
    description: "5-10 minute scenic commute to Downtown Dubai, avoiding traffic.",
    status: "Expanding",
    mustSee: false
  },
  {
    id: "dubai-square",
    name: "Dubai Square",
    tagline: "Middle East's Largest Shopping Destination",
    description: "2.9 million sq ft planned retail space, 600+ outlets, waterfront dining.",
    status: "Under Construction",
    mustSee: false
  }
];

const hotels = [
  { name: "Park Hyatt Dubai", category: "Luxury", location: "Across the Creek (10 mins)", highlight: "Creek views, yacht club, golf course", priceRange: "AED 1,500+" },
  { name: "Address Downtown", category: "Luxury", location: "10 mins away", highlight: "Emaar brand, Dubai Fountain views", priceRange: "AED 1,800+" },
  { name: "Radisson Blu Waterfront", category: "Mid-Range", location: "Al Jaddaf (5 mins)", highlight: "Budget-friendly, Creek-side", priceRange: "AED 400+" }
];

const faqs = [
  {
    question: "Is Dubai Creek Harbour completed?",
    answer: "No. Dubai Creek Harbour is under construction with progressive completion. Residential towers are being delivered, but Dubai Creek Tower and Dubai Square are still being built. Full completion estimated 2030+."
  },
  {
    question: "When will Dubai Creek Tower be finished?",
    answer: "Timeline uncertain. Construction resumed in 2024 after COVID pause, but Emaar hasn't announced a firm date. Estimates range 2027-2030+."
  },
  {
    question: "Is Dubai Creek Harbour a good investment?",
    answer: "High potential for long-term investors (5-10 years). Emaar track record, prime location near Downtown, waterfront premium. Best for patient investors, not short-term flippers."
  },
  {
    question: "Can I see flamingos in Creek Harbour?",
    answer: "Yes! Ras Al Khor Wildlife Sanctuary borders Creek Harbour. Best viewing October-March during winter migration. Free viewing platforms available."
  },
  {
    question: "How far is Creek Harbour from Downtown Dubai?",
    answer: "5-10 minutes by car or water taxi. Approximately 5 km distance, making it one of the closest major developments to Downtown."
  }
];

const quickNavItems = [
  { id: "overview", label: "Overview", icon: Map },
  { id: "vision", label: "The Vision", icon: Building2 },
  { id: "attractions", label: "Attractions", icon: Star },
  { id: "hotels", label: "Hotels", icon: Bed },
  { id: "transport", label: "Transport", icon: Train },
  { id: "tips", label: "Tips", icon: Sparkles }
];

function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop"
          alt="Dubai Creek Harbour skyline"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/70 via-teal-800/60 to-cyan-900/80" />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="flex items-center justify-center gap-2 mb-6">
            <Badge className="bg-cyan-500/30 text-white border-cyan-400/50 backdrop-blur-sm px-4 py-2">
              <Construction className="w-4 h-4 mr-2" />
              Dubai's Most Ambitious Project
            </Badge>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Dubai Creek Harbour
            <span className="block text-3xl md:text-4xl font-normal text-cyan-200 mt-2">
              Future Skyline District Guide 2026
            </span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            6 sq km mega-development by Emaar. Dubai Creek Tower (world's tallest), 
            40+ km waterfront, 5 mins from Downtown. Dubai's next iconic address.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <Building2 className="w-4 h-4 mr-2" />
              6 sq km Development
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <Clock className="w-4 h-4 mr-2" />
              5 mins to Downtown
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <Bird className="w-4 h-4 mr-2" />
              Flamingo Sanctuary Views
            </Badge>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-cyan-500 hover:bg-cyan-600 text-white gap-2 text-lg px-8"
              data-testid="button-explore-creek-harbour"
              onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Creek Harbour <ArrowRight className="w-5 h-5" />
            </Button>
            <Link href="/districts">
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 gap-2" data-testid="button-all-districts-creek">
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
              className="flex items-center gap-2 whitespace-nowrap text-muted-foreground hover:text-cyan-600"
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
    <section id="overview" className="py-20 bg-gradient-to-b from-cyan-50 to-background dark:from-cyan-950/20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200 mb-4">
              Dubai's Next Chapter
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">The Most Ambitious Promise</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Larger than Downtown Dubai, Creek Harbour represents Dubai's vision for the next 50 years   
              a smart city with the world's tallest building at its heart.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Building2, label: "6 sq km", desc: "Larger than Downtown Dubai" },
              { icon: TrendingUp, label: "1,345m+", desc: "Creek Tower height (planned)" },
              { icon: Bike, label: "40+ km", desc: "Waterfront promenades" },
              { icon: TreePine, label: "80%", desc: "Open green spaces" }
            ].map((stat, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="text-center p-6 hover-elevate">
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-cyan-600" />
                  <h3 className="text-2xl font-bold mb-2">{stat.label}</h3>
                  <p className="text-muted-foreground">{stat.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="mt-12 grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" /> Perfect For
              </h3>
              <ul className="space-y-3">
                {[
                  "Families seeking space & master-planned community",
                  "Young professionals (5-10 min commute to Downtown/DIFC)",
                  "Long-term investors (high appreciation potential)",
                  "Lifestyle enthusiasts (waterfront, cycling, nature)",
                  "Expats wanting 'New Dubai' experience"
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
                <X className="w-5 h-5 text-red-600" /> Not Ideal For
              </h3>
              <ul className="space-y-3">
                {[
                  "Beach lovers (Creek waterfront, not ocean)",
                  "Nightlife seekers (family-oriented district)",
                  "Impatient buyers (construction ongoing)",
                  "Heritage enthusiasts (brand new, no history)",
                  "Those seeking established communities"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function VisionSection() {
  return (
    <section id="vision" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">The Master Plan</h2>
            <p className="text-xl text-muted-foreground">AED 25+ billion investment by Emaar</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 hover-elevate border-cyan-200 dark:border-cyan-800">
              <Building2 className="w-10 h-10 text-cyan-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Dubai Creek Tower</h3>
              <Badge className="mb-3 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30">Under Construction</Badge>
              <p className="text-sm text-muted-foreground">
                1,345m+ design by Santiago Calatrava. Observation decks, rotating balconies, LED facade. 
                When complete, world's new icon.
              </p>
            </Card>
            <Card className="p-6 hover-elevate">
              <Home className="w-10 h-10 text-cyan-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Residential Districts</h3>
              <Badge className="mb-3 bg-green-100 text-green-800 dark:bg-green-900/30">Delivering</Badge>
              <p className="text-sm text-muted-foreground">
                50+ residential towers planned. Creek Rise, Harbour Views, Creekside 18. 
                Smart home technology, LEED certified.
              </p>
            </Card>
            <Card className="p-6 hover-elevate">
              <ShoppingBag className="w-10 h-10 text-cyan-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Dubai Square</h3>
              <Badge className="mb-3 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30">Planned</Badge>
              <p className="text-sm text-muted-foreground">
                2.9 million sq ft retail space. 600+ outlets, indoor/outdoor concept, 
                waterfront dining. Will rival Dubai Mall.
              </p>
            </Card>
            <Card className="p-6 hover-elevate">
              <Bird className="w-10 h-10 text-cyan-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Wildlife Sanctuary Views</h3>
              <Badge className="mb-3 bg-green-100 text-green-800 dark:bg-green-900/30">Protected</Badge>
              <p className="text-sm text-muted-foreground">
                Ras Al Khor flamingo populations (winter season). Walking/cycling paths with 
                wildlife viewing platforms.
              </p>
            </Card>
            <Card className="p-6 hover-elevate">
              <Ship className="w-10 h-10 text-cyan-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Waterfront & Marinas</h3>
              <Badge className="mb-3 bg-blue-100 text-blue-800 dark:bg-blue-900/30">Developing</Badge>
              <p className="text-sm text-muted-foreground">
                40+ km waterfront walks. Yacht clubs, marinas, beach clubs, water taxis 
                connecting to Downtown.
              </p>
            </Card>
            <Card className="p-6 hover-elevate">
              <TreePine className="w-10 h-10 text-cyan-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Parks & Recreation</h3>
              <Badge className="mb-3 bg-green-100 text-green-800 dark:bg-green-900/30">Operational</Badge>
              <p className="text-sm text-muted-foreground">
                80% open green space (vs typical 20-30%). Dubai Creek Park extension, 
                cycling tracks, outdoor fitness.
              </p>
            </Card>
          </div>

          <motion.div variants={fadeInUp} className="mt-12">
            <Card className="p-6 bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-950/30 dark:to-teal-950/30">
              <h3 className="font-bold text-lg mb-4">Development Timeline</h3>
              <div className="grid md:grid-cols-5 gap-4 text-center text-sm">
                {[
                  { year: "2016", event: "Project announced" },
                  { year: "2017-2020", event: "Construction begins, first towers" },
                  { year: "2023", event: "Tower construction resumed" },
                  { year: "2026", event: "Ongoing development" },
                  { year: "2030+", event: "Full completion" }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-white/50 dark:bg-black/20 rounded-lg">
                    <p className="font-bold text-cyan-600">{item.year}</p>
                    <p className="text-muted-foreground text-xs">{item.event}</p>
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

function AttractionsSection() {
  return (
    <section id="attractions" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200 mb-4">Things to Do</Badge>
            <h2 className="text-4xl font-bold mb-4">Attractions & Experiences</h2>
            <p className="text-xl text-muted-foreground">What's available now and what's coming</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map((attraction, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="h-full overflow-hidden hover-elevate">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold">{attraction.name}</h3>
                        <p className="text-cyan-600 text-sm">{attraction.tagline}</p>
                      </div>
                      <Badge className={
                        attraction.status === "Operational" ? "bg-green-100 text-green-800" :
                        attraction.status === "Under Construction" ? "bg-yellow-100 text-yellow-800" :
                        "bg-blue-100 text-blue-800"
                      }>{attraction.status}</Badge>
                    </div>
                    <p className="text-muted-foreground">{attraction.description}</p>
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

function HotelsSection() {
  return (
    <section id="hotels" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200 mb-4">Accommodation</Badge>
            <h2 className="text-4xl font-bold mb-4">Where to Stay</h2>
            <p className="text-xl text-muted-foreground">Limited on-site options   nearby alternatives</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {hotels.map((hotel, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="p-6 h-full hover-elevate">
                  <Badge className="mb-3 bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200">{hotel.category}</Badge>
                  <h3 className="text-xl font-bold mb-1">{hotel.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {hotel.location}
                  </p>
                  <p className="text-sm mb-4">{hotel.highlight}</p>
                  <p className="text-cyan-600 font-semibold">{hotel.priceRange}/night</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="mt-8">
            <Card className="p-6 bg-cyan-50 dark:bg-cyan-950/30">
              <h3 className="font-bold text-lg mb-3">Coming Soon</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-white dark:bg-background rounded-lg">
                  <p className="font-semibold">Address Dubai Creek Harbour</p>
                  <p className="text-muted-foreground">Emaar luxury brand</p>
                </div>
                <div className="p-3 bg-white dark:bg-background rounded-lg">
                  <p className="font-semibold">Vida Hotels</p>
                  <p className="text-muted-foreground">Lifestyle hotel brand</p>
                </div>
                <div className="p-3 bg-white dark:bg-background rounded-lg">
                  <p className="font-semibold">Palace Hotel</p>
                  <p className="text-muted-foreground">Ultra-luxury positioning</p>
                </div>
              </div>
            </Card>
          </motion.div>
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
            <p className="text-xl text-muted-foreground">Multiple transport options</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover-elevate">
              <Train className="w-10 h-10 text-cyan-600 mb-4" />
              <h3 className="font-bold mb-2">Metro (Nearest)</h3>
              <p className="text-sm text-muted-foreground mb-3">Creek Station (Red Line)   5 mins taxi</p>
              <p className="text-xs text-muted-foreground">Future: Route 2020 extension planned</p>
            </Card>
            <Card className="p-6 hover-elevate">
              <Ship className="w-10 h-10 text-cyan-600 mb-4" />
              <h3 className="font-bold mb-2">Water Taxi</h3>
              <p className="text-sm text-muted-foreground mb-3">Creek crossing to Downtown/Business Bay</p>
              <p className="text-cyan-600 font-semibold">AED 15-25, 10 mins</p>
            </Card>
            <Card className="p-6 hover-elevate">
              <Car className="w-10 h-10 text-cyan-600 mb-4" />
              <h3 className="font-bold mb-2">Car/Taxi</h3>
              <p className="text-sm text-muted-foreground mb-3">To Downtown: 5-10 mins</p>
              <p className="text-sm text-muted-foreground">Less congested than Downtown</p>
            </Card>
            <Card className="p-6 hover-elevate">
              <Bike className="w-10 h-10 text-cyan-600 mb-4" />
              <h3 className="font-bold mb-2">Cycling/Walking</h3>
              <p className="text-sm text-muted-foreground mb-3">40+ km pedestrian-friendly promenades</p>
              <p className="text-sm text-muted-foreground">Flat terrain, easy cycling</p>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TipsSection() {
  return (
    <section id="tips" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Insider Tips</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div variants={fadeInUp}>
              <Card className="p-6 h-full">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-600">
                  <Check className="w-5 h-5" /> DO
                </h3>
                <ul className="space-y-3">
                  {[
                    "Embrace the 'under development' reality   early adopters benefit",
                    "Best jogging time: 6-7am (cool, peaceful)",
                    "Flamingo viewing: October-March (winter migration)",
                    "Leverage proximity to Downtown (5 mins by car)",
                    "Enjoy 80% green space   rare in Dubai",
                    "Use water taxi for scenic commute"
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
                    "Expect complete amenities (2026)   district still developing",
                    "Expect beach access   Creek waterfront only, JBR 25 mins away",
                    "Underestimate construction timelines   patience required",
                    "Ignore summer heat   June-August 40-45°C outdoors",
                    "Overpay   research comparable prices in Business Bay"
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
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="py-20 bg-muted/30">
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
    <section className="py-20 bg-gradient-to-br from-cyan-600 via-teal-500 to-cyan-500">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Dubai's Future Awaits
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            From the world's future tallest tower to flamingo sanctuaries, 
            discover Dubai's most ambitious waterfront development.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/districts">
              <Button 
                size="lg" 
                className="bg-white text-cyan-600 hover:bg-white/90 gap-2"
                data-testid="button-explore-more-creek"
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

export default function DistrictDubaiCreekHarbour() {
  const { isRTL } = useLocale();
  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <PublicNav variant="transparent" />
      <HeroSection />
      <QuickNavSection />
      <OverviewSection />
      <VisionSection />
      <AttractionsSection />
      <HotelsSection />
      <TransportSection />
      <TipsSection />
      <FAQSection />
      <CTASection />
      <PublicFooter />
    </div>
  );
}
