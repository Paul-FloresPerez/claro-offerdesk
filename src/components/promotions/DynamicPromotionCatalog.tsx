"use client";

import { CalendarRange, ImageIcon, Search, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  formatPromotionValidity,
  getPromotionAssetUrl,
  getPromotionPrincipalAsset,
  type PromotionAssetPresentation,
} from "@/lib/promotions/asset-presentation";
import type { getPublishedPromotions } from "@/lib/promotions/catalog";

type PublishedPromotion = Awaited<ReturnType<typeof getPublishedPromotions>>[number];

const categoryFilters = [
  { value: "ALL", label: "Todas" },
  { value: "Hogar", label: "Hogar" },
  { value: "Convergencia", label: "Convergencia" },
  { value: "Móvil", label: "Móvil" },
  { value: "Negocios", label: "Negocios" },
] as const;

export function DynamicPromotionCatalog({
  promotions,
}: {
  promotions: PublishedPromotion[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categoryFilters)[number]["value"]>(
    "ALL"
  );

  const filteredPromotions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es-PE");

    return promotions.filter((promotion) => {
      const matchesCategory =
        category === "ALL" || promotion.category === category;
      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;

      const searchable = [
        promotion.title,
        promotion.shortDescription ?? "",
        promotion.category ?? "",
        ...asStringArray(promotion.tags),
      ]
        .join(" ")
        .toLocaleLowerCase("es-PE");

      return searchable.includes(normalizedQuery);
    });
  }, [category, promotions, query]);

  const regularOffer = filteredPromotions.find(
    (promotion) => promotion.kind === "REGULAR_OFFER"
  );
  const highlighted = filteredPromotions
    .filter((promotion) => promotion.featured && promotion.id !== regularOffer?.id)
    .slice(0, 3);
  const displayedIds = new Set([
    regularOffer?.id,
    ...highlighted.map((promotion) => promotion.id),
  ]);
  const remaining = filteredPromotions.filter(
    (promotion) => !displayedIds.has(promotion.id)
  );

  return (
    <section aria-labelledby="published-promotions-title" className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:p-5">
        <div>
          <h2 id="published-promotions-title" className="text-xl font-semibold text-foreground">
            Promociones publicadas
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Campañas y ofertas vigentes administradas desde el catálogo comercial.
          </p>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block max-w-md flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <span className="sr-only">Buscar promoción</span>
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar promoción..."
              className="pl-9"
            />
          </label>
          <ToggleGroup
            type="single"
            value={category}
            onValueChange={(value) => {
              if (value) {
                setCategory(value as (typeof categoryFilters)[number]["value"]);
              }
            }}
            variant="outline"
            className="flex-wrap justify-start lg:justify-end"
            aria-label="Filtrar promociones por categoría"
          >
            {categoryFilters.map((filter) => (
              <ToggleGroupItem key={filter.value} value={filter.value}>
                {filter.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>

      {regularOffer ? <RegularOffer promotion={regularOffer} /> : null}

      {highlighted.length ? (
        <PromotionCollection title="Destacadas" promotions={highlighted} />
      ) : null}

      {remaining.length ? (
        <PromotionCollection
          title={highlighted.length ? "Más promociones" : "Promociones vigentes"}
          promotions={remaining}
        />
      ) : null}

      {!filteredPromotions.length ? (
        <div className="rounded-xl border border-dashed border-border px-5 py-10 text-center">
          <Search className="mx-auto size-7 text-muted-foreground" />
          <p className="mt-3 font-medium text-foreground">No encontramos promociones</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Prueba otra búsqueda o categoría.
          </p>
        </div>
      ) : null}
    </section>
  );
}

function RegularOffer({ promotion }: { promotion: PublishedPromotion }) {
  const principal = getPromotionPrincipalAsset(promotion.assets);

  return (
    <article className="grid overflow-hidden rounded-xl border border-primary/30 bg-card lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)]">
      <div className="order-2 flex flex-col justify-center gap-4 p-5 lg:order-1 lg:p-7">
        <div className="flex flex-wrap gap-2">
          <Badge>Oferta Regular</Badge>
          {promotion.category ? <Badge variant="outline">{promotion.category}</Badge> : null}
          {promotion.featured ? <Badge variant="secondary">Destacada</Badge> : null}
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-foreground">{promotion.title}</h3>
          {promotion.shortDescription ? (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              {promotion.shortDescription}
            </p>
          ) : null}
        </div>
        <PromotionMetadata promotion={promotion} />
        <Button asChild className="w-fit">
          <Link href={`/promociones/${promotion.slug}`}>Consultar oferta</Link>
        </Button>
      </div>
      <PromotionImage asset={principal} title={promotion.title} className="order-1 min-h-56 border-b border-border lg:order-2 lg:border-b-0 lg:border-l" />
    </article>
  );
}

function PromotionCollection({
  title,
  promotions,
}: {
  title: string;
  promotions: PublishedPromotion[];
}) {
  return (
    <section aria-label={title}>
      <h3 className="mb-3 text-lg font-semibold text-foreground">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {promotions.map((promotion) => (
          <PromotionCard key={promotion.id} promotion={promotion} />
        ))}
      </div>
    </section>
  );
}

function PromotionCard({ promotion }: { promotion: PublishedPromotion }) {
  const principal = getPromotionPrincipalAsset(promotion.assets);

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <PromotionImage asset={principal} title={promotion.title} className="min-h-52 border-b border-border" />
      <CardHeader className="flex-1">
        <div className="flex flex-wrap gap-2">
          {promotion.category ? <Badge variant="outline">{promotion.category}</Badge> : null}
          {promotion.featured ? <Badge variant="secondary"><Sparkles /> Destacada</Badge> : null}
        </div>
        <CardTitle className="text-lg">{promotion.title}</CardTitle>
        {promotion.shortDescription ? (
          <CardDescription className="line-clamp-3 leading-6">
            {promotion.shortDescription}
          </CardDescription>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <PromotionMetadata promotion={promotion} />
        <Button asChild variant="outline" className="w-full">
          <Link href={`/promociones/${promotion.slug}`}>Ver promoción</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function PromotionImage({
  asset,
  title,
  className,
}: {
  asset: PromotionAssetPresentation | null;
  title: string;
  className: string;
}) {
  if (!asset) {
    return (
      <div className={`grid place-items-center bg-muted/20 p-6 ${className}`}>
        <ImageIcon className="size-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center bg-muted/20 p-3 ${className}`}>
      <Image
        src={getPromotionAssetUrl(asset.id)}
        alt={asset.altText ?? `Material de ${title}`}
        width={asset.width ?? 1000}
        height={asset.height ?? 700}
        unoptimized
        className="max-h-72 w-full object-contain"
      />
    </div>
  );
}

function PromotionMetadata({ promotion }: { promotion: PublishedPromotion }) {
  const technologies = asStringArray(promotion.technologies);
  const playTypes = asStringArray(promotion.playTypes);
  const hasValidity = Boolean(promotion.validFrom || promotion.validUntil);

  if (!technologies.length && !playTypes.length && !hasValidity) return null;

  return (
    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
      {technologies.length || playTypes.length ? (
        <div className="flex flex-wrap gap-2">
          {[...technologies, ...playTypes].map((item) => (
            <Badge key={item} variant="secondary">{item}</Badge>
          ))}
        </div>
      ) : null}
      {hasValidity ? (
        <span className="inline-flex items-center gap-1.5">
          <CalendarRange className="size-4" />
          {formatPromotionValidity(promotion.validFrom, promotion.validUntil)}
        </span>
      ) : null}
    </div>
  );
}

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}
