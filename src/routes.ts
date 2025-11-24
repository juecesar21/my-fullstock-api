import { Router } from "express";
import authRoutes from "./routes/auth.routes.js";
import categoriesRoutes from "@/routes/categories.routes.js";
import productsRoutes from "@/routes/products.routes.js";
import usersRoutes from "@/routes/users.routes.js";
import cartRoutes from "@/routes/cart.routes.js";
import orderRoutes from "@/routes/order.routes.js";

const router = Router();

router.use("/api/", authRoutes);
router.use("/api/categories", categoriesRoutes);
router.use("/api/products", productsRoutes);
router.use("/api/profile", usersRoutes);
router.use("/api/cart", cartRoutes);
router.use("/api/orders", orderRoutes);

export default router;
