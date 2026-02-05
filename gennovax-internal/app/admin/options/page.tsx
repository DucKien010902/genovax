"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type OptionItem = {
  label: string;
  value: string;
  isActive?: boolean;
  order?: number;
};
type OptionDoc = { _id: string; key: string; items: OptionItem[] };

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
    [docs, activeKey]
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

  const [newKey, setNewKey] = useState("");
  const [newItem, setNewItem] = useState<OptionItem>({
    label: "",
    value: "",
    order: 0,
    isActive: true,
  });

  const addKey = async () => {
    setErr(null);
    try {
      if (!isAdmin) throw new Error("Chỉ admin được phép.");
      const k = newKey.trim();
      if (!k) throw new Error("key required");

      await api.optionsAdminAddItem(k, {
        label: "New item",
        value: "new_value",
        order: 0,
        isActive: true,
      });

      setNewKey("");
      await load();
      setActiveKey(k);
    } catch (e: any) {
      setErr(e?.message || "Create key failed");
    }
  };

  const addItem = async () => {
    setErr(null);
    try {
      if (!isAdmin) throw new Error("Chỉ admin được phép.");
      if (!activeKey) throw new Error("Chọn key trước");
      if (!newItem.label.trim() || !newItem.value.trim())
        throw new Error("label/value required");

      await api.optionsAdminAddItem(activeKey, {
        label: newItem.label.trim(),
        value: newItem.value.trim(),
        order: Number(newItem.order || 0),
        isActive: newItem.isActive !== false,
      });

      setNewItem({ label: "", value: "", order: 0, isActive: true });
      await load();
    } catch (e: any) {
      setErr(e?.message || "Add item failed");
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
              <div className="mt-1 text-sm text-neutral-600">
                CRUD Option keys & items • Danh mục lựa chọn (meta)
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={load}
                className="rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-neutral-800 active:scale-[0.99]"
              >
                Reload
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
          {/* Keys */}
          <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-neutral-900">Keys</div>
                <div className="mt-1 text-xs text-neutral-500">
                  {loading ? "Đang tải…" : `${docs.length} keys`}
                </div>
              </div>
              <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-700 ring-1 ring-black/5">
                Meta
              </span>
            </div>

            {/* Add key */}
            <div className="mt-4 rounded-3xl border border-black/10 bg-neutral-50 p-3">
              <div className="text-sm font-bold text-neutral-900">Tạo key mới</div>
              <div className="mt-2 flex gap-2">
                <input
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="vd: labs, sources..."
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-2 text-sm shadow-sm outline-none focus:ring-4 focus:ring-indigo-200"
                />
                <button
                  onClick={addKey}
                  className="rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-neutral-800 active:scale-[0.99]"
                  title="Tạo key"
                >
                  +
                </button>
              </div>
              <div className="mt-2 text-xs text-neutral-500">
                Tip: key dùng cho dropdown / meta trên form.
              </div>
            </div>

            {/* Key list */}
            <div className="mt-4 space-y-2">
              {loading ? (
                <div className="text-sm text-neutral-600">Đang tải...</div>
              ) : docs.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-black/10 bg-neutral-50 p-5 text-sm text-neutral-600">
                  Chưa có key
                </div>
              ) : (
                docs.map((d) => {
                  const is = d.key === activeKey;
                  return (
                    <button
                      key={d.key}
                      onClick={() => setActiveKey(d.key)}
                      className={cn(
                        "w-full rounded-3xl px-4 py-3 text-left transition",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 focus-visible:ring-offset-2",
                        keyTone(is)
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-bold text-neutral-900">
                            {d.key}
                          </div>
                          <div className="mt-1 text-xs text-neutral-500">
                            {d.items?.length || 0} items
                          </div>
                        </div>

                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ring-1",
                            is
                              ? "bg-indigo-100 text-indigo-700 ring-indigo-200"
                              : "bg-neutral-100 text-neutral-600 ring-black/5"
                          )}
                        >
                          {is ? "Selected" : "Pick"}
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
                className="w-full rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-rose-500 disabled:opacity-50"
              >
                Xóa key đang chọn
              </button>
            </div>
          </div>

          {/* Items */}
          <div className="lg:col-span-2 rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm font-bold text-neutral-900">
                  Items{" "}
                  <span className="text-indigo-700">
                    {activeKey ? `• ${activeKey}` : "• —"}
                  </span>
                </div>
                <div className="mt-1 text-xs text-neutral-500">
                  {(active?.items?.length ?? 0)} items • sort theo order tăng dần
                </div>
              </div>

              {activeKey ? (
                <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
                  Editing key
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600 ring-1 ring-black/5">
                  Chọn key
                </span>
              )}
            </div>

            {/* Add item */}
            <div className="mt-4 rounded-3xl border border-black/10 bg-neutral-50 p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-sm font-bold text-neutral-900">Thêm item</div>
                  <div className="text-xs text-neutral-500">
                    label hiển thị • value lưu DB • order để sắp xếp
                  </div>
                </div>

                <label className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 ring-1 ring-black/10 shadow-sm">
                  <input
                    type="checkbox"
                    checked={newItem.isActive !== false}
                    onChange={(e) =>
                      setNewItem((p) => ({ ...p, isActive: e.target.checked }))
                    }
                    className="h-4 w-4 accent-indigo-600"
                  />
                  isActive
                </label>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-4">
                <input
                  value={newItem.label}
                  onChange={(e) =>
                    setNewItem((p) => ({ ...p, label: e.target.value }))
                  }
                  placeholder="label"
                  className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-4 focus:ring-indigo-200"
                />
                <input
                  value={newItem.value}
                  onChange={(e) =>
                    setNewItem((p) => ({ ...p, value: e.target.value }))
                  }
                  placeholder="value"
                  className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-4 focus:ring-indigo-200"
                />
                <input
                  value={String(newItem.order || 0)}
                  onChange={(e) =>
                    setNewItem((p) => ({
                      ...p,
                      order: Number(e.target.value || 0),
                    }))
                  }
                  placeholder="order"
                  inputMode="numeric"
                  className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-4 focus:ring-indigo-200"
                />

                <button
                  onClick={addItem}
                  disabled={!activeKey}
                  className="rounded-2xl bg-neutral-900 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-neutral-800 disabled:opacity-50 active:scale-[0.99]"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Items list */}
            <div className="mt-4 space-y-3">
              {loading ? (
                <SkeletonList />
              ) : !activeKey ? (
                <div className="rounded-2xl border border-dashed border-black/10 bg-neutral-50 p-6 text-sm text-neutral-600">
                  Hãy chọn 1 key ở bên trái để xem items.
                </div>
              ) : (active?.items || []).length === 0 ? (
                <div className="rounded-2xl border border-dashed border-black/10 bg-neutral-50 p-6 text-sm text-neutral-600">
                  Key này chưa có item.
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

                              <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-semibold text-neutral-700 ring-1 ring-black/5">
                                {it.value}
                              </span>

                              <span
                                className={cn(
                                  "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ring-1",
                                  activePill(on)
                                )}
                              >
                                {on ? "Active" : "Inactive"}
                              </span>

                              <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-200">
                                order {it.order ?? 0}
                              </span>
                            </div>

                            <div className="mt-2 text-xs text-neutral-500">
                              Tip: Toggle để bật/tắt hiển thị item.
                            </div>
                          </div>

                          <div className="flex shrink-0 gap-2">
                            <button
                              onClick={() =>
                                patchItem(it.value, { isActive: !(it.isActive !== false) })
                              }
                              className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-xs font-bold text-neutral-900 shadow-sm hover:bg-neutral-50"
                            >
                              Toggle
                            </button>
                            <button
                              onClick={() => delItem(it.value)}
                              className="rounded-2xl bg-rose-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-500 active:scale-[0.99]"
                            >
                              Xoá
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>

            {/* Nếu muốn list cuộn trong card khi dài:
                bọc đoạn list bằng <div className="mt-4 max-h-[70vh] overflow-auto pr-1 space-y-3"> ... </div>
            */}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------- UI bits -------- */

function SkeletonList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-3xl border border-black/10 bg-white p-4">
          <div className="h-4 w-2/3 rounded bg-neutral-100" />
          <div className="mt-3 h-3 w-1/3 rounded bg-neutral-100" />
          <div className="mt-3 flex gap-2">
            <div className="h-7 w-24 rounded-full bg-neutral-100" />
            <div className="h-7 w-28 rounded-full bg-neutral-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
