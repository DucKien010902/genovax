"use client";

import { useEffect, useMemo, useState } from "react";
import type { CaseDraft, OptionsMap, ServiceItem } from "@/lib/types";
import SingleDatePicker from "./DatePicker";

/** ✅ FE map nguồn -> cấp đại lý (không đụng DB) */
/** ✅ FE map nguồn -> cấp đại lý (không đụng DB) */
const SOURCE_TO_AGENT: Record<
  string,
  { level: "cap1" | "cap2" | "cap3" | "ctv"; label: string }
> = {
  // bạn cung cấp
  "CTV Xinh": { level: "cap2", label: "Cấp 2" },
  "PK Âu Cơ": { level: "ctv", label: "CTV" },

  // bạn nói "huyền: cấp 1" -> có 2 nguồn liên quan Huyền trong list sources
  "CTV Huyền": { level: "cap1", label: "Cấp 1" },
  "Huyền - BVDK ngã 4 Hồ": { level: "cap1", label: "Cấp 1" },

  "PKĐK AGAPE": { level: "cap2", label: "Cấp 2" },
  "BS Thoa": { level: "ctv", label: "CTV" },
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
    slate: "border-black/10 focus:ring-slate-300",
    blue: "border-blue-200 focus:ring-blue-300",
    rose: "border-rose-200 focus:ring-rose-300",
    emerald: "border-emerald-200 focus:ring-emerald-300",
    amber: "border-amber-200 focus:ring-amber-300",
  };

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full rounded-2xl border bg-white px-3 py-2.5 text-sm shadow-sm outline-none",
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


