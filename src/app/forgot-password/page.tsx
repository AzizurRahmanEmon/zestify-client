import ForgotPasswordPage from "@/components/pages/ForgotPasswordPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password | Zestify",
  description: "Recover your account by resetting your password.",
};

const ForgotPassword = () => {
  return <ForgotPasswordPage />;
};

export default ForgotPassword;
