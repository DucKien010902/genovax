'use client';

import React from 'react';
import Link from 'next/link';
// Cài đặt: npm install lucide-react
import { 
  CheckCircle, 
  ChevronRight, 
  Database, 
  FlaskConical, 
  MapPin, 
  ShieldCheck,
  FileText,
  CalendarDays,
  AlertTriangle // Thêm icon cho phần Lưu ý
} from 'lucide-react';

// --- COMPONENT CHÍNH TRANG DỊCH VỤ ADN ---

export default function GennovaxDnaService() {
  return (
    <section className="w-full bg-white text-gray-800">
      
      {/* === 1. HERO SECTION === */}
      {/* Sử dụng Ảnh web-11.png */}
      <HeroSection />

      {/* === 2. CÁC KHỐI TÍNH NĂNG (BỐ CỤC SO LE) === */}
      <div className="py-20 bg-gray-50">
        
        {/* Khối 1: Lợi thế & Cam kết (Ảnh web_Artboard 5 copy.png) */}
        <FeatureBlock
          imageSrc="/images/ADN/Ảnh web_Artboard 5 copy.png"
          imageAlt="Gia đình hạnh phúc"
          title="Lợi thế vượt trội & Cam kết từ GennovaX"
          subtitle="Chính xác 99.9999% - Bảo mật tuyệt đối"
        >
          <p className="mb-6 text-lg text-gray-600">
            Chúng tôi hiểu rằng kết quả xét nghiệm ADN là thông tin vô cùng quan trọng. Vì vậy, GennovaX cam kết mang đến dịch vụ với chất lượng và tiêu chuẩn cao nhất.
          </p>
          <ul className="space-y-4">
            <FeatureListItem
              icon={FlaskConical}
              title="Công nghệ Illumina (Mỹ)"
              description="Chuẩn giải trình tự ADN chiếm 90% dữ liệu gen toàn cầu, cho độ chính xác lên đến 99.9999%."
            />
            <FeatureListItem
              icon={ShieldCheck}
              title="Bảo mật tuyệt đối"
              description="Kết quả của bạn được bảo mật hoàn toàn, chỉ trả cho người đứng tên đăng ký hoặc người được ủy quyền."
            />
          </ul>
        </FeatureBlock>

        {/* Khối 2: Xét nghiệm trước sinh (Ảnh web-07.png) */}
        <FeatureBlock
          imageSrc="/images/ADN/Ảnh web-07.png"
          imageAlt="Xét nghiệm ADN trước sinh không xâm lấn"
          title="Xét nghiệm ADN trước sinh không xâm lấn"
          subtitle="Phát hiện huyết thống cha con từ khi là bào thai"
          reverse={true} // Đảo bố cục
        >
          <p className="mb-6 text-lg text-gray-600">
            Giải pháp an toàn tuyệt đối cho mẹ và bé, cho phép xác định quan hệ cha-con sớm mà không cần thủ thuật xâm lấn (như chọc ối), loại bỏ mọi rủi ro.
          </p>
          <ul className="space-y-4">
            <FeatureListItem
              icon={CheckCircle}
              title="An toàn tuyệt đối"
              description="Chỉ cần lấy mẫu máu mẹ từ tuần thai thứ 7, không ảnh hưởng đến thai nhi."
            />
            <FeatureListItem
              icon={Database}
              title="Công nghệ giải trình tự gen"
              description="Phân tích ADN tự do của thai nhi (cffDNA) có trong máu mẹ để đưa ra kết quả chính xác."
            />
          </ul>
        </FeatureBlock>

        {/* Khối 3: Uy tín & Pháp lý (Ảnh web-06.png) */}
        <FeatureBlock
          imageSrc="/images/ADN/Ảnh web-06.png"
          imageAlt="GennovaX được công nhận pháp lý"
          title="Nền tảng uy tín & Được công nhận pháp lý"
          subtitle="Kết quả được chấp thuận tại các cơ quan hành chính"
        >
          <p className="mb-6 text-lg text-gray-600">
            Với kinh nghiệm xử lý trên 120.000 trường hợp, kết quả của GennovaX có giá trị pháp lý cao, được tin dùng trong các thủ tục dân sự và hành chính.
          </p>
          <ul className="space-y-4">
            <FeatureListItem
              icon={FileText}
              title="Công nhận pháp lý"
              description="Được các cơ quan hành chính, Tư pháp, Tòa án chấp thuận trong các thủ tục làm giấy khai sinh, nhập tịch, định cư..."
            />
            <FeatureListItem
              icon={CheckCircle}
              title="Thành viên AFNS"
              description="Là thành viên Hiệp hội Khoa học Hình sự Châu Á (AFSN) - tổ chức khoa học pháp y quy mô nhất khu vực."
            />
          </ul>
        </FeatureBlock>

        {/* Khối 4: Mạng lưới (Ảnh web-08.png) */}
        <FeatureBlock
          imageSrc="/images/ADN/Ảnh web-08.png"
          imageAlt="Mạng lưới 68 điểm thu mẫu toàn quốc"
          title="Mạng lưới 68 điểm thu mẫu toàn quốc"
          subtitle="Thu mẫu nhanh chóng, tiện lợi mọi lúc mọi nơi"
          reverse={true} // Đảo bố cục
        >
          <p className="mb-6 text-lg text-gray-600">
            Hệ thống điểm thu mẫu của GennovaX trải dài khắp cả nước, cùng dịch vụ hỗ trợ thu mẫu tận nơi, giúp bạn tiết kiệm thời gian và chi phí đi lại.
          </p>
          <ul className="space-y-4">
            <FeatureListItem
              icon={MapPin}
              title="68 điểm lấy mẫu"
              description="Dễ dàng tìm thấy điểm thu mẫu GennovaX gần bạn nhất."
            />
            <FeatureListItem
              icon={CalendarDays}
              title="Dịch vụ tận nơi"
              description="Hỗ trợ thu mẫu tại nhà hoặc địa điểm bạn yêu cầu, đảm bảo riêng tư và tiện lợi."
            />
          </ul>
        </FeatureBlock>

      </div>

      {/* === 3. QUY TRÌNH (Ảnh web_Artboard 4 copy.png) === */}
      {/* Tôi đã bật lại phần này cho bạn */}
      {/* <ProcessSection /> */}

      {/* === 4. BẢNG GIÁ DỊCH VỤ (PHẦN ĐÃ SỬA LỖI) === */}
      <PricingTableSection />

    </section>
  );
}

// --- CÁC COMPONENT PHỤ ---

// 1. Hero Section
const HeroSection = () => (
  <div className="relative w-full overflow-hidden text-white" style={{ minHeight: '600px' }}>
    {/* Ảnh nền */}
    <img 
      src="/images/ADN/Ảnh web-11.png" 
      alt="Xét nghiệm ADN Huyết thống GennovaX"
      className="absolute inset-0 h-full w-full object-cover"
    />
    {/* Lớp phủ màu tối */}
    <div className="absolute inset-0 bg-blue-900/40"></div>
    
    {/* Nội dung */}
    <div className="container relative z-10 mx-auto flex h-full min-h-[600px] max-w-7xl flex-col justify-center px-4 py-20 text-left">
      <h1 className="text-5xl font-extrabold leading-tight md:text-7xl">
        Xét nghiệm
        <br />
        ADN Huyết Thống
      </h1>
      <div 
        className="my-6 w-24 h-1.5" 
        style={{ backgroundColor: '#0891B2' }} // Màu teal
      ></div>
      <p className="max-w-xl text-2xl font-light text-gray-100">
        Chính xác – Bảo mật – Hợp pháp
      </p>
      <p className="mt-4 max-w-xl text-lg text-gray-200">
        GennovaX cung cấp dịch vụ xét nghiệm ADN huyết thống chuẩn quốc tế, với trên 
        <span className="font-bold text-white"> 120.000 trường hợp</span> đã xác nhận 
        thân nhân qua ADN.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link 
          href="/contact" 
          className="rounded-full bg-cyan-500 px-8 py-3.5 text-base font-bold text-white shadow-lg transition duration-300 hover:bg-cyan-400"
        >
          Đặt hẹn tư vấn
        </Link>
        <Link 
          href="/services" 
          className="rounded-full bg-white/20 px-8 py-3.5 text-base font-bold text-white backdrop-blur-sm transition duration-300 hover:bg-white/30"
        >
          Xem bảng giá
        </Link>
      </div>
    </div>
  </div>
);

