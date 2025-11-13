import { authController } from "@/controllers/auth.controller.js";
import { Router } from "express";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", authController.me);
router.post("/logout", authController.logout);

export default router;
