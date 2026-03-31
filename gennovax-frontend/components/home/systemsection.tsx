"use client";

import React from "react";
import Link from "next/link";
import { Star, Clock, Zap, Check, Handshake } from "lucide-react";

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
    <div className="group relative w-[85vw] flex-shrink-0 snap-center rounded-[2rem] border border-white/80 bg-white p-5 shadow-[0_18px_46px_rgba(148,163,184,0.16)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_64px_rgba(14,165,233,0.16)] sm:w-auto sm:p-6">
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-[2rem] bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-700" />

      <div className="pt-1">
        <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 ring-1 ring-sky-200/70">
          <Icon className="h-6 w-6 text-sky-800" />
        </div>

        <h4 className="text-base font-bold text-slate-900 sm:text-lg">
          {title}
        </h4>

        <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
          {details.map((line, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-600/80" />
              <span className="leading-relaxed">{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function OurServiceSystem() {
  const PartnerIcon = partnership.icon;

  return (
    <section id="he-thong-dich-vu" className="relative py-14 lg:py-20">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#eff8fc_0%,#f9fdff_45%,#ffffff_100%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_65%)]" />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 ring-1 ring-sky-200 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-sky-500" />
            <span className="text-xs font-semibold text-sky-700 sm:text-sm">
              Hệ thống dịch vụ
            </span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-6xl">
            Chuẩn hóa vận hành <span className="text-sky-700">toàn quốc</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            Cam kết chất lượng, tốc độ xử lý và đồng hành cùng đối tác trên mọi
            điểm chạm dịch vụ.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 items-start gap-8 md:mt-12 md:grid-cols-5 md:gap-10">
          <div className="md:col-span-2">
            <div className="group relative overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_24px_70px_rgba(148,163,184,0.18)]">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-700" />

              <div className="relative overflow-hidden rounded-[2rem]">
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
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-800 transition hover:bg-sky-100 sm:text-base"
                >
                  Chuỗi 66 phòng xét nghiệm trên toàn quốc
                </Link>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div
              className="mt-0 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {commitments.map((item) => (
                <CommitmentCard
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  details={item.details}
                />
              ))}
            </div>

            <div className="relative mt-6 overflow-hidden rounded-[2rem] bg-gradient-to-r from-sky-700 to-blue-900 p-6 ring-1 ring-blue-900/20 shadow-[0_24px_80px_rgba(14,116,144,0.24)] sm:mt-8 sm:p-7">
              <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-cyan-400/20 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-sky-300/20 blur-2xl" />

              <div className="relative flex items-start gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                  <PartnerIcon className="h-6 w-6 text-white" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-bold leading-snug text-white sm:text-xl lg:text-2xl">
                    {partnership.title}
                  </h3>

                  <ul className="mt-4 space-y-3">
                    {partnership.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
                          <Check className="h-4 w-4 text-cyan-300" />
                        </span>
                        <span className="text-sm leading-7 text-blue-50 sm:text-base">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                    <Link
                      href="/doi-tac"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-blue-900 transition hover:bg-blue-50"
                    >
                      Tìm hiểu chương trình đối tác
                    </Link>

                    <Link
                      href="/lien-he"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                    >
                      Liên hệ hợp tác
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
