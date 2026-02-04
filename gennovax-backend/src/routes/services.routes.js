import { Router } from "express";
import Service from "../models/Service.model.js";

const router = Router();

// GET /api/services?serviceType=ADN
router.get("/", async (req, res, next) => {
  try {
    const { serviceType } = req.query;
    const q = {};
    if (serviceType) q.serviceType = serviceType;
    q.isActive = true;

    const items = await Service.find(q).sort({ createdAt: -1 }).lean();
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

// POST /api/services
router.post("/", async (req, res, next) => {
  try {
    const created = await Service.create(req.body);
    res.json(created);
  } catch (e) {
    next(e);
  }
});

export default router;
