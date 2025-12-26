import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Loader2, Mail, Users, Download, Search, Trash2, CheckCircle, Clock, XCircle, 
  AlertTriangle, Beaker, GitBranch, Zap, Play, Pause, Settings, BarChart3,
  TrendingUp, MessageSquare, ArrowRight, Calendar, Target
} from "lucide-react";
import { Redirect } from "wouter";
import { format } from "date-fns";
import { useState, useMemo } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

type SubscriberStatus = "pending_confirmation" | "subscribed" | "unsubscribed" | "bounced" | "complained";

type NewsletterSubscriber = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  source: string | null;
  status: SubscriberStatus;
  subscribedAt: string;
  confirmedAt: string | null;
  unsubscribedAt: string | null;
  isActive: boolean;
};

const statusConfig: Record<SubscriberStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: typeof CheckCircle }> = {
  pending_confirmation: { label: "Pending", variant: "secondary", icon: Clock },
  subscribed: { label: "Subscribed", variant: "default", icon: CheckCircle },
  unsubscribed: { label: "Unsubscribed", variant: "outline", icon: XCircle },
  bounced: { label: "Bounced", variant: "destructive", icon: AlertTriangle },
  complained: { label: "Complained", variant: "destructive", icon: AlertTriangle },
};

const mockABTests = [
  { 
    id: "1", 
    name: "Subject Line Test - Attractions", 
    status: "running", 
    variantA: "Top 10 Dubai Attractions You Must See", 
    variantB: "Discover Dubai's Most Popular Destinations",
    sentA: 5000,
    sentB: 5000,
    openRateA: 24.5,
    openRateB: 28.3,
    clickRateA: 4.2,
    clickRateB: 5.1,
    winner: null,
    startedAt: new Date(Date.now() - 86400000 * 2)
  },
  { 
    id: "2", 
    name: "CTA Button Color Test", 
    status: "completed", 
    variantA: "Blue CTA Button", 
    variantB: "Orange CTA Button",
    sentA: 10000,
    sentB: 10000,
    openRateA: 22.1,
    openRateB: 22.4,
    clickRateA: 3.8,
    clickRateB: 6.2,
    winner: "B",
    startedAt: new Date(Date.now() - 86400000 * 7)
  },
];

const mockDripCampaigns = [
  {
    id: "1",
    name: "Welcome Series",
    status: "active",
    trigger: "subscription",
    steps: [
      { day: 0, subject: "Welcome to Travi Dubai!", sent: 2400, opened: 1920 },
      { day: 3, subject: "Top 5 Things to Do in Dubai", sent: 2100, opened: 1470 },
      { day: 7, subject: "Exclusive Hotel Deals Just for You", sent: 1800, opened: 1080 },
    ],
    totalEnrolled: 2400,
    completed: 1200,
    conversionRate: 12.5
  },
  {
    id: "2",
    name: "Abandoned Booking Recovery",
    status: "active",
    trigger: "cart_abandon",
    steps: [
      { day: 0, subject: "You left something behind...", sent: 500, opened: 350 },
      { day: 2, subject: "Last chance: Complete your booking", sent: 320, opened: 192 },
    ],
    totalEnrolled: 500,
    completed: 180,
    conversionRate: 18.2
  },
  {
    id: "3",
    name: "Re-engagement Campaign",
    status: "paused",
    trigger: "inactivity_30days",
    steps: [
      { day: 0, subject: "We miss you! Here's what's new", sent: 0, opened: 0 },
      { day: 7, subject: "Special offer just for you", sent: 0, opened: 0 },
    ],
    totalEnrolled: 0,
    completed: 0,
    conversionRate: 0
  },
];

