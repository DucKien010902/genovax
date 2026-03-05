import "dotenv/config"; // 🌟 PHẢI CÓ DÒNG NÀY Ở TRÊN CÙNG
import mongoose from "mongoose";

export async function connectDB(uri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { autoIndex: true });
  console.log("✅ MongoDB connected");
}

// Lúc này process.env.MONGO_URI_ATLAS mới có dữ liệu
//export const atlasConnection = mongoose.createConnection(process.env.MONGO_URI_ATLAS, {
//  autoIndex: true,
//});

//atlasConnection.on("connected", () => {
//  console.log("✅ MongoDB Atlas connected");
//});

//atlasConnection.on("error", (err) => {
//  console.error("❌ MongoDB Atlas connection error:", err);
//});