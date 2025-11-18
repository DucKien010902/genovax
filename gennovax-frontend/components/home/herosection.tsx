"use client";

import React from "react";

const HeroSection: React.FC = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden" style={{top:0}}>
      {/* Video nền full màn hình */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/videos/introduct.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay màu (tùy chọn) */}
      {/* <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-[2px]" /> */}

      {/* Text (tùy chọn) */}
      {/* <div className="relative z-10 flex items-center justify-center h-full">
        <h1 className="text-white text-4xl lg:text-6xl font-bold drop-shadow-xl">
          XÉT NGHIỆM NIPT GENNOVAX
        </h1>
      </div> */}
    </div>
  );
};

export default HeroSection;
