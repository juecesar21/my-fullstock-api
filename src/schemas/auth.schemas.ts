// File to define schema zod for auth
import * as z from "zod";

export const registerSchema = z
  .object({
    email: z
      .email({
        error: (issue) => {
          if (issue.input === undefined) return "El campo email es obligatorio";
          if (issue.code === "invalid_format")
            return "Formato de correo inválido";
          if (issue.code === "invalid_type")
            return "El campo debe ser un String";
          return "El correo es inválido";
        },
      })
      .trim()
      .toLowerCase(),

    password: z
      .string({ error: "El campo contraseña es obligatorio" })
      .min(6, { error: "La contraseña debe tener al menos 6 caracteres" })
      .regex(/[A-Z]/, { error: "Debe tener al menos una mayúscula" })
      .regex(/[a-z]/, { error: "Debe tener al menos una minúscula" })
      .regex(/[0-9]/, { error: "Debe tener al menos un número" })
      .regex(/[^A-Za-z0-9]/, {
        error: "Debe tener al menos un carácter especial",
      }),

    confirmPassword: z.string({
      error: "El campo confirmar contraseña es obligatorio",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export const loginSchema = registerSchema.pick({ email: true, password: true });
