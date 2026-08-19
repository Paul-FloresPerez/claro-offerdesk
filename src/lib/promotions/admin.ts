import "server-only";

import {
  Prisma,
  PromotionKind,
  PromotionStatus,
} from "@prisma/client";
import { requireAdmin } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import { validatePromotionForPublishing } from "@/lib/promotions/validation";
import {
  parsePromotionLocalDate,
  type PromotionDraftInput,
} from "@/lib/validations/promotions";

export type PromotionAdminFilters = {
  query?: string;
  status?: PromotionStatus | "ALL";
  category?: string | "ALL";
  kind?: PromotionKind | "ALL";
};

export async function listPromotionsForAdmin(filters: PromotionAdminFilters) {
  await requireAdmin();

  const query = filters.query?.trim();
  const where: Prisma.PromotionWhereInput = {
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(filters.status && filters.status !== "ALL"
      ? { status: filters.status }
      : {}),
    ...(filters.category && filters.category !== "ALL"
      ? { category: filters.category }
      : {}),
    ...(filters.kind && filters.kind !== "ALL" ? { kind: filters.kind } : {}),
  };

  const [promotions, groupedStatuses] = await Promise.all([
    prisma.promotion.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        kind: true,
        status: true,
        category: true,
        featured: true,
        sortOrder: true,
        validFrom: true,
        validUntil: true,
        updatedAt: true,
        _count: { select: { assets: true } },
      },
      orderBy: [
        { featured: "desc" },
        { sortOrder: "asc" },
        { updatedAt: "desc" },
      ],
    }),
    prisma.promotion.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);

  const metrics = { total: 0, draft: 0, published: 0, archived: 0 };

  for (const group of groupedStatuses) {
    metrics.total += group._count._all;
    if (group.status === PromotionStatus.DRAFT) metrics.draft = group._count._all;
    if (group.status === PromotionStatus.PUBLISHED)
      metrics.published = group._count._all;
    if (group.status === PromotionStatus.ARCHIVED)
      metrics.archived = group._count._all;
  }

  return { promotions, metrics };
}

export async function createPromotionDraft(input: PromotionDraftInput) {
  await requireAdmin();
  await assertUniqueSlug(input.slug);

  return prisma.promotion.create({
    data: {
      ...promotionData(input),
      status: PromotionStatus.DRAFT,
    },
    select: { id: true },
  });
}

export async function updatePromotionForAdmin(
  promotionId: string,
  input: PromotionDraftInput
) {
  await requireAdmin();
  await assertUniqueSlug(input.slug, promotionId);

  const current = await prisma.promotion.findUnique({
    where: { id: promotionId },
    select: {
      id: true,
      status: true,
      assets: {
        select: { kind: true, fileKey: true, mimeType: true },
      },
    },
  });

  if (!current) throw new PromotionAdminError("NOT_FOUND", "La promoción no existe.");

  if (current.status === PromotionStatus.PUBLISHED) {
    const next = promotionData(input);
    const validation = validatePromotionForPublishing({
      title: next.title,
      slug: next.slug,
      shortDescription: next.shortDescription,
      category: next.category,
      kind: next.kind,
      status: current.status,
      validFrom: next.validFrom,
      validUntil: next.validUntil,
      assets: current.assets,
    });

    if (!validation.valid) {
      throw new PromotionAdminError(
        "PUBLISHED_INVALID",
        "Los cambios dejarían inválida una promoción publicada. Despublícala primero o corrige los campos.",
        validation.errors.map((error) => error.message)
      );
    }
  }

  return prisma.promotion.update({
    where: { id: current.id },
    data: promotionData(input),
    select: { id: true },
  });
}

export async function publishPromotion(promotionId: string) {
  await requireAdmin();

  return prisma.$transaction(async (transaction) => {
    const promotion = await transaction.promotion.findUnique({
      where: { id: promotionId },
      include: {
        assets: { select: { kind: true, fileKey: true, mimeType: true } },
      },
    });

    if (!promotion) throw new PromotionAdminError("NOT_FOUND", "La promoción no existe.");

    const validation = validatePromotionForPublishing(promotion);

    if (!validation.valid) {
      throw new PromotionAdminError(
        "PUBLISHING_INVALID",
        "Antes de publicar completa lo siguiente:",
        validation.errors.map((error) => error.message)
      );
    }

    return transaction.promotion.update({
      where: { id: promotion.id },
      data: {
        status: PromotionStatus.PUBLISHED,
        publishedAt: promotion.publishedAt ?? new Date(),
      },
      select: { id: true },
    });
  });
}

