// src/components/Footer.tsx
"use client";

import Link from "next/link";
import React from "react";
import {
  ArrowRightCircleFill,
  EnvelopeFill,
  Facebook,
  GeoAltFill,
  Linkedin,
  TelephoneFill,
  Youtube,
} from "react-bootstrap-icons";

const ContactItem: React.FC<{
  icon: React.ComponentType<{ size?: number | string }>;
  label: string;
  value: React.ReactNode;
}> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div
      className="
        mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl
        bg-white/10 ring-1 ring-white/10
      "
    >
      <Icon size={16} />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-semibold text-white/70">{label}</p>
      <div className="mt-0.5 text-sm text-slate-200 leading-relaxed">
        {value}
      </div>
    </div>
  </div>
);

const QuickLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <li>
    <Link
      href={href}
      className="
        group inline-flex w-full items-center gap-3 rounded-2xl px-3 py-2
        text-slate-200 hover:text-white
        hover:bg-white/5 ring-1 ring-transparent hover:ring-white/10
        transition
      "
    >
      <ArrowRightCircleFill className="h-4 w-4 text-cyan-200/80 shrink-0 transition group-hover:text-cyan-200" />
      <span className="text-sm leading-relaxed transition group-hover:translate-x-0.5">
        {children}
      </span>
    </Link>
  </li>
);

const SocialIcon: React.FC<{
  href: string;
  label: string;
  children: React.ReactNode;
}> = ({ href, label, children }) => (
  <Link
    href={href}
    aria-label={label}
    className="
      inline-flex h-10 w-10 items-center justify-center rounded-2xl
      bg-white/10 text-slate-200
      ring-1 ring-white/10
      hover:bg-white/15 hover:text-white hover:ring-white/20
      transition
    "
  >
    {children}
  </Link>
);

