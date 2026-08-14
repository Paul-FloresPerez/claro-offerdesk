import {
  ArrowRight,
  BadgeDollarSign,
  Gauge,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { StatusBadge, TechnologyBadge } from "@/components/common/StatusBadge";
import { OfficialImage } from "@/components/offers/OfficialImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOfertaCover, type Oferta } from "@/lib/offer-utils";
import { cn } from "@/lib/utils";

type Props = {
  oferta: Oferta;
  featured?: boolean;
};

const categoryTone: Record<string, string> = {
  "Oferta base": "border-primary/20 bg-primary/10 text-brand-emphasis",
  Hogar: "border-border bg-muted text-foreground",
  "Tecnologia / HFC": "border-orange-200 bg-orange-50 text-orange-700",
  "Promociones especiales": "border-yellow-200 bg-yellow-50 text-yellow-800",
  "Linea Movil": "border-sky-200 bg-sky-50 text-sky-700",
};

export function OfferCard({ oferta, featured = false }: Props) {
  const cover = getOfertaCover(oferta);

  return (
    <Card
      className={cn(
        "h-full rounded-lg border bg-card text-foreground shadow-[0_18px_40px_rgba(0,0,0,0.20)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(0,0,0,0.26)]",
        featured ? "border-primary/40" : "border-border"
      )}
    >
      <div className="px-3 pt-3">
        <OfficialImage item={cover} title={oferta.nombre} variant="card" />
      </div>

      <CardHeader className="space-y-3 px-4 pt-2">
        <div className="flex flex-wrap gap-2">
          <span
            className={cn(
              "inline-flex h-6 items-center rounded-md border px-2 text-xs font-semibold",
              categoryTone[oferta.categoria] ??
                "border-border bg-muted text-foreground"
            )}
          >
            {oferta.categoria}
          </span>
          <StatusBadge estado={oferta.estado} />
        </div>

        <div>
          <CardTitle className="text-lg font-semibold leading-6 text-foreground">
            {oferta.nombre}
          </CardTitle>
          <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
            {oferta.resumen}
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 px-4">
        <div className="grid grid-cols-2 gap-2">
          <InfoBox
            icon={BadgeDollarSign}
            label="Precio"
            value={oferta.precio}
            strong
          />
          <InfoBox icon={Gauge} label="Velocidad" value={oferta.velocidad} />
        </div>

        <div className="flex flex-wrap gap-2">
          {oferta.tecnologia.map((item) => (
            <TechnologyBadge key={item} tecnologia={item} />
          ))}
        </div>

        <div className="rounded-lg border border-border bg-muted px-3 py-2 text-xs leading-5 text-muted-foreground">
          <span className="font-semibold text-foreground">Clave: </span>
          {oferta.detallePrecio}
        </div>

        <Button
          asChild
          className="mt-auto w-full bg-primary text-primary-foreground shadow-[0_10px_20px_rgba(218,41,28,0.24)] hover:bg-primary/90"
        >
          <Link href={`/ofertas/${oferta.id}`}>
            Ver detalle
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function InfoBox({
  icon: Icon,
  label,
  value,
  strong,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p
        className={cn(
          "leading-5",
          strong
            ? "text-base font-bold text-primary"
            : "text-sm font-semibold text-foreground"
        )}
      >
        {value}
      </p>
    </div>
  );
}
