import { 
  Star, Building2, Waves, Briefcase, Users, Heart,
  Sparkles, Award, Crown, Plane, Palmtree, Building,
  Umbrella, Utensils, Dumbbell, Car, Wifi, Coffee
} from "lucide-react";
import { PageContainer, Section, ContentCard, CategoryGrid } from "@/components/public-layout";
import { PublicHero } from "@/components/public-hero";
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
  },
  {
    name: "Iconic Landmarks",
    icon: Crown,
    description: "Stay at architectural marvels that define Dubai's skyline",
    hotels: ["Burj Al Arab", "Jumeirah Emirates Towers", "Address Downtown"],
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
  },
  {
    name: "Business Hotels",
    icon: Briefcase,
    description: "World-class facilities for the discerning business traveler",
    hotels: ["JW Marriott Marquis", "Radisson Blu DIFC", "Novotel WTC"],
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
  },
  {
    name: "Boutique Hotels",
    icon: Sparkles,
    description: "Intimate experiences with unique character and design",
    hotels: ["XVA Art Hotel", "The Meydan Hotel", "Sofitel The Obelisk"],
    image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
  },
  {
    name: "Family Resorts",
    icon: Users,
    description: "Adventure and entertainment for the whole family",
    hotels: ["Atlantis Aquaventure", "Jumeirah Creekside", "JA Beach Hotel"],
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop",
  },
  {
    name: "Airport Hotels",
    icon: Plane,
    description: "Convenience and comfort for transit travelers",
    hotels: ["JW Marriott DXB", "Hilton Garden Inn Al Mina", "Le Meridien DXB"],
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
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
  const { isRTL } = useLocale();
  
  return (
    <Card 
      className="group overflow-visible bg-card rounded-[16px] shadow-[var(--shadow-level-1)] hover-elevate transition-all duration-300"
      data-testid={`card-category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-[16px]">
        <img 
          src={category.image} 
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} w-12 h-12 rounded-xl bg-travi-purple flex items-center justify-center shadow-md`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-heading font-bold text-white text-xl mb-2">{category.name}</h3>
          <p className="text-white/80 text-sm line-clamp-2">{category.description}</p>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          {category.hotels.map((hotel, idx) => (
            <Badge 
              key={idx} 
              variant="secondary" 
              className="text-xs"
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
  const { isRTL } = useLocale();
  const isReversed = index % 2 === 1;
  
  return (
    <div 
      className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-12 items-center`}
      data-testid={`card-featured-hotel-${hotel.name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="w-full lg:w-1/2">
        <div className="relative overflow-hidden rounded-[16px] shadow-[var(--shadow-level-2)]">
          <img 
            src={hotel.image} 
            alt={hotel.name}
            className="w-full aspect-[4/3] object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          
          <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'}`}>
            <Badge className="bg-white/90 text-foreground backdrop-blur-sm border-0 gap-1">
              <Star className="w-3 h-3 fill-travi-orange text-travi-orange" />
              {hotel.rating === 7 ? "7-Star" : `${hotel.rating}-Star`}
            </Badge>
          </div>
          
          <div className={`absolute bottom-4 ${isRTL ? 'right-4' : 'left-4'}`}>
            <Badge className="bg-travi-purple text-white border-0">
              {hotel.area}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="w-full lg:w-1/2 space-y-4">
        <div>
          <p className="text-travi-purple font-medium text-sm uppercase tracking-wide mb-2">{hotel.tagline}</p>
          <h3 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-4">{hotel.name}</h3>
          <p className="text-muted-foreground text-lg leading-relaxed">{hotel.description}</p>
        </div>
        
        <div className="flex flex-wrap gap-3 pt-4">
          {hotel.features.map((feature, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full"
            >
              <Sparkles className="w-4 h-4 text-travi-purple" />
              <span className="text-sm font-medium text-foreground">{feature}</span>
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
    <ContentCard
      image={area.image}
      title={area.name}
      description={area.description}
      badge={area.type}
      badgeVariant="secondary"
      aspectRatio="portrait"
      showGradientOverlay={true}
    />
  );
}

export default function PublicHotels() {
  useDocumentMeta({
    title: "Luxury Hotels in Dubai | From Palm Jumeirah to Downtown | Travi",
    description: "Discover Dubai's finest hotels. From Palm Jumeirah beachfront resorts to Downtown high-rises overlooking Burj Khalifa. 5-star luxury, world-class service.",
    ogTitle: "Luxury Hotels in Dubai | Travi",
    ogDescription: "From Palm Jumeirah beachfront resorts to Downtown high-rises overlooking Burj Khalifa. Find your perfect Dubai hotel.",
    ogType: "website",
  });

  return (
    <PageContainer navVariant="transparent">
      <PublicHero
        title="Dubai Hotels"
        subtitle="From iconic landmarks to beachfront resorts, find your perfect stay"
        backgroundImage="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Hotels" }
        ]}
        size="large"
      />

      <Section
        id="categories"
        title="Find Your Perfect Stay"
        subtitle="Dubai offers an unparalleled selection of hotels for every type of traveler"
        variant="alternate"
      >
        <CategoryGrid columns={3}>
          {hotelCategories.map((category, idx) => (
            <CategoryCard key={idx} category={category} />
          ))}
        </CategoryGrid>
      </Section>

      <Section
        id="featured"
        title="Dubai's Finest"
        subtitle="Iconic properties that define luxury hospitality"
      >
        <div className="space-y-16 lg:space-y-24">
          {featuredHotels.map((hotel, idx) => (
            <FeaturedHotelCard key={idx} hotel={hotel} index={idx} />
          ))}
        </div>
      </Section>

      <Section
        id="areas"
        title="Dubai Areas for Hotels"
        subtitle="Each district offers a unique Dubai experience"
        variant="alternate"
      >
        <CategoryGrid columns={3}>
          {dubaiAreas.map((area, idx) => (
            <AreaCard key={idx} area={area} />
          ))}
        </CategoryGrid>
      </Section>

      <Section id="amenities" className="bg-travi-purple">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            World-Class Amenities
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Dubai's luxury hotels offer amenities that redefine hospitality
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {amenities.map((amenity, idx) => {
            const IconComponent = amenity.icon;
            return (
              <div 
                key={idx}
                className="bg-card/30 backdrop-blur-sm rounded-[16px] p-6 text-center border border-white/20"
                data-testid={`amenity-${amenity.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-heading font-bold text-white mb-1">{amenity.name}</h3>
                <p className="text-white/70 text-sm">{amenity.description}</p>
              </div>
            );
          })}
        </div>
      </Section>

      <Section id="cta">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-[#6443F4]/10 rounded-full blur-3xl" />
            </div>
            <div className="relative">
              <Crown className="w-16 h-16 mx-auto text-[#FF9327] mb-6" />
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                Experience Dubai Luxury
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                From the world's only 7-star hotel to intimate boutique retreats, 
                Dubai offers hospitality experiences found nowhere else on Earth.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge className="px-6 py-3 text-base" variant="secondary">
                  <Star className="w-4 h-4 mr-2 text-[#FF9327]" />
                  500+ Luxury Hotels
                </Badge>
                <Badge className="px-6 py-3 text-base" variant="secondary">
                  <Heart className="w-4 h-4 mr-2 text-[#F94498]" />
                  World-Renowned Service
                </Badge>
                <Badge className="px-6 py-3 text-base" variant="secondary">
                  <Coffee className="w-4 h-4 mr-2 text-[#FF9327]" />
                  Michelin-Star Dining
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </PageContainer>
  );
}
