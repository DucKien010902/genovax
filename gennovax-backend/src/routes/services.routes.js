import { Router } from 'express';
import Service from '../models/Service.model.js';
import { requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { search = '', all = '' } = req.query;
    const query = {};

    if (all !== '1') query.isActive = true;

    if (search) {
      query.$or = [
        { serviceCode: { $regex: String(search), $options: 'i' } },
        { name: { $regex: String(search), $options: 'i' } },
      ];
    }

    const items = await Service.find(query).sort({ createdAt: -1 }).lean();
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

router.post('/', requireRole('admin', 'super_admin'), async (req, res, next) => {
  try {
    const payload = {
      serviceCode: String(req.body?.serviceCode || '').trim(),
      name: String(req.body?.name || '').trim(),
      serviceType: req.body?.serviceType,
      turnaroundHours: Number(req.body?.turnaroundHours ?? 48),
      note: String(req.body?.note || '').trim(),
      isActive: req.body?.isActive !== false,
    };

    if (!payload.serviceCode || !payload.name || !payload.serviceType) {
      return res.status(400).json({ message: 'Thiếu thông tin dịch vụ.' });
    }

    const created = await Service.create(payload);
    res.json(created);
  } catch (e) {
    if (e?.code === 11000) {
      return res.status(400).json({ message: 'Mã dịch vụ đã tồn tại.' });
    }
    next(e);
  }
});

router.patch(
  '/:id',
  requireRole('admin', 'super_admin'),
  async (req, res, next) => {
    try {
      const patch = {};

      if ('serviceCode' in req.body) patch.serviceCode = String(req.body.serviceCode || '').trim();
      if ('name' in req.body) patch.name = String(req.body.name || '').trim();
      if ('serviceType' in req.body) patch.serviceType = req.body.serviceType;
      if ('turnaroundHours' in req.body) {
        patch.turnaroundHours = Number(req.body.turnaroundHours ?? 48);
      }
      if ('note' in req.body) patch.note = String(req.body.note || '').trim();
      if ('isActive' in req.body) patch.isActive = req.body.isActive !== false;

      const updated = await Service.findByIdAndUpdate(req.params.id, patch, {
        new: true,
        runValidators: true,
      }).lean();

      if (!updated) return res.status(404).json({ message: 'Not found' });
      res.json(updated);
    } catch (e) {
      if (e?.code === 11000) {
        return res.status(400).json({ message: 'Mã dịch vụ đã tồn tại.' });
      }
      next(e);
    }
  }
);

router.delete(
  '/:id',
  requireRole('admin', 'super_admin'),
  async (req, res, next) => {
    try {
      await Service.findByIdAndDelete(req.params.id);
      res.json({ ok: true });
    } catch (e) {
      next(e);
    }
  }
);

export default router;
