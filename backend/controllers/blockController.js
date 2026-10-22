const Block = require("../models/Block");

exports.getBlocks = async (req, res) => {
  const data = await Block.find();
  res.json(data);
};

exports.createBlock = async (req, res) => {
  const data = await Block.create(req.body);
  res.status(201).json(data);
};

exports.updateBlock = async (req, res) => {
  const data = await Block.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(data);
};

exports.deleteBlock = async (req, res) => {
  await Block.findByIdAndDelete(req.params.id);
  res.json({ message: "Block Deleted" });
};