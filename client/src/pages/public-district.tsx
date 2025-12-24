import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { 
  MapPin, Clock, Users, ChevronRight, ChevronDown, 
  Mail, Building2, ArrowLeft, Utensils, Home,
  CheckCircle, Lightbulb, Star, Map, Train
} from "lucide-react";
import type { ContentWithRelations, DistrictAttractionItem, DiningHighlightItem, RealEstateInfoItem } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PublicNav } from "@/components/public-nav";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import mascotImg from "@assets/Mascot_for_Light_Background_1765497703861.png";
import logoImg from "@assets/Full_Logo_for_Light_Background_1765497703861.png";

const CloudSVG = ({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) => {
  const sizes = { sm: "w-16 h-10", md: "w-24 h-14", lg: "w-32 h-20" };
  return (
    <svg className={`${sizes[size]} ${className}`} viewBox="0 0 100 60" fill="white">
      <ellipse cx="30" cy="40" rx="25" ry="18" />
      <ellipse cx="55" cy="35" rx="22" ry="16" />
      <ellipse cx="75" cy="42" rx="20" ry="14" />
      <ellipse cx="45" cy="28" rx="18" ry="14" />
    </svg>
  );
};

const HotAirBalloonSVG = ({ className = "", color = "#EC4899" }: { className?: string; color?: string }) => (
  <svg className={`w-16 h-24 balloon-icon ${className}`} viewBox="0 0 60 100" fill="none">
    <ellipse cx="30" cy="30" rx="25" ry="30" fill={color} />
    <ellipse cx="30" cy="30" rx="25" ry="30" fill="url(#balloonShineDistrict)" />
    <path d="M15 55 L20 70 L40 70 L45 55" fill="#8B4513" />
    <rect x="18" y="70" width="24" height="15" rx="2" fill="#D2691E" stroke="#8B4513" strokeWidth="1" />
    <line x1="20" y1="55" x2="20" y2="70" stroke="#654321" strokeWidth="1" />
    <line x1="40" y1="55" x2="40" y2="70" stroke="#654321" strokeWidth="1" />
    <defs>
      <linearGradient id="balloonShineDistrict" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="white" stopOpacity="0.3" />
        <stop offset="50%" stopColor="white" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

function generateDistrictSchema(district: ContentWithRelations, url: string) {
  const districtData = district.district;
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": district.title,
    "description": district.metaDescription || district.title,
    "image": district.heroImage,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Dubai",
      "addressCountry": "AE",
      "streetAddress": districtData?.location || "Dubai, UAE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "25.197197",
      "longitude": "55.274376"
    },
    "url": url
  };
}

function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  if (!faqs?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  };
}

const iconMap: Record<string, React.ReactNode> = {
  "MapPin": <MapPin className="w-5 h-5" />,
  "Clock": <Clock className="w-5 h-5" />,
  "Users": <Users className="w-5 h-5" />,
  "Building2": <Building2 className="w-5 h-5" />,
  "Utensils": <Utensils className="w-5 h-5" />,
  "Home": <Home className="w-5 h-5" />,
  "Star": <Star className="w-5 h-5" />,
  "Map": <Map className="w-5 h-5" />,
  "Train": <Train className="w-5 h-5" />,
  "Lightbulb": <Lightbulb className="w-5 h-5" />,
  "CheckCircle": <CheckCircle className="w-5 h-5" />,
};

function getIcon(iconName: string) {
  return iconMap[iconName] || <MapPin className="w-5 h-5" />;
}

