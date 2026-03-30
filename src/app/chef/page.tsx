import ChefPage from "@/components/pages/ChefPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Chefs",
  description:
    "Meet the talented culinary team at Zestify. Our chefs bring passion, creativity, and expertise to every dish.",
};
export default function Home() {
  return <ChefPage />;
}
