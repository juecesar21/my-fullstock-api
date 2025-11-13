import { categoriesRepository } from "@/repositories/categories.repository.js";
import { productsRepository } from "@/repositories/products.repository.js";
import { NotFoundError } from "@/shared/errors.js";

export const productsService = {
  async getProductById(id: number) {
    const product = await productsRepository.findById(id);

    if (!product) {
      throw new NotFoundError("Producto no encontrado");
    }

    return product;
  },

  async listProductsByCategoryId(categoryId: number) {
    const category = await categoriesRepository.findById(categoryId);

    if (!category) {
      throw new NotFoundError("Categoría no encontrada");
    }

    const products = await productsRepository.findByCategoryId(categoryId);
    return products;
  },
};
