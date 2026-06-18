import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { StatusBadge, TechnologyBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Oferta } from "@/data/ofertas";
import { cn } from "@/lib/utils";

type OfferComparisonTableProps = {
  ofertas: Oferta[];
};

export function OfferComparisonTable({ ofertas }: OfferComparisonTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
      <Table>
        <TableHeader className="bg-neutral-950">
          <TableRow className="border-neutral-800 hover:bg-neutral-950">
            <TableHead className="text-white">Oferta</TableHead>
            <TableHead className="text-white">Categoría</TableHead>
            <TableHead className="text-white">Precio</TableHead>
            <TableHead className="text-white">Velocidad</TableHead>
            <TableHead className="text-white">Tecnología</TableHead>
            <TableHead className="text-white">Estado</TableHead>
            <TableHead className="text-right text-white">Ficha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ofertas.map((oferta) => (
            <TableRow
              key={oferta.id}
              className={cn(
                oferta.id === "oferta-regular" && "bg-red-50/60 hover:bg-red-50"
              )}
            >
              <TableCell className="min-w-56 whitespace-normal font-medium text-neutral-950">
                <div className="flex items-start gap-2">
                  {oferta.id === "oferta-regular" ? (
                    <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-[#DA291C]" />
                  ) : null}
                  <span>
                    <span className="block">{oferta.nombre}</span>
                    <span className="mt-1 block text-xs font-normal leading-5 text-neutral-500">
                      {oferta.detallePrecio}
                    </span>
                  </span>
                </div>
              </TableCell>
              <TableCell>{oferta.categoria}</TableCell>
              <TableCell className="font-semibold text-[#DA291C]">
                {oferta.precio}
              </TableCell>
              <TableCell>{oferta.velocidad}</TableCell>
              <TableCell>
                <div className="flex min-w-36 flex-wrap gap-1.5">
                  {oferta.tecnologia.map((tecnologia) => (
                    <TechnologyBadge key={tecnologia} tecnologia={tecnologia} />
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge estado={oferta.estado} />
              </TableCell>
              <TableCell className="text-right">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/ofertas/${oferta.id}`}>
                    Abrir
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
