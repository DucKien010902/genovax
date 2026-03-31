"use client";

import React, { useState, useEffect } from "react";
import { Quote } from "lucide-react";

interface Expert {
  id: number;
  name: string;
  title: string;
  affiliation: string;
  image: string;
  quote: string;
}

const allExperts: Expert[] = [
  {
    id: 1,
    name: "TS.BS Phan Cảnh Duy",
    title: "Phó Trưởng khoa Xét nghiệm",
    affiliation: "Trung tâm Ung Bướu, Bệnh viện Trung Ương Huế",
    image:
      "https://benhviennoitiet.vn/wp-content/uploads/2023/12/A-Hiep-web.jpg",
    quote:
      "Tầm soát ung thư bằng xét nghiệm gen cho thấy sự phát triển vượt bậc của y sinh học. Đây là cơ hội thuận lợi để người bệnh có thể tìm ra phương thức xử lý khi phát hiện ở giai đoạn sớm...",
  },
  {
    id: 2,
    name: "GS.TS Phạm Như Hiệp",
    title: "Giám đốc Bệnh viện",
    affiliation: "Bệnh viện Trung Ương Huế",
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
      className="relative w-full overflow-hidden py-14 lg:py-20"
    >
      <img
        src="https://res.cloudinary.com/da6f4dmql/image/upload/v1765253697/dna-strand_oxdt8a.jpg"
        alt="Background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(3,7,18,0.94)_0%,rgba(6,24,44,0.88)_48%,rgba(9,52,95,0.86)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(96,165,250,0.16),transparent_24%)]" />

      <div className="container relative z-10 mx-auto max-w-6xl px-4">
        <div className="text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-semibold text-cyan-100 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-cyan-300" />
            Chuyên gia đồng hành
          </div>
          <h2 className="mt-5 text-3xl font-extrabold text-white md:text-5xl">
            Ý kiến chuyên gia
          </h2>
          <div className="mt-4 h-1.5 w-24 rounded-full bg-cyan-400"></div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:mt-12 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-12">
          <div className="flex flex-col justify-center rounded-[2rem] border border-white/10 bg-white/6 p-6 text-white backdrop-blur-md md:p-8">
            <Quote
              className="h-12 w-12 text-cyan-400/50 lg:h-16 lg:w-16"
              fill="currentColor"
            />
            <p className="mt-5 text-base font-light italic leading-8 text-slate-100/92 md:text-2xl lg:text-xl">
              &quot;Trong suốt hành trình, GennovaX tự hào đã đồng hành và giúp
              đỡ được hàng trăm ngàn thai phụ, bệnh nhi,... 200.000+ xét nghiệm
              gen được thực hiện mang đến ảnh hưởng tích cực cho việc sàng lọc
              và phát hiện bệnh sớm.&quot;
            </p>
            <p className="mt-6 text-lg font-semibold text-cyan-300">
              — GennovaX
            </p>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-300/86">
              Section tối được giữ lại để tạo nhịp thị giác, nhưng chuyển sang
              chất liệu glass và ánh sáng mềm để mượt hơn bản cũ.
            </p>
          </div>

          <div className="flex flex-col overflow-hidden">
            <div
              className="
                flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory
                md:block md:space-y-6 md:overflow-visible md:pb-0
                scrollbar-hide
              "
            >
              {expertsToShow.map((expert) => (
                <div
                  key={expert.id}
                  className="
                    w-[85vw] flex-shrink-0 snap-center md:w-auto
                    rounded-[2rem] border border-white/12 bg-white/10 p-6
                    shadow-[0_24px_70px_rgba(2,6,23,0.18)] backdrop-blur-xl
                    transition-all duration-500 ease-in-out
                  "
                >
                  <div className="flex items-center">
                    <img
                      src={expert.image}
                      alt={expert.name}
                      className="h-16 w-16 flex-shrink-0 rounded-full border-4 border-cyan-300/80 object-cover"
                    />
                    <div className="ml-5">
                      <h4 className="text-lg font-bold text-white">
                        {expert.name}
                      </h4>
                      <p className="line-clamp-1 text-sm text-slate-200/82">
                        {expert.title}
                      </p>
                      <p className="line-clamp-1 text-sm text-slate-300/75">
                        {expert.affiliation}
                      </p>
                    </div>
                  </div>
                  <hr className="my-4 border-white/10" />
                  <p className="line-clamp-4 text-sm leading-7 text-slate-100/88">
                    {expert.quote}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-center space-x-3 md:mt-8">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`h-3 w-3 rounded-full transition-all duration-300 ${
                    currentPage === index
                      ? "w-6 bg-cyan-400"
                      : "bg-white/40 hover:bg-white"
                  }`}
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