export default function NewsletterSubscribersPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("subscribers");

  const { data: subscribers = [], isLoading } = useQuery<NewsletterSubscriber[]>({
    queryKey: ["/api/newsletter/subscribers"],
    enabled: isAuthenticated,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/newsletter/subscribers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/newsletter/subscribers"] });
      toast({
        title: "Subscriber deleted",
        description: "The subscriber has been permanently removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete subscriber. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((subscriber) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        subscriber.email.toLowerCase().includes(searchLower) ||
        (subscriber.firstName?.toLowerCase().includes(searchLower)) ||
        (subscriber.lastName?.toLowerCase().includes(searchLower));
      const matchesStatus = filterStatus === "all" || subscriber.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [subscribers, searchQuery, filterStatus]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: subscribers.length };
    for (const s of subscribers) {
      counts[s.status] = (counts[s.status] || 0) + 1;
    }
    return counts;
  }, [subscribers]);

  const exportToCSV = () => {
    const headers = ["Email", "First Name", "Last Name", "Status", "Source", "Subscribed At", "Confirmed At"];
    const rows = filteredSubscribers.map((subscriber) => [
      subscriber.email,
      subscriber.firstName || "",
      subscriber.lastName || "",
      subscriber.status,
      subscriber.source || "coming_soon",
      subscriber.subscribedAt ? format(new Date(subscriber.subscribedAt), "yyyy-MM-dd HH:mm:ss") : "",
      subscriber.confirmedAt ? format(new Date(subscriber.confirmedAt), "yyyy-MM-dd HH:mm:ss") : "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `newsletter-subscribers-${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Newsletter Management</h1>
          <p className="text-muted-foreground">
            Manage subscribers, A/B tests, and automated drip campaigns
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1.5" data-testid="stat-total-subscribers">
            <Users className="w-4 h-4 mr-2" />
            {subscribers.length} total
          </Badge>
          <Badge variant="default" className="px-3 py-1.5" data-testid="stat-confirmed-subscribers">
            {statusCounts.subscribed || 0} confirmed
          </Badge>
          <Badge variant="outline" className="px-3 py-1.5" data-testid="stat-pending-subscribers">
            {statusCounts.pending_confirmation || 0} pending
          </Badge>
        </div>
      </div>

      {/* How It Works - Hebrew */}
      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            איך זה עובד / How It Works
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p className="text-muted-foreground" dir="rtl">
            <strong>ניהול מנויים:</strong> צפה ברשימת המנויים, סנן לפי סטטוס, ייצא ל-CSV.
          </p>
          <p className="text-muted-foreground" dir="rtl">
            <strong>בדיקות A/B:</strong> בדוק נושאי מייל שונים, כפתורי CTA וגופנים כדי למקסם פתיחות ולחיצות.
          </p>
          <p className="text-muted-foreground" dir="rtl">
            <strong>קמפיינים אוטומטיים:</strong> הגדר סדרות מיילים אוטומטיות לברכת הצטרפות, שחזור עגלה נטושה, ועוד.
          </p>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="subscribers" className="gap-2" data-testid="tab-subscribers">
            <Users className="w-4 h-4" />
            Subscribers
          </TabsTrigger>
          <TabsTrigger value="ab-testing" className="gap-2" data-testid="tab-ab-testing">
            <Beaker className="w-4 h-4" />
            A/B Testing
          </TabsTrigger>
          <TabsTrigger value="drip-campaigns" className="gap-2" data-testid="tab-drip-campaigns">
            <GitBranch className="w-4 h-4" />
            Drip Campaigns
          </TabsTrigger>
        </TabsList>

        {/* Subscribers Tab */}
        <TabsContent value="subscribers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Subscriber List
                  </CardTitle>
                  <CardDescription>
                    All newsletter subscribers with consent tracking
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={exportToCSV}
                  disabled={filteredSubscribers.length === 0}
                  data-testid="button-export-csv"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by email or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                    data-testid="input-search-subscribers"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]" data-testid="select-filter-status">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status ({statusCounts.all})</SelectItem>
                    <SelectItem value="subscribed">Subscribed ({statusCounts.subscribed || 0})</SelectItem>
                    <SelectItem value="pending_confirmation">Pending ({statusCounts.pending_confirmation || 0})</SelectItem>
                    <SelectItem value="unsubscribed">Unsubscribed ({statusCounts.unsubscribed || 0})</SelectItem>
                    <SelectItem value="bounced">Bounced ({statusCounts.bounced || 0})</SelectItem>
                    <SelectItem value="complained">Complained ({statusCounts.complained || 0})</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredSubscribers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  {searchQuery || filterStatus !== "all" ? (
                    <>
                      <p>No subscribers match your filters</p>
                      <p className="text-sm">Try adjusting your search or filter criteria</p>
                    </>
                  ) : (
                    <>
                      <p>No subscribers yet</p>
                      <p className="text-sm">Subscribers will appear here when people sign up</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subscriber</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Signed Up</TableHead>
                        <TableHead>Confirmed</TableHead>
                        <TableHead className="w-[50px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubscribers.map((subscriber) => {
                        const config = statusConfig[subscriber.status];
                        const StatusIcon = config.icon;
                        const displayName = [subscriber.firstName, subscriber.lastName].filter(Boolean).join(" ");
                        
                        return (
                          <TableRow key={subscriber.id} data-testid={`row-subscriber-${subscriber.id}`}>
                            <TableCell>
                              <div>
                                <div className="font-medium" data-testid={`text-email-${subscriber.id}`}>
                                  {subscriber.email}
                                </div>
                                {displayName && (
                                  <div className="text-sm text-muted-foreground">
                                    {displayName}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={config.variant} className="gap-1">
                                <StatusIcon className="w-3 h-3" />
                                {config.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {subscriber.source || "coming_soon"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {subscriber.subscribedAt 
                                ? format(new Date(subscriber.subscribedAt), "MMM d, yyyy")
                                : "-"}
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {subscriber.confirmedAt 
                                ? format(new Date(subscriber.confirmedAt), "MMM d, yyyy")
                                : "-"}
                            </TableCell>
                            <TableCell>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    data-testid={`button-delete-${subscriber.id}`}
                                  >
                                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Subscriber</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete {subscriber.email} and all associated data. 
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteMutation.mutate(subscriber.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      data-testid={`button-confirm-delete-${subscriber.id}`}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}

              {filteredSubscribers.length > 0 && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Showing {filteredSubscribers.length} of {subscribers.length} subscribers
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* A/B Testing Tab */}
        <TabsContent value="ab-testing" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    <Beaker className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Tests</p>
                    <p className="text-2xl font-semibold" data-testid="stat-active-tests">1</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-green-500/10">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-semibold" data-testid="stat-completed-tests">1</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-blue-500/10">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Improvement</p>
                    <p className="text-2xl font-semibold" data-testid="stat-avg-improvement">+15.5%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-orange-500/10">
                    <BarChart3 className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Emails Sent</p>
                    <p className="text-2xl font-semibold" data-testid="stat-total-ab-emails">30K</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Beaker className="w-5 h-5" />
                    A/B Tests
                  </CardTitle>
                  <CardDescription>
                    Test subject lines, content, and CTAs to optimize performance
                  </CardDescription>
                </div>
                <Button data-testid="button-create-ab-test">
                  <Beaker className="w-4 h-4 mr-2" />
                  New A/B Test
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {mockABTests.map((test) => (
                    <Card key={test.id} className="border-l-4 border-l-primary" data-testid={`card-ab-test-${test.id}`}>
                      <CardContent className="pt-4">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{test.name}</h3>
                              <Badge variant={test.status === "running" ? "default" : "secondary"}>
                                {test.status === "running" ? "Running" : "Completed"}
                              </Badge>
                              {test.winner && (
                                <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400">
                                  Winner: Variant {test.winner}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Started {format(test.startedAt, "MMM d, yyyy")}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {test.status === "running" && (
                              <Button variant="outline" size="sm" data-testid={`button-stop-test-${test.id}`}>
                                <Pause className="w-4 h-4 mr-1" />
                                Stop
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" data-testid={`button-settings-test-${test.id}`}>
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="p-3 rounded-md bg-muted/50 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Variant A</span>
                              <span className="text-xs text-muted-foreground">{test.sentA.toLocaleString()} sent</span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{test.variantA}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span>Open: <strong>{test.openRateA}%</strong></span>
                              <span>Click: <strong>{test.clickRateA}%</strong></span>
                            </div>
                          </div>
                          <div className="p-3 rounded-md bg-muted/50 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Variant B</span>
                              <span className="text-xs text-muted-foreground">{test.sentB.toLocaleString()} sent</span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{test.variantB}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span>Open: <strong>{test.openRateB}%</strong></span>
                              <span>Click: <strong>{test.clickRateB}%</strong></span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Drip Campaigns Tab */}
        <TabsContent value="drip-campaigns" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    <GitBranch className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Campaigns</p>
                    <p className="text-2xl font-semibold" data-testid="stat-active-campaigns">2</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-green-500/10">
                    <Users className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Enrolled</p>
                    <p className="text-2xl font-semibold" data-testid="stat-total-enrolled">2,900</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-blue-500/10">
                    <Target className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Conversion</p>
                    <p className="text-2xl font-semibold" data-testid="stat-avg-conversion">15.4%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-orange-500/10">
                    <Zap className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Emails Automated</p>
                    <p className="text-2xl font-semibold" data-testid="stat-emails-automated">7,120</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="w-5 h-5" />
                    Drip Campaigns
                  </CardTitle>
                  <CardDescription>
                    Automated email sequences triggered by user actions
                  </CardDescription>
                </div>
                <Button data-testid="button-create-drip-campaign">
                  <GitBranch className="w-4 h-4 mr-2" />
                  New Campaign
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {mockDripCampaigns.map((campaign) => (
                    <Card key={campaign.id} data-testid={`card-drip-campaign-${campaign.id}`}>
                      <CardContent className="pt-4">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{campaign.name}</h3>
                              <Badge variant={campaign.status === "active" ? "default" : "secondary"}>
                                {campaign.status === "active" ? "Active" : "Paused"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Trigger: <span className="font-medium">{campaign.trigger.replace(/_/g, " ")}</span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-muted">
                              <span className="text-sm text-muted-foreground">Auto-send</span>
                              <Switch 
                                checked={campaign.status === "active"} 
                                data-testid={`switch-campaign-${campaign.id}`}
                              />
                            </div>
                            <Button variant="ghost" size="icon" data-testid={`button-edit-campaign-${campaign.id}`}>
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Campaign Steps */}
                        <div className="mt-4 space-y-2">
                          {campaign.steps.map((step, index) => (
                            <div key={index} className="flex items-center gap-3 p-2 rounded-md bg-muted/30">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">Day {step.day}</span>
                                </div>
                                <p className="text-sm font-medium">{step.subject}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm">{step.sent.toLocaleString()} sent</p>
                                <p className="text-xs text-muted-foreground">
                                  {step.sent > 0 ? Math.round((step.opened / step.sent) * 100) : 0}% opened
                                </p>
                              </div>
                              {index < campaign.steps.length - 1 && (
                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Campaign Stats */}
                        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                          <div>
                            <p className="text-xs text-muted-foreground">Enrolled</p>
                            <p className="text-lg font-semibold">{campaign.totalEnrolled.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Completed</p>
                            <p className="text-lg font-semibold">{campaign.completed.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Conversion Rate</p>
                            <p className="text-lg font-semibold text-green-600">{campaign.conversionRate}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
