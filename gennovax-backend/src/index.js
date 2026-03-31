import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./db.js";

import casesRoutes from "./routes/cases.routes.js";
import doctorsRoutes from "./routes/doctors.routes.js";
import servicesRoutes from "./routes/services.routes.js";
import metaRoutes from "./routes/meta.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import driveRoutes from "./routes/drive.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js"; 
import aiAnalyticsRoutes from "./routes/ai-analytics.routes.js";

import { requireAuth } from "./middlewares/auth.middleware.js";
import { browserGate } from "./middlewares/browserGate.middleware.js";
import { startAutoBackup } from "./services/backup.service.js";

dotenv.config();

const app = express();

// 👉 QUAN TRỌNG: Cần bật trust proxy nếu app chạy phía sau Nginx, Vercel, Render, Heroku...
// Nếu không bật, req.ip sẽ luôn trả về IP của server/proxy (vd: 127.0.0.1)
app.set('trust proxy', true); 

// --- CẤU HÌNH LOG MORGAN (GIỜ VIỆT NAM) CÓ MÀU SẮC & CHI TIẾT ---
morgan.token('date-vn', () => {
  return new Date().toLocaleString('vi-VN', { 
    timeZone: 'Asia/Ho_Chi_Minh',
    hour12: false 
  });
});

morgan.token('status-colored', (req, res) => {
  const status = res.statusCode;
  const color = status >= 500 ? 31 // Đỏ
    : status >= 400 ? 33 // Vàng
    : status >= 300 ? 36 // Cyan
    : status >= 200 ? 32 // Xanh lá
    : 0; 
  return `\x1b[${color}m${status}\x1b[0m`;
});

// 👉 Token lấy IP thật của client
morgan.token('client-ip', (req) => {
  // Ưu tiên lấy từ header x-forwarded-for do proxy đẩy xuống
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
  // x-forwarded-for có thể là 1 chuỗi nhiều IP, ta lấy IP đầu tiên
  return ip?.split(',')[0].trim() || 'Unknown IP';
});

// 👉 Token lấy nguồn gọi (Origin / Referer)
morgan.token('client-origin', (req) => {
  return req.headers['origin'] || req.headers['referer'] || 'Direct/Unknown';
});

// Format: [Thời gian] [IP] [Nguồn] Method URL Status Thời_gian_phản_hồi [User-Agent]
app.use(morgan(
  '\x1b[90m[:date-vn]\x1b[0m ' +                    // Thời gian (xám)
  '\x1b[36m[:client-ip]\x1b[0m ' +                  // IP (Xanh dương nhạt)
  '\x1b[33m[:client-origin]\x1b[0m ' +              // Nguồn gọi (Vàng)
  '\x1b[35m:method\x1b[0m :url :status-colored ' +  // Method (Tím), URL, Status (Màu tùy biến)
  '\x1b[90m:response-time ms\x1b[0m ' +             // Thời gian xử lý (Xám)
  '- \x1b[90m:user-agent\x1b[0m'                    // Thiết bị/Trình duyệt (Xám)
));
// ------------------------------------------

app.use(express.json({ limit: "2mb" }));

const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép mọi origin để thuận tiện phát triển
    callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Khởi động dịch vụ tự động sao lưu
startAutoBackup();

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Health check route
app.get("/health", (req, res) => res.json({ ok: true }));

// ✅ Public routes
app.use("/api/auth", authRoutes);
app.use("/api/users", requireAuth, userRoutes);

// ✅ Protected routes
// Áp dụng browserGate để chống bot/request ngoài trình duyệt và requireAuth để kiểm tra token
app.use("/api/cases", browserGate(ALLOWED_ORIGINS), requireAuth, casesRoutes);
app.use("/api/doctors", browserGate(ALLOWED_ORIGINS), requireAuth, doctorsRoutes);
app.use("/api/services", browserGate(ALLOWED_ORIGINS), requireAuth, servicesRoutes);
app.use("/api/meta", browserGate(ALLOWED_ORIGINS), requireAuth, metaRoutes);
app.use("/api/upload", browserGate(ALLOWED_ORIGINS), requireAuth, uploadRoutes);
app.use("/api/drive", browserGate(ALLOWED_ORIGINS), requireAuth, driveRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/ai", aiAnalyticsRoutes);

// Error handler toàn cục
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ message: err?.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 4000;

// Kết nối Database và khởi động Server
connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✅ API đang lắng nghe tại: http://localhost:${PORT}`)
    );
  })
  .catch((e) => {
    console.error("❌ Lỗi kết nối MongoDB:", e);
    process.exit(1);
  });