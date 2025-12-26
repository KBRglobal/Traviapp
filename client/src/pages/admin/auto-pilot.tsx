import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Zap,
  Play,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Calendar,
  Languages,
  FileText,
  TrendingUp,
} from "lucide-react";

interface AutoPilotStatus {
  isRunning: boolean;
  lastRun: string | null;
  nextScheduledRun: string | null;
  tasksCompleted: number;
  tasksScheduled: number;
  recentErrors: number;
}

interface ScheduledContent {
  id: string;
  title: string;
  type: string;
  scheduledAt: string;
}

export default function AutoPilotPage() {
  const { toast } = useToast();

  const { data: status, isLoading: statusLoading } = useQuery<AutoPilotStatus>({
    queryKey: ["/api/auto-pilot/status"],
  });

  const { data: scheduledData } = useQuery<{ count: number; items: ScheduledContent[] }>({
    queryKey: ["/api/auto-pilot/scheduled"],
  });

  const { data: dailyReport } = useQuery({
    queryKey: ["/api/auto-pilot/reports/daily"],
  });

  const runHourlyMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auto-pilot/run/hourly"),
    onSuccess: () => {
      toast({ title: "Hourly tasks triggered", description: "Running in background..." });
      queryClient.invalidateQueries({ queryKey: ["/api/auto-pilot"] });
    },
    onError: () => toast({ title: "Failed to run hourly tasks", variant: "destructive" }),
  });

  const runDailyMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auto-pilot/run/daily"),
    onSuccess: () => {
      toast({ title: "Daily tasks triggered", description: "Running in background..." });
      queryClient.invalidateQueries({ queryKey: ["/api/auto-pilot"] });
    },
    onError: () => toast({ title: "Failed to run daily tasks", variant: "destructive" }),
  });

  const processScheduledMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/auto-pilot/scheduled/process"),
    onSuccess: () => {
      toast({ title: "Processing scheduled content" });
      queryClient.invalidateQueries({ queryKey: ["/api/auto-pilot/scheduled"] });
    },
    onError: () => toast({ title: "Failed to process scheduled content", variant: "destructive" }),
  });

  if (statusLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Zap className="h-8 w-8 text-primary" />
            Auto-Pilot Control Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Automated content publishing, translations, and maintenance
          </p>
        </div>
        <Badge variant={status?.isRunning ? "default" : "secondary"} className="text-sm">
          {status?.isRunning ? "System Active" : "System Idle"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Tasks Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-tasks-completed">
              {status?.tasksCompleted || 0}
            </div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-tasks-scheduled">
              {scheduledData?.count || 0}
            </div>
            <p className="text-xs text-muted-foreground">Content items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Last Run
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {status?.lastRun ? new Date(status.lastRun).toLocaleString() : "Never"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              {status?.recentErrors && status.recentErrors > 0 ? (
                <AlertTriangle className="h-4 w-4 text-destructive" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              Recent Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-errors">
              {status?.recentErrors || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Manual Triggers
            </CardTitle>
            <CardDescription>
              Run automation tasks manually for testing or immediate execution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => runHourlyMutation.mutate()}
              disabled={runHourlyMutation.isPending}
              className="w-full justify-start"
              variant="outline"
              data-testid="button-run-hourly"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${runHourlyMutation.isPending ? "animate-spin" : ""}`} />
              Run Hourly Tasks
            </Button>
            <Button
              onClick={() => runDailyMutation.mutate()}
              disabled={runDailyMutation.isPending}
              className="w-full justify-start"
              variant="outline"
              data-testid="button-run-daily"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Run Daily Tasks
            </Button>
            <Button
              onClick={() => processScheduledMutation.mutate()}
              disabled={processScheduledMutation.isPending}
              className="w-full justify-start"
              variant="outline"
              data-testid="button-process-scheduled"
            >
              <FileText className="mr-2 h-4 w-4" />
              Process Scheduled Content
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Scheduled Content
            </CardTitle>
            <CardDescription>
              Content items queued for automatic publishing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {scheduledData?.items && scheduledData.items.length > 0 ? (
                <div className="space-y-2">
                  {scheduledData.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                      data-testid={`scheduled-item-${item.id}`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.scheduledAt).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline">{item.type}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No scheduled content</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Daily Report Summary
          </CardTitle>
          <CardDescription>
            Automated daily insights and activity summary
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dailyReport ? (
            <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto max-h-[300px]">
              {JSON.stringify(dailyReport, null, 2)}
            </pre>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No report available yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
