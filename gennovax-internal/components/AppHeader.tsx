"use client";

import { useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  BarChart3,
  Stethoscope,
  Activity,
  Settings,
  UserCog,
  LogOut,
  User,
  Calculator,
  FileText,
  Database,
  ChevronDown,
  ChevronRight,
  FolderKanban,
  ShieldCheck,
  WalletCards,
  Sparkles,
  File,
} from "lucide-react";

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

function Avatar({ name }: { name: string }) {
  const initials = useMemo(() => {
    const parts = name.trim().split(/\s+/);
    const a = parts[0]?.[0] ?? "U";
    const b = parts[parts.length - 1]?.[0] ?? "";
    return (a + b).toUpperCase();
  }, [name]);

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-xs font-bold text-white shadow-sm ring-1 ring-white/30">
      {initials}
    </div>
  );
}

function roleLabel(role?: string) {
  if (role === "super_admin") return "Super Admin";
  if (role === "admin") return "Admin";
  if (role === "accounting_admin") return "Kế toán";
  if (role === "staff") return "Nhân viên";
  return role ?? "—";
}

type AdminLeafItem = {
  type: "item";
  label: string;
  desc: string;
  href: string;
  icon: any;
  allowedRoles: string[];
  badge?: string;
};

type AdminGroupItem = {
  type: "group";
  label: string;
  desc: string;
  icon: any;
  children: AdminLeafItem[];
};

type AdminMenuItem = AdminLeafItem | AdminGroupItem;

