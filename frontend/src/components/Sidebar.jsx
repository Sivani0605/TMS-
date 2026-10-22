import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // Get logged-in user safely
  let user = {};

  try {
    user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );
  } catch (error) {
    console.error("USER DATA ERROR:", error);
  }

  // Get role safely
  let role = "";

  if (
    typeof user.role === "object" &&
    user.role !== null
  ) {
    role =
      user.role.roleName ||
      user.role.name ||
      "";
  } else {
    role = user.role || "";
  }

  const normalizedRole = String(role)
    .toLowerCase()
    .trim();

  const isSuperAdmin =
    normalizedRole === "superadmin";

  const isUser =
    normalizedRole === "user";

  return (
    <aside className="sidebar">

      {/* LOGO */}
      <div className="logo">
        🎫 TMS
      </div>

      <nav>

        {/* DASHBOARD */}
        <NavLink to="/dashboard">
          🏠 Dashboard
        </NavLink>


        {/* ================= SUPER ADMIN ================= */}

        {isSuperAdmin && (
          <>
            <div className="menu-title">
              📂 Masters
            </div>

            <NavLink to="/department">
              🏢 Department
            </NavLink>

            <NavLink to="/programme">
              🎓 Programme
            </NavLink>

            <NavLink to="/block">
              🏫 Block
            </NavLink>

            <NavLink to="/room">
              🚪 Room
            </NavLink>

            <NavLink to="/role">
              👤 Role
            </NavLink>

            <NavLink to="/user">
              👥 User
            </NavLink>
          </>
        )}


        {/* ================= COMPLAINTS ================= */}

        <div className="menu-title">
          🎫 Complaints
        </div>


        {/* USER ONLY */}

        {isUser && (
          <NavLink to="/complaint">
            ➕ New Complaint
          </NavLink>
        )}


        {/* ALL ROLES */}

        <NavLink to="/complaints">
          📋 Complaint List
        </NavLink>


        {/* SUPER ADMIN ONLY */}

        {isSuperAdmin && (
          <NavLink to="/reports">
            📊 Reports
          </NavLink>
        )}

      </nav>


      {/* ================= LOGOUT ================= */}

      <button
        className="logout-btn"
        onClick={logout}
        style={{
          marginTop: "30px",
          marginLeft: "15px",
          marginRight: "15px",
          marginBottom: "20px",
          width: "calc(100% - 30px)",
          padding: "12px 15px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        🚪 Logout
      </button>

    </aside>
  );
}

export default Sidebar;