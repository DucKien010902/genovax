"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import LoadingOverlay from "@/components/LoadingOverlay";
import type { DoctorCatalogServiceRow, DoctorItem, ServiceType } from "@/lib/types";

const SERVICE_TYPES: Array<ServiceType | "ALL"> = ["ALL", "NIPT", "ADN", "HPV", "CELL"];

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

function typeTone(type: ServiceType) {
  if (type === "NIPT") return "bg-rose-50 text-rose-700 ring-rose-200";
  if (type === "HPV") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (type === "CELL") return "bg-amber-50 text-amber-700 ring-amber-200";
  return "bg-sky-50 text-sky-700 ring-sky-200";
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value || 0);
}

export default function DoctorServicesPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, canManageClinics } = useAuth();

  const doctorId = String(params?.id || "");

  const [doctor, setDoctor] = useState<DoctorItem | null>(null);
  const [rows, setRows] = useState<DoctorCatalogServiceRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, { listPrice: string; netPrice: string }>>(
    {},
  );
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [serviceTypeFilter, setServiceTypeFilter] = useState<ServiceType | "ALL">("ALL");

  const filteredRows = useMemo(() => {
    return rows.filter((row) =>
      serviceTypeFilter === "ALL" ? true : row.serviceType === serviceTypeFilter,
    );
  }, [rows, serviceTypeFilter]);

  const load = useCallback(async () => {
    if (!doctorId) return;
    setErr(null);
    setLoading(true);
    try {
      const [doctorRes, serviceRes] = await Promise.all([
        api.doctorGet(doctorId),
        api.doctorServices(doctorId),
      ]);

      setDoctor(doctorRes);
      setRows(serviceRes.items || []);

      const nextDrafts: Record<string, { listPrice: string; netPrice: string }> = {};
      for (const item of serviceRes.items || []) {
        nextDrafts[item.serviceId] = {
          listPrice: item.listPrice ? String(item.listPrice) : "",
          netPrice: item.netPrice ? String(item.netPrice) : "",
        };
      }
      setDrafts(nextDrafts);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    void load();
  }, [load]);

  const updateDraft = (
    serviceId: string,
    field: "listPrice" | "netPrice",
    value: string,
  ) => {
    setDrafts((prev) => ({
      ...prev,
      [serviceId]: {
        listPrice: prev[serviceId]?.listPrice || "",
        netPrice: prev[serviceId]?.netPrice || "",
        [field]: value.replace(/[^\d]/g, ""),
      },
    }));
  };

  const saveRow = async (row: DoctorCatalogServiceRow) => {
    try {
      setSavingId(row.serviceId);
      const draft = drafts[row.serviceId] || { listPrice: "", netPrice: "" };

      await api.doctorServiceUpsert(doctorId, row.serviceId, {
        listPrice: Number(draft.listPrice || 0),
        netPrice: Number(draft.netPrice || 0),
      });

      setRows((prev) =>
        prev.map((item) =>
          item.serviceId === row.serviceId
            ? {
                ...item,
                isConfigured: true,
                listPrice: Number(draft.listPrice || 0),
                netPrice: Number(draft.netPrice || 0),
              }
            : item,
        ),
      );
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Lưu dịch vụ thất bại.");
    } finally {
      setSavingId(null);
    }
  };

  const removeRow = async (row: DoctorCatalogServiceRow) => {
    if (!window.confirm(`Gỡ dịch vụ ${row.serviceCode} khỏi phòng khám này?`)) return;

    try {
      setSavingId(row.serviceId);
      await api.doctorServiceDelete(doctorId, row.serviceId);
      setRows((prev) =>
        prev.map((item) =>
          item.serviceId === row.serviceId
            ? { ...item, isConfigured: false, listPrice: 0, netPrice: 0 }
            : item,
        ),
      );
      setDrafts((prev) => ({
        ...prev,
        [row.serviceId]: { listPrice: "", netPrice: "" },
      }));
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Gỡ dịch vụ thất bại.");
    } finally {
      setSavingId(null);
    }
  };

  if (!user) return <div className="p-6">Bạn chưa đăng nhập.</div>;

  return (
    <div className="min-h-[calc(100vh-96px)] bg-[linear-gradient(180deg,#f8fbff_0%,#eef6ff_36%,#ffffff_100%)]">
      {(loading || !!savingId) && <LoadingOverlay isLoading={loading || !!savingId} />}

      <div className="mx-auto max-w-[1680px] space-y-6 p-4 sm:p-6">
        <section className="overflow-hidden rounded-[28px] border border-sky-100 bg-white shadow-[0_24px_80px_-48px_rgba(14,116,144,0.45)]">
          <div className="flex flex-col gap-5 bg-[radial-gradient(circle_at_top_left,#e0f2fe_0,#ffffff_50%)] p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              
              <div>
                <h1 className="text-2xl font-semibold text-sky-700 tracking-tight  sm:text-3xl">
                  Danh sách dịch vụ
                </h1>
                
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => router.push("/admin/doctors")}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Quay lại danh sách
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:grid-cols-2 xl:grid-cols-4 sm:px-6">
            <InfoCard label="Phòng khám" value={doctor?.fullName || "Đang tải..."} />
            <InfoCard label="Mã PK" value={doctor?.agentTierLabel || "Chưa cấp"} />
            <InfoCard label="NVKD" value={doctor?.salesOwner || "Chưa gán"} />
            <InfoCard label="Tổng dịch vụ" value={String(rows.length)} />
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
              <div className="text-sm font-semibold text-slate-900">Danh mục dịch vụ</div>
              <div className="mt-1 text-xs text-slate-500">
                Dịch vụ đã cấu hình sẽ hiện badge xanh và giữ nguyên giá nhập gần nhất.
              </div>
            </div>

            <select
              value={serviceTypeFilter}
              onChange={(e) => setServiceTypeFilter(e.target.value as ServiceType | "ALL")}
              className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
            >
              {SERVICE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type === "ALL" ? "Tất cả nhóm dịch vụ" : type}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto rounded-[24px] border border-slate-200">
            <table className="w-full min-w-[1180px] text-left text-sm text-slate-600">
              <thead className="bg-slate-50/90 text-xs uppercase tracking-[0.16em] text-slate-500">
                <tr>
                  <th className="px-4 py-4 text-center">STT</th>
                  <th className="px-4 py-4 text-center">Trạng thái</th>
                  <th className="px-4 py-4">Nhóm</th>
                  <th className="px-4 py-4">Mã DV</th>
                  <th className="px-4 py-4">Tên dịch vụ</th>
                  <th className="px-4 py-4 text-center">TAT</th>
                  <th className="px-4 py-4">Giá niêm yết</th>
                  <th className="px-4 py-4">Giá thu về</th>
                  <th className="px-4 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-sm text-slate-400">
                      Không có dịch vụ phù hợp với bộ lọc hiện tại.
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row, index) => {
                    const draft = drafts[row.serviceId] || { listPrice: "", netPrice: "" };
                    const activeSave = savingId === row.serviceId;

                    return (
                      <tr key={row.serviceId} className="transition hover:bg-sky-50/40">
                        <td className="px-4 py-4 text-center font-medium text-slate-400">
                          {index + 1}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1",
                              row.isConfigured
                                ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                : "bg-slate-100 text-slate-500 ring-slate-200",
                            )}
                          >
                            {row.isConfigured ? "Đã lưu" : "Chưa lưu"}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1",
                              typeTone(row.serviceType),
                            )}
                          >
                            {row.serviceType}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-semibold text-slate-900">
                          {row.serviceCode}
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-medium text-slate-900">{row.name}</div>
                          {row.note && (
                            <div className="mt-1 max-w-[280px] truncate text-xs text-slate-400">
                              {row.note}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">{row.turnaroundHours}h</td>
                        <td className="px-4 py-4">
                          <div className="space-y-2">
                            <input
                              value={draft.listPrice}
                              onChange={(e) =>
                                updateDraft(row.serviceId, "listPrice", e.target.value)
                              }
                              className="h-10 w-36 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                              placeholder="0"
                              disabled={!canManageClinics || activeSave}
                            />
                            <div className="text-xs text-slate-400">
                              Hiện tại: {formatCurrency(row.listPrice)} đ
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="space-y-2">
                            <input
                              value={draft.netPrice}
                              onChange={(e) =>
                                updateDraft(row.serviceId, "netPrice", e.target.value)
                              }
                              className="h-10 w-36 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                              placeholder="0"
                              disabled={!canManageClinics || activeSave}
                            />
                            <div className="text-xs text-slate-400">
                              Hiện tại: {formatCurrency(row.netPrice)} đ
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => saveRow(row)}
                              disabled={!canManageClinics || activeSave}
                              className="inline-flex h-10 items-center rounded-xl bg-sky-600 px-4 text-xs font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {row.isConfigured ? "Lưu lại" : "Lưu"}
                            </button>
                            {row.isConfigured && (
                              <button
                                onClick={() => removeRow(row)}
                                disabled={!canManageClinics || activeSave}
                                className="inline-flex h-10 items-center rounded-xl bg-rose-500 px-4 text-xs font-semibold text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Gỡ
                              </button>
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
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </div>
      <div className="mt-2 truncate text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}
