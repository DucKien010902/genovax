"use client";

import { useMemo, useState } from "react";
import type { ServiceType } from "@/lib/types";

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

function Icon({ t, active }: { t: ServiceType; active: boolean }) {
  const base = "grid h-9 w-9 place-items-center rounded-2xl ring-1 transition";
  const styles: Record<
    ServiceType,
    { on: string; off: string; glyph: string }
  > = {
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
    CELL: {
      glyph: "CELL",
      on: "bg-emerald-600 text-white ring-emerald-700 shadow-sm",
      off: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },
  };

  const s = styles[t];
  return (
    <span className={cn(base, active ? s.on : s.off)} aria-hidden="true">
      <span className="text-sm">{s.glyph}</span>
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
        {
          key: "NIPT",
          label: "NIPT",
          badge: "Sàng lọc",
          desc: "Sàng lọc trước sinh",
        },
        {
          key: "ADN",
          label: "ADN",
          badge: "Pháp lý",
          desc: "Giám định & pháp lý",
        },
        {
          key: "CELL",
          label: "CELL",
          badge: "Tế bào",
          desc: "Xét nghiệm tế bào",
        },
      ] as const,
    [],
  );

  const widthCls = collapsed ? "w-[92px]" : "w-[296px]";

  return (
    <aside
      className={cn(
        "shrink-0 border-r border-black/5 bg-gradient-to-b from-white via-white to-neutral-50/70",
        "backdrop-blur supports-[backdrop-filter]:bg-white/70",
        "sticky top-0 h-screen ",
        widthCls,
      )}
    >
      {/* Header */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <div className={cn("min-w-0", collapsed && "hidden")}>
            <div className="text-sm font-extrabold tracking-tight text-neutral-900">
              Danh mục dịch vụ
            </div>
            <div className="mt-0.5 text-xs text-neutral-500">
              Lọc & tạo ca theo loại
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className={cn(
              "ml-auto inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold",
              "ring-1 ring-black/10 bg-white hover:bg-neutral-50 shadow-sm",
            )}
            title={collapsed ? "Phóng to sidebar" : "Thu nhỏ sidebar"}
          >
            <span className="text-sm" aria-hidden="true">
              {collapsed ? "»" : "«"}
            </span>
            <span className={cn(collapsed && "hidden")}>
              {collapsed ? "Mở" : "Thu"}
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </div>

      {/* Items */}
      <div className="px-3 py-4">
        <div className="space-y-2">
          {items.map((it) => {
            const is = it.key === active;

            const tone: Record<
              ServiceType,
              { ring: string; hover: string; soft: string }
            > = {
              NIPT: {
                ring: "ring-rose-200",
                hover: "hover:bg-rose-50/60",
                soft: "bg-rose-50 text-rose-700 ring-rose-200",
              },
              ADN: {
                ring: "ring-blue-200",
                hover: "hover:bg-blue-50/60",
                soft: "bg-blue-50 text-blue-700 ring-blue-200",
              },
              CELL: {
                ring: "ring-emerald-200",
                hover: "hover:bg-emerald-50/60",
                soft: "bg-emerald-50 text-emerald-700 ring-emerald-200",
              },
            };

            return (
              <button
                key={it.key}
                onClick={() => onChange(it.key)}
                title={`${it.label} — ${it.desc}`}
                className={cn(
                  "group w-full rounded-3xl px-3 py-3 text-left transition",
                  "ring-1 shadow-sm",
                  collapsed
                    ? "flex items-center justify-center"
                    : "flex items-center gap-3",
                  is
                    ? cn("bg-neutral-900 text-white ring-neutral-900")
                    : cn("bg-white ring-black/5", tone[it.key].hover),
                )}
              >
                <Icon t={it.key} active={is} />

                {!collapsed && (
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-extrabold tracking-tight">
                        {it.label}
                      </div>

                      <span
                        className={cn(
                          "rounded-full px-2 py-1 text-[11px] font-semibold ring-1",
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
                        "mt-1 text-xs",
                        is ? "text-white/80" : "text-neutral-500",
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

      {/* Footer hint */}
      <div className={cn("mt-auto px-4 pb-4", collapsed && "hidden")}>
        <div className="rounded-3xl bg-gradient-to-r from-blue-50 to-rose-50 p-3 ring-1 ring-black/5">
          <div className="text-xs font-semibold text-neutral-700">Mẹo</div>
          <div className="mt-1 text-xs text-neutral-600">
            Đổi dịch vụ ở đây để lọc danh sách và tạo ca theo đúng loại.
          </div>
        </div>
      </div>
    </aside>
  );
}
