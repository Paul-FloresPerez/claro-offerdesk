import { connection } from "next/server";
import AdminShell from "@/components/admin/AdminShell";
import PromotionForm, {
  type AdminPromotionRow,
} from "@/components/admin/PromotionForm";
import PromotionTable from "@/components/admin/PromotionTable";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const runtime = "nodejs";

export default async function AdminPromocionesPage() {
  await connection();

  const promotions = await prisma.promotion.findMany({
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        title: "asc",
      },
    ],
    select: {
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
      createdAt: true,
      updatedAt: true,
    },
  });

  const rows: AdminPromotionRow[] = promotions.map((promotion) => ({
    id: promotion.id,
    slug: promotion.slug,
    title: promotion.title,
    category: promotion.category ?? "Hogar",
    description:
      promotion.description ?? "Promocion disponible para revision comercial.",
    price: promotion.price ?? "Validar precio",
    benefits: jsonStringList(promotion.benefits),
    conditions: jsonStringList(promotion.conditions),
    validity: promotion.validity ?? "Validar vigencia",
    imageUrl: promotion.imageUrl,
    isActive: promotion.isActive,
    sortOrder: promotion.sortOrder,
    createdAt: promotion.createdAt.toISOString(),
    updatedAt: promotion.updatedAt.toISOString(),
  }));

  return (
    <AdminShell
      title="Promociones"
      description="Crea, edita y activa promociones visibles en el catalogo comercial."
      statusBadge={
        <span className="inline-flex w-fit rounded-lg border border-emerald-400/25 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
          Conectado a promotions
        </span>
      }
    >
      <div className="grid gap-6">
        <PromotionForm />
        <PromotionTable promotions={rows} />
      </div>
    </AdminShell>
  );
}

function jsonStringList(value: Prisma.JsonValue | null): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}
