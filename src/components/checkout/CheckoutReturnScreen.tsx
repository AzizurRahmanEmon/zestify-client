"use client";

import { Suspense } from "react";
import { useCheckoutReturn } from "@/hooks/useCheckoutReturn";

const CheckoutReturnContent = () => {
  useCheckoutReturn();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-4">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"
        aria-hidden
      />
      <p className="text-center text-gray-600">Processing your payment…</p>
    </div>
  );
};

const CheckoutReturnScreen = () => (
  <Suspense
    fallback={
      <div className="flex min-h-screen items-center justify-center bg-white text-gray-600">
        Loading…
      </div>
    }
  >
    <CheckoutReturnContent />
  </Suspense>
);

export default CheckoutReturnScreen;
