"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { doctorsData, Doctor } from "@/data/doctors";
import { MapPin, UserRound } from "lucide-react";

export default function DoctorsList() {
  const [searchTerm] = useState("");

  const filteredDoctors = useMemo(() => {
    const t = searchTerm.toLowerCase();
    return doctorsData.filter(
      (d) =>
        d.name.toLowerCase().includes(t) ||
        d.workplace.toLowerCase().includes(t) ||
        d.title.toLowerCase().includes(t)
    );
  }, [searchTerm]);

  const topDoctors = filteredDoctors.slice(0, 3);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 font-sans bg-slate-50">
      <div className="max-w-7xl mx-auto">

        {/* Title */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="inline-block px-5 py-2.5 border-4 border-dashed border-blue-300 rounded-full bg-white/80 backdrop-blur-sm">
            <h2 className="text-base sm:text-xl lg:text-3xl font-bold text-black">
              Đội Ngũ <span className="text-blue-700">Chuyên Gia</span>
            </h2>
          </div>
        </div>

        {/* 3 Cards */}
        {topDoctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
            {topDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <UserRound className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">Không tìm thấy bác sĩ phù hợp.</p>
          </div>
        )}

        {/* More Button */}
        <div className="flex justify-center mt-10">
          <Link
            href="/gioi-thieu/doi-ngu-bac-sy"
            className="px-6 py-2.5 text-sm sm:text-base md:text-lg border-2 border-blue-500 border-dashed rounded-full 
                       text-blue-600 font-medium hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 
                       flex items-center gap-2 group"
          >
            Xem thêm chuyên gia
            <span className="text-blue-500 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   Doctor Card — Tối ưu Responsive
---------------------------------------------------- */
const DoctorCard = ({ doctor }: { doctor: Doctor }) => {
  return (
    <div
      className="
        group relative bg-white rounded-2xl shadow-sm border border-slate-200
        hover:shadow-xl hover:-translate-y-1 transition-all duration-300
        overflow-hidden flex flex-col
      "
    >
      {/* Gradient Header */}
      <div className="h-24 sm:h-28 bg-gradient-to-r from-blue-800 to-blue-600 w-full absolute top-0 z-0"></div>

      <div className="relative z-10 px-4 sm:px-5 lg:px-6 pt-10 sm:pt-12 lg:pt-14 flex flex-col flex-grow">

        {/* Avatar Responsive */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 mx-auto mb-4 sm:mb-5 lg:mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full p-1 shadow-lg">
            <div className="relative w-full h-full bg-white rounded-full overflow-hidden">
              <Image
                src={doctor.image}
                alt={doctor.name}
                fill
                unoptimized
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.srcset = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    doctor.name
                  )}&background=random&size=256`;
                }}
              />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="text-center mb-4 lg:mb-6">
          <p className="text-blue-600 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-1">
            {doctor.title}
          </p>
          <h3 className="text-lg sm:text-xl font-bold text-slate-800">{doctor.name}</h3>

          <div className="mt-2 inline-flex items-center justify-center text-xs sm:text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            <MapPin className="w-3 h-3 mr-1" />
            {doctor.workplace}
          </div>
        </div>

        {/* Roles */}
        <ul className="space-y-1.5 sm:space-y-2 mb-6">
          {doctor.roles.slice(0, 3).map((role, index) => (
            <li key={index} className="flex items-start text-xs sm:text-sm text-slate-600">
              <span className="mr-2 mt-1 w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
              <span className="line-clamp-2">{role}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
