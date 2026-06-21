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
import { PageHeader } from "@/components/common/PageHeader";
import { guiones, type GuionBloque } from "@/data/guiones";

const stepIcons: Record<string, LucideIcon> = {
  Apertura: PhoneCall,
  Diagnóstico: SearchCheck,
  "Presentación de oferta": MessageCircle,
  Validación: ShieldCheck,
  Cierre: Handshake,
};

export default function GuionPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Atención comercial"
        title="Guion de llamada"
        description="Secuencia sugerida para abrir, diagnosticar, ofrecer y cerrar."
        tone="dark"
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <section className="grid gap-5 lg:grid-cols-5">
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
    <article className="animate-fade-up group flex h-full flex-col rounded-lg border border-white/70 bg-white p-4 text-[#111827] shadow-[0_18px_42px_rgba(0,0,0,0.20)] transition duration-300 hover:-translate-y-1 hover:border-[#DA291C]/35 hover:shadow-[0_26px_60px_rgba(0,0,0,0.26)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <span className="inline-flex h-7 items-center rounded-md border border-red-100 bg-red-50 px-2 text-xs font-bold text-[#DA291C]">
            Paso {index + 1}
          </span>
          <h2 className="mt-3 text-lg font-semibold tracking-tight text-[#111827]">
            {bloque.etapa}
          </h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {bloque.objetivo}
          </p>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-[#DA291C]/10 text-[#DA291C] transition group-hover:scale-[1.03]">
          <Icon className="h-5 w-5" />
        </span>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-sm font-medium leading-6 text-slate-800">
          {bloque.texto}
        </p>
      </div>

      <ul className="mt-4 space-y-3">
        {bloque.puntosClave.map((punto) => (
          <li key={punto} className="flex gap-2 text-sm leading-6 text-slate-600">
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
            <span>{punto}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
