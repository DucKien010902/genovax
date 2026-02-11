import dotenv from "dotenv";
import { connectDB } from "./db.js";
import Service from "./models/Service.model.js";

dotenv.config();

/**
 * Map: serviceCode -> GX price (cột "Giá GX")
 * Lưu ý: serviceCode phải đúng với dữ liệu đang có trong DB.
 */
const GX_PRICE_BY_CODE = {
  // ===== ADN =====
  "ADN TN": 700000,
  "ADN TN 4H": 1400000,
  "ADN PL": 800000,
  "ADN PL 4H": 1600000,
  "ADN F": 1500000,
  "ADN F 4H": 1800000,
  "ADN F3": 1200000,
  "ADN F3 4H": 1600000,
  "ADN Y": 1100000,
  "ADN X": 1300000,
  "ADN TT": 1200000,
  "KXL THUONG": 14500000,
  "KXL NHANH": 16000000,
  "KXL BO THU3": 3000000,

  // ===== NIPT =====
  "N3": 1150000,      // Geni Eco
  "N4": 1400000,      // Geni 4
  "N8": 1800000,      // Geni 8
  "N8+GL": 2200000,   // Geni 8 + 21 Bệnh Gen Lặn
  "N23": 2500000,     // Geni 23
  "N23+GL": 3200000,  // Geni 23 + 21 bệnh Gen lặn
  "NGT": 2500000,     // Geni Twins
  "NGT+GL": 3200000,  // Geni Twins + 21 bệnh Gen lặn
  "NPL": 4000000,     // Geni Diamond
  "NPL+GL": 4500000,  // Geni Diamond + 21 bệnh Gen lặn
  "GL21": 2000000,    // 21 bệnh Gen lặn

  // ===== HPV =====
  "HPV40": 450000,
  "HPV23": 280000,

  // ===== TA (nếu trong DB có serviceCode "TA") =====

  // ===== STD: ảnh không có giá => không set =====
};

function hasCtvPrice(pricesByLevel = []) {
  return pricesByLevel.some((p) => p?.level === "ctv");
}

async function run() {
  await connectDB(process.env.MONGO_URI);

  const services = await Service.find({}, { serviceCode: 1, pricesByLevel: 1 }).lean();

  let updated = 0;
  let skippedNoGX = 0;
  let skippedHasCTV = 0;

  for (const s of services) {
    const code = s.serviceCode;
    const gx = GX_PRICE_BY_CODE[code];

    if (!gx) {
      skippedNoGX++;
      console.log(`⚠️  Skip (không có GX mapping): ${code}`);
      continue;
    }

    if (hasCtvPrice(s.pricesByLevel)) {
      skippedHasCTV++;
      console.log(`↩️  Skip (đã có ctv): ${code}`);
      continue;
    }

    const next = [...(s.pricesByLevel || []), { level: "ctv", price: gx }];

    await Service.updateOne(
      { serviceCode: code },
      { $set: { pricesByLevel: next } }
    );

    updated++;
    console.log(`✅ Added ctv=${gx.toLocaleString("vi-VN")} for ${code}`);
  }

  console.log("---- DONE ----");
  console.log({ updated, skippedHasCTV, skippedNoGX });

  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
