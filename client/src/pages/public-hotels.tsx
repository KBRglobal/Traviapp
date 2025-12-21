import { 
  Star, Building2, Waves, Briefcase, Users, Heart,
  Sparkles, Award, Crown, Plane, Palmtree, Building,
  Umbrella, Utensils, Dumbbell, Car, Wifi, Coffee
} from "lucide-react";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n/LocaleRouter";

const hotelCategories = [
  {
    name: "Beach Resorts",
    icon: Waves,
    description: "Wake up to turquoise waters and pristine private beaches",
    hotels: ["Atlantis The Palm", "One&Only The Palm", "Jumeirah Beach Hotel"],
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
    color: "from-cyan-500 to-blue-600"
  },
  {
    name: "Iconic Landmarks",
    icon: Crown,
    description: "Stay at architectural marvels that define Dubai's skyline",
    hotels: ["Burj Al Arab", "Jumeirah Emirates Towers", "Address Downtown"],
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
    color: "from-amber-500 to-orange-600"
  },
  {
    name: "Business Hotels",
    icon: Briefcase,
    description: "World-class facilities for the discerning business traveler",
    hotels: ["JW Marriott Marquis", "Radisson Blu DIFC", "Novotel WTC"],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
    color: "from-slate-600 to-slate-800"
  },
  {
    name: "Boutique Hotels",
    icon: Sparkles,
    description: "Intimate experiences with unique character and design",
    hotels: ["XVA Art Hotel", "The Meydan Hotel", "Sofitel The Obelisk"],
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
    color: "from-pink-500 to-rose-600"
  },
  {
    name: "Family Resorts",
    icon: Users,
    description: "Adventure and entertainment for the whole family",
    hotels: ["Atlantis Aquaventure", "Jumeirah Creekside", "JA Beach Hotel"],
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop",
    color: "from-green-500 to-emerald-600"
  },
  {
    name: "Airport Hotels",
    icon: Plane,
    description: "Convenience and comfort for transit travelers",
    hotels: ["JW Marriott DXB", "Hilton Garden Inn Al Mina", "Le Meridien DXB"],
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
    color: "from-purple-500 to-indigo-600"
  }
];

const featuredHotels = [
  {
    name: "Atlantis The Palm",
    tagline: "World-Famous Underwater Suites",
    description: "Experience the legendary underwater suites where floor-to-ceiling windows reveal the wonders of the Ambassador Lagoon. Home to one of the world's largest waterparks.",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=900&h=600&fit=crop",
    features: ["Underwater Suites", "Aquaventure Waterpark", "The Lost Chambers"],
    rating: 5,
    area: "Palm Jumeirah"
  },
  {
    name: "Burj Al Arab",
    tagline: "The World's Most Luxurious Hotel",
    description: "The iconic sail-shaped silhouette defines Dubai's skyline. Every suite offers unparalleled luxury with 24-hour butler service and breathtaking Arabian Gulf views.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&h=600&fit=crop",
    features: ["Butler Service", "Helipad", "Private Beach"],
    rating: 7,
    area: "Jumeirah"
  },
  {
    name: "Address Downtown",
    tagline: "Burj Khalifa at Your Doorstep",
    description: "Wake up to unobstructed views of the world's tallest building. Steps from Dubai Mall and the Dubai Fountain, this is the heart of modern Dubai.",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=900&h=600&fit=crop",
    features: ["Burj Khalifa Views", "Dubai Mall Access", "Rooftop Pool"],
    rating: 5,
    area: "Downtown Dubai"
  },
  {
    name: "One&Only Royal Mirage",
    tagline: "Arabian Palace Experience",
    description: "A palatial retreat set in 65 acres of landscaped gardens. Experience authentic Arabian hospitality amid Moorish architecture and palm-fringed beaches.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&h=600&fit=crop",
    features: ["Private Beach", "Oriental Hammam", "Lush Gardens"],
    rating: 5,
    area: "The Palm"
  },
  {
    name: "Armani Hotel Dubai",
    tagline: "Designer Luxury by Giorgio Armani",
    description: "The first hotel designed entirely by Giorgio Armani. Located in the iconic Burj Khalifa, every detail reflects the designer's sophisticated aesthetic.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&h=600&fit=crop",
    features: ["Armani Design", "Burj Khalifa Location", "Fine Dining"],
    rating: 5,
    area: "Downtown Dubai"
  },
  {
    name: "Four Seasons Jumeirah",
    tagline: "Beach Resort Luxury",
    description: "A modern beachfront sanctuary with panoramic views of the Arabian Gulf. Impeccable service meets contemporary elegance on Jumeirah Beach.",
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&h=600&fit=crop",
    features: ["Private Beach", "Infinity Pool", "Award-Winning Spa"],
    rating: 5,
    area: "Jumeirah Beach"
  }
];

