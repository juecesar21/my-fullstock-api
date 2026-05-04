export interface Cart {
  id: number;
  userId: number | null;
  createdAt: string;
  updatedAt: string;
}
export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  createAt: string;
  updateAt: string;
}
export interface HydratedCartItem {
  productId: number;
  name: string;
  imageUrl: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface CartDto {
  id: number;
  items: HydratedCartItem[];
  totals: {
    itemCount: number;
    grandTotal: number;
  };
  createdAt: string;
  updatedAt: string;
}
