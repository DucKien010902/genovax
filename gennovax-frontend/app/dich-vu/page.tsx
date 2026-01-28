// src/components/Services.tsx
"use client";

import React, { useMemo, useState } from "react";
import {
  CalendarCheckFill,
  CashCoin,
  CheckCircleFill,
  ClockFill,
  PersonFill,
  PlusCircleFill,
  Search,
} from "react-bootstrap-icons";
import { ServicesData } from "@/data/service";
import { PackageDetails } from "@/types/service";
import ConsultationModal from "@/components/home/ConsultationModal";

/* =======================
1) Helpers
======================= */
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value);
};

const categories = [
  { key: "ALL", name: "Tất cả", count: ServicesData.length },
  {
    key: "NIPT",
    name: "Sàng lọc NIPT",
    count: ServicesData.filter((p) => p.category === "NIPT").length,
  },
  {
    key: "ADN",
    name: "Xét nghiệm ADN",
    count: ServicesData.filter((p) => p.category === "ADN").length,
  },
  {
    key: "GENE",
    name: "Gen lặn",
    count: ServicesData.filter((p) => p.category === "GENE").length,
  },
  {
    key: "HPV",
    name: "Sàng lọc HPV",
    count: ServicesData.filter((p) => p.category === "HPV").length,
  },
];

function cn(...s: Array<string | false | undefined>) {
  return s.filter(Boolean).join(" ");
}

