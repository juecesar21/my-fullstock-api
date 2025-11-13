import { Router } from "express";
import { productsController } from "@/controllers/products.controller.js";

const router = Router();

router.get("/:id", productsController.getProductById);

export default router;
