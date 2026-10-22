import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Complaint() {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [department, setDepartment] = useState("");
  const [programme, setProgramme] = useState("");
  const [block, setBlock] = useState("");
  const [room, setRoom] = useState("");
  const [complaintType, setComplaintType] = useState("");
  const [remarks, setRemarks] = useState("");

  const [loading, setLoading] = useState(false);

  const complaintTypes = [
    "PC Hardware",
    "PC Software",
    "Application Issues",
    "Network",
    "Electronics",
    "Plumbing",
    "Other",
  ];

  // ===============================
  // LOAD MASTER DATA
  // ===============================
  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          departmentResponse,
          programmeResponse,
          blockResponse,
          roomResponse,
        ] = await Promise.all([
          api.get("/departments"),
          api.get("/programmes"),
          api.get("/blocks"),
          api.get("/rooms"),
        ]);

        setDepartments(
          Array.isArray(departmentResponse.data)
            ? departmentResponse.data
            : departmentResponse.data.departments || []
        );

        setProgrammes(
          Array.isArray(programmeResponse.data)
            ? programmeResponse.data
            : programmeResponse.data.programmes || []
        );

        setBlocks(
          Array.isArray(blockResponse.data)
            ? blockResponse.data
            : blockResponse.data.blocks || []
        );

        setRooms(
          Array.isArray(roomResponse.data)
            ? roomResponse.data
            : roomResponse.data.rooms || []
        );
      } catch (error) {
        console.error("Load master data error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          alert("Session expired. Please login again.");
          navigate("/login");
          return;
        }

        alert(
          error.response?.data?.message ||
            "Unable to load complaint form data"
        );
      }
    };

    loadData();
  }, [navigate]);

  // ===============================
  // SUBMIT COMPLAINT
  // ===============================
  const submitComplaint = async (e) => {
    e.preventDefault();

    if (
      !department ||
      !programme ||
      !block ||
      !room ||
      !complaintType ||
      !remarks.trim()
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        department,
        programme,
        block,
        room,
        complaintType,
        remarks: remarks.trim(),
      };

      const response = await api.post(
        "/complaints",
        payload
      );

      console.log(
        "Complaint created:",
        response.data
      );

      alert("Complaint raised successfully!");

      // Clear form
      setDepartment("");
      setProgramme("");
      setBlock("");
      setRoom("");
      setComplaintType("");
      setRemarks("");

      navigate("/complaints");
    } catch (error) {
      console.error(
        "Complaint error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        alert("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      alert(
        error.response?.data?.message ||
          "Unable to raise complaint"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // CANCEL
  // ===============================
  const handleCancel = () => {
    navigate("/complaints");
  };

  return (
    <div className="complaint-page">
      <style>{`
        .complaint-page {
          padding: 28px;
          background: #f7f8fc;
          min-height: 100vh;
          font-family: Arial, sans-serif;
        }

        .form-card {
          max-width: 1000px;
          margin: 0 auto;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          padding: 28px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .section-heading {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 28px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .section-icon {
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eef2ff;
          border-radius: 10px;
          font-size: 22px;
        }

        .section-heading h2 {
          margin: 0;
          color: #1f2937;
          font-size: 22px;
        }

        .section-heading p {
          margin: 5px 0 0;
          color: #6b7280;
          font-size: 13px;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-row:nth-of-type(2) {
          grid-template-columns: repeat(3, 1fr);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }

        .form-group select,
        .form-group textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          padding: 11px 12px;
          font-size: 13px;
          outline: none;
          background: white;
          color: #374151;
        }

        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 2px rgba(79,70,229,0.1);
        }

        .complaint-remarks {
          margin-top: 5px;
          margin-bottom: 25px;
        }

        .complaint-remarks textarea {
          resize: vertical;
          min-height: 120px;
        }

        .form-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .btn-secondary,
        .btn-primary {
          border: none;
          padding: 11px 18px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .btn-primary {
          background: #4f46e5;
          color: white;
        }

        .btn-primary:hover {
          background: #4338ca;
        }

        .btn-primary:disabled,
        .btn-secondary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .complaint-page {
            padding: 15px;
          }

          .form-card {
            padding: 20px;
          }

          .form-row,
          .form-row:nth-of-type(2) {
            grid-template-columns: 1fr;
          }

          .form-buttons {
            flex-direction: column;
          }

          .btn-secondary,
          .btn-primary {
            width: 100%;
          }
        }
      `}</style>

      {/* ===============================
          FORM CARD
      =============================== */}
      <div className="form-card">
        <div className="section-heading">
          <div className="section-icon">
            🎫
          </div>

          <div>
            <h2>Raise Complaint</h2>
            <p>
              Enter the complaint details below
            </p>
          </div>
        </div>

        <form onSubmit={submitComplaint}>

          {/* Department / Programme */}
          <div className="form-row">

            <div className="form-group">
              <label>
                Department *
              </label>

              <select
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setProgramme("");
                }}
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
              <label>
                Programme *
              </label>

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

          </div>

          {/* Block / Room / Complaint Type */}
          <div className="form-row">

            <div className="form-group">
              <label>
                Block *
              </label>

              <select
                value={block}
                onChange={(e) => {
                  setBlock(e.target.value);
                  setRoom("");
                }}
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
              <label>
                Room Number *
              </label>

              <select
                value={room}
                onChange={(e) =>
                  setRoom(e.target.value)
                }
              >
                <option value="">
                  Select Room
                </option>

                {rooms
                  .filter((item) => {
                    if (!block) return true;

                    return (
                      item.block?._id === block ||
                      item.block === block
                    );
                  })
                  .map((item) => (
                    <option
                      key={item._id}
                      value={item._id}
                    >
                      {item.roomNumber}
                    </option>
                  ))}
              </select>
            </div>

            <div className="form-group">
              <label>
                Complaint Type *
              </label>

              <select
                value={complaintType}
                onChange={(e) =>
                  setComplaintType(
                    e.target.value
                  )
                }
              >
                <option value="">
                  Select Complaint Type
                </option>

                {complaintTypes.map((type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Remarks */}
          <div className="form-group complaint-remarks">

            <label>
              Complaint Remarks *
            </label>

            <textarea
              rows="5"
              value={remarks}
              placeholder="Describe the problem clearly..."
              onChange={(e) =>
                setRemarks(e.target.value)
              }
            />

          </div>

          {/* Buttons */}
          <div className="form-buttons">

            <button
              type="button"
              className="btn-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "🎫 Submit Complaint"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

export default Complaint;