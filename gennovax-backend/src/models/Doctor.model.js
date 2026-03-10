import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phone: String,
    address: String,
    
    // XÓA cái cũ: agentLevel: { type: String, default: "cap3" },
    // THÊM 2 cái mới:
    agentLevels: { type: [String], default: [] }, // Lưu mảng các cấp: ['cap1', 'cap2']
    defaultAgentLevel: { type: String, default: "" }, // Lưu cấp mặc định: 'cap1'

    agentTierLabel: { type: String, default: "" },
    salesOwner: { type: String, default: "" },
    note: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Doctor", DoctorSchema);