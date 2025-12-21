import { Link } from "wouter";
import {
  MapPin, Utensils, ArrowRight, Star, ChefHat, Wine, 
  Globe, Award, Sparkles, Waves, Coffee, Fish,
  UtensilsCrossed, Beef, Calendar, ShoppingBag, TreePalm
} from "lucide-react";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/LocaleRouter";

const uniqueExperiences = [
  {
    name: "Dinner in the Sky",
    location: "Various Locations, Dubai",
    description: "Experience gourmet dining suspended 50 meters in the air by a crane. Enjoy 360-degree panoramic views of Dubai's iconic skyline while savoring a multi-course meal crafted by world-class chefs.",
    highlight: "Suspended 50m in the Air",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
    icon: Sparkles,
  },
  {
    name: "At.mosphere",
    location: "Burj Khalifa, 122nd Floor",
    description: "Dine at the world's highest restaurant, perched 442 meters above ground on the 122nd floor of the iconic Burj Khalifa. Breathtaking panoramic views complement exquisite European cuisine.",
    highlight: "World's Highest Restaurant",
    image: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800&h=600&fit=crop",
    icon: Award,
  },
  {
    name: "Ossiano",
    location: "Atlantis, The Palm",
    description: "Immerse yourself in an underwater wonderland surrounded by 65,000 marine animals including sharks, rays, and exotic fish. Michelin-starred Mediterranean seafood in an aquatic paradise.",
    highlight: "Underwater Dining with Sharks",
    image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&h=600&fit=crop",
    icon: Fish,
  },
  {
    name: "Al Mahara",
    location: "Burj Al Arab",
    description: "Arrive via a simulated submarine ride to this legendary underwater restaurant inside the world's most iconic 7-star hotel. Floor-to-ceiling aquarium views and impeccable seafood.",
    highlight: "Burj Al Arab Aquarium",
    image: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800&h=600&fit=crop",
    icon: Waves,
  },
  {
    name: "Pierchic",
    location: "Al Qasr, Jumeirah Beach",
    description: "Dubai's most romantic overwater restaurant, set at the end of a wooden pier stretching into the Arabian Gulf. Fresh seafood with sunset views over the glistening waters.",
    highlight: "Overwater Pier Restaurant",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop",
    icon: TreePalm,
  },
  {
    name: "Tresind Studio",
    location: "DIFC, Dubai",
    description: "Dubai's celebrated Michelin-starred Indian fine dining experience. A 16-seat chef's table offering progressive Indian cuisine that reimagines traditional flavors through avant-garde techniques.",
    highlight: "Michelin-Starred Indian",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
    icon: ChefHat,
  },
];

const cuisineCategories = [
  { 
    id: "arabic", 
    name: "Arabic & Middle Eastern", 
    description: "Authentic Lebanese, Emirati, Persian & Turkish cuisines", 
    icon: UtensilsCrossed, 
    color: "from-emerald-500 to-teal-600",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&h=400&fit=crop"
  },
  { 
    id: "indian", 
    name: "Indian & South Asian", 
    description: "From street food to Michelin-starred fine dining", 
    icon: Sparkles, 
    color: "from-orange-500 to-red-600",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop"
  },
  { 
    id: "european", 
    name: "European", 
    description: "French, Italian, Spanish & Mediterranean flavors", 
    icon: Wine, 
    color: "from-purple-500 to-indigo-600",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop"
  },
  { 
    id: "asian", 
    name: "Asian Cuisine", 
    description: "Japanese, Chinese, Thai, Korean & Vietnamese", 
    icon: Utensils, 
    color: "from-rose-500 to-pink-600",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop"
  },
  { 
    id: "american", 
    name: "American & Steakhouses", 
    description: "Premium steaks, burgers & classic American fare", 
    icon: Beef, 
    color: "from-amber-500 to-orange-600",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop"
  },
  { 
    id: "seafood", 
    name: "Seafood & Beach Dining", 
    description: "Fresh catches with stunning waterfront views", 
    icon: Fish, 
    color: "from-cyan-500 to-blue-600",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop"
  },
  { 
    id: "cafes", 
    name: "Cafes & Brunch Spots", 
    description: "Artisan coffee, pastries & Instagram-worthy brunches", 
    icon: Coffee, 
    color: "from-yellow-500 to-amber-600",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop"
  },
];

