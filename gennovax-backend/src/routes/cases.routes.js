import { Router } from "express";
import Case from "../models/Case.model.js";
import { computePriceAndAgent } from "../services/pricing.service.js";
import { computeDueDate } from "../services/dueDate.service.js";

// Import connection Atlas (Bạn thay đổi đường dẫn này trỏ tới file cấu hình DB của bạn nhé)
// import { atlasConnection } from "../db.js"; 

// Tạo Model Case dành riêng cho Atlas, TÁI SỬ DỤNG cấu trúc Schema gốc
// const CaseAtlas = atlasConnection.model("Case", Case.schema);

const router = Router();

function toDateOrNull(x) {
  if (!x) return null;
  const d = new Date(String(x));
  return Number.isNaN(d.getTime()) ? null : d;
}
function parseVNDate(val, isEnd = false) {
  if (!val) return null;
  // Cắt lấy phần ngày YYYY-MM-DD (phòng trường hợp Frontend gửi lên full chuỗi ISO)
  const dateStr = String(val).split('T')[0]; 
  
  // Ép cứng giờ đầu ngày (00:00:00) hoặc cuối ngày (23:59:59) theo đúng GMT+07:00
  const timeStr = isEnd ? "T23:59:59.999+07:00" : "T00:00:00.000+07:00";
  const d = new Date(`${dateStr}${timeStr}`);
  
  return Number.isNaN(d.getTime()) ? null : d;
}

// ==============================
// GET /api/cases/analytics
// (Chỉ cần đọc từ DB Local cho nhanh)
// ==============================
router.get("/analytics", async (req, res, next) => {
  try {
    const { serviceType, month } = req.query; // month = "2024-05" hoặc "ALL"

    // 1. Lọc theo Loại Dịch Vụ (Áp dụng cho toàn bộ dữ liệu)
    const match1 = {};
    if (serviceType) match1.serviceType = String(serviceType);

    // 2. Lọc theo Tháng (Áp dụng cho KPI, Bảng nguồn, Bảng dịch vụ)
    const monthFilter = (month && month !== "ALL") ? { ym: String(month) } : {};

    const sourceExpr = {
      $ifNull: [
        { $cond: [{ $eq: ["$source", ""] }, null, "$source"] },
        "Chưa xác định",
      ],
    };

    const [result] = await Case.aggregate([
      { $match: match1 },
      // Tạo trường 'ym' (Year-Month) chuẩn múi giờ VN để phân nhóm và lọc
      {
        $addFields: {
          ym: {
            $dateToString: {
              format: "%Y-%m",
              date: "$receivedAt",
              timezone: "Asia/Ho_Chi_Minh"
            }
          }
        }
      },
      {
        $facet: {
          // --- A. BIỂU ĐỒ THEO THÁNG (Không bị lọc bởi monthFilter, luôn hiện đủ các tháng) ---
          monthlyTrend: [
            { $match: { ym: { $ne: null } } },
            {
              $group: {
                _id: "$ym",
                revenue: { $sum: { $ifNull: ["$collectedAmount", 0] } },
                cost: { $sum: { $ifNull: ["$costPrice", 0] } },
                cases: { $sum: 1 }
              }
            },
            {
              $project: {
                _id: 0, ym: "$_id", revenue: 1, cost: 1, cases: 1,
                netRevenue: { $subtract: ["$revenue", "$cost"] }
              }
            },
            { $sort: { ym: 1 } }
          ],

          // --- B. KPIs (Bị lọc bởi monthFilter) ---
          // --- B. KPIs (Bị lọc bởi monthFilter) ---
          kpis: [
            { $match: monthFilter },
            {
              $group: {
                _id: null,
                totalCases: { $sum: 1 },
                paidCases: { $sum: { $cond: ["$paid", 1, 0] } },
                totalRevenue: { $sum: { $ifNull: ["$collectedAmount", 0] } },
                totalCost: { $sum: { $ifNull: ["$costPrice", 0] } },
                // ✅ MỚI: Chỉ cộng (Doanh thu - Chi phí) cho những ca CÓ ĐÁNH DẤU ĐÃ THANH TOÁN (paid: true)
                actualNetRevenue: {
                  $sum: {
                    $cond: [
                      { $eq: ["$paid", true] },
                      {
                        $subtract: [
                          { $ifNull: ["$collectedAmount", 0] },
                          { $ifNull: ["$costPrice", 0] }
                        ]
                      },
                      0
                    ]
                  }
                }
              }
            },
            {
              $project: {
                _id: 0, 
                totalCases: 1, 
                paidCases: 1, 
                totalRevenue: 1, 
                totalCost: 1,
                actualNetRevenue: 1, // Lợi nhuận thực tế đã tính bên trên
                totalNetRevenue: { $subtract: ["$totalRevenue", "$totalCost"] }, // Lợi nhuận dự kiến tổng
                paidRate: { $cond: [{ $gt: ["$totalCases", 0] }, { $divide: ["$paidCases", "$totalCases"] }, 0] }
              }
            }
          ],

          // --- C. BẢNG XẾP HẠNG NGUỒN (Bị lọc bởi monthFilter) ---
          bySource: [
            { $match: monthFilter },
            {
              $group: {
                _id: sourceExpr,
                revenue: { $sum: { $ifNull: ["$collectedAmount", 0] } },
                cost: { $sum: { $ifNull: ["$costPrice", 0] } },
                cases: { $sum: 1 },
                paidCases: { $sum: { $cond: ["$paid", 1, 0] } }
              }
            },
            {
              $project: {
                _id: 0, source: "$_id", revenue: 1, cost: 1, cases: 1, paidCases: 1,
                netRevenue: { $subtract: ["$revenue", "$cost"] },
              }
            },
            { $sort: { netRevenue: -1, cases: -1 } }
          ],

          // --- D. BẢNG XẾP HẠNG DỊCH VỤ CHI TIẾT (Bị lọc bởi monthFilter) ---
          byService: [
            { $match: monthFilter },
            {
              $group: {
                _id: { code: "$serviceCode", name: "$serviceName" },
                revenue: { $sum: { $ifNull: ["$collectedAmount", 0] } },
                cost: { $sum: { $ifNull: ["$costPrice", 0] } },
                cases: { $sum: 1 }
              }
            },
            {
              $project: {
                _id: 0, serviceCode: "$_id.code", serviceName: "$_id.name",
                revenue: 1, cost: 1, cases: 1,
                netRevenue: { $subtract: ["$revenue", "$cost"] }
              }
            },
            { $sort: { netRevenue: -1, cases: -1 } }
          ]
        }
      }
    ]);

    res.json({
      kpis: result?.kpis?.[0] || { totalCases: 0, paidCases: 0, totalRevenue: 0, totalCost: 0, totalNetRevenue: 0, paidRate: 0 },
      monthlyTrend: result?.monthlyTrend || [],
      bySource: result?.bySource || [],
      byService: result?.byService || [],
    });
  } catch (e) {
    next(e);
  }
});


