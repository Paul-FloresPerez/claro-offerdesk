import "server-only";

import { Prisma, type SaleStatus } from "@prisma/client";
import { requireAdmin, requireSupervisor } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

const PERIOD_VALUES = [
  "today",
  "last7",
  "month",
  "previous",
  "custom",
] as const;

export type DashboardPeriod = (typeof PERIOD_VALUES)[number];

export type DashboardSearchParams = {
  period?: string | string[];
  from?: string | string[];
  to?: string | string[];
  branchId?: string | string[];
};

export type SalesDashboardKpis = {
  installed: number;
  pending: number;
  rejected: number;
  total: number;
  installationRate: number;
  hasDecidedSales: boolean;
};

export type SalesDashboardData = {
  scope: "GLOBAL" | "BRANCH";
  scopeLabel: string;
  filters: {
    period: DashboardPeriod;
    from: string;
    to: string;
    rangeLabel: string;
    branchId: string;
    warning: string | null;
  };
  branches: Array<{
    id: string;
    name: string;
    city: string;
    isActive: boolean;
  }>;
  kpis: SalesDashboardKpis;
  timeline: Array<{
    key: string;
    label: string;
    installed: number;
    pending: number;
    rejected: number;
  }>;
  branchPerformance: Array<{
    id: string;
    name: string;
    city: string;
    isActive: boolean;
    kpis: SalesDashboardKpis;
  }>;
  advisorPerformance: Array<{
    id: string;
    fullName: string;
    branchLabel: string;
    isActive: boolean;
    kpis: SalesDashboardKpis;
  }>;
  pendingByAdvisor: Array<{
    advisorId: string;
    fullName: string;
    count: number;
    oldestSaleDate: string;
    ageDays: number;
  }>;
  rejectionReasons: Array<{
    reason: string;
    count: number;
    percentage: number;
  }>;
};

type DashboardRange = {
  period: DashboardPeriod;
  from: Date;
  to: Date;
  fromInput: string;
  toInput: string;
  rangeLabel: string;
  warning: string | null;
};

type DashboardScope = {
  kind: "GLOBAL" | "BRANCH";
  branchId?: string;
  branchLabel: string;
  branches: SalesDashboardData["branches"];
};

export async function getAdminSalesDashboard(
  searchParams: DashboardSearchParams
): Promise<SalesDashboardData> {
  await requireAdmin();

  const branches = await prisma.branch.findMany({
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      city: true,
      isActive: true,
    },
  });
  const requestedBranchId = firstValue(searchParams.branchId);
  const selectedBranch = branches.find(
    (branch) => branch.id === requestedBranchId
  );

  const scope: DashboardScope = selectedBranch
    ? {
        kind: "BRANCH",
        branchId: selectedBranch.id,
        branchLabel: selectedBranch.name,
        branches,
      }
    : {
        kind: "GLOBAL",
        branchLabel: "Todas las sedes",
        branches,
      };

  const range = parseDashboardRange(searchParams);
  if (requestedBranchId && !selectedBranch) {
    range.warning = "La sede solicitada no existe. Se muestra la vista global.";
  }

  return buildSalesDashboard(range, scope, true);
}

export async function getSupervisorSalesDashboard(
  searchParams: DashboardSearchParams
): Promise<SalesDashboardData> {
  const { user, scope } = await requireSupervisor();
  const range = parseDashboardRange(searchParams);

  return buildSalesDashboard(
    range,
    {
      kind: "BRANCH",
      branchId: scope.branchId,
      branchLabel: user.branch.name,
      branches: [],
    },
    false
  );
}

