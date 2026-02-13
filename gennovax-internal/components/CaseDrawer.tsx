"use client";

import axios from "axios";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CaseDraft, OptionsMap, ServiceItem } from "@/lib/types";
import SingleDatePicker from "./DatePicker";

/** ✅ FE map nguồn -> cấp đại lý (không đụng DB) */
const SOURCE_TO_AGENT: Record<
  string,
  { level: "cap1" | "cap2" | "cap3" | "ctv"; label: string }
> = {
  "CTV Xinh": { level: "cap3", label: "Cấp 3" },
  "PK Âu Cơ": { level: "ctv", label: "CTV" },
  "CTV Huyền": { level: "cap1", label: "Cấp 1" },
  "Huyền - BVDK ngã 4 Hồ": { level: "cap1", label: "Cấp 1" },
  "PKĐK AGAPE": { level: "cap2", label: "Cấp 2" },
  "BS Thoa": { level: "ctv", label: "CTV" },
  "PK Phong Dương": { level: "ctv", label: "CTV" },
  "CTV Vân": { level: "ctv", label: "CTV" },
  "PK SPK Minh Hòa": { level: "cap1", label: "Cấp 1" },
  "BS Hậu - PK SPK Mẹ và Bé": { level: "ctv", label: "CTV" },
  "Golab Hải Phòng": { level: "cap3", label: "Cấp 3" },
  "PK Mỹ Lộc": { level: "cap3", label: "Cấp 3" },
  "CTV Lý": { level: "cap3", label: "Cấp 3" },
  "Golab Quảng Bình": { level: "cap2", label: "Cấp 2" },
  "CTV Tú - Vũng Tàu": { level: "cap2", label: "Cấp 2" },
  "Golab Thanh Hoá": { level: "cap1", label: "Cấp 1" },
  "Golab Hà Tĩnh": { level: "cap2", label: "Cấp 2" },
  "CTV Thảo": { level: "cap1", label: "Cấp 1" },
};

/** ✅ FE map nguồn -> NVKD phụ trách (từ ảnh bạn gửi) */
const SOURCE_TO_SALES_OWNER: Record<string, string> = {
  // Luận
  "CTV Lý": "Luận",
  "PKĐK AGAPE": "Luận",
  "BS Hậu - PK SPK Mẹ và Bé": "Luận",
  "CTV Xinh": "Luận",
  "PK Âu Cơ": "Luận",
  "Huyền - BVDK ngã 4 Hồ": "Luận",
  "Golab Hải Phòng": "Luận",
  "PK SPK Minh Hòa": "Luận",

  // Phong
  "BS Thoa": "Phong",
  "PK Phong Dương": "Phong",

  // Thảo
  QC: "Thảo",

  // Liêm
  "PK Mỹ Lộc": "Liêm",
  "CTV Ngoài": "Liêm",
  "Golab Quảng Bình": "Liêm",
  "CTV Tú - Vũng Tàu": "Liêm",
  "CTV Vân": "Liêm",
  "Golab Thanh Hoá": "Liêm",
  "Golab Hà Tĩnh": "Liêm",
  "CTV Thảo": "Liêm",
};

// ✅ Cloudinary (unsigned upload)
const CLOUDINARY_CLOUD_NAME = "da6f4dmql";
const CLOUDINARY_UPLOAD_PRESET = "GX-internal_unsigned_upload";

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

