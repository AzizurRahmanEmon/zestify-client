import MenuPage from "@/components/pages/MenuPage";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Our Menu",
  description:
    "Explore Zestify's full menu — from starters and mains to desserts and drinks. Fresh ingredients, bold flavours.",
};

export default function Home() {
  return <MenuPage />;
}
