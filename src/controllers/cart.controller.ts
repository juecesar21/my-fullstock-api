import {
  cartItemBodySchema,
  cartItemParamsSchema,
} from "@/schemas/cart.schemas.js";
import { cartService } from "@/services/carts.service.js";
import type { Request, Response, NextFunction } from "express";
import { saveSession } from "@/shared/session.js";

export const cartController = {
  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, cartId } = req.session;
      const cart = await cartService.getOrCreateCart({ userId, cartId });

      if (req.session.cartId !== cart.id) {
        req.session.cartId = cart.id;
        await saveSession(req);
      }

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

      if (req.session.cartId !== cart.id) {
        req.session.cartId = cart.id;
        await saveSession(req);
      }

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
      return res.sendStatus(204);
    } catch (error) {
      return next(error);
    }
  },
  async clearCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, cartId } = req.session;
      await cartService.clearCart({ userId, cartId });
      return res.sendStatus(204);
    } catch (error) {
      return next(error);
    }
  },
};
