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

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/cases", casesRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/meta", metaRoutes);
app.use("/api/auth", authRoutes);

// error handler
app.use((err, req, res, next) => {
  console.error("❌", err);
  res.status(500).json({ message: err?.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 4000;

connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`✅ API listening on http://localhost:${PORT}`));
  })
  .catch((e) => {
    console.error("Mongo connect error:", e);
    process.exit(1);
  });
