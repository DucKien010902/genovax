"use client";

import React from "react";
// import Image from 'next/image'; // Nên dùng 'next/image' khi deploy
import {
  Star, // Icon cho "Chuẩn 5 sao"
  Clock, // Icon cho "Nhận mẫu siêu tốc"
  Zap, // Icon cho "Trả kết quả nhanh nhất"
  Check, // Icon cho các mục
  Handshake, // Icon cho "Đồng hành"
} from "lucide-react";

// --- DỮ LIỆU PHÂN TÍCH TỪ ẢNH ---

// 1. Dữ liệu cho 3 cột cam kết
const commitments = [
  {
    icon: Star,
    title: "Cam kết dịch vụ",
    details: ["Chuẩn 5 sao", "Nhanh - Chuyên nghiệp - Linh hoạt"],
  },
  {
    icon: Clock,
    title: "Nhận mẫu siêu tốc",
    details: ["Nội thành: < 1 giờ", "Ngoại thành: < 3 giờ"],
  },
  {
    icon: Zap,
    title: "Trả kết quả nhanh nhất",
    details: ["Khách hàng Key: < 6 giờ", "Khách hàng thường: < 72 giờ"],
  },
];

// 2. Dữ liệu cho phần đồng hành
const partnership = {
  title: "Đồng hành phát triển thương hiệu cùng đối tác",
  icon: Handshake,
  features: [
    "Hỗ trợ marketing đa kênh: Quảng cáo Facebook, POSM, tài liệu truyền thông.",
    "Linh hoạt phối hợp chiến dịch và hoạt động marketing theo từng nhu cầu thực tế.",
  ],
};

// Màu sắc (để nhất quán)
const brandColors = {
  primary: "#1976D2",
  secondary: "#0D47A1",
};

// --- COMPONENT CHÍNH ---

export default function OurServiceSystem() {
  return (
    <section
      id="he-thong-dich-vu"
      className="w-full py-12"
      style={{
        background: `linear-gradient(to bottom, white, #e0f7fa, white)`, // trắng → xanh nhạt → trắng
      }}
    >
      <div className="container mx-auto max-w-7xl px-4">
        {/* Grid layout 40% (ảnh) / 60% (nội dung) */}
        {/* Dùng 5 cột, ảnh 2 cột, nội dung 3 cột */}
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-5 md:gap-16">
          {/* === CỘT ẢNH (40%) === */}
          <div className="md:col-span-2 flex flex-col items-center">
            <img
              src="https://res.cloudinary.com/da6f4dmql/image/upload/v1763437814/%E1%BA%A2nh_web-08_cwdzq3.png"
              alt="Hệ thống dịch vụ GennovaX"
              className="h-auto w-full rounded-2xl object-cover aspect-square"
              style={{
                boxShadow: "0 4px 20px rgba(0, 128, 255, 0.6)", // shadow xanh tỏa đều
              }}
            />
            <a
              href="/gioi-thieu/danh-sach-phong-kham" // Thay bằng link bạn muốn
              className="mt-4 text-xs lg:text-lg text-center text-blue-600 text-opacity-80 font-medium inline-block underline hover:text-blue-800"
            >
              Chuỗi 68 phòng xét nghiệm trên toàn quốc.
            </a>
          </div>

          {/* === CỘT NỘI DUNG (60%) === */}
          <div className="md:col-span-3">
            {/* Tiêu đề chính cho phần nội dung */}
            {/* <h2 
              className="text-3xl font-extrabold md:text-4xl" 
              style={{ color: brandColors.primary }}
            >
              Vận Hành Xuất Sắc & Cam Kết Dịch Vụ
            </h2>
            <p className="mt-4 text-lg text-gray-600 md:text-xl">
              Chúng tôi tối ưu hóa mọi quy trình để đảm bảo tốc độ, sự linh hoạt và 
              chất lượng chuyên nghiệp nhất trong từng dịch vụ.
            </p> */}

            {/* Grid 3 cột cho 3 cam kết */}
            <div className="my-8 mt-0 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {commitments.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl bg-gray-50 p-4 shadow-lg transition-shadow hover:shadow-xl"
                >
                  <item.icon
                    className="hidden lg:flex h-10 w-10 mb-3"
                    style={{ color: brandColors.secondary }}
                  />
                  <h4 className="text-lg font-bold text-gray-800">
                    {item.title}
                  </h4>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    {item.details.map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Phần 2: Đồng hành cùng đối tác */}
            <div
              className="mt-10 rounded-xl p-6"
              style={{ backgroundColor: brandColors.primary }}
            >
              <div className="flex items-center">
                <Handshake className="h-10 w-10 flex-shrink-0 text-white" />
                <h3 className="ml-4 text-lg lg:text-2xl font-bold text-white">
                  {partnership.title}
                </h3>
              </div>
              <ul className="mt-4 space-y-3">
                {partnership.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start text-sm lg:text-lg text-gray-100"
                  >
                    <Check className="mr-3 mt-1 h-6 w-6 flex-shrink-0 text-cyan-400" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
