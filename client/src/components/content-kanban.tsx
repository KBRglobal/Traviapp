import { useState, useCallback, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  MapPin,
  Building2,
  FileText,
  Utensils,
  CalendarDays,
  GripVertical,
  Eye,
  Edit2,
  ExternalLink,
  Clock,
  FileCheck,
  CheckCircle,
  Rocket,
  Globe,
} from "lucide-react";
import type { ContentWithRelations } from "@shared/schema";

// Status columns configuration
const STATUS_COLUMNS = [
  { id: "draft", label: "Draft", icon: FileCheck, color: "bg-slate-100 border-slate-200", headerBg: "bg-slate-50" },
  { id: "in_review", label: "In Review", icon: Clock, color: "bg-yellow-100 border-yellow-200", headerBg: "bg-yellow-50" },
  { id: "approved", label: "Approved", icon: CheckCircle, color: "bg-blue-100 border-blue-200", headerBg: "bg-blue-50" },
  { id: "scheduled", label: "Scheduled", icon: CalendarDays, color: "bg-indigo-100 border-indigo-200", headerBg: "bg-indigo-50" },
  { id: "published", label: "Published", icon: Globe, color: "bg-green-100 border-green-200", headerBg: "bg-green-50" },
];

// Content type icons
const contentTypeIcons: Record<string, React.ElementType> = {
  attraction: MapPin,
  hotel: Building2,
  article: FileText,
  dining: Utensils,
  event: CalendarDays,
};

const contentTypeColors: Record<string, string> = {
  attraction: "text-blue-600 bg-blue-50",
  hotel: "text-purple-600 bg-purple-50",
  article: "text-green-600 bg-green-50",
  dining: "text-orange-600 bg-orange-50",
  event: "text-pink-600 bg-pink-50",
};

interface ContentKanbanProps {
  contents: ContentWithRelations[];
  type: string;
  basePath: string;
}

export function ContentKanban({ contents, type, basePath }: ContentKanbanProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [draggedItem, setDraggedItem] = useState<ContentWithRelations | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);

  // Group contents by status
  const contentsByStatus = useMemo(() => {
    const grouped: Record<string, ContentWithRelations[]> = {};
    STATUS_COLUMNS.forEach((col) => {
      grouped[col.id] = contents.filter((c) => c.status === col.id);
    });
    return grouped;
  }, [contents]);

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PATCH", `/api/contents/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/contents?type=${type}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/contents"] });
      toast({
        title: "Status updated",
        description: "Content status has been changed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    },
  });

  // Drag handlers
  const handleDragStart = useCallback((e: React.DragEvent, item: ContentWithRelations) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", item.id);

    // Add dragging class after a tiny delay to allow the drag image to be captured
    requestAnimationFrame(() => {
      (e.target as HTMLElement).classList.add("opacity-50");
    });
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setDraggedItem(null);
    setDragOverColumn(null);
    (e.target as HTMLElement).classList.remove("opacity-50");
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Only reset if leaving the column area (not entering a child)
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      setDragOverColumn(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (draggedItem && draggedItem.status !== newStatus) {
      updateStatusMutation.mutate({ id: draggedItem.id, status: newStatus });
    }
    setDraggedItem(null);
  }, [draggedItem, updateStatusMutation]);

  // Navigate to edit
  const handleEdit = (item: ContentWithRelations) => {
    navigate(`${basePath}/${item.id}`);
  };

  // Preview content
  const handlePreview = (item: ContentWithRelations) => {
    const pathMap: Record<string, string> = {
      attraction: "attractions",
      hotel: "hotels",
      article: "articles",
      dining: "dining",
      district: "districts",
      transport: "transport",
      event: "events",
      itinerary: "itineraries",
    };
    window.open(`/${pathMap[type] || type}/${item.slug}`, "_blank");
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {STATUS_COLUMNS.map((column) => {
        const columnContents = contentsByStatus[column.id] || [];
        const Icon = column.icon;
        const isDropTarget = dragOverColumn === column.id && draggedItem?.status !== column.id;

        return (
          <div
            key={column.id}
            className={`flex-shrink-0 w-[280px] rounded-lg border ${column.color} transition-all ${
              isDropTarget ? "ring-2 ring-primary ring-offset-2" : ""
            }`}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className={`px-3 py-2 border-b ${column.headerBg} rounded-t-lg`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{column.label}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {columnContents.length}
                </Badge>
              </div>
            </div>

            {/* Column Content */}
            <ScrollArea className="h-[calc(100vh-280px)] min-h-[400px]">
              <div className="p-2 space-y-2">
                {columnContents.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No items
                  </div>
                ) : (
                  columnContents.map((item) => {
                    const TypeIcon = contentTypeIcons[item.type] || FileText;
                    const typeColor = contentTypeColors[item.type] || "text-gray-600 bg-gray-50";

                    return (
                      <Card
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        onDragEnd={handleDragEnd}
                        className={`cursor-grab active:cursor-grabbing transition-all hover:shadow-md ${
                          draggedItem?.id === item.id ? "opacity-50" : ""
                        }`}
                      >
                        <CardContent className="p-3">
                          {/* Drag Handle + Type Icon */}
                          <div className="flex items-start gap-2 mb-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                            <div className={`p-1 rounded ${typeColor} shrink-0`}>
                              <TypeIcon className="h-3 w-3" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm leading-tight line-clamp-2">
                                {item.title}
                              </h4>
                            </div>
                          </div>

                          {/* Meta Info */}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <span>/{item.slug?.slice(0, 20)}{item.slug && item.slug.length > 20 ? "..." : ""}</span>
                          </div>

                          {/* Stats Row */}
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                            {item.wordCount && (
                              <span>{item.wordCount} words</span>
                            )}
                            {item.seoScore !== null && item.seoScore !== undefined && (
                              <span className={`font-medium ${
                                item.seoScore >= 80 ? "text-green-600" :
                                item.seoScore >= 60 ? "text-yellow-600" :
                                "text-red-600"
                              }`}>
                                SEO: {item.seoScore}
                              </span>
                            )}
                          </div>

                          {/* Updated Date */}
                          {item.updatedAt && (
                            <div className="text-xs text-muted-foreground mb-2">
                              Updated {new Date(item.updatedAt).toLocaleDateString()}
                            </div>
                          )}

                          {/* Scheduled Date */}
                          {item.status === "scheduled" && item.scheduledAt && (
                            <div className="flex items-center gap-1 text-xs text-indigo-600 mb-2">
                              <Clock className="h-3 w-3" />
                              {new Date(item.scheduledAt).toLocaleString()}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-1 pt-2 border-t">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0"
                                  onClick={() => handleEdit(item)}
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0"
                                  onClick={() => handlePreview(item)}
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Preview</TooltipContent>
                            </Tooltip>

                            {item.viewCount != null && item.viewCount > 0 && (
                              <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                                <Eye className="h-3 w-3" />
                                {item.viewCount}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>
        );
      })}
    </div>
  );
}
