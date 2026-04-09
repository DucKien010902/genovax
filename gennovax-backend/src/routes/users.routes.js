import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';
import { requireRole } from '../middlewares/auth.middleware.js'; // Nhớ trỏ đúng path

const router = express.Router();

// Lấy danh sách users (Chỉ Admin/SuperAdmin)
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find({})
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ items: users });
  } catch (e) {
    next(e);
  }
});

// Thêm Staff mới
router.post('/', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: 'Email đã tồn tại!' });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      passwordHash,
      role: role || 'staff',
    });

    // Ẩn pass khi trả về
    const userObj = newUser.toObject();
    delete userObj.passwordHash;
    res.json(userObj);
  } catch (e) {
    next(e);
  }
});

// Cập nhật Staff (Đổi tên, role, khoá tài khoản)
router.patch('/:id', async (req, res, next) => {
  try {
    const { name, role, isActive, newPassword } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (newPassword)
      updateData.passwordHash = await bcrypt.hash(newPassword, 10);

    const updated = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    })
      .select('-passwordHash')
      .lean();
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

// Xoá vĩnh viễn
router.delete('/:id', async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
