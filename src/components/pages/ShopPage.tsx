import BreadcrumbSection from "@/components/breadcrumb/BreadcrumbSection";
import MainLayout from "@/components/layout/MainLayout";
import ShopSection from "@/components/shop/ShopSection";
import type { ProductDataType } from "@/types";

interface Props {
  products: ProductDataType[];
}

const ShopPage = ({ products }: Props) => {
  return (
    <MainLayout>
      <BreadcrumbSection title="Shop" />
      <ShopSection products={products} />
    </MainLayout>
  );
};

export default ShopPage;
