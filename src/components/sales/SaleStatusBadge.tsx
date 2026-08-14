import { Badge } from "@/components/ui/badge";
import {
  SALE_STATUS_LABELS,
  type SaleStatusValue,
} from "@/lib/sale-status";
import { cn } from "@/lib/utils";

const statusClasses: Record<SaleStatusValue, string> = {
  PENDIENTE: "border-amber-300/25 bg-amber-300/10 text-amber-800 dark:text-amber-100",
  INSTALADA: "border-emerald-300/25 bg-emerald-300/10 text-emerald-700 dark:text-emerald-100",
  RECHAZADA: "border-red-300/25 bg-red-300/10 text-red-700 dark:text-red-100",
};

export default function SaleStatusBadge({
  status,
}: {
  status: SaleStatusValue;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("h-6 rounded-md", statusClasses[status])}
    >
      {SALE_STATUS_LABELS[status]}
    </Badge>
  );
}
