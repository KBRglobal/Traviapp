import { Badge } from "@/components/ui/badge";
import { MapPin, Building2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type ContentType = "attraction" | "hotel" | "article";

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
