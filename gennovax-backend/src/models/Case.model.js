import mongoose from "mongoose";
const changeLogSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  action: { type: String },     // VD: "Tạo mới", "Sửa thông tin"
  changedAt: { type: Date }     // Hoặc type: String nếu bạn dùng cách lưu text +07:00 như đã bàn
}, { _id: false });
const CaseSchema = new mongoose.Schema(
  {
    serviceType: { type: String, enum: ["NIPT", "ADN", "HPV","CELL"], required: true },

    // sheet-like
    stt: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },

    
    caseCode: { type: String, default: "" },
    patientName: { type: String, default: "" },

    // service & pricing
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", default: null },
    serviceName: { type: String, default: "" }, // cache name
    serviceCode: { type: String, default: "" }, // cache code
    detailNote: { type: String, default: "" },

    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", default: null },
    agentLevel: { type: String, default: "" },
    agentTierLabel: { type: String, default: "" },
    price: { type: Number, default: 0 },

    paid: { type: Boolean, default: false },
    paymentMethod: { type: String, default: "" },
    collectedAmount: { type: Number, default: 0 },
    receivedAmount: { type: Number, default: 0 },
    costPrice: { type: Number, default: 0 },

    // workflow
    lab: { type: String, default: "" },
    source: { type: String, default: "" },
    salesOwner: { type: String, default: "" },
    sampleCollector: { type: String, default: "" },

    sentAt: { type: Date, default: null },
    receivedAt: { type: Date, default: null },
    dueDate: { type: Date, default: null },

    transferStatus: { type: String, default: "" },
    receiveStatus: { type: String, default: "" },
    processStatus: { type: String, default: "" },
    feedbackStatus: { type: String, default: "" },

    glReturned: { type: Boolean, default: false },
    gxReceived: { type: Boolean, default: false },
    softFileDone: { type: Boolean, default: false },
    hardFileDone: { type: Boolean, default: false },

invoiceType: { type: String, enum: ["company", "personal"], default: "company" }, // Thêm loại HĐ
    invoiceName: { type: String, default: "" }, // Tên Cty / Tên Cá nhân
    invoiceTaxCode: { type: String, default: "" }, // Chỉ dùng cho Cty
    invoiceIdCard: { type: String, default: "" }, // CCCD - Dùng cho Cá nhân
    invoiceIssueDate: { type: String, default: "" }, // Ngày cấp - Dùng cho Cá nhân
    invoiceIssuePlace: { type: String, default: "" }, // Nơi cấp - Dùng cho Cá nhân
    invoiceAddress: { type: String, default: "" }, // Dùng chung

    createdBy: { type: String, default: "" },
    updatedBy: { type: String, default: "" },
    registrationImageUrl: { type: String, default: "" },
resultImageUrls: { type: [String], default: [] },
changes: [changeLogSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Case", CaseSchema);
