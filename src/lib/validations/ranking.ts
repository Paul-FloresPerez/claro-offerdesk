import { z } from "zod";

const requiredText = (label: string, max = 160) =>
  z
    .string()
    .trim()
    .min(1, `${label} es obligatorio.`)
    .max(max, `${label} es demasiado largo.`);

const optionalText = (max = 500) =>
  z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return null;
      }

      const trimmed = value.trim();
      return trimmed ? trimmed : null;
    },
    z.string().max(max, "El texto es demasiado largo.").nullable()
  );

const checkbox = z.preprocess(
  (value) => value === true || value === "true" || value === "on",
  z.boolean()
);

const rankingBaseSchema = z.object({
  periodLabel: requiredText("El periodo", 80),
  rankPosition: z.coerce
    .number()
    .int("La posicion debe ser un numero entero.")
    .min(1, "La posicion debe ser mayor a 0.")
    .max(999, "La posicion es demasiado alta."),
  userId: z.string().uuid("Selecciona un usuario activo."),
  fullName: requiredText("El nombre mostrado", 120),
  branchName: optionalText(120),
  photoUrl: optionalText(500),
  salesCount: z.coerce
    .number()
    .int("Las ventas deben ser un numero entero.")
    .min(0, "Las ventas no pueden ser negativas.")
    .max(99999, "La cantidad de ventas es demasiado alta."),
  note: optionalText(500),
  isActive: checkbox,
});

export const createRankingSchema = rankingBaseSchema;

export const updateRankingSchema = rankingBaseSchema.extend({
  id: z.string().uuid("Registro invalido."),
});

export const rankingStatusSchema = z.object({
  id: z.string().uuid("Registro invalido."),
  isActive: checkbox,
});

export type RankingActionState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Record<string, string[]>;
};
