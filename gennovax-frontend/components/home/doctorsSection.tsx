"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { doctorsData, Doctor } from "@/data/doctors";
import { MapPin, UserRound, BadgeCheck } from "lucide-react";

export default function DoctorsList() {
  const [searchTerm] = useState("");

  const filteredDoctors = useMemo(() => {
    const t = searchTerm.toLowerCase().trim();
    return doctorsData.filter(
      (d) =>
        d.name.toLowerCase().includes(t) ||
        d.workplace.toLowerCase().includes(t) ||
        d.title.toLowerCase().includes(t),
    );
  }, [searchTerm]);

  const topDoctors = filteredDoctors.slice(0, 3);

  return (
    <section className="relative py-10 lg:py-16">
      {/* Background đồng bộ */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/70 via-white/40 to-white/70" />
      <div className="absolute inset-0 bg-white/50" />

      <div className="relative mx-auto max-w-7xl px-4">
        {/* Header đồng bộ */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 ring-1 ring-blue-900/10 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            <span className="text-xs sm:text-sm font-semibold text-blue-700">
              Đội ngũ chuyên môn
            </span>
          </div>

          <h2 className="mt-4 text-xl sm:text-2xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            Đội ngũ <span className="text-blue-700">chuyên gia</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Kinh nghiệm thực tiễn, quy trình chuẩn hóa và tư vấn theo hướng cá
            nhân hóa cho từng trường hợp.
          </p>
        </div>

        {/* List */}
        {topDoctors.length > 0 ? (
          <div
            className="
              mt-8 lg:mt-12
              flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory
              lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:pb-0
            "
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {topDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="flex-shrink-0 w-[85vw] snap-center sm:w-auto"
              >
                <DoctorCard doctor={doctor} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 text-center py-16">
            <UserRound className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-base sm:text-lg">
              Không tìm thấy chuyên gia phù hợp.
            </p>
          </div>
        )}

        {/* More Button */}
        <div className="mt-8 sm:mt-10 flex justify-center">
          <Link
            href="/gioi-thieu/doi-ngu-bac-sy"
            className="
              inline-flex items-center justify-center gap-2
              rounded-full px-6 py-3 text-sm sm:text-base font-semibold
              text-blue-700 bg-white/90
              ring-1 ring-blue-900/10 shadow-sm
              hover:bg-white hover:ring-blue-900/20
              transition
            "
          >
            Xem thêm chuyên gia →
          </Link>
        </div>
      </div>
    </section>
  );
}

function DoctorCard({ doctor }: { doctor: Doctor }) {
  const fallback = useMemo(() => {
    const name = encodeURIComponent(doctor.name || "Doctor");
    return `https://ui-avatars.com/api/?name=${name}&background=0D8ABC&color=fff&size=512`;
  }, [doctor.name]);

  const [src, setSrc] = useState<string>(doctor.image);

  return (
    <article
      className="
        group relative h-full w-full overflow-hidden rounded-3xl
        bg-white ring-1 ring-blue-900/10 shadow-sm
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl hover:ring-blue-900/20
        flex flex-col
      "
    >
      {/* Accent line */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500" />

      {/* Top header background */}
      <div className="relative h-24 sm:h-28 flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700" />
        <div className="absolute inset-0 opacity-80 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_55%)]" />

        {/* Badge nhỏ */}
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/15 backdrop-blur">
          <BadgeCheck className="h-4 w-4 text-cyan-200" />
          Chuyên gia
        </div>
      </div>

      {/* Body: cho nó flex-1 để có “đất” đẩy CTA xuống đáy */}
      <div className="relative px-5 sm:px-6 pb-6 flex flex-col flex-1">
        {/* Avatar */}
        <div className="-mt-12 sm:-mt-14 flex justify-center">
          <div className="relative h-28 w-28 sm:h-32 sm:w-32 lg:h-36 lg:w-36">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 p-1 shadow-lg">
              <div className="relative h-full w-full overflow-hidden rounded-full bg-white">
                <Image
                  src={src}
                  alt={doctor.name}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="160px"
                  onError={() => setSrc(fallback)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 text-center">
          <p className="text-blue-700 font-semibold text-xs sm:text-sm uppercase tracking-wider">
            {doctor.title}
          </p>

          <h3 className="mt-1 text-lg sm:text-xl font-extrabold text-slate-900">
            {doctor.name}
          </h3>

          <div className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs sm:text-sm text-slate-600">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="line-clamp-1">{doctor.workplace}</span>
          </div>
        </div>

        {/* Roles */}
        <ul className="mt-5 space-y-2 min-h-[72px]">
          {doctor.roles.slice(0, 3).map((role, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-xs sm:text-sm text-slate-600"
            >
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blue-600/80 flex-shrink-0" />
              <span className="line-clamp-2 leading-relaxed">{role}</span>
            </li>
          ))}
        </ul>

        {/* CTA: mt-auto để luôn xuống đáy, ngang nhau mọi card */}
        <div className="mt-auto mx-auto pt-6 flex flex-row sm:flex-row gap-2">
          <Link
            href={`/gioi-thieu/doi-ngu-bac-sy#${doctor.id}`}
            className="
              inline-flex items-center justify-center
              rounded-2xl px-4 py-3 text-sm font-semibold
              text-white shadow-sm
              bg-gradient-to-r from-blue-600 to-blue-800
              hover:from-blue-700 hover:to-blue-900
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 focus-visible:ring-offset-2
              transition
            "
          >
            Xem hồ sơ
          </Link>

          <Link
            href="/lien-he"
            onClick={(e)=>{e.preventDefault()}}
            className="
              inline-flex items-center justify-center
              rounded-2xl px-4 py-3 text-sm font-semibold
              text-blue-800 bg-blue-50
              ring-1 ring-blue-200/70
              hover:bg-blue-100 hover:ring-blue-300
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 focus-visible:ring-offset-2
              transition
            "
          >
            Đặt lịch tư vấn
          </Link>
        </div>
      </div>
    </article>
  );
}
