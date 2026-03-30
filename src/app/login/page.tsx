import LoginPage from "@/components/pages/LoginPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to your Zestify account to manage orders and reservations.",
  robots: { index: false, follow: false },
};

export default function Home() {
  return <LoginPage />;
}