// ==============================
// GET /api/cases
// (Chỉ cần đọc từ DB Local cho nhanh)
// ==============================
router.get("/", async (req, res, next) => {
  try {
    const { serviceType, q = "", from = "", to = "" } = req.query;

    const filter = {};
    if (serviceType) filter.serviceType = serviceType;

    // ✅ Lấy mốc thời gian đã ép chuẩn múi giờ Việt Nam
    const fromD = parseVNDate(from, false); 
    const toD = parseVNDate(to, true);      
    
    // ✅ Lọc theo `receivedAt` thay vì `date`
    if (fromD || toD) {
      filter.receivedAt = {};
      if (fromD) filter.receivedAt.$gte = fromD;
      if (toD) filter.receivedAt.$lte = toD; // Không cần setHours thủ công nữa
    }

    if (q) {
      const s = String(q);
      filter.$or = [
        { caseCode: { $regex: s, $options: "i" } },
        { patientName: { $regex: s, $options: "i" } },
        { serviceCode: { $regex: s, $options: "i" } },
        { serviceName: { $regex: s, $options: "i" } },
        { source: { $regex: s, $options: "i" } },
      ];
    }

    const items = await Case.find(filter).sort({ receivedAt: -1 }).limit(500).lean();
    res.json({ items, total: items.length });
  } catch (e) {
    next(e);
  }
});


// ==============================
// POST /api/cases
// (Ghi Local và Ghi ngầm Atlas)
// ==============================
router.post("/", async (req, res, next) => {
  try {
    const payload = req.body || {};

    // 1. KIỂM TRA TRÙNG MÃ CA (Nếu có nhập mã ca thì mới check)
    if (payload.caseCode && payload.caseCode.trim() !== "") {
      const existingCase = await Case.findOne({ caseCode: payload.caseCode.trim() }).lean();
      if (existingCase) {
        return res.status(400).json({ message: `Mã ca "${payload.caseCode}" đã tồn tại trong hệ thống.` });
      }
    }

    // 2. XỬ LÝ NGÀY THÁNG
    payload.date = payload.date ? new Date(payload.date) : new Date();
    payload.sentAt = payload.sentAt ? new Date(payload.sentAt) : null;
    payload.receivedAt = payload.receivedAt ? new Date(payload.receivedAt) : null;
    payload.returnedAt = payload.returnedAt ? new Date(payload.returnedAt) : null;

    // 3. XỬ LÝ LƯU VẾT NGƯỜI DÙNG TẠO MỚI (CHANGES)
    const userName = payload.currentUserName || "Unknown";
    const userEmail = payload.currentUserEmail || "Unknown";
    
    payload.changes = [{
      name: userName,
      email: userEmail,
      action: "Tạo mới",
      changedAt: new Date()
    }];

    // Xóa các trường tạm để không lưu rác vào Database
    delete payload.currentUserName;
    delete payload.currentUserEmail;

    // 4. TÍNH TOÁN GIÁ & ĐẠI LÝ
    const info = await computePriceAndAgent({
      serviceId: payload.serviceId,
      doctorId: payload.doctorId,
    });
    payload.price = info.price;
    payload.agentLevel = info.agentLevel;
    payload.agentTierLabel = info.agentTierLabel;
    payload.serviceCode = info.serviceCode || payload.serviceCode || "";
    payload.serviceName = info.serviceName || payload.serviceName || "";

    // 5. TÍNH TOÁN NGÀY HẸN TRẢ KẾT QUẢ
    payload.dueDate = await computeDueDate({
      serviceId: payload.serviceId,
      receivedAt: payload.receivedAt,
    });

    // 6. THỰC THI LƯU VÀO DB LOCAL
    const createdLocal = await Case.create(payload);

    // 7. Lưu ngầm lên Atlas (KHÔNG dùng await để không chặn luồng)
    // CaseAtlas.create(payload).catch(err => console.error("Lỗi đồng bộ tạo ca lên Atlas:", err));

    res.json(createdLocal);
  } catch (e) {
    next(e);
  }
});


