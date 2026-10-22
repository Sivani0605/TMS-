const Complaint =
  require("../models/Complaint");

exports.getReport = async (req, res) => {
  const filter = {};

  if (req.query.status)
    filter.status = req.query.status;

  if (req.query.assignedTo)
    filter.assignedTo =
      req.query.assignedTo;

  const data =
    await Complaint.find(filter);

  res.json(data);
};