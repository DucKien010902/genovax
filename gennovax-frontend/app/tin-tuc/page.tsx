"use client";

import React, { useState } from "react";
// import Image from 'next/image'; // Nên dùng 'next/image' khi deploy
import {
  Calendar,
  Tag,
  ArrowRight,
  Facebook,
  Twitter,
  Link as LinkIcon,
} from "lucide-react";

// --- 1. DỮ LIỆU MOCK (4 TIN TỨC) ---
const newsData = [
  {
    id: 1,
    title:
      "triSure Procare & triSure: Sàng lọc thêm 5 hội chứng vi mất đoạn phổ biến nhất cho thai, giá không đổi.",
    date: "Ngày 19/11/2025",
    tags: ["Blog", "Tin nổi bật", "Tin truyền thông"],
    image:
      "https://image.plo.vn/w1000/Uploaded/2025/wpdhnwcaj/2021_03_15/giai-nhat-benh-vien-y-duoc_trds.jpg.webp", // Ảnh placeholder
    excerpt:
      "Nhằm mang đến cho bác sĩ và thai phụ những giải pháp sàng lọc trước sinh toàn diện, GennovaX chính thức thông báo nâng cấp hai gói NIPT triSure và triSure Procare bằng cách tích hợp thêm các hội chứng vi mất đoạn phổ biến.",
  },
  {
    id: 2,
    title:
      "GennovaX và Raffles Medical Group ký kết hợp tác chiến lược trong nghiên cứu thử nghiệm lâm sàng.",
    date: "Ngày 19/11/2025",
    tags: ["Tin nổi bật", "Tin truyền thông"],
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0FDDe3s2SmMGutrNPa_-ZRbu4SjKTqOchnw&s",
    excerpt:
      "Sáng ngày 22/10/2025, GennovaX và Raffles Medical Group chính thức ký kết biên bản ghi nhớ (MOU) về hợp tác trong tuyển chọn bệnh nhân tham gia các chương trình thử nghiệm lâm sàng quốc tế. Đây là lần đầu tiên...",
  },
  {
    id: 3,
    title:
      "BẢN TIN THÁNG 10/2025: CHUYỂN ĐỘNG CỦA NỀN Y HỌC CHÍNH XÁC TẠI CHÂU Á.",
    date: "Ngày 19/11/2025",
    tags: ["Tin nổi bật", "Tin truyền thông"],
    image: "https://placehold.co/600x400/F3E5F5/4A148C?text=Y+Học+Chính+Xác",
    excerpt:
      "Bản tin mang đến cho đội ngũ y tế và các chuyên gia trong lĩnh vực di truyền, ung thư học và y học chính xác những thông tin cập nhật nhất về nghiên cứu khoa học, đổi mới công nghệ và hợp tác lâm sàng.",
  },
  {
    id: 4,
    title:
      "Dấu ấn GennovaX tại Hội nghị Khoa học Thường niên Bệnh viện Hùng Vương lần 10.",
    date: "Ngày 19/11/2025",
    tags: ["Tin nổi bật", "Tin truyền thông"],
    image: "https://placehold.co/600x400/FFF3E0/E65100?text=Hội+Nghị+Khoa+Học",
    excerpt:
      'Ngày 18/10/2025, tại Khách sạn Sheraton Sài Gòn, Bệnh viện Hùng Vương long trọng tổ chức Hội nghị Khoa học Thường niên lần thứ 10 với chủ đề "Góc nhìn mới - Bệnh lý phụ khoa và Thai kỳ nguy cơ cao".',
  },
];

const categories = ["Tất cả", "Blog", "Tin nổi bật", "Tin truyền thông"];

