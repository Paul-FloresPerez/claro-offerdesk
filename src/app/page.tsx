import {
  BookOpenText,
  Headphones,
  MessageSquareReply,
  PackageCheck,
  PlayCircle,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { connection } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getTrainingMedia,
  getTrainingMediaFromRecords,
  type TrainingMediaFile,
} from "@/lib/training-media";

export const runtime = "nodejs";

const quickLinks: Array<{
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    href: "/promociones",
    label: "Promociones",
    description: "Revisa ofertas, condiciones y material oficial.",
    icon: PackageCheck,
  },
  {
    href: "/guion",
    label: "Guion Comercial",
    description: "Practica el flujo recomendado de venta.",
    icon: BookOpenText,
  },
  {
    href: "/objeciones",
    label: "Objeciones",
    description: "Responde dudas frecuentes con precisión.",
    icon: MessageSquareReply,
  },
  {
    href: "/top-ventas",
    label: "Top ventas",
    description: "Consulta el ranking visual del equipo.",
    icon: Trophy,
  },
  {
    href: "/entrenamiento",
    label: "Entrenamiento",
    description: "Accede a la biblioteca de video y audio.",
    icon: PlayCircle,
  },
];

const workflow = [
  { href: "/entrenamiento", label: "Escucha o mira una referencia" },
  { href: "/promociones", label: "Revisa promociones vigentes" },
  { href: "/guion", label: "Repasa el guion comercial" },
  { href: "/objeciones", label: "Practica objeciones antes de vender" },
];

