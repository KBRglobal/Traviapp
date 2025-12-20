import { useRef, useState, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Waves, MapPin, Camera, Sparkles, Sun, Bird, Clock, 
  ChevronRight, Star, Download, ArrowRight, ChevronDown,
  TreePalm, Building2, Music, Heart,
  Users, Wallet, Trophy, CheckCircle2, Bike,
  Ship, Train, Mountain, Palette, ShoppingBag,
  Sunset, Footprints, Eye, Compass, Globe, Mail, Check,
  Filter, X, Calculator, ListChecks, Map, Gift,
  Phone, Home, Calendar, Coffee, Utensils, PartyPopper
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";

// Categories for filtering
const categories = [
  { id: "all", label: "All Free", icon: Sparkles, color: "from-purple-500 to-pink-500" },
  { id: "beaches", label: "Beaches", icon: Waves, color: "from-cyan-500 to-blue-500" },
  { id: "heritage", label: "Heritage", icon: MapPin, color: "from-amber-500 to-orange-500" },
  { id: "parks", label: "Parks", icon: TreePalm, color: "from-green-500 to-emerald-500" },
  { id: "shows", label: "Shows", icon: Music, color: "from-pink-500 to-rose-500" },
  { id: "art", label: "Art", icon: Palette, color: "from-purple-500 to-violet-500" },
  { id: "sports", label: "Sports", icon: Bike, color: "from-lime-500 to-green-500" },
  { id: "skyline", label: "Skyline", icon: Building2, color: "from-slate-600 to-slate-800" },
];

// Hero stats
const heroStats = [
  { icon: Wallet, value: "AED 2,500+", label: "Save Per Week" },
  { icon: Waves, value: "7", label: "Free Beaches" },
  { icon: Sparkles, value: "70+", label: "Free Activities" },
  { icon: Camera, value: "50+", label: "Photo Spots" },
];

// All attractions with category
interface Attraction {
  id: string;
  name: string;
  desc: string;
  category: string;
  savings?: string;
  metro?: string;
  bestTime?: string;
  highlight?: boolean;
}

const allAttractions: Attraction[] = [
  // Beaches
  { id: "jbr", name: "JBR Beach", desc: "Blue Flag certified with free showers, changing rooms, and 24/7 lifeguards. Best sunset views.", category: "beaches", savings: "AED 150-500", metro: "JBR Tram", bestTime: "7am-10am", highlight: true },
  { id: "kite", name: "Kite Beach", desc: "14km running track, beach volleyball courts, Burj Al Arab views. Perfect for active visitors.", category: "beaches", savings: "AED 200+", metro: "Mall of Emirates + Taxi", bestTime: "5pm-8pm", highlight: true },
  { id: "lamer", name: "La Mer Beach", desc: "Trendy beachfront with street art, splash pads for kids, and Instagram-worthy spots.", category: "beaches", savings: "AED 150+", metro: "Dubai Healthcare City", bestTime: "4pm-9pm" },
  { id: "black", name: "Black Palace Beach", desc: "Secret hidden gem away from crowds. Crystal clear water, local favorite.", category: "beaches", savings: "AED 200+", bestTime: "Early morning" },
  { id: "jumeirah", name: "Jumeirah Public Beach", desc: "Clean, family-friendly with Burj Al Arab backdrop. Free parking nearby.", category: "beaches", savings: "AED 100+" },
  { id: "mamzar", name: "Al Mamzar Beach Park", desc: "5 beaches in one park. Calm lagoons, perfect for families with children.", category: "beaches", savings: "AED 150+" },
  { id: "umm", name: "Umm Suqeim Beach", desc: "Closest free beach to Burj Al Arab. Sunrise paradise for photographers.", category: "beaches", savings: "AED 200+" },
  
  // Heritage
  { id: "fahidi", name: "Al Fahidi Historical District", desc: "Wind-tower architecture from 1890s. Free walking tours, art galleries, traditional cafes.", category: "heritage", highlight: true },
  { id: "heritage", name: "Heritage Village", desc: "Traditional Emirati village with pottery, weaving demonstrations. Free cultural shows.", category: "heritage" },
  { id: "bastakiya", name: "Bastakiya Quarter", desc: "Restored merchant houses, art galleries, and the famous XVA Art Hotel courtyard.", category: "heritage" },
  { id: "shindagha", name: "Shindagha Heritage District", desc: "Birthplace of Dubai. Museums, spice souks, perfume house demonstrations.", category: "heritage" },
  { id: "grand", name: "Grand Mosque", desc: "Stunning architecture with 45 domes. Free entry outside prayer times.", category: "heritage" },
  { id: "jumeirah-mosque", name: "Jumeirah Mosque", desc: "Most photographed mosque in Dubai. Free guided tours available.", category: "heritage" },
  { id: "gold-souk", name: "Gold & Spice Souks", desc: "10+ tons of gold on display. Traditional souks with free window shopping.", category: "heritage", highlight: true },
  { id: "abra", name: "AED 1 Abra Ride", desc: "World's cheapest boat ride. Cross Dubai Creek on traditional wooden boats.", category: "heritage", savings: "AED 49", highlight: true },
  
  // Parks
  { id: "barsha", name: "Al Barsha Pond Park", desc: "Running track, outdoor gym, lake with paddle boats. Totally free.", category: "parks" },
  { id: "zabeel", name: "Zabeel Park", desc: "47 hectares of greenery. Jogging tracks, cricket pitches, BBQ areas.", category: "parks" },
  { id: "safa", name: "Safa Park", desc: "Tennis courts, lake with ducks, playground. Perfect picnic spot.", category: "parks" },
  { id: "creek", name: "Creek Park", desc: "2.5km along Dubai Creek. Botanical garden, children's play areas.", category: "parks" },
  { id: "mushrif", name: "Mushrif Park", desc: "Wildlife sanctuary, international village, swimming pool. Nature escape.", category: "parks" },
  { id: "qudra", name: "Al Qudra Lakes", desc: "Man-made desert oasis with flamingos and camels. Stargazing paradise.", category: "parks", highlight: true },
  { id: "raskhor", name: "Ras Al Khor Wildlife Sanctuary", desc: "500+ Greater Flamingos in natural habitat. Free binoculars at viewing hides.", category: "parks", highlight: true },
  
  // Shows
  { id: "fountain", name: "Dubai Fountain Show", desc: "140m water jets choreographed to music. Every 30 min, 6pm-11pm.", category: "shows", savings: "AED 149-379", highlight: true },
  { id: "global", name: "Global Village Entrance Area", desc: "Free cultural performances, fireworks on weekends. Outside paid zone.", category: "shows" },
  { id: "mall-fountain", name: "Dubai Mall Dancing Fountain", desc: "Indoor fountain show with lights. Multiple times daily.", category: "shows" },
  { id: "lamer-shows", name: "La Mer Street Performances", desc: "Live music, dancers, street artists on weekends.", category: "shows" },
  { id: "citywalk", name: "City Walk Art Installations", desc: "Interactive digital art, murals, sculptures. Self-guided tour.", category: "shows" },
  
  // Art
  { id: "alserkal", name: "Alserkal Avenue", desc: "Contemporary art galleries, design studios, performance spaces. All free.", category: "art", highlight: true },
  { id: "d3", name: "Dubai Design District (d3)", desc: "Street art, design exhibitions, creative hub. Instagram heaven.", category: "art" },
  { id: "jameel", name: "Jameel Arts Centre", desc: "Free entry contemporary art museum on waterfront.", category: "art" },
  { id: "xva", name: "XVA Gallery", desc: "Free art gallery in historic Al Fahidi. Courtyard cafe included.", category: "art" },
  { id: "etihad", name: "Etihad Museum Gardens", desc: "Historic site where UAE was founded. Gardens always free.", category: "art" },
  
  // Sports
  { id: "canal-jog", name: "Dubai Water Canal Jogging", desc: "12.5km lit path, 5 pedestrian bridges. Water features and fountains.", category: "sports" },
  { id: "volleyball", name: "Kite Beach Volleyball", desc: "Free beach volleyball courts. Just show up and play.", category: "sports" },
  { id: "cycling", name: "Al Qudra Cycling Track", desc: "86km dedicated bike path through desert. Bring water!", category: "sports", highlight: true },
  { id: "jbr-gym", name: "JBR Outdoor Gym", desc: "Free outdoor fitness equipment along the beach.", category: "sports" },
  { id: "palm-run", name: "Palm Jumeirah Boardwalk Running", desc: "11km running paradise with Atlantis views.", category: "sports", highlight: true },
  
  // Skyline
  { id: "marina", name: "Dubai Marina Walk", desc: "7km promenade with 200+ skyscrapers reflecting on water. Best at sunset.", category: "skyline", highlight: true },
  { id: "jlt", name: "JLT Lake Walk", desc: "Hidden gem with less crowds. Multiple lakes, cafes, stunning views.", category: "skyline" },
  { id: "palm", name: "Palm Boardwalk", desc: "11km walking path around Palm Jumeirah. Atlantis views guaranteed.", category: "skyline", savings: "AED 1,295" },
  { id: "downtown", name: "Downtown Boulevard", desc: "Walk among the world's tallest buildings. Burj Khalifa up close.", category: "skyline" },
  { id: "businessbay", name: "Business Bay Promenade", desc: "Water taxi views, modern architecture, quieter alternative to Marina.", category: "skyline" },
  { id: "creekh", name: "Creek Harbour Plaza", desc: "Future Dubai Creek Tower site. Stunning water and skyline views.", category: "skyline" },
];

// FAQ Data
const faqData = [
  { q: "Is Dubai really free to explore?", a: "Yes! While Dubai has luxury experiences, 70+ attractions are completely free including 7 public beaches, world-famous Dubai Fountain shows, heritage districts, parks, and art galleries. You can easily spend a week without paying for a single attraction." },
  { q: "What's the best time to visit Dubai's free attractions?", a: "October to April offers the best weather (20-30 degrees C). For specific attractions: Dubai Fountain shows run 6pm-11pm, beaches are best early morning or sunset, and heritage areas are coolest before 11am." },
  { q: "How do I get around Dubai cheaply?", a: "Dubai Metro costs AED 3-7.50 per trip, buses are AED 3-5, and the iconic abra boats are just AED 1. Get a Nol card for discounted fares. Many areas like JBR and Dubai Marina are very walkable." },
  { q: "Are Dubai beaches really free?", a: "Yes, 7 public beaches are completely free: JBR Beach, Kite Beach, La Mer, Black Palace Beach, Jumeirah Beach, Al Mamzar (AED 5), and Umm Suqeim. All have free parking, showers, and lifeguards." },
  { q: "Can I see the Burj Khalifa for free?", a: "While the At The Top observation deck costs AED 149-379, you can enjoy the Burj Khalifa for free from many angles: Dubai Fountain promenade, Burj Park, Palace Downtown entrance, and Souk Al Bahar bridge all offer stunning views." },
  { q: "What about food on a budget?", a: "Supermarket meals cost AED 15-25, street food in Old Dubai runs AED 5-15, and food courts offer meals under AED 30. Many parks allow picnics." },
];

export default function LandingFreeDubai() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [visitedPlaces, setVisitedPlaces] = useState<Set<string>>(new Set());
  const [email, setEmail] = useState("");
  const [showDownloadSuccess, setShowDownloadSuccess] = useState(false);
  const [tripDays, setTripDays] = useState([7]);
  const [familySize, setFamilySize] = useState([2]);
  
  const beachesRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<HTMLDivElement>(null);
  const checklistRef = useRef<HTMLDivElement>(null);

  useDocumentMeta({
    title: "70+ Free Things to Do in Dubai 2026 - Complete Interactive Guide | Save AED 2,500+ Every Week",
    description: "Dubai on AED 0: 7 free beaches, 500 flamingos, AED 1 abra rides, 11km Palm boardwalk, nightly fountain shows. Interactive guide with savings calculator, checklist, and map.",
    ogType: "article"
  });

  // Filter attractions by category
  const filteredAttractions = useMemo(() => {
    if (activeCategory === "all") return allAttractions;
    return allAttractions.filter(a => a.category === activeCategory);
  }, [activeCategory]);

  // Calculate savings
  const calculatedSavings = useMemo(() => {
    const dailyBeachSaving = 200;
    const dailyAttractionSaving = 150;
    const dailyFountainSaving = 50;
    const dailySaving = dailyBeachSaving + dailyAttractionSaving + dailyFountainSaving;
    const total = dailySaving * tripDays[0] * familySize[0];
    return total;
  }, [tripDays, familySize]);

  // Progress calculation
  const visitedCount = visitedPlaces.size;
  const totalCount = allAttractions.length;
  const progressPercent = Math.round((visitedCount / totalCount) * 100);

  const toggleVisited = (id: string) => {
    const newSet = new Set(visitedPlaces);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setVisitedPlaces(newSet);
  };

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setShowDownloadSuccess(true);
      setTimeout(() => setShowDownloadSuccess(false), 5000);
    }
  };

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const getCategoryIcon = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat?.icon || Sparkles;
  };

  const getCategoryColor = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    return cat?.color || "from-purple-500 to-pink-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[10%] w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
          <div className="absolute top-40 right-[15%] w-[500px] h-[500px] bg-blue-400/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/" className="hover:text-cyan-600 transition-colors" data-testid="link-home">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 dark:text-white font-medium">Free Things to Do</span>
          </div>

          <div className="text-center max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-0 px-6 py-2.5 text-base mb-8">
                <Trophy className="w-5 h-5 mr-2" />
                2026 Complete Interactive Guide
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6"
            >
              Dubai Costs{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500">
                AED 0
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto"
            >
              The complete interactive guide to <strong className="text-emerald-600">70+ free attractions</strong>. 
              Track your visits, calculate savings, and download your personalized checklist.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10"
            >
              {heroStats.map((stat, index) => (
                <div key={index} className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-4 rounded-xl shadow-lg border border-white/50 dark:border-slate-700/50">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow mx-auto mb-2">
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Quick Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-3"
            >
              <Button onClick={() => scrollToSection(calculatorRef)} className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full px-6" data-testid="button-calculator">
                <Calculator className="w-4 h-4 mr-2" /> Savings Calculator
              </Button>
              <Button onClick={() => scrollToSection(checklistRef)} variant="outline" className="rounded-full px-6" data-testid="button-checklist">
                <ListChecks className="w-4 h-4 mr-2" /> Get Checklist
              </Button>
              <Button onClick={() => scrollToSection(beachesRef)} variant="outline" className="rounded-full px-6" data-testid="button-explore">
                <Waves className="w-4 h-4 mr-2" /> Explore Free
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SAVINGS CALCULATOR ===== */}
      <section ref={calculatorRef} className="py-16 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg mx-auto mb-4">
                    <Calculator className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                    How Much Will You Save?
                  </h2>
                  <p className="text-slate-600">Calculate your savings with free Dubai attractions</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Trip Duration: <span className="text-emerald-600 font-bold">{tripDays[0]} days</span>
                    </label>
                    <Slider
                      value={tripDays}
                      onValueChange={setTripDays}
                      min={1}
                      max={30}
                      step={1}
                      className="w-full"
                      data-testid="slider-days"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                      Family Size: <span className="text-emerald-600 font-bold">{familySize[0]} people</span>
                    </label>
                    <Slider
                      value={familySize}
                      onValueChange={setFamilySize}
                      min={1}
                      max={10}
                      step={1}
                      className="w-full"
                      data-testid="slider-family"
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 rounded-2xl p-6 text-center" role="status" aria-live="polite">
                  <p className="text-sm text-slate-600 mb-2">Your Estimated Savings</p>
                  <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600 mb-2" data-testid="text-savings-total">
                    AED {calculatedSavings.toLocaleString()}
                  </div>
                  <p className="text-slate-500 text-sm">
                    Based on {tripDays[0]} days x {familySize[0]} people vs paid attractions
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6 text-center text-sm">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                    <Waves className="w-5 h-5 text-cyan-500 mx-auto mb-1" />
                    <div className="font-bold text-slate-900 dark:text-white">AED {200 * tripDays[0] * familySize[0]}</div>
                    <div className="text-slate-500 text-xs">Beach Savings</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                    <Sparkles className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                    <div className="font-bold text-slate-900 dark:text-white">AED {150 * tripDays[0] * familySize[0]}</div>
                    <div className="text-slate-500 text-xs">Attraction Savings</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                    <Music className="w-5 h-5 text-pink-500 mx-auto mb-1" />
                    <div className="font-bold text-slate-900 dark:text-white">AED {50 * tripDays[0] * familySize[0]}</div>
                    <div className="text-slate-500 text-xs">Show Savings</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ===== DOWNLOAD CHECKLIST CTA ===== */}
      <section ref={checklistRef} className="py-16 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg mb-4">
                      <Download className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                      Free Dubai Checklist
                    </h2>
                    <p className="text-slate-600 mb-4">
                      Get our printable PDF guide with all 70+ free attractions, metro routes, 
                      best times to visit, and insider tips.
                    </p>
                    <div className="space-y-2 mb-6">
                      {["All 70+ locations mapped", "Metro access for each spot", "Best times & insider tips", "Printable checklist format"].map((item) => (
                        <div key={item} className="flex items-center gap-2 text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <AnimatePresence mode="wait">
                      {showDownloadSuccess ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center"
                        >
                          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                            <Check className="w-8 h-8 text-emerald-600" />
                          </div>
                          <h3 className="text-lg font-bold text-emerald-800 mb-2">Check Your Email!</h3>
                          <p className="text-emerald-700 text-sm">
                            Your free Dubai checklist is on its way to {email}
                          </p>
                        </motion.div>
                      ) : (
                        <motion.form
                          key="form"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onSubmit={handleDownload}
                          className="space-y-4"
                        >
                          <div>
                            <label htmlFor="email-download" className="block text-sm font-medium text-slate-700 mb-2">
                              Your Email Address
                            </label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <Input
                                id="email-download"
                                type="email"
                                placeholder="you@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10"
                                required
                                data-testid="input-email-download"
                              />
                            </div>
                          </div>
                          <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6" data-testid="button-download">
                            <Download className="w-5 h-5 mr-2" />
                            Download Free Checklist
                          </Button>
                          <p className="text-xs text-slate-500 text-center">
                            We respect your privacy. Unsubscribe anytime.
                          </p>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ===== PROGRESS TRACKER ===== */}
      <section className="py-8 bg-white dark:bg-slate-900 sticky top-16 z-40 border-b border-slate-200 dark:border-slate-700" role="status" aria-live="polite" aria-label="Visit progress tracker">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-emerald-600" aria-hidden="true" />
                <span className="font-medium text-slate-900 dark:text-white">Your Progress:</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100} aria-label={`${visitedCount} of ${totalCount} attractions visited`}>
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="text-sm font-bold text-emerald-600" data-testid="text-progress-count">{visitedCount}/{totalCount}</span>
              </div>
            </div>
            
            {visitedCount > 0 && (
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200" data-testid="badge-progress-status">
                <Trophy className="w-3 h-3 mr-1" aria-hidden="true" />
                {progressPercent >= 100 ? "Dubai Master!" : progressPercent >= 50 ? "Explorer!" : "Getting Started"}
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* ===== CATEGORY FILTER ===== */}
      <section ref={beachesRef} className="py-8 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-slate-600" />
            <span className="font-medium text-slate-900 dark:text-white">Filter by Category:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full ${activeCategory === cat.id ? `bg-gradient-to-r ${cat.color} text-white border-0` : ""}`}
                data-testid={`filter-${cat.id}`}
              >
                <cat.icon className="w-4 h-4 mr-1" />
                {cat.label}
                {activeCategory === cat.id && (
                  <Badge className="ml-2 bg-white/20 text-white border-0 text-xs">
                    {cat.id === "all" ? allAttractions.length : allAttractions.filter(a => a.category === cat.id).length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ATTRACTIONS GRID ===== */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filteredAttractions.map((attraction, index) => {
                const CategoryIcon = getCategoryIcon(attraction.category);
                const isVisited = visitedPlaces.has(attraction.id);
                
                return (
                  <motion.div
                    key={attraction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card 
                      className={`h-full transition-all duration-300 ${
                        isVisited 
                          ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700" 
                          : "hover:shadow-lg"
                      } ${attraction.highlight ? "ring-2 ring-amber-400 ring-offset-2" : ""}`}
                      data-testid={`card-attraction-${attraction.id}`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getCategoryColor(attraction.category)} flex items-center justify-center shrink-0`}>
                              <CategoryIcon className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-tight">
                              {attraction.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            {attraction.highlight && (
                              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            )}
                            <Checkbox
                              checked={isVisited}
                              onCheckedChange={() => toggleVisited(attraction.id)}
                              className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                              data-testid={`checkbox-${attraction.id}`}
                            />
                          </div>
                        </div>
                        
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                          {attraction.desc}
                        </p>
                        
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                            FREE
                          </Badge>
                          {attraction.savings && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              Save {attraction.savings}
                            </Badge>
                          )}
                          {attraction.metro && (
                            <Badge variant="outline" className="text-xs">
                              <Train className="w-3 h-3 mr-1" />
                              {attraction.metro}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ===== MID-PAGE CTA: Real Estate ===== */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <Badge className="bg-amber-500/20 text-amber-400 border-0 mb-4">
                <Home className="w-4 h-4 mr-2" />
                Thinking of Moving?
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Make Dubai <span className="text-amber-400">Home</span>?
              </h2>
              <p className="text-slate-300 mb-6">
                Love what you're seeing? Get a free 30-minute consultation with our real estate 
                experts. Discover the best areas for your budget and lifestyle.
              </p>
              <div className="space-y-3 mb-6">
                {[
                  "Best neighborhoods for your lifestyle",
                  "Rental vs buying analysis",
                  "Visa options through property",
                  "Hidden fees to avoid"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-amber-500 hover:bg-amber-600 text-white" data-testid="button-consultation">
                  <Phone className="w-4 h-4 mr-2" />
                  Free Consultation
                </Button>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" data-testid="button-schedule">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Call
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600" 
                alt="Dubai skyline residential" 
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-xl">
                <div className="text-2xl font-bold text-slate-900">500+</div>
                <div className="text-xs text-slate-500">Happy Expats</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HIGHLIGHT EXPERIENCES ===== */}
      <section className="py-16 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center text-white mb-12">
            <Badge className="bg-white/20 text-white border-0 mb-4 px-4 py-2">
              <Star className="w-5 h-5 mr-2 fill-white" />
              Must-See Highlights
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Don't Miss These
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              The absolute best free experiences in Dubai selected by our team.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allAttractions.filter(a => a.highlight).slice(0, 6).map((attraction, index) => {
              const CategoryIcon = getCategoryIcon(attraction.category);
              return (
                <motion.div
                  key={attraction.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full bg-white/20 backdrop-blur-xl border-0 text-white overflow-hidden group">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center`}>
                          <CategoryIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{attraction.name}</h3>
                          <Badge className="bg-white/20 text-white border-0 text-xs capitalize">
                            {attraction.category}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-white/80 text-sm mb-4">{attraction.desc}</p>
                      {attraction.savings && (
                        <div className="flex items-center gap-2 text-emerald-300 font-medium">
                          <Wallet className="w-4 h-4" />
                          Save {attraction.savings}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FAQ SECTION ===== */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-4">
              <PartyPopper className="w-4 h-4 mr-2" />
              Common Questions
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqData.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`faq-${index}`}
                className="bg-slate-50 dark:bg-slate-800 rounded-xl border-0 px-6"
              >
                <AccordionTrigger className="text-left font-medium text-slate-900 dark:text-white hover:no-underline py-5" data-testid={`faq-${index}`}>
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-slate-400 pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ===== NEWSLETTER CTA ===== */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-white">
          <Gift className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get Weekly Dubai Deals
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
            Join 10,000+ Dubai explorers. Get exclusive tips, new free attractions, 
            and special offers delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="your@email.com"
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60 rounded-full px-6"
              data-testid="input-newsletter"
            />
            <Button className="bg-white text-purple-600 hover:bg-white/90 rounded-full px-8 shrink-0" data-testid="button-subscribe">
              Subscribe Free
            </Button>
          </form>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />
            </div>
            
            <CardContent className="relative p-8 sm:p-12 text-center">
              <Globe className="w-16 h-16 text-emerald-400 mx-auto mb-5" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                You've Discovered Dubai's Best Kept Secrets
              </h2>
              <p className="text-base text-slate-300 max-w-lg mx-auto mb-6">
                {visitedCount > 0 
                  ? `You've explored ${visitedCount} places so far! Keep going to complete your Dubai adventure.`
                  : "70+ free experiences, 7 beaches, unlimited memories. Start your adventure today."
                }
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/districts" data-testid="link-districts">
                  <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-6 rounded-full" data-testid="button-explore-districts">
                    <Compass className="w-5 h-5 mr-2" />
                    Explore Districts
                  </Button>
                </Link>
                <Link href="/dubai/laws-for-tourists" data-testid="link-laws">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 rounded-full" data-testid="button-laws">
                    <MapPin className="w-5 h-5 mr-2" />
                    Know the Laws
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
