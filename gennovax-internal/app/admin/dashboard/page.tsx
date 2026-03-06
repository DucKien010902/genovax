"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Brush,
} from "recharts";
import SingleDatePicker, { ISODate } from "@/components/DatePicker"; // chỉnh path
import { caseApi } from "@/lib/api"; // chỉnh path

import { ServiceType } from "@/lib/types";
import LoadingOverlay from "@/components/LoadingOverlay";
type ScopeMode = "total" | "month";

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

function money(n: number) {
  return new Intl.NumberFormat("vi-VN").format(Math.round(n || 0));
}
function pct(n: number) {
  return `${Math.round((n || 0) * 100)}%`;
}
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

const COLOR_PRIMARY = "#6366f1"; // indigo
const COLOR_ACCENT = "#d946ef"; // fuchsia
const COLOR_COST = "#f43f5e"; // rose
const COLOR_NET = "#10b981"; // emerald

export default function AdminDashboardPage() {
  const [serviceType, setServiceType] = useState<ServiceType | "">("");
  const [from, setFrom] = useState<ISODate>("");
  const [to, setTo] = useState<ISODate>("");
  const [top, setTop] = useState<number>(10);

  // top sources filter
  const [scopeMode, setScopeMode] = useState<ScopeMode>("total");
  const [pickedMonth, setPickedMonth] = useState<string>(""); // "YYYY-MM"

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  // monthly zoom = number of months shown
  const [monthsWindow, setMonthsWindow] = useState<number>(12);
  const [brush, setBrush] = useState<{
    startIndex: number;
    endIndex: number;
  } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await caseApi.analytics({
        serviceType: serviceType as any,
        from,
        to,
        top,
      });
      setData(r);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sourceKeys: string[] = data?.sourceKeys || [];

  const kpis = data?.kpis || {
    totalCases: 0,
    paidCases: 0,
    totalRevenue: 0,
    totalCost: 0,
    totalNetRevenue: 0,
    paidRate: 0,
  };

  const bySource = data?.bySource || [];
  const monthlyDetails = data?.monthlyDetails || [];
  const monthlyBarsData = useMemo(() => {
    const arr = (data?.monthly || []).map((x: any) => ({
      ...x,
      ym: String(x.ym),
      totalRevenue: Number(x.totalRevenue || 0),
      totalCost: Number(x.totalCost || 0),
      totalNetRevenue: Number(x.totalNetRevenue || 0),
    }));
    arr.sort((a: any, b: any) => String(a.ym).localeCompare(String(b.ym)));
    return arr;
  }, [data?.monthly]);

  const months = useMemo<string[]>(
    () => (monthlyBarsData as Array<{ ym: string }>).map((x) => String(x.ym)),
    [monthlyBarsData],
  );

  useEffect(() => {
    if (!pickedMonth && months.length)
      setPickedMonth(months[months.length - 1]);
  }, [months, pickedMonth]);

  useEffect(() => {
    if (!monthlyBarsData.length) return;
    const n = monthlyBarsData.length;
    const win = clamp(monthsWindow, 3, 60);
    const start = Math.max(0, n - win);
    const end = n - 1;
    setBrush({ startIndex: start, endIndex: end });
  }, [monthlyBarsData.length]);

  const zoomToLastN = (win: number) => {
    const n = monthlyBarsData.length;
    if (!n) return;
    const w = clamp(win, 3, 60);
    setMonthsWindow(w);
    setBrush({ startIndex: Math.max(0, n - w), endIndex: n - 1 });
  };

  const shiftWindow = (dir: -1 | 1) => {
    if (!brush) return;
    const n = monthlyBarsData.length;
    if (!n) return;

    const width = brush.endIndex - brush.startIndex;
    const step = Math.max(1, Math.floor(width * 0.35));
    let s = brush.startIndex + dir * step;
    let e = brush.endIndex + dir * step;

    if (s < 0) {
      e = e - s;
      s = 0;
    }
    if (e > n - 1) {
      const over = e - (n - 1);
      s = s - over;
      e = n - 1;
      if (s < 0) s = 0;
    }
    setBrush({ startIndex: s, endIndex: e });
  };

  // Tính toán bảng data đầy đủ (cho cả Bảng dưới và Biểu đồ top)
  const tableData = useMemo(() => {
    if (scopeMode === "total") {
      return bySource; // Backend đã sort sẵn theo Thực thu (netRevenue)
    }

    // scopeMode === "month"
    const filtered = monthlyDetails.filter((x: any) => x.ym === pickedMonth);
    const arr = filtered.map((x: any) => ({
      source: x.source,
      revenue: x.revenue,
      cost: x.cost,
      netRevenue: x.netRevenue,
      totalCases: x.cases,
      paidCases: x.paidCases,
      paidRate: x.cases > 0 ? x.paidCases / x.cases : 0,
    }));
    arr.sort((a: any, b: any) => b.netRevenue - a.netRevenue); // Xếp theo thực thu
    return arr;
  }, [scopeMode, pickedMonth, bySource, monthlyDetails]);

  // Chart chỉ lấy "top" từ mảng đã sort ở trên
  const topSourcesComputed = useMemo(() => {
    return tableData.slice(0, clamp(top, 1, 50));
  }, [tableData, top]);

  const activeSources = useMemo(() => {
    return tableData.slice(0, 8).map((x: any) => x.source);
  }, [tableData]);

  const empty =
    !monthlyBarsData.length && !bySource.length && !topSourcesComputed.length;

  return (
    <>
    <LoadingOverlay isLoading={loading} />
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-black/5 bg-white/75 backdrop-blur dark:border-white/10 dark:bg-neutral-950/70">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 ring-1 ring-black/5 dark:ring-white/10">
              <span className="text-lg">📊</span>
            </div>
            <div>
              <div className="text-sm font-semibold leading-5">
                Admin Dashboard
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                Doanh thu • Nguồn • Thực thu
              </div>
            </div>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <SelectPill
              value={serviceType}
              onChange={(v) => setServiceType(v as any)}
              options={[
                { label: "Tất cả dịch vụ", value: "" },
                { label: "NIPT", value: "NIPT" },
                { label: "ADN", value: "ADN" },
                { label: "HPV", value: "HPV" },
              ]}
            />

            <SingleDatePicker
              value={from}
              onChange={setFrom}
              placeholder="Từ ngày"
              months={1}
              popoverWidth="lg"
              buttonClassName="h-10"
            />
            <SingleDatePicker
              value={to}
              onChange={setTo}
              placeholder="Đến ngày"
              months={1}
              popoverWidth="lg"
              buttonClassName="h-10"
            />

            <div className="flex h-10 items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 text-sm shadow-sm dark:border-white/10 dark:bg-neutral-900">
              <span className="text-neutral-500 dark:text-neutral-400">
                Top
              </span>
              <input
                type="number"
                value={top}
                min={1}
                max={50}
                onChange={(e) => setTop(Number(e.target.value || 10))}
                className="w-16 bg-transparent text-right outline-none"
              />
            </div>

            <button
              onClick={load}
              disabled={loading}
              className={cn(
                "h-10 rounded-2xl px-4 text-sm font-semibold shadow-sm",
                "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white",
                "hover:opacity-95 disabled:opacity-60 disabled:cursor-not-allowed",
              )}
            >
              {loading ? "Loading..." : "Áp dụng"}
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* KPI */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <KpiCard
            title="Tổng Doanh thu"
            value={money(kpis.totalRevenue)}
            sub="VNĐ (Collected)"
            icon="💰"
            theme="blue"
          />
          <KpiCard
            title="Tổng Chi phí (Cost)"
            value={money(kpis.totalCost)}
            sub="VNĐ (Cost price)"
            icon="📉"
            theme="rose"
          />
          <KpiCard
            title="Thực thu (Net)"
            value={money(kpis.totalNetRevenue)}
            sub="Doanh thu - Chi phí"
            icon="💎"
            highlight={true}
          />
          <KpiCard
            title="Tổng số ca"
            value={money(kpis.totalCases)}
            sub="cases"
            icon="🧾"
            theme="amber"
          />
          <KpiCard
            title="Số ca đã thu"
            value={money(kpis.paidCases)}
            sub={`Paid rate: ${pct(kpis.paidRate)}`}
            icon="✅"
            theme="indigo"
          />
        </div>

        {/* Global Filter Bar: Dùng chung cho cả Biểu đồ Top & Bảng dưới */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 rounded-3xl border border-black/5 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-neutral-900">
          <div>
            <div className="text-sm font-semibold">
              Chế độ xem dữ liệu Nguồn
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Lọc theo <b>Tổng</b> hoặc theo <b>tháng</b> (áp dụng cho cả Biểu
              đồ & Bảng xếp hạng)
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Segment
              value={scopeMode}
              onChange={(v) => setScopeMode(v as ScopeMode)}
              options={[
                { value: "total", label: "Tổng" },
                { value: "month", label: "Theo tháng" },
              ]}
            />
            <SelectPill
              value={pickedMonth}
              onChange={(v) => setPickedMonth(v)}
              disabled={scopeMode !== "month"}
              options={[
                { label: "Chọn tháng", value: "" },
                ...months.map((m) => ({ label: m, value: m })),
              ]}
            />
          </div>
        </div>

        {/* TOP + RANKING (trên) */}
        <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-sm font-semibold">
                  Top nguồn theo Thực thu (Net)
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  {scopeMode === "total"
                    ? "Đang xem: cộng dồn tất cả tháng"
                    : `Đang xem: tháng ${pickedMonth || "—"}`}
                </div>
              </div>
            </div>

            <div className="mt-3">
              <div className="mt-3 h-[320px]">
                <ResponsiveContainer>
                  <BarChart data={topSourcesComputed}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" hide />
                    <YAxis tickFormatter={(v) => money(v)} />
                    <Tooltip
                      formatter={(v: any) => money(Number(v || 0))}
                      labelFormatter={(l) => `Nguồn: ${l}`}
                    />
                    <Legend />
                    <Bar
                      dataKey="netRevenue"
                      name="Thực thu (Net)"
                      radius={[10, 10, 0, 0]}
                      fill={COLOR_NET}
                    />
                    <Bar
                      dataKey="cost"
                      name="Chi phí (Cost)"
                      radius={[10, 10, 0, 0]}
                      fill={COLOR_COST}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Xếp hạng nguồn</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  Sắp xếp ưu tiên theo Thực thu (Net)
                </div>
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                {loading ? "Đang tải..." : `${tableData.length} nguồn`}
              </div>
            </div>

            <div className="mt-3 max-h-[340px] overflow-auto rounded-2xl border border-black/5 dark:border-white/10">
              <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 bg-white/95 backdrop-blur dark:bg-neutral-900/90 z-10">
                  <tr className="text-xs text-neutral-500 dark:text-neutral-400">
                    <Th>#</Th>
                    <Th>Nguồn</Th>
                    <Th right>Tổng DT</Th>
                    <Th right>Chi phí</Th>
                    <Th right>Thực thu</Th>
                    <Th right>Ca</Th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((x: any, idx: number) => (
                    <tr
                      key={x.source}
                      className="border-t border-black/5 dark:border-white/10"
                    >
                      <Td className="w-10 text-neutral-500 dark:text-neutral-400">
                        {idx + 1}
                      </Td>
                      <Td className="font-medium">{x.source}</Td>
                      <Td right className="tabular-nums">
                        {money(x.revenue)}
                      </Td>
                      <Td
                        right
                        className="tabular-nums text-rose-600 dark:text-rose-400"
                      >
                        {money(x.cost)}
                      </Td>
                      <Td
                        right
                        className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400"
                      >
                        {money(x.netRevenue)}
                      </Td>
                      <Td right className="tabular-nums">
                        {x.totalCases}
                      </Td>
                    </tr>
                  ))}

                  {!tableData.length ? (
                    <tr>
                      <td
                        className="px-3 py-10 text-center text-sm text-neutral-500 dark:text-neutral-400"
                        colSpan={6}
                      >
                        {loading ? "Đang tải..." : "Không có dữ liệu"}
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* MONTHLY CHART (zoom theo số tháng hiển thị) */}
        <div className="mt-5">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-sm font-semibold">
                  Dòng tiền theo tháng
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  Kéo thanh dưới để chọn khoảng tháng (Zoom)
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className="h-9 rounded-2xl px-3 text-xs font-semibold ring-1 ring-black/10 hover:bg-black/5 dark:ring-white/10 dark:hover:bg-white/5"
                  onClick={() => shiftWindow(-1)}
                  disabled={!brush}
                >
                  ←
                </button>

                <button
                  type="button"
                  className="h-9 rounded-2xl px-3 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:opacity-95 disabled:opacity-60"
                  onClick={() => zoomToLastN(monthsWindow - 3)}
                  disabled={!monthlyBarsData.length}
                >
                  − tháng
                </button>

                <div className="text-xs text-neutral-500 dark:text-neutral-400 tabular-nums">
                  {brush
                    ? `${brush.endIndex - brush.startIndex + 1} tháng`
                    : `${monthsWindow} tháng`}
                </div>

                <button
                  type="button"
                  className="h-9 rounded-2xl px-3 text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:opacity-95 disabled:opacity-60"
                  onClick={() => zoomToLastN(monthsWindow + 3)}
                  disabled={!monthlyBarsData.length}
                >
                  + tháng
                </button>

                <button
                  type="button"
                  className="h-9 rounded-2xl px-3 text-xs font-semibold ring-1 ring-black/10 hover:bg-black/5 dark:ring-white/10 dark:hover:bg-white/5"
                  onClick={() => shiftWindow(1)}
                  disabled={!brush}
                >
                  →
                </button>

                <button
                  type="button"
                  className="h-9 rounded-2xl px-3 text-xs font-semibold ring-1 ring-black/10 hover:bg-black/5 dark:ring-white/10 dark:hover:bg-white/5"
                  onClick={() => zoomToLastN(12)}
                  disabled={!monthlyBarsData.length}
                >
                  12m
                </button>
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-black/5 bg-gradient-to-b from-white to-neutral-50 p-3 dark:border-white/10 dark:from-neutral-900 dark:to-neutral-950">
              <div className="h-[380px]">
                <ResponsiveContainer>
                  <BarChart data={monthlyBarsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ym" />
                    <YAxis tickFormatter={(v) => money(v)} />
                    <Tooltip formatter={(v: any) => money(Number(v || 0))} />
                    <Legend />
                    <Bar
                      dataKey="totalNetRevenue"
                      name="Thực thu (Net)"
                      fill={COLOR_NET}
                      radius={[10, 10, 0, 0]}
                    />
                    <Bar
                      dataKey="totalCost"
                      name="Chi phí (Cost)"
                      fill={COLOR_COST}
                      radius={[10, 10, 0, 0]}
                    />
                    {/* ✅ brush = chọn range tháng để zoom */}
                    <Brush
                      dataKey="ym"
                      height={32}
                      stroke={COLOR_ACCENT}
                      travellerWidth={10}
                      startIndex={brush?.startIndex}
                      endIndex={brush?.endIndex}
                      onChange={(r: any) => {
                        if (!r) return;
                        const s = Number(r.startIndex ?? 0);
                        const e = Number(
                          r.endIndex ?? monthlyBarsData.length - 1,
                        );
                        setBrush({ startIndex: s, endIndex: e });
                        setMonthsWindow(e - s + 1);
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* optional compare line sources */}
            <div className="mt-4 rounded-2xl border border-black/5 bg-white p-3 dark:border-white/10 dark:bg-neutral-900">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  Tăng trưởng Thực thu các nguồn top đầu (Line)
                </div>
              </div>

              <div className="mt-2 h-[300px]">
                <ResponsiveContainer>
                  <LineChart data={monthlyBarsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ym" />
                    <YAxis tickFormatter={(v) => money(v)} />
                    <Tooltip formatter={(v: any) => money(Number(v || 0))} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="totalNetRevenue"
                      stroke={COLOR_NET}
                      strokeWidth={3}
                      dot={false}
                      name="Tổng Thực thu"
                    />
                    {activeSources.map((k: string, i: number) => (
                      <Line
                        key={k}
                        type="monotone"
                        dataKey={k} // backend mapping obj[row.source] = row.netRevenue
                        strokeWidth={1.5}
                        dot={false}
                        stroke={palette(i)}
                        name={k}
                      />
                    ))}

                    <Brush
                      dataKey="ym"
                      height={28}
                      stroke={COLOR_ACCENT}
                      travellerWidth={10}
                      startIndex={brush?.startIndex}
                      endIndex={brush?.endIndex}
                      onChange={(r: any) => {
                        if (!r) return;
                        const s = Number(r.startIndex ?? 0);
                        const e = Number(
                          r.endIndex ?? monthlyBarsData.length - 1,
                        );
                        setBrush({ startIndex: s, endIndex: e });
                        setMonthsWindow(e - s + 1);
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {empty ? (
              <div className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
                {loading
                  ? "Đang tải dữ liệu..."
                  : "Không có dữ liệu trong khoảng lọc hiện tại."}
              </div>
            ) : null}
          </Card>
        </div>
      </div>
    </div>
    </>
  );
}

/* ================= UI atoms ================= */

function palette(i: number) {
  const colors = [
    "#06b6d4",
    "#f59e0b",
    "#a78bfa",
    "#fb7185",
    "#34d399",
    "#60a5fa",
    "#f472b6",
    "#2dd4bf",
  ];
  return colors[i % colors.length];
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900">
      {children}
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
}: {
  title: string;
  value: string;
  sub?: string;
  icon?: string;
  highlight?: boolean;
  theme?: "default" | "blue" | "rose" | "amber" | "emerald" | "indigo";
}) {
  // Định nghĩa các bảng màu (icon background & text color)
  const themes = {
    default: {
      iconBg: "from-neutral-500/20 to-neutral-400/20",
      text: "text-neutral-900 dark:text-neutral-100",
    },
    blue: {
      iconBg: "from-blue-500/20 to-cyan-500/20",
      text: "text-blue-600 dark:text-blue-400",
    },
    rose: {
      iconBg: "from-rose-500/20 to-pink-500/20",
      text: "text-rose-600 dark:text-rose-400",
    },
    amber: {
      iconBg: "from-amber-500/20 to-orange-500/20",
      text: "text-amber-600 dark:text-amber-400",
    },
    emerald: {
      iconBg: "from-emerald-500/20 to-teal-500/20",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    indigo: {
      iconBg: "from-indigo-500/20 to-fuchsia-500/20",
      text: "text-indigo-600 dark:text-indigo-400",
    },
  };

  const currentTheme = themes[theme] || themes.default;

  // Render thẻ đặc biệt cho "Thực thu"
  if (highlight) {
    return (
      <div className="flex flex-col justify-between rounded-3xl border border-transparent bg-gradient-to-br from-emerald-500 to-teal-600 p-4 text-white shadow-md shadow-emerald-500/20 transition-transform hover:scale-[1.02]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-medium text-emerald-50">{title}</div>
            <div className="mt-2 text-xl font-extrabold tracking-tight tabular-nums xl:text-2xl">
              {value}
            </div>
            {sub ? (
              <div className="mt-1 text-xs text-emerald-100/80">{sub}</div>
            ) : null}
          </div>
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/20 ring-1 ring-white/20">
            <span className="text-lg">{icon || "✨"}</span>
          </div>
        </div>
      </div>
    );
  }

  // Render các thẻ thông thường
  return (
    <div className="flex flex-col justify-between rounded-3xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {title}
          </div>
          <div
            className={cn(
              "mt-2 text-xl font-extrabold tracking-tight tabular-nums xl:text-2xl",
              currentTheme.text,
            )}
          >
            {value}
          </div>
          {sub ? (
            <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              {sub}
            </div>
          ) : null}
        </div>
        <div
          className={cn(
            "grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ring-1 ring-black/5 dark:ring-white/10",
            currentTheme.iconBg,
          )}
        >
          <span className="text-lg">{icon || "✨"}</span>
        </div>
      </div>
    </div>
  );
}

function SelectPill({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ label: string; value: string }>;
  disabled?: boolean;
}) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "h-10 rounded-2xl border border-black/10 bg-white px-3 text-sm shadow-sm outline-none",
        "focus:ring-2 focus:ring-indigo-300 dark:border-white/10 dark:bg-neutral-900 dark:focus:ring-white/15",
        "disabled:opacity-60 disabled:cursor-not-allowed",
      )}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Segment({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="flex h-10 items-center rounded-2xl border border-black/10 bg-white p-1 shadow-sm dark:border-white/10 dark:bg-neutral-900">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "h-8 rounded-2xl px-3 text-sm font-semibold transition",
              active
                ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white"
                : "text-neutral-600 hover:bg-black/5 dark:text-neutral-300 dark:hover:bg-white/5",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Th({
  children,
  right,
}: {
  children: React.ReactNode;
  right?: boolean;
}) {
  return (
    <th
      className={cn(
        "px-3 py-2 text-left font-semibold",
        "border-b border-black/5 dark:border-white/10",
        right && "text-right",
      )}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  right,
  className,
}: {
  children: React.ReactNode;
  right?: boolean;
  className?: string;
}) {
  return (
    <td className={cn("px-3 py-2", right && "text-right", className)}>
      {children}
    </td>
  );
}
