"use client";

import React from "react";
// import Image from 'next/image'; // Nên dùng 'next/image' khi deploy
import {
  Users,
  Network,
  BarChart,
  Cpu,
  MapPin,
  CheckCircle,
  Clock,
  Star,
  ClipboardList,
  Dna,
  TestTube,
  Bug,
} from "lucide-react";

// --- DỮ LIỆU TỔNG HỢP TỪ 3 ẢNH ---

// 1. Năng Lực Cốt Lõi (Từ Screenshot_18.png)
const capacityData = {
  image:
    "https://res.cloudinary.com/da6f4dmql/image/upload/v1763106517/Screenshot_18_j3gfv5.png",
  title: "Năng Lực Cốt Lõi",
  description:
    "GennovaX xây dựng nền tảng vững chắc từ nhân sự chuyên môn cao đến hệ thống trang thiết bị hiện đại, đảm bảo năng lực xử lý khối lượng mẫu lớn mỗi ngày.",
  stats: [
    { icon: Users, number: "70+", text: "Nhân sự chuyên môn" },
    { icon: Network, number: "20+", text: "Phòng LAB hợp tác Toàn quốc" },
    { icon: BarChart, number: "1000+", text: "Mẫu xét nghiệm hàng ngày" },
    { icon: Cpu, number: "100+", text: "Danh mục thiết bị hiện đại" },
  ],
};

// 2. Mạng Lưới & Dịch Vụ (Từ Screenshot_17.png)
const networkData = {
  image:
    "https://res.cloudinary.com/da6f4dmql/image/upload/v1763106512/Screenshot_17_zmtes0.png",
  title: "Phát Triển & Cam Kết Dịch Vụ",
  description:
    "Với mạng lưới 68 điểm thu mẫu toàn quốc và quy trình tối ưu, chúng tôi cam kết mang đến dịch vụ 5 sao: Chuẩn xác - Nhanh - Chuyên nghiệp - Linh hoạt.",
  stats: [
    { icon: MapPin, text: "68 điểm lấy mẫu toàn quốc" },
    { icon: Star, text: "Cam kết dịch vụ chuẩn 5 sao" },
    {
      icon: Clock,
      text: "Nhận mẫu siêu tốc (Nội thành < 1h, Ngoại thành < 3h)",
    },
    {
      icon: CheckCircle,
      text: "Trả kết quả nhanh nhất (Khách Key < 6h, Thường < 72h)",
    },
  ],
};

// 3. Hệ Thống Xét Nghiệm (Từ Screenshot_19.png)
const servicesData = {
  image: "/images/gioithieu-hethongGennovax/anh3.png",
  title: "Hệ Thống Xét Nghiệm Đa Dạng",
  description:
    "Chúng tôi cung cấp một hệ sinh thái xét nghiệm gen toàn diện, đáp ứng mọi nhu cầu sàng lọc và chẩn đoán y học chính xác.",
  stats: [
    { icon: Dna, text: "Sàng lọc trước sinh (NIPT)" },
    { icon: Dna, text: "Di truyền tiền làm tổ (PGT)" },
    { icon: Dna, text: "ADN huyết thống" },
    { icon: TestTube, text: "Vi sinh phân tử & Xét nghiệm sinh hoá" },
    { icon: Bug, text: "Sàng lọc ung thư và bệnh lý di truyền" },
  ],
};

// Màu sắc (lấy từ code của bạn)
const brandColors = {
  primary: "#0D47A1",
  secondary: "#0891B2",
};

// --- COMPONENT CHÍNH ---

export default function GennovaXSystem() {
  return (
    <section
      id="he-thong-gennovax"
      className="w-full bg-white py-24" // Nền trắng
    >
      <div className="container mx-auto max-w-7xl px-4">
        {/* Tiêu đề Section */}
        <h2
          className="mb-20 text-center text-4xl font-extrabold"
          style={{ color: brandColors.primary }}
        >
          Hệ Thống GennovaX Toàn Diện
        </h2>

        {/* Container cho các khối "so le" */}
        <div className="space-y-20">
          {/* === KHỐI 1: NĂNG LỰC CỐT LÕI (Ảnh trái, Text phải) === */}
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            {/* Cột Ảnh 1 */}
            <div>
              <img
                src={capacityData.image}
                alt={capacityData.title}
                className="h-auto w-full rounded-2xl object-cover shadow-2xl"
              />
            </div>
            {/* Cột Nội dung 1 */}
            <div className="rounded-xl bg-gray-50 p-8 shadow-lg">
              <h3
                className="mb-4 text-3xl font-bold"
                style={{ color: brandColors.primary }}
              >
                {capacityData.title}
              </h3>
              <p className="mb-6 text-lg text-gray-700">
                {capacityData.description}
              </p>
              <ul className="space-y-4">
                {capacityData.stats.map((stat) => (
                  <li key={stat.text} className="flex items-center text-lg">
                    <stat.icon
                      className="mr-3 h-6 w-6 flex-shrink-0"
                      style={{ color: brandColors.secondary }}
                    />
                    <span className="font-bold">{stat.number}</span>
                    <span className="ml-2 text-gray-700">{stat.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* === KHỐI 2: MẠNG LƯỚI & DỊCH VỤ (Text trái, Ảnh phải) === */}
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            {/* Cột Nội dung 2 (order-first để nằm bên trái) */}
            <div className="order-last rounded-xl bg-gray-50 p-8 shadow-lg md:order-first">
              <h3
                className="mb-4 text-3xl font-bold"
                style={{ color: brandColors.primary }}
              >
                {networkData.title}
              </h3>
              <p className="mb-6 text-lg text-gray-700">
                {networkData.description}
              </p>
              <ul className="space-y-4">
                {networkData.stats.map((stat) => (
                  <li key={stat.text} className="flex items-start text-lg">
                    <stat.icon
                      className="mr-3 mt-1 h-6 w-6 flex-shrink-0"
                      style={{ color: brandColors.secondary }}
                    />
                    <span className="text-gray-700">{stat.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Cột Ảnh 2 */}
            <div className="order-first md:order-last">
              <img
                src={networkData.image}
                alt={networkData.title}
                className="h-auto w-full rounded-2xl object-contain shadow-2xl"
              />
            </div>
          </div>

          {/* === KHỐI 3: HỆ THỐNG XÉT NGHIỆM (Ảnh trái, Text phải) === */}
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            {/* Cột Ảnh 3 */}
            <div>
              <img
                src={servicesData.image}
                alt={servicesData.title}
                className="h-auto w-full rounded-2xl object-contain shadow-2xl"
              />
            </div>
            {/* Cột Nội dung 3 */}
            <div className="rounded-xl bg-gray-50 p-8 shadow-lg">
              <h3
                className="mb-4 text-3xl font-bold"
                style={{ color: brandColors.primary }}
              >
                {servicesData.title}
              </h3>
              <p className="mb-6 text-lg text-gray-700">
                {servicesData.description}
              </p>
              <ul className="space-y-4">
                {servicesData.stats.map((stat) => (
                  <li key={stat.text} className="flex items-start text-lg">
                    <stat.icon
                      className="mr-3 mt-1 h-6 w-6 flex-shrink-0"
                      style={{ color: brandColors.secondary }}
                    />
                    <span className="text-gray-700">{stat.text}</span>
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
