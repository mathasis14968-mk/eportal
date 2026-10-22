// src/utils/requireAuth.js
import { apiFetch } from "./apiClient";

export async function requireAuth() {
  const res = await apiFetch("/auth/me");
  if (!res.ok) return null;

  const data = await res.json();
  if (!data.ok) return null;

  return data;
}
