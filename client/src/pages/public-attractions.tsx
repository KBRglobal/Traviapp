import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Search, MapPin, Star, Users, Sparkles, Moon,
  Heart, Gem, Compass, Mountain, Building2, Ship,
  Camera, TreePine, Waves, ChevronRight, ArrowRight,
  Clock, Sun, Bookmark, Map, Zap
} from "lucide-react";
import type { ContentWithRelations } from "@shared/schema";
import { PublicNav } from "@/components/public-nav";
import { PublicFooter } from "@/components/public-footer";
import { useState, useMemo } from "react";
import { useDocumentMeta } from "@/hooks/use-document-meta";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { useTranslatedContents } from "@/hooks/use-translated-content";

const EXPERIENCE_TYPES = [
  { 
    id: "iconic", 
    titleKey: "attractions.categories.iconic",
    descKey: "attractions.categoriesDesc.iconic",
    icon: Star,
    gradient: "from-[#FF9327] to-[#FFD112]",
    keywords: ["burj", "khalifa", "fountain", "frame", "palm"]
  },
  { 
    id: "family", 
    titleKey: "attractions.categories.family",
    descKey: "attractions.categoriesDesc.family",
    icon: Users,
    gradient: "from-[#02A65C] to-[#59ED63]",
    keywords: ["kids", "family", "children", "theme park", "aquarium", "zoo"]
  },
  { 
    id: "thrill", 
    titleKey: "attractions.categories.thrill",
    descKey: "attractions.categoriesDesc.thrill",
    icon: Zap,
    gradient: "from-[#F94498] to-[#FDA9E5]",
    keywords: ["adventure", "thrill", "extreme", "desert", "skydive", "safari"]
  },
  { 
    id: "culture", 
    titleKey: "attractions.categories.culture",
    descKey: "attractions.categoriesDesc.culture",
    icon: Sparkles,
    gradient: "from-[#FF9327] to-[#F2CCA6]",
    keywords: ["museum", "heritage", "history", "culture", "traditional", "souk"]
  },
  { 
    id: "night", 
    titleKey: "attractions.categories.night",
    descKey: "attractions.categoriesDesc.night",
    icon: Moon,
    gradient: "from-[#6443F4] to-[#9077EF]",
    keywords: ["night", "evening", "dinner", "cruise", "show", "fountain"]
  },
  { 
    id: "relax", 
    titleKey: "attractions.categories.relax",
    descKey: "attractions.categoriesDesc.relax",
    icon: Waves,
    gradient: "from-[#01BEFF] to-[#6443F4]",
    keywords: ["beach", "spa", "view", "observation", "garden", "park"]
  },
  { 
    id: "budget", 
    titleKey: "attractions.categories.budget",
    descKey: "attractions.categoriesDesc.budget",
    icon: Heart,
    gradient: "from-[#02A65C] to-[#01BEFF]",
    keywords: ["free", "cheap", "budget", "affordable"]
  },
  { 
    id: "luxury", 
    titleKey: "attractions.categories.luxury",
    descKey: "attractions.categoriesDesc.luxury",
    icon: Gem,
    gradient: "from-[#6443F4] to-[#F94498]",
    keywords: ["luxury", "premium", "vip", "private", "exclusive", "yacht"]
  },
];

const CATEGORIES = [
  { id: "museums", labelKey: "attractions.browseCategories.museums", icon: Building2 },
  { id: "theme-parks", labelKey: "attractions.browseCategories.themeparks", icon: Star },
  { id: "observation-decks", labelKey: "attractions.browseCategories.observation", icon: Mountain },
  { id: "cruises", labelKey: "attractions.browseCategories.cruises", icon: Ship },
  { id: "water-parks", labelKey: "attractions.browseCategories.waterparks", icon: Waves },
  { id: "tours", labelKey: "attractions.browseCategories.tours", icon: Compass },
  { id: "immersive-experiences", labelKey: "attractions.browseCategories.immersive", icon: Camera },
  { id: "parks", labelKey: "attractions.browseCategories.parks", icon: TreePine },
];

const CONTEXTUAL_HINTS = [
  { icon: Star, textKey: "attractions.hints.firstTime", filter: "iconic" },
  { icon: Clock, textKey: "attractions.hints.quickVisit", filter: null },
  { icon: Sun, textKey: "attractions.hints.indoor", filter: null },
  { icon: Moon, textKey: "attractions.hints.evening", filter: "night" },
];

