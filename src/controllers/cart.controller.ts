import {
  cartItemBodySchema,
  cartItemParamsSchema,
} from "@/schemas/cart.schemas.js";
import { cartService } from "@/services/carts.service.js";
import { commitSession } from "@/shared/session.js";
import type { Request, Response, NextFunction } from "express";

export const cartController = {
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, cartId } = req.session;
      const cart = await cartService.getOrCreateCart({ userId, cartId });

      await commitSession(req, { cartId: cart.id });

      return res.status(200).json({ data: cart });
    } catch (error) {
      return next(error);
    }
  },
  async updateCartItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, cartId } = req.session;
      const { productId } = cartItemParamsSchema.parse(req.params);
      const { quantity } = cartItemBodySchema.parse(req.body);

      const cart = await cartService.updateCartItem({
        userId,
        cartId,
        productId,
        quantity,
      });

      await commitSession(req, { cartId: cart.id });

      return res.status(200).json({ data: cart });
    } catch (error) {
      return next(error);
    }
  },
  async removeCartItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, cartId } = req.session;
      const { productId } = cartItemParamsSchema.parse(req.params);
      await cartService.removeCartItem({ userId, cartId, productId });
      return res.status(204);
    } catch (error) {
      return next(error);
    }
  },
  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, cartId } = req.session;
      await cartService.clearCart({ userId, cartId });
      return res.status(204);
    } catch (error) {
      return next(error);
    }
  },
};
