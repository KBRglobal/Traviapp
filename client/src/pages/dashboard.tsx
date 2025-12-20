import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "@/components/stats-card";
import { StatusBadge } from "@/components/status-badge";
import { ContentTypeBadge } from "@/components/content-type-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import {
  MapPin,
  Building2,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  Plus,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ContentWithRelations } from "@shared/schema";

export default function Dashboard() {
  const { toast } = useToast();
  const [isMigrating, setIsMigrating] = useState(false);

  const handleMigrateBlocks = async () => {
    setIsMigrating(true);
    try {
      const response = await apiRequest("POST", "/api/admin/migrate-blocks");
      const result = await response.json();
      toast({
        title: "Migration Complete",
        description: `Successfully migrated ${result.migrated} content items.`,
      });
    } catch (error: any) {
      toast({
        title: "Migration Failed",
        description: error.message || "Failed to migrate content blocks",
        variant: "destructive",
      });
    } finally {
      setIsMigrating(false);
    }
  };

  const { data: stats, isLoading: statsLoading } = useQuery<{
    attractions: number;
    hotels: number;
    articles: number;
    drafts: number;
    published: number;
  }>({
    queryKey: ["/api/stats"],
  });

  const { data: recentContent, isLoading: contentLoading } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/contents"],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to Travi CMS - Dubai Travel Content Management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/attractions/new">
            <Button data-testid="button-new-attraction">
              <Plus className="h-4 w-4 mr-2" />
              New Attraction
            </Button>
          </Link>
          <Link href="/admin/hotels/new">
            <Button variant="outline" data-testid="button-new-hotel">
              <Plus className="h-4 w-4 mr-2" />
              New Hotel
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <StatsCard
              title="Attractions"
              value={stats?.attractions ?? 0}
              description="Total attraction pages"
              icon={MapPin}
            />
            <StatsCard
              title="Hotels"
              value={stats?.hotels ?? 0}
              description="Total hotel pages"
              icon={Building2}
            />
            <StatsCard
              title="Articles"
              value={stats?.articles ?? 0}
              description="Total travel articles"
              icon={FileText}
            />
            <StatsCard
              title="Published"
              value={stats?.published ?? 0}
              description="Live content pages"
              icon={TrendingUp}
              trend={{ value: 12, isPositive: true }}
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-lg">Recent Content</CardTitle>
            <Link href="/attractions">
              <Button variant="ghost" size="sm" data-testid="link-view-all-content">
                View all
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {contentLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentContent && recentContent.length > 0 ? (
              <div className="space-y-4">
                {recentContent.map((content) => (
                  <Link
                    key={content.id}
                    href={`/admin/${content.type}s/${content.id}`}
                    className="flex items-center gap-4 p-2 -mx-2 rounded-md hover-elevate active-elevate-2"
                    data-testid={`link-content-${content.id}`}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded bg-muted">
                      {content.type === "attraction" && <MapPin className="h-5 w-5 text-muted-foreground" />}
                      {content.type === "hotel" && <Building2 className="h-5 w-5 text-muted-foreground" />}
                      {content.type === "article" && <FileText className="h-5 w-5 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{content.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <ContentTypeBadge type={content.type} />
                        <StatusBadge status={content.status} />
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {content.wordCount} words
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No content yet. Create your first page!</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-lg">Pending Review</CardTitle>
            <StatusBadge status="in_review" />
          </CardHeader>
          <CardContent>
            {contentLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No content pending review</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/rss-feeds">
              <Button variant="outline" className="w-full justify-start" data-testid="button-import-rss">
                <Clock className="h-4 w-4 mr-2" />
                Import from RSS Feed
              </Button>
            </Link>
            <Link href="/media">
              <Button variant="outline" className="w-full justify-start" data-testid="button-upload-media">
                <Plus className="h-4 w-4 mr-2" />
                Upload Media
              </Button>
            </Link>
            <Link href="/affiliate-links">
              <Button variant="outline" className="w-full justify-start" data-testid="button-manage-affiliates">
                <TrendingUp className="h-4 w-4 mr-2" />
                Manage Affiliate Links
              </Button>
            </Link>
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={handleMigrateBlocks}
              disabled={isMigrating}
              data-testid="button-migrate-blocks"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isMigrating ? 'animate-spin' : ''}`} />
              {isMigrating ? 'Migrating...' : 'Migrate Legacy Content Blocks'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-lg">Content Targets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Attractions (~1950 words)</span>
                  <span className="text-sm text-muted-foreground">{stats?.attractions ?? 0} pages</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${Math.min(100, ((stats?.attractions ?? 0) / 10) * 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Hotels (~3000 words)</span>
                  <span className="text-sm text-muted-foreground">{stats?.hotels ?? 0} pages</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${Math.min(100, ((stats?.hotels ?? 0) / 10) * 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Articles (~1200-2000 words)</span>
                  <span className="text-sm text-muted-foreground">{stats?.articles ?? 0} pages</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${Math.min(100, ((stats?.articles ?? 0) / 20) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
