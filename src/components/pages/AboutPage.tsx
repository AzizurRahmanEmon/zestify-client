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

const AboutPage = async () => {
  const [home, chefs, partners] = await Promise.all([
    getHomePage().catch(() => null),
    getChefs({ isActive: true, limit: 6 }).catch(() => []),
    getPartners({ isActive: true, limit: 50 }).catch(() => []),
  ]);

  return (
    <MainLayout
      header={(home as any)?.header}
      insta={(home as any)?.insta}
      footer={(home as any)?.footer}
    >
      <BreadcrumbSection title="About Us" />
      <AboutSection variant />
      <AboutServiceSection />
      <VideoSection bgImg="/assets/img/about-video-bg.png" />
      <TeamSection members={chefs as any} />
      <CompanySection
        partners={(partners as Partner[]).map((p) => ({
          icon: p.icon,
          width: p.width,
          height: p.height,
        }))}
      />
    </MainLayout>
  );
};

export default AboutPage;
