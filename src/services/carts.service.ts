import type { Cart, CartDto, HydratedCartItem } from "@/models/cart.models.js";
import { cartsRepository } from "@/repositories/carts.repository.js";
import { productsRepository } from "@/repositories/products.repository.js";
import { NotFoundError } from "@/shared/errors.js";
export async function findOrCreateCart(
  userId?: number,
  cartId?: number
): Promise<Cart> {
  let cart: Cart | null = null;

  if (cartId) {
    cart = await cartsRepository.findCartById(cartId);
  }
  if (!cartId && userId) {
    cart = await cartsRepository.findCartByUserId(userId);
  }
  if (!cart) {
    cart = await cartsRepository.createCart(userId);
  }
  return cart;
}

async function findCart(
  userId?: number,
  cartId?: number
): Promise<Cart | null> {
  let cart: Cart | null = null;
  if (cartId) {
    cart = await cartsRepository.findCartById(cartId);
  }
  if (!cartId && userId) {
    cart = await cartsRepository.findCartByUserId(userId);
  }
  return cart;
}

export const cartService = {
  async getOrCreateCart({
    userId,
    cartId,
  }: {
    userId?: number | undefined;
    cartId?: number | undefined;
  }): Promise<CartDto> {
    const cart = await findOrCreateCart(userId, cartId);
    const cartItems = await cartsRepository.findCartItemByCartId(cart.id);
    if (cartItems.length === 0) {
      return {
        id: cart.id,
        items: [],
        totals: {
          itemCount: 0,
          grandTotal: 0,
        },
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
      };
    }
    const productIds = cartItems.map((item) => item.productId);

    const products = await productsRepository.findProductsByIds(productIds);

    const productMap = new Map(products.map((p) => [p.id, p]));

    const hydratedItems: HydratedCartItem[] = [];
    let itemCount = 0;
    let grandTotal = 0;

    for (const item of cartItems) {
      const product = productMap.get(item.productId);
      if (!product) {
        console.log(`Producto con Id ${item.productId} no encontrado`);
        continue;
      }

      const lineTotal = item.quantity * product.price;
      hydratedItems.push({
        productId: item.productId,
        name: product.title,
        imageUrl: product.imgSrc,
        quantity: item.quantity,
        unitPrice: product.price,
        lineTotal: lineTotal,
      });
      itemCount += item.quantity;
      grandTotal += lineTotal;
    }
    return {
      id: cart.id,
      items: hydratedItems,
      totals: {
        itemCount,
        grandTotal,
      },
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    };
  },

  async updateCartItem({
    userId,
    cartId,
    productId,
    quantity,
  }: {
    userId: number | undefined;
    cartId: number | undefined;
    productId: number;
    quantity: number;
  }): Promise<CartDto> {
    const product = await productsRepository.findById(productId);
    if (!product) {
      throw new NotFoundError(`Producto con id ${productId} no encontrado`);
    }
    const cart = await findOrCreateCart(userId, cartId);

    await cartsRepository.upsertCartItem(cart.id, productId, quantity);

    const updatedCart = await this.getOrCreateCart({ userId, cartId: cart.id });
    return updatedCart;
  },

  async removeCartItem({
    userId,
    cartId,
    productId,
  }: {
    userId: number | undefined;
    cartId: number | undefined;
    productId: number;
  }): Promise<void> {
    const cart = await findCart(userId, cartId);
    if (!cart) return;
    await cartsRepository.deleteCartItem(cart.id, productId);
  },
  async clearCart({
    userId,
    cartId,
  }: {
    userId: number | undefined;
    cartId: number | undefined;
  }): Promise<void> {
    const cart = await findCart(userId, cartId);
    if (!cart) return;
    await cartsRepository.clearCart(cart.id);
  },
};
