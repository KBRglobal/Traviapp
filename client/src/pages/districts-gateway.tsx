import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { 
  MapPin, Building2, Star, ArrowRight, 
  Sparkles, Camera, Utensils,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import useEmblaCarousel from "embla-carousel-react";

// District data
const districts = [
  {
    id: "downtown-dubai",
    name: "Downtown Dubai",
    nameAr: "داون تاون دبي",
    tagline: "Dubai's Iconic Heart",
    description: "Home to Burj Khalifa, Dubai Mall & the mesmerizing Dubai Fountain. The world's most recognizable skyline.",
    highlights: ["Burj Khalifa", "Dubai Mall", "Dubai Fountain", "Dubai Opera"],
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
    gradient: "from-purple-600 via-pink-500 to-orange-400",
    available: true,
    stats: { attractions: 12, hotels: 25, restaurants: 200 },
    bestFor: ["First-timers", "Luxury", "Photography"],
  },
  {
    id: "dubai-marina",
    name: "Dubai Marina",
    nameAr: "دبي مارينا",
    tagline: "Waterfront Living",
    description: "A stunning waterfront community with yacht-lined promenades, beaches, and vibrant nightlife.",
    highlights: ["Marina Walk", "JBR Beach", "Ain Dubai", "Bluewaters"],
    image: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&h=600&fit=crop",
    gradient: "from-cyan-500 via-blue-500 to-purple-600",
    available: true,
    stats: { attractions: 8, hotels: 18, restaurants: 150 },
    bestFor: ["Beach lovers", "Nightlife", "Water sports"],
  },
  {
    id: "jbr-jumeirah-beach-residence",
    name: "JBR Beach",
    nameAr: "جي بي آر",
    tagline: "Ultimate Beach Destination",
    description: "Dubai's best public beach with 1.7km of pristine sand, water sports, and The Walk promenade.",
    highlights: ["Free Beach", "Splash Pad", "The Walk", "Water Sports"],
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
    gradient: "from-cyan-400 via-yellow-400 to-orange-400",
    available: true,
    stats: { attractions: 6, hotels: 12, restaurants: 100 },
    bestFor: ["Families", "Beach lovers", "Budget-friendly"],
  },
  {
    id: "palm-jumeirah",
    name: "Palm Jumeirah",
    nameAr: "نخلة جميرا",
    tagline: "The Eighth Wonder",
    description: "The world's largest man-made island, home to Atlantis and exclusive beachfront resorts.",
    highlights: ["Atlantis", "The View", "Beach Clubs", "Aquaventure"],
    image: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&h=600&fit=crop",
    gradient: "from-orange-400 via-pink-500 to-rose-500",
    available: true,
    stats: { attractions: 6, hotels: 12, restaurants: 80 },
    bestFor: ["Resort life", "Families", "Beach clubs"],
  },
  {
    id: "old-dubai",
    name: "Old Dubai",
    nameAr: "دبي القديمة",
    tagline: "Heritage & Tradition",
    description: "Discover the authentic soul of Dubai in the historic districts of Deira and Bur Dubai.",
    highlights: ["Gold Souk", "Spice Souk", "Abra Rides", "Al Fahidi"],
    image: "https://images.unsplash.com/photo-1534551767192-78b8dd45b51b?w=800&h=600&fit=crop",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    available: true,
    stats: { attractions: 10, hotels: 15, restaurants: 120 },
    bestFor: ["Culture", "History", "Souks"],
  },
  {
    id: "jumeirah",
    name: "Jumeirah",
    nameAr: "جميرا",
    tagline: "The Golden Mile",
    description: "Upscale coastal living with pristine beaches, luxury villas, and the iconic Burj Al Arab.",
    highlights: ["Burj Al Arab", "Madinat", "Kite Beach", "La Mer"],
    image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&h=600&fit=crop",
    gradient: "from-emerald-400 via-teal-500 to-cyan-500",
    available: true,
    stats: { attractions: 7, hotels: 20, restaurants: 100 },
    bestFor: ["Beach life", "Luxury", "Families"],
  },
  {
    id: "business-bay",
    name: "Business Bay",
    nameAr: "الخليج التجاري",
    tagline: "The New Downtown",
    description: "Dubai's thriving commercial hub with the stunning Dubai Canal and modern architecture.",
    highlights: ["Dubai Canal", "Marasi Drive", "JW Marriott", "Rooftop Bars"],
    image: "https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&h=600&fit=crop",
    gradient: "from-slate-600 via-purple-600 to-indigo-600",
    available: true,
    stats: { attractions: 5, hotels: 22, restaurants: 90 },
    bestFor: ["Business", "Modern luxury", "Dining"],
  },
  {
    id: "dubai-creek-harbour",
    name: "Dubai Creek Harbour",
    nameAr: "ميناء خور دبي",
    tagline: "Dubai's Future Skyline",
    description: "6 sq km mega-development by Emaar featuring the future world's tallest tower and 40+ km waterfront.",
    highlights: ["Creek Tower", "Flamingos", "Waterfront", "Smart City"],
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
    gradient: "from-cyan-500 via-teal-500 to-emerald-500",
    available: true,
    stats: { attractions: 5, hotels: 3, restaurants: 40 },
    bestFor: ["Investment", "Families", "Nature lovers"],
  },
  {
    id: "dubai-south",
    name: "Dubai South",
    nameAr: "دبي الجنوب",
    tagline: "Expo City & Airport Hub",
    description: "145 sq km mega-development featuring Expo City, world's largest airport, and Palm Jebel Ali.",
    highlights: ["Expo City", "DWC Airport", "Palm Jebel Ali", "Metro Connected"],
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop",
    gradient: "from-indigo-500 via-purple-500 to-pink-500",
    available: true,
    stats: { attractions: 4, hotels: 5, restaurants: 30 },
    bestFor: ["Budget living", "Abu Dhabi commuters", "Aviation"],
  },
  {
    id: "al-barsha",
    name: "Al Barsha & Barsha Heights",
    nameAr: "البرشاء",
    tagline: "Mall of Emirates & Family Hub",
    description: "Dubai's mid-range heartland with Mall of Emirates, Ski Dubai, and excellent family amenities.",
    highlights: ["Mall of Emirates", "Ski Dubai", "Metro Access", "Schools"],
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    available: true,
    stats: { attractions: 4, hotels: 15, restaurants: 300 },
    bestFor: ["Families", "Budget-conscious", "Shopping"],
  },
  {
    id: "difc",
    name: "DIFC",
    nameAr: "مركز دبي المالي العالمي",
    tagline: "Financial Hub & Fine Dining",
    description: "Middle East's Wall Street — 110 acres of finance, Gate Avenue dining, and contemporary art galleries.",
    highlights: ["Gate Avenue", "Art Galleries", "English Common Law", "Zuma/LPM"],
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
    gradient: "from-slate-500 via-slate-600 to-gray-700",
    available: true,
    stats: { attractions: 3, hotels: 2, restaurants: 50 },
    bestFor: ["Business", "Fine dining", "Art lovers"],
  },
  {
    id: "dubai-hills-estate",
    name: "Dubai Hills Estate",
    nameAr: "دبي هيلز استيت",
    tagline: "Golf, Mall & Family Living",
    description: "Emaar's 2,700-acre master-planned community with championship golf, mega mall, and 18 km Central Park.",
    highlights: ["Golf Course", "Dubai Hills Mall", "Central Park", "Schools"],
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=600&fit=crop",
    gradient: "from-emerald-500 via-green-500 to-teal-500",
    available: true,
    stats: { attractions: 3, hotels: 2, restaurants: 100 },
    bestFor: ["Families", "Golf", "Suburban living"],
  },
  {
    id: "jvc",
    name: "JVC (Jumeirah Village Circle)",
    nameAr: "قرية جميرا الدائرية",
    tagline: "Budget Living & Family Hub",
    description: "Dubai's best value neighborhood — 40-50% cheaper than Marina with modern apartments and community feel.",
    highlights: ["Circle Mall", "Affordable Rent", "Family-Friendly", "Central"],
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    available: true,
    stats: { attractions: 2, hotels: 3, restaurants: 80 },
    bestFor: ["Budget-conscious", "Families", "Young professionals"],
  },
  {
    id: "bluewaters-island",
    name: "Bluewaters Island",
    nameAr: "جزيرة بلووترز",
    tagline: "Beach, Dining & Ain Dubai",
    description: "Compact island destination with Caesars Palace, 50+ restaurants, beach access, and Marina views.",
    highlights: ["Ain Dubai (Closed)", "Caesars Palace", "The Wharf Dining", "Beach"],
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    available: true,
    stats: { attractions: 3, hotels: 2, restaurants: 50 },
    bestFor: ["Beach lovers", "Foodies", "Couples"],
  },
  {
    id: "international-city",
    name: "International City",
    nameAr: "المدينة العالمية",
    tagline: "Budget Living & Dragon Mart",
    description: "Dubai's most affordable neighborhood — 10 themed clusters, 120K+ residents, and Dragon Mart nearby.",
    highlights: ["Dragon Mart", "Lowest Rents", "10 Clusters", "Multicultural"],
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
    gradient: "from-red-500 via-rose-500 to-pink-500",
    available: true,
    stats: { attractions: 1, hotels: 0, restaurants: 200 },
    bestFor: ["Budget-conscious", "Long-term residents", "Wholesale shopping"],
  },
  {
    id: "al-karama",
    name: "Al Karama",
    nameAr: "الكرامة",
    tagline: "Authentic Food & Budget Shopping",
    description: "Dubai's most authentic neighborhood — 200+ restaurants, textiles, custom tailoring, 2 km from Burj Khalifa.",
    highlights: ["200+ Restaurants", "Textiles & Tailoring", "ADCB Metro", "AED 10 Meals"],
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    available: true,
    stats: { attractions: 3, hotels: 20, restaurants: 200 },
    bestFor: ["Food lovers", "Budget-conscious", "Authentic experience"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// Regular district card
function DistrictCard({ district, index }: { district: typeof districts[0]; index: number }) {
  const isAvailable = district.available;
  
  return (
    <motion.div
      variants={itemVariants}
      className={`relative group rounded-2xl overflow-hidden ${!isAvailable ? "opacity-80" : ""}`}
      data-testid={`card-district-${district.id}`}
    >
      <div className="relative aspect-[4/5]">
        {/* Background Image */}
        <img
          src={district.image}
          alt={district.name}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${isAvailable ? "group-hover:scale-105" : "grayscale-[30%]"}`}
        />
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${district.gradient} opacity-40 mix-blend-multiply`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        {/* Coming Soon Badge */}
        {!isAvailable && (
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-white/90 text-gray-800">
              Coming Soon
            </Badge>
          </div>
        )}
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <p className="text-white/60 text-xs font-medium mb-1">{district.nameAr}</p>
          <h3 className="text-2xl font-bold text-white mb-1">{district.name}</h3>
          <p className="text-white/80 text-sm mb-3">{district.tagline}</p>
          
          {/* Best For */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {district.bestFor.map((item) => (
              <span
                key={item}
                className="px-2 py-1 rounded-full bg-white/10 text-white/80 text-xs"
              >
                {item}
              </span>
            ))}
          </div>
          
          {isAvailable ? (
            <Link href={`/districts/${district.id}`}>
              <Button 
                variant="outline" 
                className="w-full border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20"
                data-testid={`button-view-${district.id}`}
              >
                View Guide <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <Button 
              variant="outline" 
              className="w-full border-white/20 text-white/60 bg-white/5 cursor-not-allowed"
              disabled
            >
              Coming Soon
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function DistrictsGateway() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);
  
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);
  
  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);
  
  // Auto-play carousel every 5 seconds
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);
  
  // Featured districts for carousel (top 6)
  const featuredDistricts = districts.slice(0, 6);
  const otherDistricts = districts.slice(6);
  
  return (
    <div className="min-h-screen bg-background">
      <PublicNav variant="transparent" />
      
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6443F4] via-[#F94498] to-[#FF9327] opacity-90" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920')] bg-cover bg-center mix-blend-overlay opacity-30" />
          
          {/* Animated Orbs */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-white/10 blur-3xl"
            animate={{ 
              x: [0, 50, 0], 
              y: [0, -30, 0],
              scale: [1, 1.1, 1] 
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-pink-500/20 blur-3xl"
            animate={{ 
              x: [0, -40, 0], 
              y: [0, 40, 0],
              scale: [1, 1.2, 1] 
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-white/20 text-white border-white/30 mb-6 text-sm px-4 py-1.5">
              <MapPin className="w-4 h-4 mr-2" />
              Your Gateway to Dubai
            </Badge>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
              Discover Dubai's
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-200 to-orange-200">
                Districts
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed">
              From the soaring Burj Khalifa to the golden sands of Palm Jumeirah, 
              each district tells a unique story of Dubai's remarkable transformation.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-[#6443F4] hover:bg-white/90 gap-2 text-lg px-8 py-6 font-semibold"
                data-testid="button-explore-all"
                onClick={() => document.getElementById('featured')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Sparkles className="w-5 h-5" />
                Explore All Districts
              </Button>
            </div>
          </motion.div>
          
          {/* Stats - Dynamically calculated */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16"
          >
            {[
              { icon: MapPin, value: `${districts.length}`, label: "Districts" },
              { icon: Camera, value: `${districts.reduce((sum, d) => sum + d.stats.attractions, 0)}+`, label: "Attractions" },
              { icon: Building2, value: `${districts.reduce((sum, d) => sum + d.stats.hotels, 0)}+`, label: "Hotels" },
              { icon: Utensils, value: `${districts.reduce((sum, d) => sum + d.stats.restaurants, 0)}+`, label: "Restaurants" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-6 h-6 text-white/60 mx-auto mb-2" />
                <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>
      
      {/* Featured Districts Carousel */}
      <section id="featured" className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <Badge className="bg-[#6443F4]/10 text-[#6443F4] border-[#6443F4]/30 mb-4">
              <Star className="w-3 h-3 mr-1" /> Featured Districts
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Top Destinations</h2>
            <p className="text-muted-foreground">Swipe or use arrows to explore</p>
          </motion.div>
          
          {/* Carousel */}
          <div className="relative">
            {/* Navigation Arrows */}
            <Button
              size="icon"
              variant="outline"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-background/90 backdrop-blur border-border hidden md:flex"
              onClick={scrollPrev}
              data-testid="button-carousel-prev"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-background/90 backdrop-blur border-border hidden md:flex"
              onClick={scrollNext}
              data-testid="button-carousel-next"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
            
            {/* Embla Carousel */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4">
                {featuredDistricts.map((district, index) => (
                  <div 
                    key={district.id} 
                    className="flex-[0_0_85%] sm:flex-[0_0_45%] md:flex-[0_0_calc(33.33%-16px)] min-w-0"
                  >
                    <Link href={`/districts/${district.id}`}>
                      <div 
                        className="relative rounded-2xl overflow-hidden group cursor-pointer"
                        data-testid={`carousel-card-${district.id}`}
                      >
                        <div className="aspect-[4/5] relative">
                          <img
                            src={district.image}
                            alt={district.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-br ${district.gradient} opacity-50 mix-blend-multiply`} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                          
                          {/* Content */}
                          <div className="absolute bottom-0 left-0 right-0 p-5">
                            <p className="text-white/60 text-xs font-medium mb-1">{district.nameAr}</p>
                            <h3 className="text-2xl font-bold text-white mb-1">{district.name}</h3>
                            <p className="text-white/80 text-sm mb-3">{district.tagline}</p>
                            
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {district.bestFor.slice(0, 2).map((item) => (
                                <span
                                  key={item}
                                  className="px-2 py-1 rounded-full bg-white/10 text-white/80 text-xs"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex items-center gap-3 text-white/70 text-xs">
                              <span className="flex items-center gap-1">
                                <Camera className="w-3 h-3" /> {district.stats.attractions}
                              </span>
                              <span className="flex items-center gap-1">
                                <Building2 className="w-3 h-3" /> {district.stats.hotels}
                              </span>
                              <span className="flex items-center gap-1">
                                <Utensils className="w-3 h-3" /> {district.stats.restaurants}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Dots Navigation */}
            <div className="flex justify-center gap-2 mt-6">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === selectedIndex 
                      ? "bg-[#6443F4] w-8" 
                      : "bg-[#6443F4]/30 hover:bg-[#6443F4]/50"
                  }`}
                  onClick={() => scrollTo(index)}
                  data-testid={`carousel-dot-${index}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* District Grid */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">More Districts to Explore</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Each neighborhood offers a unique Dubai experience. From beaches to heritage sites, find your perfect destination.
            </p>
          </motion.div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
          >
            {otherDistricts.map((district, index) => (
              <DistrictCard key={district.id} district={district} index={index} />
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden p-12 md:p-16"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#6443F4] via-[#F94498] to-[#FF9327]" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920')] bg-cover bg-center mix-blend-overlay opacity-20" />
            
            {/* Content */}
            <div className="relative z-10">
              <Sparkles className="w-12 h-12 text-white/80 mx-auto mb-6" />
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Ready to Explore Dubai?
              </h2>
              <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                Start with Downtown Dubai - the heart of the city where dreams touch the sky.
              </p>
              <Link href="/districts/downtown-dubai">
                <Button 
                  size="lg"
                  className="bg-white text-[#6443F4] hover:bg-white/90 gap-2 text-lg px-10 py-6 font-semibold"
                  data-testid="button-start-downtown"
                >
                  Start with Downtown Dubai <ArrowRight className="w-5 h-5" />
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
