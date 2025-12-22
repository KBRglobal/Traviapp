import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Clock,
  Calendar,
  CalendarX,
  RefreshCw,
  ExternalLink,
  Bell,
  Filter,
  CheckCircle,
  Timer,
} from "lucide-react";
import type { ContentWithRelations } from "@shared/schema";

interface ContentExpiryAlertsProps {
  className?: string;
  compact?: boolean;
}

// Content freshness rules (in days)
const FRESHNESS_RULES: Record<string, { warning: number; critical: number }> = {
  article: { warning: 90, critical: 180 },      // News needs frequent updates
  event: { warning: 7, critical: 1 },           // Events expire quickly
  attraction: { warning: 180, critical: 365 },  // Attractions are more stable
  hotel: { warning: 120, critical: 240 },       // Hotels need periodic updates
  dining: { warning: 90, critical: 180 },       // Restaurant info changes often
  itinerary: { warning: 180, critical: 365 },   // Itineraries are fairly stable
  district: { warning: 365, critical: 730 },    // Districts rarely change
};

// Calculate days since last update
function daysSinceUpdate(updatedAt: Date | string): number {
  const updated = new Date(updatedAt);
  const now = new Date();
  const diff = now.getTime() - updated.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

// Calculate days until expiry (for events/scheduled content)
function daysUntilExpiry(expiryDate: Date | string | null | undefined): number | null {
  if (!expiryDate) return null;
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diff = expiry.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Determine alert level
function getAlertLevel(
  content: ContentWithRelations
): "critical" | "warning" | "ok" | "expired" {
  const rules = FRESHNESS_RULES[content.type] || FRESHNESS_RULES.article;
  const daysSince = daysSinceUpdate(content.updatedAt);

  // Check for explicit expiry date
  if (content.expiryDate) {
    const daysUntil = daysUntilExpiry(content.expiryDate);
    if (daysUntil !== null) {
      if (daysUntil < 0) return "expired";
      if (daysUntil <= 7) return "critical";
      if (daysUntil <= 30) return "warning";
    }
  }

  // Check for event end dates
  if (content.type === "event" && content.eventEndDate) {
    const daysUntil = daysUntilExpiry(content.eventEndDate);
    if (daysUntil !== null) {
      if (daysUntil < 0) return "expired";
      if (daysUntil <= 1) return "critical";
      if (daysUntil <= 7) return "warning";
    }
  }

  // Check staleness based on last update
  if (daysSince >= rules.critical) return "critical";
  if (daysSince >= rules.warning) return "warning";

  return "ok";
}

// Format relative date
function formatRelativeDate(date: Date | string): string {
  const days = daysSinceUpdate(date);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

export function ContentExpiryAlerts({
  className,
  compact = false,
}: ContentExpiryAlertsProps) {
  const [, navigate] = useLocation();
  const [filter, setFilter] = useState<"all" | "critical" | "warning">("all");

  // Fetch published content
  const { data: contents = [] } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/contents"],
    select: (data) => data.filter((c) => c.status === "published"),
  });

  // Analyze content for expiry
  const alerts = useMemo(() => {
    const results = contents
      .map((content) => ({
        content,
        level: getAlertLevel(content),
        daysSinceUpdate: daysSinceUpdate(content.updatedAt),
        daysUntilExpiry: content.expiryDate
          ? daysUntilExpiry(content.expiryDate)
          : content.eventEndDate
          ? daysUntilExpiry(content.eventEndDate)
          : null,
      }))
      .filter((item) => item.level !== "ok")
      .sort((a, b) => {
        // Sort by severity first, then by urgency
        const levelOrder = { expired: 0, critical: 1, warning: 2, ok: 3 };
        if (levelOrder[a.level] !== levelOrder[b.level]) {
          return levelOrder[a.level] - levelOrder[b.level];
        }
        return a.daysSinceUpdate - b.daysSinceUpdate;
      });

    if (filter !== "all") {
      return results.filter((item) =>
        filter === "critical"
          ? item.level === "critical" || item.level === "expired"
          : item.level === "warning"
      );
    }

    return results;
  }, [contents, filter]);

  // Stats
  const stats = useMemo(() => {
    const all = contents.map((c) => getAlertLevel(c));
    return {
      critical: all.filter((l) => l === "critical" || l === "expired").length,
      warning: all.filter((l) => l === "warning").length,
      ok: all.filter((l) => l === "ok").length,
    };
  }, [contents]);

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "expired":
        return (
          <Badge variant="destructive" className="gap-1">
            <CalendarX className="h-3 w-3" />
            Expired
          </Badge>
        );
      case "critical":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            Critical
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 gap-1">
            <Clock className="h-3 w-3" />
            Stale
          </Badge>
        );
      default:
        return null;
    }
  };

  // Compact button view for toolbar
  if (compact) {
    const hasAlerts = stats.critical > 0 || stats.warning > 0;

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`gap-2 ${
              stats.critical > 0
                ? "border-red-200 text-red-600"
                : stats.warning > 0
                ? "border-yellow-200 text-yellow-600"
                : ""
            } ${className}`}
          >
            <Timer className="h-4 w-4" />
            {hasAlerts ? (
              <span>
                {stats.critical > 0 && (
                  <span className="text-red-600">{stats.critical}</span>
                )}
                {stats.critical > 0 && stats.warning > 0 && " / "}
                {stats.warning > 0 && (
                  <span className="text-yellow-600">{stats.warning}</span>
                )}
              </span>
            ) : (
              "All Fresh"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0" align="end">
          <div className="p-4 border-b">
            <h4 className="font-semibold flex items-center gap-2">
              <Timer className="h-4 w-4" />
              Content Freshness Alerts
            </h4>
            <p className="text-sm text-muted-foreground">
              Content that needs review or has expired
            </p>
          </div>

          <div className="p-2 border-b bg-muted/50 flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
              <SelectTrigger className="h-8 w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ({alerts.length})</SelectItem>
                <SelectItem value="critical">Critical ({stats.critical})</SelectItem>
                <SelectItem value="warning">Warnings ({stats.warning})</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ScrollArea className="h-[300px]">
            {alerts.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="font-medium">All content is fresh!</p>
                <p className="text-sm">No updates needed right now</p>
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {alerts.slice(0, 10).map(({ content, level, daysSinceUpdate, daysUntilExpiry }) => (
                  <div
                    key={content.id}
                    className={`p-3 rounded-lg border ${
                      level === "expired" || level === "critical"
                        ? "border-red-200 bg-red-50"
                        : "border-yellow-200 bg-yellow-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm truncate">
                          {content.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {getLevelBadge(level)}
                          <span className="text-xs text-muted-foreground">
                            {daysUntilExpiry !== null
                              ? daysUntilExpiry < 0
                                ? `Expired ${Math.abs(daysUntilExpiry)} days ago`
                                : `Expires in ${daysUntilExpiry} days`
                              : `Updated ${formatRelativeDate(content.updatedAt)}`}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          navigate(`/admin/${content.type}s/${content.id}`)
                        }
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {alerts.length > 10 && (
                  <div className="text-center text-sm text-muted-foreground py-2">
                    +{alerts.length - 10} more items
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>
    );
  }

  // Full card view
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Content Freshness
            </CardTitle>
            <CardDescription>
              Monitor content that needs updating or has expired
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
                <div className="text-xs text-muted-foreground">Critical</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.warning}</div>
                <div className="text-xs text-muted-foreground">Warnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.ok}</div>
                <div className="text-xs text-muted-foreground">Fresh</div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Alerts</SelectItem>
              <SelectItem value="critical">Critical Only</SelectItem>
              <SelectItem value="warning">Warnings Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-[400px]">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p className="font-medium text-lg">All content is fresh!</p>
              <p>No updates needed right now</p>
            </div>
          ) : (
            <div className="space-y-2">
              {alerts.map(({ content, level, daysSinceUpdate, daysUntilExpiry }) => (
                <div
                  key={content.id}
                  className={`p-4 rounded-lg border ${
                    level === "expired" || level === "critical"
                      ? "border-red-200 bg-red-50"
                      : "border-yellow-200 bg-yellow-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{content.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {getLevelBadge(level)}
                        <Badge variant="outline" className="text-xs capitalize">
                          {content.type}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">
                        {daysUntilExpiry !== null ? (
                          daysUntilExpiry < 0 ? (
                            <span className="text-red-600">
                              Expired {Math.abs(daysUntilExpiry)} days ago
                            </span>
                          ) : (
                            <span>Expires in {daysUntilExpiry} days</span>
                          )
                        ) : (
                          <span>
                            Last updated {formatRelativeDate(content.updatedAt)} ({daysSinceUpdate}{" "}
                            days)
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/${content.type}s/${content.id}`)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
