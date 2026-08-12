"use client";

import {
  BadgeDollarSign,
  CheckCircle2,
  ClipboardCheck,
  Handshake,
  MessageCircle,
  MessageSquareReply,
  PhoneCall,
  SearchCheck,
  ShieldCheck,
  ShieldQuestion,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { guiones, type GuionBloque } from "@/data/guiones";
import { objeciones, type Objecion } from "@/data/objeciones";

type GuideView = "guion" | "objeciones";

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

const groupIcons: Record<string, LucideIcon> = {
  Precio: BadgeDollarSign,
  Cobertura: Wifi,
  Competencia: SearchCheck,
  Dudas: ShieldQuestion,
  Validación: ClipboardCheck,
};

const groupStyles: Record<string, string> = {
  Precio: "border-red-300/20 bg-red-400/10 text-red-200",
  Cobertura: "border-sky-300/20 bg-sky-400/10 text-sky-200",
  Competencia: "border-violet-300/20 bg-violet-400/10 text-violet-200",
  Dudas: "border-amber-300/20 bg-amber-400/10 text-amber-200",
  Validación: "border-emerald-300/20 bg-emerald-400/10 text-emerald-200",
};

const groupAnchors: Record<string, string> = {
  Precio: "respuesta-precio",
  Cobertura: "respuesta-cobertura",
  Competencia: "respuesta-variacion",
  Dudas: "respuesta-dudas",
  Validación: "respuesta-validacion",
};

export function SalesCallGuide({ defaultView = "guion" }: { defaultView?: GuideView }) {
  const grouped = objeciones.reduce<Record<string, Objecion[]>>((acc, item) => {
    const group = getObjecionGroup(item);
    acc[group] = [...(acc[group] ?? []), item];
    return acc;
  }, {});

  return (
    <main>
      <PageHeader
        eyebrow="Asistencia comercial"
        title="Guion y objeciones"
        description="Encuentra el siguiente paso de la llamada o una respuesta validada sin salir de esta vista."
        tone="dark"
      />

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:py-7">
        <Tabs defaultValue={defaultView} className="gap-5">
          <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="grid h-11 w-full grid-cols-2 bg-white/[0.07] p-1 sm:w-auto sm:min-w-80">
              <TabsTrigger value="guion" className="h-9 data-active:bg-white data-active:text-slate-950">
                <PhoneCall className="size-4" />
                Flujo de llamada
              </TabsTrigger>
              <TabsTrigger value="objeciones" className="h-9 data-active:bg-white data-active:text-slate-950">
                <MessageSquareReply className="size-4" />
                Respuestas rápidas
              </TabsTrigger>
            </TabsList>
            <p className="text-xs text-slate-400">
              Selecciona una vista y consulta la respuesta en segundos.
            </p>
          </div>

          <TabsContent value="guion" className="mt-0">
            <ScriptGuide />
          </TabsContent>
          <TabsContent value="objeciones" className="mt-0">
            <ObjectionGuide grouped={grouped} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

function ScriptGuide() {
  return (
    <section className="grid gap-5 lg:grid-cols-[14rem_minmax(0,1fr)]">
      <nav
        aria-label="Pasos del guion"
        className="h-fit rounded-xl border border-white/10 bg-[#172033] p-3 lg:sticky lg:top-20"
      >
        <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">
          Etapas
        </p>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-5 lg:grid-cols-1">
          {guiones.map((bloque, index) => (
            <a
              key={bloque.etapa}
              href={`#${stepAnchors[bloque.etapa]}`}
              className="flex min-h-11 items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8D83]"
            >
              <span className="grid size-6 shrink-0 place-items-center rounded-md bg-[#DA291C]/12 text-xs font-bold text-[#FF8D83]">
                {index + 1}
              </span>
              <span className="truncate">{bloque.etapa}</span>
            </a>
          ))}
        </div>
      </nav>

      <div className="space-y-3">
        {guiones.map((bloque, index) => (
          <ScriptStep key={bloque.etapa} bloque={bloque} index={index} />
        ))}
      </div>
    </section>
  );
}

function ScriptStep({ bloque, index }: { bloque: GuionBloque; index: number }) {
  const Icon = stepIcons[bloque.etapa] ?? ClipboardCheck;

  return (
    <article
      id={stepAnchors[bloque.etapa]}
      className="scroll-mt-24 rounded-xl border border-white/10 bg-[#172033] p-4 shadow-[0_14px_34px_rgba(0,0,0,0.12)] sm:p-5"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-[#DA291C]/20 bg-[#DA291C]/10 text-[#FF8D83]">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#FF8D83]">Paso {index + 1}</p>
          <h2 className="mt-0.5 text-lg font-semibold text-white">{bloque.etapa}</h2>
          <p className="mt-1 text-sm leading-6 text-slate-400">{bloque.objetivo}</p>
        </div>
      </div>

      <blockquote className="mt-4 border-l-2 border-[#DA291C] bg-[#111827]/55 px-4 py-3 text-sm font-medium leading-6 text-slate-100">
        {bloque.texto}
      </blockquote>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {bloque.puntosClave.map((point) => (
          <li key={point} className="flex gap-2 text-sm leading-5 text-slate-300">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function ObjectionGuide({ grouped }: { grouped: Record<string, Objecion[]> }) {
  return (
    <section>
      <nav
        aria-label="Categorías de objeciones"
        className="mb-5 flex flex-wrap gap-2 rounded-xl border border-white/10 bg-[#172033] p-3"
      >
        {Object.keys(grouped).map((group) => (
          <a
            key={group}
            href={`#${groupAnchors[group]}`}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.045] px-3 text-sm font-semibold text-slate-200 transition hover:border-[#DA291C]/35 hover:bg-[#DA291C]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8D83]"
          >
            {group}
            <span className="text-xs text-[#FF8D83]">{grouped[group].length}</span>
          </a>
        ))}
      </nav>

      <div className="space-y-7">
        {Object.entries(grouped).map(([group, items]) => {
          const Icon = groupIcons[group] ?? ClipboardCheck;

          return (
            <section key={group} id={groupAnchors[group]} className="scroll-mt-24">
              <div className="mb-3 flex items-center gap-3">
                <span className={`grid size-9 place-items-center rounded-lg border ${groupStyles[group]}`}>
                  <Icon className="size-4" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-white">{group}</h2>
                  <p className="text-xs text-slate-400">Respuesta sugerida y validación obligatoria.</p>
                </div>
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                {items.map((item) => (
                  <ObjectionCard key={item.objecion} item={item} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}

function ObjectionCard({ item }: { item: Objecion }) {
  return (
    <article className="rounded-xl border border-white/10 bg-[#172033] p-4 shadow-[0_14px_34px_rgba(0,0,0,0.12)] sm:p-5">
      <div className="flex items-start gap-3">
        <MessageSquareReply className="mt-0.5 size-5 shrink-0 text-[#FF8D83]" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Cliente</p>
          <h3 className="mt-1 text-base font-semibold text-white">{item.objecion}</h3>
        </div>
      </div>
      <div className="mt-4 rounded-lg border border-white/10 bg-[#111827]/55 p-3">
        <p className="text-xs font-semibold text-[#FF8D83]">Respuesta sugerida</p>
        <p className="mt-1.5 text-sm font-medium leading-6 text-slate-200">{item.respuesta}</p>
      </div>
      <div className="mt-3 flex gap-2 text-sm leading-5 text-emerald-200">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
        <span>{item.validacion}</span>
      </div>
    </article>
  );
}

function getObjecionGroup(item: Objecion) {
  const text = `${item.objecion} ${item.validacion}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (text.includes("menor precio") || text.includes("promocion")) return "Competencia";
  if (text.includes("caro") || text.includes("precio")) return "Precio";
  if (text.includes("fibra") || text.includes("velocidad")) return "Cobertura";
  if (text.includes("sorpresas")) return "Dudas";
  return "Validación";
}
