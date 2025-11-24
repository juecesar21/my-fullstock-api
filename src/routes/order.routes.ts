import { Router } from "express";
import { orderController } from "@/controllers/order.controller.js";

const router = Router();

router.post("/", orderController.createOrder);

router.get("/", orderController.getUserOrders);

router.get("/:orderId/items", orderController.getOrderItems);

export default router;
