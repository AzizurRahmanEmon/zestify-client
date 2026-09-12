import { Suspense } from "react";
import BreadcrumbSection from "@/components/breadcrumb/BreadcrumbSection";
import ZestyChatSection from "@/components/chat/ZestyChatSection";
import MainLayout from "@/components/layout/MainLayout";
import { buildFooterProps } from "@/lib/buildFooterProps";
import { getHomePage } from "@/services/pages";
import { getSettings } from "@/services/settings";

const ZestyChatPage = async () => {
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
      <BreadcrumbSection title="Chat with Zesty" />
      <Suspense
        fallback={
          <section className="py-16 lg:py-24">
            <div className="ar-container max-w-3xl text-center text-gray-500">
              Loading chat…
            </div>
          </section>
        }
      >
        <ZestyChatSection />
      </Suspense>
    </MainLayout>
  );
};

export default ZestyChatPage;
