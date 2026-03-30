import GalleryPage from "@/components/pages/GalleryPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse Zestify's food and restaurant gallery — a visual feast of our dishes, ambiance, and culinary creations.",
};

export default function Home() {
  return <GalleryPage />;
}
