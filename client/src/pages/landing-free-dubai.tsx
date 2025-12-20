import { useRef, useState, useMemo } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Waves, MapPin, Camera, Sparkles, Sun, 
  ChevronRight, Star, ArrowRight,
  TreePalm, Building2, Music, Heart,
  Wallet, Trophy, CheckCircle2, Bike,
  Train, Palette,
  Footprints, Eye, Compass, Globe,
  Filter, Calculator,
  PartyPopper, Play, Clock, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

// Featured experiences with images
const featuredExperiences = [
  { 
    id: "fountain",
    name: "Dubai Fountain Show", 
    desc: "World's largest choreographed fountain system. 140m jets, 6,600 lights, 25 projectors.",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800",
    time: "Every 30 min, 6pm-11pm",
    savings: "AED 379"
  },
  { 
    id: "marina",
    name: "Dubai Marina Walk", 
    desc: "7km promenade with 200+ skyscrapers reflecting on water. World's largest man-made marina.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
    time: "24/7 Access",
    savings: "AED 0"
  },
  { 
    id: "kite",
    name: "Kite Beach", 
    desc: "Blue Flag beach with Burj Al Arab views. Volleyball, running track, water sports watching.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    time: "Sunrise to Sunset",
    savings: "AED 200+"
  },
];

// Categories with images
const categoryShowcase = [
  { 
    id: "beaches", 
    title: "7 Free Beaches", 
    subtitle: "Crystal waters, golden sands",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
    color: "from-cyan-500 to-blue-600",
    count: 7 
  },
  { 
    id: "heritage", 
    title: "Old Dubai", 
    subtitle: "Wind towers & gold souks",
    image: "https://images.unsplash.com/photo-1548230626-fbceb8b71a88?w=600",
    color: "from-amber-500 to-orange-600",
    count: 8 
  },
  { 
    id: "shows", 
    title: "Free Shows", 
    subtitle: "Fountains & performances",
    image: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600",
    color: "from-pink-500 to-rose-600",
    count: 5 
  },
  { 
    id: "parks", 
    title: "Parks & Nature", 
    subtitle: "Flamingos & desert oasis",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600",
    color: "from-emerald-500 to-green-600",
    count: 7 
  },
  { 
    id: "art", 
    title: "Art Galleries", 
    subtitle: "Contemporary & street art",
    image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600",
    color: "from-purple-500 to-violet-600",
    count: 5 
  },
  { 
    id: "skyline", 
    title: "Skyline Walks", 
    subtitle: "Among the world's tallest",
    image: "https://images.unsplash.com/photo-1546412414-e1885259563a?w=600",
    color: "from-slate-600 to-slate-800",
    count: 6 
  },
];

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

// All attractions with category
interface Attraction {
  id: string;
  name: string;
  desc: string;
  category: string;
  savings?: string;
  metro?: string;
  image?: string;
  highlight?: boolean;
}

