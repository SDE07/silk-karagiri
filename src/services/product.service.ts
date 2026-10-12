import { Product } from "@/types/product.types";
import { initialProducts } from "@/data/products.data";

export class ProductService {
  private products: Product[] = [...initialProducts];

  async getAllProducts(category?: string, search?: string): Promise<Product[]> {
    let result = [...this.products];

    if (category && category !== "All") {
      result = result.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search && search.trim() !== "") {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    return result;
  }

  async getProductById(id: string): Promise<Product | null> {
    const item = this.products.find((p) => p.id === id);
    return item || null;
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const item = this.products.find((p) => p.slug === slug);
    return item || null;
  }
}

export const productService = new ProductService();
