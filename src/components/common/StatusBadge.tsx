import { Badge } from "@/components/ui/badge";
import {
  estadoOfertaLabel,
  type CategoriaOferta,
  type EstadoOferta,
  type TecnologiaOferta,
} from "@/data/ofertas";
import { cn } from "@/lib/utils";

const statusClasses: Record<EstadoOferta, string> = {
  "material-oficial": "border-emerald-200 bg-emerald-50 text-emerald-700",
  validar: "border-yellow-200 bg-yellow-50 text-yellow-800",
  incompleta: "border-red-200 bg-red-50 text-red-700",
};

const technologyClasses: Record<TecnologiaOferta, string> = {
  HFC: "border-orange-200 bg-orange-50 text-orange-700",
  "HFC Plus": "border-indigo-200 bg-indigo-50 text-indigo-700",
  FTTH: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Móvil: "border-sky-200 bg-sky-50 text-sky-700",
  "Por confirmar": "border-neutral-200 bg-neutral-100 text-neutral-600",
};

const categoryClasses: Record<CategoriaOferta, string> = {
  Hogar: "border-red-200 bg-red-50 text-[#B91C1C]",
  HFC: "border-orange-200 bg-orange-50 text-orange-700",
  "Promoción especial": "border-yellow-200 bg-yellow-50 text-yellow-800",
  "Línea Móvil": "border-sky-200 bg-sky-50 text-sky-700",
};

export function StatusBadge({ estado }: { estado: EstadoOferta }) {
  return (
    <Badge variant="outline" className={cn("h-6 rounded-md", statusClasses[estado])}>
      {estadoOfertaLabel[estado]}
    </Badge>
  );
}

export function TechnologyBadge({ tecnologia }: { tecnologia: TecnologiaOferta }) {
  return (
    <Badge
      variant="outline"
      className={cn("h-6 rounded-md", technologyClasses[tecnologia])}
    >
      {tecnologia}
    </Badge>
  );
}

export function CategoryBadge({ categoria }: { categoria: CategoriaOferta }) {
  return (
    <Badge
      variant="outline"
      className={cn("h-6 rounded-md", categoryClasses[categoria])}
    >
      {categoria}
    </Badge>
  );
}
