const mongoose = require("mongoose");

const blockSchema =
  new mongoose.Schema(
    {
      department: String,
      programme: String,
      blockName: String
    },
    {
      timestamps: true
    }
  );

module.exports = mongoose.model(
  "Block",
  blockSchema
);