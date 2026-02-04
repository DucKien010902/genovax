// "use client";

// import { CaseRecord } from "@/lib/types";

// function Pill({
//   text,
//   tone,
// }: {
//   text: string;
//   tone: "blue" | "rose" | "emerald" | "amber" | "slate";
// }) {
//   const map: Record<typeof tone, string> = {
//     blue: "bg-blue-50 text-blue-700 ring-blue-200",
//     rose: "bg-rose-50 text-rose-700 ring-rose-200",
//     emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
//     amber: "bg-amber-50 text-amber-800 ring-amber-200",
//     slate: "bg-slate-50 text-slate-700 ring-slate-200",
//   };
//   return (
//     <span
//       className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${map[tone]}`}
//     >
//       {text || "—"}
//     </span>
//   );
// }

// function Check({ ok }: { ok: boolean }) {
//   return (
//     <span
//       className={`inline-flex h-6 w-6 items-center justify-center rounded-lg ring-1 ${ok ? "bg-emerald-600 text-white ring-emerald-700" : "bg-white text-neutral-400 ring-black/10"}`}
//     >
//       {ok ? "✓" : ""}
//     </span>
//   );
// }

// export default function CasesTable({
//   rows,
//   loading,
//   onRowClick,
// }: {
//   rows: CaseRecord[];
//   loading?: boolean;
//   onRowClick: (r: CaseRecord) => void;
// }) {
//   return (
//     <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
//       {/* ONLY TABLE SCROLLS */}
//       <div className="max-h-[72vh] overflow-auto">
//         <table className="min-w-[2200px] w-full text-sm">
//           <thead className="sticky top-0 z-10 bg-white">
//             <tr className="border-b text-xs text-neutral-500">
//               <th className="px-3 py-3 sticky left-0 bg-white z-20">STT</th>
//               <th className="px-3 py-3  bg-white z-20">
//                 Ngày
//               </th>

//               <th className="px-3 py-3">Xuất HĐ</th>
//               <th className="px-3 py-3">Mã ca</th>
//               <th className="px-3 py-3">Họ và tên</th>
//               <th className="px-3 py-3">Lab</th>
//               <th className="px-3 py-3">Dịch vụ</th>
//               <th className="px-3 py-3">Mã hàng</th>
//               <th className="px-3 py-3">Thông tin chi tiết thêm</th>
//               <th className="px-3 py-3">Nguồn</th>
//               <th className="px-3 py-3">NVKD phụ trách</th>
//               <th className="px-3 py-3">Thu mẫu</th>
//               <th className="px-3 py-3">Ngày gửi mẫu</th>
//               <th className="px-3 py-3">Đã thanh toán</th>
//               <th className="px-3 py-3">Ngày trả kết quả</th>
//               <th className="px-3 py-3">Cấp đại lý</th>
//               <th className="px-3 py-3">Tiền thu</th>
//               <th className="px-3 py-3">Mức chuyển lab</th>
//               <th className="px-3 py-3">Tiếp nhận mẫu</th>
//               <th className="px-3 py-3">Xử lý mẫu</th>
//               <th className="px-3 py-3">Phản hồi</th>
//               <th className="px-3 py-3">GL trả</th>
//               <th className="px-3 py-3">GX nhận</th>
//               <th className="px-3 py-3">Trả file mềm</th>
//               <th className="px-3 py-3">Trả file cứng</th>
//               <th className="px-3 py-3">Thông tin xuất hóa đơn</th>
//             </tr>
//           </thead>

//           <tbody className="divide-y">
//             {loading ? (
//               <tr>
//                 <td className="px-4 py-6 text-neutral-500" colSpan={26}>
//                   Đang tải…
//                 </td>
//               </tr>
//             ) : rows.length === 0 ? (
//               <tr>
//                 <td className="px-4 py-6 text-neutral-500" colSpan={26}>
//                   Chưa có dữ liệu.
//                 </td>
//               </tr>
//             ) : (
//               rows.map((r, idx) => (
//                 <tr
//                   key={r._id}
//                   onClick={() => onRowClick(r)}
//                   className="hover:bg-neutral-50 cursor-pointer"
//                 >
//                   {/* sticky left columns */}
//                   <td className="px-3 py-3 sticky left-0 bg-white z-10 font-medium">
//                     {r.stt || idx + 1}
//                   </td>
//                   <td className="px-3 py-3  bg-white z-10">
//                     {r.date ? new Date(r.date).toLocaleDateString() : "—"}
//                   </td>

