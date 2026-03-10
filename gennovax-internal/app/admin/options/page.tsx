"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import LoadingOverlay from "@/components/LoadingOverlay";

type OptionItem = {
  label: string;
  value: string;
  isActive?: boolean;
  order?: number;
};
// ✅ Đã thêm thuộc tính name vào Type
type OptionDoc = {
  _id: string;
  key: string;
  name?: string;
  items: OptionItem[];
};

function cn(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

function keyTone(active: boolean) {
  return active
    ? "bg-gradient-to-r from-indigo-50 to-fuchsia-50 ring-1 ring-indigo-200"
    : "bg-white ring-1 ring-black/10 hover:bg-neutral-50";
}

function activePill(on: boolean) {
  return on
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
    : "bg-rose-50 text-rose-700 ring-rose-200";
}

export default function AdminOptionsPage() {
  const { user, isAdmin } = useAuth();

  const [docs, setDocs] = useState<OptionDoc[]>([]);
  const [activeKey, setActiveKey] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const active = useMemo(
    () => docs.find((d) => d.key === activeKey) || null,
    [docs, activeKey],
  );

  const load = async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await api.optionsAdminList();
      setDocs(res.items as any);
      setActiveKey((prev) => prev || (res.items?.[0]?.key ?? ""));
    } catch (e: any) {
      setErr(e?.message || "Load failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Form State tạo Key mới
  const [newKey, setNewKey] = useState("");
  const [newName, setNewName] = useState("");

  // State cập nhật tên Key
  const [editName, setEditName] = useState("");

  // Đồng bộ tên của Key đang chọn vào input sửa
  useEffect(() => {
    if (active) setEditName(active.name || active.key);
  }, [active]);

  const [newItem, setNewItem] = useState<OptionItem>({
    label: "",
    value: "",
    order: 0,
    isActive: true,
  });

  // ✅ Hàm tạo Key mới chuẩn xác
  const addKey = async () => {
    setErr(null);
    try {
      if (!isAdmin) throw new Error("Chỉ admin được phép.");
      const k = newKey.trim();
      const n = newName.trim();
      if (!k || !n) throw new Error("Cần nhập cả Key và Tên hiển thị");

      await api.optionsAdminCreateKey({ key: k, name: n });

      setNewKey("");
      setNewName("");
      await load();
      setActiveKey(k);
    } catch (e: any) {
      setErr(e?.message || "Tạo danh mục thất bại");
    }
  };

  // ✅ Hàm sửa tên Key
  const updateKeyName = async () => {
    setErr(null);
    try {
      if (!isAdmin) throw new Error("Chỉ admin được phép.");
      if (!activeKey) return;
      const n = editName.trim();
      if (!n) throw new Error("Tên không được để trống");

      await api.optionsAdminUpdateKey(activeKey, n);
      alert("Đã cập nhật tên thành công!");
      await load();
    } catch (e: any) {
      setErr(e?.message || "Cập nhật tên thất bại");
    }
  };

  const addItem = async () => {
    setErr(null);
    try {
      if (!isAdmin) throw new Error("Chỉ admin được phép.");
      if (!activeKey) throw new Error("Chọn danh mục trước");
      if (!newItem.label.trim() || !newItem.value.trim())
        throw new Error("Cần nhập Nhãn và Giá trị (value)");

      await api.optionsAdminAddItem(activeKey, {
        label: newItem.label.trim(),
        value: newItem.value.trim(),
        order: Number(newItem.order || 0),
        isActive: newItem.isActive !== false,
      });

      setNewItem({ label: "", value: "", order: 0, isActive: true });
      await load();
    } catch (e: any) {
      setErr(e?.message || "Thêm item thất bại");
    }
  };

  const patchItem = async (value: string, patch: Partial<OptionItem>) => {
    setErr(null);
    try {
      if (!isAdmin) throw new Error("Chỉ admin được phép.");
      await api.optionsAdminPatchItem(activeKey, value, patch);
      await load();
    } catch (e: any) {
      setErr(e?.message || "Update item failed");
    }
  };

  const delItem = async (value: string) => {
    setErr(null);
    try {
      if (!isAdmin) throw new Error("Chỉ admin được phép.");
      await api.optionsAdminDeleteItem(activeKey, value);
      await load();
    } catch (e: any) {
      setErr(e?.message || "Delete item failed");
    }
  };

  const delKey = async () => {
    setErr(null);
    try {
      if (!isAdmin) throw new Error("Chỉ admin được phép.");
      if (!activeKey) return;
      const ok = window.confirm(
        `Bạn có chắc muốn xóa toàn bộ danh mục "${active?.name}" không?`,
      );
      if (!ok) return;

      await api.optionsAdminDeleteKey(activeKey);
      setActiveKey("");
      await load();
    } catch (e: any) {
      setErr(e?.message || "Delete key failed");
    }
  };

  if (!user) return <div className="p-6">Bạn chưa đăng nhập.</div>;

  return (
    <div className="min-h-[calc(100vh-96px)] bg-gradient-to-b from-neutral-50 to-white">
      {loading && <LoadingOverlay isLoading={loading}/>}
      <div className="mx-auto max-w-[1400px] p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold tracking-tight text-neutral-900">
                  Quản lý Options
                </div>
                {isAdmin ? (
                  <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
                    Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600 ring-1 ring-black/5">
                    Read-only
                  </span>
                )}
              </div>
              {/* <div className="mt-1 text-sm text-neutral-600">
                CRUD Option keys & items • Quản lý các danh mục dropdown thả xuống
              </div> */}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={load}
                className="rounded-2xl bg-blue-900 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-neutral-800 active:scale-[0.99]"
              >
                Tải lại
              </button>
            </div>
          </div>

          {err && (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {err}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* CỘT TRÁI: DANH SÁCH KEYS */}
          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-neutral-900">
                  Các Danh Mục
                </div>
                <div className="mt-1 text-xs text-neutral-500">
                  {loading ? "Đang tải…" : `${docs.length} danh mục`}
                </div>
              </div>
              <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700 ring-1 ring-black/5">
                Meta
              </span>
            </div>

            {/* Tạo danh mục mới */}
            <div className="mt-4 rounded-3xl border border-black/10 bg-neutral-50 p-3">
              <div className="text-sm font-bold text-neutral-900 mb-2">
                Tạo danh mục mới
              </div>
              <div className="flex flex-col gap-2">
                <input
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="Mã Key (vd: labs, sources)"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:ring-4 focus:ring-indigo-200"
                />
                <div className="flex gap-2">
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Tên hiển thị (vd: Nguồn khách)"
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:ring-4 focus:ring-indigo-200"
                  />
                  <button
                    onClick={addKey}
                    className="rounded-2xl bg-blue-900 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-neutral-800 active:scale-[0.99]"
                    title="Tạo"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* List danh mục */}
            <div className="mt-4 space-y-2">
              {loading ? (
                <div className="text-sm text-neutral-600">Đang tải...</div>
              ) : docs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-black/10 bg-neutral-50 p-5 text-sm text-neutral-600">
                  Chưa có dữ liệu
                </div>
              ) : (
                docs.map((d) => {
                  const is = d.key === activeKey;
                  return (
                    <button
                      key={d.key}
                      onClick={() => {
                        setActiveKey(d.key);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={cn(
                        "w-full rounded-3xl px-4 py-3 text-left transition",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60",
                        keyTone(is),
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          {/* ✅ ƯU TIÊN HIỂN THỊ TÊN */}
                          <div className="truncate text-[15px] font-bold text-neutral-900">
                            {d.name || d.key}
                          </div>
                          {/* ✅ MÃ KEY CHỮ NHỎ */}
                          <div className="mt-1 text-[11px] text-neutral-500 font-mono">
                            Mã: {d.key} • {d.items?.length || 0} items
                          </div>
                        </div>

                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ring-1",
                            is
                              ? "bg-indigo-100 text-indigo-700 ring-indigo-200"
                              : "bg-neutral-100 text-neutral-600 ring-black/5",
                          )}
                        >
                          {is ? "Đang mở" : "Mở"}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            <div className="mt-4">
              <button
                onClick={delKey}
                disabled={!activeKey}
                className="w-full cursor-pointer rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-rose-500 disabled:opacity-50"
              >
                Xóa toàn bộ danh mục này
              </button>
            </div>
          </div>

          {/* CỘT PHẢI: ITEMS & SỬA TÊN DANH MỤC */}
          <div className="lg:col-span-2 rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
              <div>
                <div className="text-lg font-bold text-neutral-900">
                  Giá trị lựa chọn
                </div>
                <div className="mt-1 text-xs text-neutral-500">
                  {active?.items?.length ?? 0} items • sort theo order tăng dần
                </div>
              </div>

              {/* Khu vực sửa tên Danh mục */}
              {activeKey && (
                <div className="flex items-center gap-2 rounded-2xl border border-indigo-100 bg-indigo-50 p-2 shadow-sm">
                  <span className="text-[11px] font-bold text-indigo-700 ml-2">
                    Đổi tên:
                  </span>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-[180px] rounded-xl border border-black/10 bg-white px-3 py-1.5 text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                  <button
                    onClick={updateKeyName}
                    className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm"
                  >
                    Lưu
                  </button>
                </div>
              )}
            </div>

            {/* Add item form */}
            <div className="mt-2 rounded-3xl border border-black/10 bg-neutral-50 p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-bold text-neutral-900">
                    Thêm lựa chọn con
                  </div>
                </div>
                <label className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 ring-1 ring-black/10 shadow-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newItem.isActive !== false}
                    onChange={(e) =>
                      setNewItem((p) => ({ ...p, isActive: e.target.checked }))
                    }
                    className="h-4 w-4 accent-indigo-600 cursor-pointer"
                  />
                  Cho phép hiển thị
                </label>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-4">
                <input
                  value={newItem.label}
                  onChange={(e) =>
                    setNewItem((p) => ({ ...p, label: e.target.value }))
                  }
                  placeholder="Tên: (vd: Cấp 1)"
                  className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-4 focus:ring-indigo-200"
                />
                <input
                  value={newItem.value}
                  onChange={(e) =>
                    setNewItem((p) => ({ ...p, value: e.target.value }))
                  }
                  placeholder="Giá trị: (vd: cap1)"
                  className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-4 focus:ring-indigo-200 font-mono"
                />
                {/* <input
                  value={String(newItem.order || 0)}
                  onChange={(e) =>
                    setNewItem((p) => ({
                      ...p,
                      order: Number(e.target.value || 0),
                    }))
                  }
                  placeholder="Thứ tự (0,1,2...)"
                  inputMode="numeric"
                  className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-4 focus:ring-indigo-200"
                /> */}

                <button
                  onClick={addItem}
                  disabled={!activeKey}
                  className="rounded-2xl bg-blue-900 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-neutral-800 disabled:opacity-50 active:scale-[0.99]"
                >
                  + Thêm
                </button>
              </div>
            </div>

            {/* Items list rendering... (Giữ y hệt cấu trúc gốc của bạn) */}
            <div className="mt-4 space-y-3">
              {loading ? (
                <SkeletonList />
              ) : !activeKey ? (
                <div className="rounded-2xl border border-dashed border-black/10 bg-neutral-50 p-6 text-sm text-neutral-600 text-center">
                  Hãy chọn 1 danh mục ở cột bên trái để quản lý lựa chọn.
                </div>
              ) : (active?.items || []).length === 0 ? (
                <div className="rounded-2xl border border-dashed border-black/10 bg-neutral-50 p-6 text-sm text-neutral-600 text-center">
                  Danh mục này chưa có lựa chọn nào. Hãy thêm ở form trên.
                </div>
              ) : (
                (active?.items || [])
                  .slice()
                  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                  .map((it) => {
                    const on = it.isActive !== false;
                    return (
                      <div
                        key={it.value}
                        className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm transition hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="truncate text-base font-bold text-neutral-900">
                                {it.label}
                              </div>
                              <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-700 ring-1 ring-black/5 font-mono">
                                {it.value}
                              </span>
                              {/* <span
                                className={cn(
                                  "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ring-1",
                                  activePill(on),
                                )}
                              >
                                {on ? "Đang bật" : "Đã tắt"}
                              </span> */}
                              {/* <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-200">
                                Thứ tự {it.order ?? 0}
                              </span> */}
                            </div>
                          </div>

                          <div className="flex shrink-0 gap-2">
                            {/* <button
                              onClick={() =>
                                patchItem(it.value, {
                                  isActive: !(it.isActive !== false),
                                })
                              }
                              className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-xs font-bold text-neutral-900 shadow-sm hover:bg-neutral-50"
                            >
                              Bật/Tắt
                            </button> */}
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(`Xóa lựa chọn "${it.label}"?`)
                                ) {
                                  delItem(it.value);
                                }
                              }}
                              className="rounded-2xl cursor-pointer bg-rose-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-500 active:scale-[0.99]"
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-3xl border border-black/10 bg-white p-4"
        >
          <div className="h-4 w-2/3 rounded bg-neutral-100" />
          <div className="mt-3 h-3 w-1/3 rounded bg-neutral-100" />
        </div>
      ))}
    </div>
  );
}
