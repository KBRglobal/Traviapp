import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  MapPin, Building2, Star, ArrowRight, Clock, Users, 
  Utensils, Bed, Train, Sparkles, ChevronDown, Check, X, 
  Sun, ShoppingBag, CreditCard, Map, Home, Coffee, Scissors
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

const indianRestaurants = [
  { name: "Saravana Bhavan", region: "South Indian", specialty: "Dosa, idli, uttapam", price: "AED 8-15" },
  { name: "Calicut Paragon", region: "Kerala", specialty: "Seafood biryani, Malabar fish curry", price: "AED 25-40" },
  { name: "Gazebo", region: "North Indian", specialty: "Butter chicken, dal makhani", price: "AED 30-50" },
  { name: "Madras Pavilion", region: "Tamil Nadu", specialty: "Chettinad chicken", price: "AED 20-35" },
  { name: "Puranmal", region: "Punjabi", specialty: "Vegetarian thalis", price: "AED 25-40" },
  { name: "Aminia", region: "Kolkata-style", specialty: "Biryani, kathi rolls", price: "AED 20-35" }
];

const pakistaniRestaurants = [
  { name: "BBQ Tonight", style: "Punjabi/Lahori", specialty: "Karahi, nihari, tandoori", price: "AED 30-50" },
  { name: "Bundoo Khan", style: "Lahori", specialty: "Seekh kebabs, chapli kebabs", price: "AED 25-40" },
  { name: "Butt Karahi", style: "Punjabi", specialty: "Mutton karahi", price: "AED 35-50" },
  { name: "Student Biryani", style: "Sindhi", specialty: "Sindhi biryani, boti kebabs", price: "AED 15-25" },
  { name: "Kolachi", style: "Sindhi", specialty: "Sajji, Sindhi curry", price: "AED 40-60" }
];

const otherCuisines = [
  { name: "Max's Restaurant", cuisine: "Filipino", specialty: "Fried chicken, sisig, kare-kare", price: "AED 30-50" },
  { name: "Jollibee", cuisine: "Filipino", specialty: "Chickenjoy", price: "AED 20-35" },
  { name: "Aroos Damascus", cuisine: "Iranian", specialty: "Koobideh, tahdig", price: "AED 30-50" },
  { name: "Shabestan", cuisine: "Persian", specialty: "Saffron rice, lamb", price: "AED 60-90" },
  { name: "Al Reef Lebanese", cuisine: "Lebanese", specialty: "Zaatar manakeesh, labneh", price: "AED 8-15" },
  { name: "China Club", cuisine: "Chinese", specialty: "Sichuan, hotpot, dim sum", price: "AED 30-50" }
];

const shoppingItems = [
  { category: "Textiles & Fabrics", items: "Silk, cotton, linen, lace, embroidered", savings: "50-60%" },
  { category: "Gold Jewelry", items: "22K gold, traditional designs, bangles", savings: "10-15%" },
  { category: "Electronics", items: "Phone cases, chargers, Bluetooth speakers", savings: "40-60%" },
  { category: "Clothing", items: "Casual wear, salwar kameez, kurtas", savings: "30-50%" },
  { category: "Spices & Groceries", items: "Saffron, cardamom, basmati rice, lentils", savings: "20-30%" }
];

const hotels = [
  { name: "Ibis Styles Al Karama", category: "Budget", price: "AED 150-220/night", highlight: "Modern, 5 mins to ADCB Metro" },
  { name: "Savoy Central Hotel Apartments", category: "Budget", price: "AED 180-280/night", highlight: "Kitchenettes, good for families" },
  { name: "Ramada by Wyndham", category: "Mid-Range", price: "AED 250-400/night", highlight: "Breakfast, pool" }
];

