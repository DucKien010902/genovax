"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import LoadingOverlay from "@/components/LoadingOverlay";
import type { CatalogServiceItem, ServiceType } from "@/lib/types";

const SERVICE_TYPES: ServiceType[] = ["NIPT", "ADN", "HPV", "CELL"];

type FormState = {
  serviceCode: string;
  name: string;
  serviceType: ServiceType;
  turnaroundHours: string;
  note: string;
  isActive: boolean;
};

const defaultForm: FormState = {
  serviceCode: "",
  name: "",
  serviceType: "ADN",
  turnaroundHours: "48",
  note: "",
  isActive: true,
};

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

function statusTone(active: boolean) {
  return active
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
    : "bg-slate-100 text-slate-500 ring-slate-200";
}

function typeTone(type: ServiceType) {
  if (type === "NIPT") return "bg-rose-50 text-rose-700 ring-rose-200";
  if (type === "HPV") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (type === "CELL") return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-sky-50 text-sky-700 ring-sky-200";
}

export default function AdminServicesPage() {
  const { user, isAdmin } = useAuth();
  const [items, setItems] = useState<CatalogServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(defaultForm);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return items.filter((item) => {
      if (!keyword) return true;
      return (
        item.serviceCode.toLowerCase().includes(keyword) ||
        item.name.toLowerCase().includes(keyword)
      );
    });
  }, [items, search]);

  const load = async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await api.services("", true);
      setItems(res.items || []);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(defaultForm);
    setIsModalOpen(false);
  };

  const startEdit = (item: CatalogServiceItem) => {
    setEditingId(item._id);
    setForm({
      serviceCode: item.serviceCode,
      name: item.name,
      serviceType: item.serviceType,
      turnaroundHours: String(item.turnaroundHours ?? 48),
      note: item.note || "",
      isActive: item.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const submit = async () => {
    try {
      if (!isAdmin) throw new Error("Chỉ admin được quản lý danh mục dịch vụ.");
      setSaving(true);
      setErr(null);

      const payload = {
        serviceCode: form.serviceCode.trim(),
        name: form.name.trim(),
        serviceType: form.serviceType,
        turnaroundHours: Number(form.turnaroundHours || 48),
        note: form.note.trim(),
        isActive: form.isActive,
      };

      if (editingId) {
        const updated = await api.serviceUpdate(editingId, payload);
        setItems((prev) => prev.map((item) => (item._id === editingId ? updated : item)));
      } else {
        const created = await api.serviceCreate(payload);
        setItems((prev) => [created, ...prev]);
      }

      resetForm();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const del = async (id: string) => {
    if (!window.confirm("Xóa dịch vụ này khỏi danh mục tổng?")) return;

    try {
      setSaving(true);
      setErr(null);
      await api.serviceDelete(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <div className="p-6">Bạn chưa đăng nhập.</div>;
  if (!isAdmin) return <div className="p-6">Bạn không có quyền truy cập.</div>;

  return (
    <div className="min-h-[calc(100vh-96px)] bg-[linear-gradient(180deg,#f8fbff_0%,#eef6ff_36%,#ffffff_100%)]">
      {(loading || saving) && <LoadingOverlay isLoading={loading || saving} />}

      <div className="mx-auto max-w-[90%] space-y-6 p-4 sm:p-6">
        <section className="overflow-hidden rounded-[28px] border border-sky-100 bg-white shadow-[0_24px_80px_-48px_rgba(14,116,144,0.45)]">
          <div className="flex flex-col gap-5 bg-[radial-gradient(circle_at_top_left,#e0f2fe_0,#ffffff_50%)] p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">
                Service Catalog
              </span>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                  Danh mục dịch vụ tổng
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                  Bảng hiển thị lại theo kiểu gọn, sáng và dễ quét hơn: tách riêng STT,
                  mã dịch vụ, tên, nhóm, TAT và trạng thái; ghi chú chỉ giữ ở dạng mô tả ngắn.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              className="inline-flex h-11 items-center justify-center rounded-2xl bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500"
            >
              Thêm dịch vụ
            </button>
          </div>

          {err && (
            <div className="border-t border-rose-100 bg-rose-50/80 px-5 py-3 text-sm font-medium text-rose-700 sm:px-6">
              {err}
            </div>
          )}
        </section>

        <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.35)] sm:p-6">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">Bảng dịch vụ</div>
              <div className="mt-1 text-xs text-slate-500">
                {filteredItems.length} dịch vụ trong danh mục hiện tại
              </div>
            </div>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm mã hoặc tên dịch vụ..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100 sm:w-[320px]"
            />
          </div>

          <div className="overflow-x-auto rounded-[24px] border border-slate-200">
            <table className="w-full min-w-[980px] text-left text-sm text-slate-600">
              <thead className="bg-slate-50/90 text-xs uppercase tracking-[0.16em] text-slate-500">
                <tr>
                  <th className="px-4 py-4 text-center">STT</th>
                  <th className="px-4 py-4">Mã DV</th>
                  <th className="px-4 py-4">Tên dịch vụ</th>
                  <th className="px-4 py-4">Nhóm</th>
                  <th className="px-4 py-4 text-center">TAT</th>
                  <th className="px-4 py-4 text-center">Trạng thái</th>
                  <th className="px-4 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-sm text-slate-400">
                      Không có dịch vụ phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, index) => (
                    <tr key={item._id} className="transition hover:bg-sky-50/40">
                      <td className="px-4 py-4 text-center font-medium text-slate-400">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-900">{item.serviceCode}</td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-slate-900">{item.name}</div>
                        {item.note && (
                          <div className="mt-1 max-w-[260px] truncate text-xs text-slate-400">
                            {item.note}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1",
                            typeTone(item.serviceType),
                          )}
                        >
                          {item.serviceType}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">{item.turnaroundHours}h</td>
                      <td className="px-4 py-4 text-center">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1",
                            statusTone(item.isActive !== false),
                          )}
                        >
                          {item.isActive !== false ? "Đang dùng" : "Tạm ẩn"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEdit(item)}
                            className="inline-flex h-9 items-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => del(item._id)}
                            className="inline-flex h-9 items-center rounded-xl bg-rose-500 px-3 text-xs font-semibold text-white transition hover:bg-rose-400"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_40px_120px_-48px_rgba(15,23,42,0.55)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <div className="text-lg font-semibold text-slate-900">
                  {editingId ? "Cập nhật dịch vụ" : "Thêm dịch vụ"}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  Form ngắn gọn, ưu tiên đúng dữ liệu vận hành.
                </div>
              </div>
              <button
                onClick={resetForm}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 px-6 py-6 md:grid-cols-2">
              <Field
                label="Mã dịch vụ"
                value={form.serviceCode}
                onChange={(v) => setForm((prev) => ({ ...prev, serviceCode: v }))}
              />
              <Field
                label="Tên dịch vụ"
                value={form.name}
                onChange={(v) => setForm((prev) => ({ ...prev, name: v }))}
              />

              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Nhóm dịch vụ
                </div>
                <select
                  value={form.serviceType}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, serviceType: e.target.value as ServiceType }))
                  }
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                >
                  {SERVICE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <Field
                label="TAT (giờ)"
                value={form.turnaroundHours}
                onChange={(v) =>
                  setForm((prev) => ({
                    ...prev,
                    turnaroundHours: v.replace(/[^\d]/g, ""),
                  }))
                }
              />

              <div className="md:col-span-2">
                <Field
                  label="Ghi chú ngắn"
                  value={form.note}
                  onChange={(v) => setForm((prev) => ({ ...prev, note: v }))}
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Trạng thái hiển thị</div>
                    <div className="text-xs text-slate-400">
                      Dùng để bật hoặc ẩn dịch vụ trong danh mục tổng.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                    className="h-5 w-5 cursor-pointer accent-sky-600"
                  />
                </label>
              </div>
            </div>

            <div className="flex gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button
                onClick={submit}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl bg-sky-600 px-4 text-sm font-semibold text-white transition hover:bg-sky-500"
              >
                {editingId ? "Lưu thay đổi" : "Tạo dịch vụ"}
              </button>
              <button
                onClick={resetForm}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {props.label}
      </div>
      <input
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
      />
    </div>
  );
}
