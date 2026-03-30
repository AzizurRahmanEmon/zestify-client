import MainLayout from "@/components/layout/MainLayout";
import BreadcrumbSection from "@/components/breadcrumb/BreadcrumbSection";
import TeamSection from "@/components/team/TeamSection";
import TeamAboutSection from "@/components/about/TeamAboutSection";
import TeamValueSection from "@/components/team/TeamValueSection";
import CtaSection3 from "@/components/cta/CtaSection3";
import { getHomePage } from "@/services/pages";
import { getChefs } from "@/services/chefs";

const ChefPage = async () => {
  const [home, chefs] = await Promise.all([
    getHomePage().catch(() => null),
    getChefs({ isActive: true, limit: 50 }).catch(() => []),
  ]);

  return (
    <MainLayout
      header={(home as any)?.header}
      insta={(home as any)?.insta}
      footer={(home as any)?.footer}
    >
      <BreadcrumbSection title="Our Chefs" />
      <TeamAboutSection />
      <TeamSection main members={chefs as any} />
      <TeamValueSection />
      <CtaSection3 />
    </MainLayout>
  );
};

export default ChefPage;
