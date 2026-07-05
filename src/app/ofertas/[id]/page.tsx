import {
  ArrowLeft,
  BadgeDollarSign,
  BookOpen,
  CheckCircle2,
  Clock3,
  FileText,
  Gauge,
  MapPinned,
  ShieldAlert,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import type { ReactNode } from "react";
import { StatusBadge, TechnologyBadge } from "@/components/common/StatusBadge";
import { ImportantCondition } from "@/components/offers/ImportantCondition";
import { OfferImageDialog } from "@/components/offers/OfferImageDialog";
import { OfficialImage } from "@/components/offers/OfficialImage";
import { PromoBadge } from "@/components/offers/PromoBadge";
import type { Oferta } from "@/lib/offer-utils";
import { getPromotionOfferByIdOrSlug } from "@/lib/promotions";
import { cn } from "@/lib/utils";

export const runtime = "nodejs";

export default async function OfertaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connection();

  const { id } = await params;
  const oferta = await getPromotionOfferByIdOrSlug(id);

  if (!oferta) {
    notFound();
  }

  const cityNote = getCityNote(oferta);
  const hasMainImage = Boolean(oferta.media.principal);

  return (
    <main className="relative">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
          <Link
            href="/promociones"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.08] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.13]"
          >
            <ArrowLeft className="h-5 w-5" />
            Volver a promociones
          </Link>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <div className="flex flex-wrap gap-2">
                <PromoBadge tone="red">{oferta.categoria}</PromoBadge>
                <StatusBadge estado={oferta.estado} />
                {oferta.tecnologia.map((tecnologia) => (
                  <TechnologyBadge key={tecnologia} tecnologia={tecnologia} />
                ))}
              </div>

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {oferta.nombre}
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-300">
                {oferta.resumen}
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-[#172033] p-4 shadow-[0_18px_42px_rgba(0,0,0,0.26)]">
              <p className="text-sm font-medium text-slate-300">
                Condición comercial
              </p>
              <p className="mt-1 text-3xl font-bold text-[#FFB4AC]">
                {oferta.precio}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {oferta.detallePrecio}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-8">
        <section className="space-y-6">
          <Panel title="Imagen oficial" icon={FileText}>
            {hasMainImage ? (
              <OfferImageDialog
                src={oferta.media.principal!}
                title={oferta.nombre}
                preview
                preload
                variant="hero"
              />
            ) : (
              <OfficialImage variant="hero" />
            )}
          </Panel>

          {oferta.id === "oferta-regular" ? (
            <ImportantCondition title="Oferta base" tone="neutral">
              El detalle de precios para One Play, Two Play y Three Play está en
              la imagen oficial. Manejarla como condición regular / estándar,
              no como promoción de precio único.
            </ImportantCondition>
          ) : null}

          {oferta.id === "promo-1-sol" ? (
            <ImportantCondition title="Promoción especial" tone="warning">
              Validar calificación. Aplica por 2 meses y luego precio regular.
            </ImportantCondition>
          ) : null}

          {oferta.media.ciudades ? (
            <Panel title="Ciudades / zonas aplicables" icon={MapPinned}>
              <OfferImageDialog
                src={oferta.media.ciudades}
                title={`Zonas aplicables - ${oferta.nombre}`}
                description="Ciudades / zonas aplicables según material oficial."
                hint="Toca para ampliar ciudades / zonas aplicables"
                preview
                showButton={false}
                variant="natural"
              />
            </Panel>
          ) : cityNote ? (
            <Panel title="Ciudades / zonas aplicables" icon={MapPinned}>
              <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {cityNote}
              </p>
            </Panel>
          ) : null}

          {oferta.media.adicionales?.length ? (
            <Panel title="Material adicional" icon={FileText}>
              <div className="grid gap-4">
                {oferta.media.adicionales.map((item) => (
                  <OfferImageDialog
                    key={item.src}
                    src={item.src}
                    title={item.titulo}
                    description={item.descripcion ?? "Material adicional oficial."}
                    hint="Toca para ampliar material adicional"
                    preview
                    showButton={false}
                    variant="natural"
                  />
                ))}
              </div>
            </Panel>
          ) : null}
        </section>

        <aside className="space-y-6">
          <Panel title="Datos clave" icon={CheckCircle2}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Fact
                icon={BadgeDollarSign}
                label="Precio"
                value={oferta.precio}
                strong
              />
              <Fact icon={Gauge} label="Velocidad" value={oferta.velocidad} />
              <Fact
                icon={Wifi}
                label="Tecnología"
                value={oferta.tecnologia.join(", ")}
              />
              <Fact icon={Clock3} label="Vigencia" value={oferta.vigencia} />
            </div>
          </Panel>

          {oferta.variantes?.length ? (
            <Panel title="Variantes oficiales" icon={BookOpen}>
              <div className="grid gap-3">
                {oferta.variantes.map((variante) => (
                  <div
                    key={`${variante.nombre}-${variante.precio}`}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#111827]">
                          {variante.nombre}
                        </p>
                        {variante.velocidad ? (
                          <p className="mt-1 text-sm text-slate-600">
                            {variante.velocidad}
                          </p>
                        ) : null}
                      </div>
                      <p className="shrink-0 text-lg font-bold text-[#DA291C]">
                        {variante.precio}
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {[variante.detalle, variante.luego]
                        .filter(Boolean)
                        .join(" ")}
                    </p>
                  </div>
                ))}
              </div>
            </Panel>
          ) : null}

          <Panel title="Condiciones comerciales" icon={FileText}>
            <p className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-medium leading-6 text-slate-800">
              {oferta.detallePrecio}
            </p>
          </Panel>

          <Panel title="Aplica para" icon={CheckCircle2}>
            <BulletList items={oferta.aplicaPara} icon="check" />
          </Panel>

          <Panel title="Restricciones" icon={ShieldAlert} tone="warning">
            <BulletList items={oferta.restricciones} icon="alert" />
          </Panel>

          <Panel title="Validar antes de ofrecer" icon={CheckCircle2}>
            <BulletList items={oferta.validaciones} icon="check" />
          </Panel>

          <Panel title="Frase sugerida de venta" icon={FileText}>
            <p className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm leading-6 text-[#7F1D1D]">
              {oferta.fraseVenta}
            </p>
          </Panel>
        </aside>
      </div>
    </main>
  );
}

