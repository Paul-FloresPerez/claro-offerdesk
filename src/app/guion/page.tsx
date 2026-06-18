import { CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { guiones } from "@/data/guiones";

export default function GuionPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Atención comercial"
        title="Guion de llamada"
        description="Secuencia base para abrir, diagnosticar, presentar, validar y cerrar sin adelantar información no confirmada."
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid gap-5 lg:grid-cols-5">
          {guiones.map((bloque, index) => (
            <section
              key={bloque.etapa}
              className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-md bg-red-50 text-sm font-bold text-[#DA291C]">
                  {index + 1}
                </span>
                <div>
                  <h2 className="font-semibold text-neutral-950">{bloque.etapa}</h2>
                  <p className="text-xs text-neutral-500">{bloque.objetivo}</p>
                </div>
              </div>

              <p className="text-sm leading-6 text-neutral-700">{bloque.texto}</p>

              <ul className="mt-4 space-y-3">
                {bloque.puntosClave.map((punto) => (
                  <li key={punto} className="flex gap-2 text-sm leading-6 text-neutral-600">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{punto}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
