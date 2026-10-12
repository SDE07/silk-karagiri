import { CartItem, CartSummary } from "@/types/cart.types";

export class CartService {
  calculateSummary(items: CartItem[]): CartSummary {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const tax = Math.round(subtotal * 0.05); // 5% GST on silk textiles
    const total = subtotal + tax;

    return {
      items,
      totalQuantity,
      subtotal,
      tax,
      total,
    };
  }
}

export const cartService = new CartService();
