"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  CheckCircle,
  Clock,
  Phone,
  ArrowRight,
  Plus,
} from "lucide-react";
import { clinicData } from "@/data/clinics";
import { Clinic } from "@/types/clinic";
import ConsultationModal from "@/components/home/ConsultationModal";

const PAGE_SIZE = 8;

// Ảnh y tế mặc định (bạn có thể thay link khác)
const FALLBACK_MEDICAL_IMAGE =
  "https://printgo.vn/uploads/media/774255/4-nguyen-tac-trong-thiet-ke-logo-nganh-y-duoc9_1585716653.jpg";

const isMissing = (v?: string) => !v || v.trim().length === 0;

function safeText(v?: string, fallback = "Đang cập nhật") {
  return isMissing(v) ? fallback : v!;
}

function hasDetail(clinic: Clinic) {
  // Bạn có thể siết điều kiện hơn/ít hơn tuỳ nghiệp vụ
  return (
    !isMissing(clinic.address) &&
    !isMissing(clinic.phoneNumber) &&
    !isMissing(clinic.timeWork) &&
    !isMissing(clinic.dateWork)
  );
}

export default function ClinicListPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(
    clinicData.length > 0 ? clinicData[0] : null,
  );

  // Hàm xử lý tiếng Việt
  const removeVietnameseTones = (str: string): string => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/\s+/g, "")
      .toLowerCase();
  };

  // Lọc dữ liệu
  const filteredClinics = useMemo(() => {
    const key = removeVietnameseTones(searchTerm);
    return clinicData.filter((clinic) =>
      removeVietnameseTones(clinic.name).includes(key),
    );
  }, [searchTerm]);

  // Reset phân trang khi tìm kiếm
  React.useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    // chọn lại phần tử đầu tiên của danh sách lọc cho nhất quán UX
    setSelectedClinic(filteredClinics.length > 0 ? filteredClinics[0] : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const visibleClinics = useMemo(() => {
    return filteredClinics.slice(0, visibleCount);
  }, [filteredClinics, visibleCount]);

  const canLoadMore = visibleCount < filteredClinics.length;

  const goDetail = (clinic: Clinic) =>
    router.push(`/y-te/chi-tiet-phong-kham?ID=${clinic.clinicId}`);
  const goBooking = (clinic: Clinic) =>
  {

                setIsModalOpen(true);
  }

  return (
    <section className="relative py-10 lg:py-16">
      {/* Background đồng bộ “medical overlay” */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/70 via-white/40 to-white/70" />
      <div className="absolute inset-0 bg-white/50" />

      <div className="relative mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">

          <h1 className="mt-4 text-xl sm:text-2xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            Phòng khám <span className="text-blue-700">gần bạn</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Trải nghiệm chăm sóc y tế gần gũi, quy trình rõ ràng và hỗ trợ đặt
            lịch nhanh.
          </p>

          {/* Search */}
          <div className="mt-6 sm:mt-8">
            <div className="mx-auto flex w-full h-10 lg:h-14 max-w-2xl items-center gap-3 rounded-2xl bg-white/90 px-4 py-3 ring-1 ring-blue-900/10 shadow-sm backdrop-blur">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                type="text"
                className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 outline-none"
                placeholder="Tìm kiếm cơ sở y tế..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {!!searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="rounded-2xl px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 ring-1 ring-blue-200/70 hover:bg-blue-100 hover:ring-blue-300 transition"
                >
                  Xóa
                </button>
              )}
            </div>

            <div className="mt-3 text-xs sm:text-sm text-slate-500">
              {filteredClinics.length > 0 ? (
                <span>
                  Tìm thấy{" "}
                  <span className="font-semibold text-slate-700">
                    {filteredClinics.length}
                  </span>{" "}
                  phòng khám
                </span>
              ) : (
                <span>Không có kết quả phù hợp</span>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="mt-8 lg:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: List */}
          <div className="lg:col-span-7">
            <div className="space-y-4">
              {visibleClinics.map((clinic) => {
                const active = selectedClinic?.id === clinic.id;
                const detailOk = hasDetail(clinic);

                const imageSrc = isMissing(clinic.image)
                  ? FALLBACK_MEDICAL_IMAGE
                  : clinic.image;

                return (
                  <article
                    key={clinic.id}
                    onClick={() => setSelectedClinic(clinic)}
                    className={`
                      group relative overflow-hidden rounded-3xl bg-white
                      ring-1 shadow-sm transition-all duration-300 cursor-pointer
                      ${active ? "ring-blue-600/30 shadow-xl" : "ring-blue-900/10 hover:shadow-xl hover:ring-blue-600/20"}
                    `}
                  >
                    {/* Accent line */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500" />

                    <div className="p-4 sm:p-5">
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Image */}
                        <div className="relative w-full md:w-56 lg:w-60 flex-shrink-0">
                          <div className="relative overflow-hidden rounded-2xl ring-1 ring-blue-900/10">
                            <img
                              src={imageSrc}
                              alt={clinic.name}
                              className="h-44 md:h-36 lg:h-40 w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                              loading="lazy"
                            />
                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent" />
                          </div>

                          {/* Verified / Updating pill */}
                          {clinic.isVerified ? (
                            <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-900/10 shadow-sm">
                              <CheckCircle className="h-4 w-4 text-emerald-600" />
                              Đã xác minh
                            </div>
                          ) : (
                            <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-blue-900/10 shadow-sm">
                              Đang cập nhật
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="min-w-0 flex flex-col flex-1">
                          <div className="min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900">
                                {clinic.name}
                              </h3>

                              {active && (
                                <span className="hidden sm:inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-200/70">
                                  Đang chọn
                                </span>
                              )}
                            </div>

                            <div className="mt-2 space-y-2">
                              <p className="flex items-start gap-2 text-sm text-slate-600">
                                <MapPin className="mt-0.5 h-4 w-4 text-blue-600 flex-shrink-0" />
                                <span className="line-clamp-2">
                                  {safeText(clinic.address)}
                                </span>
                              </p>

                              <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs sm:text-sm text-slate-700 ring-1 ring-slate-200/70">
                                  <Clock className="h-4 w-4 text-sky-600" />
                                  {safeText(clinic.timeWork)}
                                </span>

                                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs sm:text-sm text-slate-700 ring-1 ring-slate-200/70">
                                  <span className="font-semibold text-pink-600">
                                    {safeText(clinic.dateWork)}
                                  </span>
                                </span>

                                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 text-xs sm:text-sm text-slate-700 ring-1 ring-slate-200/70">
                                  <Phone className="h-4 w-4 text-slate-500" />
                                  <span className="font-semibold text-orange-500">
                                    {safeText(clinic.phoneNumber)}
                                  </span>
                                </span>

                                {!detailOk && (
                                  <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200/70">
                                    Đang cập nhật thông tin
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-4 flex flex-row sm:flex-row gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                // goDetail(clinic);
                              }}
                              className="
                                inline-flex items-center justify-center gap-2
                                rounded-2xl px-4 py-3 text-sm font-semibold
                                text-blue-800 bg-blue-50/80
                                ring-1 ring-blue-200/70 shadow-sm backdrop-blur
                                hover:bg-blue-50 hover:ring-blue-300
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2
                                transition
                              "
                            >
                              Xem chi tiết
                              <ArrowRight className="h-4 w-4 opacity-70" />
                            </button>

                            <button
                              onClick={(e) => {
                                setIsModalOpen(true)
                              }}
                              disabled={!detailOk}
                              className={`
                                inline-flex items-center justify-center
                                rounded-2xl px-4 py-3 text-sm font-semibold
                                shadow-sm transition
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 focus-visible:ring-offset-2
                                ${
                                  detailOk
                                    ? "text-blue-800 bg-blue-100/70 ring-1 ring-blue-200/70 hover:bg-blue-100 hover:ring-blue-300"
                                    : "text-slate-400 bg-slate-100 ring-1 ring-slate-200 cursor-not-allowed"
                                }
                              `}
                              title={
                                detailOk
                                  ? "Đặt khám ngay"
                                  : "Phòng khám đang cập nhật thông tin"
                              }
                            >
                              Đặt khám ngay
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}

              {filteredClinics.length === 0 && (
                <div className="rounded-3xl bg-white/90 ring-1 ring-blue-900/10 shadow-sm p-6 text-center text-slate-600">
                  <p className="font-semibold">
                    Không tìm thấy phòng khám phù hợp.
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Hãy thử từ khóa khác hoặc xóa bộ lọc tìm kiếm.
                  </p>
                </div>
              )}

              {/* Load more */}
              {filteredClinics.length > 0 && (
                <div className="pt-2 flex justify-center">
                  {canLoadMore ? (
                    <button
                      onClick={() =>
                        setVisibleCount((c) =>
                          Math.min(c + PAGE_SIZE, filteredClinics.length),
                        )
                      }
                      className="
                        inline-flex items-center justify-center gap-2
                        rounded-full px-6 py-3 text-sm sm:text-base font-semibold
                        text-blue-800 bg-white/80
                        ring-1 ring-blue-200/70 shadow-sm backdrop-blur
                        hover:bg-white hover:ring-blue-300
                        transition
                      "
                    >
                      <Plus className="h-5 w-5" />
                      Xem thêm ({Math.min(visibleCount, filteredClinics.length)}
                      /{filteredClinics.length})
                    </button>
                  ) : (
                    <div className="text-sm text-slate-500">
                      Đã hiển thị tất cả ({filteredClinics.length}) phòng.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Detail (sticky) */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="sticky top-8">
              {selectedClinic ? (
                <ClinicDetail
                  clinic={selectedClinic}
                  onDetail={() => goDetail(selectedClinic)}
                  onBooking={() => goBooking(selectedClinic)}
                />
              ) : (
                <div className="rounded-3xl bg-white/90 ring-1 ring-blue-900/10 shadow-sm p-6 text-center text-slate-500">
                  Vui lòng chọn một phòng khám để xem chi tiết.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile detail */}
        <div className="lg:hidden mt-8">
          {selectedClinic && (
            <ClinicDetail
              clinic={selectedClinic}
              onDetail={() => goDetail(selectedClinic)}
              onBooking={() => goBooking(selectedClinic)}
              compact
            />
          )}
        </div>
      </div>
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}

function ClinicDetail({
  clinic,
  onDetail,
  onBooking,
  compact = false,
}: {
  clinic: Clinic;
  onDetail: () => void;
  onBooking: () => void;
  compact?: boolean;
}) {
  
  const detailOk = hasDetail(clinic);
  const imageSrc = isMissing(clinic.image)
    ? FALLBACK_MEDICAL_IMAGE
    : clinic.image;

  return (
    <aside className="overflow-hidden rounded-3xl bg-white ring-1 ring-blue-900/10 shadow-sm">
      <div className="h-1 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500" />

      <div className={compact ? "p-5" : "p-5 sm:p-6"}>
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            {clinic.name}
          </h2>

          {clinic.isVerified && (
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-blue-200/70">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              Đã xác minh
            </span>
          )}
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-blue-900/10">
          <img
            src={imageSrc}
            alt={clinic.name}
            className="w-full h-[260px] object-cover"
            loading="lazy"
          />
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <h4 className="text-sm font-extrabold text-slate-900">Địa chỉ</h4>
            <p className="mt-2 flex items-start gap-2 text-sm text-slate-600">
              <MapPin className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
              {safeText(clinic.address)}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-extrabold text-slate-900">Mô tả</h4>
            {clinic.descriptions?.length ? (
              <div className="mt-2 space-y-2 text-sm text-slate-600">
                {clinic.descriptions.map((desc, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {desc}
                  </p>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-600">Đang cập nhật</p>
            )}
          </div>

          {clinic.mapEmbedUrl ? (
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 mb-2">
                Bản đồ
              </h4>
              <div className="overflow-hidden rounded-2xl ring-1 ring-blue-900/10">
                <iframe
                  src={clinic.mapEmbedUrl}
                  width="100%"
                  height="260"
                  className="border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Clinic Location"
                />
              </div>
            </div>
          ) : (
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 mb-2">
                Bản đồ
              </h4>
              <p className="text-sm text-slate-600">Đang cập nhật</p>
            </div>
          )}

          <div className="pt-1 flex flex-col sm:flex-row gap-2">
            <button
              onClick={onDetail}
              className="
                inline-flex items-center justify-center gap-2
                rounded-2xl px-4 py-3 text-sm font-semibold
                text-blue-800 bg-blue-50/80
                ring-1 ring-blue-200/70 shadow-sm backdrop-blur
                hover:bg-blue-50 hover:ring-blue-300
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60 focus-visible:ring-offset-2
                transition
              "
            >
              Xem chi tiết
              <ArrowRight className="h-4 w-4 opacity-70" />
            </button>

            <button
              onClick={() => detailOk && onBooking()}
              disabled={!detailOk}
              className={`
                inline-flex items-center justify-center
                rounded-2xl px-4 py-3 text-sm font-semibold
                shadow-sm transition
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 focus-visible:ring-offset-2
                ${
                  detailOk
                    ? "text-blue-800 bg-blue-100/70 ring-1 ring-blue-200/70 hover:bg-blue-100 hover:ring-blue-300"
                    : "text-slate-400 bg-slate-100 ring-1 ring-slate-200 cursor-not-allowed"
                }
              `}
            >
              Đặt khám ngay
            </button>
          </div>

          {!detailOk && (
            <div className="rounded-2xl bg-amber-50 ring-1 ring-amber-200/70 p-4 text-sm text-amber-800">
              Thông tin phòng khám đang được cập nhật. Bạn có thể xem chi tiết
              để theo dõi cập nhật mới nhất.
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
