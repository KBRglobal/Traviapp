import { Link } from "wouter";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { motion } from "framer-motion";
import { 
  MapPin, Building2, Star, ArrowRight, Clock, Users, 
  Utensils, Bed, ShoppingBag, Car, Bus, Sparkles, ChevronDown, Check, X, 
  Sun, Home, CreditCard, Globe, Package, Map
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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

const clusters = [
  { name: "China Cluster", desc: "Largest cluster, 10+ buildings, red accents", cuisine: "Chinese restaurants" },
  { name: "England Cluster", desc: "Tudor-style facades, quieter", cuisine: "International mix" },
  { name: "France Cluster", desc: "Parisian balconies, well-maintained", cuisine: "Arab cafes" },
  { name: "Persia Cluster", desc: "Iranian-inspired, bakeries", cuisine: "Persian kebabs" },
  { name: "Morocco Cluster", desc: "North African style", cuisine: "Moroccan food" },
  { name: "Russia/Greece/Italy", desc: "Mixed European themes", cuisine: "Various ethnic" }
];

const housing = [
  { type: "Studio", rent: "AED 15,000-22,000/year", note: "Most common, often shared 2-3 people" },
  { type: "1-Bedroom", rent: "AED 22,000-32,000/year", note: "Families or 3-4 bachelors" },
  { type: "2-Bedroom", rent: "AED 35,000-48,000/year", note: "Large families (5-7 common)" }
];

const faqs = [
  {
    question: "Is International City safe?",
    answer: "Yes, it's safe. Low crime, typical residential neighborhood. Dubai overall has one of the world's lowest crime rates. The area is crowded and noisy, but not unsafe."
  },
  {
    question: "Why is International City so cheap?",
    answer: "Location (far from central Dubai), no Metro access, older buildings (2002-2015), high density, minimal amenities compared to premium areas. You're trading convenience for significant savings."
  },
  {
    question: "Is there Metro in International City?",
    answer: "No. Nearest Metro is Rashidiya (8 km, 15-20 mins by car). You need a car, or rely on buses (RTA routes 11, 33, 42) and taxis. This is the main drawback."
  },
  {
    question: "What is Dragon Mart?",
    answer: "World's largest Chinese trading hub outside China — 1.2 km long, 3,500+ shops selling electronics, furniture, toys, clothing at 20-50% off mall prices. 5-minute drive from International City."
  },
  {
    question: "Should tourists stay in International City?",
    answer: "No. Zero attractions, no hotels, far from everything. It's purely residential for budget-conscious workers and families. Tourists should stay in Marina, Downtown, or Deira."
  }
];

const quickNavItems = [
  { id: "overview", label: "Overview", icon: Map },
  { id: "clusters", label: "Clusters", icon: Globe },
  { id: "housing", label: "Housing", icon: Home },
  { id: "dragon-mart", label: "Dragon Mart", icon: Package },
  { id: "transport", label: "Transport", icon: Car },
  { id: "tips", label: "Tips", icon: Sparkles }
];

function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop"
          alt="International City Dubai"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/70 via-red-800/60 to-red-900/80" />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="flex items-center justify-center gap-2 mb-6">
            <Badge className="bg-red-500/30 text-white border-red-400/50 backdrop-blur-sm px-4 py-2">
              <CreditCard className="w-4 h-4 mr-2" />
              Dubai's Most Affordable Neighborhood
            </Badge>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            International City
            <span className="block text-3xl md:text-4xl font-normal text-red-200 mt-2">
              Budget Living & Dragon Mart 2025
            </span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            120,000+ residents, 10 themed clusters, Dubai's lowest rents. 
            Where budget meets multiculturalism — and Dragon Mart is 5 mins away.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <CreditCard className="w-4 h-4 mr-2" />
              60-70% Cheaper
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <Globe className="w-4 h-4 mr-2" />
              10 Country Clusters
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              120,000+ Residents
            </Badge>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-red-500 hover:bg-red-600 text-white gap-2 text-lg px-8"
              data-testid="button-explore-international-city"
              onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore International City <ArrowRight className="w-5 h-5" />
            </Button>
            <Link href="/districts">
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 gap-2" data-testid="button-all-districts-ic">
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
              className="flex items-center gap-2 whitespace-nowrap text-muted-foreground hover:text-red-600"
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
    <section id="overview" className="py-20 bg-gradient-to-b from-red-50 to-background dark:from-red-950/20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 mb-4">
              By Nakheel (2002-2015)
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Dubai's Budget Hub</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              International City is Dubai's most distinctive — and polarizing — residential community. 
              800 hectares of themed clusters, 100+ nationalities, and rents 60-70% below Marina.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, label: "120,000+", desc: "Residents" },
              { icon: CreditCard, label: "AED 15-22K", desc: "Studio/year" },
              { icon: Globe, label: "100+", desc: "Nationalities" },
              { icon: MapPin, label: "18 km", desc: "To Downtown" }
            ].map((stat, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="text-center p-6 hover-elevate">
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-red-600" />
                  <h3 className="text-2xl font-bold mb-2">{stat.label}</h3>
                  <p className="text-muted-foreground">{stat.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="mt-12">
            <Card className="p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-red-200 dark:border-red-800">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-red-600" /> Who is International City For?
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="font-semibold text-green-600 mb-2">Perfect For:</p>
                  <ul className="space-y-2 text-sm">
                    {[
                      "Budget-conscious workers (AED 2,000-5,000/month salary)",
                      "Families saving aggressively (save AED 30-50K/year)",
                      "Bachelors in shared accommodation",
                      "Students near Dubai Silicon Oasis",
                      "Small business owners with tight budgets"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-red-600 mb-2">Not Suitable For:</p>
                  <ul className="space-y-2 text-sm">
                    {[
                      "Tourists (zero attractions, far from everything)",
                      "Business travelers (no hotels, no corporate area)",
                      "Professionals working in DIFC/Marina (1-hour commute)",
                      "Those without a car (no Metro)"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <X className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
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

function ClustersSection() {
  return (
    <section id="clusters" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 mb-4">Themed Architecture</Badge>
            <h2 className="text-4xl font-bold mb-4">10 Country Clusters</h2>
            <p className="text-xl text-muted-foreground">Each cluster inspired by a different nation</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clusters.map((cluster, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="p-6 hover-elevate">
                  <Globe className="w-10 h-10 text-red-600 mb-4" />
                  <h3 className="font-bold text-lg mb-2">{cluster.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{cluster.desc}</p>
                  <Badge variant="outline">{cluster.cuisine}</Badge>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="mt-8">
            <Card className="p-6 bg-muted/30">
              <h3 className="font-bold mb-4">Best Clusters for Families</h3>
              <p className="text-sm text-muted-foreground">
                <strong>England, France, Italy</strong> — Quieter, better maintained. 
                <strong>China, Morocco, Persia</strong> — Older buildings, louder, but cheapest.
              </p>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function HousingSection() {
  return (
    <section id="housing" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 mb-4">Dubai's Lowest Rents</Badge>
            <h2 className="text-4xl font-bold mb-4">Housing Options</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {housing.map((unit, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="p-6 hover-elevate">
                  <Home className="w-10 h-10 text-red-600 mb-4" />
                  <h3 className="font-bold text-lg mb-2">{unit.type}</h3>
                  <p className="text-red-600 font-semibold text-xl mb-2">{unit.rent}</p>
                  <p className="text-sm text-muted-foreground">{unit.note}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="mt-8">
            <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
              <h3 className="font-bold text-lg mb-4">Your Savings vs. Dubai Marina</h3>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                  <p className="font-bold text-2xl text-red-600">AED 20K</p>
                  <p className="text-sm text-muted-foreground">Studio in IC</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                  <p className="font-bold text-2xl text-slate-600">AED 55K</p>
                  <p className="text-sm text-muted-foreground">Studio in Marina</p>
                </div>
                <div className="p-4 bg-green-100 dark:bg-green-950/30 rounded-lg">
                  <p className="font-bold text-2xl text-green-600">AED 35K/year</p>
                  <p className="text-sm text-muted-foreground">Your savings!</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function DragonMartSection() {
  return (
    <section id="dragon-mart" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200 mb-4">5 Mins Away</Badge>
            <h2 className="text-4xl font-bold mb-4">Dragon Mart</h2>
            <p className="text-xl text-muted-foreground">World's largest Chinese trading hub outside China</p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="p-8">
              <div className="flex items-start gap-6">
                <Package className="w-16 h-16 text-red-600 shrink-0" />
                <div>
                  <h3 className="font-bold text-2xl mb-4">The Reason to Be in This Area</h3>
                  <p className="text-muted-foreground mb-6">
                    1.2 km long, 3,500+ shops — electronics, furniture, toys, clothing, kitchenware at 
                    20-50% below mall prices. Wholesale and retail.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="font-semibold mb-2">What You'll Find:</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>Electronics (phones, laptops) — 20-40% cheaper</li>
                        <li>Furniture (home, office) — Massive selection</li>
                        <li>Toys, gadgets, kitchenware</li>
                        <li>Clothing (bulk, wholesale)</li>
                        <li>Car accessories</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold mb-2">Typical Savings:</p>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>iPhone case: AED 10 (vs AED 50 in Dubai Mall)</li>
                        <li>Office chair: AED 150 (vs AED 400+)</li>
                        <li>Kids' toys: 50-70% cheaper</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                    <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                      Weekend Warning: EXTREMELY crowded. Families from across UAE shop here.
                    </p>
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

function TransportSection() {
  return (
    <section id="transport" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Getting Around</h2>
            <p className="text-xl text-muted-foreground">No Metro — car essential</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 hover-elevate">
              <Car className="w-10 h-10 text-red-600 mb-4" />
              <h3 className="font-bold mb-2">By Car (Essential)</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>To Downtown: 25-35 mins</li>
                <li>To Marina: 35-45 mins</li>
                <li>To Airport (DXB): 15-20 mins</li>
                <li>Parking: Chronic shortage</li>
              </ul>
            </Card>
            <Card className="p-6 hover-elevate bg-red-50 dark:bg-red-950/30">
              <Bus className="w-10 h-10 text-red-600 mb-4" />
              <h3 className="font-bold mb-2">No Metro Access</h3>
              <p className="text-sm text-muted-foreground">
                Nearest: Rashidiya Station (8 km, 15-20 mins). 
                RTA buses available (routes 11, 33, 42).
              </p>
            </Card>
            <Card className="p-6 hover-elevate">
              <Clock className="w-10 h-10 text-red-600 mb-4" />
              <h3 className="font-bold mb-2">Taxi/Ride-Hailing</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Hard to find inside IC</li>
                <li>Pre-book Uber/Careem</li>
                <li>To Downtown: AED 50-70</li>
                <li>To Marina: AED 80-100</li>
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
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-green-600">
                <Check className="w-5 h-5" /> DO
              </h3>
              <ul className="space-y-3">
                {[
                  "Get a car — essential for living here",
                  "Try authentic ethnic food (Chinese, Pakistani, Arab) at rock-bottom prices",
                  "Shop Dragon Mart for wholesale deals",
                  "Choose England/France clusters for quieter living",
                  "Negotiate rent (landlords flexible)"
                ].map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-green-600 shrink-0 mt-1" />
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-600">
                <X className="w-5 h-5" /> DON'T
              </h3>
              <ul className="space-y-3">
                {[
                  "Stay as a tourist (nothing to see)",
                  "Expect walkability between clusters",
                  "Rely on public transport",
                  "Drive to Dragon Mart on weekends (nightmare)",
                  "Expect quality of life (trade-off for savings)"
                ].map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <X className="w-4 h-4 text-red-600 shrink-0 mt-1" />
                    <span className="text-sm">{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>
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
    <section className="py-20 bg-gradient-to-br from-red-600 via-red-500 to-orange-500">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Dubai's Budget Living Hub
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Save AED 35K+/year in Dubai's most affordable neighborhood. 
            Trade location for savings — and enjoy Dragon Mart next door.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/districts">
              <Button 
                size="lg" 
                className="bg-white text-red-600 hover:bg-white/90 gap-2"
                data-testid="button-explore-more-ic"
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

export default function DistrictInternationalCity() {
  const { isRTL } = useLocale();
  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <PublicNav variant="transparent" />
      <HeroSection />
      <QuickNavSection />
      <OverviewSection />
      <ClustersSection />
      <HousingSection />
      <DragonMartSection />
      <TransportSection />
      <TipsSection />
      <FAQSection />
      <CTASection />
      <PublicFooter />
    </div>
  );
}
