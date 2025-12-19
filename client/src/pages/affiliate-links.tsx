import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Link2, Trash2, ExternalLink, Copy } from "lucide-react";
import type { AffiliateLink } from "@shared/schema";

export default function AffiliateLinks() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [provider, setProvider] = useState("");
  const [anchor, setAnchor] = useState("");
  const [url, setUrl] = useState("");
  const [productId, setProductId] = useState("");
  const [placement, setPlacement] = useState("");

  const { data: links, isLoading } = useQuery<AffiliateLink[]>({
    queryKey: ["/api/affiliate-links"],
  });

  const createMutation = useMutation({
    mutationFn: (data: { provider: string; anchor: string; url: string; productId?: string; placement?: string }) =>
      apiRequest("POST", "/api/affiliate-links", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/affiliate-links"] });
      setDialogOpen(false);
      setProvider("");
      setAnchor("");
      setUrl("");
      setProductId("");
      setPlacement("");
      toast({ title: "Affiliate link added successfully" });
    },
    onError: () => {
      toast({ title: "Failed to add affiliate link", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest("DELETE", `/api/affiliate-links/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/affiliate-links"] });
      toast({ title: "Affiliate link deleted" });
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const handleSubmit = () => {
    if (!provider || !anchor || !url) return;
    createMutation.mutate({
      provider,
      anchor,
      url,
      productId: productId || undefined,
      placement: placement || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Affiliate Links</h1>
          <p className="text-muted-foreground">Manage affiliate links for monetization</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-link">
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Affiliate Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="link-provider">Provider</Label>
                <Input
                  id="link-provider"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  placeholder="e.g., GetYourGuide, Booking.com"
                  data-testid="input-link-provider"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link-anchor">Anchor Text</Label>
                <Input
                  id="link-anchor"
                  value={anchor}
                  onChange={(e) => setAnchor(e.target.value)}
                  placeholder="e.g., Book tickets now"
                  data-testid="input-link-anchor"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link-url">Affiliate URL</Label>
                <Input
                  id="link-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  data-testid="input-link-url"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link-product-id">Product ID (optional)</Label>
                <Input
                  id="link-product-id"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  placeholder="Product or activity ID"
                  data-testid="input-link-product-id"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link-placement">Placement (optional)</Label>
                <Input
                  id="link-placement"
                  value={placement}
                  onChange={(e) => setPlacement(e.target.value)}
                  placeholder="e.g., hero, sidebar, footer"
                  data-testid="input-link-placement"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!provider || !anchor || !url || createMutation.isPending}
                data-testid="button-save-link"
              >
                Add Link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {!links || links.length === 0 ? (
        <EmptyState
          icon={Link2}
          title="No affiliate links"
          description="Add affiliate links to track and manage your monetization partners."
          action={
            <Button onClick={() => setDialogOpen(true)} data-testid="button-add-first-link">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Link
            </Button>
          }
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Affiliate Links ({links.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Anchor Text</TableHead>
                  <TableHead>Placement</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((link) => (
                  <TableRow key={link.id} data-testid={`row-link-${link.id}`}>
                    <TableCell className="font-medium">{link.provider}</TableCell>
                    <TableCell>{link.anchor}</TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">{link.placement || "-"}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyToClipboard(link.url)}
                          data-testid={`button-copy-${link.id}`}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={link.url} target="_blank" rel="noopener noreferrer" data-testid={`link-open-${link.id}`}>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteMutation.mutate(link.id)}
                          data-testid={`button-delete-${link.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
