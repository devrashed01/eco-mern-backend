const router = require("express").Router();
const { check } = require("express-validator");

const auth = require("../middleware/auth");

const {
  resetPassword,
  changePassword,
  login,
  register,
} = require("../controllers/authController");

// @route POST api/auth/register
// @desc Register user
// @access Public
router.post(
  "/register",
  [
    check("email", "Email is required").isEmail(),
    check("phone", "Phone number is required").not().isEmpty(),
    check("name", "Name is required").not().isEmpty(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  register
);

// @route POST api/auth/login
// @desc Login user
// @access Public
router.post(
  "/login",
  [
    check("email", "Email is required").not().isEmpty(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  login
);

// @route POST api/auth/changePassword
// @desc changePassword
// @access Private
router.put(
  "/changePassword",
  auth,
  [
    check("old_password", "Email is required").not().isEmpty(),
    check("new_password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
    check(
      "confirm_password",
      "Confirm Password must be at least 6 characters"
    ).isLength({
      min: 6,
    }),
  ],
  changePassword
);

// @route GET api/auth/resetPassword/:token
// @desc Reset password
// @access Private
router.post(
  "/resetPassword",
  [
    check("passwordResetToken", "Token is required").not().isEmpty(),
    check("newPassword", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
    check(
      "confirmPassword",
      "Confirm Password must be at least 6 characters"
    ).isLength({
      min: 6,
    }),
  ],
  resetPassword
);

module.exports = router;
