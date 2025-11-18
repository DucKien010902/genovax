"use client";

import { PhoneCall } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { CaretDownFill, List, X } from "react-bootstrap-icons";
// Cần cài đặt: npm install react-bootstrap-icons

// --- 1. Cấu trúc Dữ liệu Menu (TypeScript) ---

export type MenuItem = {
  label: string;
  href: string;
  subItems?: MenuItem[]; // Tùy chọn submenu
};

export const menuData: MenuItem[] = [
  // ... (Dữ liệu menu của bạn không đổi) ...
  {
    label: "Sản phẩm",
    href: "/dich-vu",
    subItems: [
      { label: "Các gói xét nghiệm", href: "/dich-vu" },
      { label: "Xét nghiệm NIPT", href: "/dich-vu/NIPT" },
      { label: "Xét nghiệm ADN", href: "/dich-vu/DNA" },
    ],
  },
  {
    label: "Giới thiệu",
    href: "/about",
    subItems: [
      { label: "Sứ mệnh & Tầm nhìn", href: "/gioi-thieu/#tam-nhin-va-su-menh" },
      { label: "Hệ thống GennovaX", href: "/gioi-thieu/#he-thong-gennovax" },
      {
        label: "Đội ngũ chuyên gia",
        href: "/gioi-thieu/#doi-ngu-va-thanh-tuu",
      },
      {
        label: "Đối tác chiến lược",
        href: "/gioi-thieu/#doi-tac-va-thuyet-bi",
      },
    ],
  },
  {
    label: "Tin tức",
    href: "/news",
    subItems: [
      { label: "Tin tức y tế", href: "/news/medical" },
      { label: "Thông báo", href: "/news/announcements" },
      { label: "Sự kiện", href: "/news/events" },
    ],
  },
  {
    label: "Thư viện",
    href: "/library",
    subItems: [
      { label: "Tài liệu khoa học", href: "/library/papers" },
      { label: "Video & Podcast", href: "/library/media" },
    ],
  },
  {
    label: "Liên hệ",
    href: "/contact",
    subItems: [
      { label: "Văn phòng chính", href: "/contact/main-office" },
      { label: "Hợp tác đối tác", href: "/contact/partnership" },
    ],
  },
  {
    label: "Thị trường",
    href: "/market",
    subItems: [
      { label: "Giá trị Gen", href: "/market/gen-value" },
      { label: "Chương trình ưu đãi", href: "/market/promotions" },
    ],
  },
];

// --- 2. Component DropdownMenuItem (CHO DESKTOP) ---

