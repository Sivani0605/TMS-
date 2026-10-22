const mongoose = require("mongoose");

const programmeSchema =
  new mongoose.Schema(
    {
      department: String,
      programme: String,
      shortName: String
    },
    {
      timestamps: true
    }
  );

module.exports = mongoose.model(
  "Programme",
  programmeSchema
);