import ReservationPage from "@/components/pages/ReservationPage";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Reserve a Table",
  description:
    "Book your table at Zestify online. Choose your date, time, and party size for a memorable dining experience.",
};
export default function Home() {
  return <ReservationPage />;
}
