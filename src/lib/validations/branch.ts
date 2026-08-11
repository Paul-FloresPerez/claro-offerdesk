import { z } from "zod";

const requiredText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} es obligatorio.`)
    .max(max, `${label} es demasiado largo.`);

const checkbox = z.preprocess(
  (value) => value === true || value === "true" || value === "on",
  z.boolean()
);

export const createBranchSchema = z.object({
  name: requiredText("El nombre", 120),
  city: requiredText("La ciudad", 120),
});

export const updateBranchSchema = createBranchSchema.extend({
  id: z.string().uuid("Sede invalida."),
});

export const branchStatusSchema = z.object({
  id: z.string().uuid("Sede invalida."),
  isActive: checkbox,
});

export type BranchActionState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Record<string, string[]>;
};
