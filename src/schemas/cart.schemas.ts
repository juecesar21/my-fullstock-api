import * as z from "zod";

export const cartItemParamsSchema = z.object({
  productId: z.coerce
    .number("El Id del producto debe ser un numero")
    .int("El Id del producto debe ser un numero entero")
    .positive("El Id del Producto debe ser un numero positivo"),
});

export const cartItemBodySchema = z.object({
  quantity: z.coerce
    .number("El el campo debe ser un numero")
    .int("El campo debe ser un numero entero")
    .positive("El campo debe ser un numero positivo"),
});
