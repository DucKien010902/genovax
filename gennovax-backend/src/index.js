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

import { requireAuth } from "./middlewares/auth.middleware.js";
import { browserGate } from "./middlewares/browserGate.middleware.js";

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));

const ALLOWED_ORIGINS = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((s) => s.trim());

app.use(
  cors({
    origin: function (origin, cb) {
      // Cho phép non-browser (origin undefined) đi qua CORS layer,
      // vì CORS chỉ là cơ chế trình duyệt.
      // Chặn Postman sẽ làm ở browserGate.
      if (!origin) return cb(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.get("/health", (req, res) => res.json({ ok: true }));

// ✅ public routes
app.use("/api/auth", authRoutes);

// ✅ protected routes: chống request không phải browser (mutation) + yêu cầu token
app.use("/api/cases", browserGate(ALLOWED_ORIGINS), requireAuth, casesRoutes);
app.use("/api/doctors", browserGate(ALLOWED_ORIGINS), requireAuth, doctorsRoutes);
app.use("/api/services", browserGate(ALLOWED_ORIGINS), requireAuth, servicesRoutes);
app.use("/api/meta", browserGate(ALLOWED_ORIGINS), requireAuth, metaRoutes);

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