const allAttractions: Attraction[] = [
  // Beaches
  { id: "jbr", name: "JBR Beach", desc: "Blue Flag certified with free showers, changing rooms, and 24/7 lifeguards.", category: "beaches", savings: "AED 150-500", metro: "JBR Tram", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400", highlight: true },
  { id: "kite", name: "Kite Beach", desc: "14km running track, beach volleyball courts, Burj Al Arab views.", category: "beaches", savings: "AED 200+", metro: "Mall of Emirates", image: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=400", highlight: true },
  { id: "lamer", name: "La Mer Beach", desc: "Trendy beachfront with street art, splash pads for kids.", category: "beaches", savings: "AED 150+", metro: "Healthcare City" },
  { id: "black", name: "Black Palace Beach", desc: "Secret hidden gem away from crowds. Crystal clear water.", category: "beaches", savings: "AED 200+" },
  { id: "jumeirah", name: "Jumeirah Public Beach", desc: "Clean, family-friendly with Burj Al Arab backdrop.", category: "beaches", savings: "AED 100+" },
  { id: "mamzar", name: "Al Mamzar Beach Park", desc: "5 beaches in one park. Calm lagoons, perfect for families.", category: "beaches", savings: "AED 150+" },
  { id: "umm", name: "Umm Suqeim Beach", desc: "Closest free beach to Burj Al Arab. Sunrise paradise.", category: "beaches", savings: "AED 200+" },
  
  // Heritage
  { id: "fahidi", name: "Al Fahidi Historical", desc: "Wind-tower architecture from 1890s. Free walking tours.", category: "heritage", image: "https://images.unsplash.com/photo-1548230626-fbceb8b71a88?w=400", highlight: true },
  { id: "heritage", name: "Heritage Village", desc: "Traditional Emirati village with pottery demonstrations.", category: "heritage" },
  { id: "bastakiya", name: "Bastakiya Quarter", desc: "Restored merchant houses and art galleries.", category: "heritage" },
  { id: "shindagha", name: "Shindagha District", desc: "Birthplace of Dubai. Spice souks and perfume houses.", category: "heritage" },
  { id: "grand", name: "Grand Mosque", desc: "Stunning architecture with 45 domes.", category: "heritage" },
  { id: "jumeirah-mosque", name: "Jumeirah Mosque", desc: "Most photographed mosque in Dubai.", category: "heritage" },
  { id: "gold-souk", name: "Gold & Spice Souks", desc: "10+ tons of gold on display. Free window shopping.", category: "heritage", image: "https://images.unsplash.com/photo-1569288063643-5d29ad64df09?w=400", highlight: true },
  { id: "abra", name: "AED 1 Abra Ride", desc: "World's cheapest boat ride across Dubai Creek.", category: "heritage", savings: "AED 49", highlight: true },
  
  // Parks
  { id: "barsha", name: "Al Barsha Pond Park", desc: "Running track, outdoor gym, lake with paddle boats.", category: "parks" },
  { id: "zabeel", name: "Zabeel Park", desc: "47 hectares of greenery. Jogging tracks, BBQ areas.", category: "parks" },
  { id: "safa", name: "Safa Park", desc: "Tennis courts, lake with ducks, playground.", category: "parks" },
  { id: "creek", name: "Creek Park", desc: "2.5km along Dubai Creek. Botanical garden.", category: "parks" },
  { id: "mushrif", name: "Mushrif Park", desc: "Wildlife sanctuary, international village.", category: "parks" },
  { id: "qudra", name: "Al Qudra Lakes", desc: "Desert oasis with flamingos and camels. Stargazing paradise.", category: "parks", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", highlight: true },
  { id: "raskhor", name: "Ras Al Khor Sanctuary", desc: "500+ Greater Flamingos in natural habitat.", category: "parks", highlight: true },
  
  // Shows
  { id: "fountain", name: "Dubai Fountain Show", desc: "140m water jets choreographed to music. Every 30 min.", category: "shows", savings: "AED 149-379", image: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=400", highlight: true },
  { id: "global", name: "Global Village Shows", desc: "Free cultural performances, fireworks on weekends.", category: "shows" },
  { id: "mall-fountain", name: "Mall Dancing Fountain", desc: "Indoor fountain show with lights.", category: "shows" },
  { id: "lamer-shows", name: "La Mer Performances", desc: "Live music, dancers, street artists on weekends.", category: "shows" },
  { id: "citywalk", name: "City Walk Art", desc: "Interactive digital art, murals, sculptures.", category: "shows" },
  
  // Art
  { id: "alserkal", name: "Alserkal Avenue", desc: "Contemporary art galleries, design studios.", category: "art", image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400", highlight: true },
  { id: "d3", name: "Dubai Design District", desc: "Street art, design exhibitions, creative hub.", category: "art" },
  { id: "jameel", name: "Jameel Arts Centre", desc: "Free entry contemporary art museum.", category: "art" },
  { id: "xva", name: "XVA Gallery", desc: "Free art gallery in historic Al Fahidi.", category: "art" },
  { id: "etihad", name: "Etihad Museum Gardens", desc: "Historic site where UAE was founded.", category: "art" },
  
  // Sports
  { id: "canal-jog", name: "Dubai Water Canal", desc: "12.5km lit path, 5 pedestrian bridges.", category: "sports" },
  { id: "volleyball", name: "Beach Volleyball", desc: "Free courts at Kite Beach. Just show up.", category: "sports" },
  { id: "cycling", name: "Al Qudra Cycling", desc: "86km dedicated bike path through desert.", category: "sports", highlight: true },
  { id: "jbr-gym", name: "JBR Outdoor Gym", desc: "Free outdoor fitness equipment.", category: "sports" },
  { id: "palm-run", name: "Palm Boardwalk", desc: "11km running paradise with Atlantis views.", category: "sports", highlight: true },
  
  // Skyline
  { id: "marina", name: "Dubai Marina Walk", desc: "7km promenade with 200+ skyscrapers.", category: "skyline", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400", highlight: true },
  { id: "jlt", name: "JLT Lake Walk", desc: "Hidden gem with less crowds. Multiple lakes.", category: "skyline" },
  { id: "palm", name: "Palm Boardwalk", desc: "11km walking path. Atlantis views guaranteed.", category: "skyline", savings: "AED 1,295" },
  { id: "downtown", name: "Downtown Boulevard", desc: "Walk among world's tallest buildings.", category: "skyline" },
  { id: "businessbay", name: "Business Bay", desc: "Water taxi views, modern architecture.", category: "skyline" },
  { id: "creekh", name: "Creek Harbour Plaza", desc: "Future Dubai Creek Tower site. Stunning views.", category: "skyline" },
];

// FAQ Data
const faqData = [
  { q: "Is Dubai really free to explore?", a: "Yes! While Dubai has luxury experiences, 70+ attractions are completely free including 7 public beaches, world-famous Dubai Fountain shows, heritage districts, parks, and art galleries. You can easily spend a week without paying for a single attraction." },
  { q: "What's the best time to visit?", a: "October to April offers the best weather (20-30 degrees C). Dubai Fountain shows run 6pm-11pm, beaches are best early morning or sunset, and heritage areas are coolest before 11am." },
  { q: "How do I get around cheaply?", a: "Dubai Metro costs AED 3-7.50 per trip, buses are AED 3-5, and abra boats are just AED 1. Get a Nol card for discounted fares. Many areas like JBR and Dubai Marina are very walkable." },
  { q: "Can I see Burj Khalifa for free?", a: "While At The Top costs AED 149-379, enjoy the Burj Khalifa for free from Dubai Fountain promenade, Burj Park, Palace Downtown entrance, and Souk Al Bahar bridge." },
];

export default function LandingFreeDubai() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [visitedPlaces, setVisitedPlaces] = useState<Set<string>>(new Set());
  const [tripDays, setTripDays] = useState([7]);
  const [familySize, setFamilySize] = useState([2]);
  
  const exploreRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<HTMLDivElement>(null);

  useDocumentMeta({
    title: "70+ Free Things to Do in Dubai 2026 - Complete Guide | Save AED 2,500+",
    description: "Dubai on AED 0: 7 free beaches, 500 flamingos, AED 1 abra rides, 11km Palm boardwalk, nightly fountain shows. The ultimate free Dubai guide.",
    ogType: "article"
  });

  // Filter attractions by category
  const filteredAttractions = useMemo(() => {
    if (activeCategory === "all") return allAttractions;
    return allAttractions.filter(a => a.category === activeCategory);
  }, [activeCategory]);

  // Calculate savings
  const calculatedSavings = useMemo(() => {
    const dailySaving = 400;
    return dailySaving * tripDays[0] * familySize[0];
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
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* ===== HERO WITH VIDEO-STYLE BG ===== */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920" 
            alt="Dubai skyline at night"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 px-6 py-3 text-lg mb-8">
              <Sparkles className="w-5 h-5 mr-2" />
              2026 Ultimate Guide
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6"
          >
            Dubai for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400">
              AED 0
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto"
          >
            70+ free attractions, 7 beaches, world-famous shows.
            <br className="hidden sm:block" />
            Everything you need for an unforgettable Dubai adventure.
          </motion.p>

          {/* Hero Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12"
          >
            {[
              { icon: Sparkles, value: "70+", label: "Free Things" },
              { icon: Waves, value: "7", label: "Beaches" },
              { icon: Wallet, value: "AED 2,500+", label: "Weekly Savings" },
              { icon: Camera, value: "50+", label: "Photo Spots" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10"
              >
                <stat.icon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button 
              size="lg"
              onClick={() => scrollToSection(exploreRef)} 
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white text-lg px-8 py-6 rounded-full shadow-lg shadow-cyan-500/30"
              data-testid="button-explore"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Exploring
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => scrollToSection(calculatorRef)}
              className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 rounded-full backdrop-blur-md"
              data-testid="button-calculator"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Calculate Savings
            </Button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
            >
              <div className="w-1.5 h-3 bg-white/50 rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURED EXPERIENCES ===== */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-4">
              <Star className="w-4 h-4 mr-2 fill-amber-400" />
              Must-See Experiences
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Don't Miss These
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              The absolute best free experiences in Dubai, handpicked by locals
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {featuredExperiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative h-80 rounded-3xl overflow-hidden mb-4">
                  <img 
                    src={exp.image} 
                    alt={exp.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-emerald-500 text-white border-0">FREE</Badge>
                      {exp.savings !== "AED 0" && (
                        <Badge className="bg-white/20 text-white border-0">
                          <Wallet className="w-3 h-3 mr-1" />
                          Save {exp.savings}
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{exp.name}</h3>
                    <p className="text-white/70 text-sm mb-3">{exp.desc}</p>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <Clock className="w-4 h-4" />
                      {exp.time}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORY SHOWCASE ===== */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="bg-purple-100 text-purple-700 border-purple-200 mb-4">
              <Compass className="w-4 h-4 mr-2" />
              Explore by Category
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Choose Your Adventure
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryShowcase.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setActiveCategory(cat.id);
                  scrollToSection(exploreRef);
                }}
                className="group cursor-pointer"
              >
                <div className="relative h-64 rounded-2xl overflow-hidden">
                  <img 
                    src={cat.image} 
                    alt={cat.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} opacity-70`} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                    <div className="text-5xl font-bold mb-2">{cat.count}</div>
                    <h3 className="text-2xl font-bold mb-1">{cat.title}</h3>
                    <p className="text-white/80">{cat.subtitle}</p>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                      <ArrowRight className="w-5 h-5 text-slate-900" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SAVINGS CALCULATOR ===== */}
      <section ref={calculatorRef} className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1546412414-e1885259563a?w=1920" 
            alt="Dubai at sunset"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/95 via-teal-900/90 to-cyan-900/95" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <Badge className="bg-white/10 text-white border-white/20 mb-4">
                <Calculator className="w-4 h-4 mr-2" />
                Savings Calculator
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                How Much Will You Save?
              </h2>
              <p className="text-xl text-white/70">
                Calculate your savings using free Dubai attractions
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="block text-white font-medium mb-4">
                    Trip Duration: <span className="text-cyan-400 font-bold">{tripDays[0]} days</span>
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
                  <label className="block text-white font-medium mb-4">
                    Family Size: <span className="text-cyan-400 font-bold">{familySize[0]} people</span>
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

              <div className="text-center py-8 bg-white/5 rounded-2xl" role="status" aria-live="polite">
                <p className="text-white/70 mb-2">Your Estimated Savings</p>
                <div className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400" data-testid="text-savings-total">
                  AED {calculatedSavings.toLocaleString()}
                </div>
                <p className="text-white/50 mt-2 text-sm">
                  vs. paid attractions and beach clubs
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== PROGRESS TRACKER (Sticky) ===== */}
      {visitedCount > 0 && (
        <section className="py-4 bg-white dark:bg-slate-900 sticky top-16 z-40 border-b border-slate-200 dark:border-slate-700 shadow-sm" role="status" aria-live="polite">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span className="font-medium text-slate-900 dark:text-white">Your Progress:</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-amber-600" data-testid="text-progress-count">{visitedCount}/{totalCount}</span>
                </div>
              </div>
              <Badge className="bg-amber-100 text-amber-700 border-amber-200" data-testid="badge-progress-status">
                {progressPercent >= 100 ? "Dubai Master!" : progressPercent >= 50 ? "Explorer!" : "Getting Started"}
              </Badge>
            </div>
          </div>
        </section>
      )}

      {/* ===== FILTER & ATTRACTIONS GRID ===== */}
      <section ref={exploreRef} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-slate-600" />
              <span className="font-medium text-slate-900 dark:text-white">Filter:</span>
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
                </Button>
              ))}
            </div>
          </div>

          {/* Attractions Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
                    transition={{ delay: index * 0.02 }}
                  >
                    <Card 
                      className={`h-full overflow-hidden transition-all duration-300 ${
                        isVisited 
                          ? "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" 
                          : "hover:shadow-lg"
                      } ${attraction.highlight ? "ring-2 ring-amber-400" : ""}`}
                      data-testid={`card-attraction-${attraction.id}`}
                    >
                      {attraction.image && (
                        <div className="relative h-32 overflow-hidden">
                          <img 
                            src={attraction.image} 
                            alt={attraction.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <Badge className="absolute bottom-2 left-2 bg-emerald-500 text-white border-0 text-xs">
                            FREE
                          </Badge>
                        </div>
                      )}
                      <CardContent className={attraction.image ? "p-4" : "p-4"}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {!attraction.image && (
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getCategoryColor(attraction.category)} flex items-center justify-center shrink-0`}>
                                <CategoryIcon className="w-4 h-4 text-white" />
                              </div>
                            )}
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                              {attraction.name}
                            </h3>
                          </div>
                          <Checkbox
                            checked={isVisited}
                            onCheckedChange={() => toggleVisited(attraction.id)}
                            className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                            data-testid={`checkbox-${attraction.id}`}
                          />
                        </div>
                        
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                          {attraction.desc}
                        </p>
                        
                        <div className="flex flex-wrap gap-1">
                          {!attraction.image && (
                            <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                              FREE
                            </Badge>
                          )}
                          {attraction.savings && (
                            <Badge variant="outline" className="text-xs">
                              <Wallet className="w-3 h-3 mr-1" />
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

      {/* ===== FAQ ===== */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-4">
              <PartyPopper className="w-4 h-4 mr-2" />
              FAQ
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Common Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqData.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`faq-${index}`}
                className="bg-white dark:bg-slate-700 rounded-xl border-0 px-6 shadow-sm"
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

      {/* ===== FINAL CTA ===== */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1920" 
            alt="Dubai fountain at night"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-slate-900/95" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Globe className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Explore Dubai?
            </h2>
            <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              {visitedCount > 0 
                ? `You've discovered ${visitedCount} places! Keep exploring to unlock all of Dubai's secrets.`
                : "70+ free experiences await. Start your Dubai adventure today."
              }
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/districts" data-testid="link-districts">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-6 rounded-full text-lg" data-testid="button-explore-districts">
                  <Compass className="w-5 h-5 mr-2" />
                  Explore Districts
                </Button>
              </Link>
              <Link href="/dubai/laws-for-tourists" data-testid="link-laws">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 rounded-full text-lg" data-testid="button-laws">
                  <Zap className="w-5 h-5 mr-2" />
                  Know Before You Go
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
