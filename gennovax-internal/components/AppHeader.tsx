"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

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
  if (role === "admin") return "Admin";
  if (role === "staff") return "Nhân viên";
  return role ?? "—";
}

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, logout } = useAuth();

  const [openUser, setOpenUser] = useState(false);
  const [openAdmin, setOpenAdmin] = useState(false);

  // ✅ nếu chưa login thì không render header
  if (!token || !user) return null;

  const isAdmin = user.role === "admin";

  const adminItems = [
    { label: "Quản trị Doctors", desc: "Thêm/sửa/xóa bác sĩ", href: "/admin/doctors" },
    { label: "Quản trị Services", desc: "Gói dịch vụ & bảng giá", href: "/admin/services" },
    { label: "Quản trị Options", desc: "Danh mục lựa chọn (meta)", href: "/admin/options" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-400  bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
        <div className="relative flex h-24 items-center justify-between gap-3">
          {/* Left */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl shadow-sm overflow-hidden ring-1 ring-black/5">
              <Image
                src="/icon.png"
                alt="Logo"
                width={60}
                height={60}
                className="h-full w-full object-cover"
                priority
              />
            </div>

            <div className="leading-tight">
              <div className="text-sm font-semibold text-neutral-900">
                Quản lý mẫu thu
              </div>
              <div className="text-xs text-neutral-500">Gennovax Internal</div>
            </div>

            <span className="hidden md:inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              Online
            </span>
          </div>

          {/* Center */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-white/90 px-5 py-2.5 ring-2 ring-blue-200 shadow-sm">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-indigo-500 ring-2 ring-indigo-200/60" />
              <div className="leading-tight cursor-pointer" onClick={()=>{router.push('/')}}>
                <div className="text-base font-bold tracking-tight text-neutral-900">
                  Danh sách ca 
                  <span className="hidden md:inline-flex items-center rounded-full bg-blue-50 ml-2.5 px-2.5 py-1 text-xs font-semibold text-blue-500 ring-1 ring-blue-200">
              Dashboard
            </span>
                </div>
                <div className="mt-1 text-xs text-neutral-500">
                  Theo dõi, lọc và xử lý các ca thu mẫu
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {/* ✅ Admin menu button (chỉ admin mới thấy) */}
            {isAdmin && (
              <div className="relative">
                <button
                  onClick={() => {
                    setOpenAdmin((v) => !v);
                    setOpenUser(false);
                  }}
                  className={cn(
                    "flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2 shadow-sm hover:bg-neutral-50",
                    openAdmin && "ring-4 ring-indigo-200"
                  )}
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 font-black">
                    A
                  </span>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-semibold text-neutral-900">
                      Quản trị
                    </div>
                    <div className="text-xs text-neutral-500">
                      Admin tools
                    </div>
                  </div>
                  <span className="text-neutral-500">▾</span>
                </button>

                {openAdmin && (
                  <>
                    {/* click outside */}
                    <button
                      aria-label="close"
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setOpenAdmin(false)}
                    />

                    <div className="absolute right-0 mt-3 z-50 w-[360px] overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/10">
  {/* Header */}
  <div className="relative px-5 py-4">
    {/* glow */}
    <div className="pointer-events-none absolute -top-10 -right-10 h-24 w-24 rounded-full bg-indigo-400/20 blur-2xl" />
    <div className="pointer-events-none absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-fuchsia-400/15 blur-2xl" />

    <div className="flex items-start gap-3">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white shadow-sm ring-1 ring-white/30">
        <span className="text-sm font-black">A</span>
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <div className="text-base font-bold tracking-tight text-neutral-900">
            Khu vực quản trị
          </div>
          <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-200">
            Admin
          </span>
        </div>
        <div className="mt-1 text-xs text-neutral-500">
          Công cụ nâng cao • Chỉ dành cho quản trị viên
        </div>
      </div>
    </div>
  </div>

  <div className="h-px bg-black/5" />

  {/* Items */}
  <div className="p-2">
    {adminItems.map((it) => {
      const active = pathname?.startsWith(it.href);

      return (
        <button
          key={it.href}
          onClick={() => {
            setOpenAdmin(false);
            router.push(it.href);
          }}
          className={cn(
            "group relative w-full overflow-hidden rounded-2xl px-4 py-3 text-left transition",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 focus-visible:ring-offset-2",
            active
              ? "bg-gradient-to-r from-indigo-50 to-fuchsia-50 ring-1 ring-indigo-200"
              : "hover:bg-neutral-50"
          )}
        >
          {/* left accent bar */}
          <span
            className={cn(
              "absolute left-0 top-2 bottom-2 w-1 rounded-full transition",
              active ? "bg-gradient-to-b from-indigo-600 to-fuchsia-600" : "bg-transparent group-hover:bg-black/10"
            )}
          />

          <div className="flex items-start gap-3">
            {/* icon bubble */}
            <div
              className={cn(
                "grid h-10 w-10 place-items-center rounded-2xl ring-1 transition",
                active
                  ? "bg-white/70 text-indigo-700 ring-indigo-200"
                  : "bg-white text-neutral-700 ring-black/5 group-hover:bg-white/80"
              )}
            >
              {/* mini glyph */}
              <span className={cn("text-xs font-black", active && "text-indigo-700")}>
                {it.label?.[0]?.toUpperCase() ?? "•"}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div
                  className={cn(
                    "truncate text-sm font-semibold transition",
                    active ? "text-neutral-900" : "text-neutral-900"
                  )}
                >
                  {it.label}
                </div>

                {/* badge */}
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 transition",
                    active
                      ? "bg-indigo-100 text-indigo-700 ring-indigo-200"
                      : "bg-neutral-100 text-neutral-600 ring-black/5 group-hover:bg-indigo-50 group-hover:text-indigo-700 group-hover:ring-indigo-200"
                  )}
                >
                  Tools
                </span>
              </div>

              <div className="mt-1 line-clamp-2 text-xs text-neutral-500">
                {it.desc}
              </div>
            </div>

            {/* chevron */}
            <div
              className={cn(
                "mt-1 text-neutral-400 transition group-hover:translate-x-0.5 group-hover:text-neutral-600",
                active && "text-indigo-600"
              )}
            >
              ▸
            </div>
          </div>
        </button>
      );
    })}
  </div>

  {/* Footer */}
  <div className="px-4 pb-4">
    <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-50 to-sky-50 px-4 py-3 ring-1 ring-black/5">
      <div className="min-w-0">
        <div className="text-xs font-semibold text-neutral-900">
          Tip nhanh
        </div>
        <div className="text-[11px] text-neutral-600">
          Bạn có thể vào Dashboard để theo dõi tổng quan.
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
            <div className="relative">
              <button
                onClick={() => {
                  setOpenUser((v) => !v);
                  setOpenAdmin(false);
                }}
                className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-3 py-2 shadow-sm hover:bg-neutral-50"
              >
                <Avatar name={user.name || user.email} />
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-semibold text-neutral-900">
                    {user.name || user.email}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {roleLabel(user.role)}
                  </div>
                </div>
                <span className="text-neutral-500">▾</span>
              </button>

              {openUser && (
                <>
                  {/* click outside */}
                  <button
                    aria-label="close"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setOpenUser(false)}
                  />

                  <div className="absolute right-0 mt-2 z-50 w-56 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/10">
                    <div className="px-4 py-3">
                      <div className="text-sm font-semibold text-neutral-900">
                        {user.name || "Tài khoản"}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {user.email} • {roleLabel(user.role)}
                      </div>
                    </div>
                    <div className="h-px bg-black/5" />

                    <button
                      className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50"
                      onClick={() => {
                        setOpenUser(false);
                        router.push("/profile");
                      }}
                    >
                      Hồ sơ người dùng
                    </button>

                    <button
                      className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50"
                      onClick={() => {
                        setOpenUser(false);
                        router.push("/settings");
                      }}
                    >
                      Cài đặt
                    </button>

                    <div className="h-px bg-black/5" />

                    <button
                      className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                      onClick={() => {
                        setOpenUser(false);
                        logout();
                        router.replace("/login");
                      }}
                    >
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
