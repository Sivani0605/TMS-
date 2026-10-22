import { useEffect, useState } from "react";
import axios from "axios";

function Reports() {
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    department: "",
    programme: "",
    complaintType: "",
    status: "",
    assignee: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [complaintRes, departmentRes, programmeRes] =
        await Promise.all([
          axios.get(
            "http://localhost:5000/api/complaints",
            config
          ),
          axios.get(
            "http://localhost:5000/api/departments",
            config
          ),
          axios.get(
            "http://localhost:5000/api/programmes",
            config
          ),
        ]);

      const complaintData = complaintRes.data;
      const departmentData = departmentRes.data;
      const programmeData = programmeRes.data;

      setComplaints(
        Array.isArray(complaintData)
          ? complaintData
          : complaintData.complaints || []
      );

      setDepartments(
        Array.isArray(departmentData)
          ? departmentData
          : departmentData.departments || []
      );

      setProgrammes(
        Array.isArray(programmeData)
          ? programmeData
          : programmeData.programmes || []
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to load report data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({
      department: "",
      programme: "",
      complaintType: "",
      status: "",
      assignee: "",
    });

    setGenerated(false);
  };

  const generateReport = () => {
    setGenerated(true);
  };

  const filteredComplaints = complaints.filter((item) => {
    const departmentId =
      item.department?._id ||
      item.department ||
      "";

    const programmeId =
      item.programme?._id ||
      item.programme ||
      "";

    const assigneeName =
      item.assignee?.name ||
      item.assignee?.roleName ||
      item.assignee ||
      "";

    const departmentMatch =
      !filters.department ||
      departmentId === filters.department;

    const programmeMatch =
      !filters.programme ||
      programmeId === filters.programme;

    const complaintTypeMatch =
      !filters.complaintType ||
      item.complaintType === filters.complaintType;

    const statusMatch =
      !filters.status ||
      item.status === filters.status;

    const assigneeMatch =
      !filters.assignee ||
      assigneeName
        .toString()
        .toLowerCase()
        .includes(filters.assignee.toLowerCase());

    return (
      departmentMatch &&
      programmeMatch &&
      complaintTypeMatch &&
      statusMatch &&
      assigneeMatch
    );
  });

  const getStatusClass = (status) => {
    const value = status?.toLowerCase();

    if (value === "pending") {
      return "status pending";
    }

    if (value === "assigned") {
      return "status assigned";
    }

    if (
      value === "in-progress" ||
      value === "in progress"
    ) {
      return "status progress";
    }

    if (value === "onhold") {
      return "status onhold";
    }

    if (
      value === "completed" ||
      value === "closed"
    ) {
      return "status completed";
    }

    return "status";
  };

  return (
    <div className="master-page">

      {/* PAGE HEADER */}

      <div className="page-title">
        <div>
          <h1>Complaint Reports</h1>

          <p>
            Generate and view complaint details reports
          </p>
        </div>

        <div className="page-count">
          {generated
            ? `${filteredComplaints.length} Records`
            : "Report"}
        </div>
      </div>

      {/* FILTER CARD */}

      <div className="form-card">

        <div className="section-heading">

          <div className="section-icon">
            📊
          </div>

          <div>
            <h2>Report Filters</h2>

            <p>
              Select filters to generate complaint report
            </p>
          </div>

        </div>

        <div className="form-row">

          {/* DEPARTMENT */}

          <div className="form-group">

            <label>Department</label>

            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
            >
              <option value="">
                All Departments
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

          {/* PROGRAMME */}

          <div className="form-group">

            <label>Programme</label>

            <select
              name="programme"
              value={filters.programme}
              onChange={handleFilterChange}
            >
              <option value="">
                All Programmes
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

          {/* COMPLAINT TYPE */}

          <div className="form-group">

            <label>Complaint Type</label>

            <select
              name="complaintType"
              value={filters.complaintType}
              onChange={handleFilterChange}
            >
              <option value="">
                All Types
              </option>

              <option value="PC Hardware">
                PC Hardware
              </option>

              <option value="PC Software">
                PC Software
              </option>

              <option value="Application Issues">
                Application Issues
              </option>

              <option value="Network">
                Network
              </option>

              <option value="Electronics">
                Electronics
              </option>

              <option value="Plumbing">
                Plumbing
              </option>

              <option value="Other">
                Other
              </option>
            </select>

          </div>

          {/* STATUS */}

          <div className="form-group">

            <label>Status</label>

            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">
                All Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Assigned">
                Assigned
              </option>

              <option value="In-Progress">
                In-Progress
              </option>

              <option value="Onhold">
                Onhold
              </option>

              <option value="Completed">
                Completed
              </option>
            </select>

          </div>

          {/* ASSIGNEE */}

          <div className="form-group">

            <label>Assignee</label>

            <input
              type="text"
              name="assignee"
              placeholder="Search assignee"
              value={filters.assignee}
              onChange={handleFilterChange}
            />

          </div>

        </div>

        {/* BUTTONS */}

        <div className="form-buttons">

          <button
            type="button"
            className="btn-secondary"
            onClick={clearFilters}
          >
            Clear
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={generateReport}
          >
            📊 Generate Report
          </button>

        </div>

      </div>

      {/* REPORT */}

      {generated && (

        <div className="table-card">

          <div className="table-header">

            <div>
              <h2>
                Complaint Details Report
              </h2>

              <p>
                {filteredComplaints.length} complaint
                {filteredComplaints.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>
            </div>

            <button
              className="refresh-btn"
              onClick={() => window.print()}
            >
              🖨️ Print
            </button>

          </div>

          {loading ? (

            <div className="loading">
              Loading report...
            </div>

          ) : filteredComplaints.length === 0 ? (

            <div className="empty">

              <div>
                📋
              </div>

              <strong>
                No complaints found
              </strong>

              <span>
                Try changing your report filters
              </span>

            </div>

          ) : (

            <div className="table-wrapper">

              <table className="data-table">

                <thead>

                  <tr>
                    <th>S.No</th>
                    <th>Complaint Type</th>
                    <th>Block</th>
                    <th>Room</th>
                    <th>Status</th>
                    <th>Assignee</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredComplaints.map(
                    (item, index) => (

                      <tr key={item._id || index}>

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          <strong>
                            {item.complaintType ||
                              "General"}
                          </strong>
                        </td>

                        <td>
                          {item.block?.blockName ||
                            item.block ||
                            "-"}
                        </td>

                        <td>
                          <span className="room-badge">
                            {item.room?.roomNumber ||
                              item.roomNumber ||
                              "-"}
                          </span>
                        </td>

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

                        <td>
                          {item.assignee?.name ||
                            item.assignee?.roleName ||
                            item.assignee ||
                            "Not Assigned"}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      )}

    </div>
  );
}

export default Reports;