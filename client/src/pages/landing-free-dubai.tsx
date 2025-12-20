import { useState, useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Waves, MapPin, Camera, Sparkles, Sun, Bird, Clock, 
  ChevronRight, Star, Download, Mail, ArrowRight, 
  Umbrella, TreePalm, Mountain, Building2, Music, Heart,
  Users, Wallet, Trophy, CheckCircle2, Play, Bike, Coffee,
  Sunset, Footprints, ShoppingBag, Landmark, Palette, Ship,
  Train, PlaneTakeoff, Tent, Fish, Flower2, Moon, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";

// ALL 7 Free beaches data with complete information
const allFreeBeaches = [
  {
    name: "JBR Beach",
    subtitle: "Dubai's Crown Jewel",
    district: "Jumeirah Beach Residence",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
    features: ["Blue Flag Certified", "Free Showers", "24/7 Lifeguards", "Ain Dubai Views"],
    amenities: ["Public restrooms", "Outdoor gym", "Beach volleyball", "Running track", "Disabled access"],
    savings: "AED 150-500",
    bestTime: "7am-10am or 5pm-8pm",
    length: "1.7km",
    nearestMetro: "DMCC (10 min walk)",
    tips: "Arrive before 9am on weekends for the best spots. The water is calmest in the morning."
  },
  {
    name: "Kite Beach",
    subtitle: "The Active Paradise",
    district: "Umm Suqeim",
    image: "https://images.unsplash.com/photo-1533827432537-70133748f5c8?w=800",
    features: ["14km Running Track", "Beach Volleyball", "Free Library", "Burj Al Arab Views"],
    amenities: ["Skate park", "Outdoor gym", "Beach library", "Food trucks", "Prayer room"],
    savings: "AED 200+",
    bestTime: "Sunrise or Sunset",
    length: "3km",
    nearestMetro: "Mall of Emirates (Taxi 15 AED)",
    tips: "Perfect for kite surfing (hence the name). Equipment rental available but just watching is free!"
  },
  {
    name: "La Mer Beach",
    subtitle: "Instagram Paradise",
    district: "Jumeirah 1",
    image: "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800",
    features: ["50+ Street Art Murals", "Calm Waters", "Kid Friendly", "Splash Pads"],
    amenities: ["Street art", "Splash parks", "Shops", "Restaurants", "Beach cinema (seasonal)"],
    savings: "AED 100+",
    bestTime: "Late Afternoon",
    length: "2.5km",
    nearestMetro: "Healthcare City (Taxi 20 AED)",
    tips: "Best beach for families with kids. The splash pad area is completely free."
  },
  {
    name: "Sunset Beach",
    subtitle: "Photographer's Dream",
    district: "Umm Suqeim",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800",
    features: ["Burj Al Arab Close-Up", "Night Swimming", "Surfer Favorite", "Free Parking"],
    amenities: ["Free parking", "Lifeguards", "Changing rooms", "Surf spot", "Picnic areas"],
    savings: "AED 150+",
    bestTime: "Golden Hour (5-7pm)",
    length: "400m",
    nearestMetro: "Mall of Emirates (Taxi 20 AED)",
    tips: "THE best spot for Burj Al Arab photos. Come 30 min before sunset for perfect lighting."
  },
  {
    name: "Black Palace Beach",
    subtitle: "The Hidden Gem",
    district: "Al Sufouh",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    features: ["Secret Location", "Untouched Nature", "No Crowds", "Stunning Views"],
    amenities: ["Natural setting", "Quiet atmosphere", "Great swimming", "Dubai skyline views"],
    savings: "AED 300+",
    bestTime: "Weekday mornings",
    length: "500m",
    nearestMetro: "Internet City (Taxi 15 AED)",
    tips: "Locals keep this one secret. No facilities but the quietest beach experience in Dubai."
  },
  {
    name: "Al Mamzar Beach",
    subtitle: "5 Beaches in One",
    district: "Al Mamzar",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    features: ["5 Separate Beaches", "Park Setting", "BBQ Areas", "Sharjah Skyline"],
    amenities: ["5 beaches", "BBQ areas", "Swimming pools", "Chalets", "Playgrounds"],
    savings: "AED 100+",
    bestTime: "All day (shaded areas)",
    length: "106 hectares",
    nearestMetro: "Al Qiyadah (Taxi 20 AED)",
    tips: "Entry AED 5 per person or AED 30 per car. The only beach with entry fee but incredibly worth it."
  },
  {
    name: "Mercato Beach",
    subtitle: "Italian Village Vibes",
    district: "Jumeirah",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800",
    features: ["Clean Waters", "Near Mercato Mall", "Family Friendly", "Easy Parking"],
    amenities: ["Near mall", "Restaurants nearby", "Public facilities", "Volleyball courts"],
    savings: "AED 150+",
    bestTime: "Morning or evening",
    length: "800m",
    nearestMetro: "Healthcare City (Taxi 25 AED)",
    tips: "Combine with a visit to Mercato Mall for the Italian architecture photo ops."
  }
];

// Free Attractions by Category
const freeAttractionCategories = [
  {
    category: "Skyline & Architecture",
    icon: Building2,
    color: "from-purple-500 to-pink-500",
    attractions: [
      { name: "Dubai Fountain", desc: "World's largest choreographed fountain - 140m water jets", schedule: "Every 30 min, 6pm-11pm", savings: "AED 149-379" },
      { name: "Dubai Marina Walk", desc: "7km promenade with 200+ illuminated skyscrapers", schedule: "24/7, Best 6pm-10pm", savings: "AED 200+" },
      { name: "Palm Jumeirah Boardwalk", desc: "11km waterfront walk around Palm Jumeirah", schedule: "24/7, Illuminated til midnight", savings: "AED 1,295" },
      { name: "Dubai Canal Walk", desc: "6.4km with mechanical waterfall & Tolerance Bridge", schedule: "Waterfall shows 8pm-10pm", savings: "AED 100+" },
      { name: "Downtown Dubai Boulevard", desc: "3.5km luxury promenade around Burj Khalifa", schedule: "24/7", savings: "AED 50+" },
      { name: "City Walk", desc: "Modern urban district with street art installations", schedule: "10am-10pm daily", savings: "AED 75+" },
      { name: "Dubai Frame (Exterior)", desc: "150m golden frame - world's largest picture frame exterior", schedule: "24/7 viewing from outside", savings: "AED 75" },
      { name: "Museum of the Future (Exterior)", desc: "Stunning calligraphy-covered torus architecture", schedule: "24/7 exterior viewing", savings: "AED 149" }
    ]
  },
  {
    category: "Heritage & Culture",
    icon: Landmark,
    color: "from-amber-500 to-orange-500",
    attractions: [
      { name: "Al Fahidi Historical District", desc: "Traditional wind-tower houses from 1890s", schedule: "Open 24/7, museums 10am-6pm", savings: "AED 30+" },
      { name: "Gold Souk", desc: "300+ gold shops with 10 tons of gold on display", schedule: "10am-10pm (closed 1-4pm Fri)", savings: "Free" },
      { name: "Spice Souk", desc: "Traditional market with exotic spices & herbs", schedule: "8am-10pm daily", savings: "Free" },
      { name: "Textile Souk", desc: "Colorful fabrics and traditional clothing", schedule: "9am-10pm daily", savings: "Free" },
      { name: "Abra Ride (Creek Crossing)", desc: "Traditional wooden boat - oldest transport in Dubai", schedule: "5am-midnight", savings: "AED 1 per ride" },
      { name: "Heritage Village", desc: "Traditional Emirati village recreation", schedule: "Sun-Thu 8am-8pm, Fri 3pm-9pm", savings: "Free" },
      { name: "Coffee Museum", desc: "Journey through coffee history and traditions", schedule: "Sun-Thu 9am-5pm", savings: "AED 10" },
      { name: "Jumeirah Mosque (Exterior)", desc: "Stunning Fatimid-style mosque architecture", schedule: "24/7 exterior, tours Sat-Thu 10am", savings: "AED 25 tour" }
    ]
  },
  {
    category: "Parks & Nature",
    icon: TreePalm,
    color: "from-emerald-500 to-green-500",
    attractions: [
      { name: "Ras Al Khor Wildlife Sanctuary", desc: "500+ flamingos in natural habitat", schedule: "9am-4pm Sat-Thu", savings: "Free" },
      { name: "Zabeel Park", desc: "47.5 hectare green oasis with lake views", schedule: "8am-10pm daily", savings: "AED 5" },
      { name: "Al Barsha Pond Park", desc: "Beautiful lake, running tracks, outdoor gym", schedule: "8am-10pm daily", savings: "Free" },
      { name: "Creek Park", desc: "96 hectare park along Dubai Creek", schedule: "8am-11pm daily", savings: "AED 5" },
      { name: "Mushrif Park", desc: "Indigenous ghaf forest and playgrounds", schedule: "8am-10pm daily", savings: "AED 3" },
      { name: "Al Qudra Lakes", desc: "Man-made desert oasis with wildlife", schedule: "24/7", savings: "Free" },
      { name: "Love Lake", desc: "Heart-shaped lakes in Al Qudra desert", schedule: "24/7", savings: "Free" },
      { name: "Dubai Miracle Garden (Outside)", desc: "150M+ flower arrangements (view from perimeter)", schedule: "Free exterior", savings: "AED 75" }
    ]
  },
  {
    category: "Malls & Free Attractions",
    icon: ShoppingBag,
    color: "from-blue-500 to-cyan-500",
    attractions: [
      { name: "Dubai Mall Aquarium (Free View)", desc: "10M liter tank with 33,000 aquatic animals", schedule: "10am-12am daily", savings: "AED 135" },
      { name: "Dubai Mall Waterfall", desc: "4-story human diving sculpture waterfall", schedule: "Mall hours", savings: "Free" },
      { name: "Ibn Battuta Mall Architecture", desc: "6 themed courts representing explorer's journey", schedule: "10am-10pm daily", savings: "Free" },
      { name: "Mall of the Emirates Ski View", desc: "Watch skiers from viewing windows", schedule: "Mall hours", savings: "Free" },
      { name: "Dubai Festival City Imagine Show", desc: "Laser, fire and water light show", schedule: "Every hour from 7pm", savings: "Free" },
      { name: "Cityland Mall Gardens", desc: "8-acre botanical garden around the mall", schedule: "24/7 gardens", savings: "Free" },
      { name: "Dragon Mart", desc: "1.2km of Chinese goods and architecture", schedule: "10am-10pm daily", savings: "Free" },
      { name: "Global Village (Walking)", desc: "World cultures showcase (entry AED 25)", schedule: "Oct-Apr, 4pm-12am", savings: "AED 25" }
    ]
  },
  {
    category: "Sports & Activities",
    icon: Bike,
    color: "from-rose-500 to-pink-500",
    attractions: [
      { name: "Al Qudra Cycle Path", desc: "86km of desert cycling trails", schedule: "24/7 (avoid midday heat)", savings: "Free" },
      { name: "Dubai Water Canal Running Track", desc: "12km waterfront jogging path", schedule: "24/7", savings: "Free" },
      { name: "Kite Beach Outdoor Gym", desc: "Professional outdoor equipment", schedule: "24/7", savings: "AED 100+" },
      { name: "JBR Running Track", desc: "1.7km beachfront running path", schedule: "24/7", savings: "Free" },
      { name: "Skydive Dubai Viewing", desc: "Watch skydivers land on Palm", schedule: "Morning sessions", savings: "Free" },
      { name: "Jebel Ali Free Zone Beach", desc: "Quiet beach with fishing allowed", schedule: "24/7", savings: "Free" },
      { name: "Hatta Mountain Trails", desc: "32+ hiking trails (1hr from Dubai)", schedule: "Sunrise-sunset", savings: "Free" },
      { name: "Nad Al Sheba Cycle Park", desc: "8km cycling tracks in park setting", schedule: "5am-10pm", savings: "Free" }
    ]
  },
  {
    category: "Art & Entertainment",
    icon: Palette,
    color: "from-indigo-500 to-purple-500",
    attractions: [
      { name: "Alserkal Avenue", desc: "Dubai's creative hub with 60+ galleries", schedule: "10am-7pm Sat-Thu", savings: "Free" },
      { name: "Dubai Design District (d3)", desc: "Creative community galleries & studios", schedule: "Varies by gallery", savings: "Free" },
      { name: "Street Art in City Walk", desc: "World-class murals and installations", schedule: "24/7", savings: "Free" },
      { name: "La Mer Street Art", desc: "50+ colorful murals and art installations", schedule: "24/7", savings: "Free" },
      { name: "XVA Gallery (Al Fahidi)", desc: "Contemporary Middle Eastern art", schedule: "10am-6pm Sat-Thu", savings: "Free" },
      { name: "Etihad Museum Exterior", desc: "Stunning modern architecture representing UAE", schedule: "24/7 exterior", savings: "AED 25" },
      { name: "Dubai Opera Plaza", desc: "Dhow-shaped building and waterfront views", schedule: "24/7 plaza", savings: "Free" },
      { name: "Creek Harbour Views", desc: "Dubai Creek Tower construction views", schedule: "24/7", savings: "Free" }
    ]
  }
];

// Multiple day itineraries
const dayItineraries = [
  {
    title: "Day 1: Beach & Marina",
    theme: "Coastal Dubai",
    icon: Waves,
    color: "from-cyan-500 to-blue-500",
    activities: [
      { time: "6:30 AM", activity: "Sunrise at Kite Beach", location: "Kite Beach", duration: "1.5hr", tip: "Best light for Burj Al Arab photos" },
      { time: "8:00 AM", activity: "Free Outdoor Gym Workout", location: "Kite Beach Gym", duration: "1hr", tip: "Full equipment available" },
      { time: "9:30 AM", activity: "Beach Swimming & Relaxation", location: "Kite Beach", duration: "2hr", tip: "Bring your own snacks" },
      { time: "12:00 PM", activity: "Walk The Walk JBR", location: "JBR Beach", duration: "1.5hr", tip: "Window shop, people watch" },
      { time: "2:00 PM", activity: "Mall Break (AC)", location: "Marina Mall", duration: "2hr", tip: "Free AC escape from heat" },
      { time: "4:30 PM", activity: "Dubai Marina Walk", location: "Dubai Marina", duration: "2hr", tip: "7km of stunning waterfront" },
      { time: "6:30 PM", activity: "Sunset at Marina", location: "Marina Promenade", duration: "1hr", tip: "Golden hour photography" },
      { time: "8:00 PM", activity: "Ain Dubai Light Show", location: "Bluewaters Island", duration: "30min", tip: "Free to watch from outside" }
    ]
  },
  {
    title: "Day 2: Heritage & Culture",
    theme: "Old Dubai",
    icon: Landmark,
    color: "from-amber-500 to-orange-500",
    activities: [
      { time: "8:00 AM", activity: "Al Fahidi Morning Walk", location: "Al Fahidi Historical District", duration: "1.5hr", tip: "Cool temperatures, fewer crowds" },
      { time: "9:30 AM", activity: "Coffee Museum Visit", location: "Al Fahidi", duration: "1hr", tip: "Free coffee samples on some days" },
      { time: "11:00 AM", activity: "Abra Crossing (AED 1)", location: "Dubai Creek", duration: "15min", tip: "World's cheapest sea crossing" },
      { time: "11:30 AM", activity: "Gold Souk Exploration", location: "Deira Gold Souk", duration: "1.5hr", tip: "10 tons of gold on display" },
      { time: "1:00 PM", activity: "Spice Souk", location: "Deira Spice Souk", duration: "1hr", tip: "Amazing photo opportunities" },
      { time: "3:00 PM", activity: "Heritage Village", location: "Shindagha", duration: "1.5hr", tip: "Traditional Emirati life" },
      { time: "5:00 PM", activity: "Creek Sunset Walk", location: "Al Seef", duration: "1.5hr", tip: "Old Dubai meets new" },
      { time: "7:00 PM", activity: "Dhow Watching", location: "Deira Wharf", duration: "1hr", tip: "Watch cargo loading to Iran, India" }
    ]
  },
  {
    title: "Day 3: Modern Icons",
    theme: "Downtown & Beyond",
    icon: Building2,
    color: "from-purple-500 to-pink-500",
    activities: [
      { time: "9:00 AM", activity: "Burj Khalifa Park Walk", location: "Downtown Dubai", duration: "1.5hr", tip: "Photos from every angle" },
      { time: "10:30 AM", activity: "Dubai Mall Free Aquarium", location: "Dubai Mall", duration: "1hr", tip: "33,000 animals visible free" },
      { time: "12:00 PM", activity: "Human Waterfall & Mall Walk", location: "Dubai Mall", duration: "2hr", tip: "World's largest mall experience" },
      { time: "2:00 PM", activity: "Dubai Opera Plaza", location: "Downtown Dubai", duration: "1hr", tip: "Dhow-shaped architecture" },
      { time: "3:30 PM", activity: "Business Bay Walk", location: "Dubai Canal", duration: "1.5hr", tip: "Newest skyline views" },
      { time: "5:00 PM", activity: "Dubai Frame (Exterior)", location: "Zabeel Park", duration: "1hr", tip: "World's largest picture frame" },
      { time: "6:00 PM", activity: "Dubai Fountain (First Show)", location: "Dubai Mall", duration: "30min", tip: "Get lakeside position early" },
      { time: "6:30 PM", activity: "Multiple Fountain Shows", location: "Burj Khalifa Lake", duration: "2hr", tip: "Each show is different" }
    ]
  },
  {
    title: "Day 4: Nature & Wildlife",
    theme: "Green Dubai",
    icon: Bird,
    color: "from-emerald-500 to-green-500",
    activities: [
      { time: "7:00 AM", activity: "Al Qudra Lakes Sunrise", location: "Al Qudra", duration: "2hr", tip: "Wildlife is most active at dawn" },
      { time: "9:30 AM", activity: "Love Lake Walk", location: "Al Qudra", duration: "1.5hr", tip: "Heart-shaped lakes" },
      { time: "12:00 PM", activity: "Return to City for Lunch", location: "-", duration: "1hr", tip: "Pack a picnic to save" },
      { time: "1:30 PM", activity: "Zabeel Park", location: "Zabeel", duration: "2hr", tip: "Dubai Frame views" },
      { time: "4:00 PM", activity: "Ras Al Khor Flamingos", location: "Ras Al Khor", duration: "2hr", tip: "500+ flamingos at sunset" },
      { time: "6:30 PM", activity: "Dubai Creek Sunset", location: "Creek Park Area", duration: "1hr", tip: "Golden hour perfection" },
      { time: "8:00 PM", activity: "Creek Night Walk", location: "Al Seef", duration: "1.5hr", tip: "Beautiful illumination" }
    ]
  }
];

// Big stats for hero
const heroStats = [
  { icon: Wallet, value: "AED 2,500+", label: "Save Per Week" },
  { icon: Waves, value: "7", label: "Free Beaches" },
  { icon: Sparkles, value: "70+", label: "Free Activities" },
  { icon: Camera, value: "50+", label: "Photo Spots" },
];

// Transportation tips
const transportTips = [
  { name: "Abra Ride", cost: "AED 1", desc: "Traditional boat across Dubai Creek - world's cheapest sea crossing", icon: Ship },
  { name: "Metro Red/Green Line", cost: "AED 3-7.5", desc: "Covers all major attractions - use Nol Silver for tourists", icon: Train },
  { name: "RTA Bus", cost: "AED 3-5", desc: "Extensive network including beach routes", icon: PlaneTakeoff },
  { name: "Free Dubai Trolley", cost: "FREE", desc: "Hop-on service around Downtown Dubai (weekends)", icon: Train },
];

// Money-saving tips
const savingsTips = [
  { title: "Skip the Tourist Traps", desc: "At The Top Burj Khalifa is AED 149+. See it from below for free.", savings: "AED 149" },
  { title: "Public vs Private Beaches", desc: "Beach clubs charge AED 200-500. JBR Beach is free with same water.", savings: "AED 500/day" },
  { title: "Mall AC Strategy", desc: "Use malls for free air conditioning during 12pm-4pm heat.", savings: "AED 50/day" },
  { title: "Pack Lunch", desc: "Restaurants charge AED 80-150. Pack snacks from supermarkets.", savings: "AED 100/day" },
  { title: "Sunset Photography", desc: "Golden hour is 5-7pm. Best free photos during this window.", savings: "AED 0" },
  { title: "Friday Brunches Alternative", desc: "Skip AED 400 brunches. Visit free brunch venues for views only.", savings: "AED 400" },
];

export default function LandingFreeDubai() {
  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState("beaches");
  
  // Refs for scrolling
  const beachesRef = useRef<HTMLDivElement>(null);
  const attractionsRef = useRef<HTMLDivElement>(null);
  const itineraryRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useDocumentMeta({
    title: "70+ Free Things to Do in Dubai 2025 - Complete Guide | Save AED 2,500+ Every Week",
    description: "Dubai on AED 0: 7 free beaches, 500 flamingos, AED 1 abra rides, 11km Palm boardwalk, nightly fountain shows. Complete guide to 70+ free Dubai experiences from JBR Beach to Gold Souk.",
    ogType: "article"
  });

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[10%] w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
          <div className="absolute top-40 right-[15%] w-[500px] h-[500px] bg-blue-400/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-[30%] w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/" className="hover:text-cyan-600 transition-colors" data-testid="link-home">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/districts" className="hover:text-cyan-600 transition-colors">Dubai</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 dark:text-white font-medium">Free Things to Do</span>
          </div>

          {/* Main Hero Content */}
          <div className="text-center max-w-5xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-0 px-6 py-2.5 text-base mb-8">
                <Trophy className="w-5 h-5 mr-2" />
                2025 Ultimate Free Dubai Guide - Updated December
              </Badge>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight"
            >
              Dubai Costs{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500">
                AED 0
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-2xl sm:text-3xl md:text-4xl text-slate-600 dark:text-slate-300 mb-8"
            >
              If You Know Where to Look
            </motion.p>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-4xl mx-auto leading-relaxed"
            >
              While tourists pay <span className="text-rose-500 font-semibold">AED 500+ daily</span>, smart travelers explore 7 pristine beaches, 
              watch 500 flamingos at sunset, ride abras for AED 1, and witness the world's 
              largest fountain show—<strong className="text-emerald-600 dark:text-emerald-400">all completely free.</strong>
            </motion.p>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto"
            >
              {heroStats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-6 rounded-2xl shadow-xl shadow-cyan-500/10 border border-white/50 dark:border-slate-700/50"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg mx-auto mb-3">
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-10 py-7 text-lg rounded-full shadow-xl shadow-cyan-500/25"
                onClick={() => scrollToSection(mapRef)}
                data-testid="button-download-map"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Free Map
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-10 py-7 text-lg rounded-full"
                onClick={() => scrollToSection(itineraryRef)}
                data-testid="button-view-itinerary"
              >
                <Play className="w-5 h-5 mr-2" />
                View Full Itinerary
              </Button>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-16"
            >
              <div className="flex flex-col items-center text-slate-400">
                <span className="text-sm mb-2">Scroll to explore</span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ChevronRight className="w-6 h-6 rotate-90" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-12 bg-slate-50 dark:bg-slate-800/50 sticky top-16 z-30 border-y border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-3">
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection(beachesRef)}
              className="rounded-full"
            >
              <Waves className="w-4 h-4 mr-2" />
              7 Beaches
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection(attractionsRef)}
              className="rounded-full"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              70+ Activities
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection(itineraryRef)}
              className="rounded-full"
            >
              <Clock className="w-4 h-4 mr-2" />
              4-Day Itinerary
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection(mapRef)}
              className="rounded-full"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Free Map
            </Button>
          </div>
        </div>
      </section>

      {/* ALL 7 Free Beaches Section */}
      <section ref={beachesRef} className="py-24 relative" data-testid="section-beaches">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <Badge className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 border-0 mb-6 px-6 py-2">
              <Waves className="w-5 h-5 mr-2" />
              Better Than Maldives
            </Badge>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              All 7 FREE Beaches
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Blue Flag-certified, completely free, with lifeguards and views rivaling the world's most expensive resorts. 
              Save <span className="text-emerald-600 font-semibold">AED 350+</span> per day compared to beach clubs.
            </p>
          </div>

          {/* Beach Cards - Full Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {allFreeBeaches.map((beach, index) => (
              <motion.div
                key={beach.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group h-full overflow-hidden border-0 shadow-xl shadow-cyan-500/5 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={beach.image} 
                      alt={beach.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-1">{beach.name}</h3>
                      <p className="text-cyan-200 text-sm">{beach.subtitle}</p>
                      <p className="text-white/60 text-xs mt-1">{beach.district}</p>
                    </div>
                    <Badge className="absolute top-4 right-4 bg-emerald-500/90 text-white border-0 text-sm px-3">
                      FREE
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    {/* Features */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {beach.features.slice(0, 3).map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Stats */}
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Length:</span>
                        <span className="font-medium">{beach.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Metro:</span>
                        <span className="font-medium text-xs">{beach.nearestMetro}</span>
                      </div>
                    </div>

                    {/* Savings & Time */}
                    <div className="flex items-center justify-between text-sm pt-3 border-t">
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <Wallet className="w-4 h-4" />
                        Save {beach.savings}
                      </div>
                      <div className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-4 h-4" />
                        {beach.bestTime}
                      </div>
                    </div>

                    {/* Tip */}
                    <div className="mt-4 p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
                      <p className="text-xs text-cyan-700 dark:text-cyan-300">
                        <strong>Pro tip:</strong> {beach.tips}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Beach Savings Calculator */}
          <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-8 text-center">Beach Savings Calculator</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
              <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-5 text-center">
                <div className="text-4xl font-bold">AED 0</div>
                <div className="text-sm text-white/80 mt-1">Free Beach Daily</div>
              </div>
              <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-5 text-center">
                <div className="text-4xl font-bold">AED 350</div>
                <div className="text-sm text-white/80 mt-1">Beach Club Avg</div>
              </div>
              <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-5 text-center">
                <div className="text-4xl font-bold">AED 2,450</div>
                <div className="text-sm text-white/80 mt-1">Weekly Savings</div>
              </div>
              <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-5 text-center">
                <div className="text-4xl font-bold">AED 9,800</div>
                <div className="text-sm text-white/80 mt-1">Monthly Savings</div>
              </div>
              <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-5 text-center col-span-2 md:col-span-1">
                <div className="text-4xl font-bold">AED 117K</div>
                <div className="text-sm text-white/80 mt-1">Yearly Savings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 70+ Free Attractions by Category */}
      <section ref={attractionsRef} className="py-24 bg-slate-50 dark:bg-slate-800/50" data-testid="section-attractions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-0 mb-6 px-6 py-2">
              <Sparkles className="w-5 h-5 mr-2" />
              Complete Collection
            </Badge>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              70+ Free Activities
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Every free attraction in Dubai, organized by category. Combined value: <span className="text-emerald-600 font-semibold">AED 5,000+</span>
            </p>
          </div>

          {/* Category Tabs */}
          <Tabs defaultValue="Skyline & Architecture" className="w-full">
            <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent h-auto p-0 mb-12">
              {freeAttractionCategories.map((cat) => (
                <TabsTrigger
                  key={cat.category}
                  value={cat.category}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white px-6 py-3 rounded-full"
                >
                  <cat.icon className="w-4 h-4 mr-2" />
                  {cat.category}
                </TabsTrigger>
              ))}
            </TabsList>

            {freeAttractionCategories.map((cat) => (
              <TabsContent key={cat.category} value={cat.category}>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {cat.attractions.map((attraction, index) => (
                    <motion.div
                      key={attraction.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-5">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4`}>
                            <cat.icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{attraction.name}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{attraction.desc}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                            <Clock className="w-3 h-3" />
                            {attraction.schedule}
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                            Save {attraction.savings}
                          </Badge>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* 4-Day Complete Itinerary */}
      <section ref={itineraryRef} className="py-24 relative overflow-hidden" data-testid="section-itinerary">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50/30 to-white dark:from-slate-900 dark:via-purple-900/10 dark:to-slate-900" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 mb-6 px-6 py-2">
              <Clock className="w-5 h-5 mr-2" />
              Complete Planning
            </Badge>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              The 4-Day Free Itinerary
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Four unique themed days covering every corner of Dubai. Total cost: <span className="text-emerald-600 font-semibold">AED 10</span> (abra rides + park entries)
            </p>
          </div>

          {/* Day Tabs */}
          <Tabs defaultValue="Day 1: Beach & Marina" className="w-full">
            <TabsList className="flex flex-wrap justify-center gap-2 bg-transparent h-auto p-0 mb-12">
              {dayItineraries.map((day) => (
                <TabsTrigger
                  key={day.title}
                  value={day.title}
                  className={`data-[state=active]:bg-gradient-to-r data-[state=active]:${day.color} data-[state=active]:text-white px-6 py-3 rounded-full`}
                >
                  <day.icon className="w-4 h-4 mr-2" />
                  {day.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {dayItineraries.map((day) => (
              <TabsContent key={day.title} value={day.title}>
                <div className="max-w-4xl mx-auto">
                  {/* Day Header */}
                  <div className={`bg-gradient-to-r ${day.color} rounded-2xl p-6 mb-8 text-white text-center`}>
                    <h3 className="text-2xl font-bold mb-2">{day.title}</h3>
                    <p className="text-white/80">Theme: {day.theme}</p>
                  </div>

                  {/* Timeline */}
                  <div className="relative">
                    <div className={`absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b ${day.color} hidden md:block rounded-full`} />
                    
                    {day.activities.map((item, index) => (
                      <motion.div
                        key={item.time}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="relative flex gap-6 mb-6 last:mb-0"
                      >
                        {/* Timeline dot */}
                        <div className={`hidden md:flex w-16 h-16 rounded-full bg-gradient-to-br ${day.color} items-center justify-center shrink-0 shadow-lg z-10`}>
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        
                        {/* Content */}
                        <Card className="flex-1 border-0 shadow-lg hover:shadow-xl transition-shadow">
                          <CardContent className="p-5">
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                  <Badge variant="outline" className="font-mono text-sm">{item.time}</Badge>
                                  <Badge className="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 border-0 text-xs">
                                    {item.duration}
                                  </Badge>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.activity}</h3>
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                                  <MapPin className="w-4 h-4" />
                                  {item.location}
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  <strong>Tip:</strong> {item.tip}
                                </p>
                              </div>
                              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 shrink-0">
                                FREE
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* 4-Day Total */}
          <div className="mt-16 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 rounded-3xl p-10 text-white max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">4-Day Trip Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-400">AED 10</div>
                <div className="text-slate-400 text-sm mt-1">Your Total Cost</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-rose-400">AED 2,000+</div>
                <div className="text-slate-400 text-sm mt-1">Tourist Typical</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-400">32</div>
                <div className="text-slate-400 text-sm mt-1">Activities</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400">4</div>
                <div className="text-slate-400 text-sm mt-1">Unique Themes</div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-700 text-center">
              <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Save AED 1,990+
              </div>
              <p className="text-slate-400 mt-2">In just 4 days of exploring Dubai</p>
            </div>
          </div>
        </div>
      </section>

      {/* Transportation Tips */}
      <section className="py-24 bg-slate-50 dark:bg-slate-800/50" data-testid="section-transport">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0 mb-6 px-6 py-2">
              <Train className="w-5 h-5 mr-2" />
              Getting Around
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Budget Transportation
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Skip the taxis. Dubai has incredible public transport that costs a fraction of ride-sharing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {transportTips.map((tip, index) => (
              <motion.div
                key={tip.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-xl text-center">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <tip.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{tip.name}</h3>
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-3">{tip.cost}</div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{tip.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Money Saving Tips */}
      <section className="py-24" data-testid="section-tips">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 mb-6 px-6 py-2">
              <Wallet className="w-5 h-5 mr-2" />
              Insider Secrets
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Pro Money-Saving Tips
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              These tips alone can save you AED 1,000+ per week in Dubai.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savingsTips.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{tip.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{tip.desc}</p>
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                          Save {tip.savings}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Flamingo Highlight */}
      <section className="py-24 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500" data-testid="section-flamingos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <Badge className="bg-white/20 text-white border-0 mb-6 px-4 py-2">
                <Bird className="w-5 h-5 mr-2" />
                Dubai's Hidden Gem
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                500 Flamingos at Sunset
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                At Ras Al Khor Wildlife Sanctuary, watch over 500 Greater Flamingos in their 
                natural habitat—completely free. Three public viewing hides with free binoculars, 
                just 15 minutes from Downtown Dubai.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {["Free Entry", "Free Binoculars", "Free Parking", "170+ Bird Species", "3 Viewing Hides", "Best: Sunset"].map((item) => (
                  <div key={item} className="flex items-center gap-2 bg-white/20 backdrop-blur-xl px-4 py-3 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" className="bg-white text-rose-600 hover:bg-white/90 px-10 py-6 text-lg rounded-full shadow-xl">
                <MapPin className="w-5 h-5 mr-2" />
                Get Directions
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl transform rotate-3" />
              <img 
                src="https://images.unsplash.com/photo-1497206365907-f5e630693df0?w=800" 
                alt="Flamingos at Ras Al Khor"
                className="relative rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl">
                <div className="text-3xl font-bold text-rose-500">500+</div>
                <div className="text-sm text-slate-500">Flamingos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Email Capture for Map */}
      <section ref={mapRef} className="py-24" data-testid="section-email">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
            </div>
            
            <CardContent className="relative p-10 md:p-14">
              <div className="text-center mb-10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <MapPin className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  Get Your Free Dubai Map
                </h2>
                <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
                  A downloadable PDF with all 70+ free locations, metro routes, best times to visit, 
                  and insider tips. Print it or use offline.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mb-8">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-14 text-lg bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                  data-testid="input-email"
                />
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 h-14 text-lg rounded-lg shadow-lg shadow-cyan-500/25"
                  data-testid="button-get-map"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Now
                </Button>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  70+ Free Locations
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Metro Routes Marked
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Works Offline
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  No Spam, Ever
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-white">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to Explore Dubai for Free?
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto">
            You now have everything you need to experience the best of Dubai without spending a fortune. 
            Save AED 2,500+ every week and create unforgettable memories.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-white/90 px-10 py-7 text-lg rounded-full shadow-xl"
              onClick={() => scrollToSection(beachesRef)}
            >
              <Waves className="w-5 h-5 mr-2" />
              Start with Beaches
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/50 text-white hover:bg-white/10 px-10 py-7 text-lg rounded-full"
              onClick={() => scrollToSection(mapRef)}
            >
              <Download className="w-5 h-5 mr-2" />
              Get Free Map
            </Button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
