import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { Loader2, MapPin, Clock, Star, Users, DollarSign, Calendar, Building, Utensils, Tag } from "lucide-react";
import posthog from "posthog-js";
import type { Content, Attraction, Hotel, Dining, District, Transport, Article, HighlightItem, RoomTypeItem, FaqItem, ContentCluster, ContentWithRelations } from "@shared/schema";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { ArticleHero, ArticleBody, TraviRecommends, RelatedArticles, NewsletterSignup } from "@/components/article";

type ContentWithExtensions = Content & {
  attraction?: Attraction | null;
  hotel?: Hotel | null;
  dining?: Dining | null;
  district?: District | null;
  transport?: Transport | null;
  article?: Article | null;
  cluster?: ContentCluster | null;
  clusterMembers?: Array<{ id: string; title: string; slug: string; type: string }>;
};

function generateContentSchema(content: ContentWithExtensions, baseUrl: string) {
  const canonicalUrl = `${baseUrl}/${content.type}/${content.slug}`;
  
  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": content.type === "article" ? "Article" : 
             content.type === "hotel" ? "Hotel" :
             content.type === "attraction" ? "TouristAttraction" :
             content.type === "dining" ? "Restaurant" : "WebPage",
    "name": content.title,
    "description": content.metaDescription || content.title,
    "url": canonicalUrl,
  };

  if (content.heroImage) {
    schema.image = content.heroImage;
  }

  if (content.publishedAt) {
    schema.datePublished = new Date(content.publishedAt).toISOString();
  }

  if (content.updatedAt) {
    schema.dateModified = new Date(content.updatedAt).toISOString();
  }

  if (content.cluster) {
    schema.isPartOf = {
      "@type": "CollectionPage",
      "name": content.cluster.name,
    };
  }

  if (content.clusterMembers && content.clusterMembers.length > 0) {
    schema.hasPart = content.clusterMembers.map(member => ({
      "@type": "WebPage",
      "name": member.title,
      "url": `${baseUrl}/${member.type}/${member.slug}`
    }));
  }

  return schema;
}

