"use client";

import { useState, useRef } from "react";
import { CaseRecord, ChangeLog } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

// ✅ Import thêm thư viện in và Template
import { useReactToPrint } from "react-to-print";
import { CasePdfTemplate } from "./CasePdfTemplate";

function Pill({
  text,
  tone,
}: {
  text: string;
  tone: "blue" | "rose" | "emerald" | "amber" | "slate";
}) {
  const map: Record<typeof tone, string> = {
    blue: "bg-sky-50 text-sky-700 ring-sky-200",
    rose: "bg-rose-50 text-rose-700 ring-rose-200",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
  };
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${map[tone]} whitespace-nowrap`}
    >
      {text || "—"}
    </span>
  );
}

function Check({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-flex h-5 w-5 items-center justify-center rounded-md ring-1 ${ok ? "bg-emerald-500 text-white ring-emerald-600" : "bg-white text-neutral-400 ring-slate-200"}`}
    >
      {ok ? "✓" : ""}
    </span>
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
  const [now] = useState(() => Date.now());
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
  "px-3 py-3 text-center text-[11px] font-bold uppercase tracking-[0.08em] whitespace-nowrap border-r border-slate-200/80 align-middle text-slate-600";
const tdBase =
  "px-3 py-3 text-left text-[13px] leading-5 border-r border-slate-200/80 align-middle text-slate-700";
const wrap2 = "line-clamp-2 break-words whitespace-normal";

