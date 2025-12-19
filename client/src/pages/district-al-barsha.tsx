import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  MapPin, Building2, Star, ArrowRight, Clock, Users, Camera, 
  Utensils, Bed, ShoppingBag, Train, Car, Snowflake, Sparkles,
  ChevronDown, Check, X, Sun, Sunset, Thermometer, TreePine,
  Phone, Shield, CreditCard, Baby, GraduationCap, Dumbbell,
  Calendar, Heart, Map, Home, Building
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
    name: "Mall of the Emirates",
    tagline: "Dubai's 2nd Largest Mall",
    description: "630+ stores, 2.4 million sq ft. Home to Ski Dubai, VOX Cinemas, 100+ restaurants. Dubai's family entertainment hub.",
    highlight: "40+ million annual visitors",
    mustSee: true
  },
  {
    name: "Ski Dubai",
    tagline: "Indoor Ski Resort",
    description: "Middle East's first indoor ski resort. 22,500 sq m of real snow at -1°C. 5 slopes, penguin encounters, Snow Park.",
    highlight: "AED 200-450 tickets",
    mustSee: true
  },
  {
    name: "Al Barsha Pond Park",
    tagline: "Family Park Haven",
    description: "65,000 sq m park with lake, 1.3km jogging track, playgrounds, BBQ areas, outdoor gym equipment.",
    highlight: "Free entry, 6am-11pm",
    mustSee: false
  }
];

const hotels = [
  { name: "Kempinski Hotel Mall of Emirates", category: "Ultra-Luxury", location: "Connected to Mall", highlight: "Direct mall access via walkway", priceRange: "AED 800-2000" },
  { name: "Movenpick Apartments Al Barsha", category: "Mid-Range", location: "Near Mall of Emirates Metro", highlight: "Aparthotel with kitchenettes", priceRange: "AED 400-600" },
  { name: "Ibis Mall of the Emirates", category: "Budget", location: "10 mins walk to mall", highlight: "Reliable budget chain", priceRange: "AED 200-350" },
  { name: "Premier Inn Al Barsha", category: "Budget", location: "Al Barsha", highlight: "Family rooms, good breakfast", priceRange: "AED 200-300" }
];

const restaurants = [
  { name: "Din Tai Fung", cuisine: "Taiwanese", location: "Mall of Emirates", specialty: "Famous xiaolongbao dumplings", price: "AED 80-120" },
  { name: "Texas Roadhouse", cuisine: "American", location: "Mall of Emirates", specialty: "Ribs, steaks, hearty portions", price: "AED 120-180" },
  { name: "The Cheesecake Factory", cuisine: "American", location: "Mall of Emirates", specialty: "250+ dishes, famous cheesecakes", price: "AED 100-150" },
  { name: "Calicut Paragon", cuisine: "Indian", location: "Al Barsha 1", specialty: "Kerala biryanis, seafood", price: "AED 40-70" },
  { name: "Ravi Restaurant", cuisine: "Pakistani", location: "Nearby Satwa", specialty: "Legendary cheap mutton karahi", price: "AED 15-30" },
  { name: "Al Mallah", cuisine: "Lebanese", location: "Nearby", specialty: "24/7 legendary shawarma", price: "AED 20-40" }
];

const faqs = [
  {
    question: "Is Al Barsha a good place to live?",
    answer: "Excellent for families and budget-conscious expats. Great schools, parks, safe neighborhoods, and 30-40% cheaper rent than Marina/Downtown. Best for families with school-age kids and mid-level professionals prioritizing value."
  },
  {
    question: "How far is Al Barsha from Dubai Marina?",
    answer: "10 km, 10-15 minutes by car or 15 minutes by Metro (4 stops from Mall of Emirates to Marina stations)."
  },
  {
    question: "How far is Al Barsha from Downtown Dubai?",
    answer: "18 km, 15-20 minutes by car or 25 minutes by Metro (12 stops from Mall of Emirates to Burj Khalifa/Dubai Mall)."
  },
  {
    question: "What's the difference between Al Barsha and Barsha Heights?",
    answer: "Al Barsha: Suburban family area with villas and low-rise apartments, many schools, car-dependent. Barsha Heights (formerly Tecom): Urban high-rise towers, young professionals, Metro-connected, walkable dining options."
  },
  {
    question: "Is Ski Dubai worth it?",
    answer: "Great for families, first-time snow experiences, and novelty seekers. Not for experienced skiers (slopes very basic). Best for kids and those from hot climates. Penguin encounters are a highlight!"
  },
  {
    question: "Can I walk to the beach from Al Barsha?",
    answer: "No. Jumeirah Beach is 15 minutes by car (8 km), not walkable. Al Barsha is an inland residential district. For beach lifestyle, choose Dubai Marina/JBR."
  }
];

