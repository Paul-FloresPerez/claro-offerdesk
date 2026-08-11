"use server";

import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { isAuthorizationError, requireAdmin } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import {
  resolveUserRole,
  roleToIsAdmin,
  type UserRoleValue,
} from "@/lib/roles";
import {
  createUserSchema,
  resetUserPasswordSchema,
  updateUserSchema,
  userStatusSchema,
  type UserActionState,
} from "@/lib/validations/user";

const USERS_ADMIN_PATH = "/admin/usuarios";

type ExistingAssignment = {
  branchId: string | null;
  branchName: string | null;
  role: UserRoleValue | null;
  isAdmin: boolean;
};

class UserAssignmentError extends Error {}
class LastActiveAdminError extends Error {}

export async function createUserAction(
  _previousState: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  try {
    await requireAdmin();
  } catch (error) {
    return authorizationErrorState(error);
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
    const assignment = await resolveBranchAssignment(
      parsed.data.role,
      parsed.data.branchId
    );
    const now = new Date();
    const passwordHash = await bcrypt.hash(parsed.data.password, 12);

    await prisma.user.create({
      data: {
        id: randomUUID(),
        email: parsed.data.email,
        username: parsed.data.username,
        dni: parsed.data.dni,
        passwordHash,
        fullName: parsed.data.fullName,
        branchId: assignment.branchId,
        branchName: assignment.branchName,
        role: parsed.data.role,
        photoUrl: parsed.data.photoUrl,
        isAdmin: roleToIsAdmin(parsed.data.role),
        isActive: parsed.data.isActive,
        mustChangePassword: true,
        createdAt: now,
        updatedAt: now,
      },
    });

    revalidateUsers();
    return successState("Usuario creado correctamente.");
  } catch (error) {
    return databaseErrorState(error, "No se pudo crear el usuario.");
  }
}

