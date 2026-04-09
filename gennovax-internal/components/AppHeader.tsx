"use client";

import { useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import {
  Activity,
  BarChart3,
  Calculator,
  ChevronDown,
  Database,
  File,
  FileText,
  FolderKanban,
  LogOut,
  Settings,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  User,
  UserCog,
  WalletCards,
  type LucideIcon,
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
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 via-sky-600 to-cyan-500 text-xs font-bold text-white shadow-sm ring-1 ring-white/30">
      {initials}
    </div>
  );
}

function roleLabel(role?: string) {
  if (role === "super_admin") return "Super Admin";
  if (role === "admin") return "Admin";
  if (role === "accounting_admin") return "Kế toán";
  if (role === "sales") return "NVKD";
  if (role === "staff") return "Nhân viên";
  return role ?? "—";
}

type AdminLeafItem = {
  type: "item";
  label: string;
  href: string;
  icon: LucideIcon;
  allowedRoles: string[];
  badge?: string;
};

type AdminGroupItem = {
  type: "group";
  label: string;
  icon: LucideIcon;
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

  if (!token || !user) return null;

  const isSales = user.role === "sales";
  const homeRoute = isSales ? "/admin/doctors" : "/";
  const showAdminMenu = ["admin", "super_admin", "accounting_admin", "sales"].includes(
    user.role,
  );

  const adminMenuConfig: AdminMenuItem[] = [
    {
      type: "item",
      label: "Thống kê doanh thu",
      href: "/admin/dashboard",
      icon: BarChart3,
      allowedRoles: ["super_admin", "admin", "accounting_admin"],
    },
    {
      type: "group",
      label: "Quản lý hệ thống",
      icon: FolderKanban,
      children: [
        {
          type: "item",
          label: "Nguồn thu mẫu",
          href: "/admin/doctors",
          icon: Stethoscope,
          allowedRoles: ["super_admin", "admin", "sales"],
        },
        {
          type: "item",
          label: "Danh mục dịch vụ",
          href: "/admin/services",
          icon: Activity,
          allowedRoles: ["super_admin", "admin"],
        },
        {
          type: "item",
          label: "Giá trị lựa chọn",
          href: "/admin/options",
          icon: Settings,
          allowedRoles: ["super_admin", "admin"],
        },
      ],
    },
    {
      type: "group",
      label: "Quản lý dữ liệu",
      icon: ShieldCheck,
      children: [
        {
          type: "item",
          label: "Quản lý nhân viên",
          href: "/admin/users",
          icon: UserCog,
          allowedRoles: ["super_admin", "admin"],
        },
        {
          type: "item",
          label: "Quản lý file dữ liệu",
          href: "/admin/drive",
          icon: Database,
          allowedRoles: ["super_admin", "admin"],
        },
        {
          type: "item",
          label: "Chuyển đổi file",
          href: "/admin/convertfile",
          icon: File,
          allowedRoles: ["super_admin", "admin"],
        },
      ],
    },
    {
      type: "group",
      label: "Nghiệp vụ kế toán",
      icon: WalletCards,
      children: [
        {
          type: "item",
          label: "Quản lý công nợ",
          href: "#",
          icon: Calculator,
          allowedRoles: ["accounting_admin"],
          badge: "Soon",
        },
        {
          type: "item",
          label: "Báo cáo chi phí",
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
    <header className="sticky top-0 z-50 w-full border-b border-sky-100/80 bg-white/80 shadow-[0_10px_40px_rgba(14,165,233,0.12)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[-60%] h-[220px] w-[220px] rounded-full bg-sky-300/25 blur-3xl" />
        <div className="absolute right-[-5%] top-[-30%] h-[240px] w-[240px] rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-50/90 via-white/80 to-cyan-50/90" />
      </div>

      <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
        <div className="relative flex h-20 items-center justify-between gap-4 lg:h-24">
          <div
            className="group flex cursor-pointer items-center gap-3"
            onClick={() => router.push(homeRoute)}
          >
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-sky-100 transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg">
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

            <span className="hidden items-center rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 shadow-sm md:inline-flex">
              <span className="mr-1.5 h-2 w-2 rounded-full bg-sky-500" />
              Online
            </span>
          </div>

          {!isSales && (
            <div className="absolute left-1/2 hidden -translate-x-1/2 lg:flex">
              <div
                onClick={() => router.push("/")}
                className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-sky-100/70 bg-white/85 px-5 py-3 shadow-lg shadow-sky-100/50 ring-1 ring-sky-100/60 backdrop-blur"
              >
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-sm">
                  <Sparkles className="h-5 w-5" />
                </div>

                <div className="leading-tight">
                  <div className="text-base font-bold tracking-tight text-slate-900">
                    Danh sách ca
                    <span className="ml-2 hidden rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-200 md:inline-flex">
                      Dashboard
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Theo dõi, lọc và xử lý các ca thu mẫu
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            {showAdminMenu && !isSales && (
              <div className="relative">
                <button
                  onClick={() => {
                    setOpenAdmin((v) => !v);
                    setOpenUser(false);
                  }}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-2xl border border-sky-100/80 bg-sky-50/80 px-3 py-2 shadow-md ring-1 ring-sky-100/80 backdrop-blur transition",
                    "hover:-translate-y-0.5 hover:bg-sky-100 hover:shadow-lg",
                    openAdmin && "ring-4 ring-sky-200/70",
                  )}
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-600 text-sm font-black text-white shadow-sm">
                    {user.role === "accounting_admin" ? "K" : "A"}
                  </span>

                  <div className="hidden text-left sm:block">
                    <div className="text-sm font-semibold text-slate-900">
                      {user.role === "accounting_admin" ? "Nghiệp vụ" : "Quản trị"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {user.role === "accounting_admin" ? "Công cụ kế toán" : "Admin tools"}
                    </div>
                  </div>

                  <ChevronDown
                    className={cn("h-4 w-4 text-slate-500 transition", openAdmin && "rotate-180")}
                  />
                </button>

                {openAdmin && (
                  <>
                    <button
                      aria-label="close"
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setOpenAdmin(false)}
                    />

                    <div className="absolute right-0 z-50 mt-3 w-[500px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[28px] border border-sky-100/80 bg-white/95 shadow-2xl shadow-sky-100/60 ring-1 ring-sky-100/70 backdrop-blur-xl">
                      <div className="relative overflow-hidden px-4 py-3.5">
                        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-sky-300/25 blur-2xl" />
                        <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-cyan-300/20 blur-2xl" />

                        <div className="relative flex items-start gap-2.5">
                          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-600 text-white shadow-sm">
                            <span className="text-sm font-black">
                              {user.role === "accounting_admin" ? "K" : "A"}
                            </span>
                          </div>

                          <div className="min-w-0">
                            <div className="text-sm font-bold tracking-tight text-slate-900">
                              {user.role === "accounting_admin"
                                ? "Khu vực nghiệp vụ kế toán"
                                : "Khu vực quản trị hệ thống"}
                            </div>
                            <div className="mt-0.5 text-[11px] text-slate-500">
                              Danh mục được chia nhóm cha con, hiển thị nhanh theo 2 cột.
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="h-px bg-sky-100" />

                      <div className="space-y-2.5 p-2.5">
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
                                  router.push(item.href);
                                }}
                                className={cn(
                                  "group flex w-full cursor-pointer items-center gap-2.5 rounded-2xl border px-3 py-2 text-left transition",
                                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2",
                                  active
                                    ? "border-sky-200 bg-sky-50 text-sky-700 shadow-sm"
                                    : "border-sky-100/80 bg-white hover:bg-sky-50",
                                )}
                              >
                                <div
                                  className={cn(
                                    "grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1 transition-all",
                                    active
                                      ? "bg-sky-100 text-sky-700 ring-sky-200"
                                      : "bg-white text-slate-500 ring-sky-100 group-hover:-translate-y-0.5 group-hover:text-sky-600 group-hover:shadow-sm",
                                  )}
                                >
                                  <item.icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div
                                    className={cn(
                                      "truncate text-sm font-semibold",
                                      active ? "text-sky-700" : "text-slate-900",
                                    )}
                                  >
                                    {item.label}
                                  </div>
                                </div>
                              </button>
                            );
                          }

                          const groupActive = item.children.some((child) =>
                            isRouteActive(pathname, child.href),
                          );

                          return (
                            <section
                              key={item.label}
                              className={cn(
                                "rounded-3xl border p-2",
                                groupActive
                                  ? "border-sky-200 bg-sky-50/70"
                                  : "border-sky-100/80 bg-sky-50/40",
                              )}
                            >
                              <div className="mb-2 flex items-center gap-2 px-1">
                                <div
                                  className={cn(
                                    "grid h-8 w-8 shrink-0 place-items-center rounded-xl ring-1",
                                    groupActive
                                      ? "bg-sky-100 text-sky-700 ring-sky-200"
                                      : "bg-white text-slate-500 ring-sky-100",
                                  )}
                                >
                                  <item.icon className="h-5 w-5" />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="truncate text-[13px] font-semibold leading-4 text-slate-900">
                                    {item.label}
                                  </div>
                                </div>

                                <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-semibold text-sky-700 ring-1 ring-sky-200">
                                  {item.children.length} mục
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-1">
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
                                        router.push(child.href);
                                      }}
                                      className={cn(
                                        "group flex min-h-[52px] cursor-pointer items-center gap-2 rounded-2xl border px-2 py-1.5 text-left transition",
                                        active
                                          ? "border-sky-200 bg-sky-100 text-sky-700 shadow-sm"
                                          : "border-sky-100 bg-white hover:bg-sky-50",
                                      )}
                                    >
                                      <div
                                        className={cn(
                                          "grid h-7 w-7 shrink-0 place-items-center rounded-lg ring-1 transition-all",
                                          active
                                            ? "bg-white text-sky-700 ring-sky-200"
                                            : "bg-sky-50 text-slate-500 ring-sky-100 group-hover:text-sky-600",
                                        )}
                                      >
                                        <child.icon className="h-3.5 w-3.5" />
                                      </div>

                                      <div className="min-w-0 flex-1">
                                        <div
                                          className={cn(
                                            "truncate text-xs font-semibold leading-4",
                                            child.href === "#"
                                              ? "text-slate-500"
                                              : active
                                                ? "text-sky-700"
                                                : "text-slate-900",
                                          )}
                                        >
                                          {child.label}
                                        </div>

                                        {child.badge && (
                                          <span className="mt-0.5 inline-flex rounded-full bg-amber-50 px-1 py-0.5 text-[9px] font-semibold text-amber-700 ring-1 ring-amber-200">
                                            {child.badge}
                                          </span>
                                        )}
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </section>
                          );
                        })}
                      </div>

                      <div className="px-4 pb-4">
                        <div className="flex items-center justify-between rounded-2xl border border-sky-100 bg-gradient-to-r from-sky-50 to-cyan-50 px-4 py-3">
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-slate-900">Mẹo sử dụng</div>
                            <div className="text-[11px] text-slate-600">
                              Các tab được rút gọn còn icon và title, chia 2 cột để thao tác
                              nhanh hơn.
                            </div>
                          </div>
                          <span className="ml-3 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white text-sky-700 ring-1 ring-sky-100">
                            ✓
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="relative">
              <button
                onClick={() => {
                  setOpenUser((v) => !v);
                  setOpenAdmin(false);
                }}
                className="flex cursor-pointer items-center gap-3 rounded-2xl border border-sky-100/80 bg-white/85 px-3 py-2 shadow-md ring-1 ring-sky-100/70 backdrop-blur transition hover:-translate-y-0.5 hover:bg-sky-50 hover:shadow-lg"
              >
                <Avatar name={user.name || user.email} />
                <div className="hidden text-left sm:block">
                  <div className="text-sm font-semibold text-slate-900">
                    {user.name || user.email}
                  </div>
                  <div className="text-xs text-slate-500">{roleLabel(user.role)}</div>
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

                  <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-3xl border border-sky-100/80 bg-white/95 shadow-2xl ring-1 ring-sky-100/70 backdrop-blur-xl">
                    <div className="px-4 py-4">
                      <div className="text-sm font-semibold text-slate-900">
                        {user.name || "Tài khoản"}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {user.email} • {roleLabel(user.role)}
                      </div>
                    </div>

                    <div className="h-px bg-sky-100" />

                    <button
                      className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-sky-50 hover:text-slate-900"
                      onClick={() => {
                        setOpenUser(false);
                        router.push("/profile");
                      }}
                    >
                      <User className="h-4 w-4 text-slate-500" />
                      Hồ sơ người dùng
                    </button>

                    <button className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-sky-50 hover:text-slate-900">
                      <Settings className="h-4 w-4 text-slate-500" />
                      Cài đặt
                    </button>

                    <div className="my-1 h-px bg-sky-100" />

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
