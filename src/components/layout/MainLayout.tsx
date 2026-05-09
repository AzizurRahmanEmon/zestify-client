"use client";
import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import HeaderSection from "@/components/header/HeaderSection";
import FooterSection from "@/components/footer/FooterSection";
import { useCustomContext } from "@/context/context";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { API_URL } from "@/lib/api";

const TENANT_ID =
  process.env.NEXT_PUBLIC_TENANT_ID ||
  process.env.NEXT_PUBLIC_TENANT_SLUG ||
  "";

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

    const provider = searchParams?.get("provider") || "stripe";
    const orderId = searchParams?.get("orderId") || "";
    const orderNumber = searchParams?.get("orderNumber") || "";
    const sessionId = searchParams?.get("session_id") || "";
    const paypalToken = searchParams?.get("token") || "";
    const key = `${provider}:${checkout}:${orderId}:${orderNumber}:${sessionId}:${paypalToken}`;
    if (!orderId && !orderNumber) return;
    if (lastHandledRef.current === key) return;
    lastHandledRef.current = key;

    const run = async () => {
      try {
        if (checkout === "cancel") {
          const cancelEndpoint =
            provider === "paypal"
              ? `${API_URL}/payments/paypal/cancel`
              : `${API_URL}/payments/stripe/cancel`;

          await fetch(cancelEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(TENANT_ID ? { "x-tenant-id": TENANT_ID } : {}),
            },
            body: JSON.stringify({ orderId, orderNumber }),
            cache: "no-store",
          }).catch(() => null);
          toast.error("Payment was cancelled.");
          return;
        }

        if (provider === "paypal") {
          if (!paypalToken) {
            throw new Error("PayPal token missing");
          }

          const res = await fetch(
            `${API_URL}/payments/paypal/verify?orderId=${encodeURIComponent(
              orderId,
            )}&orderNumber=${encodeURIComponent(orderNumber)}&token=${encodeURIComponent(paypalToken)}&checkout=${encodeURIComponent(checkout)}`,
            {
              cache: "no-store",
              headers: {
                ...(TENANT_ID ? { "x-tenant-id": TENANT_ID } : {}),
              },
            },
          );
          const json = await res.json().catch(() => ({}));
          if (!res.ok || json?.success === false) {
            throw new Error(json?.message || "Payment verification failed");
          }

          const paymentStatus = json?.data?.paymentStatus as string | undefined;
          if (paymentStatus === "paid") {
            clearCart();
            localStorage.removeItem("appliedCoupon");
            toast.success("Payment successful! Order placed.");
          } else {
            toast.error("Payment was not completed.");
          }

          return;
        }

        if (!sessionId) {
          throw new Error("Payment session missing");
        }

        const res = await fetch(
          `${API_URL}/payments/stripe/verify?orderId=${encodeURIComponent(
            orderId,
          )}&orderNumber=${encodeURIComponent(orderNumber)}&session_id=${encodeURIComponent(sessionId)}&checkout=${encodeURIComponent(checkout)}`,
          {
            cache: "no-store",
            headers: {
              ...(TENANT_ID ? { "x-tenant-id": TENANT_ID } : {}),
            },
          },
        );
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json?.success === false) {
          throw new Error(json?.message || "Payment verification failed");
        }

        const paymentStatus = json?.data?.paymentStatus as string | undefined;
        if (paymentStatus === "paid") {
          clearCart();
          localStorage.removeItem("appliedCoupon");
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
    </>
  );
};

export default MainLayout;
