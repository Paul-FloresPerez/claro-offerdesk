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

const optionalUuid = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return null;
    }

    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  },
  z.string().uuid("Usuario invalido.").nullable()
);

const checkbox = z.preprocess(
  (value) => value === true || value === "true" || value === "on",
  z.boolean()
);

const photoUrl = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return null;
    }

    const trimmed = value.trim();
    return trimmed ? trimmed : null;
  },
  z
    .string()
    .max(500, "La URL de foto es demasiado larga.")
    .refine((value) => !/^[a-zA-Z]:[\\/]/.test(value), {
      message: "No uses rutas locales del equipo.",
    })
    .refine((value) => !value.startsWith("file:"), {
      message: "No uses rutas locales del equipo.",
    })
    .refine((value) => !value.includes("\\"), {
      message: "Usa rutas web con /, no rutas locales.",
    })
    .refine((value) => value.startsWith("/") || value.startsWith("https://"), {
      message: "Usa una ruta /usuarios/foto.jpg o una URL https://.",
    })
    .nullable()
);

const rankingBaseSchema = z.object({
  periodLabel: requiredText("El periodo", 80),
  rankPosition: z.coerce
    .number()
    .int("La posicion debe ser un numero entero.")
    .min(1, "La posicion debe ser mayor a 0.")
    .max(999, "La posicion es demasiado alta."),
  userId: optionalUuid,
  fullName: requiredText("El nombre mostrado", 120),
  branchName: optionalText(120),
  photoUrl,
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
