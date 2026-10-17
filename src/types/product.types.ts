export type ProductCategory = "Sarees" | "Scarves" | "Fabrics" | "Apparel";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  story?: string;
  fabric?: string;
  motif?: string;
  border?: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  inStock: boolean;
  stockQuantity?: number; // Available inventory count (units on loom/in vault)
  image: string; // Primary / cover image
  images?: string[]; // Array of gallery image URLs
  badge?: string;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  sku?: string;
  collectionSlug?: string; // Link to master collection archive
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductInput {
  name: string;
  slug?: string;
  description: string;
  story?: string;
  fabric?: string;
  motif?: string;
  border?: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  inStock: boolean;
  stockQuantity?: number;
  image: string;
  images?: string[];
  badge?: string;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  sku?: string;
  collectionSlug?: string;
}

export type UpdateProductInput = Partial<CreateProductInput>;

export interface ProductFilterQuery {
  category?: string;
  search?: string;
  fabric?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: "newest" | "price_asc" | "price_desc" | "rating";
  page?: number;
  limit?: number;
}
