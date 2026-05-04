import type {
  Order,
  OrderItemsDto,
  ShippingInfo,
} from "@/models/order.models.js";
import { cartService } from "./carts.service.js";
import { BadRequestError } from "@/shared/errors.js";
import { usersRepository } from "@/repositories/users.repository.js";
import { orderRepository } from "@/repositories/order.repository.js";
import { cartsRepository } from "@/repositories/carts.repository.js";

export const orderServices = {
  async createOrder({
    userId,
    cartId,
    email,
    shippingInfo,
    status = "pending",
  }: {
    userId: number | null;
    cartId: number;
    email: string;
    shippingInfo: ShippingInfo;
    status?: string;
  }): Promise<Order> {
    // Validaciones iniciales
    if (!email && !userId) {
      throw new BadRequestError(
        "Se requiere un userId o un email para registrar una orden"
      );
    }
    let finalEmail = email;
    // Verificar si el usuario existe si se proporciona userId
    if (!email && userId) {
      const user = await usersRepository.findById(userId);
      if (!user) {
        throw new BadRequestError(`Usuario con Id ${userId} no encontrado`);
      }
      finalEmail = user.email;
    }

    // Obtener el carrito del usuario
    const cart = await cartService.getOrCreateCart({ cartId });
    if (!cart) {
      throw new BadRequestError(
        "No se pudo obtener el carrito para crear la orden"
      );
    }
    // Validar que el carrito no este vacio
    if (cart.items.length === 0) {
      throw new BadRequestError(
        "El carrito esta vacio. No se puede crear una orden"
      );
    }

    // Mapear los items del carrito a OrderItemsDto
    const items: OrderItemsDto[] = cart.items.map((item) => ({
      productId: item.productId,
      title: item.name,
      imgSrc: item.imageUrl,
      quantity: item.quantity,
      price: item.unitPrice,
      lineTotal: item.lineTotal,
    }));
    // Calcular el total de la orden
    const orderTotal = items.reduce((acc, item) => acc + item.lineTotal, 0);

    // Crear la orden en la base de datos
    const order = await orderRepository.createOrderWithItems(
      { userId, email: finalEmail, shippingInfo, status, total: orderTotal },
      items
    );
    await cartsRepository.clearCart(userId!);

    return order;
  },

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return orderRepository.getOrdersByUserId(userId);
  },

  async getOrderById(orderId: number): Promise<Order | null> {
    const order = await orderRepository.getOrder(orderId);
    return order;
  },

  async getOrderItemsByOrderId(orderId: number): Promise<OrderItemsDto[]> {
    const items = orderRepository.getOrderItemsByOrderId(orderId);
    return items;
  },
};