export default function CasesTable({
  rows,
  loading,
  onRowClick,
  fetchCases,
  onQuickPaidChange,
}: {
  rows: CaseRecord[];
  loading?: boolean;
  onRowClick: (r: CaseRecord) => void;
  fetchCases?: () => void;
  onQuickPaidChange: (row: CaseRecord, paid: boolean) => Promise<void>;
}) {
  const { user } = useAuth();

  const isAccountingAdmin = user?.role === "accounting_admin";
  const isAdminOrSuper = user?.role === "admin" || user?.role === "super_admin";
  const colCount = isAccountingAdmin ? 14 : 12;

  // ✅ State quản lý Modal Lịch sử
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedCaseInfo, setSelectedCaseInfo] = useState<{
    patientName: string;
    changes: ChangeLog[];
  }>({ patientName: "", changes: [] });

  // ✅ State quản lý các dòng được Ghim (Highlight Vàng)
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);

  // ✅ State quản lý dòng Đang được chọn (Highlight Xanh)
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  // ✅ KHỞI TẠO STATE & REF CHO TÍNH NĂNG IN PDF
  const printRef = useRef<HTMLDivElement>(null);
  const [printData, setPrintData] = useState<CaseRecord | null>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef, // ✅ Sửa thành contentRef và truyền thẳng ref vào
    documentTitle: `Phieu_Ca_${printData?.caseCode || "XN"}`,
    onAfterPrint: () => setPrintData(null),
  });

  const handleExportPDF = (e: React.MouseEvent, record: CaseRecord) => {
    e.stopPropagation(); // Không cho nổi bọt (tránh mở Drawer chi tiết ca)
    setPrintData(record);
    // Timeout nhỏ để React kịp nhét dữ liệu vào component ẩn trước khi gọi hộp thoại in
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  // Hàm xử lý Ghim/Bỏ ghim
  const togglePin = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra dòng (tránh mở Drawer)
    setPinnedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
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
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[28px] border border-sky-100 bg-white shadow-[0_24px_80px_-48px_rgba(14,116,144,0.35)]">
        <div className="min-h-0 flex-1 overflow-auto overscroll-contain bg-[linear-gradient(180deg,#f8fbff_0%,#eef6ff_36%,#ffffff_100%)]">
          <table
            className={`w-full table-fixed text-slate-900 ${isAccountingAdmin ? "min-w-[1150px]" : "min-w-[1020px]"}`}
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
              {/* Tăng độ rộng cột hành động lên để chứa đủ 3 nút */}
              <col className={isAdminOrSuper ? "w-[112px]" : "w-[112px]"} />
            </colgroup>

            <thead className="sticky top-0 z-10">
              <tr className="border-b border-sky-100 bg-[linear-gradient(180deg,rgba(240,249,255,0.98),rgba(248,250,252,0.96))] text-slate-600 backdrop-blur">
                <th
                  className={`${thBase} sticky left-0 z-50 bg-sky-50/95 shadow-[1px_0_0_rgba(186,230,253,0.9)]`}
                >
                  STT
                </th>
                <th className={`${thBase} bg-sky-50/95`}>Ngày</th>
                <th className={`${thBase} bg-white/80`}>Trạng thái</th>
                <th className={`${thBase} bg-sky-50/95`}>Mã ca</th>
                {isAccountingAdmin && (
                  <th className={`${thBase} bg-white/80 text-center`}>
                    Xuất HĐ
                  </th>
                )}
                {isAccountingAdmin && (
                  <th className={`${thBase} bg-sky-50/95 text-center`}>
                    Nhập Cost
                  </th>
                )}
                <th className={`${thBase} bg-white/80`}>Họ và tên</th>
                <th className={`${thBase} bg-sky-50/95`}>Nguồn</th>
                <th className={`${thBase} bg-white/80`}>NVKD</th>
                <th className={`${thBase} bg-sky-50/95`}>Dịch vụ</th>
                <th className={`${thBase} bg-white/80`}>Tên dịch vụ</th>
                <th className={`${thBase} bg-sky-50/95`}>Đã TT</th>
                {isAccountingAdmin && (
                  <th className={`${thBase} bg-white/80`}>Kiểu TT</th>
                )}
                {isAccountingAdmin && (
                  <th className={`${thBase} bg-sky-50/95`}>Đã nhận TT</th>
                )}
                {isAccountingAdmin && (
                  <th className={`${thBase} bg-white/80`}>Giá cost</th>
                )}
                <th className={`${thBase} bg-sky-50/95`}>Tiền thu</th>

                {isAccountingAdmin && (
                  <th className={`${thBase} bg-white/80`}>Lợi nhuận</th>
                )}

                {isAdminOrSuper && (
                  <th className={`${thBase} bg-sky-50/95 border-r-0`}>
                    Hành động
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/70">
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
                  let rowBgClass =
                    "odd:bg-white even:bg-sky-50/30 hover:bg-sky-50/80";
                  if (isActive) {
                    rowBgClass =
                      "relative z-10 bg-sky-100/95 shadow-[inset_0_0_0_1px_rgba(125,211,252,0.9)] hover:bg-sky-100/95";
                  } else if (isPinned) {
                    rowBgClass =
                      "bg-sky-50/95 shadow-[inset_0_0_0_1px_rgba(186,230,253,0.95)] hover:bg-sky-100/80";
                  }

                  // ✅ Logic trộn màu nền riêng cho ô STT (bị dính sticky nên phải xử lý riêng)
                  let sttBgClass = "bg-white hover:bg-slate-50";
                  if (isActive) {
                    sttBgClass = "bg-sky-100/95 hover:bg-sky-100/95";
                  } else if (isPinned) {
                    sttBgClass = "bg-sky-50/95 hover:bg-sky-100/80";
                  }

                  return (
                    <tr
                      key={r._id}
                      onClick={() => {
                        setActiveRowId(r._id); // ✅ Cập nhật ID dòng đang active
                        onRowClick(r); // Gọi hàm mở Drawer
                      }}
                      className={`cursor-pointer transition-all duration-200 ${rowBgClass}`}
                    >
                      <td
                        className={`sticky left-0 z-0 px-3 py-3 border-r border-sky-100 align-middle cursor-cell transition-colors duration-200 ${sttBgClass}`}
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
                            <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-[9px] text-white shadow-sm ring-2 ring-white">
                              📌
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={`${tdBase} font-medium text-sky-800`}>
                        {r.receivedAt
                          ? new Date(r.receivedAt).toLocaleDateString("vi-VN")
                          : "—"}
                      </td>
                      <td className={tdBase}>
                        <Pill text={r.processStatus || "—"} tone="slate" />
                      </td>
                      <td
                        className={`${tdBase} whitespace-nowrap font-bold text-slate-900 tracking-[0.01em]`}
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
                                (r.costPrice ?? 0) > 0
                                  ? "Đã nhập "
                                  : "Chưa nhập "
                              }
                              tone={(r.costPrice ?? 0) > 0 ? "emerald" : "rose"}
                            />
                          </div>
                        </td>
                      )}
                      <td className={tdBase}>
                        <div
                          className={`${wrap2} font-semibold text-slate-900`}
                        >
                          {r.patientName || "—"}
                        </div>
                      </td>
                      <td className={tdBase}>
                        <div className={`${wrap2} text-slate-600`}>
                          {r.source || "—"}
                        </div>
                      </td>
                      <td className={tdBase}>
                        <div className={`${wrap2} font-medium text-teal-700`}>
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
                        <div
                          className={`${wrap2} font-semibold text-slate-800`}
                        >
                          {r.serviceName || "—"}
                        </div>
                        <div className="mt-1 text-[11px] break-words font-medium text-slate-400 tracking-[0.03em]">
                          {r.serviceCode || ""}
                        </div>
                      </td>
                      <td
                        className={tdBase}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          className="w-fit cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            void onQuickPaidChange(r, !r.paid);
                          }}
                          title={r.paid ? "Đã TT" : "Chưa TT"}
                        >
                          <Check ok={!!r.paid} />
                        </button>
                      </td>
                      {isAccountingAdmin && (
                        <td className="px-3 py-3 text-center text-[11px] font-semibold tabular-nums text-emerald-700 border-r border-slate-200/80 whitespace-nowrap align-middle">
                          {r.paymentMethod || "Không có"}
                        </td>
                      )}
                      {isAccountingAdmin && (
                        <td className="px-3 py-3 text-center text-[12px] font-bold tabular-nums text-sky-800 border-r border-slate-200/80 whitespace-nowrap align-middle">
                          {(r.receivedAmount ?? 0).toLocaleString()}
                        </td>
                      )}
                      {isAccountingAdmin && (
                        <td className="px-3 py-3 text-center text-[12px] font-bold tabular-nums text-amber-800 border-r border-slate-200/80 whitespace-nowrap align-middle">
                          {(r.costPrice ?? 0).toLocaleString()}
                        </td>
                      )}

                      <td className="px-3 py-3 text-center text-[12px] font-bold tabular-nums text-slate-800 border-r border-slate-200/80 whitespace-nowrap align-middle">
                        {(r.collectedAmount ?? 0).toLocaleString()}
                      </td>

                      {isAccountingAdmin && (
                        <td className="px-3 py-3 text-center text-[12px] font-bold tabular-nums text-rose-600 border-r border-slate-200/80 whitespace-nowrap align-middle">
                          {(
                            (r.collectedAmount || 0) - (r.costPrice || 0)
                          ).toLocaleString()}
                        </td>
                      )}
                      {/* Cột Hành động */}
                      <td className="px-3 py-3 border-r-0 text-center align-middle">
                        <div className="flex justify-center gap-1.5 ">
                          {isAdminOrSuper && (
                            <>
                              {/* ✅ NÚT MỚI: XUẤT PDF */}
                              {/* <button
                                  className="cursor-pointer rounded-lg bg-emerald-600 px-2 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 whitespace-nowrap"
                                  onClick={(e) => handleExportPDF(e, r)}
                                >
                                  In PDF
                                </button> */}

                              <button
                                className="cursor-pointer whitespace-nowrap rounded-xl bg-sky-600 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-sky-500"
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
                                className="cursor-pointer whitespace-nowrap rounded-xl bg-rose-500 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-rose-600"
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

        <div className="flex shrink-0 items-center justify-between border-t border-sky-100 bg-sky-50/50 px-4 py-3 text-[11px] text-slate-500">
          <div>
            Tip: Click vào dòng để xem ca (dòng đang chọn màu{" "}
            <b>xanh lam nhạt</b>). Click vào ô STT để <b>ghim</b>.
          </div>
          <div>
            Tổng: <b className="text-slate-900">{rows.length}</b>
          </div>
        </div>
      </div>

      {/* ✅ COMPONENT ẨN ĐỂ IN PDF CHẠY NGẦM DƯỚI NỀN */}
      <div style={{ display: "none" }}>
        <CasePdfTemplate ref={printRef} data={printData} />
      </div>

      {/* ✅ MODAL HIỂN THỊ LỊCH SỬ CHỈNH SỬA (Giữ nguyên như của bạn) */}
      {historyModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm transition-opacity"
          onClick={() => setHistoryModalOpen(false)}
        >
          <div
            className="w-full max-w-lg max-h-[50vh] flex flex-col overflow-hidden rounded-[28px] border border-sky-100 bg-white shadow-[0_30px_100px_-50px_rgba(14,116,144,0.45)] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-sky-100 bg-sky-50/70 px-5 py-4">
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
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
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
                            <p className="text-[13px] font-bold text-slate-800">
                              {log.name}
                            </p>
                          </div>
                          <span className="shrink-0 rounded bg-white px-2 py-0.5 text-[10px] font-semibold text-sky-600 ring-1 ring-slate-200">
                            {log.action || "Thao tác"}
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                          </svg>
                          {new Date(log.changedAt).toLocaleString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
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
