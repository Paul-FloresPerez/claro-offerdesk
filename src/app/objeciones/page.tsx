import { MessagesSquare } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { objeciones } from "@/data/objeciones";

export default function ObjecionesPage() {
  return (
    <main>
      <PageHeader
        eyebrow="Apoyo al asesor"
        title="Objeciones frecuentes"
        description="Respuestas sugeridas para mantener precisión comercial y cerrar brechas de validación."
      />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-neutral-200 p-4">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-red-50 text-[#DA291C]">
              <MessagesSquare className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold text-neutral-950">Tabla de manejo</h2>
              <p className="text-sm text-neutral-500">
                Usar como base, siempre sujeto a validación del caso.
              </p>
            </div>
          </div>

          <Table>
            <TableHeader className="bg-neutral-50">
              <TableRow>
                <TableHead>Objeción</TableHead>
                <TableHead>Respuesta sugerida</TableHead>
                <TableHead>Validación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {objeciones.map((item) => (
                <TableRow key={item.objecion}>
                  <TableCell className="min-w-48 whitespace-normal font-semibold text-neutral-950">
                    {item.objecion}
                  </TableCell>
                  <TableCell className="min-w-96 whitespace-normal text-neutral-700">
                    {item.respuesta}
                  </TableCell>
                  <TableCell className="min-w-56 whitespace-normal text-neutral-600">
                    {item.validacion}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </div>
    </main>
  );
}
