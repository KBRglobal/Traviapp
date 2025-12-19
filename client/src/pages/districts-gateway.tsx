import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  MapPin, Building2, Waves, Mountain, Star, ArrowRight, 
  Sparkles, Camera, Users, Heart, ShoppingBag, Utensils 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";

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
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop",
    gradient: "from-cyan-500 via-blue-500 to-purple-600",
    available: false,
    stats: { attractions: 8, hotels: 18, restaurants: 150 },
    bestFor: ["Beach lovers", "Nightlife", "Water sports"],
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
    available: false,
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
    available: false,
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
    available: false,
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
    available: false,
    stats: { attractions: 5, hotels: 22, restaurants: 90 },
    bestFor: ["Business", "Modern luxury", "Dining"],
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

// Featured district card (larger, more detailed)
function FeaturedDistrictCard({ district }: { district: typeof districts[0] }) {
  return (
    <motion.div
      variants={itemVariants}
      className="relative group rounded-3xl overflow-hidden"
      data-testid={`card-district-featured-${district.id}`}
    >
      <Link href={`/dubai/districts/${district.id}`}>
        <div className="relative aspect-[16/10] md:aspect-[21/9]">
          {/* Background Image */}
          <img
            src={district.image}
            alt={district.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${district.gradient} opacity-60 mix-blend-multiply`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          {/* Floating Badges */}
          <div className="absolute top-6 left-6 flex flex-wrap gap-2">
            <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 text-sm">
              <Star className="w-3 h-3 mr-1" /> Featured District
            </Badge>
          </div>
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="max-w-3xl">
              <p className="text-white/70 text-sm font-medium mb-2">{district.nameAr}</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 tracking-tight">
                {district.name}
              </h2>
              <p className="text-xl md:text-2xl text-white/90 font-medium mb-4">{district.tagline}</p>
              <p className="text-white/80 text-lg max-w-2xl mb-6 hidden md:block">
                {district.description}
              </p>
              
              {/* Highlights Pills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {district.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm text-white text-sm font-medium border border-white/20"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
              
              {/* Stats & CTA */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex gap-6 text-white/80 text-sm">
                  <span className="flex items-center gap-2">
                    <Camera className="w-4 h-4" /> {district.stats.attractions} Attractions
                  </span>
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> {district.stats.hotels} Hotels
                  </span>
                  <span className="flex items-center gap-2">
                    <Utensils className="w-4 h-4" /> {district.stats.restaurants}+ Restaurants
                  </span>
                </div>
                <Button 
                  className="bg-white text-gray-900 hover:bg-white/90 gap-2 font-semibold"
                  data-testid={`button-explore-${district.id}`}
                >
                  Explore District <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

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
            <Link href={`/dubai/districts/${district.id}`}>
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
  const featuredDistrict = districts[0]; // Downtown Dubai
  const otherDistricts = districts.slice(1);
  
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
              >
                <Sparkles className="w-5 h-5" />
                Explore All Districts
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 gap-2 text-lg px-8 py-6"
                data-testid="button-plan-trip"
              >
                <Heart className="w-5 h-5" />
                Plan Your Trip
              </Button>
            </div>
          </motion.div>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16"
          >
            {[
              { icon: MapPin, value: "12+", label: "Districts" },
              { icon: Camera, value: "100+", label: "Attractions" },
              { icon: Building2, value: "200+", label: "Hotels" },
              { icon: Users, value: "15M+", label: "Annual Visitors" },
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
      
      {/* Featured District */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <FeaturedDistrictCard district={featuredDistrict} />
          </motion.div>
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
              <Link href="/dubai/districts/downtown-dubai">
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
