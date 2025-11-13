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

// --- 1. Component Con: Input (cho Form) ---
const FooterInput: React.FC<{
  type: string;
  placeholder: string;
  name: string;
}> = ({ type, placeholder, name }) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    required
    className="w-full px-4 py-3 bg-white/10 text-white border border-white/30 rounded-lg
               placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
  />
);

// --- 2. Component Con: Liên hệ (cho Cột 1) ---
const ContactItem: React.FC<{
  icon: React.ComponentType<{ size?: number | string }>;
  text: string;
}> = ({ icon: Icon, text }) => (
  <div className="flex items-start gap-3">
    <Icon />
    <span className="text-gray-300 text-sm">{text}</span>
  </div>
);

// --- 3. Component Footer Chính ---
const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Grid 3 cột (tương tự layout mẫu) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Cột 1: Thông tin liên hệ & Văn phòng (Giống mẫu) */}
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

          {/* Cột 2: Đăng ký tư vấn (Giống mẫu) */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Đăng ký tư vấn</h3>
            <p className="text-sm text-gray-300">
              Để lại thông tin, chuyên gia của chúng tôi sẽ liên hệ với bạn.
            </p>
            <form className="space-y-4 pt-2">
              <FooterInput
                type="text"
                placeholder="Họ và tên*"
                name="fullname"
              />
              <FooterInput type="email" placeholder="Email*" name="email" />
              <FooterInput
                type="tel"
                placeholder="Số điện thoại*"
                name="phone"
              />
              <button
                type="submit"
                className="w-full px-6 py-3 rounded-lg font-bold text-white
                           bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg
                           shadow-orange-500/50 hover:from-amber-500 hover:to-orange-600
                           transition duration-300 transform hover:scale-105"
              >
                GỬI YÊU CẦU
              </button>
              <p className="text-xs text-gray-400">
                (*) Vui lòng điền đầy đủ thông tin.
              </p>
            </form>
          </div>

          {/* Cột 3: Liên kết nhanh (Thay thế "Đơn vị phát triển") */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Dịch vụ nổi bật</h3>
            <ul className="space-y-3 pt-2">
              <QuickLink href="/services/spot-mas-crc">
                Tầm soát ung thư đại trực tràng (SPOT-MAS)
              </QuickLink>
              <QuickLink href="/services/spot-mas-lung">
                Tầm soát ung thư phổi (SPOT-LUNG)
              </QuickLink>
              <QuickLink href="/services/oncofem">
                Tầm soát ung thư phụ nữ (oncoFEM)
              </QuickLink>
              <QuickLink href="/services/genecare">
                Giải mã gen toàn diện (geneCARE)
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

      {/* Dòng Copyright (Giống mẫu) */}
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

// --- Component con cho QuickLink (Cột 3) ---
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

export default Footer;
