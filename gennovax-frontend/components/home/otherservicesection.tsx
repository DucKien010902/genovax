// src/components/OtherServices.tsx
"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import {
  ArrowRightCircle,
  BriefcaseFill,
  Flask,
  PeopleFill,
} from "react-bootstrap-icons";

export type Service = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  icon: React.ComponentType<{ size?: number | string }>;
  href: string;
};

const serviceData: Service[] = [
  {
    id: "tu-van",
    title: "Tư vấn di truyền",
    description:
      "Kết nối trực tiếp với chuyên gia để giải mã gen, tư vấn chuyên sâu và xây dựng kế hoạch sức khỏe.",
    imageUrl:
      "https://res.cloudinary.com/da6f4dmql/image/upload/v1764730192/dl.beatsnoop.com-3000-O9KATiVLbI_bf17z3.jpg",
    icon: PeopleFill,
    href: "/gioi-thieu#doi-ngu-va-thanh-tuu",
  },
  {
    id: "doanh-nghiep",
    title: "Chăm sóc thai kì",
    description: "Sàng lọc, chẩn đoán, trước, trong, sau khi mang thai.",
    imageUrl:
      "https://res.cloudinary.com/da6f4dmql/image/upload/v1764742688/gen-h-z7287822248537_47046515784e5e419d59740b0d1edc4d_y0x2mk.jpg",
    icon: BriefcaseFill,
    href: "/services/corporate-solutions",
  },
  {
    id: "nghien-cuu",
    title: "Nghiên cứu & Phát triển",
    description:
      "Hợp tác R&D, ứng dụng công nghệ AI và giải trình tự gen thế hệ mới (NGS) vào y học chính xác.",
    imageUrl:
      "https://genesolutions.vn/wp-content/uploads/2022/11/hoi-nghi-giam-doc-benh-vien_new-1.jpg",
    icon: Flask,
    href: "/services/research-development",
  },
];

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  const Icon = service.icon;

  return (
    <article
      className="
        group relative h-80 lg:h-96 w-full overflow-hidden rounded-3xl
        bg-white ring-1 ring-blue-900/10 shadow-sm
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl hover:ring-blue-900/20
      "
    >
      {/* Accent line */}
      <div className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500" />

      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={service.imageUrl}
          alt={service.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          sizes="(max-width: 768px) 85vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
        {/* medical overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/25 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end p-5 sm:p-6">
        {/* Icon badge */}
        <div
          className="
            mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl
            bg-white/15 ring-1 ring-white/25 backdrop-blur
            transition-all duration-300
            group-hover:bg-white/20 group-hover:scale-[1.03]
          "
        >
          <Icon size={26} />
        </div>

        <h3 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
          {service.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm sm:text-base text-white/85 leading-relaxed">
          {service.description}
        </p>

        {/* Actions */}
        <div className="mt-5 flex items-center gap-2">
          <Link
            href={service.href}
            onClick={(e)=>{e.preventDefault()}}
            className="
              inline-flex items-center gap-2
              rounded-2xl px-4 py-2.5 text-sm font-semibold
              bg-white text-blue-900
              ring-1 ring-white/30 shadow-sm
              hover:bg-blue-50
              focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
              transition
            "
          >
            Tìm hiểu
            <ArrowRightCircle className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>

          {/* tiny hint pill */}
          <span className="hidden sm:inline-flex items-center rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white/85 ring-1 ring-white/15">
            Xem chi tiết
          </span>
        </div>
      </div>
    </article>
  );
};

const OtherServices: React.FC = () => {
  return (
    <section className="relative py-10 lg:py-16">
      {/* Background giống tone section khác */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/70 via-white/40 to-white/70" />
      <div className="absolute inset-0 bg-white/50" />

      <div className="relative mx-auto max-w-7xl px-4">
        {/* Header đồng bộ */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 ring-1 ring-blue-900/10 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            <span className="text-xs sm:text-sm font-semibold text-blue-700">
              Dịch vụ mở rộng
            </span>
          </div>

          <h2 className="mt-4 text-xl sm:text-2xl lg:text-5xl font-extrabold tracking-tight text-slate-900">
            Dịch vụ nổi bật <span className="text-blue-700">khác</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Hệ sinh thái dịch vụ hỗ trợ từ tư vấn, chăm sóc thai kỳ đến hợp tác
            nghiên cứu & phát triển.
          </p>
        </div>

        {/* List: mobile scroll ngang, desktop grid */}
        <div
          className="
            mt-8 lg:mt-12
            flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory
            lg:grid lg:grid-cols-3 lg:gap-7 lg:overflow-visible lg:pb-0
          "
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {serviceData.map((service) => (
            <div
              key={service.id}
              className="flex-shrink-0 w-[85vw] snap-center sm:w-[60vw] md:w-auto"
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </div>

        {/* CTA tổng */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/dich-vu"
            className="
              inline-flex items-center justify-center
              rounded-full px-6 py-3 text-sm sm:text-base font-semibold
              text-blue-700 bg-white/90
              ring-1 ring-blue-900/10 shadow-sm
              hover:bg-white hover:ring-blue-900/20
              transition
            "
          >
            Xem toàn bộ dịch vụ →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OtherServices;
