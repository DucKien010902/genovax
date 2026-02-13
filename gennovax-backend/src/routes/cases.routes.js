import { Router } from "express";
import Case from "../models/Case.model.js";
import { computePriceAndAgent } from "../services/pricing.service.js";
import { computeDueDate } from "../services/dueDate.service.js";

const router = Router();

// function toDateOrNull(v) {
//   if (!v) return null;
//   const d = new Date(v);
//   return isNaN(d.getTime()) ? null : d;
// }
function toDateOrNull(x) {
  if (!x) return null;
  const d = new Date(String(x));
  return Number.isNaN(d.getTime()) ? null : d;
}

router.get("/analytics", async (req, res, next) => {
  try {
    const { serviceType, from = "", to = "", top = "10" } = req.query;

    const match = {};
    if (serviceType) match.serviceType = String(serviceType);

    const fromD = toDateOrNull(from);
    const toD = toDateOrNull(to);

    const date2Range = {};
    if (fromD) date2Range.$gte = fromD;
    if (toD) {
      const end = new Date(toD);
      end.setHours(23, 59, 59, 999);
      date2Range.$lte = end;
    }

    const sourceExpr = {
      $ifNull: [
        { $cond: [{ $eq: ["$source", ""] }, null, "$source"] },
        "Unknown",
      ],
    };

    const topN = Math.max(
      1,
      Math.min(50, parseInt(String(top || "10"), 10) || 10)
    );

    const [result] = await Case.aggregate([
      { $match: match },

      // ✅ normalize date -> date2 (Date | string | null)
      {
        $addFields: {
          date2: {
            $switch: {
              branches: [
                // date đã là Date
                {
                  case: { $eq: [{ $type: "$date" }, "date"] },
                  then: "$date",
                },
                // date là string
                {
                  case: { $eq: [{ $type: "$date" }, "string"] },
                  then: {
                    $dateFromString: {
                      dateString: "$date",
                      // Nếu date string của bạn là "DD/MM/YYYY" thì mở format dưới đây:
                      // format: "%d/%m/%Y",
                      onError: null,
                      onNull: null,
                    },
                  },
                },
              ],
              default: null,
            },
          },
        },
      },

      // ✅ apply range filter trên date2 (an toàn)
      ...(Object.keys(date2Range).length
        ? [{ $match: { date2: date2Range } }]
        : []),

      // ✅ nếu muốn bỏ record date2 null để chart khỏi rác
      { $match: { date2: { $ne: null } } },

      {
        $facet: {
          kpis: [
            {
              $group: {
                _id: null,
                totalCases: { $sum: 1 },
                paidCases: { $sum: { $cond: ["$paid", 1, 0] } },
                totalRevenue: { $sum: { $ifNull: ["$collectedAmount", 0] } },
                totalListPrice: { $sum: { $ifNull: ["$price", 0] } },
              },
            },
            {
              $project: {
                _id: 0,
                totalCases: 1,
                paidCases: 1,
                totalRevenue: 1,
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
            { $sort: { revenue: -1, paidCases: -1, totalCases: -1 } },
          ],

          monthlyBySource: [
            {
              $group: {
                _id: {
                  ym: { $dateToString: { format: "%Y-%m", date: "$date2" } }, // ✅ dùng date2
                  source: sourceExpr,
                },
                revenue: { $sum: { $ifNull: ["$collectedAmount", 0] } },
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
                cases: 1,
                paidCases: 1,
              },
            },
            { $sort: { ym: 1 } },
          ],

          topSources: [
            {
              $group: {
                _id: sourceExpr,
                revenue: { $sum: { $ifNull: ["$collectedAmount", 0] } },
                paidCases: { $sum: { $cond: ["$paid", 1, 0] } },
                totalCases: { $sum: 1 },
              },
            },
            { $sort: { revenue: -1 } },
            { $limit: topN },
            {
              $project: {
                _id: 0,
                source: "$_id",
                revenue: 1,
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
        map.set(key, { ym: key, totalRevenue: 0, totalCases: 0, paidCases: 0 });
      const obj = map.get(key);
      obj[row.source] = row.revenue;
      obj.totalRevenue += row.revenue || 0;
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
          totalListPrice: 0,
          paidRate: 0,
        },
      bySource: result?.bySource || [],
      topSources: result?.topSources || [],
      monthly,
      sourceKeys: allSources,
    });
  } catch (e) {
    next(e);
  }
});

// GET /api/cases?serviceType=ADN&q=...&from=YYYY-MM-DD&to=YYYY-MM-DD
router.get("/", async (req, res, next) => {
  try {
    const { serviceType, q = "", from = "", to = "" } = req.query;

    const filter = {};
    if (serviceType) filter.serviceType = serviceType;

    // date range filter (theo field date)
    const fromD = toDateOrNull(from);
    const toD = toDateOrNull(to);
    if (fromD || toD) {
      filter.date = {};
      if (fromD) filter.date.$gte = fromD;
      if (toD) {
        // to inclusive: set to end of day
        const end = new Date(toD);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    // search basic fields
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

// POST /api/cases
router.post("/", async (req, res, next) => {
  try {
    const payload = req.body || {};

    // normalize dates
    payload.date = payload.date ? new Date(payload.date) : new Date();
    payload.sentAt = payload.sentAt ? new Date(payload.sentAt) : null;
    payload.receivedAt = payload.receivedAt ? new Date(payload.receivedAt) : null;

    // recompute caches: price/agent/serviceCode/serviceName
    const info = await computePriceAndAgent({
      serviceId: payload.serviceId,
      doctorId: payload.doctorId,
    });
    payload.price = info.price;
    payload.agentLevel = info.agentLevel;
    payload.agentTierLabel = info.agentTierLabel;
    payload.serviceCode = info.serviceCode || payload.serviceCode || "";
    payload.serviceName = info.serviceName || payload.serviceName || "";

    // dueDate
    payload.dueDate = await computeDueDate({
      serviceId: payload.serviceId,
      receivedAt: payload.receivedAt,
    });

    const created = await Case.create(payload);
    res.json(created);
  } catch (e) {
    next(e);
  }
});

// PATCH /api/cases/:id
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const patch = req.body || {};

    // normalize date types (only if present)
    if ("date" in patch) patch.date = patch.date ? new Date(patch.date) : new Date();
    if ("sentAt" in patch) patch.sentAt = patch.sentAt ? new Date(patch.sentAt) : null;
    if ("receivedAt" in patch) patch.receivedAt = patch.receivedAt ? new Date(patch.receivedAt) : null;

    // Get current doc to know if recompute needed
    const current = await Case.findById(id).lean();
    if (!current) return res.status(404).json({ message: "Not found" });

    const nextDoc = { ...current, ...patch };

    // recompute when doctorId or serviceId changes
    const changedServiceOrDoctor =
      ("serviceId" in patch) || ("doctorId" in patch);

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

    // recompute dueDate when receivedAt or serviceId changes
    const changedDue =
      ("receivedAt" in patch) || ("serviceId" in patch);

    if (changedDue) {
      patch.dueDate = await computeDueDate({
        serviceId: nextDoc.serviceId,
        receivedAt: nextDoc.receivedAt,
      });
    }

    const updated = await Case.findByIdAndUpdate(id, patch, { new: true }).lean();
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

// DELETE /api/cases/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await Case.findByIdAndDelete(id);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
