"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

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

export default function AppHeader() {
  // UI demo: sau này bạn nối auth thật
  const [user] = useState<{ name: string; role: string }>({
    name: "Nguyễn Đức Kiên",
    role: "Admin",
  });
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6">
        <div className="flex h-24 items-center justify-between gap-3">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-3">
            <div className="h-15 w-15 rounded-2xl text-white flex items-center justify-center shadow-sm overflow-hidden">
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
                Danh sách mẫu
              </div>
              <div className="text-xs text-neutral-500">Gennovax Internal</div>
            </div>

            <span className="hidden md:inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              Online
            </span>
          </div>

          {/* Middle: Quick search */}
          {/* <div className="hidden lg:flex flex-1 max-w-[560px]">
            <div className="relative w-full">
              <input
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm shadow-sm outline-none focus:ring-2 focus:ring-neutral-300"
                placeholder="Tìm nhanh: mã ca, tên bệnh nhân, mã hàng..."
              />
              <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-neutral-100 px-2 py-1 text-[11px] font-semibold text-neutral-600 ring-1 ring-black/5">
                Ctrl K
              </div>
            </div>
          </div> */}

          {/* Right: actions + user */}
          <div className="flex items-center gap-2">
            <button className="hidden sm:inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold shadow-sm hover:bg-neutral-50">
              <span className="inline-flex h-2 w-2 rounded-full bg-rose-500" />
              Thông báo
            </button>

            {/* <button className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold shadow-sm hover:bg-neutral-50">
              + Tạo nhanh
            </button> */}

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-3 py-2 shadow-sm hover:bg-neutral-50"
              >
                <Avatar name={user.name} />
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-semibold text-neutral-900">
                    {user.name}
                  </div>
                  <div className="text-xs text-neutral-500">{user.role}</div>
                </div>
                <span className="text-neutral-500">▾</span>
              </button>

              {open && (
                <div
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/10"
                  onMouseLeave={() => setOpen(false)}
                >
                  <div className="px-4 py-3">
                    <div className="text-sm font-semibold text-neutral-900">
                      Tài khoản
                    </div>
                    <div className="text-xs text-neutral-500">
                      Quản lý hồ sơ & phân quyền
                    </div>
                  </div>
                  <div className="h-px bg-black/5" />
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50">
                    Hồ sơ người dùng
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50">
                    Cài đặt
                  </button>
                  <div className="h-px bg-black/5" />
                  <button className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50">
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
