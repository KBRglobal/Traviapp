import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "wouter";
import { ArrowLeft, Star, MapPin, Clock, Share2, Heart } from "lucide-react";
import type { Content } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";

const defaultPlaceholderImages = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&h=600&fit=crop",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200&h=600&fit=crop",
];

export default function PublicContentDetail() {
  const params = useParams();
  const slug = params.slug;
  
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

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen">
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Logo variant="primary" height={28} />
            </div>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-muted rounded mb-6" />
            <div className="aspect-[2/1] bg-muted rounded-2xl mb-8" />
            <div className="h-10 w-3/4 bg-muted rounded mb-4" />
            <div className="h-6 w-full bg-muted rounded mb-2" />
            <div className="h-6 w-2/3 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="bg-background min-h-screen">
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Logo variant="primary" height={28} />
              <div className="hidden md:flex items-center gap-8">
                <Link href="/hotels" className="text-foreground/80 hover:text-primary font-medium transition-colors">Hotels</Link>
                <Link href="/attractions" className="text-foreground/80 hover:text-primary font-medium transition-colors">Attractions</Link>
                <Link href="/articles" className="text-foreground/80 hover:text-primary font-medium transition-colors">Articles</Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-4">Content Not Found</h1>
          <p className="text-muted-foreground mb-8">The content you're looking for doesn't exist or has been removed.</p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo variant="primary" height={28} />
            <div className="hidden md:flex items-center gap-6">
              <Link href="/hotels" className={`font-medium transition-colors ${contentType === 'hotel' ? 'text-primary' : 'text-foreground/80 hover:text-primary'}`}>Hotels</Link>
              <Link href="/attractions" className={`font-medium transition-colors ${contentType === 'attraction' ? 'text-primary' : 'text-foreground/80 hover:text-primary'}`}>Attractions</Link>
              <Link href="/dining" className={`font-medium transition-colors ${contentType === 'dining' ? 'text-primary' : 'text-foreground/80 hover:text-primary'}`}>Dining</Link>
              <Link href="/districts" className={`font-medium transition-colors ${contentType === 'district' ? 'text-primary' : 'text-foreground/80 hover:text-primary'}`}>Districts</Link>
              <Link href="/transport" className={`font-medium transition-colors ${contentType === 'transport' ? 'text-primary' : 'text-foreground/80 hover:text-primary'}`}>Transport</Link>
              <Link href="/articles" className={`font-medium transition-colors ${contentType === 'article' ? 'text-primary' : 'text-foreground/80 hover:text-primary'}`}>Articles</Link>
            </div>
            <Link href="/admin">
              <Button variant="outline" size="sm">Admin</Button>
            </Link>
          </div>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href={backLink} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to {getTypeLabel(contentType)}
        </Link>

        <div className="aspect-[2/1] rounded-2xl overflow-hidden mb-8">
          <img 
            src={imageUrl} 
            alt={content.heroImageAlt || content.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium capitalize text-sm">
            {content.type}
          </span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="w-4 h-4 fill-[#fdcd0a] text-[#fdcd0a]" />
            4.8 Rating
          </span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            Dubai, UAE
          </span>
          {contentType === 'attraction' && (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              2-4 hours
            </span>
          )}
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
          {content.title}
        </h1>

        <p className="text-lg text-muted-foreground mb-8">
          {content.metaDescription || "Discover this amazing destination in Dubai."}
        </p>

        <div className="flex flex-wrap items-center gap-3 mb-12">
          <Button className="bg-primary hover:bg-primary/90">
            Book Now
          </Button>
          <Button variant="outline" size="icon">
            <Heart className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        <div className="prose prose-lg max-w-none">
          <Card className="p-6 mb-8">
            <h2 className="font-heading text-xl font-semibold mb-4">About</h2>
            <p className="text-muted-foreground">
              {content.metaDescription || "Experience the best of Dubai with this amazing destination. Perfect for travelers seeking unforgettable moments in the city of dreams."}
            </p>
          </Card>

          <Card className="p-6 mb-8">
            <h2 className="font-heading text-xl font-semibold mb-4">Highlights</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <Star className="w-5 h-5 text-[#fdcd0a] shrink-0 mt-0.5" />
                World-class experience in the heart of Dubai
              </li>
              <li className="flex items-start gap-2">
                <Star className="w-5 h-5 text-[#fdcd0a] shrink-0 mt-0.5" />
                Stunning views and memorable moments
              </li>
              <li className="flex items-start gap-2">
                <Star className="w-5 h-5 text-[#fdcd0a] shrink-0 mt-0.5" />
                Easy access and convenient location
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <h2 className="font-heading text-xl font-semibold mb-4">Location</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-5 h-5 text-primary" />
              <span>Dubai, United Arab Emirates</span>
            </div>
          </Card>
        </div>
      </article>

      <footer className="py-8 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Logo variant="primary" height={28} />
            <div className="flex items-center gap-6 text-muted-foreground text-sm">
              <Link href="/hotels" className="hover:text-foreground transition-colors">Hotels</Link>
              <Link href="/attractions" className="hover:text-foreground transition-colors">Attractions</Link>
              <Link href="/articles" className="hover:text-foreground transition-colors">Articles</Link>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <span>2024 Travi</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
