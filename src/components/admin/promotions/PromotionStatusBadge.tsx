import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const labels = {
  DRAFT: "Borrador",
  PUBLISHED: "Publicada",
  ARCHIVED: "Archivada",
} as const;

export function PromotionStatusBadge({
  status,
  className,
}: {
  status: keyof typeof labels;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium",
        status === "DRAFT" &&
          "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
        status === "PUBLISHED" &&
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
        status === "ARCHIVED" &&
          "border-border bg-muted text-muted-foreground",
        className
      )}
    >
      {labels[status]}
    </Badge>
  );
}
