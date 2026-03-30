import MainLayout from "@/components/layout/MainLayout";
import BreadcrumbSection from "@/components/breadcrumb/BreadcrumbSection";
import ContactSection from "@/components/contact/ContactSection";
import VideoSection from "@/components/video/VideoSection";
import { getHomePage } from "@/services/pages";
import { getSettings } from "@/services/settings";

const ContactPage = async () => {
  const [home, settings] = await Promise.all([
    getHomePage().catch(() => null),
    getSettings().catch(() => ({})),
  ]);
  return (
    <MainLayout
      header={(home as any)?.header}
      insta={(home as any)?.insta}
      footer={(home as any)?.footer}
    >
      <BreadcrumbSection title="Contact" />
      <ContactSection settings={settings as any} />
      <VideoSection
        bgImg="/assets/img/contact-video-bg.png"
        videoUrl={(settings as any)?.promoVideoUrl}
      />
    </MainLayout>
  );
};

export default ContactPage;
