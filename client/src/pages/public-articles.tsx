import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Search, Clock } from "lucide-react";
import type { ContentWithRelations } from "@shared/schema";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { CompactHero } from "@/components/image-hero";
import { FeaturedCard, EditorialCard, SectionHeader } from "@/components/editorial-cards";
import { useState } from "react";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { format } from "date-fns";

const heroImage = "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1920&h=600&fit=crop";

const defaultPlaceholderImages = [
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
  news: "News",
  shopping: "Shopping",
};

function ArticleCardSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse flex gap-4">
      <div className="w-24 sm:w-32 lg:w-40 flex-shrink-0">
        <div className="aspect-square bg-muted rounded-lg" />
      </div>
      <div className="flex-1 py-2 space-y-2">
        <div className="h-3 w-20 bg-muted rounded" />
        <div className="h-5 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
      </div>
    </div>
  );
}

function FeaturedArticleSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="aspect-[16/9] bg-muted rounded-lg mb-4" />
      <div className="space-y-2">
        <div className="h-4 w-24 bg-muted rounded" />
        <div className="h-7 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-full" />
      </div>
    </div>
  );
}

export default function PublicArticles() {
  const [searchQuery, setSearchQuery] = useState("");
  
  useDocumentMeta({
    title: "Dubai Travel Articles & Guides | Travi - Dubai Travel Guide",
    description: "Read expert travel articles and guides about Dubai. Get tips on visa requirements, best times to visit, hidden gems, food scene, and more.",
    ogTitle: "Dubai Travel Articles & Guides | Travi",
    ogDescription: "Expert tips and inspiration for your Dubai adventure. Travel guides, tips, and local insights.",
    ogType: "website",
  });
  
  const { data: allContent, isLoading } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/contents?status=published&includeExtensions=true"],
  });

  const articles = allContent?.filter(c => c.type === "article") || [];
  const filteredArticles = searchQuery 
    ? articles.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : articles;

  const featuredArticle = filteredArticles[0];
  const secondaryArticles = filteredArticles.slice(1, 4);
  const remainingArticles = filteredArticles.slice(4);

  const placeholderArticles = [
    { title: "Ultimate Dubai Travel Guide 2024", desc: "Everything you need to know about visiting Dubai - from visa requirements to best places to visit", category: "tips", readTime: "12 min read" },
    { title: "Top 10 Hidden Gems in Dubai", desc: "Discover the secret spots that most tourists never find on their Dubai adventure", category: "attractions", readTime: "8 min read" },
    { title: "Dubai Food Scene: A Complete Guide", desc: "From street food to fine dining, explore the diverse culinary landscape of Dubai", category: "food", readTime: "10 min read" },
    { title: "Best Time to Visit Dubai", desc: "Plan your trip with our comprehensive guide to Dubai's weather and seasons", category: "tips", readTime: "6 min read" },
    { title: "Dubai on a Budget", desc: "Yes, it's possible! Our money-saving tips for experiencing luxury Dubai without breaking the bank", category: "tips", readTime: "7 min read" },
    { title: "Getting Around Dubai", desc: "Complete guide to Dubai's metro, buses, taxis, and other transport options", category: "transport", readTime: "5 min read" },
  ];

  function getArticleDate(content: ContentWithRelations) {
    return content.publishedAt 
      ? format(new Date(content.publishedAt), "MMM d, yyyy")
      : content.createdAt 
        ? format(new Date(content.createdAt), "MMM d, yyyy")
        : "Recent";
  }

  function getReadTime(content: ContentWithRelations) {
    const blocks = content.blocks as Array<{type: string, content?: {text?: string}}> | null;
    if (!blocks) return "5 min read";
    const textContent = blocks
      .filter(b => b.type === "text")
      .map(b => b.content?.text || "")
      .join(" ");
    const wordCount = textContent.split(/\s+/).length;
    const minutes = Math.max(3, Math.ceil(wordCount / 200));
    return `${minutes} min read`;
  }

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Skip to main content
      </a>
      
      <PublicNav />

      <main id="main-content" className="flex-1">
        <CompactHero 
          backgroundImage={heroImage}
          title="Travel Articles & Guides"
          subtitle="Expert tips and inspiration for your Dubai adventure"
        />

        <section className="py-8 bg-background" aria-label="Search articles">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <form role="search" onSubmit={(e) => e.preventDefault()} className="max-w-xl">
              <label htmlFor="article-search" className="sr-only">Search articles</label>
              <div className="bg-card border rounded-lg p-2 flex items-center gap-2">
                <Search className="w-5 h-5 text-muted-foreground ml-3" aria-hidden="true" />
                <input
                  id="article-search"
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none py-2 text-foreground"
                  data-testid="input-search-articles"
                />
              </div>
            </form>
            <p className="mt-4 text-muted-foreground text-sm" aria-live="polite" data-testid="text-articles-count">
              {isLoading ? "Loading..." : `${filteredArticles.length} articles found`}
            </p>
          </div>
        </section>

        {isLoading ? (
          <section className="py-12" aria-label="Loading articles">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <FeaturedArticleSkeleton />
                </div>
                <div className="space-y-6">
                  {[0, 1, 2].map((i) => (
                    <ArticleCardSkeleton key={i} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : filteredArticles.length > 0 ? (
          <>
            <section className="py-8" aria-label="Featured articles">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {featuredArticle && (
                    <div className="lg:col-span-2">
                      <FeaturedCard
                        title={featuredArticle.title}
                        description={featuredArticle.metaDescription || "Discover expert travel tips and guides for Dubai."}
                        image={featuredArticle.heroImage || defaultPlaceholderImages[0]}
                        href={`/articles/${featuredArticle.slug}`}
                        category={categoryLabels[featuredArticle.article?.category || "tips"] || "Travel Guide"}
                        categoryColor="bg-cyan-600"
                        date={getArticleDate(featuredArticle)}
                      />
                    </div>
                  )}
                  
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold text-foreground">Latest Stories</h2>
                    {secondaryArticles.map((article, index) => (
                      <EditorialCard
                        key={article.id}
                        title={article.title}
                        image={article.heroImage || defaultPlaceholderImages[(index + 1) % defaultPlaceholderImages.length]}
                        href={`/articles/${article.slug}`}
                        category={categoryLabels[article.article?.category || "tips"] || "Travel Guide"}
                        categoryColor="text-cyan-600"
                        date={getArticleDate(article)}
                        readTime={getReadTime(article)}
                        variant="horizontal"
                        size="small"
                        data-testid={`card-article-${article.id}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {remainingArticles.length > 0 && (
              <section className="py-12 bg-muted/30" aria-labelledby="all-articles-heading">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <SectionHeader 
                    title="All Articles"
                    subtitle="Browse our complete collection of travel guides"
                  />
                  <div className="space-y-6">
                    {remainingArticles.map((article, index) => (
                      <EditorialCard
                        key={article.id}
                        title={article.title}
                        excerpt={article.metaDescription}
                        image={article.heroImage || defaultPlaceholderImages[(index + 4) % defaultPlaceholderImages.length]}
                        href={`/articles/${article.slug}`}
                        category={categoryLabels[article.article?.category || "tips"] || "Travel Guide"}
                        categoryColor="text-cyan-600"
                        date={getArticleDate(article)}
                        readTime={getReadTime(article)}
                        variant="horizontal"
                        size="medium"
                        data-testid={`card-article-${article.id}`}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        ) : (
          <section className="py-12" aria-label="Sample articles">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                <div className="lg:col-span-2">
                  <FeaturedCard
                    title={placeholderArticles[0].title}
                    description={placeholderArticles[0].desc}
                    image={defaultPlaceholderImages[0]}
                    href="#"
                    category={categoryLabels[placeholderArticles[0].category]}
                    categoryColor="bg-cyan-600"
                    date="Dec 2024"
                  />
                </div>
                
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-foreground">Latest Stories</h2>
                  {placeholderArticles.slice(1, 4).map((article, index) => (
                    <EditorialCard
                      key={index}
                      title={article.title}
                      image={defaultPlaceholderImages[(index + 1) % defaultPlaceholderImages.length]}
                      href="#"
                      category={categoryLabels[article.category]}
                      categoryColor="text-cyan-600"
                      readTime={article.readTime}
                      variant="horizontal"
                      size="small"
                    />
                  ))}
                </div>
              </div>
              
              <SectionHeader 
                title="More to Read"
                subtitle="Expert guides and local insights"
              />
              <div className="space-y-6">
                {placeholderArticles.slice(4).map((article, index) => (
                  <EditorialCard
                    key={index}
                    title={article.title}
                    excerpt={article.desc}
                    image={defaultPlaceholderImages[(index + 4) % defaultPlaceholderImages.length]}
                    href="#"
                    category={categoryLabels[article.category]}
                    categoryColor="text-cyan-600"
                    readTime={article.readTime}
                    variant="horizontal"
                    size="medium"
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
