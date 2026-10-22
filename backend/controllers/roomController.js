const Room = require("../models/Room");

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate("department", "department shortName")
      .populate("programme", "programme shortName")
      .populate("block", "blockName");

    res.json(rooms);
  } catch (error) {
    res.status(500).json({
      message: "Unable to get rooms",
      error: error.message,
    });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);

    const data = await Room.findById(room._id)
      .populate("department", "department shortName")
      .populate("programme", "programme shortName")
      .populate("block", "blockName");

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Unable to create room",
      error: error.message,
    });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("department", "department shortName")
      .populate("programme", "programme shortName")
      .populate("block", "blockName");

    res.json(room);
  } catch (error) {
    res.status(500).json({
      message: "Unable to update room",
      error: error.message,
    });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);

    res.json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to delete room",
      error: error.message,
    });
  }
};