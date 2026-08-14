import {
  Activity,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Filter,
  ListChecks,
  Minus,
  TrendingUp,
  UserRound,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type {
  DashboardPeriod,
  SalesDashboardData,
  SalesDashboardKpis,
} from "@/lib/sales-dashboard";

type SalesDashboardProps = {
  data: SalesDashboardData;
  basePath: string;
  showBranchFilter: boolean;
};

const periodOptions: Array<{ value: DashboardPeriod; label: string }> = [
  { value: "today", label: "Hoy" },
  { value: "last7", label: "Últimos 7 días" },
  { value: "month", label: "Mes actual" },
  { value: "previous", label: "Mes anterior" },
  { value: "custom", label: "Rango personalizado" },
];

export default function SalesDashboard({
  data,
  basePath,
  showBranchFilter,
}: SalesDashboardProps) {
  return (
    <div className="space-y-5 sm:space-y-6">
      <DashboardFilters
        data={data}
        basePath={basePath}
        showBranchFilter={showBranchFilter}
      />

      <KpiBand kpis={data.kpis} />

      <InstallationRate kpis={data.kpis} />

      <SalesEvolutionChart data={data.timeline} total={data.kpis.total} />

      {showBranchFilter ? (
        <BranchPerformance branches={data.branchPerformance} />
      ) : null}

      <AdvisorPerformance advisors={data.advisorPerformance} />

      <div className="grid gap-5 xl:grid-cols-2">
        <PendingByAdvisor rows={data.pendingByAdvisor} />
        <RejectionReasons rows={data.rejectionReasons} />
      </div>
    </div>
  );
}

function DashboardFilters({
  data,
  basePath,
  showBranchFilter,
}: SalesDashboardProps) {
  return (
    <section
      aria-labelledby="dashboard-filters-title"
      className="rounded-xl border border-border bg-card p-4 sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-brand-emphasis">
            <Filter className="size-4" aria-hidden="true" />
            <h2
              id="dashboard-filters-title"
              className="text-xs font-semibold uppercase tracking-[0.14em]"
            >
              Vista comercial
            </h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {data.scopeLabel} · {data.filters.rangeLabel}
          </p>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-muted-foreground">
          <CalendarDays className="size-3.5 text-brand-emphasis" aria-hidden="true" />
          Datos por fecha de venta
        </span>
      </div>

      <form
        action={basePath}
        className={`mt-4 grid items-end gap-3 ${
          showBranchFilter
            ? "md:grid-cols-2 xl:grid-cols-[1.1fr_1.1fr_1fr_1fr_auto]"
            : "md:grid-cols-3 xl:grid-cols-[1.2fr_1fr_1fr_auto]"
        }`}
      >
        <FilterField label="Período" htmlFor="dashboard-period">
          <select
            id="dashboard-period"
            name="period"
            defaultValue={data.filters.period}
            className={fieldClassName}
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FilterField>

        {showBranchFilter ? (
          <FilterField label="Sede" htmlFor="dashboard-branch">
            <select
              id="dashboard-branch"
              name="branchId"
              defaultValue={data.filters.branchId}
              className={fieldClassName}
            >
              <option value="">Todas las sedes</option>
              {data.branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}{branch.isActive ? "" : " · Inactiva"}
                </option>
              ))}
            </select>
          </FilterField>
        ) : null}

        <FilterField label="Desde" htmlFor="dashboard-from">
          <input
            id="dashboard-from"
            name="from"
            type="date"
            defaultValue={data.filters.from}
            className={fieldClassName}
          />
        </FilterField>

        <FilterField label="Hasta" htmlFor="dashboard-to">
          <input
            id="dashboard-to"
            name="to"
            type="date"
            defaultValue={data.filters.to}
            className={fieldClassName}
          />
        </FilterField>

        <Button
          type="submit"
          className="h-11 bg-primary px-5 text-primary-foreground hover:bg-primary/90"
        >
          Aplicar filtros
        </Button>
      </form>

      <div className="mt-3 flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>Las fechas se usan al elegir “Rango personalizado”.</p>
        <Link
          href={basePath}
          className="w-fit font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
        >
          Restablecer vista
        </Link>
      </div>

      {data.filters.warning ? (
        <p
          role="status"
          className="mt-3 rounded-md border border-amber-400/20 bg-amber-400/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-100"
        >
          {data.filters.warning}
        </p>
      ) : null}
    </section>
  );
}

