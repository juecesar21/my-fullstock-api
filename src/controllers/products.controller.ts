import type { NextFunction, Request, Response } from "express";
import { productsService } from "@/services/products.service.js";
import {
  categoryIdSchema,
  productIdSchema,
} from "@/schemas/products.schemas.js";

export const productsController = {
  async getProductsByCategoryId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { categoryId } = categoryIdSchema.parse(req.params);

      const products =
        await productsService.listProductsByCategoryId(categoryId);

      return res.json({ data: products });
    } catch (error) {
      return next(error);
    }
  },

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = productIdSchema.parse(req.params);

      const product = await productsService.getProductById(id);

      return res.json({ data: product });
    } catch (error) {
      return next(error);
    }
  },
};
