const { validationResult } = require("express-validator");
const User = require("../../models/User");

const jwt = require("jsonwebtoken");

exports.list = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  let query = null;

  if (search) {
    query = { name: { $regex: search, $options: "i" } };
  }

  try {
    const users = await User.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("-password");
    if (!users) return res.status(404).json({ message: "No users found" });

    const totalDocs = await User.countDocuments(query);

    res.json({
      data: users,
      count: totalDocs,
      message: "Users retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.editUser = async (req, res) => {
  // check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  const { name, email, phone, role, address } = req.body;

  user.name = name;
  user.email = email;
  user.phone = phone;
  user.role = role;
  user.address = address;

  await user.save();

  return res.json({ message: "User updated successfully" });
};

exports.deactivateUser = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  user.status = "inactive";

  await user.save();

  return res.json({ message: "User deactivated successfully" });
};

exports.activateUser = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  user.status = "active";

  await user.save();

  return res.json({ message: "User activated successfully" });
};

exports.generateResetPasswordLink = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  // Generate token
  const token = jwt.sign({ _id: user._id }, process.env.RESET_PASSWORD_SECRET, {
    expiresIn: "30s",
  });

  // Generate reset password link with token
  const resetPasswordLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

  return res.json({
    message: "Reset password link generated successfully",
    resetPasswordLink,
  });
};
