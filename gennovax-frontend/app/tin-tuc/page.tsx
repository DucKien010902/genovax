"use client";

import React, { useState } from "react";
import {
  Calendar,
  Tag,
  ArrowRight,
  Facebook,
  Twitter,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { patauArticle } from "@/data/articals";

// =======================
// 🔥 1. KHAI BÁO KIỂU DỮ LIỆU
// =======================
export interface ArticleContent {
  heading: string;
  body: string;
}

export interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  author: string;
  tags: string[];
  imageMain: string;
  imageBgr: string;
  excerpt: string;
  content: ArticleContent[];
}

const newsData: ArticleItem[] = patauArticle;
const categories = ["Tất cả", "Blog", "Tin nổi bật", "Tin truyền thông"];

// =======================
// 2. COMPONENT HEADER
// =======================
const NewsHeader = () => (
  <div
    className="relative w-full pt-12 pb-10 md:pt-16 md:pb-12 text-center shadow-lg"
    style={{ backgroundImage: `url('/images/bgrHome.jpg')` }}
  >
    <div className="absolute inset-0 overflow-hidden opacity-10"></div>

    <div className="relative z-10 container mx-auto px-4">
      <h1 className="text-2xl md:text-4xl font-bold uppercase tracking-wide text-white">
        TIN TỨC Y TẾ NỔI BẬT
      </h1>
    </div>
  </div>
);

// =======================
// 3. CARD TIN TỨC
// =======================
const NewsCard = ({ item }: { item: ArticleItem }) => {
  const router = useRouter();

  return (
    <div

      className="group flex flex-col w-full rounded-2xl bg-white shadow-md transition hover:shadow-xl cursor-pointer overflow-hidden border border-gray-100 h-full"
    >
      <div className="flex flex-col md:flex-row h-full max-h-[300px]">
        {/* IMAGE */}
        <div className="w-[0] md:w-[45%] aspect-video md:aspect-auto relative overflow-hidden">
          <img
            src={item.imageMain}
            alt={item.title}
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-[#00ACC1] shadow-sm md:hidden">
            {item.tags[0]}
          </div>
        </div>

        {/* CONTENT */}
        <div className="w-full md:w-[55%] p-5 flex flex-col justify-between">
          <div>
            <div className="hidden md:flex items-center gap-1 text-sm text-gray-500 mb-2">
              <Tag className="w-4 h-4" />
              <span className="line-clamp-1">{item.tags.join(", ")}</span>
            </div>

            <h2 className="text-xl md:text-2xl font-semibold text-[#00ACC1] leading-tight mb-3 line-clamp-2 group-hover:text-[#00838F] transition-colors">
              {item.title}
            </h2>

            <div className="flex md:hidden items-center text-xs text-gray-400 mb-3">
              <Calendar className="w-3 h-3 mr-1" />
              {item.date}
            </div>

            <p className="text-gray-600 text-sm md:text-base leading-relaxed line-clamp-3 mb-4">
              {item.excerpt}
            </p>
          </div>

          {/* FOOTER */}
          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
            <div className="hidden md:flex items-center text-sm text-gray-400">
              <Calendar className="w-4 h-4 mr-1" />
              {item.date}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <div className="hidden sm:flex gap-2">
                <button className="w-8 h-8 rounded-full bg-gray-100 text-[#3b5998] hover:bg-[#3b5998] hover:text-white flex items-center justify-center transition-all">
                  <Facebook size={16} />
                </button>
                {/* <button className="w-8 h-8 rounded-full bg-gray-100 text-black hover:bg-black hover:text-white flex items-center justify-center transition-all">
                  <Twitter size={16} />
                </button> */}
              </div>

              <button
               onClick={() => router.push(`/tin-tuc/${item.slug}`)}
               className="flex items-center gap-2 text-sm font-bold text-[#00BCD4] hover:text-[#0097A7] transition group/btn">
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

// =======================
// 4. PAGE CHÍNH
// =======================
export default function MedicalNewsPage() {
  const [activeTab, setActiveTab] = useState("Tin nổi bật");

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      <NewsHeader />

      {/* TAB MENU */}
      <div className="bg-white shadow-sm sticky top-0 z-20 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center md:justify-center gap-6 py-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`relative text-sm md:text-base font-medium transition-colors duration-200 px-1 py-1
                  ${
                    activeTab === cat
                      ? "text-[#00ACC1]"
                      : "text-gray-500 hover:text-gray-800"
                  }
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

      <div className="container mx-auto p-4 md:p-8  max-w-7xl">
        <div className="mb-4 md:mb-8 w-full border-b-2 border-dashed border-gray-200/60"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {newsData.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </main>
  );
}
