import { ProductCategory } from "@/types";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  inStock: boolean;
  image: string;
  badge?: string;
  rating?: number;
}
