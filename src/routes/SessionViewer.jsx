import { useEffect, useState } from "react";
import { apiFetch } from "../utils/apiClient";
import "../styles/sessionViewer.css";

export default function SessionViewer() {
  const [sessions, setSessions] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function load() {
      const token = localStorage.getItem("access_token");

      const res = await apiFetch("/sessions", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrorMsg(data.error || "載入失敗");
        return;
      }

      setSessions(data.sessions);
    }

    load();
  }, []);

  return (
    <div className="session-viewer-container">
      <div className="session-viewer-card">
        <h1 className="session-viewer-title">Session Viewer</h1>
        <p className="session-viewer-subtitle">Super Admin</p>

        {errorMsg && <div className="session-viewer-error">{errorMsg}</div>}

        <table className="session-table">
          <thead>
            <tr>
              <th>Session ID</th>
              <th>員工編號</th>
              <th>裝置</th>
              <th>IP</th>
              <th>User Agent</th>
              <th>建立時間</th>
              <th>到期時間</th>
              <th>有效</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(s => (
              <tr key={s.session_id}>
                <td>{s.session_id}</td>
                <td>{s.employee_code}</td>
                <td>{s.device_id}</td>
                <td>{s.ip}</td>
                <td>{s.user_agent}</td>
                <td>{s.created_at}</td>
                <td>{s.expires_at}</td>
                <td>{s.is_valid ? "✔" : "✘"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
