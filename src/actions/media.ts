"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { put } from "@vercel/blob";
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
const AUDIO_MIME_TYPES = new Set([
  "audio/mpeg",
  "audio/mp4",
  "audio/m4a",
  "audio/ogg",
  "audio/x-m4a",
]);
const VIDEO_MIME_TYPES = new Set(["video/mp4"]);

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

  const prepared = await prepareMediaFile(formData, parsed.data.mediaType);

  if (!prepared.ok) {
    return prepared.state;
  }

  const fileUrl = prepared.fileUrl ?? parsed.data.fileUrl;
  const fileKey = prepared.fileKey ?? parsed.data.fileKey;
  const fileUrlError = validateFileUrl(parsed.data.mediaType, fileUrl);

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
        fileUrl: fileUrl!,
        fileKey,
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

  const prepared = await prepareMediaFile(formData, parsed.data.mediaType);

  if (!prepared.ok) {
    return prepared.state;
  }

  const fileUrl = prepared.fileUrl ?? parsed.data.fileUrl;
  const fileKey = prepared.fileKey ?? parsed.data.fileKey;
  const fileUrlError = validateFileUrl(parsed.data.mediaType, fileUrl);

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
        fileUrl: fileUrl!,
        fileKey,
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
    fileKey: formData.get("fileKey"),
    weekLabel: formData.get("weekLabel"),
    isActive: formData.get("isActive"),
  };
}

async function prepareMediaFile(
  formData: FormData,
  mediaType: MediaType
): Promise<MediaFileResult> {
  const file = formData.get("mediaFile");

  if (!(file instanceof File) || file.size === 0) {
    return {
      ok: true,
      fileUrl: null,
      fileKey: null,
    };
  }

  const fileError = validateUploadedFile(file, mediaType);

  if (fileError) {
    return {
      ok: false,
      state: fieldErrorState("mediaFile", fileError),
    };
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return {
      ok: false,
      state: fieldErrorState(
        "mediaFile",
        "Falta configurar BLOB_READ_WRITE_TOKEN. Usa una URL externa mientras tanto."
      ),
    };
  }

  try {
    const safeName = sanitizeFileName(file.name);
    const blob = await put(
      `capacitacion/${mediaType}/${Date.now()}-${safeName}`,
      file,
      {
        access: "public",
        addRandomSuffix: true,
      }
    );

    return {
      ok: true,
      fileUrl: blob.url,
      fileKey: blob.pathname,
    };
  } catch {
    return {
      ok: false,
      state: fieldErrorState("mediaFile", "No se pudo subir el archivo a Blob."),
    };
  }
}

type MediaFileResult =
  | {
      ok: true;
      fileUrl: string | null;
      fileKey: string | null;
    }
  | {
      ok: false;
      state: MediaActionState;
    };

function validateUploadedFile(file: File, mediaType: MediaType) {
  const extension = getFileExtension(file.name);

  if (mediaType === "audio") {
    if (!AUDIO_EXTENSIONS.has(extension)) {
      return "El audio debe ser MP3, M4A u OGG.";
    }

    if (file.type && !AUDIO_MIME_TYPES.has(file.type)) {
      return "El tipo de audio no es compatible.";
    }

    return null;
  }

  if (!VIDEO_EXTENSIONS.has(extension)) {
    return "El video debe ser MP4.";
  }

  if (file.type && !VIDEO_MIME_TYPES.has(file.type)) {
    return "El tipo de video no es compatible.";
  }

  return null;
}

function validateFileUrl(mediaType: MediaType, fileUrl: string | null) {
  if (!fileUrl) {
    return "Ingresa una URL o sube un archivo.";
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

  if (isVercelBlobUrl(url)) {
    const extension = getFileExtension(url.pathname);
    const allowedExtensions =
      mediaType === "audio" ? AUDIO_EXTENSIONS : VIDEO_EXTENSIONS;

    if (!allowedExtensions.has(extension)) {
      return mediaType === "audio"
        ? "La URL de audio debe terminar en .mp3, .m4a u .ogg."
        : "La URL de video debe terminar en .mp4.";
    }

    return null;
  }

  return mediaType === "video"
    ? "Usa una URL de YouTube o una URL de Vercel Blob."
    : "Usa una URL de Vercel Blob para audio.";
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

function isVercelBlobUrl(url: URL) {
  return url.hostname.toLowerCase().endsWith(".blob.vercel-storage.com");
}

function sanitizeFileName(fileName: string) {
  const extension = getFileExtension(fileName);
  const baseName = fileName
    .slice(0, Math.max(0, fileName.length - extension.length))
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${baseName || "material"}${extension}`;
}

function getFileExtension(fileName: string) {
  const match = fileName.toLowerCase().match(/\.[a-z0-9]+$/);
  return match?.[0] ?? "";
}

function revalidateMedia() {
  revalidatePath(MEDIA_ADMIN_PATH);
  revalidatePath("/capacitacion");
  revalidatePath("/entrenamiento");
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
