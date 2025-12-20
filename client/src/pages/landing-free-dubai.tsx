import { useRef } from "react";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Waves, MapPin, Camera, Sparkles, Sun, Bird, Clock, 
  ChevronRight, Star, Download, ArrowRight, 
  TreePalm, Building2, Music, Heart,
  Users, Wallet, Trophy, CheckCircle2, Bike,
  Ship, Train, Mountain, Palette, ShoppingBag,
  Sunset, Footprints, Eye, Compass, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";

// Hero stats
const heroStats = [
  { icon: Wallet, value: "AED 2,500+", label: "Save Per Week" },
  { icon: Waves, value: "7", label: "Free Beaches" },
  { icon: Sparkles, value: "70+", label: "Free Activities" },
  { icon: Camera, value: "50+", label: "Photo Spots" },
];

// All Free Beaches
const freeBeaches = [
  { name: "JBR Beach", desc: "Blue Flag certified with free showers, changing rooms, and 24/7 lifeguards. Best sunset views.", savings: "AED 150-500" },
  { name: "Kite Beach", desc: "14km running track, beach volleyball courts, Burj Al Arab views. Perfect for active visitors.", savings: "AED 200+" },
  { name: "La Mer Beach", desc: "Trendy beachfront with street art, splash pads for kids, and Instagram-worthy spots.", savings: "AED 150+" },
  { name: "Black Palace Beach", desc: "Secret hidden gem away from crowds. Crystal clear water, local favorite.", savings: "AED 200+" },
  { name: "Jumeirah Public Beach", desc: "Clean, family-friendly with Burj Al Arab backdrop. Free parking nearby.", savings: "AED 100+" },
  { name: "Al Mamzar Beach Park", desc: "5 beaches in one park. Calm lagoons, perfect for families with children.", savings: "AED 150+" },
  { name: "Umm Suqeim Beach", desc: "Closest free beach to Burj Al Arab. Sunrise paradise for photographers.", savings: "AED 200+" },
];

// Heritage & Culture Sites
const heritageSites = [
  { name: "Al Fahidi Historical District", desc: "Wind-tower architecture from 1890s. Free walking tours, art galleries, traditional cafes." },
  { name: "Heritage Village", desc: "Traditional Emirati village with pottery, weaving demonstrations. Free cultural shows." },
  { name: "Bastakiya Quarter", desc: "Restored merchant houses, art galleries, and the famous XVA Art Hotel courtyard." },
  { name: "Shindagha Heritage District", desc: "Birthplace of Dubai. Museums, spice souks, perfume house demonstrations." },
  { name: "Grand Mosque", desc: "Stunning architecture with 45 domes. Free entry outside prayer times." },
  { name: "Jumeirah Mosque", desc: "Most photographed mosque in Dubai. Free guided tours available." },
];

// Free Skyline Experiences
const skylineSpots = [
  { name: "Dubai Marina Walk", desc: "7km promenade with 200+ skyscrapers reflecting on water. Best at sunset." },
  { name: "JLT Lake Walk", desc: "Hidden gem with less crowds. Multiple lakes, cafes, stunning views." },
  { name: "Palm Boardwalk", desc: "11km walking path around Palm Jumeirah. Atlantis views guaranteed." },
  { name: "Downtown Boulevard", desc: "Walk among the world's tallest buildings. Burj Khalifa up close." },
  { name: "Business Bay Promenade", desc: "Water taxi views, modern architecture, quieter alternative to Marina." },
  { name: "Creek Harbour Plaza", desc: "Future Dubai Creek Tower site. Stunning water and skyline views." },
];

// Parks & Gardens
const parksGardens = [
  { name: "Al Barsha Pond Park", desc: "Running track, outdoor gym, lake with paddle boats. Totally free." },
  { name: "Zabeel Park", desc: "47 hectares of greenery. Jogging tracks, cricket pitches, BBQ areas." },
  { name: "Safa Park", desc: "Tennis courts, lake with ducks, playground. Perfect picnic spot." },
  { name: "Creek Park", desc: "2.5km along Dubai Creek. Botanical garden, children's play areas." },
  { name: "Mushrif Park", desc: "Wildlife sanctuary, international village, swimming pool. Nature escape." },
  { name: "Al Qudra Lakes", desc: "Man-made desert oasis with flamingos and camels. Stargazing paradise." },
];

