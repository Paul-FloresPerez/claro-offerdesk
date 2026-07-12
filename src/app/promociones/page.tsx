import { PromoCatalog } from "@/components/offers/PromoCatalog";
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
    <main className="relative">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute right-12 top-8 h-40 w-40 rounded-full border border-[#DA291C]/20" />
        <div className="pointer-events-none absolute right-24 top-20 h-48 w-48 rounded-full bg-[#DA291C]/10 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-1/2 h-px w-72 bg-gradient-to-l from-[#DA291C]/40 to-transparent" />

        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-7 sm:px-6 lg:grid-cols-[1fr_360px] lg:items-center lg:py-9">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#FFB4AC]">
              Claro OfferDesk
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Promociones Claro
            </h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-300">
              Galería interna organizada por promoción para consultar el material
              oficial y sus anexos en un solo lugar.
            </p>
          </div>

          <nav
            aria-label="Accesos rápidos de promociones"
            className="relative rounded-xl border border-white/10 bg-white/[0.07] p-4 shadow-[0_20px_56px_rgba(0,0,0,0.24)] backdrop-blur"
          >
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full border border-[#DA291C]/30" />
            <p className="relative text-xs font-semibold uppercase tracking-[0.14em] text-[#FFB4AC]">
              Accesos rápidos
            </p>
            <div className="relative mt-3 flex flex-wrap gap-2">
              {promotionQuickAccess.map((access) => (
                <a
                  key={access.href}
                  href={access.href}
                  className="inline-flex h-9 items-center rounded-full border border-white/10 bg-[#111827]/55 px-3 text-sm font-semibold text-slate-100 transition hover:border-[#DA291C]/45 hover:bg-[#DA291C]/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB4AC]"
                >
                  {access.label}
                </a>
              ))}
            </div>
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <PromoCatalog ofertas={ofertas} />
      </div>
    </main>
  );
}
