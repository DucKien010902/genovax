// src/components/AboutGennovax.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  CpuFill,
  Journals,
  PersonVcardFill,
  ArrowRight,
} from "react-bootstrap-icons";

/* =======================
PILLAR ITEM (đồng bộ card)
======================= */
const PillarItem: React.FC<{
  icon: React.ComponentType<{ size?: number | string }>;
  title: string;
  children: React.ReactNode;
}> = ({ icon: Icon, title, children }) => (
  <div
    className="
      flex items-start gap-4
      rounded-3xl bg-white/90 p-5 sm:p-6
      ring-1 ring-blue-900/10 shadow-sm
    "
  >
    {/* Icon */}
    <div
      className="
        flex-shrink-0 h-12 w-12 rounded-2xl
        bg-blue-50 text-blue-800
        ring-1 ring-blue-200/70
        flex items-center justify-center
      "
    >
      <Icon size={22} />
    </div>

    {/* Content */}
    <div className="min-w-0">
      <h4 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
        {title}
      </h4>
      <p className="mt-1 text-sm sm:text-base text-slate-600 leading-relaxed">
        {children}
      </p>
    </div>
  </div>
);

/* =======================
BUTTONS (nhạt, trong suốt)
======================= */
const SoftButton: React.FC<{
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}> = ({ href, children, variant = "primary" }) => {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition " +
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2";

  const primary =
    "text-blue-800 bg-blue-50/80 ring-1 ring-blue-200/70 backdrop-blur " +
    "hover:bg-blue-50 hover:ring-blue-300";

  const secondary =
    "text-slate-700 bg-white/80 ring-1 ring-slate-200/80 backdrop-blur " +
    "hover:bg-white hover:ring-slate-300";

  return (
    <Link
      href={href}
      className={`${base} ${variant === "primary" ? primary : secondary}`}
    >
      {children}
    </Link>
  );
};

/* =======================
NAV BUTTON (nhạt, trong suốt)
======================= */
const NavButton: React.FC<{ text: string; href: string }> = ({
  text,
  href,
}) => (
  <Link
    href={href}
    className="
      group inline-flex w-full items-center justify-between gap-3
      rounded-2xl px-4 py-3 text-sm sm:text-base font-semibold
      text-white
      bg-gradient-to-r from-blue-700 via-blue-800 to-sky-700
      shadow-[0_10px_30px_rgba(2,132,199,0.25)]
      ring-1 ring-white/10
      hover:from-blue-800 hover:via-blue-900 hover:to-sky-800
      active:scale-[0.99]
      focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 focus-visible:ring-offset-2
      transition
    "
  >
    <span className="min-w-0 line-clamp-1 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]">
      {text}
    </span>
    <ArrowRight
      className="text-white/90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] transition-transform group-hover:translate-x-0.5"
      size={16}
    />
  </Link>
);

