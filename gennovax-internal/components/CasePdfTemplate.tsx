import React, { forwardRef } from "react";
import { CaseRecord } from "@/lib/types";

interface Props {
  data: CaseRecord | null;
}

const formatDate = (dateString?: string | Date | null) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("vi-VN");
};

const formatCheck = (val?: boolean) => {
  return val ? "✅ Đã xong" : "—";
};

export const CasePdfTemplate = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  if (!data) return null;

  return (
    <div
      ref={ref}
      // Dùng flex và flex-col để tự động đẩy footer xuống đáy
      className="bg-white text-black p-8 font-sans mx-auto flex flex-col relative"
      style={{
        width: "210mm",
        minHeight: "297mm",
        boxSizing: "border-box",
      }}
    >
      {/* HEADER: Logo & Thông tin công ty */}
      <div className="flex justify-between items-start border-b-2 border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-slate-100 flex items-center justify-center rounded-lg border border-slate-200 overflow-hidden shrink-0">
            <img
              src="/icon.png"
              alt="Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement!.innerHTML = '<span class="text-[10px] font-bold text-slate-400">LOGO</span>';
              }}
            />
          </div>
          <div>
            <h1 className="text-lg font-bold uppercase text-blue-900 tracking-wide">
              Trung Tâm Xét Nghiệm Di Truyền
            </h1>
            <p className="text-[13px] text-slate-600 font-medium">Công ty TNHH Y Tế Công Nghệ Cao</p>
            <p className="text-[12px] text-slate-600">Địa chỉ: Tầng 3, Tòa nhà ABC, 123 Đường X, Quận Y, TP. Z</p>
            <p className="text-[12px] text-slate-600">Hotline: 1900 xxxx | Web: www.trungtamxetnghiem.vn</p>
          </div>
        </div>
      </div>

      {/* TITLE: Tiêu đề phiếu */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold uppercase text-slate-900 tracking-wider">
          HỒ SƠ TIẾP NHẬN CA XÉT NGHIỆM
        </h2>
        <div className="inline-block mt-2 px-4 py-1 border-2 border-slate-800 rounded bg-slate-50">
          <p className="text-sm font-mono text-slate-800 font-bold tracking-widest">
            MÃ CA: {data.caseCode || "ĐANG CẬP NHẬT"}
          </p>
        </div>
      </div>

      {/* BODY: Thông tin chi tiết (flex-1 giúp phần này chiếm hết khoảng trống, đẩy chữ ký xuống đáy) */}
      <div className="space-y-4 px-2 flex-1">
        
        {/* I. KHÁCH HÀNG & NGUỒN MẪU */}
        <section className="break-inside-avoid">
          <h3 className="font-bold text-[14px] border-b border-slate-400 pb-1 mb-2 text-blue-800 uppercase flex items-center gap-2">
            I. Thông tin khách hàng & Nguồn mẫu
          </h3>
          <div className="grid grid-cols-2 gap-y-1.5 gap-x-8 text-[13px]">
            <p className="flex justify-between border-b border-dashed border-slate-200 pb-1">
              <span className="font-medium text-slate-600">Họ và tên KH:</span> 
              <span className="font-bold uppercase text-slate-900">{data.patientName || "—"}</span>
            </p>
            <p className="flex justify-between border-b border-dashed border-slate-200 pb-1">
              <span className="font-medium text-slate-600">Nguồn khách (Đối tác):</span> 
              <span>{data.source || "—"}</span>
            </p>
            <p className="flex justify-between border-b border-dashed border-slate-200 pb-1">
              <span className="font-medium text-slate-600">Người thu mẫu:</span> 
              <span>{data.sampleCollector || "—"}</span>
            </p>
            <p className="flex justify-between border-b border-dashed border-slate-200 pb-1">
              <span className="font-medium text-slate-600">Nhân viên KD (Sales):</span> 
              <span>{data.salesOwner || "—"}</span>
            </p>
            <p className="flex justify-between border-b border-dashed border-slate-200 pb-1">
              <span className="font-medium text-slate-600">Cấp đại lý:</span> 
              <span>{data.agentLevel || "—"} {data.agentTierLabel ? `(${data.agentTierLabel})` : ""}</span>
            </p>
          </div>
        </section>

        {/* II. DỊCH VỤ & PHÒNG LAB */}
        <section className="break-inside-avoid">
          <h3 className="font-bold text-[14px] border-b border-slate-400 pb-1 mb-2 text-blue-800 uppercase flex items-center gap-2">
            II. Dịch vụ xét nghiệm
          </h3>
          <div className="grid grid-cols-2 gap-y-1.5 gap-x-8 text-[13px]">
            <p className="flex justify-between border-b border-dashed border-slate-200 pb-1">
              <span className="font-medium text-slate-600">Nhóm dịch vụ:</span> 
              <span className="font-bold text-blue-700">{data.serviceType || "—"}</span>
            </p>
            <p className="flex justify-between border-b border-dashed border-slate-200 pb-1">
              <span className="font-medium text-slate-600">Mã dịch vụ:</span> 
              <span>{data.serviceCode || "—"}</span>
            </p>
            <p className="col-span-2 flex justify-between border-b border-dashed border-slate-200 pb-1">
              <span className="font-medium text-slate-600 shrink-0">Tên dịch vụ chi tiết:</span> 
              <span className="font-bold text-right pl-4 text-slate-900">{data.serviceName || "—"}</span>
            </p>
            <p className="flex justify-between border-b border-dashed border-slate-200 pb-1">
              <span className="font-medium text-slate-600">Chỉ định Lab:</span> 
              <span>{data.lab || "—"}</span>
            </p>
            <p className="col-span-2 flex justify-between border-b border-dashed border-slate-200 pb-1">
              <span className="font-medium text-slate-600">Ghi chú chuyên môn:</span> 
              <span className="italic text-right">{data.detailNote || "—"}</span>
            </p>
          </div>
        </section>

        {/* III. TIẾN ĐỘ & TRẠNG THÁI */}
        <section className="break-inside-avoid">
          <h3 className="font-bold text-[14px] border-b border-slate-400 pb-1 mb-2 text-blue-800 uppercase flex items-center gap-2">
            III. Tiến độ xử lý
          </h3>
          <div className="grid grid-cols-2 gap-y-1.5 gap-x-8 text-[13px]">
            <p className="flex justify-between border-b border-dashed border-slate-200 pb-1">
              <span className="font-medium text-slate-600">Trạng thái KQ:</span> 
              <span className="font-bold text-indigo-700">{data.processStatus || "—"}</span>
            </p>
            <p className="flex justify-between border-b border-dashed border-slate-200 pb-1">
              <span className="font-medium text-slate-600">Trạng thái luân chuyển:</span> 
              <span>{data.transferStatus || "—"}</span>
            </p>
            <p className="flex justify-between border-b border-dashed border-slate-200 pb-1">
              <span className="font-medium text-slate-600">Nhận mẫu lúc:</span> 
              <span>{formatDate(data.receivedAt)}</span>
            </p>
            <p className="flex justify-between border-b border-dashed border-slate-200 pb-1">
              <span className="font-medium text-slate-600">Trạng thái nhận mẫu:</span> 
              <span>{data.receiveStatus || "—"}</span>
            </p>
            <p className="flex justify-between border-b border-dashed border-slate-200 pb-1">
              <span className="font-medium text-slate-600">Gửi Lab lúc:</span> 
              <span>{formatDate(data.sentAt)}</span>
            </p>
            <p className="flex justify-between border-b border-dashed border-slate-200 pb-1">
              <span className="font-medium text-slate-600">Phản hồi khách:</span> 
              <span>{data.feedbackStatus || "—"}</span>
            </p>
            <p className="flex justify-between border-b border-dashed border-slate-200 pb-1">
              <span className="font-medium text-slate-600">Hẹn trả KQ (Hạn):</span> 
              <span className="font-bold text-rose-600">{formatDate(data.dueDate)}</span>
            </p>
            <p className="flex justify-between border-b border-dashed border-slate-200 pb-1">
              <span className="font-medium text-slate-600">Đã trả KQ lúc:</span> 
              <span className="font-bold text-emerald-600">{formatDate(data.returnedAt)}</span>
            </p>
          </div>
        </section>

        {/* IV. TRẢ HỒ SƠ & FILE */}
        <section className="break-inside-avoid">
          <h3 className="font-bold text-[14px] border-b border-slate-400 pb-1 mb-2 text-blue-800 uppercase flex items-center gap-2">
            IV. Hồ sơ & Trả File
          </h3>
          <div className="grid grid-cols-2 gap-y-1.5 gap-x-8 text-[13px]">
            <p className="flex justify-between border-b border-dashed border-slate-200 pb-1">
              <span className="font-medium text-slate-600">File mềm (Soft copy):</span> 
              <span>{formatCheck(data.softFileDone)}</span>
            </p>
            <p className="flex justify-between border-b border-dashed border-slate-200 pb-1">
              <span className="font-medium text-slate-600">Giấy hẹn/Giấy lưu (GL):</span> 
              <span>{formatCheck(data.glReturned)}</span>
            </p>
            <p className="flex justify-between border-b border-dashed border-slate-200 pb-1">
              <span className="font-medium text-slate-600">Bản cứng (Hard copy):</span> 
              <span>{formatCheck(data.hardFileDone)}</span>
            </p>
            <p className="flex justify-between border-b border-dashed border-slate-200 pb-1">
              <span className="font-medium text-slate-600">Gốc xét nghiệm (GX):</span> 
              <span>{formatCheck(data.gxReceived)}</span>
            </p>
          </div>
        </section>

        {/* V. KẾ TOÁN & XUẤT HÓA ĐƠN */}
        <section className="bg-slate-50 p-3 rounded-lg border border-slate-300 break-inside-avoid">
          <h3 className="font-bold text-[14px] border-b border-slate-300 pb-1 mb-2 text-slate-800 uppercase">
            V. Kế toán & Hóa đơn
          </h3>
          <div className="grid grid-cols-2 gap-y-1.5 gap-x-8 text-[13px]">
            <p className="flex justify-between">
              <span className="font-medium text-slate-600">Tổng tiền dịch vụ:</span> 
              <span className="font-bold">{(data.price ?? 0).toLocaleString("vi-VN")} đ</span>
            </p>
            <p className="flex justify-between">
              <span className="font-medium text-slate-600">Đã thu:</span> 
              <strong className="text-rose-600">{(data.collectedAmount ?? 0).toLocaleString("vi-VN")} đ</strong>
            </p>
            <p className="flex justify-between items-center">
              <span className="font-medium text-slate-600">Trạng thái TT:</span> 
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${data.paid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {data.paid ? "ĐÃ THANH TOÁN" : "CHƯA HOÀN TẤT"}
              </span>
            </p>
            <p className="flex justify-between">
              <span className="font-medium text-slate-600">Hình thức thanh toán:</span> 
              <span>{data.paymentMethod || "—"}</span>
            </p>
            
            {/* THÔNG TIN HÓA ĐƠN NẾU CÓ */}
            {(data.invoiceName || data.invoiceTaxCode) && (
              <div className="col-span-2 mt-1.5 pt-1.5 border-t border-slate-200">
                <p className="font-bold text-slate-700 mb-1">Thông tin xuất hóa đơn ({data.invoiceType === 'company' ? 'Công ty' : 'Cá nhân'}):</p>
                <div className="grid grid-cols-2 gap-1 text-[12px] text-slate-700">
                  <p><span className="font-medium">Tên HĐ:</span> {data.invoiceName}</p>
                  <p><span className="font-medium">MST / CCCD:</span> {data.invoiceTaxCode || data.invoiceIdCard}</p>
                  <p className="col-span-2"><span className="font-medium">Địa chỉ:</span> {data.invoiceAddress}</p>
                </div>
              </div>
            )}
          </div>
        </section>

      </div>

      {/* FOOTER: Chữ ký (Dùng mt-auto để luôn tự đẩy xuống dưới cùng) */}
      <div className="mt-auto pt-6 px-4 break-inside-avoid">
        <div className="flex justify-between text-center text-[13px]">
          <div className="w-1/3">
            <p className="font-bold text-slate-800">Khách hàng</p>
            <p className="italic text-slate-500 text-[10px] mt-0.5">(Ký, ghi rõ họ tên)</p>
            <div className="mt-14 border-b border-dotted border-slate-400 w-2/3 mx-auto"></div>
          </div>
          <div className="w-1/3">
            <p className="font-bold text-slate-800">Nhân viên tiếp nhận</p>
            <p className="italic text-slate-500 text-[10px] mt-0.5">(Ký, ghi rõ họ tên)</p>
            <div className="mt-14 border-b border-dotted border-slate-400 w-2/3 mx-auto"></div>
          </div>
          <div className="w-1/3">
            <p className="font-bold text-slate-800">Kiểm tra & Bàn giao Lab</p>
            <p className="italic text-slate-500 text-[10px] mt-0.5">(Ký, ghi rõ họ tên)</p>
            <div className="mt-14 border-b border-dotted border-slate-400 w-2/3 mx-auto"></div>
          </div>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-4">
          Ngày in phiếu: {new Date().toLocaleString('vi-VN')}
        </p>
      </div>
    </div>
  );
});

CasePdfTemplate.displayName = "CasePdfTemplate";