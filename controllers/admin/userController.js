const { validationResult } = require("express-validator");
const User = require("../../models/User");

const jwt = require("jsonwebtoken");

exports.list = async (req, res) => {
  const { page = 1, limit = 10, search = "", status } = req.query;

  let aggregatedQuery = User.aggregate([
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $project: {
        password: 0,
      },
    },
    {
      $match: {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { address: { $regex: search, $options: "i" } },
        ],
      },
    },
    {
      $match: {
        status: status ? status : { $regex: ".*" },
        role: { $ne: "admin" },
      },
    },
  ]);

  let options = {
    page,
    limit,
  };
  if (limit === -1) {
    options.limit = 100000000000;
  }

  const users = await User.aggregatePaginate(aggregatedQuery, options);

  res.json(users);
};

exports.edit = async (req, res) => {
  // check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  const { name, email, phone, role, address, status, commission } = req.body;

  user.name = name;
  user.email = email;
  user.phone = phone;
  user.role = role;
  user.address = address;
  user.status = status;
  user.commission = commission;

  await user.save();

  return res.json({ message: "User updated successfully" });
};

exports.toggleStatus = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  user.status = user.status === "inactive" ? "active" : "inactive";

  await user.save();

  return res.json({ message: "User status updated successfully" });
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

exports.create = async (req, res) => {
  // check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { password, name, email, phone, address, status, commission, role } =
    req.body;

  const user = new User({
    name,
    email,
    phone,
    address,
    status,
    commission,
    role,
  });

  user.password = await user.encryptPassword(password);

  await user.save();

  return res.json({ message: "User created successfully" });
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  return res.json({ message: "User deleted successfully" });
};
