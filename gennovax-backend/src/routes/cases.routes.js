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

// ==============================
// GET /api/cases/analytics
// (Chỉ cần đọc từ DB Local cho nhanh)
// ==============================
router.get("/analytics", async (req, res, next) => {
  try {
    const { serviceType, from = "", to = "", top = "10" } = req.query;

    const match = {};
    if (serviceType) match.serviceType = String(serviceType);

    const fromD = toDateOrNull(from);
    const toD = toDateOrNull(to);

    // Dùng trực tiếp field 'date' để lọc, không cần chế ra 'date2'
    if (fromD || toD) {
      match.date = {};
      if (fromD) match.date.$gte = fromD;
      if (toD) {
        const end = new Date(toD);
        end.setHours(23, 59, 59, 999);
        match.date.$lte = end;
      }
    }

    const sourceExpr = {
      $ifNull: [
        { $cond: [{ $eq: ["$source", ""] }, null, "$source"] },
        "Unknown",
      ],
    };

    const topN = Math.max(1, Math.min(50, parseInt(String(top || "10"), 10) || 10));

    // Pipeline nhẹ nhàng hơn, không dùng $switch hay $dateFromString
    const [result] = await Case.aggregate([
      { $match: match },
      {
        $facet: {
          kpis: [
            {
              $group: {
                _id: null,
                totalCases: { $sum: 1 },
                paidCases: { $sum: { $cond: ["$paid", 1, 0] } },
                totalRevenue: { $sum: { $ifNull: ["$collectedAmount", 0] } },
                totalCost: { $sum: { $ifNull: ["$costPrice", 0] } },
                totalListPrice: { $sum: { $ifNull: ["$price", 0] } },
              },
            },
            {
              $project: {
                _id: 0,
                totalCases: 1,
                paidCases: 1,
                totalRevenue: 1,
                totalCost: 1,
                totalNetRevenue: { $subtract: ["$totalRevenue", "$totalCost"] },
                totalListPrice: 1,
                paidRate: {
                  $cond: [
                    { $gt: ["$totalCases", 0] },
                    { $divide: ["$paidCases", "$totalCases"] },
                    0,
                  ],
                },
              },
            },
          ],

          bySource: [
            {
              $group: {
                _id: sourceExpr,
                totalCases: { $sum: 1 },
                paidCases: { $sum: { $cond: ["$paid", 1, 0] } },
                revenue: { $sum: { $ifNull: ["$collectedAmount", 0] } },
                cost: { $sum: { $ifNull: ["$costPrice", 0] } },
                listPrice: { $sum: { $ifNull: ["$price", 0] } },
              },
            },
            { $addFields: { source: "$_id" } },
            {
              $project: {
                _id: 0,
                source: 1,
                totalCases: 1,
                paidCases: 1,
                revenue: 1,
                cost: 1,
                netRevenue: { $subtract: ["$revenue", "$cost"] },
                listPrice: 1,
                paidRate: {
                  $cond: [
                    { $gt: ["$totalCases", 0] },
                    { $divide: ["$paidCases", "$totalCases"] },
                    0,
                  ],
                },
              },
            },
            { $sort: { netRevenue: -1, paidCases: -1, totalCases: -1 } },
          ],

          monthlyBySource: [
            {
              $group: {
                _id: {
                  ym: { $dateToString: { format: "%Y-%m", date: "$date" } }, // Trỏ thẳng vào date
                  source: sourceExpr,
                },
                revenue: { $sum: { $ifNull: ["$collectedAmount", 0] } },
                cost: { $sum: { $ifNull: ["$costPrice", 0] } },
                cases: { $sum: 1 },
                paidCases: { $sum: { $cond: ["$paid", 1, 0] } },
              },
            },
            {
              $project: {
                _id: 0,
                ym: "$_id.ym",
                source: "$_id.source",
                revenue: 1,
                cost: 1,
                netRevenue: { $subtract: ["$revenue", "$cost"] },
                cases: 1,
                paidCases: 1,
              },
            },
            // Lọc bỏ những dữ liệu không ép ra được tháng (null) do date bị sai định dạng
            { $match: { ym: { $ne: null } } },
            { $sort: { ym: 1 } },
          ],

          topSources: [
            {
              $group: {
                _id: sourceExpr,
                revenue: { $sum: { $ifNull: ["$collectedAmount", 0] } },
                cost: { $sum: { $ifNull: ["$costPrice", 0] } },
                paidCases: { $sum: { $cond: ["$paid", 1, 0] } },
                totalCases: { $sum: 1 },
              },
            },
            {
              $project: {
                revenue: 1,
                cost: 1,
                netRevenue: { $subtract: ["$revenue", "$cost"] },
                paidCases: 1,
                totalCases: 1,
              }
            },
            { $sort: { netRevenue: -1 } },
            { $limit: topN },
            {
              $project: {
                _id: 0,
                source: "$_id",
                revenue: 1,
                cost: 1,
                netRevenue: 1,
                paidCases: 1,
                totalCases: 1,
              },
            },
          ],
        },
      },
    ]);

    const monthlyRaw = result?.monthlyBySource || [];
    const allSources = Array.from(new Set(monthlyRaw.map((x) => x.source)));

    const map = new Map();
    for (const row of monthlyRaw) {
      const key = row.ym;
      if (!map.has(key))
        map.set(key, { 
            ym: key, 
            totalRevenue: 0, 
            totalCost: 0, 
            totalNetRevenue: 0, 
            totalCases: 0, 
            paidCases: 0 
        });
      const obj = map.get(key);
      
      obj[row.source] = row.netRevenue;
      obj.totalRevenue += row.revenue || 0;
      obj.totalCost += row.cost || 0;
      obj.totalNetRevenue += row.netRevenue || 0;
      obj.totalCases += row.cases || 0;
      obj.paidCases += row.paidCases || 0;
    }
    const monthly = Array.from(map.values()).sort((a, b) =>
      String(a.ym).localeCompare(String(b.ym))
    );

    res.json({
      kpis:
        result?.kpis?.[0] || {
          totalCases: 0,
          paidCases: 0,
          totalRevenue: 0,
          totalCost: 0,
          totalNetRevenue: 0,
          totalListPrice: 0,
          paidRate: 0,
        },
      bySource: result?.bySource || [],
      topSources: result?.topSources || [],
      monthly,
      monthlyDetails: monthlyRaw, 
      sourceKeys: allSources,
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

    const fromD = toDateOrNull(from);
    const toD = toDateOrNull(to);
    if (fromD || toD) {
      filter.date = {};
      if (fromD) filter.date.$gte = fromD;
      if (toD) {
        const end = new Date(toD);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
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

    const items = await Case.find(filter).sort({ date: -1, createdAt: -1 }).limit(500).lean();
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

    payload.date = payload.date ? new Date(payload.date) : new Date();
    payload.sentAt = payload.sentAt ? new Date(payload.sentAt) : null;
    payload.receivedAt = payload.receivedAt ? new Date(payload.receivedAt) : null;

    const info = await computePriceAndAgent({
      serviceId: payload.serviceId,
      doctorId: payload.doctorId,
    });
    payload.price = info.price;
    payload.agentLevel = info.agentLevel;
    payload.agentTierLabel = info.agentTierLabel;
    payload.serviceCode = info.serviceCode || payload.serviceCode || "";
    payload.serviceName = info.serviceName || payload.serviceName || "";

    payload.dueDate = await computeDueDate({
      serviceId: payload.serviceId,
      receivedAt: payload.receivedAt,
    });

    // 1. Đợi lưu Local xong để trả data về cho Client
    const createdLocal = await Case.create(payload);

    // 2. Lưu ngầm lên Atlas (KHÔNG dùng await để không chặn luồng)
    

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

    if ("date" in patch) patch.date = patch.date ? new Date(patch.date) : new Date();
    if ("sentAt" in patch) patch.sentAt = patch.sentAt ? new Date(patch.sentAt) : null;
    if ("receivedAt" in patch) patch.receivedAt = patch.receivedAt ? new Date(patch.receivedAt) : null;

    const current = await Case.findById(id).lean();
    if (!current) return res.status(404).json({ message: "Not found" });

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

    // 1. Cập nhật trên Local
    const updatedLocal = await Case.findByIdAndUpdate(id, patch, { new: true }).lean();

    // 2. Cập nhật ngầm trên Atlas với upsert: true
    

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
    CaseAtlas.findByIdAndDelete(id).catch((err) => {
      console.error(`❌ Lỗi khi xóa ca ${id} trên Atlas:`, err);
    });
    
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;