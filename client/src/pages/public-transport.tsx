import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Bus, Star, MapPin, ArrowLeft, Search } from "lucide-react";
import type { Content } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { useState } from "react";

const defaultPlaceholderImages = [
  "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop",
];

function TransportCard({ content, index }: { content: Content; index: number }) {
  const imageUrl = content.heroImage || defaultPlaceholderImages[index % defaultPlaceholderImages.length];
  
  return (
    <Link href={`/transport/${content.slug}`}>
      <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
        <div className="aspect-[16/10] overflow-hidden">
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
              <span className="font-medium">4.6</span>
            </span>
            <span className="text-muted-foreground/50">|</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              Dubai, UAE
            </span>
          </div>
          <h3 className="font-semibold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-[#6443f4] transition-colors">
            {content.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {content.metaDescription || "Get around Dubai with ease using this transport option."}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Transport Guide</span>
            <span className="font-bold text-[#6443f4]">Learn More</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function TransportCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 shadow-md animate-pulse">
      <div className="aspect-[16/10] bg-muted" />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-12 bg-muted rounded" />
          <div className="h-4 w-20 bg-muted rounded" />
        </div>
        <div className="h-6 bg-muted rounded mb-2 w-3/4" />
        <div className="h-4 bg-muted rounded w-full mb-1" />
        <div className="h-4 bg-muted rounded w-2/3 mb-4" />
        <div className="flex items-center justify-between">
          <div className="h-4 w-16 bg-muted rounded" />
          <div className="h-4 w-20 bg-muted rounded" />
        </div>
      </div>
    </Card>
  );
}

function PlaceholderTransportCard({ index }: { index: number }) {
  const placeholderData = [
    { title: "Dubai Metro", desc: "Fast, efficient rail system connecting major destinations across the city" },
    { title: "Dubai Tram", desc: "Modern tram service along Dubai Marina and JBR" },
    { title: "Dubai Taxi", desc: "Reliable taxi services available 24/7 across the emirate" },
    { title: "RTA Bus Network", desc: "Comprehensive bus routes covering all areas of Dubai" },
  ];
  const data = placeholderData[index % placeholderData.length];
  const imageUrl = defaultPlaceholderImages[index % defaultPlaceholderImages.length];
  
  return (
    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer">
      <div className="aspect-[16/10] overflow-hidden">
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
            <span className="font-medium">4.7</span>
          </span>
          <span className="text-muted-foreground/50">|</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            Dubai, UAE
          </span>
        </div>
        <h3 className="font-semibold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-[#6443f4] transition-colors">
          {data.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {data.desc}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Transport Guide</span>
          <span className="font-bold text-[#6443f4]">Learn More</span>
        </div>
      </div>
    </Card>
  );
}

export default function PublicTransport() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: allContent, isLoading } = useQuery<Content[]>({
    queryKey: ["/api/contents?status=published"],
  });

  const transportItems = allContent?.filter(c => c.type === "transport") || [];
  const filteredTransport = searchQuery 
    ? transportItems.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : transportItems;

  return (
    <div className="bg-background min-h-screen">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b" data-testid="nav-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo variant="primary" height={28} />
            <div className="hidden md:flex items-center gap-8">
              <Link href="/hotels" className="text-foreground/80 hover:text-[#6443f4] font-medium transition-colors">Hotels</Link>
              <Link href="/attractions" className="text-foreground/80 hover:text-[#6443f4] font-medium transition-colors">Attractions</Link>
              <Link href="/transport" className="text-[#6443f4] font-medium">Transport</Link>
              <Link href="/articles" className="text-foreground/80 hover:text-[#6443f4] font-medium transition-colors">Articles</Link>
            </div>
            <Link href="/admin">
              <Button variant="outline" size="sm">Admin</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-[#6443f4] via-[#7c5cf7] to-[#9b7bfa] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Bus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Transport in Dubai</h1>
              <p className="text-white/80">Navigate Dubai with our complete transport guide</p>
            </div>
          </div>
          
          <div className="mt-8 max-w-xl">
            <div className="bg-white rounded-xl p-2 flex items-center gap-2">
              <Search className="w-5 h-5 text-muted-foreground ml-3" />
              <input
                type="text"
                placeholder="Search transport options..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none py-2 text-foreground"
                data-testid="input-search-transport"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-muted-foreground">
              {isLoading ? "Loading..." : `${filteredTransport.length} transport options found`}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [0, 1, 2, 3, 4, 5].map((index) => (
                <TransportCardSkeleton key={index} />
              ))
            ) : filteredTransport.length > 0 ? (
              filteredTransport.map((item, index) => (
                <TransportCard key={item.id} content={item} index={index} />
              ))
            ) : (
              [0, 1, 2, 3].map((index) => (
                <PlaceholderTransportCard key={index} index={index} />
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
              <Link href="/transport" className="hover:text-foreground transition-colors">Transport</Link>
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
