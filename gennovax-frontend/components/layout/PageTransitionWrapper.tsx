"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransitionWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Nếu pathname là "/", margin-top = 0, các trang khác mt-20
  const mtClass =
    pathname === "/" || pathname === "/dang-nhap" ? "mt-0" : "mt-14 lg:mt-20";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`min-h-screen ${mtClass}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