const faqs = [
  {
    question: "What is Al Karama known for?",
    answer: "Al Karama is Dubai's most authentic neighborhood — famous for 200+ authentic restaurants (Indian, Pakistani, Filipino, Iranian, Arab cuisines), budget shopping (textiles, fabrics, electronics), and real local street life. Meals start from just AED 10-40."
  },
  {
    question: "Is Al Karama safe for tourists?",
    answer: "Yes, very safe. Al Karama is a bustling residential area with 70,000+ residents. It's well-lit, busy streets with police presence. Standard urban precautions apply."
  },
  {
    question: "How do I get to Al Karama?",
    answer: "ADCB Metro Station (Red Line) is in the heart of Al Karama. From Downtown Dubai: 8 mins by Metro. From Dubai Airport: 12-15 mins by taxi (AED 30-40)."
  },
  {
    question: "What's the best time to visit Al Karama?",
    answer: "Evening 7-10pm when it's cooler and the streets come alive. 18th Street is most vibrant after sunset. Avoid midday in summer (too hot)."
  },
  {
    question: "Is Al Karama good for shopping?",
    answer: "Yes! Karama Shopping Complex is famous for textiles, fabrics, and custom tailoring. Electronics and gold are 30-60% cheaper than Dubai Mall. Bargaining is expected."
  },
  {
    question: "Why stay in Al Karama instead of Downtown?",
    answer: "50-60% cheaper hotels, walking distance to 100+ restaurants, authentic neighborhood experience, 5-10 mins to Dubai Mall by Metro. Trade luxury for authenticity and value."
  }
];

