import MainLayout from "@/components/layout/MainLayout";
import BreadcrumbSection from "@/components/breadcrumb/BreadcrumbSection";
import GallerySection from "@/components/gallery/GallerySection";

const GalleryPage = () => {
  return (
    <MainLayout>
      <BreadcrumbSection title="Gallery" />
      <GallerySection />
    </MainLayout>
  );
};

export default GalleryPage;
