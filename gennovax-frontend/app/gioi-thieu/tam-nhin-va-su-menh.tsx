'use client';

import React from 'react';
import { 
  Eye, Target, Gem, Rocket, Building, Home, Beaker, CpuIcon
} from 'lucide-react';

// --- DỮ LIỆU ---

const visionData = {
  title: 'TẦM NHÌN',
  icon: Eye,
  description: 'Tầm nhìn của chúng tôi là trở thành tổ chức hàng đầu tại Việt Nam và khu vực trong lĩnh vực nghiên cứu phát triển, ứng dụng công nghệ phân tích di truyền và giải mã gen vào nền y học chính xác.'
};

const missionData = {
  title: 'SỨ MỆNH',
  icon: Target,
  description: 'Cải thiện sức khoẻ cộng đồng bằng GIẢI PHÁP GEN tiên tiến, chất lượng với chi phí hợp lý nhất.'
};

const coreValueData = {
  title: 'GIÁ TRỊ CỐT LÕI',
  icon: CpuIcon,
  description: 'Cam kết dịch vụ chất lượng cao, uy tín, chính trực và lấy con người làm trung tâm để cùng nhau phát triển.'
};

const roadmapData = [
  {
    year: '2025',
    icon: Rocket,
    title: 'Ra mắt hệ sinh thái GennovaX',
    description: "Gồm Lab trung tâm, chuỗi Golab, ứng dụng Gentech. Hợp tác quốc tế (Novodan, All bio...)."
  },
  {
    year: '2026',
    icon: Building,
    title: 'Mở rộng lĩnh vực',
    description: "Bệnh viện Quốc tế và sản xuất thiết bị y tế."
  },
  {
    year: '2027',
    icon: Home,
    title: 'Thành lập Viện dưỡng lão',
    description: "Đạt chuẩn chăm sóc cao cấp."
  },
  {
    year: '2028',
    icon: Beaker,
    title: 'Triển khai y học tiên tiến',
    description: "Liệu pháp tế bào gốc và Liệu pháp Gene."
  }
];

const brandColors = {
  primary: '#0D47A1', // Xanh đậm
  secondary: '#0891B2', // Teal xanh sáng
};

// --- COMPONENT CHÍNH ---

export default function VisionAndRoadmap() {
  return (
    <section id="tam-nhin-va-su-menh" className="w-full bg-white min-h-screen">
      
      {/* === PHẦN 1: TẦM NHÌN & SỨ MỆNH === */}
      <div className="relative w-full overflow-hidden py-24 md:py-48">
        
        {/* Ảnh nền */}
        <img
          src="/images/bgr-gioi thieu.png"
          alt="Đội ngũ GennovaX"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Lớp phủ (tùy chọn) */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Nội dung */}
        <div className="container relative z-10 mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            
            {/* Card Tầm nhìn */}
            <div className="relative flex flex-col items-center text-center rounded-lg bg-white/90 p-8 pt-16 shadow-2xl backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-3xl duration-300">
              <div 
                className="absolute -top-10 flex h-20 w-20 items-center justify-center rounded-full shadow-lg transition-transform duration-300 hover:scale-110"
                style={{ backgroundColor: brandColors.secondary }}
              >
                <visionData.icon className="h-10 w-10 text-white" />
              </div>
              <h3 className="mb-3 mt-4 text-3xl font-bold" style={{ color: brandColors.primary }}>
                {visionData.title}
              </h3>
              <p className="text-lg text-gray-700">{visionData.description}</p>
            </div>

            {/* Card Sứ mệnh */}
            <div className="relative flex flex-col items-center text-center rounded-lg bg-white/90 p-8 pt-16 shadow-2xl backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-3xl duration-300">
              <div 
                className="absolute -top-10 flex h-20 w-20 items-center justify-center rounded-full shadow-lg transition-transform duration-300 hover:scale-110"
                style={{ backgroundColor: brandColors.secondary }}
              >
                <missionData.icon className="h-10 w-10 text-white" />
              </div>
              <h3 className="mb-3 mt-4 text-3xl font-bold" style={{ color: brandColors.primary }}>
                {missionData.title}
              </h3>
              <p className="text-lg text-gray-700">{missionData.description}</p>
            </div>

            {/* Card Giá trị cốt lõi */}
            <div className="relative flex flex-col items-center text-center rounded-lg bg-white/90 p-8 pt-16 shadow-2xl backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-3xl duration-300">
              <div 
                className="absolute -top-10 flex h-20 w-20 items-center justify-center rounded-full shadow-lg transition-transform duration-300 hover:scale-110"
                style={{ backgroundColor: brandColors.secondary }}
              >
                <coreValueData.icon className="h-10 w-10 text-white" />
              </div>
              <h3 className="mb-3 mt-4 text-3xl font-bold" style={{ color: brandColors.primary }}>
                {coreValueData.title}
              </h3>
              <p className="text-lg text-gray-700">{coreValueData.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* === PHẦN 2: LỘ TRÌNH CHIẾN LƯỢC === */}
      <div className="container mx-auto max-w-7xl px-4 py-20">
        <h2 className="mb-10 text-center text-4xl font-extrabold" style={{ color: brandColors.primary }}>
          LỘ TRÌNH CHIẾN LƯỢC
        </h2>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {roadmapData.map((item) => (
            <div 
              key={item.year} 
              className="relative flex flex-col items-center text-center p-8 pt-16 bg-white rounded-lg shadow-lg border-t-4 transition hover:-translate-y-1 hover:shadow-3xl duration-300"
              style={{ borderTopColor: brandColors.secondary }}
            >
              <div 
                className="absolute -top-10 flex h-20 w-20 items-center justify-center rounded-full shadow-md transition-transform duration-300 hover:scale-110"
                style={{ backgroundColor: brandColors.primary }}
              >
                <item.icon className="h-10 w-10 text-white" />
              </div>
              <h4 className="mb-2 mt-4 text-xl font-bold text-gray-800">
                {item.year}: {item.title}
              </h4>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
