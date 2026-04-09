import { Router } from 'express';
import mongoose from 'mongoose';
import Doctor from '../models/Doctor.model.js';
import Case from '../models/Case.model.js';
import Service from '../models/Service.model.js';
import { requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

function isSales(req) {
  return req.user?.role === 'sales';
}

function buildDoctorScope(req) {
  if (isSales(req)) {
    return { salesOwnerUserId: new mongoose.Types.ObjectId(req.user.id) };
  }

  return {};
}

function findDoctorInScope(req, id) {
  return Doctor.findOne({
    _id: id,
    ...buildDoctorScope(req),
  });
}

function normalizeBaseDoctorPayload(body = {}) {
  return {
    fullName: String(body.fullName || '').trim(),
    phone: String(body.phone || '').trim(),
    address: String(body.address || '').trim(),
    salesOwner: String(body.salesOwner || '').trim(),
    agentTierLabel: String(body.agentTierLabel || '').trim(),
    note: String(body.note || '').trim(),
    isActive: body.isActive !== false,
  };
}

function normalizePrice(value) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function extractClinicCodeNumber(value = '') {
  const match = String(value).trim().match(/^(\d+)\.GX$/i);
  return match ? Number(match[1]) : null;
}

async function generateNextClinicCode() {
  const doctors = await Doctor.find(
    { agentTierLabel: { $regex: /^\d+\.GX$/i } },
    { agentTierLabel: 1 }
  ).lean();

  const maxCodeNumber = doctors.reduce((max, item) => {
    const codeNumber = extractClinicCodeNumber(item.agentTierLabel);
    if (!Number.isFinite(codeNumber)) return max;
    return Math.max(max, codeNumber);
  }, 0);

  return `${String(maxCodeNumber + 1).padStart(3, '0')}.GX`;
}

async function findDuplicateDoctor({ fullName, agentTierLabel, excludeId = null }) {
  const filters = [];

  if (fullName) filters.push({ fullName });
  if (agentTierLabel) filters.push({ agentTierLabel });
  if (!filters.length) return null;

  const query = { $or: filters };
  if (excludeId) query._id = { $ne: excludeId };

  return Doctor.findOne(query).lean();
}

function handleDoctorDuplicateError(res, error) {
  if (error?.code !== 11000) return false;

  if (error?.keyPattern?.fullName) {
    res.status(400).json({ message: 'Tên phòng khám đã tồn tại.' });
    return true;
  }

  if (error?.keyPattern?.agentTierLabel) {
    res.status(400).json({ message: 'Mã phòng khám đã tồn tại.' });
    return true;
  }

  if (error?.keyPattern?.['servicePrices.serviceCode']) {
    res.status(400).json({ message: 'Dịch vụ này đã bị trùng do index unique cũ trong MongoDB.' });
    return true;
  }

  const duplicateFields = Object.keys(error?.keyPattern || {});
  const duplicateValues = error?.keyValue ? JSON.stringify(error.keyValue) : '';
  res.status(400).json({
    message: duplicateFields.length
      ? `Duplicate key: ${duplicateFields.join(', ')} ${duplicateValues}`.trim()
      : 'Dữ liệu phòng khám đã tồn tại.',
  });
  return true;
}

function isDuplicateKeyError(error, field) {
  return error?.code === 11000 && !!error?.keyPattern?.[field];
}

async function createDoctorWithGeneratedCode(req, payload, maxAttempts = 5) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const nextPayload = {
      ...payload,
      agentTierLabel: await generateNextClinicCode(),
    };

    try {
      return await Doctor.create({
        ...nextPayload,
        salesOwnerUserId: isSales(req) ? req.user.id : req.body.salesOwnerUserId || null,
        salesOwner:
          nextPayload.salesOwner ||
          (isSales(req) ? String(req.user?.name || '').trim() : ''),
        servicePrices: [],
      });
    } catch (error) {
      if (isDuplicateKeyError(error, 'agentTierLabel')) continue;
      throw error;
    }
  }

  const error = new Error('Failed to allocate clinic code');
  error.status = 409;
  throw error;
}

function normalizeNonEmptyString(value, fallback) {
  return {
    $ifNull: [
      {
        $cond: [{ $eq: [value, ''] }, null, value],
      },
      fallback,
    ],
  };
}

function getMonthMatch(month) {
  return month && month !== 'ALL' ? { ym: String(month) } : {};
}

async function getScopedDoctorAnalyticsMeta(req) {
  const doctors = await Doctor.find(buildDoctorScope(req), {
    fullName: 1,
    salesOwner: 1,
  }).lean();

  const clinicNames = [...new Set(doctors.map((item) => String(item.fullName || '').trim()).filter(Boolean))];
  const salesOwners = [...new Set(doctors.map((item) => String(item.salesOwner || '').trim()).filter(Boolean))];

  return { clinicNames, salesOwners };
}

