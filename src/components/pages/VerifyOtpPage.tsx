import VerifyOtpSection from "@/components/auth/VerifyOtpSection";
import BreadcrumbSection from "@/components/breadcrumb/BreadcrumbSection";
import MainLayout from "@/components/layout/MainLayout";

const VerifyOtpPage = () => {
  return (
    <MainLayout>
      <BreadcrumbSection title="Verify OTP" />
      <VerifyOtpSection />
    </MainLayout>
  );
};

export default VerifyOtpPage;
