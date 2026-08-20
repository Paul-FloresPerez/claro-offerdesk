import { PageHeader } from "@/components/common/PageHeader";
import { PromoCatalog } from "@/components/offers/PromoCatalog";
import { DynamicPromotionCatalog } from "@/components/promotions/DynamicPromotionCatalog";
import { connection } from "next/server";
import { getActivePromotionOffers } from "@/lib/promotions";
import { getPublishedPromotions } from "@/lib/promotions/catalog";

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
  const [publishedPromotions, ofertas] = await Promise.all([
    getPublishedPromotions(),
    getActivePromotionOffers(),
  ]);
  const dynamicLegacyIds = new Set(
    publishedPromotions.flatMap((promotion) =>
      promotion.legacyId ? [promotion.legacyId] : []
    )
  );
  const legacyOffers = ofertas.filter(
    (offer) => !dynamicLegacyIds.has(offer.id)
  );

  return (
    <main>
      <PageHeader
        eyebrow="Consulta comercial"
        title="PROMOCIONES"
        description="Consulta las campañas y ofertas vigentes."
        tone="dark"
      />

      <div className="mx-auto flex max-w-7xl flex-col gap-9 px-4 py-5 sm:px-6 lg:py-7">
        {publishedPromotions.length ? (
          <DynamicPromotionCatalog promotions={publishedPromotions} />
        ) : null}

        {legacyOffers.length ? (
          <section aria-labelledby="legacy-promotions-title" className="border-t border-border pt-7">
            <div className="mb-5">
              <h2 id="legacy-promotions-title" className="text-xl font-semibold text-foreground">
                Material comercial actual
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Consulta el catálogo base mientras las nuevas promociones se publican desde Administración.
              </p>
            </div>
            <nav
              aria-label="Accesos rápidos del catálogo base"
              className="mb-6 flex flex-wrap gap-2 border-b border-border pb-4"
            >
              {promotionQuickAccess
                .filter((access) =>
                  legacyOffers.some(
                    (offer) => `#promo-${offer.id}` === access.href ||
                      (access.href === "#promo-canales" && offer.id === "oferta-regular")
                  )
                )
                .map((access) => (
                  <a
                    key={access.href}
                    href={access.href}
                    data-promotion-scroll-target={access.href.slice(1)}
                    className="inline-flex h-10 items-center rounded-lg border border-border bg-card px-3 text-sm font-semibold text-muted-foreground transition hover:border-primary/40 hover:bg-primary/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {access.label}
                  </a>
                ))}
            </nav>
            <PromoCatalog ofertas={legacyOffers} />
          </section>
        ) : null}
      </div>
    </main>
  );
}
