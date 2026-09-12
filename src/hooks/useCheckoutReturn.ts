"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { useCustomContext } from "@/context/context";
import { API_URL, customerFetchInit } from "@/lib/api";
import { formatUserError } from "@/lib/userError";

export function useCheckoutReturn() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCustomContext();
  const lastHandledRef = useRef("");

  useEffect(() => {
    const checkout = searchParams?.get("checkout");
    if (checkout !== "success" && checkout !== "cancel") {
      router.replace("/");
      return;
    }

    const provider = searchParams?.get("provider") || "stripe";
    const orderId = searchParams?.get("orderId") || "";
    const orderNumber = searchParams?.get("orderNumber") || "";
    const sessionId = searchParams?.get("session_id") || "";
    const paypalToken = searchParams?.get("token") || "";
    const key = `${provider}:${checkout}:${orderId}:${orderNumber}:${sessionId}:${paypalToken}`;

    if (!orderId && !orderNumber) {
      router.replace("/");
      return;
    }
    if (lastHandledRef.current === key) {
      return;
    }
    lastHandledRef.current = key;

    const run = async () => {
      try {
        if (checkout === "cancel") {
          const cancelEndpoint =
            provider === "paypal"
              ? `${API_URL}/payments/paypal/cancel`
              : `${API_URL}/payments/stripe/cancel`;

          await fetch(
            cancelEndpoint,
            customerFetchInit({
              method: "POST",
              body: JSON.stringify({ orderId, orderNumber }),
              cache: "no-store",
            }),
          ).catch(() => null);
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
            customerFetchInit({ cache: "no-store" }),
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
          customerFetchInit({ cache: "no-store" }),
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
        toast.error(formatUserError(err, "Payment verification failed"));
      } finally {
        router.replace("/", { scroll: false });
      }
    };

    void run();
  }, [searchParams, router, clearCart]);
}
