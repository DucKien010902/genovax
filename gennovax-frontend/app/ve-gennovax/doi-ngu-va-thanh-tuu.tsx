"use client";

import React from "react";
// import Image from 'next/image'; // Nên dùng 'next/image' khi deploy

// Danh sách các ảnh sẽ hiển thị
// Sắp xếp: 2 ảnh đội ngũ, sau đó 2 ảnh chứng nhận
const galleryImages = [
  {
    src: "https://res.cloudinary.com/da6f4dmql/image/upload/v1765532831/Ho%CC%82%CC%80_so%CC%9B_na%CC%86ng_lu%CC%9B%CC%A3c_Gennovax_12_1_1_injiyv.png",
    alt: "Đội ngũ chuyên gia GennovaX 1",
  },
  {
    src: "https://res.cloudinary.com/da6f4dmql/image/upload/v1765532934/Ho%CC%82%CC%80_so%CC%9B_na%CC%86ng_lu%CC%9B%CC%A3c_Gennovax_12_1_2_ggq4m4.png",
    alt: "Đội ngũ chuyên gia GennovaX 2",
  },
  {
    src: "https://res.cloudinary.com/da6f4dmql/image/upload/v1763106320/Screenshot_21_uw3zmg.png",
    alt: "Thành tựu và Chứng nhận GennovaX 1",
  },
  {
    src: "https://res.cloudinary.com/da6f4dmql/image/upload/v1763106320/Screenshot_22_zeejdk.png",
    alt: "Thành tựu và Chứng nhận GennovaX 2",
  },
];

// Màu sắc (để nhất quán)
const brandColors = {
  primary: "#0D47A1",
};

export default function ExpertsAndAchievements() {
  return (
    <section
      id="doi-ngu-va-thanh-tuu" // Bạn có thể đổi ID này nếu muốn
      className="w-full bg-gray-50 py-24" // Nền xám nhạt
    >
      <div className="container mx-auto max-w-7xl px-4">
        {/* Theo yêu cầu "chỉ để ảnh, không text giải thích", 
          tôi sẽ thêm một tiêu đề duy nhất để định danh section 
        */}
        <h2
          className="mb-16 text-center text-4xl font-extrabold"
          style={{ color: brandColors.primary }}
        >
          Đội Ngũ Chuyên Gia & Thành Tựu
        </h2>

        {/* Gallery ảnh: 2 cột trên desktop (md:grid-cols-2)
          và 1 cột trên mobile (grid-cols-1)
        */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {galleryImages.map((image) => (
            <div
              key={image.src}
              className="rounded-xl bg-white p-4 shadow-xl transition-shadow duration-300 hover:shadow-2xl"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full rounded-lg object-contain"
                // 'object-contain' đảm bảo ảnh không bị méo hoặc cắt (giữ đúng tỉ lệ)
                // 'h-full w-full' đảm bảo ảnh lấp đầy container
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
