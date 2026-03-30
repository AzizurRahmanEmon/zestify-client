import CheckoutPage from "@/components/pages/CheckoutPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Zestify order securely and quickly.",
  robots: { index: false, follow: false },
};

export default function Home() {
  return <CheckoutPage />;
}
