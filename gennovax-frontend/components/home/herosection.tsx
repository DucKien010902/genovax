"use client";

import React, { useRef } from "react";

const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative w-full flex justify-center items-center bg-black">
      <video
        ref={videoRef}
        className="w-full aspect-[3/2] lg:aspect-[16/9] object-cover"
        src="/videos/introduct.mp4"
        // controls       // hiển thị các control play/pause/fullscreen
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
};

export default HeroSection;
