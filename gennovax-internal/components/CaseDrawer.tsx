"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type {
  CaseDraft,
  OptionsMap,
  ServiceItem,
  DoctorItem,
} from "@/lib/types";
import SingleDatePicker from "./DatePicker";
import { useAuth } from "@/lib/auth";
import { caseApi } from "@/lib/api";

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

function Select({
  value,
  onChange,
  items,
  placeholder,
  tone = "slate",
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  items: { label: string; value: string }[];
  placeholder?: string;
  tone?: "slate" | "blue" | "rose" | "emerald" | "sky";
  disabled?: boolean;
}) {
  const toneCls: Record<typeof tone, string> = {
    slate: "border-slate-200 focus:border-sky-300 focus:ring-sky-100",
    blue: "border-sky-200 focus:border-sky-300 focus:ring-sky-100",
    rose: "border-rose-200 focus:border-rose-300 focus:ring-rose-100",
    emerald: "border-emerald-200 focus:border-emerald-300 focus:ring-emerald-100",
    sky: "border-sky-200 focus:border-sky-300 focus:ring-sky-100",
  };

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={cn(
        "w-full rounded-2xl border bg-slate-50 px-3.5 py-2.5 text-[12px] shadow-sm outline-none transition",
        "focus:ring-4 focus:ring-offset-0",
        "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-neutral-500",
        toneCls[tone],
      )}
    >
      <option value="">{placeholder ?? "Chọn..."}</option>
      {items.map((it) => (
        <option key={it.value} value={it.value}>
          {it.label}
        </option>
      ))}
    </select>
  );
}

function fmtMoney(v: number) {
  return (v ?? 0).toLocaleString("vi-VN");
}

function nowVNISOString() {
  return new Date().toISOString();
}

