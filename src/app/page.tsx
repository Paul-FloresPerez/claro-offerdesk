import {
  AlertTriangle,
  BadgeDollarSign,
  BookOpen,
  CheckCircle2,
  Gauge,
  Home,
  ListChecks,
  PackageCheck,
  RadioTower,
  Smartphone,
  Sparkles,
  Wifi,
} from "lucide-react";
import Link from "next/link";
import { GlobalOfferSearch } from "@/components/dashboard/GlobalOfferSearch";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { OfferCard } from "@/components/offers/OfferCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { categoriasOferta, ofertas } from "@/data/ofertas";

const quickNeeds = [
  { label: "Pagar menos", href: "/recomendador", icon: BadgeDollarSign },
  { label: "Internet para familia", href: "/recomendador", icon: Home },
  { label: "Alta velocidad", href: "/recomendador", icon: Gauge },
  { label: "Fibra óptica", href: "/recomendador", icon: Wifi },
  { label: "HFC Puro", href: "/ofertas/hfc-puro", icon: RadioTower },
  { label: "Línea Móvil", href: "/ofertas/linea-movil", icon: Smartphone },
  { label: "Promoción especial", href: "/recomendador", icon: Sparkles },
  { label: "Catálogo regular", href: "/ofertas/oferta-regular", icon: BookOpen },
];

const commercialAlerts = [
  "Validar cobertura",
  "Validar tecnología",
  "Validar vigencia",
  "Validar condiciones antes de ofrecer",
];

export default function HomePage() {
  const ofertasActivas = ofertas.filter(
    (oferta) => oferta.estado === "material-oficial" || oferta.estado === "validar"
  );
  const tecnologias = new Set(
    ofertas.flatMap((oferta) =>
      oferta.tecnologia.filter((item) => item !== "Por confirmar")
    )
  );

  return (
    <main className="relative">
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_12%_20%,rgba(218,41,28,0.16),transparent_26rem)]">
        <div className="pointer-events-none absolute right-8 top-6 h-40 w-40 rounded-full border border-[#DA291C]/20" />
        <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_380px] lg:items-center">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#DA291C] text-lg font-black text-white shadow-[0_10px_22px_rgba(218,41,28,0.34)] ring-1 ring-white/10">
                C
              </span>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-white">
                  Claro OfferDesk
                </h1>
                <p className="text-sm text-slate-300">
                  Consola comercial para asesores
                </p>
              </div>
            </div>
            <p className="max-w-3xl text-sm leading-6 text-slate-300">
              Consulta promociones oficiales, revisa imágenes, valida restricciones
              y decide qué ofrecer al cliente durante la llamada.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Button asChild className="flex-1 bg-[#DA291C] text-white hover:bg-[#B91C1C]">
                <Link href="/ofertas">
                  <PackageCheck className="h-4 w-4" />
                  Ver ofertas
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/recomendador">
                  <Sparkles className="h-4 w-4" />
                  Recomendador
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-7 px-4 py-6 sm:px-6">
        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <GlobalOfferSearch />

            <div className="rounded-lg border border-white/10 bg-[#172033]/95 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.24)]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#DA291C]">
                    Acción rápida en llamada
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-white">
                    ¿Qué necesita el cliente?
                  </h2>
                </div>
                <span className="hidden rounded-md bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-300 sm:inline-flex">
                  Selección asistida
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {quickNeeds.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group flex min-h-20 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.06] p-3 text-sm font-semibold text-slate-100 transition hover:border-[#DA291C]/40 hover:bg-[#DA291C]/10"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-white text-[#DA291C] shadow-sm ring-1 ring-white/20 transition group-hover:ring-[#DA291C]/30">
                      <item.icon className="h-4 w-4" />
                    </span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <MetricCard
                title="Ofertas activas"
                value={String(ofertasActivas.length)}
                description="Con material o validar"
                icon={PackageCheck}
              />
              <MetricCard
                title="Catálogos / promociones"
                value={String(ofertas.length)}
                description="Incluye Oferta Regular"
                icon={BookOpen}
              />
              <MetricCard
                title="Tecnologías disponibles"
                value={String(tecnologias.size)}
                description="HFC, HFC Plus, FTTH, móvil"
                icon={RadioTower}
              />
              <MetricCard
                title="Validaciones críticas"
                value="4"
                description="Antes de ofrecer"
                icon={ListChecks}
              />
            </div>

            <Alert className="rounded-lg border-yellow-200 bg-[#FEF3C7] shadow-[0_14px_34px_rgba(0,0,0,0.16)]">
              <AlertTriangle className="h-4 w-4 text-yellow-700" />
              <AlertTitle className="text-yellow-900">
                Alertas comerciales
              </AlertTitle>
              <AlertDescription className="mt-3 grid gap-2 text-yellow-900">
                {commercialAlerts.map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    {item}
                  </span>
                ))}
              </AlertDescription>
            </Alert>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#DA291C]">
                Consulta rápida
              </p>
              <h2 className="mt-1 text-xl font-semibold text-white">
                Ofertas agrupadas por categoría
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Catálogo regular, hogar, HFC, promociones especiales y móvil.
              </p>
            </div>
            <Button
              asChild
              variant="outline"
              className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/ofertas">Ver tabla comparativa</Link>
            </Button>
          </div>

          {categoriasOferta.map((categoria) => {
            const items = ofertas.filter((oferta) => oferta.categoria === categoria);

            if (!items.length) {
              return null;
            }

            return (
              <div key={categoria} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="h-px flex-1 bg-white/10" />
                  <h3 className="rounded-md bg-[#172033] px-3 py-1 text-sm font-semibold uppercase tracking-[0.08em] text-slate-300 ring-1 ring-white/10">
                    {categoria}
                  </h3>
                  <span className="h-px flex-1 bg-white/10" />
                </div>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {items.map((oferta) => (
                    <OfferCard
                      key={oferta.id}
                      oferta={oferta}
                      featured={oferta.id === "oferta-regular"}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
