"use client";

import React, { useState, useEffect } from "react";
// import Image from 'next/image';
import { Quote } from "lucide-react";

// --- KIỂU DỮ LIỆU ---
interface Expert {
  id: number;
  name: string;
  title: string;
  affiliation: string;
  image: string;
  quote: string;
}

// --- DỮ LIỆU MOCK ---
const allExperts: Expert[] = [
  {
    id: 1,
    name: "TS.BS Phan Cảnh Duy",
    title: "Phó Trưởng khoa Xét nghiệm",
    affiliation: "Trung tâm Ung Bướu, Bệnh viện Trung ương Huế",
    image:
      "https://benhviennoitiet.vn/wp-content/uploads/2023/12/A-Hiep-web.jpg",
    quote:
      "Tầm soát ung thư bằng xét nghiệm gen cho thấy sự phát triển vượt bậc của y sinh học. Đây là cơ hội thuận lợi để người bệnh có thể tìm ra phương thức xử lý khi phát hiện ở giai đoạn sớm...",
  },
  {
    id: 2,
    name: "GS.TS Phạm Như Hiệp",
    title: "Giám đốc Bệnh viện",
    affiliation: "Bệnh viện Trung ương Huế",
    image:
      "https://suckhoedoisong.qltns.mediacdn.vn/thumb_w/600/324455921873985536/2024/3/3/4296080207853344429926277667541941839027269n-17094331232751762434977-155-0-1139-984-crop-17094332140561102974289.jpg",
    quote:
      "Giữa bối cảnh đại dịch COVID-19, tầm soát ung thư bằng xét nghiệm gen như muốn gióng lên hồi chuông báo động rằng bệnh nhân ung thư nói chung cũng như ung thư vú nói riêng...",
  },
  {
    id: 3,
    name: "PGS.TS Trần Hồng Vân",
    title: "Phó Trưởng khoa Xét nghiệm",
    affiliation: "Bệnh viện Đại học Y Hà Nội",
    image:
      "https://benhvienchamcuu.com/public_folder/image/2020/06/16/1592281740_74649_ts-pham-hong-van-vjpg.jpg",
    quote:
      "Việc ứng dụng công nghệ gen trong y học chính xác mở ra tương lai mới. Nó không chỉ giúp phát hiện bệnh sớm mà còn định hướng điều trị trúng đích hiệu quả cho bệnh nhân.",
  },
  {
    id: 4,
    name: "ThS.BS Bùi Kiều Yến Trang",
    title: "Bác sĩ di truyền",
    affiliation: "Bệnh viện Từ Dũ",
    image:
      "https://trungtamadn.com/wp-content/uploads/2023/05/bui-kieu-yen-tran.jpg",
    quote:
      "Sàng lọc NIPT và các xét nghiệm di truyền tiền làm tổ (PGT) đã giúp hàng ngàn cặp vợ chồng thực hiện hóa giấc mơ có một thai kỳ khỏe mạnh và an toàn tuyệt đối.",
  },
];

// --- COMPONENT CHÍNH ---

export default function ExpertOpinions() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(allExperts.length / 2);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPage((prevPage) => (prevPage + 1) % totalPages);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalPages]);

  const expertsToShow = allExperts.slice(currentPage * 2, currentPage * 2 + 2);

  return (
    <section
      id="y-kien-chuyen-gia"
      className="relative w-full overflow-hidden py-8 lg:py-16"
    >
      {/* Ảnh Nền */}
      <img
        src="https://res.cloudinary.com/da6f4dmql/image/upload/v1765253697/dna-strand_oxdt8a.jpg"
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        {/* Tiêu đề Section */}
        <div className="mb-0 text-left">
          <h2 className="text-xl lg:text-3xl font-extrabold text-white md:text-4xl">
            Ý KIẾN CHUYÊN GIA
          </h2>
          <div className="mt-4 h-1.5 w-24 rounded-full bg-cyan-400"></div>
        </div>

        {/* Grid 2 Cột */}
        <div className="grid grid-cols-1 gap-8 md:gap-12 md:grid-cols-2 mt-8 md:mt-12">
          {/* === CỘT TRÁI: COMMENT LỚN === */}
          <div className="flex flex-col justify-center text-white">
            <Quote
              className="h-12 w-12 lg:h-16 lg:w-16 text-cyan-400/50"
              fill="currentColor"
            />
            <p className="mt-4 text-sm lg:text-xl font-light italic leading-relaxed md:text-2xl">
              &quot;Trong suốt hành trình, GennovaX tự hào đã đồng hành và giúp
              đỡ được hàng trăm ngàn thai phụ, bệnh nhi,... 200.000+ xét nghiệm
              gen được thực hiện mang đến ảnh hưởng tích cực cho việc sàng lọc
              và phát hiện bệnh sớm.&quot;
            </p>
            <p className="mt-6 text-lg font-semibold text-cyan-300">
              — GennovaX
            </p>
          </div>

          {/* === CỘT PHẢI: SLIDER CHUYÊN GIA (Đã chỉnh sửa) === */}
          <div className="flex flex-col overflow-hidden">
            {/* THAY ĐỔI TẠI ĐÂY: 
                Mobile: flex row, overflow-x-auto (trượt ngang)
                Desktop (md): block, space-y-6 (xếp dọc như cũ)
            */}
            <div
              className="
                flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory 
                md:block md:space-y-6 md:pb-0 md:overflow-visible
                scrollbar-hide
            "
            >
              {expertsToShow.map((expert) => (
                <div
                  key={expert.id}
                  className="
                    w-[85vw] flex-shrink-0 snap-center md:w-auto
                    rounded-2xl bg-white/90 p-6 shadow-xl backdrop-blur-md transition-all duration-500 ease-in-out
                  "
                >
                  {/* Header của Card */}
                  <div className="flex items-center">
                    <img
                      src={expert.image}
                      alt={expert.name}
                      className="h-16 w-16 flex-shrink-0 rounded-full border-4 border-cyan-400 object-cover"
                    />
                    <div className="ml-5">
                      <h4 className="text-lg font-bold text-blue-900">
                        {expert.name}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {expert.title}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {expert.affiliation}
                      </p>
                    </div>
                  </div>
                  <hr className="my-4 border-cyan-200" />
                  <p className="text-sm text-gray-700 line-clamp-4">
                    {expert.quote}
                  </p>
                </div>
              ))}
            </div>

            {/* Pagination Dots */}
            <div className="mt-4 md:mt-8 flex justify-center space-x-3">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`h-3 w-3 rounded-full transition-all duration-300
                    ${currentPage === index ? "w-6 bg-cyan-400" : "bg-white/50 hover:bg-white"}
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
