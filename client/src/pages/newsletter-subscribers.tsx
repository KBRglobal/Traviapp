import { useQuery } from "@tanstack/react-query";
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
import { Loader2, Mail, Users, Download, Search, Filter } from "lucide-react";
import { Redirect } from "wouter";
import { format } from "date-fns";
import { useState, useMemo } from "react";

type NewsletterSubscriber = {
  id: string;
  email: string;
  source: string | null;
  subscribedAt: string;
  isActive: boolean;
};

export default function NewsletterSubscribersPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  const { data: subscribers = [], isLoading } = useQuery<NewsletterSubscriber[]>({
    queryKey: ["/api/newsletter/subscribers"],
    enabled: isAuthenticated,
  });

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((subscriber) => {
      const matchesSearch = subscriber.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = 
        filterStatus === "all" ? true :
        filterStatus === "active" ? subscriber.isActive :
        !subscriber.isActive;
      return matchesSearch && matchesStatus;
    });
  }, [subscribers, searchQuery, filterStatus]);

  const activeCount = subscribers.filter(s => s.isActive).length;
  const inactiveCount = subscribers.filter(s => !s.isActive).length;

  const exportToCSV = () => {
    const headers = ["Email", "Source", "Subscribed At", "Status"];
    const rows = filteredSubscribers.map((subscriber) => [
      subscriber.email,
      subscriber.source || "coming_soon",
      subscriber.subscribedAt 
        ? format(new Date(subscriber.subscribedAt), "yyyy-MM-dd HH:mm:ss")
        : "N/A",
      subscriber.isActive ? "Active" : "Inactive"
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
            People who signed up to be notified when the site launches
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1.5">
            <Users className="w-4 h-4 mr-2" />
            {subscribers.length} total
          </Badge>
          <Badge variant="default" className="px-3 py-1.5">
            {activeCount} active
          </Badge>
          <Badge variant="outline" className="px-3 py-1.5">
            {inactiveCount} inactive
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
                All email addresses collected from the coming soon page
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
                placeholder="Search by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-subscribers"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <div className="flex rounded-md overflow-hidden border">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-3 py-1.5 text-sm transition-colors ${
                    filterStatus === "all" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-background hover:bg-muted"
                  }`}
                  data-testid="button-filter-all"
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus("active")}
                  className={`px-3 py-1.5 text-sm transition-colors border-l ${
                    filterStatus === "active" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-background hover:bg-muted"
                  }`}
                  data-testid="button-filter-active"
                >
                  Active
                </button>
                <button
                  onClick={() => setFilterStatus("inactive")}
                  className={`px-3 py-1.5 text-sm transition-colors border-l ${
                    filterStatus === "inactive" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-background hover:bg-muted"
                  }`}
                  data-testid="button-filter-inactive"
                >
                  Inactive
                </button>
              </div>
            </div>
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
                    <TableHead>Email</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Subscribed At</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscribers.map((subscriber) => (
                    <TableRow key={subscriber.id} data-testid={`row-subscriber-${subscriber.id}`}>
                      <TableCell className="font-medium" data-testid={`text-email-${subscriber.id}`}>
                        {subscriber.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {subscriber.source || "coming_soon"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {subscriber.subscribedAt 
                          ? format(new Date(subscriber.subscribedAt), "MMM d, yyyy 'at' h:mm a")
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={subscriber.isActive ? "default" : "secondary"}>
                          {subscriber.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
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
