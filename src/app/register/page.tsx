import RegisterPage from "@/components/pages/RegisterPage";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Join Zestify today. Create your account to place orders, save favourites, and book tables with ease.",
  robots: { index: false, follow: false },
};
export default function Home() {
  return <RegisterPage />;
}
