const router = require("express").Router();

const { check } = require("express-validator");
const {
  create,
  list,
  details,
  deleteSale,
} = require("../../controllers/admin/salesController");

router.get("/list", list);

router.post(
  "/create",
  [
    check("customerName", "Customer name is required").not().isEmpty(),
    check("user", "User is required").not().isEmpty(),
    check("products", "Products is required")
      .isArray()
      .withMessage("Products must be an array"),
    check("products.*.product", "Product name is required").notEmpty(),
    check("products.*.variant", "Product variant is required").notEmpty(),
    check("products.*.quantity", "Product quantity is required").notEmpty(),
    check("products.*.price", "Product price is required").notEmpty(),
    check("products.*.extras")
      .isArray()
      .withMessage("Extra's must be an array")
      .optional(),
    check("products.*.extras.*.name", "Product name is required").notEmpty(),
    check("products.*.extras.*.price", "Product price is required").notEmpty(),
    check(
      "products.*.extras.*.quantity",
      "Product quantity is required"
    ).notEmpty(),
    check("discount", "Discount is required")
      .isNumeric()
      .withMessage("Discount must be a number"),
  ],
  create
);
router.get("/:id", details);
router.delete("/:id", deleteSale);

module.exports = router;
