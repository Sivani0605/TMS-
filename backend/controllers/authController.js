const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =====================================
// REGISTER
// =====================================
exports.register = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      password,
      role,
      department,
      programme
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create user
    const user = await User.create({
      name,
      phone,
      email,
      password: hashedPassword,
      role,
      department,
      programme
    });

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);

    res.status(500).json({
      message: err.message
    });
  }
};


// =====================================
// LOGIN
// =====================================
exports.login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    // Find user and populate role
    const user = await User.findOne({ email })
      .populate("role");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Check password
    const match = await bcrypt.compare(
      password,
      user.password
    );

    if (!match) {
      return res.status(400).json({
        message: "Invalid Password"
      });
    }

    // Check role
    if (!user.role) {
      return res.status(400).json({
        message: "User role not found"
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,

        // IMPORTANT:
        // Role model uses roleName
        role: user.role.roleName
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    // Remove password from response
    const userResponse = user.toObject();

    delete userResponse.password;

    res.json({
      message: "Login successful",
      token,
      user: userResponse
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    res.status(500).json({
      message: err.message
    });
  }
};