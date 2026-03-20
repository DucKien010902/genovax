"use client";

import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import { ServiceType } from "@/lib/types";
import { api } from "@/lib/api";
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
    new Date().toISOString().slice(0, 7)
  );
  const [isExporting, setIsExporting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

      if (type === "month" && exportMonth) {
        const [year, month] = exportMonth.split("-");
        fetchFrom = new Date(Number(year), Number(month) - 1, 1).toISOString();
        fetchTo = new Date(
          Number(year),
          Number(month),
          0,
          23,
          59,
          59,
          999
        ).toISOString();
      }

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

      const excelData = data.map((item, index) => ({
        STT: item.stt || index + 1,
        "Ngày nhận mẫu": item.receivedAt
          ? new Date(item.receivedAt).toLocaleString("vi-VN")
          : "",
        "Mã ca": item.caseCode || "",
        "Tên bệnh nhân": item.patientName || "",
        "Nhóm dịch vụ": item.serviceType || "",
        "Mã dịch vụ": item.serviceCode || "",
        "Phòng Lab": item.lab || "",
        "Nguồn khách": item.source || "",
        "NVKD phụ trách": item.salesOwner || "",
        "Người thu mẫu": item.sampleCollector || "",
        "Giá thu (VNĐ)": item.collectedAmount || 0,
        "Giá vốn/Cost (VNĐ)": item.costPrice || 0,
        "Đã thanh toán": item.paid ? "Đã thanh toán" : "Chưa thanh toán",
        "Loại hóa đơn": item.invoiceType || "",
        "Tên công ty/ cá nhân (HĐ)": item.invoiceName || "",
        "Mã số thuế (HĐ)": item.invoiceTaxCode || "",
        "Số CCCD": item.invoiceIdCard || "",
        "Ngày cấp (nếu có)": item.invoiceIssueDate || "",
        "Nơi cấp (nếu có)": item.invoiceIssuePlace || "",
        "Địa chỉ (HĐ)": item.invoiceAddress || "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachCa");

      const fileName = `TongHop_TatCaDichVu_${
        type === "month" ? exportMonth : "TatCa"
      }_${new Date().getTime()}.xlsx`;
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
    <div className="border-b border-black/5 bg-white/80 backdrop-blur sticky top-0 z-40 shadow-sm">
      <div className="px-4 py-3">
        {/* LAYOUT: TỰ ĐỘNG CO GIÃN */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          
          {/* ================= CỘT TRÁI: TITLE & LEGEND (Thu nhỏ lại) ================= */}
          <div className="flex shrink-0 items-start gap-2.5">
            <span
              className={`inline-flex mt-0.5 items-center rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm ${meta.pill}`}
            >
              {meta.title}
            </span>
            <div className="flex flex-col">
              <h1 className="text-base font-bold text-neutral-900 leading-none mb-1.5">
                Danh sách ca
              </h1>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] font-medium text-neutral-500">
                <div className="flex items-center gap-1" title="Còn hơn 24 giờ nữa mới đến hạn">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                  &gt;24h
                </div>
                <div className="flex items-center gap-1" title="Chỉ còn dưới 24 giờ">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                  &lt;24h
                </div>
                <div className="flex items-center gap-1" title="Gấp: Chỉ còn dưới 12 giờ">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                  &lt;12h
                </div>
                <div className="flex items-center gap-1" title="Đã trễ hạn trả kết quả!">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                  Quá hạn
                </div>
                <div className="flex items-center gap-1" title="Trạng thái đã có kết quả">
                  <span className="h-1.5 w-1.5 rounded-full bg-white ring-1 ring-black/20"></span>
                  Đã có KQ
                </div>
              </div>
            </div>
          </div>

          {/* ================= CỘT GIỮA: THANH SEARCH (Tự động co bóp) ================= */}
          <div className="flex-1 flex justify-start xl:justify-center w-full min-w-[200px]">
            <div className="relative w-full max-w-md group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-3.5 h-3.5 text-neutral-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                value={props.q}
                onChange={(e) => props.setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (!props.loading) props.onApply();
                  }
                }}
                placeholder="Tìm mã ca, tên, nguồn..."
                className="w-full rounded-full border border-neutral-200 bg-neutral-50/50 pl-9 pr-3 py-1.5 text-[12px] text-neutral-800 shadow-sm outline-none transition-all placeholder:text-neutral-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* ================= CỘT PHẢI: BỘ LỌC & NÚT HÀNH ĐỘNG ================= */}
          <div className="flex flex-wrap lg:flex-nowrap shrink-0 items-center justify-start xl:justify-end gap-2">
            
            {/* Lọc Ngày */}
            <div className="flex items-center gap-1 bg-neutral-100/80 p-1 rounded-xl border border-neutral-200">
              <SingleDatePicker
                value={props.from}
                onChange={props.setFrom}
                placeholder="Từ ngày"
                disabled={!!props.loading}
                popoverWidth="lg"
                months={1}
                buttonClassName="w-[85px] bg-white border-none shadow-sm text-[11px] h-7 cursor-pointer"
              />
              <span className="text-neutral-400 text-[9px] font-bold px-0.5">→</span>
              <SingleDatePicker
                value={props.to}
                onChange={props.setTo}
                placeholder="Đến ngày"
                disabled={!!props.loading}
                popoverWidth="lg"
                months={1}
                buttonClassName="w-[85px] bg-white border-none shadow-sm text-[11px] h-7 cursor-pointer"
              />
              <button
                onClick={props.onApply}
                className="cursor-pointer rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 ml-0.5 px-3 h-7 text-[11px] font-semibold text-white shadow-sm hover:bg-black transition-colors disabled:opacity-50"
                disabled={props.loading}
              >
                {props.loading ? "..." : "Lọc"}
              </button>
            </div>

            <div className="hidden xl:block w-px h-6 bg-neutral-200 mx-0.5"></div>

            {/* Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={props.onAdd}
                className="cursor-pointer rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 h-8 text-[11px] font-semibold text-white shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
                Thêm ca
              </button>

              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  disabled={isExporting}
                  className="cursor-pointer rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 px-3 h-8 text-[11px] font-semibold shadow-sm hover:bg-emerald-100 disabled:opacity-60 flex items-center gap-1 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {isExporting ? "Đang xử lý..." : "Xuất Excel"}
                </button>

                {showExportMenu && !isExporting && (
                  <div className="absolute right-0 top-full mt-1.5 w-60 rounded-xl bg-white p-2.5 shadow-xl ring-1 ring-black/5 z-[100] animate-in fade-in slide-in-from-top-2">
                    <div className="text-[10px] font-bold text-neutral-400 mb-1.5 uppercase tracking-wider px-1">
                      Tùy chọn xuất
                    </div>
                    <button
                      onClick={() => handleExport("all")}
                      className="w-full text-left rounded-lg px-2.5 py-2 text-[12px] font-semibold text-neutral-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                      Xuất toàn bộ dữ liệu
                    </button>
                    <div className="my-1.5 border-t border-neutral-100"></div>
                    <div className="px-1">
                      <label className="block text-[10px] font-medium text-neutral-500 mb-1">
                        Hoặc chọn tháng:
                      </label>
                      <input
                        type="month"
                        value={exportMonth}
                        onChange={(e) => setExportMonth(e.target.value)}
                        className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-[12px] text-neutral-800 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 mb-2 transition-all"
                      />
                      <button
                        onClick={() => handleExport("month")}
                        disabled={!exportMonth}
                        className="w-full rounded-lg bg-emerald-600 px-2.5 py-2 text-[12px] font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-colors"
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
    </div>
  );
}