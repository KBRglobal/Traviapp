import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Link2,
  Search,
  MapPin,
  Building2,
  FileText,
  Utensils,
  CalendarDays,
  Plus,
  ExternalLink,
  Tag,
  Percent,
} from "lucide-react";
import type { ContentWithRelations } from "@shared/schema";

interface RelatedContentFinderProps {
  currentContentId?: string;
  currentTitle: string;
  currentType: string;
  currentTags?: Array<{ id: string; name: string }>;
  onInsertLink?: (url: string, title: string) => void;
}

const contentTypeIcons: Record<string, React.ElementType> = {
  attraction: MapPin,
  hotel: Building2,
  article: FileText,
  dining: Utensils,
  event: CalendarDays,
};

const contentTypeColors: Record<string, string> = {
  attraction: "bg-blue-100 text-blue-700",
  hotel: "bg-purple-100 text-purple-700",
  article: "bg-green-100 text-green-700",
  dining: "bg-orange-100 text-orange-700",
  event: "bg-pink-100 text-pink-700",
};

// Calculate relevance score between two contents
function calculateRelevance(
  content: ContentWithRelations,
  currentTitle: string,
  currentType: string,
  currentTags: Array<{ id: string; name: string }>
): number {
  let score = 0;

  // Same type bonus
  if (content.type === currentType) {
    score += 20;
  }

  // Tag overlap
  const contentTagIds = content.tags?.map((t) => t.id) || [];
  const currentTagIds = currentTags.map((t) => t.id);
  const tagOverlap = contentTagIds.filter((id) => currentTagIds.includes(id)).length;
  score += tagOverlap * 15;

  // Title word overlap
  const currentWords = currentTitle.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  const contentWords = (content.title || "").toLowerCase().split(/\s+/);
  const wordOverlap = currentWords.filter((w) => contentWords.includes(w)).length;
  score += wordOverlap * 10;

  // Published content bonus
  if (content.status === "published") {
    score += 10;
  }

  // High SEO score bonus
  if (content.seoScore && content.seoScore >= 70) {
    score += 5;
  }

  return Math.min(score, 100);
}

export function RelatedContentFinder({
  currentContentId,
  currentTitle,
  currentType,
  currentTags = [],
  onInsertLink,
}: RelatedContentFinderProps) {
  const [, navigate] = useLocation();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all content
  const { data: contents = [] } = useQuery<ContentWithRelations[]>({
    queryKey: ["/api/contents"],
  });

  // Calculate related content with relevance scores
  const relatedContent = useMemo(() => {
    return contents
      .filter((c) => c.id !== currentContentId && c.status === "published")
      .map((content) => ({
        ...content,
        relevance: calculateRelevance(content, currentTitle, currentType, currentTags),
      }))
      .filter((c) => {
        if (!searchQuery) return c.relevance > 0;
        const query = searchQuery.toLowerCase();
        return (
          c.title?.toLowerCase().includes(query) ||
          c.slug?.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 20);
  }, [contents, currentContentId, currentTitle, currentType, currentTags, searchQuery]);

  // Group by relevance
  const highRelevance = relatedContent.filter((c) => c.relevance >= 50);
  const mediumRelevance = relatedContent.filter(
    (c) => c.relevance >= 20 && c.relevance < 50
  );
  const lowRelevance = relatedContent.filter((c) => c.relevance < 20);

  const handleInsertLink = (content: ContentWithRelations) => {
    if (onInsertLink) {
      const pathMap: Record<string, string> = {
        attraction: "attractions",
        hotel: "hotels",
        article: "articles",
        dining: "dining",
        event: "events",
      };
      const url = `/${pathMap[content.type] || content.type}/${content.slug}`;
      onInsertLink(url, content.title || "");
    }
  };

  const handleViewContent = (content: ContentWithRelations) => {
    navigate(`/admin/${content.type}s/${content.id}`);
    setOpen(false);
  };

  const renderContentItem = (content: ContentWithRelations & { relevance: number }) => {
    const Icon = contentTypeIcons[content.type] || FileText;
    const colorClass = contentTypeColors[content.type] || "bg-gray-100 text-gray-700";

    return (
      <div
        key={content.id}
        className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${colorClass}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium truncate">{content.title}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              /{content.slug}
            </p>
            {content.tags && content.tags.length > 0 && (
              <div className="flex items-center gap-1 mt-2 flex-wrap">
                {content.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag.id} variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag.name}
                  </Badge>
                ))}
                {content.tags.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{content.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge
              variant="secondary"
              className={`text-xs ${
                content.relevance >= 50
                  ? "bg-green-100 text-green-700"
                  : content.relevance >= 20
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              <Percent className="h-3 w-3 mr-1" />
              {content.relevance}%
            </Badge>
            <div className="flex gap-1">
              {onInsertLink && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleInsertLink(content)}
                  title="Insert link"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleViewContent(content)}
                title="View content"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Link2 className="h-4 w-4" />
          Related Content
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[450px] sm:max-w-[450px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Related Content Finder
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Current Content Info */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Finding content related to:</p>
            <p className="text-sm font-medium">{currentTitle || "Untitled"}</p>
            {currentTags.length > 0 && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {currentTags.map((tag) => (
                  <Badge key={tag.id} variant="secondary" className="text-xs">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Results */}
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="space-y-4">
              {/* High Relevance */}
              {highRelevance.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    Highly Relevant ({highRelevance.length})
                  </h3>
                  <div className="space-y-2">
                    {highRelevance.map(renderContentItem)}
                  </div>
                </div>
              )}

              {/* Medium Relevance */}
              {mediumRelevance.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-yellow-700 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    Somewhat Related ({mediumRelevance.length})
                  </h3>
                  <div className="space-y-2">
                    {mediumRelevance.map(renderContentItem)}
                  </div>
                </div>
              )}

              {/* Low Relevance */}
              {lowRelevance.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-400" />
                    Other Content ({lowRelevance.length})
                  </h3>
                  <div className="space-y-2">
                    {lowRelevance.map(renderContentItem)}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {relatedContent.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Link2 className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No related content found</p>
                  <p className="text-xs mt-1">Try adding tags to find related content</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
