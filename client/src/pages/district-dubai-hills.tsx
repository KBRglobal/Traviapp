import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  MapPin, Building2, Star, ArrowRight, Clock, Users, 
  Utensils, Bed, ShoppingBag, Train, Sparkles, ChevronDown, Check, X, 
  Sun, TreePine, Home, GraduationCap, Heart, Bike, Map
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

const attractions = [
  {
    name: "Dubai Hills Golf Club",
    tagline: "18-Hole Championship Course",
    description: "Par 72, 7,240 yards by European Golf Design. Floodlit driving range, golf academy, clubhouse restaurant.",
    highlight: "AED 400-600/round, membership AED 120K+"
  },
  {
    name: "Dubai Hills Mall",
    tagline: "2 Million Sq Ft Shopping",
    description: "750+ stores, Galeries Lafayette, Reel Cinemas (18 screens), 100+ restaurants, outdoor promenade.",
    highlight: "20+ million annual visitors"
  },
  {
    name: "Central Park",
    tagline: "18 km Linear Green Spine",
    description: "Walking/cycling paths, outdoor fitness, playgrounds, dog parks, skate park, BBQ areas.",
    highlight: "Free access, 6am-11pm"
  }
];

const housingTypes = [
  { type: "Luxury Villas", beds: "4-6 bed", price: "AED 5-20M", forWhom: "Affluent expat families" },
  { type: "Townhouses", beds: "3-4 bed", price: "AED 2.5-5M", forWhom: "Young families" },
  { type: "Apartments", beds: "Studio-3 bed", price: "AED 600K-3.5M", forWhom: "Professionals, investors" }
];

const faqs = [
  {
    question: "Is Dubai Hills Estate a good place to live?",
    answer: "Excellent for families seeking space, safety, and modern amenities. Golf course, mall, parks, schools — all within the community. 30% cheaper than Downtown but 15-20 mins away."
  },
  {
    question: "What is Dubai Hills Mall like?",
    answer: "Dubai's 2nd largest mall with 750+ stores, Galeries Lafayette, Reel Cinemas (18 screens), 100+ restaurants, and outdoor dining. Less crowded than Dubai Mall."
  },
  {
    question: "Is there Metro access to Dubai Hills?",
    answer: "Not yet. Future Metro extension planned. Currently car-dependent. 15 mins to Downtown, 20 mins to Marina by car."
  },
  {
    question: "Who lives in Dubai Hills Estate?",
    answer: "Expat families (European, Arab, Indian), UAE nationals, young professionals. Mix of villas, townhouses, and apartments across all price points."
  },
  {
    question: "Is Dubai Hills good for investment?",
    answer: "Strong appreciation since 2015 launch. Emaar quality, central location, master-planned community. Good for long-term hold, especially villas."
  }
];

const quickNavItems = [
  { id: "overview", label: "Overview", icon: Map },
  { id: "attractions", label: "Attractions", icon: Star },
  { id: "housing", label: "Housing", icon: Home },
  { id: "families", label: "Families", icon: Heart },
  { id: "hotels", label: "Hotels", icon: Bed },
  { id: "tips", label: "Tips", icon: Sparkles }
];