// ✅ THAY ĐỔI: Nhận thêm prop `isTransparent`
const DesktopDropdownMenuItem: React.FC<{
  item: MenuItem;
  isTransparent: boolean;
}> = ({ item, isTransparent }) => {
  const hasSubItems = item.subItems && item.subItems.length > 0;

  return (
    // Sử dụng group để kích hoạt dropdown menu khi hover
    <div className="group relative h-full flex items-center">
      <Link
        href={item.href}
        // ✅ THAY ĐỔI: Đổi màu chữ dựa trên `isTransparent`
        className={`flex items-center font-medium px-4 py-2 transition-colors duration-150 ${
          isTransparent
            ? "text-white hover:text-gray-200" // Trạng thái trong suốt
            : "text-gray-700 hover:text-blue-500" // Trạng thái solid
        }`}
      >
        {item.label}
        {hasSubItems && (
          // ✅ THAY ĐỔI: Đổi màu icon caret
          <CaretDownFill
            className={`ml-1 w-3 h-3 transition-all duration-300 ${
              isTransparent ? "text-gray-300" : "text-gray-400"
            } group-hover:rotate-180`}
          />
        )}
      </Link>

      {/* Dropdown Menu - Desktop (Không đổi) */}
      {hasSubItems && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 pt-5
                       group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                       opacity-0 invisible transition-all duration-300 transform translate-y-2 z-20 min-w-48"
        >
          <div className="bg-white shadow-xl rounded-lg border border-gray-100 overflow-hidden">
            {item.subItems?.map((subItem) => (
              <Link
                key={subItem.href}
                href={subItem.href}
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition duration-150 whitespace-nowrap"
              >
                {subItem.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- 3. Component MobileSidebarMenu (CHO MOBILE) ---
// (Không cần thay đổi, vì sidebar luôn là nền trắng)
const MobileSidebarMenu: React.FC<{
  menuData: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
}> = ({ menuData, isOpen, onClose }) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  return (
    <>
      {/* Overlay backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <span className="text-lg font-bold text-blue-800">Menu Chính</span>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-red-500"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 overflow-y-auto h-[calc(100%-60px)]">
          <ul>
            {menuData.map((item) => (
              <li key={item.label} className="border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <Link
                    href={item.href}
                    onClick={onClose} // Đóng menu khi điều hướng
                    className="block py-3 text-gray-700 font-medium hover:text-blue-600 flex-grow"
                  >
                    {item.label}
                  </Link>

                  {/* Nút bấm để mở/đóng submenu trên mobile */}
                  {item.subItems && item.subItems.length > 0 && (
                    <button
                      onClick={() => toggleSubmenu(item.label)}
                      className="p-2 text-gray-500 hover:text-blue-600 transition"
                    >
                      <CaretDownFill
                        size={14}
                        className={`transition-transform duration-300 ${
                          openSubmenu === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Submenu Mobile (Accordion) */}
                {item.subItems && (
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      openSubmenu === item.label
                        ? "max-h-96 opacity-100 py-1" // Mở
                        : "max-h-0 opacity-0" // Đóng
                    }`}
                  >
                    <ul className="pl-4">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.href}>
                          <Link
                            href={subItem.href}
                            onClick={onClose} // Đóng menu khi điều hướng
                            className="block py-2 text-sm text-gray-600 hover:text-blue-500 border-l border-gray-300 pl-3"
                          >
                            {subItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

// --- 4. Component Header Chính (RESPONSIVE) ---

// ✅ THAY ĐỔI: Nhận prop `isTransparent`
const Header: React.FC<{ isTransparent: boolean }> = ({ isTransparent }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCloseMenu = () => setIsMenuOpen(false);

  return (
    // ✅ THAY ĐỔI: Thay đổi className của Header
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? "bg-transparent border-t-transparent" // Trạng thái trong suốt
          : "bg-white shadow-md border-t-4 border-t-blue-500/10" // Trạng thái solid
      }`}
    >
      {/* breakpoint lg (1024px) */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section (Responsive) */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <img
                  src="/images/genbio1.png"
                  alt="Gen Solutions Logo"
                  className="h-15 lg:h-25 object-contain"
                />
              </Link>
            </div>
            {/* Logo 1: Gene Solutions */}
            <Link href="/" className="flex flex-col items-start leading-tight">
              {/* ✅ THAY ĐỔI: Đổi màu chữ Logo */}
              <span
                className={`text-sm lg:text-xl font-bold transition-colors ${
                  isTransparent ? "text-white" : "text-blue-800"
                }`}
              >
                GENNOVAX
              </span>
              {/* ✅ THAY ĐỔI: Đổi màu chữ Slogan */}
              <span
                className={`text-[10px] lg:text-xs font-[cursive] transition-colors ${
                  isTransparent ? "text-white" : "text-blue-800"
                }`}
              >
                Đích đến của niềm tin
              </span>
            </Link>
          </div>

          {/* Navigation Menu & Call to Action */}
          <div className="flex items-center space-x-4 lg:space-x-8">
            {/* Main Menu - CHỈ HIỂN THỊ TRÊN DESKTOP (lg:) */}
            <nav className="hidden lg:flex h-full">
              <ul className="flex h-full space-x-1">
                {menuData.map((item) => (
                  <li key={item.label}>
                    {/* ✅ THAY ĐỔI: Truyền prop `isTransparent` xuống */}
                    <DesktopDropdownMenuItem
                      item={item}
                      isTransparent={isTransparent}
                    />
                  </li>
                ))}
              </ul>
            </nav>

            {/* CTA Button - CHỈ HIỂN THỊ TRÊN DESKTOP (lg:) */}
            {/* (Nút CTA màu cam này đã nổi bật, không cần đổi) */}
            <button
              className="hidden lg:block px-6 py-2.5 rounded-full font-bold text-white
                       bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg cursor-pointer
                       shadow-orange-500/50 hover:from-amber-500 hover:to-orange-600
                       transition duration-300 transform hover:scale-[1.03] whitespace-nowrap"
            >
              <span className="inline-block text-lg align-middle mr-2">
                <PhoneCall />
              </span>
              0936 654 456
            </button>

            {/* Nút 3 gạch (Hamburger) - CHỈ HIỂN THỊ TRÊN MOBILE (ẩn trên lg:) */}
            {/* ✅ THAY ĐỔI: Đổi màu icon hamburger */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className={`lg:hidden p-2 transition-colors ${
                isTransparent
                  ? "text-white hover:text-gray-200"
                  : "text-gray-700 hover:text-blue-500"
              }`}
            >
              <List size={30} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar (Render bên ngoài) */}
      <MobileSidebarMenu
        menuData={menuData}
        isOpen={isMenuOpen}
        onClose={handleCloseMenu}
      />
    </header>
  );
};

export default Header;