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
      <BreadcrumbSection title={chefInfo ? "Chef Details" : "Error Page"} />
      {chefInfo ? (
        <TeamDetailSection
          name={chefInfo.name}
          img={chefInfo.imgSrc}
          position={chefInfo.position || chefInfo.title}
          experience={chefInfo.experience}
          phone={chefInfo.phone}
          email={chefInfo.email}
          address={chefInfo.address}
          bio={chefInfo.bio}
          qualifications={chefInfo.qualifications}
          stats={chefInfo.stats}
          socialLinks={chefInfo.socialLinks}
          certificates={chefInfo.certificates}
        />
      ) : (
        <ErrorSection />
      )}
      <ServiceSection />
    </MainLayout>
  );
};

export default ChefDetailPage;
