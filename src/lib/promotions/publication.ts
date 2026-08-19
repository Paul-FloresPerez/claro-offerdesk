import "server-only";

import { PromotionStatus, type Prisma } from "@prisma/client";

export type PromotionPublicationWindow = {
  status: PromotionStatus;
  validFrom: Date | null;
  validUntil: Date | null;
};

export function getPublishedPromotionWhere(
  now = new Date()
): Prisma.PromotionWhereInput {
  return {
    status: PromotionStatus.PUBLISHED,
    AND: [
      {
        OR: [{ validFrom: null }, { validFrom: { lte: now } }],
      },
      {
        OR: [{ validUntil: null }, { validUntil: { gte: now } }],
      },
    ],
  };
}

export function isPromotionCurrentlyPublished(
  promotion: PromotionPublicationWindow,
  now = new Date()
) {
  return (
    promotion.status === PromotionStatus.PUBLISHED &&
    (!promotion.validFrom || promotion.validFrom <= now) &&
    (!promotion.validUntil || promotion.validUntil >= now)
  );
}
