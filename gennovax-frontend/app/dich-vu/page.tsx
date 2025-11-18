// src/components/Services.tsx
"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
// Cần cài đặt: npm install react-bootstrap-icons
import {
  CalendarCheckFill,
  CashCoin,
  CheckCircleFill,
  ClockFill,
  InfoCircleFill,
  PersonFill,
  PlusCircleFill,
  Search,
} from "react-bootstrap-icons";

// --- 1. Cấu trúc dữ liệu (TypeScript) ---
export type PackageOption = {
  name: string;
  price: number;
};

export type PackageDetails = {
  id: string;
  name: string;
  description: string;
  targetAudience?: string; // Đối tượng
  returnTime: string; // Thời gian trả kết quả
  price: number; // Giá niêm yết
  options?: PackageOption[]; // Các tùy chọn làm thêm
  category: "NIPT" | "GENE" | "HPV" | "ADN"; // <-- Đã thêm "ADN"
};

// --- 2. Dữ liệu (Từ dữ liệu bạn cung cấp) ---
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value);
};

const ServicesData: PackageDetails[] = [
  // === NIPT ===
  {
    id: "geni-eco",
    name: "Sàng lọc trước sinh không xâm lấn Geni Eco",
    description:
      "Phát hiện lệch bội 3 cặp nhiễm sắc thể thường: 13, 18, 21 liên quan đến 3 hội chứng di truyền: Patau, Edwards, Down.",
    targetAudience: "Thai đơn từ 9 tuần",
    returnTime: "3-5 ngày làm việc",
    price: 1500000,
    category: "NIPT",
  },
  {
    id: "geni-4",
    name: "Sàng lọc trước sinh không xâm lấn Geni 4",
    description:
      "Phát hiện lệch bội 3 cặp NST (13, 18, 21) và lệch bội NST giới tính (Hội chứng Turner (XO)).",
    targetAudience: "Thai đơn từ 9 tuần",
    returnTime: "3-5 ngày làm việc",
    price: 2200000,
    category: "NIPT",
  },
  {
    id: "geni-8",
    name: "Sàng lọc trước sinh không xâm lấn Geni 8",
    description:
      "Phát hiện lệch bội 3 cặp NST (13, 18, 21) và 5 hội chứng NST giới tính (Turner, Tam nhiễm X, Klinefelter, Jacobs, XXXY).",
    targetAudience: "Thai đơn từ 9 tuần",
    returnTime: "3-5 ngày làm việc",
    price: 3000000,
    options: [{ name: "Làm thêm 21 Bệnh gen lặn cho mẹ", price: 3500000 }],
    category: "NIPT",
  },
  {
    id: "geni-23",
    name: "Sàng lọc trước sinh không xâm lấn Geni 23",
    description:
      "Phát hiện lệch bội toàn bộ 22 cặp NST thường và 5 hội chứng NST giới tính.",
    targetAudience: "Thai đơn từ 9 tuần",
    returnTime: "3-5 ngày làm việc",
    price: 4800000,
    options: [{ name: "Làm thêm 21 Bệnh gen lặn cho mẹ", price: 5300000 }],
    category: "NIPT",
  },
  {
    id: "geni-twins",
    name: "Sàng lọc trước sinh không xâm lấn Geni Twins",
    description:
      "Phát hiện lệch bội toàn bộ 22 cặp nhiễm sắc thể thường (ngoài cặp nhiễm sắc thể giới tính).",
    targetAudience: "Thai đôi từ 9 tuần (nên thu mẫu từ 12 tuần)",
    returnTime: "3-5 ngày làm việc",
    price: 4500000,
    options: [{ name: "Làm thêm 21 Bệnh gen lặn cho mẹ", price: 5000000 }],
    category: "NIPT",
  },
  {
    id: "geni-diamond",
    name: "Sàng lọc trước sinh không xâm lấn Geni Diamond",
    description:
      "Phát hiện lệch bội toàn bộ 22 cặp NST thường, 5 hội chứng NST giới tính và 122 hội chứng do mất đoạn/ lặp đoạn nhiễm sắc thể.",
    targetAudience: "Thai đơn từ 9 tuần",
    returnTime: "3-5 ngày làm việc",
    price: 6500000,
    options: [{ name: "Làm thêm 21 Bệnh gen lặn cho mẹ", price: 7000000 }],
    category: "NIPT",
  },
  // === GENE ===
  {
    id: "gene-lan-21",
    name: "Xét nghiệm người lành mang gen lặn gây bệnh 21 gen",
    description:
      "Sàng lọc 21 gen lặn phổ biến, giúp đánh giá nguy cơ di truyền cho con cái.",
    returnTime: "5-7 ngày làm việc",
    price: 2500000,
    category: "GENE",
  },
  {
    id: "gene-lan-chong",
    name: "Xét nghiệm gen lặn (Làm cho chồng)",
    description:
      "Áp dụng khi thai phụ xét nghiệm NIPT Dương Tính với 1 trong 21 gen lặn. Dùng để xét nghiệm cho chồng.",
    returnTime: "5-7 ngày làm việc",
    price: 900000,
    category: "GENE",
  },
  // === HPV ===
  {
    id: "hpv-23",
    name: "Xét nghiệm định type HPV nguy cơ cao (23 type)",
    description:
      "Định type cho 12 types HPV nguy cơ cao (16, 18, 31, 33,...) và 11 types HPV khác (6, 11, 42,...).",
    returnTime: "5-7 ngày làm việc",
    price: 500000,
    category: "HPV",
  },
  {
    id: "hpv-40",
    name: "Xét nghiệm định type HPV nguy cơ cao (40 type)",
    description:
      "Định type cho 20 type HPV nguy cơ cao, 2 type nguy cơ thấp (6, 11) và phát hiện 18 type HPV khác.",
    returnTime: "5-7 ngày làm việc",
    price: 700000,
    category: "HPV",
  },

  // === ADN (DỮ LIỆU MỚI THÊM) ===
  {
    id: "adn-dan-su-1-2ngay",
    name: "Xét nghiệm ADN Cha-Con/Mẹ-Con (Dân sự)",
    description:
      "Xét nghiệm tự nguyện xác định quan hệ cha-con hoặc mẹ-con. (Áp dụng cho 2 mẫu)",
    returnTime: "1-2 ngày",
    price: 2500000,
    category: "ADN",
  },
  {
    id: "adn-dan-su-4h",
    name: "Xét nghiệm ADN Cha-Con/Mẹ-Con (Dân sự - Nhanh)",
    description:
      "Xét nghiệm tự nguyện xác định quan hệ cha-con hoặc mẹ-con. (Áp dụng cho 2 mẫu)",
    returnTime: "04 giờ",
    price: 5000000,
    category: "ADN",
  },
  {
    id: "adn-hanh-chinh-1-2ngay",
    name: "Xét nghiệm ADN (Hành chính)",
    description:
      "Làm giấy khai sinh, nhận cha cho con, nhận con ngoài giá thú. (Áp dụng cho 2 mẫu)",
    returnTime: "1-2 ngày",
    price: 3500000,
    category: "ADN",
  },
  {
    id: "adn-hanh-chinh-4h",
    name: "Xét nghiệm ADN (Hành chính - Nhanh)",
    description:
      "Làm giấy khai sinh, nhận cha cho con, nhận con ngoài giá thú. (Áp dụng cho 2 mẫu)",
    returnTime: "04 giờ",
    price: 6000000,
    category: "ADN",
  },
  {
    id: "adn-phap-ly-2-mau-1-2ngay",
    name: "Xét nghiệm ADN (Pháp lý - 2 mẫu)",
    description:
      "Phục vụ thủ tục pháp lý: nhập tịch, định cư nước ngoài... (Dành cho 2 mẫu/1 kết quả)",
    returnTime: "1-2 ngày",
    price: 4500000,
    category: "ADN",
  },
  {
    id: "adn-phap-ly-2-mau-4h",
    name: "Xét nghiệm ADN (Pháp lý - 2 mẫu - Nhanh)",
    description:
      "Phục vụ thủ tục pháp lý: nhập tịch, định cư nước ngoài... (Dành cho 2 mẫu/1 kết quả)",
    returnTime: "04 giờ",
    price: 7000000,
    category: "ADN",
  },
  {
    id: "adn-phap-ly-3-mau-1-2ngay",
    name: "Xét nghiệm ADN (Pháp lý - 3 mẫu)",
    description:
      "Phục vụ thủ tục pháp lý: nhập tịch, định cư nước ngoài... (Dành cho 3 mẫu/1 kết quả)",
    returnTime: "1-2 ngày",
    price: 5500000,
    category: "ADN",
  },
  {
    id: "adn-phap-ly-3-mau-4h",
    name: "Xét nghiệm ADN (Pháp lý - 3 mẫu - Nhanh)",
    description:
      "Phục vụ thủ tục pháp lý: nhập tịch, định cư nước ngoài... (Dành cho 3 mẫu/1 kết quả)",
    returnTime: "04 giờ",
    price: 8000000,
    category: "ADN",
  },
  {
    id: "adn-nst-y",
    name: "Xét nghiệm ADN theo NST Y",
    description:
      "Ông Nội-Cháu trai; Chú/Bác ruột-Cháu trai; Anh em trai cùng dòng họ nội.",
    returnTime: "1-2 ngày",
    price: 4000000,
    category: "ADN",
  },
  {
    id: "adn-nst-x",
    name: "Xét nghiệm ADN theo NST X",
    description:
      "Bà Nội-Cháu Gái; Chị Em gái cùng bố; chị em gái cùng bố và cùng mẹ.",
    returnTime: "1-3 ngày",
    price: 4500000,
    category: "ADN",
  },
  {
    id: "adn-dong-me",
    name: "Xác định quan hệ huyết thống theo dòng Mẹ",
    description:
      "Anh trai-em gái cùng Mẹ, dì cháu, cậu cháu (xét nghiệm ADN ti thể).",
    returnTime: "3-5 ngày",
    price: 5000000,
    category: "ADN",
  },
  {
    id: "adn-truoc-sinh-10ngay",
    name: "Xét nghiệm ADN Cha Con Trước Sinh (Không xâm lấn)",
    description: "Sử dụng 01 mẫu bố giả định và 01 mẫu máu mẹ.",
    targetAudience: "Thai từ 10 tuần",
    returnTime: "10 ngày làm việc",
    price: 20000000,
    options: [{ name: "Thêm mẫu bố giả định thứ 2 trở đi", price: 3000000 }],
    category: "ADN",
  },
  {
    id: "adn-truoc-sinh-3-5ngay",
    name: "Xét nghiệm ADN Cha Con Trước Sinh (Không xâm lấn - Nhanh)",
    description: "Sử dụng 01 mẫu bố giả định và 01 mẫu máu mẹ.",
    targetAudience: "Thai từ 10 tuần",
    returnTime: "3-5 ngày làm việc",
    price: 25000000,
    options: [{ name: "Thêm mẫu bố giả định thứ 2 trở đi", price: 3000000 }],
    category: "ADN",
  },
  {
    id: "adn-phu-thu-mau-kho",
    name: "Phụ thu xét nghiệm ADN mẫu khó",
    description:
      "Phụ thu áp dụng cho các mẫu đặc biệt như: bàn chải đánh răng, răng sữa, quần lót, tinh dịch...",
    targetAudience: "Phụ thu / 1 mẫu",
    returnTime: "Cộng thêm thời gian xử lý mẫu",
    price: 1000000,
    category: "ADN",
  },
];

