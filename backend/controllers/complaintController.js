const Complaint = require("../models/Complaint");
const User = require("../models/User");


// ==========================================
// CREATE COMPLAINT
// ==========================================
exports.createComplaint = async (req, res) => {
  try {
    const {
      department,
      programme,
      block,
      room,
      complaintType,
      remarks,
      attachment
    } = req.body;

    if (
      !department ||
      !programme ||
      !block ||
      !room ||
      !complaintType
    ) {
      return res.status(400).json({
        message: "All required fields are required"
      });
    }

    const userId =
      req.user.id ||
      req.user._id ||
      req.user.userId;

    if (!userId) {
      return res.status(401).json({
        message: "User authentication failed"
      });
    }

    const complaint = new Complaint({
      department,
      programme,
      block,
      room,
      complaintType,
      remarks,
      attachment,
      createdBy: userId,
      status: "Pending"
    });

    await complaint.save();

    const result = await Complaint.findById(complaint._id)
      .populate("department")
      .populate("programme")
      .populate("block")
      .populate("room")
      .populate("createdBy")
      .populate("assignedTo");

    res.status(201).json({
      message: "Complaint created successfully",
      complaint: result
    });

  } catch (error) {
    console.error("CREATE COMPLAINT ERROR:", error);

    res.status(500).json({
      message: "Failed to create complaint",
      error: error.message
    });
  }
};


// ==========================================
// GET COMPLAINTS
// ==========================================
exports.getComplaints = async (req, res) => {
  try {
    const userId =
      req.user.id ||
      req.user._id ||
      req.user.userId;

    const roleName =
      req.user.role?.roleName ||
      req.user.role?.name ||
      req.user.role ||
      "";

    const normalizedRole = String(roleName)
      .toLowerCase()
      .trim();

    let filter = {};

    // SuperAdmin and Admin see all complaints
    if (
      normalizedRole === "superadmin" ||
      normalizedRole === "admin"
    ) {
      filter = {};
    }

    // Normal User sees only complaints created by them
    else if (normalizedRole === "user") {
      filter = {
        createdBy: userId
      };
    }

    // Staff sees only complaints assigned to them
    else {
      filter = {
        assignedTo: userId
      };
    }

    const complaints = await Complaint.find(filter)
      .populate("department")
      .populate("programme")
      .populate("block")
      .populate("room")
      .populate("createdBy")
      .populate("assignedTo")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Complaints fetched successfully",
      complaints
    });

  } catch (error) {
    console.error("GET COMPLAINTS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch complaints",
      error: error.message
    });
  }
};


// ==========================================
// ASSIGN COMPLAINT
// ==========================================
exports.assignComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({
        message: "Please select a staff member"
      });
    }

    // Find complaint
    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    // Find staff user
    const staff = await User.findById(assignedTo);

    if (!staff) {
      return res.status(404).json({
        message: "Staff user not found"
      });
    }

    // Get staff role
    let staffRole = "";

    if (staff.role && typeof staff.role === "object") {
      staffRole =
        staff.role.roleName ||
        staff.role.name ||
        "";
    } else {
      staffRole = staff.role || "";
    }

    const normalizedStaffRole = String(staffRole)
      .toLowerCase()
      .trim();

    // Prevent assigning to normal User or SuperAdmin
    if (
      normalizedStaffRole === "user" ||
      normalizedStaffRole === "superadmin"
    ) {
      return res.status(400).json({
        message: "Complaint can only be assigned to staff"
      });
    }

    // Assign staff and update status
    complaint.assignedTo = assignedTo;
    complaint.status = "Assigned";

    await complaint.save();

    const updatedComplaint = await Complaint.findById(id)
      .populate("department")
      .populate("programme")
      .populate("block")
      .populate("room")
      .populate("createdBy")
      .populate("assignedTo");

    res.status(200).json({
      message: "Complaint assigned successfully",
      complaint: updatedComplaint
    });

  } catch (error) {
    console.error("ASSIGN COMPLAINT ERROR:", error);

    res.status(500).json({
      message: "Failed to assign complaint",
      error: error.message
    });
  }
};


// ==========================================
// UPDATE COMPLAINT STATUS
// ==========================================
exports.updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Assigned",
      "Onhold",
      "Closed"
    ];

    if (!status) {
      return res.status(400).json({
        message: "Status is required"
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid complaint status"
      });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found"
      });
    }

    complaint.status = status;

    await complaint.save();

    const updatedComplaint = await Complaint.findById(id)
      .populate("department")
      .populate("programme")
      .populate("block")
      .populate("room")
      .populate("createdBy")
      .populate("assignedTo");

    res.status(200).json({
      message: "Complaint status updated successfully",
      complaint: updatedComplaint
    });

  } catch (error) {
    console.error("UPDATE COMPLAINT ERROR:", error);

    res.status(500).json({
      message: "Failed to update complaint status",
      error: error.message
    });
  }
};

