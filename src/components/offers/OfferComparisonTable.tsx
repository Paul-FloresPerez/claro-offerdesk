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
import type { Oferta } from "@/lib/offer-utils";
import { cn } from "@/lib/utils";

type OfferComparisonTableProps = {
  ofertas: Oferta[];
};

export function OfferComparisonTable({ ofertas }: OfferComparisonTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
      <Table>
        <TableHeader className="bg-surface-elevated">
          <TableRow className="border-border hover:bg-surface-elevated">
            <TableHead className="text-foreground">Oferta</TableHead>
            <TableHead className="text-foreground">Categoría</TableHead>
            <TableHead className="text-foreground">Precio</TableHead>
            <TableHead className="text-foreground">Velocidad</TableHead>
            <TableHead className="text-foreground">Tecnología</TableHead>
            <TableHead className="text-foreground">Estado</TableHead>
            <TableHead className="text-right text-foreground">Ficha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ofertas.map((oferta) => (
            <TableRow
              key={oferta.id}
              className={cn(
                oferta.id === "oferta-regular" && "bg-primary/5 hover:bg-primary/10"
              )}
            >
              <TableCell className="min-w-56 whitespace-normal font-medium text-foreground">
                <div className="flex items-start gap-2">
                  {oferta.id === "oferta-regular" ? (
                    <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  ) : null}
                  <span>
                    <span className="block">{oferta.nombre}</span>
                    <span className="mt-1 block text-xs font-normal leading-5 text-muted-foreground">
                      {oferta.detallePrecio}
                    </span>
                  </span>
                </div>
              </TableCell>
              <TableCell>{oferta.categoria}</TableCell>
              <TableCell className="font-semibold text-primary">
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
