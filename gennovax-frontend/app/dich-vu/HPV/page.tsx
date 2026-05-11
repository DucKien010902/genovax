"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  ShieldCheck,
  Users,
  Beaker,
  HeartPulse,
  Calendar,
  Mail,
  Microscope,
  Stethoscope,
  ClipboardCheck,
  Clock,
  Lock,
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";
import ConsultationModal from "@/components/home/ConsultationModal";

// Nếu ảnh Google Drive không hiển thị trực tiếp, dùng hàm này để chuyển link share sang link ảnh trực tiếp.
const getDriveImageUrl = (url: string) => {
  const match = url.match(/\/d\/([^/]+)\//);
  return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : url;
};

const hpvImages = {
  hero: "https://res.cloudinary.com/da6f4dmql/image/upload/v1764746810/shutterstock_1802264764_u02kyk.jpg",
  intro: "https://res.cloudinary.com/da6f4dmql/image/upload/v1777954372/HPV_Awareness_Day_1_zac4ft.png",
  target: "https://res.cloudinary.com/da6f4dmql/image/upload/v1777954478/FB_NIPT_-_ADN_4_kscoff.png",
  why: "https://res.cloudinary.com/da6f4dmql/image/upload/v1777954566/HPV_Awareness_Day_p285qh.png",
  process:"https://res.cloudinary.com/da6f4dmql/image/upload/v1777954717/T%E1%BB%9D_r%C6%A1i_HPV_A4.pdf_u9q1gj.png",
};

const pricingData = [
  {
    stt: 1,
    name: "Xét nghiệm HPV 23 type",
    price: "500.000",
    time: "24 - 48 giờ",
  },
  {
    stt: 2,
    name: "Xét nghiệm HPV 40 type",
    price: "700.000",
    time: "24 - 48 giờ",
  },
  {
    stt: 3,
    name: "Cellprep",
    price: "550.000",
    time: "24 - 48 giờ",
  },
  {
    stt: 4,
    name: "Sàng lọc Thin",
    price: "500.000",
    time: "24 - 48 giờ",
  },
  {
    stt: 5,
    name: "Combo HPV23 + Cell",
    price: "900.000",
    time: "24 - 48 giờ",
  },
  {
    stt: 6,
    name: "Combo HPV40 + Cell",
    price: "1.200.000",
    time: "24 - 48 giờ",
  },
  {
    stt: 7,
    name: "Combo HPV23 + Thin",
    price: "800.000",
    time: "24 - 48 giờ",
  },
  {
    stt: 8,
    name: "Combo HPV40 + Thin",
    price: "1.000.000",
    time: "24 - 48 giờ",
  },
];

type BrandColors = {
  primary: string;
  secondary: string;
  accent: string;
  lightBg: string;
};

type SectionProps = {
  brandColors: BrandColors;
};

const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: "540px" }}>
      <img
        src={hpvImages.hero}
        alt="Giải pháp tầm soát sớm ung thư cổ tử cung GennovaX"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-blue-950/60"></div>

      <div className="container relative z-10 mx-auto flex h-full min-h-[540px] max-w-7xl items-center px-4 py-10 text-white md:py-20">
        <div className="w-full max-w-2xl rounded-2xl bg-white/15 p-5 shadow-2xl backdrop-blur-md md:p-12">
          <p className="mb-4 inline-flex rounded-full bg-cyan-400/20 px-4 py-2 text-sm font-bold uppercase tracking-wide text-cyan-100">
            Tầm soát HPV & tế bào học cổ tử cung
          </p>

          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            Giải pháp kép
            <br />
            tầm soát sớm Ung thư Cổ tử cung
          </h1>

          <div className="my-6 h-1.5 w-24 bg-cyan-400"></div>

          <p className="text-xl font-semibold text-white md:text-2xl">
            5 phút tầm soát - 5 năm an tâm
          </p>

          <p className="mt-4 text-lg text-white md:text-xl">
            Chủ động bảo vệ sức khỏe phụ nữ với công nghệ định type HPV và tế
            bào học tiên tiến.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                setIsModalOpen(true);
              }}
              className="rounded-full bg-cyan-500 px-5 py-3 text-base font-bold text-white shadow-lg transition duration-300 hover:bg-cyan-400 md:px-8 md:py-3.5"
            >
              Đăng ký tư vấn
            </Link>

            <Link
              href="/dich-vu/HPV/#bang-gia"
              className="rounded-full bg-white/20 px-5 py-3 text-base font-bold text-white backdrop-blur-sm transition duration-300 hover:bg-white/30 md:px-8 md:py-3.5"
            >
              Tìm hiểu thêm
            </Link>
          </div>
        </div>
      </div>

      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

