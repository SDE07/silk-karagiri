import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/services/product.service";
import { ApiResponse } from "@/types";
import { Product } from "@/types/product.types";

/**
 * GET /api/products
 * Query Params: ?category=Sarees&search=gold
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;

    const products = await productService.getAllProducts(category, search);

    const response: ApiResponse<Product[]> = {
      success: true,
      data: products,
      count: products.length,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: errMessage,
      },
      { status: 500 }
    );
  }
}
