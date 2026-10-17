export type CouponType = "percentage" | "fixed" | "free_shipping";

export interface Coupon {
  id: string;
  code: string; // e.g. "SILK20"
  type: CouponType;
  value: number; // e.g. 20 for 20% or 500 for ₹500 off
  minOrderValue?: number;
  maxDiscountAmount?: number; // Cap for percentage discount
  usageLimit?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCouponInput {
  code: string;
  type: CouponType;
  value: number;
  minOrderValue?: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  expiresAt?: string;
  isActive?: boolean;
}

export type UpdateCouponInput = Partial<CreateCouponInput>;

export interface ValidateCouponInput {
  code: string;
  cartSubtotal: number;
}

export interface ValidateCouponResult {
  valid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  message?: string;
}