export async function updateUserAction(
  _previousState: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  let adminId: string;

  try {
    const authorization = await requireAdmin();
    adminId = authorization.user.id;
  } catch (error) {
    return authorizationErrorState(error);
  }

  const parsed = updateUserSchema.safeParse(readUserFormData(formData, false));

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  if (
    parsed.data.id === adminId &&
    (parsed.data.role !== "ADMIN" || !parsed.data.isActive)
  ) {
    return errorState(
      "No puedes quitarte permisos admin ni desactivar tu propia cuenta."
    );
  }

  const uniqueError = await getUniqueError(parsed.data, parsed.data.id);

  if (uniqueError) {
    return uniqueError;
  }

  try {
    await prisma.$transaction(
      async (tx) => {
        const current = await tx.user.findUnique({
          where: { id: parsed.data.id },
          select: {
            branchId: true,
            branchName: true,
            role: true,
            isAdmin: true,
            isActive: true,
          },
        });

        if (!current) {
          throw new UserAssignmentError("El usuario ya no existe.");
        }

        const currentRole = resolveUserRole(current.role, current.isAdmin);
        const removesActiveAdmin =
          currentRole === "ADMIN" &&
          current.isActive &&
          (parsed.data.role !== "ADMIN" || !parsed.data.isActive);

        if (removesActiveAdmin) {
          await assertAnotherActiveAdmin(tx);
        }

        const assignment = await resolveBranchAssignment(
          parsed.data.role,
          parsed.data.branchId,
          current,
          tx
        );

        await tx.user.update({
          where: { id: parsed.data.id },
          data: {
            email: parsed.data.email,
            username: parsed.data.username,
            dni: parsed.data.dni,
            fullName: parsed.data.fullName,
            branchId: assignment.branchId,
            branchName: assignment.branchName,
            role: parsed.data.role,
            photoUrl: parsed.data.photoUrl,
            isAdmin: roleToIsAdmin(parsed.data.role),
            isActive: parsed.data.isActive,
            updatedAt: new Date(),
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );

    revalidateUsers();
    return successState("Usuario actualizado correctamente.");
  } catch (error) {
    return databaseErrorState(error, "No se pudo actualizar el usuario.");
  }
}

export async function setUserStatusAction(
  _previousState: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  let adminId: string;

  try {
    const authorization = await requireAdmin();
    adminId = authorization.user.id;
  } catch (error) {
    return authorizationErrorState(error);
  }

  const parsed = userStatusSchema.safeParse({
    id: formData.get("id"),
    isActive: formData.get("isActive"),
  });

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  if (parsed.data.id === adminId && !parsed.data.isActive) {
    return errorState("No puedes desactivar tu propia cuenta.");
  }

  try {
    await prisma.$transaction(
      async (tx) => {
        const current = await tx.user.findUnique({
          where: { id: parsed.data.id },
          select: { role: true, isAdmin: true, isActive: true },
        });

        if (!current) {
          throw new UserAssignmentError("El usuario ya no existe.");
        }

        if (
          current.isActive &&
          resolveUserRole(current.role, current.isAdmin) === "ADMIN" &&
          !parsed.data.isActive
        ) {
          await assertAnotherActiveAdmin(tx);
        }

        await tx.user.update({
          where: { id: parsed.data.id },
          data: {
            isActive: parsed.data.isActive,
            updatedAt: new Date(),
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );

    revalidateUsers();
    return successState(
      parsed.data.isActive ? "Usuario activado." : "Usuario desactivado."
    );
  } catch (error) {
    return databaseErrorState(error, "No se pudo cambiar el estado.");
  }
}

export async function resetUserPasswordAction(
  _previousState: UserActionState,
  formData: FormData
): Promise<UserActionState> {
  try {
    await requireAdmin();
  } catch (error) {
    return authorizationErrorState(error);
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
      where: { id: parsed.data.id },
      data: {
        passwordHash,
        mustChangePassword: true,
        updatedAt: new Date(),
      },
    });

    revalidateUsers();
    return successState("Contrasena reiniciada correctamente.");
  } catch (error) {
    return databaseErrorState(error, "No se pudo reiniciar la contrasena.");
  }
}

function readUserFormData(formData: FormData, includePassword: boolean) {
  return {
    id: formData.get("id"),
    fullName: formData.get("fullName"),
    username: formData.get("username"),
    dni: formData.get("dni"),
    email: formData.get("email"),
    role: formData.get("role"),
    branchId: formData.get("branchId"),
    photoUrl: formData.get("photoUrl"),
    isActive: formData.get("isActive"),
    password: includePassword ? formData.get("password") : undefined,
  };
}

async function resolveBranchAssignment(
  role: UserRoleValue,
  requestedBranchId: string | null,
  existing?: ExistingAssignment,
  client: Prisma.TransactionClient | typeof prisma = prisma
) {
  if (role === "ADMIN") {
    return { branchId: null, branchName: null };
  }

  if (!requestedBranchId) {
    const keepsLegacyAdvisorWithoutBranch =
      role === "ADVISOR" &&
      existing &&
      resolveUserRole(existing.role, existing.isAdmin) === "ADVISOR" &&
      existing.branchId === null;

    if (keepsLegacyAdvisorWithoutBranch) {
      return { branchId: null, branchName: existing.branchName };
    }

    throw new UserAssignmentError(
      role === "SUPERVISOR"
        ? "El supervisor debe tener una sede activa."
        : "El asesor debe tener una sede activa."
    );
  }

  const branch = await client.branch.findUnique({
    where: { id: requestedBranchId },
    select: { id: true, name: true, isActive: true },
  });

  if (!branch) {
    throw new UserAssignmentError("La sede seleccionada no existe.");
  }

  if (!branch.isActive && requestedBranchId !== existing?.branchId) {
    throw new UserAssignmentError("La sede seleccionada esta inactiva.");
  }

  return { branchId: branch.id, branchName: branch.name };
}

async function assertAnotherActiveAdmin(tx: Prisma.TransactionClient) {
  const activeAdminCount = await tx.user.count({
    where: {
      isActive: true,
      OR: [{ role: "ADMIN" }, { role: null, isAdmin: true }],
    },
  });

  if (activeAdminCount <= 1) {
    throw new LastActiveAdminError();
  }
}

async function getUniqueError(
  input: { username: string; dni: string; email: string },
  ignoredUserId?: string
): Promise<UserActionState | null> {
  const duplicate = await prisma.user.findFirst({
    where: {
      AND: [
        ignoredUserId ? { id: { not: ignoredUserId } } : {},
        {
          OR: [
            { username: input.username },
            { dni: input.dni },
            { email: input.email },
          ],
        },
      ],
    },
    select: { username: true, dni: true, email: true },
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

function revalidateUsers() {
  revalidatePath(USERS_ADMIN_PATH);
  revalidatePath("/admin");
  revalidatePath("/admin/sedes");
  revalidatePath("/supervision");
  revalidatePath("/top-ventas");
  revalidatePath("/");
}

function authorizationErrorState(error: unknown): UserActionState {
  if (isAuthorizationError(error)) {
    return errorState("No autorizado.");
  }

  throw error;
}

function validationErrorState(
  fieldErrors: Record<string, string[] | undefined>
): UserActionState {
  const errors = Object.fromEntries(
    Object.entries(fieldErrors).filter(([, messages]) => messages?.length)
  ) as Record<string, string[]>;

  return { status: "error", message: "Revisa los campos marcados.", errors };
}

function fieldErrorState(field: string, message: string): UserActionState {
  return { status: "error", message, errors: { [field]: [message] } };
}

function databaseErrorState(
  error: unknown,
  fallbackMessage: string
): UserActionState {
  if (error instanceof UserAssignmentError) {
    return errorState(error.message);
  }

  if (error instanceof LastActiveAdminError) {
    return errorState("Debe permanecer al menos un administrador activo.");
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return errorState("Ya existe un usuario con esos datos.");
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2034"
  ) {
    return errorState("La operacion tuvo un conflicto. Intenta nuevamente.");
  }

  return errorState(fallbackMessage);
}

function successState(message: string): UserActionState {
  return { status: "success", message };
}

function errorState(message: string): UserActionState {
  return { status: "error", message };
}
