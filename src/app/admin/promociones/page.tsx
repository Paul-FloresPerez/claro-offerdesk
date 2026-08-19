import { Archive, ExternalLink, FilePenLine, Plus, Send } from "lucide-react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { PromotionFilters } from "@/components/admin/promotions/PromotionFilters";
import { PromotionList } from "@/components/admin/promotions/PromotionList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { listPromotionsForAdmin } from "@/lib/promotions/admin";

export const runtime = "nodejs";

type PromotionsSearchParams = Promise<{
  q?: string;
  status?: string;
  category?: string;
  kind?: string;
}>;

export default async function AdminPromotionsPage({
  searchParams,
}: {
  searchParams: PromotionsSearchParams;
}) {
  const params = await searchParams;
  const filters = {
    query: params.q ?? "",
    status: isStatus(params.status) ? params.status : "ALL",
    category: isCategory(params.category) ? params.category : "ALL",
    kind: isKind(params.kind) ? params.kind : "ALL",
  } as const;
  const { promotions, metrics } = await listPromotionsForAdmin(filters);

  return (
    <AdminShell
      title="Promociones"
      description="Administra las campañas y el material comercial disponible para el equipo."
      statusBadge={
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/promociones"><ExternalLink /> Ver promociones</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/promociones/nueva"><Plus /> Nueva promoción</Link>
          </Button>
        </div>
      }
    >
      <section className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={FilePenLine} label="Todas" value={metrics.total} />
          <MetricCard icon={FilePenLine} label="Borradores" value={metrics.draft} />
          <MetricCard icon={Send} label="Publicadas" value={metrics.published} />
          <MetricCard icon={Archive} label="Archivadas" value={metrics.archived} />
        </div>
        <PromotionFilters initial={filters} />
        <PromotionList promotions={promotions} emptyCatalog={metrics.total === 0} />
      </section>
    </AdminShell>
  );
}

function MetricCard({ icon: Icon, label, value }: {
  icon: typeof FilePenLine;
  label: string;
  value: number;
}) {
  return (
    <Card size="sm">
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
        </div>
        <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-brand-emphasis">
          <Icon className="size-5" />
        </span>
      </CardContent>
    </Card>
  );
}

function isStatus(value?: string): value is "DRAFT" | "PUBLISHED" | "ARCHIVED" {
  return value === "DRAFT" || value === "PUBLISHED" || value === "ARCHIVED";
}

function isCategory(
  value?: string
): value is "Hogar" | "Convergencia" | "Móvil" | "Negocios" {
  return (
    value === "Hogar" ||
    value === "Convergencia" ||
    value === "Móvil" ||
    value === "Negocios"
  );
}

function isKind(value?: string): value is "CAMPAIGN" | "REGULAR_OFFER" {
  return value === "CAMPAIGN" || value === "REGULAR_OFFER";
}
