import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Search, Clock, ChevronRight, ArrowRight,
  Newspaper, Globe
} from "lucide-react";
import type { ContentWithRelations } from "@shared/schema";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { useState, useMemo } from "react";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const defaultImages = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&h=600&fit=crop",
];

const categoryLabels: Record<string, string> = {
  attractions: "Attractions",
  hotels: "Hotels",
  food: "Food & Dining",
  transport: "Transport",
  events: "Events",
  tips: "Travel Tips",
  news: "Breaking News",
  shopping: "Shopping",
};

function ArticleCard({ content, index }: { content: ContentWithRelations; index: number }) {
  const imageUrl = content.heroImage || defaultImages[index % defaultImages.length];
  const category = content.article?.category || "news";
  const readTime = getReadTime(content);
  const date = getArticleDate(content);
  
  return (
    <Link href={`/articles/${content.slug}`}>
      <Card 
        className="group overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
        data-testid={`card-article-${content.slug}`}
      >
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={imageUrl} 
            alt={content.heroImageAlt || content.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {categoryLabels[category] || "News"}
            </Badge>
            <span className="text-muted-foreground text-xs">{date}</span>
            <span className="text-muted-foreground text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readTime}
            </span>
          </div>
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {content.title}
          </h3>
          {content.metaDescription && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {content.metaDescription}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}

function getArticleDate(content: ContentWithRelations) {
  return content.publishedAt 
    ? format(new Date(content.publishedAt), "MMM d, yyyy")
    : content.createdAt 
      ? format(new Date(content.createdAt), "MMM d, yyyy")
      : "Recent";
}

function getReadTime(content: ContentWithRelations) {
  const blocks = content.blocks as Array<{type: string, content?: {text?: string}}> | null;
  if (!blocks) return "5 min";
  const textContent = blocks
    .filter(b => b.type === "text")
    .map(b => b.content?.text || "")
    .join(" ");
  const wordCount = textContent.split(/\s+/).length;
  const minutes = Math.max(3, Math.ceil(wordCount / 200));
  return `${minutes} min`;
}

export default function PublicArticles() {
  const [searchQuery, setSearchQuery] = useState("");
  
  useDocumentMeta({
    title: "Dubai News & Travel Updates | Travi - Dubai Travel Portal",
    description: "Stay updated with the latest Dubai news, travel tips, attractions, hotels, dining, and events.",
    ogTitle: "Dubai News & Travel Updates | Travi",
    ogDescription: "Breaking news, travel guides, and updates for Dubai visitors.",
    ogType: "website",
  });
  
  const { data: allContent, isLoading } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/public/contents?includeExtensions=true"],
  });

  const articles = allContent?.filter(c => c.type === "article") || [];
  
  const filteredArticles = useMemo(() => {
    if (!searchQuery) return articles;
    
    const query = searchQuery.toLowerCase();
    return articles.filter(a => 
      a.title.toLowerCase().includes(query) ||
      a.metaDescription?.toLowerCase().includes(query)
    );
  }, [articles, searchQuery]);

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <PublicNav />

      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop"
            alt="Dubai skyline"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Dubai News
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Stay updated with the latest travel news, tips, and guides for Dubai.
          </p>
          
          <div className="max-w-xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 flex items-center gap-2 border border-white/20">
              <Search className="w-5 h-5 text-white/60 ml-3" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none py-3 text-white placeholder:text-white/50"
                data-testid="input-search-articles"
              />
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-1">
                {searchQuery ? "Search Results" : "Latest News"}
              </h2>
              <p className="text-muted-foreground">
                {isLoading ? "Loading..." : `${filteredArticles.length} news found`}
              </p>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video bg-muted rounded-lg mb-2" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, index) => (
                <ArticleCard key={article.id} content={article} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Newspaper className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? "Try a different search term" : "News will appear here once published"}
              </p>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery("")}
                  data-testid="button-clear-search"
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
