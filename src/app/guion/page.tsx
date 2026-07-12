import {
  CheckCircle2,
  ClipboardCheck,
  Handshake,
  MessageCircle,
  PhoneCall,
  SearchCheck,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { guiones, type GuionBloque } from "@/data/guiones";

const stepIcons: Record<string, LucideIcon> = {
  Apertura: PhoneCall,
  Diagnóstico: SearchCheck,
  "Presentación de oferta": MessageCircle,
  Validación: ShieldCheck,
  Cierre: Handshake,
};

const stepAnchors: Record<string, string> = {
  Apertura: "guion-apertura",
  Diagnóstico: "guion-diagnostico",
  "Presentación de oferta": "guion-oferta",
  Validación: "guion-validacion",
  Cierre: "guion-cierre",
};

const quickAccess = [
  { href: "#guion-apertura", label: "Speech inicial" },
  { href: "#guion-diagnostico", label: "Detección de necesidad" },
  { href: "#guion-oferta", label: "Beneficios clave" },
  { href: "/objeciones#respuesta-cobertura", label: "Cobertura" },
  { href: "/objeciones#respuesta-precio", label: "Precio" },
  { href: "/objeciones#respuesta-variacion", label: "Variación" },
  { href: "#guion-cierre", label: "Cierre" },
  { href: "/objeciones", label: "Respuestas rápidas" },
];

export default function GuionPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Atención comercial"
        title="Guion Comercial"
        description="Secuencia sugerida para abrir, diagnosticar, ofrecer y cerrar."
        tone="dark"
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <nav
          aria-label="Accesos rápidos del guion"
          className="mb-5 rounded-xl border border-white/10 bg-[#172033]/92 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.18)]"
        >
          <p className="px-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#FFB4AC]">
            Navegación operativa
          </p>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {quickAccess.map((access) => (
              <Link
                key={access.label}
                href={access.href}
                className="inline-flex h-9 shrink-0 items-center rounded-full border border-white/10 bg-white/[0.06] px-3 text-sm font-semibold text-slate-100 transition hover:border-[#DA291C]/40 hover:bg-[#DA291C]/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB4AC]"
              >
                {access.label}
              </Link>
            ))}
          </div>
        </nav>

        <section className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3">
          {guiones.map((bloque, index) => (
            <StepCard
              key={bloque.etapa}
              bloque={bloque}
              index={index}
              icon={stepIcons[bloque.etapa] ?? ClipboardCheck}
            />
          ))}
        </section>
      </div>
    </main>
  );
}

function StepCard({
  bloque,
  icon: Icon,
  index,
}: {
  bloque: GuionBloque;
  icon: LucideIcon;
  index: number;
}) {
  return (
    <article
      id={stepAnchors[bloque.etapa]}
      className="group flex h-full scroll-mt-28 flex-col rounded-xl border border-white/70 bg-white p-4 text-[#111827] shadow-[0_14px_34px_rgba(0,0,0,0.18)] transition duration-200 hover:border-[#DA291C]/30 hover:shadow-[0_18px_42px_rgba(0,0,0,0.22)]"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <span className="inline-flex h-7 items-center rounded-md border border-red-100 bg-red-50 px-2 text-xs font-bold text-[#DA291C]">
            Paso {index + 1}
          </span>
          <h2 className="mt-2 text-lg font-semibold tracking-tight text-[#111827]">
            {bloque.etapa}
          </h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {bloque.objetivo}
          </p>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#DA291C]/10 text-[#DA291C]">
          <Icon className="h-5 w-5" />
        </span>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-sm font-medium leading-5 text-slate-800">
          {bloque.texto}
        </p>
      </div>

      <ul className="mt-3 space-y-2">
        {bloque.puntosClave.map((punto) => (
          <li key={punto} className="flex gap-2 text-sm leading-5 text-slate-600">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <span>{punto}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
