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
    { label: "CTV Xinh", value: "CTV Xinh", order: 1, isActive: true },
    { label: "BS Thoa", value: "BS Thoa", order: 2, isActive: true },
    { label: "PK Âu Cơ", value: "PK Âu Cơ", order: 3, isActive: true },
  ]);

  await upsertOption("salesOwners", [
    { label: "Luân", value: "Luân", order: 1, isActive: true },
    { label: "Phong", value: "Phong", order: 2, isActive: true },
  ]);

  await upsertOption("sampleCollectors", [
    { label: "CTV", value: "CTV", order: 1, isActive: true },
    { label: "BS/PK", value: "BS/PK", order: 2, isActive: true },
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

  // DOCTORS / AGENTS
  const doctors = await Doctor.countDocuments();
  if (doctors === 0) {
    await Doctor.create([
      { fullName: "CTV Xinh", agentLevel: "cap3", agentTierLabel: "Cấp 3" },
      { fullName: "BS Thoa", agentLevel: "cap2", agentTierLabel: "Cấp 2" },
      { fullName: "PK Âu Cơ", agentLevel: "cap1", agentTierLabel: "Cấp 1" },
    ]);
  }

  // SERVICES (ví dụ ADN theo bảng giá của bạn)
  const services = await Service.countDocuments();
  if (services === 0) {
    await Service.create([
      {
        serviceType: "ADN",
        serviceCode: "ADN TN",
        name: "ADN tự nguyện",
        turnaroundHours: 48,
        pricesByLevel: [
          { level: "cap3", price: 650000 },
          { level: "cap2", price: 600000 },
          { level: "cap1", price: 550000 },
        ],
      },
      {
        serviceType: "ADN",
        serviceCode: "ADN PL",
        name: "ADN HC, PL",
        turnaroundHours: 48,
        pricesByLevel: [
          { level: "cap3", price: 750000 },
          { level: "cap2", price: 700000 },
          { level: "cap1", price: 650000 },
        ],
      },
      {
        serviceType: "CELL",
        serviceCode: "HPV 23",
        name: "Combo HPV 23 - Cellprep",
        turnaroundHours: 72,
        pricesByLevel: [
          { level: "cap3", price: 550000 },
          { level: "cap2", price: 550000 },
          { level: "cap1", price: 550000 },
        ],
      },
      {
        serviceType: "NIPT",
        serviceCode: "NIPT 4",
        name: "NIPT 4",
        turnaroundHours: 96,
        pricesByLevel: [
          { level: "cap3", price: 2600000 },
          { level: "cap2", price: 2600000 },
          { level: "cap1", price: 2600000 },
        ],
      },
    ]);
  }

  console.log("✅ Seed done");
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
