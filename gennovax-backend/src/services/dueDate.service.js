import Doctor from '../models/Doctor.model.js';

export async function computeDueDate({ doctorId, serviceId, receivedAt }) {
  if (!doctorId || !serviceId || !receivedAt) return null;

  const doc = await Doctor.findById(doctorId).lean();
  if (!doc) return null;

  const service = (doc.servicePrices || []).find((item) => {
    if (!item?.serviceId) return false;
    return (
      String(item.serviceId) === String(serviceId) && item.isActive !== false
    );
  });
  if (!service) return null;

  const hours = service.turnaroundHours ?? 48;
  const d = new Date(receivedAt);
  d.setHours(d.getHours() + hours);
  return d;
}
