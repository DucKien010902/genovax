"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, CheckCircle, Star } from "lucide-react";
import { clinicData } from "@/data/clinics";
import { Clinic } from "@/types/clinic";

export default function ClinicListPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  // Mặc định chọn phòng khám đầu tiên nếu có dữ liệu
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(
    clinicData.length > 0 ? clinicData[0] : null
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

  // Lọc dữ liệu (Sử dụng useMemo để tối ưu hiệu năng)
  const filteredClinics = useMemo(() => {
    return clinicData.filter((clinic) =>
      removeVietnameseTones(clinic.name).includes(
        removeVietnameseTones(searchTerm)
      )
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#e8f4fd] px-4 py-8 md:pt-34 md:px-12">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-[#00b5f1] mb-2">Phòng Khám</h1>
        <p className="text-lg text-[#245c87]">
          Trải nghiệm chăm sóc y tế tập trung và gần gũi tại phòng khám chuyên khoa
        </p>

        {/* Search Bar */}
        <div className="relative mx-auto mt-8 w-full max-w-2xl">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border-none bg-white py-4 pl-12 pr-4 text-gray-900 shadow-[0_6px_24px_rgba(0,0,0,0.06)] focus:ring-2 focus:ring-[#00b5f1] sm:text-base outline-none transition-all"
            placeholder="Tìm kiếm cơ sở y tế..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 container mx-auto max-w-7xl">
        {/* Left Column: List Clinic (Chiếm 7 phần) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {filteredClinics.map((clinic) => (
            <div
              key={clinic.id}
              onClick={() => setSelectedClinic(clinic)}
              className={`
                group relative flex flex-col md:flex-row bg-white rounded-2xl p-4 cursor-pointer
                transition-all duration-300 ease-in-out border-2
                ${
                  selectedClinic?.id === clinic.id
                    ? "border-[#00b5f1] shadow-[0_0_12px_rgba(0,181,241,0.4)]"
                    : "border-transparent shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:border-[#00b5f1] hover:shadow-[0_0_12px_rgba(0,181,241,0.4)]"
                }
              `}
            >
              {/* Image */}
              <div className="w-full md:w-1/3 h-48 md:h-auto flex-shrink-0">
                <img
                  src={clinic.image}
                  alt={clinic.name}
                  className="h-full w-full rounded-xl object-cover"
                />
              </div>

              {/* Content */}
              <div className="mt-4 md:mt-0 md:ml-6 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    {clinic.name}
                    {clinic.isVerified && (
                      <CheckCircle className="h-5 w-5 text-green-500 fill-green-100" />
                    )}
                  </h3>
                  <p className="text-gray-500 mt-2 flex items-start gap-1">
                    <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                    {clinic.address}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center mt-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(clinic.rating)
                              ? "fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-[#f760b6] font-medium">
                      ({clinic.rating})
                    </span>
                  </div>
                </div>

                {/* Actions Buttons */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/y-te/chi-tiet-phong-kham?ID=${clinic.clinicId}`);
                    }}
                    className="px-6 py-2 rounded-full border-2 border-[#00b5f1] text-[#00b5f1] font-semibold hover:bg-[#00b5f1] hover:text-white transition-colors"
                  >
                    Xem chi tiết
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/y-te/dat-lich-xet-nghiem?ID=${clinic.clinicId}`);
                    }}
                    className="px-6 py-2 rounded-full bg-[#00b5f1] text-white font-semibold hover:bg-[#009fd4] transition-colors shadow-md"
                  >
                    Đặt khám ngay
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredClinics.length === 0 && (
            <div className="text-center py-10 text-gray-500 italic">
              Không tìm thấy phòng khám nào phù hợp.
            </div>
          )}
        </div>

        {/* Right Column: Detail Clinic (Chiếm 5 phần) */}
        <div className="lg:col-span-5 hidden lg:block">
          <div className="sticky top-8">
            {selectedClinic ? (
              <div className="bg-white rounded-2xl shadow-[2px_2px_10px_rgba(0,0,0,0.1)] overflow-hidden p-6">
                <h2 className="text-xl font-bold text-[#380d75] text-center mb-4">
                  {selectedClinic.name}
                </h2>
                
                <img
                  src={selectedClinic.image}
                  alt={selectedClinic.name}
                  className="w-full h-[200px] object-cover rounded-xl mb-4"
                />

                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-gray-800">Địa chỉ:</h4>
                    <p className="text-gray-600 flex items-start gap-2 mt-1">
                      <MapPin className="h-4 w-4 mt-1 text-[#00b5f1]" />
                      {selectedClinic.address}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-800">Mô tả:</h4>
                    <div className="text-gray-600 mt-1 space-y-2">
                      {selectedClinic.descriptions.map((desc, idx) => (
                        <p key={idx}>{desc}</p>
                      ))}
                    </div>
                  </div>

                  {selectedClinic.mapEmbedUrl && (
                    <div>
                      <h4 className="font-bold text-gray-800 mb-2">Bản đồ:</h4>
                      <iframe
                        src={selectedClinic.mapEmbedUrl}
                        width="100%"
                        height="250"
                        className="border-0 rounded-xl"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Clinic Location"
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400 italic bg-white rounded-2xl">
                Vui lòng chọn một phòng khám để xem chi tiết.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}