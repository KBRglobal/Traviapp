import { Link } from "wouter";
import { Calendar, MapPin, Clock, Filter, Search, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ContentWithRelations } from "@shared/schema";
import { useLocale } from "@/lib/i18n/LocaleRouter";
import { PageContainer, Section, CategoryGrid } from "@/components/public-layout";
import { PublicHero } from "@/components/public-hero";

const categories = [
  { id: "all", name: "All Events" },
  { id: "festivals", name: "Festivals" },
  { id: "sports", name: "Sports" },
  { id: "concerts", name: "Concerts & Shows" },
  { id: "exhibitions", name: "Exhibitions" },
  { id: "food", name: "Food & Dining" },
  { id: "cultural", name: "Cultural" },
];

const months = [
  { value: "all", label: "All Months" },
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatDateRange(start: string, end?: string): string {
  if (!end) return formatDate(start);
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
    return `${startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endDate.getDate()}, ${endDate.getFullYear()}`;
  }
  return `${formatDate(start)} - ${formatDate(end)}`;
}

function getCategoryBadgeVariant(category: string): "default" | "secondary" | "outline" {
  const variants: Record<string, "default" | "secondary" | "outline"> = {
    festivals: "default",
    sports: "secondary",
    concerts: "default",
    exhibitions: "secondary",
    food: "default",
    cultural: "secondary",
  };
  return variants[category] || "secondary";
}

export default function PublicEvents() {
  const { t, isRTL, localePath } = useLocale();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");

  const { data: eventsData, isLoading } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/contents?type=event&status=published"],
  });

  const events = useMemo(() => {
    if (!eventsData) return [];
    return eventsData.map((content) => {
      const eventData = content.event;
      return {
        id: content.id,
        title: content.title,
        slug: content.slug,
        description: content.metaDescription || "",
        date: eventData?.eventDate?.toISOString() || new Date().toISOString(),
        endDate: eventData?.endDate?.toISOString() || undefined,
        time: "All Day",
        location: eventData?.venue || "Dubai",
        category: "cultural",
        image: content.heroImage || "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600",
        featured: eventData?.isFeatured || false,
      };
    });
  }, [eventsData]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
      
      const eventDate = new Date(event.date);
      const eventMonth = String(eventDate.getMonth() + 1).padStart(2, "0");
      const matchesMonth = selectedMonth === "all" || eventMonth === selectedMonth;
      
      return matchesSearch && matchesCategory && matchesMonth;
    });
  }, [events, searchQuery, selectedCategory, selectedMonth]);

  const featuredEvents = filteredEvents.filter(e => e.featured);
  const regularEvents = filteredEvents.filter(e => !e.featured);

  const breadcrumbs = [
    { label: t('nav.home'), href: "/" },
    { label: t('events.pageTitle') },
  ];

  return (
    <PageContainer>
      <PublicHero
        title={t('events.pageTitle')}
        subtitle={t('events.pageSubtitle')}
        backgroundImage="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600"
        breadcrumbs={breadcrumbs}
        size="default"
      />

      <Section className="py-8 border-b" id="filters">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <div className={`relative flex-1 max-w-md ${isRTL ? 'pr-10' : 'pl-10'}`}>
            <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground`} />
            <Input
              type="text"
              placeholder={t('nav.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={isRTL ? 'pr-10' : 'pl-10'}
              data-testid="input-search-events"
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40" data-testid="select-category">
                <Filter className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-40" data-testid="select-month">
                <Calendar className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      <Section id="events-list">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-heading text-xl font-semibold mb-2">{t('search.noResults')}</h3>
            <p className="text-muted-foreground mb-6">{t('events.pageSubtitle')}</p>
            <Link href={localePath("/")}>
              <Button data-testid="button-back-home">{t('common.viewAll')}</Button>
            </Link>
          </div>
        ) : (
          <>
            {featuredEvents.length > 0 && (
              <div className="mb-12">
                <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-2 h-8 bg-gradient-to-b from-travi-orange to-travi-pink rounded-full" />
                  {t('events.upcoming')}
                </h2>
                <CategoryGrid columns={2}>
                  {featuredEvents.map((event) => (
                    <Card key={event.id} className="overflow-visible group rounded-[16px] shadow-[var(--shadow-level-1)] hover-elevate" data-testid={`card-event-featured-${event.id}`}>
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-48 h-40 sm:h-auto bg-muted flex-shrink-0 overflow-hidden rounded-t-[16px] sm:rounded-t-none sm:rounded-l-[16px]">
                          <img 
                            src={event.image} 
                            alt={event.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 p-5">
                          <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                            <Badge variant={getCategoryBadgeVariant(event.category)} className="no-default-hover-elevate no-default-active-elevate">
                              {categories.find(c => c.id === event.category)?.name || event.category}
                            </Badge>
                            <Badge variant="default" className="bg-travi-orange text-white no-default-hover-elevate no-default-active-elevate">
                              Featured
                            </Badge>
                          </div>
                          <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{event.title}</h3>
                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{event.description}</p>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-4 h-4 text-[#6443F4]" />
                              <span>{formatDateRange(event.date, event.endDate)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-4 h-4 text-[#6443F4]" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="w-4 h-4 text-[#6443F4]" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </CategoryGrid>
              </div>
            )}

            <div>
              <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-gradient-to-b from-travi-purple to-travi-pink rounded-full" />
                {t('events.pageTitle')}
                <span className="text-muted-foreground font-normal text-lg">({filteredEvents.length})</span>
              </h2>
              <CategoryGrid columns={3}>
                {(featuredEvents.length > 0 ? regularEvents : filteredEvents).map((event) => (
                  <Card key={event.id} className="overflow-visible group rounded-[16px] shadow-[var(--shadow-level-1)] hover-elevate" data-testid={`card-event-${event.id}`}>
                    <div className="aspect-video bg-muted relative overflow-hidden rounded-t-[16px]">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                      <Badge 
                        variant={getCategoryBadgeVariant(event.category)} 
                        className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} no-default-hover-elevate no-default-active-elevate`}
                      >
                        {categories.find(c => c.id === event.category)?.name || event.category}
                      </Badge>
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-2 line-clamp-1">{event.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{event.description}</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5 text-[#6443F4]" />
                          <span className="truncate">{formatDateRange(event.date, event.endDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5 text-[#6443F4]" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </CategoryGrid>
            </div>
          </>
        )}
      </Section>

      <Section variant="alternate" id="cta">
        <Card className="p-8 bg-gradient-to-r from-travi-purple to-travi-pink border-0 text-white rounded-[16px]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-heading text-2xl font-bold mb-2">{t('common.learnMore')}</h3>
              <p className="text-white/90">{t('events.pageSubtitle')}</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link href={localePath("/tools/budget")}>
                <Button className="bg-white text-[#6443F4] border-white" data-testid="link-budget">
                  Budget Calculator
                </Button>
              </Link>
              <Link href={localePath("/tools/currency")}>
                <Button variant="outline" className="border-white/50 text-white bg-white/10 backdrop-blur-sm" data-testid="link-currency">
                  Currency Converter
                </Button>
              </Link>
              <Link href={localePath("/tools/plan")}>
                <Button variant="outline" className="border-white/50 text-white bg-white/10 backdrop-blur-sm" data-testid="link-plan">
                  Travel Planning
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </Section>
    </PageContainer>
  );
}
