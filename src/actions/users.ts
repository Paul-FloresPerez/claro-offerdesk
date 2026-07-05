"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { put } from "@vercel/blob";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  createUserSchema,
  resetUserPasswordSchema,
  updateUserSchema,
  userRoleSchema,
  userStatusSchema,
  type UserActionState,
} from "@/lib/validations/user";

const USERS_ADMIN_PATH = "/admin/usuarios";
const MAX_PHOTO_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_PHOTO_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export async function createUserAction(
  _previousState: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  const admin = await requireAdminUser();

  if (!admin) {
    return errorState("No autorizado.");
  }

  const parsed = createUserSchema.safeParse(readUserFormData(formData, true));

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  const uniqueError = await getUniqueError(parsed.data);

  if (uniqueError) {
    return uniqueError;
  }

  try {
    const now = new Date();
    const userId = randomUUID();
    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const photoUpload = await uploadUserPhoto(formData, userId);

    if (!photoUpload.ok) {
      return photoUpload.state;
    }

    await prisma.user.create({
      data: {
        id: userId,
        email: parsed.data.email,
        username: parsed.data.username,
        dni: parsed.data.dni,
        passwordHash,
        fullName: parsed.data.fullName,
        branchName: parsed.data.branchName,
        photoUrl: photoUpload.photoUrl ?? parsed.data.photoUrl,
        isAdmin: parsed.data.isAdmin,
        isActive: parsed.data.isActive,
        mustChangePassword: true,
        createdAt: now,
        updatedAt: now,
      },
    });

    revalidatePath(USERS_ADMIN_PATH);
    revalidatePath("/admin/ranking");
    return successState("Usuario creado correctamente.");
  } catch (error) {
    return databaseErrorState(error, "No se pudo crear el usuario.");
  }
}

export async function updateUserAction(
  _previousState: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  const admin = await requireAdminUser();

  if (!admin) {
    return errorState("No autorizado.");
  }

  const parsed = updateUserSchema.safeParse(readUserFormData(formData, false));

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  if (parsed.data.id === admin.id && (!parsed.data.isAdmin || !parsed.data.isActive)) {
    return errorState("No puedes quitarte permisos admin ni desactivar tu propia cuenta.");
  }

  const uniqueError = await getUniqueError(parsed.data, parsed.data.id);

  if (uniqueError) {
    return uniqueError;
  }

  try {
    const photoUpload = await uploadUserPhoto(formData, parsed.data.id);

    if (!photoUpload.ok) {
      return photoUpload.state;
    }

    await prisma.user.update({
      where: {
        id: parsed.data.id,
      },
      data: {
        email: parsed.data.email,
        username: parsed.data.username,
        dni: parsed.data.dni,
        fullName: parsed.data.fullName,
        branchName: parsed.data.branchName,
        photoUrl: photoUpload.photoUrl ?? parsed.data.photoUrl,
        isAdmin: parsed.data.isAdmin,
        isActive: parsed.data.isActive,
        updatedAt: new Date(),
      },
    });

    revalidatePath(USERS_ADMIN_PATH);
    revalidatePath("/admin/ranking");
    revalidatePath("/top-ventas");
    return successState("Usuario actualizado correctamente.");
  } catch (error) {
    return databaseErrorState(error, "No se pudo actualizar el usuario.");
  }
}

export async function setUserStatusAction(
  _previousState: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  const admin = await requireAdminUser();

  if (!admin) {
    return errorState("No autorizado.");
  }

  const parsed = userStatusSchema.safeParse({
    id: formData.get("id"),
    isActive: formData.get("isActive"),
  });

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  if (parsed.data.id === admin.id && !parsed.data.isActive) {
    return errorState("No puedes desactivar tu propia cuenta.");
  }

  try {
    await prisma.user.update({
      where: {
        id: parsed.data.id,
      },
      data: {
        isActive: parsed.data.isActive,
        updatedAt: new Date(),
      },
    });

    revalidatePath(USERS_ADMIN_PATH);
    revalidatePath("/admin/ranking");
    revalidatePath("/top-ventas");
    return successState(
      parsed.data.isActive ? "Usuario activado." : "Usuario desactivado."
    );
  } catch (error) {
    return databaseErrorState(error, "No se pudo cambiar el estado.");
  }
}

export async function setUserRoleAction(
  _previousState: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  const admin = await requireAdminUser();

  if (!admin) {
    return errorState("No autorizado.");
  }

  const parsed = userRoleSchema.safeParse({
    id: formData.get("id"),
    isAdmin: formData.get("isAdmin"),
  });

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  if (parsed.data.id === admin.id && !parsed.data.isAdmin) {
    return errorState("No puedes quitarte permisos admin.");
  }

  try {
    await prisma.user.update({
      where: {
        id: parsed.data.id,
      },
      data: {
        isAdmin: parsed.data.isAdmin,
        updatedAt: new Date(),
      },
    });

    revalidatePath(USERS_ADMIN_PATH);
    return successState(
      parsed.data.isAdmin ? "Usuario marcado como admin." : "Usuario marcado como asesor."
    );
  } catch (error) {
    return databaseErrorState(error, "No se pudo cambiar el rol.");
  }
}

