import React, { useEffect, useState } from "react";
import api from "../services/api";

function Role() {
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ===============================
  // FETCH ROLES
  // ===============================
  const fetchRoles = async () => {
    try {
      setLoading(true);

      const response = await api.get("/roles");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.roles || [];

      setRoles(data);
    } catch (error) {
      console.error("FETCH ROLES ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Unable to load roles"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // ===============================
  // GET ROLE NAME
  // ===============================
  const getRoleName = (item) => {
    return (
      item.roleName ||
      item.name ||
      item.role ||
      ""
    ).toString().trim();
  };

  // ===============================
  // GET ROLE TYPE
  // ===============================
  const getRoleType = (item) => {
    const name = getRoleName(item)
      .toLowerCase()
      .trim();

    // ONLY Superadmin and User are System Roles
    if (
      name === "superadmin" ||
      name === "user"
    ) {
      return "System Role";
    }

    // All other roles are Staff
    return "Staff";
  };

  // ===============================
  // ADD / UPDATE ROLE
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = roleName.trim();

    if (!name) {
      alert("Please enter role name");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/roles/${editingId}`, {
          roleName: name,
        });

        alert("Role updated successfully");
      } else {
        await api.post("/roles", {
          roleName: name,
        });

        alert("Role added successfully");
      }

      resetForm();
      await fetchRoles();

    } catch (error) {
      console.error("ROLE SAVE ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  // ===============================
  // EDIT
  // ===============================
  const handleEdit = (item) => {
    setEditingId(item._id);
    setRoleName(getRoleName(item));
  };

  // ===============================
  // DELETE
  // ===============================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this role?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/roles/${id}`);

      alert("Role deleted successfully");

      await fetchRoles();

    } catch (error) {
      console.error("DELETE ROLE ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Unable to delete role"
      );
    }
  };

  // ===============================
  // RESET
  // ===============================
  const resetForm = () => {
    setRoleName("");
    setEditingId(null);
  };

  return (
    <div className="master-page">

      {/* =====================================
          ADD / EDIT ROLE FORM
      ===================================== */}

      <div className="form-card">

        <div className="section-heading">

          <div className="section-icon">
            👤
          </div>

          <div>
            <h2>
              {editingId
                ? "Edit Role"
                : "Add New Role"}
            </h2>

            <p>
              Enter role details below
            </p>
          </div>

        </div>


        <form onSubmit={handleSubmit}>

          <div className="form-row">

            <div className="form-group">

              <label>
                Role Name
              </label>

              <input
                type="text"
                placeholder="Example: Networking Staff"
                value={roleName}
                onChange={(e) =>
                  setRoleName(e.target.value)
                }
              />

            </div>

          </div>


          <div className="form-buttons">

            <button
              type="submit"
              className="btn-primary"
            >
              {editingId
                ? "✓ Update Role"
                : "+ Add Role"}
            </button>


            {editingId && (
              <button
                type="button"
                className="btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>


      {/* =====================================
          ROLE TABLE
      ===================================== */}

      <div className="table-card">

        <div className="table-header">

          <div>

            <h2>
              Role List
            </h2>

            <p>
              Manage system roles and staff roles
            </p>

          </div>

        </div>


        {/* LOADING */}

        {loading ? (

          <div className="loading">
            Loading roles...
          </div>

        ) : roles.length === 0 ? (

          <div className="empty">
            No roles found.
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
                    Role Name
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

                {roles.map((item, index) => {

                  // Get role name
                  const name = getRoleName(item);

                  // IMPORTANT:
                  // Do NOT use item.roleType here.
                  // Type is calculated only from role name.
                  const type = getRoleType(item);

                  return (

                    <tr key={item._id}>

                      {/* S.NO */}

                      <td>
                        {index + 1}
                      </td>


                      {/* ROLE NAME */}

                      <td>
                        <strong>
                          {name || "-"}
                        </strong>
                      </td>


                      {/* TYPE */}

                      <td>
                        <span className="short-badge">
                          {type}
                        </span>
                      </td>


                      {/* ACTIONS */}

                      <td>

                        <button
                          type="button"
                          className="edit-btn"
                          onClick={() =>
                            handleEdit(item)
                          }
                        >
                          ✏️ Edit
                        </button>


                        <button
                          type="button"
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(item._id)
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

export default Role;