async function buildSalesDashboard(
  range: DashboardRange,
  scope: DashboardScope,
  includeBranchPerformance: boolean
): Promise<SalesDashboardData> {
  const where = {
    saleDate: {
      gte: range.from,
      lte: range.to,
    },
    ...(scope.branchId ? { branchId: scope.branchId } : {}),
  } satisfies Prisma.SaleWhereInput;

  const branchMetadataPromise = includeBranchPerformance
    ? Promise.resolve(
        scope.branchId
          ? scope.branches.filter((branch) => branch.id === scope.branchId)
          : scope.branches
      )
    : prisma.branch.findMany({
        where: { id: scope.branchId },
        select: { id: true, name: true, city: true, isActive: true },
      });

  const [
    statusRows,
    timelineRows,
    advisorRows,
    pendingRows,
    rejectionRows,
    branchRows,
    branchMetadata,
    advisors,
  ] = await Promise.all([
    prisma.sale.groupBy({
      by: ["status"],
      where,
      _count: { _all: true },
    }),
    prisma.sale.groupBy({
      by: ["saleDate", "status"],
      where,
      _count: { _all: true },
      orderBy: { saleDate: "asc" },
    }),
    prisma.sale.groupBy({
      by: ["advisorId", "branchId", "status"],
      where,
      _count: { _all: true },
    }),
    prisma.sale.groupBy({
      by: ["advisorId"],
      where: { ...where, status: "PENDIENTE" },
      _count: { _all: true },
      _min: { saleDate: true },
    }),
    prisma.sale.groupBy({
      by: ["rejectionReason"],
      where: {
        ...where,
        status: "RECHAZADA",
        rejectionReason: { not: null },
      },
      _count: { _all: true },
    }),
    prisma.sale.groupBy({
      by: ["branchId", "status"],
      where,
      _count: { _all: true },
    }),
    branchMetadataPromise,
    prisma.user.findMany({
      where: {
        OR: [
          {
            role: "ADVISOR",
            isActive: true,
            ...(scope.branchId ? { branchId: scope.branchId } : {}),
          },
          {
            advisorSales: {
              some: where,
            },
          },
        ],
      },
      orderBy: { fullName: "asc" },
      select: {
        id: true,
        fullName: true,
        isActive: true,
        branch: { select: { id: true, name: true } },
      },
    }),
  ]);

  const branchMap = new Map(
    branchMetadata.map((branch) => [branch.id, branch] as const)
  );
  const advisorMap = new Map(
    advisors.map((advisor) => [advisor.id, advisor] as const)
  );
  const kpis = kpisFromStatusRows(statusRows);

  const advisorMetrics = new Map<string, StatusAccumulator>();
  const advisorBranches = new Map<string, Set<string>>();
  for (const row of advisorRows) {
    addStatusCount(advisorMetrics, row.advisorId, row.status, row._count._all);
    const branchIds = advisorBranches.get(row.advisorId) ?? new Set<string>();
    branchIds.add(row.branchId);
    advisorBranches.set(row.advisorId, branchIds);
  }

  const branchMetrics = new Map<string, StatusAccumulator>();
  for (const row of branchRows) {
    addStatusCount(branchMetrics, row.branchId, row.status, row._count._all);
  }

  const pendingByAdvisor = pendingRows
    .map((row) => {
      const advisor = advisorMap.get(row.advisorId);
      const oldestSaleDate = row._min.saleDate;

      if (!advisor || !oldestSaleDate) {
        return null;
      }

      return {
        advisorId: row.advisorId,
        fullName: advisor.fullName,
        count: row._count._all,
        oldestSaleDate: formatIsoDate(oldestSaleDate),
        ageDays: daysBetween(oldestSaleDate, limaToday()),
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null)
    .sort((a, b) => b.count - a.count || b.ageDays - a.ageDays);

  return {
    scope: scope.kind,
    scopeLabel: scope.branchLabel,
    filters: {
      period: range.period,
      from: range.fromInput,
      to: range.toInput,
      rangeLabel: range.rangeLabel,
      branchId: scope.branchId ?? "",
      warning: range.warning,
    },
    branches: scope.branches,
    kpis,
    timeline: buildTimeline(range, timelineRows),
    branchPerformance: includeBranchPerformance
      ? branchMetadata
          .filter(
            (branch) => branch.isActive || branchMetrics.has(branch.id)
          )
          .map((branch) => ({
            ...branch,
            kpis: kpisFromAccumulator(branchMetrics.get(branch.id)),
          }))
          .sort(
            (a, b) =>
              b.kpis.installed - a.kpis.installed ||
              b.kpis.total - a.kpis.total ||
              a.name.localeCompare(b.name, "es")
          )
      : [],
    advisorPerformance: advisors
      .map((advisor) => {
        const historicalBranches = advisorBranches.get(advisor.id);
        const branchNames = historicalBranches
          ? [...historicalBranches]
              .map((branchId) => branchMap.get(branchId)?.name)
              .filter((name): name is string => Boolean(name))
          : [];
        const branchLabel =
          branchNames.length > 1
            ? `${branchNames.length} sedes históricas`
            : branchNames[0] ?? advisor.branch?.name ?? "Sin sede";

        return {
          id: advisor.id,
          fullName: advisor.fullName,
          branchLabel,
          isActive: advisor.isActive,
          kpis: kpisFromAccumulator(advisorMetrics.get(advisor.id)),
        };
      })
      .sort(
        (a, b) =>
          b.kpis.installed - a.kpis.installed ||
          b.kpis.total - a.kpis.total ||
          a.fullName.localeCompare(b.fullName, "es")
      ),
    pendingByAdvisor,
    rejectionReasons: buildRejectionReasons(rejectionRows, kpis.rejected),
  };
}

type StatusAccumulator = Record<SaleStatus, number>;

function emptyStatusAccumulator(): StatusAccumulator {
  return { INSTALADA: 0, PENDIENTE: 0, RECHAZADA: 0 };
}

function addStatusCount(
  map: Map<string, StatusAccumulator>,
  key: string,
  status: SaleStatus,
  count: number
) {
  const accumulator = map.get(key) ?? emptyStatusAccumulator();
  accumulator[status] += count;
  map.set(key, accumulator);
}

function kpisFromStatusRows(
  rows: Array<{ status: SaleStatus; _count: { _all: number } }>
) {
  const accumulator = emptyStatusAccumulator();
  for (const row of rows) {
    accumulator[row.status] = row._count._all;
  }
  return kpisFromAccumulator(accumulator);
}

function kpisFromAccumulator(
  accumulator: StatusAccumulator = emptyStatusAccumulator()
): SalesDashboardKpis {
  const installed = accumulator.INSTALADA;
  const pending = accumulator.PENDIENTE;
  const rejected = accumulator.RECHAZADA;
  const decided = installed + rejected;

  return {
    installed,
    pending,
    rejected,
    total: installed + pending + rejected,
    installationRate: decided === 0 ? 0 : (installed / decided) * 100,
    hasDecidedSales: decided > 0,
  };
}

function buildTimeline(
  range: DashboardRange,
  rows: Array<{
    saleDate: Date;
    status: SaleStatus;
    _count: { _all: number };
  }>
): SalesDashboardData["timeline"] {
  const useMonthlyBuckets = daysBetween(range.from, range.to) > 62;
  const buckets = new Map<string, StatusAccumulator>();

  for (const row of rows) {
    const key = useMonthlyBuckets
      ? formatIsoDate(row.saleDate).slice(0, 7)
      : formatIsoDate(row.saleDate);
    const accumulator = buckets.get(key) ?? emptyStatusAccumulator();
    accumulator[row.status] += row._count._all;
    buckets.set(key, accumulator);
  }

  const keys = useMonthlyBuckets
    ? monthKeys(range.from, range.to)
    : dateKeys(range.from, range.to);

  return keys.map((key) => {
    const accumulator = buckets.get(key) ?? emptyStatusAccumulator();
    return {
      key,
      label: useMonthlyBuckets ? formatMonthLabel(key) : formatDayLabel(key),
      installed: accumulator.INSTALADA,
      pending: accumulator.PENDIENTE,
      rejected: accumulator.RECHAZADA,
    };
  });
}

function buildRejectionReasons(
  rows: Array<{
    rejectionReason: string | null;
    _count: { _all: number };
  }>,
  rejectedTotal: number
): SalesDashboardData["rejectionReasons"] {
  const grouped = new Map<string, number>();

  for (const row of rows) {
    const reason = row.rejectionReason?.trim() || "Sin motivo registrado";
    grouped.set(reason, (grouped.get(reason) ?? 0) + row._count._all);
  }

  return [...grouped]
    .map(([reason, count]) => ({
      reason,
      count,
      percentage: rejectedTotal === 0 ? 0 : (count / rejectedTotal) * 100,
    }))
    .sort((a, b) => b.count - a.count || a.reason.localeCompare(b.reason, "es"));
}

function parseDashboardRange(
  searchParams: DashboardSearchParams
): DashboardRange {
  const requestedPeriod = firstValue(searchParams.period);
  const period = PERIOD_VALUES.includes(requestedPeriod as DashboardPeriod)
    ? (requestedPeriod as DashboardPeriod)
    : "month";
  const today = limaToday();
  let from = today;
  let to = today;
  let warning: string | null = null;

  if (period === "last7") {
    from = addDays(today, -6);
  } else if (period === "month") {
    from = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
  } else if (period === "previous") {
    from = new Date(
      Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1)
    );
    to = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 0));
  } else if (period === "custom") {
    const customFrom = parseIsoDate(firstValue(searchParams.from));
    const customTo = parseIsoDate(firstValue(searchParams.to));

    if (!customFrom || !customTo || customFrom > customTo) {
      from = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
      to = today;
      warning =
        "El rango personalizado no es válido. Se muestra el mes actual.";
    } else if (daysBetween(customFrom, customTo) > 366) {
      from = addDays(customTo, -366);
      to = customTo;
      warning = "El rango se limitó a 367 días para proteger el rendimiento.";
    } else {
      from = customFrom;
      to = customTo;
    }
  }

  return {
    period,
    from,
    to,
    fromInput: formatIsoDate(from),
    toInput: formatIsoDate(to),
    rangeLabel: `${formatLongDate(from)} — ${formatLongDate(to)}`,
    warning,
  };
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function limaToday() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return new Date(Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day)));
}

function parseIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return formatIsoDate(date) === value ? date : null;
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + amount);
  return next;
}

function daysBetween(from: Date, to: Date) {
  return Math.max(
    0,
    Math.floor((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000))
  );
}

function formatIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function dateKeys(from: Date, to: Date) {
  const keys: string[] = [];
  for (let date = from; date <= to; date = addDays(date, 1)) {
    keys.push(formatIsoDate(date));
  }
  return keys;
}

function monthKeys(from: Date, to: Date) {
  const keys: string[] = [];
  let date = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), 1));
  const last = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), 1));

  while (date <= last) {
    keys.push(formatIsoDate(date).slice(0, 7));
    date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
  }

  return keys;
}

function formatDayLabel(key: string) {
  const date = new Date(`${key}T00:00:00.000Z`);
  return new Intl.DateTimeFormat("es-PE", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
  })
    .format(date)
    .replace(".", "");
}

function formatMonthLabel(key: string) {
  const date = new Date(`${key}-01T00:00:00.000Z`);
  return new Intl.DateTimeFormat("es-PE", {
    timeZone: "UTC",
    month: "short",
    year: "2-digit",
  })
    .format(date)
    .replace(".", "");
}

function formatLongDate(date: Date) {
  return new Intl.DateTimeFormat("es-PE", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
  })
    .format(date)
    .replace(".", "");
}
