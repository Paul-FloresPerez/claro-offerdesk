import { CalendarRange, Edit3, Info, MapPin } from "lucide-react";
import Link from "next/link";
import { PromotionStatusBadge } from "@/components/admin/promotions/PromotionStatusBadge";
import { PromotionAssetGallery } from "@/components/promotions/PromotionAssetGallery";
import { PromotionDocuments } from "@/components/promotions/PromotionDocuments";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatPromotionValidity,
  toPromotionAssetPresentation,
} from "@/lib/promotions/asset-presentation";

type PreviewPromotion = NonNullable<
  Awaited<ReturnType<typeof import("@/lib/promotions/catalog").getPromotionForAdmin>>
>;

export function PromotionPreview({ promotion }: { promotion: PreviewPromotion }) {
  const assets = promotion.assets.map(toPromotionAssetPresentation);
  const tags = asStringArray(promotion.tags);
  const technologies = asStringArray(promotion.technologies);
  const playTypes = asStringArray(promotion.playTypes);
  const benefits = asStringArray(promotion.benefits);
  const conditions = asStringArray(promotion.conditions);
  const validations = asStringArray(promotion.validations);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <PromotionStatusBadge status={promotion.status} />
          <Badge variant="outline">
            {promotion.kind === "CAMPAIGN" ? "Campaña" : "Oferta regular"}
          </Badge>
          {promotion.category ? <Badge variant="secondary">{promotion.category}</Badge> : null}
          {promotion.featured ? <Badge>Destacada</Badge> : null}
        </div>
        <Button asChild>
          <Link href={`/admin/promociones/${promotion.id}/editar`}>
            <Edit3 /> Editar promoción
          </Link>
        </Button>
      </div>

      {promotion.status !== "PUBLISHED" ? (
        <Alert>
          <Info />
          <AlertTitle>Preview administrativo</AlertTitle>
          <AlertDescription>
            Esta vista puede mostrar borradores o promociones archivadas. No implica
            que el contenido esté publicado para los asesores.
          </AlertDescription>
        </Alert>
      ) : null}

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
        <PromotionAssetGallery assets={assets} title={promotion.title} />

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{promotion.title}</CardTitle>
            {promotion.shortDescription ? (
              <p className="text-base leading-7 text-muted-foreground">
                {promotion.shortDescription}
              </p>
            ) : null}
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {tags.length ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
              </div>
            ) : null}
            {technologies.length || playTypes.length ? (
              <div className="flex flex-col gap-3">
                <PreviewChips label="Tecnologías" items={technologies} />
                <PreviewChips label="Tipo de Play" items={playTypes} />
              </div>
            ) : null}
            <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4">
              <CalendarRange className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold text-foreground">Vigencia</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatPromotionValidity(promotion.validFrom, promotion.validUntil)}
                </p>
              </div>
            </div>
            {promotion.zoneSummary ? (
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <h2 className="font-semibold text-foreground">Cobertura</h2>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                    {promotion.zoneSummary}
                  </p>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </section>

      {(benefits.length || conditions.length || validations.length) ? (
        <section className="grid gap-5 lg:grid-cols-3">
          {benefits.length ? <ContentList title="Beneficios" items={benefits} /> : null}
          {conditions.length ? <ContentList title="Condiciones" items={conditions} /> : null}
          {validations.length ? <ContentList title="Validaciones" items={validations} /> : null}
        </section>
      ) : null}

      {promotion.commercialText ? (
        <Card>
          <CardHeader><CardTitle>Texto comercial</CardTitle></CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
              {promotion.commercialText}
            </p>
          </CardContent>
        </Card>
      ) : null}

      <PromotionDocuments assets={assets} />
    </div>
  );
}

function ContentList({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2 text-sm leading-6 text-muted-foreground">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function PreviewChips({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => <Badge key={item} variant="outline">{item}</Badge>)}
      </div>
    </div>
  );
}

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}
