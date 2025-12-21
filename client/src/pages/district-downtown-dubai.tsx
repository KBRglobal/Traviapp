import { useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Building2, Star, ArrowRight, Clock, Users, Camera, 
  Utensils, Bed, ShoppingBag, Train, Car, Footprints, Sparkles,
  ChevronDown, ChevronUp, Check, X, Sun, Moon, Sunset, Thermometer,
  Phone, Shield, Wifi, CreditCard, Droplets, Plug, Baby, Wine,
  Calendar, Heart, Map, Navigation, Download, Share2, Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// Data
const attractions = [
  {
    id: "burj-khalifa",
    name: "Burj Khalifa",
    tagline: "World's Tallest Building",
    description: "Standing at 828 meters with 163 floors, the Burj Khalifa is the crown jewel of Dubai. Visit the observation decks at levels 124, 125, or 148 for breathtaking 360° views.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop",
    duration: "1.5-2 hours",
    bestTime: "Sunset",
    priceRange: "AED 149-399",
    mustSee: true,
    tips: ["Book sunset slots 2-4 weeks ahead", "Early morning = clearest views", "VIP/SKY tickets skip the queues"]
  },
  {
    id: "dubai-mall",
    name: "The Dubai Mall",
    tagline: "World's Largest Shopping Destination",
    description: "More than shopping - it's a full-day entertainment complex with 1,200+ stores, the Dubai Aquarium, KidZania, Ice Rink, and endless dining options.",
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&h=400&fit=crop",
    duration: "4-8 hours",
    bestTime: "Morning weekdays",
    priceRange: "Free entry",
    mustSee: true,
    tips: ["Download the Dubai Mall app", "Best parking via Fashion Avenue", "Walk 5+ km easily"]
  },
  {
    id: "dubai-fountain",
    name: "Dubai Fountain",
    tagline: "World's Largest Choreographed Fountain",
    description: "FREE nightly spectacular shooting water up to 500 feet high, synchronized to music ranging from classical to Arabic pop. Each show is 5 minutes of pure magic.",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&h=400&fit=crop",
    duration: "30 min+",
    bestTime: "Evening 8-9 PM",
    priceRange: "Free",
    mustSee: true,
    tips: ["Shows every 30 min from 6-11 PM", "Weekdays less crowded", "Try an Abra boat ride on the lake"]
  },
  {
    id: "dubai-opera",
    name: "Dubai Opera",
    tagline: "Architectural Masterpiece",
    description: "Shaped like a traditional dhow boat, this 2,000-seat venue hosts opera, ballet, concerts, comedy, and theatrical performances in a stunning multi-format space.",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&h=400&fit=crop",
    duration: "2-3 hours",
    bestTime: "Evening performances",
    priceRange: "AED 200-2000",
    mustSee: false,
    tips: ["Check schedule months ahead", "Guided tours available", "Dress smart casual to formal"]
  },
  {
    id: "souk-al-bahar",
    name: "Souk Al Bahar",
    tagline: "Traditional Meets Modern",
    description: "A beautifully designed Arabian marketplace with arches, wooden balconies, and stone walkways. Perfect for boutique shopping and fountain-view dining.",
    image: "https://images.unsplash.com/photo-1534551767192-78b8dd45b51b?w=600&h=400&fit=crop",
    duration: "1-2 hours",
    bestTime: "Sunset",
    priceRange: "Varies",
    mustSee: false,
    tips: ["Book terrace restaurants ahead", "Less touristy than Dubai Mall", "Great for souvenirs"]
  }
];

const hotels = [
  {
    name: "Armani Hotel Dubai",
    category: "Ultra-Luxury",
    location: "Inside Burj Khalifa",
    highlight: "Giorgio Armani-designed, ultimate prestige",
    bestFor: "Special occasions, design lovers",
    priceRange: "AED 2,500+",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
  },
  {
    name: "Address Downtown",
    category: "Ultra-Luxury",
    location: "Opposite Dubai Mall",
    highlight: "THE BEST Dubai Fountain views in the city",
    bestFor: "Couples, fountain enthusiasts",
    priceRange: "AED 1,800+",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop"
  },
  {
    name: "The Palace Downtown",
    category: "Ultra-Luxury",
    location: "Old Town Island",
    highlight: "Arabian palace architecture, romantic ambiance",
    bestFor: "Honeymoons, romantic getaways",
    priceRange: "AED 1,500+",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop"
  },
  {
    name: "Rove Downtown",
    category: "Smart Budget",
    location: "Happiness Street",
    highlight: "Modern design, rooftop pool with Burj views",
    bestFor: "Budget travelers, young couples",
    priceRange: "AED 400+",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop"
  }
];

const restaurants = [
  { name: "At.mosphere", cuisine: "International Fine Dining", location: "Burj Khalifa Level 122", price: "AED 600+", highlight: "World's highest restaurant" },
  { name: "Thiptara", cuisine: "Thai", location: "The Palace Downtown", price: "AED 400+", highlight: "Waterfront, fountain views" },
  { name: "Social House", cuisine: "International/Asian", location: "Dubai Mall", price: "AED 150+", highlight: "Fountain terrace dining" },
  { name: "The Cheesecake Factory", cuisine: "American", location: "Dubai Mall", price: "AED 100+", highlight: "Huge portions, families" },
  { name: "Shake Shack", cuisine: "Burgers", location: "Dubai Mall", price: "AED 50+", highlight: "Quality fast-casual" },
];

const faqs = [
  {
    question: "Is Downtown Dubai good for first-time visitors to Dubai?",
    answer: "Yes - it's the BEST area for first-timers! All of Dubai's iconic landmarks are here: Burj Khalifa, Dubai Mall, Dubai Fountain. Excellent connectivity via metro, walking-friendly, and offers the quintessential \"Dubai experience\" that most visitors imagine."
  },
  {
    question: "How many days should I spend in Downtown Dubai?",
    answer: "2-3 days is ideal to explore without rushing. 1 day minimum covers Burj Khalifa + Dubai Mall + Fountain shows. 2 days adds Old Town, Dubai Opera, and fine dining. 3 days comfortable with day trips to nearby areas."
  },
  {
    question: "Is there a beach in Downtown Dubai?",
    answer: "No beaches in Downtown Dubai. Nearest options: La Mer Beach (15 min drive), Jumeirah Beach (15 min), JBR Beach (20 min). If beach access is priority, consider staying in Dubai Marina or Palm Jumeirah instead."
  },
  {
    question: "Is Downtown Dubai safe at night?",
    answer: "Extremely safe. Dubai has one of the world's lowest crime rates, with well-lit streets 24/7, security presence everywhere. Safe for solo travelers including solo female travelers. Families are comfortable walking late evening."
  },
  {
    question: "Do I need a car in Downtown Dubai?",
    answer: "No - actually better without one! Metro connects directly (Burj Khalifa/Dubai Mall station), walking covers most attractions with covered walkways, taxis/Uber readily available and affordable. Parking can be challenging and expensive."
  },
  {
    question: "Can you drink alcohol in Downtown Dubai?",
    answer: "Yes, but with restrictions. Hotels & licensed restaurants serve alcohol. No permit needed for tourists. No public drinking (streets, parks, Dubai Mall). Zero tolerance for drunk driving."
  }
];

// Components
function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-end overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920"
          alt="Downtown Dubai skyline with Burj Khalifa"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-transparent to-pink-900/30" />
      </div>
      
      {/* Floating Elements */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-16 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors" data-testid="link-breadcrumb-home">Home</Link>
            <span>/</span>
            <Link href="/districts" className="hover:text-white transition-colors" data-testid="link-breadcrumb-districts">Districts</Link>
            <span>/</span>
            <span className="text-white">Downtown Dubai</span>
          </div>
          
          {/* Title */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="bg-gradient-to-r from-travi-purple to-travi-pink text-white border-0 text-sm px-4 py-1">
              <Star className="w-3 h-3 mr-1" /> #1 Tourist District
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30">
              <MapPin className="w-3 h-3 mr-1" /> Heart of Dubai
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight">
            Downtown
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200">
              Dubai
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mb-8 leading-relaxed">
            Dubai's Iconic Heart. Home to the world's tallest building, largest mall, 
            and most spectacular fountain show. Where dreams touch the sky.
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap gap-6 mb-8">
            {[
              { icon: Camera, label: "12 Attractions" },
              { icon: Bed, label: "25+ Hotels" },
              { icon: Utensils, label: "200+ Restaurants" },
              { icon: ShoppingBag, label: "1,200+ Stores" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 text-white/80">
                <stat.icon className="w-5 h-5" />
                <span className="font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
          
          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-travi-purple to-travi-pink text-white border-0 hover:opacity-90 gap-2 text-lg px-8"
              data-testid="button-plan-visit"
            >
              <Calendar className="w-5 h-5" />
              Plan Your Visit
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 gap-2"
              data-testid="button-view-map"
            >
              <Map className="w-5 h-5" />
              View on Map
            </Button>
            <Button 
              size="icon"
              variant="outline"
              className="border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20"
              data-testid="button-bookmark"
            >
              <Bookmark className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-8 h-8 text-white/50" />
      </motion.div>
    </section>
  );
}

function QuickNavSection() {
  const navItems = [
    { icon: Camera, label: "Attractions", href: "#attractions" },
    { icon: Bed, label: "Hotels", href: "#hotels" },
    { icon: Utensils, label: "Dining", href: "#dining" },
    { icon: Train, label: "Getting Around", href: "#transport" },
    { icon: Calendar, label: "Best Time", href: "#best-time" },
    { icon: Users, label: "For Families", href: "#families" },
    { icon: Sparkles, label: "Tips", href: "#tips" },
  ];
  
  return (
    <section className="sticky top-0 z-[100] bg-background/95 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
          {navItems.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 hover:bg-muted text-sm font-medium whitespace-nowrap transition-colors"
              data-testid={`link-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function OverviewSection() {
  return (
    <section className="py-16 px-6" id="overview">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid lg:grid-cols-3 gap-8"
        >
          {/* Main Content */}
          <motion.div variants={fadeInUp} className="lg:col-span-2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">What is Downtown Dubai?</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-muted-foreground text-lg leading-relaxed">
                Downtown Dubai is where the world's most recognizable skyline comes to life. This 
                <strong> 6 square kilometer district</strong> in the heart of Dubai is home to the 
                <strong> Burj Khalifa</strong>, the world's tallest building, <strong>The Dubai Mall</strong>, 
                the planet's most-visited shopping destination, and the mesmerizing <strong>Dubai Fountain</strong>.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Whether you're planning your Dubai vacation, searching for things to do, or exploring places 
                to visit, Downtown Dubai is the unmissable centerpiece of any Dubai trip.
              </p>
            </div>
            
            {/* The Vibe */}
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {[
                { icon: Building2, title: "Ultra-modern", desc: "Gleaming skyscrapers, luxury retail, world-class dining" },
                { icon: Footprints, title: "Pedestrian-friendly", desc: "Covered walkways, wide boulevards, gardens" },
                { icon: Clock, title: "Always buzzing", desc: "Peak activity: 6 PM-midnight" },
                { icon: Camera, title: "Instagram paradise", desc: "Every corner offers stunning photo opportunities" },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 p-4 rounded-xl bg-muted/50">
                  <item.icon className="w-6 h-6 text-travi-purple shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Perfect For / Not For */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" /> Perfect For
                </h3>
                <ul className="space-y-3">
                  {[
                    "First-time visitors to Dubai",
                    "Luxury travelers",
                    "Photography enthusiasts",
                    "Couples & honeymooners",
                    "Families",
                    "Shopaholics"
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-orange-200 dark:border-orange-900">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <X className="w-5 h-5 text-orange-500" /> Not Ideal For
                </h3>
                <ul className="space-y-3">
                  {[
                    { text: "Beach lovers", note: "No beach (15 min drive)" },
                    { text: "Budget backpackers", note: "Premium pricing" },
                    { text: "Seeking local culture", note: "Tourist-heavy" },
                    { text: "Quiet retreat seekers", note: "Always busy" },
                  ].map((item) => (
                    <li key={item.text} className="text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                        <span>{item.text}</span>
                      </div>
                      <span className="text-xs text-muted-foreground ml-3.5">{item.note}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function AttractionsSection() {
  return (
    <section className="py-16 px-6 bg-muted/30" id="attractions">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-travi-purple/10 text-travi-purple border-travi-purple/20">
            <Camera className="w-3 h-3 mr-1" /> Attractions
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Top Things to Do</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Downtown Dubai packs more iconic attractions than any other district in the city.
          </p>
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid gap-6"
        >
          {attractions.map((attraction, index) => (
            <motion.div
              key={attraction.id}
              variants={fadeInUp}
              className="group"
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-1/3 relative">
                      <img
                        src={attraction.image}
                        alt={attraction.name}
                        className="w-full h-48 md:h-full object-cover"
                      />
                      {attraction.mustSee && (
                        <Badge className="absolute top-4 left-4 bg-gradient-to-r from-travi-pink to-travi-orange text-white border-0">
                          <Star className="w-3 h-3 mr-1" /> Must See
                        </Badge>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="md:w-2/3 p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{attraction.name}</h3>
                          <p className="text-travi-purple font-medium text-sm">{attraction.tagline}</p>
                        </div>
                        <div className="flex gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">
                            <Clock className="w-3 h-3 mr-1" /> {attraction.duration}
                          </Badge>
                          <Badge variant="outline">{attraction.priceRange}</Badge>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{attraction.description}</p>
                      
                      {/* Tips */}
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-travi-orange" /> Pro Tips
                        </h4>
                        <ul className="grid sm:grid-cols-2 gap-2">
                          {attraction.tips.map((tip, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <div className="w-1 h-1 rounded-full bg-travi-purple mt-2 shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function HotelsSection() {
  return (
    <section className="py-16 px-6" id="hotels">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-travi-orange/10 text-travi-orange border-travi-orange/20">
            <Bed className="w-3 h-3 mr-1" /> Accommodation
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Where to Stay</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From ultra-luxury palaces to smart budget stays, Downtown Dubai has options for every traveler.
          </p>
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {hotels.map((hotel) => (
            <motion.div key={hotel.name} variants={fadeInUp}>
              <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-40 object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-black/50 text-white border-0 backdrop-blur-sm text-xs">
                    {hotel.category}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-1">{hotel.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {hotel.location}
                  </p>
                  <p className="text-sm text-travi-purple font-medium mb-2">{hotel.highlight}</p>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t">
                    <span className="text-xs text-muted-foreground">Best for: {hotel.bestFor}</span>
                    <Badge variant="outline" className="text-xs">{hotel.priceRange}</Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function DiningSection() {
  return (
    <section className="py-16 px-6 bg-muted/30" id="dining">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-travi-pink/10 text-travi-pink border-travi-pink/20">
            <Utensils className="w-3 h-3 mr-1" /> Dining
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Where to Eat</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From street food to Michelin-level fine dining, Downtown Dubai's culinary scene has it all.
          </p>
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <div className="grid gap-4">
            {restaurants.map((restaurant) => (
              <motion.div key={restaurant.name} variants={fadeInUp}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <h3 className="font-bold">{restaurant.name}</h3>
                      <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{restaurant.location}</span>
                    </div>
                    <Badge variant="outline">{restaurant.price}</Badge>
                    <p className="text-sm text-travi-purple font-medium">{restaurant.highlight}</p>
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

function TransportSection() {
  return (
    <section className="py-16 px-6" id="transport">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-info/10 text-info border-info/20">
            <Train className="w-3 h-3 mr-1" /> Transportation
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Getting Around</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Downtown Dubai offers excellent connectivity - you rarely need a car here.
          </p>
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: Train,
              title: "Dubai Metro",
              subtitle: "Best Option",
              color: "from-travi-orange to-travi-pink",
              details: [
                "Burj Khalifa/Dubai Mall Station (Red Line)",
                "5-10 min covered walk to Dubai Mall",
                "15 min to Airport, 25 min to Marina",
                "1-Day Pass: AED 20 unlimited"
              ]
            },
            {
              icon: Footprints,
              title: "Walking",
              subtitle: "Excellent",
              color: "from-travi-green to-travi-green/80",
              details: [
                "Covered air-conditioned walkways",
                "Wide sidewalks with shade",
                "Dubai Mall to Old Town: 10 min",
                "Best times: morning or evening"
              ]
            },
            {
              icon: Car,
              title: "Taxi / Uber",
              subtitle: "Convenient",
              color: "from-travi-purple to-travi-pink",
              details: [
                "Base fare: AED 12 (day)",
                "To Marina: AED 50-70 (20 min)",
                "To Airport: AED 40-60 (15 min)",
                "Uber/Careem widely available"
              ]
            }
          ].map((transport) => (
            <motion.div key={transport.title} variants={fadeInUp}>
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${transport.color} flex items-center justify-center mb-4`}>
                    <transport.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{transport.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{transport.subtitle}</p>
                  <ul className="space-y-2">
                    {transport.details.map((detail, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function BestTimeSection() {
  return (
    <section className="py-16 px-6 bg-muted/30" id="best-time">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-[#FFD112]/10 text-[#FFD112] border-[#FFD112]/20">
            <Sun className="w-3 h-3 mr-1" /> Best Time
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">When to Visit</h2>
        </motion.div>
        
        <Tabs defaultValue="season" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="season" data-testid="tab-by-season">By Season</TabsTrigger>
            <TabsTrigger value="time" data-testid="tab-by-time">By Time of Day</TabsTrigger>
          </TabsList>
          
          <TabsContent value="season">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Thermometer,
                  season: "Winter",
                  months: "Nov - Mar",
                  temp: "20-30°C",
                  verdict: "BEST TIME",
                  color: "border-green-500",
                  pros: ["Perfect outdoor weather", "Peak tourist season", "Festivals & events"],
                  cons: ["Higher prices", "More crowds"]
                },
                {
                  icon: Sun,
                  season: "Summer",
                  months: "Jun - Sep",
                  temp: "40-45°C",
                  verdict: "LOW SEASON",
                  color: "border-orange-500",
                  pros: ["30-50% off hotels", "Fewer crowds", "Indoor fun"],
                  cons: ["Extremely hot", "Outdoor activities uncomfortable"]
                },
                {
                  icon: Sunset,
                  season: "Shoulder",
                  months: "Apr-May, Oct",
                  temp: "30-38°C",
                  verdict: "GOOD VALUE",
                  color: "border-blue-500",
                  pros: ["Moderate prices", "Decent weather", "Fewer tourists"],
                  cons: ["Can be hot midday"]
                }
              ].map((season) => (
                <Card key={season.season} className={`border-t-4 ${season.color}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <season.icon className="w-8 h-8 text-muted-foreground" />
                      <Badge variant="outline">{season.verdict}</Badge>
                    </div>
                    <h3 className="text-xl font-bold">{season.season}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{season.months} | {season.temp}</p>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-green-600 mb-1">Pros</p>
                        <ul className="text-sm space-y-1">
                          {season.pros.map((pro) => (
                            <li key={pro} className="flex items-center gap-2">
                              <Check className="w-3 h-3 text-green-500" /> {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-orange-600 mb-1">Cons</p>
                        <ul className="text-sm space-y-1">
                          {season.cons.map((con) => (
                            <li key={con} className="flex items-center gap-2">
                              <X className="w-3 h-3 text-orange-500" /> {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="time">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { time: "Morning", hours: "8 AM - 12 PM", icon: Sun, best: ["Cooler temperatures", "Better photos", "Fewer crowds", "Best for outdoor"] },
                { time: "Afternoon", hours: "12 PM - 5 PM", icon: Thermometer, best: ["Indoor activities", "Dubai Mall", "Aquarium", "Less crowded attractions"] },
                { time: "Evening", hours: "6 PM - 11 PM", icon: Moon, best: ["Most atmospheric", "Fountain shows", "Cooler weather", "Burj Khalifa lit up"] }
              ].map((period) => (
                <Card key={period.time}>
                  <CardContent className="p-6">
                    <period.icon className="w-8 h-8 text-[#6443F4] mb-4" />
                    <h3 className="text-xl font-bold">{period.time}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{period.hours}</p>
                    <ul className="space-y-2">
                      {period.best.map((item) => (
                        <li key={item} className="text-sm flex items-center gap-2">
                          <Check className="w-4 h-4 text-green-500" /> {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

function PracticalInfoSection() {
  const practicalTips = [
    { icon: Droplets, title: "Water", info: "Carry water always - dehydration risk in summer" },
    { icon: Plug, title: "Plugs", info: "UAE uses Type G plugs (UK standard)" },
    { icon: Wifi, title: "WiFi", info: "Free WiFi widely available in malls & hotels" },
    { icon: CreditCard, title: "Payments", info: "Cards accepted everywhere (Visa/Mastercard)" },
    { icon: Phone, title: "Emergency", info: "Police: 999 | Ambulance: 998" },
    { icon: Shield, title: "Safety", info: "Extremely safe - low crime, 24/7 security" },
  ];
  
  return (
    <section className="py-16 px-6" id="tips">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-[#02A65C]/10 text-[#02A65C] border-[#02A65C]/20">
            <Sparkles className="w-3 h-3 mr-1" /> Practical Info
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Essential Tips</h2>
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12"
        >
          {practicalTips.map((tip) => (
            <motion.div key={tip.title} variants={fadeInUp}>
              <Card>
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <tip.icon className="w-5 h-5 text-[#6443F4]" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{tip.title}</h4>
                    <p className="text-sm text-muted-foreground">{tip.info}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="py-16 px-6 bg-muted/30" id="faq">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
        </motion.div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`} className="bg-background rounded-lg border px-6">
              <AccordionTrigger className="text-left font-semibold py-4 hover:no-underline" data-testid={`accordion-faq-${index}`}>
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920"
              alt="Dubai skyline"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#6443F4]/90 to-[#F94498]/90" />
          </div>
          
          {/* Content */}
          <div className="relative z-10 p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Ready to Experience Downtown Dubai?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              The world's most spectacular urban destination awaits. Start planning your unforgettable Dubai adventure today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg"
                className="bg-white text-[#6443F4] hover:bg-white/90 gap-2 text-lg px-8"
                data-testid="button-cta-plan-visit"
              >
                <Calendar className="w-5 h-5" />
                Plan Your Visit
              </Button>
              <Link href="/districts">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 gap-2 text-lg px-8"
                  data-testid="button-cta-explore-districts"
                >
                  Explore More Districts
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function DistrictDowntownDubai() {
  const { isRTL } = useLocale();
  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <PublicNav variant="transparent" />
      <HeroSection />
      <QuickNavSection />
      <OverviewSection />
      <AttractionsSection />
      <HotelsSection />
      <DiningSection />
      <TransportSection />
      <BestTimeSection />
      <PracticalInfoSection />
      <FAQSection />
      <CTASection />
      <PublicFooter />
    </div>
  );
}
