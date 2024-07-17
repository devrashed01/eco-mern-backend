const passport = require("passport");
const router = require("express").Router();
const { check } = require("express-validator");

const auth = require("../middleware/auth");

const {
  resetPassword,
  changePassword,
  login,
  register,
  googleAuth,
} = require("../controllers/authController");
const User = require("../models/User");

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

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

router.get("/google/callback", passport.authenticate("google"), googleAuth);

module.exports = router;