//                   <td className="px-3 py-3">
//                     <Check ok={!!r.invoiceRequested} />
//                   </td>
//                   <td className="px-3 py-3 font-semibold text-neutral-900">
//                     {r.caseCode || "—"}
//                   </td>
//                   <td className="px-3 py-3">{r.patientName || "—"}</td>
//                   <td className="px-3 py-3">
//                     <Pill text={r.lab || "—"} tone="slate" />
//                   </td>

//                   <td className="px-3 py-3">
//                     <Pill
//                       text={r.serviceType}
//                       tone={
//                         r.serviceType === "NIPT"
//                           ? "rose"
//                           : r.serviceType === "ADN"
//                             ? "blue"
//                             : "emerald"
//                       }
//                     />
//                   </td>

//                   <td className="px-3 py-3">
//                     <Pill text={r.serviceCode || "—"} tone="amber" />
//                   </td>

//                   <td className="px-3 py-3 max-w-[360px]">
//                     <div className="line-clamp-2 text-neutral-700">
//                       {r.detailNote || "—"}
//                     </div>
//                   </td>

//                   <td className="px-3 py-3">
//                     <Pill text={r.source || "—"} tone="slate" />
//                   </td>
//                   <td className="px-3 py-3">{r.salesOwner || "—"}</td>
//                   <td className="px-3 py-3">{r.sampleCollector || "—"}</td>

//                   <td className="px-3 py-3">
//                     {r.sentAt ? new Date(r.sentAt).toLocaleDateString() : "—"}
//                   </td>

//                   <td className="px-3 py-3">
//                     <Check ok={!!r.paid} />
//                   </td>

//                   <td className="px-3 py-3">
//                     {r.dueDate ? new Date(r.dueDate).toLocaleDateString() : "—"}
//                   </td>

//                   <td className="px-3 py-3">
//                     <Pill
//                       text={r.agentTierLabel || r.agentLevel || "—"}
//                       tone="blue"
//                     />
//                   </td>

//                   <td className="px-3 py-3 font-semibold">
//                     {(r.collectedAmount ?? 0).toLocaleString()}
//                   </td>

//                   <td className="px-3 py-3">
//                     <Pill text={r.transferStatus || "—"} tone="amber" />
//                   </td>
//                   <td className="px-3 py-3">
//                     <Pill text={r.receiveStatus || "—"} tone="emerald" />
//                   </td>
//                   <td className="px-3 py-3">
//                     <Pill text={r.processStatus || "—"} tone="slate" />
//                   </td>
//                   <td className="px-3 py-3">
//                     <Pill text={r.feedbackStatus || "—"} tone="rose" />
//                   </td>

//                   <td className="px-3 py-3">
//                     <Check ok={!!r.glReturned} />
//                   </td>
//                   <td className="px-3 py-3">
//                     <Check ok={!!r.gxReceived} />
//                   </td>
//                   <td className="px-3 py-3">
//                     <Check ok={!!r.softFileDone} />
//                   </td>
//                   <td className="px-3 py-3">
//                     <Check ok={!!r.hardFileDone} />
//                   </td>

//                   <td className="px-3 py-3 max-w-[420px]">
//                     <div className="line-clamp-2 text-neutral-700">
//                       {r.invoiceInfo || "—"}
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex items-center justify-between px-4 py-3 text-xs text-neutral-500 border-t bg-neutral-50">
//         <div>Tip: Cuộn ngang chỉ ở bảng. Click 1 dòng để mở chi tiết.</div>
//         <div>
//           Tổng: <b className="text-neutral-900">{rows.length}</b>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { CaseRecord } from "@/lib/types";

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
      className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${map[tone]}`}
    >
      {text || "—"}
    </span>
  );
}

function Check({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-flex h-6 w-6 items-center justify-center rounded-lg ring-1 ${
        ok
          ? "bg-emerald-600 text-white ring-emerald-700"
          : "bg-white text-neutral-400 ring-black/10"
      }`}
    >
      {ok ? "✓" : ""}
    </span>
  );
}

const thBase =
  "px-3 py-3 text-center font-semibold uppercase tracking-wide whitespace-nowrap";
