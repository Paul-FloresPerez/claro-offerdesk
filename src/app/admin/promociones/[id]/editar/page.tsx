import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { PromotionEditor } from "@/components/admin/promotions/PromotionEditor";
import type { PromotionEditorValue } from "@/components/admin/promotions/types";
import { getPromotionForAdmin } from "@/lib/promotions/catalog";

export const runtime = "nodejs";

export default async function EditPromotionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const promotion = await getPromotionForAdmin((await params).id);
  if (!promotion) notFound();

  return (
    <AdminShell
      title={`Editar: ${promotion.title}`}
      description="Actualiza contenido, vigencia, segmentación y materiales sin perder el historial editorial."
    >
      <PromotionEditor promotion={serializePromotion(promotion)} />
    </AdminShell>
  );
}

function serializePromotion(
  promotion: NonNullable<Awaited<ReturnType<typeof getPromotionForAdmin>>>
): PromotionEditorValue {
  return {
    id: promotion.id,
    title: promotion.title,
    slug: promotion.slug,
    shortDescription: promotion.shortDescription,
    kind: promotion.kind,
    status: promotion.status,
    category: promotion.category,
    tags: asStringArray(promotion.tags),
    featured: promotion.featured,
    sortOrder: promotion.sortOrder,
    validFrom: toLimaDateTimeLocal(promotion.validFrom),
    validUntil: toLimaDateTimeLocal(promotion.validUntil),
    technologies: asStringArray(promotion.technologies),
    playTypes: asStringArray(promotion.playTypes),
    zoneSummary: promotion.zoneSummary,
    benefits: asStringArray(promotion.benefits),
    conditions: asStringArray(promotion.conditions),
    validations: asStringArray(promotion.validations),
    commercialText: promotion.commercialText,
    publishedAt: promotion.publishedAt?.toISOString() ?? null,
    assets: promotion.assets.map((asset) => ({
      id: asset.id,
      kind: asset.kind,
      displayName: asset.displayName,
      mimeType: asset.mimeType,
      altText: asset.altText,
      sortOrder: asset.sortOrder,
      sizeBytes: asset.sizeBytes,
      width: asset.width,
      height: asset.height,
      createdAt: asset.createdAt.toISOString(),
    })),
  };
}

function asStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function toLimaDateTimeLocal(value: Date | null) {
  if (!value) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "America/Lima",
  }).formatToParts(value);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((candidate) => candidate.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
}
