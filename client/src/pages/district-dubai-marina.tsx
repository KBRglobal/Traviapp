import { Link } from "wouter";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { motion } from "framer-motion";
import { 
  MapPin, Building2, Star, ArrowRight, Clock, Users, Camera, 
  Utensils, Bed, ShoppingBag, Train, Car, Footprints, Sparkles,
  ChevronDown, Check, X, Sun, Moon, Sunset, Thermometer,
  Phone, Shield, Wifi, CreditCard, Droplets, Anchor, Ship,
  Calendar, Heart, Map, Navigation, Bookmark, Waves, Sailboat
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
    name: "JBR Beach",
    category: "Beach",
    rating: 4.9,
    description: "1.7km pristine public beach with water sports, splash pad, and stunning views",
    duration: "Half day",
    cost: "Free",
    bestTime: "Morning or sunset",
    highlights: ["Free public beach", "Water sports", "Kids splash pad", "Beachfront dining"],
    proTip: "Arrive early on weekends to secure a good spot. The water is calmest before 10 AM."
  },
  {
    name: "Marina Walk",
    category: "Promenade",
    rating: 4.8,
    description: "7km waterfront promenade with 80+ restaurants, cafes, and yacht views",
    duration: "2-4 hours",
    cost: "Free (dining extra)",
    bestTime: "Sunset to evening",
    highlights: ["Yacht watching", "Outdoor dining", "Jogging path", "Night photography"],
    proTip: "The west side has the best restaurants. Complete the full 7km loop for a great workout."
  },
  {
    name: "The Walk JBR",
    category: "Shopping",
    rating: 4.7,
    description: "1.7km outdoor shopping and dining boulevard parallel to the beach",
    duration: "2-3 hours",
    cost: "Free entry",
    bestTime: "Evening",
    highlights: ["Street performers", "Outdoor dining", "Beach access", "Night markets"],
    proTip: "Thursday and Friday evenings have the best atmosphere with live entertainment."
  },
  {
    name: "Marina Dhow Cruise",
    category: "Experience",
    rating: 4.6,
    description: "Traditional wooden boat dinner cruise through the illuminated marina",
    duration: "2 hours",
    cost: "AED 150-300",
    bestTime: "Evening",
    highlights: ["Buffet dinner", "Skyline views", "Live entertainment", "Photo opportunities"],
    proTip: "Book the upper deck for the best views. Sunset cruises are the most popular."
  },
  {
    name: "Skydive Dubai",
    category: "Adventure",
    rating: 4.9,
    description: "Tandem skydive over Palm Jumeirah with stunning aerial views",
    duration: "3-4 hours",
    cost: "AED 1,800-2,200",
    bestTime: "Morning",
    highlights: ["Palm Jumeirah views", "Video included", "Expert instructors", "Bucket list experience"],
    proTip: "Book well in advance, especially during winter season. Morning jumps have clearest views."
  }
];

const hotels = [
  {
    name: "Address Dubai Marina",
    category: "Ultra-Luxury",
    priceRange: "AED 1,200+",
    highlights: ["Panoramic marina views", "Rooftop infinity pool", "Central location"],
    bestFor: "Luxury couples, Instagram-worthy stays"
  },
  {
    name: "The Ritz-Carlton Dubai",
    category: "Ultra-Luxury",
    priceRange: "AED 1,500+",
    highlights: ["Private beach access", "Award-winning spa", "Kids club"],
    bestFor: "Beach-focused luxury, families"
  },
  {
    name: "Grosvenor House",
    category: "Luxury",
    priceRange: "AED 900+",
    highlights: ["Two towers", "Buddha Bar on-site", "Spacious suites"],
    bestFor: "Nightlife access, groups"
  },
  {
    name: "Rove Dubai Marina",
    category: "Mid-Range",
    priceRange: "AED 350+",
    highlights: ["Modern design", "Rooftop pool", "Near metro"],
    bestFor: "Budget travelers, young couples"
  }
];