const diningAreas = [
  { 
    name: "Downtown Dubai", 
    description: "Fine dining with stunning Burj Khalifa views. Home to sky-high restaurants, rooftop bars, and world-class culinary experiences in the heart of the city.", 
    highlight: "Fine Dining & Sky Restaurants",
    restaurants: "200+",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop" 
  },
  { 
    name: "Dubai Marina", 
    description: "Waterfront dining with yacht views and glittering skyline. Romantic restaurants, trendy lounges, and international cuisines along the marina promenade.", 
    highlight: "Waterfront Dining",
    restaurants: "150+",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop" 
  },
  { 
    name: "DIFC", 
    description: "Dubai's culinary epicenter with 50+ world-class venues. Power lunches, celebrity chef restaurants, rooftop bars, and the city's most exclusive dining.", 
    highlight: "Business Lunches & Rooftop Bars",
    restaurants: "50+",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&h=600&fit=crop" 
  },
  { 
    name: "JBR / The Walk", 
    description: "Casual beachside dining with ocean breezes. Family-friendly restaurants, beach clubs, and al fresco dining along the stunning Jumeirah Beach.", 
    highlight: "Casual Beachside",
    restaurants: "100+",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop" 
  },
  { 
    name: "Old Dubai", 
    description: "Authentic local flavors in historic settings. Traditional Emirati cuisine, aromatic spice souks, and hidden gems in Al Fahidi and Deira neighborhoods.", 
    highlight: "Authentic Local Food",
    restaurants: "300+",
    image: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=800&h=600&fit=crop" 
  },
  { 
    name: "City Walk", 
    description: "Trendy urban district with contemporary cafes and international restaurants. Al fresco dining, boutique eateries, and the city's coolest brunch spots.", 
    highlight: "Trendy Cafes",
    restaurants: "80+",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop" 
  },
];

const foodEvents = [
  {
    name: "Dubai Food Festival",
    description: "The city's biggest annual culinary celebration featuring restaurant deals, food trucks, celebrity chef appearances, and exclusive dining experiences across Dubai.",
    date: "February - March",
    highlight: "Annual Celebration",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=500&fit=crop",
  },
  {
    name: "Global Village Food Courts",
    description: "A world tour of flavors with 90+ countries represented. From Indian street food to Turkish kebabs, experience authentic cuisines from around the globe.",
    date: "October - April",
    highlight: "90+ Countries",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=500&fit=crop",
  },
  {
    name: "Ripe Market",
    description: "Dubai's favorite artisan market featuring organic produce, homemade treats, specialty foods, and local vendors. A foodie's paradise for fresh, sustainable ingredients.",
    date: "Every Weekend",
    highlight: "Organic & Artisan",
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=500&fit=crop",
  },
];

