import { query } from "@/db/index.js";
import type { Category } from "@/models/category.model.js";

export const categoriesRepository = {
  async findAll(): Promise<Category[]> {
    const result = await query<Category>("SELECT * FROM categories");
    return result.rows;
  },

  async findById(id: number): Promise<Category | null> {
    const result = await query<Category>(
      "SELECT * FROM categories WHERE id = $1",
      [id]
    );
    return result.rows[0] || null;
  },
};
