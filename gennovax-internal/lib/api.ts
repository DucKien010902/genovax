import type {
  CaseRecord,
  OptionsMap,
  Paginated,
  ServiceType,
  ServiceItem,
  DoctorItem,
} from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000/api";

async function j<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}
export type Role = "admin" | "staff";
export type LoginResponse = {
  token: string; // JWT
  user: { id: string; name: string; email: string; role: Role };
};
export const api = {
  options: () =>
    fetch(`${API_BASE}/meta/options`).then((r) => j<OptionsMap>(r)),

  // ✅ load services theo serviceType để tính giá
  services: (serviceType: ServiceType) =>
    fetch(
      `${API_BASE}/services?serviceType=${encodeURIComponent(serviceType)}`,
    ).then((r) => j<{ items: ServiceItem[] }>(r)),

  // ✅ doctors (nếu bạn muốn chọn doctorId)
  doctors: (search = "") =>
    fetch(`${API_BASE}/doctors?search=${encodeURIComponent(search)}`).then(
      (r) => j<{ items: DoctorItem[] }>(r),
    ),

  cases: (params: {
    serviceType: ServiceType;
    q?: string;
    from?: string;
    to?: string;
  }) => {
    const qs = new URLSearchParams(
      Object.entries(params).reduce(
        (acc, [k, v]) => {
          if (v !== undefined && v !== "") acc[k] = String(v);
          return acc;
        },
        {} as Record<string, string>,
      ),
    ).toString();
    return fetch(`${API_BASE}/cases?${qs}`).then((r) =>
      j<Paginated<CaseRecord>>(r),
    );
  },

  createCase: (payload: any) =>
    fetch(`${API_BASE}/cases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((r) => j<CaseRecord>(r)),

  updateCase: (id: string, patch: any) =>
    fetch(`${API_BASE}/cases/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    }).then((r) => j<CaseRecord>(r)),
  login: (payload: { email: string; password: string }) =>
    fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((r) => j<LoginResponse>(r)),

  me: (token: string) =>
    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => j<LoginResponse["user"]>(r)),
};
