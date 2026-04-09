import { query } from "@/db/index.js";
import { type Cart, type CartItem } from "@/models/cart.models.js";

export const cartsRepository = {
  async findCartById(id: number): Promise<Cart | null> {
    const result = await query<Cart>("SELECT * FROM carts WHERE id = $1", [id]);
    return result.rows[0] || null;
  },

  async findCartByUserId(userId: number): Promise<Cart | null> {
    const result = await query<Cart>(
      "SELECT * FROM carts  WHERE user_id = $1",
      [userId]
    );
    return result.rows[0] || null;
  },

  async findCartItemByCartId(cartId: number): Promise<CartItem[]> {
    const result = await query<CartItem>(
      "SELECT * FROM cart_items WHERE cart_id = $1",
      [cartId]
    );
    return result.rows;
  },

  async createCart(userId?: number): Promise<Cart> {
    const result = await query<Cart>(
      "INSERT INTO carts (user_id) VALUES ($1) RETURNING *",
      [userId ?? null]
    );
    if (!result.rows[0]) {
      throw new Error("Failed to create cart");
    }
    return result.rows[0] || null;
  },
  async upsertCartItem(
    cartId: number,
    productId: number,
    quantity: number
  ): Promise<CartItem> {
    const result = await query<CartItem>(
      `INSERT INTO cart_items (cart_id, product_id, quantity)
       VALUES ($1, $2, $3) 
       ON CONFLICT (cart_id, product_id)
        DO UPDATE SET quantity = $3, update_at = NOW()
        RETURNING *
       `,
      [cartId, productId, quantity]
    );
    if (!result.rows[0]) {
      throw new Error("Failed to upsert cart item");
    }
    return result.rows[0] || null;
  },
  async deleteCartItem(cartId: number, productId: number): Promise<void> {
    await query<Cart>(
      "DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2",
      [cartId, productId]
    );
  },
  async clearCart(cartId: number): Promise<void> {
    await query<Cart>("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);
  },
};
