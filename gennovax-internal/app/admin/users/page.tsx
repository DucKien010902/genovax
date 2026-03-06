"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Plus, Trash2, ShieldAlert, ShieldCheck, User as UserIcon, X, Calculator } from "lucide-react";

export default function AdminUsersPage() {
  const { user } = useAuth(); // Dùng thông tin user.role để phân quyền chi tiết
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States cho Form Thêm (Bỏ form sửa)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "staff" });

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.usersList();
      let fetchedUsers = res.items || [];

      // 1. Khai báo trọng số phân cấp
      const roleWeight: Record<string, number> = { 
        super_admin: 3, 
        admin: 2, 
        accounting_admin: 2, 
        staff: 1 
      };

      // Lấy trọng số của user đang đăng nhập
      const myWeight = roleWeight[user?.role as string] || 0;

      // 2. LỌC: Bỏ qua những tài khoản có trọng số LỚN HƠN trọng số của mình
      // - Super Admin (3) xem được 3, 2, 1
      // - Admin/Kế toán (2) xem được 2, 1 (không thấy 3)
      fetchedUsers = fetchedUsers.filter((u: any) => {
        const targetWeight = roleWeight[u.role] || 0;
        return targetWeight <= myWeight;
      });

      // 3. Sắp xếp ưu tiên hiển thị từ cao xuống thấp
      fetchedUsers.sort((a: any, b: any) => (roleWeight[b.role] || 0) - (roleWeight[a.role] || 0));

      setUsers(fetchedUsers);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin" || user?.role === "super_admin" || user?.role === "accounting_admin") {
      load();
    }
  }, [user]);

  // --- LOGIC PHÂN QUYỀN ---
  // Kiểm tra xem current user có quyền tác động (Xóa, Khóa/Mở) lên target user không
  const canManage = (targetUser: any) => {
    // Không cho phép tự thao tác lên chính mình (xử lý riêng ở nút click)
    if (user?.id === targetUser._id) return false;

    // Super Admin có quyền làm tất cả với người dưới
    if (user?.role === "super_admin") return true;

    // Admin hoặc Kế toán chỉ có quyền tác động vào nhân viên (staff)
    // Các quyền ngang hàng nhau (Admin và Kế toán) sẽ KHÔNG được quản lý chéo nhau
    if ((user?.role === "admin" || user?.role === "accounting_admin") && targetUser.role === "staff") {
      return true;
    }

    return false;
  };

  const openAdd = () => {
    setForm({ name: "", email: "", password: "", role: "staff" });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      // Chỉ tạo mới, không còn tính năng sửa
      await api.userCreate(form);
      setIsModalOpen(false);
      load();
    } catch (e: any) {
      alert(e.message || "Có lỗi xảy ra");
    }
  };

  const toggleActive = async (u: any) => {
    if (u._id === user?.id) return alert("Không thể tự khóa chính mình!");
    if (!canManage(u)) return alert("Bạn không có quyền khóa tài khoản này!");
    
    try {
      await api.userUpdate(u._id, { isActive: !u.isActive });
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (u: any) => {
    if (u._id === user?.id) return alert("Không thể tự xóa chính mình!");
    if (!canManage(u)) return alert("Bạn không có quyền xóa tài khoản này!");
    if (!window.confirm(`Chắc chắn xóa tài khoản: ${u.name}? Hành động này không thể hoàn tác.`)) return;
    
    try {
      await api.userDelete(u._id);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  // Bảo vệ route: Admin, Kế toán, Super Admin mới được xem
  if (!user || !["admin", "super_admin", "accounting_admin"].includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-6">
        <div className="text-center">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-neutral-800">Truy cập bị từ chối</h2>
          <p className="text-neutral-500 mt-1">Bạn không có quyền truy cập trang quản trị này.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-blue-900 tracking-tight flex items-center gap-2">
              <UserIcon className="w-7 h-7 text-blue-600" />
              Quản lý Tài Khoản
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              {user.role === "super_admin" ? "Toàn quyền quản lý hệ thống." : "Quản lý và cấp quyền cho Nhân viên."}
            </p>
          </div>
          <button 
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:shadow-lg transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Thêm User Mới
          </button>
        </div>

        {/* BẢNG DỮ LIỆU */}
        <div className="rounded-3xl border border-black/5 bg-white shadow-xl shadow-black/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-neutral-50/50 border-b border-black/5 text-neutral-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-4">Họ & Tên</th>
                  <th className="px-6 py-4">Email Đăng nhập</th>
                  <th className="px-6 py-4 text-center">Vai trò</th>
                  <th className="px-6 py-4 text-center">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-neutral-400 font-medium">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                        Đang tải danh sách...
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-neutral-400">Không có dữ liệu</td></tr>
                ) : (
                  users.map(u => {
                    const isMe = u._id === user?.id;
                    const hasManagePermission = canManage(u);
                    
                    return (
                      <tr key={u._id} className={`transition-colors hover:bg-neutral-50/50 ${isMe ? 'bg-indigo-50/30' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ${
                              u.role === 'super_admin' ? 'bg-gradient-to-br from-fuchsia-500 to-purple-600' :
                              u.role === 'admin' ? 'bg-gradient-to-br from-rose-400 to-red-500' :
                              u.role === 'accounting_admin' ? 'bg-gradient-to-br from-amber-400 to-orange-500' :
                              'bg-gradient-to-br from-blue-400 to-indigo-500'
                            }`}>
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="font-bold text-neutral-900 flex items-center gap-2">
                              {u.name}
                              {isMe && (
                                <span className="px-1.5 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] uppercase font-black tracking-wider">
                                  TÔI
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-neutral-600 font-medium">{u.email}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            u.role === 'super_admin' ? 'bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200' : 
                            u.role === 'admin' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 
                            u.role === 'accounting_admin' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-blue-50 text-blue-600 border border-blue-100'
                          }`}>
                            {u.role === 'super_admin' && <ShieldAlert className="w-3 h-3" />}
                            {u.role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                            {u.role === 'accounting_admin' && <Calculator className="w-3 h-3" />}
                            {u.role === 'staff' && <UserIcon className="w-3 h-3" />}
                            {u.role === 'accounting_admin' ? 'Kế Toán' : u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {/* Nút Toggle Switch */}
                          <button 
                            disabled={!hasManagePermission}
                            onClick={() => toggleActive(u)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none ${
                              u.isActive ? 'bg-emerald-500' : 'bg-neutral-300'
                            } ${!hasManagePermission ? 'opacity-40 cursor-not-allowed grayscale' : 'cursor-pointer hover:shadow-md'}`}
                            title={!hasManagePermission ? "Không có quyền khóa/mở" : "Bật/Tắt trạng thái"}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
                              u.isActive ? 'translate-x-6' : 'translate-x-1'
                            }`} />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* ĐÃ BỎ NÚT SỬA */}
                            <button 
                              disabled={!hasManagePermission}
                              onClick={() => handleDelete(u)} 
                              className={`p-2 rounded-xl transition-all ${
                                !hasManagePermission ? 'text-neutral-300 cursor-not-allowed' : 'text-rose-500 hover:bg-rose-50 hover:scale-105'
                              }`}
                              title="Xóa tài khoản"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* POPUP THÊM TÀI KHOẢN (Bỏ trạng thái sửa) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-all">
          <div className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-neutral-900">
                Tạo Tài Khoản Mới
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 bg-neutral-100 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200 rounded-full transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1.5 uppercase tracking-wide">Tên hiển thị</label>
                <input 
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})} 
                  className="w-full rounded-xl border border-black/10 bg-neutral-50 px-4 py-2.5 text-sm font-medium outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                  placeholder="VD: Nguyễn Văn A"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1.5 uppercase tracking-wide">Email đăng nhập</label>
                <input 
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})} 
                  className="w-full rounded-xl border border-black/10 bg-neutral-50 px-4 py-2.5 text-sm font-medium outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                  placeholder="admin@gennovax.vn"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1.5 uppercase tracking-wide">
                  Mật khẩu
                </label>
                <input 
                  type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} 
                  className="w-full rounded-xl border border-black/10 bg-neutral-50 px-4 py-2.5 text-sm font-medium outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1.5 uppercase tracking-wide">Vai trò</label>
                <select 
                  value={form.role} 
                  onChange={e => setForm({...form, role: e.target.value})} 
                  // Khóa chọn role nếu không phải Super Admin
                  disabled={user?.role !== 'super_admin'} 
                  className="w-full rounded-xl border border-black/10 bg-neutral-50 px-4 py-2.5 text-sm font-medium outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed"
                >
                  <option value="staff">Nhân viên (Staff)</option>
                  {/* Chỉ Superadmin mới nhìn thấy và tạo được Admin/Kế toán */}
                  {user?.role === "super_admin" && (
                    <>
                      <option value="admin">Quản trị viên (Admin)</option>
                      <option value="accounting_admin">Kế toán (Accounting Admin)</option>
                      <option value="super_admin">Super Admin</option>
                    </>
                  )}
                </select>
                {user?.role !== 'super_admin' && (
                  <p className="mt-1 text-[11px] text-amber-600 font-medium">
                    * Bạn chỉ có quyền cấp tài khoản Nhân viên.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 rounded-xl bg-neutral-100 py-3 text-sm font-bold text-neutral-600 hover:bg-neutral-200 hover:text-neutral-800 transition-colors">
                Hủy bỏ
              </button>
              <button 
                onClick={handleSave} 
                disabled={!form.name || !form.email || !form.password}
                className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Tạo tài khoản
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}