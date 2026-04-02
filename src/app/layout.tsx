import type { Metadata } from "next";
import "./globals.css";
import { primary, secondary } from "./fonts";
import { ContextProvider } from "@/context/context";
import AppFontAwesome from "@/components/layout/AppFontAwesome";
import AppToaster from "@/components/layout/AppToaster";

export const metadata: Metadata = {
  metadataBase: new URL("https://zestify.com"),
  title: {
    default: "Zestify | Fresh Food & Restaurant Experience",
    template: "%s | Zestify",
  },
  description:
    "Zestify is a modern restaurant offering fresh, flavorful meals. Explore our menu, reserve a table, shop gourmet products, and discover our talented chefs.",
  keywords: [
    "restaurant",
    "fresh food",
    "online food order",
    "gourmet meals",
    "table reservation",
    "zestify",
  ],
  authors: [{ name: "Zestify Team" }],
  creator: "Zestify",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://zestify.com",
    siteName: "Zestify",
    title: "Zestify | Fresh Food & Restaurant Experience",
    description:
      "Zestify is a modern restaurant offering fresh, flavorful meals. Explore our menu, reserve a table, and shop gourmet products.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Zestify Restaurant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zestify | Fresh Food & Restaurant Experience",
    description:
      "Explore our menu, reserve a table, and shop gourmet products at Zestify.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${primary.variable} ${secondary.variable}`}>
        <ContextProvider>
          {children}
          <AppFontAwesome />
          <AppToaster />
        </ContextProvider>
      </body>
    </html>
  );
}
