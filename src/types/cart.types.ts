import { Product } from "./product.types";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedLook?: number; // Saree colourway / look number (e.g. Look 1, Look 2)
  selectedColorName?: string; // Optional shade name
}

export interface CartSummary {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  discount?: number;
  shipping?: number;
  tax: number;
  total: number;
  couponCode?: string;
}
