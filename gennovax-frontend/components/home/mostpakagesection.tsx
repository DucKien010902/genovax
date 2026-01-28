"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import { CalendarCheckFill, InfoCircleFill } from "react-bootstrap-icons";
import ConsultationModal from "./ConsultationModal";

/* =======================
1. TYPE
======================= */
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
      "Sử dụng 01 mẫu máu mẹ và 01 mẫu bất kỳ của cha (móng tay, tóc, bàn chải...). Áp dụng cho thai từ 7 tuần. Độ chính xác: 99,9999%. Bảo mật tuyệt đối. Trả kết quả sau 3–5 ngày làm việc.",
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
      "Phát hiện lệch bội toàn bộ 22 cặp NST thường và 5 hội chứng giới tính: Turner (XO), tam nhiễm X (XXX), Klinefelter (XXY), Klinefelter mở rộng (XXXY), Jacobs (XYY). Áp dụng cho thai đơn từ 9 tuần. Thời gian trả kết quả: 3–5 ngày làm việc.",
    mainImageUrl:
      "https://res.cloudinary.com/da6f4dmql/image/upload/v1764579968/571157271_122148617522870117_6835087446376933824_n_tbex8y.jpg",
    smallLogoUrl: "/images/genbio1.png",
    linkto: "/dich-vu/NIPT",
  },
];

/* =======================
UI helpers
======================= */
function classNames(...s: Array<string | false | undefined>) {
  return s.filter(Boolean).join(" ");
}

/* =======================
PACKAGE CARD (Modern medical)
======================= */
const PackageCard: React.FC<{
  pkg: PackageDetails;
  onConsult: () => void;
}> = ({ pkg, onConsult }) => {
  return (
    <article
      className="
        group relative overflow-hidden rounded-3xl bg-white
        ring-1 ring-blue-900/10 shadow-sm
        transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-blue-900/20
      "
    >
      {/* Accent line (medical blue) */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500" />

      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4 p-4 sm:p-5">
        {/* Image */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl bg-slate-100">
            <img
              src={pkg.mainImageUrl}
              alt={pkg.name}
              className="
                h-40 w-full object-cover
                transition-transform duration-500 group-hover:scale-[1.03]
              "
              loading="lazy"
            />
            {/* Soft overlay for medical feel */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
          </div>

          {/* Logo badge */}
          <div
            className="
              mt-2 lg:mt-3
              flex items-center gap-2 rounded-2xl bg-white/90 px-3 py-2
              shadow-sm ring-1 ring-black/5 backdrop-blur hidden lg:flex
            "
          >
            <span className="h-8 w-8 overflow-hidden rounded-xl bg-white ring-1 ring-blue-900/10">
              <img
                src={pkg.smallLogoUrl}
                alt="logo"
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </span>
            <span className="text-[11px] font-semibold text-slate-700">
              Dịch vụ phổ biến
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between gap-4 pt-2 sm:pt-0">
          <header className="space-y-2">
            <h3 className="text-base sm:text-lg lg:text-xl font-bold leading-snug text-slate-900">
              {pkg.name}
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              {pkg.tagline}
            </p>

            <div className="hidden lg:block">
              <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                {pkg.description}
              </p>
            </div>
          </header>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Link
              href={pkg.linkto}
              className="
                inline-flex items-center justify-center gap-2
                rounded-2xl px-4 py-3 text-sm font-semibold
                text-white shadow-sm
                bg-gradient-to-r from-blue-600 to-blue-800
                hover:from-blue-700 hover:to-blue-900
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 focus-visible:ring-offset-2
                transition
              "
            >
              <InfoCircleFill className="shrink-0" />
              Tìm hiểu thêm
            </Link>

            <button
              onClick={onConsult}
              className="
                inline-flex items-center justify-center gap-2
                rounded-2xl px-4 py-3 text-sm font-semibold
                text-blue-800 bg-blue-50
                ring-1 ring-blue-200/70
                hover:bg-blue-100 hover:ring-blue-300
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 focus-visible:ring-offset-2
                transition
              "
              type="button"
            >
              <CalendarCheckFill className="shrink-0" />
              Đặt hẹn tư vấn
            </button>
          </div>

          {/* Small hint on mobile */}
          <p className="lg:hidden text-xs text-slate-500 line-clamp-2">
            {pkg.description}
          </p>
        </div>
      </div>
    </article>
  );
};

/* =======================
MAIN SECTION (Modern hero + grid)
======================= */
const PopularPackages: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const title = useMemo(() => {
    return {
      badge: "Gói Xét Nghiệm",
      main: "Phổ Biến",
      sub: "Chọn gói phù hợp và đặt lịch tư vấn nhanh với đội ngũ chuyên môn.",
    };
  }, []);

  return (
    <section className="relative py-10 lg:py-16">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/da6f4dmql/image/upload/v1765522605/shutterstock_1530550610_effhxj.jpg')",
        }}
      />
      {/* Medical overlay: clean + readable */}
      <div className="absolute inset-0 bg-white/80" />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/70 via-white/40 to-white/70" />

      <div className="relative mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 ring-1 ring-blue-900/10 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            <span className="text-xs sm:text-sm font-semibold text-blue-700">
              {title.badge}
            </span>
          </div>

          <h2 className="mt-4 text-xl sm:text-2xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            {title.main} <span className="text-blue-700">nhất</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            {title.sub}
          </p>
        </div>

        {/* Grid */}
        <div className="mt-8 lg:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-7">
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

        {/* More */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/dich-vu"
            className="
              inline-flex items-center justify-center
              rounded-full px-6 py-3 text-sm sm:text-base font-semibold
              text-blue-700 bg-white/90
              ring-1 ring-blue-900/10 shadow-sm
              hover:bg-white hover:ring-blue-900/20
              transition
            "
          >
            Xem tất cả gói xét nghiệm →
          </Link>
        </div>
      </div>

      {/* MODAL */}
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultService={selectedService}
      />
    </section>
  );
};

export default PopularPackages;
