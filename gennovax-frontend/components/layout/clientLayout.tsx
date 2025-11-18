"use client";

import Footer from "@/components/layout/footer";
// ✅ THAY ĐỔI: Import `Header` (hoặc giữ `Navbar` nếu bạn export default as Navbar)
import Header from "@/components/layout/header"; 
import { AnimatePresence, motion, useAnimationFrame } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import PageTransitionWrapper from "./PageTransitionWrapper";
import FloatingContact from "../home/contactbotton";

// (Component LoadingSpinner không đổi)
function LoadingSpinner() {
  const numDots = 7;
  const radius = 40;
  const colors = [
    "#3b82f6", "#3b82f6", "#3b82f6", "#3b82f6", "#3b82f6", "#3b82f6", "#3b82f6",
  ];

  const [angles, setAngles] = useState(
    Array.from({ length: numDots }, (_, i) => (i / numDots) * 2 * Math.PI),
  );

  useAnimationFrame(() => {
    const speed = 0.05;
    setAngles((prev) => prev.map((a) => a + speed));
  });

  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      <img
        src="https://res.cloudinary.com/da6f4dmql/image/upload/v1763108672/genbio1_dtokw3.png"
        alt="Genlive"
        className="w-16 h-16 rounded-full z-10"
      />
      {angles.map((angle, i) => {
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        return (
          <div
            key={i}
            className="w-4 h-4 rounded-full absolute"
            style={{
              backgroundColor: colors[i % colors.length],
              transform: `translate(${x}px, ${y}px)`,
            }}
          />
        );
      })}
    </div>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ THAY ĐỔI: Logic scroll effect
  useEffect(() => {
    // Chỉ áp dụng cho trang chủ
    if (pathname !== "/") {
      setIsScrolled(true); // Các trang khác luôn ở trạng thái "solid"
      return;
    }

    // Ngưỡng scroll là 200px
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };

    handleScroll(); // Kiểm tra ngay lúc tải trang (phòng trường hợp F5)
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Loading spinner (Giữ nguyên)
  useEffect(() => {
    setIsLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [pathname]);

  // ✅ THAY ĐỔI: Tính toán trạng thái transparent
  // Chỉ trong suốt NẾU: ở trang chủ VÀ chưa scroll qua 200px
  const isTransparent = (pathname === "/") && !isScrolled;

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="spinner"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingSpinner />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ THAY ĐỔI: Truyền prop `isTransparent` */}
      <Header isTransparent={isTransparent} />
      
      <FloatingContact />
      {/* Page transition wrapper */}
      <PageTransitionWrapper>{children}</PageTransitionWrapper>

      <Footer />
    </>
  );
}