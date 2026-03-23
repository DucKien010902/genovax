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

app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));

const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép mọi origin (nếu có origin thì trả về true, không có - như Postman - cũng cho qua)
    callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
startAutoBackup();
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.get("/health", (req, res) => res.json({ ok: true }));

// ✅ public routes
app.use("/api/auth", authRoutes);
app.use("/api/users",requireAuth, userRoutes);
// ✅ protected routes: chống request không phải browser (mutation) + yêu cầu token
app.use("/api/cases", browserGate(ALLOWED_ORIGINS), requireAuth, casesRoutes);
app.use("/api/doctors", browserGate(ALLOWED_ORIGINS), requireAuth, doctorsRoutes);
app.use("/api/services", browserGate(ALLOWED_ORIGINS), requireAuth, servicesRoutes);
app.use("/api/meta", browserGate(ALLOWED_ORIGINS), requireAuth, metaRoutes);
app.use("/api/upload", browserGate(ALLOWED_ORIGINS), requireAuth, uploadRoutes);
app.use("/api/drive", browserGate(ALLOWED_ORIGINS), requireAuth, driveRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/ai", aiAnalyticsRoutes);


// error handler
app.use((err, req, res, next) => {
  console.error("❌", err);
  res.status(500).json({ message: err?.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 4000;

connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () =>
      console.log(`✅ API listening on http://localhost:${PORT}`)
    );
  })
  .catch((e) => {
    console.error("Mongo connect error:", e);
    process.exit(1);
  });
