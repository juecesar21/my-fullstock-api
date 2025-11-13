export interface Product {
  id: number;
  title: string;
  imgSrc: string;
  price: number;
  description: string;
  categoryId: number;
  features: Record<string, unknown> | null; // JSONB field
  createdAt: string;
  updatedAt: string;
}
