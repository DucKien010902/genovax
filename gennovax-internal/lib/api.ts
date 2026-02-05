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
  token: string;
  user: { id: string; name: string; email: string; role: Role };
};

const LS_TOKEN = "genno_token";

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(LS_TOKEN) || "";
}

async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = getToken();
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);

  return fetch(input, {
    ...init,
    headers,
  });
}

export const api = {
  options: () =>
    authFetch(`${API_BASE}/meta/options`).then((r) => j<OptionsMap>(r)),

  services: (serviceType: ServiceType) =>
    authFetch(
      `${API_BASE}/services?serviceType=${encodeURIComponent(serviceType)}`
    ).then((r) => j<{ items: ServiceItem[] }>(r)),

  doctors: (search = "") =>
    authFetch(`${API_BASE}/doctors?search=${encodeURIComponent(search)}`).then(
      (r) => j<{ items: DoctorItem[] }>(r)
    ),

  cases: (params: {
    serviceType: ServiceType;
    q?: string;
    from?: string;
    to?: string;
  }) => {
    const qs = new URLSearchParams(
      Object.entries(params).reduce((acc, [k, v]) => {
        if (v !== undefined && v !== "") acc[k] = String(v);
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    return authFetch(`${API_BASE}/cases?${qs}`).then((r) =>
      j<Paginated<CaseRecord>>(r)
    );
  },

  createCase: (payload: any) =>
    authFetch(`${API_BASE}/cases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((r) => j<CaseRecord>(r)),

  updateCase: (id: string, patch: any) =>
    authFetch(`${API_BASE}/cases/${id}`, {
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
    // --- Doctors CRUD ---
doctorCreate: (payload: any) =>
  authFetch(`${API_BASE}/doctors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((r) => j<any>(r)),

doctorUpdate: (id: string, patch: any) =>
  authFetch(`${API_BASE}/doctors/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  }).then((r) => j<any>(r)),

doctorDelete: (id: string) =>
  authFetch(`${API_BASE}/doctors/${id}`, { method: "DELETE" }).then((r) =>
    j<{ ok: true }>(r)
  ),

// --- Services CRUD ---
serviceCreate: (payload: any) =>
  authFetch(`${API_BASE}/services`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((r) => j<any>(r)),

serviceUpdate: (id: string, patch: any) =>
  authFetch(`${API_BASE}/services/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  }).then((r) => j<any>(r)),

serviceDelete: (id: string) =>
  authFetch(`${API_BASE}/services/${id}`, { method: "DELETE" }).then((r) =>
    j<{ ok: true }>(r)
  ),

// --- Options Admin ---
optionsAdminList: () =>
  authFetch(`${API_BASE}/meta/options-admin`).then((r) =>
    j<{ items: any[] }>(r)
  ),

optionsAdminAddItem: (key: string, payload: any) =>
  authFetch(`${API_BASE}/meta/options-admin/${encodeURIComponent(key)}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then((r) => j<any>(r)),

optionsAdminPatchItem: (key: string, value: string, patch: any) =>
  authFetch(
    `${API_BASE}/meta/options-admin/${encodeURIComponent(
      key
    )}/items/${encodeURIComponent(value)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    }
  ).then((r) => j<any>(r)),

optionsAdminDeleteItem: (key: string, value: string) =>
  authFetch(
    `${API_BASE}/meta/options-admin/${encodeURIComponent(
      key
    )}/items/${encodeURIComponent(value)}`,
    { method: "DELETE" }
  ).then((r) => j<any>(r)),

optionsAdminDeleteKey: (key: string) =>
  authFetch(`${API_BASE}/meta/options-admin/${encodeURIComponent(key)}`, {
    method: "DELETE",
  }).then((r) => j<{ ok: true }>(r)),

};
