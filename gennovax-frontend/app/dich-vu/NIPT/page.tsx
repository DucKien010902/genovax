"use client";

import React, { useState } from "react";
// Để tối ưu, bạn nên dùng 'next/image' thay cho <img> khi deploy
// import Image from 'next/image';
import {
  CheckCircle,
  ShieldCheck,
  Users,
  Beaker,
  Heart,
  Calendar,
  Home,
  Mail,
  Check,
  X,
} from "lucide-react";
import Link from "next/link";
import ConsultationModal from "@/components/home/ConsultationModal";

// --- DATA (Giữ nguyên) ---

const packageData = [
  {
    name: "Geni Eco",
    price: "1.700.000",
    priceAddon: null,
    target: "Thai đơn",
    features: {
      downPatauEdwards: true,
      turner: false,
      sexChromosome: false,
      allOtherChromosomes: false,
      microdeletions: false,
    },
  },
  {
    name: "Geni 4",
    price: "2.200.000",
    priceAddon: null,
    target: "Thai đơn",
    features: {
      downPatauEdwards: true,
      turner: true,
      sexChromosome: false,
      allOtherChromosomes: false,
      microdeletions: false,
    },
  },
  {
    name: "Geni 8",
    price: "3.000.000",
    priceAddon: "3.500.000",
    target: "Thai đơn",
    features: {
      downPatauEdwards: true,
      turner: true,
      sexChromosome: true,
      allOtherChromosomes: false,
      microdeletions: false,
    },
  },
  {
    name: "Geni 23",
    price: "4.800.000",
    priceAddon: "5.300.000",
    target: "Thai đơn",
    features: {
      downPatauEdwards: true,
      turner: true,
      sexChromosome: true,
      allOtherChromosomes: true,
      microdeletions: false,
    },
  },
  {
    name: "Geni Twins",
    price: "4.500.000",
    priceAddon: "5.000.000",
    target: "Thai đôi (nên thu mẫu từ 12 tuần)",
    features: {
      downPatauEdwards: true,
      turner: false,
      sexChromosome: false,
      allOtherChromosomes: true,
      microdeletions: false,
    },
  },
  {
    name: "Geni Diamond",
    price: "6.500.000",
    priceAddon: "7.000.000",
    target: "Thai đơn",
    features: {
      downPatauEdwards: true,
      turner: true,
      sexChromosome: true,
      allOtherChromosomes: true,
      microdeletions: true,
    },
  },
];

const featureRows = [
  {
    key: "downPatauEdwards",
    label: "Hội chứng Down, Edwards, Patau (NST 13, 18, 21)",
  },
  { key: "turner", label: "Hội chứng Turner (XO)" },
  {
    key: "sexChromosome",
    label: "Lệch bội NST giới tính (XXX, XXY, XYY, XXXY)",
  },
  {
    key: "allOtherChromosomes",
    label: "Bất thường số lượng TOÀN BỘ 22 cặp NST thường",
  },
  { key: "microdeletions", label: "122 hội chứng mất/ lặp đoạn" },
];

// --- TYPE DEFINITIONS (Để truyền props) ---
type BrandColors = {
  primary: string;
  secondary: string;
  lightBg: string;
};

type SectionProps = {
  brandColors: BrandColors;
};

// --- COMPONENT CON 1: HERO SECTION ---
const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State quản lý Modal
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  return (
    <div
      className="relative w-full overflow-hidden "
      style={{ minHeight: "500px" }}
    >
      {/* Ảnh nền */}
      <img
        src="https://res.cloudinary.com/da6f4dmql/image/upload/v1764746810/shutterstock_1802264764_u02kyk.jpg"
        alt="Xét nghiệm ADN Huyết thống GennovaX"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Lớp phủ màu tối để giảm nhiễu nền */}
      <div className="absolute inset-0 bg-blue-900/50"></div>

      {/* Card nền mờ chứa chữ */}
      <div className="container relative z-10 mx-auto flex h-full min-h-[500px] max-w-7xl items-center px-4 py-10 md:py-20 text-white">
        <div
          className="
        w-full 
        max-w-xl 
        bg-white/15 
        backdrop-blur-md 
        rounded-2xl 
        p-4  
        md:p-12 
        shadow-2xl
      "
        >
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            Xét nghiệm
            <br />
            sàng lọc NIPT
          </h1>

          <div className="my-6 w-24 h-1.5 bg-cyan-500"></div>

          <p className="text-xl text-white md:text-2xl">
            NIPT của riêng người Việt
          </p>

          <p className="mt-4 text-lg text-white md:text-xl">
            Giải pháp sàng lọc dị tật bẩm sinh với thuật toán dựa trên 100.000
            data gen người Việt đảm bảo độ
            <span className="font-bold text-white"> chính xác 99,9%</span>.
          </p>

          <div className="mt-10 flex  gap-4">
            <Link
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                setIsModalOpen(true);
              }}
              className="rounded-full bg-cyan-500 px-4 md:px-8 py-2 md:py-3.5 text-base font-bold text-white shadow-lg transition duration-300 hover:bg-cyan-400"
            >
              Đặt hẹn tư vấn
            </Link>
            <Link
              href="/dich-vu/NIPT/#bang-gia"
              className="rounded-full bg-white/20 px-4 md:px-8 py-2 md:py-3.5 text-base font-bold text-white backdrop-blur-sm transition duration-300 hover:bg-white/30"
            >
              Xem bảng giá
            </Link>
          </div>
        </div>
      </div>
      <ConsultationModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

