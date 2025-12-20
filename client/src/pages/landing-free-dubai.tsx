import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Waves, MapPin, Camera, Sparkles, Sun, Bird, Clock, 
  ChevronRight, Star, Download, Mail, ArrowRight, 
  Umbrella, TreePalm, Mountain, Building2, Music, Heart,
  Users, Wallet, Trophy, CheckCircle2, Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";

// Free beaches data
const freeBeaches = [
  {
    name: "JBR Beach",
    subtitle: "Dubai's Crown Jewel",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
    features: ["Blue Flag Certified", "Free Showers", "24/7 Lifeguards", "Ain Dubai Views"],
    savings: "AED 150-500/day",
    bestTime: "7am-10am or 5pm-8pm"
  },
  {
    name: "Kite Beach",
    subtitle: "The Active Paradise",
    image: "https://images.unsplash.com/photo-1533827432537-70133748f5c8?w=800",
    features: ["14km Running Track", "Beach Volleyball", "Free Library", "Burj Al Arab Views"],
    savings: "AED 200+/day",
    bestTime: "Sunrise or Sunset"
  },
  {
    name: "La Mer Beach",
    subtitle: "Instagram Paradise",
    image: "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800",
    features: ["50+ Street Art Murals", "Calm Waters", "Kid Friendly", "Splash Pads"],
    savings: "AED 100+/day",
    bestTime: "Late Afternoon"
  },
  {
    name: "Sunset Beach",
    subtitle: "Photographer's Dream",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800",
    features: ["Burj Al Arab Close-Up", "Night Swimming", "Surfer Favorite", "Free Parking"],
    savings: "AED 150+/day",
    bestTime: "Golden Hour"
  }
];

// Free skyline experiences
const freeViews = [
  {
    name: "Dubai Fountain",
    icon: Music,
    description: "World's largest choreographed fountain - 22,000 gallons shooting 140m high",
    schedule: "Every 30 min, 6pm-11pm",
    savings: "AED 149-379"
  },
  {
    name: "Dubai Marina Walk",
    icon: Building2,
    description: "7km palm-lined promenade with 200+ illuminated skyscrapers",
    schedule: "24/7, Best 6pm-10pm",
    savings: "AED 200+"
  },
  {
    name: "Palm Boardwalk",
    icon: TreePalm,
    description: "11km encircling Palm Jumeirah with Atlantis & Arabian Gulf views",
    schedule: "24/7, Illuminated until midnight",
    savings: "AED 1,295"
  },
  {
    name: "Dubai Canal Walk",
    icon: Waves,
    description: "6.4km waterfront with mechanical waterfall & Tolerance Bridge",
    schedule: "Waterfall shows 8pm-10pm",
    savings: "AED 100+"
  }
];

// Daily itinerary
const freeItinerary = [
  { time: "8:00 AM", activity: "Sunrise Jog", location: "Zabeel Park", icon: Sun, color: "from-yellow-500 to-orange-500" },
  { time: "10:00 AM", activity: "Heritage Walk", location: "Al Fahidi District", icon: Building2, color: "from-amber-500 to-yellow-500" },
  { time: "11:30 AM", activity: "Traditional Souks", location: "Gold & Spice Souk", icon: Sparkles, color: "from-purple-500 to-pink-500" },
  { time: "4:00 PM", activity: "Dubai Mall Walk", location: "Free Aquarium View", icon: Camera, color: "from-blue-500 to-cyan-500" },
  { time: "6:00 PM", activity: "Fountain Shows", location: "Dubai Fountain", icon: Music, color: "from-indigo-500 to-purple-500" },
  { time: "9:00 PM", activity: "Marina Stroll", location: "Dubai Marina", icon: Star, color: "from-pink-500 to-rose-500" },
];

// Stats
const heroStats = [
  { icon: Wallet, value: "AED 2,500+", label: "Save Per Week" },
  { icon: Waves, value: "7", label: "Free Beaches" },
  { icon: Sparkles, value: "70+", label: "Free Activities" },
];

