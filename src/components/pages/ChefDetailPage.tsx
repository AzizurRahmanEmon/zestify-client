import ErrorSection from "@/components/error/ErrorSection";
import BreadcrumbSection from "@/components/breadcrumb/BreadcrumbSection";
import MainLayout from "@/components/layout/MainLayout";
import ServiceSection from "@/components/service/ServiceSection";
import TeamDetailSection from "@/components/team/TeamDetailSection";
import type { Chef } from "@/services/chefs";
interface Props {
  chefInfo: Chef | null;
}
const ChefDetailPage = ({ chefInfo }: Props) => {
  return (
    <MainLayout>
      <BreadcrumbSection
        title={chefInfo ? "Chef Details" : "Error Page"}
        items={
          chefInfo
            ? [
                { label: "Home", href: "/", icon: "fa-solid fa-house" },
                { label: "Our Team", href: "/chef" },
                { label: "Chef Details", icon: "fa-solid fa-user-chef" },
              ]
            : undefined
        }
      />
      {chefInfo ? (
   <TeamDetailSection chef={chefInfo} />
      ) : (
        <ErrorSection />
      )}
      <ServiceSection />
    </MainLayout>
  );
};

export default ChefDetailPage;
