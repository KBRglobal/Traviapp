import { Link } from "wouter";
import {
  ShoppingBag, MapPin, Clock, Gem, Store, Building2,
  Sparkles, Crown, Gift, Percent, CreditCard, Package,
  ChevronRight, ArrowRight, Landmark, Coffee, Shirt,
  Watch, Smartphone
} from "lucide-react";
import { PageContainer, Section, CategoryGrid } from "@/components/public-layout";
import { PublicHero } from "@/components/public-hero";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { cn } from "@/lib/utils";

interface Mall {
  id: string;
  name: string;
  description: string;
  highlights: string[];
  stores: string;
  location: string;
  image: string;
}

interface Souk {
  id: string;
  name: string;
  specialty: string;
  description: string;
  location: string;
  established?: string;
  image: string;
}

interface ShoppingDistrict {
  id: string;
  name: string;
  description: string;
  vibe: string;
  image: string;
}

interface ShoppingCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}

const MEGA_MALLS: Mall[] = [
  {
    id: "dubai-mall",
    name: "The Dubai Mall",
    description: "World's largest shopping destination with over 1,200 retail outlets, an Olympic-sized ice rink, and the mesmerizing Dubai Aquarium & Underwater Zoo.",
    highlights: ["Dubai Aquarium", "Ice Rink", "VR Park", "KidZania", "Fashion Avenue"],
    stores: "1,200+",
    location: "Downtown Dubai",
    image: "gradient:from-travi-purple via-travi-purple/80 to-travi-purple/70"
  },
  {
    id: "mall-of-emirates",
    name: "Mall of the Emirates",
    description: "Home to Ski Dubai, the Middle East's first indoor ski resort, featuring 630+ outlets and Magic Planet entertainment center.",
    highlights: ["Ski Dubai", "Magic Planet", "VOX Cinemas", "Luxury Fashion"],
    stores: "630+",
    location: "Al Barsha",
    image: "gradient:from-travi-green via-travi-green/80 to-travi-green/70"
  },
  {
    id: "ibn-battuta",
    name: "Ibn Battuta Mall",
    description: "World's largest themed shopping mall celebrating the journeys of famous explorer Ibn Battuta, featuring 6 stunning courts from China to Andalusia.",
    highlights: ["6 Themed Courts", "IMAX Theatre", "270+ Stores", "Cultural Architecture"],
    stores: "270+",
    location: "Jebel Ali",
    image: "gradient:from-travi-orange via-travi-orange/80 to-travi-orange/70"
  },
  {
    id: "festival-city",
    name: "Dubai Festival City Mall",
    description: "Waterfront destination featuring the spectacular IMAGINE show with water, fire, laser and projection effects against the Dubai skyline.",
    highlights: ["IMAGINE Show", "Waterfront Dining", "IKEA", "Robinsons"],
    stores: "400+",
    location: "Festival City",
    image: "gradient:from-info via-info/60 to-travi-purple/70"
  },
  {
    id: "dubai-hills",
    name: "Dubai Hills Mall",
    description: "Dubai's newest luxury shopping destination home to The Storm Coaster, the world's fastest vertical-launch roller coaster integrated into a mall.",
    highlights: ["Storm Coaster", "Roxy Cinemas", "Sky Terrace", "Luxury Brands"],
    stores: "650+",
    location: "Dubai Hills Estate",
    image: "gradient:from-travi-green via-travi-green/80 to-travi-green/70"
  },
  {
    id: "wafi-mall",
    name: "Wafi Mall",
    description: "Stunning Egyptian-themed mall featuring pyramid architecture, stained glass domes, and the authentic Khan Murjan Souk with 125 artisan shops.",
    highlights: ["Khan Murjan Souk", "Egyptian Theme", "Fine Dining", "Artisan Crafts"],
    stores: "350+",
    location: "Umm Hurair",
    image: "gradient:from-travi-orange via-travi-pink/50 to-travi-orange/70"
  }
];