const quickNavItems = [
  { id: "overview", label: "Overview", icon: Map },
  { id: "dining", label: "Dining", icon: Utensils },
  { id: "shopping", label: "Shopping", icon: ShoppingBag },
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
          alt="Al Karama Dubai Street Life"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/70 via-orange-800/60 to-orange-900/80" />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="flex items-center justify-center gap-2 mb-6">
            <Badge className="bg-orange-500/30 text-white border-orange-400/50 backdrop-blur-sm px-4 py-2">
              <Utensils className="w-4 h-4 mr-2" />
              Dubai's Food Paradise
            </Badge>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Al Karama
            <span className="block text-3xl md:text-4xl font-normal text-orange-200 mt-2">
              Authentic Food, Budget Shopping & Central Living 2025
            </span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            Dubai's oldest and most authentic neighborhood — 200+ restaurants, 
            budget shopping, and real street life just 2 km from Burj Khalifa.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <Utensils className="w-4 h-4 mr-2" />
              200+ Restaurants
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <CreditCard className="w-4 h-4 mr-2" />
              Meals from AED 10
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <Train className="w-4 h-4 mr-2" />
              ADCB Metro Station
            </Badge>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white gap-2 text-lg px-8"
              data-testid="button-explore-karama"
              onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Al Karama <ArrowRight className="w-5 h-5" />
            </Button>
            <Link href="/districts">
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 gap-2" data-testid="button-all-districts-karama">
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
              className="flex items-center gap-2 whitespace-nowrap text-muted-foreground hover:text-orange-600"
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
    <section id="overview" className="py-20 bg-gradient-to-b from-orange-50 to-background dark:from-orange-950/20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200 mb-4">
              The Real Dubai
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">A Different Dubai Experience</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built in the 1970s-1980s, Al Karama is characterized by low-rise residential blocks, 
              narrow bustling streets, and some of the best authentic dining in Dubai.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Utensils, label: "200+ Restaurants", desc: "15+ cuisines" },
              { icon: Users, label: "70,000+ Residents", desc: "Vibrant community" },
              { icon: MapPin, label: "2 km to Downtown", desc: "Central location" },
              { icon: CreditCard, label: "40-50% Cheaper", desc: "Than Marina/Downtown" }
            ].map((stat, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="text-center p-6 hover-elevate">
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-orange-600" />
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
                  "Food lovers seeking authentic cuisines at real prices",
                  "Budget travelers wanting central location",
                  "Shoppers hunting textiles, fabrics, custom tailoring",
                  "Residents working in Healthcare City, DIFC, Business Bay",
                  "Solo travelers & backpackers (safe, walkable, affordable)",
                  "Anyone seeking 'real Dubai' beyond glass towers"
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
                <X className="w-5 h-5 text-red-500" /> Not Ideal For
              </h3>
              <ul className="space-y-3">
                {[
                  "Luxury seekers (no 5-star hotels, basic amenities)",
                  "Beach lovers (12 km to nearest beach)",
                  "Families with young kids (limited parks)",
                  "Anyone expecting 'Dubai glamour'"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
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

function DiningSection() {
  return (
    <section id="dining" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200 mb-4">
              Karama's Superpower
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">200+ Restaurants, 15+ Cuisines</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              50-70% cheaper than Dubai Mall or Marina — without compromising quality.
            </p>
          </motion.div>

          <Tabs defaultValue="indian" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="indian" data-testid="tab-indian">Indian (50+)</TabsTrigger>
              <TabsTrigger value="pakistani" data-testid="tab-pakistani">Pakistani (40+)</TabsTrigger>
              <TabsTrigger value="other" data-testid="tab-other">Other Cuisines</TabsTrigger>
            </TabsList>

            <TabsContent value="indian">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {indianRestaurants.map((r, idx) => (
                  <motion.div key={idx} variants={fadeInUp}>
                    <Card className="p-4 hover-elevate">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold">{r.name}</h4>
                        <Badge variant="secondary">{r.price}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{r.region}</p>
                      <p className="text-sm">{r.specialty}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Street Food:</strong> Chaat cafes (pani puri, bhel AED 8-15), Dosa corners (AED 8-12)
                </p>
              </div>
            </TabsContent>

            <TabsContent value="pakistani">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pakistaniRestaurants.map((r, idx) => (
                  <motion.div key={idx} variants={fadeInUp}>
                    <Card className="p-4 hover-elevate">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold">{r.name}</h4>
                        <Badge variant="secondary">{r.price}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{r.style}</p>
                      <p className="text-sm">{r.specialty}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Street Food:</strong> Parathas (AED 8-12), Samosas & pakoras (AED 5-10)
                </p>
              </div>
            </TabsContent>

            <TabsContent value="other">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherCuisines.map((r, idx) => (
                  <motion.div key={idx} variants={fadeInUp}>
                    <Card className="p-4 hover-elevate">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold">{r.name}</h4>
                        <Badge variant="secondary">{r.price}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{r.cuisine}</p>
                      <p className="text-sm">{r.specialty}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <motion.div variants={fadeInUp} className="mt-12">
            <Card className="p-6 bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-950/30 dark:to-amber-950/30">
              <div className="flex items-start gap-4">
                <Coffee className="w-8 h-8 text-orange-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-lg mb-2">Karak Tea Culture</h4>
                  <p className="text-muted-foreground">
                    Karak chai shops on every corner (AED 1-2/cup). Sweet milky tea — Dubai's social glue. 
                    Often 24/7. Fresh juice bars too: mango (AED 8-12), sugarcane (AED 5-8).
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function ShoppingSection() {
  return (
    <section id="shopping" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200 mb-4">
              Budget Shopping
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">30-60% Cheaper Than Dubai Mall</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Al Karama built its reputation on textiles, fabrics, and electronics. Quality varies — know what you're buying.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shoppingItems.map((item, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="p-6 hover-elevate h-full">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg">{item.category}</h3>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                      Save {item.savings}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{item.items}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="mt-12 grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Scissors className="w-8 h-8 text-orange-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-lg mb-2">Custom Tailoring</h4>
                  <p className="text-muted-foreground mb-3">
                    Bring a design or photo — get clothes made in 24-48 hours.
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>Custom shirt/kurta: AED 60-100 (vs AED 200-300 malls)</li>
                    <li>Sari/lehenga tailoring: AED 200-500</li>
                    <li>Silk fabric: AED 30-50/meter</li>
                  </ul>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <ShoppingBag className="w-8 h-8 text-orange-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-lg mb-2">Karama Shopping Complex</h4>
                  <p className="text-muted-foreground mb-3">
                    Indoor mall with 50+ shops. The heart of Karama shopping.
                  </p>
                  <ul className="text-sm space-y-1">
                    <li>Textiles, fabrics, tailoring</li>
                    <li>Electronics, phone accessories</li>
                    <li>Open 10am-10pm daily</li>
                  </ul>
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
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200 mb-4">
              Accommodation
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">50-60% Cheaper Than Downtown</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Budget hotels (2-3 star) perfect for travelers prioritizing location over luxury.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {hotels.map((hotel, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="p-6 hover-elevate h-full">
                  <Badge variant="secondary" className="mb-3">{hotel.category}</Badge>
                  <h3 className="font-bold text-lg mb-2">{hotel.name}</h3>
                  <p className="text-2xl font-bold text-orange-600 mb-3">{hotel.price}</p>
                  <p className="text-sm text-muted-foreground">{hotel.highlight}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="mt-12">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Home className="w-5 h-5" /> Residential Rentals
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="font-medium">Studio</p>
                  <p className="text-2xl font-bold text-orange-600">AED 28-38K/year</p>
                  <p className="text-sm text-muted-foreground">400-500 sq ft, most common</p>
                </div>
                <div>
                  <p className="font-medium">1-Bedroom</p>
                  <p className="text-2xl font-bold text-orange-600">AED 38-55K/year</p>
                  <p className="text-sm text-muted-foreground">600-800 sq ft</p>
                </div>
                <div>
                  <p className="font-medium">2-Bedroom</p>
                  <p className="text-2xl font-bold text-orange-600">AED 55-75K/year</p>
                  <p className="text-sm text-muted-foreground">900-1,100 sq ft (rare)</p>
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
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200 mb-4">
              Getting Around
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Extremely Central Location</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div variants={fadeInUp}>
              <Card className="p-6 text-center hover-elevate">
                <Train className="w-12 h-12 mx-auto mb-4 text-orange-600" />
                <h3 className="font-bold text-lg mb-2">Metro Access</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li><strong>ADCB Station</strong> — Heart of Karama</li>
                  <li>Al Jafiliya Station — 5 mins walk</li>
                  <li>Healthcare City — 8 mins walk</li>
                </ul>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="p-6 text-center hover-elevate">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-orange-600" />
                <h3 className="font-bold text-lg mb-2">Distances</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>Burj Khalifa: 2 km (8 mins Metro)</li>
                  <li>Dubai Mall: 3 km (10 mins)</li>
                  <li>DIFC: 3 km (8 mins)</li>
                  <li>Airport: 8 km (12-15 mins)</li>
                </ul>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="p-6 text-center hover-elevate">
                <Clock className="w-12 h-12 mx-auto mb-4 text-orange-600" />
                <h3 className="font-bold text-lg mb-2">Walkability</h3>
                <p className="text-sm text-muted-foreground">
                  Rare in Dubai! 18th Street is 1.5 km of continuous shops, cafes, and restaurants. 
                  Best explored on foot in the evening.
                </p>
              </Card>
            </motion.div>
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
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200 mb-4">
              Insider Tips
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Make the Most of Karama</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div variants={fadeInUp}>
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-600" /> Best Experiences
                </h3>
                <ul className="space-y-3">
                  {[
                    "Walk 18th Street 7-10pm for the full Karama vibe",
                    "Try street food: dosa, shawarma, karak chai",
                    "Get custom tailoring — bring photos of what you want",
                    "Explore Karama Shopping Complex for textiles",
                    "Use Metro — ADCB station is perfectly central"
                  ].map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Star className="w-4 h-4 text-orange-600 shrink-0 mt-1" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Sun className="w-5 h-5 text-orange-600" /> Timing Tips
                </h3>
                <ul className="space-y-3">
                  {[
                    "Evening 7-10pm is prime time (cooler, livelier)",
                    "Avoid midday in summer (too hot for walking)",
                    "Restaurants busiest 8-10pm (arrive early or late)",
                    "Shopping Complex: 10am-10pm daily",
                    "Weekdays less crowded than weekends"
                  ].map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-orange-600 shrink-0 mt-1" />
                      <span>{tip}</span>
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
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about Al Karama</p>
          </motion.div>

          <motion.div variants={fadeInUp}>
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
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-orange-600 to-amber-600 text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.h2 variants={fadeInUp} className="text-4xl font-bold mb-6">
            Experience the Real Dubai
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-xl text-white/90 mb-8">
            Skip the tourist traps. Al Karama offers authentic food, real prices, and genuine street life 
            just 2 km from Burj Khalifa.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
            <Link href="/districts">
              <Button size="lg" variant="secondary" className="gap-2" data-testid="button-explore-more-districts">
                Explore More Districts <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/districts/old-dubai">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 gap-2" data-testid="button-old-dubai">
                See Old Dubai
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default function DistrictAlKarama() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <HeroSection />
      <QuickNavSection />
      <OverviewSection />
      <DiningSection />
      <ShoppingSection />
      <HotelsSection />
      <TransportSection />
      <TipsSection />
      <FAQSection />
      <CTASection />
      <PublicFooter />
    </div>
  );
}
