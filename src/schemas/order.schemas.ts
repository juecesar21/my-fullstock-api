import * as z from "zod";

export const shippingInfoSchema = z.object({
  firstName: z
    .string({ error: "El nombre es obligatorio" })
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres"),

  lastName: z
    .string({ error: "El apellido es obligatorio" })
    .trim()
    .min(2, "El apellido debe tener al menos 2 caracteres"),

  company: z.string().trim().optional(),

  addres: z
    .string({ error: "La dirección es obligatoria" })
    .trim()
    .min(5, "La dirección debe tener al menos 5 caracteres"),

  city: z
    .string({ error: "La ciudad es obligatoria" })
    .trim()
    .min(4, "La ciudad debe tener al menos 2 caracteres"),

  coutry: z
    .string({ error: "El país es obligatorio" })
    .trim()
    .min(2, "El país debe tener al menos 2 caracteres"),

  state: z
    .string({ error: "El estado o provincia es obligatorio" })
    .trim()
    .min(2, "El estado o provincia debe tener al menos 2 caracteres"),

  postalCode: z
    .string({ error: "El código postal es obligatorio" })
    .trim()
    .min(3, "El código postal debe tener al menos 3 caracteres"),

  phone: z
    .string({ error: "El teléfono es obligatorio" })
    .trim()
    .regex(/^\+?[0-9\s-]+$/, "El número de teléfono no es válido"),
});

export const createOrderSchema = z.object({
  email: z
    .email({
      error: (issue) => {
        if (issue.input === undefined) return "El campo email es obligatorio";
        if (issue.code === "invalid_format")
          return "Formato de correo inválido";
        if (issue.code === "invalid_type") return "El campo debe ser un String";
        return "El correo es inválido";
      },
    })
    .trim()
    .toLowerCase(),
  shippingInfo: shippingInfoSchema,
});

export const orderIdSchema = z.object({
  orderId: z.coerce
    .number("El Id de la orden debe ser un numero")
    .int("El Id de la orden debe ser un numero entero")
    .positive("El Id de la orden debe ser un numero positivo"),
});
