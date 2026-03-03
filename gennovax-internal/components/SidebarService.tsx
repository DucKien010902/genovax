"use client";

import { useMemo, useState } from "react";
import type { ServiceType } from "@/lib/types";

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

/* --- Component Icon được làm mới với hiệu ứng Glass --- */
function Icon({ t, active }: { t: ServiceType; active: boolean }) {
  const styles: Record<ServiceType, string> = {
    NIPT: "from-pink-500 to-rose-600 shadow-rose-500/40",
    ADN: "from-blue-400 to-indigo-600 shadow-blue-500/40",
    HPV: "from-emerald-400 to-teal-600 shadow-emerald-500/40",
  };

  return (
    <div
      className={cn(
        "grid h-10 w-10 place-items-center rounded-2xl transition-all duration-500",
        "relative z-10 shadow-lg",
        active ? cn("bg-gradient-to-br scale-110", styles[t]) : "bg-white/10 backdrop-blur-md ring-1 ring-white/20"
      )}
    >
      <span className={cn(
        "text-[10px] font-black tracking-tighter",
        active ? "text-white" : "text-white/80"
      )}>
        {t}
      </span>
      {active && (
        <span className={cn("absolute inset-0 blur-lg -z-10 opacity-60 rounded-full", styles[t].split(' ')[0])} />
      )}
    </div>
  );
}

export default function SidebarService({
  active,
  onChange,
}: {
  active: ServiceType;
  onChange: (t: ServiceType) => void;
}) {
  const [collapsed, setCollapsed] = useState(true);

  const items = useMemo(() => [
    { key: "NIPT", label: "NIPT", badge: "Sàng lọc", desc: "Trước sinh", glow: "group-hover:shadow-rose-500/20" },
    { key: "ADN", label: "ADN", badge: "Pháp lý", desc: "Giám định", glow: "group-hover:shadow-blue-500/20" },
    { key: "HPV", label: "HPV", badge: "Tế bào", desc: "Xét nghiệm", glow: "group-hover:shadow-emerald-500/20" },
  ] as const, []);

  return (
    <aside
      className={cn(
        "shrink-0 transition-all duration-500 ease-in-out relative overflow-hidden",
        "bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white",
        "sticky top-0 h-screen",
        collapsed ? "w-[80px]" : "w-[240px]"
      )}
    >
      {/* Background Decor - Tạo các đốm sáng mờ hiện đại */}
      <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-blue-600/10 blur-[100px]" />
      <div className="absolute bottom-20 -right-20 h-64 w-64 rounded-full bg-pink-600/10 blur-[100px]" />

      {/* Header Section */}
      <div className="px-4 pt-6 relative z-10">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-px">
                <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950 text-[11px] font-black">
                  GX
                </div>
              </div>
              <div className="min-w-0">
                <div className="text-sm font-black tracking-widest text-white uppercase">GENNOVAX</div>
                <div className="text-[10px] text-white/40 font-medium">Healthcare Systems</div>
              </div>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 ring-1 ring-white/10 transition-all",
              collapsed && "mx-auto"
            )}
          >
            <span className="text-xs opacity-60">{collapsed ? "→" : "←"}</span>
          </button>
        </div>
        <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Navigation Items */}
      <nav className="px-3 py-6 relative z-10">
        <div className="space-y-3">
          {items.map((it) => {
            const is = it.key === active;
            return (
              <button
                key={it.key}
                onClick={() => onChange(it.key)}
                className={cn(
                  "group relative w-full rounded-[24px] p-2 transition-all duration-300",
                  "flex items-center",
                  collapsed ? "justify-center" : "gap-4",
                  is 
                    ? "bg-white/10 shadow-2xl ring-1 ring-white/20 backdrop-blur-xl" 
                    : "hover:bg-white/5"
                )}
              >
                {/* Active Indicator Glow */}
                {is && (
                  <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-r from-blue-500/20 to-pink-500/20 blur-md" />
                )}

                <Icon t={it.key} active={is} />

                {!collapsed && (
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "text-[13px] font-bold tracking-tight transition-colors",
                        is ? "text-white" : "text-white/60 group-hover:text-white"
                      )}>
                        {it.label}
                      </span>
                      {is && (
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-black uppercase text-white/80 ring-1 ring-white/10">
                          {it.badge}
                        </span>
                      )}
                    </div>
                    <div className={cn(
                      "text-[10px] transition-opacity",
                      is ? "text-white/50" : "text-white/30"
                    )}>
                      {it.desc}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer / Tip Section */}
      {!collapsed && (
        <div className="mt-auto px-4 pb-8 relative z-10">
          <div className="rounded-[24px] bg-gradient-to-br from-white/5 to-white/[0.02] p-4 ring-1 ring-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-400">✦</span>
              <span className="text-[11px] font-black text-white/80 uppercase tracking-tighter">Pro Tip</span>
            </div>
            <p className="text-[10px] leading-relaxed text-white/40">
              Chuyển đổi dịch vụ để cập nhật quy trình xét nghiệm riêng biệt.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}