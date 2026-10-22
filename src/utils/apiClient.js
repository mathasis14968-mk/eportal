// src/utils/apiClient.js
import { refreshAccessToken } from "./refreshToken";

const API_BASE = import.meta.env.VITE_API_BASE;

export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("access_token");

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  let res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) return res;

    const newToken = localStorage.getItem("access_token");
    const retryHeaders = {
      ...(options.headers || {}),
      Authorization: `Bearer ${newToken}`
    };

    res = await fetch(url, { ...options, headers: retryHeaders });
  }

  return res;
}
