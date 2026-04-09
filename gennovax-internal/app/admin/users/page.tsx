"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import LoadingOverlay from "@/components/LoadingOverlay";
import {
  Calculator,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  User as UserIcon,
  Users,
  X,
} from "lucide-react";

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

const ROLE_OPTIONS = [
  { label: "Tất cả vai trò", value: "ALL" },
  { label: "Super Admin", value: "super_admin" },
  { label: "Admin", value: "admin" },
  { label: "Kế toán", value: "accounting_admin" },
  { label: "NVKD", value: "sales" },
  { label: "Nhân viên", value: "staff" },
];

function roleLabel(role: string) {
  if (role === "super_admin") return "Super Admin";
  if (role === "admin") return "Admin";
  if (role === "accounting_admin") return "Kế toán";
  if (role === "sales") return "NVKD";
  return "Nhân viên";
}

function roleBadgeTone(role: string) {
  if (role === "super_admin") {
    return "bg-fuchsia-100 text-fuchsia-700 ring-fuchsia-200";
  }
  if (role === "admin") {
    return "bg-rose-100 text-rose-700 ring-rose-200";
  }
  if (role === "accounting_admin") {
    return "bg-amber-50 text-amber-700 ring-amber-200";
  }
  return "bg-sky-50 text-sky-700 ring-sky-200";
}

function roleAvatarTone(role: string) {
  if (role === "super_admin") {
    return "bg-gradient-to-br from-fuchsia-500 to-purple-600";
  }
  if (role === "admin") {
    return "bg-gradient-to-br from-rose-400 to-red-500";
  }
  if (role === "accounting_admin") {
    return "bg-gradient-to-br from-amber-400 to-orange-500";
  }
  return "bg-gradient-to-br from-sky-400 to-cyan-500";
}

