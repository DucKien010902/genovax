"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { doctorsData, Doctor } from "@/data/doctors";
import { Search, MapPin, ChevronRight, UserRound } from "lucide-react";

export default function DoctorsList() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDoctors = useMemo(() => {
    const t = searchTerm.toLowerCase();
    return doctorsData.filter(
      (d) =>
        d.name.toLowerCase().includes(t) ||
        d.workplace.toLowerCase().includes(t) ||
        d.title.toLowerCase().includes(t),
    );
  }, [searchTerm]);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 space-y-3">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Đội Ngũ <span className="text-blue-700">Chuyên Gia</span>
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
            Hội tụ các bác sĩ, giáo sư đầu ngành từ các bệnh viện lớn.
          </p>

          {/* Search bar */}
          <div className="relative max-w-xl mx-auto mt-6 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-200 
                         rounded-full text-slate-900 shadow-sm placeholder-slate-400 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Tìm kiếm bác sĩ hoặc nơi làm việc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Doctor Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <UserRound className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">
              Không tìm thấy bác sĩ phù hợp với "{searchTerm}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------
   Doctor Card — Responsive Optimized
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
      {/* Decorative top bar */}
      <div className="h-24 sm:h-28 bg-gradient-to-r from-blue-800 to-blue-600 w-full absolute top-0 z-0"></div>

      <div className="relative z-10 px-4 sm:px-5 lg:px-6 pt-10 sm:pt-12 lg:pt-14 flex flex-col flex-grow">
        {/* Avatar */}
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
                    doctor.name,
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

          <h3 className="text-lg sm:text-xl font-bold text-slate-800">
            {doctor.name}
          </h3>

          <div className="mt-2 inline-flex items-center justify-center text-xs sm:text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            <MapPin className="w-3 h-3 mr-1" />
            {doctor.workplace}
          </div>
        </div>

        {/* Roles */}
        <ul className="space-y-1.5 sm:space-y-2 mb-6">
          {doctor.roles.slice(0, 3).map((role, idx) => (
            <li
              key={idx}
              className="flex items-start text-xs sm:text-sm text-slate-600"
            >
              <span className="mr-2 mt-1 w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
              <span className="line-clamp-2">{role}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer button */}
      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <Link
          href={`/doctors/${doctor.id}`}
          onClick={(e) => {
            e.preventDefault();
          }}
          className="
            flex items-center justify-center w-full py-2.5 bg-white border border-blue-200
            text-blue-700 rounded-xl font-medium hover:bg-blue-600 hover:text-white 
            hover:border-transparent transition-all duration-300 group-hover:shadow-md
          "
        >
          Xem chi tiết
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
