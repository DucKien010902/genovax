import dotenv from 'dotenv';
import { connectDB } from './db.js';
import Case from './models/Case.model.js';
import Service from './models/Service.model.js';
import Doctor from './models/Doctor.model.js';

dotenv.config();

const SERVICE_TYPE_MAP = {
  HPV: 'Sàng Lọc UTCTC',
  CELL: 'Sinh Hóa',
};

async function migrateModel(model, label) {
  for (const [from, to] of Object.entries(SERVICE_TYPE_MAP)) {
    const result = await model.updateMany(
      { serviceType: from },
      { $set: { serviceType: to } }
    );
    console.log(`${label}: ${from} -> ${to}: ${result.modifiedCount}`);
  }
}

async function migrateDoctorServicePrices() {
  for (const [from, to] of Object.entries(SERVICE_TYPE_MAP)) {
    const result = await Doctor.updateMany(
      { 'servicePrices.serviceType': from },
      { $set: { 'servicePrices.$[item].serviceType': to } },
      { arrayFilters: [{ 'item.serviceType': from }] }
    );
    console.log(`Doctor.servicePrices: ${from} -> ${to}: ${result.modifiedCount}`);
  }
}

async function run() {
  await connectDB(process.env.MONGO_URI);

  await migrateModel(Case, 'Case');
  await migrateModel(Service, 'Service');
  await migrateDoctorServicePrices();

  console.log('Service type migration done');
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
