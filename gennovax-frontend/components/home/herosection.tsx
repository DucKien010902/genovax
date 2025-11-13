"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";

export type Package = {
  id: number;
  name: string;
  logoUrl: string;
};

export const packageData: Package[] = [
  {
    id: 1,
    name: "SPOT-MAS",
    logoUrl: "/images/NIPT.jpg",
  },
  {
    id: 2,
    name: "oncoMISSI",
    logoUrl: "/images/NIPT.jpg",
    // logoUrl: 'https://via.placeholder.com/150x50?text=oncoMISSI',
  },
  {
    id: 3,
    name: "K-4CARE",
    logoUrl: "/images/NIPT.jpg",
    // logoUrl: 'https://via.placeholder.com/150x50?text=K-4CARE',
  },
  {
    id: 4,
    name: "X-TRACK",
    logoUrl: "/images/NIPT.jpg",
    // logoUrl: 'https://via.placeholder.com/150x50?text=X-TRACK',
  },
  // {
  //   id: 5,
  //   name: 'oneGS',
  //   logoUrl:
  //     'https://viengenlab.vn/wp-content/uploads/2024/10/xet-nghiem-nipt-tai-viengenlab.jpg',
  //   // logoUrl: 'https://via.placeholder.com/150x50?text=oneGS',
  // },
  // {
  //   id: 6,
  //   name: 'geneEXTRA',
  //   logoUrl:
  //     'https://viengenlab.vn/wp-content/uploads/2024/10/xet-nghiem-nipt-tai-viengenlab.jpg',
  //   // logoUrl: 'https://via.placeholder.com/150x50?text=geneEXTRA',
  // },
];

const PACKAGES_PER_PAGE = 4;

// --- Component Card Gói Xét Nghiệm ---
const PackageItem: React.FC<{ pkg: Package }> = ({ pkg }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden relative h-40 lg:h-48 transition duration-300 hover:shadow-xl hover:scale-[1.02]">
      <img
        src={pkg.logoUrl}
        alt={pkg.name}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

const PackageCard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(packageData.length / PACKAGES_PER_PAGE);

  const goNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const goPrev = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const startIndex = currentPage * PACKAGES_PER_PAGE;
  const currentPackages = packageData.slice(
    startIndex,
    startIndex + PACKAGES_PER_PAGE,
  );

  return (
    <div className="relative bg-black/20 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/10 flex flex-col justify-center h-full">
      {/* Grid 2x2 */}
      <div className="grid grid-cols-2 gap-4 lg:gap-6">
        {currentPackages.map((pkg) => (
          <PackageItem key={pkg.id} pkg={pkg} />
        ))}
      </div>

      {/* Nút điều hướng */}
      <button
        onClick={goPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2
                   bg-white/80 hover:bg-white text-blue-600 rounded-full p-2 shadow-lg transition
                   lg:left-3 lg:-translate-x-0"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={goNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2
                   bg-white/80 hover:bg-white text-blue-600 rounded-full p-2 shadow-lg transition
                   lg:right-3 lg:translate-x-0"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

// --- Component Card Thông Tin ---
const InfoCard: React.FC = () => {
  return (
    <div className="bg-black/20 backdrop-blur-md rounded-2xl p-8 lg:p-12 shadow-xl border border-white/10 h-full flex flex-col justify-center">
      <div className="w-full h-1 border-b-4 border-dashed border-white/50 mb-6" />

      <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
        XÉT NGHIỆM NIPT GENNOVAX
      </h1>

      <p className="text-base lg:text-lg text-white/90">
        GenNovax mang đến xét nghiệm NIPT – giải pháp sàng lọc trước sinh không
        xâm lấn, giúp phát hiện sớm bất thường nhiễm sắc thể của thai nhi chỉ từ
        mẫu máu mẹ. Với công nghệ giải trình tự gen tiên tiến, NIPT GenNovax đảm
        bảo độ chính xác cao, an toàn tuyệt đối cho mẹ và bé.
      </p>
    </div>
  );
};

// --- Hero Section ---
const HeroSection: React.FC = () => {
  const backgroundImageUrl = "/images/bgrHome.jpg";

  return (
    <div
      className="relative w-full bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <div className="absolute inset-0 bg-blue-900/30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card Trái */}
          <InfoCard />
          {/* Card Phải */}
          <PackageCard />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
