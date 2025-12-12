import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Mountain, Star, MapPin, ArrowLeft, Plane, Search, Clock } from "lucide-react";
import type { Content } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

const defaultPlaceholderImages = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1546412414-e1885259563a?w=600&h=400&fit=crop",
];

function TextLogo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="w-9 h-9 rounded-xl bg-[#6443f4] flex items-center justify-center">
        <Plane className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-bold text-[#6443f4]">TRAVI</span>
    </Link>
  );
}

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
          <h3 className="font-semibold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-[#6443f4] transition-colors">
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
        <h3 className="font-semibold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-[#6443f4] transition-colors">
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
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b" data-testid="nav-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <TextLogo />
            <div className="hidden md:flex items-center gap-8">
              <Link href="/hotels" className="text-foreground/80 hover:text-[#6443f4] font-medium transition-colors">Hotels</Link>
              <Link href="/attractions" className="text-[#6443f4] font-medium">Attractions</Link>
              <Link href="/articles" className="text-foreground/80 hover:text-[#6443f4] font-medium transition-colors">Articles</Link>
            </div>
            <Link href="/admin">
              <Button variant="outline" size="sm">Admin</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#6443f4] via-[#7c5cf7] to-[#9b7bfa] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <Mountain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Attractions in Dubai</h1>
              <p className="text-white/80">Discover amazing experiences and landmarks</p>
            </div>
          </div>
          
          {/* Search */}
          <div className="mt-8 max-w-xl">
            <div className="bg-white rounded-xl p-2 flex items-center gap-2">
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

      {/* Content */}
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

      {/* Footer */}
      <footer className="py-8 border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <TextLogo />
            <div className="flex items-center gap-6 text-muted-foreground text-sm">
              <Link href="/hotels" className="hover:text-foreground transition-colors">Hotels</Link>
              <Link href="/attractions" className="hover:text-foreground transition-colors">Attractions</Link>
              <Link href="/articles" className="hover:text-foreground transition-colors">Articles</Link>
            </div>
            <p className="text-muted-foreground text-sm">2024 Travi</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
