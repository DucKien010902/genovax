"use client";
import React, { use } from "react"; // <--- 1. Thêm import { use }
import { useRouter } from "next/navigation";
import { patauArticle } from "@/data/articals";
import {
  ArrowLeft,
  Calendar,
  User,
  Share2,
  Clock,
  Facebook,
  Twitter,
} from "lucide-react";

// 2. Cập nhật Type: params là Promise
export default function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();

  // 3. Sử dụng hook use() để lấy slug từ Promise
  const { slug } = use(params);

  console.log(slug); // Bây giờ nó sẽ log ra string đúng

  // Tìm bài viết theo slug
  const item = patauArticle.find((i) => i.slug === slug);

  if (!item) {
    return <div className="p-4">Không tìm thấy bài viết.</div>;
  }

  return (
    <article className="min-h-screen bg-white font-sans">
      {/* 1. Hero Section Bài viết */}
      <div className="relative w-full h-[400px] md:h-[400px]">
        <img
          src={item.imageBgr}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        <div className="absolute top-[5%] left-0 md:left-[5%] w-full p-6 md:p-12 text-white container mx-auto max-w-5xl">
          <button
            onClick={() => {
              router.back();
            }}
            className="flex items-center gap-2 text-sm bg-white/20 backdrop-blur-md px-3 py-1 rounded-full hover:bg-white/30 transition mb-4 w-fit"
          >
            <ArrowLeft size={16} /> Quay lại
          </button>

          <div className="flex gap-2 mb-3">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-[8px] md:text-sm font-bold bg-[#00ACC1] px-2 py-1 rounded uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-2xl md:text-5xl font-bold leading-tight mb-4">
            {item.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm opacity-90">
            <div className="flex items-center gap-1">
              <User size={16} /> {item.author}
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} /> {item.date}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} /> 5 phút đọc
            </div>
          </div>
        </div>
      </div>

      {/* 2. Nội dung chính */}
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Cột trái: Nội dung */}
          <div className="w-full md:w-3/4">
            {/* Sapo (Excerpt) */}
            <p className="text-xl font-medium text-gray-600 leading-relaxed mb-8 italic border-l-4 border-[#00ACC1] pl-4">
              {item.excerpt}
            </p>

            {/* Body Content - Loop qua mảng content */}
            <div className="prose prose-lg prose-blue max-w-none text-gray-700">
              {item.content.map((section, index) => (
                <div key={index} className="mb-10">
                  <h2 className="text-2xl font-bold text-[#0D47A1] mb-4 pb-2 border-b border-gray-100">
                    {section.heading}
                  </h2>

                  {/* Xử lý xuống dòng cho đoạn văn */}
                  <div className="whitespace-pre-line leading-7">
                    {section.body.split("\n").map((line, i) => (
                      <p key={i} className="mb-4">
                        {line.replace(/\*\*(.*?)\*\*/g, (match, p1) => p1)}
                      </p>
                    ))}
                  </div>

                  {/* Trigger hình ảnh minh họa (Logic demo cũ của bạn) */}
                  {section.heading.includes("Nguyên nhân") && (
                    <div className="my-6 bg-gray-50 p-4 rounded-lg border border-gray-200 text-center text-sm text-gray-500 italic">
                      <img
                        src="https://trungtamadn.com/wp-content/uploads/2023/09/tong-quan-he-hoi-chung-patau1.jpg"
                        alt="Minh họa Trisomy 13"
                        className="mx-auto mb-3 rounded-lg shadow-md max-w-[350px]"
                      />
                      Minh họa: Bộ nhiễm sắc thể Trisomy 13
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cột phải: Sidebar (Mục lục & Chia sẻ) */}
          <div className="w-full md:w-1/4">
            <div className="sticky top-24">
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-gray-800 mb-4 uppercase text-sm">
                  Mục lục
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  {item.content.map((section, idx) => (
                    <li
                      key={idx}
                      className="hover:text-[#00ACC1] cursor-pointer transition"
                    >
                      {idx + 1}. {section.heading}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <h3 className="font-bold text-[#0D47A1] mb-2">
                  Chia sẻ bài viết
                </h3>
                <div className="flex justify-center gap-3 mt-4">
                  <button className="p-2 bg-white rounded-full shadow hover:text-blue-600 transition">
                    <Facebook size={20} />
                  </button>
                  <button className="p-2 bg-white rounded-full shadow hover:text-blue-400 transition">
                    <Twitter size={20} />
                  </button>
                  <button className="p-2 bg-white rounded-full shadow hover:text-gray-600 transition">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
