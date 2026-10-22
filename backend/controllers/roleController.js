const Role = require("../models/Role");

// ===============================
// GET ALL ROLES
// ===============================
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: 1 });

    // Make sure old roles also get the correct type
    const updatedRoles = roles.map((role) => {
      const roleName = role.roleName
        .toLowerCase()
        .trim();

      const roleType =
        roleName === "superadmin" ||
        roleName === "user"
          ? "System Role"
          : "Staff";

      return {
        ...role.toObject(),
        roleType
      };
    });

    res.status(200).json(updatedRoles);

  } catch (error) {
    console.error("GET ROLES ERROR:", error);

    res.status(500).json({
      message: "Unable to load roles",
      error: error.message
    });
  }
};


// ===============================
// CREATE ROLE
// ===============================
exports.createRole = async (req, res) => {
  try {
    const { roleName } = req.body;

    if (!roleName || !roleName.trim()) {
      return res.status(400).json({
        message: "Role name is required"
      });
    }

    const name = roleName.trim();

    // Check duplicate
    const existingRole = await Role.findOne({
      roleName: {
        $regex: `^${name}$`,
        $options: "i"
      }
    });

    if (existingRole) {
      return res.status(400).json({
        message: "Role already exists"
      });
    }

    // Only Superadmin and User are System Roles
    const normalizedName = name
      .toLowerCase()
      .trim();

    const roleType =
      normalizedName === "superadmin" ||
      normalizedName === "user"
        ? "System Role"
        : "Staff";

    const role = await Role.create({
      roleName: name,
      roleType
    });

    res.status(201).json({
      message: "Role added successfully",
      role
    });

  } catch (error) {
    console.error("CREATE ROLE ERROR:", error);

    res.status(500).json({
      message: "Unable to create role",
      error: error.message
    });
  }
};


// ===============================
// UPDATE ROLE
// ===============================
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleName } = req.body;

    if (!roleName || !roleName.trim()) {
      return res.status(400).json({
        message: "Role name is required"
      });
    }

    const name = roleName.trim();

    // Check duplicate role
    const existingRole = await Role.findOne({
      roleName: {
        $regex: `^${name}$`,
        $options: "i"
      },
      _id: {
        $ne: id
      }
    });

    if (existingRole) {
      return res.status(400).json({
        message: "Role already exists"
      });
    }

    const normalizedName = name
      .toLowerCase()
      .trim();

    // Only these two are System Roles
    const roleType =
      normalizedName === "superadmin" ||
      normalizedName === "user"
        ? "System Role"
        : "Staff";

    const updatedRole =
      await Role.findByIdAndUpdate(
        id,
        {
          roleName: name,
          roleType
        },
        {
          new: true,
          runValidators: true
        }
      );

    if (!updatedRole) {
      return res.status(404).json({
        message: "Role not found"
      });
    }

    res.status(200).json({
      message: "Role updated successfully",
      role: updatedRole
    });

  } catch (error) {
    console.error("UPDATE ROLE ERROR:", error);

    res.status(500).json({
      message: "Unable to update role",
      error: error.message
    });
  }
};


// ===============================
// DELETE ROLE
// ===============================
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByIdAndDelete(id);

    if (!role) {
      return res.status(404).json({
        message: "Role not found"
      });
    }

    res.status(200).json({
      message: "Role deleted successfully"
    });

  } catch (error) {
    console.error("DELETE ROLE ERROR:", error);

    res.status(500).json({
      message: "Unable to delete role",
      error: error.message
    });
  }
};