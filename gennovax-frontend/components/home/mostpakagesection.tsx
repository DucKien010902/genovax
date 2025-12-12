// src/components/PopularPackages.tsx
"use client";

import Link from "next/link";
import React, { useState } from "react";
// Cần cài đặt: npm install react-bootstrap-icons
import { CalendarCheckFill, InfoCircleFill } from "react-bootstrap-icons";
import ConsultationModal from "./ConsultationModal";

// --- 1. Cấu trúc dữ liệu (TypeScript) ---
export type PackageDetails = {
  id: string;
  name: string; // Tên chính (màu xanh)
  tagline: string; // Tên phụ (màu xám)
  description: string;
  mainImageUrl: string; // Ảnh lớn bên trái
  smallLogoUrl: string; // Logo nhỏ bên phải
  linkto: string
};

// --- 2. Dữ liệu mẫu ---
const popularPackagesData: PackageDetails[] = [
  {
    id: "adn-truoc-sinh-10ngay",
    name: "Xét nghiệm ADN Cha Con Trước Sinh (Không xâm lấn)",
    tagline: "Sử dụng mẫu máu mẹ và 1 mẫu bất kỳ của cha",
    description: `Sử dụng 01 mẫu máu mẹ và 01 mẫu bất kỳ của cha (móng tay, tóc, bàn chải...). Áp dụng cho thai từ 7 tuần. Độ chính xác: 99,9999%. Bảo mật tuyệt đối. Trả kết quả sau 3–5 ngày làm việc.`,
    mainImageUrl:
      "https://res.cloudinary.com/da6f4dmql/image/upload/v1764579968/500087657_122108016806870117_710668953486729298_n_wmcxfk.jpg",
    smallLogoUrl: "/images/genbio1.png",
    linkto:'/dich-vu/DNA'
  },
  {
    id: "geni-8",
    name: "Xét nghiệm sàng lọc NIPT - Geni 8",
    tagline: "Sàng lọc trước sinh không xâm lấn",
    description:
      "Phát hiện lệch bội 3 cặp NST (13, 18, 21) và 5 hội chứng NST giới tính (Turner, Tam nhiễm X, Klinefelter, Jacobs, XXXY). Dành cho thai đơn từ 9 tuần. Kết quả có từ sau 3-5 ngày làm việc.",
    mainImageUrl:
      "https://res.cloudinary.com/da6f4dmql/image/upload/v1764579968/496506308_122100963794870117_1449912006591196456_n_j34mr5.jpg",
    smallLogoUrl: "/images/genbio1.png",
    linkto:'/dich-vu/NIPT'
  },
  {
    id: "adn-phap-ly-2-mau-1-2ngay",
    name: "Xét nghiệm ADN (Pháp lý - 2 mẫu)",
    tagline: "Xác định quan hệ huyết thống chuẩn pháp lý",
    description: `Phục vụ thủ tục pháp lý: nhập tịch, định cư nước ngoài... (Dành cho 2 mẫu/1 kết quả). Dùng cho các thủ tục như làm khai sinh, nhận cha/mẹ/con. Độ chính xác cao 99,9999%. Thời gian trả kết quả: 1-2 ngày làm việc.`,
    mainImageUrl:
      "https://res.cloudinary.com/da6f4dmql/image/upload/v1764579968/496942572_122098102940870117_1791812201739354939_n_efjixl.jpg",
    smallLogoUrl: "/images/genbio1.png",
    linkto:'/dich-vu/DNA'
  },
  {
    id: "geni-23",
    name: "Xét nghiệm sàng lọc NIPT - Geni 23",
    tagline: "Sàng lọc toàn bộ 23 cặp nhiễm sắc thể",
    description:
      "Phát hiện lệch bội toàn bộ 22 cặp NST thường và 5 hội chứng giới tính: Turner (XO), tam nhiễm X (XXX), Klinefelter (XXY), Klinefelter mở rộng (XXXY), Jacobs (XYY). Áp dụng cho thai đơn từ 9 tuần. Thời gian trả kết quả: 3–5 ngày làm việc.",
    mainImageUrl:
      "https://res.cloudinary.com/da6f4dmql/image/upload/v1764579968/571157271_122148617522870117_6835087446376933824_n_tbex8y.jpg",
    smallLogoUrl: "/images/genbio1.png",
    linkto:'/dich-vu/NIPT'
  },
];

