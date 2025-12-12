import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, FileText, UtensilsCrossed, Map, Train } from "lucide-react";
import { cn } from "@/lib/utils";

type ContentType = "attraction" | "hotel" | "article" | "dining" | "district" | "transport";

interface ContentTypeBadgeProps {
  type: ContentType;
  className?: string;
}

const typeConfig: Record<ContentType, { label: string; icon: typeof MapPin; className: string }> = {
  attraction: {
    label: "Attraction",
    icon: MapPin,
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  hotel: {
    label: "Hotel",
    icon: Building2,
    className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
  article: {
    label: "Article",
    icon: FileText,
    className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  dining: {
    label: "Dining",
    icon: UtensilsCrossed,
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  district: {
    label: "District",
    icon: Map,
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },
  transport: {
    label: "Transport",
    icon: Train,
    className: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  },
};

export function ContentTypeBadge({ type, className }: ContentTypeBadgeProps) {
  const config = typeConfig[type];
  const Icon = config.icon;
  
  return (
    <Badge
      variant="secondary"
      className={cn(config.className, "font-medium gap-1", className)}
      data-testid={`type-badge-${type}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
