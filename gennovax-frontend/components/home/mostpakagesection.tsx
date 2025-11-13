// src/components/PopularPackages.tsx
"use client";

import Link from "next/link";
import React from "react";
// Cần cài đặt: npm install react-bootstrap-icons
import { CalendarCheckFill, InfoCircleFill } from "react-bootstrap-icons";

// --- 1. Cấu trúc dữ liệu (TypeScript) ---
export type PackageDetails = {
  id: string;
  name: string; // Tên chính (màu xanh)
  tagline: string; // Tên phụ (màu xám)
  description: string;
  mainImageUrl: string; // Ảnh lớn bên trái
  smallLogoUrl: string; // Logo nhỏ bên phải
};

// --- 2. Dữ liệu mẫu (4 gói) ---
const popularPackagesData: PackageDetails[] = [
  {
    id: "geni-eco",
    name: "Geni Eco",
    tagline: "Sàng lọc trước sinh không xâm lấn cơ bản",
    description:
      "Phát hiện lệch bội 3 cặp nhiễm sắc thể thường 13, 18, 21 liên quan đến 3 hội chứng di truyền: Patau, Edwards, Down. Áp dụng cho thai đơn từ 9 tuần tuổi. Thời gian trả kết quả: 3–5 ngày làm việc.",
    mainImageUrl: "/images/NIPT.jpg",
    // 'https://novagen.vn/wp-content/uploads/2024/04/nipt-geni-eco.jpg',
    smallLogoUrl: "/images/genbio1.png",
  },
  {
    id: "geni-4",
    name: "Geni 4",
    tagline: "Sàng lọc mở rộng lệch bội giới tính",
    description:
      "Phát hiện lệch bội 3 cặp NST thường (13, 18, 21) và lệch bội NST giới tính liên quan đến hội chứng Turner (XO). Áp dụng cho thai đơn từ 9 tuần. Thời gian trả kết quả: 3–5 ngày làm việc.",
    mainImageUrl: "/images/NIPT.jpg",
    // 'https://novagen.vn/wp-content/uploads/2024/04/nipt-geni-4.jpg',
    smallLogoUrl: "/images/genbio1.png",
  },
  {
    id: "geni-8",
    name: "Geni 8",
    tagline: "Sàng lọc nâng cao cho 8 loại lệch bội",
    description:
      "Phát hiện lệch bội NST thường (13, 18, 21) và các hội chứng giới tính: Turner (XO), tam nhiễm X (XXX), Klinefelter (XXY), Jacobs (XYY), Klinefelter mở rộng (XXXY). Áp dụng cho thai đơn từ 9 tuần. Có thể làm thêm 21 bệnh gen lặn cho mẹ. Thời gian trả kết quả: 3–5 ngày làm việc.",
    mainImageUrl: "/images/NIPT.jpg",
    // 'https://novagen.vn/wp-content/uploads/2024/04/nipt-geni-8.jpg',
    smallLogoUrl: "/images/genbio1.png",
  },
  {
    id: "geni-23",
    name: "Geni 23",
    tagline: "Sàng lọc toàn bộ 23 cặp nhiễm sắc thể",
    description:
      "Phát hiện lệch bội toàn bộ 22 cặp NST thường và 5 hội chứng giới tính: Turner (XO), tam nhiễm X (XXX), Klinefelter (XXY), Klinefelter mở rộng (XXXY), Jacobs (XYY). Áp dụng cho thai đơn từ 9 tuần. Có thể làm thêm 21 bệnh gen lặn cho mẹ. Thời gian trả kết quả: 3–5 ngày làm việc.",
    mainImageUrl: "/images/NIPT.jpg",
    // 'https://novagen.vn/wp-content/uploads/2024/04/nipt-geni-23.jpg',
    smallLogoUrl: "/images/genbio1.png",
  },
  // {
  //   id: 'geni-twins',
  //   name: 'Geni Twins',
  //   tagline: 'Sàng lọc cho thai đôi',
  //   description:
  //     'Phát hiện lệch bội toàn bộ 22 cặp NST thường (không bao gồm NST giới tính). Áp dụng cho thai đôi từ 9 tuần (khuyến nghị thu mẫu từ 12 tuần). Có thể làm thêm 21 bệnh gen lặn cho mẹ. Thời gian trả kết quả: 3–5 ngày làm việc.',
  //   mainImageUrl:
  //   '/images/NIPT.jpg',
  //     // 'https://novagen.vn/wp-content/uploads/2024/04/nipt-geni-twins.jpg',
  //   smallLogoUrl: '/images/genbio1.png',
  // },
  // {
  //   id: 'geni-diamond',
  //   name: 'Geni Diamond',
  //   tagline: 'Gói cao cấp phát hiện mở rộng 122 hội chứng',
  //   description:
  //     'Phát hiện lệch bội toàn bộ 22 cặp NST thường và 5 hội chứng giới tính (Turner, XXX, XXY, XXXY, XYY). Đồng thời phát hiện 122 hội chứng do mất đoạn/lặp đoạn nhiễm sắc thể. Áp dụng cho thai đơn từ 9 tuần. Thời gian trả kết quả: 3–5 ngày làm việc.',
  //   mainImageUrl:
  //   '/images/NIPT.jpg',
  //     // 'https://novagen.vn/wp-content/uploads/2024/04/nipt-geni-diamond.jpg',
  //   smallLogoUrl: '/images/genbio1.png',
  // },
];