function FilterField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block min-w-0">
      <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

const fieldClassName =
  "h-11 w-full min-w-0 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary/70 focus:ring-2 focus:ring-ring/25 [color-scheme:dark]";

function KpiBand({ kpis }: { kpis: SalesDashboardKpis }) {
  const items: Array<{
    label: string;
    value: number;
    helper: string;
    icon: LucideIcon;
    tone: string;
  }> = [
    {
      label: "Instaladas",
      value: kpis.installed,
      helper: "Ventas completadas",
      icon: CheckCircle2,
      tone: "text-emerald-700 dark:text-emerald-300 bg-emerald-400/10",
    },
    {
      label: "Pendientes",
      value: kpis.pending,
      helper: "Requieren seguimiento",
      icon: Clock3,
      tone: "text-amber-800 dark:text-amber-300 bg-amber-400/10",
    },
    {
      label: "Rechazadas",
      value: kpis.rejected,
      helper: "No instaladas",
      icon: XCircle,
      tone: "text-rose-700 dark:text-rose-300 bg-rose-400/10",
    },
    {
      label: "Total",
      value: kpis.total,
      helper: "Todas las ventas",
      icon: ListChecks,
      tone: "text-sky-700 dark:text-sky-300 bg-sky-400/10",
    },
  ];

  return (
    <section
      aria-label="Indicadores principales"
      className="grid grid-cols-2 gap-3 xl:grid-cols-4"
    >
      {items.map((item) => (
        <article
          key={item.label}
          className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                {item.label}
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {item.value.toLocaleString("es-PE")}
              </p>
            </div>
            <span
              className={`grid size-9 shrink-0 place-items-center rounded-lg ${item.tone}`}
            >
              <item.icon className="size-4" aria-hidden="true" />
            </span>
          </div>
          <p className="mt-3 truncate text-xs text-muted-foreground">{item.helper}</p>
        </article>
      ))}
    </section>
  );
}

function InstallationRate({ kpis }: { kpis: SalesDashboardKpis }) {
  const rate = Math.min(100, Math.max(0, kpis.installationRate));

  return (
    <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
            <h2 className="text-sm font-semibold text-foreground">
              Tasa de instalación
            </h2>
          </div>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Instaladas ÷ (instaladas + rechazadas). Las pendientes no alteran la tasa.
          </p>
        </div>
        <p className="text-3xl font-semibold tracking-tight text-foreground">
          {kpis.hasDecidedSales ? `${rate.toFixed(1)}%` : "0.0%"}
        </p>
      </div>
      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-card"
        role="progressbar"
        aria-label="Tasa de instalación"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Number(rate.toFixed(1))}
      >
        <div
          className="h-full rounded-full bg-emerald-400"
          style={{ width: `${rate}%` }}
        />
      </div>
      {!kpis.hasDecidedSales ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Aún no hay ventas instaladas o rechazadas en este período.
        </p>
      ) : null}
    </section>
  );
}

function SalesEvolutionChart({
  data,
  total,
}: {
  data: SalesDashboardData["timeline"];
  total: number;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <SectionHeading
        eyebrow="Tendencia"
        title="Evolución de ventas"
        description="Comportamiento por fecha de venta y estado comercial."
        icon={Activity}
      />

      <ChartLegend />

      {total === 0 ? (
        <EmptyState message="No hay ventas en el período seleccionado." />
      ) : (
        <LineChart data={data} />
      )}
    </section>
  );
}

