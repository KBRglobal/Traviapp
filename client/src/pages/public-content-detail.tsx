import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { ArrowLeft, Star, MapPin, Clock, Share2, Heart, Menu, X } from "lucide-react";
import type { Content } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { useState } from "react";
import { useDocumentMeta } from "@/hooks/use-document-meta";

const defaultPlaceholderImages = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=600&fit=crop",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200&h=600&fit=crop",
];

export default function PublicContentDetail() {
  const params = useParams();
  const slug = params.slug;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { data: allContent, isLoading } = useQuery<Content[]>({
    queryKey: ["/api/contents?status=published"],
  });

  const content = allContent?.find(c => c.slug === slug);
  const contentType = content?.type || 'attraction';
  
  function getBackLink(type: string) {
    switch (type) {
      case 'dining': return '/dining';
      case 'district': return '/districts';
      case 'transport': return '/transport';
      default: return `/${type}s`;
    }
  }
  
  function getTypeLabel(type: string) {
    switch (type) {
      case 'dining': return 'Dining';
      case 'district': return 'Districts';
      case 'transport': return 'Transport';
      case 'hotel': return 'Hotels';
      case 'attraction': return 'Attractions';
      case 'article': return 'Articles';
      default: return type;
    }
  }
  
  const backLink = getBackLink(contentType);
  const imageUrl = content?.heroImage || defaultPlaceholderImages[0];

  useDocumentMeta({
    title: content ? `${content.title} | Dubai Travel` : "Content | Dubai Travel",
    description: content?.metaDescription || "Discover amazing destinations and experiences in Dubai.",
    ogTitle: content?.title || undefined,
    ogDescription: content?.metaDescription || undefined,
    ogImage: imageUrl,
    ogType: "article",
  });

  const navLinks = [
    { href: "/hotels", label: "Hotels", type: "hotel" },
    { href: "/attractions", label: "Attractions", type: "attraction" },
    { href: "/dining", label: "Dining", type: "dining" },
    { href: "/districts", label: "Districts", type: "district" },
    { href: "/transport", label: "Transport", type: "transport" },
    { href: "/articles", label: "Articles", type: "article" },
  ];

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none"
        >
          Skip to main content
        </a>
        <header>
          <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b" aria-label="Main navigation">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <Logo variant="primary" height={28} />
              </div>
            </div>
          </nav>
        </header>
        <main id="main-content" className="max-w-4xl mx-auto px-4 py-16">
          <div className="animate-pulse" aria-hidden="true">
            <div className="h-8 w-32 bg-muted rounded mb-6" />
            <div className="aspect-[2/1] bg-muted rounded-2xl mb-8" />
            <div className="h-10 w-3/4 bg-muted rounded mb-4" />
            <div className="h-6 w-full bg-muted rounded mb-2" />
            <div className="h-6 w-2/3 bg-muted rounded" />
          </div>
          <p className="sr-only" aria-live="polite">Loading content details...</p>
        </main>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="bg-background min-h-screen">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none"
        >
          Skip to main content
        </a>
        <header>
          <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b" aria-label="Main navigation">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <Logo variant="primary" height={28} />
                <div className="hidden md:flex items-center gap-8">
                  <Link href="/hotels" className="text-foreground/80 hover:text-primary font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1">Hotels</Link>
                  <Link href="/attractions" className="text-foreground/80 hover:text-primary font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1">Attractions</Link>
                  <Link href="/articles" className="text-foreground/80 hover:text-primary font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1">Articles</Link>
                </div>
              </div>
            </div>
          </nav>
        </header>
        <main id="main-content" className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-4">Content Not Found</h1>
          <p className="text-muted-foreground mb-8">The content you're looking for doesn't exist or has been removed.</p>
          <Link href="/">
            <Button data-testid="button-back-home">Back to Home</Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none"
      >
        Skip to main content
      </a>
      
      <header>
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b" aria-label="Main navigation">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 gap-4">
              <Logo variant="primary" height={28} />
              
              <div className="hidden md:flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href}
                    href={link.href} 
                    className={`font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1 ${contentType === link.type ? 'text-primary' : 'text-foreground/80 hover:text-primary'}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <Link href="/admin" className="hidden sm:block">
                  <Button variant="outline" size="sm" data-testid="link-admin">Admin</Button>
                </Link>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-menu"
                  data-testid="button-mobile-menu"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
                </Button>
              </div>
            </div>
          </div>
          
          {mobileMenuOpen && (
            <div 
              id="mobile-menu" 
              className="md:hidden border-t bg-background"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-3 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${contentType === link.type ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link href="/admin" className="block sm:hidden">
                  <Button variant="outline" className="w-full mt-2" data-testid="link-admin-mobile">Admin</Button>
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main id="main-content">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link 
            href={backLink} 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1"
            data-testid="link-back"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to {getTypeLabel(contentType)}</span>
          </Link>

          <div className="aspect-[2/1] rounded-2xl overflow-hidden mb-8">
            <img 
              src={imageUrl} 
              alt={content.heroImageAlt || content.title}
              className="w-full h-full object-cover"
              loading="lazy"
              width={1200}
              height={600}
            />
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium capitalize text-sm">
              {content.type}
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="w-4 h-4 fill-[#fdcd0a] text-[#fdcd0a]" aria-hidden="true" />
              <span>4.8 Rating</span>
              <span className="sr-only">out of 5 stars</span>
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span>Dubai, UAE</span>
            </span>
            {contentType === 'attraction' && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" aria-hidden="true" />
                <span>2-4 hours</span>
                <span className="sr-only">typical visit duration</span>
              </span>
            )}
          </div>

          <h1 id="content-title" className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {content.title}
          </h1>

          <p className="text-lg text-muted-foreground mb-8">
            {content.metaDescription || "Discover this amazing destination in Dubai."}
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-12">
            <Button className="bg-primary hover:bg-primary/90" data-testid="button-book-now">
              Book Now
            </Button>
            <Button variant="outline" size="icon" aria-label="Save to favorites" data-testid="button-favorite">
              <Heart className="w-5 h-5" aria-hidden="true" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Share this page" data-testid="button-share">
              <Share2 className="w-5 h-5" aria-hidden="true" />
            </Button>
          </div>

          <div className="space-y-8">
            <section aria-labelledby="about-heading">
              <Card className="p-6">
                <h2 id="about-heading" className="font-heading text-xl font-semibold mb-4">About</h2>
                <p className="text-muted-foreground">
                  {content.metaDescription || "Experience the best of Dubai with this amazing destination. Perfect for travelers seeking unforgettable moments in the city of dreams."}
                </p>
              </Card>
            </section>

            <section aria-labelledby="highlights-heading">
              <Card className="p-6">
                <h2 id="highlights-heading" className="font-heading text-xl font-semibold mb-4">Highlights</h2>
                <ul className="space-y-2 text-muted-foreground" role="list">
                  <li className="flex items-start gap-2" role="listitem">
                    <Star className="w-5 h-5 text-[#fdcd0a] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>World-class experience in the heart of Dubai</span>
                  </li>
                  <li className="flex items-start gap-2" role="listitem">
                    <Star className="w-5 h-5 text-[#fdcd0a] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Stunning views and memorable moments</span>
                  </li>
                  <li className="flex items-start gap-2" role="listitem">
                    <Star className="w-5 h-5 text-[#fdcd0a] shrink-0 mt-0.5" aria-hidden="true" />
                    <span>Easy access and convenient location</span>
                  </li>
                </ul>
              </Card>
            </section>

            <section aria-labelledby="location-heading">
              <Card className="p-6">
                <h2 id="location-heading" className="font-heading text-xl font-semibold mb-4">Location</h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-primary" aria-hidden="true" />
                  <span>Dubai, United Arab Emirates</span>
                </div>
              </Card>
            </section>
          </div>
        </article>
      </main>

      <footer className="py-8 border-t mt-16" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 flex-wrap">
            <Logo variant="primary" height={28} />
            <nav aria-label="Footer navigation">
              <div className="flex items-center gap-6 text-muted-foreground text-sm flex-wrap">
                <Link href="/hotels" className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-1">Hotels</Link>
                <Link href="/attractions" className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-1">Attractions</Link>
                <Link href="/articles" className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-1">Articles</Link>
              </div>
            </nav>
            <div className="flex items-center gap-4 text-muted-foreground text-sm flex-wrap">
              <Link href="/privacy" className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-1">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-1">Terms</Link>
              <span>2024 Travi</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
