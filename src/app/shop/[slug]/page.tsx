import ProductDetailPage from "@/components/pages/ProductDetailPage";
import type { Metadata } from "next";
import {
  getProductBySlug,
  getProductNutrition,
  getProductReviews,
  getRelatedProducts,
} from "@/lib/api";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return {
    title: product?.name ?? "Product",
    description:
      product?.description ?? "Explore this gourmet product from Zestify.",
    openGraph: {
      title: product?.name,
      description: product?.description,
      images: product?.image ? [{ url: product.image as string }] : [],
    },
  };
}
export default async function Home({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [productInfo, nutrition, reviews, related] = await Promise.all([
    getProductBySlug(slug),
    getProductNutrition(slug).catch(() => null),
    getProductReviews(slug, { page: 1, limit: 20 }).catch(() => ({
      averageRating: 0,
      reviewsCount: 0,
      items: [],
    })),
    getRelatedProducts(slug, 4).catch(() => []),
  ]);

  return (
    <ProductDetailPage
      productInfo={productInfo}
      nutrition={nutrition}
      initialReviews={reviews}
      relatedProducts={related}
    />
  );
}
