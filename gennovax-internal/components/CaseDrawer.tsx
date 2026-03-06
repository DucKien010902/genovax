"use client";

import axios from "axios";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CaseDraft, OptionsMap, ServiceItem,DoctorItem} from "@/lib/types";
import SingleDatePicker from "./DatePicker";
import { useAuth } from "@/lib/auth";

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
  // 1. Kiểm tra xem label có chứa chuỗi "(*)" hay không
  const isRequired = label.includes("*");
  
  // 2. Xóa chuỗi "(*)" ra khỏi label gốc để tên trường hiển thị sạch sẽ
  

  return (
    <div className="min-w-0">
      <div className="mb-1 text-[11px] font-semibold text-neutral-500">
        {/* 3. Nếu là trường bắt buộc thì render thêm dấu * màu đỏ (rose-500) */}
        {isRequired ? (
          <span className="ml-1 text-[11px] font-bold text-red-500">{label}</span>
        ):label}
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
  const { user, token, logout } = useAuth();
  const isAccountingAdmin = user?.role === "accounting_admin";
  
  // 1. Khai báo các state cơ bản
  const [form, setForm] = useState<CaseDraft | null>(data);
  const [sampleCount, setSampleCount] = useState(1);
  const [collectedAmountManual, setCollectedAmountManual] = useState(false);

  // 2. Xác định ca mới hay ca cũ dựa vào prop data truyền vào
  const isNewCase = !data?._id; // Thay _id bằng trường ID thực tế của database nếu khác

  // 3. ĐỒNG BỘ DATA: Cập nhật form và các cờ trạng thái mỗi khi mở ca
  useEffect(() => {
    setForm(data);
    
    if (data && data._id) {
      // ✅ CA CŨ: Bật cờ chỉnh tay (true) để CHẶN useEffect tự động tính giá ghi đè
      setCollectedAmountManual(true);
    } else {
      // ✅ CA MỚI: Tắt cờ chỉnh tay (false) để tính auto, reset số lượng mẫu về 1
      setCollectedAmountManual(false);
      setSampleCount(1);
    }
  }, [data]);

  const opt = useMemo(() => (k: string) => options[k] ?? [], [options]);

  const set = (patch: Partial<CaseDraft>) =>
    setForm((prev) => (prev ? { ...prev, ...patch } : prev));

  // ===== selected service =====
  const selectedService = useMemo(() => {
    if (!form) return null;
    if (form.serviceCode) {
      return services.find((s) => s.serviceCode === form.serviceCode) ?? null;
    }
    return null;
  }, [form, services]);

  // ===== derived agent from API =====
  const agent = useMemo(() => {
    if (!form || !form.source) return { level: "", label: "" };
    
    const foundDoc = doctors.find((d) => d.fullName === form.source);
    
    if (foundDoc) {
      return { 
        level: foundDoc.agentLevel || "cap3", 
        label: foundDoc.agentTierLabel || "Cấp 3" 
      };
    }
    
    return { level: "", label: "" };
  }, [form?.source, doctors]);

  // ===== suggested price =====
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
      if (!collectedAmountManual && (form.collectedAmount ?? 0) !== 0) {
        set({ collectedAmount: 0 });
      }
      return;
    }
    
    // ✅ 4. Tự động tính giá = Giá đề xuất * Số lượng mẫu 
    // Chỉ chạy vào đây khi mở ca mới hoặc khi người dùng cố tình ấn nút Reset
    if (!collectedAmountManual) {
      const autoPrice = suggestedPrice * sampleCount;
      if ((form.collectedAmount ?? 0) !== autoPrice) {
        set({ collectedAmount: autoPrice });
      }
    }
  }, [
    selectedService?.serviceCode,
    agent.level,
    suggestedPrice,
    collectedAmountManual,
    sampleCount, // Thêm sampleCount vào dependency để tính lại khi đổi số mẫu
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

  // =========================
  // ✅ UPLOAD IMAGE (Cloudinary)
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
            "w-[90vw] lg:w-[85vw]  h-[80vh] lg:h-[90vh] rounded-3xl bg-white shadow-2xl ring-1 ring-black/10",
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
                    {agent.level || "Chưa xác định cấp"}
                  </span>
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 font-bold text-amber-800 ring-1 ring-amber-200">
                    Giá: {fmtMoney(form.collectedAmount ?? 0)}
                  </span>
                  {form.dueDate && (
                    <span className="rounded-full bg-slate-50 px-2 py-0.5 font-bold text-slate-700 ring-1 ring-black/5">
                      Hạn KQ: {new Date(form.dueDate).toLocaleString()}
                    </span>
                  )}
                  <span className="rounded-full bg-amber-50 px-2 py-0.5 font-bold text-amber-800 ring-1 ring-amber-200 hidden lg:flex">
                    Dấu * là trường bắt buộc
                  </span>
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

                <button
                  className="rounded-xl px-3 py-2 text-[12px] text-black font-bold ring-1 ring-black/10 hover:bg-neutral-50"
                  onClick={onClose}
                >
                  Đóng
                </button>
                <button
                  className="rounded-xl bg-neutral-900 px-3 py-2 text-[12px] font-bold text-white hover:opacity-95 cursor-pointer"
                  onClick={() => onSave(form)}
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="h-[calc(90vh-56px)] overflow-auto p-4 text-black bg-slate-50/50">
            {/* Chuyển sang grid 7 cột. Cột 1 = 1 span, Cột 2,3,4 = 2 span */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-11">
              {/* Cột 1: Thông tin ca (Thu nhỏ bằng 1 nửa) */}
              <section className="rounded-2xl bg-white p-3 ring-1 ring-black/5 lg:col-span-2">
                <div className="mb-2 text-[12px] font-bold text-neutral-900">
                  Thông tin ca
                </div>

                <div className="space-y-3">
                  <Field label="* Mã ca">
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

                  <Field label="* Nguồn">
                    <Select
                      value={form.source}
                      onChange={(v) => {
                        // Tìm Doctor/Nguồn vừa chọn
                        const selectedDoc = doctors.find(d => d.fullName === v);
                        
                        // Lấy NVKD từ DB (nếu bạn đã thêm field), tạm thời dùng map cũ nếu chưa có
                        const owner = (selectedDoc as any)?.salesOwner || SOURCE_TO_SALES_OWNER[v] || "";
                        
                        set({
                          source: v,
                          doctorId: selectedDoc?._id || null, // ✅ Lưu ID của nguồn vào DB
                          ...(owner ? { salesOwner: owner } : {}),
                        });
                      }}
                      // ✅ Biến danh sách API thành danh sách cho dropdown
                      items={doctors.map((d) => ({
                        label: d.fullName,
                        value: d.fullName,
                      }))}
                      tone="amber"
                    />
                  </Field>

                  <Field label="* NVKD phụ trách">
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

              {/* Cột 2: Bệnh nhân & Dịch vụ (Giữ nguyên) */}
              <section className="rounded-2xl bg-white p-3 ring-1 ring-black/5 lg:col-span-3">
                <div className="mb-2 text-[12px] font-bold text-neutral-900">
                  Bệnh nhân & Dịch vụ
                </div>

                <div className="space-y-3">
                  <Field label="* Họ và tên">
                    <Input
                      value={form.patientName}
                      onChange={(v) => set({ patientName: v })}
                      placeholder="Nhập tên bệnh nhân"
                      tone="rose"
                    />
                  </Field>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="* Dịch vụ (mã)">
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

                  <Field label="* Tài chính">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <div className="text-[11px] font-semibold text-emerald-700">
                          Thông tin doanh thu {isAccountingAdmin && "& Giá vốn"}
                        </div>
                        <span className="rounded-full bg-white/70 px-2 py-1 text-[11px] font-bold text-emerald-800 ring-1 ring-black/5">
                          {collectedAmountManual ? "chỉnh tay" : "auto"}
                        </span>
                      </div>

                      <div className="flex flex-col gap-3">
  {/* Block 1: Tiền thu (Doanh thu) - Ai cũng thấy */}
  <div className="rounded-xl bg-white/70 p-3 ring-1 ring-black/5">
    <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
      <div className="text-[11px] font-semibold text-neutral-500">
        Tiền thu 
      </div>

      <div className="flex items-center gap-2">
        {/* Chỉ hiển thị chọn số lượng mẫu nếu là Ca Mới */}
        {isNewCase && (
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-neutral-500">SL mẫu:</span>
            <input
              type="number"
              min={1}
              value={sampleCount}
              onChange={(e) => {
                const val = Math.max(1, parseInt(e.target.value) || 1);
                setSampleCount(val);
                setCollectedAmountManual(false); // Kích hoạt lại tính auto để nhân giá
              }}
              className="w-12 rounded border border-black/10 px-1 py-0.5 text-center text-[11px] outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
        )}

        <button
          type="button"
          className="rounded-lg bg-white px-2 py-1 text-[11px] font-bold ring-1 ring-black/10 hover:bg-neutral-50"
          onClick={() => {
            set({
              collectedAmount: suggestedPrice * (isNewCase ? sampleCount : 1),
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
        const n = Number(String(v).replace(/[^\d]/g, "")) || 0;
        set({ collectedAmount: n });
        setCollectedAmountManual(true);
      }}
      tone="emerald"
    />
    <div className="mt-1 text-[13px] font-bold text-emerald-700">
      {fmtMoney(form.collectedAmount ?? 0)}
    </div>
  </div>

  {/* Block 2: Giá xuất vốn (Giá Cost) - Chỉ hiển thị cho SuperAdmin, đẩy xuống dưới */}
  {isAccountingAdmin && (
    <div className="rounded-xl bg-rose-50/50 p-3 ring-1 ring-rose-200/50">
      <div className="mb-2 text-[11px] font-semibold text-rose-700">
        Giá xuất vốn (Giá Cost)
      </div>
      <Input
        value={String((form as any).costPrice ?? 0)}
        onChange={(v) => {
          const n = Number(String(v).replace(/[^\d]/g, "")) || 0;
          set({ costPrice: n });
        }}
        placeholder="Nhập giá vốn..."
        tone="rose"
      />
      <div className="mt-1 text-[13px] font-bold text-rose-700">
        {fmtMoney((form as any).costPrice ?? 0)}
      </div>
    </div>
  )}
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

              {/* Cột 3: Luồng xử lý (Giữ nguyên + Xoá phần Ảnh & Hóa đơn) */}
              <section className="rounded-2xl bg-white p-3 ring-1 ring-black/5 lg:col-span-3">
                <div className="mb-2 text-[12px] font-bold text-neutral-900">
                  Luồng xử lý
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="* Mức chuyển lab">
                      <Select
                        value={form.transferStatus}
                        onChange={(v) => set({ transferStatus: v })}
                        items={opt("transferStatus")}
                        tone="amber"
                      />
                    </Field>

                    <Field label="* Tiếp nhận mẫu">
                      <Select
                        value={form.receiveStatus}
                        onChange={(v) => set({ receiveStatus: v })}
                        items={opt("receiveStatus")}
                        tone="emerald"
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="* Xử lý mẫu">
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

                  <Field label="* Ngày nhận">
                    <div className="grid grid-cols-2 gap-2">
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
                      Trạng thái trả File & Thanh toán
                    </div>

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 mb-2">
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
                          checked={!!(form as any).glReturned}
                          onChange={(e) =>
                            set({ glReturned: e.target.checked })
                          }
                        />
                        GL trả
                      </label>
                    </div>

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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

                      <label className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-[12px] shadow-sm md:col-span-2">
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
                  </div>
                </div>
              </section>

              {/* Cột 4: Tài liệu ảnh & Hóa đơn (Cột mới chuyển sang) */}
              <section className={`rounded-2xl bg-white p-3 ring-1 ring-black/5 lg:col-span-3 {}`}>
                <div className="mb-2 text-[12px] font-bold text-neutral-900">
                  Hồ sơ Ảnh & Hóa đơn
                </div>

                <div className="space-y-4 ">
                  {/* --- Block Xuất Hóa Đơn --- */}
                  <div className={`rounded-2xl bg-slate-50 p-3 ring-1 ring-black/5 ${isAccountingAdmin ? "none" : "hidden"}`}>
                    <label className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-[12px] shadow-sm mb-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!(form as any).invoiceRequested}
                        onChange={(e) =>
                          set({ invoiceRequested: e.target.checked })
                        }
                      />
                      <span className="font-bold text-neutral-700">Yêu cầu xuất hóa đơn</span>
                    </label>

                    {(form as any).invoiceRequested && (
                      <div className="space-y-3 rounded-xl bg-amber-50 p-3 ring-1 ring-amber-200">
                        <Field label="Tên công ty / Đơn vị">
                          <Input
                            value={(form as any).invoiceName ?? ""}
                            onChange={(v) => set({ invoiceName: v })}
                            placeholder="Nhập tên đơn vị..."
                            tone="amber"
                          />
                        </Field>
                        <Field label="Mã số thuế">
                          <Input
                            value={(form as any).invoiceTaxCode ?? ""}
                            onChange={(v) => set({ invoiceTaxCode: v })}
                            placeholder="Nhập MST..."
                            tone="amber"
                          />
                        </Field>
                        <Field label="Địa chỉ">
                          <Textarea
                            value={(form as any).invoiceAddress ?? ""}
                            onChange={(v) => set({ invoiceAddress: v })}
                            placeholder="Nhập địa chỉ..."
                            rows={2}
                            tone="amber"
                          />
                        </Field>
                      </div>
                    )}
                  </div>

                  {/* --- Block Upload Ảnh --- */}
                  <div className="rounded-2xl bg-white p-3 ring-1 ring-black/5">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="text-[12px] font-bold text-neutral-900">
                        Ảnh đã tải
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        1 Đơn + 2 KQ
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
                              className="h-20 w-20 rounded-xl object-cover ring-1 ring-black/10"
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
                                className="h-24 w-full object-cover"
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
                            className="h-24 rounded-xl bg-white px-3 py-2 text-[12px] font-bold ring-1 ring-black/10 hover:bg-neutral-50 disabled:opacity-60 flex items-center justify-center"
                            onClick={() => resInputRef.current?.click()}
                            disabled={isUploadingImage}
                          >
                            {isUploadingImage ? "Đang tải..." : "+ Thêm ảnh"}
                          </button>
                        )}
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