function buildClinicAnalyticsMatch({ req, serviceType, salesOwner, clinicNames, salesOwners }) {
  const match = {};

  if (serviceType) {
    match.serviceType = String(serviceType);
  }

  if (isSales(req)) {
    if (!clinicNames.length) {
      match.source = { $in: [] };
      return match;
    }

    match.source = { $in: clinicNames };
  }

  if (salesOwner) {
    const normalizedSalesOwner = String(salesOwner).trim();
    if (!isSales(req) || salesOwners.includes(normalizedSalesOwner)) {
      match.salesOwner = normalizedSalesOwner;
    }
  }

  return match;
}

function emptyClinicAnalyticsResponse({ salesOwners = [], clinicNames = [], appliedSalesOwner = '', month = 'ALL' } = {}) {
  return {
    filters: {
      salesOwner: appliedSalesOwner,
      month,
    },
    availableSalesOwners: salesOwners,
    availableClinics: clinicNames,
    kpis: {
      totalCases: 0,
      totalRevenue: 0,
      totalCost: 0,
      totalNetRevenue: 0,
      paidCases: 0,
      paidRate: 0,
      clinicCount: 0,
      salesOwnerCount: 0,
    },
    monthlyTrend: [],
    byClinic: [],
    bySalesOwner: [],
  };
}

// GET /api/doctors/analytics/revenue
router.get(
  '/analytics/revenue',
  requireRole('admin', 'super_admin', 'sales'),
  async (req, res, next) => {
    try {
      const {
        month = 'ALL',
        serviceType = '',
        salesOwner = '',
        limit = '12',
      } = req.query;

      const parsedLimit = Math.min(Math.max(Number(limit) || 12, 1), 50);
      const scopedMeta = await getScopedDoctorAnalyticsMeta(req);
      const match = buildClinicAnalyticsMatch({
        req,
        serviceType,
        salesOwner,
        clinicNames: scopedMeta.clinicNames,
        salesOwners: scopedMeta.salesOwners,
      });

      if (isSales(req) && !scopedMeta.clinicNames.length) {
        return res.json(
          emptyClinicAnalyticsResponse({
            salesOwners: scopedMeta.salesOwners,
            clinicNames: scopedMeta.clinicNames,
            appliedSalesOwner: String(salesOwner || ''),
            month: String(month || 'ALL'),
          })
        );
      }

      const monthMatch = getMonthMatch(month);

      const [result] = await Case.aggregate([
        { $match: match },
        {
          $addFields: {
            ym: {
              $dateToString: {
                format: '%Y-%m',
                date: '$receivedAt',
                timezone: 'Asia/Ho_Chi_Minh',
              },
            },
            clinicName: normalizeNonEmptyString('$source', 'Chưa xác định'),
            salesOwnerName: normalizeNonEmptyString('$salesOwner', 'Chưa xác định'),
          },
        },
        {
          $facet: {
            monthlyTrend: [
              { $match: { ym: { $ne: null } } },
              {
                $group: {
                  _id: '$ym',
                  revenue: { $sum: { $ifNull: ['$collectedAmount', 0] } },
                  cost: { $sum: { $ifNull: ['$costPrice', 0] } },
                  cases: { $sum: 1 },
                  paidCases: { $sum: { $cond: ['$paid', 1, 0] } },
                },
              },
              {
                $project: {
                  _id: 0,
                  ym: '$_id',
                  revenue: 1,
                  cost: 1,
                  cases: 1,
                  paidCases: 1,
                  netRevenue: { $subtract: ['$revenue', '$cost'] },
                },
              },
              { $sort: { ym: 1 } },
            ],
            kpis: [
              { $match: monthMatch },
              {
                $group: {
                  _id: null,
                  totalCases: { $sum: 1 },
                  paidCases: { $sum: { $cond: ['$paid', 1, 0] } },
                  totalRevenue: { $sum: { $ifNull: ['$collectedAmount', 0] } },
                  totalCost: { $sum: { $ifNull: ['$costPrice', 0] } },
                  clinicNames: { $addToSet: '$clinicName' },
                  salesOwnerNames: { $addToSet: '$salesOwnerName' },
                },
              },
              {
                $project: {
                  _id: 0,
                  totalCases: 1,
                  paidCases: 1,
                  totalRevenue: 1,
                  totalCost: 1,
                  totalNetRevenue: { $subtract: ['$totalRevenue', '$totalCost'] },
                  paidRate: {
                    $cond: [
                      { $gt: ['$totalCases', 0] },
                      { $divide: ['$paidCases', '$totalCases'] },
                      0,
                    ],
                  },
                  clinicCount: { $size: '$clinicNames' },
                  salesOwnerCount: { $size: '$salesOwnerNames' },
                },
              },
            ],
            byClinic: [
              { $match: monthMatch },
              {
                $group: {
                  _id: '$clinicName',
                  revenue: { $sum: { $ifNull: ['$collectedAmount', 0] } },
                  cost: { $sum: { $ifNull: ['$costPrice', 0] } },
                  cases: { $sum: 1 },
                  paidCases: { $sum: { $cond: ['$paid', 1, 0] } },
                  salesOwners: { $addToSet: '$salesOwnerName' },
                },
              },
              {
                $project: {
                  _id: 0,
                  clinicName: '$_id',
                  revenue: 1,
                  cost: 1,
                  cases: 1,
                  paidCases: 1,
                  salesOwner: { $arrayElemAt: ['$salesOwners', 0] },
                  salesOwnerCount: { $size: '$salesOwners' },
                  netRevenue: { $subtract: ['$revenue', '$cost'] },
                },
              },
              { $sort: { netRevenue: -1, cases: -1 } },
              { $limit: parsedLimit },
            ],
            bySalesOwner: [
              { $match: monthMatch },
              {
                $group: {
                  _id: '$salesOwnerName',
                  revenue: { $sum: { $ifNull: ['$collectedAmount', 0] } },
                  cost: { $sum: { $ifNull: ['$costPrice', 0] } },
                  cases: { $sum: 1 },
                  paidCases: { $sum: { $cond: ['$paid', 1, 0] } },
                  clinics: { $addToSet: '$clinicName' },
                },
              },
              {
                $project: {
                  _id: 0,
                  salesOwner: '$_id',
                  revenue: 1,
                  cost: 1,
                  cases: 1,
                  paidCases: 1,
                  clinicCount: { $size: '$clinics' },
                  netRevenue: { $subtract: ['$revenue', '$cost'] },
                },
              },
              { $sort: { netRevenue: -1, cases: -1 } },
            ],
          },
        },
      ]);

      res.json({
        filters: {
          salesOwner: String(salesOwner || ''),
          month: String(month || 'ALL'),
        },
        availableSalesOwners: isSales(req) ? scopedMeta.salesOwners : result?.bySalesOwner?.map((item) => item.salesOwner) || [],
        availableClinics: isSales(req) ? scopedMeta.clinicNames : result?.byClinic?.map((item) => item.clinicName) || [],
        kpis: result?.kpis?.[0] || emptyClinicAnalyticsResponse().kpis,
        monthlyTrend: result?.monthlyTrend || [],
        byClinic: result?.byClinic || [],
        bySalesOwner: result?.bySalesOwner || [],
      });
    } catch (e) {
      next(e);
    }
  }
);

