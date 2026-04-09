"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import LoadingOverlay from "@/components/LoadingOverlay";
import type { DoctorItem } from "@/lib/types";

type DoctorForm = Partial<DoctorItem>;

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

function actionButtonTone(kind: "primary" | "secondary" | "danger") {
  if (kind === "primary") {
    return "bg-sky-600 text-white hover:bg-sky-500";
  }
  if (kind === "danger") {
    return "bg-rose-500 text-white hover:bg-rose-400";
  }
  return "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50";
}

export default function AdminDoctorsPage() {
  const router = useRouter();
  const { user, canManageClinics } = useAuth();

  const [items, setItems] = useState<DoctorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notePreview, setNotePreview] = useState<{
    title: string;
    note: string;
  } | null>(null);
  const [form, setForm] = useState<DoctorForm>({
    fullName: "",
    phone: "",
    address: "",
    salesOwner: "",
    agentTierLabel: "",
    note: "",
    isActive: true,
  });

  const filteredDoctors = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return items.filter((doctor) => {
      if (!keyword) return true;
      return (
        doctor.fullName.toLowerCase().includes(keyword) ||
        (doctor.phone || "").toLowerCase().includes(keyword) ||
        (doctor.salesOwner || "").toLowerCase().includes(keyword) ||
        (doctor.agentTierLabel || "").toLowerCase().includes(keyword)
      );
    });
  }, [items, search]);

  const load = async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await api.doctors("", true);
      setItems(res.items ?? []);
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
    setForm({
      fullName: "",
      phone: "",
      address: "",
      salesOwner: "",
      agentTierLabel: "",
      note: "",
      isActive: true,
    });
    setIsModalOpen(false);
  };

  const startEdit = (doctor: DoctorItem) => {
    setEditingId(doctor._id);
    setForm({
      fullName: doctor.fullName,
      phone: doctor.phone || "",
      address: doctor.address || "",
      salesOwner: doctor.salesOwner || "",
      agentTierLabel: doctor.agentTierLabel || "",
      note: doctor.note || "",
      isActive: doctor.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const submit = async () => {
    setErr(null);
    setLoading(true);
    setSaving(true);
    try {
      if (!canManageClinics) {
        throw new Error("Bạn không có quyền quản lý nguồn thu mẫu.");
      }
      if (!form.fullName?.trim()) {
        throw new Error("Yêu cầu nhập tên nguồn.");
      }
      if (editingId && !form.agentTierLabel?.trim()) {
        throw new Error("Yêu cầu nhập mã phòng khám.");
      }

      const basePayload = {
        fullName: form.fullName.trim(),
        phone: (form.phone || "").trim(),
        address: (form.address || "").trim(),
        salesOwner: (form.salesOwner || user?.name || "").trim(),
        note: (form.note || "").trim(),
        isActive: form.isActive !== false,
      };

      if (editingId) {
        const updated = await api.doctorUpdate(editingId, {
          ...basePayload,
          agentTierLabel: (form.agentTierLabel || "").trim(),
        });
        setItems((prev) =>
          prev.map((item) => (item._id === editingId ? updated : item)),
        );
      } else {
        const created = await api.doctorCreate(basePayload);
        setItems((prev) => [created, ...prev]);
      }

      resetForm();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
      setLoading(false);
    }
  };

  const del = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa nguồn này không?")) return;
    setErr(null);
    setLoading(true);
    try {
      if (!canManageClinics) throw new Error("Bạn không có quyền xóa.");
      await api.doctorDelete(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-6">Bạn chưa đăng nhập.</div>;

  return (
    <div className="min-h-[calc(100vh-96px)] bg-[linear-gradient(180deg,#f8fbff_0%,#eef5ff_38%,#ffffff_100%)]">
      {(loading || saving) && <LoadingOverlay isLoading={loading || saving} />}

      <div className="mx-auto max-w-[90%] space-y-6 p-4 sm:p-6">
        <section className="overflow-hidden rounded-[28px] border border-sky-100 bg-white shadow-[0_24px_80px_-48px_rgba(14,116,144,0.45)]">
          <div className="flex flex-col gap-5 bg-[radial-gradient(circle_at_top_left,#e0f2fe_0,#ffffff_50%)] p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">
                  Internal
                </span>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ring-1",
                    user.role === "sales"
                      ? "bg-amber-50 text-amber-700 ring-amber-200"
                      : "bg-indigo-50 text-indigo-700 ring-indigo-200",
                  )}
                >
                  {user.role === "sales" ? "NVKD" : "Admin"}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-sky-700 sm:text-3xl">
                  Dành cho phòng khám, bác sỹ, CTV  
                </h1>
                
              </div>
            </div>

            {canManageClinics && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => router.push("/admin/doctors/analytics")}
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50 px-5 text-sm font-semibold text-sky-700 shadow-sm transition hover:bg-sky-100"
                >
                  Thống kê doanh thu
                </button>
                <button
                  onClick={() => {
                    resetForm();
                    setIsModalOpen(true);
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-2xl bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500"
                >
                  Tạo phòng khám mới
                </button>
              </div>
            )}
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
              <div className="text-sm font-semibold text-slate-900">Bảng nguồn thu mẫu</div>
              <div className="mt-1 text-xs text-slate-500">
                {loading ? "Đang tải..." : `${filteredDoctors.length} nguồn`}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm tên nguồn, mã PK, SĐT hoặc NVKD..."
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100 sm:w-[320px]"
              />
              <button
                onClick={load}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50 px-4 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
              >
                Tải lại
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-[24px] border border-slate-200">
            <table className="w-full min-w-[980px] text-left text-sm text-slate-600">
              <thead className="bg-slate-50/90 text-xs uppercase tracking-[0.16em] text-slate-500">
                <tr>
                  <th className="px-4 py-4 text-center">STT</th>
                  <th className="px-4 py-4">Mã PK</th>
                  <th className="px-4 py-4">Tên phòng khám</th>
                  <th className="px-4 py-4">NVKD</th>
                  <th className="px-4 py-4">Số điện thoại</th>
                  <th className="px-4 py-4">Địa chỉ</th>
                  <th className="px-4 py-4 text-center">Dịch vụ</th>
                  <th className="px-4 py-4 text-center">Ghi chú</th>
                  <th className="px-4 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredDoctors.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-sm text-slate-400">
                      Không có dữ liệu phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredDoctors.map((doctor, index) => {
                    return (
                      <tr key={doctor._id} className="transition hover:bg-sky-50/40">
                        <td className="px-4 py-4 text-center font-medium text-slate-400">
                          {index + 1}
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200">
                            {doctor.agentTierLabel || "Chưa cấp"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-semibold text-slate-900">{doctor.fullName}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-medium text-slate-700">
                            {doctor.salesOwner || "Chưa gán"}
                          </div>
                        </td>
                        <td className="px-4 py-4">{doctor.phone || "—"}</td>
                        <td className="px-4 py-4">
                          <div className="max-w-[220px] truncate text-slate-500">
                            {doctor.address || "—"}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex min-w-10 justify-center rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-200">
                            {(doctor.servicePrices || []).length}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-center">
                          {doctor.note ? (
                            <button
                              onClick={() =>
                                setNotePreview({
                                  title: doctor.fullName,
                                  note: doctor.note || "",
                                })
                              }
                              className="inline-flex h-9 items-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                            >
                              Xem
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400">Không có</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => router.push(`/admin/doctors/${doctor._id}`)}
                              className={cn(
                                "inline-flex h-9 items-center rounded-xl px-3 text-xs font-semibold transition",
                                actionButtonTone("primary"),
                              )}
                            >
                              Dịch vụ
                            </button>
                            {canManageClinics && (
                              <>
                                <button
                                  onClick={() => startEdit(doctor)}
                                  className={cn(
                                    "inline-flex h-9 items-center rounded-xl px-3 text-xs font-semibold transition",
                                    actionButtonTone("secondary"),
                                  )}
                                >
                                  Sửa
                                </button>
                                <button
                                  onClick={() => del(doctor._id)}
                                  className={cn(
                                    "inline-flex h-9 items-center rounded-xl px-3 text-xs font-semibold transition",
                                    actionButtonTone("danger"),
                                  )}
                                >
                                  Xóa
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_40px_120px_-48px_rgba(15,23,42,0.55)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <div className="text-lg font-semibold text-slate-900">
                  {editingId ? "Cập nhật phòng khám" : "Tạo phòng khám mới"}
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  Chỉ giữ lại các trường cần thiết cho vận hành nội bộ.
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
                label="Tên phòng khám"
                value={form.fullName || ""}
                onChange={(v) => setForm((prev) => ({ ...prev, fullName: v }))}
              />
              <Field
                label="Số điện thoại"
                value={form.phone || ""}
                onChange={(v) => setForm((prev) => ({ ...prev, phone: v }))}
              />
              <Field
                label="Địa chỉ"
                value={form.address || ""}
                onChange={(v) => setForm((prev) => ({ ...prev, address: v }))}
              />
              <Field
                label="NVKD phụ trách"
                value={form.salesOwner || user.name || ""}
                onChange={(v) => setForm((prev) => ({ ...prev, salesOwner: v }))}
              />
              {editingId && (
                <Field
                  label="Mã phòng khám"
                  value={form.agentTierLabel || ""}
                  onChange={(v) => setForm((prev) => ({ ...prev, agentTierLabel: v }))}
                />
              )}
              <div className="md:col-span-2">
                <TextAreaField
                  label="Ghi chú"
                  value={form.note || ""}
                  onChange={(v) => setForm((prev) => ({ ...prev, note: v }))}
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Trạng thái hiển thị</div>
                    <div className="text-xs text-slate-400">
                      Tắt nếu muốn ẩn nguồn khỏi danh sách đang hoạt động.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.isActive !== false}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                    }
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
                {editingId ? "Lưu thay đổi" : "Tạo nguồn"}
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

      {notePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_40px_120px_-48px_rgba(15,23,42,0.55)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <div className="text-lg font-semibold text-slate-900">Ghi chú phòng khám</div>
                <div className="mt-1 text-xs text-slate-400">{notePreview.title}</div>
              </div>
              <button
                onClick={() => setNotePreview(null)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <div className="px-6 py-6">
              <div className="min-h-40 whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700">
                {notePreview.note}
              </div>
            </div>

            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button
                onClick={() => setNotePreview(null)}
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-sky-600 px-4 text-sm font-semibold text-white transition hover:bg-sky-500"
              >
                Đóng
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
        className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
      />
    </div>
  );
}

function TextAreaField(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {props.label}
      </div>
      <textarea
        rows={3}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
      />
    </div>
  );
}
