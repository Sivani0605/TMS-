import React, { useEffect, useState } from "react";
import api from "../services/api";

function Programme() {
  const [programmes, setProgrammes] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [department, setDepartment] = useState("");
  const [programme, setProgramme] = useState("");
  const [shortName, setShortName] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProgrammes = async () => {
    try {
      setLoading(true);

      const response = await api.get("/programmes");

      setProgrammes(response.data);
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Unable to load programmes"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchProgrammes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!department || !programme.trim() || !shortName.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (editingId) {
        await api.put(`/programmes/${editingId}`, {
          department,
          programme,
          shortName,
        });

        alert("Programme updated successfully");
      } else {
        await api.post("/programmes", {
          department,
          programme,
          shortName,
        });

        alert("Programme added successfully");
      }

      resetForm();
      fetchProgrammes();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);

    setDepartment(
      item.department?._id ||
      item.department ||
      ""
    );

    setProgramme(item.programme || "");
    setShortName(item.shortName || "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this programme?")) {
      return;
    }

    try {
      await api.delete(`/programmes/${id}`);

      alert("Programme deleted successfully");

      fetchProgrammes();

    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Unable to delete programme"
      );
    }
  };

  const resetForm = () => {
    setDepartment("");
    setProgramme("");
    setShortName("");
    setEditingId(null);
  };

  const getDepartmentName = (item) => {
    if (typeof item.department === "object") {
      return item.department.department;
    }

    const found = departments.find(
      (d) => d._id === item.department
    );

    return found?.department || item.department;
  };

  return (
    <div className="master-page">


      <div className="form-card">

        <div className="section-heading">
          <div className="section-icon">🎓</div>

          <div>
            <h2>
              {editingId
                ? "Edit Programme"
                : "Add New Programme"}
            </h2>

            <p>
              Enter programme details below
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-row">

            <div className="form-group">

              <label>Department</label>

              <select
                value={department}
                onChange={(e) =>
                  setDepartment(e.target.value)
                }
              >
                <option value="">
                  Select Department
                </option>

                {departments.map((item) => (
                  <option
                    key={item._id}
                    value={item._id}
                  >
                    {item.department}
                  </option>
                ))}
              </select>

            </div>

            <div className="form-group">

              <label>Programme</label>

              <input
                type="text"
                placeholder="Example: Master of Computer Applications"
                value={programme}
                onChange={(e) =>
                  setProgramme(e.target.value)
                }
              />

            </div>

            <div className="form-group">

              <label>Programme Short Name</label>

              <input
                type="text"
                placeholder="Example: MCA"
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
                ? "✓ Update Programme"
                : "+ Add Programme"}
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
            <h2>Programme List</h2>
          </div>

        </div>

        {loading ? (
          <div className="loading">
            Loading programmes...
          </div>
        ) : programmes.length === 0 ? (
          <div className="empty">
            No programmes found.
          </div>
        ) : (
          <div className="table-wrapper">

            <table className="data-table">

              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Department</th>
                  <th>Programme</th>
                  <th>Short Name</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {programmes.map((item, index) => (
                  <tr key={item._id}>

                    <td>{index + 1}</td>

                    <td>
                      <span className="department-badge">
                        {getDepartmentName(item)}
                      </span>
                    </td>

                    <td>
                      <strong>
                        {item.programme}
                      </strong>
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
                        ✏️ Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(item._id)
                        }
                      >
                        🗑️ Delete
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

export default Programme;