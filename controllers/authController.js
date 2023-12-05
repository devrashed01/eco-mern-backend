const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { getErrors } = require("../utils");

exports.resetPassword = async (req, res) => {
  // check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  // destructure request body
  const { newPassword, confirmPassword, passwordResetToken } = req.body;

  // check if token exists
  if (!passwordResetToken)
    return res.status(400).json({ message: "Invalid credentials" });

  // check if passwords match
  if (newPassword !== confirmPassword) {
    return res.status(422).json({ message: "Password does not match!" });
  }

  // decode token
  const payload = jwt.verify(
    passwordResetToken,
    process.env.RESET_PASSWORD_SECRET
  );
  if (!payload) return res.status(400).json({ message: "Invalid credentials" });

  // check if user exists
  let user = await User.findById(payload._id);
  if (!user) return res.status(400).json({ message: "User not found" });

  // hash password
  user.password = await user.encryptPassword(newPassword);

  // save new user
  await user.save();

  return res.json({ message: "Password reset successful" });
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(422).json({ message: "Invalid credentials" });
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(422).json({ message: "User could not found!" });
  }

  // check if password matches
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return res.status(422).json({ message: "Invalid credentials" });
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  user.password = passwordHash;
  await user.save();

  return res.json({
    status: "success",
    message: "Password updated successfully",
  });
};

exports.login = async (req, res) => {
  // check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res
      .status(400)
      .json({ errors: errors.array(), message: "Invalid credentials" });

  // destructure request body
  const { email, password } = req.body;

  const users = await User.find();
  return res.json(users);

  // check if user exists
  let user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });
  if (user?.status === "pending")
    return res
      .status(400)
      .json({ message: "Your account is not approved yet" });
  if (user?.status === "inactive")
    return res.status(400).json({ message: "Your account is or suspended" });

  // check if password matches
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  // return jsonwebtoken
  const token = user.generateAuthToken();
  res.json({ token, message: "Login successful" });
};

exports.register = async (req, res) => {
  // check for errors
  const errors = getErrors(req);
  if (errors)
    return res.status(400).json({ errors, message: "Validation error" });

  // destructure request body
  const { email, phone, name, password } = req.body;

  // check if user exists
  let user = await User.findOne({ email });
  if (user)
    return res
      .status(400)
      .json({ errors: [{ message: "User already exists" }] });

  // create new user
  user = await new User({ email, phone, name });
  user.password = await user.encryptPassword(password);

  // save new user
  await user.save();

  // return jsonwebtoken
  const token = user.generateAuthToken();
  res.json({ token });
};
