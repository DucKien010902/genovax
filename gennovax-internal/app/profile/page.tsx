"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // ✅ Quản lý Tab hiện tại trong Modal
  const [activeTab, setActiveTab] = useState<"info" | "password">("info");

  // State thông tin
  const [name, setName] = useState(user?.name || "");
  
  // State mật khẩu
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [msg, setMsg] = useState({ type: "", text: "" });

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-6">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <span className="text-neutral-500 font-medium">Đang tải hồ sơ...</span>
      </div>
    </div>
  );

  // ✅ HÀM LƯU ĐỔI TÊN ĐỘC LẬP
  const handleUpdateName = async () => {
    if (!name.trim()) {
      return setMsg({ type: "error", text: "Tên hiển thị không được để trống." });
    }

    setMsg({ type: "", text: "" });
    setLoading(true);
    try {
      await api.updateProfile({ name });
      setMsg({ type: "success", text: "Cập nhật tên thành công! Đang tải lại..." });
      setTimeout(() => window.location.reload(), 1000);
    } catch (e: any) {
      setMsg({ type: "error", text: e.message });
    } finally {
      setLoading(false);
    }
  };

  // ✅ HÀM LƯU ĐỔI MẬT KHẨU ĐỘC LẬP
  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return setMsg({ type: "error", text: "Vui lòng điền đầy đủ các trường mật khẩu." });
    }
    if (newPassword.length < 6) {
      return setMsg({ type: "error", text: "Mật khẩu mới phải có tối thiểu 6 ký tự." });
    }
    if (newPassword === oldPassword) {
      return setMsg({ type: "error", text: "Mật khẩu mới không được trùng với mật khẩu cũ!" });
    }
    if (newPassword !== confirmPassword) {
      return setMsg({ type: "error", text: "Mật khẩu xác nhận không khớp!" });
    }

    setMsg({ type: "", text: "" });
    setLoading(true);
    try {
      // Gọi API chỉ gửi mật khẩu (giữ nguyên tên cũ)
      await api.updateProfile({ name: user.name, oldPassword, newPassword });
      
      setMsg({ type: "success", text: "Đổi mật khẩu thành công! Đang đăng xuất..." });
      setTimeout(() => logout(), 1000);
    } catch (e: any) {
      setMsg({ type: "error", text: e.message });
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setIsEditing(false);
    setMsg({ type: "", text: "" });
    setName(user?.name || "");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowOldPw(false);
    setShowNewPw(false);
    setShowConfirmPw(false);
    setActiveTab("info"); // Reset về tab info
  };

  // SVG Icons
  const EyeIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
  const EyeOffIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>;

  return (
    <div className="min-h-[90vh] bg-neutral-200 p-6 flex items-center justify-center">
      
      {/* --- THẺ THÔNG TIN CHÍNH --- */}
      <div className="w-full max-w-md rounded-3xl border border-black/5 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-fuchsia-500/10 blur-3xl rounded-full" />
        
        <div className="relative z-10 flex flex-col items-center text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center text-3xl font-bold text-white shadow-xl ring-4 ring-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="mt-5 text-2xl font-bold text-neutral-900">{user.name}</h2>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 uppercase tracking-widest">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {user.role}
          </span>
          <p className="mt-2 text-sm text-neutral-500 font-medium">{user.email}</p>
        </div>

        <div className="space-y-3 relative z-10">
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center gap-2 w-full rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            Chỉnh sửa Hồ Sơ & Mật Khẩu
          </button>
          <button 
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full rounded-2xl bg-rose-50 py-3.5 text-sm font-bold text-rose-600 hover:bg-rose-100 transition-all active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Đăng xuất
          </button>
        </div>
      </div>

      {/* --- POPUP SỬA THÔNG TIN (Dạng Tabs) --- */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all duration-300">
          <div className="w-full max-w-[30vw] min-w-[340px] rounded-3xl bg-white p-7 shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-neutral-900">Cập nhật tài khoản</h3>
              <button onClick={closePopup} className="text-neutral-400 hover:text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-full p-1.5 transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* ✅ CHUYỂN ĐỔI TAB */}
            <div className="flex gap-4 border-b border-black/10 mb-5 mt-4">
              <button 
                onClick={() => { setActiveTab("info"); setMsg({type: "", text: ""}); }}
                className={`pb-2 text-sm font-bold transition-colors ${activeTab === "info" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-neutral-400 hover:text-neutral-700"}`}
              >
                Thông tin cá nhân
              </button>
              <button 
                onClick={() => { setActiveTab("password"); setMsg({type: "", text: ""}); }}
                className={`pb-2 text-sm font-bold transition-colors ${activeTab === "password" ? "border-b-2 border-indigo-600 text-indigo-600" : "text-neutral-400 hover:text-neutral-700"}`}
              >
                Đổi mật khẩu
              </button>
            </div>
            
            {/* Hiển thị thông báo */}
            {msg.text && (
              <div className={`mb-5 p-3.5 rounded-xl text-sm font-semibold flex items-start gap-2 ${msg.type === "error" ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>
                {msg.type === "error" 
                  ? <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  : <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                }
                <span>{msg.text}</span>
              </div>
            )}

            {/* ✅ NỘI DUNG TAB 1: THÔNG TIN */}
            {activeTab === "info" && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-300">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 mb-1.5 uppercase tracking-wide">
                    Tên hiển thị
                  </label>
                  <input 
                    value={name} onChange={e => setName(e.target.value)}
                    className="w-full rounded-xl border border-black/10 bg-neutral-50 px-4 py-2.5 text-sm font-medium outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button onClick={closePopup} className="flex-1 rounded-xl bg-neutral-100 py-3 text-sm font-bold text-neutral-600 hover:bg-neutral-200 transition-colors">
                    Hủy
                  </button>
                  <button 
                    onClick={handleUpdateName} disabled={loading || name === user.name}
                    className="flex-[2] flex justify-center items-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? "Đang lưu..." : "Lưu tên mới"}
                  </button>
                </div>
              </div>
            )}

            {/* ✅ NỘI DUNG TAB 2: MẬT KHẨU */}
            {activeTab === "password" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Mật khẩu hiện tại</label>
                  <div className="relative">
                    <input 
                      type={showOldPw ? "text" : "password"} placeholder="••••••••"
                      value={oldPassword} onChange={e => setOldPassword(e.target.value)}
                      className="w-full rounded-xl border border-black/10 bg-neutral-50 pl-4 pr-10 py-2.5 text-sm font-medium outline-none focus:bg-white focus:border-neutral-400 focus:ring-4 focus:ring-neutral-400/10 transition-all"
                    />
                    <button type="button" onClick={() => setShowOldPw(!showOldPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1">
                      {showOldPw ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Mật khẩu mới (Tối thiểu 6 ký tự)</label>
                  <div className="relative">
                    <input 
                      type={showNewPw ? "text" : "password"} placeholder="••••••••"
                      value={newPassword} onChange={e => setNewPassword(e.target.value)}
                      className="w-full rounded-xl border border-black/10 bg-neutral-50 pl-4 pr-10 py-2.5 text-sm font-medium outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                    <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1">
                      {showNewPw ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-500 mb-1.5">Nhập lại mật khẩu mới</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPw ? "text" : "password"} placeholder="••••••••"
                      value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full rounded-xl border border-black/10 bg-neutral-50 pl-4 pr-10 py-2.5 text-sm font-medium outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    />
                    <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-1">
                      {showConfirmPw ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div className="pt-3 flex gap-3">
                  <button onClick={closePopup} className="flex-1 rounded-xl bg-neutral-100 py-3 text-sm font-bold text-neutral-600 hover:bg-neutral-200 transition-colors">
                    Hủy
                  </button>
                  <button 
                    onClick={handleUpdatePassword} disabled={loading || !oldPassword || !newPassword || !confirmPassword}
                    className="flex-[2] flex justify-center items-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}