const restaurants = [
  {
    name: "Pier 7",
    cuisine: "Multi-concept",
    priceRange: "AED 200-500",
    specialty: "Seven floors, seven restaurants with marina views",
    vibe: "Upscale dining destination"
  },
  {
    name: "Asia Asia",
    cuisine: "Pan-Asian",
    priceRange: "AED 250-400",
    specialty: "Dim sum, sushi, and Asian fusion on the waterfront",
    vibe: "Trendy, social"
  },
  {
    name: "BiCE Mare",
    cuisine: "Italian Seafood",
    priceRange: "AED 300-500",
    specialty: "Fresh seafood, homemade pasta, marina views",
    vibe: "Romantic, upscale"
  },
  {
    name: "The Scene by Simon Rimmer",
    cuisine: "British",
    priceRange: "AED 150-300",
    specialty: "British comfort food, shisha terrace",
    vibe: "Casual, people-watching"
  },
  {
    name: "Operation Falafel",
    cuisine: "Lebanese",
    priceRange: "AED 50-100",
    specialty: "Authentic falafel wraps and mezze",
    vibe: "Casual, budget-friendly"
  }
];

const faqs = [
  {
    question: "Is JBR Beach free?",
    answer: "Yes! JBR Beach is completely free to access. It's one of Dubai's best public beaches with free showers, changing rooms, and lifeguard supervision. Sun lounger and umbrella rentals are available for a fee."
  },
  {
    question: "How do I get to Dubai Marina?",
    answer: "Dubai Marina is easily accessible via the Red Line Metro (DMCC station) or Dubai Tram (Marina stations). Taxis and ride-shares are readily available. From Downtown Dubai, it's about 20 minutes by metro."
  },
  {
    question: "What's the difference between Dubai Marina and JBR?",
    answer: "Dubai Marina refers to the canal and promenade area with yacht berths and Marina Walk. JBR (Jumeirah Beach Residence) is the beachfront area with The Walk JBR and JBR Beach. They're adjacent and often visited together."
  },
  {
    question: "Is Dubai Marina good for families?",
    answer: "Absolutely! JBR Beach has a free kids splash pad, calm swimming waters, and family-friendly restaurants. The Walk JBR has ice cream shops and entertainment. Many hotels have excellent kids clubs."
  },
  {
    question: "What's the best time to visit Dubai Marina?",
    answer: "November to March offers the best weather for beach activities. Visit Marina Walk at sunset for the best atmosphere. Avoid midday in summer when temperatures exceed 40°C."
  },
  {
    question: "Are there water sports at JBR Beach?",
    answer: "Yes! JBR Beach offers jet skiing, parasailing, flyboarding, banana boats, kayaking, and paddleboarding. Operators are stationed along the beach with equipment and instruction available."
  }
];