export async function resetUserPasswordAction(
  _previousState: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  const admin = await requireAdminUser();

  if (!admin) {
    return errorState("No autorizado.");
  }

  const parsed = resetUserPasswordSchema.safeParse({
    id: formData.get("id"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  try {
    const passwordHash = await bcrypt.hash(parsed.data.password, 12);

    await prisma.user.update({
      where: {
        id: parsed.data.id,
      },
      data: {
        passwordHash,
        mustChangePassword: true,
        updatedAt: new Date(),
      },
    });

    revalidatePath(USERS_ADMIN_PATH);
    return successState("Contrasena reiniciada correctamente.");
  } catch (error) {
    return databaseErrorState(error, "No se pudo reiniciar la contrasena.");
  }
}

async function requireAdminUser() {
  const session = await auth();

  if (!session?.user?.isAdmin) {
    return null;
  }

  return session.user;
}

function readUserFormData(formData: FormData, includePassword: boolean) {
  return {
    id: formData.get("id"),
    fullName: formData.get("fullName"),
    username: formData.get("username"),
    dni: formData.get("dni"),
    email: formData.get("email"),
    branchName: formData.get("branchName"),
    photoUrl: formData.get("photoUrl"),
    isAdmin: formData.get("isAdmin"),
    isActive: formData.get("isActive"),
    password: includePassword ? formData.get("password") : undefined,
  };
}

async function uploadUserPhoto(
  formData: FormData,
  userId: string
): Promise<PhotoUploadResult> {
  const file = formData.get("photoFile");

  if (!(file instanceof File) || file.size === 0) {
    return {
      ok: true,
      photoUrl: null,
    };
  }

  const extension = getFileExtension(file.name);

  if (!ALLOWED_PHOTO_TYPES.has(file.type) || !ALLOWED_PHOTO_EXTENSIONS.has(extension)) {
    return {
      ok: false,
      state: fieldErrorState(
        "photoFile",
        "La foto debe ser JPG, JPEG, PNG o WEBP."
      ),
    };
  }

  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    return {
      ok: false,
      state: fieldErrorState("photoFile", "La foto no debe superar 2 MB."),
    };
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return {
      ok: true,
      photoUrl: null,
    };
  }

  try {
    const safeName = sanitizeFileName(file.name);
    const blob = await put(`usuarios/${userId}/${Date.now()}-${safeName}`, file, {
      access: "public",
      addRandomSuffix: true,
    });

    return {
      ok: true,
      photoUrl: blob.url,
    };
  } catch {
    return {
      ok: false,
      state: fieldErrorState("photoFile", "No se pudo subir la foto."),
    };
  }
}

type PhotoUploadResult =
  | {
      ok: true;
      photoUrl: string | null;
    }
  | {
      ok: false;
      state: UserActionState;
    };

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

  return `${baseName || "foto"}${extension}`;
}

function getFileExtension(fileName: string) {
  const match = fileName.toLowerCase().match(/\.[a-z0-9]+$/);
  return match?.[0] ?? "";
}

async function getUniqueError(
  input: {
    username: string;
    dni: string;
    email: string;
  },
  ignoredUserId?: string
): Promise<UserActionState | null> {
  const duplicate = await prisma.user.findFirst({
    where: {
      AND: [
        ignoredUserId
          ? {
              id: {
                not: ignoredUserId,
              },
            }
          : {},
        {
          OR: [
            {
              username: input.username,
            },
            {
              dni: input.dni,
            },
            {
              email: input.email,
            },
          ],
        },
      ],
    },
    select: {
      username: true,
      dni: true,
      email: true,
    },
  });

  if (!duplicate) {
    return null;
  }

  if (duplicate.username === input.username) {
    return fieldErrorState("username", "El usuario ya existe.");
  }

  if (duplicate.dni === input.dni) {
    return fieldErrorState("dni", "El DNI ya existe.");
  }

  return fieldErrorState("email", "El correo ya existe.");
}

function validationErrorState(
  fieldErrors: Record<string, string[] | undefined>
): UserActionState {
  const errors = Object.fromEntries(
    Object.entries(fieldErrors).filter(([, messages]) => messages?.length)
  ) as Record<string, string[]>;

  return {
    status: "error",
    message: "Revisa los campos marcados.",
    errors,
  };
}

function fieldErrorState(field: string, message: string): UserActionState {
  return {
    status: "error",
    message,
    errors: {
      [field]: [message],
    },
  };
}

function databaseErrorState(error: unknown, fallbackMessage: string): UserActionState {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return errorState("Ya existe un usuario con esos datos.");
  }

  return errorState(fallbackMessage);
}

function successState(message: string): UserActionState {
  return {
    status: "success",
    message,
  };
}

function errorState(message: string): UserActionState {
  return {
    status: "error",
    message,
  };
}
