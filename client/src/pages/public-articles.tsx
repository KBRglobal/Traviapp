import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { BookOpen, ArrowLeft, Search, Calendar, User } from "lucide-react";
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

function ArticleCard({ content, index }: { content: Content; index: number }) {
  const imageUrl = content.heroImage || defaultPlaceholderImages[index % defaultPlaceholderImages.length];
  
  return (
    <Link href={`/articles/${content.slug}`}>
      <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col sm:flex-row">
        <div className="sm:w-72 aspect-[16/10] sm:aspect-auto overflow-hidden shrink-0">
          <img 
            src={imageUrl} 
            alt={content.heroImageAlt || content.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        </div>
        <div className="p-5 flex-1">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="px-2 py-1 bg-[#f0edfe] text-[#6443f4] rounded-full font-medium">
              Travel Guide
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Dec 2024
            </span>
          </div>
          <h3 className="font-semibold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-[#6443f4] transition-colors">
            {content.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {content.metaDescription || "Discover the best tips and guides for exploring Dubai."}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#6443f4] flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm text-muted-foreground">Travi Team</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function ArticleCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 shadow-md animate-pulse flex flex-col sm:flex-row">
      <div className="sm:w-72 aspect-[16/10] sm:aspect-auto bg-muted shrink-0" />
      <div className="p-5 flex-1">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-5 w-20 bg-muted rounded-full" />
          <div className="h-4 w-16 bg-muted rounded" />
        </div>
        <div className="h-6 bg-muted rounded mb-2 w-3/4" />
        <div className="h-4 bg-muted rounded w-full mb-1" />
        <div className="h-4 bg-muted rounded w-2/3 mb-4" />
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-muted rounded-full" />
          <div className="h-4 w-20 bg-muted rounded" />
        </div>
      </div>
    </Card>
  );
}

function PlaceholderArticleCard({ index }: { index: number }) {
  const placeholderData = [
    { title: "Ultimate Dubai Travel Guide 2024", desc: "Everything you need to know about visiting Dubai - from visa requirements to best places to visit" },
    { title: "Top 10 Hidden Gems in Dubai", desc: "Discover the secret spots that most tourists never find on their Dubai adventure" },
    { title: "Dubai Food Scene: A Complete Guide", desc: "From street food to fine dining, explore the diverse culinary landscape of Dubai" },
    { title: "Best Time to Visit Dubai", desc: "Plan your trip with our comprehensive guide to Dubai's weather and seasons" },
  ];
  const data = placeholderData[index % placeholderData.length];
  const imageUrl = defaultPlaceholderImages[index % defaultPlaceholderImages.length];
  
  return (
    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col sm:flex-row">
      <div className="sm:w-72 aspect-[16/10] sm:aspect-auto overflow-hidden shrink-0">
        <img 
          src={imageUrl} 
          alt={data.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
      </div>
      <div className="p-5 flex-1">
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span className="px-2 py-1 bg-[#f0edfe] text-[#6443f4] rounded-full font-medium">
            Travel Guide
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Dec 2024
          </span>
        </div>
        <h3 className="font-semibold text-lg text-foreground line-clamp-2 mb-2 group-hover:text-[#6443f4] transition-colors">
          {data.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {data.desc}
        </p>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#6443f4] flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm text-muted-foreground">Travi Team</span>
        </div>
      </div>
    </Card>
  );
}

export default function PublicArticles() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: allContent, isLoading } = useQuery<Content[]>({
    queryKey: ["/api/contents?status=published"],
  });

  const articles = allContent?.filter(c => c.type === "article") || [];
  const filteredArticles = searchQuery 
    ? articles.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : articles;

  return (
    <div className="bg-background min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b" data-testid="nav-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo variant="primary" height={28} />
            <div className="hidden md:flex items-center gap-8">
              <Link href="/hotels" className="text-foreground/80 hover:text-[#6443f4] font-medium transition-colors">Hotels</Link>
              <Link href="/attractions" className="text-foreground/80 hover:text-[#6443f4] font-medium transition-colors">Attractions</Link>
              <Link href="/articles" className="text-[#6443f4] font-medium">Articles</Link>
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
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">Travel Articles</h1>
              <p className="text-white/80">Tips, guides, and inspiration for your Dubai trip</p>
            </div>
          </div>
          
          {/* Search */}
          <div className="mt-8 max-w-xl">
            <div className="bg-white rounded-xl p-2 flex items-center gap-2">
              <Search className="w-5 h-5 text-muted-foreground ml-3" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none py-2 text-foreground"
                data-testid="input-search-articles"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-muted-foreground">
              {isLoading ? "Loading..." : `${filteredArticles.length} articles found`}
            </p>
          </div>

          <div className="space-y-6">
            {isLoading ? (
              [0, 1, 2, 3].map((index) => (
                <ArticleCardSkeleton key={index} />
              ))
            ) : filteredArticles.length > 0 ? (
              filteredArticles.map((article, index) => (
                <ArticleCard key={article.id} content={article} index={index} />
              ))
            ) : (
              [0, 1, 2, 3].map((index) => (
                <PlaceholderArticleCard key={index} index={index} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
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
