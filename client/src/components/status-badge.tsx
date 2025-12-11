import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ContentStatus = "draft" | "in_review" | "approved" | "scheduled" | "published";

interface StatusBadgeProps {
  status: ContentStatus;
  className?: string;
}

const statusConfig: Record<ContentStatus, { label: string; className: string }> = {
  draft: {
    label: "Draft",
    className: "bg-muted text-muted-foreground",
  },
  in_review: {
    label: "In Review",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  approved: {
    label: "Approved",
    className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  scheduled: {
    label: "Scheduled",
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  },
  published: {
    label: "Published",
    className: "bg-primary text-primary-foreground",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge
      variant="secondary"
      className={cn(config.className, "font-medium", className)}
      data-testid={`status-badge-${status}`}
    >
      {config.label}
    </Badge>
  );
}