// 2. Component Khối Tính năng (So le)
interface FeatureBlockProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  reverse?: boolean;
}

const FeatureBlock: React.FC<FeatureBlockProps> = ({
  imageSrc,
  imageAlt,
  title,
  subtitle,
  children,
  reverse = false,
}) => (
  <div className="container mx-auto max-w-7xl px-4 py-16">
    <div 
      className={`flex flex-col items-center gap-12 md:gap-16 lg:gap-24 ${
        reverse ? 'md:flex-row-reverse' : 'md:flex-row'
      }`}
    >
      {/* Cột Ảnh */}
      <div className="w-full md:w-1/2">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-auto rounded-lg object-contain shadow-xl"
        />
      </div>
      
      {/* Cột Nội dung */}
      <div className="w-full md:w-1/2">
        <p 
          className="text-base font-bold uppercase tracking-wide" 
          style={{ color: '#0891B2' }} // Màu teal
        >
          {subtitle}
        </p>
        <h2 className="mt-2 text-4xl font-extrabold text-blue-900 md:text-5xl">
          {title}
        </h2>
        <div className="mt-8">
          {children}
        </div>
      </div>
    </div>
  </div>
);

// 3. Component Item trong danh sách tính năng (cho đẹp)
interface FeatureListItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureListItem: React.FC<FeatureListItemProps> = ({ 
  icon: Icon, 
  title, 
  description 
}) => (
  <li className="flex items-start">
    <div className="flex-shrink-0">
      <div 
        className="flex h-12 w-12 items-center justify-center rounded-full text-white"
        style={{ backgroundColor: '#0D47A1' }} // Màu xanh đậm
      >
        <Icon className="h-6 w-6" />
      </div>
    </div>
    <div className="ml-4">
      <h4 className="text-xl font-bold text-gray-900">{title}</h4>
      <p className="mt-1 text-base text-gray-600">{description}</p>
    </div>
  </li>
);

// 4. Component Quy trình
const ProcessSection = () => (
  <div className="w-full bg-white py-20 md:py-24">
    <div className="container mx-auto max-w-5xl px-4 text-center">
      <h2 className="text-4xl font-extrabold text-blue-900 md:text-5xl">
        Quy trình 3 bước đơn giản
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
        Nhanh chóng, riêng tư và bảo mật tuyệt đối tại GennovaX.
      </p>
      <div className="mt-16">
        <img
          src="/images/ADN/Ảnh web_Artboard 4 copy.png"
          alt="Quy trình 3 bước"
          className="w-full h-auto max-w-4xl mx-auto"
        />
      </div>
    </div>
  </div>
);

