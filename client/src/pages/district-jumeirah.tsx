import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  MapPin, Building2, Star, ArrowRight, Clock, Users, Camera, 
  Utensils, Bed, Train, Car, Waves, Sparkles, Home,
  ChevronRight, Sun, CloudSun, Thermometer, Check, X, 
  Phone, CreditCard, Wifi, Info, Coffee, Umbrella
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// Hero Section
function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-end overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=1920&q=80"
          alt="Burj Al Arab Jumeirah"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/30 via-teal-500/20 to-cyan-500/30 mix-blend-multiply" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-32 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="bg-emerald-500/80 text-white border-emerald-400/50 mb-4">
            <Home className="w-3 h-3 mr-1" /> Residential Paradise
          </Badge>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight">
            Jumeirah
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 font-medium mb-2">
            جميرا
          </p>
          <p className="text-xl text-white/80 max-w-2xl mb-8">
            Dubai's original beachfront neighborhood - where the iconic Burj Al Arab meets pristine beaches and elegant villa living.
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2 text-white/80">
              <Waves className="w-5 h-5 text-emerald-400" />
              <span>14km Coastline</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span>Burj Al Arab</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Umbrella className="w-5 h-5 text-emerald-400" />
              <span>Free Public Beaches</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Coffee className="w-5 h-5 text-emerald-400" />
              <span>Cafe Culture</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 gap-2"
              data-testid="button-plan-visit-jumeirah"
            >
              <Sparkles className="w-5 h-5" />
              Plan Your Visit
            </Button>
            <Link href="/districts">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white bg-white/10 backdrop-blur-sm"
                data-testid="button-back-districts-jumeirah"
              >
                All Districts
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Quick Navigation
function QuickNavSection() {
  const sections = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "beaches", label: "Beaches", icon: Waves },
    { id: "burj-al-arab", label: "Burj Al Arab", icon: Star },
    { id: "hotels", label: "Hotels", icon: Bed },
    { id: "dining", label: "Dining", icon: Utensils },
    { id: "tips", label: "Tips", icon: Check },
  ];

  return (
    <section className="sticky top-0 z-[100] bg-background/95 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors whitespace-nowrap"
              data-testid={`nav-${section.id}-jumeirah`}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}

