import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./db.js";

dotenv.config();

async function addHistoryLog() {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Đang kết nối Database. Bắt đầu thêm lịch sử lưu vết...");

    const collection = mongoose.connection.collection("cases");
    const allCases = await collection.find({}).toArray();
    console.log(`Tìm thấy ${allCases.length} ca. Bắt đầu xử lý...`);

    const bulkOps = [];

    for (const doc of allCases) {
      // Xác định thời gian tạo ca (lấy trường date cũ, nếu không có thì lấy giờ hiện tại)
      const createdAt = doc.date || doc.createdAt || new Date();

      // Tạo object lịch sử đầu tiên
      const initialChange = {
        name: "Admin GennovaX",
        email: "superadmin@gmail.com",
        action: "Khởi tạo dữ liệu gốc",
        changedAt: createdAt
      };

      // Push lệnh update vào bulkOps
      bulkOps.push({
        updateOne: {
          filter: { _id: doc._id },
          update: { 
            // Dùng $set để tạo mảng changes nếu chưa có, chứa phần tử đầu tiên
            $set: { changes: [initialChange] } 
          }
        }
      });
    }

    if (bulkOps.length > 0) {
      console.log("Đang tiến hành ghi vào Database...");
      const result = await collection.bulkWrite(bulkOps);
      console.log(`✅ Hoàn tất! Đã thêm lịch sử cho ${result.modifiedCount} ca.`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi khi chạy script:", error);
    process.exit(1);
  }
}

addHistoryLog();