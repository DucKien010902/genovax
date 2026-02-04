"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
  const { user, token, logout } = useAuth();
  const [open, setOpen] = useState(false);

  // ✅ nếu chưa login thì không render header
  if (!token || !user) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b-6 border-gray-200 border-black/10 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
        <div className="flex h-24 items-center justify-between gap-3">
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
          <div className="hidden lg:flex">
            <div className="inline-flex items-center gap-3 rounded-2xl bg-white/90 px-5 py-2.5 ring-1 ring-black/10 shadow-sm">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-indigo-500 ring-2 ring-indigo-200/60" />
              <div className="leading-tight">
                <div className="text-base font-bold tracking-tight text-neutral-900">
                  Danh sách ca
                </div>
                <div className="text-xs text-neutral-500">
                  Theo dõi, lọc và xử lý các ca thu mẫu
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button className="hidden sm:inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold shadow-sm hover:bg-neutral-50">
              <span className="inline-flex h-2 w-2 rounded-full bg-rose-500" />
              Thông báo
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
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

              {open && (
                <>
                  {/* click outside */}
                  <button
                    aria-label="close"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setOpen(false)}
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
                        setOpen(false);
                        router.push("/profile");
                      }}
                    >
                      Hồ sơ người dùng
                    </button>

                    <button
                      className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50"
                      onClick={() => {
                        setOpen(false);
                        router.push("/settings");
                      }}
                    >
                      Cài đặt
                    </button>

                    <div className="h-px bg-black/5" />

                    <button
                      className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                      onClick={() => {
                        setOpen(false);
                        logout();               // ✅ xóa token + user
                        router.replace("/login"); // ✅ về login
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