// --- COMPONENT CON 2: INTRO SECTION (SECTION 1) ---
const IntroSection: React.FC<SectionProps> = ({ brandColors }) => (
  <section className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 max-w-6xl mx-auto">
    {/* Nội dung sáng tạo 1 */}
    <div className="space-y-6">
      <h1
        className="text-4xl font-extrabold md:text-5xl"
        style={{ color: brandColors.primary }}
      >
        Khởi đầu hành trình với sự an tâm.
      </h1>
      <p className="text-xl text-gray-600">
        Sự an tâm là món quà vô giá trong suốt thai kỳ. Với xét nghiệm NIPT, bạn
        đang chọn giải pháp sàng lọc{" "}
        <span
          className="font-semibold"
          style={{ color: brandColors.secondary }}
        >
          an toàn cho mẹ{" "}
        </span>
        và một tương lai{" "}
        <span
          className="font-semibold"
          style={{ color: brandColors.secondary }}
        >
          mạnh khoẻ cho con
        </span>
        .
      </p>
      <ul className="space-y-3 pt-3">
        <li className="flex items-center text-lg">
          <ShieldCheck
            className="mr-3 h-6 w-6"
            style={{ color: brandColors.secondary }}
          />
          An toàn tuyệt đối, không xâm lấn.
        </li>
        <li className="flex items-center text-lg">
          <Users
            className="mr-3 h-6 w-6"
            style={{ color: brandColors.secondary }}
          />
          Được tin dùng bởi hơn 200.000 thai phụ.
        </li>
      </ul>
    </div>

    {/* Ảnh 1 (Ảnh: nipt-hero.png) */}
    <div className="flex justify-center">
      <img
        src="/images/NIPT/nipt-hero.png"
        alt="Xét nghiệm NIPT Gennovax"
        className="h-auto w-full rounded-2xl object-contain shadow-xl"
      />
    </div>
  </section>
);

// --- COMPONENT CON 3: WHY US SECTION (SECTION 2) ---
const WhyUsSection: React.FC<SectionProps> = ({ brandColors }) => (
  <section className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 mb-16 ax-w-6xl mx-auto">
    {/* Ảnh 2 (Ảnh: nipt-why-us.png) - Dùng 'order' để xen kẽ */}
    <div className="order-last flex justify-center md:order-first">
      <img
        src="/images/NIPT/nipt-why-us.png"
        alt="Vì sao chọn Gennovax"
        className="h-auto w-full rounded-2xl object-contain shadow-xl"
      />
    </div>

    {/* Nội dung sáng tạo 2 */}
    <div className="order-first space-y-6 md:order-last">
      <h2
        className="text-4xl font-extrabold"
        style={{ color: brandColors.primary }}
      >
        Cam kết từ nền tảng công nghệ.
      </h2>
      <p className="text-xl text-gray-600">
        Sự tin tưởng của bạn được xây dựng trên nền tảng khoa học vững chắc và
        công nghệ sàng lọc tiên tiến nhất thế giới.
      </p>
      <ul className="space-y-3 pt-3">
        <li className="flex items-start text-lg">
          <Beaker
            className="mr-3 mt-1 h-6 w-6 flex-shrink-0"
            style={{ color: brandColors.secondary }}
          />
          <span>
            <span className="font-semibold">Công nghệ Illumina (Hoa Kỳ):</span>{" "}
            Đạt chuẩn vàng với độ chính xác 99,9%.
          </span>
        </li>
        <li className="flex items-start text-lg">
          <Heart
            className="mr-3 mt-1 h-6 w-6 flex-shrink-0"
            style={{ color: brandColors.secondary }}
          />
          <span>
            <span className="font-semibold">Không xâm lấn:</span> Chỉ cần 7-10ml
            máu mẹ, an toàn tuyệt đối cho thai nhi.
          </span>
        </li>
        <li className="flex items-start text-lg">
          <CheckCircle
            className="mr-3 mt-1 h-6 w-6 flex-shrink-0"
            style={{ color: brandColors.secondary }}
          />
          <span>
            <span className="font-semibold">Phát hiện sớm:</span> Sàng lọc hiệu
            quả ngay từ tuần thai thứ 9.
          </span>
        </li>
      </ul>
    </div>
  </section>
);
const Process1Section: React.FC<SectionProps> = ({ brandColors }) => (
  <section className="ax-w-6xl mx-auto">
    <div className="flex justify-center">
      <img
        src="https://res.cloudinary.com/da6f4dmql/image/upload/v1763354688/Screenshot_32_jmflj5.png"
        alt="Quy trình NIPT 3 bước"
        className="h-auto w-full rounded-2xl object-contain"
      />
    </div>
  </section>
);

