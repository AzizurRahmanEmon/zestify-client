import ContactPage from "@/components/pages/ContactPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Zestify for reservations, catering inquiries, feedback, or general questions. We'd love to hear from you.",
};
export default function Home() {
  return <ContactPage />;
}
