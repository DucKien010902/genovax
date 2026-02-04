"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import AppHeader from "@/components/AppHeader";
// import SidebarService from "@/components/SidebarService"; // nếu bạn có sidebar

export default function Shell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, loading } = useAuth();

  // ✅ các route "auth" không hiện header/sidebar
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname?.startsWith("/auth");

  useEffect(() => {
    if (loading) return;

    // chưa login mà không ở auth page => đá về login
    if (!token && !isAuthPage) {
      router.replace("/login");
      return;
    }

    // đã login mà vẫn ở login/register => đá về trang chính
    if (token && isAuthPage) {
      router.replace("/");
    }
  }, [loading, token, isAuthPage, router]);

  // ✅ tránh flash UI khi redirect
  if (loading) return null;
  if (!token && !isAuthPage) return null;

  // ✅ Trang login/register: chỉ render page, không Shell UI
  if (isAuthPage) {
    return <>{children}</>;
  }

  // ✅ Các trang khác: hiện full layout
  return (
    <div className="h-full">
      <AppHeader />

      {/* layout bên dưới header (ví dụ) */}
      <div className="h-[calc(100%-64px)]">
        {children}
      </div>
    </div>
  );
}
