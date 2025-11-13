import type { NextFunction, Request, Response } from "express";
import { categoriesService } from "@/services/categories.service.js";

export const categoriesController = {
  async getCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoriesService.listCategories();
      return res.json({ data: categories });
    } catch (error) {
      return next(error);
    }
  },
};