export default async function HomePage() {
  await connection();

  const [activePromotions, topRanking, dbMedia] = await Promise.all([
    prisma.promotion.count({
      where: {
        isActive: true,
      },
    }),
    prisma.salesRanking.findMany({
      where: {
        isActive: true,
        user: {
          is: {
            isActive: true,
          },
        },
      },
      orderBy: [
        {
          rankPosition: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
      select: {
        rankPosition: true,
        salesCount: true,
        fullName: true,
        user: {
          select: {
            fullName: true,
          },
        },
      },
      take: 3,
    }),
    prisma.trainingMedia.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
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
  ]);
  const { featuredVideo, featuredAudios, videos, audios } =
    dbMedia.length > 0 ? getTrainingMediaFromRecords(dbMedia) : getTrainingMedia();
  const topAdvisor = topRanking[0];
  const topAdvisorName = topAdvisor?.user?.fullName ?? topAdvisor?.fullName;

  return (
    <main className="relative">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(17,24,39,0.98)_0%,rgba(29,37,53,0.94)_48%,rgba(64,17,22,0.70)_100%)]" />

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#FFB4AC]">
              Claro OfferDesk
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Inicio
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-slate-300">
              Consola interna para preparar la venta, consultar promociones y
              practicar el discurso comercial.
            </p>
          </div>
          <Link
            href="/promociones"
            className="inline-flex h-11 w-fit items-center gap-2 rounded-lg bg-[#DA291C] px-4 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(218,41,28,0.24)] transition hover:bg-[#B91F15]"
          >
            <PackageCheck className="h-4 w-4" />
            Ver promociones
          </Link>
        </div>

        <section className="grid gap-4 lg:grid-cols-3">
          <MetricCard
            label="Promociones"
            value={activePromotions.toString()}
            detail="Promociones activas para consulta"
          />
          <MetricCard
            label="Entrenamiento"
            value={(videos.length + audios.length).toString()}
            detail="Archivos detectados en la biblioteca"
          />
          <MetricCard
            label="Top ventas"
            value={topAdvisorName ?? "Pendiente"}
            detail={
              topAdvisor
                ? `#${topAdvisor.rankPosition} con ${topAdvisor.salesCount} ventas`
                : "Sin registros activos"
            }
          />
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-xl border border-white/10 bg-white/[0.07] p-4 shadow-[0_20px_62px_rgba(0,0,0,0.22)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FFB4AC]">
              Ruta recomendada
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
              Preparación rápida
            </h2>
            <div className="mt-4 grid gap-3">
              {workflow.map((step, index) => (
                <Link
                  key={step.href}
                  href={step.href}
                  className="flex min-h-12 items-center gap-3 rounded-lg border border-white/10 bg-[#111827]/55 px-3 py-2 transition hover:border-[#DA291C]/35 hover:bg-white/[0.08]"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[#DA291C] text-sm font-black text-white">
                    {index + 1}
                  </span>
                  <span className="text-sm font-semibold leading-5 text-slate-100">
                    {step.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <TrainingPreview video={featuredVideo} audio={featuredAudios[0]} />
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-xl border border-white/10 bg-white/[0.07] p-4 shadow-[0_18px_54px_rgba(0,0,0,0.20)] transition hover:border-[#DA291C]/40 hover:bg-white/[0.10]"
            >
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-[#DA291C]/18 text-[#FFB4AC] ring-1 ring-[#DA291C]/25 transition group-hover:scale-[1.03]">
                <item.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-4 text-lg font-semibold tracking-tight text-white">
                {item.label}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {item.description}
              </p>
            </Link>
          ))}
        </section>
      </section>
    </main>
  );
}

function MetricCard({
  detail,
  label,
  value,
}: {
  detail: string;
  label: string;
  value: string;
}) {
  return (
    <article className="rounded-xl border border-white/10 bg-white/[0.07] p-4 shadow-[0_18px_54px_rgba(0,0,0,0.20)]">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 truncate text-2xl font-bold tracking-tight text-white">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p>
    </article>
  );
}

function TrainingPreview({
  audio,
  video,
}: {
  audio?: TrainingMediaFile;
  video?: TrainingMediaFile;
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.07] p-4 shadow-[0_20px_62px_rgba(0,0,0,0.22)] backdrop-blur">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FFB4AC]">
            Entrenamiento destacado
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">
            Video y audio base
          </h2>
        </div>
        <Link
          href="/entrenamiento"
          className="inline-flex h-9 items-center rounded-md border border-white/10 px-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
        >
          Abrir
        </Link>
      </div>

      <div className="grid gap-3">
        {video ? (
          video.sourceType === "youtube" ? (
            <iframe
              src={getYouTubeEmbedUrl(video.fileUrl) ?? video.fileUrl}
              title={video.title}
              className="aspect-video w-full rounded-lg bg-black"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <video
              controls
              preload="metadata"
              className="aspect-video w-full rounded-lg bg-black"
              src={video.fileUrl}
            >
              Tu navegador no puede reproducir este video.
            </video>
          )
        ) : (
          <PendingMedia label="Video pendiente de cargar" path="/capacitacion/videos/" />
        )}

        {audio ? (
          <div className="rounded-lg border border-white/10 bg-[#111827]/58 p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
              <Headphones className="h-4 w-4 text-[#FFB4AC]" />
              Audio de referencia
            </div>
            <audio controls preload="metadata" className="w-full" src={audio.fileUrl}>
              Tu navegador no puede reproducir este audio.
            </audio>
          </div>
        ) : (
          <PendingMedia label="Audio pendiente de cargar" path="/capacitacion/audios/" />
        )}
      </div>
    </section>
  );
}

function getYouTubeEmbedUrl(fileUrl: string) {
  try {
    const url = new URL(fileUrl);
    const host = url.hostname.toLowerCase();
    const videoId =
      host === "youtu.be"
        ? url.pathname.split("/").filter(Boolean)[0]
        : url.searchParams.get("v") ?? getYouTubePathVideoId(url.pathname);

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

function getYouTubePathVideoId(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] === "shorts" || segments[0] === "embed") {
    return segments[1] ?? null;
  }

  return null;
}

function PendingMedia({ label, path }: { label: string; path: string }) {
  return (
    <div className="rounded-lg border border-dashed border-white/15 bg-[#111827]/55 p-4">
      <p className="text-sm font-semibold text-white">{label}</p>
      <p className="mt-1 text-xs text-slate-500">{path}</p>
    </div>
  );
}
