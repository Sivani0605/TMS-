import React, { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    closed: 0,
  });

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await api.get("/complaints");

      const data = response.data;

      const complaintList = Array.isArray(data)
        ? data
        : data.complaints || [];

      setComplaints(complaintList);

      const total = complaintList.length;

      const pending = complaintList.filter(
        (item) =>
          item.status?.toLowerCase() === "pending"
      ).length;

      const assigned = complaintList.filter(
        (item) =>
          item.status?.toLowerCase() === "assigned"
      ).length;

      const closed = complaintList.filter(
        (item) =>
          item.status?.toLowerCase() === "completed" ||
          item.status?.toLowerCase() === "closed"
      ).length;

      setStats({
        total,
        pending,
        assigned,
        closed,
      });
    } catch (error) {
      console.error("Dashboard error:", error);

      setStats({
        total: 0,
        pending: 0,
        assigned: 0,
        closed: 0,
      });

      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "status pending";

      case "assigned":
        return "status assigned";

      case "completed":
      case "closed":
        return "status completed";

      case "in-progress":
        return "status progress";

      case "onhold":
        return "status onhold";

      default:
        return "status";
    }
  };

  return (
    <div className="dashboard-page">

      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Complaints Dashboard</h1>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="dashboard-stats">

        {/* TOTAL */}
        <div className="dashboard-card">
          <div className="card-top">
            <div className="card-icon total-icon">
              🎫
            </div>

            <span className="card-label">
              Total Complaints
            </span>
          </div>

          <h2>
            {loading ? "..." : stats.total}
          </h2>

          <p>All complaints</p>
        </div>

        {/* PENDING */}
        <div className="dashboard-card">
          <div className="card-top">
            <div className="card-icon pending-icon">
              ⏳
            </div>

            <span className="card-label">
              Pending
            </span>
          </div>

          <h2>
            {loading ? "..." : stats.pending}
          </h2>

          <p>Waiting for action</p>
        </div>

        {/* ASSIGNED */}
        <div className="dashboard-card">
          <div className="card-top">
            <div className="card-icon assigned-icon">
              👨‍🔧
            </div>

            <span className="card-label">
              Assigned
            </span>
          </div>

          <h2>
            {loading ? "..." : stats.assigned}
          </h2>

          <p>Assigned to staff</p>
        </div>

        {/* CLOSED */}
        <div className="dashboard-card">
          <div className="card-top">
            <div className="card-icon completed-icon">
              ✓
            </div>

            <span className="card-label">
              Closed
            </span>
          </div>

          <h2>
            {loading ? "..." : stats.closed}
          </h2>

          <p>Successfully completed</p>
        </div>

      </div>

      {/* RECENT COMPLAINTS */}
      <div className="dashboard-table-card">

        <div className="dashboard-table-header">
          <div>
            <h2>Recent Complaints</h2>
          </div>

          <span className="complaint-count">
            {complaints.length} Records
          </span>
        </div>

        {loading ? (
          <div className="dashboard-empty">
            Loading complaints...
          </div>
        ) : complaints.length === 0 ? (
          <div className="dashboard-empty">
            <div className="empty-icon">
              📋
            </div>

            <h3>No Complaints Found</h3>
          </div>
        ) : (
          <div className="dashboard-table-wrapper">

            <table className="dashboard-table">

              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Problem</th>
                  <th>Type</th>
                  <th>Room</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {complaints
                  .slice(0, 5)
                  .map((item, index) => (

                    <tr key={item._id || index}>

                      {/* S.NO */}
                      <td>
                        <strong>
                          {index + 1}
                        </strong>
                      </td>

                      {/* PROBLEM */}
                      <td>
                        {item.complaintRemarks ||
                          item.problem ||
                          item.remarks ||
                          "Complaint"}
                      </td>

                      {/* TYPE */}
                      <td>
                        {item.complaintType ||
                          item.type ||
                          "-"}
                      </td>

                      {/* ROOM */}
                      <td>
                        {item.roomNumber ||
                          item.room?.roomNumber ||
                          "-"}
                      </td>

                      {/* STATUS */}
                      <td>
                        <span
                          className={getStatusClass(
                            item.status
                          )}
                        >
                          {item.status || "Pending"}
                        </span>
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

export default Dashboard;