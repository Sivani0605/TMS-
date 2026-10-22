const Department =
  require("../models/Department");

exports.getDepartments = async (req, res) => {
  const data = await Department.find();
  res.json(data);
};

exports.createDepartment = async (req, res) => {
  const data =
    await Department.create(req.body);

  res.status(201).json(data);
};

exports.updateDepartment = async (req, res) => {
  const data =
    await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

  res.json(data);
};

exports.deleteDepartment = async (req, res) => {
  await Department.findByIdAndDelete(
    req.params.id
  );

  res.json({
    message: "Department Deleted"
  });
};