// --- 3. Component Card Gói Xét Nghiệm (Item) ---
const PackageCard: React.FC<{ pkg: PackageDetails }> = ({ pkg }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State quản lý Modal
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  return (
    <div
  className="
    bg-white rounded-3xl shadow-lg overflow-hidden p-4 sm:p-5 lg:p-6 
    flex flex-col lg:flex-row gap-4 lg:gap-6 items-start 
    transition-all duration-300 hover:shadow-2xl

    border-4 border-blue-300      /* viền xanh */
    hover:-translate-y-1             /* nổi lên nhẹ khi hover */
    hover:border-blue-600            /* viền đậm hơn khi hover */
  "
>

      {/* --- CỘT TRÁI: Ảnh + Nút bấm --- */}
      {/* Mobile: Flex-row (ngang hàng). Desktop: Flex-col (dọc) */}
      <div className="w-full lg:w-2/5 flex flex-row lg:flex-col gap-3 lg:gap-0 flex-shrink-0">
        {/* 1. Hình ảnh */}
        {/* Mobile: 50% width. Desktop: 100% width */}
        <div className="w-1/2 lg:w-full">
          <img
            src={pkg.mainImageUrl}
            alt={pkg.name}
            // Mobile: h-full (để khớp với cụm nút bên cạnh), object-cover để không méo.
            // Desktop: height cố định hoặc auto.
            className="w-full h-32 sm:h-40 lg:h-52 object-cover rounded-xl lg:rounded-2xl"
          />
        </div>

        {/* 2. Cụm nút bấm */}
        {/* Mobile: 50% width, căn giữa dọc. Desktop: 100% width, margin top */}
        <div className="w-1/2 lg:w-full flex flex-col justify-center gap-2 lg:gap-3 lg:mt-4">
          <Link
            href={pkg.linkto}
            // Mobile: text-xs, py-2 (nhỏ gọn). Desktop: text-sm, py-2.5
            // Gradient Xanh cho nút Tìm hiểu thêm
            className="flex items-center justify-center gap-1.5 lg:gap-2 px-2 lg:px-4 py-2 lg:py-2.5 rounded-full font-medium text-xs lg:text-sm text-white bg-gradient-to-r from-blue-600 to-blue-900 hover:from-blue-700 hover:to-blue-950 transition duration-300 shadow-md text-center"
          >
            <InfoCircleFill className="text-xs lg:text-sm" />
            Tìm hiểu thêm
          </Link>

          <Link
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-1.5 lg:gap-2 px-2 lg:px-4 py-2 lg:py-2.5 rounded-full font-medium text-xs lg:text-sm text-white bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 transition duration-300 shadow-md text-center"
          >
            <CalendarCheckFill />
            Đặt hẹn tư vấn
          </Link>
        </div>
      </div>

      {/* --- CỘT PHẢI: Thông tin --- */}
      <div className="w-full lg:w-3/5">
        {/* Header: Title + Logo nhỏ */}
        <div className="flex justify-between items-start gap-3 mb-2 lg:mb-3">
          <h2 className="text-lg lg:text-xl font-bold leading-tight h-[100px] md:h-[150px]">
            <span className="text-blue-600 block sm:inline">{pkg.name}</span>
            <span className="text-gray-500 text-sm lg:text-lg font-normal block sm:inline sm:ml-1">
              {/* Ẩn dấu gạch ngang trên mobile cho gọn */}
              <span className="hidden sm:inline">– </span>
              {pkg.tagline}
            </span>
          </h2>

          {/* Logo nhỏ */}
          <div className="bg-white border border-gray-200 rounded-lg p-1 w-12 h-12 lg:w-16 lg:h-16 flex-shrink-0 flex items-center justify-center">
            <img
              src={pkg.smallLogoUrl}
              alt={`${pkg.name} logo`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>

        {/* Dấu chấm trang trí */}
        <div className="w-full h-1 border-b-2 lg:border-b-4 border-dashed border-blue-400 mb-3 lg:mb-4 opacity-50" />

        {/* Mô tả */}
        <p className="text-gray-600  text-sm lg:text-base leading-relaxed line-clamp-4 lg:line-clamp-none">
          {pkg.description}
        </p>
      </div>
      <ConsultationModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

// --- 4. Component Section Chính ---
const PopularPackages: React.FC = () => {
  return (
    <section
      className="py-8 lg:py-16 relative"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/da6f4dmql/image/upload/v1765522605/shutterstock_1530550610_effhxj.jpg')",
        }}
      ></div>

      {/* Overlay mờ để làm nổi nội dung */}
      <div className="absolute inset-0 bg-white/40 "></div>

      {/* Nội dung phía trên */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề Section */}
        <div className="text-center mb-4 lg:mb-12">
          <div
            className="inline-block px-6 py-3 border-4 border-dashed border-blue-300 rounded-full
                       bg-white hover:bg-blue-50 backdrop-blur-sm"
          >
            <h2 className="text-sm lg:text-3xl font-bold text-black">
              GÓI XÉT NGHIỆM<span className="text-blue-700"> PHỔ BIẾN</span>
            </h2>
          </div>
        </div>

        {/* Grid Packages */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8">
          {popularPackagesData.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>

        {/* Nút Xem thêm */}
        <div className="relative flex justify-center mt-10">
          <Link
            href="/dich-vu"
            className="px-8 py-2.5 text-sm md:text-xl border-2 border-blue-500 border-dashed rounded-full text-blue-600 bg-white/80 font-medium hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 flex items-center gap-2 group"
          >
            Các gói xét nghiệm khác
            <span className="text-blue-500 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularPackages;

