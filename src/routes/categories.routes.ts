import { Router } from "express";
import { categoriesController } from "@/controllers/categories.controller.js";
import { productsController } from "@/controllers/products.controller.js";

const router = Router();

router.get("/", categoriesController.getCategories);
router.get("/:categoryId/products", productsController.getProductsByCategoryId);

export default router;
