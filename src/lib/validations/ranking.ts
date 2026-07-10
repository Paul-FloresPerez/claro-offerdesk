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

const salesMetric = (label: string) =>
  z.preprocess(
    (value) => (value === "" || value === null ? 0 : value),
    z.coerce
      .number()
      .int(`${label} debe ser un numero entero.`)
      .min(0, `${label} no pueden ser negativas.`)
      .max(99999, `${label} es demasiado alta.`)
  );

const rankingBaseSchema = z.object({
  periodLabel: requiredText("El periodo", 80),
  userId: z.string().uuid("Selecciona un usuario activo."),
  fullName: requiredText("El nombre mostrado", 120),
  branchName: optionalText(120),
  photoUrl: optionalText(500),
  salesCount: salesMetric("Las ventas concretadas"),
  pendingSales: salesMetric("Las ventas pendientes"),
  rejectedSales: salesMetric("Las ventas rechazadas"),
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
