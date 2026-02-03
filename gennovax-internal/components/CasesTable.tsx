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
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${map[tone]}`}>
      {text || "—"}
    </span>
  );
}

function Check({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-flex h-6 w-6 items-center justify-center rounded-lg ring-1 ${
        ok ? "bg-emerald-600 text-white ring-emerald-700" : "bg-white text-neutral-400 ring-black/10"
      }`}
    >
      {ok ? "✓" : ""}
    </span>
  );
}

export default function CasesTable({
  rows,
  loading,
  onRowClick,
}: {
  rows: CaseRecord[];
  loading?: boolean;
  onRowClick: (r: CaseRecord) => void; // dùng để mở Drawer/Modal chi tiết
}) {
  return (
    <div className="rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
      {/* TABLE ONLY SCROLL */}
      <div className="max-h-[72vh] overflow-auto">
        {/* giảm min width để đỡ phải cuộn ngang nhiều */}
        <table className="min-w-[1200px] w-full text-sm">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b text-xs text-neutral-500">
              <th className="px-3 py-3 sticky left-0 bg-white z-20">STT</th>
              <th className="px-3 py-3">Ngày</th>
              <th className="px-3 py-3">Mã ca</th>
              <th className="px-3 py-3">Họ tên</th>
              <th className="px-3 py-3">Lab</th>
              <th className="px-3 py-3">Dịch vụ</th>
              <th className="px-3 py-3">Mã hàng</th>
              <th className="px-3 py-3">NVKD</th>
              <th className="px-3 py-3">Thu mẫu</th>
              <th className="px-3 py-3">Đã TT</th>
              <th className="px-3 py-3 text-right">Tiền thu</th>

              {/* cột action */}
              <th className="px-3 py-3 sticky right-0 bg-white z-20 text-right">
                Chi tiết
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-neutral-500" colSpan={12}>
                  Đang tải…
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-neutral-500" colSpan={12}>
                  Chưa có dữ liệu.
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr
                  key={r._id}
                  onClick={() => onRowClick(r)} // click cả dòng vẫn mở chi tiết
                  className="hover:bg-neutral-50 cursor-pointer"
                >
                  <td className="px-3 py-3 sticky left-0 bg-white z-10 font-medium">
                    {r.stt || idx + 1}
                  </td>

                  <td className="px-3 py-3">
                    {r.date ? new Date(r.date).toLocaleDateString() : "—"}
                  </td>

                  <td className="px-3 py-3 font-semibold text-neutral-900">
                    {r.caseCode || "—"}
                  </td>

                  <td className="px-3 py-3">
                    <div className="max-w-[220px] truncate">
                      {r.patientName || "—"}
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <Pill text={r.lab || "—"} tone="slate" />
                  </td>

                  <td className="px-3 py-3">
                    <Pill
                      text={r.serviceType}
                      tone={r.serviceType === "NIPT" ? "rose" : r.serviceType === "ADN" ? "blue" : "emerald"}
                    />
                  </td>

                  <td className="px-3 py-3">
                    <Pill text={r.serviceCode || "—"} tone="amber" />
                  </td>

                  <td className="px-3 py-3">
                    <div className="max-w-[180px] truncate">
                      {r.salesOwner || "—"}
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <div className="max-w-[160px] truncate">
                      {r.sampleCollector || "—"}
                    </div>
                  </td>

                  <td className="px-3 py-3">
                    <Check ok={!!r.paid} />
                  </td>

                  <td className="px-3 py-3 text-right font-semibold">
                    {(r.collectedAmount ?? 0).toLocaleString()}
                  </td>

                  {/* Action: sticky phải */}
                  <td className="px-3 py-3 sticky right-0 bg-white z-10 text-right">
                    <button
                      className="rounded-xl bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white hover:opacity-95"
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ tránh kích hoạt onRowClick 2 lần / tránh click row
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
