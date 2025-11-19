'use client';

import React, { useState, useEffect } from 'react';
// import Image from 'next/image'; // Nên dùng 'next/image' khi deploy
import { Quote } from 'lucide-react';

// --- KIỂU DỮ LIỆU ---
interface Expert {
  id: number;
  name: string;
  title: string;
  affiliation: string;
  image: string; // Đường dẫn tới ảnh
  quote: string;
}

// --- DỮ LIỆU MOCK (BAO GỒM 4 CHUYÊN GIA) ---
const allExperts: Expert[] = [
  // 2 chuyên gia đầu tiên (từ ảnh)
  {
    id: 1,
    name: 'TS.BS Phan Cảnh Duy',
    title: 'Phó Trưởng khoa Xét nghiệm',
    affiliation: 'Trung tâm Ung Bướu, Bệnh viện Trung ương Huế',
    image: 'https://placehold.co/100x100/EBF8FF/3182CE?text=TS.BS+Duy', // Thay bằng ảnh thật
    quote:
      'Tầm soát ung thư bằng xét nghiệm gen cho thấy sự phát triển vượt bậc của y sinh học. Đây là cơ hội thuận lợi để người bệnh có thể tìm ra phương thức xử lý khi phát hiện ở giai đoạn sớm...',
  },
  {
    id: 2,
    name: 'GS.TS Phạm Như Hiệp',
    title: 'Giám đốc Bệnh viện',
    affiliation: 'Bệnh viện Trung ương Huế',
    image: 'https://placehold.co/100x100/EBF8FF/3182CE?text=GS.TS+Hiệp', // Thay bằng ảnh thật
    quote:
      'Giữa bối cảnh đại dịch COVID-19, tầm soát ung thư bằng xét nghiệm gen như muốn gióng lên hồi chuông báo động rằng bệnh nhân ung thư nói chung cũng như ung thư vú nói riêng...',
  },
  // 2 chuyên gia thêm vào
  {
    id: 3,
    name: 'PGS.TS Trần Hồng Vân',
    title: 'Phó Trưởng khoa Xét nghiệm',
    affiliation: 'Bệnh viện Đại học Y Hà Nội',
    image: 'https://placehold.co/100x100/EBF8FF/3182CE?text=PGS.TS+Vân', // Thay bằng ảnh thật
    quote:
      'Việc ứng dụng công nghệ gen trong y học chính xác mở ra tương lai mới. Nó không chỉ giúp phát hiện bệnh sớm mà còn định hướng điều trị trúng đích hiệu quả cho bệnh nhân.',
  },
  {
    id: 4,
    name: 'ThS.BS Bùi Kiều Yến Trang',
    title: 'Bác sĩ di truyền',
    affiliation: 'Bệnh viện Từ Dũ',
    image: 'https://placehold.co/100x100/EBF8FF/3182CE?text=BS.Trang', // Thay bằng ảnh thật
    quote:
      'Sàng lọc NIPT và các xét nghiệm di truyền tiền làm tổ (PGT) đã giúp hàng ngàn cặp vợ chồng thực hiện hóa giấc mơ có một thai kỳ khỏe mạnh và an toàn tuyệt đối.',
  },
];

// --- COMPONENT CHÍNH ---

export default function ExpertOpinions() {
  // Vì có 4 experts, hiển thị 2 một lúc, nên chúng ta có 2 "trang" (index 0 và 1)
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(allExperts.length / 2); // = 2

  // Tự động chuyển trang sau 5 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
    }, 5000); // 5 giây

    return () => clearInterval(timer); // Xóa timer khi component unmount
  }, [totalPages]);

  // Lấy 2 chuyên gia để hiển thị dựa trên trang hiện tại
  const expertsToShow = allExperts.slice(currentPage * 2, currentPage * 2 + 2);

  return (
    <section
      id="y-kien-chuyen-gia"
      // ✅ THAY ĐỔI: Giảm padding tổng thể 'py-24' -> 'py-16'
      className="relative w-full overflow-hidden py-16"
    >
      {/* Ảnh Nền */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        // THAY THẾ: /images/expert-background.jpg
        src="https://res.cloudinary.com/da6f4dmql/image/upload/v1763437102/a%CC%82sssa_lyar4l.jpg"
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Lớp Phủ Tối 50% */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Container Nội dung */}
      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        {/* Tiêu đề Section */}
        <div className="mb-0 text-left">
          <h2 className="text-3xl font-extrabold text-white md:text-4xl">
            Ý KIẾN CHUYÊN GIA
          </h2>
          {/* Đường gạch ngang */}
          <div className="mt-4 h-1.5 w-24 rounded-full bg-cyan-400"></div>
        </div>

        {/* Grid 2 Cột (Nội dung chính) */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* === CỘT TRÁI: COMMENT LỚN === */}
          <div className="flex flex-col justify-center text-white">
            <Quote
              // ✅ Giảm kích thước icon: h-20 w-20 -> h-16 w-16
              className="h-16 w-16 text-cyan-400/50"
              fill="currentColor"
            />
            {/* ✅ SỬA LỖI: Đã thay dấu " bằng &quot; để tránh lỗi biên dịch */}
            <p className="mt-4 text-xl font-light italic leading-relaxed md:text-2xl">
              &quot;Trong suốt hành trình 8 năm, **GennovaX** tự hào đã đồng hành và giúp đỡ
              được hàng trăm ngàn thai phụ, bệnh nhi, người mắc bệnh ung thư...
              2.200.000+ xét nghiệm gen được thực hiện mang đến ảnh hưởng
              tích cực cho việc sàng lọc và phát hiện bệnh sớm.&quot;
            </p>
            {/* ✅ Giảm font: xl -> lg */}
            <p className="mt-6 text-lg font-semibold text-cyan-300">
              — GennovaX
            </p>
          </div>

          {/* === CỘT PHẢI: SLIDER CHUYÊN GIA === */}
          <div className="flex flex-col">
            {/* Vùng chứa 2 Card (Slider) */}
            <div className="space-y-6">
              {expertsToShow.map((expert) => (
                <div
                  key={expert.id}
                  className="rounded-2xl bg-white/90 p-6 shadow-xl backdrop-blur-md transition-all duration-500 ease-in-out"
                >
                  {/* Header của Card (Ảnh + Tên) */}
                  <div className="flex items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={expert.image}
                      alt={expert.name}
                      // ✅ Giảm kích thước ảnh: h-20 w-20 -> h-16 w-16
                      className="h-16 w-16 flex-shrink-0 rounded-full border-4 border-cyan-400 object-cover"
                    />
                    <div className="ml-5">
                      {/* ✅ Giảm font: xl -> lg */}
                      <h4 className="text-lg font-bold text-blue-900">
                        {expert.name}
                      </h4>
                      <p className="text-sm text-gray-600">{expert.title}</p>
                      <p className="text-sm text-gray-600">
                        {expert.affiliation}
                      </p>
                    </div>
                  </div>
                  {/* Đường kẻ */}
                  <hr className="my-4 border-cyan-200" />
                  {/* Quote của chuyên gia */}
                  {/* ✅ Giảm font: base -> sm */}
                  <p className="text-sm text-gray-700">{expert.quote}</p>
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            <div className="mt-8 flex justify-center space-x-3">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`h-3 w-3 rounded-full transition-all duration-300
                    ${currentPage === index ? 'w-6 bg-cyan-400' : 'bg-white/50 hover:bg-white'}
                  `}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}