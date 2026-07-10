import type { Prisma } from "@prisma/client";

export const rankingOrder = [
  { salesCount: "desc" },
  { rejectedSales: "asc" },
  { pendingSales: "desc" },
  { fullName: "asc" },
  { updatedAt: "desc" },
  { id: "asc" },
] satisfies Prisma.SalesRankingOrderByWithRelationInput[];

export function getRankingEffectiveness(
  salesCount: number,
  rejectedSales: number
) {
  const resolvedSales = salesCount + rejectedSales;

  if (resolvedSales === 0) {
    return null;
  }

  return Math.round((salesCount / resolvedSales) * 100);
}

export function formatRankingEffectiveness(effectiveness: number | null) {
  return effectiveness === null ? "Sin datos" : `${effectiveness}%`;
}