// --- COMPONENT CON 4: PROCESS SECTION (SECTION 3) ---
const ProcessSection: React.FC<SectionProps> = ({ brandColors }) => (
  <section className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 mb-16 ax-w-6xl mx-auto">
    {/* Nội dung sáng tạo 3 */}
    <div className="space-y-6">
      <h2
        className="text-4xl font-extrabold"
        style={{ color: brandColors.primary }}
      >
        Trải nghiệm nhẹ nhàng trong 3 bước.
      </h2>
      <p className="text-xl text-gray-600">
        Chúng tôi hiểu sự bận rộn và mong muốn tiện lợi của mẹ, vì vậy quy trình
        NIPT được tinh gọn tối đa.
      </p>
      <ul className="space-y-3 pt-3">
        <li className="flex items-start text-lg">
          <Calendar
            className="mr-3 mt-1 h-6 w-6 flex-shrink-0"
            style={{ color: brandColors.secondary }}
          />
          <span>
            <span className="font-semibold">1. Đăng ký lịch:</span> Nhanh chóng
            qua điện thoại hoặc online.
          </span>
        </li>
        <li className="flex items-start text-lg">
          <Home
            className="mr-3 mt-1 h-6 w-6 flex-shrink-0"
            style={{ color: brandColors.secondary }}
          />
          <span>
            <span className="font-semibold">2. Lấy mẫu:</span> Linh hoạt tại
            phòng khám hoặc thoải mái tại nhà bạn.
          </span>
        </li>
        <li className="flex items-start text-lg">
          <Mail
            className="mr-3 mt-1 h-6 w-6 flex-shrink-0"
            style={{ color: brandColors.secondary }}
          />
          <span>
            <span className="font-semibold">3. Nhận kết quả:</span> Bảo mật,
            nhanh chóng qua Email hoặc Zalo.
          </span>
        </li>
      </ul>
    </div>

    {/* Ảnh 3 (Ảnh: nipt-process.png) */}
    <div className="flex justify-center">
      <img
        src="/images/NIPT/nipt-process.png"
        alt="Quy trình NIPT 3 bước"
        className="h-auto w-full rounded-2xl object-contain"
      />
    </div>
  </section>
);

