import { ExternalLink, FileCode2, PackageCheck } from "lucide-react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { getActivePromotionOffers, getPromotionMetrics } from "@/lib/promotions";

export const runtime = "nodejs";

export default async function AdminPromocionesPage() {
  const [ofertas, metrics] = await Promise.all([
    getActivePromotionOffers(),
    Promise.resolve(getPromotionMetrics()),
  ]);

  return (
    <AdminShell
      title="Promociones"
      description="Consulta el estado actual del catalogo comercial versionado en el sistema."
      statusBadge={
        <span className="inline-flex w-fit rounded-lg border border-sky-300/25 bg-sky-500/10 px-4 py-3 text-sm font-semibold text-sky-100">
          Versionadas en codigo
        </span>
      }
    >
      <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-[0_20px_56px_rgba(0,0,0,0.18)]">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-[#DA291C]/15 text-[#FFB4AC]">
              <FileCode2 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-white">
                Panel informativo
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Las promociones actuales estan versionadas en el sistema. Para
                editar promociones dinamicamente se habilitara base de datos en
                una fase posterior.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/promociones"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-[#DA291C] px-4 text-sm font-semibold text-white transition hover:bg-[#B91F15]"
            >
              <PackageCheck className="h-4 w-4" />
              Ver catalogo
            </Link>
            <Link
              href="/admin"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-4 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.1]"
            >
              Volver al resumen
            </Link>
          </div>
        </article>

        <article className="rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-[0_20px_56px_rgba(0,0,0,0.18)]">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-400">
            Catalogo actual
          </p>
          <p className="mt-3 text-5xl font-bold tracking-tight text-white">
            {metrics.total}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {metrics.active} promociones visibles desde src/data/ofertas.ts.
          </p>
        </article>
      </section>

      <section className="mt-6 rounded-lg border border-white/10 bg-white/[0.07] p-5 shadow-[0_20px_56px_rgba(0,0,0,0.18)]">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-white">
              Promociones versionadas
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Vista de solo lectura de las promociones que ve el asesor.
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          {ofertas.map((oferta) => (
            <article
              key={oferta.id}
              className="grid gap-4 rounded-lg border border-white/10 bg-[#111827]/55 p-4 md:grid-cols-[1fr_auto] md:items-center"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold tracking-tight text-white">
                    {oferta.nombre}
                  </h3>
                  <span className="rounded-md border border-white/10 bg-white/[0.06] px-2 py-1 text-xs font-semibold text-slate-300">
                    {oferta.categoria}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-300">
                  {oferta.resumen}
                </p>
                <p className="mt-2 text-sm font-semibold text-[#FFB4AC]">
                  {oferta.precio}
                </p>
              </div>
              <Link
                href={`/ofertas/${oferta.id}`}
                className="inline-flex h-10 w-fit items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.1]"
              >
                <ExternalLink className="h-4 w-4" />
                Ver
              </Link>
            </article>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
