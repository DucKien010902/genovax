"use client";

import { CaseRecord } from "@/lib/types";
import { useAuth } from "@/lib/auth";

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
      className={`inline-flex h-5 w-5 items-center justify-center rounded-md ring-1 ${
        ok
          ? "bg-emerald-600 text-white ring-emerald-700"
          : "bg-white text-neutral-400 ring-black/10"
      }`}
    >
      {ok ? "✓" : ""}
    </span>
  );
}

// ✅ Component chấm tròn trạng thái (xanh/đỏ)
function Dot({ ok, title }: { ok: boolean; title?: string }) {
  return (
    <span
      title={title}
      className={`inline-block h-3 w-3 rounded-full shadow-sm ring-1 ring-inset ${
        ok
          ? "bg-emerald-500 ring-emerald-600/50"
          : "bg-rose-500 ring-rose-600/50"
      }`}
    />
  );
}

function SttBadge({ stt, dueDate,processStatus }: { stt: number; dueDate: string | null; processStatus: string| null }) {
  const now = Date.now();

  let cls = "bg-slate-100 text-slate-700 ring-slate-200";

  // ✅ 2. Nếu đã có kết quả -> Ép luôn thành màu trắng
  if (processStatus === "Đã có KQ") {
    cls = "bg-white text-neutral-400 ring-black/10";
  } 
  // ✅ 3. Nếu chưa có KQ thì mới tính toán trễ hạn
  else if (dueDate) {
    const t = new Date(dueDate).getTime();
    const diff = t - now;

    if (Number.isFinite(t)) {
      if (diff < 0) cls = "bg-red-600 text-white ring-violet-700";
      else if (diff < 6 * 60 * 60 * 1000)
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

// ✅ Đổi align-top thành align-middle ở thBase và tdBase
const thBase =
  "px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap border-r border-black/5 align-middle";
const tdBase =
  "px-3 py-2 text-left text-[12px] leading-5 border-r border-black/5 align-middle";

const wrap2 = "line-clamp-2 break-words whitespace-normal";

export default function CasesTable({
  rows,
  loading,
  onRowClick,
}: {
  rows: CaseRecord[];
  loading?: boolean;
  isSuperAdmin?: boolean;
  onRowClick: (r: CaseRecord) => void;
}) {
  const { user, token, logout } = useAuth();
  const isSuperAdmin = user?.role === "superadmin";
  const colCount = isSuperAdmin ? 14 : 12; // Để render trạng thái empty/loading

  return (
    <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
      <div className="min-h-[36vh]  max-h-[72vh] overflow-auto">
        <table
          className={`w-full table-fixed text-neutral-900 ${
            isSuperAdmin ? "min-w-[1120px]" : "min-w-[980px]"
          }`}
        >
          <colgroup>
            <col className="w-[56px]" /> {/* STT */}
            <col className="w-[80px]" /> {/* Ngày */}
            <col className="w-[110px]" /> {/* Trạng thái */}
            <col className="w-[110px]" /> {/* Mã ca */}

            {/* ✅ 2 Cột của Admin */}
            {isSuperAdmin && <col className="w-[70px]" />} {/* Xuất HĐ */}
            {isSuperAdmin && <col className="w-[90px]" />} {/* Giá Cost */}

            <col className="w-[140px]" /> {/* Họ và tên */}
            <col className="w-[140px]" /> {/* Nguồn */}
            <col className="w-[80px]" /> {/* NVKD */}
            <col className="w-[90px]" /> {/* Dịch vụ */}
            <col className="w-[160px]" /> {/* Tên dịch vụ */}
            <col className="w-[64px]" /> {/* Đã TT */}
            <col className="w-[110px]" /> {/* Tiền thu */}
            <col className="w-[92px]" /> {/* Chi tiết */}
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

              {/* ✅ Tiêu đề 2 Cột Admin */}
              {isSuperAdmin && (
                <th className={`${thBase} bg-white text-center`}>Xuất HĐ</th>
              )}
              {isSuperAdmin && (
                <th className={`${thBase} bg-neutral-50 text-center`}>Nhập Cost</th>
              )}

              <th className={`${thBase} bg-white`}>Họ và tên</th>
              <th className={`${thBase} bg-white`}>Nguồn</th>
              <th className={`${thBase} bg-neutral-50`}>NVKD</th>
              <th className={`${thBase} bg-white`}>Dịch vụ</th>
              <th className={`${thBase} bg-neutral-50`}>Tên dịch vụ</th>
              <th className={`${thBase} bg-white`}>Đã TT</th>
              <th className={`${thBase} bg-neutral-50 text-right`}>Tiền thu</th>
              <th className={`${thBase} bg-white border-r-0 text-right`}>
                Chi tiết
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-neutral-500 text-center align-middle" colSpan={colCount}>
                  Đang tải…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-neutral-500 text-center align-middle" colSpan={colCount}>
                  Chưa có dữ liệu.
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr
                  key={r._id}
                  onClick={() => onRowClick(r)}
                  className="cursor-pointer odd:bg-white even:bg-neutral-50/40 hover:bg-sky-50"
                >
                  <td className="px-3 py-2 sticky left-0 z-20 bg-white border-r border-black/5 align-middle">
                    <SttBadge stt={r.stt || idx + 1} dueDate={r.dueDate} processStatus={r.processStatus} />
                  </td>

                  <td className={`${tdBase} text-sky-700 font-medium`}>
                    {r.receivedAt ? new Date(r.receivedAt).toLocaleDateString() : "—"}
                  </td>

                  <td className={tdBase}>
                    <Pill text={r.processStatus || "—"} tone="slate" />
                  </td>

                  <td
                    className={`${tdBase} font-extrabold text-indigo-900 whitespace-nowrap`}
                  >
                    {r.caseCode || "—"}
                  </td>

                  {/* ✅ Nội dung 2 Cột Admin */}
                  {isSuperAdmin && (
                    <td className={`${tdBase} text-center`}>
                      <div className="flex h-full items-center justify-center">
                        <Dot 
                          ok={!!r.invoiceRequested} 
                          title={r.invoiceRequested ? "Đã yêu cầu xuất HĐ" : "Chưa yêu cầu"} 
                        />
                      </div>
                    </td>
                  )}
                  {isSuperAdmin && (
                    <td className={`${tdBase} text-center`}>
                      <div className="flex h-full items-center justify-center">
                        <Dot 
                          ok={(r.costPrice ?? 0) > 0} 
                          title={(r.costPrice ?? 0) > 0 ? "Đã nhập giá Cost" : "Chưa nhập giá Cost"} 
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

                  <td className="px-3 py-2 text-right text-[12px] font-extrabold tabular-nums text-amber-900 border-r border-black/5 whitespace-nowrap align-middle">
                    {(r.collectedAmount ?? 0).toLocaleString()}
                  </td>

                  <td className="px-3 py-2 border-r-0 text-right align-middle">
                    <button
                      className="rounded-lg bg-sky-600 px-2.5 py-1 text-[11px] font-bold text-white hover:opacity-95 whitespace-nowrap"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRowClick(r);
                      }}
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-3 text-[11px] text-neutral-500 border-t bg-neutral-50">
        <div>Tip: Cuộn ngang chỉ ở bảng. Bấm “Xem” để mở chi tiết.</div>
        <div>
          Tổng: <b className="text-neutral-900">{rows.length}</b>
        </div>
      </div>
    </div>
  );
}