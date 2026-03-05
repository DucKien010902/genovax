import cron from "node-cron";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import archiver from "archiver";
import fs from "fs";
import path from "path";

// 1. Cấu hình hòm thư gửi đi
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export function startAutoBackup() {
  console.log("⏳ Bật chế độ tự động Full Backup (ZIP) qua Email...");

  // 2. Lên lịch chạy (Ví dụ đang để 23:59 mỗi ngày: '59 23 * * *')
  // Trong lúc test bạn có thể đổi thành "* * * * *" để nó chạy mỗi phút
  cron.schedule("00 18 * * *", async () => {
    console.log("📦 Bắt đầu tiến trình trích xuất và nén dữ liệu...");
    
    // Đặt tên file zip theo ngày
    const dateStr = new Date().toISOString().split("T")[0];
    const zipFileName = `Gennovax_Backup_${dateStr}.zip`;
    // Lưu tạm file zip vào thư mục gốc của project
    const zipFilePath = path.join(process.cwd(), zipFileName);

    try {
      const db = mongoose.connection.db;
      if (!db) throw new Error("❌ Chưa kết nối được với MongoDB!");

      const collections = await db.listCollections().toArray();
      let totalDocs = 0;
      let totalCollections = 0;

      // --- TẠO TIẾN TRÌNH NÉN (ARCHIVER) ---
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver("zip", {
        zlib: { level: 9 } // Mức độ nén cao nhất (giảm dung lượng tối đa)
      });

      // Bọc tiến trình nén trong một Promise để chắc chắn nó nén xong mới gửi mail
      await new Promise(async (resolve, reject) => {
        // Lắng nghe sự kiện khi file zip đã được ghi xong ra ổ cứng
        output.on("close", resolve);
        archive.on("error", reject);

        // Bắt đầu bơm luồng dữ liệu vào file
        archive.pipe(output);

        // Duyệt qua từng bảng trong Database
        for (const colInfo of collections) {
          const colName = colInfo.name;
          if (colName.startsWith("system.")) continue; 

          const docs = await db.collection(colName).find({}).toArray();
          totalDocs += docs.length;
          totalCollections++;

          // Biến mảng thành chuỗi JSON
          const jsonStr = JSON.stringify(docs);
          
          // Đỉnh cao ở đây: Bơm thẳng chuỗi JSON vào máy nén, đặt tên thành file <colName>.json
          // Không hề tạo ra file .json thật trên ổ cứng!
          archive.append(jsonStr, { name: `${colName}.json` });
          
          console.log(`   👉 Đã nén bảng ${colName}.json (${docs.length} bản ghi)`);
        }

        // Báo cho archiver biết là đã hết dữ liệu, hãy đóng gói file zip lại
        await archive.finalize();
      });

      console.log(`✅ Nén thành công file: ${zipFileName}`);

      // --- SOẠN VÀ GỬI EMAIL ---
      const mailOptions = {
        from: `"Gennovax System" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_RECEIVER,
        subject: `[Auto Backup ZIP] Dữ liệu hệ thống ngày ${dateStr}`,
        text: `Hệ thống gửi tự động file sao lưu toàn bộ Database định dạng ZIP.\n\n` +
              `Thống kê:\n- Bảng dữ liệu: ${totalCollections}\n- Tổng số dòng: ${totalDocs}\n\n` +
              `Giải nén file đính kèm để xem chi tiết từng bảng.`,
        attachments: [
          {
            path: zipFilePath // Lấy file zip vật lý vừa tạo để đính kèm
          },
        ],
      };

      await transporter.sendMail(mailOptions);
      console.log(`✉️ Đã gửi Email kèm file Backup thành công!`);

      // --- DỌN DẸP ---
      // Gửi xong thì xóa ngay file .zip trên ổ cứng đi để VPS không bị rác
      fs.unlinkSync(zipFilePath);
      console.log(`🧹 Đã dọn dẹp file tạm trên hệ thống.\n`);

    } catch (error) {
      console.error("❌ Lỗi tiến trình Backup ZIP:", error);
      // Cố gắng dọn dẹp nếu có lỗi xảy ra giữa chừng
      if (fs.existsSync(zipFilePath)) {
        fs.unlinkSync(zipFilePath);
      }
    }
  });
}