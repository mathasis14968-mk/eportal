// src/routes/dashboard.jsx
import { useLoaderData, redirect } from "react-router-dom";
import { requireAuth } from "../utils/requireAuth";
import "../styles/dashboard.css";

export async function loader() {
  const user = await requireAuth();
  if (!user) return redirect("/login");
  return user;
}

export default function Dashboard() {
  const user = useLoaderData();

  async function handleLogout() {
    const session_id = localStorage.getItem("session_id");
    const refresh_token = localStorage.getItem("refresh_token");

    await fetch("/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id, refresh_token })
    });

    localStorage.clear();
    window.location.href = "/login";
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="dashboard-title">歡迎回來</h1>
        <p className="dashboard-subtitle">Executive Portal</p>

        <div className="dashboard-info">
          <p><strong>姓名：</strong> {user.full_name}</p>
          <p><strong>員工編號：</strong> {user.employee_code}</p>
          <p><strong>角色：</strong> {user.role}</p>
          <p><strong>部門：</strong> {user.department_id}</p>
          <p><strong>預設分店：</strong> {user.default_office_id}</p>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          登出
        </button>
      </div>
    </div>
  );
}
