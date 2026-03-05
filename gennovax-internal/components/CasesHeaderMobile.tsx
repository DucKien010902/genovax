"use client";

import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import { ServiceType } from "@/lib/types";
import { api } from "@/lib/api";
import SingleDatePicker from "@/components/DatePicker";

interface MobileHeaderProps {
  serviceType: ServiceType;
  setServiceType: (v: ServiceType) => void;
  q: string;
  setQ: (v: string) => void;
  from: string;
  setFrom: (v: string) => void;
  to: string;
  setTo: (v: string) => void;
  loading?: boolean;
  onAdd: () => void;
  onApply: () => void;
}

export default function CasesHeaderMobile(props: MobileHeaderProps) {
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
        fetchTo = new Date(Number(year), Number(month), 0, 23, 59, 59, 999).toISOString();
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

      const excelData = data.map((item: any, index: number) => ({
        "STT": item.stt || index + 1,
        "Ngày tạo": item.date ? new Date(item.date).toLocaleDateString("vi-VN") : "",
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
        "Trạng thái chuyển Lab": item.transferStatus || "",
        "Trạng thái tiếp nhận": item.receiveStatus || "",
        "Trạng thái xử lý": item.processStatus || "",
        "Trạng thái phản hồi": item.feedbackStatus || "",
        "Ngày nhận mẫu": item.receivedAt ? new Date(item.receivedAt).toLocaleString("vi-VN") : "",
        "Hẹn trả KQ": item.dueDate ? new Date(item.dueDate).toLocaleString("vi-VN") : "",
        "Yêu cầu xuất HĐ": item.invoiceRequested ? "Có" : "Không",
        "Tên công ty (HĐ)": item.invoiceName || "",
        "Mã số thuế (HĐ)": item.invoiceTaxCode || "",
        "Địa chỉ (HĐ)": item.invoiceAddress || "",
        "Ghi chú chi tiết": item.detailNote || "",
      }));

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

  const serviceOptions: { label: string; value: ServiceType }[] = [
    { label: "NIPT", value: "NIPT" },
    { label: "ADN", value: "ADN" },
    { label: "HPV", value: "HPV" },
  ];

  return (
    <div className="border-b bg-white/95 backdrop-blur sticky top-0 z-40 shadow-sm">
      <div className="flex flex-col gap-3 px-4 py-3">
        
        {/* HÀNG 1: Tiêu đề & Cụm nút Thao tác */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-lg font-bold leading-tight text-neutral-900">
              Danh sách ca
            </h1>
          </div>
          <div className="flex items-center gap-2 relative" ref={menuRef}>
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              className="rounded-xl border border-emerald-600 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm hover:bg-emerald-50 disabled:opacity-60"
            >
              {isExporting ? "..." : "Xuất"}
            </button>
            <button
              onClick={props.onAdd}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:opacity-95 active:scale-95 transition-transform"
            >
              + Thêm
            </button>

            {/* Dropdown Xuất Excel (Ghim góc phải) */}
            {showExportMenu && !isExporting && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white p-3 shadow-xl ring-1 ring-black/10 z-50">
                <button
                  onClick={() => handleExport("all")}
                  className="w-full text-left rounded-xl px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  Xuất toàn bộ dữ liệu
                </button>
                <div className="my-2 border-t border-black/5"></div>
                <div className="px-3">
                  <label className="block text-[11px] font-semibold text-neutral-500 mb-1">Xuất theo tháng:</label>
                  <input 
                    type="month" 
                    value={exportMonth}
                    onChange={(e) => setExportMonth(e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-1.5 text-sm outline-none mb-2"
                  />
                  <button
                    onClick={() => handleExport("month")}
                    disabled={!exportMonth}
                    className="w-full rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
                  >
                    Tải tháng này
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* HÀNG 2: Chọn Loại Dịch Vụ */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {serviceOptions.map((opt) => {
            const isActive = props.serviceType === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  props.setServiceType(opt.value);
                  // Đã XÓA dòng setTimeout gọi API ở đây để chống lỗi Double-Fetch!
                }}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[12px] font-semibold border transition-all active:scale-95 ${
                  isActive
                    ? " bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-md"
                    : "border-black/10 bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* HÀNG 3: Tìm kiếm */}
        <input
          value={props.q}
          onChange={(e) => props.setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (!props.loading) props.onApply();
            }
          }}
          placeholder="Tìm mã ca, tên KH, nguồn..."
          className="w-full rounded-xl border border-black/10 bg-neutral-50 px-3 py-2 text-[13px] text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:bg-white focus:ring-2 focus:ring-indigo-300"
        />

        {/* HÀNG 4: Lọc Ngày & Nút */}
        {/* <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <SingleDatePicker
              value={props.from}
              onChange={props.setFrom}
              placeholder="Từ ngày"
              disabled={!!props.loading}
              buttonClassName="w-full h-9 text-xs"
            />
          </div>
          <span className="text-neutral-400 text-xs">-</span>
          <div className="flex-1 min-w-0">
            <SingleDatePicker
              value={props.to}
              onChange={props.setTo}
              placeholder="Đến ngày"
              disabled={!!props.loading}
              buttonClassName="w-full h-9 text-xs"
            />
          </div>
          <button
            onClick={props.onApply}
            disabled={props.loading}
            className="h-9 rounded-xl bg-neutral-900 px-4 text-xs font-semibold text-white shadow-sm transition-transform active:scale-95 disabled:opacity-60"
          >
            {props.loading ? "..." : "Lọc"}
          </button>
        </div> */}
        
      </div>
    </div>
  );
}