import { Router } from "express";
import { cartController } from "@/controllers/cart.controller.js";

const router = Router();

router.get("/", cartController.getCart);
router.patch("/items/:productId", cartController.updateCartItem);
router.delete("/items/:productId", cartController.removeCartItem);
router.post("/clear", cartController.clearCart);

export default router;
