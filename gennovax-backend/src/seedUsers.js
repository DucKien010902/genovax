import dotenv from "dotenv";

import mongoose from "mongoose";

import { connectDB } from "./db.js";

import Case from "./models/Case.model.js"; // Đường dẫn tới file model Case của bạn



dotenv.config();



async function migrateData() {

  try {

    // 1. Kết nối DB

    await connectDB(process.env.MONGO_URI);

    console.log("Đang kết nối Database. Bắt đầu chuẩn hóa dữ liệu...");



    // 2. Truy cập trực tiếp vào collection 'cases' (hoặc 'customers' tuỳ database của bạn)

    // Dùng cách này để lấy được cả những trường tiếng Việt không có trong Schema

    const collection = mongoose.connection.collection("cases"); 

    

    // Lấy toàn bộ dữ liệu hiện có

    const allCases = await collection.find({}).toArray();

    console.log(`Tìm thấy ${allCases.length} ca. Bắt đầu xử lý...`);



    const bulkOps = []; // Dùng bulkWrite để update hàng loạt cực nhanh



    for (const doc of allCases) {

      // --- CÁC HÀM HỖ TRỢ ÉP KIỂU (HELPER FUNCTIONS) ---

      

      // Hàm kiểm tra Boolean (có chữ X, Có, True, 1 -> trả về true)

      const isTrue = (val) => {

        if (!val) return false;

        const str = String(val).trim().toLowerCase();

        return ["x", "có", "co", "true", "1"].includes(str);

      };



      // Hàm ép kiểu Số (nếu lỗi thì về 0)

      const parseNum = (val) => {

        const num = Number(val);

        return isNaN(num) ? 0 : num;

      };



      // Hàm ép kiểu Ngày tháng (nếu lỗi trả về null)

      const parseDate = (val) => {

        if (!val) return null;

        const d = new Date(val);

        return isNaN(d.getTime()) ? null : d;

      };



      // Xử lý logic Enum cho serviceType (NIPT, ADN, CELL)

      let sType = "NIPT"; // Mặc định

      const rawService = String(doc["Dịch vụ"] || "").toUpperCase();

      if (rawService.includes("ADN")) sType = "ADN";

      else if (rawService.includes("CELL")) sType = "CELL";



      // --- TẠO LỆNH UPDATE CHO TỪNG DOCUMENT ---

      const updateDoc = {

        $set: {

          stt: parseNum(doc["STT"]),

          date: parseDate(doc["Ngày"]) || new Date(),

          

          invoiceRequested: isTrue(doc["Xuất Hóa đơn"]),

          caseCode: String(doc["Mã ca"] || ""),

          patientName: String(doc["Họ và tên"] || ""),

          

          lab: String(doc["Lab"] || ""),

          serviceType: String(doc["Dịch vụ "] || ""),

          serviceName: String(doc["Mã hàng"] || ""),

          serviceCode: String(doc["Mã hàng"] || ""),

          detailNote: String(doc["Thông tin chi tiết thêm"] || ""),

          

          source: String(doc["Nguồn"] || ""),

          salesOwner: String(doc["NVKD phụ trách"] || ""),

          sampleCollector: String(doc["Thu mẫu"] || ""),

          

          sentAt: parseDate(doc["Ngày gửi mẫu"]),

          receivedAt: parseDate(doc["Ngày nhận mẫu"] || doc["Tiếp nhận mẫu"]), // Tùy bạn đang dùng cột nào cho Ngày nhận

          dueDate: parseDate(doc["Ngày trả kết quả"]),

          

          agentLevel: String(doc["Cấp đại lý"] || ""),

          price: 0,

          collectedAmount: parseNum(doc["Tiền thu"]),

          costPrice: 0,

          

          paid: isTrue(doc["Đã thanh toán"]),

          transferStatus: String(doc["Mẫu chuyển lab"] || ""),

          receiveStatus: String(doc["Tiếp nhận mẫu"] || ""),

          processStatus: String(doc["Xử lý mẫu"] || ""),

          feedbackStatus: String(doc["Phản hồi"] || ""),

          

          glReturned: isTrue(doc["GL trả"]),

          gxReceived: isTrue(doc["GX nhận"]),

          softFileDone: isTrue(doc["Trả file mềm"]),

          hardFileDone: isTrue(doc["Trả file cứng"]),

          

          invoiceInfo: String(doc["Thông tin xuất hóa đơn"] || ""),

          invoiceName: "",

          invoiceTaxCode: "",

          invoiceAddress: ""

        },

        // Xóa sạch các cột Tiếng Việt cũ

        $unset: {

          "STT": "", "Ngày": "", "Xuất Hóa đơn": "", "Mã ca": "", "Họ và tên": "",

          "Lab": "", "Dịch vụ ": "", "Mã hàng": "", "Thông tin chi tiết thêm": "",

          "Nguồn": "", "NVKD phụ trách": "", "Thu mẫu": "", "Ngày gửi mẫu": "",

          "Đã thanh toán": "", "Chưa thanh toán": "", "Người thu tiền": "",

          "Ngày trả kết quả": "", "Cấp đại lý": "", "Tiền thu": "",

          "Mẫu chuyển lab": "", "Tiếp nhận mẫu": "", "Xử lý mẫu": "",

          "Phản hồi": "", "GL trả": "", "GX nhận": "", "Trả file mềm": "",

          "Trả file cứng": "", "Thông tin xuất hóa đơn": "",

        }

      };



      // Đưa lệnh update vào mảng thực thi hàng loạt

      bulkOps.push({

        updateOne: {

          filter: { _id: doc._id },

          update: updateDoc

        }

      });

    }



    // 3. Thực thi lưu vào Database

    if (bulkOps.length > 0) {

      console.log("Đang tiến hành ghi vào Database...");

      const result = await collection.bulkWrite(bulkOps);

      console.log(`✅ Hoàn tất! Đã chuẩn hóa thành công ${result.modifiedCount} ca.`);

    } else {

      console.log("⚠️ Không có dữ liệu để xử lý.");

    }



    process.exit(0);

  } catch (error) {

    console.error("❌ Lỗi khi chạy script:", error);

    process.exit(1);

  }

}



migrateData();