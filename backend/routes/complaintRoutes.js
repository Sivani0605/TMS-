const router = require("express").Router();

const auth = require("../middleware/authMiddleware");

const controller = require("../controllers/complaintController");


// ===============================
// CREATE COMPLAINT
// User + SuperAdmin
// ===============================
router.post(
  "/",
  auth,
  controller.createComplaint
);


// ===============================
// GET COMPLAINTS
// Role-based filtering
// ===============================
router.get(
  "/",
  auth,
  controller.getComplaints
);


// ===============================
// ASSIGN COMPLAINT
// SuperAdmin only
// ===============================
router.put(
  "/:id/assign",
  auth,
  controller.assignComplaint
);


// ===============================
// UPDATE COMPLAINT STATUS
// Assigned Staff / SuperAdmin
// ===============================
router.put(
  "/:id",
  auth,
  controller.updateComplaint
);


module.exports = router;