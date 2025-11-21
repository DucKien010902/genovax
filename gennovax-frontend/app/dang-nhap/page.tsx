"use client";

import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// Màu thương hiệu chính của GenLive
const PRIMARY_COLOR = "#2066b6ff";
const PRIMARY_COLOR_HOVER = "#162da0ff"; // Màu đậm hơn khi hover

// --- Component Logo GenLive ---
// (Mình tạo một logo SVG đơn giản để bạn có thể dùng ngay)
const GenLiveLogo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    width="200"
    height="50"
    viewBox="0 0 200 50"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>GenLive Logo</title>
    {/* Phần chữ "Gen" */}
    <text
      x="10"
      y="38"
      fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
      fontSize="36"
      fontWeight="bold"
      fill="#1F2937" // Màu xám đậm
    >
      Gen
    </text>
    {/* Phần chữ "Live" với màu thương hiệu */}
    <text
      x="80"
      y="38"
      fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
      fontSize="36"
      fontWeight="bold"
      fill={PRIMARY_COLOR} // Màu đỏ thương hiệu
    >
      novaX
    </text>
    {/* Biểu tượng "play" nhỏ */}
  </svg>
);

// --- Component Trang Đăng Nhập Chính ---

export default function LoginPage() {
  // State cho các trường input
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // State để ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Xử lý sự kiện submit form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Đăng nhập với:", { email, password });

    // Giả lập một cuộc gọi API
    setTimeout(() => {
      setIsLoading(false);
      // Xử lý logic đăng nhập...
      if (email == "admin@gmail.com" && password == "123456") {
        sessionStorage.setItem("auth", "true");
        router.push("/tai-lieu/khoa-hoc-edu");
      } else {
        alert("Tài khoản hoặc mật khẩu không chính xác");
      }
    }, 500);
  };

  // Toggle ẩn/hiện mật khẩu
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        {/* Box chứa nội dung */}
        <div className="w-full rounded-2xl bg-white p-8 shadow-2xl md:p-12">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <GenLiveLogo />
          </div>

          <h1 className="mb-4 text-center text-3xl font-bold text-gray-800">
            Đăng nhập
          </h1>
          <p className="mb-8 text-center text-sm text-gray-500">
            Chào mừng trở lại! Vui lòng nhập thông tin của bạn.
          </p>

          {/* Form đăng nhập */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Trường Email */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email hoặc Tên đăng nhập"
                className="w-full rounded-lg border border-gray-300 p-3 pl-10 text-gray-900 shadow-sm transition-colors duration-200 focus:border-transparent focus:outline-none focus:ring-2"
                style={
                  {
                    // Thêm style focus riêng cho màu thương hiệu
                    "--tw-ring-color": PRIMARY_COLOR,
                  } as React.CSSProperties
                }
              />
            </div>

            {/* Trường Mật khẩu */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Mật khẩu"
                className="w-full rounded-lg border border-gray-300 p-3 pl-10 text-gray-900 shadow-sm transition-colors duration-200 focus:border-transparent focus:outline-none focus:ring-2"
                style={
                  {
                    // Thêm style focus riêng cho màu thương hiệu
                    "--tw-ring-color": PRIMARY_COLOR,
                  } as React.CSSProperties
                }
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Quên mật khẩu */}
            <div className="text-right">
              <a
                href="#"
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: PRIMARY_COLOR, textDecoration: "none" }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.color = PRIMARY_COLOR_HOVER)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.color = PRIMARY_COLOR)
                }
              >
                Quên mật khẩu?
              </a>
            </div>

            {/* Nút Đăng nhập */}
            <button
              type="submit"
              // onClick={()=>{router.push('/')}}
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-lg px-4 py-3.5 text-base font-semibold text-white shadow-md transition-all duration-300 ease-in-out"
              style={{
                backgroundColor: isLoading ? "#ef4444" : PRIMARY_COLOR,
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = isLoading
                  ? "#ef4444"
                  : PRIMARY_COLOR_HOVER)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = isLoading
                  ? "#ef4444"
                  : PRIMARY_COLOR)
              }
            >
              {isLoading ? (
                // Hiệu ứng loading
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <>
                  <span>Đăng nhập</span>
                  <ArrowRight className="absolute right-4 h-5 w-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </>
              )}
            </button>
          </form>

          {/* Link Đăng ký */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Chưa có tài khoản?{" "}
            <a
              href="#"
              className="font-medium transition-colors duration-200"
              style={{ color: PRIMARY_COLOR, textDecoration: "none" }}
              onMouseOver={(e) =>
                (e.currentTarget.style.color = PRIMARY_COLOR_HOVER)
              }
              onMouseOut={(e) => (e.currentTarget.style.color = PRIMARY_COLOR)}
            >
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
