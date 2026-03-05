"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function AdminUsersPage() {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States cho Form Thêm/Sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "staff" });

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.usersList();
      setUsers(res.items);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const openAdd = () => {
    setEditingUser(null);
    setForm({ name: "", email: "", password: "", role: "staff" });
    setIsModalOpen(true);
  };

  const openEdit = (u: any) => {
    setEditingUser(u);
    setForm({ name: u.name, email: u.email, password: "", role: u.role });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingUser) {
        // Cập nhật
        await api.userUpdate(editingUser._id, {
          name: form.name,
          role: form.role,
          ...(form.password ? { newPassword: form.password } : {})
        });
      } else {
        // Tạo mới
        await api.userCreate(form);
      }
      setIsModalOpen(false);
      load();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const toggleActive = async (u: any) => {
    if (u._id === user?.id) return alert("Không thể tự khóa chính mình!");
    try {
      await api.userUpdate(u._id, { isActive: !u.isActive });
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (u: any) => {
    if (u._id === user?.id) return alert("Không thể tự xóa chính mình!");
    if (!window.confirm(`Chắc chắn xóa user: ${u.name}?`)) return;
    try {
      await api.userDelete(u._id);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  if (!isAdmin) return <div className="p-6">Bạn không có quyền truy cập trang này.</div>;

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-900">Quản lý Tài Khoản</h1>
            <p className="text-sm text-neutral-500">Tạo, sửa, khóa hoặc xóa tài khoản Staff/Admin</p>
          </div>
          <button 
            onClick={openAdd}
            className="rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-4 py-2 text-sm font-bold text-white shadow-md hover:opacity-90"
          >
            + Thêm User Mới
          </button>
        </div>

        <div className="rounded-3xl border border-black/5 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 border-b border-black/5 text-neutral-500 font-semibold">
              <tr>
                <th className="px-4 py-3">Họ & Tên</th>
                <th className="px-4 py-3">Email / Đăng nhập</th>
                <th className="px-4 py-3 text-center">Vai trò</th>
                <th className="px-4 py-3 text-center">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {loading ? (
                <tr><td colSpan={5} className="p-6 text-center text-neutral-500">Đang tải...</td></tr>
              ) : users.map(u => (
                <tr key={u._id} className="hover:bg-neutral-50/50">
                  <td className="px-4 py-3 font-bold text-neutral-900">{u.name}</td>
                  <td className="px-4 py-3 text-neutral-600">{u.email}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      u.role === 'admin' || u.role === 'superadmin' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button 
                      onClick={() => toggleActive(u)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${u.isActive ? 'bg-emerald-500' : 'bg-neutral-300'}`}
                    >
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${u.isActive ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(u)} className="text-indigo-600 font-bold hover:underline mr-3 text-[13px]">Sửa</button>
                    <button onClick={() => handleDelete(u)} className="text-rose-600 font-bold hover:underline text-[13px]">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* POPUP THÊM/SỬA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">{editingUser ? "Sửa User" : "Tạo User Mới"}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">Tên hiển thị</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">Email đăng nhập</label>
                <input value={form.email} disabled={!!editingUser} onChange={e => setForm({...form, email: e.target.value})} className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none disabled:bg-neutral-100 disabled:text-neutral-400" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">
                  Mật khẩu {editingUser && "(Để trống nếu không muốn đổi)"}
                </label>
                <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-500 mb-1">Vai trò</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
                  <option value="staff">Nhân viên (Staff)</option>
                  <option value="admin">Quản trị viên (Admin)</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 rounded-xl bg-neutral-100 py-2 text-sm font-bold text-neutral-700 hover:bg-neutral-200">Hủy</button>
              <button onClick={handleSave} className="flex-1 rounded-xl bg-indigo-600 py-2 text-sm font-bold text-white hover:bg-indigo-700">Lưu</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}