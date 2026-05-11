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
2) Card
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
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500" />

      <div className="border-b border-blue-900/5 bg-gradient-to-b from-blue-50/60 to-white p-5 sm:p-6">
        <h3 className="min-h-[2.75rem] line-clamp-2 text-base font-bold leading-snug text-slate-900 sm:text-lg">
          {pkg.name}
        </h3>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-blue-900/10">
            <CashCoin className="text-blue-700" />
            <span className="text-sm font-extrabold text-blue-800 sm:text-base">
              {formatCurrency(pkg.price)}
            </span>
          </div>

          <span className="hidden rounded-full bg-blue-600/10 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-900/10 sm:inline-flex">
            Dịch vụ xét nghiệm
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs text-slate-700 ring-1 ring-slate-900/5 sm:text-sm">
            <ClockFill className="text-blue-600" />
            <span className="font-medium">{pkg.returnTime}</span>
          </span>

          {pkg.targetAudience && (
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs text-slate-700 ring-1 ring-slate-900/5 sm:text-sm">
              <PersonFill className="text-emerald-600" />
              <span className="line-clamp-1 font-medium">{pkg.targetAudience}</span>
            </span>
          )}
        </div>

        <div className="flex items-start gap-2.5">
          <CheckCircleFill className="mt-0.5 shrink-0 text-emerald-600" />
          <p className="line-clamp-3 text-sm leading-relaxed text-slate-600 sm:text-[15px]">
            {pkg.description}
          </p>
        </div>

        {pkg.options && pkg.options.length > 0 && (
          <div className="overflow-hidden rounded-2xl bg-blue-50/50 ring-1 ring-blue-900/10">
            <div className="flex items-center gap-2 bg-white/70 px-4 py-3">
              <PlusCircleFill className="text-blue-700" />
              <span className="text-sm font-semibold text-slate-900">
                Tuỳ chọn dịch vụ
              </span>
            </div>

            <div className="divide-y divide-blue-900/10">
              {pkg.options.map((opt) => (
                <div
                  key={opt.name}
                  className="flex items-start justify-between gap-3 px-4 py-3"
                >
                  <div className="text-sm font-medium leading-snug text-slate-700">
                    {opt.name}
                  </div>
                  <div className="whitespace-nowrap text-sm font-extrabold text-orange-600">
                    {formatCurrency(opt.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto shrink-0 border-t border-blue-900/5 bg-slate-50/70 p-5 sm:p-6">
        <button
          onClick={() => onBook(pkg)}
          type="button"
          className="
            inline-flex w-full items-center justify-center gap-2 rounded-2xl
            bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-3 text-sm font-semibold text-white shadow-sm
            transition hover:from-blue-700 hover:to-blue-900
            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 focus-visible:ring-offset-2
          "
        >
          <CalendarCheckFill className="shrink-0" />
          Đặt hẹn tư vấn
        </button>

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
      <div className="relative overflow-hidden bg-[#1E3A8A]">
  {/* Base gradient */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.16),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(191,219,254,0.10),transparent_22%),linear-gradient(135deg,#172554_0%,#1E3A8A_45%,#1E40AF_100%)]" />

  {/* Modern grid */}
  <div className="absolute inset-0 opacity-[0.10] [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:42px_42px]" />

  {/* Glow blobs */}
  <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
  <div className="absolute right-[-80px] top-[-20px] h-80 w-80 rounded-full bg-blue-300/18 blur-3xl" />
  <div className="absolute bottom-[-100px] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />

  {/* Decorative glass cards */}
  {/* <div className="pointer-events-none absolute left-[8%] top-[20%] hidden h-24 w-24 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl lg:block" />
  <div className="pointer-events-none absolute right-[12%] top-[24%] hidden h-16 w-40 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl lg:block" />
  <div className="pointer-events-none absolute bottom-[18%] right-[18%] hidden h-20 w-20 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl lg:block" /> */}

  <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
    <div className="mx-auto max-w-4xl text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 shadow-sm backdrop-blur-md">
        <span className="h-2 w-2 rounded-full bg-blue-200 shadow-[0_0_16px_rgba(191,219,254,0.9)]" />
        <span className="text-xs font-semibold text-white/85 sm:text-sm">
          Dịch vụ xét nghiệm • Y tế di truyền
        </span>
      </div>

      <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-6xl">
        Dịch vụ xét nghiệm
      </h1>

      <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base lg:text-lg">
        Chọn gói phù hợp, tra cứu nhanh dịch vụ và nhận tư vấn chuyên môn
        theo cách trực quan, hiện đại và dễ sử dụng hơn.
      </p>

      {/* Search panel */}
      <div className="mt-8 sm:mt-10">
        <div
          className="
            mx-auto max-w-4xl rounded-[32px]
            border border-blue-300/20
            bg-[linear-gradient(135deg,#1E3A8A_0%,#1E40AF_42%,#1D4ED8_100%)]
            p-3 sm:p-4
            shadow-[0_24px_80px_rgba(37,99,235,0.30)]
          "
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-[24px] bg-gradient-to-r from-blue-300/12 via-sky-200/10 to-white/10 blur-2xl" />
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm dịch vụ (ví dụ: NIPT, ADN, HPV...)"
                className="
                  h-14 w-full rounded-2xl border border-white/80 bg-white
                  pl-12 pr-4 text-sm text-slate-800
                  shadow-[0_10px_30px_rgba(15,23,42,0.12)]
                  outline-none
                  placeholder:text-slate-400
                  transition-all duration-300
                  focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-200/35
                  sm:h-16 sm:text-base
                "
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2.5">
            {categories.map((cat) => {
              const active = category === cat.key;

              return (
                <button
                  key={cat.key}
                  onClick={() => setCategory(cat.key)}
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition-all duration-300 sm:px-4 sm:text-sm",
                    active
                      ? "border-white bg-white text-blue-700 shadow-[0_8px_24px_rgba(255,255,255,0.16)]"
                      : "border-white/15 bg-white/10 text-white backdrop-blur-md hover:border-white/25 hover:bg-white/16",
                  )}
                >
                  <span>{cat.name}</span>
                  <span
                    className={cn(
                      "min-w-[30px] rounded-full px-2 py-0.5 text-[11px]",
                      active
                        ? "bg-blue-100 text-blue-700"
                        : "bg-white/10 text-white/90",
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

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-white/55 sm:text-sm">
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md">
          Tư vấn nhanh
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md">
          Bảo mật thông tin
        </span>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-md">
          Giao diện tra cứu trực quan
        </span>
      </div>
    </div>
  </div>
</div>

      {/* LIST */}
      <div className="relative bg-gradient-to-b from-slate-50 to-white py-10 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8 xl:grid-cols-3">
              {filteredPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} onBook={setSelectedPkg} />
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-lg rounded-3xl bg-white px-6 py-10 text-center shadow-sm ring-1 ring-blue-900/10">
              <h3 className="text-lg font-semibold text-slate-900">
                Không tìm thấy dịch vụ phù hợp
              </h3>
              <p className="mt-2 text-slate-600">
                Vui lòng thử đổi danh mục hoặc từ khóa tìm kiếm.
              </p>
            </div>
          )}
        </div>
      </div>

      <ConsultationModal
        isOpen={!!selectedPkg}
        onClose={() => setSelectedPkg(null)}
      />
    </section>
  );
};

export default Services;