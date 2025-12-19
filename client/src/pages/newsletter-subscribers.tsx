import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Loader2, Mail, Users, Download, Search, Trash2, CheckCircle, Clock, XCircle, AlertTriangle } from "lucide-react";
import { Redirect } from "wouter";
import { format } from "date-fns";
import { useState, useMemo } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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

export default function NewsletterSubscribersPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

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
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Newsletter Subscribers</h1>
          <p className="text-muted-foreground">
            Manage newsletter subscriptions with double opt-in verification
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1.5">
            <Users className="w-4 h-4 mr-2" />
            {subscribers.length} total
          </Badge>
          <Badge variant="default" className="px-3 py-1.5">
            {statusCounts.subscribed || 0} confirmed
          </Badge>
          <Badge variant="outline" className="px-3 py-1.5">
            {statusCounts.pending_confirmation || 0} pending
          </Badge>
        </div>
      </div>

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
    </div>
  );
}
