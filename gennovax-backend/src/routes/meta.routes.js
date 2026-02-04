import { Router } from "express";
import Option from "../models/Option.model.js";

const router = Router();

// GET /api/meta/options
router.get("/options", async (req, res, next) => {
  try {
    const docs = await Option.find({}).lean();
    const map = {};
    for (const d of docs) {
      map[d.key] = (d.items || [])
        .filter((x) => x.isActive !== false)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((x) => ({ label: x.label, value: x.value }));
    }
    res.json(map);
  } catch (e) {
    next(e);
  }
});

// POST /api/meta/options/:key/items
router.post("/options/:key/items", async (req, res, next) => {
  try {
    const { key } = req.params;
    const { label, value, order = 0, isActive = true } = req.body || {};
    if (!label || !value) return res.status(400).json({ message: "label/value required" });

    const doc = await Option.findOneAndUpdate(
      { key },
      { $setOnInsert: { key }, $push: { items: { label, value, order, isActive } } },
      { new: true, upsert: true }
    ).lean();

    res.json(doc);
  } catch (e) {
    next(e);
  }
});

// DELETE /api/meta/options/:key/items/:value
router.delete("/options/:key/items/:value", async (req, res, next) => {
  try {
    const { key, value } = req.params;

    const doc = await Option.findOneAndUpdate(
      { key },
      { $pull: { items: { value } } },
      { new: true }
    ).lean();

    res.json(doc);
  } catch (e) {
    next(e);
  }
});

export default router;
