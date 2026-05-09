import VerifyOtpPage from "@/components/pages/VerifyOtpPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify OTP",
  description: "Verify your email with the code sent to your inbox.",
  robots: { index: false, follow: false },
};

export default function Home() {
  return <VerifyOtpPage />;
}