function addHoursISO(iso: string, hours: number) {
  const d = new Date(iso);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

/** ✅ Modal date picker to, dễ bấm */


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

  /** ✅ thêm prop để chọn service và tính giá */
  services: ServiceItem[];

  onClose: () => void;
  onSave: (data: CaseDraft) => Promise<void>;
}) {
  // ✅ luôn gọi hook đầy đủ, tránh lỗi order
  const [form, setForm] = useState<CaseDraft | null>(data);

  const [pickSentOpen, setPickSentOpen] = useState(false);
  const [pickRecvOpen, setPickRecvOpen] = useState(false);
  function isoDateFromISODateTime(iso?: string | null) {
  if (!iso) return "";
  // lấy YYYY-MM-DD từ ISO datetime
  // new Date(iso).toISOString() sẽ ra dạng UTC, dùng slice(0,10) để lấy ngày
  try {
    return new Date(iso).toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

function isoDateTimeFromISODate(date: string) {
  if (!date) return null;
  // lưu về ISO datetime để tương thích logic addHoursISO/dueDate
  return new Date(`${date}T00:00:00.000Z`).toISOString();
}

  useEffect(() => setForm(data), [data]);

  const opt = useMemo(() => (k: string) => options[k] ?? [], [options]);

  const set = (patch: Partial<CaseDraft>) =>
    setForm((prev) => (prev ? { ...prev, ...patch } : prev));

  // ===== selected service =====
  const selectedService = useMemo(() => {
    if (!form) return null;
    // ưu tiên serviceCode nếu bạn chưa dùng serviceId
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

  // ===== compute price realtime -> set collectedAmount =====
  useEffect(() => {
    if (!form) return;

    // cache agent fields (đúng sheet)
    if (form.agentLevel !== agent.level) set({ agentLevel: agent.level });
    if (form.agentTierLabel !== agent.label)
      set({ agentTierLabel: agent.label });

    if (!selectedService || !agent.level) {
      // chưa đủ dữ liệu => để 0
      if ((form.collectedAmount ?? 0) !== 0) set({ collectedAmount: 0 });
      return;
    }

    const found = (selectedService.pricesByLevel || []).find(
      (p) => p.level === agent.level,
    );
    const price = found?.price ?? 0;

    // ✅ Tiền thu chính là giá (không nhập tay)
    if ((form.collectedAmount ?? 0) !== price) set({ collectedAmount: price });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedService?.serviceCode,
    agent.level,
    agent.label,
    form?.collectedAmount,
  ]);

  // ===== compute due date realtime (nếu muốn) =====
  useEffect(() => {
    if (!form) return;
    if (!selectedService || !form.receivedAt) return;

    const hours = selectedService.turnaroundHours ?? 48;
    const due = addHoursISO(form.receivedAt, hours);

    if (due !== form.dueDate) set({ dueDate: due });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedService?.serviceCode, form?.receivedAt, form?.dueDate]);

  // ✅ chỉ return sau khi hook đã chạy
  if (!open || !form) return null;

  const serviceItemsForSelect = services
    .filter((s) => s.serviceType === form.serviceType && s.isActive)
    .map((s) => ({
      label: `${s.serviceCode} — ${s.name}`,
      value: s.serviceCode,
    }));

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-[56%] bg-white shadow-2xl">
        {/* Header */}
        <div className="border-b bg-gradient-to-r from-blue-50 via-white to-rose-50 px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-blue-700">
                Ca: {form.serviceType}
              </div>
              <div className="text-xl font-bold tracking-tight text-neutral-900">
                {form.patientName || "Ca mới"}
              </div>
              <div className="mt-1 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-emerald-50 px-2 py-1 font-semibold text-emerald-700 ring-1 ring-emerald-200">
                  {agent.label || "Chưa xác định cấp"}
                </span>
                <span className="rounded-full bg-amber-50 px-2 py-1 font-semibold text-amber-800 ring-1 ring-amber-200">
                  Giá: {fmtMoney(form.collectedAmount ?? 0)}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="rounded-2xl px-4 py-2 text-sm font-semibold ring-1 ring-black/10 hover:bg-neutral-50"
                onClick={onClose}
              >
                Hủy
              </button>
              <button
                className="rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                onClick={() => onSave(form)}
              >
                Lưu
              </button>
            </div>
          </div>
        </div>

        {/* body */}
        <div className="h-[calc(100%-80px)] overflow-auto p-5 space-y-6">
          {/* ===== Thông tin ca ===== */}
          <section className="rounded-3xl bg-white p-4 ring-1 ring-black/5 shadow-sm">
            <div className="mb-3 text-sm font-bold text-neutral-900">
              Thông tin ca
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="mb-1 text-xs text-neutral-500">Mã ca</div>
                <input
                  className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:ring-4 focus:ring-blue-200"
                  value={form.caseCode}
                  onChange={(e) => set({ caseCode: e.target.value })}
                  placeholder="Nhập mã ca"
                />
              </div>

              <div>
                <div className="mb-1 text-xs text-neutral-500">Họ và tên</div>
                <input
                  className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:ring-4 focus:ring-rose-200"
                  value={form.patientName}
                  onChange={(e) => set({ patientName: e.target.value })}
                  placeholder="Nhập tên bệnh nhân"
                />
              </div>
            </div>

            {/* ✅ giữ đủ: Lab, Nguồn, NVKD, Thu mẫu */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <div className="mb-1 text-xs text-neutral-500">Lab</div>
                <Select
                  value={form.lab}
                  onChange={(v) => set({ lab: v })}
                  items={opt("labs")}
                  tone="emerald"
                />
              </div>

              <div>
                <div className="mb-1 text-xs text-neutral-500">Nguồn</div>
                <Select
                  value={form.source}
                  onChange={(v) => set({ source: v })}
                  items={opt("sources")}
                  tone="amber"
                />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <div className="mb-1 text-xs text-neutral-500">
                  NVKD phụ trách
                </div>
                <Select
                  value={form.salesOwner}
                  onChange={(v) => set({ salesOwner: v })}
                  items={opt("salesOwners")}
                  tone="blue"
                />
              </div>
              <div>
                <div className="mb-1 text-xs text-neutral-500">Thu mẫu</div>
                <Select
                  value={form.sampleCollector}
                  onChange={(v) => set({ sampleCollector: v })}
                  items={opt("sampleCollectors")}
                  tone="rose"
                />
              </div>
            </div>

            {/* ✅ thêm chọn dịch vụ (serviceCode) để tính giá */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <div className="mb-1 text-xs text-neutral-500">
                  Dịch vụ (mã)
                </div>
                <Select
                  value={form.serviceCode}
                  onChange={(v) => {
                    const s = services.find((x) => x.serviceCode === v) ?? null;

                    set({
                      serviceCode: v,
                      serviceName: s?.name ?? "",
                      serviceId: s?._id ?? null,
                    });
                  }}
                  items={serviceItemsForSelect}
                  placeholder="Chọn dịch vụ..."
                  tone="emerald"
                />
              </div>

              <div>
                <div className="mb-1 text-xs text-neutral-500">Tên dịch vụ</div>
                <div className="rounded-2xl border border-black/10 bg-white px-3 py-2.5 text-sm shadow-sm">
                  <div className=" text-neutral-900">
                    {form.serviceName || "—"}
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-1 text-xs text-neutral-500">
                  Tiền thu (auto)
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-extrabold text-emerald-700">
                  {fmtMoney(form.collectedAmount ?? 0)}
                </div>
                <div className="mt-1 text-[11px] text-neutral-500">
                  Tự tính theo Nguồn + Dịch vụ (không nhập tay).
                </div>
              </div>
            </div>

            <div className="mt-3">
              <div className="mb-1 text-xs text-neutral-500">
                Thông tin chi tiết thêm
              </div>
              <textarea
                className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:ring-4 focus:ring-slate-200 min-h-[90px]"
                value={form.detailNote}
                onChange={(e) => set({ detailNote: e.target.value })}
                placeholder="Ghi chú..."
              />
            </div>
          </section>

          {/* ===== Luồng xử lý ===== */}
          <section className="rounded-3xl bg-white p-4 ring-1 ring-black/5 shadow-sm">
            <div className="mb-3 text-sm font-bold text-neutral-900">
              Luồng xử lý
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="mb-1 text-xs text-neutral-500">
                  Mức chuyển lab
                </div>
                <Select
                  value={form.transferStatus}
                  onChange={(v) => set({ transferStatus: v })}
                  items={opt("transferStatus")}
                  tone="amber"
                />
              </div>
              <div>
                <div className="mb-1 text-xs text-neutral-500">
                  Tiếp nhận mẫu
                </div>
                <Select
                  value={form.receiveStatus}
                  onChange={(v) => set({ receiveStatus: v })}
                  items={opt("receiveStatus")}
                  tone="emerald"
                />
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <div className="mb-1 text-xs text-neutral-500">Xử lý mẫu</div>
                <Select
                  value={form.processStatus}
                  onChange={(v) => set({ processStatus: v })}
                  items={opt("processStatus")}
                  tone="slate"
                />
              </div>
              <div>
                <div className="mb-1 text-xs text-neutral-500">Phản hồi</div>
                <Select
                  value={form.feedbackStatus}
                  onChange={(v) => set({ feedbackStatus: v })}
                  items={opt("feedbackStatus")}
                  tone="rose"
                />
              </div>
            </div>

            {/* ✅ chọn ngày bằng modal lớn */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <div className="mb-1 text-xs text-neutral-500">Ngày nhận</div>
                <SingleDatePicker
  value={isoDateFromISODateTime(form.receivedAt)}
  onChange={(d) => set({ receivedAt: isoDateTimeFromISODate(d) })}
  placeholder="Chọn ngày..."
  disabled={false}
  popoverWidth="lg"
  months={1}
  buttonClassName="w-full px-3 py-3 text-left" // ✅ nhìn giống input cũ
/>

              </div>

              {/* <div>
                <div className="mb-1 text-xs text-neutral-500">
                  Ngày gửi mẫu
                </div>
                <button
                  type="button"
                  className="w-full rounded-2xl border border-black/10 bg-white px-3 py-3 text-left text-sm shadow-sm hover:bg-neutral-50"
                  onClick={() => setPickSentOpen(true)}
                >
                  {form.sentAt
                    ? new Date(form.sentAt).toLocaleDateString()
                    : "Chọn ngày..."}
                </button>
              </div> */}
            </div>

            <div className="mt-3 rounded-3xl bg-gradient-to-r from-slate-50 to-blue-50 p-4 ring-1 ring-black/5">
              <div className="text-xs text-neutral-500">
                Ngày trả KQ (tự tính theo dịch vụ + ngày nhận)
              </div>
              <div className="mt-1 text-sm font-extrabold text-neutral-900">
                {form.dueDate ? new Date(form.dueDate).toLocaleString() : "—"}
              </div>
            </div>
          </section>

          {/* ===== Thanh toán + File + Hóa đơn ===== */}
          <section className="rounded-3xl bg-white p-4 ring-1 ring-black/5 shadow-sm">
            <div className="mb-3 text-sm font-bold text-neutral-900">
              Thanh toán & File
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-3 text-sm shadow-sm">
                <input
                  type="checkbox"
                  checked={form.paid}
                  onChange={(e) => set({ paid: e.target.checked })}
                />
                Đã thanh toán
              </label>

              {/* ✅ Tiền thu = auto, readonly */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-3">
                <div className="text-xs text-emerald-700">Tiền thu (auto)</div>
                <div className="text-base font-extrabold text-emerald-700">
                  {fmtMoney(form.collectedAmount ?? 0)}
                </div>
              </div>
            </div>

            {/* ✅ giữ đủ các checkbox file */}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-3 text-sm shadow-sm">
                <input
                  type="checkbox"
                  checked={form.glReturned}
                  onChange={(e) => set({ glReturned: e.target.checked })}
                />
                GL trả
              </label>
              <label className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-3 text-sm shadow-sm">
                <input
                  type="checkbox"
                  checked={form.gxReceived}
                  onChange={(e) => set({ gxReceived: e.target.checked })}
                />
                GX nhận
              </label>
              <label className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-3 text-sm shadow-sm">
                <input
                  type="checkbox"
                  checked={form.softFileDone}
                  onChange={(e) => set({ softFileDone: e.target.checked })}
                />
                Trả file mềm
              </label>
              <label className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-3 text-sm shadow-sm">
                <input
                  type="checkbox"
                  checked={form.hardFileDone}
                  onChange={(e) => set({ hardFileDone: e.target.checked })}
                />
                Trả file cứng
              </label>
            </div>

            <label className="mt-3 flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-3 text-sm shadow-sm">
              <input
                type="checkbox"
                checked={form.invoiceRequested}
                onChange={(e) => set({ invoiceRequested: e.target.checked })}
              />
              Xuất hóa đơn
            </label>

            {form.invoiceRequested && (
              <div className="mt-3">
                <div className="mb-1 text-xs text-neutral-500">
                  Thông tin xuất hóa đơn
                </div>
                <textarea
                  className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:ring-4 focus:ring-amber-200 min-h-[110px]"
                  value={form.invoiceInfo}
                  onChange={(e) => set({ invoiceInfo: e.target.value })}
                  placeholder="Tên, MST, địa chỉ..."
                />
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ✅ Modals chọn ngày */}
      
   

    </div>
  );
}
