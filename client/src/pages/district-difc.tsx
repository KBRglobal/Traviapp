import { Link } from "wouter";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { motion } from "framer-motion";
import { 
  MapPin, Building2, Star, ArrowRight, Clock, Users, 
  Utensils, Bed, Train, Sparkles, ChevronDown, Check, X, 
  Sun, Briefcase, Scale, Palette, Wine, CreditCard, Map
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

const restaurants = [
  { name: "Zuma", cuisine: "Japanese", price: "AED 400-600", highlight: "Dubai's best Japanese, miso black cod" },
  { name: "LPM Restaurant & Bar", cuisine: "French-Mediterranean", price: "AED 350-500", highlight: "French Riviera elegance, celebrity spotting" },
  { name: "Amazonico", cuisine: "Latin American", price: "AED 300-500", highlight: "Jungle-themed, Instagram-worthy" },
  { name: "Coya", cuisine: "Peruvian", price: "AED 350-500", highlight: "Pisco cocktails, energetic vibe" },
  { name: "Nusr-Et (Salt Bae)", cuisine: "Turkish Steakhouse", price: "AED 800+", highlight: "Theatrical, gold-leaf steak" },
  { name: "Hell's Kitchen", cuisine: "International", price: "AED 400-600", highlight: "Gordon Ramsay's signature" }
];

const galleries = [
  { name: "Ayyam Gallery", specialty: "Middle Eastern contemporary" },
  { name: "Opera Gallery", specialty: "Modern masters, sculptures" },
  { name: "Carbon 12", specialty: "Cutting-edge contemporary" },
  { name: "Cuadro Fine Art Gallery", specialty: "Regional artists" }
];

const faqs = [
  {
    question: "What is DIFC?",
    answer: "Dubai International Financial Centre is a 110-acre independent financial free zone with its own laws (English Common Law), courts, and regulatory authority. It hosts 600+ companies managing $4 trillion in assets."
  },
  {
    question: "Is DIFC worth visiting as a tourist?",
    answer: "Yes, for food lovers and art enthusiasts. Gate Avenue has Dubai's finest dining (Zuma, LPM, Amazonico), and Gate Village hosts 10+ contemporary art galleries with free monthly gallery nights."
  },
  {
    question: "What is Gate Avenue?",
    answer: "Gate Avenue is DIFC's pedestrianized dining and retail boulevard — arguably Dubai's best restaurant row with Michelin-caliber restaurants, outdoor terraces, and upscale ambiance."
  },
  {
    question: "How do I get to DIFC?",
    answer: "Emirates Towers Metro station (Red Line) is 5 minutes walk. Taxis from Downtown Dubai take 5-10 minutes. DIFC is on Sheikh Zayed Road between Downtown and Business Bay."
  },
  {
    question: "Can I set up a business in DIFC?",
    answer: "DIFC welcomes financial institutions, law firms, consulting firms, and fintech companies. Benefits include 100% foreign ownership, 0% corporate tax (50-year guarantee), and English Common Law jurisdiction."
  }
];

const quickNavItems = [
  { id: "overview", label: "Overview", icon: Map },
  { id: "dining", label: "Dining", icon: Utensils },
  { id: "art", label: "Art & Culture", icon: Palette },
  { id: "business", label: "Business", icon: Briefcase },
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
          alt="DIFC Dubai Financial District"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-800/60 to-slate-900/80" />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="flex items-center justify-center gap-2 mb-6">
            <Badge className="bg-slate-500/30 text-white border-slate-400/50 backdrop-blur-sm px-4 py-2">
              <Briefcase className="w-4 h-4 mr-2" />
              Middle East's Wall Street
            </Badge>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            DIFC
            <span className="block text-3xl md:text-4xl font-normal text-slate-200 mt-2">
              Financial Hub, Fine Dining & Art 2025
            </span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            Dubai International Financial Centre — 110 acres of power suits, Michelin-level dining, 
            contemporary art galleries, and $4 trillion under management.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <Building2 className="w-4 h-4 mr-2" />
              600+ Companies
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <Scale className="w-4 h-4 mr-2" />
              English Common Law
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <Wine className="w-4 h-4 mr-2" />
              Gate Avenue Dining
            </Badge>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-slate-600 hover:bg-slate-700 text-white gap-2 text-lg px-8"
              data-testid="button-explore-difc"
              onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore DIFC <ArrowRight className="w-5 h-5" />
            </Button>
            <Link href="/districts">
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 gap-2" data-testid="button-all-districts-difc">
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
              className="flex items-center gap-2 whitespace-nowrap text-muted-foreground hover:text-slate-600"
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
    <section id="overview" className="py-20 bg-gradient-to-b from-slate-50 to-background dark:from-slate-950/20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-200 mb-4">
              Independent Jurisdiction
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">More Than a Financial District</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              DIFC is a self-governing free zone with its own courts, laws (English Common Law), 
              and regulatory framework — the Middle East's premier financial hub.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Building2, label: "$4 Trillion", desc: "Assets under management" },
              { icon: Scale, label: "Own Courts", desc: "English Common Law" },
              { icon: Users, label: "25,000+", desc: "Daily professionals" },
              { icon: CreditCard, label: "0% Tax", desc: "Corporate & personal" }
            ].map((stat, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="text-center p-6 hover-elevate">
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                  <h3 className="text-2xl font-bold mb-2">{stat.label}</h3>
                  <p className="text-muted-foreground">{stat.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="mt-12 grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" /> What Makes DIFC Unique
              </h3>
              <ul className="space-y-3">
                {[
                  "Independent legal system (English Common Law)",
                  "Own financial regulator (DFSA, not UAE Central Bank)",
                  "100% foreign ownership allowed",
                  "0% corporate and personal tax (50-year guarantee)",
                  "Gate Avenue — Dubai's finest dining destination",
                  "10+ contemporary art galleries in Gate Village",
                  "Walkable (rare in Dubai)"
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
                <Briefcase className="w-5 h-5 text-slate-600" /> Who's in DIFC
              </h3>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Global banks, hedge funds, law firms, and fintech startups. By day: 25,000+ 
                  professionals in power suits. By night: Dubai's most sophisticated dining scene.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg">
                    <strong>Banks</strong>
                    <p className="text-muted-foreground">HSBC, Citi, Standard Chartered</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-lg">
                    <strong>Law Firms</strong>
                    <p className="text-muted-foreground">Clifford Chance, Allen & Overy</p>
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

function DiningSection() {
  return (
    <section id="dining" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-200 mb-4">Gate Avenue</Badge>
            <h2 className="text-4xl font-bold mb-4">Dubai's Culinary Crown Jewel</h2>
            <p className="text-xl text-muted-foreground">Michelin-caliber restaurants on a pedestrianized boulevard</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="h-full overflow-hidden hover-elevate">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold">{restaurant.name}</h3>
                        <Badge variant="outline" className="mt-1">{restaurant.cuisine}</Badge>
                      </div>
                      <Utensils className="w-5 h-5 text-slate-600" />
                    </div>
                    <p className="text-muted-foreground mb-4">{restaurant.highlight}</p>
                    <p className="text-slate-600 font-semibold">{restaurant.price}/person</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="mt-8">
            <Card className="p-6 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-950/30 dark:to-slate-900/20">
              <h3 className="font-bold text-lg mb-4">Dining Tips</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Book 1-2 weeks ahead for Zuma, LPM</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Friday brunch culture (12pm-4pm)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Smart casual dress code throughout</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function ArtSection() {
  return (
    <section id="art" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-200 mb-4">Gate Village</Badge>
            <h2 className="text-4xl font-bold mb-4">Art & Culture Hub</h2>
            <p className="text-xl text-muted-foreground">10+ contemporary galleries with free monthly art nights</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleries.map((gallery, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="p-6 hover-elevate">
                  <Palette className="w-10 h-10 text-slate-600 mb-4" />
                  <h3 className="font-bold mb-2">{gallery.name}</h3>
                  <p className="text-sm text-muted-foreground">{gallery.specialty}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="mt-8">
            <Card className="p-6 bg-gradient-to-r from-purple-50 to-slate-50 dark:from-purple-950/20 dark:to-slate-950/20">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-600" /> First Thursday Art Nights
              </h3>
              <p className="text-muted-foreground mb-4">
                Every first Thursday of the month (6-9pm), all galleries open late with wine receptions, 
                artist talks, and free entry. Dubai's most cultured evening.
              </p>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function BusinessSection() {
  return (
    <section id="business" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Business in DIFC</h2>
            <p className="text-xl text-muted-foreground">Why global firms choose DIFC</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 hover-elevate">
              <Scale className="w-10 h-10 text-slate-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Independent Jurisdiction</h3>
              <p className="text-sm text-muted-foreground">
                Own courts operating under English Common Law, not UAE Civil Law. 
                Familiar legal framework for international businesses.
              </p>
            </Card>
            <Card className="p-6 hover-elevate">
              <CreditCard className="w-10 h-10 text-slate-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">Tax Benefits</h3>
              <p className="text-sm text-muted-foreground">
                0% corporate tax (50-year renewable guarantee), 0% personal income tax, 
                no currency restrictions, full capital repatriation.
              </p>
            </Card>
            <Card className="p-6 hover-elevate">
              <Briefcase className="w-10 h-10 text-slate-600 mb-4" />
              <h3 className="font-bold text-lg mb-2">100% Ownership</h3>
              <p className="text-sm text-muted-foreground">
                No UAE sponsor required. Full foreign ownership for financial institutions, 
                law firms, consulting, and fintech companies.
              </p>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HotelsSection() {
  return (
    <section id="hotels" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Where to Stay</h2>
            <p className="text-xl text-muted-foreground">DIFC is offices-first — stay nearby</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 hover-elevate">
              <h3 className="font-bold text-lg mb-2">Emirates Towers Hotel</h3>
              <p className="text-sm text-muted-foreground mb-3">5-min walk, adjacent to DIFC</p>
              <Badge>Business Luxury</Badge>
              <p className="text-slate-600 font-semibold mt-3">AED 800+/night</p>
            </Card>
            <Card className="p-6 hover-elevate">
              <h3 className="font-bold text-lg mb-2">Vida Downtown</h3>
              <p className="text-sm text-muted-foreground mb-3">10-min walk, modern hotel</p>
              <Badge>Mid-Range</Badge>
              <p className="text-slate-600 font-semibold mt-3">AED 500+/night</p>
            </Card>
            <Card className="p-6 hover-elevate">
              <h3 className="font-bold text-lg mb-2">Address Dubai Mall</h3>
              <p className="text-sm text-muted-foreground mb-3">15-min walk, Burj Khalifa views</p>
              <Badge>Luxury</Badge>
              <p className="text-slate-600 font-semibold mt-3">AED 1,200+/night</p>
            </Card>
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
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 hover-elevate">
              <Train className="w-10 h-10 text-slate-600 mb-4" />
              <h3 className="font-bold mb-2">Metro</h3>
              <p className="text-sm text-muted-foreground mb-3">Emirates Towers Station (Red Line)</p>
              <p className="text-sm">5-min walk to DIFC core</p>
            </Card>
            <Card className="p-6 hover-elevate">
              <MapPin className="w-10 h-10 text-slate-600 mb-4" />
              <h3 className="font-bold mb-2">Walking</h3>
              <p className="text-sm text-muted-foreground mb-3">DIFC is 100% walkable</p>
              <p className="text-sm">5 mins to Downtown, 10 mins to Business Bay</p>
            </Card>
            <Card className="p-6 hover-elevate">
              <Clock className="w-10 h-10 text-slate-600 mb-4" />
              <h3 className="font-bold mb-2">Distance</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>Downtown: 5 mins</li>
                <li>Airport (DXB): 15 mins</li>
                <li>Marina: 20 mins</li>
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
    <section id="tips" className="py-20 bg-muted/30">
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
                    "Visit Gate Avenue for dinner — Dubai's best restaurant row",
                    "Attend First Thursday gallery nights (free, 6-9pm)",
                    "Book restaurants 1-2 weeks ahead (especially Zuma, LPM)",
                    "Walk around The Gate Building at sunset for photos",
                    "Try Friday brunch — AED 350-600, all-you-can-eat + drinks",
                    "Dress smart casual — DIFC is professional"
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
                    "Expect nightlife — DIFC is dining, not clubs",
                    "Visit on weekends without plans — it's quiet (offices closed)",
                    "Skip reservations — walk-ins rarely work at top restaurants",
                    "Wear beach casual — smart dress expected",
                    "Expect budget dining — DIFC is premium pricing"
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
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section className="py-20">
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
    <section className="py-20 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Where Finance Meets Fine Dining
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Experience Dubai's most sophisticated district — world-class restaurants, 
            contemporary art, and the power center of Middle Eastern finance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/districts">
              <Button 
                size="lg" 
                className="bg-white text-slate-700 hover:bg-white/90 gap-2"
                data-testid="button-explore-more-difc"
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

export default function DistrictDIFC() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav variant="transparent" />
      <HeroSection />
      <QuickNavSection />
      <OverviewSection />
      <DiningSection />
      <ArtSection />
      <BusinessSection />
      <HotelsSection />
      <TransportSection />
      <TipsSection />
      <FAQSection />
      <CTASection />
      <PublicFooter />
    </div>
  );
}
