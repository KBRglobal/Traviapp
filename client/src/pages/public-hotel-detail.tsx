import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { 
  ArrowLeft, Star, MapPin, Clock, Phone, Globe, Mail,
  Wifi, Car, Waves, Utensils, Dumbbell, Sparkles, Coffee,
  ChevronRight, ChevronLeft, ChevronDown, Check, Calendar,
  Building2, Users, CreditCard, Baby, PawPrint, Accessibility
} from "lucide-react";
import type { ContentWithRelations, FaqItem, HighlightItem, RoomTypeItem, EssentialInfoItem } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const defaultHeroImage = "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&h=1080&fit=crop";

const AMENITY_ICONS: Record<string, typeof Wifi> = {
  wifi: Wifi,
  parking: Car,
  pool: Waves,
  restaurant: Utensils,
  gym: Dumbbell,
  spa: Sparkles,
  coffee: Coffee,
  default: Check,
};

function getAmenityIcon(amenity: string) {
  const key = amenity.toLowerCase();
  for (const [name, Icon] of Object.entries(AMENITY_ICONS)) {
    if (key.includes(name)) return Icon;
  }
  return AMENITY_ICONS.default;
}

function generateJsonLd(content: ContentWithRelations, imageUrl: string): object | null {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const pageUrl = `${baseUrl}/hotels/${content.slug}`;
  
  if (!content.hotel) return null;
  
  const hotelSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: content.title,
    url: pageUrl,
    image: imageUrl,
  };
  
  if (content.metaDescription) {
    hotelSchema.description = content.metaDescription;
  }
  if (content.hotel.location) {
    hotelSchema.address = {
      "@type": "PostalAddress",
      addressLocality: content.hotel.location,
      addressCountry: "UAE"
    };
  }
  if (content.hotel.starRating) {
    hotelSchema.starRating = {
      "@type": "Rating",
      ratingValue: content.hotel.starRating,
      bestRating: 5
    };
  }
  
  const schemas: object[] = [hotelSchema];
  
  const faqItems = content.hotel.faq || [];
  if (faqItems.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems.map((item: FaqItem) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
    });
  }
  
  return schemas.length === 1 ? schemas[0] : schemas;
}

