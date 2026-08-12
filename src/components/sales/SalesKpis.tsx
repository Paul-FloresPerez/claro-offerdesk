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
    style: string;
  }> = [
    { icon: CheckCircle2, label: "Instaladas", value: kpis.installed, style: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" },
    { icon: Clock3, label: "Pendientes", value: kpis.pending, style: "border-amber-400/20 bg-amber-400/10 text-amber-300" },
    { icon: XCircle, label: "Rechazadas", value: kpis.rejected, style: "border-rose-400/20 bg-rose-400/10 text-rose-300" },
    { icon: ListChecks, label: "Total", value: kpis.total, style: "border-sky-400/20 bg-sky-400/10 text-sky-300" },
  ];

  return (
    <section aria-label="Indicadores de ventas" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-xl border border-white/10 bg-[#172033] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">
              {item.label}
            </p>
            <span className={`grid size-8 place-items-center rounded-lg border ${item.style}`}>
              <item.icon className="size-4" aria-hidden="true" />
            </span>
          </div>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {item.value}
          </p>
        </article>
      ))}
    </section>
  );
}
