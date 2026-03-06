"use client";

import { useEffect, useState } from "react";
import SidebarService from "@/components/SidebarService";
import CasesHeader from "@/components/CasesHeader";
import CasesTable from "@/components/CasesTable";
import CaseDrawer from "@/components/CaseDrawer";
import LoadingOverlay from "@/components/LoadingOverlay"; // ✅ Import Loading Component
import { api } from "@/lib/api";
import type {
  CaseDraft,
  CaseRecord,
  OptionsMap,
  ServiceItem,
  DoctorItem,
  ServiceType,
} from "@/lib/types";
import CasesHeaderMobile from "@/components/CasesHeaderMobile";
import { useAuth } from "@/lib/auth";

export default function CasesPage() {
  const { user } = useAuth();
  const [serviceType, setServiceType] = useState<ServiceType>("NIPT");
  const [options, setOptions] = useState<OptionsMap>({});
  const [rows, setRows] = useState<CaseRecord[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [doctors, setDoctors] = useState<DoctorItem[]>([]);
  
  // State quản lý loading toàn cục cho trang này
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CaseDraft | null>(null);

  // filter UI
  const [q, setQ] = useState("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  async function load() {
    setLoading(true);
    try {
      const [opt, list, svc, doc] = await Promise.all([
        api.options(),
        api.cases({ serviceType, q, from, to }),
        api.services(serviceType),
        api.doctors(""),
      ]);

      setOptions(opt);
      setRows(list.items);
      setServices(svc.items ?? []);
      setDoctors(doc.items ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, [serviceType]);
  
  const onApplyFilters = () => void load();

  const onAdd = () => {
    const draft: CaseDraft = {
      isDraft: true,
      serviceType,
      date: new Date().toISOString(),
      stt: 0,
      invoiceRequested: false,
      caseCode: "",
      patientName: "",
      lab: "",
      serviceId: null,
      serviceName: "",
      serviceCode: "",
      price: 0,
      detailNote: "",
      source: "",
      salesOwner: "",
      sampleCollector: "",
      doctorId: null,
      agentLevel: "",
      agentTierLabel: "",
      sentAt: null,
      paid: false,
      collectedAmount: 0,
      dueDate: null,
      transferStatus: "",
      receiveStatus: "",
      processStatus: "",
      feedbackStatus: "",
      glReturned: false,
      gxReceived: false,
      softFileDone: false,
      hardFileDone: false,
      invoiceInfo: "",
      invoiceName: "",
      invoiceTaxCode: "",
      invoiceAddress: "",
      receivedAt: null,
      createdBy: "",
      updatedBy: "",
    };

    setEditing(draft);
    setOpen(true);
  };

  const onEdit = (r: CaseRecord) => {
    setEditing({ ...r, isDraft: false });
    setOpen(true);
  };

  const onCloseDrawer = () => {
    setOpen(false);
    setEditing(null);
  };

  function validateCaseDraft(d: CaseDraft) {
    const errs: string[] = [];
    if (!d.caseCode) errs.push("Thiếu mã Code.");
    if (!d.serviceType) errs.push("Thiếu loại dịch vụ (serviceType).");
    if (!d.patientName?.trim()) errs.push("Thiếu họ và tên khách hàng.");
    if (!d.source?.trim()) errs.push("Thiếu nguồn.");
    if (!d.salesOwner?.trim()) errs.push("Thiếu NVKD phụ trách.");
    if (!d.serviceCode?.trim()) errs.push("Chưa chọn dịch vụ (mã).");
    if (!d.serviceName?.trim()) errs.push("Chưa có tên dịch vụ.");
    if (!d.collectedAmount || d.collectedAmount <= 0)
      errs.push("Tiền thu chưa được tính (giá = 0).");
    if (!d.transferStatus?.trim()) errs.push("Thiếu trạng thái chuyển lab.");
    if (!d.receiveStatus?.trim()) errs.push("Thiếu trạng thái tiếp nhận.");
    if (!d.processStatus?.trim()) errs.push("Thiếu trạng thái xử lý.");
    if (!d.receivedAt) errs.push("Chưa chọn ngày nhận mẫu.");

    if (d.invoiceRequested) {
      if (!d.invoiceName?.trim()) errs.push("Xuất Hóa đơn: Thiếu Tên đơn vị.");
      if (!d.invoiceTaxCode?.trim()) errs.push("Xuất Hóa đơn: Thiếu Mã số thuế.");
      if (!d.invoiceAddress?.trim()) errs.push("Xuất Hóa đơn: Thiếu Địa chỉ.");
    }
    return errs;
  }

  const onSave = async (data: CaseDraft) => {
    const errs = validateCaseDraft(data);
    if (errs.length) {
      alert("Không thể lưu vì thiếu thông tin:\n\n- " + errs.join("\n- "));
      return;
    }

    // ✅ Thêm bật loading ở đây để khi gọi api lưu dữ liệu thì xoay vòng vòng
    setLoading(true);
    try {
      // ✅ Đóng gói thêm thông tin người thao tác vào payload
      const payload = {
        ...data,
        currentUserName: user?.name || "Unknown",
        currentUserEmail: user?.email || "Unknown",
      };

      if (data.isDraft) {
        const created = await api.createCase(payload);
        setRows((prev) => [created, ...prev]);
      } else if (data._id) {
        const updated = await api.updateCase(data._id, payload);
        setRows((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
      }
      setOpen(false);
      setEditing(null);
    } catch (error:any) {
      console.error("Lỗi khi lưu:", error);
      alert(error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ Đặt Overlay Loading ra ngoài cùng để che toàn bộ màn hình */}
      <LoadingOverlay isLoading={loading} />

      <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-neutral-50 to-neutral-100">
        <div className="flex">
          <div className="sticky top-0 h-screen hidden lg:flex">
            <SidebarService active={serviceType} onChange={setServiceType} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="relative z-[20] hidden lg:block">
              <CasesHeader
                serviceType={serviceType}
                q={q}
                setQ={setQ}
                from={from}
                setFrom={setFrom}
                to={to}
                setTo={setTo}
                loading={loading}
                onAdd={onAdd}
                onApply={onApplyFilters}
              />
            </div>

            {/* MOBILE & TABLET HEADER */}
            <div className="block lg:hidden">
              <CasesHeaderMobile
                serviceType={serviceType}
                setServiceType={setServiceType}
                q={q}
                setQ={setQ}
                from={from}
                setFrom={setFrom}
                to={to}
                setTo={setTo}
                loading={loading}
                onAdd={onAdd}
                onApply={onApplyFilters}
              />
            </div>

            <div className="p-5 z-0">
              <CasesTable rows={rows} loading={loading} onRowClick={onEdit} />
            </div>
          </div>
        </div>

        <CaseDrawer
          open={open}
          data={editing}
          options={options}
          services={services}
          doctors={doctors}
          onClose={onCloseDrawer}
          onSave={onSave}
        />
      </div>
    </>
  );
}