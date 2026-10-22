import {
  useEffect,
  useState,
  useCallback
} from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

function ComplaintList() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================
  // ASSIGNMENT STATES
  // =====================================

  const [showAssignModal, setShowAssignModal] =
    useState(false);

  const [selectedComplaint, setSelectedComplaint] =
    useState(null);

  const [users, setUsers] = useState([]);

  const [selectedStaff, setSelectedStaff] =
    useState("");

  const [assignLoading, setAssignLoading] =
    useState(false);

  // =====================================
  // GET LOGGED-IN USER
  // =====================================

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const role =
    user.role?.roleName ||
    user.role?.name ||
    user.role ||
    "";

  const normalizedRole =
    role.toString().toLowerCase().trim();

  const isSuperAdmin =
    normalizedRole === "superadmin";

  const isUser =
    normalizedRole === "user";

  // Everyone else is Staff
  const isStaff =
    !isSuperAdmin && !isUser;

  // =====================================
  // GET COMPLAINTS
  // =====================================

  const getComplaints = useCallback(async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert("Please login again");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/complaints",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      setComplaints(
        Array.isArray(data)
          ? data
          : data.complaints || []
      );

    } catch (error) {
      console.error(
        "Unable to load complaints:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        alert(
          "Session expired. Please login again."
        );

        navigate("/login");
      } else {
        alert(
          error.response?.data?.message ||
            "Unable to load complaints"
        );
      }

    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // =====================================
  // LOAD COMPLAINTS
  // =====================================

  useEffect(() => {
    getComplaints();
  }, [getComplaints]);

  // =====================================
  // GET STAFF USERS
  // =====================================

  const getStaffUsers = useCallback(async () => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;

      const allUsers = Array.isArray(data)
        ? data
        : data.users || [];

      // Only Staff users
      const staffOnly = allUsers.filter(
        (item) => {
          const userRole =
            item.role?.roleName ||
            item.role?.name ||
            item.role ||
            "";

          const normalizedUserRole =
            userRole
              .toString()
              .toLowerCase()
              .trim();

          return (
            normalizedUserRole !== "superadmin" &&
            normalizedUserRole !== "user"
          );
        }
      );

      setUsers(staffOnly);

    } catch (error) {
      console.error(
        "Unable to load staff users:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to load staff users"
      );
    }
  }, []);

  // =====================================
  // OPEN ASSIGN MODAL
  // =====================================

  const openAssignModal = async (
    complaint
  ) => {
    setSelectedComplaint(complaint);

    setSelectedStaff(
      complaint.assignedTo?._id || ""
    );

    setShowAssignModal(true);

    await getStaffUsers();
  };

  // =====================================
  // CLOSE ASSIGN MODAL
  // =====================================

  const closeAssignModal = () => {
    if (assignLoading) {
      return;
    }

    setShowAssignModal(false);
    setSelectedComplaint(null);
    setSelectedStaff("");
  };

  // =====================================
  // ASSIGN COMPLAINT
  // =====================================

  const assignComplaint = async () => {
    try {
      if (!selectedComplaint) {
        alert("Please select a complaint");
        return;
      }

      if (!selectedStaff) {
        alert("Please select a staff member");
        return;
      }

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert("Please login again");
        navigate("/login");
        return;
      }

      setAssignLoading(true);

      await axios.put(
        `http://localhost:5000/api/complaints/${selectedComplaint._id}/assign`,
        {
          assignedTo: selectedStaff,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      alert(
        "Complaint assigned successfully"
      );

      setShowAssignModal(false);
      setSelectedComplaint(null);
      setSelectedStaff("");

      await getComplaints();

    } catch (error) {
      console.error(
        "Assign complaint error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        alert(
          "Session expired. Please login again."
        );

        navigate("/login");
        return;
      }

      alert(
        error.response?.data?.message ||
          "Unable to assign complaint"
      );

    } finally {
      setAssignLoading(false);
    }
  };

  // =====================================
  // SEARCH
  // =====================================

  const filtered = complaints.filter(
    (item) => {
      const value =
        search.toLowerCase().trim();

      return (
        item.complaintType
          ?.toLowerCase()
          .includes(value) ||

        item.remarks
          ?.toLowerCase()
          .includes(value) ||

        item.block?.blockName
          ?.toLowerCase()
          .includes(value) ||

        item.room?.roomNumber
          ?.toString()
          .toLowerCase()
          .includes(value) ||

        item.assignedTo?.name
          ?.toLowerCase()
          .includes(value)
      );
    }
  );

  // =====================================
  // CHANGE STATUS
  // ONLY SUPERADMIN
  // =====================================

  const changeStatus = async (
    id,
    status
  ) => {

    // Extra frontend protection
    if (!isSuperAdmin) {
      alert(
        "Only SuperAdmin can change complaint status"
      );
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        alert("Please login again");
        navigate("/login");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/complaints/${id}`,
        {
          status,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      alert(
        status === "Closed"
          ? "Complaint closed successfully"
          : "Complaint status updated"
      );

      await getComplaints();

    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        alert(
          "Session expired. Please login again."
        );

        navigate("/login");
        return;
      }

      alert(
        error.response?.data?.message ||
          "Unable to update complaint status"
      );
    }
  };

  // =====================================
  // STATUS CSS CLASS
  // =====================================

  const getStatusClass = (
    status
  ) => {
    const value =
      status?.toLowerCase() ||
      "pending";

    if (value === "pending") {
      return "status pending";
    }

    if (value === "assigned") {
      return "status assigned";
    }

    if (
      value === "onhold" ||
      value === "on-hold"
    ) {
      return "status onhold";
    }

    if (
      value === "closed" ||
      value === "completed"
    ) {
      return "status completed";
    }

    return "status pending";
  };

  // =====================================
  // GET ASSIGNED STAFF NAME
  // =====================================

  const getAssignedStaffName = (
    complaint
  ) => {
    if (!complaint.assignedTo) {
      return "Not Assigned";
    }

    return (
      complaint.assignedTo.name ||
      complaint.assignedTo.email ||
      "Assigned"
    );
  };

  // =====================================
  // UI
  // =====================================

  return (
    <div className="complaint-page">

      <style>{`

        * {
          box-sizing: border-box;
        }

        .complaint-page {
          padding: 28px;
          background: #f7f8fc;
          min-height: 100vh;
          font-family: Arial, sans-serif;
        }

        .complaint-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
        }

        .complaint-title h1 {
          margin: 0;
          font-size: 27px;
          color: #1f2937;
        }

        .complaint-title p {
          margin: 7px 0 0;
          color: #6b7280;
          font-size: 14px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .count-badge {
          background: #eef2ff;
          color: #4f46e5;
          padding: 9px 15px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
        }

        .primary-btn {
          border: none;
          background: #4f46e5;
          color: white;
          padding: 10px 17px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .primary-btn:hover {
          background: #4338ca;
        }

        .search-box {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .search-icon {
          font-size: 17px;
          color: #6b7280;
        }

        .search-box input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 14px;
          color: #374151;
        }

        .clear-btn {
          border: none;
          background: transparent;
          color: #9ca3af;
          font-size: 20px;
          cursor: pointer;
        }

        .table-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .table-header h2 {
          margin: 0;
          font-size: 18px;
          color: #1f2937;
        }

        .table-wrapper {
          width: 100%;
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1100px;
        }

        .data-table th {
          background: #f9fafb;
          color: #6b7280;
          font-size: 12px;
          font-weight: 700;
          text-align: left;
          padding: 13px 16px;
          border-bottom: 1px solid #e5e7eb;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .data-table td {
          padding: 15px 16px;
          border-bottom: 1px solid #f0f1f3;
          color: #374151;
          font-size: 13px;
          vertical-align: middle;
        }

        .data-table tbody tr:hover {
          background: #fafbff;
        }

        .complaint-type {
          font-weight: 600;
          color: #1f2937;
        }

        .room-badge {
          display: inline-block;
          background: #f3f4f6;
          color: #374151;
          padding: 5px 9px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .remarks {
          max-width: 260px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #6b7280;
        }

        .assigned-person {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .staff-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #eef2ff;
          color: #4f46e5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
        }

        .staff-name {
          font-size: 12px;
          font-weight: 600;
          color: #374151;
        }

        .not-assigned {
          color: #9ca3af;
          font-size: 12px;
          font-weight: 600;
        }

        .status {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
        }

        .status.pending {
          background: #fff7ed;
          color: #c2410c;
        }

        .status.assigned {
          background: #eff6ff;
          color: #2563eb;
        }

        .status.onhold {
          background: #fefce8;
          color: #a16207;
        }

        .status.completed {
          background: #ecfdf5;
          color: #059669;
        }

        .status-select {
          border: 1px solid #d1d5db;
          border-radius: 7px;
          padding: 7px 9px;
          font-size: 12px;
          outline: none;
          background: white;
          cursor: pointer;
        }

        .status-select:focus {
          border-color: #4f46e5;
        }

        .assign-btn {
          border: none;
          background: #4f46e5;
          color: white;
          padding: 7px 12px;
          border-radius: 7px;
          font-size: 12px;
          cursor: pointer;
          font-weight: 600;
        }

        .assign-btn:hover {
          background: #4338ca;
        }

        .reassign-btn {
          border: 1px solid #4f46e5;
          background: white;
          color: #4f46e5;
          padding: 7px 12px;
          border-radius: 7px;
          font-size: 12px;
          cursor: pointer;
          font-weight: 600;
        }

        .reassign-btn:hover {
          background: #eef2ff;
        }

        .view-only {
          color: #9ca3af;
          font-size: 12px;
          font-weight: 600;
        }

        .empty {
          text-align: center;
          padding: 55px 20px !important;
          color: #9ca3af !important;
        }

        .empty-icon {
          font-size: 35px;
          margin-bottom: 10px;
        }

        .empty strong {
          display: block;
          color: #4b5563;
          font-size: 15px;
          margin-bottom: 5px;
        }

        .empty span {
          font-size: 13px;
        }

        /* MODAL */

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(17, 24, 39, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 9999;
        }

        .assign-modal {
          width: 100%;
          max-width: 460px;
          background: white;
          border-radius: 14px;
          box-shadow: 0 15px 45px rgba(0,0,0,0.18);
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h3 {
          margin: 0;
          color: #1f2937;
          font-size: 18px;
        }

        .modal-close {
          border: none;
          background: transparent;
          color: #6b7280;
          font-size: 24px;
          cursor: pointer;
          line-height: 1;
        }

        .modal-close:hover {
          color: #111827;
        }

        .modal-body {
          padding: 20px;
        }

        .complaint-info {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 9px;
          padding: 13px;
          margin-bottom: 18px;
        }

        .complaint-info-label {
          color: #9ca3af;
          font-size: 11px;
          text-transform: uppercase;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .complaint-info-value {
          color: #374151;
          font-size: 14px;
          font-weight: 600;
        }

        .form-label {
          display: block;
          margin-bottom: 7px;
          color: #374151;
          font-size: 13px;
          font-weight: 600;
        }

        .staff-select {
          width: 100%;
          padding: 11px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: white;
          color: #374151;
          font-size: 13px;
          outline: none;
          cursor: pointer;
        }

        .staff-select:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.08);
        }

        .no-staff {
          background: #fff7ed;
          color: #c2410c;
          border: 1px solid #fed7aa;
          padding: 11px;
          border-radius: 8px;
          font-size: 12px;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 16px 20px;
          border-top: 1px solid #e5e7eb;
        }

        .cancel-btn {
          border: 1px solid #d1d5db;
          background: white;
          color: #374151;
          padding: 9px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .cancel-btn:hover {
          background: #f9fafb;
        }

        .confirm-assign-btn {
          border: none;
          background: #4f46e5;
          color: white;
          padding: 9px 17px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .confirm-assign-btn:hover {
          background: #4338ca;
        }

        .confirm-assign-btn:disabled {
          background: #a5b4fc;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {

          .complaint-page {
            padding: 15px;
          }

          .complaint-header {
            align-items: flex-start;
            flex-direction: column;
            gap: 15px;
          }

          .header-actions {
            width: 100%;
            justify-content: space-between;
          }

          .table-header {
            padding: 15px;
          }

          .assign-modal {
            max-width: 100%;
          }

        }

      `}</style>

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="complaint-header">

        <div className="complaint-title">

          <h1>
            Complaints
          </h1>

          <p>
            View and manage complaint records
          </p>

        </div>

        <div className="header-actions">

          <span className="count-badge">
            {filtered.length} Complaints
          </span>

          {/* ONLY USER CAN RAISE */}

          {isUser && (

            <button
              className="primary-btn"
              onClick={() =>
                navigate("/complaint")
              }
            >
              + Raise Complaint
            </button>

          )}

        </div>

      </div>

      {/* =====================================
          SEARCH
      ===================================== */}

      <div className="search-box">

        <span className="search-icon">
          🔍
        </span>

        <input
          type="text"
          placeholder="Search complaints..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {search && (

          <button
            className="clear-btn"
            onClick={() =>
              setSearch("")
            }
          >
            ×
          </button>

        )}

      </div>

      {/* =====================================
          TABLE
      ===================================== */}

      <div className="table-card">

        <div className="table-header">

          <div>

            <h2>
              Complaint Records
            </h2>

          </div>

        </div>

        <div className="table-wrapper">

          <table className="data-table">

            <thead>

              <tr>

                <th>S.No</th>

                <th>Complaint Type</th>

                <th>Block</th>

                <th>Room</th>

                <th>Remarks</th>

                <th>Assigned To</th>

                <th>Status</th>

                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>

                  <td
                    colSpan="8"
                    className="empty"
                  >
                    Loading complaints...
                  </td>

                </tr>

              ) : filtered.length === 0 ? (

                <tr>

                  <td
                    colSpan="8"
                    className="empty"
                  >

                    <div className="empty-icon">
                      📋
                    </div>

                    <strong>
                      No complaints found
                    </strong>

                    <span>
                      {search
                        ? "Try a different search"
                        : "No complaints have been created yet"}
                    </span>

                  </td>

                </tr>

              ) : (

                filtered.map(
                  (item, index) => (

                    <tr
                      key={
                        item._id || index
                      }
                    >

                      {/* S.NO */}

                      <td>
                        {index + 1}
                      </td>

                      {/* COMPLAINT TYPE */}

                      <td>

                        <span className="complaint-type">

                          {item.complaintType ||
                            "General"}

                        </span>

                      </td>

                      {/* BLOCK */}

                      <td>

                        {item.block?.blockName ||
                          item.block ||
                          "-"}

                      </td>

                      {/* ROOM */}

                      <td>

                        <span className="room-badge">

                          {item.room?.roomNumber ||
                            item.roomNumber ||
                            "-"}

                        </span>

                      </td>

                      {/* REMARKS */}

                      <td>

                        <div className="remarks">

                          {item.remarks ||
                            item.complaintRemarks ||
                            "-"}

                        </div>

                      </td>

                      {/* ASSIGNED TO */}

                      <td>

                        {item.assignedTo ? (

                          <div className="assigned-person">

                            <div className="staff-avatar">

                              {(
                                item.assignedTo.name ||
                                "S"
                              )
                                .charAt(0)
                                .toUpperCase()}

                            </div>

                            <span className="staff-name">

                              {getAssignedStaffName(
                                item
                              )}

                            </span>

                          </div>

                        ) : (

                          <span className="not-assigned">
                            Not Assigned
                          </span>

                        )}

                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={getStatusClass(
                            item.status
                          )}
                        >

                          {item.status ||
                            "Pending"}

                        </span>

                      </td>

                      {/* ACTION */}

                      <td>

                        {/* =================================
                            SUPERADMIN
                        ================================= */}

                        {isSuperAdmin && (

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              flexWrap: "wrap"
                            }}
                          >

                            <button
                              className={
                                item.assignedTo
                                  ? "reassign-btn"
                                  : "assign-btn"
                              }
                              onClick={() =>
                                openAssignModal(
                                  item
                                )
                              }
                            >

                              {item.assignedTo
                                ? "Reassign"
                                : "Assign"}

                            </button>

                            <select
                              className="status-select"
                              value={
                                item.status ||
                                "Pending"
                              }
                              onChange={(e) =>
                                changeStatus(
                                  item._id,
                                  e.target.value
                                )
                              }
                            >

                              <option value="Pending">
                                Pending
                              </option>

                              <option value="Assigned">
                                Assigned
                              </option>

                              <option value="Onhold">
                                Onhold
                              </option>

                              <option value="Closed">
                                Closed
                              </option>

                            </select>

                          </div>

                        )}

                        {/* =================================
                            USER + STAFF
                        ================================= */}

                        {(isUser || isStaff) && (

                          <span className="view-only">
                            View Only
                          </span>

                        )}

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =====================================
          ASSIGN MODAL
      ===================================== */}

      {showAssignModal && (

        <div
          className="modal-overlay"
          onClick={(e) => {

            if (
              e.target ===
              e.currentTarget
            ) {
              closeAssignModal();
            }

          }}
        >

          <div className="assign-modal">

            <div className="modal-header">

              <h3>
                {selectedComplaint?.assignedTo
                  ? "Reassign Complaint"
                  : "Assign Complaint"}
              </h3>

              <button
                className="modal-close"
                onClick={closeAssignModal}
                disabled={assignLoading}
              >
                ×
              </button>

            </div>

            <div className="modal-body">

              {selectedComplaint && (

                <div className="complaint-info">

                  <div className="complaint-info-label">
                    Complaint
                  </div>

                  <div className="complaint-info-value">

                    {selectedComplaint.complaintType ||
                      "General"}

                  </div>

                </div>

              )}

              <label className="form-label">
                Select Staff
              </label>

              {users.length === 0 ? (

                <div className="no-staff">

                  No staff users found.

                  <br />

                  Please create a staff user
                  before assigning the complaint.

                </div>

              ) : (

                <select
                  className="staff-select"
                  value={selectedStaff}
                  onChange={(e) =>
                    setSelectedStaff(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    -- Select Staff --
                  </option>

                  {users.map(
                    (staff) => (

                      <option
                        key={staff._id}
                        value={staff._id}
                      >

                        {staff.name}

                        {staff.email
                          ? ` - ${staff.email}`
                          : ""}

                      </option>

                    )
                  )}

                </select>

              )}

            </div>

            <div className="modal-footer">

              <button
                className="cancel-btn"
                onClick={closeAssignModal}
                disabled={assignLoading}
              >
                Cancel
              </button>

              <button
                className="confirm-assign-btn"
                onClick={assignComplaint}
                disabled={
                  assignLoading ||
                  !selectedStaff ||
                  users.length === 0
                }
              >

                {assignLoading
                  ? "Assigning..."
                  : selectedComplaint?.assignedTo
                    ? "Reassign Complaint"
                    : "Assign Complaint"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default ComplaintList;