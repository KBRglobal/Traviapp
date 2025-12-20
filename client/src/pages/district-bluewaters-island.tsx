import { Link } from "wouter";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { motion } from "framer-motion";
import { 
  MapPin, Building2, Star, ArrowRight, Clock, Users, 
  Utensils, Bed, Train, Sparkles, ChevronDown, Check, X, 
  Sun, Waves, Wine, Camera, Ship, Eye, Map
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

const restaurants = [
  { name: "Hell's Kitchen", cuisine: "International", highlight: "Gordon Ramsay's signature restaurant" },
  { name: "Claw BBQ", cuisine: "Seafood", highlight: "Louisiana-style seafood boil" },
  { name: "The Maine Oyster Bar", cuisine: "Seafood", highlight: "New England seafood" },
  { name: "Sushisamba", cuisine: "Japanese-Brazilian", highlight: "Fusion, trendy vibe" },
  { name: "Din Tai Fung", cuisine: "Taiwanese", highlight: "Famous xiaolongbao dumplings" },
  { name: "La Cantine du Faubourg", cuisine: "French", highlight: "Chic French brasserie" }
];

const faqs = [
  {
    question: "Is Ain Dubai open?",
    answer: "No. Ain Dubai (the 250m observation wheel) has been closed since March 2022 for 'maintenance' with no reopening date announced. The rest of Bluewaters Island operates normally."
  },
  {
    question: "Is Bluewaters Island worth visiting?",
    answer: "Yes! Despite Ain Dubai being closed, the island has excellent restaurants (Hell's Kitchen, Claw BBQ), a nice beach, Caesars Palace hotel, and easy walking access to JBR. Great for dining and beach day."
  },
  {
    question: "How do I get to Bluewaters Island?",
    answer: "Walk via the pedestrian bridge from JBR (5 mins), take Dubai Tram to Bluewaters station, or taxi. The island is car-free — park at the entrance or use valet."
  },
  {
    question: "Can you swim at Bluewaters Beach?",
    answer: "Yes! Bluewaters Beach is a small public beach (~500m) with lifeguards, sun loungers, and calm waters. Less crowded than JBR beach."
  },
  {
    question: "Is Caesars Palace Dubai worth staying at?",
    answer: "Yes for luxury seekers. 5-star beachfront with 9 restaurants including Hell's Kitchen, Roman-themed spa, pools, and direct beach access. AED 800-1,500+/night."
  }
];

const quickNavItems = [
  { id: "overview", label: "Overview", icon: Map },
  { id: "ain-dubai", label: "Ain Dubai", icon: Eye },
  { id: "beach", label: "Beach", icon: Waves },
  { id: "dining", label: "Dining", icon: Utensils },
  { id: "hotels", label: "Hotels", icon: Bed },
  { id: "tips", label: "Tips", icon: Sparkles }
];

function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop"
          alt="Bluewaters Island Dubai"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-blue-800/60 to-blue-900/80" />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="flex items-center justify-center gap-2 mb-6">
            <Badge className="bg-blue-500/30 text-white border-blue-400/50 backdrop-blur-sm px-4 py-2">
              <Ship className="w-4 h-4 mr-2" />
              Dubai Marina's Island Playground
            </Badge>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Bluewaters Island
            <span className="block text-3xl md:text-4xl font-normal text-blue-200 mt-2">
              Beach, Dining & Entertainment 2025
            </span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            Compact island destination — Caesars Palace, 50+ restaurants, beach access, 
            and The Wharf waterfront dining. 5 mins from JBR.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <Waves className="w-4 h-4 mr-2" />
              Beach Access
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <Utensils className="w-4 h-4 mr-2" />
              50+ Restaurants
            </Badge>
            <Badge className="bg-yellow-500/30 text-white border-yellow-400/50 backdrop-blur-sm text-lg px-4 py-2">
              <Eye className="w-4 h-4 mr-2" />
              Ain Dubai CLOSED
            </Badge>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-blue-500 hover:bg-blue-600 text-white gap-2 text-lg px-8"
              data-testid="button-explore-bluewaters"
              onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Bluewaters <ArrowRight className="w-5 h-5" />
            </Button>
            <Link href="/districts">
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 gap-2" data-testid="button-all-districts-bluewaters">
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
              className="flex items-center gap-2 whitespace-nowrap text-muted-foreground hover:text-blue-600"
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
    <section id="overview" className="py-20 bg-gradient-to-b from-blue-50 to-background dark:from-blue-950/20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 mb-4">
              By Meraas
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Marina's Island Extension</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A 0.4 sq km man-made island built as Dubai's urban beach resort — 
              pedestrian-only, waterfront dining, and easy JBR connection.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Building2, label: "0.4 sq km", desc: "Compact island" },
              { icon: Utensils, label: "50+", desc: "Restaurants & cafes" },
              { icon: Clock, label: "5 mins", desc: "Walk to JBR" },
              { icon: Train, label: "Tram", desc: "Direct station" }
            ].map((stat, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="text-center p-6 hover-elevate">
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-2xl font-bold mb-2">{stat.label}</h3>
                  <p className="text-muted-foreground">{stat.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function AinDubaiSection() {
  return (
    <section id="ain-dubai" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 mb-4">Currently Closed</Badge>
            <h2 className="text-4xl font-bold mb-4">Ain Dubai Status</h2>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="p-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-6">
                <Eye className="w-16 h-16 text-yellow-600 shrink-0" />
                <div>
                  <h3 className="font-bold text-xl mb-4">The Elephant in the Room</h3>
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      <strong>Ain Dubai</strong> — the 250-meter observation wheel meant to be the world's tallest — 
                      opened in October 2021 to massive fanfare. It closed in March 2022 for "routine maintenance" 
                      and has remained closed with no reopening date announced.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-semibold text-foreground">What it was supposed to be:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>250m tall (taller than London Eye)</li>
                          <li>48 capsules, 40 people each</li>
                          <li>38-min rotation</li>
                          <li>360° Marina/Palm views</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Current status:</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Closed since March 2022</li>
                          <li>No reopening date</li>
                          <li>Structure still stands (photo opportunity)</li>
                          <li>Island functions fine without it</li>
                        </ul>
                      </div>
                    </div>
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

function BeachSection() {
  return (
    <section id="beach" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 mb-4">Open & Accessible</Badge>
            <h2 className="text-4xl font-bold mb-4">Bluewaters Beach</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div variants={fadeInUp}>
              <Card className="p-6 h-full">
                <Waves className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="font-bold text-xl mb-4">Beach Features</h3>
                <ul className="space-y-3">
                  {[
                    "~500m of clean sand (compact but nice)",
                    "Free access, sun loungers available",
                    "Lifeguards on duty",
                    "Showers & changing rooms",
                    "Calm waters, shallow entry (family-friendly)",
                    "Views of Ain Dubai structure, Palm Jumeirah"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card className="p-6 h-full">
                <Sun className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="font-bold text-xl mb-4">Best Times</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <p className="font-semibold">Morning (7-10am)</p>
                    <p className="text-sm text-muted-foreground">Peaceful, empty, cooler</p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <p className="font-semibold">Afternoon (3-6pm)</p>
                    <p className="text-sm text-muted-foreground">Busy with families, tourists</p>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                    <p className="font-semibold">Sunset (6-7pm)</p>
                    <p className="text-sm text-muted-foreground">Golden hour, romantic</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
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
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 mb-4">The Wharf</Badge>
            <h2 className="text-4xl font-bold mb-4">Waterfront Dining</h2>
            <p className="text-xl text-muted-foreground">50+ restaurants on an 800m boardwalk</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="p-6 hover-elevate">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold">{restaurant.name}</h3>
                      <Badge variant="outline" className="mt-1">{restaurant.cuisine}</Badge>
                    </div>
                    <Utensils className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-sm text-muted-foreground">{restaurant.highlight}</p>
                </Card>
              </motion.div>
            ))}
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
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="p-8">
              <div className="flex items-start gap-6">
                <Bed className="w-16 h-16 text-blue-600 shrink-0" />
                <div>
                  <Badge className="mb-2">5-Star Luxury</Badge>
                  <h3 className="font-bold text-2xl mb-2">Caesars Palace Dubai</h3>
                  <p className="text-muted-foreground mb-4">
                    First Caesars resort in Middle East. 194 rooms, 9 restaurants (including Hell's Kitchen), 
                    beachfront, Roman-themed Qua Spa, multiple pools.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                      <p className="font-semibold">Standard Room</p>
                      <p className="text-blue-600">AED 800-1,500/night</p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                      <p className="font-semibold">Suite</p>
                      <p className="text-blue-600">AED 1,800-4,000/night</p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                      <p className="font-semibold">Best For</p>
                      <p className="text-muted-foreground">Couples, families</p>
                    </div>
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
                  "Walk from JBR via pedestrian bridge (5 mins, scenic)",
                  "Come for sunset beach + dinner combo",
                  "Try Hell's Kitchen for Gordon Ramsay experience",
                  "Use Dubai Tram for easy Marina connection",
                  "Photograph Ain Dubai structure (even closed, iconic)"
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
                  "Expect Ain Dubai to reopen (no date announced)",
                  "Drive onto island (it's car-free, park at entrance)",
                  "Skip reservations for Hell's Kitchen (book ahead)",
                  "Expect budget dining (premium pricing throughout)"
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
    <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Marina's Island Escape
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Beach, dining, and waterfront vibes — all within walking distance of JBR and Dubai Marina.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/districts">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-white/90 gap-2"
                data-testid="button-explore-more-bluewaters"
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

export default function DistrictBluwatersIsland() {
  const { isRTL } = useLocale();
  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <PublicNav variant="transparent" />
      <HeroSection />
      <QuickNavSection />
      <OverviewSection />
      <AinDubaiSection />
      <BeachSection />
      <DiningSection />
      <HotelsSection />
      <TipsSection />
      <FAQSection />
      <CTASection />
      <PublicFooter />
    </div>
  );
}
