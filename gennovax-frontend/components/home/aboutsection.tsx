// src/components/AboutGennovax.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
// Cần cài đặt: npm install react-bootstrap-icons
import {
  ArrowRight,
  CpuFill,
  Journals,
  PersonVcardFill,
} from "react-bootstrap-icons";

// --- 1. Component "Cột trụ" (Pillar) ---
// Component con để tái sử dụng cho 3 giá trị cốt lõi
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

// --- 2. Component "Về GennovaX" (Chính) ---
const AboutGennovax: React.FC = () => {
  // Placeholder ảnh lab, bạn hãy thay bằng ảnh thực tế
  const imageUrl = "/images/aboutGX.jpg";

  return (
    <section className="bg-white py-10 lg:py-15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Cột Trái: Hình ảnh (Sáng tạo) */}
          {/* Cột Trái: Hình ảnh + nút nằm dọc */}
          <div className="flex flex-col items-start gap-6">
            <span className="text-xl font-bold uppercase text-blue-600">
              VỀ GENNOVAX
            </span>
            <div className="w-full h-96 relative rounded-3xl shadow-xl overflow-hidden">
              <Image
                src={imageUrl}
                alt="Phòng thí nghiệm GennovaX"
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full
               font-semibold text-white bg-blue-600
               hover:bg-blue-700 transition duration-300
               shadow-lg hover:shadow-blue-500/50 transform hover:scale-105"
            >
              Khám phá hành trình của chúng tôi
              <ArrowRight />
            </Link>
          </div>

          {/* Cột Phải: Nội dung chi tiết */}
          <div>
            <h2 className="mt-2 text-2xl lg:text-2xl font-bold text-gray-900 leading-tight">
              Tiên phong Tương lai Y học qua Lăng kính Di truyền
            </h2>

            <p className="mt-4 text-lg text-gray-600">
              Sứ mệnh của chúng tôi là ứng dụng công nghệ giải trình tự gen
              (NGS) thế hệ mới và Trí tuệ nhân tạo (AI) để cung cấp các giải
              pháp y học chính xác.
            </p>
            <p className="mt-3 text-base text-gray-600">
              GennovaX giúp người Việt tiếp cận dịch vụ tầm soát, chẩn đoán và
              điều trị cá thể hóa với{" "}
              <strong className="text-gray-800">độ chính xác vượt trội</strong>{" "}
              và <strong className="text-gray-800">chi phí hợp lý</strong>, đặt
              nền móng cho một tương lai chăm sóc sức khỏe chủ động.
            </p>

            {/* Ba cột trụ (Chi tiết & Sáng tạo hơn checklist) */}
            <div className="mt-8 space-y-6">
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

            {/* Link xem thêm */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutGennovax;