// 5. Component Bảng giá (ĐÃ SỬA LỖI)
const PricingTableSection = () => {
  const thStyle =
    "p-5 text-left text-sm font-bold uppercase tracking-wider border-2 border-blue-800";
  // Tách riêng tdStyle cho nội dung và các ô khác
  const tdStyle = "p-5 border-2 border-gray-200 align-top";
  const tdContentStyle = `${tdStyle} font-semibold text-center`; // Style cho cột nội dung phụ
  const tdTimeStyle = `${tdStyle} text-center text-base`;
  const tdPriceStyle = `${tdStyle} text-xl font-bold text-orange-600 text-right`;
  const tdSttStyle = `${tdStyle} text-center text-lg font-bold text-blue-900`;

  return (
    <div className="bg-gray-50 py-20 md:py-24 md:pt-0">
      <div className="container mx-auto max-w-7xl px-4">
        <h2 className="text-center text-4xl font-extrabold text-blue-900 md:text-5xl">
          Bảng giá dịch vụ ADN
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-gray-600">
          (Áp dụng từ ngày 01/11/2025 cho đến khi có thông báo mới)
        </p>

        <div className="mt-16 overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse rounded-lg shadow-xl overflow-hidden">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className={`${thStyle} w-[8%]`}>STT</th>
                <th className={`${thStyle} w-[47%]`}>Nội dung</th>
                <th className={`${thStyle} w-[20%] text-center`}>
                  Thời gian trả kết quả
                </th>
                <th className={`${thStyle} w-[25%] text-right`}>
                  Chi phí (VNĐ)
                </th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {/* --- Gói 1 (Code gốc đã đúng) --- */}
              <tr className="bg-white">
                <td className={`${tdSttStyle}`} rowSpan={2}>
                  1
                </td>
                <td className={`${tdStyle} font-bold text-lg`}>
                  Xét nghiệm ADN Cha-Con/Mẹ-Con (dân sự-tự nguyện)
                  <p className="text-sm font-normal text-gray-600">
                    (Áp dụng cho 2 mẫu)
                  </p>
                </td>
                <td className={`${tdTimeStyle}`}>1-2 ngày</td>
                <td className={`${tdPriceStyle}`}>2.500.000</td>
              </tr>
              <tr className="bg-blue-50">
                {/* 3 <td>: Nội dung (phụ), Thời gian, Chi phí */}
                <td className={`${tdStyle} italic text-center`}>
                  Kết quả nhanh trong 4 giờ
                </td>
                <td className={`${tdTimeStyle}`}>4 giờ</td>
                <td className={`${tdPriceStyle}`}>5.000.000</td>
              </tr>

              {/* --- Gói 2 (Code gốc đã đúng) --- */}
              <tr className="bg-white">
                <td className={`${tdSttStyle}`} rowSpan={2}>
                  2
                </td>
                <td className={`${tdStyle} font-bold text-lg`}>
                  Xét nghiệm ADN làm thủ tục Hành chính
                  <p className="text-sm font-normal text-gray-600">
                    (Làm giấy khai sinh, nhận cha con... 2 mẫu)
                  </p>
                </td>
                <td className={`${tdTimeStyle}`}>1-2 ngày</td>
                <td className={`${tdPriceStyle}`}>3.500.000</td>
              </tr>
              <tr className="bg-blue-50">
                {/* 3 <td>: Nội dung (phụ), Thời gian, Chi phí */}
                <td className={`${tdStyle} italic text-center`}>
                  Kết quả nhanh trong 4 giờ
                </td>
                <td className={`${tdTimeStyle}`}>4 giờ</td>
                <td className={`${tdPriceStyle}`}>6.000.000</td>
              </tr>

              {/* --- Gói 3 (SỬA LỖI) --- */}
              <tr className="bg-white">
                <td className={`${tdSttStyle}`} rowSpan={4}>
                  3
                </td>
                <td className={`${tdStyle} font-bold text-lg`}>
                  Xét nghiệm ADN làm thủ tục Pháp lý (có yếu tố nước ngoài)
                  <p className="text-sm font-normal text-gray-600">
                    (Nhập tịch, định cư, quốc tịch...)
                  </p>
                </td>
                {/* Hàng 1 của Gói 3 (3 <td> còn lại) */}
                {/* <td className={`${tdContentStyle} bg-gray-100`}>Dành cho 2 mẫu</td> */}
                <td className={`${tdTimeStyle} bg-gray-100`}>1-2 ngày</td>
                <td className={`${tdPriceStyle} bg-gray-100`}>4.500.000</td>
              </tr>
              <tr className="bg-blue-50">
                {/* Hàng 2 của Gói 3 (3 <td>) */}
                <td className={`${tdContentStyle}`}>Dành cho 2 mẫu</td>
                <td className={`${tdTimeStyle}`}>4 giờ</td>
                <td className={`${tdPriceStyle}`}>7.000.000</td>
              </tr>
              <tr className="bg-white">
                {/* Hàng 3 của Gói 3 (3 <td>) */}
                <td className={`${tdContentStyle} bg-gray-100`}>Dành cho 3 mẫu</td>
                <td className={`${tdTimeStyle} bg-gray-100`}>1-2 ngày</td>
                <td className={`${tdPriceStyle} bg-gray-100`}>5.500.000</td>
              </tr>
              <tr className="bg-blue-50">
                {/* Hàng 4 của Gói 3 (3 <td>) */}
                <td className={`${tdContentStyle}`}>Dành cho 3 mẫu</td>
                <td className={`${tdTimeStyle}`}>4 giờ</td>
                <td className={`${tdPriceStyle}`}>8.000.000</td>
              </tr>

              {/* --- Gói 4 --- */}
              <tr className="bg-white">
                <td className={`${tdSttStyle}`}>4</td>
                <td className={`${tdStyle} font-bold text-lg`}>
                  Xét nghiệm ADN theo NST Y
                  <p className="text-sm font-normal text-gray-600">
                    (Ông nội - Cháu trai; Anh em trai...)
                  </p>
                </td>
                <td className={`${tdTimeStyle}`}>1-2 ngày</td>
                <td className={`${tdPriceStyle}`}>4.000.000</td>
              </tr>

              {/* --- Gói 5 --- */}
              <tr className="bg-blue-50">
                <td className={`${tdSttStyle}`}>5</td>
                <td className={`${tdStyle} font-bold text-lg`}>
                  Xét nghiệm ADN theo NST X
                  <p className="text-sm font-normal text-gray-600">
                    (Bà nội - Cháu gái; Chị em gái cùng bố...)
                  </p>
                </td>
                <td className={`${tdTimeStyle}`}>1-3 ngày</td>
                <td className={`${tdPriceStyle}`}>4.500.000</td>
              </tr>

              {/* --- Gói 6 --- */}
              <tr className="bg-white">
                <td className={`${tdSttStyle}`}>6</td>
                <td className={`${tdStyle} font-bold text-lg`}>
                  Xác định huyết thống theo dòng Mẹ
                  <p className="text-sm font-normal text-gray-600">
                    (Anh trai - Em gái cùng mẹ, dì - cháu...)
                  </p>
                </td>
                <td className={`${tdTimeStyle}`}>3-5 ngày</td>
                <td className={`${tdPriceStyle}`}>5.000.000</td>
              </tr>

              {/* --- Gói 7 (SỬA LỖI) --- */}
              <tr className="bg-blue-50">
                <td className={`${tdSttStyle}`} rowSpan={3}>
                  7
                </td>
                <td className={`${tdStyle} font-bold text-lg`}>
                  Xét nghiệm ADN Cha-Con Trước Sinh (không xâm lấn, mẫu máu)
                  <p className="text-sm font-normal text-gray-600">
                    (01 mẫu bố giả định + 01 mẫu máu mẹ)
                  </p>
                </td>
                {/* Hàng 1 của Gói 7 (3 <td> còn lại) */}
                {/* <td className={`${tdStyle}`}></td> Cột nội dung phụ (trống) */}
                <td className={`${tdTimeStyle}`}>10 ngày làm việc</td>
                <td className={`${tdPriceStyle}`}>20.000.000</td>
              </tr>
              <tr className="bg-white">
                {/* Hàng 2 của Gói 7 (3 <td>) */}
                <td className={`${tdStyle}`}></td> {/* Cột nội dung phụ (trống) */}
                <td className={`${tdTimeStyle}`}>
                  3-5 ngày làm việc
                </td>
                <td className={`${tdPriceStyle}`}>25.000.000</td>
              </tr>
              <tr className="bg-blue-50">
                {/* Hàng 3 của Gói 7 (3 <td>) */}
                <td className={`${tdContentStyle}`}>
                  Thêm mẫu bố giả định thứ 2 trở đi
                </td>
                <td className={`${tdStyle}`}></td> {/* Cột thời gian (trống) */}
                <td className={`${tdPriceStyle}`}>+3.000.000</td>
              </tr>
            </tbody>

            {/* --- Lưu ý --- */}
            <tfoot>
              <tr className="bg-gray-100">
                <td colSpan={4} className="p-6">
                  <div className="flex items-start">
                    <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mr-3 mt-1" />
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">
                        Lưu ý quan trọng:
                      </h4>
                      <ul className="list-disc pl-5 mt-2 text-gray-600 space-y-1">
                        <li>
                          <strong>Phụ thu mẫu khó:</strong> +1.000.000đ/mẫu với
                          các mẫu đặc biệt (bàn chải, răng sữa, quần lót, tinh
                          dịch...).
                        </li>
                        <li>
                          <strong>Địa điểm áp dụng:</strong> Giá áp dụng cho
                          việc nhận mẫu tại Lab GennovaX.
                        </li>
                      </ul>
                    </div>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};