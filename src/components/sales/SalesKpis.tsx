import {
  CheckCircle2,
  Clock3,
  ListChecks,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { SaleKpis } from "@/components/sales/types";

export default function SalesKpis({ kpis }: { kpis: SaleKpis }) {
  const items: Array<{
    icon: LucideIcon;
    label: string;
    value: number;
  }> = [
    { icon: ListChecks, label: "Total", value: kpis.total },
    { icon: CheckCircle2, label: "Instaladas", value: kpis.installed },
    { icon: Clock3, label: "Pendientes", value: kpis.pending },
    { icon: XCircle, label: "Rechazadas", value: kpis.rejected },
  ];

  return (
    <section aria-label="Indicadores de ventas" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-lg border border-white/10 bg-white/[0.07] p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
              {item.label}
            </p>
            <item.icon className="size-4 text-[#FFB4AC]" aria-hidden="true" />
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {item.value}
          </p>
        </article>
      ))}
    </section>
  );
}
