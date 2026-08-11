"use server";

import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { isAuthorizationError, requireAdmin } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import {
  branchStatusSchema,
  createBranchSchema,
  updateBranchSchema,
  type BranchActionState,
} from "@/lib/validations/branch";

export async function createBranchAction(
  _previousState: BranchActionState,
  formData: FormData
): Promise<BranchActionState> {
  try {
    await requireAdmin();
  } catch (error) {
    return authorizationErrorState(error);
  }

  const parsed = createBranchSchema.safeParse(readBranchFormData(formData));

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  try {
    const now = new Date();

    await prisma.branch.create({
      data: {
        id: randomUUID(),
        name: parsed.data.name,
        city: parsed.data.city,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    });

    revalidateBranches();
    return successState("Sede creada correctamente.");
  } catch (error) {
    return databaseErrorState(error, "No se pudo crear la sede.");
  }
}

export async function updateBranchAction(
  _previousState: BranchActionState,
  formData: FormData
): Promise<BranchActionState> {
  try {
    await requireAdmin();
  } catch (error) {
    return authorizationErrorState(error);
  }

  const parsed = updateBranchSchema.safeParse({
    id: formData.get("id"),
    ...readBranchFormData(formData),
  });

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  try {
    await prisma.branch.update({
      where: { id: parsed.data.id },
      data: {
        name: parsed.data.name,
        city: parsed.data.city,
        updatedAt: new Date(),
      },
    });

    revalidateBranches();
    return successState("Sede actualizada correctamente.");
  } catch (error) {
    return databaseErrorState(error, "No se pudo actualizar la sede.");
  }
}

export async function setBranchStatusAction(
  _previousState: BranchActionState,
  formData: FormData
): Promise<BranchActionState> {
  try {
    await requireAdmin();
  } catch (error) {
    return authorizationErrorState(error);
  }

  const parsed = branchStatusSchema.safeParse({
    id: formData.get("id"),
    isActive: formData.get("isActive"),
  });

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  try {
    await prisma.branch.update({
      where: { id: parsed.data.id },
      data: {
        isActive: parsed.data.isActive,
        updatedAt: new Date(),
      },
    });

    revalidateBranches();
    return successState(
      parsed.data.isActive ? "Sede activada." : "Sede desactivada."
    );
  } catch (error) {
    return databaseErrorState(error, "No se pudo cambiar el estado de la sede.");
  }
}

function readBranchFormData(formData: FormData) {
  return {
    name: formData.get("name"),
    city: formData.get("city"),
  };
}

function authorizationErrorState(error: unknown): BranchActionState {
  if (isAuthorizationError(error)) {
    return errorState("No autorizado.");
  }

  throw error;
}

function validationErrorState(
  fieldErrors: Record<string, string[] | undefined>
): BranchActionState {
  const errors = Object.fromEntries(
    Object.entries(fieldErrors).filter(([, messages]) => messages?.length)
  ) as Record<string, string[]>;

  return {
    status: "error",
    message: "Revisa los campos marcados.",
    errors,
  };
}

function databaseErrorState(
  error: unknown,
  fallbackMessage: string
): BranchActionState {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return errorState("Ya existe una sede con ese nombre.");
  }

  return errorState(fallbackMessage);
}

function revalidateBranches() {
  revalidatePath("/admin");
  revalidatePath("/admin/sedes");
  revalidatePath("/admin/usuarios");
  revalidatePath("/supervision");
}

function successState(message: string): BranchActionState {
  return { status: "success", message };
}

function errorState(message: string): BranchActionState {
  return { status: "error", message };
}
