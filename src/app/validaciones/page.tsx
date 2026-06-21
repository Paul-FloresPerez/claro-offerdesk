import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  FileWarning,
  MapPinned,
  RadioTower,
  ShieldAlert,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { ofertas } from "@/data/ofertas";
import { validaciones, type ValidacionGrupo } from "@/data/validaciones";
import { cn } from "@/lib/utils";

const controlCards: {
  title: string;
  description: string;
  icon: LucideIcon;
  tone: "info" | "success" | "warning" | "critical";
}[] = [
  {
    title: "Cobertura",
    description: "Validar dirección exacta y revisar zonas oficiales cuando existan.",
    icon: MapPinned,
    tone: "info",
  },
  {
    title: "Tecnología disponible",
    description: "Confirmar HFC, HFC Plus, FTTH o móvil antes de ofrecer.",
    icon: RadioTower,
    tone: "warning",
  },
  {
    title: "Vigencia de campaña",
    description: "No inventar vigencias; si falta dato, marcar para validar.",
    icon: CalendarClock,
    tone: "critical",
  },
  {
    title: "Calificación del cliente",
    description: "Confirmar titular, datos requeridos y condiciones del flujo.",
    icon: UserCheck,
    tone: "success",
  },
  {
    title: "Condiciones especiales",
    description: "Informar restricciones y precio posterior cuando el material lo muestre.",
    icon: FileWarning,
    tone: "warning",
  },
];

const toneClass = {
  info: "border-slate-200 bg-slate-50 text-slate-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  warning: "border-yellow-200 bg-yellow-50 text-yellow-900",
  critical: "border-red-200 bg-red-50 text-[#7F1D1D]",
};

const severityClass = {
  critica: "border-red-200 bg-red-50 text-[#7F1D1D]",
  alerta: "border-yellow-200 bg-yellow-50 text-yellow-900",
  operativa: "border-emerald-200 bg-emerald-50 text-emerald-900",
};

export default function ValidacionesPage() {
  const offersWithZones = ofertas.filter(
    (oferta) => oferta.media.ciudades || oferta.id === "promo-1-sol"
  );

  return (
    <main>
      <PageHeader
        eyebrow="Control comercial"
        title="Validaciones antes de ofrecer"
        description="Reglas para evitar errores de cobertura, precio, vigencia, tecnología y condiciones antes de vender."
        tone="dark"
      />

      <div className="mx-auto max-w-7xl space-y-7 px-4 py-6 sm:px-6 lg:py-8">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {controlCards.map((card) => (
            <ControlCard key={card.title} {...card} />
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <SectionTitle
              eyebrow="Advertencias comerciales"
              title="Reglas operativas"
              description="Usar estas reglas antes de presentar o cerrar una campaña."
            />
            <div className="grid gap-4">
              {validaciones.map((grupo) => (
                <ValidationGroup key={grupo.titulo} grupo={grupo} />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <SectionTitle
              eyebrow="Coberturas / zonas"
              title="Acceso a material oficial"
              description="Las zonas se revisan desde la ficha y sus imágenes oficiales."
            />

            <div className="grid gap-4">
              {offersWithZones.map((oferta) => (
                <Link
                  key={oferta.id}
                  href={`/ofertas/${oferta.id}`}
                  className="group flex items-center justify-between gap-4 rounded-lg border border-white/70 bg-white p-4 text-[#111827] shadow-[0_18px_42px_rgba(0,0,0,0.20)] transition duration-300 hover:-translate-y-1 hover:border-[#DA291C]/35 hover:shadow-[0_26px_60px_rgba(0,0,0,0.26)]"
                  aria-label={`Abrir ficha de ${oferta.nombre} para revisar zonas oficiales`}
                >
                  <div className="flex items-start gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-red-50 text-[#DA291C]">
                      <MapPinned className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-[#111827]">
                        {oferta.nombre}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {oferta.media.ciudades
                          ? "Imagen de ciudades / zonas disponible en ficha."
                          : "Zonas indicadas dentro de la imagen principal."}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-[#DA291C] transition group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function ControlCard({
  description,
  icon: Icon,
  title,
  tone,
}: {
  description: string;
  icon: LucideIcon;
  title: string;
  tone: "info" | "success" | "warning" | "critical";
}) {
  return (
    <article
      className={cn(
        "animate-fade-up rounded-lg border p-4 shadow-[0_18px_42px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_56px_rgba(0,0,0,0.24)]",
        toneClass[tone]
      )}
    >
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-white/70">
          <Icon className="h-5 w-5" />
        </span>
        <h2 className="font-semibold">{title}</h2>
      </div>
      <p className="mt-3 text-sm leading-6">{description}</p>
    </article>
  );
}

function ValidationGroup({ grupo }: { grupo: ValidacionGrupo }) {
  const Icon =
    grupo.severidad === "critica"
      ? ShieldAlert
      : grupo.severidad === "alerta"
        ? AlertTriangle
        : CheckCircle2;

  return (
    <section
      className={cn(
        "animate-fade-up rounded-lg border p-4 shadow-[0_18px_42px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-0.5",
        severityClass[grupo.severidad]
      )}
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-white/70">
          <Icon className="h-5 w-5" />
        </span>
        <h2 className="font-semibold">{grupo.titulo}</h2>
      </div>

      <ul className="space-y-3">
        {grupo.reglas.map((regla) => (
          <li key={regla} className="flex gap-3 text-sm leading-6">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{regla}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SectionTitle({
  description,
  eyebrow,
  title,
}: {
  description: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#FFB4AC]">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-xl font-semibold text-white">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-slate-300">{description}</p>
    </div>
  );
}
