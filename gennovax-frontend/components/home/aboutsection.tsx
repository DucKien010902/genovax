// src/components/AboutGennovax.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  CpuFill,
  Journals,
  PersonVcardFill,
  ArrowRight,
} from "react-bootstrap-icons";

// --- 1. Component "Cột trụ" (Pillar) - Giữ nguyên ---
const PillarItem: React.FC<{
  icon: React.ComponentType<{ size?: number | string }>;
  title: string;
  children: React.ReactNode;
}> = ({ icon: Icon, title, children }) => (
  <div className="flex items-start gap-4">
    {/* Icon */}
    <div
      className="flex-shrink-0 w-12 h-12 rounded-full
                  bg-blue-100 text-blue-700
                  flex items-center justify-center border-4 border-white shadow-md"
    >
      <Icon size={24} />
    </div>
    {/* Nội dung */}
    <div>
      <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600 mt-1">{children}</p>
    </div>
  </div>
);

// --- 2. Component Nút điều hướng nhỏ ---
const NavButton: React.FC<{ text: string; href: string }> = ({ text, href }) => (
  <Link
    href={href}
    className="
      flex items-center justify-center gap-2 px-4 py-3 w-full
      rounded-3xl font-semibold text-white shadow-md
      bg-gradient-to-r from-red-500 to-blue-700
      hover:from-red-600 hover:to-blue-800
      transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg
    "
  >
    {text}
    <ArrowRight className="opacity-70" size={16} />
  </Link>
);

// --- 3. Component Chính ---
const AboutGennovax: React.FC = () => {
  const imageUrl =
    "https://res.cloudinary.com/da6f4dmql/image/upload/v1764750460/shutterstock_1770401555_hmmobk.jpg";

  return (
    <section className="bg-white py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- PHẦN 1: TIÊU ĐỀ (Đã đẩy lên đầu) --- */}
        <div className="flex justify-center mb-10 lg:mb-12">
          <div
            className="
              inline-block px-6 py-2
              border-2 border-dashed border-blue-300
              rounded-full
               backdrop-blur-sm
            "
          >
            <span className="text-sm md:text-3xl font-bold uppercase text-blue-800 tracking-wide">
              VỀ GENNOVAX
            </span>
          </div>
        </div>

        {/* --- PHẦN 2: GRID NỘI DUNG --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Cột Trái: Ảnh + 4 Nút */}
          <div className="flex flex-col gap-6">
  {/* Ảnh */}
  <div className="w-full aspect-[16/10] relative rounded-xl lg:rounded-3xl shadow-2xl overflow-hidden border border-blue-100">
    <Image
      src={imageUrl}
      alt="Phòng thí nghiệm GennovaX"
      fill
      className="object-cover hover:scale-105 transition-transform duration-700"
      unoptimized
    />
  </div>

  {/* Title nhỏ dưới ảnh */}
  <div className="text-center">
    <h2 className="text-lg lg:text-3xl font-semibold text-blue-700 mt-1">
      Vì sao nên chọn chúng tôi ?
    </h2>
  </div>

  {/* 4 Button */}
  <div className="grid grid-cols-2 gap-5 w-[95%]  mx-auto mt-3">
    <NavButton text="Hệ thống Lab hiện đại" href="/ve-gennovax#he-thong-gennovax" />
    <NavButton text="Đội ngũ bác sỹ uy tín" href="/ve-gennovax#doi-ngu-va-thanh-tuu" />
    <NavButton text="Độ phủ toàn quốc" href="/ve-gennovax#he-thong-gennovax" />
    <NavButton text="Hệ sinh thái đối tác lớn" href="/ve-gennovax#doi-tac-va-thuyet-bi" />
  </div>
</div>


          {/* Cột Phải: Nội dung chi tiết (Giữ nguyên) */}
          <div className="pt-2">
            <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 leading-tight">
              Tiên phong Tương lai Y học qua <span className="text-blue-700">Lăng kính Di truyền</span>
            </h2>

            <p className="mt-6 text-base lg:text-lg text-gray-600 leading-relaxed">
              Sứ mệnh của chúng tôi là ứng dụng công nghệ giải trình tự gen
              (NGS) thế hệ mới và Trí tuệ nhân tạo (AI) để cung cấp các giải
              pháp y học chính xác.
            </p>
            <p className="mt-4 text-base lg:text-lg text-gray-600 leading-relaxed">
              GennovaX giúp người Việt tiếp cận dịch vụ tầm soát, chẩn đoán và
              điều trị cá thể hóa với{" "}
              <strong className="text-blue-800">độ chính xác vượt trội</strong>{" "}
              và <strong className="text-blue-800">chi phí hợp lý</strong>, đặt
              nền móng cho một tương lai chăm sóc sức khỏe chủ động.
            </p>

            {/* Ba cột trụ */}
            <div className="mt-10 space-y-8">
              <PillarItem icon={CpuFill} title="Công nghệ Vượt trội">
                Sử dụng nền tảng Big Data và AI độc quyền để phân tích dữ liệu
                gen, đảm bảo kết quả nhanh và chính xác nhất.
              </PillarItem>
              <PillarItem icon={PersonVcardFill} title="Y học Cá thể hóa">
                Giải mã gen để xây dựng phác đồ phòng ngừa và điều trị riêng
                biệt, phù hợp với hệ gen của từng cá nhân.
              </PillarItem>
              <PillarItem icon={Journals} title="Nghiên cứu Tiên phong">
                Không ngừng R&D và hợp tác quốc tế để phát triển các xét nghiệm
                mới, đón đầu xu hướng y học toàn cầu.
              </PillarItem>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutGennovax;