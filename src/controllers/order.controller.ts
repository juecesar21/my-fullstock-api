import { createOrderSchema } from "@/schemas/order.schemas.js";
import { orderServices } from "@/services/order.service.js";
import { BadRequestError } from "@/shared/errors.js";
import type { Request, Response, NextFunction } from "express";

export const orderController = {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      // const { userId } = req.session;
      // const orderData = createOrderSchema.parse(req.body);
      const { email, shippingInfo } = createOrderSchema.parse(req.body);
      const userId = req.session?.userId ?? null;
      const cartId = req.session?.cartId;

      if (!cartId) {
        throw new BadRequestError("No se encontró el carrito en la sesión");
      }
      const order = await orderServices.createOrder({
        userId,
        cartId,
        email,
        shippingInfo,
      });
      return res.status(201).json({ data: order });
    } catch (error) {
      return next(error);
    }
  },
};