// GET /api/doctors?search=&all=1
router.get('/', async (req, res, next) => {
  try {
    const { search = '', all = '' } = req.query;

    const q = buildDoctorScope(req);
    if (all !== '1') q.isActive = true;

    if (search) {
      q.$or = [
        { fullName: { $regex: String(search), $options: 'i' } },
        { phone: { $regex: String(search), $options: 'i' } },
        { agentTierLabel: { $regex: String(search), $options: 'i' } },
      ];
    }

    const items = await Doctor.find(q).sort({ createdAt: -1 }).limit(500).lean();
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

// GET /api/doctors/:id
router.get('/:id', async (req, res, next) => {
  try {
    const doc = await findDoctorInScope(req, req.params.id).lean();
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  } catch (e) {
    next(e);
  }
});

// POST /api/doctors
router.post('/', requireRole('admin', 'super_admin', 'sales'), async (req, res, next) => {
  try {
    const payload = normalizeBaseDoctorPayload(req.body);

    if (!payload.fullName) {
      return res.status(400).json({ message: 'Thiếu tên phòng khám.' });
    }

    const existedDoctor = await findDuplicateDoctor({
      fullName: payload.fullName,
    });

    if (existedDoctor) {
      if (existedDoctor.fullName === payload.fullName) {
        return res.status(400).json({ message: 'Tên phòng khám đã tồn tại.' });
      }
    }

    const created = await createDoctorWithGeneratedCode(req, payload);

    res.json(created);
  } catch (e) {
    if (e?.status === 409) {
      return res.status(409).json({ message: 'Không thể tạo mã phòng khám mới. Vui lòng thử lại.' });
    }
    if (handleDoctorDuplicateError(res, e)) return;
    next(e);
  }
});

// PATCH /api/doctors/:id
router.patch('/:id', requireRole('admin', 'super_admin', 'sales'), async (req, res, next) => {
  try {
    const doctor = await findDoctorInScope(req, req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Not found' });
    }

    const payload = normalizeBaseDoctorPayload(req.body);

    if (!payload.fullName) {
      return res.status(400).json({ message: 'Thiếu tên phòng khám.' });
    }
    if (!payload.agentTierLabel) {
      return res.status(400).json({ message: 'Thiếu mã phòng khám.' });
    }

    const existedDoctor = await findDuplicateDoctor({
      fullName: payload.fullName,
      agentTierLabel: payload.agentTierLabel,
      excludeId: req.params.id,
    });

    if (existedDoctor) {
      if (existedDoctor.fullName === payload.fullName) {
        return res.status(400).json({ message: 'Tên phòng khám đã tồn tại.' });
      }
      if (existedDoctor.agentTierLabel === payload.agentTierLabel) {
        return res.status(400).json({ message: 'Mã phòng khám đã tồn tại.' });
      }
    }

    doctor.fullName = payload.fullName;
    doctor.phone = payload.phone;
    doctor.address = payload.address;
    doctor.salesOwner = payload.salesOwner || doctor.salesOwner;
    doctor.agentTierLabel = payload.agentTierLabel;
    doctor.note = payload.note;
    doctor.isActive = payload.isActive;

    await doctor.save();

    res.json(await doctor.toObject());
  } catch (e) {
    if (handleDoctorDuplicateError(res, e)) return;
    next(e);
  }
});

// GET /api/doctors/:id/services
router.get('/:id/services', async (req, res, next) => {
  try {
    const doctor = await findDoctorInScope(req, req.params.id).lean();
    if (!doctor) return res.status(404).json({ message: 'Not found' });

    const services = await Service.find({ isActive: true }).sort({ serviceType: 1, serviceCode: 1 }).lean();
    const configuredMap = new Map(
      (doctor.servicePrices || []).map((item) => [String(item.serviceId), item])
    );

    const items = services.map((service) => {
      const configured = configuredMap.get(String(service._id));
      return {
        serviceId: String(service._id),
        serviceCode: service.serviceCode,
        name: service.name,
        serviceType: service.serviceType,
        turnaroundHours: Number(service.turnaroundHours ?? 48),
        note: service.note || '',
        isGlobalActive: service.isActive !== false,
        isConfigured: !!configured && configured.isActive !== false,
        listPrice: Number(configured?.listPrice || 0),
        netPrice: Number(configured?.netPrice || 0),
      };
    });

    res.json({ items });
  } catch (e) {
    next(e);
  }
});

// PUT /api/doctors/:id/services/:serviceId
router.put(
  '/:id/services/:serviceId',
  requireRole('admin', 'super_admin', 'sales'),
  async (req, res, next) => {
    try {
      const doctor = await findDoctorInScope(req, req.params.id);
      if (!doctor) return res.status(404).json({ message: 'Not found' });

      const service = await Service.findById(req.params.serviceId).lean();
      if (!service || service.isActive === false) {
        return res.status(404).json({ message: 'Dịch vụ không tồn tại.' });
      }

      const listPrice = normalizePrice(req.body?.listPrice);
      const netPrice = normalizePrice(req.body?.netPrice);

      const nextItem = {
        serviceId: service._id,
        serviceCode: service.serviceCode,
        name: service.name,
        serviceType: service.serviceType,
        turnaroundHours: Number(service.turnaroundHours ?? 48),
        listPrice,
        netPrice,
        isActive: true,
      };

      const currentItems = doctor.servicePrices || [];
      const foundIndex = currentItems.findIndex(
        (item) => String(item.serviceId) === String(service._id)
      );

      if (foundIndex >= 0) {
        currentItems[foundIndex] = nextItem;
      } else {
        currentItems.push(nextItem);
      }

      doctor.servicePrices = currentItems;
      await doctor.save();

      res.json({
        ok: true,
        item: {
          ...nextItem,
          serviceId: String(nextItem.serviceId),
        },
      });
    } catch (e) {
      next(e);
    }
  }
);

// DELETE /api/doctors/:id/services/:serviceId
router.delete(
  '/:id/services/:serviceId',
  requireRole('admin', 'super_admin', 'sales'),
  async (req, res, next) => {
    try {
      const doctor = await findDoctorInScope(req, req.params.id);
      if (!doctor) return res.status(404).json({ message: 'Not found' });

      doctor.servicePrices = (doctor.servicePrices || []).filter(
        (item) => String(item.serviceId) !== String(req.params.serviceId)
      );
      await doctor.save();

      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  }
);

// DELETE /api/doctors/:id
router.delete('/:id', requireRole('admin', 'super_admin', 'sales'), async (req, res, next) => {
  try {
    const doctor = await findDoctorInScope(req, req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Not found' });

    await Doctor.findByIdAndDelete(doctor._id);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
