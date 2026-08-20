import { ArrowLeft, CalendarRange, Download, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { PromotionAssetGallery } from "@/components/promotions/PromotionAssetGallery";
import { PromotionDocuments } from "@/components/promotions/PromotionDocuments";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatPromotionValidity,
  getPromotionAssetUrl,
  getPromotionVisualAssets,
  toPromotionAssetPresentation,
} from "@/lib/promotions/asset-presentation";
import { getPublishedPromotionBySlug } from "@/lib/promotions/catalog";

export const runtime = "nodejs";

export default async function PromotionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const promotion = await getPublishedPromotionBySlug((await params).slug);

  if (!promotion) notFound();

  const assets = promotion.assets.map(toPromotionAssetPresentation);
  const flyer = getPromotionVisualAssets(assets).find(
    (asset) => asset.kind === "FLYER"
  );
  const technologies = asStringArray(promotion.technologies);
  const playTypes = asStringArray(promotion.playTypes);
  const tags = asStringArray(promotion.tags);
  const benefits = asStringArray(promotion.benefits);
  const conditions = asStringArray(promotion.conditions);
  const validations = asStringArray(promotion.validations);

  return (
    <main className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:py-7">
      <Button asChild variant="ghost" className="mb-5">
        <Link href="/promociones">
          <ArrowLeft /> Volver a Promociones
        </Link>
      </Button>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.18fr)_minmax(20rem,0.82fr)]">
        <PromotionAssetGallery assets={assets} title={promotion.title} />

        <div className="flex flex-col gap-5">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge>
                {promotion.kind === "REGULAR_OFFER" ? "Oferta Regular" : "Campaña"}
              </Badge>
              {promotion.category ? <Badge variant="outline">{promotion.category}</Badge> : null}
              {promotion.featured ? <Badge variant="secondary">Destacada</Badge> : null}
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
              {promotion.title}
            </h1>
            {promotion.shortDescription ? (
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                {promotion.shortDescription}
              </p>
            ) : null}
          </div>

          {(technologies.length || playTypes.length || tags.length) ? (
            <div className="flex flex-col gap-3">
              {technologies.length || playTypes.length ? (
                <DetailChips
                  label="Tecnologías y plan"
                  items={[...technologies, ...playTypes]}
                />
              ) : null}
              {tags.length ? <DetailChips label="Etiquetas" items={tags} /> : null}
            </div>
          ) : null}

          <Card>
            <CardContent className="flex items-start gap-3 p-4 text-sm text-muted-foreground">
              <CalendarRange className="mt-0.5 size-4 shrink-0" />
              <div>
                <p className="font-semibold text-foreground">Vigencia</p>
                <p className="mt-1">
                  {formatPromotionValidity(promotion.validFrom, promotion.validUntil)}
                </p>
              </div>
            </CardContent>
          </Card>

          {promotion.zoneSummary ? (
            <Card>
              <CardContent className="flex items-start gap-3 p-4 text-sm leading-6 text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Cobertura</p>
                  <p className="mt-1 whitespace-pre-line">{promotion.zoneSummary}</p>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {flyer ? (
            <Button asChild variant="outline" className="w-fit">
              <a href={getPromotionAssetUrl(flyer.id, true)}>
                <Download /> Descargar flyer
              </a>
            </Button>
          ) : null}
        </div>
      </section>

      {(benefits.length || conditions.length || validations.length) ? (
        <section className="mt-7 grid gap-4 lg:grid-cols-3">
          {benefits.length ? <ContentList title="Beneficios" items={benefits} /> : null}
          {conditions.length ? <ContentList title="Condiciones" items={conditions} /> : null}
          {validations.length ? (
            <ContentList title="Validaciones para el asesor" items={validations} />
          ) : null}
        </section>
      ) : null}

      {promotion.commercialText ? (
        <Card className="mt-7">
          <CardHeader>
            <CardTitle>Texto comercial</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
              {promotion.commercialText}
            </p>
          </CardContent>
        </Card>
      ) : null}

      <div className="mt-7">
        <PromotionDocuments assets={assets} />
      </div>
    </main>
  );
}

function DetailChips({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item} variant="secondary">{item}</Badge>
        ))}
      </div>
    </div>
  );
}

function ContentList({ title, items }: { title: string; items: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
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

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}
