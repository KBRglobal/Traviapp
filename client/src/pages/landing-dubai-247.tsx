import { useRef } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  ChevronRight, Clock, Building2, ShoppingBag, Utensils, 
  Dumbbell, Car, Pill, Home, Briefcase, Coffee, 
  Moon, Sun, Store, CreditCard, Fuel, Shirt,
  MapPin, Phone, Star, CheckCircle2, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";

const heroStats = [
  { icon: Store, value: "50+", label: "24/7 Stores" },
  { icon: Utensils, value: "100+", label: "All-Night Dining" },
  { icon: Dumbbell, value: "30+", label: "24-Hour Gyms" },
  { icon: Pill, value: "40+", label: "Night Pharmacies" },
];

const discountStores = [
  { 
    name: "Day to Day", 
    desc: "Dubai's most popular discount chain since 1998. Clothing, footwear, electronics, household items.", 
    locations: [
      { area: "Al Quoz", hours: "24/7", note: "Near OnPassive Metro" },
      { area: "Al Raffa Tower", hours: "24/7", note: "Sheikh Sabah Al Ahmad Street" },
    ],
    extendedHours: ["Deira (until 01:30)", "Bur Dubai (until 01:30)", "Al Karama (until 01:30)"]
  },
  { 
    name: "Al Kabayel", 
    desc: "Established 1997. Known for branded perfumes, electrical appliances, kitchenware, gadgets.", 
    locations: [
      { area: "Deira", hours: "24/7", note: "Opposite Hamrain Centre" },
      { area: "Al Warqaa 2", hours: "24/7", note: "5, 8c Street" },
    ],
    tip: "Deira branch spans 2 massive floors. Visit at night to avoid crowds."
  },
];

const supermarkets = [
  { name: "ZOOM (ENOC)", branches: "245+", locations: ["Oud Metha", "Business Bay", "JLT", "Dubai Marina", "ENOC stations"], services: "Food, beverages, bill payments (DEWA, Etisalat)" },
  { name: "Carrefour", branches: "10+", locations: ["Mirdif City Centre", "Ibn Battuta Mall", "Mall of the Emirates"], services: "Full supermarket, pharmacy, electronics" },
  { name: "Spinneys", branches: "5+", locations: ["Motor City", "JLT", "The Greens"], services: "Premium groceries, fresh bakery" },
  { name: "Lulu Express", branches: "20+", locations: ["Al Nahda", "Qusais", "Karama", "Bur Dubai"], services: "Groceries, household, fresh produce" },
];

const pharmacies = [
  { name: "Aster Pharmacy", branches: "40+", note: "Largest 24/7 pharmacy network in UAE", phone: "04-xxx-xxxx" },
  { name: "Life Pharmacy", branches: "30+", note: "Available at major malls and hospitals", phone: "04-xxx-xxxx" },
  { name: "SuperCare Pharmacy", branches: "15+", note: "Premium locations, delivery available", phone: "04-xxx-xxxx" },
  { name: "Bin Sina Pharmacy", branches: "10+", note: "Hospital-connected pharmacies", phone: "04-xxx-xxxx" },
];

const restaurants = [
  { name: "McDonald's", type: "Fast Food", locations: "100+ locations", note: "Drive-through 24/7" },
  { name: "Ravi Restaurant", type: "Pakistani", locations: "Satwa", note: "Dubai institution since 1978" },
  { name: "Bu Qtair", type: "Seafood", locations: "Jumeirah", note: "Famous fish shack, late night" },
  { name: "Al Mallah", type: "Lebanese", locations: "Al Dhiyafa Road", note: "Legendary shawarma spot" },
  { name: "KFC", type: "Fast Food", locations: "80+ locations", note: "24/7 drive-through" },
  { name: "Subway", type: "Sandwiches", locations: "60+ locations", note: "Most branches 24/7" },
];

const gyms = [
  { name: "Fitness First", branches: "20+", locations: ["Marina", "DIFC", "JBR", "Downtown"], amenities: "Full gym, pools, classes" },
  { name: "GymNation", branches: "15+", locations: ["Al Quoz", "JVC", "Silicon Oasis"], amenities: "Budget-friendly, 24/7 access" },
  { name: "Fitness 360", branches: "8+", locations: ["Business Bay", "JLT"], amenities: "Ladies-only sections, personal training" },
];

