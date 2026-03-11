"use client";

import { useState } from "react";
import { CaseRecord } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

function Pill({
  text,
  tone,
}: {
  text: string;
  tone: "blue" | "rose" | "emerald" | "amber" | "slate";
}) {
  const map: Record<typeof tone, string> = {
    blue: "bg-blue-50 text-blue-700 ring-blue-200",
    rose: "bg-rose-50 text-rose-700 ring-rose-200",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    amber: "bg-amber-50 text-amber-800 ring-amber-200",
    slate: "bg-slate-50 text-slate-700 ring-slate-200",
  };
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${map[tone]} whitespace-nowrap`}
    >
      {text || "—"}
    </span>
  );
}

function Check({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-flex h-5 w-5 items-center justify-center rounded-md ring-1 ${ok ? "bg-emerald-600 text-white ring-emerald-700" : "bg-white text-neutral-400 ring-black/10"}`}
    >
      {ok ? "✓" : ""}
    </span>
  );
}

function Dot({ ok, title }: { ok: boolean; title?: string }) {
  return (
    <span
      title={title}
      className={`inline-block h-3 w-3 rounded-full shadow-sm ring-1 ring-inset ${ok ? "bg-emerald-500 ring-emerald-600/50" : "bg-rose-500 ring-rose-600/50"}`}
    />
  );
}

function SttBadge({
  stt,
  dueDate,
  processStatus,
}: {
  stt: number;
  dueDate: string | null;
  processStatus: string | null;
}) {
  const now = Date.now();
  let cls = "bg-slate-100 text-slate-700 ring-slate-200";

  if (processStatus === "Đã có KQ") {
    cls = "bg-white text-neutral-400 ring-black/10";
  } else if (dueDate) {
    const t = new Date(dueDate).getTime();
    const diff = t - now;

    if (Number.isFinite(t)) {
      if (diff < 0) cls = "bg-red-600 text-white ring-violet-700";
      else if (diff < 12 * 60 * 60 * 1000)
        cls = "bg-yellow-600 text-white ring-rose-700";
      else if (diff < 24 * 60 * 60 * 1000)
        cls = "bg-blue-500 text-white ring-amber-600";
      else cls = "bg-green-600 text-white ring-emerald-700";
    }
  }

  return (
    <span
      className={`inline-flex h-6 min-w-6 items-center justify-center rounded-lg px-1.5 text-[11px] font-extrabold ring-1 ${cls}`}
      title={
        dueDate
          ? `Hạn KQ: ${new Date(dueDate).toLocaleString()}`
          : "Chưa có hạn KQ"
      }
    >
      {stt}
    </span>
  );
}

const thBase =
  "px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap border-r border-black/5 align-middle";
const tdBase =
  "px-3 py-2 text-left text-[12px] leading-5 border-r border-black/5 align-middle";
const wrap2 = "line-clamp-2 break-words whitespace-normal";

