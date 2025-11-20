import { Router } from "express";
import authRoutes from "./routes/auth.routes.js";
import categoriesRoutes from "@/routes/categories.routes.js";
import productsRoutes from "@/routes/products.routes.js";
import usersRoutes from "@/routes/users.routes.js";

const router = Router();

router.use("/api/", authRoutes);
router.use("/api/categories", categoriesRoutes);
router.use("/api/products", productsRoutes);
router.use("/api/profile", usersRoutes);

export default router;
