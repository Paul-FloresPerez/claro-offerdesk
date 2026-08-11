import { FileSearch } from "lucide-react";
import SaleStatusBadge from "@/components/sales/SaleStatusBadge";
import type { AdvisorSaleRow } from "@/components/sales/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdvisorSalesList({ sales }: { sales: AdvisorSaleRow[] }) {
  if (sales.length === 0) {
    return (
      <div className="grid min-h-52 place-items-center rounded-lg border border-dashed border-white/15 bg-white/[0.035] p-6 text-center">
        <div>
          <FileSearch className="mx-auto size-8 text-slate-500" aria-hidden="true" />
          <p className="mt-3 font-semibold text-white">Aún no tienes ventas</p>
          <p className="mt-1 text-sm text-slate-400">
            Tus ventas aparecerán aquí cuando sean registradas por supervisión.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section aria-label="Mis ventas">
      <div className="hidden overflow-hidden rounded-lg border border-white/10 bg-white/[0.05] md:block">
        <Table>
          <TableHeader className="bg-white/[0.05]">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-slate-300">Fecha</TableHead>
              <TableHead className="text-slate-300">DNI cliente</TableHead>
              <TableHead className="text-slate-300">Servicio</TableHead>
              <TableHead className="text-slate-300">Estado</TableHead>
              <TableHead className="text-slate-300">Motivo de rechazo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow
                key={sale.id}
                className="border-white/10 text-slate-200 hover:bg-white/[0.04]"
              >
                <TableCell>{formatSaleDate(sale.saleDate)}</TableCell>
                <TableCell className="font-mono text-xs">
                  {sale.customerDni}
                </TableCell>
                <TableCell>
                  <span className="block max-w-64 truncate">{sale.service}</span>
                  {sale.planName ? (
                    <span className="mt-0.5 block max-w-64 truncate text-xs text-slate-500">
                      {sale.planName}
                    </span>
                  ) : null}
                </TableCell>
                <TableCell>
                  <SaleStatusBadge status={sale.status} />
                </TableCell>
                <TableCell>
                  <span className="block max-w-72 whitespace-normal text-sm text-slate-400">
                    {sale.rejectionReason ?? "—"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 md:hidden">
        {sales.map((sale) => (
          <article
            key={sale.id}
            className="rounded-lg border border-white/10 bg-white/[0.06] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-sm font-semibold text-white">
                  DNI {sale.customerDni}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {formatSaleDate(sale.saleDate)}
                </p>
              </div>
              <SaleStatusBadge status={sale.status} />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-200">
              {sale.service}
            </p>
            {sale.planName ? (
              <p className="mt-1 text-sm text-slate-400">{sale.planName}</p>
            ) : null}
            {sale.rejectionReason ? (
              <div className="mt-4 rounded-md border border-red-300/15 bg-red-300/[0.06] p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-red-100">
                  Motivo de rechazo
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-300">
                  {sale.rejectionReason}
                </p>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function formatSaleDate(value: string) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`));
}
