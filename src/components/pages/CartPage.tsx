import BreadcrumbSection from "@/components/breadcrumb/BreadcrumbSection";
import CartSection from "@/components/cart/CartSection";
import MainLayout from "@/components/layout/MainLayout";

const CartPage = () => {
  return (
    <MainLayout>
      <BreadcrumbSection title="Cart" />
      <CartSection />
    </MainLayout>
  );
};

export default CartPage;
