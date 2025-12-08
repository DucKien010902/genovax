import { PackageDetails } from "@/types/service";
export const ServicesData: PackageDetails[] = [
  // === NIPT ===
  {
    id: "geni-eco",
    name: "Sàng lọc trước sinh không xâm lấn Geni Eco",
    description:
      "Phát hiện lệch bội 3 cặp nhiễm sắc thể thường: 13, 18, 21 liên quan đến 3 hội chứng di truyền: Patau, Edwards, Down.",
    targetAudience: "Thai đơn từ 9 tuần",
    returnTime: "3-5 ngày làm việc",
    price: 1500000,
    category: "NIPT",
  },
  {
    id: "geni-4",
    name: "Sàng lọc trước sinh không xâm lấn Geni 4",
    description:
      "Phát hiện lệch bội 3 cặp NST (13, 18, 21) và lệch bội NST giới tính (Hội chứng Turner (XO)).",
    targetAudience: "Thai đơn từ 9 tuần",
    returnTime: "3-5 ngày làm việc",
    price: 2200000,
    category: "NIPT",
  },
  {
    id: "geni-8",
    name: "Sàng lọc trước sinh không xâm lấn Geni 8",
    description:
      "Phát hiện lệch bội 3 cặp NST (13, 18, 21) và 5 hội chứng NST giới tính (Turner, Tam nhiễm X, Klinefelter, Jacobs, XXXY).",
    targetAudience: "Thai đơn từ 9 tuần",
    returnTime: "3-5 ngày làm việc",
    price: 3000000,
    options: [{ name: "Làm thêm 21 Bệnh gen lặn cho mẹ", price: 3500000 }],
    category: "NIPT",
  },
  {
    id: "geni-23",
    name: "Sàng lọc trước sinh không xâm lấn Geni 23",
    description:
      "Phát hiện lệch bội toàn bộ 22 cặp NST thường và 5 hội chứng NST giới tính.",
    targetAudience: "Thai đơn từ 9 tuần",
    returnTime: "3-5 ngày làm việc",
    price: 4800000,
    options: [{ name: "Làm thêm 21 Bệnh gen lặn cho mẹ", price: 5300000 }],
    category: "NIPT",
  },
  {
    id: "geni-twins",
    name: "Sàng lọc trước sinh không xâm lấn Geni Twins",
    description:
      "Phát hiện lệch bội toàn bộ 22 cặp nhiễm sắc thể thường (ngoài cặp nhiễm sắc thể giới tính).",
    targetAudience: "Thai đôi từ 9 tuần (nên thu mẫu từ 12 tuần)",
    returnTime: "3-5 ngày làm việc",
    price: 4500000,
    options: [{ name: "Làm thêm 21 Bệnh gen lặn cho mẹ", price: 5000000 }],
    category: "NIPT",
  },
  {
    id: "geni-diamond",
    name: "Sàng lọc trước sinh không xâm lấn Geni Diamond",
    description:
      "Phát hiện lệch bội toàn bộ 22 cặp NST thường, 5 hội chứng NST giới tính và 122 hội chứng do mất đoạn/ lặp đoạn nhiễm sắc thể.",
    targetAudience: "Thai đơn từ 9 tuần",
    returnTime: "3-5 ngày làm việc",
    price: 6500000,
    options: [{ name: "Làm thêm 21 Bệnh gen lặn cho mẹ", price: 7000000 }],
    category: "NIPT",
  },
  // === GENE ===
  {
    id: "gene-lan-21",
    name: "Xét nghiệm người lành mang gen lặn gây bệnh 21 gen",
    description:
      "Sàng lọc 21 gen lặn phổ biến, giúp đánh giá nguy cơ di truyền cho con cái.",
    returnTime: "5-7 ngày làm việc",
    price: 2500000,
    category: "GENE",
  },
  {
    id: "gene-lan-chong",
    name: "Xét nghiệm gen lặn (Làm cho chồng)",
    description:
      "Áp dụng khi thai phụ xét nghiệm NIPT Dương Tính với 1 trong 21 gen lặn. Dùng để xét nghiệm cho chồng.",
    returnTime: "5-7 ngày làm việc",
    price: 900000,
    category: "GENE",
  },
  // === HPV ===
  {
    id: "hpv-23",
    name: "Xét nghiệm định type HPV nguy cơ cao (23 type)",
    description:
      "Định type cho 12 types HPV nguy cơ cao (16, 18, 31, 33,...) và 11 types HPV khác (6, 11, 42,...).",
    returnTime: "5-7 ngày làm việc",
    price: 500000,
    category: "HPV",
  },
  {
    id: "hpv-40",
    name: "Xét nghiệm định type HPV nguy cơ cao (40 type)",
    description:
      "Định type cho 20 type HPV nguy cơ cao, 2 type nguy cơ thấp (6, 11) và phát hiện 18 type HPV khác.",
    returnTime: "5-7 ngày làm việc",
    price: 700000,
    category: "HPV",
  },

  // === ADN (DỮ LIỆU MỚI THÊM) ===
  {
    id: "adn-dan-su-1-2ngay",
    name: "Xét nghiệm ADN Cha-Con/Mẹ-Con (Dân sự)",
    description:
      "Xét nghiệm tự nguyện xác định quan hệ cha-con hoặc mẹ-con. (Áp dụng cho 2 mẫu)",
    returnTime: "1-2 ngày",
    price: 2500000,
    category: "ADN",
  },
  {
    id: "adn-dan-su-4h",
    name: "Xét nghiệm ADN Cha-Con/Mẹ-Con (Dân sự - Nhanh)",
    description:
      "Xét nghiệm tự nguyện xác định quan hệ cha-con hoặc mẹ-con. (Áp dụng cho 2 mẫu)",
    returnTime: "04 giờ",
    price: 5000000,
    category: "ADN",
  },
  {
    id: "adn-hanh-chinh-1-2ngay",
    name: "Xét nghiệm ADN (Hành chính)",
    description:
      "Làm giấy khai sinh, nhận cha cho con, nhận con ngoài giá thú. (Áp dụng cho 2 mẫu)",
    returnTime: "1-2 ngày",
    price: 3500000,
    category: "ADN",
  },
  {
    id: "adn-hanh-chinh-4h",
    name: "Xét nghiệm ADN (Hành chính - Nhanh)",
    description:
      "Làm giấy khai sinh, nhận cha cho con, nhận con ngoài giá thú. (Áp dụng cho 2 mẫu)",
    returnTime: "04 giờ",
    price: 6000000,
    category: "ADN",
  },
  {
    id: "adn-phap-ly-2-mau-1-2ngay",
    name: "Xét nghiệm ADN (Pháp lý - 2 mẫu)",
    description:
      "Phục vụ thủ tục pháp lý: nhập tịch, định cư nước ngoài... (Dành cho 2 mẫu/1 kết quả)",
    returnTime: "1-2 ngày",
    price: 4500000,
    category: "ADN",
  },
  {
    id: "adn-phap-ly-2-mau-4h",
    name: "Xét nghiệm ADN (Pháp lý - 2 mẫu - Nhanh)",
    description:
      "Phục vụ thủ tục pháp lý: nhập tịch, định cư nước ngoài... (Dành cho 2 mẫu/1 kết quả)",
    returnTime: "04 giờ",
    price: 7000000,
    category: "ADN",
  },
  {
    id: "adn-phap-ly-3-mau-1-2ngay",
    name: "Xét nghiệm ADN (Pháp lý - 3 mẫu)",
    description:
      "Phục vụ thủ tục pháp lý: nhập tịch, định cư nước ngoài... (Dành cho 3 mẫu/1 kết quả)",
    returnTime: "1-2 ngày",
    price: 5500000,
    category: "ADN",
  },
  {
    id: "adn-phap-ly-3-mau-4h",
    name: "Xét nghiệm ADN (Pháp lý - 3 mẫu - Nhanh)",
    description:
      "Phục vụ thủ tục pháp lý: nhập tịch, định cư nước ngoài... (Dành cho 3 mẫu/1 kết quả)",
    returnTime: "04 giờ",
    price: 8000000,
    category: "ADN",
  },
  {
    id: "adn-nst-y",
    name: "Xét nghiệm ADN theo NST Y",
    description:
      "Ông Nội-Cháu trai; Chú/Bác ruột-Cháu trai; Anh em trai cùng dòng họ nội.",
    returnTime: "1-2 ngày",
    price: 4000000,
    category: "ADN",
  },
  {
    id: "adn-nst-x",
    name: "Xét nghiệm ADN theo NST X",
    description:
      "Bà Nội-Cháu Gái; Chị Em gái cùng bố; chị em gái cùng bố và cùng mẹ.",
    returnTime: "1-3 ngày",
    price: 4500000,
    category: "ADN",
  },
  {
    id: "adn-dong-me",
    name: "Xác định quan hệ huyết thống theo dòng Mẹ",
    description:
      "Anh trai-em gái cùng Mẹ, dì cháu, cậu cháu (xét nghiệm ADN ti thể).",
    returnTime: "3-5 ngày",
    price: 5000000,
    category: "ADN",
  },
  {
    id: "adn-truoc-sinh-10ngay",
    name: "Xét nghiệm ADN Cha Con Trước Sinh (Không xâm lấn)",
    description: "Sử dụng 01 mẫu bố giả định và 01 mẫu máu mẹ.",
    targetAudience: "Thai từ 10 tuần",
    returnTime: "10 ngày làm việc",
    price: 20000000,
    options: [{ name: "Thêm mẫu bố giả định thứ 2 trở đi", price: 3000000 }],
    category: "ADN",
  },
  {
    id: "adn-truoc-sinh-3-5ngay",
    name: "Xét nghiệm ADN Cha Con Trước Sinh (Không xâm lấn - Nhanh)",
    description: "Sử dụng 01 mẫu bố giả định và 01 mẫu máu mẹ.",
    targetAudience: "Thai từ 10 tuần",
    returnTime: "3-5 ngày làm việc",
    price: 25000000,
    options: [{ name: "Thêm mẫu bố giả định thứ 2 trở đi", price: 3000000 }],
    category: "ADN",
  },
  {
    id: "adn-phu-thu-mau-kho",
    name: "Phụ thu xét nghiệm ADN mẫu khó",
    description:
      "Phụ thu áp dụng cho các mẫu đặc biệt như: bàn chải đánh răng, răng sữa, quần lót, tinh dịch...",
    targetAudience: "Phụ thu / 1 mẫu",
    returnTime: "Cộng thêm thời gian xử lý mẫu",
    price: 1000000,
    category: "ADN",
  },
];
