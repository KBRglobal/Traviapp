import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Clock, MapPin, Search } from "lucide-react";
import type { ContentWithRelations } from "@shared/schema";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { CompactHero } from "@/components/image-hero";
import { FeaturedCard, EditorialCard, ContentGrid, SectionHeader } from "@/components/editorial-cards";
import { useState } from "react";
import { useDocumentMeta } from "@/hooks/use-document-meta";

const heroImage = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=600&fit=crop";

const defaultPlaceholderImages = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1526495124232-a04e1849168c?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1546412414-e1885259563a?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&h=600&fit=crop",
];

function AttractionCardSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="aspect-[4/3] bg-muted rounded-lg mb-4" />
      <div className="space-y-2">
        <div className="h-4 w-20 bg-muted rounded" />
        <div className="h-5 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-full" />
      </div>
    </div>
  );
}

export default function PublicAttractions() {
  const [searchQuery, setSearchQuery] = useState("");
  
  useDocumentMeta({
    title: "Dubai Attractions & Things to Do | Travi - Dubai Travel Guide",
    description: "Discover the best attractions and things to do in Dubai. From the iconic Burj Khalifa to desert safaris, find unforgettable experiences in the city of dreams.",
    ogTitle: "Dubai Attractions & Things to Do | Travi",
    ogDescription: "Explore iconic landmarks, thrilling adventures, and unique experiences in Dubai.",
    ogType: "website",
  });
  
  const { data: allContent, isLoading } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/contents?status=published&includeExtensions=true"],
  });

  const attractions = allContent?.filter(c => c.type === "attraction") || [];
  const filteredAttractions = searchQuery 
    ? attractions.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : attractions;

  const featuredAttractions = filteredAttractions.slice(0, 2);
  const remainingAttractions = filteredAttractions.slice(2);

  const placeholderAttractions = [
    { title: "Burj Khalifa", desc: "Visit the world's tallest building and enjoy breathtaking panoramic views of Dubai", duration: "2-3 hours", location: "Downtown Dubai" },
    { title: "Desert Safari", desc: "Experience thrilling dune bashing, camel rides, and authentic Bedouin hospitality", duration: "Half Day", location: "Dubai Desert" },
    { title: "Dubai Mall", desc: "Explore the world's largest shopping destination with endless entertainment options", duration: "4-6 hours", location: "Downtown Dubai" },
    { title: "Palm Jumeirah", desc: "Discover the iconic man-made island with luxury resorts, beaches, and fine dining", duration: "Half Day", location: "Palm Jumeirah" },
    { title: "Dubai Marina", desc: "Walk along the stunning waterfront promenade lined with cafes and yachts", duration: "2-3 hours", location: "Dubai Marina" },
    { title: "Old Dubai", desc: "Step back in time exploring Al Fahidi, Gold Souk, and traditional markets", duration: "3-4 hours", location: "Deira & Bur Dubai" },
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
          title="Explore Dubai Attractions"
          subtitle="Discover unforgettable experiences and iconic landmarks"
        />

        <section className="py-8 bg-background" aria-label="Search attractions">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <form role="search" onSubmit={(e) => e.preventDefault()} className="max-w-xl">
              <label htmlFor="attraction-search" className="sr-only">Search attractions</label>
              <div className="bg-card border rounded-lg p-2 flex items-center gap-2">
                <Search className="w-5 h-5 text-muted-foreground ml-3" aria-hidden="true" />
                <input
                  id="attraction-search"
                  type="text"
                  placeholder="Search attractions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none py-2 text-foreground"
                  data-testid="input-search-attractions"
                />
              </div>
            </form>
            <p className="mt-4 text-muted-foreground text-sm" aria-live="polite" data-testid="text-attractions-count">
              {isLoading ? "Loading..." : `${filteredAttractions.length} attractions found`}
            </p>
          </div>
        </section>

        {isLoading ? (
          <section className="py-12" aria-label="Loading attractions">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <AttractionCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </section>
        ) : filteredAttractions.length > 0 ? (
          <>
            {featuredAttractions.length > 0 && (
              <section className="py-8" aria-label="Featured attractions">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {featuredAttractions.map((attraction, index) => (
                      <FeaturedCard
                        key={attraction.id}
                        title={attraction.title}
                        description={attraction.metaDescription || "Discover this amazing attraction in Dubai."}
                        image={attraction.heroImage || defaultPlaceholderImages[index]}
                        href={`/attractions/${attraction.slug}`}
                        category="Must Visit"
                        categoryColor="bg-violet-600"
                        location={attraction.attraction?.location || "Dubai, UAE"}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {remainingAttractions.length > 0 && (
              <section className="py-12" aria-labelledby="all-attractions-heading">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <SectionHeader 
                    title="More Experiences"
                    subtitle="From iconic landmarks to hidden gems"
                  />
                  <ContentGrid columns={3}>
                    {remainingAttractions.map((attraction, index) => (
                      <EditorialCard
                        key={attraction.id}
                        title={attraction.title}
                        excerpt={attraction.metaDescription || "Explore this unique Dubai experience."}
                        image={attraction.heroImage || defaultPlaceholderImages[(index + 2) % defaultPlaceholderImages.length]}
                        href={`/attractions/${attraction.slug}`}
                        category={attraction.attraction?.duration || "Experience"}
                        categoryColor="text-violet-600"
                        size="medium"
                        data-testid={`card-attraction-${attraction.id}`}
                      />
                    ))}
                  </ContentGrid>
                </div>
              </section>
            )}
          </>
        ) : (
          <section className="py-12" aria-label="Sample attractions">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                {placeholderAttractions.slice(0, 2).map((attraction, index) => (
                  <FeaturedCard
                    key={index}
                    title={attraction.title}
                    description={attraction.desc}
                    image={defaultPlaceholderImages[index]}
                    href="#"
                    category="Must Visit"
                    categoryColor="bg-violet-600"
                    location={attraction.location}
                  />
                ))}
              </div>
              
              <SectionHeader 
                title="More to Explore"
                subtitle="Curated experiences across the city"
              />
              <ContentGrid columns={4}>
                {placeholderAttractions.slice(2).map((attraction, index) => (
                  <EditorialCard
                    key={index}
                    title={attraction.title}
                    excerpt={attraction.desc}
                    image={defaultPlaceholderImages[(index + 2) % defaultPlaceholderImages.length]}
                    href="#"
                    category={attraction.duration}
                    categoryColor="text-violet-600"
                    size="small"
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
