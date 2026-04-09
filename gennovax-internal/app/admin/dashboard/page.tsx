"use client";

import React, { useEffect, useState } from "react";
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
import { caseApi } from "@/lib/api";
import LoadingOverlay from "@/components/LoadingOverlay";

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

function getRecentMonths(count = 12) {
  const arr = [];
  const d = new Date();
  for (let i = 0; i < count; i++) {
    const m = d.getMonth() + 1;
    const y = d.getFullYear();
    arr.push(`${y}-${m.toString().padStart(2, "0")}`);
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

const SERVICE_OPTIONS = [
  { label: "Tất cả dịch vụ", value: "" },
  { label: "NIPT", value: "NIPT" },
  { label: "ADN", value: "ADN" },
  { label: "HPV", value: "HPV" },
  { label: "CELL", value: "CELL" },
];

const COLOR_NET = "#0ea5e9";
const COLOR_REV = "#38bdf8";

export default function AdminDashboardPage() {
  const [p1Service, setP1Service] = useState("");
  const [p1Month, setP1Month] = useState("ALL");
  const [p1Loading, setP1Loading] = useState(true);
  const [p1Data, setP1Data] = useState<any>(null);

  const [p2Service, setP2Service] = useState("NIPT");
  const [p2Month, setP2Month] = useState("ALL");
  const [p2Loading, setP2Loading] = useState(true);
  const [p2Data, setP2Data] = useState<any>(null);

  const [chartLimit, setChartLimit] = useState<number>(6);

  useEffect(() => {
    setP1Loading(true);
    caseApi
      .analytics({ serviceType: p1Service, month: p1Month })
      .then((res) => setP1Data(res))
      .finally(() => setP1Loading(false));
  }, [p1Service, p1Month]);

  useEffect(() => {
    setP2Loading(true);
    caseApi
      .analytics({ serviceType: p2Service, month: p2Month })
      .then((res) => setP2Data(res))
      .finally(() => setP2Loading(false));
  }, [p2Service, p2Month]);

  const kpis = p1Data?.kpis || {
    totalCases: 0,
    paidCases: 0,
    totalRevenue: 0,
    totalCost: 0,
    totalNetRevenue: 0,
    paidRate: 0,
    actualNetRevenue: 0,
  };
  const bySource = p1Data?.bySource || [];
  const monthlyTrend = p1Data?.monthlyTrend || [];
  const byService = (p2Data?.byService || []).filter((x: any) => {
    const name = x.serviceName || "";
    const code = x.serviceCode || "";
    return !name.includes("2025") && !code.includes("2025");
  });

  const displayMonthlyTrend = [...monthlyTrend]
    .sort((a, b) => b.ym.localeCompare(a.ym))
    .slice(0, chartLimit);

  return (
    <>
      <LoadingOverlay isLoading={p1Loading || p2Loading} />
      <div className="min-h-[calc(100vh-96px)] bg-[linear-gradient(180deg,#f8fbff_0%,#eef6ff_36%,#ffffff_100%)] pb-10">
        <div className="mx-auto max-w-[90%] space-y-8 p-4 sm:p-6">
          <section className="overflow-hidden rounded-[28px] border border-sky-100 bg-white shadow-[0_24px_80px_-48px_rgba(14,116,144,0.45)]">
            <div className="flex flex-col gap-5 bg-[radial-gradient(circle_at_top_left,#e0f2fe_0,#ffffff_55%)] p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-3">
                <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">
                  Revenue Dashboard
                </span>
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                    Tổng quan doanh thu và nguồn
                  </h1>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                    Giữ nguyên logic thống kê hiện tại, chỉ đồng bộ lại màu sắc và
                    chi tiết hiển thị để giống hệ giao diện analytics phòng khám.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <SelectPill
                  value={p1Service}
                  onChange={setP1Service}
                  options={SERVICE_OPTIONS}
                />
                <SelectPill
                  value={p1Month}
                  onChange={setP1Month}
                  options={MONTH_OPTIONS}
                />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <KpiCard
              title="Tổng doanh thu"
              value={money(kpis.totalRevenue)}
              sub="Doanh thu dự kiến"
            />
            <KpiCard
              title="Tổng chi phí"
              value={money(kpis.totalCost)}
              sub="Giá vốn xuất ra"
              tone="rose"
            />
            <KpiCard
              title="Lợi nhuận dự kiến"
              value={money(kpis.totalNetRevenue)}
              sub="Toàn bộ ca"
              highlight
            />
            <KpiCard
              title="Kế toán đã thu về"
              value={money(kpis.actualNetRevenue)}
              sub="Chỉ tính các ca đã TT"
              tone="amber"
            />
            <KpiCard
              title="Tỷ lệ thu tiền"
              value={pct(kpis.paidRate)}
              sub={`${kpis.paidCases}/${kpis.totalCases} ca đã TT`}
              tone="emerald"
            />
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card
              title={`Bảng xếp hạng nguồn ${p1Month !== "ALL" ? `(Tháng ${p1Month})` : "(Toàn thời gian)"}`}
            >
              <div className="max-h-[420px] overflow-auto rounded-[24px] border border-slate-200">
                <table className="w-full border-collapse text-sm">
                  <thead className="sticky top-0 z-10 bg-sky-50/90 backdrop-blur">
                    <tr className="text-xs uppercase tracking-[0.14em] text-slate-500">
                      <Th>#</Th>
                      <Th>Tên nguồn</Th>
                      <Th right>Lợi nhuận</Th>
                      <Th right>Tổng ca</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {bySource.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400">
                          Không có dữ liệu
                        </td>
                      </tr>
                    ) : (
                      bySource.map((x: any, i: number) => (
                        <tr
                          key={x.source}
                          className="border-t border-slate-100 hover:bg-sky-50/40"
                        >
                          <Td className="w-8 text-slate-400">{i + 1}</Td>
                          <Td className="font-semibold text-slate-900">{x.source}</Td>
                          <Td right className="font-semibold text-sky-700">
                            {money(x.netRevenue)}
                          </Td>
                          <Td right>{x.source.includes("2025") ? "#" : x.cases}</Td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card
              title={`Biểu đồ dòng tiền các tháng ${p1Service ? `(${p1Service})` : ""}`}
              action={
                <select
                  value={chartLimit}
                  onChange={(e) => setChartLimit(Number(e.target.value))}
                  className="h-10 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                >
                  <option value={6}>6 tháng gần nhất</option>
                  <option value={12}>12 tháng gần nhất</option>
                </select>
              }
            >
              <div className="h-[420px] w-full pt-4">
                <ResponsiveContainer>
                  <BarChart
                    data={displayMonthlyTrend}
                    margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbeafe" />
                    <XAxis dataKey="ym" tick={{ fontSize: 12 }} />
                    <YAxis
                      tickFormatter={(v) => moneyMil(v)}
                      width={65}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(v: any) => moneyMil(Number(v || 0))}
                      cursor={{ fill: "rgba(224,242,254,0.35)" }}
                    />
                    <Legend />
                    <Bar
                      dataKey="netRevenue"
                      name="LN dự kiến (Net)"
                      fill={COLOR_NET}
                      radius={[8, 8, 0, 0]}
                    >
                      <LabelList
                        dataKey="netRevenue"
                        position="top"
                        formatter={(v: any) => moneyMil(v)}
                        style={{
                          fontSize: "10px",
                          fill: "#64748b",
                          fontWeight: 600,
                        }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </section>

          <section className="overflow-hidden rounded-[28px] border border-sky-100 bg-white shadow-[0_24px_80px_-48px_rgba(14,116,144,0.45)]">
            <div className="flex flex-col gap-5 bg-[radial-gradient(circle_at_top_left,#e0f2fe_0,#ffffff_55%)] p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">
                  Service Breakdown
                </span>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Phân tích dịch vụ riêng
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    So sánh doanh thu và xếp hạng giữa các gói xét nghiệm trong cùng
                    một loại dịch vụ.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <SelectPill
                  value={p2Service}
                  onChange={setP2Service}
                  options={SERVICE_OPTIONS.filter((o) => o.value !== "")}
                />
                <SelectPill
                  value={p2Month}
                  onChange={setP2Month}
                  options={MONTH_OPTIONS}
                />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <Card
              title={`So sánh LN dự kiến các gói ${p2Service} ${p2Month !== "ALL" ? `(${p2Month})` : ""}`}
            >
              <div className="h-[520px] w-full pt-4">
                <ResponsiveContainer>
                  <BarChart
                    data={byService}
                    layout="vertical"
                    margin={{ top: 0, right: 50, left: 40, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#dbeafe" />
                    <XAxis
                      type="number"
                      tickFormatter={(v) => moneyMil(v)}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="serviceName"
                      width={100}
                      tick={{ fontSize: 10, fontWeight: "bold" }}
                    />
                    <Tooltip
                      formatter={(v: any) => moneyMil(Number(v || 0))}
                      cursor={{ fill: "rgba(224,242,254,0.35)" }}
                    />
                    <Legend />
                    <Bar
                      dataKey="netRevenue"
                      name="LN dự kiến (Net)"
                      fill={COLOR_REV}
                      radius={[0, 8, 8, 0]}
                      barSize={20}
                    >
                      <LabelList
                        dataKey="netRevenue"
                        position="right"
                        formatter={(v: any) => moneyMil(v)}
                        style={{
                          fontSize: "10px",
                          fill: "#64748b",
                          fontWeight: 600,
                        }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title={`Bảng xếp hạng gói ${p2Service}`}>
              <div className="max-h-[520px] overflow-auto rounded-[24px] border border-slate-200">
                <table className="w-full border-collapse text-sm">
                  <colgroup>
                    <col className="max-w-[60px]" />
                    <col className="w-[140px]" />
                    <col className="w-[120px]" />
                    <col className="w-[70px]" />
                  </colgroup>
                  <thead className="sticky top-0 z-10 bg-sky-50/90 backdrop-blur">
                    <tr className="text-xs uppercase tracking-[0.14em] text-slate-500">
                      <Th>Mã gói</Th>
                      <Th>Tên dịch vụ</Th>
                      <Th right>LN dự kiến</Th>
                      <Th right>SL ca</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {byService.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400">
                          Không có dữ liệu
                        </td>
                      </tr>
                    ) : (
                      byService.map((x: any) => (
                        <tr
                          key={x.serviceCode}
                          className="border-t border-slate-100 hover:bg-sky-50/40"
                        >
                          <Td className="text-xs">{x.serviceCode || "—"}</Td>
                          <Td className="text-xs">{x.serviceName || "Chưa xác định"}</Td>
                          <Td right className="font-semibold text-sky-700">
                            {money(x.netRevenue)}
                          </Td>
                          <Td right>{x.cases}</Td>
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
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.35)] sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        {action && <div>{action}</div>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function KpiCard({
  title,
  value,
  sub,
  highlight = false,
  tone = "default",
}: any) {
  const toneMap: Record<string, string> = {
    default: "text-slate-900",
    rose: "text-rose-600",
    amber: "text-amber-600",
    emerald: "text-emerald-600",
    sky: "text-sky-700",
  };

  if (highlight) {
    return (
      <div className="rounded-[28px] bg-gradient-to-br from-sky-500 to-cyan-500 p-5 text-white shadow-[0_24px_70px_-38px_rgba(14,116,144,0.55)]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-100">
          {title}
        </div>
        <div className="mt-3 text-2xl font-bold tabular-nums">{value}</div>
        <div className="mt-1 text-xs text-sky-100/80">{sub}</div>
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
      <div className="mt-1 text-xs text-slate-500">{sub}</div>
    </div>
  );
}

function SelectPill({ value, onChange, options }: any) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
    >
      {options.map((o: any) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Th({ children, right }: any) {
  return (
    <th
      className={cn(
        "border-b border-slate-100 px-4 py-3 text-left font-semibold",
        right && "text-right",
      )}
    >
      {children}
    </th>
  );
}

function Td({ children, right, className }: any) {
  return (
    <td className={cn("px-4 py-3", right && "text-right", className)}>
      {children}
    </td>
  );
}
