"use client";

import { useMemo, useState } from "react";
import type { ServiceType } from "@/lib/types";

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

function Icon({ t, active }: { t: ServiceType; active: boolean }) {
  const base =
    "grid h-9 w-9 place-items-center rounded-2xl ring-1 transition duration-200";
  const styles: Record<ServiceType, { on: string; off: string; glyph: string }> =
    {
      NIPT: {
        glyph: "NIPT",
        on: "bg-rose-600 text-white ring-rose-700 shadow-sm",
        off: "bg-rose-50 text-rose-700 ring-rose-200",
      },
      ADN: {
        glyph: "ADN",
        on: "bg-blue-600 text-white ring-blue-700 shadow-sm",
        off: "bg-blue-50 text-blue-700 ring-blue-200",
      },
      HPV: {
        glyph: "HPV",
        on: "bg-emerald-600 text-white ring-emerald-700 shadow-sm",
        off: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      },
    };

  const s = styles[t];
  return (
    <span className={cn(base, active ? s.on : s.off)} aria-hidden="true">
      <span className="text-[11px] font-extrabold tracking-tight">
        {s.glyph}
      </span>
    </span>
  );
}

export default function SidebarService({
  active,
  onChange,
}: {
  active: ServiceType;
  onChange: (t: ServiceType) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const items = useMemo(
    () =>
      [
        { key: "NIPT", label: "NIPT", badge: "Sàng lọc", desc: "Trước sinh" },
        { key: "ADN", label: "ADN", badge: "Pháp lý", desc: "Giám định" },
        { key: "HPV", label: "HPV", badge: "Tế bào", desc: "Xét nghiệm" },
      ] as const,
    [],
  );

  const tone: Record<
    ServiceType,
    { hover: string; soft: string; bar: string; focus: string }
  > = {
    NIPT: {
      hover: "hover:bg-rose-50/60",
      soft: "bg-rose-50 text-rose-700 ring-rose-200",
      bar: "bg-rose-600",
      focus: "focus-visible:ring-rose-300",
    },
    ADN: {
      hover: "hover:bg-blue-50/60",
      soft: "bg-blue-50 text-blue-700 ring-blue-200",
      bar: "bg-blue-600",
      focus: "focus-visible:ring-blue-300",
    },
    HPV: {
      hover: "hover:bg-emerald-50/60",
      soft: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      bar: "bg-emerald-600",
      focus: "focus-visible:ring-emerald-300",
    },
  };

  const widthCls = collapsed ? "w-[84px]" : "w-[260px]";

  return (
    <aside
      className={cn(
        "shrink-0 border-r border-black/5 bg-white",
        "sticky top-0 h-screen",
        widthCls,
      )}
    >
      {/* Top */}
      <div className="px-3 pt-3">
        <div className="flex items-center gap-2">
          {/* Mini brand dot */}
          <div className={`${collapsed?'hidden':'flex'} grid h-9 w-9 place-items-center rounded-2xl bg-purple-900 text-white text-[11px] font-extrabold`}>
            GX
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <div className="text-sm font-bold tracking-tight text-neutral-900">
                Dịch vụ
              </div>
              <div className="text-[11px] text-neutral-500">
                Chọn để lọc danh sách
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className={cn(
              "ml-auto inline-flex h-9 w-9 items-center justify-center rounded-2xl",
              "ring-1 ring-black/10 bg-white hover:bg-neutral-50",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300",
            )}
            title={collapsed ? "Mở rộng" : "Thu gọn"}
          >
            <span className="text-sm" aria-hidden="true">
              {collapsed ? "»" : "«"}
            </span>
          </button>
        </div>

        <div className="mt-3 h-px w-full bg-black/5" />
      </div>

      {/* Items */}
      <div className="px-2 py-3">
        <div className="space-y-1.5">
          {items.map((it) => {
            const is = it.key === active;

            return (
              <button
                key={it.key}
                onClick={() => onChange(it.key)}
                title={`${it.label} — ${it.desc}`}
                className={cn(
                  "relative w-full rounded-2xl p-2 text-left transition",
                  "ring-1 shadow-sm",
                  "focus:outline-none focus-visible:ring-2",
                  tone[it.key].focus,
                  collapsed
                    ? "flex items-center justify-center"
                    : "flex items-center gap-2.5",
                  is
                    ? "bg-blue-900 text-white ring-black/10"
                    : cn("bg-white ring-black/5", tone[it.key].hover),
                )}
              >
                {/* Active bar */}
                {is && (
                  <span
                    className={cn(
                      "absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full",
                      tone[it.key].bar,
                    )}
                    aria-hidden="true"
                  />
                )}

                <Icon t={it.key} active={is} />

                {!collapsed && (
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[13px] font-extrabold tracking-tight">
                        {it.label}
                      </div>

                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[10px] font-bold ring-1",
                          is
                            ? "bg-white/10 text-white ring-white/10"
                            : tone[it.key].soft,
                        )}
                      >
                        {it.badge}
                      </span>
                    </div>

                    <div
                      className={cn(
                        "mt-0.5 text-[11px]",
                        is ? "text-white/70" : "text-neutral-500",
                      )}
                    >
                      {it.desc}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="mt-auto px-3 pb-3">
          <div className="rounded-2xl bg-neutral-50 p-3 ring-1 ring-black/5">
            <div className="text-[11px] font-bold text-neutral-700">Mẹo</div>
            <div className="mt-1 text-[11px] text-neutral-600">
              Đổi dịch vụ để lọc danh sách và tạo ca đúng loại.
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
