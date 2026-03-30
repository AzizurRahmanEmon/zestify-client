import BreadcrumbSection from "@/components/breadcrumb/BreadcrumbSection";
import ErrorSection from "@/components/error/ErrorSection";
import MainLayout from "@/components/layout/MainLayout";

const ErrorPage = () => {
  return (
    <MainLayout>
      <BreadcrumbSection title="Error Page" />
      <ErrorSection />
    </MainLayout>
  );
};

export default ErrorPage;
