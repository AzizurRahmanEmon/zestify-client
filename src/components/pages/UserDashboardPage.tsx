import BreadcrumbSection from "@/components/breadcrumb/BreadcrumbSection";
import MainLayout from "@/components/layout/MainLayout";
import UserDashboard from "@/components/user/UserDashboard";

const UserDashboardPage = () => {
  return (
    <MainLayout>
      <BreadcrumbSection title="User Dashboard" />
      <UserDashboard />
    </MainLayout>
  );
};
export default UserDashboardPage;