function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1920"
          alt="Dubai Marina skyline with yachts"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-transparent to-cyan-900/30" />
      </div>
      
      <motion.div
        className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl"
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
            <span className="text-white">Dubai Marina</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 text-sm px-4 py-1">
              <Anchor className="w-3 h-3 mr-1" /> Waterfront District
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30">
              <Waves className="w-3 h-3 mr-1" /> Beach Access
            </Badge>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 tracking-tight">
            Dubai
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-cyan-200">
              Marina
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mb-8 leading-relaxed">
            Where urban sophistication meets beachfront lifestyle. The world's largest engineered marina, 
            stunning promenades, and direct access to JBR Beach.
          </p>
          
          <div className="flex flex-wrap gap-6 mb-8">
            {[
              { icon: Waves, label: "1.7km Beach" },
              { icon: Sailboat, label: "120+ Yachts" },
              { icon: Utensils, label: "100+ Restaurants" },
              { icon: ShoppingBag, label: "130+ Shops" },
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
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:opacity-90 gap-2 text-lg px-8"
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
    { icon: Camera, label: "Attractions", href: "#attractions" },
    { icon: Bed, label: "Hotels", href: "#hotels" },
    { icon: Utensils, label: "Dining", href: "#dining" },
    { icon: Train, label: "Getting Around", href: "#transport" },
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
            <Badge className="mb-4 bg-blue-500/10 text-blue-600 border-blue-500/20">
              <Anchor className="w-3 h-3 mr-1" /> Overview
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Dubai's Stunning Waterfront Playground</h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Dubai Marina is where <strong>urban sophistication meets beachfront lifestyle</strong>. This man-made marvel 
              features the world's largest engineered marina, a stunning 3km waterfront promenade lined with restaurants, 
              direct access to JBR Beach, and some of Dubai's most impressive residential skyscrapers.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Whether you're planning your Dubai vacation with beach access in mind, searching for the best Dubai beaches, 
              or looking for a more relaxed alternative to Downtown Dubai, Dubai Marina delivers the perfect blend of 
              sand, sea, and spectacular skyline views.
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
                    "Active travelers",
                    "Foodies",
                    "Nightlife enthusiasts",
                    "Couples",
                    "Families wanting beach",
                    "Digital nomads",
                    "Water sports fans"
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
                    "Iconic landmarks (no Burj Khalifa equivalent)",
                    "Heritage seekers (modern development)",
                    "Ultra-quiet retreat (lively area)",
                    "Tight budgets (mid-high range)"
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
    <section className="py-16 px-6 bg-gradient-to-b from-blue-50/50 to-background dark:from-blue-950/20" id="beach">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-blue-500/10 text-blue-600 border-blue-500/20">
            <Waves className="w-3 h-3 mr-1" /> JBR Beach
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Dubai's Best Public Beach</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            1.7km of pristine sand, crystal-clear waters, and world-class facilities - completely FREE.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Waves,
              title: "Beach Facilities",
              items: ["Free showers & changing rooms", "Lifeguard supervision", "Wheelchair accessible", "Sun lounger rentals"]
            },
            {
              icon: Sailboat,
              title: "Water Sports",
              items: ["Jet skiing", "Parasailing", "Flyboarding", "Paddleboarding & kayaking"]
            },
            {
              icon: Users,
              title: "Family Features",
              items: ["FREE kids splash pad", "Shallow swimming areas", "Playground equipment", "Family restaurants nearby"]
            }
          ].map((section) => (
            <Card key={section.title}>
              <CardContent className="p-6">
                <section.icon className="w-8 h-8 text-blue-500 mb-4" />
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
        
        <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Sparkles className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold mb-2">Pro Tip: Best Beach Times</h4>
                <p className="text-sm text-muted-foreground">
                  <strong>Sunrise (6-8 AM):</strong> Peaceful, perfect for photos. <strong>Morning (8-11 AM):</strong> Best temperature, fewer crowds. 
                  <strong> Late afternoon (4-6 PM):</strong> Golden hour, beautiful light. Weekends get crowded - arrive early!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function AttractionsSection() {
  return (
    <section className="py-16 px-6" id="attractions">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-cyan-500/10 text-cyan-600 border-cyan-500/20">
            <Camera className="w-3 h-3 mr-1" /> Things to Do
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Top Attractions</h2>
        </motion.div>
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="space-y-6"
        >
          {attractions.map((attraction, index) => (
            <motion.div key={attraction.name} variants={fadeInUp}>
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold">{attraction.name}</h3>
                        <Badge variant="outline">{attraction.category}</Badge>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{attraction.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{attraction.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {attraction.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-4 h-4" /> {attraction.cost}
                        </span>
                        <span className="flex items-center gap-1">
                          <Sun className="w-4 h-4" /> {attraction.bestTime}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {attraction.highlights.map((h) => (
                          <Badge key={h} variant="secondary" className="text-xs">{h}</Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                        <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-sm"><strong>Pro Tip:</strong> {attraction.proTip}</p>
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
    <section className="py-16 px-6 bg-muted/30" id="hotels">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-blue-500/10 text-blue-600 border-blue-500/20">
            <Bed className="w-3 h-3 mr-1" /> Where to Stay
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Best Hotels</h2>
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
                    <span className="text-sm font-semibold text-blue-600">{hotel.priceRange}</span>
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
          <Badge className="mb-4 bg-orange-500/10 text-orange-600 border-orange-500/20">
            <Utensils className="w-3 h-3 mr-1" /> Dining
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Where to Eat</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            100+ restaurants along Marina Walk and The Walk JBR - from casual beachside bites to fine dining.
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

function TransportSection() {
  return (
    <section className="py-16 px-6 bg-muted/30" id="transport">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-green-500/10 text-green-600 border-green-500/20">
            <Train className="w-3 h-3 mr-1" /> Getting Around
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Transportation</h2>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Train,
              title: "Metro & Tram",
              description: "Red Line to DMCC station, then Dubai Tram to Marina stations. Best public transport option.",
              tip: "Dubai Tram connects all major Marina points"
            },
            {
              icon: Car,
              title: "Taxi & Ride-share",
              description: "Uber and Careem widely available. Taxis plentiful along Marina Walk and JBR.",
              tip: "20 minutes from Downtown Dubai"
            },
            {
              icon: Footprints,
              title: "Walking",
              description: "Marina Walk is 7km loop. The Walk JBR is 1.7km. Pedestrian bridges connect areas.",
              tip: "Most attractions within walking distance"
            }
          ].map((transport) => (
            <Card key={transport.title}>
              <CardContent className="p-6">
                <transport.icon className="w-8 h-8 text-green-500 mb-4" />
                <h3 className="font-semibold text-lg mb-2">{transport.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{transport.description}</p>
                <p className="text-xs text-muted-foreground italic">{transport.tip}</p>
              </CardContent>
            </Card>
          ))}
        </div>
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
                  pros: ["Perfect beach weather", "Outdoor activities", "Peak season"],
                  cons: ["Higher prices", "More crowds"]
                },
                {
                  icon: Sun,
                  season: "Summer",
                  months: "Jun - Sep",
                  temp: "40-45°C",
                  verdict: "LOW SEASON",
                  color: "border-orange-500",
                  pros: ["30-50% off hotels", "Fewer crowds", "Indoor malls"],
                  cons: ["Too hot for beach", "Limited outdoor activities"]
                },
                {
                  icon: Sunset,
                  season: "Shoulder",
                  months: "Apr-May, Oct",
                  temp: "30-38°C",
                  verdict: "GOOD VALUE",
                  color: "border-blue-500",
                  pros: ["Moderate prices", "Decent beach weather", "Fewer tourists"],
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
                            <li key={pro} className="flex items-center gap-1">
                              <Check className="w-3 h-3 text-green-500" /> {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-orange-600 mb-1">Cons</p>
                        <ul className="text-sm space-y-1">
                          {season.cons.map((con) => (
                            <li key={con} className="flex items-center gap-1">
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
                {
                  icon: Sun,
                  time: "Morning",
                  hours: "6 AM - 12 PM",
                  activities: ["Beach before crowds", "Marina Walk jogging", "Paddleboarding", "Photography"],
                  tip: "Best time for water sports - calm water and cooler temperatures"
                },
                {
                  icon: Thermometer,
                  time: "Afternoon",
                  hours: "12 PM - 5 PM",
                  activities: ["Mall shopping", "Hotel pool", "Lunch dining", "Indoor attractions"],
                  tip: "Avoid direct sun during summer. Perfect for Dubai Marina Mall"
                },
                {
                  icon: Moon,
                  time: "Evening",
                  hours: "5 PM - 12 AM",
                  activities: ["Sunset at beach", "Marina Walk dining", "Dhow cruise", "Nightlife"],
                  tip: "Most atmospheric time - skyline lights up beautifully"
                }
              ].map((period) => (
                <Card key={period.time}>
                  <CardContent className="p-6">
                    <period.icon className="w-8 h-8 text-blue-500 mb-4" />
                    <h3 className="text-xl font-bold mb-1">{period.time}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{period.hours}</p>
                    <ul className="space-y-2 mb-4">
                      {period.activities.map((activity) => (
                        <li key={activity} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-muted-foreground italic">{period.tip}</p>
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
          <Badge className="mb-4 bg-purple-500/10 text-purple-600 border-purple-500/20">
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
            { icon: Wifi, title: "Free WiFi", info: "Available at malls, most cafes, and hotels" },
            { icon: CreditCard, title: "Currency", info: "AED (Dirhams). Cards widely accepted" },
            { icon: Phone, title: "Emergency", info: "Police: 999, Ambulance: 998" },
            { icon: Shield, title: "Dress Code", info: "Beach attire OK at beach. Modest elsewhere" },
            { icon: Droplets, title: "Hydration", info: "Carry water. UAE sun is intense" },
            { icon: Sun, title: "Sunscreen", info: "SPF 50+ essential. Reapply often" },
            { icon: Calendar, title: "Weekend", info: "Thu-Sat busiest. Sun-Wed quieter" },
            { icon: Train, title: "Parking", info: "Limited & expensive. Use public transport" }
          ].map((tip) => (
            <motion.div key={tip.title} variants={fadeInUp}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <tip.icon className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
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
              src="https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1920"
              alt="Dubai Marina at sunset"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-cyan-600/90" />
          </div>
          
          <div className="relative z-10 p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Ready for Beach Paradise?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Sun, sea, and spectacular skyline views await at Dubai Marina. Start planning your waterfront adventure today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-white/90 gap-2 text-lg px-8"
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

export default function DistrictDubaiMarina() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav variant="transparent" />
      <HeroSection />
      <QuickNavSection />
      <OverviewSection />
      <BeachSection />
      <AttractionsSection />
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
