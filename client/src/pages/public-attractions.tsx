import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Mountain, Star, MapPin, ArrowLeft, Search, Clock } from "lucide-react";
import type { Content } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { useState } from "react";

const defaultPlaceholderImages = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1546412414-e1885259563a?w=600&h=400&fit=crop",
];

function AttractionCard({ content, index }: { content: Content; index: number }) {
  const imageUrl = content.heroImage || defaultPlaceholderImages[index % defaultPlaceholderImages.length];
  
  return (
    <Link href={`/attractions/${content.slug}`}>
      <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
        <div className="aspect-[4/3] overflow-hidden">
          <img 
            src={imageUrl} 
            alt={content.heroImageAlt || content.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#fdcd0a] text-[#fdcd0a]" />
              <span className="font-medium">4.8</span>
            </span>
            <span className="text-muted-foreground/50">|</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              2-4 hours
            </span>
          </div>
          <h3 className="font-heading font-semibold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {content.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {content.metaDescription || "Discover this amazing attraction in Dubai."}
          </p>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Dubai, UAE</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function AttractionCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 shadow-md animate-pulse">
      <div className="aspect-[4/3] bg-muted" />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-12 bg-muted rounded" />
          <div className="h-4 w-16 bg-muted rounded" />
        </div>
        <div className="h-6 bg-muted rounded mb-2 w-3/4" />
        <div className="h-4 bg-muted rounded w-full mb-1" />
        <div className="h-4 bg-muted rounded w-2/3 mb-4" />
        <div className="h-4 w-24 bg-muted rounded" />
      </div>
    </Card>
  );
}

function PlaceholderAttractionCard({ index }: { index: number }) {
  const placeholderData = [
    { title: "Burj Khalifa", desc: "Visit the world's tallest building and enjoy breathtaking panoramic views" },
    { title: "Desert Safari", desc: "Experience thrilling dune bashing, camel rides, and Bedouin hospitality" },
    { title: "Dubai Mall", desc: "Explore the world's largest shopping destination with endless entertainment" },
    { title: "Palm Jumeirah", desc: "Discover the iconic man-made island with luxury resorts and dining" },
  ];
  const data = placeholderData[index % placeholderData.length];
  const imageUrl = defaultPlaceholderImages[index % defaultPlaceholderImages.length];
  
  return (
    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={imageUrl} 
          alt={data.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-[#fdcd0a] text-[#fdcd0a]" />
            <span className="font-medium">4.9</span>
          </span>
          <span className="text-muted-foreground/50">|</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            2-4 hours
          </span>
        </div>
        <h3 className="font-heading font-semibold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {data.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {data.desc}
        </p>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Dubai, UAE</span>
        </div>
      </div>
    </Card>
  );
}

export default function PublicAttractions() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: allContent, isLoading } = useQuery<Content[]>({
    queryKey: ["/api/contents?status=published"],
  });

  const attractions = allContent?.filter(c => c.type === "attraction") || [];
  const filteredAttractions = searchQuery 
    ? attractions.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : attractions;

  return (
    <div className="bg-background min-h-screen">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b" data-testid="nav-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo variant="primary" height={28} />
            <div className="hidden md:flex items-center gap-8">
              <Link href="/hotels" className="text-foreground/80 hover:text-primary font-medium transition-colors">Hotels</Link>
              <Link href="/attractions" className="text-primary font-medium">Attractions</Link>
              <Link href="/articles" className="text-foreground/80 hover:text-primary font-medium transition-colors">Articles</Link>
            </div>
            <Link href="/admin">
              <Button variant="outline" size="sm">Admin</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-[#4c2889] via-[#6443F4] to-[#8b5cf6] py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBvbHlnb24gcG9pbnRzPSIzMCAwIDYwIDMwIDMwIDYwIDAgMzAiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50" />
        <div className="absolute top-5 left-20 w-36 h-36 bg-[#F94498] rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-5 right-20 w-28 h-28 bg-[#a78bfa] rounded-full blur-3xl opacity-25" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#a78bfa] to-[#6443F4] flex items-center justify-center shadow-lg">
              <Mountain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">Explore Dubai Attractions</h1>
              <p className="text-white/90">Discover unforgettable experiences and iconic landmarks</p>
            </div>
          </div>
          
          <div className="mt-8 max-w-xl">
            <div className="bg-white rounded-xl p-2 flex items-center gap-2 shadow-xl">
              <Search className="w-5 h-5 text-muted-foreground ml-3" />
              <input
                type="text"
                placeholder="Search attractions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none py-2 text-foreground"
                data-testid="input-search-attractions"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-muted-foreground">
              {isLoading ? "Loading..." : `${filteredAttractions.length} attractions found`}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              [0, 1, 2, 3, 4, 5, 6, 7].map((index) => (
                <AttractionCardSkeleton key={index} />
              ))
            ) : filteredAttractions.length > 0 ? (
              filteredAttractions.map((attraction, index) => (
                <AttractionCard key={attraction.id} content={attraction} index={index} />
              ))
            ) : (
              [0, 1, 2, 3].map((index) => (
                <PlaceholderAttractionCard key={index} index={index} />
              ))
            )}
          </div>
        </div>
      </section>

      <footer className="py-8 border-t mt-auto">
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