const IntroSection: React.FC<SectionProps> = ({ brandColors }) => (
  <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2">
    <div className="space-y-6">
      <h1
        className="text-4xl font-extrabold md:text-5xl"
        style={{ color: brandColors.primary }}
      >
        Tầm soát kép, trọn vẹn an tâm cho phái nữ.
      </h1>

      <p className="text-xl text-gray-600">
        Ung thư cổ tử cung hoàn toàn có thể ngăn chặn nếu được phát hiện từ sớm.
        Tại GennovaX, chúng tôi mang đến giải pháp kết hợp giữa định type HPV và
        phân tích tế bào học, giúp chị em chủ động bảo vệ sức khỏe.
      </p>

      <div className="grid gap-4 pt-3">
        <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck
              className="mt-1 h-7 w-7 flex-shrink-0"
              style={{ color: brandColors.secondary }}
            />
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                HPV Genotype
              </h3>
              <p className="mt-1 text-gray-600">
                Phát hiện sự hiện diện của 40 chủng virus HPV nguy cơ cao và
                thấp, đặc biệt là các chủng 6, 11, 16, 18.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          <div className="flex items-start gap-3">
            <Microscope
              className="mt-1 h-7 w-7 flex-shrink-0"
              style={{ color: brandColors.accent }}
            />
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Cell-Thin / LBC
              </h3>
              <p className="mt-1 text-gray-600">
                Phân tích sự thay đổi bất thường của các tế bào biểu mô cổ tử
                cung.
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="rounded-2xl bg-blue-50 p-5 text-lg font-semibold text-gray-700">
        Tăng tỷ lệ phát hiện bệnh lên đến{" "}
        <span style={{ color: brandColors.primary }}>99%</span>, giúp chị em
        kịp thời nắm bắt thời điểm “vàng” để bảo vệ thiên chức và hạnh phúc của
        chính mình.
      </p>
    </div>

    <div className="flex justify-center">
      <img
        src={hpvImages.intro}
        alt="Tầm soát kép HPV và tế bào học"
        className="h-auto w-full rounded-2xl object-contain shadow-xl"
      />
    </div>
  </section>
);

