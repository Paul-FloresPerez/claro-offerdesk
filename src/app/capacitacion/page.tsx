import { connection } from "next/server";
import { PageHeader } from "@/components/common/PageHeader";
import { TrainingLibrary } from "@/components/training/TrainingLibrary";
import { prisma } from "@/lib/prisma";
import { getTrainingMedia, getTrainingMediaFromRecords } from "@/lib/training-media";

export const runtime = "nodejs";

export default async function CapacitacionPage() {
  await connection();

  const dbMedia = await prisma.trainingMedia.findMany({
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
      isFeatured: true,
    },
  });
  const libraryMedia = dbMedia.filter(
    (item) => item.mediaType !== "video" || !item.isFeatured
  );
  const { videos, audios } =
    dbMedia.length > 0
      ? getTrainingMediaFromRecords(libraryMedia)
      : getTrainingMedia();

  return (
    <main>
      <PageHeader
        eyebrow="Biblioteca interna"
        title="Entrenamiento comercial"
        description="Videos y audios para practicar el flujo de venta antes de atender nuevas oportunidades."
        tone="dark"
        actions={
          <div className="grid grid-cols-2 gap-2">
            <Metric label="Videos" value={videos.length} />
            <Metric label="Audios" value={audios.length} />
          </div>
        }
      />

      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:py-7">
        <TrainingLibrary videos={videos} audios={audios} />
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-24 rounded-lg border border-border bg-card px-3 py-2 text-right">
      <p className="text-xl font-bold tracking-tight text-foreground">{value}</p>
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
