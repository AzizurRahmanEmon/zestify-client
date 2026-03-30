import MainLayout from "@/components/layout/MainLayout";
import BreadcrumbSection from "@/components/breadcrumb/BreadcrumbSection";
import ProductDetailSection from "@/components/shop/ProductDetailSection";
import ErrorSection from "@/components/error/ErrorSection";
import { ProductDataType } from "@/types";
import type { NutritionInfo, ProductReviewsResponse } from "@/lib/api";
interface Props {
  productInfo: ProductDataType | null;
  nutrition?: NutritionInfo | null;
  initialReviews?: ProductReviewsResponse;
  relatedProducts?: ProductDataType[];
}

const ProductDetailPage = ({
  productInfo,
  nutrition = null,
  initialReviews = { averageRating: 0, reviewsCount: 0, items: [] },
  relatedProducts = [],
}: Props) => {
  return (
    <MainLayout>
      <BreadcrumbSection
        title={productInfo ? "Product Details" : "Error Page"}
      />
      {productInfo ? (
        <ProductDetailSection
          product={productInfo}
          nutrition={nutrition}
          initialReviews={initialReviews}
          relatedProducts={relatedProducts}
        />
      ) : (
        <ErrorSection />
      )}
    </MainLayout>
  );
};

export default ProductDetailPage;
