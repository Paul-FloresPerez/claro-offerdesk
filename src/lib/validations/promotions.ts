import { z } from "zod";

export const promotionAssetKinds = [
  "FLYER",
  "COVERAGE",
  "OFFICIAL_TABLE",
  "OFFICIAL_DOCUMENT",
  "INTERNAL",
] as const;

const nullableText = (max: number) =>
  z.preprocess(
    (value) => {
      if (typeof value !== "string") return null;
      const trimmed = value.trim();
      return trimmed ? trimmed : null;
    },
    z.string().max(max, "El texto es demasiado largo.").nullable()
  );

const sortOrder = z.preprocess(
  (value) => (value === null || value === undefined || value === "" ? 0 : value),
  z.coerce.number().int().min(0).max(10_000)
);

export const promotionIdSchema = z.string().uuid("Promoción inválida.");
export const promotionAssetIdSchema = z.string().uuid("Material inválido.");

export const promotionAssetUploadSchema = z.object({
  promotionId: promotionIdSchema,
  kind: z.enum(promotionAssetKinds, {
    message: "Selecciona un tipo de material válido.",
  }),
  displayName: z
    .string()
    .trim()
    .min(1, "El nombre del material es obligatorio.")
    .max(160, "El nombre del material es demasiado largo."),
  altText: nullableText(300),
  sortOrder,
});

export function safeAssetDisplayName(value: string) {
  return value
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .slice(0, 160);
}