/* =======================
2) Card (Medical-clean)
- FIX: Button luôn thẳng hàng trong cùng row:
  + <article> => flex flex-col
  + Body => flex-1
  + Footer => mt-auto shrink-0
======================= */
const PackageCard: React.FC<{
  pkg: PackageDetails;
  onBook: (pkg: PackageDetails) => void;
}> = ({ pkg, onBook }) => {
  return (
    <article
      className="
        group relative h-full overflow-hidden rounded-3xl bg-white
        ring-1 ring-blue-900/10 shadow-sm
        transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-blue-900/20
        flex flex-col
      "
    >
      {/* Accent line */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500" />

      {/* Header */}
      <div className="p-5 sm:p-6 bg-gradient-to-b from-blue-50/60 to-white border-b border-blue-900/5">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-2 min-h-[2.75rem]">
          {pkg.name}
        </h3>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 ring-1 ring-blue-900/10 shadow-sm">
            <CashCoin className="text-blue-700" />
            <span className="text-sm sm:text-base font-extrabold text-blue-800">
              {formatCurrency(pkg.price)}
            </span>
          </div>

          <span className="hidden sm:inline-flex rounded-full bg-blue-600/10 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-900/10">
            Dịch vụ xét nghiệm
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6 flex flex-col gap-4 flex-1">
        {/* Meta chips */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs sm:text-sm text-slate-700 ring-1 ring-slate-900/5">
            <ClockFill className="text-blue-600" />
            <span className="font-medium">{pkg.returnTime}</span>
          </span>

          {pkg.targetAudience && (
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs sm:text-sm text-slate-700 ring-1 ring-slate-900/5">
              <PersonFill className="text-emerald-600" />
              <span className="font-medium line-clamp-1">
                {pkg.targetAudience}
              </span>
            </span>
          )}
        </div>

        {/* Description */}
        <div className="flex items-start gap-2.5">
          <CheckCircleFill className="mt-0.5 text-emerald-600 shrink-0" />
          <p className="text-sm sm:text-[15px] text-slate-600 leading-relaxed line-clamp-3">
            {pkg.description}
          </p>
        </div>

        {/* Options */}
        {pkg.options && pkg.options.length > 0 && (
          <div className="rounded-2xl bg-blue-50/50 ring-1 ring-blue-900/10 overflow-hidden">
            <div className="px-4 py-3 flex items-center gap-2 bg-white/70">
              <PlusCircleFill className="text-blue-700" />
              <span className="text-sm font-semibold text-slate-900">
                Tuỳ chọn dịch vụ
              </span>
            </div>

            <div className="divide-y divide-blue-900/10">
              {pkg.options.map((opt) => (
                <div
                  key={opt.name}
                  className="px-4 py-3 flex items-start justify-between gap-3"
                >
                  <div className="text-sm text-slate-700 font-medium leading-snug">
                    {opt.name}
                  </div>
                  <div className="text-sm font-extrabold text-orange-600 whitespace-nowrap">
                    {formatCurrency(opt.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto shrink-0 p-5 sm:p-6 bg-slate-50/70 border-t border-blue-900/5">
        <button
          onClick={() => onBook(pkg)}
          type="button"
          className="
            w-full inline-flex items-center justify-center gap-2
            rounded-2xl px-4 py-3 text-sm font-semibold
            text-white shadow-sm
            bg-gradient-to-r from-blue-600 to-blue-800
            hover:from-blue-700 hover:to-blue-900
            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 focus-visible:ring-offset-2
            transition
          "
        >
          <CalendarCheckFill className="shrink-0" />
          Đặt hẹn tư vấn
        </button>

        {/* Nếu vẫn lệch do dòng này xuống 2 dòng ở card khác nhau,
            có thể thêm: min-h-[1rem] hoặc line-clamp-1 */}
        <p className="mt-3 text-center text-xs text-slate-500">
          Tư vấn nhanh • Bảo mật thông tin • Hỗ trợ chuyên môn
        </p>
      </div>
    </article>
  );
};

/* =======================
3) Main Section
======================= */
const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("ALL");
  const [selectedPkg, setSelectedPkg] = useState<PackageDetails | null>(null);

  const filteredPackages = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return ServicesData.filter((pkg) => {
      if (category !== "ALL" && pkg.category !== category) return false;
      if (q && !pkg.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [searchTerm, category]);

  return (
    <section className="bg-white">
      {/* HERO */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://res.cloudinary.com/da6f4dmql/image/upload/v1765357565/dna-strand_1_1_1_1_icogbd.png')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/70 via-blue-950/50 to-blue-950/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_55%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/20 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-cyan-300" />
              <span className="text-xs sm:text-sm font-semibold text-white/90">
                Dịch vụ xét nghiệm • Y tế di truyền
              </span>
            </div>

            <h1 className="mt-4 text-2xl sm:text-3xl lg:text-5xl font-extrabold tracking-tight text-white">
              Dịch vụ xét nghiệm
            </h1>

            <p className="mt-3 text-sm sm:text-base lg:text-lg text-white/85 leading-relaxed">
              Chọn gói phù hợp, nhận tư vấn chuyên môn nhanh chóng và bảo mật.
            </p>

            {/* Search */}
            <div className="mt-7 sm:mt-8">
              <div className="relative mx-auto max-w-3xl">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm (ví dụ: NIPT, ADN, HPV...)"
                  className="
                    w-full pl-12 pr-4 py-4 rounded-2xl
                    bg-white/10 text-white placeholder-white/70
                    ring-1 ring-white/25 shadow-sm backdrop-blur
                    focus:outline-none focus:ring-2 focus:ring-cyan-200/70
                    text-sm sm:text-base
                  "
                />
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/85"
                  size={18}
                />
              </div>

              {/* Category chips */}
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {categories.map((cat) => {
                  const active = category === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setCategory(cat.key)}
                      type="button"
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold transition",
                        "ring-1 ring-white/20 backdrop-blur",
                        active
                          ? "bg-white text-blue-800 shadow-sm"
                          : "bg-white/10 text-white hover:bg-white/15",
                      )}
                    >
                      <span>{cat.name}</span>
                      <span
                        className={cn(
                          "min-w-[32px] text-center rounded-full px-2 py-0.5 text-[11px]",
                          active
                            ? "bg-blue-600/10 text-blue-800"
                            : "bg-white/15 text-white",
                        )}
                      >
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="relative py-10 lg:py-16 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Danh sách dịch vụ
              </h2>
              <p className="text-sm text-slate-600">
                {filteredPackages.length} kết quả phù hợp
              </p>
            </div>

            <div className="text-xs text-slate-500">
              Mẹo: gõ “NIPT” hoặc “ADN” để lọc nhanh
            </div>
          </div>

          {filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {filteredPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} onBook={setSelectedPkg} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-6 bg-white rounded-3xl ring-1 ring-blue-900/10 shadow-sm max-w-lg mx-auto">
              <h3 className="text-lg font-semibold text-slate-900">
                Không tìm thấy dịch vụ phù hợp
              </h3>
              <p className="text-slate-600 mt-2">
                Vui lòng thử đổi danh mục hoặc từ khóa tìm kiếm.
              </p>
            </div>
          )}
        </div>
      </div>

      <ConsultationModal
        isOpen={!!selectedPkg}
        onClose={() => setSelectedPkg(null)}
        // defaultService={selectedPkg?.name}
      />
    </section>
  );
};

export default Services;