export default function CasesTable({
  rows,
  loading,
  onRowClick,
  fetchCases,
}: {
  rows: CaseRecord[];
  loading?: boolean;
  onRowClick: (r: CaseRecord) => void;
  fetchCases?: () => void;
}) {
  const { user } = useAuth();

  const isAccountingAdmin = user?.role === "accounting_admin";
  const isAdminOrSuper = user?.role === "admin" || user?.role === "super_admin";
  const colCount = isAccountingAdmin ? 14 : 12;

  // ✅ State quản lý Modal Lịch sử
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedCaseInfo, setSelectedCaseInfo] = useState<{
    patientName: string;
    changes: any[];
  }>({ patientName: "", changes: [] });

  // ✅ State quản lý các dòng được Ghim (Highlight Vàng)
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  
  // ✅ State quản lý dòng Đang được chọn (Highlight Xanh)
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  // Hàm xử lý Ghim/Bỏ ghim
  const togglePin = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra dòng (tránh mở Drawer)
    setPinnedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDelete = async (
    e: React.MouseEvent,
    caseId: string,
    patientName: string,
  ) => {
    e.stopPropagation();
    if (
      !window.confirm(
        `Bạn có chắc chắn muốn xóa ca của khách hàng "${patientName || "Không tên"}" không? Hành động này không thể hoàn tác.`,
      )
    )
      return;

    try {
      await api.deleteCase(caseId);
      if (fetchCases) fetchCases();
      else window.location.reload();
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      alert("Đã xảy ra lỗi khi xóa ca. Vui lòng thử lại!");
    }
  };

  return (
    <>
      <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
        <div className="min-h-[36vh] max-h-[72vh] overflow-auto">
          <table
            className={`w-full table-fixed text-neutral-900 ${isAccountingAdmin ? "min-w-[1150px]" : "min-w-[1020px]"}`}
          >
            <colgroup>
              <col className="w-[56px]" />
              <col className="w-[80px]" />
              <col className="w-[110px]" />
              <col className="w-[130px]" />
              {isAccountingAdmin && <col className="w-[90px]" />}
              {isAccountingAdmin && <col className="w-[90px]" />}
              <col className="w-[140px]" />
              <col className="w-[140px]" />
              <col className="w-[80px]" />
              <col className="w-[90px]" />
              <col className="w-[160px]" />
              <col className="w-[64px]" />
              {isAccountingAdmin && <col className="w-[100px]" />}
              <col className="w-[110px]" />
              {isAccountingAdmin && <col className="w-[100px]" />}
              {isAccountingAdmin && <col className="w-[100px]" />}
              <col className={isAdminOrSuper ? "w-[120px]" : "w-[92px]"} />
            </colgroup>

            <thead className="sticky top-0 z-10">
              <tr className="border-b bg-white text-neutral-600">
                <th
                  className={`${thBase} sticky left-0 z-50 bg-white shadow-[1px_0_0_rgba(0,0,0,0.06)]`}
                >
                  STT
                </th>
                <th className={`${thBase} bg-neutral-50`}>Ngày</th>
                <th className={`${thBase} bg-white`}>Trạng thái</th>
                <th className={`${thBase} bg-neutral-50`}>Mã ca</th>
                {isAccountingAdmin && (
                  <th className={`${thBase} bg-white text-center`}>Xuất HĐ</th>
                )}
                {isAccountingAdmin && (
                  <th className={`${thBase} bg-neutral-50 text-center`}>
                    Nhập Cost
                  </th>
                )}
                <th className={`${thBase} bg-white`}>Họ và tên</th>
                <th className={`${thBase} bg-white`}>Nguồn</th>
                <th className={`${thBase} bg-neutral-50`}>NVKD</th>
                <th className={`${thBase} bg-white`}>Dịch vụ</th>
                <th className={`${thBase} bg-neutral-50`}>Tên dịch vụ</th>
                <th className={`${thBase} bg-white`}>Đã TT</th>
                {isAccountingAdmin && (
                  <th className={`${thBase} bg-neutral-50 `}>Kiểu TT</th>
                )}
                {isAccountingAdmin && (
                  <th className={`${thBase} bg-neutral-50 `}>Đã nhận TT</th>
                )}
                {isAccountingAdmin && (
                  <th className={`${thBase} bg-neutral-50 `}>Giá cost</th>
                )}
                <th className={`${thBase} bg-neutral-50 `}>Tiền thu</th>

                {isAccountingAdmin && (
                  <th className={`${thBase} bg-neutral-50 `}>Lợi nhuận</th>
                )}

                {isAdminOrSuper && (
                  <th className={`${thBase} bg-white border-r-0 `}>
                    Hành động
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading && rows.length === 0 ? (
                <tr>
                  <td
                    className="px-4 py-6 text-neutral-500 text-center align-middle"
                    colSpan={colCount}
                  >
                    Đang tải…
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    className="px-4 py-6 text-neutral-500 text-center align-middle"
                    colSpan={colCount}
                  >
                    Chưa có dữ liệu.
                  </td>
                </tr>
              ) : (
                rows.map((r, idx) => {
                  const isPinned = pinnedIds.includes(r._id);
                  const isActive = activeRowId === r._id; // ✅ Kiểm tra xem dòng này có đang được Active không
                  
                  // ✅ Logic trộn màu nền cho nguyên dòng
                  let rowBgClass = "odd:bg-white even:bg-neutral-50/40 hover:bg-sky-50";
                  if (isActive) {
                    rowBgClass = "bg-amber-100 hover:bg-amber-200 z-10 relative shadow-sm ring-1 ring-amber-200";
                  } else if (isPinned) {
                    rowBgClass = "bg-amber-100 hover:bg-amber-200";
                  }

                  // ✅ Logic trộn màu nền riêng cho ô STT (bị dính sticky nên phải xử lý riêng)
                  let sttBgClass = "bg-white hover:bg-neutral-100";
                  if (isActive) {
                    sttBgClass = "bg-amber-100 hover:bg-amber-200";
                  } else if (isPinned) {
                    sttBgClass = "bg-amber-100 hover:bg-amber-200";
                  }

                  return (
                    <tr
                      key={r._id}
                      onClick={() => {
                        setActiveRowId(r._id); // ✅ Cập nhật ID dòng đang active
                        onRowClick(r);         // Gọi hàm mở Drawer
                      }}
                      className={`cursor-pointer transition-colors duration-200 ${rowBgClass}`}
                    >
                      <td 
                        className={`px-3 py-2 sticky left-0 z-0 border-r border-black/5 align-middle cursor-cell transition-colors duration-200 ${sttBgClass}`}
                        onClick={(e) => togglePin(e, r._id)}
                        title="Click để Ghim / Bỏ ghim dòng này"
                      >
                        <div className="relative inline-block w-full text-center">
                          <SttBadge
                            stt={r.stt || idx + 1}
                            dueDate={r.dueDate}
                            processStatus={r.processStatus}
                          />
                          {isPinned && (
                            <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-[9px] text-white shadow-sm ring-1 ring-white">
                              ★
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={`${tdBase} text-sky-700 font-medium`}>
                        {r.receivedAt
                          ? new Date(r.receivedAt).toLocaleDateString("vi-VN")
                          : "—"}
                      </td>
                      <td className={tdBase}>
                        <Pill text={r.processStatus || "—"} tone="slate" />
                      </td>
                      <td
                        className={`${tdBase} font-extrabold text-indigo-900 whitespace-nowrap`}
                      >
                        {r.caseCode || "—"}
                      </td>
                      {isAccountingAdmin && (
                        <td className={`${tdBase} text-center`}>
                          <div className="flex h-full items-center justify-center">
                            <Pill text="Chưa xuất" tone="rose" />
                          </div>
                        </td>
                      )}
                      {isAccountingAdmin && (
                        <td className={`${tdBase} text-center`}>
                          <div className="flex h-full items-center justify-center">
                            <Pill
                              text={
                                (r.costPrice ?? 0) > 0 ? "Đã nhập " : "Chưa nhập "
                              }
                              tone={(r.costPrice ?? 0) > 0 ? "emerald" : "rose"}
                            />
                          </div>
                        </td>
                      )}
                      <td className={tdBase}>
                        <div className={`${wrap2} font-semibold`}>
                          {r.patientName || "—"}
                        </div>
                      </td>
                      <td className={tdBase}>
                        <div className={`${wrap2} text-neutral-700`}>
                          {r.source || "—"}
                        </div>
                      </td>
                      <td className={tdBase}>
                        <div className={`${wrap2} text-emerald-800 font-medium`}>
                          {r.salesOwner || "—"}
                        </div>
                      </td>
                      <td className={tdBase}>
                        <Pill
                          text={r.serviceType}
                          tone={
                            r.serviceType === "NIPT"
                              ? "rose"
                              : r.serviceType === "ADN"
                                ? "blue"
                                : "emerald"
                          }
                        />
                      </td>
                      <td className={tdBase}>
                        <div className={`${wrap2} font-semibold text-violet-900`}>
                          {r.serviceName || "—"}
                        </div>
                        <div className="mt-0.5 text-[11px] text-neutral-500 break-words">
                          {r.serviceCode || ""}
                        </div>
                      </td>
                      <td className={tdBase}>
                        <div className="w-fit">
                          <Check ok={!!r.paid} />
                        </div>
                      </td>
                      {isAccountingAdmin && (
                        <td className="px-3 py-2 text-center text-[10px] font-bold tabular-nums text-green-600 border-r border-black/5 whitespace-nowrap align-middle">
                          {r.paymentMethod || "Không có"}
                        </td>
                      )}
                      {isAccountingAdmin && (
                        <td className="px-3 py-2 text-center text-[12px] font-extrabold tabular-nums text-blue-900 border-r border-black/5 whitespace-nowrap align-middle">
                          {(r.receivedAmount ?? 0).toLocaleString()}
                        </td>
                      )}
                      {isAccountingAdmin && (
                        <td className="px-3 py-2 text-center text-[12px] font-extrabold tabular-nums text-amber-900 border-r border-black/5 whitespace-nowrap align-middle">
                          {(r.costPrice ?? 0).toLocaleString()}
                        </td>
                      )}

                      <td className="px-3 py-2 text-center text-[12px] font-extrabold tabular-nums text-amber-900 border-r border-black/5 whitespace-nowrap align-middle">
                        {(r.collectedAmount ?? 0).toLocaleString()}
                      </td>

                      {isAccountingAdmin && (
                        <td className="px-3 py-2 text-center text-[12px] font-extrabold tabular-nums text-red-600 border-r border-black/5 whitespace-nowrap align-middle">
                          {(
                            (r.collectedAmount || 0) - (r.costPrice || 0)
                          ).toLocaleString()}
                        </td>
                      )}
                      {/* Cột Hành động */}
                      <td className="px-3 py-2 border-r-0 text-center align-middle">
                        <div className="flex justify-center gap-2 ">
                          {isAdminOrSuper && (
                            <>
                              <button
                                className="cursor-pointer rounded-lg bg-sky-600 px-2.5 py-1 text-[11px] font-bold text-white hover:opacity-95 whitespace-nowrap"
                                onClick={(e) => {
                                  e.stopPropagation();

                                  const sortedChanges = r.changes
                                    ? [...r.changes].sort(
                                        (a, b) =>
                                          new Date(b.changedAt).getTime() -
                                          new Date(a.changedAt).getTime(),
                                      )
                                    : [];

                                  setSelectedCaseInfo({
                                    patientName: r.patientName || "Không tên",
                                    changes: sortedChanges,
                                  });
                                  setHistoryModalOpen(true);
                                }}
                              >
                                Lịch sử
                              </button>
                              <button
                                className="cursor-pointer rounded-lg bg-rose-500 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-rose-600 whitespace-nowrap"
                                onClick={(e) =>
                                  handleDelete(e, r._id, r.patientName || "")
                                }
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

        <div className="flex items-center justify-between px-4 py-3 text-[11px] text-neutral-500 border-t bg-neutral-50">
          <div>
            Tip: Click vào bảng để xem ca (Dòng <b>màu xanh</b>). Click vào ô STT để <b>Ghim (★)</b>.
          </div>
          <div>
            Tổng: <b className="text-neutral-900">{rows.length}</b>
          </div>
        </div>
      </div>

      {/* ✅ MODAL HIỂN THỊ LỊCH SỬ CHỈNH SỬA (Giữ nguyên như của bạn) */}
      {historyModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm transition-opacity"
          onClick={() => setHistoryModalOpen(false)}
        >
          <div
            className="w-full max-w-lg flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="px-5 py-4 border-b bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Lịch sử thao tác dữ liệu
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tên khách hàng:{" "}
                  <span className="font-semibold text-slate-700">
                    {selectedCaseInfo.patientName}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setHistoryModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            {/* Body Modal */}
            <div className="p-5 max-h-[60vh] overflow-y-auto bg-white">
              {selectedCaseInfo.changes.length === 0 ? (
                <div className="text-center py-6 text-sm text-slate-500 italic">
                  Chưa có lịch sử lưu vết cho ca này.
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedCaseInfo.changes.map((log, idx) => (
                    <div key={idx} className="relative flex gap-4">
                      {idx !== selectedCaseInfo.changes.length - 1 && (
                        <div className="absolute left-4 top-8 bottom-[-16px] w-[2px] bg-slate-100"></div>
                      )}
                      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 ring-4 ring-white">
                        <span className="text-xs font-bold text-sky-700">
                          {log.name ? log.name.charAt(0).toUpperCase() : "?"}
                        </span>
                      </div>
                      <div className="flex-1 rounded-xl bg-slate-50 p-3 border border-slate-100">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[13px] font-bold text-slate-800">{log.name}</p>
                          </div>
                          <span className="shrink-0 rounded bg-white px-2 py-0.5 text-[10px] font-semibold text-sky-600 ring-1 ring-slate-200">
                            {log.action || "Thao tác"}
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          {new Date(log.changedAt).toLocaleString("vi-VN", {
                            hour: "2-digit", minute: "2-digit", second: "2-digit",
                            day: "2-digit", month: "2-digit", year: "numeric",
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}