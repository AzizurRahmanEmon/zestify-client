import ShopPage from "@/components/pages/ShopPage";
import { Metadata } from "next";
import { getProducts } from "@/lib/api";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Shop Zestify's curated selection of gourmet food products, sauces, spices, and ingredients delivered to your door.",
};
export default async function Home() {
  // Fetch a reasonable number; client-side filtering/pagination uses this set
  const products = await getProducts({ limit: 60, isActive: true });
  return <ShopPage products={products} />;
}