const dubaiAreas = [
  {
    name: "Palm Jumeirah",
    description: "The world's largest man-made island, home to exclusive beach resorts and underwater attractions",
    type: "Beach Resorts",
    icon: Palmtree,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop",
    hotels: "50+ luxury properties"
  },
  {
    name: "Downtown Dubai",
    description: "The heart of modern Dubai with Burj Khalifa, Dubai Mall, and the famous Dubai Fountain",
    type: "Burj Khalifa Area",
    icon: Building,
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&h=400&fit=crop",
    hotels: "80+ premium hotels"
  },
  {
    name: "Dubai Marina",
    description: "Vibrant waterfront living with stunning yacht views and buzzing nightlife scene",
    type: "Vibrant Nightlife",
    icon: Waves,
    image: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600&h=400&fit=crop",
    hotels: "60+ hotels"
  },
  {
    name: "Jumeirah Beach",
    description: "Classic beachfront luxury with pristine sands and iconic landmarks",
    type: "Classic Beachfront",
    icon: Umbrella,
    image: "https://images.unsplash.com/photo-1597659840241-37e2b9c2f55f?w=600&h=400&fit=crop",
    hotels: "40+ beach hotels"
  },
  {
    name: "Business Bay",
    description: "Dubai's business district with modern towers and waterfront canal views",
    type: "Business Travelers",
    icon: Briefcase,
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop",
    hotels: "70+ business hotels"
  },
  {
    name: "Creek & Deira",
    description: "Experience old Dubai charm with heritage hotels and traditional souks",
    type: "Heritage Area",
    icon: Award,
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop",
    hotels: "100+ hotels"
  }
];

const amenities = [
  { icon: Umbrella, name: "Private Beaches", description: "Exclusive beach access" },
  { icon: Waves, name: "Infinity Pools", description: "Stunning rooftop views" },
  { icon: Sparkles, name: "Spa Services", description: "World-class wellness" },
  { icon: Utensils, name: "Fine Dining", description: "Michelin-starred restaurants" },
  { icon: Waves, name: "Waterparks", description: "Family entertainment" },
  { icon: Dumbbell, name: "Fitness Centers", description: "State-of-the-art gyms" },
  { icon: Car, name: "Valet Parking", description: "Luxury vehicle service" },
  { icon: Wifi, name: "High-Speed WiFi", description: "Seamless connectivity" }
];

