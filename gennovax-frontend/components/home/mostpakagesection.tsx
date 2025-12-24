"use client";

import Link from "next/link";
import React, { useState } from "react";
import { CalendarCheckFill, InfoCircleFill } from "react-bootstrap-icons";
import ConsultationModal from "./ConsultationModal";

/* =======================
1. TYPE
======================= */
export type PackageDetails = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  mainImageUrl: string;
  smallLogoUrl: string;
  linkto: string;
};
const popularPackagesData: PackageDetails[] = [
  {
    id: "adn-truoc-sinh-10ngay",
    name: "Xét nghiệm ADN Cha Con Trước Sinh (Không xâm lấn)",
    tagline: "Sử dụng mẫu máu mẹ và 1 mẫu bất kỳ của cha",
    description: `Sử dụng 01 mẫu máu mẹ và 01 mẫu bất kỳ của cha (móng tay, tóc, bàn chải...). Áp dụng cho thai từ 7 tuần. Độ chính xác: 99,9999%. Bảo mật tuyệt đối. Trả kết quả sau 3–5 ngày làm việc.`,
    mainImageUrl:
      "https://res.cloudinary.com/da6f4dmql/image/upload/v1764579968/500087657_122108016806870117_710668953486729298_n_wmcxfk.jpg",
    smallLogoUrl: "/images/genbio1.png",
    linkto: "/dich-vu/DNA",
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
    linkto: "/dich-vu/NIPT",
  },
  {
    id: "adn-phap-ly-2-mau-1-2ngay",
    name: "Xét nghiệm ADN (Pháp lý - 2 mẫu)",
    tagline: "Xác định quan hệ huyết thống chuẩn pháp lý",
    description: `Phục vụ thủ tục pháp lý: nhập tịch, định cư nước ngoài... (Dành cho 2 mẫu/1 kết quả). Dùng cho các thủ tục như làm khai sinh, nhận cha/mẹ/con. Độ chính xác cao 99,9999%. Thời gian trả kết quả: 1-2 ngày làm việc.`,
    mainImageUrl:
      "https://res.cloudinary.com/da6f4dmql/image/upload/v1764579968/496942572_122098102940870117_1791812201739354939_n_efjixl.jpg",
    smallLogoUrl: "/images/genbio1.png",
    linkto: "/dich-vu/DNA",
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
    linkto: "/dich-vu/NIPT",
  },
];

/* =======================
   2. DATA
======================= */

/* =======================
   3. PACKAGE CARD
======================= */
const PackageCard: React.FC<{
  pkg: PackageDetails;
  onConsult: () => void;
}> = ({ pkg, onConsult }) => {
  return (
    <div
      className="
        bg-white rounded-3xl shadow-lg overflow-hidden p-4 sm:p-5 lg:p-6
        flex flex-col lg:flex-row gap-4 lg:gap-6
        transition-all duration-300 hover:shadow-2xl
        border-2 lg:border-4 border-blue-300 hover:border-blue-600 hover:-translate-y-1
      "
    >
      {/* LEFT */}
      <div className="w-full lg:w-2/5 flex flex-row lg:flex-col gap-3 flex-shrink-0">
        <div className="w-1/2 lg:w-full">
          <img
            src={pkg.mainImageUrl}
            alt={pkg.name}
            className="w-full h-32 sm:h-40 lg:h-52 object-cover rounded-xl"
          />
        </div>

        <div className="w-[40%] lg:w-full mx-auto flex flex-col justify-center gap-2 lg:mt-4">
  <Link
    href={pkg.linkto}
    className="flex items-center justify-center gap-2 px-3 py-3 rounded-full
      text-[10px] lg:text-sm text-white font-medium
      bg-gradient-to-r from-blue-600 to-blue-900 
      hover:from-blue-700 hover:to-blue-950
      border-2 lg:border-3 border-teal-300/60 
      focus:outline-none focus:ring-2 focus:ring-teal-300/40 transition"
  >
    <InfoCircleFill />
    Tìm hiểu thêm
  </Link>

  <button
    onClick={onConsult}
    className="flex items-center justify-center gap-2 px-3 py-3 rounded-full
      text-[10px] lg:text-sm text-white font-medium
      bg-gradient-to-r from-amber-400 to-orange-500 
      hover:from-amber-500 hover:to-orange-600
      border-2 lg:border-3 border-teal-300/60 
      focus:outline-none focus:ring-2 focus:ring-teal-300/40
      cursor-pointer transition"
  >
    <CalendarCheckFill />
    Đặt hẹn tư vấn
  </button>
</div>

      </div>

      {/* RIGHT */}
      <div className="w-full lg:w-3/5">
        <div className="flex justify-between items-start gap-3 mb-3">
          <h2 className="text-lg lg:text-xl font-bold leading-tight">
            <span className="text-blue-600 text-sm lg:text-xl block">{pkg.name}</span>
            <span className="text-gray-500 text-sm lg:text-base font-normal">
              {pkg.tagline}
            </span>
          </h2>

          <div className=" rounded-lg p-1 w-12 h-12 flex items-center justify-center flex-shrink-0">
            <img
              src={pkg.smallLogoUrl}
              alt="logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="hidden lg:flex border-b-2 border-dashed border-blue-400 mb-3 opacity-50" />

        <p className="hidden lg:flex text-gray-600 text-sm lg:text-base leading-relaxed line-clamp-4">
          {pkg.description}
        </p>
      </div>
    </div>
  );
};

/* =======================
   4. MAIN SECTION
======================= */
const PopularPackages: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  return (
    <section className="py-8 lg:py-16 relative">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/da6f4dmql/image/upload/v1765522605/shutterstock_1530550610_effhxj.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-white/50" />

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-5 lg:mb-10">
          <div className="inline-block px-5 py-2.5 border-3 border-dashed border-blue-400 rounded-full bg-white ">
            <h2 className="text-sm lg:text-3xl font-bold">
              Gói Xét Nghiệm <span className="text-blue-700">Phổ Biến</span>
            </h2>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {popularPackagesData.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              onConsult={() => {
                setSelectedService(pkg.name);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>

        {/* More */}
        <div className="flex justify-center mt-10">
          <Link
            href="/dich-vu"
            className="px-5 py-2.5 border-2 border-blue-500 border-dashed rounded-full text-sm lg:text-xl
              text-blue-600 bg-white hover:bg-blue-50 transition"
          >
            Các gói xét nghiệm khác →
          </Link>
        </div>
      </div>

      {/* ✅ MODAL – CHỈ 1 INSTANCE */}
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultService={selectedService}
      />
    </section>
  );
};

export default PopularPackages;
