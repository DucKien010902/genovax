import { Router } from "express";
// Import file model Case của bạn (nhớ điều chỉnh lại đường dẫn cho đúng với thư mục dự án)
import Case from "../models/Case.model.js"; 
import Doctor from "../models/Doctor.model.js";

const router = Router();

// ==============================
// GET /api/inventory/cases
// API dành riêng cho Hệ thống vật tư
// Yêu cầu: Trả về toàn bộ ca, chỉ lấy mã ca, loại dịch vụ và tên dịch vụ
// ==============================
router.get("/cases", async (req, res, next) => {
  try {
    // Thêm điều kiện lọc serviceName không chứa "2025"
    // Và nhớ thêm -_id để không trả về id như đã thảo luận nhé!
    const items = await Case.find({ serviceName: { $not: /2025/ } })
      .select("-_id caseCode serviceType serviceName source receivedAt") 
      .lean(); 

    res.json({
      success: true,
      total: items.length,
      data: items,
    });
  } catch (e) {
    console.error("Lỗi khi lấy dữ liệu cho hệ thống vật tư:", e);
    res.status(500).json({ 
      success: false, 
      message: "Đã xảy ra lỗi khi truy xuất dữ liệu." 
    });
  }
});
router.get("/sources", async (req, res, next) => {
  try {
    const { all = "" } = req.query;

    // 1. Build Query giống hệt API Doctor gốc của bạn
    const q = {};
    if (all !== "1") {
      q.isActive = true;
    }

    // 2. Lấy dữ liệu từ bảng Doctor
    // Chỉ select trường fullName và loại bỏ _id để dữ liệu nhẹ nhất có thể
    const docs = await Doctor.find(q)
      .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo mới nhất (hoặc bạn có thể sort theo tên: { fullName: 1 })
      .select("-_id fullName") 
      .lean();
    
    // 3. Chuyển mảng Object thành mảng Text: ["Bác sĩ A", "Bác sĩ B"]
    const doctorNames = docs.map(d => d.fullName);

    res.json({
      success: true,
      total: doctorNames.length,
      data: doctorNames,
    });
  } catch (e) {
    console.error("Lỗi khi lấy danh sách bác sĩ cho hệ thống vật tư:", e);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

export default router;