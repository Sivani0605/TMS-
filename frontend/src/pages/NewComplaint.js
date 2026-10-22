import React, { useEffect, useState } from "react";
import api from "../services/api";

function NewComplaint() {
  const [rooms, setRooms] = useState([]);

  const [problem, setProblem] = useState("");
  const [type, setType] = useState("");
  const [room, setRoom] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  // Load rooms
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await api.get("/rooms");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.rooms || [];

      setRooms(data);
    } catch (error) {
      console.error(error);
      alert("Unable to load rooms");
    }
  };

  // Submit Complaint
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!problem || !type || !room || !description.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        problem,
        type,
        room,
        description: description.trim(),
        status: "Pending",
      };

      await api.post("/complaints", payload);

      alert("Complaint submitted successfully");

      // Clear form
      setProblem("");
      setType("");
      setRoom("");
      setDescription("");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
        "Unable to submit complaint"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">

      {/* Form Card */}
      <div className="form-card">

        <div className="section-heading">

          <div className="section-icon">
            📝
          </div>

          <div>
            <h2>New Complaint</h2>
            <p>Submit a new complaint</p>
          </div>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-row">

            {/* Problem */}
            <div className="form-group">
              <label>Problem</label>

              <input
                type="text"
                placeholder="Enter problem"
                value={problem}
                onChange={(e) =>
                  setProblem(e.target.value)
                }
              />
            </div>

            {/* Complaint Type */}
            <div className="form-group">
              <label>Complaint Type</label>

              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value)
                }
              >
                <option value="">
                  Select Complaint Type
                </option>

                <option value="Electrical">
                  Electrical
                </option>

                <option value="Plumbing">
                  Plumbing
                </option>

                <option value="Networking">
                  Networking
                </option>

                <option value="Software">
                  Software
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            {/* Room */}
            <div className="form-group">
              <label>Room</label>

              <select
                value={room}
                onChange={(e) =>
                  setRoom(e.target.value)
                }
              >
                <option value="">
                  Select Room
                </option>

                {rooms.map((item) => (
                  <option
                    key={item._id}
                    value={item._id}
                  >
                    {item.roomNumber}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Description */}
          <div className="form-group">
            <label>Description</label>

            <textarea
              rows="5"
              placeholder="Describe your complaint..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />
          </div>

          {/* Buttons */}
          <div className="form-buttons">

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "+ Submit Complaint"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default NewComplaint;