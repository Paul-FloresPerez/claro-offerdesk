import "server-only";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  normalizeEstadoOferta,
  normalizeTecnologia,
  type Oferta,
  type OfertaMediaAdicional,
  type OfertaVariante,
} from "@/lib/offer-utils";

export const promotionSelect = {
  id: true,
  slug: true,
  title: true,
  category: true,
  description: true,
  price: true,
  benefits: true,
  conditions: true,
  validity: true,
  imageUrl: true,
  isActive: true,
  sortOrder: true,
  status: true,
  detailPrice: true,
  speed: true,
  technologies: true,
  appliesTo: true,
  restrictions: true,
  validations: true,
  salesPhrase: true,
  cityImageUrl: true,
  additionalMedia: true,
  variants: true,
} satisfies Prisma.PromotionSelect;

export type PromotionRecord = Prisma.PromotionGetPayload<{
  select: typeof promotionSelect;
}>;

export async function getActivePromotionOffers() {
  const promotions = await prisma.promotion.findMany({
    where: {
      isActive: true,
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        title: "asc",
      },
    ],
    select: promotionSelect,
  });

  return promotions.map(promotionToOferta);
}

export async function getPromotionOfferByIdOrSlug(identifier: string) {
  const promotion = await prisma.promotion.findFirst({
    where: {
      isActive: true,
      OR: [
        {
          id: identifier,
        },
        {
          slug: identifier,
        },
      ],
    },
    select: promotionSelect,
  });

  return promotion ? promotionToOferta(promotion) : null;
}

export function promotionToOferta(promotion: PromotionRecord): Oferta {
  const benefits = jsonStringList(promotion.benefits);
  const conditions = jsonStringList(promotion.conditions);
  const restrictions = nonEmptyList(promotion.restrictions, conditions);
  const validations = nonEmptyList(promotion.validations, [
    "Validar cobertura y condiciones vigentes antes de ofrecer.",
  ]);
  const appliesTo = nonEmptyList(promotion.appliesTo, [
    "Clientes segun evaluacion comercial y cobertura.",
  ]);
  const detailPrice =
    promotion.detailPrice ??
    conditions[0] ??
    promotion.description ??
    "Validar condiciones vigentes.";
  const technologies = nonEmptyList(promotion.technologies, [
    "Validar tecnologia",
  ]).map(normalizeTecnologia);

  return {
    id: promotion.slug || promotion.id,
    nombre: promotion.title,
    categoria: normalizeCategory(promotion.category ?? "Hogar"),
    precio: promotion.price ?? "Validar precio",
    detallePrecio: detailPrice,
    velocidad: promotion.speed ?? "Validar velocidad",
    tecnologia: technologies,
    vigencia: promotion.validity ?? "Validar vigencia",
    estado: normalizeEstadoOferta(promotion.status),
    resumen: promotion.description ?? "Promocion disponible para revision comercial.",
    media: {
      principal: promotion.imageUrl ?? undefined,
      ciudades: promotion.cityImageUrl ?? undefined,
      adicionales: parseAdditionalMedia(promotion.additionalMedia),
    },
    variantes: parseVariants(promotion.variants),
    beneficios: nonEmptyList(benefits, [
      "Beneficio pendiente de detallar.",
    ]),
    aplicaPara: appliesTo,
    restricciones: restrictions,
    validaciones: validations,
    fraseVenta:
      promotion.salesPhrase ??
      "Revisa la promocion con el cliente, valida cobertura y confirma condiciones antes de cerrar la venta.",
  };
}

function normalizeCategory(value: string) {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (normalized.includes("oferta base")) return "Oferta base";
  if (normalized.includes("hfc")) return "Tecnologia / HFC";
  if (normalized.includes("especial")) return "Promociones especiales";
  if (normalized.includes("movil") || normalized.includes("vil")) {
    return "Linea Movil";
  }
  if (normalized.includes("hogar")) return "Hogar";

  return value;
}

function nonEmptyList(primary: string[], fallback: string[]) {
  return primary.length ? primary : fallback;
}

function jsonStringList(value: Prisma.JsonValue | null): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function parseAdditionalMedia(
  value: Prisma.JsonValue | null
): OfertaMediaAdicional[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const items = value.filter(isAdditionalMedia);
  return items.length ? items : undefined;
}

function parseVariants(value: Prisma.JsonValue | null): OfertaVariante[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const items = value.filter(isVariant);
  return items.length ? items : undefined;
}

function isAdditionalMedia(value: unknown): value is OfertaMediaAdicional {
  if (!isRecord(value)) return false;
  return typeof value.titulo === "string" && typeof value.src === "string";
}

function isVariant(value: unknown): value is OfertaVariante {
  if (!isRecord(value)) return false;
  return typeof value.nombre === "string" && typeof value.precio === "string";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