function isRouteActive(pathname: string | null, href: string) {
  if (!pathname || href === "#") return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, logout } = useAuth();

  const [openUser, setOpenUser] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);

  if (!token || !user) return null;

  const showAdminMenu = ["admin", "super_admin", "accounting_admin"].includes(
    user.role,
  );

  const adminMenuConfig: AdminMenuItem[] = [
    {
      type: "item",
      label: "Thống kê doanh thu",
      desc: "Tổng hợp doanh thu theo tháng",
      href: "/admin/dashboard",
      icon: BarChart3,
      allowedRoles: ["super_admin", "admin", "accounting_admin"],
      badge: "",
    },

    {
      type: "group",
      label: "Quản lý hệ thống",
      desc: "Quản lý dữ liệu nghiệp vụ và cấu hình",
      icon: FolderKanban,
      children: [
        {
          type: "item",
          label: "Nguồn thu mẫu",
          desc: "Thêm, sửa, xóa nguồn thu",
          href: "/admin/doctors",
          icon: Stethoscope,
          allowedRoles: ["super_admin", "admin"],
        },
        {
          type: "item",
          label: "Gói dịch vụ",
          desc: "Gói dịch vụ và bảng giá",
          href: "/admin/services",
          icon: Activity,
          allowedRoles: ["super_admin", "admin"],
        },
        {
          type: "item",
          label: "Giá trị lựa chọn",
          desc: "Danh mục lựa chọn meta",
          href: "/admin/options",
          icon: Settings,
          allowedRoles: ["super_admin", "admin"],
        },
      ],
    },

    {
      type: "group",
      label: "Quản lý dữ liệu",
      desc: "Tài khoản, dữ liệu và vận hành",
      icon: ShieldCheck,
      children: [
        {
          type: "item",
          label: "Quản lý nhân viên",
          desc: "Danh mục quản lý tài khoản",
          href: "/admin/users",
          icon: UserCog,
          allowedRoles: ["super_admin", "admin"],
        },
        {
          type: "item",
          label: "Quản lý file dữ liệu",
          desc: "Danh mục quản lý dữ liệu",
          href: "/admin/drive",
          icon: Database,
          allowedRoles: ["super_admin", "admin"],
        },
        {
          type: "item",
          label: "Chuyển đổi file",
          desc: "Danh mục quản lý dữ liệu",
          href: "/admin/convertfile",
          icon: File,
          allowedRoles: ["super_admin", "admin"],
        },
      ],
    },

    {
      type: "group",
      label: "Nghiệp vụ kế toán",
      desc: "Công cụ tài chính và báo cáo",
      icon: WalletCards,
      children: [
        {
          type: "item",
          label: "Quản lý công nợ",
          desc: "Theo dõi công nợ (Đang phát triển)",
          href: "#",
          icon: Calculator,
          allowedRoles: ["accounting_admin"],
          badge: "Soon",
        },
        {
          type: "item",
          label: "Báo cáo chi phí",
          desc: "Chi phí vận hành (Đang phát triển)",
          href: "#",
          icon: FileText,
          allowedRoles: ["accounting_admin"],
          badge: "Soon",
        },
      ],
    },
  ];

  const visibleAdminMenu = adminMenuConfig
    .map((item) => {
      if (item.type === "item") {
        return item.allowedRoles.includes(user.role) ? item : null;
      }

      const visibleChildren = item.children.filter((child) =>
        child.allowedRoles.includes(user.role),
      );

      if (visibleChildren.length === 0) return null;

      return {
        ...item,
        children: visibleChildren,
      };
    })
    .filter(Boolean) as AdminMenuItem[];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/50 bg-white/65 shadow-[0_10px_40px_rgba(99,102,241,0.08)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-60%] h-[220px] w-[220px] rounded-full bg-sky-300/25 blur-3xl" />
        <div className="absolute right-[-5%] top-[-30%] h-[240px] w-[240px] rounded-full bg-fuchsia-300/20 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-50/80 via-white/70 to-violet-50/80" />
      </div>

      <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
        <div className="relative flex h-20 items-center justify-between gap-4 lg:h-24">
          {/* Left */}
          <div
            className="group flex cursor-pointer items-center gap-3"
            onClick={() => router.push("/")}
          >
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-indigo-100 transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg">
              <img
                src="https://res.cloudinary.com/da6f4dmql/image/upload/v1773128350/genbio1-1_hf0tjp.png"
                alt="Logo"
                className="h-full w-full object-contain p-1.5"
              />
            </div>

            <div className="leading-tight">
              <div className="text-sm font-bold tracking-tight text-slate-900">
                Danh mục quản lý
              </div>
              <div className="mt-0.5 text-xs text-slate-500">Gennovax Lab</div>
            </div>

            <span className="hidden items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 shadow-sm md:inline-flex">
              <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500" />
              Online
            </span>
          </div>

          {/* Center */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 lg:flex">
            <div
              onClick={() => router.push("/")}
              className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-white/70 bg-white/80 px-5 py-3 shadow-lg shadow-indigo-100/40 ring-1 ring-black/5 backdrop-blur"
            >
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>

              <div className="leading-tight">
                <div className="text-base font-bold tracking-tight text-slate-900">
                  Danh sách ca
                  <span className="ml-2 hidden rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200 md:inline-flex">
                    Dashboard
                  </span>
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Theo dõi, lọc và xử lý các ca thu mẫu
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {showAdminMenu && (
              <div className="relative">
                <button
                  onClick={() => {
                    setOpenAdmin((v) => !v);
                    setOpenUser(false);
                    setHoveredGroup(null);
                  }}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-2xl border border-white/70 bg-white/85 px-3 py-2 shadow-md ring-1 ring-black/5 backdrop-blur transition",
                    "hover:-translate-y-0.5 hover:bg-white hover:shadow-lg",
                    openAdmin && "ring-4 ring-indigo-200/70",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-black text-white shadow-sm",
                      user.role === "accounting_admin"
                        ? "bg-gradient-to-br from-amber-400 to-orange-500"
                        : "bg-gradient-to-br from-indigo-500 to-purple-600",
                    )}
                  >
                    {user.role === "accounting_admin" ? "K" : "A"}
                  </span>

                  <div className="hidden text-left sm:block">
                    <div className="text-sm font-semibold text-slate-900">
                      {user.role === "accounting_admin"
                        ? "Nghiệp vụ"
                        : "Quản trị"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {user.role === "accounting_admin"
                        ? "Công cụ kế toán"
                        : "Admin tools"}
                    </div>
                  </div>

                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-slate-500 transition",
                      openAdmin && "rotate-180",
                    )}
                  />
                </button>

                {openAdmin && (
                  <>
                    <button
                      aria-label="close"
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => {
                        setOpenAdmin(false);
                        setHoveredGroup(null);
                      }}
                    />

                    <div className="absolute right-0 z-50 mt-3 w-[420px] overflow-visible rounded-[28px] border border-white/70 bg-white/92 shadow-2xl shadow-indigo-100/50 ring-1 ring-black/5 backdrop-blur-xl">
                      <div className="relative overflow-hidden px-5 py-4">
                        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-300/20 blur-2xl" />
                        <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-fuchsia-300/15 blur-2xl" />

                        <div className="relative flex items-start gap-3">
                          <div
                            className={cn(
                              "grid h-12 w-12 place-items-center rounded-2xl text-white shadow-sm",
                              user.role === "accounting_admin"
                                ? "bg-gradient-to-br from-amber-400 to-orange-500"
                                : "bg-gradient-to-br from-indigo-600 to-fuchsia-600",
                            )}
                          >
                            <span className="text-sm font-black">
                              {user.role === "accounting_admin" ? "K" : "A"}
                            </span>
                          </div>

                          <div className="min-w-0">
                            <div className="text-base font-bold tracking-tight text-slate-900">
                              {user.role === "accounting_admin"
                                ? "Khu vực nghiệp vụ kế toán"
                                : "Khu vực quản trị hệ thống"}
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                              Menu đã được gom nhóm để thao tác nhanh và trực quan hơn
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="h-px bg-black/5" />

                      <div className="p-2">
                        {visibleAdminMenu.map((item) => {
                          if (item.type === "item") {
                            const active = isRouteActive(pathname, item.href);

                            return (
                              <button
                                key={item.label}
                                onClick={() => {
                                  if (item.href === "#") {
                                    alert("Tính năng này đang được phát triển!");
                                    return;
                                  }
                                  setOpenAdmin(false);
                                  setHoveredGroup(null);
                                  router.push(item.href);
                                }}
                                className={cn(
                                  "group relative mb-1 w-full overflow-hidden rounded-2xl px-4 py-3 text-left transition",
                                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 focus-visible:ring-offset-2",
                                  active
                                    ? "bg-gradient-to-r from-indigo-50 to-violet-50 ring-1 ring-indigo-200"
                                    : "hover:bg-slate-50",
                                )}
                              >
                                <span
                                  className={cn(
                                    "absolute left-0 top-2 bottom-2 w-1 rounded-full transition",
                                    active
                                      ? "bg-gradient-to-b from-indigo-600 to-fuchsia-600"
                                      : "bg-transparent group-hover:bg-slate-200",
                                  )}
                                />

                                <div className="flex items-start gap-3">
                                  <div
                                    className={cn(
                                      "grid h-11 w-11 shrink-0 place-items-center rounded-2xl ring-1 transition-all",
                                      active
                                        ? "bg-indigo-100 text-indigo-700 ring-indigo-200 shadow-sm"
                                        : "bg-white text-slate-500 ring-slate-200 group-hover:-translate-y-0.5 group-hover:text-indigo-600 group-hover:shadow-md",
                                    )}
                                  >
                                    <item.icon
                                      className="h-5 w-5"
                                      strokeWidth={active ? 2.5 : 2}
                                    />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="truncate text-sm font-semibold text-slate-900">
                                        {item.label}
                                      </div>

                                      {item.badge && (
                                        <span
                                          className={cn(
                                            "rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1",
                                            item.badge === "Soon"
                                              ? "bg-amber-50 text-amber-700 ring-amber-200"
                                              : "bg-indigo-50 text-indigo-700 ring-indigo-200",
                                          )}
                                        >
                                          {item.badge}
                                        </span>
                                      )}
                                    </div>

                                    <div className="mt-1 line-clamp-2 text-xs text-slate-500">
                                      {item.desc}
                                    </div>
                                  </div>

                                  <ChevronRight
                                    className={cn(
                                      "mt-1 h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-600",
                                      active && "text-indigo-600",
                                    )}
                                  />
                                </div>
                              </button>
                            );
                          }

                          const groupActive = item.children.some((child) =>
                            isRouteActive(pathname, child.href),
                          );
                          const isOpen = hoveredGroup === item.label;

                          return (
                            <div
  key={item.label}
  className="relative mb-1"
  onMouseEnter={() => setHoveredGroup(item.label)}
  onMouseLeave={() => setHoveredGroup(null)}
>
                              <button
                                type="button"
                                className={cn(
                                  "group relative w-full overflow-hidden rounded-2xl px-4 py-3 text-left transition",
                                  "focus:outline-none",
                                  groupActive
                                    ? "bg-gradient-to-r from-indigo-50 to-violet-50 ring-1 ring-indigo-200"
                                    : "hover:bg-slate-50",
                                )}
                              >
                                <span
                                  className={cn(
                                    "absolute left-0 top-2 bottom-2 w-1 rounded-full transition",
                                    groupActive
                                      ? "bg-gradient-to-b from-indigo-600 to-fuchsia-600"
                                      : "bg-transparent group-hover:bg-slate-200",
                                  )}
                                />

                                <div className="flex items-start gap-3">
                                  <div
                                    className={cn(
                                      "grid h-11 w-11 shrink-0 place-items-center rounded-2xl ring-1 transition-all",
                                      groupActive
                                        ? "bg-indigo-100 text-indigo-700 ring-indigo-200 shadow-sm"
                                        : "bg-white text-slate-500 ring-slate-200 group-hover:-translate-y-0.5 group-hover:text-indigo-600 group-hover:shadow-md",
                                    )}
                                  >
                                    <item.icon className="h-5 w-5" />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="truncate text-sm font-semibold text-slate-900">
                                        {item.label}
                                      </div>

                                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200">
                                        {item.children.length} mục
                                      </span>
                                    </div>

                                    <div className="mt-1 line-clamp-2 text-xs text-slate-500">
                                      {item.desc}
                                    </div>
                                  </div>

                                  <ChevronRight
                                    className={cn(
                                      "mt-1 h-4 w-4 text-slate-400 transition",
                                      isOpen && "translate-x-0.5 text-indigo-600",
                                    )}
                                  />
                                </div>
                              </button>

                              <>
  {/* bridge chống mất hover khi rê chuột từ card mẹ sang card con */}
  <div
    className={cn(
      "pointer-events-none absolute right-full top-0 z-[55] h-full w-6",
      isOpen ? "block" : "hidden",
    )}
  />

  <div
    className={cn(
      "absolute right-full top-0 z-[60] mr-3 w-[330px] rounded-3xl border border-white/80 bg-white/95 p-2 shadow-2xl shadow-indigo-100/50 ring-1 ring-black/5 backdrop-blur-xl transition-all duration-150",
      isOpen
        ? "visible translate-x-0 opacity-100"
        : "invisible translate-x-1 opacity-0",
    )}
  >
    <div className="px-3 pb-2 pt-1">
      <div className="text-sm font-bold text-slate-900">
        {item.label}
      </div>
      <div className="mt-1 text-xs text-slate-500">
        {item.desc}
      </div>
    </div>

    {item.children.map((child) => {
      const active = isRouteActive(pathname, child.href);

      return (
        <button
          key={child.label}
          onClick={() => {
            if (child.href === "#") {
              alert("Tính năng này đang được phát triển!");
              return;
            }
            setOpenAdmin(false);
            setHoveredGroup(null);
            router.push(child.href);
          }}
          className={cn(
            "group mb-1 w-full rounded-2xl px-3 py-3 text-left transition",
            active
              ? "bg-gradient-to-r from-indigo-50 to-violet-50 ring-1 ring-indigo-200"
              : "hover:bg-slate-50",
          )}
        >
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "grid h-10 w-10 shrink-0 place-items-center rounded-2xl ring-1 transition-all",
                active
                  ? "bg-indigo-100 text-indigo-700 ring-indigo-200"
                  : "bg-white text-slate-500 ring-slate-200 group-hover:text-indigo-600 group-hover:shadow-sm",
              )}
            >
              <child.icon className="h-4.5 w-4.5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div
                  className={cn(
                    "truncate text-sm font-semibold",
                    child.href === "#"
                      ? "text-slate-500"
                      : "text-slate-900",
                  )}
                >
                  {child.label}
                </div>

                {child.badge && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1",
                      child.badge === "Soon"
                        ? "bg-amber-50 text-amber-700 ring-amber-200"
                        : "bg-indigo-50 text-indigo-700 ring-indigo-200",
                    )}
                  >
                    {child.badge}
                  </span>
                )}
              </div>

              <div className="mt-1 line-clamp-2 text-xs text-slate-500">
                {child.desc}
              </div>
            </div>
          </div>
        </button>
      );
    })}
  </div>
