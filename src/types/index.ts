/**
 * Common Types & Contracts
 * Shared across frontend and backend
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}

export type ProductCategory = "Sarees" | "Scarves" | "Fabrics" | "Apparel";

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export * from "./product.types";
export * from "./cart.types";
