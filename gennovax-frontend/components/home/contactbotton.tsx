// src/components/FloatingContact.tsx
"use client";

import React from "react";
import { TelephoneFill } from "react-bootstrap-icons";
// Cần cài đặt: npm install react-icons
import { SiZalo } from "react-icons/si";

// Định nghĩa props nếu bạn muốn truyền SĐT/Link Zalo từ bên ngoài
type Props = {
  phone: string;
  zaloLink: string;
};

// Sử dụng Props: const FloatingContact: React.FC<Props> = ({ phone, zaloLink }) => {
// Hoặc Hardcode:
const FloatingContact: React.FC = () => {
  const phoneNumber = "0936 654 456"; // <-- Thay số điện thoại của bạn
  const zaloOA = "12345678"; // <-- Thay ID Zalo OA hoặc SĐT Zalo của bạn

  return (
    // Container cố định ở góc dưới bên phải
    <div className="fixed bottom-6 right-6 z-50">
      {/* Container xếp dọc 2 nút */}
      <div className="flex flex-col space-y-3">
        {/* Nút Điện thoại */}
        <a
          href={`tel:${phoneNumber}`}
          aria-label="Gọi điện cho chúng tôi"
          className="w-12 h-12 lg:w-14 lg:h-14 rounded-full
                     bg-green-500 hover:bg-green-600
                     flex items-center justify-center
                     text-white shadow-lg
                     transition-all duration-300 transform hover:scale-110"
        >
          <TelephoneFill size={28} />
        </a>

        {/* Nút Zalo */}
        <a
          href={`https://zalo.me/${zaloOA}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Nhắn tin Zalo cho chúng tôi"
          className="w-12 h-12 lg:w-14 lg:h-14 rounded-full
                     bg-blue-500 hover:bg-blue-600
                     flex items-center justify-center
                     text-white shadow-lg
                     transition-all duration-300 transform hover:scale-110"
        >
          <SiZalo size={28} />
        </a>
      </div>
    </div>
  );
};

export default FloatingContact;
