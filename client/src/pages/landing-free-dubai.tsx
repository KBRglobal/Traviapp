import { useState, useRef } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Waves, MapPin, Camera, Sparkles, Sun, Bird, Clock, 
  ChevronRight, Star, Download, Mail, ArrowRight, 
  TreePalm, Building2, Music, Heart,
  Users, Wallet, Trophy, CheckCircle2, Play, Bike,
  Sunset, Ship, Train, X, FileText, Gift, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";

// Selected preview attractions (teaser - not all)
const previewBeaches = [
  {
    name: "JBR Beach",
    subtitle: "Dubai's Crown Jewel",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
    features: ["Blue Flag Certified", "Free Showers", "24/7 Lifeguards"],
    savings: "AED 150-500",
  },
  {
    name: "Kite Beach",
    subtitle: "The Active Paradise",
    image: "https://images.unsplash.com/photo-1533827432537-70133748f5c8?w=800",
    features: ["14km Running Track", "Beach Volleyball", "Burj Al Arab Views"],
    savings: "AED 200+",
  },
];

const previewAttractions = [
  { name: "Dubai Fountain", icon: Music, desc: "World's largest fountain - 140m jets", savings: "AED 149-379" },
  { name: "Dubai Marina Walk", icon: Building2, desc: "7km promenade with 200+ skyscrapers", savings: "AED 200+" },
  { name: "Palm Boardwalk", icon: TreePalm, desc: "11km around Palm Jumeirah", savings: "AED 1,295" },
  { name: "Heritage Village", icon: MapPin, desc: "Traditional Emirati village", savings: "Free" },
];

const lockedCategories = [
  { title: "All 7 Beaches", count: "7 beaches", icon: Waves },
  { title: "Skyline Views", count: "15+ spots", icon: Building2 },
  { title: "Heritage & Culture", count: "12 sites", icon: MapPin },
  { title: "Parks & Nature", count: "10 parks", icon: TreePalm },
  { title: "Sports & Activities", count: "8 activities", icon: Bike },
  { title: "Art & Entertainment", count: "10 galleries", icon: Camera },
];

// Hero stats
const heroStats = [
  { icon: Wallet, value: "AED 2,500+", label: "Save Per Week" },
  { icon: Waves, value: "7", label: "Free Beaches" },
  { icon: Sparkles, value: "70+", label: "Free Activities" },
  { icon: Camera, value: "50+", label: "Photo Spots" },
];

// Itinerary preview
const dayOnePreview = [
  { time: "6:30 AM", activity: "Sunrise at Kite Beach", icon: Sun },
  { time: "10:00 AM", activity: "Heritage Walk Al Fahidi", icon: MapPin },
  { time: "6:00 PM", activity: "Dubai Fountain Show", icon: Music },
];

