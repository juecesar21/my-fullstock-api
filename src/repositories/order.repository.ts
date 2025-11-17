import { getClient, query } from "@/db/index.js";
import type { Order, OrderDto, OrderItemsDto } from "@/models/order.models.js";

export const orderRepository = {
  async createOrderWithItems(
    orderData: OrderDto,
    items: OrderItemsDto[]
  ): Promise<Order> {
    const client = await getClient();
    try {
      await client.query("BEGIN");
      const orderResult = await client.query<Order>(
        `INSERT INTO orders (userId, email, shippingInfo,status, total) 
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *`,
        [
          orderData.userId ?? null,
          orderData.email,
          JSON.stringify(orderData.shippingInfo),
          orderData.status,
          orderData.total,
        ]
      );
      const order = orderResult.rows[0]!;
      for (const item of items) {
        await client.query<OrderItemsDto>(
          `INSERT INTO orderItems (orderId, productId, title, imgSrc, quantity, price, lineTotal)
            VALUES ($1,$2, $3, $4, $5, $6, $7)`,
          [
            order?.id,
            item.productId,
            item.title,
            item.imgSrc,
            item.quantity,
            item.price,
            item.lineTotal,
          ]
        );
      }
      await client.query("COMMIT");
      return order;
    } catch (error) {
      await query("ROLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    const result = await query<Order>(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY  created_at DESC`,
      [userId]
    );
    return result.rows;
  },
};