/* =======================
MAIN
======================= */
const AboutGennovax: React.FC = () => {
  const imageUrl =
    "https://res.cloudinary.com/da6f4dmql/image/upload/v1764750460/shutterstock_1770401555_hmmobk.jpg";

  return (
    <section className="relative py-10 lg:py-16">
      {/* Background đồng bộ “medical overlay” */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/70 via-white/40 to-white/70" />
      <div className="absolute inset-0 bg-white/50" />

      <div className="relative mx-auto max-w-7xl px-4">
        {/* Header đồng bộ */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 ring-1 ring-blue-900/10 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            <span className="text-xs sm:text-sm font-semibold text-blue-700">
              Về GennovaX
            </span>
          </div>

          <h2 className="mt-4 text-xl sm:text-2xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            Vì sao chọn <span className="text-blue-700">GennovaX</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Tiên phong ứng dụng NGS và AI trong y học chính xác, hướng tới chăm
            sóc sức khỏe chủ động cho người Việt.
          </p>
        </div>

        {/* Grid nội dung */}
        <div className="mt-8 lg:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          {/* LEFT: Image + quick links + CTA (đưa CTA sang trái cho cân) */}
          <div className="flex flex-col gap-6">
            {/* Image card */}
            <div
              className="
                group relative overflow-hidden rounded-3xl bg-white
                ring-1 ring-blue-900/10 shadow-sm
              "
            >
              {/* Accent line */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500" />

              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl">
                <Image
                  src={imageUrl}
                  alt="Phòng thí nghiệm GennovaX"
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/35 via-slate-950/10 to-transparent" />
              </div>

              {/* Caption */}
              <div className="p-4 sm:p-5">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  Hạ tầng xét nghiệm & vận hành chuẩn hóa
                </h3>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  Quy trình kiểm soát chất lượng, bảo mật dữ liệu và thời gian
                  trả kết quả tối ưu.
                </p>
              </div>
            </div>

            {/* 4 quick buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <NavButton
                text="Hệ thống Lab hiện đại"
                href="/ve-gennovax#he-thong-gennovax"
              />
              <NavButton
                text="Đội ngũ bác sỹ uy tín"
                href="/ve-gennovax#doi-ngu-va-thanh-tuu"
              />
              <NavButton
                text="Độ phủ toàn quốc"
                href="/ve-gennovax#he-thong-gennovax"
              />
              <NavButton
                text="Hệ sinh thái đối tác lớn"
                href="/ve-gennovax#doi-tac-va-thuyet-bi"
              />
            </div>

            {/* CTA tổng chuyển sang cột trái + style nhạt trong suốt */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <SoftButton href="/ve-gennovax" variant="primary">
                Tìm hiểu thêm về GennovaX
              </SoftButton>
              <SoftButton href="/" variant="secondary">
                Liên hệ tư vấn
              </SoftButton>
            </div>

            {/* Hint nhỏ (tạo cảm giác y tế hiện đại) */}
            <div className="rounded-3xl bg-white/80 ring-1 ring-blue-900/10 p-4 sm:p-5 shadow-sm">
              <p className="text-xs font-semibold text-blue-700">Cam kết</p>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                Bảo mật thông tin, quy trình chuẩn hóa và tư vấn theo hướng cá
                nhân hóa.
              </p>
            </div>
          </div>

          {/* RIGHT: text + pillars */}
          <div className="pt-1">
            <h3 className="text-2xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
              Tiên phong Tương lai Y học qua{" "}
              <span className="text-blue-700">Lăng kính Di truyền</span>
            </h3>

            <p className="mt-5 text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed">
              Sứ mệnh của chúng tôi là ứng dụng công nghệ giải trình tự gen
              (NGS) thế hệ mới và Trí tuệ nhân tạo (AI) để cung cấp các giải
              pháp y học chính xác.
            </p>

            <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed">
              GennovaX giúp người Việt tiếp cận dịch vụ tầm soát, chẩn đoán và
              điều trị cá thể hóa với{" "}
              <strong className="text-blue-800">độ chính xác vượt trội</strong>{" "}
              và <strong className="text-blue-800">chi phí hợp lý</strong>, đặt
              nền móng cho một tương lai chăm sóc sức khỏe chủ động.
            </p>

            {/* Pillars */}
            <div className="mt-8 space-y-4">
              <PillarItem icon={CpuFill} title="Công nghệ Vượt trội">
                Sử dụng nền tảng Big Data và AI để phân tích dữ liệu gen, tối ưu
                tốc độ xử lý và độ chính xác.
              </PillarItem>

              <PillarItem icon={PersonVcardFill} title="Y học Cá thể hóa">
                Giải mã gen để xây dựng khuyến nghị phòng ngừa và phác đồ phù
                hợp với hệ gen của từng cá nhân.
              </PillarItem>

              <PillarItem icon={Journals} title="Nghiên cứu Tiên phong">
                Liên tục R&D và hợp tác để phát triển xét nghiệm mới, cập nhật
                xu hướng y học toàn cầu.
              </PillarItem>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutGennovax;
