const router = require("express").Router();
const fs = require("fs");

const User = require("../models/User");
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const upload = require("../utils/multer");
const { getErrors } = require("../utils");

// @route GET api/user/profile
// @desc Get user
// @access Private
router.get("/profile", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return res.status(400).json({ message: "User not found" });
  res.json(user);
});

// @route PUT api/user/profile
// @desc Edit profile
// @access Private
router.patch(
  "/profile",
  auth,
  upload.single("avatar"),
  [
    check("phone", "Please include a valid phone number").isMobilePhone(),
    check("name", "Name is required").not().isEmpty(),
    check("address", "Address is required").not().isEmpty(),
  ],
  async (req, res) => {
    // check for errors
    const errors = getErrors(req);
    if (errors)
      return res.status(400).json({ errors, message: "Validation error!" });

    const { phone, name, address } = req.body;

    // check if user exists
    let user = await User.findById(req.user._id).select("-password");
    if (!user)
      return res.status(400).json({ errors: [{ message: "User not found" }] });

    const avatar = req.file ? req.file.path : user.avatar;

    // remove old avatar
    if (req.file) {
      if (user.avatar) {
        fs.unlink(user.avatar, (err) => {
          if (err) console.log(err);
        });
      }
    }

    // update user
    user.phone = phone;
    user.name = name;
    user.address = address;
    user.avatar = avatar;

    // save new user
    await user.save();

    return res.json({ message: "User updated successfully" });
  }
);

// @route GET api/user/:id
// @desc Get user by id
// @access Private
router.get("/details/:id", auth, async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user)
    return res.status(404).json({ message: "User with given id not found" });

  res.json(user);
});

module.exports = router;
