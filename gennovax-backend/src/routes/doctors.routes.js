import { Router } from "express";
import Doctor from "../models/Doctor.model.js";

const router = Router();

// GET /api/doctors?search=
router.get("/", async (req, res, next) => {
  try {
    const { search = "" } = req.query;
    const q = { isActive: true };

    if (search) {
      q.$or = [
        { fullName: { $regex: String(search), $options: "i" } },
        { phone: { $regex: String(search), $options: "i" } },
      ];
    }

    const items = await Doctor.find(q).sort({ createdAt: -1 }).limit(50).lean();
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

// POST /api/doctors
router.post("/", async (req, res, next) => {
  try {
    const created = await Doctor.create(req.body);
    res.json(created);
  } catch (e) {
    next(e);
  }
});

export default router;