function roleIcon(role: string) {
  if (role === "super_admin") return <ShieldAlert className="h-3 w-3" />;
  if (role === "admin") return <ShieldCheck className="h-3 w-3" />;
  if (role === "accounting_admin") return <Calculator className="h-3 w-3" />;
  return <UserIcon className="h-3 w-3" />;
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "staff",
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.usersList();
      let fetchedUsers = res.items || [];

      const roleWeight: Record<string, number> = {
        super_admin: 3,
        admin: 2,
        accounting_admin: 2,
        sales: 1,
        staff: 1,
      };

      const myWeight = roleWeight[user?.role as string] || 0;

      fetchedUsers = fetchedUsers.filter((u: any) => {
        const targetWeight = roleWeight[u.role] || 0;
        return targetWeight <= myWeight;
      });

      fetchedUsers.sort(
        (a: any, b: any) =>
          (roleWeight[b.role] || 0) - (roleWeight[a.role] || 0),
      );

      setUsers(fetchedUsers);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user?.role === "admin" ||
      user?.role === "super_admin" ||
      user?.role === "accounting_admin"
    ) {
      void load();
    }
  }, [user]);

  const canManage = (targetUser: any) => {
    if (user?.id === targetUser._id) return false;
    if (user?.role === "super_admin") return true;

    if (
      (user?.role === "admin" || user?.role === "accounting_admin") &&
      ["staff", "sales"].includes(targetUser.role)
    ) {
      return true;
    }

    return false;
  };

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return users.filter((item) => {
      const matchRole = roleFilter === "ALL" || item.role === roleFilter;
      if (!matchRole) return false;
      if (!keyword) return true;

      return (
        (item.name || "").toLowerCase().includes(keyword) ||
        (item.email || "").toLowerCase().includes(keyword)
      );
    });
  }, [users, search, roleFilter]);

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      role: "staff",
    });
    setIsModalOpen(false);
  };

  const openAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.userCreate(form);
      setIsModalOpen(false);
      await load();
    } catch (e: any) {
      alert(e.message || "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (u: any) => {
    if (u._id === user?.id) return alert("Không thể tự khóa chính mình!");
    if (!canManage(u)) return alert("Bạn không có quyền khóa tài khoản này!");

    try {
      setSaving(true);
      await api.userUpdate(u._id, { isActive: !u.isActive });
      await load();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (u: any) => {
    if (u._id === user?.id) return alert("Không thể tự xóa chính mình!");
    if (!canManage(u)) return alert("Bạn không có quyền xóa tài khoản này!");
    if (
      !window.confirm(
        `Chắc chắn xóa tài khoản: ${u.name}? Hành động này không thể hoàn tác.`,
      )
    ) {
      return;
    }

    try {
      setSaving(true);
      await api.userDelete(u._id);
      await load();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (
    !user ||
    !["admin", "super_admin", "accounting_admin"].includes(user.role)
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-6">
        <div className="text-center">
          <ShieldAlert className="mx-auto mb-3 h-12 w-12 text-rose-500" />
          <h2 className="text-xl font-bold text-neutral-800">Truy cập bị từ chối</h2>
          <p className="mt-1 text-neutral-500">
            Bạn không có quyền truy cập trang quản trị này.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-96px)] bg-[linear-gradient(180deg,#f8fbff_0%,#eef5ff_38%,#ffffff_100%)]">
      {(loading || saving) && <LoadingOverlay isLoading={loading || saving} />}

      <div className="mx-auto max-w-[90%] space-y-6 p-4 sm:p-6">
        <section className="overflow-hidden rounded-[28px] border border-sky-100 bg-white shadow-[0_24px_80px_-48px_rgba(14,116,144,0.45)]">
          <div className="flex flex-col gap-5 bg-[radial-gradient(circle_at_top_left,#e0f2fe_0,#ffffff_50%)] p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-700">
                  Internal
                </span>
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-200">
                  {user.role === "super_admin" ? "Super Admin" : "Admin Area"}
                </span>
              </div>
              <div>
                <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-sky-700 sm:text-3xl">
                  <Users className="h-8 w-8" />
                  Quản lý tài khoản nội bộ
                </h1>

              </div>
            </div>

            <button
              onClick={openAdd}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500"
            >
              <Plus className="h-4 w-4" />
              Thêm user mới
            </button>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.35)] sm:p-6">
          <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">Danh sách tài khoản</div>
              <div className="mt-1 text-xs text-slate-500">
                {loading ? "Đang tải..." : `${filteredUsers.length} tài khoản phù hợp`}
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên hoặc email..."
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100 sm:w-[320px]"
              />

              <button
                onClick={() => void load()}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50 px-4 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
              >
                Tải lại
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-[24px] border border-slate-200">
            <table className="w-full min-w-[980px] text-left text-sm text-slate-600">
              <thead className="bg-slate-50/90 text-xs uppercase tracking-[0.16em] text-slate-500">
                <tr>
                  <th className="px-4 py-4">Họ & tên</th>
                  <th className="px-4 py-4">Email đăng nhập</th>
                  <th className="px-4 py-4 text-center">Vai trò</th>
                  <th className="px-4 py-4 text-center">Trạng thái</th>
                  <th className="px-4 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-400">
                      Không có dữ liệu phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isMe = u._id === user?.id;
                    const hasManagePermission = canManage(u);

                    return (
                      <tr
                        key={u._id}
                        className={cn(
                          "transition hover:bg-sky-50/40",
                          isMe && "bg-sky-50/60",
                        )}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm",
                                roleAvatarTone(u.role),
                              )}
                            >
                              {(u.name || "U").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 font-semibold text-slate-900">
                                {u.name}
                                {isMe && (
                                  <span className="inline-flex rounded-md bg-sky-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-700">
                                    Tôi
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 font-medium text-slate-600">{u.email}</td>

                        <td className="px-4 py-4 text-center">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ring-1",
                              roleBadgeTone(u.role),
                            )}
                          >
                            {roleIcon(u.role)}
                            {roleLabel(u.role)}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-center">
                          <button
                            disabled={!hasManagePermission}
                            onClick={() => void toggleActive(u)}
                            className={cn(
                              "relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none",
                              u.isActive ? "bg-emerald-500" : "bg-slate-300",
                              !hasManagePermission
                                ? "cursor-not-allowed opacity-40 grayscale"
                                : "cursor-pointer hover:shadow-md",
                            )}
                            title={
                              !hasManagePermission
                                ? "Không có quyền khóa/mở"
                                : "Bật/Tắt trạng thái"
                            }
                          >
                            <span
                              className={cn(
                                "inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out",
                                u.isActive ? "translate-x-6" : "translate-x-1",
                              )}
                            />
                          </button>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              disabled={!hasManagePermission}
                              onClick={() => void handleDelete(u)}
                              className={cn(
                                "inline-flex h-9 items-center justify-center rounded-xl px-3 text-xs font-semibold transition",
                                !hasManagePermission
                                  ? "cursor-not-allowed text-slate-300"
                                  : "text-rose-600 hover:bg-rose-50",
                              )}
                              title="Xóa tài khoản"
                            >
                              <Trash2 className="h-4 w-4" />
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
        </section>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_40px_120px_-48px_rgba(15,23,42,0.55)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <div className="text-lg font-semibold text-slate-900">Tạo tài khoản mới</div>
                <div className="mt-1 text-xs text-slate-400">
                  Giữ nguyên logic cấp quyền hiện tại khi tạo user mới.
                </div>
              </div>
              <button
                onClick={resetForm}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 px-6 py-6 md:grid-cols-2">
              <Field
                label="Tên hiển thị"
                value={form.name}
                onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
                placeholder="VD: Nguyễn Văn A"
              />
              <Field
                label="Email đăng nhập"
                value={form.email}
                onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
                placeholder="admin@gennovax.vn"
              />
              <Field
                label="Mật khẩu"
                type="password"
                value={form.password}
                onChange={(value) => setForm((prev) => ({ ...prev, password: value }))}
                placeholder="••••••••"
              />
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Vai trò
                </div>
                <select
                  value={form.role}
                  onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                  disabled={!["super_admin", "admin", "accounting_admin"].includes(user?.role)}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                >
                  <option value="staff">Nhân viên (Staff)</option>
                  <option value="sales">NVKD (Sales)</option>
                  {user?.role === "super_admin" && (
                    <>
                      <option value="admin">Quản trị viên (Admin)</option>
                      <option value="accounting_admin">Kế toán (Accounting Admin)</option>
                      <option value="super_admin">Super Admin</option>
                    </>
                  )}
                </select>
                {user?.role !== "super_admin" && (
                  <p className="mt-1 text-[11px] font-medium text-amber-600">
                    Bạn chỉ có quyền cấp tài khoản Nhân viên hoặc NVKD.
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <button
                onClick={handleSave}
                disabled={!form.name || !form.email || !form.password}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-2xl bg-sky-600 px-4 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Tạo tài khoản
              </button>
              <button
                onClick={resetForm}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {props.label}
      </div>
      <input
        type={props.type || "text"}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
      />
    </div>
  );
}