</>
                            </div>
                          );
                        })}
                      </div>

                      <div className="px-4 pb-4">
                        <div className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-sky-50 px-4 py-3">
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-900">
                              Mẹo sử dụng
                            </div>
                            <div className="text-[11px] text-slate-600">
                              Di chuột vào nhóm để mở nhanh menu con, các mục “Soon” sẽ cập nhật sau.
                            </div>
                          </div>
                          <span className="ml-3 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white text-emerald-700 ring-1 ring-emerald-100">
                            ✓
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setOpenUser((v) => !v);
                  setOpenAdmin(false);
                  setHoveredGroup(null);
                }}
                className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/70 bg-white/85 px-3 py-2 shadow-md ring-1 ring-black/5 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
              >
                <Avatar name={user.name || user.email} />
                <div className="hidden text-left sm:block">
                  <div className="text-sm font-semibold text-slate-900">
                    {user.name || user.email}
                  </div>
                  <div className="text-xs text-slate-500">
                    {roleLabel(user.role)}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </button>

              {openUser && (
                <>
                  <button
                    aria-label="close"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setOpenUser(false)}
                  />

                  <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-3xl border border-white/70 bg-white/92 shadow-2xl ring-1 ring-black/5 backdrop-blur-xl">
                    <div className="px-4 py-4">
                      <div className="text-sm font-semibold text-slate-900">
                        {user.name || "Tài khoản"}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {user.email} • {roleLabel(user.role)}
                      </div>
                    </div>

                    <div className="h-px bg-black/5" />

                    <button
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                      onClick={() => {
                        setOpenUser(false);
                        router.push("/profile");
                      }}
                    >
                      <User className="h-4 w-4 text-slate-500" />
                      Hồ sơ người dùng
                    </button>

                    <button className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900">
                      <Settings className="h-4 w-4 text-slate-500" />
                      Cài đặt
                    </button>

                    <div className="my-1 h-px bg-black/5" />

                    <button
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-rose-600 transition-colors hover:bg-rose-50"
                      onClick={() => {
                        setOpenUser(false);
                        logout();
                        router.replace("/login");
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}