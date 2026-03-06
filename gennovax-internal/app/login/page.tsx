"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Lock, ArrowRight, Eye, EyeOff, User } from "lucide-react"; // ✅ Import thêm User

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

  // Hình nền của bạn
  const BG_URL =
    "https://res.cloudinary.com/da6f4dmql/image/upload/v1764730192/dl.beatsnoop.com-3000-O9KATiVLbI_bf17z3.jpg";

  const onSubmit = async () => {
    setErr(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace("/");
    } catch (e: any) {
      setErr(e?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center p-4 sm:p-8">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ backgroundImage: `url(${BG_URL})` }}
      />

      {/* Overlay mờ ảo */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-5xl">
        <div className="grid grid-cols-1 overflow-hidden rounded-[2.5rem] border border-white/40 bg-white/80 shadow-2xl shadow-purple-900/30 backdrop-blur-2xl md:grid-cols-2">
          
          {/* CỘT TRÁI: VISUAL - Gradient Xanh Tím Hồng */}
          <div className="relative hidden md:flex flex-col justify-between overflow-hidden p-12 text-white">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 opacity-95" />
            
            <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-blue-400/30 blur-3xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-black tracking-widest text-white/90 backdrop-blur-md border border-white/20 uppercase">
                Gennovax <span className="text-white/50">•</span> Case Management
              </div>

              <div className="mt-12 flex items-center gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.25rem] bg-white/10 ring-1 ring-white/25 backdrop-blur-md shadow-lg">
                  <Lock className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">Secure Access</div>
                  <div className="text-sm font-medium text-white/70">Bảo mật & Phân quyền nội bộ</div>
                </div>
              </div>

              <h1 className="mt-8 text-4xl leading-[1.15] tracking-tight text-white lg:text-5xl">
                Nền tảng quản lý <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-pink-200">
                  chuyên nghiệp.
                </span>
              </h1>

              <div className="mt-8 rounded-2xl bg-black/10 px-5 py-4 text-sm font-medium leading-relaxed text-white/90 backdrop-blur-sm border border-white/10">
                💡 Dữ liệu được mã hóa và đồng bộ theo thời gian thực, đảm bảo luồng công việc giữa các phòng ban luôn thông suốt.
              </div>
            </div>

            <div className="relative z-10 text-[13px] font-medium text-white/60">
              © {new Date().getFullYear()} Gennovax System
            </div>
          </div>

          {/* CỘT PHẢI: FORM ĐĂNG NHẬP */}
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16 bg-white/50">
            <div className="mb-8">
              <h2 className="text-4xl font-bold tracking-tight text-blue-900 mb-2">
                Chào mừng trở lại
              </h2>
              <p className="text-sm font-medium text-slate-500">
                Vui lòng nhập thông tin xác thực để tiếp tục
              </p>
            </div>

            {err && (
              <div className="mb-6 rounded-2xl border border-rose-100 bg-rose-50/80 px-4 py-3.5 text-[13px] font-bold text-rose-600 backdrop-blur-sm flex items-start gap-2">
                <span className="text-rose-500">⚠</span> {err}
              </div>
            )}

            <div className="space-y-5">
              {/* ✅ Email Input có Icon User */}
              <div className="group">
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 group-focus-within:text-purple-600 transition-colors">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  {/* Icon nằm tuyệt đối bên trái */}
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-purple-500" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@gennovax.vn"
                    className={cn(
                      // Thay px-4 bằng pl-11 pr-4 để chừa chỗ cho icon bên trái
                      "w-full rounded-2xl border border-slate-200 bg-white/80 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400",
                      "focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
                    )}
                  />
                </div>
              </div>

              {/* ✅ Password Input có Icon Lock */}
              <div className="group">
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 group-focus-within:text-purple-600 transition-colors">
                    Mật khẩu
                  </label>
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                  >
                    {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    {show ? "Ẩn" : "Hiện"}
                  </button>
                </div>
                <div className="relative">
                  {/* Icon nằm tuyệt đối bên trái */}
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-purple-500" />
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={cn(
                      // Thay px-4 bằng pl-11 pr-4 để chừa chỗ cho icon bên trái
                      "w-full rounded-2xl border border-slate-200 bg-white/80 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400",
                      "focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-500/10"
                    )}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !loading) onSubmit();
                    }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={onSubmit}
                disabled={loading || !email.trim() || !password}
                className="group relative mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-purple-500/30 transition-all hover:shadow-purple-500/50 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? "Đang xác thực..." : "Đăng nhập hệ thống"}
                {!loading && (
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                )}
              </button>

              <div className="mt-6 text-center">
                <a href="#" className="text-xs font-bold text-slate-400 hover:text-purple-600 transition-colors">
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