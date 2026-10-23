// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Login from "./routes/Login";
import Dashboard, { loader as dashboardLoader } from "./routes/Dashboard";
import SessionViewer from "./routes/SessionViewer";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Login /> },

  { path: "/dashboard", element: <Dashboard />, loader: dashboardLoader },
  { path: "/session-viewer", element: <SessionViewer /> }   // ⭐ 正確
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
