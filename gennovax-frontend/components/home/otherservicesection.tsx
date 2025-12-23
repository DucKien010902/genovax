// src/components/OtherServices.tsx
"use client";

import Link from "next/link";
import React from "react";
// Cần cài đặt: npm install react-bootstrap-icons
import Image from "next/image"; // Sử dụng Next/Image để tối ưu ảnh
import {
  ArrowRightCircle,
  BriefcaseFill,
  Flask,
  PeopleFill,
} from "react-bootstrap-icons";

// --- 1. Cấu trúc dữ liệu (TypeScript) ---
export type Service = {
  id: string;
  title: string;
  description: string;
  imageUrl: string; // Ảnh nền của card
  icon: React.ComponentType<{ size?: number | string }>; // Component Icon
  href: string;
};

// --- 2. Dữ liệu mẫu (3 dịch vụ) ---
const serviceData: Service[] = [
  {
    id: "tu-van",
    title: "Tư vấn di truyền",
    description:
      "Kết nối trực tiếp với chuyên gia để giải mã gen, tư vấn chuyên sâu và xây dựng kế hoạch sức khỏe.",
    imageUrl:
      "https://res.cloudinary.com/da6f4dmql/image/upload/v1764730192/dl.beatsnoop.com-3000-O9KATiVLbI_bf17z3.jpg", // Placeholder: Bác sĩ và bệnh nhân
    icon: PeopleFill,
    href: "/gioi-thieu#doi-ngu-va-thanh-tuu",
  },
  {
    id: "doanh-nghiep",
    title: "Chăm sóc thai kì",
    description: "Sàng lọc, chẩn đoán, trước, trong, sau khi mang thai.",
    imageUrl:
      "https://res.cloudinary.com/da6f4dmql/image/upload/v1764742688/gen-h-z7287822248537_47046515784e5e419d59740b0d1edc4d_y0x2mk.jpg", // Placeholder: Họp văn phòng
    icon: BriefcaseFill,
    href: "/services/corporate-solutions",
  },
  {
    id: "nghien-cuu",
    title: "Nghiên cứu & Phát triển",
    description:
      "Hợp tác R&D, ứng dụng công nghệ AI và giải trình tự gen thế hệ mới (NGS) vào y học chính xác.",
    imageUrl:
      "https://genesolutions.vn/wp-content/uploads/2022/11/hoi-nghi-giam-doc-benh-vien_new-1.jpg", // Placeholder: Lab khoa học
    icon: Flask,
    href: "/services/research-development",
  },
];

// --- 3. Component Card Dịch Vụ (Item) ---
const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  const Icon = service.icon;

  return (
    // Card bo tròn, đổ bóng và có hiệu ứng hover
    <div
      className="relative w-full h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg
                 group transition-all duration-300 ease-in-out
                 hover:shadow-2xl hover:scale-[1.03]"
    >
      {/* 1. Hình ảnh nền (Sử dụng Next/Image) */}
      <Image
        src={service.imageUrl}
        alt={service.title}
        layout="fill"
        objectFit="cover"
        unoptimized
        className="transition-transform duration-500 group-hover:scale-110"
      />

      {/* 2. Lớp phủ Gradient (Sáng tạo hơn) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2/4
                   bg-gradient-to-t from-blue-600 via-blue-600/80 to-transparent"
      />

      {/* 3. Nội dung Card (Overlay) */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        {/* Icon (Thiết kế nổi bật) */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center
                     bg-white/30 backdrop-blur-sm border border-white/50 mb-4
                     transition-all duration-300 group-hover:bg-white/50 group-hover:scale-110"
        >
          <Icon size={28} />
        </div>

        {/* Tiêu đề */}
        <h3 className="text-2xl font-bold mb-2">{service.title}</h3>

        {/* Mô tả */}
        <p className="text-sm text-white/90 mb-5">{service.description}</p>

        {/* Nút Tìm hiểu (Thiết kế đẹp hơn) */}
        {/* <Link
          href={service.href}
          onClick={(e)=>{
            e.preventDefault()
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                     font-semibold text-sm text-blue-700 bg-white
                     transition-all duration-300
                     hover:bg-gray-100 hover:pl-6 shadow-md"
        >
          Tìm hiểu
          <ArrowRightCircle className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link> */}
      </div>
    </div>
  );
};

// --- 4. Component Section Chính ---
const OtherServices: React.FC = () => {
  return (
    <section className="py-5 lg:py-15 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề Section (Sáng tạo) */}
        <div className="text-center mb-8 lg:mb-16">
          <div
            className="inline-block px-6 py-3 border-4 border-dashed border-blue-300 rounded-full
                       bg-white/80 backdrop-blur-sm"
          >
            <h2 className="text-sm lg:text-3xl font-bold text-black">
              Dịch Vụ Nổi Bật Khác
              <span className="text-blue-700"> Của GennovaX</span>
            </h2>
          </div>
        </div>

        {/* Grid 3 cột */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceData.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OtherServices;