// Free Shows & Entertainment
const freeShows = [
  { name: "Dubai Fountain Show", desc: "140m water jets choreographed to music. Every 30 min, 6pm-11pm." },
  { name: "Global Village Entrance Area", desc: "Free cultural performances, fireworks on weekends. Outside paid zone." },
  { name: "Dubai Mall Dancing Fountain", desc: "Indoor fountain show with lights. Multiple times daily." },
  { name: "La Mer Street Performances", desc: "Live music, dancers, street artists on weekends." },
  { name: "City Walk Art Installations", desc: "Interactive digital art, murals, sculptures. Self-guided tour." },
];

// Art & Culture
const artSpots = [
  { name: "Alserkal Avenue", desc: "Contemporary art galleries, design studios, performance spaces. All free." },
  { name: "Dubai Design District (d3)", desc: "Street art, design exhibitions, creative hub. Instagram heaven." },
  { name: "Jameel Arts Centre", desc: "Free entry contemporary art museum on waterfront." },
  { name: "XVA Gallery", desc: "Free art gallery in historic Al Fahidi. Courtyard cafe included." },
  { name: "Etihad Museum Gardens", desc: "Historic site where UAE was founded. Gardens always free." },
];

// Sports & Activities
const sportsActivities = [
  { name: "Dubai Water Canal Jogging", desc: "12.5km lit path, 5 pedestrian bridges. Water features and fountains." },
  { name: "Kite Beach Volleyball", desc: "Free beach volleyball courts. Just show up and play." },
  { name: "Al Qudra Cycling Track", desc: "86km dedicated bike path through desert. Bring water!" },
  { name: "JBR Outdoor Gym", desc: "Free outdoor fitness equipment along the beach." },
  { name: "Palm Jumeirah Boardwalk Running", desc: "11km running paradise with Atlantis views." },
];

