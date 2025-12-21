import { Link } from "wouter";
import {
  ShoppingBag, MapPin, Star, Clock, Gem, Store, Building2,
  Sparkles, Crown, Gift, Percent, CreditCard, Package,
  ChevronRight, ArrowRight, Landmark, Coffee, Shirt,
  Watch, Smartphone, Palette
} from "lucide-react";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/LocaleRouter";

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
    image: "https://images.unsplash.com/photo-1614531341773-3bff8b7cb3fc?w=800&h=600&fit=crop"
  },
  {
    id: "mall-of-emirates",
    name: "Mall of the Emirates",
    description: "Home to Ski Dubai, the Middle East's first indoor ski resort, featuring 630+ outlets and Magic Planet entertainment center.",
    highlights: ["Ski Dubai", "Magic Planet", "VOX Cinemas", "Luxury Fashion"],
    stores: "630+",
    location: "Al Barsha",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop"
  },
  {
    id: "ibn-battuta",
    name: "Ibn Battuta Mall",
    description: "World's largest themed shopping mall celebrating the journeys of famous explorer Ibn Battuta, featuring 6 stunning courts from China to Andalusia.",
    highlights: ["6 Themed Courts", "IMAX Theatre", "270+ Stores", "Cultural Architecture"],
    stores: "270+",
    location: "Jebel Ali",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=600&fit=crop"
  },
  {
    id: "festival-city",
    name: "Dubai Festival City Mall",
    description: "Waterfront destination featuring the spectacular IMAGINE show with water, fire, laser and projection effects against the Dubai skyline.",
    highlights: ["IMAGINE Show", "Waterfront Dining", "IKEA", "Robinsons"],
    stores: "400+",
    location: "Festival City",
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=600&fit=crop"
  },
  {
    id: "dubai-hills",
    name: "Dubai Hills Mall",
    description: "Dubai's newest luxury shopping destination home to The Storm Coaster, the world's fastest vertical-launch roller coaster integrated into a mall.",
    highlights: ["Storm Coaster", "Roxy Cinemas", "Sky Terrace", "Luxury Brands"],
    stores: "650+",
    location: "Dubai Hills Estate",
    image: "https://images.unsplash.com/photo-1567449303078-57ad995bd329?w=800&h=600&fit=crop"
  },
  {
    id: "wafi-mall",
    name: "Wafi Mall",
    description: "Stunning Egyptian-themed mall featuring pyramid architecture, stained glass domes, and the authentic Khan Murjan Souk with 125 artisan shops.",
    highlights: ["Khan Murjan Souk", "Egyptian Theme", "Fine Dining", "Artisan Crafts"],
    stores: "350+",
    location: "Umm Hurair",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop"
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
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop"
  },
  {
    id: "spice-souk",
    name: "Spice Souk",
    specialty: "Herbs & Spices",
    description: "A sensory journey through exotic spices, herbs, frankincense, saffron, and traditional Middle Eastern ingredients. Perfect for culinary enthusiasts.",
    location: "Deira",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=600&fit=crop"
  },
  {
    id: "perfume-souk",
    name: "Perfume Souk",
    specialty: "Arabic Perfumes",
    description: "Discover authentic Arabic perfumes, oud oils, attar, and bakhoor. Home to traditional perfumers who can create custom blends to your preference.",
    location: "Deira",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=600&fit=crop"
  },
  {
    id: "textile-souk",
    name: "Textile Souk",
    specialty: "Fabrics & Tailoring",
    description: "Vibrant market offering silk, cotton, lace, and embroidered fabrics. Many shops offer expert tailoring services at competitive prices.",
    location: "Bur Dubai",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
  },
  {
    id: "souk-madinat",
    name: "Souk Madinat Jumeirah",
    specialty: "Modern Heritage Shopping",
    description: "Luxurious recreation of a traditional Arabian marketplace featuring boutique shops, waterways, and stunning views of Burj Al Arab.",
    location: "Jumeirah",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop"
  },
  {
    id: "souk-al-bahar",
    name: "Souk Al Bahar",
    specialty: "Downtown Shopping",
    description: "Arabian-style souk in the heart of Downtown Dubai overlooking the Dubai Fountain and Burj Khalifa. Features 100+ boutiques and restaurants.",
    location: "Downtown Dubai",
    image: "https://images.unsplash.com/photo-1583681234900-f18c3e0e0f98?w=800&h=600&fit=crop"
  }
];

