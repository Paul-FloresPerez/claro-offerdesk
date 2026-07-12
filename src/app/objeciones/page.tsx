import {
  BadgeDollarSign,
  CheckCircle2,
  ClipboardCheck,
  MessageSquareReply,
  MessagesSquare,
  SearchCheck,
  ShieldQuestion,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { objeciones, type Objecion } from "@/data/objeciones";

const groupIcons: Record<string, LucideIcon> = {
  Precio: BadgeDollarSign,
  Cobertura: Wifi,
  Competencia: SearchCheck,
  Dudas: ShieldQuestion,
  Validación: ClipboardCheck,
};

const groupStyles: Record<string, string> = {
  Precio: "border-red-100 bg-red-50 text-[#7F1D1D]",
  Cobertura: "border-sky-100 bg-sky-50 text-sky-900",
  Competencia: "border-violet-100 bg-violet-50 text-violet-900",
  Dudas: "border-yellow-100 bg-yellow-50 text-yellow-900",
  Validación: "border-emerald-100 bg-emerald-50 text-emerald-900",
};

const groupAnchors: Record<string, string> = {
  Precio: "respuesta-precio",
  Cobertura: "respuesta-cobertura",
  Competencia: "respuesta-variacion",
  Dudas: "respuesta-dudas",
  Validación: "respuesta-validacion",
};

export default function ObjecionesPage() {
  const grouped = objeciones.reduce<Record<string, Objecion[]>>((acc, item) => {
    const group = getObjecionGroup(item);
    acc[group] = [...(acc[group] ?? []), item];
    return acc;
  }, {});

  return (
    <main>
      <PageHeader
        eyebrow="Apoyo al asesor"
        title="Objeciones frecuentes"
        description="Banco rápido de respuestas para mantener precisión comercial y cerrar brechas de validación."
        tone="dark"
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <section className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <aside className="animate-fade-up rounded-lg border border-white/10 bg-[#172033]/92 p-4 shadow-[0_18px_42px_rgba(0,0,0,0.22)]">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md bg-[#DA291C] text-white">
                <MessagesSquare className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-semibold text-white">Banco de respuestas</h2>
                <p className="text-sm text-slate-300">
                  Usar como base y validar el caso.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-2">
              {Object.keys(grouped).map((group) => (
                <a
                  key={group}
                  href={`#${groupAnchors[group]}`}
                  className="inline-flex h-9 items-center justify-between rounded-md border border-white/10 bg-white/[0.07] px-3 text-sm font-semibold text-slate-100 transition hover:border-[#DA291C]/40 hover:bg-[#DA291C]/15"
                >
                  {group}
                  <span className="text-xs text-[#FFB4AC]">
                    {grouped[group].length}
                  </span>
                </a>
              ))}
            </div>
          </aside>

          <div className="space-y-6">
            {Object.entries(grouped).map(([group, items]) => {
              const Icon = groupIcons[group] ?? ClipboardCheck;

              return (
                <section
                  key={group}
                  id={groupAnchors[group]}
                  className="scroll-mt-28 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-md border ${groupStyles[group]}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h2 className="text-lg font-semibold text-white">{group}</h2>
                      <p className="text-sm text-slate-300">
                        Respuestas sugeridas con nota de validación.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {items.map((item) => (
                      <ObjecionCard key={item.objecion} item={item} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

function ObjecionCard({ item }: { item: Objecion }) {
  return (
    <article className="animate-fade-up group rounded-lg border border-white/70 bg-white p-4 text-[#111827] shadow-[0_18px_42px_rgba(0,0,0,0.20)] transition duration-300 hover:-translate-y-1 hover:border-[#DA291C]/35 hover:shadow-[0_26px_60px_rgba(0,0,0,0.26)]">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-red-50 text-[#DA291C]">
          <MessageSquareReply className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            Objeción del cliente
          </p>
          <h3 className="mt-1 text-lg font-semibold text-[#111827]">
            {item.objecion}
          </h3>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
          Respuesta sugerida
        </p>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-800">
          {item.respuesta}
        </p>
      </div>

      <div className="mt-3 flex gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm leading-5 text-emerald-900">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{item.validacion}</span>
      </div>
    </article>
  );
}

function getObjecionGroup(item: Objecion) {
  const text = `${item.objecion} ${item.validacion}`.toLowerCase();

  if (text.includes("menor precio") || text.includes("promoción")) {
    return "Competencia";
  }
  if (text.includes("caro") || text.includes("precio")) return "Precio";
  if (text.includes("fibra") || text.includes("velocidad")) return "Cobertura";
  if (text.includes("sorpresas")) return "Dudas";
  return "Validación";
}