function CategoryCard({ category }: { category: typeof hotelCategories[0] }) {
  const IconComponent = category.icon;
  
  return (
    <Card 
      className="group relative overflow-visible border-0 shadow-lg bg-white dark:bg-slate-900"
      data-testid={`card-category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
        <img 
          src={category.image} 
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className={`absolute top-4 left-4 w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-bold text-white text-xl mb-2">{category.name}</h3>
          <p className="text-white/80 text-sm line-clamp-2">{category.description}</p>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          {category.hotels.map((hotel, idx) => (
            <Badge 
              key={idx} 
              variant="secondary" 
              className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {hotel}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}

function FeaturedHotelCard({ hotel, index }: { hotel: typeof featuredHotels[0]; index: number }) {
  const isReversed = index % 2 === 1;
  
  return (
    <div 
      className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-12 items-center`}
      data-testid={`card-featured-hotel-${hotel.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="w-full lg:w-1/2">
        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
          <img 
            src={hotel.image} 
            alt={hotel.name}
            className="w-full aspect-[4/3] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <div className="absolute top-4 right-4">
            <Badge className="bg-white/90 text-slate-900 backdrop-blur-sm border-0 gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {hotel.rating === 7 ? "7-Star" : `${hotel.rating}-Star`}
            </Badge>
          </div>
          
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-gradient-to-r from-[#6C5CE7] to-[#EC4899] text-white border-0">
              {hotel.area}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 space-y-4">
        <div>
          <p className="text-[#6C5CE7] font-medium text-sm uppercase tracking-wide mb-2">{hotel.tagline}</p>
          <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">{hotel.name}</h3>
          <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">{hotel.description}</p>
        </div>
        
        <div className="flex flex-wrap gap-3 pt-4">
          {hotel.features.map((feature, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-[#6C5CE7]" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AreaCard({ area }: { area: typeof dubaiAreas[0] }) {
  const IconComponent = area.icon;
  
  return (
    <div 
      className="group relative overflow-hidden rounded-2xl shadow-lg"
      data-testid={`card-area-${area.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="aspect-[3/4] overflow-hidden">
        <img 
          src={area.image} 
          alt={area.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
          <IconComponent className="w-5 h-5 text-white" />
        </div>
        <Badge className="mb-3 bg-white/20 backdrop-blur-sm text-white border-0 text-xs">
          {area.type}
        </Badge>
        <h3 className="font-bold text-white text-xl mb-2">{area.name}</h3>
        <p className="text-white/80 text-sm mb-3 line-clamp-2">{area.description}</p>
        <p className="text-white/60 text-xs font-medium">{area.hotels}</p>
      </div>
    </div>
  );
}

export default function PublicHotels() {
  const { isRTL } = useLocale();

  useDocumentMeta({
    title: "Luxury Hotels in Dubai | From Palm Jumeirah to Downtown | Travi",
    description: "Discover Dubai's finest hotels. From Palm Jumeirah beachfront resorts to Downtown high-rises overlooking Burj Khalifa. 5-star luxury, world-class service.",
    ogTitle: "Luxury Hotels in Dubai | Travi",
    ogDescription: "From Palm Jumeirah beachfront resorts to Downtown high-rises overlooking Burj Khalifa. Find your perfect Dubai hotel.",
    ogType: "website",
  });

  return (
    <div className="bg-background min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <PublicNav variant="transparent" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop"
            alt="Dubai luxury hotel skyline with Burj Al Arab"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
          <Badge className="mb-6 bg-white/10 backdrop-blur-md border-white/20 text-white px-5 py-2.5 text-sm">
            <Crown className="w-4 h-4 mr-2" />
            World-Class Hospitality
          </Badge>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Luxury Hotels
            <span className="block bg-gradient-to-r from-amber-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
              in Dubai
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed">
            From Palm Jumeirah resorts to Downtown high-rises
          </p>
          
          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            {[
              { icon: Star, label: "5-Star Resorts" },
              { icon: Waves, label: "Beach Hotels" },
              { icon: Briefcase, label: "Business Hotels" },
              { icon: Sparkles, label: "Boutique Stays" }
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-2 px-5 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
              >
                <stat.icon className="w-5 h-5 text-amber-300" />
                <span className="text-white font-medium text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white/40 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Hotel Categories Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-[#6C5CE7]/10 to-[#EC4899]/10 text-[#6C5CE7] border-0">
              <Building2 className="w-4 h-4 mr-2" />
              Hotel Categories
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Find Your Perfect Stay
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Dubai offers an unparalleled selection of hotels for every type of traveler
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotelCategories.map((category, idx) => (
              <CategoryCard key={idx} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hotels Section */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <Badge className="mb-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600 border-0">
              <Award className="w-4 h-4 mr-2" />
              Featured Hotels
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Dubai's Finest
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Iconic properties that define luxury hospitality
            </p>
          </div>
          
          <div className="space-y-24">
            {featuredHotels.map((hotel, idx) => (
              <FeaturedHotelCard key={idx} hotel={hotel} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Dubai Areas Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 border-0">
              <Palmtree className="w-4 h-4 mr-2" />
              By Location
            </Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Dubai Areas for Hotels
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Each district offers a unique Dubai experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dubaiAreas.map((area, idx) => (
              <AreaCard key={idx} area={area} />
            ))}
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-24 bg-gradient-to-r from-[#6C5CE7] via-[#8B5CF6] to-[#EC4899]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              World-Class Amenities
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Dubai's luxury hotels offer amenities that redefine hospitality
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {amenities.map((amenity, idx) => {
              const IconComponent = amenity.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20"
                  data-testid={`amenity-${amenity.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-1">{amenity.name}</h3>
                  <p className="text-white/70 text-sm">{amenity.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-gradient-to-r from-[#6C5CE7]/20 to-[#EC4899]/20 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <Crown className="w-16 h-16 mx-auto text-amber-500 mb-6" />
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                Experience Dubai Luxury
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
                From the world's only 7-star hotel to intimate boutique retreats, 
                Dubai offers hospitality experiences found nowhere else on Earth.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-base">
                  <Star className="w-4 h-4 mr-2 text-amber-500" />
                  500+ Luxury Hotels
                </Badge>
                <Badge className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-base">
                  <Heart className="w-4 h-4 mr-2 text-pink-500" />
                  World-Renowned Service
                </Badge>
                <Badge className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-base">
                  <Coffee className="w-4 h-4 mr-2 text-amber-600" />
                  Michelin-Star Dining
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
