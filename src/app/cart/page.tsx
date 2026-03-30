import CartPage from "@/components/pages/CartPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Cart",
  description:
    "Review the items in your Zestify cart and proceed to checkout for a seamless food ordering experience.",
  robots: { index: false, follow: false },
};

export default function Home() {
  return <CartPage />;
}
