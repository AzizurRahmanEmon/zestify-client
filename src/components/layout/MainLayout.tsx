"use client";
import React, { useEffect, useRef } from "react";
import HeaderSection from "@/components/header/HeaderSection";
import InstagramSection from "@/components/social/InstagramSection";
import FooterSection from "@/components/footer/FooterSection";
import CartModal from "@/components/modal/CartModal";
import WishlistModal from "@/components/modal/WishlistModal";
import VideoModal from "@/components/modal/VideoModal";
import PreviewModal from "@/components/modal/PreviewModal";
import MobileMenuModal from "@/components/modal/MobileMenuModal";
import { useCustomContext } from "@/context/context";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { API_URL } from "@/lib/api";

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
    clearCart,
  } = useCustomContext();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const lastHandledRef = useRef<string>("");

  useEffect(() => {
    if (pathname !== "/") return;
    const checkout = searchParams?.get("checkout");
    if (checkout !== "success" && checkout !== "cancel") return;

    const orderId = searchParams?.get("orderId") || "";
    const sessionId = searchParams?.get("session_id") || "";
    const key = `${checkout}:${orderId}:${sessionId}`;
    if (!orderId) return;
    if (lastHandledRef.current === key) return;
    lastHandledRef.current = key;

    const run = async () => {
      try {
        if (checkout === "cancel" && !sessionId) {
          await fetch(`${API_URL}/payments/stripe/cancel`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId }),
            cache: "no-store",
          }).catch(() => null);
          toast.error("Payment was cancelled.");
          return;
        }

        if (!sessionId) {
          throw new Error("Payment session missing");
        }

        const res = await fetch(
          `${API_URL}/payments/stripe/verify?orderId=${encodeURIComponent(
            orderId,
          )}&session_id=${encodeURIComponent(sessionId)}&checkout=${encodeURIComponent(checkout)}`,
          { cache: "no-store" },
        );
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json?.success === false) {
          throw new Error(json?.message || "Payment verification failed");
        }

        const paymentStatus = json?.data?.paymentStatus as string | undefined;
        if (paymentStatus === "paid") {
          clearCart();
          toast.success("Payment successful! Order placed.");
        } else {
          toast.error("Payment was not completed.");
        }
      } catch (err: unknown) {
        toast.error(
          err instanceof Error ? err.message : "Payment verification failed",
        );
      } finally {
        router.replace("/", { scroll: false });
      }
    };

    run();
  }, [pathname, searchParams, router, clearCart]);

  return (
    <main className="bg-white lg:pt-37.5 sm:pt-28.75 pt-23.75 relative">
      {/* Header Section */}
      <HeaderSection
        logo={header?.logo}
        topbarText={header?.topbarText}
        email={header?.email}
        location={header?.location}
      />

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

      {/* Mobile Menu Modal */}
      <MobileMenuModal
        isOpen={isMobileMenuOpen}
        toggleMenu={toggleMobileMenu}
      />

      {/* Cart Modal */}
      <CartModal
        isCartModalOpen={isCartModalOpen}
        closeCartModal={closeCartModal}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isWishlistModalOpen={isWishlistModalOpen}
        closeWishlistModal={closeWishlistModal}
      />

      {/* Video Modal */}
      <VideoModal
        isVideoModalOpen={isVideoModalOpen}
        closeVideoModal={closeVideoModal}
      />

      {/* Preview Modal */}
      <PreviewModal
        isPreviewModalOpen={isPreviewModalOpen}
        closePreviewModal={closePreviewModal}
      />
    </main>
  );
};

export default MainLayout;
