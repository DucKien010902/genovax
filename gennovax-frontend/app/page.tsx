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
import PopupBanner from "@/components/home/PopupBanner";
import VideoSection from "@/components/home/videoSection";
import DoctorsList from "@/components/home/doctorsSection";

// --- Thành phần App chính (Tập hợp tất cả) ---
// Đây là component chính bạn sẽ export
const LandingPageDongHung: React.FC = () => {
  return (
    <div className="bg-white text-gray-800 font-sans antialiased mt-0">
      <main>
        <PopupBanner />
        <HeroSection />
        <PopularPackages />
        <OtherServices />
        <OurServiceSystem />
        <DoctorsList />
        <ExpertOpinions />
        <AboutGennovax />
        {/* <VideoSection/> */}
      </main>
    </div>
  );
};

export default LandingPageDongHung;
