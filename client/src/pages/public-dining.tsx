import { Link } from "wouter";
import {
  MapPin, Utensils, ArrowRight, ChefHat, Wine, 
  Globe, Award, Sparkles, Waves, Coffee, Fish,
  UtensilsCrossed, Beef, Calendar, TreePalm
} from "lucide-react";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { 
  PageContainer, 
  Section, 
  ContentCard, 
  CategoryGrid 
} from "@/components/public-layout";
import { PublicHero } from "@/components/public-hero";
import { cn } from "@/lib/utils";

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
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&h=400&fit=crop"
  },
  { 
    id: "indian", 
    name: "Indian & South Asian", 
    description: "From street food to Michelin-starred fine dining", 
    icon: Sparkles, 
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop"
  },
  { 
    id: "european", 
    name: "European", 
    description: "French, Italian, Spanish & Mediterranean flavors", 
    icon: Wine, 
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop"
  },
  { 
    id: "asian", 
    name: "Asian Cuisine", 
    description: "Japanese, Chinese, Thai, Korean & Vietnamese", 
    icon: Utensils, 
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop"
  },
  { 
    id: "american", 
    name: "American & Steakhouses", 
    description: "Premium steaks, burgers & classic American fare", 
    icon: Beef, 
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop"
  },
  { 
    id: "seafood", 
    name: "Seafood & Beach Dining", 
    description: "Fresh catches with stunning waterfront views", 
    icon: Fish, 
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop"
  },
  { 
    id: "cafes", 
    name: "Cafes & Brunch Spots", 
    description: "Artisan coffee, pastries & Instagram-worthy brunches", 
    icon: Coffee, 
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
    <PageContainer navVariant="transparent">
      {/* Hero Section */}
      <PublicHero
        title="Dubai's Best Restaurants & Dining"
        subtitle="From Michelin Stars to Street Food. Explore world-class cuisine, celebrity chef restaurants, and unforgettable dining experiences in the city of culinary wonders."
        backgroundImage="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Dining" },
        ]}
        size="large"
      >
        <div className={cn("flex flex-wrap items-center gap-3", isRTL && "flex-row-reverse")}>
          {[
            { value: "1000+", label: "Restaurants" },
            { value: "100+", label: "Cuisines" },
            { value: "Sky Dining", label: "Burj Khalifa" },
            { value: "Underwater", label: "Restaurants" },
          ].map((stat, i) => (
            <div 
              key={i} 
              className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20"
              data-testid={`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <span className="text-white font-bold">{stat.value}</span>
              <span className="text-white/70 ms-2">{stat.label}</span>
            </div>
          ))}
        </div>
      </PublicHero>

      {/* Unique Dining Experiences Section */}
      <Section
        id="unique-experiences"
        title="Unique Dining Experiences"
        subtitle="Dine 50 meters in the sky, underwater with sharks, or at the world's highest restaurant"
        className="bg-[hsl(var(--gray-100))] dark:bg-[hsl(var(--gray-100))]"
      >
        <div className="flex items-center gap-2 mb-8">
          <Badge className="bg-[hsl(var(--pink))]/10 text-[hsl(var(--pink))] border-[hsl(var(--pink))]/30">
            <Sparkles className="w-4 h-4 me-2" />
            Only in Dubai
          </Badge>
        </div>
        <CategoryGrid columns={3}>
          {uniqueExperiences.map((experience) => {
            const IconComponent = experience.icon;
            return (
              <Card 
                key={experience.name}
                className="group overflow-visible bg-white/5 backdrop-blur-sm rounded-[16px] border-0 hover-elevate transition-all duration-300"
                data-testid={`card-experience-${experience.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="relative h-48 overflow-hidden rounded-t-[16px]">
                  <img 
                    src={experience.image}
                    alt={experience.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className={cn("absolute top-4", isRTL ? "right-4" : "left-4")}>
                    <div className="w-10 h-10 rounded-[12px] bg-[hsl(var(--pink))] flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className={cn("absolute bottom-4", isRTL ? "right-4 left-4" : "left-4 right-4")}>
                    <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm text-xs">
                      {experience.highlight}
                    </Badge>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-[hsl(var(--pink))] transition-colors">
                    {experience.name}
                  </h3>
                  <p className="text-white/50 text-sm mb-3 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {experience.location}
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
                    {experience.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </CategoryGrid>
      </Section>

      {/* Cuisine Categories Section */}
      <Section
        id="cuisines"
        title="Cuisine Categories"
        subtitle="From authentic Arabic flavors to global gastronomy - Dubai serves every palate"
        variant="alternate"
      >
        <div className="flex items-center gap-2 mb-8">
          <Badge className="bg-[hsl(var(--purple))]/10 text-[hsl(var(--purple))] border-[hsl(var(--purple))]/30">
            <Globe className="w-4 h-4 me-2" />
            World Cuisines
          </Badge>
        </div>
        <CategoryGrid columns={4}>
          {cuisineCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.id}
                className="group overflow-visible bg-card rounded-[16px] p-0 shadow-[var(--shadow-level-1)] hover-elevate transition-all duration-300"
                data-testid={`card-cuisine-${category.id}`}
              >
                <div className="relative aspect-video overflow-hidden rounded-t-[16px]">
                  <img 
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </Card>
            );
          })}
        </CategoryGrid>
      </Section>

      {/* Dubai Dining Areas Section */}
      <Section
        id="dining-areas"
        title="Dubai Dining Areas"
        subtitle="Each neighborhood offers a unique culinary atmosphere and character"
      >
        <div className="flex items-center gap-2 mb-8">
          <Badge className="bg-[hsl(var(--orange))]/10 text-[hsl(var(--orange))] border-[hsl(var(--orange))]/30">
            <MapPin className="w-4 h-4 me-2" />
            Dining Districts
          </Badge>
        </div>
        <CategoryGrid columns={3}>
          {diningAreas.map((area) => (
            <Card 
              key={area.name}
              className="group overflow-visible bg-white dark:bg-card rounded-[16px] p-0 shadow-[var(--shadow-level-1)] hover-elevate transition-all duration-300"
              data-testid={`card-area-${area.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="relative h-52 overflow-hidden rounded-t-[16px]">
                <img 
                  src={area.image}
                  alt={area.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className={cn("absolute top-4 flex items-center gap-2 flex-wrap", isRTL ? "right-4 left-4" : "left-4 right-4")}>
                  <Badge className="bg-[hsl(var(--purple))] text-white border-0">
                    {area.highlight}
                  </Badge>
                  <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                    {area.restaurants} Venues
                  </Badge>
                </div>
                <div className={cn("absolute bottom-4", isRTL ? "right-4 left-4" : "left-4 right-4")}>
                  <h3 className="text-xl font-bold text-white">{area.name}</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                  {area.description}
                </p>
                <div className="flex items-center text-[hsl(var(--purple))] font-medium text-sm gap-1">
                  Explore restaurants
                  <ArrowRight className={cn("w-4 h-4 transition-transform group-hover:translate-x-1", isRTL && "rotate-180 group-hover:-translate-x-1")} />
                </div>
              </div>
            </Card>
          ))}
        </CategoryGrid>
      </Section>

      {/* Food Events & Markets Section */}
      <Section
        id="food-events"
        title="Food Events & Markets"
        subtitle="Experience Dubai's vibrant food scene through festivals, markets, and culinary celebrations"
        variant="alternate"
      >
        <div className="flex items-center gap-2 mb-8">
          <Badge className="bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/30">
            <Calendar className="w-4 h-4 me-2" />
            Culinary Events
          </Badge>
        </div>
        <CategoryGrid columns={3}>
          {foodEvents.map((event) => (
            <Card 
              key={event.name}
              className="group overflow-visible bg-white dark:bg-card rounded-[16px] p-0 shadow-[var(--shadow-level-1)] hover-elevate transition-all duration-300"
              data-testid={`card-event-${event.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="relative h-56 overflow-hidden rounded-t-[16px]">
                <img 
                  src={event.image}
                  alt={event.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className={cn("absolute top-4", isRTL ? "right-4" : "left-4")}>
                  <Badge className="bg-[hsl(var(--success))] text-white border-0">
                    {event.highlight}
                  </Badge>
                </div>
                <div className={cn("absolute bottom-4", isRTL ? "right-4 left-4" : "left-4 right-4")}>
                  <h3 className="text-lg font-bold text-white mb-1">{event.name}</h3>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <Calendar className="w-4 h-4" />
                    {event.date}
                  </div>
                </div>
              </div>
              <div className="p-5">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {event.description}
                </p>
              </div>
            </Card>
          ))}
        </CategoryGrid>
      </Section>

      {/* CTA Section */}
      <Section
        id="cta"
        className="bg-gradient-to-r from-[hsl(var(--purple))] to-[hsl(var(--pink))]"
      >
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold text-white mb-4">
            Ready to Explore Dubai's Culinary Scene?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            From sky-high dining to underwater adventures, Dubai offers unforgettable experiences for every food lover
          </p>
          <div className={cn("flex flex-wrap justify-center gap-4", isRTL && "flex-row-reverse")}>
            <Link href={localePath("/attractions")}>
              <Button 
                size="lg" 
                className="bg-white text-[hsl(var(--purple))] border-white"
                data-testid="button-explore-attractions"
              >
                Explore Attractions
                <ArrowRight className={cn("w-4 h-4 ms-2", isRTL && "rotate-180")} />
              </Button>
            </Link>
            <Link href={localePath("/hotels")}>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white bg-white/10 backdrop-blur-sm"
                data-testid="button-find-hotels"
              >
                Find Hotels
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </PageContainer>
  );
}
