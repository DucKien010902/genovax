"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState(user?.name || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  
  const [msg, setMsg] = useState({ type: "", text: "" });

  if (!user) return <div className="p-6">Đang tải...</div>;

  const handleSave = async () => {
    setMsg({ type: "", text: "" });
    setLoading(true);
    try {
      if (newPassword && !oldPassword) {
        throw new Error("Vui lòng nhập mật khẩu cũ để đổi mật khẩu mới.");
      }
      
      await api.updateProfile({ 
        name, 
        ...(newPassword ? { oldPassword, newPassword } : {}) 
      });
      
      setMsg({ type: "success", text: "Cập nhật hồ sơ thành công! Vui lòng tải lại trang." });
      setTimeout(() => window.location.reload(), 1500);
    } catch (e: any) {
      setMsg({ type: "error", text: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-md rounded-3xl border border-black/10 bg-white p-8 shadow-xl relative overflow-hidden">
        {/* Decor background */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full" />
        
        <div className="relative z-10 flex flex-col items-center text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg ring-4 ring-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-neutral-900">{user.name}</h2>
          <span className="mt-1 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 uppercase tracking-widest">
            {user.role}
          </span>
          <p className="mt-2 text-sm text-neutral-500">{user.email}</p>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => setIsEditing(true)}
            className="w-full rounded-2xl bg-neutral-900 py-3 text-sm font-bold text-white shadow-sm hover:bg-neutral-800 transition"
          >
            Chỉnh sửa Hồ Sơ & Mật Khẩu
          </button>
          <button 
            onClick={logout}
            className="w-full rounded-2xl bg-rose-50 py-3 text-sm font-bold text-rose-600 shadow-sm hover:bg-rose-100 transition"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {/* POPUP SỬA THÔNG TIN */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Cập nhật hồ sơ</h3>
            
            {msg.text && (
              <div className={`mb-4 p-3 rounded-xl text-sm font-semibold ${msg.type === "error" ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>
                {msg.text}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">Tên hiển thị</label>
                <input 
                  value={name} onChange={e => setName(e.target.value)}
                  className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              
              <div className="border-t border-black/5 my-2 pt-2">
                <label className="block text-[11px] font-bold text-indigo-600 uppercase mb-3">Đổi mật khẩu (Bỏ trống nếu không đổi)</label>
                <div className="space-y-3">
                  <input 
                    type="password" placeholder="Mật khẩu cũ"
                    value={oldPassword} onChange={e => setOldPassword(e.target.value)}
                    className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-300"
                  />
                  <input 
                    type="password" placeholder="Mật khẩu mới"
                    value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button 
                onClick={() => { setIsEditing(false); setMsg({type:"", text:""}) }}
                className="flex-1 rounded-xl bg-neutral-100 py-2 text-sm font-bold text-neutral-700 hover:bg-neutral-200"
              >
                Hủy
              </button>
              <button 
                onClick={handleSave} disabled={loading}
                className="flex-1 rounded-xl bg-indigo-600 py-2 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}