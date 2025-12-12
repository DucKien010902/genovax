"use client";

import { PhoneCall, ChevronRight, Menu, X as XLucide } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { CaretDownFill } from "react-bootstrap-icons";
import ConsultationModal from "../home/ConsultationModal";

// --- 1. Cấu trúc Dữ liệu Menu ---
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
    href: "/gioi-thieu/danh-sach-phong-kham",
    subItems: [
      { label: "Chuỗi phòng xét nghiệm", href: "/gioi-thieu/danh-sach-phong-kham" },
      { label: "Đội ngũ bác sỹ", href: "/gioi-thieu/danh-sach-phong-kham" },
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
  {
    label: "Về GennovaX",
    href: "/ve-gennovax",
    subItems: [
      { label: "Sứ mệnh & Tầm nhìn", href: "/ve-gennovax#tam-nhin-va-su-menh" },
      { label: "Hệ thống GennovaX", href: "/ve-gennovax#he-thong-gennovax" },
      { label: "Đội ngũ chuyên gia", href: "/ve-gennovax#doi-ngu-va-thanh-tuu" },
      { label: "Đối tác chiến lược", href: "/ve-gennovax#doi-tac-va-thuyet-bi" },
    ],
  },
];

// --- 2. Component Desktop Dropdown ---
const DesktopDropdownMenuItem: React.FC<{
  item: MenuItem;
  isTransparent: boolean;
}> = ({ item, isTransparent }) => {
  const hasSubItems = item.subItems && item.subItems.length > 0;

  return (
    <div className="group relative h-full flex items-start">
      {/* Menu Item Chính */}
      <Link
        href={item.href}
        className={`relative flex items-center font-semibold text-[15px] px-5 py-3 transition-all duration-300 rounded-full
          ${
            isTransparent
              ? "text-white hover:bg-white/10"
              : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
          }`}
      >
        {item.label}
        {hasSubItems && (
          <CaretDownFill
            className={`ml-1.5 w-3 h-3 transition-transform duration-300 group-hover:rotate-180 ${
              isTransparent ? "text-gray-200" : "text-gray-400"
            }`}
          />
        )}
      </Link>

      {/* Dropdown Content */}
      {hasSubItems && (
        <>
          {/* Cầu nối tàng hình để chuột không bị lọt khe */}
          <div className="absolute top-full left-0 w-full h-4 bg-transparent z-10" />

          <div
            className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-64 pt-2
                        opacity-0 invisible translate-y-4 
                        group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                        transition-all duration-300 ease-out z-20"
          >
            {/* Box Dropdown chính */}
            <div className="bg-white/95 backdrop-blur-md shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] rounded-xl border border-gray-100 overflow-hidden ring-1 ring-black/5">
              {/* Trang trí thanh màu nhỏ bên trên */}
              <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-cyan-400"></div>

              <div className="p-2">
                {item.subItems?.map((subItem, index) => (
                  <Link
                    key={index}
                    href={subItem.href}
                    className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-gray-600 
                               hover:text-blue-700 hover:bg-blue-50 transition-all duration-200 group/sub"
                  >
                    <span>{subItem.label}</span>
                    <ChevronRight className="w-4 h-4 text-blue-400 opacity-0 -translate-x-2 transition-all duration-200 group-hover/sub:opacity-100 group-hover/sub:translate-x-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// --- 3. Component Mobile Menu ---
const MobileSidebarMenu: React.FC<{
  menuData: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation: () => void;
}> = ({ menuData, isOpen, onClose, onOpenConsultation }) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  return (
    <>
      {/* Overlay mờ */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Drawer Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-[75vw] sm:w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header Mobile Menu */}
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
            <span className="text-xl font-bold text-blue-900">Menu</span>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <XLucide size={24} />
            </button>
          </div>

          {/* List Items */}
          <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <ul className="space-y-1">
              {menuData.map((item) => (
                <li key={item.label} className="group">
                  <div
                    className={`flex justify-between items-center rounded-lg transition-colors ${
                      openSubmenu === item.label ? "bg-blue-50/50" : "hover:bg-gray-50"
                    }`}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="block py-3.5 px-3 text-[16px] font-semibold text-gray-700 hover:text-blue-600 flex-grow"
                    >
                      {item.label}
                    </Link>
                    {item.subItems && item.subItems.length > 0 && (
                      <button
                        onClick={() => toggleSubmenu(item.label)}
                        className="p-3 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <CaretDownFill
                          size={14}
                          className={`transition-transform duration-300 ${
                            openSubmenu === item.label ? "rotate-180 text-blue-600" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Submenu Mobile Animation */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      openSubmenu === item.label
                        ? "grid-rows-[1fr] opacity-100 mb-2"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <ul className="pl-3 space-y-1 border-l-2 border-blue-100 ml-4 mt-1">
                        {item.subItems?.map((subItem) => (
                          <li key={subItem.href}>
                            <Link
                              href={subItem.href}
                              onClick={onClose}
                              className="flex items-center py-2.5 px-3 text-[14px] text-gray-600 font-medium rounded-md hover:text-blue-700 hover:bg-blue-50/50 transition-all"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-300 mr-2"></span>
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom CTA */}
          <div className="p-5 border-t border-gray-100 bg-gray-50/50">
            <button
              onClick={() => {
                onClose();
                onOpenConsultation();
              }}
              className="w-full py-3.5 rounded-xl font-bold text-white shadow-lg shadow-blue-500/30
                          bg-gradient-to-r from-red-600 via-blue-600 to-blue-700
                          flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <PhoneCall size={20} className="animate-pulse" />
              <span>Nhận tư vấn ngay</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// --- 4. Component Header Chính ---
const Header: React.FC<{ isTransparent: boolean }> = ({ isTransparent }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseMenu = () => setIsMenuOpen(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-in-out ${
          isTransparent
            ? "bg-transparent py-4"
            : "bg-white/90 backdrop-blur-md shadow-md py-2"
        }`}
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex justify-between items-center">
            
            {/* --- Logo Area --- */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <img
                    src="/images/genbio1-1.png"
                    alt="Gen Solutions Logo"
                    className="h-10 lg:h-16 object-contain"
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

            {/* --- Desktop Menu --- */}
            <nav className="hidden lg:flex items-center h-full space-x-1">
              {menuData.map((item) => (
                <DesktopDropdownMenuItem
                  key={item.label}
                  item={item}
                  isTransparent={isTransparent}
                />
              ))}
            </nav>

            {/* --- Desktop Action Button --- */}
            <div className="hidden lg:block pl-4">
              <button
                onClick={handleOpenModal}
                className="group relative px-7 py-3 rounded-full font-bold text-white overflow-hidden
                           bg-gradient-to-r from-red-600 via-blue-600 to-blue-700
                           shadow-[0_4px_15px_rgba(37,99,235,0.4)]
                           transition-all duration-300 hover:shadow-[0_6px_20px_rgba(37,99,235,0.6)] hover:-translate-y-0.5"
              >
                {/* Hiệu ứng lướt sáng (Shimmer) */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                
                <span className="relative flex items-center gap-2">
                  <PhoneCall size={18} />
                  Nhận tư vấn
                </span>
              </button>
            </div>

            {/* --- Mobile Toggle Button --- */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className={`lg:hidden p-2 rounded-lg transition-all ${
                isTransparent
                  ? "text-white hover:bg-white/20"
                  : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
              }`}
            >
              <Menu size={32} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </header>

      {/* --- PHẦN QUAN TRỌNG ĐÃ ĐƯỢC THÊM VÀO: --- */}
      <MobileSidebarMenu 
        menuData={menuData}
        isOpen={isMenuOpen} 
        onClose={handleCloseMenu} 
        onOpenConsultation={handleOpenModal}
      />

      {/* Render Modal */}
      <ConsultationModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default Header;