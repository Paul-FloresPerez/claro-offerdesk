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

const userBaseSchema = z.object({
  fullName: requiredText("El nombre completo", 120),
  username: requiredText("El usuario", 50)
    .toLowerCase()
    .regex(
      /^[a-z0-9._-]+$/,
      "Usa solo letras, numeros, punto, guion o guion bajo."
    ),
  dni: requiredText("El DNI", 20).regex(
    /^[a-zA-Z0-9.-]+$/,
    "El DNI solo debe contener letras, numeros, punto o guion."
  ),
  email: requiredText("El correo", 160).toLowerCase().email("Correo invalido."),
  branchName: optionalText(120),
  photoUrl: optionalText(500),
  isAdmin: checkbox,
  isActive: checkbox,
});

export const createUserSchema = userBaseSchema.extend({
  password: z
    .string()
    .min(8, "La contrasena temporal debe tener al menos 8 caracteres.")
    .max(128, "La contrasena temporal es demasiado larga."),
});

export const updateUserSchema = userBaseSchema.extend({
  id: z.string().uuid("Usuario invalido."),
});

export const userStatusSchema = z.object({
  id: z.string().uuid("Usuario invalido."),
  isActive: checkbox,
});

export const userRoleSchema = z.object({
  id: z.string().uuid("Usuario invalido."),
  isAdmin: checkbox,
});

export const resetUserPasswordSchema = z.object({
  id: z.string().uuid("Usuario invalido."),
  password: z
    .string()
    .min(8, "La nueva contrasena debe tener al menos 8 caracteres.")
    .max(128, "La nueva contrasena es demasiado larga."),
});

export type UserActionState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Record<string, string[]>;
};
