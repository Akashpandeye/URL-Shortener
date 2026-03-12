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
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Signup failed");
  return json.data as { id: string };
}

export async function apiLogin(data: { email: string; password: string }) {
  const res = await fetch(`${API_URL}/api/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Login failed");
  return json.data as { token: string };
}

// === URL API ===

export async function apiShortenUrl(data: CreateUrlPayload) {
  const res = await fetch(`${API_URL}/api/shorten`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to shorten URL");
  return json.data.result as ShortLink;
}

export async function apiGetCodes() {
  const res = await fetch(`${API_URL}/api/codes`, {
    method: "GET",
    headers: authHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to fetch URLs");
  return json.data.result as ShortLink[];
}

export async function apiDeleteUrl(id: string) {
  const res = await fetch(`${API_URL}/api/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to delete URL");
  return json.data.result as Pick<ShortLink, "shortCode" | "targetUrl">;
}
