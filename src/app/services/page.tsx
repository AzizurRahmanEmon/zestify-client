import ServicesPage from "@/components/pages/ServicesPage";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Discover Zestify's services — dine-in, takeaway, catering, private events, and more.",
};

export default function Home() {
  return <ServicesPage />;
}