export async function unpublishPromotion(promotionId: string) {
  await requireAdmin();
  return transitionPromotionStatus(
    promotionId,
    [PromotionStatus.PUBLISHED],
    PromotionStatus.DRAFT
  );
}

export async function archivePromotion(promotionId: string) {
  await requireAdmin();
  return transitionPromotionStatus(
    promotionId,
    [PromotionStatus.DRAFT, PromotionStatus.PUBLISHED],
    PromotionStatus.ARCHIVED
  );
}

export async function restorePromotion(promotionId: string) {
  await requireAdmin();

  const promotion = await prisma.promotion.findUnique({
    where: { id: promotionId },
    select: { status: true },
  });

  if (!promotion) throw new PromotionAdminError("NOT_FOUND", "La promoción no existe.");
  if (promotion.status !== PromotionStatus.ARCHIVED) {
    throw new PromotionAdminError(
      "INVALID_TRANSITION",
      "Solo una promoción archivada puede restaurarse."
    );
  }

  return transitionPromotionStatus(
    promotionId,
    [PromotionStatus.ARCHIVED],
    PromotionStatus.DRAFT
  );
}

export async function setPromotionFeatured(promotionId: string, featured: boolean) {
  await requireAdmin();

  try {
    return await prisma.promotion.update({
      where: { id: promotionId },
      data: { featured },
      select: { id: true },
    });
  } catch (error) {
    if (isPrismaNotFound(error)) {
      throw new PromotionAdminError("NOT_FOUND", "La promoción no existe.");
    }
    throw error;
  }
}

function promotionData(input: PromotionDraftInput) {
  return {
    title: input.title,
    slug: input.slug,
    shortDescription: input.shortDescription,
    kind: input.kind as PromotionKind,
    category: input.category,
    tags: input.tags,
    featured: input.featured,
    sortOrder: input.sortOrder,
    validFrom: input.validFrom ? parsePromotionLocalDate(input.validFrom) : null,
    validUntil: input.validUntil ? parsePromotionLocalDate(input.validUntil) : null,
    technologies: input.technologies,
    playTypes: input.playTypes,
    zoneSummary: input.zoneSummary,
    benefits: input.benefits,
    conditions: input.conditions,
    validations: input.validations,
    commercialText: input.commercialText,
  };
}

async function assertUniqueSlug(slug: string, excludeId?: string) {
  const existing = await prisma.promotion.findFirst({
    where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    select: { id: true },
  });

  if (existing) {
    throw new PromotionAdminError(
      "SLUG_CONFLICT",
      "Ese slug ya pertenece a otra promoción. Elige uno diferente."
    );
  }
}

async function transitionPromotionStatus(
  promotionId: string,
  allowedStatuses: PromotionStatus[],
  status: PromotionStatus
) {
  try {
    // publishedAt se conserva al despublicar o archivar para mantener trazabilidad.
    const result = await prisma.promotion.updateMany({
      where: { id: promotionId, status: { in: allowedStatuses } },
      data: { status },
    });

    if (result.count === 0) {
      const exists = await prisma.promotion.findUnique({
        where: { id: promotionId },
        select: { id: true },
      });
      if (!exists) {
        throw new PromotionAdminError("NOT_FOUND", "La promoción no existe.");
      }
      throw new PromotionAdminError(
        "INVALID_TRANSITION",
        "El estado actual de la promoción no permite esa transición."
      );
    }

    return { id: promotionId };
  } catch (error) {
    if (error instanceof PromotionAdminError) throw error;
    if (isPrismaNotFound(error)) {
      throw new PromotionAdminError("NOT_FOUND", "La promoción no existe.");
    }
    throw error;
  }
}

function isPrismaNotFound(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
}

export class PromotionAdminError extends Error {
  constructor(
    public readonly code:
      | "INVALID_TRANSITION"
      | "NOT_FOUND"
      | "PUBLISHED_INVALID"
      | "PUBLISHING_INVALID"
      | "SLUG_CONFLICT",
    message: string,
    public readonly details: string[] = []
  ) {
    super(message);
    this.name = "PromotionAdminError";
  }
}
