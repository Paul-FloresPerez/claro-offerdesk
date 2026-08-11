import type { SaleStatusValue } from "@/lib/sale-status";

export type AdvisorOption = {
  id: string;
  fullName: string;
  branchId: string;
  branchName: string;
};

export type BranchFilterOption = {
  id: string;
  name: string;
};

export type EditableSaleRow = {
  id: string;
  advisorId: string;
  branchId: string;
  customerName: string;
  customerDni: string;
  customerPhone: string;
  customerEmail: string | null;
  customerAddress: string | null;
  service: string;
  planName: string | null;
  status: SaleStatusValue;
  rejectionReason: string | null;
  saleDate: string;
  advisorName: string;
  branchName: string;
};

export type AdvisorSaleRow = {
  id: string;
  customerDni: string;
  service: string;
  planName: string | null;
  status: SaleStatusValue;
  rejectionReason: string | null;
  saleDate: string;
};

export type SaleKpis = {
  total: number;
  installed: number;
  pending: number;
  rejected: number;
};
