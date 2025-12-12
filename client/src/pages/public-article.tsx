import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { Clock, Eye, Calendar, ChevronRight, Mail, Share2, Bookmark, Plane } from "lucide-react";
import type { ContentWithRelations } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicNav } from "@/components/public-nav";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import mascotImg from "@assets/Mascot_for_Light_Background_1765570034687.png";
import logoImg from "@assets/Full_Logo_for_Light_Background_1765570034686.png";

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
    <ellipse cx="30" cy="30" rx="25" ry="30" fill="url(#balloonShine)" />
    <path d="M15 55 L20 70 L40 70 L45 55" fill="#8B4513" />
    <rect x="18" y="70" width="24" height="15" rx="2" fill="#D2691E" stroke="#8B4513" strokeWidth="1" />
    <line x1="20" y1="55" x2="20" y2="70" stroke="#654321" strokeWidth="1" />
    <line x1="40" y1="55" x2="40" y2="70" stroke="#654321" strokeWidth="1" />
    <defs>
      <linearGradient id="balloonShine" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="white" stopOpacity="0.3" />
        <stop offset="50%" stopColor="white" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

const BirdSVG = ({ className = "" }: { className?: string }) => (
  <svg className={`w-6 h-4 ${className}`} viewBox="0 0 24 16" fill="#334155">
    <path d="M0 8 Q6 2 12 8 Q18 2 24 8 Q18 6 12 10 Q6 6 0 8" />
  </svg>
);

const categories = [
  { id: "all", label: "All" },
  { id: "travel-tips", label: "Travel Tips" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "adventure", label: "Adventure" },
  { id: "culture", label: "Culture" },
  { id: "food-dining", label: "Food & Dining" },
];

const sampleImages = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=800&h=500&fit=crop",
];

