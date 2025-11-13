// src/app/layout.tsx
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

import Footer from "@/components/layout/footer";
import Header from "../components/layout/header";

// ✅ Import font Roboto
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "GennovaX",
  description: "GennovaX - Giải pháp y học di truyền tiên tiến",
  icons: {
    icon: "/images/genbio1.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body
        className={`${roboto.variable} font-roboto antialiased bg-white text-gray-800`}
        style={{ fontFamily: "var(--font-roboto), sans-serif" }}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
