// src/routes/Login.jsx
import { useState, useEffect } from "react";
import "../styles/login.css";
import AutoLoginModal from "../components/AutoLoginModal";

const API_BASE = "https://apps.hubspothk.com";   // ⭐ 你的 Worker API domain

export default function Login() {
  const [employeeCode, setEmployeeCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [autoLoginVisible, setAutoLoginVisible] = useState(false);
  const [autoLoginName, setAutoLoginName] = useState("");

  useEffect(() => {
    let deviceId = localStorage.getItem("device_id_hash");
    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem("device_id_hash", deviceId);
    }
  }, []);

  useEffect(() => {
    async function checkAutoLogin() {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (res.ok && data.ok) {
          setAutoLoginName(data.employee_code);
          setAutoLoginVisible(true);
        }
      } catch {}
    }
    checkAutoLogin();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: employeeCode,
          password,
          device_id_hash: localStorage.getItem("device_id_hash")
        })
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || "登入失敗");
        setLoading(false);
        return;
      }

      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("session_id", data.session_id);

      window.location.href = "/dashboard";
    } catch {
      setErrorMsg("系統錯誤，請稍後再試");
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <AutoLoginModal
        visible={autoLoginVisible}
        name={autoLoginName}
        onConfirm={() => window.location.href = "/dashboard"}
        onCancel={() => setAutoLoginVisible(false)}
      />

      <div className="login-card">
        <h1 className="login-title">登入你的帳戶</h1>
        <p className="login-subtitle">Executive Portal</p>

        {errorMsg && <div className="login-error">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <label className="input-label">員工編號</label>
          <input
            type="text"
            className="input-box"
            value={employeeCode}
            onChange={e => setEmployeeCode(e.target.value)}
            placeholder="例如：SF0001"
          />

          <label className="input-label">密碼</label>
          <input
            type="password"
            className="input-box"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="輸入密碼"
          />

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "登入中…" : "登入"}
          </button>
        </form>
      </div>
    </div>
  );
}
