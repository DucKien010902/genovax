"use client";

import { PhoneCall } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, FormEvent, useEffect } from "react";
import { CaretDownFill, List, X, Send } from "react-bootstrap-icons";
import ConsultationModal from "../home/ConsultationModal";

// --- 1. Cấu trúc Dữ liệu Menu (TypeScript) ---

export type MenuItem = {
  label: string;
  href: string;
  subItems?: MenuItem[];
};

export const menuData: MenuItem[] = [
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
    href: "gioi-thieu/#doi-ngu-va-thanh-tuu",
    subItems: [
      {
        label: "Chuỗi phòng xét nghiệm",
        href: "/gioi-thieu/danh-sach-phong-kham",
      },
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
    href: "/tin-tuc",
    subItems: [{ label: "Tin tức y tế", href: "/tin-tuc" }],
  },
  {
    label: "Tài liệu",
    href: "/tai-lieu/tai-lieu-y-khoa",
    subItems: [
      { label: "Tài liệu y khoa", href: "/tai-lieu/tai-lieu-y-khoa" },
      { label: "Khóa học trực tuyến", href: "/tai-lieu/khoa-hoc-edu" },
    ],
  },
];

// --- 2. Component DropdownMenuItem (CHO DESKTOP) ---
const DesktopDropdownMenuItem: React.FC<{
  item: MenuItem;
  isTransparent: boolean;
}> = ({ item, isTransparent }) => {
  const hasSubItems = item.subItems && item.subItems.length > 0;

  return (
    <div className="group relative h-full flex items-center">
      <Link
        href={item.href}
        className={`flex items-center font-medium px-4 py-2 transition-colors duration-150 ${
          isTransparent
            ? "text-white hover:text-gray-200"
            : "text-gray-700 hover:text-blue-500"
        }`}
      >
        {item.label}
        {hasSubItems && (
          <CaretDownFill
            className={`ml-1 w-3 h-3 transition-all duration-300 ${
              isTransparent ? "text-gray-300" : "text-gray-400"
            } group-hover:rotate-180`}
          />
        )}
      </Link>

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
const MobileSidebarMenu: React.FC<{
  menuData: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation: () => void; // Thêm prop để mở modal từ mobile menu
}> = ({ menuData, isOpen, onClose, onOpenConsultation }) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-30 transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center bg-blue-50">
          <span className="text-lg font-bold text-blue-800">Menu Chính</span>
          <button
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-red-500 rounded-full hover:bg-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 overflow-y-auto h-[calc(100%-140px)]">
          <ul>
            {menuData.map((item) => (
              <li key={item.label} className="border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="block py-3 text-gray-700 font-medium hover:text-blue-600 flex-grow"
                  >
                    {item.label}
                  </Link>
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
                {item.subItems && (
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      openSubmenu === item.label
                        ? "max-h-96 opacity-100 py-1"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <ul className="pl-4 bg-gray-50 rounded-md">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.href}>
                          <Link
                            href={subItem.href}
                            onClick={onClose}
                            className="block py-2 text-sm text-gray-600 hover:text-blue-500 border-l-2 border-transparent hover:border-blue-500 pl-3"
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

        {/* Nút Nhận tư vấn trên Mobile Menu */}
        <div className="absolute bottom-0 left-0 w-full p-4 border-t bg-white">
          <button
            onClick={() => {
              onClose();
              onOpenConsultation();
            }}
            className="w-full py-3 rounded-lg font-bold text-white
                       bg-gradient-to-r from-red-600 to-blue-600 shadow-lg
                       flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <PhoneCall size={18} />
            Nhận tư vấn ngay
          </button>
        </div>
      </div>
    </>
  );
};

// --- 4. Component Modal Tư Vấn (MỚI) ---

// --- 5. Component Header Chính (RESPONSIVE) ---

const Header: React.FC<{ isTransparent: boolean }> = ({ isTransparent }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State quản lý Modal

  const handleCloseMenu = () => setIsMenuOpen(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isTransparent
            ? "bg-transparent border-t-transparent"
            : "bg-white shadow-md border-t-0 border-t-blue-500/10"
        }`}
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Section */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <img
                    src="/images/genbio1-1.png"
                    alt="Gen Solutions Logo"
                    className="h-10 lg:h-15 object-contain"
                  />
                </Link>
              </div>

              <Link
                href="/"
                className="flex flex-col items-start leading-tight mb-1"
              >
                <Image
                  src="/images/genbio1-2.png"
                  alt="GENNOVAX Logo"
                  width={120}
                  height={40}
                  className={`transition-all ml-0 lg:ml-3 ${
                    isTransparent ? "opacity-100" : "opacity-90"
                  }`}
                  priority
                />
                <span
                  className={`text-[11px] font-bold lg:text-[14px] ml-2  transition-colors ${
                    isTransparent ? "text-white" : "text-blue-800"
                  }`}
                >
                  Đích đến của niềm tin
                </span>
              </Link>
            </div>

            {/* Navigation & CTA */}
            <div className="flex items-center space-x-4 lg:space-x-8">
              {/* Main Menu (Desktop) */}
              <nav className="hidden lg:flex h-full">
                <ul className="flex h-full space-x-1">
                  {menuData.map((item) => (
                    <li key={item.label}>
                      <DesktopDropdownMenuItem
                        item={item}
                        isTransparent={isTransparent}
                      />
                    </li>
                  ))}
                </ul>
              </nav>

              {/* CTA Button (Desktop) - Nút "Nhận tư vấn" */}
              <button
                onClick={handleOpenModal}
                className="hidden lg:block px-6 py-2.5 rounded-full font-bold text-white
                          bg-gradient-to-r from-red-600 via-blue-600 to-blue-600
                          bg-[length:200%_auto] hover:bg-right transition-all duration-500 ease-in-out
                          shadow-lg shadow-blue-500/30 cursor-pointer
                          transform hover:scale-[1.03] whitespace-nowrap"
              >
                <span className="inline-block text-lg align-middle mr-2">
                  <PhoneCall />
                </span>
                Nhận tư vấn
              </button>

              {/* Hamburger Button (Mobile) */}
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

        {/* Mobile Sidebar */}
        <MobileSidebarMenu
          menuData={menuData}
          isOpen={isMenuOpen}
          onClose={handleCloseMenu}
          onOpenConsultation={handleOpenModal} // Truyền hàm mở modal xuống mobile menu
        />
      </header>

      {/* Render Modal - Nằm ngoài Header để tránh lỗi z-index cục bộ */}
      <ConsultationModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default Header;
