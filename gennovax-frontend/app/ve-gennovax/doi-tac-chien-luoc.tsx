"use client";

import React from "react";
// import Image from 'next/image'; // Nên dùng 'next/image' khi deploy
import {
  Building, // Icon Bệnh viện
  GitFork, // Icon Hệ sinh thái/Phân nhánh
  Cpu, // Icon Thiết bị/Công nghệ
  CheckSquare, // Icon Tiêu chuẩn
  FlaskConical, // Icon Lab
  Database, // Icon Tin sinh
  Factory, // Icon Sản xuất
  Network, // Icon Mạng lưới
} from "lucide-react";

// --- DỮ LIỆU TỔNG HỢP TỪ 3 ẢNH ---

// 1. Hệ Sinh Thái (Từ Screenshot_28.png)
const ecosystemData = {
  image:
    "https://res.cloudinary.com/da6f4dmql/image/upload/v1763107793/Screenshot_28_fe8yp7.png",
  title: "Hệ Sinh Thái Toàn Diện",
  description:
    "GennovaX làm chủ toàn bộ chu trình với một hệ sinh thái khép kín, đảm bảo tính đồng bộ, bảo mật và chất lượng cao nhất trong từng quy trình.",
  stats: [
    { icon: FlaskConical, text: "Viện GenLab (Lab trung tâm R&D)" },
    { icon: Network, text: "Golab (Chuỗi cơ sở thu mẫu toàn quốc)" },
    { icon: Factory, text: "GenBiotech (Sản xuất sinh phẩm)" },
    { icon: Cpu, text: "Gentech (Giải pháp phần mềm & Quản lý)" },
    { icon: Database, text: "Dagoras (Tin sinh học & Phân tích dữ liệu)" },
  ],
};

// 2. Đối Tác Chiến Lược (Từ Screenshot_29.png)
const partnersData = {
  image:
    "https://res.cloudinary.com/da6f4dmql/image/upload/v1763107793/Screenshot_29_j738ve.png",
  title: "Đối Tác Chiến Lược Uy Tín",
  description:
    "Chúng tôi xây dựng niềm tin dựa trên sự hợp tác chặt chẽ với các bệnh viện, viện nghiên cứu hàng đầu trong nước và các tập đoàn công nghệ gen hàng đầu thế giới.",
  stats: [
    {
      icon: Building,
      text: "Đối tác bệnh viện lớn: Bạch Mai, ĐH Y Hà Nội, Hoàn Mỹ...",
    },
    {
      icon: Cpu,
      text: "Đối tác công nghệ: Illumina, Thermo Fisher, Qiagen, Bio-Rad...",
    },
  ],
};

// 3. Thiết Bị & Tiêu Chuẩn Lab (Từ Screenshot_30.png)
const equipmentData = {
  image:
    "https://res.cloudinary.com/da6f4dmql/image/upload/v1763107797/Screenshot_30_r6tu31.png",
  title: "Phòng Lab Chuẩn Quốc Tế",
  description:
    "Hệ thống phòng Lab được trang bị máy móc hiện đại, tự động và tuân thủ nghiêm ngặt các tiêu chuẩn kiểm soát chất lượng quốc tế.",
  stats: [
    { icon: CheckSquare, text: "Chứng chỉ ISO 15189 (Wet-lab & Dry-lab)" },
    { icon: CheckSquare, text: "Sử dụng Kit chuẩn IVD (Bộ Y Tế cấp phép)" },
    { icon: Cpu, text: "Hệ thống giải trình tự gen (ABI, Illumina, MGI)" },
    { icon: Cpu, text: "Hệ thống Real-time PCR (Biorad, Thermo Fisher)" },
  ],
};

// Màu sắc (để nhất quán)
const brandColors = {
  primary: "#0D47A1",
  secondary: "#0891B2",
};

// --- COMPONENT CHÍNH ---

export default function PartnersAndEquipment() {
  return (
    <section
      id="doi-tac-va-thuyet-bi"
      className="w-full bg-white py-24" // Nền trắng
    >
      <div className="container mx-auto max-w-7xl px-4">
        {/* Tiêu đề Section */}
        <h2
          className="mb-20 text-center text-4xl font-extrabold"
          style={{ color: brandColors.primary }}
        >
          Đối Tác & Nền Tảng Công Nghệ
        </h2>

        {/* Container cho các khối "so le" */}
        <div className="space-y-20">
          {/* === KHỐI 1: HỆ SINH THÁI (Ảnh trái, Text phải) === */}
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            {/* Cột Ảnh 1 */}
            <div>
              <img
                src={ecosystemData.image}
                alt={ecosystemData.title}
                className="h-auto w-full rounded-2xl object-contain shadow-2xl"
              />
            </div>
            {/* Cột Nội dung 1 */}
            <div className="rounded-xl bg-gray-50 p-8 shadow-lg">
              <h3
                className="mb-4 text-3xl font-bold"
                style={{ color: brandColors.primary }}
              >
                {ecosystemData.title}
              </h3>
              <p className="mb-6 text-lg text-gray-700">
                {ecosystemData.description}
              </p>
              <ul className="space-y-4">
                {ecosystemData.stats.map((stat) => (
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

          {/* === KHỐI 2: ĐỐI TÁC (Text trái, Ảnh phải) === */}
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            {/* Cột Nội dung 2 (order-first để nằm bên trái) */}
            <div className="order-last rounded-xl bg-gray-50 p-8 shadow-lg md:order-first">
              <h3
                className="mb-4 text-3xl font-bold"
                style={{ color: brandColors.primary }}
              >
                {partnersData.title}
              </h3>
              <p className="mb-6 text-lg text-gray-700">
                {partnersData.description}
              </p>
              <ul className="space-y-4">
                {partnersData.stats.map((stat) => (
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
                src={partnersData.image}
                alt={partnersData.title}
                className="h-auto w-full rounded-2xl object-contain shadow-2xl"
              />
            </div>
          </div>

          {/* === KHỐI 3: THIẾT BỊ & CHUẨN (Ảnh trái, Text phải) === */}
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
            {/* Cột Ảnh 3 */}
            <div>
              <img
                src={equipmentData.image}
                alt={equipmentData.title}
                className="h-auto w-full rounded-2xl object-contain shadow-2xl"
              />
            </div>
            {/* Cột Nội dung 3 */}
            <div className="rounded-xl bg-gray-50 p-8 shadow-lg">
              <h3
                className="mb-4 text-3xl font-bold"
                style={{ color: brandColors.primary }}
              >
                {equipmentData.title}
              </h3>
              <p className="mb-6 text-lg text-gray-700">
                {equipmentData.description}
              </p>
              <ul className="space-y-4">
                {equipmentData.stats.map((stat) => (
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