const gasStations = [
  { name: "ENOC/EPPCO", count: "200+", note: "Includes ZOOM convenience stores, car wash, cafe" },
  { name: "ADNOC", count: "50+", note: "Major highways, some with restaurants" },
  { name: "Emirates Petroleum", count: "30+", note: "Selected locations in residential areas" },
];

const laundryServices = [
  { name: "Champion Cleaners", type: "Premium", note: "24/7 drop-off/pick-up at select locations" },
  { name: "Laundrybox", type: "Self-Service", note: "24/7 automated lockers across Dubai" },
  { name: "Washmen", type: "App-based", note: "24/7 pickup scheduling, next-day delivery" },
];

const realEstateServices = [
  { title: "Property Viewings at Any Hour", desc: "Schedule apartment tours at 11 PM, 2 AM, or sunrise" },
  { title: "Virtual Tours 24/7", desc: "Browse properties online with instant video calls" },
  { title: "Investment Consultations", desc: "Speak with experts regardless of your timezone" },
  { title: "Documentation Processing", desc: "Submit applications, review contracts at night" },
];

const businessSetup = [
  { type: "Free Zone LLC", timeline: "3-5 days", cost: "AED 15K-25K" },
  { type: "Mainland LLC", timeline: "5-10 days", cost: "AED 12K-20K" },
  { type: "Offshore Company", timeline: "2-3 days", cost: "AED 20K-35K" },
  { type: "DIFC/ADGM", timeline: "14-30 days", cost: "AED 50K-150K" },
];

