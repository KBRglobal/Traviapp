import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type Column, type Action } from "@/components/data-table";
import { StatusBadge } from "@/components/status-badge";
import { ContentTypeBadge } from "@/components/content-type-badge";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  Plus,
  Search,
  MapPin,
  Building2,
  FileText,
  Filter,
  X,
  UtensilsCrossed,
  Map,
  Train,
} from "lucide-react";
import type { ContentWithRelations } from "@shared/schema";

interface ContentListProps {
  type: "attraction" | "hotel" | "article" | "dining" | "district" | "transport";
}

const typeConfig = {
  attraction: {
    title: "Attractions",
    singular: "Attraction",
    icon: MapPin,
    basePath: "/admin/attractions",
    wordTarget: "~1950 words",
  },
  hotel: {
    title: "Hotels",
    singular: "Hotel",
    icon: Building2,
    basePath: "/admin/hotels",
    wordTarget: "~3000 words",
  },
  article: {
    title: "Articles",
    singular: "Article",
    icon: FileText,
    basePath: "/admin/articles",
    wordTarget: "~1200-2000 words",
  },
  dining: {
    title: "Dining",
    singular: "Restaurant",
    icon: UtensilsCrossed,
    basePath: "/admin/dining",
    wordTarget: "~1500 words",
  },
  district: {
    title: "Districts",
    singular: "District",
    icon: Map,
    basePath: "/admin/districts",
    wordTarget: "~2000 words",
  },
  transport: {
    title: "Transport",
    singular: "Transport",
    icon: Train,
    basePath: "/admin/transport",
    wordTarget: "~1200 words",
  },
};

export default function ContentList({ type }: ContentListProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const config = typeConfig[type];
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: contents, isLoading } = useQuery<ContentWithRelations[]>({
    queryKey: [`/api/contents?type=${type}`],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/contents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/contents?type=${type}`] });
      toast({
        title: "Content deleted",
        description: "The content has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete content. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredContents = contents?.filter((content) => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || content.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) ?? [];

  const columns: Column<ContentWithRelations>[] = [
    {
      key: "title",
      header: "Title",
      cell: (item) => (
        <div className="max-w-md">
          <div className="font-medium truncate">{item.title}</div>
          <div className="text-xs text-muted-foreground font-mono">/{item.slug}</div>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "wordCount",
      header: "Words",
      cell: (item) => (
        <span className="text-sm text-muted-foreground">{item.wordCount ?? 0}</span>
      ),
    },
    {
      key: "updatedAt",
      header: "Updated",
      cell: (item) => (
        <span className="text-sm text-muted-foreground">
          {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : "-"}
        </span>
      ),
    },
  ];

  const actions: Action<ContentWithRelations>[] = [
    {
      label: "Edit",
      onClick: (item) => navigate(`${config.basePath}/${item.id}`),
    },
    {
      label: "Preview",
      onClick: (item) => window.open(`/${type === "district" ? "districts" : type === "dining" ? "dining" : type === "transport" ? "transport" : type + "s"}/${item.slug}`, "_blank"),
    },
    {
      label: "Delete",
      onClick: (item) => {
        if (confirm("Are you sure you want to delete this content?")) {
          deleteMutation.mutate(item.id);
        }
      },
      variant: "destructive",
    },
  ];

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  const hasFilters = searchQuery || statusFilter !== "all";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{config.title}</h1>
          <p className="text-muted-foreground">
            Manage your {config.title.toLowerCase()} pages ({config.wordTarget})
          </p>
        </div>
        <Link href={`${config.basePath}/new`}>
          <Button data-testid={`button-new-${type}`}>
            <Plus className="h-4 w-4 mr-2" />
            New {config.singular}
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${config.title.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40" data-testid="select-status-filter">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
              {hasFilters && (
                <Button variant="ghost" size="icon" onClick={handleClearFilters} data-testid="button-clear-filters">
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-4 border-b last:border-0">
                  <Skeleton className="h-5 w-5" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </div>
          ) : filteredContents.length === 0 ? (
            <EmptyState
              icon={config.icon}
              title={`No ${config.title.toLowerCase()} found`}
              description={
                hasFilters
                  ? "Try adjusting your search or filters"
                  : `Create your first ${config.singular.toLowerCase()} to get started`
              }
              actionLabel={hasFilters ? "Clear filters" : `Create ${config.singular}`}
              onAction={hasFilters ? handleClearFilters : () => navigate(`${config.basePath}/new`)}
            />
          ) : (
            <DataTable
              data={filteredContents}
              columns={columns}
              actions={actions}
              selectable
              selectedIds={selectedIds}
              onSelectionChange={setSelectedIds}
              getItemId={(item) => item.id}
              pageSize={10}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
