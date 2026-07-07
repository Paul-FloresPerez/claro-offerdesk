import { z } from "zod";

const requiredText = (label: string, max = 180) =>
  z
    .string()
    .trim()
    .min(1, `${label} es obligatorio.`)
    .max(max, `${label} es demasiado largo.`);

const optionalText = (max = 800) =>
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

const textList = z.preprocess(
  (value) => {
    if (Array.isArray(value)) {
      return value;
    }

    if (typeof value !== "string") {
      return [];
    }

    return value
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  },
  z.array(z.string().min(1).max(260)).max(30, "Demasiados elementos.")
);

const checkbox = z.preprocess(
  (value) => value === true || value === "true" || value === "on",
  z.boolean()
);

const promotionBaseSchema = z.object({
  title: requiredText("El titulo", 140),
  category: requiredText("La categoria", 120),
  description: requiredText("La descripcion", 700),
  price: requiredText("El precio", 80),
  benefits: textList,
  conditions: textList,
  validity: requiredText("La vigencia", 100),
  imageUrl: optionalText(700),
  isActive: checkbox,
  sortOrder: z.coerce
    .number()
    .int("El orden debe ser un numero entero.")
    .min(0, "El orden no puede ser negativo.")
    .max(9999, "El orden es demasiado alto."),
});

export const createPromotionSchema = promotionBaseSchema;

export const updatePromotionSchema = promotionBaseSchema.extend({
  id: z.string().uuid("Promocion invalida."),
});

export const promotionStatusSchema = z.object({
  id: z.string().uuid("Promocion invalida."),
  isActive: checkbox,
});

export type PromotionActionState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Record<string, string[]>;
};
