import MainLayout from "@/components/layout/MainLayout";
import WishlistSection from "@/components/wishlist/WishlistSection";
import BreadcrumbSection from "@/components/breadcrumb/BreadcrumbSection";

const WishlistPage = () => {
  return (
    <MainLayout>
      <BreadcrumbSection title="Wishlist" />
      <WishlistSection />
    </MainLayout>
  );
};

export default WishlistPage;
