import { Search, Building2, Mountain, Landmark, BookOpen, Utensils, Bus, Sparkles, MapPin, Star, ArrowRight, Flame, Shield, Clock, Award } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import type { Content, ContentWithRelations } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicNav } from "@/components/public-nav";
import { useDocumentMeta } from "@/hooks/use-document-meta";

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

const defaultPlaceholderImages = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=1200&h=800&fit=crop",
  "https://images.unsplash.com/photo-1546412414-e1885259563a?w=1200&h=800&fit=crop",
];

const exploreCategories = [
  { icon: Building2, title: "Hotels", count: "500+ hotels", href: "/hotels", gradient: "from-[#6C5CE7] to-[#A855F7]" },
  { icon: Mountain, title: "Attractions", count: "200+ places", href: "/attractions", gradient: "from-[#A855F7] to-[#EC4899]" },
  { icon: Landmark, title: "Districts", count: "25 areas", href: "/districts", gradient: "from-[#EC4899] to-[#F97316]" },
  { icon: BookOpen, title: "News & Guides", count: "100+ articles", href: "/articles", gradient: "from-[#6C5CE7] to-[#8B5CF6]" },
  { icon: Utensils, title: "Dining", count: "300+ restaurants", href: "/dining", gradient: "from-[#A855F7] to-[#EC4899]" },
  { icon: Bus, title: "Transport", count: "50+ options", href: "/transport", gradient: "from-[#8B5CF6] to-[#A855F7]" },
];

const whyChooseCards = [
  { icon: Award, title: "Curated Experiences", description: "Handpicked destinations and hidden gems, personally reviewed by travel experts." },
  { icon: Shield, title: "Trusted Reviews", description: "Authentic ratings from real travelers who've explored Dubai firsthand." },
  { icon: Clock, title: "Real-Time Updates", description: "Live information on events, deals, and what's happening right now." },
];