export default function LandingFreeDubai() {
  const [email, setEmail] = useState("");

  useDocumentMeta({
    title: "70+ Free Things to Do in Dubai 2025 - Save AED 2,500+ Every Week",
    description: "Dubai on AED 0: 7 free beaches, 500 flamingos, AED 1 abra rides, 11km Palm boardwalk, nightly fountain shows. Complete guide to free Dubai experiences from JBR Beach to Gold Souk.",
    ogType: "article"
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[10%] w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl" />
          <div className="absolute top-40 right-[15%] w-96 h-96 bg-blue-400/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-t from-white dark:from-slate-900 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/" className="hover:text-primary transition-colors" data-testid="link-home">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 dark:text-white font-medium">Free Things to Do</span>
          </div>

          {/* Main Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-0 px-4 py-2 text-sm mb-6">
                <Trophy className="w-4 h-4 mr-2" />
                2025 Ultimate Free Guide
              </Badge>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight"
            >
              Dubai Costs{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500">
                AED 0
              </span>
              <br />
              <span className="text-3xl sm:text-4xl md:text-5xl text-slate-600 dark:text-slate-300">
                If You Know Where to Look
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              While tourists pay AED 500+ daily, smart travelers explore 7 pristine beaches, 
              watch 500 flamingos at sunset, ride abras for AED 1, and witness the world's 
              largest fountain show—<strong className="text-slate-900 dark:text-white">all completely free.</strong>
            </motion.p>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4 mb-10"
            >
              {heroStats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-lg shadow-cyan-500/10 border border-white/50 dark:border-slate-700/50"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm text-slate-500">{stat.label}</div>
                  </div>
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
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-cyan-500/25"
                data-testid="button-download-map"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Free Map
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-6 text-lg rounded-full"
                data-testid="button-view-itinerary"
              >
                <Play className="w-5 h-5 mr-2" />
                View Full Itinerary
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Free Beaches Section */}
      <section className="py-20 relative" data-testid="section-beaches">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400 border-0 mb-4">
              <Waves className="w-4 h-4 mr-2" />
              Better Than Maldives
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              The 7 FREE Beaches
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Blue Flag-certified, completely free, with lifeguards and views rivaling the world's most expensive resorts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {freeBeaches.map((beach, index) => (
              <motion.div
                key={beach.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group overflow-hidden border-0 shadow-xl shadow-cyan-500/5 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={beach.image} 
                      alt={beach.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">{beach.name}</h3>
                      <p className="text-cyan-200 text-sm">{beach.subtitle}</p>
                    </div>
                    <Badge className="absolute top-4 right-4 bg-emerald-500/90 text-white border-0">
                      FREE
                    </Badge>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {beach.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <Wallet className="w-4 h-4" />
                        Save {beach.savings}
                      </div>
                      <div className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-4 h-4" />
                        {beach.bestTime}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Savings Calculator */}
          <div className="mt-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl p-8 md:p-12 text-center text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">Beach Savings Calculator</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4">
                <div className="text-3xl font-bold">AED 0</div>
                <div className="text-sm text-white/80">Free Beach Cost</div>
              </div>
              <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4">
                <div className="text-3xl font-bold">AED 350</div>
                <div className="text-sm text-white/80">Beach Club Avg</div>
              </div>
              <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4">
                <div className="text-3xl font-bold">AED 2,450</div>
                <div className="text-sm text-white/80">Weekly Savings</div>
              </div>
              <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4">
                <div className="text-3xl font-bold">AED 9,800</div>
                <div className="text-sm text-white/80">Monthly Savings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Skyline Views */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800/50" data-testid="section-skyline">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-0 mb-4">
              <Camera className="w-4 h-4 mr-2" />
              AED 0 Skyline
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Views Worth AED 1,000+
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Experience Dubai's most spectacular sights without spending a dirham
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {freeViews.map((view, index) => (
              <motion.div
                key={view.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardContent className="p-6 flex gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 shadow-lg">
                      <view.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{view.name}</h3>
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                          Save {view.savings}
                        </Badge>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mb-3">{view.description}</p>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="w-4 h-4" />
                        {view.schedule}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Perfect Free Day Itinerary */}
      <section className="py-20 relative overflow-hidden" data-testid="section-itinerary">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50/30 to-white dark:from-slate-900 dark:via-purple-900/10 dark:to-slate-900" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 mb-4">
              <Clock className="w-4 h-4 mr-2" />
              Your Perfect Day
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              The AED 0 Day Itinerary
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              A full day of world-class experiences. Total cost: AED 0 (plus lunch!)
            </p>
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-rose-500 hidden md:block" />
            
            {freeItinerary.map((item, index) => (
              <motion.div
                key={item.time}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative flex gap-6 mb-8 last:mb-0"
              >
                {/* Timeline dot */}
                <div className={`hidden md:flex w-16 h-16 rounded-full bg-gradient-to-br ${item.color} items-center justify-center shrink-0 shadow-lg z-10`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                
                {/* Content */}
                <Card className="flex-1 border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`md:hidden w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="font-mono">{item.time}</Badge>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.activity}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <MapPin className="w-4 h-4" />
                          {item.location}
                        </div>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0">
                        FREE
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Daily Total */}
          <div className="mt-12 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-700 rounded-3xl p-8 text-center text-white max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="text-4xl font-bold text-emerald-400">AED 0</div>
                <div className="text-slate-400">Total Activities Cost</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-rose-400">AED 500+</div>
                <div className="text-slate-400">Tourist Typical Day</div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-700">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Save AED 3,500+/Week
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flamingo Highlight */}
      <section className="py-20 bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500" data-testid="section-flamingos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <Badge className="bg-white/20 text-white border-0 mb-6">
                <Bird className="w-4 h-4 mr-2" />
                Dubai's Hidden Gem
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                500 Flamingos at Sunset
              </h2>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                At Ras Al Khor Wildlife Sanctuary, watch over 500 Greater Flamingos in their 
                natural habitat—completely free. Three public viewing hides with free binoculars, 
                just 15 minutes from Downtown Dubai.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                {["Free Entry", "Free Binoculars", "Free Parking", "170+ Bird Species"].map((item) => (
                  <div key={item} className="flex items-center gap-2 bg-white/20 backdrop-blur-xl px-4 py-2 rounded-full">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" className="bg-white text-rose-600 hover:bg-white/90 px-8 py-6 text-lg rounded-full">
                Get Directions
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl transform rotate-3" />
              <img 
                src="https://images.unsplash.com/photo-1497206365907-f5e630693df0?w=800" 
                alt="Flamingos at Ras Al Khor"
                className="relative rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <section className="py-20" data-testid="section-email">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="text-center mb-8">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-400/30 mb-4">
                  <Download className="w-4 h-4 mr-2" />
                  Free Download
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Download Your Free Dubai Map
                </h2>
                <p className="text-lg text-slate-400 max-w-xl mx-auto">
                  All 70 free locations marked, metro routes included, best times to visit. 
                  Plus bonus real estate consultation worth AED 500.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                <div className="flex-1">
                  <Input 
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 h-14 text-lg"
                    data-testid="input-email"
                  />
                </div>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white h-14 px-8 text-lg"
                  data-testid="button-get-map"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Get Instant Access
                </Button>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  70 Free Locations
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Metro Routes
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  No Spam, Ever
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
