import WishlistPage from "@/components/pages/WishlistPage";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "My Wishlist",
  description:
    "View and manage your saved Zestify products and favourite dishes.",
  robots: { index: false, follow: false },
};

export default function Home() {
  return <WishlistPage />;
}
