import MainLayout from "@/components/layout/MainLayout";
import BreadcrumbSection from "@/components/breadcrumb/BreadcrumbSection";
import ServiceSection2 from "@/components/service/ServiceSection2";
import ContactSection3 from "@/components/contact/ContactSection3";
import CompanySection from "@/components/company/CompanySection";
import GallerySection from "@/components/gallery/GallerySection";
import CtaSection2 from "@/components/cta/CtaSection2";
import { getHomePage } from "@/services/pages";
import { getPartners } from "@/services/partners";
import { getSettings } from "@/services/settings";
import { buildFooterProps } from "@/lib/buildFooterProps";

const ServicesPage = async () => {
  const [home, partners, settings] = await Promise.all([
    getHomePage().catch(() => null),
    getPartners({ isActive: true, limit: 50 }).catch(() => []),
    getSettings().catch(() => null),
  ]);

  return (
    <MainLayout
      header={home?.header}
      insta={home?.insta}
      footer={buildFooterProps(home?.footer, settings)}
    >
      <BreadcrumbSection title="Services" />
      <ServiceSection2 />
      <CtaSection2 />
      <GallerySection variant />
      <ContactSection3 variantTwo />
      <CompanySection paddingTop partners={partners} />
    </MainLayout>
  );
};

export default ServicesPage;
