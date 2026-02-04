import dotenv from "dotenv";
import { connectDB } from "./db.js";
import Option from "./models/Option.model.js";
import Service from "./models/Service.model.js";
import Doctor from "./models/Doctor.model.js";

dotenv.config();

async function upsertOption(key, items) {
  await Option.updateOne(
    { key },
    { $set: { key, items } },
    { upsert: true }
  );
}

async function run() {
  await connectDB(process.env.MONGO_URI);

  // OPTIONS
  await upsertOption("labs", [
    { label: "Phagogen", value: "Phagogen", order: 1, isActive: true },
    { label: "GennoVax", value: "GennoVax", order: 2, isActive: true },
  ]);

  await upsertOption("sources", [
  { label: "QC", value: "QC", order: 1, isActive: true },
  { label: "NVKD", value: "NVKD", order: 2, isActive: true },
  { label: "BS Bằng", value: "BS Bằng", order: 3, isActive: true },
  { label: "PK ĐK Bắc Hà", value: "PK ĐK Bắc Hà", order: 4, isActive: true },
  { label: "CTV Sơn", value: "CTV Sơn", order: 5, isActive: true },
  { label: "BS Thoa", value: "BS Thoa", order: 6, isActive: true },
  { label: "CTV Lý", value: "CTV Lý", order: 7, isActive: true },
  { label: "PK Phong Dương", value: "PK Phong Dương", order: 8, isActive: true },
  { label: "CTV Xinh", value: "CTV Xinh", order: 9, isActive: true },
  { label: "CTV Mạnh", value: "CTV Mạnh", order: 10, isActive: true },
  { label: "CTV Vân", value: "CTV Vân", order: 11, isActive: true },
  { label: "Golab Quảng Bình", value: "Golab Quảng Bình", order: 12, isActive: true },
  { label: "CTV Tuyết", value: "CTV Tuyết", order: 13, isActive: true },
  { label: "Golab Hà Tĩnh", value: "Golab Hà Tĩnh", order: 14, isActive: true },
  { label: "CTV Ngoài", value: "CTV Ngoài", order: 15, isActive: true },
  { label: "CTV Huyền", value: "CTV Huyền", order: 16, isActive: true },
  { label: "Golab Nghệ An", value: "Golab Nghệ An", order: 17, isActive: true },
  { label: "PK BS Quang", value: "PK BS Quang", order: 18, isActive: true },
  { label: "PK Mỹ Lộc", value: "PK Mỹ Lộc", order: 19, isActive: true },
  { label: "Huyền - BVDK ngã 4 Hồ", value: "Huyền - BVDK ngã 4 Hồ", order: 20, isActive: true },
  { label: "PK Âu Cơ", value: "PK Âu Cơ", order: 21, isActive: true },
  { label: "BS Hậu - PK SPK Mẹ và Bé", value: "BS Hậu - PK SPK Mẹ và Bé", order: 22, isActive: true },
  { label: "PKĐK AGAPE", value: "PKĐK AGAPE", order: 23, isActive: true },
  { label: "Golab Thanh Hoá", value: "Golab Thanh Hoá", order: 24, isActive: true },
  { label: "Golab Hải Phòng", value: "Golab Hải Phòng", order: 25, isActive: true },
  { label: "PK SPK Minh Hòa", value: "PK SPK Minh Hòa", order: 26, isActive: true },
  { label: "CTV Tú - Vũng Tàu", value: "CTV Tú - Vũng Tàu", order: 27, isActive: true },
  { label: "CTV Thảo", value: "CTV Thảo", order: 28, isActive: true },
]);


  await upsertOption("salesOwners", [
  { label: "Liêm", value: "Liêm", order: 1, isActive: true },
  { label: "Luận", value: "Luận", order: 2, isActive: true },
  { label: "Nam", value: "Nam", order: 3, isActive: true },
  { label: "NVKD phụ trách", value: "NVKD phụ trách", order: 4, isActive: true },
  { label: "Phong", value: "Phong", order: 5, isActive: true },
  { label: "Thảo", value: "Thảo", order: 6, isActive: true },
]);


  await upsertOption("sampleCollectors", [
  { label: "Phong", value: "Phong", order: 1, isActive: true },
  { label: "GL", value: "GL", order: 2, isActive: true },
  { label: "KH gửi", value: "KH gửi", order: 3, isActive: true },
  { label: "CTV", value: "CTV", order: 4, isActive: true },
  { label: "BS/PK", value: "BS/PK", order: 5, isActive: true },
  { label: "GH", value: "GH", order: 6, isActive: true },
]);


  await upsertOption("transferStatus", [
    { label: "Chưa chuyển", value: "Chưa chuyển", order: 1, isActive: true },
    { label: "Đã chuyển", value: "Đã chuyển", order: 2, isActive: true },
  ]);

  await upsertOption("receiveStatus", [
    { label: "Chưa nhận", value: "Chưa nhận", order: 1, isActive: true },
    { label: "Đã nhận", value: "Đã nhận", order: 2, isActive: true },
  ]);

  await upsertOption("processStatus", [
    { label: "Chưa xử lý", value: "Chưa xử lý", order: 1, isActive: true },
    { label: "Đã có KQ", value: "Đã có KQ", order: 2, isActive: true },
  ]);

  await upsertOption("feedbackStatus", [
    { label: "Chưa phản hồi", value: "Chưa phản hồi", order: 1, isActive: true },
    { label: "Đã phản hồi", value: "Đã phản hồi", order: 2, isActive: true },
  ]);
  await upsertOption("agentLevels", [
  { label: "Cấp 1", value: "cap1", order: 1, isActive: true },
  { label: "Cấp 2", value: "cap2", order: 2, isActive: true },
  { label: "Cấp 3", value: "cap3", order: 3, isActive: true },
  { label: "CTV", value: "ctv", order: 4, isActive: true },
]);


  // DOCTORS / AGENTS
  const doctors = await Doctor.countDocuments();
  async function upsertDoctor(fullName, agentLevel) {
  const label =
    agentLevel === "cap1"
      ? "Cấp 1"
      : agentLevel === "cap2"
      ? "Cấp 2"
      : agentLevel === "cap3"
      ? "Cấp 3"
      : agentLevel === "ctv"
      ? "CTV"
      : "";

  await Doctor.updateOne(
    { fullName },
    {
      $set: {
        fullName,
        agentLevel,
        agentTierLabel: label,
        isActive: true,
      },
    },
    { upsert: true }
  );
}
// DOCTORS / AGENTS (Nguồn -> cấp)
await upsertDoctor("CTV Xinh", "cap2");
await upsertDoctor("PK Âu Cơ", "ctv");
await upsertDoctor("CTV Huyền", "cap1");
await upsertDoctor("Huyền - BVDK ngã 4 Hồ", "cap1");
await upsertDoctor("PKĐK AGAPE", "cap2");
await upsertDoctor("BS Thoa", "ctv");
await upsertDoctor("BS Hậu - PK SPK Mẹ và Bé", "ctv");

await upsertDoctor("Golab Hải Phòng", "cap3");
await upsertDoctor("PK Mỹ Lộc", "cap3");
await upsertDoctor("CTV Lý", "cap3");

await upsertDoctor("Golab Quảng Bình", "cap2");
await upsertDoctor("CTV Tú - Vũng Tàu", "cap2");
await upsertDoctor("Golab Thanh Hoá", "cap1");
await upsertDoctor("Golab Hà Tĩnh", "cap2");
await upsertDoctor("CTV Thảo", "cap1");

  async function upsertService(s) {
  await Service.updateOne(
    { serviceCode: s.serviceCode },
    { $set: s },
    { upsert: true }
  );
}
  // SERVICES (ví dụ ADN theo bảng giá của bạn)
  for (const s of [
  // ===== ADN =====
  {
    serviceType: "ADN",
    serviceCode: "ADN TN",
    name: "ADN tự nguyện",
    turnaroundHours: 48, // 1-2 ngày
    pricesByLevel: [
      { level: "cap3", price: 650000 },
      { level: "cap2", price: 600000 },
      { level: "cap1", price: 550000 },
    ],
    isActive: true,
  },
  {
    serviceType: "ADN",
    serviceCode: "ADN TN 4H",
    name: "ADN tự nguyện (4h)",
    turnaroundHours: 4,
    pricesByLevel: [
      { level: "cap3", price: 1300000 },
      { level: "cap2", price: 1200000 },
      { level: "cap1", price: 1100000 },
    ],
    isActive: true,
  },
  {
    serviceType: "ADN",
    serviceCode: "ADN PL",
    name: "ADN HC, PL",
    turnaroundHours: 48, // 1-2 ngày
    pricesByLevel: [
      { level: "cap3", price: 750000 },
      { level: "cap2", price: 700000 },
      { level: "cap1", price: 650000 },
    ],
    isActive: true,
  },
  {
    serviceType: "ADN",
    serviceCode: "ADN PL 4H",
    name: "ADN HC, PL (4h)",
    turnaroundHours: 4,
    pricesByLevel: [
      { level: "cap3", price: 1500000 },
      { level: "cap2", price: 1400000 },
      { level: "cap1", price: 1300000 },
    ],
    isActive: true,
  },
  {
    serviceType: "ADN",
    serviceCode: "ADN F",
    name: "ADN PL có YTNN",
    turnaroundHours: 48, // 1-2 ngày
    pricesByLevel: [
      { level: "cap3", price: 1450000 },
      { level: "cap2", price: 1400000 },
      { level: "cap1", price: 1300000 },
    ],
    isActive: true,
  },
  {
    serviceType: "ADN",
    serviceCode: "ADN F 4H",
    name: "ADN PL có YTNN (4h)",
    turnaroundHours: 4,
    pricesByLevel: [
      { level: "cap3", price: 1600000 },
      { level: "cap2", price: 1500000 },
      { level: "cap1", price: 1400000 },
    ],
    isActive: true,
  },
  {
    serviceType: "ADN",
    serviceCode: "ADN F3",
    name: "ADN PL có YTNN (3 người) (n>=3, lấy 1,3tr x n)",
    turnaroundHours: 48, // 1-2 ngày
    pricesByLevel: [
      { level: "cap3", price: 1150000 },
      { level: "cap2", price: 1100000 },
      { level: "cap1", price: 1000000 },
    ],
    isActive: true,
  },
  {
    serviceType: "ADN",
    serviceCode: "ADN F3 4H",
    name: "ADN PL có YTNN (3 người) (4h) (n>=3, lấy 1,3tr x n)",
    turnaroundHours: 4,
    pricesByLevel: [
      { level: "cap3", price: 1500000 },
      { level: "cap2", price: 1400000 },
      { level: "cap1", price: 1300000 },
    ],
    isActive: true,
  },
  {
    serviceType: "ADN",
    serviceCode: "ADN Y",
    name: "ADN theo NST Y",
    turnaroundHours: 48, // 1-2 ngày
    pricesByLevel: [
      { level: "cap3", price: 1050000 },
      { level: "cap2", price: 1000000 },
      { level: "cap1", price: 950000 },
    ],
    isActive: true,
  },
  {
    serviceType: "ADN",
    serviceCode: "ADN X",
    name: "ADN theo NST X",
    turnaroundHours: 72, // 1-3 ngày
    pricesByLevel: [
      { level: "cap3", price: 1200000 },
      { level: "cap2", price: 1150000 },
      { level: "cap1", price: 1100000 },
    ],
    isActive: true,
  },
  {
    serviceType: "ADN",
    serviceCode: "ADN TT",
    name: "ADN theo dòng mẹ (ty thế)",
    turnaroundHours: 120, // 3-5 ngày
    pricesByLevel: [
      { level: "cap3", price: 1150000 },
      { level: "cap2", price: 1100000 },
      { level: "cap1", price: 1000000 },
    ],
    isActive: true,
  },
  {
    serviceType: "ADN",
    serviceCode: "KXL THUONG",
    name: "ADN trước sinh KXL (thường)",
    turnaroundHours: 240, // 7-10 ngày
    pricesByLevel: [
      { level: "cap3", price: 14000000 },
      { level: "cap2", price: 13500000 },
      { level: "cap1", price: 13000000 },
    ],
    isActive: true,
  },
  {
    serviceType: "ADN",
    serviceCode: "KXL NHANH",
    name: "ADN trước sinh KXL (nhanh)",
    turnaroundHours: 120, // 3-5 ngày
    pricesByLevel: [
      { level: "cap3", price: 15500000 },
      { level: "cap2", price: 15000000 },
      { level: "cap1", price: 14000000 },
    ],
    isActive: true,
  },
  {
    serviceType: "ADN",
    serviceCode: "KXL BO THU3",
    name: "ADN trước sinh KXL thêm mẫu bố thứ 3",
    turnaroundHours: 0, // ảnh không ghi thời gian, để 0 hoặc bạn set theo quy định
    pricesByLevel: [
      { level: "cap3", price: 3000000 },
      { level: "cap2", price: 3000000 },
      { level: "cap1", price: 3000000 },
    ],
    isActive: true,
  },

  // ===== NIPT =====
  {
    serviceType: "NIPT",
    serviceCode: "N3",
    name: "Geni Eco",
    turnaroundHours: 120, // 3-5 ngày
    pricesByLevel: [
      { level: "cap3", price: 1000000 },
      { level: "cap2", price: 950000 },
      { level: "cap1", price: 900000 },
    ],
    isActive: true,
  },
  {
    serviceType: "NIPT",
    serviceCode: "N4",
    name: "Geni 4",
    turnaroundHours: 120,
    pricesByLevel: [
      { level: "cap3", price: 1250000 },
      { level: "cap2", price: 1200000 },
      { level: "cap1", price: 1150000 },
    ],
    isActive: true,
  },
  {
    serviceType: "NIPT",
    serviceCode: "N8",
    name: "Geni 8",
    turnaroundHours: 120,
    pricesByLevel: [
      { level: "cap3", price: 1350000 },
      { level: "cap2", price: 1300000 },
      { level: "cap1", price: 1250000 },
    ],
    isActive: true,
  },
  {
    serviceType: "NIPT",
    serviceCode: "N8+GL",
    name: "Geni 8 + 21 Bệnh Gen Lặn",
    turnaroundHours: 120,
    pricesByLevel: [
      { level: "cap3", price: 1650000 },
      { level: "cap2", price: 1600000 },
      { level: "cap1", price: 1550000 },
    ],
    isActive: true,
  },
  {
    serviceType: "NIPT",
    serviceCode: "N23",
    name: "Geni 23",
    turnaroundHours: 120,
    pricesByLevel: [
      { level: "cap3", price: 2250000 },
      { level: "cap2", price: 2200000 },
      { level: "cap1", price: 2150000 },
    ],
    isActive: true,
  },
  {
    serviceType: "NIPT",
    serviceCode: "N23+GL",
    name: "Geni 23 + 21 bệnh Gen lặn",
    turnaroundHours: 120,
    pricesByLevel: [
      { level: "cap3", price: 2550000 },
      { level: "cap2", price: 2500000 },
      { level: "cap1", price: 2450000 },
    ],
    isActive: true,
  },
  {
    serviceType: "NIPT",
    serviceCode: "NGT",
    name: "Geni Twins",
    turnaroundHours: 120,
    pricesByLevel: [
      { level: "cap3", price: 2250000 },
      { level: "cap2", price: 2200000 },
      { level: "cap1", price: 2150000 },
    ],
    isActive: true,
  },
  {
    serviceType: "NIPT",
    serviceCode: "NGT+GL",
    name: "Geni Twins + 21 bệnh Gen lặn",
    turnaroundHours: 120,
    pricesByLevel: [
      { level: "cap3", price: 2550000 },
      { level: "cap2", price: 2500000 },
      { level: "cap1", price: 2450000 },
    ],
    isActive: true,
  },
  {
    serviceType: "NIPT",
    serviceCode: "NPL",
    name: "Geni Diamond",
    turnaroundHours: 120,
    pricesByLevel: [
      { level: "cap3", price: 3250000 },
      { level: "cap2", price: 3200000 },
      { level: "cap1", price: 3100000 },
    ],
    isActive: true,
  },
  {
    serviceType: "NIPT",
    serviceCode: "NPL+GL",
    name: "Geni Diamond + 21 bệnh Gen lặn",
    turnaroundHours: 120,
    pricesByLevel: [
      { level: "cap3", price: 3800000 },
      { level: "cap2", price: 3700000 },
      { level: "cap1", price: 3650000 },
    ],
    isActive: true,
  },
  {
    serviceType: "NIPT",
    serviceCode: "GL21",
    name: "21 bệnh Gen lặn",
    turnaroundHours: 168, // 5-7 ngày
    pricesByLevel: [
      { level: "cap3", price: 1450000 },
      { level: "cap2", price: 1400000 },
      { level: "cap1", price: 1350000 },
    ],
    isActive: true,
  },

  // ===== HPV =====
  {
    serviceType: "HPV",
    serviceCode: "HPV40",
    name: "Sàng lọc ung thư cổ tử cung HPV",
    turnaroundHours: 48, // 1-2 ngày
    pricesByLevel: [
      { level: "cap3", price: 430000 },
      { level: "cap2", price: 420000 },
      { level: "cap1", price: 410000 },
    ],
    isActive: true,
  },
  {
    serviceType: "HPV",
    serviceCode: "HPV23",
    name: "Sàng lọc ung thư cổ tử cung HPV",
    turnaroundHours: 48, // 1-2 ngày
    pricesByLevel: [
      { level: "cap3", price: 250000 },
      { level: "cap2", price: 240000 },
      { level: "cap1", price: 230000 },
    ],
    isActive: true,
  },

  // ===== TA (Ảnh chỉ có giá GX; không có giá theo cấp đại lý) =====
  // Nếu bạn xác nhận "1.600.000 áp dụng mọi cấp" thì mình thêm vào ngay.
  // ===== STD (không có giá trong ảnh) =====
]) {
  await upsertService(s);
}

  console.log("✅ Seed done");
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