export default function PublicArticle() {
  const [, params] = useRoute("/articles/:slug");
  const slug = params?.slug;
  const [activeCategory, setActiveCategory] = useState("all");
  const [email, setEmail] = useState("");

  const { data: article, isLoading } = useQuery<ContentWithRelations>({
    queryKey: ["/api/contents/slug", slug],
    enabled: !!slug,
  });

  const { data: relatedArticles = [] } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/contents?type=article&status=published&limit=4"],
  });

  const { data: recommendations = [] } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/contents?status=published&limit=3"],
  });

  useDocumentMeta({
    title: article?.metaTitle || article?.title || "Article | Travi Dubai",
    description: article?.metaDescription || "Discover Dubai travel stories and guides",
    ogTitle: article?.metaTitle || article?.title || undefined,
    ogDescription: article?.metaDescription || undefined,
    ogType: "article",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen sky-gradient flex items-center justify-center">
        <div className="animate-pulse text-[#1E1B4B] text-xl">Loading article...</div>
      </div>
    );
  }

  const getContentPath = (content: ContentWithRelations) => `/${content.type}s/${content.slug}`;

  return (
    <div className="min-h-screen overflow-x-hidden">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md">
        Skip to main content
      </a>

      <PublicNav variant="default" />

      <main id="main-content" className="pt-20">
        {/* CATEGORY PILLS SECTION */}
        <section className="bg-background border-b border-border/40 sticky top-20 z-40" data-testid="section-categories">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? "bg-[#F59E0B] text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                  data-testid={`button-category-${cat.id}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ARTICLE CONTENT SECTION */}
        <section className="py-12 bg-background" data-testid="section-article-content">
          <article className="max-w-4xl mx-auto px-6">
            {/* Article Header */}
            <header className="mb-10">
              <Badge className="bg-[#6C5CE7] text-white border-0 mb-4">
                {article?.article?.category || "Travel Tips"}
              </Badge>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight" data-testid="text-article-title">
                {article?.title || "Discover Dubai: Where Tradition Meets Tomorrow"}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={article?.publishedAt?.toString()}>
                    {article?.publishedAt 
                      ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                      : "December 10, 2024"
                    }
                  </time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>5 min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>2.4K views</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" data-testid="button-share">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" data-testid="button-bookmark">
                  <Bookmark className="w-4 h-4" />
                </Button>
              </div>
            </header>

            {/* Hero Image */}
            <figure className="mb-10">
              <img
                src={article?.heroImage || sampleImages[0]}
                alt={article?.heroImageAlt || article?.title || "Dubai cityscape"}
                className="w-full rounded-2xl shadow-lg"
                data-testid="img-article-hero"
              />
              {article?.heroImageAlt && (
                <figcaption className="text-center text-sm text-muted-foreground mt-3">
                  {article.heroImageAlt}
                </figcaption>
              )}
            </figure>

            {/* Article Body */}
            <div className="prose prose-lg max-w-none dark:prose-invert mb-12" data-testid="article-body">
              <p className="text-lg text-foreground/90 leading-relaxed">
                Dubai stands as a testament to human ambition and vision, rising from the desert sands to become one of the world's most iconic cities. This guide takes you through the must-see experiences that make Dubai a destination unlike any other.
              </p>

              <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">The Iconic Skyline</h2>
              <p className="text-foreground/90 leading-relaxed">
                Home to the world's tallest building, the Burj Khalifa, Dubai's skyline is a marvel of modern architecture. The city's ambitious construction projects have created a unique urban landscape that seamlessly blends traditional Arabian design with futuristic innovation.
              </p>

              <figure className="my-8">
                <img
                  src={sampleImages[1]}
                  alt="Dubai Marina at sunset"
                  className="w-full rounded-xl shadow-md"
                />
                <figcaption className="text-center text-sm text-muted-foreground mt-3">
                  Dubai Marina at golden hour
                </figcaption>
              </figure>

              <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Cultural Heritage</h2>
              <p className="text-foreground/90 leading-relaxed">
                Beyond the glittering towers, Dubai preserves its rich heritage in neighborhoods like Al Fahidi Historical District. Wander through narrow lanes, visit traditional museums, and discover the emirate's pearl-diving past.
              </p>

              <p className="text-foreground/90 leading-relaxed">
                The city's souks remain bustling centers of commerce, where the scent of spices mingles with the glitter of gold. These markets offer an authentic glimpse into Dubai's trading history.
              </p>
            </div>

            {/* DECORATIVE QUOTE BLOCK */}
            <blockquote className="relative bg-gradient-to-br from-[#6C5CE7]/5 to-[#EC4899]/5 rounded-2xl p-8 my-12" data-testid="article-quote">
              <div className="absolute -top-6 left-8">
                <svg className="w-16 h-16 text-[#F59E0B]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/>
                </svg>
              </div>
              <p className="text-2xl lg:text-3xl font-medium text-foreground italic leading-relaxed pt-6">
                Dubai is not just a destination; it's an experience that transforms every traveler who walks its streets.
              </p>
              <footer className="mt-4 text-muted-foreground font-medium">
                - Local Travel Guide
              </footer>
            </blockquote>

            {/* Continue Article Body */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">Desert Adventures</h2>
              <p className="text-foreground/90 leading-relaxed">
                No visit to Dubai is complete without venturing into the golden dunes that surround the city. From thrilling dune bashing to serene camel rides at sunset, the desert offers experiences that create lasting memories.
              </p>

              <figure className="my-8">
                <img
                  src={sampleImages[2]}
                  alt="Desert safari in Dubai"
                  className="w-full rounded-xl shadow-md"
                />
                <figcaption className="text-center text-sm text-muted-foreground mt-3">
                  Experience the magic of the Arabian desert
                </figcaption>
              </figure>

              <p className="text-foreground/90 leading-relaxed">
                Whether you're seeking adventure, culture, or luxury, Dubai delivers an extraordinary experience. Plan your journey and prepare to be amazed by this city of dreams.
              </p>
            </div>
          </article>
        </section>

        {/* EXPERIENCE DUBAI BANNER */}
        <section className="relative py-24 sky-gradient overflow-hidden" data-testid="section-experience-banner">
          {/* Watermark Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="watermark-text opacity-[0.08]">EXPERIENCE DUBAI</span>
          </div>

          {/* Dubai Skyline Silhouette */}
          <div className="absolute bottom-0 left-0 right-0 h-40 dubai-skyline opacity-30" />

          {/* Floating Decorations */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <CloudSVG className="absolute top-10 left-[5%] opacity-70 animate-cloud-drift" size="lg" />
            <CloudSVG className="absolute top-24 right-[15%] opacity-60 animate-cloud-drift animation-delay-1000" size="md" />
            <HotAirBalloonSVG className="absolute top-16 right-[8%] animate-balloon" color="#EC4899" />
            <Plane className="absolute top-12 left-[40%] w-8 h-8 text-white/50 animate-plane plane-icon" />
            <BirdSVG className="absolute top-20 left-[50%] animate-bird" />
            <BirdSVG className="absolute top-28 left-[53%] animate-bird animation-delay-500" />
          </div>

          {/* Hero Figure Silhouette */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none">
            <svg className="w-48 h-64 opacity-20" viewBox="0 0 100 140" fill="#1E1B4B">
              <ellipse cx="50" cy="20" rx="15" ry="18" />
              <path d="M30 40 L40 38 L50 42 L60 38 L70 40 L65 90 L55 95 L50 140 L45 95 L35 90 Z" />
              <path d="M25 50 L30 48 L35 75 L25 80 Z" />
              <path d="M75 50 L70 48 L65 75 L75 80 Z" />
            </svg>
          </div>

          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl lg:text-6xl font-bold text-[#1E1B4B] mb-4">
              Your Dubai Adventure
            </h2>
            <p className="text-xl text-[#475569] font-script text-2xl mb-8">
              starts here
            </p>
            <Link href="/attractions">
              <Button className="btn-gold rounded-full px-10 py-6 text-lg" data-testid="button-explore-dubai">
                Explore Now
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* TRAVI RECOMMENDS SECTION */}
        <section className="py-20 bg-background relative overflow-hidden" data-testid="section-travi-recommends">
          <HotAirBalloonSVG className="absolute top-10 right-[5%] animate-float-slow opacity-40" color="#A855F7" />

          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-10">
              <img src={mascotImg} alt="" className="w-12 h-12" />
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                  Travi <span className="font-script text-[#EC4899]">Recommends</span>
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(recommendations.length > 0 ? recommendations : [
                { id: "1", title: "Desert Safari Adventure", heroImage: sampleImages[0], type: "attraction", slug: "desert-safari" },
                { id: "2", title: "Burj Khalifa Experience", heroImage: sampleImages[1], type: "attraction", slug: "burj-khalifa" },
                { id: "3", title: "Dubai Marina Walk", heroImage: sampleImages[2], type: "attraction", slug: "dubai-marina" },
              ] as any[]).slice(0, 3).map((item, index) => (
                <Link 
                  key={item.id} 
                  href={`/${item.type}s/${item.slug}`}
                  data-testid={`recommend-card-${item.id}`}
                >
                  <article 
                    className={`tilted-card relative overflow-hidden rounded-2xl shadow-xl cursor-pointer aspect-[4/5] ${
                      index === 0 ? 'tilt-left-sm' : index === 2 ? 'tilt-right-sm' : ''
                    }`}
                  >
                    <img
                      src={item.heroImage || sampleImages[index % 3]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-[#6C5CE7] border-0 text-xs font-semibold capitalize">
                        {item.type}
                      </Badge>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-white font-bold text-lg line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* RELATED ARTICLES SECTION */}
        <section className="py-20 sky-gradient-light relative overflow-hidden" data-testid="section-related-articles">
          <div className="absolute inset-0 pointer-events-none">
            <CloudSVG className="absolute top-10 left-[10%] opacity-50" size="lg" />
            <CloudSVG className="absolute top-40 right-[15%] opacity-40" size="md" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-[#1E1B4B]">
                  Related <span className="font-script text-[#6C5CE7]">Articles</span>
                </h2>
                <p className="text-[#64748B] mt-2">Continue your Dubai discovery</p>
              </div>
              <Link href="/articles" className="hidden sm:block">
                <Button variant="outline" className="border-[#6C5CE7] text-[#6C5CE7] rounded-full px-6" data-testid="button-view-all-articles">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(relatedArticles.length > 0 ? relatedArticles : [
                { id: "r1", title: "Top 10 Hidden Gems in Dubai", heroImage: sampleImages[0], slug: "hidden-gems" },
                { id: "r2", title: "Dubai Food Guide: Local Favorites", heroImage: sampleImages[1], slug: "food-guide" },
                { id: "r3", title: "Luxury Shopping Destinations", heroImage: sampleImages[2], slug: "shopping" },
                { id: "r4", title: "Best Beach Clubs in Dubai", heroImage: sampleImages[0], slug: "beach-clubs" },
              ] as any[]).slice(0, 4).map((item, index) => (
                <Link 
                  key={item.id} 
                  href={`/articles/${item.slug}`}
                  data-testid={`related-card-${item.id}`}
                >
                  <article 
                    className={`tilted-card relative overflow-hidden rounded-xl shadow-lg cursor-pointer aspect-[3/4] ${
                      index % 2 === 0 ? 'tilt-left-sm' : 'tilt-right-sm'
                    }`}
                  >
                    <img
                      src={item.heroImage || sampleImages[index % 3]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1">
                      <Eye className="w-3 h-3 text-white" />
                      <span className="text-white text-xs">{Math.floor(Math.random() * 5 + 1)}K</span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-semibold text-sm line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

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
                <img src={mascotImg} alt="" className="w-16 h-16" />
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Explore</h3>
                <ul className="space-y-2">
                  <li><Link href="/attractions" className="text-white/70 hover:text-white text-sm">Attractions</Link></li>
                  <li><Link href="/hotels" className="text-white/70 hover:text-white text-sm">Hotels</Link></li>
                  <li><Link href="/dining" className="text-white/70 hover:text-white text-sm">Dining</Link></li>
                  <li><Link href="/districts" className="text-white/70 hover:text-white text-sm">Districts</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><Link href="/articles" className="text-white/70 hover:text-white text-sm">Travel Tips</Link></li>
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
              <p className="text-white/60 text-sm">
                {new Date().getFullYear()} Travi. Made with love for Dubai explorers.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
