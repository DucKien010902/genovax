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
// Giả lập dữ liệu để code chạy được ngay (bạn có thể bỏ comment import của bạn)
// import { patauArticle } from "@/data/articals"
import { useRouter } from "next/navigation";

// --- MOCK DATA (Dùng tạm nếu chưa có import) ---
const patauArticle = {
  id: 1,
  title: "Hội chứng Patau: Nguyên nhân, Triệu chứng và Cách phòng ngừa",
  slug: "hoi-chung-patau",
  imageMain:
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
  tags: ["Di truyền", "Sức khỏe thai nhi"],
  date: "01/12/2025",
  excerpt:
    "Hội chứng Patau là một bất thường nhiễm sắc thể hiếm gặp nhưng nghiêm trọng. Bài viết này cung cấp cái nhìn tổng quan về nguyên nhân di truyền, các dấu hiệu nhận biết sớm và các phương pháp sàng lọc trước sinh hiện đại.",
};

const newsData = [patauArticle]; // Nhân bản để test layout
const categories = ["Tất cả", "Blog", "Tin nổi bật", "Tin truyền thông"];

// --- 2. COMPONENT HEADER ---
const NewsHeader = () => (
  <div className="relative w-full bg-[#0D47A1] pt-12 pb-10 md:pt-16 md:pb-12 text-center shadow-lg">
    {/* Ảnh nền chìm */}
    <div className="absolute inset-0 overflow-hidden opacity-10">
      {/* Pattern background */}
    </div>

    <div className="relative z-10 container mx-auto px-4">
      <h1 className="text-2xl md:text-4xl font-bold uppercase tracking-wide text-white">
        TIN TỨC Y TẾ NỔI BẬT
      </h1>
    </div>

    {/* Dải trang trí */}
    <div className="absolute bottom-0 left-0 h-2 w-full flex">
      <div className="h-full w-1/4 bg-[#4DD0E1]"></div>
      <div className="h-full w-1/4 bg-[#FFCA28]"></div>
      <div className="h-full w-1/4 bg-[#8BC34A]"></div>
      <div className="h-full w-1/4 bg-[#00ACC1]"></div>
    </div>
  </div>
);

// --- 3. COMPONENT THẺ TIN TỨC (CARD) ---
const NewsCard = ({ item }: { item: typeof patauArticle }) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/tin-tuc/${item.slug}`)}
      className="group flex flex-col w-full rounded-2xl bg-white shadow-md transition hover:shadow-xl cursor-pointer overflow-hidden border border-gray-100 h-full"
    >
      {/* Wrapper chính: Mobile là cột (col), Tablet trở lên là ngang (row) */}
      <div className="flex flex-col md:flex-row h-full">
        {/* === PHẦN 1: ẢNH === */}
        {/* Mobile: Full width, Desktop: Chiếm khoảng 40% - 45% */}
        <div className="w-full md:w-[45%] aspect-video md:aspect-auto relative overflow-hidden">
          <img
            src={item.imageMain}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Tag đè lên ảnh ở mobile cho tiết kiệm diện tích (tùy chọn) */}
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-[#00ACC1] shadow-sm md:hidden">
            {item.tags[0]}
          </div>
        </div>

        {/* === PHẦN 2: NỘI DUNG === */}
        <div className="w-full md:w-[55%] p-5 flex flex-col justify-between">
          <div>
            {/* Tags (Chỉ hiện trên desktop ở vị trí này) */}
            <div className="hidden md:flex items-center gap-1 text-sm text-gray-500 mb-2">
              <Tag className="w-4 h-4" />
              <span className="line-clamp-1">{item.tags.join(", ")}</span>
            </div>

            {/* Title */}
            <h2 className="text-xl md:text-2xl font-semibold text-[#00ACC1] leading-tight mb-3 line-clamp-2 group-hover:text-[#00838F] transition-colors">
              {item.title}
            </h2>

            {/* Date mobile */}
            <div className="flex md:hidden items-center text-xs text-gray-400 mb-3">
              <Calendar className="w-3 h-3 mr-1" />
              {item.date}
            </div>

            {/* Excerpt */}
            <p className="text-gray-600 text-sm md:text-base leading-relaxed line-clamp-3 mb-4">
              {item.excerpt}
            </p>
          </div>

          {/* Footer Card */}
          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
            {/* Date Desktop */}
            <div className="hidden md:flex items-center text-sm text-gray-400">
              <Calendar className="w-4 h-4 mr-1" />
              {item.date}
            </div>

            {/* Social & Button Wrapper */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              {/* Social Icons - Ẩn trên mobile quá nhỏ, hiện trên tablet+ */}
              <div className="hidden sm:flex gap-2">
                <button className="w-8 h-8 rounded-full bg-gray-100 text-[#3b5998] hover:bg-[#3b5998] hover:text-white flex items-center justify-center transition-all">
                  <Facebook size={16} />
                </button>
                <button className="w-8 h-8 rounded-full bg-gray-100 text-black hover:bg-black hover:text-white flex items-center justify-center transition-all">
                  <Twitter size={16} />
                </button>
              </div>

              <button className="flex items-center gap-2 text-sm font-bold text-[#00BCD4] hover:text-[#0097A7] transition group/btn">
                Đọc tiếp
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 4. TRANG CHÍNH ---
export default function MedicalNewsPage() {
  const [activeTab, setActiveTab] = useState("Tin nổi bật");

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <NewsHeader />

      {/* Sticky Tab Menu */}
      <div className="bg-white shadow-sm sticky top-0 z-20 border-b border-gray-100">
        <div className="container mx-auto px-4">
          {/* overflow-x-auto: Cho phép vuốt ngang trên mobile */}
          <div className="flex items-center md:justify-center gap-6 py-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`relative text-sm md:text-base font-medium transition-colors duration-200 px-1 py-1
                  ${activeTab === cat ? "text-[#00ACC1]" : "text-gray-500 hover:text-gray-800"}
                `}
              >
                {cat}
                {activeTab === cat && (
                  <span className="absolute -bottom-[17px] left-0 h-[3px] w-full bg-[#00ACC1] rounded-t-sm"></span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Danh sách tin tức */}
      {/* max-w-7xl và px-4 thay vì px-25 */}
      <div className="container mx-auto px-4 md:px-8 py-10 max-w-7xl">
        {/* Đường kẻ trang trí */}
        <div className="mb-8 w-full border-b-2 border-dashed border-gray-200/60"></div>

        {/* Grid System */}
        {/* Mobile: 1 cột, Laptop: 2 cột. Gap tăng dần theo màn hình */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {newsData.map((item, index) => (
            <NewsCard key={index} item={item} />
          ))}
        </div>
      </div>
    </main>
  );
}
