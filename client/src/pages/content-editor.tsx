import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/status-badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { usePermissions } from "@/hooks/use-permissions";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Save,
  Eye,
  Send,
  ArrowLeft,
  Plus,
  GripVertical,
  Trash2,
  Image,
  Type,
  HelpCircle,
  MousePointer,
  LayoutGrid,
  Star,
  Lightbulb,
  Monitor,
  Smartphone,
  X,
  Sparkles,
  Wand2,
  RefreshCw,
  Maximize2,
  Minimize2,
  Languages,
  Search,
  CheckCircle,
  BookOpen,
  Loader2,
  Zap,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import type { ContentWithRelations, ContentBlock } from "@shared/schema";

type ContentType = "attraction" | "hotel" | "article";

const blockTypes = [
  { type: "hero", label: "Hero Section", icon: Image },
  { type: "text", label: "Text Block", icon: Type },
  { type: "image", label: "Image", icon: Image },
  { type: "gallery", label: "Gallery", icon: LayoutGrid },
  { type: "faq", label: "FAQ", icon: HelpCircle },
  { type: "cta", label: "Call to Action", icon: MousePointer },
  { type: "info_grid", label: "Info Grid", icon: LayoutGrid },
  { type: "highlights", label: "Highlights", icon: Star },
  { type: "tips", label: "Tips", icon: Lightbulb },
] as const;

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export default function ContentEditor() {
  const [, attractionMatch] = useRoute("/admin/attractions/:id");
  const [, hotelMatch] = useRoute("/admin/hotels/:id");
  const [, articleMatch] = useRoute("/admin/articles/:id");
  const [, attractionNewMatch] = useRoute("/admin/attractions/new");
  const [, hotelNewMatch] = useRoute("/admin/hotels/new");
  const [, articleNewMatch] = useRoute("/admin/articles/new");
  // Also check dining, districts, transport
  const [, diningMatch] = useRoute("/admin/dining/:id");
  const [, diningNewMatch] = useRoute("/admin/dining/new");
  const [, districtMatch] = useRoute("/admin/districts/:id");
  const [, districtNewMatch] = useRoute("/admin/districts/new");
  const [, transportMatch] = useRoute("/admin/transport/:id");
  const [, transportNewMatch] = useRoute("/admin/transport/new");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { canPublish } = usePermissions();

  const isNew = !!(attractionNewMatch || hotelNewMatch || articleNewMatch || diningNewMatch || districtNewMatch || transportNewMatch);
  
  // Only set contentId if we're NOT on a /new route - the :id route also matches "new" as an id
  const contentId = isNew ? undefined : (attractionMatch?.id || hotelMatch?.id || articleMatch?.id || diningMatch?.id || districtMatch?.id || transportMatch?.id);
  
  // Determine content type based on route
  const getContentType = (): ContentType => {
    if (attractionMatch || attractionNewMatch) return "attraction";
    if (hotelMatch || hotelNewMatch) return "hotel";
    // Dining, districts, transport are treated as articles for now
    return "article";
  };
  const contentType: ContentType = getContentType();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [heroImageAlt, setHeroImageAlt] = useState("");
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [status, setStatus] = useState<string>("draft");
  const [activeTab, setActiveTab] = useState("content");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile" | null>(null);
  const [aiProcessingBlock, setAiProcessingBlock] = useState<string | null>(null);
  const [aiGenerateDialogOpen, setAiGenerateDialogOpen] = useState(false);
  const [aiGenerateInput, setAiGenerateInput] = useState("");

  const { data: content, isLoading } = useQuery<ContentWithRelations>({
    queryKey: [`/api/contents/${contentId}`],
    enabled: !!contentId,
  });

  useEffect(() => {
    if (content) {
      setTitle(content.title || "");
      setSlug(content.slug || "");
      setMetaTitle(content.metaTitle || "");
      setMetaDescription(content.metaDescription || "");
      setPrimaryKeyword(content.primaryKeyword || "");
      setHeroImage(content.heroImage || "");
      setHeroImageAlt(content.heroImageAlt || "");
      setBlocks(content.blocks || []);
      setStatus(content.status || "draft");
    }
  }, [content]);

  const saveMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      if (contentId) {
        const res = await apiRequest("PATCH", `/api/contents/${contentId}`, data);
        return res.json();
      } else {
        const res = await apiRequest("POST", "/api/contents", { ...data, type: contentType });
        return res.json();
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["/api/contents"] });
      queryClient.invalidateQueries({ queryKey: [`/api/contents?type=${contentType}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Saved successfully",
        description: "Your content has been saved.",
      });
      if (isNew && result?.id) {
        navigate(`/admin/${contentType}s/${result.id}`);
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const aiBlockMutation = useMutation({
    mutationFn: async (data: { blockId: string; action: string; content: string; targetLanguage?: string }) => {
      const res = await apiRequest("POST", "/api/ai/block-action", {
        action: data.action,
        content: data.content,
        context: primaryKeyword,
        targetLanguage: data.targetLanguage,
      });
      return res.json();
    },
    onSuccess: (result, variables) => {
      if (result.result) {
        updateBlock(variables.blockId, { content: result.result });
        toast({
          title: "AI Action Complete",
          description: `Content ${variables.action === "rewrite" ? "rewritten" : variables.action === "expand" ? "expanded" : variables.action === "shorten" ? "shortened" : variables.action === "translate" ? "translated" : variables.action === "seo_optimize" ? "SEO optimized" : variables.action === "improve_grammar" ? "grammar improved" : "updated"} successfully.`,
        });
      }
      setAiProcessingBlock(null);
    },
    onError: () => {
      toast({
        title: "AI Error",
        description: "Failed to process AI action. Please try again.",
        variant: "destructive",
      });
      setAiProcessingBlock(null);
    },
  });

  const handleAiAction = (blockId: string, action: string, content: string, targetLanguage?: string) => {
    if (!content.trim()) {
      toast({
        title: "No Content",
        description: "Please add some text before using AI actions.",
        variant: "destructive",
      });
      return;
    }
    setAiProcessingBlock(blockId);
    aiBlockMutation.mutate({ blockId, action, content, targetLanguage });
  };

  const aiGenerateMutation = useMutation({
    mutationFn: async (input: string) => {
      const endpoint = contentType === "hotel" 
        ? "/api/ai/generate-hotel" 
        : contentType === "attraction" 
        ? "/api/ai/generate-attraction" 
        : "/api/ai/generate-article";
      const body = contentType === "article" 
        ? { topic: input } 
        : { name: input };
      const res = await apiRequest("POST", endpoint, body);
      return res.json();
    },
    onSuccess: (result) => {
      if (result.content) {
        setTitle(result.content.title || "");
        setSlug(result.content.slug || "");
        setMetaTitle(result.content.metaTitle || "");
        setMetaDescription(result.content.metaDescription || "");
        setPrimaryKeyword(result.content.primaryKeyword || "");
        if (result.content.heroImage) {
          setHeroImage(result.content.heroImage);
        }
        setHeroImageAlt(result.content.heroImageAlt || "");
        setBlocks(Array.isArray(result.content.blocks) ? result.content.blocks : []);
      }
      setAiGenerateDialogOpen(false);
      setAiGenerateInput("");
      toast({
        title: "Content Generated",
        description: "AI has generated content for your page. Review and edit as needed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAiGenerate = () => {
    if (!aiGenerateInput.trim()) {
      toast({
        title: "Input Required",
        description: `Please enter a ${contentType === "article" ? "topic" : "name"} to generate content.`,
        variant: "destructive",
      });
      return;
    }
    aiGenerateMutation.mutate(aiGenerateInput);
  };

  const publishMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      if (contentId) {
        const res = await apiRequest("PATCH", `/api/contents/${contentId}`, data);
        return res.json();
      } else {
        const res = await apiRequest("POST", "/api/contents", { ...data, type: contentType });
        return res.json();
      }
    },
    onSuccess: (result) => {
      setStatus("published");
      queryClient.invalidateQueries({ queryKey: ["/api/contents"] });
      queryClient.invalidateQueries({ queryKey: [`/api/contents?type=${contentType}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Published Successfully",
        description: "Your content is now live.",
      });
      if (isNew && result?.id) {
        navigate(`/admin/${contentType}s/${result.id}`);
      }
    },
    onError: () => {
      toast({
        title: "Publish Failed",
        description: "Failed to publish content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePublishNow = () => {
    const wordCount = blocks.reduce((count, block) => {
      if (block.type === "text" && typeof block.data?.content === "string") {
        return count + block.data.content.split(/\s+/).filter(Boolean).length;
      }
      return count;
    }, 0);
    publishMutation.mutate({
      title,
      slug: slug || generateSlug(title),
      metaTitle,
      metaDescription,
      primaryKeyword,
      heroImage,
      heroImageAlt,
      blocks,
      wordCount,
      status: "published",
      publishedAt: new Date().toISOString(),
    });
  };

  const handleSave = () => {
    const wordCount = blocks.reduce((count, block) => {
      if (block.type === "text" && typeof block.data?.content === "string") {
        return count + block.data.content.split(/\s+/).filter(Boolean).length;
      }
      return count;
    }, 0);

    saveMutation.mutate({
      title,
      slug: slug || generateSlug(title),
      metaTitle,
      metaDescription,
      primaryKeyword,
      heroImage,
      heroImageAlt,
      blocks,
      wordCount,
      status,
    });
  };

  const addBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: generateId(),
      type,
      data: {},
      order: blocks.length,
    };
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id: string, data: Record<string, unknown>) => {
    setBlocks(blocks.map((b) => (b.id === id ? { ...b, data: { ...b.data, ...data } } : b)));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const newBlocks = [...blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < blocks.length) {
      [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
      setBlocks(newBlocks.map((b, i) => ({ ...b, order: i })));
    }
  };

  const wordCount = blocks.reduce((count, block) => {
    if (block.type === "text" && typeof block.data?.content === "string") {
      return count + block.data.content.split(/\s+/).filter(Boolean).length;
    }
    return count;
  }, 0);

  if (contentId && isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-20" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-64" />
            <Skeleton className="h-48" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (previewMode) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="flex items-center justify-between gap-4 p-4 border-b">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setPreviewMode(null)} data-testid="button-close-preview">
              <X className="h-4 w-4" />
            </Button>
            <span className="font-medium">Preview: {title || "Untitled"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={previewMode === "desktop" ? "default" : "outline"}
              size="sm"
              onClick={() => setPreviewMode("desktop")}
              data-testid="button-preview-desktop"
            >
              <Monitor className="h-4 w-4 mr-1" />
              Desktop
            </Button>
            <Button
              variant={previewMode === "mobile" ? "default" : "outline"}
              size="sm"
              onClick={() => setPreviewMode("mobile")}
              data-testid="button-preview-mobile"
            >
              <Smartphone className="h-4 w-4 mr-1" />
              Mobile
            </Button>
          </div>
        </div>
        <div className="flex justify-center p-8 bg-muted min-h-[calc(100vh-65px)] overflow-auto">
          <div
            className={`bg-background rounded-lg shadow-lg overflow-auto ${
              previewMode === "mobile" ? "w-[375px]" : "w-full max-w-4xl"
            }`}
          >
            <div className="p-6 space-y-6">
              {heroImage && (
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img src={heroImage} alt={heroImageAlt} className="w-full h-full object-cover" />
                </div>
              )}
              <h1 className="text-3xl font-bold">{title || "Untitled"}</h1>
              {blocks.map((block) => (
                <div key={block.id} className="prose max-w-none">
                  {block.type === "text" && <p>{String(block.data?.content || "")}</p>}
                  {block.type === "hero" && block.data?.image && (
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      <img src={String(block.data.image)} alt={String(block.data?.alt || "")} className="w-full h-full object-cover" />
                    </div>
                  )}
                  {block.type === "faq" && (
                    <div className="space-y-2">
                      <h3 className="font-semibold">{String(block.data?.question || "Question")}</h3>
                      <p className="text-muted-foreground">{String(block.data?.answer || "Answer")}</p>
                    </div>
                  )}
                  {block.type === "cta" && (
                    <Button>{String(block.data?.text || "Click here")}</Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/${contentType}s`)} data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">
              {isNew ? `New ${contentType.charAt(0).toUpperCase() + contentType.slice(1)}` : "Edit Content"}
            </h1>
            <p className="text-sm text-muted-foreground">{wordCount} words</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={status as "draft" | "in_review" | "approved" | "scheduled" | "published"} />
          <Button variant="outline" onClick={() => setAiGenerateDialogOpen(true)} data-testid="button-generate-ai">
            <Sparkles className="h-4 w-4 mr-2" />
            Generate with AI
          </Button>
          <Button variant="outline" onClick={() => setPreviewMode("desktop")} data-testid="button-preview">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" onClick={handleSave} disabled={saveMutation.isPending} data-testid="button-save-draft">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          {canPublish && (
            <Button variant="outline" onClick={handlePublishNow} disabled={publishMutation.isPending} data-testid="button-publish-now">
              {publishMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              {publishMutation.isPending ? "Publishing..." : "Publish Now"}
            </Button>
          )}
          <Button onClick={() => { setStatus("in_review"); handleSave(); }} disabled={saveMutation.isPending} data-testid="button-submit-review">
            <Send className="h-4 w-4 mr-2" />
            Submit for Review
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!slug || slug === generateSlug(title)) {
                      setSlug(generateSlug(e.target.value));
                    }
                  }}
                  placeholder="Enter title..."
                  data-testid="input-title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">/</span>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="url-slug"
                    className="font-mono text-sm"
                    data-testid="input-slug"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="heroImage">Hero Image URL</Label>
                  <Input
                    id="heroImage"
                    value={heroImage}
                    onChange={(e) => setHeroImage(e.target.value)}
                    placeholder="https://..."
                    data-testid="input-hero-image"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroImageAlt">Hero Image Alt Text</Label>
                  <Input
                    id="heroImageAlt"
                    value={heroImageAlt}
                    onChange={(e) => setHeroImageAlt(e.target.value)}
                    placeholder="Describe the image..."
                    data-testid="input-hero-alt"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-lg">Content Blocks</CardTitle>
              <Select onValueChange={(value) => addBlock(value as ContentBlock["type"])}>
                <SelectTrigger className="w-[180px]" data-testid="select-add-block">
                  <Plus className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Add block" />
                </SelectTrigger>
                <SelectContent>
                  {blockTypes.map((bt) => (
                    <SelectItem key={bt.type} value={bt.type} data-testid={`select-block-${bt.type}`}>
                      <div className="flex items-center gap-2">
                        <bt.icon className="h-4 w-4" />
                        {bt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              {blocks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  <LayoutGrid className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No blocks yet. Add your first content block above.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {blocks.map((block, index) => (
                    <div
                      key={block.id}
                      className="group flex gap-3 p-4 border rounded-lg bg-card"
                      data-testid={`block-${block.id}`}
                    >
                      <div className="flex flex-col items-center gap-1 pt-1">
                        <button
                          onClick={() => moveBlock(index, "up")}
                          disabled={index === 0}
                          className="p-1 rounded hover-elevate disabled:opacity-30"
                          data-testid={`button-move-up-${block.id}`}
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {blockTypes.find((bt) => bt.type === block.type)?.label || block.type}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeBlock(block.id)}
                            data-testid={`button-delete-${block.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        {block.type === "text" && (
                          <div className="space-y-2">
                            <Textarea
                              value={String(block.data?.content || "")}
                              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                              placeholder="Enter text content..."
                              className="min-h-[100px]"
                              data-testid={`textarea-${block.id}`}
                              disabled={aiProcessingBlock === block.id}
                            />
                            <div className="flex items-center gap-2">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={aiProcessingBlock === block.id}
                                    data-testid={`button-ai-actions-${block.id}`}
                                  >
                                    {aiProcessingBlock === block.id ? (
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                      <Wand2 className="h-4 w-4 mr-2" />
                                    )}
                                    AI Actions
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                  <DropdownMenuItem
                                    onClick={() => handleAiAction(block.id, "rewrite", String(block.data?.content || ""))}
                                    data-testid={`ai-rewrite-${block.id}`}
                                  >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Rewrite
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleAiAction(block.id, "expand", String(block.data?.content || ""))}
                                    data-testid={`ai-expand-${block.id}`}
                                  >
                                    <Maximize2 className="h-4 w-4 mr-2" />
                                    Expand
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleAiAction(block.id, "shorten", String(block.data?.content || ""))}
                                    data-testid={`ai-shorten-${block.id}`}
                                  >
                                    <Minimize2 className="h-4 w-4 mr-2" />
                                    Shorten
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleAiAction(block.id, "seo_optimize", String(block.data?.content || ""))}
                                    data-testid={`ai-seo-${block.id}`}
                                  >
                                    <Search className="h-4 w-4 mr-2" />
                                    SEO Optimize
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleAiAction(block.id, "improve_grammar", String(block.data?.content || ""))}
                                    data-testid={`ai-grammar-${block.id}`}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Improve Grammar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleAiAction(block.id, "add_examples", String(block.data?.content || ""))}
                                    data-testid={`ai-examples-${block.id}`}
                                  >
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    Add Examples
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuSub>
                                    <DropdownMenuSubTrigger data-testid={`ai-translate-trigger-${block.id}`}>
                                      <Languages className="h-4 w-4 mr-2" />
                                      Translate
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent>
                                      <DropdownMenuItem
                                        onClick={() => handleAiAction(block.id, "translate", String(block.data?.content || ""), "Arabic")}
                                        data-testid={`ai-translate-arabic-${block.id}`}
                                      >
                                        Arabic
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleAiAction(block.id, "translate", String(block.data?.content || ""), "French")}
                                        data-testid={`ai-translate-french-${block.id}`}
                                      >
                                        French
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleAiAction(block.id, "translate", String(block.data?.content || ""), "German")}
                                        data-testid={`ai-translate-german-${block.id}`}
                                      >
                                        German
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleAiAction(block.id, "translate", String(block.data?.content || ""), "Spanish")}
                                        data-testid={`ai-translate-spanish-${block.id}`}
                                      >
                                        Spanish
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleAiAction(block.id, "translate", String(block.data?.content || ""), "Chinese")}
                                        data-testid={`ai-translate-chinese-${block.id}`}
                                      >
                                        Chinese
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleAiAction(block.id, "translate", String(block.data?.content || ""), "Russian")}
                                        data-testid={`ai-translate-russian-${block.id}`}
                                      >
                                        Russian
                                      </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                  </DropdownMenuSub>
                                </DropdownMenuContent>
                              </DropdownMenu>
                              {aiProcessingBlock === block.id && (
                                <span className="text-sm text-muted-foreground">Processing...</span>
                              )}
                            </div>
                          </div>
                        )}
                        {block.type === "hero" && (
                          <div className="grid gap-3 sm:grid-cols-2">
                            <Input
                              value={String(block.data?.image || "")}
                              onChange={(e) => updateBlock(block.id, { image: e.target.value })}
                              placeholder="Image URL"
                              data-testid={`input-hero-${block.id}`}
                            />
                            <Input
                              value={String(block.data?.alt || "")}
                              onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
                              placeholder="Alt text"
                              data-testid={`input-alt-${block.id}`}
                            />
                          </div>
                        )}
                        {block.type === "faq" && (
                          <div className="space-y-3">
                            <Input
                              value={String(block.data?.question || "")}
                              onChange={(e) => updateBlock(block.id, { question: e.target.value })}
                              placeholder="Question"
                              data-testid={`input-question-${block.id}`}
                            />
                            <Textarea
                              value={String(block.data?.answer || "")}
                              onChange={(e) => updateBlock(block.id, { answer: e.target.value })}
                              placeholder="Answer"
                              data-testid={`textarea-answer-${block.id}`}
                            />
                          </div>
                        )}
                        {block.type === "cta" && (
                          <div className="grid gap-3 sm:grid-cols-2">
                            <Input
                              value={String(block.data?.text || "")}
                              onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                              placeholder="Button text"
                              data-testid={`input-cta-text-${block.id}`}
                            />
                            <Input
                              value={String(block.data?.url || "")}
                              onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                              placeholder="Button URL"
                              data-testid={`input-cta-url-${block.id}`}
                            />
                          </div>
                        )}
                        {(block.type === "image" || block.type === "gallery") && (
                          <div className="grid gap-3 sm:grid-cols-2">
                            <Input
                              value={String(block.data?.image || "")}
                              onChange={(e) => updateBlock(block.id, { image: e.target.value })}
                              placeholder="Image URL"
                              data-testid={`input-image-${block.id}`}
                            />
                            <Input
                              value={String(block.data?.alt || "")}
                              onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
                              placeholder="Alt text"
                              data-testid={`input-image-alt-${block.id}`}
                            />
                          </div>
                        )}
                        {(block.type === "info_grid" || block.type === "highlights" || block.type === "tips") && (
                          <Textarea
                            value={String(block.data?.content || "")}
                            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                            placeholder="Enter content (one item per line)..."
                            className="min-h-[80px]"
                            data-testid={`textarea-${block.id}`}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="content" className="flex-1" data-testid="tab-content">Content</TabsTrigger>
              <TabsTrigger value="seo" className="flex-1" data-testid="tab-seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger data-testid="select-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="in_review">In Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-2">
                  <CardTitle className="text-lg">AI Assist</CardTitle>
                  <Sparkles className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => setAiGenerateDialogOpen(true)}
                    disabled={aiGenerateMutation.isPending}
                    data-testid="button-ai-generate-sidebar"
                  >
                    {aiGenerateMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    {aiGenerateMutation.isPending ? "Generating..." : "Generate with AI"}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Generate complete {contentType} content including SEO metadata and content blocks.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Meta Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="metaTitle">Meta Title</Label>
                      <span className={`text-xs ${metaTitle.length > 60 ? "text-destructive" : "text-muted-foreground"}`}>
                        {metaTitle.length}/60
                      </span>
                    </div>
                    <Input
                      id="metaTitle"
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      placeholder="SEO title..."
                      data-testid="input-meta-title"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="metaDescription">Meta Description</Label>
                      <span className={`text-xs ${metaDescription.length > 155 ? "text-destructive" : "text-muted-foreground"}`}>
                        {metaDescription.length}/155
                      </span>
                    </div>
                    <Textarea
                      id="metaDescription"
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      placeholder="SEO description..."
                      data-testid="input-meta-description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primaryKeyword">Primary Keyword</Label>
                    <Input
                      id="primaryKeyword"
                      value={primaryKeyword}
                      onChange={(e) => setPrimaryKeyword(e.target.value)}
                      placeholder="Main keyword..."
                      data-testid="input-primary-keyword"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Search Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-3 rounded-lg bg-muted space-y-1">
                    <div className="text-blue-600 dark:text-blue-400 text-lg truncate">
                      {metaTitle || title || "Page Title"}
                    </div>
                    <div className="text-green-700 dark:text-green-500 text-sm font-mono truncate">
                      example.com/{slug || "page-url"}
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {metaDescription || "Meta description will appear here..."}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={aiGenerateDialogOpen} onOpenChange={setAiGenerateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate {contentType.charAt(0).toUpperCase() + contentType.slice(1)} with AI</DialogTitle>
            <DialogDescription>
              {contentType === "article" 
                ? "Enter a topic and AI will generate a complete article with SEO optimization."
                : `Enter the ${contentType} name and AI will generate complete content with SEO optimization.`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="ai-input">
                {contentType === "article" ? "Article Topic" : `${contentType.charAt(0).toUpperCase() + contentType.slice(1)} Name`}
              </Label>
              <Input
                id="ai-input"
                value={aiGenerateInput}
                onChange={(e) => setAiGenerateInput(e.target.value)}
                placeholder={contentType === "article" 
                  ? "e.g., Best Dubai beaches for families" 
                  : contentType === "hotel"
                  ? "e.g., Atlantis The Palm"
                  : "e.g., Burj Khalifa"}
                disabled={aiGenerateMutation.isPending}
                data-testid="input-ai-generate"
              />
            </div>
            {aiGenerateMutation.isPending && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating content... This may take 15-30 seconds.
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setAiGenerateDialogOpen(false)}
              disabled={aiGenerateMutation.isPending}
              data-testid="button-cancel-ai-generate"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAiGenerate}
              disabled={aiGenerateMutation.isPending || !aiGenerateInput.trim()}
              data-testid="button-confirm-ai-generate"
            >
              {aiGenerateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
