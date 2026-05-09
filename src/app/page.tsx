import HomePage from "@/components/pages/HomePage";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to Zestify — a modern dining experience with fresh ingredients, signature dishes, and warm hospitality. Order online or reserve your table today.",
};
export default function Home() {
  return <HomePage />;
}