const quickNavItems = [
  { id: "overview", label: "Overview", icon: Map },
  { id: "sub-districts", label: "Sub-Districts", icon: Building2 },
  { id: "attractions", label: "Attractions", icon: Star },
  { id: "hotels", label: "Hotels", icon: Bed },
  { id: "dining", label: "Dining", icon: Utensils },
  { id: "transport", label: "Transport", icon: Train },
  { id: "families", label: "Families", icon: Baby },
  { id: "tips", label: "Tips", icon: Sparkles }
];

function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop"
          alt="Mall of the Emirates Al Barsha"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-sky-800/60 to-blue-900/80" />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="flex items-center justify-center gap-2 mb-6">
            <Badge className="bg-sky-500/30 text-white border-sky-400/50 backdrop-blur-sm px-4 py-2">
              <Home className="w-4 h-4 mr-2" />
              Dubai's Family & Value Hub
            </Badge>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Al Barsha & Barsha Heights
            <span className="block text-3xl md:text-4xl font-normal text-sky-200 mt-2">
              Mall of Emirates, Ski Dubai & Family Living 2025
            </span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            Dubai's mid-range heartland. Mall of the Emirates, Ski Dubai, 
            excellent schools, 30-40% cheaper than Marina. Where families thrive.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Mall of Emirates
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <Snowflake className="w-4 h-4 mr-2" />
              Ski Dubai
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <Train className="w-4 h-4 mr-2" />
              4 Metro Stations
            </Badge>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-sky-500 hover:bg-sky-600 text-white gap-2 text-lg px-8"
              data-testid="button-explore-al-barsha"
              onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Al Barsha <ArrowRight className="w-5 h-5" />
            </Button>
            <Link href="/dubai/districts">
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 gap-2" data-testid="button-all-districts-barsha">
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
              className="flex items-center gap-2 whitespace-nowrap text-muted-foreground hover:text-sky-600"
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
    <section id="overview" className="py-20 bg-gradient-to-b from-sky-50 to-background dark:from-sky-950/20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-200 mb-4">
              The Practical Choice
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Where Normal People Live</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              While Downtown gleams with luxury and Marina pulses with tourists, 
              Al Barsha offers affordable, family-friendly, centrally-located living.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShoppingBag, label: "630+ Stores", desc: "Mall of Emirates" },
              { icon: Train, label: "4 Metro Stations", desc: "Red Line access" },
              { icon: GraduationCap, label: "20+ Schools", desc: "International options" },
              { icon: CreditCard, label: "30-40% Cheaper", desc: "vs Marina/Downtown" }
            ].map((stat, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="text-center p-6 hover-elevate">
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-sky-600" />
                  <h3 className="text-2xl font-bold mb-2">{stat.label}</h3>
                  <p className="text-muted-foreground">{stat.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="mt-12 grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" /> Al Barsha Strengths
              </h3>
              <ul className="space-y-3">
                {[
                  "Value for money (30-40% cheaper rent)",
                  "Mall of Emirates access (shopping, Ski Dubai)",
                  "Central location (15-20 mins to major attractions)",
                  "Excellent Metro connectivity (4 stations)",
                  "Family-friendly (quieter than tourist areas)",
                  "Massive dining variety (300+ restaurants)"
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
                <X className="w-5 h-5 text-red-600" /> Consider If...
              </h3>
              <ul className="space-y-3">
                {[
                  "No beach (15 mins drive to Jumeirah)",
                  "No iconic landmarks (Burj Khalifa 20 mins away)",
                  "Suburban feel (not a 'destination' district)",
                  "Less walkable outside Metro areas",
                  "No nightlife (few bars/clubs)"
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

function SubDistrictsSection() {
  return (
    <section id="sub-districts" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Two Different Characters</h2>
            <p className="text-xl text-muted-foreground">Al Barsha vs Barsha Heights</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div variants={fadeInUp}>
              <Card className="p-6 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                    <Home className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Al Barsha</h3>
                    <p className="text-muted-foreground">Suburban Family Area</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-sky-600" /> Villas + low-rise apartments</li>
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-sky-600" /> Many schools concentrated</li>
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-sky-600" /> Parks and playgrounds</li>
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-sky-600" /> Family-oriented, quiet</li>
                  <li className="flex items-center gap-3"><X className="w-4 h-4 text-red-500" /> Car-dependent</li>
                </ul>
                <Badge className="bg-sky-100 text-sky-800">Best for: Families with kids</Badge>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="p-6 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                    <Building className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">Barsha Heights</h3>
                    <p className="text-muted-foreground">Urban Business District</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-purple-600" /> High-rise towers (30-40 floors)</li>
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-purple-600" /> Metro-connected (2 stations)</li>
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-purple-600" /> 100+ ground-floor restaurants</li>
                  <li className="flex items-center gap-3"><Check className="w-4 h-4 text-purple-600" /> Young professionals, singles</li>
                  <li className="flex items-center gap-3"><X className="w-4 h-4 text-red-500" /> Corporate feel, less character</li>
                </ul>
                <Badge className="bg-purple-100 text-purple-800">Best for: Young professionals</Badge>
              </Card>
            </motion.div>
          </div>
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
            <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-200 mb-4">Entertainment Hub</Badge>
            <h2 className="text-4xl font-bold mb-4">Top Attractions</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {attractions.map((attraction, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="h-full overflow-hidden hover-elevate">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold">{attraction.name}</h3>
                        <p className="text-sky-600 text-sm">{attraction.tagline}</p>
                      </div>
                      {attraction.mustSee && (
                        <Badge className="bg-sky-500 text-white">Must-See</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-4">{attraction.description}</p>
                    <p className="text-sm font-semibold text-sky-600">{attraction.highlight}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="mt-12">
            <Card className="p-6 bg-gradient-to-r from-sky-100 to-blue-100 dark:from-sky-950/30 dark:to-blue-950/30">
              <div className="flex items-start gap-6">
                <Snowflake className="w-16 h-16 text-sky-600 shrink-0" />
                <div>
                  <h3 className="font-bold text-xl mb-2">Ski Dubai Details</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-sky-600">Skiing/Snowboarding</p>
                      <p className="text-muted-foreground">5 slopes, 400m longest run, lessons available</p>
                    </div>
                    <div>
                      <p className="font-semibold text-sky-600">Snow Park</p>
                      <p className="text-muted-foreground">Toboggan, bobsled, penguin encounters</p>
                    </div>
                    <div>
                      <p className="font-semibold text-sky-600">Tips</p>
                      <p className="text-muted-foreground">Book online 10-15% off, weekday mornings less crowded</p>
                    </div>
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

function HotelsSection() {
  return (
    <section id="hotels" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-200 mb-4">Accommodation</Badge>
            <h2 className="text-4xl font-bold mb-4">Where to Stay</h2>
            <p className="text-xl text-muted-foreground">Great value options near Mall of Emirates</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotels.map((hotel, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="p-6 h-full hover-elevate">
                  <Badge className="mb-3 bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-200">{hotel.category}</Badge>
                  <h3 className="text-lg font-bold mb-1">{hotel.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {hotel.location}
                  </p>
                  <p className="text-sm mb-4">{hotel.highlight}</p>
                  <p className="text-sky-600 font-semibold">{hotel.priceRange}/night</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function DiningSection() {
  return (
    <section id="dining" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-200 mb-4">300+ Restaurants</Badge>
            <h2 className="text-4xl font-bold mb-4">Where to Eat</h2>
            <p className="text-xl text-muted-foreground">Mid-range heaven with authentic expat cuisine</p>
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
                    <Utensils className="w-5 h-5 text-sky-600" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {restaurant.location}
                  </p>
                  <p className="text-sm mb-3">{restaurant.specialty}</p>
                  <p className="text-sky-600 font-semibold">{restaurant.price}/person</p>
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
    <section id="transport" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Getting Around</h2>
            <p className="text-xl text-muted-foreground">Al Barsha's Metro superpower</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover-elevate bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30">
              <Train className="w-10 h-10 text-sky-600 mb-4" />
              <h3 className="font-bold mb-2">4 Metro Stations</h3>
              <ul className="text-sm space-y-2">
                <li>Mall of Emirates - Al Barsha 1</li>
                <li>Sharaf DG - Al Barsha 1</li>
                <li>Dubai Internet City - Barsha Heights</li>
                <li>Nakheel - Barsha Heights</li>
              </ul>
            </Card>
            <Card className="p-6 hover-elevate">
              <Clock className="w-10 h-10 text-sky-600 mb-4" />
              <h3 className="font-bold mb-2">Journey Times</h3>
              <ul className="text-sm space-y-2">
                <li>To Marina: 15 mins (4 stops)</li>
                <li>To Downtown: 25 mins (12 stops)</li>
                <li>To Airport: 35 mins (17 stops)</li>
              </ul>
            </Card>
            <Card className="p-6 hover-elevate">
              <Car className="w-10 h-10 text-sky-600 mb-4" />
              <h3 className="font-bold mb-2">By Car</h3>
              <ul className="text-sm space-y-2">
                <li>To Marina: 10-15 mins</li>
                <li>To Downtown: 15-20 mins</li>
                <li>Free/cheap parking available</li>
              </ul>
            </Card>
            <Card className="p-6 hover-elevate">
              <Users className="w-10 h-10 text-sky-600 mb-4" />
              <h3 className="font-bold mb-2">Walkability</h3>
              <p className="text-sm text-muted-foreground">
                Barsha Heights: Walkable around Metro. 
                Al Barsha: Car-dependent for most errands.
              </p>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FamiliesSection() {
  return (
    <section id="families" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <Badge className="bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-200 mb-4">Family Hub</Badge>
            <h2 className="text-4xl font-bold mb-4">Extremely Family-Friendly</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 hover-elevate">
              <GraduationCap className="w-10 h-10 text-sky-600 mb-4" />
              <h3 className="font-bold mb-3">Excellent Schools</h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>GEMS Wellington International</li>
                <li>Dubai British School</li>
                <li>JESS (Jumeirah English Speaking School)</li>
                <li>Delhi Private School</li>
                <li>Philippine School Dubai</li>
              </ul>
            </Card>
            <Card className="p-6 hover-elevate">
              <Shield className="w-10 h-10 text-sky-600 mb-4" />
              <h3 className="font-bold mb-3">Safe Neighborhoods</h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>Low crime, family-oriented</li>
                <li>Gated communities common</li>
                <li>24/7 security in buildings</li>
                <li>Well-lit streets</li>
              </ul>
            </Card>
            <Card className="p-6 hover-elevate">
              <TreePine className="w-10 h-10 text-sky-600 mb-4" />
              <h3 className="font-bold mb-3">Parks & Play</h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>Al Barsha Pond Park (large)</li>
                <li>Multiple community parks</li>
                <li>Mall of Emirates indoor play</li>
                <li>Ski Dubai for kids</li>
              </ul>
            </Card>
            <Card className="p-6 hover-elevate">
              <Utensils className="w-10 h-10 text-sky-600 mb-4" />
              <h3 className="font-bold mb-3">Family Dining</h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>90% restaurants family-friendly</li>
                <li>Kids' menus everywhere</li>
                <li>High chairs, play areas</li>
              </ul>
            </Card>
            <Card className="p-6 hover-elevate">
              <Home className="w-10 h-10 text-sky-600 mb-4" />
              <h3 className="font-bold mb-3">Affordable Space</h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>2-3 bedroom apartments common</li>
                <li>Spacious vs Marina/Downtown</li>
                <li>Gardens/balconies available</li>
              </ul>
            </Card>
            <Card className="p-6 hover-elevate">
              <Heart className="w-10 h-10 text-sky-600 mb-4" />
              <h3 className="font-bold mb-3">Healthcare</h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>Saudi German Hospital nearby</li>
                <li>Mediclinic Parkview Hospital</li>
                <li>Multiple pediatric clinics</li>
              </ul>
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
                    "Maximize Metro access — live near Mall of Emirates or Sharaf DG",
                    "Embrace Mall of Emirates as social hub",
                    "Enjoy the budget advantage (30-40% cheaper)",
                    "Explore ethnic restaurants (authentic Indian, Pakistani, Filipino)",
                    "Use Al Barsha Pond Park for free fitness",
                    "Have a car if living in Al Barsha proper"
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
                    "Expect beach lifestyle — 15 mins drive to coast",
                    "Expect nightlife — family district, quiet after 11pm",
                    "Expect walkability in Al Barsha proper (car needed)",
                    "Overpay for 'luxury' — Al Barsha is mid-range",
                    "Stay here as first-time tourist (stay Downtown/Marina)"
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
                <CreditCard className="w-5 h-5 text-sky-600" /> Money-Saving Tips
              </h3>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { label: "Housing", value: "AED 60-90K/year (2-bed)" },
                  { label: "Dining", value: "AED 30-50 local restaurants" },
                  { label: "Ski Dubai", value: "Book online 10-15% off" },
                  { label: "Entertainment", value: "Free parks, mall browsing" }
                ].map((item, idx) => (
                  <div key={idx} className="text-center p-4 bg-sky-50 dark:bg-sky-950/30 rounded-lg">
                    <p className="font-bold text-sky-600">{item.label}</p>
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
    <section className="py-20 bg-gradient-to-br from-sky-600 via-blue-500 to-sky-500">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Dubai's Family Hub
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            From Ski Dubai to excellent schools, discover why families choose 
            Al Barsha for value, convenience, and quality of life.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dubai/districts">
              <Button 
                size="lg" 
                className="bg-white text-sky-600 hover:bg-white/90 gap-2"
                data-testid="button-explore-more-barsha"
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

export default function DistrictAlBarsha() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav variant="transparent" />
      <HeroSection />
      <QuickNavSection />
      <OverviewSection />
      <SubDistrictsSection />
      <AttractionsSection />
      <HotelsSection />
      <DiningSection />
      <TransportSection />
      <FamiliesSection />
      <TipsSection />
      <FAQSection />
      <CTASection />
      <PublicFooter />
    </div>
  );
}