// --- 3. Component Card Gói Xét Nghiệm (Item) ---
const PackageCard: React.FC<{ pkg: PackageDetails }> = ({ pkg }) => {
  return (
    // Card lớn bo tròn, đổ bóng, padding nhỏ hơn
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden p-5 lg:p-6 flex flex-col lg:flex-row gap-5 lg:gap-6 items-start transition-all duration-300 hover:shadow-2xl">
      {/* Cột trái: Hình ảnh + Nút bấm */}
      <div className="w-full lg:w-2/5 flex-shrink-0">
        <img
          src={pkg.mainImageUrl}
          alt={pkg.name}
          className="w-full h-30 lg:h-50 object-cover rounded-2xl" // Ảnh cao hơn một chút
        />
        {/* Nút bấm xếp dọc */}
        <div className="flex flex-col gap-3 mt-4">
          <Link
            // href={`/services/${pkg.id}`}
            href={`/dich-vu/NIPT`}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm text-white bg-blue-800 hover:bg-blue-700 transition duration-300 shadow-md"
          >
            <InfoCircleFill />
            Tìm hiểu thêm
          </Link>
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm text-white bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 transition duration-300 shadow-md"
          >
            <CalendarCheckFill />
            Đặt hẹn tư vấn
          </Link>
        </div>
      </div>

      {/* Cột phải: Thông tin */}
      <div className="w-full lg:w-3/5">
        {/* Header: Title + Logo nhỏ */}
        <div className="flex justify-between items-start gap-4 mb-3">
          {/* Cỡ chữ tiêu đề nhỏ hơn */}
          <h2 className="text-xl lg:text-2xl font-bold">
            <span className="text-blue-600">{pkg.name}</span>
            <span className="text-gray-600"> – {pkg.tagline}</span>
          </h2>
          {/* Logo nhỏ hơn */}
          <div className="bg-white border border-gray-200 rounded-lg p-1 w-16 h-16 flex-shrink-0 flex items-center justify-center">
            <img
              src={pkg.smallLogoUrl}
              alt={`${pkg.name} logo`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>

        {/* Dấu chấm ... */}
        <div className="w-full h-1 border-b-4 border-dashed border-blue-400 mb-4" />

        {/* Mô tả (cỡ chữ nhỏ hơn) */}
        <p className="text-gray-600 text-sm lg:text-base mb-6">
          {pkg.description}
        </p>
      </div>
    </div>
  );
};

// --- 4. Component Section Chính ---
const PopularPackages: React.FC = () => {
  return (
    // Giảm padding section một chút
    <section className="py-10 lg:py-15 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề Section */}
        <div className="text-center mb-10 lg:mb-12">
          {/* Dấu ngã ~ (SVG) */}
          <svg
            className="mx-auto h-6 w-auto text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 400 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <path d="M0 10 Q 20 0, 40 10 T 80 10 T 120 10 T 160 10 T 200 10 T 240 10 T 280 10 T 320 10 T 360 10 T 400 10" />
          </svg>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mt-2">
            GÓI XÉT NGHIỆM PHỔ BIẾN
          </h1>
        </div>

        {/* Grid 2x2 (giảm gap) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {popularPackagesData.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularPackages;