// --- 2. COMPONENT HEADER ---
const NewsHeader = () => (
  <div className="relative w-full bg-[#0D47A1] pt-16 pb-12 text-center shadow-lg">
    {/* Ảnh nền chìm (tùy chọn) */}
    <div className="absolute inset-0 overflow-hidden opacity-10">
      {/* Có thể thêm pattern hoặc ảnh DNA background ở đây */}
    </div>

    <div className="relative z-10 container mx-auto px-4">
      <h1 className="text-3xl font-bold uppercase tracking-wide text-white md:text-4xl">
        TIN TỨC Y TẾ NỔI BẬT
      </h1>
    </div>

    {/* Dải trang trí đa sắc dưới chân header (giống ảnh) */}
    <div className="absolute bottom-0 left-0 h-2 w-full flex">
      <div className="h-full w-1/4 bg-[#4DD0E1]"></div>
      <div className="h-full w-1/4 bg-[#FFCA28]"></div>
      <div className="h-full w-1/4 bg-[#8BC34A]"></div>
      <div className="h-full w-1/4 bg-[#00ACC1]"></div>
    </div>
  </div>
);

// --- 3. COMPONENT THẺ TIN TỨC (CARD) ---
const NewsCard = ({ item }: { item: (typeof newsData)[0] }) => {
  return (
    <div className="group w-full rounded-2xl bg-white shadow-md p-4 transition hover:shadow-lg cursor-pointer">
      {/* ==== HÀNG 1: Ảnh + TAG + TITLE ==== */}
      <div className="flex w-full gap-4">
        {/* Ảnh bên trái */}
        <div className="w-1/2 aspect-[16/10] rounded-xl overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105 "
          />
        </div>

        {/* Tag + Title */}
        <div className="w-1/2 flex flex-col justify-start">
          {/* Tags */}
          <div className="flex items-center gap-1 text-lg text-gray-500 mb-1">
            <Tag className="w-6 h-6" />
            <span className="line-clamp-1">{item.tags.join(", ")}</span>
          </div>

          {/* Title giống mẫu – cỡ lớn, xanh nhạt */}
          <h2 className="mb-3 text-2xl  leading-tight font-[400] text-[#00ACC1] transition-colors  md:text-2xl line-clamp-4">
            {item.title}
          </h2>
        </div>
      </div>

      {/* ===== HÀNG 2: DATE + CONTENT ===== */}
      <div className="mt-4 w-full">
        {/* Date */}
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Calendar className="w-4 h-4 mr-1" />
          {item.date}
        </div>

        {/* Nội dung mô tả full width */}
        <p className="text-gray-600 leading-relaxed text-base mb-4 line-clamp-4">
          {item.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          {/* Social */}
          <div className="flex gap-2">
            <button className="flex items-center justify-center w-7 h-7 rounded-full bg-[#3b5998] text-white hover:opacity-80 transition">
              <Facebook size={14} />
            </button>
            <button className="flex items-center justify-center w-7 h-7 rounded-full bg-black text-white hover:opacity-80 transition">
              <Twitter size={14} />
            </button>
            <button className="flex items-center justify-center w-7 h-7 rounded-full bg-[#0077b5] text-white hover:opacity-80 transition">
              <LinkIcon size={14} />
            </button>
          </div>

          {/* Button */}
          <button className="flex items-center gap-1 font-semibold rounded-full bg-[#00BCD4] text-white px-5 py-2 hover:bg-[#0097A7] transition">
            Đọc thêm
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 4. TRANG CHÍNH ---
export default function MedicalNewsPage() {
  const [activeTab, setActiveTab] = useState("Tin nổi bật");

  return (
    <main className="min-h-screen bg-gray-50 mt-20">
      {/* Header */}
      <NewsHeader />

      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 py-4 md:gap-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`relative text-base font-medium transition-colors duration-200 hover:text-[#00ACC1]
                  ${activeTab === cat ? "text-[#00ACC1]" : "text-gray-600"}
                `}
              >
                {cat}
                {activeTab === cat && (
                  <span className="absolute -bottom-4 left-0 h-[3px] w-full bg-[#00ACC1] rounded-t-sm"></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Danh sách tin tức */}
      <div className="container mx-auto px-25 py-6 pb-15 max-w-8xl">
        {/* Hiệu ứng đường diềm răng cưa (tượng trưng) */}
        <div className="mb-6 w-full border-b-2 border-dashed border-gray-200 opacity-50"></div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {newsData.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </main>
  );
}