// Overview Section
function OverviewSection() {
  return (
    <section id="overview" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={itemVariants}>
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              The Golden Mile
            </Badge>
            <h2 className="text-4xl font-bold mb-6">
              Dubai's Original Beachfront Neighborhood
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              <strong>Jumeirah</strong> is Dubai's established coastal residential district - a sophisticated 
              14-kilometer stretch where wealthy residents live in white-walled villas, where the iconic 
              <strong> Burj Al Arab</strong> dominates the skyline, and where pristine public beaches meet upscale cafes.
            </p>
            <p className="text-muted-foreground mb-8">
              This is Dubai's "Beverly Hills by the sea" - less tourist-heavy than JBR, more refined than Marina, 
              and authentically residential while offering world-class beaches, the famous Kite Beach, and 
              Dubai's most photographed hotel.
            </p>
            
            {/* Perfect For / Not Ideal For */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-5">
                  <h4 className="font-semibold text-green-700 dark:text-green-300 mb-3 flex items-center gap-2">
                    <Check className="w-5 h-5" /> Perfect For
                  </h4>
                  <ul className="space-y-2 text-sm text-green-600 dark:text-green-400">
                    <li>Quieter beach experience</li>
                    <li>Families with kids</li>
                    <li>Fitness & kite surfing enthusiasts</li>
                    <li>Cafe culture lovers</li>
                    <li>Burj Al Arab photography</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <CardContent className="p-5">
                  <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-3 flex items-center gap-2">
                    <X className="w-5 h-5" /> Not Ideal For
                  </h4>
                  <ul className="space-y-2 text-sm text-amber-600 dark:text-amber-400">
                    <li>Partiers & nightlife seekers</li>
                    <li>First-timers wanting icons (Downtown)</li>
                    <li>Public transport dependent</li>
                    <li>Shopping enthusiasts</li>
                    <li>Ultra-luxury resort seekers</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="relative">
            <img
              src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800"
              alt="Jumeirah coastline"
              className="rounded-2xl shadow-2xl w-full"
            />
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-6 rounded-xl shadow-xl">
              <p className="text-3xl font-bold">14+ km</p>
              <p className="text-sm opacity-90">Coastline</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Beaches Section
function BeachesSection() {
  const beaches = [
    {
      name: "Kite Beach",
      type: "Public (FREE)",
      highlights: ["Kitesurfing hub", "Burj Al Arab views", "Salt burgers", "Outdoor gym", "Trampolines"],
      description: "Dubai's most active beach with kitesurfing, volleyball, and the legendary Salt burger truck",
      bestFor: "Active travelers, families, foodies",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
    },
    {
      name: "Jumeirah Beach (Sunset Beach)",
      type: "Public (FREE)",
      highlights: ["Best Burj Al Arab photos", "Sunset views", "Beach volleyball", "Running path"],
      description: "The main public beach with iconic Burj Al Arab backdrop - Instagram gold at sunset",
      bestFor: "Photographers, sunset lovers, runners",
      image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600",
    },
    {
      name: "La Mer Beach",
      type: "Public (FREE)",
      highlights: ["Colorful street art", "Boutique shopping", "25+ restaurants", "Splash pad"],
      description: "Modern beach development with Instagram-worthy murals, dining, and entertainment",
      bestFor: "Young travelers, Instagram lovers, families",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600",
    },
  ];

  return (
    <section id="beaches" className="py-20 bg-gradient-to-b from-emerald-50 to-background dark:from-emerald-900/10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
              <Waves className="w-3 h-3 mr-1" /> Free Public Beaches
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Pristine Beaches</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Jumeirah offers multiple FREE public beaches - unlike Palm Jumeirah's private shores
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {beaches.map((beach, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="overflow-hidden h-full group">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={beach.image}
                      alt={beach.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-500 text-white">{beach.type}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{beach.name}</h3>
                    <p className="text-muted-foreground mb-4">{beach.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {beach.highlights.slice(0, 3).map((h, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">{h}</Badge>
                      ))}
                    </div>
                    <p className="text-sm">
                      <span className="font-medium">Best for:</span> {beach.bestFor}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Card className="inline-block p-4 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                <strong>Pro Tip:</strong> Kite Beach's Salt burger truck has legendary lines - arrive early or late!
              </p>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Burj Al Arab Section
function BurjAlArabSection() {
  return (
    <section id="burj-al-arab" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={itemVariants}>
            <img
              src="https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800"
              alt="Burj Al Arab"
              className="rounded-2xl shadow-2xl w-full"
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Badge className="mb-4 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
              <Star className="w-3 h-3 mr-1" /> World's Most Iconic Hotel
            </Badge>
            <h2 className="text-4xl font-bold mb-6">
              Burj Al Arab Jumeirah
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              The world's only "7-star" hotel - a 321-meter sail-shaped architectural icon standing 
              on its own island. Every room is a duplex suite, butler service is standard, and 
              Rolls-Royce transfers are complimentary.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Bed className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold">All Duplex Suites</h4>
                  <p className="text-sm text-muted-foreground">Smallest suite: 170 sq meters!</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Utensils className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Signature Restaurants</h4>
                  <p className="text-sm text-muted-foreground">Al Mahara (arrive by submarine!), Al Muntaha (27th floor)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Camera className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Best Photo Spots</h4>
                  <p className="text-sm text-muted-foreground">Kite Beach, Jumeirah Beach at sunset - FREE views!</p>
                </div>
              </div>
            </div>

            <Card className="p-4 bg-muted/50">
              <p className="text-sm">
                <strong>Insider Access:</strong> Even without staying, you can book 
                Sahn Eddar (afternoon tea), Gold On 27 (cocktails), or restaurant 
                reservations to experience the interior.
              </p>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Hotels Section
function HotelsSection() {
  const hotels = [
    {
      name: "Burj Al Arab",
      stars: 7,
      style: "World's most iconic hotel",
      price: "AED 5,000+",
      features: ["All duplex suites", "Butler service", "Rolls-Royce fleet", "Private beach"],
      bestFor: "Once-in-a-lifetime luxury",
    },
    {
      name: "Madinat Jumeirah",
      stars: 5,
      style: "Arabian village resort",
      price: "AED 1,800+",
      features: ["Private souk", "Abra boat rides", "40+ restaurants", "Private beach"],
      bestFor: "Arabian luxury experience",
    },
    {
      name: "Jumeirah Beach Hotel",
      stars: 5,
      style: "Wave-shaped beachfront",
      price: "AED 1,500+",
      features: ["Burj Al Arab views", "Wild Wadi included", "Family-friendly", "Private beach"],
      bestFor: "Families with kids",
    },
    {
      name: "Four Seasons Jumeirah",
      stars: 5,
      style: "Contemporary luxury",
      price: "AED 2,200+",
      features: ["Private beach", "5 pools", "Spa", "Mercury Lounge"],
      bestFor: "Modern sophistication",
    },
  ];

  return (
    <section id="hotels" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="text-center mb-12">
            <Badge className="mb-4">
              <Bed className="w-3 h-3 mr-1" /> Luxury Hotels
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Where to Stay</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Jumeirah's hotels define Dubai luxury - from the legendary Burj Al Arab to the Arabian village of Madinat
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotels.map((hotel, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="p-5 h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold">{hotel.name}</h3>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(Math.min(hotel.stars, 5))].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                    ))}
                    {hotel.stars > 5 && <span className="text-xs ml-1 text-emerald-600">(7-star)</span>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{hotel.style}</p>
                  <Badge variant="outline" className="mb-3">{hotel.price}/night</Badge>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {hotel.features.slice(0, 2).map((f, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">{f}</Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Best for:</span> {hotel.bestFor}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Dining Section
function DiningSection() {
  const spots = [
    { name: "Salt", type: "Burger truck", location: "Kite Beach", price: "AED 50", highlight: "Dubai legend" },
    { name: "Comptoir 102", type: "Organic cafe", location: "Jumeirah 1", price: "AED 80", highlight: "Health-conscious" },
    { name: "Tom & Serg", type: "Australian cafe", location: "Al Quoz", price: "AED 70", highlight: "Brunch hotspot" },
    { name: "Surf Cafe", type: "Healthy bowls", location: "Kite Beach", price: "AED 60", highlight: "Post-surf fuel" },
    { name: "Al Mahara", type: "Seafood fine dining", location: "Burj Al Arab", price: "AED 800+", highlight: "Arrive by submarine" },
    { name: "Pai Thai", type: "Thai", location: "Madinat Jumeirah", price: "AED 300", highlight: "Arrive by abra" },
    { name: "Pierchic", type: "Seafood", location: "Al Qasr", price: "AED 400", highlight: "Over-water dining" },
    { name: "The Maine", type: "Lobster", location: "DoubleTree", price: "AED 350", highlight: "New England vibes" },
  ];

  return (
    <section id="dining" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="text-center mb-12">
            <Badge className="mb-4">
              <Utensils className="w-3 h-3 mr-1" /> Cafe Culture & Fine Dining
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Where to Eat</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From legendary beach burgers to world-famous fine dining
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {spots.map((spot, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="p-5 h-full">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">{spot.name}</h3>
                    <Badge variant="outline" className="text-xs">{spot.price}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{spot.type}</p>
                  <p className="text-xs text-muted-foreground mb-2">{spot.location}</p>
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs">
                    {spot.highlight}
                  </Badge>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Cultural Section
function CulturalSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="text-center mb-12">
            <Badge className="mb-4">
              <Building2 className="w-3 h-3 mr-1" /> Cultural Heritage
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Must-Visit Cultural Sites</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div variants={itemVariants}>
              <Card className="p-6 h-full">
                <h3 className="text-xl font-bold mb-4">Jumeirah Mosque</h3>
                <p className="text-muted-foreground mb-4">
                  One of few mosques in UAE open to non-Muslim visitors. Beautiful Fatimid architecture 
                  with guided tours explaining Islam and Emirati culture.
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Tours:</strong> Sat-Thu (check schedule)</p>
                  <p><strong>Duration:</strong> 75 minutes</p>
                  <p><strong>Dress Code:</strong> Modest (coverings provided)</p>
                  <p><strong>Best For:</strong> Cultural learning, photography</p>
                </div>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Card className="p-6 h-full">
                <h3 className="text-xl font-bold mb-4">Majlis Ghorfat Umm Al Sheif</h3>
                <p className="text-muted-foreground mb-4">
                  Historic summer residence of Dubai's ruling family. Traditional coral, stone, 
                  and palm wood construction showing pre-oil era Dubai life.
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Entry:</strong> FREE</p>
                  <p><strong>Duration:</strong> 30-45 minutes</p>
                  <p><strong>Era:</strong> 1950s heritage</p>
                  <p><strong>Best For:</strong> History buffs</p>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Best Time Section
function BestTimeSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="text-center mb-12">
            <Badge className="mb-4">
              <Sun className="w-3 h-3 mr-1" /> Best Time to Visit
            </Badge>
            <h2 className="text-4xl font-bold mb-4">When to Visit</h2>
          </div>

          <Tabs defaultValue="peak" className="max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-3 w-full mb-8">
              <TabsTrigger value="peak" data-testid="tab-peak-jumeirah">Peak Season</TabsTrigger>
              <TabsTrigger value="shoulder" data-testid="tab-shoulder-jumeirah">Shoulder</TabsTrigger>
              <TabsTrigger value="summer" data-testid="tab-summer-jumeirah">Summer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="peak">
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Sun className="w-8 h-8 text-emerald-500" />
                  <div>
                    <h3 className="text-xl font-bold">November - March</h3>
                    <p className="text-muted-foreground">Perfect beach weather</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  20-28°C, ideal for beach days, kitesurfing, and outdoor cafes. Book hotels early.
                </p>
              </Card>
            </TabsContent>
            
            <TabsContent value="shoulder">
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <CloudSun className="w-8 h-8 text-emerald-500" />
                  <div>
                    <h3 className="text-xl font-bold">April, October</h3>
                    <p className="text-muted-foreground">Good value, warm</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  28-35°C, mornings and evenings pleasant for beach. 20-40% discounts.
                </p>
              </Card>
            </TabsContent>
            
            <TabsContent value="summer">
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Thermometer className="w-8 h-8 text-red-500" />
                  <div>
                    <h3 className="text-xl font-bold">May - September</h3>
                    <p className="text-muted-foreground">Extreme heat, best deals</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  38-45°C, very hot. Beach only at sunrise/sunset. 50-70% hotel discounts.
                </p>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}

// Tips Section
function TipsSection() {
  const tips = [
    {
      icon: Car,
      title: "Getting Around",
      description: "Limited metro access. Taxis, Careem, or hotel transfers best. Jumeirah is spread out.",
    },
    {
      icon: Camera,
      title: "Burj Al Arab Photos",
      description: "Best free views from Kite Beach or Jumeirah Beach at sunset - Instagram gold!",
    },
    {
      icon: Waves,
      title: "Beach Etiquette",
      description: "Modest swimwear required. Bikinis OK, no topless. No alcohol on public beaches.",
    },
    {
      icon: Coffee,
      title: "Cafe Culture",
      description: "Jumeirah's cafes are laptop-friendly with great WiFi. Perfect for remote work.",
    },
  ];

  return (
    <section id="tips" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="text-center mb-12">
            <Badge className="mb-4">
              <Info className="w-3 h-3 mr-1" /> Insider Tips
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Practical Tips</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tips.map((tip, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="p-6 h-full text-center">
                  <tip.icon className="w-10 h-10 mx-auto mb-4 text-emerald-500" />
                  <h3 className="font-bold mb-2">{tip.title}</h3>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// FAQ Section
function FAQSection() {
  const faqs = [
    {
      question: "What's the difference between Jumeirah and JBR?",
      answer: "JBR is a high-rise beachfront development near Marina with The Walk promenade. Jumeirah is a residential neighborhood of villas with Burj Al Arab, Kite Beach, and a more local feel.",
    },
    {
      question: "Can I visit Burj Al Arab without staying there?",
      answer: "Yes! Book afternoon tea at Sahn Eddar, drinks at Gold On 27, or a meal at Al Mahara/Al Muntaha. Restaurant reservations grant access to the iconic lobby.",
    },
    {
      question: "Is Jumeirah good for families?",
      answer: "Excellent! Kite Beach has trampolines and play areas. La Mer has splash pads. Jumeirah Beach Hotel includes Wild Wadi waterpark access.",
    },
    {
      question: "Are Jumeirah beaches free?",
      answer: "Yes! Kite Beach, Jumeirah Beach (Sunset Beach), and La Mer are all FREE public beaches with showers and toilets.",
    },
    {
      question: "How do I get to Jumeirah?",
      answer: "No metro direct to Jumeirah beaches. Take taxi/Careem (10 min from Dubai Marina, 20 min from Downtown). Some buses available but infrequent.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="text-center mb-12">
            <Badge className="mb-4">FAQs</Badge>
            <h2 className="text-4xl font-bold mb-4">Common Questions</h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                <AccordionTrigger 
                  className="text-left font-medium py-4"
                  data-testid={`faq-trigger-${index}-jumeirah`}
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
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

// CTA Section
function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Discover Jumeirah
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            From the legendary Burj Al Arab to pristine public beaches, experience 
            Dubai's most elegant residential neighborhood.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/districts">
              <Button 
                size="lg" 
                className="bg-white text-emerald-600 hover:bg-white/90 gap-2"
                data-testid="button-explore-more-jumeirah"
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

export default function DistrictJumeirah() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav variant="transparent" />
      <HeroSection />
      <QuickNavSection />
      <OverviewSection />
      <BeachesSection />
      <BurjAlArabSection />
      <HotelsSection />
      <DiningSection />
      <CulturalSection />
      <BestTimeSection />
      <TipsSection />
      <FAQSection />
      <CTASection />
      <PublicFooter />
    </div>
  );
}
