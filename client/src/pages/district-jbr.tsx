import { Link } from "wouter";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { motion } from "framer-motion";
import { 
  MapPin, Building2, Star, ArrowRight, Clock, Users, Camera, 
  Utensils, Bed, ShoppingBag, Train, Car, Footprints, Sparkles,
  ChevronDown, Check, X, Sun, Moon, Sunset, Thermometer,
  Phone, Shield, Wifi, CreditCard, Droplets, Umbrella, IceCream,
  Calendar, Heart, Map, Bookmark, Waves, Shirt, Baby
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

const waterSports = [
  {
    name: "Jet Skiing",
    duration: "15-60 min",
    price: "AED 200-500",
    age: "16+ solo, 6+ tandem",
    description: "Speed across the Arabian Gulf with stunning Marina skyline views",
    tip: "Negotiate prices when booking multiple activities"
  },
  {
    name: "Parasailing",
    duration: "10-15 min",
    price: "AED 300-500",
    age: "6+ with adult",
    description: "Soar 200 feet above JBR for incredible aerial views of Palm Jumeirah",
    tip: "Go for tandem or triple flights with friends for more fun"
  },
  {
    name: "Flyboarding",
    duration: "15-30 min",
    price: "AED 400-600",
    age: "14+",
    description: "Iron Man-style water jetpack experience - unforgettable thrill",
    tip: "Beginner sessions available with full instruction"
  },
  {
    name: "Paddleboarding",
    duration: "Hourly rental",
    price: "AED 100-150",
    age: "All ages",
    description: "Peaceful way to explore the calm Gulf waters at sunrise",
    tip: "Early morning has the calmest water"
  },
  {
    name: "Banana Boat",
    duration: "10-15 min",
    price: "AED 100-150 per person",
    age: "All ages",
    description: "Fun, bouncy group ride - perfect for families and friends",
    tip: "Hold tight and expect to get wet!"
  },
  {
    name: "Kayaking",
    duration: "Hourly rental",
    price: "AED 80-120",
    age: "All ages",
    description: "Single or double kayaks for a leisurely paddle along the beach",
    tip: "Great for couples and families"
  }
];

const restaurants = [
  {
    name: "The Meat Co",
    cuisine: "South African Steakhouse",
    priceRange: "AED 200-400",
    specialty: "Premium steaks with beachfront terrace",
    vibe: "Upscale casual"
  },
  {
    name: "Shake Shack",
    cuisine: "Gourmet Burgers",
    priceRange: "AED 60-100",
    specialty: "ShackBurger, crinkle fries, frozen custard",
    vibe: "Quick casual"
  },
  {
    name: "Paul Bakery",
    cuisine: "French Cafe",
    priceRange: "AED 80-150",
    specialty: "Croissants, coffee, French sandwiches",
    vibe: "Breakfast spot"
  },
  {
    name: "PF Chang's",
    cuisine: "Asian Fusion",
    priceRange: "AED 150-250",
    specialty: "Lettuce wraps, Mongolian beef, shareable plates",
    vibe: "Family dining"
  },
  {
    name: "Carluccio's",
    cuisine: "Italian",
    priceRange: "AED 120-200",
    specialty: "Pasta, pizzas, outdoor terrace",
    vibe: "Family-friendly"
  },
  {
    name: "Operation Falafel",
    cuisine: "Lebanese",
    priceRange: "AED 40-80",
    specialty: "Authentic falafel wraps and mezze - best value",
    vibe: "Budget-friendly"
  }
];

const hotels = [
  {
    name: "The Ritz-Carlton Dubai",
    category: "Ultra-Luxury",
    priceRange: "AED 1,500+",
    highlights: ["Private beach", "World-class spa", "Kids club", "Beachfront pools"],
    bestFor: "Luxury beach vacation, families"
  },
  {
    name: "JA Ocean View Hotel",
    category: "Luxury",
    priceRange: "AED 700+",
    highlights: ["Contemporary design", "Beach access", "Connected to The Walk"],
    bestFor: "Families, convenient location"
  },
  {
    name: "Amwaj Rotana",
    category: "Mid-Luxury",
    priceRange: "AED 500+",
    highlights: ["Direct beach access", "Family pools", "Spacious rooms"],
    bestFor: "Families, beach focus"
  },
  {
    name: "Hilton Dubai The Walk",
    category: "Mid-Range",
    priceRange: "AED 400+",
    highlights: ["Central JBR", "Rooftop pool", "Reliable brand"],
    bestFor: "Beach + dining convenience"
  }
];

const faqs = [
  {
    question: "Is JBR Beach free?",
    answer: "Yes! JBR Beach is completely free to access with free showers, changing rooms, and lifeguard supervision. Sun loungers and umbrellas can be rented for AED 25-60 if desired."
  },
  {
    question: "What is the JBR Splash Pad?",
    answer: "The JBR Splash Pad is a FREE water play area for kids located on the beach near the Ritz-Carlton. It features ground fountains, water jets, and spray features - perfect for toddlers to 10-year-olds."
  },
  {
    question: "What's the difference between JBR and The Walk JBR?",
    answer: "JBR (Jumeirah Beach Residence) is the entire beachfront district including 40 residential towers. 'The Walk JBR' is the 1.7km outdoor pedestrian boulevard with shops and restaurants that runs parallel to the beach."
  },
  {
    question: "How do I get to JBR?",
    answer: "JBR is served by Dubai Tram (JBR 1 & JBR 2 stations) which connects to Dubai Metro. Taxis and ride-shares (Uber, Careem) are readily available. Parking is limited and can be expensive."
  },
  {
    question: "Is JBR family-friendly?",
    answer: "Absolutely! JBR is one of Dubai's best family destinations with a free splash pad, safe swimming areas, ice cream shops, family restaurants, and the beach is well-supervised by lifeguards."
  },
  {
    question: "What are the best water sports at JBR?",
    answer: "JBR offers jet skiing, parasailing, flyboarding, banana boats, paddleboarding, and kayaking. Multiple operators are stationed along the beach. Prices are negotiable, especially for combo packages."
  },
  {
    question: "When is JBR least crowded?",
    answer: "Sunday to Wednesday mornings are the quietest times. Friday and Saturday (UAE weekend) see the biggest crowds, especially in the afternoon and evening. Arrive before 9 AM on weekends for the best experience."
  }
];

function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920"
          alt="JBR Beach with Dubai skyline"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/30 via-transparent to-yellow-900/20" />
      </div>
      
      <motion.div
        className="absolute top-1/4 right-1/3 w-64 h-64 rounded-full bg-cyan-400/20 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-16 pt-32">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-2 text-white/60 text-sm mb-6">
            <Link href="/" className="hover:text-white transition-colors" data-testid="link-breadcrumb-home">Home</Link>
            <span>/</span>
            <Link href="/districts" className="hover:text-white transition-colors" data-testid="link-breadcrumb-districts">Districts</Link>
            <span>/</span>
            <span className="text-white">JBR</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="bg-gradient-to-r from-cyan-500 to-yellow-500 text-white border-0 text-sm px-4 py-1">
              <Waves className="w-3 h-3 mr-1" /> #1 Beach District
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30">
              <Sun className="w-3 h-3 mr-1" /> Free Public Beach
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight">
            JBR
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-yellow-200">
              Beach
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mb-8 leading-relaxed">
            Dubai's ultimate beach destination. 1.7km of pristine sand, buzzing promenade, 
            water sports, splash pad, and 100+ beachfront restaurants.
          </p>
          
          <div className="flex flex-wrap gap-6 mb-8">
            {[
              { icon: Waves, label: "1.7km Beach" },
              { icon: Baby, label: "FREE Splash Pad" },
              { icon: Utensils, label: "100+ Restaurants" },
              { icon: ShoppingBag, label: "Beachfront Shopping" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 text-white/80">
                <stat.icon className="w-5 h-5" />
                <span className="font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-yellow-500 text-white border-0 hover:opacity-90 gap-2 text-lg px-8"
              data-testid="button-plan-visit"
            >
              <Calendar className="w-5 h-5" />
              Plan Beach Day
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
    { icon: Waves, label: "Beach", href: "#beach" },
    { icon: Umbrella, label: "Water Sports", href: "#water-sports" },
    { icon: ShoppingBag, label: "The Walk", href: "#the-walk" },
    { icon: Utensils, label: "Dining", href: "#dining" },
    { icon: Bed, label: "Hotels", href: "#hotels" },
    { icon: Calendar, label: "Best Time", href: "#best-time" },
    { icon: Sparkles, label: "Tips", href: "#tips" },
  ];
  
  return (
    <section className="sticky top-0 z-[100] bg-background/95 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
          {navItems.map((item) => (
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
          className="grid lg:grid-cols-2 gap-12"
        >
          <motion.div variants={fadeInUp}>
            <Badge className="mb-4 bg-cyan-500/10 text-cyan-600 border-cyan-500/20">
              <Waves className="w-3 h-3 mr-1" /> Overview
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Dubai's Ultimate Beach Destination</h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              <strong>JBR (Jumeirah Beach Residence)</strong> is Dubai's most vibrant beachfront community, 
              where 1.7km of pristine public beach meets a buzzing outdoor promenade packed with restaurants, 
              cafes, and shops. This is where <strong>Dubai beach life</strong> reaches its peak.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Families building sandcastles, water sports enthusiasts riding jet skis, joggers on the beach path, 
              and diners enjoying alfresco meals with their toes practically in the sand - JBR has it all, 
              and the beach is completely <strong>FREE</strong>.
            </p>
          </motion.div>
          
          <motion.div variants={fadeInUp} className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" /> Perfect For
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Beach lovers",
                    "Families with kids",
                    "Active travelers",
                    "Foodies",
                    "Social butterflies",
                    "First-time Dubai visitors",
                    "Digital nomads",
                    "Fitness enthusiasts"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <X className="w-5 h-5 text-orange-500" /> Not Ideal For
                </h3>
                <div className="space-y-2">
                  {[
                    "Seeking quiet solitude (JBR is lively)",
                    "Dubai's iconic landmarks (visit Downtown)",
                    "Sand-free vacation",
                    "Avoiding crowds (especially weekends)"
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <X className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function BeachSection() {
  return (
    <section className="py-16 px-6 bg-gradient-to-b from-cyan-50/50 to-background dark:from-cyan-950/20" id="beach">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-cyan-500/10 text-cyan-600 border-cyan-500/20">
            <Waves className="w-3 h-3 mr-1" /> JBR Beach
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Dubai's Best Public Beach - FREE</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            1.7km of pristine white sand with full facilities, lifeguards, and the famous FREE splash pad for kids.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { icon: Waves, title: "Beach Specs", value: "1.7km", desc: "Pristine white sand" },
            { icon: Shield, title: "Lifeguards", value: "On Duty", desc: "8 AM - 6 PM daily" },
            { icon: Baby, title: "Splash Pad", value: "FREE", desc: "Water play for kids" },
            { icon: CreditCard, title: "Entry", value: "FREE", desc: "Public beach access" }
          ].map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6 text-center">
                <stat.icon className="w-8 h-8 text-cyan-500 mx-auto mb-3" />
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm font-medium">{stat.title}</p>
                <p className="text-xs text-muted-foreground">{stat.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">FREE Beach Facilities</h3>
              <ul className="space-y-2">
                {[
                  "Fresh water shower stations",
                  "Clean public toilets & changing rooms", 
                  "Lifeguard supervision",
                  "Wheelchair accessible pathways",
                  "First aid stations",
                  "Trash bins throughout"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" /> {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Optional Rentals</h3>
              <ul className="space-y-2">
                {[
                  { item: "Beach umbrella", price: "AED 25-40" },
                  { item: "Sun lounger", price: "AED 40-60" },
                  { item: "Private cabana", price: "AED 200+" },
                  { item: "Beach towel", price: "AED 15-25" }
                ].map((rental) => (
                  <li key={rental.item} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <Umbrella className="w-4 h-4 text-cyan-500" /> {rental.item}
                    </span>
                    <span className="text-muted-foreground">{rental.price}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-gradient-to-r from-pink-500/10 to-cyan-500/10 border-pink-500/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Baby className="w-6 h-6 text-pink-500 shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">The Famous JBR Splash Pad - FREE!</h4>
                <p className="text-sm text-muted-foreground">
                  Located near the Ritz-Carlton, this FREE water play area features ground fountains, water jets, and spray features. 
                  Perfect for toddlers to 10-year-olds. Busiest 4-7 PM. Bring swim diapers for babies and towels for quick drying.
                  <strong> This splash pad makes JBR THE top family beach in Dubai.</strong>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function WaterSportsSection() {
  return (
    <section className="py-16 px-6" id="water-sports">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-blue-500/10 text-blue-600 border-blue-500/20">
            <Waves className="w-3 h-3 mr-1" /> Water Sports
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Beach Activities</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            JBR Beach offers Dubai's most extensive water sports menu - all available right on the public beach.
          </p>
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {waterSports.map((sport) => (
            <motion.div key={sport.name} variants={fadeInUp}>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-2">{sport.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{sport.description}</p>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{sport.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium text-cyan-600">{sport.price}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Age:</span>
                      <span className="font-medium">{sport.age}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                    <Sparkles className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                    <p className="text-xs">{sport.tip}</p>
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

function TheWalkSection() {
  return (
    <section className="py-16 px-6 bg-muted/30" id="the-walk">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-orange-500/10 text-orange-600 border-orange-500/20">
            <ShoppingBag className="w-3 h-3 mr-1" /> The Walk JBR
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Dubai's Liveliest Promenade</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            1.7km outdoor pedestrian boulevard running parallel to the beach - European Riviera meets Miami Beach.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            {
              icon: ShoppingBag,
              title: "Shopping",
              items: ["Zara, Mango, H&M", "Beach boutiques & swimwear", "Sports stores (Nike, Adidas)", "Souvenir shops"]
            },
            {
              icon: Utensils,
              title: "Dining",
              items: ["100+ restaurants & cafes", "All outdoor terraces", "Budget to upscale", "Beach views everywhere"]
            },
            {
              icon: Sparkles,
              title: "Entertainment",
              items: ["Street performers (weekends)", "Kids' play areas", "Beach access points", "Live entertainment"]
            }
          ].map((section) => (
            <Card key={section.title}>
              <CardContent className="p-6">
                <section.icon className="w-8 h-8 text-orange-500 mb-4" />
                <h3 className="font-semibold text-lg mb-3">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-orange-500/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-orange-500 shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">Best Times to Visit The Walk</h4>
                <p className="text-sm text-muted-foreground">
                  <strong>Morning:</strong> Coffee and breakfast, quieter atmosphere. 
                  <strong> Afternoon:</strong> Air-conditioned store shopping. 
                  <strong> Evening (6-11 PM):</strong> Most atmospheric! Sunset views, live entertainment, buzzing energy.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function DiningSection() {
  return (
    <section className="py-16 px-6" id="dining">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-red-500/10 text-red-600 border-red-500/20">
            <Utensils className="w-3 h-3 mr-1" /> Dining
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Where to Eat</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            100+ dining options from budget to upscale - all with outdoor terraces and beach proximity.
          </p>
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {restaurants.map((restaurant) => (
            <motion.div key={restaurant.name} variants={fadeInUp}>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="text-xs">{restaurant.cuisine}</Badge>
                    <span className="text-sm text-muted-foreground">{restaurant.priceRange}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{restaurant.specialty}</p>
                  <p className="text-xs text-muted-foreground italic">{restaurant.vibe}</p>
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
    <section className="py-16 px-6 bg-muted/30" id="hotels">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-purple-500/10 text-purple-600 border-purple-500/20">
            <Bed className="w-3 h-3 mr-1" /> Where to Stay
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Best JBR Hotels</h2>
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-6"
        >
          {hotels.map((hotel) => (
            <motion.div key={hotel.name} variants={fadeInUp}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{hotel.name}</h3>
                      <Badge variant="outline" className="mt-1">{hotel.category}</Badge>
                    </div>
                    <span className="text-sm font-semibold text-purple-600">{hotel.priceRange}</span>
                  </div>
                  
                  <ul className="space-y-2 mb-4">
                    {hotel.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-green-500" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  
                  <p className="text-sm text-muted-foreground">
                    <strong>Best for:</strong> {hotel.bestFor}
                  </p>
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
    <section className="py-16 px-6" id="best-time">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            <Sun className="w-3 h-3 mr-1" /> Best Time
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">When to Visit</h2>
        </motion.div>
        
        <Tabs defaultValue="time" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="time" data-testid="tab-by-time">By Time of Day</TabsTrigger>
            <TabsTrigger value="season" data-testid="tab-by-season">By Season</TabsTrigger>
          </TabsList>
          
          <TabsContent value="time">
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  icon: Sun,
                  time: "Sunrise",
                  hours: "6-8 AM",
                  vibe: "Peaceful, best for photos",
                  activities: ["Jogging", "Photography", "Yoga"]
                },
                {
                  icon: Thermometer,
                  time: "Morning",
                  hours: "8-11 AM",
                  vibe: "Comfortable, fewer crowds",
                  activities: ["Swimming", "Water sports", "Beach walk"]
                },
                {
                  icon: Sunset,
                  time: "Late Afternoon",
                  hours: "4-6 PM",
                  vibe: "Golden hour, cooling down",
                  activities: ["Beach time", "Photography", "Cafe time"]
                },
                {
                  icon: Moon,
                  time: "Evening",
                  hours: "6 PM+",
                  vibe: "Cooler, romantic, skyline lit",
                  activities: ["Dining", "The Walk", "Sunset watching"]
                }
              ].map((period) => (
                <Card key={period.time}>
                  <CardContent className="p-6 text-center">
                    <period.icon className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                    <h3 className="font-bold mb-1">{period.time}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{period.hours}</p>
                    <p className="text-xs text-muted-foreground italic mb-3">{period.vibe}</p>
                    <div className="flex flex-wrap justify-center gap-1">
                      {period.activities.map((a) => (
                        <Badge key={a} variant="secondary" className="text-xs">{a}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="season">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  season: "Winter",
                  months: "Nov - Mar",
                  temp: "20-30°C",
                  verdict: "BEST TIME",
                  color: "border-green-500",
                  desc: "Perfect beach weather. Peak season with best conditions for all outdoor activities."
                },
                {
                  season: "Summer",
                  months: "Jun - Sep",
                  temp: "40-45°C",
                  verdict: "AVOID",
                  color: "border-red-500",
                  desc: "Too hot for beach. Focus on indoor activities, AC malls, hotel pools."
                },
                {
                  season: "Shoulder",
                  months: "Apr-May, Oct",
                  temp: "30-38°C",
                  verdict: "OK",
                  color: "border-yellow-500",
                  desc: "Early morning and evening beach OK. Midday too hot. Good hotel deals."
                }
              ].map((season) => (
                <Card key={season.season} className={`border-t-4 ${season.color}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold">{season.season}</h3>
                      <Badge variant="outline">{season.verdict}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{season.months} | {season.temp}</p>
                    <p className="text-sm text-muted-foreground">{season.desc}</p>
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

function TipsSection() {
  return (
    <section className="py-16 px-6 bg-muted/30" id="tips">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-pink-500/10 text-pink-600 border-pink-500/20">
            <Sparkles className="w-3 h-3 mr-1" /> Insider Tips
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Practical Information</h2>
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { icon: Sun, title: "Sunscreen", info: "SPF 50+ essential. UAE sun is intense. Reapply every 2 hours." },
            { icon: Shirt, title: "Dress Code", info: "Swimwear on beach only. Cover up for The Walk and restaurants." },
            { icon: CreditCard, title: "Payments", info: "Cards accepted everywhere. AED cash for beach vendors." },
            { icon: Droplets, title: "Hydration", info: "Carry water always. Free water fountains along The Walk." },
            { icon: Calendar, title: "Crowds", info: "Fri-Sat busiest. Sun-Wed mornings are quietest." },
            { icon: Train, title: "Transport", info: "Dubai Tram serves JBR. Parking is limited and expensive." },
            { icon: Phone, title: "Emergency", info: "Police: 999, Ambulance: 998" },
            { icon: Wifi, title: "WiFi", info: "Free WiFi at most cafes and hotels" }
          ].map((tip) => (
            <motion.div key={tip.title} variants={fadeInUp}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <tip.icon className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground">{tip.info}</p>
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

function FAQSection() {
  return (
    <section className="py-16 px-6" id="faq">
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
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920"
              alt="JBR Beach at sunset"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/90 to-yellow-500/90" />
          </div>
          
          <div className="relative z-10 p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Ready for Beach Paradise?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Sun, sand, splash pad, and spectacular dining await at JBR. Dubai's ultimate beach destination is calling.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg"
                className="bg-white text-cyan-600 hover:bg-white/90 gap-2 text-lg px-8"
                data-testid="button-cta-plan-beach"
              >
                <Calendar className="w-5 h-5" />
                Plan Beach Day
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

export default function DistrictJBR() {
  const { isRTL } = useLocale();
  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <PublicNav variant="transparent" />
      <HeroSection />
      <QuickNavSection />
      <OverviewSection />
      <BeachSection />
      <WaterSportsSection />
      <TheWalkSection />
      <DiningSection />
      <HotelsSection />
      <BestTimeSection />
      <TipsSection />
      <FAQSection />
      <CTASection />
      <PublicFooter />
    </div>
  );
}
