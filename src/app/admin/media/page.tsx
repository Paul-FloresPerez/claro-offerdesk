import { connection } from "next/server";
import AdminShell from "@/components/admin/AdminShell";
import MediaForm from "@/components/admin/MediaForm";
import MediaTable from "@/components/admin/MediaTable";
import { prisma } from "@/lib/prisma";
import type { MediaType } from "@/lib/validations/media";

export const runtime = "nodejs";

export default async function AdminMediaPage() {
  await connection();

  const mediaItems = await prisma.trainingMedia.findMany({
    orderBy: [
      {
        isActive: "desc",
      },
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
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return (
    <AdminShell
      title="Media"
      description="Gestiona audios y videos de entrenamiento conectados a training_media."
    >
      <div className="grid gap-5">
        <MediaForm />
        <MediaTable
          mediaItems={mediaItems.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            mediaType: normalizeMediaType(item.mediaType),
            fileUrl: item.fileUrl,
            fileKey: item.fileKey,
            weekLabel: item.weekLabel,
            isActive: item.isActive,
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
          }))}
        />
      </div>
    </AdminShell>
  );
}

function normalizeMediaType(mediaType: string): MediaType {
  return mediaType === "audio" ? "audio" : "video";
}
