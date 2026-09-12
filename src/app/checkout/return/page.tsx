import CheckoutReturnScreen from "@/components/checkout/CheckoutReturnScreen";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Processing payment",
  robots: { index: false, follow: false },
};

export default function CheckoutReturnPage() {
  return <CheckoutReturnScreen />;
}
