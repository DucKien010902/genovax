"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import LoadingOverlay from "@/components/LoadingOverlay";
import type { DoctorRevenueAnalyticsResponse, ServiceType } from "@/lib/types";

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

function money(n: number) {
  return new Intl.NumberFormat("vi-VN").format(Math.round(n || 0));
}

function moneyMil(n: number) {
  const val = (n || 0) / 1000000;
  return (
    new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(val) +
    " Tr"
  );
}

function pct(n: number) {
  return `${Math.round((n || 0) * 100)}%`;
}

function toChartNumber(value: unknown) {
  if (Array.isArray(value)) return Number(value[0] || 0);
  return Number(value || 0);
}

function chartMoney(value: unknown) {
  return money(toChartNumber(value));
}

function chartMoneyMil(value: unknown) {
  return moneyMil(toChartNumber(value));
}

function getRecentMonths(count = 12) {
  const arr = [];
  const d = new Date();
  for (let i = 0; i < count; i += 1) {
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    arr.push(`${y}-${String(m).padStart(2, "0")}`);
    d.setMonth(d.getMonth() - 1);
  }
  return arr;
}

const MONTH_OPTIONS = [
  { label: "Tất cả thời gian", value: "ALL" },
  ...getRecentMonths().map((m) => ({
    label: `Tháng ${m.split("-")[1]}/${m.split("-")[0]}`,
    value: m,
  })),
];

const SERVICE_OPTIONS: { label: string; value: ServiceType | "" }[] = [
  { label: "Tất cả dịch vụ", value: "" },
  { label: "NIPT", value: "NIPT" },
  { label: "ADN", value: "ADN" },
  { label: "HPV", value: "HPV" },
  { label: "CELL", value: "CELL" },
];

const emptyData: DoctorRevenueAnalyticsResponse = {
  filters: { salesOwner: "", month: "ALL" },
  availableSalesOwners: [],
  availableClinics: [],
  kpis: {
    totalCases: 0,
    totalRevenue: 0,
    totalCost: 0,
    totalNetRevenue: 0,
    paidCases: 0,
    paidRate: 0,
    clinicCount: 0,
    salesOwnerCount: 0,
  },
  monthlyTrend: [],
  byClinic: [],
  bySalesOwner: [],
};

export default function DoctorRevenueAnalyticsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [month, setMonth] = useState("ALL");
  const [serviceType, setServiceType] = useState<ServiceType | "">("");
  const [salesOwner, setSalesOwner] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DoctorRevenueAnalyticsResponse>(emptyData);

  const canSeeAllSalesOwners =
    user?.role === "admin" || user?.role === "super_admin";

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const res = await api.doctorRevenueAnalytics({
          month,
          serviceType,
          salesOwner: canSeeAllSalesOwners ? salesOwner : undefined,
          limit: 12,
        });

        if (cancelled) return;
        setData(res);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [month, serviceType, salesOwner, canSeeAllSalesOwners, user]);

  const monthlyTrend = useMemo(
    () => [...(data.monthlyTrend || [])].sort((a, b) => a.ym.localeCompare(b.ym)),
    [data.monthlyTrend],
  );

  const salesOwnerChartData = useMemo(
    () => (data.bySalesOwner || []).slice(0, 8),
    [data.bySalesOwner],
  );

  if (!user) return <div className="p-6">Bạn chưa đăng nhập.</div>;

  return (
    <>
      <LoadingOverlay isLoading={loading} />
      <div className="min-h-[calc(100vh-96px)] bg-[linear-gradient(180deg,#f8fbff_0%,#eef6ff_36%,#ffffff_100%)] pb-10">
        <div className="mx-auto max-w-[90%] space-y-6 p-4 sm:p-6">
          <section className="overflow-hidden rounded-[28px] border border-sky-100 bg-white shadow-[0_24px_80px_-48px_rgba(14,116,144,0.45)]">
            <div className="flex flex-col gap-5 bg-[radial-gradient(circle_at_top_left,#e0f2fe_0,#ffffff_55%)] p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">
                  Doctor Revenue
                </span>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                    Thống kê doanh thu phòng khám
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                    Phân tích doanh thu theo tháng, theo phòng khám và tổng hợp theo
                    NVKD. Dữ liệu đang tính theo đúng tên phòng khám và tên NVKD trong ca.
                  </p>
                </div>
              </div>

              <button
                onClick={() => router.push("/admin/doctors")}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Quay lại phòng khám
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 border-t border-sky-100 bg-sky-50/50 px-5 py-4 lg:grid-cols-4 sm:px-6">
              <SelectBox
                label="Thời gian"
                value={month}
                onChange={setMonth}
                options={MONTH_OPTIONS}
              />
              <SelectBox
                label="Dịch vụ"
                value={serviceType}
                onChange={(v) => setServiceType(v as ServiceType | "")}
                options={SERVICE_OPTIONS}
              />
              {canSeeAllSalesOwners ? (
                <SelectBox
                  label="NVKD"
                  value={salesOwner}
                  onChange={setSalesOwner}
                  options={[
                    { label: "Tất cả NVKD", value: "" },
                    ...(data.availableSalesOwners || []).map((item) => ({
                      label: item,
                      value: item,
                    })),
                  ]}
                />
              ) : (
                <InfoTile
                  label="Phạm vi xem"
                  value={user.role === "sales" ? "Phòng khám của bạn" : "Toàn bộ"}
                />
              )}
              <InfoTile
                label="Số phòng khám"
                value={String(data.kpis.clinicCount || 0)}
              />
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <KpiCard title="Tổng doanh thu" value={money(data.kpis.totalRevenue)} />
            <KpiCard title="Tổng chi phí" value={money(data.kpis.totalCost)} tone="rose" />
            <KpiCard
              title="Lợi nhuận dự kiến"
              value={money(data.kpis.totalNetRevenue)}
              tone="sky"
              highlight
            />
            <KpiCard
              title="Tỷ lệ đã thanh toán"
              value={pct(data.kpis.paidRate)}
              sub={`${data.kpis.paidCases}/${data.kpis.totalCases} ca`}
              tone="emerald"
            />
            <KpiCard
              title="Số NVKD"
              value={String(data.kpis.salesOwnerCount || 0)}
              sub="Trong phạm vi dữ liệu"
              tone="amber"
            />
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card title="Biểu đồ doanh thu theo tháng">
              <div className="h-[360px] w-full pt-4">
                <ResponsiveContainer>
                  <BarChart data={monthlyTrend} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbeafe" />
                    <XAxis dataKey="ym" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(v) => moneyMil(v)} width={65} tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(v) => chartMoney(v)}
                      cursor={{ fill: "rgba(224,242,254,0.35)" }}
                    />
                    <Legend />
                    <Bar
                      dataKey="netRevenue"
                      name="Lợi nhuận"
                      fill="#0ea5e9"
                      radius={[8, 8, 0, 0]}
                    >
                      <LabelList
                        dataKey="netRevenue"
                        position="top"
                        formatter={(v) => chartMoneyMil(v)}
                        style={{ fontSize: "10px", fill: "#64748b", fontWeight: 600 }}
                      />
                    </Bar>
                    <Bar dataKey="revenue" name="Doanh thu" fill="#7dd3fc" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Tổng hợp theo NVKD">
              <div className="h-[360px] w-full pt-4">
                <ResponsiveContainer>
                  <BarChart
                    data={salesOwnerChartData}
                    layout="vertical"
                    margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#dbeafe" />
                    <XAxis type="number" tickFormatter={(v) => moneyMil(v)} tick={{ fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="salesOwner"
                      width={120}
                      tick={{ fontSize: 11, fontWeight: "bold" }}
                    />
                    <Tooltip
                      formatter={(v) => chartMoney(v)}
                      cursor={{ fill: "rgba(224,242,254,0.35)" }}
                    />
                    <Legend />
                    <Bar
                      dataKey="netRevenue"
                      name="Lợi nhuận"
                      fill="#0284c7"
                      radius={[0, 8, 8, 0]}
                      barSize={18}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card title="Bảng doanh thu theo phòng khám">
              <div className="max-h-[520px] overflow-auto rounded-[24px] border border-slate-200">
                <table className="w-full border-collapse text-sm">
                  <thead className="sticky top-0 z-10 bg-sky-50/90 backdrop-blur">
                    <tr className="text-xs uppercase tracking-[0.14em] text-slate-500">
                      <Th>#</Th>
                      <Th>Phòng khám</Th>
                      <Th>NVKD</Th>
                      <Th right>Doanh thu</Th>
                      <Th right>Lợi nhuận</Th>
                      <Th right>Số ca</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.byClinic.length === 0 ? (
                      <EmptyRow colSpan={6} />
                    ) : (
                      data.byClinic.map((item, index) => (
                        <tr key={`${item.clinicName}-${index}`} className="border-t border-slate-100 hover:bg-sky-50/40">
                          <Td className="text-slate-400">{index + 1}</Td>
                          <Td className="font-semibold text-slate-900">{item.clinicName}</Td>
                          <Td>{item.salesOwner || "—"}</Td>
                          <Td right className="font-semibold text-slate-800">
                            {money(item.revenue)}
                          </Td>
                          <Td right className="font-semibold text-sky-700">
                            {money(item.netRevenue)}
                          </Td>
                          <Td right>{item.cases}</Td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card title="Bảng tổng hợp theo NVKD">
              <div className="max-h-[520px] overflow-auto rounded-[24px] border border-slate-200">
                <table className="w-full border-collapse text-sm">
                  <thead className="sticky top-0 z-10 bg-sky-50/90 backdrop-blur">
                    <tr className="text-xs uppercase tracking-[0.14em] text-slate-500">
                      <Th>#</Th>
                      <Th>NVKD</Th>
                      <Th right>Phòng khám</Th>
                      <Th right>Doanh thu</Th>
                      <Th right>Lợi nhuận</Th>
                      <Th right>Số ca</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.bySalesOwner.length === 0 ? (
                      <EmptyRow colSpan={6} />
                    ) : (
                      data.bySalesOwner.map((item, index) => (
                        <tr key={`${item.salesOwner}-${index}`} className="border-t border-slate-100 hover:bg-sky-50/40">
                          <Td className="text-slate-400">{index + 1}</Td>
                          <Td className="font-semibold text-slate-900">{item.salesOwner}</Td>
                          <Td right>{item.clinicCount}</Td>
                          <Td right className="font-semibold text-slate-800">
                            {money(item.revenue)}
                          </Td>
                          <Td right className="font-semibold text-sky-700">
                            {money(item.netRevenue)}
                          </Td>
                          <Td right>{item.cases}</Td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.35)] sm:p-6">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function KpiCard({
  title,
  value,
  sub,
  tone = "default",
  highlight = false,
}: {
  title: string;
  value: string;
  sub?: string;
  tone?: "default" | "sky" | "rose" | "emerald" | "amber";
  highlight?: boolean;
}) {
  const toneMap = {
    default: "text-slate-900",
    sky: "text-sky-700",
    rose: "text-rose-600",
    emerald: "text-emerald-600",
    amber: "text-amber-600",
  };

  if (highlight) {
    return (
      <div className="rounded-[28px] bg-gradient-to-br from-sky-500 to-cyan-500 p-5 text-white shadow-[0_24px_70px_-38px_rgba(14,116,144,0.55)]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-100">
          {title}
        </div>
        <div className="mt-3 text-2xl font-bold tabular-nums">{value}</div>
        {sub && <div className="mt-1 text-xs text-sky-100/80">{sub}</div>}
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_40px_-34px_rgba(15,23,42,0.3)]">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        {title}
      </div>
      <div className={cn("mt-3 text-2xl font-bold tabular-nums", toneMap[tone])}>
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

function SelectBox({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
      >
        {options.map((option) => (
          <option key={`${label}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </div>
      <div className="flex h-11 items-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700">
        {value}
      </div>
    </div>
  );
}

function Th({ children, right = false }: { children: React.ReactNode; right?: boolean }) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-left font-semibold border-b border-slate-100",
        right && "text-right",
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  right = false,
  className,
}: {
  children: React.ReactNode;
  right?: boolean;
  className?: string;
}) {
  return (
    <td className={cn("px-4 py-3", right && "text-right", className)}>{children}</td>
  );
}

function EmptyRow({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-10 text-center text-sm text-slate-400">
        Không có dữ liệu.
      </td>
    </tr>
  );
}