// ==============================
// PATCH /api/cases/:id
// (Cập nhật Local và Cập nhật ngầm Atlas)
// ==============================
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const patch = req.body || {};

    // 1. KIỂM TRA TRÙNG MÃ CA (Loại trừ chính nó)
    if (patch.caseCode && patch.caseCode.trim() !== "") {
      const existingCase = await Case.findOne({
        caseCode: patch.caseCode.trim(),
        _id: { $ne: id } // Bỏ qua ca đang được update hiện tại
      }).lean();
      
      if (existingCase) {
        return res.status(400).json({ message: `Mã ca "${patch.caseCode}" đã được sử dụng ở một ca khác.` });
      }
    }

    // 2. XỬ LÝ NGÀY THÁNG
    if ("date" in patch) patch.date = patch.date ? new Date(patch.date) : new Date();
    if ("sentAt" in patch) patch.sentAt = patch.sentAt ? new Date(patch.sentAt) : null;
    if ("receivedAt" in patch) patch.receivedAt = patch.receivedAt ? new Date(patch.receivedAt) : null;
    if ("returnedAt" in patch) patch.returnedAt = patch.returnedAt ? new Date(patch.returnedAt) : null;

    // Lấy dữ liệu ca hiện tại trong DB ra để đối chiếu
    const current = await Case.findById(id).lean();
    if (!current) return res.status(404).json({ message: "Not found" });

    // 3. XỬ LÝ MẢNG LỊCH SỬ CHỈNH SỬA (CHANGES)
    const changes = current.changes || [];
    const userEmail = patch.currentUserEmail || "Unknown";
    const userName = patch.currentUserName || "Unknown";
    const now = new Date();

    // Tìm xem email người này đã có trong mảng changes chưa
    const existingIndex = changes.findIndex(c => c.email === userEmail);

    if (existingIndex !== -1) {
      // Nếu ĐÃ TỪNG sửa: Chỉ cập nhật lại thời gian lastChange
      changes[existingIndex].changedAt = now;
      changes[existingIndex].action = "Cập nhật"; 
    } else {
      // Nếu CHƯA TỪNG sửa: Thêm một record mới vào mảng
      changes.push({
        name: userName,
        email: userEmail,
        action: "Cập nhật",
        changedAt: now
      });
    }

    // Gán lại mảng changes vào object patch để chuẩn bị lưu
    patch.changes = changes;

    // Xóa trường tạm để không lưu rác vào Document
    delete patch.currentUserName;
    delete patch.currentUserEmail;

    // 4. KIỂM TRA THAY ĐỔI ĐỂ TÍNH TOÁN LẠI GIÁ VÀ HẠN TRẢ KẾT QUẢ
    const nextDoc = { ...current, ...patch };

    const changedServiceOrDoctor = ("serviceId" in patch) || ("doctorId" in patch);
    if (changedServiceOrDoctor) {
      const info = await computePriceAndAgent({
        serviceId: nextDoc.serviceId,
        doctorId: nextDoc.doctorId,
      });
      patch.price = info.price;
      patch.agentLevel = info.agentLevel;
      patch.agentTierLabel = info.agentTierLabel;
      patch.serviceCode = info.serviceCode || nextDoc.serviceCode || "";
      patch.serviceName = info.serviceName || nextDoc.serviceName || "";
    }

    const changedDue = ("receivedAt" in patch) || ("serviceId" in patch);
    if (changedDue) {
      patch.dueDate = await computeDueDate({
        serviceId: nextDoc.serviceId,
        receivedAt: nextDoc.receivedAt,
      });
    }

    // 5. THỰC THI CẬP NHẬT TRÊN DB LOCAL
    const updatedLocal = await Case.findByIdAndUpdate(id, patch, { new: true }).lean();

    // 6. Cập nhật ngầm trên Atlas với upsert: true
    // CaseAtlas.findByIdAndUpdate(id, patch, { new: true, upsert: true }).catch(err => console.error("Lỗi đồng bộ sửa ca lên Atlas:", err));

    res.json(updatedLocal);
  } catch (e) {
    next(e);
  }
});

// ==============================
// DELETE /api/cases/:id
// (Xóa Local và Xóa ngầm Atlas)
// ==============================
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // 1. Xóa trên Local
    await Case.findByIdAndDelete(id);
    
    // 2. Xóa ngầm trên Atlas

    
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;