export default function PublicDistrict() {
  const [, params] = useRoute("/districts/:slug");
  const slug = params?.slug;
  const [showFullIntro, setShowFullIntro] = useState(false);
  const [email, setEmail] = useState("");

  const { data: district, isLoading } = useQuery<ContentWithRelations>({
    queryKey: ["/api/contents/slug", slug],
    enabled: !!slug,
  });

  const { data: relatedContent = [] } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/contents?type=district&status=published&limit=6"],
  });

  useDocumentMeta({
    title: district?.metaTitle || district?.title || "District | Travi Dubai",
    description: district?.metaDescription || "Discover Dubai's vibrant neighborhoods",
    ogTitle: district?.metaTitle || district?.title || undefined,
    ogDescription: district?.metaDescription || undefined,
    ogType: "website",
  });

  useEffect(() => {
    if (!district) return;
    
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"][data-district-schema]');
    existingScripts.forEach(s => s.remove());

    const districtSchema = generateDistrictSchema(district, window.location.href);
    const districtScript = document.createElement('script');
    districtScript.type = 'application/ld+json';
    districtScript.setAttribute('data-district-schema', 'true');
    districtScript.textContent = JSON.stringify(districtSchema);
    document.head.appendChild(districtScript);

    if (district.district?.faq?.length) {
      const faqSchema = generateFaqSchema(district.district.faq);
      if (faqSchema) {
        const faqScript = document.createElement('script');
        faqScript.type = 'application/ld+json';
        faqScript.setAttribute('data-district-schema', 'true');
        faqScript.textContent = JSON.stringify(faqSchema);
        document.head.appendChild(faqScript);
      }
    }

    return () => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"][data-district-schema]');
      scripts.forEach(s => s.remove());
    };
  }, [district]);

  if (isLoading) {
    return (
      <div className="min-h-screen sky-gradient flex items-center justify-center">
        <div className="animate-pulse text-[#1E1B4B] text-xl">Loading district...</div>
      </div>
    );
  }

  if (!district) {
    return (
      <div className="min-h-screen bg-background">
        <PublicNav variant="default" />
        <div className="pt-32 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">District Not Found</h1>
          <Link href="/districts">
            <Button data-testid="button-back-districts">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Districts
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const districtData = district.district;
  const quickInfo = districtData?.quickInfoBar || [];
  const highlights = districtData?.highlights || [];
  const attractionsGrid = (districtData?.attractionsGrid || []) as DistrictAttractionItem[];
  const diningHighlights = (districtData?.diningHighlights || []) as DiningHighlightItem[];
  const realEstateInfo = districtData?.realEstateInfo as RealEstateInfoItem | undefined;
  const localTips = districtData?.localTips || [];
  const faq = districtData?.faq || [];
  const relatedDistricts = districtData?.relatedDistricts || [];
  const trustSignals = districtData?.trustSignals || [];
  const introText = districtData?.introText || district.metaDescription || "";
  const expandedIntroText = districtData?.expandedIntroText || "";
  const subcategory = districtData?.subcategory || "";

  const filteredRelated = relatedContent.filter(c => c.slug !== slug).slice(0, 4);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md">
        Skip to main content
      </a>

      <PublicNav variant="transparent" />

      <main id="main-content">
        {/* HERO SECTION */}
        <section className="relative min-h-[70vh] flex items-end" data-testid="section-hero">
          <div className="absolute inset-0">
            <img
              src={district.heroImage || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920"}
              alt={district.heroImageAlt || district.title}
              className="w-full h-full object-cover"
              data-testid="img-hero"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-16 pt-32">
            <div className="max-w-3xl">
              {subcategory && (
                <Badge className="mb-4 bg-white/20 text-white border-0 backdrop-blur-sm">
                  {subcategory}
                </Badge>
              )}
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight" data-testid="text-title">
                {district.title}
              </h1>
              
              {district.metaDescription && (
                <p className="text-xl text-white/90 mb-6" data-testid="text-subtitle">
                  {district.metaDescription}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Button className="btn-gold rounded-full px-8 py-6 text-lg" data-testid="button-explore-district">
                  <Map className="w-5 h-5 mr-2" />
                  {districtData?.primaryCta || "Explore District"}
                </Button>
                
                {trustSignals.length > 0 && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-white text-sm">{trustSignals[0]}</span>
                  </div>
                )}
              </div>

              {trustSignals.length > 1 && (
                <div className="flex flex-wrap gap-3">
                  {trustSignals.slice(1).map((signal, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
                      {signal}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* STICKY QUICK INFO BAR */}
        <section className="sticky top-20 z-40 bg-background border-b border-border/40 shadow-sm" data-testid="section-quick-info">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-6 py-4 overflow-x-auto scrollbar-hide">
              {quickInfo.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 whitespace-nowrap" data-testid={`quick-info-${idx}`}>
                  <span className="text-primary">{getIcon(item.icon)}</span>
                  <div>
                    <span className="text-xs text-muted-foreground block">{item.label}</span>
                    <span className="text-sm font-medium text-foreground">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INTRO SECTION */}
        <section className="py-12 bg-background" data-testid="section-intro">
          <div className="max-w-4xl mx-auto px-6">
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <p className="text-lg text-foreground/90 leading-relaxed" data-testid="text-intro">
                {introText}
              </p>
              
              {expandedIntroText && (
                <>
                  {showFullIntro && (
                    <p className="text-lg text-foreground/90 leading-relaxed mt-4" data-testid="text-intro-expanded">
                      {expandedIntroText}
                    </p>
                  )}
                  <button
                    onClick={() => setShowFullIntro(!showFullIntro)}
                    className="text-primary font-medium flex items-center gap-1 mt-4 hover:underline"
                    data-testid="button-read-more"
                  >
                    {showFullIntro ? "Read Less" : "Read More"}
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFullIntro ? "rotate-180" : ""}`} />
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* HIGHLIGHTS / WHAT MAKES IT SPECIAL */}
        {highlights.length > 0 && (
          <section className="py-16 sky-gradient-light" data-testid="section-highlights">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-[#1E1B4B] mb-8">
                What Makes It <span className="font-script text-[#6C5CE7]">Special</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {highlights.map((highlight, idx) => (
                  <Card key={idx} className="overflow-hidden hover-elevate" data-testid={`highlight-card-${idx}`}>
                    {highlight.image && (
                      <div className="aspect-video">
                        <img
                          src={highlight.image}
                          alt={highlight.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{highlight.title}</h3>
                      <p className="text-muted-foreground">{highlight.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ATTRACTIONS GRID */}
        {attractionsGrid.length > 0 && (
          <section className="py-16 bg-background" data-testid="section-attractions">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-end justify-between mb-8 gap-4">
                <h2 className="text-3xl font-bold text-foreground">
                  Top <span className="font-script text-[#6C5CE7]">Attractions</span>
                </h2>
                <Link href="/attractions" className="hidden sm:block">
                  <Button variant="outline" className="border-[#6C5CE7] text-[#6C5CE7] rounded-full px-6" data-testid="button-view-all-attractions">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {attractionsGrid.map((attraction, idx) => (
                  <Card key={idx} className="overflow-hidden hover-elevate" data-testid={`attraction-card-${idx}`}>
                    {attraction.image && (
                      <div className="aspect-[4/3] relative">
                        <img
                          src={attraction.image}
                          alt={attraction.name}
                          className="w-full h-full object-cover"
                        />
                        {attraction.isNew && (
                          <Badge className="absolute top-3 right-3 bg-green-500 text-white border-0">
                            New
                          </Badge>
                        )}
                        <Badge className="absolute bottom-3 left-3 bg-black/60 text-white border-0 backdrop-blur-sm">
                          {attraction.type}
                        </Badge>
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-foreground mb-2">{attraction.name}</h3>
                      <p className="text-muted-foreground text-sm">{attraction.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* DINING HIGHLIGHTS */}
        {diningHighlights.length > 0 && (
          <section className="py-16 bg-muted/30" data-testid="section-dining">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-end justify-between mb-8 gap-4">
                <h2 className="text-3xl font-bold text-foreground">
                  <span className="font-script text-[#6C5CE7]">Dining</span> Scene
                </h2>
                <Link href="/dining" className="hidden sm:block">
                  <Button variant="outline" className="border-[#6C5CE7] text-[#6C5CE7] rounded-full px-6" data-testid="button-view-all-dining">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {diningHighlights.map((dining, idx) => (
                  <Card key={idx} className="overflow-hidden hover-elevate" data-testid={`dining-card-${idx}`}>
                    {dining.image && (
                      <div className="aspect-[4/3] relative">
                        <img
                          src={dining.image}
                          alt={dining.name}
                          className="w-full h-full object-cover"
                        />
                        {dining.priceRange && (
                          <Badge className="absolute top-3 right-3 bg-black/60 text-white border-0 backdrop-blur-sm">
                            {dining.priceRange}
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{dining.name}</h3>
                        <Badge variant="secondary" className="text-xs">{dining.cuisine}</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">{dining.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* REAL ESTATE INFO */}
        {realEstateInfo && (
          <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800" data-testid="section-real-estate">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">
                    Living in <span className="font-script text-[#F8CD57]">{district.title}</span>
                  </h2>
                  
                  <p className="text-lg text-white/80 mb-6" data-testid="text-real-estate-overview">
                    {realEstateInfo.overview}
                  </p>
                  
                  {realEstateInfo.priceRange && (
                    <div className="mb-6">
                      <span className="text-white/60 text-sm">Price Range</span>
                      <p className="text-2xl font-bold text-[#F8CD57]" data-testid="text-price-range">
                        {realEstateInfo.priceRange}
                      </p>
                    </div>
                  )}
                  
                  {realEstateInfo.targetBuyers && realEstateInfo.targetBuyers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {realEstateInfo.targetBuyers.map((buyer, idx) => (
                        <Badge key={idx} className="bg-white/10 text-white border-white/20" data-testid={`target-buyer-${idx}`}>
                          {buyer}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  {realEstateInfo.highlights && realEstateInfo.highlights.length > 0 && (
                    <Card className="p-6 bg-white/10 border-white/20 backdrop-blur-sm">
                      <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <Home className="w-5 h-5 text-[#F8CD57]" />
                        Property Highlights
                      </h3>
                      <ul className="space-y-3">
                        {realEstateInfo.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-white/90" data-testid={`re-highlight-${idx}`}>
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* LOCAL TIPS */}
        {localTips.length > 0 && (
          <section className="py-16 sky-gradient-light" data-testid="section-local-tips">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-[#1E1B4B] mb-8">
                Local <span className="font-script text-[#6C5CE7]">Tips</span>
              </h2>
              
              <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                  <h3 className="font-semibold text-foreground">Insider Knowledge</h3>
                </div>
                <ul className="space-y-4">
                  {localTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3" data-testid={`tip-${idx}`}>
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </section>
        )}

        {/* FAQ SECTION */}
        {faq.length > 0 && (
          <section className="py-16 bg-background" data-testid="section-faq">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-foreground mb-8">
                Frequently Asked <span className="font-script text-[#6C5CE7]">Questions</span>
              </h2>
              
              <Accordion type="single" collapsible className="space-y-4">
                {faq.map((item, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="bg-muted/30 rounded-lg border">
                    <AccordionTrigger className="px-6 py-4 text-left" data-testid={`faq-trigger-${idx}`}>
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-muted-foreground" data-testid={`faq-content-${idx}`}>
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        )}

        {/* RELATED DISTRICTS */}
        {filteredRelated.length > 0 && (
          <section className="py-16 bg-muted/30" data-testid="section-related">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-end justify-between mb-8 gap-4">
                <h2 className="text-3xl font-bold text-foreground">
                  Explore Other <span className="font-script text-[#6C5CE7]">Districts</span>
                </h2>
                <Link href="/districts" className="hidden sm:block">
                  <Button variant="outline" className="border-[#6C5CE7] text-[#6C5CE7] rounded-full px-6" data-testid="button-view-all">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredRelated.map((item) => (
                  <Link key={item.id} href={`/districts/${item.slug}`} data-testid={`related-card-${item.id}`}>
                    <Card className="overflow-hidden hover-elevate cursor-pointer">
                      <div className="aspect-[4/3]">
                        <img
                          src={item.heroImage || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400"}
                          alt={item.heroImageAlt || item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground line-clamp-2">{item.title}</h3>
                        {item.district?.neighborhood && (
                          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.district.neighborhood}
                          </p>
                        )}
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* NEWSLETTER SECTION */}
        <section className="py-20 bg-gradient-to-b from-[#E8F4FD] to-[#87CEEB] relative overflow-hidden" data-testid="section-newsletter">
          <div className="absolute bottom-0 left-0 right-0 h-32 dubai-skyline opacity-20" />
          
          <HotAirBalloonSVG className="absolute top-10 left-[8%] animate-float-slow" color="#EC4899" />
          <CloudSVG className="absolute top-20 right-[10%] opacity-80" size="md" />
          
          <img 
            src={mascotImg} 
            alt="" 
            className="absolute bottom-0 right-[10%] w-40 h-40 animate-float-gentle hidden lg:block"
          />

          <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#1E1B4B] mb-4">
              Stay in the Loop
            </h2>
            <p className="text-xl text-[#475569] mb-8">
              Get exclusive Dubai travel tips, deals, and inspiration delivered to your inbox
            </p>

            <form 
              onSubmit={(e) => { e.preventDefault(); }}
              className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
            >
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-full border-0 shadow-lg text-[#1E1B4B] placeholder:text-[#94A3B8] outline-none focus:ring-2 focus:ring-[#6C5CE7]"
                  data-testid="input-newsletter-email"
                />
              </div>
              <Button 
                type="submit"
                className="btn-gold rounded-full px-8 py-4 text-lg whitespace-nowrap"
                data-testid="button-newsletter-subscribe"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-16 bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4C1D95] relative overflow-hidden" data-testid="footer">
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  opacity: 0.3 + Math.random() * 0.4,
                }}
              />
            ))}
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              <div className="md:col-span-1">
                <img src={logoImg} alt="Travi" className="h-10 mb-4" />
                <p className="text-white/70 text-sm mb-4">
                  Your ultimate guide to exploring Dubai's wonders, from iconic landmarks to hidden gems.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Explore</h3>
                <ul className="space-y-2">
                  <li><Link href="/attractions" className="text-white/70 hover:text-white text-sm">Attractions</Link></li>
                  <li><Link href="/hotels" className="text-white/70 hover:text-white text-sm">Hotels</Link></li>
                  <li><Link href="/dining" className="text-white/70 hover:text-white text-sm">Dining</Link></li>
                  <li><Link href="/districts" className="text-white/70 hover:text-white text-sm">Districts</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Tools</h3>
                <ul className="space-y-2">
                  <li><Link href="/tools/currency" className="text-white/70 hover:text-white text-sm">Currency Converter</Link></li>
                  <li><Link href="/tools/budget" className="text-white/70 hover:text-white text-sm">Budget Planner</Link></li>
                  <li><Link href="/tools/events" className="text-white/70 hover:text-white text-sm">Events Calendar</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><Link href="/privacy" className="text-white/70 hover:text-white text-sm">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="text-white/70 hover:text-white text-sm">Terms & Conditions</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/20 pt-8 text-center">
              <p className="text-white/50 text-sm">
                {new Date().getFullYear()} Travi Dubai. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