const tdBase = "px-3 py-3 text-center";

export default function CasesTable({
  rows,
  loading,
  onRowClick,
}: {
  rows: CaseRecord[];
  loading?: boolean;
  onRowClick: (r: CaseRecord) => void;
}) {
  return (
    <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
      {/* TABLE ONLY SCROLL */}
      <div className="max-h-[72vh] overflow-auto">
        <table className="min-w-[1200px] w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="border-b text-[11px] text-neutral-600">
              <th
                className={`${thBase} sticky left-0 z-30 bg-white shadow-[1px_0_0_rgba(0,0,0,0.06)]`}
              >
                STT
              </th>

              <th className={`${thBase} bg-neutral-50`}>Ngày</th>
              <th className={`${thBase} bg-white`}>Mã ca</th>
              <th className={`${thBase} bg-neutral-50`}>Họ tên</th>
              <th className={`${thBase} bg-white`}>Nguồn</th>
              <th className={`${thBase} bg-neutral-50`}>Lab</th>
              <th className={`${thBase} bg-white`}>Dịch vụ</th>
              <th className={`${thBase} bg-neutral-50`}>Tên dịch vụ</th>
              <th className={`${thBase} bg-white`}>NVKD</th>
              <th className={`${thBase} bg-neutral-50`}>Đã TT</th>
              <th className={`${thBase} bg-white text-right`}>Tiền thu</th>

              <th
                className={`${thBase}  z-30 bg-white text-right shadow-[-1px_0_0_rgba(0,0,0,0.06)]`}
              >
                Chi tiết
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td
                  className="px-4 py-6 text-neutral-500 text-center"
                  colSpan={12}
                >
                  Đang tải…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-6 text-neutral-500 text-center"
                  colSpan={12}
                >
                  Chưa có dữ liệu.
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr
                  key={r._id}
                  onClick={() => onRowClick(r)}
                  className="cursor-pointer odd:bg-white even:bg-neutral-50/40 hover:bg-indigo-50/40"
                >
                  <td className="px-3 py-3 sticky left-0 z-20 bg-inherit font-semibold text-neutral-900 text-center">
                    {r.stt || idx + 1}
                  </td>

                  <td className={`${tdBase} text-sky-700 font-medium`}>
                    {r.date ? new Date(r.date).toLocaleDateString() : "—"}
                  </td>

                  <td className={`${tdBase} font-extrabold text-indigo-900`}>
                    {r.caseCode || "—"}
                  </td>

                  <td className={`${tdBase}`}>
                    <div className="max-w-[220px] mx-auto truncate font-semibold text-neutral-900">
                      {r.patientName || "—"}
                    </div>
                  </td>

                  <td className={`${tdBase} text-neutral-700`}>
                    <div className="max-w-[200px] mx-auto truncate">
                      {r.source || "—"}
                    </div>
                  </td>

                  <td className={`${tdBase}`}>
                    <Pill text={r.lab || "—"} tone="slate" />
                  </td>

                  <td className={`${tdBase}`}>
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

                  <td className={`${tdBase}`}>
                    <div className="max-w-[240px] mx-auto truncate font-semibold text-violet-900">
                      {r.serviceName || "—"}
                    </div>
                  </td>

                  <td className={`${tdBase} text-emerald-800 font-medium`}>
                    <div className="max-w-[180px] mx-auto truncate">
                      {r.salesOwner || "—"}
                    </div>
                  </td>

                  <td className={`${tdBase}`}>
                    <div className="mx-auto w-fit">
                      <Check ok={!!r.paid} />
                    </div>
                  </td>

                  <td className="px-3 py-3 text-right font-extrabold tabular-nums text-amber-900">
                    {(r.collectedAmount ?? 0).toLocaleString()}
                  </td>

                  <td className="px-3 py-3  z-20 bg-inherit text-right">
                    <button
                      className="rounded-xl bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-95"
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

      <div className="flex items-center justify-between px-4 py-3 text-xs text-neutral-500 border-t bg-neutral-50">
        <div>Tip: Cuộn ngang chỉ ở bảng. Bấm “Xem” để mở chi tiết đầy đủ.</div>
        <div>
          Tổng: <b className="text-neutral-900">{rows.length}</b>
        </div>
      </div>
    </div>
  );
}
