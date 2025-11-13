// File to define schema zod for products
import * as z from "zod";

export const categoryIdSchema = z.object({
  categoryId: z.coerce
    .number("El ID de categoria debe ser un número")
    .positive("El ID de categoria debe ser un número positivo"),
});

export const productIdSchema = z.object({
  id: z.coerce
    .number("El ID de producto debe ser un número")
    .positive("El ID del producto debe ser un numero positivo"),
});