const TargetSection: React.FC<SectionProps> = ({ brandColors }) => {
  const targets = [
    "Phụ nữ đã từng quan hệ tình dục.",
    "Phụ nữ có triệu chứng bất thường như ra máu âm đạo, đau vùng chậu,...",
    "Người có kết quả xét nghiệm định kỳ không rõ ràng.",
    "Phụ nữ từ 25 - 65 tuổi theo khuyến cáo của Tổ chức Y tế Thế giới.",
  ];

  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2">
      <div className="order-last flex justify-center md:order-first">
        <img
          src={hpvImages.target}
          alt="Đối tượng nên tầm soát ung thư cổ tử cung định kỳ"
          className="h-auto w-full rounded-2xl object-contain shadow-xl"
        />
      </div>

      <div className="order-first space-y-6 md:order-last">
        <h2
          className="text-4xl font-extrabold"
          style={{ color: brandColors.primary }}
        >
          Những ai nên tầm soát ung thư cổ tử cung định kỳ?
        </h2>

        <p className="text-xl text-gray-600">
          Tầm soát định kỳ giúp phát hiện sớm nguy cơ, đặc biệt ở những nhóm phụ
          nữ có yếu tố nguy cơ hoặc đang trong độ tuổi được khuyến cáo.
        </p>

        <ul className="space-y-4 pt-3">
          {targets.map((item) => (
            <li key={item} className="flex items-start text-lg text-gray-700">
              <CheckCircle
                className="mr-3 mt-1 h-6 w-6 flex-shrink-0"
                style={{ color: brandColors.secondary }}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

const WhyUsSection: React.FC<SectionProps> = ({ brandColors }) => {
  const reasons = [
    {
      icon: Beaker,
      title: "Độ nhạy cao",
      desc: "Công nghệ Realtime PCR đạt chuẩn ISO, giúp phát hiện virus ngay cả ở nồng độ rất thấp.",
    },
    {
      icon: HeartPulse,
      title: "Lấy mẫu nhẹ nhàng",
      desc: "Sử dụng chổi lấy mẫu chuyên dụng, thao tác nhanh chóng, hạn chế khó chịu và không gây đau đớn.",
    },
    {
      icon: Microscope,
      title: "Hệ thống tự động",
      desc: "Quy trình xử lý mẫu Cell-Thin hiện đại, hình ảnh tế bào rõ nét, giảm sai sót do con người.",
    },
    {
      icon: Lock,
      title: "Bảo mật & nhanh chóng",
      desc: "Trả kết quả trực tuyến qua Email trong vòng 1 - 3 ngày.",
    },
  ];

  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 md:grid-cols-2">
      <div className="space-y-6">
        <h2
          className="text-4xl font-extrabold"
          style={{ color: brandColors.primary }}
        >
          Chính xác, nhẹ nhàng và bảo mật.
        </h2>

        <p className="text-xl text-gray-600">
          Chúng tôi thấu hiểu rằng đằng sau mỗi xét nghiệm là sự lo lắng và mong
          cầu về một kết quả chính xác, nhanh chóng nhưng vẫn thoải mái trong quá
          trình thực hiện.
        </p>

        <div className="grid gap-4 pt-3">
          {reasons.map((reason) => {
            const Icon = reason.icon;

            return (
              <div
                key={reason.title}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-md"
              >
                <div className="flex items-start gap-3">
                  <Icon
                    className="mt-1 h-7 w-7 flex-shrink-0"
                    style={{ color: brandColors.secondary }}
                  />
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {reason.title}
                    </h3>
                    <p className="mt-1 text-gray-600">{reason.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center">
        <img
          src={hpvImages.why}
          alt="Vì sao chọn GennovaX để tầm soát HPV"
          className="h-auto w-full rounded-2xl object-contain shadow-xl"
        />
      </div>
    </section>
  );
};

const ProcessImageSection = () => (
  <section className="mx-auto max-w-6xl">
    <div className="flex justify-center">
      <img
        src={hpvImages.process}
        alt="Quy trình tầm soát ung thư cổ tử cung tại GennovaX"
        className="h-auto w-full rounded-2xl object-contain shadow-xl"
      />
    </div>
  </section>
);

const ProcessSection: React.FC<SectionProps> = ({ brandColors }) => {
  const steps = [
    {
      icon: Calendar,
      title: "1. Đăng ký và tư vấn",
      desc: "Đội ngũ GennovaX tiếp nhận thông tin và tư vấn gói tầm soát phù hợp.",
    },
    {
      icon: Stethoscope,
      title: "2. Lấy mẫu",
      desc: "Lấy mẫu dịch phết cổ tử cung bằng dụng cụ chuyên dụng, nhanh chóng và nhẹ nhàng.",
    },
    {
      icon: Microscope,
      title: "3. Phân tích mẫu",
      desc: "Mẫu được xử lý bằng hệ thống máy hiện đại, đảm bảo quy trình kiểm soát chặt chẽ.",
    },
    {
      icon: ClipboardCheck,
      title: "4. Trả kết quả",
      desc: "Trả kết quả và tư vấn chuyên sâu cùng chuyên gia.",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl">
      <div className="mb-12 text-center">
        <h2
          className="text-4xl font-extrabold md:text-5xl"
          style={{ color: brandColors.primary }}
        >
          Quy trình tầm soát tại GennovaX
        </h2>
        <p className="mx-auto mt-5 max-w-3xl text-xl text-gray-600">
          Quy trình được thiết kế tinh gọn, riêng tư và thuận tiện để chị em an
          tâm trong từng bước thực hiện.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <div
              key={step.title}
              className="rounded-2xl bg-white p-6 text-center shadow-lg ring-1 ring-gray-100"
            >
              <div
                className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: brandColors.lightBg }}
              >
                <Icon
                  className="h-8 w-8"
                  style={{ color: brandColors.secondary }}
                />
              </div>
              <h3
                className="text-lg font-bold"
                style={{ color: brandColors.primary }}
              >
                {step.title}
              </h3>
              <p className="mt-3 text-gray-600">{step.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const PricingTableSection: React.FC<SectionProps> = ({ brandColors }) => (
  <section
    className="mx-auto flex max-w-6xl flex-col items-center pt-0"
    id="bang-gia"
  >
    <div className="mb-10 text-center">
      <p
        className="mb-3 inline-flex rounded-full px-4 py-2 text-sm font-bold"
        style={{
          backgroundColor: brandColors.lightBg,
          color: brandColors.primary,
        }}
      >
        Áp dụng từ ngày 01/04/2026 cho đến khi có thông báo mới
      </p>

      <h2
        className="text-4xl font-extrabold md:text-5xl"
        style={{ color: brandColors.primary }}
      >
        Bảng giá dịch vụ tầm soát ung thư cổ tử cung
      </h2>

      <p className="mx-auto mt-5 max-w-3xl text-xl text-gray-600">
        Lựa chọn gói xét nghiệm phù hợp với nhu cầu tầm soát của bạn. Tất cả
        dịch vụ đều có thời gian trả kết quả nhanh từ{" "}
        <span className="font-semibold">24 - 48 giờ</span>.
      </p>
    </div>

    <div className="w-full overflow-x-auto rounded-2xl shadow-2xl">
      <table
        className="w-full min-w-[760px] border-collapse"
        style={{ border: `4px solid ${brandColors.primary}` }}
      >
        <thead
          className="text-white"
          style={{ backgroundColor: brandColors.primary }}
        >
          <tr>
            <th className="w-20 p-4 text-center text-lg font-semibold">STT</th>
            <th className="p-4 text-left text-lg font-semibold">
              Nội dung
            </th>
            <th className="p-4 text-center text-lg font-semibold">
              Chi phí
            </th>
            <th className="p-4 text-center text-lg font-semibold">
              Thời gian trả kết quả
            </th>
          </tr>
        </thead>

        <tbody className="text-gray-700">
          {pricingData.map((item, index) => (
            <tr
              key={item.stt}
              className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
            >
              <td className="p-4 text-center font-semibold">{item.stt}</td>
              <td className="p-4 font-semibold">{item.name}</td>
              <td
                className="p-4 text-center text-lg font-bold"
                style={{ color: brandColors.primary }}
              >
                {item.price}
              </td>
              <td className="p-4 text-center">{item.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="mt-8 grid w-full gap-4 md:grid-cols-3">
      <div className="rounded-2xl bg-cyan-50 p-5">
        <BadgeCheck
          className="mb-3 h-7 w-7"
          style={{ color: brandColors.secondary }}
        />
        <h3 className="font-bold text-gray-800">Gói linh hoạt</h3>
        <p className="mt-1 text-gray-600">
          Có thể chọn xét nghiệm đơn lẻ hoặc combo HPV + tế bào học.
        </p>
      </div>

      <div className="rounded-2xl bg-emerald-50 p-5">
        <Clock
          className="mb-3 h-7 w-7"
          style={{ color: brandColors.accent }}
        />
        <h3 className="font-bold text-gray-800">Kết quả nhanh</h3>
        <p className="mt-1 text-gray-600">
          Hầu hết dịch vụ có thời gian trả kết quả trong 24 - 48 giờ.
        </p>
      </div>

      <div className="rounded-2xl bg-blue-50 p-5">
        <Mail
          className="mb-3 h-7 w-7"
          style={{ color: brandColors.primary }}
        />
        <h3 className="font-bold text-gray-800">Nhận kết quả bảo mật</h3>
        <p className="mt-1 text-gray-600">
          Kết quả được gửi trực tuyến qua Email, thuận tiện và riêng tư.
        </p>
      </div>
    </div>
  </section>
);

export default function HpvLandingPage() {
  const brandColors = {
    primary: "#0D47A1",
    secondary: "#06B6D4",
    accent: "#10B981",
    lightBg: "#E0F7FA",
  };

  return (
    <main className="relative min-h-screen text-gray-800">
      <HeroSection />

      <div className="container relative z-10 mx-auto max-w-6xl space-y-24 bg-white px-4 py-10 md:py-16">
        <IntroSection brandColors={brandColors} />

        <TargetSection brandColors={brandColors} />

        <WhyUsSection brandColors={brandColors} />

        <ProcessImageSection />

        <ProcessSection brandColors={brandColors} />

        <PricingTableSection brandColors={brandColors} />
      </div>
    </main>
  );
}