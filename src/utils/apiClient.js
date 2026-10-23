// src/utils/apiClient.js
import { refreshAccessToken } from "./refreshToken";

// ⭐ 正式環境用 Cloudflare Pages 的 VITE_API_BASE
// ⭐ 本地開發用 .env 的 VITE_API_BASE
const API_BASE = import.meta.env.VITE_API_BASE;

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("access_token");

  // ⭐ 自動補上 API_BASE（最重要的一行）
  const url = path.startsWith("http")
    ? path
    : `${API_BASE}${path}`;

  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  let res = await fetch(url, { ...options, headers });

  // ⭐ 自動 refresh token
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
