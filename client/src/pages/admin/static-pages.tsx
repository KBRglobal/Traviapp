import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileText, Plus, Trash2, Edit2, Save, Lightbulb, Eye, Globe
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StaticPage {
  id: string;
  slug: string;
  title: string;
  titleHe: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  content: string | null;
  contentHe: string | null;
  isActive: boolean;
  showInFooter: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function StaticPagesPage() {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingPage, setEditingPage] = useState<StaticPage | null>(null);
  const [newPage, setNewPage] = useState({
    slug: "",
    title: "",
    titleHe: "",
    metaTitle: "",
    metaDescription: "",
    content: "",
    contentHe: "",
    showInFooter: false,
  });

  const { data: pages, isLoading } = useQuery<StaticPage[]>({
    queryKey: ["/api/site-config/pages"],
  });

  const createPageMutation = useMutation({
    mutationFn: async (data: Partial<StaticPage>) => {
      return apiRequest("POST", "/api/site-config/pages", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-config/pages"] });
      toast({ title: "Page created" });
      setShowCreateDialog(false);
      setNewPage({ slug: "", title: "", titleHe: "", metaTitle: "", metaDescription: "", content: "", contentHe: "", showInFooter: false });
    },
  });

  const updatePageMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<StaticPage> }) => {
      return apiRequest("PUT", `/api/site-config/pages/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-config/pages"] });
      toast({ title: "Page updated" });
      setEditingPage(null);
    },
  });

  const deletePageMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/site-config/pages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-config/pages"] });
      toast({ title: "Page deleted" });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          Static Pages
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage static pages like Terms of Service, Privacy Policy, About, and Contact
        </p>
        
        <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
          <h3 className="font-medium flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            איך זה עובד / How It Works
          </h3>
          <p className="text-sm text-muted-foreground mb-2" dir="rtl">
            דפים סטטיים הם דפי מידע קבועים כמו תנאי שימוש, מדיניות פרטיות, אודות ויצירת קשר.
            ניתן לערוך את התוכן בעברית ובאנגלית ולקבוע אם הדף יופיע בפוטר.
          </p>
          <p className="text-sm text-muted-foreground">
            Static pages are fixed information pages like Terms of Service, Privacy Policy, About, and Contact.
            You can edit content in both Hebrew and English and choose whether to show them in the footer.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setShowCreateDialog(true)} data-testid="button-create-page">
          <Plus className="h-4 w-4 mr-2" />
          Create Page
        </Button>
      </div>

      {(!pages || pages.length === 0) ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">No Static Pages</h3>
            <p className="text-muted-foreground mb-4">
              Create pages like Terms of Service, Privacy Policy, etc.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => (
            <Card key={page.id} className="hover-elevate">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{page.title}</CardTitle>
                  <div className="flex items-center gap-1">
                    {page.isActive ? (
                      <Badge className="bg-green-500/10 text-green-600">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </div>
                </div>
                {page.titleHe && (
                  <p className="text-sm text-muted-foreground" dir="rtl">{page.titleHe}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    <span>/{page.slug}</span>
                  </div>
                  {page.showInFooter && (
                    <Badge variant="outline">Shows in footer</Badge>
                  )}
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingPage(page)}
                      data-testid={`button-edit-page-${page.slug}`}
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deletePageMutation.mutate(page.id)}
                      data-testid={`button-delete-page-${page.slug}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Static Page</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Slug (URL path)</Label>
                <Input
                  placeholder="privacy-policy"
                  value={newPage.slug}
                  onChange={(e) => setNewPage({ ...newPage, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  data-testid="input-page-slug"
                />
              </div>
              <div className="flex items-end gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={newPage.showInFooter}
                    onCheckedChange={(checked) => setNewPage({ ...newPage, showInFooter: checked })}
                  />
                  <Label>Show in footer</Label>
                </div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Title (English)</Label>
                <Input
                  placeholder="Privacy Policy"
                  value={newPage.title}
                  onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                  data-testid="input-page-title"
                />
              </div>
              <div className="space-y-2">
                <Label>Title (Hebrew)</Label>
                <Input
                  placeholder="מדיניות פרטיות"
                  value={newPage.titleHe}
                  onChange={(e) => setNewPage({ ...newPage, titleHe: e.target.value })}
                  dir="rtl"
                  data-testid="input-page-title-he"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Meta Title</Label>
              <Input
                placeholder="Privacy Policy | Travi Dubai"
                value={newPage.metaTitle}
                onChange={(e) => setNewPage({ ...newPage, metaTitle: e.target.value })}
                data-testid="input-page-meta-title"
              />
            </div>
            <div className="space-y-2">
              <Label>Meta Description</Label>
              <Textarea
                placeholder="Read our privacy policy..."
                value={newPage.metaDescription}
                onChange={(e) => setNewPage({ ...newPage, metaDescription: e.target.value })}
                rows={2}
                data-testid="input-page-meta-desc"
              />
            </div>
            <Tabs defaultValue="en">
              <TabsList>
                <TabsTrigger value="en">Content (English)</TabsTrigger>
                <TabsTrigger value="he">Content (Hebrew)</TabsTrigger>
              </TabsList>
              <TabsContent value="en">
                <Textarea
                  placeholder="Page content in English..."
                  value={newPage.content}
                  onChange={(e) => setNewPage({ ...newPage, content: e.target.value })}
                  rows={8}
                  data-testid="input-page-content"
                />
              </TabsContent>
              <TabsContent value="he">
                <Textarea
                  placeholder="תוכן הדף בעברית..."
                  value={newPage.contentHe}
                  onChange={(e) => setNewPage({ ...newPage, contentHe: e.target.value })}
                  rows={8}
                  dir="rtl"
                  data-testid="input-page-content-he"
                />
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button onClick={() => createPageMutation.mutate(newPage)} disabled={createPageMutation.isPending} data-testid="button-save-page">
              <Save className="h-4 w-4 mr-2" />
              Create Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingPage} onOpenChange={() => setEditingPage(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Page: {editingPage?.title}</DialogTitle>
          </DialogHeader>
          {editingPage && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input
                    value={editingPage.slug}
                    onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                  />
                </div>
                <div className="flex items-end gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={editingPage.isActive}
                      onCheckedChange={(checked) => setEditingPage({ ...editingPage, isActive: checked })}
                    />
                    <Label>Active</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={editingPage.showInFooter}
                      onCheckedChange={(checked) => setEditingPage({ ...editingPage, showInFooter: checked })}
                    />
                    <Label>Footer</Label>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title (English)</Label>
                  <Input
                    value={editingPage.title}
                    onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title (Hebrew)</Label>
                  <Input
                    value={editingPage.titleHe || ""}
                    onChange={(e) => setEditingPage({ ...editingPage, titleHe: e.target.value })}
                    dir="rtl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input
                  value={editingPage.metaTitle || ""}
                  onChange={(e) => setEditingPage({ ...editingPage, metaTitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  value={editingPage.metaDescription || ""}
                  onChange={(e) => setEditingPage({ ...editingPage, metaDescription: e.target.value })}
                  rows={2}
                />
              </div>
              <Tabs defaultValue="en">
                <TabsList>
                  <TabsTrigger value="en">Content (English)</TabsTrigger>
                  <TabsTrigger value="he">Content (Hebrew)</TabsTrigger>
                </TabsList>
                <TabsContent value="en">
                  <Textarea
                    value={editingPage.content || ""}
                    onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                    rows={10}
                  />
                </TabsContent>
                <TabsContent value="he">
                  <Textarea
                    value={editingPage.contentHe || ""}
                    onChange={(e) => setEditingPage({ ...editingPage, contentHe: e.target.value })}
                    rows={10}
                    dir="rtl"
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPage(null)}>Cancel</Button>
            <Button
              onClick={() => editingPage && updatePageMutation.mutate({ id: editingPage.id, data: editingPage })}
              disabled={updatePageMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
