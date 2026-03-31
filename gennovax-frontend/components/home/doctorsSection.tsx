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
    <section className="relative py-14 lg:py-20">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f4fbff_58%,#edf7fb_100%)]" />
      <div className="absolute inset-x-0 top-8 h-64 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.09),transparent_58%)]" />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 ring-1 ring-sky-200 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-sky-500" />
            <span className="text-xs font-semibold text-sky-700 sm:text-sm">
              Đội ngũ chuyên môn
            </span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-6xl">
            Đội ngũ <span className="text-sky-700">chuyên gia</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            Kinh nghiệm thực tiễn, quy trình chuẩn hóa và tư vấn theo hướng cá
            nhân hóa cho từng trường hợp.
          </p>
        </div>

        {topDoctors.length > 0 ? (
          <div
            className="mt-8 flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory lg:mt-12 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:pb-0"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {topDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="w-[85vw] flex-shrink-0 snap-center sm:w-auto"
              >
                <DoctorCard doctor={doctor} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 py-16 text-center">
            <UserRound className="mx-auto mb-4 h-16 w-16 text-slate-300" />
            <p className="text-base text-slate-500 sm:text-lg">
              Không tìm thấy chuyên gia phù hợp.
            </p>
          </div>
        )}

        <div className="mt-8 flex justify-center sm:mt-10">
          <Link
            href="/gioi-thieu/doi-ngu-bac-sy"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-sky-700 ring-1 ring-sky-100 shadow-sm transition hover:bg-sky-50 sm:text-base"
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
    <article className="group relative flex h-full w-full flex-col overflow-hidden rounded-[2rem] border border-white/80 bg-white shadow-[0_24px_70px_rgba(148,163,184,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_32px_80px_rgba(14,165,233,0.18)]">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-700" />

      <div className="relative h-24 flex-shrink-0 sm:h-28">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-900 via-blue-800 to-blue-700" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.24),transparent_55%)] opacity-80" />

        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/15 backdrop-blur">
          <BadgeCheck className="h-4 w-4 text-cyan-200" />
          Chuyên gia
        </div>
      </div>

      <div className="relative flex flex-1 flex-col px-5 pb-6 sm:px-6">
        <div className="-mt-12 flex justify-center sm:-mt-14">
          <div className="relative h-28 w-28 sm:h-32 sm:w-32 lg:h-36 lg:w-36">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 p-1 shadow-lg">
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

        <div className="mt-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-sky-700 sm:text-sm">
            {doctor.title}
          </p>

          <h3 className="mt-1 text-lg font-extrabold text-slate-900 sm:text-xl">
            {doctor.name}
          </h3>

          <div className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600 sm:text-sm">
            <MapPin className="h-4 w-4 text-sky-600" />
            <span className="line-clamp-1">{doctor.workplace}</span>
          </div>
        </div>

        <ul className="mt-5 min-h-[72px] space-y-2">
          {doctor.roles.slice(0, 3).map((role, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-xs text-slate-600 sm:text-sm"
            >
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sky-600/80" />
              <span className="line-clamp-2 leading-relaxed">{role}</span>
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-auto flex flex-row gap-2 pt-6">
          <Link
            href={`/gioi-thieu/doi-ngu-bac-sy#${doctor.id}`}
            className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-sky-600 to-blue-800 px-4 py-3 text-sm font-semibold text-white transition hover:from-sky-700 hover:to-blue-900"
          >
            Xem hồ sơ
          </Link>

          <Link
            href="/lien-he"
            onClick={(e) => {
              e.preventDefault();
            }}
            className="inline-flex items-center justify-center rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-sky-800 transition hover:bg-sky-100"
          >
            Đặt lịch tư vấn
          </Link>
        </div>
      </div>
    </article>
  );
}
