import { useEffect, useState } from "react";
import axios from "axios";

function User() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // =========================================
  // LOAD USERS + ROLES
  // =========================================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem("token");

      const [usersResponse, rolesResponse] =
        await Promise.all([
          axios.get(
            "http://localhost:5000/api/users",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),

          axios.get(
            "http://localhost:5000/api/roles",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

      const usersData = usersResponse.data;
      const rolesData = rolesResponse.data;

      setUsers(
        Array.isArray(usersData)
          ? usersData
          : usersData.users || []
      );

      setRoles(
        Array.isArray(rolesData)
          ? rolesData
          : rolesData.roles || []
      );

    } catch (error) {
      console.error(
        "LOAD USER DATA ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to load users and roles"
      );
    }
  };

  // =========================================
  // HANDLE INPUT
  // =========================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================================
  // GET ROLE NAME
  // =========================================

  const getRoleName = (role) => {
    if (!role) {
      return "-";
    }

    if (typeof role === "object") {
      return (
        role.roleName ||
        role.name ||
        role.role ||
        "-"
      );
    }

    const foundRole = roles.find(
      (item) => item._id === role
    );

    return (
      foundRole?.roleName ||
      foundRole?.name ||
      foundRole?.role ||
      "-"
    );
  };

  // =========================================
  // GET ROLE TYPE
  // =========================================

  const getRoleType = (role) => {
    const roleName = getRoleName(role)
      .toString()
      .toLowerCase()
      .trim();

    if (
      roleName === "superadmin" ||
      roleName === "user"
    ) {
      return "System Role";
    }

    return "Staff";
  };

  // =========================================
  // SAVE USER
  // =========================================

  const saveUser = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.role
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (
      !editingId &&
      !form.password.trim()
    ) {
      alert("Please enter password");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (editingId) {

        const updateData = {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          role: form.role,
        };

        if (form.password.trim()) {
          updateData.password =
            form.password.trim();
        }

        await axios.put(
          `http://localhost:5000/api/users/${editingId}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("User updated successfully");

      } else {

        await axios.post(
          "http://localhost:5000/api/users",
          {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            password: form.password,
            role: form.role,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert("User added successfully");
      }

      resetForm();

      await loadData();

    } catch (error) {
      console.error(
        "SAVE USER ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to save user"
      );
    }
  };

  // =========================================
  // EDIT USER
  // =========================================

  const editUser = (user) => {
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      password: "",
      role:
        user.role?._id ||
        user.role ||
        "",
    });

    setEditingId(user._id);
    setShowPassword(false);
    setShowForm(true);
  };

  // =========================================
  // DELETE USER
  // =========================================

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("User deleted successfully");

      await loadData();

    } catch (error) {
      console.error(
        "DELETE USER ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to delete user"
      );
    }
  };

  // =========================================
  // RESET FORM
  // =========================================

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "",
    });

    setEditingId(null);
    setShowForm(false);
    setShowPassword(false);
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="master-page">

      {/* =====================================
          PAGE HEADER
      ===================================== */}

      <div className="page-title">

        <div>
          <h1>User Management</h1>

          <p>
            Manage system users and their roles
          </p>
        </div>

        <div className="page-title-right">

          <span className="page-count">
            {users.length} Users
          </span>

          <button
            className="btn-primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            + Add User
          </button>

        </div>

      </div>


      {/* =====================================
          ADD / EDIT FORM
      ===================================== */}

      {showForm && (

        <div className="form-card">

          <div className="section-heading">

            <div className="section-icon">
              👤
            </div>

            <div>

              <h2>
                {editingId
                  ? "Edit User"
                  : "Add New User"}
              </h2>

              <p>
                Enter user account details
              </p>

            </div>

          </div>


          <form onSubmit={saveUser}>

            <div className="form-row">

              {/* NAME */}

              <div className="form-group">

                <label>
                  User Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  placeholder="Enter user name"
                  onChange={handleChange}
                />

              </div>


              {/* EMAIL */}

              <div className="form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  placeholder="user@gmail.com"
                  onChange={handleChange}
                />

              </div>


              {/* PHONE */}

              <div className="form-group">

                <label>
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  placeholder="9876543210"
                  onChange={handleChange}
                />

              </div>


              {/* PASSWORD */}

              <div className="form-group">

                <label>

                  Password

                  {editingId && (
                    <span
                      style={{
                        fontWeight: "normal",
                        color: "#777",
                        marginLeft: "5px",
                      }}
                    >
                      (leave empty to keep current)
                    </span>
                  )}

                </label>


                <div
                  style={{
                    position: "relative",
                  }}
                >

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={form.password}
                    placeholder={
                      editingId
                        ? "Enter new password"
                        : "Enter password"
                    }
                    onChange={handleChange}
                    style={{
                      paddingRight: "45px",
                    }}
                  />


                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    style={{
                      position: "absolute",
                      right: "8px",
                      top: "50%",
                      transform:
                        "translateY(-50%)",
                      border: "none",
                      background:
                        "transparent",
                      cursor: "pointer",
                      fontSize: "18px",
                    }}
                  >
                    {showPassword
                      ? "🙈"
                      : "👁️"}
                  </button>

                </div>

              </div>


              {/* ROLE */}

              <div className="form-group">

                <label>
                  Role
                </label>

                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >

                  <option value="">
                    Select Role
                  </option>

                  {roles.map((item) => {

                    const name =
                      item.roleName ||
                      item.name ||
                      item.role ||
                      "";

                    const type =
                      getRoleType(item);

                    return (
                      <option
                        key={item._id}
                        value={item._id}
                      >
                        {name} - {type}
                      </option>
                    );
                  })}

                </select>

              </div>

            </div>


            {/* =================================
                BUTTONS
            ================================= */}

            <div className="form-buttons">

              <button
                type="button"
                className="btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>


              <button
                type="submit"
                className="btn-primary"
              >
                {editingId
                  ? "✓ Update User"
                  : "+ Add User"}
              </button>

            </div>

          </form>

        </div>
      )}


      {/* =====================================
          USER TABLE
      ===================================== */}

      <div className="table-card">

        <div className="table-header">

          <div>

            <h2>
              User List
            </h2>

            <p>
              All registered system users
            </p>

          </div>

        </div>


        {users.length === 0 ? (

          <div className="empty">
            No users found.
          </div>

        ) : (

          <div className="table-wrapper">

            <table className="data-table">

              <thead>

                <tr>

                  <th>
                    S.No
                  </th>

                  <th>
                    Name
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Phone
                  </th>

                  <th>
                    Role
                  </th>

                  <th>
                    Type
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {users.map((user, index) => {

                  const roleName =
                    getRoleName(user.role);

                  const roleType =
                    getRoleType(user.role);

                  return (

                    <tr key={user._id}>

                      <td>
                        {index + 1}
                      </td>


                      <td>
                        <strong>
                          {user.name}
                        </strong>
                      </td>


                      <td>
                        {user.email}
                      </td>


                      <td>
                        {user.phone || "-"}
                      </td>


                      <td>

                        <span className="short-badge">
                          {roleName}
                        </span>

                      </td>


                      <td>

                        <span className="short-badge">
                          {roleType}
                        </span>

                      </td>


                      <td>

                        <button
                          className="edit-btn"
                          onClick={() =>
                            editUser(user)
                          }
                        >
                          ✏️ Edit
                        </button>


                        <button
                          className="delete-btn"
                          onClick={() =>
                            deleteUser(
                              user._id
                            )
                          }
                        >
                          🗑️ Delete
                        </button>

                      </td>

                    </tr>

                  );
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default User;