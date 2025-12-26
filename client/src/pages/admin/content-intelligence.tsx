import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Brain,
  TrendingUp,
  Target,
  AlertCircle,
  Calendar,
  Search,
  Lightbulb,
  BarChart3,
  Network,
} from "lucide-react";

interface ContentGap {
  contentId: string;
  title: string;
  gaps: Array<{
    type: string;
    priority: "high" | "medium" | "low";
    suggestion: string;
  }>;
}

interface WatchlistItem {
  contentId: string;
  title: string;
  reason: string;
  priority: "high" | "medium" | "low";
  lastChecked: string;
}

interface EventItem {
  id: string;
  title: string;
  status: "upcoming" | "ongoing" | "past";
  needsUpdate: boolean;
}

export default function ContentIntelligencePage() {
  const { data: gapsData, isLoading: gapsLoading } = useQuery<{
    content: ContentGap[];
    stats: { contentWithGaps: number; totalGaps: number; highPriorityGaps: number };
  }>({
    queryKey: ["/api/intelligence/gaps"],
  });

  const { data: watchlistData, isLoading: watchlistLoading } = useQuery<{
    items: WatchlistItem[];
    stats: { total: number; highPriority: number; mediumPriority: number };
  }>({
    queryKey: ["/api/intelligence/watchlist"],
  });

  const { data: eventsData, isLoading: eventsLoading } = useQuery<{
    events: EventItem[];
    stats: { total: number; upcoming: number; ongoing: number; past: number; needsUpdate: number };
  }>({
    queryKey: ["/api/intelligence/events"],
  });

  const { data: clustersData } = useQuery({
    queryKey: ["/api/intelligence/clusters/areas"],
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  const isLoading = gapsLoading || watchlistLoading || eventsLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-80" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Brain className="h-8 w-8 text-primary" />
          Content Intelligence
        </h1>
        <p className="text-muted-foreground mt-1">
          AI-powered insights for content optimization and gap analysis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Content Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-gaps">
              {gapsData?.stats?.totalGaps || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {gapsData?.stats?.highPriorityGaps || 0} high priority
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Watchlist Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-watchlist-total">
              {watchlistData?.stats?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {watchlistData?.stats?.highPriority || 0} need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Events Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-events-total">
              {eventsData?.stats?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {eventsData?.stats?.needsUpdate || 0} need update
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Network className="h-4 w-4" />
              Topic Clusters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-clusters-count">
              {(clustersData as any)?.count || 0}
            </div>
            <p className="text-xs text-muted-foreground">Detected areas</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="gaps" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gaps" className="gap-2">
            <Search className="h-4 w-4" />
            Content Gaps
          </TabsTrigger>
          <TabsTrigger value="watchlist" className="gap-2">
            <AlertCircle className="h-4 w-4" />
            Watchlist
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-2">
            <Calendar className="h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gaps">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                SERP Gap Analysis
              </CardTitle>
              <CardDescription>
                Missing topics and content opportunities based on search trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {gapsData?.content && gapsData.content.length > 0 ? (
                  <div className="space-y-4">
                    {gapsData.content.map((item) => (
                      <div key={item.contentId} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">{item.title}</h4>
                        <div className="space-y-2">
                          {item.gaps.map((gap, idx) => (
                            <div
                              key={idx}
                              className="flex items-start justify-between gap-4 text-sm"
                            >
                              <div className="flex-1">
                                <Badge variant="outline" className="mr-2">
                                  {gap.type}
                                </Badge>
                                <span className="text-muted-foreground">{gap.suggestion}</span>
                              </div>
                              {getPriorityBadge(gap.priority)}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No content gaps detected</p>
                    <p className="text-sm mt-2">Your content coverage looks comprehensive</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="watchlist">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Price & Hours Watchlist
              </CardTitle>
              <CardDescription>
                Content with volatile data that may need frequent updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {watchlistData?.items && watchlistData.items.length > 0 ? (
                  <div className="space-y-3">
                    {watchlistData.items.map((item) => (
                      <div
                        key={item.contentId}
                        className="flex items-center justify-between p-3 rounded-lg border"
                        data-testid={`watchlist-item-${item.contentId}`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.reason}</p>
                        </div>
                        {getPriorityBadge(item.priority)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No items on watchlist</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Event Calendar Sync
              </CardTitle>
              <CardDescription>
                Track events and ensure content stays up-to-date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                {eventsData?.events && eventsData.events.length > 0 ? (
                  <div className="space-y-3">
                    {eventsData.events.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-3 rounded-lg border"
                        data-testid={`event-item-${event.id}`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{event.title}</p>
                          <Badge variant="outline" className="mt-1">
                            {event.status}
                          </Badge>
                        </div>
                        {event.needsUpdate && (
                          <Badge variant="destructive">Needs Update</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No events tracked</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Next Best Article Recommendations
              </CardTitle>
              <CardDescription>
                AI-powered suggestions for your next content pieces
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a content item to see recommendations</p>
                <p className="text-sm mt-2">
                  Recommendations are based on topic clusters and SERP analysis
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
