"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type Doctor = {
  _id: string;
  fullName: string;
  phone?: string;
  address?: string;
  agentLevel?: string;
  agentTierLabel?: string;
  note?: string;
  isActive?: boolean;
};

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

function pillTone(level?: string) {
  const v = (level || "").toLowerCase();
  if (v.includes("cap1")) return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (v.includes("cap2")) return "bg-blue-50 text-blue-700 ring-blue-200";
  if (v.includes("cap3")) return "bg-amber-50 text-amber-800 ring-amber-200";
  return "bg-neutral-100 text-neutral-700 ring-black/5";
}

export default function AdminDoctorsPage() {
  const { user, isAdmin } = useAuth();

  const [items, setItems] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<Doctor>>({
    fullName: "",
    phone: "",
    address: "",
    agentLevel: "cap3",
    agentTierLabel: "",
    note: "",
    isActive: true,
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const title = useMemo(() => "Quản lý Doctors", []);

  const load = async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await api.doctors(search);
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
  }, []);

  const startCreate = () => {
    setEditingId(null);
    setForm({
      fullName: "",
      phone: "",
      address: "",
      agentLevel: "cap3",
      agentTierLabel: "",
      note: "",
      isActive: true,
    });
  };

  const startEdit = (d: Doctor) => {
    setEditingId(d._id);
    setForm({ ...d });
  };

  const submit = async () => {
    setErr(null);
    try {
      if (!form.fullName?.trim()) throw new Error("fullName required");
      if (!isAdmin) throw new Error("Chỉ admin được phép chỉnh.");

      const payload: Partial<Doctor> = {
        ...form,
        fullName: form.fullName.trim(),
        phone: (form.phone || "").trim(),
        address: (form.address || "").trim(),
        agentLevel: (form.agentLevel || "").trim(),
        agentTierLabel: (form.agentTierLabel || "").trim(),
        note: (form.note || "").trim(),
        isActive: form.isActive !== false,
      };

      if (editingId) {
        const updated = await api.doctorUpdate(editingId, payload);
        setItems((prev) => prev.map((x) => (x._id === editingId ? updated : x)));
      } else {
        const created = await api.doctorCreate(payload);
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
      await api.doctorDelete(id);
      setItems((prev) => prev.filter((x) => x._id !== id));
      if (editingId === id) startCreate();
    } catch (e: any) {
      setErr(e?.message || "Delete failed");
    }
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
                  {title}
                </div>

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
                CRUD Doctor (admin mới được sửa/xóa/thêm) • Giao diện đồng bộ & hiện đại
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
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
                  {editingId ? "Sửa Doctor" : "Tạo Doctor"}
                </div>
                <div className="mt-1 text-xs text-neutral-500">
                  Nhập thông tin cơ bản + level đại lý
                </div>
              </div>

              {editingId && (
                <span className="inline-flex items-center rounded-full bg-fuchsia-50 px-2.5 py-1 text-xs font-semibold text-fuchsia-700 ring-1 ring-fuchsia-200">
                  Editing
                </span>
              )}
            </div>

            <div className="mt-4 space-y-4">
              <Field
                label="Họ tên"
                value={form.fullName || ""}
                onChange={(v) => setForm((p) => ({ ...p, fullName: v }))}
                placeholder="Nguyễn Văn A"
              />
              <Field
                label="SĐT"
                value={form.phone || ""}
                onChange={(v) => setForm((p) => ({ ...p, phone: v }))}
                placeholder="098xxxxxxx"
              />
              <Field
                label="Địa chỉ"
                value={form.address || ""}
                onChange={(v) => setForm((p) => ({ ...p, address: v }))}
                placeholder="Số nhà, đường, quận/huyện..."
              />

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field
                  label="Agent level"
                  value={form.agentLevel || ""}
                  onChange={(v) => setForm((p) => ({ ...p, agentLevel: v }))}
                  placeholder="cap1/cap2/cap3..."
                  rightHint="level"
                />
                <Field
                  label="Tier label"
                  value={form.agentTierLabel || ""}
                  onChange={(v) => setForm((p) => ({ ...p, agentTierLabel: v }))}
                  placeholder="VD: Đại lý vàng"
                  rightHint="tag"
                />
              </div>

              <Field
                label="Ghi chú"
                value={form.note || ""}
                onChange={(v) => setForm((p) => ({ ...p, note: v }))}
                placeholder="Ghi chú nội bộ..."
              />

              <ToggleCard
                label="Trạng thái"
                desc="Bật/tắt hiển thị doctor"
                checked={form.isActive !== false}
                onChange={(v) => setForm((p) => ({ ...p, isActive: v }))}
              />
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={submit}
                className="flex-1 rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-95 active:scale-[0.99]"
              >
                {editingId ? "Lưu thay đổi" : "Tạo Doctor"}
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-bold text-neutral-900">Danh sách Doctors</div>
                <div className="mt-1 text-xs text-neutral-500">
                  {loading ? "Đang tải…" : `${items.length} mục`}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm theo tên / sđt..."
                    className="w-[260px] max-w-full rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:ring-4 focus:ring-indigo-200"
                  />
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-400">
                    ⌕
                  </div>
                </div>

                <button
                  onClick={load}
                  className="rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-neutral-800 active:scale-[0.99]"
                >
                  Tải
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {loading ? (
                <SkeletonList />
              ) : items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-black/10 bg-neutral-50 p-6 text-sm text-neutral-600">
                  Không có dữ liệu.
                </div>
              ) : (
                items.map((d) => {
                  const active = d.isActive !== false;
                  return (
                    <div
                      key={d._id}
                      className={cn(
                        "rounded-3xl border border-black/10 bg-white p-4 shadow-sm transition",
                        "hover:shadow-md"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="truncate text-base font-bold text-neutral-900">
                              {d.fullName}
                            </div>

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

                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ring-1",
                                pillTone(d.agentLevel)
                              )}
                            >
                              {d.agentLevel || "—"}
                            </span>

                            {d.agentTierLabel ? (
                              <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-200">
                                {d.agentTierLabel}
                              </span>
                            ) : null}
                          </div>

                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral-600">
                            <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 ring-1 ring-black/5">
                              ☎ {d.phone || "—"}
                            </span>
                            {d.address ? (
                              <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 ring-1 ring-black/5">
                                📍 <span className="max-w-[520px] truncate">{d.address}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 ring-1 ring-black/5">
                                📍 —
                              </span>
                            )}
                          </div>

                          {d.note ? (
                            <div className="mt-2 text-xs text-neutral-500 line-clamp-2">
                              {d.note}
                            </div>
                          ) : null}
                        </div>

                        <div className="flex shrink-0 gap-2">
                          <button
                            onClick={() => startEdit(d)}
                            className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-xs font-bold text-neutral-900 shadow-sm hover:bg-neutral-50"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => del(d._id)}
                            className="rounded-2xl bg-rose-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-500 active:scale-[0.99]"
                          >
                            Xoá
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Nếu muốn list cuộn trong card khi dài (không ảnh hưởng scroll trang), bọc list:
                <div className="mt-4 max-h-[70vh] overflow-auto pr-1 space-y-3"> ... </div>
            */}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------- UI components -------- */

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rightHint?: string;
}) {
  return (
    <div>
      <div className="mb-1 text-xs font-semibold text-neutral-700">{props.label}</div>
      <div className="relative">
        <input
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
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

function ToggleCard(props: {
  label: string;
  desc?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-sm">
      <div>
        <div className="text-sm font-semibold text-neutral-900">{props.label}</div>
        {props.desc ? <div className="text-xs text-neutral-500">{props.desc}</div> : null}
      </div>
      <input
        type="checkbox"
        checked={props.checked}
        onChange={(e) => props.onChange(e.target.checked)}
        className="h-5 w-5 accent-indigo-600"
      />
    </label>
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
            <div className="h-7 w-28 rounded-full bg-neutral-100" />
            <div className="h-7 w-32 rounded-full bg-neutral-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
