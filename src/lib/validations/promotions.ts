import { z } from "zod";

export const promotionKinds = ["CAMPAIGN", "REGULAR_OFFER"] as const;
export const promotionStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export const promotionCategories = [
  "Hogar",
  "Convergencia",
  "Móvil",
  "Negocios",
] as const;
export const promotionTechnologies = ["FTTH", "HFC"] as const;
export const promotionPlayTypes = [
  "1 Play",
  "2 Play",
  "3 Play",
] as const;

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

const requiredText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} es obligatorio.`)
    .max(max, `${label} es demasiado largo.`);

const jsonStringArray = <T extends z.ZodTypeAny>(itemSchema: T, max = 50) =>
  z.preprocess(
    (value) => {
      if (typeof value !== "string" || !value.trim()) return [];

      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    },
    z.array(itemSchema).max(max, "Hay demasiados elementos.")
  );

const optionalDateTime = z.preprocess(
  (value) => {
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    return trimmed || null;
  },
  z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/,
      "Usa una fecha y hora válidas."
    )
    .refine(
      (value) => isValidPromotionLocalDate(value),
      "Usa una fecha y hora válidas."
    )
    .nullable()
);

const listItemSchema = z
  .string()
  .trim()
  .min(1, "El elemento no puede estar vacío.")
  .max(500, "El elemento es demasiado largo.");

export const promotionDraftSchema = z
  .object({
    title: requiredText("El título", 160),
    slug: requiredText("El slug", 180).regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "El slug solo puede contener minúsculas, números y guiones."
    ),
    shortDescription: nullableText(500),
    kind: z.enum(promotionKinds, {
      message: "Selecciona un tipo de promoción válido.",
    }),
    category: z.preprocess(
      (value) => (typeof value === "string" && value.trim() ? value : null),
      z.enum(promotionCategories).nullable()
    ),
    tags: jsonStringArray(z.string().trim().min(1).max(60), 30),
    featured: z.preprocess(
      (value) => value === "true" || value === "on" || value === true,
      z.boolean()
    ),
    sortOrder,
    validFrom: optionalDateTime,
    validUntil: optionalDateTime,
    technologies: jsonStringArray(z.enum(promotionTechnologies), 2),
    playTypes: jsonStringArray(z.enum(promotionPlayTypes), 3),
    zoneSummary: nullableText(2_000),
    benefits: jsonStringArray(listItemSchema),
    conditions: jsonStringArray(listItemSchema),
    validations: jsonStringArray(listItemSchema),
    commercialText: nullableText(10_000),
  })
  .superRefine((value, context) => {
    if (
      value.validFrom &&
      value.validUntil &&
      parsePromotionLocalDate(value.validUntil) <
        parsePromotionLocalDate(value.validFrom)
    ) {
      context.addIssue({
        code: "custom",
        path: ["validUntil"],
        message: "La fecha final no puede ser anterior a la fecha inicial.",
      });
    }
  });

export type PromotionDraftInput = z.infer<typeof promotionDraftSchema>;

export function parsePromotionLocalDate(value: string) {
  // Claro OfferDesk opera en Perú (UTC-05:00, sin horario de verano).
  return new Date(`${value}:00-05:00`);
}

function isValidPromotionLocalDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return false;
  const [, yearValue, monthValue, dayValue, hourValue, minuteValue] = match;
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);
  const hour = Number(hourValue);
  const minute = Number(minuteValue);
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return (
    year >= 2000 &&
    year <= 2200 &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= daysInMonth &&
    hour >= 0 &&
    hour <= 23 &&
    minute >= 0 &&
    minute <= 59
  );
}

export function slugifyPromotionTitle(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

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
