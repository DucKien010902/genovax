import type { Metadata } from "next";
import "./globals.css";

import ClientLayout from "@/components/layout/clientLayout";

export const metadata: Metadata = {
  title: "GennovaX",
  description: "GennovaX - Giải pháp y học di truyền tiên tiến",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased bg-white text-gray-800">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
