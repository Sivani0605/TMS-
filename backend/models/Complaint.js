const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },

    programme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Programme",
      required: true
    },

    block: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Block",
      required: true
    },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },

    complaintType: {
      type: String,
      required: true
    },

    remarks: {
      type: String
    },

    attachment: {
      type: String
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Assigned",
        "Onhold",
        "Closed"
      ],
      default: "Pending"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);