import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Image as ImageIcon,
  Sparkles,
  Check,
  Loader2,
  ThumbsUp,
  Grid3X3,
  Wand2,
  X,
} from "lucide-react";
import type { AiGeneratedImage } from "@shared/schema";

interface ImageEnginePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (image: { url: string; altText?: string; caption?: string }) => void;
  aspectRatio?: "square" | "landscape" | "portrait";
}

interface LibraryResponse {
  images: AiGeneratedImage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface KeywordsData {
  categories: Record<string, { topics: string[] }>;
  allTopics: string[];
  imageTypes: string[];
}

export function ImageEnginePicker({ open, onOpenChange, onSelect, aspectRatio = "landscape" }: ImageEnginePickerProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("library");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterApproved, setFilterApproved] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedImageType, setSelectedImageType] = useState(aspectRatio === "square" ? "thumbnail" : "hero");

  const { data: libraryData, isLoading: libraryLoading } = useQuery<LibraryResponse>({
    queryKey: ["/api/image-engine/library", { 
      search: searchQuery || undefined,
      approved: filterApproved ? "true" : undefined,
    }],
    enabled: open,
  });

  const { data: keywordsData } = useQuery<KeywordsData>({
    queryKey: ["/api/image-engine/keywords"],
    enabled: open && activeTab === "generate",
  });

  const generateMutation = useMutation({
    mutationFn: async (data: { topic: string; imageType: string; category: string }) => {
      const res = await apiRequest("POST", "/api/image-engine/generate", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Image generated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/image-engine/library"] });
      if (data?.image) {
        onSelect({
          url: data.image.url,
          altText: data.image.altText,
          caption: data.image.caption,
        });
        onOpenChange(false);
      }
    },
    onError: (error: Error) => {
      toast({ title: "Generation failed", description: error.message, variant: "destructive" });
    },
  });

  const handleSelectImage = (image: AiGeneratedImage) => {
    onSelect({
      url: image.url,
      altText: image.altText || undefined,
      caption: image.caption || undefined,
    });
    onOpenChange(false);
  };

  const handleGenerate = () => {
    if (!selectedTopic) {
      toast({ title: "Please select a topic", variant: "destructive" });
      return;
    }
    generateMutation.mutate({
      topic: selectedTopic,
      imageType: selectedImageType,
      category: selectedCategory || "general",
    });
  };

  const categories = keywordsData?.categories ? Object.keys(keywordsData.categories) : [];
  const topics = selectedCategory && keywordsData?.categories?.[selectedCategory]?.topics || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Select Image from Library
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="library" className="gap-2" data-testid="picker-tab-library">
              <Grid3X3 className="h-4 w-4" />
              Library
            </TabsTrigger>
            <TabsTrigger value="generate" className="gap-2" data-testid="picker-tab-generate">
              <Wand2 className="h-4 w-4" />
              Generate New
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="flex-1 flex flex-col overflow-hidden mt-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-testid="picker-input-search"
                />
              </div>
              <Button
                variant={filterApproved ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterApproved(!filterApproved)}
                data-testid="picker-button-filter-approved"
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Approved Only
              </Button>
            </div>

            <ScrollArea className="flex-1">
              {libraryLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : !libraryData?.images?.length ? (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mb-4 opacity-50" />
                  <p>No images found</p>
                  <Button 
                    variant="ghost" 
                    onClick={() => setActiveTab("generate")}
                    className="mt-2"
                  >
                    Generate a new image
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {libraryData.images.map((image) => (
                    <Card
                      key={image.id}
                      className="cursor-pointer overflow-hidden group"
                      onClick={() => handleSelectImage(image)}
                      data-testid={`picker-image-${image.id}`}
                    >
                      <div className="aspect-square relative">
                        <img
                          src={image.url}
                          alt={image.altText || image.topic}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Check className="h-8 w-8 text-white" />
                        </div>
                        {image.isApproved && (
                          <Badge className="absolute top-1 right-1 bg-green-500 text-xs px-1">
                            <Check className="h-3 w-3" />
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-2">
                        <p className="text-xs font-medium truncate">{image.topic}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="generate" className="flex-1 flex flex-col overflow-hidden mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(v) => {
                      setSelectedCategory(v);
                      setSelectedTopic("");
                    }}
                  >
                    <SelectTrigger data-testid="picker-select-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Image Type</Label>
                  <Select value={selectedImageType} onValueChange={setSelectedImageType}>
                    <SelectTrigger data-testid="picker-select-image-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(keywordsData?.imageTypes || ["hero", "thumbnail", "gallery", "banner"]).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedCategory && (
                <div className="space-y-2">
                  <Label>Topic</Label>
                  <ScrollArea className="h-40 border rounded-md p-2">
                    <div className="flex flex-wrap gap-2">
                      {topics.slice(0, 40).map((topic) => (
                        <Badge
                          key={topic}
                          variant={selectedTopic === topic ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => setSelectedTopic(topic)}
                          data-testid={`picker-topic-${topic.replace(/\s+/g, "-").toLowerCase()}`}
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              {selectedTopic && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Selected:</p>
                  <p className="font-medium">{selectedTopic}</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            data-testid="picker-button-cancel"
          >
            Cancel
          </Button>
          {activeTab === "generate" && (
            <Button
              onClick={handleGenerate}
              disabled={!selectedTopic || generateMutation.isPending}
              data-testid="picker-button-generate"
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Image
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ImageEnginePicker;
