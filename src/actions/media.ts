"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  createMediaSchema,
  mediaStatusSchema,
  updateMediaSchema,
  type MediaActionState,
  type MediaType,
} from "@/lib/validations/media";

const MEDIA_ADMIN_PATH = "/admin/media";
const AUDIO_EXTENSIONS = new Set([".mp3", ".m4a", ".ogg"]);
const VIDEO_EXTENSIONS = new Set([".mp4"]);

export async function createMediaAction(
  _previousState: MediaActionState,
  formData: FormData
): Promise<MediaActionState> {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return errorState("No autorizado.");
  }

  const parsed = createMediaSchema.safeParse(readMediaFormData(formData));

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  const fileUrlError = validateFileUrl(parsed.data.mediaType, parsed.data.fileUrl);

  if (fileUrlError) {
    return fieldErrorState("fileUrl", fileUrlError);
  }

  try {
    const now = new Date();

    await prisma.trainingMedia.create({
      data: {
        id: randomUUID(),
        title: parsed.data.title,
        description: parsed.data.description,
        mediaType: parsed.data.mediaType,
        fileUrl: parsed.data.fileUrl!,
        fileKey: null,
        weekLabel: parsed.data.weekLabel,
        isActive: parsed.data.isActive,
        createdAt: now,
        updatedAt: now,
      },
    });

    revalidateMedia();
    return successState("Material creado correctamente.");
  } catch (error) {
    return databaseErrorState(error, "No se pudo crear el material.");
  }
}

export async function updateMediaAction(
  _previousState: MediaActionState,
  formData: FormData
): Promise<MediaActionState> {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return errorState("No autorizado.");
  }

  const parsed = updateMediaSchema.safeParse({
    ...readMediaFormData(formData),
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  const fileUrlError = validateFileUrl(parsed.data.mediaType, parsed.data.fileUrl);

  if (fileUrlError) {
    return fieldErrorState("fileUrl", fileUrlError);
  }

  try {
    await prisma.trainingMedia.update({
      where: {
        id: parsed.data.id,
      },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        mediaType: parsed.data.mediaType,
        fileUrl: parsed.data.fileUrl!,
        fileKey: null,
        weekLabel: parsed.data.weekLabel,
        isActive: parsed.data.isActive,
        updatedAt: new Date(),
      },
    });

    revalidateMedia();
    return successState("Material actualizado correctamente.");
  } catch (error) {
    return databaseErrorState(error, "No se pudo actualizar el material.");
  }
}

export async function setMediaStatusAction(
  _previousState: MediaActionState,
  formData: FormData
): Promise<MediaActionState> {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return errorState("No autorizado.");
  }

  const parsed = mediaStatusSchema.safeParse({
    id: formData.get("id"),
    isActive: formData.get("isActive"),
  });

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  try {
    await prisma.trainingMedia.update({
      where: {
        id: parsed.data.id,
      },
      data: {
        isActive: parsed.data.isActive,
        updatedAt: new Date(),
      },
    });

    revalidateMedia();
    return successState(
      parsed.data.isActive ? "Material activado." : "Material desactivado."
    );
  } catch (error) {
    return databaseErrorState(error, "No se pudo cambiar el estado.");
  }
}

async function requireAdmin() {
  const session = await auth();
  return Boolean(session?.user?.isAdmin);
}

function readMediaFormData(formData: FormData) {
  return {
    title: formData.get("title"),
    description: formData.get("description"),
    mediaType: formData.get("mediaType"),
    fileUrl: formData.get("fileUrl"),
    weekLabel: formData.get("weekLabel"),
    isActive: formData.get("isActive"),
  };
}

function validateFileUrl(mediaType: MediaType, fileUrl: string | null) {
  if (!fileUrl) {
    return "Ingresa una URL publica.";
  }

  if (fileUrl.includes("\\") || fileUrl.startsWith("file:")) {
    return "No uses rutas locales del equipo.";
  }

  let url: URL;

  try {
    url = new URL(fileUrl);
  } catch {
    return "Usa una URL https valida.";
  }

  if (url.protocol !== "https:") {
    return "La URL debe usar https.";
  }

  if (mediaType === "video" && isYouTubeUrl(url)) {
    return null;
  }

  const extension = getFileExtension(url.pathname);
  const allowedExtensions =
    mediaType === "audio" ? AUDIO_EXTENSIONS : VIDEO_EXTENSIONS;

  if (allowedExtensions.has(extension)) {
    return null;
  }

  return mediaType === "video"
    ? "Usa YouTube o una URL https directa que termine en .mp4."
    : "Usa una URL https directa que termine en .mp3, .m4a u .ogg.";
}

function isYouTubeUrl(url: URL) {
  const host = url.hostname.toLowerCase();
  return (
    host === "youtube.com" ||
    host === "www.youtube.com" ||
    host === "m.youtube.com" ||
    host === "youtu.be"
  );
}

function getFileExtension(fileName: string) {
  const match = fileName.toLowerCase().match(/\.[a-z0-9]+$/);
  return match?.[0] ?? "";
}

function revalidateMedia() {
  revalidatePath(MEDIA_ADMIN_PATH);
  revalidatePath("/admin");
  revalidatePath("/admin/usuarios");
  revalidatePath("/admin/ranking");
  revalidatePath("/admin/promociones");
  revalidatePath("/capacitacion");
  revalidatePath("/entrenamiento");
  revalidatePath("/promociones");
  revalidatePath("/top-ventas");
  revalidatePath("/");
}

function validationErrorState(
  fieldErrors: Record<string, string[] | undefined>
): MediaActionState {
  const errors = Object.fromEntries(
    Object.entries(fieldErrors).filter(([, messages]) => messages?.length)
  ) as Record<string, string[]>;

  return {
    status: "error",
    message: "Revisa los campos marcados.",
    errors,
  };
}

function fieldErrorState(field: string, message: string): MediaActionState {
  return {
    status: "error",
    message,
    errors: {
      [field]: [message],
    },
  };
}

function databaseErrorState(error: unknown, fallbackMessage: string): MediaActionState {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    return errorState("El material no existe.");
  }

  return errorState(fallbackMessage);
}

function successState(message: string): MediaActionState {
  return {
    status: "success",
    message,
  };
}

function errorState(message: string): MediaActionState {
  return {
    status: "error",
    message,
  };
}
