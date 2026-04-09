import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema(
  {
    serviceCode: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    serviceType: {
      type: String,
      enum: ['NIPT', 'ADN', 'HPV', 'CELL'],
      required: true,
    },
    turnaroundHours: { type: Number, default: 48 },
    note: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Service', ServiceSchema);