export default function LandingFreeDubai() {
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    travelMonth: "",
    travelDuration: "",
    travelWith: "",
    interests: [] as string[],
    budget: "",
    agreeTerms: false,
    agreeMarketing: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const beachesRef = useRef<HTMLDivElement>(null);
  const attractionsRef = useRef<HTMLDivElement>(null);
  const itineraryRef = useRef<HTMLDivElement>(null);

  useDocumentMeta({
    title: "70+ Free Things to Do in Dubai 2025 - Complete Guide | Save AED 2,500+ Every Week",
    description: "Dubai on AED 0: 7 free beaches, 500 flamingos, AED 1 abra rides, 11km Palm boardwalk, nightly fountain shows. Complete guide to 70+ free Dubai experiences.",
    ogType: "article"
  });

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = () => {
    if (formData.agreeTerms) {
      setFormSubmitted(true);
      // Here you would send data to backend
      console.log("Form submitted:", formData);
    }
  };

  const isStep1Valid = formData.email && formData.name;
  const isStep2Valid = formData.travelMonth && formData.travelDuration;
  const isStep3Valid = formData.interests.length > 0 && formData.agreeTerms;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 overflow-hidden">
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
                2025 Ultimate Free Dubai Guide
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-slate-900 dark:text-white mb-8"
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
              className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 max-w-3xl mx-auto"
            >
              Complete your travel survey and get instant access to our <strong className="text-emerald-600">complete 70+ locations guide</strong> with maps, tips, and metro routes.
            </motion.p>

            {/* CTA to Questionnaire */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-10 max-w-2xl mx-auto"
            >
              <div className="flex items-center gap-3 justify-center mb-4">
                <Gift className="w-6 h-6 text-emerald-500" />
                <span className="text-lg font-semibold text-slate-900 dark:text-white">
                  Get the Complete Free PDF Guide
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Answer a quick 30-second survey about your trip and download the full guide with all 70+ free locations, printable maps, and insider tips.
              </p>
              <Button 
                size="lg"
                onClick={() => setShowQuestionnaire(true)}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-10 py-6 text-lg rounded-full shadow-xl shadow-cyan-500/25"
                data-testid="button-start-survey"
              >
                <FileText className="w-5 h-5 mr-2" />
                Start Survey & Get Free Guide
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              {heroStats.map((stat, index) => (
                <div key={index} className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-5 rounded-2xl shadow-xl border border-white/50 dark:border-slate-700/50">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg mx-auto mb-2">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Preview Beaches Section */}
      <section ref={beachesRef} className="py-20" data-testid="section-beaches">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 border-0 mb-4">
              <Waves className="w-4 h-4 mr-2" />
              Preview: 2 of 7 Beaches
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              The FREE Beaches of Dubai
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Here's a taste of what's in the full guide. Complete the survey to unlock all 7 beaches with detailed tips.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {previewBeaches.map((beach, index) => (
              <motion.div
                key={beach.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group overflow-hidden border-0 shadow-xl">
                  <div className="relative h-64 overflow-hidden">
                    <img src={beach.image} alt={beach.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-1">{beach.name}</h3>
                      <p className="text-cyan-200">{beach.subtitle}</p>
                    </div>
                    <Badge className="absolute top-4 right-4 bg-emerald-500/90 text-white border-0">FREE</Badge>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {beach.features.map((f) => (
                        <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <Wallet className="w-4 h-4" />
                      Save {beach.savings}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Locked Content Teaser */}
          <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <Lock className="w-6 h-6 text-slate-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">5 more beaches waiting for you</p>
                <p className="text-sm text-slate-500">Including secret Black Palace Beach and family-friendly La Mer</p>
              </div>
            </div>
            <Button onClick={() => setShowQuestionnaire(true)} className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full">
              Unlock Full Guide
            </Button>
          </div>
        </div>
      </section>

      {/* Flamingo Highlight - Visual Section */}
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
                natural habitat—completely free. Three viewing hides with free binoculars, 
                just 15 minutes from Downtown Dubai.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {["Free Entry", "Free Binoculars", "Free Parking", "170+ Bird Species"].map((item) => (
                  <div key={item} className="flex items-center gap-2 bg-white/20 backdrop-blur-xl px-4 py-3 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <Button onClick={() => setShowQuestionnaire(true)} size="lg" className="bg-white text-rose-600 hover:bg-white/90 px-10 py-6 text-lg rounded-full shadow-xl">
                <Download className="w-5 h-5 mr-2" />
                Get Full Location Guide
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl transform rotate-3" />
              <img src="https://images.unsplash.com/photo-1497206365907-f5e630693df0?w=800" alt="Flamingos at Ras Al Khor" className="relative rounded-3xl shadow-2xl" />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl">
                <div className="text-3xl font-bold text-rose-500">500+</div>
                <div className="text-sm text-slate-500">Flamingos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dubai Fountain - Visual Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" data-testid="section-fountain">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 md:order-1">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl transform -rotate-3" />
              <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800" alt="Dubai Fountain" className="relative rounded-3xl shadow-2xl" />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl">
                <div className="text-3xl font-bold text-indigo-500">22,000</div>
                <div className="text-sm text-slate-500">Gallons/Show</div>
              </div>
            </div>
            <div className="text-white order-1 md:order-2">
              <Badge className="bg-white/20 text-white border-0 mb-6 px-4 py-2">
                <Music className="w-5 h-5 mr-2" />
                World's Largest
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                The Dubai Fountain
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                22,000 gallons of water shooting 140 meters high, choreographed to music.
                Shows run every 30 minutes from 6pm-11pm. The best free show in Dubai.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {["140m Water Jets", "Every 30 Minutes", "6pm - 11pm Daily", "Free Lakeside Views"].map((item) => (
                  <div key={item} className="flex items-center gap-2 bg-white/20 backdrop-blur-xl px-4 py-3 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <Button onClick={() => setShowQuestionnaire(true)} size="lg" className="bg-white text-indigo-600 hover:bg-white/90 px-10 py-6 text-lg rounded-full shadow-xl">
                <MapPin className="w-5 h-5 mr-2" />
                Get Best Viewing Spots
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Abra Ride - Visual Section */}
      <section className="py-24 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" data-testid="section-abra">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <Badge className="bg-white/20 text-white border-0 mb-6 px-4 py-2">
                <Ship className="w-5 h-5 mr-2" />
                World's Cheapest
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                AED 1 Abra Ride
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Cross Dubai Creek on a traditional wooden abra boat for just AED 1. 
                Dubai's oldest form of public transport, connecting Deira to Bur Dubai 
                since the 1800s.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {["Only AED 1", "5am - Midnight", "No Booking Needed", "Authentic Experience"].map((item) => (
                  <div key={item} className="flex items-center gap-2 bg-white/20 backdrop-blur-xl px-4 py-3 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <Button onClick={() => setShowQuestionnaire(true)} size="lg" className="bg-white text-amber-600 hover:bg-white/90 px-10 py-6 text-lg rounded-full shadow-xl">
                <Download className="w-5 h-5 mr-2" />
                Get Creek Walking Tour
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl transform rotate-3" />
              <img src="https://images.unsplash.com/photo-1534551767192-78b8dd45b51b?w=800" alt="Abra Boat Dubai Creek" className="relative rounded-3xl shadow-2xl" />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl">
                <div className="text-3xl font-bold text-amber-500">AED 1</div>
                <div className="text-sm text-slate-500">Per Crossing</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Attractions */}
      <section ref={attractionsRef} className="py-20 bg-slate-50 dark:bg-slate-800/50" data-testid="section-attractions">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-0 mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Preview: 4 of 70+ Activities
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Free Skyline Experiences
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {previewAttractions.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg">
                  <CardContent className="p-5 text-center">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{item.desc}</p>
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                      Save {item.savings}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Locked Categories */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">
              <Lock className="w-5 h-5 inline mr-2" />
              Full Guide Includes All Categories
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              {lockedCategories.map((cat) => (
                <div key={cat.title} className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-xl opacity-60">
                  <cat.icon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <div className="font-medium text-slate-600 dark:text-slate-300 text-sm">{cat.title}</div>
                  <div className="text-xs text-slate-400">{cat.count}</div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Button onClick={() => setShowQuestionnaire(true)} className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 rounded-full">
                <FileText className="w-4 h-4 mr-2" />
                Complete Survey to Unlock All
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Itinerary Preview */}
      <section ref={itineraryRef} className="py-20" data-testid="section-itinerary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 mb-4">
              <Clock className="w-4 h-4 mr-2" />
              Preview: Day 1 of 4
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Your Free Dubai Itinerary
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              The full guide includes 4 complete themed days covering all of Dubai
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {dayOnePreview.map((item, index) => (
              <motion.div
                key={item.time}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shrink-0">
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <Badge variant="outline" className="font-mono mb-1">{item.time}</Badge>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.activity}</h3>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">FREE</Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                <Lock className="w-6 h-6 text-slate-500" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">3 more complete days in the full guide</p>
                <p className="text-sm text-slate-500">Heritage Day, Modern Icons Day, Nature & Wildlife Day</p>
              </div>
            </div>
            <Button onClick={() => setShowQuestionnaire(true)} className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-full">
              Get Full Itinerary
            </Button>
          </div>
        </div>
      </section>

      {/* Transportation Tips Visual */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600" data-testid="section-transport">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-white">
          <Train className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Getting Around Dubai Cheap
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            The full guide includes complete metro routes, bus tips, and the cheapest ways to reach every free attraction.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-10">
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
          <Button onClick={() => setShowQuestionnaire(true)} size="lg" className="bg-white text-blue-600 hover:bg-white/90 px-10 py-6 text-lg rounded-full shadow-xl">
            <Download className="w-5 h-5 mr-2" />
            Download Transport Guide
          </Button>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
            </div>
            
            <CardContent className="relative p-10 md:p-14 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
                <FileText className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Get Your Complete Free Guide
              </h2>
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8">
                Complete a quick 30-second survey and instantly download the full PDF with all 70+ locations, 
                printable maps, 4-day itineraries, and money-saving tips.
              </p>
              
              <Button 
                size="lg"
                onClick={() => setShowQuestionnaire(true)}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-12 py-7 text-xl rounded-full shadow-xl shadow-cyan-500/25"
                data-testid="button-final-cta"
              >
                <Gift className="w-6 h-6 mr-2" />
                Start Survey & Get Free Guide
              </Button>
              
              <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  70+ Free Locations
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Printable Maps
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Metro Routes
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Instant Download
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Questionnaire Dialog */}
      <Dialog open={showQuestionnaire} onOpenChange={setShowQuestionnaire}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              {formSubmitted ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  Your Guide is Ready!
                </>
              ) : (
                <>
                  <FileText className="w-6 h-6 text-emerald-500" />
                  Quick Travel Survey
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          {formSubmitted ? (
            <div className="text-center py-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center mx-auto mb-6">
                <Download className="w-10 h-10 text-white" />
              </div>
              <p className="text-lg mb-6">Thank you! Your complete Dubai Free Guide is ready.</p>
              <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-6 text-lg rounded-full">
                <Download className="w-5 h-5 mr-2" />
                Download PDF Guide
              </Button>
              <p className="text-sm text-slate-500 mt-4">We've also sent a copy to {formData.email}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Progress */}
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 h-2 rounded-full ${formStep >= step ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                {formStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <p className="text-sm text-slate-500">Step 1 of 3: Your Details</p>
                    <div>
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="mt-1"
                      />
                    </div>
                    <Button
                      onClick={() => setFormStep(2)}
                      disabled={!isStep1Valid}
                      className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
                    >
                      Continue
                    </Button>
                  </motion.div>
                )}

                {formStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <p className="text-sm text-slate-500">Step 2 of 3: Your Trip</p>
                    <div>
                      <Label>When are you visiting Dubai?</Label>
                      <Select value={formData.travelMonth} onValueChange={(v) => setFormData({ ...formData, travelMonth: v })}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Not sure yet"].map((m) => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>How long is your trip?</Label>
                      <Select value={formData.travelDuration} onValueChange={(v) => setFormData({ ...formData, travelDuration: v })}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {["1-3 days", "4-7 days", "1-2 weeks", "2+ weeks", "I live in Dubai"].map((d) => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Who are you traveling with?</Label>
                      <Select value={formData.travelWith} onValueChange={(v) => setFormData({ ...formData, travelWith: v })}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Solo", "Partner", "Family with kids", "Friends", "Business trip"].map((w) => (
                            <SelectItem key={w} value={w}>{w}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setFormStep(1)} className="flex-1">Back</Button>
                      <Button
                        onClick={() => setFormStep(3)}
                        disabled={!isStep2Valid}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
                      >
                        Continue
                      </Button>
                    </div>
                  </motion.div>
                )}

                {formStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <p className="text-sm text-slate-500">Step 3 of 3: Your Interests</p>
                    <div>
                      <Label>What interests you most? (Select all that apply)</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {["Beaches", "Culture & Heritage", "Modern Architecture", "Nature & Wildlife", "Photography", "Food & Dining", "Shopping", "Nightlife"].map((interest) => (
                          <Button
                            key={interest}
                            type="button"
                            variant={formData.interests.includes(interest) ? "default" : "outline"}
                            className={formData.interests.includes(interest) ? "bg-emerald-500 text-white" : ""}
                            onClick={() => handleInterestToggle(interest)}
                            size="sm"
                          >
                            {interest}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="terms"
                          checked={formData.agreeTerms}
                          onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked === true })}
                        />
                        <label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400 leading-tight">
                          I agree to the <Link href="/terms" className="text-emerald-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</Link>
                        </label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="marketing"
                          checked={formData.agreeMarketing}
                          onCheckedChange={(checked) => setFormData({ ...formData, agreeMarketing: checked === true })}
                        />
                        <label htmlFor="marketing" className="text-sm text-slate-600 dark:text-slate-400 leading-tight">
                          Send me travel tips and exclusive Dubai deals (optional)
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setFormStep(2)} className="flex-1">Back</Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={!isStep3Valid}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Get My Free Guide
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <PublicFooter />
    </div>
  );
}
