"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Lock, ArrowRight, Eye, EyeOff, User } from "lucide-react";

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

  const BG_URL =
    "https://res.cloudinary.com/da6f4dmql/image/upload/v1764730192/dl.beatsnoop.com-3000-O9KATiVLbI_bf17z3.jpg";

  const onSubmit = async () => {
    setErr(null);
    setLoading(true);
    try {
      await login(email.trim(), password);

      const rawUser =
        typeof window !== "undefined"
          ? localStorage.getItem("genno_user")
          : null;
      const nextUser = rawUser ? JSON.parse(rawUser) : null;

      router.replace(nextUser?.role === "sales" ? "/admin/doctors" : "/");
    } catch (e: unknown) {
      setErr(
        e instanceof Error
          ? e.message
          : "Đăng nhập thất bại. Vui lòng kiểm tra lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4 sm:p-8">
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BG_URL})` }}
      />

      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />

      <div className="relative z-10 w-full max-w-5xl">
        <div className="grid grid-cols-1 overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/80 shadow-2xl shadow-purple-900/30 backdrop-blur-2xl md:grid-cols-2">
          <div className="relative hidden flex-col justify-between overflow-hidden p-12 text-white md:flex">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 opacity-95" />

            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-blue-400/30 blur-3xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-white/90 backdrop-blur-md">
                Gennovax <span className="text-white/50">•</span> Case Management
              </div>

              <div className="mt-12 flex items-center gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.25rem] bg-white/10 shadow-lg ring-1 ring-white/25 backdrop-blur-md">
                  <Lock className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">Secure Access</div>
                  <div className="text-sm font-medium text-white/70">
                    Bảo mật và phân quyền nội bộ
                  </div>
                </div>
              </div>

              <h1 className="mt-8 text-4xl leading-[1.15] tracking-tight text-white lg:text-5xl">
                Nền tảng quản lý
                <br />
                <span className="bg-gradient-to-r from-blue-200 to-pink-200 bg-clip-text text-transparent">
                  chuyên nghiệp.
                </span>
              </h1>

              <div className="mt-8 rounded-2xl border border-white/10 bg-black/10 px-5 py-4 text-sm font-medium leading-relaxed text-white/90 backdrop-blur-sm">
                Dữ liệu được mã hóa và đồng bộ theo thời gian thực, đảm bảo luồng
                công việc giữa các phòng ban luôn thông suốt.
              </div>
            </div>

            <div className="relative z-10 text-[13px] font-medium text-white/60">
              © {new Date().getFullYear()} Gennovax System
            </div>
          </div>

          <div className="flex flex-col justify-center bg-white/50 p-8 sm:p-12 lg:p-16">
            <div className="mb-8">
              <h2 className="mb-2 text-4xl font-bold tracking-tight text-blue-900">
                Chào mừng trở lại
              </h2>
              <p className="text-sm font-medium text-slate-500">
                Vui lòng nhập thông tin xác thực để tiếp tục
              </p>
            </div>

            {err && (
              <div className="mb-6 flex items-start gap-2 rounded-2xl border border-rose-100 bg-rose-50/80 px-4 py-3.5 text-[13px] font-bold text-rose-600 backdrop-blur-sm">
                <span className="text-rose-500">⚠</span> {err}
              </div>
            )}

            <div className="space-y-5">
              <div className="group">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors group-focus-within:text-purple-600">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-purple-500" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@gennovax.vn"
                    className={cn(
                      "w-full rounded-2xl border border-slate-200 bg-white/80 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400",
                      "focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-500/10",
                    )}
                  />
                </div>
              </div>

              <div className="group">
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors group-focus-within:text-purple-600">
                    Mật khẩu
                  </label>
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-bold text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  >
                    {show ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                    {show ? "Ẩn" : "Hiện"}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-purple-500" />
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={cn(
                      "w-full rounded-2xl border border-slate-200 bg-white/80 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400",
                      "focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-500/10",
                    )}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !loading) onSubmit();
                    }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={onSubmit}
                disabled={loading || !email.trim() || !password}
                className="group relative mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-purple-500/30 transition-all hover:-translate-y-0.5 hover:shadow-purple-500/50 active:scale-[0.98] disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? "Đang xác thực..." : "Đăng nhập hệ thống"}
                {!loading && (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </button>

              <div className="mt-6 text-center">
                <a
                  href="#"
                  className="text-xs font-bold text-slate-400 transition-colors hover:text-purple-600"
                >
                  Quên mật khẩu?
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
