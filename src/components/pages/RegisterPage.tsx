import MainLayout from "@/components/layout/MainLayout";
import BreadcrumbSection from "@/components/breadcrumb/BreadcrumbSection";
import RegisterSection from "@/components/auth/RegisterSection";

const RegisterPage = () => {
  return (
    <MainLayout>
      <BreadcrumbSection title="Register" />
      <RegisterSection />
    </MainLayout>
  );
};

export default RegisterPage;
