import { createOrderSchema } from "@/schemas/order.schemas.js";
import { orderServices } from "@/services/order.service.js";
import { BadRequestError, UnauthorizedError } from "@/shared/errors.js";
import type { Request, Response, NextFunction } from "express";
import { orderIdSchema } from "@/schemas/order.schemas.js";

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
  async getUserOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.session;
      if (!userId) {
        return res.status(401).json({ error: "Usuario no autorizado" });
      }
      const orders = await orderServices.getOrdersByUserId(userId);
      return res.status(200).json({ data: orders });
    } catch (error) {
      return next(error);
    }
  },
  async getOrderItems(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = orderIdSchema.parse(req.params);
      const { userId } = req.session;
      if (!userId) {
        throw new UnauthorizedError("Usuario no autorizado");
      }
      const order = await orderServices.getOrderById(orderId);
      if (!orderId) {
        throw new BadRequestError("Orden no encontrada");
      }
      if (order?.userId !== userId) {
        throw new UnauthorizedError("no tiene permiso para ver este orden");
      }
      const items = await orderServices.getOrderItemsByOrderId(orderId);
      return res.status(200).json({ data: items });
    } catch (error) {
      return next(error);
    }
  },
};
