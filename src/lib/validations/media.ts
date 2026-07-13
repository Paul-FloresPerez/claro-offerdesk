import { z } from "zod";

export const mediaTypes = ["audio", "video"] as const;
export type MediaType = (typeof mediaTypes)[number];

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

const mediaBaseSchema = z.object({
  title: requiredText("El titulo", 120),
  description: optionalText(500),
  mediaType: z.enum(mediaTypes, {
    message: "Selecciona audio o video.",
  }),
  fileUrl: optionalText(700),
  weekLabel: optionalText(80),
  isActive: checkbox,
});

export const createMediaSchema = mediaBaseSchema;

export const updateMediaSchema = mediaBaseSchema.extend({
  id: z.string().uuid("Material invalido."),
});

export const mediaStatusSchema = z.object({
  id: z.string().uuid("Material invalido."),
  isActive: checkbox,
});

export const featuredMediaSchema = z.object({
  id: z.string().uuid("Material invalido."),
});

export type MediaActionState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Record<string, string[]>;
};
