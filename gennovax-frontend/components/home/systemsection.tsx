"use client";

import React from "react";
// import Image from 'next/image'; 
import {
  Star,
  Clock,
  Zap,
  Check,
  Handshake,
} from "lucide-react";

// --- DỮ LIỆU ---
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

const partnership = {
  title: "Đồng hành phát triển thương hiệu cùng đối tác",
  icon: Handshake,
  features: [
    "Hỗ trợ marketing đa kênh: Quảng cáo Facebook, POSM, tài liệu truyền thông.",
    "Linh hoạt phối hợp chiến dịch và hoạt động marketing theo từng nhu cầu thực tế.",
  ],
};

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
        background: `linear-gradient(to bottom, white, #e0f7fa, white)`,
      }}
    >
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-5 md:gap-16">
          {/* === CỘT ẢNH (40%) === */}
          <div className="md:col-span-2 flex flex-col items-center">
            <img
              src="https://res.cloudinary.com/da6f4dmql/image/upload/v1763437814/%E1%BA%A2nh_web-08_cwdzq3.png"
              alt="Hệ thống dịch vụ GennovaX"
              className="h-auto w-full rounded-2xl object-cover aspect-square"
              style={{
                boxShadow: "0 4px 20px rgba(0, 128, 255, 0.6)",
              }}
            />
            <a
              href="/gioi-thieu/danh-sach-phong-kham"
              className="mt-4 text-xs lg:text-lg text-center text-blue-600 text-opacity-80 font-medium inline-block underline hover:text-blue-800"
            >
              Chuỗi 68 phòng xét nghiệm trên toàn quốc.
            </a>
          </div>

          {/* === CỘT NỘI DUNG (60%) === */}
          <div className="md:col-span-3">
            
            {/* --- PHẦN CAM KẾT (Đã chỉnh sửa scroll ngang mobile) --- */}
            <div className="
                my-8 mt-0 
                flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory 
                sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:pb-0
                scrollbar-hide
            ">
              {commitments.map((item) => (
                <div
                  key={item.title}
                  className="
                    flex-shrink-0 w-[85vw] snap-center sm:w-auto
                    rounded-xl bg-gray-50 p-4 shadow-lg transition-shadow hover:shadow-xl
                  "
                >
                  <item.icon
                    className="hidden lg:flex h-10 w-10 mb-3"
                    style={{ color: brandColors.secondary }}
                  />
                  {/* Icon hiển thị trên mobile nếu muốn (tùy chọn) */}
                  <item.icon
                    className="flex lg:hidden h-8 w-8 mb-2"
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
            {/* ------------------------------------------------------- */}

            {/* Phần 2: Đồng hành cùng đối tác */}
            <div
              className="mt-6 sm:mt-10 rounded-xl p-6"
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