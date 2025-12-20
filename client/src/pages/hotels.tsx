import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { ContentWithRelations } from "@shared/schema";
import { PublicNav } from "@/components/public-nav";
import { CompactHero } from "@/components/image-hero";
import { FeaturedCard, EditorialCard, SectionHeader } from "@/components/editorial-cards";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MapPin, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const heroImage = "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&h=600&fit=crop";

const placeholderImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1520260497591-112f2f40a3f4?w=800&h=600&fit=crop",
];

function HotelCardSkeleton() {
  return (
    <div className="space-y-4 animate-pulse" aria-hidden="true">
      <div className="aspect-[16/10] bg-muted rounded-lg" />
      <div className="space-y-2">
        <div className="h-4 w-20 bg-muted rounded" />
        <div className="h-6 w-3/4 bg-muted rounded" />
        <div className="h-4 w-full bg-muted rounded" />
      </div>
    </div>
  );
}

export default function Hotels() {
  useDocumentMeta({
    title: "Luxury Hotels in Dubai | Travi",
    description: "Discover Dubai's finest hotels - from iconic beachfront resorts to urban retreats. Find your perfect luxury stay with world-class amenities and service.",
    ogTitle: "Dubai Hotels - Travi",
    ogDescription: "Experience world-class hospitality in Dubai's finest hotels.",
  });

  const { data: hotels = [], isLoading } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/contents?type=hotel&status=published"],
  });

  const featuredHotels = hotels.slice(0, 2);
  const otherHotels = hotels.slice(2);

  return (
    <div className="bg-background min-h-screen">
      <PublicNav />

      <main>
        <CompactHero
          backgroundImage={heroImage}
          title="Luxury Hotels"
          subtitle="World-class hospitality in the city of dreams"
        />

        <section className="py-12 lg:py-16" data-testid="section-hotels-list">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {isLoading ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  <HotelCardSkeleton />
                  <HotelCardSkeleton />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <HotelCardSkeleton key={i} />
                  ))}
                </div>
              </>
            ) : hotels.length === 0 ? (
              <div className="text-center py-16">
                <Building2 className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h2 className="text-2xl font-semibold text-foreground mb-2">No hotels available yet</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We're curating the finest hotels in Dubai. Check back soon for luxury stays and exclusive experiences.
                </p>
              </div>
            ) : (
              <>
                {featuredHotels.length > 0 && (
                  <div className="mb-12">
                    <SectionHeader
                      title="Featured Stays"
                      subtitle="Handpicked luxury experiences"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {featuredHotels.map((hotel, index) => (
                        <FeaturedCard
                          key={hotel.id}
                          title={hotel.title}
                          description={hotel.metaDescription || "Experience unparalleled luxury and comfort"}
                          image={hotel.heroImage || placeholderImages[index]}
                          href={`/hotels/${hotel.slug}`}
                          category="Luxury"
                          categoryColor="bg-[#FF9327]"
                          location="Dubai"
                          rating={4.9}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {otherHotels.length > 0 && (
                  <div>
                    <SectionHeader
                      title="All Hotels"
                      subtitle={`${hotels.length} exceptional properties`}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {otherHotels.map((hotel, index) => (
                        <Link key={hotel.id} href={`/hotels/${hotel.slug}`}>
                          <article 
                            className="group cursor-pointer"
                            data-testid={`card-hotel-${hotel.id}`}
                          >
                            <div className="relative aspect-[4/3] rounded-lg overflow-hidden mb-4">
                              <img
                                src={hotel.heroImage || placeholderImages[index % 4]}
                                alt={hotel.heroImageAlt || hotel.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                loading="lazy"
                              />
                              <div className="absolute top-3 right-3">
                                <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-sm px-2 py-1 rounded-md">
                                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                  <span>4.8</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Badge variant="secondary" className="text-xs bg-[#FF9327]/10 text-[#FF9327] border-[#FF9327]/20">
                                Hotel
                              </Badge>
                              
                              <h3 className="text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                {hotel.title}
                              </h3>
                              
                              {hotel.metaDescription && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {hotel.metaDescription}
                                </p>
                              )}
                              
                              <div className="flex items-center gap-1 text-muted-foreground text-sm pt-1">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>Dubai</span>
                              </div>
                            </div>
                          </article>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
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