const TRADITIONAL_SOUKS: Souk[] = [
  {
    id: "gold-souk",
    name: "Gold Souk",
    specialty: "Gold & Jewelry",
    description: "Over 10 tonnes of gold on display in more than 300 jewelry stores. One of the world's largest gold markets with competitive prices and expert craftsmanship.",
    location: "Deira",
    established: "1900s",
    image: "gradient:from-[#FFD112] via-[#FF9327] to-[#FFD112]/70"
  },
  {
    id: "spice-souk",
    name: "Spice Souk",
    specialty: "Herbs & Spices",
    description: "A sensory journey through exotic spices, herbs, frankincense, saffron, and traditional Middle Eastern ingredients. Perfect for culinary enthusiasts.",
    location: "Deira",
    image: "gradient:from-travi-orange via-travi-orange/80 to-travi-orange/70"
  },
  {
    id: "perfume-souk",
    name: "Perfume Souk",
    specialty: "Arabic Perfumes",
    description: "Discover authentic Arabic perfumes, oud oils, attar, and bakhoor. Home to traditional perfumers who can create custom blends to your preference.",
    location: "Deira",
    image: "gradient:from-travi-purple via-travi-purple/80 to-travi-pink/70"
  },
  {
    id: "textile-souk",
    name: "Textile Souk",
    specialty: "Fabrics & Tailoring",
    description: "Vibrant market offering silk, cotton, lace, and embroidered fabrics. Many shops offer expert tailoring services at competitive prices.",
    location: "Bur Dubai",
    image: "gradient:from-travi-pink via-travi-pink/80 to-travi-pink/70"
  },
  {
    id: "souk-madinat",
    name: "Souk Madinat Jumeirah",
    specialty: "Modern Heritage Shopping",
    description: "Luxurious recreation of a traditional Arabian marketplace featuring boutique shops, waterways, and stunning views of Burj Al Arab.",
    location: "Jumeirah",
    image: "gradient:from-travi-green via-travi-green/80 to-travi-green/70"
  },
  {
    id: "souk-al-bahar",
    name: "Souk Al Bahar",
    specialty: "Downtown Shopping",
    description: "Arabian-style souk in the heart of Downtown Dubai overlooking the Dubai Fountain and Burj Khalifa. Features 100+ boutiques and restaurants.",
    location: "Downtown Dubai",
    image: "gradient:from-[#504065] via-[#A79FB2] to-[#504065]/70"
  }
];

const SHOPPING_DISTRICTS: ShoppingDistrict[] = [
  {
    id: "downtown",
    name: "Downtown Dubai",
    description: "Home to The Dubai Mall and luxury boutiques along Boulevard. The epicenter of high-end shopping in the Middle East.",
    vibe: "Luxury & High-End",
    image: "gradient:from-[#504065] via-[#24103E] to-[#504065]/70"
  },
  {
    id: "marina",
    name: "Dubai Marina",
    description: "Waterfront shopping at Dubai Marina Mall with stunning yacht harbor views. Perfect blend of retail and leisure.",
    vibe: "Waterfront Lifestyle",
    image: "gradient:from-[#01BEFF] via-[#01BEFF]/80 to-[#6443F4]/70"
  },
  {
    id: "city-walk",
    name: "City Walk",
    description: "Open-air lifestyle destination featuring designer boutiques, concept stores, and trendy cafes in a European-style setting.",
    vibe: "Designer Boutiques",
    image: "gradient:from-travi-pink via-travi-pink/80 to-travi-pink/70"
  },
  {
    id: "jbr-walk",
    name: "JBR The Walk",
    description: "Beachside promenade lined with shops, restaurants, and entertainment. A favorite for both shopping and people-watching.",
    vibe: "Beachside Retail",
    image: "gradient:from-[#FFD112] via-[#FF9327] to-[#FFD112]/70"
  },
  {
    id: "difc",
    name: "DIFC Gate Avenue",
    description: "Sophisticated shopping and art galleries in Dubai's financial hub. Features contemporary art, fine dining, and luxury retail.",
    vibe: "Art & Luxury",
    image: "gradient:from-travi-purple via-travi-purple/80 to-travi-purple/70"
  }
];

const WHAT_TO_BUY: ShoppingCategory[] = [
  { id: "gold", name: "Gold & Jewelry", description: "Dubai is the City of Gold with some of the world's best prices and craftsmanship", icon: Gem, gradient: "from-[#FF9327] to-[#FFD112]" },
  { id: "perfumes", name: "Perfumes & Oud", description: "Traditional Arabic perfumes and precious oud oils unique to the region", icon: Sparkles, gradient: "from-[#F94498] to-[#FDA9E5]" },
  { id: "electronics", name: "Electronics", description: "Tax-free electronics at competitive prices in dedicated tech zones", icon: Smartphone, gradient: "from-[#01BEFF] to-[#6443F4]" },
  { id: "textiles", name: "Textiles & Fabrics", description: "Luxurious fabrics from silk to cotton with expert tailoring services", icon: Shirt, gradient: "from-[#6443F4] to-[#9077EF]" },
  { id: "spices", name: "Dates & Spices", description: "Premium dates, saffron, and exotic spices straight from the souks", icon: Coffee, gradient: "from-[#02A65C] to-[#59ED63]" },
  { id: "watches", name: "Luxury Watches", description: "Major brands at tax-free prices in authorized dealers across Dubai", icon: Watch, gradient: "from-[#FF9327] to-[#F94498]" }
];

