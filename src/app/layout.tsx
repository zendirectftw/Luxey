import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Luxey© — Gold & Precious Metals Exchange",
    template: "%s | Luxey©",
  },
  description:
    "The fastest way to source, sell, and store physical precious metals. Gold bars, coins, silver bullion — real-time pricing, instant payouts, vault custody.",
  keywords: [
    "gold",
    "silver",
    "precious metals",
    "gold bars",
    "gold coins",
    "bullion",
    "exchange",
    "vault",
    "custody",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
