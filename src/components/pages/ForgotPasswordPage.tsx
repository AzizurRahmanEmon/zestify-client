import BreadcrumbSection from "@/components/breadcrumb/BreadcrumbSection";
import MainLayout from "@/components/layout/MainLayout";
import ForgotPasswordSection from "@/components/auth/ForgotPasswordSection";

const ForgotPasswordPage = () => {
  return (
    <MainLayout>
      <BreadcrumbSection title="Forgot Password" />
      <ForgotPasswordSection />
    </MainLayout>
  );
};

export default ForgotPasswordPage;
