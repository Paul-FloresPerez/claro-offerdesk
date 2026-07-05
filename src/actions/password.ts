"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

export type ChangePasswordState = {
  status: "success" | "error";
  message: string;
  errors?: Record<string, string[]>;
};

export async function changePasswordAction(
  formData: FormData
): Promise<ChangePasswordState> {
  const session = await auth();

  if (!session?.user) {
    return errorState("No autorizado.");
  }

  const currentPassword = readPassword(formData.get("currentPassword"));
  const newPassword = readPassword(formData.get("newPassword"));
  const confirmPassword = readPassword(formData.get("confirmPassword"));

  const fieldErrors: Record<string, string[]> = {};

  if (!currentPassword) {
    fieldErrors.currentPassword = ["Ingresa tu contrasena actual."];
  }

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    fieldErrors.newPassword = [
      `La nueva contrasena debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`,
    ];
  }

  if (newPassword.length > MAX_PASSWORD_LENGTH) {
    fieldErrors.newPassword = ["La nueva contrasena es demasiado larga."];
  }

  if (!confirmPassword) {
    fieldErrors.confirmPassword = ["Confirma tu nueva contrasena."];
  }

  if (newPassword && confirmPassword && newPassword !== confirmPassword) {
    fieldErrors.confirmPassword = ["Las contrasenas no coinciden."];
  }

  if (
    currentPassword &&
    newPassword &&
    currentPassword === newPassword
  ) {
    fieldErrors.newPassword = [
      "La nueva contrasena debe ser diferente a la actual.",
    ];
  }

  if (Object.keys(fieldErrors).length > 0) {
    return validationErrorState(fieldErrors);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      passwordHash: true,
      isActive: true,
    },
  });

  if (!user?.isActive) {
    return errorState("No se pudo cambiar la contrasena.");
  }

  const currentPasswordMatches = await bcrypt.compare(
    currentPassword,
    user.passwordHash
  );

  if (!currentPasswordMatches) {
    return {
      status: "error",
      message: "Revisa los campos marcados.",
      errors: {
        currentPassword: ["La contrasena actual no es correcta."],
      },
    };
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      passwordHash,
      mustChangePassword: false,
      updatedAt: new Date(),
    },
  });

  return {
    status: "success",
    message: "Contrasena actualizada correctamente.",
  };
}

function readPassword(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value : "";
}

function validationErrorState(
  errors: Record<string, string[]>
): ChangePasswordState {
  return {
    status: "error",
    message: "Revisa los campos marcados.",
    errors,
  };
}

function errorState(message: string): ChangePasswordState {
  return {
    status: "error",
    message,
  };
}
