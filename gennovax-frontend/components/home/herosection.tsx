"use client";

import React, { useRef } from "react";

const HeroSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section className="relative overflow-hidden bg-black">
      <video
        ref={videoRef}
        className=" w-full object-cover aspect-[16/10] lg:aspect-[16/8]"
        src="/videos/introduct.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
    </section>
  );
};

export default HeroSection;
