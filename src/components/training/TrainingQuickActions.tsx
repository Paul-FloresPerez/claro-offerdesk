import {
  ClipboardCheck,
  FileText,
  Headphones,
  PackageCheck,
  PlayCircle,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

const routeSteps = [
  { label: "Mira el video", icon: PlayCircle },
  { label: "Escucha la llamada", icon: Headphones },
  { label: "Revisa promociones", icon: PackageCheck },
  { label: "Practica objeciones", icon: ClipboardCheck },
];

const quickActions = [
  { href: "/ofertas", label: "Promociones", icon: PackageCheck },
  { href: "/top-ventas", label: "Top Ventas", icon: Trophy },
  { href: "/guion", label: "Guion Comercial", icon: FileText },
];

export function TrainingQuickActions() {
  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
      <div className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#FFB4AC]">
          Ruta recomendada
        </p>
        <div className="grid gap-2 sm:grid-cols-4">
          {routeSteps.map((step, index) => (
            <StepPill
              key={step.label}
              index={index + 1}
              label={step.label}
              icon={step.icon}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 lg:justify-end">
        {quickActions.map((action) => (
          <QuickAction key={action.href} {...action} />
        ))}
      </div>
    </section>
  );
}

function StepPill({
  index,
  label,
  icon: Icon,
}: {
  index: number;
  label: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex min-h-12 items-center gap-2 rounded-lg border border-white/10 bg-[#111827]/50 px-3 py-2">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[#DA291C] text-xs font-black text-white">
        {index}
      </span>
      <Icon className="h-4 w-4 shrink-0 text-[#FFB4AC]" />
      <span className="text-sm font-semibold leading-5 text-slate-100">
        {label}
      </span>
    </div>
  );
}

function QuickAction({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
}) {
  return (
    <Link
      href={href}
      className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.08] px-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition hover:border-[#DA291C]/45 hover:bg-[#DA291C]/18"
    >
      <Icon className="h-4 w-4 text-[#FFB4AC]" />
      {label}
    </Link>
  );
}
