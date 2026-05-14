"use client";

import { useMemo } from "react";
import type { ServiceType } from "@/lib/types";

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

type ServiceNavItem = {
  key: ServiceType;
  label: string;
  desc: string;
  mark: string;
  accent: string;
  activeBg: string;
};

export default function SidebarService({
  active,
  onChange,
}: {
  active: ServiceType;
  onChange: (t: ServiceType) => void;
}) {
  const items = useMemo<ServiceNavItem[]>(
    () => [
      {
        key: "NIPT",
        label: "NIPT",
        desc: "Sàng lọc trước sinh",
        mark: "GX",
        accent: "bg-rose-500",
        activeBg: "bg-rose-400/16 text-rose-50 ring-rose-300/20",
      },
      {
        key: "ADN",
        label: "ADN",
        desc: "Huyết thống, pháp lý",
        mark: "GX",
        accent: "bg-sky-500",
        activeBg: "bg-sky-400/16 text-sky-50 ring-sky-300/20",
      },
      {
        key: "Sàng Lọc UTCTC",
        label: "Sàng Lọc UTCTC",
        desc: "Tầm soát cổ tử cung",
        mark: "GX",
        accent: "bg-emerald-500",
        activeBg: "bg-emerald-400/16 text-emerald-50 ring-emerald-300/20",
      },
      {
        key: "Sinh Hóa",
        label: "Sinh Hóa",
        desc: "Xét nghiệm sinh hóa",
        mark: "GX",
        accent: "bg-amber-500",
        activeBg: "bg-amber-400/16 text-amber-50 ring-amber-300/20",
      },
      {
        key: "XN Khác",
        label: "XN Khác",
        desc: "Các xét nghiệm khác",
        mark: "GX",
        accent: "bg-violet-500",
        activeBg: "bg-violet-400/16 text-violet-50 ring-violet-300/20",
      },
    ],
    [],
  );

  return (
    <aside className="sticky top-0 flex h-full w-[272px] shrink-0 flex-col overflow-hidden border-r border-slate-950/40 bg-[#182c37] text-white shadow-[14px_0_42px_-34px_rgba(15,23,42,0.72)]">
      <div className="mx-4 mt-4 rounded-3xl bg-white/[0.06] px-5 py-4 shadow-sm ring-1 ring-white/10">
        <div className="text-[14px] font-extrabold uppercase tracking-[0.16em] text-white">
          GENNOVAX
        </div>
        <div className="mt-1 text-[12px] font-semibold text-slate-300">
          Nhóm dịch vụ
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {items.map((item) => {
          const isActive = item.key === active;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              className={cn(
                "group relative mb-2 flex w-full items-center gap-3 rounded-3xl px-4 py-3.5 text-left transition",
                isActive
                  ? cn(item.activeBg, "shadow-sm ring-1")
                  : "text-slate-300 hover:bg-white/[0.07] hover:text-white",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={cn(
                  "absolute left-0 top-2.5 h-[calc(100%-20px)] w-1 rounded-r-full transition-opacity",
                  item.accent,
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60",
                )}
              />

              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-[11px] font-black tracking-[0.08em] ring-1 transition",
                  isActive
                    ? "bg-white text-[#182c37] ring-white"
                    : "bg-white/[0.08] text-slate-300 ring-white/10 group-hover:bg-white/[0.12] group-hover:text-white",
                )}
              >
                {item.mark}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px] font-extrabold leading-5">
                  {item.label}
                </span>
                <span
                  className={cn(
                    "mt-0.5 block truncate text-[12px] font-medium leading-4",
                    isActive ? "text-current/75" : "text-slate-400",
                  )}
                >
                  {item.desc}
                </span>
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