const Footer: React.FC = () => {
  return (
    <footer className="relative text-slate-200">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-blue-950 to-slate-950" />
      <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.12),transparent_50%)]" />
      <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.16),transparent_55%)]" />

      <div className="relative">
        {/* Top */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          {/* Brand strip */}
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 ring-1 ring-white/10">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                <span className="text-xs sm:text-sm font-semibold text-white/90">
                  GENNOVAX • Precision Medicine
                </span>
              </div>

              <h3 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                GennovaX
              </h3>

              <p className="mt-3 max-w-2xl text-sm sm:text-base text-slate-200/90 leading-relaxed">
                Tiên phong ứng dụng công nghệ gen và AI trong y học chính xác,
                mang đến giải pháp sức khỏe tối ưu cho người Việt.
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                href="/lien-he"
                className="
                  inline-flex items-center justify-center rounded-2xl px-5 py-3
                  text-sm font-semibold text-white
                  bg-gradient-to-r from-blue-600 to-blue-800
                  hover:from-blue-700 hover:to-blue-900
                  ring-1 ring-white/10 shadow-sm
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950
                  transition
                "
              >
                Đặt lịch tư vấn
              </Link>

              <Link
                href="/dich-vu"
                className="
                  inline-flex items-center justify-center rounded-2xl px-5 py-3
                  text-sm font-semibold text-blue-950
                  bg-white/90 hover:bg-white
                  ring-1 ring-white/20 shadow-sm
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-950
                  transition
                "
              >
                Xem dịch vụ
              </Link>
            </div>
          </div>

          {/* Main grid: ép các card bằng chiều cao nhau */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Card wrapper: h-full + flex-col để nội dung map/links có thể co giãn */}
            <div className="lg:col-span-4">
              <div
                className="
                  h-full flex flex-col
                  rounded-3xl bg-white/5 p-6 sm:p-7
                  ring-1 ring-white/10 shadow-sm
                "
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-extrabold text-white">
                    Thông tin liên hệ
                  </h4>
                  <span className="text-xs font-semibold text-white/60">
                    Hỗ trợ 24/7
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  <ContactItem
                    icon={GeoAltFill}
                    label="Trụ sở"
                    value="Tầng 2, tòa CT3, 106 Hoàng Quốc Việt, Phường Nghĩa Đô, Hà Nội."
                  />
                  <ContactItem
                    icon={GeoAltFill}
                    label="Phòng LAB"
                    value="183 Đường Trường Chinh, Phường Phương Liệt, Hà Nội."
                  />
                  <ContactItem
                    icon={TelephoneFill}
                    label="Hotline"
                    value={
                      <span className="font-semibold text-white">
                        0936 654 456
                      </span>
                    }
                  />
                  <ContactItem
                    icon={EnvelopeFill}
                    label="Email"
                    value="info@gennovax.vn"
                  />
                </div>

                <div className="mt-auto pt-6">
                  <p className="text-xs font-semibold text-white/70">
                    Mạng xã hội
                  </p>
                  <div className="mt-3 flex gap-3">
                    <SocialIcon href="#" label="Facebook">
                      <Facebook size={18} />
                    </SocialIcon>
                    <SocialIcon href="#" label="Youtube">
                      <Youtube size={18} />
                    </SocialIcon>
                    <SocialIcon href="#" label="LinkedIn">
                      <Linkedin size={18} />
                    </SocialIcon>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div
                className="
                  h-full flex flex-col
                  rounded-3xl bg-white/5 p-6 sm:p-7
                  ring-1 ring-white/10 shadow-sm
                "
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-extrabold text-white">
                      Bản đồ chỉ đường
                    </h4>
                    <p className="mt-1 text-sm text-slate-200/85">
                      Ghé thăm văn phòng của chúng tôi tại Khu đô thị Nghĩa Đô.
                    </p>
                  </div>

                  <Link
                    href="#"
                    className="
                      hidden sm:inline-flex items-center justify-center
                      rounded-2xl px-4 py-2 text-sm font-semibold
                      bg-white/10 hover:bg-white/15
                      ring-1 ring-white/10 hover:ring-white/20
                      transition
                    "
                  >
                    Mở Google Maps
                  </Link>
                </div>

                {/* Map: flex-1 để tự giãn đầy card -> chiều cao các card sẽ bằng nhau */}
                <div className="mt-5 flex-1 overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-sm">
                  <div className="relative h-full min-h-[260px]">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.5745338292195!2d105.79059527476983!3d21.049703387059914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab7ab07df9fd%3A0xa4894ce03534c510!2zQ2h1bmcgY8awIENUMyBOZ2jEqWEgxJDDtA!5e0!3m2!1svi!2sus!4v1763526823094!5m2!1svi!2sus"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="absolute inset-0"
                      title="GennovaX Location"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div
                className="
                  h-full flex flex-col
                  rounded-3xl bg-white/5 p-6 sm:p-7
                  ring-1 ring-white/10 shadow-sm
                "
              >
                <h4 className="text-lg font-extrabold text-white">
                  Dịch vụ nổi bật
                </h4>
                <ul className="mt-4 space-y-2">
                  <QuickLink href="/dich-vu/NIPT">
                    Xét nghiệm sàng lọc trước sinh (NIPT)
                  </QuickLink>
                  <QuickLink href="/dich-vu/DNA">
                    Xét nghiệm gen di truyền (DNA)
                  </QuickLink>
                </ul>

                <div className="mt-8">
                  <h4 className="text-lg font-extrabold text-white">
                    Về chúng tôi
                  </h4>
                  <ul className="mt-4 space-y-2">
                    <QuickLink href="/ve-gennovax">
                      Hành trình GennovaX
                    </QuickLink>
                    <QuickLink href="/tin-tuc">Tin tức & Sự kiện</QuickLink>
                    <QuickLink href="/gioi-thieu/doi-ngu-bac-sy">
                      Liên hệ Chuyên gia
                    </QuickLink>
                  </ul>
                </div>

                {/* Đẩy box gợi ý xuống đáy để card cân đều */}
                {/* <div className="mt-auto pt-8">
                  <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                    <p className="text-xs font-semibold text-white/70">Gợi ý</p>
                    <p className="mt-1 text-sm text-slate-200/90 leading-relaxed">
                      Cần tư vấn nhanh? Hãy để lại thông tin, đội ngũ sẽ liên hệ trong thời gian sớm nhất.
                    </p>
                    <Link
                      href="/lien-he"
                      className="
                        mt-3 inline-flex w-full items-center justify-center
                        rounded-2xl px-4 py-2.5 text-sm font-semibold
                        text-blue-950 bg-white/90 hover:bg-white
                        ring-1 ring-white/20
                        transition
                      "
                    >
                      Liên hệ ngay
                    </Link>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 bg-black/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-slate-200/75">
                Một sản phẩm của CÔNG TY CỔ PHẦN GENNOVAX.
                <br />© {new Date().getFullYear()} GennovaX. All Rights
                Reserved.
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <Link
                  href="/terms"
                  className="text-slate-200/70 hover:text-white transition"
                >
                  Điều khoản sử dụng
                </Link>
                <span className="text-white/20">|</span>
                <Link
                  href="/privacy"
                  className="text-slate-200/70 hover:text-white transition"
                >
                  Chính sách bảo mật
                </Link>
                <span className="text-white/20 hidden sm:inline">|</span>
                <Link
                  href="/lien-he"
                  className="text-slate-200/70 hover:text-white transition"
                >
                  Hỗ trợ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
