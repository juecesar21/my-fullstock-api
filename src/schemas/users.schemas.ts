import { registerSchema } from "@/schemas/auth.schemas.js";
import * as z from "zod";

export const userUpdateSchema = z
  .object({
    email: registerSchema.shape.email.optional(),
    password: registerSchema.shape.password.optional(),
  })
  .refine((data) => data.email || data.password, {
    message: "Debe enviar al menos email o password",
    path: ["email"],
  });
