import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { 
  MapPin, Clock, Star, Calendar, ChevronRight, ChevronDown, 
  Mail, Ticket, Users, Camera, Info, Lightbulb, ArrowLeft,
  CheckCircle, Phone, Globe, CreditCard, Accessibility
} from "lucide-react";
import type { ContentWithRelations, ExperienceItem } from "@shared/schema";
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
    <ellipse cx="30" cy="30" rx="25" ry="30" fill="url(#balloonShineAttraction)" />
    <path d="M15 55 L20 70 L40 70 L45 55" fill="#8B4513" />
    <rect x="18" y="70" width="24" height="15" rx="2" fill="#D2691E" stroke="#8B4513" strokeWidth="1" />
    <line x1="20" y1="55" x2="20" y2="70" stroke="#654321" strokeWidth="1" />
    <line x1="40" y1="55" x2="40" y2="70" stroke="#654321" strokeWidth="1" />
    <defs>
      <linearGradient id="balloonShineAttraction" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="white" stopOpacity="0.3" />
        <stop offset="50%" stopColor="white" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

function generateAttractionSchema(attraction: ContentWithRelations, url: string) {
  const attractionData = attraction.attraction;
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": attraction.title,
    "description": attraction.metaDescription || attraction.title,
    "image": attraction.heroImage,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Dubai",
      "addressCountry": "AE",
      "streetAddress": attractionData?.location || "Dubai, UAE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "25.197197",
      "longitude": "55.274376"
    },
    "openingHours": attractionData?.quickInfoBar?.find(q => q.label === "Hours")?.value || "Mo-Su 09:00-23:00",
    "url": url,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "15000"
    }
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
  "Star": <Star className="w-5 h-5" />,
  "Calendar": <Calendar className="w-5 h-5" />,
  "Ticket": <Ticket className="w-5 h-5" />,
  "Users": <Users className="w-5 h-5" />,
  "Camera": <Camera className="w-5 h-5" />,
  "Info": <Info className="w-5 h-5" />,
  "Phone": <Phone className="w-5 h-5" />,
  "Globe": <Globe className="w-5 h-5" />,
  "CreditCard": <CreditCard className="w-5 h-5" />,
  "Accessibility": <Accessibility className="w-5 h-5" />,
  "Lightbulb": <Lightbulb className="w-5 h-5" />,
  "CheckCircle": <CheckCircle className="w-5 h-5" />,
};

function getIcon(iconName: string) {
  return iconMap[iconName] || <Info className="w-5 h-5" />;
}

