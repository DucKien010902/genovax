"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ConsultationModal from "./ConsultationModal";
import ChatWidget from "./ChatDrawerAI";

export default function PopupBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State quản lý Modal
    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem("popupShown");

    if (!shown) {
      const timer = setTimeout(() => {
        setIsOpen(true);

        setTimeout(() => setIsVisible(true), 20);

        sessionStorage.setItem("popupShown", "true");
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className={`
        fixed inset-0 z-[9999] flex items-center justify-center 
        bg-black/60 p-4
        transition-opacity duration-500
        ${isVisible ? "opacity-100" : "opacity-0"}
      `}
      onClick={() => setIsOpen(false)}
    >
      {/* Container popup */}
      <div
        className={`
          relative w-full max-w-[600px] 
          bg-white rounded-[20px] 
          shadow-[0_0_50px_10px_rgba(0,113,188,0.6)]
          overflow-hidden
          transition-all duration-500
          ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ảnh banner */}
        <img
          src="https://res.cloudinary.com/da6f4dmql/image/upload/v1765252888/500171538_122109065432870117_5679422188234481001_n_laiiez.jpg"
          alt="Banner popup"
          className="w-full aspect-[2/2] md:aspect-[2/2] object-cover block"
        />

        {/* Nút X – ĐẶT RA NGOÀI WRAPPER ẢNH + z-index 50 */}
        <button
          onClick={() => setIsOpen(false)}
          className="
            absolute top-2 right-2 sm:top-3 sm:right-3
            w-8 h-8 sm:w-10 sm:h-10 
            bg-white/90 backdrop-blur-md border border-gray-200 
            rounded-full flex items-center justify-center 
            text-gray-600 hover:text-[#0071bc] hover:border-[#0071bc] hover:rotate-90
            transition-all duration-300 z-[50] shadow-md
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Nút ở dưới banner */}
        <div className="absolute inset-0 flex items-end p-4 sm:p-8 md:p-10">
          <div className="flex flex-row gap-3 justify-center w-auto mx-auto">
            <Link
              href="/y-te/danh-sach-dich-vu"
              className="px-4 py-2 sm:px-6 sm:py-2.5 
                text-sm sm:text-base font-bold text-white rounded-full 
                bg-[#0071bc] border border-white/20
                shadow-[0_4px_15px_rgba(0,113,188,0.5)]
                hover:bg-[#005f9e] hover:shadow-[0_6px_20px_rgba(0,113,188,0.7)]
                hover:-translate-y-1 active:scale-95
                transition-all duration-300 backdrop-blur-sm"
                onClick={(e) => {
              e.preventDefault();
              setIsChatOpen(true);
            }}
            >
              Tư vấn nhanh
            </Link>

            <Link
              href="/dich-vu"
              className="px-4 py-2 sm:px-6 sm:py-2.5 
                text-sm sm:text-base font-bold text-white rounded-full 
                bg-[#00a859] border border-white/20
                shadow-[0_4px_15px_rgba(0,168,89,0.5)]
                hover:bg-[#008f4c] hover:shadow-[0_6px_20px_rgba(0,168,89,0.7)]
                hover:-translate-y-1 active:scale-95
                transition-all duration-300 backdrop-blur-sm"
              onClick={(e) => {
              e.preventDefault();
              setIsModalOpen(true);
            }}
            >
              
              Đặt Lịch Ngay
            </Link>
          </div>
        </div>
      </div>
      <ConsultationModal isOpen={isModalOpen} onClose={handleCloseModal} />
      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
