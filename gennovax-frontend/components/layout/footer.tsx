// src/components/Footer.tsx
"use client";

import Link from "next/link";
import React from "react";
// Cần cài đặt: npm install react-bootstrap-icons
import {
  ArrowRightCircleFill,
  EnvelopeFill,
  Facebook,
  GeoAltFill,
  Linkedin,
  TelephoneFill,
  Youtube,
} from "react-bootstrap-icons";

// --- 1. Component Con: Liên hệ (cho Cột 1) ---
const ContactItem: React.FC<{
  icon: React.ComponentType<{ size?: number | string }>;
  text: string;
}> = ({ icon: Icon, text }) => (
  <div className="flex items-start gap-3">
    <div style={{ marginTop: "4px", flexShrink: 0 }}>
      <Icon size={16} />
    </div>

    <span className="text-gray-300 text-sm">{text}</span>
  </div>
);

// --- 2. Component Con: QuickLink (cho Cột 3) ---
const QuickLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <li>
    <Link
      href={href}
      className="flex items-center text-gray-300 hover:text-white group"
    >
      <ArrowRightCircleFill className="w-4 h-4 text-blue-300/70 mr-3 transition-all group-hover:text-blue-300" />
      <span className="text-sm transition-all group-hover:translate-x-1">
        {children}
      </span>
    </Link>
  </li>
);

// --- 3. Component Footer Chính ---
const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Grid 3 cột */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* === CỘT 1: THÔNG TIN LIÊN HỆ === */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">GENNOVAX</h3>
            <p className="text-sm text-gray-300 pr-4">
              Tiên phong ứng dụng công nghệ gen và AI trong y học chính xác,
              mang đến giải pháp sức khỏe tối ưu cho người Việt.
            </p>

            <h4 className="text-lg font-semibold text-white pt-4">
              THÔNG TIN LIÊN HỆ
            </h4>
            <div className="space-y-3">
              <ContactItem
                icon={GeoAltFill}
                text="Trụ sở: Tầng 2, tòa CT3, khu đô thị Nghĩa Đô, Hoàng Quốc Việt, Hà Nội"
              />
              <ContactItem
                icon={TelephoneFill}
                text="Hotline (24/7): 0936 654 456"
              />
              <ContactItem icon={EnvelopeFill} text="Email: info@gennovax.vn" />
            </div>

            {/* Mạng xã hội */}
            <div className="flex space-x-4 pt-4">
              <Link
                href="#"
                className="text-gray-300 hover:text-white transition"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-white transition"
              >
                <Youtube size={20} />
              </Link>
              <Link
                href="#"
                className="text-gray-300 hover:text-white transition"
              >
                <Linkedin size={20} />
              </Link>
            </div>
          </div>

          {/* === CỘT 2: GOOGLE MAP (ĐÃ SỬA) === */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Bản đồ chỉ đường</h3>
            <p className="text-sm text-gray-300">
              Ghé thăm văn phòng của chúng tôi tại Khu đô thị Nghĩa Đô.
            </p>

            {/* Container cho Map */}
            <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg border border-white/10 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.5745338292195!2d105.79059527476983!3d21.049703387059914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab7ab07df9fd%3A0xa4894ce03534c510!2zQ2h1bmcgY8awIENUMyBOZ2jEqWEgxJDDtA!5e0!3m2!1svi!2sus!4v1763526823094!5m2!1svi!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
                title="GennovaX Location"
              ></iframe>
            </div>
          </div>

          {/* === CỘT 3: LIÊN KẾT NHANH === */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Dịch vụ nổi bật</h3>
            <ul className="space-y-3 pt-2">
              <QuickLink href="/dich-vu/NIPT">
                Xét nghiệp sàng lọc trước sinh (NIPT)
              </QuickLink>
              <QuickLink href="/dich-vu/DNA">
                Xét nghiệm gen di truyền (DNA)
              </QuickLink>
              
            </ul>

            <h3 className="text-2xl font-bold text-white pt-6">Về chúng tôi</h3>
            <ul className="space-y-3 pt-2">
              <QuickLink href="/about">Hành trình GennovaX</QuickLink>
              <QuickLink href="/news">Tin tức & Sự kiện</QuickLink>
              <QuickLink href="/contact">Liên hệ Chuyên gia</QuickLink>
            </ul>
          </div>
        </div>
      </div>

      {/* Dòng Copyright */}
      <div className="bg-black/20 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-sm text-gray-400">
            Một sản phẩm của CÔNG TY CỔ PHẦN CÔNG NGHỆ GENNOVAX.
            <br />© {new Date().getFullYear()} GennovaX. All Rights Reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link
              href="/terms"
              className="text-xs text-gray-400 hover:text-white"
            >
              Điều khoản sử dụng
            </Link>
            <span className="text-gray-500">|</span>
            <Link
              href="/privacy"
              className="text-xs text-gray-400 hover:text-white"
            >
              Chính sách bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
