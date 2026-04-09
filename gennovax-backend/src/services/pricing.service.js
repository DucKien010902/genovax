import Doctor from '../models/Doctor.model.js';

export async function computePriceAndAgent({ serviceId, doctorId }) {
  if (!serviceId || !doctorId) {
    return {
      price: 0,
      listPrice: 0,
      netPrice: 0,
      agentLevel: '',
      agentTierLabel: '',
      serviceCode: '',
      serviceName: '',
    };
  }

  const doc = await Doctor.findById(doctorId).lean();
  if (!doc) {
    return {
      price: 0,
      listPrice: 0,
      netPrice: 0,
      agentLevel: '',
      agentTierLabel: '',
      serviceCode: '',
      serviceName: '',
    };
  }

  const found = (doc.servicePrices || []).find((item) => {
    if (!item?.serviceId) return false;
    return (
      String(item.serviceId) === String(serviceId) && item.isActive !== false
    );
  });

  if (!found) {
    return {
      price: 0,
      listPrice: 0,
      netPrice: 0,
      agentLevel: '',
      agentTierLabel: '',
      serviceCode: '',
      serviceName: '',
    };
  }

  return {
    price: found.netPrice ?? 0,
    listPrice: found.listPrice ?? 0,
    netPrice: found.netPrice ?? 0,
    agentLevel: '',
    agentTierLabel: doc.agentTierLabel || '',
    serviceCode: found.serviceCode || '',
    serviceName: found.name || '',
  };
}
