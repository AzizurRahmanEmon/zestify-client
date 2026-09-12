"use client";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import HeaderSection from "@/components/header/HeaderSection";
import FooterSection from "@/components/footer/FooterSection";
import { useCustomContext } from "@/context/context";

const InstagramSection = dynamic(
  () => import("@/components/social/InstagramSection"),
  { ssr: false },
);
const CartModal = dynamic(() => import("@/components/modal/CartModal"), {
  ssr: false,
});
const WishlistModal = dynamic(
  () => import("@/components/modal/WishlistModal"),
  { ssr: false },
);
const VideoModal = dynamic(() => import("@/components/modal/VideoModal"), {
  ssr: false,
});
const PreviewModal = dynamic(() => import("@/components/modal/PreviewModal"), {
  ssr: false,
});
const MobileMenuModal = dynamic(
  () => import("@/components/modal/MobileMenuModal"),
  { ssr: false },
);
const ZestyFloatingChat = dynamic(
  () => import("@/components/chat/ZestyFloatingChat"),
  { ssr: false },
);

interface HeaderProps {
  variant?: string;
  logo?: string;
  topbarText?: string;
  email?: string;
  location?: string;
}
interface InstaProps {
  variant?: string;
  images?: string[];
  link?: string;
}
interface FooterProps {
  variant?: string;
  logo?: string;
  shortDesc?: string;
  phone?: string;
  openHours?: string;
  email?: string;
  socials?: { facebook?: string; twitter?: string; instagram?: string };
  navs?: Array<{ text?: string; href?: string }>;
  services?: Array<{ text?: string; href?: string }>;
  location?: string;
  companyName?: string;
  copyright?: string;
}
interface Props {
  children: React.ReactNode;
  header?: HeaderProps | null;
  insta?: InstaProps | null;
  footer?: FooterProps | null;
}

const MainLayout = ({ children, header, insta, footer }: Props) => {
  const {
    isMobileMenuOpen,
    toggleMobileMenu,
    isCartModalOpen,
    closeCartModal,
    isWishlistModalOpen,
    closeWishlistModal,
    isPreviewModalOpen,
    closePreviewModal,
    isVideoModalOpen,
    closeVideoModal,
  } = useCustomContext();

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-999 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-black focus:shadow-lg"
      >
        Skip to main content
      </a>

      <HeaderSection
        logo={header?.logo}
        topbarText={header?.topbarText}
        email={header?.email}
        location={header?.location}
      />

      <main
        id="main-content"
        className="bg-white lg:pt-37.5 sm:pt-28.75 pt-23.75 relative"
      >
        {children}

        {/* Instagram Section */}
        <InstagramSection images={insta?.images} link={insta?.link} />

        {/* Footer Section */}
        <FooterSection
          logo={footer?.logo}
          shortDesc={footer?.shortDesc}
          phone={footer?.phone}
          openHours={footer?.openHours}
          email={footer?.email}
          socials={footer?.socials}
          navs={footer?.navs}
          services={footer?.services}
          location={footer?.location}
          companyName={footer?.companyName}
          copyright={footer?.copyright}
        />
      </main>

      {/* Mobile Menu Modal */}
      {isMobileMenuOpen ? (
        <MobileMenuModal
          isOpen={isMobileMenuOpen}
          toggleMenu={toggleMobileMenu}
        />
      ) : null}

      {/* Cart Modal */}
      {isCartModalOpen ? (
        <CartModal
          isCartModalOpen={isCartModalOpen}
          closeCartModal={closeCartModal}
        />
      ) : null}

      {/* Wishlist Modal */}
      {isWishlistModalOpen ? (
        <WishlistModal
          isWishlistModalOpen={isWishlistModalOpen}
          closeWishlistModal={closeWishlistModal}
        />
      ) : null}

      {/* Video Modal */}
      {isVideoModalOpen ? (
        <VideoModal
          isVideoModalOpen={isVideoModalOpen}
          closeVideoModal={closeVideoModal}
        />
      ) : null}

      {/* Preview Modal */}
      {isPreviewModalOpen ? (
        <PreviewModal
          isPreviewModalOpen={isPreviewModalOpen}
          closePreviewModal={closePreviewModal}
        />
      ) : null}

      <Suspense fallback={null}>
        <ZestyFloatingChat />
      </Suspense>
    </>
  );
};

export default MainLayout;
