import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { ContentWithRelations } from "@shared/schema";
import { PublicNav } from "@/components/public-nav";
import { CompactHero } from "@/components/image-hero";
import { FeaturedCard, SectionHeader } from "@/components/editorial-cards";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MapPin, Mountain, Flame, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const heroImage = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=600&fit=crop";

const placeholderImages = [
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&h=1000&fit=crop",
  "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&h=1000&fit=crop",
];

function AttractionCardSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="aspect-[4/5] bg-muted rounded-lg" />
    </div>
  );
}

export default function Attractions() {
  useDocumentMeta({
    title: "Dubai Attractions & Things to Do | Travi",
    description: "Explore Dubai's iconic landmarks, thrilling adventures, and hidden gems. From Burj Khalifa to desert safaris, discover unforgettable experiences.",
    ogTitle: "Dubai Attractions - Travi",
    ogDescription: "Discover iconic landmarks and unforgettable experiences in Dubai.",
  });

  const { data: attractions = [], isLoading } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/contents?type=attraction&status=published"],
  });

  const featuredAttraction = attractions[0];
  const gridAttractions = attractions.slice(1);

  return (
    <div className="bg-background min-h-screen">
      <PublicNav />

      <main>
        <CompactHero
          backgroundImage={heroImage}
          title="Attractions"
          subtitle="Iconic landmarks and unforgettable experiences"
        />

        <section className="py-12 lg:py-16" data-testid="section-attractions-list">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {[...Array(8)].map((_, i) => (
                  <AttractionCardSkeleton key={i} />
                ))}
              </div>
            ) : attractions.length === 0 ? (
              <div className="text-center py-16">
                <Mountain className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h2 className="text-2xl font-semibold text-foreground mb-2">No attractions available yet</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We're curating the best attractions in Dubai. Check back soon for exciting experiences.
                </p>
              </div>
            ) : (
              <>
                {featuredAttraction && (
                  <div className="mb-12">
                    <SectionHeader
                      title="Don't Miss"
                      subtitle="The most popular experience in Dubai"
                    />
                    <FeaturedCard
                      title={featuredAttraction.title}
                      description={featuredAttraction.metaDescription || "Experience the magic of Dubai"}
                      image={featuredAttraction.heroImage || placeholderImages[0]}
                      href={`/attractions/${featuredAttraction.slug}`}
                      category="Must See"
                      categoryColor="bg-[#F94498]"
                      location="Dubai"
                      rating={4.9}
                      className="max-w-3xl"
                    />
                  </div>
                )}

                <div>
                  <SectionHeader
                    title="All Attractions"
                    subtitle={`${attractions.length} amazing experiences`}
                  />
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                    {gridAttractions.map((attraction, index) => (
                      <Link key={attraction.id} href={`/attractions/${attraction.slug}`}>
                        <article 
                          className="group relative overflow-hidden rounded-lg cursor-pointer aspect-[4/5]"
                          data-testid={`card-attraction-${attraction.id}`}
                        >
                          <img
                            src={attraction.heroImage || placeholderImages[index % 4]}
                            alt={attraction.heroImageAlt || attraction.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                          
                          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
                            <Badge className="bg-[#F94498] text-white border-0 text-xs">
                              <Flame className="w-3 h-3 mr-1" />
                              Hot
                            </Badge>
                          </div>
                          
                          <div className="absolute top-3 right-3">
                            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span>4.8</span>
                            </div>
                          </div>
                          
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="text-white font-semibold text-sm lg:text-base line-clamp-2 group-hover:text-white/90 transition-colors mb-2">
                              {attraction.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-white/70 text-xs">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                Dubai
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                2-3 hrs
                              </span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        <footer className="py-8 border-t bg-muted/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center text-sm text-muted-foreground">
            <p>Travi - Your Dubai Travel Companion</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
