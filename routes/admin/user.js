const router = require("express").Router();

const { check } = require("express-validator");

const {
  list,
  edit,
  toggleStatus,
  activate,
  generateResetPasswordLink,
  create,
  deleteUser,
} = require("../../controllers/admin/userController");

router.post(
  "/create",
  [
    check("password", "Password is required").isLength({ min: 6 }),
    check("name", "Email is required").not().isEmpty(),
    check("email", "Email is required").isEmail(),
    check("phone", "Phone number is required").isMobilePhone(),
    check("address", "Address is required").not().isEmpty(),
    check("status", "Status is required").isIn(["active", "inactive"]),
    check("commission", "Commission is required").isNumeric(),
    check("role", "Role is required").isIn(["admin", "seller"]),
  ],
  create
);
router.get("/list", list);
router.patch(
  "/edit/:id",
  [
    check("name", "Email is required").not().isEmpty(),
    check("phone", "Phone number is required").isMobilePhone(),
    check("email", "Email is required").isEmail(),
    check("role", "Role is required").isIn(["admin", "seller"]),
    check("address", "Address is required").not().isEmpty(),
    check("status", "Status is required").isIn(["active", "inactive"]),
    check("commission", "Commission is required").isNumeric(),
  ],
  edit
);
router.put("/toggleStatus/:id", toggleStatus);
router.get("/generateResetPasswordLink/:id", generateResetPasswordLink);
router.delete("/:id", deleteUser);

module.exports = router;
