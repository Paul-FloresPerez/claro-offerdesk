"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  createRankingSchema,
  rankingStatusSchema,
  updateRankingSchema,
  type RankingActionState,
} from "@/lib/validations/ranking";

const RANKING_ADMIN_PATH = "/admin/ranking";

export async function createRankingAction(
  _previousState: RankingActionState,
  formData: FormData
): Promise<RankingActionState> {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return errorState("No autorizado.");
  }

  const prepared = await prepareRankingFormData(formData);

  if (!prepared.ok) {
    return prepared.state;
  }

  const parsed = createRankingSchema.safeParse(prepared.data);

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  try {
    const now = new Date();

    await prisma.salesRanking.create({
      data: {
        id: randomUUID(),
        periodLabel: parsed.data.periodLabel,
        rankPosition: parsed.data.rankPosition,
        userId: parsed.data.userId,
        fullName: parsed.data.fullName,
        branchName: parsed.data.branchName,
        photoUrl: parsed.data.photoUrl,
        salesCount: parsed.data.salesCount,
        note: parsed.data.note,
        isActive: parsed.data.isActive,
        createdAt: now,
        updatedAt: now,
      },
    });

    revalidateRanking();
    return successState("Registro de ranking creado correctamente.");
  } catch (error) {
    return databaseErrorState(error, "No se pudo crear el registro.");
  }
}

export async function updateRankingAction(
  _previousState: RankingActionState,
  formData: FormData
): Promise<RankingActionState> {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return errorState("No autorizado.");
  }

  const prepared = await prepareRankingFormData(formData);

  if (!prepared.ok) {
    return prepared.state;
  }

  const parsed = updateRankingSchema.safeParse({
    ...prepared.data,
    id: formData.get("id"),
  });

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  try {
    await prisma.salesRanking.update({
      where: {
        id: parsed.data.id,
      },
      data: {
        periodLabel: parsed.data.periodLabel,
        rankPosition: parsed.data.rankPosition,
        userId: parsed.data.userId,
        fullName: parsed.data.fullName,
        branchName: parsed.data.branchName,
        photoUrl: parsed.data.photoUrl,
        salesCount: parsed.data.salesCount,
        note: parsed.data.note,
        isActive: parsed.data.isActive,
        updatedAt: new Date(),
      },
    });

    revalidateRanking();
    return successState("Registro de ranking actualizado correctamente.");
  } catch (error) {
    return databaseErrorState(error, "No se pudo actualizar el registro.");
  }
}

export async function setRankingStatusAction(
  _previousState: RankingActionState,
  formData: FormData
): Promise<RankingActionState> {
  const isAdmin = await requireAdmin();

  if (!isAdmin) {
    return errorState("No autorizado.");
  }

  const parsed = rankingStatusSchema.safeParse({
    id: formData.get("id"),
    isActive: formData.get("isActive"),
  });

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  try {
    await prisma.salesRanking.update({
      where: {
        id: parsed.data.id,
      },
      data: {
        isActive: parsed.data.isActive,
        updatedAt: new Date(),
      },
    });

    revalidateRanking();
    return successState(
      parsed.data.isActive ? "Registro activado." : "Registro desactivado."
    );
  } catch (error) {
    return databaseErrorState(error, "No se pudo cambiar el estado.");
  }
}

async function requireAdmin() {
  const session = await auth();
  return Boolean(session?.user?.isAdmin);
}

async function prepareRankingFormData(
  formData: FormData
): Promise<PrepareRankingFormResult> {
  const rawUserId = readText(formData.get("userId"));
  const linkedUser = rawUserId
    ? await prisma.user.findUnique({
        where: {
          id: rawUserId,
        },
        select: {
          id: true,
          fullName: true,
          branchName: true,
          photoUrl: true,
        },
      })
    : null;

  if (rawUserId && !linkedUser) {
    return {
      ok: false,
      state: fieldErrorState("userId", "El usuario vinculado no existe."),
    };
  }

  return {
    ok: true,
    data: {
      periodLabel: formData.get("periodLabel"),
      rankPosition: formData.get("rankPosition"),
      userId: rawUserId,
      fullName: readText(formData.get("fullName")) || linkedUser?.fullName || "",
      branchName:
        readText(formData.get("branchName")) || linkedUser?.branchName || "",
      photoUrl: readText(formData.get("photoUrl")) || linkedUser?.photoUrl || "",
      salesCount: formData.get("salesCount"),
      note: formData.get("note"),
      isActive: formData.get("isActive"),
    },
  };
}

type PrepareRankingFormResult =
  | {
      ok: true;
      data: Record<string, FormDataEntryValue | string | number | boolean | null>;
    }
  | {
      ok: false;
      state: RankingActionState;
    };

function readText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function revalidateRanking() {
  revalidatePath(RANKING_ADMIN_PATH);
  revalidatePath("/top-ventas");
}

function validationErrorState(
  fieldErrors: Record<string, string[] | undefined>
): RankingActionState {
  const errors = Object.fromEntries(
    Object.entries(fieldErrors).filter(([, messages]) => messages?.length)
  ) as Record<string, string[]>;

  return {
    status: "error",
    message: "Revisa los campos marcados.",
    errors,
  };
}

function fieldErrorState(field: string, message: string): RankingActionState {
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
): RankingActionState {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2003"
  ) {
    return errorState("El usuario vinculado no existe.");
  }

  return errorState(fallbackMessage);
}

function successState(message: string): RankingActionState {
  return {
    status: "success",
    message,
  };
}

function errorState(message: string): RankingActionState {
  return {
    status: "error",
    message,
  };
}
