// src/components/Services.tsx
"use client";

import React, { useMemo, useState } from "react";
import {
  CalendarCheckFill,
  CashCoin,
  CheckCircleFill,
  ClockFill,
  PersonFill,
  PlusCircleFill,
  Search,
} from "react-bootstrap-icons";
import { ServicesData } from "@/data/service";
import { PackageDetails } from "@/types/service";
import ConsultationModal from "@/components/home/ConsultationModal";

// --- 1. Helper Functions ---
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value);
};

const categories = [
  { key: "ALL", name: "Tất cả", count: ServicesData.length },
  {
    key: "NIPT",
    name: "Sàng lọc NIPT",
    count: ServicesData.filter((p) => p.category === "NIPT").length,
  },
  {
    key: "ADN",
    name: "Xét nghiệm ADN",
    count: ServicesData.filter((p) => p.category === "ADN").length,
  },
  {
    key: "GENE",
    name: "Gen lặn",
    count: ServicesData.filter((p) => p.category === "GENE").length,
  },
  {
    key: "HPV",
    name: "Sàng lọc HPV",
    count: ServicesData.filter((p) => p.category === "HPV").length,
  },
];

// --- 2. Component Card (Stateless - Nhẹ hơn rất nhiều) ---
// Card này không còn chứa Modal nữa, chỉ nhận lệnh onBook
const PackageCard: React.FC<{
  pkg: PackageDetails;
  onBook: (pkg: PackageDetails) => void;
}> = ({ pkg, onBook }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col border-2 border-transparent hover:border-blue-300 hover:-translate-y-1 h-full">
      {/* Header Card */}
      <div className="p-5 border-b border-gray-100 bg-gray-50">
        <h3 className="text-lg lg:text-xl font-bold text-blue-700 min-h-[3.5rem] line-clamp-2">
          {pkg.name}
        </h3>
        <div className="text-2xl font-extrabold text-orange-600 mt-2 flex items-center gap-2">
          <CashCoin />
          {formatCurrency(pkg.price)}
        </div>
      </div>

      {/* Thân Card */}
      <div className="p-5 flex-grow">
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
            <ClockFill className="text-blue-500" />
            <span>{pkg.returnTime}</span>
          </div>
          {pkg.targetAudience && (
            <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
              <PersonFill className="text-green-500" />
              <span>{pkg.targetAudience}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4 flex items-start gap-2 min-h-[3rem]">
          <CheckCircleFill className="text-green-500 text-base flex-shrink-0 mt-1" />
          <span className="line-clamp-3">{pkg.description}</span>
        </p>

        {pkg.options &&
          pkg.options.map((opt) => (
            <div
              key={opt.name}
              className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-300 rounded-r-lg"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-800">
                <PlusCircleFill />
                <span>{opt.name}</span>
              </div>
              <div className="text-base font-bold text-orange-500 mt-1 pl-6">
                {formatCurrency(opt.price)}
              </div>
            </div>
          ))}
      </div>

      {/* Chân Card */}
      <div className="p-5 bg-gray-50 border-t border-gray-100">
        {/* Dùng button thay vì Link để tránh điều hướng sai và tăng performance */}
        <button
          onClick={() => onBook(pkg)}
          className="w-full sm:w-auto mx-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-medium text-sm text-blue-700 bg-white border border-blue-600 hover:bg-blue-50 transition duration-300 cursor-pointer"
        >
          <CalendarCheckFill />
          Đặt hẹn tư vấn
        </button>
      </div>
    </div>
  );
};

// --- 3. Component Section Chính ---
const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("ALL");

  // State quản lý Modal duy nhất
  // Thay vì boolean, ta lưu luôn gói đang chọn (hoặc null nếu đóng)
  const [selectedPkg, setSelectedPkg] = useState<PackageDetails | null>(null);

  const filteredPackages = useMemo(() => {
    return ServicesData.filter((pkg) => {
      if (category !== "ALL" && pkg.category !== category) return false;
      if (
        searchTerm !== "" &&
        !pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;
      return true;
    });
  }, [searchTerm, category]);

  return (
    <section>
      {/* PHẦN 1: HERO */}
      <div
        className="bg-scale max-w-full mx-auto px-4 lg:px-8 pt-8 lg:pt-16 pb-6 lg:pb-12 text-center  bg-cover bg-center bg-no-repeat relative"
        style={
          {
            "--bg-url": `url('https://res.cloudinary.com/da6f4dmql/image/upload/v1765357565/dna-strand_1_1_1_1_icogbd.png')`,
          } as React.CSSProperties
        }
      >
        <div className="absolute inset-0 bg-black/50" />{" "}
        {/* Overlay tối để chữ rõ hơn */}
        <div className="relative z-10">
          <h1 className="text-3xl lg:text-5xl font-bold text-white drop-shadow-md">
            Dịch vụ xét nghiệm
          </h1>
          <p className="mt-4 text-2sm lg:text-lg text-gray-100 max-w-xl mx-auto drop-shadow-sm">
            Tận hưởng dịch vụ y tế gen tiên tiến, chăm sóc sức khỏe chuyên
            nghiệp.
          </p>

          {/* Thanh Tìm kiếm */}
          <div className="mt-8 relative max-w-4xl mx-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm xét nghiệm (ví dụ: NIPT, ADN, HPV...)"
              className="w-full pl-12 pr-4 py-4 rounded-full border border-white/50 bg-white/20 placeholder-white text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-white/80 text-sm lg:text-lg backdrop-blur-sm transition-all"
            />
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-white/90"
              size={20}
            />
          </div>

          {/* Nút Lọc */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`px-3 lg:px-5 py-1.5 lg:py-2.5 rounded-full font-semibold text-sm transition-all duration-300 border border-white/20
                ${
                  category === cat.key
                    ? "bg-white text-blue-700 shadow-xl scale-105"
                    : "bg-black/30 text-white hover:bg-white/20 backdrop-blur-sm"
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PHẦN 2: DANH SÁCH DỊCH VỤ */}
      <div className="relative py-10 lg:py-20 bg-gray-50">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {filteredPackages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  // Truyền hàm callback xuống con
                  onBook={(p) => setSelectedPkg(p)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-6 bg-white rounded-lg shadow-xl max-w-lg mx-auto">
              <h3 className="text-xl font-semibold text-gray-700">
                Không tìm thấy xét nghiệm phù hợp
              </h3>
              <p className="text-gray-500 mt-2">
                Vui lòng thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- DUY NHẤT 1 MODAL Ở ĐÂY --- */}
      {/* Chỉ render modal khi có gói được chọn */}
      <ConsultationModal
        isOpen={!!selectedPkg} // true nếu selectedPkg khác null
        onClose={() => setSelectedPkg(null)}
        // Nếu Modal của bạn hỗ trợ nhận tên dịch vụ để điền sẵn form, hãy truyền vào đây
        // serviceName={selectedPkg?.name}
      />
    </section>
  );
};

export default Services;
