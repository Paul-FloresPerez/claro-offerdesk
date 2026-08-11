export const SALE_STATUS_VALUES = [
  "PENDIENTE",
  "INSTALADA",
  "RECHAZADA",
] as const;

export type SaleStatusValue = (typeof SALE_STATUS_VALUES)[number];

export const SALE_STATUS_LABELS: Record<SaleStatusValue, string> = {
  PENDIENTE: "Pendiente",
  INSTALADA: "Instalada",
  RECHAZADA: "Rechazada",
};

export function isSaleStatus(value: unknown): value is SaleStatusValue {
  return (
    typeof value === "string" &&
    SALE_STATUS_VALUES.includes(value as SaleStatusValue)
  );
}
