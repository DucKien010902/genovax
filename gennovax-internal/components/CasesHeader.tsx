"use client";

import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import { ServiceType } from "@/lib/types";
import { api } from "@/lib/api"; // ✅ Sửa lại đường dẫn import API của bạn nếu cần
import SingleDatePicker from "@/components/DatePicker";

const serviceMeta: Record<
  ServiceType,
  { title: string; desc: string; pill: string }
> = {
  ADN: {
    title: "ADN",
    desc: "Pháp lý / huyết thống",
    pill: "bg-blue-600 text-white",
  },
  NIPT: {
    title: "NIPT",
    desc: "Sàng lọc trước sinh",
    pill: "bg-rose-600 text-white",
  },
  HPV: {
    title: "HPV",
    desc: "Tế bào / HPV / combo",
    pill: "bg-emerald-600 text-white",
  },
  CELL: {
    title: "CELL",
    desc: "Tế bào / CELL / combo",
    pill: "bg-orange-600 text-white",
  },
};

export default function CasesHeader(props: {
  serviceType: ServiceType;
  q: string;
  setQ: (v: string) => void;
  from: string;
  setFrom: (v: string) => void;
  to: string;
  setTo: (v: string) => void;
  loading?: boolean;
  onAdd: () => void;
  onApply: () => void;
}) {
  const meta = serviceMeta[props.serviceType];

  // --- EXCEL EXPORT STATE ---
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportMonth, setExportMonth] = useState(
    new Date().toISOString().slice(0, 7), // Mặc định là tháng hiện tại (YYYY-MM)
  );
  const [isExporting, setIsExporting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click ra ngoài để đóng menu export
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = async (type: "all" | "month") => {
    setIsExporting(true);
    try {
      let fetchFrom = undefined;
      let fetchTo = undefined;

      // Nếu xuất theo tháng thì tính ngày đầu và cuối của tháng đó
      if (type === "month" && exportMonth) {
        const [year, month] = exportMonth.split("-");
        // Ngày đầu tháng (00:00:00)
        fetchFrom = new Date(Number(year), Number(month) - 1, 1).toISOString();
        // Ngày cuối tháng (23:59:59)
        fetchTo = new Date(
          Number(year),
          Number(month),
          0,
          23,
          59,
          59,
          999,
        ).toISOString();
      }

      // Gọi API lấy dữ liệu (limit 10000 để đảm bảo lấy hết thay vì chỉ 1 trang)
      const res = await api.cases({
        serviceType: "",
        from: fetchFrom,
        to: fetchTo,
        limit: 10000,
      });

      const data = res.items;

      if (!data || data.length === 0) {
        alert("Không có dữ liệu nào trong khoảng thời gian này để xuất!");
        return;
      }

      // MAP DATA SANG TÊN CỘT TIẾNG VIỆT
      const excelData = data.map((item, index) => ({
        STT: item.stt || index + 1,
        // "Ngày tạo": item.date
        //   ? new Date(item.date).toLocaleDateString("vi-VN")
        //   : "",
        "Ngày nhận mẫu": item.receivedAt
          ? new Date(item.receivedAt).toLocaleString("vi-VN")
          : "",
        "Mã ca": item.caseCode || "",
        "Tên bệnh nhân": item.patientName || "",
        "Nhóm dịch vụ": item.serviceType || "",
        "Tên dịch vụ": item.serviceName || "",
        "Mã dịch vụ": item.serviceCode || "",
        "Phòng Lab": item.lab || "",
        "Nguồn khách": item.source || "",
        "NVKD phụ trách": item.salesOwner || "",
        "Người thu mẫu": item.sampleCollector || "",
        "Giá thu (VNĐ)": item.collectedAmount || 0,
        "Giá vốn/Cost (VNĐ)": item.costPrice || 0,
        "Đã thanh toán": item.paid ? "Đã thanh toán" : "Chưa thanh toán",
        // "Trạng thái chuyển Lab": item.transferStatus || "",
        // "Trạng thái tiếp nhận": item.receiveStatus || "",
        // "Trạng thái xử lý": item.processStatus || "",
        // "Trạng thái phản hồi": item.feedbackStatus || "",
        
        // "Hẹn trả KQ": item.dueDate
        //   ? new Date(item.dueDate).toLocaleString("vi-VN")
        //   : "",
        "Loại hóa đơn": item.invoiceType|| "",
        "Tên công ty/ cá nhân (HĐ)": item.invoiceName || "",
        "Mã số thuế (HĐ)": item.invoiceTaxCode || "",
        "Số CCCD": item.invoiceIdCard || "",
        "Ngày cấp (nếu có)": item.invoiceIssueDate || "",
        "Nơi cấp (nếu có)": item.invoiceIssuePlace || "",
        "Địa chỉ (HĐ)": item.invoiceAddress || "",
      }));
      // TẠO FILE EXCEL VÀ TẢI XUỐNG
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachCa");

      const fileName = `TongHop_TatCaDichVu_${type === "month" ? exportMonth : "TatCa"}_${new Date().getTime()}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error("Lỗi xuất Excel:", error);
      alert("Có lỗi xảy ra khi xuất file Excel. Vui lòng thử lại!");
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  return (
    <div className="border-b bg-white/80 backdrop-blur z-100">
      <div className="px-5 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <span
              className={`inline-flex mt-1 items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${meta.pill}`}
            >
              {meta.title}
            </span>
            <div>
              <div className="text-lg font-semibold text-neutral-900">
                Danh sách ca
              </div>
              {/* <div className="text-sm text-neutral-500">{meta.desc}</div> */}
              
              {/* ✅ PHẦN CHÚ THÍCH MÀU SẮC (LEGEND) ĐƯỢC THÊM VÀO ĐÂY */}
              <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-medium text-neutral-600">
                
                <div className="flex items-center gap-1.5" title="Còn hơn 24 giờ nữa mới đến hạn">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-sm"></span>
                  An toàn (&gt;24h)
                </div>
                <div className="flex items-center gap-1.5" title="Chỉ còn dưới 24 giờ">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-sm"></span>
                  &lt; 24h
                </div>
                <div className="flex items-center gap-1.5" title="Gấp: Chỉ còn dưới 12 giờ">
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500 shadow-sm"></span>
                  Gấp (&lt;12h)
                </div>
                <div className="flex items-center gap-1.5" title="Đã trễ hạn trả kết quả!">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-600 shadow-sm"></span>
                  Quá hạn
                </div>
                <div className="flex items-center gap-1.5" title="Trạng thái đã có kết quả">
                  <span className="h-2.5 w-2.5 rounded-full bg-white ring-1 ring-black/15"></span>
                  Đã có KQ
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center mt-2 lg:mt-0">
            {/* Search */}
            <div className="relative">
              <input
                value={props.q}
                onChange={(e) => props.setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (!props.loading) props.onApply();
                  }
                }}
                placeholder="Tìm mã ca / tên / nguồn..."
                className="w-full sm:w-[240px] md:w-[360px] rounded-2xl border border-black/10 bg-white px-4 py-2 text-[13px] text-black shadow-sm outline-none focus:ring-2 focus:ring-neutral-300 placeholder:text-neutral-500 antialiased"
              />
            </div>

            {/* Date Pickers */}
            <div className="flex items-center gap-2">
              <SingleDatePicker
                value={props.from}
                onChange={props.setFrom}
                placeholder="Từ ngày"
                disabled={!!props.loading}
                popoverWidth="lg"
                months={1}
                buttonClassName="w-[120px]"
              />
              <span className="text-xs text-neutral-500">→</span>
              <SingleDatePicker
                value={props.to}
                onChange={props.setTo}
                placeholder="Đến ngày"
                disabled={!!props.loading}
                popoverWidth="lg"
                months={1}
                buttonClassName="w-[120px]"
              />
            </div>

            {/* Nút Lọc */}
            <button
              onClick={props.onApply}
              className="rounded-2xl bg-blue-900 cursor-pointer px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60"
              disabled={props.loading}
            >
              {props.loading ? "..." : "Lọc"}
            </button>

            <button
              onClick={props.onAdd}
              className="rounded-2xl cursor-pointer bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
            >
              + Thêm ca
            </button>
            {/* ✅ Nút Xuất Excel + Dropdown */}
            <div className="relative z-50" ref={menuRef}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={isExporting}
                className="rounded-2xl border border-emerald-600 bg-emerald-50 text-emerald-700 px-4 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-100 disabled:opacity-60 flex items-center gap-1 transition-colors"
              >
                {isExporting ? "Đang xử lý..." : "Xuất Excel"}
              </button>

              {/* Menu Dropdown */}
              {showExportMenu && !isExporting && (
                <div className="z-50 cursor-pointer absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white p-3 shadow-xl ring-1 ring-black/10 z-100">
                  <div className="text-xs font-bold text-neutral-500 mb-2 uppercase tracking-wider">
                    Tùy chọn xuất
                  </div>

                  {/* Xuất Tất cả */}
                  <button
                    onClick={() => handleExport("all")}
                    className="w-full text-left rounded-xl px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    Xuất toàn bộ dữ liệu
                  </button>

                  <div className="my-2 border-t border-black/5"></div>

                  {/* Xuất theo tháng */}
                  <div className="px-3">
                    <label className="block text-[11px] font-semibold text-neutral-500 mb-1">
                      Hoặc chọn tháng:
                    </label>
                    <input
                      type="month"
                      value={exportMonth}
                      onChange={(e) => setExportMonth(e.target.value)}
                      className="w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-1.5 text-sm text-neutral-800 outline-none focus:ring-2 focus:ring-emerald-200 mb-2"
                    />
                    <button
                      onClick={() => handleExport("month")}
                      disabled={!exportMonth}
                      className="w-full rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                    >
                      Xuất theo tháng này
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}