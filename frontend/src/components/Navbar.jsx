import React from "react";

function Navbar() {

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <header className="navbar">

      <div>
        <h2>Ticket Management System</h2>
      </div>

      <div className="user-info">
        👤 {user?.name || "Super Admin"}
      </div>

    </header>
  );
}

export default Navbar;