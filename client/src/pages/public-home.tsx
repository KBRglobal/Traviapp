import { Search, Star, MapPin, ChevronRight, Mail, BookOpen, Users, Globe, Building, UtensilsCrossed, Calendar, Clock, DollarSign, ArrowRight, Check, Newspaper } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import type { Content, ContentWithRelations } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { useLocale } from "@/lib/i18n/LocaleRouter";

interface HomepagePromotion {
  id: string;
  section: string;
  contentId: string | null;
  position: number;
  isActive: boolean;
  customTitle: string | null;
  customImage: string | null;
  content?: ContentWithRelations;
}

const heroImage = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop&q=80";

const categories = [
  { key: "attractions", icon: Building, count: 156, color: "#6C5CE7" },
  { key: "hotels", icon: Building, count: 89, color: "#EC4899" },
  { key: "dining", icon: UtensilsCrossed, count: 34, color: "#F59E0B" },
  { key: "districts", icon: MapPin, count: 12, color: "#10B981" },
  { key: "news", icon: Newspaper, count: 568, color: "#3B82F6" },
  { key: "events", icon: Calendar, count: 45, color: "#8B5CF6" },
];

const topAttractions = [
  { name: "Burj Khalifa", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop", rating: 4.9, area: "Downtown", price: "From $35", slug: "burj-khalifa" },
  { name: "Dubai Mall", image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?w=400&h=300&fit=crop", rating: 4.8, area: "Downtown", price: "Free", slug: "dubai-mall" },
  { name: "Desert Safari", image: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=400&h=300&fit=crop", rating: 4.7, area: "Desert", price: "From $65", slug: "desert-safari" },
  { name: "Palm Jumeirah", image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=400&h=300&fit=crop", rating: 4.8, area: "Palm", price: "Free", slug: "palm-jumeirah" },
];

const districts = [
  { name: "Downtown Dubai", attractions: 45, restaurants: 23, image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop", slug: "downtown" },
  { name: "Dubai Marina", attractions: 28, restaurants: 41, image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400&h=300&fit=crop", slug: "marina" },
  { name: "Old Dubai", attractions: 32, restaurants: 15, image: "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=400&h=300&fit=crop", slug: "old-dubai" },
];

const hotels = [
  { name: "Atlantis The Royal", image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop", stars: 5, area: "Palm", price: "From $800", slug: "atlantis-royal" },
  { name: "Burj Al Arab", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop", stars: 5, area: "Jumeirah", price: "From $2000", slug: "burj-al-arab" },
  { name: "JW Marriott", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop", stars: 5, area: "Marina", price: "From $350", slug: "jw-marriott" },
  { name: "Rove Downtown", image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop", stars: 4, area: "Downtown", price: "From $120", slug: "rove-downtown" },
];

const restaurants = [
  { name: "Nobu", cuisine: "Japanese", priceLevel: "$$$$", area: "Downtown", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop", slug: "nobu" },
  { name: "SALT Burger", cuisine: "Burgers", priceLevel: "$", area: "Various", image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop", slug: "salt-burger" },
  { name: "Pierchic", cuisine: "Seafood", priceLevel: "$$$$", area: "Jumeirah", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop", slug: "pierchic" },
  { name: "Ravi Restaurant", cuisine: "Pakistani", priceLevel: "$", area: "Satwa", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop", slug: "ravi" },
];

const upcomingEvents = [
  { date: "Dec 22", title: "Dubai Shopping Festival Opening", slug: "dsf-2024" },
  { date: "Dec 23", title: "Burj Khalifa NYE Rehearsal (Free!)", slug: "nye-rehearsal" },
  { date: "Dec 25", title: "Christmas Markets at Madinat", slug: "christmas-markets" },
  { date: "Dec 31", title: "New Year's Eve Fireworks", slug: "nye-fireworks" },
];

const popularGuides = [
  { title: "Best Time to Visit Dubai", slug: "best-time-visit" },
  { title: "Dubai on a Budget", slug: "budget-guide" },
  { title: "What to Pack", slug: "packing-list" },
  { title: "Laws Tourists Should Know", slug: "laws-for-tourists" },
  { title: "First Time in Dubai? Read This", slug: "first-time-guide" },
];

export default function PublicHome() {
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [, setLocation] = useLocation();
  const { t, localePath, isRTL } = useLocale();

  useDocumentMeta({
    title: "Travi - Dubai Travel Guide | Things to Do, Hotels & Attractions",
    description: "The most comprehensive guide to Dubai's attractions, hotels & hidden gems. Written by local experts in 17 languages.",
    ogTitle: "Travi - Discover Dubai Like a Local",
    ogDescription: "The most comprehensive guide to Dubai's attractions, hotels & hidden gems.",
    ogType: "website",
  });

  const { data: publishedContent = [] } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/contents?status=published"],
  });

  const { data: featuredPromotions = [] } = useQuery<HomepagePromotion[]>({
    queryKey: ["/api/homepage-promotions/featured"],
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setLocation(localePath(`/search?q=${encodeURIComponent(searchQuery.trim())}`));
    }
  };

  const contentByType = (type: string) => publishedContent.filter(c => c.type === type);
  const attractionsContent = contentByType("attraction").slice(0, 4);
  const articlesContent = contentByType("article").slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md">
        {t("home.skipToMain")}
      </a>

      <PublicNav />

      <main id="main-content">
        {/* 1. HERO SECTION - SEO Focused */}
        <section className="relative min-h-[80vh] flex items-center" data-testid="section-hero">
          <div className="absolute inset-0">
            <img 
              src={heroImage} 
              alt="Dubai skyline with Burj Khalifa"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
            <div className="max-w-2xl" dir={isRTL ? "rtl" : "ltr"}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                {t("home.heroTitleNew") || "Discover Dubai Like a Local"}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                {t("home.heroSubtitleNew") || "The most comprehensive guide to Dubai's attractions, hotels & hidden gems."}
              </p>

              {/* Search Bar */}
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSearch(); }} 
                role="search" 
                className="mb-8"
              >
                <div className="bg-white rounded-full shadow-xl p-2 flex items-center">
                  <div className="flex-1 flex items-center gap-3 px-4">
                    <Search className="w-5 h-5 text-muted-foreground shrink-0" aria-hidden="true" />
                    <input
                      type="search"
                      placeholder={t("home.searchPlaceholder")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 min-w-0 text-foreground placeholder:text-muted-foreground bg-transparent outline-none py-3 text-base"
                      data-testid="input-search"
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="rounded-full px-6 py-3 shrink-0" 
                    data-testid="button-search"
                  >
                    {t("common.search") || "Search"}
                  </Button>
                </div>
              </form>

              {/* Social Proof */}
              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span className="font-semibold">{t("home.guidesCount") || "847 Guides"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">{t("home.viewsCount") || "2.3M Views"}</span>
                </div>
              </div>
            </div>

            {/* Category Quick Links */}
            <div className="mt-12 grid grid-cols-3 md:grid-cols-6 gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link 
                    key={cat.key} 
                    href={localePath(`/${cat.key}`)}
                    data-testid={`category-${cat.key}`}
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover-elevate cursor-pointer border border-white/20">
                      <Icon className="w-6 h-6 mx-auto mb-2 text-white" />
                      <div className="text-white font-medium text-sm">{t(`nav.${cat.key}`)}</div>
                      <div className="text-white/70 text-xs">{cat.count}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* 2. WHY TRAVI - Trust Section */}
        <section className="py-16 bg-muted/30" data-testid="section-trust">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" dir={isRTL ? "rtl" : "ltr"}>
              {t("home.whyTravi") || "Why 2 Million Travelers Trust Travi"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t("home.localExperts") || "Local Experts"}</h3>
                <p className="text-muted-foreground">
                  {t("home.localExpertsDesc") || "Written by Dubai residents who know every hidden corner"}
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t("home.inDepthGuides") || "In-Depth Guides"}</h3>
                <p className="text-muted-foreground">
                  {t("home.inDepthGuidesDesc") || "1500+ words per guide on average"}
                </p>
              </Card>

              <Card className="p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{t("home.multiLanguage") || "17 Languages"}</h3>
                <p className="text-muted-foreground">
                  {t("home.multiLanguageDesc") || "Read in your native language"}
                </p>
              </Card>
            </div>

            <p className="text-center text-lg italic text-muted-foreground">
              "{t("home.testimonial") || "The most detailed Dubai guide I've found"}" - TripAdvisor
            </p>
          </div>
        </section>

        {/* 3. TOP ATTRACTIONS */}
        <section className="py-16 bg-background" data-testid="section-attractions">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
              <h2 className="text-3xl md:text-4xl font-bold" dir={isRTL ? "rtl" : "ltr"}>
                {t("home.topAttractionsTitle") || "Top Attractions in Dubai"}
              </h2>
              <Link href={localePath("/attractions")}>
                <Button variant="outline" className="rounded-full">
                  {t("home.viewAll")} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(attractionsContent.length > 0 ? attractionsContent : topAttractions).map((item, index) => {
                const isContent = 'id' in item;
                const name = isContent ? (item as ContentWithRelations).title : (item as typeof topAttractions[0]).name;
                const image = isContent ? (item as ContentWithRelations).heroImage : (item as typeof topAttractions[0]).image;
                const slug = isContent ? (item as ContentWithRelations).slug : (item as typeof topAttractions[0]).slug;
                const attraction = item as typeof topAttractions[0];
                
                return (
                  <Link 
                    key={index} 
                    href={localePath(`/attractions/${slug}`)}
                    data-testid={`attraction-card-${index}`}
                  >
                    <Card className="overflow-hidden hover-elevate cursor-pointer h-full">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img 
                          src={image || topAttractions[index % topAttractions.length].image}
                          alt={name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{name}</h3>
                        {!isContent && (
                          <>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span>{attraction.rating}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                              <MapPin className="w-4 h-4" />
                              <span>{attraction.area}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-primary">
                              <DollarSign className="w-4 h-4" />
                              <span>{attraction.price}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. EXPLORE BY DISTRICT */}
        <section className="py-16 bg-muted/30" data-testid="section-districts">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-8" dir={isRTL ? "rtl" : "ltr"}>
              {t("home.exploreByArea") || "Explore Dubai by Area"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {districts.map((district, index) => (
                <Link 
                  key={index} 
                  href={localePath(`/districts/${district.slug}`)}
                  data-testid={`district-card-${index}`}
                >
                  <Card className="overflow-hidden hover-elevate cursor-pointer h-full">
                    <div className="aspect-video overflow-hidden relative">
                      <img 
                        src={district.image}
                        alt={district.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <h3 className="absolute bottom-4 left-4 text-white font-bold text-xl">{district.name}</h3>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{district.attractions} {t("nav.attractions").toLowerCase()}</span>
                        <span>{district.restaurants} {t("home.restaurantsLabel") || "restaurants"}</span>
                      </div>
                      <span className="text-primary font-medium text-sm flex items-center gap-1 mt-2">
                        {t("home.explore") || "Explore"} <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 5. BEST HOTELS */}
        <section className="py-16 bg-background" data-testid="section-hotels">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
              <h2 className="text-3xl md:text-4xl font-bold" dir={isRTL ? "rtl" : "ltr"}>
                {t("home.whereToStay") || "Where to Stay in Dubai"}
              </h2>
              <Link href={localePath("/hotels")}>
                <Button variant="outline" className="rounded-full">
                  {t("home.viewAll")} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              {["All", "Luxury 5*", "Mid-Range", "Budget", "Beach", "City"].map((filter) => (
                <Badge 
                  key={filter} 
                  variant={filter === "All" ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2 text-sm"
                >
                  {filter}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {hotels.map((hotel, index) => (
                <Link 
                  key={index} 
                  href={localePath(`/hotels/${hotel.slug}`)}
                  data-testid={`hotel-card-${index}`}
                >
                  <Card className="overflow-hidden hover-elevate cursor-pointer h-full">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{hotel.name}</h3>
                      <div className="flex items-center gap-1 mb-1">
                        {Array.from({ length: hotel.stars }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <MapPin className="w-4 h-4" />
                        <span>{hotel.area}</span>
                      </div>
                      <div className="text-sm font-medium text-primary">{hotel.price}</div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 6. LATEST ARTICLES */}
        <section className="py-16 bg-muted/30" data-testid="section-articles">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
              <h2 className="text-3xl md:text-4xl font-bold" dir={isRTL ? "rtl" : "ltr"}>
                {t("home.travelTips") || "Dubai Travel Tips & News"}
              </h2>
              <Link href={localePath("/news")}>
                <Button variant="outline" className="rounded-full">
                  {t("home.viewAll")} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Featured Article */}
              <div className="lg:col-span-2">
                <Link href={localePath("/dubai/free-things-to-do")} data-testid="featured-article">
                  <Card className="overflow-hidden hover-elevate cursor-pointer h-full">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=450&fit=crop"
                        alt="Free things to do in Dubai"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-3">
                        {t("home.featuredArticleTitle") || "70 Free Things to Do in Dubai (2024 Guide)"}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" /> Dec 15, 2024
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> 12 min read
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>

              {/* Popular Guides Sidebar */}
              <div>
                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    {t("home.popularGuides") || "Popular Guides"}
                  </h3>
                  <ul className="space-y-3">
                    {popularGuides.map((guide, index) => (
                      <li key={index}>
                        <Link 
                          href={localePath(`/dubai/${guide.slug}`)}
                          className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                        >
                          <ChevronRight className="w-4 h-4 text-primary" />
                          {guide.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* 7. BEST RESTAURANTS */}
        <section className="py-16 bg-background" data-testid="section-dining">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
              <h2 className="text-3xl md:text-4xl font-bold" dir={isRTL ? "rtl" : "ltr"}>
                {t("home.bestRestaurants") || "Best Restaurants in Dubai"}
              </h2>
              <Link href={localePath("/dining")}>
                <Button variant="outline" className="rounded-full">
                  {t("home.viewAll")} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              {["All", "Fine Dining", "Casual", "Brunches", "Street Food"].map((filter) => (
                <Badge 
                  key={filter} 
                  variant={filter === "All" ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2 text-sm"
                >
                  {filter}
                </Badge>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {restaurants.map((restaurant, index) => (
                <Link 
                  key={index} 
                  href={localePath(`/dining/${restaurant.slug}`)}
                  data-testid={`restaurant-card-${index}`}
                >
                  <Card className="overflow-hidden hover-elevate cursor-pointer h-full">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{restaurant.name}</h3>
                      <p className="text-sm text-muted-foreground mb-1">{restaurant.cuisine}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{restaurant.priceLevel}</span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {restaurant.area}
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 8. UPCOMING EVENTS */}
        <section className="py-16 bg-muted/30" data-testid="section-events">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
              <h2 className="text-3xl md:text-4xl font-bold" dir={isRTL ? "rtl" : "ltr"}>
                {t("home.whatsHappening") || "What's Happening in Dubai"}
              </h2>
              <Link href={localePath("/events")}>
                <Button variant="outline" className="rounded-full">
                  {t("home.viewAll")} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <Card className="overflow-hidden">
              <div className="bg-primary/5 px-6 py-3 border-b">
                <span className="font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {t("home.thisWeek") || "THIS WEEK"}
                </span>
              </div>
              <div className="divide-y">
                {upcomingEvents.map((event, index) => (
                  <Link 
                    key={index} 
                    href={localePath(`/events/${event.slug}`)}
                    data-testid={`event-item-${index}`}
                  >
                    <div className="px-6 py-4 flex items-center gap-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="bg-primary/10 rounded-lg px-3 py-2 text-center min-w-[60px]">
                        <span className="text-sm font-semibold text-primary">{event.date}</span>
                      </div>
                      <span className="font-medium">{event.title}</span>
                      <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* 9. NEWSLETTER */}
        <section className="py-16 bg-primary text-primary-foreground" data-testid="section-newsletter">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("home.newsletterTitle") || "Get Weekly Dubai Tips & Deals"}
            </h2>
            <p className="text-lg mb-8 opacity-90">
              {t("home.newsletterSubtitle") || "Join 50,000+ travelers who get our free guide"}
            </p>

            <form 
              onSubmit={(e) => e.preventDefault()} 
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-6"
            >
              <input
                type="email"
                placeholder={t("common.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-full text-foreground bg-white outline-none"
                data-testid="input-newsletter-email"
              />
              <Button 
                type="submit"
                variant="secondary"
                className="rounded-full px-8"
                data-testid="button-newsletter-subscribe"
              >
                {t("common.subscribe")}
              </Button>
            </form>

            <div className="flex flex-wrap justify-center gap-6 text-sm opacity-90">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" /> {t("home.freeGuide") || "Free Dubai Starter Guide"}
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" /> {t("home.exclusiveDeals") || "Exclusive Deals"}
              </span>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
