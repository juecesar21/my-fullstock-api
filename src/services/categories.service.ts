import { categoriesRepository } from "@/repositories/categories.repository.js";

export const categoriesService = {
  async listCategories() {
    const categories = await categoriesRepository.findAll();
    return categories;
  },
};
