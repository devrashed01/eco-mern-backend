const router = require("express").Router();

const { check } = require("express-validator");
const {
  list,
  editUser,
  deactivateUser,
  activateUser,
  generateResetPasswordLink,
} = require("../../controllers/admin/userController");

router.get("/list", list);
router.patch(
  "/edit/:id",
  [
    check("name", "Email is required").not().isEmpty(),
    check("phone", "Phone number is required").isMobilePhone(),
    check("email", "Email is required").isEmail(),
    check("role", "Role is required").isIn(["admin", "seller"]),
    check("address", "Address is required").not().isEmpty(),
  ],
  editUser
);
router.put("/deactivate/:id", deactivateUser);
router.put("/activate/:id", activateUser);
router.get("/generateResetPasswordLink/:id", generateResetPasswordLink);

module.exports = router;
