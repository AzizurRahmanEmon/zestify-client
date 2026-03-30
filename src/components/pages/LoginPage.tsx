import LoginSection from "@/components/auth/LoginSection";
import BreadcrumbSection from "@/components/breadcrumb/BreadcrumbSection";
import MainLayout from "@/components/layout/MainLayout";

const LoginPage = () => {
  return (
    <MainLayout>
      <BreadcrumbSection title="Login" />
      <LoginSection />
    </MainLayout>
  );
};

export default LoginPage;
