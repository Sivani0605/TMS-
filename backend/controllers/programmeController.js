const Programme =
  require("../models/Programme");

exports.getProgrammes = async (req, res) => {
  const data = await Programme.find();
  res.json(data);
};

exports.createProgramme = async (req, res) => {
  const data =
    await Programme.create(req.body);

  res.status(201).json(data);
};

exports.updateProgramme = async (req, res) => {
  const data =
    await Programme.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

  res.json(data);
};

exports.deleteProgramme = async (req, res) => {
  await Programme.findByIdAndDelete(
    req.params.id
  );

  res.json({
    message: "Programme Deleted"
  });
};