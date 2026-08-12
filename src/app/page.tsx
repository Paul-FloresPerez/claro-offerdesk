import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  PlayCircle,
  Trophy,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";
import { NativeVideoPlayer } from "@/components/training/NativeVideoPlayer";
import { requireUser } from "@/lib/authorization";
import {
  homePrimaryActionByRole,
  quickLinksByRole,
} from "@/lib/navigation";
import { prisma } from "@/lib/prisma";
import { getPromotionMetrics } from "@/lib/promotions";
import { getAutomaticSalesRanking } from "@/lib/sales-ranking";
import {
  getTrainingMedia,
  getTrainingMediaFromRecords,
  type TrainingMediaFile,
} from "@/lib/training-media";

export const runtime = "nodejs";

export default async function HomePage() {
  await connection();
  const user = await requireUser();
  const promotionMetrics = getPromotionMetrics();
  const saleScope =
    user.role === "ADVISOR"
      ? { advisorId: user.id }
      : user.role === "SUPERVISOR" && user.branchId
        ? { branchId: user.branchId }
        : {};

  const [automaticRanking, dbMedia, dbFeaturedVideo, statusGroups, peopleCount, branchCount] =
    await Promise.all([
      getAutomaticSalesRanking({
        scope:
          user.role === "ADMIN"
            ? { kind: "GLOBAL" }
            : user.branchId
              ? { kind: "BRANCH", branchId: user.branchId }
              : { kind: "NONE" },
      }),
      prisma.trainingMedia.findMany({
        where: { isActive: true },
        orderBy: [{ createdAt: "desc" }],
        select: {
          id: true,
          title: true,
          description: true,
          mediaType: true,
          fileUrl: true,
          fileKey: true,
          weekLabel: true,
          isFeatured: true,
        },
      }),
      prisma.trainingMedia.findFirst({
        where: { isActive: true, isFeatured: true, mediaType: "video" },
        select: {
          id: true,
          title: true,
          description: true,
          mediaType: true,
          fileUrl: true,
          fileKey: true,
          weekLabel: true,
        },
      }),
      prisma.sale.groupBy({
        by: ["status"],
        where: saleScope,
        _count: { _all: true },
      }),
      user.role === "ADVISOR"
        ? Promise.resolve(null)
        : prisma.user.count({
            where: {
              role: "ADVISOR",
              isActive: true,
              ...(user.role === "SUPERVISOR" && user.branchId
                ? { branchId: user.branchId }
                : {}),
            },
          }),
      user.role === "ADMIN"
        ? prisma.branch.count({ where: { isActive: true } })
        : Promise.resolve(null),
    ]);

  const baseMedia = getTrainingMedia();
  const featuredVideo = dbFeaturedVideo
    ? getTrainingMediaFromRecords([dbFeaturedVideo]).featuredVideo
    : baseMedia.featuredVideo;
  const mediaCount =
    dbMedia.length > 0
      ? dbMedia.length
      : baseMedia.videos.length + baseMedia.audios.length + (baseMedia.featuredVideo ? 1 : 0);
  const installed = getStatusCount(statusGroups, "INSTALADA");
  const pending = getStatusCount(statusGroups, "PENDIENTE");
  const advisorRank = automaticRanking.advisors.find((advisor) => advisor.advisorId === user.id);
  const topAdvisor = automaticRanking.advisors[0];
  const firstName = user.fullName.split(/\s+/)[0] || user.fullName;
  const scopeLabel =
    user.role === "ADMIN" ? "Vista global" : user.branch?.name ?? "Sin sede asignada";
  const primaryAction = homePrimaryActionByRole[user.role];

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
      <section className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Hola, {firstName}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Tu espacio de trabajo para vender con claridad.
          </p>
          <p className="mt-1 text-xs font-semibold text-[#FF8D83]">{scopeLabel}</p>
        </div>
        <Link
          href={primaryAction.href}
          className="inline-flex h-11 w-fit items-center gap-2 rounded-lg bg-[#DA291C] px-4 text-sm font-semibold text-white transition hover:bg-[#B91F15] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8D83] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827]"
        >
          {primaryAction.label}
          <ArrowRight className="size-4" />
        </Link>
      </section>

      <section aria-label="Resumen operativo" className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
        <HomeMetric label="Ventas instaladas" value={installed.toString()} icon={CheckCircle2} tone="success" />
        <HomeMetric label="Pendientes" value={pending.toString()} icon={Clock3} tone="warning" />
        {user.role === "ADVISOR" ? (
          <HomeMetric label="Posición en sede" value={advisorRank ? `#${advisorRank.position}` : "—"} icon={Trophy} tone="accent" />
        ) : user.role === "SUPERVISOR" ? (
          <HomeMetric label="Asesores activos" value={(peopleCount ?? 0).toString()} icon={UsersRound} tone="accent" />
        ) : (
          <HomeMetric label="Sedes activas" value={(branchCount ?? 0).toString()} icon={Building2} tone="accent" />
        )}
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
        <div className="space-y-5">
          <section className="rounded-xl border border-white/10 bg-[#172033] p-4 shadow-[0_16px_36px_rgba(0,0,0,0.14)] sm:p-5">
            <h2 className="text-lg font-semibold text-white">Accesos rápidos</h2>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {quickLinksByRole[user.role].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex min-h-20 items-center gap-3 rounded-lg border border-white/10 bg-[#111827]/45 p-3 transition hover:border-[#DA291C]/35 hover:bg-white/[0.055] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8D83]"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-[#DA291C]/20 bg-[#DA291C]/10 text-[#FF6A5E]">
                    <item.icon className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-white">{item.label}</span>
                    <span className="mt-0.5 block text-xs leading-5 text-slate-400">{item.description}</span>
                  </span>
                  <ArrowRight className="ml-auto size-4 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-[#FF8D83]" />
                </Link>
              ))}
            </div>
          </section>

          <FeaturedVideo video={featuredVideo} />
        </div>

        <aside className="h-fit rounded-xl border border-white/10 bg-[#172033] p-4 shadow-[0_16px_36px_rgba(0,0,0,0.14)] sm:p-5">
          <h2 className="text-lg font-semibold text-white">Referencia operativa</h2>
          <p className="mt-1 text-sm text-slate-400">Datos disponibles para tu jornada.</p>
          <dl className="mt-4 divide-y divide-white/10">
            <StatusRow label="Promociones activas" value={promotionMetrics.active.toString()} />
            <StatusRow label="Recursos de entrenamiento" value={mediaCount.toString()} />
            <StatusRow
              label="Líder de ventas"
              value={topAdvisor ? `${topAdvisor.fullName} · ${topAdvisor.installedSales}` : "Sin ventas"}
            />
          </dl>
          <Link
            href="/top-ventas"
            className="mt-4 inline-flex h-10 items-center gap-2 text-sm font-semibold text-[#FF8D83] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8D83]"
          >
            Revisar Top ventas
            <ArrowRight className="size-4" />
          </Link>
        </aside>
      </section>
    </main>
  );
}

