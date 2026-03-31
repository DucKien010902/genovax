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
    <div className="relative overflow-hidden text-gray-800 font-sans antialiased">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-[38rem] h-[30rem] bg-[radial-gradient(circle_at_center,rgba(14,116,144,0.08),transparent_65%)]" />
      <main className="relative">
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
