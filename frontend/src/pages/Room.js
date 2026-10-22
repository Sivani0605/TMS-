import React, { useEffect, useState } from "react";
import api from "../services/api";

function Room() {
  const [rooms, setRooms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [blocks, setBlocks] = useState([]);

  const [department, setDepartment] = useState("");
  const [programme, setProgramme] = useState("");
  const [block, setBlock] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [r, d, p, b] = await Promise.all([
        api.get("/rooms"),
        api.get("/departments"),
        api.get("/programmes"),
        api.get("/blocks"),
      ]);

      setRooms(
        Array.isArray(r.data)
          ? r.data
          : r.data.rooms || []
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

      setBlocks(
        Array.isArray(b.data)
          ? b.data
          : b.data.blocks || []
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to load room data"
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

    if (
      !department ||
      !programme ||
      !block ||
      !roomNumber.trim()
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const payload = {
        department,
        programme,
        block,
        roomNumber: roomNumber.trim(),
      };

      if (editingId) {
        await api.put(`/rooms/${editingId}`, payload);
        alert("Room updated successfully");
      } else {
        await api.post("/rooms", payload);
        alert("Room added successfully");
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

    setBlock(
      item.block?._id ||
      item.block ||
      ""
    );

    setRoomNumber(
      item.roomNumber || ""
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this room?")) {
      return;
    }

    try {
      await api.delete(`/rooms/${id}`);
      fetchData();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Unable to delete room"
      );
    }
  };

  const resetForm = () => {
    setDepartment("");
    setProgramme("");
    setBlock("");
    setRoomNumber("");
    setEditingId(null);
  };

  const getName = (item, type) => {
    const value = item[type];

    if (typeof value === "object") {
      return (
        value?.department ||
        value?.programme ||
        value?.blockName ||
        "-"
      );
    }

    let list = [];

    if (type === "department") {
      list = departments;
    } else if (type === "programme") {
      list = programmes;
    } else {
      list = blocks;
    }

    const found = list.find(
      (x) => x._id === value
    );

    return (
      found?.department ||
      found?.programme ||
      found?.blockName ||
      "-"
    );
  };

  return (
    <div>

      <div className="form-card">

        <div className="section-heading">

          <div className="section-icon">
            🚪
          </div>

          <div>
            <h2>
              {editingId
                ? "Edit Room"
                : "Add New Room"}
            </h2>

            <p>
              Enter room details below
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
              <label>Block</label>

              <select
                value={block}
                onChange={(e) =>
                  setBlock(e.target.value)
                }
              >
                <option value="">
                  Select Block
                </option>

                {blocks.map((item) => (
                  <option
                    key={item._id}
                    value={item._id}
                  >
                    {item.blockName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Room Number</label>

              <input
                type="text"
                placeholder="Example: 101"
                value={roomNumber}
                onChange={(e) =>
                  setRoomNumber(e.target.value)
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
                ? "✓ Update Room"
                : "+ Add Room"}
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
            <h2>Room List</h2>
          </div>

         

        </div>

        {loading ? (
          <div className="loading">
            Loading rooms...
          </div>
        ) : rooms.length === 0 ? (
          <div className="empty">
            No rooms found.
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
                  <th>Room Number</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {rooms.map((item, index) => (
                  <tr key={item._id}>

                    <td>{index + 1}</td>

                    <td>
                      {getName(item, "department")}
                    </td>

                    <td>
                      {getName(item, "programme")}
                    </td>

                    <td>
                      <span className="department-badge">
                        {getName(item, "block")}
                      </span>
                    </td>

                    <td>
                      <span className="room-badge">
                        {item.roomNumber}
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

export default Room;