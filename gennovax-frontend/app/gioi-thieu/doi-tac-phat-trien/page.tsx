"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronRight, Briefcase } from "lucide-react";

export interface Partner {
  id: string;
  name: string;
  field: string;
  image: string;
}

const partnersData: Partner[] = [
  { id: "1", name: "GENLAB", field: "Công ty cổ phần Phân tích di truyền Genlab", image: "https://res.cloudinary.com/da6f4dmql/image/upload/v1772521603/Picture1_arfbok.png" },
  { id: "2", name: "MEDILAB", field: "Công ty TNHH Medilab", image: "https://res.cloudinary.com/da6f4dmql/image/upload/v1772521773/Picture2_tgj9lz.png" },
  { id: "3", name: "PHACOGEN", field: "Viện công nghệ Phacogen", image: "https://res.cloudinary.com/da6f4dmql/image/upload/v1772523875/Picture4_lt9j3t.png" },
  { id: "4", name: "PISOK GROUP", field: "Công ty Cổ phần Viện Y Học Pisok Group", image: "https://res.cloudinary.com/da6f4dmql/image/upload/v1772523875/Picture3_bkwaje.png" },
];

export default function PartnersList() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPartners = useMemo(() => {
    const t = searchTerm.toLowerCase();
    return partnersData.filter(
      (p) =>
        p.name.toLowerCase().includes(t) ||
        p.field.toLowerCase().includes(t)
    );
  }, [searchTerm]);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 space-y-4">
          {/* <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm">Our Network</h2> */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black ">
            Đối Tác <span className="text-blue-700">Phát Triển</span>
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto text-base sm:text-lg">
            Kết nối cùng những đơn vị tiên phong trong lĩnh vực y học.
          </p>

          {/* Search bar - Tinh chỉnh Shadow và Border */}
          <div className="relative max-w-2xl mx-auto pt-4 group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-200 
                         rounded-2xl text-slate-900 shadow-xl shadow-blue-900/5 placeholder-slate-400 
                         focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
              placeholder="Tìm kiếm đối tác hoặc lĩnh vực chuyên môn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Partner Grid - LG 3 Cột */}
        {filteredPartners.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPartners.map((partner) => (
              <PartnerCard key={partner.id} partner={partner} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
            <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Chúng tôi không tìm thấy đối tác nào phù hợp</p>
          </div>
        )}
      </div>
    </div>
  );
}

const PartnerCard = ({ partner }: { partner: Partner }) => {
  return (
    <div className="group bg-white rounded-[2rem] border border-blue-200 shadow-sm hover:shadow-2xl hover:shadow-blue-500 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
      
      {/* 1. Square Image Container - Fix Border tuyệt đối */}
      <div className="p-4 w-[80%] mx-auto">
        <div className="relative aspect-square w-full bg-slate-50/50 rounded-[1.5rem] flex items-center justify-center overflow-hidden border border-slate-100 group-hover:bg-white transition-colors duration-500">
          <div className="relative w-[70%] h-[70%] p-12">
            <Image
              src={partner.image}
              alt={partner.name}
              fill
              className="object-contain transition-transform duration-700 group-hover:scale-110"
              unoptimized
              onError={(e) => {
                e.currentTarget.srcset = `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=eff6ff&color=1d4ed8&size=256`;
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. Content: Tên cực đậm - Field mảnh */}
      <div className="px-8 pt-2 pb-8 flex flex-col flex-grow text-center">
        <h3 className="text-2xl font-extrabold text-blue-900 mb-2 leading-tight group-hover:text-blue-700 transition-colors">
          {partner.name}
        </h3>
        
        <div className="flex-grow">
          <p className="text-[13px] text-slate-400 font-medium leading-relaxed uppercase tracking-wider line-clamp-2 italic">
            {partner.field}
          </p>
        </div>

        {/* 3. Button - Style "Ghost to Solid" */}
        <div className="mt-8">
          <Link
            href={`/partners/${partner.id}`}
            onClick={(e) => e.preventDefault()}
            className="
              group/btn flex items-center justify-center w-full py-3.5 
              border-2 border-blue-600 text-blue-700 rounded-2xl 
              font-bold text-sm tracking-wide
              hover:bg-blue-600 hover:text-white transition-all duration-300
              active:scale-95
            "
          >
            XEM CHI TIẾT
            <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};