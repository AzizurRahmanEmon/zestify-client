import {
  getProducts as libGetProducts,
  getFeaturedProducts as libGetFeatured,
} from "@/lib/api";
import type { ProductDataType } from "@/types";

export async function getProducts(
  params: {
    isActive?: boolean;
    limit?: number;
    category?: string;
    isFeatured?: boolean;
  } = {},
): Promise<ProductDataType[]> {
  return libGetProducts(params as any);
}

export async function getFeaturedProducts(): Promise<ProductDataType[]> {
  return libGetFeatured();
}
