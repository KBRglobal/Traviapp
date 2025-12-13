import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Mail, Users } from "lucide-react";
import { Redirect } from "wouter";
import { format } from "date-fns";

type NewsletterSubscriber = {
  id: string;
  email: string;
  source: string | null;
  subscribedAt: string;
  isActive: boolean;
};

export default function NewsletterSubscribersPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const { data: subscribers = [], isLoading } = useQuery<NewsletterSubscriber[]>({
    queryKey: ["/api/newsletter/subscribers"],
    enabled: isAuthenticated,
  });

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
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold" data-testid="text-page-title">Newsletter Subscribers</h1>
          <p className="text-muted-foreground">
            People who signed up to be notified when the site launches
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <Users className="w-4 h-4 mr-2" />
          {subscribers.length} subscribers
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Subscriber List
          </CardTitle>
          <CardDescription>
            All email addresses collected from the coming soon page
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : subscribers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No subscribers yet</p>
              <p className="text-sm">Subscribers will appear here when people sign up</p>
            </div>
          ) : (
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
                {subscribers.map((subscriber) => (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
