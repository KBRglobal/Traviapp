import { useState } from "react";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  MapPin, Building2, Star, ArrowRight, Clock, Users, Camera, 
  Utensils, Bed, ShoppingBag, Train, Car, Plane, Sparkles,
  ChevronDown, Check, X, Sun, Sunset, Thermometer, TreePine,
  Phone, Shield, CreditCard, Construction, Palmtree, Building,
  Calendar, Heart, Map, TrendingUp, Home, Compass
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

const districts = [
  { name: "Al Maktoum Airport", status: "Operational", desc: "Future world's largest airport (260M capacity)", icon: Plane },
  { name: "Expo City Dubai", status: "Operational", desc: "Permanent Expo 2020 legacy, pavilions, events", icon: Building2 },
  { name: "The Pulse", status: "Delivering", desc: "Mid-range residential community", icon: Home },
  { name: "Palm Jebel Ali", status: "Under Construction", desc: "Second Palm Island, 50% larger", icon: Palmtree },
  { name: "Aviation District", status: "Operational", desc: "Aircraft maintenance, cargo operations", icon: Plane },
  { name: "Logistics District", status: "Operational", desc: "Warehousing, e-commerce, cold storage", icon: Building }
];

const attractions = [
  {
    name: "Expo City Dubai",
    tagline: "World Expo Legacy Site",
    description: "UAE Pavilion, Terra Sustainability Pavilion, Alif Mobility Pavilion, Al Wasl Plaza events, 80+ hectares of gardens.",
    status: "Operational",
    entry: "Many areas FREE, some AED 20-40"
  },
  {
    name: "Surreal Water Park",
    tagline: "World's First Surrealism-Themed Water Park",
    description: "Region's largest water park integrated with Expo City green spaces.",
    status: "Opening 2025+",
    entry: "TBD"
  },
  {
    name: "Expo City Gardens",
    tagline: "80+ Hectares of Green Space",
    description: "Walking, jogging, cycling paths. Outdoor fitness zones, picnic areas.",
    status: "Operational",
    entry: "Free"
  }
];

const faqs = [
  {
    question: "Is Dubai South a good place to live?",
    answer: "Good fit for: Budget-conscious expats (save 40% on rent), families wanting space, Abu Dhabi commuters, aviation/logistics workers. Not ideal for: Beach lovers, nightlife seekers, those needing established amenities."
  },
  {
    question: "How far is Dubai South from Dubai Marina?",
    answer: "50 km, 40-50 minutes by car. By Metro: 50-55 minutes via Route 2020. Dubai South is significantly further from central Dubai attractions."
  },
  {
    question: "Is Dubai South connected to Metro?",
    answer: "Yes! Metro Route 2020 (Red Line extension) serves Dubai South with stations at The Pulse and nearby areas. Journey time to Dubai Marina: 35-40 mins, to Downtown: 50-55 mins."
  },
  {
    question: "What is Palm Jebel Ali?",
    answer: "The second Palm Island, 50% larger than Palm Jumeirah. Construction resumed 2023 after 15-year pause. Expected completion 2030-2035+ with luxury villas, resorts, and beaches."
  },
  {
    question: "How far is Dubai South from Abu Dhabi?",
    answer: "Only 30 minutes! Dubai South is the closest Dubai district to Abu Dhabi (75 km), making it ideal for workers who commute between both emirates."
  }
];

const quickNavItems = [
  { id: "overview", label: "Overview", icon: Map },
  { id: "districts", label: "Districts", icon: Building2 },
  { id: "expo-city", label: "Expo City", icon: Star },
  { id: "airport", label: "Airport", icon: Plane },
  { id: "palm-jebel-ali", label: "Palm Jebel Ali", icon: Palmtree },
  { id: "transport", label: "Transport", icon: Train },
  { id: "tips", label: "Tips", icon: Sparkles }
];

