"use client";

import React, { useRef } from "react";

const VideoSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative max-w-5xl my-10 mx-auto rounded-3xl flex justify-center items-center bg-black overflow-hidden">
      <video
        ref={videoRef}
        className="w-full aspect-[16/9] object-cover"
        src="https://drive.google.com/drive/u/0/folders/1b3JGb5qYifun1GLgq41NlN5s2JvDQNoJ"
        controls // hiển thị các control play/pause/fullscreen
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
};

export default VideoSection;
