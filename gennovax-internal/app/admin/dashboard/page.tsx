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
  LabelList, // ✅ IMPORT THÊM LabelList
} from "recharts";
import { caseApi } from "@/lib/api"; // Chỉnh lại path nếu cần
import LoadingOverlay from "@/components/LoadingOverlay";

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

function money(n: number) {
  return new Intl.NumberFormat("vi-VN").format(Math.round(n || 0));
}

// ✅ Format tiền rút gọn (chia 1 triệu, thêm 'Tr')
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

// Hàm sinh danh sách 24 tháng gần nhất
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

const COLOR_COST = "#f43f5e"; // rose
const COLOR_NET = "#3b82f6"; // emerald
const COLOR_REV = "#3b82f6"; // blue

export default function AdminDashboardPage() {
  const [p1Service, setP1Service] = useState("");
  const [p1Month, setP1Month] = useState("ALL");
  const [p1Loading, setP1Loading] = useState(true);
  const [p1Data, setP1Data] = useState<any>(null);

  const [p2Service, setP2Service] = useState("NIPT");
  const [p2Month, setP2Month] = useState("ALL");
  const [p2Loading, setP2Loading] = useState(true);
  const [p2Data, setP2Data] = useState<any>(null);

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
  const byService = p2Data?.byService || [];

  return (
    <>
      <LoadingOverlay isLoading={p1Loading || p2Loading} />
      <div className="min-h-screen bg-neutral-50 pb-12 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        {/* =======================
            PHẦN 1: TỔNG QUAN
        ======================= */}
        <div className="border-b border-black/5 bg-white px-4 py-6 shadow-sm dark:border-white/10 dark:bg-neutral-900">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-indigo-700 dark:text-indigo-400">
                  I: Tổng quan Doanh thu & Nguồn
                </h1>
                <p className="mt-1 text-sm text-neutral-500">
                  Thống kê toàn bộ dòng tiền, bảng xếp hạng các nguồn gửi mẫu và
                  biểu đồ doanh thu.
                </p>
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

            {/* KPI Cards */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <KpiCard
                title="Tổng Doanh thu"
                value={money(kpis.totalRevenue)}
                sub="Doanh thu dự kiến"
                icon="💰"
                theme="blue"
              />
              <KpiCard
                title="Tổng Chi phí"
                value={money(kpis.totalCost)}
                sub="Giá vốn xuất ra"
                icon="📉"
                theme="rose"
              />
              <KpiCard
                title="Lợi nhuận dự kiến (Net)"
                value={money(kpis.totalNetRevenue)}
                sub="Toàn bộ ca"
                icon="⚖️"
                highlight
              />

              {/* ✅ THẺ LỢI NHUẬN THỰC TẾ CẬP NHẬT THEO LOGIC MỚI */}
              <KpiCard
                title="Kế toán đã thu về"
                value={money(kpis.actualNetRevenue)}
                sub="Chỉ tính các ca đã TT"
                icon="💎"
                
                theme="amber"
              />

              <KpiCard
                title="Tỷ lệ thu tiền"
                value={pct(kpis.paidRate)}
                sub={`${kpis.paidCases}/${kpis.totalCases} ca đã TT`}
                icon="✅"
                theme="blue"
              />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Bảng Xếp Hạng Nguồn */}
              <Card
                title={`Bảng xếp hạng Nguồn ${p1Month !== "ALL" ? `(Tháng ${p1Month})` : "(Toàn thời gian)"}`}
              >
                <div className="max-h-[350px] overflow-auto rounded-xl border border-black/5 dark:border-white/10">
                  <table className="w-full border-collapse text-sm">
                    <thead className="sticky top-0 z-10 bg-white/95 backdrop-blur dark:bg-neutral-900/90">
                      <tr className="text-xs text-neutral-500">
                        <Th>#</Th>
                        <Th>Tên nguồn</Th>
                        <Th right>Lợi nhuận</Th>
                        <Th right>Tổng ca</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {bySource.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="py-8 text-center text-neutral-500"
                          >
                            Không có dữ liệu
                          </td>
                        </tr>
                      ) : (
                        bySource.map((x: any, i: number) => (
                          <tr
                            key={x.source}
                            className="border-t border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
                          >
                            <Td className="text-neutral-500 w-8">{i + 1}</Td>
                            <Td className="font-bold">{x.source}</Td>
                            <Td right className="font-semibold text-blue-600">
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

              {/* ✅ Biểu đồ Tháng (Cột Dọc) có hiện số trên đỉnh */}
              <Card
                title={`Biểu đồ Dòng tiền các tháng ${p1Service ? `(${p1Service})` : ""}`}
              >
                <div className="h-[350px] w-full pt-4">
                  <ResponsiveContainer>
                    <BarChart
                      data={monthlyTrend}
                      margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="ym" tick={{ fontSize: 12 }} />
                      <YAxis
                        tickFormatter={(v) => moneyMil(v)}
                        width={65}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        formatter={(v: any) => moneyMil(Number(v || 0))}
                        cursor={{ fill: "transparent" }}
                      />
                      <Legend />
                      <Bar
                        dataKey="netRevenue"
                        name="LN Dự kiến (Net)"
                        fill={COLOR_NET}
                        radius={[4, 4, 0, 0]}
                      >
                        <LabelList
                          dataKey="netRevenue"
                          position="top"
                          formatter={(v: any) => moneyMil(v)}
                          style={{
                            fontSize: "10px",
                            fill: "#525252",
                            fontWeight: 600,
                          }}
                        />
                      </Bar>
                      <Bar
                        dataKey="cost"
                        name="Chi phí (Cost)"
                        fill={COLOR_COST}
                        radius={[4, 4, 0, 0]}
                      >
                        <LabelList
                          dataKey="cost"
                          position="top"
                          formatter={(v: any) => moneyMil(v)}
                          style={{
                            fontSize: "10px",
                            fill: "#525252",
                            fontWeight: 600,
                          }}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* =======================
            PHẦN 2: PHÂN TÍCH DỊCH VỤ CHI TIẾT
        ======================= */}
        <div className="mx-auto mt-8 max-w-7xl px-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-fuchsia-700 dark:text-fuchsia-400">
                II: Phân tích Dịch vụ riêng
              </h2>
              <p className="mt-1 text-sm text-neutral-500">
                So sánh doanh thu và xếp hạng giữa các gói xét nghiệm trong cùng
                một loại dịch vụ.
              </p>
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

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* ✅ Biểu đồ Dịch vụ (Cột Ngang) có hiện số bên phải */}
            <Card
              title={`So sánh LN dự kiến các gói ${p2Service} ${p2Month !== "ALL" ? `(${p2Month})` : ""}`}
            >
              <div className="h-[500px] w-full pt-4">
                <ResponsiveContainer>
                  <BarChart
                    data={byService}
                    layout="vertical"
                    margin={{ top: 0, right: 50, left: 40, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
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
                      cursor={{ fill: "transparent" }}
                    />
                    <Legend />
                    <Bar
                      dataKey="netRevenue"
                      name="LN Dự kiến (Net)"
                      fill={COLOR_REV}
                      radius={[0, 4, 4, 0]}
                      barSize={20}
                    >
                      <LabelList
                        dataKey="netRevenue"
                        position="right"
                        formatter={(v: any) => moneyMil(v)}
                        style={{
                          fontSize: "10px",
                          fill: "#525252",
                          fontWeight: 600,
                        }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Bảng xếp hạng Dịch vụ */}
            <Card title={`Bảng xếp hạng gói ${p2Service}`}>
              <div className="max-h-[500px] overflow-auto rounded-xl border border-black/5 dark:border-white/10">
                <table className="w-full border-collapse text-sm">
                  <colgroup>
                    <col className="max-w-[60px]" /> {/* Cột 1: Mã Gói (Tăng rộng) */}
                    <col className="w-[140px]" />    {/* Cột 2: Tên Dịch Vụ (Giảm bớt, tự co giãn phần còn lại) */}
                    <col className="w-[120px]" /> {/* Cột 3: LN Dự kiến */}
                    <col className="w-[70px]" />  {/* Cột 4: SL Ca */}
                  </colgroup>
                  <thead className="sticky top-0 z-10 bg-white/95 backdrop-blur dark:bg-neutral-900/90">
                    <tr className="text-xs text-neutral-500">
                      <Th>Mã Gói</Th>
                      <Th>Tên dịch vụ</Th>
                      <Th right>LN Dự kiến</Th>
                      <Th right>SL Ca</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {byService.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-8 text-center text-neutral-500"
                        >
                          Không có dữ liệu
                        </td>
                      </tr>
                    ) : (
                      byService.map((x: any) => (
                        <tr
                          key={x.serviceCode}
                          className="border-t border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5"
                        >
                          <Td className="text-xs">
                            {x.serviceCode || "—"}
                          </Td>
                          <Td className="text-xs">
                            {x.serviceName || "Chưa xác định"}
                          </Td>
                          <Td right className="font-semibold text-blue-600">
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
          </div>
        </div>
      </div>
    </>
  );
}

/* ================= UI ATOMS ================= */

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-3xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900">
      <div className="mb-4 text-sm font-bold text-neutral-900 dark:text-white">
        {title}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function KpiCard({
  title,
  value,
  sub,
  icon,
  highlight = false,
  theme = "default",
}: any) {
  const themes: any = {
    default: {
      iconBg: "from-neutral-500/20 to-neutral-400/20",
      text: "text-neutral-900",
    },
    blue: { iconBg: "from-blue-500/20 to-cyan-500/20", text: "text-blue-600" },
    rose: { iconBg: "from-rose-500/20 to-pink-500/20", text: "text-rose-600" },
    amber: {
      iconBg: "from-amber-500/20 to-orange-500/20",
      text: "text-amber-600",
    },
    emerald: {
      iconBg: "from-blue-500/20 to-teal-500/20",
      text: "text-emerald-600",
    },
    indigo: {
      iconBg: "from-indigo-500/20 to-fuchsia-500/20",
      text: "text-indigo-600",
    },
  };
  const t = themes[theme] || themes.default;

  if (highlight) {
    return (
      <div className="flex flex-col justify-between rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white shadow-md transition-transform hover:scale-[1.02]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold text-emerald-50 uppercase tracking-wide">
              {title}
            </div>
            <div className="mt-2 text-xl font-extrabold tabular-nums">
              {value}
            </div>
            <div className="mt-1 text-xs text-emerald-100/80">{sub}</div>
          </div>
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/20 ring-1 ring-white/20">
            <span className="text-lg">{icon}</span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col justify-between rounded-3xl border border-black/5 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-neutral-500">{title}</div>
          <div
            className={cn("mt-2 text-xl font-extrabold tabular-nums", t.text)}
          >
            {value}
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">{sub}</div>
        </div>
        <div
          className={cn(
            "grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br ring-1 ring-black/5",
            t.iconBg,
          )}
        >
          <span className="text-lg">{icon}</span>
        </div>
      </div>
    </div>
  );
}

function SelectPill({ value, onChange, options }: any) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 rounded-2xl border border-black/10 bg-white px-4 text-sm font-semibold shadow-sm outline-none focus:ring-2 focus:ring-indigo-300"
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
        "px-4 py-3 text-left font-semibold border-b border-black/5",
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
