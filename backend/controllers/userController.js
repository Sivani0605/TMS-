const User = require("../models/User");
const bcrypt = require("bcryptjs");

// ===============================
// GET ALL USERS
// ===============================
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("role", "roleName")
      .select("-password");

    res.json(users);
  } catch (error) {
    console.error("Get Users Error:", error);

    res.status(500).json({
      message: "Unable to get users",
    });
  }
};

// ===============================
// CREATE USER
// ===============================
exports.createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
    } = req.body;

    // Required fields
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // Check existing email
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role,
    });

    const responseUser = await User.findById(
      user._id
    )
      .populate("role", "roleName")
      .select("-password");

    res.status(201).json(responseUser);

  } catch (error) {
    console.error("Create User Error:", error);

    res.status(500).json({
      message: "Unable to create user",
    });
  }
};

// ===============================
// UPDATE USER
// ===============================
exports.updateUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      role,
    } = req.body;

    const user = await User.findById(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = name;
    user.email = email.toLowerCase();
    user.phone = phone;
    user.role = role;

    // Change password only if entered
    if (password && password.trim() !== "") {
      user.password = await bcrypt.hash(
        password,
        10
      );
    }

    await user.save();

    const updatedUser = await User.findById(
      user._id
    )
      .populate("role", "roleName")
      .select("-password");

    res.json(updatedUser);

  } catch (error) {
    console.error("Update User Error:", error);

    res.status(500).json({
      message: "Unable to update user",
    });
  }
};

// ===============================
// DELETE USER
// ===============================
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User deleted successfully",
    });

  } catch (error) {
    console.error("Delete User Error:", error);

    res.status(500).json({
      message: "Unable to delete user",
    });
  }
};