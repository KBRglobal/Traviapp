import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Star, MapPin, Search } from "lucide-react";
import type { ContentWithRelations } from "@shared/schema";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { CompactHero } from "@/components/image-hero";
import { FeaturedCard, EditorialCard, ContentGrid, SectionHeader } from "@/components/editorial-cards";
import { useState } from "react";
import { useDocumentMeta } from "@/hooks/use-document-meta";

const heroImage = "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&h=600&fit=crop";

const defaultPlaceholderImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop",
];

function HotelCardSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="aspect-[16/10] bg-muted rounded-lg mb-4" />
      <div className="space-y-2">
        <div className="h-4 w-20 bg-muted rounded" />
        <div className="h-6 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
    </div>
  );
}

export default function PublicHotels() {
  const [searchQuery, setSearchQuery] = useState("");
  
  useDocumentMeta({
    title: "Luxury Hotels in Dubai | Travi - Dubai Travel Guide",
    description: "Discover the finest luxury hotels in Dubai. From iconic resorts like Atlantis and Burj Al Arab to boutique properties, find your perfect Dubai accommodation.",
    ogTitle: "Luxury Hotels in Dubai | Travi",
    ogDescription: "Find world-class hospitality in the city of dreams. Browse our curated collection of Dubai's finest hotels.",
    ogType: "website",
  });
  
  const { data: allContent, isLoading } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/contents?status=published&includeExtensions=true"],
  });

  const hotels = allContent?.filter(c => c.type === "hotel") || [];
  const filteredHotels = searchQuery 
    ? hotels.filter(h => h.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : hotels;

  const featuredHotel = filteredHotels[0];
  const remainingHotels = filteredHotels.slice(1);

  const placeholderHotels = [
    { title: "Atlantis The Palm", desc: "Iconic luxury resort on Palm Jumeirah with aquarium and waterpark", location: "Palm Jumeirah", rating: 5 },
    { title: "Burj Al Arab", desc: "The world's most luxurious hotel with stunning architecture", location: "Jumeirah Beach", rating: 5 },
    { title: "Address Downtown", desc: "Modern luxury in the heart of Downtown Dubai", location: "Downtown Dubai", rating: 5 },
    { title: "One&Only Royal Mirage", desc: "Arabian palace resort with pristine beach access", location: "Al Sufouh", rating: 5 },
  ];

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
          title="Luxury Hotels in Dubai"
          subtitle="Experience world-class hospitality in the city of dreams"
        />

        <section className="py-8 bg-background" aria-label="Search hotels">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <form role="search" onSubmit={(e) => e.preventDefault()} className="max-w-xl">
              <label htmlFor="hotel-search" className="sr-only">Search hotels</label>
              <div className="bg-card border rounded-lg p-2 flex items-center gap-2">
                <Search className="w-5 h-5 text-muted-foreground ml-3" aria-hidden="true" />
                <input
                  id="hotel-search"
                  type="text"
                  placeholder="Search luxury hotels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none py-2 text-foreground"
                  data-testid="input-search-hotels"
                />
              </div>
            </form>
            <p className="mt-4 text-muted-foreground text-sm" aria-live="polite" data-testid="text-hotels-count">
              {isLoading ? "Loading..." : `${filteredHotels.length} hotels found`}
            </p>
          </div>
        </section>

        {isLoading ? (
          <section className="py-12" aria-label="Loading hotels">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[0, 1, 2, 3].map((i) => (
                  <HotelCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </section>
        ) : filteredHotels.length > 0 ? (
          <>
            {featuredHotel && (
              <section className="py-8" aria-label="Featured hotel">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <FeaturedCard
                    title={featuredHotel.title}
                    description={featuredHotel.metaDescription || "Experience luxury and comfort in the heart of Dubai."}
                    image={featuredHotel.heroImage || defaultPlaceholderImages[0]}
                    href={`/hotels/${featuredHotel.slug}`}
                    category="Featured Hotel"
                    categoryColor="bg-amber-600"
                    location={featuredHotel.hotel?.location || "Dubai, UAE"}
                    rating={featuredHotel.hotel?.starRating || 5}
                  />
                </div>
              </section>
            )}

            {remainingHotels.length > 0 && (
              <section className="py-12" aria-labelledby="all-hotels-heading">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <SectionHeader 
                    title="All Luxury Hotels"
                    subtitle="Handpicked accommodations for discerning travelers"
                  />
                  <ContentGrid columns={2}>
                    {remainingHotels.map((hotel, index) => (
                      <EditorialCard
                        key={hotel.id}
                        title={hotel.title}
                        excerpt={hotel.metaDescription || "Experience luxury and comfort in Dubai."}
                        image={hotel.heroImage || defaultPlaceholderImages[(index + 1) % defaultPlaceholderImages.length]}
                        href={`/hotels/${hotel.slug}`}
                        category={`${hotel.hotel?.starRating || 5} Star`}
                        categoryColor="text-amber-600"
                        size="large"
                        data-testid={`card-hotel-${hotel.id}`}
                      />
                    ))}
                  </ContentGrid>
                </div>
              </section>
            )}
          </>
        ) : (
          <section className="py-12" aria-label="Sample hotels">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeader 
                title="Discover Dubai Hotels"
                subtitle="Our curated collection of the finest accommodations"
              />
              <div className="mb-12">
                <FeaturedCard
                  title={placeholderHotels[0].title}
                  description={placeholderHotels[0].desc}
                  image={defaultPlaceholderImages[0]}
                  href="#"
                  category="Featured"
                  categoryColor="bg-amber-600"
                  location={placeholderHotels[0].location}
                  rating={placeholderHotels[0].rating}
                />
              </div>
              <ContentGrid columns={2}>
                {placeholderHotels.slice(1).map((hotel, index) => (
                  <EditorialCard
                    key={index}
                    title={hotel.title}
                    excerpt={hotel.desc}
                    image={defaultPlaceholderImages[(index + 1) % defaultPlaceholderImages.length]}
                    href="#"
                    category={`${hotel.rating} Star`}
                    categoryColor="text-amber-600"
                    size="large"
                  />
                ))}
              </ContentGrid>
            </div>
          </section>
        )}
      </main>

      <PublicFooter />
    </div>
  );
}