const SHOPPING_TIPS = [
  {
    icon: Gift,
    title: "Dubai Shopping Festival",
    description: "December to January features massive discounts, raffles, and entertainment. The best time for bargain hunters.",
    highlight: "Dec-Jan"
  },
  {
    icon: Percent,
    title: "Tax-Free Shopping",
    description: "Tourists can claim VAT refunds on purchases over AED 250. Look for Tax Free Dubai stickers in stores.",
    highlight: "5% VAT Refund"
  },
  {
    icon: Clock,
    title: "Best Shopping Hours",
    description: "Malls are open 10am-10pm weekdays, until midnight on weekends. Souks are best visited morning or evening.",
    highlight: "10am-12am"
  },
  {
    icon: CreditCard,
    title: "Bargaining in Souks",
    description: "Negotiate prices in traditional souks - starting at 50% of asking price is acceptable. Fixed prices in malls.",
    highlight: "Souks Only"
  }
];

export default function PublicShopping() {
  const { localePath, isRTL } = useLocale();

  useDocumentMeta({
    title: "Dubai Shopping Malls & Souks | Complete Guide 2025 | Travi",
    description: "Explore 50+ shopping malls, traditional souks, and tax-free shopping in Dubai. From the world's largest mall to historic gold markets - your complete Dubai shopping guide."
  });

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Shopping" }
  ];

  return (
    <PageContainer navVariant="transparent">
      <PublicHero
        title="Dubai Shopping Malls & Souks"
        subtitle="From world-class mega malls to centuries-old traditional markets - discover the ultimate shopping paradise"
        breadcrumbs={breadcrumbs}
        size="large"
      >
        <div className={cn("flex flex-col sm:flex-row gap-4", isRTL && "sm:flex-row-reverse")}>
          <Button 
            size="lg" 
            className="bg-white text-[#6443F4] font-semibold shadow-xl shadow-black/20 border-0" 
            data-testid="button-explore-malls"
          >
            <Building2 className="w-5 h-5 me-2" />
            Explore Mega Malls
            <ArrowRight className={cn("w-5 h-5 ms-2", isRTL && "rotate-180")} />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-2 border-white/40 text-white bg-white/10 backdrop-blur-md font-semibold" 
            data-testid="button-discover-souks"
          >
            <Landmark className="w-5 h-5 me-2" />
            Discover Souks
          </Button>
        </div>
      </PublicHero>

      {/* Mega Malls Section */}
      <Section
        id="mega-malls"
        title="Mega Malls of Dubai"
        subtitle="Experience shopping at its finest in Dubai's iconic mega malls, each offering unique attractions and thousands of stores"
      >
        <CategoryGrid columns={3}>
          {MEGA_MALLS.map((mall) => {
            const gradientClass = mall.image.replace("gradient:", "bg-gradient-to-br ");
            return (
              <Card key={mall.id} className="group overflow-visible hover-elevate rounded-[16px]" data-testid={`card-mall-${mall.id}`}>
                <div className={cn("relative h-48 overflow-hidden rounded-t-[16px]", gradientClass)}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Building2 className="w-16 h-16 text-white/30" />
                  </div>
                  <div className={cn("absolute top-4", isRTL ? "left-4" : "right-4")}>
                    <Badge className="bg-white/90 text-foreground border-0">
                      <Store className={cn("w-3 h-3", isRTL ? "ml-1" : "mr-1")} />
                      {mall.stores} stores
                    </Badge>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-heading text-lg font-bold text-foreground">{mall.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{mall.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4 text-[#6443F4] shrink-0" />
                    <span>{mall.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {mall.highlights.slice(0, 3).map((highlight) => (
                      <Badge key={highlight} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </CategoryGrid>
      </Section>

      {/* Traditional Souks Section */}
      <Section
        id="souks"
        variant="alternate"
        title="Traditional Souks"
        subtitle="Step back in time and explore Dubai's historic markets, where centuries-old trading traditions meet modern commerce"
      >
        <CategoryGrid columns={3}>
          {TRADITIONAL_SOUKS.map((souk) => {
            const gradientClass = souk.image.replace("gradient:", "bg-gradient-to-br ");
            return (
              <Card key={souk.id} className="group overflow-visible hover-elevate rounded-[16px]" data-testid={`card-souk-${souk.id}`}>
                <div className={cn("relative h-48 overflow-hidden rounded-t-[16px]", gradientClass)}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Landmark className="w-16 h-16 text-white/30" />
                  </div>
                  <div className={cn("absolute top-4", isRTL ? "right-4" : "left-4")}>
                    <Badge className="bg-white/90 backdrop-blur-sm text-foreground border-0">
                      {souk.specialty}
                    </Badge>
                  </div>
                  {souk.established && (
                    <div className={cn("absolute top-4", isRTL ? "left-4" : "right-4")}>
                      <Badge className="bg-white/90 text-foreground border-0">
                        Est. {souk.established}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2">{souk.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{souk.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-[#FF9327] shrink-0" />
                    <span>{souk.location}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </CategoryGrid>
      </Section>

      {/* Shopping Districts Section */}
      <Section
        id="districts"
        title="Shopping Districts"
        subtitle="Explore Dubai's diverse shopping neighborhoods, each with its own unique character and retail offerings"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-[30px]">
          {SHOPPING_DISTRICTS.map((district) => {
            const gradientClass = district.image.replace("gradient:", "bg-gradient-to-br ");
            return (
              <Card key={district.id} className="group overflow-visible hover-elevate rounded-[16px]" data-testid={`card-district-${district.id}`}>
                <div className={cn("relative h-36 overflow-hidden rounded-t-[16px]", gradientClass)}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-white/30" />
                  </div>
                  <div className={cn("absolute bottom-3", isRTL ? "right-3 left-3" : "left-3 right-3")}>
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs">
                      {district.vibe}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-heading font-bold text-foreground mb-1">{district.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{district.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* Shopping Tips Section */}
      <Section
        id="tips"
        variant="alternate"
        title="Shopping Tips"
        subtitle="Make the most of your Dubai shopping experience with these essential tips"
      >
        <CategoryGrid columns={4}>
          {SHOPPING_TIPS.map((tip, index) => (
            <Card key={index} className="p-5 text-center hover-elevate overflow-visible rounded-[16px]" data-testid={`card-tip-${index}`}>
              <div className="w-16 h-16 rounded-full bg-[#6443F4]/10 flex items-center justify-center mx-auto mb-4">
                <tip.icon className="w-8 h-8 text-[#6443F4]" />
              </div>
              <Badge className="mb-3 bg-gradient-to-r from-[#FF9327] to-[#FFD112] text-white border-0">
                {tip.highlight}
              </Badge>
              <h3 className="font-heading text-lg font-bold text-foreground mb-2">{tip.title}</h3>
              <p className="text-sm text-muted-foreground">{tip.description}</p>
            </Card>
          ))}
        </CategoryGrid>
      </Section>

      {/* What to Buy Section */}
      <Section
        id="what-to-buy"
        title="What to Buy in Dubai"
        subtitle="Discover the best items to bring home from your Dubai shopping adventure"
      >
        <CategoryGrid columns={3}>
          {WHAT_TO_BUY.map((category) => (
            <Card key={category.id} className="p-5 hover-elevate overflow-visible rounded-[16px]" data-testid={`card-buy-${category.id}`}>
              <div className="flex items-start gap-4">
                <div className={cn("w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0", category.gradient)}>
                  <category.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </CategoryGrid>
      </Section>

      {/* CTA Section */}
      <section className="py-[60px] bg-gradient-to-r from-[#6443F4] to-[#F94498]" data-testid="section-cta">
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <h2 className="font-heading text-2xl md:text-3xl lg:text-[32px] font-bold text-white mb-6">
            Ready to Shop Till You Drop?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Plan your ultimate Dubai shopping experience with our comprehensive guides to attractions, hotels, and dining
          </p>
          <div className={cn("flex flex-wrap justify-center gap-4", isRTL && "flex-row-reverse")}>
            <Link href={localePath("/attractions")}>
              <Button size="lg" className="bg-white text-[#6443F4] border-0" data-testid="button-cta-attractions">
                Explore Attractions
                <ChevronRight className={cn("w-5 h-5 ms-2", isRTL && "rotate-180")} />
              </Button>
            </Link>
            <Link href={localePath("/hotels")}>
              <Button size="lg" variant="outline" className="border-white/30 text-white bg-white/10" data-testid="button-cta-hotels">
                Find Hotels
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