function RoomCard({ room }: { room: RoomTypeItem }) {
  return (
    <Card className="overflow-hidden group cursor-pointer min-w-[280px] max-w-[320px] shrink-0">
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={room.image || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop"} 
          alt={room.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-sm mb-2">{room.title}</h4>
        {room.features && room.features.length > 0 && (
          <ul className="text-xs text-muted-foreground space-y-1 mb-3">
            {room.features.slice(0, 3).map((feature, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="w-3 h-3 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
        )}
        {room.price && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">From</span>
            <span className="font-bold text-primary">{room.price}</span>
          </div>
        )}
      </div>
    </Card>
  );
}

function HighlightCard({ highlight }: { highlight: HighlightItem }) {
  return (
    <div className="text-center p-4">
      {highlight.image && (
        <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
          <img src={highlight.image} alt={highlight.title} className="w-10 h-10 object-contain" />
        </div>
      )}
      <h4 className="font-semibold text-sm mb-1">{highlight.title}</h4>
      <p className="text-xs text-muted-foreground line-clamp-2">{highlight.description}</p>
    </div>
  );
}

function EssentialInfoCard({ info }: { info: EssentialInfoItem }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <Clock className="w-4 h-4 text-primary" />
      </div>
      <div>
        <span className="text-xs text-muted-foreground">{info.label}</span>
        <p className="font-medium text-sm">{info.value}</p>
      </div>
    </div>
  );
}

export default function PublicHotelDetail() {
  const params = useParams();
  const slug = params.slug;
  const [roomScrollPosition, setRoomScrollPosition] = useState(0);
  
  const { data: content, isLoading } = useQuery<ContentWithRelations>({
    queryKey: [`/api/contents/slug/${slug}`],
    enabled: !!slug,
  });

  const hotel = content?.hotel;
  const imageUrl = content?.heroImage || defaultHeroImage;

  useDocumentMeta({
    title: content ? `${content.title} | Dubai Hotels | Travi` : "Hotel | Travi",
    description: content?.metaDescription || "Discover luxury accommodation in Dubai.",
    ogTitle: content?.title || undefined,
    ogDescription: content?.metaDescription || undefined,
    ogImage: imageUrl,
    ogType: "article",
  });

  useEffect(() => {
    if (!content) return;
    
    const jsonLd = generateJsonLd(content, imageUrl);
    const existingScript = document.getElementById('json-ld-schema');
    if (existingScript) existingScript.remove();
    
    if (jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'json-ld-schema';
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [content, imageUrl]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PublicNav />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  if (!content || content.type !== 'hotel') {
    return (
      <div className="min-h-screen bg-background">
        <PublicNav />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <h1 className="text-2xl font-bold mb-4">Hotel Not Found</h1>
          <p className="text-muted-foreground mb-6">The hotel you're looking for doesn't exist.</p>
          <Link href="/hotels">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Hotels
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const highlights = hotel?.highlights || [];
  const roomTypes = hotel?.roomTypes || [];
  const essentialInfo = hotel?.essentialInfo || [];
  const travelerTips = hotel?.travelerTips || [];
  const faqItems = hotel?.faq || [];
  const amenities = hotel?.amenities || [];
  const starRating = hotel?.starRating || 5;
  const location = hotel?.location || "Dubai, UAE";

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero Section with Cloud Effect */}
      <section className="relative min-h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={imageUrl}
            alt={content.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        
        {/* Cloud overlay at bottom */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"
          style={{
            maskImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1200 120\'%3E%3Cpath d=\'M0,120 C200,80 400,100 600,60 C800,20 1000,80 1200,40 L1200,120 Z\' fill=\'white\'/%3E%3C/svg%3E")',
            WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 1200 120\'%3E%3Cpath d=\'M0,120 C200,80 400,100 600,60 C800,20 1000,80 1200,40 L1200,120 Z\' fill=\'white\'/%3E%3C/svg%3E")',
            maskSize: 'cover',
            WebkitMaskSize: 'cover',
          }}
        />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 text-center">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(starRating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">
            {content.title.split(',')[0]}
            {content.title.includes(',') && (
              <span className="block text-amber-400 font-script italic text-3xl sm:text-4xl mt-2">
                {content.title.split(',').slice(1).join(',')}
              </span>
            )}
          </h1>
          
          <div className="flex items-center justify-center gap-2 text-white/80 mt-4">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        </div>
      </section>

      <main className="relative z-20 -mt-8">
        {/* Hotel Overview */}
        <section className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-primary font-medium text-sm">About</span>
                <h2 className="text-2xl md:text-3xl font-bold mt-1 mb-4">Hotel Overview</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {content.metaDescription || `Experience luxury at ${content.title}, one of Dubai's premier destinations for travelers seeking exceptional hospitality and world-class amenities.`}
                </p>
                
                {amenities.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-sm mb-3">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {amenities.slice(0, 8).map((amenity, i) => {
                        const Icon = getAmenityIcon(amenity);
                        return (
                          <Badge key={i} variant="secondary" className="gap-1">
                            <Icon className="w-3 h-3" />
                            {amenity}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={hotel?.photoGallery?.[0]?.image || imageUrl}
                  alt={`${content.title} overview`}
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Guests Love This Hotel */}
        {highlights.length > 0 && (
          <section className="py-12 md:py-16 bg-muted/30">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <span className="text-primary font-medium text-sm">Highlights</span>
                <h2 className="text-2xl md:text-3xl font-bold mt-1">Why Guests Love This Hotel</h2>
                <p className="text-muted-foreground mt-2">Discover what makes this hotel special</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {highlights.map((highlight, i) => (
                  <Card key={i} className="bg-background">
                    <HighlightCard highlight={highlight} />
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Rooms & Suites */}
        {roomTypes.length > 0 && (
          <section className="py-12 md:py-16">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <span className="text-primary font-medium text-sm">Accommodation</span>
                  <h2 className="text-2xl md:text-3xl font-bold mt-1">Rooms & Suites</h2>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="icon" 
                    variant="outline"
                    onClick={() => {
                      const container = document.getElementById('rooms-scroll');
                      if (container) container.scrollBy({ left: -320, behavior: 'smooth' });
                    }}
                    data-testid="button-rooms-prev"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="outline"
                    onClick={() => {
                      const container = document.getElementById('rooms-scroll');
                      if (container) container.scrollBy({ left: 320, behavior: 'smooth' });
                    }}
                    data-testid="button-rooms-next"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div 
                id="rooms-scroll"
                className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {roomTypes.map((room, i) => (
                  <RoomCard key={i} room={room} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Essential Information */}
        {essentialInfo.length > 0 && (
          <section className="py-12 md:py-16 bg-muted/30">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold">Essential Information</h2>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {essentialInfo.map((info, i) => (
                  <EssentialInfoCard key={i} info={info} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Traveler Tips */}
        {travelerTips.length > 0 && (
          <section className="py-12 md:py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <Card className="p-6 md:p-8 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Traveler Tips
                </h3>
                <ul className="space-y-3">
                  {travelerTips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{tip}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {faqItems.length > 0 && (
          <section className="py-12 md:py-16 bg-muted/30">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold">Frequently Asked Questions</h2>
                <p className="text-muted-foreground mt-2">Everything you need to know about your stay</p>
              </div>
              
              <Accordion type="single" collapsible className="space-y-2">
                {faqItems.map((faq, i) => (
                  <AccordionItem 
                    key={i} 
                    value={`faq-${i}`}
                    className="bg-background rounded-lg px-4 border"
                  >
                    <AccordionTrigger className="text-left text-sm font-medium hover:no-underline" data-testid={`faq-trigger-${i}`}>
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="relative overflow-hidden bg-gradient-to-r from-amber-400 to-orange-500 border-0 p-8 md:p-12 text-center">
              <div className="absolute inset-0 opacity-10">
                <img 
                  src={imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Ready to Book Your Stay?
                </h2>
                <p className="text-white/90 mb-6 max-w-xl mx-auto">
                  Experience luxury and comfort at {content.title}. Book now for the best rates and exclusive offers.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" className="bg-white text-amber-600 hover:bg-white/90" data-testid="button-book-now">
                    <Calendar className="w-4 h-4 mr-2" />
                    Check Availability
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" data-testid="button-contact-hotel">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Hotel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-12 md:py-16 border-t">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-xl md:text-2xl font-bold mb-2">Subscribe to our Newsletter</h3>
            <p className="text-muted-foreground mb-6">Get the latest Dubai travel tips and exclusive hotel deals</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                data-testid="input-newsletter-email"
              />
              <Button data-testid="button-subscribe">Subscribe</Button>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
