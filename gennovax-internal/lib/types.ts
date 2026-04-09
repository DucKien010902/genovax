export type ServiceType = "NIPT" | "ADN" | "HPV" | "CELL";

export type OptionItem = { label: string; value: string };
export type OptionsMap = Record<string, OptionItem[]>;

export type ServiceItem = {
  _id: string;
  serviceType: ServiceType;
  serviceCode: string;
  name: string;
  turnaroundHours: number;
  isActive: boolean;
  note?: string;
};

export type DoctorServicePrice = {
  serviceId: string;
  serviceType: ServiceType;
  serviceCode: string;
  name: string;
  turnaroundHours: number;
  listPrice: number;
  netPrice: number;
  isActive?: boolean;
};

export type CatalogServiceItem = {
  _id: string;
  serviceCode: string;
  name: string;
  serviceType: ServiceType;
  turnaroundHours: number;
  note?: string;
  isActive: boolean;
};

export type DoctorCatalogServiceRow = {
  serviceId: string;
  serviceCode: string;
  name: string;
  serviceType: ServiceType;
  turnaroundHours: number;
  note?: string;
  isGlobalActive: boolean;
  isConfigured: boolean;
  listPrice: number;
  netPrice: number;
};

export type DoctorItem = {
  _id: string;
  fullName: string;
  servicePrices?: DoctorServicePrice[];
  salesOwner?: string;
  salesOwnerUserId?: string | null;
  agentTierLabel?: string;
  phone?: string;
  address?: string;
  note?: string;
  isActive?: boolean;
};

export type DoctorRevenueKpis = {
  totalCases: number;
  totalRevenue: number;
  totalCost: number;
  totalNetRevenue: number;
  paidCases: number;
  paidRate: number;
  clinicCount: number;
  salesOwnerCount: number;
};

export type DoctorRevenueMonthlyPoint = {
  ym: string;
  revenue: number;
  cost: number;
  cases: number;
  paidCases: number;
  netRevenue: number;
};

export type DoctorRevenueClinicRow = {
  clinicName: string;
  salesOwner: string;
  salesOwnerCount: number;
  revenue: number;
  cost: number;
  cases: number;
  paidCases: number;
  netRevenue: number;
};

export type DoctorRevenueSalesOwnerRow = {
  salesOwner: string;
  revenue: number;
  cost: number;
  cases: number;
  paidCases: number;
  clinicCount: number;
  netRevenue: number;
};

export type DoctorRevenueAnalyticsResponse = {
  filters: {
    salesOwner: string;
    month: string;
  };
  availableSalesOwners: string[];
  availableClinics: string[];
  kpis: DoctorRevenueKpis;
  monthlyTrend: DoctorRevenueMonthlyPoint[];
  byClinic: DoctorRevenueClinicRow[];
  bySalesOwner: DoctorRevenueSalesOwnerRow[];
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
  caseCode: string;
  patientName: string;
  lab: string;
  serviceType: ServiceType;
  serviceId: string | null;
  serviceName: string;
  serviceCode: string;
  price: number;
  detailNote: string;
  source: string;
  salesOwner: string;
  sampleCollector: string;
  sentAt: string | null;
  paid: boolean;
  paymentMethod?: string;
  receivedAt: string | null;
  dueDate: string | null;
  returnedAt?: string | null;
  doctorId: string | null;
  agentLevel: string;
  agentTierLabel: string;
  collectedAmount: number;
  receivedAmount?: number;
  costPrice?: number;
  transferStatus: string;
  receiveStatus: string;
  processStatus: string;
  feedbackStatus: string;
  glReturned: boolean;
  gxReceived: boolean;
  softFileDone: boolean;
  hardFileDone: boolean;
  invoiceType?: "company" | "personal";
  invoiceName?: string;
  invoiceTaxCode?: string;
  invoiceIdCard?: string;
  invoiceIssueDate?: string;
  invoiceIssuePlace?: string;
  invoiceAddress?: string;
  createdBy: string;
  updatedBy: string;
  registrationImageUrl?: string;
  receiptImageUrl?: string;
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
