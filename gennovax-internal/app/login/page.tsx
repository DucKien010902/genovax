"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Lock } from "lucide-react";

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // ✅ đổi link ảnh của bạn ở đây
  const BG_URL =
    "https://res.cloudinary.com/da6f4dmql/image/upload/v1764730192/dl.beatsnoop.com-3000-O9KATiVLbI_bf17z3.jpg";

  const onSubmit = async () => {
    setErr(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace("/");
    } catch (e: any) {
      setErr(e?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ✅ Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BG_URL})` }}
      />

      {/* ✅ Overlay mờ + tối nhẹ để nổi login */}
      <div className="absolute inset-0 bg-black/35 backdrop-blur-[6px]" />

      {/* ✅ Content nằm trên cùng */}
      <div className="relative z-10 min-h-screen">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4">
          <div className="grid w-full grid-cols-1 overflow-hidden rounded-[28px] border border-white/15 bg-white/85 shadow-2xl backdrop-blur-xl md:grid-cols-2">
            {/* Left visual */}
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-rose-600" />
              <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_30%_20%,white_0,transparent_55%),radial-gradient(circle_at_70%_80%,white_0,transparent_55%)]" />

              <div className="relative flex h-full flex-col justify-between p-10 text-white">
                <div>
                  <div className="text-xs font-semibold tracking-wider text-white/80">
                    GENNOVAX • CASE MANAGEMENT
                  </div>

                  <div className="mt-6 flex items-center gap-4">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
                      <Lock className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-white/85">
                      Secure Access
                      <div className="text-xs font-medium text-white/70">
                        Bảo mật & phân quyền
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 text-5xl font-bold leading-tight">
                    Đăng nhập để quản lý mẫu thu
                    <div className="mt-2 text-lg font-semibold text-white/85">
                      Admin & Nhân viên
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/85 ring-1 ring-white/20">
                    Tip: Dữ liệu được đồng bộ theo tài khoản, đảm bảo an toàn và
                    truy vết.
                  </div>
                </div>

                <div className="text-xs text-white/70">
                  © {new Date().getFullYear()} Gennovax
                </div>
              </div>
            </div>

            {/* Right form */}
            <div className="p-7 sm:p-10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold tracking-tight text-neutral-900">
                    Đăng nhập
                  </div>
                  <div className="mt-1 text-sm text-neutral-600">
                    Nhập email và mật khẩu để tiếp tục
                  </div>
                </div>

                <div className="rounded-2xl bg-neutral-900 px-3 py-2 text-xs font-semibold text-white">
                  v1
                </div>
              </div>

              {err && (
                <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                  {err}
                </div>
              )}

              <div className="mt-6 space-y-4">
                <div>
                  <div className="mb-1 text-xs font-semibold text-neutral-700">
                    Email
                  </div>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@genno.local"
                    className={cn(
                      "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black shadow-sm outline-none",
                      "focus:ring-4 focus:ring-indigo-200"
                    )}
                  />
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between text-xs font-semibold text-neutral-700">
                    <span>Mật khẩu</span>
                    <button
                      type="button"
                      onClick={() => setShow((v) => !v)}
                      className="rounded-xl px-2 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-50"
                    >
                      {show ? "Ẩn" : "Hiện"}
                    </button>
                  </div>
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={cn(
                      "w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black shadow-sm outline-none",
                      "focus:ring-4 focus:ring-indigo-200"
                    )}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !loading) onSubmit();
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={loading || !email.trim() || !password}
                  className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-4 py-3 text-sm font-extrabold text-white shadow-sm hover:opacity-95 disabled:opacity-60"
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>

                <div className="text-center text-xs text-neutral-600">
                  Quên mật khẩu?
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