function renderBlock(block: any, index: number) {
  const data = block.data || block;
  
  switch (block.type) {
    case "hero":
      return (
        <div key={index} className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
          {data.imageUrl && (
            <img
              src={data.imageUrl}
              alt={data.title || "Hero image"}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            {data.title && <h1 className="text-4xl font-bold mb-2">{data.title}</h1>}
            {data.subtitle && <p className="text-xl opacity-90">{data.subtitle}</p>}
          </div>
        </div>
      );

    case "text":
      return (
        <div key={index} className="prose prose-lg max-w-none dark:prose-invert py-6">
          {data.title && <h2 className="text-2xl font-semibold mb-4">{data.title}</h2>}
          <div dangerouslySetInnerHTML={{ __html: data.content || "" }} />
        </div>
      );

    case "image":
      return (
        <figure key={index} className="py-6">
          {data.url && (
            <img
              src={data.url}
              alt={data.alt || data.caption || "Image"}
              className="w-full rounded-lg"
            />
          )}
          {data.caption && (
            <figcaption className="text-center text-muted-foreground mt-2">
              {data.caption}
            </figcaption>
          )}
        </figure>
      );

    case "gallery":
      return (
        <div key={index} className="py-6">
          {data.title && <h2 className="text-2xl font-semibold mb-4">{data.title}</h2>}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.images?.map((img: any, i: number) => (
              <img
                key={i}
                src={img.url}
                alt={img.alt || `Gallery image ${i + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      );

    case "faq":
      const faqs = data.faqs || data.items || [];
      return (
        <div key={index} className="py-6">
          {data.title && <h2 className="text-2xl font-semibold mb-4">{data.title}</h2>}
          <div className="space-y-4">
            {faqs.map((item: any, i: number) => (
              <div key={i} className="border rounded-lg p-4">
                <h3 className="font-medium mb-2">{item.question}</h3>
                <p className="text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case "cta":
      return (
        <div key={index} className="py-6 text-center bg-primary/10 rounded-lg p-8">
          {data.title && <h2 className="text-2xl font-semibold mb-2">{data.title}</h2>}
          {(data.description || data.content) && <p className="text-muted-foreground mb-4">{data.description || data.content}</p>}
          {data.buttonText && (data.buttonUrl || data.buttonLink) && (
            <a
              href={data.buttonUrl || data.buttonLink}
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium"
            >
              {data.buttonText}
            </a>
          )}
        </div>
      );

    case "info_grid":
      return (
        <div key={index} className="py-6">
          {data.title && <h2 className="text-2xl font-semibold mb-4">{data.title}</h2>}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.items?.map((item: any, i: number) => (
              <div key={i} className="text-center p-4 bg-muted rounded-lg">
                <div className="font-semibold">{item.label}</div>
                <div className="text-muted-foreground">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case "highlights":
      const highlights = data.items || [];
      return (
        <div key={index} className="py-6">
          {data.title && <h2 className="text-2xl font-semibold mb-4">{data.title}</h2>}
          <ul className="space-y-2">
            {highlights.map((item: any, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <Star className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>{typeof item === 'string' ? item : item.title || item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "tips":
      const tips = data.tips || data.items || [];
      return (
        <div key={index} className="py-6 bg-muted/50 rounded-lg p-6">
          {data.title && <h2 className="text-2xl font-semibold mb-4">{data.title}</h2>}
          <ul className="space-y-2">
            {tips.map((item: any, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span>
                <span>{typeof item === 'string' ? item : item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    default:
      return null;
  }
}

function AttractionMeta({ attraction }: { attraction: Attraction }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y">
      {attraction.location && (
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <span>{attraction.location}</span>
        </div>
      )}
      {attraction.duration && (
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <span>{attraction.duration}</span>
        </div>
      )}
      {attraction.targetAudience && attraction.targetAudience.length > 0 && (
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span>{attraction.targetAudience.join(", ")}</span>
        </div>
      )}
      {attraction.priceFrom && (
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-muted-foreground" />
          <span>From AED {attraction.priceFrom}</span>
        </div>
      )}
    </div>
  );
}

function HotelMeta({ hotel }: { hotel: Hotel }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y">
      {hotel.starRating && (
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-muted-foreground" />
          <span>{hotel.starRating} Star</span>
        </div>
      )}
      {hotel.location && (
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <span>{hotel.location}</span>
        </div>
      )}
      {hotel.numberOfRooms && (
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-muted-foreground" />
          <span>{hotel.numberOfRooms} Rooms</span>
        </div>
      )}
      {hotel.targetAudience && hotel.targetAudience.length > 0 && (
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span>{hotel.targetAudience.join(", ")}</span>
        </div>
      )}
    </div>
  );
}

function DiningMeta({ dining }: { dining: Dining }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y">
      {dining.cuisineType && (
        <div className="flex items-center gap-2">
          <Utensils className="h-5 w-5 text-muted-foreground" />
          <span>{dining.cuisineType}</span>
        </div>
      )}
      {dining.priceRange && (
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-muted-foreground" />
          <span>{dining.priceRange}</span>
        </div>
      )}
      {dining.location && (
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <span>{dining.location}</span>
        </div>
      )}
      {dining.quickInfoBar && dining.quickInfoBar.length > 0 && (
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <span>
            {dining.quickInfoBar.find((item) => item.label?.toLowerCase().includes("hour"))?.value ||
             dining.quickInfoBar.find((item) => item.label?.toLowerCase().includes("time"))?.value ||
             "See hours"}
          </span>
        </div>
      )}
    </div>
  );
}

function DistrictMeta({ district }: { district: District }) {
  const hotelCount = district.attractionsGrid?.filter((a) => a.type?.toLowerCase().includes("hotel")).length || 0;
  const restaurantCount = district.diningHighlights?.length || 0;
  const activityCount = district.thingsToDo?.length || 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y">
      {hotelCount > 0 && (
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-muted-foreground" />
          <span>{hotelCount} Hotel{hotelCount !== 1 ? 's' : ''}</span>
        </div>
      )}
      {restaurantCount > 0 && (
        <div className="flex items-center gap-2">
          <Utensils className="h-5 w-5 text-muted-foreground" />
          <span>{restaurantCount} Restaurant{restaurantCount !== 1 ? 's' : ''}</span>
        </div>
      )}
      {activityCount > 0 && (
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-muted-foreground" />
          <span>{activityCount} Thing{activityCount !== 1 ? 's' : ''} to Do</span>
        </div>
      )}
      {district.targetAudience && district.targetAudience.length > 0 && (
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-muted-foreground" />
          <span>Best for: {district.targetAudience.slice(0, 2).join(", ")}</span>
        </div>
      )}
    </div>
  );
}

function ArticleDetailView({ content }: { content: ContentWithExtensions }) {
  const { data: allArticles = [] } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/contents?type=article&status=published"],
  });

  const { data: recommendations = [] } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/contents?status=published&limit=8"],
  });

  const heroImage = content.heroImage || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=800&fit=crop";
  const keywords = content.secondaryKeywords || content.lsiKeywords || [];
  const category = content.article?.category;
  const blocks = content.blocks || [];

  const relatedArticles = allArticles
    .filter((a) => a.id !== content.id)
    .map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      heroImage: a.heroImage,
      metaDescription: a.metaDescription,
      publishedAt: a.publishedAt,
      category: a.article?.category || undefined,
    }));

  const recommendationItems = recommendations
    .filter((r) => r.id !== content.id && r.type !== "article")
    .slice(0, 4)
    .map((r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      type: r.type,
      heroImage: r.heroImage,
      metaDescription: r.metaDescription,
    }));

  return (
    <div className="min-h-screen bg-background" data-testid="article-detail-view">
      <PublicNav variant="transparent" />

      <ArticleHero
        title={content.title}
        heroImage={heroImage}
        heroImageAlt={content.heroImageAlt || undefined}
        category={category || undefined}
        publishedAt={content.publishedAt}
        keywords={keywords}
      />

      <ArticleBody
        blocks={blocks}
        metaDescription={content.metaDescription || undefined}
      />

      {recommendationItems.length > 0 && (
        <TraviRecommends recommendations={recommendationItems} />
      )}

      {relatedArticles.length > 0 && (
        <RelatedArticles
          articles={relatedArticles}
          currentArticleId={content.id}
        />
      )}

      <NewsletterSignup />

      <PublicFooter />
    </div>
  );
}

export default function PublicContentViewer() {
  const [, params] = useRoute("/:type/:slug");
  const slug = params?.slug;
  const trackedRef = useRef<string | null>(null);

  const { data: content, isLoading, error } = useQuery<ContentWithExtensions>({
    queryKey: ["/api/contents/slug", slug],
    enabled: !!slug,
  });

  useEffect(() => {
    if (content?.id && trackedRef.current !== content.id) {
      trackedRef.current = content.id;
      posthog.capture("content_view", {
        content_id: content.id,
        content_type: content.type,
        content_slug: content.slug,
        content_title: content.title,
      });
    }
  }, [content?.id, content?.type, content?.slug, content?.title]);

  useEffect(() => {
    if (content?.slug && content?.type) {
      const baseUrl = "https://dubaitravelguide.com";
      const canonicalUrl = `${baseUrl}/${content.type}/${content.slug}`;
      
      const existingCanonical = document.querySelector('link[rel="canonical"]');
      if (existingCanonical) {
        existingCanonical.remove();
      }
      
      const link = document.createElement("link");
      link.rel = "canonical";
      link.href = canonicalUrl;
      document.head.appendChild(link);

      const existingSchema = document.querySelector('script[type="application/ld+json"][data-content-viewer-schema]');
      if (existingSchema) {
        existingSchema.remove();
      }

      const schema = generateContentSchema(content, baseUrl);
      const schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.setAttribute('data-content-viewer-schema', 'true');
      schemaScript.textContent = JSON.stringify(schema);
      document.head.appendChild(schemaScript);
      
      return () => {
        link.remove();
        const schemaToRemove = document.querySelector('script[type="application/ld+json"][data-content-viewer-schema]');
        if (schemaToRemove) {
          schemaToRemove.remove();
        }
      };
    }
  }, [content?.slug, content?.type, content?.cluster, content?.clusterMembers]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="loading-state">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="error-state">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Content Not Found</h1>
          <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (content.type === "article") {
    return <ArticleDetailView content={content} />;
  }

  const blocks = content.blocks || [];
  const hasBlocks = blocks.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {hasBlocks ? (
        <div>
          {blocks.map((block: any, index: number) => (
            <div key={index} className={block.type === "hero" ? "" : "max-w-4xl mx-auto px-4"}>
              {renderBlock(block, index)}
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-8">
          {content.heroImage && (
            <img
              src={content.heroImage}
              alt={content.heroImageAlt || content.title}
              className="w-full h-[400px] object-cover rounded-lg mb-8"
            />
          )}
          <h1 className="text-4xl font-bold mb-4">{content.title}</h1>
          
          {content.attraction && <AttractionMeta attraction={content.attraction} />}
          {content.hotel && <HotelMeta hotel={content.hotel} />}
          {content.dining && <DiningMeta dining={content.dining} />}
          {content.district && <DistrictMeta district={content.district} />}

          {content.metaDescription && (
            <p className="text-xl text-muted-foreground my-6">{content.metaDescription}</p>
          )}

          {content.attraction?.highlights && content.attraction.highlights.length > 0 && (
            <div className="py-6">
              <h2 className="text-2xl font-semibold mb-4">Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.attraction.highlights.map((item: HighlightItem, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    {item.image && (
                      <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                    )}
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {content.attraction?.visitorTips && content.attraction.visitorTips.length > 0 && (
            <div className="py-6 bg-muted/50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Visitor Tips</h2>
              <ul className="space-y-2">
                {content.attraction.visitorTips.map((tip: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {content.attraction?.faq && content.attraction.faq.length > 0 && (
            <div className="py-6">
              <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {content.attraction.faq.map((item: FaqItem, i: number) => (
                  <div key={i} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">{item.question}</h3>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {content.hotel?.amenities && content.hotel.amenities.length > 0 && (
            <div className="py-6">
              <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {content.hotel.amenities.map((amenity: string, i: number) => (
                  <span key={i} className="bg-muted px-3 py-1 rounded-full text-sm">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {content.hotel?.roomTypes && content.hotel.roomTypes.length > 0 && (
            <div className="py-6">
              <h2 className="text-2xl font-semibold mb-4">Room Types</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.hotel.roomTypes.map((room: RoomTypeItem, i: number) => (
                  <div key={i} className="bg-muted p-4 rounded-lg">
                    {room.image && (
                      <img src={room.image} alt={room.title} className="w-full h-32 object-cover rounded mb-3" />
                    )}
                    <h3 className="font-medium">{room.title}</h3>
                    {room.price && <p className="text-primary font-semibold">{room.price}</p>}
                    {room.features && room.features.length > 0 && (
                      <ul className="text-sm text-muted-foreground mt-2">
                        {room.features.map((f: string, fi: number) => (
                          <li key={fi}>• {f}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {content.hotel?.highlights && content.hotel.highlights.length > 0 && (
            <div className="py-6">
              <h2 className="text-2xl font-semibold mb-4">Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.hotel.highlights.map((item: HighlightItem, i: number) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                    {item.image && (
                      <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                    )}
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