const SHOPPING_DISTRICTS: ShoppingDistrict[] = [
  {
    id: "downtown",
    name: "Downtown Dubai",
    description: "Home to The Dubai Mall and luxury boutiques along Boulevard. The epicenter of high-end shopping in the Middle East.",
    vibe: "Luxury & High-End",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop"
  },
  {
    id: "marina",
    name: "Dubai Marina",
    description: "Waterfront shopping at Dubai Marina Mall with stunning yacht harbor views. Perfect blend of retail and leisure.",
    vibe: "Waterfront Lifestyle",
    image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&h=600&fit=crop"
  },
  {
    id: "city-walk",
    name: "City Walk",
    description: "Open-air lifestyle destination featuring designer boutiques, concept stores, and trendy cafes in a European-style setting.",
    vibe: "Designer Boutiques",
    image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&h=600&fit=crop"
  },
  {
    id: "jbr-walk",
    name: "JBR The Walk",
    description: "Beachside promenade lined with shops, restaurants, and entertainment. A favorite for both shopping and people-watching.",
    vibe: "Beachside Retail",
    image: "https://images.unsplash.com/photo-1571406761485-2cb1f2e2c8b5?w=800&h=600&fit=crop"
  },
  {
    id: "difc",
    name: "DIFC Gate Avenue",
    description: "Sophisticated shopping and art galleries in Dubai's financial hub. Features contemporary art, fine dining, and luxury retail.",
    vibe: "Art & Luxury",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"
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
  const { localePath } = useLocale();

  useDocumentMeta({
    title: "Dubai Shopping Malls & Souks | Complete Guide 2025 | Travi",
    description: "Explore 50+ shopping malls, traditional souks, and tax-free shopping in Dubai. From the world's largest mall to historic gold markets - your complete Dubai shopping guide.",
    keywords: "Dubai shopping, Dubai Mall, Mall of Emirates, Gold Souk, Dubai souks, tax-free shopping Dubai, Dubai Shopping Festival, luxury shopping Dubai"
  });

  return (
    <div className="min-h-screen bg-background">
      <PublicNav variant="transparent" />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1614531341773-3bff8b7cb3fc?w=1920&h=1080&fit=crop')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
          <Badge className="mb-6 bg-white/10 backdrop-blur-sm border-white/20 text-white px-4 py-2">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Premium Shopping Destination
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight" data-testid="text-hero-title">
            Dubai Shopping Malls & Souks
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto" data-testid="text-hero-tagline">
            From Mega Malls to Traditional Markets
          </p>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12">
            {[
              { label: "50+ Malls", icon: Building2 },
              { label: "10,000+ Stores", icon: Store },
              { label: "Traditional Souks", icon: Landmark },
              { label: "Tax-Free Shopping", icon: Percent }
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2" data-testid={`stat-${stat.label.toLowerCase().replace(/[+\s]/g, '-')}`}>
                <stat.icon className="w-5 h-5 text-[#FF9327]" />
                <span className="text-white font-medium">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-[#6C5CE7] to-[#F94498] text-white border-0" data-testid="button-explore-malls">
              Explore Mega Malls
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white bg-white/10 backdrop-blur-sm" data-testid="button-discover-souks">
              Discover Souks
            </Button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Mega Malls Section */}
      <section className="py-20 md:py-28" data-testid="section-mega-malls">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-[#6C5CE7]/10 to-[#F94498]/10 text-[#6C5CE7] border-[#6C5CE7]/20">
              <Crown className="w-4 h-4 mr-2" />
              World-Class Destinations
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground" data-testid="text-malls-title">
              Mega Malls of Dubai
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience shopping at its finest in Dubai's iconic mega malls, each offering unique attractions and thousands of stores
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MEGA_MALLS.map((mall) => (
              <Card key={mall.id} className="group overflow-visible hover-elevate" data-testid={`card-mall-${mall.id}`}>
                <div className="relative h-48 overflow-hidden rounded-t-md">
                  <img
                    src={mall.image}
                    alt={mall.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-foreground border-0">
                      <Store className="w-3 h-3 mr-1" />
                      {mall.stores} stores
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-xl font-bold text-foreground">{mall.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{mall.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4 text-[#6C5CE7]" />
                    {mall.location}
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
            ))}
          </div>
        </div>
      </section>

      {/* Traditional Souks Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-background" data-testid="section-souks">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-[#FF9327]/10 to-[#FFD112]/10 text-[#FF9327] border-[#FF9327]/20">
              <Landmark className="w-4 h-4 mr-2" />
              Heritage & Tradition
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground" data-testid="text-souks-title">
              Traditional Souks
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Step back in time and explore Dubai's historic markets, where centuries-old trading traditions meet modern commerce
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TRADITIONAL_SOUKS.map((souk) => (
              <Card key={souk.id} className="group overflow-visible hover-elevate" data-testid={`card-souk-${souk.id}`}>
                <div className="relative h-48 overflow-hidden rounded-t-md">
                  <img
                    src={souk.image}
                    alt={souk.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gradient-to-r from-[#FF9327] to-[#FFD112] text-white border-0">
                      {souk.specialty}
                    </Badge>
                  </div>
                  {souk.established && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-foreground border-0">
                        Est. {souk.established}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2">{souk.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{souk.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-[#FF9327]" />
                    {souk.location}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Shopping Districts Section */}
      <section className="py-20 md:py-28" data-testid="section-districts">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-[#02A65C]/10 to-[#59ED63]/10 text-[#02A65C] border-[#02A65C]/20">
              <MapPin className="w-4 h-4 mr-2" />
              Shopping Neighborhoods
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground" data-testid="text-districts-title">
              Shopping Districts
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore Dubai's diverse shopping neighborhoods, each with its own unique character and retail offerings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {SHOPPING_DISTRICTS.map((district) => (
              <Card key={district.id} className="group overflow-visible hover-elevate" data-testid={`card-district-${district.id}`}>
                <div className="relative h-36 overflow-hidden rounded-t-md">
                  <img
                    src={district.image}
                    alt={district.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs">
                      {district.vibe}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-foreground mb-1">{district.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{district.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Shopping Tips Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-background" data-testid="section-tips">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-[#01BEFF]/10 to-[#6443F4]/10 text-[#01BEFF] border-[#01BEFF]/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Insider Knowledge
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground" data-testid="text-tips-title">
              Shopping Tips
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Make the most of your Dubai shopping experience with these essential tips
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SHOPPING_TIPS.map((tip, index) => (
              <Card key={index} className="p-6 text-center hover-elevate overflow-visible" data-testid={`card-tip-${index}`}>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6C5CE7]/10 to-[#F94498]/10 flex items-center justify-center mx-auto mb-4">
                  <tip.icon className="w-8 h-8 text-[#6C5CE7]" />
                </div>
                <Badge className="mb-3 bg-gradient-to-r from-[#FF9327] to-[#FFD112] text-white border-0">
                  {tip.highlight}
                </Badge>
                <h3 className="text-lg font-bold text-foreground mb-2">{tip.title}</h3>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What to Buy Section */}
      <section className="py-20 md:py-28" data-testid="section-what-to-buy">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-[#F94498]/10 to-[#FDA9E5]/10 text-[#F94498] border-[#F94498]/20">
              <Package className="w-4 h-4 mr-2" />
              Must-Have Souvenirs
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground" data-testid="text-buy-title">
              What to Buy in Dubai
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the best items to bring home from your Dubai shopping adventure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHAT_TO_BUY.map((category) => (
              <Card key={category.id} className="p-6 hover-elevate overflow-visible" data-testid={`card-buy-${category.id}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center flex-shrink-0`}>
                    <category.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-[#6C5CE7] to-[#F94498]" data-testid="section-cta">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Shop Till You Drop?
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Plan your ultimate Dubai shopping experience with our comprehensive guides to attractions, hotels, and dining
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href={localePath("/attractions")}>
              <Button size="lg" className="bg-white text-[#6C5CE7] border-0" data-testid="button-cta-attractions">
                Explore Attractions
                <ChevronRight className="ml-2 w-5 h-5" />
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

      <PublicFooter />
    </div>
  );
}
