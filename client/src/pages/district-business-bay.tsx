import { Link } from "wouter";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { motion } from "framer-motion";
import { 
  MapPin, Building2, Star, ArrowRight, Clock, Users, Camera, 
  Utensils, Bed, Train, Car, Waves, Sparkles, Briefcase,
  ChevronRight, Sun, CloudSun, Thermometer, Check, X, 
  Phone, CreditCard, Wifi, Info, Coffee, Wine
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
          src="https://images.unsplash.com/photo-1546412414-e1885259563a?w=1920&q=80"
          alt="Business Bay Dubai Canal"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-600/30 via-purple-600/20 to-indigo-600/30 mix-blend-multiply" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-32 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="bg-purple-500/80 text-white border-purple-400/50 mb-4">
            <Briefcase className="w-3 h-3 mr-1" /> Urban Waterfront
          </Badge>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight">
            Business Bay
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 font-medium mb-2">
            الخليج التجاري
          </p>
          <p className="text-xl text-white/80 max-w-2xl mb-8">
            Dubai's Manhattan - where glass towers meet the stunning Dubai Canal 
            and rooftop bars offer Burj Khalifa views at a fraction of Downtown prices.
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2 text-white/80">
              <Building2 className="w-5 h-5 text-purple-400" />
              <span>240+ Towers</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Waves className="w-5 h-5 text-purple-400" />
              <span>Dubai Canal</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Clock className="w-5 h-5 text-purple-400" />
              <span>5min to Downtown</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Wine className="w-5 h-5 text-purple-400" />
              <span>Rooftop Bars</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 gap-2"
              data-testid="button-plan-visit-bb"
            >
              <Sparkles className="w-5 h-5" />
              Plan Your Visit
            </Button>
            <Link href="/districts">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white bg-white/10 backdrop-blur-sm"
                data-testid="button-back-districts-bb"
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
    { id: "canal", label: "Dubai Canal", icon: Waves },
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
              data-testid={`nav-${section.id}-bb`}
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
            <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              The New Downtown
            </Badge>
            <h2 className="text-4xl font-bold mb-6">
              Dubai's Modern Urban Waterfront
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              <strong>Business Bay</strong> is Dubai's Manhattan - a futuristic business district where 
              glass skyscrapers pierce the sky, where the Dubai Canal creates stunning waterfront dining, 
              and where luxury living meets corporate dynamism.
            </p>
            <p className="text-muted-foreground mb-8">
              Located just 5 minutes from Downtown Dubai, this is where ambitious professionals work in 
              gleaming towers by day and enjoy rooftop bars with Burj Khalifa views by night - all at 
              30-40% lower hotel prices than Downtown.
            </p>
            
            {/* Perfect For / Not Ideal For */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-5">
                  <h4 className="font-semibold text-green-700 dark:text-green-300 mb-3 flex items-center gap-2">
                    <Check className="w-5 h-5" /> Perfect For
                  </h4>
                  <ul className="space-y-2 text-sm text-green-600 dark:text-green-400">
                    <li>Business travelers</li>
                    <li>Budget-conscious Downtown lovers</li>
                    <li>Young professionals</li>
                    <li>Couples seeking urban romance</li>
                    <li>Digital nomads</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <CardContent className="p-5">
                  <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-3 flex items-center gap-2">
                    <X className="w-5 h-5" /> Not Ideal For
                  </h4>
                  <ul className="space-y-2 text-sm text-amber-600 dark:text-amber-400">
                    <li>Families with young kids</li>
                    <li>Beach seekers (15-20 min away)</li>
                    <li>Heritage enthusiasts</li>
                    <li>Those seeking quiet retreat</li>
                    <li>Walking-only travelers</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="relative">
            <img
              src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800"
              alt="Business Bay skyline"
              className="rounded-2xl shadow-2xl w-full"
            />
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-xl shadow-xl">
              <p className="text-3xl font-bold">30-40%</p>
              <p className="text-sm opacity-90">Cheaper than Downtown</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// Dubai Canal Section
function CanalSection() {
  const activities = [
    {
      title: "Canal Promenade Walk",
      description: "3.2km pedestrian path along both sides - perfect for jogging, cycling, or sunset strolls",
      icon: MapPin,
      price: "FREE",
    },
    {
      title: "Dubai Water Taxi",
      description: "Traditional-style abra boats offering scenic canal transit between stations",
      icon: Waves,
      price: "AED 3-10",
    },
    {
      title: "Cycling the Canal",
      description: "Dedicated cycling lanes running the full 3.2km length - bring or rent a bike",
      icon: Clock,
      price: "FREE",
    },
    {
      title: "Photography Spots",
      description: "Tolerance Bridge, skyline reflections, and night illumination - stunning shots",
      icon: Camera,
      price: "FREE",
    },
  ];

  return (
    <section id="canal" className="py-20 bg-gradient-to-b from-purple-50 to-background dark:from-purple-900/10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
              <Waves className="w-3 h-3 mr-1" /> Centerpiece
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Dubai Canal</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              3.2km artificial waterway connecting Dubai Creek to the Arabian Gulf - 
              Business Bay's defining feature
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {activities.map((activity, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="p-6 h-full">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500">
                      <activity.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-sm">{activity.title}</h3>
                        <Badge variant="secondary" className="text-xs">{activity.price}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="p-6 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">3.2 km</p>
                <p className="text-sm text-muted-foreground">Canal Length</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">2016</p>
                <p className="text-sm text-muted-foreground">Year Opened</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">24/7</p>
                <p className="text-sm text-muted-foreground">Promenade Access</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

// Hotels Section
function HotelsSection() {
  const hotels = [
    {
      name: "Paramount Hotel Dubai",
      stars: 5,
      style: "Hollywood-themed luxury",
      price: "AED 600+",
      features: ["Rooftop pool (45th floor!)", "Burj Khalifa views", "Cinematic design", "5 min to Downtown"],
      bestFor: "Couples, film enthusiasts",
      value: "30% less than Downtown",
    },
    {
      name: "JW Marriott Marquis",
      stars: 5,
      style: "World's tallest hotel",
      price: "AED 700+",
      features: ["Twin 355m towers", "14 restaurants", "Spa & pools", "Business center"],
      bestFor: "Business travelers",
      value: "Premium but value",
    },
    {
      name: "Radisson Blu Waterfront",
      stars: 4,
      style: "Canal-side international",
      price: "AED 400+",
      features: ["Canal views", "Rooftop pool", "FILINI Italian", "Meeting rooms"],
      bestFor: "Business & leisure",
      value: "Reliable quality",
    },
    {
      name: "ibis Styles",
      stars: 3,
      style: "Design-forward budget",
      price: "AED 200+",
      features: ["Breakfast included", "Modern design", "Near metro", "Clean & comfortable"],
      bestFor: "Budget travelers",
      value: "Best budget near Downtown!",
    },
    {
      name: "Damac Maison Canal Views",
      stars: 4,
      style: "Serviced apartments",
      price: "AED 450+",
      features: ["Kitchenette", "Canal balcony", "Rooftop pool", "Longer stays"],
      bestFor: "Families, extended stays",
      value: "Space + savings",
    },
    {
      name: "Residence Inn Marriott",
      stars: 4,
      style: "Extended-stay apartments",
      price: "AED 500+",
      features: ["Full kitchens", "Complimentary breakfast", "Laundry", "Marriott points"],
      bestFor: "Families, long stays",
      value: "Loyalty + value",
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
              <Bed className="w-3 h-3 mr-1" /> Smart Value Hotels
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Where to Stay</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Downtown proximity at 30-40% lower prices - the smart traveler's choice
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="p-5 h-full">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold">{hotel.name}</h3>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(hotel.stars)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-purple-400 text-purple-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{hotel.style}</p>
                  <Badge variant="outline" className="mb-3">{hotel.price}/night</Badge>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {hotel.features.slice(0, 2).map((f, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">{f}</Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    <span className="font-medium">Best for:</span> {hotel.bestFor}
                  </p>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-xs">
                    {hotel.value}
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

// Dining Section
function DiningSection() {
  const restaurants = [
    { name: "Sushi Samba", type: "Japanese-Brazilian", location: "St. Regis", price: "AED 400+", highlight: "Skyline views" },
    { name: "The Maine Oyster Bar", type: "Seafood", location: "DoubleTree", price: "AED 350", highlight: "New England vibes" },
    { name: "La Petite Maison", type: "French", location: "DIFC", price: "AED 450", highlight: "Power lunch spot" },
    { name: "Zuma", type: "Japanese", location: "DIFC", price: "AED 500+", highlight: "Dubai institution" },
    { name: "Canal-side restaurants", type: "Various", location: "Canal Walk", price: "AED 150-300", highlight: "Waterfront dining" },
    { name: "Florentina", type: "Italian", location: "Four Seasons", price: "AED 350", highlight: "Elegant Italian" },
    { name: "Joe's Cafe", type: "Casual American", location: "Various", price: "AED 80", highlight: "All-day brunch" },
    { name: "Food Trucks", type: "Street food", location: "Canal area", price: "AED 40-80", highlight: "Budget-friendly" },
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
              <Utensils className="w-3 h-3 mr-1" /> Waterfront Dining
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Where to Eat</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Canal-side restaurants, rooftop bars, and DIFC's finest - all within reach
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {restaurants.map((restaurant, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="p-5 h-full">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold">{restaurant.name}</h3>
                    <Badge variant="outline" className="text-xs">{restaurant.price}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{restaurant.type}</p>
                  <p className="text-xs text-muted-foreground mb-2">{restaurant.location}</p>
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs">
                    {restaurant.highlight}
                  </Badge>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Card className="inline-block p-4 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
              <p className="text-sm text-purple-700 dark:text-purple-300">
                <strong>Pro Tip:</strong> Walk the canal promenade to browse menus and ambiance before choosing!
              </p>
            </Card>
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
      title: "Canal Sunset Walk",
      description: "The most romantic free activity in Dubai - watch the skyline light up",
      price: "FREE",
      time: "6-8 PM",
    },
    {
      title: "Rooftop Bar Hopping",
      description: "Level 43, Mercury Lounge, Pure Sky - Burj Khalifa views with cocktails",
      price: "AED 100-200",
      time: "Evening",
    },
    {
      title: "Dubai Fountain (nearby)",
      description: "Just 5 min to Downtown for the famous fountain shows",
      price: "FREE",
      time: "Every 30 min from 6 PM",
    },
    {
      title: "DIFC Art Galleries",
      description: "Contemporary art scene in the financial district",
      price: "FREE",
      time: "Anytime",
    },
    {
      title: "Morning Jog",
      description: "3.2km canal path - the best urban running route in Dubai",
      price: "FREE",
      time: "6-8 AM",
    },
    {
      title: "Water Taxi Experience",
      description: "Traditional abra ride with modern views",
      price: "AED 3-10",
      time: "Anytime",
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
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold">{activity.title}</h3>
                    <Badge variant="secondary">{activity.price}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{activity.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{activity.time}</span>
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
              <Car className="w-3 h-3 mr-1" /> Getting Around
            </Badge>
            <h2 className="text-4xl font-bold mb-4">Transportation</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div variants={itemVariants}>
              <Card className="p-6 h-full text-center">
                <Train className="w-10 h-10 mx-auto mb-4 text-purple-500" />
                <h3 className="font-bold text-lg mb-2">Business Bay Metro</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Red Line station with direct access to Downtown, Mall of Emirates
                </p>
                <Badge variant="secondary">AED 4-8.50</Badge>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-6 h-full text-center">
                <Car className="w-10 h-10 mx-auto mb-4 text-purple-500" />
                <h3 className="font-bold text-lg mb-2">Taxi / Careem</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  To Downtown: 5 min / AED 15<br/>
                  To Dubai Mall: 5-10 min / AED 20
                </p>
                <Badge variant="secondary">Most convenient</Badge>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-6 h-full text-center">
                <MapPin className="w-10 h-10 mx-auto mb-4 text-purple-500" />
                <h3 className="font-bold text-lg mb-2">Walking</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Canal promenade walkable. Downtown Dubai Fountain: 15-20 min walk
                </p>
                <Badge variant="secondary">Best for canal area</Badge>
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
              <TabsTrigger value="peak" data-testid="tab-peak-bb">Peak Season</TabsTrigger>
              <TabsTrigger value="shoulder" data-testid="tab-shoulder-bb">Shoulder</TabsTrigger>
              <TabsTrigger value="summer" data-testid="tab-summer-bb">Summer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="peak">
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Sun className="w-8 h-8 text-purple-500" />
                  <div>
                    <h3 className="text-xl font-bold">November - March</h3>
                    <p className="text-muted-foreground">Perfect outdoor weather</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  20-28°C, ideal for canal walks, rooftop bars, and outdoor dining. Hotels book up for major events.
                </p>
              </Card>
            </TabsContent>
            
            <TabsContent value="shoulder">
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <CloudSun className="w-8 h-8 text-purple-500" />
                  <div>
                    <h3 className="text-xl font-bold">April, October</h3>
                    <p className="text-muted-foreground">Great value period</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  28-35°C, evenings pleasant for canal dining. 20-40% hotel discounts vs peak.
                </p>
              </Card>
            </TabsContent>
            
            <TabsContent value="summer">
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Thermometer className="w-8 h-8 text-red-500" />
                  <div>
                    <h3 className="text-xl font-bold">May - September</h3>
                    <p className="text-muted-foreground">Hot but best deals</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  38-45°C outside, but Business Bay is perfect - air-conditioned malls, rooftop pools, evening canal walks. 50-70% off hotels!
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
      icon: CreditCard,
      title: "Budget Strategy",
      description: "Stay in Business Bay, play in Downtown - 5 min to Dubai Mall but 30-40% cheaper hotels",
    },
    {
      icon: Wifi,
      title: "Digital Nomad Friendly",
      description: "Excellent WiFi everywhere, coworking spaces, laptop-friendly cafes along the canal",
    },
    {
      icon: Clock,
      title: "Best Photo Times",
      description: "Sunset (5-6 PM) for golden hour canal shots, blue hour (6-7 PM) for city lights",
    },
    {
      icon: Coffee,
      title: "Rooftop Happy Hours",
      description: "Many rooftop bars offer 5-8 PM happy hours - Burj Khalifa views at half price",
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
                  <tip.icon className="w-10 h-10 mx-auto mb-4 text-purple-500" />
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
      question: "Why choose Business Bay over Downtown Dubai?",
      answer: "Hotels are 30-40% cheaper, you're only 5 minutes from Downtown attractions, and you get Dubai Canal waterfront access that Downtown doesn't have. Smart travelers stay here.",
    },
    {
      question: "Is Business Bay walkable?",
      answer: "The canal area is very walkable with 3.2km of promenade. You can walk to Downtown/Dubai Mall in 15-20 min. For other areas, metro or taxi recommended.",
    },
    {
      question: "Is there beach access from Business Bay?",
      answer: "No beach in Business Bay. JBR Beach is 15-20 min by taxi. But the Dubai Canal offers its own waterfront experience.",
    },
    {
      question: "Is Business Bay safe?",
      answer: "Very safe. It's a modern business district with 24/7 security, well-lit promenades, and family-friendly during evenings and weekends.",
    },
    {
      question: "Best area in Business Bay to stay?",
      answer: "Near Business Bay Metro for convenience, or canal-side for views and dining. Both offer easy Downtown access.",
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
                  data-testid={`faq-trigger-${index}-bb`}
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
    <section className="py-20 bg-gradient-to-r from-purple-600 via-indigo-600 to-slate-700">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Discover Business Bay
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Dubai's smartest address - Downtown luxury at insider prices, 
            with the stunning Dubai Canal as your backyard.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/districts">
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-white/90 gap-2"
                data-testid="button-explore-more-bb"
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

export default function DistrictBusinessBay() {
  const { isRTL } = useLocale();
  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <PublicNav variant="transparent" />
      <HeroSection />
      <QuickNavSection />
      <OverviewSection />
      <CanalSection />
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
