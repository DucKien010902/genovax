"use client";

import Image from "next/image";
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
    <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
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

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, logout } = useAuth();

  const [openUser, setOpenUser] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);

  // Nếu chưa login thì không render header
  if (!token || !user) return null;

  // ✅ Kích hoạt menu Quản trị cho cả 3 quyền này
  const showAdminMenu = ["admin", "super_admin", "accounting_admin"].includes(
    user.role,
  );

  // ✅ CẤU HÌNH MENU LINH HOẠT THEO QUYỀN (Thêm allowedRoles)
  const allAdminItems = [
    {
      label: "Thống kê doanh thu",
      desc: "Tổng hợp doanh thu theo tháng",
      href: "/admin/dashboard",
      icon: BarChart3,
      allowedRoles: ["super_admin", "admin", "accounting_admin"], // Kế toán được xem
    },
    {
      label: "Nguồn thu mẫu",
      desc: "Thêm/sửa/xóa nguồn thu",
      href: "/admin/doctors",
      icon: Stethoscope,
      allowedRoles: ["super_admin", "admin"],
    },
    {
      label: "Gói dịch vụ",
      desc: "Gói dịch vụ & bảng giá",
      href: "/admin/services",
      icon: Activity,
      allowedRoles: ["super_admin", "admin"],
    },
    {
      label: "Giá trị lựa chọn",
      desc: "Danh mục lựa chọn (meta)",
      href: "/admin/options",
      icon: Settings,
      allowedRoles: ["super_admin", "admin"],
    },
    {
      label: "Quản lý nhân viên",
      desc: "Danh mục quản lý tài khoản",
      href: "/admin/users",
      icon: UserCog,
      allowedRoles: ["super_admin", "admin"], // Tuỳ bạn, hôm qua đã phân quyền ở page này
    },
    // --- CÁC TAB CHỜ PHÁT TRIỂN DÀNH CHO KẾ TOÁN ---
    {
      label: "Quản lý công nợ",
      desc: "Theo dõi công nợ (Đang phát triển)",
      href: "#", // Dấu # để chặn chuyển trang
      icon: Calculator,
      allowedRoles: ["accounting_admin"],
    },
    {
      label: "Báo cáo chi phí",
      desc: "Chi phí vận hành (Đang phát triển)",
      href: "#",
      icon: FileText,
      allowedRoles: ["accounting_admin"],
    },
  ];

  // ✅ Lọc ra những menu mà user hiện tại được phép xem
  const visibleAdminItems = allAdminItems.filter((item) =>
    item.allowedRoles.includes(user.role),
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/10">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src="https://media.istockphoto.com/id/858983438/vi/anh/n%E1%BB%81n-m%C3%A0u-xanh-d%C6%B0%C6%A1ng-v%C3%A0-h%E1%BB%93ng-nh%E1%BA%A1t.jpg?s=612x612&w=0&k=20&c=MZH_J9CiHVXFpAp9McAFZLqyxH8GhkuSnPAvE0AXCF4="
          alt="Header background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100/80 via-white/70 to-white/80" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
        <div className="relative flex h-20 lg:h-24 items-center justify-between gap-3">
          {/* Left */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="h-14 w-14 rounded-2xl shadow-sm overflow-hidden ring-1 ring-blue-300 bg-white/70 flex items-center justify-center">
  <img
    src="https://res.cloudinary.com/da6f4dmql/image/upload/v1773128350/genbio1-1_hf0tjp.png"
    alt="Logo"
    className="h-full w-full object-contain p-1.5"
  />
</div>

            <div className="leading-tight">
              <div className="text-sm font-semibold text-purple-800 drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]">
                Danh mục quản lý
              </div>
              <div className="text-xs text-purple-800 drop-shadow-[0_1px_0_rgba(255,255,255,0.55)]">
                Gennovax Lab
              </div>
            </div>

            <span className="hidden md:inline-flex items-center rounded-full bg-emerald-50/90 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200 shadow-sm">
              Online
            </span>
          </div>

          {/* Center */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-white/80 px-5 py-2.5 ring-1 ring-black/10 shadow-md backdrop-blur">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-indigo-500 ring-2 ring-indigo-200/60" />
              <div
                className="leading-tight cursor-pointer"
                onClick={() => router.push("/")}
              >
                <div className="text-base font-bold tracking-tight text-neutral-900">
                  Danh sách ca
                  <span className="hidden md:inline-flex items-center rounded-full bg-blue-50/90 ml-2.5 px-2.5 py-1 text-xs font-semibold text-blue-600 ring-1 ring-blue-200 shadow-sm">
                    Dashboard
                  </span>
                </div>
                <div className="mt-1 text-xs text-neutral-600">
                  Theo dõi, lọc và xử lý các ca thu mẫu
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* ✅ Menu Quản trị chỉ hiển thị khi có quyền */}
            {showAdminMenu && (
              <div className="relative ">
                <button
                  onClick={() => {
                    setOpenAdmin((v) => !v);
                    setOpenUser(false);
                  }}
                  className={cn(
                    "cursor-pointer flex items-center gap-2 rounded-2xl border border-black/10 bg-white/80 px-3 py-2 shadow-md hover:bg-white/90 backdrop-blur",
                    openAdmin && "ring-4 ring-indigo-200",
                  )}
                >
                  <span
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-2xl text-white font-black shadow-sm ${user.role === "accounting_admin" ? "bg-gradient-to-br from-amber-400 to-orange-500" : "bg-gradient-to-br from-indigo-500 to-purple-600"}`}
                  >
                    {user.role === "accounting_admin" ? "K" : "A"}
                  </span>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-semibold text-neutral-900">
                      {user.role === "accounting_admin"
                        ? "Nghiệp vụ"
                        : "Quản trị"}
                    </div>
                    <div className="text-xs text-neutral-600">
                      {user.role === "accounting_admin"
                        ? "Công cụ Kế toán"
                        : "Admin tools"}
                    </div>
                  </div>
                  <span className="text-neutral-600">▾</span>
                </button>

                {openAdmin && (
                  <>
                    <button
                      aria-label="close"
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setOpenAdmin(false)}
                    />

                    <div className="absolute right-0 mt-3 z-50 w-[360px] overflow-hidden rounded-3xl bg-white/90 shadow-2xl ring-1 ring-black/10 backdrop-blur">
                      <div className="relative px-5 py-4">
                        <div className="pointer-events-none absolute -top-10 -right-10 h-24 w-24 rounded-full bg-indigo-400/20 blur-2xl" />
                        <div className="pointer-events-none absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-fuchsia-400/15 blur-2xl" />

                        <div className="flex items-start gap-3">
                          <div
                            className={`grid h-11 w-11 place-items-center rounded-2xl text-white shadow-sm ring-1 ring-white/30 ${user.role === "accounting_admin" ? "bg-gradient-to-br from-amber-400 to-orange-500" : "bg-gradient-to-br from-indigo-600 to-fuchsia-600"}`}
                          >
                            <span className="text-sm font-black">
                              {user.role === "accounting_admin" ? "K" : "A"}
                            </span>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <div className="text-base font-bold tracking-tight text-neutral-900">
                                {user.role === "accounting_admin"
                                  ? "Nghiệp vụ Kế toán"
                                  : "Khu vực quản trị"}
                              </div>
                            </div>
                            <div className="mt-1 text-xs text-neutral-600">
                              Công cụ nâng cao • Chỉ dành cho người có quyền
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="h-px bg-black/5" />

                      <div className="p-2">
                        {/* ✅ Chỉ map những item đã được filter */}
                        {visibleAdminItems.map((it) => {
                          const active =
                            pathname?.startsWith(it.href) && it.href !== "#";

                          return (
                            <button
                              key={it.label} // Dùng label làm key vì href có thể trùng '#'
                              onClick={() => {
                                // Xử lý các tab chưa làm
                                if (it.href === "#") {
                                  alert("Tính năng này đang được phát triển!");
                                  return;
                                }
                                setOpenAdmin(false);
                                router.push(it.href);
                              }}
                              className={cn(
                                "group relative w-full overflow-hidden rounded-2xl px-4 py-3 text-left transition cursor-pointer",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 focus-visible:ring-offset-2",
                                active
                                  ? "bg-gradient-to-r from-indigo-50 to-fuchsia-50 ring-1 ring-indigo-200"
                                  : "hover:bg-neutral-50/70",
                              )}
                            >
                              <span
                                className={cn(
                                  "absolute left-0 top-2 bottom-2 w-1 rounded-full transition",
                                  active
                                    ? "bg-gradient-to-b from-indigo-600 to-fuchsia-600"
                                    : "bg-transparent group-hover:bg-black/10",
                                )}
                              />

                              <div className="flex items-start gap-3">
                                <div
                                  className={cn(
                                    "grid h-10 w-10 shrink-0 place-items-center rounded-2xl ring-1 transition-all duration-200",
                                    active
                                      ? "bg-indigo-100/80 text-indigo-700 ring-indigo-200 shadow-sm"
                                      : "bg-white/80 text-neutral-500 ring-black/5 group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-md group-hover:-translate-y-0.5",
                                  )}
                                >
                                  {it.icon && (
                                    <it.icon
                                      className={cn(
                                        "w-5 h-5 transition-transform duration-200",
                                        active
                                          ? "scale-110"
                                          : "group-hover:scale-110",
                                      )}
                                      strokeWidth={active ? 2.5 : 2}
                                    />
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-2">
                                    <div
                                      className={cn(
                                        "truncate text-sm font-semibold",
                                        it.href === "#"
                                          ? "text-neutral-500"
                                          : "text-neutral-900",
                                      )}
                                    >
                                      {it.label}
                                    </div>

                                    <span
                                      className={cn(
                                        "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 transition",
                                        active
                                          ? "bg-indigo-100 text-indigo-700 ring-indigo-200"
                                          : "bg-neutral-100 text-neutral-600 ring-black/5 group-hover:bg-indigo-50 group-hover:text-indigo-700 group-hover:ring-indigo-200",
                                        it.href === "#" &&
                                          "bg-amber-50 text-amber-600 ring-amber-200 group-hover:bg-amber-100 group-hover:text-amber-700",
                                      )}
                                    >
                                      {it.href === "#" ? "Soon" : "Tools"}
                                    </span>
                                  </div>

                                  <div className="mt-1 line-clamp-2 text-xs text-neutral-600">
                                    {it.desc}
                                  </div>
                                </div>

                                <div
                                  className={cn(
                                    "mt-1 text-neutral-400 transition group-hover:translate-x-0.5 group-hover:text-neutral-600",
                                    active && "text-indigo-600",
                                  )}
                                >
                                  ▸
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      <div className="px-4 pb-4">
                        <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-50 to-sky-50 px-4 py-3 ring-1 ring-black/5">
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-neutral-900">
                              Tip nhanh
                            </div>
                            <div className="text-[11px] text-neutral-700">
                              Các tính năng có nhãn "Soon" sẽ sớm được cập nhật.
                            </div>
                          </div>
                          <span className="ml-3 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white/80 text-emerald-700 ring-1 ring-black/5">
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
            <div className="relative ">
              <button
                onClick={() => {
                  setOpenUser((v) => !v);
                  setOpenAdmin(false);
                }}
                className="cursor-pointer flex items-center gap-3 rounded-2xl border border-black/10 bg-white/80 px-3 py-2 shadow-md hover:bg-white/90 backdrop-blur"
              >
                <Avatar name={user.name || user.email} />
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-semibold text-neutral-900">
                    {user.name || user.email}
                  </div>
                  <div className="text-xs text-neutral-600">
                    {roleLabel(user.role)}
                  </div>
                </div>
                <span className="text-neutral-600">▾</span>
              </button>

              {openUser && (
                <>
                  <button
                    aria-label="close"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setOpenUser(false)}
                  />

                  <div className="absolute right-0 mt-2 z-50 w-56 overflow-hidden rounded-2xl bg-white/90 shadow-xl ring-1 ring-black/10 backdrop-blur">
                    <div className="px-4 py-3">
                      <div className="text-sm font-semibold text-neutral-900">
                        {user.name || "Tài khoản"}
                      </div>
                      <div className="text-xs text-neutral-600">
                        {user.email} • {roleLabel(user.role)}
                      </div>
                    </div>
                    <div className="h-px bg-black/5" />

                    <button
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-100/80 hover:text-neutral-900 transition-colors"
                      onClick={() => {
                        setOpenUser(false);
                        router.push("/profile");
                      }}
                    >
                      <User className="w-4 h-4 text-neutral-500" />
                      Hồ sơ người dùng
                    </button>

                    <button
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-100/80 hover:text-neutral-900 transition-colors"
                      // onClick={() => {
                      //   setOpenUser(false);
                      //   router.push("/settings");
                      // }}
                    >
                      <Settings className="w-4 h-4 text-neutral-500" />
                      Cài đặt
                    </button>

                    <div className="my-1 h-px bg-black/5" />

                    <button
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50/70 transition-colors"
                      onClick={() => {
                        setOpenUser(false);
                        logout();
                        router.replace("/login");
                      }}
                    >
                      <LogOut className="w-4 h-4" />
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
