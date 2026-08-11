import { FileSearch } from "lucide-react";
import { EditSaleDialog } from "@/components/sales/SaleDialogs";
import SaleStatusBadge from "@/components/sales/SaleStatusBadge";
import type {
  AdvisorOption,
  EditableSaleRow,
} from "@/components/sales/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ManagerSalesList({
  advisors,
  sales,
  showBranch = false,
}: {
  advisors: AdvisorOption[];
  sales: EditableSaleRow[];
  showBranch?: boolean;
}) {
  if (sales.length === 0) {
    return <SalesEmptyState />;
  }

  return (
    <section aria-label="Listado de ventas">
      <div className="hidden overflow-hidden rounded-lg border border-white/10 bg-white/[0.05] md:block">
        <Table>
          <TableHeader className="bg-white/[0.05]">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-slate-300">Fecha</TableHead>
              {showBranch ? (
                <TableHead className="text-slate-300">Sede</TableHead>
              ) : null}
              <TableHead className="text-slate-300">Asesor</TableHead>
              <TableHead className="text-slate-300">DNI cliente</TableHead>
              <TableHead className="text-slate-300">Cliente</TableHead>
              <TableHead className="text-slate-300">Servicio</TableHead>
              <TableHead className="text-slate-300">Estado</TableHead>
              <TableHead className="text-right text-slate-300">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow
                key={sale.id}
                className="border-white/10 text-slate-200 hover:bg-white/[0.04]"
              >
                <TableCell>{formatSaleDate(sale.saleDate)}</TableCell>
                {showBranch ? <TableCell>{sale.branchName}</TableCell> : null}
                <TableCell>
                  <span className="block max-w-44 truncate">
                    {sale.advisorName}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {sale.customerDni}
                </TableCell>
                <TableCell>
                  <span className="block max-w-44 truncate">
                    {sale.customerName}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="block max-w-48 truncate">{sale.service}</span>
                  {sale.planName ? (
                    <span className="mt-0.5 block max-w-48 truncate text-xs text-slate-500">
                      {sale.planName}
                    </span>
                  ) : null}
                </TableCell>
                <TableCell>
                  <SaleStatusBadge status={sale.status} />
                </TableCell>
                <TableCell className="text-right">
                  <EditSaleDialog advisors={advisors} sale={sale} />
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
              <div className="min-w-0">
                <p className="truncate font-semibold text-white">
                  {sale.customerName}
                </p>
                <p className="mt-1 font-mono text-xs text-slate-400">
                  DNI {sale.customerDni}
                </p>
              </div>
              <SaleStatusBadge status={sale.status} />
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <SaleDetail label="Fecha" value={formatSaleDate(sale.saleDate)} />
              {showBranch ? (
                <SaleDetail label="Sede" value={sale.branchName} />
              ) : null}
              <SaleDetail label="Asesor" value={sale.advisorName} />
              <SaleDetail
                label="Servicio"
                value={sale.planName ? `${sale.service} · ${sale.planName}` : sale.service}
              />
            </dl>

            <div className="mt-4">
              <EditSaleDialog advisors={advisors} sale={sale} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SaleDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs uppercase tracking-[0.08em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-slate-200">{value}</dd>
    </div>
  );
}

function SalesEmptyState() {
  return (
    <div className="grid min-h-52 place-items-center rounded-lg border border-dashed border-white/15 bg-white/[0.035] p-6 text-center">
      <div>
        <FileSearch className="mx-auto size-8 text-slate-500" aria-hidden="true" />
        <p className="mt-3 font-semibold text-white">No hay ventas para mostrar</p>
        <p className="mt-1 text-sm text-slate-400">
          Ajusta los filtros o registra la primera venta.
        </p>
      </div>
    </div>
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
