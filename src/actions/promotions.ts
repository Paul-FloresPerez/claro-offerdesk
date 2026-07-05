"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { put } from "@vercel/blob";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createSlug } from "@/lib/offer-utils";
import {
  createPromotionSchema,
  promotionStatusSchema,
  updatePromotionSchema,
  type PromotionActionState,
} from "@/lib/validations/promotion";

const PROMOTIONS_ADMIN_PATH = "/admin/promociones";
const MAX_IMAGE_SIZE_BYTES = 4 * 1024 * 1024;
const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function createPromotionAction(
  _previousState: PromotionActionState,
  formData: FormData
): Promise<PromotionActionState> {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return errorState("No autorizado.");
  }

  const parsed = createPromotionSchema.safeParse(readPromotionFormData(formData));

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  const upload = await preparePromotionImage(formData);

  if (!upload.ok) {
    return upload.state;
  }

  const imageUrl = upload.imageUrl ?? parsed.data.imageUrl;
  const imageUrlError = validateImageUrl(imageUrl);

  if (imageUrlError) {
    return fieldErrorState("imageUrl", imageUrlError);
  }

  try {
    const slug = await buildUniqueSlug(parsed.data.title);

    await prisma.promotion.create({
      data: {
        slug,
        title: parsed.data.title,
        category: parsed.data.category,
        description: parsed.data.description,
        price: parsed.data.price,
        benefits: parsed.data.benefits,
        conditions: parsed.data.conditions,
        validity: parsed.data.validity,
        imageUrl,
        fileKey: upload.fileKey,
        isActive: parsed.data.isActive,
        sortOrder: parsed.data.sortOrder,
        detailPrice: parsed.data.conditions[0] ?? parsed.data.description,
        speed: "Validar velocidad",
        technologies: ["Validar tecnologia"],
        appliesTo: ["Clientes segun evaluacion comercial y cobertura."],
        restrictions: parsed.data.conditions,
        validations: ["Validar cobertura y condiciones vigentes antes de ofrecer."],
        salesPhrase:
          "Presenta la promocion, valida cobertura y confirma condiciones antes de cerrar.",
      },
    });

    revalidatePromotions();
    return successState("Promocion creada correctamente.");
  } catch (error) {
    return databaseErrorState(error, "No se pudo crear la promocion.");
  }
}

export async function updatePromotionAction(
  _previousState: PromotionActionState,
  formData: FormData
): Promise<PromotionActionState> {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return errorState("No autorizado.");
  }

  const parsed = updatePromotionSchema.safeParse({
    ...readPromotionFormData(formData),
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  const upload = await preparePromotionImage(formData);

  if (!upload.ok) {
    return upload.state;
  }

  const imageUrl = upload.imageUrl ?? parsed.data.imageUrl;
  const imageUrlError = validateImageUrl(imageUrl);

  if (imageUrlError) {
    return fieldErrorState("imageUrl", imageUrlError);
  }

  try {
    await prisma.promotion.update({
      where: {
        id: parsed.data.id,
      },
      data: {
        title: parsed.data.title,
        category: parsed.data.category,
        description: parsed.data.description,
        price: parsed.data.price,
        benefits: parsed.data.benefits,
        conditions: parsed.data.conditions,
        validity: parsed.data.validity,
        imageUrl,
        fileKey: upload.fileKey ?? undefined,
        isActive: parsed.data.isActive,
        sortOrder: parsed.data.sortOrder,
        detailPrice: parsed.data.conditions[0] ?? parsed.data.description,
        restrictions: parsed.data.conditions,
        updatedAt: new Date(),
      },
    });

    revalidatePromotions();
    return successState("Promocion actualizada correctamente.");
  } catch (error) {
    return databaseErrorState(error, "No se pudo actualizar la promocion.");
  }
}

export async function setPromotionStatusAction(
  _previousState: PromotionActionState,
  formData: FormData
): Promise<PromotionActionState> {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return errorState("No autorizado.");
  }

  const parsed = promotionStatusSchema.safeParse({
    id: formData.get("id"),
    isActive: formData.get("isActive"),
  });

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  try {
    await prisma.promotion.update({
      where: {
        id: parsed.data.id,
      },
      data: {
        isActive: parsed.data.isActive,
        updatedAt: new Date(),
      },
    });

    revalidatePromotions();
    return successState(
      parsed.data.isActive ? "Promocion activada." : "Promocion desactivada."
    );
  } catch (error) {
    return databaseErrorState(error, "No se pudo cambiar el estado.");
  }
}

