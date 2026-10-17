export type AdminRole = "super_admin" | "admin" | "editor";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  createdAt?: string;
  lastLoginAt?: string;
}

/**
 * Server-only model containing hashed credentials.
 * NEVER return this to the client/browser.
 */
export interface AdminUserRecord extends AdminUser {
  passwordHash: string;
}

export interface AdminLoginInput {
  email: string;
  password: string;
}

export interface AdminAuthResponse {
  user: AdminUser;
  token?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number; // percentage change vs previous period (e.g. +12)
  totalOrders: number;
  ordersChange: number; // percentage change vs previous period
  totalProducts: number;
  lowStockCount: number;
  totalCustomers?: number;
  customersChange?: number;
}

export interface SalesAnalyticsPoint {
  date: string; // "YYYY-MM-DD" or "DD MMM"
  revenue: number;
  ordersCount: number;
}

export interface RecentActivity {
  id: string;
  type: "order_created" | "order_shipped" | "low_stock" | "coupon_used" | "product_updated";
  title: string;
  description: string;
  timestamp: string;
}
