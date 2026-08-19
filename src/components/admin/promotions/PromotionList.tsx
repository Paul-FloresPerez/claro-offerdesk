import { CalendarRange, Edit3, Eye, Images, ListOrdered } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PromotionFeaturedAction,
  PromotionLifecycleAction,
} from "@/components/admin/promotions/PromotionLifecycleAction";
import { PromotionStatusBadge } from "@/components/admin/promotions/PromotionStatusBadge";

export type PromotionListItem = {
  id: string;
  title: string;
  slug: string;
  kind: "CAMPAIGN" | "REGULAR_OFFER";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  category: string | null;
  featured: boolean;
  sortOrder: number;
  validFrom: Date | null;
  validUntil: Date | null;
  updatedAt: Date;
  _count: { assets: number };
};

export function PromotionList({
  promotions,
  emptyCatalog = false,
}: {
  promotions: PromotionListItem[];
  emptyCatalog?: boolean;
}) {
  if (!promotions.length) {
    return (
      <Empty className="rounded-xl border border-dashed border-border bg-card py-14">
        <EmptyHeader>
          <EmptyMedia variant="icon"><Images /></EmptyMedia>
          <EmptyTitle>
            {emptyCatalog
              ? "Aún no hay promociones en el nuevo catálogo."
              : "No hay promociones con estos filtros"}
          </EmptyTitle>
          <EmptyDescription>
            {emptyCatalog
              ? "Crea un borrador para comenzar a probar el flujo editorial."
              : "Ajusta la búsqueda o limpia los filtros actuales."}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/admin/promociones/nueva">
              {emptyCatalog ? "Crear primera promoción" : "Nueva promoción"}
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-xs lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Promoción</TableHead><TableHead>Estado</TableHead>
              <TableHead>Categoría</TableHead><TableHead>Tipo</TableHead>
              <TableHead>Vigencia</TableHead><TableHead>Actualizada</TableHead>
              <TableHead>Destacada</TableHead><TableHead>Orden</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.map((promotion) => (
              <TableRow key={promotion.id}>
                <TableCell className="max-w-64 whitespace-normal">
                  <div>
                    <p className="font-semibold text-foreground">{promotion.title}</p>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">{promotion.slug}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col items-start gap-1">
                    <PromotionStatusBadge status={promotion.status} />
                    {isExpired(promotion) ? (
                      <Badge variant="outline" className="border-destructive/30 bg-destructive/10 text-destructive">Vencida</Badge>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>{promotion.category ?? "Sin categoría"}</TableCell>
                <TableCell>{promotion.kind === "CAMPAIGN" ? "Campaña" : "Oferta regular"}</TableCell>
                <TableCell>{formatValidity(promotion)}</TableCell>
                <TableCell>{formatUpdatedAt(promotion.updatedAt)}</TableCell>
                <TableCell><PromotionFeaturedAction promotionId={promotion.id} featured={promotion.featured} /></TableCell>
                <TableCell>{promotion.sortOrder}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/promociones/${promotion.id}/editar`}><Edit3 /> Editar</Link>
                    </Button>
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/admin/promociones/${promotion.id}/preview`}><Eye /> Preview</Link>
                    </Button>
                    <StatusAction promotion={promotion} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-4 lg:hidden">
        {promotions.map((promotion) => (
          <Card key={promotion.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-base">{promotion.title}</CardTitle>
                  <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{promotion.slug}</p>
                </div>
                <PromotionFeaturedAction promotionId={promotion.id} featured={promotion.featured} />
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <PromotionStatusBadge status={promotion.status} />
                {isExpired(promotion) ? <Badge variant="destructive">Vencida</Badge> : null}
                <Badge variant="outline">{promotion.kind === "CAMPAIGN" ? "Campaña" : "Oferta regular"}</Badge>
                {promotion.category ? <Badge variant="secondary">{promotion.category}</Badge> : null}
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-sm">
              <Detail icon={CalendarRange} label="Vigencia" value={formatValidity(promotion)} />
              <Detail icon={Images} label="Materiales" value={String(promotion._count.assets)} />
              <Detail icon={ListOrdered} label="Orden" value={String(promotion.sortOrder)} />
              <Detail icon={CalendarRange} label="Actualizada" value={formatUpdatedAt(promotion.updatedAt)} />
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2 border-t">
              <Button asChild size="sm" variant="outline" className="flex-1">
                <Link href={`/admin/promociones/${promotion.id}/editar`}><Edit3 /> Editar</Link>
              </Button>
              <Button asChild size="sm" variant="ghost" className="flex-1">
                <Link href={`/admin/promociones/${promotion.id}/preview`}><Eye /> Preview</Link>
              </Button>
              <StatusAction promotion={promotion} />
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}

function StatusAction({ promotion }: { promotion: PromotionListItem }) {
  if (promotion.status === "DRAFT") {
    return (
      <>
        <PromotionLifecycleAction promotionId={promotion.id} transition="publish" compact />
        <PromotionLifecycleAction promotionId={promotion.id} transition="archive" compact />
      </>
    );
  }
  if (promotion.status === "PUBLISHED") {
    return (
      <>
        <PromotionLifecycleAction promotionId={promotion.id} transition="unpublish" compact />
        <PromotionLifecycleAction promotionId={promotion.id} transition="archive" compact />
      </>
    );
  }
  return <PromotionLifecycleAction promotionId={promotion.id} transition="restore" compact />;
}

function Detail({ icon: Icon, label, value }: {
  icon: typeof CalendarRange;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground"><Icon className="size-3.5" /> {label}</p>
      <p className="mt-1 font-medium text-foreground">{value}</p>
    </div>
  );
}

function formatValidity(promotion: PromotionListItem) {
  if (!promotion.validFrom && !promotion.validUntil) return "Sin vigencia";
  const formatter = new Intl.DateTimeFormat("es-PE", {
    day: "2-digit", month: "short", year: "numeric", timeZone: "America/Lima",
  });
  const start = promotion.validFrom ? formatter.format(promotion.validFrom) : "Inicio libre";
  const end = promotion.validUntil ? formatter.format(promotion.validUntil) : "Sin fin";
  return `${start} – ${end}`;
}

function formatUpdatedAt(value: Date) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "America/Lima",
  }).format(value);
}

function isExpired(promotion: PromotionListItem) {
  return (
    promotion.status === "PUBLISHED" &&
    promotion.validUntil !== null &&
    promotion.validUntil.getTime() < Date.now()
  );
}