function ChartLegend() {
  return (
    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
      <LegendDot className="bg-emerald-400" label="Instaladas" />
      <LegendDot className="bg-amber-300" label="Pendientes" />
      <LegendDot className="bg-rose-400" label="Rechazadas" />
    </div>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`size-2 rounded-full ${className}`} aria-hidden="true" />
      {label}
    </span>
  );
}

function LineChart({ data }: { data: SalesDashboardData["timeline"] }) {
  const width = 900;
  const height = 250;
  const left = 34;
  const right = 12;
  const top = 16;
  const bottom = 36;
  const innerWidth = width - left - right;
  const innerHeight = height - top - bottom;
  const maxValue = Math.max(
    1,
    ...data.flatMap((point) => [point.installed, point.pending, point.rejected])
  );
  const gridMax = Math.max(4, Math.ceil(maxValue / 4) * 4);
  const x = (index: number) =>
    left + (data.length <= 1 ? innerWidth / 2 : (index / (data.length - 1)) * innerWidth);
  const y = (value: number) => top + innerHeight - (value / gridMax) * innerHeight;
  const pointString = (status: "installed" | "pending" | "rejected") =>
    data.map((point, index) => `${x(index)},${y(point[status])}`).join(" ");
  const labelEvery = Math.max(1, Math.ceil(data.length / 7));

  return (
    <div className="mt-3 overflow-hidden rounded-lg border border-border bg-surface-elevated px-2 py-3 sm:px-3">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto min-h-56 w-full"
        role="img"
        aria-labelledby="sales-chart-title sales-chart-description"
      >
        <title id="sales-chart-title">Evolución de ventas por estado</title>
        <desc id="sales-chart-description">
          Serie temporal de ventas instaladas, pendientes y rechazadas.
        </desc>

        {[0, 1, 2, 3, 4].map((step) => {
          const value = (gridMax / 4) * step;
          const lineY = y(value);
          return (
            <g key={step}>
              <line
                x1={left}
                x2={width - right}
                y1={lineY}
                y2={lineY}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1"
              />
              <text
                x={left - 8}
                y={lineY + 4}
                textAnchor="end"
                fill="#64748B"
                fontSize="11"
              >
                {value}
              </text>
            </g>
          );
        })}

        {data.map((point, index) =>
          index % labelEvery === 0 || index === data.length - 1 ? (
            <text
              key={point.key}
              x={x(index)}
              y={height - 10}
              textAnchor="middle"
              fill="#94A3B8"
              fontSize="11"
            >
              {point.label}
            </text>
          ) : null
        )}

        <polyline
          points={pointString("installed")}
          fill="none"
          stroke="#34D399"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          points={pointString("pending")}
          fill="none"
          stroke="#FCD34D"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          points={pointString("rejected")}
          fill="none"
          stroke="#FB7185"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="sr-only">
        <table>
          <caption>Ventas por período y estado</caption>
          <thead>
            <tr>
              <th>Período</th>
              <th>Instaladas</th>
              <th>Pendientes</th>
              <th>Rechazadas</th>
            </tr>
          </thead>
          <tbody>
            {data.map((point) => (
              <tr key={point.key}>
                <th>{point.label}</th>
                <td>{point.installed}</td>
                <td>{point.pending}</td>
                <td>{point.rejected}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BranchPerformance({
  branches,
}: {
  branches: SalesDashboardData["branchPerformance"];
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <SectionHeading
        eyebrow="Comparativo"
        title="Rendimiento por sede"
        description="Las ventas se atribuyen a la sede histórica guardada en cada registro."
        icon={Building2}
      />

      {branches.length === 0 ? (
        <EmptyState message="No hay sedes disponibles para comparar." />
      ) : (
        <>
          <div className="mt-5 hidden overflow-hidden rounded-lg border border-border lg:block">
            <div className="grid grid-cols-[minmax(0,1.7fr)_repeat(4,minmax(5rem,.65fr))] gap-3 bg-card px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              <span>Sede</span>
              <span className="text-right">Instaladas</span>
              <span className="text-right">Pendientes</span>
              <span className="text-right">Rechazadas</span>
              <span className="text-right">Tasa</span>
            </div>
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="grid grid-cols-[minmax(0,1.7fr)_repeat(4,minmax(5rem,.65fr))] items-center gap-3 border-t border-border px-4 py-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">{branch.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {branch.city}{branch.isActive ? "" : " · Inactiva"}
                  </p>
                </div>
                <MetricNumber value={branch.kpis.installed} tone="text-emerald-700 dark:text-emerald-300" />
                <MetricNumber value={branch.kpis.pending} tone="text-amber-800 dark:text-amber-300" />
                <MetricNumber value={branch.kpis.rejected} tone="text-rose-700 dark:text-rose-300" />
                <MetricNumber
                  value={`${branch.kpis.installationRate.toFixed(1)}%`}
                  tone="text-foreground"
                />
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 lg:hidden">
            {branches.map((branch) => (
              <article
                key={branch.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-foreground">{branch.name}</h3>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {branch.city}{branch.isActive ? "" : " · Inactiva"}
                    </p>
                  </div>
                  <RateBadge rate={branch.kpis.installationRate} />
                </div>
                <CompactMetrics kpis={branch.kpis} />
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function AdvisorPerformance({
  advisors,
}: {
  advisors: SalesDashboardData["advisorPerformance"];
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <SectionHeading
        eyebrow="Equipo"
        title="Rendimiento por asesor"
        description="Incluye asesores activos sin ventas y conserva el contexto histórico de cada venta."
        icon={UserRound}
      />

      {advisors.length === 0 ? (
        <EmptyState message="No hay asesores ni ventas para este alcance." />
      ) : (
        <>
          <div className="mt-5 hidden overflow-hidden rounded-lg border border-border lg:block">
            <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_repeat(5,minmax(4.25rem,.5fr))] gap-3 bg-card px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              <span>Asesor</span>
              <span>Sede histórica</span>
              <span className="text-right">Instaladas</span>
              <span className="text-right">Pendientes</span>
              <span className="text-right">Rechazadas</span>
              <span className="text-right">Total</span>
              <span className="text-right">Tasa</span>
            </div>
            {advisors.map((advisor) => (
              <div
                key={advisor.id}
                className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_repeat(5,minmax(4.25rem,.5fr))] items-center gap-3 border-t border-border px-4 py-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-foreground">
                    {advisor.fullName}
                  </p>
                  {!advisor.isActive ? (
                    <p className="text-xs text-muted-foreground">Usuario inactivo</p>
                  ) : null}
                </div>
                <p className="truncate text-muted-foreground">{advisor.branchLabel}</p>
                <MetricNumber value={advisor.kpis.installed} tone="text-emerald-700 dark:text-emerald-300" />
                <MetricNumber value={advisor.kpis.pending} tone="text-amber-800 dark:text-amber-300" />
                <MetricNumber value={advisor.kpis.rejected} tone="text-rose-700 dark:text-rose-300" />
                <MetricNumber value={advisor.kpis.total} tone="text-muted-foreground" />
                <MetricNumber
                  value={`${advisor.kpis.installationRate.toFixed(1)}%`}
                  tone="text-foreground"
                />
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 lg:hidden">
            {advisors.map((advisor, index) => (
              <article
                key={advisor.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-start gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-md bg-card text-xs font-semibold text-muted-foreground">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-foreground">
                      {advisor.fullName}
                    </h3>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {advisor.branchLabel}{advisor.isActive ? "" : " · Inactivo"}
                    </p>
                  </div>
                  <RateBadge rate={advisor.kpis.installationRate} />
                </div>
                <CompactMetrics kpis={advisor.kpis} />
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function PendingByAdvisor({
  rows,
}: {
  rows: SalesDashboardData["pendingByAdvisor"];
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <SectionHeading
        eyebrow="Seguimiento"
        title="Pendientes por asesor"
        description="Prioriza la carga pendiente dentro del período seleccionado."
        icon={Clock3}
      />
      {rows.length === 0 ? (
        <EmptyState message="No hay ventas pendientes en este período." compact />
      ) : (
        <div className="mt-4 divide-y divide-border">
          {rows.map((row) => (
            <div
              key={row.advisorId}
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {row.fullName}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Más antigua: {formatDisplayDate(row.oldestSaleDate)} · {row.ageDays} {row.ageDays === 1 ? "día" : "días"}
                </p>
              </div>
              <span className="inline-flex min-w-9 justify-center rounded-md bg-amber-400/10 px-2.5 py-1.5 text-sm font-semibold text-amber-800 dark:text-amber-200">
                {row.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function RejectionReasons({
  rows,
}: {
  rows: SalesDashboardData["rejectionReasons"];
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <SectionHeading
        eyebrow="Diagnóstico"
        title="Motivos de rechazo"
        description="Agrupados por el texto exacto normalizado, sin exponer datos del cliente."
        icon={XCircle}
      />
      {rows.length === 0 ? (
        <EmptyState message="No hay ventas rechazadas en este período." compact />
      ) : (
        <div className="mt-4 space-y-4">
          {rows.map((row) => (
            <div key={row.reason}>
              <div className="flex items-start justify-between gap-4 text-sm">
                <p className="min-w-0 break-words font-medium text-muted-foreground">
                  {row.reason}
                </p>
                <span className="shrink-0 font-semibold text-foreground">{row.count}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-card">
                <div
                  className="h-full rounded-full bg-rose-400"
                  style={{ width: `${Math.max(3, row.percentage)}%` }}
                />
              </div>
              <p className="mt-1 text-right text-xs text-muted-foreground">
                {row.percentage.toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/12 text-brand-emphasis">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-emphasis">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function CompactMetrics({ kpis }: { kpis: SalesDashboardKpis }) {
  return (
    <dl className="mt-4 grid grid-cols-4 gap-2 border-t border-border pt-3 text-center">
      <CompactMetric label="Inst." value={kpis.installed} tone="text-emerald-700 dark:text-emerald-300" />
      <CompactMetric label="Pend." value={kpis.pending} tone="text-amber-800 dark:text-amber-300" />
      <CompactMetric label="Rech." value={kpis.rejected} tone="text-rose-700 dark:text-rose-300" />
      <CompactMetric label="Total" value={kpis.total} tone="text-muted-foreground" />
    </dl>
  );
}

function CompactMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className={`mt-1 text-sm font-semibold ${tone}`}>{value}</dd>
    </div>
  );
}

function MetricNumber({
  value,
  tone,
}: {
  value: number | string;
  tone: string;
}) {
  return <p className={`text-right font-semibold tabular-nums ${tone}`}>{value}</p>;
}

function RateBadge({ rate }: { rate: number }) {
  return (
    <span className="shrink-0 rounded-md border border-emerald-400/15 bg-emerald-400/10 px-2 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-200">
      {rate.toFixed(1)}%
    </span>
  );
}

function EmptyState({
  message,
  compact = false,
}: {
  message: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`mt-4 flex items-center gap-3 rounded-lg border border-dashed border-border bg-card px-4 ${
        compact ? "py-5" : "min-h-48 justify-center py-8"
      }`}
    >
      <Minus className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

function formatDisplayDate(value: string) {
  return new Intl.DateTimeFormat("es-PE", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
  })
    .format(new Date(`${value}T00:00:00.000Z`))
    .replace(".", "");
}
