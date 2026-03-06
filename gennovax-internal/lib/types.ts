export type ServiceType = "NIPT" | "ADN" | "HPV" | "CELL";

export type OptionItem = { label: string; value: string };
export type OptionsMap = Record<string, OptionItem[]>;

// ✅ thêm type service để FE tính giá
export type PriceByLevel = { level: string; price: number };
export type ServiceItem = {
  _id: string;
  serviceType: ServiceType;
  serviceCode: string;
  name: string;
  turnaroundHours: number;
  pricesByLevel: PriceByLevel[];
  isActive: boolean;
};

export type DoctorItem = {
  _id: string;
  fullName: string;
  agentLevel: string; // cap1/cap2/cap3
  salesOwner?: string; // ✅ Thêm vào đây
  agentTierLabel?: string;
};
export type ChangeLog = {
  name: string;
  email: string;
  action: string;
  changedAt: string;
};
export type CaseRecord = {
  _id: string;

  stt: number;
  date: string;

  invoiceRequested: boolean;
  caseCode: string;
  patientName: string;

  lab: string;
  serviceType: ServiceType;

  // ✅ thêm để tính giá theo service
  serviceId: string | null; // link Service
  serviceName: string;
  serviceCode: string;

  // ✅ GIÁ (tính tự động trên FE)
  price: number;

  detailNote: string;

  source: string;
  salesOwner: string;
  sampleCollector: string;

  sentAt: string | null;
  paid: boolean;
  receivedAt: string | null;
  dueDate: string | null;

  doctorId: string | null;
  agentLevel: string;
  agentTierLabel: string;

  collectedAmount: number;
  costPrice?: number;

  transferStatus: string;
  receiveStatus: string;
  processStatus: string;
  feedbackStatus: string;

  glReturned: boolean;
  gxReceived: boolean;
  softFileDone: boolean;
  hardFileDone: boolean;

  // ✅ CẬP NHẬT THÔNG TIN HÓA ĐƠN
  invoiceInfo?: string; // Vẫn có thể giữ lại nếu DB cũ còn dữ liệu, nên để optional
  invoiceName?: string; // Tên đơn vị / công ty
  invoiceTaxCode?: string; // Mã số thuế
  invoiceAddress?: string; // Địa chỉ xuất HĐ

  createdBy: string;
  updatedBy: string;
  registrationImageUrl?: string;
  resultImageUrls?: string[];
  changes?: ChangeLog[];
};

export type CaseDraft = Omit<CaseRecord, "_id"> & {
  _id?: string;
  isDraft?: boolean;
};

export type Paginated<T> = {
  items: T[];
  total: number;
};