"use client";

import React, { useState } from "react";
import { FaPhone, FaFacebookF, FaShareAlt } from "react-icons/fa";
import { FaCommentDots } from "react-icons/fa6";
import ChatWidget from "./ChatDrawerAI";

const FloatingContact: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [canClickChildren, setCanClickChildren] = useState(false);

  const phone = "0936654456";
  const zaloOA = "0936654456";

  const handleOpenShare = () => {
    // Reset về khóa click
    setCanClickChildren(false);

    // 0.5s sau mới cho phép click
    setTimeout(() => {
      setCanClickChildren(true);
    }, 500);
  };

  return (
    <>
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <div className="fixed bottom-12 right-6 z-50 flex flex-col gap-4 items-center">
        {/* ==== KHỐI SHARE ==== */}
        <div
          className="relative group"
          onMouseEnter={handleOpenShare}
          onClick={handleOpenShare}
        >
          {/* Nút Chia sẻ */}
          <button className="flex items-center justify-center w-12 h-12 rounded-full bg-[#32a2a8] text-white shadow-md transition-all duration-300 group-hover:opacity-0">
            <FaShareAlt className="text-xl" />
          </button>

          {/* 3 nút hiện khi hover */}
          <div
            className={`
              absolute bottom-0 right-0 flex flex-col gap-3
              opacity-0 group-hover:opacity-100 transition-opacity
              ${canClickChildren ? "pointer-events-auto" : "pointer-events-none"}
            `}
          >
            {/* Phone */}
            <a
              href={`tel:${phone}`}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white shadow-md hover:scale-110 transition"
            >
              <FaPhone className="text-lg" />
            </a>

            {/* Zalo */}
            <a
              href={`https://zalo.me/${zaloOA}`}
              target="_blank"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 text-white shadow-md hover:scale-110 transition"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/2048px-Icon_of_Zalo.svg.png"
                className="w-6 h-6"
              />
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/profile.php?id=61576103516877"
              target="_blank"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white shadow-md hover:scale-110 transition"
            >
              <FaFacebookF className="text-lg" />
            </a>
          </div>
        </div>

        {/* Nút Chat AI */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg transition-all duration-300 hover:scale-110"
        >
          <FaCommentDots className="text-2xl" />
        </button>
      </div>
    </>
  );
};

export default FloatingContact;
