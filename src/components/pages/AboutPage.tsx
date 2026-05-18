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
    <MainLayout header={home?.header} insta={home?.insta} footer={home?.footer}>
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