export default function LandingDubai247() {
  const storesRef = useRef<HTMLDivElement>(null);
  const diningRef = useRef<HTMLDivElement>(null);

  useDocumentMeta({
    title: "24/7 Dubai Guide - 50+ Places Open All Night | Restaurants, Supermarkets, Gyms",
    description: "Complete guide to Dubai's 24-hour scene: discount stores (Day to Day, Al Kabayel), supermarkets, pharmacies, restaurants, gyms, gas stations, laundry services. Never sleep in the city that never stops.",
    ogType: "article"
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-[10%] w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
          <div className="absolute top-40 right-[15%] w-[500px] h-[500px] bg-purple-400/15 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
            <Link href="/" className="hover:text-indigo-600 transition-colors" data-testid="link-home">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/dubai" className="hover:text-indigo-600 transition-colors" data-testid="link-dubai">Dubai</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 dark:text-white font-medium">24/7 Guide</span>
          </div>

          <div className="text-center max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 px-6 py-2.5 text-base mb-8">
                <Moon className="w-5 h-5 mr-2" />
                The City That Never Sleeps
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6"
            >
              Dubai{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                24/7
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto"
            >
              Complete guide to everything open around the clock. From discount stores to 5-star dining, gyms to real estate services.
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
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow mx-auto mb-2">
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-3 justify-center"
            >
              <Button variant="outline" size="sm" onClick={() => storesRef.current?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-nav-stores">
                <Store className="w-4 h-4 mr-2" />
                Discount Stores
              </Button>
              <Button variant="outline" size="sm" onClick={() => diningRef.current?.scrollIntoView({ behavior: 'smooth' })} data-testid="button-nav-dining">
                <Utensils className="w-4 h-4 mr-2" />
                All-Night Dining
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Real Estate 24/7 */}
      <section className="py-20 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/5 dark:via-purple-500/5 dark:to-pink-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 mb-4">
              <Building2 className="w-4 h-4 mr-1" />
              Property Services 24/7
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Real Estate Never Sleeps
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Dubai's property market operates around the clock to serve international investors across all time zones
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {realEstateServices.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm"
              >
                <CheckCircle2 className="w-6 h-6 text-indigo-500 mb-3" />
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/dubai-off-plan-properties">
              <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-500" data-testid="button-free-consultation">
                <Home className="w-5 h-5 mr-2" />
                Free 24/7 Real Estate Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Discount Stores */}
      <section ref={storesRef} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 mb-4">
              <ShoppingBag className="w-4 h-4 mr-1" />
              Discount Stores
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              24/7 Discount Shopping
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {discountStores.map((store, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{store.name}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">{store.desc}</p>
                    
                    <div className="space-y-2 mb-4">
                      {store.locations.map((loc, i) => (
                        <div key={i} className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg">
                          <div>
                            <span className="font-medium text-slate-900 dark:text-white">{loc.area}</span>
                            <span className="text-sm text-slate-500 ml-2">{loc.note}</span>
                          </div>
                          <Badge className="bg-emerald-500 text-white">{loc.hours}</Badge>
                        </div>
                      ))}
                    </div>

                    {store.extendedHours && (
                      <p className="text-sm text-slate-500">
                        <span className="font-medium">Extended hours:</span> {store.extendedHours.join(", ")}
                      </p>
                    )}
                    {store.tip && (
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">
                        <Sparkles className="w-4 h-4 inline mr-1" />
                        {store.tip}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Supermarkets */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 mb-4">
              <ShoppingBag className="w-4 h-4 mr-1" />
              Supermarkets
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              24/7 Grocery Shopping
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {supermarkets.map((store, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900 dark:text-white">{store.name}</h3>
                  <Badge variant="secondary">{store.branches}</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{store.services}</p>
                <p className="text-xs text-slate-500">{store.locations.slice(0, 3).join(", ")}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pharmacies */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 mb-4">
              <Pill className="w-4 h-4 mr-1" />
              Pharmacies
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              24/7 Pharmacies
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pharmacies.map((pharmacy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-rose-100 dark:border-rose-900/30"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-900 dark:text-white">{pharmacy.name}</h3>
                  <Badge className="bg-rose-500 text-white">{pharmacy.branches}</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{pharmacy.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All-Night Dining */}
      <section ref={diningRef} className="py-20 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 mb-4">
              <Utensils className="w-4 h-4 mr-1" />
              Dining
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              24/7 Restaurants
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {restaurants.map((restaurant, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                    <Utensils className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{restaurant.name}</h3>
                    <span className="text-xs text-slate-500">{restaurant.type}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{restaurant.locations}</p>
                <p className="text-sm text-orange-600 dark:text-orange-400">{restaurant.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 24/7 Gyms */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 mb-4">
              <Dumbbell className="w-4 h-4 mr-1" />
              Fitness
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              24/7 Gyms
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {gyms.map((gym, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover-elevate">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-slate-900 dark:text-white">{gym.name}</h3>
                      <Badge className="bg-purple-500 text-white">{gym.branches}</Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{gym.amenities}</p>
                    <p className="text-xs text-slate-500">{gym.locations.join(", ")}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gas Stations & Services */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Gas Stations */}
            <div>
              <Badge className="bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 mb-4">
                <Fuel className="w-4 h-4 mr-1" />
                Gas Stations
              </Badge>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">24/7 Fuel</h2>
              <div className="space-y-4">
                {gasStations.map((station, index) => (
                  <div key={index} className="bg-white dark:bg-slate-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900 dark:text-white">{station.name}</span>
                      <Badge variant="secondary">{station.count} stations</Badge>
                    </div>
                    <p className="text-sm text-slate-500">{station.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Laundry */}
            <div>
              <Badge className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 mb-4">
                <Shirt className="w-4 h-4 mr-1" />
                Laundry
              </Badge>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">24/7 Laundry</h2>
              <div className="space-y-4">
                {laundryServices.map((service, index) => (
                  <div key={index} className="bg-white dark:bg-slate-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900 dark:text-white">{service.name}</span>
                      <Badge variant="secondary">{service.type}</Badge>
                    </div>
                    <p className="text-sm text-slate-500">{service.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Setup */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 mb-4">
              <Briefcase className="w-4 h-4 mr-1" />
              Business Setup
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              24/7 Company Formation
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Launch your UAE business from anywhere in the world, at any hour
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {businessSetup.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm text-center"
              >
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.type}</h3>
                <div className="text-2xl font-bold text-amber-500 mb-1">{item.cost}</div>
                <p className="text-sm text-slate-500">{item.timeline}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Dubai Never Sleeps
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Whether it's 3 AM shopping, midnight property viewings, or sunrise gym sessions, Dubai is always open.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/attractions">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-white/90" data-testid="button-explore-dubai">
                <MapPin className="w-5 h-5 mr-2" />
                Explore Dubai
              </Button>
            </Link>
            <Link href="/dubai-off-plan-properties">
              <Button size="lg" variant="outline" className="border-white text-white bg-transparent hover:bg-white/10" data-testid="button-property-consultation">
                <Home className="w-5 h-5 mr-2" />
                Property Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
