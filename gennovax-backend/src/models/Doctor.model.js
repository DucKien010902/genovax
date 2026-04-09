import mongoose from 'mongoose';

const DoctorServicePriceSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    serviceType: {
      type: String,
      enum: ['NIPT', 'ADN', 'HPV', 'CELL'],
      required: true,
    },
    serviceCode: { type: String, required: true, trim: true },
    name: { type: String, required: true },
    turnaroundHours: { type: Number, default: 48 },
    listPrice: { type: Number, default: 0 },
    netPrice: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { _id: false }
);

const DoctorSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, unique: true },
    phone: String,
    address: String,
    servicePrices: { type: [DoctorServicePriceSchema], default: [] },
    agentTierLabel: { type: String, required: true, unique: true },
    salesOwner: { type: String, default: '' },
    salesOwnerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    note: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Doctor', DoctorSchema);