// --- COMPONENT CON 5: PRICING TABLE SECTION (SECTION 4) ---
const PricingTableSection: React.FC<SectionProps> = ({ brandColors }) => (
  <section
    className="flex flex-col items-center pt-0 ax-w-6xl mx-auto "
    id="bang-gia"
  >
    <h2
      className="mb-6 text-center text-4xl font-extrabold md:text-5xl"
      style={{ color: brandColors.primary }}
    >
      So Sánh Các Gói Xét Nghiệm NIPT
    </h2>
    <p className="mb-16 max-w-3xl text-center text-xl text-gray-600">
      Tìm gói sàng lọc phù hợp nhất với nhu cầu của bạn. Tất cả các gói đều có
      thời gian trả kết quả từ
      <span className="font-semibold"> 3-5 ngày làm việc</span>.
    </p>

    {/* Wrapper cho table để cuộn ngang trên mobile */}
    <div className="w-full overflow-x-auto rounded-lg shadow-2xl">
      <table
        className="w-full max-w-7xl border-collapse"
        style={{ border: `4px solid ${brandColors.primary}` }}
      >
        <thead
          style={{ backgroundColor: brandColors.primary }}
          className="text-white"
        >
          <tr>
            <th className="p-4 text-left text-lg font-semibold min-w-[180px]">
              Tên xét nghiệm
            </th>
            {packageData.map((pkg) => (
              <th
                key={pkg.name}
                className="p-4 text-center text-lg font-semibold border-l border-blue-300"
              >
                {pkg.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {/* Render các hàng tính năng */}
          {featureRows.map((row, rowIndex) => (
            <tr
              key={row.key}
              className={rowIndex % 2 === 0 ? "bg-white" : "bg-blue-50"}
            >
              <td className="p-4 font-semibold border-r border-blue-200">
                {row.label}
              </td>
              {packageData.map((pkg) => (
                <td
                  key={pkg.name}
                  className="p-4 text-center border-l border-blue-200"
                >
                  {pkg.features[row.key as keyof typeof pkg.features] ? (
                    <Check className="mx-auto h-6 w-6 text-green-500" />
                  ) : (
                    <X className="mx-auto h-6 w-6 text-gray-300" />
                  )}
                </td>
              ))}
            </tr>
          ))}

          {/* Hàng Đối tượng */}
          <tr className="bg-white">
            <td className="p-4 font-semibold border-r border-blue-200">
              Đối tượng
            </td>
            {packageData.map((pkg) => (
              <td
                key={pkg.name}
                className="p-4 text-center border-l border-blue-200"
              >
                {pkg.target}
              </td>
            ))}
          </tr>

          {/* Hàng Giá Niêm Yết */}
          <tr className="bg-blue-100">
            <td
              className="p-4 text-lg font-bold border-r border-blue-200"
              style={{ color: brandColors.primary }}
            >
              Giá niêm yết (VNĐ)
            </td>
            {packageData.map((pkg) => (
              <td
                key={pkg.name}
                className="p-4 text-center text-lg font-bold border-l border-blue-200"
                style={{ color: brandColors.primary }}
              >
                {pkg.price}
              </td>
            ))}
          </tr>

          {/* Hàng Giá Add-on */}
          <tr className="bg-blue-50">
            <td className="p-4 font-semibold border-r border-blue-200">
              Làm thêm 21 Bệnh gen lặn cho mẹ (VNĐ)
            </td>
            {packageData.map((pkg) => (
              <td
                key={pkg.name}
                className="p-4 text-center font-semibold border-l border-blue-200"
              >
                {pkg.priceAddon ? pkg.priceAddon : "N/A"}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  </section>
);
const Process2Section: React.FC<SectionProps> = ({ brandColors }) => (
  <section className="ax-w-6xl mx-auto">
    <div className="flex justify-center">
      <img
        src="https://res.cloudinary.com/da6f4dmql/image/upload/v1763355273/Screenshot_33_cpmdib.png"
        alt="Quy trình NIPT 3 bước"
        className="h-auto w-full rounded-2xl object-contain"
      />
    </div>
  </section>
);

// --- COMPONENT CHÍNH (ĐÃ ĐƯỢC RÚT GỌN) ---

export default function NiptLandingPage() {
  // Màu sắc chủ đạo từ thiết kế của bạn
  const brandColors = {
    primary: "#0D47A1", // Xanh đậm
    secondary: "#10B981", // Xanh lá
    lightBg: "#F3F4F6", // Nền xám nhạt
  };

  return (
    <main className="min-h-screen text-gray-800 relative">
      {/* 1. Lắp ráp Hero Section */}
      <HeroSection />

      {/* Container chính của trang */}
      <div className="relative z-10 bg-white container mx-auto max-w-6xl space-y-24 px-4 py-10 md:py-16">
        {/* 2. Lắp ráp Intro Section */}
        <IntroSection brandColors={brandColors} />

        {/* 3. Lắp ráp Why Us Section */}
        <WhyUsSection brandColors={brandColors} />
        <Process1Section brandColors={brandColors} />

        {/* 4. Lắp ráp Process Section */}
        <ProcessSection brandColors={brandColors} />
        <Process2Section brandColors={brandColors} />
        <PricingTableSection brandColors={brandColors} />

        {/* 5. Lắp ráp Pricing Table Section */}
      </div>
    </main>
  );
}