async function requireAdmin() {
  const session = await auth();
  return Boolean(session?.user?.isAdmin);
}

function readPromotionFormData(formData: FormData) {
  return {
    title: formData.get("title"),
    category: formData.get("category"),
    description: formData.get("description"),
    price: formData.get("price"),
    benefits: formData.get("benefits"),
    conditions: formData.get("conditions"),
    validity: formData.get("validity"),
    imageUrl: formData.get("imageUrl"),
    isActive: formData.get("isActive"),
    sortOrder: formData.get("sortOrder"),
  };
}

async function preparePromotionImage(formData: FormData): Promise<ImageUploadResult> {
  const file = formData.get("imageFile");

  if (!(file instanceof File) || file.size === 0) {
    return {
      ok: true,
      imageUrl: null,
      fileKey: null,
    };
  }

  const fileError = validateUploadedImage(file);

  if (fileError) {
    return {
      ok: false,
      state: fieldErrorState("imageFile", fileError),
    };
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return {
      ok: false,
      state: fieldErrorState(
        "imageFile",
        "Falta configurar BLOB_READ_WRITE_TOKEN. Usa una URL o ruta publica mientras tanto."
      ),
    };
  }

  try {
    const safeName = sanitizeFileName(file.name);
    const blob = await put(`promociones/${Date.now()}-${safeName}`, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return {
      ok: true,
      imageUrl: blob.url,
      fileKey: blob.pathname,
    };
  } catch {
    return {
      ok: false,
      state: fieldErrorState("imageFile", "No se pudo subir la imagen a Blob."),
    };
  }
}

type ImageUploadResult =
  | {
      ok: true;
      imageUrl: string | null;
      fileKey: string | null;
    }
  | {
      ok: false;
      state: PromotionActionState;
    };

function validateUploadedImage(file: File) {
  const extension = getFileExtension(file.name);

  if (!IMAGE_EXTENSIONS.has(extension)) {
    return "La imagen debe ser JPG, PNG o WEBP.";
  }

  if (file.type && !IMAGE_MIME_TYPES.has(file.type)) {
    return "El tipo de imagen no es compatible.";
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return "La imagen no debe superar 4 MB.";
  }

  return null;
}

function validateImageUrl(imageUrl: string | null) {
  if (!imageUrl) {
    return null;
  }

  if (imageUrl.includes("\\") || imageUrl.startsWith("file:")) {
    return "No uses rutas locales del equipo.";
  }

  if (imageUrl.startsWith("/")) {
    if (imageUrl.startsWith("//") || imageUrl.includes("..")) {
      return "Usa una ruta publica valida.";
    }

    return null;
  }

  let url: URL;

  try {
    url = new URL(imageUrl);
  } catch {
    return "Usa una URL https valida o una ruta publica como /ofertas/imagen.png.";
  }

  if (url.protocol !== "https:") {
    return "La URL debe usar https.";
  }

  return null;
}

async function buildUniqueSlug(title: string) {
  const baseSlug = createSlug(title) || "promocion";
  let slug = baseSlug;
  let suffix = 2;

  while (
    await prisma.promotion.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    })
  ) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
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

  return `${baseName || "promocion"}${extension}`;
}

function getFileExtension(fileName: string) {
  const match = fileName.toLowerCase().match(/\.[a-z0-9]+$/);
  return match?.[0] ?? "";
}

function revalidatePromotions() {
  revalidatePath(PROMOTIONS_ADMIN_PATH);
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/promociones");
  revalidatePath("/ofertas");
  revalidatePath("/ofertas/[id]", "page");
  revalidatePath("/recomendador");
}

function validationErrorState(
  fieldErrors: Record<string, string[] | undefined>
): PromotionActionState {
  const errors = Object.fromEntries(
    Object.entries(fieldErrors).filter(([, messages]) => messages?.length)
  ) as Record<string, string[]>;

  return {
    status: "error",
    message: "Revisa los campos marcados.",
    errors,
  };
}

function fieldErrorState(field: string, message: string): PromotionActionState {
  return {
    status: "error",
    message,
    errors: {
      [field]: [message],
    },
  };
}

function databaseErrorState(
  error: unknown,
  fallbackMessage: string
): PromotionActionState {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  ) {
    return errorState("La promocion no existe.");
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return errorState("Ya existe una promocion con ese identificador.");
  }

  return errorState(fallbackMessage);
}

function successState(message: string): PromotionActionState {
  return {
    status: "success",
    message,
  };
}

function errorState(message: string): PromotionActionState {
  return {
    status: "error",
    message,
  };
}
