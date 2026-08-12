import { PromoCatalog } from "@/components/offers/PromoCatalog";
import { PageHeader } from "@/components/common/PageHeader";
import { connection } from "next/server";
import { getActivePromotionOffers } from "@/lib/promotions";

export const runtime = "nodejs";

const promotionQuickAccess = [
  { href: "#promo-oferta-regular", label: "Oferta Regular" },
  { href: "#promo-canales", label: "Canales y tecnologías" },
  { href: "#promo-oferta-medio", label: "Promo Medio" },
  { href: "#promo-oferta-basico", label: "Promo Básico" },
  { href: "#promo-promo-grande", label: "Promo Grande" },
  { href: "#promo-hfc-puro", label: "HFC Puro" },
  { href: "#promo-linea-movil", label: "Línea móvil" },
  { href: "#promo-promo-1-sol", label: "Promo S/1" },
];

export default async function PromocionesPage() {
  await connection();
  const ofertas = await getActivePromotionOffers();

  return (
    <main>
      <PageHeader
        eyebrow="Consulta comercial"
        title="Promociones Claro"
        description="Material oficial agrupado por promoción, con sus anexos en un solo lugar."
        tone="dark"
      />

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:py-7">
        <nav
          aria-label="Accesos rápidos de promociones"
          className="mb-6 flex flex-wrap gap-2 border-b border-white/10 pb-4"
        >
          {promotionQuickAccess.map((access) => (
            <a
              key={access.href}
              href={access.href}
              data-promotion-scroll-target={access.href.slice(1)}
              className="inline-flex h-10 items-center rounded-lg border border-white/10 bg-white/[0.045] px-3 text-sm font-semibold text-slate-200 transition hover:border-[#DA291C]/40 hover:bg-[#DA291C]/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8D83]"
            >
              {access.label}
            </a>
          ))}
        </nav>
        <PromoCatalog ofertas={ofertas} />
      </div>
    </main>
  );
}