export default function PublicDining() {
  const { isRTL, localePath } = useLocale();

  useDocumentMeta({
    title: "Dubai's Best Restaurants & Dining Experiences 2025 | Travi",
    description: "Discover Dubai's culinary scene: 1000+ restaurants, 100+ cuisines, sky dining at Burj Khalifa, underwater restaurants at Atlantis. From Michelin stars to street food.",
    ogTitle: "Dubai's Best Restaurants & Dining | Travi",
    ogDescription: "From Michelin Stars to Street Food. Experience sky dining, underwater restaurants, and 100+ world cuisines in Dubai.",
    ogType: "website",
  });

  return (
    <div className="bg-background min-h-screen flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
      <PublicNav variant="transparent" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop"
            alt="Elegant fine dining restaurant in Dubai with stunning ambiance"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
          <Badge className="mb-6 bg-[#F94498]/20 text-white border-[#F94498]/40 backdrop-blur-sm px-5 py-2">
            <Utensils className="w-4 h-4 mr-2" />
            Dubai Dining Guide 2025
          </Badge>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            Dubai's Best Restaurants
            <span className="block text-[#F94498]">& Dining</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed font-medium">
            From Michelin Stars to Street Food
          </p>
          
          <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto">
            Explore world-class cuisine, celebrity chef restaurants, and unforgettable dining experiences in the city of culinary wonders
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
            {[
              { value: "1000+", label: "Restaurants" },
              { value: "100+", label: "Cuisines" },
              { value: "Sky Dining", label: "Burj Khalifa" },
              { value: "Underwater", label: "Restaurants" },
            ].map((stat, i) => (
              <div key={i} className="px-5 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <span className="text-white font-bold">{stat.value}</span>
                <span className="text-white/70 ml-2">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-white/60 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Unique Dining Experiences Section */}
      <section className="py-24 bg-gradient-to-b from-[#24103E] to-[#1a0a2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#F94498]/20 text-[#F94498] border-[#F94498]/30">
              <Sparkles className="w-4 h-4 mr-2" />
              Only in Dubai
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Unique Dining Experiences
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Dine 50 meters in the sky, underwater with sharks, or at the world's highest restaurant
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uniqueExperiences.map((experience) => {
              const IconComponent = experience.icon;
              return (
                <Card 
                  key={experience.name}
                  className="group overflow-hidden border-0 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-500"
                  data-testid={`card-experience-${experience.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={experience.image}
                      alt={experience.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <div className="w-10 h-10 rounded-xl bg-[#F94498] flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm text-xs">
                        {experience.highlight}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#F94498] transition-colors">
                      {experience.name}
                    </h3>
                    <p className="text-white/50 text-sm mb-3 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" />
                      {experience.location}
                    </p>
                    <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
                      {experience.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cuisine Categories Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#6443F4]/10 text-[#6443F4] border-[#6443F4]/30">
              <Globe className="w-4 h-4 mr-2" />
              World Cuisines
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Cuisine Categories
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              From authentic Arabic flavors to global gastronomy - Dubai serves every palate
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cuisineCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card 
                  key={category.id}
                  className="group overflow-hidden border-0 shadow-lg cursor-pointer transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                  data-testid={`card-cuisine-${category.id}`}
                >
                  <div className="relative h-36 overflow-hidden">
                    <img 
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className={`absolute top-4 left-4 w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-[#6443F4] transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dubai Dining Areas Section */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#FF9327]/10 text-[#FF9327] border-[#FF9327]/30">
              <MapPin className="w-4 h-4 mr-2" />
              Dining Districts
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Dubai Dining Areas
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Each neighborhood offers a unique culinary atmosphere and character
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diningAreas.map((area) => (
              <Card 
                key={area.name}
                className="group overflow-hidden border-0 shadow-lg cursor-pointer transition-all duration-500 hover:shadow-xl"
                data-testid={`card-area-${area.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="relative h-52 overflow-hidden">
                  <img 
                    src={area.image}
                    alt={area.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                    <Badge className="bg-[#6443F4] text-white border-0">
                      {area.highlight}
                    </Badge>
                    <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                      {area.restaurants} Venues
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{area.name}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
                    {area.description}
                  </p>
                  <div className="flex items-center text-[#6443F4] font-medium text-sm group-hover:gap-2 transition-all">
                    Explore restaurants
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Food Events & Markets Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-[#02A65C]/10 text-[#02A65C] border-[#02A65C]/30">
              <Calendar className="w-4 h-4 mr-2" />
              Culinary Events
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Food Events & Markets
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Experience Dubai's vibrant food scene through festivals, markets, and culinary celebrations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {foodEvents.map((event) => (
              <Card 
                key={event.name}
                className="group overflow-hidden border-0 shadow-lg transition-all duration-500 hover:shadow-xl"
                data-testid={`card-event-${event.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-[#02A65C] text-white border-0">
                      {event.highlight}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{event.name}</h3>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                      <Calendar className="w-4 h-4" />
                      {event.date}
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#6443F4] to-[#F94498]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Explore Dubai's Culinary Scene?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            From sky-high dining to underwater adventures, Dubai offers unforgettable experiences for every food lover
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={localePath("/attractions")}>
              <Button className="bg-white text-[#6443F4] hover:bg-white/90 px-8">
                Explore Attractions
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href={localePath("/hotels")}>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 bg-white/10 backdrop-blur-sm">
                Find Hotels
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
