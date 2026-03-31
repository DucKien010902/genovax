"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import { CalendarCheckFill, InfoCircleFill } from "react-bootstrap-icons";
import ConsultationModal from "./ConsultationModal";

export type PackageDetails = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  mainImageUrl: string;
  smallLogoUrl: string;
  linkto: string;
};

const popularPackagesData: PackageDetails[] = [
  {
    id: "adn-truoc-sinh-10ngay",
    name: "Xét nghiệm ADN Cha Con Trước Sinh (Không xâm lấn)",
    tagline: "Sử dụng 01 mẫu bố giả định và 01 mẫu máu mẹ.",
    description:
      "Sử dụng 01 mẫu máu mẹ và 01 mẫu bất kỳ của cha (móng tay, tóc, bàn chải...). Áp dụng cho thai từ 7 tuần. Độ chính xác: 99,9999%. Bảo mật tuyệt đối. Trả kết quả sau 3-5 ngày làm việc.",
    mainImageUrl:
      "https://res.cloudinary.com/da6f4dmql/image/upload/v1764579968/500087657_122108016806870117_710668953486729298_n_wmcxfk.jpg",
    smallLogoUrl: "/images/genbio1.png",
    linkto: "/dich-vu/DNA",
  },
  {
    id: "geni-8",
    name: "Xét nghiệm sàng lọc NIPT - Geni 8",
    tagline:
      "Phát hiện lệch bội 3 cặp NST (13, 18, 21) và 5 hội chứng NST giới tính.",
    description:
      "Phát hiện lệch bội 3 cặp NST (13, 18, 21) và 5 hội chứng NST giới tính (Turner, Tam nhiễm X, Klinefelter, Jacobs, XXXY). Dành cho thai đơn từ 9 tuần. Kết quả có từ sau 3-5 ngày làm việc.",
    mainImageUrl:
      "https://res.cloudinary.com/da6f4dmql/image/upload/v1764579968/496506308_122100963794870117_1449912006591196456_n_j34mr5.jpg",
    smallLogoUrl: "/images/genbio1.png",
    linkto: "/dich-vu/NIPT",
  },
  {
    id: "adn-phap-ly-2-mau-1-2ngay",
    name: "Xét nghiệm ADN (Pháp lý - 2 mẫu)",
    tagline: "Xác định quan hệ huyết thống chuẩn pháp lý.",
    description:
      "Phục vụ thủ tục pháp lý: nhập tịch, định cư nước ngoài... (Dành cho 2 mẫu/1 kết quả). Dùng cho các thủ tục như làm khai sinh, nhận cha/mẹ/con. Độ chính xác cao 99,9999%. Thời gian trả kết quả: 1-2 ngày làm việc.",
    mainImageUrl:
      "https://res.cloudinary.com/da6f4dmql/image/upload/v1764579968/496942572_122098102940870117_1791812201739354939_n_efjixl.jpg",
    smallLogoUrl: "/images/genbio1.png",
    linkto: "/dich-vu/DNA",
  },
  {
    id: "geni-23",
    name: "Xét nghiệm sàng lọc NIPT - Geni 23",
    tagline:
      "Phát hiện lệch bội toàn bộ 22 cặp NST thường và 5 hội chứng NST giới tính.",
    description:
      "Phát hiện lệch bội toàn bộ 22 cặp NST thường và 5 hội chứng giới tính: Turner (XO), tam nhiễm X (XXX), Klinefelter (XXY), Klinefelter mở rộng (XXXY), Jacobs (XYY). Áp dụng cho thai đơn từ 9 tuần. Thời gian trả kết quả: 3-5 ngày làm việc.",
    mainImageUrl:
      "https://res.cloudinary.com/da6f4dmql/image/upload/v1764579968/571157271_122148617522870117_6835087446376933824_n_tbex8y.jpg",
    smallLogoUrl: "/images/genbio1.png",
    linkto: "/dich-vu/NIPT",
  },
];

function PackageCard({
  pkg,
  onConsult,
}: {
  pkg: PackageDetails;
  onConsult: () => void;
}) {
  return (
    <article className="group relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/92 shadow-[0_24px_60px_rgba(148,163,184,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_32px_80px_rgba(14,165,233,0.18)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-700" />

      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[190px_1fr] sm:p-5">
        <div className="relative">
          <div className="relative overflow-hidden rounded-[1.5rem] bg-slate-100">
            <img
              src={pkg.mainImageUrl}
              alt={pkg.name}
              className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/8 to-transparent" />
          </div>

          <div className="mt-3 hidden rounded-2xl border border-slate-100 bg-slate-50/80 px-3 py-2 lg:flex lg:items-center lg:gap-2">
            <span className="h-8 w-8 overflow-hidden rounded-xl bg-white ring-1 ring-blue-900/10">
              <img
                src={pkg.smallLogoUrl}
                alt="logo"
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-sky-800">
              Popular service
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 pt-1">
          <header className="space-y-2">
            <h3 className="text-base font-bold leading-snug text-slate-900 sm:text-lg lg:text-xl">
              {pkg.name}
            </h3>

            <p className="text-sm leading-7 text-slate-600">{pkg.tagline}</p>

            <div className="hidden lg:block">
              <p className="line-clamp-3 text-sm leading-7 text-slate-600">
                {pkg.description}
              </p>
            </div>
          </header>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href={pkg.linkto}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-800 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-sky-700 hover:to-blue-900"
            >
              <InfoCircleFill className="shrink-0" />
              Tìm hiểu thêm
            </Link>

            <button
              onClick={onConsult}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-800 transition hover:bg-sky-100"
              type="button"
            >
              <CalendarCheckFill className="shrink-0" />
              Đặt hẹn tư vấn
            </button>
          </div>

          <p className="text-xs text-slate-500 lg:hidden line-clamp-2">
            {pkg.description}
          </p>
        </div>
      </div>
    </article>
  );
}

const PopularPackages: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const title = useMemo(
    () => ({
      badge: "Gói xét nghiệm",
      main: "Phổ biến",
      sub: "Chọn gói phù hợp và đặt lịch tư vấn nhanh với đội ngũ chuyên môn.",
    }),
    [],
  );

  return (
    <section className="relative py-14 lg:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.18),transparent_28%),linear-gradient(180deg,rgba(248,252,255,0.98)_0%,rgba(240,248,252,0.96)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 ring-1 ring-sky-200 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              <span className="text-xs font-semibold text-sky-800 sm:text-sm">
                {title.badge}
              </span>
            </div>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-6xl">
              {title.main} <span className="text-sky-700">nhất</span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              {title.sub}
            </p>

          {/* <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-3xl border border-white/70 bg-white/90 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">
                Curated
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Nhóm gói xét nghiệm được hiển thị lại theo cảm giác gọn và cao
                cấp hơn.
              </p>
            </div>
            <div className="rounded-3xl border border-sky-100 bg-sky-50/80 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-800">
                Quick action
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                CTA sáng hơn, sạch hơn và ít cảm giác banner quảng cáo.
              </p>
            </div>
          </div> */}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 lg:mt-12 lg:grid-cols-2 lg:gap-7">
          {popularPackagesData.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              onConsult={() => {
                setSelectedService(pkg.name);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/dich-vu"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-sky-800 ring-1 ring-sky-100 shadow-[0_18px_40px_rgba(148,163,184,0.12)] transition hover:-translate-y-0.5 hover:bg-sky-50 sm:text-base"
          >
            Xem tất cả gói xét nghiệm →
          </Link>
        </div>
      </div>

      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultService={selectedService}
      />
    </section>
  );
};

export default PopularPackages;
