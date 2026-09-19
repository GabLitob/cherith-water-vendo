import type { Metadata } from "next";
import { Figtree, Oxanium } from "next/font/google";

import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  weight: ["400", "500", "600", "700"],
});

const oxanium = Oxanium({
  subsets: ["latin"],
  variable: "--font-oxanium",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Brook Cherith",
  description: "Monitor your water vending machines and get notified the moment one runs low.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${figtree.variable} ${oxanium.variable} antialiased`}>{children}</body>
    </html>
  );
}