export default function PublicAttraction() {
  const [, params] = useRoute("/attractions/:slug");
  const slug = params?.slug;
  const [showFullIntro, setShowFullIntro] = useState(false);
  const [email, setEmail] = useState("");

  const { data: attraction, isLoading } = useQuery<ContentWithRelations>({
    queryKey: ["/api/contents/slug", slug],
    enabled: !!slug,
  });

  const { data: relatedContent = [] } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/contents?type=attraction&status=published&limit=6"],
  });

  useDocumentMeta({
    title: attraction?.metaTitle || attraction?.title || "Attraction | Travi Dubai",
    description: attraction?.metaDescription || "Discover Dubai's top attractions",
    ogTitle: attraction?.metaTitle || attraction?.title || undefined,
    ogDescription: attraction?.metaDescription || undefined,
    ogType: "website",
  });

  useEffect(() => {
    if (!attraction) return;
    
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"][data-attraction-schema]');
    existingScripts.forEach(s => s.remove());

    const attractionSchema = generateAttractionSchema(attraction, window.location.href);
    const attractionScript = document.createElement('script');
    attractionScript.type = 'application/ld+json';
    attractionScript.setAttribute('data-attraction-schema', 'true');
    attractionScript.textContent = JSON.stringify(attractionSchema);
    document.head.appendChild(attractionScript);

    if (attraction.attraction?.faq?.length) {
      const faqSchema = generateFaqSchema(attraction.attraction.faq);
      if (faqSchema) {
        const faqScript = document.createElement('script');
        faqScript.type = 'application/ld+json';
        faqScript.setAttribute('data-attraction-schema', 'true');
        faqScript.textContent = JSON.stringify(faqSchema);
        document.head.appendChild(faqScript);
      }
    }

    return () => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"][data-attraction-schema]');
      scripts.forEach(s => s.remove());
    };
  }, [attraction]);

  if (isLoading) {
    return (
      <div className="min-h-screen sky-gradient flex items-center justify-center">
        <div className="animate-pulse text-[#1E1B4B] text-xl">Loading attraction...</div>
      </div>
    );
  }

  if (!attraction) {
    return (
      <div className="min-h-screen bg-background">
        <PublicNav variant="default" />
        <div className="pt-32 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Attraction Not Found</h1>
          <Link href="/attractions">
            <Button data-testid="button-back-attractions">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Attractions
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const attractionData = attraction.attraction;
  const quickInfo = attractionData?.quickInfoBar || [];
  const highlights = attractionData?.highlights || [];
  const ticketInfo = attractionData?.ticketInfo || [];
  const essentialInfo = attractionData?.essentialInfo || [];
  const visitorTips = attractionData?.visitorTips || [];
  const gallery = attractionData?.gallery || [];
  const experienceSteps = attractionData?.experienceSteps || [];
  const insiderTips = attractionData?.insiderTips || [];
  const faq = attractionData?.faq || [];
  const relatedAttractions = attractionData?.relatedAttractions || [];
  const trustSignals = attractionData?.trustSignals || [];
  const introText = attractionData?.introText || attraction.metaDescription || "";
  const expandedIntroText = attractionData?.expandedIntroText || "";

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
              src={attraction.heroImage || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920"}
              alt={attraction.heroImageAlt || attraction.title}
              className="w-full h-full object-cover"
              data-testid="img-hero"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-16 pt-32">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight" data-testid="text-title">
                {attraction.title}
              </h1>
              
              {attraction.metaDescription && (
                <p className="text-xl text-white/90 mb-6" data-testid="text-subtitle">
                  {attraction.metaDescription}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Button className="btn-gold rounded-full px-8 py-6 text-lg" data-testid="button-book-tickets">
                  <Ticket className="w-5 h-5 mr-2" />
                  {attractionData?.primaryCta || "Book Tickets"}
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

        {/* TICKET OPTIONS SECTION */}
        {ticketInfo.length > 0 && (
          <section className="py-16 sky-gradient-light" data-testid="section-tickets">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-[#1E1B4B] mb-8">
                Ticket <span className="font-script text-[#6C5CE7]">Options</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ticketInfo.map((ticket, idx) => (
                  <Card key={idx} className="p-6 hover-elevate" data-testid={`ticket-card-${idx}`}>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{ticket.type}</h3>
                    <p className="text-muted-foreground mb-4">{ticket.description}</p>
                    {ticket.price && (
                      <div className="text-2xl font-bold text-primary mb-4">{ticket.price}</div>
                    )}
                    <Button className="w-full btn-gold" data-testid={`button-book-${idx}`}>
                      Book Now
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ESSENTIAL INFO GRID */}
        {essentialInfo.length > 0 && (
          <section className="py-16 bg-background" data-testid="section-essential-info">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-foreground mb-8">
                Essential <span className="font-script text-[#6C5CE7]">Information</span>
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {essentialInfo.map((info, idx) => (
                  <Card key={idx} className="p-4 text-center" data-testid={`essential-info-${idx}`}>
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {getIcon(info.icon)}
                    </div>
                    <h3 className="font-medium text-foreground mb-1">{info.label}</h3>
                    <p className="text-sm text-muted-foreground">{info.value}</p>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* GALLERY SECTION */}
        {gallery.length > 0 && (
          <section className="py-16 bg-muted/30" data-testid="section-gallery">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-foreground mb-8">
                Photo <span className="font-script text-[#6C5CE7]">Gallery</span>
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden" data-testid={`gallery-img-${idx}`}>
                    <img
                      src={img.image}
                      alt={img.alt}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* HIGHLIGHTS / WHAT TO EXPECT */}
        {highlights.length > 0 && (
          <section className="py-16 bg-background" data-testid="section-highlights">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-foreground mb-8">
                What to <span className="font-script text-[#6C5CE7]">Expect</span>
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

        {/* VISITOR TIPS */}
        {visitorTips.length > 0 && (
          <section className="py-16 sky-gradient-light" data-testid="section-visitor-tips">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-[#1E1B4B] mb-8">
                Visitor <span className="font-script text-[#6C5CE7]">Tips</span>
              </h2>
              
              <Card className="p-6">
                <ul className="space-y-4">
                  {visitorTips.map((tip, idx) => (
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

        {/* HOW TO EXPERIENCE SECTION */}
        {experienceSteps.length > 0 && (
          <section className="py-16 bg-background" data-testid="section-experience">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h2 className="text-3xl font-bold text-foreground mb-8">
                    How to <span className="font-script text-[#6C5CE7]">Experience</span>
                  </h2>
                  
                  <div className="space-y-6">
                    {experienceSteps.map((step, idx) => (
                      <div key={idx} className="flex gap-4" data-testid={`experience-step-${idx}`}>
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                          {getIcon(step.icon)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                          <p className="text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {insiderTips.length > 0 && (
                  <div>
                    <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
                      <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="w-5 h-5 text-amber-600" />
                        <h3 className="font-semibold text-foreground">Insider Tips</h3>
                      </div>
                      <ul className="space-y-3">
                        {insiderTips.map((tip, idx) => (
                          <li key={idx} className="text-sm text-foreground/90" data-testid={`insider-tip-${idx}`}>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* FAQ SECTION */}
        {faq.length > 0 && (
          <section className="py-16 bg-muted/30" data-testid="section-faq">
            <div className="max-w-4xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-foreground mb-8">
                Frequently Asked <span className="font-script text-[#6C5CE7]">Questions</span>
              </h2>
              
              <Accordion type="single" collapsible className="space-y-4">
                {faq.map((item, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`} className="bg-background rounded-lg border">
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

        {/* RELATED ATTRACTIONS */}
        {filteredRelated.length > 0 && (
          <section className="py-16 bg-background" data-testid="section-related">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-end justify-between mb-8 gap-4">
                <h2 className="text-3xl font-bold text-foreground">
                  Related <span className="font-script text-[#6C5CE7]">Attractions</span>
                </h2>
                <Link href="/attractions" className="hidden sm:block">
                  <Button variant="outline" className="border-[#6C5CE7] text-[#6C5CE7] rounded-full px-6" data-testid="button-view-all">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredRelated.map((item) => (
                  <Link key={item.id} href={`/attractions/${item.slug}`} data-testid={`related-card-${item.id}`}>
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
                        {item.attraction?.location && (
                          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.attraction.location}
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
                  <li><Link href="/articles" className="text-white/70 hover:text-white text-sm">News</Link></li>
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
