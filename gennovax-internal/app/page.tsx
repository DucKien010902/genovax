"use client";

import { useEffect, useState } from "react";
import SidebarService from "@/components/SidebarService";
import CasesHeader from "@/components/CasesHeader";
import CasesTable from "@/components/CasesTable";
import CaseDrawer from "@/components/CaseDrawer";
import { api } from "@/lib/api";
import type {
  CaseDraft,
  CaseRecord,
  OptionsMap,
  ServiceItem,
  DoctorItem,
  ServiceType,
} from "@/lib/types";

export default function CasesPage() {
  const [serviceType, setServiceType] = useState<ServiceType>("ADN");
  const [options, setOptions] = useState<OptionsMap>({});
  const [rows, setRows] = useState<CaseRecord[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [doctors, setDoctors] = useState<DoctorItem[]>([]);
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

      // ✅ thêm để chọn dịch vụ và tính giá
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

  const onSave = async (data: CaseDraft) => {
    if (data.isDraft) {
      const created = await api.createCase(data);
      setRows((prev) => [created, ...prev]);
      setOpen(false);
      setEditing(null);
      return;
    }
    if (data._id) {
      const updated = await api.updateCase(data._id, data);
      setRows((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
      setOpen(false);
      setEditing(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-neutral-50 to-neutral-100">
      <div className="flex">
        <div className="sticky top-0 h-screen">
          <SidebarService active={serviceType} onChange={setServiceType} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="sticky top-0 z-20">
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

          <div className="p-5">
            <CasesTable rows={rows} loading={loading} onRowClick={onEdit} />
          </div>
        </div>
      </div>

      <CaseDrawer
        open={open}
        data={editing}
        options={options}
        services={services}
        // doctors={doctors}
        onClose={onCloseDrawer}
        onSave={onSave}
      />
    </div>
  );
}
