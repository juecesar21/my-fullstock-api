export interface ShippingInfo {
  firstName: string;
  lastName: string;
  company?: string | undefined;
  address: string;
  city: string;
  country: string;
  state: string;
  postalCode: string;
  phone: string;
}
export interface Order {
  id: number;
  userId: number;
  email: string;
  shippingInfo: ShippingInfo;
  status: string | null;
  total: number;
  createdAt: string;
  updatedAt: string;
}
export interface OrderDto {
  userId: number | null;
  email: string;
  shippingInfo: ShippingInfo;
  status: string | null;
  total: number;
  // createdAt: string;
  // updatedAt: string;
}
export interface OrderItems {
  id: number;
  orderId: number;
  productId: number;
  title: string;
  imgSrc: string;
  quantity: number;
  price: number;
  lineTotal: number;
  createdAt: string;
  updatedAt: string;
}
export interface OrderItemsDto {
  productId: number;
  title: string;
  imgSrc: string | null;
  quantity: number;
  price: number;
  lineTotal: number;
}
