import "server-only";

import { Prisma, type SaleStatus } from "@prisma/client";
import type {
  AdvisorSaleRow,
  EditableSaleRow,
  SaleKpis,
} from "@/components/sales/types";
import {
  isSaleStatus,
  type SaleStatusValue,
} from "@/lib/sale-status";

export type SalesSearchParams = {
  dni?: string | string[];
  advisorId?: string | string[];
  branchId?: string | string[];
  status?: string | string[];
};

export const managerSaleSelect = {
  id: true,
  advisorId: true,
  branchId: true,
  customerName: true,
  customerDni: true,
  customerPhone: true,
  customerEmail: true,
  customerAddress: true,
  service: true,
  planName: true,
  status: true,
  rejectionReason: true,
  saleDate: true,
  advisor: {
    select: { fullName: true },
  },
  branch: {
    select: { name: true },
  },
} satisfies Prisma.SaleSelect;

type ManagerSaleRecord = Prisma.SaleGetPayload<{
  select: typeof managerSaleSelect;
}>;

export function parseSalesFilters(params: SalesSearchParams) {
  const status = firstValue(params.status);

  return {
    dni: firstValue(params.dni).trim().slice(0, 20),
    advisorId: normalizeUuidFilter(firstValue(params.advisorId)),
    branchId: normalizeUuidFilter(firstValue(params.branchId)),
    status: (isSaleStatus(status) ? status : "") as SaleStatusValue | "",
  };
}

export function saleFilterWhere(filters: ReturnType<typeof parseSalesFilters>) {
  return {
    ...(filters.dni
      ? { customerDni: { contains: filters.dni, mode: "insensitive" as const } }
      : {}),
    ...(filters.advisorId ? { advisorId: filters.advisorId } : {}),
    ...(filters.branchId ? { branchId: filters.branchId } : {}),
    ...(filters.status ? { status: filters.status } : {}),
  } satisfies Prisma.SaleWhereInput;
}

export function toEditableSaleRow(sale: ManagerSaleRecord): EditableSaleRow {
  return {
    id: sale.id,
    advisorId: sale.advisorId,
    branchId: sale.branchId,
    customerName: sale.customerName,
    customerDni: sale.customerDni,
    customerPhone: sale.customerPhone,
    customerEmail: sale.customerEmail,
    customerAddress: sale.customerAddress,
    service: sale.service,
    planName: sale.planName,
    status: sale.status,
    rejectionReason: sale.rejectionReason,
    saleDate: toDateInputValue(sale.saleDate),
    advisorName: sale.advisor.fullName,
    branchName: sale.branch.name,
  };
}

export function toAdvisorSaleRow(sale: {
  id: string;
  customerDni: string;
  service: string;
  planName: string | null;
  status: SaleStatus;
  rejectionReason: string | null;
  saleDate: Date;
}): AdvisorSaleRow {
  return {
    ...sale,
    saleDate: toDateInputValue(sale.saleDate),
  };
}

export function toSaleKpis(
  groups: Array<{ status: SaleStatus; _count: { _all: number } }>
): SaleKpis {
  const counts = new Map(groups.map((group) => [group.status, group._count._all]));

  return {
    total: groups.reduce((total, group) => total + group._count._all, 0),
    installed: counts.get("INSTALADA") ?? 0,
    pending: counts.get("PENDIENTE") ?? 0,
    rejected: counts.get("RECHAZADA") ?? 0,
  };
}

export function currentLimaDate() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value])
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function toDateInputValue(value: Date) {
  return value.toISOString().slice(0, 10);
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function normalizeUuidFilter(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  )
    ? value
    : "";
}
