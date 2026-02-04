"use client";

import { ServiceType } from "@/lib/types";
import DateRangePicker from "@/components/DatePicker"; // ✅ sửa path nếu bạn đặt chỗ khác
import DatePicker from "@/components/DatePicker";
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

  return (
    <div className="border-b bg-white/80 backdrop-blur">
      <div className="px-5 py-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${meta.pill}`}
            >
              {meta.title}
            </span>
            <div>
              <div className="text-lg font-semibold text-neutral-900">
                Danh sách ca
              </div>
              <div className="text-sm text-neutral-500">{meta.desc}</div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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
                placeholder="Tìm theo mã ca / tên / mã hàng..."
                className="w-full sm:w-[320px] rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-neutral-300"
              />
            </div>

            {/* ✅ DateRangePicker thay cho 2 input date */}
            <div className="flex items-center gap-2">
  <SingleDatePicker
    value={props.from}
    onChange={props.setFrom}
    placeholder="Từ ngày"
    disabled={!!props.loading}
    popoverWidth="lg"
    months={1}
    buttonClassName="w-[160px]"
  />
  <span className="text-xs text-neutral-500">→</span>
  <SingleDatePicker
    value={props.to}
    onChange={props.setTo}
    placeholder="Đến ngày"
    disabled={!!props.loading}
    popoverWidth="lg"
    months={1}
    buttonClassName="w-[160px]"
  />
</div>

            {/* Actions */}
            <button
              onClick={props.onApply}
              className="rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-60"
              disabled={props.loading}
            >
              {props.loading ? "Đang lọc..." : "Lọc"}
            </button>

            <button
              onClick={props.onAdd}
              className="rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-95"
            >
              + Thêm ca
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
