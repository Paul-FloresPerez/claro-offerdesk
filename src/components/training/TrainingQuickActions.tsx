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
  { href: "/promociones", label: "Promociones", icon: PackageCheck },
  { href: "/top-ventas", label: "Top Ventas", icon: Trophy },
  { href: "/guion", label: "Guion Comercial", icon: FileText },
];

export function TrainingQuickActions() {
  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
      <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-brand-emphasis">
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
    <div className="flex min-h-12 items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-2">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary text-xs font-black text-primary-foreground">
        {index}
      </span>
      <Icon className="h-4 w-4 shrink-0 text-brand-emphasis" />
      <span className="text-sm font-semibold leading-5 text-foreground">
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
      className="inline-flex h-11 items-center gap-2 rounded-lg border border-border bg-accent px-3 text-sm font-semibold text-foreground shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition hover:border-primary/45 hover:bg-primary/18"
    >
      <Icon className="h-4 w-4 text-brand-emphasis" />
      {label}
    </Link>
  );
}