function addHoursISO(iso: string, hours: number) {
  const d = new Date(iso);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

function isoDateFromISODateTime(iso?: string | null) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

function isoDateTimeFromISODate(date: string) {
  if (!date) return null;
  return new Date(`${date}T00:00:00+07:00`).toISOString();
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const isRequired = label.includes("*");

  return (
    <div className="min-w-0">
      <div className="mb-1.5 text-[11px] font-semibold  tracking-[0.14em] text-slate-400">
        {isRequired ? (
          <span className="text-sky-600">{label}</span>
        ) : (
          label
        )}
      </div>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
  tone = "slate",
  disabled = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  tone?: "slate" | "blue" | "rose" | "emerald" | "sky";
  disabled?: boolean;
}) {
  const toneCls: Record<typeof tone, string> = {
    slate: "border-slate-200 focus:border-sky-300 focus:ring-sky-100",
    blue: "border-sky-200 focus:border-sky-300 focus:ring-sky-100",
    rose: "border-rose-200 focus:border-rose-300 focus:ring-rose-100",
    emerald: "border-emerald-200 focus:border-emerald-300 focus:ring-emerald-100",
    sky: "border-sky-200 focus:border-sky-300 focus:ring-sky-100",
  };

  return (
    <input
      className={cn(
        "w-full rounded-2xl border bg-slate-50 px-3.5 py-2.5 text-[12px] shadow-sm outline-none transition",
        "focus:ring-4",
        "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-neutral-500",
        toneCls[tone],
      )}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  tone = "slate",
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  tone?: "slate" | "blue" | "rose" | "emerald" | "sky";
  rows?: number;
}) {
  const toneCls: Record<typeof tone, string> = {
    slate: "border-slate-200 focus:border-sky-300 focus:ring-sky-100",
    blue: "border-sky-200 focus:border-sky-300 focus:ring-sky-100",
    rose: "border-rose-200 focus:border-rose-300 focus:ring-rose-100",
    emerald: "border-emerald-200 focus:border-emerald-300 focus:ring-emerald-100",
    sky: "border-sky-200 focus:border-sky-300 focus:ring-sky-100",
  };

  return (
    <textarea
      rows={rows}
      className={cn(
        "w-full rounded-2xl border bg-slate-50 px-3.5 py-2.5 text-[12px] shadow-sm outline-none transition",
        "focus:ring-4",
        toneCls[tone],
      )}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

type SourceServiceOption = {
  service: ServiceItem;
  price: number;
};

function normalizeCaseData(input: CaseDraft): CaseDraft {
  const cloned = { ...input } as CaseDraft & Record<string, any>;

  if (cloned.paid && !cloned.paymentMethod) {
    cloned.paymentMethod = "Chuyển khoản";
  }

  if (!cloned.invoiceType) {
    cloned.invoiceType = "company";
  }

  if (!Array.isArray(cloned.resultImageUrls)) {
    cloned.resultImageUrls = [];
  }

  return cloned;
}

export default function CaseDrawer({
  open,
  data,
  options,
  services,
  onClose,
  doctors,
  onSave,
}: {
  open: boolean;
  data: CaseDraft | null;
  options: OptionsMap;
  services: ServiceItem[];
  onClose: () => void;
  doctors: DoctorItem[];
  onSave: (data: CaseDraft) => Promise<void>;
}) {
  const { user } = useAuth();
  const isAccountingAdmin = user?.role === "accounting_admin";

  const [form, setForm] = useState<CaseDraft | null>(data);
  const [sampleCount, setSampleCount] = useState(1);
  const [collectedAmountManual, setCollectedAmountManual] = useState(false);

  const regInputRef = useRef<HTMLInputElement | null>(null);
  const receiptInputRef = useRef<HTMLInputElement | null>(null);
  const resInputRef = useRef<HTMLInputElement | null>(null);

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  const isNewCase = !data?._id;

  const opt = useMemo(() => (k: string) => options[k] ?? [], [options]);

  const patchForm = (patch: Partial<CaseDraft>) =>
    setForm((prev) => (prev ? { ...prev, ...patch } : prev));

  useEffect(() => {
    if (!data) {
      setForm(null);
      setCollectedAmountManual(false);
      setSampleCount(1);
      return;
    }

    const normalized = normalizeCaseData(data);
    setForm(normalized);

    // Case cũ: ưu tiên dữ liệu đã có, không auto ghi đè
    if (normalized._id) {
      setCollectedAmountManual(true);
    } else {
      setCollectedAmountManual(false);
    }

    setSampleCount(1);
  }, [data]);

  const selectedDoctor = useMemo(() => {
    if (!form) return null;

    if (form.doctorId) {
      return doctors.find((d) => d._id === form.doctorId) ?? null;
    }

    if (form.source) {
      return doctors.find((d) => d.fullName === form.source) ?? null;
    }

    return null;
  }, [form, doctors]);

  const availableServicesBySource = useMemo<SourceServiceOption[]>(() => {
    if (!selectedDoctor || !form?.serviceType) return [];

    return (selectedDoctor.servicePrices || [])
      .filter((item) => item.isActive !== false)
      .filter((item) => item.serviceType === form.serviceType)
      .map((item) => ({
        service: {
          _id: String(item.serviceId),
          serviceType: item.serviceType,
          serviceCode: item.serviceCode,
          name: item.name,
          turnaroundHours: item.turnaroundHours ?? 48,
          isActive: item.isActive !== false,
        },
        price: Number(item.netPrice || 0),
      }));
  }, [selectedDoctor, form?.serviceType]);

  const selectedService = useMemo(() => {
    if (!form) return null;

    // Ưu tiên 1: tìm trong danh sách dịch vụ của nguồn hiện tại
    if (form.serviceId) {
      const byId = availableServicesBySource.find(
        ({ service }) => String(service._id) === String(form.serviceId),
      );
      if (byId) return byId.service;
    }

    if (form.serviceCode) {
      const byCode = availableServicesBySource.find(
        ({ service }) => service.serviceCode === form.serviceCode,
      );
      if (byCode) return byCode.service;
    }

    // Ưu tiên 2: dữ liệu cũ không map được vẫn phải hiển thị ra
    if (form.serviceCode || form.serviceName) {
      return {
        _id: String(form.serviceId || form.serviceCode || "legacy-service"),
        serviceType: form.serviceType,
        serviceCode: form.serviceCode || "",
        name: form.serviceName || "",
        turnaroundHours: 48,
        isActive: true,
      };
    }

    return null;
  }, [form, availableServicesBySource]);

  const suggestedPrice = useMemo(() => {
    if (!form) return 0;

    const found = availableServicesBySource.find(
      ({ service }) =>
        String(service._id) === String(form.serviceId) ||
        service.serviceCode === form.serviceCode,
    );

    return Number(found?.price || 0);
  }, [availableServicesBySource, form]);

  const serviceItemsForSelect = useMemo(() => {
    const baseItems = availableServicesBySource.map(({ service, price }) => ({
      label: `${service.serviceCode} • ${service.name} `,
      value: service.serviceCode,
    }));

    // Nếu đang mở ca cũ và mã dịch vụ cũ không còn trong source hiện tại
    // thì vẫn thêm nó vào để select hiển thị đúng value
    if (
      form?.serviceCode &&
      !baseItems.some((item) => item.value === form.serviceCode)
    ) {
      baseItems.unshift({
        label: `${form.serviceCode} • ${form.serviceName || "Dữ liệu cũ"}`,
        value: form.serviceCode,
      });
    }

    return baseItems;
  }, [availableServicesBySource, form?.serviceCode, form?.serviceName]);

  const sourceBadge =
    selectedDoctor?.fullName || form?.source || "Chưa chọn nguồn";
  const agent = {
    level: form?.agentLevel || sourceBadge,
    label: form?.agentTierLabel || selectedDoctor?.agentTierLabel || "",
  };

  // Tạo mới: chọn nguồn => tự điền NVKD + reset dịch vụ
  const handleSourceChange = (sourceName: string) => {
    const doctor = doctors.find((d) => d.fullName === sourceName) ?? null;

    patchForm({
      source: sourceName,
      doctorId: doctor?._id || null,
      salesOwner: doctor?.salesOwner || "",
      serviceCode: "",
      serviceName: "",
      serviceId: null,
      agentTierLabel: doctor?.agentTierLabel || "",
    });

    setCollectedAmountManual(false);
  };

  const handleServiceChange = (serviceCode: string) => {
    const found =
      availableServicesBySource.find(
        ({ service }) => service.serviceCode === serviceCode,
      ) ?? null;

    patchForm({
      serviceCode,
      serviceName: found?.service.name ?? "",
      serviceId: found?.service._id ?? null,
    });

    setCollectedAmountManual(false);
  };

  // Chỉ auto giá cho ca mới hoặc khi user bấm reset
  useEffect(() => {
    if (!form) return;

    if (!isNewCase) return;

    if (!selectedDoctor || !selectedService) {
      if (!collectedAmountManual && (form.collectedAmount ?? 0) !== 0) {
        patchForm({ collectedAmount: 0 });
      }
      return;
    }

    if (!collectedAmountManual) {
      const autoPrice = suggestedPrice * sampleCount;
      if ((form.collectedAmount ?? 0) !== autoPrice) {
        patchForm({ collectedAmount: autoPrice });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isNewCase,
    selectedDoctor?._id,
    selectedService?._id,
    suggestedPrice,
    sampleCount,
    collectedAmountManual,
  ]);

  useEffect(() => {
    if (!form?.receivedAt || !selectedService) return;

    const hours = selectedService.turnaroundHours ?? 48;
    const due = addHoursISO(form.receivedAt, hours);

    if (due !== form.dueDate) {
      patchForm({ dueDate: due });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form?.receivedAt, selectedService?.serviceCode]);

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "registrationImageUrl" | "receiptImageUrl" | "resultImageUrls",
    isMultiple = false,
  ) => {
    if (!form?.caseCode?.trim()) {
      alert(
        "Vui lòng nhập 'Mã ca' trước khi tải file để hệ thống tạo thư mục lưu trữ.",
      );
      e.target.value = "";
      return;
    }

    const files = Array.from(e.target.files || []);
    if (!files.length || !form) return;

    setIsUploadingImage(true);
    setImageUploadError(null);

    try {
      if (!isMultiple) {
        const res = await caseApi.uploadFile(files[0], form.caseCode);
        patchForm({ [field]: res.url } as any);
      } else {
        const current = Array.isArray((form as any).resultImageUrls)
          ? [...(form as any).resultImageUrls]
          : [];

        const remain = Math.max(0, 3 - current.length);
        if (remain <= 0) throw new Error("Chỉ được tải tối đa 3 file kết quả.");

        const picked = files.slice(0, remain);
        const uploadedUrls: string[] = [];

        for (const f of picked) {
          const res = await caseApi.uploadFile(f, form.caseCode);
          uploadedUrls.push(res.url);
        }

        patchForm({ resultImageUrls: [...current, ...uploadedUrls] } as any);
      }
    } catch (err: any) {
      setImageUploadError(
        err?.message || "Tải file lên thất bại. Vui lòng thử lại.",
      );
    } finally {
      setIsUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleRemoveFile = async (
    field: "registrationImageUrl" | "receiptImageUrl" | "resultImageUrls",
    urlToRemove: string,
    idx?: number,
  ) => {
    try {
      if (caseApi.deleteFileMinio) {
        await caseApi.deleteFileMinio(urlToRemove);
      }
    } catch (e) {
      console.warn("Không thể xóa file vật lý trên MinIO", e);
    }

    if (field === "resultImageUrls" && typeof idx === "number") {
      const current = Array.isArray((form as any)?.resultImageUrls)
        ? [...((form as any).resultImageUrls as string[])]
        : [];
      current.splice(idx, 1);
      patchForm({ resultImageUrls: current } as any);
    } else {
      patchForm({ [field]: "" } as any);
    }
  };

  if (!open || !form) return null;

  const registrationUrl = (form as any).registrationImageUrl as
    | string
    | undefined;
  const receiptUrl = (form as any).receiptImageUrl as string | undefined;
  const resultUrls = Array.isArray((form as any).resultImageUrls)
    ? ((form as any).resultImageUrls as string[])
    : [];

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={onClose} />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={cn(
            "h-[80vh] w-[90vw] overflow-hidden rounded-[32px] border border-sky-100 bg-white shadow-[0_30px_120px_-48px_rgba(14,116,144,0.42)]",
            "lg:h-[90vh] lg:w-[85vw]",
          )}
        >
          <div className="border-b border-sky-100 bg-[radial-gradient(circle_at_top_left,#e0f2fe_0,#ffffff_58%)] px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-blue-700">
                  Ca: {form.serviceType}
                </div>
                <div className="mt-0.5 truncate text-[15px] font-bold tracking-tight text-neutral-900">
                  {form.patientName || "Ca mới"}
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 ring-1 ring-emerald-200">
                    {agent.level || "Chưa xác định cấp"}
                  </span>
                  <span className="rounded-full bg-sky-50 px-2 py-0.5 font-bold text-sky-700 ring-1 ring-sky-200">
                    Giá: {fmtMoney(form.collectedAmount ?? 0)}
                  </span>
                  {form.dueDate && (
                    <span className="rounded-full bg-sky-50 px-2.5 py-1 font-bold text-sky-700 ring-1 ring-sky-200">
                      Hạn KQ:{" "}
                      {new Date(form.dueDate).toLocaleString("vi-VN", {
                        timeZone: "Asia/Ho_Chi_Minh",
                      })}
                    </span>
                  )}
                  <span className="hidden rounded-full px-2 py-0.5 font-bold text-sky-800 ring-1 ring-sky-200 lg:flex">
                    Dấu * là trường bắt buộc
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  className="cursor-pointer rounded-xl px-3 py-2 text-[12px] font-bold text-black ring-1 ring-black/10 hover:bg-neutral-50"
                  onClick={onClose}
                >
                  Đóng
                </button>
                <button
                  className="cursor-pointer rounded-xl bg-blue-600 px-3 py-2 text-[12px] font-bold text-white hover:opacity-95"
                  onClick={() => onSave(form)}
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>

          <div className="h-[calc(90vh-56px)] overflow-auto bg-[linear-gradient(180deg,#f8fbff_0%,#eef6ff_36%,#ffffff_100%)] p-4 text-black">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-11">
              <section className="rounded-[28px] bg-white p-4 ring-1 ring-sky-100 shadow-[0_18px_50px_-38px_rgba(14,116,144,0.32)] lg:col-span-2">
                <div className="mb-2 text-[12px] font-bold text-neutral-900">
                  Thông tin ca
                </div>

                <div className="space-y-3">
                  <Field label="* Mã ca">
                    <Input
                      value={form.caseCode}
                      onChange={(v) => patchForm({ caseCode: v })}
                      placeholder="Nhập mã ca"
                      tone="blue"
                    />
                  </Field>

                  <Field label="* Nguồn">
                    <Select
                      value={form.source}
                      onChange={handleSourceChange}
                      items={[
                        ...(form?.source &&
                        !doctors.some((d) => d.fullName === form.source)
                          ? [{ label: `${form.source}`, value: form.source }]
                          : []),
                        ...doctors.map((d) => ({
                          label: d.fullName,
                          value: d.fullName,
                        })),
                      ]}
                      tone="sky"
                    />
                  </Field>

                  <Field label="* NVKD phụ trách">
                    <Input
                      value={form.salesOwner || ""}
                      onChange={() => {}}
                      placeholder="Tự động theo nguồn"
                      tone="blue"
                      disabled
                    />
                  </Field>

                  <Field label="Lab">
                    <Select
                      value={form.lab}
                      onChange={(v) => patchForm({ lab: v })}
                      items={opt("labs")}
                      tone="emerald"
                    />
                  </Field>

                  <Field label="Thu mẫu">
                    <Select
                      value={form.sampleCollector}
                      onChange={(v) => patchForm({ sampleCollector: v })}
                      items={opt("sampleCollectors")}
                      tone="rose"
                    />
                  </Field>
                </div>
              </section>

              <section className="rounded-[28px] bg-white p-4 ring-1 ring-sky-100 shadow-[0_18px_50px_-38px_rgba(14,116,144,0.32)] lg:col-span-3">
                <div className="mb-2 text-[12px] font-bold text-neutral-900">
                  Khách hàng & Dịch vụ
                </div>

                <div className="space-y-3">
                  <Field label="* Họ và tên">
                    <Input
                      value={form.patientName}
                      onChange={(v) => patchForm({ patientName: v })}
                      placeholder="Nhập tên khách hàng"
                      tone="rose"
                    />
                  </Field>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="* Dịch vụ (mã)">
                      <Select
                        value={form.serviceCode}
                        onChange={handleServiceChange}
                        items={serviceItemsForSelect}
                        placeholder={
                          form.source
                            ? "Chọn dịch vụ theo nguồn..."
                            : "Chọn nguồn trước..."
                        }
                        tone="emerald"
                      />
                    </Field>

                    <Field label="Tên dịch vụ">
                      <div className="rounded-2xl border border-sky-100 bg-sky-50/40 px-3.5 py-2.5 text-[12px] shadow-sm">
                        <div className="font-semibold text-neutral-900">
                          {form.serviceName || "—"}
                        </div>
                      </div>
                    </Field>
                  </div>

                  <Field label="* Tài chính">
                    <div className="rounded-[24px] border border-sky-100 bg-sky-100 p-4">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div className="text-[11px] font-semibold text-emerald-700">
                          Thông tin doanh thu {isAccountingAdmin && "& Giá vốn"}
                        </div>
                        <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-sky-700 ring-1 ring-sky-100">
                          {collectedAmountManual ? "chỉnh tay" : "tự động"}
                        </span>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="rounded-[20px] bg-white p-3 ring-1 ring-sky-100">
                          <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                            <div className="text-[11px] font-semibold text-neutral-500">
                              Tiền thu
                            </div>

                            <div className="flex items-center gap-2">
                              {isNewCase && (
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] text-neutral-500">
                                    SL mẫu:
                                  </span>
                                  <input
                                    type="number"
                                    min={1}
                                    value={sampleCount}
                                    onChange={(e) => {
                                      const val = Math.max(
                                        1,
                                        parseInt(e.target.value) || 1,
                                      );
                                      setSampleCount(val);
                                      setCollectedAmountManual(false);
                                    }}
                                    className="w-12 rounded-lg border border-sky-200 bg-sky-50 px-1 py-0.5 text-center text-[11px] outline-none focus:ring-2 focus:ring-sky-100"
                                  />
                                </div>
                              )}

                              <button
                                type="button"
                                className="rounded-lg bg-sky-50 px-2.5 py-1 text-[11px] font-bold text-sky-700 ring-1 ring-sky-200 hover:bg-sky-100"
                                onClick={() => {
                                  patchForm({
                                    collectedAmount:
                                      suggestedPrice * sampleCount,
                                  });
                                  setCollectedAmountManual(false);
                                }}
                              >
                                Reset
                              </button>
                            </div>
                          </div>

                          <Input
                            value={String(form.collectedAmount ?? 0)}
                            onChange={(v) => {
                              const n =
                                Number(String(v).replace(/[^\d]/g, "")) || 0;
                              patchForm({ collectedAmount: n });
                              setCollectedAmountManual(true);
                            }}
                            tone="emerald"
                          />
                          <div className="mt-1 text-[13px] font-bold text-emerald-700">
                            {fmtMoney(form.collectedAmount ?? 0)}
                          </div>
                        </div>

                        {isAccountingAdmin && (
                          <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-[20px] bg-sky-50/60 p-3 ring-1 ring-sky-100">
                              <div className="mb-2 text-[11px] font-semibold text-indigo-700">
                                Tiền đã nhận
                              </div>
                              <Input
                                value={String(
                                  (form as any).receivedAmount ?? 0,
                                )}
                                onChange={(v) => {
                                  const n =
                                    Number(String(v).replace(/[^\d]/g, "")) ||
                                    0;
                                  patchForm({ receivedAmount: n } as any);
                                }}
                                placeholder="Nhập số tiền..."
                                tone="blue"
                              />
                              <div className="mt-1 text-[13px] font-bold text-sky-700">
                                {fmtMoney((form as any).receivedAmount ?? 0)}
                              </div>
                            </div>

                            <div className="rounded-xl bg-rose-50/50 p-3 ring-1 ring-rose-200/50">
                              <div className="mb-2 text-[11px] font-semibold text-rose-700">
                                Giá xuất vốn (Cost)
                              </div>
                              <Input
                                value={String((form as any).costPrice ?? 0)}
                                onChange={(v) => {
                                  const n =
                                    Number(String(v).replace(/[^\d]/g, "")) ||
                                    0;
                                  patchForm({ costPrice: n } as any);
                                }}
                                placeholder="Nhập giá vốn..."
                                tone="rose"
                              />
                              <div className="mt-1 text-[13px] font-bold text-rose-700">
                                {fmtMoney((form as any).costPrice ?? 0)}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Field>

                  <Field label="Thông tin chi tiết thêm">
                    <Textarea
                      value={form.detailNote}
                      onChange={(v) => patchForm({ detailNote: v })}
                      placeholder="Ghi chú..."
                      rows={3}
                      tone="slate"
                    />
                  </Field>
                </div>
              </section>

              <section className="rounded-[28px] bg-white p-4 ring-1 ring-sky-100 shadow-[0_18px_50px_-38px_rgba(14,116,144,0.32)] lg:col-span-3">
                <div className="mb-2 text-[12px] font-bold text-neutral-900">
                  Luồng xử lý
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="* Mức chuyển lab">
                      <Select
                        value={form.transferStatus}
                        onChange={(v) => patchForm({ transferStatus: v })}
                        items={opt("transferStatus")}
                        tone="sky"
                      />
                    </Field>

                    <Field label="* Tiếp nhận mẫu">
                      <Select
                        value={form.receiveStatus}
                        onChange={(v) => patchForm({ receiveStatus: v })}
                        items={opt("receiveStatus")}
                        tone="emerald"
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="* Xử lý mẫu">
                      <Select
                        value={form.processStatus}
                        onChange={(v) => patchForm({ processStatus: v })}
                        items={opt("processStatus")}
                        tone="slate"
                      />
                    </Field>

                    <Field label="Phản hồi">
                      <Select
                        value={form.feedbackStatus}
                        onChange={(v) => patchForm({ feedbackStatus: v })}
                        items={opt("feedbackStatus")}
                        tone="rose"
                      />
                    </Field>
                  </div>

                  <Field label="* Ngày nhận">
                    <div className="grid grid-cols-2 gap-2">
                      <SingleDatePicker
                        value={isoDateFromISODateTime((form as any).receivedAt)}
                        onChange={(d) =>
                          patchForm({
                            receivedAt: isoDateTimeFromISODate(d) as any,
                          })
                        }
                        placeholder="Chọn ngày..."
                        disabled={false}
                        popoverWidth="lg"
                        months={1}
                        buttonClassName="w-full rounded-2xl border border-sky-200 bg-sky-50 px-3 py-2.5 text-left text-[12px] shadow-sm"
                      />

                      <button
                        type="button"
                        className={cn(
                          "w-full rounded-2xl bg-sky-50 px-3 py-2.5 text-[12px] font-bold text-sky-700 ring-1 ring-sky-200 shadow-sm hover:bg-sky-100",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-100",
                        )}
                        onClick={() => {
                          const ok = window.confirm(
                            "Xác nhận lấy thời điểm hiện tại làm 'Ngày nhận'?",
                          );
                          if (!ok) return;
                          patchForm({ receivedAt: nowVNISOString() as any });
                        }}
                        title="Lấy thời điểm hiện tại"
                      >
                        Lấy thời điểm hiện tại
                      </button>
                    </div>
                  </Field>

                  <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="flex flex-col justify-center rounded-[20px] bg-[linear-gradient(135deg,#f8fbff_0%,#e0f2fe_100%)] p-3 ring-1 ring-sky-100">
                      <div className="text-[11px] font-semibold text-neutral-500">
                        Ngày trả KQ (Dự kiến)
                      </div>
                      <div className="mt-1 text-[12px] font-bold text-blue-900">
                        {(form as any).dueDate
                          ? new Date((form as any).dueDate).toLocaleString(
                              "vi-VN",
                              {
                                timeZone: "Asia/Ho_Chi_Minh",
                              },
                            )
                          : "—"}
                      </div>
                    </div>

                    <Field label="Ngày trả KQ (Thực tế)">
                      <div className="grid grid-cols-1 gap-2">
                        <SingleDatePicker
                          value={isoDateFromISODateTime(
                            (form as any).returnedAt,
                          )}
                          onChange={(d) =>
                            patchForm({
                              returnedAt: isoDateTimeFromISODate(d) as any,
                            })
                          }
                          placeholder="Chọn ngày..."
                          disabled={false}
                          popoverWidth="lg"
                          months={1}
                        buttonClassName="w-full rounded-2xl border border-sky-200 bg-sky-50 px-3 py-2.5 text-left text-[12px] shadow-sm"
                        />
                      </div>
                    </Field>
                  </div>

                  <div className="mt-2 rounded-[24px] bg-white p-4 ring-1 ring-sky-100">
                    <div className="mb-2 text-[12px] font-bold text-neutral-900">
                      Trạng thái trả file & Thanh toán
                    </div>

                    <div className="space-y-2">
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <label className="cursor-pointer rounded-2xl border border-sky-100 bg-sky-50/40 px-3 py-2.5 text-[12px] shadow-sm">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={!!(form as any).paid}
                              onChange={(e) => {
                                const isPaid = e.target.checked;
                                patchForm({
                                  paid: isPaid,
                                  paymentMethod: isPaid
                                    ? (form as any).paymentMethod ||
                                      "Chuyển khoản"
                                    : "Chuyển khoản",
                                } as any);
                              }}
                            />
                            <span
                              className={cn(
                                "font-bold",
                                (form as any).paid
                                  ? "text-sky-700"
                                  : "text-slate-700",
                              )}
                            >
                              Đã thanh toán
                            </span>
                          </div>
                        </label>

                        {(form as any).paid ? (
                          <div className="h-full">
                            <Select
                              value={
                                (form as any).paymentMethod || "Chuyển khoản"
                              }
                              onChange={(v) =>
                                patchForm({ paymentMethod: v } as any)
                              }
                              items={[
                                {
                                  label: "Chuyển khoản",
                                  value: "Chuyển khoản",
                                },
                                { label: "Tiền mặt", value: "Tiền mặt" },
                              ]}
                              tone="blue"
                            />
                          </div>
                        ) : (
                          <div className="hidden md:block" />
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-sky-100 bg-sky-50/40 px-3 py-2.5 text-[12px] shadow-sm">
                          <input
                            type="checkbox"
                            checked={!!(form as any).glReturned}
                            onChange={(e) =>
                              patchForm({ glReturned: e.target.checked } as any)
                            }
                          />
                          GL trả
                        </label>

                        <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-sky-100 bg-sky-50/40 px-3 py-2.5 text-[12px] shadow-sm">
                          <input
                            type="checkbox"
                            checked={!!(form as any).gxReceived}
                            onChange={(e) =>
                              patchForm({ gxReceived: e.target.checked } as any)
                            }
                          />
                          GX nhận
                        </label>
                      </div>

                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-sky-100 bg-sky-50/40 px-3 py-2.5 text-[12px] shadow-sm">
                          <input
                            type="checkbox"
                            checked={!!(form as any).softFileDone}
                            onChange={(e) =>
                              patchForm({
                                softFileDone: e.target.checked,
                              } as any)
                            }
                          />
                          Trả file mềm
                        </label>

                        <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-sky-100 bg-sky-50/40 px-3 py-2.5 text-[12px] shadow-sm">
                          <input
                            type="checkbox"
                            checked={!!(form as any).hardFileDone}
                            onChange={(e) =>
                              patchForm({
                                hardFileDone: e.target.checked,
                              } as any)
                            }
                          />
                          Trả file cứng
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] bg-white p-4 ring-1 ring-sky-100 shadow-[0_18px_50px_-38px_rgba(14,116,144,0.32)] lg:col-span-3">
                <div className="mb-2 text-[12px] font-bold text-neutral-900">
                  Hồ sơ ảnh & Hóa đơn
                </div>

                <div className="space-y-4">
                  <div className="rounded-[24px] bg-sky-50/45 p-4 ring-1 ring-sky-100">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-[12px] font-bold text-neutral-900">
                        Thông tin xuất hóa đơn
                      </div>

                      <div className="flex items-center gap-1 rounded-xl bg-white/90 p-1 ring-1 ring-sky-100">
                        <button
                          type="button"
                          onClick={() =>
                            patchForm({ invoiceType: "company" } as any)
                          }
                          className={cn(
                            "rounded-md px-3 py-1 text-[11px] font-bold transition-all",
                            (form as any).invoiceType !== "personal"
                              ? "bg-sky-50 text-sky-700 shadow-sm"
                              : "text-neutral-500 hover:text-neutral-700",
                          )}
                        >
                          Công ty
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            patchForm({ invoiceType: "personal" } as any)
                          }
                          className={cn(
                            "rounded-md px-3 py-1 text-[11px] font-bold transition-all",
                            (form as any).invoiceType === "personal"
                              ? "bg-sky-50 text-sky-700 shadow-sm"
                              : "text-neutral-500 hover:text-neutral-700",
                          )}
                        >
                          Cá nhân
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 rounded-xl bg-sky-100/95 p-3 ring-1 ring-sky-200">
                      {(form as any).invoiceType === "personal" ? (
                        <>
                          <Field label="Họ tên người nhận">
                            <Input
                              value={(form as any).invoiceName ?? ""}
                              onChange={(v) =>
                                patchForm({ invoiceName: v } as any)
                              }
                              placeholder="Nhập họ tên..."
                              tone="sky"
                            />
                          </Field>

                          <div className="grid grid-cols-2 gap-2">
                            <Field label="Số CCCD/CMND">
                              <Input
                                value={(form as any).invoiceIdCard ?? ""}
                                onChange={(v) =>
                                  patchForm({ invoiceIdCard: v } as any)
                                }
                                placeholder="Nhập số CCCD..."
                                tone="sky"
                              />
                            </Field>

                            <Field label="Ngày cấp">
                              <Input
                                value={(form as any).invoiceIssueDate ?? ""}
                                onChange={(v) =>
                                  patchForm({ invoiceIssueDate: v } as any)
                                }
                                placeholder="DD/MM/YYYY"
                                tone="sky"
                              />
                            </Field>
                          </div>

                          <Field label="Nơi cấp">
                            <Input
                              value={(form as any).invoiceIssuePlace ?? ""}
                              onChange={(v) =>
                                patchForm({ invoiceIssuePlace: v } as any)
                              }
                              placeholder="Nhập nơi cấp CCCD..."
                              tone="sky"
                            />
                          </Field>

                          <Field label="Địa chỉ">
                            <Textarea
                              value={(form as any).invoiceAddress ?? ""}
                              onChange={(v) =>
                                patchForm({ invoiceAddress: v } as any)
                              }
                              placeholder="Nhập địa chỉ..."
                              rows={2}
                              tone="sky"
                            />
                          </Field>
                        </>
                      ) : (
                        <>
                          <Field label="Tên công ty / Đơn vị">
                            <Input
                              value={(form as any).invoiceName ?? ""}
                              onChange={(v) =>
                                patchForm({ invoiceName: v } as any)
                              }
                              placeholder="Nhập tên đơn vị..."
                              tone="sky"
                            />
                          </Field>

                          <Field label="Mã số thuế">
                            <Input
                              value={(form as any).invoiceTaxCode ?? ""}
                              onChange={(v) =>
                                patchForm({ invoiceTaxCode: v } as any)
                              }
                              placeholder="Nhập MST..."
                              tone="sky"
                            />
                          </Field>

                          <Field label="Địa chỉ">
                            <Textarea
                              value={(form as any).invoiceAddress ?? ""}
                              onChange={(v) =>
                                patchForm({ invoiceAddress: v } as any)
                              }
                              placeholder="Nhập địa chỉ..."
                              rows={2}
                              tone="sky"
                            />
                          </Field>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[24px] bg-white p-4 ring-1 ring-sky-100">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-[12px] font-bold text-neutral-900">
                        Tài liệu đính kèm
                      </div>
                    </div>

                    {imageUploadError && (
                      <div className="mb-3 rounded-xl bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-700 ring-1 ring-rose-200">
                        {imageUploadError}
                      </div>
                    )}

                    <input
                      ref={regInputRef}
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, "registrationImageUrl")
                      }
                    />
                    <input
                      ref={receiptInputRef}
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "receiptImageUrl")}
                    />
                    <input
                      ref={resInputRef}
                      type="file"
                      accept="image/*,application/pdf"
                      multiple
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, "resultImageUrls", true)
                      }
                    />

                    <div className="space-y-4">
                      <div>
                        <div className="mb-1.5 text-[11px] font-semibold text-neutral-500">
                          1. Ảnh đơn đăng ký
                        </div>
                        {registrationUrl ? (
                          <div className="flex items-center justify-between rounded-2xl bg-sky-50/50 p-2.5 ring-1 ring-sky-100">
                            <a
                              href={registrationUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="max-w-[150px] truncate text-[11px] text-blue-600 hover:underline"
                            >
                              Xem file đính kèm
                            </a>
                            <button
                              type="button"
                              disabled={isUploadingImage}
                              onClick={() =>
                                handleRemoveFile(
                                  "registrationImageUrl",
                                  registrationUrl,
                                )
                              }
                              className="rounded-lg bg-rose-100 px-2 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-200"
                            >
                              Xóa
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={isUploadingImage}
                            onClick={() => regInputRef.current?.click()}
                            className="flex w-full justify-center rounded-2xl border border-dashed border-sky-200 bg-sky-50 py-3 text-[11px] font-bold text-sky-700 ring-1 ring-sky-100 hover:bg-sky-100"
                          >
                            + Tải file lên
                          </button>
                        )}
                      </div>

                      <div>
                        <div className="mb-1.5 text-[11px] font-semibold text-neutral-500">
                          2. Ảnh CK / Tiền mặt
                        </div>
                        {receiptUrl ? (
                          <div className="flex items-center justify-between rounded-2xl bg-sky-50/50 p-2.5 ring-1 ring-sky-100">
                            <a
                              href={receiptUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="max-w-[150px] truncate text-[11px] text-blue-600 hover:underline"
                            >
                              Xem biên lai
                            </a>
                            <button
                              type="button"
                              disabled={isUploadingImage}
                              onClick={() =>
                                handleRemoveFile("receiptImageUrl", receiptUrl)
                              }
                              className="rounded-lg bg-rose-100 px-2 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-200"
                            >
                              Xóa
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={isUploadingImage}
                            onClick={() => receiptInputRef.current?.click()}
                            className="flex w-full justify-center rounded-2xl border border-dashed border-sky-200 bg-sky-50 py-3 text-[11px] font-bold text-sky-700 ring-1 ring-sky-100 hover:bg-sky-100"
                          >
                            + Tải hóa đơn
                          </button>
                        )}
                      </div>

                      <div>
                        <div className="mb-1.5 flex justify-between text-[11px] font-semibold text-neutral-500">
                          <span>3. File trả kết quả</span>
                          <span>{resultUrls.length}/3</span>
                        </div>

                        <div className="space-y-2">
                          {resultUrls.map((url, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between rounded-2xl bg-sky-50/50 p-2.5 ring-1 ring-sky-100"
                            >
                              <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="max-w-[150px] truncate text-[11px] text-blue-600 hover:underline"
                              >
                                File KQ {idx + 1}
                              </a>
                              <button
                                type="button"
                                disabled={isUploadingImage}
                                onClick={() =>
                                  handleRemoveFile("resultImageUrls", url, idx)
                                }
                                className="rounded-lg bg-rose-100 px-2 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-200"
                              >
                                Xóa
                              </button>
                            </div>
                          ))}

                          {resultUrls.length < 3 && (
                            <button
                              type="button"
                              disabled={isUploadingImage}
                              onClick={() => resInputRef.current?.click()}
                              className="w-full rounded-xl border border-dashed bg-indigo-50 py-2.5 text-[11px] font-bold text-indigo-600 ring-1 ring-indigo-200 hover:bg-indigo-100"
                            >
                              + Thêm File KQ
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
