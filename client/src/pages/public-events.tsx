import { Link } from "wouter";
import { ArrowLeft, Calendar, MapPin, Clock, Filter, Search, Loader2 } from "lucide-react";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ContentWithRelations } from "@shared/schema";

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

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    festivals: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    sports: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    concerts: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    exhibitions: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    food: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    cultural: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  };
  return colors[category] || "bg-muted text-muted-foreground";
}

export default function PublicEvents() {
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
        date: eventData?.startDate || new Date().toISOString(),
        endDate: eventData?.endDate || undefined,
        time: eventData?.startTime || "All Day",
        location: eventData?.location || "Dubai",
        category: eventData?.category || "cultural",
        image: content.featuredImage || "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600",
        featured: eventData?.featured || false,
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

  return (
    <div className="bg-background min-h-screen">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b" data-testid="nav-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo variant="primary" height={28} />
            <div className="hidden md:flex items-center gap-8">
              <Link href="/hotels" className="text-foreground/80 hover:text-primary font-medium transition-colors">Hotels</Link>
              <Link href="/attractions" className="text-foreground/80 hover:text-primary font-medium transition-colors">Attractions</Link>
              <Link href="/tools/events" className="text-primary font-medium">Events</Link>
              <Link href="/articles" className="text-foreground/80 hover:text-primary font-medium transition-colors">Articles</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-[#ea580c] via-[#f97316] to-[#fdba74] py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTAgMzBoNjAiIHN0cm9rZS13aWR0aD0iMiIvPjxwYXRoIGQ9Ik0zMCAwdjYwIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
        <div className="absolute top-5 right-10 w-36 h-36 bg-[#fef3c7] rounded-full blur-3xl opacity-25" />
        <div className="absolute bottom-10 left-20 w-32 h-32 bg-[#9a3412] rounded-full blur-3xl opacity-20" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#fef3c7] to-[#f97316] flex items-center justify-center shadow-lg">
              <Calendar className="w-8 h-8 text-[#9a3412]" />
            </div>
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">Dubai Events Calendar</h1>
              <p className="text-white/90">Discover upcoming events, festivals, and experiences</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-events"
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40" data-testid="select-category">
                  <Filter className="w-4 h-4 mr-2" />
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
                  <Calendar className="w-4 h-4 mr-2" />
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
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold mb-2">No events available</h3>
              <p className="text-muted-foreground mb-6">Check back soon for upcoming events in Dubai</p>
              <Link href="/">
                <Button data-testid="button-back-home">Back to Home</Button>
              </Link>
            </div>
          ) : (
            <>
              {featuredEvents.length > 0 && (
                <div className="mb-12">
                  <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-2 h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full" />
                    Featured Events
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {featuredEvents.map((event) => (
                      <Card key={event.id} className="overflow-hidden group" data-testid={`card-event-${event.id}`}>
                        <div className="flex flex-col sm:flex-row">
                          <div className="sm:w-48 h-40 sm:h-auto bg-muted flex-shrink-0">
                            <img 
                              src={event.image} 
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-5">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <Badge className={`${getCategoryColor(event.category)} no-default-hover-elevate no-default-active-elevate`}>
                                {categories.find(c => c.id === event.category)?.name || event.category}
                              </Badge>
                              <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 no-default-hover-elevate no-default-active-elevate">
                                Featured
                              </Badge>
                            </div>
                            <h3 className="font-heading text-lg font-semibold mb-2">{event.title}</h3>
                            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{event.description}</p>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4 text-orange-500" />
                                <span>{formatDateRange(event.date, event.endDate)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="w-4 h-4 text-orange-500" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4 text-orange-500" />
                                <span className="truncate">{event.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="font-heading text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-2 h-8 bg-gradient-to-b from-orange-500 to-amber-500 rounded-full" />
                  {featuredEvents.length > 0 ? "All Events" : "Events"} 
                  <span className="text-muted-foreground font-normal text-lg">({filteredEvents.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(featuredEvents.length > 0 ? regularEvents : filteredEvents).map((event) => (
                    <Card key={event.id} className="overflow-hidden group" data-testid={`card-event-${event.id}`}>
                      <div className="h-40 bg-muted relative overflow-hidden">
                        <img 
                          src={event.image} 
                          alt={event.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <Badge className={`absolute top-3 left-3 ${getCategoryColor(event.category)} no-default-hover-elevate no-default-active-elevate`}>
                          {categories.find(c => c.id === event.category)?.name || event.category}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-heading text-base font-semibold mb-2 line-clamp-1">{event.title}</h3>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{event.description}</p>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5 text-orange-500" />
                            <span className="truncate">{formatDateRange(event.date, event.endDate)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5 text-orange-500" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 bg-gradient-to-r from-orange-500 to-amber-500 border-0 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-heading text-2xl font-bold mb-2">Planning Your Visit?</h3>
                <p className="text-white/90">Use our budget calculator to estimate your trip costs</p>
              </div>
              <div className="flex gap-3">
                <Link href="/tools/budget">
                  <Button className="bg-white text-orange-600 hover:bg-white/90" data-testid="link-budget">
                    Budget Calculator
                  </Button>
                </Link>
                <Link href="/tools/currency">
                  <Button variant="outline" className="border-white/50 text-white hover:bg-white/10" data-testid="link-currency">
                    Currency Converter
                  </Button>
                </Link>
                <Link href="/tools/plan">
                  <Button variant="outline" className="border-white/50 text-white hover:bg-white/10" data-testid="link-plan">
                    Travel Planning
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <footer className="py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Logo variant="primary" height={28} />
            <div className="flex items-center gap-6 text-muted-foreground text-sm">
              <Link href="/hotels" className="hover:text-foreground transition-colors">Hotels</Link>
              <Link href="/attractions" className="hover:text-foreground transition-colors">Attractions</Link>
              <Link href="/tools/events" className="hover:text-foreground transition-colors">Events</Link>
              <Link href="/articles" className="hover:text-foreground transition-colors">Articles</Link>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <span>2024 Travi</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
