import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  FileText,
  type LucideIcon,
  MapPinned,
  ShieldAlert,
} from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import { StatusBadge, TechnologyBadge } from "@/components/common/StatusBadge";
import { OfficialImage } from "@/components/offers/OfficialImage";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOfertaById, ofertas, type Oferta } from "@/data/ofertas";
import { cn } from "@/lib/utils";

export async function generateStaticParams() {
  return ofertas.map((oferta) => ({ id: oferta.id }));
}

export default async function OfertaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const oferta = getOfertaById(id);

  if (!oferta) {
    notFound();
  }

  const cityNote = getCityNote(oferta);

  return (
    <main>
      <section className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_16%_20%,rgba(218,41,28,0.16),transparent_25rem)]">
        <div className="pointer-events-none absolute right-8 top-8 h-44 w-44 rounded-full border border-[#DA291C]/20" />
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="inline-flex h-6 items-center rounded-md border border-[#DA291C]/30 bg-[#DA291C]/15 px-2 text-xs font-semibold text-[#FFB4AC]">
                {oferta.categoria}
              </span>
              <StatusBadge estado={oferta.estado} />
              {oferta.tecnologia.map((tecnologia) => (
                <TechnologyBadge key={tecnologia} tecnologia={tecnologia} />
              ))}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {oferta.nombre}
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {oferta.resumen}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="rounded-lg border border-white/10 bg-white/8 px-4 py-2 text-white">
              <p className="text-xs text-slate-300">Precio</p>
              <p className="font-bold text-[#FFB4AC]">{oferta.precio}</p>
            </div>
            <Button
              asChild
              variant="outline"
              className="border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/ofertas">
                <ArrowLeft className="h-4 w-4" />
                Volver a ofertas
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.12fr_0.88fr]">
        <section className="space-y-6">
          {oferta.media.principal ? (
            <Panel title="Imagen principal oficial" icon={FileText}>
              <OfficialImage
                item={oferta.media.principal}
                title={oferta.nombre}
                variant="hero"
              />
            </Panel>
          ) : !oferta.media.adicionales?.length ? (
            <Panel title="Imagen oficial" icon={FileText}>
              <OfficialImage variant="hero" />
            </Panel>
          ) : null}

          {oferta.id === "oferta-regular" ? (
            <div className="rounded-lg border border-[#DA291C]/25 bg-[#172033] p-4 text-white shadow-[0_16px_36px_rgba(0,0,0,0.20)]">
              <div className="flex gap-3">
                <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-[#FFB4AC]" />
                <div>
                  <h2 className="font-semibold text-white">
                    Catálogo oficial de precios
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    El detalle de precios para One Play, Two Play y Three Play
                    está en la imagen oficial. No manejar esta ficha como una
                    promoción de precio único.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {oferta.media.ciudades ? (
            <Panel title="Ciudades / zonas aplicables" icon={MapPinned}>
              <OfficialImage
                item={oferta.media.ciudades}
                title={`Zonas aplicables - ${oferta.nombre}`}
                variant="natural"
              />
            </Panel>
          ) : cityNote ? (
            <Panel title="Ciudades / zonas aplicables" icon={MapPinned}>
              <div className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                <MapPinned className="mt-0.5 h-5 w-5 shrink-0 text-[#DA291C]" />
                <span>{cityNote}</span>
              </div>
            </Panel>
          ) : null}

          {oferta.media.adicionales?.length ? (
            <Panel title="Material adicional" icon={FileText}>
              <div className="grid gap-4">
                {oferta.media.adicionales.map((item) => (
                  <OfficialImage key={item.src} item={item} variant="natural" />
                ))}
              </div>
            </Panel>
          ) : null}
        </section>

        <aside className="space-y-6">
          <Panel title="Datos clave" icon={CheckCircle2}>
            <div className="grid gap-3 sm:grid-cols-2">
              <Fact label="Precio" value={oferta.precio} strong />
              <Fact label="Velocidad" value={oferta.velocidad} />
              <Fact label="Tecnología" value={oferta.tecnologia.join(", ")} />
              <Fact label="Vigencia" value={oferta.vigencia} />
            </div>
            <p className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
              {oferta.detallePrecio}
            </p>
          </Panel>

          {oferta.variantes?.length ? (
            <Panel title="Variantes" icon={FileText}>
              <VariantTable oferta={oferta} />
            </Panel>
          ) : null}

          <Panel title="Aplica para" icon={CheckCircle2}>
            <BulletList items={oferta.aplicaPara} icon="check" />
          </Panel>

          <Panel title="Restricciones" icon={ShieldAlert} tone="warning">
            <BulletList items={oferta.restricciones} icon="alert" />
          </Panel>

          <Panel title="Validaciones antes de ofrecer" icon={CheckCircle2}>
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
        "rounded-lg border bg-white p-4 text-[#111827] shadow-[0_18px_40px_rgba(0,0,0,0.20)]",
        tone === "warning" ? "border-yellow-200" : "border-white/10"
      )}
    >
      <div className="mb-4 flex items-center gap-2">
        <span
          className={cn(
            "grid h-8 w-8 place-items-center rounded-md",
            tone === "warning"
              ? "bg-[#FEF3C7] text-yellow-700"
              : "bg-red-50 text-[#DA291C]"
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="text-base font-semibold text-[#111827]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Fact({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p
        className={
          strong
            ? "mt-1 text-lg font-bold text-[#DA291C]"
            : "mt-1 text-sm font-semibold leading-5 text-[#111827]"
        }
      >
        {value}
      </p>
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

function VariantTable({ oferta }: { oferta: Oferta }) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>Variante</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Velocidad</TableHead>
            <TableHead>Detalle</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {oferta.variantes?.map((variante) => (
            <TableRow key={`${variante.nombre}-${variante.precio}`}>
              <TableCell className="whitespace-normal font-medium">
                {variante.nombre}
              </TableCell>
              <TableCell className="font-semibold text-[#DA291C]">
                {variante.precio}
              </TableCell>
              <TableCell>{variante.velocidad ?? "Por confirmar"}</TableCell>
              <TableCell className="whitespace-normal text-slate-600">
                {[variante.detalle, variante.luego].filter(Boolean).join(" ")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
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