const FEATURED_EXPERIENCES = [
  {
    slug: "burj-khalifa",
    titleKey: "burjKhalifa",
    taglineKey: "burjKhalifaTagline",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=1000&fit=crop",
    tagKeys: ["iconic", "mustSee"],
    labelKey: "editorsPick"
  },
  {
    slug: "dubai-fountain",
    titleKey: "dubaiFountain",
    taglineKey: "dubaiFountainTagline",
    image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&h=600&fit=crop",
    tagKeys: ["free", "night"],
    labelKey: "mostLoved"
  },
  {
    slug: "desert-safari",
    titleKey: "desertSafari",
    taglineKey: "desertSafariTagline",
    image: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800&h=600&fit=crop",
    tagKeys: ["adventure", "sunset"],
    labelKey: "firstTimeDubai"
  },
  {
    slug: "dubai-aquarium",
    titleKey: "dubaiAquarium",
    taglineKey: "dubaiAquariumTagline",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
    tagKeys: ["family", "indoor"],
    labelKey: null
  },
];

function ExperienceCard({ 
  experience, 
  isActive, 
  onClick,
  t
}: { 
  experience: typeof EXPERIENCE_TYPES[0]; 
  isActive: boolean;
  onClick: () => void;
  t: (key: string) => string;
}) {
  const Icon = experience.icon;
  
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl p-4 md:p-5 text-left transition-all duration-300 ${
        isActive 
          ? 'ring-2 ring-primary shadow-lg scale-105' 
          : 'hover:shadow-md'
      }`}
      data-testid={`button-experience-${experience.id}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${experience.gradient} opacity-90`} />
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
      
      <div className="relative z-10">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/20 flex items-center justify-center mb-3">
          <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
        </div>
        <h3 className="font-bold text-white text-sm md:text-base mb-1">{t(experience.titleKey)}</h3>
        <p className="text-white/80 text-xs md:text-sm line-clamp-2">{t(experience.descKey)}</p>
      </div>
    </button>
  );
}

function FeaturedCard({ 
  experience, 
  featured = false,
  t
}: { 
  experience: typeof FEATURED_EXPERIENCES[0]; 
  featured?: boolean;
  t: (key: string) => string;
}) {
  const title = t(`attractions.featured.${experience.titleKey}`);
  const tagline = t(`attractions.featured.${experience.taglineKey}`);
  const label = experience.labelKey ? t(`attractions.labels.${experience.labelKey}`) : null;
  
  return (
    <Link href={`/attractions/${experience.slug}`}>
      <Card 
        className={`group overflow-visible border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer relative ${
          featured ? 'col-span-1 md:col-span-2 row-span-2' : ''
        }`}
        data-testid={`card-featured-${experience.slug}`}
      >
        <div className={`overflow-hidden rounded-lg ${featured ? 'aspect-[4/5]' : 'aspect-[4/3]'}`}>
          <img 
            src={experience.image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-lg" />
          
          {label && (
            <div className="absolute top-4 left-4">
              <Badge className="bg-primary text-primary-foreground">
                {label}
              </Badge>
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {experience.tagKeys.map((tagKey) => (
                <Badge 
                  key={tagKey} 
                  variant="secondary" 
                  className="bg-white/20 text-white border-0 backdrop-blur-sm text-xs"
                >
                  {t(`attractions.tags.${tagKey}`)}
                </Badge>
              ))}
            </div>
            
            <h3 className={`font-bold text-white mb-1 ${featured ? 'text-xl md:text-2xl' : 'text-base md:text-lg'}`}>
              {title}
            </h3>
            
            <p className="text-white/80 text-xs md:text-sm line-clamp-2 mb-3">
              {tagline}
            </p>
            
            <div className="flex items-center gap-2 text-white font-medium text-sm group-hover:gap-3 transition-all">
              <span>{t("attractions.actions.explore")}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

interface TranslatedContentData {
  title: string;
  metaDescription: string | null;
}

function AttractionCard({ 
  attraction, 
  index,
  translation
}: { 
  attraction: ContentWithRelations; 
  index: number;
  translation?: TranslatedContentData | null;
}) {
  const image = attraction.heroImage || `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop`;
  const displayTitle = translation?.title || attraction.title;
  
  return (
    <Link href={`/attractions/${attraction.slug}`}>
      <Card 
        className="group overflow-hidden border shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
        data-testid={`card-attraction-${attraction.slug}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={image} 
            alt={displayTitle}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="font-semibold text-white text-sm md:text-base line-clamp-1 group-hover:text-white transition-colors">
              {displayTitle}
            </h3>
            {attraction.attraction?.location && (
              <div className="flex items-center gap-1 text-xs text-white/70 mt-1">
                <MapPin className="w-3 h-3" />
                <span className="line-clamp-1">{attraction.attraction.location}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-3 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {attraction.attraction?.category && (
              <Badge variant="outline" className="text-xs">
                {attraction.attraction.category}
              </Badge>
            )}
          </div>
          {attraction.attraction?.priceFrom && (
            <span className="text-xs text-muted-foreground whitespace-nowrap price-display">
              From AED {attraction.attraction.priceFrom}
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}

function CategoryCard({ category, t }: { category: typeof CATEGORIES[0]; t: (key: string) => string }) {
  const Icon = category.icon;
  
  return (
    <Link href={`/attractions?category=${category.id}`}>
      <Card className="group overflow-hidden border hover-elevate cursor-pointer p-4 text-center" data-testid={`card-category-${category.id}`}>
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-medium text-sm">{t(category.labelKey)}</h3>
      </Card>
    </Link>
  );
}

export default function PublicAttractions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeExperience, setActiveExperience] = useState<string | null>(null);
  const { t, locale, isRTL, localePath } = useLocale();

  useDocumentMeta({
    title: `${t("attractions.pageTitle")} | Travi - Dubai Travel Guide`,
    description: t("attractions.pageSubtitle"),
    ogTitle: `${t("attractions.pageTitle")} | Travi`,
    ogDescription: t("attractions.pageSubtitle"),
    ogType: "website",
  });

  // Get translated experience types
  const getExperienceTitle = (id: string) => {
    const key = `attractions.categories.${id}`;
    return t(key);
  };
  
  const { data: allContent, isLoading } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/public/contents?includeExtensions=true"],
  });

  const attractions = allContent?.filter(c => c.type === "attraction") || [];
  
  const { data: translationsMap } = useTranslatedContents(attractions);
  
  const filteredAttractions = useMemo(() => {
    let filtered = attractions;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(query) ||
        a.metaDescription?.toLowerCase().includes(query) ||
        a.attraction?.category?.toLowerCase().includes(query)
      );
    }
    
    if (activeExperience) {
      const experience = EXPERIENCE_TYPES.find(e => e.id === activeExperience);
      if (experience) {
        filtered = filtered.filter(a => 
          experience.keywords.some(keyword => 
            a.title.toLowerCase().includes(keyword) ||
            a.metaDescription?.toLowerCase().includes(keyword) ||
            a.attraction?.category?.toLowerCase().includes(keyword)
          )
        );
      }
    }
    
    return filtered;
  }, [attractions, searchQuery, activeExperience]);

  const trendingAttractions = attractions.slice(0, 6);
  const allAttractions = filteredAttractions;

  const handleExperienceClick = (experienceId: string) => {
    setActiveExperience(activeExperience === experienceId ? null : experienceId);
  };

  return (
    <div className={`bg-background min-h-screen flex flex-col ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <PublicNav />

      {/* SECTION 1: Hero */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1080&fit=crop"
            alt="Dubai skyline"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
            {t("attractions.pageTitle")}
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            {t("attractions.pageSubtitle")}
          </p>
          
          <div className="max-w-xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 flex items-center gap-2 border border-white/20">
              <Search className="w-5 h-5 text-white/60 ml-3" />
              <input
                type="text"
                placeholder={t("nav.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none py-3 text-white placeholder:text-white/50"
                data-testid="input-search-attractions"
              />
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-6 h-6 text-white/60 rotate-90" />
        </div>
      </section>

      <main className="flex-1">
        {/* SECTION 2: Choose Your Experience */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{t("attractions.sections.chooseExperience")}</h2>
              <p className="text-muted-foreground">{t("attractions.sections.howToFeel")}</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {EXPERIENCE_TYPES.map((experience) => (
                <ExperienceCard 
                  key={experience.id} 
                  experience={experience} 
                  isActive={activeExperience === experience.id}
                  onClick={() => handleExperienceClick(experience.id)}
                  t={t}
                />
              ))}
            </div>
            
            {activeExperience && (
              <div className="mt-6 text-center">
                <Button 
                  variant="ghost" 
                  onClick={() => setActiveExperience(null)}
                  data-testid="button-clear-experience-filter"
                >
                  {t("attractions.actions.clearFilter")}
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 3: Featured Experiences (Editorial Pick) */}
        {!activeExperience && !searchQuery && (
          <section className="py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-1">{t("attractions.sections.featured")}</h2>
                  <p className="text-muted-foreground">{t("attractions.sections.handPicked")}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <FeaturedCard experience={FEATURED_EXPERIENCES[0]} featured t={t} />
                <div className="grid grid-cols-1 gap-4 md:gap-6 md:col-span-1 lg:col-span-2">
                  {FEATURED_EXPERIENCES.slice(1, 4).map((exp) => (
                    <FeaturedCard key={exp.slug} experience={exp} t={t} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 4: Trending & Popular */}
        {!activeExperience && !searchQuery && trendingAttractions.length > 0 && (
          <section className="py-12 md:py-16 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-5 h-5 text-primary" />
                    <h2 className="text-2xl md:text-3xl font-bold">{t("attractions.sections.trending")}</h2>
                  </div>
                  <p className="text-muted-foreground">{t("attractions.sections.trendingDesc")}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {trendingAttractions.map((attraction, index) => (
                  <AttractionCard 
                    key={attraction.id} 
                    attraction={attraction} 
                    index={index}
                    translation={translationsMap?.get(attraction.id)}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 5: Browse by Category */}
        {!activeExperience && !searchQuery && (
          <section className="py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{t("attractions.sections.browseCategory")}</h2>
                <p className="text-muted-foreground">{t("attractions.sections.findExactly")}</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {CATEGORIES.map((category) => (
                  <CategoryCard key={category.id} category={category} t={t} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Filtered Results or All Attractions */}
        {(activeExperience || searchQuery) && (
          <section className="py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-1">
                    {activeExperience 
                      ? t(EXPERIENCE_TYPES.find(e => e.id === activeExperience)?.titleKey || "") 
                      : t("attractions.sections.searchResults")}
                  </h2>
                  <p className="text-muted-foreground">
                    {allAttractions.length} {t("attractions.sections.experiencesFound")}
                  </p>
                </div>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="aspect-[4/3] bg-muted rounded-lg mb-2" />
                      <div className="h-4 bg-muted rounded w-3/4" />
                    </div>
                  ))}
                </div>
              ) : allAttractions.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {allAttractions.map((attraction, index) => (
                    <AttractionCard 
                      key={attraction.id} 
                      attraction={attraction} 
                      index={index}
                      translation={translationsMap?.get(attraction.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{t("attractions.sections.noResults")}</h3>
                  <p className="text-muted-foreground mb-6">{t("attractions.sections.tryDifferent")}</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery("");
                      setActiveExperience(null);
                    }}
                    data-testid="button-clear-filters"
                  >
                    {t("attractions.actions.clearFilter")}
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* SECTION 7: Contextual Help */}
        {!activeExperience && !searchQuery && (
          <section className="py-12 md:py-16 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{t("attractions.sections.quickTips")}</h2>
                <p className="text-muted-foreground">{t("attractions.sections.tipsHelp")}</p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-3">
                {CONTEXTUAL_HINTS.map((hint, index) => {
                  const Icon = hint.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => hint.filter && handleExperienceClick(hint.filter)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-background border hover:border-primary hover:text-primary transition-colors"
                      data-testid={`button-hint-${index}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{t(hint.textKey)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 8: Bottom CTA */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-purple-600/90" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t("attractions.sections.notSureYet")}
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              {t("attractions.sections.notSureDesc")}
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90" data-testid="button-save-for-later">
                <Bookmark className="w-5 h-5 mr-2" />
                {t("attractions.actions.saveForLater")}
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" data-testid="button-explore-by-district">
                <Map className="w-5 h-5 mr-2" />
                {t("attractions.actions.exploreByDistrict")}
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" data-testid="button-build-your-plan">
                <Compass className="w-5 h-5 mr-2" />
                {t("attractions.actions.buildPlan")}
              </Button>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
