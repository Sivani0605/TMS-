import React, { useEffect, useState } from "react";
import api from "../services/api";

function Department() {
  const [departments, setDepartments] = useState([]);
  const [department, setDepartment] = useState("");
  const [shortName, setShortName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await api.get("/departments");

      setDepartments(
        Array.isArray(response.data)
          ? response.data
          : response.data.departments || []
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to load departments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!department.trim() || !shortName.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      const payload = {
        department: department.trim(),
        shortName: shortName.trim().toUpperCase(),
      };

      if (editingId) {
        await api.put(`/departments/${editingId}`, payload);
        alert("Department updated successfully");
      } else {
        await api.post("/departments", payload);
        alert("Department added successfully");
      }

      resetForm();
      fetchDepartments();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setDepartment(item.department || "");
    setShortName(item.shortName || "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department?")) {
      return;
    }

    try {
      await api.delete(`/departments/${id}`);
      fetchDepartments();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to delete department"
      );
    }
  };

  const resetForm = () => {
    setDepartment("");
    setShortName("");
    setEditingId(null);
  };

  return (
    <div>

      <div className="form-card">

        <div className="section-heading">
          <div className="section-icon">🏢</div>

          <div>
            <h2>
              {editingId
                ? "Edit Department"
                : "Add New Department"}
            </h2>

            <p>
              Enter department details below
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-row">

            <div className="form-group">
              <label>Department Name</label>

              <input
                type="text"
                placeholder="Example: Computer Science"
                value={department}
                onChange={(e) =>
                  setDepartment(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Short Name</label>

              <input
                type="text"
                placeholder="Example: CSE"
                value={shortName}
                onChange={(e) =>
                  setShortName(
                    e.target.value.toUpperCase()
                  )
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
                ? "✓ Update Department"
                : "+ Add Department"}
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

      <div className="table-card">

        <div className="table-header">
          <div>
            <h2>Department List</h2>
            <p>Available departments</p>
          </div>

        </div>

        {loading ? (
          <div className="loading">
            Loading departments...
          </div>
        ) : departments.length === 0 ? (
          <div className="empty">
            No departments found.
          </div>
        ) : (
          <div className="table-wrapper">

            <table className="data-table">

              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Department</th>
                  <th>Short Name</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {departments.map((item, index) => (
                  <tr key={item._id}>

                    <td>{index + 1}</td>

                    <td>
                      <span className="department-badge">
                        {item.department}
                      </span>
                    </td>

                    <td>
                      <span className="short-badge">
                        {item.shortName}
                      </span>
                    </td>

                    <td>
                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(item)
                        }
                      >
                       ✏️   Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(item._id)
                        }
                      >
                      🗑️  Delete
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default Department;