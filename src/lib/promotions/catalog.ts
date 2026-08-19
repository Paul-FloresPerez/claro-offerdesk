import "server-only";

import type { Prisma } from "@prisma/client";
import { requireAdmin } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import { getPublishedPromotionWhere } from "@/lib/promotions/publication";

const publishedPromotionSelect = {
  id: true,
  slug: true,
  title: true,
  shortDescription: true,
  kind: true,
  category: true,
  tags: true,
  featured: true,
  sortOrder: true,
  validFrom: true,
  validUntil: true,
  technologies: true,
  playTypes: true,
  zoneSummary: true,
  benefits: true,
  conditions: true,
  validations: true,
  commercialText: true,
  publishedAt: true,
} satisfies Prisma.PromotionSelect;

const publishedAssetSelect = {
  id: true,
  kind: true,
  displayName: true,
  mimeType: true,
  altText: true,
  sortOrder: true,
  sizeBytes: true,
  width: true,
  height: true,
} satisfies Prisma.PromotionAssetSelect;

export async function getPublishedPromotions(now = new Date()) {
  return prisma.promotion.findMany({
    where: getPublishedPromotionWhere(now),
    select: publishedPromotionSelect,
    orderBy: [
      { featured: "desc" },
      { sortOrder: "asc" },
      { title: "asc" },
    ],
  });
}

export async function getPublishedPromotionBySlug(
  slug: string,
  now = new Date()
) {
  const normalizedSlug = slug.trim().toLowerCase();

  if (!slugPattern.test(normalizedSlug)) return null;

  return prisma.promotion.findFirst({
    where: {
      ...getPublishedPromotionWhere(now),
      slug: normalizedSlug,
    },
    select: {
      ...publishedPromotionSelect,
      assets: {
        select: publishedAssetSelect,
        orderBy: [{ sortOrder: "asc" }, { displayName: "asc" }],
      },
    },
  });
}

export async function getPromotionForAdmin(identifier: string) {
  await requireAdmin();
  const normalizedIdentifier = identifier.trim().toLowerCase();
  const where = uuidPattern.test(normalizedIdentifier)
    ? { id: normalizedIdentifier }
    : { slug: normalizedIdentifier };

  return prisma.promotion.findUnique({
    where,
    include: {
      assets: {
        orderBy: [{ sortOrder: "asc" }, { displayName: "asc" }],
      },
    },
  });
}

export async function getPromotionAssets(promotionId: string) {
  await requireAdmin();

  if (!uuidPattern.test(promotionId)) return [];

  return prisma.promotionAsset.findMany({
    where: { promotionId },
    orderBy: [{ sortOrder: "asc" }, { displayName: "asc" }],
  });
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
