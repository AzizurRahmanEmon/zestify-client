import BreadcrumbSection from "@/components/breadcrumb/BreadcrumbSection";
import CheckoutSection from "@/components/checkout/CheckoutSection";
import MainLayout from "@/components/layout/MainLayout";

const CheckoutPage = () => {
  return (
    <MainLayout>
      <BreadcrumbSection title="Checkout" />
      <CheckoutSection />
    </MainLayout>
  );
};

export default CheckoutPage;
