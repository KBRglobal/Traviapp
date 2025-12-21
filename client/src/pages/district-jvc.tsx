import { Link } from "wouter";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { motion } from "framer-motion";
import { 
  MapPin, Building2, Star, ArrowRight, Clock, Users, 
  Utensils, Bed, ShoppingBag, Train, Car, Sparkles, ChevronDown, Check, X, 
  Sun, Home, Baby, Dumbbell, CreditCard, Map
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

const amenities = [
  { name: "Circle Mall", desc: "400+ stores, Carrefour, cinema, food court", type: "Shopping" },
  { name: "JVC Community Center", desc: "Multiple parks scattered throughout", type: "Parks" },
  { name: "Fitness First & Gyms", desc: "Budget to premium fitness options", type: "Fitness" },
  { name: "Schools & Nurseries", desc: "JSS International, multiple nurseries", type: "Education" }
];

const housing = [
  { type: "Studio", rent: "AED 28,000-40,000/year", size: "350-450 sq ft" },
  { type: "1-Bedroom", rent: "AED 42,000-60,000/year", size: "600-800 sq ft" },
  { type: "2-Bedroom", rent: "AED 55,000-85,000/year", size: "900-1,200 sq ft" },
  { type: "3-Bedroom", rent: "AED 75,000-120,000/year", size: "1,400-2,000 sq ft" }
];

const faqs = [
  {
    question: "Is JVC a good place to live in Dubai?",
    answer: "Excellent for budget-conscious families and young professionals. 40-50% cheaper than Marina/Downtown with modern apartments, community feel, and improving infrastructure. No Metro yet."
  },
  {
    question: "How far is JVC from Dubai Marina?",
    answer: "10-15 minutes by car (7 km). Direct access via Al Khail Road. No Metro connection   car or taxi essential."
  },
  {
    question: "Is JVC safe?",
    answer: "Very safe. Low crime, family-oriented community, security in most buildings. Dubai overall has one of the lowest crime rates globally."
  },
  {
    question: "What is JVC known for?",
    answer: "Affordable rent, family-friendly community, modern mid-rise apartments, Circle Mall, and being a first home for many Dubai expats. Budget living without sacrificing quality."
  },
  {
    question: "Is there Metro in JVC?",
    answer: "Not yet. Future Metro extension planned but no confirmed date. Currently car-dependent. Taxis and ride-hailing work well."
  }
];

const quickNavItems = [
  { id: "overview", label: "Overview", icon: Map },
  { id: "housing", label: "Housing", icon: Home },
  { id: "amenities", label: "Amenities", icon: ShoppingBag },
  { id: "families", label: "Families", icon: Baby },
  { id: "transport", label: "Transport", icon: Car },
  { id: "tips", label: "Tips", icon: Sparkles }
];

function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop"
          alt="JVC Dubai Residential Community"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/70 via-orange-800/60 to-orange-900/80" />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="flex items-center justify-center gap-2 mb-6">
            <Badge className="bg-orange-500/30 text-white border-orange-400/50 backdrop-blur-sm px-4 py-2">
              <CreditCard className="w-4 h-4 mr-2" />
              Dubai's Best Value Neighborhood
            </Badge>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            JVC
            <span className="block text-3xl md:text-4xl font-normal text-orange-200 mt-2">
              Jumeirah Village Circle Guide 2026
            </span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            Dubai's affordable family hub   40-50% cheaper than Marina, modern apartments, 
            Circle Mall, and a tight-knit community. Where smart expats start.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <CreditCard className="w-4 h-4 mr-2" />
              40-50% Cheaper
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              80,000+ Residents
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <Baby className="w-4 h-4 mr-2" />
              Family-Friendly
            </Badge>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white gap-2 text-lg px-8"
              data-testid="button-explore-jvc"
              onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore JVC <ArrowRight className="w-5 h-5" />
            </Button>
            <Link href="/districts">
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 gap-2" data-testid="button-all-districts-jvc">
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
              Value Champion
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Where Smart Expats Start</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              JVC is Dubai's fastest-growing affordable community   modern apartments, 
              family amenities, and 40-50% savings vs. premium areas.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, label: "80,000+", desc: "Residents & growing" },
              { icon: CreditCard, label: "40-50%", desc: "Cheaper than Marina" },
              { icon: Clock, label: "15 mins", desc: "To Marina/Downtown" },
              { icon: Building2, label: "2,000+", desc: "Buildings" }
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
                <Check className="w-5 h-5 text-green-600" /> Why Choose JVC
              </h3>
              <ul className="space-y-3">
                {[
                  "Affordable rent (save AED 30-50K/year vs Marina)",
                  "Modern apartments (mostly built 2010-2020)",
                  "Family-friendly (parks, schools, safe)",
                  "Circle Mall nearby (shopping, dining)",
                  "Central location (15 mins to major areas)",
                  "Strong community feel (expat neighborhoods)"
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
                  "No Metro access (car essential)",
                  "No beach (20 mins to Marina beach)",
                  "Limited nightlife (family area)",
                  "Some construction ongoing",
                  "Traffic during rush hour (Al Khail Road)"
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

function HousingSection() {
  return (
    <section id="housing" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200 mb-4">Rental Rates</Badge>
            <h2 className="text-4xl font-bold mb-4">Housing Options</h2>
            <p className="text-xl text-muted-foreground">Studios to 3-beds at budget-friendly prices</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {housing.map((unit, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="p-6 hover-elevate">
                  <Home className="w-10 h-10 text-orange-600 mb-4" />
                  <h3 className="font-bold text-lg mb-2">{unit.type}</h3>
                  <p className="text-orange-600 font-semibold mb-2">{unit.rent}</p>
                  <p className="text-sm text-muted-foreground">{unit.size}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="mt-8">
            <Card className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30">
              <h3 className="font-bold text-lg mb-4">JVC vs. Marina Savings</h3>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                  <p className="font-bold text-2xl text-orange-600">AED 35K</p>
                  <p className="text-sm text-muted-foreground">1-bed in JVC</p>
                </div>
                <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                  <p className="font-bold text-2xl text-slate-600">AED 70K</p>
                  <p className="text-sm text-muted-foreground">1-bed in Marina</p>
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

function AmenitiesSection() {
  return (
    <section id="amenities" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Community Amenities</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {amenities.map((amenity, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="p-6 hover-elevate">
                  <Badge className="mb-3">{amenity.type}</Badge>
                  <h3 className="font-bold mb-2">{amenity.name}</h3>
                  <p className="text-sm text-muted-foreground">{amenity.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FamiliesSection() {
  return (
    <section id="families" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200 mb-4">Family Living</Badge>
            <h2 className="text-4xl font-bold mb-4">Great for Families</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 hover-elevate">
              <Baby className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="font-bold mb-2">Kid-Friendly</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Multiple playgrounds</li>
                <li>Safe, gated communities</li>
                <li>Low traffic inside circles</li>
              </ul>
            </Card>
            <Card className="p-6 hover-elevate">
              <Building2 className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="font-bold mb-2">Schools Nearby</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>JSS International School</li>
                <li>Multiple nurseries</li>
                <li>10 mins to Al Barsha schools</li>
              </ul>
            </Card>
            <Card className="p-6 hover-elevate">
              <Dumbbell className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="font-bold mb-2">Active Lifestyle</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Jogging paths in circles</li>
                <li>Multiple gyms</li>
                <li>Community pools</li>
              </ul>
            </Card>
          </div>
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
            <p className="text-xl text-muted-foreground">Car essential   no Metro yet</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 hover-elevate">
              <Car className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="font-bold mb-2">By Car</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>To Marina: 10-15 mins</li>
                <li>To Downtown: 15-20 mins</li>
                <li>To Airport: 25-30 mins</li>
              </ul>
            </Card>
            <Card className="p-6 hover-elevate bg-orange-50 dark:bg-orange-950/30">
              <Train className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="font-bold mb-2">Metro Status</h3>
              <p className="text-sm text-muted-foreground">
                No Metro access yet. Future extension planned but no confirmed date. 
                Nearest: Mall of Emirates (20 mins).
              </p>
            </Card>
            <Card className="p-6 hover-elevate">
              <Clock className="w-10 h-10 text-orange-600 mb-4" />
              <h3 className="font-bold mb-2">Taxi/Ride-Hailing</h3>
              <p className="text-sm text-muted-foreground">
                Uber/Careem widely available. To Marina: AED 25-35. 
                To Downtown: AED 35-50.
              </p>
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
                  "Negotiate rent (landlords flexible, especially off-peak)",
                  "Get a car or budget for Uber/Careem",
                  "Check building age   newer = better maintained",
                  "Visit Circle Mall for groceries (Carrefour)",
                  "Consider JVT (Jumeirah Village Triangle) too   similar, quieter"
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
                  "Expect walkability to attractions",
                  "Rely on public transport (no Metro)",
                  "Ignore building reviews (quality varies)",
                  "Stay as tourist (nothing to see, residential only)"
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
    <section className="py-20 bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Dubai's Best Value Living
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Save AED 30-50K/year while enjoying modern apartments, family amenities, 
            and central location. JVC   where smart expats start.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/districts">
              <Button 
                size="lg" 
                className="bg-white text-orange-600 hover:bg-white/90 gap-2"
                data-testid="button-explore-more-jvc"
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

export default function DistrictJVC() {
  const { isRTL } = useLocale();
  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <PublicNav variant="transparent" />
      <HeroSection />
      <QuickNavSection />
      <OverviewSection />
      <HousingSection />
      <AmenitiesSection />
      <FamiliesSection />
      <TransportSection />
      <TipsSection />
      <FAQSection />
      <CTASection />
      <PublicFooter />
    </div>
  );
}
