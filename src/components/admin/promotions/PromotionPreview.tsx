import { CalendarRange, Download, Edit3, ExternalLink, FileText, ImageIcon, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PromotionStatusBadge } from "@/components/admin/promotions/PromotionStatusBadge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type PreviewPromotion = NonNullable<Awaited<ReturnType<typeof import("@/lib/promotions/catalog").getPromotionForAdmin>>>;

export function PromotionPreview({ promotion }: { promotion: PreviewPromotion }) {
  const assets = [...promotion.assets].sort((a, b) => a.sortOrder - b.sortOrder);
  const principal = assets.find((asset) => asset.kind === "FLYER") ?? assets[0];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <PromotionStatusBadge status={promotion.status} />
          <Badge variant="outline">{promotion.kind === "CAMPAIGN" ? "Campaña" : "Oferta regular"}</Badge>
          {promotion.category ? <Badge variant="secondary">{promotion.category}</Badge> : null}
          {promotion.featured ? <Badge>Destacada</Badge> : null}
        </div>
        <Button asChild><Link href={`/admin/promociones/${promotion.id}/editar`}><Edit3 /> Editar promoción</Link></Button>
      </div>

      {promotion.status !== "PUBLISHED" ? (
        <Alert><Info /><AlertTitle>Preview administrativo</AlertTitle><AlertDescription>Esta vista puede mostrar borradores o promociones archivadas. No implica que el contenido esté publicado para los asesores.</AlertDescription></Alert>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
        <Card>
          <CardContent className="flex min-h-80 items-center justify-center bg-muted/30">
            {principal ? <AssetPreview asset={principal} priority /> : <div className="py-16 text-center"><ImageIcon className="mx-auto size-10 text-muted-foreground" /><p className="mt-3 font-medium text-foreground">Sin material principal</p><p className="mt-1 text-sm text-muted-foreground">Agrega un flyer o documento desde la edición.</p></div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{promotion.title}</CardTitle>
            <CardDescription className="text-base leading-7">{promotion.shortDescription ?? "Sin descripción breve."}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-wrap gap-2">{asStringArray(promotion.tags).map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}</div>
            {asStringArray(promotion.technologies).length || asStringArray(promotion.playTypes).length ? (
              <div className="space-y-3">
                <PreviewChips label="Tecnologías" items={asStringArray(promotion.technologies)} />
                <PreviewChips label="Tipo de Play" items={asStringArray(promotion.playTypes)} />
              </div>
            ) : null}
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground"><CalendarRange className="size-4" /> Vigencia</p>
              <p className="mt-2 text-sm text-muted-foreground">{formatValidity(promotion.validFrom, promotion.validUntil)}</p>
            </div>
            {promotion.zoneSummary ? <div><h2 className="font-semibold text-foreground">Cobertura</h2><p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">{promotion.zoneSummary}</p></div> : null}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <ContentList title="Beneficios" items={asStringArray(promotion.benefits)} />
        <ContentList title="Condiciones" items={asStringArray(promotion.conditions)} />
        <ContentList title="Validaciones" items={asStringArray(promotion.validations)} />
      </section>

      {promotion.commercialText ? (
        <Card><CardHeader><CardTitle>Texto comercial</CardTitle></CardHeader><CardContent><p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">{promotion.commercialText}</p></CardContent></Card>
      ) : null}

      <Card>
        <CardHeader><CardTitle>Materiales asociados</CardTitle><CardDescription>{assets.length} archivo{assets.length === 1 ? "" : "s"} en almacenamiento privado.</CardDescription></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {assets.map((asset) => (
            <article key={asset.id} className="flex items-center gap-3 rounded-lg border border-border p-4">
              {asset.mimeType === "application/pdf" ? <FileText className="size-5 text-muted-foreground" /> : <ImageIcon className="size-5 text-muted-foreground" />}
              <div className="min-w-0 flex-1"><p className="truncate font-medium text-foreground">{asset.displayName}</p><p className="text-xs text-muted-foreground">{asset.kind} · Orden {asset.sortOrder}</p></div>
              <Button asChild size="icon-sm" variant="ghost"><a href={`/api/promotions/assets/${asset.id}`} target="_blank" rel="noreferrer"><ExternalLink /><span className="sr-only">Abrir {asset.displayName}</span></a></Button>
              <Button asChild size="icon-sm" variant="ghost"><a href={`/api/promotions/assets/${asset.id}?download=1`}><Download /><span className="sr-only">Descargar {asset.displayName}</span></a></Button>
            </article>
          ))}
          {!assets.length ? <p className="text-sm text-muted-foreground">No hay materiales asociados.</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}

function AssetPreview({ asset, priority }: { asset: PreviewPromotion["assets"][number]; priority?: boolean }) {
  const url = `/api/promotions/assets/${asset.id}`;
  if (asset.mimeType === "application/pdf") {
    return <div className="py-16 text-center"><FileText className="mx-auto size-12 text-muted-foreground" /><p className="mt-3 font-semibold text-foreground">{asset.displayName}</p><Button asChild className="mt-4"><a href={url} target="_blank" rel="noreferrer"><ExternalLink /> Abrir documento</a></Button></div>;
  }
  return <Image src={url} alt={asset.altText ?? asset.displayName} width={asset.width ?? 1400} height={asset.height ?? 900} priority={priority} unoptimized className="max-h-[70vh] w-full object-contain" />;
}

function ContentList({ title, items }: { title: string; items: string[] }) {
  return (
    <Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent>{items.length ? <ul className="space-y-2 text-sm leading-6 text-muted-foreground">{items.map((item) => <li key={item} className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />{item}</li>)}</ul> : <p className="text-sm text-muted-foreground">Sin información.</p>}</CardContent></Card>
  );
}

function PreviewChips({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => <Badge key={item} variant="outline">{item}</Badge>)}
      </div>
    </div>
  );
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function formatValidity(from: Date | null, until: Date | null) {
  if (!from && !until) return "Sin fechas definidas";
  const formatter = new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Lima" });
  return `${from ? formatter.format(from) : "Inicio libre"} – ${until ? formatter.format(until) : "Sin fin"}`;
}
