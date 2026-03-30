import AboutPage from "@/components/pages/AboutPage";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Zestify's story, our culinary philosophy, and the passionate team behind every dish we serve.",
};

export default function Home() {
  return <AboutPage />;
}
