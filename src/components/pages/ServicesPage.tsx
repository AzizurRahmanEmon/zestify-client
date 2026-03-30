import MainLayout from "@/components/layout/MainLayout";
import BreadcrumbSection from "@/components/breadcrumb/BreadcrumbSection";
import ServiceSection2 from "@/components/service/ServiceSection2";
import ContactSection3 from "@/components/contact/ContactSection3";
import CompanySection from "@/components/company/CompanySection";
import GallerySection from "@/components/gallery/GallerySection";
import CtaSection2 from "@/components/cta/CtaSection2";
import { getHomePage } from "@/services/pages";
import { getPartners, type Partner } from "@/services/partners";

const ServicesPage = async () => {
  const [home, partners] = await Promise.all([
    getHomePage().catch(() => null),
    getPartners({ isActive: true, limit: 50 }).catch(() => []),
  ]);

  return (
    <MainLayout
      header={(home as any)?.header}
      insta={(home as any)?.insta}
      footer={(home as any)?.footer}
    >
      <BreadcrumbSection title="Services" />
      <ServiceSection2 />
      <CtaSection2 />
      <GallerySection variant />
      <ContactSection3 variantTwo />
      <CompanySection
        paddingTop
        partners={(partners as Partner[]).map((p) => ({
          icon: p.icon,
          width: p.width,
          height: p.height,
        }))}
      />
    </MainLayout>
  );
};

export default ServicesPage;
