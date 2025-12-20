import { Link } from "wouter";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { motion } from "framer-motion";
import { 
  MapPin, Building2, Star, ArrowRight, Clock, Users, Camera, 
  Utensils, Bed, Train, Car, Waves, Sparkles,
  ChevronRight, Sun, CloudSun, Thermometer, Check, X, 
  Phone, CreditCard, Wifi, Info, Anchor, Palmtree
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
          src="https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1920&q=80"
          alt="Palm Jumeirah Atlantis"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/30 via-pink-500/20 to-rose-500/30 mix-blend-multiply" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-32 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="bg-orange-500/80 text-white border-orange-400/50 mb-4">
            <Palmtree className="w-3 h-3 mr-1" /> Island Paradise
          </Badge>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight">
            Palm Jumeirah
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 font-medium mb-2">
            نخلة جميرا
          </p>
          <p className="text-xl text-white/80 max-w-2xl mb-8">
            The world's largest man-made island - where Atlantis rises from the Arabian Gulf and luxury knows no limits.
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2 text-white/80">
              <Anchor className="w-5 h-5 text-orange-400" />
              <span>5km Island</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Building2 className="w-5 h-5 text-orange-400" />
              <span>12+ Luxury Resorts</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Waves className="w-5 h-5 text-orange-400" />
              <span>Private Beaches</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Utensils className="w-5 h-5 text-orange-400" />
              <span>80+ Restaurants</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0 gap-2"
              data-testid="button-plan-visit-palm"
            >
              <Sparkles className="w-5 h-5" />
              Plan Your Visit
            </Button>
            <Link href="/districts">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white bg-white/10 backdrop-blur-sm"
                data-testid="button-back-districts-palm"
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
    { id: "atlantis", label: "Atlantis", icon: Waves },
    { id: "hotels", label: "Hotels", icon: Bed },
    { id: "dining", label: "Dining", icon: Utensils },
    { id: "activities", label: "Activities", icon: Camera },
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
              data-testid={`nav-${section.id}-palm`}
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
            <Badge className="mb-4 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
              The Eighth Wonder
            </Badge>
            <h2 className="text-4xl font-bold mb-6">
              Dubai's Iconic Man-Made Island Paradise
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              <strong>Palm Jumeirah</strong> is the world's largest man-made island, visible from space. 
              This 5-kilometer palm tree-shaped marvel features 17 residential fronds, the iconic Atlantis 
              resort at its apex, and some of the world's most exclusive hotels along its crescent.
            </p>
            <p className="text-muted-foreground mb-8">
              Built between 2001-2006 using 94 million cubic meters of sand and 7 million tons of rock, 
              Palm Jumeirah is where Dubai's boldest dreams became reality. Today it's home to celebrities, 
              royalty, and travelers seeking the ultimate luxury experience.
            </p>
            
            {/* Perfect For / Not Ideal For */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-5">
                  <h4 className="font-semibold text-green-700 dark:text-green-300 mb-3 flex items-center gap-2">
                    <Check className="w-5 h-5" /> Perfect For
                  </h4>
                  <ul className="space-y-2 text-sm text-green-600 dark:text-green-400">
                    <li>Luxury travelers & honeymooners</li>
                    <li>Families with Aquaventure dreams</li>
                    <li>Resort experience seekers</li>
                    <li>Celebrity chef dining enthusiasts</li>
                    <li>Instagram-worthy moments</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <CardContent className="p-5">
                  <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-3 flex items-center gap-2">
                    <X className="w-5 h-5" /> Not Ideal For
                  </h4>
                  <ul className="space-y-2 text-sm text-amber-600 dark:text-amber-400">
                    <li>Budget travelers</li>
                    <li>Public beach seekers (beaches are private)</li>
                    <li>Nightlife enthusiasts</li>
                    <li>Cultural authenticity seekers</li>
                    <li>Spontaneous explorers</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="relative">
            <img
              src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800"
              alt="Palm Jumeirah aerial view"
              className="rounded-2xl shadow-2xl w-full"
            />
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white p-6 rounded-xl shadow-xl">
              <p className="text-3xl font-bold">5 km</p>
              <p className="text-sm opacity-90">Island Length</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Atlantis Section
function AtlantisSection() {
  const highlights = [
    {
      title: "Aquaventure Waterpark",
      description: "Middle East's largest waterpark with 105+ slides including the legendary Leap of Faith",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600",
      features: ["Leap of Faith (27.5m drop)", "Shark-filled lagoon", "1.4km private beach", "FREE for hotel guests"],
    },
    {
      title: "The Lost Chambers",
      description: "65,000 marine animals in recreated ruins of the legendary lost city",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600",
      features: ["Ambassador Lagoon", "Interactive experiences", "Shark dives available", "Included with stay"],
    },
    {
      title: "Royal Atlantis (2023)",
      description: "The ultra-modern sibling with Sky Pool connecting two towers on the 22nd floor",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600",
      features: ["Sky Pool - 90m infinity pool", "Cloud 22 rooftop bar", "Celebrity chef restaurants", "795 luxury rooms"],
    },
  ];

  return (
    <section id="atlantis" className="py-20 bg-gradient-to-b from-orange-50 to-background dark:from-orange-900/10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
              <Waves className="w-3 h-3 mr-1" /> Star Attraction
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Atlantis The Palm</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The mythical underwater kingdom brought to life - Dubai's most iconic resort experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="overflow-hidden h-full group">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground mb-4">{item.description}</p>
                    <ul className="space-y-2">
                      {item.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-orange-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-muted-foreground mb-4">
              Pro Tip: Book hotel packages including Aquaventure - tickets cost AED 300+ per person!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Hotels Section
function HotelsSection() {
  const hotels = [
    {
      name: "Atlantis The Palm",
      stars: 5,
      style: "Iconic mega-resort",
      price: "AED 1,500+",
      features: ["Aquaventure included", "21 restaurants", "Underwater suites", "Private beach"],
      bestFor: "Families & first-timers",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400",
    },
    {
      name: "Waldorf Astoria",
      stars: 5,
      style: "Understated elegance",
      price: "AED 2,000+",
      features: ["Intimate luxury", "Private beach", "Award-winning spa", "Heinz Beck dining"],
      bestFor: "Couples & spa lovers",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
    },
    {
      name: "One&Only The Palm",
      stars: 5,
      style: "Boutique paradise",
      price: "AED 3,000+",
      features: ["Only 90 rooms", "Guerlain Spa", "Private marina", "Michelin-starred STAY"],
      bestFor: "Honeymooners",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
    },
    {
      name: "Anantara",
      stars: 5,
      style: "Thai-inspired luxury",
      price: "AED 1,800+",
      features: ["Overwater villas", "Thai spa", "Lagoon pool", "Unique in Dubai"],
      bestFor: "Maldives vibes in UAE",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400",
    },
    {
      name: "FIVE Palm Jumeirah",
      stars: 5,
      style: "Party meets beach",
      price: "AED 1,200+",
      features: ["Beach club & DJs", "Rooftop pool", "Younger crowd", "More affordable"],
      bestFor: "Young couples 25-40",
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
    },
    {
      name: "Rixos The Palm",
      stars: 5,
      style: "All-inclusive luxury",
      price: "AED 1,600+",
      features: ["Ultra all-inclusive", "Premium drinks included", "Family-friendly", "Private beach"],
      bestFor: "Families wanting predictable costs",
      image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400",
    },
  ];

  return (
    <section id="hotels" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="text-center mb-12">
            <Badge className="mb-4">
              <Bed className="w-3 h-3 mr-1" /> Luxury Resorts
            </Badge>
            <h2 className="text-4xl font-bold mb-4">World-Class Hotels</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Palm Jumeirah represents the pinnacle of Dubai luxury - every hotel is exceptional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="overflow-hidden h-full group">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-orange-500 text-white">{hotel.price}/night</Badge>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg">{hotel.name}</h3>
                      <div className="flex">
                        {[...Array(hotel.stars)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-orange-400 text-orange-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{hotel.style}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {hotel.features.slice(0, 3).map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">{feature}</Badge>
                      ))}
                    </div>
                    <p className="text-sm">
                      <span className="font-medium">Best for:</span> {hotel.bestFor}
                    </p>
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

// Dining Section
function DiningSection() {
  const restaurants = [
    { name: "Nobu", cuisine: "Japanese", location: "Atlantis", price: "AED 500+", highlight: "World-famous" },
    { name: "Hakkasan", cuisine: "Cantonese", location: "Atlantis", price: "AED 450+", highlight: "Michelin-starred" },
    { name: "Ossiano", cuisine: "Seafood", location: "Atlantis", price: "AED 600+", highlight: "Underwater dining" },
    { name: "Bread Street Kitchen", cuisine: "British", location: "Atlantis", price: "AED 350+", highlight: "Gordon Ramsay" },
    { name: "STAY", cuisine: "French", location: "One&Only", price: "AED 700+", highlight: "Michelin-starred" },
    { name: "101 Dining Lounge", cuisine: "Mediterranean", location: "One&Only", price: "AED 400+", highlight: "Sunset views" },
    { name: "Jaleo", cuisine: "Spanish Tapas", location: "Royal Atlantis", price: "AED 350+", highlight: "Jose Andres" },
    { name: "Cloud 22", cuisine: "Cocktails", location: "Royal Atlantis", price: "AED 200+", highlight: "Best rooftop" },
  ];

  return (
    <section id="dining" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="text-center mb-12">
            <Badge className="mb-4">
              <Utensils className="w-3 h-3 mr-1" /> Celebrity Chef Dining
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Exceptional Restaurants</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Palm Jumeirah hosts more celebrity chef restaurants than anywhere in Dubai
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {restaurants.map((restaurant, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="p-5 h-full">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold">{restaurant.name}</h3>
                      <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{restaurant.price}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{restaurant.location}</p>
                  <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 text-xs">
                    {restaurant.highlight}
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

// Activities Section
function ActivitiesSection() {
  const activities = [
    {
      title: "The View at The Palm",
      description: "360-degree observation deck on 52nd floor of The Palm Tower",
      price: "AED 100",
      icon: Camera,
    },
    {
      title: "Aquaventure Waterpark",
      description: "105+ slides including Leap of Faith with shark lagoon",
      price: "AED 300+",
      icon: Waves,
    },
    {
      title: "Beach Clubs",
      description: "DRIFT Beach, Atlantis Beach - exclusive day passes available",
      price: "AED 200-500",
      icon: Sun,
    },
    {
      title: "Palm Monorail",
      description: "5.4km elevated train with stunning island views",
      price: "AED 25",
      icon: Train,
    },
    {
      title: "Yacht Charters",
      description: "Private yacht cruises around Palm Jumeirah",
      price: "AED 800+",
      icon: Anchor,
    },
    {
      title: "Helicopter Tours",
      description: "Aerial views of the iconic palm shape",
      price: "AED 600+",
      icon: Camera,
    },
  ];

  return (
    <section id="activities" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="text-center mb-12">
            <Badge className="mb-4">
              <Camera className="w-3 h-3 mr-1" /> Things to Do
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Activities & Experiences</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="p-6 h-full">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500">
                      <activity.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold">{activity.title}</h3>
                        <Badge variant="secondary" className="text-xs">{activity.price}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Transport Section
function TransportSection() {
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
              <Car className="w-3 h-3 mr-1" /> Getting There
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Transportation</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div variants={itemVariants}>
              <Card className="p-6 h-full text-center">
                <Train className="w-10 h-10 mx-auto mb-4 text-orange-500" />
                <h3 className="font-bold text-lg mb-2">Palm Monorail</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  From Gateway Station (near Nakheel Mall) to Atlantis Station
                </p>
                <Badge variant="secondary">AED 25 one-way</Badge>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-6 h-full text-center">
                <Car className="w-10 h-10 mx-auto mb-4 text-orange-500" />
                <h3 className="font-bold text-lg mb-2">Taxi / Ride-Hailing</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  From Dubai Marina: 10-15 min<br/>
                  From Downtown: 25-30 min
                </p>
                <Badge variant="secondary">AED 40-80</Badge>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-6 h-full text-center">
                <Anchor className="w-10 h-10 mx-auto mb-4 text-orange-500" />
                <h3 className="font-bold text-lg mb-2">Water Taxi</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  From Dubai Marina to Palm piers - scenic route
                </p>
                <Badge variant="secondary">AED 100+</Badge>
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
              <TabsTrigger value="peak" data-testid="tab-peak-palm">Peak Season</TabsTrigger>
              <TabsTrigger value="shoulder" data-testid="tab-shoulder-palm">Shoulder</TabsTrigger>
              <TabsTrigger value="summer" data-testid="tab-summer-palm">Summer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="peak">
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Sun className="w-8 h-8 text-orange-500" />
                  <div>
                    <h3 className="text-xl font-bold">November - March</h3>
                    <p className="text-muted-foreground">Perfect weather, highest prices</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium mb-2">Weather</p>
                    <p className="text-sm text-muted-foreground">20-28°C, sunny, perfect beach weather</p>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Expect</p>
                    <p className="text-sm text-muted-foreground">Premium prices, advance booking essential</p>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="shoulder">
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <CloudSun className="w-8 h-8 text-orange-500" />
                  <div>
                    <h3 className="text-xl font-bold">April, October</h3>
                    <p className="text-muted-foreground">Good value, warm weather</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium mb-2">Weather</p>
                    <p className="text-sm text-muted-foreground">28-35°C, warm but manageable</p>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Expect</p>
                    <p className="text-sm text-muted-foreground">20-40% discounts on peak rates</p>
                  </div>
                </div>
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
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium mb-2">Weather</p>
                    <p className="text-sm text-muted-foreground">38-45°C, very hot & humid</p>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Expect</p>
                    <p className="text-sm text-muted-foreground">50-70% off! Great for indoor attractions</p>
                  </div>
                </div>
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
      icon: CreditCard,
      title: "Book Hotel Packages",
      description: "Aquaventure tickets cost AED 300+ - hotel packages with included access save money",
    },
    {
      icon: Clock,
      title: "Monorail Hours",
      description: "Palm Monorail: 10am-10pm daily. Gateway station connects to tram/metro",
    },
    {
      icon: Wifi,
      title: "Beach Access",
      description: "All Palm beaches are private/hotel-only. Day passes available at beach clubs",
    },
    {
      icon: Phone,
      title: "Restaurant Reservations",
      description: "Book celebrity chef restaurants 2-3 weeks ahead, especially weekends",
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
                  <tip.icon className="w-10 h-10 mx-auto mb-4 text-orange-500" />
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
      question: "Can I visit Palm Jumeirah without staying at a hotel?",
      answer: "Yes! You can visit The Pointe for dining/shopping, take the Palm Monorail, visit Nakheel Mall, or book beach club day passes. However, beach access is hotel/beach club only.",
    },
    {
      question: "Is Aquaventure worth the price?",
      answer: "At AED 300+, it's expensive but exceptional. If staying at Atlantis, it's FREE and unlimited - massive value. For day visitors, go early to maximize time.",
    },
    {
      question: "How do I get the best Palm Jumeirah view?",
      answer: "The View at The Palm (observation deck) offers 360° views. Helicopter tours show the iconic palm shape. The Monorail offers scenic transit views.",
    },
    {
      question: "What's the difference between Atlantis and Royal Atlantis?",
      answer: "Original Atlantis is iconic with Aquaventure, underwater suites, family-focused. Royal Atlantis (2023) is ultra-modern, adults-oriented, features Sky Pool and Cloud 22.",
    },
    {
      question: "Are there any budget-friendly options on Palm Jumeirah?",
      answer: "Limited. The Pointe offers casual dining, Monorail is AED 25, Nakheel Mall is free. For budget stays, consider Dubai Marina hotels and day-trip to Palm.",
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
                  data-testid={`faq-trigger-${index}-palm`}
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
    <section className="py-20 bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Experience Palm Jumeirah
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            From the legendary Atlantis to exclusive beach clubs, discover why Palm Jumeirah 
            is Dubai's most iconic destination.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/districts">
              <Button 
                size="lg" 
                className="bg-white text-orange-600 hover:bg-white/90 gap-2"
                data-testid="button-explore-more-palm"
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

export default function DistrictPalmJumeirah() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav variant="transparent" />
      <HeroSection />
      <QuickNavSection />
      <OverviewSection />
      <AtlantisSection />
      <HotelsSection />
      <DiningSection />
      <ActivitiesSection />
      <TransportSection />
      <BestTimeSection />
      <TipsSection />
      <FAQSection />
      <CTASection />
      <PublicFooter />
    </div>
  );
}
