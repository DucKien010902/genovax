"use client"; // Thêm dòng này nếu bạn dùng Next.js App Router

import React from "react";
// Đảm bảo bạn đã cài đặt lucide-react: npm install lucide-react
import AboutGennovax from "@/components/home/aboutsection";
import FloatingContact from "@/components/home/contactbotton";
import HeroSection from "@/components/home/herosection";
import PopularPackages from "@/components/home/mostpakagesection";
import OtherServices from "@/components/home/otherservicesection";
import ExpertOpinions from "@/components/home/commentsection";
import OurServiceSystem from "@/components/home/systemsection";

// --- Thành phần App chính (Tập hợp tất cả) ---
// Đây là component chính bạn sẽ export
const LandingPageDongHung: React.FC = () => {
  return (
    <div className="bg-white text-gray-800 font-sans antialiased">
      {/* <Header /> */}
      {/* <FloatingContact /> */}
      <main>
        <HeroSection />
        <PopularPackages />
        <OtherServices />
        <OurServiceSystem />
        <ExpertOpinions />
        <AboutGennovax />
      </main>
      {/* <Footer /> */}
    </div>
  );
};

// Export component chính
// Trong Next.js, bạn sẽ import và sử dụng nó trong `pages/index.tsx`
// Ví dụ:
// export default function HomePage() {
//   return <LandingPageDongHung />;
// }
//
// Hoặc nếu file này LÀ `pages/index.tsx`, bạn chỉ cần:
// export default LandingPageDongHung;
//
// Vì đây là một tệp đơn, chúng ta sẽ export nó như bình thường:
export default LandingPageDongHung;
