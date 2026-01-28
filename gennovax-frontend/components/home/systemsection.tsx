"use client";

import React from "react";
import Link from "next/link";
import { Star, Clock, Zap, Check, Handshake } from "lucide-react";

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

type CommitmentItem = {
  icon: React.ElementType;
  title: string;
  details: string[];
};

function CommitmentCard({ icon: Icon, title, details }: CommitmentItem) {
  return (
    <div
      className="
        group relative flex-shrink-0 w-[85vw] sm:w-auto
        rounded-3xl bg-white p-5 sm:p-6
        ring-1 ring-blue-900/10 shadow-sm
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl hover:ring-blue-900/20
        snap-center
      "
    >
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500" />

      <div className="pt-1">
        <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 ring-1 ring-blue-200/70">
          <Icon className="h-6 w-6 text-blue-800" />
        </div>

        <h4 className="text-base sm:text-lg font-bold text-slate-900">
          {title}
        </h4>

        <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
          {details.map((line, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600/80" />
              <span className="leading-relaxed">{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function OurServiceSystem() {
  const PartnerIcon = partnership.icon; // ✅ JSX component phải viết hoa

  return (
    <section id="he-thong-dich-vu" className="relative py-10 lg:py-16">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/70 via-white/40 to-white/70" />
      <div className="absolute inset-0 bg-white/50" />

      <div className="relative mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 ring-1 ring-blue-900/10 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            <span className="text-xs sm:text-sm font-semibold text-blue-700">
              Hệ thống dịch vụ
            </span>
          </div>

          <h2 className="mt-4 text-xl sm:text-2xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            Chuẩn hóa vận hành <span className="text-blue-700">toàn quốc</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Cam kết chất lượng, tốc độ xử lý và đồng hành cùng đối tác trên mọi
            điểm chạm dịch vụ.
          </p>
        </div>

        {/* Layout */}
        <div className="mt-8 lg:mt-12 grid grid-cols-1 items-start gap-8 md:grid-cols-5 md:gap-10">
          {/* CỘT ẢNH */}
          <div className="md:col-span-2">
            <div className="group relative overflow-hidden rounded-3xl bg-white ring-1 ring-blue-900/10 shadow-sm">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500" />

              <div className="relative overflow-hidden rounded-3xl">
                <img
                  src="https://res.cloudinary.com/da6f4dmql/image/upload/v1769481105/ChatGPT_Image_Jan_27_2026_09_31_12_AM_hdgtve.png"
                  alt="Hệ thống dịch vụ GennovaX"
                  className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-transparent" />
              </div>

              <div className="p-4 sm:p-5">
                <Link
                  href="/gioi-thieu/danh-sach-phong-kham"
                  className="
                    inline-flex w-full items-center justify-center
                    rounded-2xl px-4 py-3 text-sm sm:text-base font-semibold
                    text-blue-800 bg-blue-50
                    ring-1 ring-blue-200/70
                    hover:bg-blue-100 hover:ring-blue-300
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 focus-visible:ring-offset-2
                    transition
                  "
                >
                  Chuỗi 68 phòng xét nghiệm trên toàn quốc
                </Link>
              </div>
            </div>
          </div>

          {/* CỘT NỘI DUNG */}
          <div className="md:col-span-3">
            {/* CAM KẾT: mobile scroll ngang, desktop grid */}
            <div
              className="
                mt-0 flex gap-4 overflow-x-auto pb-4
                snap-x snap-mandatory
                lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0
              "
              style={{
                scrollbarWidth: "none", // Firefox
                msOverflowStyle: "none", // IE/Edge cũ
              }}
            >
              {/* Ẩn scrollbar WebKit bằng class đơn giản: nếu bạn có globals.css thì thêm đoạn CSS ở dưới */}
              {commitments.map((item) => (
                <CommitmentCard
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  details={item.details}
                />
              ))}
            </div>

            {/* ĐỒNG HÀNH */}
            <div className="mt-6 sm:mt-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 to-blue-900 p-6 sm:p-7 shadow-sm ring-1 ring-blue-900/20">
              <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-cyan-400/20 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-sky-300/20 blur-2xl" />

              <div className="relative flex items-start gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                  <PartnerIcon className="h-6 w-6 text-white" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white leading-snug">
                    {partnership.title}
                  </h3>

                  <ul className="mt-4 space-y-3">
                    {partnership.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                          <Check className="h-4 w-4 text-cyan-300" />
                        </span>
                        <span className="text-sm sm:text-base text-blue-50 leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-col sm:flex-row gap-2">
                    <Link
                      href="/doi-tac"
                      onClick={(e)=>{e.preventDefault()}}
                      className="
                        inline-flex items-center justify-center
                        rounded-2xl px-4 py-3 text-sm font-semibold
                        text-blue-900 bg-white
                        hover:bg-blue-50
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900
                        transition
                      "
                    >
                      Tìm hiểu chương trình đối tác
                    </Link>

                    <Link
                      href="/lien-he"
                      onClick={(e)=>{e.preventDefault()}}
                      className="
                        inline-flex items-center justify-center
                        rounded-2xl px-4 py-3 text-sm font-semibold
                        text-white bg-white/10
                        ring-1 ring-white/20
                        hover:bg-white/15 hover:ring-white/30
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-900
                        transition
                      "
                    >
                      Liên hệ hợp tác
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* end partnership */}
          </div>
        </div>
      </div>
    </section>
  );
}