export default function PublicHome() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();

  useDocumentMeta({
    title: "Travi - Discover Dubai | Hotels, Attractions & Travel Guides",
    description: "Explore world-class hotels, stunning attractions, and unforgettable experiences in Dubai. Plan your perfect Dubai adventure with Travi.",
    ogTitle: "Travi - Your Dubai Travel Companion",
    ogDescription: "Discover the magic of Dubai with curated hotels, attractions, and travel guides.",
    ogType: "website",
  });

  const { data: featuredPromotions = [] } = useQuery<HomepagePromotion[]>({
    queryKey: ["/api/homepage-promotions/featured"],
  });

  const { data: attractionsPromotions = [] } = useQuery<HomepagePromotion[]>({
    queryKey: ["/api/homepage-promotions/attractions"],
  });

  const { data: articlesPromotions = [] } = useQuery<HomepagePromotion[]>({
    queryKey: ["/api/homepage-promotions/articles"],
  });

  const { data: publishedContent } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/contents?status=published"],
  });

  const getActiveContent = (promotions: HomepagePromotion[]): ContentWithRelations[] => {
    return promotions
      .filter(p => p.isActive && p.content)
      .map(p => p.content!)
      .slice(0, 6);
  };

  const featuredContent = getActiveContent(featuredPromotions).length > 0 
    ? getActiveContent(featuredPromotions) 
    : (publishedContent?.slice(0, 6) || []);
  
  const attractionsContent = getActiveContent(attractionsPromotions).length > 0
    ? getActiveContent(attractionsPromotions)
    : (publishedContent?.filter(c => c.type === "attraction").slice(0, 4) || []);
  
  const articlesContent = getActiveContent(articlesPromotions).length > 0
    ? getActiveContent(articlesPromotions)
    : (publishedContent?.filter(c => c.type === "article").slice(0, 6) || []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getContentPath = (content: Content) => `/${content.type}s/${content.slug}`;

  return (
    <div className="bg-white min-h-screen">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md">
        Skip to main content
      </a>

      <PublicNav variant="transparent" />

      <main id="main-content">
        {/* SECTION 1 - HERO */}
        <section className="relative min-h-screen flex items-center justify-center brand-gradient noise-texture overflow-hidden" data-testid="section-hero">
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-32">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-5 py-2.5 mb-8">
              <Sparkles className="w-4 h-4 text-[#FACC15]" aria-hidden="true" />
              <span className="text-white text-sm font-medium">Your Dubai Travel Companion</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
              Discover the Magic of{" "}
              <span className="text-[#FACC15]">Dubai</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
              World-class hotels, iconic attractions, and expert travel guides — curated for you.
            </p>
            
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSearch(); }} 
              role="search" 
              className="bg-white rounded-2xl shadow-2xl p-2 flex items-center gap-2 max-w-xl mx-auto"
            >
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="w-5 h-5 text-[#475569] shrink-0" aria-hidden="true" />
                <label htmlFor="hero-search" className="sr-only">Search hotels, attractions, or guides</label>
                <input
                  id="hero-search"
                  type="search"
                  placeholder="Search hotels, attractions, or guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="flex-1 text-[#0F172A] placeholder:text-[#475569] bg-transparent outline-none py-3.5 text-base"
                  data-testid="input-search"
                />
              </div>
              <Button 
                type="submit"
                className="bg-[#EC4899] hover:bg-[#DB2777] text-white font-semibold rounded-xl px-6 py-6" 
                data-testid="button-search"
              >
                Search
              </Button>
            </form>
          </div>
        </section>

        {/* SECTION 2 - EXPLORE DUBAI */}
        <section className="py-16 lg:py-20 bg-white" data-testid="section-explore">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-4">Explore Dubai</h2>
              <p className="text-[#475569] text-lg max-w-2xl mx-auto">Navigate the city through curated categories</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
              {exploreCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Link
                    key={index}
                    href={category.href}
                    className="group flex flex-col items-center p-6 rounded-2xl bg-white border border-gray-100 hover:border-[#A855F7]/30 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300"
                    data-testid={`explore-${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-7 h-7 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-[#0F172A] text-center mb-1">{category.title}</h3>
                    <span className="text-sm text-[#475569]">{category.count}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 3 - HOT RIGHT NOW */}
        {featuredContent.length > 0 && featuredContent[0] && (
          <section className="py-16 lg:py-20 bg-white" data-testid="section-featured">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="mb-10">
                <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-2">Hot Right Now</h2>
                <p className="text-[#475569] text-lg">Trending places everyone's talking about</p>
              </div>
              
              <Link href={getContentPath(featuredContent[0])} data-testid="link-featured-content">
                <article className="group relative overflow-hidden rounded-3xl cursor-pointer aspect-[21/9]" data-testid="card-featured-content">
                  <img
                    src={featuredContent[0].heroImage || defaultPlaceholderImages[0]}
                    alt={featuredContent[0].heroImageAlt || featuredContent[0].title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  <div className="absolute top-6 left-6 flex items-center gap-3">
                    <Badge className="bg-[#EC4899] text-white border-0 px-4 py-1.5 text-sm font-medium">
                      <Flame className="w-4 h-4 mr-1.5" />
                      Trending
                    </Badge>
                    <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
                      <Star className="w-4 h-4 fill-[#FACC15] text-[#FACC15]" />
                      <span className="text-white text-sm font-medium">4.9</span>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <span className="text-[#A855F7] font-medium text-sm uppercase tracking-wide mb-3 block">
                      {featuredContent[0].type}
                    </span>
                    <h3 className="text-white font-bold text-2xl lg:text-4xl mb-3 max-w-2xl">
                      {featuredContent[0].title}
                    </h3>
                    <p className="text-white/80 text-base lg:text-lg max-w-2xl mb-6 line-clamp-2">
                      {featuredContent[0].metaDescription || "Discover this amazing destination in Dubai"}
                    </p>
                    <Button className="bg-white text-[#0F172A] hover:bg-white/90 font-semibold rounded-xl px-6" data-testid="button-explore-featured">
                      Explore
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </article>
              </Link>
            </div>
          </section>
        )}

        {/* SECTION 4 - POPULAR DESTINATIONS */}
        {attractionsContent.length > 0 && (
          <section className="py-16 lg:py-20 bg-white" data-testid="section-destinations">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-2">Popular Destinations</h2>
                  <p className="text-[#475569] text-lg">Explore Dubai's most loved experiences</p>
                </div>
                <Link href="/attractions" data-testid="link-view-all-destinations">
                  <Button variant="outline" className="hidden sm:flex border-[#A855F7] text-[#A855F7] hover:bg-[#A855F7] hover:text-white" data-testid="button-view-all-destinations">
                    View All <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {attractionsContent.slice(0, 4).map((content, index) => (
                  <Link key={content.id} href={`/attractions/${content.slug}`} data-testid={`link-destination-${content.id}`}>
                    <article className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-[3/4]" data-testid={`card-destination-${content.id}`}>
                      <img
                        src={content.heroImage || defaultPlaceholderImages[index % 4]}
                        alt={content.heroImageAlt || content.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-[#6C5CE7] text-white border-0 text-xs font-medium">
                          {content.type}
                        </Badge>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-4 h-4 fill-[#FACC15] text-[#FACC15]" />
                          <span className="text-white/90 text-sm font-medium">4.8</span>
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                          {content.title}
                        </h3>
                        <p className="text-white/70 text-sm line-clamp-2">
                          {content.metaDescription || "Discover this amazing place"}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
              
              <div className="mt-8 text-center sm:hidden">
                <Link href="/attractions" data-testid="link-view-all-destinations-mobile">
                  <Button className="bg-[#A855F7] hover:bg-[#9333EA] text-white font-semibold" data-testid="button-view-all-destinations-mobile">
                    View All Destinations
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 5 - LATEST NEWS & GUIDES */}
        {articlesContent.length > 0 && articlesContent[0] && (
          <section className="py-16 lg:py-20 bg-[#F8FAFC]" data-testid="section-articles">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-2">Latest News & Guides</h2>
                  <p className="text-[#475569] text-lg">Expert insights for your Dubai journey</p>
                </div>
                <Link href="/articles" data-testid="link-view-all-articles">
                  <Button variant="ghost" className="text-[#A855F7] hover:text-[#9333EA] hover:bg-[#A855F7]/10 font-medium" data-testid="button-view-all-articles">
                    All Articles <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
              
              <Link href={`/articles/${articlesContent[0].slug}`} data-testid="link-featured-article">
                <article className="group relative overflow-hidden rounded-3xl cursor-pointer aspect-[21/9]" data-testid="card-featured-article">
                  <img
                    src={articlesContent[0].heroImage || defaultPlaceholderImages[0]}
                    alt={articlesContent[0].heroImageAlt || articlesContent[0].title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  <div className="absolute top-6 left-6 flex items-center gap-3">
                    <Badge className="bg-white text-[#0F172A] border-0 px-4 py-1.5 text-sm font-semibold">
                      Featured
                    </Badge>
                    <Badge className="bg-[#6C5CE7] text-white border-0 px-3 py-1.5 text-sm">
                      Travel Guide
                    </Badge>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <h3 className="text-white font-bold text-2xl lg:text-4xl mb-3 max-w-3xl">
                      {articlesContent[0].title}
                    </h3>
                    <div className="flex items-center gap-4 text-white/70 text-sm">
                      <span>5 min read</span>
                      <span>2.4k views</span>
                    </div>
                  </div>
                </article>
              </Link>
              
              {articlesContent.length > 1 && (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {articlesContent.slice(1, 4).map((content, index) => (
                    <Link key={content.id} href={`/articles/${content.slug}`} data-testid={`link-article-${content.id}`}>
                      <article className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300" data-testid={`card-article-${content.id}`}>
                        <div className="aspect-[16/9] overflow-hidden">
                          <img
                            src={content.heroImage || defaultPlaceholderImages[index + 1]}
                            alt={content.heroImageAlt || content.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-5">
                          <h3 className="font-semibold text-[#0F172A] line-clamp-2 mb-2 group-hover:text-[#A855F7] transition-colors">
                            {content.title}
                          </h3>
                          <span className="text-sm text-[#475569]">5 min read</span>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* SECTION 6 - WHY CHOOSE TRAVI */}
        <section className="py-16 lg:py-20 bg-white" data-testid="section-why-travi">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0F172A] mb-4">Why Choose Travi</h2>
              <p className="text-[#475569] text-lg max-w-2xl mx-auto">Your trusted partner for exploring Dubai</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {whyChooseCards.map((card, index) => {
                const IconComponent = card.icon;
                return (
                  <div key={index} className="text-center p-8">
                    <div className="w-16 h-16 rounded-2xl brand-gradient flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="w-8 h-8 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="font-bold text-xl text-[#0F172A] mb-3">{card.title}</h3>
                    <p className="text-[#475569] leading-relaxed">{card.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 7 - FINAL CTA */}
        <section className="py-20 lg:py-28 brand-gradient noise-texture relative overflow-hidden" data-testid="section-cta">
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Explore Dubai?
            </h2>
            <p className="text-lg text-white/85 max-w-xl mx-auto mb-10">
              Plan your perfect trip with Travi's curated guides and experiences.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/hotels" data-testid="link-cta-hotels">
                <Button className="bg-[#FACC15] hover:bg-[#EAB308] text-[#0F172A] font-bold rounded-xl px-8 py-6 text-lg" data-testid="button-cta-hotels">
                  Browse Hotels
                </Button>
              </Link>
              <Link href="/attractions" data-testid="link-cta-attractions">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#6C5CE7] font-bold rounded-xl px-8 py-6 text-lg bg-transparent" data-testid="button-cta-attractions">
                  Explore Attractions
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-16 bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4C1D95]" data-testid="footer">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div>
                <div className="text-2xl font-bold text-white mb-4">Travi</div>
                <p className="text-white/70 text-sm leading-relaxed">
                  Your trusted companion for discovering the best of Dubai. Curated experiences, trusted reviews.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Explore</h4>
                <ul className="space-y-3 text-sm text-white/70">
                  <li><Link href="/hotels" className="hover:text-white transition-colors" data-testid="link-footer-hotels">Hotels</Link></li>
                  <li><Link href="/attractions" className="hover:text-white transition-colors" data-testid="link-footer-attractions">Attractions</Link></li>
                  <li><Link href="/districts" className="hover:text-white transition-colors" data-testid="link-footer-districts">Districts</Link></li>
                  <li><Link href="/dining" className="hover:text-white transition-colors" data-testid="link-footer-dining">Dining</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Discover</h4>
                <ul className="space-y-3 text-sm text-white/70">
                  <li><Link href="/articles" className="hover:text-white transition-colors" data-testid="link-footer-articles">Travel Guides</Link></li>
                  <li><Link href="/transport" className="hover:text-white transition-colors" data-testid="link-footer-transport">Transport</Link></li>
                  <li><Link href="/about" className="hover:text-white transition-colors" data-testid="link-footer-about">About Us</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors" data-testid="link-footer-contact">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Legal</h4>
                <ul className="space-y-3 text-sm text-white/70">
                  <li><Link href="/privacy" className="hover:text-white transition-colors" data-testid="link-footer-privacy">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition-colors" data-testid="link-footer-terms">Terms of Service</Link></li>
                  <li><Link href="/cookies" className="hover:text-white transition-colors" data-testid="link-footer-cookies">Cookie Policy</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-8 text-center">
              <p className="text-white/50 text-sm">
                © {new Date().getFullYear()} Travi. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
