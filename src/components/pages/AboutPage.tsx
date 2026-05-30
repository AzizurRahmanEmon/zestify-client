import MainLayout from "@/components/layout/MainLayout";
import BreadcrumbSection from "@/components/breadcrumb/BreadcrumbSection";
import VideoSection from "@/components/video/VideoSection";
import TeamSection from "@/components/team/TeamSection";
import CompanySection from "@/components/company/CompanySection";
import AboutServiceSection from "@/components/service/AboutServiceSection";
import AboutSection from "@/components/about/AboutSection";
import { getHomePage } from "@/services/pages";
import { getChefs } from "@/services/chefs";
import { getPartners, type Partner } from "@/services/partners";
import { getSettings } from "@/services/settings";
import { buildFooterProps } from "@/lib/buildFooterProps";

const AboutPage = async () => {
  const [home, chefs, partners, settings] = await Promise.all([
    getHomePage().catch(() => null),
    getChefs({ isActive: true, limit: 6 }).catch(() => []),
    getPartners({ isActive: true, limit: 50 }).catch(() => []),
    getSettings().catch(() => null),
  ]);

  return (
    <MainLayout
      header={home?.header}
      insta={home?.insta}
      footer={buildFooterProps(home?.footer, settings)}
    >
      <BreadcrumbSection title="About Us" />
      <AboutSection variant />
      <AboutServiceSection />
      <VideoSection bgImg="/assets/img/about-video.png" />
      <TeamSection members={chefs} />
      <CompanySection
        partners={partners.map((p: Partner) => ({
          icon: p.icon,
          width: p.width,
          height: p.height,
        }))}
      />
    </MainLayout>
  );
};

export default AboutPage;
