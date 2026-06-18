import { AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { validaciones } from "@/data/validaciones";
import { cn } from "@/lib/utils";

const severityClass = {
  critica: "border-red-200 bg-red-50 text-[#7F1D1D]",
  alerta: "border-yellow-200 bg-yellow-50 text-yellow-900",
  operativa: "border-emerald-200 bg-emerald-50 text-emerald-900",
};

export default function ValidacionesPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Control comercial"
        title="Validaciones obligatorias"
        description="Reglas para evitar errores de cobertura, precio, vigencia, tecnología y condiciones antes de vender."
      />

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-2">
        {validaciones.map((grupo) => (
          <section
            key={grupo.titulo}
            className={cn(
              "rounded-lg border p-4 shadow-sm",
              severityClass[grupo.severidad]
            )}
          >
            <div className="mb-4 flex items-center gap-3">
              {grupo.severidad === "critica" ? (
                <ShieldAlert className="h-5 w-5" />
              ) : grupo.severidad === "alerta" ? (
                <AlertTriangle className="h-5 w-5" />
              ) : (
                <CheckCircle2 className="h-5 w-5" />
              )}
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
        ))}
      </div>
    </main>
  );
}
