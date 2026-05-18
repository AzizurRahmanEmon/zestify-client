import {
  getProducts as libGetProducts,
  getFeaturedProducts as libGetFeatured,
  type GetProductsParams,
} from "@/lib/api";
import type { ProductDataType } from "@/types";

export async function getProducts(
  params: GetProductsParams = {},
): Promise<ProductDataType[]> {
  return libGetProducts(params);
}

export async function getFeaturedProducts(): Promise<ProductDataType[]> {
  return libGetFeatured();
}