function Panel({
  title,
  icon: Icon,
  tone = "default",
  children,
}: {
  title: string;
  icon: LucideIcon;
  tone?: "default" | "warning";
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "animate-fade-up rounded-lg border bg-white p-4 text-[#111827] shadow-[0_18px_42px_rgba(0,0,0,0.20)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_56px_rgba(0,0,0,0.24)] sm:p-5",
        tone === "warning" ? "border-yellow-200" : "border-white/70"
      )}
    >
      <div className="mb-4 flex items-center gap-3">
        <span
          className={cn(
            "grid h-10 w-10 place-items-center rounded-md",
            tone === "warning"
              ? "bg-[#FEF3C7] text-yellow-700"
              : "bg-red-50 text-[#DA291C]"
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <h2 className="text-lg font-semibold text-[#111827]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
  strong,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  strong?: boolean;
}) {
  const isValidationBadge = value.startsWith("Validar");

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="mb-1 flex items-center gap-2 text-xs font-medium text-slate-500">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      {isValidationBadge ? (
        <span className="inline-flex min-h-7 items-center rounded-md border border-yellow-200 bg-yellow-50 px-2 py-1 text-xs font-semibold text-yellow-800">
          {value}
        </span>
      ) : (
        <p
          className={cn(
            "leading-6",
            strong
              ? "text-lg font-bold text-[#DA291C]"
              : "text-sm font-semibold text-[#111827]"
          )}
        >
          {value}
        </p>
      )}
    </div>
  );
}

function BulletList({ items, icon }: { items: string[]; icon: "check" | "alert" }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
          {icon === "check" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-yellow-700" />
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function getCityNote(oferta: Oferta) {
  if (oferta.id === "oferta-relampago") {
    return "No tiene imagen separada de ciudades porque aplica a todas las ciudades.";
  }

  if (oferta.id === "promo-1-sol") {
    return "No tiene imagen separada de ciudades porque la imagen principal incluye las zonas aplicables.";
  }

  if (oferta.id === "linea-movil") {
    return "No usa ciudades; revisar el material adicional de Línea Max y Línea Ilimitado.";
  }

  return null;
}
