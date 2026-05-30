import MainLayout from "@/components/layout/MainLayout";
import BreadcrumbSection from "@/components/breadcrumb/BreadcrumbSection";
import ContactSection from "@/components/contact/ContactSection";
import VideoSection from "@/components/video/VideoSection";
import { getHomePage } from "@/services/pages";
import { getSettings } from "@/services/settings";
import { buildFooterProps } from "@/lib/buildFooterProps";

const ContactPage = async () => {
  const [home, settings] = await Promise.all([
    getHomePage().catch(() => null),
    getSettings().catch(() => null),
  ]);
  return (
    <MainLayout
      header={home?.header}
      insta={home?.insta}
      footer={buildFooterProps(home?.footer, settings)}
    >
      <BreadcrumbSection title="Contact" />
      <ContactSection settings={settings ?? undefined} />
      <VideoSection
        bgImg="/assets/img/contact-video-bg.png"
        videoUrl={settings?.promoVideoUrl}
      />
    </MainLayout>
  );
};

export default ContactPage;
