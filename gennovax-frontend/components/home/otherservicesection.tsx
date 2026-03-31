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
    title: "Chăm sóc thai kỳ",
    description: "Sàng lọc, chẩn đoán, trước, trong và sau khi mang thai.",
    imageUrl:
      "https://res.cloudinary.com/da6f4dmql/image/upload/v1764742688/gen-h-z7287822248537_47046515784e5e419d59740b0d1edc4d_y0x2mk.jpg",
    icon: BriefcaseFill,
    href: "/services/corporate-solutions",
  },
  {
    id: "nghien-cuu",
    title: "Nghiên cứu & Phát triển",
    description:
      "Hợp tác R&D, ứng dụng AI và giải trình tự gen thế hệ mới vào y học chính xác.",
    imageUrl:
      "https://genesolutions.vn/wp-content/uploads/2022/11/hoi-nghi-giam-doc-benh-vien_new-1.jpg",
    icon: Flask,
    href: "/services/research-development",
  },
];

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;

  return (
    <article className="group relative h-80 w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white ring-1 ring-sky-100/60 shadow-[0_22px_60px_rgba(148,163,184,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_32px_80px_rgba(14,165,233,0.18)] lg:h-96">
      <div className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-700" />

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
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/82 via-slate-950/28 to-transparent" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-end p-5 sm:p-6">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur transition-all duration-300 group-hover:scale-[1.03] group-hover:bg-white/20">
          <Icon size={26} />
        </div>

        <h3 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
          {service.title}
        </h3>

        <p className="mt-2 line-clamp-2 text-sm leading-7 text-white/85 sm:text-base">
          {service.description}
        </p>

        <div className="mt-5 flex items-center gap-2">
          <Link
            href={service.href}
            onClick={(e) => {
              e.preventDefault();
            }}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-blue-900 ring-1 ring-white/30 shadow-sm transition hover:bg-blue-50"
          >
            Tìm hiểu
            <ArrowRightCircle className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>

          <span className="hidden items-center rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white/85 ring-1 ring-white/15 sm:inline-flex">
            Xem chi tiết
          </span>
        </div>
      </div>
    </article>
  );
}

const OtherServices: React.FC = () => {
  return (
    <section className="relative py-14 lg:py-20">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#f8fcff_48%,#f1f8fb_100%)]" />
      <div className="absolute inset-x-0 top-10 h-72 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.09),transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 ring-1 ring-sky-200 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-sky-500" />
            <span className="text-xs font-semibold text-sky-700 sm:text-sm">
              Dịch vụ mở rộng
            </span>
          </div>

          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-6xl">
            Dịch vụ nổi bật <span className="text-sky-700">khác</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            Hệ sinh thái dịch vụ hỗ trợ từ tư vấn, chăm sóc thai kỳ đến hợp tác
            nghiên cứu và phát triển.
          </p>
        </div>

        <div
          className="mt-8 flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory lg:mt-12 lg:grid lg:grid-cols-3 lg:gap-7 lg:overflow-visible lg:pb-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {serviceData.map((service) => (
            <div
              key={service.id}
              className="w-[85vw] flex-shrink-0 snap-center sm:w-[60vw] md:w-auto"
            >
              <ServiceCard service={service} />
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/dich-vu"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-sky-700 ring-1 ring-sky-100 shadow-sm transition hover:bg-sky-50 sm:text-base"
          >
            Xem toàn bộ dịch vụ →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OtherServices;
