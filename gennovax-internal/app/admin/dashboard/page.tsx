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

type ServiceType = "NIPT" | "ADN" | "CELL";
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
    totalListPrice: 0,
    paidRate: 0,
  };

  const bySource = data?.bySource || [];
  const monthly = data?.monthly || [];
  const topSourcesFromApi = data?.topSources || [];

  const activeSources = useMemo(() => sourceKeys.slice(0, 8), [sourceKeys]);

  const monthlyBarsData = useMemo(() => {
    // reverse để timeline từ cũ->mới (nếu API trả mới->cũ)
    const arr = (monthly || []).map((x: any) => ({
      ...x,
      ym: String(x.ym),
      totalRevenue: Number(x.totalRevenue || 0),
    }));
    // nếu bạn muốn đảm bảo sort tăng dần theo ym:
    arr.sort((a: any, b: any) => String(a.ym).localeCompare(String(b.ym)));
    return arr;
  }, [monthly]);

  const months = useMemo<string[]>(
    () => (monthlyBarsData as Array<{ ym: string }>).map((x) => String(x.ym)),
    [monthlyBarsData],
  );

  useEffect(() => {
    if (!pickedMonth && months.length)
      setPickedMonth(months[months.length - 1]);
  }, [months, pickedMonth]);

  // init brush window = last N months
  useEffect(() => {
    if (!monthlyBarsData.length) return;
    const n = monthlyBarsData.length;
    const win = clamp(monthsWindow, 3, 60);
    const start = Math.max(0, n - win);
    const end = n - 1;
    setBrush({ startIndex: start, endIndex: end });
  }, [monthlyBarsData.length]); // only when data changes

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
    const step = Math.max(1, Math.floor(width * 0.35)); // kéo theo 35% cửa sổ
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

  const topSourcesComputed = useMemo(() => {
    if (!monthlyBarsData?.length || !sourceKeys?.length) return [];

    if (scopeMode === "total") {
      const map = new Map<string, number>();
      for (const m of monthlyBarsData) {
        for (const k of sourceKeys) {
          const v = Number(m?.[k] || 0);
          map.set(k, (map.get(k) || 0) + v);
        }
      }
      const arr = Array.from(map.entries()).map(([source, revenue]) => ({
        source,
        revenue,
      }));
      arr.sort((a, b) => b.revenue - a.revenue);
      return arr.slice(0, clamp(top, 1, 50));
    }

    const row = monthlyBarsData.find(
      (x: any) => String(x.ym) === String(pickedMonth),
    );
    if (!row) return [];
    const arr = sourceKeys.map((k) => ({
      source: k,
      revenue: Number(row?.[k] || 0),
    }));
    arr.sort((a, b) => b.revenue - a.revenue);
    return arr.slice(0, clamp(top, 1, 50));
  }, [monthlyBarsData, sourceKeys, scopeMode, pickedMonth, top]);

  const topSources = topSourcesComputed.length
    ? topSourcesComputed
    : topSourcesFromApi;

  const empty =
    !monthlyBarsData.length && !bySource.length && !topSources.length;

  return (
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
                Doanh thu • Nguồn • Theo tháng
              </div>
            </div>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            <SelectPill
              value={serviceType}
              onChange={(v) => setServiceType(v as any)}
              options={[
                { label: "ALL services", value: "" },
                { label: "NIPT", value: "NIPT" },
                { label: "ADN", value: "ADN" },
                { label: "CELL", value: "CELL" },
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
              {loading ? "Loading..." : "Apply"}
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* KPI */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Tổng doanh thu (thực thu)"
            value={money(kpis.totalRevenue)}
            sub="VNĐ"
            icon="💰"
          />
          <KpiCard
            title="Tổng số ca"
            value={money(kpis.totalCases)}
            sub="cases"
            icon="🧾"
          />
          <KpiCard
            title="Số ca đã thu"
            value={money(kpis.paidCases)}
            sub={`Paid rate: ${pct(kpis.paidRate)}`}
            icon="✅"
          />
          <KpiCard
            title="Tổng giá niêm yết"
            value={money(kpis.totalListPrice)}
            sub="(sum price)"
            icon="🏷️"
          />
        </div>

        {/* TOP + RANKING (trên) */}
        <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-sm font-semibold">
                  Top nguồn theo doanh thu
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  Lọc theo <b>Tổng</b> hoặc theo <b>tháng</b>
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

            <div className="mt-3">
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                {scopeMode === "total"
                  ? "Đang xem: cộng dồn tất cả tháng"
                  : `Đang xem: tháng ${pickedMonth || "—"}`}
              </div>

              <div className="mt-3 h-[320px]">
                <ResponsiveContainer>
                  <BarChart data={topSources}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="source" hide />
                    <YAxis tickFormatter={(v) => money(v)} />
                    <Tooltip
                      formatter={(v: any) => money(Number(v || 0))}
                      labelFormatter={(l) => `Nguồn: ${l}`}
                    />
                    <Legend />
                    <Bar
                      dataKey="revenue"
                      name="Revenue"
                      radius={[10, 10, 0, 0]}
                      fill={COLOR_PRIMARY}
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
                  Bảng đầy đủ (không giới hạn 8 nguồn)
                </div>
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                {loading ? "Đang tải..." : `${bySource.length} nguồn`}
              </div>
            </div>

            <div className="mt-3 max-h-[360px] overflow-auto rounded-2xl border border-black/5 dark:border-white/10">
              <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 bg-white/95 backdrop-blur dark:bg-neutral-900/90">
                  <tr className="text-xs text-neutral-500 dark:text-neutral-400">
                    <Th>#</Th>
                    <Th>Nguồn</Th>
                    <Th right>Doanh thu</Th>
                    <Th right>Ca</Th>
                    <Th right>Đã thu</Th>
                    <Th right>Tỉ lệ</Th>
                  </tr>
                </thead>
                <tbody>
                  {bySource.map((x: any, idx: number) => (
                    <tr
                      key={x.source}
                      className="border-t border-black/5 dark:border-white/10"
                    >
                      <Td className="w-10 text-neutral-500 dark:text-neutral-400">
                        {idx + 1}
                      </Td>
                      <Td className="font-medium">{x.source}</Td>
                      <Td right className="font-semibold tabular-nums">
                        {money(x.revenue)}
                      </Td>
                      <Td right className="tabular-nums">
                        {x.totalCases}
                      </Td>
                      <Td right className="tabular-nums">
                        {x.paidCases}
                      </Td>
                      <Td right className="tabular-nums">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2 py-1 text-xs font-semibold",
                            x.paidRate >= 0.7
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                              : x.paidRate >= 0.4
                                ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                                : "bg-rose-500/10 text-rose-700 dark:text-rose-300",
                          )}
                        >
                          {pct(x.paidRate)}
                        </span>
                      </Td>
                    </tr>
                  ))}

                  {!bySource.length ? (
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
                  Doanh thu theo tháng
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  Zoom theo <b>số tháng</b> hiển thị (không phải kéo pixel) •
                  Kéo thanh dưới để chọn khoảng tháng
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
                <button
                  type="button"
                  className="h-9 rounded-2xl px-3 text-xs font-semibold ring-1 ring-black/10 hover:bg-black/5 dark:ring-white/10 dark:hover:bg-white/5"
                  onClick={() => zoomToLastN(24)}
                  disabled={!monthlyBarsData.length}
                >
                  24m
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
                      dataKey="totalRevenue"
                      name="Total Revenue"
                      fill={COLOR_PRIMARY}
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
                  So sánh theo nguồn (Line) • tối đa 8 nguồn
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
                      dataKey="totalRevenue"
                      stroke={COLOR_PRIMARY}
                      strokeWidth={2}
                      dot={false}
                      name="Total"
                    />
                    {activeSources.map((k, i) => (
                      <Line
                        key={k}
                        type="monotone"
                        dataKey={k}
                        strokeWidth={1.5}
                        dot={false}
                        // dùng màu tự động? Recharts không auto -> mình xoay palette nhẹ (không đen)
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
  );
}

/* ================= UI atoms ================= */

function palette(i: number) {
  const colors = [
    "#22c55e",
    "#06b6d4",
    "#f59e0b",
    "#a78bfa",
    "#fb7185",
    "#34d399",
    "#60a5fa",
    "#f472b6",
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
}: {
  title: string;
  value: string;
  sub?: string;
  icon?: string;
}) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {title}
          </div>
          <div className="mt-2 text-2xl font-extrabold tracking-tight tabular-nums">
            {value}
          </div>
          {sub ? (
            <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              {sub}
            </div>
          ) : null}
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 ring-1 ring-black/5 dark:ring-white/10">
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
