import BreadcrumbSection from "@/components/breadcrumb/BreadcrumbSection";
import ContactSection2 from "@/components/contact/ContactSection2";
import MainLayout from "@/components/layout/MainLayout";
import ReservationSection2 from "@/components/reservation/ReservationSection2";
import { getSettings } from "@/services/settings";

const ReservationPage = async () => {
  const [settings] = await Promise.all([getSettings().catch(() => ({}))]);
  return (
    <MainLayout>
      <BreadcrumbSection title="Reservation" />
      <ReservationSection2 />
      <ContactSection2 settings={settings as any} />
    </MainLayout>
  );
};

export default ReservationPage;