function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&h=1080&fit=crop"
          alt="Dubai South Expo City"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/70 via-purple-800/60 to-indigo-900/80" />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="flex items-center justify-center gap-2 mb-6">
            <Badge className="bg-indigo-500/30 text-white border-indigo-400/50 backdrop-blur-sm px-4 py-2">
              <Plane className="w-4 h-4 mr-2" />
              Dubai's Boldest Bet on the Future
            </Badge>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Dubai South
            <span className="block text-3xl md:text-4xl font-normal text-indigo-200 mt-2">
              Expo City, Airport & Future Hub 2025
            </span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            145 sq km mega-development — 3x Manhattan. World's largest airport, 
            Expo City legacy, Palm Jebel Ali. 30 mins from Abu Dhabi.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <Building2 className="w-4 h-4 mr-2" />
              145 sq km Development
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <Plane className="w-4 h-4 mr-2" />
              260M Airport Capacity
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-lg px-4 py-2">
              <Compass className="w-4 h-4 mr-2" />
              30 mins to Abu Dhabi
            </Badge>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-indigo-500 hover:bg-indigo-600 text-white gap-2 text-lg px-8"
              data-testid="button-explore-dubai-south"
              onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Dubai South <ArrowRight className="w-5 h-5" />
            </Button>
            <Link href="/districts">
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 gap-2" data-testid="button-all-districts-south">
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
              className="flex items-center gap-2 whitespace-nowrap text-muted-foreground hover:text-indigo-600"
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
    <section id="overview" className="py-20 bg-gradient-to-b from-indigo-50 to-background dark:from-indigo-950/20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200 mb-4">
              Dubai 3.0
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">The Future Mega-Hub</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              After Old Dubai (trading) and New Dubai (tourism), Dubai South represents 
              the aviation, logistics, and innovation era. A 50-year vision.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Building2, label: "145 sq km", desc: "3x Manhattan's size" },
              { icon: Plane, label: "260M Capacity", desc: "World's largest airport" },
              { icon: Users, label: "1M+ Planned", desc: "Population by 2040" },
              { icon: Compass, label: "30 mins", desc: "To Abu Dhabi" }
            ].map((stat, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="text-center p-6 hover-elevate">
                  <stat.icon className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
                  <h3 className="text-2xl font-bold mb-2">{stat.label}</h3>
                  <p className="text-muted-foreground">{stat.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="mt-12">
            <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
              <h3 className="font-bold text-lg mb-4">What Exists NOW (2025) vs. FUTURE</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                    <Check className="w-4 h-4" /> Operational Now
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Al Maktoum Airport (1 terminal)</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Expo City Dubai (pavilions, events)</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> The Pulse residential community</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Metro Route 2020</li>
                    <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-600" /> Basic supermarkets, fast food</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-indigo-600 mb-3 flex items-center gap-2">
                    <Construction className="w-4 h-4" /> Coming (2025-2040)
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2"><Construction className="w-4 h-4 text-indigo-600" /> Surreal Water Park (2025+)</li>
                    <li className="flex items-center gap-2"><Construction className="w-4 h-4 text-indigo-600" /> Palm Jebel Ali (2030-2035)</li>
                    <li className="flex items-center gap-2"><Construction className="w-4 h-4 text-indigo-600" /> Full airport (260M capacity)</li>
                    <li className="flex items-center gap-2"><Construction className="w-4 h-4 text-indigo-600" /> Emirates airline relocation</li>
                    <li className="flex items-center gap-2"><Construction className="w-4 h-4 text-indigo-600" /> Dubai South Mall</li>
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

function DistrictsSection() {
  return (
    <section id="districts" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">The Districts</h2>
            <p className="text-xl text-muted-foreground">Multiple specialized zones</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {districts.map((district, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="p-6 h-full hover-elevate">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shrink-0">
                      <district.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold">{district.name}</h3>
                        <Badge className={
                          district.status === "Operational" ? "bg-green-100 text-green-800" :
                          district.status === "Delivering" ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        } variant="outline">{district.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{district.desc}</p>
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

function ExpoCitySection() {
  return (
    <section id="expo-city" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200 mb-4">Expo 2020 Legacy</Badge>
            <h2 className="text-4xl font-bold mb-4">Expo City Dubai</h2>
            <p className="text-xl text-muted-foreground">Permanent innovation, culture, and events district</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {attractions.map((attraction, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card className="h-full overflow-hidden hover-elevate">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold">{attraction.name}</h3>
                        <p className="text-indigo-600 text-sm">{attraction.tagline}</p>
                      </div>
                      <Badge className={
                        attraction.status === "Operational" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }>{attraction.status}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{attraction.description}</p>
                    <p className="text-sm font-semibold text-indigo-600">{attraction.entry}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="mt-8">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">Expo City Pavilions</h3>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { name: "UAE Pavilion", desc: "The Falcon's Flight" },
                  { name: "Terra Pavilion", desc: "Sustainability, solar-powered" },
                  { name: "Alif Pavilion", desc: "Mobility innovation" },
                  { name: "Al Wasl Plaza", desc: "Events, projection dome" }
                ].map((pavilion, idx) => (
                  <div key={idx} className="p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg text-center">
                    <p className="font-semibold">{pavilion.name}</p>
                    <p className="text-sm text-muted-foreground">{pavilion.desc}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function AirportSection() {
  return (
    <section id="airport" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200 mb-4">Aviation Hub</Badge>
            <h2 className="text-4xl font-bold mb-4">Al Maktoum International Airport</h2>
            <p className="text-xl text-muted-foreground">Future world's largest airport</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 text-green-600">Current Operations (2025)</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-600" /> 1 concourse, 1 runway operational</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-600" /> 26 million passengers/year capacity</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-600" /> flydubai, Wizz Air, Air Arabia</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-600" /> Major cargo hub (Emirates SkyCargo)</li>
                <li className="flex items-center gap-3"><Check className="w-4 h-4 text-green-600" /> Less crowded than DXB</li>
              </ul>
            </Card>
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 text-indigo-600">Future Vision (2040)</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3"><TrendingUp className="w-4 h-4 text-indigo-600" /> 5 parallel runways</li>
                <li className="flex items-center gap-3"><TrendingUp className="w-4 h-4 text-indigo-600" /> 260 million passengers/year</li>
                <li className="flex items-center gap-3"><TrendingUp className="w-4 h-4 text-indigo-600" /> Full Emirates airline relocation</li>
                <li className="flex items-center gap-3"><TrendingUp className="w-4 h-4 text-indigo-600" /> 200+ gates, 4 terminals</li>
                <li className="flex items-center gap-3"><TrendingUp className="w-4 h-4 text-indigo-600" /> World's busiest airport</li>
              </ul>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function PalmJebelAliSection() {
  return (
    <section id="palm-jebel-ali" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 mb-4">Construction Resumed</Badge>
            <h2 className="text-4xl font-bold mb-4">Palm Jebel Ali</h2>
            <p className="text-xl text-muted-foreground">The Second Palm Island — 50% Larger</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div variants={fadeInUp}>
              <Card className="p-6 h-full">
                <Palmtree className="w-12 h-12 text-indigo-600 mb-4" />
                <h3 className="font-bold text-xl mb-4">What's Planned</h3>
                <ul className="space-y-3">
                  {[
                    "50% larger than Palm Jumeirah",
                    "16 fronds (vs 17 on Palm Jumeirah)",
                    "Luxury beachfront villas",
                    "Atlantis-style mega-resorts",
                    "Beach clubs and marinas",
                    "Water parks and entertainment"
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
                <Calendar className="w-12 h-12 text-indigo-600 mb-4" />
                <h3 className="font-bold text-xl mb-4">Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">2002</Badge>
                    <span className="text-sm">Project announced</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">2007</Badge>
                    <span className="text-sm">Construction began</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="bg-red-50 text-red-700">2008-2023</Badge>
                    <span className="text-sm">15 years paused (financial crisis)</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="bg-green-50 text-green-700">2023</Badge>
                    <span className="text-sm">Construction resumed</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700">2030-2035</Badge>
                    <span className="text-sm">Expected completion</span>
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

function TransportSection() {
  return (
    <section id="transport" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Getting Around</h2>
            <p className="text-xl text-muted-foreground">Car-dependent with Metro connection</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover-elevate">
              <Train className="w-10 h-10 text-indigo-600 mb-4" />
              <h3 className="font-bold mb-2">Metro Route 2020</h3>
              <p className="text-sm text-muted-foreground mb-3">Red Line extension to Dubai South</p>
              <ul className="text-sm space-y-1">
                <li>To Marina: 35-40 mins</li>
                <li>To Downtown: 50-55 mins</li>
              </ul>
              <p className="text-indigo-600 font-semibold mt-3">AED 7-15</p>
            </Card>
            <Card className="p-6 hover-elevate">
              <Car className="w-10 h-10 text-indigo-600 mb-4" />
              <h3 className="font-bold mb-2">By Car</h3>
              <p className="text-sm text-muted-foreground mb-3">Via Emirates Road (E611)</p>
              <ul className="text-sm space-y-1">
                <li>To Downtown: 35-45 mins</li>
                <li>To Abu Dhabi: 25-35 mins</li>
              </ul>
            </Card>
            <Card className="p-6 hover-elevate bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
              <Compass className="w-10 h-10 text-indigo-600 mb-4" />
              <h3 className="font-bold mb-2">Abu Dhabi Advantage</h3>
              <p className="text-sm text-muted-foreground mb-3">Closest Dubai district!</p>
              <ul className="text-sm space-y-1">
                <li>Only 30 mins to Abu Dhabi</li>
                <li>Work/live between emirates</li>
              </ul>
            </Card>
            <Card className="p-6 hover-elevate">
              <Plane className="w-10 h-10 text-indigo-600 mb-4" />
              <h3 className="font-bold mb-2">DWC Airport</h3>
              <p className="text-sm text-muted-foreground mb-3">On-site access</p>
              <ul className="text-sm space-y-1">
                <li>5-10 mins to terminals</li>
                <li>Budget airlines, cargo</li>
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
                    "Own or rent a car — Dubai South is car-dependent",
                    "Embrace the budget advantage (30-50% cheaper rent)",
                    "Utilize Expo City for free events and activities",
                    "Fly DWC when possible — less crowded than DXB",
                    "Take Abu Dhabi weekend trips (only 30 mins!)",
                    "Think long-term investment (5-10 year horizon)"
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
                    "Expect beach lifestyle — no ocean until Palm Jebel Ali (2030s)",
                    "Expect nightlife — family-oriented district",
                    "Underestimate commute times — 50+ mins to Downtown",
                    "Expect complete amenities — it's a 20-year project",
                    "Rely on Metro alone — last-mile gaps require car"
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
    <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-500 to-indigo-500">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Dubai's 50-Year Vision
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            From the world's largest airport to Palm Jebel Ali, witness Dubai's 
            most ambitious development taking shape.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/districts">
              <Button 
                size="lg" 
                className="bg-white text-indigo-600 hover:bg-white/90 gap-2"
                data-testid="button-explore-more-south"
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

export default function DistrictDubaiSouth() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav variant="transparent" />
      <HeroSection />
      <QuickNavSection />
      <OverviewSection />
      <DistrictsSection />
      <ExpoCitySection />
      <AirportSection />
      <PalmJebelAliSection />
      <TransportSection />
      <TipsSection />
      <FAQSection />
      <CTASection />
      <PublicFooter />
    </div>
  );
}
