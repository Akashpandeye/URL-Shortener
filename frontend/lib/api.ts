const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Types
export interface AuthUser {
  id: string;
}

export interface ShortLink {
  id: string;
  shortCode: string;
  targetUrl: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateUrlPayload {
  url: string;
  code?: string;
}

// Storage helpers
const TOKEN_KEY = "url_shortener_token";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Auth headers helper
const authHeaders = (token?: string | null): Record<string, string> => {
  const t = token ?? getToken();
  if (t) return { Authorization: `Bearer ${t}`, "Content-Type": "application/json" };
  return { "Content-Type": "application/json" };
};

// Safe JSON parser — backend may return plain-text 500 errors
async function safeJson(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    // Backend returned non-JSON (e.g. "Internal Server Error")
    return { error: `Server error (${res.status}): ${text.slice(0, 120)}` };
  }
}

// === Auth API ===

export async function apiSignup(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  const res = await fetch(`${API_URL}/api/users/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error((json.error as string) || "Signup failed");
  return json.data as { id: string };
}

export async function apiLogin(data: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error((json.error as string) || "Login failed");
  return json.data as { token: string };
}

// === URL API ===

export async function apiShortenUrl(data: CreateUrlPayload) {
  const res = await fetch(`${API_URL}/api/shorten`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error((json.error as string) || "Failed to shorten URL");
  return (json.data as any)?.result as ShortLink;
}

export async function apiGetCodes() {
  const res = await fetch(`${API_URL}/api/codes`, {
    method: "GET",
    headers: authHeaders(),
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error((json.error as string) || "Failed to fetch URLs");
  return (json.data as any)?.result as ShortLink[];
}

export async function apiDeleteUrl(id: string) {
  const res = await fetch(`${API_URL}/api/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const json = await safeJson(res);
  if (!res.ok) throw new Error((json.error as string) || "Failed to delete URL");
  return (json.data as any)?.result as Pick<ShortLink, "shortCode" | "targetUrl">;
}
