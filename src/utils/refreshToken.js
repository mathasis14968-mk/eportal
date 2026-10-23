// src/utils/refreshToken.js
import { apiFetch } from "./apiClient";

export async function refreshAccessToken() {
  const refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) return false;

  try {
    const res = await apiFetch("/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token })
    });

    const data = await res.json();
    if (!res.ok || !data.ok) return false;

    localStorage.setItem("access_token", data.access_token);
    return true;
  } catch {
    return false;
  }
}