function Select({
  value,
  onChange,
  items,
  placeholder,
  tone = "slate",
}: {
  value: string;
  onChange: (v: string) => void;
  items: { label: string; value: string }[];
  placeholder?: string;
  tone?: "slate" | "blue" | "rose" | "emerald" | "amber";
}) {
  const toneCls: Record<typeof tone, string> = {
    slate: "border-black/10 focus:ring-slate-200",
    blue: "border-blue-200 focus:ring-blue-200",
    rose: "border-rose-200 focus:ring-rose-200",
    emerald: "border-emerald-200 focus:ring-emerald-200",
    amber: "border-amber-200 focus:ring-amber-200",
  };

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full rounded-xl border bg-white px-3 py-2 text-[12px] shadow-sm outline-none",
        "focus:ring-4 focus:ring-offset-0",
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
  // ✅ đúng: thời điểm hiện tại luôn là UTC ISO
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
    // YYYY-MM-DD theo giờ VN
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
  // 00:00 theo giờ VN -> ISO UTC
  return new Date(`${date}T00:00:00+07:00`).toISOString();
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="mb-1 text-[11px] font-semibold text-neutral-500">
        {label}
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
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  tone?: "slate" | "blue" | "rose" | "emerald" | "amber";
}) {
  const toneCls: Record<typeof tone, string> = {
    slate: "focus:ring-slate-200",
    blue: "focus:ring-blue-200",
    rose: "focus:ring-rose-200",
    emerald: "focus:ring-emerald-200",
    amber: "focus:ring-amber-200",
  };
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-[12px] shadow-sm outline-none",
        "focus:ring-4",
        toneCls[tone],
      )}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
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
  tone?: "slate" | "blue" | "rose" | "emerald" | "amber";
  rows?: number;
}) {
  const toneCls: Record<typeof tone, string> = {
    slate: "focus:ring-slate-200",
    blue: "focus:ring-blue-200",
    rose: "focus:ring-rose-200",
    emerald: "focus:ring-emerald-200",
    amber: "focus:ring-amber-200",
  };
  return (
    <textarea
      rows={rows}
      className={cn(
        "w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-[12px] shadow-sm outline-none",
        "focus:ring-4",
        toneCls[tone],
      )}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

export default function CaseDrawer({
  open,
  data,
  options,
  services,
  onClose,
  onSave,
}: {
  open: boolean;
  data: CaseDraft | null;
  options: OptionsMap;
  services: ServiceItem[];
  onClose: () => void;
  onSave: (data: CaseDraft) => Promise<void>;
}) {
  const [form, setForm] = useState<CaseDraft | null>(data);

  useEffect(() => setForm(data), [data]);

  const opt = useMemo(() => (k: string) => options[k] ?? [], [options]);

  const set = (patch: Partial<CaseDraft>) =>
    setForm((prev) => (prev ? { ...prev, ...patch } : prev));

  const [collectedAmountManual, setCollectedAmountManual] = useState(false);

  // ===== selected service =====
  const selectedService = useMemo(() => {
    if (!form) return null;
    if (form.serviceCode) {
      return services.find((s) => s.serviceCode === form.serviceCode) ?? null;
    }
    return null;
  }, [form, services]);

  // ===== derived agent from source mapping =====
  const agent = useMemo(() => {
    if (!form) return { level: "", label: "" };
    return SOURCE_TO_AGENT[form.source] ?? { level: "", label: "" };
  }, [form?.source]);
  const suggestedPrice = useMemo(() => {
    if (!selectedService || !agent.level) return 0;
    const found = (selectedService.pricesByLevel || []).find(
      (p) => p.level === agent.level,
    );
    return found?.price ?? 0;
  }, [selectedService?.serviceCode, agent.level]);
  // ===== compute price realtime -> set collectedAmount =====
  useEffect(() => {
    if (!form) return;
    if (!selectedService || !agent.level) {
      if (!collectedAmountManual && (form.collectedAmount ?? 0) !== 0)
        set({ collectedAmount: 0 });
      return;
    }
    if (
      !collectedAmountManual &&
      (form.collectedAmount ?? 0) !== suggestedPrice
    ) {
      set({ collectedAmount: suggestedPrice });
    }
  }, [
    selectedService?.serviceCode,
    agent.level,
    suggestedPrice,
    collectedAmountManual,
  ]);
  // ===== compute due date realtime =====
  useEffect(() => {
    if (!form) return;
    if (!selectedService || !form.receivedAt) return;

    const hours = selectedService.turnaroundHours ?? 48;
    const due = addHoursISO(form.receivedAt, hours);

    if (due !== form.dueDate) set({ dueDate: due });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedService?.serviceCode, form?.receivedAt, form?.dueDate]);
  // ===== suggested price (auto) =====

  // =========================
  // ✅ UPLOAD IMAGE (Cloudinary)
  // - 1 ảnh đơn đăng ký: registrationImageUrl
  // - tối đa 2 ảnh kết quả: resultImageUrls (=> tổng tối đa 3 ảnh)
  // =========================
  const regInputRef = useRef<HTMLInputElement | null>(null);
  const resInputRef = useRef<HTMLInputElement | null>(null);

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  const uploadToCloudinary = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      throw new Error("File không hợp lệ. Vui lòng chọn ảnh.");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
    );

    const url = String(response.data.secure_url || "");
    if (!url) throw new Error("Upload xong nhưng không lấy được URL.");
    return url;
  }, []);

  const handleUploadRegistration = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !form) return;

      setIsUploadingImage(true);
      setImageUploadError(null);

      try {
        const url = await uploadToCloudinary(file);
        set({ registrationImageUrl: url });
      } catch (err: any) {
        setImageUploadError(
          err?.message || "Tải ảnh lên thất bại. Vui lòng thử lại.",
        );
      } finally {
        setIsUploadingImage(false);
        e.target.value = "";
      }
    },
    [form, set, uploadToCloudinary],
  );

  const handleUploadResults = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (!files.length || !form) return;

      setIsUploadingImage(true);
      setImageUploadError(null);

      try {
        const current = Array.isArray((form as any).resultImageUrls)
          ? ((form as any).resultImageUrls as string[])
          : [];

        const remain = Math.max(0, 2 - current.length);
        if (remain <= 0) {
          throw new Error(
            "Ảnh kết quả tối đa 2 ảnh. Hãy xoá bớt nếu muốn tải thêm.",
          );
        }

        const picked = files.slice(0, remain);

        const uploaded: string[] = [];
        for (const f of picked) {
          const url = await uploadToCloudinary(f);
          uploaded.push(url);
        }

        set({ resultImageUrls: [...current, ...uploaded] as any });
      } catch (err: any) {
        setImageUploadError(
          err?.message || "Tải ảnh lên thất bại. Vui lòng thử lại.",
        );
      } finally {
        setIsUploadingImage(false);
        e.target.value = "";
      }
    },
    [form, set, uploadToCloudinary],
  );

  const removeRegistration = useCallback(() => {
    set({ registrationImageUrl: "" });
  }, [set]);

  const removeResultAt = useCallback(
    (idx: number) => {
      if (!form) return;
      const current = Array.isArray((form as any).resultImageUrls)
        ? ([...(form as any).resultImageUrls] as string[])
        : [];
      current.splice(idx, 1);
      set({ resultImageUrls: current as any });
    },
    [form, set],
  );

  if (!open || !form) return null;

  const serviceItemsForSelect = services
    .filter((s) => s.serviceType === form.serviceType && s.isActive)
    .map((s) => ({
      label: `${s.serviceCode} — ${s.name}`,
      value: s.serviceCode,
    }));

  const registrationUrl = (form as any).registrationImageUrl as
    | string
    | undefined;
  const resultUrls = (
    Array.isArray((form as any).resultImageUrls)
      ? ((form as any).resultImageUrls as string[])
      : []
  ) as string[];

  return (
    <div className="fixed inset-0 z-50 text-red">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/35" onClick={onClose} />

      {/* modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={cn(
            "w-[70vw] h-[90vh] rounded-3xl bg-white shadow-2xl ring-1 ring-black/10",
            "overflow-hidden",
          )}
        >
          {/* Header */}
          <div className="border-b bg-gradient-to-r from-blue-50 via-white to-rose-50 px-4 py-3">
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
                    {agent.label || "Chưa xác định cấp"}
                  </span>
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 font-bold text-amber-800 ring-1 ring-amber-200">
                    Giá: {fmtMoney(form.collectedAmount ?? 0)}
                  </span>
                  {form.dueDate && (
                    <span className="rounded-full bg-slate-50 px-2 py-0.5 font-bold text-slate-700 ring-1 ring-black/5">
                      Hạn KQ: {new Date(form.dueDate).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {/* ✅ hidden inputs */}
                <input
                  ref={regInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadRegistration}
                />
                <input
                  ref={resInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleUploadResults}
                />

                {/* <button
                  type="button"
                  className="rounded-xl bg-white px-3 py-2 text-[12px] font-bold ring-1 ring-black/10 hover:bg-neutral-50 disabled:opacity-60"
                  onClick={() => regInputRef.current?.click()}
                  title="Tải ảnh đơn đăng ký (1 ảnh)"
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? "Đang tải..." : "Tải ảnh"}
                </button>

                <button
                  type="button"
                  className="rounded-xl bg-white px-3 py-2 text-[12px] font-bold ring-1 ring-black/10 hover:bg-neutral-50 disabled:opacity-60"
                  onClick={() => resInputRef.current?.click()}
                  title="Tải ảnh kết quả (tối đa 2 ảnh)"
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? "Đang tải..." : "Tải file"}
                </button> */}

                <button
                  className="rounded-xl px-3 py-2 text-[12px] font-bold ring-1 ring-black/10 hover:bg-neutral-50"
                  onClick={onClose}
                >
                  Đóng
                </button>
                <button
                  className="rounded-xl bg-neutral-900 px-3 py-2 text-[12px] font-bold text-white hover:opacity-95"
                  onClick={() => onSave(form)}
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="h-[calc(90vh-56px)] overflow-auto p-4 text-black">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* Cột 1 */}
              <section className="rounded-2xl bg-white p-3 ring-1 ring-black/5">
                <div className="mb-2 text-[12px] font-bold text-neutral-900">
                  Thông tin ca
                </div>

                <div className="space-y-3">
                  <Field label="Mã ca">
                    <Input
                      value={form.caseCode}
                      onChange={(v) => set({ caseCode: v })}
                      placeholder="Nhập mã ca"
                      tone="blue"
                    />
                  </Field>

                  <Field label="Lab">
                    <Select
                      value={form.lab}
                      onChange={(v) => set({ lab: v })}
                      items={opt("labs")}
                      tone="emerald"
                    />
                  </Field>

                  {/* ✅ AUTO-MAP Nguồn -> NVKD phụ trách ở đây */}
                  <Field label="Nguồn">
                    <Select
                      value={form.source}
                      onChange={(v) => {
                        const owner = SOURCE_TO_SALES_OWNER[v] ?? "";
                        set({
                          source: v,
                          ...(owner ? { salesOwner: owner } : {}),
                        });
                      }}
                      items={opt("sources")}
                      tone="amber"
                    />
                  </Field>

                  <Field label="NVKD phụ trách">
                    <Select
                      value={form.salesOwner}
                      onChange={(v) => set({ salesOwner: v })}
                      items={opt("salesOwners")}
                      tone="blue"
                    />
                  </Field>

                  <Field label="Thu mẫu">
                    <Select
                      value={form.sampleCollector}
                      onChange={(v) => set({ sampleCollector: v })}
                      items={opt("sampleCollectors")}
                      tone="rose"
                    />
                  </Field>
                </div>
              </section>

              {/* Cột 2 */}
              <section className="rounded-2xl bg-white p-3 ring-1 ring-black/5">
                <div className="mb-2 text-[12px] font-bold text-neutral-900">
                  Bệnh nhân & Dịch vụ
                </div>

                <div className="space-y-3">
                  <Field label="Họ và tên">
                    <Input
                      value={form.patientName}
                      onChange={(v) => set({ patientName: v })}
                      placeholder="Nhập tên bệnh nhân"
                      tone="rose"
                    />
                  </Field>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="Dịch vụ (mã)">
                      <Select
                        value={form.serviceCode}
                        onChange={(v) => {
                          const s =
                            services.find((x) => x.serviceCode === v) ?? null;
                          set({
                            serviceCode: v,
                            serviceName: s?.name ?? "",
                            serviceId: (s as any)?._id ?? null,
                          });
                        }}
                        items={serviceItemsForSelect}
                        placeholder="Chọn dịch vụ..."
                        tone="emerald"
                      />
                    </Field>

                    <Field label="Tên dịch vụ">
                      <div className="rounded-xl border border-black/10 bg-white px-3 py-2 text-[12px] shadow-sm">
                        <div className="font-semibold text-neutral-900">
                          {form.serviceName || "—"}
                        </div>
                        {form.serviceCode && (
                          <div className="mt-0.5 text-[11px] text-neutral-500">
                            {form.serviceCode}
                          </div>
                        )}
                      </div>
                    </Field>
                  </div>

                  <Field label="Tiền thu">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
                      {/* Header nhỏ: Auto */}
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div>
                          <div className="text-[11px] font-semibold text-emerald-700">
                            Tự động theo nguồn + dịch vụ
                          </div>
                        </div>

                        <span className="rounded-full bg-white/70 px-2 py-1 text-[11px] font-bold text-emerald-800 ring-1 ring-black/5">
                          {collectedAmountManual ? "chỉnh tay" : "auto"}
                        </span>
                      </div>

                      {/* 2 cột cùng style */}
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        {/* Card: Tiền thu */}
                        <div className="rounded-xl bg-white/70 p-3 ring-1 ring-black/5">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="text-[11px] font-semibold text-neutral-500">
                              Tiền thu (có thể chỉnh)
                            </div>

                            <button
                              type="button"
                              className="rounded-lg bg-white px-2 py-1 text-[11px] font-bold ring-1 ring-black/10 hover:bg-neutral-50 disabled:opacity-60"
                              onClick={() => {
                                set({ collectedAmount: suggestedPrice });
                                setCollectedAmountManual(false);
                              }}
                              disabled={isUploadingImage}
                              title="Đưa tiền thu về giá auto"
                            >
                              Reset
                            </button>
                          </div>

                          <Input
                            value={String(form.collectedAmount ?? 0)}
                            onChange={(v) => {
                              const n =
                                Number(String(v).replace(/[^\d]/g, "")) || 0;
                              set({ collectedAmount: n });
                              setCollectedAmountManual(true);
                            }}
                            placeholder="Nhập số tiền..."
                            tone="emerald"
                          />
                        </div>

                        {/* Card: Hiển thị */}
                        <div className="rounded-xl bg-white/70 p-3 ring-1 ring-black/5">
                          <div className="text-[11px] font-semibold text-neutral-500">
                            Hiển thị
                          </div>
                          <div className="mt-1 text-[14px] font-bold text-emerald-700">
                            {fmtMoney(form.collectedAmount ?? 0)}
                          </div>

                          <div className="mt-2 text-[11px] text-neutral-500">
                            (
                            {collectedAmountManual
                              ? "đã override"
                              : "đang theo auto"}
                            )
                          </div>
                        </div>
                      </div>
                    </div>
                  </Field>

                  <Field label="Thông tin chi tiết thêm">
                    <Textarea
                      value={form.detailNote}
                      onChange={(v) => set({ detailNote: v })}
                      placeholder="Ghi chú..."
                      rows={3}
                      tone="slate"
                    />
                  </Field>
                </div>
              </section>

              {/* Cột 3 */}
              <section className="rounded-2xl bg-white p-3 ring-1 ring-black/5">
                <div className="mb-2 text-[12px] font-bold text-neutral-900">
                  Luồng xử lý
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="Mức chuyển lab">
                      <Select
                        value={form.transferStatus}
                        onChange={(v) => set({ transferStatus: v })}
                        items={opt("transferStatus")}
                        tone="amber"
                      />
                    </Field>

                    <Field label="Tiếp nhận mẫu">
                      <Select
                        value={form.receiveStatus}
                        onChange={(v) => set({ receiveStatus: v })}
                        items={opt("receiveStatus")}
                        tone="emerald"
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="Xử lý mẫu">
                      <Select
                        value={form.processStatus}
                        onChange={(v) => set({ processStatus: v })}
                        items={opt("processStatus")}
                        tone="slate"
                      />
                    </Field>

                    <Field label="Phản hồi">
                      <Select
                        value={form.feedbackStatus}
                        onChange={(v) => set({ feedbackStatus: v })}
                        items={opt("feedbackStatus")}
                        tone="rose"
                      />
                    </Field>
                  </div>

                  <Field label="Ngày nhận">
                    <div className="grid grid-cols-2 gap-2">
                      {/* Trái: chọn theo ngày (00:00 VN) */}
                      <SingleDatePicker
                        value={isoDateFromISODateTime((form as any).receivedAt)}
                        onChange={(d) =>
                          set({ receivedAt: isoDateTimeFromISODate(d) as any })
                        }
                        placeholder="Chọn ngày..."
                        disabled={false}
                        popoverWidth="lg"
                        months={1}
                        buttonClassName="w-full px-3 py-2 text-left text-[12px] rounded-xl border border-black/10 shadow-sm"
                      />

                      {/* Phải: lấy thời điểm hiện tại */}
                      <button
                        type="button"
                        className={cn(
                          "w-full rounded-xl px-3 py-2 text-[12px] font-bold",
                          "bg-white ring-1 ring-black/10 shadow-sm hover:bg-neutral-50",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200",
                        )}
                        onClick={() => {
                          const ok = window.confirm(
                            "Xác nhận lấy thời điểm hiện tại (giờ Việt Nam) làm 'Ngày nhận'?",
                          );
                          if (!ok) return;
                          set({ receivedAt: nowVNISOString() as any });
                        }}
                        title="Lấy thời điểm hiện tại"
                      >
                        Lấy thời điểm hiện tại
                      </button>
                    </div>

                    <div className="mt-1 text-[11px] text-neutral-500">
                      Trái: chọn theo ngày • Phải: lấy đúng thời điểm hiện tại.
                    </div>
                  </Field>

                  <div className="rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50 p-3 ring-1 ring-black/5">
                    <div className="text-[11px] font-semibold text-neutral-500">
                      Ngày trả KQ (tự tính theo dịch vụ + ngày nhận)
                    </div>
                    <div className="mt-1 text-[12px] font-bold text-neutral-900">
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

                  <div className="mt-2 rounded-2xl bg-white p-3 ring-1 ring-black/5">
                    <div className="mb-2 text-[12px] font-bold text-neutral-900">
                      Thanh toán & File
                    </div>

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      <label className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-[12px] shadow-sm">
                        <input
                          type="checkbox"
                          checked={!!(form as any).paid}
                          onChange={(e) => set({ paid: e.target.checked })}
                        />
                        Đã thanh toán
                      </label>

                      <label className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-[12px] shadow-sm">
                        <input
                          type="checkbox"
                          checked={!!(form as any).invoiceRequested}
                          onChange={(e) =>
                            set({ invoiceRequested: e.target.checked })
                          }
                        />
                        Xuất hóa đơn
                      </label>
                    </div>

                    <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                      <label className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-[12px] shadow-sm">
                        <input
                          type="checkbox"
                          checked={!!(form as any).glReturned}
                          onChange={(e) =>
                            set({ glReturned: e.target.checked })
                          }
                        />
                        GL trả
                      </label>

                      <label className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-[12px] shadow-sm">
                        <input
                          type="checkbox"
                          checked={!!(form as any).gxReceived}
                          onChange={(e) =>
                            set({ gxReceived: e.target.checked })
                          }
                        />
                        GX nhận
                      </label>

                      <label className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-[12px] shadow-sm">
                        <input
                          type="checkbox"
                          checked={!!(form as any).softFileDone}
                          onChange={(e) =>
                            set({ softFileDone: e.target.checked })
                          }
                        />
                        Trả file mềm
                      </label>

                      <label className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-[12px] shadow-sm">
                        <input
                          type="checkbox"
                          checked={!!(form as any).hardFileDone}
                          onChange={(e) =>
                            set({ hardFileDone: e.target.checked })
                          }
                        />
                        Trả file cứng
                      </label>
                    </div>

                    {/* ✅ Preview ảnh upload (Cloudinary) */}
                    <div className="mt-3 rounded-2xl bg-white p-3 ring-1 ring-black/5">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-[12px] font-bold text-neutral-900">
                          Ảnh đã tải
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          Tổng tối đa 3 ảnh (1 đơn + 2 KQ)
                        </div>
                      </div>

                      {imageUploadError && (
                        <div className="mb-2 rounded-xl bg-rose-50 px-3 py-2 text-[12px] font-semibold text-rose-700 ring-1 ring-rose-200">
                          {imageUploadError}
                        </div>
                      )}

                      {/* Ảnh đơn đăng ký */}
                      <div className="mb-3">
                        <div className="mb-1 text-[11px] font-semibold text-neutral-500">
                          Ảnh đơn đăng ký (1 ảnh)
                        </div>

                        {registrationUrl ? (
                          <div className="flex items-start gap-3">
                            <a
                              href={registrationUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="block"
                            >
                              <img
                                src={registrationUrl}
                                alt="registration"
                                className="h-24 w-24 rounded-xl object-cover ring-1 ring-black/10"
                              />
                            </a>

                            <div className="min-w-0 flex-1">
                              <div className="truncate text-[11px] text-neutral-600">
                                {registrationUrl}
                              </div>
                              <div className="mt-2 flex gap-2">
                                <button
                                  type="button"
                                  className="rounded-xl bg-white px-3 py-2 text-[12px] font-bold ring-1 ring-black/10 hover:bg-neutral-50 disabled:opacity-60"
                                  onClick={() => regInputRef.current?.click()}
                                  disabled={isUploadingImage}
                                >
                                  Đổi ảnh
                                </button>
                                <button
                                  type="button"
                                  className="rounded-xl bg-rose-600 px-3 py-2 text-[12px] font-bold text-white hover:opacity-95 disabled:opacity-60"
                                  onClick={removeRegistration}
                                  disabled={isUploadingImage}
                                >
                                  Xoá
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="w-full rounded-xl bg-white px-3 py-2 text-[12px] font-bold ring-1 ring-black/10 hover:bg-neutral-50 disabled:opacity-60"
                            onClick={() => regInputRef.current?.click()}
                            disabled={isUploadingImage}
                          >
                            {isUploadingImage
                              ? "Đang tải..."
                              : "Tải ảnh đơn đăng ký"}
                          </button>
                        )}
                      </div>

                      {/* Ảnh kết quả */}
                      <div>
                        <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-neutral-500">
                          <span>Ảnh kết quả (tối đa 2)</span>
                          <span>{resultUrls.length}/2</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {resultUrls.map((url, idx) => (
                            <div
                              key={`${url}-${idx}`}
                              className="overflow-hidden rounded-xl ring-1 ring-black/10"
                            >
                              <a
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="block"
                              >
                                <img
                                  src={url}
                                  alt={`result-${idx}`}
                                  className="h-28 w-full object-cover"
                                />
                              </a>
                              <div className="p-2">
                                <button
                                  type="button"
                                  className="w-full rounded-lg bg-rose-600 px-2 py-1 text-[12px] font-bold text-white hover:opacity-95 disabled:opacity-60"
                                  onClick={() => removeResultAt(idx)}
                                  disabled={isUploadingImage}
                                >
                                  Xoá
                                </button>
                              </div>
                            </div>
                          ))}

                          {resultUrls.length < 2 && (
                            <button
                              type="button"
                              className="h-28 rounded-xl bg-white px-3 py-2 text-[12px] font-bold ring-1 ring-black/10 hover:bg-neutral-50 disabled:opacity-60"
                              onClick={() => resInputRef.current?.click()}
                              disabled={isUploadingImage}
                            >
                              {isUploadingImage ? "Đang tải..." : "Thêm ảnh KQ"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {(form as any).invoiceRequested && (
                      <div className="mt-2">
                        <div className="mb-1 text-[11px] font-semibold text-neutral-500">
                          Thông tin xuất hóa đơn
                        </div>
                        <Textarea
                          value={(form as any).invoiceInfo ?? ""}
                          onChange={(v) => set({ invoiceInfo: v })}
                          placeholder="Tên, MST, địa chỉ..."
                          rows={3}
                          tone="amber"
                        />
                      </div>
                    )}
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