// Tính toán dữ liệu cho các nút lọc
const categories = [
  {
    key: "ALL",
    name: "Tất cả",
    count: ServicesData.length,
  },
  {
    key: "NIPT",
    name: "Sàng lọc NIPT",
    count: ServicesData.filter((p) => p.category === "NIPT").length,
  },
  {
    key: "ADN",
    name: "Xét nghiệm ADN", // <-- Nút lọc mới
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

// --- 3. Component Card Gói Xét Nghiệm (Item) ---
const PackageCard: React.FC<{ pkg: PackageDetails }> = ({ pkg }) => {
  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col
                 border-2 border-transparent hover:border-blue-300 hover:-translate-y-1"
    >
      {/* Header Card: Tên và Giá */}
      <div className="p-5 border-b border-gray-100 bg-gray-50">
        <h3 className="text-lg lg:text-xl font-bold text-blue-700 min-h-[3.5rem]">
          {pkg.name}
        </h3>
        <div className="text-2xl font-extrabold text-orange-600 mt-2 flex items-center gap-2">
          <CashCoin />
          {formatCurrency(pkg.price)}
        </div>
      </div>

      {/* Thân Card: Thông tin chi tiết */}
      <div className="p-5 flex-grow">
        {/* Tags Thời gian & Đối tượng */}
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

        {/* Mô tả */}
        <p className="text-sm text-gray-600 mb-4 flex items-start gap-2 min-h-[3rem]">
          <CheckCircleFill className="text-green-500 text-base flex-shrink-0 mt-1" />
          <span>{pkg.description}</span>
        </p>

        {/* Các tùy chọn làm thêm */}
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

      {/* Chân Card: Nút bấm */}
      <div className="p-5 bg-gray-50 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/services/${pkg.id}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm text-white bg-blue-700 hover:bg-blue-600 transition duration-300 shadow-md"
          >
            <InfoCircleFill />
            Chi tiết
          </Link>
          <Link
            href="/contact"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm text-blue-700 bg-white border border-blue-600 hover:bg-blue-50 transition duration-300"
          >
            <CalendarCheckFill />
            Đặt hẹn tư vấn
          </Link>
        </div>
      </div>
    </div>
  );
};

// --- 4. Component Section Chính (ĐÃ NÂNG CẤP) ---
const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("ALL");

  // Logic lọc (giữ nguyên)
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
    <section
      style={{
        backgroundImage: `url('/images/bgrService.jpg')`, // <-- Thay ảnh nền tại đây
      }}
    >
      {/* PHẦN 1: HERO MỚI (Từ ảnh) */}
      <div
        className="max-w-full mx-auto px-4 mt-20 sm:px-6 lg:px-8 pt-16 lg:pt-12 pb-12 text-center bg-blue-700/80"
        style={{
          backgroundImage: `url('/images/bgrHome.jpg')`, // <-- Thay ảnh nền tại đây
        }}
      >
        {/* Tiêu đề */}
        <h1 className="text-4xl lg:text-5xl font-bold text-white">
          Dịch vụ xét nghiệm
        </h1>
        <p className="mt-4 text-lg text-gray-100 max-w-xl mx-auto">
          Tận hưởng dịch vụ y tế gen tiên tiến, chăm sóc sức khỏe chuyên nghiệp.
        </p>

        {/* Thanh Tìm kiếm */}
        <div className="mt-8 relative max-w-4xl mx-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm xét nghiệm (ví dụ: NIPT, ADN, HPV...)"
            className="w-full pl-12 pr-4 py-4 rounded-full border border-white/50
                       bg-white/20 placeholder-white text-white
                       shadow-lg focus:outline-none focus:ring-2 focus:ring-white/80 text-lg"
          />
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-white/70"
            size={20}
          />
        </div>

        {/* Nút Lọc */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300
            ${
              category === cat.key
                ? "bg-white text-blue-700 shadow-lg" // Active
                : "bg-white/20 text-white shadow-md hover:bg-white/30" // Inactive
            }
          `}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* PHẦN 2: DANH SÁCH DỊCH VỤ TRÊN NỀN ẢNH */}
      <div
        className="relative py-14 lg:py-20 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('/images/bgrService.jpg')`, // <-- Thay ảnh nền tại đây
        }}
      >
        {/* Lớp phủ mờ để làm nổi bật Card */}
        <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-sm"></div>

        {/* Container chứa card (phải là relative) */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Lưới 2x2 (hiển thị kết quả) */}
          {filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {filteredPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          ) : (
            // Thông báo không tìm thấy
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
    </section>
  );
};

export default Services;
