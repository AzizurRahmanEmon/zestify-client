import UserDashboardPage from "@/components/pages/UserDashboardPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Dashboard",
  description:
    "Manage your Zestify account, orders, reservations, and profile settings.",
  robots: { index: false, follow: false },
};
export default function Home() {
  return <UserDashboardPage />;
}