function HomeMetric({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: "success" | "warning" | "accent";
}) {
  const toneClass = {
    success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    warning: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    accent: "border-[#DA291C]/25 bg-[#DA291C]/10 text-[#FF8D83]",
  }[tone];

  return (
    <article className="flex min-h-28 flex-col items-start gap-2 rounded-xl border border-white/10 bg-[#172033] p-3 shadow-[0_12px_30px_rgba(0,0,0,0.12)] sm:min-h-24 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
      <span className={`grid size-9 shrink-0 place-items-center rounded-lg border sm:size-11 ${toneClass}`}>
        <Icon className="size-4 sm:size-5" />
      </span>
      <div>
        <p className="text-xs leading-4 text-slate-300 sm:text-sm">{label}</p>
        <p className="mt-0.5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{value}</p>
      </div>
    </article>
  );
}

function FeaturedVideo({ video }: { video?: TrainingMediaFile }) {
  return (
    <section className="rounded-xl border border-white/10 bg-[#172033] p-4 shadow-[0_16px_36px_rgba(0,0,0,0.14)] sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Video destacado</h2>
          <p className="mt-1 text-sm text-slate-400">Referencia seleccionada por administración.</p>
        </div>
        <Link
          href="/entrenamiento"
          className="hidden h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.06] sm:inline-flex"
        >
          Ver biblioteca
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {video ? (
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.3fr)_minmax(15rem,0.7fr)] md:items-center">
          {video.sourceType === "youtube" ? (
            <iframe
              src={getYouTubeEmbedUrl(video.fileUrl) ?? video.fileUrl}
              title={video.title}
              className="aspect-video w-full rounded-lg bg-black"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <NativeVideoPlayer
              className="aspect-video w-full overflow-hidden rounded-lg bg-black"
              src={video.fileUrl}
              title={video.title}
            />
          )}
          <div>
            <p className="text-base font-semibold text-white">{video.title}</p>
            {video.description ? (
              <p className="mt-2 text-sm leading-6 text-slate-300">{video.description}</p>
            ) : null}
            <Link
              href="/entrenamiento"
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.06] sm:hidden"
            >
              <PlayCircle className="size-4" />
              Ver biblioteca
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-white/15 bg-[#111827]/45 p-5 text-sm text-slate-400">
          Aún no hay un video destacado activo.
        </div>
      )}
    </section>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-sm text-slate-400">{label}</dt>
      <dd className="max-w-[55%] truncate text-right text-sm font-semibold text-white">{value}</dd>
    </div>
  );
}

function getStatusCount(
  rows: Array<{ status: string; _count: { _all: number } }>,
  status: string
) {
  return rows.find((row) => row.status === status)?._count._all ?? 0;
}

function getYouTubeEmbedUrl(fileUrl: string) {
  try {
    const url = new URL(fileUrl);
    const host = url.hostname.toLowerCase();
    const segments = url.pathname.split("/").filter(Boolean);
    const videoId =
      host === "youtu.be"
        ? segments[0]
        : url.searchParams.get("v") ??
          (segments[0] === "shorts" || segments[0] === "embed" ? segments[1] : null);

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}