function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1920&h=1080&fit=crop"
          alt="Dubai Hills Estate Golf Course"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/70 via-emerald-800/60 to-emerald-900/80" />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="flex items-center justify-center gap-2 mb-6">
            <Badge className="bg-emerald-500/30 text-white border-emerald-400/50 backdrop-blur-sm px-4 py-2">
              <TreePine className="w-4 h-4 mr-2" />
              Dubai's Largest Master-Planned Community
            </Badge>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Dubai Hills Estate
            <span className="block text-3xl md:text-4xl font-normal text-emerald-200 mt-2">
              Golf, Mall & Family Living 2025
            </span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            2,700 acres of Emaar perfection — championship golf course, mega mall, 
            18 km Central Park, top schools. Where Dubai families thrive.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <Building2 className="w-4 h-4 mr-2" />
              2,700 Acres
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <Star className="w-4 h-4 mr-2" />
              18-Hole Golf Course
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <ShoppingBag className="w-4 h-4 mr-2" />
              750+ Store Mall
            </Badge>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 text-lg px-8"
              data-testid="button-explore-dubai-hills"
              onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Dubai Hills <ArrowRight className="w-5 h-5" />
            </Button>
            <Link href="/dubai/districts">
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 gap-2" data-testid="button-all-districts-hills">
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
              className="flex items-center gap-2 whitespace-nowrap text-muted-foreground hover:text-emerald-600"
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
    <section id="overview" className="py-20 bg-gradient-to-b from-emerald-50 to-background dark:from-emerald-950/20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200 mb-4">
              By Emaar Properties
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">The Perfect Suburban Community</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Larger than Downtown Dubai, Dubai Hills Estate is Emaar's answer to 
              "What if we built the perfect family community from scratch?"
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Building2, label: "2,700 Acres", desc: "Larger than Downtown" },
              { icon: Users, label: "80,000+", desc: "Projected residents" },
              { icon: Bike, label: "18 km Park", desc: "Central green spine" },
              { icon: ShoppingBag, label: "750+ Stores", desc: "Dubai Hills Mall" }
            ].map((stat, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="text-center p-6 hover-elevate">
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-emerald-600" />
                  <h3 className="text-2xl font-bold mb-2">{stat.label}</h3>
                  <p className="text-muted-foreground">{stat.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="mt-12 grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" /> Why Choose Dubai Hills
              </h3>
              <ul className="space-y-3">
                {[
                  "Master-planned by Emaar (Burj Khalifa developer)",
                  "Championship golf course at the heart",
                  "2 million sq ft mall with 750+ stores",
                  "18 km Central Park with cycling/jogging",
                  "Top international schools (GEMS, Raffles)",
                  "King's College Hospital on-site",
                  "Central location (15 mins to Downtown)"
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
                  "No beach (20 mins to Marina/Jumeirah)",
                  "No Metro access (car essential)",
                  "Suburban feel (quiet, not vibrant)",
                  "Ongoing construction (some areas)",
                  "Limited nightlife (family area)"
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

function AttractionsSection() {
  return (
    <section id="attractions" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200 mb-4">Community Highlights</Badge>
            <h2 className="text-4xl font-bold mb-4">Top Attractions</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {attractions.map((attraction, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="h-full overflow-hidden hover-elevate">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{attraction.name}</h3>
                    <p className="text-emerald-600 text-sm mb-4">{attraction.tagline}</p>
                    <p className="text-muted-foreground mb-4">{attraction.description}</p>
                    <Badge variant="outline">{attraction.highlight}</Badge>
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

function HousingSection() {
  return (
    <section id="housing" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200 mb-4">Mixed Housing</Badge>
            <h2 className="text-4xl font-bold mb-4">Residential Options</h2>
            <p className="text-xl text-muted-foreground">All price ranges — villas to studios</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {housingTypes.map((housing, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="p-6 hover-elevate">
                  <Home className="w-10 h-10 text-emerald-600 mb-4" />
                  <h3 className="font-bold text-lg mb-2">{housing.type}</h3>
                  <p className="text-muted-foreground mb-2">{housing.beds}</p>
                  <p className="text-emerald-600 font-semibold mb-3">{housing.price}</p>
                  <Badge variant="outline">{housing.forWhom}</Badge>
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
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200 mb-4">Family Paradise</Badge>
            <h2 className="text-4xl font-bold mb-4">Perfect for Families</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover-elevate">
              <GraduationCap className="w-10 h-10 text-emerald-600 mb-4" />
              <h3 className="font-bold mb-2">Top Schools</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>GEMS Wellington Academy</li>
                <li>Raffles International School</li>
                <li>Repton School (nearby)</li>
              </ul>
            </Card>
            <Card className="p-6 hover-elevate">
              <Heart className="w-10 h-10 text-emerald-600 mb-4" />
              <h3 className="font-bold mb-2">Healthcare</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>King's College Hospital</li>
                <li>24/7 Emergency</li>
                <li>Multiple clinics</li>
              </ul>
            </Card>
            <Card className="p-6 hover-elevate">
              <TreePine className="w-10 h-10 text-emerald-600 mb-4" />
              <h3 className="font-bold mb-2">Parks & Play</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>18 km Central Park</li>
                <li>Multiple playgrounds</li>
                <li>Skate park</li>
              </ul>
            </Card>
            <Card className="p-6 hover-elevate">
              <ShoppingBag className="w-10 h-10 text-emerald-600 mb-4" />
              <h3 className="font-bold mb-2">Convenience</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Dubai Hills Mall</li>
                <li>Groceries (Carrefour, Waitrose)</li>
                <li>All amenities within</li>
              </ul>
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
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 hover-elevate">
              <h3 className="font-bold text-lg mb-2">Vida Dubai Hills</h3>
              <Badge className="mb-3">Mid-Range</Badge>
              <p className="text-sm text-muted-foreground mb-3">150+ rooms, golf course access, pool, gym, restaurant</p>
              <p className="text-emerald-600 font-semibold">AED 500+/night</p>
            </Card>
            <Card className="p-6 hover-elevate">
              <h3 className="font-bold text-lg mb-2">Vacation Rentals</h3>
              <Badge className="mb-3">Airbnb</Badge>
              <p className="text-sm text-muted-foreground mb-3">1-bed: AED 300-500/night, Villas: AED 1,200-3,500/night</p>
              <p className="text-emerald-600 font-semibold">Best for families</p>
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
                  "Walk/jog Central Park early morning (6-8am)",
                  "Play twilight golf (cheaper, cooler)",
                  "Explore Dubai Hills Mall on weekdays (less crowded)",
                  "Have a car — essential here",
                  "Consider for families relocating to Dubai"
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
                  "Expect beach access (20 mins drive)",
                  "Expect nightlife (family area)",
                  "Stay here as first-time tourist (see Downtown/Marina first)",
                  "Underestimate size (it's massive, you'll drive within)"
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
    <section className="py-20 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Dubai's Family Paradise
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            From championship golf to world-class schools, discover why Dubai Hills Estate 
            is the top choice for families relocating to Dubai.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dubai/districts">
              <Button 
                size="lg" 
                className="bg-white text-emerald-600 hover:bg-white/90 gap-2"
                data-testid="button-explore-more-hills"
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

export default function DistrictDubaiHills() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav variant="transparent" />
      <HeroSection />
      <QuickNavSection />
      <OverviewSection />
      <AttractionsSection />
      <HousingSection />
      <FamiliesSection />
      <HotelsSection />
      <TipsSection />
      <FAQSection />
      <CTASection />
      <PublicFooter />
    </div>
  );
}
