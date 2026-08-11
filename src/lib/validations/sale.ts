import { z } from "zod";
import { SALE_STATUS_VALUES } from "@/lib/sale-status";

const requiredText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} es obligatorio.`)
    .max(max, `${label} es demasiado largo.`);

const optionalText = (label: string, max: number) =>
  z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return null;
      }

      const trimmed = value.trim();
      return trimmed || null;
    },
    z.string().max(max, `${label} es demasiado largo.`).nullable()
  );

const optionalEmail = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return null;
    }

    const trimmed = value.trim().toLowerCase();
    return trimmed || null;
  },
  z
    .string()
    .max(160, "El correo es demasiado largo.")
    .email("Correo invalido.")
    .nullable()
);

const saleDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Selecciona una fecha valida.")
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }, "Selecciona una fecha valida.");

const saleBaseSchema = z
  .object({
    advisorId: z.string().uuid("Selecciona un asesor valido."),
    customerName: requiredText("El cliente", 160),
    customerDni: requiredText("El DNI", 20).regex(
      /^[a-zA-Z0-9.-]+$/,
      "El DNI solo debe contener letras, numeros, punto o guion."
    ),
    customerPhone: requiredText("El telefono", 30).regex(
      /^[+0-9()\s.-]+$/,
      "Ingresa un telefono valido."
    ),
    customerEmail: optionalEmail,
    customerAddress: optionalText("La direccion", 240),
    service: requiredText("El servicio", 120),
    planName: optionalText("El plan", 160),
    status: z.enum(SALE_STATUS_VALUES, {
      message: "Selecciona un estado valido.",
    }),
    rejectionReason: optionalText("El motivo de rechazo", 300),
    saleDate,
  })
  .superRefine((data, context) => {
    if (data.status === "RECHAZADA" && !data.rejectionReason) {
      context.addIssue({
        code: "custom",
        path: ["rejectionReason"],
        message: "El motivo es obligatorio para una venta rechazada.",
      });
    }
  });

export const createSaleSchema = saleBaseSchema;

export const updateSaleSchema = saleBaseSchema.extend({
  id: z.string().uuid("Venta invalida."),
});

export type SaleActionState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Record<string, string[]>;
};