export default function LandingFreeDubai() {
  const { isRTL } = useLocale();
  const beachesRef = useRef<HTMLDivElement>(null);
  const heritageRef = useRef<HTMLDivElement>(null);
  const skylineRef = useRef<HTMLDivElement>(null);
  const parksRef = useRef<HTMLDivElement>(null);

  useDocumentMeta({
    title: "70+ Free Things to Do in Dubai 2025 - Complete Guide | Save AED 2,500+ Every Week",
    description: "Dubai on AED 0: 7 free beaches, 500 flamingos, AED 1 abra rides, 11km Palm boardwalk, nightly fountain shows. Complete guide to 70+ free Dubai experiences.",
    ogType: "article"
  });

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[10%] w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
          <div className="absolute top-40 right-[15%] w-[500px] h-[500px] bg-blue-400/15 rounded-full blur-3xl" />
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
                2025 Complete Free Dubai Guide
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
              The complete guide to <strong className="text-emerald-600">70+ free attractions</strong>, beaches, shows, and experiences in Dubai. Save thousands while seeing everything.
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

            {/* Quick Nav */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-2"
            >
              <Button variant="outline" size="sm" onClick={() => scrollToSection(beachesRef)} className="rounded-full">
                <Waves className="w-4 h-4 mr-1" /> Beaches
              </Button>
              <Button variant="outline" size="sm" onClick={() => scrollToSection(heritageRef)} className="rounded-full">
                <MapPin className="w-4 h-4 mr-1" /> Heritage
              </Button>
              <Button variant="outline" size="sm" onClick={() => scrollToSection(skylineRef)} className="rounded-full">
                <Building2 className="w-4 h-4 mr-1" /> Skyline
              </Button>
              <Button variant="outline" size="sm" onClick={() => scrollToSection(parksRef)} className="rounded-full">
                <TreePalm className="w-4 h-4 mr-1" /> Parks
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FLAMINGOS SECTION ===== */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white order-2 md:order-1">
              <Badge className="bg-white/20 text-white border-0 mb-4 px-3 py-1.5">
                <Bird className="w-4 h-4 mr-2" />
                Wildlife Sanctuary
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                500 Flamingos at Sunset
              </h2>
              <p className="text-base md:text-lg text-white/90 mb-6">
                At Ras Al Khor Wildlife Sanctuary, watch over 500 Greater Flamingos in their 
                natural habitat—completely free. Three viewing hides with free binoculars, 
                just 15 minutes from Downtown Dubai.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {["Free Entry", "Free Binoculars", "Free Parking", "170+ Bird Species"].map((item) => (
                  <div key={item} className="flex items-center gap-2 bg-white/20 backdrop-blur-xl px-3 py-2 rounded-lg text-sm">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-white/30 text-white border-0">Best Time: Early Morning</Badge>
                <Badge className="bg-white/30 text-white border-0">Metro: Creek</Badge>
              </div>
            </div>
            <div className="relative order-1 md:order-2">
              <img 
                src="https://images.unsplash.com/photo-1497206365907-f5e630693df0?w=800" 
                alt="Flamingos at Ras Al Khor Wildlife Sanctuary" 
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-3 shadow-xl">
                <div className="text-2xl font-bold text-rose-500">500+</div>
                <div className="text-xs text-slate-500">Flamingos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DUBAI FOUNTAIN SECTION ===== */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800" 
                alt="Dubai Fountain at night with water jets" 
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-3 shadow-xl">
                <div className="text-2xl font-bold text-indigo-500">140m</div>
                <div className="text-xs text-slate-500">Water Height</div>
              </div>
            </div>
            <div className="text-white">
              <Badge className="bg-white/20 text-white border-0 mb-4 px-3 py-1.5">
                <Music className="w-4 h-4 mr-2" />
                World's Largest Fountain
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                The Dubai Fountain
              </h2>
              <p className="text-base md:text-lg text-white/90 mb-6">
                22,000 gallons of water shooting 140 meters high, choreographed to music from 
                classical Arabic to modern pop. Shows run every 30 minutes from 6pm-11pm.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {["Every 30 Minutes", "6pm - 11pm Daily", "Free Lakeside Views", "22,000 Gallons/Show"].map((item) => (
                  <div key={item} className="flex items-center gap-2 bg-white/20 backdrop-blur-xl px-3 py-2 rounded-lg text-sm">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-white/30 text-white border-0">Best Spot: Dubai Mall Terrace</Badge>
                <Badge className="bg-white/30 text-white border-0">Metro: Burj Khalifa</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABRA RIDE SECTION ===== */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white order-2 md:order-1">
              <Badge className="bg-white/20 text-white border-0 mb-4 px-3 py-1.5">
                <Ship className="w-4 h-4 mr-2" />
                Traditional Transport
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                AED 1 Abra Ride
              </h2>
              <p className="text-base md:text-lg text-white/90 mb-6">
                Cross Dubai Creek on a traditional wooden abra boat for just AED 1. 
                Dubai's oldest form of public transport, connecting Deira to Bur Dubai 
                since the 1800s. The cheapest boat ride in the world.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {["Only AED 1", "5am - Midnight", "No Booking Needed", "Authentic Experience"].map((item) => (
                  <div key={item} className="flex items-center gap-2 bg-white/20 backdrop-blur-xl px-3 py-2 rounded-lg text-sm">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-white/30 text-white border-0">Route: Bur Dubai - Deira</Badge>
                <Badge className="bg-white/30 text-white border-0">Metro: Al Fahidi</Badge>
              </div>
            </div>
            <div className="relative order-1 md:order-2">
              <img 
                src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800" 
                alt="Traditional abra boats on Dubai Creek" 
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-3 shadow-xl">
                <div className="text-2xl font-bold text-amber-500">AED 1</div>
                <div className="text-xs text-slate-500">Per Crossing</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FREE BEACHES SECTION ===== */}
      <section ref={beachesRef} className="py-16 sm:py-24 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center text-white mb-12">
            <Badge className="bg-white/20 text-white border-0 mb-4 px-4 py-2">
              <Waves className="w-5 h-5 mr-2" />
              7 Free Public Beaches
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Dubai's Best Free Beaches
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Crystal-clear waters, pristine sand, and world-class facilities—all completely free.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {freeBeaches.map((beach, index) => (
              <motion.div
                key={beach.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full bg-white/20 backdrop-blur-xl border-0 text-white">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold">{beach.name}</h3>
                      <Badge className="bg-emerald-500 text-white border-0 text-xs shrink-0">FREE</Badge>
                    </div>
                    <p className="text-sm text-white/80 mb-3">{beach.desc}</p>
                    <div className="flex items-center gap-1 text-emerald-300 text-sm font-medium">
                      <Wallet className="w-4 h-4" />
                      Save {beach.savings}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GOLD SOUK SECTION ===== */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1548013146-72479768bada?w=800" 
                alt="Gold jewelry display in Dubai Gold Souk" 
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-3 shadow-xl">
                <div className="text-2xl font-bold text-amber-500">300+</div>
                <div className="text-xs text-slate-500">Gold Shops</div>
              </div>
            </div>
            <div className="text-white">
              <Badge className="bg-white/20 text-white border-0 mb-4 px-3 py-1.5">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Traditional Market
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Gold & Spice Souks
              </h2>
              <p className="text-base md:text-lg text-white/90 mb-6">
                Walk through Dubai's legendary souks for free. The Gold Souk displays 
                over 10 tons of gold, while the Spice Souk fills the air with saffron, 
                cardamom, and frankincense. Window shopping is priceless.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {["Free to Walk", "10+ Tons of Gold", "No Entry Fee", "Traditional Haggling"].map((item) => (
                  <div key={item} className="flex items-center gap-2 bg-white/20 backdrop-blur-xl px-3 py-2 rounded-lg text-sm">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-white/30 text-white border-0">Area: Deira</Badge>
                <Badge className="bg-white/30 text-white border-0">Metro: Al Ras</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== HERITAGE SITES SECTION ===== */}
      <section ref={heritageRef} className="py-16 sm:py-24 bg-gradient-to-r from-stone-600 via-stone-700 to-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center text-white mb-12">
            <Badge className="bg-white/20 text-white border-0 mb-4 px-4 py-2">
              <MapPin className="w-5 h-5 mr-2" />
              Heritage & Culture
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Old Dubai Walking Tour
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Step back in time through wind-tower houses, ancient souks, and museums—all free to explore.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {heritageSites.map((site, index) => (
              <motion.div
                key={site.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full bg-white/10 backdrop-blur-xl border-0 text-white">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold">{site.name}</h3>
                      <Badge className="bg-emerald-500 text-white border-0 text-xs shrink-0">FREE</Badge>
                    </div>
                    <p className="text-sm text-white/80">{site.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DUBAI MARINA SECTION ===== */}
      <section ref={skylineRef} className="py-16 sm:py-24 bg-gradient-to-r from-slate-800 via-slate-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white order-2 md:order-1">
              <Badge className="bg-white/20 text-white border-0 mb-4 px-3 py-1.5">
                <Building2 className="w-4 h-4 mr-2" />
                Free Walking Paths
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Dubai Marina Walk
              </h2>
              <p className="text-base md:text-lg text-white/90 mb-6">
                7km promenade along the world's largest man-made marina. Walk among 
                200+ skyscrapers, luxury yachts, and waterfront restaurants. Best views 
                at sunset when the towers light up.
              </p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {["7km Promenade", "200+ Skyscrapers", "Yacht Views", "24/7 Access"].map((item) => (
                  <div key={item} className="flex items-center gap-2 bg-white/20 backdrop-blur-xl px-3 py-2 rounded-lg text-sm">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-white/30 text-white border-0">Metro: DMCC/Marina</Badge>
              </div>
            </div>
            <div className="relative order-1 md:order-2">
              <img 
                src="https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800" 
                alt="Dubai Marina skyline at night with illuminated towers" 
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-3 shadow-xl">
                <div className="text-2xl font-bold text-slate-700">7km</div>
                <div className="text-xs text-slate-500">Walk Path</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SKYLINE SPOTS LIST ===== */}
      <section className="py-16 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center text-white mb-10">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">More Free Skyline Experiences</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skylineSpots.map((spot, index) => (
              <motion.div
                key={spot.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full bg-white/10 backdrop-blur-xl border-0 text-white">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-lg font-bold">{spot.name}</h3>
                    </div>
                    <p className="text-sm text-white/80">{spot.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PARKS SECTION ===== */}
      <section ref={parksRef} className="py-16 sm:py-24 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center text-white mb-12">
            <Badge className="bg-white/20 text-white border-0 mb-4 px-4 py-2">
              <TreePalm className="w-5 h-5 mr-2" />
              Parks & Nature
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Green Oasis in the Desert
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Escape the city heat in Dubai's beautiful parks—all with free entry.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {parksGardens.map((park, index) => (
              <motion.div
                key={park.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full bg-white/20 backdrop-blur-xl border-0 text-white">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold">{park.name}</h3>
                      <Badge className="bg-emerald-700 text-white border-0 text-xs shrink-0">FREE</Badge>
                    </div>
                    <p className="text-sm text-white/80">{park.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ART SECTION ===== */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-violet-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800" 
                alt="Contemporary art gallery interior" 
                className="rounded-2xl shadow-2xl w-full"
              />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-3 shadow-xl">
                <div className="text-2xl font-bold text-purple-500">50+</div>
                <div className="text-xs text-slate-500">Free Galleries</div>
              </div>
            </div>
            <div className="text-white">
              <Badge className="bg-white/20 text-white border-0 mb-4 px-3 py-1.5">
                <Palette className="w-4 h-4 mr-2" />
                Art & Culture
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Free Art Galleries
              </h2>
              <p className="text-base md:text-lg text-white/90 mb-6">
                Dubai's thriving art scene offers free access to world-class galleries. 
                From Alserkal Avenue's contemporary spaces to d3's design studios.
              </p>
              <div className="space-y-2">
                {artSpots.map((spot) => (
                  <div key={spot.name} className="flex items-start gap-2 bg-white/20 backdrop-blur-xl px-3 py-2 rounded-lg text-sm">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">{spot.name}</span>
                      <span className="text-white/70"> - {spot.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FREE SHOWS SECTION ===== */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center text-white mb-12">
            <Badge className="bg-white/20 text-white border-0 mb-4 px-4 py-2">
              <Sparkles className="w-5 h-5 mr-2" />
              Free Entertainment
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Free Shows & Performances
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {freeShows.map((show, index) => (
              <motion.div
                key={show.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full bg-white/20 backdrop-blur-xl border-0 text-white">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Music className="w-5 h-5 text-yellow-300" />
                      <h3 className="text-lg font-bold">{show.name}</h3>
                    </div>
                    <p className="text-sm text-white/80">{show.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SPORTS SECTION ===== */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-lime-500 via-green-500 to-emerald-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center text-white mb-12">
            <Badge className="bg-white/20 text-white border-0 mb-4 px-4 py-2">
              <Bike className="w-5 h-5 mr-2" />
              Free Sports & Activities
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Stay Active for Free
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sportsActivities.map((activity, index) => (
              <motion.div
                key={activity.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full bg-white/20 backdrop-blur-xl border-0 text-white">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Footprints className="w-5 h-5 text-white" />
                      <h3 className="text-lg font-bold">{activity.name}</h3>
                    </div>
                    <p className="text-sm text-white/80">{activity.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRANSPORTATION SECTION ===== */}
      <section className="py-16 sm:py-24 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-white">
          <Train className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Getting Around Dubai Cheap
          </h2>
          <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto">
            Dubai's public transport is world-class and affordable. Get everywhere on a budget.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: "Metro", cost: "AED 3-7.5" },
              { label: "Abra", cost: "AED 1" },
              { label: "Bus", cost: "AED 3-5" },
              { label: "Trolley", cost: "FREE" },
            ].map((item) => (
              <div key={item.label} className="bg-white/20 backdrop-blur-xl rounded-xl p-4">
                <div className="text-3xl font-bold">{item.cost}</div>
                <div className="text-sm text-white/80">{item.label}</div>
              </div>
            ))}
          </div>
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
                Now You Know Dubai's Secrets
              </h2>
              <p className="text-base text-slate-300 max-w-lg mx-auto mb-6">
                70+ free experiences, 7 beaches, unlimited memories. Share this guide with 
                fellow travelers and help them save thousands.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/districts">
                  <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-6 rounded-full">
                    <Compass className="w-5 h-5 mr-2" />
                    Explore Districts
                  </Button>
                </Link>
                <Link href="/dubai/laws-for-tourists">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 rounded-full">
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
