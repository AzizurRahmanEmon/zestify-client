import ErrorSection from "@/components/error/ErrorSection";
import BreadcrumbSection from "@/components/breadcrumb/BreadcrumbSection";
import MainLayout from "@/components/layout/MainLayout";
import ServiceSection from "@/components/service/ServiceSection";
import TeamDetailSection from "@/components/team/TeamDetailSection";
import { TeamDataType } from "@/types";
interface Props {
  chefInfo: TeamDataType;
}
const ChefDetailPage = ({ chefInfo }: Props) => {
  return (
    <MainLayout>
      <BreadcrumbSection title={chefInfo ? "Chef Details" : "Error Page"} />
      {chefInfo ? (
        <TeamDetailSection name={chefInfo.name} img={chefInfo.imgSrc} />
      ) : (
        <ErrorSection />
      )}
      <ServiceSection />
    </MainLayout>
  );
};

export default ChefDetailPage;
