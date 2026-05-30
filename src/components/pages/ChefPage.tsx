import MainLayout from "@/components/layout/MainLayout";
import BreadcrumbSection from "@/components/breadcrumb/BreadcrumbSection";
import TeamSection from "@/components/team/TeamSection";
import TeamAboutSection from "@/components/about/TeamAboutSection";
import TeamValueSection from "@/components/team/TeamValueSection";
import CtaSection3 from "@/components/cta/CtaSection3";
import { getHomePage } from "@/services/pages";
import { getChefs } from "@/services/chefs";
import { getSettings } from "@/services/settings";
import { buildFooterProps } from "@/lib/buildFooterProps";

const ChefPage = async () => {
  const [home, chefs, settings] = await Promise.all([
    getHomePage().catch(() => null),
    getChefs({ isActive: true, limit: 50 }).catch(() => []),
    getSettings().catch(() => null),
  ]);

  return (
    <MainLayout
      header={home?.header}
      insta={home?.insta}
      footer={buildFooterProps(home?.footer, settings)}
    >
      <BreadcrumbSection title="Our Chefs" />
      <TeamAboutSection />
      <TeamSection main members={chefs} />
      <TeamValueSection />
      <CtaSection3 />
    </MainLayout>
  );
};

export default ChefPage;
