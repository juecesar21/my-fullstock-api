import { query } from "@/db/index.js";
import { type Product } from "@/models/product.model.js";

export const productsRepository = {
  async findById(id: number): Promise<Product | null> {
    const result = await query<Product>(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  },

  async findByCategoryId(categoryId: number): Promise<Product[]> {
    const result = await query<Product>(
      "SELECT * FROM products WHERE category_id = $1",
      [categoryId]
    );
    return result.rows;
  },
  async findProductsByIds(ids: number[]): Promise<Product[]> {
    if (ids.length === 0) return [];
    const result = await query<Product>(
      "SELECT * FROM  products WHERE id=ANY($1)",
      [ids]
    );
    return result.rows;
  },
};
