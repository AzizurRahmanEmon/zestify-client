import ErrorPage from "@/components/pages/ErrorPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you're looking for doesn't exist on Zestify.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <ErrorPage />;
}
