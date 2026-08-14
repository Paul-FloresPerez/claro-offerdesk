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
      <div className="hidden overflow-hidden rounded-lg border border-border bg-card md:block">
        <Table>
          <TableHeader className="bg-card">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Fecha</TableHead>
              {showBranch ? (
                <TableHead className="text-muted-foreground">Sede</TableHead>
              ) : null}
              <TableHead className="text-muted-foreground">Asesor</TableHead>
              <TableHead className="text-muted-foreground">DNI cliente</TableHead>
              <TableHead className="text-muted-foreground">Cliente</TableHead>
              <TableHead className="text-muted-foreground">Servicio</TableHead>
              <TableHead className="text-muted-foreground">Estado</TableHead>
              <TableHead className="text-right text-muted-foreground">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sales.map((sale) => (
              <TableRow
                key={sale.id}
                className="border-border text-muted-foreground hover:bg-card"
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
                    <span className="mt-0.5 block max-w-48 truncate text-xs text-muted-foreground">
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
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-foreground">
                  {sale.customerName}
                </p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
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
      <dt className="text-xs uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 break-words text-muted-foreground">{value}</dd>
    </div>
  );
}

function SalesEmptyState() {
  return (
    <div className="grid min-h-52 place-items-center rounded-lg border border-dashed border-border bg-card p-6 text-center">
      <div>
        <FileSearch className="mx-auto size-8 text-muted-foreground" aria-hidden="true" />
        <p className="mt-3 font-semibold text-foreground">No hay ventas para mostrar</p>
        <p className="mt-1 text-sm text-muted-foreground">
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
