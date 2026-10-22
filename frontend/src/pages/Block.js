import React, { useEffect, useState } from "react";
import api from "../services/api";

function Block() {
  const [blocks, setBlocks] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programmes, setProgrammes] = useState([]);

  const [department, setDepartment] = useState("");
  const [programme, setProgramme] = useState("");
  const [blockName, setBlockName] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [b, d, p] = await Promise.all([
        api.get("/blocks"),
        api.get("/departments"),
        api.get("/programmes"),
      ]);

      setBlocks(
        Array.isArray(b.data)
          ? b.data
          : b.data.blocks || []
      );

      setDepartments(
        Array.isArray(d.data)
          ? d.data
          : d.data.departments || []
      );

      setProgrammes(
        Array.isArray(p.data)
          ? p.data
          : p.data.programmes || []
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to load block data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!department || !programme || !blockName.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      const payload = {
        department,
        programme,
        blockName: blockName.trim(),
      };

      if (editingId) {
        await api.put(`/blocks/${editingId}`, payload);
        alert("Block updated successfully");
      } else {
        await api.post("/blocks", payload);
        alert("Block added successfully");
      }

      resetForm();
      fetchData();
    } catch (error) {
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

    setProgramme(
      item.programme?._id ||
      item.programme ||
      ""
    );

    setBlockName(item.blockName || "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this block?")) {
      return;
    }

    try {
      await api.delete(`/blocks/${id}`);
      fetchData();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to delete block"
      );
    }
  };

  const resetForm = () => {
    setDepartment("");
    setProgramme("");
    setBlockName("");
    setEditingId(null);
  };

  const getDepartmentName = (item) => {
    if (typeof item.department === "object") {
      return item.department?.department || "-";
    }

    const found = departments.find(
      (d) => d._id === item.department
    );

    return found?.department || "-";
  };

  const getProgrammeName = (item) => {
    if (typeof item.programme === "object") {
      return item.programme?.programme || "-";
    }

    const found = programmes.find(
      (p) => p._id === item.programme
    );

    return found?.programme || "-";
  };

  return (
    <div>

      <div className="form-card">

        <div className="section-heading">

          <div className="section-icon">
            🏢
          </div>

          <div>
            <h2>
              {editingId
                ? "Edit Block"
                : "Add New Block"}
            </h2>

            <p>
              Enter block details below
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

              <select
                value={programme}
                onChange={(e) =>
                  setProgramme(e.target.value)
                }
              >
                <option value="">
                  Select Programme
                </option>

                {programmes.map((item) => (
                  <option
                    key={item._id}
                    value={item._id}
                  >
                    {item.programme}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Block Name</label>

              <input
                type="text"
                placeholder="Example: A Block"
                value={blockName}
                onChange={(e) =>
                  setBlockName(e.target.value)
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
                ? "✓ Update Block"
                : "+ Add Block"}
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
            <h2>Block List</h2>
          </div>

    

        </div>

        {loading ? (
          <div className="loading">
            Loading blocks...
          </div>
        ) : blocks.length === 0 ? (
          <div className="empty">
            No blocks found.
          </div>
        ) : (
          <div className="table-wrapper">

            <table className="data-table">

              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Department</th>
                  <th>Programme</th>
                  <th>Block</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {blocks.map((item, index) => (
                  <tr key={item._id}>

                    <td>{index + 1}</td>

                    <td>
                      <span className="department-badge">
                        {getDepartmentName(item)}
                      </span>
                    </td>

                    <td>
                      {getProgrammeName(item)}
                    </td>

                    <td>
                      <strong>
                        {item.blockName}
                      </strong>
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

export default Block;