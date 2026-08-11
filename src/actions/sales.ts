"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import {
  AuthorizationError,
  isAuthorizationError,
  requireSupervisor,
  requireUser,
  type AccessScope,
  type AuthorizedUser,
} from "@/lib/authorization";
import { prisma } from "@/lib/prisma";
import {
  createSaleSchema,
  updateSaleSchema,
  type SaleActionState,
} from "@/lib/validations/sale";

type SaleManagerAuthorization = {
  user: AuthorizedUser;
  scope: Extract<AccessScope, { kind: "GLOBAL" | "BRANCH" }>;
};

class SaleAccessError extends Error {}

export async function createSaleAction(
  _previousState: SaleActionState,
  formData: FormData
): Promise<SaleActionState> {
  let authorization: SaleManagerAuthorization;

  try {
    authorization = await requireSaleManager();
  } catch (error) {
    return authorizationErrorState(error);
  }

  const parsed = createSaleSchema.safeParse(readSaleFormData(formData));

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  try {
    await prisma.$transaction(
      async (tx) => {
        const advisor = await getEligibleAdvisor(tx, parsed.data.advisorId);

        if (
          authorization.scope.kind === "BRANCH" &&
          advisor.branchId !== authorization.scope.branchId
        ) {
          throw new SaleAccessError(
            "El asesor seleccionado no pertenece a tu sede."
          );
        }

        await tx.sale.create({
          data: {
            advisorId: advisor.id,
            branchId: advisor.branchId,
            registeredById: authorization.user.id,
            customerName: parsed.data.customerName,
            customerDni: parsed.data.customerDni,
            customerPhone: parsed.data.customerPhone,
            customerEmail: parsed.data.customerEmail,
            customerAddress: parsed.data.customerAddress,
            service: parsed.data.service,
            planName: parsed.data.planName,
            status: parsed.data.status,
            rejectionReason:
              parsed.data.status === "RECHAZADA"
                ? parsed.data.rejectionReason
                : null,
            saleDate: toDatabaseDate(parsed.data.saleDate),
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );

    revalidateSales();
    return successState("Venta registrada correctamente.");
  } catch (error) {
    return databaseErrorState(error, "No se pudo registrar la venta.");
  }
}

export async function updateSaleAction(
  _previousState: SaleActionState,
  formData: FormData
): Promise<SaleActionState> {
  let authorization: SaleManagerAuthorization;

  try {
    authorization = await requireSaleManager();
  } catch (error) {
    return authorizationErrorState(error);
  }

  const parsed = updateSaleSchema.safeParse({
    id: formData.get("id"),
    ...readSaleFormData(formData),
  });

  if (!parsed.success) {
    return validationErrorState(parsed.error.flatten().fieldErrors);
  }

  try {
    await prisma.$transaction(
      async (tx) => {
        const currentSale = await tx.sale.findFirst({
          where:
            authorization.scope.kind === "BRANCH"
              ? {
                  id: parsed.data.id,
                  branchId: authorization.scope.branchId,
                }
              : { id: parsed.data.id },
          select: {
            id: true,
            advisorId: true,
            branchId: true,
          },
        });

        if (!currentSale) {
          throw new SaleAccessError("La venta no esta disponible para tu rol.");
        }

        if (parsed.data.advisorId !== currentSale.advisorId) {
          const advisor = await getEligibleAdvisor(tx, parsed.data.advisorId);

          if (advisor.branchId !== currentSale.branchId) {
            throw new SaleAccessError(
              "La venta solo puede asignarse a un asesor activo de la misma sede."
            );
          }
        }

        await tx.sale.update({
          where: { id: currentSale.id },
          data: {
            advisorId: parsed.data.advisorId,
            customerName: parsed.data.customerName,
            customerDni: parsed.data.customerDni,
            customerPhone: parsed.data.customerPhone,
            customerEmail: parsed.data.customerEmail,
            customerAddress: parsed.data.customerAddress,
            service: parsed.data.service,
            planName: parsed.data.planName,
            status: parsed.data.status,
            rejectionReason:
              parsed.data.status === "RECHAZADA"
                ? parsed.data.rejectionReason
                : null,
            saleDate: toDatabaseDate(parsed.data.saleDate),
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );

    revalidateSales();
    return successState("Venta actualizada correctamente.");
  } catch (error) {
    return databaseErrorState(error, "No se pudo actualizar la venta.");
  }
}

async function requireSaleManager(): Promise<SaleManagerAuthorization> {
  const user = await requireUser();

  if (user.role === "ADMIN") {
    return { user, scope: { kind: "GLOBAL" } };
  }

  if (user.role === "SUPERVISOR") {
    return requireSupervisor();
  }

  throw new AuthorizationError(
    "FORBIDDEN",
    "Los asesores no pueden registrar ni modificar ventas."
  );
}

async function getEligibleAdvisor(
  tx: Prisma.TransactionClient,
  advisorId: string
) {
  const advisor = await tx.user.findFirst({
    where: {
      id: advisorId,
      role: "ADVISOR",
      isActive: true,
      branchId: { not: null },
    },
    select: {
      id: true,
      branchId: true,
      branch: {
        select: { isActive: true },
      },
    },
  });

  if (!advisor?.branchId || !advisor.branch?.isActive) {
    throw new SaleAccessError(
      "Selecciona un asesor activo que pertenezca a una sede activa."
    );
  }

  return {
    id: advisor.id,
    branchId: advisor.branchId,
  };
}

function readSaleFormData(formData: FormData) {
  return {
    advisorId: formData.get("advisorId"),
    customerName: formData.get("customerName"),
    customerDni: formData.get("customerDni"),
    customerPhone: formData.get("customerPhone"),
    customerEmail: formData.get("customerEmail"),
    customerAddress: formData.get("customerAddress"),
    service: formData.get("service"),
    planName: formData.get("planName"),
    status: formData.get("status"),
    rejectionReason: formData.get("rejectionReason"),
    saleDate: formData.get("saleDate"),
  };
}

function toDatabaseDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function revalidateSales() {
  revalidatePath("/supervision");
  revalidatePath("/mis-ventas");
  revalidatePath("/admin/ventas");
  revalidatePath("/top-ventas");
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/ranking");
}

function authorizationErrorState(error: unknown): SaleActionState {
  if (isAuthorizationError(error)) {
    return errorState("No autorizado para realizar esta operacion.");
  }

  throw error;
}

function validationErrorState(
  fieldErrors: Record<string, string[] | undefined>
): SaleActionState {
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
): SaleActionState {
  if (error instanceof SaleAccessError) {
    return errorState(error.message);
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2034"
  ) {
    return errorState("La operacion tuvo un conflicto. Intenta nuevamente.");
  }

  return errorState(fallbackMessage);
}

function successState(message: string): SaleActionState {
  return { status: "success", message };
}

function errorState(message: string): SaleActionState {
  return { status: "error", message };
}
