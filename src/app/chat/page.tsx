import ZestyChatPage from "@/components/pages/ZestyChatPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat with Zesty",
  description:
    "Ask Zesty about the menu, dietary options, and table reservations.",
};

export default function ChatPage() {
  return <ZestyChatPage />;
}
