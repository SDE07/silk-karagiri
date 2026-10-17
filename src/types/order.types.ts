export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentMethod = "upi" | "cod" | "card" | "netbanking";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  sku?: string;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "SK-2026-0001"
  isGuest: boolean; // true for guest orders (no login required)
  customerId?: string; // Optional if registered customer
  customerName: string; // Contact person
  customerPhone: string; // Primary phone number (critical for Indian delivery & SMS/WhatsApp)
  customerEmail?: string; // Optional email for digital invoice
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod | string;
  paymentStatus: PaymentStatus;
  shippingAddress: ShippingAddress;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  isGuest?: boolean; // defaults to true
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  couponCode?: string;
  paymentMethod: PaymentMethod | string;
  notes?: string;
}

export interface OrderFilterParams {
  status?: OrderStatus | "all";
  paymentStatus?: PaymentStatus | "all";
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
