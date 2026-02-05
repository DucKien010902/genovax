"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type PriceByLevel = { level: string; price: number };
type Service = {
  _id: string;
  serviceType: "NIPT" | "ADN" | "HPV";
  serviceCode: string;
  name: string;
  turnaroundHours?: number;
  pricesByLevel?: PriceByLevel[];
  isActive?: boolean;
};

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

function toneByType(t: Service["serviceType"]) {
  if (t === "NIPT") return "bg-rose-50 text-rose-700 ring-rose-200";
  if (t === "HPV") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  return "bg-blue-50 text-blue-700 ring-blue-200"; // ADN
}

function formatVND(n: number) {
  // nếu bạn đã có helper formatVND riêng thì dùng cái đó
  try {
    return new Intl.NumberFormat("vi-VN").format(n) + "đ";
  } catch {
    return String(n) + "đ";
  }
}

export default function AdminServicesPage() {
  const { user, isAdmin } = useAuth();
  const [items, setItems] = useState<Service[]>([]);
  const [serviceType, setServiceType] = useState<Service["serviceType"]>("ADN");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Service>>({
    serviceType: "ADN",
    serviceCode: "",
    name: "",
    turnaroundHours: 48,
    pricesByLevel: [{ level: "cap3", price: 0 }],
    isActive: true,
  });

  const pageTitle = useMemo(() => {
    if (serviceType === "NIPT") return "Quản lý Services • NIPT";
    if (serviceType === "HPV") return "Quản lý Services • HPV";
    return "Quản lý Services • ADN";
  }, [serviceType]);

  const load = async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await api.services(serviceType as any);
      setItems(res.items as any);
    } catch (e: any) {
      setErr(e?.message || "Load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceType]);

  const startCreate = () => {
    setEditingId(null);
    setForm({
      serviceType,
      serviceCode: "",
      name: "",
      turnaroundHours: 48,
      pricesByLevel: [{ level: "cap3", price: 0 }],
      isActive: true,
    });
  };

  const startEdit = (s: Service) => {
    setEditingId(s._id);
    setForm({
      ...s,
      pricesByLevel: (s.pricesByLevel || []).map((x) => ({ ...x })),
    });
  };

  const submit = async () => {
    setErr(null);
    try {
      if (!isAdmin) throw new Error("Chỉ admin được phép chỉnh.");
      if (!form.serviceType) throw new Error("serviceType required");
      if (!form.serviceCode?.trim()) throw new Error("serviceCode required");
      if (!form.name?.trim()) throw new Error("name required");

      const payload = {
        ...form,
        serviceCode: form.serviceCode.trim(),
        name: form.name.trim(),
        turnaroundHours: Number(form.turnaroundHours || 48),
        pricesByLevel: (form.pricesByLevel || [])
          .map((x) => ({
            level: String(x.level || "").trim(),
            price: Number(x.price || 0),
          }))
          .filter((x) => x.level),
        isActive: form.isActive !== false,
      };

      if (editingId) {
        const updated = await api.serviceUpdate(editingId, payload);
        setItems((prev) => prev.map((x) => (x._id === editingId ? updated : x)));
      } else {
        const created = await api.serviceCreate(payload);
        setItems((prev) => [created, ...prev]);
      }
      startCreate();
    } catch (e: any) {
      setErr(e?.message || "Save failed");
    }
  };

  const del = async (id: string) => {
    setErr(null);
    try {
      if (!isAdmin) throw new Error("Chỉ admin được phép xoá.");
      await api.serviceDelete(id);
      setItems((prev) => prev.filter((x) => x._id !== id));
      if (editingId === id) startCreate();
    } catch (e: any) {
      setErr(e?.message || "Delete failed");
    }
  };

  const addPriceRow = () => {
    setForm((p) => ({
      ...p,
      pricesByLevel: [...(p.pricesByLevel || []), { level: "", price: 0 }],
    }));
  };

  const updatePriceRow = (idx: number, patch: Partial<PriceByLevel>) => {
    setForm((p) => {
      const arr = [...(p.pricesByLevel || [])];
      arr[idx] = { ...(arr[idx] || { level: "", price: 0 }), ...patch };
      return { ...p, pricesByLevel: arr };
    });
  };

  const removePriceRow = (idx: number) => {
    setForm((p) => {
      const arr = [...(p.pricesByLevel || [])];
      arr.splice(idx, 1);
      return { ...p, pricesByLevel: arr };
    });
  };

  if (!user) return <div className="p-6">Bạn chưa đăng nhập.</div>;

  return (
    <div className="min-h-[calc(100vh-96px)] bg-gradient-to-b from-neutral-50 to-white">
      <div className="mx-auto max-w-[1400px] p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold tracking-tight text-neutral-900">
                  {pageTitle}
                </div>
                <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1", toneByType(serviceType))}>
                  {serviceType}
                </span>
                {isAdmin ? (
                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
                    Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600 ring-1 ring-black/5">
                    Read-only
                  </span>
                )}
              </div>

              <div className="mt-1 text-sm text-neutral-600">
                CRUD Service + bảng giá theo level • Giao diện hiện đại & dễ dùng
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <SelectPill
                value={serviceType}
                onChange={(v) => setServiceType(v as any)}
              />
              <button
                onClick={startCreate}
                className="rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-neutral-800 active:scale-[0.99]"
              >
                + Tạo mới
              </button>
            </div>
          </div>

          {err && (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {err}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Form */}
          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-neutral-900">
                  {editingId ? "Sửa Service" : "Tạo Service"}
                </div>
                <div className="mt-1 text-xs text-neutral-500">
                  Điền thông tin cơ bản + bảng giá theo level
                </div>
              </div>

              {editingId && (
                <span className="inline-flex items-center rounded-full bg-fuchsia-50 px-2.5 py-1 text-xs font-semibold text-fuchsia-700 ring-1 ring-fuchsia-200">
                  Editing
                </span>
              )}
            </div>

            <div className="mt-4 space-y-4">
              <Row label="serviceType">
                <select
                  value={form.serviceType || serviceType}
                  onChange={(e) => setForm((p) => ({ ...p, serviceType: e.target.value as any }))}
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:ring-4 focus:ring-indigo-200"
                >
                  <option value="NIPT">NIPT</option>
                  <option value="ADN">ADN</option>
                  <option value="HPV">HPV</option>
                </select>
              </Row>

              <Field
                label="serviceCode"
                placeholder="VD: ADN001"
                value={form.serviceCode || ""}
                onChange={(v) => setForm((p) => ({ ...p, serviceCode: v }))}
              />
              <Field
                label="name"
                placeholder="Tên dịch vụ"
                value={form.name || ""}
                onChange={(v) => setForm((p) => ({ ...p, name: v }))}
              />
              <Field
                label="turnaroundHours"
                placeholder="48"
                value={String(form.turnaroundHours ?? 48)}
                onChange={(v) => setForm((p) => ({ ...p, turnaroundHours: Number(v || 0) }))}
                rightHint="giờ"
                inputMode="numeric"
              />

              {/* Prices */}
              <div className="rounded-3xl border border-black/10 bg-neutral-50 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-neutral-900">Bảng giá theo level</div>
                    <div className="text-xs text-neutral-500">VD: cap1/cap2/cap3…</div>
                  </div>
                  <button
                    onClick={addPriceRow}
                    className="rounded-2xl bg-white px-3 py-2 text-xs font-bold text-neutral-900 ring-1 ring-black/10 shadow-sm hover:bg-neutral-50"
                  >
                    + Thêm dòng
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  {(form.pricesByLevel || []).map((x, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2">
                      <input
                        value={x.level}
                        onChange={(e) => updatePriceRow(idx, { level: e.target.value })}
                        placeholder="cap1"
                        className="col-span-5 rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-4 focus:ring-indigo-200"
                      />
                      <input
                        value={String(x.price)}
                        onChange={(e) => updatePriceRow(idx, { price: Number(e.target.value || 0) })}
                        placeholder="1000000"
                        inputMode="numeric"
                        className="col-span-5 rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-4 focus:ring-indigo-200"
                      />
                      <button
                        onClick={() => removePriceRow(idx)}
                        className="col-span-2 rounded-2xl bg-rose-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-500 active:scale-[0.99]"
                        title="Xoá dòng"
                      >
                        Xoá
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active */}
              <label className="flex items-center justify-between rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-sm">
                <div>
                  <div className="text-sm font-semibold text-neutral-900">Trạng thái</div>
                  <div className="text-xs text-neutral-500">Bật/tắt hiển thị service</div>
                </div>
                <input
                  type="checkbox"
                  checked={form.isActive !== false}
                  onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                  className="h-5 w-5 accent-indigo-600"
                />
              </label>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={submit}
                className="flex-1 rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-95 active:scale-[0.99]"
              >
                {editingId ? "Lưu thay đổi" : "Tạo Service"}
              </button>

              <button
                onClick={startCreate}
                className="rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm font-bold text-neutral-900 shadow-sm hover:bg-neutral-50"
              >
                Reset
              </button>
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-2 rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-neutral-900">
                  Danh sách Services
                </div>
                <div className="mt-1 text-xs text-neutral-500">
                  {loading ? "Đang tải dữ liệu…" : `${items.length} mục`}
                </div>
              </div>

              <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1", toneByType(serviceType))}>
                {serviceType}
              </span>
            </div>

            {/* ✅ không fix cứng: trang vẫn scroll bình thường
                Nếu bạn muốn list dài thì cuộn trong card, bật max-h ở dưới */}
            <div className="mt-4 space-y-3">
              {loading ? (
                <SkeletonList />
              ) : items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-black/10 bg-neutral-50 p-6 text-sm text-neutral-600">
                  Không có dữ liệu.
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((s) => {
                    const active = s.isActive !== false;
                    return (
                      <div
                        key={s._id}
                        className={cn(
                          "rounded-3xl border border-black/10 bg-white p-4 shadow-sm transition",
                          "hover:shadow-md"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="truncate text-base font-bold text-neutral-900">
                                {s.serviceCode} • {s.name}
                              </div>

                              <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ring-1", toneByType(s.serviceType))}>
                                {s.serviceType}
                              </span>

                              <span
                                className={cn(
                                  "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ring-1",
                                  active
                                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                    : "bg-rose-50 text-rose-700 ring-rose-200"
                                )}
                              >
                                {active ? "Active" : "Inactive"}
                              </span>

                              <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-700 ring-1 ring-black/5">
                                TAT {s.turnaroundHours ?? 48}h
                              </span>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-2">
                              {(s.pricesByLevel || []).length ? (
                                (s.pricesByLevel || []).map((p, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200"
                                  >
                                    {p.level}
                                    <span className="text-indigo-500">•</span>
                                    {formatVND(p.price)}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs text-neutral-500">—</span>
                              )}
                            </div>
                          </div>

                          <div className="flex shrink-0 gap-2">
                            <button
                              onClick={() => startEdit(s)}
                              className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-xs font-bold text-neutral-900 shadow-sm hover:bg-neutral-50"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => del(s._id)}
                              className="rounded-2xl bg-rose-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-500 active:scale-[0.99]"
                            >
                              Xoá
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Nếu bạn muốn LIST CUỘN TRONG CARD (khi quá dài), bật cái này:
                - bọc phần list bằng div className="mt-4 max-h-[70vh] overflow-auto pr-1"
                - và thêm scrollbar mảnh nếu bạn thích */}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- UI bits ---------- */

function SelectPill(props: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white px-3 py-2 shadow-sm">
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="bg-transparent text-sm font-semibold outline-none"
      >
        <option value="NIPT">NIPT</option>
        <option value="ADN">ADN</option>
        <option value="HPV">HPV</option>
      </select>
    </div>
  );
}

function Row(props: { label: string; children: any }) {
  return (
    <div>
      <div className="mb-1 text-xs font-semibold text-neutral-700">{props.label}</div>
      {props.children}
    </div>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rightHint?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div>
      <div className="mb-1 text-xs font-semibold text-neutral-700">{props.label}</div>
      <div className="relative">
        <input
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          inputMode={props.inputMode}
          className={cn(
            "w-full rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm shadow-sm outline-none",
            "focus:ring-4 focus:ring-indigo-200"
          )}
        />
        {props.rightHint && (
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400">
            {props.rightHint}
          </div>
        )}
      </div>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-3xl border border-black/10 bg-white p-4">
          <div className="h-4 w-2/3 rounded bg-neutral-100" />
          <div className="mt-3 h-3 w-1/3 rounded bg-neutral-100" />
          <div className="mt-3 flex gap-2">
            <div className="h-7 w-24 rounded-full bg-neutral-100" />
            <div className="h-7 w-28 rounded-full bg-neutral-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
